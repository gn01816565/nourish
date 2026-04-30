/* 啾啾日常 ChickaDay — daily login + task tracker subsystem
 *
 * Daily login: streak tracking by ISO date, login bonus + 7/30-day milestones,
 * delayed greeting line. Tasks: feed/play/pet counters reset on new day,
 * 20 FC reward when filled. History: per-interaction lifetime counters
 * fed by interactions code path.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects routed
 * via NourishAPI (grantCoin / speak / checkAchievements).
 *
 * Loaded via <script src="src/daily.js"> AFTER cfg / utils, BEFORE game.js.
 * iter#144 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function resetTasks() {
    const state = api().getState();
    state.daily.tasks = {
      feed_count: { current: 0, target: 5, claimed: false },
      play_count: { current: 0, target: 3, claimed: false },
      pet_count:  { current: 0, target: 4, claimed: false },
    };
  }

  function handleLogin() {
    const A = api();
    const state = A.getState();
    const C = cfg();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    if (state.daily.lastLoginDay === todayStr) return;
    const lastDay = state.daily.lastLoginDay ? new Date(state.daily.lastLoginDay) : null;
    if (lastDay) {
      const diff = Math.round((today - lastDay) / 86400000);
      state.daily.loginStreak = diff === 1 ? (state.daily.loginStreak || 0) + 1 : 1;
    } else {
      state.daily.loginStreak = 1;
    }
    state.daily.lastLoginDay = todayStr;
    resetTasks();
    A.grantCoin(C.economy.dailyLogin, t("toast.coin.dailyLogin"));
    if (state.daily.loginStreak === 7)  A.grantCoin(C.economy.streak7,  t("toast.coin.streak7"));
    if (state.daily.loginStreak === 30) A.grantCoin(C.economy.streak30, t("toast.coin.streak30"));
    // Greeting after a small delay so it doesn't collide with the welcome-back
    // modal which itself runs ~600ms after init.
    if (state.pet.stage !== "egg") {
      setTimeout(() => {
        const lines = utils().tArray("speech.dailyGreet", (C.speech && C.speech.dailyGreet) || []);
        if (lines.length) A.speak(utils().rand0(lines));
      }, 1200);
    }
    if (A.checkAchievements) A.checkAchievements();
  }

  function bumpHistory(interactionKey) {
    const state = api().getState();
    if (!state.history) state.history = { totalSessions: 0 };
    const h = state.history;
    if (interactionKey.startsWith("feed_")) {
      h.feedCount = (h.feedCount || 0) + 1;
      // Mirror to per-pet trait counter so finalForm "gourmet" path can resolve.
      if (state.pet.traits) state.pet.traits.feedCount = (state.pet.traits.feedCount || 0) + 1;
    }
    else if (interactionKey === "bath")                h.bathCount = (h.bathCount || 0) + 1;
    else if (interactionKey.startsWith("play_"))       h.playCount = (h.playCount || 0) + 1;
    else if (interactionKey.startsWith("pet_") || interactionKey === "talk") {
      h.petCount  = (h.petCount  || 0) + 1;
      // Mirror to per-pet trait counter so finalForm "warmheart" path can resolve.
      if (state.pet.traits) state.pet.traits.petCount = (state.pet.traits.petCount || 0) + 1;
    }
  }

  function trackTask(interactionKey) {
    const A = api();
    const state = A.getState();
    if (!state.daily.tasks) resetTasks();
    const tasks = state.daily.tasks;
    let bumped = null;
    if (interactionKey.startsWith("feed_"))      bumped = tasks.feed_count;
    else if (interactionKey.startsWith("play_")) bumped = tasks.play_count;
    else if (interactionKey.startsWith("pet_"))  bumped = tasks.pet_count;
    if (!bumped) return;
    if (bumped.current < bumped.target) bumped.current += 1;
    if (bumped.current >= bumped.target && !bumped.claimed) {
      bumped.claimed = true;
      A.grantCoin(20, t("toast.coin.taskDone"));
    }
  }

  window.NourishDaily = { handleLogin, resetTasks, bumpHistory, trackTask };
})();
