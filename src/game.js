/* 啾啾日常 ChickaDay — MVP v0.1
 * Pure HTML+CSS+JS, no build step. Single source of truth: state object,
 * persisted to localStorage with schemaVersion gating. Tick loop drives both
 * stat decay and growth score; offline elapsed time is reconciled on load.
 */
(() => {
  "use strict";

  // ============ Configuration (from GDD §11) ============
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
      play_punch:  { mood:+25, energy:-25, clean:-10, cost:8,  cd:300, unlock:"junior", label:"打沙包",   icon:"🥊", battlePoints:3 },
      play_puzzle: { mood:+18, energy:-8,  clean:0,   cost:6,  cd:240, unlock:"adult",  label:"思考拼圖", icon:"🧩", intelligencePoints:2 },
      play_sing:   { mood:+30, energy:-15, clean:0,   cost:10, cd:360, unlock:"adult",  label:"唱歌比賽", icon:"🎤", singCount:1 },

      bath:        { clean:+60, mood:+5,   energy:-5, cost:3, cd:600, unlock:"chick",  label:"洗澡",     icon:"🛁" },
      pet_head:    { mood:+3,   cost:0, cd:30,  unlock:"egg",   label:"摸頭",     icon:"✋" },
      pet_belly:   { mood:+5,   cost:0, cd:60,  unlock:"chick", label:"摸肚子",   icon:"🤲", chuckle:0.10 },
      talk:        { mood:+2,   cost:0, cd:20,  unlock:"egg",   label:"對話",     icon:"💬" },
    },
    randomEvents: {
      spawnIntervalMs: 60 * 1000,
      spawnChance: 0.30,
      lifetimeMs: 90 * 1000,
      pool: [
        { id:"coin_drop", emoji:"💰", weight:55, label:"撿到飼料幣", apply:s => { const c = rand(5,15); grantCoin(c, "撿到"); } },
        { id:"herb",      emoji:"🌿", weight:18, label:"神祕草藥",   apply:s => { applyDelta(s.pet.stats, { hunger:+30, mood:+5, clean:+5, energy:+30 }); toast("🌿 神祕草藥！全身舒暢", "good"); } },
        { id:"butterfly", emoji:"🦋", weight:14, label:"蝴蝶飛過",   apply:s => { applyDelta(s.pet.stats, { mood:+10 }); toast("🦋 蝴蝶讓啾啾很開心", "good"); } },
        { id:"fly",       emoji:"🪰", weight:10, label:"趕走果蠅",   apply:s => { applyDelta(s.pet.stats, { clean:+5, mood:+3 }); toast("🪰 趕走果蠅！清潔 +5", "good"); } },
        { id:"star",      emoji:"⭐", weight:3,  label:"神秘流星",   apply:s => { applyDelta(s.pet.stats, { hunger:+10, mood:+10, clean:+10, energy:+10 }); grantCoin(50, "流星祝福"); toast("⭐ 流星許願！全屬性 +10", "gold"); } },
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
      idle:    ["咕咕", "啾~", "嗯哼", "✨", "🌸"],
      hungry:  ["肚子餓了…", "想吃飯", "咕嚕咕嚕"],
      sad:     ["不開心…", "陪我玩嘛", "嗚嗚"],
      dirty:   ["好癢…", "想洗澡"],
      tired:   ["想睡覺…", "好累"],
      happy:   ["好幸福！", "嘿嘿~", "最喜歡主人了"],
    },
    petArt: {
      egg:    "assets/svg/egg.svg",
      egg2:   "assets/svg/egg-cracked.svg",
      chick:  "assets/svg/chick-baby.svg",
      junior: "assets/svg/chick-young.svg",
      adult: {
        healthy: "assets/svg/chick-adult-healthy.svg",
        fatty:   "assets/svg/chick-adult-fat.svg",
        ugly:    "assets/svg/chick-adult-ugly.svg",
        divine:  "assets/svg/chick-adult-divine.svg",
        fighter: "assets/svg/chick-adult-fighter.svg",
        sage:    "assets/svg/chick-adult-sage.svg",
        diva:    "assets/svg/chick-adult-diva.svg",
      },
    },
    moodArt: {
      happy: "assets/svg/mood-happy.svg",
      neutral: "assets/svg/mood-neutral.svg",
      sad: "assets/svg/mood-sad.svg",
      sleeping: "assets/svg/mood-sleeping.svg",
      dirty: "assets/svg/mood-dirty.svg",
    },
  };

  // ============ State ============
  const defaultState = () => {
    const now = Date.now();
    return {
      schemaVersion: CFG.save.schemaVersion,
      createdAt: now,
      updatedAt: now,
      lastTickAt: now,
      pet: {
        id: cryptoRandomId(),
        name: "啾啾",
        stage: "egg",
        finalForm: null,
        stageStartedAt: now,
        bornAt: now,
        growthScore: 0,
        stats: { hunger: 80, mood: 80, clean: 80, energy: 80 },
        traits: { fatPoints: 0, battlePoints: 0, intelligencePoints: 0, singCount: 0, lowMoodMinutes: 0, perfectStreakMinutes: 0 },
        nameSet: false,
        isSleeping: false,
      },
      economy: { feedCoin: 50, totalEarned: 50, totalSpent: 0 },
      cooldowns: {},
      daily: {
        lastLoginDay: null,
        loginStreak: 0,
        tasks: {
          feed_count: { current: 0, target: 5, claimed: false },
          play_count: { current: 0, target: 3, claimed: false },
          pet_count:  { current: 0, target: 4, claimed: false },
        },
      },
      history: { totalSessions: 0 },
    };
  };

  let state = null;
  let tickTimer = null, autoSaveTimer = null;
  let lastTick = Date.now();
  let lastVisibleAt = Date.now();
  let lastPetSrc = null, lastMoodSrc = null, lastBgKey = null;

  // ============ Save / Load ============
  function load() {
    let raw = null;
    try { raw = localStorage.getItem(CFG.save.key); } catch (_) {}
    if (!raw) return defaultState();
    try {
      const parsed = JSON.parse(raw);
      return migrate(parsed);
    } catch (e) {
      console.warn("Save corrupt, starting fresh.", e);
      return defaultState();
    }
  }
  function save() {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(CFG.save.key, JSON.stringify(state));
    } catch (e) {
      console.warn("Save failed:", e);
    }
  }

  // Dex (永久圖鑑，獨立鍵以便壞檔不會連動)
  const DEX_KEY = "nourish.dex.v1";
  function loadDex() {
    try {
      const raw = localStorage.getItem(DEX_KEY);
      if (!raw) return { schemaVersion: 1, completedPets: [] };
      const d = JSON.parse(raw);
      if (!Array.isArray(d.completedPets)) d.completedPets = [];
      return d;
    } catch (_) { return { schemaVersion: 1, completedPets: [] }; }
  }
  function saveDex(dex) {
    try { localStorage.setItem(DEX_KEY, JSON.stringify(dex)); } catch (_) {}
  }
  function unlockedFormsSet() {
    const set = new Set();
    loadDex().completedPets.forEach(p => p.finalForm && set.add(p.finalForm));
    if (state.pet.finalForm) set.add(state.pet.finalForm);
    return set;
  }
  function archiveCurrentPet() {
    if (!state.pet.finalForm) return;
    const dex = loadDex();
    dex.completedPets.unshift({
      id: state.pet.id,
      name: state.pet.name,
      finalForm: state.pet.finalForm,
      bornAt: state.pet.bornAt,
      archivedAt: Date.now(),
      totalDays: Math.max(1, Math.round((Date.now() - state.pet.bornAt) / 86400000)),
    });
    if (dex.completedPets.length > 50) dex.completedPets.length = 50; // cap to avoid bloat
    saveDex(dex);
  }
  function startNewEgg() {
    archiveCurrentPet();
    const fresh = defaultState();
    // keep cross-life progression: economy, daily streak, history sessions
    fresh.economy = state.economy;
    fresh.daily   = state.daily;
    fresh.history = state.history;
    fresh.createdAt = state.createdAt;
    state = fresh;
    state.lastTickAt = Date.now();
    lastPetSrc = lastMoodSrc = lastBgKey = null;
    save();
    render();
    toast("🥚 新的一顆蛋出現了！", "good");
    speak("…?");
  }
  function migrate(data) {
    if (!data.schemaVersion || data.schemaVersion < 1) return defaultState();
    return deepMerge(defaultState(), data);
  }
  function deepMerge(base, over) {
    if (over === null || typeof over !== "object" || Array.isArray(over)) return over ?? base;
    const out = Array.isArray(base) ? [...(over || base)] : { ...base };
    for (const k of Object.keys(over)) {
      const bv = base[k], ov = over[k];
      if (bv && typeof bv === "object" && !Array.isArray(bv) && ov && typeof ov === "object" && !Array.isArray(ov)) {
        out[k] = deepMerge(bv, ov);
      } else {
        out[k] = ov;
      }
    }
    return out;
  }
  function cryptoRandomId() {
    const arr = new Uint8Array(8);
    (crypto || window.crypto).getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }

  // ============ Tick ============
  function reconcileOffline() {
    const now = Date.now();
    const elapsedMs = Math.max(0, now - state.lastTickAt);
    if (elapsedMs < 1000) { state.lastTickAt = now; return { elapsedMs: 0 }; }
    const cap = CFG.decay.offlineCapHours * 3600 * 1000;
    const effectiveMs = Math.min(elapsedMs, cap);
    const minutes = effectiveMs / 60000;

    const rate = CFG.decay.offline;
    const energyRate = state.pet.isSleeping ? CFG.decay.energySleep : rate.energy;
    applyDelta(state.pet.stats, {
      hunger: rate.hunger * minutes,
      mood:   rate.mood   * minutes,
      clean:  rate.clean  * minutes,
      energy: energyRate  * minutes,
    });

    // 24h offline penalty (one-time)
    if (elapsedMs >= 24 * 3600 * 1000) {
      state.pet.growthScore = Math.max(0, state.pet.growthScore + CFG.growth.offline24hPenalty);
    }
    state.lastTickAt = now;
    return { elapsedMs };
  }

  function tickOnline(deltaMs) {
    // Guard against clock skew (negative dt) and runaway accumulation
    // (e.g. throttled background tab returning with a 30-min dt).
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
    if (deltaMs > 5 * 60 * 1000) deltaMs = 5 * 60 * 1000;
    const minutes = deltaMs / 60000;
    const r = CFG.decay.online;
    const energyRate = state.pet.isSleeping ? CFG.decay.energySleep : r.energy;
    applyDelta(state.pet.stats, {
      hunger: r.hunger * minutes,
      mood:   r.mood   * minutes,
      clean:  r.clean  * minutes,
      energy: energyRate * minutes,
    });
    // cross-stat penalties
    const s = state.pet.stats;
    if (s.hunger < CFG.thresholds.low) s.mood = clamp(s.mood + (-0.20) * minutes, 0, 100);
    if (s.clean  < CFG.thresholds.mid) s.mood = clamp(s.mood + (-0.10) * minutes, 0, 100);

    // growth score
    const g = CFG.growth;
    let dScore = 0;
    if (s.hunger > CFG.thresholds.high) dScore += g.hungerHighBonus * minutes;
    if (s.mood   > CFG.thresholds.high) dScore += g.moodHighBonus   * minutes;
    if (s.clean  > CFG.thresholds.high) dScore += g.cleanHighBonus  * minutes;
    if (s.energy > CFG.thresholds.high) dScore += g.energyHighBonus * minutes;
    if (s.hunger > CFG.thresholds.high && s.mood > CFG.thresholds.high &&
        s.clean  > CFG.thresholds.high && s.energy > CFG.thresholds.high) {
      dScore += g.perfectBonus * minutes;
      state.pet.traits.perfectStreakMinutes += minutes;
    } else {
      state.pet.traits.perfectStreakMinutes = 0;
    }
    if (s.hunger < CFG.thresholds.low) dScore += g.hungerLowPenalty * minutes;
    if (s.mood   < CFG.thresholds.low) {
      dScore += g.moodLowPenalty * minutes;
      state.pet.traits.lowMoodMinutes += minutes;
    }
    state.pet.growthScore = Math.max(0, state.pet.growthScore + dScore);
  }

  function applyDelta(stats, delta) {
    for (const k of Object.keys(delta)) {
      stats[k] = clamp(stats[k] + delta[k], 0, 100);
    }
  }
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ============ Stage / Evolution ============
  function maybeEvolve() {
    const stage = state.pet.stage;
    const cfg = CFG.stages[stage];
    if (!cfg.next) return; // adult – evolution to final form handled separately
    const elapsed = Date.now() - state.pet.stageStartedAt;
    const ready = elapsed >= cfg.duration && state.pet.growthScore >= cfg.scoreToEvolve;
    if (!ready) return;
    state.pet.stage = cfg.next;
    state.pet.stageStartedAt = Date.now();
    pulseEvolve();
    toast(`進化！現在是${stageLabel(cfg.next)}！`, "gold");
    // bonus on every evolution
    grantCoin(20, "進化獎勵");

    // adult final-form picking
    if (cfg.next === "adult") finalizeForm();
  }

  function finalizeForm() {
    const t = state.pet.traits;
    let form = "healthy";
    // Order matters: rarer / more-virtuous outcomes first.
    if (t.perfectStreakMinutes >= 1440 && state.pet.growthScore >= 2000) form = "divine";
    else if (t.singCount >= 20) form = "diva";
    else if (t.intelligencePoints >= 30) form = "sage";
    else if (t.battlePoints >= 30) form = "fighter";
    else if (t.fatPoints >= 10) form = "fatty";
    else if (t.lowMoodMinutes >= 720) form = "ugly";
    state.pet.finalForm = form;
    grantCoin(CFG.economy.evolveReward, "終態獎勵");
    const days = Math.max(1, Math.round((Date.now()-state.pet.bornAt)/86400000));
    showModal({
      title: `🎉 進化完成！${formLabel(form)}`,
      body: `<p style="text-align:center;line-height:1.7;">
        經過 ${days} 天的養育，<br>
        <strong>${state.pet.name}</strong> 進化成了 <strong>${formLabel(form)}</strong>！<br><br>
        ${formDescription(form)}
      </p>`,
      buttons: [
        { label: "繼續陪伴", close: true },
        { label: "🥚 孵化新蛋", close: false, action: () => confirmNewEgg() },
      ],
    });
  }

  function confirmNewEgg() {
    showModal({
      title: "🥚 開始新的旅程？",
      body: `<p style="text-align:center;line-height:1.7;">
        現在的 <strong>${state.pet.name || "啾啾"}</strong> 將被收進圖鑑永遠紀念，<br>
        新的一顆蛋會出現給你重新開始。<br><br>
        <small class="muted">飼料幣與連續登入天數會保留。</small>
      </p>`,
      buttons: [
        { label: "取消", close: true },
        { label: "確定孵新蛋", close: false, action: () => { closeModal(); startNewEgg(); } },
      ],
    });
  }

  // ============ Interactions ============
  function isOnCooldown(key) {
    return (state.cooldowns[key] || 0) > Date.now();
  }
  function setCooldown(key, seconds) {
    state.cooldowns[key] = Date.now() + seconds * 1000;
  }
  function unlocked(unlockStage) {
    const order = ["egg", "chick", "junior", "adult"];
    return order.indexOf(state.pet.stage) >= order.indexOf(unlockStage);
  }
  function performInteraction(key) {
    const cfg = CFG.interactions[key];
    if (!cfg) return;
    if (state.pet.isSleeping && key !== "wake") {
      toast("啾啾在睡覺呢…", "bad"); return;
    }
    if (!unlocked(cfg.unlock)) { toast(`要等 ${stageLabel(cfg.unlock)} 階段才解鎖`, "bad"); return; }
    if (isOnCooldown(key)) { toast(`${cfg.label} 還在冷卻中`, "bad"); return; }
    if (cfg.cost && state.economy.feedCoin < cfg.cost) { toast("飼料幣不夠", "bad"); return; }

    // energy gates
    if (key.startsWith("play_") && state.pet.stats.energy < CFG.thresholds.low) {
      toast("體力太低，沒辦法玩耍", "bad"); return;
    }

    // overfeed: hunger > 95 and feeding
    if (key.startsWith("feed_") && state.pet.stats.hunger > 95) {
      state.pet.stats.mood = clamp(state.pet.stats.mood - 10, 0, 100);
      state.pet.stats.clean = clamp(state.pet.stats.clean - 15, 0, 100);
      state.pet.traits.fatPoints += 1;
      toast("吃太飽了…肥肥+1", "bad");
    }

    // apply effect
    applyDelta(state.pet.stats, {
      hunger: cfg.hunger || 0, mood: cfg.mood || 0,
      clean:  cfg.clean  || 0, energy: cfg.energy || 0,
    });
    if (cfg.cost) spendCoin(cfg.cost);
    if (cfg.battlePoints) state.pet.traits.battlePoints += cfg.battlePoints;
    if (cfg.fatPoints) state.pet.traits.fatPoints += cfg.fatPoints;
    if (cfg.intelligencePoints) state.pet.traits.intelligencePoints += cfg.intelligencePoints;
    if (cfg.singCount) state.pet.traits.singCount += cfg.singCount;

    setCooldown(key, cfg.cd);
    state.pet.growthScore += CFG.growth.interactionScore;
    trackDailyTask(key);

    // small free coin reward for play
    if (key.startsWith("play_")) grantCoin(rand(3, 6), null, true);

    toast(`${cfg.icon} ${cfg.label} +${formatDelta(cfg)}`, "good");
    speak(pickHappy());
    save();
    render();
  }

  function formatDelta(cfg) {
    const parts = [];
    if (cfg.hunger) parts.push(`飢餓${signed(cfg.hunger)}`);
    if (cfg.mood) parts.push(`心情${signed(cfg.mood)}`);
    if (cfg.clean) parts.push(`清潔${signed(cfg.clean)}`);
    if (cfg.energy) parts.push(`體力${signed(cfg.energy)}`);
    return parts.join(" ");
  }
  const signed = v => (v >= 0 ? "+" : "") + v;
  const rand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

  function toggleSleep() {
    if (state.pet.stage === "egg") { toast("蛋還不會睡覺啦", "bad"); return; }
    state.pet.isSleeping = !state.pet.isSleeping;
    if (state.pet.isSleeping) speak("zzz…"); else speak("早安~");
    save(); render();
  }

  // ============ Economy ============
  function grantCoin(amount, reason, silent) {
    state.economy.feedCoin += amount;
    state.economy.totalEarned += amount;
    if (!silent) toast(`💰 +${amount} FC${reason ? "（"+reason+"）" : ""}`, "gold");
  }
  function spendCoin(amount) {
    state.economy.feedCoin -= amount;
    state.economy.totalSpent += amount;
  }

  // ============ Daily login ============
  function handleDailyLogin() {
    const today = new Date(); today.setHours(0,0,0,0);
    const todayStr = today.toISOString().slice(0,10);
    if (state.daily.lastLoginDay === todayStr) return;
    const lastDay = state.daily.lastLoginDay ? new Date(state.daily.lastLoginDay) : null;
    if (lastDay) {
      const diff = Math.round((today - lastDay) / 86400000);
      state.daily.loginStreak = diff === 1 ? (state.daily.loginStreak || 0) + 1 : 1;
    } else {
      state.daily.loginStreak = 1;
    }
    state.daily.lastLoginDay = todayStr;
    resetDailyTasks();
    grantCoin(CFG.economy.dailyLogin, "每日登入");
    if (state.daily.loginStreak === 7)  grantCoin(CFG.economy.streak7,  "連續 7 天！");
    if (state.daily.loginStreak === 30) grantCoin(CFG.economy.streak30, "連續 30 天！！");
  }

  function resetDailyTasks() {
    state.daily.tasks = {
      feed_count: { current: 0, target: 5, claimed: false },
      play_count: { current: 0, target: 3, claimed: false },
      pet_count:  { current: 0, target: 4, claimed: false },
    };
  }

  function trackDailyTask(interactionKey) {
    if (!state.daily.tasks) resetDailyTasks();
    const t = state.daily.tasks;
    let bumped = null;
    if (interactionKey.startsWith("feed_")) bumped = t.feed_count;
    else if (interactionKey.startsWith("play_")) bumped = t.play_count;
    else if (interactionKey.startsWith("pet_"))  bumped = t.pet_count;
    if (!bumped) return;
    if (bumped.current < bumped.target) bumped.current += 1;
    if (bumped.current >= bumped.target && !bumped.claimed) {
      bumped.claimed = true;
      grantCoin(20, "完成每日任務");
    }
  }

  // ============ Welcome back ============
  function showWelcomeBack(elapsedMs) {
    const tier = CFG.welcomeBack.find(t => elapsedMs <= t.maxMs);
    if (!tier || !tier.text) return;
    const idx = CFG.welcomeBack.indexOf(tier);
    const minutes = Math.round(elapsedMs / 60000);
    const friendly = minutes < 60 ? `${minutes} 分鐘`
                   : minutes < 1440 ? `${Math.round(minutes/60)} 小時`
                   : `${Math.round(minutes/1440)} 天`;
    // GDD §7.4 emotional aftershock: 8-12h docks mood -5; >12h triggers crying line.
    let extra = "";
    if (idx === 3) {
      state.pet.stats.mood = clamp(state.pet.stats.mood - 5, 0, 100);
      extra = "<br><small>（心情 -5）</small>";
    }
    if (idx === 4) speak("嗚嗚嗚~");
    if (tier.giveCoin) grantCoin(tier.giveCoin, "補償");
    showModal({
      title: "歡迎回來！",
      body: `<div class="welcome-back">你離開了 <strong>${friendly}</strong><br>${tier.text}${extra}</div>`,
      buttons: [{ label: "好的", close: true }],
    });
  }

  // ============ Render ============
  const $ = id => document.getElementById(id);

  function statColor(v) {
    if (v >= CFG.thresholds.high) return "var(--c-good)";
    if (v >= CFG.thresholds.mid)  return "var(--c-mid)";
    if (v >= CFG.thresholds.low)  return "var(--c-low)";
    return "var(--c-bad)";
  }

  function render() {
    const s = state.pet.stats;
    const stats = [
      { k: "hunger" }, { k: "mood" }, { k: "clean" }, { k: "energy" },
    ];
    for (const { k } of stats) {
      const v = Math.round(s[k]);
      $("val-" + k).textContent = v;
      const bar = $("bar-" + k);
      bar.style.width = v + "%";
      bar.style.background = statColor(s[k]);
      const wrap = document.querySelector(`.stat[data-stat="${k}"]`);
      wrap.dataset.warn = s[k] < CFG.thresholds.low ? "true" : "false";
    }
    $("val-coin").textContent = state.economy.feedCoin;

    // stage / countdown
    const cfg = CFG.stages[state.pet.stage];
    const nameTag = state.pet.nameSet ? `${state.pet.name} · ` : "";
    $("stage-name").textContent = nameTag + stageLabel(state.pet.stage) +
      (state.pet.finalForm ? `（${formLabel(state.pet.finalForm)}）` : "");
    if (cfg.next) {
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const remainMs = Math.max(0, cfg.duration - elapsed);
      const remainScore = Math.max(0, cfg.scoreToEvolve - state.pet.growthScore);
      $("stage-countdown").textContent =
        `下一階段 ${formatTime(remainMs)} · 成長 ${Math.round(state.pet.growthScore)}/${cfg.scoreToEvolve}`;
    } else {
      $("stage-countdown").textContent = `成長 ${Math.round(state.pet.growthScore)}`;
    }

    // pet image (cached to skip needless src reassignments / reflow)
    let petSrc;
    if (state.pet.stage === "egg") {
      petSrc = state.pet.growthScore >= CFG.stages.egg.scoreToEvolve * 0.5
        ? CFG.petArt.egg2 : CFG.petArt.egg;
    } else if (state.pet.stage === "chick") {
      petSrc = CFG.petArt.chick;
    } else if (state.pet.stage === "junior") {
      petSrc = CFG.petArt.junior;
    } else {
      petSrc = CFG.petArt.adult[state.pet.finalForm || "healthy"]
            || CFG.petArt.adult.healthy;
    }
    const petImg = $("pet-img");
    if (lastPetSrc !== petSrc) { petImg.src = petSrc; lastPetSrc = petSrc; }
    petImg.classList.toggle("dim",
      s.mood < CFG.thresholds.low || s.hunger < CFG.thresholds.low);

    // mood overlay
    const moodIcon = $("mood-icon");
    let moodKey = null;
    if (state.pet.isSleeping) moodKey = "sleeping";
    else if (s.clean < CFG.thresholds.low) moodKey = "dirty";
    else if (s.mood  < CFG.thresholds.low) moodKey = "sad";
    else if (s.hunger< CFG.thresholds.low) moodKey = "sad";
    else if (s.mood  > CFG.thresholds.high) moodKey = "happy";
    if (moodKey) {
      const src = CFG.moodArt[moodKey];
      if (lastMoodSrc !== src) { moodIcon.src = src; lastMoodSrc = src; }
      moodIcon.hidden = false;
    } else {
      moodIcon.hidden = true;
      lastMoodSrc = null;
    }

    // sleep overlay
    document.getElementById("stage").classList.toggle("sleeping", state.pet.isSleeping);
    $("sleep-label").textContent = state.pet.isSleeping ? "起床" : "睡眠";

    // background (cached)
    const bgKey = (state.pet.stage === "egg" || state.pet.stage === "chick") ? "bg-coop" : "bg-grass";
    if (lastBgKey !== bgKey) {
      $("stage-bg").style.backgroundImage = `url("assets/svg/${bgKey}.svg")`;
      lastBgKey = bgKey;
    }

    // action buttons enable/disable + cooldown text
    setActionState();

    // streak
    $("streak").textContent = `🔥 連續 ${state.daily.loginStreak || 0} 天`;
    // daily tasks footer
    const t = (state.daily && state.daily.tasks) || {};
    const parts = [];
    if (t.feed_count) parts.push(`🍗 ${t.feed_count.current}/${t.feed_count.target}`);
    if (t.play_count) parts.push(`🎮 ${t.play_count.current}/${t.play_count.target}`);
    if (t.pet_count)  parts.push(`💝 ${t.pet_count.current}/${t.pet_count.target}`);
    const allDone = ["feed_count","play_count","pet_count"]
      .every(k => t[k] && t[k].current >= t[k].target);
    $("task-text").textContent = allDone
      ? `🎉 今日任務全完成！明天繼續～`
      : `今日：${parts.join(" · ")}`;
  }

  function setActionState() {
    const sleeping = state.pet.isSleeping;
    $("btn-feed").disabled  = sleeping;
    $("btn-play").disabled  = sleeping || state.pet.stage === "egg";
    $("btn-bath").disabled  = sleeping || !unlocked(CFG.interactions.bath.unlock) || isOnCooldown("bath");
    $("btn-sleep").disabled = state.pet.stage === "egg";
    $("btn-pet").disabled   = sleeping;

    // bath cooldown indicator
    const cdEl = $("cd-bath");
    if (isOnCooldown("bath")) {
      const ms = state.cooldowns["bath"] - Date.now();
      cdEl.textContent = formatTime(ms, true);
      cdEl.hidden = false;
    } else {
      cdEl.hidden = true;
    }
  }

  function formatTime(ms, terse = false) {
    if (ms === Infinity) return "∞";
    if (ms <= 0) return terse ? "" : "可進化";
    const s = Math.ceil(ms / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${ss}s`;
    return `${ss}s`;
  }

  function absolute(rel) {
    const a = document.createElement("a");
    a.href = rel;
    return a.href;
  }

  // ============ Menus ============
  function openFeedMenu() {
    const items = ["feed_basic", "feed_corn", "feed_berry", "feed_worm", "feed_cake"];
    const list = items.map(k => menuItemHTML(k)).join("");
    showModal({
      title: "🍗 餵食",
      body: `<div class="modal-list">${list}</div>`,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => bindMenuItems(card),
    });
  }
  function openPlayMenu() {
    const items = ["play_ball", "play_toy", "play_punch", "play_puzzle", "play_sing"];
    const list = items.map(k => menuItemHTML(k)).join("");
    showModal({
      title: "🎮 玩耍",
      body: `<div class="modal-list">${list}</div>`,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => bindMenuItems(card),
    });
  }
  function openPetMenu() {
    const items = ["pet_head", "pet_belly", "talk"];
    const list = items.map(k => menuItemHTML(k)).join("");
    showModal({
      title: "💝 互動",
      body: `<div class="modal-list">${list}</div>`,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => bindMenuItems(card),
    });
  }
  function menuItemHTML(key) {
    const cfg = CFG.interactions[key];
    const locked = !unlocked(cfg.unlock);
    const cdActive = isOnCooldown(key);
    const cantAfford = cfg.cost > state.economy.feedCoin;
    const disabled = locked || cdActive || cantAfford;
    const tag = cfg.cost > 0 ? `<span class="price">${cfg.cost} FC</span>`
              : `<span class="free">免費</span>`;
    const sub = locked ? `（${stageLabel(cfg.unlock)}解鎖）`
              : cdActive ? `（冷卻 ${formatTime(state.cooldowns[key] - Date.now(), true)}）`
              : cantAfford ? `（飼料幣不足）` : "";
    return `<button class="menu-item" data-key="${key}" ${disabled ? "disabled" : ""}>
      <span style="font-size:28px;">${cfg.icon}</span>
      <span class="name">${cfg.label}<small class="muted"> ${sub}</small></span>
      ${tag}
    </button>`;
  }
  function bindMenuItems(card) {
    card.querySelectorAll(".menu-item").forEach(el => {
      el.addEventListener("click", () => {
        const key = el.dataset.key;
        closeModal();
        performInteraction(key);
      });
    });
  }

  function openSettingsMenu() {
    const t = state.pet.traits;
    const html = `
      <div class="modal-list">
        <div class="settings-row"><span>連續登入</span><strong>${state.daily.loginStreak || 0} 天</strong></div>
        <div class="settings-row"><span>成長分數</span><strong>${Math.round(state.pet.growthScore)}</strong></div>
        <div class="settings-row"><span>誕生時間</span><strong>${new Date(state.pet.bornAt).toLocaleString()}</strong></div>
        <div class="settings-row"><span>🥯 肥胖點數</span><strong>${t.fatPoints}/10 → 胖雞</strong></div>
        <div class="settings-row"><span>🥊 戰鬥點數</span><strong>${t.battlePoints}/30 → 戰鬥雞</strong></div>
        <div class="settings-row"><span>🧩 智慧點數</span><strong>${t.intelligencePoints}/30 → 智慧雞</strong></div>
        <div class="settings-row"><span>🎤 唱歌次數</span><strong>${t.singCount}/20 → 歌姬雞</strong></div>
        <div class="settings-row"><span>😢 低落分鐘</span><strong>${Math.round(t.lowMoodMinutes)}/720 → 醜雞</strong></div>
        <div class="settings-row"><span>✨ 幸福連續</span><strong>${Math.round(t.perfectStreakMinutes)}/1440 → 神雞</strong></div>
        <hr style="border:0;border-top:1px dashed rgba(0,0,0,0.15);margin:4px 0;">
        <div class="settings-row"><span>給 100 飼料幣（除錯）</span>
          <button class="menu-item" id="dbg-give" style="padding:4px 10px;">+100</button></div>
        <div class="settings-row"><span>跳到下一階段（除錯）</span>
          <button class="menu-item" id="dbg-evolve" style="padding:4px 10px;">⏭️</button></div>
        ${state.pet.finalForm ? `
        <div class="settings-row"><span>🥚 孵化新蛋</span>
          <button class="menu-item" id="act-newegg" style="padding:4px 10px;color:var(--c-orange);">開始</button></div>
        ` : ""}
        <div class="settings-row"><span>重置存檔（清除本機資料）</span>
          <button class="menu-item" id="dbg-reset" style="padding:4px 10px;color:var(--c-red);">重置</button></div>
      </div>`;
    showModal({
      title: "⚙️ 設定 / 除錯",
      body: html,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => {
        card.querySelector("#dbg-give").onclick = () => { grantCoin(100, "除錯"); save(); render(); };
        card.querySelector("#dbg-evolve").onclick = () => {
          state.pet.growthScore = CFG.stages[state.pet.stage].scoreToEvolve;
          state.pet.stageStartedAt = Date.now() - CFG.stages[state.pet.stage].duration - 1;
          maybeEvolve(); save(); render();
        };
        const newEggBtn = card.querySelector("#act-newegg");
        if (newEggBtn) newEggBtn.onclick = () => { closeModal(); confirmNewEgg(); };
        card.querySelector("#dbg-reset").onclick = () => {
          if (confirm("確定要清除存檔重來？（圖鑑也會一起清空）")) {
            localStorage.removeItem(CFG.save.key);
            localStorage.removeItem(DEX_KEY);
            location.reload();
          }
        };
      },
    });
  }

  function openDexMenu() {
    const allForms = ["healthy","fatty","ugly","fighter","sage","diva","divine"];
    const unlocked = unlockedFormsSet();
    const formsHTML = allForms.map(f => {
      const have = unlocked.has(f);
      return `<div class="settings-row" style="${have?"":"opacity:0.4"}">
        <span>${have ? "🔓" : "🔒"} ${formLabel(f)}</span>
        <small style="text-align:right;max-width:60%;">${have ? formDescription(f) : "??"}</small>
      </div>`;
    }).join("");
    const dex = loadDex();
    const past = dex.completedPets.slice(0, 10);
    const pastHTML = past.length === 0
      ? `<p class="muted center" style="padding:6px 0;">尚未養成任何小雞</p>`
      : past.map(p => {
          const d = new Date(p.archivedAt || p.bornAt).toLocaleDateString();
          return `<div class="settings-row">
            <span>🐣 <strong>${escapeHtml(p.name || "?")}</strong> · ${formLabel(p.finalForm)}</span>
            <small>${d} · ${p.totalDays}天</small>
          </div>`;
        }).join("");
    showModal({
      title: "📖 圖鑑",
      body: `
        <div class="modal-title" style="font-size:14px;margin:6px 0 4px;">終態收集 ${unlocked.size} / ${allForms.length}</div>
        <div class="modal-list">${formsHTML}</div>
        <div class="modal-title" style="font-size:14px;margin:14px 0 4px;">歷代小雞</div>
        <div class="modal-list">${pastHTML}</div>
      `,
      buttons: [{ label: "關閉", close: true }],
    });
  }

  function openNameDialog() {
    const current = state.pet.name || "啾啾";
    showModal({
      title: state.pet.nameSet ? "✏️ 修改名字" : "🎀 為小雞取名",
      body: `<div style="display:flex;flex-direction:column;gap:10px;">
        <input id="name-input" type="text" maxlength="12"
          value="${escapeHtml(current)}"
          style="width:100%;padding:10px;border:2px solid var(--c-ink);border-radius:10px;font-size:16px;font-family:inherit;text-align:center;"/>
        <p class="muted center">${state.pet.nameSet ? "" : "首次取名 +10 心情"}</p>
      </div>`,
      buttons: [
        { label: "取消", close: true },
        { label: "確定", close: false, action: () => {
          const v = (document.getElementById("name-input").value || "").trim().slice(0, 12);
          if (!v) { toast("名字不能空", "bad"); return; }
          state.pet.name = v;
          if (!state.pet.nameSet) {
            state.pet.nameSet = true;
            state.pet.stats.mood = clamp(state.pet.stats.mood + 10, 0, 100);
            toast(`你好，${v}！`, "good");
            speak("好名字~");
          } else {
            toast(`改名為 ${v}`, "good");
          }
          save();
          render();
          closeModal();
        }},
      ],
      onMount: card => {
        const input = card.querySelector("#name-input");
        if (input) { input.focus(); input.select(); }
      },
    });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    })[c]);
  }

  // ============ Modal ============
  let modalOpen = false;
  let modalButtons = [];
  function showModal({ title, body, buttons = [], onMount }) {
    const card = $("modal-card");
    modalButtons = buttons;
    card.innerHTML = `
      <div class="modal-title">${title}</div>
      ${body}
      <div style="display:flex;gap:8px;justify-content:center;margin-top:14px;">
        ${buttons.map((b, i) => `<button class="modal-close" data-btn="${i}">${b.label}</button>`).join("")}
      </div>`;
    $("modal").hidden = false;
    modalOpen = true;
    if (onMount) onMount(card);
    // bind action buttons
    card.querySelectorAll("[data-btn]").forEach(el => {
      el.onclick = () => {
        const i = parseInt(el.dataset.btn, 10);
        const btn = modalButtons[i];
        if (!btn) return;
        if (btn.action) btn.action();
        if (btn.close !== false) closeModal();
      };
    });
    // backdrop click closes
    document.querySelector(".modal-bg").onclick = closeModal;
  }
  function closeModal() {
    $("modal").hidden = true;
    modalOpen = false;
  }

  // ============ Toast ============
  function toast(msg, kind = "") {
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.textContent = msg;
    $("toast-container").appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  // ============ Speech ============
  let speakTimer = null;
  function speak(text) {
    const bubble = $("speech-bubble");
    bubble.textContent = text;
    bubble.hidden = false;
    clearTimeout(speakTimer);
    speakTimer = setTimeout(() => { bubble.hidden = true; }, 2000);
  }
  function pickHappy() { return rand0(CFG.speech.happy); }
  function rand0(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ============ Helpers (labels) ============
  function stageLabel(s) {
    return ({ egg: "蛋", chick: "雛雞", junior: "幼雞", adult: "成雞" })[s] || s;
  }
  function formLabel(f) {
    return ({ healthy: "健康成雞", fatty: "胖雞", ugly: "醜雞", divine: "神雞", fighter: "戰鬥雞", sage: "智慧雞", diva: "歌姬雞" })[f] || f;
  }
  function formDescription(f) {
    return ({
      healthy: "毛色光亮、神采奕奕，是模範生雞。",
      fatty:   "圓滾滾很可愛，但走路會喘。",
      ugly:    "毛亂亂、表情委屈，但有很多粉絲，迷因路線。",
      divine:  "金色光環、純白羽毛，傳說中的存在。",
      fighter: "戴頭巾、戴拳套，眼神銳利。打沙包打出來的硬漢路線。",
      sage:    "戴半月眼鏡、書卷氣，思考拼圖累積的智慧路線。",
      diva:    "彩虹尾羽配麥克風，唱歌唱出來的明星路線。",
    })[f] || "";
  }

  function pulseEvolve() {
    const img = $("pet-img");
    img.classList.add("evolving");
    setTimeout(() => img.classList.remove("evolving"), 3500);
  }

  // ============ Random events ============
  let activeEvent = null;
  let eventTimer = null;

  function maybeSpawnEvent() {
    if (activeEvent) return;
    if (state.pet.isSleeping) return;
    if (state.pet.stage === "egg") return;
    if (modalOpen) return;
    if (Math.random() > CFG.randomEvents.spawnChance) return;
    spawnEvent();
  }

  function spawnEvent() {
    const pool = CFG.randomEvents.pool;
    const total = pool.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    let pick = pool[0];
    for (const e of pool) { r -= e.weight; if (r <= 0) { pick = e; break; } }

    const stage = $("stage");
    const el = document.createElement("button");
    el.className = "event-bubble";
    el.type = "button";
    el.textContent = pick.emoji;
    el.title = pick.label;
    el.style.left = (15 + Math.random() * 70) + "%";
    el.style.top  = (10 + Math.random() * 25) + "%";
    el.setAttribute("aria-label", pick.label);
    stage.appendChild(el);

    activeEvent = { node: el, def: pick, expiresAt: Date.now() + CFG.randomEvents.lifetimeMs };
    el.onclick = () => resolveEvent(true);

    // expire timer
    setTimeout(() => {
      if (activeEvent && activeEvent.node === el) resolveEvent(false);
    }, CFG.randomEvents.lifetimeMs);
  }

  function resolveEvent(claimed) {
    if (!activeEvent) return;
    const { node, def } = activeEvent;
    activeEvent = null;
    node.classList.add("leave");
    setTimeout(() => node.remove(), 250);
    if (!claimed) return;
    def.apply(state);
    state.pet.growthScore += 3;
    save();
    render();
  }

  // ============ Idle behaviour ============
  let idleTimer = null;
  function startIdleSpeech() {
    if (idleTimer) clearInterval(idleTimer);
    idleTimer = setInterval(() => {
      if (modalOpen || state.pet.isSleeping) return;
      const s = state.pet.stats;
      let line;
      if (s.hunger < CFG.thresholds.low) line = rand0(CFG.speech.hungry);
      else if (s.mood < CFG.thresholds.low) line = rand0(CFG.speech.sad);
      else if (s.clean < CFG.thresholds.low) line = rand0(CFG.speech.dirty);
      else if (s.energy < CFG.thresholds.low) line = rand0(CFG.speech.tired);
      else if (Math.random() < 0.35) line = rand0(CFG.speech.idle);
      if (line) speak(line);
    }, 8000);
  }

  // ============ Bootstrap ============
  function init() {
    state = load();
    const { elapsedMs } = reconcileOffline();
    handleDailyLogin();
    save();

    // wire up buttons
    $("btn-feed").onclick    = openFeedMenu;
    $("btn-play").onclick    = openPlayMenu;
    $("btn-bath").onclick    = () => performInteraction("bath");
    $("btn-sleep").onclick   = toggleSleep;
    $("btn-pet").onclick     = openPetMenu;
    $("btn-settings").onclick = openSettingsMenu;
    $("btn-dex").onclick     = openDexMenu;
    $("pet-wrapper").onclick = () => performInteraction("pet_head");
    $("stage-name").onclick  = openNameDialog;
    $("stage-name").style.cursor = "pointer";
    $("stage-name").title = "點此取名 / 改名";

    // tick loop (1 sec for smooth UI; stat decay computed by elapsed minutes)
    lastTick = Date.now();
    startTick();
    autoSaveTimer = setInterval(save, CFG.save.autosaveMs);
    eventTimer = setInterval(maybeSpawnEvent, CFG.randomEvents.spawnIntervalMs);
    startIdleSpeech();

    // visibility — when hidden, freeze online tick and let offline reconcile
    // reapply on resume. Avoids ~8h backgrounded tab being treated as online.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        save();
        state.lastTickAt = Date.now();
        save();
        if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
      } else {
        reconcileOffline();
        lastTick = Date.now();
        lastVisibleAt = Date.now();
        if (!tickTimer) startTick();
        render();
      }
    });
    window.addEventListener("focus", () => { lastVisibleAt = Date.now(); });
    window.addEventListener("beforeunload", save);

    // first-time greeting
    render();
    if (elapsedMs > 30 * 60 * 1000) showWelcomeBack(elapsedMs);

    // brand-new player onboarding (only first launch; persisted via state.history.totalSessions)
    if (!state.history) state.history = { totalSessions: 0 };
    state.history.totalSessions = (state.history.totalSessions || 0) + 1;
    if (state.history.totalSessions === 1) {
      setTimeout(() => showOnboarding(), 600);
    }
  }

  function startTick() {
    tickTimer = setInterval(() => {
      const now = Date.now();
      let dt = now - lastTick;
      lastTick = now;
      // clamp single-tick window so a long-throttled background catch-up
      // can't dump 30 min of online decay in one frame.
      if (dt > 5 * 60 * 1000) dt = 5 * 60 * 1000;
      if (dt < 0) dt = 0;
      tickOnline(dt);
      maybeEvolve();
      render();
    }, 1000);
  }

  function showOnboarding() {
    showModal({
      title: "🥚 歡迎來到啾啾日常",
      body: `<div style="line-height:1.7;font-size:13px;">
        <p>🥚 <strong>蛋會在 6 小時後孵化</strong>。在那之前你可以輕觸蛋來增加心情。</p>
        <p>📊 顧好<strong>飢餓 / 心情 / 清潔 / 體力</strong>四項數值，照顧得越好就越快進化。</p>
        <p>🌙 <strong>關閉分頁也會繼續長大，但速度減半</strong>，所以可以放心離開。</p>
        <p>🎁 進化分支根據你的照顧方式決定 — 試試打沙包看看會養出什麼吧！</p>
      </div>`,
      buttons: [{ label: "開始", close: true }],
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
