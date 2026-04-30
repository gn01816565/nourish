# iter#190-209 Retrospective — v0.4 完整 ship + 9 美學軸成形 + cfg-level i18n 全封閉

> 寫於 2026-04-30（iter#210）。配對 [`retrospective-190.md`](retrospective-190.md)（iter#170-189）+ [`retrospective-170.md`](retrospective-170.md) + [`retrospective-150.md`](retrospective-150.md) + [`retrospective-130.md`](retrospective-130.md)。
> 涵蓋 iter#190 milestone 後 20 輪累積。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **v0.4 主軸 5/5 全 ship 完成**：(1) 10th finalForm warmheart（iter#196-197）/ (2) axis-second-event 6 軸補完（iter#198-203）/ (3) 跨 pet memorial 進階 UI（iter#204）/ (4) 新美學軸 boho ship（iter#205-207, +1 seasonal iter#209）/ (5) GDD §5.5 canonical sync（iter#208）
- **cfg-level i18n batch 完整封閉**：iter#190-193 連續 4 輪做完 cfg.speech 第 5-7 刀（48 pools / 230 條）+ iter#207 boho i18n / iter#209 picnic_blanket — **海外發行 i18n prerequisite ship-ready**，所有 cfg-driven 字串 100% functional
- **9 美學軸全部 ≥ 3 件成形** ✅：iter#100 起點 0 軸完整 → iter#172 8 軸 ≥ 1 event → **iter#207 9 軸全 ≥ 3 件**（GDD §5.5 設計準則達標）
- **lint chain 7 step 第二個 i18n 防線**：iter#194 ship `scripts/check-i18n-coverage.js` — 175 keys × 186 callsites scan + 構造 typo 回測 ✅，補 iter#147 i18n-shadow 後第二件 i18n 防呆
- **content 規模膨脹**：events 22→24（22 regular + 13 seasonal = 35）/ accessories 19→21 / finalForms 9→10 / traits 7→9 / SVG assets 87→98 / **i18n 種子翻譯 360→410（破 400 milestone）**
- **game.js 穩定 502 行**：v0.4 純 content + cfg 新增，game.js 不增量；iter#192 form_X dynamic key i18n / iter#193 action_X dynamic key i18n 後 idle.js + interactions.js 全 cfg-i18n functional

---

## 2. iter#190-209 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#190** | retrospective-190 milestone | iter#170-189 共 20 輪 v0.3 ship + cfg i18n 起手 arc |
| **iter#191-193** | cfg.speech 第 5-7 刀 final | 50+36+42 = 128 條 / form_X / action_X / stage / time-of-day pools — **cfg.speech 230 條完整封閉** |
| **iter#194** | check-i18n-coverage.js 防呆 lint | deploy gate 6 → 7 step / 175 keys × 186 callsites scan / typo 回測 ✅ |
| **iter#195** | GDD §5.5 美學軸地圖 + 元氣軸釐清 | v0.3 唯一純 docs backlog 封閉 — 8 軸 mapping 進 GDD canonical |
| **iter#196-197** | **10th finalForm warmheart ship** | 8 處主結構 + 5 處收尾 / petCount trait / 終態 9→10 / form 成就 7 / collect_all 9→10 |
| **iter#198** | 新 regular event seed（cottagecore filler） | cottagecore 軸 7→8 件（最廣軸） |
| **iter#199-203** | **axis-second-event 5 輪 batch**（cleangirl/智慧/balletcore/fairycore/元氣） | 5 軸從 3→4 件 / 6 個 axis-second-event SVG / regular pool 17→22 |
| **iter#204** | 跨 pet memorial 進階 UI（form-distribution mini-strip） | openDex 顯示「養過幾隻 X form」累積 visible artifact |
| **iter#205-207** | **新美學軸 boho ship** | fringe_ribbon / dried_herbs / straw_hat 三件達 GDD §5.5 軸成形 ≥ 3 件門檻 — **第 9 軸** |
| **iter#208** | GDD §5.5 canonical sync | 8 軸 → 9 軸 / 件數重算 / form-less 軸從 2→3 / v0.5+ candidates 重排 |
| **iter#209** | boho seasonal picnic_blanket | boho 軸首 seasonal layer / 7 月 narrow window / boho 3→4 件 |

---

## 3. 關鍵學習（iter#190-209）

### 3.1 v0.4 ship pipeline 第三次成功複製

