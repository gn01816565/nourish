#!/usr/bin/env bash
# run-checks.sh — single deploy gate. Runs node --check on every src JS file
# plus the two lints from iter#67/68. Fails fast on the first error.
#
# Replaces the multi-line copy/paste in docs/deploy.md §2 — one command, easy
# to wire into git pre-push hook later if the project ever gets one.
#
# Usage:  ./scripts/run-checks.sh
# Exit:   0 = all green, 1 = something needs fixing
set -euo pipefail

# Resolve repo root from script location so the command is location-independent
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

step() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }

step "Syntax: node --check (all src files)"
SRC_FILES=(src/*.js)
for f in "${SRC_FILES[@]}"; do node --check "$f"; done
echo "  ✅ all ${#SRC_FILES[@]} src files parse"

step "Syntax: node --check sw.js"
node --check sw.js
echo "  ✅ sw.js parses"

step "Lint: scripts/check-sw-shell.js"
node scripts/check-sw-shell.js

step "Lint: scripts/check-assets.js"
node scripts/check-assets.js

step "Lint: scripts/check-cfg-schema.js"
node scripts/check-cfg-schema.js

step "Lint: scripts/check-i18n-shadow.js"
node scripts/check-i18n-shadow.js

step "Lint: scripts/check-i18n-coverage.js"
node scripts/check-i18n-coverage.js

step "Smoke: scripts/check-render-smoke.js"
node scripts/check-render-smoke.js

step "All checks passed — safe to push"
