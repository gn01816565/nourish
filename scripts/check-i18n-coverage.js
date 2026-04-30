#!/usr/bin/env node
/* check-i18n-coverage.js — verifies every t("key") call in src/*.js has both
 * zh-TW + en entries in src/i18n.js dict.
 *
 * Background: per retrospective-190.md §4.3, after 11 cfg-level i18n batches
 * (iter#177-193) shipped 236 entries, the dict is now ~393 keys × 2 locales =
 * 786 entries. Manual review can't catch typos like t("toas.poor") missing
 * a 't' or t("modal.startNew.bnt") instead of "btn". Smoke test exercises
 * 8 render scenarios but doesn't validate i18n key presence — modal /
 * settings / event-toast paths slip through.
 *
 * Rule: scan src/*.js for t("string") + t('string') + t(`string`) calls,
 * extract literal-string keys, then check both zh-TW + en blocks of i18n.js
 * have a matching entry. Missing key in either locale → fail with
 * file:line + locale + key.
 *
 * Skipped: dynamic-key calls like t(`speech.${name}`) — can't statically
 * resolve. We log them as "dynamic" so reviewers know coverage is partial
 * for these patterns. Most dynamic keys come from cfg.* which has its own
 * dual-field SOP.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const I18N_FILE = path.join(SRC_DIR, "i18n.js");

// --- Step 1: Parse i18n.js to extract keys for each locale -----------------

const i18nSrc = fs.readFileSync(I18N_FILE, "utf8");

// The dict structure has explicit "zh-TW" and "en" object literals.
// Each entry is `"key.path": "value"` or `'key.path': "value"`.
// We split on the locale headers and extract keys per block.
function extractLocaleKeys(text, localeName) {
  // Find the start of "<localeName>": { block
  const re = new RegExp(`["']${localeName.replace(/[-]/g, "\\$&")}["']\\s*:\\s*\\{`);
  const match = text.match(re);
  if (!match) return null;
  // Find the matching closing brace of the locale block.
  // Simple brace counter starting from the open `{`.
  let i = match.index + match[0].length - 1; // points at `{`
  let depth = 0;
  let end = -1;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return null;
  const blockText = text.slice(match.index + match[0].length - 1, end + 1);
  // Now extract all `"key": "..."` entries. Quoted-string keys only.
  const entryRe = /["']([\w.\-/]+?)["']\s*:\s*["`]/g;
  const keys = new Set();
  let m;
  while ((m = entryRe.exec(blockText)) !== null) {
    keys.add(m[1]);
  }
  return keys;
}

const zhKeys = extractLocaleKeys(i18nSrc, "zh-TW");
const enKeys = extractLocaleKeys(i18nSrc, "en");

if (!zhKeys || !enKeys) {
  console.error("❌ Could not parse i18n.js dict structure");
  process.exit(1);
}

// --- Step 2: Scan all src/*.js for t("...") calls --------------------------

const srcFiles = fs.readdirSync(SRC_DIR)
  .filter(f => f.endsWith(".js") && f !== "i18n.js") // i18n.js itself is the dict
  .map(f => path.join("src", f));

// t("key") | t('key') | t(`key`) where key is a literal string (no ${})
// Allow optional whitespace + leading t. (avoid catching `start.t(` etc.)
const callRe = /\b(?:t|window\.NourishI18n\.t)\s*\(\s*(["'`])([^"'`$]+)\1\s*[,)]/g;

const callsites = []; // { file, line, key }
const dynamicSites = []; // { file, line, raw } — `${...}` template

for (const rel of srcFiles) {
  const full = path.join(ROOT, rel);
  const body = fs.readFileSync(full, "utf8");
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comment-only lines.
    if (/^\s*\*|^\s*\/\//.test(line)) continue;
    // Detect dynamic-key calls (contain ${ before closing quote).
    const dynRe = /\b(?:t|window\.NourishI18n\.t)\s*\(\s*[`]([^`]*\$\{[^`]*)[`]/g;
    let dm;
    while ((dm = dynRe.exec(line)) !== null) {
      dynamicSites.push({ file: rel, line: i + 1, raw: dm[1] });
    }
    // Then static-key matches.
    let m;
    callRe.lastIndex = 0;
    while ((m = callRe.exec(line)) !== null) {
      callsites.push({ file: rel, line: i + 1, key: m[2] });
    }
  }
}

// --- Step 3: Verify each key exists in both locales ------------------------

const missingInZh = [];
const missingInEn = [];

for (const c of callsites) {
  if (!zhKeys.has(c.key)) missingInZh.push(c);
  if (!enKeys.has(c.key)) missingInEn.push(c);
}

// --- Step 4: Report --------------------------------------------------------

if (missingInZh.length || missingInEn.length) {
  console.error(`❌ i18n coverage lint failed:`);
  if (missingInZh.length) {
    console.error(`\n  Missing in zh-TW (${missingInZh.length}):`);
    for (const m of missingInZh) {
      console.error(`    ${m.file}:${m.line}  t("${m.key}")`);
    }
  }
  if (missingInEn.length) {
    console.error(`\n  Missing in en (${missingInEn.length}):`);
    for (const m of missingInEn) {
      console.error(`    ${m.file}:${m.line}  t("${m.key}")`);
    }
  }
  console.error(`\nAdd the missing keys to src/i18n.js dict.`);
  process.exit(1);
}

const seenKeys = new Set(callsites.map(c => c.key));
console.log(`✅ all ${seenKeys.size} static t() keys covered in zh-TW + en (${callsites.length} call sites across ${srcFiles.length} files)`);
if (dynamicSites.length) {
  console.log(`   (${dynamicSites.length} dynamic-key sites skipped — cfg-driven, see dual-field SOP)`);
}
