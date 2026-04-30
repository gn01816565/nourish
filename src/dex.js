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
  const CAP = 50;
  // Final form ids — derived from CFG.finalForms so the list stays in sync.
  const FINAL_FORMS = Object.keys((window.NourishCFG && window.NourishCFG.finalForms) || {});

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
    if (dex.completedPets.length > CAP) trimWithPinned(dex);
    saveDex(dex);
  }

  // P2-6 (iter#77): preserve memorial pets when capping. Naive `length = CAP`
  // drops oldest = "first pet ever" + the first instance of each rare final
  // form, which are exactly the entries with the most emotional weight.
  function trimWithPinned(dex) {
    const pets = dex.completedPets;
    const pinned = new Set();
    // First-ever pet (oldest = last element since unshift puts newest at 0)
    if (pets.length) pinned.add(pets[pets.length - 1].id);
    // First (= oldest) occurrence of each final form
    for (const form of FINAL_FORMS) {
      for (let i = pets.length - 1; i >= 0; i--) {
        if (pets[i].finalForm === form) { pinned.add(pets[i].id); break; }
      }
    }
    // Drop oldest non-pinned until at cap. Walk from oldest (end) inward.
    for (let i = pets.length - 1; i >= 0 && pets.length > CAP; i--) {
      if (!pinned.has(pets[i].id)) pets.splice(i, 1);
    }
  }

  window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet };
})();
