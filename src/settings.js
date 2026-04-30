/* 啾啾日常 ChickaDay — settings menu (3-tab modal)
 *
 * Single screen with three tabs: 🐣 啾啾 (pet stats + traits + history),
 * ⚙️ 設定 (sound / motion / notify / install), 💾 存檔 (newEgg /
 * export / import / debug / reset). Tab choice persists across re-opens
 * via module-internal _activeTab. WAI-ARIA arrow-key cycling supported.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects via
 * NourishAPI (toast / save / render / grantCoin / maybeEvolve /
 * applyReducedMotionPref / isDebug / startNewEgg path indirect),
 * NourishUI (showModal / closeModal), NourishAudio (SFX),
 * NourishNotify (supported / requestPermission / show), NourishSave
 * (exportBundle / importBundle), NourishEvolve (confirmNewEgg).
 *
 * Loaded via <script src="src/settings.js"> AFTER cfg / utils / ui /
 * audio / notifications / save / evolve, BEFORE game.js. iter#165 R-1.
 */
(function () {
  "use strict";

  const DEX_KEY = "nourish.dex.v1"; // sync with src/dex.js storage key

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function ui()    { return window.NourishUI; }
  function notify(){ return window.NourishNotify; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  let _activeTab = "settings"; // remembered between re-opens; defaults to most-used tab

  function openMenu() {
    const A = api();
    const C = cfg();
    const state = A.getState();
    const tr = state.pet.traits;
    const tabClass = (key) => _activeTab === key ? " active" : "";
    // Section: 🐣 啾啾 — pet stats, traits progression, lifetime counters
    // Trait rows are data-driven from CFG.traitsDisplay.
    const traitRows = C.traitsDisplay.map(d => {
      const v = d.round ? Math.round(tr[d.key]) : tr[d.key];
      return `<div class="settings-row"><span>${d.icon} ${d.label}</span><strong>${v}/${d.cap} → ${d.form}</strong></div>`;
    }).join("");
    // GDD §10.3 elder companion: visible bond counter so the time investment
    // is legible. Pairs with elder_week / elder_month achievements + idle.js
    // form-specific elder speech (active after adultDays >= 7).
    const bondDays = Math.max(0, Math.floor((Date.now() - state.pet.bornAt) / 86400000));
    const sectionPet = `
      <div class="modal-list">
        <div class="settings-row"><span>${t("modal.settings.pet.streak")}</span><strong>${t("modal.settings.pet.streakDays", { n: state.daily.loginStreak || 0 })}</strong></div>
        <div class="settings-row"><span>${t("modal.settings.pet.bond")}</span><strong>${t("modal.settings.pet.streakDays", { n: bondDays })}</strong></div>
        <div class="settings-row"><span>${t("modal.settings.pet.growth")}</span><strong>${Math.round(state.pet.growthScore)}</strong></div>
        <div class="settings-row"><span>${t("modal.settings.pet.born")}</span><strong>${new Date(state.pet.bornAt).toLocaleString()}</strong></div>
        ${traitRows}
        <div class="settings-row"><span>${t("modal.settings.pet.wishes")}</span><strong>${t("modal.settings.pet.timesUnit", { n: state.history?.wantsFulfilled || 0 })}</strong></div>
        <div class="settings-row"><span>${t("modal.settings.pet.events")}</span><strong>${t("modal.settings.pet.timesUnit", { n: state.history?.eventsCaught || 0 })}</strong></div>
      </div>`;
    // Section: ⚙️ 設定 — preferences (sound / motion / notify / install)
    const sectionPrefs = `
      <div class="modal-list">
        <div class="settings-row"><span>${t("modal.settings.prefs.sound")}</span>
          <button class="menu-item" id="toggle-sound" style="padding:4px 10px;">${state.settings?.soundEnabled === false ? t("modal.settings.toggle.off") : t("modal.settings.toggle.on")}</button></div>
        <div class="settings-row"><span>${t("modal.settings.prefs.motion")}</span>
          <button class="menu-item" id="toggle-motion" style="padding:4px 10px;">${state.settings?.reducedMotion ? t("modal.settings.toggle.on") : t("modal.settings.toggle.followsSystem")}</button></div>
        <div class="settings-row"><span>${t("modal.settings.prefs.notify")}</span>
          <button class="menu-item" id="toggle-notify" style="padding:4px 10px;">${
            !notify().supported() ? t("modal.settings.toggle.unsupported") :
            (typeof Notification !== "undefined" && Notification.permission === "denied") ? t("modal.settings.toggle.blocked") :
            (state.settings?.notificationsEnabled && Notification.permission === "granted") ? t("modal.settings.toggle.granted") :
            t("modal.settings.toggle.tapToEnable")
          }</button></div>
        ${window.__nourishInstallPrompt ? `
        <div class="settings-row"><span>${t("modal.settings.prefs.install")}</span>
          <button class="menu-item" id="act-install" style="padding:4px 10px;color:var(--c-pink-deep);">${t("modal.settings.btn.install")}</button></div>
        ` : ""}
      </div>`;
    // Section: 💾 存檔 — save management + dangerous ops
    const isDebug = !!(A.isDebug && A.isDebug());
    const sectionSave = `
      <div class="modal-list">
        ${state.pet.finalForm ? `
        <div class="settings-row"><span>${t("modal.settings.save.newEgg")}</span>
          <button class="menu-item" id="act-newegg" style="padding:4px 10px;color:var(--c-orange);">${t("modal.settings.btn.start")}</button></div>
        ` : ""}
        <div class="settings-row"><span>${t("modal.settings.save.export")}</span>
          <button class="menu-item" id="act-export" style="padding:4px 10px;">${t("modal.settings.btn.copy")}</button></div>
        <div class="settings-row"><span>${t("modal.settings.save.import")}</span>
          <button class="menu-item" id="act-import" style="padding:4px 10px;">${t("modal.settings.btn.paste")}</button></div>
        ${isDebug ? `
        <div class="settings-row"><span>${t("modal.settings.debug.give100")}</span>
          <button class="menu-item" id="dbg-give" style="padding:4px 10px;">+100</button></div>
        <div class="settings-row"><span>${t("modal.settings.debug.skipStage")}</span>
          <button class="menu-item" id="dbg-evolve" style="padding:4px 10px;">⏭️</button></div>
        ` : ""}
        <div class="settings-row"><span>${t("modal.settings.save.reset")}</span>
          <button class="menu-item" id="dbg-reset" style="padding:4px 10px;color:var(--c-red);">${t("modal.settings.btn.reset")}</button></div>
      </div>`;
    const html = `
      <nav class="settings-tabs" role="tablist" aria-label="${t("modal.settings.tabsAria")}">
        <button class="settings-tab${tabClass("pet")}" data-tab="pet" role="tab">${t("modal.settings.tab.pet")}</button>
        <button class="settings-tab${tabClass("settings")}" data-tab="settings" role="tab">${t("modal.settings.tab.prefs")}</button>
        <button class="settings-tab${tabClass("save")}" data-tab="save" role="tab">${t("modal.settings.tab.save")}</button>
      </nav>
      <div class="settings-pane${tabClass("pet")}" data-tab="pet" role="tabpanel">${sectionPet}</div>
      <div class="settings-pane${tabClass("settings")}" data-tab="settings" role="tabpanel">${sectionPrefs}</div>
      <div class="settings-pane${tabClass("save")}" data-tab="save" role="tabpanel">${sectionSave}</div>`;
    ui().showModal({
      title: t("modal.settings.title"),
      body: html,
      buttons: [{ label: t("button.close"), close: true }],
      onMount: card => {
        // Tab switching: hide all panes, show clicked one. Persist choice.
        const tabBtns = card.querySelectorAll(".settings-tab");
        const switchTab = (target) => {
          _activeTab = target;
          tabBtns.forEach(b => {
            b.classList.toggle("active", b.dataset.tab === target);
            b.setAttribute("aria-selected", b.dataset.tab === target ? "true" : "false");
          });
          card.querySelectorAll(".settings-pane").forEach(p => p.classList.toggle("active", p.dataset.tab === target));
        };
        tabBtns.forEach((btn, idx) => {
          btn.onclick = () => switchTab(btn.dataset.tab);
          // a11y: ArrowLeft/Right cycle between tabs (WAI-ARIA tabs pattern)
          btn.onkeydown = (e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
            e.preventDefault();
            let nextIdx = idx;
            if (e.key === "ArrowLeft")  nextIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
            if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabBtns.length;
            if (e.key === "Home")       nextIdx = 0;
            if (e.key === "End")        nextIdx = tabBtns.length - 1;
            tabBtns[nextIdx].focus();
            switchTab(tabBtns[nextIdx].dataset.tab);
          };
        });
        const SFX = window.NourishAudio && window.NourishAudio.SFX;
        const soundBtn = card.querySelector("#toggle-sound");
        if (soundBtn) soundBtn.onclick = () => {
          if (!state.settings) state.settings = {};
          state.settings.soundEnabled = !state.settings.soundEnabled;
          if (SFX) SFX.click();
          A.save(); ui().closeModal(); openMenu();
        };
        const motionBtn = card.querySelector("#toggle-motion");
        if (motionBtn) motionBtn.onclick = () => {
          if (!state.settings) state.settings = {};
          state.settings.reducedMotion = !state.settings.reducedMotion;
          if (A.applyReducedMotionPref) A.applyReducedMotionPref();
          A.save(); ui().closeModal(); openMenu();
        };
        const notifyBtn = card.querySelector("#toggle-notify");
        if (notifyBtn) notifyBtn.onclick = async () => {
          if (!state.settings) state.settings = {};
          if (!notify().supported()) { A.toast(t("toast.notify.unsupported"), "bad"); return; }
          if (state.settings.notificationsEnabled && Notification.permission === "granted") {
            // Toggle off
            state.settings.notificationsEnabled = false;
            A.save(); ui().closeModal(); openMenu();
            return;
          }
          const result = await notify().requestPermission();
          if (result === "granted") {
            state.settings.notificationsEnabled = true;
            await notify().show(t("share.title.live"), t("toast.notify.welcome", { name: state.pet.name || "啾啾" }));
            A.save(); ui().closeModal(); openMenu();
          } else {
            A.toast(result === "denied" ? t("toast.notify.blocked") : t("toast.notify.notGranted"), "bad");
          }
        };
        const installBtn = card.querySelector("#act-install");
        if (installBtn) installBtn.onclick = async () => {
          const prompt = window.__nourishInstallPrompt;
          if (!prompt) { A.toast(t("toast.notify.unsupportedInstall"), "bad"); return; }
          prompt.prompt();
          try {
            const result = await prompt.userChoice;
            if (result.outcome === "accepted") {
              A.toast(t("toast.install.success"), "good");
              window.__nourishInstallPrompt = null;
              ui().closeModal();
            }
          } catch (_) {}
        };
        const giveBtn = card.querySelector("#dbg-give");
        if (giveBtn) giveBtn.onclick = () => { A.grantCoin(100, t("toast.coin.debug")); A.save(); A.render(); };
        const evolveBtn = card.querySelector("#dbg-evolve");
        if (evolveBtn) evolveBtn.onclick = () => {
          const C2 = cfg();
          state.pet.growthScore = C2.stages[state.pet.stage].scoreToEvolve;
          state.pet.stageStartedAt = Date.now() - C2.stages[state.pet.stage].duration - 1;
          window.NourishEvolve.maybeEvolve(); A.save(); A.render();
        };
        const newEggBtn = card.querySelector("#act-newegg");
        if (newEggBtn) newEggBtn.onclick = () => { ui().closeModal(); window.NourishEvolve.confirmNewEgg(); };
        const expBtn = card.querySelector("#act-export");
        if (expBtn) expBtn.onclick = async () => {
          const b64 = window.NourishSave.exportBundle();
          if (!b64) { A.toast(t("toast.export.fail"), "bad"); return; }
          try {
            await navigator.clipboard.writeText(b64);
            A.toast(t("toast.export.copied", { len: b64.length }), "good");
          } catch (_) {
            // fallback: show in prompt for manual copy
            window.prompt(t("prompt.export.fallback"), b64);
          }
        };
        const impBtn = card.querySelector("#act-import");
        if (impBtn) impBtn.onclick = () => {
          const input = window.prompt(t("prompt.import.input"));
          if (!input) return;
          if (!confirm(t("prompt.import.confirm"))) return;
          if (window.NourishSave.importBundle(input)) {
            A.toast(t("toast.import.ok"), "good");
            setTimeout(() => location.reload(), 800);
          } else {
            A.toast(t("toast.import.fail"), "bad");
          }
        };
        card.querySelector("#dbg-reset").onclick = () => {
          if (confirm(t("prompt.reset.confirm"))) {
            localStorage.removeItem(C.save.key);
            localStorage.removeItem(DEX_KEY);
            location.reload();
          }
        };
      },
    });
  }

  window.NourishSettings = { openMenu };
})();
