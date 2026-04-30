/* 啾啾日常 ChickaDay — wants subsystem
 *
 * Pet broadcasts a specific desire (textKey + needs interaction). Fulfilling
 * within lifetime grants chunky mood + coin + growth bonus — stronger feedback
 * than a generic random event because the player chose to satisfy *this ask*.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects routed
 * via NourishAPI (save / render / grantCoin / toast / speak). Audio via
 * window.NourishAudio.SFX.
 *
 * Loaded via <script src="src/wants.js"> AFTER cfg / i18n / utils / audio,
 * BEFORE game.js. iter#142 R-1 partial.
 */
(function () {
  "use strict";

  function api() { return window.NourishAPI; }
  function cfg() { return window.NourishCFG; }
  function t(k, opts) { return window.NourishI18n ? window.NourishI18n.t(k, opts) : k; }
  function clamp(v, lo, hi) { return window.NourishUtils.clamp(v, lo, hi); }

  function maybeSpawn() {
    const A = api(); if (!A) return;
    const state = A.getState();
    if (state.pet.want) return;
    if (state.pet.isSleeping) return;
    if (state.pet.stage === "egg") return;
    if (window.NourishUI && window.NourishUI.isModalOpen()) return;
    if (Date.now() < (state.pet.wantCooldownUntil || 0)) return;
    if (Math.random() > cfg().wants.spawnChance) return;
    spawnNow();
  }

  function spawnNow() {
    const A = api(); if (!A) return;
    const state = A.getState();
    const stageOrder = ["egg", "chick", "junior", "adult"];
    const curIdx = stageOrder.indexOf(state.pet.stage);
    const eligible = cfg().wants.pool.filter(w => stageOrder.indexOf(w.stage) <= curIdx);
    if (eligible.length === 0) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    state.pet.want = {
      id: pick.id,
      needs: pick.needs,
      text: pick.textKey ? t(pick.textKey) : pick.text,
      icon: pick.icon,
      spawnedAt: Date.now(),
    };
    if (window.NourishAudio && window.NourishAudio.SFX) window.NourishAudio.SFX.want();
    A.save();
    A.render();
  }

  function expireIfStale() {
    const A = api(); if (!A) return;
    const state = A.getState();
    const w = state.pet.want;
    if (!w) return;
    if (Date.now() - w.spawnedAt < cfg().wants.lifetimeMs) return;
    state.pet.want = null;
    state.pet.wantCooldownUntil = Date.now() + cfg().wants.cooldownMs;
    A.render();
  }

  function fulfillIfMatches(interactionKey) {
    const A = api(); if (!A) return;
    const state = A.getState();
    const w = state.pet.want;
    if (!w) return;
    if (w.needs !== interactionKey) return;
    const r = cfg().wants.reward;
    state.pet.stats.mood = clamp(state.pet.stats.mood + r.mood, 0, 100);
    A.grantCoin(r.coin, t("toast.want.reason") || "滿足願望");
    state.pet.growthScore += r.growth;
    state.pet.want = null;
    state.pet.wantCooldownUntil = Date.now() + cfg().wants.cooldownMs;
    if (!state.history) state.history = {};
    state.history.wantsFulfilled = (state.history.wantsFulfilled || 0) + 1;
    A.toast(t("toast.want.fulfilled", { icon: w.icon, text: w.text }) || `💖 滿足了 ${w.icon} ${w.text} 的願望！`, "gold");
    A.speak(t("toast.want.thanks") || "謝謝主人！");
  }

  window.NourishWants = { maybeSpawn, expireIfStale, fulfillIfMatches };
})();
