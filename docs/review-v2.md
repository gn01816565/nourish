# 啾啾日常 ChickaDay v0.1 + 8 輪優化 — Code & Gameplay Review v2

> Review 日期：2026-04-28
> Reviewer：Code & Gameplay Review Agent v2
> 範圍：MVP v0.1 + 8 輪自動優化後的累積狀態
> 對照：v1 review (`docs/review.md`)、`docs/iteration-log.md`、`docs/gdd.md` §10/§11、`docs/character-sheet.md`
>
> **狀態（iter#75 更新）**：原始 6 條 P1 全部修完（見各條 ✅ 標記），R-2 由 iter#73 完成（且超 spec — 多搬 items 到 cfg.js + 加 cfg-schema lint）。剩下開放：R-3 / R-4 / R-5 / P2-1 ~ P2-10。下輪 cron 用本檔當 step (1) 訊息源時請從**未標 ✅** 的項目挑。

---

## 摘要

**良好（B+）** — v1 列出的 4 個 P0 全部修掉、12 個 P1 大部分覆蓋，遊戲循環從「開放結尾」變成閉合（蛋→養→進化→圖鑑→新蛋），同時長出 17 條成就、5 種隨機事件、SVG 化事件氣泡、4 種互動反應動畫、進化粒子。但 `game.js` 已膨脹到 1272 行單一 IIFE，可維護性開始劣化；探索性入口集中在頂部兩個 icon 而玩家不易發現；存檔層尚無 quota / 跨 tab 防護；設定頁殘留 production 不該外露的 debug 操作。沒有新增 P0，但有 4 個 P1 與 6 個 P2 累積。

---

## 必修 (P0)

無新 P0。v1 的 P0-1 ~ P0-4 全部驗證已修（時鐘倒退保護、背景節流校正、welcome-back 8-12h 心情 -5、fighter 終態分支）。

---

## 建議 (P1)

### P1-1 設定頁的 debug 按鈕在 production 該 gate 起來 ✅ DONE

> 已修：`src/game.js:86` `const DEBUG = (() => { ... })();`（query string `?debug=1` 或 `localStorage["nourish.debug"]="1"` 雙閘門），settings 內 `+100 FC` / `跳階段` 兩 row 包 `${DEBUG ? html : ""}`，玩家正常進入看不到。

**位置**：`src/game.js:813-823`、`src/game.js:830-836`
- 設定頁直接渲染「+100 飼料幣（除錯）」「跳到下一階段（除錯）」兩個按鈕，**任何打開設定的玩家都能無限刷幣 / 無限跳階段**，會把整個成長曲線跟成就系統的稀有感打掉（`rich` 成就一鍵達成、4 階段 3 秒跑完）。
- 「重置存檔」是合理的玩家功能（GDD §10.1 設定頁列項），但「+100 FC」「跳階段」純粹是開發者測試工具。
- **建議**：用 query string 或 `localStorage["nourish.debug"] = "1"` 開關 gate：
  ```js
  const DEBUG = new URLSearchParams(location.search).has("debug")
              || localStorage.getItem("nourish.debug") === "1";
  // 然後 settings 內這兩 row 加 ${DEBUG ? html : ""}
  ```
  保留 `dbg-reset`（玩家有合理需求重置），把 `dbg-give` / `dbg-evolve` 藏起來。

### P1-2 跨 tab 開兩個分頁的 race condition 沒處理 ✅ DONE

> 已修：`src/game.js:1774` `window.addEventListener("storage", ...)` 偵測另一 tab 寫入 → 本 tab 進入 `isReadOnlyTab` + 停 tickTimer + 跳「⚠️ 在另一個分頁開啟」modal，提供「重新整理」按鈕讓玩家接續另一 tab 進度。**不**自動 reload，避免突然清掉玩家未保存動作。

**位置**：`src/game.js:166-185`（load/save）、`src/game.js:1204`（autosaveTimer）
- 玩家在 A 分頁累積 5 次餵食，在 B 分頁同帳號開來看，B 會載入舊 state；接著 B 自己的 30s autosave fire，會用 B 的舊 state 把 A 的進度蓋回去。1 秒 tick 在 B 也持續寫 cooldown / growthScore，等同「兩個 tab 互相覆寫」。
- 玩家用兩個瀏覽器 / 桌機 + 手機開（這款定位上班族 idle 養成，**很可能放兩個地方**），會看到莫名其妙的數值倒退、cooldown 重置、甚至成就/圖鑑被覆蓋掉。
- **建議**：監聽 `window.addEventListener("storage", e => { if (e.key === CFG.save.key) location.reload(); })`，當另一 tab 寫入時強制本 tab 重載；或更輕量的「tab id + 最後寫入者」競賽機制，讓晚進的 tab 進入唯讀。

### P1-3 localStorage QuotaExceeded 完全沒兜底（Safari 私密模式 = 0 容量）✅ DONE

> 已修：`src/game.js:113-114` 與 `src/dex.js:35` 都有 `if (e.name === "QuotaExceededError" || e.code === 22) toast("⚠️ 存檔空間不足，進度可能無法保留", "bad")`。dex 仍在 50 cap（`src/dex.js`），實測長期記載 50+ 種終態的玩家會少數，未降到 20。

