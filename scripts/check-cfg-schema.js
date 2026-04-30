#!/usr/bin/env node
/* check-cfg-schema.js — validate cross-references inside CFG.
 *
 * cfg.js has many string keys that point to other parts of CFG (menu items
 * → interactions, wants.needs → interactions, interactions.unlock → stages,
 * accessories.slot → fixed enum). A typo silently breaks features without
 * any console error — the menu just shows nothing, the want never spawns.
 *
 * This lint runs cfg.js in a vm sandbox with a stub `window`, then walks the
 * resulting CFG object asserting every cross-ref resolves. Sister to
 * check-sw-shell.js (iter#67) and check-assets.js (iter#68). iter#74.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const cfgSrc = fs.readFileSync(path.join(ROOT, "src/cfg.js"), "utf8");

// Stub window so the IIFE's `window.NourishCFG = CFG` lands in our sandbox.
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(cfgSrc, sandbox, { filename: "src/cfg.js" });

const CFG = sandbox.window.NourishCFG;
if (!CFG) {
  console.error("❌ cfg.js did not set window.NourishCFG — check IIFE export");
  process.exit(1);
}

const ALLOWED_SLOTS = new Set(["hat", "face", "neck", "wing"]);
const errors = [];

// --- 1. interactionMenus[cat].items must each exist in interactions ------
const interactionKeys = new Set(Object.keys(CFG.interactions || {}));
for (const [cat, def] of Object.entries(CFG.interactionMenus || {})) {
  for (const k of def.items || []) {
    if (!interactionKeys.has(k)) {
      errors.push(`interactionMenus.${cat}.items: "${k}" not in CFG.interactions`);
    }
  }
}

// --- 2. interactions[*].unlock must be a stage key -----------------------
const stageKeys = new Set(Object.keys(CFG.stages || {}));
for (const [k, def] of Object.entries(CFG.interactions || {})) {
  if (def.unlock && !stageKeys.has(def.unlock)) {
    errors.push(`interactions.${k}.unlock: "${def.unlock}" not in CFG.stages`);
  }
}

// --- 3. accessories[*].slot must be a known UI slot ---------------------
for (const [k, def] of Object.entries(CFG.accessories || {})) {
  if (!ALLOWED_SLOTS.has(def.slot)) {
    errors.push(`accessories.${k}.slot: "${def.slot}" not in {${[...ALLOWED_SLOTS].join(", ")}}`);
  }
}

// --- 4. wants.pool[*].needs must be an interaction; stage must be a stage ---
for (const w of (CFG.wants && CFG.wants.pool) || []) {
  if (w.needs && !interactionKeys.has(w.needs)) {
    errors.push(`wants.pool[${w.id}].needs: "${w.needs}" not in CFG.interactions`);
  }
  if (w.stage && !stageKeys.has(w.stage)) {
    errors.push(`wants.pool[${w.id}].stage: "${w.stage}" not in CFG.stages`);
  }
}

// --- 5. stages[*].next must be null or another stage --------------------
for (const [k, def] of Object.entries(CFG.stages || {})) {
  if (def.next !== null && def.next !== undefined && !stageKeys.has(def.next)) {
    errors.push(`stages.${k}.next: "${def.next}" not in CFG.stages`);
  }
}

// --- 6.5. speech[*] must be non-empty array of strings -------------------
// Defends against: empty pool (rand0 returns undefined → toast crash) or
// accidentally typed object/string instead of array.
for (const [k, pool] of Object.entries(CFG.speech || {})) {
  if (!Array.isArray(pool)) {
    errors.push(`speech.${k}: must be an array, got ${typeof pool}`);
    continue;
  }
  if (pool.length === 0) {
    errors.push(`speech.${k}: empty array — rand0 will return undefined`);
    continue;
  }
  for (let i = 0; i < pool.length; i++) {
    if (typeof pool[i] !== "string" || !pool[i]) {
      errors.push(`speech.${k}[${i}]: must be non-empty string, got ${JSON.stringify(pool[i])}`);
    }
  }
}

// --- 7.2 thresholds must be ordered high > mid > low and 0-100 ----------
const th = CFG.thresholds || {};
if (typeof th.high !== "number" || typeof th.mid !== "number" || typeof th.low !== "number") {
  errors.push("thresholds: high / mid / low must all be numbers");
} else {
  if (!(th.high > th.mid && th.mid > th.low)) {
    errors.push(`thresholds: must be high > mid > low, got high=${th.high} mid=${th.mid} low=${th.low}`);
  }
  if (th.high > 100 || th.low < 0) {
    errors.push(`thresholds: must stay within 0-100 stat range`);
  }
}

// --- 7.3 economy fields must all be positive numbers --------------------
for (const [k, v] of Object.entries(CFG.economy || {})) {
  if (typeof v !== "number" || !(v > 0)) {
    errors.push(`economy.${k}: must be positive number, got ${v}`);
  }
}

// --- 7.4 events pool[*].weight + applyEffects shape (regular + seasonal) ----
// applyEffects is the data side of runEventApply; if present it must be an
// object with { stats, coin, coinReason } shape. coin_drop and similar
// non-trivial handlers don't carry applyEffects (handled by RANDOM_EVENT_APPLIES).
const allEvents = [
  ...((CFG.randomEvents && CFG.randomEvents.pool) || []),
  ...((CFG.seasonalEvents && CFG.seasonalEvents.pool) || []),
];
for (const ev of allEvents) {
  if (typeof ev.weight !== "number" || !(ev.weight > 0)) {
    errors.push(`events.pool[${ev.id}].weight: must be positive number, got ${ev.weight}`);
  }
  if (!ev.apply || typeof ev.apply !== "string") {
    errors.push(`events.pool[${ev.id}].apply: must be non-empty string id`);
  }
  if (ev.applyEffects) {
    if (typeof ev.applyEffects !== "object") {
      errors.push(`events.pool[${ev.id}].applyEffects: must be object, got ${typeof ev.applyEffects}`);
    } else {
      if (ev.applyEffects.stats && typeof ev.applyEffects.stats !== "object") {
        errors.push(`events.pool[${ev.id}].applyEffects.stats: must be object`);
      }
      if (ev.applyEffects.coin !== undefined && (typeof ev.applyEffects.coin !== "number" || ev.applyEffects.coin <= 0)) {
        errors.push(`events.pool[${ev.id}].applyEffects.coin: must be positive number`);
      }
    }
  }
  if (ev.applyToast !== undefined && typeof ev.applyToast !== "string") {
    errors.push(`events.pool[${ev.id}].applyToast: must be string`);
  }
}

// --- 7.6 accessories[*].price must be positive number ------------------
for (const [k, def] of Object.entries(CFG.accessories || {})) {
  if (typeof def.price !== "number" || !(def.price > 0)) {
    errors.push(`accessories.${k}.price: must be positive number, got ${def.price}`);
  }
}

// --- 7.5. finalForms keys must align with petArt.adult keys -------------
// Adding a new evolution branch (v0.3 GDD §10.3) requires both: a label/desc
// in finalForms AND an adult sprite in petArt.adult. Forgetting either ships
// a broken pet that has art-but-no-name or name-but-no-art.
const finalFormKeys = new Set(Object.keys(CFG.finalForms || {}));
const adultArtKeys = new Set(Object.keys((CFG.petArt && CFG.petArt.adult) || {}));
for (const k of finalFormKeys) {
  if (!adultArtKeys.has(k)) {
    errors.push(`finalForms.${k}: no matching petArt.adult.${k} sprite`);
  }
}
for (const k of adultArtKeys) {
  if (!finalFormKeys.has(k)) {
    errors.push(`petArt.adult.${k}: no matching finalForms.${k} label/desc`);
  }
}
for (const [k, def] of Object.entries(CFG.finalForms || {})) {
  if (!def.label || typeof def.label !== "string") {
    errors.push(`finalForms.${k}.label: must be non-empty string`);
  }
  if (!def.desc || typeof def.desc !== "string") {
    errors.push(`finalForms.${k}.desc: must be non-empty string`);
  }
}

// --- 8. traitsDisplay[*].key must be a known pet.traits field -----------
// state.pet.traits is defined in game.js defaultState; this list mirrors it.
const KNOWN_TRAITS = new Set([
  "fatPoints", "battlePoints", "intelligencePoints",
  "singCount", "lowMoodMinutes", "perfectStreakMinutes",
  "feedCount", "eventsCaught",
]);
for (const d of CFG.traitsDisplay || []) {
  if (!KNOWN_TRAITS.has(d.key)) {
    errors.push(`traitsDisplay[${d.label || d.key}].key: "${d.key}" not in pet.traits enum (${[...KNOWN_TRAITS].join(", ")})`);
  }
  if (typeof d.cap !== "number" || d.cap <= 0) {
    errors.push(`traitsDisplay[${d.label || d.key}].cap: must be positive number, got ${d.cap}`);
  }
}

if (errors.length === 0) {
  const stats = {
    interactions: interactionKeys.size,
    stages: stageKeys.size,
    accessories: Object.keys(CFG.accessories || {}).length,
    wants: ((CFG.wants && CFG.wants.pool) || []).length,
    menus: Object.keys(CFG.interactionMenus || {}).length,
    traits: (CFG.traitsDisplay || []).length,
    speech_pools: Object.keys(CFG.speech || {}).length,
    final_forms: Object.keys(CFG.finalForms || {}).length,
  };
  const summary = Object.entries(stats).map(([k, v]) => `${v} ${k}`).join(" / ");
  console.log(`✅ CFG schema valid (${summary})`);
  process.exit(0);
}

console.error(`❌ ${errors.length} CFG schema violation(s):`);
for (const e of errors) console.error(`  - ${e}`);
console.error("\nFix: edit src/cfg.js so all referenced keys exist.");
process.exit(1);
