# iter#135-149 Retrospective — R-1 拆檔大躍進 + 防呆 lint 第一次落地

> 寫於 2026-04-30（iter#150）。配對 [`retrospective-130.md`](retrospective-130.md)（iter#100-134 共 35 輪）。
> 涵蓋 iter#135 retrospective 寫作後 15 輪 cron 推進。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **R-1 拆 IIFE 從 micro-step 進入大塊抽出**：6 輪抽 6 個子系統（wants / events / daily / idle / evolve + 前置 animations / notifications），game.js **-471 行**（1981 → 1510，buffer 19 → 490）
- **2 個 P0 bug 抓修**（finalizeForm / openSettingsMenu 的 `const t = state.pet.traits` 遮蔽 i18n）— iter#106 同類 bug 的第二次發作
- **防呆 lint 第一次落地**：`scripts/check-i18n-shadow.js` 永久守住 t() 遮蔽，deploy gate 從 5 step → 6 step；syntax step 從寫死 7 檔 → 動態掃 src/\*.js（順手修了 8 個檔案沒被獨立 `--check` 的舊技術債）
- **i18n 第 13-15 批 + 補洞**：cfg.achievements 30 條 labelKey + 30 條 descKey，加 cfgDesc helper；events/daily/evolve 抽出時帶過去的 12 個硬編碼中文補完 t() 化；種子翻譯 168 → **212 條** / locale
- **review-v2 status sweep**：R-5（圖鑑）標 ✅ DONE 大宗，P2-1 標監控中
- **NourishAPI surface 從 9 → 14 export**（toast / speak / save / render / grantCoin / unlockAchievement / checkAchievements / startNewEgg + 既有 stageLabel / formLabel / formDescription / unlockedFormsSet / getState / getLastPetSrc）

---

## 2. iter#135-149 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#135** | retrospective-130.md milestone | 6 章 35 輪總結 |
| **iter#136-137** | i18n 第 13-14 批：cfg.achievements label + desc | 30 + 30 條雙欄位，utils.js 加 cfgDesc helper |
| **iter#138** | review-v2 status sweep | R-5 ✅ 大宗、P2-1 監控中 |
| **iter#139** | R-4 partial：animations.js 抽 6 helpers | game.js -86 行（buffer 131） |
| **iter#140** | iter#140 milestone：notifications.js 抽 4 helpers | game.js -36 行（buffer 167） |
| **iter#141** | i18n cleanup：unlockAchievement cfgDesc + namehint | coverage 16% → 17% |
| **iter#142** | R-1 round wants：抽 wants 子系統 | game.js -48（1833 → 1785，buffer 215） |
| **iter#143** | R-1 round events：抽 random + seasonal events | **game.js -101**（1785 → 1684，buffer 316，本 arc 最大單輪降幅） |
| **iter#144** | R-1 round daily：抽 login + tasks + history | game.js -52（1684 → 1632，buffer 368） |
| **iter#145** | R-1 round idle：抽 idle ambient speech | game.js -64（1632 → 1568，buffer 432） |
| **iter#146** | **P0 修**：finalizeForm + openSettingsMenu t-shadow | 玩家進 adult / 開設定 modal 不再 throw |
| **iter#147** | 防呆 lint：scripts/check-i18n-shadow.js + run-checks.sh 升級 | deploy gate 從 5→6 step，syntax 從 7→15 file |
| **iter#148** | R-1 round evolve：抽 maybeEvolve + finalizeForm + confirmNewEgg | game.js -58（1568 → 1510，buffer 490） |
| **iter#149** | i18n 補洞：events/daily/evolve hardcoded 中文 | +14 keys × 2 locales，212 條種子翻譯 |

---

## 3. 關鍵學習（iter#135-149）

### 3.1 R-1 拆檔節奏：micro-step → 子系統大塊

**前 arc（iter#100-134）**：micro-step 模式 — utils.js 一次抽 1-3 個 pure function，game.js 1993 → 1955（-38 / 5 輪）。
**本 arc（iter#135-149）**：子系統大塊 — 一輪一個完整 namespace（wants / events / daily / idle / evolve），平均每輪 -65 行。

