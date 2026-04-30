/* 啾啾日常 ChickaDay — UI primitives module
 *
 * Self-contained DOM helpers that don't need any game state. First slice of
 * R-A step 2 (拆 ui.js) — only toast + speak for now. Modal / menus / showImagePreview
 * will follow in subsequent rounds as their dependencies untangle.
 *
 * Loaded via <script src="src/ui.js"> AFTER cfg.js, BEFORE game.js.
 *
 * Public surface:
 *   window.NourishUI.toast(msg, kind?)         // floating toast (good/bad/gold)
 *   window.NourishUI.speak(text)               // speech bubble over the pet
 *   window.NourishUI.showImagePreview(url, title, onClose)  // iOS share fallback (used by share.js)
 */
(function () {
  "use strict";

  // i18n wrapper — lazy access to window.NourishI18n so script load order
  // (cfg → i18n → ui) doesn't matter at IIFE-init time. Falls back to literal
  // key text if i18n missing (defensive — shouldn't happen given load order).
  const t = (key, opts) => window.NourishI18n ? window.NourishI18n.t(key, opts) : key;

  function toast(msg, kind = "") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  let speakTimer = null;
  function speak(text) {
    const bubble = document.getElementById("speech-bubble");
    if (!bubble) return;
    bubble.textContent = text;
    bubble.hidden = false;
    clearTimeout(speakTimer);
    speakTimer = setTimeout(() => { bubble.hidden = true; }, 2000);
  }

  // Image preview overlay used by share.js when neither native share nor
  // download work (iOS standalone PWA). Same DOM as the inline version that
  // lived in share.js — moved here so share.js can stop carrying UI code.
  function showImagePreview(url, title, onClose) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);"
      + "z-index:100;display:flex;flex-direction:column;align-items:center;"
      + "justify-content:center;padding:20px;";
    overlay.innerHTML = `
      <div style="color:white;font-weight:700;margin-bottom:12px;font-size:16px;">${title}</div>
      <img src="${url}" style="max-width:90%;max-height:70vh;border-radius:18px;
        border:3px solid #2C2C2C;background:white;" alt="分享卡">
      <p style="color:white;margin-top:14px;font-size:13px;line-height:1.6;text-align:center;">
        💡 <strong>長按上方圖片</strong>選「儲存到照片」<br>
        <small style="opacity:0.8;">(iOS PWA 限制無法直接下載)</small>
      </p>
      <button id="ios-preview-close" style="margin-top:12px;padding:8px 22px;
        background:#FFD86B;border:2px solid #2C2C2C;border-radius:999px;
        font-weight:700;cursor:pointer;font-family:inherit;">關閉</button>
    `;
    overlay.addEventListener("click", e => {
      if (e.target === overlay || e.target.id === "ios-preview-close") {
        overlay.remove();
        if (onClose) onClose();
      }
    });
    document.body.appendChild(overlay);
  }

  // ============ Modal helpers ============
  // Single shared modal slot (#modal/#modal-card in index.html). All openX menus
  // funnel through showModal to keep behavior + a11y consistent.
  let modalOpen = false;
  let modalButtons = [];
  let modalReturnFocus = null;  // a11y: restore focus to opener on close

  function showModal({ title, body, buttons = [], onMount }) {
    const modal = document.getElementById("modal");
    const card = document.getElementById("modal-card");
    if (!modal || !card) return;
    modalButtons = buttons;
    // Remember opener so we can hand focus back on close.
    modalReturnFocus = (document.activeElement && document.activeElement !== document.body)
      ? document.activeElement : null;
    card.innerHTML = `
      <div class="modal-title">${title}</div>
      ${body}
      <div style="display:flex;gap:8px;justify-content:center;margin-top:14px;">
        ${buttons.map((b, i) => `<button class="modal-close" data-btn="${i}">${b.label}</button>`).join("")}
      </div>`;
    modal.hidden = false;
    modalOpen = true;
    if (onMount) onMount(card);
    // Bind action buttons.
    card.querySelectorAll("[data-btn]").forEach(el => {
      el.onclick = () => {
        const i = parseInt(el.dataset.btn, 10);
        const btn = modalButtons[i];
        if (!btn) return;
        if (btn.action) btn.action();
        if (btn.close !== false) closeModal();
      };
    });
    // Backdrop click closes.
    const bg = document.querySelector(".modal-bg");
    if (bg) bg.onclick = closeModal;
    // Move focus into the dialog (input first, else first button).
    setTimeout(() => {
      const focusTarget = card.querySelector("input, textarea")
        || card.querySelector("button, [tabindex]:not([tabindex='-1'])");
      if (focusTarget) focusTarget.focus();
    }, 0);
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.hidden = true;
    modalOpen = false;
    const target = modalReturnFocus;
    modalReturnFocus = null;
    if (target && document.contains(target)) {
      try { target.focus(); } catch (_) {}
    }
  }

  function isModalOpen() { return modalOpen; }

  // Focus trap — Tab cycles within modal-card's focusable descendants.
  document.addEventListener("keydown", e => {
    if (!modalOpen || e.key !== "Tab") return;
    const card = document.getElementById("modal-card");
    if (!card) return;
    const focusables = card.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, true);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    })[c]);
  }

  // ============ Static onboarding & help dialogs ============
  // Pure-display modals — no game state dependency. Lift to UI module so
  // game.js doesn't carry their HTML literals.
  function showOnboarding() {
    showModal({
      title: t("onboarding.title"),
      body: `<div style="line-height:1.7;font-size:13px;">
        <p>${t("onboarding.egg")}</p>
        <p>${t("onboarding.stats")}</p>
        <p>${t("onboarding.offline")}</p>
        <p>${t("onboarding.evolve")}</p>
      </div>`,
      buttons: [{ label: t("onboarding.start"), close: true }],
    });
  }

  function showOnboardingPart2() {
    showModal({
      title: t("onboarding2.title"),
      body: `<div style="line-height:1.8;font-size:13px;">
        <p>${t("onboarding2.shop")}</p>
        <p>${t("onboarding2.dex")}</p>
        <p>${t("onboarding2.ach")}</p>
        <p>${t("onboarding2.want")}</p>
        <p>${t("onboarding2.share")}</p>
      </div>
      <p class="muted center" style="margin-top:8px;">${t("onboarding2.kbd")}</p>`,
      buttons: [{ label: t("onboarding2.btn"), close: true }],
    });
  }

  function openHelpDialog() {
    showModal({
      title: t("help.title"),
      body: `<div class="modal-list" style="font-size:14px;line-height:1.7;">
        <div class="settings-row"><span><kbd>1</kbd> ${t("help.feed")}</span><span><kbd>2</kbd> ${t("help.play")}</span></div>
        <div class="settings-row"><span><kbd>3</kbd> ${t("help.bath")}</span><span><kbd>4</kbd> ${t("help.sleep")}</span></div>
        <div class="settings-row"><span><kbd>5</kbd> ${t("help.pet")}</span><span><kbd>N</kbd> ${t("help.name")}</span></div>
        <div class="settings-row"><span><kbd>A</kbd> ${t("help.ach")}</span><span><kbd>D</kbd> ${t("help.dex")}</span></div>
        <div class="settings-row"><span><kbd>S</kbd> ${t("help.settings")}</span><span><kbd>ESC</kbd> ${t("help.esc")}</span></div>
        <div class="settings-row"><span><kbd>?</kbd> ${t("help.show")}</span><span></span></div>
      </div>`,
      buttons: [{ label: t("help.btn"), close: true }],
    });
  }

  // Shared row template for collection menus (achievements / dex forms).
  // Locked: icon → 🔒, desc → "??", row dimmed. Unlocked: shows real icon + desc.
  // Caller passes raw fields so the helper stays UI-only — no
  // CFG / state coupling. Returns string to be joined.
  function lockableRowHTML({ icon, label, desc, locked }) {
    const showIcon = locked ? "🔒" : icon;
    const opacity = locked ? "opacity:0.4" : "";
    const showDesc = locked ? "??" : desc;
    return `<div class="settings-row" style="${opacity}">
      <span>${showIcon} <strong>${label}</strong></span>
      <small style="text-align:right;max-width:60%;">${showDesc}</small>
    </div>`;
  }

  window.NourishUI = { toast, speak, showImagePreview, showModal, closeModal, isModalOpen, escapeHtml,
                       showOnboarding, showOnboardingPart2, openHelpDialog, lockableRowHTML };
})();
