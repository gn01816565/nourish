/* 啾啾日常 ChickaDay — save / load / migration subsystem
 *
 * Pure I/O layer: defaultState() factory, migrate(parsed) version gate,
 * loadFromStorage() returns a ready-to-use state, writeToStorage(state)
 * stamps updatedAt and writes JSON. Quota errors surface via NourishAPI
 * toast (caller passes nothing — wrapper handles).
 *
 * Caller (game.js) holds the closure-bound `state` variable and the
 * `isReadOnlyTab` cross-tab gate; this module is purely state-in / -out.
 *
 * Loaded via <script src="src/save.js"> AFTER cfg / utils, BEFORE game.js.
 * iter#154 R-1 partial.
 */
(function () {
  "use strict";

  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function defaultState() {
    const C = cfg();
    const now = Date.now();
    return {
      schemaVersion: C.save.schemaVersion,
      createdAt: now,
      updatedAt: now,
      lastTickAt: now,
      pet: {
        id: utils().cryptoRandomId(),
        name: "啾啾",
        stage: "egg",
        finalForm: null,
        stageStartedAt: now,
        bornAt: now,
        growthScore: 0,
        stats: { hunger: 80, mood: 80, clean: 80, energy: 80 },
        traits: { fatPoints: 0, battlePoints: 0, intelligencePoints: 0, singCount: 0, lowMoodMinutes: 0, perfectStreakMinutes: 0, feedCount: 0, eventsCaught: 0 },
        nameSet: false,
        want: null,                  // active want (see CFG.wants); null when none
        wantCooldownUntil: 0,        // ms timestamp; suppress new spawns before this
        isSleeping: false,
        appearance: { hat: null, face: null, neck: null, wing: null }, // currently-equipped accessory id per slot
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
      history: { totalSessions: 0, feedCount: 0, bathCount: 0, petCount: 0, playCount: 0, wantsFulfilled: 0, eventsCaught: 0, eventIds: {} },
      achievements: {},
      settings: { soundEnabled: true, reducedMotion: false, notificationsEnabled: false, lastNotifyAt: 0 },
    };
  }

  function migrate(data) {
    if (!data.schemaVersion || data.schemaVersion < 1) return defaultState();
    return utils().deepMerge(defaultState(), data);
  }

  function loadFromStorage() {
    let raw = null;
    try { raw = localStorage.getItem(cfg().save.key); } catch (_) {}
    if (!raw) return defaultState();
    try {
      const parsed = JSON.parse(raw);
      return migrate(parsed);
    } catch (e) {
      console.warn("Save corrupt, starting fresh.", e);
      return defaultState();
    }
  }

  function writeToStorage(state) {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(cfg().save.key, JSON.stringify(state));
    } catch (e) {
      // Surface quota errors so the player knows their progress is at risk.
      if (e && (e.name === "QuotaExceededError" || e.code === 22)) {
        const A = window.NourishAPI;
        if (A && A.toast) A.toast(t("toast.save.quota"), "bad");
      }
      console.warn("Save failed:", e);
    }
  }

  // ---- Export / import bundle (manual cloud-sync stand-in) -----------------
  // Bundle save + dex into a single base64 string the player can paste into a
  // new browser / device. v: 1 lets future bumps reject older formats.

  function exportBundle() {
    const A = window.NourishAPI;
    if (!A || !window.NourishDex) return null;
    const bundle = {
      v: 1,
      exportedAt: Date.now(),
      save: A.getState(),
      dex:  window.NourishDex.loadDex(),
    };
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(bundle))));
    } catch (_) { return null; }
  }

  function importBundle(b64) {
    try {
      const raw = decodeURIComponent(escape(atob(b64.trim())));
      const bundle = JSON.parse(raw);
      if (!bundle || !bundle.save || bundle.v !== 1) return false;
      localStorage.setItem(cfg().save.key, JSON.stringify(bundle.save));
      if (bundle.dex) localStorage.setItem("nourish.dex.v1", JSON.stringify(bundle.dex));
      return true;
    } catch (_) { return false; }
  }

  window.NourishSave = { defaultState, migrate, loadFromStorage, writeToStorage, exportBundle, importBundle };
})();