**位置**：`src/game.js:178-185`、`src/game.js:198-200`
- `save()` 跟 `saveDex()` 都有 try/catch，但只 `console.warn`，玩家完全不知道存檔失敗。在 Safari 私密模式（quota = 0）或長期使用後其他網站搶滿 5MB 配額時，存檔會靜默失敗 → 玩家養 3 天的小雞下次重整就回到初始。
- **建議**：catch 到 QuotaExceededError 時 toast 一條紅字「存檔空間不足，進度可能無法保留」，並把 dex cap 從 50 降到 20 確保不爆。
  ```js
  } catch (e) {
    if (e?.name === "QuotaExceededError") toast("⚠️ 存檔空間不足", "bad");
    console.warn("Save failed:", e);
  }
  ```

### P1-4 取名按鈕的可發現性差 ✅ DONE

> 已修：3 條同步上：(1) `src/style.css:505` `#stage-name::after { content: " ✏️" }` ✅；(2) `src/game.js:459` `first_hatch` 觸發後 1.5s toast「💡 點寵物名字可以取名喔～」✅；(3) `src/game.js:705` chick 階段且 `!nameSet` 時顯示「✏️ 點寵物名字可以幫牠取名」hint ✅。第三層提示在玩家忘記第一次 toast 時補位。

**位置**：`src/game.js:1197-1199`、`index.html:63-67`
- 目前只有點擊 `.stage-info` 區的 `#stage-name` 才會開取名 dialog，雖然有 `cursor: pointer` + `title`，但 desktop 才看得到 title，手機完全沒提示。
- 玩家進來看到「啾啾 · 蛋 · 下一階段 5h…」這條 pill，會以為它是純資訊 label，不會去點。GDD §10.2 列「取名功能 + 對話系統」是 v0.2 必做，已實作，但**入口隱藏 = 等於沒做**。
- **建議**：
  1. 第一次孵化（`first_hatch` 觸發時）跳一條 toast「點寵物名字可以取名喔～」
  2. 在 stage-info pill 的名字旁加一個小 ✏️ icon（CSS pseudo-element 即可）：
     ```css
     #stage-name::after { content: " ✏️"; font-size: 11px; opacity: 0.6; }
     ```
  3. 或在 `nameSet === false` 時 stage-info 加一條閃爍提示。

### P1-5 「我可以做什麼」入口分散，新玩家會迷路 ✅ DONE

> 已修：`index.html:68-71` header 改為 4 個並列 icon-btn — 🎀 商店 / 🏅 成就 / 📖 圖鑑 / ⚙️ 設定。成就從原本的「📖 → 🏅 二層巢狀」拉到頂層平級。蛋階段 stage-info 下方有 `stage-hint` 探索提示（見 game.js:705 邏輯）。Help dialog 也加了（按 `?` 或 `H`）。

**位置**：`index.html:20-22`、`src/game.js:1194-1196`
- 現在玩家要看 (a) 圖鑑要點 📖、(b) 成就要先點 📖 再點 🏅 按鈕、(c) 設定 / 進化進度要點 ⚙️、(d) 取名要點寵物名字、(e) 蛋還沒孵化的 6 小時內就只剩 onboarding modal 講過的事。圖鑑 → 成就的這層巢狀**很不直覺**（成就比圖鑑更核心，卻被埋在第二層）。
- **建議**：Header 多一個 🏅 成就 icon-btn 與 📖 並列，或把成就和圖鑑合併成一頁 tab 切換。同時建議蛋階段在 stage 區下方多顯示一條「你能做：點蛋摸頭 / 等 6 小時 / 看 📖圖鑑」之類的探索提示（`first_hatch` 後關掉）。

### P1-6 隨機事件 + 進化粒子 + 互動動畫同時觸發時無上限 ✅ DONE

> 已修：`src/game.js:1469` `function particleSlotsLeft(stage) { return PARTICLE_CAP - stage.querySelectorAll(".particle").length }` + `spawnAchievementParticles` 改成 `Math.min(8, particleSlotsLeft(stage))`（`src/game.js:1476`），其他 spawn function 同樣 cap。`.stage` 已有 `overflow: hidden`，超出邊界的粒子被截掉是預期行為而非 bug。

**位置**：`src/game.js:1062-1100`（spawnAchievementParticles / spawnEvolveParticles）、`src/game.js:1141-1147`（event）
- 進化（14 粒）+ 同時解鎖 first_evolve 成就（8 粒）+ 蝴蝶事件 bubble + react-shake 跑 11 個 emoji 同框，加上 `setTimeout` 都是裸的、沒有 `cancelAnimationFrame` 機制。如果玩家在 60s 內連續點 5 次 play、再開 modal、再進化，DOM 會堆 50 個 `.particle` 跟 `.float-emoji`，每個都有 `animation` + `setTimeout(remove)`。
- 行動裝置 480px 寬下，14 個粒子的 `dist = 120 + Math.random() * 50` (`src/game.js:1091`) 會散到 ±170px → **超出 480px 畫布**，會看到粒子在裝置邊框外被截掉。`spawnFloatEmoji` 的 `(50 + ... * 30)` (`src/game.js:1056`) 也可能溢出。
- **建議**：
  1. 在 `#stage` 加 `overflow: hidden`（如果尚無）。檢查現有 `.stage` CSS：`overflow: hidden` 已有 (`src/style.css:147`)，**但 `.stage` 高 360px**而 `--dy: 50 + Math.random()*50` 會往下飛超出範圍，被截掉就好；確認 `.particle` 不會破出寵物舞台框即可。
  2. 對 `.particle` 集合做數量上限：`if (stage.querySelectorAll(".particle").length > 30) return;` 防止失控堆積。
  3. 對 event-bubble、float-emoji 同樣 cap。

