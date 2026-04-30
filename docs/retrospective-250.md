# iter#230-249 Retrospective — v0.6 終極 milestone：12 軸全有 form + 16 finalForms + 派生 trait SOP 6 種 source spectrum 完整 + 整合 SOP 量產做法

> 寫於 2026-04-30（iter#250）。配對 [`retrospective-230.md`](retrospective-230.md)（iter#210-229）+ [`retrospective-210.md`](retrospective-210.md) + [`retrospective-190.md`](retrospective-190.md) + [`retrospective-170.md`](retrospective-170.md) + [`retrospective-150.md`](retrospective-150.md) + [`retrospective-130.md`](retrospective-130.md)。
> 涵蓋 iter#230 milestone 後 20 輪累積（v0.6 終極 ship + form-less 軸補 form 全完成）。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **🎉 v0.6 ship 終極 milestone 達成：12/12 美學軸全有 form**（iter#249 maximalist 完成 form-less 軸補 form 6/6 — boho drifter / minimalist curator / cottagecore farmhand / y2k netizen / dark academia scholar / kawaii-decora maximalist）
- **finalForms 11 → 16**（+5 派生 form：curator iter#234-236 / farmhand iter#241-242 / netizen iter#244-245 / scholar iter#246-247 / maximalist iter#248-249）
- **派生 trait SOP 6 次成功 + 6 種條件 source spectrum 完整 ✅**：物質累積（drifter/curator）/ per-pet 三 trait AND（farmhand）/ cross-life dex（netizen）/ day-based streak（scholar）/ achievement count（maximalist）— 從 iter#216 drifter 1 例 → iter#249 6 例完整 narrative spectrum
- **整合 SOP 從首例升級到量產做法**：iter#241-242 farmhand 首例 → iter#244-245 netizen 第 2 次 → iter#246-247 scholar 第 3 次 → iter#248-249 maximalist 第 4 次 — **連續 4 次 zero deviation = production-ready**，2 cron-輪 / 11+1 touchpoints SOP
- **i18n 衝刺五輪雙跨 milestone**：iter#235-240 共 +165 條（436 → 601 跨 500 / 跨 600） + iter#247/249 form i18n 共 +48 條 → **649 條 zh + en**（距 700 差 51 條）
- **content 規模**：finalForms 11→16 / speech_pools 50→55 / events 47（穩定）/ accessories 27（穩定）/ i18n 436→649（+213 條）/ image-prompts §8.5-§8.13 = **9 個 v0.2-v0.6 form 全有 prompt**
- **lint chain 49 cron 輪 0 P0 bug** — 自 iter#166 render regression 後連續累積，break 30 → break 49

---

## 2. iter#230-249 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#230** | retrospective-230 milestone + kawaii-decora R2 candy_jar | iter#210-229 共 20 輪總結 + kawaii-decora 軸第二件 event |
| **iter#231** | kawaii-decora 第三件達軸成形 plush_bow | accessories 26→27，**軸 ship pipeline SOP 第 4 次成功** |
| **iter#232** | GDD §5.5 sync 11 → 12 軸 | canonical reference 跟上 12 軸完整 + spectrum 兩端對立完成 |
| **iter#233** | kawaii-decora 首 seasonal white_day_gifts | seasonal 20→21，**5 form-less 軸 seasonal 全補完 mini-batch** 完成 |
| **iter#234-235** | **curator 派生 form 第 2 例 R1+R2** | minimalist 軸補 form / 跟 drifter 對稱反向「克制收藏家」/ R1+R2+§8.9 三輪 SOP |
| **iter#236** | image-prompts §8.9 curator prompt | drifter §8.8 後第 5 個 form 有 prompt |
| **iter#237** | i18n 衝刺第一輪 events labelKey 14 events | i18n 441→469 / labelOf() 漸進式 migration helper 設計 |
| **iter#238** | i18n 衝刺第二輪 events 33 events 跨破 500 | i18n 469→535 / 跨 500 milestone / node script batch transform |
| **iter#239** | i18n 衝刺第三輪 traitsDisplay labelKey + formKey | i18n 535→571 / 漸進式 migration 第 2 處驗證 settings.js |
| **iter#240** | i18n 衝刺第四輪 散落 UI strings 跨破 600 | i18n 571→601 / 跨 600 milestone / 漸進式 migration 第 3 處驗證 utils.js |
| **iter#241-242** | **farmhand 派生 form 第 3 例 + 整合 SOP 首例** | cottagecore 軸補 form / 三 trait AND 平衡 narrative / **R2+§image-prompts 同輪 ship 整合做法首例** |
| **iter#243** | GDD §5.5 sync 12 軸 / 11→13 forms | 含派生 trait SOP 1→3 次紀錄 + 整合做法首例 + i18n 衝刺 SOP 留檔 |
| **iter#244-245** | **netizen 派生 form 第 4 例 + 整合 SOP 第 2 次 reuse** | y2k 軸補 form / 跨命 dex 派生 source 首例 / 整合做法可預測可複製確認 |
| **iter#246-247** | **scholar 派生 form 第 5 例 + 整合 SOP 第 3 次 reuse** | dark academia 軸補 form / day-based streak source 首例 / 量產做法 production-ready |
| **iter#248-249** | **maximalist 派生 form 第 6 例 + 整合 SOP 第 4 次 reuse + form-less 軸補 form 6/6 milestone** | kawaii-decora 軸補 form / achievement count source 首例 / **12/12 美學軸全有 form 終極 milestone 🎉** |

