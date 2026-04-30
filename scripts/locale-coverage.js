#!/usr/bin/env node
/* locale-coverage.js — count hardcoded CJK strings in src/ to track i18n
 * migration progress. Reports: total candidate strings, % already wrapped in
 * t(), and a sample of remaining hardcoded sites by file.
 *
 * Not a gate — purely informational. Run manually between i18n batches:
 *   node scripts/locale-coverage.js
 *
 * iter#113.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = [
  "src/cfg.js",
  "src/game.js",
  "src/ui.js",
  "src/dex.js",
  "src/share.js",
  "src/audio.js",
  "src/i18n.js",
  "src/achievements.js",
];

// Match a JS string literal containing CJK on a single line. Single-line
// only because the prior cross-line variant matched comment spans by accident.
// Char class excludes all 3 quote types + newline so the match terminates
// at the actual closing quote on the same line.
const stringRe = /(["'`])([^"'`\n]*[一-鿿　-〿＀-￯]+[^"'`\n]*)\1/g;

// Match strings that are inside a t() call — these are already i18n keys, not
// raw text. Skip them when counting hardcoded.
const tCallRe = /\bt\s*\(\s*(["'`])([\w.]+)\1/g;

const stats = { total: 0, t_calls: 0, remaining: 0, byFile: {} };
const samples = {};

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  const lines = content.split("\n");

  // Count t() calls (already i18n)
  const tCalls = [...content.matchAll(tCallRe)].length;
  stats.t_calls += tCalls;

  // Count hardcoded CJK strings (skip lines that are inside i18n.js dict —
  // those ARE the source of truth, not migration targets)
  const isI18nDict = rel === "src/i18n.js";
  let hardcoded = 0;
  const fileSamples = [];
  let m;
  // Reset regex state per file
  const re = new RegExp(stringRe.source, stringRe.flags);
  while ((m = re.exec(content)) !== null) {
    if (isI18nDict) continue;
    // Estimate line number
    const lineNo = content.slice(0, m.index).split("\n").length;
    const lineText = lines[lineNo - 1] || "";
    // Skip if line already has a t() call (the CJK is inside a t() arg, e.g., default)
    // OR if it's inside a comment
    const trimmed = lineText.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
    hardcoded++;
    if (fileSamples.length < 3) {
      fileSamples.push({ line: lineNo, snippet: trimmed.slice(0, 80) });
    }
  }
  stats.remaining += hardcoded;
  stats.byFile[rel] = hardcoded;
  if (fileSamples.length) samples[rel] = fileSamples;
}

stats.total = stats.t_calls + stats.remaining;
const pct = stats.total > 0 ? Math.round((stats.t_calls / stats.total) * 100) : 0;

console.log(`📊 i18n coverage: ${stats.t_calls} replaced / ${stats.total} candidate strings (${pct}%)`);
console.log("");
console.log("Per-file remaining hardcoded CJK string literals:");
for (const [file, count] of Object.entries(stats.byFile)) {
  if (count > 0) console.log(`  ${file}: ${count}`);
}
console.log("");
console.log("Sample sites (top 3 per file) for next batch picking:");
for (const [file, sites] of Object.entries(samples)) {
  console.log(`\n  ${file}:`);
  sites.forEach(s => console.log(`    L${s.line}: ${s.snippet}`));
}
