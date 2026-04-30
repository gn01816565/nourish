/* 啾啾日常 ChickaDay — dex-viewer modals subsystem
 *
 * Four cross-linked modal screens that let the player browse meta-progress
 * across pet generations: openDex (终態 collection + past pets list +
 * shortcut buttons), openAchievements (cfg-driven 成就 list), openEventStats
 * (regular + seasonal event catch counts), openPetDetail (single past pet
 * with portrait + worn cosmetics).
 *
 * State accessed lazily via window.NourishAPI.getState(). Side-effects via
 * NourishUI (showModal / closeModal / escapeHtml / lockableRowHTML),
 * NourishAPI (formLabel / formDescription / unlockedFormsSet),
 * NourishUtils (cfgLabel / cfgDesc), NourishDex (loadDex), NourishShare
 * (shareOrDownloadCard — for the 📸 紀念卡 cross-link).
 *
 * Loaded via <script src="src/menus.js"> AFTER cfg / utils / ui / dex /
 * share, BEFORE game.js. iter#162 R-1 partial.
 */
(function () {
  "use strict";

  function api()   { return window.NourishAPI; }
  function cfg()   { return window.NourishCFG; }
  function utils() { return window.NourishUtils; }
  function ui()    { return window.NourishUI; }
  function t(key, opts) { return window.NourishI18n ? window.NourishI18n.t(key, opts) : key; }

  function openDex() {
    const A = api();
    const C = cfg();
    const state = A.getState();
    const allForms = Object.keys(C.finalForms);
    const unlocked = A.unlockedFormsSet();
    const formsHTML = allForms.map(f =>
      ui().lockableRowHTML({ icon: "🔓", label: A.formLabel(f), desc: A.formDescription(f), locked: !unlocked.has(f) })
    ).join("");
    const dex = window.NourishDex.loadDex();
    const past = dex.completedPets.slice(0, 10);
    // GDD §10.3 elder companion: cross-pet 紀念碑 — sum past pets' totalDays + current
    // alive pet's bond days. This gives long-term players a visible "lifetime
    // companion" stat across egg cycles, complementing the per-pet bond row in
    // settings (iter#176).
    const fullPastForBond = dex.completedPets || [];
    const pastBondTotal = fullPastForBond.reduce((sum, p) => sum + (p.totalDays || 0), 0);
    const currentBond = Math.max(0, Math.floor((Date.now() - state.pet.bornAt) / 86400000));
    const totalBondDays = pastBondTotal + currentBond;
    const totalPets = fullPastForBond.length + 1; // +1 for current alive pet
    // iter#204 — Form distribution mini-strip: visible "I've raised these" history.
    // Counts each finalForm across past pets; renders as compact emoji-icon chips.
    // Only shown when at least 1 past pet exists (skipped on D1 fresh save).
    const formCounts = fullPastForBond.reduce((acc, p) => {
      const f = p.finalForm || "healthy";
      acc[f] = (acc[f] || 0) + 1;
      return acc;
    }, {});
    const FORM_ICONS = {
      healthy: "🐤", fatty: "🥯", ugly: "😆",
      fighter: "💪", sage: "🧠", diva: "🎤",
      divine: "✨", gourmet: "🍰", explorer: "🗺️", warmheart: "🤍",
    };
    const formStripHTML = fullPastForBond.length === 0 ? "" : `
      <p class="muted center" style="margin:0 0 8px;font-size:12px;line-height:1.6;">
        ${Object.entries(formCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([form, n]) => `<span style="margin:0 4px;white-space:nowrap;">${FORM_ICONS[form] || "🐔"} ${A.formLabel(form)} ×${n}</span>`)
          .join("")}
      </p>`;
    const pastHTML = past.length === 0
      ? `<p class="muted center" style="padding:6px 0;">尚未養成任何小雞</p>`
      : past.map((p, idx) => {
          const d = new Date(p.archivedAt || p.bornAt).toLocaleDateString();
          // Show worn-cosmetic icons to keep each pet's identity vivid.
          const accIcons = (() => {
            if (!p.appearance) return "";
            const ids = ["hat","neck","wing"].map(s => p.appearance[s]).filter(Boolean);
            return ids.map(id => C.accessories[id]?.icon || "").join("");
          })();
          return `<div class="settings-row pet-row" data-pet-idx="${idx}" style="cursor:pointer;" tabindex="0">
            <span>🐣 <strong>${ui().escapeHtml(p.name || "?")}</strong> · ${A.formLabel(p.finalForm)}${accIcons ? " " + accIcons : ""}</span>
            <small>${d} · ${p.totalDays}天 ›</small>
          </div>`;
        }).join("");
    const achCount = Object.keys(state.achievements || {}).length;
    const achTotal = Object.keys(C.achievements).length;
    ui().showModal({
      title: t("modal.dex.title"),
      body: `
        <p class="muted center" style="margin:2px 0 4px;font-size:13px;">${t("modal.dex.bondSummary", { days: totalBondDays, pets: totalPets })}</p>
        ${formStripHTML}
        <div class="modal-title" style="font-size:14px;margin:6px 0 4px;">終態收集 ${unlocked.size} / ${allForms.length}</div>
        <div class="modal-list">${formsHTML}</div>
        <div class="modal-title" style="font-size:14px;margin:14px 0 4px;">歷代小雞</div>
        <div class="modal-list">${pastHTML}</div>
        <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="modal-close" id="goto-ach">🏅 成就 ${achCount}/${achTotal}</button>
          <button class="modal-close" id="goto-events">🎲 事件 ${state.history?.eventsCaught || 0}</button>
          <button class="modal-close" id="goto-share">📸 分享卡</button>
        </div>
      `,
      buttons: [{ label: t("button.close"), close: true }],
      onMount: card => {
        const b = card.querySelector("#goto-ach");
        if (b) b.onclick = () => { ui().closeModal(); openAchievements(); };
        const ev = card.querySelector("#goto-events");
        if (ev) ev.onclick = () => { ui().closeModal(); openEventStats(); };
        const s = card.querySelector("#goto-share");
        if (s) s.onclick = () => { ui().closeModal(); window.NourishShare.shareOrDownloadCard(); };
        // Each past-pet row opens a detail modal — clicking remembers the pet.
        const fullPast = window.NourishDex.loadDex().completedPets;
        card.querySelectorAll(".pet-row").forEach(row => {
          const open = () => {
            const p = fullPast[parseInt(row.dataset.petIdx, 10)];
            if (p) { ui().closeModal(); openPetDetail(p); }
          };
          row.onclick = open;
          row.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
        });
      },
    });
  }

  function openAchievements() {
    const A = api();
    const C = cfg();
    const state = A.getState();
    const ach = state.achievements || {};
    const all = Object.keys(C.achievements);
    const got = all.filter(id => ach[id]);
    const rows = all.map(id => {
      const c = C.achievements[id];
      return ui().lockableRowHTML({ icon: c.icon, label: utils().cfgLabel(c), desc: utils().cfgDesc(c), locked: !ach[id] });
    }).join("");
    ui().showModal({
      title: t("modal.ach.title", { got: got.length, all: all.length }),
      body: `<div class="modal-list">${rows}</div>`,
      buttons: [{ label: t("button.close"), close: true }],
    });
  }

  function openEventStats() {
    const C = cfg();
    const state = api().getState();
    const eventIds = (state.history && state.history.eventIds) || {};
    const total = state.history?.eventsCaught || 0;
    const renderRow = (e, isSeasonal) => {
      const count = eventIds[e.id] || 0;
      const seen = count > 0;
      const dr = isSeasonal && e.dateRange ? `${e.dateRange.from} → ${e.dateRange.to}` : "";
      // Tiny inline thumbnail if SVG/PNG path is present.
      const thumb = e.art
        ? `<img src="${e.art}" width="22" height="22" style="vertical-align:middle;margin-right:6px;">`
        : "";
      return `<div class="settings-row" style="${seen ? "" : "opacity:0.45"}">
        <span>${thumb}${seen ? "" : "🔒 "}${e.label}${dr ? ` <small class="muted">${dr}</small>` : ""}</span>
        <strong>${count}</strong>
      </div>`;
    };
    const regularHTML = C.randomEvents.pool.map(e => renderRow(e, false)).join("");
    const seasonal = C.seasonalEvents?.pool || [];
    const seasonalHTML = seasonal.map(e => renderRow(e, true)).join("");
    const seasonalSeen = seasonal.filter(e => (eventIds[e.id] || 0) > 0).length;
    ui().showModal({
      title: t("modal.eventStats.title", { total }),
      body: `
        <div class="modal-title" style="font-size:13px;margin:6px 0 4px;">一般事件（全年）</div>
        <div class="modal-list">${regularHTML}</div>
        <div class="modal-title" style="font-size:13px;margin:14px 0 4px;color:var(--c-pink-deep);">
          🎏 季節事件 ${seasonalSeen} / ${seasonal.length}（限時）
        </div>
        <div class="modal-list">${seasonalHTML}</div>
        <p class="muted center" style="margin-top:8px;line-height:1.5;">
          季節事件依當下日期自動觸發，跨年累積收集。
        </p>
      `,
      buttons: [{ label: "回圖鑑", close: false, action: () => { ui().closeModal(); openDex(); } }],
    });
  }

  function openPetDetail(p) {
    const A = api();
    const C = cfg();
    const d = new Date(p.archivedAt || p.bornAt).toLocaleString();
    const born = new Date(p.bornAt).toLocaleString();
    const portrait = (C.petArt.adult && C.petArt.adult[p.finalForm]) || C.petArt.adult.healthy;
    const accList = ["hat","neck","wing"].map(slot => {
      const id = p.appearance && p.appearance[slot];
      if (!id) return null;
      const def = C.accessories[id];
      if (!def) return null;
      return `<div class="settings-row">
        <span><img src="${def.art}" width="24" height="24" style="vertical-align:middle;margin-right:6px;">${def.icon} ${utils().cfgLabel(def)}</span>
        <small>${slot}</small>
      </div>`;
    }).filter(Boolean).join("");
    ui().showModal({
      title: `🐣 ${ui().escapeHtml(p.name || "?")} · ${A.formLabel(p.finalForm)}`,
      body: `
        <div style="text-align:center;margin:6px 0 10px;">
          <img src="${portrait}" alt="" width="140" height="140"
            style="filter:drop-shadow(0 3px 6px rgba(255,137,167,0.3));">
        </div>
        <div class="modal-list">
          <div class="settings-row"><span>🌟 終態</span><strong>${A.formLabel(p.finalForm)}</strong></div>
          <div class="settings-row"><span>📅 誕生</span><small>${born}</small></div>
          <div class="settings-row"><span>🌙 退休</span><small>${d}</small></div>
          <div class="settings-row"><span>💝 飼養天數</span><strong>${p.totalDays} 天</strong></div>
        </div>
        ${accList ? `
        <div class="modal-title" style="font-size:13px;margin:10px 0 4px;">當時的穿搭</div>
        <div class="modal-list">${accList}</div>` : `
        <p class="muted center" style="margin-top:8px;">沒有配戴飾品</p>`}
        <p class="muted center" style="margin-top:10px;line-height:1.6;">
          ${A.formDescription(p.finalForm)}
        </p>
      `,
      buttons: [
        { label: "📸 紀念卡", close: false, action: () => { ui().closeModal(); window.NourishShare.shareOrDownloadCard(p); } },
        { label: "回圖鑑",   close: false, action: () => { ui().closeModal(); openDex(); } },
      ],
    });
  }

  // ---- Name dialog (input modal — first hatch + later rename) -----------
  // Moved here iter#173 from game.js. Same i18n keys, behaviour preserved 1:1.
  function openNameDialog() {
    const A = api();
    const state = A.getState();
    const current = state.pet.name || "啾啾";
    ui().showModal({
      title: state.pet.nameSet ? t("modal.naming.titleEdit") : t("modal.naming.titleNew"),
      body: `<div style="display:flex;flex-direction:column;gap:10px;">
        <input id="name-input" type="text" maxlength="12"
          value="${ui().escapeHtml(current)}"
          style="width:100%;padding:10px;border:2px solid var(--c-ink);border-radius:10px;font-size:16px;font-family:inherit;text-align:center;"/>
        <p class="muted center">${state.pet.nameSet ? "" : t("modal.naming.firstHint")}</p>
      </div>`,
      buttons: [
        { label: t("button.cancel"), close: true },
        { label: t("modal.naming.btnConfirm"), close: false, action: () => {
          const v = (document.getElementById("name-input").value || "").trim().slice(0, 12);
          if (!v) { A.toast(t("toast.name.empty"), "bad"); return; }
          state.pet.name = v;
          if (!state.pet.nameSet) {
            state.pet.nameSet = true;
            state.pet.stats.mood = utils().clamp(state.pet.stats.mood + 10, 0, 100);
            A.toast(t("toast.naming.greet", { name: v }), "good");
            A.speak(t("speech.naming.thanks"));
          } else {
            A.toast(t("toast.naming.renamed", { name: v }), "good");
          }
          A.save();
          A.render();
          ui().closeModal();
        }},
      ],
      onMount: card => {
        const input = card.querySelector("#name-input");
        if (input) { input.focus(); input.select(); }
      },
    });
  }

  window.NourishMenus = { openDex, openAchievements, openEventStats, openPetDetail, openNameDialog };
})();
