# iter#150-169 Retrospective — R-1 拆 IIFE 達標 + 美學軸 8 軸覆蓋成形

> 寫於 2026-04-30（iter#170）。配對 [`retrospective-150.md`](retrospective-150.md)（iter#135-149 共 15 輪）+ [`retrospective-130.md`](retrospective-130.md)（iter#100-134 共 35 輪）。
> 涵蓋 iter#150 milestone 後 20 輪累積。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **R-1 拆 IIFE 達標**：6 個 R-1 大塊抽出（shop / save / tick / interactions / menus / settings / render）+ 1 個 micro（save export-import 併入 save.js）→ game.js **1510 → 536（-974，64% 縮減）**，從 iter#100 起點 ~1990 算則是 **-1454 / 73% 縮減**。R-1 plan §1.4 目標 ~600-800 行 ✅ **達標**（536 < 600，比預期壓更狠）
- **i18n 第 15-17 批 + 三輪補洞**：種子翻譯 233 → **290 條** / locale（+57，含開設定 modal 整段、interactions 熱路徑、welcome-back body 多變數、naming dialog、evolve body）；functional sites 142 → ~190 處
- **v0.2「新進化分支」ship**：iter#156 加 gourmet form（feedCount >= 60）+ iter#157 補成就 form_gourmet + speech.form_gourmet 5 條 + collect_all 7→8 — GDD §10.2「新進化分支」項封閉，終態從 7 → 8
- **美學軸 8 軸地圖成形**：iter#159 chef_hat / iter#161 macaron / iter#167 strawberry_clip 把美食家軸從 1 → 5 件（最厚）；iter#168 智慧軸 + iter#169 balletcore event 各 +1，完成度地圖見 §3.4
- **Tools 投資**：deploy gate 5 → 6 step（i18n-shadow lint）+ syntax 涵蓋 7 → 23 src（自動掃 src/\*.js）；smoke test 在 iter#166 render 抽出時抓住 `$ is not defined` regression — iter#147 lint 投資 ROI 第二次兌現

---

## 2. iter#150-169 階段時序

| 輪次 | 主題 | 產出 / 影響 |
|------|------|------------|
| **iter#150** | retrospective-150 milestone | iter#135-149 共 15 輪 5 章總結 |
| **iter#151** | R-1 round shop | game.js -64（accessory shop 子系統） |
| **iter#152** | i18n 雙批 | welcome-back body 多變數 + shop.js 殘留 8 處 |
| **iter#153** | i18n 雙批 | openNameDialog 7 處 + finalizeForm body 4 變數插值 |
| **iter#154** | R-1 round save | game.js -62（save/load/migrate/defaultState） |
| **iter#155** | R-1 round tick | game.js -63（reconcileOffline + tickOnline） |
| **iter#156** | **v0.2 gourmet form** | 終態 7 → 8，新 trait feedCount，PNG 占位 + image-prompts §8.5 |
| **iter#157** | gourmet 收尾 | form_gourmet 成就 + speech 5 條 + collect_all 7→8 |
| **iter#158** | i18n 熱路徑批 | performInteraction + menuItemHTML + toggleSleep 9 keys |
| **iter#159** | 新配件 chef_hat | 美食家軸 accessory 層落地 |
| **iter#160** | R-1 round interactions | game.js -102（performInteraction + 6 helpers） |
| **iter#161** | 新事件 macaron | 美食家軸 event 層補完 |
| **iter#162** | R-1 round menus | game.js -147（4 個 dex-viewer modal） |
| **iter#163** | R-1 micro | save export/import 併入 save.js（-22） |
| **iter#164** | i18n 大批 | openSettingsMenu 41 keys × 2 locales = 82 條（單輪本 arc 最大） |
| **iter#165** | R-1 round settings | game.js -184（187 行單一函式抽出） |
| **iter#166** | **R-1 round render** | game.js **-330 史上最大降幅**；smoke 抓 `$ is not defined` regression；R-1 達標 ✅ |
| **iter#167** | 新配件 strawberry_clip | 美食家軸 5 件（最厚） |
| **iter#168** | 智慧軸對稱補完 | event-book + acc-glasses-thin（智慧軸從 1 → 3 件） |
| **iter#169** | balletcore 軸 event | rose_bouquet（balletcore 軸 2 → 3 件） |

---

## 3. 關鍵學習（iter#150-169）

### 3.1 R-1 大塊 vs micro：節奏選擇

