/* 啾啾日常 ChickaDay — render subsystem (DOM dirty-cache + frame writes)
 *
 * Single render() does the per-tick DOM diff: stat bars + cached stat-wrap
 * lookups, coin counter, stage / countdown text, pet image (computePetSrc),
 * pre-evolve glow, accessory overlays, mood overlay (computeMoodKey),
 * sleep overlay, want bubble, background, action button states + bath
 * cooldown text (setActionState), streak hint, stage hint (computeStageHint),
 * daily task footer, install banner gate.
 *
 * Cache variables are module-internal `let`s — render() skips writes when
 * value matches last frame, saving ~17 ops/tick when stats are idle. Caller
 * (game.js startNewEgg) calls resetCaches() when state is wholesale replaced.
 *
 * State accessed lazily via window.NourishAPI.getState(). Pure utilities
 * via NourishUtils (statColor / formatTime). NourishAPI bridges (stageLabel /
 * formLabel) for label resolution. NourishInteractions (unlocked /
 * isOnCooldown) for action gating. NourishDex for adult-stage hint.
 *
 * Loaded via <script src="src/render.js"> AFTER cfg / utils / ui /
 * interactions / dex, BEFORE game.js. iter#166 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }
  const $ = id => document.getElementById(id);

  // ---- Dirty-check caches: skip DOM writes when value matches last frame --
  let lastPetSrc = null, lastMoodSrc = null, lastBgKey = null;
  let lastStatVals = { hunger: null, mood: null, clean: null, energy: null };
  let lastCoin = null, lastStageName = null, lastCountdown = null, lastTaskStr = null;
  let lastStreakStr = null, lastStreakHint = null;
  let cachedStatWraps = null;

  function resetCaches() {
    lastPetSrc = lastMoodSrc = lastBgKey = null;
    lastStatVals = { hunger: null, mood: null, clean: null, energy: null };
    lastCoin = lastStageName = lastCountdown = lastTaskStr = null;
    lastStreakStr = lastStreakHint = null;
  }

  // ---- Pure helpers -------------------------------------------------------

  // Pick the mood overlay icon key based on current state.
  function computeMoodKey(state) {
    const s = state.pet.stats;
    const C = cfg();
    if (state.pet.isSleeping) return "sleeping";
    if (s.clean < C.thresholds.low)  return "dirty";
    if (s.mood  < C.thresholds.low)  return "sad";
    if (s.hunger< C.thresholds.low)  return "sad";
    if (s.mood  > C.thresholds.high) return "happy";
    return null;
  }

  // Choose the right pet sprite based on current stage + finalForm.
  function computePetSrc(state) {
    const C = cfg();
    if (state.pet.stage === "egg") {
      return state.pet.growthScore >= C.stages.egg.scoreToEvolve * 0.5
        ? C.petArt.egg2 : C.petArt.egg;
    }
    if (state.pet.stage === "chick")  return C.petArt.chick;
    if (state.pet.stage === "junior") return C.petArt.junior;
    return C.petArt.adult[state.pet.finalForm || "healthy"] || C.petArt.adult.healthy;
  }

  // Stage-aware guidance hint. Pure — render() handles display.
  function computeStageHint(state) {
    const C = cfg();
    const h = state.history || {};
    const totalPet = h.petCount || 0;
    const totalFeed = h.feedCount || 0;
    if (state.pet.stage === "egg") {
      const elapsedEgg = Date.now() - state.pet.stageStartedAt;
      const eggDur = C.stages.egg.duration;
      const eggScoreReady = state.pet.growthScore >= C.stages.egg.scoreToEvolve * 0.85;
      if (eggScoreReady && elapsedEgg >= eggDur * 0.85) return t("stage.egg.hatch");
      if (totalPet === 0) return t("stage.egg.first");
      if (state.pet.growthScore < C.stages.egg.scoreToEvolve * 0.5) return t("stage.egg.lowscore");
      return null;
    }
    if (state.pet.stage === "chick" && totalFeed < 1) return t("stage.chick.feed");
    if (state.pet.stage === "chick" && !state.pet.nameSet) return t("stage.chick.name");
    if (state.pet.stage === "adult") {
      const elapsedAdult = Date.now() - state.pet.stageStartedAt;
      const ownedAccCount = Object.keys(state.pet.ownedAccessories || {}).length;
      const dexUnlocked = window.NourishDex.unlockedFormsSet().size;
      if (elapsedAdult < 3 * 60 * 60 * 1000 && ownedAccCount === 0) return t("install.shopnudge");
      if (dexUnlocked < 3) return t("stage.adult.dex");
      if (elapsedAdult > 7 * 24 * 60 * 60 * 1000) return t("stage.adult.egg");
      return null;
    }
    const stageCfg = C.stages[state.pet.stage];
    if (stageCfg && stageCfg.next) {
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const progress = elapsed / stageCfg.duration;
      const scoreReady = state.pet.growthScore >= stageCfg.scoreToEvolve * 0.7;
      if (progress >= 0.92 && scoreReady) {
        if (state.pet.stage === "chick")  return t("stage.chick.next");
        if (state.pet.stage === "junior") return t("stage.junior.next");
      }
    }
    return null;
  }

  // ---- Install banner gate (PWA A2HS) -------------------------------------

  function maybeShowInstallBanner(state) {
    const banner = $("install-banner");
    if (!banner) return;
    const hide = () => { if (!banner.hidden) banner.hidden = true; };
    if (state.settings && state.settings.installBannerDismissed) return hide();
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return hide();
    if (!window.__nourishInstallPrompt) return hide();
    const playtime = Date.now() - (state.createdAt || Date.now());
    if (playtime < cfg().timing.installBannerDelayMs) return hide();
    if (banner.hidden) banner.hidden = false;
  }

  function dismissInstallBanner(persist) {
    const banner = $("install-banner");
    if (banner) banner.hidden = true;
    if (persist) {
      const A = api();
      const state = A.getState();
      if (!state.settings) state.settings = {};
      state.settings.installBannerDismissed = true;
      A.save();
    }
  }

  // ---- Action button gating + bath cooldown -------------------------------

  function setActionState(state) {
    const sleeping = state.pet.isSleeping;
    $("btn-feed").disabled  = sleeping;
    $("btn-play").disabled  = sleeping || state.pet.stage === "egg";
    $("btn-bath").disabled  = sleeping || !window.NourishInteractions.unlocked(cfg().interactions.bath.unlock) || window.NourishInteractions.isOnCooldown("bath");
    $("btn-sleep").disabled = state.pet.stage === "egg";
    $("btn-pet").disabled   = sleeping;

    // bath cooldown indicator
    const cdEl = $("cd-bath");
    if (window.NourishInteractions.isOnCooldown("bath")) {
      const ms = state.cooldowns["bath"] - Date.now();
      cdEl.textContent = utils().formatTime(ms, true);
      cdEl.hidden = false;
    } else {
      cdEl.hidden = true;
    }
  }

  // ---- Main render --------------------------------------------------------

  function render() {
    const A = api();
    const state = A.getState();
    const C = cfg();
    const s = state.pet.stats;
    if (!cachedStatWraps) {
      cachedStatWraps = {};
      for (const k of ["hunger", "mood", "clean", "energy"]) {
        cachedStatWraps[k] = document.querySelector(`.stat[data-stat="${k}"]`);
      }
    }
    for (const k of ["hunger", "mood", "clean", "energy"]) {
      const v = Math.round(s[k]);
      if (lastStatVals[k] !== v) {
        $("val-" + k).textContent = v;
        const bar = $("bar-" + k);
        bar.style.width = v + "%";
        bar.style.background = utils().statColor(s[k]);
        lastStatVals[k] = v;
      }
      cachedStatWraps[k].dataset.warn = s[k] < C.thresholds.low ? "true" : "false";
    }
    if (lastCoin !== state.economy.feedCoin) {
      $("val-coin").textContent = state.economy.feedCoin;
      lastCoin = state.economy.feedCoin;
    }

    // stage / countdown — both dirty-checked.
    const stageCfg = C.stages[state.pet.stage];
    const nameTag = state.pet.nameSet ? `${state.pet.name} · ` : "";
    const stageStr = nameTag + A.stageLabel(state.pet.stage) +
      (state.pet.finalForm ? `（${A.formLabel(state.pet.finalForm)}）` : "");
    if (lastStageName !== stageStr) {
      $("stage-name").textContent = stageStr;
      lastStageName = stageStr;
    }
    let countdownStr;
    if (stageCfg.next) {
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const remainMs = Math.max(0, stageCfg.duration - elapsed);
      const score = state.pet.growthScore;
      const need = Math.max(0, stageCfg.scoreToEvolve - score);
      // P2-10: explain *why* a "ready" pet hasn't evolved yet.
      if (remainMs > 0) {
        countdownStr = `下一階段 ${utils().formatTime(remainMs)} · 成長 ${Math.round(score)}/${stageCfg.scoreToEvolve}`;
      } else if (need > 0) {
        countdownStr = `再多互動 ${Math.ceil(need)} 點就能進化`;
      } else {
        countdownStr = `準備進化中…`;
      }
    } else {
      countdownStr = `成長 ${Math.round(state.pet.growthScore)}`;
    }
    if (lastCountdown !== countdownStr) {
      $("stage-countdown").textContent = countdownStr;
      lastCountdown = countdownStr;
    }

    const petImg = $("pet-img");

    // Pre-evolve glow.
    const preEvolveLevel = (() => {
      if (!stageCfg.next) return null;
      if (state.pet.stage === "egg") return null;
      if (state.pet.isSleeping) return null;
      const elapsed2 = Date.now() - state.pet.stageStartedAt;
      const remain2 = stageCfg.duration - elapsed2;
      const scoreReady = state.pet.growthScore >= stageCfg.scoreToEvolve * 0.7;
      if (!scoreReady || remain2 <= 0) return null;
      const window = Math.max(60 * 60 * 1000, stageCfg.duration * 0.08);
      if (remain2 <= 30 * 60 * 1000) return "imminent";
      if (remain2 <= window) return "soon";
      return null;
    })();
    petImg.classList.toggle("pre-evolve", preEvolveLevel === "soon");
    petImg.classList.toggle("pre-evolve-imminent", preEvolveLevel === "imminent");

    // pet image (cached)
    const petSrc = computePetSrc(state);
    if (lastPetSrc !== petSrc) { petImg.src = petSrc; lastPetSrc = petSrc; }
    petImg.classList.toggle("dim",
      s.mood < C.thresholds.low || s.hunger < C.thresholds.low);
    // Egg-shake progression.
    petImg.classList.remove("egg-shake-low", "egg-shake-med", "egg-shake-high");
    if (state.pet.stage === "egg" && !state.pet.isSleeping) {
      const eggThreshold = C.stages.egg.scoreToEvolve;
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const timeProgress = Math.min(1, elapsed / C.stages.egg.duration);
      const scoreProgress = Math.min(1, state.pet.growthScore / eggThreshold);
      const progress = (timeProgress + scoreProgress) / 2;
      if (progress >= 0.85) petImg.classList.add("egg-shake-high");
      else if (progress >= 0.5) petImg.classList.add("egg-shake-med");
      else petImg.classList.add("egg-shake-low");
    }

    // accessory overlays
    const ACC_SLOTS = ["hat", "face", "neck", "wing"];
    const eqByPet = state.pet.appearance || {};
    ACC_SLOTS.forEach(slot => {
      const equipId = eqByPet[slot];
      const el = $("acc-" + slot);
      if (!el) return;
      if (equipId && C.accessories[equipId]) {
        const src = C.accessories[equipId].art;
        if (el.dataset.id !== equipId) { el.src = src; el.dataset.id = equipId; }
        el.hidden = false;
      } else {
        el.hidden = true;
        el.removeAttribute("data-id");
      }
    });

    // mood overlay
    const moodIcon = $("mood-icon");
    const moodKey = computeMoodKey(state);
    if (moodKey) {
      const src = C.moodArt[moodKey];
      if (lastMoodSrc !== src) { moodIcon.src = src; lastMoodSrc = src; }
      moodIcon.hidden = false;
    } else {
      moodIcon.hidden = true;
      lastMoodSrc = null;
    }

    // sleep overlay
    document.getElementById("stage").classList.toggle("sleeping", state.pet.isSleeping);
    $("sleep-label").textContent = state.pet.isSleeping ? t("btn.wake") : t("btn.sleep");

    // wants bubble
    const wantEl = $("want-bubble");
    if (state.pet.want && !state.pet.isSleeping) {
      const r = C.wants.reward;
      wantEl.innerHTML = `${state.pet.want.icon} ${state.pet.want.text}<span class="want-mark">!</span>`
        + `<small class="want-reward"> +${r.mood}❤️ +${r.coin}💰</small>`;
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
    setActionState(state);

    // streak — show next milestone preview via tooltip + aria.
    const streakVal = state.daily.loginStreak || 0;
    const streakStr = `🔥 連續 ${streakVal} 天`;
    let streakHint;
    if (streakVal < 7)       streakHint = `再 ${7 - streakVal} 天領 ${C.economy.streak7} FC`;
    else if (streakVal < 30) streakHint = `再 ${30 - streakVal} 天領 ${C.economy.streak30} FC`;
    else                     streakHint = `已達最高連續獎勵 🎉`;
    if (lastStreakStr !== streakStr || lastStreakHint !== streakHint) {
      const el = $("streak");
      el.textContent = streakStr;
      el.title = streakHint;
      el.setAttribute("aria-label", `連續登入 ${streakVal} 天，${streakHint}`);
      lastStreakStr = streakStr;
      lastStreakHint = streakHint;
    }
    // Stage-aware guidance hint.
    const hintEl = $("stage-hint");
    if (hintEl) {
      const hint = computeStageHint(state);
      if (hint) { hintEl.textContent = hint; hintEl.hidden = false; }
      else      { hintEl.hidden = true; }
    }
    // daily tasks footer
    const tasks = (state.daily && state.daily.tasks) || {};
    const parts = [];
    if (tasks.feed_count) parts.push(`🍗 ${tasks.feed_count.current}/${tasks.feed_count.target}`);
    if (tasks.play_count) parts.push(`🎮 ${tasks.play_count.current}/${tasks.play_count.target}`);
    if (tasks.pet_count)  parts.push(`💝 ${tasks.pet_count.current}/${tasks.pet_count.target}`);
    const allDone = ["feed_count","play_count","pet_count"]
      .every(k => tasks[k] && tasks[k].current >= tasks[k].target);
    const taskStr = allDone
      ? t("task.allDone")
      : t("task.today", { parts: parts.join(" · ") });
    if (lastTaskStr !== taskStr) {
      $("task-text").textContent = taskStr;
      lastTaskStr = taskStr;
    }

    maybeShowInstallBanner(state);
  }

  window.NourishRender = {
    render,
    resetCaches,
    dismissInstallBanner,
    getLastPetSrc: () => lastPetSrc,
  };
})();
