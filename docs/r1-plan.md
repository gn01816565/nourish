# R-1 Plan — 拆 game.js IIFE 為多 script

> 寫於 2026-04-29（iter#117）。把 review-v2 R-1（拆 IIFE）從「60-90 min 大重構」拆成 5-7 輪 cron 可逐步推進的子任務。
> 配對：[`retrospective-100.md`](retrospective-100.md) §4 High ROI #1 / [`review-v2.md`](review-v2.md) R-1 / [`iteration-log.md`](iteration-log.md) iter#114-115 buffer 警戒紀錄。
>
> **狀態**：planning only。本檔只是設計，沒實際拆。每個子輪實作前 review 本檔 + 該節 spec。

---

## 1. 為什麼 R-1（為什麼拆）

| 指標 | iter#34 | iter#117（現況） | warning 線 |
|------|---------|----------------|-----------|
| `src/game.js` 行數 | ~1100 | **1993** | 2000 |
| function 數量 | ~50 | **93** | — |
| init() body | ~80 | 25（iter#84 拆 5 wireUp*）| — |
| render() body | ~150 | ~210（iter#96/99/114 抽 3 pure fn）| — |
| 警戒 buffer | 900 | **7** | 0 |

**痛點**：
- 玩家裝 PWA 後 game.js 是單檔 60+ KB（iter#34 的 ~3× 大），首次 install 慢
- 任何加新 helper / 新 stage_hint 都要 wrestle 警戒
- IIFE 內 closures 數十個 — code review 時視野不夠
- iter#97 P0 TDZ bug 部分原因是 1990 行 IIFE 容易讓 const 順序失序
- v0.3 / v0.4 加新功能（multipet / AI 對話）必觸 2000

**不拆的代價**：每加 1 個 feature 都要先做減法（cfg 化、抽 pure fn 等），間接增加 2-3 倍開發時間。

---

## 2. 拆檔目標架構

當前單檔（iter#117）：
```
src/cfg.js → src/i18n.js → src/ui.js → src/dex.js → src/achievements.js → src/audio.js → src/share.js → src/game.js (1993 行)
```

R-1 後（目標）：
```
src/cfg.js → src/i18n.js → src/ui.js → src/dex.js → src/achievements.js → src/audio.js → src/share.js
   ↓
src/state.js          ← state schema / load / save / migrate / reconcileOffline / startNewEgg
   ↓
src/economy.js        ← grantCoin / spendCoin / handleDailyLogin / resetDailyTasks
   ↓
src/interactions.js   ← performInteraction / RANDOM_EVENT_APPLIES / runEventApply / cooldown
   ↓
src/render.js         ← render() + computePetSrc / computeMoodKey / computeStageHint / setActionState
   ↓
src/events.js         ← spawnEvent / resolveEvent / maybeSpawnEvent / isSeasonalActive
   ↓
src/wants.js          ← maybeSpawnWant / spawnWant / expireWantIfStale / fulfillWantIfMatches
   ↓
src/game.js (~250)    ← init / wireUp* / startTick / lifecycle (剩 init + 啟動序)
```

預估 game.js 從 1993 → ~250 行（保留入口 + lifecycle + 跨模組 orchestration）。

---

## 3. 模組職責 / 公開 API

### 3.1 `src/state.js`
- 負責：state schema / load / save / migrate / startNewEgg / reconcileOffline / cryptoRandomId / deepMerge
- 依賴：cfg / dex（archiveCurrentPet）
- 公開 API：`window.NourishState = { load, save, migrate, startNewEgg, reconcileOffline, getState, replaceState }`
- 行數估計：~280 行（從 game.js 抽出）

### 3.2 `src/economy.js`
- 負責：grantCoin / spendCoin / handleDailyLogin / resetDailyTasks / trackDailyTask
- 依賴：state / ui (toast / speak) / cfg.economy
- 公開 API：`window.NourishEconomy = { grantCoin, spendCoin, handleDailyLogin, trackDailyTask }`
- 行數估計：~120 行

### 3.3 `src/interactions.js`
- 負責：performInteraction / setCooldown / isOnCooldown / unlocked / applyDelta / RANDOM_EVENT_APPLIES / runEventApply
- 依賴：state / economy / ui / cfg.interactions / share / dex
- 公開 API：`window.NourishInteractions = { performInteraction, isOnCooldown, applyDelta, runEventApply }`
- 行數估計：~250 行

### 3.4 `src/render.js`
- 負責：render() / setActionState / computeStageHint / computePetSrc / computeMoodKey / preEvolveLevel / dirty-check caches
- 依賴：state / cfg / ui / dex / i18n
- 公開 API：`window.NourishRender = { render, resetCaches }`
- 行數估計：~360 行（render() 是大頭）

### 3.5 `src/events.js`
- 負責：maybeSpawnEvent / spawnEvent / resolveEvent / isSeasonalActive
- 依賴：state / cfg.randomEvents / cfg.seasonalEvents / interactions.runEventApply
- 公開 API：`window.NourishEvents = { maybeSpawnEvent, expireActive }`
- 行數估計：~110 行

