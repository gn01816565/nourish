/* 啾啾日常 ChickaDay — generic utility helpers
 *
 * Pure functions with zero state coupling. Extracted from game.js as the first
 * step of R-1 (see docs/r1-plan.md). Loaded via <script src="src/utils.js">
 * AFTER cfg.js / i18n.js, BEFORE ui.js (so any module can pull from
 * window.NourishUtils).
 *
 * iter#127.
 */
(function () {
  "use strict";

  // Recursive object merge: `over` wins on leaf conflicts; arrays replaced
  // wholesale (not concatenated). Used for save migration: defaultState() is
  // base, parsed save is over → resulting state has any new fields the player's
  // save was missing.
  function deepMerge(base, over) {
    if (over === null || typeof over !== "object" || Array.isArray(over)) return over ?? base;
    const out = Array.isArray(base) ? [...(over || base)] : { ...base };
    for (const k of Object.keys(over)) {
      const bv = base[k], ov = over[k];
      if (bv && typeof bv === "object" && !Array.isArray(bv) && ov && typeof ov === "object" && !Array.isArray(ov)) {
        out[k] = deepMerge(bv, ov);
      } else {
        out[k] = ov;
      }
    }
    return out;
  }

  // Generate a 16-char hex id using window.crypto. Used for pet.id (cross-life
  // unique id) and any other one-shot identity needs.
  function cryptoRandomId() {
    const arr = new Uint8Array(8);
    (crypto || window.crypto).getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }

  // Clamp v to [lo, hi] inclusive.
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // Random integer in [a, b] inclusive.
  const rand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

  // Pick a random element from a non-empty array. Returns undefined if empty.
  const rand0 = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Format a millisecond duration as a short human label. Terse mode hides
  // the "可進化" sentinel for inline UI use. iter#128 R-1 step 2.
  function formatTime(ms, terse = false) {
    if (ms === Infinity) return "∞";
    if (ms <= 0) {
      if (terse) return "";
      const tr = window.NourishI18n ? window.NourishI18n.t : (k) => k;
      return tr("tooltip.canEvolve");
    }
    const s = Math.ceil(ms / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${ss}s`;
    return `${ss}s`;
  }

  // Map stat value 0-100 to CSS custom-property color tier. Reads thresholds
  // from window.NourishCFG.thresholds at call time.
  function statColor(v) {
    const th = (window.NourishCFG && window.NourishCFG.thresholds) || { high:70, mid:40, low:20 };
    if (v >= th.high) return "var(--c-good)";
    if (v >= th.mid)  return "var(--c-mid)";
    if (v >= th.low)  return "var(--c-low)";
    return "var(--c-bad)";
  }

  // Sign-prefix a number for delta display: 5 → "+5", -3 → "-3".
  const signed = v => (v >= 0 ? "+" : "") + v;

  // Random pick from CFG.speech.happy pool, with i18n. iter#189 wired tArray.
  const pickHappy = () => {
    const fallback = (window.NourishCFG && window.NourishCFG.speech && window.NourishCFG.speech.happy) || [];
    return rand0(tArray("speech.happy", fallback));
  };

  // Apply a delta object to stats, clamping each field to 0-100. Mutates in
  // place. Used by interactions / events / decay to safely modify pet stats.
  function applyDelta(stats, delta) {
    for (const k of Object.keys(delta)) {
      stats[k] = clamp(stats[k] + delta[k], 0, 100);
    }
  }

  // Format an interaction's stat delta object as a human label string.
  // Pulls localized stat names from window.NourishI18n at call time.
  function formatDelta(cfg) {
    const t = window.NourishI18n ? window.NourishI18n.t : (k) => k;
    const parts = [];
    if (cfg.hunger) parts.push(`${t("stat.hunger")}${signed(cfg.hunger)}`);
    if (cfg.mood)   parts.push(`${t("stat.mood")}${signed(cfg.mood)}`);
    if (cfg.clean)  parts.push(`${t("stat.clean")}${signed(cfg.clean)}`);
    if (cfg.energy) parts.push(`${t("stat.energy")}${signed(cfg.energy)}`);
    return parts.join(" ");
  }

  // Resolve a cfg entry's label via i18n if labelKey is set, else fall back
  // to literal label. Generic over interactions / accessories / achievements
  // — caller passes the cfg entry directly. iter#133 i18n batch helper.
  function cfgLabel(entry) {
    if (!entry) return "";
    if (entry.labelKey && window.NourishI18n) return window.NourishI18n.t(entry.labelKey);
    return entry.label || "";
  }

  // Same pattern as cfgLabel for description fields. iter#137.
  function cfgDesc(entry) {
    if (!entry) return "";
    if (entry.descKey && window.NourishI18n) return window.NourishI18n.t(entry.descKey);
    return entry.desc || "";
  }

  // Resolve a speech-pool i18n key (|-joined string) into an array.
  // Used by cfg.speech.* migration: zh/en stored as "line1|line2|line3" strings,
  // unsplit at call site so existing `rand0(lines)` keeps working. iter#186.
  function tArray(key, fallback) {
    if (!window.NourishI18n) return fallback || [];
    const s = window.NourishI18n.t(key);
    // i18n.t() returns the key itself when missing — fall back to cfg literal.
    if (!s || s === key) return fallback || [];
    return s.split("|");
  }

  window.NourishUtils = { deepMerge, cryptoRandomId, clamp, rand, rand0, formatTime, statColor, signed, pickHappy, applyDelta, formatDelta, cfgLabel, cfgDesc, tArray };
})();