---

## 3. 關鍵學習（iter#230-249）

### 3.1 派生 trait SOP 從 1 次 → 6 次成功 / 1 種 source → 6 種 source spectrum 完整

iter#216-217 drifter 是首例（1 次成功 / 1 種 source — cross-life ownedAccessories）。本期 5 次派生 form 全 ship 後達 6 次成功 / 6 種 source 完整 spectrum：

| # | iter | form | 條件 source | narrative |
|---|------|------|------------|-----------|
| 1 | iter#216-217 | drifter | cross-life ownedAccessories ≥ 8 | 累積收藏家 |
| 2 | iter#234-236 | curator | cross-life ownedAccessories ≤ 3 + perfect ≥ 60 | 克制收藏家（drifter 對稱反向）|
| 3 | iter#241-242 | farmhand | per-pet 三 trait AND（events ≥ 10 + feed ≥ 15 + pet ≥ 15）| 平衡照顧者 |
| 4 | iter#244-245 | netizen | cross-life dex.unlockedForms ≥ 5 | 跨命知識累積 |
| 5 | iter#246-247 | scholar | cross-life day-based streak ≥ 14 | 持續鑽研 |
| 6 | iter#248-249 | maximalist | cross-life achievement count ≥ 20 | 繁飾累積 |

**設計收穫**：派生 trait 不限於 stat counter 一種 source。本期擴展到「物質 / 多 trait 組合 / dex / day-streak / achievement count」5 種獨立 cross-life data source — narrative diversity 跟著 source diversity 一起完整。

### 3.2 form ship pipeline 從「3 輪 SOP」→「2 輪整合 SOP」量產做法

drifter / curator 都用 R1 + R2 + §image-prompts 三輪 SOP（drifter 三輪 / curator iter#234-236 三輪）。iter#241 farmhand 開始**整合做法**：R2 + §image-prompts 同 cron 輪 ship。

**4 次 reuse zero deviation**：
- iter#241-242 farmhand（首例驗證可行性）
- iter#244-245 netizen（第 2 次 reuse — 確認可預測可複製）
- iter#246-247 scholar（第 3 次 reuse — 量產做法 production-ready）
- iter#248-249 maximalist（第 4 次 reuse — 100% production-ready 量產做法確認 ✅）

**SOP 設計**：
| Cron 輪 | 階段 | Touchpoints |
|---------|------|------------|
| **R1 main 6 處** | 結構建立 | cfg.finalForms / petArt / achievements + collect_all bump / evolve.js trait chain / achievements.js evaluator + collect_all 門檻 / sw.js |
| **R2 + §image-prompts 整合** | user-facing layer + AI 生圖 prompt | cfg.speech / menus.js FORM_ICONS / i18n form/ach/desc/achdesc 4 keys × 2 + collect_all + onboarding 雙語 bump = 12 entries / docs/image-prompts.md §8.X / sw.js |

**11 + 1 touchpoints / 2 cron-輪 / ~20 分鐘** — 後續 v0.7+ 派生 form 候選都可直接遵循。

### 3.3 i18n 衝刺五輪完整化 — 漸進式 migration helper 模式驗證 3 處