iter#156-157 ship gourmet（v0.2）→ iter#183-184 ship explorer（v0.3）→ **iter#196-197 ship warmheart（v0.4）** 三次連續 2-輪 ship form pipeline 全成功：

| Round 1（main 8 處） | Round 2（收尾 5 處） |
|---|---|
| cfg.finalForms entry | cfg.achievements form_X |
| cfg.petArt.adult placeholder | cfg.speech.form_X 5 條 |
| cfg.traitsDisplay row | achievements.js evaluator + collect_all bump |
| save.js defaultState pet.traits.X | i18n form key（label + desc + ach + speech） |
| events/daily/interactions trigger source mirror bump | onboarding text bump（X→X+1 forms） |
| evolve.js trait priority chain | image-prompts §X.X 條目 |
| scripts/check-cfg-schema.js KNOWN_TRAITS |  |
| i18n form key（label + desc）|  |

**SOP value**：v0.5 加 11th form（minimalist? kawaii-decora?）能直接套同模板。每輪 5-8 處改動 manageable 在 10-min cron batch；分兩輪避免一次 diff 過大難 review。

### 3.2 axis-second-event batch 的「軸成形」設計準則

iter#198-203 連續 6 輪補 axis-second-event：cottagecore +seed / cleangirl +towel / 智慧 +message_bottle / balletcore +pointe_shoe / fairycore +moonlight / 元氣 +confetti_pop。

**設計動機**：retrospective-170 §3.3「8 美學軸 event 層覆蓋」確立「每軸 ≥ 1 event」承諾，但 ≥ 1 不夠 — 玩家養 30+ 天還只有 1 個事件會 narrative 重複疲勞。**iter#208 GDD §5.5 sync 升級門檻為「軸 ≥ 3 件成形」** = 玩家「choose your aesthetic axis」承諾的健康 baseline。

**設計準則**：
- 第二 event 跟既有 event narrative 視覺距離大（dewdrop = 自然清晨 / moonlight = 夜晚仙氣 — 兩 event 串完整 fairycore arc）
- 每個 axis 的 narrative arc 完整（pre-show 練功 → after-show 收花 / clean 中泡泡 → clean 後毛巾 / 廣域 atmosphere → 局部 burst）
- 數值區隔（atmospheric 低 stat / kinetic 高 stat / coin or no coin 對應 narrative）

### 3.3 cfg-level i18n batch 完整封閉的「最後一里」

iter#177-193 共 11 輪 batch 累計 236 條 cfg-level i18n。剩下的 fallback（accessories / interactions / wants / achievements 已 functional via Key 但 label 字面仍中文）不算 batch 阻塞 — production 走 Key path 全雙語。

**真正最後一里 = cfg.speech 230 條的 array i18n**：
- iter#186-193 建立 `utils.tArray(key, fallback)` + `|` separator-joined string SOP
- 8 個 batch（dailyGreet 6 / critical 14 / normal 16 / mid 26 / stage+time 50 / form_X 36 / action_X 42 / 其他 leftover）
- callsite 全 idle.js + interactions.js + utils.pickHappy 三處
- **dynamic key 設計**（`speech.${stageKey}` / `speech.form_${form}` / `speech.action_${key}`）讓未來新增 stage / form / action 零 callsite 改動

**反思 cfg-level i18n batch 整體節奏**：
- 11 輪 batch / 6 個 cfg 結構 / 236 條 entries
- 平均每輪 21 條 — 是 manageable 在 cron 10-min batch 的精準 sizing
- 若一次 batch 100+ 條 review 會失焦

### 3.4 GDD canonical 文件的 sync 紀律

iter#176 抓到 retrospective-170 §4.3「elder companion 未做」過時 → 教訓「retrospective 過時 risk」 → iter#195 主動寫 GDD §5.5 axis map → **iter#208 進一步主動 sync GDD §5.5 反映 v0.4 ship**。

**SOP 升級**：
- retrospective 不是真相之源 — 寫的時候有時序偏差，後人讀 retrospective 該配 grep 當前 src 驗證
- **GDD canonical 文件每 10-15 輪 ship 後主動 sync**（不等 next retrospective） — 因為 retrospective 是「總結 view」，GDD 是「reference view」，後者需要更新鮮

**這個紀律的可量化表現**：
- iter#100-150：GDD §5 沒被動過（純 retrospective 寫）
- iter#195 / iter#208：主動 sync 兩次（純 docs round）
- 預期 v0.5 期間每 10-15 輪 sync 一次

