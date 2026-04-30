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
    else if (tr.petCount >= 50) form = "warmheart";
    // iter#216 drifter: derived from cross-life ownedAccessories diversity (NOT per-pet trait counter).
    // Reads ownedAccessories Object.keys count at evolve time — meta-progression award.
    else if (Object.keys(state.pet.ownedAccessories || {}).length >= 8) form = "drifter";
    // iter#234 curator: minimalist 派生 form 第二例 — 跟 drifter 對稱反向「克制收藏家」.
    // Triggers when ownedAccessories ≤ 3 (低收藏 narrative「不堆量」) AND perfectStreakMinutes ≥ 60 (高品質照顧).
    // Placed AFTER drifter so high-collectors get drifter, restraint-collectors get curator.
    else if (Object.keys(state.pet.ownedAccessories || {}).length <= 3 && tr.perfectStreakMinutes >= 60) form = "curator";
    // iter#241 farmhand: cottagecore 派生 form 第三例 — 「全方位平衡照顧者」narrative.
    // Triggers when eventsCaught ≥ 10 AND feedCount ≥ 15 AND petCount ≥ 15 — 三 trait 同時 moderate
    // 而非單一極端 (高 single trait 玩家已被前面 sage/diva/fighter/gourmet/explorer/warmheart 抓走).
    // Placed AFTER curator BEFORE fatty fallback so 平衡 caretakers get farmhand, negligent get fatty/ugly.
    else if (tr.eventsCaught >= 10 && tr.feedCount >= 15 && tr.petCount >= 15) form = "farmhand";
    // iter#244 netizen: y2k 派生 form 第四例 — 「數位原住民 / 跨命見多識廣」narrative.
    // Triggers when cross-life dex unlocked forms ≥ 5 — old-timer meta-progression award.
    // Reads window.NourishDex.unlockedFormsSet() at evolve time (cross-life storage).
    // Excludes current pet from count via .size BEFORE current pet's evolve (current pet's form just being decided).
    // Placed AFTER farmhand so balanced caretakers get farmhand first, veterans get netizen as catch-all.
    else if (window.NourishDex && window.NourishDex.unlockedFormsSet().size >= 5) form = "netizen";
    // iter#246 scholar: dark academia 派生 form 第五例 — 「學者持續鑽研 / 持續登入老玩家」narrative.
    // Triggers when state.daily.loginStreak ≥ 14 — day-based streak meta-progression (5th source type, vs prior 4 stat-based).
    // Placed AFTER netizen so dex-veterans get netizen first, daily-streak-only get scholar.
    else if ((state.daily?.loginStreak || 0) >= 14) form = "scholar";
    // iter#248 maximalist: kawaii-decora 派生 form 第六例 — 「繁飾家 / 累積成就家」narrative.
    // Triggers when cross-life achievement count ≥ 20 — 6th source type (achievement count, vs prior 5 stat/dex/streak-based).
    // Placed AFTER scholar so daily-streak-only get scholar first, achievement-grinders get maximalist.
    // form-less 軸補 form 6/6 milestone — 完成 boho/minimalist/cottagecore/y2k/dark academia/kawaii-decora 全 6 軸 form 補完
    else if (Object.keys(state.achievements || {}).length >= 20) form = "maximalist";
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
      body: `<p style="text-align:center;line-height:1.7;">${t("modal.startNew.body", { name: state.pet.name || t("pet.defaultName") })}</p>`,
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
