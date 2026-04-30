#!/usr/bin/env node
/* check-sw-shell.js — guard against the iter#66 bug repeating.
 *
 * Verifies that every <script src="src/*.js"> in index.html is also pre-cached
 * by sw.js APP_SHELL, and vice versa. Exits 1 with a diff on mismatch so it
 * fits into the deploy.md §2 checklist as a hard gate before push.
 *
 * Why a lint instead of remembering: from iter#34 (SW added) to iter#66 the
 * APP_SHELL drifted from 5 → 8 needed entries because nobody syncs by hand.
 * Six months of broken offline-first first-install for new PWA users.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const swJs = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");

// Pull every src="src/<file>.js" from index.html. Tolerant of single/double
// quotes and extra attributes.
const scriptRe = /<script[^>]*\bsrc=["'](src\/[^"']+\.js)["']/g;
const fromHtml = new Set();
let m;
while ((m = scriptRe.exec(indexHtml)) !== null) {
  fromHtml.add("./" + m[1]);
}

// Pull every "./src/<file>.js" entry from APP_SHELL. We deliberately scope to
// src/ — index.html / manifest.json / style.css are also in APP_SHELL but
// they're checked elsewhere or are stable.
const shellRe = /["'](\.\/src\/[^"']+\.js)["']/g;
const fromShell = new Set();
while ((m = shellRe.exec(swJs)) !== null) {
  fromShell.add(m[1]);
}

const missingInShell = [...fromHtml].filter(f => !fromShell.has(f)).sort();
const orphanInShell = [...fromShell].filter(f => !fromHtml.has(f)).sort();

if (missingInShell.length === 0 && orphanInShell.length === 0) {
  console.log(`✅ sw.js APP_SHELL matches index.html scripts (${fromHtml.size} files)`);
  process.exit(0);
}

console.error("❌ sw.js APP_SHELL out of sync with index.html");
if (missingInShell.length > 0) {
  console.error("\nMissing from APP_SHELL (will break first offline load):");
  missingInShell.forEach(f => console.error("  - " + f));
}
if (orphanInShell.length > 0) {
  console.error("\nOrphan in APP_SHELL (script tag was removed but cache entry stayed):");
  orphanInShell.forEach(f => console.error("  - " + f));
}
console.error("\nFix: edit sw.js APP_SHELL to match, then bump CACHE_VERSION.");
process.exit(1);