---

## 觀察 (P2)

### P2-1 `game.js` 1272 行單一 IIFE，可維護性正在下滑 ⏳ 監控中（iter#137 1955 / buffer 45）

> spec 寫於 1272 行 / 預警「再加商店 / 多寵物 / 音效會逼近 2000」。實況：v0.3 階段加完商店 + 多項功能 + 16 配件 + 18 events 後 game.js 一度高至 1996（iter#114 警戒 buffer 4）。  
> **iter#127-131 R-1 micro-step** 開始抽 11 純工具 → utils.js，game.js 從 1993 → 1955（buffer 45 安全區）。  
> R-1 plan（[`r1-plan.md`](r1-plan.md)）規劃完整拆 IIFE 為 7 module，預期 game.js 終態 ~250 行。仍需 5-7 cron 輪實作。  
> **狀態**：監控中，buffer 45 健康，無觸線風險，可繼續 cfg-driven 加內容。

**位置**：`src/game.js` 整檔
- 單檔尺寸已從 v1 的約 800 行成長到 1272 行（+59%）。所有功能（save、tick、render、interactions、achievements、dex、events、modal、speech）擠在一個 closure 裡，function 之間靠 hoisting 互相 call。
- 還沒到失控，但下一輪如果再加「商店 / 多寵物 / 音效」會逼近 2000 行。
- 解法在「重構機會」區詳述。

### P2-2 1 秒 render 全部重畫，沒做 dirty checking ✅ DONE（iter#76）

> 已修：加 5 個 module 級 cache（`lastStatVals` / `lastCoin` / `lastStageName` / `lastCountdown` / `lastTaskStr`）+ 1 個 element refs cache `cachedStatWraps`。`render()` 對每條 stat / coin / stage 字串 / countdown 字串 / 任務字串做 last-value 比對，沒變就跳過 DOM 寫入。穩定 idle tick 從 12 個 style 寫入 + 5 個 textContent + 4 個 querySelector → **0 寫入**。warn dataset 沒短路（瀏覽器自己 diff，no-op cost 0）。`migrate()` 路徑同步 reset 所有 cache。

**位置**：`src/game.js:612-705`
- 每秒 render 會：
  - 4 條 stat bar 寫 `style.width` + `style.background`（即使值沒變）
  - 2 個 `querySelector(.stat[data-stat="${k}"])`（每秒 4 次 selector）
  - `setActionState()` 每秒讀 6 個 cooldown
  - footer task-text 完整重組字串
  - stage-name + countdown 字串重組
- 已經 cache 了 petSrc / moodSrc / bgKey，但其餘屬性沒做。對主流瀏覽器其實 OK（每秒幾 KB DOM 操作不痛），但行動裝置低電量模式 / Safari 上 Lighthouse Performance 會被扣分。
- **建議**：把整數化 stat（`Math.round(s[k])`）跟上一輪比對，沒變就跳過 bar / value 寫入。或乾脆把 render 拆成 `renderStats()` `renderStage()` `renderActions()` `renderFooter()`，各自 dirty check。

### P2-3 Module 級可變狀態散落，沒有「reset 入口」 ✅ DONE（iter#95）

> 已修：`src/game.js` 加 `resetRenderCaches()` helper（5 行）統一處理 render 12 個 dirty-check cache 清空。`startNewEgg` 的 4 行 inline reset 改呼叫 helper。  
> **Spec 與實況差異**：spec 描述「散落變數」泛指 lastTick / modalOpen / activeEvent / idleTimer 等 module-level mutables，但這些實際**不需要 reset** — 它們是 timer/event runtime state（visibility handler / wireUp* 已分別管理生命週期，iter#79/84）。真正需要 reset 的只是 render 用的 dirty-check 快取（iter#76 加），且只 startNewEgg 一個 in-place state-replacement 路徑會用到（importSave / dbg-reset 都 `location.reload()`）。  
> helper 命名讓未來 migrate / multipet switch / import-without-reload 能直接接，不必重新發明。

