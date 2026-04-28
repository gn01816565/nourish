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
    interactions: {
      feed_basic:  { hunger:+25, mood:+2,  clean:-3,  energy:0,   cost:0,  cd:30,  unlock:"egg",    label:"基礎飼料", icon:"🥣", free:true },
      feed_corn:   { hunger:+35, mood:+5,  clean:-3,  energy:+5,  cost:5,  cd:60,  unlock:"chick",  label:"玉米粒",   icon:"🌽" },
      feed_berry:  { hunger:+20, mood:+15, clean:0,   energy:+5,  cost:10, cd:60,  unlock:"chick",  label:"莓果",     icon:"🍓" },
      feed_worm:   { hunger:+40, mood:+10, clean:-8,  energy:+10, cost:8,  cd:90,  unlock:"junior", label:"小蟲蟲",   icon:"🪱" },
      feed_cake:   { hunger:+50, mood:+25, clean:-10, energy:0,   cost:25, cd:300, unlock:"adult",  label:"蛋糕",     icon:"🎂", fatPoints:1 },

      play_ball:   { mood:+15, energy:-10, clean:-5,  cost:3,  cd:120, unlock:"chick",  label:"追逐毛球", icon:"⚽" },
      play_toy:    { mood:+20, energy:-15, clean:-3,  cost:5,  cd:180, unlock:"junior", label:"玩具蟲蟲", icon:"🧸" },
      play_punch:  { mood:+25, energy:-25, clean:-10, cost:8,  cd:300, unlock:"junior", label:"動感節拍", icon:"💃", battlePoints:3 },
      play_puzzle: { mood:+18, energy:-8,  clean:0,   cost:6,  cd:240, unlock:"adult",  label:"思考拼圖", icon:"🧩", intelligencePoints:2 },
      play_sing:   { mood:+30, energy:-15, clean:0,   cost:10, cd:360, unlock:"adult",  label:"唱歌比賽", icon:"🎤", singCount:1 },

      bath:        { clean:+60, mood:+5,   energy:-5, cost:3, cd:600, unlock:"chick",  label:"洗澡",     icon:"🛁" },
      pet_head:    { mood:+3,   cost:0, cd:30,  unlock:"egg",   label:"摸頭",     icon:"✋" },
      pet_belly:   { mood:+5,   cost:0, cd:60,  unlock:"chick", label:"摸肚子",   icon:"🤲", chuckle:0.10 },
      talk:        { mood:+2,   cost:0, cd:20,  unlock:"egg",   label:"對話",     icon:"💬" },
    },
    achievements: {
      first_hatch:    { icon:"🐣", label:"破殼而出",   desc:"孵出第一隻雛雞" },
      first_evolve:   { icon:"🎉", label:"成年禮",     desc:"養出第一隻成雞" },
      first_feed:     { icon:"🍗", label:"初次餵食",   desc:"餵食 1 次" },
      feed_50:        { icon:"🥧", label:"餵食達人",   desc:"累積餵食 50 次" },
      bath_10:        { icon:"🧼", label:"愛乾淨",     desc:"累積洗澡 10 次" },
      pet_50:         { icon:"💝", label:"親密夥伴",   desc:"愛撫 50 次" },
      streak_7:       { icon:"🔥", label:"一週不離",   desc:"連續登入 7 天" },
      streak_30:      { icon:"💎", label:"鐵粉",       desc:"連續登入 30 天" },
      collect_3:      { icon:"📖", label:"圖鑑學徒",   desc:"收集 3 種終態" },
      collect_5:      { icon:"📚", label:"圖鑑專家",   desc:"收集 5 種終態" },
      collect_all:    { icon:"🏆", label:"圖鑑大師",   desc:"收集全部 7 種終態" },
      form_divine:    { icon:"✨", label:"神之降臨",   desc:"養出神雞" },
      form_diva:      { icon:"🎤", label:"超新星",     desc:"養出歌姬雞" },
      form_fighter:   { icon:"💪", label:"元氣之星",   desc:"養出元氣雞" },
      form_sage:      { icon:"🧠", label:"智者",       desc:"養出智慧雞" },
      star_caught:    { icon:"⭐", label:"幸運星",     desc:"接住流星事件" },
      rich:           { icon:"💰", label:"小富翁",     desc:"累積飼料幣 500" },
      perfect_day:    { icon:"🌟", label:"完美的一天", desc:"四項數值同時 >70 持續 30 分" },
    },
    wants: {
      lifetimeMs: 5 * 60 * 1000,
      spawnIntervalMs: 90 * 1000,
      spawnChance: 0.18,
      cooldownMs: 8 * 60 * 1000,
      pool: [
        { id:"want_basic",  needs:"feed_basic", stage:"chick",  text:"想吃飯…",   icon:"🥣" },
        { id:"want_corn",   needs:"feed_corn",  stage:"chick",  text:"想吃玉米~", icon:"🌽" },
        { id:"want_berry",  needs:"feed_berry", stage:"chick",  text:"想吃莓果~", icon:"🍓" },
        { id:"want_bath",   needs:"bath",       stage:"chick",  text:"想洗澡…",   icon:"🛁" },
        { id:"want_pat",    needs:"pet_head",   stage:"egg",    text:"想被摸頭~", icon:"✋" },
        { id:"want_play",   needs:"play_ball",  stage:"chick",  text:"想玩球！",  icon:"⚽" },
        { id:"want_punch",  needs:"play_punch", stage:"junior", text:"想跳一下！",icon:"💃" },
        { id:"want_sing",   needs:"play_sing",  stage:"adult",  text:"想唱歌！",  icon:"🎤" },
        { id:"want_talk",   needs:"talk",       stage:"chick",  text:"想聊天~",   icon:"💬" },
      ],
      reward: { mood: 7, coin: 12, growth: 8 },
    },
    randomEvents: {
      // pool[].apply 是 string id；game.js 的 RANDOM_EVENT_APPLIES dispatch 表會查到實作
      spawnIntervalMs: 60 * 1000,
      spawnChance: 0.30,
      lifetimeMs: 90 * 1000,
      pool: [
        { id:"coin_drop", art:"assets/images/event-coin.png",      weight:55, label:"撿到飼料幣", apply:"coin_drop" },
        { id:"herb",      art:"assets/images/event-herb.png",      weight:18, label:"神祕草藥",   apply:"herb"      },
        { id:"butterfly", art:"assets/images/event-butterfly.png", weight:14, label:"蝴蝶飛過",   apply:"butterfly" },
        { id:"fly",       art:"assets/images/event-fly.png",       weight:10, label:"趕走果蠅",   apply:"fly"       },
        { id:"star",      art:"assets/images/event-star.png",      weight:3,  label:"神秘流星",   apply:"star"      },
      ],
    },
    economy: { dailyLogin: 30, evolveReward: 100, streak7: 50, streak30: 200 },
    welcomeBack: [
      { maxMs: 30*60*1000,            text: null /* silent */ },
      { maxMs: 3 *3600*1000,          text: "歡迎回來！咕咕～" },
      { maxMs: 8 *3600*1000,          text: "主人你回來了！我有點餓了" },
      { maxMs: 12*3600*1000,          text: "主人……我以為你不要我了……" },
      { maxMs: Infinity,              text: "主人！！我等了好久！", giveCoin: 20 },
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
      veryTired:   ["撐不住了…", "秒睡"],
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
      form_healthy: ["精神奕奕！", "標準帥氣！"],
      form_fatty:   ["再吃一點點就好…", "不胖不胖，是骨架大"],
      form_ugly:    ["其實這樣也滿酷的", "醜雞也有春天"],
      form_fighter: ["元氣滿滿~", "再蹦一下！", "活力 max！"],
      form_sage:    ["有趣的命題…", "讓我思考一下"],
      form_diva:    ["♪~", "今晚的舞台屬於我"],
      form_divine:  ["願平靜降臨於你", "(光暈閃爍)"],
      wantNag:     ["主人有看到我的願望嗎？", "拜託啦~", "求求你嘛", "(用期待的眼神看著主人)"],
      rich:        ["錢好像變多了~", "覺得我們可以買點什麼了！"],
      quirk:       ["(發呆)", "(整理羽毛)", "(看天空)", "(踱步)", "♪"],

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
      // v0.3 裝扮系統。slot 多種：hat（頭頂）/ neck（脖子）/ wing（之後加）。
      // 玩家用飼料幣解鎖；解鎖後永久擁有，可隨時切換。
      headband: { slot:"hat",  art:"assets/images/acc-headband.png", label:"蝴蝶髮帶",   icon:"🩷", price:80  },
      bow:      { slot:"hat",  art:"assets/images/acc-bow.png",      label:"粉紅蝴蝶結", icon:"🎀", price:120 },
      flower:   { slot:"hat",  art:"assets/images/acc-flower.png",   label:"粉色花環",   icon:"🌸", price:200 },
      crown:    { slot:"hat",  art:"assets/images/acc-crown.png",    label:"閃耀皇冠",   icon:"👑", price:500 },
      necklace: { slot:"neck", art:"assets/images/acc-necklace.png", label:"珍珠項鍊",   icon:"📿", price:180 },
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
      },
    },
    moodArt: {
      happy: "assets/images/mood-happy.png",
      neutral: "assets/images/mood-neutral.png",
      sad: "assets/images/mood-sad.png",
      sleeping: "assets/images/mood-sleeping.png",
      dirty: "assets/images/mood-dirty.png",
    },
  };

  // Expose to global. game.js does `const CFG = window.NourishCFG;` at top.
  window.NourishCFG = CFG;
})();