**為什麼 micro-step 先做才能進大塊**：
- 前 arc utils / animations / notifications 把純工具先搬走（無狀態），讓子系統抽出時 `applyDelta` / `pulseEvolve` / `maybeAlertCriticalStat` 已經是 `window.NourishUtils.*` / `window.NourishAnim.*` 引用，不用拉一堆 closure 進新模組
- 子系統大塊需要 NourishAPI bridge 暴露 `state` 存取 + 副作用呼叫；前期 bridge 只有 4 個 export，本 arc 擴到 14 個

**節奏建議**（給後續 R-1 wave）：
- 大塊抽出每輪 1 個，不要塞兩個（iter#143 events 抽 -101 已經是上限，含改動 `runEventApply` + `RANDOM_EVENT_APPLIES` + DOM stage 引用）
- bridge 擴展（NourishAPI 加新 export）跟內容抽出要在同一輪 — iter#142 / iter#148 都是先擴 API 再抽
- 拆完馬上 `./scripts/run-checks.sh`，smoke test 不掃 modal callsite（見 §3.3）所以行為驗證靠人工讀 + smoke 補強

### 3.2 P0 bug 第二次發作的真相

**iter#106 修了 render() 內 `const t = state.daily.tasks` 遮蔽 i18n t() 包裝器**。當時應該掃整個 game.js 找同類 pattern，但只修了單點。iter#146 又抓到兩個：
- `finalizeForm`：`const t = state.pet.traits`，玩家進 adult 終態 modal `t("modal.evolve.title", ...)` 直接 TypeError
- `openSettingsMenu`：同上，玩家點 ⚙️ 完全打不開設定頁

**為什麼 smoke test 沒抓到**：smoke 跑 init + render() 8 scenarios，**不觸發 modal callback**。modal 內的 i18n 呼叫只有真實互動才會走到，CI 永遠看不到。

**永久修復策略**（iter#147 落地）：
- `scripts/check-i18n-shadow.js`：靜態掃 `(const|let|var) t = X`，RHS 不是函式 / NourishI18n.t 引用 → exit 1
- 加進 `run-checks.sh` 第 5 step
- 邊際成本：~55 行 node + 1 行 shell；永久守備所有未來 contributor

**反思**：iter#106 修了 bug 但沒升級 lint，等於只修了該次 site，沒擋住 class。這次（iter#147）做對了 — bug 修完同 arc 內升級防護。

### 3.3 smoke test 的盲區 + 補強路徑

**現有 8 scenarios**（iter#101 升級）：init + render across stages × forms。**抓到的 bug 類型**：
- TDZ（iter#97）— const 順序錯誤
- DOM stub 缺失（iter#101）— style.setProperty 不存在
- 直接執行錯誤（render 內遮蔽變數）

**smoke test 抓不到的**：
- modal callback 內的 callbacks（i18n 遮蔽 = 兩次 P0）
- 互動序列（吃飯 → 換階段 → 進化）
- localStorage migration（schemaVersion bump）
- 跨 tab cross-tab read-only

**補強建議**（未做，留給後續）：
- 加 9th scenario：openSettingsMenu / finalizeForm / showWelcomeBack 三個 modal-heavy callsite 的最小 invocation（會抓 i18n shadow 但成本高）
- 或：改靠 lint 補 — i18n-shadow lint 已蓋 t() 一族，未來若再遇同類遮蔽 class 就再加 lint

### 3.4 i18n 抽出與覆蓋的 trade-off

R-1 抽出時 hardcoded 中文跟著搬到新模組，i18n 覆蓋率原地踏步。iter#149 補完才把 events/daily/evolve 的 12 個 grantCoin reason / button label / modal body 全 t() 化。

**教訓**：抽出 module 時順手檢查 hardcoded 字串清單，跟程式碼一起搬到 i18n.js。否則：
- coverage stat 顯示沒退步（因為 locale-coverage 看比例）
- 但實際 functional i18n 退步了 — 切英文時新模組的 toast 仍是中文
- 補洞變成獨立 round（iter#149），耗一個 cron 輪

**後續模組抽出 SOP**：
1. 先 grep 中文字串清單到 ad-hoc 檔
2. 抽出時對清單，每條都過 t() 包一層或新增 i18n key
3. lint 不擋這個 — 靠人工 review

### 3.5 NourishAPI surface 膨脹

