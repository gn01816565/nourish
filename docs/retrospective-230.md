# iter#210-229 Retrospective — v0.5 全 ship + v0.6 起手 + 12 美學軸 + 跨軸成就 + ship pipeline SOP 4 次成功

> 寫於 2026-04-30（iter#230）。配對 [`retrospective-210.md`](retrospective-210.md)（iter#190-209）+ [`retrospective-190.md`](retrospective-190.md) + [`retrospective-170.md`](retrospective-170.md) + [`retrospective-150.md`](retrospective-150.md) + [`retrospective-130.md`](retrospective-130.md)。
> 涵蓋 iter#210 milestone 後 20 輪累積（v0.5 ship + v0.6 起手）。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **v0.5 主軸 5/5 全 ship 完成**（iter#211-222）：(1) 5 軸 seasonal 補完 batch（iter#211-215）/ (2) drifter 11th finalForm + boho 軸補 form 派生 trait 第一例（iter#216-217）/ (3) dark academia 第 10 美學軸 ship（iter#218-220）/ (4) GDD §5.5 sync iter#221 / (5) 跨軸成就系統 axis_mixer + rainbow_collector（iter#222）
- **v0.6 起手 9 cron 輪**（iter#223-229）：(1) minimalist 第 11 美學軸 ship（iter#223-225 三輪）/ (2) GDD §5.5 sync iter#226 / (3) form-less 軸 seasonal 補完 mini-batch（iter#227 dark academia + iter#228 minimalist）/ (4) kawaii-decora 第 12 美學軸起手（iter#229）
- **12 美學軸 + 4 軸 ≥ 4 件 ★★★★ 飽和度** ✅：coquette / cottagecore / 元氣 / dark academia / minimalist 五軸並列頂級飽和；**aesthetic spectrum 兩端首次完整**（minimalism 不堆 ↔ kawaii-decora 堆量）
- **ship pipeline SOP 4 次成功複製**：軸 ship pipeline（accessory → event → accessory 三段）— boho（iter#205-207）/ dark academia（iter#218-220）/ minimalist（iter#223-225）/ kawaii-decora 啟動中（iter#229+）— **3 cron-輪達軸成形 SOP 已從實驗升級為標準做法**
- **content 規模膨脹**：accessories 21→26（+5）/ events 22→25 regular + 13→20 seasonal = 35→45（+10，**首破 20 seasonal milestone**）/ finalForms 10→11（+drifter）/ 美學軸 9→12（+boho/+dark academia/+minimalist/+kawaii-decora 4 軸但前者已成形於 iter#207）/ i18n 種子翻譯 410→435 條（**首破 430 整數 milestone**）
- **跨軸成就 idea-to-impl 1 cron 輪落地**：iter#218 dark academia ship → iter#222 axis_mixer + rainbow_collector 落地僅隔 4 輪 — v0.5/v0.6 預留 idea「跨軸 mixing-mode」**正式落地**，ACCESSORY_AXIS map 自動延伸新軸（kawaii-decora iter#229 加入後跨軸成就立即納入計算）
- **lint chain 7 step + 8/8 smoke 30 cron 輪 0 P0 bug**：自 iter#166 render regression 後連續 30 輪 deploy gate 全綠

---

## 2. iter#210-229 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#210** | retrospective-210 milestone | iter#190-209 共 20 輪 v0.4 ship 總結 |
| **iter#211-215** | **v0.5 主推進 1：5 軸 seasonal 補完 batch** | stationery_set / dance_tutu / winter_starlight / spa_salts / retro_console — 5 個有 form 軸從 4→5 件，**5 軸並列 5 件 milestone** |
| **iter#216-217** | **v0.5 主推進 2：drifter 11th finalForm + 派生 trait 第一例** | cross-life ownedAccessories ≥ 8 派生 — 跟其他 10 form per-pet trait counter 不同設計，meta-progression 跨命累積 |
| **iter#218-220** | **v0.5 主推進 3：dark academia 第 10 美學軸 ship** | velvet_bow / quill_pen / round_glasses 三件達 ≥ 3 件成形（軸 ship pipeline SOP 第 2 次複製）|
| **iter#221** | GDD §5.5 sync 9 → 10 軸 | canonical reference 跟上 10 軸完整成形狀態 |
| **iter#222** | **v0.5 主推進 5：跨軸成就系統落地** | axis_mixer（appearance ≥ 2 軸 active）+ rainbow_collector（ownedAccessories ≥ 4 軸覆蓋）— v0.5/v0.6 預留 idea「跨軸 mixing-mode」**正式落地**，ACCESSORY_AXIS map 自動延伸 |
| **iter#223-225** | **v0.6 起手 1：minimalist 第 11 美學軸 ship**（軸 ship pipeline SOP 第 3 次複製）| minimal_chain / morning_coffee / minimal_pin — narrative「少即是多 / 留白美學」+ TA 軟化 SOP（純 scandinavian 太冷 → cream + corner pink dot） |
| **iter#226** | GDD §5.5 sync 10 → 11 軸 | canonical reference 跟上；form-less 軸 3 → 4 軸；ship pipeline SOP 升級「3 次驗證的標準做法」|
| **iter#227-228** | **v0.6 起手 2：form-less 軸 seasonal 補完 mini-batch** | gothic_candle（dark academia / Halloween 10-31）+ new_year_dawn（minimalist / New Year 01-01） — 兩軸從 3→4 件 ★★★★，TA 軟化 SOP 第 3-4 次複製，填補 10-03~12-18 + 01-01~02-11 兩個日曆大缺口 |
| **iter#229** | **v0.6 起手 3：kawaii-decora 第 12 美學軸起手** | decora_clips（軸首發 1/3 件）— narrative「堆量 / 過度可愛」**直接對立** minimalism 軸，aesthetic spectrum 兩端首次完整 |

