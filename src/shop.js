/* 啾啾日常 ChickaDay — accessory shop subsystem (v0.3 起步)
 *
 * Catalog grouped by slot (hat / face / neck / wing) sorted by price ascending.
 * Each row: art + icon + cfgLabel + price button (or 已配戴 / 戴上 toggle).
 * Buy: spend feedCoin → ownedAccessories[id] = ts → re-render menu.
 * Equip: toggle pet.appearance[slot] between id and null → re-render.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects routed
 * via NourishAPI (toast / save / render / spendCoin / checkAchievements).
 * Audio via window.NourishAudio.SFX, modal via window.NourishUI.
 *
 * Loaded via <script src="src/shop.js"> AFTER cfg / utils / ui / audio,
 * BEFORE game.js. iter#151 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function isOwned(id) {
    const state = api().getState();
    return !!(state.pet.ownedAccessories && state.pet.ownedAccessories[id]);
  }

  function buy(id) {
    const A = api();
    const state = A.getState();
    const def = cfg().accessories[id];
    if (!def) return;
    if (isOwned(id)) return;
    const SFX = window.NourishAudio && window.NourishAudio.SFX;
    if (state.economy.feedCoin < def.price) {
      A.toast(t("toast.poor"), "bad");
      if (SFX) SFX.fail();
      return;
    }
    A.spendCoin(def.price);
    if (!state.pet.ownedAccessories) state.pet.ownedAccessories = {};
    state.pet.ownedAccessories[id] = Date.now();
    if (SFX) SFX.coin();
    A.toast(t("toast.shop.unlocked", { name: utils().cfgLabel(def) }), "gold");
    if (A.checkAchievements) A.checkAchievements();
    A.save();
    openMenu();
  }

  function equip(id) {
    const A = api();
    const state = A.getState();
    const def = cfg().accessories[id];
    if (!def) return;
    if (!isOwned(id)) return;
    if (!state.pet.appearance) state.pet.appearance = { hat: null };
    state.pet.appearance[def.slot] = state.pet.appearance[def.slot] === id ? null : id;
    const SFX = window.NourishAudio && window.NourishAudio.SFX;
    if (SFX) SFX.click();
    if (A.checkAchievements) A.checkAchievements();
    A.save();
    A.render();
    openMenu();
  }

  function openMenu() {
    const A = api();
    const state = A.getState();
    const equipped = state.pet.appearance || {};
    // Group by slot so the catalog stays scannable as it grows.
    const SLOT_LABELS = {
      hat:  t("modal.shop.slot.hat"),
      face: t("modal.shop.slot.face"),
      neck: t("modal.shop.slot.neck"),
      wing: t("modal.shop.slot.wing"),
    };
    const SLOT_ORDER = ["hat", "face", "neck", "wing"];
    const grouped = {};
    Object.entries(cfg().accessories).forEach(([id, c]) => {
      (grouped[c.slot] = grouped[c.slot] || []).push({ id, c });
    });
    SLOT_ORDER.forEach(slot => {
      if (grouped[slot]) grouped[slot].sort((a, b) => (a.c.price || 0) - (b.c.price || 0));
    });
    const buildRow = ({ id, c }) => {
      const owned = isOwned(id);
      const isOn = equipped[c.slot] === id;
      const action = !owned
        ? `<button class="menu-item" data-buy="${id}" ${state.economy.feedCoin < c.price ? "disabled" : ""}
             style="padding:4px 10px;color:var(--c-red);">${c.price} FC</button>`
        : `<button class="menu-item" data-equip="${id}" style="padding:4px 10px;${isOn?"background:var(--c-pink);":""}">${isOn ? t("modal.shop.btnEquipped") : t("modal.shop.btnEquip")}</button>`;
      return `<div class="settings-row">
        <span><img src="${c.art}" width="32" height="32" style="vertical-align:middle;margin-right:6px;">${c.icon} ${utils().cfgLabel(c)}</span>
        ${action}
      </div>`;
    };
    const sections = SLOT_ORDER
      .filter(slot => grouped[slot] && grouped[slot].length)
      .map(slot => `
        <div class="modal-title" style="font-size:13px;margin:10px 0 4px;color:var(--c-pink-deep);">${SLOT_LABELS[slot]}</div>
        <div class="modal-list">${grouped[slot].map(buildRow).join("")}</div>
      `).join("");
    window.NourishUI.showModal({
      title: t("modal.shop.title"),
      body: `${sections}
        <p class="muted center" style="margin-top:8px;">${t("modal.shop.footer", { coin: state.economy.feedCoin })}</p>`,
      buttons: [{ label: t("button.close"), close: true }],
      onMount: card => {
        card.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => buy(b.dataset.buy));
        card.querySelectorAll("[data-equip]").forEach(b => b.onclick = () => equip(b.dataset.equip));
      },
    });
  }

  window.NourishShop = { openMenu, buy, equip, isOwned };
})();
