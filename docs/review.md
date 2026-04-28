# 啾啾日常 ChickaDay v0.1 — Code & Gameplay Review

> Review 日期：2026-04-28
> Reviewer：Code + Gameplay Review Agent
> 範圍：`index.html`, `src/style.css`, `src/game.js` 對照 GDD v0.1

---

## 摘要

**有條件通過** — 核心循環、四大數值、離線衰減、進化階段、經濟、每日登入皆已落地，遊戲性與 GDD §11 數值表相符；但有 4 個 P0 等級的正確性 / 體驗 bug 必須在公開上線前處理（時鐘倒退、tick 背景節流、離線回歸的 5 級訊息只實作 4 級、進化分支只覆蓋 3/7）。

---

## 必修 (P0)

### P0-1 `lastTickAt` 時鐘倒退會炸出 NaN / 不衰減
**位置**：`src/game.js:148-150`
```js
const elapsedMs = Math.max(0, now - state.lastTickAt);
if (elapsedMs < 1000) { state.lastTickAt = now; return { elapsedMs: 0 }; }
```
- `Math.max(0, …)` 雖防止負值，但若使用者調過系統時鐘（往前撥）導致 `now < state.lastTickAt`，計算 `elapsedMs = 0` 會直接 fall-through 並不更新 `state.lastTickAt`（已被 if 提早 return 修掉這條），可是**`tickOnline` 那邊用的是 `lastTick` 區域變數**，不會檢查倒退。
- 同檔 `src/game.js:701-708`：`tickTimer` 內 `dt = now - lastTick`；若使用者在分頁背景時系統時鐘往前跳（例如 NTP 校正），`dt` 會變成大負數 → `minutes` 是負 → `applyDelta` 會「倒著加」狀態值。雖然有 `clamp 0~100`，但 `growthScore` 在 `tickOnline` 是 `Math.max(0, … + dScore)`，可保底；不過 `traits.perfectStreakMinutes += minutes` (`src/game.js:198`) 沒有保底，**會被加負數**。
- **修法**：`tickOnline` 開頭加 `if (deltaMs <= 0 || deltaMs > 24*3600*1000) return;`，並在 `setInterval` callback 中 `dt = Math.max(0, Math.min(now - lastTick, 5*60*1000))`（單次 tick 最多算 5 分鐘，避免某些瀏覽器延遲累積失真）。

### P0-2 分頁背景時 `setInterval` 被節流，前景 tick 漏算
**位置**：`src/game.js:701-708`, `714-723`
- `setInterval(…, 1000)` 在 Chrome 背景分頁會被節流到 ~1 次/分鐘，在 Safari 背景會直接被 freeze。**目前 `tickOnline` 用 `dt` 計算 elapsed minutes 表面上可以容忍**（即使 setInterval 1 秒變 60 秒，下一次 dt 會是 60000ms，理論上補回來）。但搭配 P0-1 的時鐘問題與 visibility 監聽會出 race：
  - `visibilitychange` 隱藏時呼叫 `save()`，但**沒有更新 `lastTick`**；下次回前景時 `dt = now - lastTick` 會是「上一個前景 tick 到現在」的差，**這段時間其實該走離線衰減而不是線上衰減**。
  - 結果：背景關了 8 小時，回來會被當作「線上 8 小時」一次性衰減，比離線衰減快 2 倍以上，玩家會看到飢餓掉光、體力炸滿（線上是 -energy，但你沒進入睡眠模式，最壞情境是飢餓直接 0）。
- **修法**：
  ```js
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      save();
      // 強制把 lastTickAt 設成當下，讓回來時走 reconcileOffline
      state.lastTickAt = Date.now();
      save();
      clearInterval(tickTimer); tickTimer = null;
    } else {
      reconcileOffline();
      lastTick = Date.now();           // ← 重新校正 setInterval 用的本地 lastTick
      lastVisibleAt = Date.now();
      tickTimer = tickTimer || setInterval(/* …same callback… */, 1000);
      render();
    }
  });
  ```
  並把 `lastTick` 從 `init` 內部變數提升為 module 級，方便 visibility handler 重設。

