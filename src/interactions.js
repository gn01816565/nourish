/* 啾啾日常 ChickaDay — interactions subsystem (highest-frequency player loop)
 *
 * Player taps Action category (eat / play / care / talk) → openMenu pulls
 * cfg.interactionMenus[cat] → renders menuItemHTML rows with disabled state
 * (locked / cooldown / cantAfford / sleeping). On click → performInteraction
 * runs the gate chain → applies stat deltas + trait bumps + economy + cooldown
 * + history + want fulfillment + daily task tracking + achievement check +
 * SFX + toast + speech + save + render.
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects routed
 * via NourishAPI (toast / save / render / grantCoin / spendCoin / speak /
 * stageLabel / checkAchievements). Daily task / history / wants / animation /
 * audio / modal via their respective window.NourishX modules.
 *
 * Loaded via <script src="src/interactions.js"> AFTER cfg / utils / ui /
 * audio / animations / wants / daily, BEFORE game.js. iter#160 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function isOnCooldown(key) {
    const state = api().getState();
    return (state.cooldowns[key] || 0) > Date.now();
  }
  function setCooldown(key, seconds) {
    const state = api().getState();
    state.cooldowns[key] = Date.now() + seconds * 1000;
  }
  function unlocked(unlockStage) {
    const state = api().getState();
    const order = ["egg", "chick", "junior", "adult"];
    return order.indexOf(state.pet.stage) >= order.indexOf(unlockStage);
  }

  function performInteraction(key) {
    const A = api();
    const state = A.getState();
    const C = cfg();
    const def = C.interactions[key];
    if (!def) return;
    if (state.pet.isSleeping && key !== "wake") {
      A.toast(t("toast.sleeping"), "bad"); return;
    }
    if (!unlocked(def.unlock)) { A.toast(t("toast.interaction.locked", { stage: A.stageLabel(def.unlock) }), "bad"); return; }
    if (isOnCooldown(key)) { A.toast(t("toast.cooldown", { name: utils().cfgLabel(def) }), "bad"); return; }
    if (def.cost && state.economy.feedCoin < def.cost) { A.toast(t("toast.poor"), "bad"); return; }

    // energy gates
    if (key.startsWith("play_") && state.pet.stats.energy < C.thresholds.low) {
      A.toast(t("toast.lowEnergy"), "bad"); return;
    }

    // overfeed: hunger > 95 and feeding. P2-7: skip the +1 if the food itself
    // already grants fatPoints (cake), so cake at hunger>95 doesn't double-count.
    if (key.startsWith("feed_") && state.pet.stats.hunger > 95) {
      const clamp = utils().clamp;
      state.pet.stats.mood  = clamp(state.pet.stats.mood  - 10, 0, 100);
      state.pet.stats.clean = clamp(state.pet.stats.clean - 15, 0, 100);
      if (!def.fatPoints) state.pet.traits.fatPoints += 1;
      A.toast(t("toast.overfed"), "bad");
    }

    // apply effect
    utils().applyDelta(state.pet.stats, {
      hunger: def.hunger || 0, mood: def.mood || 0,
      clean:  def.clean  || 0, energy: def.energy || 0,
    });
    if (def.cost) A.spendCoin(def.cost);
    if (def.battlePoints)       state.pet.traits.battlePoints       += def.battlePoints;
    if (def.fatPoints)          state.pet.traits.fatPoints          += def.fatPoints;
    if (def.intelligencePoints) state.pet.traits.intelligencePoints += def.intelligencePoints;
    if (def.singCount)          state.pet.traits.singCount          += def.singCount;

    setCooldown(key, def.cd);
    state.pet.growthScore += C.growth.interactionScore;
    if (window.NourishDaily) {
      window.NourishDaily.trackTask(key);
      window.NourishDaily.bumpHistory(key);
    }
    if (window.NourishWants) window.NourishWants.fulfillIfMatches(key);
    if (A.checkAchievements) A.checkAchievements();

    // small free coin reward for play
    if (key.startsWith("play_")) A.grantCoin(utils().rand(3, 6), null, true);

    if (window.NourishAnim) window.NourishAnim.playReactionAnim(key);
    const SFX = window.NourishAudio && window.NourishAudio.SFX;
    if (SFX) SFX.success();
    A.toast(t("toast.interaction.success", { icon: def.icon, name: utils().cfgLabel(def), delta: utils().formatDelta(def) }), "good");
    // Action-specific reply when available; fall back to generic happy line.
    const replies = utils().tArray(`speech.action_${key}`, C.speech[`action_${key}`]);
    A.speak(replies && replies.length ? utils().rand0(replies) : utils().pickHappy());
    A.save();
    A.render();
  }

  function toggleSleep() {
    const A = api();
    const state = A.getState();
    if (state.pet.stage === "egg") { A.toast(t("toast.egg.sleep"), "bad"); return; }
    state.pet.isSleeping = !state.pet.isSleeping;
    if (state.pet.isSleeping) A.speak(t("speech.sleep")); else A.speak(t("speech.wake"));
    A.save(); A.render();
  }

  function menuItemHTML(key) {
    const A = api();
    const state = A.getState();
    const def = cfg().interactions[key];
    const locked = !unlocked(def.unlock);
    const cdActive = isOnCooldown(key);
    const cantAfford = def.cost > state.economy.feedCoin;
    const disabled = locked || cdActive || cantAfford;
    const tag = def.cost > 0 ? `<span class="price">${def.cost} FC</span>`
              : `<span class="free">${t("menu.interaction.free")}</span>`;
    const sub = locked ? t("menu.interaction.locked",   { stage: A.stageLabel(def.unlock) })
              : cdActive ? t("menu.interaction.cooldown", { time: utils().formatTime(state.cooldowns[key] - Date.now(), true) })
              : cantAfford ? t("menu.interaction.cantAfford") : "";
    return `<button class="menu-item" data-key="${key}" ${disabled ? "disabled" : ""}>
      <span style="font-size:28px;">${def.icon}</span>
      <span class="name">${utils().cfgLabel(def)}<small class="muted"> ${sub}</small></span>
      ${tag}
    </button>`;
  }

  function bindMenuItems(card) {
    card.querySelectorAll(".menu-item").forEach(el => {
      el.addEventListener("click", () => {
        const key = el.dataset.key;
        window.NourishUI.closeModal();
        performInteraction(key);
      });
    });
  }

  function openMenu(cat) {
    const def = cfg().interactionMenus[cat];
    if (!def) return;
    const list = def.items.map(menuItemHTML).join("");
    window.NourishUI.showModal({
      title: def.title,
      body: `<div class="modal-list">${list}</div>`,
      buttons: [{ label: t("button.close"), close: true }],
      onMount: card => bindMenuItems(card),
    });
  }

  window.NourishInteractions = {
    perform: performInteraction,
    toggleSleep,
    openMenu,
    isOnCooldown,
    unlocked,
  };
})();
