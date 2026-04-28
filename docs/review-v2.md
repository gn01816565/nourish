# 啾啾日常 ChickaDay v0.1 + 8 輪優化 — Code & Gameplay Review v2

> Review 日期：2026-04-28
> Reviewer：Code & Gameplay Review Agent v2
> 範圍：MVP v0.1 + 8 輪自動優化後的累積狀態
> 對照：v1 review (`docs/review.md`)、`docs/iteration-log.md`、`docs/gdd.md` §10/§11、`docs/character-sheet.md`

---

## 摘要

**良好（B+）** — v1 列出的 4 個 P0 全部修掉、12 個 P1 大部分覆蓋，遊戲循環從「開放結尾」變成閉合（蛋→養→進化→圖鑑→新蛋），同時長出 17 條成就、5 種隨機事件、SVG 化事件氣泡、4 種互動反應動畫、進化粒子。但 `game.js` 已膨脹到 1272 行單一 IIFE，可維護性開始劣化；探索性入口集中在頂部兩個 icon 而玩家不易發現；存檔層尚無 quota / 跨 tab 防護；設定頁殘留 production 不該外露的 debug 操作。沒有新增 P0，但有 4 個 P1 與 6 個 P2 累積。

---

## 必修 (P0)

無新 P0。v1 的 P0-1 ~ P0-4 全部驗證已修（時鐘倒退保護、背景節流校正、welcome-back 8-12h 心情 -5、fighter 終態分支）。

---

## 建議 (P1)

### P1-1 設定頁的 debug 按鈕在 production 該 gate 起來
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

### P1-2 跨 tab 開兩個分頁的 race condition 沒處理
**位置**：`src/game.js:166-185`（load/save）、`src/game.js:1204`（autosaveTimer）
- 玩家在 A 分頁累積 5 次餵食，在 B 分頁同帳號開來看，B 會載入舊 state；接著 B 自己的 30s autosave fire，會用 B 的舊 state 把 A 的進度蓋回去。1 秒 tick 在 B 也持續寫 cooldown / growthScore，等同「兩個 tab 互相覆寫」。
- 玩家用兩個瀏覽器 / 桌機 + 手機開（這款定位上班族 idle 養成，**很可能放兩個地方**），會看到莫名其妙的數值倒退、cooldown 重置、甚至成就/圖鑑被覆蓋掉。
- **建議**：監聽 `window.addEventListener("storage", e => { if (e.key === CFG.save.key) location.reload(); })`，當另一 tab 寫入時強制本 tab 重載；或更輕量的「tab id + 最後寫入者」競賽機制，讓晚進的 tab 進入唯讀。

### P1-3 localStorage QuotaExceeded 完全沒兜底（Safari 私密模式 = 0 容量）
**位置**：`src/game.js:178-185`、`src/game.js:198-200`
- `save()` 跟 `saveDex()` 都有 try/catch，但只 `console.warn`，玩家完全不知道存檔失敗。在 Safari 私密模式（quota = 0）或長期使用後其他網站搶滿 5MB 配額時，存檔會靜默失敗 → 玩家養 3 天的小雞下次重整就回到初始。
- **建議**：catch 到 QuotaExceededError 時 toast 一條紅字「存檔空間不足，進度可能無法保留」，並把 dex cap 從 50 降到 20 確保不爆。
  ```js
  } catch (e) {
    if (e?.name === "QuotaExceededError") toast("⚠️ 存檔空間不足", "bad");
    console.warn("Save failed:", e);
  }
  ```

### P1-4 取名按鈕的可發現性差
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

### P1-5 「我可以做什麼」入口分散，新玩家會迷路
**位置**：`index.html:20-22`、`src/game.js:1194-1196`
- 現在玩家要看 (a) 圖鑑要點 📖、(b) 成就要先點 📖 再點 🏅 按鈕、(c) 設定 / 進化進度要點 ⚙️、(d) 取名要點寵物名字、(e) 蛋還沒孵化的 6 小時內就只剩 onboarding modal 講過的事。圖鑑 → 成就的這層巢狀**很不直覺**（成就比圖鑑更核心，卻被埋在第二層）。
- **建議**：Header 多一個 🏅 成就 icon-btn 與 📖 並列，或把成就和圖鑑合併成一頁 tab 切換。同時建議蛋階段在 stage 區下方多顯示一條「你能做：點蛋摸頭 / 等 6 小時 / 看 📖圖鑑」之類的探索提示（`first_hatch` 後關掉）。

