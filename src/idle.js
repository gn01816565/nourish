/* 啾啾日常 ChickaDay — idle ambient speech subsystem
 *
 * Every 8s, picks a contextual line and speaks it (~70% of the time —
 * silence is also character). Priority order: critical stat distress →
 * normal stat distress → want nag → all-stats-perfect bliss → elder
 * reflection (>= 7 days as adult) → probabilistic flavor pool (stage /
 * time-of-day / final form / rich / quirk / generic idle).
 *
 * State accessed lazily via window.NourishAPI.getState(). Speech via
 * NourishAPI.speak. Modal-open + sleep guards skip a tick.
 *
 * Loaded via <script src="src/idle.js"> AFTER cfg / utils / ui, BEFORE
 * game.js. iter#145 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }

  let timer = null;

  function pickLine() {
    const state = api().getState();
    const s = state.pet.stats;
    const sp = cfg().speech;
    const th = cfg().thresholds;
    const r0 = utils().rand0;

    // Critical stats first (return immediately so the player notices)
    if (s.hunger < 8)  return r0(utils().tArray("speech.veryHungry", sp.veryHungry));
    if (s.mood   < 8)  return r0(utils().tArray("speech.verySad",    sp.verySad));
    if (s.clean  < 8)  return r0(utils().tArray("speech.veryDirty",  sp.veryDirty));
    if (s.energy < 8)  return r0(utils().tArray("speech.veryTired",  sp.veryTired));
    if (s.hunger < th.low) return r0(utils().tArray("speech.hungry", sp.hungry));
    if (s.mood   < th.low) return r0(utils().tArray("speech.sad",    sp.sad));
    if (s.clean  < th.low) return r0(utils().tArray("speech.dirty",  sp.dirty));
    if (s.energy < th.low) return r0(utils().tArray("speech.tired",  sp.tired));

    // Active want nag — only sometimes, so it's a hint not spam
    if (state.pet.want && Math.random() < 0.25) return r0(utils().tArray("speech.wantNag", sp.wantNag));

    // All four stats > high threshold → perfect bliss
    const perfect = s.hunger > th.high && s.mood > th.high
                 && s.clean  > th.high && s.energy > th.high;
    if (perfect && Math.random() < 0.4) return r0(utils().tArray("speech.perfect", sp.perfect));

    // Elder companion: long-time adult pets get reflective lines (GDD §10.3).
    // Triggered after 7 days as adult, with growing weight up to 30 days.
    if (state.pet.stage === "adult") {
      const adultDays = (Date.now() - state.pet.stageStartedAt) / 86400000;
      if (adultDays >= 7) {
        const elderChance = Math.min(0.35, 0.15 + (adultDays - 7) * 0.01);
        if (Math.random() < elderChance) return r0(utils().tArray("speech.elder", sp.elder));
      }
    }

    // Probabilistic flavor pool (mix stage / time / quirk)
    const r = Math.random();
    if (r < 0.25) {
      const stageKey = `stage_${state.pet.stage}`;
      return r0(utils().tArray(`speech.${stageKey}`, sp[stageKey] || sp.idle));
    }
    if (r < 0.45) {
      const h = new Date().getHours();
      if (h >= 5  && h < 10) return r0(utils().tArray("speech.morning",   sp.morning));
      if (h >= 10 && h < 14) return r0(utils().tArray("speech.noon",      sp.noon));
      if (h >= 14 && h < 18) return r0(utils().tArray("speech.idle",      sp.idle));
      if (h >= 18 && h < 22) return r0(utils().tArray("speech.evening",   sp.evening));
      if (h >= 22 || h < 1)  return r0(utils().tArray("speech.night",     sp.night));
      return r0(utils().tArray("speech.lateNight", sp.lateNight));
    }
    if (r < 0.55 && state.pet.finalForm) {
      const formKey = `form_${state.pet.finalForm}`;
      return r0(utils().tArray(`speech.${formKey}`, sp[formKey] || sp.idle));
    }
    if (r < 0.62 && (state.economy?.feedCoin || 0) >= 200) return r0(utils().tArray("speech.rich", sp.rich));
    if (r < 0.78) return r0(utils().tArray("speech.quirk", sp.quirk));
    return r0(utils().tArray("speech.idle", sp.idle));
  }

  function start() {
    stop();
    timer = setInterval(() => {
      const A = api(); if (!A) return;
      const state = A.getState();
      if (window.NourishUI && window.NourishUI.isModalOpen()) return;
      if (state.pet.isSleeping) return;
      // Slightly biased: ~70% chance to actually speak (silence is also character).
      if (Math.random() > 0.7) return;
      const line = pickLine();
      if (line) A.speak(line);
    }, 8000);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  window.NourishIdle = { start, stop, pickLine };
})();
