/* 啾啾日常 ChickaDay — Dex (永久圖鑑) module
 *
 * Storage layer for the cross-life pet dex. Loaded via <script src="src/dex.js">
 * AFTER cfg.js + share.js, BEFORE game.js. Independent localStorage key so a
 * corrupt save file doesn't drag the dex with it.
 *
 * Reads window.NourishCFG (eager) and window.NourishAPI (lazy at call time).
 * UI rendering (openDexMenu / openPetDetail) stays in game.js — this file owns
 * read/write/aggregate only.
 */
(function () {
  "use strict";

  const KEY = "nourish.dex.v1";

  function api() {
    const a = window.NourishAPI;
    if (!a) throw new Error("dex.js: NourishAPI missing — game.js must run first");
    return a;
  }

  function loadDex() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { schemaVersion: 1, completedPets: [] };
      const d = JSON.parse(raw);
      if (!Array.isArray(d.completedPets)) d.completedPets = [];
      return d;
    } catch (_) { return { schemaVersion: 1, completedPets: [] }; }
  }

  function saveDex(dex) {
    try { localStorage.setItem(KEY, JSON.stringify(dex)); }
    catch (e) {
      if (e && (e.name === "QuotaExceededError" || e.code === 22)) {
        api().toast("⚠️ 圖鑑空間不足", "bad");
      }
    }
  }

  function unlockedFormsSet() {
    const set = new Set();
    loadDex().completedPets.forEach(p => p.finalForm && set.add(p.finalForm));
    const state = api().getState();
    if (state.pet.finalForm) set.add(state.pet.finalForm);
    return set;
  }

  function archiveCurrentPet() {
    const state = api().getState();
    if (!state.pet.finalForm) return;
    const dex = loadDex();
    // Snapshot equipped cosmetics so the dex remembers each pet's "moment in time".
    const appearanceSnapshot = state.pet.appearance
      ? { hat:  state.pet.appearance.hat  || null,
          neck: state.pet.appearance.neck || null,
          wing: state.pet.appearance.wing || null }
      : null;
    dex.completedPets.unshift({
      id: state.pet.id,
      name: state.pet.name,
      finalForm: state.pet.finalForm,
      appearance: appearanceSnapshot,
      bornAt: state.pet.bornAt,
      archivedAt: Date.now(),
      totalDays: Math.max(1, Math.round((Date.now() - state.pet.bornAt) / 86400000)),
    });
    if (dex.completedPets.length > 50) dex.completedPets.length = 50; // cap
    saveDex(dex);
  }

  window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet };
})();
