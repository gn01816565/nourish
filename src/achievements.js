/* 啾啾日常 ChickaDay — Achievements rule engine
 *
 * Pure logic: takes a state snapshot + dex-unlocked-forms set, returns the list
 * of achievement IDs whose conditions are currently met. Side-effects (toast,
 * SFX, particles, state mutation) stay in game.js's `unlockAchievement`.
 *
 * Loaded via <script src="src/achievements.js"> AFTER cfg.js, BEFORE game.js.
 * Reads window.NourishCFG.accessories for collector-style checks.
 */
(function () {
  "use strict";

  const CFG = window.NourishCFG;
  if (!CFG) throw new Error("achievements.js: NourishCFG missing — load cfg.js first");

  // Lookup of seasonal event IDs (year-agnostic) for the seasonal_3 collector
  // achievement. Built once at load time from cfg's seasonal pool.
  const SEASONAL_IDS = new Set((CFG.seasonalEvents?.pool || []).map(e => e.id));

  // iter#222 — Cross-axis mixing achievements.
  // Maps each accessory ID to its aesthetic axis (per GDD §5.5). Hardcoded here
  // to avoid invasive schema migration on cfg.accessories; new accessories
  // should be added to this map when shipped (axis_mixer + rainbow_collector
  // achievements depend on it). v0.6 candidate: migrate to cfg.accessories.axis
  // field for canonical reference.
  const ACCESSORY_AXIS = {
    party_hat: "vitality", headband: "cottagecore", bow: "cottagecore",
    flower: "cottagecore", crown: "cottagecore", pin_butterfly: "cottagecore",
    star_clip: "y2k", chef_hat: "coquette", strawberry_clip: "coquette",
    sunglasses: "cleangirl", blush: "cleangirl",
    glasses_thin: "sage", round_glasses: "dark_academia",
    necklace: "cottagecore", scarf: "cottagecore", lace_collar: "cottagecore",
    ribbon_tie: "balletcore", cd_pendant: "y2k",
    wings: "fairycore", wings_fairy: "fairycore",
    fringe_ribbon: "boho", straw_hat: "boho",
    velvet_bow: "dark_academia",
    minimal_chain: "minimalist", minimal_pin: "minimalist",
    decora_clips: "kawaii_decora", plush_bow: "kawaii_decora",
  };
  function appearanceAxes(appearance) {
    return new Set(["hat","face","neck","wing"]
      .map(s => appearance && appearance[s])
      .filter(Boolean)
      .map(id => ACCESSORY_AXIS[id])
      .filter(Boolean));
  }
  function ownedAxes(ownedAcc) {
    return new Set(Object.keys(ownedAcc || {})
      .map(id => ACCESSORY_AXIS[id])
      .filter(Boolean));
  }

  function evaluate(state, dexUnlocked) {
    const h = state.history || {};
    const ownedAcc = state.pet.ownedAccessories || {};
    const appearance = state.pet.appearance || {};
    const stageElapsed = state.pet.stage === "adult"
      ? (Date.now() - state.pet.stageStartedAt)
      : 0;
    return [
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
      ["form_gourmet",  dexUnlocked.has("gourmet")],
      ["form_explorer", dexUnlocked.has("explorer")],
      ["form_warmheart",dexUnlocked.has("warmheart")],
      ["form_drifter",  dexUnlocked.has("drifter")],
      ["form_curator",  dexUnlocked.has("curator")],
      ["collect_3",     dexUnlocked.size >= 3],
      ["collect_5",     dexUnlocked.size >= 5],
      ["collect_all",   dexUnlocked.size >= 12],
      ["rich",          (state.economy?.totalEarned || 0) >= 500],
      ["perfect_day",   (state.pet.traits?.perfectStreakMinutes || 0) >= 30],
      ["dressup_first", Object.keys(ownedAcc).length >= 1],
      ["dressup_set",   !!(appearance.hat && appearance.neck && appearance.wing)],
      ["dressup_collector", Object.keys(ownedAcc).length >= Object.keys(CFG.accessories).length],
      ["face_first",    Object.entries(ownedAcc).some(([id]) => CFG.accessories[id]?.slot === "face")],
      ["dressup_full",  !!(appearance.hat && appearance.face && appearance.neck && appearance.wing)],
      ["elder_week",    state.pet.stage === "adult" && stageElapsed >= 7  * 86400000],
      ["elder_month",   state.pet.stage === "adult" && stageElapsed >= 30 * 86400000],
      ["wants_10",      (h.wantsFulfilled || 0) >= 10],
      ["wants_50",      (h.wantsFulfilled || 0) >= 50],
      ["events_100",    (h.eventsCaught || 0) >= 100],
      ["seasonal_3",    Object.keys(h.eventIds || {}).filter(id => SEASONAL_IDS.has(id)).length >= 3],
      // iter#222 cross-axis mixing achievements (per GDD §5.5 跨軸 mixing-mode)
      ["axis_mixer",    appearanceAxes(appearance).size >= 2],
      ["rainbow_collector", ownedAxes(ownedAcc).size >= 4],
      // Excludes itself from the count to avoid the awkward "25 → unlock master,
      // which makes 26, but master required 25" pre-state (we want the player
      // to have 25 *non-master* achievements first).
      ["master_player", Object.keys(state.achievements || {})
                          .filter(id => id !== "master_player").length >= 25],
    ];
  }

  window.NourishAchievements = { evaluate };
})();