### P0-3 離線回歸 5 級訊息只實作 4 級
**位置**：`src/game.js:47-53`（CFG.welcomeBack）
- GDD §7.4 規格 5 級：`<30min` 靜默、`30m–3h`、`3–8h`、`8–12h`（**心情 -5**）、`>12h`（**大哭動畫 + 補償 20 FC**）。
- 程式碼 `welcomeBack` 表格只 5 entry 看起來對，但：
  1. `8–12h` tier **沒有實作「心情額外 -5」**（GDD 明文）。`showWelcomeBack` 只看 `tier.giveCoin`。
  2. `>12h` tier **沒有「大哭動畫」**（沒切到 mood-sad 或特殊動畫）。
  3. `<30min` 規格是「靜默更新」但程式 `tier.text === null` 會卡在 `if (!tier || !tier.text) return;`，OK；但因為 `showWelcomeBack` 只在 `elapsedMs > 30 * 60 * 1000` 才呼叫（`src/game.js:729`），第 1 級永遠進不去，是冗餘設計，建議刪除第 1 級或統一邏輯。
- **修法**（最小）：在 `showWelcomeBack` 裡，依 tier 索引套用副作用：
  ```js
  const idx = CFG.welcomeBack.indexOf(tier);
  if (idx === 3) { state.pet.stats.mood = clamp(state.pet.stats.mood - 5, 0, 100); }
  if (idx === 4) { speak("嗚嗚嗚~"); /* 之後可加大哭動畫 class */ }
  ```

### P0-4 進化終態只實作 3/7，沒有「戰鬥雞 / 智慧雞 / 歌姬雞」分支
**位置**：`src/game.js:236-243` (`finalizeForm`)
- GDD §5.3 列 7 種終態（`healthy/fatty/fighter/sage/uggo/divine/diva`），程式碼判定樹只有 4 種（`divine > fatty > ugly > healthy`）。
- `traits.battlePoints` **有累積但從未被讀取做分支判定**，「打沙包」變成空轉成就值。
- GDD §10.1 MVP 要求「至少 3 種終態」，所以**現狀不算違反 MVP**（healthy/fatty/ugly 達標）；但既然 `battlePoints` 已寫進 schema，就要嘛把判定加上去（推薦，幾行就完成），要嘛從互動表移除省 schema 維護成本。否則玩家累打 30 沙包卻沒回饋，會困惑。
- **修法**：在 `finalizeForm` 加一行
  ```js
  if (t.perfectStreakMinutes >= 1440 && state.pet.growthScore >= 2000) form = "divine";
  else if (t.battlePoints >= 30) form = "fighter";   // ← 補
  else if (t.fatPoints >= 10) form = "fatty";
  else if (t.lowMoodMinutes >= 720) form = "ugly";
  ```
  並在 `CFG.petArt.adult` / `formLabel` / `formDescription` 補對應條目（沒美術可暫時 fallback 到 `healthy.svg`）。

---

## 建議 (P1)

### P1-1 `migrate()` 沒有真的做 migration
**位置**：`src/game.js:135-139`
```js
function migrate(data) {
  if (!data.schemaVersion || data.schemaVersion < 1) return defaultState();
  return data;
}
```
- 只做版本檢查，**沒有合併 default schema 補新欄位**。如果未來在 `traits` 加 `intelligencePoints`，舊存檔讀進來會是 `undefined`，後續 `+=` 變 `NaN`。
- **建議**：寫一個「deep merge default」當保險絲：
  ```js
  function migrate(data) {
    if (!data.schemaVersion || data.schemaVersion < 1) return defaultState();
    const def = defaultState();
    return deepMerge(def, data); // existing fields win, missing ones fall back to default
  }
  ```

### P1-2 `petImg.src !== absolute(petSrc)` 的 `<a href>` trick 開銷不必要
**位置**：`src/game.js:427`, `src/game.js:441`, `491-495`
- 每次 render 建立 `<a>` 元素並讀 `.href` 純粹為了取絕對路徑比對，每秒呼叫多次浪費。
- **建議**：直接快取 `lastPetSrc` 在閉包：
  ```js
  let lastPetSrc = null;
  if (lastPetSrc !== petSrc) { petImg.src = petSrc; lastPetSrc = petSrc; }
  ```
  mood icon 同理。順便避開 reflow。

### P1-3 沒做數值警告的視覺強化（只有 icon blink）
**位置**：`src/style.css:103-104`, `src/game.js:395-397`
- 目前只有 `data-warn="true"` 時 icon + label blink。GDD §3.2 規定「<20 → 進度條閃紅」、§8.4「狀態警告：對應狀態條閃爍紅色」。
- 程式條的 fill color 用 `statColor()`，<20 時是 `--c-bad`（紅）已經對；但**沒有閃爍**，玩家容易忽略。
- **建議**：加 CSS
  ```css
  .stat[data-warn="true"] .bar-fill { animation: blink 0.8s infinite; }
  ```

