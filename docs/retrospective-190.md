# iter#170-189 Retrospective — v0.3 第一輪 ship + cfg-level i18n 大批次起手

> 寫於 2026-04-30（iter#190）。配對 [`retrospective-170.md`](retrospective-170.md)（iter#150-169，20 輪 R-1 達標 arc）+ [`retrospective-150.md`](retrospective-150.md)（iter#135-149，15 輪 R-1 大塊 arc）+ [`retrospective-130.md`](retrospective-130.md)（iter#100-134，35 輪）。
> 涵蓋 iter#170 milestone 後 20 輪累積。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **8 美學軸 event 層 100% 覆蓋**：iter#171 fairycore（dewdrop）+ iter#172 y2k（pixel_heart）2 條補完 — 既有 6 軸 + 新 2 軸 = **8 軸全有 ≥ 1 event**
- **v0.3 第一個 ship — 9th finalForm explorer**：iter#183 主結構 + iter#184 收尾，**終態 8 → 9** + 新 trait `eventsCaught`（cfg.traitsDisplay 7 → 8 / KNOWN_TRAITS lint 升級 / save migration deepMerge）+ explorer 成就 + speech 5 條 + collect_all 8→9 + image-prompts §8.6 全 ship-ready
- **季節事件 +4 條 / pool 8 → 12**：iter#174 母親節 carnation / iter#175 Pride 彩虹心 / iter#181 CNY 紅包 / iter#185 兒童節風車 — **12 個月節日全覆蓋**（4 月空缺終於補上）
- **cfg-level i18n batch 起手**：6 輪 batch（welcomeBack 4 / finalForms 16 / regular event toast 15 / seasonal event toast 11 / speech 第一刀 6 / 第二刀 14 / 第三刀 16 / 第四刀 26）累計 **108 user-facing entries i18n / 61 keys × 2 locales = 122 條 i18n.js 條目** — 種子翻譯 290 → **360 條**
- **GDD §10.3 elder companion 100% 完成度**：iter#176 加 visible 陪伴天數（per-pet）+ iter#179 加 bondSummary（cross-pet 紀念碑）— 加上既有 speech / achievement / threshold 邏輯，7/7 完整封閉
- **R-1 收尾 micro**：iter#173 openNameDialog 併入 menus.js / 成第 5 個 modal opener — game.js 502 行（iter#173）→ 502 行（iter#189）穩定（純 cfg / i18n / SOP 工作不增 game.js LOC）
- **array-i18n SOP 建立**：iter#186 `utils.tArray(key, fallback)` helper + `|` separator-joined string convention — 為剩下 cfg.speech 168 條留下機械式批次模板

---

## 2. iter#170-189 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#170** | retrospective-170 milestone | iter#150-169 共 20 輪 R-1 達標 arc 總結 |
| **iter#171** | fairycore event 補完 | dewdrop 葉上露珠 / 8 軸第 7 個 event ✅ |
| **iter#172** | y2k event 補完 | pixel_heart chromatic glitch / **8 軸 event 全覆蓋達成** |
| **iter#173** | R-1 收尾 micro | openNameDialog 併入 menus.js（5 個 modal opener cluster） |
| **iter#174** | 母親節 seasonal | carnation 5 天 window + frilly zigzag 設計 |
| **iter#175** | Pride Month seasonal | rainbow_heart clipPath 8-stripe 粉系 rainbow 整月 |
| **iter#176** | GDD §10.3 elder UI | 陪伴天數 visible counter（per-pet）+ 補 retrospective-170 漏掉的 95% 既存進度 |
| **iter#177** | cfg-level i18n 第一刀 | welcomeBack 4 條 textKey dual-field |
| **iter#178** | cfg-level i18n 第二刀 | finalForms 8 × 2 = 16 條 labelKey/descKey dual-field（首破 300 種子） |
| **iter#179** | 跨 pet 紀念碑 UI | bondSummary aggregate line / GDD §10.3 = 7/7 封閉 100% |
| **iter#180** | cfg-level i18n 第三刀 | regular event toast 15 條 applyToastKey |
| **iter#181** | CNY 春節 seasonal | redenvelope 紅包 + 福字 / 2 月覆蓋 11 天接力 |
| **iter#182** | cfg-level i18n 第四刀 | seasonal event toast 11 條 applyToastKey |
| **iter#183** | **v0.3 9th form explorer 主** | 8 處同步：cfg/save/events/evolve/lint/i18n/petArt placeholder — terms `eventsCaught >= 25` |
| **iter#184** | 9th form explorer 收尾 | 成就 form_explorer + speech 5 條 + collect_all 8→9 + image-prompts §8.6 |
| **iter#185** | 兒童節 seasonal | pinwheel 風車 / **4 月空缺終於補完** / 12 個月全覆蓋 |
| **iter#186** | **cfg.speech 第一刀 + array-i18n SOP** | utils.tArray helper / `|` separator / dailyGreet 6 條 |
| **iter#187** | cfg.speech 第二刀 | critical state 4 pools 14 條（idle.js critical callsites） |
| **iter#188** | cfg.speech 第三刀 | normal state 4 pools 16 條（idle.js normal callsites） |
| **iter#189** | cfg.speech 第四刀 | rich/quirk/happy/wantNag/perfect/elder 6 pools 26 條 + utils.pickHappy 升級 |