---

## 3. 關鍵學習（iter#210-229）

### 3.1 軸 ship pipeline SOP 第 4 次驗證成「標準做法」

iter#205-207 boho（首次） → iter#218-220 dark academia（第 2 次） → iter#223-225 minimalist（第 3 次） → iter#229+ kawaii-decora（第 4 次啟動中）：

| Cron 輪 | 第 1 件 | 第 2 件 | 第 3 件 |
|---------|--------|--------|--------|
| **R1** | accessory（slot 互補設計，跟既有同軸 accessory 不同 slot） | — | — |
| **R2** | — | event（atmospheric narrative 對齊軸 DNA，無 coin 或低 coin） | — |
| **R3** | — | — | accessory（達 ≥ 3 件成形 GDD §5.5 門檻，跟 R1 互補 narrative） |

**驗證已證 SOP 可預測 / 可複製**：每輪 SVG + cfg + i18n + sw + iteration-log = 5-touchpoints / 10 分鐘可完成。後續 v0.7+ 新軸都可直接遵循此 SOP 而非重新探索。

### 3.2 派生 trait 第一例：drifter 跨命累積 form

iter#216-217 drifter form 是「meta-progression form」首例，跟其他 10 form 設計不同：

| 設計層 | 其他 10 form | drifter（派生 trait） |
|--------|-------------|---------------------|
| trait 累積 | per-pet（pet.traits.X） | **cross-life**（state.pet.ownedAccessories — 跨命保留）|
| 解鎖時機 | 養一隻達標 | 跨命累積收藏家行為 |
| narrative | 「這隻寵物個性化身」 | 「玩家累積收藏家的旅人化身」 |

**v0.7+ 派生 trait 第二例 candidates**：
- minimalist 派生 form「克制收藏家」(reverse - ownedAccessories ≤ 某閾值 + 高心情 streak) — 跟 drifter 對稱反向
- 累積 evolveCount ≥ N 派生「資深玩家」 form
- 累積 daysPlayed ≥ N 派生「老朋友」 form

### 3.3 form-less 軸 seasonal 補完 mini-batch SOP（iter#227-228 兩輪驗證）

| 軸 | seasonal | 節日 anchor | 日曆缺口填補 | TA 軟化處理 |
|----|---------|------------|-------------|-----------|
| dark academia | gothic_candle | Halloween 10-31 | 10-03~12-18（2.5 個月） | kawaii-soft Halloween（去除 carved jack-o-lantern + cottagecore pink halo） |
| minimalist | new_year_dawn | New Year 01-01 | 01-01~02-11（1.5 個月） | warm minimalism（cream + soft pink dawn sky tint + warm halo 圍著 sun） |

**SOP 共同 pattern**：軸 narrative 強連結節日 anchor + 填補日曆缺口 + 軸內 narrative 階梯感（同軸 regular event 跟 seasonal event 不同情境）+ TA 軟化 palette + ★★★ → ★★★★ 飽和度升級。**kawaii-decora 軸後續可遵循此 SOP** 補完 seasonal（candidate「Sanrio 萬聖節糖果罐」/「兒童節 多色玩具堆」）。

### 3.4 跨軸成就系統 idea-to-impl 速度

v0.5/v0.6 預留 idea「跨軸 mixing-mode」自 GDD §5.5 提出（iter#208）→ iter#222 落地僅 14 cron 輪 / 落地後 ACCESSORY_AXIS map 自動延伸新軸（kawaii-decora 加入即觸發 4-軸 rainbow_collector 門檻達成更靠近）：

```
ACCESSORY_AXIS = {
  // 12 軸 26 條 mapping，新 accessory ship 必須加 1 條
  decora_clips: "kawaii_decora",  // iter#229 新增
  ...
};
appearanceAxes() / ownedAxes() → axis_mixer / rainbow_collector
```