### P1-6 隨機事件 + 進化粒子 + 互動動畫同時觸發時無上限
**位置**：`src/game.js:1062-1100`（spawnAchievementParticles / spawnEvolveParticles）、`src/game.js:1141-1147`（event）
- 進化（14 粒）+ 同時解鎖 first_evolve 成就（8 粒）+ 蝴蝶事件 bubble + react-shake 跑 11 個 emoji 同框，加上 `setTimeout` 都是裸的、沒有 `cancelAnimationFrame` 機制。如果玩家在 60s 內連續點 5 次 play、再開 modal、再進化，DOM 會堆 50 個 `.particle` 跟 `.float-emoji`，每個都有 `animation` + `setTimeout(remove)`。
- 行動裝置 480px 寬下，14 個粒子的 `dist = 120 + Math.random() * 50` (`src/game.js:1091`) 會散到 ±170px → **超出 480px 畫布**，會看到粒子在裝置邊框外被截掉。`spawnFloatEmoji` 的 `(50 + ... * 30)` (`src/game.js:1056`) 也可能溢出。
- **建議**：
  1. 在 `#stage` 加 `overflow: hidden`（如果尚無）。檢查現有 `.stage` CSS：`overflow: hidden` 已有 (`src/style.css:147`)，**但 `.stage` 高 360px**而 `--dy: 50 + Math.random()*50` 會往下飛超出範圍，被截掉就好；確認 `.particle` 不會破出寵物舞台框即可。
  2. 對 `.particle` 集合做數量上限：`if (stage.querySelectorAll(".particle").length > 30) return;` 防止失控堆積。
  3. 對 event-bubble、float-emoji 同樣 cap。

---

## 觀察 (P2)

### P2-1 `game.js` 1272 行單一 IIFE，可維護性正在下滑
**位置**：`src/game.js` 整檔
- 單檔尺寸已從 v1 的約 800 行成長到 1272 行（+59%）。所有功能（save、tick、render、interactions、achievements、dex、events、modal、speech）擠在一個 closure 裡，function 之間靠 hoisting 互相 call。
- 還沒到失控，但下一輪如果再加「商店 / 多寵物 / 音效」會逼近 2000 行。
- 解法在「重構機會」區詳述。

### P2-2 1 秒 render 全部重畫，沒做 dirty checking
**位置**：`src/game.js:612-705`
- 每秒 render 會：
  - 4 條 stat bar 寫 `style.width` + `style.background`（即使值沒變）
  - 2 個 `querySelector(.stat[data-stat="${k}"])`（每秒 4 次 selector）
  - `setActionState()` 每秒讀 6 個 cooldown
  - footer task-text 完整重組字串
  - stage-name + countdown 字串重組
- 已經 cache 了 petSrc / moodSrc / bgKey，但其餘屬性沒做。對主流瀏覽器其實 OK（每秒幾 KB DOM 操作不痛），但行動裝置低電量模式 / Safari 上 Lighthouse Performance 會被扣分。
- **建議**：把整數化 stat（`Math.round(s[k])`）跟上一輪比對，沒變就跳過 bar / value 寫入。或乾脆把 render 拆成 `renderStats()` `renderStage()` `renderActions()` `renderFooter()`，各自 dirty check。

### P2-3 Module 級可變狀態散落，沒有「reset 入口」
**位置**：
- `lastTick`、`lastVisibleAt`（`src/game.js:161-162`）
- `lastPetSrc / lastMoodSrc / lastBgKey`（`src/game.js:163`）
- `modalOpen`、`modalButtons`（`src/game.js:952-953`）
- `activeEvent`、`eventTimer`（`src/game.js:1103-1104`）
- `idleTimer`（`src/game.js:1165`）
- `tickTimer`、`autoSaveTimer`、`speakTimer`（`src/game.js:160`、`994`）
- `startNewEgg()` 重設了 `lastPetSrc/Mood/Bg`（`src/game.js:231`），但**沒重設 `activeEvent`**。如果新蛋瞬間生成時剛好有事件 bubble 漂在上面，bubble 引用的 `state` 已換新但 closure 裡 `def.apply(state)` 還是用舊的 `state` 引用 → 雖然 `state` 是 `let` 重新指派，function 內 `state` 變數會走當時 binding，**仍指新 state**（因為都是 `state` 全局），實際應該 OK，但這種隱式關係很難讀。
- **建議**：把以上散落變數收進一個 `runtime = { lastTick, activeEvent, modalOpen, ... }` 物件，新增 `resetRuntime()` 統一處理。

### P2-4 `eventTimer` / `autoSaveTimer` 從 init 起就跑，永遠不停
**位置**：`src/game.js:1204-1205`
- `setInterval` 設定後沒有 clearInterval，連 visibilitychange 也沒清。`tickTimer` 有清，但 `eventTimer` 跟 `autoSaveTimer` 在背景時持續：
  - 背景時 spawn event → 玩家回來看到一個過期 90 秒的氣泡（不嚴重，因為 modalOpen 跟 isSleeping 還會擋）
  - 背景時 autosave 30 秒一次（OK，但浪費）