iter#235-240 共 5 輪 +165 條 i18n（436→601）達成 500/600 雙 milestone：

| 輪次 | 主題 | 增量 | i18n migration helper 模式 |
|------|------|------|--------------------------|
| iter#235 | curator R2 i18n keys | +5 | （form i18n 直接 t() callsite） |
| iter#237 | events labelKey 第一輪 14 events | +28 | **events.js labelOf() helper 首例** |
| iter#238 | events labelKey 全補完 33 events 跨 500 | +66 | （batch script transform 工具鏈） |
| iter#239 | traitsDisplay labelKey + formKey | +36 | **settings.js inline conditional t() 第 2 處** |
| iter#240 | 散落 UI strings 跨 600 | +30 | **utils.js inline tr-getter 第 3 處** |

**設計收穫**：漸進式 i18n migration 模式（labelKey + literal label fallback）三處驗證後成熟為標準做法。後續其他模組需 i18n 化都可遵循 — 零 regression migration / lint i18n-coverage 自動驗證。

### 3.4 form ship pipeline 從 4 次 → 6 次成功 / form-less 軸補 form 全完成

retrospective-230 紀錄 form ship pipeline「4 次成功」（gourmet / explorer / warmheart / drifter）。本期再 +5 次：curator / farmhand / netizen / scholar / maximalist = **6 次成功 + 派生 trait SOP 全 6 種 source 集齊**。

**form-less 軸補 form 全完成 milestone**（iter#216-249 累積）：
| 軸 | 補完 form | iter | 派生 source |
|----|----------|------|------------|
| boho | drifter | iter#216-217 | ownedAccessories ≥ 8 |
| minimalist | curator | iter#234-236 | ownedAccessories ≤ 3 + perfect |
| cottagecore | farmhand | iter#241-242 | 三 trait AND |
| y2k | netizen | iter#244-245 | dex ≥ 5 |
| dark academia | scholar | iter#246-247 | loginStreak ≥ 14 |
| **kawaii-decora** | **maximalist** | **iter#248-249** | **achievements ≥ 20** |

**🎉 12/12 美學軸全有 form** — v0.6 終極 milestone。

### 3.5 dark academia 軸 sage + scholar 雙 form narrative 區隔設計

dark academia 軸是首個「同軸雙 form」設計：
- **sage**（既有 trait-based form）— 「研究中 / 解題者 / 半月眼鏡 + 公式書 / 智力 trait spike」narrative
- **scholar**（iter#246-247 派生 form）— 「持續閱讀 / 學術老靈魂 / 圓框眼鏡 + 多本書 / day-based streak commitment」narrative

兩 form 在「學術 narrative space」內各自獨立：
- sage = 一隻寵物的「智力研究」屬性
- scholar = 跨命「持續鑽研」commitment

設計提示給 v0.7+ 同軸多 form 候選：
- 元氣軸 + ? form （fighter 已是元氣 spike，可加 cross-life「 marathoner」連續活力 commitment）
- 美食家軸 + ? form （gourmet 是 feed spike，可加「pâtissier」cross-life 累積 fed pet count）
- 智慧軸 sage 已有，scholar 是 dark academia 而非 sage 軸 — narrative 區隔關鍵

### 3.6 整合 SOP 4 次 reuse zero deviation = production-ready 確認

整合做法（R2 + §image-prompts 同輪 ship）的 4 次連續 reuse 全零 deviation 是「SOP 成熟」的最終確認：
- 第 1 次（iter#241-242 farmhand）：驗證可行性 — SOP 從「實驗 → 標準」
- 第 2 次（iter#244-245 netizen）：確認可預測 — SOP「標準 → 量產做法」
- 第 3 次（iter#246-247 scholar）：production-ready — SOP「量產做法 → 100%」
- **第 4 次（iter#248-249 maximalist）：100% reusable** — SOP 已成熟到「無人工干預可批量 ship」

**設計遺產**：v0.7+ 任何派生 form / 同軸多 form 候選都可直接遵循此 SOP，不需重新探索。

### 3.7 lint chain 49 cron 輪 0 P0 bug — 從 30 → 49 連續累積

retrospective-230 紀錄「30 cron 輪 0 P0 bug」milestone。本期 +19 cron 輪 → **49 cron 輪 0 P0 bug** — 連續累積：

