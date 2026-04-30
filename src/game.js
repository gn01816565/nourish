/* 啾啾日常 ChickaDay — MVP v0.1
 * Pure HTML+CSS+JS, no build step. Single source of truth: state object,
 * persisted to localStorage with schemaVersion gating. Tick loop drives both
 * stat decay and growth score; offline elapsed time is reconciled on load.
 *
 * Configuration data lives in src/cfg.js → window.NourishCFG.
 * Random event subsystem extracted to src/events.js (iter#143 R-1).
 */
(() => {
  "use strict";

  // Pure config data, see src/cfg.js. Loaded via <script> tag before this file.
  const CFG = window.NourishCFG;
  if (!CFG) throw new Error("NourishCFG missing — load src/cfg.js before src/game.js");

  // ============ State (R-1 partial, iter#154: defaultState moved to src/save.js) ============
  const defaultState = () => window.NourishSave.defaultState();

  let state = null;
  let tickTimer = null, autoSaveTimer = null, wantsTimer = null, notifyTimer = null;
  let lastTick = Date.now();
  let lastVisibleAt = Date.now();
  let isReadOnlyTab = false; // true once another tab takes ownership of the save slot
  // Render dirty-check caches moved to src/render.js (iter#166).

  // Gate developer-only buttons; players see only the legitimate "reset" row.
  const DEBUG = (() => {
    try {
      return new URLSearchParams(location.search).has("debug")
          || localStorage.getItem("nourish.debug") === "1";
    } catch (_) { return false; }
  })();

  // ============ Save / Load (R-1 partial, iter#154: extracted to src/save.js) ============
  const load = () => window.NourishSave.loadFromStorage();
  function save() {
    if (isReadOnlyTab) return; // another tab owns the save slot — gate stays in game.js closure
    window.NourishSave.writeToStorage(state);
  }

  // Dex (永久圖鑑，獨立 key) — implementation moved to src/dex.js.
  // These thin wrappers preserve every existing call site in this file.
  const DEX_KEY = "nourish.dex.v1"; // kept for the reset-everything path below
  function loadDex()           { return window.NourishDex.loadDex(); }
  function saveDex(dex)        { window.NourishDex.saveDex(dex); }
  function unlockedFormsSet()  { return window.NourishDex.unlockedFormsSet(); }
  function archiveCurrentPet() { window.NourishDex.archiveCurrentPet(); }
  function startNewEgg() {
    archiveCurrentPet();
    const ownedAcc = state.pet.ownedAccessories || {};
    const fresh = defaultState();
    // keep cross-life progression: economy, daily streak, history, owned cosmetics
    fresh.economy = state.economy;
    fresh.daily   = state.daily;
    fresh.history = state.history;
    fresh.createdAt = state.createdAt;
    fresh.pet.ownedAccessories = ownedAcc;
    state = fresh;
    state.lastTickAt = Date.now();
    resetRenderCaches();
    save();
    render();
    toast(t("toast.newegg"), "good");
    speak("…?");
  }

  // Single entry point for clearing render dirty-check caches. Called when
  // state is replaced wholesale (startNewEgg etc.). Implementation in render.js.
  const resetRenderCaches = () => window.NourishRender.resetCaches();
  const migrate = (data) => window.NourishSave.migrate(data);
  // R-1 step 1 (iter#127): deepMerge / cryptoRandomId moved to src/utils.js.
  // Thin aliases keep the call sites in game.js short.
  const deepMerge = (b, o) => window.NourishUtils.deepMerge(b, o);
  const cryptoRandomId = () => window.NourishUtils.cryptoRandomId();

  // ============ Tick (R-1 partial, iter#155: extracted to src/tick.js) ============
  const reconcileOffline = () => window.NourishTick.reconcileOffline();
  const tickOnline       = (dt) => window.NourishTick.tickOnline(dt);

  const applyDelta = (stats, delta) => window.NourishUtils.applyDelta(stats, delta);
  const clamp = (v, lo, hi) => window.NourishUtils.clamp(v, lo, hi);

  // ============ Stage / Evolution (R-1 partial, iter#148: extracted to src/evolve.js) ============
  const maybeEvolve    = () => window.NourishEvolve.maybeEvolve();
  const finalizeForm   = () => window.NourishEvolve.finalizeForm();
  const confirmNewEgg  = () => window.NourishEvolve.confirmNewEgg();

  // ============ Interactions (R-1 partial, iter#160: extracted to src/interactions.js) ============
  const isOnCooldown      = (k) => window.NourishInteractions.isOnCooldown(k);
  const unlocked          = (s) => window.NourishInteractions.unlocked(s);
  const performInteraction= (k) => window.NourishInteractions.perform(k);
  const toggleSleep       = () => window.NourishInteractions.toggleSleep();

  const formatDelta = (cfg) => window.NourishUtils.formatDelta(cfg);
  const signed = (v) => window.NourishUtils.signed(v);
  const rand = (a, b) => window.NourishUtils.rand(a, b);

  // ============ Economy ============
  function grantCoin(amount, reason, silent) {
    state.economy.feedCoin += amount;
    state.economy.totalEarned += amount;
    if (!silent) toast(`💰 +${amount} FC${reason ? "（"+reason+"）" : ""}`, "gold");
    if (state.economy.totalEarned >= 500) unlockAchievement("rich");
  }
  function spendCoin(amount) {
    state.economy.feedCoin -= amount;
    state.economy.totalSpent += amount;
  }

  // ============ Daily login + history (R-1 partial, iter#144: extracted to src/daily.js) ============
  const handleDailyLogin = () => window.NourishDaily.handleLogin();
  const resetDailyTasks  = () => window.NourishDaily.resetTasks();
  const bumpHistory      = (k) => window.NourishDaily.bumpHistory(k);

  // ============ Achievements ============
  function unlockAchievement(id) {
    if (!state.achievements) state.achievements = {};
    if (state.achievements[id]) return false;
    const cfg = CFG.achievements[id];
    if (!cfg) return false;
    state.achievements[id] = Date.now();
    SFX.achievement();
    toast(`🏅 ${cfg.icon} ${window.NourishUtils.cfgLabel(cfg)}`, "gold");
    setTimeout(() => toast(`「${window.NourishUtils.cfgDesc(cfg)}」`, "good"), 350);
    spawnAchievementParticles();
    // Nudge the player toward the naming UI on first hatch.
    if (id === "first_hatch" && !state.pet.nameSet) {
      setTimeout(() => toast(t("toast.namehint"), "good"), 1500);
      // Hatch bonus so D1 players can afford first accessory (headband 50 FC) —
      // onboarding ends with "this chick is mine" feeling.
      const bonus = CFG.economy?.firstHatchBonus || 0;
      if (bonus > 0) setTimeout(() => grantCoin(bonus, t("toast.coin.hatchGift")), 2200);
      // Onboarding v2: first_hatch is the natural moment to reveal v0.2 / v0.3
      // features the initial 4-bullet modal didn't cover. Once per save.
      if (!state.history) state.history = {};
      if (!state.history.onboardedPart2) {
        state.history.onboardedPart2 = true;
        setTimeout(() => showOnboardingPart2(), 3500);
      }
    }
    return true;
  }

  function checkAchievements() {
    // Rule table moved to src/achievements.js (pure logic). Side-effects (toast,
    // SFX, particles) still happen here via unlockAchievement.
    const checks = window.NourishAchievements.evaluate(state, unlockedFormsSet());
    for (const [id, met] of checks) if (met) unlockAchievement(id);
  }

  const trackDailyTask = (k) => window.NourishDaily.trackTask(k);

  // ============ Welcome back ============
  function showWelcomeBack(elapsedMs) {
    const tier = CFG.welcomeBack.find(t => elapsedMs <= t.maxMs);
    if (!tier || !tier.text) return;
    const idx = CFG.welcomeBack.indexOf(tier);
    const minutes = Math.round(elapsedMs / 60000);
    const friendly = minutes < 60 ? t("time.minutes", { n: minutes })
                   : minutes < 1440 ? t("time.hours",  { n: Math.round(minutes/60) })
                   : t("time.days",   { n: Math.round(minutes/1440) });
    // GDD §7.4 emotional aftershock: 8-12h docks mood -5; >12h triggers crying line.
    let extra = "";
    if (idx === 3) {
      state.pet.stats.mood = clamp(state.pet.stats.mood - 5, 0, 100);
      extra = t("modal.welcomeBack.moodPenalty");
    }
    if (idx === 4) speak(t("speak.cry"));
    if (tier.giveCoin) grantCoin(tier.giveCoin, t("toast.coin.compensation"));
    showModal({
      title: t("modal.welcomeBack.title"),
      body: `<div class="welcome-back">${t("modal.welcomeBack.body", { friendly, tierText: tier.textKey ? t(tier.textKey) : tier.text, extra })}</div>`,
      buttons: [{ label: t("button.ok"), close: true }],
    });
  }

  // ============ Render (R-1 partial, iter#166: extracted to src/render.js) ============
  const $ = id => document.getElementById(id);
  const render = () => window.NourishRender.render();
  const dismissInstallBanner = (persist) => window.NourishRender.dismissInstallBanner(persist);

  // ============ Menus ============
  // Single config-driven menu opener. Categories defined in CFG.interactionMenus
  // so v0.3 can add (e.g.) "grooming" with no game.js change.
  // openInteractionMenu / menuItemHTML / bindMenuItems all moved to src/interactions.js (iter#160).
  const openInteractionMenu = (cat) => window.NourishInteractions.openMenu(cat);

  // ============ Notifications (best-effort, in-tab + SW-backed) ============
  // Goal: alert player when their pet's stats drop critically while they're
  // not looking. Uses Notification API + service worker. Two limits:
  //  (1) closed tab → no JS runs; only SW with periodic sync (low support) or
  //      Web Push (needs server) could fire, neither is available here.
  //  (2) backgrounded tab → setInterval is throttled but still runs ≥ 1/min.
  // So this implementation reliably notifies during backgrounded sessions and
  // is a stub for true push when a server arrives.
  // R-1 partial (iter#140): notification helpers extracted to src/notifications.js.
  const notificationsSupported = () => window.NourishNotify.supported();
  const requestNotificationPermission = () => window.NourishNotify.requestPermission();
  const showLocalNotification = (title, body) => window.NourishNotify.show(title, body);
  const maybeNotifyCriticalStat = () => { window.NourishNotify.maybeAlertCriticalStat(); save(); };

  // ============ Audio ============
  // Implementation moved to src/audio.js. This shorthand keeps existing
  // SFX.coin() / SFX.success() calls in this file working unchanged.
  const SFX = window.NourishAudio.SFX;

  // ============ Save export / import (R-1 partial, iter#163: extended into src/save.js) ============
  const exportSaveBundle = () => window.NourishSave.exportBundle();
  const importSaveBundle = (b64) => window.NourishSave.importBundle(b64);

  // ============ Accessory shop (R-1 partial, iter#151: extracted to src/shop.js) ============
  const isAccessoryOwned = (id) => window.NourishShop.isOwned(id);
  const buyAccessory     = (id) => window.NourishShop.buy(id);
  const equipAccessory   = (id) => window.NourishShop.equip(id);
  const openShopMenu     = () => window.NourishShop.openMenu();

  // ============ Settings menu (R-1 partial, iter#165: extracted to src/settings.js) ============
  const openSettingsMenu = () => window.NourishSettings.openMenu();

  // ============ Dex-viewer modals (R-1 partial, iter#162: extracted to src/menus.js) ============
  const openAchievementsMenu = () => window.NourishMenus.openAchievements();

  // ============ Share card ============
  // Implementation moved to src/share.js. This file just exposes a thin alias
  // so existing callers keep working; window.NourishAPI bridges the closure.
  function shareOrDownloadCard(past) {
    return window.NourishShare.shareOrDownloadCard(past);
  }


  const openDexMenu        = () => window.NourishMenus.openDex();
  const openEventStatsMenu = () => window.NourishMenus.openEventStats();
  const openPetDetail      = (p) => window.NourishMenus.openPetDetail(p);

  const openNameDialog = () => window.NourishMenus.openNameDialog();
  // ============ Modal / escapeHtml ============
  // Implementations moved to src/ui.js. Thin wrappers preserve callers
  // (showModal in every openXMenu, callers reading window.NourishUI.isModalOpen() now go via UI).
  const showModal = (opts) => window.NourishUI.showModal(opts);
  const closeModal = () => window.NourishUI.closeModal();
  const escapeHtml = (s) => window.NourishUI.escapeHtml(s);

  // ============ Toast / Speech ============
  // Implementations moved to src/ui.js — these wrappers keep all in-file callers
  // (60+ sites) working untouched.
  const toast = (msg, kind) => window.NourishUI.toast(msg, kind);
  const speak = (text) => window.NourishUI.speak(text);
  const pickHappy = () => window.NourishUtils.pickHappy();
  const rand0 = (arr) => window.NourishUtils.rand0(arr);

  // ============ Helpers (labels) ============
  function stageLabel(s)       { return CFG.stageLabels[s] || s; }
  function formLabel(f) {
    const fc = CFG.finalForms[f];
    if (!fc) return f;
    return fc.labelKey ? t(fc.labelKey) : (fc.label || f);
  }
  function formDescription(f) {
    const fc = CFG.finalForms[f];
    if (!fc) return "";
    return fc.descKey ? t(fc.descKey) : (fc.desc || "");
  }

  // R-4 partial (iter#139): animation helpers extracted to src/animations.js.
  // Thin aliases keep call sites in game.js short.
  const pulseEvolve              = () => window.NourishAnim.pulseEvolve();
  const playReactionAnim         = (k) => window.NourishAnim.playReactionAnim(k);
  const spawnFloatEmoji          = (e, i) => window.NourishAnim.spawnFloatEmoji(e, i);
  const spawnAchievementParticles= () => window.NourishAnim.spawnAchievementParticles();
  const spawnEvolveParticles     = () => window.NourishAnim.spawnEvolveParticles();

  // ============ Wants (R-1 partial, iter#142: extracted to src/wants.js) ============
  const maybeSpawnWant       = () => window.NourishWants.maybeSpawn();
  const expireWantIfStale    = () => window.NourishWants.expireIfStale();
  const fulfillWantIfMatches = (k) => window.NourishWants.fulfillIfMatches(k);

  // ============ Random events (R-1 partial, iter#143: extracted to src/events.js) ============
  let eventTimer = null;
  const maybeSpawnEvent = () => window.NourishEvents.maybeSpawn();

  // ============ Idle behaviour (R-1 partial, iter#145: extracted to src/idle.js) ============
  const startIdleSpeech = () => window.NourishIdle.start();
  const stopIdleSpeech  = () => window.NourishIdle.stop();

  // ============ Bootstrap ============
  function applyReducedMotionPref() {
    document.body.classList.toggle("reduce-motion", !!state.settings?.reducedMotion);
  }

  // Bridge for src/share.js — exposes the closure-bound state + helpers it needs.
  // Functions are passed by reference (hoisted), state via getter so it's always live.
  window.NourishAPI = {
    getState: () => state,
    getLastPetSrc: () => window.NourishRender.getLastPetSrc(),
    stageLabel,
    formLabel,
    formDescription,
    unlockedFormsSet,
    toast,
    speak,
    save,
    render,
    grantCoin,
    spendCoin,
    unlockAchievement,
    checkAchievements,
    startNewEgg,
    applyReducedMotionPref,
    isDebug: () => DEBUG,
  };

  // P2-4: visibility-aware background timers. When the tab is hidden,
  // these stop firing — saves a small amount of CPU/battery and avoids waking
  // up to a stale event bubble that spawned in the background. Tick / idle
  // timers handled separately (already cleared via existing visibility handler).
  function startBackgroundTimers() {
    if (!autoSaveTimer) autoSaveTimer = setInterval(save, CFG.save.autosaveMs);
    if (!eventTimer)    eventTimer    = setInterval(maybeSpawnEvent, CFG.randomEvents.spawnIntervalMs);
    if (!wantsTimer)    wantsTimer    = setInterval(() => { expireWantIfStale(); maybeSpawnWant(); }, CFG.wants.spawnIntervalMs);
    if (!notifyTimer)   notifyTimer   = setInterval(maybeNotifyCriticalStat, 5 * 60 * 1000);
  }
  function stopBackgroundTimers() {
    if (autoSaveTimer) { clearInterval(autoSaveTimer); autoSaveTimer = null; }
    if (eventTimer)    { clearInterval(eventTimer);    eventTimer    = null; }
    if (wantsTimer)    { clearInterval(wantsTimer);    wantsTimer    = null; }
    if (notifyTimer)   { clearInterval(notifyTimer);   notifyTimer   = null; }
  }

  // P2-5: warm browser cache for the 7 adult forms so progression
  // to chick-adult-* doesn't flash a missing image during the evolve particle
  // animation. Cheap — browsers dedupe via HTTP cache.
  function preloadAdultForms() {
    Object.values(CFG.petArt.adult).forEach(src => { const img = new Image(); img.src = src; });
  }

  function wireUpButtons() {
    $("btn-feed").onclick    = () => openInteractionMenu("feed");
    $("btn-play").onclick    = () => openInteractionMenu("play");
    $("btn-bath").onclick    = () => performInteraction("bath");
    $("btn-sleep").onclick   = toggleSleep;
    $("btn-pet").onclick     = () => openInteractionMenu("pet");
    $("btn-settings").onclick = openSettingsMenu;
    $("btn-dex").onclick     = openDexMenu;
    $("btn-ach").onclick     = openAchievementsMenu;
    $("btn-shop").onclick    = openShopMenu;
    $("pet-wrapper").onclick = () => performInteraction("pet_head");
    $("stage-name").onclick  = openNameDialog;
    $("stage-name").style.cursor = "pointer";
    $("stage-name").title = t("tooltip.rename");
  }

  // Install banner. Yes triggers captured prompt; either outcome
  // dismisses (don't nag). beforeinstallprompt may fire AFTER init in some
  // browsers, so we also re-evaluate on event arrival.
  function wireUpInstallBanner() {
    $("install-banner-yes").onclick = async () => {
      const prompt = window.__nourishInstallPrompt;
      if (!prompt) { dismissInstallBanner(true); return; }
      try {
        prompt.prompt();
        const result = await prompt.userChoice;
        window.__nourishInstallPrompt = null;
        dismissInstallBanner(true);
        if (result.outcome === "accepted") toast(t("install.success"), "good");
      } catch (_) {
        dismissInstallBanner(true);
      }
    };
    $("install-banner-no").onclick = () => dismissInstallBanner(true);
    window.addEventListener("beforeinstallprompt", () => { maybeShowInstallBanner(); });
  }

  // cross-tab race. If another tab writes the save key, this tab is now
  // stale. Drop into read-only + stop all writers + prompt for refresh.
  function wireUpCrossTabSync() {
    window.addEventListener("storage", e => {
      if (e.key !== CFG.save.key) return;
      if (isReadOnlyTab) return;
      isReadOnlyTab = true;
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
      stopIdleSpeech();
      stopBackgroundTimers();  // critical: would otherwise overwrite the active tab's saves
      showModal({
        title: t("modal.crossTab.title"),
        body: `<p style="text-align:center;line-height:1.7;">
          偵測到另一個分頁正在玩啾啾日常。<br>
          這個分頁會停在唯讀模式。<br><br>
          <small class="muted">點重新整理可接續另一個分頁的進度。</small>
        </p>`,
        buttons: [{ label: t("btn.refresh"), close: false, action: () => location.reload() }],
      });
    });
  }

  // Visibility-aware tick / timer suspension. Avoids
  // ~8h backgrounded tab being treated as online; saves battery.
  function wireUpVisibility() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        save();
        state.lastTickAt = Date.now();
        save();
        if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
        stopIdleSpeech();
        stopBackgroundTimers();
      } else {
        reconcileOffline();
        lastTick = Date.now();
        lastVisibleAt = Date.now();
        if (!tickTimer) startTick();
        startBackgroundTimers();
        startIdleSpeech();
        render();
      }
    });
    window.addEventListener("focus", () => { lastVisibleAt = Date.now(); });
    window.addEventListener("beforeunload", save);
  }

  // Keyboard shortcuts. ESC closes modals (review-v2 P2-8 a11y). Number keys
  // hit primary actions; letters open header menus. Skip when typing in inputs.
  function wireUpKeyboard() {
    window.addEventListener("keydown", e => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape" && window.NourishUI.isModalOpen()) { closeModal(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (window.NourishUI.isModalOpen()) return; // don't fire game shortcuts while a menu is open
      switch (e.key) {
        case "1": openInteractionMenu("feed"); break;
        case "2": openInteractionMenu("play"); break;
        case "3": performInteraction("bath"); break;
        case "4": toggleSleep(); break;
        case "5": openInteractionMenu("pet"); break;
        case "a": case "A": openAchievementsMenu(); break;
        case "d": case "D": openDexMenu(); break;
        case "s": case "S": openSettingsMenu(); break;
        case "n": case "N": openNameDialog(); break;
        case "?": case "h": case "H": openHelpDialog(); break;
        default: return;
      }
      e.preventDefault();
    });
  }

  // i18n thin wrapper. Falls back to literal key text if NourishI18n missing
  // (defensive — shouldn't happen given script load order, but safer).
  const t = (key, opts) => window.NourishI18n ? window.NourishI18n.t(key, opts) : key;

  function init() {
    state = load();
    const { elapsedMs } = reconcileOffline();
    handleDailyLogin();
    applyReducedMotionPref();
    save();
    preloadAdultForms();
    if (window.NourishI18n) window.NourishI18n.applyI18nDom();

    wireUpButtons();
    wireUpInstallBanner();
    wireUpCrossTabSync();
    wireUpVisibility();
    wireUpKeyboard();

    // tick loop (1 sec for smooth UI; stat decay computed by elapsed minutes)
    lastTick = Date.now();
    startTick();
    startBackgroundTimers();
    startIdleSpeech();

    // first-time greeting
    render();
    if (elapsedMs > 30 * 60 * 1000) showWelcomeBack(elapsedMs);

    // brand-new player onboarding (only first launch; persisted via state.history.totalSessions)
    if (!state.history) state.history = { totalSessions: 0 };
    state.history.totalSessions = (state.history.totalSessions || 0) + 1;
    if (state.history.totalSessions === 1) {
      setTimeout(() => showOnboarding(), 600);
    }
  }

  function startTick() {
    tickTimer = setInterval(() => {
      const now = Date.now();
      let dt = now - lastTick;
      lastTick = now;
      // clamp single-tick window so a long-throttled background catch-up
      // can't dump 30 min of online decay in one frame.
      if (dt > 5 * 60 * 1000) dt = 5 * 60 * 1000;
      if (dt < 0) dt = 0;
      tickOnline(dt);
      maybeEvolve();
      render();
    }, 1000);
  }

  // ============ Onboarding / Help dialogs ============
  // Implementations moved to src/ui.js (purely static modals). Wrappers preserve
  // existing call sites in init() / first_hatch unlock / keyboard ?.
  const openHelpDialog       = () => window.NourishUI.openHelpDialog();
  const showOnboardingPart2  = () => window.NourishUI.showOnboardingPart2();
  const showOnboarding       = () => window.NourishUI.showOnboarding();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