### 3.6 `src/wants.js`
- 負責：maybeSpawnWant / spawnWant / expireWantIfStale / fulfillWantIfMatches
- 依賴：state / cfg.wants / economy / ui
- 公開 API：`window.NourishWants = { maybeSpawn, expireIfStale, fulfillIfMatches }`
- 行數估計：~80 行

### 3.7 `src/game.js`（剩餘）
- 負責：init / wireUp* helpers / startTick / startBackgroundTimers / lifecycle / DOMContentLoaded entry
- 依賴：所有上面模組
- 公開 API：暫無（IIFE 自啟動）
- 行數估計：~250 行

---

## 4. 分輪實作順序（5-7 cron rounds）

順序原則：**先抽出無 closure 依賴的，逐步減少 game.js IIFE 複雜度**。每輪 smoke test 驗證。

### 輪 1：state.js（state / save / load / migrate）— 最基礎
- 把 state schema / load / save / migrate / startNewEgg / cryptoRandomId / deepMerge 整段搬出
- game.js 透過 `window.NourishState` 訪問
- 新增 `state.js → game.js` 的 closure 注入：`NourishState.bind({ archiveCurrentPet: ..., toast: ... })` 給 startNewEgg 用
- **預估 game.js -280 行 → 1713 行 / 新增 state.js +290 行**
- smoke test 必跑全 8 scenarios

### 輪 2：economy.js
- grantCoin / spendCoin / handleDailyLogin / resetDailyTasks / trackDailyTask
- 依賴 state / ui — bind via NourishAPI
- **預估 game.js -120 行 → 1593 行**

### 輪 3：interactions.js（最複雜 — 最後抽）
- performInteraction / setCooldown / RANDOM_EVENT_APPLIES / runEventApply
- 依賴最廣（state / economy / ui / cfg）
- **預估 game.js -250 行 → 1343 行**

### 輪 4：render.js
- render() + 3 個 compute 純函式 + setActionState + dirty-check caches
- **預估 game.js -360 行 → 983 行**
- 注意：render 對 lastPetSrc 等 module-level cache 的依賴 → 所有 cache 變數搬到 render.js 內部
- ⚠️ smoke test 8 scenarios 都會測 render，本輪最易抓 regression

### 輪 5：events.js + wants.js（兩者一輪可拆）
- 兩個都依賴 state + cfg + interactions.runEventApply
- **預估 game.js -190 行 → 793 行**

### 輪 6：清理 + smoke test 擴充
- game.js 剩約 250 行（init / wireUp* / lifecycle / DOMContentLoaded）
- 整理 module 載入順序在 index.html
- 更新 sw.js APP_SHELL 加新 7 個 .js
- 更新 check-sw-shell.js（自動覆蓋）
- 更新 check-render-smoke.js（loop 7 個 src 而非 1）
- 更新 deploy.md / CLAUDE.md / README.md docs

### 輪 7（可選）：performance + 最終 polish
- bundle size measurement before / after
- iOS Safari serial-load 測試
- 行動裝置首次載入 < 2s 驗證

---

## 5. 風險 / Rollback

### 主要風險
- **closure 注入順序錯**：i18n.js 已有 `lazy access pattern`（iter#107），新模組沿用
- **state 跨模組同步**：state 是唯一 source of truth；確保所有模組讀 `window.NourishState.getState()`，寫只透過 NourishState API
- **dirty-check cache 跨模組失效**：render.js 內部 cache + `resetCaches()` API（iter#95 模式）
- **Service Worker cache 失效**：每輪 bump CACHE_VERSION，玩家自動拿新 chunked module

### Rollback 策略
- 每輪 1 module 抽出，`git stash` / 改前 backup
- smoke test fail 立即 rollback 該輪
- iter#97 教訓：runtime bug 不是 syntax，必跑 smoke
- 如果某輪結束 game.js 仍包 dependencies that 抽出後 closure 找不到 → rollback
- **絕不一次抽 2+ module**

---

## 6. 抽出後的好處

- **首次 PWA install 速度**：8 個小檔比 1 個 60KB 大檔下載快 30-40%
- **HTTP/2 多工**：parallel 下載
- **未來 v0.3 / v0.4**：加新 module（如 multipet.js）不擠 game.js
- **code review**：每 module < 400 行，diff 視野完整
- **單元測試**：v1.0 加 unit test framework 時，pure modules 易測試

---

## 7. 何時不該做

- 如果使用者要求 v0.2 / v0.3 launch 在 30 天內：**先 launch 再拆**（R-1 純內部，玩家無感；先用 cfg-driven 抗壓）
- 如果 game.js 行數穩定 < 1900：buffer 100 仍夠用，可延
- 如果有 P0 / P1 bug：先修 bug，R-1 是中期工程

當前狀態（iter#117）：buffer 7，已逼近警戒。**3-5 輪內若無觸線可繼續延，超過則本檔啟動**。

---

## 8. 預期成果

R-1 7 輪 cron 推進完成後：
- `src/game.js` 1993 → ~250 行
- 新增 6 個 `src/*.js` module（state / economy / interactions / render / events / wants）
- 7 個 lint chain 全綠
- 8 個 smoke scenarios 全 PASS
- 玩家 0 感知（純內部重構）
- v0.3 / v0.4 開發單位成本 -50%（加新 module 不必先做 ROI 減法）