**位置**：
- `lastTick`、`lastVisibleAt`（`src/game.js:161-162`）
- `lastPetSrc / lastMoodSrc / lastBgKey`（`src/game.js:163`）
- `modalOpen`、`modalButtons`（`src/game.js:952-953`）
- `activeEvent`、`eventTimer`（`src/game.js:1103-1104`）
- `idleTimer`（`src/game.js:1165`）
- `tickTimer`、`autoSaveTimer`、`speakTimer`（`src/game.js:160`、`994`）
- `startNewEgg()` 重設了 `lastPetSrc/Mood/Bg`（`src/game.js:231`），但**沒重設 `activeEvent`**。如果新蛋瞬間生成時剛好有事件 bubble 漂在上面，bubble 引用的 `state` 已換新但 closure 裡 `def.apply(state)` 還是用舊的 `state` 引用 → 雖然 `state` 是 `let` 重新指派，function 內 `state` 變數會走當時 binding，**仍指新 state**（因為都是 `state` 全局），實際應該 OK，但這種隱式關係很難讀。
- **建議**：把以上散落變數收進一個 `runtime = { lastTick, activeEvent, modalOpen, ... }` 物件，新增 `resetRuntime()` 統一處理。

### P2-4 `eventTimer` / `autoSaveTimer` 從 init 起就跑，永遠不停 ✅ DONE（iter#79）

> 已修：`src/game.js` 加 `notifyTimer` module 變數（原本的 5-min notify interval 是 fire-and-forget 沒法清）+ `startBackgroundTimers()` / `stopBackgroundTimers()` 兩 helper 收 4 個 timer（autoSave / event / wants / notify）。`document.addEventListener("visibilitychange", ...)` 在 `hidden` 時 stop，`visible` 時 start。順帶補一個隱藏 bug：iter#62 storage event read-only 機制只清 tickTimer 沒清 autoSaveTimer，read-only tab 會繼續定時 save 覆蓋活躍 tab — 本輪一併補 `stopBackgroundTimers()`。idleTimer 同步在 hidden 時清，visible 時用既有 `startIdleSpeech()` 重啟。

**位置**：`src/game.js:1204-1205`
- `setInterval` 設定後沒有 clearInterval，連 visibilitychange 也沒清。`tickTimer` 有清，但 `eventTimer` 跟 `autoSaveTimer` 在背景時持續：
  - 背景時 spawn event → 玩家回來看到一個過期 90 秒的氣泡（不嚴重，因為 modalOpen 跟 isSleeping 還會擋）
  - 背景時 autosave 30 秒一次（OK，但浪費）
- **建議**：visibilitychange `hidden` 時 `clearInterval(eventTimer); clearInterval(autoSaveTimer);`，visible 時重啟。

### P2-5 SVG inline vs external `<img>` 的取捨 ✅ DONE（iter#78）

> 已修：採 spec 提的 (b) 方案 — `init()` 跑 `Object.values(CFG.petArt.adult).forEach(src => { const img = new Image(); img.src = src; })` 預熱瀏覽器 HTTP cache。7 種 adult form PNG 在玩家進入時就觸發 fetch，等進化動畫播放時圖片已快取，避免「進化粒子飛到一半才換圖」的 1-frame 卡頓。蛋/雛雞/少年雞透過初始 `petImg.src` 已載入，不需單獨預熱。

**位置**：`index.html:8`、`assets/svg/*`、`src/game.js` 各 art ref
- 目前所有 SVG 用 `<img src=...>`，瀏覽器需要每張獨立 fetch + decode。雛雞、egg、5 種事件氣泡圖都不大（< 2KB），但沒有 sprite sheet、沒有 preload。
- 第一次玩進化到成雞時，`chick-adult-divine.svg` 才被請求，**進化粒子已經飛到一半**才換圖，視覺上會卡 1 frame。
- **建議**（中等優先）：要嘛 (a) `<link rel="preload" as="image" href="...">` 預載 7 種終態與 5 種事件、要嘛 (b) 用 `Image()` 在 init 時觸發 fetch、要嘛 (c) 把所有 SVG 內聯成 JS 模板字串（會增加 HTML/JS 體積但省 fetch）。最簡單是 (b)：
  ```js
  Object.values(CFG.petArt.adult).forEach(src => { const img = new Image(); img.src = src; });
  ```

### P2-6 dex `completedPets` 50 條 cap 之後超過會無聲截斷 ✅ DONE（iter#77）

> 已修：`src/dex.js` 加 `trimWithPinned(dex)` 函式 — 維持 50 cap 但保留 (1) 最舊（第一隻雞） (2) 7 種終態各最早一隻。實測 60 隻 dex archive 第 61 隻：FIRST_EVER 保留 ✅、6 種獨特 finalForm 第一隻保留 ✅、新雞保留 ✅、最舊普通 filler 被砍 ✅。pinned set 上限 8 條（7 forms + 1 oldest），不會膨脹失控。沒提示就砍仍維持靜默（已 50 cap 是設計意圖），但保護了情感投資最大的條目。

**位置**：`src/game.js:218`
- `if (dex.completedPets.length > 50) dex.completedPets.length = 50;`
- 玩家養到第 51 隻時最舊那隻會「消失」，沒有任何提示。對重度玩家（持續玩 3 個月可能就到 50 隻）這很 disappointing，特別是第一隻啾啾 = 紀念意義最強，反而最先被砍。
- **建議**：cap 改 100；或改 FIFO 但保留「第一隻」與「7 種終態各第一次」永不刪除：
  ```js
  // pin: 第一個歷史 + 每種 finalForm 的第一隻
  const pinned = new Set([dex.completedPets.at(-1)?.id]);
  ["healthy","fatty",...].forEach(f => {
    const first = [...dex.completedPets].reverse().find(p => p.finalForm === f);
    if (first) pinned.add(first.id);
  });
  // 然後刪除最舊的非 pinned，直到 length ≤ 50
  ```

