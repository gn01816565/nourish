/* 啾啾日常 ChickaDay — Audio module
 *
 * Web Audio API procedural SFX — no asset files. AudioContext lazily inits on
 * first user gesture so browser autoplay policies don't muzzle us.
 *
 * Loaded via <script src="src/audio.js"> AFTER cfg.js, BEFORE game.js.
 * Reads window.NourishAPI.getState() at call time to honor user mute toggle.
 *
 * Public surface:
 *   window.NourishAudio.SFX.{click,success,fail,achievement,evolve,want,event,coin}
 *   window.NourishAudio.playTone(freq, ms, type?, gain?)  // for ad-hoc tones
 */
(function () {
  "use strict";

  let audioCtx = null;
  function ensureAudioCtx() {
    if (audioCtx) return audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) { audioCtx = null; }
    return audioCtx;
  }

  function soundOn() {
    const state = window.NourishAPI && window.NourishAPI.getState();
    return state && state.settings && state.settings.soundEnabled !== false;
  }

  function playTone(freq, ms, type = "sine", gain = 0.12) {
    if (!soundOn()) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.linearRampToValueAtTime(gain, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    osc.start(now);
    osc.stop(now + ms / 1000 + 0.05);
  }

  // Composite SFX = chained playTone calls with delays. Tuned so achievement
  // and evolve land louder than routine clicks.
  const SFX = {
    click:       () => playTone(660, 60, "square", 0.08),
    success:     () => { playTone(660, 80, "sine", 0.1); setTimeout(() => playTone(880, 100, "sine", 0.1), 60); },
    fail:        () => { playTone(220, 100, "sawtooth", 0.08); setTimeout(() => playTone(180, 120, "sawtooth", 0.08), 80); },
    achievement: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 110, "triangle", 0.12), i * 100)); },
    evolve:      () => { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playTone(f, 140, "triangle", 0.14), i * 90)); },
    want:        () => { playTone(523, 90, "sine", 0.1); setTimeout(() => playTone(784, 90, "sine", 0.1), 90); },
    event:       () => playTone(932, 80, "sine", 0.1),
    coin:        () => { playTone(988, 60, "square", 0.08); setTimeout(() => playTone(1319, 80, "square", 0.08), 50); },
  };

  window.NourishAudio = { SFX, playTone, ensureAudioCtx };
})();