**前 arc（iter#100-134）**：utils 抽出 5 micro-step（每輪 -10 ~ -20 行），game.js 1993 → 1955 / 5 輪 = 平均 -8 行 / 輪。
**iter#135-149**：子系統大塊 wave（wants / events / daily / idle / evolve / shop / save / tick），平均每輪 -65。
**本 arc（iter#150-169）**：大塊持續 + 第三波集中（interactions -102 / menus -147 / settings -184 / **render -330 史上最大**），平均每輪 -97 但 7 輪 R-1 集中 -918。

**轉折點觀察**：iter#163 save export/import 併入既有 save.js（不創新檔，-22 行）— 是「micro 進化版」做法，保留 module 邊界乾淨同時達抽出效果。下一輪繼續適用：openNameDialog (~34 行) 可以併進 menus.js 而非獨立 dialogs.js。

**節奏建議（給 R-1 後續）**：
- **大塊抽完後**進入 micro / merge 階段（小單元併進語意相近的既有模組）
- 每輪 1 個目標 — render -330 之後的 R-1 速度該降下來，避免 over-refactor
- bridge 表面積（NourishAPI export 數）成長到 17 — 已經到「合理上限」，下一階段重收斂而非擴張

### 3.2 P0 抓住 + 防線兌現

**iter#166 render 抽出**時，smoke test 立即抓 `$ is not defined at src/game.js:362` — 因為 `$` helper 在 render block 內，搬到 render.js 後 game.js init() 的 button bindings 找不到。修：在 game.js render-wrapper 區加回 `const $ = id => document.getElementById(id)`。

**這次抓 bug 的鏈條**：
1. iter#147 寫 `scripts/check-i18n-shadow.js` + 升級 syntax 從寫死 7 檔 → `for f in src/*.js` 動態
2. iter#166 render 抽出後第一次 `./scripts/run-checks.sh` 立即 exit 1
3. 看到 line 362 `$("btn-feed")` ReferenceError，5 秒內定位 / 修

**回饋迴路成立**：retrospective-150.md §3.2 記過「P0 連發 → lint 升級」這個模式可複製。本輪是 lint 投資的第二次 ROI 兌現（第一次是 iter#147 lint 立即 catch iter#106 / iter#146 同類 bug pattern）。

### 3.3 v0.2 feature pipeline 三階段成熟

**iter#156-157 ship gourmet 終態的鏈條**：
1. **iter#156 主結構**：cfg.finalForms.gourmet + cfg.petArt.adult.gourmet（PNG 占位）+ cfg.traitsDisplay 7 條（+feedCount）+ evolve.js trait priority chain + save.js defaultState pet.traits.feedCount + daily.js bumpHistory mirror bump + scripts/check-cfg-schema.js KNOWN_TRAITS 加 feedCount + docs/image-prompts.md §8.5
2. **iter#157 收尾**：form_gourmet 成就（cfg + i18n） + speech.form_gourmet 5 條 cottagecore 美食評鑑家口吻 + collect_all 7→8（cfg + i18n + onboarding.dex）
3. **iter#159 + #161 + #167**：accessory（chef_hat） + event（macaron） + accessory（strawberry_clip） — 美學軸三層完整覆蓋

**這個 pipeline 將來可複製給 v0.3 新終態**：
- Step 1 結構（cfg + trait + evolve）
- Step 2 收尾（成就 + speech + collect_all 升）
- Step 3 美學軸層（accessory + event 各 ≥ 1，圖好的話 2-3 件）

每個 step 約 1 cron 輪。完整新終態約 5-7 輪 ship 完。

### 3.4 美學軸 8 軸地圖（iter#169 結算）

| 軸 | event | form | accessory | 件數 | 飽和度 |
|----|-------|------|-----------|------|--------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 | ★★★★ |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar | 7 | ★★★★ |
| 智慧 / sage | book | sage | glasses_thin | 3 | ★★ |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 | ★★ |
| cleangirl | bubble | healthy | blush | 3 | ★★ |
| fairycore | — | divine | wings_fairy | 2 | ★ |
| y2k | — | — | star_clip / cd_pendant | 2 | ★ |
| 元氣 | rainbow | fighter | (party_hat?) | 2-3 | ★ |

**觀察**：
- **cottagecore + 美食家軸最深**：4 個 event + 3 個 accessory（cottagecore） / 2 + 2 + form（美食家）— 反映 TA 偏好（女性向粉嫩 / 療癒系）
- **fairycore + y2k 缺 event 層**：下一階段對稱補完 candidates
- **元氣軸混亂**：fighter form + party_hat 是同軸還是獨立 birthday celebration 軸？GDD 待釐清