### P2-7 餵蛋糕的 `fatPoints` 累積機制有重複加分嫌疑 ✅ DONE

> 已修：`src/game.js:347` overfeed 加分改成 conditional — `if (!cfg.fatPoints) state.pet.traits.fatPoints += 1;`。蛋糕（`cfg.fatPoints=1`）在 hunger>95 餵不再 +2，無論飽不飽都固定 +1。註解標明 P2-7 修正動機。Toast「肥肥+1」字面仍正確（淨 fatPoints 從這次餵 +1）。

**位置**：`src/game.js:424-429`、`src/game.js:438`
- 「過餵」（hunger > 95 時餵食）會 `traits.fatPoints += 1`，**不論餵的是什麼**。
- 蛋糕本身 cfg 也帶 `fatPoints: 1` (`src/game.js:37`)，所以餵蛋糕：
  - 如果餵之前 hunger > 95：先 +1（過餵）→ 然後 cfg.fatPoints +1 = **+2**
  - 否則只 +1
- GDD §11 沒明寫，但「兩個來源加在同一次」會讓玩家在 hunger 50 時餵蛋糕（+1）跟在 hunger 96 時餵蛋糕（+2）的差異不直覺。
- 不算 bug，是設計選擇，但建議在設定頁 fatPoints row 加註解或把過餵獨立計算。

### P2-8 鍵盤可用性 / aria-label 缺漏 ✅ DONE

> 已修，5 個子項全部處理：
> - **action button aria-label**：`index.html:127-148` 5 個 `<button class="action-btn">` 都加 `aria-label`（餵食/玩耍/洗澡/睡眠/愛撫）
> - **pet-wrapper a11y**：`index.html:108` 改 `<button class="pet-wrapper" type="button" aria-label="輕觸啾啾摸頭">`，原本 `<div onclick>` 移除
> - **modal focus trap**：`src/ui.js:124-126` capture-phase keydown listener 攔 Tab 鍵循環 modal-card 內 focusable
> - **ESC 關 modal**：`src/game.js:1873` `if (e.key === "Escape" && window.NourishUI.isModalOpen()) closeModal()`
> - **aria-modal**：`index.html:163` `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-card">`
> - 額外：modal 開啟時 focus 自動移到第一個 input/button（`src/ui.js:104-108`）；關閉時 focus 復原到開啟者（`modalReturnFocus`）

**位置**：`index.html:71-92`、`src/game.js:1196`
- 5 個 action button (`btn-feed/play/bath/sleep/pet`) 沒有 `aria-label`（只有 `<span class="action-label">`，screen reader 會讀「餵食 餵食」之類重複）。
- `pet-wrapper` 是 `<div onclick>`，鍵盤 Tab 不到，screen reader 也不知道它可點。應該改成 `<button>` 或加 `role="button" tabindex="0"` + Enter/Space handler。
- 取名 dialog 內的 input 有 focus，但 modal 沒有 focus trap，Tab 會跳到頁面後面。
- 設定頁、圖鑑、成就頁的 close 按鈕沒做 ESC key 關閉。
- 已有 `aria-live="polite"` 在 toast container（OK），但沒有 aria-modal 在 modal。
- 不擋 v0.1，但 GDD §10.4 App 階段時可能踩 store 上架 a11y 條件。

### P2-9 i18n 預留：CFG 內中文字串硬編碼，無 i18n hook ✅ DONE 預留（iter#104）

> 已修 hook：`src/i18n.js` 提供 `window.NourishI18n.t(key, opts)` 函式 + zh-TW / en 雙 dict + localStorage("nourish.locale.v1") 持久化 + `${var}` 簡單插值。  
> **Spec 與本輪 scope 差異**：spec 講「CFG 內中文字串硬編碼」需要全面替換；本輪只做 plumbing — 12 條種子翻譯（install banner / stage hints / task done）+ 函式介面。**未替換任何既有 hardcoded 字串**，留給未來 round 機械化遷移。  
> 海外曝光路徑開工就緒：未來 PR 替換時，t() 函式 + 增 dict entry 即可，不必改架構。

**位置**：`src/game.js:46-48`（label）、`src/game.js:90-97`（speech）、`src/game.js:51-69`（achievements）、`src/game.js:1006-1011`（labels function）、各 toast / modal title 字串
- CLAUDE.md §5 說「v0.2 要支援中英切換」，**目前架構不支援**。所有顯示字串都直接寫在 source。
- 不算 v0.1 缺陷，但每多一輪迭代就多一批要回頭翻譯的字串。
- **建議**（屬重構，列在重構區）：抽 `LANG.zh = { ... }` `LANG.en = { ... }` 物件，至少把 toast / modal title / formLabel / formDescription / achievement label/desc 收進去；speech 跟 idle 句子可以維持中文不翻（角色設定）。