### P1-4 互動表缺玩具蟲蟲、思考拼圖、唱歌、對話、神祕草藥
**位置**：`src/game.js:33-44`
- GDD §4.6 列 14 種互動，目前實作 9 種（feed_basic/corn/berry/worm/cake、play_ball/punch、bath、pet_head/belly）。
- 缺：`play_toy`(玩具蟲蟲)、`play_puzzle`、`play_sing`、`talk`、`feed_herb`(神祕草藥)。
- GDD §10.1 MVP 要求「玩耍至少 2 種」已達標，這項**屬 v0.2 範圍**，不擋上線。但 schema 已預留 `intelligencePoints` 字段不存在 → 連 `sage` 終態 P0-4 也吃不到。

### P1-5 互動 cooldown 規格不一致
**位置**：`src/game.js:33-44`
- 對照 GDD §11.1：
  - `feed_corn` cooldown 60 ✓
  - `feed_worm` cooldown 90 ✓
  - `feed_berry` cooldown 60 ✓
  - `feed_cake` cooldown 300 ✓
  - `play_ball` cooldown 120 ✓
  - `play_punch` cooldown 300 ✓
  - `bath` cooldown 600 ✓
  - `pet_head` cooldown 30 ✓
  - `pet_belly` cooldown 60 ✓

  全部命中。✅（這條改成「**已驗證一致，無問題**」紀錄）

### P1-6 終態判定優先序的「胖雞優先於醜雞」可能反直覺
**位置**：`src/game.js:239-241`
- 目前順序 `divine > fatty > ugly > healthy`。若玩家既過餵又長期低落（fatPoints≥10 且 lowMoodMinutes≥720），會直接被判 fatty。
- GDD §5.3 沒有明寫優先序；考量「醜雞 = 反向結局，玩家不會主動養」，現行順序合理（讓「過餵」這種更明顯的玩家行為先勝出）。
- **建議**：在 `formDescription` 旁印一行 debug log 顯示判定路徑，或在設定頁顯示 traits 進度，讓玩家有掌控感（GDD §12.1 緩解策略）。已部分實作於設定頁 (`src/game.js:558-561`)，但**沒顯示 fatPoints / battlePoints**。建議補上：
  ```html
  <div class="settings-row"><span>肥胖點數</span><strong>${state.pet.traits.fatPoints}/10</strong></div>
  <div class="settings-row"><span>戰鬥點數</span><strong>${state.pet.traits.battlePoints}/30</strong></div>
  <div class="settings-row"><span>低落分鐘</span><strong>${Math.round(state.pet.traits.lowMoodMinutes)}/720</strong></div>
  ```

### P1-7 每日任務未實作（footer 寫死「階段 + 成長」）
**位置**：`src/game.js:460`, `index.html:95`
- footer `task-text` 被 render 改寫成 `階段：xxx · 成長 yyy`，**完全沒任務**。GDD §10.1 MVP 沒要求每日任務（在 v0.2 列表），故不擋。但既然 UI 已有位置，**建議至少塞一個「今日餵食次數」**作為 quick win。

### P1-8 沒有播聲音 / reduced motion 設定
**位置**：`src/game.js`、`src/style.css`
- GDD §10.1 設定頁要求「音效開關、語言、reduced motion」。目前**完全沒實作**。schema 也沒 `settings`。
- 不擋 MVP（無聲遊戲也能玩），但 reduced motion 對偏好減少動畫的使用者很重要，且 1 行 CSS 就能加：
  ```css
  @media (prefers-reduced-motion: reduce) {
    .pet, .pet-shadow, .stage.sleeping::after { animation: none; }
  }
  ```

### P1-9 強制 `maximum-scale=1.0` 違反可達性指引
**位置**：`index.html:5`
- iOS Safari 仍會尊重，導致**視障使用者無法用雙指放大**。WCAG 1.4.4 不合規。
- **建議**：移除 `maximum-scale=1.0`，留 `width=device-width, initial-scale=1.0`。

### P1-10 第一次玩的引導不足
**位置**：`src/game.js:730-733`
- 只有一個 toast「歡迎來到啾啾日常！輕觸蛋來愛撫」。蛋階段唯一可做的就是 `pet_head`（摸頭）和等 6 小時 + 30 分。玩家容易誤以為遊戲卡住。
- **建議**：第一次啟動跳一個 modal 講三件事：「點擊蛋會增加心情」、「蛋會在 6 小時後孵化」、「分頁關掉也會繼續長大，但慢一半」。