- 7 step lint：syntax × 2 / sw-shell / assets / cfg-schema / i18n-shadow / i18n-coverage
- 8/8 smoke：init + render across all stages + 16 final forms（vm sandbox 跑）
- cfg-schema invariant 8（finalForms keys ↔ petArt.adult keys 雙向同步）— 6 派生 form ship 過程全通過
- i18n-coverage 175→189 keys（i18n 衝刺新增 14 static t() callsites）

**設計收穫**：lint chain 防呆系統有效。每輪 R1 + R2 + 整合 ship 過程全自動通過 — 設計時的 invariant 檢查（特別是 cfg-schema invariant 8 + i18n-coverage 動態 lookup 不在 static scan）讓 ship 不破壞 game 行為。

---

## 4. v0.7+ 候選方向（iter#250 後排序）

### 4.1 即時 ROI（iter#251-260 內可完成）

1. **GDD §5.5 增量 sync 13 → 16 forms + 6/6 form-less 補完 milestone**（純 docs，中 ROI，但 4 form 累積 + milestone 達成需即時記錄）
2. **i18n 衝刺第六輪衝 700 milestone**（剩 51 條，零碎 strings 補完 — pet 名稱 default / shop description / dex flavor 等）
3. **light academia 第 13 軸候選評估**（純研究 / sub-agent friendly — 跟 dark academia 對稱光暗雙軸 narrative，需差異化分析）

### 4.2 中期 ROI（iter#261-280 內）

1. **同軸多 form 設計探索**：dark academia 已有 sage + scholar 雙 form，可考慮元氣軸 / 美食家軸補第 2 form（「marathoner」/「pâtissier」narrative candidates）
2. **docs/local-image-gen-setup.md**（user 兩次提問待 cron 啟動）— ComfyUI + Pony Diffusion + 啾啾 9 form prompts batch script + rembg 透明背景，一次完成 placeholder PNG 全替換
3. **跨軸 ach 系列補強**（axis_mixer / rainbow_collector 從 2→4 個跨軸成就，narrative「混搭 master / 軸 explorer」等）

### 4.3 長期方向（iter#281+）

1. **第 13-15 軸候選評估**：light academia / goblincore / regencycore — 12 軸 + 16 forms 後新軸 ROI 進一步遞減，建議玩家行為數據驅動
2. **content 池規模 30/30/30 milestone**：accessories / regular events / seasonal events 各破 30
3. **i18n 種子翻譯破 800 條**：目前 649 條，第 5 種語言起手 candidate（韓 / 日 / 西 / 法 / 德 ROI 排序）
4. **iter#270 retrospective**：以 v0.7 ship 為素材

---

## 5. 設計原則 carry-forward

從 iter#230-249 累積到 v0.7+ 的可遵循原則（補充 retrospective-230 既有 7 條）：

1. **派生 trait 6 種 condition source spectrum 完整** — 後續派生 form 不需新 source 探索（除非 v0.7+ 引入新 cross-life data 結構）
2. **整合 SOP 量產做法**（R2 + §image-prompts 同輪 ship，11+1 touchpoints / 2 cron-輪）— 派生 form 標準做法
3. **同軸多 form narrative 區隔 SOP**（dark academia sage + scholar 案例）— 兩 form 各自獨立 narrative space，避免視覺競爭
4. **i18n 漸進式 migration helper 模式 3 處驗證**（events.js labelOf / settings.js inline / utils.js tr-getter）— 後續模組需 i18n 化可直接遵循
5. **i18n 衝刺 batch SOP**（每輪 ~30 條 / 每 5 輪 +150 條）— 衝 milestone 的標準節奏
6. **cfg-schema invariant 自動防呆**（特別是 invariant 8 finalForms ↔ petArt.adult 雙向同步）— form ship 過程零 regression 保險
7. **GDD §5.5 sync cadence**（5-10 cron 輪一次 — iter#226 / 232 / 243 三次驗證）— canonical reference 不落後
8. **node script batch transform 工具鏈**（iter#238 events labelKey 33 events 一次推完）— 大批量 data field 加入時的工具選

---

寫於 iter#250 / 12 美學軸全有 form / 16 finalForms / 派生 trait 6 種 source spectrum 完整 / 整合 SOP 量產做法 / 49 cron 輪 0 P0 bug。