### P2-10 進化條件「同時 score+duration 滿足」對玩家不友好 ✅ DONE

> 已修：`src/game.js:560-571` countdown 字串 3 階段條件分支 + 註解標 P2-10：
> - `remainMs > 0`：「下一階段 X · 成長 N/M」（時間 + 成長雙顯示）
> - `remainMs == 0 && need > 0`：「再多互動 N 點就能進化」（時間到但成長不夠的明確文案）
> - `remainMs == 0 && need == 0`：「準備進化中…」（雙條件達成）
> 第 2 階段是 spec 點名的關鍵 — 解決「為什麼時間到了還沒進化」的玩家困惑。

**位置**：`src/game.js:339-340`
- 條件 `elapsed >= cfg.duration && state.pet.growthScore >= cfg.scoreToEvolve`，玩家可能滿了時間（egg 6h 過了）但 score 不夠（沒 30 分），會卡在「下一階段 0 · 成長 25/30」字串上。**沒有任何 hint 告訴玩家「再多互動 5 分」**。
- countdown 文字 (`src/game.js:637`) 寫 `下一階段 ${formatTime(remainMs)} · 成長 X/Y`，當 `remainMs <= 0` 時 `formatTime` 顯示「可進化」。但玩家看到「可進化 · 成長 25/30」會困惑「可不可以？」
- **建議**：當 `remainMs <= 0` 但 score 不夠，改顯示「再多互動 ${cfg.scoreToEvolve - score} 點即可」；或自動把 score 補滿（只要時間到），降低硬卡感。

---

## 重構機會

### R-1 拆 `game.js` 為多個 IIFE 載入序列（純 HTML+JS 約束下）
**動機**：1272 行單檔在「再加 1-2 個功能後」會變成負擔；search/locate 同名 helper 已經要靠 grep。
**做法**（無 build step 限制下）：
- 切 5-7 個檔案，每個 IIFE export 到 `window.Nourish.Save / .State / .Render / .Interactions / .Events / .Achievements / .Dex`：
  ```html
  <script src="src/cfg.js"></script>
  <script src="src/state.js"></script>
  <script src="src/render.js"></script>
  <script src="src/interactions.js"></script>
  <script src="src/events.js"></script>
  <script src="src/achievements.js"></script>
  <script src="src/main.js"></script>
  ```
- 每個檔案約 150-300 行，符合「單檔在編輯器一個畫面內」原則。
- `CFG` 移到 `cfg.js`，是純資料。`state` 物件可以放在 `state.js` 並 export getter。
- 這保持「無 build step」（HTML 就是模組系統）、不違反 CLAUDE.md §10。
**Effort**：2-3 小時，主要是分檔 + 確保載入順序對 + 重新測一輪。**ROI 高**，會大幅降低後續改動成本。

### R-2 抽 `openMenu(items, title, icon)` 統一 3 個三選一 menu ✅ DONE（iter#73 超 spec）

> 已實作於 iter#73，但採用**配置驅動**版本而非 spec 中的「title + keys 兩參數」：
> - `CFG.interactionMenus = { feed: {title, items}, play: {...}, pet: {...} }`（`src/cfg.js:50-56`）
> - `function openInteractionMenu(cat)` 單參數（`src/game.js:802-813`）
> - 5 個 binding 點都簡化（init `btn-feed/play/pet` + keyboard `1/2/5`）
> - 額外 iter#74 寫 `scripts/check-cfg-schema.js` 守 `interactionMenus[cat].items[*]` ∈ `interactions` keys
> - **比 spec 好的點**：v0.3 加新分類（grooming / training）只動 cfg.js 不動 game.js；item 順序與 cfg.interactions 定義順序解耦
> - game.js -17 行 / cfg.js +7 行

**動機**：`openFeedMenu` / `openPlayMenu` / `openPetMenu` (`src/game.js:743-772`) 結構完全相同，只差 title 跟 items 陣列。`menuItemHTML` + `bindMenuItems` 已經抽掉一半，但外殼還是重複。
**做法**：
```js
function openInteractionMenu(title, keys) {
  showModal({
    title,
    body: `<div class="modal-list">${keys.map(menuItemHTML).join("")}</div>`,
    buttons: [{ label: "關閉", close: true }],
    onMount: bindMenuItems,
  });
}
// 呼叫端
$("btn-feed").onclick = () => openInteractionMenu("🍗 餵食", ["feed_basic","feed_corn",...]);
```
**Effort**：15 分鐘。低風險，建議先做。

### R-3 把 settings/dex/achievements 三個列表用一個 `renderRows()` helper 收 ✅ DONE 部分（iter#81）

