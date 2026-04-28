# 啾啾日常 — 自動優化循環日誌

> 每 10 分鐘觸發一次（cron `3-59/10 * * * *`，job `0a1c2148`），由主 agent 推進。新項目追加在最上方。

---

## 2026-04-28 14:13 · Session A — INTENT: 開新蛋功能 + 圖鑑歷代寵物紀錄 (nourish.dex.v1)

(進行中)

---

## 2026-04-28 14:05 · Session A — 取名功能 + 7 種終態擴充 + 5 種玩耍互動

**觸發**：Auto-mode 持續推進
**動作**：
- 新增 `state.pet.nameSet` 旗標 + 點擊 stage-name 開啟 `openNameDialog()`：input modal、首次取名 +10 心情、12 字上限、escapeHtml 防 XSS。
- traits schema 補 `intelligencePoints`、`singCount`，舊存檔靠 deepMerge 自動補 0。
- 互動表新增 3 種：`play_toy`（玩具蟲蟲）、`play_puzzle`（思考拼圖，+intelligencePoints 2）、`play_sing`（唱歌比賽，+singCount 1）。`openPlayMenu` 列 5 項。
- `finalizeForm` 補 `sage`（30 智慧）+ `diva`（20 唱歌）分支，優先序 `divine > diva > sage > fighter > fatty > ugly > healthy`（罕見/正向先勝出）。
- `formLabel` / `formDescription` 補新終態。
- 設定頁顯示 intelligencePoints / singCount 進度。
- 圖鑑改成 7 格表格，已解鎖才顯示描述、未解鎖顯示 🔒，含「已收集 X/7」總覽。
- Modal 系統重構：buttons 支援 `{label, close, action}`，可在不關閉的情況下觸發動作（給名字 dialog 用）。
- 新增 `assets/svg/chick-adult-sage.svg`（戴眼鏡 + 公式書 + 書本）。
- 新增 `assets/svg/chick-adult-diva.svg`（彩虹尾羽 + 麥克風 + 音符）。

**影響檔案**：
- `src/game.js`、`assets/svg/chick-adult-sage.svg`、`assets/svg/chick-adult-diva.svg`

**驗證**：`node --check` ✅ + curl 200（兩個新 SVG）

**下輪候選**：v0.2 設定頁（音效 / 語言切換）、隨機事件 SVG 化、進化動畫加儀式感、開新蛋功能、圖鑑紀錄歷代寵物（schema `nourish.dex.v1`）

---

## 2026-04-28 14:00 · Session A — INTENT: 取名功能 + sage/diva 分支 + play_toy/play_sing/play_puzzle 互動 + 對應 SVG

(已完成，見上)

---

## 2026-04-28 13:53 · Session 2 — 隨機事件系統（v0.2 最高 ROI）+ talk 互動

**觸發**：cron 自動 fire（首次 10 分鐘觸發點）
**動作**：
- 新增 `CFG.randomEvents` 池（5 種）：
  - 💰 撿到飼料幣（55%，+5–15 FC）
  - 🌿 神祕草藥（18%，全屬性大幅補）
  - 🦋 蝴蝶飛過（14%，心情 +10）
  - 🪰 趕走果蠅（10%，清潔 +5、心情 +3）
  - ⭐ 神秘流星（3%，+10 全屬性 + 50 FC）
- `maybeSpawnEvent` 每 60 秒 check，30% 機率 spawn；蛋階段 / 睡眠 / modal 開時 skip。
- `.event-bubble` 圓形按鈕浮在舞台上 90 秒後自動 expire，玩家點擊觸發 `def.apply(state)` + 成長分數 +3。
- 新增 `talk` 互動（心情 +2、CD 20s、無消耗），加入愛撫選單（標題改為「💝 互動」），對應 GDD §4.5 對話列。
- CSS 加 `event-pop / event-bob / event-leave` 三段動畫。

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**下輪候選**：取名 + dialogue / 智慧雞與歌姬雞分支 / `play_toy` 與 `play_sing` / GDD §10.2 補充章節 / 給 herb 與 fly 寫獨立 SVG（取代 emoji）

---

## 2026-04-28 13:45 · Session 1.3 — 實作每日任務（P1-7）

**觸發**：循環首輪（不等 cron）
**動作**：
- 新增 `state.daily.tasks` schema：feed_count 5、play_count 3、pet_count 4 三項。
- `trackDailyTask` hook 進每次 `performInteraction`，依 prefix 自動 +1。
- 完成單項自動 +20 FC（`完成每日任務` toast）。
- `handleDailyLogin` 跨日時呼叫 `resetDailyTasks()` 重置（依 `lastLoginDay` 字串比對）。
- footer 改顯示三項進度，全完成時切「🎉 今日任務全完成！」。
- `defaultState` 補 `history: { totalSessions: 0 }`，靠 `deepMerge` 對舊存檔安全。

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

---

## 2026-04-28 13:40 · Session 1.2 — 初版 P0/P1 修補

**觸發**：手動（review 完成後立即修）
**動作**：
- 修 P0-1 時鐘倒退保護：`tickOnline` 加 `Number.isFinite` 與 `dt ≤ 5min` 上限。
- 修 P0-2 背景節流：`lastTick` 提到 module 級；`visibilitychange` hidden 時 clearInterval + 強制 `lastTickAt = now`；resume 時 reconcileOffline + 重啟 tick。
- 修 P0-3 離線回歸 8–12h 心情 -5 + >12h 觸發哭泣 speak。
- 修 P0-4 加 `fighter` 終態分支（30 戰鬥點數），`battlePoints` 不再空轉。
- 補 P1-1 `migrate` 改用 deepMerge 補新欄位，避免舊存檔讀到 undefined。
- 補 P1-2 cache `lastPetSrc / lastMoodSrc / lastBgKey`，移除 `<a href>` 絕對路徑 trick。
- 補 P1-3 進度條 `bar-warn` 紅光脈衝動畫。
- 補 P1-6 設定頁顯示 fatPoints / battlePoints / lowMoodMinutes / perfectStreakMinutes 進化進度。
- 補 P1-9 移除 `maximum-scale=1.0`（WCAG 1.4.4）。
- 補 P1-10 第一次玩 onboarding modal（4 條規則）。
- 補 P1-11 睡眠時 disable 餵食 / 玩耍 / 洗澡 / 愛撫按鈕。
- 補 reduced-motion media query。
- 新增 `assets/svg/chick-adult-fighter.svg`（戰鬥雞 SVG）。

**影響檔案**：
- `src/game.js`、`src/style.css`、`index.html`
- `assets/svg/chick-adult-fighter.svg`（新檔）

**驗證**：`node --check src/game.js` ✅

---

## 2026-04-28 13:00 · Session 1.1 — 初版 MVP 完成

**動作**：
- 市場調查（10 款代表作 + 共通要素 + 反模式 + 技術觀察）→ `docs/market-research.md`
- GDD 完整版（12 章 + 附錄）→ `docs/gdd.md`（798 行）
- SVG 占位美術（18 張）→ `assets/svg/`
- AI 生圖 prompt（中英對照 18 條 + 全域風格）→ `docs/image-prompts.md`
- MVP 實作（HTML+CSS+JS，無 build step）→ `index.html` + `src/style.css` + `src/game.js`
- Code review（4 P0 + 12 P1 + 7 P2）→ `docs/review.md`
- 本機 HTTP server 啟動於 port 8765

**MVP 完成度**：18/19 ≈ 95%（GDD §10.1 必做清單）
**與 GDD 數值對齊度**：~95%（cooldown / 衰減速率 / 互動效果完全一致）

---
