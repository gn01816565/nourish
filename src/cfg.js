/* 啾啾日常 ChickaDay — 配置資料（純 data，無閉包）
 * 從 game.js 抽出，便於改數值不必動邏輯。
 *
 * randomEvents.pool[].apply 用 string id（"coin_drop" 等），game.js 會 dispatch 到實作。
 * 改數值請依 GDD §11 平衡參數，必要時同步更新 docs/gdd.md。
 */
(function () {
  "use strict";

  const CFG = {
    save: { key: "nourish.save.v1", schemaVersion: 1, autosaveMs: 30 * 1000 },
    // UX timing constants (iter#115 ex-game.js).
    timing: {
      installBannerDelayMs: 5 * 60 * 1000,   // banner shown after 5 min play
      notifyCooldownMs:     30 * 60 * 1000,  // 30 min between critical-stat notifications
      particleCap:          30,              // max concurrent .particle elements per .stage
    },
    decay: {
      online:  { hunger: -0.40, mood: -0.25, clean: -0.15, energy: -0.30 },
      offline: { hunger: -0.20, mood: -0.15, clean: -0.10, energy: +0.30 },
      energySleep: +0.50,
      offlineCapHours: 12,
    },
    thresholds: { high: 70, mid: 40, low: 20 },
    growth: {
      hungerHighBonus: 1.0, moodHighBonus: 1.5, cleanHighBonus: 0.5, energyHighBonus: 0.5,
      perfectBonus: 2.0,
      hungerLowPenalty: -1.0, moodLowPenalty: -1.5,
      interactionScore: 5,
      offline24hPenalty: -50,
    },
    stages: {
      egg:    { duration: 6  * 3600 * 1000, scoreToEvolve: 30,   next: "chick"  },
      chick:  { duration: 24 * 3600 * 1000, scoreToEvolve: 200,  next: "junior" },
      junior: { duration: 48 * 3600 * 1000, scoreToEvolve: 600,  next: "adult"  },
      adult:  { duration: Infinity,         scoreToEvolve: 1500, next: null     },
    },
    // Trait → final form progression display (sectionPet in settings).
    // `key` must match state.pet.traits.<key>; `round` true for noisy float
    // counters that update sub-second. Adding a v0.3 evolution branch is a
    // cfg edit only — game.js stays untouched.
    traitsDisplay: [
      { key:"fatPoints",            icon:"🥯", label:"肥胖點數", cap:10,   form:"胖雞",   round:false },
      { key:"battlePoints",         icon:"💪", label:"活力點數", cap:30,   form:"元氣雞", round:false },
      { key:"intelligencePoints",   icon:"🧩", label:"智慧點數", cap:30,   form:"智慧雞", round:false },
      { key:"singCount",            icon:"🎤", label:"唱歌次數", cap:20,   form:"歌姬雞", round:false },
      { key:"lowMoodMinutes",       icon:"😢", label:"低落分鐘", cap:720,  form:"醜雞",   round:true  },
      { key:"perfectStreakMinutes", icon:"✨", label:"幸福連續", cap:1440, form:"神雞",   round:true  },
      { key:"feedCount",            icon:"🍰", label:"美食點數", cap:60,   form:"美食家雞", round:false },
      { key:"eventsCaught",         icon:"🗺️", label:"探險點數", cap:25,   form:"探險家雞", round:false },
      { key:"petCount",             icon:"🤍", label:"依戀點數", cap:50,   form:"暖心雞",   round:false },
    ],
    interactions: {
      feed_basic:  { hunger:+25, mood:+2,  clean:-3,  energy:0,   cost:0,  cd:30,  unlock:"egg",    labelKey:"interaction.feed_basic", label:"基礎飼料", icon:"🥣", free:true },
      feed_corn:   { hunger:+35, mood:+5,  clean:-3,  energy:+5,  cost:5,  cd:60,  unlock:"chick",  labelKey:"interaction.feed_corn", label:"玉米粒",   icon:"🌽" },
      feed_berry:  { hunger:+20, mood:+15, clean:0,   energy:+5,  cost:10, cd:60,  unlock:"chick",  labelKey:"interaction.feed_berry", label:"莓果",     icon:"🍓" },
      feed_worm:   { hunger:+40, mood:+10, clean:-8,  energy:+10, cost:8,  cd:90,  unlock:"junior", labelKey:"interaction.feed_worm", label:"小蟲蟲",   icon:"🪱" },
      feed_cake:   { hunger:+50, mood:+25, clean:-10, energy:0,   cost:25, cd:300, unlock:"adult",  labelKey:"interaction.feed_cake", label:"蛋糕",     icon:"🎂", fatPoints:1 },

      play_ball:   { mood:+15, energy:-10, clean:-5,  cost:3,  cd:120, unlock:"chick",  labelKey:"interaction.play_ball", label:"追逐毛球", icon:"⚽" },
      play_toy:    { mood:+20, energy:-15, clean:-3,  cost:5,  cd:180, unlock:"junior", labelKey:"interaction.play_toy", label:"玩具蟲蟲", icon:"🧸" },
      play_punch:  { mood:+25, energy:-25, clean:-10, cost:8,  cd:300, unlock:"junior", labelKey:"interaction.play_punch", label:"動感節拍", icon:"💃", battlePoints:3 },
      play_puzzle: { mood:+18, energy:-8,  clean:0,   cost:6,  cd:240, unlock:"adult",  labelKey:"interaction.play_puzzle", label:"思考拼圖", icon:"🧩", intelligencePoints:2 },
      play_sing:   { mood:+30, energy:-15, clean:0,   cost:10, cd:360, unlock:"adult",  labelKey:"interaction.play_sing", label:"唱歌比賽", icon:"🎤", singCount:1 },

      bath:        { clean:+60, mood:+5,   energy:-5, cost:3, cd:600, unlock:"chick",  labelKey:"interaction.bath", label:"洗澡",     icon:"🛁" },
      pet_head:    { mood:+3,   cost:0, cd:30,  unlock:"egg",   labelKey:"interaction.pet_head", label:"摸頭",     icon:"✋" },
      pet_belly:   { mood:+5,   cost:0, cd:60,  unlock:"chick", labelKey:"interaction.pet_belly", label:"摸肚子",   icon:"🤲", chuckle:0.10 },
      talk:        { mood:+2,   cost:0, cd:20,  unlock:"egg",   labelKey:"interaction.talk", label:"對話",     icon:"💬" },
    },
    // Menu groupings driven by data so adding a v0.3 category (e.g. grooming)
    // is a cfg edit only — no game.js change. Order in `items` is the player-
    // facing display order, not the cfg.interactions definition order.
    interactionMenus: {
      feed: { title: "🍗 餵食", items: ["feed_basic", "feed_corn", "feed_berry", "feed_worm", "feed_cake"] },
      play: { title: "🎮 玩耍", items: ["play_ball", "play_toy", "play_punch", "play_puzzle", "play_sing"] },
      pet:  { title: "💝 互動", items: ["pet_head", "pet_belly", "talk"] },
    },
    achievements: {
      first_hatch:    { icon:"🐣", labelKey:"ach.first_hatch", label:"破殼而出",   descKey:"achdesc.first_hatch", desc:"孵出第一隻雛雞" },
      first_evolve:   { icon:"🎉", labelKey:"ach.first_evolve", label:"成年禮",     descKey:"achdesc.first_evolve", desc:"養出第一隻成雞" },
      first_feed:     { icon:"🍗", labelKey:"ach.first_feed", label:"初次餵食",   descKey:"achdesc.first_feed", desc:"餵食 1 次" },
      feed_50:        { icon:"🥧", labelKey:"ach.feed_50", label:"餵食達人",   descKey:"achdesc.feed_50", desc:"累積餵食 50 次" },
      bath_10:        { icon:"🧼", labelKey:"ach.bath_10", label:"愛乾淨",     descKey:"achdesc.bath_10", desc:"累積洗澡 10 次" },
      pet_50:         { icon:"💝", labelKey:"ach.pet_50", label:"親密夥伴",   descKey:"achdesc.pet_50", desc:"愛撫 50 次" },
      streak_7:       { icon:"🔥", labelKey:"ach.streak_7", label:"一週不離",   descKey:"achdesc.streak_7", desc:"連續登入 7 天" },
      streak_30:      { icon:"💎", labelKey:"ach.streak_30", label:"鐵粉",       descKey:"achdesc.streak_30", desc:"連續登入 30 天" },
      collect_3:      { icon:"📖", labelKey:"ach.collect_3", label:"圖鑑學徒",   descKey:"achdesc.collect_3", desc:"收集 3 種終態" },
      collect_5:      { icon:"📚", labelKey:"ach.collect_5", label:"圖鑑專家",   descKey:"achdesc.collect_5", desc:"收集 5 種終態" },
      collect_all:    { icon:"🏆", labelKey:"ach.collect_all", label:"圖鑑大師",   descKey:"achdesc.collect_all", desc:"收集全部 10 種終態" },
      form_divine:    { icon:"✨", labelKey:"ach.form_divine", label:"天使降臨",   descKey:"achdesc.form_divine", desc:"養出天使雞" },
      form_diva:      { icon:"🎤", labelKey:"ach.form_diva", label:"超新星",     descKey:"achdesc.form_diva", desc:"養出歌姬雞" },
      form_fighter:   { icon:"💪", labelKey:"ach.form_fighter", label:"元氣之星",   descKey:"achdesc.form_fighter", desc:"養出元氣雞" },
      form_sage:      { icon:"🧠", labelKey:"ach.form_sage", label:"智者",       descKey:"achdesc.form_sage", desc:"養出智慧雞" },
      form_gourmet:   { icon:"🍰", labelKey:"ach.form_gourmet", label:"美食評鑑家", descKey:"achdesc.form_gourmet", desc:"養出美食家雞" },
      form_explorer:  { icon:"🗺️", labelKey:"ach.form_explorer", label:"小小探險家", descKey:"achdesc.form_explorer", desc:"養出探險家雞" },
      form_warmheart: { icon:"🤍", labelKey:"ach.form_warmheart", label:"暖心夥伴", descKey:"achdesc.form_warmheart", desc:"養出暖心雞" },
      star_caught:    { icon:"⭐", labelKey:"ach.star_caught", label:"幸運星",     descKey:"achdesc.star_caught", desc:"接住流星事件" },
      rich:           { icon:"💰", labelKey:"ach.rich", label:"小富翁",     descKey:"achdesc.rich", desc:"累積飼料幣 500" },
      perfect_day:    { icon:"🌟", labelKey:"ach.perfect_day", label:"完美的一天", descKey:"achdesc.perfect_day", desc:"四項數值同時 >70 持續 30 分" },
      dressup_first:  { icon:"🎀", labelKey:"ach.dressup_first", label:"小裝扮家",   descKey:"achdesc.dressup_first", desc:"購入第一件飾品" },
      dressup_set:    { icon:"✨", labelKey:"ach.dressup_set", label:"全套搭配",   descKey:"achdesc.dressup_set", desc:"同時配戴頭飾 + 項鍊 + 翅膀" },
      dressup_collector: { icon:"💎", labelKey:"ach.dressup_collector", label:"衣櫥達人", descKey:"achdesc.dressup_collector", desc:"擁有全部飾品" },
      elder_week:     { icon:"🌅", labelKey:"ach.elder_week", label:"相伴一週",   descKey:"achdesc.elder_week", desc:"成雞陪伴 7 天" },
      elder_month:    { icon:"💖", labelKey:"ach.elder_month", label:"終生伴侶",   descKey:"achdesc.elder_month", desc:"成雞陪伴 30 天" },
      face_first:     { icon:"🕶️", labelKey:"ach.face_first", label:"Cool Cat",   descKey:"achdesc.face_first", desc:"購入第一件臉部飾品" },
      dressup_full:   { icon:"💯", labelKey:"ach.dressup_full", label:"全副武裝",   descKey:"achdesc.dressup_full", desc:"同時配戴頭飾、臉部、項鍊、翅膀 4 種 slot" },
      wants_10:       { icon:"🥰", labelKey:"ach.wants_10", label:"心有靈犀",   descKey:"achdesc.wants_10", desc:"滿足 10 個願望" },
      wants_50:       { icon:"💞", labelKey:"ach.wants_50", label:"最佳搭檔",   descKey:"achdesc.wants_50", desc:"滿足 50 個願望" },
      events_100:     { icon:"🎲", labelKey:"ach.events_100", label:"幸運兒",     descKey:"achdesc.events_100", desc:"接住 100 個隨機事件" },
      seasonal_3:     { icon:"🎏", labelKey:"ach.seasonal_3", label:"節日通",     descKey:"achdesc.seasonal_3", desc:"參與 3 種不同季節活動" },
      master_player:  { icon:"🎓", labelKey:"ach.master_player", label:"啾啾日常大師", descKey:"achdesc.master_player", desc:"達成 25 條成就" },
    },
    wants: {
      lifetimeMs: 5 * 60 * 1000,
      spawnIntervalMs: 90 * 1000,
      spawnChance: 0.18,
      cooldownMs: 8 * 60 * 1000,
      // text → textKey i18n 替換（iter#120）：spawnWant 解析 textKey 為當前 locale 字串，
      // text 保留為 fallback（safety + 舊版相容）
      pool: [
        { id:"want_basic",  needs:"feed_basic", stage:"chick",  textKey:"want.basic",  text:"想吃飯…",   icon:"🥣" },
        { id:"want_corn",   needs:"feed_corn",  stage:"chick",  textKey:"want.corn",   text:"想吃玉米~", icon:"🌽" },
        { id:"want_berry",  needs:"feed_berry", stage:"chick",  textKey:"want.berry",  text:"想吃莓果~", icon:"🍓" },
        { id:"want_worm",   needs:"feed_worm",  stage:"junior", textKey:"want.worm",   text:"想吃小蟲蟲", icon:"🪱" },
        { id:"want_cake",   needs:"feed_cake",  stage:"adult",  textKey:"want.cake",   text:"想吃蛋糕~", icon:"🎂" },
        { id:"want_bath",   needs:"bath",       stage:"chick",  textKey:"want.bath",   text:"想洗澡…",   icon:"🛁" },
        { id:"want_pat",    needs:"pet_head",   stage:"egg",    textKey:"want.pat",    text:"想被摸頭~", icon:"✋" },
        { id:"want_belly",  needs:"pet_belly",  stage:"chick",  textKey:"want.belly",  text:"想被摸肚子", icon:"🤲" },
        { id:"want_play",   needs:"play_ball",  stage:"chick",  textKey:"want.play",   text:"想玩球！",  icon:"⚽" },
        { id:"want_toy",    needs:"play_toy",   stage:"junior", textKey:"want.toy",    text:"想玩玩具！", icon:"🧸" },
        { id:"want_punch",  needs:"play_punch", stage:"junior", textKey:"want.punch",  text:"想跳一下！", icon:"💃" },
        { id:"want_puzzle", needs:"play_puzzle",stage:"adult",  textKey:"want.puzzle", text:"想動腦~",   icon:"🧩" },
        { id:"want_sing",   needs:"play_sing",  stage:"adult",  textKey:"want.sing",   text:"想唱歌！",  icon:"🎤" },
        { id:"want_talk",   needs:"talk",       stage:"chick",  textKey:"want.talk",   text:"想聊天~",   icon:"💬" },
      ],
      reward: { mood: 7, coin: 12, growth: 8 },
    },
    // Seasonal pool — events that only spawn within a date range. Checked
    // alongside the regular pool by maybeSpawnEvent. dateRange is inclusive,
    // year-agnostic (MM-DD), supports wrapping (e.g. winter spans Dec-Feb).
    seasonalEvents: {
      pool: [
        {
          id:"sakura",
          art:"assets/images/event-sakura.png",
          weight:25, // higher than regular events; seasonal is a treat
          label:"櫻花飄落",
          apply:"sakura",
          applyEffects:{ stats:{mood:18, clean:5}, coin:10, coinReason:"賞櫻" },
          applyToastKey:"seasonal.sakura",
          applyToast:"🌸 花瓣飄到啾啾頭上~",
          dateRange: { from: "03-20", to: "05-10" },
        },
        {
          id:"valentine",
          art:"assets/images/event-valentine.png",
          weight:30,
          label:"情人節愛心",
          apply:"valentine",
          applyEffects:{ stats:{mood:25}, coin:20, coinReason:"情人節" },
          applyToastKey:"seasonal.valentine",
          applyToast:"🌹 啾啾收到一束愛心！",
          applyToastStyle:"gold",
          dateRange: { from: "02-12", to: "02-15" },
        },
        {
          id:"summer_breeze",
          art:"assets/images/event-summer.png",
          weight:25,
          label:"夏日涼風",
          apply:"summer_breeze",
          applyEffects:{ stats:{energy:20, mood:8} },
          applyToastKey:"seasonal.summer_breeze",
          applyToast:"🌊 夏日涼風~ 好舒服",
          dateRange: { from: "07-01", to: "08-31" },
        },
        {
          id:"mooncake",
          art:"assets/images/event-mooncake.png",
          weight:25,
          label:"月餅",
          apply:"mooncake",
          applyEffects:{ stats:{hunger:30, mood:10} },
          applyToastKey:"seasonal.mooncake",
          applyToast:"🥮 月餅好甜~",
          dateRange: { from: "09-10", to: "09-25" },
        },
        {
          id:"halloween",
          art:"assets/images/event-halloween.png",
          weight:25,
          label:"萬聖節糖果",
          apply:"halloween",
          applyEffects:{ stats:{mood:10}, coin:30, coinReason:"搗蛋" },
          applyToastKey:"seasonal.halloween",
          applyToast:"🎃 不給糖就搗蛋！",
          applyToastStyle:"gold",
          dateRange: { from: "10-25", to: "11-01" },
        },
        {
          id:"xmas",
          art:"assets/images/event-xmas.png",
          weight:30,
          label:"聖誕禮物",
          apply:"xmas",
          applyEffects:{ stats:{mood:15, hunger:10}, coin:50, coinReason:"聖誕禮物" },
          applyToastKey:"seasonal.xmas",
          applyToast:"🎁 聖誕快樂！",
          applyToastStyle:"gold",
          dateRange: { from: "12-20", to: "12-26" },
        },
        {
          id:"newyear",
          art:"assets/svg/event-newyear.svg",
          weight:30,
          label:"跨年煙火",
          apply:"newyear",
          applyEffects:{ stats:{mood:20, energy:10}, coin:40, coinReason:"跨年" },
          applyToastKey:"seasonal.newyear",
          applyToast:"🎆 新年快樂！願你今年也順利~",
          applyToastStyle:"gold",
          dateRange: { from: "12-31", to: "01-03" },
        },
        {
          id:"zongzi",
          art:"assets/svg/event-zongzi.svg",
          weight:25,
          label:"端午粽子",
          apply:"zongzi",
          applyEffects:{ stats:{hunger:25, mood:10}, coin:15, coinReason:"端午" },
          applyToastKey:"seasonal.zongzi",
          applyToast:"🥟 粽子真香！配上桃紅緞帶~",
          dateRange: { from: "05-30", to: "06-09" },
        },
        // iter#174: Mother's Day window (5 月第二週前後 5 天) — 既有 sakura 範圍 03-20~05-10 涵蓋日期但不點題；
        // carnation 是母親節 iconic 花卉，narrow window weight 30 讓它感覺特別
        {
          id:"carnation",
          art:"assets/svg/event-carnation.svg",
          weight:30,
          label:"康乃馨",
          apply:"carnation",
          applyEffects:{ stats:{mood:22, clean:5}, coin:20, coinReason:"母親節祝福" },
          applyToastKey:"seasonal.carnation",
          applyToast:"🌷 收到一束康乃馨~ 願你被愛環繞",
          applyToastStyle:"gold",
          dateRange: { from: "05-08", to: "05-12" },
        },
        // iter#175: Pride Month — 6 月整月 window，TA 友善色彩多元 + 粉嫩 palette 軟化（不用標準 rainbow 色，
        // 改用 7 色「粉系 rainbow」對齊 CLAUDE.md 設計約束）；既有 regular rainbow event 是 atmospheric，這個是節日 high-tier
        {
          id:"rainbow_heart",
          art:"assets/svg/event-rainbow-heart.svg",
          weight:25,
          label:"驕傲彩虹心",
          apply:"rainbow_heart",
          applyEffects:{ stats:{mood:20, clean:5, energy:5}, coin:18, coinReason:"驕傲月" },
          applyToastKey:"seasonal.rainbow_heart",
          applyToast:"🌈💖 一顆驕傲的彩虹愛心~",
          applyToastStyle:"gold",
          dateRange: { from: "06-01", to: "06-30" },
        },
        // iter#181: 春節 / 農曆新年 — 2026 LNY 落 02-17，window 02-16~02-22 一週；TA 主場（華語圈）必有節日
        // 紅包 = 高 coin 驚喜，是 valentine（02-12~02-15）後接力的春節篇章
        {
          id:"redenvelope",
          art:"assets/svg/event-redenvelope.svg",
          weight:30,
          label:"紅包",
          apply:"redenvelope",
          applyEffects:{ stats:{mood:25, hunger:10}, coin:50, coinReason:"恭喜發財" },
          applyToastKey:"seasonal.redenvelope",
          applyToast:"🧧 紅包到！恭喜發財~",
          applyToastStyle:"gold",
          dateRange: { from: "02-16", to: "02-22" },
        },
        // iter#185: 兒童節 — TW 04-04 固定日，5 天 window；填補 4 月空缺（既有 sakura 03-20~05-10 涵蓋日期但不點題）
        // 風車是台灣兒童節 iconic 童玩，輕快 + 粉藍 palette 對齊 cottagecore TA
        {
          id:"pinwheel",
          art:"assets/svg/event-pinwheel.svg",
          weight:25,
          label:"兒童節風車",
          apply:"pinwheel",
          applyEffects:{ stats:{mood:18, energy:10}, coin:12, coinReason:"兒童節" },
          applyToastKey:"seasonal.pinwheel",
          applyToast:"🎏 風車轉啊轉~ 童心未泯",
          applyToastStyle:"gold",
          dateRange: { from: "04-01", to: "04-05" },
        },
        // iter#209 boho seasonal — 夏日野餐墊（boho 軸首 seasonal，7 月 narrow window；既有 summer_breeze 涵蓋整 7-8 月但不點題）
        // 野餐 motif 是 cottagecore-boho 主流 pinterest aesthetic（gingham 紅白格紋 + 編織籃 + 戶外用餐）
        {
          id:"picnic_blanket",
          art:"assets/svg/event-picnic-blanket.svg",
          weight:25,
          label:"夏日野餐墊",
          apply:"picnic_blanket",
          applyEffects:{ stats:{mood:20, hunger:12, energy:5}, coin:15, coinReason:"夏日野餐" },
          applyToastKey:"seasonal.picnic_blanket",
          applyToast:"🧺 攤開野餐墊~ 夏日午後好滿足",
          applyToastStyle:"gold",
          dateRange: { from: "07-13", to: "07-19" },
        },
        // iter#211 智慧軸首 seasonal — TW 教師節 09-28 固定日，7 天 window（含中秋 mooncake 09-25 結束後接力）
        // 文具組（筆記本 / 鉛筆 / 墨水 / 蘋果）對齊智慧軸 sage / book / message_bottle 學術氛圍
        {
          id:"stationery_set",
          art:"assets/svg/event-stationery-set.svg",
          weight:25,
          label:"教師節文具",
          apply:"stationery_set",
          applyEffects:{ stats:{mood:18, energy:8, clean:4}, coin:18, coinReason:"教師節" },
          applyToastKey:"seasonal.stationery_set",
          applyToast:"📓 收到一組嶄新文具~ 知識的禮物",
          applyToastStyle:"gold",
          dateRange: { from: "09-26", to: "10-02" },
        },
        // iter#212 balletcore 軸首 seasonal — UNESCO 國際舞蹈節 04-29 固定日，7 天 window（在 sakura 03-20~05-10 期間 narrow）
        // 三層 tutu 裙 + 蕾絲 corset + 玫瑰花 — 對齊 diva form + ribbon_tie / rose_bouquet / pointe_shoe 表演敘事
        {
          id:"dance_tutu",
          art:"assets/svg/event-dance-tutu.svg",
          weight:25,
          label:"舞蹈節 tutu",
          apply:"dance_tutu",
          applyEffects:{ stats:{mood:22, energy:10}, coin:15, coinReason:"舞蹈節" },
          applyToastKey:"seasonal.dance_tutu",
          applyToast:"🩰 嶄新的 tutu 裙~ 上台前的儀式感",
          applyToastStyle:"gold",
          dateRange: { from: "04-26", to: "05-02" },
        },
        // iter#213 fairycore 軸首 seasonal — 冬至 / Yule 12-21~12-22 anchor，4 天 window（11 月底以後到 xmas 之前的縫隙填補）
        // 星座 / 雪花 / 月光 — 對齊 divine + dewdrop + moonlight fairycore 仙氣 narrative，TA 軟化 palette（粉色 halo + 奶油月）
        {
          id:"winter_starlight",
          art:"assets/svg/event-winter-starlight.svg",
          weight:25,
          label:"冬至星空",
          apply:"winter_starlight",
          applyEffects:{ stats:{mood:20, clean:8, energy:6}, coin:12, coinReason:"冬至星願" },
          applyToastKey:"seasonal.winter_starlight",
          applyToast:"❄ 冬至星空~ 許下你的冬日願望",
          applyToastStyle:"gold",
          dateRange: { from: "12-19", to: "12-22" },
        },
        // iter#214 cleangirl 軸首 seasonal — World Wellness Day 06-13 anchor，7 天 window（在 zongzi 05-30~06-09 之後 / Pride 整月期間）
        // 浴鹽罐 + 薰衣草 sprig — 對齊 healthy form + bubble + towel cleangirl spa narrative
        {
          id:"spa_salts",
          art:"assets/svg/event-spa-salts.svg",
          weight:25,
          label:"SPA 浴鹽",
          apply:"spa_salts",
          applyEffects:{ stats:{clean:18, mood:12, energy:8}, coin:10, coinReason:"Wellness Day" },
          applyToastKey:"seasonal.spa_salts",
          applyToast:"🧖‍♀️ 一罐玫瑰浴鹽~ Wellness 寵愛自己",
          applyToastStyle:"gold",
          dateRange: { from: "06-10", to: "06-16" },
        },
      ],
    },
    randomEvents: {
      // pool[].apply 是 string id；game.js 的 RANDOM_EVENT_APPLIES dispatch 表會查到實作
      spawnIntervalMs: 60 * 1000,
      spawnChance: 0.30,
      lifetimeMs: 90 * 1000,
      pool: [
        // applyEffects + applyToast read by runEventApply for trivial events.
        // coin_drop has random amount → kept in RANDOM_EVENT_APPLIES dispatch.
        { id:"coin_drop", art:"assets/images/event-coin.png",      weight:55, label:"撿到飼料幣", apply:"coin_drop" },
        { id:"herb",      art:"assets/images/event-herb.png",      weight:18, label:"神祕草藥",   apply:"herb",      applyEffects:{ stats:{hunger:30, mood:5, clean:5, energy:30} }, applyToastKey:"event.herb",      applyToast:"🌿 神祕草藥！全身舒暢" },
        { id:"butterfly", art:"assets/images/event-butterfly.png", weight:14, label:"蝴蝶飛過",   apply:"butterfly", applyEffects:{ stats:{mood:10} },                                applyToastKey:"event.butterfly", applyToast:"🦋 蝴蝶讓啾啾很開心" },
        { id:"fly",       art:"assets/images/event-fly.png",       weight:10, label:"趕走果蠅",   apply:"fly",       applyEffects:{ stats:{clean:5, mood:3} },                       applyToastKey:"event.fly",       applyToast:"趕走果蠅！清潔 +5" },
        { id:"star",      art:"assets/images/event-star.png",      weight:3,  label:"神秘流星",   apply:"star",      applyEffects:{ stats:{hunger:10, mood:10, clean:10, energy:10}, coin:50, coinReason:"流星祝福" }, applyToastKey:"event.star",  applyToast:"⭐ 流星許願！全屬性 +10", applyToastStyle:"gold" },
        { id:"rainbow",   art:"assets/images/event-rainbow.png",     weight:12, label:"彩虹出現",   apply:"rainbow",   applyEffects:{ stats:{mood:12, hunger:5, clean:5, energy:5} },     applyToastKey:"event.rainbow",  applyToast:"🌈 彩虹出現！全身充滿希望" },
        { id:"candy",     art:"assets/images/event-candy.png",       weight:8,  label:"糖果",       apply:"candy",     applyEffects:{ stats:{mood:18, hunger:8}, coin:5, coinReason:"糖果" },                            applyToastKey:"event.candy",    applyToast:"🍭 甜甜的~ 心情大好" },
        { id:"bubble",    art:"assets/svg/event-bubble.svg",         weight:9,  label:"肥皂泡",     apply:"bubble",    applyEffects:{ stats:{clean:10, mood:8} },                                                          applyToastKey:"event.bubble",   applyToast:"🫧 肥皂泡飄飄~ 清潔 +10 / 心情 +8" },
        { id:"petal",     art:"assets/svg/event-petal.svg",          weight:8,  label:"花瓣飄落",   apply:"petal",     applyEffects:{ stats:{mood:14, clean:3} },                                                          applyToastKey:"event.petal",    applyToast:"🌸 粉色花瓣飄到啾啾身上~" },
        { id:"mushroom",  art:"assets/svg/event-mushroom.svg",       weight:7,  label:"小蘑菇",     apply:"mushroom",  applyEffects:{ stats:{mood:10, energy:5}, coin:8, coinReason:"撿蘑菇" },                                applyToastKey:"event.mushroom", applyToast:"🍄 撿到一朵小蘑菇~" },
        { id:"tea",       art:"assets/svg/event-tea.svg",            weight:6,  label:"下午茶",     apply:"tea",       applyEffects:{ stats:{mood:12, energy:8, hunger:5} },                                              applyToastKey:"event.tea",      applyToast:"🫖 一杯熱熱的下午茶~" },
        // iter#161 美食家軸 event 層補完（搭 iter#132 tea / iter#156 gourmet form / iter#159 chef_hat）
        { id:"macaron",   art:"assets/svg/event-macaron.svg",        weight:7,  label:"馬卡龍",     apply:"macaron",   applyEffects:{ stats:{mood:14, hunger:6}, coin:5, coinReason:"路過糕點店" },                       applyToastKey:"event.macaron",  applyToast:"🧁 撿到一個粉色馬卡龍~" },
        // iter#168 智慧軸 event 層落地（對標 sage 終態 — 是輕量 atmospheric event，不能加 trait 但讓玩家感覺角色「有讀書時刻」）
        { id:"book",      art:"assets/svg/event-book.svg",           weight:6,  label:"翻書頁",     apply:"book",      applyEffects:{ stats:{mood:8, energy:5} },                                                          applyToastKey:"event.book",     applyToast:"📖 一本好書，心靈被填滿~" },
        // iter#169 balletcore 軸 event 層落地（對標 diva 終態 + ribbon_tie 配件）— 「舞台後台收花束」氛圍 event
        { id:"rose_bouquet", art:"assets/svg/event-rose-bouquet.svg", weight:5, label:"舞台花束",   apply:"rose_bouquet", applyEffects:{ stats:{mood:16, clean:3}, coin:8, coinReason:"觀眾打賞" },                       applyToastKey:"event.rose_bouquet", applyToast:"💐 一束玫瑰送上來~" },
        // iter#171 fairycore 軸 event 層落地（對標 divine 終態 + wings_fairy 配件）— 「葉上露珠」清新仙氣 event
        { id:"dewdrop",   art:"assets/svg/event-dewdrop.svg",        weight:6,  label:"葉上露珠",   apply:"dewdrop",   applyEffects:{ stats:{mood:10, clean:8} },                                                          applyToastKey:"event.dewdrop",  applyToast:"💧 葉上一顆透亮露珠~" },
        // iter#172 y2k 軸 event 層落地（對標 star_clip / cd_pendant 既有配件）— 像素愛心 + chromatic glitch，digital nostalgia event；完成 8 美學軸 event 層全覆蓋
        { id:"pixel_heart",art:"assets/svg/event-pixel-heart.svg",   weight:5,  label:"像素愛心",   apply:"pixel_heart", applyEffects:{ stats:{mood:14}, coin:6, coinReason:"老遊戲機掉幣" },                              applyToastKey:"event.pixel_heart", applyToast:"💖 一顆閃亮的像素愛心~" },
        // iter#198 cottagecore 補充：filler「種子粒」 — 小雞主場景的天然食物，跟 candy / mushroom 同 small-pickup 帶但語意更貼近寵物本體
        { id:"seed",      art:"assets/svg/event-seed.svg",           weight:9,  label:"灑落的種子",  apply:"seed",       applyEffects:{ stats:{hunger:12, mood:4} },                                                       applyToastKey:"event.seed",        applyToast:"🌾 撿到散落的小米粒~" },
        // iter#199 cleangirl 軸第二 event：軟綿綿毛巾 — 跟既有 bubble 區隔（bubble = 洗澡中泡泡 / towel = 洗完後的暖呼呼）
        { id:"towel",     art:"assets/svg/event-towel.svg",          weight:7,  label:"軟綿綿毛巾",  apply:"towel",      applyEffects:{ stats:{clean:14, mood:6} },                                                        applyToastKey:"event.towel",       applyToast:"🛁 暖暖的乾毛巾~ 全身舒服" },
        // iter#200 智慧軸第二 event：漂流瓶 — 跟既有 book 區隔（book = 讀書當下 / message-bottle = 遠方智慧 / 神祕緣分）；微 coin 5 暗示「字條中夾著」
        { id:"message_bottle", art:"assets/svg/event-message-bottle.svg", weight:5, label:"漂流瓶", apply:"message_bottle", applyEffects:{ stats:{mood:12, energy:6}, coin:5, coinReason:"瓶中字條" },                       applyToastKey:"event.message_bottle", applyToast:"📜 漂流瓶裡有給你的字條~" },
        // iter#201 balletcore 軸第二 event：足尖鞋 — 跟既有 rose_bouquet 區隔（rose_bouquet = 演出後收花 / pointe_shoe = 後台練功時刻）；無 coin 純 atmospheric
        { id:"pointe_shoe", art:"assets/svg/event-pointe-shoe.svg",       weight:6, label:"練舞時光", apply:"pointe_shoe", applyEffects:{ stats:{mood:10, energy:8} },                                                       applyToastKey:"event.pointe_shoe",    applyToast:"🩰 排練好的腳尖鞋~ 充滿力量" },
        // iter#202 fairycore 軸第二 event：月光 — 跟既有 dewdrop 區隔（dewdrop = 葉上自然清晨 / moonlight = 夜晚仙氣神祕）；palette 軟化處理（粉色暖光暈 + 奶油白月）對齊 TA「避免過冷」約束
        { id:"moonlight", art:"assets/svg/event-moonlight.svg",          weight:6, label:"月光灑落", apply:"moonlight",   applyEffects:{ stats:{mood:14, clean:5, energy:5} },                                              applyToastKey:"event.moonlight",       applyToast:"🌙 月光灑下~ 啾啾被柔光擁抱" },
        // iter#203 元氣軸第二 event：彩帶煙火 — 跟既有 rainbow 區隔（rainbow = 廣域 atmospheric / confetti_pop = 慶祝動感 burst）；coin 7 暗示「派對小費」
        { id:"confetti_pop", art:"assets/svg/event-confetti-pop.svg",    weight:5, label:"彩帶煙火", apply:"confetti_pop", applyEffects:{ stats:{mood:18, energy:6}, coin:7, coinReason:"派對驚喜" },                       applyToastKey:"event.confetti_pop",   applyToast:"🎉 砰！彩帶煙火爆出~" },
        // iter#206 boho 軸第二件（首 event）：曬乾香草束 — 對齊 fringe_ribbon (iter#205) earth-tone + handmade craft narrative；無 coin 純 atmospheric drying-rack 場景
        { id:"dried_herbs",  art:"assets/svg/event-dried-herbs.svg",     weight:7, label:"曬乾香草束", apply:"dried_herbs",   applyEffects:{ stats:{mood:10, clean:6, energy:4} },                                            applyToastKey:"event.dried_herbs",     applyToast:"🌿 風乾的香草束散發著療癒香氣~" },
      ],
    },
    economy: { dailyLogin: 30, evolveReward: 100, streak7: 50, streak30: 200, firstHatchBonus: 60 },
    welcomeBack: [
      { maxMs: 30*60*1000,            text: null /* silent */ },
      { maxMs: 3 *3600*1000,          textKey:"welcomeBack.tier1", text: "歡迎回來！咕咕～" },
      { maxMs: 8 *3600*1000,          textKey:"welcomeBack.tier2", text: "主人你回來了！我有點餓了" },
      { maxMs: 12*3600*1000,          textKey:"welcomeBack.tier3", text: "主人……我以為你不要我了……" },
      { maxMs: Infinity,              textKey:"welcomeBack.tier4", text: "主人！！我等了好久！", giveCoin: 20 },
    ],
    speech: {
      idle:        ["咕咕", "啾~", "嗯哼", "🌸", "✨", "嘎嘎", "(歪頭)"],
      hungry:      ["肚子餓了…", "想吃飯", "咕嚕咕嚕", "肚子在叫…", "好餓~"],
      veryHungry:  ["快餓死了…", "求餵食…", "肚子好痛"],
      sad:         ["不開心…", "陪我玩嘛", "嗚嗚", "好寂寞", "心情不好"],
      verySad:     ["主人是不是不愛我了…", "我做錯什麼了嗎", "嗚嗚嗚嗚"],
      dirty:       ["好癢…", "想洗澡", "渾身不對勁"],
      veryDirty:   ["臭臭…我自己都受不了", "求洗澡 QQ"],
      tired:       ["想睡覺…", "好累", "眼皮好重"],
      veryTired:   ["撐不住了…", "秒睡", "(打哈欠)", "好~睏…", "(蜷成一團)"],
      happy:       ["好幸福！", "嘿嘿~", "最喜歡主人了", "今天超棒！", "好開心~"],
      perfect:     ["在主人身邊真好~", "今天根本完美！", "覺得世界很美好", "啾啾最幸福了！"],
      morning:     ["早安~", "今天也要加油！", "陽光好溫暖", "新的一天！"],
      noon:        ["午安~", "肚子有點餓了", "好想小睡片刻"],
      evening:     ["夕陽好美", "今天過得好快", "傍晚的風好舒服"],
      night:       ["主人晚安~", "好睏…", "月亮好亮", "今天辛苦了"],
      lateNight:   ["主人還不睡嗎…", "(打哈欠)", "夜深了…"],
      stage_egg:    ["…?", "(蛋裡傳出微弱聲音)", "嗶...", "(輕輕晃動)", "...咕?"],
      stage_chick:  ["我會走路了！", "看那邊！看那邊！", "啾啾喜歡這裡~", "什麼都覺得新鮮"],
      stage_junior: ["翅膀變大了~", "我長大了！", "可以做更多事了", "覺得自己有點帥"],
      stage_adult:  ["已經是大雞了", "經驗豐富的鳥兒", "我看過很多事情了", "回想小時候…"],
      // Reflective lines unlocked after the pet has been adult for ~7 days.
      // GDD §10.3「老年互動」— gentle nostalgic companionship, not sad/morbid.
      elder:        ["跟你在一起好幸福~", "你還記得我們第一次見面嗎?", "我看著你也長大了一點", "好喜歡這樣的日常", "(輕輕靠著主人)", "謝謝你一直在", "再過幾年也要記得我喔~"],
      form_healthy: ["精神奕奕！", "標準帥氣！"],
      form_fatty:   ["再吃一點點就好…", "不胖不胖，是骨架大"],
      form_ugly:    ["其實這樣也滿酷的", "醜雞也有春天"],
      form_fighter: ["元氣滿滿~", "再蹦一下！", "活力 max！", "今天也跑跳跳~", "心情明亮亮~"],
      form_sage:    ["有趣的命題…", "讓我思考一下", "(若有所思)", "答案藏在風裡呢", "✦ 緩緩點頭 ✦"],
      form_diva:    ["♪~", "今晚的舞台屬於我", "鏡頭再給我一下~", "✨ 閃亮登場 ✨", "今天的造型怎麼樣？"],
      form_divine:  ["願平靜降臨於你", "(光暈閃爍)", "(羽毛微微發光)", "心如春日早晨~", "✦ 溫柔守護 ✦"],
      form_gourmet: ["今天的下午茶要配什麼呢？", "🍰 嗯～這個層次很有意思", "新菜單想試試看嗎？", "甜點要適量才優雅", "🥐 這個酥度剛剛好"],
      form_explorer:["今天去哪裡探險呢？", "🗺️ 角落還有沒撿過的小驚喜", "(整理背包中)", "✨ 看！我撿到的~", "外面的世界好大~"],
      form_warmheart:["再摸一下嘛~", "🤍 蜷在你身邊就好", "(輕輕靠著)", "今天也想要抱抱", "就這樣賴著不動 zzz~"],
      wantNag:     ["主人有看到我的願望嗎？", "拜託啦~", "求求你嘛", "(用期待的眼神看著主人)"],
      rich:        ["錢好像變多了~", "覺得我們可以買點什麼了！"],
      quirk:       ["(發呆)", "(整理羽毛)", "(看天空)", "(踱步)", "♪"],
      // Spoken once when handleDailyLogin detects a fresh calendar day.
      dailyGreet:  ["新的一天，又見面了~", "早安主人！", "今天有什麼計畫呢？", "你來了！我等好久~", "想你了~", "(蹭蹭)"],

      // Post-action contextual replies — pet responds specifically to what just
      // happened, instead of a generic "好開心~". Speech reaches before toast.
      action_feed_basic:  ["嗯嗯好吃~", "謝啦", "簡單也很好"],
      action_feed_corn:   ["玉米超讚！", "嘎嘣脆", "🌽✨"],
      action_feed_berry:  ["酸酸甜甜~", "莓果最棒！", "love~"],
      action_feed_worm:   ["蟲蟲！", "高蛋白！", "(滿足)"],
      action_feed_cake:   ["蛋糕！蛋糕！", "今天有派對！", "甜甜的!"],
      action_play_ball:   ["跑跑跑~", "再來再來！", "好玩！"],
      action_play_toy:    ["可愛玩具~", "嘿嘿"],
      action_play_punch:  ["蹦蹦蹦~", "再來再來！", "(動感模式)"],
      action_play_puzzle: ["讓我想想…", "啊我懂了！", "🧠"],
      action_play_sing:   ["♪~♫", "今晚我最閃！", "(站上舞台)"],
      action_bath:        ["好舒服~", "乾淨溜溜~", "(抖水珠)", "啾啾愛洗澡(才怪)"],
      action_pet_head:    ["嘿嘿~", "好喜歡這樣", "(瞇眼)"],
      action_pet_belly:   ["咯咯咯", "(笑出聲)", "癢癢的~"],
      action_talk:        ["嗯嗯！", "對啊對啊", "你說呢主人？"],
    },
    accessories: {
      // v0.3 裝扮系統。slot：hat（頭頂）/ face（臉部，v0.4 加）/ neck（脖子）/ wing（翅膀）。
      // 玩家用飼料幣解鎖；解鎖後永久擁有，可隨時切換。
      party_hat: { slot:"hat",  art:"assets/images/acc-party-hat.png", labelKey:"acc.party_hat", label:"派對帽",     icon:"🎉", price:100 },
      headband: { slot:"hat",  art:"assets/images/acc-headband.png", labelKey:"acc.headband", label:"蝴蝶髮帶",   icon:"🩷", price:50  },
      bow:      { slot:"hat",  art:"assets/images/acc-bow.png",      labelKey:"acc.bow", label:"粉紅蝴蝶結", icon:"🎀", price:120 },
      flower:   { slot:"hat",  art:"assets/images/acc-flower.png",   labelKey:"acc.flower", label:"粉色花環",   icon:"🌸", price:200 },
      crown:    { slot:"hat",  art:"assets/images/acc-crown.png",    labelKey:"acc.crown", label:"閃耀皇冠",   icon:"👑", price:500 },
      sunglasses: { slot:"face", art:"assets/images/acc-sunglasses.png", labelKey:"acc.sunglasses", label:"心形墨鏡", icon:"🕶️", price:180 },
      necklace: { slot:"neck", art:"assets/images/acc-necklace.png", labelKey:"acc.necklace", label:"珍珠項鍊",   icon:"📿", price:180 },
      scarf:    { slot:"neck", art:"assets/images/acc-scarf.png",    labelKey:"acc.scarf", label:"毛茸圍巾",   icon:"🧣", price:150 },
      wings:       { slot:"wing", art:"assets/images/acc-wings-angel.png", labelKey:"acc.wings", label:"夢幻翅膀", icon:"🪽", price:350 },
      wings_fairy: { slot:"wing", art:"assets/images/acc-wings-fairy.png", labelKey:"acc.wings_fairy", label:"彩虹翅膀", icon:"🌈", price:480 },
      // v0.3 cottagecore × coquette mix-and-match additions (iter#102):
      pin_butterfly: { slot:"hat",  art:"assets/images/acc-pin-butterfly.png", labelKey:"acc.pin_butterfly", label:"蝴蝶髮夾", icon:"🦋", price:90  },
      lace_collar:   { slot:"neck", art:"assets/svg/acc-lace-collar.svg",   labelKey:"acc.lace_collar", label:"蕾絲領片", icon:"🌷", price:140 },
      // v0.3 cleangirl axis (iter#103): minimal aesthetic, soft natural look.
      blush:         { slot:"face", art:"assets/images/acc-blush.png",       labelKey:"acc.blush", label:"自然腮紅", icon:"🌸", price:60  },
      // v0.3 balletcore axis (iter#110): ribbon under collar, ballet leotard vibe.
      ribbon_tie:    { slot:"neck", art:"assets/svg/acc-ribbon-tie.svg",    labelKey:"acc.ribbon_tie", label:"芭蕾蝴蝶結", icon:"🩰", price:110 },
      // v0.3 fairycore axis (iter#116): glittery star clip, dreamy whimsy vibe.
      star_clip:     { slot:"hat",  art:"assets/svg/acc-star-clip.svg",     labelKey:"acc.star_clip", label:"星星髮夾",   icon:"⭐", price:80  },
      // v0.3 y2k axis (iter#119): iridescent CD pendant, 2000s holographic vibe.
      cd_pendant:    { slot:"neck", art:"assets/images/acc-cd-pendant.png",  labelKey:"acc.cd_pendant", label:"鐳射光碟墜飾", icon:"💿", price:160 },
      // iter#159 美食家軸：呼應 gourmet 終態 + iter#132「下午茶」隨機事件
      chef_hat:      { slot:"hat",  art:"assets/images/acc-chef-hat.png",    labelKey:"acc.chef_hat", label:"粉粉廚師帽", icon:"👨‍🍳", price:200 },
      // iter#167 美食家軸續作：與 chef_hat 對偶的小品髮夾，cottagecore 草莓 motif
      strawberry_clip: { slot:"hat", art:"assets/svg/acc-strawberry-clip.svg", labelKey:"acc.strawberry_clip", label:"草莓髮夾", icon:"🍓", price:130 },
      // iter#168 智慧軸 accessory 層落地：sage 形容是「半月眼鏡」— 拆出來成獨立配件讓任何 form 都能戴
      glasses_thin:    { slot:"face", art:"assets/images/acc-glasses-thin.png", labelKey:"acc.glasses_thin",   label:"半月眼鏡", icon:"👓", price:150 },
      // iter#205 v0.4 新美學軸 boho 起手第一件：流蘇緞帶 — 編織 + 大地色 + 粉色軟化（per CLAUDE.md TA「avoid 過冷 / 過男性化」）
      fringe_ribbon:   { slot:"neck", art:"assets/svg/acc-fringe-ribbon.svg",  labelKey:"acc.fringe_ribbon",  label:"流蘇緞帶", icon:"🪢", price:170 },
      // iter#207 boho 軸第三件 — 草帽 + rust 帽帶 + 小雛菊；達 GDD §5.5 「軸 ≥ 3 件」成形門檻
      straw_hat:       { slot:"hat",  art:"assets/svg/acc-straw-hat.svg",      labelKey:"acc.straw_hat",      label:"波西米亞草帽", icon:"👒", price:220 },
    },
    // Stage display labels (egg / chick / junior / adult).
    stageLabels: { egg: "蛋", chick: "雛雞", junior: "幼雞", adult: "成雞" },
    // Final-form display copy (label + description shown in dex / share card).
    // Keys must match petArt.adult keys (cfg-schema invariant 8).
    finalForms: {
      healthy: { labelKey:"form.healthy.label", label: "健康成雞", descKey:"form.healthy.desc", desc: "毛色光亮、神采奕奕，是模範生雞。" },
      fatty:   { labelKey:"form.fatty.label",   label: "圓潤雞",   descKey:"form.fatty.desc",   desc: "圓滾滾很可愛，抱起來軟綿綿。" },
      ugly:    { labelKey:"form.ugly.label",    label: "迷因雞",   descKey:"form.ugly.desc",    desc: "毛亂亂的，但反而有種獨特的魅力，有自己的粉絲團。" },
      fighter: { labelKey:"form.fighter.label", label: "元氣雞",   descKey:"form.fighter.desc", desc: "粉色運動帶、活力滿點，跳跳活蹦的元氣派路線。" },
      sage:    { labelKey:"form.sage.label",    label: "智慧雞",   descKey:"form.sage.desc",    desc: "戴半月眼鏡、氣質溫柔，思考拼圖累積的智慧路線。" },
      diva:    { labelKey:"form.diva.label",    label: "歌姬雞",   descKey:"form.diva.desc",    desc: "彩虹尾羽配麥克風，唱歌唱出來的閃亮明星。" },
      divine:  { labelKey:"form.divine.label",  label: "天使雞",   descKey:"form.divine.desc",  desc: "粉金光環、純白羽毛，傳說中的天使存在。" },
      gourmet: { labelKey:"form.gourmet.label", label: "美食家雞", descKey:"form.gourmet.desc", desc: "戴著粉色廚師帽，對美食有獨到品味，從餵食累積中走出的下午茶系成雞。" },
      explorer:{ labelKey:"form.explorer.label", label: "探險家雞", descKey:"form.explorer.desc", desc: "好奇心爆棚！背包裡裝滿到處撿來的小蘑菇、花瓣、星星 — 是這片世界的小探險家。" },
      warmheart:{ labelKey:"form.warmheart.label", label: "暖心雞", descKey:"form.warmheart.desc", desc: "蜷在主人身邊就是最幸福的午後，有點懶懶的、總是想被摸頭 — 從互動累積中自然走出的暖心系。" },
    },
    petArt: {
      egg:    "assets/images/egg.png",
      egg2:   "assets/images/egg-cracked.png",
      chick:  "assets/images/chick-baby.png",
      junior: "assets/images/chick-young.png",
      adult: {
        healthy: "assets/images/chick-adult-healthy.png",
        fatty:   "assets/images/chick-adult-fat.png",
        ugly:    "assets/images/chick-adult-ugly.png",
        divine:  "assets/images/chick-adult-divine.png",
        fighter: "assets/images/chick-adult-fighter.png",
        sage:    "assets/images/chick-adult-sage.png",
        diva:    "assets/images/chick-adult-diva.png",
        gourmet: "assets/images/chick-adult-gourmet.png",
        explorer:"assets/images/chick-adult-explorer.png",
        warmheart:"assets/images/chick-adult-warmheart.png",
      },
    },
    moodArt: {
      happy: "assets/images/mood-happy.png",
      neutral: "assets/images/mood-neutral.png",
      sad: "assets/images/mood-sad.png",
      sleeping: "assets/images/mood-sleeping.png",
      dirty: "assets/images/mood-dirty.png",
    },
    backgrounds: {
      // Stage-based defaults (current logic in game.js:bgKey).
      coop:   { src:"assets/images/bg-coop.png",   stages:["egg","chick"],            label:"雞舍" },
      grass:  { src:"assets/images/bg-grass.png",  stages:["junior","adult"],         label:"草地" },
      // Time-of-day overlays (apply when stage is junior/adult and hour matches).
      // game.js can pick by hour: 5-9 grass / 10-15 grass / 16-18 sunset / 19-4 night.
      sunset: { src:"assets/images/bg-sunset.png", stages:["junior","adult"], hours:[16,17,18],     label:"夕陽" },
      night:  { src:"assets/images/bg-night.png",  stages:["junior","adult"], hours:[19,20,21,22,23,0,1,2,3,4], label:"月夜" },
      // Special weather / season variants (manual trigger or random event).
      rainy:  { src:"assets/images/bg-rainy.png",  stages:["junior","adult"], weather:"rain",  label:"彩虹雨" },
      snow:   { src:"assets/images/bg-snow.png",   stages:["junior","adult"], season:"winter", label:"雪天" },
    },
  };

  // Expose to global. game.js does `const CFG = window.NourishCFG;` at top.
  window.NourishCFG = CFG;
})();