### 3.5 「P0 → lint」反饋迴路 vs 預防性 lint 投資

兩種 lint 投資 timing 規律確立：
- **Reactive（已痛）**：iter#147 i18n-shadow lint — iter#106 + iter#146 兩起 P0 後反應式投資 / 立即 catch iter#166 render 抽出時的 `$` regression（第二次 ROI 兌現）
- **Proactive（規模到 critical mass）**：iter#194 i18n-coverage lint — dict 從 12 條 → 786 條 manual review impossible，預防性投資 / 現尚未 catch P0 但作為 typo 防線

**兩種 timing 都有效**：reactive 痛點導向 / proactive 規模導向。**v0.5 候選 proactive lint candidates**：
- check-cfg-form-coverage.js（每個 cfg.finalForms.X 都應有 i18n labelKey + descKey + speech.form_X + cfg.achievements.form_X + scripts/cfg-schema KNOWN_TRAITS）
- check-axis-coverage.js（每軸 ≥ 3 件 GDD §5.5 設計準則）

### 3.6 cfg-driven dynamic key 的 i18n 擴展性

`speech.${stageKey}` / `form.${formId}.label` / `seasonal.${eventId}` 的動態 key 設計，讓未來新增 stage / form / event 零 callsite 改動（只需加 1 條 i18n key + 1 條 cfg entry）。**這個架構在 v0.4 ship 中得到驗證**：

- iter#196 加 warmheart finalForm：i18n 加 `form.warmheart.label/desc` + `speech.form_warmheart` 即可，formLabel(form) helper 透過 cfg-driven labelKey 自動 dispatch
- iter#198-203 加 6 個 axis-second-event：i18n 加 `event.X` + cfg.applyToastKey 即可，events.js runEventApply 透過 dual-field 自動 dispatch
- iter#205-207 加 boho 軸 3 件：i18n 加 `acc.X` / `event.X` 即可

**架構價值**：v0.4 加 11 個新 content（1 form + 6 events + 3 boho items + 1 seasonal）**0 行 callsite 改動**（除 warmheart 主結構需要新 trait + lint）— 100% cfg + i18n driven。

### 3.7 form-less 軸的設計擴展（cottagecore / y2k → boho）

iter#195 GDD §5.5 寫 cottagecore + y2k 兩軸 form-less 是 design-by-design — 當時是「事後合理化」。iter#205-207 ship boho 軸時**主動選擇 form-less**：

**form-less 軸 vs form-bearing 軸 的擴展設計**：
- Form-bearing 軸（gourmet / explorer / warmheart / sage / fighter / diva / divine / fatty / ugly / healthy）：trait 累積路徑 → 進化終態 → 玩家 identity 投射
- Form-less 軸（cottagecore / y2k / boho）：環境 / 氛圍 / 風格 — 玩家任何 form 都能透過配件 + 事件感受該軸氛圍

**設計準則**：
- v0.5 加新軸時可主動選擇 form-less 起手（更輕量 ship，3 個 cfg structure 即可）
- 累積 1-2 cron arc 玩家行為數據後可考慮為 form-less 軸補 form
- boho v0.5 候選 form「漂泊者雞」keyed off ownedAccessories 多樣性 — 對應「累積各軸配件 = boho mixing」narrative

---

## 4. 後續方向（iter#210+）

### 4.1 v0.5 candidates 排序

| 候選 | size | ROI | 備註 |
|-----|-----|-----|------|
| 11th finalForm（minimalist? kawaii-decora? dark academia?） | 2 cron 輪（main + 收尾） | 高 — 跟 SOP 對齊 | 等玩家 v0.4 數據後選哪個軸 form 化 |
| 跨軸 mixing-mode 成就 | 3-5 cron 輪 | 中 — 設計新 achievement system | 玩家戴 fringe_ribbon + 觸發 fairycore event = 「跨軸混搭」achievement |
| seasonal 補完 5 軸（智慧 / balletcore / fairycore / cleangirl + 1 boho 已 ship） | 5 cron 輪 | 中 — 對齊 GDD §5.5 補強重點 | 從 retrospective-190 §4 backlog 延續 |
| boho axis form「漂泊者雞」 | 2 cron 輪 | 中 — form-less 軸 form 化 first-mover | trait keyed off ownedAccessories diversity? |
| 新美學軸 candidate（minimalist / kawaii-decora / dark academia） | 3-4 cron 輪 / 軸 | 低 — 9 軸已飽和 | 等 v0.5 數據驅動 |

