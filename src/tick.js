/* 啾啾日常 ChickaDay — tick / offline reconciliation subsystem
 *
 * Two pure-ish functions on `state`:
 *
 * - reconcileOffline(): called on tab return / init. Computes elapsed since
 *   lastTickAt, caps at offlineCapHours (8h default), applies decay rates
 *   to stats over those minutes, hits a one-time growthScore penalty if
 *   the gap was ≥24h, then stamps lastTickAt = now. Returns { elapsedMs }
 *   so caller can trigger welcome-back modal at the right tier.
 *
 * - tickOnline(deltaMs): called every tick interval while tab is visible.
 *   Applies online decay + cross-stat penalties (hunger<low ⇒ mood drag,
 *   clean<mid ⇒ mood drag) + growthScore deltas (high stats add, low stats
 *   subtract, all-four-perfect bumps perfectStreakMinutes). Caps deltaMs
 *   at 5 min to defend against throttled-tab clock skew.
 *
 * State accessed lazily via window.NourishAPI.getState(). Pure utilities
 * via window.NourishUtils (applyDelta, clamp). No DOM, no audio, no toast.
 *
 * Loaded via <script src="src/tick.js"> AFTER cfg / utils, BEFORE game.js.
 * iter#155 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }

  function reconcileOffline() {
    const state = api().getState();
    const C = cfg();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - state.lastTickAt);
    if (elapsedMs < 1000) { state.lastTickAt = now; return { elapsedMs: 0 }; }
    const cap = C.decay.offlineCapHours * 3600 * 1000;
    const effectiveMs = Math.min(elapsedMs, cap);
    const minutes = effectiveMs / 60000;

    const rate = C.decay.offline;
    const energyRate = state.pet.isSleeping ? C.decay.energySleep : rate.energy;
    utils().applyDelta(state.pet.stats, {
      hunger: rate.hunger * minutes,
      mood:   rate.mood   * minutes,
      clean:  rate.clean  * minutes,
      energy: energyRate  * minutes,
    });

    // 24h offline penalty (one-time)
    if (elapsedMs >= 24 * 3600 * 1000) {
      state.pet.growthScore = Math.max(0, state.pet.growthScore + C.growth.offline24hPenalty);
    }
    state.lastTickAt = now;
    return { elapsedMs };
  }

  function tickOnline(deltaMs) {
    // Guard against clock skew (negative dt) and runaway accumulation
    // (e.g. throttled background tab returning with a 30-min dt).
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
    if (deltaMs > 5 * 60 * 1000) deltaMs = 5 * 60 * 1000;
    const state = api().getState();
    const C = cfg();
    const minutes = deltaMs / 60000;
    const r = C.decay.online;
    const energyRate = state.pet.isSleeping ? C.decay.energySleep : r.energy;
    utils().applyDelta(state.pet.stats, {
      hunger: r.hunger * minutes,
      mood:   r.mood   * minutes,
      clean:  r.clean  * minutes,
      energy: energyRate * minutes,
    });
    // cross-stat penalties
    const s = state.pet.stats;
    const clamp = utils().clamp;
    const th = C.thresholds;
    if (s.hunger < th.low) s.mood = clamp(s.mood + (-0.20) * minutes, 0, 100);
    if (s.clean  < th.mid) s.mood = clamp(s.mood + (-0.10) * minutes, 0, 100);

    // growth score
    const g = C.growth;
    let dScore = 0;
    if (s.hunger > th.high) dScore += g.hungerHighBonus * minutes;
    if (s.mood   > th.high) dScore += g.moodHighBonus   * minutes;
    if (s.clean  > th.high) dScore += g.cleanHighBonus  * minutes;
    if (s.energy > th.high) dScore += g.energyHighBonus * minutes;
    if (s.hunger > th.high && s.mood > th.high && s.clean > th.high && s.energy > th.high) {
      dScore += g.perfectBonus * minutes;
      state.pet.traits.perfectStreakMinutes += minutes;
    } else {
      state.pet.traits.perfectStreakMinutes = 0;
    }
    if (s.hunger < th.low) dScore += g.hungerLowPenalty * minutes;
    if (s.mood   < th.low) {
      dScore += g.moodLowPenalty * minutes;
      state.pet.traits.lowMoodMinutes += minutes;
    }
    state.pet.growthScore = Math.max(0, state.pet.growthScore + dScore);
  }

  window.NourishTick = { reconcileOffline, tickOnline };
})();
