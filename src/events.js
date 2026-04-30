/* 啾啾日常 ChickaDay — random + seasonal events subsystem
 *
 * Spawns a clickable bubble on stage. Player taps within lifetime to claim
 * effects (stats / coin / toast) defined in cfg.randomEvents.pool — most go
 * via runEventApply (data-driven), one outlier (coin_drop) lives in the
 * RANDOM_EVENT_APPLIES dispatch table for non-trivial logic.
 *
 * Spawn rate auto-boosts in last 20% of stage to reward late-stage lingering.
 * Seasonal pool merged in when current md is in date range (see cfg).
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects routed
 * via NourishAPI (save / render / toast / grantCoin / unlockAchievement).
 * Audio via window.NourishAudio.SFX.
 *
 * Loaded via <script src="src/events.js"> AFTER cfg / i18n / utils / audio,
 * BEFORE game.js. iter#143 R-1 partial.
 */
(function () {
  "use strict";

  function api() { return window.NourishAPI; }
  function cfg() { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  let active = null;

  // Non-trivial dispatch (random amounts / branching). Most events live in
  // cfg.randomEvents.pool with applyEffects + applyToast and route through
  // runEventApply below.
  const RANDOM_EVENT_APPLIES = {
    coin_drop: () => {
      const c = utils().rand(5, 15);
      api().grantCoin(c, t("toast.coin.found"));
    },
  };

  function runEventApply(def) {
    const A = api();
    const eff = def.applyEffects || {};
    if (eff.stats) utils().applyDelta(A.getState().pet.stats, eff.stats);
    if (eff.coin)  A.grantCoin(eff.coin, eff.coinReason || def.label);
    const toastMsg = def.applyToastKey ? t(def.applyToastKey) : def.applyToast;
    if (toastMsg) A.toast(toastMsg, def.applyToastStyle || "good");
  }

  function isSeasonalActive(event) {
    if (!event.dateRange) return true;
    const now = new Date();
    const md = String(now.getMonth() + 1).padStart(2, "0") + "-" +
               String(now.getDate()).padStart(2, "0");
    const { from, to } = event.dateRange;
    return from <= to ? (md >= from && md <= to) : (md >= from || md <= to);
  }

  function maybeSpawn() {
    const A = api(); if (!A) return;
    const state = A.getState();
    if (active) return;
    if (state.pet.isSleeping) return;
    if (state.pet.stage === "egg") return;
    if (window.NourishUI && window.NourishUI.isModalOpen()) return;
    let chance = cfg().randomEvents.spawnChance;
    const stageCfg = cfg().stages[state.pet.stage];
    if (stageCfg && stageCfg.next) {
      const elapsed = Date.now() - state.pet.stageStartedAt;
      const progress = elapsed / stageCfg.duration;
      if (progress >= 0.8) chance = Math.min(0.6, chance * 1.6);
    }
    if (Math.random() > chance) return;
    spawnNow();
  }

  function spawnNow() {
    const C = cfg();
    const seasonal = (C.seasonalEvents?.pool || []).filter(isSeasonalActive);
    const pool = C.randomEvents.pool.concat(seasonal);
    const total = pool.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    let pick = pool[0];
    for (const e of pool) { r -= e.weight; if (r <= 0) { pick = e; break; } }

    const stage = document.getElementById("stage");
    if (!stage) return;
    const el = document.createElement("button");
    el.className = "event-bubble";
    el.type = "button";
    if (pick.art) {
      const img = document.createElement("img");
      img.src = pick.art;
      img.alt = pick.label;
      img.draggable = false;
      el.appendChild(img);
    } else if (pick.emoji) {
      el.textContent = pick.emoji;
    }
    el.title = pick.label;
    el.style.left = (15 + Math.random() * 70) + "%";
    el.style.top  = (10 + Math.random() * 25) + "%";
    el.setAttribute("aria-label", pick.label);
    stage.appendChild(el);

    active = { node: el, def: pick, expiresAt: Date.now() + C.randomEvents.lifetimeMs };
    el.onclick = () => resolve(true);

    setTimeout(() => {
      if (active && active.node === el) resolve(false);
    }, C.randomEvents.lifetimeMs);
  }

  function resolve(claimed) {
    if (!active) return;
    const A = api();
    const state = A.getState();
    const { node, def } = active;
    active = null;
    node.classList.add("leave");
    setTimeout(() => node.remove(), 250);
    if (!claimed) return;
    const fn = RANDOM_EVENT_APPLIES[def.apply || def.id];
    if (fn) fn(state);
    else runEventApply(def);
    const SFX = window.NourishAudio && window.NourishAudio.SFX;
    if (SFX) (def.id === "coin_drop" ? SFX.coin() : SFX.event());
    state.pet.growthScore += 3;
    if (!state.history) state.history = {};
    state.history.eventsCaught = (state.history.eventsCaught || 0) + 1;
    state.history.eventIds = state.history.eventIds || {};
    state.history.eventIds[def.id] = (state.history.eventIds[def.id] || 0) + 1;
    // Mirror to per-pet trait counter so finalForm "explorer" path can resolve.
    if (state.pet.traits) state.pet.traits.eventsCaught = (state.pet.traits.eventsCaught || 0) + 1;
    if (def.id === "star" && A.unlockAchievement) A.unlockAchievement("star_caught");
    A.save();
    A.render();
  }

  window.NourishEvents = { maybeSpawn };
})();