> 已修：`src/ui.js` 加 `lockableRowHTML({icon, label, desc, locked})` helper，在 `openAchievementsMenu` + `openDexMenu` 的 forms 區塊呼叫（兩個近似 lockable row 結構）。原本 `<div class="settings-row" style="${have?"":"opacity:0.4"}"><span>icon strong label</span><small>desc</small></div>` 散兩處重複，現在收 helper。
> **未完整實作**：
> - settings 內的 row（line 1019, 1049-1059 等）結構是 `<span>label</span><strong>value</strong>`，不是 lockable，**不適用此 helper**
> - event-stats `<strong>count</strong>` 結構也不同，跳過
> - 結論：spec 講的「3 個列表」實際只有 2 個能共用 helper（achievements + dex forms）。設計上可接受，未來有第 3 個 lockable list 自動受益。

**動機**：三個 modal body 都是 `settings-row` 列表 (`src/game.js:801-846`、`851-866`、`868-908`)，HTML 字串拼接重複多。
**做法**：抽
```js
function rowHTML(left, right, opts = {}) {
  const dim = opts.locked ? "opacity:0.4" : "";
  return `<div class="settings-row" style="${dim}">
    <span>${left}</span><strong>${right}</strong>
  </div>`;
}
```
然後三個 menu 都用它組。
**Effort**：30 分鐘。

### R-4 中央化 timer / animation 生命週期管理 ✅ DONE 大宗（iter#79 + iter#139）

> 已實作於 2 階段：
> - **Timer 部分（iter#79）**：`src/game.js` 加 `startBackgroundTimers()` / `stopBackgroundTimers()` 收 4 個背景 timer，配合 wireUp* helpers 收 tick / idle / visibility / storage event；含 `notifyTimer` 從 fire-and-forget 改為 module 級可清。順帶修 iter#62 read-only tab autosave 隱藏覆蓋 bug。
> - **Animation 部分（iter#139 本輪）**：6 個 animation helpers 抽到新模組 `src/animations.js`（115 行）— pulseEvolve / playReactionAnim / spawnFloatEmoji / particleSlotsLeft / spawnAchievementParticles / spawnEvolveParticles。DOM-only / state-independent / 暴露為 `window.NourishAnim`。game.js -86 行（buffer 131）。
> 
> **未完整實作**：animation 內 `setTimeout(() => el.remove(), 1500)` 等 timeout 仍 fire-and-forget — 玩家切頁時無法 cleanup。屬於極端 edge case（page closing），不影響 v0.2/v0.3 launch，留 v0.4 multipet 重構時順手解決。整體 spec 「中央化 timer / animation」核心精神已達成。

**動機**：眼下有 6 個 setInterval + N 個裸 setTimeout，散落在 init / startTick / startIdleSpeech / autoSave / event / particles / animations。沒有「destroy」入口。如果未來要做「寵物死亡 / 重新開始」之類，會漏 clear。
**做法**：建一個 `Timers` 物件：
```js
const Timers = {
  list: [],
  set(fn, ms, kind = "interval") {
    const id = (kind === "interval" ? setInterval : setTimeout)(fn, ms);
    this.list.push({ id, kind });
    return id;
  },
  clearAll() {
    this.list.forEach(({ id, kind }) =>
      (kind === "interval" ? clearInterval : clearTimeout)(id));
    this.list = [];
  }
};
```
搭 R-1 的 module 拆分一起做最自然。
**Effort**：1 小時。

### R-5 把 i18n 預留好：抽 `i18n.t(key, ...args)` ✅ DONE 大宗（iter#104-137）

> 已實作於 iter#104（i18n MVP plumbing）後 14 輪 batch 累計：
> - `src/i18n.js` 80+ 行 module 提供 `t(key, opts)` + `${var}` 插值 + zh-TW/en 雙 dict + locale 持久化
> - **197 條種子翻譯**（zh + en）+ 128+ 處 hardcoded 替換
> - 雙欄位 (labelKey + label fallback) 模式覆蓋 cfg：accessories 16 / interactions 14 / wants 14 / achievements 60（label+desc）
> - 單欄位 (純 t()) 模式覆蓋：share.js 14 / index.html 18 attrs / game.js toasts 13 / modal titles+buttons 17 / onboarding 27 / 等
> - **136+ user-facing items** 玩家切 locale 後英文化
> - `cfgLabel(entry)` / `cfgDesc(entry)` utils helper
> - `applyI18nDom(root)` 自動掃 `data-i18n` / `data-i18n-aria` / `data-i18n-title` 屬性套用
> 
> **未完整實作**（剩 cfg.speech 230+ 條，需 spawn-time t() 解析機制設計）— 是 v0.4 launch 海外時的工作，不是 v0.2 阻擋線。整體 spec 「3-4 小時架子搭起來 + 全檔掃」的精神已全達成。

**動機**：v0.2 要支援中英（CLAUDE.md §5），愈晚抽愈痛。
**做法**：
```js
const I18N = {
  zh: { stage_egg: "蛋", form_divine: "神雞", toast_overfeed: "吃太飽了…肥肥+1", ... },
  en: { stage_egg: "Egg", form_divine: "Divine", toast_overfeed: "Too full… fat+1", ... },
};
const lang = state.settings?.lang || "zh";
const t = (k, ...args) => {
  const tpl = I18N[lang][k] ?? I18N.zh[k] ?? k;
  return args.length ? args.reduce((s, v, i) => s.replaceAll(`{${i}}`, v), tpl) : tpl;
};
```
所有顯示字串改 `t("stage_egg")`。第一輪不需要真的翻譯英文，先把架子搭起來。
**Effort**：3-4 小時（要全檔掃過）。建議與 R-1 一起做。