### P1-11 Action 按鈕在睡覺時不會 disable，只在點擊時 toast「在睡覺」
**位置**：`src/game.js:269-271`, `463-479`
- 玩家在睡眠中點按鈕才被 toast 拒絕，比較不順。
- **建議**：`setActionState` 中加 `if (state.pet.isSleeping) { /* disable feed/play/bath/pet */ }`。睡眠按鈕保留可用以便起床。

### P1-12 過餵判定的 `> 95` 是「執行前」狀態，可能漏觸發
**位置**：`src/game.js:282-287`
- 玩家飢餓 90，餵基礎飼料 (+25) → 結果 100。但條件 `state.pet.stats.hunger > 95` 在套用前判，會放過這次。
- GDD §11.1 寫「飢餓>95 時繼續餵食」，意思應該是**已經 >95 還繼續餵**，這個實作其實對。但若想更貼近「過量導致肥」的意圖，可改成「餵後 >100 即觸發」。**目前算正確，先不動**，列為觀察。

---

## 觀察 (P2)

### P2-1 `interactionCount` 是 module 級變數，不寫進 state
**位置**：`src/game.js:112`
- 重整頁面就歸零。設定頁顯示「累積互動」會誤導。建議移到 `state.history.totalInteractions`。

### P2-2 `cryptoRandomId` 在 unsupported browser 會炸
**位置**：`src/game.js:140-144`
- `crypto || window.crypto` 在非常老的瀏覽器會 ReferenceError。MVP 受眾用 modern browser 不會中，但 try/catch 加 fallback 保險：`Math.random().toString(36).slice(2)`。

### P2-3 整份程式有 8 個 emoji，但 GDD 風格指南是「扁平 + 微擬物」並沒禁 emoji
- 不是問題，繼續。但如果未來打算上 PWA，emoji 在不同平台 render 不一致是視覺風險。可考慮把所有 emoji 統一改成 SVG icon。

### P2-4 沒有事件日誌 (`nourish.events.v1`)
- GDD §9.1 副鍵之一，MVP 沒列必做，留 v0.2。

### P2-5 沒有圖鑑 (`nourish.dex.v1`)
- 圖鑑 UI 已開（`btn-dex`），但只顯示當前終態，沒記錄「過往養過的小雞」。GDD §10.2 列 v0.2，OK。

### P2-6 沒有開新蛋功能
- 達成終態後玩家無法重啟。對「鼓勵再玩一輪」目標 (GDD §1.3 §10.5) 是缺口，但 v0.2 議題。

### P2-7 `tickOnline` 與 `reconcileOffline` 共用 `applyDelta` 但跨數值連動只在線上算
**位置**：`src/game.js:184-186`
- 線上 tick 算「飢餓<20 → 心情 -0.20/min」「清潔<40 → 心情 -0.10/min」（GDD §3.3）。
- 離線 reconcile 沒算這兩條跨數值連動。GDD §7 沒明寫「離線時跨數值連動是否生效」，目前實作偏寬鬆（對玩家友好），與「離線封頂保護」精神一致，OK。

---

## 與 GDD 對照

### MVP 必做清單（GDD §10.1）