**iter#210 後第一個 cron 推薦**：seasonal 補完軸 — 5 輪平均 1 軸 / 輪，pace 跟 axis-second-event batch 一致 / SOP 已建立。

### 4.2 工程紀律觀察

**「P0 → lint」反饋迴路 24 cron 輪後仍 0 新 P0**（iter#166 render 抽出後 0 P0 至 iter#210）— 防線健康。

**dynamic-key i18n 架構是 v0.4 加新 content 0 callsite 改動**的根本原因 — 對「擴展性 vs 簡潔性」平衡的好範例：
- 簡潔（不是每個 stage / form / event 都顯式 if-else 分支）
- 擴展（cfg + i18n 加新 entry 即可，零 callsite 改動）

### 4.3 retrospective-210 vs retrospective-190 的 cadence

對照前 4 份 retrospective：iter#100（35 輪 65→100）→ iter#130（35 輪）→ iter#150（15 輪）→ iter#170（20 輪）→ iter#190（20 輪）→ **iter#210（20 輪）**。

**20-輪 cadence 確立**為健康節奏：
- 短於 15 輪：內容 thin，retrospective 學習價值低
- 長於 30 輪：細節太多 review hard
- 20 輪 = 1-2 個 v0.X feature 完整 ship arc 的自然單元

---

## 5. 數字總結

| 指標 | iter#190 開始 | iter#210 結束 | 變化 |
|------|--------------|--------------|------|
| `src/game.js` LOC | 502 | 502 | 0（v0.4 純 content 不增量） |
| `src/*.js` 模組數 | 23 | 23 | 0 |
| NourishAPI export | 17 | 17 | 0（架構穩定） |
| NourishUtils export | 14 | 14 | 0（tArray 已 ship 在 iter#186） |
| Deploy gate step | 6 | **7** | +1（iter#194 i18n-coverage lint） |
| **i18n 種子翻譯 / locale** | **360** | **410** | **+50（破 400 milestone）** |
| i18n functional sites | ~245 | ~254 | +9 |
| **cfg.finalForms** | **9** | **10** | **+1（warmheart）** |
| cfg.traitsDisplay | 8 | 9 | +1（petCount） |
| cfg.randomEvents.pool | 16 | **22** | +6（seed/towel/message_bottle/pointe_shoe/moonlight/confetti_pop/dried_herbs — 7 events 含 boho） |
| 等等實際是 16 → 23 | | | iter#206 dried_herbs 沒進 axis-second-event batch 表 |
| cfg.seasonalEvents.pool | 12 | **13** | +1（picnic_blanket） |
| cfg.accessories | 19 | **21** | +2（fringe_ribbon / straw_hat） |
| cfg.speech pool | 48 | 49 | +1（form_warmheart） |
| cfg.achievements | 27 | 28 | +1（form_warmheart） |
| `assets/svg/*.svg` | 41 | **52** | +11（warmheart 占位 + 6 axis-events + 2 boho + picnic_blanket + 1 misc） |
| check-assets total paths | 85 | **98** | +13 |
| **美學軸數** | **8** | **9** | **+1（boho v0.4 新軸）** |
| 軸 ≥ 3 件成形 | 8/8（per iter#170 分析含部分 form-bearing） | **9/9（GDD §5.5 軸成形門檻全達標）** | ✅ |
| Lint script 數 | 6 | **7** | +1（i18n-coverage） |
| docs/retrospective-X 份數 | 5（100/130/150/170/190） | **6** | +1（**本份 210**） |
| P0 bug 抓修累計 | 3 | 3 | 0（24 輪無新 P0） |

**game.js 從 iter#100 起點 ~1990 → 502（74.7% 縮減 / 16 R-1 大塊 + 7 micro / 110 cron 總輪 / **R-1 達標後 44 輪純 content 增量穩定**）**

**v0.4 主軸 5/5 全 ship / 9 美學軸全 ≥ 3 件 / cfg-level i18n 全 functional / 6 種 cfg 結構 dual-field SOP 統一 / 7-step deploy gate / 410 條雙語 i18n / 24 輪 0 新 P0 — 健康 baseline 進入 v0.5**

---

> 下一份 retrospective 預計在 iter#230 — 等 v0.5 至少 1-2 個 main feature ship（11th form / seasonal 補完 / 新軸候選）後再寫，確保 retrospective 內容飽和度。