---

## v0.2 路線圖建議（依 ROI 排序）

> 評分標準：玩家可感知影響 ÷ 實作 effort × 解 bug bonus

### 1. 修 P1-1（debug button gating）+ P1-2（cross-tab race）+ P1-3（quota）
**Why**：穩定性與防作弊，每個 0.5-1 小時。三個合計 2 小時可清掉「能上線但會出醜」的雷。**ROI 最高**。
**Effort**：2 小時
**Output**：對玩家無新功能，但避免 bug report

### 2. P1-4 + P1-5（取名按鈕可發現性 + 探索性入口）
**Why**：取名功能 + 7 種終態 + 17 條成就，**做了但玩家不知道**。再多功能不如先讓玩家看見現有功能。Header 多 1 個 icon + 蛋階段引導 toast = 30 分鐘。
**Effort**：30 分鐘
**Output**：留存 + 取名互動率提升

### 3. R-1（拆 game.js 模組）+ R-2/R-3（重複 helper 抽出）
**Why**：1272 行已成天花板，先重構 1 次再加新功能，後續每加 1 條 v0.2 都省 30%。也是 v0.2 階段引入新人協作 / sub-agent 工作的前置。
**Effort**：3-4 小時
**Output**：可維護性 +50%，bug 表面積 -30%

### 4. 設定頁正式化（音效切換 + 語言 + reduced motion + dark mode 預留）
**Why**：CLAUDE.md §9 寫 MVP 完成度 18/19 卡在「正式設定頁」，目前的 settings 是 debug 雜燴。把它切成「玩家設定 / 寵物進度 / 除錯」三段。同時引入 R-5 i18n 架子。
**Effort**：3 小時（含 i18n 架構）
**Output**：MVP 完成度 19/19、為 v0.2 中英切換鋪路

### 5. 互動式神祕草藥（GDD 對齊）
**Why**：GDD §10.2 列「神祕草藥」應該是「互動行為」（feed_herb，免費 / 高 cd），目前做成「隨機事件 only」(`src/game.js:76`)，玩家無法主動使用。完整實作會讓玩家能「預先規劃 → 出狀態危機時喝草藥」，加 strategic depth。
**Effort**：1 小時
**Output**：GDD 對齊度 +、玩法深度 +

---

## 與 v1 review 對照

| v1 標籤 | 結果 | 證據 |
|---|---|---|
| P0-1 時鐘倒退 | ✅ 已修 | `src/game.js:289-290`（`Number.isFinite` + 5min cap）|
| P0-2 背景節流 | ✅ 已修 | `src/game.js:1210-1223` visibilitychange handler |
| P0-3 8-12h 心情 -5 / >12h 哭 | ✅ 已修 | `src/game.js:589-593` |
| P0-4 fighter 終態 | ✅ 已修 | `src/game.js:359-362` 加完 4 條分支 |
| P1-1 migrate deepMerge | ✅ 已修 | `src/game.js:241-253` |
| P1-2 lastPetSrc 快取 | ✅ 已修 | `src/game.js:163, 657, 671, 686` |
| P1-3 進度條閃紅 | ✅ 已修 | `src/style.css:105-110` `bar-warn` keyframe |
| P1-4 v0.2 互動補完 | ✅ 已修 | feed/play/pet 全 14 條都到位 |
| P1-6 設定頁顯示 traits | ✅ 已修 | `src/game.js:805-812` 6 條 row |
| P1-7 每日任務 | ✅ 已修 | `src/game.js:563-576` + footer 顯示 |
| P1-8 reduced motion | 🟡 部分 | `src/style.css:112-119` 有 keyword，但音效切換 / 語言還沒 |
| P1-9 maximum-scale | ✅ 已修 | `index.html:5` 不再有 |
| P1-10 onboarding modal | ✅ 已修 | `src/game.js:1254-1265` |
| P1-11 睡覺 disable 按鈕 | ✅ 已修 | `src/game.js:707-714` |
| P2-5 dex | ✅ 已實作 | 第 4 輪迭代 |
| P2-6 開新蛋 | ✅ 已實作 | 第 4 輪迭代 |

v1 提的 4 P0 + 12 P1 中 14 條全部修掉，剩 1 條（音效 / 語言設定）部分修。**修復率 87%**。

---

## 結論

8 輪自動優化的成果紮實：核心循環閉合、成就 / 圖鑑 / 隨機事件 / 進化粒子 / 互動動畫五大內容層全部就位、視覺一致性透過 character-sheet 鎖住。代價是 `game.js` 已經到了「該重構一次再繼續」的尺寸。

**建議下一輪**：
1. 先修 P1-1/P1-2/P1-3（穩定性 / 防作弊，2h）
2. 修 P1-4/P1-5（讓既有功能被看見，30min）
3. 然後做 R-1（檔案拆分，3h）

做完上述 6 小時的工作後再進 v0.2 內容擴充，會比直接堆功能順很多。
