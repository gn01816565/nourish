/* 啾啾日常 ChickaDay — visual animation helpers
 *
 * Self-contained DOM animation primitives. State-independent: only touches
 * #pet-img, #pet-wrapper, #stage children. Reads CFG.timing.particleCap.
 * Extracted from game.js as part of R-4 (animation lifecycle centralization).
 *
 * Loaded via <script src="src/animations.js"> AFTER cfg.js / utils.js, BEFORE
 * game.js. Public surface:
 *   window.NourishAnim.pulseEvolve()
 *   window.NourishAnim.playReactionAnim(interactionKey)
 *   window.NourishAnim.spawnFloatEmoji(emoji, idx)
 *   window.NourishAnim.spawnAchievementParticles()
 *   window.NourishAnim.spawnEvolveParticles()
 *
 * iter#139 R-4 partial.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function pulseEvolve() {
    const img = $("pet-img");
    if (!img) return;
    img.classList.add("evolving");
    setTimeout(() => img.classList.remove("evolving"), 3500);
    spawnEvolveParticles();
  }

  function playReactionAnim(interactionKey) {
    const img = $("pet-img");
    if (!img) return;
    let cls = null, floats = [];
    // TA = 女性，愛撫多愛心 / 玩耍多甜美音符（character-sheet §10.3）
    if (interactionKey.startsWith("feed_"))      { cls = "react-eat";   floats = ["🍴", "♡"]; }
    else if (interactionKey.startsWith("play_")) { cls = "react-shake"; floats = ["♪","🎵","✨"]; }
    else if (interactionKey === "bath")          { cls = "react-bath";  floats = ["🫧","🫧","✨"]; }
    else if (interactionKey === "pet_head")      { cls = "react-love";  floats = ["💕","♡"]; }
    else if (interactionKey === "pet_belly")     { cls = "react-love";  floats = ["💖","♡","♡"]; }
    else if (interactionKey === "talk")          { cls = "react-love";  floats = ["💬","♡"]; }
    if (!cls) return;
    img.classList.remove("react-eat","react-shake","react-bath","react-love");
    void img.offsetWidth; // restart animation
    img.classList.add(cls);
    setTimeout(() => img.classList.remove(cls), 1500);
    floats.forEach((emoji, i) => {
      setTimeout(() => spawnFloatEmoji(emoji, i), i * 220);
    });
  }

  function spawnFloatEmoji(emoji, idx) {
    const wrapper = $("pet-wrapper");
    if (!wrapper) return;
    if (wrapper.querySelectorAll(".float-emoji").length > 8) return; // cap
    const el = document.createElement("span");
    el.className = "float-emoji";
    if (emoji === "♡" || emoji === "💕" || emoji === "💖") el.classList.add("heart");
    el.textContent = emoji;
    el.style.left = (50 + (idx % 2 === 0 ? -1 : 1) * (10 + Math.random() * 20)) + "%";
    el.style.top  = "10%";
    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  function particleSlotsLeft(stage) {
    const cap = (window.NourishCFG && window.NourishCFG.timing && window.NourishCFG.timing.particleCap) || 30;
    return cap - stage.querySelectorAll(".particle").length;
  }

  function spawnAchievementParticles() {
    const stage = $("stage");
    if (!stage) return;
    const slots = Math.min(8, particleSlotsLeft(stage));
    if (slots <= 0) return;
    const symbols = ["🏅","✨","⭐","🌟"];
    for (let i = 0; i < slots; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = (i / 8) * Math.PI * 2;
      const dist = 70 + Math.random() * 30;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.left = "50%";
      p.style.top  = "55%";
      p.style.animationDelay = (Math.random() * 0.2) + "s";
      stage.appendChild(p);
      setTimeout(() => p.remove(), 1700);
    }
  }

  function spawnEvolveParticles() {
    const stage = $("stage");
    if (!stage) return;
    const slots = Math.min(14, particleSlotsLeft(stage));
    if (slots <= 0) return;
    const symbols = ["✨","⭐","🌟","💫","✦"];
    for (let i = 0; i < slots; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = (i / slots) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 90 + Math.random() * 30;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.left = "50%";
      p.style.top  = "55%";
      p.style.animationDelay = (Math.random() * 0.3) + "s";
      stage.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

  window.NourishAnim = { pulseEvolve, playReactionAnim, spawnFloatEmoji, spawnAchievementParticles, spawnEvolveParticles };
})();