從 iter#100 的 4 export 漲到本 arc 結束的 **14 export**。每個 R-1 抽出新增 1-2 個 bridge：
- iter#142 wants：speak / save / render / grantCoin（+4）
- iter#143 events：unlockAchievement（+1）
- iter#144 daily：checkAchievements（+1）
- iter#148 evolve：startNewEgg（+1）

**疑慮**：bridge 變大，等於 game.js 的 closure 越被「掏空」。若 state.js 抽出（剩下大塊 ~280 行），closure 內幾乎只剩 timer 變數 + bootstrap。

**反過來想**：這正是 R-1 plan 的方向 — 把 game.js 從「單一 1990 行 IIFE」拆成「多個 IIFE 子模組 + 薄薄 game.js orchestrator」。bridge 表面積增加是必經 transit，最終 game.js 應該變成 ~600-800 行的純啟動 / DOM 綁定 layer。

---

## 4. 後續方向（iter#150+）

### 4.1 R-1 剩餘大塊（粗估）

| 模組候選 | LOC | 抽出複雜度 | 為什麼 / 為什麼不 |
|---------|-----|-----------|------------------|
| state init/migration/tick | ~280 | 高 | 最大塊，但 state 是 closure 變數 — 需設計 setState API 或 state.js 持有 ground truth |
| save / load | ~70 | 低 | 可獨立抽到 src/save.js（reads NourishAPI.getState、純 localStorage CRUD），見 iter#149 評估 |
| accessory shop | ~270 | 中 | 內部複雜（DOM 渲染 + 購買流程），但 ROI 高 |
| interactions / menus render | ~150 | 中-高 | 跟 render() / openInteractionMenu 緊耦合 |
| welcome-back | ~22 | 低 | 太小，不值得新模組 wire-up |
| onboarding | 已 ui.js | — | iter#138 前已搬完 |

**建議排序**：accessory shop（高 ROI 中複雜）→ save/load（低風險小單元）→ state（最大塊，留最後）

### 4.2 i18n 殘留（粗估）

- `src/evolve.js` finalizeForm body：3 行 HTML 含 `${days}` `${name}` 插值
- `src/game.js` showWelcomeBack body：含 `${friendly}` 插值（分鐘 / 小時 / 天 friendly time）
- `src/game.js` 散點 grantCoin reason：「孵化禮」「補償」等
- cfg.speech 大宗：~230 條 — 留給 v0.3 海外發行前再做

### 4.3 v0.2 仍未做

GDD §10.2 已標：取名對話、新進化分支（在現有 7 種終態外加新 form）。本 arc 沒碰，留待 R-1 收尾後重啟 feature track。

### 4.4 工程紀律觀察

本 arc 出現第一次「P0 連發 → lint 升級」反饋迴路：
1. iter#146 抓 bug
2. iter#147 升級 lint
3. iter#148+ 後續抽出時 lint 已守備（evolve.js 用 `tr` 命名，零 t-shadow 風險）

這個模式可複製：每次抓 bug 之後，問「這個 class 的 bug 能不能加 lint 永久擋」。多數時候答案是 yes，新增成本 30-60 行 node script。

---

## 5. 數字總結

| 指標 | iter#135 開始 | iter#150 結束 | 變化 |
|------|--------------|--------------|------|
| `src/game.js` LOC | 1981 | 1510 | **-471** |
| 2000 警戒線 buffer | 19 | 490 | +471 |
| `src/*.js` 模組數 | 11 | 16 | +5（animations / notifications / wants / events / daily / idle / evolve；i18n 第 12 批前已存在） |
| NourishAPI export | 9 | 14 | +5 |
| Deploy gate step | 5 | 6 | +1（i18n-shadow） |
| Syntax `--check` 涵蓋檔 | 7 | 15 | +8（自動掃 src/\*.js） |
| i18n 種子翻譯 | 168 | 212 | +44 / locale |
| i18n functional sites | 124 | 142 | +18 |
| review-v2 完成度 | 83% | 94% | +11pp |
| P0 bug 抓修 | — | 2 | finalizeForm + openSettingsMenu t-shadow |

---

> 下一份 retrospective 預計在 iter#175 / iter#185 — 等 R-1 收尾或大型 v0.2 feature 落地。
