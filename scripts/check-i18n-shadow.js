#!/usr/bin/env node
/* check-i18n-shadow.js — bans `const t = X` bindings that mask the i18n t() wrapper.
 *
 * Background: iter#106 (render task footer) and iter#146 (finalizeForm +
 * openSettingsMenu) both caught regressions where a local `const t = state.X`
 * shadowed the module-level `t = (key, opts) => NourishI18n.t(...)` wrapper.
 * Later `t("modal.X.title")` calls in the same function then tried to invoke
 * a plain object → TypeError "X is not a function". Smoke test does not
 * exercise modals, so these slipped through.
 *
 * Rule: in src/*.js, lines matching `(const|let|var) t =` are allowed only when
 * the RHS is a function (arrow, function expr) or a NourishI18n.t reference.
 * Any other RHS (property access, object/array literal, etc.) is a likely
 * shadow → fail with file:line + suggested rename (`tr`, `tasks`, etc.).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const FILES = fs.readdirSync(SRC_DIR)
  .filter(f => f.endsWith(".js"))
  .map(f => path.join("src", f));

const RE = /^(\s*)(const|let|var)\s+t\s*=\s*(.+?);?\s*$/;

const issues = [];

for (const rel of FILES) {
  const body = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comment-only lines (avoid false positives on docs / examples).
    if (/^\s*\/\//.test(line)) continue;
    const m = line.match(RE);
    if (!m) continue;
    const rhs = m[3].trim();
    // Allowed RHS shapes:
    //   (key, opts) => ...      arrow function
    //   () => ...               nullary arrow
    //   function (...) {...}    function expression
    //   window.NourishI18n.t    bare reference / .bind(...)
    const isFunction =
      /^\(/.test(rhs) ||
      rhs.startsWith("function") ||
      /NourishI18n\.t/.test(rhs);
    if (isFunction) continue;
    issues.push({ file: rel, line: i + 1, code: line.trim() });
  }
}

if (issues.length) {
  console.error(`❌ i18n t-shadow lint failed (${issues.length} issue(s)):`);
  for (const it of issues) {
    console.error(`   ${it.file}:${it.line}  ${it.code}`);
  }
  console.error(`\nRename the local binding (e.g. \`const tr = ...\`, \`const tasks = ...\`).`);
  console.error(`\`t\` is reserved for the i18n wrapper — shadowing it breaks any t("key") call in scope.`);
  process.exit(1);
}

console.log(`✅ no t-shadow detected (scanned ${FILES.length} src files)`);