---

## 3. 關鍵學習（iter#170-189）

### 3.1 v0.3 feature ship pipeline 第二次成功複製

iter#156-157 ship gourmet 確立的 **2-輪 ship pipeline**（main 結構 + 收尾）在 iter#183-184 ship explorer 第二次成功複製：

**Round 1（main）8 處同步**：cfg.finalForms / cfg.petArt.adult / cfg.traitsDisplay / save.js defaultState / events.js mirror bump（trigger source）/ evolve.js trait priority chain / scripts/check-cfg-schema.js KNOWN_TRAITS / i18n form key（label + desc）

**Round 2（收尾）5 處同步**：cfg.achievements form_X / cfg.speech.form_X 5 條 / achievements.js evaluator + collect_all 累計 bump / cfg.achievements.collect_all desc / i18n + onboarding text / image-prompts §X.X 條目

**SOP 確立的價值**：v0.3 後續若加第 10、11 個 form 都可機械式套同模板。每輪 5-8 處改動是 manageable 的 cron 10-min batch；分兩輪避免一次 diff 過大難 review。

### 3.2 cfg-level i18n batch 的兩種風格：單字串 vs 陣列

iter#177-184 的 4 輪 batch 都是**單字串 cfg field** 雙欄位 SOP：
- iter#177 welcomeBack textKey + text fallback
- iter#178 finalForms labelKey + descKey + label/desc fallback
- iter#180 regular event applyToastKey + applyToast fallback
- iter#182 seasonal event applyToastKey + applyToast fallback

iter#186-189 的 4 輪 batch 切到**陣列 cfg field**（cfg.speech.* 全是 array of strings）—引入了**「| separator-joined string」SOP**：
- `utils.tArray(key, fallback)` helper：i18n 沒載 / 找不到時 → fallback array；正常 → split('|')
- consumer code（idle.js / utils.pickHappy）幾乎零改動：原本 `rand0(sp.X)` 改 `rand0(utils().tArray("speech.X", sp.X))`
- cfg 字面 array 完全保留 fallback — production zero-risk

**為什麼這個對等的兩種 SOP 重要**：cfg-level i18n 的剩餘 168 條（stage / time / form / action 4 個批次）都是陣列 — 第 5-8 輪 batch 全套同模板 1 行 callsite + 1 條 i18n key 的速度。

### 3.3 8 美學軸 event 層的「補對稱」哲學

iter#168-172 連續 5 輪補完 4 個缺 event 的軸：
- iter#168 智慧（book）/ iter#169 balletcore（rose_bouquet）/ iter#171 fairycore（dewdrop）/ iter#172 y2k（pixel_heart）

**設計模式**：每個 event 視覺都跟既有 event 距離大（dewdrop 用粉色 outline + 藍色填充 / pixel_heart 用 chromatic aberration glitch / book 用開書 + page-flip motion / rose_bouquet 用三層 circle bloom）— 確保玩家視覺辨識度。

**反思**：為什麼非要每軸都 ≥ 1 event？因為 event 是 retention hook 的一部分（每天 5-10 個），如果某軸只有 form + accessory 沒有 event，玩家養該軸的 D7+ 體驗就會「軸氛圍斷裂」— event 是日常 atmospheric layer，補完才能讓「choose your aesthetic axis」這個玩法承諾持續成立。

### 3.4 retrospective 不是真相之源

iter#176 起手做 GDD §10.3 elder companion 時意外發現：retrospective-170 §4.3 寫「elder companion 未做」是錯的。實際 grep 顯示 elder_week / elder_month 成就 + speech 系統 + 雙語 i18n 全已 ship（iter#157+ 期間既存）— 整個系統已 95% 完成度。

