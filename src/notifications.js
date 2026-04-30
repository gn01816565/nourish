/* 啾啾日常 ChickaDay — local notification helpers
 *
 * Wraps the browser Notification API for stat-critical alerts. Best-effort:
 * tries Service Worker registration first (survives tab close on supported
 * browsers), falls back to plain Notification(). State accessed lazily via
 * window.NourishAPI.getState().
 *
 * Loaded via <script src="src/notifications.js"> AFTER cfg.js / i18n.js,
 * BEFORE game.js. iter#140 R-1 partial.
 *
 * Public surface:
 *   window.NourishNotify.supported()
 *   window.NourishNotify.requestPermission() → Promise<"granted"|"denied"|"unsupported">
 *   window.NourishNotify.show(title, body) → Promise<boolean>
 *   window.NourishNotify.maybeAlertCriticalStat()
 */
(function () {
  "use strict";

  function supported() { return typeof Notification !== "undefined"; }

  async function requestPermission() {
    if (!supported()) return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied")  return "denied";
    try { return await Notification.requestPermission(); }
    catch (_) { return "denied"; }
  }

  async function show(title, body) {
    if (!supported() || Notification.permission !== "granted") return false;
    const opts = {
      body,
      icon: "assets/icons/icon-192.png",
      badge: "assets/icons/icon-72.png",
      tag: "chickaday-stat",
      silent: false,
    };
    try {
      const reg = await (navigator.serviceWorker && navigator.serviceWorker.ready);
      if (reg && reg.showNotification) { reg.showNotification(title, opts); return true; }
    } catch (_) {}
    try { new Notification(title, opts); return true; } catch (_) { return false; }
  }

  function api() { return window.NourishAPI; }
  function cfg() { return window.NourishCFG; }

  async function maybeAlertCriticalStat() {
    const A = api();
    if (!A) return;
    const state = A.getState();
    if (!state.settings || !state.settings.notificationsEnabled) return;
    if (!supported() || Notification.permission !== "granted") return;
    if (!document.hidden) return;
    const C = cfg();
    if (Date.now() - (state.settings.lastNotifyAt || 0) < C.timing.notifyCooldownMs) return;
    const s = state.pet.stats;
    const name = state.pet.name || "啾啾";
    let body = null;
    if (s.hunger < C.thresholds.low) body = `${name} 肚子好餓…`;
    else if (s.mood < C.thresholds.low) body = `${name} 心情很差，需要陪陪`;
    else if (s.clean < C.thresholds.low) body = `${name} 想洗澡了`;
    else if (s.energy < C.thresholds.low && !state.pet.isSleeping) body = `${name} 累壞了`;
    if (!body) return;
    show("啾啾日常", body);
    state.settings.lastNotifyAt = Date.now();
  }

  window.NourishNotify = { supported, requestPermission, show, maybeAlertCriticalStat };
})();