**設計準則歸納**：每個美學軸至少 1 form + 1 accessory + 1 event = 3 件達「軸成形」。當前 8 軸中 4 個達標（美食家 / cottagecore / 智慧 / balletcore / cleangirl），4 個尚需 event（fairycore / y2k / 元氣 confirm 中）。

### 3.5 i18n 進度 vs 海外發行門檻

**前 arc 結束（iter#149）**：種子 233 / functional 142
**本 arc 結束（iter#169）**：種子 **290** / functional ~190

**主要進展批次**：
- iter#152：welcome-back body + shop.js（13 keys）
- iter#153：naming dialog + evolve body（8 keys）
- iter#157：gourmet 成就 / speech 配套（5 keys）
- iter#158：interactions 熱路徑（9 keys）
- iter#162：menus 模組抽出時保現有 i18n（0 加，但 functional 整套）
- iter#164：settings 大批（**+41 single-round biggest**）
- iter#168 / #169：accessories + event content content

**剩餘 i18n 殘留**（per retrospective-150.md §4.2 + 本 arc 結算）：
- ~~settings menu~~ ✅ iter#164
- ~~openNameDialog~~ ✅ iter#153
- ~~finalizeForm body~~ ✅ iter#153
- ~~showWelcomeBack body~~ ✅ iter#152
- ~~performInteraction / menus / shop~~ ✅
- **cfg-level 大批次（留 v0.3 海外發行階段）**：cfg.welcomeBack 5 條 tier.text + cfg.event.applyToast 14 條 + cfg.finalForms 8 條 desc + cfg.speech 46 個 pool ~230 條 + cfg.accessories 19 條 label fallback = **約 ~322 條 cfg-level 條目**
- 預估海外發行 i18n 工作量：1-2 個 sprint（每天 ~50 條翻譯 + review）

### 3.6 NourishAPI surface 收斂中？

**從 iter#100 → 本 arc 結束**：
- iter#100 起點：getState / save / render / toast / speak / grantCoin（4 export）
- iter#150：9 export
- iter#160 interactions：14 export（+5）
- iter#162 menus：14 export（+0 — 已有 bridge）
- iter#163 save micro：14 export（+0）
- iter#165 settings：17 export（+2 — applyReducedMotionPref + isDebug）
- iter#166 render：17 export（+0 — getLastPetSrc 改 delegate 不算新）

**趨勢**：iter#160-166 大塊抽出 7 輪累計只 +3 export。bridge 表面積成長明顯放慢，retrospective-150.md §3.5 預測「最終 game.js 600-800 行 orchestrator」+ 「bridge 表面積收斂」雙雙兌現。

### 3.7 工程紀律：smoke test 8 scenarios 防線分工

**smoke test 抓到的歷史 bug**（含本 arc）：
- iter#97 TDZ ReferenceError — render() 用 petImg 在 const 之前
- iter#101 fakeEl style.setProperty stub gap — 升級到 8 scenarios 立即抓
- iter#106 const t shadow（render 內 daily.tasks）
- **iter#166 `$` is not defined**（render 抽出 regression）

**smoke test 抓不到的 bug class**（仍是盲區）：
- modal callback 內的 callbacks（iter#106 / iter#146 都是這類，目前由 i18n-shadow lint 守）
- 互動序列（吃飯 → 換階段 → 進化）
- localStorage migration（schemaVersion bump）
- 跨 tab cross-tab read-only

**補強建議**：等更多 P0 從 modal 路徑跑出來，再投資 9th scenario（modal-heavy invocation）。短期 i18n-shadow lint 已蓋 t() 一族遮蔽。

---

## 4. 後續方向（iter#170+）

### 4.1 R-1 plan 收尾（細粒度）

| 候選 | LOC | ROI | 建議 |
|-----|-----|-----|------|
| openNameDialog | 34 | 低（單獨抽 module overhead 高） | 併進 menus.js |
| 餘下 game.js orchestrator | ~536 → ~480 | 低 | 不再壓榨 — 保留為 init / wireUp / button binding 編排層 |
| **NEW: 統合 r1-plan.md 寫 v2**（記錄 R-1 完成度）| docs work | 高 | 替 r1-plan.md 加 §「達標報告」 |

**判斷**：R-1 plan 從 iter#117 寫完到 iter#166 完成，**game.js 從 ~1990 → 536 行 / 22 模組 / 73% 縮減** — 不該再追指標，轉守。openNameDialog 併入 menus.js 是 1 個 cron 輪可結。之後 game.js 成 600 行以下 orchestrator，R-1 算正式完成。