**教訓**：retrospective 是 cron arc 的快照，不是當前真相。寫的時候有時序偏差（retrospective-170 是看 iter#100-150 的 speech.elder 還是 retrospective-150 的 ack 順序）— 後人讀 retrospective 該配 grep 當前 src 驗證實際進度，不能照單全收。

**SOP 改進**：寫 retrospective 時應該**對 src 跑一次 sanity grep** 確認 backlog 真假，避免後續 cron 誤把已做事項列為 todo。

### 3.5 季節事件擴增「日曆覆蓋」是 retention 設計

12 月份覆蓋從 iter#170 的「8/12 月」（春夏秋冬均勻 + 4 月空缺）→ iter#185 的「12/12 月全覆蓋」+ 部分月雙 event 重疊。

**意外效應**：玩家「下個月會是什麼？」是新的 retention hook。CNY 紅包（02-16~02-22）後玩家進入 3 月 sakura window 期，5 月母親節 carnation + zongzi + sakura 三層重疊期，6 月 Pride 整月 + zongzi 早 9 天重疊 — 都是 narrative 接力。

**設計邊界**：12 個月已飽和，再加 event 該按「主題深度」而非「日期空缺」推進。比如：6 月 Pride 整月 + 父親節（如 6/19 USA）/ 7 月台灣冷氣節 / 9 月教師節 etc — 但要避免日曆 spam（玩家 catch event 變成 chore）。

### 3.6 GDD §10.3 elder companion 的「visible payoff」哲學

iter#176-179 補完 elder companion 的兩個 UI piece（per-pet 陪伴天數 + cross-pet bondSummary）— 從「玩家不知道自己投入了多少時間」到「玩家清楚看到累積成果」。

**隱性 narrative**：這個功能跟 GDD §10.3 「老年互動 - gentle nostalgic companionship, not sad/morbid」對齊 — 不是死亡 / morbid 系，是「累積陪伴的記憶感」。玩家養 30 隻 pet 的 cumulative 1500 天能在 dex bondSummary 上看見 — 這個感覺是付費 game 願意花錢做的「heritage感」。

**為什麼這個 GDD 條目特別重要**：女性向 cottagecore TA 的 retention 不是 PvP / 競賽，是「我跟這個 pet/世界的關係」— GDD §10.3 是這個關係的 visible artifact 機制。

### 3.7 array-i18n 的「| separator」設計選擇

iter#186 寫 utils.tArray 時權衡了 3 個 array-i18n 設計：
- **A 純 JSON-encoded array**：i18n 值 `'["line1","line2"]'`，consumer 端 JSON.parse — 雙引號 escape 衝突 + 工具觀感雜
- **B 一線一 key**：speech.elder.0 / .1 / .2 — 230 lines × 2 locales = 460 keys / 維護成本爆炸
- **C 「|」 separator-joined string**：i18n 值 `"line1|line2|line3"`，consumer 端 .split('|') — 簡潔 + gettext .po 等業界 SOP 兼容

選 C。**對等模式於 industry**：gettext/PoolFile 的 `msgstr "line1\nline2\n"` separator-based plural；CSV/TSV 的 row separator；URL 的 query string `&` separator。

**設計邊界**：line 內容不能含 `|` 字元 — 全 230 條 cfg.speech 都是中文 / 英文標點 / emoji，沒 `|` 衝突。萬一未來新加的 line 真的需要管道字元，可以 escape 成 `\|`（split with regex），但目前不需要。

---

## 4. 後續方向（iter#190+）

### 4.1 cfg.speech 剩餘 4 輪 batch（per §3.2 SOP）

| 輪 | 預計覆蓋 | 條數 |
|---|---------|-----|
| 第五刀 | stage_egg / chick / junior / adult 4 pool + idle / morning / noon / evening / night / lateNight 6 pool | ~52 |
| 第六刀 | form_X 9 forms × 4-7 lines | ~45 |
| 第七刀 | action_X 9 × 2-3 lines | ~22 |
| 第八刀 | remaining edge cases / leftover lines | ~50 |

預估 4 輪結束 cfg-level i18n 230 條 batch（含 iter#186-189 已完成的 62 條）— 第 5-8 輪 168 條 / 平均每輪 42 條，**iter#190 + 4 輪 = iter#193 完成 cfg-level i18n 全部**。

**完成後 v0.3 海外發行 prerequisite 全部 ready**：cfg + i18n.js 雙語 完整覆蓋 / dual-field / array-aware / production zero-risk fallback chain。