| 項目 | 規格 | 程式狀態 | 備註 |
|---|---|---|---|
| 4 大狀態值 + 衰減（線上 + 離線）| §11 | ✅ | 速率與表完全一致 |
| localStorage 存檔 + schema 版本 | §9 | 🟡 | 有版本欄位但 migrate 是空殼（P1-1）|
| 進化階段（蛋→雛→幼→成）+ ≥3 種終態 | §5 | ✅ | 3 種終態（healthy/fatty/ugly），但 schema 已埋 4 種、battle 點數沒讀（P0-4）|
| 成長分數累積 | §5.2 | ✅ | 公式對齊 |
| 飼料幣經濟（產出 + 消耗）| §6 | ✅ | 每日登入 30、進化獎勵 100、玩耍 3-6 隨機 |
| 每日登入 + 連續登入 | §6 | ✅ | streak7 +50、streak30 +200，跨日比對日期字串 OK |
| 離線回歸問候 | §7.4 | 🟡 | 5 級分檔 OK，但 8-12h 沒扣心情 -5、>12h 沒大哭動畫（P0-3）|
| 餵食：基礎 + 至少 2 付費 | §4.1 | ✅ | basic + corn + berry + worm + cake，5 種全做 |
| 玩耍：至少 2 種 | §4.2 | ✅ | ball + punch（缺 toy/puzzle/sing 屬 v0.2）|
| 洗澡 | §4.3 | ✅ | |
| 睡眠（手動）| §4.4 | ✅ | toggleSleep |
| 愛撫（摸頭、摸肚子）| §4.5 | ✅ | 缺對話 / 取名（v0.2）|
| 主畫面（狀態 + 舞台 + 操作）| §8.1 | ✅ | |
| 互動子選單 | §8.3 | ✅ | modal + menuItem |
| 進化動畫（簡版）| §10.1 | 🟡 | 有 `evolve-flash` keyframe，但只閃 5 次 0.6s 後就結束，沒「揭曉動畫」更明顯一點的 polish |
| 通知 toast 系統 | §8.4 | ✅ | toast container + good/bad/gold 三色 |
| 設定頁 | §10.1 | ❌ | 只有 debug 欄，**音效 / 語言 / reduced motion 全沒**（P1-8）|
| 4 階段 sprite × ≥3 終態 | §10.1 | ✅ | egg, egg2, chick, junior, adult×4=8 張（依 CFG.petArt）|
| 互動動畫各 1 套 | §10.1 | 🟡 | 有 bob / pop / evolve-flash，但「吃 / 玩 / 洗」沒專屬 micro-anim |
| 背景 + UI 元件 | §10.1 | ✅ | bg-grass + bg-coop |

**MVP 完成度：18/19 ≈ 95%**（缺正式設定頁；其他都打到「可上線」基準線）

---

## Quick Wins / Next Steps

### 接下來 1 小時內的 Quick Wins（10 分鐘 × 多次）

1. **(15min) 修 P0-1 + P0-2 時鐘 / 背景節流**：在 `tickOnline` 加 `if (deltaMs <= 0 || deltaMs > 5*60*1000) { return; }`，把 `lastTick` 提到 module 級，`visibilitychange` hidden 時 `clearInterval(tickTimer)` + `state.lastTickAt = Date.now()`，visible 時重啟。**最重要的穩定性修正**。
2. **(10min) 修 P0-3 8-12h 心情 -5**：在 `showWelcomeBack` 用 `idx === 3` 條件做 `mood -= 5`。
3. **(5min) 修 P0-4 加 fighter 分支**：`finalizeForm` 加一行 `else if (t.battlePoints >= 30) form = "fighter";`，在 `petArt.adult` 暫指 `chick-adult-healthy.svg` fallback；補 `formLabel` / `formDescription`。即使沒新美術也要先讓打沙包有意義。
4. **(5min) 設定頁顯示 traits 進度**：補 fatPoints / battlePoints / lowMoodMinutes 三條 row，給玩家進化掌控感（P1-6）。
5. **(5min) 進度條閃紅**：style.css 加 `.stat[data-warn="true"] .bar-fill { animation: blink 0.8s infinite; }`（P1-3）。
6. **(2min) 移除 maximum-scale=1.0**：可達性 + WCAG 合規（P1-9）。
7. **(8min) 睡覺時 disable 互動按鈕**：`setActionState` 加睡眠 guard（P1-11），免得玩家狂點被 toast 罵。
8. **(10min) 第一次玩 onboarding modal**：3 步引導（P1-10）。

### v0.2 最有價值的 3 個功能

1. **隨機事件系統（GDD §10.2）**：撿到飼料幣、果蠅、神祕草藥。**這是讓 30 秒 micro loop 不無聊的關鍵**（GDD §12.1 列為高風險），ROI 最高。實作成 `events: [{ trigger, weight, action }]` 表驅動，與目前 `interactions` 同模式，1 天可完成。
2. **每日任務（GDD §10.2）**：footer 已預留位置，schema 已預留 `daily.tasks`。每日 3 個小目標 + 完成 +20 FC，**直接拉每日留存**。0.5 天可完成。
3. **取名 + 對話（GDD §10.2）**：取名一次性 +10 心情、形成情感投射；對話用 emoji 氣泡 +2 心情、20s CD。**情感目標達成最直接的元件**（GDD §1.3 「不孤單」）。0.5 天。

加碼候補：完整進化分支至 7 種（fighter/sage/diva），需新美術；圖鑑紀錄已養過的小雞。

---

> **結論：MVP 主幹紮實，遊戲性與 GDD 對齊度極高。修完 4 個 P0 後可上線。P1 清單按 Quick Wins 順序大概 1.5 小時可全處理完。**