### 4.2 美學軸補對稱（per §3.4 缺 event 表）

優先序（由 form 強度 + 軸現有件數推）：
1. **fairycore event** — divine form 已有 + wings_fairy + （月光 / 仙塵 / 露珠 event）
2. **y2k event** — 無 form 但有 2 accessory（star_clip / cd_pendant），event 補完使 y2k 成獨立完整軸
3. **元氣軸 confirm** — fighter form + party_hat 是同軸否？GDD §10.2 / §10.3 釐清

每個 ~1-2 cron 輪。

### 4.3 v0.2 / v0.3 feature pipeline

GDD §10.2 / §10.3 記事：
- ✅ 取名對話（已存在）
- ✅ 新進化分支（gourmet ship 完）
- ✅ 隨機事件（14 條 + 7 季節）
- ✅ 每日任務（feed/play/pet 三條 + 20 FC reward）
- ⏳ **GDD §10.3 elder companion** — idle.js 已有 form-specific elder speech，未做：時光紀念碑 UI / 元老成就 / 跨 pet memory thread
- ⏳ **季節事件擴增**：5 月 Mother's Day / 端午 / Pride Month
- ⏳ **新 final form**：v0.3 候選 — 比 gourmet 更難（feedCount > 100? perfectStreak 不到 divine 但 > 1000?）

### 4.4 i18n cfg-level 海外批次（v0.3 海外發行 prerequisite）

~322 條 cfg-level 翻譯 — 一次 batch 比累積補強好。建議：
- 一個 cron arc（10-15 輪）專做 i18n cfg-level
- 走 iter#136-137 那種「先抽 labelKey + label fallback」雙欄位策略
- speech 46 pool 翻譯難度最高（角色 voice 細節）

### 4.5 工程紀律觀察

**「P0 → lint」反饋迴路第二次成功**（iter#106 → iter#147 → iter#166 抓 `$` regression）。這個模式確立為 SOP：
1. 抓到 P0
2. 同 arc 內升級 lint 永久守
3. 後續抽出 / 改動 立即得 ROI

**bridge surface 收斂趨勢健康**：iter#160-166 七輪 +3 export — 預期下一階段（micro / merge）會更小。

---

## 5. 數字總結

| 指標 | iter#150 開始 | iter#170 結束 | 變化 |
|------|--------------|--------------|------|
| `src/game.js` LOC | 1510 | **536** | **-974** |
| 2000 警戒線 buffer | 490 | **1464** | +974 |
| `src/*.js` 模組數 | 16 | **23** | +7（shop / save / tick / interactions / menus / settings / render） |
| NourishAPI export | 14 | 17 | +3（applyReducedMotionPref / isDebug / getLastPetSrc 改 delegate） |
| Deploy gate step | 6 | 6 | +0 |
| Syntax `--check` 涵蓋檔 | 16 | 23 | +7 |
| i18n 種子翻譯 / locale | 233 | **290** | +57 |
| i18n functional sites | 142 | ~190 | +48 |
| cfg.accessories | 16 | **19** | +3（chef_hat / strawberry_clip / glasses_thin） |
| cfg.randomEvents.pool | 11 | **14** | +3（macaron / book / rose_bouquet） |
| cfg.finalForms | 7 | **8** | +1（gourmet） |
| cfg.traitsDisplay | 6 | **7** | +1（feedCount） |
| cfg.speech pool | 46 | **47** | +1（form_gourmet） |
| cfg.achievements | 25 | **26** | +1（form_gourmet） |
| `assets/svg/*.svg` | 31 | **35** | +4（chef_hat / strawberry_clip / glasses_thin / event-macaron / event-book / event-rose-bouquet — 6 新但有些已被 cfg 內統計） |
| check-assets total paths | 73 | **79** | +6 |
| P0 bug 抓修 | 2（iter#146 t-shadow ×2） | **3**（含 iter#166 `$` regression） | +1 |
| Lint script | 6（含 i18n-shadow） | **6** | +0（穩定） |

**game.js 從 iter#100 起點 ~1990 → 536（73% 縮減 / 22 R-1 輪 / 70 cron 總輪）**

---

> 下一份 retrospective 預計在 iter#190 / iter#200 — 等 fairycore + y2k 軸補完 / R-1 收尾 openNameDialog 後 / GDD §10.3 elder companion 推進。
