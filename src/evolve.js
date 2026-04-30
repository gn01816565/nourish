/* 啾啾日常 ChickaDay — stage / final-form evolution subsystem
 *
 * maybeEvolve: time + growthScore gate → bump to next stage; on adult,
 * delegate to finalizeForm. finalizeForm: trait priority chain
 * (perfect/divine → diva → sage → fighter → fatty → ugly → healthy
 * fallback) sets pet.finalForm + reward + celebration modal, with a
 * "孵化新蛋" branch that defers to confirmNewEgg.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects
 * routed via NourishAPI (toast / save / render / grantCoin / speak /
 * stageLabel / formLabel / formDescription / checkAchievements /
 * startNewEgg). Animation via window.NourishAnim, SFX via
 * window.NourishAudio.SFX, modal via window.NourishUI.
 *
 * Loaded via <script src="src/evolve.js"> AFTER cfg / utils / ui /
 * animations / audio, BEFORE game.js. iter#148 R-1 partial.
 */
(function () {
  "use strict";

  function api() { return window.NourishAPI; }
  function cfg() { return window.NourishCFG; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function maybeEvolve() {
    const A = api(); if (!A) return;
    const state = A.getState();
    const stage = state.pet.stage;
    const stageCfg = cfg().stages[stage];
    if (!stageCfg.next) return; // adult — final form handled separately
    const elapsed = Date.now() - state.pet.stageStartedAt;
    const ready = elapsed >= stageCfg.duration && state.pet.growthScore >= stageCfg.scoreToEvolve;
    if (!ready) return;
    state.pet.stage = stageCfg.next;
    state.pet.stageStartedAt = Date.now();
    if (window.NourishAnim) window.NourishAnim.pulseEvolve();
    const SFX = window.NourishAudio && window.NourishAudio.SFX;
    if (SFX) SFX.evolve();
    A.toast(`進化！現在是${A.stageLabel(stageCfg.next)}！`, "gold");
    A.grantCoin(20, t("toast.coin.evolve"));
    if (stageCfg.next === "adult") finalizeForm();
  }

  function finalizeForm() {
    const A = api();
    const state = A.getState();
    const tr = state.pet.traits;
    let form = "healthy";
    // Order matters: rarer / more-virtuous outcomes first.
    if (tr.perfectStreakMinutes >= 1440 && state.pet.growthScore >= 2000) form = "divine";
    else if (tr.singCount >= 20) form = "diva";
    else if (tr.intelligencePoints >= 30) form = "sage";
    else if (tr.battlePoints >= 30) form = "fighter";
    else if (tr.feedCount >= 60) form = "gourmet";
    else if (tr.eventsCaught >= 25) form = "explorer";
    else if (tr.fatPoints >= 10) form = "fatty";
    else if (tr.lowMoodMinutes >= 720) form = "ugly";
    state.pet.finalForm = form;
    A.grantCoin(cfg().economy.evolveReward, t("toast.coin.finalForm"));
    if (window.NourishAnim) window.NourishAnim.spawnEvolveParticles();
    if (A.checkAchievements) A.checkAchievements();
    const days = Math.max(1, Math.round((Date.now() - state.pet.bornAt) / 86400000));
    window.NourishUI.showModal({
      title: t("modal.evolve.title", { form: A.formLabel(form) }),
      body: `<p style="text-align:center;line-height:1.7;">${t("modal.evolve.body", { days, name: state.pet.name, form: A.formLabel(form), desc: A.formDescription(form) })}</p>`,
      buttons: [
        { label: t("modal.evolve.btnContinue"), close: true },
        { label: t("modal.evolve.btnNewEgg"),   close: false, action: () => confirmNewEgg() },
      ],
    });
  }

  function confirmNewEgg() {
    const A = api();
    const state = A.getState();
    window.NourishUI.showModal({
      title: t("modal.startNew.title"),
      body: `<p style="text-align:center;line-height:1.7;">${t("modal.startNew.body", { name: state.pet.name || "啾啾" })}</p>`,
      buttons: [
        { label: t("button.cancel"), close: true },
        { label: t("modal.startNew.btnConfirm"), close: false, action: () => {
            window.NourishUI.closeModal();
            if (A.startNewEgg) A.startNewEgg();
          } },
      ],
    });
  }

  window.NourishEvolve = { maybeEvolve, finalizeForm, confirmNewEgg };
})();
