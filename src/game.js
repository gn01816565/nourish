/* 啾啾日常 ChickaDay — MVP v0.1
 * Pure HTML+CSS+JS, no build step. Single source of truth: state object,
 * persisted to localStorage with schemaVersion gating. Tick loop drives both
 * stat decay and growth score; offline elapsed time is reconciled on load.
 *
 * Configuration data lives in src/cfg.js → window.NourishCFG.
 * Random event side-effects (apply: "<id>") are dispatched via RANDOM_EVENT_APPLIES below.
 */
(() => {
  "use strict";

  // Pure config data, see src/cfg.js. Loaded via <script> tag before this file.
  const CFG = window.NourishCFG;
  if (!CFG) throw new Error("NourishCFG missing — load src/cfg.js before src/game.js");

  // Random-event side-effects (closures over grantCoin / applyDelta / toast).
  // Lookup table indexed by CFG.randomEvents.pool[].apply (string id).
  // Defined here (not in cfg.js) because they reference helpers below.
  const RANDOM_EVENT_APPLIES = {
    coin_drop: s => { const c = rand(5,15); grantCoin(c, "撿到"); },
    herb:      s => { applyDelta(s.pet.stats, { hunger:+30, mood:+5, clean:+5, energy:+30 }); toast("🌿 神祕草藥！全身舒暢", "good"); },
    butterfly: s => { applyDelta(s.pet.stats, { mood:+10 }); toast("🦋 蝴蝶讓啾啾很開心", "good"); },
    fly:       s => { applyDelta(s.pet.stats, { clean:+5, mood:+3 }); toast("趕走果蠅！清潔 +5", "good"); },
    star:      s => { applyDelta(s.pet.stats, { hunger:+10, mood:+10, clean:+10, energy:+10 }); grantCoin(50, "流星祝福"); toast("⭐ 流星許願！全屬性 +10", "gold"); },
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
        want: null,                  // active want (see CFG.wants); null when none
        wantCooldownUntil: 0,        // ms timestamp; suppress new spawns before this
        isSleeping: false,
        appearance: { hat: null, neck: null, wing: null }, // currently-equipped accessory id per slot
        ownedAccessories: {},                              // id → unlockedAt; persisted across pets
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
      history: { totalSessions: 0, feedCount: 0, bathCount: 0, petCount: 0, playCount: 0 },
      achievements: {},
      settings: { soundEnabled: true, reducedMotion: false },
    };
  };

  let state = null;
  let tickTimer = null, autoSaveTimer = null, wantsTimer = null;
  let lastTick = Date.now();
  let lastVisibleAt = Date.now();
  let lastPetSrc = null, lastMoodSrc = null, lastBgKey = null;
  let isReadOnlyTab = false; // P1-2: set true when another tab takes ownership

  // P1-1: gate developer-only buttons; players see only the legitimate "reset" row.
  const DEBUG = (() => {
    try {
      return new URLSearchParams(location.search).has("debug")
          || localStorage.getItem("nourish.debug") === "1";
    } catch (_) { return false; }
  })();

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
    if (isReadOnlyTab) return; // P1-2: another tab owns the save slot
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(CFG.save.key, JSON.stringify(state));
    } catch (e) {
      // P1-3: surface quota errors so the player knows their progress is at risk.
      if (e && (e.name === "QuotaExceededError" || e.code === 22)) {
        toast("⚠️ 存檔空間不足，進度可能無法保留", "bad");
      }
      console.warn("Save failed:", e);
    }
  }

  // Dex (永久圖鑑，獨立 key) — implementation moved to src/dex.js.
  // These thin wrappers preserve every existing call site in this file.
  const DEX_KEY = "nourish.dex.v1"; // kept for the reset-everything path below
  function loadDex()           { return window.NourishDex.loadDex(); }
  function saveDex(dex)        { window.NourishDex.saveDex(dex); }
  function unlockedFormsSet()  { return window.NourishDex.unlockedFormsSet(); }
  function archiveCurrentPet() { window.NourishDex.archiveCurrentPet(); }
  function startNewEgg() {
    archiveCurrentPet();
    const ownedAcc = state.pet.ownedAccessories || {};
    const fresh = defaultState();
    // keep cross-life progression: economy, daily streak, history, owned cosmetics
    fresh.economy = state.economy;
    fresh.daily   = state.daily;
    fresh.history = state.history;
    fresh.createdAt = state.createdAt;
    fresh.pet.ownedAccessories = ownedAcc;
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
    SFX.evolve();
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
    spawnEvolveParticles();
    checkAchievements();
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

    // overfeed: hunger > 95 and feeding. P2-7: skip the +1 if the food itself
    // already grants fatPoints (cake), so cake at hunger>95 doesn't double-count.
    if (key.startsWith("feed_") && state.pet.stats.hunger > 95) {
      state.pet.stats.mood = clamp(state.pet.stats.mood - 10, 0, 100);
      state.pet.stats.clean = clamp(state.pet.stats.clean - 15, 0, 100);
      if (!cfg.fatPoints) state.pet.traits.fatPoints += 1;
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
    bumpHistory(key);
    fulfillWantIfMatches(key);
    checkAchievements();

    // small free coin reward for play
    if (key.startsWith("play_")) grantCoin(rand(3, 6), null, true);

    playReactionAnim(key);
    SFX.success();
    toast(`${cfg.icon} ${cfg.label} +${formatDelta(cfg)}`, "good");
    // Action-specific reply when available; fall back to generic happy line.
    const replies = CFG.speech[`action_${key}`];
    speak(replies ? rand0(replies) : pickHappy());
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
    if (state.economy.totalEarned >= 500) unlockAchievement("rich");
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
    checkAchievements();
  }

  function resetDailyTasks() {
    state.daily.tasks = {
      feed_count: { current: 0, target: 5, claimed: false },
      play_count: { current: 0, target: 3, claimed: false },
      pet_count:  { current: 0, target: 4, claimed: false },
    };
  }

  function bumpHistory(interactionKey) {
    if (!state.history) state.history = { totalSessions: 0 };
    const h = state.history;
    if (interactionKey.startsWith("feed_")) h.feedCount = (h.feedCount || 0) + 1;
    else if (interactionKey === "bath")     h.bathCount = (h.bathCount || 0) + 1;
    else if (interactionKey.startsWith("play_")) h.playCount = (h.playCount || 0) + 1;
    else if (interactionKey.startsWith("pet_") || interactionKey === "talk") h.petCount = (h.petCount || 0) + 1;
  }

  // ============ Achievements ============
  function unlockAchievement(id) {
    if (!state.achievements) state.achievements = {};
    if (state.achievements[id]) return false;
    const cfg = CFG.achievements[id];
    if (!cfg) return false;
    state.achievements[id] = Date.now();
    SFX.achievement();
    toast(`🏅 ${cfg.icon} ${cfg.label}`, "gold");
    setTimeout(() => toast(`「${cfg.desc}」`, "good"), 350);
    spawnAchievementParticles();
    // P1-4 part 2: nudge the player toward the naming UI on first hatch.
    if (id === "first_hatch" && !state.pet.nameSet) {
      setTimeout(() => toast("💡 點寵物名字可以取名喔～", "good"), 1500);
    }
    return true;
  }

  function checkAchievements() {
    const h = state.history || {};
    const dexUnlocked = unlockedFormsSet();
    const checks = [
      ["first_feed",    (h.feedCount || 0) >= 1],
      ["feed_50",       (h.feedCount || 0) >= 50],
      ["bath_10",       (h.bathCount || 0) >= 10],
      ["pet_50",        (h.petCount  || 0) >= 50],
      ["first_hatch",   state.pet.stage !== "egg"],
      ["first_evolve",  state.pet.stage === "adult"],
      ["streak_7",      (state.daily?.loginStreak || 0) >= 7],
      ["streak_30",     (state.daily?.loginStreak || 0) >= 30],
      ["form_divine",   dexUnlocked.has("divine")],
      ["form_diva",     dexUnlocked.has("diva")],
      ["form_fighter",  dexUnlocked.has("fighter")],
      ["form_sage",     dexUnlocked.has("sage")],
      ["collect_3",     dexUnlocked.size >= 3],
      ["collect_5",     dexUnlocked.size >= 5],
      ["collect_all",   dexUnlocked.size >= 7],
      ["rich",          (state.economy?.totalEarned || 0) >= 500],
      ["perfect_day",   (state.pet.traits?.perfectStreakMinutes || 0) >= 30],
      ["dressup_first", Object.keys(state.pet.ownedAccessories || {}).length >= 1],
      ["dressup_set",   !!(state.pet.appearance?.hat && state.pet.appearance?.neck && state.pet.appearance?.wing)],
      ["dressup_collector", Object.keys(state.pet.ownedAccessories || {}).length >= Object.keys(CFG.accessories).length],
      ["elder_week",    state.pet.stage === "adult"
                          && (Date.now() - state.pet.stageStartedAt) >= 7  * 86400000],
      ["elder_month",   state.pet.stage === "adult"
                          && (Date.now() - state.pet.stageStartedAt) >= 30 * 86400000],
    ];
    for (const [id, met] of checks) if (met) unlockAchievement(id);
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
      const score = state.pet.growthScore;
      const need = Math.max(0, cfg.scoreToEvolve - score);
      // P2-10: explain *why* a "ready" pet hasn't evolved yet (time done but score short).
      let line;
      if (remainMs > 0) {
        line = `下一階段 ${formatTime(remainMs)} · 成長 ${Math.round(score)}/${cfg.scoreToEvolve}`;
      } else if (need > 0) {
        line = `再多互動 ${Math.ceil(need)} 點就能進化`;
      } else {
        line = `準備進化中…`;
      }
      $("stage-countdown").textContent = line;
    } else {
      $("stage-countdown").textContent = `成長 ${Math.round(state.pet.growthScore)}`;
    }

    // Pre-evolve glow: D7 retention hook — the pet visibly "shimmers" in the
    // run-up to its next stage. Window scales with stage length so junior (48h)
    // also gets a meaningful cue, not just the last fixed hour. Last 30 min
    // upgrades to "imminent" pulse + scale so the climax doesn't habituate.
    const preEvolveLevel = (() => {
      if (!cfg.next) return null;
      if (state.pet.stage === "egg") return null; // egg uses egg-shake-high instead
      if (state.pet.isSleeping) return null;
      const elapsed2 = Date.now() - state.pet.stageStartedAt;
      const remain2 = cfg.duration - elapsed2;
      const scoreReady = state.pet.growthScore >= cfg.scoreToEvolve * 0.7;
      if (!scoreReady || remain2 <= 0) return null;
      const window = Math.max(60 * 60 * 1000, cfg.duration * 0.08);
      if (remain2 <= 30 * 60 * 1000) return "imminent";
      if (remain2 <= window) return "soon";
      return null;
    })();
    petImg.classList.toggle("pre-evolve", preEvolveLevel === "soon");
    petImg.classList.toggle("pre-evolve-imminent", preEvolveLevel === "imminent");

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
    // Egg-shake progression (character-sheet §2.1): ramp wobble intensity with
    // growthScore so the player can SEE the egg getting livelier toward hatch.
    petImg.classList.remove("egg-shake-low", "egg-shake-med", "egg-shake-high");
    if (state.pet.stage === "egg" && !state.pet.isSleeping) {
      const eggThreshold = CFG.stages.egg.scoreToEvolve;
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const timeProgress = Math.min(1, elapsed / CFG.stages.egg.duration);
      const scoreProgress = Math.min(1, state.pet.growthScore / eggThreshold);
      const progress = (timeProgress + scoreProgress) / 2; // average of time + care
      if (progress >= 0.85) petImg.classList.add("egg-shake-high");
      else if (progress >= 0.5) petImg.classList.add("egg-shake-med");
      else petImg.classList.add("egg-shake-low");
    }

    // accessory overlays (all slots, iterate)
    const ACC_SLOTS = ["hat", "neck", "wing"];
    const eqByPet = state.pet.appearance || {};
    ACC_SLOTS.forEach(slot => {
      const equipId = eqByPet[slot];
      const el = $("acc-" + slot);
      if (!el) return;
      if (equipId && CFG.accessories[equipId]) {
        const src = CFG.accessories[equipId].art;
        if (el.dataset.id !== equipId) { el.src = src; el.dataset.id = equipId; }
        el.hidden = false;
      } else {
        el.hidden = true;
        el.removeAttribute("data-id");
      }
    });

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

    // wants bubble
    const wantEl = $("want-bubble");
    if (state.pet.want && !state.pet.isSleeping) {
      wantEl.innerHTML = `${state.pet.want.icon} ${state.pet.want.text}<span class="want-mark">!</span>`;
      wantEl.hidden = false;
    } else {
      wantEl.hidden = true;
    }

    // background (cached)
    const bgKey = (state.pet.stage === "egg" || state.pet.stage === "chick") ? "bg-coop" : "bg-grass";
    if (lastBgKey !== bgKey) {
      $("stage-bg").style.backgroundImage = `url("assets/images/${bgKey}.png")`;
      lastBgKey = bgKey;
    }

    // action buttons enable/disable + cooldown text
    setActionState();

    // streak
    $("streak").textContent = `🔥 連續 ${state.daily.loginStreak || 0} 天`;
    // Stage-aware guidance hint: helps new players know what to do during quiet
    // stretches (esp. the 6-hour egg phase). Hides once the player has settled in.
    const hintEl = $("stage-hint");
    if (hintEl) {
      let hint = null;
      const h = state.history || {};
      const totalPet = h.petCount || 0;
      const totalFeed = h.feedCount || 0;
      if (state.pet.stage === "egg") {
        const elapsedEgg = Date.now() - state.pet.stageStartedAt;
        const eggDur = CFG.stages.egg.duration;
        const eggScoreReady = state.pet.growthScore >= CFG.stages.egg.scoreToEvolve * 0.85;
        if (eggScoreReady && elapsedEgg >= eggDur * 0.85) hint = "✨ 即將孵化…屏住呼吸！";
        else if (totalPet === 0) hint = "💡 輕觸蛋蛋來摸頭吧～";
        else if (state.pet.growthScore < CFG.stages.egg.scoreToEvolve * 0.5)
          hint = "🥚 多陪陪蛋，孵化會更快";
        // else: silent — player has clearly figured it out
      } else if (state.pet.stage === "chick" && totalFeed < 1) {
        hint = "🍗 試試左下角「餵食」喔";
      } else if (state.pet.stage === "chick" && !state.pet.nameSet) {
        hint = "✏️ 點寵物名字可以幫牠取名";
      } else {
        // Near-evolution hints for chick/junior — reinforces the "守線" loop with
        // an explicit countdown narrative when the pet is about to level up.
        const stageCfg = CFG.stages[state.pet.stage];
        if (stageCfg && stageCfg.next) {
          const elapsed = Date.now() - state.pet.stageStartedAt;
          const progress = elapsed / stageCfg.duration;
          const scoreReady = state.pet.growthScore >= stageCfg.scoreToEvolve * 0.7;
          if (progress >= 0.92 && scoreReady) {
            if (state.pet.stage === "chick")  hint = "🌟 啾啾準備變成幼雞了…";
            else if (state.pet.stage === "junior") hint = "🌟 啾啾即將長大成雞！";
          }
        }
      }
      if (hint) { hintEl.textContent = hint; hintEl.hidden = false; }
      else      { hintEl.hidden = true; }
    }
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

  // ============ Audio (Web Audio API, procedural — no assets) ============
  // Synthesised tones via OscillatorNode + GainNode envelopes. AudioContext is
  // created lazily on first user gesture so autoplay policies don't shut us out.
  let audioCtx = null;
  function ensureAudioCtx() {
    if (audioCtx) return audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) { audioCtx = null; }
    return audioCtx;
  }
  function soundOn() {
    return state && state.settings && state.settings.soundEnabled !== false;
  }
  function playTone(freq, ms, type = "sine", gain = 0.12) {
    if (!soundOn()) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.linearRampToValueAtTime(gain, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    osc.start(now);
    osc.stop(now + ms / 1000 + 0.05);
  }
  // Composite SFX = chained playTone calls with delays. Tuned so achievement
  // and evolve land louder than routine clicks.
  const SFX = {
    click:       () => playTone(660, 60, "square", 0.08),
    success:     () => { playTone(660, 80, "sine", 0.1); setTimeout(() => playTone(880, 100, "sine", 0.1), 60); },
    fail:        () => { playTone(220, 100, "sawtooth", 0.08); setTimeout(() => playTone(180, 120, "sawtooth", 0.08), 80); },
    achievement: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 110, "triangle", 0.12), i * 100)); },
    evolve:      () => { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playTone(f, 140, "triangle", 0.14), i * 90)); },
    want:        () => { playTone(523, 90, "sine", 0.1); setTimeout(() => playTone(784, 90, "sine", 0.1), 90); },
    event:       () => playTone(932, 80, "sine", 0.1),
    coin:        () => { playTone(988, 60, "square", 0.08); setTimeout(() => playTone(1319, 80, "square", 0.08), 50); },
  };

  // ============ Save export / import ============
  // Bundle save + dex into a single base64 string the player can paste into a
  // new browser / device. Useful as a manual cloud-sync stand-in (no backend).
  function exportSaveBundle() {
    const bundle = {
      v: 1,
      exportedAt: Date.now(),
      save: state,
      dex:  loadDex(),
    };
    try {
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(bundle))));
      return b64;
    } catch (_) { return null; }
  }
  function importSaveBundle(b64) {
    try {
      const raw = decodeURIComponent(escape(atob(b64.trim())));
      const bundle = JSON.parse(raw);
      if (!bundle || !bundle.save || bundle.v !== 1) return false;
      localStorage.setItem(CFG.save.key, JSON.stringify(bundle.save));
      if (bundle.dex) localStorage.setItem("nourish.dex.v1", JSON.stringify(bundle.dex));
      return true;
    } catch (_) { return false; }
  }

  // ============ Accessory shop (v0.3 起步) ============
  function isAccessoryOwned(id) {
    return !!(state.pet.ownedAccessories && state.pet.ownedAccessories[id]);
  }
  function buyAccessory(id) {
    const cfg = CFG.accessories[id];
    if (!cfg) return;
    if (isAccessoryOwned(id)) return;
    if (state.economy.feedCoin < cfg.price) { toast("飼料幣不夠", "bad"); SFX.fail(); return; }
    spendCoin(cfg.price);
    if (!state.pet.ownedAccessories) state.pet.ownedAccessories = {};
    state.pet.ownedAccessories[id] = Date.now();
    SFX.coin();
    toast(`🎀 解鎖 ${cfg.label}！`, "gold");
    checkAchievements();
    save();
    openShopMenu();
  }
  function equipAccessory(id) {
    const cfg = CFG.accessories[id];
    if (!cfg) return;
    if (!isAccessoryOwned(id)) return;
    if (!state.pet.appearance) state.pet.appearance = { hat: null };
    state.pet.appearance[cfg.slot] = state.pet.appearance[cfg.slot] === id ? null : id;
    SFX.click();
    checkAchievements();
    save(); render(); openShopMenu();
  }

  function openShopMenu() {
    const items = Object.keys(CFG.accessories);
    const equipped = state.pet.appearance || {};
    const rows = items.map(id => {
      const cfg = CFG.accessories[id];
      const owned = isAccessoryOwned(id);
      const isOn = equipped[cfg.slot] === id;
      const action = !owned
        ? `<button class="menu-item" data-buy="${id}" ${state.economy.feedCoin < cfg.price ? "disabled" : ""}
             style="padding:4px 10px;color:var(--c-red);">${cfg.price} FC</button>`
        : `<button class="menu-item" data-equip="${id}" style="padding:4px 10px;${isOn?"background:var(--c-pink);":""}">${isOn ? "✅ 配戴中" : "戴上"}</button>`;
      return `<div class="settings-row">
        <span><img src="${cfg.art}" width="32" height="32" style="vertical-align:middle;margin-right:6px;">${cfg.icon} ${cfg.label}</span>
        ${action}
      </div>`;
    }).join("");
    showModal({
      title: "🎀 裝扮商店",
      body: `<div class="modal-list">${rows}</div>
        <p class="muted center" style="margin-top:8px;">💰 ${state.economy.feedCoin} FC · 戴上後會出現在啾啾頭上</p>`,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => {
        card.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => buyAccessory(b.dataset.buy));
        card.querySelectorAll("[data-equip]").forEach(b => b.onclick = () => equipAccessory(b.dataset.equip));
      },
    });
  }

  function openSettingsMenu() {
    const t = state.pet.traits;
    const html = `
      <div class="modal-list">
        <div class="settings-row"><span>🔊 音效</span>
          <button class="menu-item" id="toggle-sound" style="padding:4px 10px;">${state.settings?.soundEnabled === false ? "已關閉" : "已開啟"}</button></div>
        <div class="settings-row"><span>🌀 減少動畫</span>
          <button class="menu-item" id="toggle-motion" style="padding:4px 10px;">${state.settings?.reducedMotion ? "已開啟" : "跟隨系統"}</button></div>
        <hr style="border:0;border-top:1px dashed rgba(0,0,0,0.15);margin:4px 0;">
        <div class="settings-row"><span>連續登入</span><strong>${state.daily.loginStreak || 0} 天</strong></div>
        <div class="settings-row"><span>成長分數</span><strong>${Math.round(state.pet.growthScore)}</strong></div>
        <div class="settings-row"><span>誕生時間</span><strong>${new Date(state.pet.bornAt).toLocaleString()}</strong></div>
        <div class="settings-row"><span>🥯 肥胖點數</span><strong>${t.fatPoints}/10 → 胖雞</strong></div>
        <div class="settings-row"><span>💪 活力點數</span><strong>${t.battlePoints}/30 → 元氣雞</strong></div>
        <div class="settings-row"><span>🧩 智慧點數</span><strong>${t.intelligencePoints}/30 → 智慧雞</strong></div>
        <div class="settings-row"><span>🎤 唱歌次數</span><strong>${t.singCount}/20 → 歌姬雞</strong></div>
        <div class="settings-row"><span>😢 低落分鐘</span><strong>${Math.round(t.lowMoodMinutes)}/720 → 醜雞</strong></div>
        <div class="settings-row"><span>✨ 幸福連續</span><strong>${Math.round(t.perfectStreakMinutes)}/1440 → 神雞</strong></div>
        <hr style="border:0;border-top:1px dashed rgba(0,0,0,0.15);margin:4px 0;">
        ${DEBUG ? `
        <div class="settings-row"><span>給 100 飼料幣（除錯）</span>
          <button class="menu-item" id="dbg-give" style="padding:4px 10px;">+100</button></div>
        <div class="settings-row"><span>跳到下一階段（除錯）</span>
          <button class="menu-item" id="dbg-evolve" style="padding:4px 10px;">⏭️</button></div>
        ` : ""}
        ${state.pet.finalForm ? `
        <div class="settings-row"><span>🥚 孵化新蛋</span>
          <button class="menu-item" id="act-newegg" style="padding:4px 10px;color:var(--c-orange);">開始</button></div>
        ` : ""}
        <hr style="border:0;border-top:1px dashed rgba(0,0,0,0.15);margin:4px 0;">
        <div class="settings-row"><span>📤 匯出存檔</span>
          <button class="menu-item" id="act-export" style="padding:4px 10px;">複製到剪貼簿</button></div>
        <div class="settings-row"><span>📥 匯入存檔</span>
          <button class="menu-item" id="act-import" style="padding:4px 10px;">貼上字串</button></div>
        <div class="settings-row"><span>重置存檔（清除本機資料）</span>
          <button class="menu-item" id="dbg-reset" style="padding:4px 10px;color:var(--c-red);">重置</button></div>
      </div>`;
    showModal({
      title: "⚙️ 設定 / 除錯",
      body: html,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => {
        const soundBtn = card.querySelector("#toggle-sound");
        if (soundBtn) soundBtn.onclick = () => {
          if (!state.settings) state.settings = {};
          state.settings.soundEnabled = !state.settings.soundEnabled;
          SFX.click();
          save(); closeModal(); openSettingsMenu();
        };
        const motionBtn = card.querySelector("#toggle-motion");
        if (motionBtn) motionBtn.onclick = () => {
          if (!state.settings) state.settings = {};
          state.settings.reducedMotion = !state.settings.reducedMotion;
          applyReducedMotionPref();
          save(); closeModal(); openSettingsMenu();
        };
        const giveBtn = card.querySelector("#dbg-give");
        if (giveBtn) giveBtn.onclick = () => { grantCoin(100, "除錯"); save(); render(); };
        const evolveBtn = card.querySelector("#dbg-evolve");
        if (evolveBtn) evolveBtn.onclick = () => {
          state.pet.growthScore = CFG.stages[state.pet.stage].scoreToEvolve;
          state.pet.stageStartedAt = Date.now() - CFG.stages[state.pet.stage].duration - 1;
          maybeEvolve(); save(); render();
        };
        const newEggBtn = card.querySelector("#act-newegg");
        if (newEggBtn) newEggBtn.onclick = () => { closeModal(); confirmNewEgg(); };
        const expBtn = card.querySelector("#act-export");
        if (expBtn) expBtn.onclick = async () => {
          const b64 = exportSaveBundle();
          if (!b64) { toast("匯出失敗", "bad"); return; }
          try {
            await navigator.clipboard.writeText(b64);
            toast(`✅ 已複製 ${b64.length} 字元到剪貼簿`, "good");
          } catch (_) {
            // fallback: show in prompt for manual copy
            window.prompt("複製這串字元到他處保存：", b64);
          }
        };
        const impBtn = card.querySelector("#act-import");
        if (impBtn) impBtn.onclick = () => {
          const input = window.prompt("貼上之前匯出的存檔字串：");
          if (!input) return;
          if (!confirm("確定要覆蓋現有存檔？建議先匯出當前進度。")) return;
          if (importSaveBundle(input)) {
            toast("✅ 匯入成功，重新載入中…", "good");
            setTimeout(() => location.reload(), 800);
          } else {
            toast("匯入失敗：字串格式不正確", "bad");
          }
        };
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

  function openAchievementsMenu() {
    const ach = state.achievements || {};
    const all = Object.keys(CFG.achievements);
    const got = all.filter(id => ach[id]);
    const rows = all.map(id => {
      const cfg = CFG.achievements[id];
      const have = !!ach[id];
      return `<div class="settings-row" style="${have?"":"opacity:0.4"}">
        <span>${have ? cfg.icon : "🔒"} <strong>${cfg.label}</strong></span>
        <small style="text-align:right;max-width:60%;">${have ? cfg.desc : "??"}</small>
      </div>`;
    }).join("");
    showModal({
      title: `🏅 成就 ${got.length}/${all.length}`,
      body: `<div class="modal-list">${rows}</div>`,
      buttons: [{ label: "關閉", close: true }],
    });
  }

  // ============ Share card ============
  // Implementation moved to src/share.js. This file just exposes a thin alias
  // so existing callers keep working; window.NourishAPI bridges the closure.
  function shareOrDownloadCard(past) {
    return window.NourishShare.shareOrDownloadCard(past);
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
      : past.map((p, idx) => {
          const d = new Date(p.archivedAt || p.bornAt).toLocaleDateString();
          // Show worn-cosmetic icons to keep each pet's identity vivid.
          const accIcons = (() => {
            if (!p.appearance) return "";
            const ids = ["hat","neck","wing"].map(s => p.appearance[s]).filter(Boolean);
            return ids.map(id => CFG.accessories[id]?.icon || "").join("");
          })();
          return `<div class="settings-row pet-row" data-pet-idx="${idx}" style="cursor:pointer;" tabindex="0">
            <span>🐣 <strong>${escapeHtml(p.name || "?")}</strong> · ${formLabel(p.finalForm)}${accIcons ? " " + accIcons : ""}</span>
            <small>${d} · ${p.totalDays}天 ›</small>
          </div>`;
        }).join("");
    const achCount = Object.keys(state.achievements || {}).length;
    const achTotal = Object.keys(CFG.achievements).length;
    showModal({
      title: "📖 圖鑑",
      body: `
        <div class="modal-title" style="font-size:14px;margin:6px 0 4px;">終態收集 ${unlocked.size} / ${allForms.length}</div>
        <div class="modal-list">${formsHTML}</div>
        <div class="modal-title" style="font-size:14px;margin:14px 0 4px;">歷代小雞</div>
        <div class="modal-list">${pastHTML}</div>
        <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="modal-close" id="goto-ach">🏅 成就 ${achCount}/${achTotal}</button>
          <button class="modal-close" id="goto-share">📸 分享卡</button>
        </div>
      `,
      buttons: [{ label: "關閉", close: true }],
      onMount: card => {
        const b = card.querySelector("#goto-ach");
        if (b) b.onclick = () => { closeModal(); openAchievementsMenu(); };
        const s = card.querySelector("#goto-share");
        if (s) s.onclick = () => { closeModal(); shareOrDownloadCard(); };
        // Each past-pet row opens a detail modal — clicking remembers the pet.
        const fullPast = loadDex().completedPets;
        card.querySelectorAll(".pet-row").forEach(row => {
          const open = () => {
            const p = fullPast[parseInt(row.dataset.petIdx, 10)];
            if (p) { closeModal(); openPetDetail(p); }
          };
          row.onclick = open;
          row.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
        });
      },
    });
  }

  function openPetDetail(p) {
    const d = new Date(p.archivedAt || p.bornAt).toLocaleString();
    const born = new Date(p.bornAt).toLocaleString();
    const portrait = (CFG.petArt.adult && CFG.petArt.adult[p.finalForm]) || CFG.petArt.adult.healthy;
    const accList = ["hat","neck","wing"].map(slot => {
      const id = p.appearance && p.appearance[slot];
      if (!id) return null;
      const cfg = CFG.accessories[id];
      if (!cfg) return null;
      return `<div class="settings-row">
        <span><img src="${cfg.art}" width="24" height="24" style="vertical-align:middle;margin-right:6px;">${cfg.icon} ${cfg.label}</span>
        <small>${slot}</small>
      </div>`;
    }).filter(Boolean).join("");
    showModal({
      title: `🐣 ${escapeHtml(p.name || "?")} · ${formLabel(p.finalForm)}`,
      body: `
        <div style="text-align:center;margin:6px 0 10px;">
          <img src="${portrait}" alt="" width="140" height="140"
            style="filter:drop-shadow(0 3px 6px rgba(255,137,167,0.3));">
        </div>
        <div class="modal-list">
          <div class="settings-row"><span>🌟 終態</span><strong>${formLabel(p.finalForm)}</strong></div>
          <div class="settings-row"><span>📅 誕生</span><small>${born}</small></div>
          <div class="settings-row"><span>🌙 退休</span><small>${d}</small></div>
          <div class="settings-row"><span>💝 飼養天數</span><strong>${p.totalDays} 天</strong></div>
        </div>
        ${accList ? `
        <div class="modal-title" style="font-size:13px;margin:10px 0 4px;">當時的穿搭</div>
        <div class="modal-list">${accList}</div>` : `
        <p class="muted center" style="margin-top:8px;">沒有配戴飾品</p>`}
        <p class="muted center" style="margin-top:10px;line-height:1.6;">
          ${formDescription(p.finalForm)}
        </p>
      `,
      buttons: [
        { label: "📸 紀念卡", close: false, action: () => { closeModal(); shareOrDownloadCard(p); } },
        { label: "回圖鑑",   close: false, action: () => { closeModal(); openDexMenu(); } },
      ],
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
    return ({ healthy: "健康成雞", fatty: "圓潤雞", ugly: "迷因雞", divine: "天使雞", fighter: "元氣雞", sage: "智慧雞", diva: "歌姬雞" })[f] || f;
  }
  function formDescription(f) {
    return ({
      healthy: "毛色光亮、神采奕奕，是模範生雞。",
      fatty:   "圓滾滾很可愛，抱起來軟綿綿。",
      ugly:    "毛亂亂的，但反而有種獨特的魅力，有自己的粉絲團。",
      divine:  "粉金光環、純白羽毛，傳說中的天使存在。",
      fighter: "粉色運動帶、活力滿點，跳跳活蹦的元氣派路線。",
      sage:    "戴半月眼鏡、氣質溫柔，思考拼圖累積的智慧路線。",
      diva:    "彩虹尾羽配麥克風，唱歌唱出來的閃亮明星。",
    })[f] || "";
  }

  function pulseEvolve() {
    const img = $("pet-img");
    img.classList.add("evolving");
    setTimeout(() => img.classList.remove("evolving"), 3500);
    spawnEvolveParticles();
  }

  function playReactionAnim(interactionKey) {
    const img = $("pet-img");
    if (!img) return;
    let cls = null, floats = [];
    // TA = 女性，愛撫多愛心 / 玩耍多甜美音符（character-sheet §10.3）
    if (interactionKey.startsWith("feed_"))      { cls = "react-eat";   floats = ["🍴", "♡"]; }
    else if (interactionKey.startsWith("play_")) { cls = "react-shake"; floats = ["♪","🎵","✨"]; }
    else if (interactionKey === "bath")          { cls = "react-bath";  floats = ["🫧","🫧","✨"]; }
    else if (interactionKey === "pet_head")      { cls = "react-love";  floats = ["💕","♡"]; }
    else if (interactionKey === "pet_belly")     { cls = "react-love";  floats = ["💖","♡","♡"]; }
    else if (interactionKey === "talk")          { cls = "react-love";  floats = ["💬","♡"]; }
    if (!cls) return;
    img.classList.remove("react-eat","react-shake","react-bath","react-love");
    void img.offsetWidth; // restart animation
    img.classList.add(cls);
    setTimeout(() => img.classList.remove(cls), 1500);
    floats.forEach((emoji, i) => {
      setTimeout(() => spawnFloatEmoji(emoji, i), i * 220);
    });
  }

  function spawnFloatEmoji(emoji, idx) {
    const wrapper = $("pet-wrapper");
    if (!wrapper) return;
    if (wrapper.querySelectorAll(".float-emoji").length > 8) return; // P1-6 cap
    const el = document.createElement("span");
    el.className = "float-emoji";
    // Hearts get a pink tint to play with the female-oriented palette.
    if (emoji === "♡" || emoji === "💕" || emoji === "💖") el.classList.add("heart");
    el.textContent = emoji;
    el.style.left = (50 + (idx % 2 === 0 ? -1 : 1) * (10 + Math.random() * 20)) + "%";
    el.style.top  = "10%";
    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  // Particle DOM cap so a unlucky combo (evolve + achievement + spam click)
  // can't pile 50+ animated nodes on the stage.
  const PARTICLE_CAP = 30;
  function particleSlotsLeft(stage) {
    return PARTICLE_CAP - stage.querySelectorAll(".particle").length;
  }

  function spawnAchievementParticles() {
    const stage = $("stage");
    if (!stage) return;
    const slots = Math.min(8, particleSlotsLeft(stage));
    if (slots <= 0) return;
    const symbols = ["🏅","✨","⭐","🌟"];
    for (let i = 0; i < slots; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = (i / 8) * Math.PI * 2;
      const dist = 70 + Math.random() * 30;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.left = "50%";
      p.style.top  = "55%";
      p.style.animationDelay = (Math.random() * 0.2) + "s";
      stage.appendChild(p);
      setTimeout(() => p.remove(), 1700);
    }
  }

  function spawnEvolveParticles() {
    const stage = $("stage");
    if (!stage) return;
    const slots = Math.min(14, particleSlotsLeft(stage));
    if (slots <= 0) return;
    const symbols = ["✨","⭐","🌟","💫","✦"];
    for (let i = 0; i < slots; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = (i / slots) * Math.PI * 2 + Math.random() * 0.4;
      // Mobile-safe distance: stage is 480px wide, so cap radius ~110.
      const dist = 90 + Math.random() * 30;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.left = "50%";
      p.style.top  = "55%";
      p.style.animationDelay = (Math.random() * 0.3) + "s";
      stage.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

  // ============ Wants ============
  // Pet broadcasts a specific desire. Fulfilling within the lifetime grants a
  // chunky mood + coin bonus and growth nudge — a far stronger feedback than a
  // generic random event because the player chose to satisfy *this specific* ask.
  function maybeSpawnWant() {
    if (state.pet.want) return;
    if (state.pet.isSleeping) return;
    if (state.pet.stage === "egg") return;
    if (modalOpen) return;
    if (Date.now() < (state.pet.wantCooldownUntil || 0)) return;
    if (Math.random() > CFG.wants.spawnChance) return;
    spawnWant();
  }

  function spawnWant() {
    const stageOrder = ["egg", "chick", "junior", "adult"];
    const curIdx = stageOrder.indexOf(state.pet.stage);
    const eligible = CFG.wants.pool.filter(w => stageOrder.indexOf(w.stage) <= curIdx);
    if (eligible.length === 0) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    state.pet.want = {
      id: pick.id,
      needs: pick.needs,
      text: pick.text,
      icon: pick.icon,
      spawnedAt: Date.now(),
    };
    SFX.want();
    save();
    render();
  }

  function expireWantIfStale() {
    const w = state.pet.want;
    if (!w) return;
    if (Date.now() - w.spawnedAt < CFG.wants.lifetimeMs) return;
    state.pet.want = null;
    state.pet.wantCooldownUntil = Date.now() + CFG.wants.cooldownMs;
    render();
  }

  function fulfillWantIfMatches(interactionKey) {
    const w = state.pet.want;
    if (!w) return;
    if (w.needs !== interactionKey) return;
    const r = CFG.wants.reward;
    state.pet.stats.mood = clamp(state.pet.stats.mood + r.mood, 0, 100);
    grantCoin(r.coin, "滿足願望");
    state.pet.growthScore += r.growth;
    state.pet.want = null;
    state.pet.wantCooldownUntil = Date.now() + CFG.wants.cooldownMs;
    toast(`💖 滿足了 ${w.icon} ${w.text} 的願望！`, "gold");
    speak("謝謝主人！");
  }

  // ============ Random events ============
  let activeEvent = null;
  let eventTimer = null;

  function maybeSpawnEvent() {
    if (activeEvent) return;
    if (state.pet.isSleeping) return;
    if (state.pet.stage === "egg") return;
    if (modalOpen) return;
    // Boost spawn rate during the last 20% of the stage — players who linger
    // near evolution get richer reward density, reinforcing the "守線" loop.
    let chance = CFG.randomEvents.spawnChance;
    const cfg = CFG.stages[state.pet.stage];
    if (cfg && cfg.next) {
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const progress = elapsed / cfg.duration;
      if (progress >= 0.8) chance = Math.min(0.6, chance * 1.6);
    }
    if (Math.random() > chance) return;
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
    if (pick.art) {
      const img = document.createElement("img");
      img.src = pick.art;
      img.alt = pick.label;
      img.draggable = false;
      el.appendChild(img);
    } else if (pick.emoji) {
      el.textContent = pick.emoji;
    }
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
    const fn = RANDOM_EVENT_APPLIES[def.apply || def.id];
    if (fn) fn(state);
    if (def.id === "coin_drop") SFX.coin(); else SFX.event();
    state.pet.growthScore += 3;
    if (def.id === "star") unlockAchievement("star_caught");
    save();
    render();
  }

  // ============ Idle behaviour ============
  let idleTimer = null;

  // Picks a contextual line: stat distress > want nag > time-of-day flavor >
  // stage flavor > generic quirk. Each branch is probabilistic so the same
  // condition doesn't return the same kind of line every tick.
  function pickContextualLine() {
    const s = state.pet.stats;
    const sp = CFG.speech;
    // Critical stats first (return immediately so the player notices)
    if (s.hunger < 8)  return rand0(sp.veryHungry);
    if (s.mood   < 8)  return rand0(sp.verySad);
    if (s.clean  < 8)  return rand0(sp.veryDirty);
    if (s.energy < 8)  return rand0(sp.veryTired);
    if (s.hunger < CFG.thresholds.low) return rand0(sp.hungry);
    if (s.mood   < CFG.thresholds.low) return rand0(sp.sad);
    if (s.clean  < CFG.thresholds.low) return rand0(sp.dirty);
    if (s.energy < CFG.thresholds.low) return rand0(sp.tired);

    // Active want nag — only sometimes, so it's a hint not spam
    if (state.pet.want && Math.random() < 0.25) return rand0(sp.wantNag);

    // All four stats >70 perfect bliss
    const perfect = s.hunger > CFG.thresholds.high && s.mood > CFG.thresholds.high
                 && s.clean  > CFG.thresholds.high && s.energy > CFG.thresholds.high;
    if (perfect && Math.random() < 0.4) return rand0(sp.perfect);

    // Elder companion: long-time adult pets get reflective lines (GDD §10.3).
    // Triggered after 7 days as adult, with growing weight up to 30 days.
    if (state.pet.stage === "adult") {
      const adultDays = (Date.now() - state.pet.stageStartedAt) / 86400000;
      if (adultDays >= 7) {
        const elderChance = Math.min(0.35, 0.15 + (adultDays - 7) * 0.01);
        if (Math.random() < elderChance) return rand0(sp.elder);
      }
    }

    // Probabilistic flavor pool (mix stage / time / quirk)
    const r = Math.random();
    if (r < 0.25) return rand0(sp[`stage_${state.pet.stage}`] || sp.idle);
    if (r < 0.45) {
      const h = new Date().getHours();
      if (h >= 5  && h < 10) return rand0(sp.morning);
      if (h >= 10 && h < 14) return rand0(sp.noon);
      if (h >= 14 && h < 18) return rand0(sp.idle);
      if (h >= 18 && h < 22) return rand0(sp.evening);
      if (h >= 22 || h < 1)  return rand0(sp.night);
      return rand0(sp.lateNight);
    }
    if (r < 0.55 && state.pet.finalForm) {
      return rand0(sp[`form_${state.pet.finalForm}`] || sp.idle);
    }
    if (r < 0.62 && (state.economy?.feedCoin || 0) >= 200) return rand0(sp.rich);
    if (r < 0.78) return rand0(sp.quirk);
    return rand0(sp.idle);
  }

  function startIdleSpeech() {
    if (idleTimer) clearInterval(idleTimer);
    idleTimer = setInterval(() => {
      if (modalOpen || state.pet.isSleeping) return;
      // Slightly biased: ~70% chance to actually speak (silence is also character).
      if (Math.random() > 0.7) return;
      const line = pickContextualLine();
      if (line) speak(line);
    }, 8000);
  }

  // ============ Bootstrap ============
  function applyReducedMotionPref() {
    document.body.classList.toggle("reduce-motion", !!state.settings?.reducedMotion);
  }

  // Bridge for src/share.js — exposes the closure-bound state + helpers it needs.
  // Functions are passed by reference (hoisted), state via getter so it's always live.
  window.NourishAPI = {
    getState: () => state,
    getLastPetSrc: () => lastPetSrc,
    stageLabel,
    formLabel,
    formDescription,
    unlockedFormsSet,
    toast,
  };

  function init() {
    state = load();
    const { elapsedMs } = reconcileOffline();
    handleDailyLogin();
    applyReducedMotionPref();
    save();

    // wire up buttons
    $("btn-feed").onclick    = openFeedMenu;
    $("btn-play").onclick    = openPlayMenu;
    $("btn-bath").onclick    = () => performInteraction("bath");
    $("btn-sleep").onclick   = toggleSleep;
    $("btn-pet").onclick     = openPetMenu;
    $("btn-settings").onclick = openSettingsMenu;
    $("btn-dex").onclick     = openDexMenu;
    $("btn-ach").onclick     = openAchievementsMenu;
    $("btn-shop").onclick    = openShopMenu;
    $("pet-wrapper").onclick = () => performInteraction("pet_head");
    $("stage-name").onclick  = openNameDialog;
    $("stage-name").style.cursor = "pointer";
    $("stage-name").title = "點此取名 / 改名";

    // tick loop (1 sec for smooth UI; stat decay computed by elapsed minutes)
    lastTick = Date.now();
    startTick();
    autoSaveTimer = setInterval(save, CFG.save.autosaveMs);
    eventTimer = setInterval(maybeSpawnEvent, CFG.randomEvents.spawnIntervalMs);
    wantsTimer = setInterval(() => { expireWantIfStale(); maybeSpawnWant(); }, CFG.wants.spawnIntervalMs);
    startIdleSpeech();

    // visibility — when hidden, freeze online tick and let offline reconcile
    // reapply on resume. Avoids ~8h backgrounded tab being treated as online.
    // P1-2: cross-tab race. If another tab writes the save, this tab is now stale.
    // Drop into read-only and prompt for refresh; users see exactly one warning.
    window.addEventListener("storage", e => {
      if (e.key !== CFG.save.key) return;
      if (isReadOnlyTab) return;
      isReadOnlyTab = true;
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
      showModal({
        title: "⚠️ 在另一個分頁開啟",
        body: `<p style="text-align:center;line-height:1.7;">
          偵測到另一個分頁正在玩啾啾日常。<br>
          這個分頁會停在唯讀模式。<br><br>
          <small class="muted">點重新整理可接續另一個分頁的進度。</small>
        </p>`,
        buttons: [{ label: "重新整理", close: false, action: () => location.reload() }],
      });
    });

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

    // Keyboard shortcuts. ESC closes modals (review-v2 P2-8 a11y). Number keys
    // hit primary actions; letters open header menus. Skip when typing in inputs.
    window.addEventListener("keydown", e => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape" && modalOpen) { closeModal(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (modalOpen) return; // don't fire game shortcuts while a menu is open
      switch (e.key) {
        case "1": openFeedMenu(); break;
        case "2": openPlayMenu(); break;
        case "3": performInteraction("bath"); break;
        case "4": toggleSleep(); break;
        case "5": openPetMenu(); break;
        case "a": case "A": openAchievementsMenu(); break;
        case "d": case "D": openDexMenu(); break;
        case "s": case "S": openSettingsMenu(); break;
        case "n": case "N": openNameDialog(); break;
        case "?": case "h": case "H": openHelpDialog(); break;
        default: return;
      }
      e.preventDefault();
    });

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

  function openHelpDialog() {
    showModal({
      title: "⌨️ 鍵盤快捷鍵",
      body: `<div class="modal-list" style="font-size:14px;line-height:1.7;">
        <div class="settings-row"><span><kbd>1</kbd> 餵食</span><span><kbd>2</kbd> 玩耍</span></div>
        <div class="settings-row"><span><kbd>3</kbd> 洗澡</span><span><kbd>4</kbd> 睡眠</span></div>
        <div class="settings-row"><span><kbd>5</kbd> 愛撫</span><span><kbd>N</kbd> 取名</span></div>
        <div class="settings-row"><span><kbd>A</kbd> 成就</span><span><kbd>D</kbd> 圖鑑</span></div>
        <div class="settings-row"><span><kbd>S</kbd> 設定</span><span><kbd>ESC</kbd> 關閉視窗</span></div>
        <div class="settings-row"><span><kbd>?</kbd> 顯示這份提示</span><span></span></div>
      </div>`,
      buttons: [{ label: "好的", close: true }],
    });
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
