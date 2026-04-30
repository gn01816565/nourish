#!/usr/bin/env node
/* check-assets.js — guard against broken asset references at deploy time.
 *
 * Scans every static file (manifest.json, index.html, sw.js, src/cfg.js) for
 * "assets/<path>.png|jpg|svg|webp" strings and verifies the files exist.
 *
 * Why this lint: cfg.js holds 60+ asset paths (accessories, foods, events,
 * backgrounds, 7 final-form pet PNGs). Adding a new accessory means a path in
 * cfg.js + a file in assets/. It is easy to typo one or forget the file —
 * player sees a broken image with no console error to even narrow it down.
 *
 * Sister to check-sw-shell.js (iter#67). Together these are the deploy gate.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = [
  "manifest.json",
  "index.html",
  "sw.js",
  "src/cfg.js",
];

// Match assets/<anything>.<png|jpg|jpeg|svg|webp|gif>
// Tolerant of quotes, JSON values, JS strings, HTML attrs.
const assetRe = /["'`]([\w./-]*?assets\/[\w./-]+\.(?:png|jpe?g|svg|webp|gif))["'`]/gi;

const refs = new Map(); // path → list of { file, line }
for (const t of TARGETS) {
  const abs = path.join(ROOT, t);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  const lines = content.split("\n");
  let m;
  // Reset lastIndex implicitly via new regex per file
  const re = new RegExp(assetRe.source, assetRe.flags);
  while ((m = re.exec(content)) !== null) {
    // Normalize: strip leading "./" if present, drop any leading path segment
    // before "assets/" so we always end up with "assets/..."
    let ref = m[1].replace(/^\.\//, "");
    const idx = ref.indexOf("assets/");
    if (idx > 0) ref = ref.slice(idx);
    if (!refs.has(ref)) refs.set(ref, []);
    // Find line number cheaply by counting newlines up to match index
    const lineNo = content.slice(0, m.index).split("\n").length;
    refs.get(ref).push({ file: t, line: lineNo });
  }
}

const missing = [];
for (const [ref, sites] of refs) {
  const abs = path.join(ROOT, ref);
  if (!fs.existsSync(abs)) {
    missing.push({ ref, sites });
  }
}

if (missing.length === 0) {
  console.log(`✅ all ${refs.size} asset references resolve (scanned ${TARGETS.length} files)`);
  process.exit(0);
}

console.error(`❌ ${missing.length} broken asset reference(s):`);
for (const { ref, sites } of missing) {
  console.error(`\n  ${ref}`);
  for (const { file, line } of sites) {
    console.error(`    ↳ ${file}:${line}`);
  }
}
console.error("\nFix: either add the file under assets/ or remove the dead reference.");
process.exit(1);