- **建議**：visibilitychange `hidden` 時 `clearInterval(eventTimer); clearInterval(autoSaveTimer);`，visible 時重啟。

### P2-5 SVG inline vs external `<img>` 的取捨
**位置**：`index.html:8`、`assets/svg/*`、`src/game.js` 各 art ref
- 目前所有 SVG 用 `<img src=...>`，瀏覽器需要每張獨立 fetch + decode。雛雞、egg、5 種事件氣泡圖都不大（< 2KB），但沒有 sprite sheet、沒有 preload。
- 第一次玩進化到成雞時，`chick-adult-divine.svg` 才被請求，**進化粒子已經飛到一半**才換圖，視覺上會卡 1 frame。
- **建議**（中等優先）：要嘛 (a) `<link rel="preload" as="image" href="...">` 預載 7 種終態與 5 種事件、要嘛 (b) 用 `Image()` 在 init 時觸發 fetch、要嘛 (c) 把所有 SVG 內聯成 JS 模板字串（會增加 HTML/JS 體積但省 fetch）。最簡單是 (b)：
  ```js
  Object.values(CFG.petArt.adult).forEach(src => { const img = new Image(); img.src = src; });
  ```

### P2-6 dex `completedPets` 50 條 cap 之後超過會無聲截斷
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

### P2-7 餵蛋糕的 `fatPoints` 累積機制有重複加分嫌疑
**位置**：`src/game.js:424-429`、`src/game.js:438`
- 「過餵」（hunger > 95 時餵食）會 `traits.fatPoints += 1`，**不論餵的是什麼**。
- 蛋糕本身 cfg 也帶 `fatPoints: 1` (`src/game.js:37`)，所以餵蛋糕：
  - 如果餵之前 hunger > 95：先 +1（過餵）→ 然後 cfg.fatPoints +1 = **+2**
  - 否則只 +1
- GDD §11 沒明寫，但「兩個來源加在同一次」會讓玩家在 hunger 50 時餵蛋糕（+1）跟在 hunger 96 時餵蛋糕（+2）的差異不直覺。
- 不算 bug，是設計選擇，但建議在設定頁 fatPoints row 加註解或把過餵獨立計算。

### P2-8 鍵盤可用性 / aria-label 缺漏
**位置**：`index.html:71-92`、`src/game.js:1196`
- 5 個 action button (`btn-feed/play/bath/sleep/pet`) 沒有 `aria-label`（只有 `<span class="action-label">`，screen reader 會讀「餵食 餵食」之類重複）。
- `pet-wrapper` 是 `<div onclick>`，鍵盤 Tab 不到，screen reader 也不知道它可點。應該改成 `<button>` 或加 `role="button" tabindex="0"` + Enter/Space handler。
- 取名 dialog 內的 input 有 focus，但 modal 沒有 focus trap，Tab 會跳到頁面後面。
- 設定頁、圖鑑、成就頁的 close 按鈕沒做 ESC key 關閉。
- 已有 `aria-live="polite"` 在 toast container（OK），但沒有 aria-modal 在 modal。
- 不擋 v0.1，但 GDD §10.4 App 階段時可能踩 store 上架 a11y 條件。

### P2-9 i18n 預留：CFG 內中文字串硬編碼，無 i18n hook
**位置**：`src/game.js:46-48`（label）、`src/game.js:90-97`（speech）、`src/game.js:51-69`（achievements）、`src/game.js:1006-1011`（labels function）、各 toast / modal title 字串
- CLAUDE.md §5 說「v0.2 要支援中英切換」，**目前架構不支援**。所有顯示字串都直接寫在 source。
- 不算 v0.1 缺陷，但每多一輪迭代就多一批要回頭翻譯的字串。
- **建議**（屬重構，列在重構區）：抽 `LANG.zh = { ... }` `LANG.en = { ... }` 物件，至少把 toast / modal title / formLabel / formDescription / achievement label/desc 收進去；speech 跟 idle 句子可以維持中文不翻（角色設定）。

### P2-10 進化條件「同時 score+duration 滿足」對玩家不友好
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

### R-2 抽 `openMenu(items, title, icon)` 統一 3 個三選一 menu
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

### R-3 把 settings/dex/achievements 三個列表用一個 `renderRows()` helper 收
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

### R-4 中央化 timer / animation 生命週期管理
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

### R-5 把 i18n 預留好：抽 `i18n.t(key, ...args)`
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