### 4.2 v0.3 開新 candidate

cfg-level i18n 完成後，v0.3 candidates：
- **10th finalForm**：candidates 包含 collector（ownedAccessories >= 12）、social（petCount >= 80）、greenkeeper（cleanCount + bath）等 — 對標 explorer 的「per-pet trait mirror」mode
- **新隨機事件 batch**：跨美學軸的 mid-tier event（不是節日）
- **元氣軸 GDD 釐清**（party_hat 軸歸屬 — 純 docs / 已 backlog 4 輪沒做）
- **跨 pet memorial 進階 UI**：iter#179 加的 aggregate 1 line 是起手；可擴成「過去 10 隻寵物 timeline」/ pet memory thread

### 4.3 工程紀律觀察

**「P0 → lint → 第二次抓相同 class」反饋迴路**仍未發生新案例（iter#106 / iter#146 / iter#166 三起後 24 輪沒新 P0）— 證明 i18n-shadow lint + smoke 8 scenarios + 自動 syntax check 23 src 的防線健康。

**i18n functional 測試覆蓋率**目前由 smoke test 8 scenarios 間接保證（i18n 載入 + render 路徑覆蓋）— 沒有 explicit i18n 翻譯完整性測試。**未來考慮**：寫 lint script `check-i18n-coverage.js` 掃 src/*.js 內所有 `t("...")` 呼叫的 key，驗證 zh-TW + en 都有定義 — 防止 typo / 漏譯。

### 4.4 retrospective 過時 risk

per §3.4 教訓，iter#170 寫的「elder companion 未做」是 outdated info。**改進 SOP**：
- 每輪 retrospective 前先 grep src 驗證 backlog 真假
- backlog 標 ⏳ 時加「最後 grep 時間 + 驗證結果」
- 鼓勵 cron 過程 corrective updates（iter#176 正確 corrective）

---

## 5. 數字總結

| 指標 | iter#170 開始 | iter#190 結束 | 變化 |
|------|--------------|--------------|------|
| `src/game.js` LOC | 536 | 502 | -34（iter#173 openNameDialog merge） |
| `src/*.js` 模組數 | 23 | 23 | 0（merge 不增模組） |
| NourishAPI export | 17 | 17 | 0（穩定，bridge 表面積收斂期） |
| NourishUtils export | 13 | 14 | +1（tArray for array-i18n SOP） |
| Deploy gate step | 6 | 6 | 0 |
| Syntax `--check` 涵蓋檔 | 23 | 23 | 0 |
| **i18n 種子翻譯 / locale** | **290** | **360** | **+70** |
| i18n functional sites | ~190 | ~245 | +55 |
| cfg.accessories | 19 | 19 | 0 |
| cfg.randomEvents.pool | 14 | 16 | +2（iter 範圍前已加） |
| cfg.seasonalEvents.pool | 8 | **12** | +4（carnation / rainbow_heart / redenvelope / pinwheel） |
| **cfg.finalForms** | **8** | **9** | **+1（explorer）** |
| **cfg.traitsDisplay** | **7** | **8** | **+1（eventsCaught）** |
| cfg.speech pool | 47 | 48 | +1（form_explorer） |
| cfg.achievements | 26 | 27 | +1（form_explorer） |
| `assets/svg/*.svg` | 35 | 41 | +6（dewdrop / pixel_heart / carnation / rainbow_heart / redenvelope / pinwheel） |
| check-assets total paths | 79 | **85** | +6 |
| P0 bug 抓修 | 3（含 iter#166 `$`） | 3 | 0（24 輪無新 P0 — 防線健康） |
| Lint script | 6 | 6 | 0（穩定） |
| docs/retrospective-X 份數 | 4（100/130/150/170） | 5 | +1（**本份 190**） |

**game.js 從 iter#100 起點 ~1990 → 502（74.7% 縮減 / 16 R-1 大塊 + 7 micro / 90 cron 總輪）**

**8 美學軸 event 層 100% 覆蓋 / 12 個月節日全覆蓋 / GDD §10.3 elder 100% 完成度 / v0.3 9th form ship-ready / cfg-level i18n batch 起手 6 輪 / 種子翻譯首破 360**

---

> 下一份 retrospective 預計在 iter#210 — 等 cfg.speech 剩 4 輪 batch 完成（cfg-level i18n 230 條 ship 完）+ 可能的 v0.3 10th form / 開新 v0.4 候選後再寫。