**設計遺產**：跨軸成就系統不需 invasive cfg schema migration，hardcoded map 維護成本 < 30 件累積。配件數突破 30 後考慮 cfg.accessories.axis 顯式 field（iter#226 GDD §5.5 已記錄）。

### 3.5 美學軸 spectrum 完整 — minimalism ↔ kawaii-decora 直接對立

iter#229 kawaii-decora 起手填補 spectrum 缺口：

| 軸 | narrative DNA | 視覺語言 |
|----|--------------|--------|
| **minimalism** | 「不堆 / 留白 / single accent」 | 1 motif / 1 ✦ / 黃白雙色 |
| **kawaii-decora** | 「堆量 / 過度可愛 / many motifs」 | 5+ motifs / 3 ✦ 多色 / pastel rainbow 5 色 |

兩軸 design choice 5 處對稱（iter#229 SVG comment 已記錄）。**aesthetic spectrum 兩端完整**強化「choose your aesthetic axis」承諾的 freedom of expression — 玩家可自我選擇 minimalism 留白 / kawaii-decora 堆量 / 或 axis_mixer 跨軸混搭三種身份探索路徑。

### 3.6 lint chain 7 step + 8/8 smoke 30 cron 輪 0 P0 bug

自 iter#166 render regression 後連續 30 cron 輪 deploy gate 全綠：

- 7 step：syntax × 2 / sw-shell / assets / cfg-schema / i18n-shadow / i18n-coverage
- 8/8 smoke：init + render across all stages + final forms（vm sandbox 跑 8 scenarios）

**lint 防呆設計**有效：iter#147 i18n-shadow 防 t-shadow / iter#194 i18n-coverage 防 missing keys / iter#166 後 render smoke 防 runtime errors — 三件 ship 後 0 P0 bug 連續 cron 輪數逐漸延長。

---

## 4. v0.7+ 候選方向（iter#230 後排序）

### 4.1 即時 ROI（iter#230-235 內可完成）

1. **kawaii-decora 軸完成 ship**（iter#230-231 補 event + accessory 達軸成形 ≥ 3 件） — **本 retrospective 寫完即啟動**
2. **GDD §5.5 sync 11 → 12 軸**（iter#232 candidate，跟 iter#226 同 cadence 累積 5 件變動觸發 sync）
3. **kawaii-decora 第 1 個 seasonal**（iter#233+ candidate，補完飽和度 ★★★ → ★★★★，對標 iter#227-228 form-less seasonal mini-batch SOP）

### 4.2 中期 ROI（iter#236-249 內）

1. **派生 trait 第二例：minimalist「克制收藏家」**（reverse drifter，ownedAccessories ≤ 某閾值 + 高心情 streak） — 已多次列入候選但未啟動
2. **cottagecore / y2k 兩 form-less 軸補 form**（drifter 派生 SOP 複製到剩餘 form-less 軸）
3. **schema migration**（cfg.accessories.axis 顯式 field 取代 ACCESSORY_AXIS map）— 配件數 26 → 30+ 後啟動

### 4.3 長期方向（iter#250+）

1. **第 13-15 軸候選評估**：light academia / goblincore / regencycore — 11 軸後新軸 ROI 遞減，下一個應更謹慎評估
2. **content 池規模 30/30/30 milestone**：accessories / regular events / seasonal events 各破 30
3. **i18n 種子翻譯破 500 條**：目前 435 條，第 5 種語言起手 candidate
4. **iter#250 retrospective**：以 12 軸完整 + 派生 trait 多次成功 為素材

---

## 5. 設計原則 carry-forward

從 iter#210-229 累積到 v0.7+ 的可遵循原則：

1. **軸 ship pipeline 3 cron-輪 SOP**：accessory → event → accessory，每輪 5 touchpoints
2. **TA 軟化 SOP**：純風格軸（minimalism / dark academia 等冷色）必加 cream + corner pink dot 軟化
3. **軸 narrative 階梯感**：同軸 regular event 跟 seasonal event 不同情境（quill_pen 寫字當下 / gothic_candle 萬聖夜閱讀 / morning_coffee 日 ritual / new_year_dawn 年 ritual）
4. **跨軸成就自動延伸**：新 accessory ship 必加 ACCESSORY_AXIS map 1 條，不需動 axis_mixer / rainbow_collector 邏輯
5. **GDD §5.5 sync cadence**：每累積 5 件變動 OR 10-15 cron 輪同步一次（最近兩次 iter#221 + iter#226）
6. **lint chain 0 P0 bug 標準**：每輪必跑 7 step + 8/8 smoke，破 30 輪 0 P0 milestone 已達成
7. **iteration-log append-only**：新輪在最上方 + design rationale 完整留檔，方便 retrospective 抽出 case study

---

寫於 iter#230 / 12 美學軸完整收齊 / kawaii-decora 軸啟動 / 30 cron 輪 0 P0 bug。
