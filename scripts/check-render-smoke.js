#!/usr/bin/env node
/* check-render-smoke.js — load all 7 src/.js into a vm sandbox with minimal
 * DOM stubs and verify init() + first render() don't throw at runtime.
 *
 * Catches bugs the static lint chain misses: TDZ ReferenceError (iter#97),
 * undefined property access, broken closure references, etc. JS engine only
 * throws these when the code path actually executes — node --check syntax
 * validation passes, but the game would crash on first paint.
 *
 * iter#101 extension: runs 7 scenario configs (fresh / chick / junior /
 * adult × 4 forms) so render code paths for each stage + finalForm are all
 * exercised. Each scenario uses a fresh sandbox (no state pollution).
 *
 * Stubs are intentionally dumb. We don't validate output, just absence of
 * exceptions. iter#98 / iter#101.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const SCRIPTS = [
  "src/cfg.js",
  "src/i18n.js",
  "src/utils.js",
  "src/animations.js",
  "src/notifications.js",
  "src/ui.js",
  "src/dex.js",
  "src/achievements.js",
  "src/audio.js",
  "src/share.js",
  "src/wants.js",
  "src/events.js",
  "src/daily.js",
  "src/idle.js",
  "src/evolve.js",
  "src/shop.js",
  "src/save.js",
  "src/tick.js",
  "src/interactions.js",
  "src/menus.js",
  "src/settings.js",
  "src/render.js",
  "src/game.js",
];

// Pre-load script source once (avoids re-reading per scenario)
const SRC = SCRIPTS.map(rel => ({
  rel,
  body: fs.readFileSync(path.join(ROOT, rel), "utf8"),
}));

// Fake DOM element factory — every method is a no-op so the smoke test never
// crashes on "X is not a function". Properties are settable so render can
// assign textContent / src / hidden etc.
function fakeEl() {
  return {
    classList: { toggle: () => {}, add: () => {}, remove: () => {}, contains: () => false },
    dataset: {},
    style: { setProperty: () => {}, removeProperty: () => {}, getPropertyValue: () => "" },
    hidden: false,
    textContent: "",
    innerHTML: "",
    src: "",
    title: "",
    width: 0, height: 0,
    disabled: false,
    onclick: null, onkeydown: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    removeAttribute: () => {},
    hasAttribute: () => false,
    appendChild: (c) => c,
    insertAdjacentHTML: () => {},
    cloneNode: () => fakeEl(),
    remove: () => {},
    focus: () => {},
    blur: () => {},
    click: () => {},
    contains: () => false,
    matches: () => false,
    querySelectorAll: () => [],
    querySelector: () => fakeEl(),
    closest: () => null,
    getBoundingClientRect: () => ({ x:0, y:0, width:0, height:0, top:0, left:0, right:0, bottom:0 }),
    parentNode: null,
    children: [],
    nextSibling: null, previousSibling: null,
    nodeName: "DIV",
    tagName: "DIV",
  };
}

function makeSandbox(savePayload) {
  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: () => {} },  // suppress noise from script-internal logs
    setTimeout: () => 0,
    setInterval: () => 0,
    clearInterval: () => {},
    clearTimeout: () => {},
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    Math, Date, JSON, Object, Array, String, Number, Boolean, Set, Map, RegExp,
    Symbol, Promise, Error, TypeError, ReferenceError, SyntaxError, RangeError,
    parseInt, parseFloat, isNaN, isFinite,
    encodeURIComponent, decodeURIComponent, btoa, atob, URL, URLSearchParams,
    Notification: class { static get permission() { return "default"; } },
    Image: class { constructor() { this.src = ""; } },
    AudioContext: class { constructor() {} createOscillator() { return { connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{ setValueAtTime:()=>{} } }; } createGain() { return { connect:()=>{}, gain:{ setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{} } }; } get destination() { return {}; } get currentTime() { return 0; } close() {} },
    webkitAudioContext: undefined,
    document: {
      getElementById: () => fakeEl(),
      querySelector: () => fakeEl(),
      querySelectorAll: () => [],
      createElement: () => fakeEl(),
      addEventListener: () => {},
      removeEventListener: () => {},
      activeElement: null,
      body: fakeEl(),
      hidden: false,
      readyState: "complete",
      head: fakeEl(),
    },
    localStorage: {
      _d: savePayload ? { "nourish.save.v1": JSON.stringify(savePayload) } : {},
      getItem(k) { return this._d[k] != null ? this._d[k] : null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; },
      clear() { this._d = {}; },
      get length() { return Object.keys(this._d).length; },
      key(i) { return Object.keys(this._d)[i] || null; },
    },
    navigator: { serviceWorker: { register: () => Promise.resolve() }, share: undefined, clipboard: { writeText: () => Promise.resolve() } },
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    location: { reload: () => {}, search: "", href: "http://localhost:8765/", pathname: "/" },
    performance: { now: () => Date.now() },
    crypto: { randomUUID: () => "test-uuid-" + Math.random(), getRandomValues: (a) => a.fill(0) },
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.self = sandbox;
  sandbox.addEventListener = () => {};
  sandbox.removeEventListener = () => {};
  sandbox.dispatchEvent = () => true;
  return sandbox;
}

// Build a save payload that puts the pet at the requested stage / finalForm.
function makeSave(stage, finalForm) {
  const now = Date.now();
  return {
    schemaVersion: 1,
    createdAt: now - 60_000,
    updatedAt: now,
    lastTickAt: now,
    pet: {
      id: "smoke-test-pet",
      name: "啾啾",
      stage,
      finalForm: finalForm || null,
      stageStartedAt: now - 60_000,
      bornAt: now - 60_000,
      growthScore: stage === "egg" ? 5 : stage === "chick" ? 50 : stage === "junior" ? 300 : 1500,
      stats: { hunger: 80, mood: 80, clean: 80, energy: 80 },
      traits: { fatPoints: 0, battlePoints: 0, intelligencePoints: 0, singCount: 0, lowMoodMinutes: 0, perfectStreakMinutes: 0 },
      nameSet: stage !== "egg",
      want: null,
      wantCooldownUntil: 0,
      isSleeping: false,
      appearance: { hat: null, face: null, neck: null, wing: null },
      ownedAccessories: {},
    },
    economy: { feedCoin: 100 },
    cooldowns: {},
    daily: { lastDate: "", loginStreak: 0, tasks: {} },
    history: { totalSessions: 1, petCount: 1, feedCount: 1, eventsCaught: 0, eventIds: {}, wantsFulfilled: 0 },
    achievements: {},
    settings: { soundEnabled: false, reducedMotion: false, notificationsEnabled: false, lastNotifyAt: 0 },
  };
}

const SCENARIOS = [
  { name: "fresh (no save)",       save: null },
  { name: "egg stage",              save: makeSave("egg") },
  { name: "chick stage",            save: makeSave("chick") },
  { name: "junior stage",           save: makeSave("junior") },
  { name: "adult / healthy",        save: makeSave("adult", "healthy") },
  { name: "adult / fatty",          save: makeSave("adult", "fatty") },
  { name: "adult / divine",         save: makeSave("adult", "divine") },
  { name: "adult / fighter",        save: makeSave("adult", "fighter") },
];

let pass = 0;
for (const scn of SCENARIOS) {
  const sandbox = makeSandbox(scn.save);
  vm.createContext(sandbox);
  try {
    for (const { rel, body } of SRC) {
      vm.runInContext(body, sandbox, { filename: rel });
    }
    pass++;
  } catch (e) {
    console.error(`❌ Smoke test failed for scenario "${scn.name}":\n  ${e.message}`);
    if (e.stack) console.error(e.stack.split("\n").slice(0, 4).join("\n"));
    process.exit(1);
  }
}

console.log(`✅ render smoke test: ${pass}/${SCENARIOS.length} scenarios passed (init + render across all stages + final forms)`);
process.exit(0);
