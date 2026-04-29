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

  window.NourishUI = { toast, speak, showImagePreview };
})();
