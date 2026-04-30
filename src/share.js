/* 啾啾日常 ChickaDay — Share card module
 *
 * Self-contained Canvas → PNG renderer for both live & memorial cards.
 * Loaded via <script src="src/share.js"> AFTER cfg.js, BEFORE game.js.
 *
 * Reads window.NourishCFG (eager, set by cfg.js) and window.NourishAPI (lazy,
 * set by game.js at IIFE init). API surface for callers:
 *   window.NourishShare.generateShareCard(past?)        → Promise<Blob>
 *   window.NourishShare.shareOrDownloadCard(past?)      → Promise<void>
 *
 * `past` is a completedPets entry from dex (memorial mode); omitting it renders
 * the live current pet pulled from window.NourishAPI.getState().
 */
(function () {
  "use strict";

  const CFG = window.NourishCFG;
  if (!CFG) throw new Error("share.js: NourishCFG missing — load cfg.js first");

  // i18n thin wrapper — lazy access to window.NourishI18n (loaded earlier in
  // script order). Falls back to literal key if i18n missing. iter#121.
  const t = (key, opts) => window.NourishI18n ? window.NourishI18n.t(key, opts) : key;

  // Game-side bridge. Lazy: NourishAPI is populated when game.js's IIFE runs,
  // which happens after this script. Calls below dereference at use time.
  function api() {
    const a = window.NourishAPI;
    if (!a) throw new Error("share.js: NourishAPI missing — game.js must run first");
    return a;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  // Naive char-by-char wrap (CJK-friendly, handles long unbroken strings).
  function wrapText(ctx, text, maxWidth) {
    const lines = [];
    let cur = "";
    for (const ch of text) {
      const test = cur + ch;
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = ch;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  async function generateShareCard(past) {
    const A = api();
    const isMemorial = !!past;
    const W = 720, H = 1280;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Background gradient (memorial uses softer pink → cream)
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (isMemorial) {
      bg.addColorStop(0, "#FFD9E0");
      bg.addColorStop(0.5, "#FFE0E8");
      bg.addColorStop(1, "#FFF8E7");
    } else {
      bg.addColorStop(0, "#FFE6B0");
      bg.addColorStop(0.5, "#FFEFC1");
      bg.addColorStop(1, "#FFD9E0");
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Card frame
    ctx.fillStyle = "#FFF8E7";
    roundRect(ctx, 40, 60, W - 80, H - 120, 32);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#2C2C2C";
    ctx.stroke();

    // Title
    ctx.fillStyle = "#2C2C2C";
    ctx.textAlign = "center";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(isMemorial ? t("share.title.mem") : t("share.title.live"), W / 2, 160);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#8B5A2B";
    ctx.fillText(isMemorial ? "ChickaDay · Memory" : "ChickaDay · v0.1", W / 2, 195);

    const state = A.getState();

    // Pet portrait — past pets use their finalForm, current uses lastPetSrc
    const petSrc = isMemorial
      ? ((CFG.petArt.adult && CFG.petArt.adult[past.finalForm]) || CFG.petArt.adult.healthy)
      : (A.getLastPetSrc() || CFG.petArt.egg);
    const portraitSize = 360;
    const portraitX = (W - portraitSize) / 2;
    const portraitY = 240;
    try {
      const img = await loadImage(petSrc);
      ctx.drawImage(img, portraitX, portraitY, portraitSize, portraitSize);
    } catch (e) {
      ctx.fillStyle = "#FFD86B";
      ctx.beginPath();
      ctx.arc(W / 2, 420, 150, 0, Math.PI * 2);
      ctx.fill();
    }
    // Render equipped accessories at their pet-relative positions, scaled to
    // the share-card portrait size so they line up with the pet illustration.
    const ACC_DRAW = {
      wing: { x: 0.5, y: 0.45, size: 1.10 }, // behind body, draw FIRST below
      hat:  { x: 0.5, y: 0.18, size: 0.42 }, // top of head
      face: { x: 0.5, y: 0.30, size: 0.34 }, // eyes
      neck: { x: 0.5, y: 0.55, size: 0.55 }, // chest
    };
    const equipped = isMemorial
      ? (past.appearance || {})
      : (state.pet.appearance || {});
    for (const slot of Object.keys(ACC_DRAW)) {
      const id = equipped[slot];
      if (!id || !CFG.accessories[id]) continue;
      try {
        const aImg = await loadImage(CFG.accessories[id].art);
        const place = ACC_DRAW[slot];
        const aw = portraitSize * place.size;
        const ax = portraitX + portraitSize * place.x - aw / 2;
        const ay = portraitY + portraitSize * place.y - aw / 2;
        ctx.drawImage(aImg, ax, ay, aw, aw);
      } catch (_) { /* skip on load failure */ }
    }

    // Name + stage line
    ctx.fillStyle = "#2C2C2C";
    ctx.font = "bold 48px sans-serif";
    const nameLine = isMemorial
      ? `${past.name || "啾啾"} · ${A.formLabel(past.finalForm)}`
      : `${state.pet.name || "啾啾"} · ${A.stageLabel(state.pet.stage)}` +
          (state.pet.finalForm ? `(${A.formLabel(state.pet.finalForm)})` : "");
    ctx.fillText(nameLine, W / 2, 680);

    // Days raised
    ctx.font = "26px sans-serif";
    ctx.fillStyle = "#8B5A2B";
    if (isMemorial) {
      ctx.fillText(`陪伴了 ${past.totalDays} 天`, W / 2, 720);
    } else {
      const days = Math.max(1, Math.round((Date.now() - state.pet.bornAt) / 86400000));
      ctx.fillText(`已陪伴 ${days} 天`, W / 2, 720);
    }

    if (isMemorial) {
      // Memorial layout: replace live stats with description + dates + heart border
      ctx.font = "italic 22px sans-serif";
      ctx.fillStyle = "#8B5A2B";
      const desc = A.formDescription(past.finalForm) || "";
      const lines = wrapText(ctx, desc, W - 200);
      lines.slice(0, 3).forEach((line, i) => {
        ctx.fillText(line, W / 2, 800 + i * 36);
      });
      // dates
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#2C2C2C";
      const born = new Date(past.bornAt).toLocaleDateString();
      const archived = new Date(past.archivedAt || past.bornAt).toLocaleDateString();
      ctx.fillText(`📅 ${born} → 🌙 ${archived}`, W / 2, 950);
      // heart row
      ctx.font = "36px sans-serif";
      ctx.fillStyle = "#FF89A7";
      ctx.fillText("♡   ♡   ♡   ♡   ♡", W / 2, 1020);
      // signature
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "#8B5A2B";
      ctx.fillText(t("share.tagline.mem"), W / 2, 1080);
      ctx.font = "22px sans-serif";
      ctx.fillStyle = "#8B5A2B";
      ctx.fillText(t("share.subtitle.mem"), W / 2, 1180);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#B23A48";
      ctx.fillText(t("share.footer"), W / 2, 1210);
    } else {
      // Live layout (current pet) — 4 stat bars + counters
      const stats = state.pet.stats;
      const labels = [
        { k: "hunger", l: t("share.stat.hunger") },
        { k: "mood",   l: t("share.stat.mood") },
        { k: "clean",  l: t("share.stat.clean") },
        { k: "energy", l: t("share.stat.energy") },
      ];
      const baseY = 800;
      labels.forEach((s, i) => {
        const y = baseY + i * 70;
        ctx.font = "30px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#2C2C2C";
        ctx.fillText(s.l, 110, y);
        const v = Math.round(stats[s.k]);
        ctx.fillStyle = "rgba(44,44,44,0.15)";
        roundRect(ctx, 280, y - 26, 320, 32, 16); ctx.fill();
        ctx.fillStyle = v >= 70 ? "#6BCB77" : v >= 40 ? "#FFD86B" : v >= 20 ? "#FF9F43" : "#B23A48";
        roundRect(ctx, 280, y - 26, 320 * (v / 100), 32, 16); ctx.fill();
        ctx.fillStyle = "#2C2C2C";
        ctx.textAlign = "right";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText(v, 660, y);
      });
      const achCount = Object.keys(state.achievements || {}).length;
      const achTotal = Object.keys(CFG.achievements).length;
      const dexCount = A.unlockedFormsSet().size;
      ctx.textAlign = "center";
      ctx.font = "26px sans-serif";
      ctx.fillStyle = "#2C2C2C";
      ctx.fillText(`🏅 成就 ${achCount}/${achTotal}    📖 圖鑑 ${dexCount}/7`, W / 2, 1130);
      ctx.font = "22px sans-serif";
      ctx.fillStyle = "#8B5A2B";
      ctx.fillText(t("share.cta"), W / 2, 1180);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#B23A48";
      ctx.fillText(t("share.footer"), W / 2, 1210);
    }

    return new Promise((resolve, reject) =>
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png")
    );
  }

  // iOS Safari (especially in standalone PWA mode) ignores `<a download>` — the
  // image just opens in a new tab and the player is stranded. Detect and route
  // those users to a "preview + long-press to save" modal instead.
  function isIOSStandalone() {
    const ua = navigator.userAgent || "";
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (!isiOS) return false;
    // navigator.standalone is iOS-specific; matchMedia covers other PWAs too.
    const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches)
                    || window.navigator.standalone === true;
    return standalone;
  }

  async function shareOrDownloadCard(past) {
    const A = api();
    try {
      const blob = await generateShareCard(past);
      const state = A.getState();
      const name = past ? past.name : state.pet.name;
      const filename = past
        ? `chickaday-memory-${name || "chick"}.png`
        : `chickaday-${name || "chick"}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      const shareText = past
        ? t("share.text.mem", { name: name || t("share.default.name") })
        : t("share.text.live");

      // Path 1: native share sheet (Android Chrome, modern Safari)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t("share.dialog.title"), text: shareText });
        A.toast(t("share.toast.done"), "good");
        return;
      }

      // Path 2: iOS Safari standalone PWA — "long press to save" preview modal
      // (download attribute is a no-op, native share unavailable). UI module
      // owns the overlay; share.js just supplies the blob URL + cleanup.
      if (isIOSStandalone()) {
        const url = URL.createObjectURL(blob);
        const cleanup = () => setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
        window.NourishUI.showImagePreview(url, past ? "✨ 紀念卡" : "📸 分享卡", cleanup);
        return;
      }

      // Path 3: download fallback (desktop browsers)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      A.toast(past ? "✨ 紀念卡已下載" : "📸 卡片已下載", "good");
    } catch (e) {
      console.warn("share card failed", e);
      A.toast("⚠️ 分享卡產生失敗", "bad");
    }
  }


  window.NourishShare = { generateShareCard, shareOrDownloadCard };
})();
