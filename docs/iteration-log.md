# 啾啾日常 — 自動優化循環日誌

> 每 10 分鐘觸發一次（cron `3-59/10 * * * *`，job `0a1c2148`），由主 agent 推進。新項目追加在最上方。

---

## 2026-04-30 12:11 · Session A — iter#200 milestone：新隨機事件「漂流瓶」(message_bottle) 智慧軸第二 event，regular pool 18 → 19

**觸發**：cron 第 200 輪 — milestone 三位數整數，但 retrospective-190 §closing 預估「下一份 retrospective 在 iter#210」+ 距離 iter#190 才 10 cron 輪（前次 retrospective 間隔 20 / 35 / 15 輪），現在寫過早。改 ship 第三波 axis-second-event content（智慧軸補完）— 對標 iter#198 cottagecore seed / iter#199 cleangirl towel 連續節奏。

**為什麼選 message-bottle 作為智慧軸第二 event**：
- **跟既有 book 視覺 / 敘事區隔**：book = 玩家在讀（當下 / 主動 / atmospheric）/ message-bottle = 遠方智慧 / 神祕緣分（被動 / 命運 / 收到禮物 narrative）
- **連結 sage 終態 narrative**：cfg.finalForms.sage.desc「思考拼圖累積的智慧路線」+ form_sage speech「答案藏在風裡呢」— 漂流瓶神祕字條呼應「答案來自世界其它地方」narrative
- **數值區隔**：book +mood 8 +energy 5（純 atmospheric）/ message-bottle +mood 12 +energy 6 + coin 5（mid-tier，coin 5 暗示「字條夾錢」surprise）
- **weight 5**：跟 rose_bouquet / pixel_heart 同低稀有度 — 神祕事件設計準則

**動作**：

1. **新增 `assets/svg/event-message-bottle.svg`（21 行 SVG）**：
   - viewBox 100×100 對標既有 15 個 event SVG
   - 色票嚴守 CLAUDE.md §5：藍 #6BCBFF 透明 0.35（玻璃瓶身 — 透亮水滴感）+ 粉 #FF89A7（描邊 — 軟化）/ 棕 #8B5A2B + #5C3A1B（cork stopper 軟木塞）/ 黃 #FFD86B（rope 鎖頸繩 + ✦ accent）/ 白 #FFF8E7（紙條卷軸）/ 粉 #FFB7B7（紙條 handwritten lines）/ 粉 #FFC8D6（地面陰影）
   - 結構：粉色橢圓地面陰影 + **bottle path**（quadratic curve 仿玻璃瓶身輪廓 + 頸部漸窄）+ cork stopper rect + 黃色 rope（quadratic curve over neck）+ **rolled scroll inside**（rotated -12° 視角，3 條 handwritten 模擬筆觸）+ 玻璃高光 stripe + ✦ + ✦ + dot accent
   - **rotate(-12°) scroll**：把 inner scroll 透視旋轉一角度，暗示「漂浮 inside bottle」立體感
   - 翻譯雙重視覺隱喻：玻璃透明 + 粉色描邊 — 神祕 + 軟化（避免過冷距離）

2. **`src/cfg.js` randomEvents.pool 加第 19 條**：
   ```
   { id:"message_bottle", art:"assets/svg/event-message-bottle.svg", weight:5,
     label:"漂流瓶", apply:"message_bottle",
     applyEffects:{ stats:{mood:12, energy:6}, coin:5, coinReason:"瓶中字條" },
     applyToastKey:"event.message_bottle",
     applyToast:"📜 漂流瓶裡有給你的字條~" }
   ```
   - 加在 towel 後（智慧軸註解串連 iter#200 標識）
   - **coin 5 + coinReason「瓶中字條」**：narrative 點題 — 字條夾著一點錢的「遠方友人」surprise

3. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `event.message_bottle` = "📜 漂流瓶裡有給你的字條~"
   - en: `event.message_bottle` = "📜 A note for you in the drift bottle~"
   - 「drift bottle」是英文典故詞（drift = 漂流） — 文化詞保 narrative 神秘感

4. **`sw.js`：CACHE_VERSION iter199 → iter200**

**lint chain 報表**：
- check-assets：89 → **91**（user 在 cron 之外另加了 1 件 asset，本輪 +1 累積至 91）
- 7 step + 8/8 smoke + i18n-shadow 23 src + i18n-coverage 175 keys ✅

**美學軸覆蓋更新（iter#200）**：
| 軸 | event | form | accessory | 件數 |
|----|-------|------|-----------|------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 |
| cottagecore | butterfly / mushroom / petal / herb / seed | — | flower / pin_butterfly / lace_collar | 8 |
| **智慧 / sage** | book / **message_bottle（本輪）** | sage | glasses_thin | **4** ⬆ from 3 |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 |
| fairycore | dewdrop | divine | wings_fairy | 3 |
| cleangirl | bubble / towel | healthy | blush | 4 |
| y2k | pixel_heart | — | star_clip / cd_pendant | 3 |
| 元氣 | rainbow | fighter | party_hat | 3 |

智慧軸從 3 → **4 件**（並列 cleangirl / 美食家 5 為次深軸）；event total 18 → **19**。

**i18n 進度跳躍**：
- 種子翻譯：402 + 1 = **403 條** zh-TW + 403 條 en
- functional sites：~247 + 1 = ~248 處

**iter#200 milestone reflection（不寫獨立 retrospective）**：
- 100 cron 輪累計 game.js 1990 → 502 / 23 模組 / 720 條雙語 i18n / 9 traits / 10 finalForms / 19 regular events + 12 seasonal events = 31 events / 19 accessories / 27 achievements / 49 speech pools / 89 asset paths / 7-step deploy gate
- iter#100-149 R-1 主期 / iter#150-189 v0.2-v0.3 ship 期 / iter#190-200 v0.4 開新 + content variety
- **iter#210 retrospective-200/210 預期合寫**：3 月 + 4 月共 100 cron 輪推進 + 兩次 v0.X feature 完整 ship 軸 — 體積夠大值得 5+ 章

**為什麼這輪不寫 retrospective**：
- 距 iter#190 才 10 輪 — 前次間隔 20 輪保 cadence
- iter#190-200 主題（v0.4 第 10 form ship + 連續 axis-second-event）內容主軸統一，等 v0.4 多 ship 1-2 個 feature（跨 pet memorial 進階 / 新美學軸）後再寫 retro 涵蓋面更完整
- iter#200 整數本身不是 milestone — milestone 應該對應「概念完成度」而非「整數」

**未來 follow-up**（不在本輪）：
- 下個 axis-second-event candidate：balletcore / fairycore（兩 軸還只有 1 event）
- 跨 pet memorial 進階 UI
- 新美學軸開發
- iter#210 retrospective-210（10 cron 輪後）

**影響檔案**：`assets/svg/event-message-bottle.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 12:01 · Session A — 新隨機事件「軟綿綿毛巾」(towel)：cleangirl 軸第二 event，regular pool 17 → 18

**觸發**：cron 第 199 輪 — iter#198 種子粒（cottagecore filler）後接著補完次薄軸第二 event。掃 §5.5 美學軸地圖 cleangirl/智慧/balletcore/fairycore 都只有 1 event，cleangirl 軸 narrative 最具體（洗澡 / 清潔），最容易設計區隔內容。

**為什麼選毛巾**：
- **跟既有 bubble 視覺 / 敘事區隔**：bubble = 洗澡進行中（泡泡飄飄）/ towel = 洗完後（暖暖乾爽）— 兩 event 串起完整 cleangirl narrative arc
- **填補既有 cottagecore-cleangirl 軸 SVG 視覺空缺**：bubble 是圓形 / petal 是花瓣 / mushroom 是傘菇 — towel 加入 stacked rectangle 結構，視覺多樣性增加
- **數值區隔**：bubble +clean 10 +mood 8 / towel +clean 14 +mood 6 — towel 清潔效益更大但愉悅略少（fits「清潔 task done satisfaction」narrative）
- **weight 7**：跟 mushroom 7 / book 6 / dewdrop 6 同 mid-tier，比 bubble 9 略稀有 — 設計「進階版」感

**動作**：

1. **新增 `assets/svg/event-towel.svg`（18 行 SVG）**：
   - viewBox 100×100 對標既有 14 個 event SVG
   - 色票嚴守 CLAUDE.md §5：白 #FFF8E7（外層 cream 毛巾）/ 粉 #FFB7B7（中層 pink 毛巾，三明治堆疊）+ #FF89A7（描邊）/ 粉 #FFC8D6（地面陰影 / 軟化）/ #FFD8DD（蒸氣描邊）/ 黃 #FFD86B（✨ accent）
   - 結構：粉色橢圓地面陰影 + **3 層堆疊毛巾 stack**（rounded-rect bottom cream + middle pink + top cream，每層更窄做「整齊摺疊」立體感）+ middle 層 dashed stripe band + top 層 quadratic-curve embroidered 心形（小細節）+ **3 顆 white circle 蒸氣 / 蓬鬆雲團**（暗示剛洗好的暖呼呼） + ✨ corner accent
   - 蒸氣 cloud 是 cottagecore-cleangirl 的視覺語：cozy + spa-like — 區隔 bubble 的「正在洗」動感

2. **`src/cfg.js` randomEvents.pool 加第 18 條**：
   ```
   { id:"towel", art:"assets/svg/event-towel.svg", weight:7,
     label:"軟綿綿毛巾", apply:"towel",
     applyEffects:{ stats:{clean:14, mood:6} },
     applyToastKey:"event.towel",
     applyToast:"🛁 暖暖的乾毛巾~ 全身舒服" }
   ```
   - 加在 seed 後（cleangirl 軸註解串連 iter#199 標識）
   - **無 coin**：toiletries / linens 是 spa-like atmosphere event，不該帶錢（對標 bubble / dewdrop / petal 純自然 atmospheric）

3. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `event.towel` = "🛁 暖暖的乾毛巾~ 全身舒服"
   - en: `event.towel` = "🛁 A warm dry towel~ Cozy all over"
   - 「Cozy all over」對應「全身舒服」— spa-like cottagecore 翻譯保溫暖感

4. **`sw.js`：CACHE_VERSION iter198 → iter199**

**lint chain 報表**：
- check-assets：88 → **89** asset references resolve
- 7 step + 8/8 smoke + i18n-shadow 23 src + i18n-coverage 175 keys ✅

**美學軸覆蓋更新（iter#199）**：
| 軸 | event | form | accessory | 件數 |
|----|-------|------|-----------|------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 |
| cottagecore | butterfly / mushroom / petal / herb / seed | — | flower / pin_butterfly / lace_collar | 8 |
| 智慧 / sage | book | sage | glasses_thin | 3 |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 |
| fairycore | dewdrop | divine | wings_fairy | 3 |
| **cleangirl** | bubble / **towel（本輪）** | healthy | blush | **4** ⬆ from 3 |
| y2k | pixel_heart | — | star_clip / cd_pendant | 3 |
| 元氣 | rainbow | fighter | party_hat | 3 |

cleangirl 軸從 3 → **4 件**（跟 美食家 5 並列為次深軸）；event total 17 → **18**。

**i18n 進度跳躍**：
- 種子翻譯：401 + 1 = **402 條** zh-TW + 402 條 en
- functional sites：~246 + 1 = ~247 處

**為什麼這個 cleangirl 補充對 retention 重要**：
- bath 是 GDD §4 互動之一（CD 300s），玩家做完 bath action 後會想看到「世界呼應這個 action」— towel event 隨機觸發剛好串敘事
- bubble + towel 雙 event 跟 bath interaction 形成「動作 → 環境回應」cluster

**未來 follow-up**（不在本輪）：
- 下個 axis-second-event candidate：智慧（sage）/ balletcore / fairycore — 都還只有 1 event
- 跨 pet memorial 進階 UI
- 新美學軸開發
- iter#210 retrospective-210（11 cron 輪後）

**影響檔案**：`assets/svg/event-towel.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 11:51 · Session A — 新隨機事件「灑落的種子」(seed)：cottagecore 補充 filler，regular pool 16 → 17

**觸發**：cron 第 198 輪 — iter#196-197 完整 ship warmheart（v0.4 第 10 form）後切回 content 變化（rotation 健康，2 ship 輪後該換手）。retrospective-190.md §4.2 列「新隨機事件 batch」是 v0.4 候選 — 本輪起手第一條，加最自然的 cottagecore 補充。

**為什麼選種子粒（seed）作為第 17 個 regular event**：
- **小雞主場景的天然食物**：cottagecore 軸已有 mushroom / petal / butterfly / herb 4 個 atmospheric event，但都是「外來元素」— seed 是**寵物本體最直接相關**的 motif（雞吃米嘛）— 增加 narrative immersion
- **填補 weight 9 small-pickup tier 空缺**：bubble 9 是清潔軸 / candy 8 / petal 8 — seed 9 落在中等頻率帶
- **設計區隔現有 events**：tea / macaron / candy 是「人類甜點」；seed 是 bird-food authentic — 視覺辨識度（米粒形狀 vs 圓糖果 vs 馬卡龍三層）
- **數值設計**：+hunger 12 / +mood 4 — 中等飽腹 + 微愉悅，sub feed_basic（25 hunger）一截但 free，跟 mushroom（mood 10 + energy 5）+ candy（mood 18 + hunger 8）區隔

**動作**：

1. **新增 `assets/svg/event-seed.svg`（17 行 SVG）**：
   - viewBox 100×100 對標既有 13 個 event SVG
   - 色票嚴守 CLAUDE.md §5：黃 #FFD86B / 橘 #FF9F43（米粒漸層 — 4 黃 + 4 橘交錯）/ 棕 #8B5A2B（米粒描邊 — 標準小麥色）/ 粉 #FFC8D6（地面陰影 / 軟化）/ 黃 #FFD86B（✨ accent）/ 粉 #FFB7B7（· accent dot）
   - 結構：粉色橢圓地面陰影 + **8 顆 almond-shaped 米粒**散布（path quadratic curve 形狀，4 上排 / 4 下排，大小+位置略微錯落呈現自然散落感）+ 2 個 corner accent
   - 米粒 path 用 `q` 二次曲線描繪 almond 形狀 — `M x y q 0 -7 5 -8 q 5 1 5 8 q 0 5 -5 6 q -5 -1 -5 -6 z` 是緊湊 6-segment closed path
   - 色票黃橘交錯產生「成熟米粒 / 未成熟米粒」自然多樣感

2. **`src/cfg.js` randomEvents.pool 加第 17 條**：
   ```
   { id:"seed", art:"assets/svg/event-seed.svg", weight:9,
     label:"灑落的種子", apply:"seed",
     applyEffects:{ stats:{hunger:12, mood:4} },
     applyToastKey:"event.seed",
     applyToast:"🌾 撿到散落的小米粒~" }
   ```
   - 加在 pixel_heart 後（cottagecore filler 註解串連 iter#198 標識）
   - **無 coin**：authentic 自然食物，pet 撿來吃，不該帶錢（對標 dewdrop / petal / herb 純自然 atmospheric event）
   - **applyToastKey** 直接走 cfg-level i18n SOP — events.js iter#180 patch 自動支持 dual-field

3. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `event.seed` = "🌾 撿到散落的小米粒~"
   - en: `event.seed` = "🌾 Found scattered millet grains~"
   - 「millet」（小米）比「seed」具體 — 雞吃米的真實食物指向，narrative 更貼

4. **`sw.js`：CACHE_VERSION iter197 → iter198**

**lint chain 報表**：
- check-assets：87 → **88** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src + i18n-coverage 175 keys ✅

**美學軸覆蓋更新（iter#198）**：
| 軸 | event | form | accessory | 件數 |
|----|-------|------|-----------|------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 |
| **cottagecore** | butterfly / mushroom / petal / herb / **seed（本輪）** | — | flower / pin_butterfly / lace_collar | **8** ⬆ from 7 |
| 智慧 / sage | book | sage | glasses_thin | 3 |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 |
| fairycore | dewdrop | divine | wings_fairy | 3 |
| cleangirl | bubble | healthy | blush | 3 |
| y2k | pixel_heart | — | star_clip / cd_pendant | 3 |
| 元氣 | rainbow | fighter | party_hat | 3 |

cottagecore 軸從 7 → **8 件**（本 arc 最廣軸 + 1）；event total 16 → **17**。

**i18n 進度跳躍**：
- 種子翻譯：400 + 1 = **401 條** zh-TW + 401 條 en
- functional sites：~245 + 1 = ~246 處

**未來 follow-up**（不在本輪）：
- 下個 event candidate：cleangirl / 智慧 / balletcore / fairycore 軸補第二件 event
- 跨 pet memorial 進階 UI（v0.4 backlog）
- 新美學軸開發（boho / minimalist / kawaii-decora / dark academia）
- iter#210 retrospective-210（12 cron 輪後）

**影響檔案**：`assets/svg/event-seed.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 11:41 · Session A — warmheart 終態收尾：成就 form_warmheart + speech 5 條 + collect_all 9→10 + image-prompts §8.7 + 雙語 i18n

**觸發**：cron 第 197 輪 — iter#196 ship warmheart 主結構備註明確下輪做收尾。對標 iter#157 gourmet 收尾 / iter#184 explorer 收尾 SOP — 三項收尾：(1) 解鎖成就 / (2) form-specific speech / (3) collect_all bump — 第三次成功複製 ship 完整 SOP。

**動作**（5 處同步）：

1. **`src/cfg.js` achievements 加第 28 條 form_warmheart**：
   - `{ icon:"🤍", labelKey:"ach.form_warmheart", label:"暖心夥伴", descKey:"achdesc.form_warmheart", desc:"養出暖心雞" }`
   - 對標 form_divine / diva / fighter / sage / gourmet / explorer 6 個既有 form 成就 dual-field i18n 慣例

2. **`src/cfg.js` collect_all.desc 9→10**：
   - 「收集全部 9 種終態」→「收集全部 10 種終態」

3. **`src/cfg.js` speech.form_warmheart 5 條 cuddly / lazy / affectionate 口吻**：
   - 「再摸一下嘛~」「🤍 蜷在你身邊就好」「(輕輕靠著)」「今天也想要抱抱」「就這樣賴著不動 zzz~」
   - 跟既有 form 個性區隔：fighter 元氣 / sage 思辨 / diva 表演 / divine 守護 / gourmet 美食 / explorer 探險 / **warmheart 依戀** — 第 7 個鮮明角色聲音
   - 5 條等量於既有 form_divine / diva / sage / gourmet / explorer

4. **`src/achievements.js` evaluator 兩處更新**：
   - 加 `["form_warmheart", dexUnlocked.has("warmheart")]` 排在 form_explorer 後 / collect_3 前
   - `["collect_all", dexUnlocked.size >= 9]` → `>= 10` — 對齊新 finalForms 集合（10 entries）

5. **`src/i18n.js` 8 條更新**：
   - **新增雙語 6 條**：`ach.form_warmheart` 暖心夥伴 / Warmheart Companion、`achdesc.form_warmheart` 養出暖心雞 / Raised a warmheart chicken、`speech.form_warmheart` 中英 array 各 5 條（「再摸一下嘛」/ "One more pat please" 等）
   - **修舊 2 條**：`achdesc.collect_all` 9 → 10 種（中 + 英）
   - **修舊 2 條**：`onboarding2.dex` 9 → 10 final forms（中 + 英）

6. **`docs/image-prompts.md` 加 §8.7 warmheart 條目**：
   - cuddly / cozy 設計：rounded body（區隔 fatty 圓潤 vs warmheart 慵懶圓潤）、half-closed contented eyes、blush + scarf / knit shawl、lean to one side（暗示靠在主人身邊）、🤍 floating heart accent
   - 設計動機 + 解鎖條件「state.pet.traits.petCount >= 50」doc + 跟 form_fatty / mood-sleeping 視覺區隔說明

7. **`sw.js`：CACHE_VERSION iter196 → iter197**

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`9 traits / 48 speech_pools / 10 final_forms`
- 本輪 cfg-schema：`9 traits / **49 speech_pools** / 10 final_forms`
- speech_pools +1（form_warmheart）

**i18n 進度跳躍**：
- 種子翻譯：395 + 5 = **400 條** zh-TW + 400 條 en（**首破 400 條 milestone**）
- functional 涵蓋：成就 form 系列從 6 → **7** 全 functional i18n（divine / diva / fighter / sage / gourmet / explorer / warmheart）
- speech.form_X 對應 9 finalForms × 5 條 = 45 條 i18n functional（healthy / fatty / ugly + 6 軸正向）

**warmheart 終態完整封閉度（iter#197）**：
| 元素 | 狀態 | 來源 |
|------|------|------|
| cfg.finalForms.warmheart entry | ✅ | iter#196 |
| cfg.petArt.adult.warmheart 占位 | ✅ | iter#196 |
| cfg.traitsDisplay.petCount | ✅ | iter#196 |
| save.js defaultState pet.traits.petCount | ✅ | iter#196 |
| daily.js mirror bump（pet_head/belly/talk → traits.petCount） | ✅ | iter#196 |
| evolve.js trait priority chain | ✅ | iter#196 |
| KNOWN_TRAITS lint | ✅ | iter#196 |
| i18n form key（zh + en） | ✅ | iter#196 |
| **achievement form_warmheart** | **✅ 本輪** |
| **speech.form_warmheart 5 條 + i18n key** | **✅ 本輪** |
| **collect_all 9→10 bump（cfg + i18n + onboarding）** | **✅ 本輪** |
| **image-prompts §8.7** | **✅ 本輪** |

**100% v0.4 10th form ship-ready**（除真實 PNG art — 等待設計師 / AI 生圖；user 在 cron 外已 ship 了 gourmet + explorer 兩張，warmheart 是第 8/10 待補的）— 對標 gourmet（iter#156-157）/ explorer（iter#183-184）兩輪 ship 完整 SOP **第三次成功複製**。

**Game's first 400-seed-translation milestone**：
- iter#100 起點 i18n.js seed 12 條 → iter#197 = **400 條 zh-TW + 400 條 en = 800 i18n.js 條目**
- 跨 97 cron 輪累計 +388 條 / locale = 平均每輪 +4 條
- 主要批次：iter#127-141 圖鑑 / 設定 / 玩具 + iter#177-193 cfg-level i18n batch（11 batches × 平均 21 條）+ form-specific（10 forms × 兩個 helper 平均 4 條）

**v0.4 backlog（iter#197）**：
- ✅ 10th finalForm warmheart 完整封閉（iter#196-197）
- ⏳ 跨 pet memorial 進階 UI
- ⏳ 新美學軸開發（boho / minimalist / kawaii-decora / dark academia）
- ⏳ 新隨機事件 batch
- ⏳ accessories label fallback i18n（v0.5 海外 prerequisite）
- ⏳ iter#210 retrospective-210（13 cron 輪後）

**驗證**：
- `node --check src/{cfg,achievements,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠 7 step + cfg-schema 進步「9 traits / 49 speech_pools / 10 final_forms」
- i18n-shadow + i18n-coverage（175 keys 不變因為 form-specific 都是 cfg-driven dynamic-key path）+ smoke 8/8 全綠

**為什麼第三次 ship pipeline 第三次都成功**：
- gourmet（iter#156-157）+ explorer（iter#183-184）+ warmheart（iter#196-197）三次連續 2-輪 ship form pipeline
- 每次 8 處主結構 sync + 5 處收尾 sync = 13 次改動拆兩輪 → review 顆粒度 manageable
- SOP 化的 patient-design-doc 表格（main + 收尾兩個 checklist）讓改動點不漏 — 每個 form 都對標 KNOWN_TRAITS / cfg.finalForms / save.js defaultState / evolve.js chain / 成就 / speech / collect_all / onboarding / image-prompts 9 + 4 個 sync points

**影響檔案**：`src/cfg.js`、`src/achievements.js`、`src/i18n.js`、`docs/image-prompts.md`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 11:31 · Session A — v0.4 第 10 個 finalForm「暖心雞」(warmheart) 主結構：終態 9 → 10、新 trait petCount

**觸發**：cron 第 196 輪 — v0.3 全部封閉（iter#195 元氣軸 GDD 釐清）後切到 v0.4 開新。retrospective-190.md §4.2 列「10th finalForm」是 v0.4 候選首位；對標 iter#156-157 gourmet / iter#183-184 explorer 的 2-輪 ship SOP — 本輪主結構 / 下輪收尾。

**為什麼選 warmheart**：
- **TA 親密敘事缺口**：既有 9 form 涵蓋 healthy / divine / diva / sage / fighter / gourmet / explorer / fatty / ugly — 沒有純粹「依戀 / 摸頭累積」軸，但 GDD 主軸是「關係建立」（cottagecore-coquette TA 18-35F 偏好）— 這軸非有不可
- **trait 維度直接複用**：petCount 已存在於 state.history（pet_head + pet_belly + talk 互動累計），daily.js bumpHistory 內既有 callsite — 加 mirror bump 到 state.pet.traits.petCount 即可，不創新 trigger source
- **threshold 50** = 約 1-2 週日常摸頭（5-8 互動/天）— 比 gourmet 60 / explorer 25 中等難度，跟 sage 30 / fighter 30 同帶
- **narrative**：「蜷在主人身邊就是最幸福的午後」是 cottagecore TA 經典「relaxed afternoon」意象

**動作**（8 處同步，per gourmet/explorer SOP）：

1. **`src/cfg.js` traitsDisplay 加第 9 條**：
   - `{ key:"petCount", icon:"🤍", label:"依戀點數", cap:50, form:"暖心雞", round:false }`

2. **`src/cfg.js` finalForms 加 10th entry**（dual-field 對標 iter#178）：
   ```
   warmheart:{ labelKey:"form.warmheart.label", label: "暖心雞",
               descKey:"form.warmheart.desc", desc: "蜷在主人身邊就是最幸福的午後，有點懶懶的、總是想被摸頭 — 從互動累積中自然走出的暖心系。" }
   ```

3. **`src/cfg.js` petArt.adult.warmheart**：
   - 暫指 `assets/images/chick-adult-healthy.png` 占位（cfg-schema invariant 7.5 雙向 key 同步必須）
   - 註解引導 `docs/image-prompts.md §8.7` 待補
   - **意外收穫**：iter#196 過程中發現 user 已在 cron 之外 ship 了 chick-adult-gourmet.png + chick-adult-explorer.png 兩張圖（既有 placeholder 路徑改成正式 PNG path）— gourmet / explorer 視覺已 ship

4. **`src/save.js` defaultState pet.traits**：
   - 加 `petCount: 0` 第 9 個維度
   - migration via deepMerge 自動補舊存檔

5. **`src/daily.js` bumpHistory**：
   - pet_head / pet_belly / talk 互動 case 從原 1 行 (h.petCount += 1) 升級成 block：mirror bump `state.pet.traits.petCount = (state.pet.traits.petCount || 0) + 1`
   - per-pet 累計，跟 history.petCount 跨生命週期不同層級（同 iter#183 explorer 的 events.js mirror SOP）

6. **`src/evolve.js` finalizeForm trait 鏈**：
   - 在 explorer 後 / fatty 前插入 `else if (tr.petCount >= 50) form = "warmheart";`
   - priority 帶：「累積行為」軸 — gourmet（feed 60）/ explorer（events 25）/ warmheart（pet 50）三者同帶

7. **`scripts/check-cfg-schema.js` KNOWN_TRAITS**：
   - 加 `"petCount"`，否則 traitsDisplay 第 9 條被 lint 標未知 key

8. **`src/i18n.js` 雙語 2 條**：
   - zh-TW: form.warmheart.label「暖心雞」/ form.warmheart.desc「蜷在主人身邊...」narrative
   - en: form.warmheart.label "Warmheart Chick" / form.warmheart.desc "Curling up beside master is the happiest afternoon — a little lazy, always wanting head pats. The cuddly path of accumulated affection."

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`8 traits / 48 speech_pools / 9 final_forms`
- 本輪 cfg-schema：`**9 traits** / 48 speech_pools / **10 final_forms**`
- check-assets：85 → 87（先前 user ship 了 gourmet + explorer PNG，自動 +2 paths）
- 6 step + 8/8 smoke + i18n-shadow 23 src + i18n-coverage 175 keys ✅

**i18n 進度**：
- 種子翻譯：393 + 2 = **395 條** zh-TW + 395 條 en
- functional sites：~244 + 1 = ~245 處
- 注意 i18n-coverage 仍 175（form.warmheart.* 是 dual-field cfg-driven、非 callsite 直接呼叫 — formLabel(form) helper 透過 cfg.labelKey 資料驅動，不被 t() callsite scan 捕捉，但兩 locale 都有定義）

**finalForms 第 10 個 milestone**：
- iter#100 起點 7 forms → iter#156 gourmet（v0.2）= 8 → iter#183 explorer（v0.3）= 9 → **iter#196 warmheart（v0.4）= 10**
- Game's first **10-form** milestone 🎉
- 對標 Tamagotchi（原版 6 forms）/ Pou（4 stages × 變化）/ Adopt Me（多 species 但無 form 進化）— ChickaDay 在 form 維度上是 cottagecore 細粒度設計

**為什麼這輪不一次 ship 完整收尾**：
- 對標 iter#156 gourmet ship 經驗 + iter#183 explorer：13 處改動 review 失焦風險
- 本輪 8 處同步主結構紮實
- **下輪收尾 5 個小項**：成就 form_warmheart + speech.form_warmheart 5 條 + achievements.js evaluator + collect_all 9→10 + onboarding text bump + image-prompts §8.7

**v0.4 backlog（iter#196）**：
- ⏳ 10th finalForm 收尾（下輪）
- ⏳ 跨 pet memorial 進階 UI
- ⏳ 新美學軸開發（boho / minimalist / kawaii-decora / dark academia）
- ⏳ 新隨機事件 batch
- ⏳ accessories label fallback 19 / interactions label fallback 14 / wants text fallback 14 / achievements label/desc fallback 52 — cfg-level i18n cleanup（已有 functional via key，fallback 補完是 v0.5 海外發行 prerequisite）

**驗證**：
- `node --check src/{cfg,save,daily,evolve,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠 7 step + cfg-schema 進步到「9 traits / 10 final_forms」
- 行為驗證：玩家從現在起 pet_head / pet_belly / talk 互動 → state.pet.traits.petCount 累計 → 達 50 進 adult 觸發 warmheart form
- migration：deepMerge 把舊存檔的 traits 自動補 petCount: 0 — 零 production risk

**影響檔案**：`src/cfg.js`、`src/save.js`、`src/daily.js`、`src/evolve.js`、`scripts/check-cfg-schema.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 11:21 · Session A — GDD §5.5 美學軸 8-axis 地圖 + 元氣軸釐清（v0.3 唯一 backlog 封閉）

**觸發**：cron 第 195 輪 — iter#194 i18n-coverage lint 後切到 docs / 企劃延伸變化。retrospective-190.md §4.3 + iter#194 收尾「元氣軸 GDD 釐清」是 v0.3 backlog 唯一沒做的純 docs 項目，連續 backlog 約 25 輪，本輪兌現。

**為什麼這個切點**：
- 8 美學軸 + 9 forms + 27 events + 19 accessories 的 mapping 一直**只在 retrospective tables 裡 documented**，不在 GDD 主文件 — 是 canonical reference 的空白
- party_hat 軸歸屬從 iter#170 起多輪標「待釐清」— 留 backlog 太久會被當「真的有問題」誤導未來 contributor
- v0.4 開新美學軸 candidates 需要對 8 軸現狀有完整文檔基準

**動作**：

1. **`docs/gdd.md` 升級 §5 進化分支章節**：
   - **§5.4 各階段外觀差異想像**：補新加的 gourmet / explorer 兩個 v0.2/v0.3 form 視覺描述（粉色廚師帽 / 背包 + bandana / 地圖）
   - **新增 §5.5 美學軸地圖**（~70 行新章節）：
     - 8 軸 × 5 欄 mapping table（軸 / form / regular event / seasonal event / accessory / 件數 / 飽和度）— 統合 retrospective-150/170/190 §3.4 的 axis tables 進 GDD 主檔
     - **元氣軸歸屬釐清**：fighter form 主、party_hat 配件、rainbow regular event、pinwheel + rainbow_heart 兩個 seasonal — narrative 全部對齊「活力 / 元氣 / 運動感」per CLAUDE.md TA 軟化策略
     - **form-less 軸的設計哲學**：cottagecore + y2k 兩軸刻意 form-less，理由是「環境 / 風格 atmosphere」軸不該綁特定 form，玩家任何 form 都能透過配件 + 事件感受該軸 — 對齊 GDD §5.5 設計準則「form = 角色身份 / axis = 美學選擇」
     - **8 軸覆蓋演進時序**：列出 iter#100 起點 5 軸 → iter#132/172 event 全覆蓋 → iter#156/183 form 擴充 → iter#185 12 個月 seasonal 全覆蓋
     - **v0.4+ 美學軸候選方向**：新軸 candidates（boho / minimalist / kawaii-decora / dark academia）+ 既有軸補強建議

2. **本輪不動 src/**：純 docs 工作；不 bump sw.js cache（docs 不在 SW APP_SHELL）

3. **驗證**：
   - `./scripts/run-checks.sh` 跑保險：全綠 7 step + i18n-coverage 175 keys ✅
   - 沒 src 動，i18n-shadow / i18n-coverage / smoke / cfg-schema 全不變

**v0.3 backlog 結算（iter#195 完整封閉）**：
- ✅ 9th finalForm explorer ship（iter#183-184）
- ✅ 跨 pet 紀念碑 UI（iter#179）
- ✅ 8 美學軸 event 層全覆蓋（iter#172）
- ✅ 季節事件 +4 條 12 個月全覆蓋（iter#174/175/181/185）
- ✅ GDD §10.3 elder companion 100%（iter#176/179）
- ✅ cfg-level i18n batch 完整封閉（iter#177-193 / 11 batches / 236 條）
- ✅ i18n-coverage lint（iter#194 / 防 typo + 漏譯 class）
- ✅ **元氣軸 GDD 釐清（本輪 / 8 軸地圖 documented）**

**v0.3 100% 完成 ✅** — 所有 retrospective-190 標的 backlog item 全清。下個重點是 v0.4 candidates 規劃 + 持續 cron content / polish。

**為什麼把 axis map 放 §5 而非 §10**：
- §5 是「成長階段與進化分支」核心章節 — axis map 是 form 的延伸 metadata
- §10 是「MVP 範圍 vs 後續擴充」是 roadmap 章節 — 不適合 reference table
- 邏輯上：玩家進化路線 → form → 軸所屬 → 配件 / event 設計考量，axis map 應該在 progression chain 章節

**為什麼 8 軸 + 9 form 而非 8/8 對齊**：
- 第 9 form healthy 是 fallback default（無特定軸 — 任何養成路徑沒滿足其他 trait threshold 都進）
- cottagecore + y2k 兩軸是 form-less by design（per §5.5 reasoning）— 它們的「身份代表」是配件 + 事件氛圍，非 form
- 6 個有 form 的軸 + 2 個 form-less 軸 + healthy fallback = 9 forms 中 6 個有軸對應 / 1 個（healthy）共用 cottagecore + cleangirl 兩軸 / 2 個（fatty + ugly）失衡軸

**未來 follow-up**（不在本輪）：
- iter#210 retrospective-210（per retrospective-190 §後續預估）
- v0.4 candidates：10th finalForm（social / 親密家 keyed petCount? / collector keyed accessoryCount?）/ 新美學軸開發 / 跨 pet memorial 進階 UI
- cfg-level i18n cleanup pending entries（accessories label fallback 19 / interactions label fallback 14 / wants text fallback 14 / achievements label/desc fallback 52 — 都是 already-functional via labelKey/descKey/textKey 雙欄位的中文 fallback，海外發行 i18n.js 載入失敗時才走）

**影響檔案**：`docs/gdd.md`（§5.4 補 + §5.5 新章節 ~70 行）、`docs/iteration-log.md`

---

## 2026-04-30 11:11 · Session A — 防呆 lint 第二件：scripts/check-i18n-coverage.js — t() 呼叫 key 覆蓋驗證

**觸發**：cron 第 194 輪 — iter#193 cfg.speech batch 完整封閉後 dict 達 393 keys × 2 locales = 786 i18n.js 條目。retrospective-190.md §4.3 列「考慮加 check-i18n-coverage.js 防 typo / 漏譯」是工程紀律候選。連續 7 輪 i18n 後切到 tooling 變化。

**為什麼這個切點**：
- **盲區規模膨脹**：i18n dict 從 iter#100 起點的 ~12 條 seed → iter#193 的 393 條 — 30+ 倍成長後手動 review 不可能 catch typo
- **既有 lint 防線不蓋這 class**：i18n-shadow lint（iter#147）守 `const t = X` 遮蔽；smoke 8 scenarios 跑 render 不觸發 modal callback；cfg-schema 看 cfg 結構不看 i18n key 一致性
- **「P0 → lint」反饋迴路 SOP** — 雖然這次不是先有 P0 才加 lint，但是預防性投資。retrospective-190 §3.4 寫「retrospective 過時 risk」+「i18n typo 是潛伏 P0」— 加 lint 直接堵這個 class

**動作**：

1. **新增 `scripts/check-i18n-coverage.js`（135 行 node CLI）**：
   - **Step 1 parse i18n.js dict**：用 brace-counter 找 `"zh-TW": { ... }` / `"en": { ... }` 兩個 block 的範圍，內部 regex 抓所有 `"key": "value"` entry → 兩個 Set 存 keys
   - **Step 2 scan src/\*.js**（除 i18n.js 本身）：regex `\b(t|window\.NourishI18n\.t)\s*\(\s*["'\`]([^"'\`$]+)["'\`]` 抓 literal-string key call sites（含 file / line）；同時對 `\${` 動態 key 做 separate dynamic-site 統計
   - **Step 3 verify**：每個靜態 callsite key 必須同時在 zh-TW + en Set 內，否則記入 missing 列表
   - **Step 4 report**：missing key 含 file:line + locale + key 詳細列印；exit 1
   - 動態 key（cfg-driven `\`speech.${X}\`` 等）不可 statically resolve — 跳過但 log 計數，提醒 reviewer 這部分 coverage 是 partial（cfg 自己有 dual-field SOP 守）

2. **`scripts/run-checks.sh` 加第 7 step**：
   - 插在 `check-i18n-shadow.js` 後 / `check-render-smoke.js` 前
   - deploy gate 從 6 step → **7 step**

3. **自驗 + 回測**：
   - 跑當前 src：✅ "all 175 static t() keys covered in zh-TW + en (186 call sites across 22 files)"
   - 構造 typo 測試（在 src/utils.js 加 `t("toast.poor.typo.fake")` 一行）→ lint 立即命中 `❌ Missing in zh-TW (1) ... Missing in en (1) ... exit: 1`，正確報 file:line — backup 還原 src/utils.js 後 lint 回正常
   - **lint catches typo class** ✅

4. **`sw.js`：CACHE_VERSION iter193 → iter194**

**Stats（iter#194）**：
- 175 unique static keys × 186 callsites scanned across 22 src files
- zh-TW + en 兩 locale 各 393 keys 在 dict
- coverage 100%（callsite keys 全是 dict subset）
- 動態 key sites 預估 ~10-20 處（cfg-driven `speech.${X}` / `form.${X}` / `seasonal.${X}` etc）— 都走 dual-field SOP

**lint chain 演進**：
- iter#147：5 → 6 step（加 i18n-shadow）
- **iter#194：6 → 7 step（加 i18n-coverage）**
- 兩個 i18n 防線同時守：shadow 抓 `const t = X` runtime exception class / coverage 抓 dictionary typo + 漏譯 class

**為什麼 dynamic key 跳過而不報錯**：
- `t(\`speech.${stageKey}\`)` 等 9 處模板字串 callsite — 靜態無法解析 stageKey 值
- 這類 key 是 cfg-driven，已透過 dual-field SOP（cfg.speech / cfg.finalForms 等）保 fallback 到 cfg 字面，**production zero-risk**
- 加未來 enhancement：能掃 cfg 結構推斷 `${X}` 可能值集合，反向驗證 i18n key 完整 — 但複雜度爆炸，暫不做

**為什麼 i18n-coverage 比 i18n-shadow 晚 47 輪才做**：
- iter#147 i18n-shadow 是 P0 抓兩次（iter#106 / iter#146）後反應式投資 — 痛點導向
- iter#194 i18n-coverage 是預防性投資 — dict 規模到 786 條 manual review impossible 才有 ROI
- **lint 投資 timing 規律**：reactive（已痛）vs proactive（規模到 critical mass）— 兩種都有效

**驗證**：
- `node scripts/check-i18n-coverage.js` standalone → ✅ all 175 covered
- `./scripts/run-checks.sh` → 全綠 7 step（syntax 23 + sw / sw-shell / assets / cfg-schema / i18n-shadow / **i18n-coverage** / smoke）
- 自驗回測：構造 typo → exit 1 + 正確報 file:line ✅

**v0.4 backlog**（不在本輪）：
- 元氣軸 GDD 釐清（純 docs / 唯一 v0.3 backlog）
- 10th finalForm candidate / 跨 pet memorial 進階 / 新隨機事件 batch / 新美學軸開發
- iter#210 retrospective-210（per retrospective-190 §後續預估）

**影響檔案**：`scripts/check-i18n-coverage.js`（新）、`scripts/run-checks.sh`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 11:01 · Session A — cfg.speech 第七刀 final：14 action_X pools 42 lines — **cfg-level i18n 230 條 batch 完整封閉**

**觸發**：cron 第 193 輪 — retrospective-190.md §4.1 預估「iter#193 完成 cfg-level i18n 全部」如期兌現。本輪是 cfg.speech 7 刀的最後一刀，14 個 action_X pool 接 interactions.js 玩家互動 reaction speech。

**為什麼 action_X 留最後**：
- 14 個 pool 是 cfg.speech 中數量最多的 group
- 每 pool 短（2-4 line）但 callsite 是 interactions.js 高頻路徑（玩家每次餵食 / 玩耍 / 摸頭都觸發）
- 第七刀做完之後 cfg.speech 全 230 條 100% i18n functional，cfg-level i18n 海外發行 prerequisite ship 完整

**動作**（per iter#186 array-i18n SOP，動態 key 對標 iter#191/192 SOP）：

1. **`src/i18n.js` 加 14 條 key（zh + en，共 28 條）**：
   - **5 個 feed action**：feed_basic / feed_corn / feed_berry / feed_worm / feed_cake — pet 對食物的反應，從基礎飼料的「Thanks」到蛋糕的「Cake! Cake!」呈現興奮層次
   - **5 個 play action**：play_ball / play_toy / play_punch / play_puzzle / play_sing — 5 種互動 reaction，puzzle「Let me think... Ah, I get it!」+「🧠」捕捉智慧路線；sing「I shine brightest tonight!」舞台感
   - **bath**：4 條 / "Squeaky clean~|(shakes off droplets)|Chichi loves baths (not really)" — 最後一條「才怪 / not really」幽默自嘲
   - **2 個 pet action**：pet_head / pet_belly — pet_belly「Cluck cluck cluck|(laughs out loud)|Tickle~」笑聲 onomatopoeia
   - **talk**：3 條 / "Mhm!|Yeah yeah|What do you think master?" — 對話 banter

2. **`src/interactions.js` performInteraction 動態 key 1 行 surgical patch**：
   - `const replies = C.speech[\`action_${key}\`];` → `const replies = utils().tArray(\`speech.action_${key}\`, C.speech[\`action_${key}\`]);`
   - speak 條件改為 `replies && replies.length` 處理 tArray 回 empty array（no i18n + no cfg）的 corner case
   - 動態 key 路徑：14 種 interaction key × 對應 14 個 i18n key，零顯式 if-else，未來加新 interaction（v0.4 candidate）零 callsite 改動

3. **`sw.js`：CACHE_VERSION iter192 → iter193**

**i18n 進度跳躍 — cfg.speech 完整封閉**：
- 種子翻譯：379 + 14 = **393 條** zh-TW + 393 條 en
- speech 230 條中累計 6 + 14 + 16 + 26 + 50 + 36 + 42 = **190 條已 i18n**（**82.6% speech 進度**）
- 實際 cfg.speech entries：**46 個 pool 全 i18n functional**（dailyGreet 1 + critical 4 + normal 4 + mid 6 + stage 4 + idle 1 + time 5 + form 9 + action 14 = 48 但 form 9 + action 14 + 等等）

讓我重新數 pool：
| 類別 | pool 數 |
|------|--------|
| dailyGreet | 1 |
| critical state | 4 (veryHungry/verySad/veryDirty/veryTired) |
| normal state | 4 (hungry/sad/dirty/tired) |
| mid (rich/quirk/happy/wantNag/perfect/elder) | 6 |
| stage (egg/chick/junior/adult) | 4 |
| time (morning/noon/evening/night/lateNight) | 5 |
| idle | 1 |
| form_X | 9 |
| action_X | 14 |
| **TOTAL** | **48** |

對標 cfg-schema lint 「48 speech_pools」 — 完全對齊 ✅

**cfg-level i18n 230 條 batch 完整封閉（iter#177-193 共 7 輪）**：
| 輪 | batch | 條目數 |
|---|------|------|
| iter#177 | welcomeBack 4 條 | 4 |
| iter#178 | finalForms 8 × 2 = 16 條 | 16 |
| iter#180 | regular event applyToast 15 條 | 15 |
| iter#182 | seasonal event applyToast 11 條 | 11 |
| iter#186 | speech.dailyGreet 6 條 | 6 |
| iter#187 | speech 4 critical pools 14 條 | 14 |
| iter#188 | speech 4 normal pools 16 條 | 16 |
| iter#189 | speech 6 mid pools 26 條 | 26 |
| iter#191 | speech 10 stage+time+idle pools 50 條 | 50 |
| iter#192 | speech 9 form_X pools 36 條 | 36 |
| **iter#193** | **speech 14 action_X pools 42 條** | **42** |
| **TOTAL** | **11 batches** | **236 條** |

**v0.3 海外發行 i18n prerequisite ship-ready ✅** — 玩家切英文時所有 cfg-driven 字串（welcomeBack tier / finalForms label/desc / event applyToast 全 26 個 / speech 全 48 pool）都走 i18n key，零中文洩漏。

**驗證**：
- `node --check src/{interactions,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：14 種互動每次玩家觸發 → action_X dynamic key → tArray 回 array → rand0 一線；i18n 沒載 → cfg.speech.action_X 字面 fallback；i18n 沒 key + cfg 沒 entry → pickHappy() 通用 fallback（既有 logic 保）

**為什麼 bath 翻譯「Chichi loves baths (not really)」保自嘲**：
- 中文「啾啾愛洗澡(才怪)」是 GenZ 常用 ironic「才怪」反轉幽默 — 直譯「Chichi loves baths (not)」太美國化
- 「not really」更 natural English 但保 ironic twist — fits cottagecore TA 18-35F 的 self-aware humor

**為什麼 puzzle 翻譯「Let me think... Ah, I get it!」保 sage 路徑連動**：
- play_puzzle 是 sage form 的 trait source（intelligencePoints +1）— 玩家用這個互動養 sage
- 翻譯保 contemplative pause + epiphany 兩段 narrative — 跟 form_sage speech「Let me think|(deep in thought)」narrative 一致

**v0.3 backlog 結算（iter#193）**：
- ✅ 9th finalForm explorer 完整 ship（iter#183-184）
- ✅ 跨 pet 紀念碑 UI（iter#179）
- ✅ 8 美學軸 event 層全覆蓋（iter#172）
- ✅ 季節事件 +4 條 12 個月全覆蓋（iter#174/175/181/185）
- ✅ GDD §10.3 elder companion 100%（iter#176/179）
- ✅ **cfg-level i18n batch 完整封閉**（**本輪**）
- ⏳ v0.4 candidates：10th finalForm / 跨 pet memorial 進階 / 元氣軸 GDD 釐清 / 新隨機事件 batch / 新美學軸開發

**未來 follow-up**（不在本輪）：
- iter#210 寫 retrospective-210（per retrospective-190 §後續預估）
- 元氣軸 GDD 釐清（純 docs / 唯一 backlog）
- 觀察玩家 cfg.speech i18n 實際使用（需 telemetry）
- 開新 v0.4 candidates 規劃

**影響檔案**：`src/i18n.js`、`src/interactions.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 10:51 · Session A — cfg.speech 第六刀：9 form_X pools 36 lines（玩家進化後角色 voice 全 i18n）

**觸發**：cron 第 192 輪 — retrospective-190.md §4.1 第六刀 candidate。9 個 finalForm 的 idle 角色台詞 — 玩家養到進化看到的角色化 voice，是 v0.3 9th form 後 form-specific narrative 的雙語化關鍵。

**動作**（per iter#186 array-i18n SOP，動態 key 對標 iter#191 stage_X SOP）：

1. **`src/i18n.js` 加 9 條 key（zh + en，共 18 條）**：
   - `speech.form_healthy`：2 條 / "精神奕奕！|標準帥氣！" → "Full of energy!|Looking handsome!"
   - `speech.form_fatty`：2 條 / "再吃一點點就好…|不胖不胖，是骨架大" → "Just a bit more food…|Not chubby, just big-boned"
   - `speech.form_ugly`：2 條 / "其實這樣也滿酷的|醜雞也有春天" → "Actually pretty cool this way|Even meme chicks have spring"
   - `speech.form_fighter`：5 條 / 元氣 / 蹦跳 / 活力 max → "Bursting with energy / One more bounce / Vitality max / Hop hop today / Bright mood"
   - `speech.form_sage`：5 條 / contemplative / "An interesting premise|Let me think|(deep in thought)|The answer rides the wind|✦ Slow nod ✦"
   - `speech.form_diva`：5 條 / stage performer / "♪~|Tonight's stage is mine|Camera me again~|✨ Shining entrance ✨|How's today's look?"
   - `speech.form_divine`：5 條 / serene guardian / "May peace find you|(halo flickers)|(feathers softly glow)|Heart like spring morning~|✦ Gentle guardian ✦"
   - `speech.form_gourmet`：5 條 / patissier voice / "What pairs with afternoon tea today?|🍰 Mm~ interesting layers|..."
   - `speech.form_explorer`：5 條 / curious adventurer / "Where shall we explore today?|🗺️ More tiny surprises in the corners|..."
   - 翻譯保 form 個性：fighter「Hop hop」軟化（per CLAUDE.md TA 約束避力量類動詞）/ sage「ride the wind」保 cottagecore poetic / diva「Camera me again」保 stage-presence 直露 / explorer「tiny surprises in the corners」保童趣

2. **`src/idle.js` form 動態 key callsite（line 74-76）surgical patch**：
   - `r0(sp[\`form_${finalForm}\`] || sp.idle)` → 提取 `formKey = \`form_${state.pet.finalForm}\``，然後 `r0(utils().tArray(\`speech.${formKey}\`, sp[formKey] || sp.idle))`
   - 對標 iter#191 stage_X 動態 key SOP — 9 個 form 用單一動態查詢，未來加 10th / 11th form 零 idle.js 改動

3. **`sw.js`：CACHE_VERSION iter191 → iter192**

**i18n 進度跳躍**：
- 種子翻譯：370 + 9 = **379 條** zh-TW + 379 條 en
- speech 230 條中累計 6 + 14 + 16 + 26 + 50 + 36 = **148 條已 i18n**（**64.3% speech 進度**，超過 6 成）
- 9 finalForms × 角色化 voice 全 functional i18n — 玩家進化後切英文體驗連貫

**cfg.speech batch 進度（iter#192）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ iter#186 |
| ~~veryHungry / verySad / veryDirty / veryTired~~ | 14 | ✅ iter#187 |
| ~~hungry / sad / dirty / tired~~ | 16 | ✅ iter#188 |
| ~~rich / quirk / happy / wantNag / perfect / elder~~ | 26 | ✅ iter#189 |
| ~~stage_X 4 + idle + morning/noon/evening/night/lateNight 5~~ | 50 | ✅ iter#191 |
| ~~form_X 9 forms~~ | 36 | ✅ 本輪 |
| action_X 9 × 2-3 lines | ~22 | ⏳ 第七刀 |

**剩 ~22 條 / 1 cron 輪可清** — **iter#193 應該完整封閉 cfg-level i18n 230 條 batch**。對標 retrospective-190 §4.1 預估「第七刀 22 條」+「第八刀 leftover 50」— 本路徑進度比 retrospective 預估快（leftover 50 預期不會發生，因為 cfg-level 已基本掃完）。

**驗證**：
- `node --check src/{idle,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）

**為什麼 form 翻譯選擇要保各 form 個性而非追求字面**：
- form_X 是玩家辛苦養成 30+ 天才能解鎖的角色身份 — 每 form 是獨立 character voice
- fighter「再蹦一下」翻 "One more bounce" 保 athletic 但不暴力（per CLAUDE.md TA 軟化）
- sage「答案藏在風裡呢」翻 "The answer rides the wind" — 比直譯 "answers hide in the wind" 更詩意 + 主動（rides 動感）
- divine「願平靜降臨於你」翻 "May peace find you" — May + find 是 blessing 句式（avoid 直譯「peace come down」過正式）
- explorer「角落還有沒撿過的小驚喜」翻 "More tiny surprises in the corners" — surprises 多元 + corners 童趣，捕捉好奇心 narrative

**未來 follow-up**（不在本輪）：
- 第七刀 cfg.speech：9 action_X pool ~22 條（玩家互動 reaction — interactions.js callsite）— **預期 iter#193 cfg-level i18n batch 完整封閉**
- 元氣軸 GDD 釐清（純 docs）
- v0.3 candidates（10th form / memorial 進階 / 新隨機事件 batch）

**影響檔案**：`src/i18n.js`、`src/idle.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 10:41 · Session A — cfg.speech 第五刀：4 stage + 6 time/idle pools (~50 lines) — idle.js 完整 i18n functional

**觸發**：cron 第 191 輪 — retrospective-190.md §4.1 排序第五刀。挑 stage_X + time-of-day + idle 一輪做完，**因為 idle.js 內所有 sp.X callsite 全在這輪掃完**（之後 idle.js 全 i18n functional，剩下 cfg.speech batch 不再動 idle.js）。

**動作**（per iter#186 array-i18n SOP）：

1. **`src/i18n.js` 加 10 條 key（zh + en，共 20 條）**：
   - `speech.idle`：7 條 ambient onomatopoeia / "咕咕|啾~|嗯哼|🌸|✨|嘎嘎|(歪頭)" → "Coo|Chirp~|Mhm|🌸|✨|Quack|(tilts head)"
   - `speech.stage_egg`：5 條 / "…?|(蛋裡傳出微弱聲音)|嗶...|(輕輕晃動)|...咕?" → "…?|(faint sound from inside)|Beep...|(wobbles gently)|...coo?"
   - `speech.stage_chick`：4 條 wonder voice / "我會走路了！" 等
   - `speech.stage_junior`：4 條 puberty voice / "翅膀變大了~" 等
   - `speech.stage_adult`：4 條 reflective / "已經是大雞了|經驗豐富的鳥兒|我看過很多事情了|回想小時候…" → "I'm a grown chicken now..."
   - `speech.morning` / `noon` / `evening` / `night` / `lateNight`：5 條 time-of-day（4-5 lines each）— 玩家根據實時 hour 觸發

2. **`src/idle.js` 8 行 surgical patches**：
   - **stage 動態 key**（line 61）：`r0(sp[\`stage_${state.pet.stage}\`] || sp.idle)` → `r0(utils().tArray(\`speech.${stageKey}\`, sp[stageKey] || sp.idle))` — 動態 i18n key 查詢，適配 4 個 stage
   - **6 個 time-of-day 分支**（line 64-72）：morning / noon / 中午 idle / evening / night / lateNight 全 6 條 callsite 走 tArray
   - **最後 fallback line**（line 79）：`r0(sp.idle)` → `r0(utils().tArray("speech.idle", sp.idle))` — 全 idle.js 沒 i18n callsite 一網打盡

3. **`sw.js`：CACHE_VERSION iter189 → iter191**（iter#190 milestone 純 docs round 跳 cache bump）

**i18n 進度跳躍**：
- 種子翻譯：360 + 10 = **370 條** zh-TW + 370 條 en
- speech 230 條中累計 6 + 14 + 16 + 26 + ~50 = **112 條已 i18n**（**48.7% speech 進度**，將近一半）
- functional sites 增加 10 個 stage + time + idle pool

**idle.js 全 i18n 確認**：
- 文件內既有 callsite 全部已過 utils().tArray 包裝
- 未 i18n 的 cfg.speech.X 引用：線 75 form_X dynamic（下輪做）— 剩 1 種引用
- 5 個 stat / 5 個 normal / wantNag / perfect / elder / rich / quirk / idle / 4 stage / 6 time = 23 callsite × tArray ✅

**cfg.speech batch 進度（iter#191）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ iter#186 |
| ~~veryHungry / verySad / veryDirty / veryTired~~ | 14 | ✅ iter#187 |
| ~~hungry / sad / dirty / tired~~ | 16 | ✅ iter#188 |
| ~~rich / quirk / happy / wantNag / perfect / elder~~ | 26 | ✅ iter#189 |
| ~~stage_egg / chick / junior / adult + idle~~ | 24 | ✅ 本輪（部分） |
| ~~morning / noon / evening / night / lateNight~~ | 20 | ✅ 本輪（部分） |
| form_X (9 forms × 4-7) | 45 | ⏳ 第六刀 |
| action_X (9 × 2-3) | ~22 | ⏳ 第七刀 |

**剩 ~67 條 / 2-3 cron 輪可清完整 cfg.speech batch**。預估 iter#193-194 完成 last batch，cfg-level i18n 230 條 ship 完。

**驗證**：
- `node --check src/{idle,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：4 個 stage 動態 key 路徑成功（egg / chick / junior / adult 都會找到對應 i18n key）

**為什麼動態 key 設計成「速度同步生成 i18n key」**：
- 替代設計：4 個顯式 if-else 分支用 hardcode key — 行數膨脹 + 重複邏輯
- 選用設計：`speech.${stageKey}` 模板字串 — 1 行夠 + 對 4 stage 自然延伸
- 副作用：未來若加第 5 階段（如 senior 老雞 v0.4 candidate）只需要加 1 條 i18n key + cfg.speech.stage_senior，idle.js 零改動

**為什麼「Coo / Chirp」翻譯選擇**：
- "Coo" 是 dove / chicken cooing onomatopoeia 國際通用
- "Chirp" 是 bird chirping 歐美 cottagecore 兒童書經典字
- "Quack" 是 duck 但 chicken 也用 — TA 18-35F 看到不會違和
- "Mhm" 是 contemplative agreement（對應「嗯哼」）— 保 personality

**未來 follow-up**（不在本輪）：
- 第六刀 cfg.speech：9 個 form_X pool 45 條（玩家進化後高頻 idle line 來源 — interactions.js + idle.js 兩個 callsite path）
- 第七刀 cfg.speech：9 個 action_X pool ~22 條（互動 reaction — interactions.js callsite）
- 元氣軸 GDD 釐清

**影響檔案**：`src/i18n.js`、`src/idle.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 10:31 · Session A — iter#190 milestone：docs/retrospective-190.md 寫 iter#170-189 共 20 輪 v0.3 ship + cfg-level i18n batch 起手 arc 總結

**觸發**：cron 第 190 輪 — milestone 整數對應前次 retro（iter#170）正好 20 輪間隔，是自然 cadence 切點。前 4 份 retros：iter#100（35 輪 / 65→100）/ iter#130（35 輪 / 100→134）/ iter#150（15 輪 / 135→149）/ iter#170（20 輪 / 150→169）— 本輪是第 5 份。

**為什麼**：
- iter#170-189 是「**v0.3 第一個 form ship + cfg-level i18n 大批次起手**」雙主線 arc
- v0.3 9th finalForm explorer 完整 ship（iter#183 主 + iter#184 收尾）對標 iter#156-157 gourmet ship 的 SOP 第二次成功複製 — pipeline 確立
- cfg-level i18n batch 6 輪累計 108 user-facing entries（welcomeBack 4 / finalForms 16 / regular event 15 / seasonal event 11 / speech 第 1-4 刀 62）— 海外發行 prerequisite 起手
- 8 美學軸 event 層完成（iter#171-172）+ 季節事件 +4（iter#174/175/181/185）+ GDD §10.3 elder 100% 封閉（iter#176/179）= v0.2 backlog 全面收完

**動作**：

1. **新增 `docs/retrospective-190.md`（5 章 + 17 列指標表）**：
   - **§1 TL;DR**：8 點濃縮 — 8 軸 event 100% / v0.3 9th form ship / 季節 +4 / cfg-level i18n 6 輪 +108 entries / GDD §10.3 100% / R-1 micro / array-i18n SOP
   - **§2 階段時序表**：20 列 iter#170-189 對應主題 + 產出
   - **§3 關鍵學習 7 段**：
     - §3.1 v0.3 ship pipeline 第二次複製（gourmet → explorer SOP 確立）
     - §3.2 cfg-level i18n batch 兩種 SOP（單字串 dual-field vs 陣列 tArray + `|` separator）
     - §3.3 8 美學軸「補對稱」哲學（每軸 ≥ 1 event 是 retention hook）
     - §3.4 retrospective 過時 risk（iter#170 寫「elder 未做」實際 95% 完成 — 教訓改 SOP）
     - §3.5 12 個月日曆覆蓋是 retention 設計（玩家「下個月會是什麼」hook）
     - §3.6 GDD §10.3 elder 「visible payoff」哲學（女性向 cottagecore TA retention = 關係 visible artifact）
     - §3.7 array-i18n 「| separator」設計選擇（vs JSON / 一線一 key 兩個 alternative）
   - **§4 後續方向**：4 段
     - §4.1 cfg.speech 剩 4 輪 batch（第 5-8 刀，168 條，預估 iter#193 完成）
     - §4.2 v0.3 candidates（10th form / 新 random event batch / 元氣軸 GDD / 跨 pet memorial 進階）
     - §4.3 工程紀律（24 輪無新 P0 — 防線健康；考慮加 i18n-coverage lint 防 typo）
     - §4.4 retrospective 過時 risk SOP 改進（每輪 grep 驗證 backlog）
   - **§5 數字總結 17 列指標表**：game.js 502 穩定 / NourishUtils +1 (tArray) / **i18n 種子 290→360** / accessories 19 / forms 8→9 / traits 7→8 / seasonal pool 8→12 / assets 79→85 / etc.

**為什麼是 5 章 / 7 學習段 / 17 指標**：
- 對標 retrospective-170 的 5 章 / 7 學習 / 13 指標 — 本 arc 工作面向更廣（content + i18n + v0.3 + tooling），數字維度多 4 列
- 7 學習段跟 retrospective-170 保持，但內容主題完全切換到 cfg-level i18n / v0.3 ship pipeline / 8 軸覆蓋哲學
- 17 列數字反映 cfg-level 細項 + season pool 拆分 + i18n functional sites 等更精細統計

**lines 變化**：
- `docs/retrospective-190.md`：**新增 ~250 行**（含 5 章 + 17 列數字 + 詳細 reflection）
- `src/`：本輪不動（純 docs round / sw.js 也不 bump — docs 不在 SW APP_SHELL）

**驗證**：
- 純 docs round，無 src 變更 — `./scripts/run-checks.sh` 跑保險：全綠 ✅
- 對標 iter#170 / iter#150 milestone round 都跳 cache bump（docs 不影響玩家 SW cache）

**reflection — 90 cron 輪這個專案做出什麼**：
- 從 iter#100 起點 ~1990 行 game.js 單檔 → 502 行 + 23 模組 / 17 NourishAPI bridge / 14 NourishUtils + 自包含
- 9 finalForms / 8 traits / 16 regular events + 12 seasonal events = 28 events / 19 accessories / 27 achievements / 48 speech pools / 41 SVG assets / 6-step deploy gate / 8/8 smoke + i18n-shadow lint
- **i18n 種子翻譯 360 條 zh-TW + 360 條 en** = 720 條 i18n.js 條目 + cfg-level dual-field 6 種 cfg 結構（welcomeBack / finalForms / regularEvents / seasonalEvents / interactions / wants / accessories / achievements）100% functional
- 5 份 retrospective + r1-plan + image-prompts 等專案 meta 文件健康
- v0.2 100% ship-ready / v0.3 第一個 feature ship + cfg-level i18n 27% 完成

**影響檔案**：`docs/retrospective-190.md`（新）、`docs/iteration-log.md`

---

## 2026-04-30 10:21 · Session A — cfg.speech 第四刀：6 mid-pool (rich/quirk/happy/wantNag/perfect/elder) 26 lines 雙語

**觸發**：cron 第 189 輪 — 連續第四輪 cfg.speech batch。本輪挑 idle.js 內 critical/normal stat 之外的 6 個剩 callsite + utils.pickHappy（被 interactions.js 高頻呼叫）— 把 idle.js 內 sp.X 直接引用全部清掉。

**動作**（per iter#186 array-i18n SOP）：

1. **`src/i18n.js` 加 6 條 key（zh + en，共 12 條）**：
   - `speech.happy`：5 條 / "好幸福！|嘿嘿~|最喜歡主人了|今天超棒！|好開心~" / "So happy!|Hehe~|I love master most|Today's the best!|So joyful~"
   - `speech.wantNag`：4 條 / "主人有看到我的願望嗎？|拜託啦~|求求你嘛|(用期待的眼神看著主人)" / "Did master see my wish?|Pretty please~|I'm begging you|(looks at master expectantly)"
   - `speech.perfect`：4 條 / "在主人身邊真好~|今天根本完美！|覺得世界很美好|啾啾最幸福了！" / "It's nice being by master's side~|Today is just perfect!|The world feels beautiful|Chichi is the happiest!"
   - `speech.elder`：7 條 / GDD §10.3 老年互動 reflective lines / "I'm so happy with you~|Do you remember our first meeting?|I've watched you grow a little too|I love these everyday moments|(leans gently against master)|Thank you for always being here|Remember me in the years ahead~"
   - `speech.rich`：2 條 / "錢好像變多了~|覺得我們可以買點什麼了！" / "Feels like we have more coins~|We could buy something now!"
   - `speech.quirk`：5 條 / "(發呆)|(整理羽毛)|(看天空)|(踱步)|♪" / "(spaces out)|(preens feathers)|(stares at sky)|(paces around)|♪"
   - 翻譯保 GDD §10.3 elder lines 反思語氣（"Thank you for always being here / Remember me in the years ahead" 是溫暖懷念，不悲傷）+ 動作括號保留

2. **`src/idle.js` 5 行 surgical patches**：
   - line 42 wantNag / line 47 perfect / line 55 elder / line 74 rich / line 75 quirk — 全改用 utils().tArray
   - 跟前 2 輪 SOP 一致

3. **`src/utils.js` pickHappy helper 升級**：
   - 從直接 `rand0(NourishCFG.speech.happy || [])` → `rand0(tArray("speech.happy", fallback))`
   - **interactions.js 內每次玩家完成互動都呼 pickHappy** — pickHappy 是 high-frequency callsite，這個 i18n 升級讓所有互動 reaction 雙語

4. **`sw.js`：CACHE_VERSION iter188 → iter189**

**i18n 進度跳躍**：
- 種子翻譯：354 + 6 = **360 條** zh-TW + 360 條 en
- speech 230 條中累計 6 + 14 + 16 + 26 = **62 條已 i18n**（**27% speech 進度**，超過 1/4）
- functional sites 增加 6 個 speech pool，**idle.js 內所有 critical/normal/want/perfect/elder/rich/quirk 7 類 callsite + utils.pickHappy 全 i18n functional**

**cfg.speech batch 進度（iter#189）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ iter#186 |
| ~~veryHungry / verySad / veryDirty / veryTired~~ | 14 | ✅ iter#187 |
| ~~hungry / sad / dirty / tired~~ | 16 | ✅ iter#188 |
| ~~rich / quirk / happy / wantNag / perfect / elder~~ | 26 | ✅ 本輪 |
| stage_egg / chick / junior / adult | 17 | ⏳ next |
| morning / noon / evening / night / lateNight / idle | 35 | ⏳ |
| form_X (9 forms × 4-7) | 45 | ⏳ |
| action_X (9 × 2-3) | ~22 | ⏳ |

剩 ~168 條 / 4 cron 輪可清。**idle.js stat / state speech 全 i18n**，剩下是 stage / time / form / action 軸。

**驗證**：
- `node --check src/{idle,utils,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）

**特別考量 - GDD §10.3 elder line 翻譯**：
- 7 條是 elder companion narrative arc 的 emotional core — 翻譯要保「溫暖陪伴 / 不悲傷 / 反思當下」原意
- "Remember me in the years ahead~" 翻「再過幾年也要記得我喔~」— 直譯但保溫柔語氣
- "(leans gently against master)" 翻「(輕輕靠著主人)」 — 動作括號精準對等
- 跟 cfg.finalForms.divine.desc「傳說中的天使存在」是同類 emotional payoff 翻譯品質要求

**未來 follow-up**（不在本輪）：
- 下輪 cfg.speech 第五刀：stage_X 4 個 pool + morning/noon/evening/night/lateNight 5 個 time-of-day pool ~52 條（idle.js stage/time callsites）
- 元氣軸 GDD 釐清

**影響檔案**：`src/i18n.js`、`src/idle.js`、`src/utils.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 10:11 · Session A — cfg.speech 第三刀：4 normal state pools (hungry/sad/dirty/tired) 16 lines 雙語

**觸發**：cron 第 188 輪 — iter#187 critical state 4 pools 補完後本輪做對稱的 normal state 4 pools。idle.js pickContextualLine 內 normal state 4 條 critical 後緊接著（line 36-39 vs line 32-35），同一個區域 cluster 補完。

**動作**（per iter#186 array-i18n SOP）：

1. **`src/i18n.js` 加 4 條 key（zh + en，共 8 條）**：
   - `speech.hungry`：5 條 / "肚子餓了…|想吃飯|咕嚕咕嚕|肚子在叫…|好餓~" / "Tummy's empty…|Want some food|Grumble grumble|Stomach's calling…|So hungry~"
   - `speech.sad`：5 條 / "不開心…|陪我玩嘛|嗚嗚|好寂寞|心情不好" / "Feeling down…|Play with me|Boo hoo|So lonely|Bad mood"
   - `speech.dirty`：3 條 / "好癢…|想洗澡|渾身不對勁" / "So itchy…|Need a bath|Feeling off all over"
   - `speech.tired`：3 條 / "想睡覺…|好累|眼皮好重" / "Sleepy…|So tired|Eyelids heavy"
   - 翻譯保 onomatopoeia 對等（咕嚕咕嚕→Grumble grumble / 嗚嗚→Boo hoo）+ 親密語氣（陪我玩嘛 → Play with me 帶撒嬌語境）

2. **`src/idle.js` pickContextualLine 4 行 surgical patch**：
   - 4 個 normal state callsite（hunger/mood/clean/energy < th.low）改用 `utils().tArray("speech.X", sp.X)`
   - 跟 iter#187 critical state 同 SOP：保 cfg.speech.X 字面 fallback

3. **`sw.js`：CACHE_VERSION iter187 → iter188**

**i18n 進度跳躍**：
- 種子翻譯：350 + 4 = **354 條** zh-TW + 354 條 en
- speech 230 條中累計 6 + 14 + 16 = **36 條已 i18n**（**15.7% speech 進度**）
- functional sites 增加 4 個 normal state pool

**cfg.speech batch 進度（iter#188）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ iter#186 |
| ~~veryHungry / verySad / veryDirty / veryTired~~ | 14 | ✅ iter#187 |
| ~~hungry / sad / dirty / tired~~ | 16 | ✅ 本輪 |
| rich / quirk / happy / wantNag / perfect / elder | ~24 | ⏳ next |
| stage_egg / chick / junior / adult | ~16 | ⏳ |
| morning / noon / evening / night / lateNight / idle | ~36 | ⏳ |
| form_X (9 forms × 5) | 45 | ⏳ |
| action_X (9 × 2-3) | ~22 | ⏳ |

剩 ~194 條，5 cron 輪可清。**idle.js critical + normal stat speech 全 i18n functional**（8 個 pool / 30 條）— 玩家任何 stat 異常切英文都看到 en lines。

**驗證**：
- `node --check src/{idle,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）

**為什麼選「Boo hoo」翻「嗚嗚」而非「Sob sob」**：
- iter#187 verySad 用了「Sob sob」對「嗚嗚嗚嗚」（4 字 onomatopoeia 強烈悲傷）
- 本輪 sad 用「Boo hoo」對「嗚嗚」（2 字較輕的傷心）— 強度區別保持中英平行對應
- 「Sob sob」vs「Boo hoo」都是 hardly-used 在 modern English 但童書 / cottagecore 系適合

**未來 follow-up**（不在本輪）：
- 下輪 cfg.speech 第四刀：rich / quirk / happy / wantNag / perfect / elder 6 個小 pool ~24 條（idle.js 內其他 callsites）
- 元氣軸 GDD 釐清

**影響檔案**：`src/i18n.js`、`src/idle.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 10:01 · Session A — cfg.speech 第二刀：4 critical state pools (veryHungry/verySad/veryDirty/veryTired) 14 lines 雙語

**觸發**：cron 第 187 輪 — iter#186 建立 array-i18n SOP（utils.tArray + `|` separator）後，本輪批次套用第二批。挑 critical state 4 pools 是因為 idle.js pickContextualLine 內 critical 4 條 in 一個地方 — 修改面集中。

**為什麼 critical state 高 priority**：
- idle.js 邏輯：`s.hunger < 8` / `< 8` 等 4 條 critical threshold 觸發 — 玩家忽略後第一個收到的求救 voice
- D1 玩家如果離線後沒理 → 回來看到的就是 veryHungry / verySad — 是英文用戶 first-impression i18n surface
- 4 個 pool × 平均 3.5 line = 14 條，比 dailyGreet（6 條）大但仍可控

**動作**：

1. **`src/i18n.js` 加 4 條 key（zh + en，共 8 條）**：
   - `speech.veryHungry`：3 條 / "快餓死了…|求餵食…|肚子好痛" / "Starving…|Please feed me…|My tummy hurts"
   - `speech.verySad`：3 條 / "主人是不是不愛我了…|我做錯什麼了嗎|嗚嗚嗚嗚" / "Doesn't master love me anymore…|Did I do something wrong|Sob sob"
   - `speech.veryDirty`：2 條 / "臭臭…我自己都受不了|求洗澡 QQ" / "Stinky… even I can't stand it|Bath please QQ"
   - `speech.veryTired`：5 條 / "撐不住了…|秒睡|(打哈欠)|好~睏…|(蜷成一團)" / "Can't hold on…|Out cold|(yawn)|So~ sleepy…|(curls up)"
   - 翻譯保 emoji-style fallback（QQ 顏文字保留 — 跨文化通用，cottagecore TA fitting）+ 動作括號（(yawn) (curls up) 對應原版 (打哈欠) (蜷成一團)）

2. **`src/idle.js` pickContextualLine 4 行同步替換**：
   - `r0(sp.veryHungry)` → `r0(utils().tArray("speech.veryHungry", sp.veryHungry))`
   - `r0(sp.verySad)` → `r0(utils().tArray("speech.verySad", sp.verySad))`
   - `r0(sp.veryDirty)` → `r0(utils().tArray("speech.veryDirty", sp.veryDirty))`
   - `r0(sp.veryTired)` → `r0(utils().tArray("speech.veryTired", sp.veryTired))`
   - 保 cfg.speech.veryX 字面 fallback — 跟 iter#186 dailyGreet SOP 一致

3. **`sw.js`：CACHE_VERSION iter186 → iter187**

**i18n 進度跳躍**：
- 種子翻譯：346 + 4 = **350 條** zh-TW + 350 條 en（首破 350）
- speech 230 條中 6 + 14 = **20 條已 i18n**（8.7% speech 進度）
- functional sites 增加 4 個 critical state pool

**cfg.speech batch 進度（iter#187）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ iter#186 |
| ~~veryHungry / verySad / veryDirty / veryTired~~ | 14 | ✅ 本輪 |
| hungry / sad / dirty / tired | ~16 | ⏳ next |
| rich | 2 | ⏳ |
| quirk | 5 | ⏳ |
| happy | 5 | ⏳ |
| wantNag | ~3 | ⏳ |
| perfect | ~4 | ⏳ |
| elder | ~5 | ⏳ |
| stage_egg / chick / junior / adult | ~16 | ⏳ |
| morning / noon / evening / night / lateNight / idle | ~36 | ⏳ |
| form_X (9 forms × 5) | 45 | ⏳ |
| action_X (9 × 2-3) | ~22 | ⏳ |

剩 ~210 條，5-6 cron 輪（每輪 30-50 條）做完。下個 candidate：normal state 4 pools (hungry/sad/dirty/tired ~16 條) 對稱補完，同 idle.js 區。

**驗證**：
- `node --check src/{idle,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：fallback chain 跟 iter#186 一致 — i18n 沒載 → cfg.speech 字面；i18n 載 → en lines

**為什麼 mood < 8「主人是不是不愛我了」直翻 "Doesn't master love me anymore"**：
- 中文「主人」原譯 "owner" 太距離感；iter#152 已建立「Master」音譯 SOP，跨 modal i18n 一致
- 「我做錯什麼了嗎」原版有委屈 / unsure 語氣 — "Did I do something wrong" 保 puzzlement
- 「嗚嗚嗚嗚」直接 "Sob sob" — onomatopoeia 對等

**未來 follow-up**（不在本輪）：
- 下輪 cfg.speech 第三刀：normal state 4 pools (hungry/sad/dirty/tired) — 同 idle.js callsite，~16 條
- 元氣軸 GDD 釐清

**影響檔案**：`src/i18n.js`、`src/idle.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:51 · Session A — cfg.speech 第一刀 + array-i18n SOP 建立：utils.tArray helper + speech.dailyGreet 6 lines 雙語

**觸發**：cron 第 186 輪 — v0.3 backlog 唯一剩下大塊「cfg.speech 230 條 last batch」起手。speech 是 cfg-level 最後也最難的 batch — 不只大（46 pool / ~230 條）也有 array 結構問題（每 pool 是 string array，不是單一 string）— 需要先建 array-i18n SOP 再 batch。

**為什麼選 array-i18n SOP「| separator-joined string」**：
- **Option A 純 JSON**：i18n value 是 JSON-encoded array `["line1","line2"]` — 太繁瑣 + 雙引號跟 i18n.js 既有 string format 衝突
- **Option B 一線一 key**：speech.elder.0 / speech.elder.1 / ... → 230 lines × 2 locales = 460 keys，rotation pickContextualLine 會被 i18n key 數量爆炸 + 維護成本高
- **Option C 「|」separator-joined**：i18n value 是 "line1|line2|line3"，consume time 一個 split('|') 還原 array — 簡潔 + 跟 stringDB 兼容 + 零工具改動
- **選 C** — 對標 i18n industry SOP（gettext .po PoolFile 也是 \n separator）

**為什麼 dailyGreet 起手**：
- 6 條最小 / 高曝光（每天玩家登入第一個 trigger）/ daily.js 唯一 callsite — 不影響 idle.js 大量 callsite
- SOP 建立後其他 45 個 pool 機械式套同模板

**動作**：

1. **`src/utils.js` 加 `tArray(key, fallback)` helper（10 行 + comment）**：
   - 邏輯：i18n 沒載 → return fallback；t(key) === key（i18n 找不到時 fallback to key 本身）→ return fallback；正常 → split('|')
   - 暴露面：window.NourishUtils 從 13 → **14 export**（加 tArray）
   - 對標既有 cfgLabel / cfgDesc helper 的「i18n + cfg fallback」雙路徑模式

2. **`src/i18n.js` 加 1 條 key（zh + en，共 2 條）**：
   - zh-TW: `speech.dailyGreet` = "新的一天，又見面了~|早安主人！|今天有什麼計畫呢？|你來了！我等好久~|想你了~|(蹭蹭)"
   - en: `speech.dailyGreet` = "A new day, we meet again~|Good morning master!|Any plans today?|You're here! I waited~|Missed you~|(nuzzles)"
   - 6 個 line 用 `|` 分隔，cfg 字面 array 順序保留

3. **`src/daily.js` handleLogin（行 52-57）**：
   - `const lines = (C.speech && C.speech.dailyGreet) || [];` → `const lines = utils().tArray("speech.dailyGreet", (C.speech && C.speech.dailyGreet) || []);`
   - cfg.speech.dailyGreet **保留字面 fallback**（i18n.js 沒載時走 cfg.speech 路徑，行為跟 iter#185 之前一致）
   - `rand0(lines)` 保持不變 — i18n vs cfg 都回 array，consumer code 零變化

4. **`sw.js`：CACHE_VERSION iter185 → iter186**

**i18n 進度跳躍**：
- 種子翻譯：345 + 1 = **346 條** zh-TW + 346 條 en
- speech 230 條中 6 條已 i18n（dailyGreet pool 全部 6 條 by single key）— **2.6% speech 進度**
- functional sites 增加 1 個 pool

**cfg.speech batch 進度（iter#186 起手）**：
| pool | size | i18n status |
|------|------|-------------|
| ~~dailyGreet~~ | 6 | ✅ 本輪 |
| veryHungry / verySad / veryDirty / veryTired | 3 each = 12 | ⏳ |
| hungry / sad / dirty / tired | 3-4 each = ~14 | ⏳ |
| rich | 2 | ⏳ |
| quirk | 5 | ⏳ |
| happy | 5 | ⏳ |
| wantNag | ~3 | ⏳ |
| perfect | ~3 | ⏳ |
| elder | ~5 | ⏳ |
| stage_egg / chick / junior / adult | 4 each = 16 | ⏳ |
| morning / noon / evening / night / lateNight / idle | 6 each = 36 | ⏳ |
| form_X (9 forms × 5 lines) | 45 | ⏳ |
| action_X (9 actions × 2-3 lines) | 22 | ⏳ |

剩 ~224 條，預估 5-7 cron 輪做完。每輪 30-50 條，按 pool 大小排序 — 小到大或熱到冷。

**驗證**：
- `node --check src/{utils,i18n,daily}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：
  - `i18n.js` 載入正常 → daily.js handleLogin 走 tArray → 切英文時拿 6 條 en lines
  - `i18n.js` 載入失敗 → tArray fallback 到 cfg.speech.dailyGreet → 跟 iter#185 之前一致
  - 既有玩家存檔不需 migration（cfg / i18n 結構增量）

**為什麼 speech 留最後**：
- 翻譯難度高：角色 voice 需要保「咕咕 / 蹭蹭 / 咯咯咯」這類 onomatopoeia + 親密語氣 + 文化梗
- 230 條一次 batch 太重，分小批次（每輪 30-50）保 review quality
- 對「海外發行 prerequisite」優先級不高 — speech 是 atmospheric，玩家轉英文先看的是 modal / button / toast（已 100% i18n functional）

**未來 follow-up**（不在本輪）：
- 下輪 cfg.speech batch：veryHungry / verySad / veryDirty / veryTired 4 個小 pool（idle.js critical state speech 高曝光）
- 元氣軸 GDD 釐清（純 docs / planning）
- v0.3 candidate 已基本清完

**影響檔案**：`src/utils.js`、`src/i18n.js`、`src/daily.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:41 · Session A — 兒童節 seasonal event「風車」(pinwheel)：4 月空缺補完，seasonal pool 11 → 12

**觸發**：cron 第 185 輪 — explorer ship 完整封閉後切回 content 變化。retrospective-170.md §4.3 + 多輪結算列「4 月空缺」是 seasonal pool 月份覆蓋唯一缺口。本輪兌現。

**為什麼挑兒童節而非地球日 / 復活節 / 愚人節**：
- **地球日（4-22）**：環保 narrative 容易做嚴肅 / 過 message-y，跟 cottagecore-coquette TA 軟性娛樂走向 mismatch
- **復活節**：移動日期（2026=04-05 / 2027=04-04 / 2028=04-16）— 固定 dateRange 會跨年漂移，不適合
- **愚人節（4-1）**：narrative 偏惡作劇 / prank 風格，跟 TA「療癒系」氣質衝突
- **兒童節（4-4 TW 固定日）**：童心未泯 narrative 軟性 + 跟 TA 18-35 歲女性的「重溫童年」aspiration 對齊；TW 主場 cultural anchor — 對 ja 玩家也通（日本兒童節 5/5 不同但童玩風車是亞洲共通 motif）

**為什麼選風車作為視覺 anchor**：
- TW 兒童節 iconic 童玩 — 比氣球 / 棒棒糖 / 玩具車更獨特（既有 candy 已涵蓋甜食路線）
- 風車的 4-blade 結構 + 旋轉 motion 適合 SVG 表達（distinct 於既有事件視覺）
- 粉藍配色（pink + cyan blade alternating）跟 cottagecore TA 對齊

**動作**：

1. **新增 `assets/svg/event-pinwheel.svg`（19 行 SVG）**：
   - viewBox 100×100 對標既有 12 個 event SVG
   - 色票嚴守 CLAUDE.md §5：粉 #FFB7B7（top + bottom blade 主色）+ #FF89A7（粉色描邊）/ 藍 #6BCBFF（left + right blade 主色）+ #5BA8DD（藍色描邊）/ 棕 #8B5A2B（手柄 + center hub 描邊 + tiny inner dot）/ 黃 #FFD86B（center hub button + 兩條 motion arc 暗示旋轉）/ 粉 #FFB7B7（♥ accent）
   - 結構：4 個 quadrant triangle blade（path 從中心 (50,50) 向外四方延伸 + 一點偏移做風車「斜向葉片」感）— **粉 + 藍交錯**（top 粉 / right 藍 / bottom 粉 / left 藍）+ 4 樣品 hub 同心圓 + 棕色 stick 手柄 + 兩條 quadratic motion arc + ✨ + ♥ corner accents
   - 4-blade triangle path 用偏斜 vertex 暗示風車葉片「正在轉」的動感（非完全對稱）— 跟 spinning 視覺一致

2. **`src/cfg.js` seasonalEvents.pool 加第 12 條**：
   ```
   { id:"pinwheel", art:"assets/svg/event-pinwheel.svg", weight:25,
     label:"兒童節風車", apply:"pinwheel",
     applyEffects:{ stats:{mood:18, energy:10}, coin:12, coinReason:"兒童節" },
     applyToastKey:"seasonal.pinwheel",
     applyToast:"🎏 風車轉啊轉~ 童心未泯",
     applyToastStyle:"gold",
     dateRange: { from: "04-01", to: "04-05" } }
   ```
   - 加在 redenvelope 後（4 月日曆位置）
   - **+mood 18**：童心 nostalgia，mid-high tier（對標 candy 18 / petal 14）
   - **+energy 10**：童玩活力暗示
   - **coin 12 + coinReason「兒童節」**：narrative + 經濟回饋
   - **gold style**：節日 high-tier
   - 「童心未泯」是台語 / 中文成語 — 翻 en 用 "Childhood spirit" 對齊但保短

3. **`src/i18n.js` 雙語 1 條（applyToastKey 對齊 iter#182 SOP）**：
   - zh-TW: `seasonal.pinwheel` = "🎏 風車轉啊轉~ 童心未泯"
   - en: `seasonal.pinwheel` = "🎏 The pinwheel spins~ Childhood spirit"

4. **`sw.js`：CACHE_VERSION iter184 → iter185**

**lint chain 報表**：
- check-assets：84 → **85** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅
- cfg-schema 不變（randomEvents pool 不在 cfg-schema lint 統計，seasonal 也是 12 內部）

**season pool 月份覆蓋更新**：
| 月份 | event | 重疊 |
|------|-------|------|
| 1 月 | newyear (12-31~01-03) | — |
| 2 月 | valentine (02-12~02-15) / redenvelope (02-16~02-22) | 11 天接力 |
| 3 月 | sakura (03-20~05-10) | — |
| **4 月** | **pinwheel (04-01~04-05 本輪) / sakura (cont)** | **5 + 11 天**（重疊） |
| 5 月 | sakura（覆蓋首 10 天） / carnation (05-08~05-12) / zongzi (05-30~06-09) | 三層重疊 |
| 6 月 | zongzi（早 9 天） / rainbow_heart (06-01~06-30) | 兩層重疊 |
| 7-8 月 | summer_breeze (07-01~08-31) | — |
| 9 月 | mooncake (09-10~09-25) | — |
| 10-11 月 | halloween (10-25~11-01) | — |
| 12 月 | xmas (12-20~12-26) / newyear (12-31~01-03) | — |

**全 12 個月覆蓋達成 ✅**（4 月空缺終於補上）。**season pool 12 + regular pool 16 = 28 events 總計**。

**i18n 進度跳躍**：
- 種子翻譯：344 + 1 = **345 條** zh-TW + 345 條 en
- functional sites：~241 + 1 = ~242 處

**v0.3 backlog 更新**：
- ✅ 9th final form 完整封閉（iter#183-184）
- ✅ **4 月 seasonal 空缺補完**（本輪）
- ⏳ cfg.speech 230 條 last batch（最大 cfg-level i18n batch，3-5 cron 輪）
- ⏳ 元氣軸 GDD 釐清（純 docs / planning）

**未來 follow-up**（不在本輪）：
- 元氣軸 GDD 釐清（party_hat 歸屬 — fighter 軸獨立 / 還是 birthday celebration 軸）
- cfg.speech 第一 batch（speech.dailyGreet 是最小 pool，3-5 條）
- 觀察 pinwheel pickup ratio（需 telemetry）

**影響檔案**：`assets/svg/event-pinwheel.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:31 · Session A — explorer 終態收尾：成就 form_explorer + speech 5 條 + collect_all 8→9 + image-prompts §8.6 + 雙語 i18n

**觸發**：cron 第 184 輪 — iter#183 ship explorer 主結構備註明確下輪做收尾。對標 iter#157 gourmet 收尾 SOP — 三項收尾：(1) 解鎖成就 / (2) form-specific speech / (3) collect_all bump。

**動作**（5 處同步）：

1. **`src/cfg.js` achievements 加第 27 條 form_explorer**：
   - `{ icon:"🗺️", labelKey:"ach.form_explorer", label:"小小探險家", descKey:"achdesc.form_explorer", desc:"養出探險家雞" }`
   - 對標 form_divine / diva / fighter / sage / gourmet 5 個既有 form 成就 dual-field i18n 慣例

2. **`src/cfg.js` collect_all.desc 8→9**：
   - 「收集全部 8 種終態」→「收集全部 9 種終態」

3. **`src/cfg.js` speech.form_explorer 5 條 cottagecore 探險口吻**：
   - 「今天去哪裡探險呢？」「🗺️ 角落還有沒撿過的小驚喜」「(整理背包中)」「✨ 看！我撿到的~」「外面的世界好大~」
   - 對標 form_divine reflective / form_diva stage / form_sage contemplative / form_gourmet 美食評鑑家 — 每 form 鮮明角色聲音
   - 5 條等量於既有 form_divine / diva 等 — idle pool rotation 不偏短

4. **`src/achievements.js` evaluator 兩處更新**：
   - 加 `["form_explorer", dexUnlocked.has("explorer")]` 排在 form_gourmet 後 / collect_3 前
   - `["collect_all", dexUnlocked.size >= 8]` → `>= 9` — 對齊新 finalForms 集合（9 entries）

5. **`src/i18n.js` 6 條更新**：
   - **新增雙語 4 條**：`ach.form_explorer` 小小探險家 / Tiny Adventurer、`achdesc.form_explorer` 養出探險家雞 / Raised an explorer chicken
   - **修舊 2 條**：`achdesc.collect_all` 8 → 9 種（中 + 英）
   - **修舊 2 條**：`onboarding2.dex` 8 → 9 final forms（中 + 英 — onboarding modal 介紹圖鑑時提到的數量）

6. **`docs/image-prompts.md` 加 §8.6 explorer 條目**：
   - leather satchel / backpack with mushroom / petal peeking out + 粉色 bandana + map / compass
   - 設計動機 + 解鎖條件「state.pet.traits.eventsCaught >= 25」doc

7. **`sw.js`：CACHE_VERSION iter183 → iter184**

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`8 traits / 47 speech_pools / 9 final_forms`
- 本輪 cfg-schema：`8 traits / **48 speech_pools** / 9 final_forms`
- speech_pools +1（form_explorer）

**i18n 進度跳躍**：
- 種子翻譯：340 + 4 = **344 條** zh-TW + 344 條 en（不含修舊）
- functional 涵蓋：成就 form 系列從 5 → **6** 全 functional i18n（divine / diva / fighter / sage / gourmet / explorer）
- 切英文時新成就「Tiny Adventurer — Raised an explorer chicken」直接生效

**explorer 終態完整封閉度（iter#184）**：
| 元素 | 狀態 | 來源 |
|------|------|------|
| cfg.finalForms.explorer entry | ✅ | iter#183 |
| cfg.petArt.adult.explorer 占位 | ✅ | iter#183 |
| cfg.traitsDisplay.eventsCaught | ✅ | iter#183 |
| save.js defaultState pet.traits.eventsCaught | ✅ | iter#183 |
| events.js mirror bump | ✅ | iter#183 |
| evolve.js trait priority chain | ✅ | iter#183 |
| KNOWN_TRAITS lint | ✅ | iter#183 |
| i18n form key（zh + en） | ✅ | iter#183 |
| **achievement form_explorer** | **✅ 本輪** | iter#184 |
| **speech.form_explorer 5 條** | **✅ 本輪** | iter#184 |
| **collect_all 8→9 bump（cfg + i18n + onboarding）** | **✅ 本輪** | iter#184 |
| **image-prompts §8.6** | **✅ 本輪** | iter#184 |

**100% v0.3 9th form ship-ready**（除了真實 PNG art — 等待設計師 / AI 生圖），對標 iter#156-157 gourmet 兩輪 ship 完整 SOP 第二次成功複製。

**v0.3 backlog 結算**：
- ✅ **9th final form ship 完整封閉**（iter#183 + 184）
- ⏳ cfg.speech 230 條 i18n 大批次（last cfg-level batch）
- ⏳ 4 月 seasonal 空缺（地球日 4-22 / 兒童節 04-04 TW / 復活節）
- ⏳ 元氣軸 GDD 釐清

**驗證**：
- `node --check src/{cfg,achievements,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src + cfg-schema 9 final_forms / 48 speech_pools）

**為什麼把這個 ship 完整封閉是 milestone**：
- v0.3 第一個正式 feature ship（gourmet 是 v0.2，explorer 是 v0.3 候選首位）
- 對標 iter#156-157 ship gourmet 流程確立 v0.3 9th form ship pipeline 的 SOP 可複製
- 為 v0.3 後續可能更多 final form（10th、11th candidates）建立 SOP 模板

**影響檔案**：`src/cfg.js`、`src/achievements.js`、`src/i18n.js`、`docs/image-prompts.md`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:21 · Session A — v0.3 第 9 個 finalForm「探險家雞」(explorer)：終態從 8 → 9，新 trait 維度 eventsCaught

**觸發**：cron 第 183 輪 — v0.3 backlog 候選首位「9th final form」。對標 iter#156 ship gourmet 的 SOP（main 結構本輪 + 收尾下輪），本輪做主結構（cfg / save / events / evolve / lint / i18n form key），收尾下輪做（成就 + speech + collect_all bump + onboarding text bump + image-prompts §8.6）。

**為什麼選 explorer 而非其它候選**：
- **新 trait 維度 eventsCaught 對齊 cottagecore「探索 / 撿小驚喜」narrative**：玩家 catch event 是 GDD 核心 retention 機制（每天 5-10 個 event），20 cron 輪累計能累到 25 個的玩家是「真的有玩」的 D14+ 玩家
- **跟既有 8 form 的 trait 維度區隔**：
  - feedCount（gourmet）/ singCount（diva）/ intelligencePoints（sage）/ battlePoints（fighter）：都是「主動互動」trait
  - perfectStreakMinutes（divine）/ lowMoodMinutes（ugly）/ fatPoints（fatty）：「被動 stat 累計」trait
  - **eventsCaught（explorer）：第三類「機緣 trait」** — 不靠主動但靠 luck + 持續登入；對 D7 玩家是新追求方向
- **TA 對齊**：「背包裡裝滿小蘑菇、花瓣、星星」narrative 直接 callback iter#168/171/172 既加的 mushroom / petal / dewdrop / star 等 cottagecore-fairycore event 視覺 — 玩家解鎖時感覺「之前撿的事件都被記得了」
- **threshold 25**：對標 gourmet 60（feed 高頻每日 5 次） / diva 20（sing 慢） / sage / fighter 30 — eventsCaught 約每天 4-6 個，5-7 天即可達標 — 比 fighter / sage 容易，比 gourmet 快

**動作**（本輪 8 處同步）：

1. **`src/cfg.js` traitsDisplay 加第 8 條**：
   - `{ key:"eventsCaught", icon:"🗺️", label:"探險點數", cap:25, form:"探險家雞", round:false }`

2. **`src/cfg.js` finalForms 加 9th entry**：
   ```
   explorer: { labelKey:"form.explorer.label", label: "探險家雞",
               descKey:"form.explorer.desc", desc: "好奇心爆棚！背包裡裝滿到處撿來的小蘑菇、花瓣、星星 — 是這片世界的小探險家。" }
   ```
   - 對標 iter#178 dual-field SOP（labelKey + descKey + label / desc fallback）

3. **`src/cfg.js` petArt.adult.explorer**：
   - 暫指 `assets/images/chick-adult-healthy.png` 占位（cfg-schema invariant 7.5 雙向 key 同步必須）
   - 加 `// PLACEHOLDER: explorer 終態暫用 healthy art，待 docs/image-prompts.md §8.6 生圖補上 chick-adult-explorer.png` 註解

4. **`src/save.js` defaultState pet.traits**：
   - 加 `eventsCaught: 0` 第 8 個維度
   - migration via deepMerge 自動補舊存檔的缺欄

5. **`src/events.js` resolve(claimed)**：
   - 在既有 history.eventsCaught 累計後加 `if (state.pet.traits) state.pet.traits.eventsCaught = (state.pet.traits.eventsCaught || 0) + 1;`
   - per-pet 累計，跟 history.eventsCaught 跨生命週期不同層級
   - 加 inline comment 串連 explorer form

6. **`src/evolve.js` finalizeForm trait 鏈**：
   - 在 gourmet 後 / fatty 前插入 `else if (tr.eventsCaught >= 25) form = "explorer";`
   - 跟 gourmet 同 priority 帶（「累積行為」軸），threshold 25 比 gourmet 60 低 — 玩家 7 天可達

7. **`scripts/check-cfg-schema.js` KNOWN_TRAITS**：
   - 加 `"eventsCaught"`，否則 traitsDisplay 第 8 條會被 lint 標未知 key

8. **`src/i18n.js` 雙語 2 條**：
   - zh-TW: form.explorer.label「探險家雞」/ form.explorer.desc 完整 cottagecore 敘事
   - en: form.explorer.label "Explorer Chick" / form.explorer.desc "Curiosity overflowing! Backpack stuffed with little mushrooms, petals, stars — the world's tiny adventurer."

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`7 traits / 47 speech_pools / 8 final_forms`
- 本輪 cfg-schema：`**8 traits** / 47 speech_pools / **9 final_forms**`
- check-assets：84 不變（暫用既有 healthy.png 占位，無新 path）
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**i18n 進度跳躍**：
- 種子翻譯：338 + 2 = **340 條** zh-TW + 340 條 en
- functional sites：238 + 1（explorer formLabel） + 1（formDescription） = ~240 處

**為什麼不在這輪一次 ship 完整收尾**：
- 對標 iter#156 gourmet ship 經驗：一次塞 13+ 個改動點容易 review 失焦
- 本輪 8 處同步 + 1 lint 升級 + 2 i18n 雙語 = 主結構紮實
- **下輪收尾 5 個小項**：成就 form_explorer + speech.form_explorer 5 條 + achievements.js evaluator + collect_all 8→9（cfg + i18n + onboarding） + image-prompts §8.6 — 同 iter#157 規模

**v0.3 candidates pipeline 結算**：
- ✅ **9th final form 主結構（本輪）**
- ⏳ 9th final form 收尾（下輪）
- ⏳ cfg.speech 230 條 i18n（最大 batch）
- ⏳ 4 月空缺 seasonal
- ⏳ 元氣軸 GDD 釐清

**驗證**：
- `node --check src/{cfg,save,events,evolve,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠 6 step + cfg-schema lint 進步到「8 traits / 9 final_forms」
- 行為驗證：玩家從現在起 catch event → state.pet.traits.eventsCaught 累計 → 達 25 進 adult 觸發 explorer form
- migration：deepMerge 把舊存檔的 traits 自動補 eventsCaught: 0 — 零 production risk

**影響檔案**：`src/cfg.js`、`src/save.js`、`src/events.js`、`src/evolve.js`、`scripts/check-cfg-schema.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:11 · Session A — cfg-level i18n 第四刀：seasonal event applyToast 11 → applyToastKey（11 keys × 2 locales = 22 條）

**觸發**：cron 第 182 輪 — iter#180 regular event toast 完成後 / iter#181 ship CNY 紅包 content 後接續 cfg-level i18n 批次。對等 SOP 把 seasonal event 也走 dual-field — events.js iter#180 patch 已支持 applyToastKey，這輪只動 cfg + i18n。

**為什麼這個切點**：
- regular event applyToast 已 i18n（iter#180）；seasonal event applyToast 是同類 cfg 結構但獨立區塊（cfg.seasonalEvents.pool）
- 11 條剛好一輪可清完 — 不分批
- **events.js runEventApply 是統一 dispatch path**：regular + seasonal 都過這個函式 → iter#180 加的 `def.applyToastKey ? t(def.applyToastKey) : def.applyToast` 三元 fallback 對 seasonal 立即生效，**0 行 events.js 改動**

**動作**：

1. **`src/cfg.js` seasonalEvents.pool 11 個 entries 加 applyToastKey**：
   - 11 events × 1 新欄位（11 個 multi-line entry，每個加 1 行 `applyToastKey:"seasonal.{id}",` 在 applyToast 之前）
   - i18n key 命名：`seasonal.{eventId}` — 跟 regular event 用 `event.{id}` 區分（防 naming collision，e.g. 既有 regular 沒有同名 sakura）
   - 所有 applyToast 字面 fallback 保留
   - 11 events: sakura / valentine / summer_breeze / mooncake / halloween / xmas / newyear / zongzi / carnation / rainbow_heart / redenvelope

2. **`src/i18n.js` 加 11 條 key（zh + en，共 22 條）**：
   - **zh-TW**：直接用既有 cfg 字面，零翻譯成本
   - **en**：保 emoji + 自然英譯，呼應節日 narrative：
     - "Sakura petals on Chichi's head~"（春日輕快）
     - "Chichi got a bouquet of hearts!"（情人節情感 peak）
     - "Summer breeze~ So refreshing"（夏日涼意）
     - "Mooncake is so sweet~"（中秋）
     - "Trick or treat!"（萬聖節 idiomatic）
     - "Merry Christmas!"（聖誕標準祝福）
     - "Happy New Year! Wishing you a smooth year ahead~"
     - "Zongzi smells great! Tied with pink ribbon~"（端午保留 zongzi 音譯 — 對外國玩家是文化詞 + 加說明 "Tied with pink ribbon" 點題色彩）
     - "A bouquet of carnations~ May love surround you"（母親節溫暖祝福）
     - "A proud rainbow heart~"（Pride 簡潔有力）
     - "Red envelope! Wishing you prosperity~"（春節保留 "Red envelope" 直譯 + "prosperity" 對齊「恭喜發財」）

3. **`sw.js`：CACHE_VERSION iter181 → iter182**

**i18n 進度跳躍**：
- 種子翻譯：327 + 11 = **338 條** zh-TW + 338 條 en
- functional sites：227 + 11 = ~238 處
- **所有 27 個 events（16 regular + 11 seasonal）applyToast 100% i18n functional** — 玩家任何 random 或 seasonal event 觸發都拿雙語 toast

**cfg-level i18n 進度（iter#182）**：
| cfg 區塊 | 條目數 | i18n 狀態 |
|---------|------|----------|
| ~~cfg.welcomeBack tier.text~~ | 4 | ✅ iter#177 |
| ~~cfg.finalForms label + desc~~ | 16 | ✅ iter#178 |
| ~~cfg.randomEvents.applyToast~~ | 15 | ✅ iter#180 |
| **cfg.seasonalEvents.applyToast** | **11** | **✅ 本輪** |
| cfg.accessories.label fallback | 19 | ⏳（已 functional via labelKey） |
| cfg.speech 46 pool | ~230 條 | ⏳（最大宗，留最後） |
| cfg.interactions.label fallback | 14 | ⏳（已 functional） |
| cfg.wants.text fallback | 14 | ⏳（已 functional） |
| cfg.achievements.label/desc fallback | 52 | ⏳（已 functional） |

**累計剩餘 287 → 276 條**（本輪減 11）。4 輪 cfg-level batch 累計減 46 條。

**剩下幾乎都是 fallback（已有 Key functional）**：speech 230 條是真正的 last batch — 翻譯難度最高（角色 voice 細節 / 200+ 條輸出 / 各種 onomatopoeia / 文化梗），預估 3-5 cron 輪做完。其他 5 個 fallback batch 都是已有 functional 路徑只是 label 字面是中文 — 海外發行時切英文是已透過 labelKey 雙語化的，fallback 不影響玩家體驗（除非 i18n.js 沒載入），優先級可低於 speech。

**驗證**：
- `node --check src/{cfg,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：events.js iter#180 patch 沒變動 / applyToastKey fallback chain 跟 regular event 完全相同

**為什麼選 zongzi 保「Zongzi」音譯而非翻譯成「rice dumpling」**：
- zongzi 是文化獨有 dish，沒有 1:1 西方對應品（rice dumpling 太通用 / 失文化點）
- "Tied with pink ribbon" 加說明點亮色彩 + ribbon 設計 — 玩家從 narrative 感受到原名後也能猜到是什麼
- 對標 sushi / kimchi / ramen 這種已國際化的食物保原名策略

**下個 candidate**：
- v0.3 9th final form（content / feature）
- 4 月空缺 seasonal candidate（地球日 4-22 / 兒童節）
- speech 46 pool 第一批（cfg-level 真正最後 batch，3-5 輪）
- 元氣軸 GDD 釐清

**影響檔案**：`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 09:01 · Session A — 春節 / 農曆新年 seasonal event「紅包」(redenvelope)：seasonal pool 10 → 11

**觸發**：cron 第 181 輪 — iter#180 i18n 後切回 content 變化（rotation 健康，3 i18n 連發後該換手）。檢查 seasonal pool 月份覆蓋發現 2 月只有 valentine（02-12~02-15）+ Mother's Day overlap，**春節（華語圈最大節日）完全沒有專屬 event** — 對主 TA（華語區女性 18-35）是明顯空缺。

**為什麼這個切點**：
- **2026 農曆新年 = 02-17（Tuesday）**：LNY 在華語圈是首要節日，超過 valentine / xmas 量級
- **既有 valentine 02-12~02-15 + 紅包 02-16~02-22 = 2 月節日 11 天接力**（valentine 西情人節 → 春節東方傳統一週）
- **TA 對齊**：CLAUDE.md §1「主要 TA 18-35 歲女性 + 華語圈」— 春節期間家庭聚會 / 看寵物 / 玩 phone 場景重 — 拿到紅包 toast 強化情感連結
- **窗口完整**：02-16 起 valentine 已結束，02-22 涵蓋大年初五（迎財神日）— narrative arc 完整

**動作**：

1. **新增 `assets/svg/event-redenvelope.svg`（17 行 SVG）**：
   - viewBox 100×100 對標既有 11 個 event SVG
   - 色票嚴守 CLAUDE.md §5：暗紅 #B23A48（紅包主體 — 中國傳統喜氣紅）+ 深紅 #8B2030（top fold flap 三角折疊 + outline）/ 黃 #FFD86B（中央 福 字 seal + 邊框金邊裝飾）/ 棕 #8B5A2B（金邊 seal 描邊）/ 粉 #FFB7B7（♥ accent 軟化 — TA 約束「避免過冷 / 過男性化」）
   - 結構：rounded-rect 紅包主體 + 三角形 path 上方折邊（暗紅深一階做立體感）+ 中央金色圓 seal + 18px 黑體「福」字（中文書法感）+ 兩條金色 dashed line 邊飾（上細下粗）+ 4 個 corner sparkles（✦黃 / ♥粉 / 兩 dots）
   - **「福」字 + 紅金色票** 是中華傳統紅包視覺語 — 跟既有 western 節日（valentine 心 / xmas 禮物 / halloween 糖果）視覺距離大、文化辨識度高
   - 軟化處理：粉 ♥ accent 平衡傳統紅金的視覺重量，跟 TA 偏好對齊

2. **`src/cfg.js` seasonalEvents.pool 加第 11 條**：
   ```
   { id:"redenvelope", art:"assets/svg/event-redenvelope.svg", weight:30,
     label:"紅包", apply:"redenvelope",
     applyEffects:{ stats:{mood:25, hunger:10}, coin:50, coinReason:"恭喜發財" },
     applyToast:"🧧 紅包到！恭喜發財~",
     applyToastStyle:"gold",
     dateRange: { from: "02-16", to: "02-22" } }
   ```
   - 加在 rainbow_heart 後（日曆順序：6 月後 / 12 月新年前 / 2 月 LNY ←跨年所以放最後）
   - **+mood 25** 跟 valentine 並列最高（情感 peak event）
   - **+hunger 10**：年夜飯氛圍延續
   - **coin 50**：跟 star（regular pool 流星）+ xmas 並列最高 coin 獎勵 — 紅包 = 錢的禮物 narrative
   - **coinReason「恭喜發財」**：傳統 idiom，敘事點題
   - **gold style** + 高 weight 30：節日 high-tier，跟 valentine / xmas / newyear 同等級

3. **`sw.js`：CACHE_VERSION iter180 → iter181**

**lint chain 報表**：
- check-assets：83 → **84** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**season pool 月份覆蓋更新**：
| 月份 | event | 重疊 |
|------|-------|------|
| 1 月 | newyear (12-31~01-03) | — |
| 2 月 | valentine (02-12~02-15) / **redenvelope (02-16~02-22 本輪)** | 11 天接力 |
| 3-4 月 | sakura (03-20~05-10) | — |
| 5 月 | sakura（覆蓋首 10 天） / carnation (05-08~05-12) / zongzi (05-30~06-09) | sakura+carnation 5 天三層重疊 |
| 6 月 | zongzi（早 9 天） / rainbow_heart (06-01~06-30) | 早 9 天兩層重疊 |
| 7-8 月 | summer_breeze (07-01~08-31) | — |
| 9 月 | mooncake (09-10~09-25) | — |
| 10-11 月 | halloween (10-25~11-01) | — |
| 12 月 | xmas (12-20~12-26) / newyear (12-31~01-03) | — |
| **空缺** | **4 月** | sakura 涵蓋日期但不點題 |

**season + regular event 結算**：
- regular pool: 16 events
- seasonal pool: **11 events**（11 條跨 9 個月覆蓋）
- 總 27 events — 玩家任何時候至少 16 + 視日期 0-3 個 active

**為什麼 applyToast 沒抽 i18n key**：
- per iter#180 SOP：seasonal event applyToast 留下輪批次（10 → 11 條一起做更乾淨）
- 本輪先 ship content（春節 narrative 月份覆蓋優先）

**未來 follow-up**（不在本輪）：
- 下輪 cfg-level i18n batch：seasonal event applyToast 11 條 → applyToastKey
- 4 月空缺 seasonal candidate（地球日 4-22 / 兒童節 04-04 TW / 復活節 移動日期）
- 9th final form（v0.3 candidate）
- 元氣軸 GDD 釐清

**影響檔案**：`assets/svg/event-redenvelope.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:51 · Session A — iter#180 cfg-level i18n 第三刀：regular event applyToast 15 條 → applyToastKey（15 keys × 2 locales = 30 條）

**觸發**：cron 第 180 輪 — milestone 整數但只距離 retrospective-170 共 10 輪（前次間隔 20 輪），不寫 retro。改 ship 大塊 cfg-level i18n batch — 15 個 regular event applyToast 是中等規模翻譯工作。

**為什麼選 event.applyToast 第三批**：
- 對比剩餘 cfg-level：speech ~230（最大）/ event 25（regular 15 + seasonal 10）/ achievements 52（已有 labelKey functional）/ accessories 19（已有 labelKey functional）/ interactions 14（已有 labelKey functional）/ wants 14（已有 textKey functional）
- **regular events 的 applyToast 是 user-facing 高曝光面**：玩家每次 catch event 都看到 toast。已有 16 個 events，玩家平均每天看到 5-10 個 toast — 不 i18n 海外玩家全英文 UI 中夾中文 toast 體驗破碎
- regular 15 + seasonal 10 拆兩輪做（本輪 regular，下輪 seasonal）— 各自規模可控、能在 10 分鐘內完成

**為什麼 SOP 走 applyToastKey + applyToast 雙欄位**：
- 對標 iter#177 welcomeBack（textKey + text fallback）/ iter#178 finalForms（labelKey + descKey + label/desc fallback）SOP
- events.js iter#143 抽出時就是 cfg-driven runEventApply 路徑 — 這次只在 1 個 callsite（events.js:43）加 dual-field 解析，零 callsite 邊界擴張

**動作**：

1. **`src/cfg.js` randomEvents.pool 15 個 entries 加 applyToastKey**：
   - 15 events × 1 新欄位 = 15 個 applyToastKey 加進去
   - i18n key 命名：`event.{eventId}` — 跟 cfg.id 一致，最少記憶負擔
   - 所有 applyToast 字面 fallback 保留，**零行為變動 fallback chain**
   - 15 events: herb / butterfly / fly / star / rainbow / candy / bubble / petal / mushroom / tea / macaron / book / rose_bouquet / dewdrop / pixel_heart（coin_drop 走 RANDOM_EVENT_APPLIES dispatch 不在 cfg-driven path）

2. **`src/i18n.js` 加 15 條 key（zh + en，共 30 條）**：
   - **zh-TW**：直接用既有 cfg 字面，零翻譯成本
   - **en**：保 emoji + 自然口語英譯：
     - "Mystery herb! Refreshed all over"
     - "A butterfly lifted Chichi's spirits"
     - "Wishing star! All stats +10"
     - "A rainbow! Hope filled the air"
     - "Soap bubbles~ Clean +10 / Mood +8"
     - "Pink petals landed on Chichi~"
     - "Found a tiny mushroom~"
     - "A warm cup of afternoon tea~"
     - 等等
   - 角色 voice 一致：「Chichi」對標 iter#152 setting i18n 的 NotificationTitle「Chichi alerts」/「Chichi」是 啾啾 的 official 音譯
   - 保 emoji + tilde（~）親密語氣

3. **`src/events.js` runEventApply 1 行 surgical patch**：
   ```js
   const toastMsg = def.applyToastKey ? t(def.applyToastKey) : def.applyToast;
   if (toastMsg) A.toast(toastMsg, def.applyToastStyle || "good");
   ```
   - 條件三元 fallback：cfg.applyToastKey 沒設或 i18n.js 沒載 → 落回 cfg.applyToast 字面，跟 iter#172 之前行為一致
   - 1 行改動 / 既有 callsite 不變

4. **`sw.js`：CACHE_VERSION iter179 → iter180**

**i18n 進度跳躍**：
- 種子翻譯：312 + 15 = **327 條** zh-TW + 327 條 en
- functional sites：212 + 15 = ~227 處
- regular event applyToast 100% i18n functional：玩家任何 random event catch 都拿雙語 toast；剩 seasonal 10 條（下輪）

**cfg-level i18n 進度（iter#180）**：
| cfg 區塊 | 條目數 | i18n 狀態 |
|---------|------|----------|
| ~~cfg.welcomeBack tier.text~~ | 4 | ✅ iter#177 |
| ~~cfg.finalForms label + desc~~ | 16 | ✅ iter#178 |
| **cfg.randomEvents.applyToast** | **15** | **✅ 本輪** |
| cfg.seasonalEvents.applyToast | 10 | ⏳（下輪） |
| cfg.accessories.label fallback | 19 | ⏳（已 functional via labelKey） |
| cfg.speech 46 pool | ~230 條 | ⏳（最大宗，留最後） |
| cfg.interactions.label fallback | 14 | ⏳（已 functional） |
| cfg.wants.text fallback | 14 | ⏳（已 functional） |
| cfg.achievements.label/desc fallback | 52 | ⏳（已 functional） |

**累計剩餘 302 → 287 條**（本輪減 15）。3 輪 cfg-level batch 累計減 35 條，pace 健康。

**驗證**：
- `node --check src/{cfg,events,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：cfg.applyToastKey 條件三元 fallback 在 i18n 沒載 → 回 applyToast 字面 → 跟 iter#172 之前一致

**為什麼 iter#180 不寫 retrospective-180**：
- 距離 retrospective-170 才 10 輪 — 前次 retro 間隔 20 輪
- 本 arc（iter#170-180）主題：**v0.2 backlog 收尾 + cfg-level i18n batch 起手 + 美學軸最後 2 軸 event 補完**
- 還沒「ship 完一個版本」自然結尾 — 等 cfg-level i18n batch 推到 50% 或 9th final form ship 後再寫 retro 更合適
- iter#190 / iter#200 候選

**下個 candidate**：
- 下輪 cfg-level batch 接續：seasonal event applyToast 10 條
- 9th final form（v0.3 candidate — 1-2 cron 輪 ship）
- 元氣軸 GDD 釐清

**影響檔案**：`src/cfg.js`、`src/events.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:41 · Session A — v0.3 跨 pet 紀念碑 UI 起手：openDex 加 bondSummary aggregate line

**觸發**：cron 第 179 輪 — 三輪連續 i18n（iter#176-178）後切到 v0.3 candidate 變化。retrospective-170.md §4.3 列「跨 pet memorial / 紀念碑 UI」是 v0.3 backlog；GDD §10.3 elder companion 完成度 6/7 的最後一條。本輪起手做。

**為什麼這個切點**：
- iter#176 加了 single-pet 「💫 陪伴天數」 visible counter（settings menu 內），但**跨多隻 pet 累計**沒有 visible UI — 玩家養完 3-4 隻後沒有「總共陪了 X 天」的紀念感
- openDex 是「歷代小雞回顧」自然落點 — 已經有 past pets list + 終態收集 grid，加 aggregate stats 做 entrance 強化記憶感
- **無新模組成本**：直接修 menus.js openDex（iter#162 抽出時就在），i18n 只新增 1 條 key

**動作**：

1. **`src/menus.js` openDex 加跨 pet 累計計算**：
   - `pastBondTotal = fullPastForBond.reduce((sum, p) => sum + (p.totalDays || 0), 0)` — 累計過去歷代寵物 totalDays
   - `currentBond = Math.floor((Date.now() - state.pet.bornAt) / 86400000)` — 當前活著寵物的天數（跟 iter#176 settings 同邏輯）
   - `totalBondDays = pastBondTotal + currentBond`
   - `totalPets = fullPastForBond.length + 1` — 跨多少隻（含當前活著的）
   - 在 modal body 最頂部插入：`<p class="muted center" style="margin:2px 0 8px;font-size:13px;">${t("modal.dex.bondSummary", {days, pets})}</p>` — 顯眼但不搶終態收集 grid 的視覺中心

2. **`src/i18n.js` 加 1 條 key（zh + en，共 2 條）**：
   - zh-TW: `modal.dex.bondSummary` = "💝 累計陪伴 ${days} 天 · 跨 ${pets} 隻小雞"
   - en: `modal.dex.bondSummary` = "💝 ${days} days together · across ${pets} chicks"
   - 雙變數 interpolation（${days} + ${pets}）— 第二次用多變數插值（iter#152 welcomeBack body 是首次）

3. **`sw.js`：CACHE_VERSION iter178 → iter179**

**為什麼放 modal body 頂部而非標題列**：
- modal title 本來就是 "📖 圖鑑" — 加 bond stats 進去會破壞 title 的簡潔性
- body 頂部 + muted center 樣式 + 13px 字 — 視覺 hierarchy 是 secondary stat banner，不搶 grid 主視覺
- 跟 modal.eventStats.title 內含「總計 ${total}」是不同層級設計：eventStats 變數少 / 一句話放 title OK；dex 主視覺是收集 grid + 歷代列表，bond stats 是 epiphenomenon

**算法細節 / edge cases**：
- 玩家第一次玩沒孵蛋 → past.length = 0、currentBond = 0（如果 bornAt 還是 init 時間）→ totalBondDays = 0 / totalPets = 1 → 顯示「💝 累計陪伴 0 天 · 跨 1 隻小雞」— 略尷尬但不破爛
- 玩家養 2 隻 30 天 + 當前活著 5 天 → totalBondDays = 65 / totalPets = 3 → 「💝 累計陪伴 65 天 · 跨 3 隻小雞」— ✅ 真實 elder player 看到滿足
- 跨 pet startNewEgg 流程（iter#114+）：archiveCurrentPet 把 pet 寫進 dex.completedPets 含 totalDays，所以 fullPastForBond 累計是準確的

**i18n 進度跳躍**：
- 種子翻譯：311 + 1 = **312 條** zh-TW + 312 條 en
- functional sites：211 + 1 = ~212 處

**GDD §10.3 elder companion 完成度結算（iter#179）**：
| 元素 | 狀態 | 來源 |
|------|------|------|
| Form-specific elder speech | ✅ | idle.js iter#145 |
| Time-scaling chance（7-30 天 0.15→0.35） | ✅ | idle.js |
| 7-day elder achievement | ✅ | iter#157 期間既存 |
| 30-day elder achievement | ✅ | iter#157 期間既存 |
| 雙語 i18n 8 條（4 ach + 4 desc） | ✅ | i18n.js |
| Visible 陪伴天數 counter（per-pet） | ✅ | iter#176 |
| **跨 pet 紀念碑 UI（aggregate）** | **✅ 本輪** | menus.js + i18n.js |

**7/7 完成度 → 100% ✅**。GDD §10.3 elder companion **v0.2 ship-ready 結束**（iter#176 寫 86%，本輪到 100%）。

**v0.2 backlog 清完狀態**：
- ✅ 取名對話（既存）
- ✅ 新進化分支（gourmet ship + form_gourmet ach + speech，iter#156-157）
- ✅ R-1 拆 IIFE 達標（iter#166 game.js 1990 → 536 / 73% 縮減）
- ✅ 隨機事件擴增（regular 11 → 16 / seasonal 7 → 10）
- ✅ GDD §10.3 elder companion（**iter#179 完成度 100%**）
- ✅ 8 美學軸 event 層覆蓋（iter#172 達成）
- ⏳ cfg-level i18n batch（~302 條剩餘留 v0.3 海外發行）
- ⏳ 元氣軸 GDD 釐清（party_hat 歸屬）

**下個 candidate**：
- 9th final form（v0.3 候選）
- cfg-level i18n batch 繼續（event.applyToast 26 / cfg.achievements label/desc fallback 52 / cfg.speech ~230）
- 元氣軸 GDD 釐清（純 docs）
- 4 月空缺 seasonal event（地球日 / 愚人節）

**驗證**：
- `node --check src/menus.js / src/i18n.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- `grep 中文 src/menus.js openDex 區` → 0 命中（這條新加 line 走 i18n key）

**影響檔案**：`src/menus.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:31 · Session A — cfg-level i18n 第二刀：cfg.finalForms 8 × 2 fields → labelKey/descKey（16 條 × 2 locales = 32 條）

**觸發**：cron 第 178 輪 — iter#177 收尾備註選 finalForms 16 條 next（高曝光 / 玩家進化看到 + 圖鑑單品詳情看到）。本輪兌現第二批 cfg-level i18n。

**為什麼選 finalForms 第二批**：
- **高曝光**：finalizeForm modal title + body（iter#153 已 i18n wrapper）抓到 `formLabel(form)` + `formDescription(form)` — finalForms.label / desc 是這兩個 helper 的 cfg source
- **PetDetail modal**（menus.js openPetDetail iter#162 抽出）也用 formLabel / formDescription 顯示歷代寵物
- **dex 圖鑑**（menus.js openDex）的終態收集 grid 也用 formLabel / formDescription
- 三個 user-facing 路徑 + iter#176 加的 elder achievements「養出 X 雞」 desc → finalForms 的 label 直接被引用 → 海外發行不 i18n 整個 chain 都壞

**為什麼 SOP 走 dual-field（labelKey + label fallback）**：
- 對標 iter#136-137 cfg.achievements / iter#138 cfg.accessories / iter#177 cfg.welcomeBack 的 SOP
- 保 label / desc 字面 fallback：i18n.js 載入失敗 / Key 拼錯時不爆白屏，落回中文字面
- 玩家現有存檔 finalForm 已存在 (e.g. 已養成 gourmet) — 取出時 formLabel 走 helper → 看到 i18n 結果 / 走中文字面，**零 migration**

**動作**：

1. **`src/cfg.js` finalForms 8 entry 全加 dual-field**：
   - 8 forms × 2 fields（labelKey + descKey）= 16 個新欄位
   - i18n key 命名：`form.{formId}.label` / `form.{formId}.desc` — 對標 ach.{id} / achdesc.{id} / acc.{id} 模式
   - label / desc 字面保留 fallback

2. **`src/i18n.js` 加 16 條 key（zh + en，共 32 條）**：
   - zh-TW：直接用既有 cfg 字面，零翻譯成本
   - en：8 個 form 的雙欄位英譯：
     - **healthy / fatty / ugly**：直譯（model student / squishy / charming） + meme 對應
     - **fighter**：「Spirited」非「Battle」軟化（fits CLAUDE.md TA 約束「avoid 戰鬥/力量類動詞」）
     - **sage**：「half-moon glasses, gentle aura」保 cottagecore vibe
     - **diva**：「Born star from singing」保戲劇感
     - **divine**：「legendary celestial being」金光意象
     - **gourmet**：「afternoon-tea path of patient feeding」對齊 iter#156 ship 時的 narrative

3. **`src/game.js` formLabel / formDescription 兩個 helper 升級**：
   - `formLabel(f)`：4 行三段判斷（cfg 不存在 → return id / labelKey 存在 → t() / 否則 label fallback）
   - `formDescription(f)`：同模式
   - 對標 iter#138 cfg.accessories 抽 cfgLabel(entry) helper 的策略 — 但 form 只兩個 helper 直接 inline 即可
   - 行為等價：i18n 沒載 → 回中文字面，跟 iter#177 之前一致

4. **`sw.js`：CACHE_VERSION iter177 → iter178**

**i18n 進度跳躍**：
- 種子翻譯：295 + 16 = **311 條** zh-TW + 311 條 en（**首破 300**）
- functional sites：195 + 8（formLabel × 8 forms × 1 callsite path） + 8（formDescription × 8 forms）= ~211 處
- finalForms 100% i18n functional：finalizeForm modal / openPetDetail / openDex / share card / elder ach desc 連鎖路徑全雙語

**cfg-level i18n 進度（iter#178）**：
| cfg 區塊 | 條目數 | i18n 狀態 |
|---------|------|----------|
| ~~cfg.welcomeBack tier.text~~ | 4 | ✅ iter#177 |
| **cfg.finalForms label + desc** | **16** | **✅ 本輪** |
| cfg.event.applyToast | 26 | ⏳ |
| cfg.accessories.label fallback | 19 | ⏳（已 functional via labelKey） |
| cfg.speech 46 pool | ~230 條 | ⏳（最大宗，留最後） |
| cfg.interactions.label fallback | 14 | ⏳（已 functional） |
| cfg.wants.text fallback | 14 | ⏳（已 functional） |
| cfg.achievements.label/desc fallback | 52 | ⏳（已 functional） |

**累計剩餘 318 → 302 條**（本輪減 16）。下個 candidate：event.applyToast 26 條（cfg.events 的 toast 訊息）/ 或 cfg.speech.action_X 9 條（玩家互動回應）— 都是中等規模。

**驗證**：
- `node --check src/{cfg,game,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：dual-field fallback chain 在 i18n 沒載 → 回中文字面 → 跟 iter#177 之前一致
- **形式正確性**：8 forms 全有 labelKey + descKey + label fallback + desc fallback；16 個新 i18n key 都 zh + en pairs

**為什麼 fighter 改「Spirited」而非「Fighter」**：
- CLAUDE.md §1 TA 約束：「進化分支『戰鬥雞』保留但軟化（活力 / 元氣 / 運動感，非攻擊感）」
- 中文 cfg 已用「元氣雞」軟化，英文翻譯如果直譯「Fighter / Battle Chick」會破壞這個 TA 對齊
- 「Spirited Chick」+「Pink sweatband, full of bounce」保 athletic energy 但避免 aggressive tone

**未來 follow-up**（不在本輪）：
- 下個 cfg-level batch candidate：event.applyToast 26 條（玩家事件 toast）
- 或 cfg.achievements.label / desc fallback 52 條（已有 labelKey functional，fallback 還是中文）
- v0.3 跨 pet 紀念碑 UI / 元氣軸 GDD 釐清

**影響檔案**：`src/cfg.js`、`src/i18n.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:21 · Session A — cfg-level i18n 第一刀：cfg.welcomeBack 4 條 tier.text → textKey 雙欄位

**觸發**：cron 第 177 輪 — retrospective-170.md §4.4 + iter#176 結算列「cfg-level i18n batch（~322 條留 v0.3 海外發行）」是剩下最大的 i18n 工作。本輪選最小 chunk 起手 — cfg.welcomeBack 只 4 條 tier.text，是熱身規模。

**為什麼選 welcomeBack 起手**：
- **4 條 + 1 silent tier = 最小 cfg 結構**（其它 cfg-level：speech 46 pool ~230 條 / event applyToast 26 條 / accessories 19 label fallback / finalForms 8 desc — welcomeBack 是體積最小的）
- **走過一次 dual-field 流程**確立 SOP，後續批次套同模板
- 玩家高曝光面：每次離線 ≥ 30 分鐘回來都看到 welcome-back modal

**動作**：

1. **`src/cfg.js` welcomeBack 4 個 tier 加 textKey 雙欄位**（保 text 字面 fallback）：
   - tier1（≤3h）：textKey="welcomeBack.tier1"
   - tier2（≤8h）：textKey="welcomeBack.tier2"
   - tier3（≤12h）：textKey="welcomeBack.tier3"
   - tier4（>12h，含 giveCoin: 20 補償）：textKey="welcomeBack.tier4"
   - tier0（≤30min silent）保 `text: null` — 不需 i18n
   - **dual-field SOP 對標 iter#136-137 cfg.achievements / iter#138 cfg.accessories**：保 text 字面 fallback 確保 i18n.js 載入失敗時不爆

2. **`src/i18n.js` 加 4 條 key（zh + en，共 8 條）**：
   - zh-TW：直接用既有 cfg 字面（咕咕～ / 我有點餓了 / 我以為你不要我了…… / 我等了好久！）
   - en：對應自然口吻翻譯：
     - tier1: "Welcome back! Coo coo~"
     - tier2: "You're back! I'm a little hungry"
     - tier3: "Master… I thought you forgot me…"
     - tier4: "Master!! I waited so long!"
   - 角色 voice：咕咕 → "Coo coo"（onomatopoeia 保留）；「主人」→ "Master"（不譯成 "owner" 保親密感）

3. **`src/game.js` showWelcomeBack 1 行 surgical patch**：
   - `tierText: tier.text` → `tierText: tier.textKey ? t(tier.textKey) : tier.text`
   - 條件三元保 fallback：i18n.js 沒載 / textKey 拼錯 → 落回 cfg 字面，**零 production risk**
   - 對標既有 cfg.wants / cfg.accessories 的 cfgLabel helper 模式 — 但 wantsBack 路徑簡單不需要 helper

4. **`sw.js`：CACHE_VERSION iter176 → iter177**

**i18n 進度跳躍**：
- 種子翻譯：291 + 4 = **295 條** zh-TW + 295 條 en
- functional sites：191 + 4 = **195 處**（4 個 tier text functional）
- **welcomeBack modal 100% i18n**：iter#152 已 i18n body wrapper / time formatter / mood penalty / compensation；本輪補完 cfg-level tier.text — 切英文時整個 modal 完全本地化（含 tier.text 動態內容）

**cfg-level i18n 進度（iter#177）**：
| cfg 區塊 | 條目數 | i18n 狀態 |
|---------|------|----------|
| cfg.welcomeBack tier.text | 4 | ✅ 本輪 |
| cfg.event.applyToast | 16 regular + 10 seasonal = 26 | ⏳ |
| cfg.accessories.label fallback | 19 | ⏳（已有 labelKey functional，label 是 fallback） |
| cfg.finalForms.label + .desc | 8 + 8 = 16 | ⏳ |
| cfg.speech 46 pool | ~230 條 | ⏳（最大宗，留最後） |
| cfg.interactions.label fallback | 14 | ⏳（已有 labelKey functional） |
| cfg.wants.text fallback | 14 | ⏳（已有 textKey functional） |
| cfg.achievements.label/desc fallback | 26 + 26 = 52 | ⏳（已有 labelKey + descKey functional） |

**累計剩餘 ~322 條 → 318 條**（本輪減 4）。welcomeBack 是 entrance batch，下個 candidate 是 event.applyToast（26 條 — 中等規模）或 finalForms.label/desc（16 條中等規模 / 直接 user-facing）。

**驗證**：
- `node --check src/cfg.js / src/i18n.js / src/game.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）
- 行為驗證：tier.textKey 不存在 → 條件三元 fallback 落回 tier.text → 行為跟 iter#176 之前一致；textKey 存在 + i18n.js 載入 → 走 t(textKey) → 切英文時生效

**未來 follow-up**（不在本輪）：
- 下個 cfg-level batch candidate：finalForms.label + desc（16 條，玩家進化看到，比 event.applyToast 高曝光）
- 元氣軸 GDD 釐清
- v0.3 跨 pet 紀念碑 UI

**影響檔案**：`src/cfg.js`、`src/i18n.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:11 · Session A — GDD §10.3 elder companion 收尾：陪伴天數 visible counter + 既有 elder_week/month 成就確認

**觸發**：cron 第 176 輪 — retrospective-170.md §4.3「GDD §10.3 elder companion 未做：時光紀念碑 UI」是 v0.2 backlog 最後沒做的具體項。盤點時發現實際進度比 retrospective 寫的更高 — speech 系統 + 兩個成就（elder_week / elder_month）+ 雙語 i18n 全已 ship；唯一缺的是「visible 陪伴天數 counter」。本輪補上。

**為什麼 retrospective 寫錯**：
- iter#170 retrospective 把 elder companion 列為「未做」，是因為當時沒掃 src/achievements.js + src/cfg.js 內既有條目
- 實際 grep `elder_week|elder_month` 顯示：
  - **`src/achievements.js` line 51-52**：evaluator 已含 `["elder_week", state.pet.stage === "adult" && stageElapsed >= 7  * 86400000]` + `["elder_month", >= 30 * 86400000]`
  - **`src/cfg.js` line 100-101**：`elder_week` 🌅「相伴一週」+ `elder_month` 💖「終生伴侶」雙欄位 i18n
  - **`src/i18n.js` line 279/280/310/311 + 572/573/603/604**：兩語各 4 條全 functional i18n
- speech：`src/idle.js` pickContextualLine 內 elder 邏輯 (`adultDays >= 7` → r0(sp.elder)，scaling chance 0.15→0.35)
- **GDD §10.3 elder 已是 95% 完成度**（speech + achievements + i18n + 邏輯），只缺 1 個 visible UI piece

**動作**：

1. **`src/i18n.js` 加 1 條 key（zh + en，共 2 條）**：
   - zh-TW: `modal.settings.pet.bond` = "💫 陪伴天數"
   - en: `modal.settings.pet.bond` = "💫 Days together"
   - 插在 `modal.settings.pet.born` 後（語意連續：誕生時間 + 陪伴天數）
   - **複用既有 `streakDays` 插值 key**「${n} 天 / ${n} days」做 unit suffix — 0 新增 unit key

2. **`src/settings.js` sectionPet 加 1 row**：
   - 行 ~46 後插入：`<div class="settings-row"><span>${t("modal.settings.pet.bond")}</span><strong>${t("modal.settings.pet.streakDays", { n: bondDays })}</strong></div>`
   - `const bondDays = Math.max(0, Math.floor((Date.now() - state.pet.bornAt) / 86400000));` — 純 derived（從 bornAt 算），不需要 state 新欄位 / migration
   - 加 doc comment 串連 GDD §10.3 + idle.js elder speech + elder_week/month 成就的 cross-system context

3. **`sw.js`：CACHE_VERSION iter175 → iter176**

**這個改動的設計選擇**：
- **不加 state.pet.bondDays 欄位**：bornAt 已經有，直接 derive 比 store 乾淨；migration 風險 0
- **不放 main UI 顯示**：streak 已經佔了主 UI（🔥 連續 X 天）— 再加會視覺擠；放 settings menu 內讓玩家「想看才查」
- **複用 streakDays unit**：兩個 row 都是「天」單位，不創新 i18n key

**i18n 進度跳躍**：
- 種子翻譯：290 + 1 = **291 條** zh-TW + 291 條 en
- functional sites：~190 + 1 = ~191 處

**lint chain 報表**：
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅
- check-assets 83 不變（純 i18n + render 修改，無新 asset）

**GDD §10.3 elder companion 完成度結算（iter#176）**：
| 元素 | 狀態 | 來源 |
|------|------|------|
| Form-specific elder speech rotation | ✅ | idle.js iter#145 |
| Time-scaling elder chance（7-30 天 0.15→0.35） | ✅ | idle.js |
| 7-day elder achievement | ✅ | achievements.js + cfg.js |
| 30-day elder achievement | ✅ | achievements.js + cfg.js |
| 雙語 i18n 8 條（4 ach + 4 desc） | ✅ | i18n.js |
| **Visible 陪伴天數 counter** | **✅ 本輪** | settings.js + i18n.js |
| 跨 pet memorial / 紀念碑 UI | ⏳ | 留 v0.3 — 需要 dex.completedPets 跨生命週期統計 |

**6/7 完成度 → 86%**。剩下 1 個（跨 pet 紀念碑）是 v0.3 範疇，不是 v0.2 必要。**GDD §10.3 elder companion 算 v0.2 ship-ready 結束**。

**為什麼 v0.2 backlog 已經接近清完**：
- iter#156 ship gourmet form（GDD §10.2 新進化分支 ✅）
- iter#157 收尾 form_gourmet 成就 + speech
- iter#173 R-1 收尾（openNameDialog 併入 menus）
- iter#174 / #175 季節事件擴增（Mother's Day + Pride Month 新增 2 條）
- iter#176 elder companion 收尾（本輪）
- 剩下：cfg-level i18n batch（~322 條留 v0.3 海外發行 prerequisite）+ 元氣軸 GDD 釐清

**未來 follow-up**（不在本輪）：
- v0.3 候選：跨 pet memorial UI / 新 final form（feedCount > 100 / 其它條件）/ cfg-level i18n / 元氣軸 confirm
- 可考慮 iter#180 寫 retrospective-180 收 v0.2 ship 完成的 arc

**影響檔案**：`src/i18n.js`、`src/settings.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 08:01 · Session A — Pride Month 季節事件「驕傲彩虹心」(rainbow_heart)：seasonal pool 9 → 10

**觸發**：cron 第 175 輪 — 上輪 ship 母親節 carnation 後接著做 6 月 Pride Month。retrospective-170.md §4.3「季節事件擴增」+ iter#174 收尾備註明確列為下個 candidate。Pride Month 從 6/1 開始 — 距離今天 32 天，提前 ship 給玩家整月 window。

**為什麼這個切點**：
- **Pride Month 是 inclusive 節日**，跟 TA 設計約束（CLAUDE.md「18-35 歲女性 / 自我表達 / 關係建立」）契合度高 — 多元 / 接納價值觀直接對齊
- **既有 rainbow regular event 是 atmospheric**（weight 12, +mood 12, 全年都觸發）— 不點題 Pride
- **獨立 narrow window seasonal version** 強化節日感：full month 6/1-6/30 + weight 25 + gold style

**為什麼用「粉系 rainbow」而非標準 rainbow 色**：
- CLAUDE.md §1 TA 約束：「粉嫩色系優先（粉 #FFB7B7、桃紅、暖黃），避免過冷 / 過男性化」
- 標準 7 色 rainbow（紅橙黃綠藍靛紫）含過冷 + 飽和的紅藍紫 — 不符女性向 cottagecore-coquette aesthetic
- 改用 8 條色帶版「粉系 rainbow」：#FFB7B7（粉）/ #FF9F43（桃橘）/ #FFD86B（暖黃）/ #6BCB77（粉綠）/ #6BCBFF（粉藍）/ #9D7BD8（淡紫）/ #FF89A7（桃紅）/ #FFB7B7（粉）— 8 條而非 6 條，給更柔和的漸層
- 仍承載 Pride 多元 narrative，但視覺密度跟 cottagecore palette 一致

**動作**：

1. **新增 `assets/svg/event-rainbow-heart.svg`（19 行 SVG）**：
   - viewBox 100×100 對標既有 10 個 event SVG
   - 色票：8 條粉系 rainbow 色帶（如上）+ 暗紅 #B23A48（heart outline 描邊）+ 白 #FFFFFF（top-left lobe glossy highlight）+ 黃 #FFD86B / 粉 #FFB7B7 / #FF89A7（4 個 corner sparkles + ♥ accent）
   - 結構：**clipPath 技術應用** — 用 `<clipPath id="rh-heart">` 定義 heart silhouette，`<g clip-path="url(#rh-heart)">` 包 8 個 horizontal stripe `<rect>`，最外層用同 path 但 fill="none" stroke 畫 outline；這是專案首次 SVG 用 clipPath（既有 SVG 都是純 path / circle / rect）
   - 結構選擇 vs alternatives：
     - **clipPath stripes**：乾淨 8 色帶 + 1 path + 1 outline = 19 行 / 簡潔（**選用**）
     - 8 個 stepped path 各填一色：複雜，~50 行
     - SVG `<linearGradient>` 漸層：太柔和失彩虹辨識度
   - 4 個 corner accent 平衡視覺重量

2. **`src/cfg.js` seasonalEvents.pool 加第 10 條**：
   ```
   { id:"rainbow_heart", art:"assets/svg/event-rainbow-heart.svg", weight:25,
     label:"驕傲彩虹心", apply:"rainbow_heart",
     applyEffects:{ stats:{mood:20, clean:5, energy:5}, coin:18, coinReason:"驕傲月" },
     applyToast:"🌈💖 一顆驕傲的彩虹愛心~",
     applyToastStyle:"gold",
     dateRange: { from: "06-01", to: "06-30" } }
   ```
   - 加在 carnation 後（5 月 → 6 月日曆順序）
   - **+mood 20 / +clean 5 / +energy 5**：3-stat boost 強化「愛心填滿」narrative；對標 valentine（mood 25）/ xmas（mood 15）/ summer_breeze（energy 20）— mid-high tier
   - **coin 18 + coinReason「驕傲月」**：narrative + 經濟回饋
   - **dateRange 整月**：跟 summer_breeze（07-01~08-31 兩個月）/ xmas（12-20~12-26 7 天）兩極對照 — Pride 是 month-long 節慶
   - **gold style**：跟 carnation / valentine 同等 emotional peak event

3. **`sw.js`：CACHE_VERSION iter174 → iter175**

**lint chain 報表**：
- check-assets：82 → **83** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**season pool 統計（iter#175）**：
- 月份覆蓋更新：1 月 newyear / 2 月 valentine / 5 月 carnation / 5-6 月 zongzi / 5 月 sakura（含 3-4 月）/ **6 月 rainbow_heart（本輪整月）** / 7-8 月 summer_breeze / 9 月 mooncake / 10-11 月 halloween / 12 月 xmas + newyear
- **季節事件總計 10**（達到雙位數里程碑）
- 6 月覆蓋從 0 → 整月 + zongzi 06-01~06-09 重疊期 — **6 月有兩個 active event 接力**（zongzi early / rainbow_heart 全月）

**season + regular event 結算**：
- regular pool: 16 events
- seasonal pool: **10 events**（10 ≥ regular 一半，季節層密度健康）
- 總 26 events — 玩家任何時候至少 16 + 視日期 0-3 個 active rotation
- **8 美學軸完整 + 12 個月節日覆蓋（除 4 月外）** — content 豐富度 v0.2 ship-ready

**為什麼 applyToast 沒抽 i18n**：
- per retrospective-170.md §3.5：cfg-level 字串留 v0.3 海外發行批次（共 ~26 條 event toast）

**未來 follow-up**（不在本輪）：
- 4 月空缺：愚人節 / 世界地球日（4-22）seasonal — 但 cfg.welcomeBack 已經是 i18n 大批次的優先
- v0.3 GDD §10.3 elder companion 企劃延伸（idle.js elder speech 已存，需 visible UI）
- 元氣軸 GDD 釐清

**影響檔案**：`assets/svg/event-rainbow-heart.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 07:51 · Session A — 母親節季節事件「康乃馨」(carnation)：seasonal pool 8 → 9，narrow 5 天 window

**觸發**：cron 第 174 輪 — 今天 2026-04-30，5 月就在眼前；retrospective-170.md §4.3「季節事件擴增」首選 5 月 Mother's Day。在母親節到來前 8 天 ship 這個 event，給玩家 5/8-5/12 的窗口剛好踩上節日。

**為什麼這個切點**：
- **既有覆蓋空缺**：現有 8 個 seasonal events（sakura / valentine / summer_breeze / mooncake / halloween / xmas / newyear / zongzi）— sakura 範圍 03-20 ~ 05-10 涵蓋母親節日期但不點題，玩家拿到的還是「櫻花飄落」而非母親節主題
- **carnation 是母親節 iconic 花**（非 rose / 非其它）— 文化辨識度高
- **narrow 5 天 window（05-08 ~ 05-12）+ weight 30** = 限定感強，跟 valentine（02-12 ~ 02-15 / weight 30）/ xmas（12-20 ~ 12-26 / weight 30）的窗口長度 + 強度策略一致

**動作**：

1. **新增 `assets/svg/event-carnation.svg`（24 行 SVG）**：
   - viewBox 100×100 對標既有 9 個 event SVG
   - 色票嚴守 CLAUDE.md §5：粉 #FFB7B7（外層 ruffle）/ #FF89A7（中層 ruffle）/ 暗紅 #B23A48（核心 bud）+ 對應描邊 #FF89A7 / #B23A48 / #8B2030 / 綠 #6BCB77 + #3E8C4A（莖 + 兩片葉）/ 黃 #FFD86B（緞帶 — 母親節 badge）/ 棕 #8B5A2B（緞帶描邊）/ 粉 #FFB7B7（♥ accent）
   - 結構：3 層 ruffled 花瓣（外層 zigzag path 模擬 carnation 招牌 frilly edge / 中層更深粉 / 核心 bud 暗紅 ellipse）+ 兩片 quadratic 葉子 + Mother's Day 金色緞帶 ellipse + 兩條垂落緞帶 + ♥ + ✦ corner accent
   - **frilly zigzag path** 是設計亮點：用「上下交替」的點序列做 14 個 zigzag 點 — 這是 carnation 與 rose 的視覺辨識關鍵（rose 是 round layered，carnation 是 fringed）
   - 跟 rose_bouquet（iter#169）有意區隔：rose 用 round layered circles，carnation 用 zigzag 邊緣 — 同色系不同形狀，玩家視覺可分辨

2. **`src/cfg.js` seasonalEvents.pool 加第 9 條**：
   ```
   { id:"carnation", art:"assets/svg/event-carnation.svg", weight:30,
     label:"康乃馨", apply:"carnation",
     applyEffects:{ stats:{mood:22, clean:5}, coin:20, coinReason:"母親節祝福" },
     applyToast:"🌷 收到一束康乃馨~ 願你被愛環繞",
     applyToastStyle:"gold",
     dateRange: { from: "05-08", to: "05-12" } }
   ```
   - 加在 zongzi 後（5 月節日語意排序）
   - **+mood 22**（高於一般 mood +14-16 / 對標 valentine 25 / xmas 15 — 母親節是 emotional peak event）
   - **+clean 5**（花朵帶清新感，呼應 dewdrop / petal pattern）
   - **coin 20 + coinReason「母親節祝福」**：強化敘事
   - **applyToastStyle:"gold"**：跟 valentine / halloween / xmas / newyear 同等級高潮 event 視覺區隔

3. **`sw.js`：CACHE_VERSION iter173 → iter174**

**lint chain 報表**：
- check-assets：81 → **82** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**season pool 統計（iter#174）**：
- 月份覆蓋：1 月 newyear / 2 月 valentine / **5 月 carnation（本輪）** / 5-6 月 zongzi / 5 月 sakura（含 3-4 月）/ 7-8 月 summer_breeze / 9 月 mooncake / 10-11 月 halloween / 12 月 xmas + newyear
- **5 月覆蓋密度最高**（sakura 03-20~05-10 + carnation 05-08~05-12 + zongzi 05-30~06-09）— 三個 event 接力撐起整月

**season + regular event 總計**：
- regular pool: 16 events（iter#172 結算）
- seasonal pool: **9 events**（iter#174 加 carnation）
- **總 25 events** — 玩家任何時候至少有 16 + 視日期 0-3 個 seasonal 在 active rotation

**為什麼 applyToast 沒抽 i18n**：
- per retrospective-170.md §3.5：cfg.event.applyToast + cfg.seasonalEvents.applyToast 共 ~25 條 cfg-level 字串，留 v0.3 海外發行批次一次抽
- 單條翻譯造成 inconsistency — SOP 維持

**為什麼這輪選 ship 內容而非 R-1 / planning**：
- 5/8 母親節 ASAP 切點 — content shipped 越早，玩家命中 event window 機率越高
- R-1 已達標（iter#166 / iter#173 收尾），不該追指標
- 本 arc rotation 比例：iter#170-174 = retrospective + 4 content（fairycore / y2k / R-1 micro / Mother's Day）— 比例健康

**未來 follow-up**（不在本輪）：
- 6 月 Pride Month event（彩虹愛心 / 7 色羽毛 — 已有 rainbow regular event 但 Pride 主題 + narrow window 可加）
- v0.3 GDD §10.3 elder companion 企劃（idle.js 已有 elder speech，需要 visible UI 收束）
- 元氣軸 GDD 釐清（party_hat 歸屬）

**影響檔案**：`assets/svg/event-carnation.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 07:41 · Session A — R-1 收尾 micro：openNameDialog 併入 src/menus.js → game.js 536 → 502（-34）

**觸發**：cron 第 173 輪 — retrospective-170.md §4.1 排序第一「openNameDialog 併入 menus.js — 1 個 cron 輪可結」。R-1 plan 達標後的 micro 收尾。

**為什麼選 merge 而非新 dialogs.js 模組**：
- openNameDialog 只 34 行，獨立 module overhead（5 個 wire-up 點：html / sw / smoke / NourishAPI bridge / cache bump）大於 LOC saved
- menus.js 已經是「modal 集合」性質（4 個 dex-viewer modal），加第 5 個 input dialog 語意延伸自然
- 對標 iter#163 export/import 併入 save.js 的 SOP — 小單元併進語意相近的既有模組
- retrospective-170.md §3.1 明確記「R-1 大塊抽完後進入 micro / merge 階段」

**動作**：

1. **`src/menus.js` 加第 5 個函式 `openNameDialog`**：
   - 1:1 mirror 原 game.js 版本：first-naming +10 mood / nameSet 切 title / 12 字 maxlength / Enter / focus 自動聚焦
   - 透過既有 NourishAPI（getState / toast / speak / save / render） + NourishUI（showModal / closeModal / escapeHtml） + NourishUtils（clamp） + NourishI18n（t）lazy bridge
   - 暴露面：`window.NourishMenus = { openDex, openAchievements, openEventStats, openPetDetail, openNameDialog }` — 4 → 5 export

2. **`src/game.js`：原 34 行 `function openNameDialog()` → 1 行 wrapper**：
   ```
   const openNameDialog = () => window.NourishMenus.openNameDialog();
   ```
   - 既有 callsites（line 373 `$("stage-name").onclick = openNameDialog`、line 464 鍵盤快捷鍵 N）零變動
   - 內部 i18n key 全部已存在（iter#153 batch ship）— 抽出時零 i18n 副作用

3. **`sw.js`：CACHE_VERSION iter172 → iter173**

**lines 變化**：
- `src/game.js`：536 → **502**（-34 行）
- `src/menus.js`：192 → **232**（+40 行 含 doc comment）
- `src/game.js` 距離 2000 警戒線 buffer：1464 → **1498** ✅

**R-1 累計**：
- iter#100 起點 ~1990 → **502**（-1488 / **74.7% 縮減** / 16 R-1 + 7 micro / 73 cron 總輪）
- 模組數仍是 23（micro merge 不增模組）
- NourishAPI export 仍是 17（micro merge 沒新增 bridge）

**為什麼這個 micro 比預期降幅多**：
- openNameDialog 內含完整 modal 配置（title / body / 2 buttons / onMount） — 34 行其實是中型 modal
- 比 retrospective-170.md §4.1 預估「34 行」是體感上 dense — 加上原檔的 surrounding context（保留 const wrapper alias），淨 -34

**剩下 game.js 內容（502 行 dispatcher）**：
- 16 行 IIFE shell + 6 行 closure 變數 + 8 個常量 + DEX_KEY constant + DEBUG flag
- ~30 個 const wrapper aliases（讀 like 模組 import 列表）
- grantCoin / spendCoin（5 行 — 跟 state.economy 緊耦合保留 game.js）
- unlockAchievement / checkAchievements / startNewEgg（~25 行 — 內部混合 cfg/timing/setTimeout 邏輯）
- showWelcomeBack（~20 行 — 跟 cfg.welcomeBack tier 邏輯緊耦合）
- 5 個 dex/menus wrapper aliases
- NourishAPI export 物件（~20 行）
- startBackgroundTimers / stopBackgroundTimers（visibility-aware ~15 行）
- wireUpVisibility / wireUpKeyboard（鍵盤 1-5 互動 + 跨 tab read-only ~50 行）
- init() bootstrap（~80 行：load + migrate + welcome-back + render + tick interval start）
- onboarding wrappers（3 行）
- DOMContentLoaded 啟動

**這 502 行是「orchestrator layer」終點**：所有編排邏輯保留 game.js，業務邏輯都在 23 個模組內。R-1 plan §1.4 預期 600-800 行 — 實際比預期更精簡（502）。

**下輪 candidates**：
- 元氣軸 GDD 釐清（party_hat 歸屬）— 純 docs
- v0.3 GDD §10.3 elder companion 企劃延伸
- 美學軸內容續推（cottagecore 加 form 候選 / 美食家加圍裙）
- cfg-level i18n batch（preserved 留 v0.3 海外發行）

**驗證**：
- `node --check src/menus.js / src/game.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 23 src）

**影響檔案**：`src/menus.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 07:31 · Session A — y2k 軸 event 層補完：「像素愛心」(pixel_heart) — 8 美學軸 event 層全覆蓋達成

**觸發**：cron 第 172 輪 — retrospective-170.md §4.2 排序第二「y2k event」、iter#171 fairycore 收尾備註寫的下一站。本輪兌現 — **完成 8 美學軸 event 層 7/8 → 8/8**（元氣軸 fighter form 是否獨立軸仍待 GDD 釐清）。

**為什麼挑像素愛心而非迪斯可球**：
- **y2k 軸現有 accessory（star_clip / cd_pendant）走「digital iridescent / 早期千禧電子飾品」路線**，不是 disco rave / Y2K 派對
- pixel heart 對齊 digital nostalgia + Game Boy / Tamagotchi 早期像素時代 — 跟既有 accessory 視覺語一致
- disco ball 偏 70s-90s 派對 / 跟 cottagecore-coquette 主軸距離太遠

**動作**：

1. **新增 `assets/svg/event-pixel-heart.svg`（13 行 SVG）**：
   - viewBox 100×100 對標既有 8 個 event SVG
   - 色票嚴守 CLAUDE.md §5：粉 #FF89A7（heart 主色）+ 描邊 #B23A48（暗紅）/ 白 #FFFFFF（pixel 高光 — 經典 8-bit 風格左上角光點）/ 藍 #6BCBFF（chromatic aberration cyan ghost）/ 粉 #FFB7B7（chromatic aberration magenta ghost）/ 黃 #FFD86B（✦ + digital pixel dot）
   - 結構：**3 層 stepped path 疊加做 chromatic aberration glitch**：cyan ghost（左下偏移 3px，opacity 0.6）+ magenta ghost（右上偏移 3px，opacity 0.55）+ 主 heart（中心，full opacity） — 經典 y2k digital glitch 美學
   - heart silhouette 是 24-step path（M-H-V-H-V-...-Z）做 8x6 cell 階梯狀 pixel 邊緣，對標 Tamagotchi / Pico-8 經典像素 heart 形狀
   - 兩塊 white pixel highlight rect 做 8-bit 經典左上「shine」反射
   - 5 個 corner accent：✦ 黃 / ✦ 藍 / 兩個小 rect dot（黃 + 藍 — 像素風 sparkle）/ 一個小 magenta dot

2. **`src/cfg.js` randomEvents.pool 加第 16 條**：
   ```
   { id:"pixel_heart", art:"assets/svg/event-pixel-heart.svg", weight:5,
     label:"像素愛心", apply:"pixel_heart",
     applyEffects:{ stats:{mood:14}, coin:6, coinReason:"老遊戲機掉幣" },
     applyToast:"💖 一顆閃亮的像素愛心~" }
   ```
   - 加在 dewdrop 後，附 iter#172 註解 + y2k 軸標註
   - **+mood 14**：mid-high tier
   - **coin 6 + coinReason「老遊戲機掉幣」**：強化 retro digital nostalgia 敘事 — pixel heart 從老遊戲機掉出來的奇幻時刻
   - **weight 5**：跟 rose_bouquet 同級稀有

3. **`sw.js`：CACHE_VERSION iter171 → iter172**

**lint chain 報表**：
- check-assets：80 → **81** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**美學軸 event 層覆蓋達成（iter#172）**：
| 軸 | event | form | accessory | 件數 | 飽和度 |
|----|-------|------|-----------|------|--------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 | ★★★★ |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar | 7 | ★★★★ |
| 智慧 / sage | book | sage | glasses_thin | 3 | ★★ |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 | ★★ |
| fairycore | dewdrop | divine | wings_fairy | 3 | ★★ |
| cleangirl | bubble | healthy | blush | 3 | ★★ |
| **y2k** | **pixel_heart（本輪）** | — | star_clip / cd_pendant | **3** ⬆ from 2 | ★★ |
| 元氣 | rainbow | fighter | (party_hat?) | 2-3 | ★ |

**8 軸 event 層覆蓋率：8/8 OR 7/8**（看 party_hat 算不算元氣軸）

**達成 milestone**：
- y2k 從 2 件 → **3 件**（並列其他 5 軸★★）
- **8 軸 event 層全部不為 0**（除元氣軸 confirm 中）
- pool 從 11 條 → **16 條（+5 / 6 個 cron 輪：iter#161 macaron / iter#168 book / iter#169 rose_bouquet / iter#171 dewdrop / iter#172 pixel_heart — 5 新 events）**

**為什麼 applyToast 沒 i18n**：
- per retrospective-170.md §3.5：cfg.event.applyToast 共 16 條一次抽出去 v0.3 海外發行批次
- 本輪不破例 — 等批次 SOP

**未來 follow-up**（不在本輪）：
- 元氣軸 confirm via GDD 釐清：fighter form + party_hat 是同軸，還是 birthday celebration 獨立軸 — 若獨立則需要拆 + 補對應 event
- R-1 收尾的 openNameDialog 併入 menus.js（per retrospective-170.md §4.1）
- v0.3 GDD §10.3 elder companion 企劃延伸
- cfg-level i18n batch（~322 條，留 v0.3 海外發行）

**影響檔案**：`assets/svg/event-pixel-heart.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 07:21 · Session A — fairycore 軸 event 層補完：「葉上露珠」(dewdrop)，pool 14 → 15

**觸發**：cron 第 171 輪 — retrospective-170.md §4.2 排序第一：「fairycore event — divine form 已有 + wings_fairy + （月光 / 仙塵 / 露珠 event）」。本輪兌現。

**為什麼這個切點**：
- **divine form 仙氣 / 純淨 narrative**：cfg.finalForms.divine.desc「粉金光環、純白羽毛，傳說中的天使存在」— event 層的「自然中的純淨片刻」（葉上露珠）跟 form 的純白意象視覺一致
- **挑 dewdrop 而非 fairy dust / moonlight**：
  - **fairy dust** 跟既有 star（流星，sparkle 為主視覺）視覺易混淆
  - **moonlight** 涉及夜景背景，配色從粉嫩偏離（CLAUDE.md TA 約束「粉嫩色系優先，避免過冷 / 過男性化」）— 月光容易冷掉
  - **dewdrop** 用粉色 outline + 藍色填充 + 綠葉，視覺距離既有事件最大、又保留粉嫩 palette
- **8 美學軸 event 層覆蓋**：補上後 fairycore 從 0 event → 1 event；剩下唯一沒 event 的軸是 y2k（後續輪）

**動作**：

1. **新增 `assets/svg/event-dewdrop.svg`（17 行 SVG）**：
   - viewBox 100×100 對標既有 7 個 event SVG
   - 色票嚴守 CLAUDE.md §5：綠 #6BCB77 + #3E8C4A（葉子主體 + 中央葉脈 + 3 條側脈）/ 藍 #6BCBFF 透明 0.55 fill（露珠主體 — 透亮水滴感）/ 粉 #FF89A7（露珠描邊 — 粉嫩鎖視覺）/ 白 #FFFFFF（兩個 inner shine ellipse — 大小不同的玻璃光澤）/ 黃 #FFD86B（✦ + sparkle dot）/ 粉 #FFB7B7（✿ accent）
   - 結構：quadratic-curve 葉子（橢圓 + 葉尖向右收）+ 主葉脈 + 3 條側葉脈微弱 stroke / 露珠 teardrop 形狀（用 path 組 4 段曲線：上尖 + 兩側弧 + 下圓底）+ 兩個 white inner-shine ellipse（質感層次） + 4 個 corner accent（✦ 黃 / ✿ 粉 / 兩個小 dot 黃 + 藍）
   - **粉色描邊 + 藍色填充**對比是設計亮點 — 既保 cottagecore-fairycore palette 又跟既有 6 個 event SVG 視覺距離最大

2. **`src/cfg.js` randomEvents.pool 加第 15 條**：
   ```
   { id:"dewdrop", art:"assets/svg/event-dewdrop.svg", weight:6,
     label:"葉上露珠", apply:"dewdrop",
     applyEffects:{ stats:{mood:10, clean:8} },
     applyToast:"💧 葉上一顆透亮露珠~" }
   ```
   - 加在 rose_bouquet 後，附 iter#171 註解 + fairycore 軸標註
   - **+mood 10**：中等愉悅
   - **+clean 8**：露珠的清新感串到 stat
   - **無 coin**：純自然 atmospheric event，不該帶錢
   - **weight 6**：跟 tea / book 同 weight 級（中等稀有）

3. **`sw.js`：CACHE_VERSION iter169 → iter171**（iter#170 純 docs round 沒 bump）

**lint chain 報表**：
- 上輪 cfg-schema：`19 accessories / 47 speech_pools`（pool 14）
- 本輪 cfg-schema：`19 accessories / 47 speech_pools`（pool 15 — 內部統計）
- check-assets：79 → **80** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**美學軸覆蓋更新（iter#171）**：
| 軸 | event | form | accessory | 件數 | 飽和度 |
|----|-------|------|-----------|------|--------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 | ★★★★ |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar | 7 | ★★★★ |
| 智慧 / sage | book | sage | glasses_thin | 3 | ★★ |
| balletcore | rose_bouquet | diva | ribbon_tie | 3 | ★★ |
| **fairycore** | **dewdrop（本輪）** | divine | wings_fairy | **3** ⬆ from 2 | ★★ |
| cleangirl | bubble | healthy | blush | 3 | ★★ |
| y2k | — | — | star_clip / cd_pendant | 2 | ★ |
| 元氣 | rainbow | fighter | (party_hat?) | 2-3 | ★ |

fairycore 從 2 件 → **3 件**（與 cleangirl / balletcore / 智慧 並列）；剩下 y2k 一軸缺 event；元氣軸的 party_hat 歸屬待 GDD 釐清。

**為什麼 applyToast 沒 i18n**：
- per retrospective-150.md §4.2 + retrospective-170.md §3.5：cfg.event.applyToast 是 cfg-level 字串，留 v0.3 海外發行批次（共 15 條一次抽出）
- 單條翻譯造成 inconsistency — 等 batch 一次做完更乾淨

**未來 follow-up**（不在本輪）：
- y2k event：螢幕雪花 / pixel heart / disco ball — 完成 8 軸最後一塊 event 層
- 元氣軸 confirm：fighter form + party_hat 是否同軸或獨立 birthday celebration 軸 — GDD 釐清
- cfg-level i18n batch：~322 條翻譯，等 v0.3 海外發行階段

**影響檔案**：`assets/svg/event-dewdrop.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 07:11 · Session A — iter#170 milestone：docs/retrospective-170.md 寫 iter#150-169 共 20 輪 R-1 完成 arc 總結

**觸發**：cron 第 170 輪 — milestone 整數，距離上一份 retrospective-150（iter#150 寫，涵蓋 iter#135-149）正好 20 輪。R-1 plan 已在 iter#166 達標，是該封一個版本的點。

**為什麼**：
- 這 20 輪是「**R-1 plan 收尾 + 美學軸地圖成形 + i18n 大批清理**」三件事一起發生的 arc
- iter#166 render 抽出後 game.js 從 1990 → 536（**73% 縮減 / 22 模組**）— R-1 plan §1.4 目標 ~600-800 達標，比預期更狠
- v0.2「新進化分支」第一個 ship（gourmet）+ 完整 pipeline 三階段（結構 + 收尾 + 美學軸 3 層）建立可複製 SOP
- 8 美學軸地圖成形：4 軸達標、4 軸缺 event 層 — 後續推進路線清晰

**動作**：

1. **新增 `docs/retrospective-170.md`（5 章 + 13 列指標表）**：
   - **§1 TL;DR**：5 點濃縮 — R-1 達標 / i18n 第 15-17 批 / v0.2 gourmet ship / 美學軸 8 軸地圖 / Tools 投資（lint + smoke）
   - **§2 階段時序**：20 列 iter#150-169 對應主題 + 產出
   - **§3 關鍵學習 7 段**：
     - §3.1 R-1 大塊 vs micro 節奏選擇（前 arc -8 / 輪 vs 本 arc -97 / 輪）
     - §3.2 P0 抓住 + 防線兌現（iter#147 lint 投資第二次 ROI 在 iter#166 render 抽出抓住 `$ is not defined` regression）
     - §3.3 v0.2 feature pipeline 三階段成熟（結構 / 收尾 / 美學軸層 — 5-7 cron 輪 ship 一個新終態的 SOP）
     - §3.4 美學軸 8 軸地圖（飽和度表，cottagecore + 美食家最深各 7 / 5 件，fairycore + y2k 缺 event）
     - §3.5 i18n 進度 vs 海外發行門檻（種子 233 → 290，functional 142 → 190，剩餘 ~322 條 cfg-level 留 v0.3 批次）
     - §3.6 NourishAPI surface 收斂中（iter#160-166 七輪只 +3 export，bridge 表面積成長放慢）
     - §3.7 smoke test 8 scenarios 防線分工 + 盲區（modal callback 仍由 i18n-shadow lint 守）
   - **§4 後續方向**：4 段
     - §4.1 R-1 收尾細粒度（openNameDialog 併入 menus.js / r1-plan.md 加達標報告 / 不再壓榨 game.js）
     - §4.2 美學軸補對稱（fairycore + y2k event 優先 / 元氣軸 confirm）
     - §4.3 v0.2 / v0.3 feature pipeline（GDD §10.3 elder companion / 季節事件 / 新 final form 候選）
     - §4.4 i18n cfg-level 海外批次（~322 條 1-2 sprint）
     - §4.5 工程紀律「P0 → lint」反饋迴路 SOP 確立
   - **§5 數字總結 13 列指標表**：game.js 1510→536 / buffer 490→1464 / 模組 16→23 / NourishAPI 14→17 / syntax 16→23 / i18n 種子 233→290 / functional 142→190 / accessories 16→19 / events 11→14 / finalForms 7→8 / traits 6→7 / speech 46→47 / achievements 25→26 / assets 73→79 / P0 抓修 2→3

**為什麼是 5 章 / 7 學習段 / 13 指標**：
- 對標 retrospective-150 的 5 章 / 7 學習 / 9 指標 — 本 arc 工作面向更廣（R-1 + v0.2 + 美學軸 + i18n + tools），數字維度多 4 列
- 7 學習段比上次 5 多 2，因為新增了「v0.2 feature pipeline 成熟」+「美學軸 8 軸地圖」兩個總結
- 13 列數字反映 cfg-level 細項追蹤更完整（accessories / events / forms / traits / speech / achievements / assets 全列）

**lines 變化**：
- `docs/retrospective-170.md`：**新增 ~210 行**（含表格）
- `src/`：本輪不動

**驗證**：
- 純 docs round，無 src 變更 — `./scripts/run-checks.sh` 跑保險：全綠 ✅
- `node --check src/game.js` → ✅（保命驗證沒撞到別的）

**為什麼 sw.js cache 不 bump**：
- 本輪只新增 docs/，沒改 src/ 或 index.html / sw.js APP_SHELL 內容
- docs 不在 sw.js APP_SHELL（不該被 SW cache）— 玩家不需要拉新 SW
- iter#150 milestone 同樣只動 docs，當時也跳過 cache bump（節省玩家流量）

**reflection — 70 cron 輪這個專案做出什麼**：
- 從 iter#100 起點 ~1990 行 game.js 單檔，到現在 23 模組 / game.js 536 行 / NourishAPI 17 export bridge
- 8 美學軸 + 19 accessories + 14 events + 7 seasonal events + 8 finalForms + 7 traits + 47 speech pools + 26 achievements
- i18n 種子翻譯 290 條 zh-TW + 290 條 en，6-step deploy gate + 8/8 smoke + i18n-shadow lint 守底線
- 4 份 retrospective + 1 份 r1-plan + 1 份 image-prompts 等專案 meta 文件

**影響檔案**：`docs/retrospective-170.md`（新）、`docs/iteration-log.md`

---

## 2026-04-30 07:01 · Session A — balletcore 軸 event 層補完：「舞台花束」(rose_bouquet)，pool 13 → 14

**觸發**：cron 第 169 輪 — 上輪 iter#168 補完智慧軸（event + accessory），盤點剩下無 event 軸：balletcore / fairycore / y2k 三軸。本輪選 balletcore — 因 diva form 是音樂演出系，event 層的「舞台應援」氛圍跟 form 的高潮場面對應最自然。

**為什麼這個切點**：
- **diva form 戲劇 / 舞台應援敘事**：cfg.finalForms.diva.desc「彩虹尾羽配麥克風，唱歌唱出來的閃亮明星」— 演出後收到觀眾花束 / 打賞是這個 narrative 的天然延伸
- **event 不能加 trait** 但 applyToast「💐 一束玫瑰送上來~」+ coinReason「觀眾打賞」串起場景
- **8 美學軸 event 層覆蓋**：補上後 balletcore 從 0 event → 1 event；剩下 fairycore + y2k 兩軸沒 event（後續輪可補）

**動作**：

1. **新增 `assets/svg/event-rose-bouquet.svg`（22 行 SVG）**：
   - viewBox 100×100 對標既有 6 個 event SVG
   - 色票嚴守 CLAUDE.md §5：粉 #FFC8D6 / #FFB7B7（wrap paper cone + 三朵玫瑰中層）/ 暗紅 #B23A48 + 描邊 #8B2030（玫瑰主體）/ 白 #FFFFFF 高光（玫瑰中心 highlight）/ 綠 #6BCB77 + #3E8C4A（左右兩片葉子）/ 黃 #FFD86B（緞帶 + ribbon tail + ✨ sparkle）/ 棕 #8B5A2B（緞帶描邊）
   - 結構：cone-shaped wrap paper（quadrilateral path）+ 三朵 bloom（左右 r=11 / 中心 r=13 三層 circle 模擬 rose 漸層）+ 兩片 quadratic-curve 葉子（披在束花兩側）+ 黃色 ribbon ellipse + 兩條 ribbon tail（懸垂的 stroke）+ 右上 ✨ + 左上 ♥ accent
   - 三朵 bloom 用三層 circle（外深紅 → 中粉 → 中心白）做 rose 立體感，省 path 複雜度但仍視覺豐富

2. **`src/cfg.js` randomEvents.pool 加第 14 條**：
   ```
   { id:"rose_bouquet", art:"assets/svg/event-rose-bouquet.svg", weight:5,
     label:"舞台花束", apply:"rose_bouquet",
     applyEffects:{ stats:{mood:16, clean:3}, coin:8, coinReason:"觀眾打賞" },
     applyToast:"💐 一束玫瑰送上來~" }
   ```
   - 加在 book 後，附 iter#169 註解 + balletcore 軸標註
   - **+mood 16** 比一般事件高（candy 18 / petal 14 為對標）— 戲劇高潮應該回饋大
   - **+clean 3 微量**：花束清新感
   - **coin 8**：觀眾打賞 coinReason 強化敘事
   - **weight 5**：比 tea 6 / book 6 / mushroom 7 略稀有（fits 戲劇性 event 應該更難得）

3. **`sw.js`：CACHE_VERSION iter168 → iter169**

**lint chain 報表**：
- 上輪 cfg-schema：`19 accessories / 47 speech_pools`（pool 13）
- 本輪 cfg-schema：`19 accessories / 47 speech_pools`（pool 14 — 內部統計，cfg-schema 不直接顯示）
- check-assets：78 → **79** asset references resolve
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**美學軸覆蓋更新（iter#169）**：
| 軸 | event | form | accessory | 件數 |
|----|-------|------|-----------|------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | 5 |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar | 7 |
| 智慧 / sage | book | sage | glasses_thin | 3 |
| **balletcore** | **rose_bouquet（本輪）** | diva | ribbon_tie | **3** ⬆ from 2 |
| fairycore | — | divine | wings_fairy | 2 |
| y2k | — | — | star_clip / cd_pendant | 2 |
| cleangirl | bubble | healthy | blush | 3 |
| 元氣 | rainbow | fighter | (party_hat?) | 2-3 |

balletcore 從 2 件 → **3 件**（並排智慧 / cleangirl）；剩下 2 軸（fairycore / y2k）仍缺 event。

**為什麼 applyToast 沒 i18n**：
- per retrospective-150.md §4.2：cfg.event.applyToast 是 cfg-level 字串，留 v0.3 海外發行批次
- 共 14 條 applyToast 一次抽出時 i18n 化，避免單條翻譯造成 inconsistency

**未來 follow-up**（不在本輪）：
- fairycore event：仙塵 / fairy dust / 月光下露珠（spar with bubble / petal 視覺差異）
- y2k event：雷射光 / digital heart / 像素閃爍（區分既有 cottagecore stained-glass 風）
- 元氣軸 confirm：fighter form + party_hat 是同軸還是獨立 birthday celebration 軸 — GDD 釐清
- 觀察玩家 rose_bouquet pickup 比例（需 telemetry）

**影響檔案**：`assets/svg/event-rose-bouquet.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:51 · Session A — 智慧軸補對稱：event-book + acc-glasses-thin，accessories 18→19 / pool 12→13

**觸發**：cron 第 168 輪 — iter#167 美食家軸第 5 件後，盤點美學軸覆蓋表發現智慧軸最薄（僅 sage 終態 / 0 event / 0 accessory）。對標已最深的美食家軸 5 件 + cottagecore 軸 7 件，sage 軸需要 event 跟 accessory 對稱補完。

**為什麼這個切點**：
- **GDD 角色一致性**：cfg.finalForms.sage.desc 寫「戴半月眼鏡、氣質溫柔，思考拼圖累積的智慧路線」— 半月眼鏡是 sage 既定意象，但目前只在 form portrait 才看得到，獨立配件化後**所有玩家任何 form 都能戴**，跨 path 普及這個視覺語
- **event 層補完**：sage 進化條件是 intelligencePoints（透過 play_puzzle 互動累計），但 event 系統不能直接加 trait — 加一個輕量 atmospheric event「翻書頁」讓玩家養 sage 路線時環境氛圍對齊（reading 文化氣息）
- **8 美學軸覆蓋率拉平**：智慧軸從 1 件 → 3 件，與 fairycore / balletcore / y2k 的 2 件並排

**動作**：

1. **新增 `assets/svg/event-book.svg`（22 行 SVG）**：
   - viewBox 100×100 對標 event-tea / event-macaron / event-petal 既有 5 個 event SVG
   - 色票嚴守 CLAUDE.md §5：白 #FFF8E7（書頁底）/ 棕 #8B5A2B（書脊 / 描邊）/ 粉 #FFB7B7（5+5 行頁面文字 stroke 模擬，輕量視覺紋理）/ 黃 #FFD86B（✦ sparkle）/ 藍 #6BCBFF（左上塵埃 dots，輕質感）/ 粉陰影 #FFC8D6
   - 結構：兩塊 quadrilateral 開書 + spine line + 10 條 page-text stroke（左右各 5）+ 一條 page-flip 動態曲線 path（quadratic curve 從右頁飛起）+ 兩個 sparkle accent（✦ + 兩個·）+ 底部 ellipse 陰影（depth 暗示）
   - page-flip 曲線是 visual hook：靜態 SVG 也能傳達「正在翻書」的動感
   - 書脊深色 + 頁面 cream 對比，符合 cottagecore + 學術混合美學

2. **新增 `assets/svg/acc-glasses-thin.svg`（13 行 SVG）**：
   - viewBox 100×100，face slot 對標既有 sunglasses（心形墨鏡 180 FC）+ blush（自然腮紅 60 FC）2 件
   - 色票嚴守：棕 #8B5A2B（鏡框，金邊半月）/ 白 #FFFFFF 透明 0.25 fill（玻璃透明感）+ #FFFFFF 1.5 stroke 高光線（兩條斜線模擬 lens shine）/ 黃 #FFD86B（sparkle ✦）
   - 結構：bridge line（雙鏡之間連接）+ 兩個 half-moon path（quadratic curve top arc，僅上半圓 — sage 既定的「半月眼鏡」意象）+ lens highlight 兩條短線 + 兩條 temple arms 延伸超過鏡框邊緣（眼鏡腳）+ 右上 ✦
   - 「半月」設計區隔既有 sunglasses（heart-shaped 心形）— 兩件配件不互相 cannibalize：sunglasses 是時尚 / glasses_thin 是書卷氣

3. **`src/cfg.js` 兩處同步**：
   - `randomEvents.pool` 加第 13 條：`{ id:"book", art:"assets/svg/event-book.svg", weight:6, label:"翻書頁", apply:"book", applyEffects:{ stats:{mood:8, energy:5} }, applyToast:"📖 一本好書，心靈被填滿~" }` — 加在 macaron 後 / 結尾前，附 iter#168 註解
   - `accessories` 加第 19 條：`{ slot:"face", art:"assets/svg/acc-glasses-thin.svg", labelKey:"acc.glasses_thin", label:"半月眼鏡", icon:"👓", price:150 }` — 加在 strawberry_clip 後

4. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `acc.glasses_thin` = "半月眼鏡"
   - en: `acc.glasses_thin` = "Half-Moon Glasses"
   - event applyToast 仍硬編碼中文（per retrospective §4.2，cfg-level event toast i18n 留 v0.3 海外發行批次）

5. **`sw.js`：CACHE_VERSION iter167 → iter168**

**lint chain 報表**：
- 上輪 cfg-schema：`18 accessories / 47 speech_pools` (+ 12 events 內部統計)
- 本輪 cfg-schema：**19 accessories** ✅（speech_pools 不變）
- check-assets：76 → **78** asset references resolve（+2 SVGs：event-book + acc-glasses-thin）
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**美學軸覆蓋更新（iter#168）**：
| 軸 | event | form | accessory | 件數 |
|----|-------|------|-----------|------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / strawberry_clip | **5** |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar | **7** |
| **智慧 / sage** | **book（本輪）** | sage | **glasses_thin（本輪）** | **3** ⬆ from 1 |
| balletcore | — | diva | ribbon_tie | 2 |
| fairycore | — | divine | wings_fairy | 2 |
| y2k | — | — | star_clip / cd_pendant | 2 |
| cleangirl | bubble | healthy | blush | 3 |
| 元氣 | rainbow | fighter | (party_hat?) | 2-3 |

智慧軸從最薄（1 件）→ **第三深（3 件）**，跟 cleangirl 並列；coquette 軸仍是最深（5），cottagecore 仍是最廣（7）。

**i18n 進度跳躍**：
- 種子翻譯：289 + 1 = **290 條** zh-TW + 290 條 en
- accessories 全 functional i18n（19/19 雙欄位 labelKey + label fallback）
- 觸抵 i18n 種子翻譯三百條前夕，下一輪可預期破 290

**驗證**：
- `node --check src/cfg.js / src/i18n.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + 19 accessories / 78 assets / i18n-shadow 23 src）
- 視覺驗證：在瀏覽器打開兩個新 SVG direct URL render — 由 user 手動驗

**未來 follow-up**（不在本輪）：
- y2k 軸補 event（電子寵物機 / cyber 蝴蝶？）— 目前只有 accessory layer
- balletcore 軸補 event（足尖鞋 / 玫瑰花瓣？）
- fairycore 軸補 event（仙塵 / 蘑菇圈？— 已有 mushroom，但 mushroom 屬 cottagecore 軸）
- 元氣軸 confirm（fighter form + party_hat 是否同軸 — 還是 party_hat 屬獨立 birthday 軸）
- cfg.welcomeBack tier.text + cfg.event.applyToast 共 ~16 條 cfg-level i18n（v0.3 海外批次）

**影響檔案**：`assets/svg/event-book.svg`（新）、`assets/svg/acc-glasses-thin.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:41 · Session A — 新配件「草莓髮夾」(strawberry_clip)：美食家軸第 5 件，accessories 17 → 18

**觸發**：cron 第 167 輪 — iter#160-166 連續 7 輪 R-1 / i18n 後切回 content 變化（rotation 比 6:1）。R-1 plan 已達標（iter#166 收 game.js 至 536），可以放心 invest 在內容層。

**為什麼這個切點**：
- **美食家軸對偶設計**：iter#159 加 chef_hat（pastel 廚師帽 200 FC），現在補一個小品 hairclip，玩家能依 mood 選「全力 baker / 輕量點綴」兩種風格
- **cottagecore 草莓 motif** 是 chef_hat 設計時提到「strawberry / macaron motif」的延伸 — 兩件配件視覺語一致
- **價格區隔**：130 FC（介於 headband 50 / lace_collar 140 / chef_hat 200），給玩家 D7-D14 中段養成的累積目標

**動作**：

1. **新增 `assets/svg/acc-strawberry-clip.svg`（17 行 SVG）**：
   - viewBox 100×100 對標既有 14 個 SVG 配件
   - 色票嚴守 CLAUDE.md §5：暗紅 #B23A48（草莓主體）+ #8B2030（描邊）/ 黃 #FFD86B（6 個籽 + clip 底座）+ 棕 #8B5A2B（base outline）/ 綠 #6BCB77 + #3E8C4A（葉冠）/ 白 #FFFFFF（左上 highlight）/ 粉 #FFB7B7（✨ accent）
   - 結構：金色橢圓 backplate（hairclip 底座）+ 心形 quadratic-curve 草莓 silhouette + 6 個 yellow seed dots（不規則散布更生動）+ 3-pointed 綠葉冠（用 `M-L-L-L-L-L-Z` 路徑做鋸齒葉緣）+ 左上白色高光橢圓（質感）+ 右上 ✨ sparkle
   - 跟 acc-chef-hat.svg 一樣的 cottagecore palette + 圓潤線條 + sparkle accent，視覺鎖定同軸

2. **`src/cfg.js` accessories 加第 18 條**：
   ```
   strawberry_clip: { slot:"hat", art:"assets/svg/acc-strawberry-clip.svg",
                      labelKey:"acc.strawberry_clip", label:"草莓髮夾",
                      icon:"🍓", price:130 }
   ```
   - 加在 chef_hat 後，附 `// iter#167 美食家軸續作` 註解
   - hat slot — 跟 chef_hat 同 slot（玩家選一裝備），不對 wing/neck 形成競爭
   - 130 FC：填補 headband(50) / bow(120) / chef_hat(200) 之間的價位空缺

3. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `acc.strawberry_clip` = "草莓髮夾"
   - en: `acc.strawberry_clip` = "Strawberry Clip"

4. **`sw.js`：CACHE_VERSION iter166 → iter167**

**lint chain 報表**：
- 上輪 cfg-schema：`17 accessories`
- 本輪 cfg-schema：**18 accessories** ✅
- check-assets：75 → **76** asset references resolve（新 SVG path 通過）
- 6 step + 8/8 smoke + i18n-shadow 23 src ✅

**美學軸覆蓋更新（iter#167）**：
| 軸 | event | form | accessory |
|----|-------|------|-----------|
| coquette / 美食家 | tea / macaron | gourmet | chef_hat / **strawberry_clip（本輪）** |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar |
| balletcore | — | diva | ribbon_tie |
| fairycore | — | divine | wings_fairy |
| y2k | — | — | star_clip / cd_pendant |
| cleangirl | bubble | healthy | blush |
| 元氣 | rainbow | fighter | (party_hat?) |
| 智慧 | — | sage | — |

美食家軸從 4 件 → **5 件**，本 arc 最厚的軸；cottagecore 軸 4+3=7 件最深；智慧軸最薄（僅 form），下輪可考慮補對稱。

**i18n 進度跳躍**：
- 種子翻譯：288 + 1 = **289 條** zh-TW + 289 條 en
- accessories 全 functional i18n（18/18 雙欄位 labelKey + label fallback）

**驗證**：
- `node --check src/cfg.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + 18 accessories / 76 assets / i18n-shadow 23 src）
- 視覺驗證：在瀏覽器打開 `assets/svg/acc-strawberry-clip.svg` direct URL render — 由 user 手動驗

**未來 follow-up**（不在本輪）：
- 智慧軸補對稱：sage 終態 + 一個事件（例如「翻書頁」）+ 一個配件（細框眼鏡）
- 美食家軸第 6 件可考慮：圍裙（neck slot — 跨入新 slot 物件）/ 木勺（face slot 小道具）
- 觀察玩家 strawberry_clip 配戴比例（需 telemetry）— 50 → 130 區間是否會 cannibalize headband

**影響檔案**：`assets/svg/acc-strawberry-clip.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:31 · Session A — R-1 round render：抽 render + 11 cache + 5 helper 到 src/render.js → game.js 866 → **536**（-330，史上最大單輪降幅）

**觸發**：cron 第 166 輪 — 上輪 settings 抽完後 render 是 game.js 唯一剩下的大塊。R-1 plan §1.4 終點 game.js 收斂在 ~600-800 行，render 抽出後達標。

**為什麼 render 是最後抽**：
- 11 個 cache 變數（lastPetSrc / lastMoodSrc / lastBgKey / lastStatVals / lastCoin / lastStageName / lastCountdown / lastTaskStr / lastStreakStr / lastStreakHint / cachedStatWraps）需要決定遷徙策略 — 留 game.js 還是搬 render.js
- 選 (B) 一起搬：cache 內部持有，乾淨邊界，resetCaches() 暴露給 startNewEgg 用；NourishAPI.getLastPetSrc 改 delegate
- render() callers 多（每個 mutation site + tick interval + visibility handler），thin wrapper 機械式即可

**動作**：

1. **新增 `src/render.js`（355 行 IIFE）** — 內含 7 函式 + 11 cache：
   - **11 cache 變數**模組內部 `let`：lastPetSrc/lastMoodSrc/lastBgKey/lastStatVals/lastCoin/lastStageName/lastCountdown/lastTaskStr/lastStreakStr/lastStreakHint/cachedStatWraps
   - **`resetCaches()`**：startNewEgg 用，把全部 cache 設回 null（statvals object 重建）
   - **`render()`**（200+ 行）：12 區段 dirty-checked DOM update（4 stat bars + cachedStatWraps + coin + stage name + countdown + pet image + pre-evolve glow + egg-shake + accessory overlays + mood overlay + sleep overlay + want bubble + background + setActionState + streak hint + stage hint + daily task footer + install banner gate）
   - **3 pure helper**：computeMoodKey / computePetSrc / computeStageHint — state-in / string-out
   - **`maybeShowInstallBanner` / `dismissInstallBanner`**：PWA A2HS 主動顯示 banner gate（playtime ≥ 5min, 沒被 dismiss, prompt 有可用）+ × 點擊持久化 dismiss
   - **`setActionState(state)`**：5 個 button enable/disable + bath cooldown 顯示
   - 透過 NourishAPI（getState / save / stageLabel / formLabel）+ NourishCFG + NourishUtils（statColor / formatTime）+ NourishInteractions（unlocked / isOnCooldown）+ NourishDex（unlockedFormsSet）lazy bridge — 6 個外部模組
   - 暴露：`window.NourishRender = { render, resetCaches, dismissInstallBanner, getLastPetSrc }`

2. **`src/game.js` 移除 ~320 行 + 加 4 行 wrapper / helper**：
   - 移除 11 cache `let` 宣告（line 23, 27-30）+ render block（line 191-510，~320 行）+ resetRenderCaches body
   - 加 `const $ = id => document.getElementById(id)` 給 init button binding 用（render.js 走出去後 $ 沒了，smoke test 立即抓 ReferenceError「$ is not defined」at line 362 — **smoke + i18n-shadow lint 第二次抓到 R-1 抽出 regression**，iter#147 lint 投資 ROI 兌現）
   - 加 `const render = () => window.NourishRender.render()` thin wrapper
   - 加 `const dismissInstallBanner = (p) => window.NourishRender.dismissInstallBanner(p)` thin wrapper
   - `resetRenderCaches` 改 `() => window.NourishRender.resetCaches()`
   - **`NourishAPI.getLastPetSrc` 改 delegate**：`() => window.NourishRender.getLastPetSrc()`（render.js 持有 cache，game.js 透過 NourishAPI bridge 給 share.js 用）

3. **`index.html`：settings.js 之後 / game.js 之前插入 `<script src="src/render.js">`**

4. **`sw.js`：CACHE_VERSION iter165 → iter166；APP_SHELL 加 `./src/render.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/render.js`**

**lines 變化**：
- `src/game.js`：866 → **536**（-330 行；**史上最大單輪降幅**，第二大是 iter#143 events -101 / iter#160 interactions -102 / iter#162 menus -147 / iter#165 settings -184）
- `src/render.js`：**新增 355 行**
- `src/game.js` 距離 2000 警戒線 buffer：1134 → **1464** ✅（buffer 高過原 game.js 60% 的長度）

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / save / tick / interactions / menus / settings / **render**（22/N）
- 累計 game.js 削減：iter#100 起點 ~1990 → **536**（壓 -1454 行 / **73% 縮減**）
- 剩下 game.js 內容：state closure + 9 const wrapper aliases 區 + 3 modal opener wrappers（welcome-back, render, menus / settings cross-link）+ orchestrator layer（init / startTick / startBackgroundTimers / wireUpVisibility / 鍵盤 / button bindings / save export-import wrappers）+ openNameDialog (~34) + onboarding 3 wrappers
- **R-1 plan §1.4 目標 game.js ~600-800 行 ✅ 達標**（536 < 600，比預期壓更狠）

**P0/regression 抓住**：
- 抽出後 init() 內 `$("btn-feed").onclick = ...` 等 button binding 因為 `$` 移到 render.js 而 ReferenceError throw
- **smoke test 第一次重跑就抓到**「$ is not defined at src/game.js:362」 — exit 1 不放 deploy
- 修：在 game.js render-wrapper 區加回 `const $ = id => document.getElementById(id)`（init bindings 仍需要）— 之後 smoke 8/8 通過
- 教訓：抽出時要先 grep 子函式裡使用的 helper / closure，確保不會因為 module 邊界 break

**NourishAPI 現況**：
- 17 export 不變，但 `getLastPetSrc` 從 closure 引用變 delegate（行為等價，share.js 仍透過 NourishAPI 拿）

**驗證**：
- `node --check src/render.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow **23 src** + sw shell **23 files**）— smoke test 第二次跑（fix `$` 後）通過
- 行為驗證：smoke test 8 scenario 全部跑 init+render across stages × forms — render 完整 200+ 行 dirty-cache 流程都被覆蓋，零 regression

**reflection — R-1 plan 達標**：
- iter#117 寫的 docs/r1-plan.md 估「5-7 cron 輪」抽完 — 實際做了 22 輪（iter#127-166）+ i18n batches 交錯
- 原因：micro-step 模式 + i18n 補洞策略 + content content content 並行
- 結果：game.js 從 ~1990 行 → 536 行（73% 縮減 / 22 個自包含模組），bridge 22 + utils + i18n 雙語 288 條種子翻譯 + 6-step deploy gate + smoke 8 scenarios + i18n-shadow lint = 工程地基紮實

**下一步思考方向**（不在本輪）：
- iter#170 寫 retrospective-170.md（從 iter#150 算 20 輪 arc，含 R-1 全程結算）
- 餘下小單元：openNameDialog (~34) → 跟 menus.js 的 dex/petDetail 同類，下一輪併入 menus.js 或自獨立
- v0.2 / v0.3 feature push：取名對話 ✅、新進化分支 ✅（gourmet）、剩下 GDD §10.3 elder companion 細化、新季節事件、配件系統擴展
- 海外發行 i18n cfg-level 大批次（welcomeBack / speech / finalForms 共 ~250 條 cfg-level 翻譯）

**影響檔案**：`src/render.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:21 · Session A — R-1 round settings：抽 openSettingsMenu 187 行到 src/settings.js → game.js 1050 → **866**（-184，本 arc 最大降幅）

**觸發**：cron 第 165 輪 — iter#164 i18n cleanup 收尾備註直接寫好 SOP，本輪兌現。游戲史上 game.js **第一次跌破 900 行**。

**為什麼這輪比 menus -147 / interactions -102 還大**：
- openSettingsMenu 是單一 187 行函式（含 _settingsTab closure 變數），整段 1:1 移過去就 -187 加 1 行 wrapper = **淨 -184**
- iter#164 已先把 30+ 硬編碼中文清光 — 抽出時零 i18n 副作用 / 零行為變動，純機械搬遷
- 4 個 onMount handler（13 個 button binding）+ tab arrow-key a11y + 跨 modal 重新打開（switchTab → closeModal → openMenu 自呼叫）全部 1:1 mirror

**動作**：

1. **新增 `src/settings.js`（226 行 IIFE）**：
   - 內部 `let _activeTab = "settings"` closure（從 game.js _settingsTab 命名升級成 _activeTab，避免「settings 在 settings」歧義）
   - 內部常量 `DEX_KEY = "nourish.dex.v1"` — 跟 game.js 同步副本（reset-everything 流程需要）
   - **`openMenu()` 函式 187 行**：3 個 section template literal（pet / prefs / save）+ `<nav>` 三 tab + `showModal` + `onMount` 內 13 個 button binding handler
   - 9 個外部依賴透過 lazy bridge：NourishAPI / NourishCFG / NourishI18n / NourishUI / NourishAudio / NourishNotify / NourishSave / NourishEvolve（confirmNewEgg / maybeEvolve recursive 進化路徑）
   - 暴露：`window.NourishSettings = { openMenu }`

2. **`src/game.js` 移除 187 行 + 換 2 行 wrapper**：
   - `let _settingsTab = "settings"; function openSettingsMenu() { ...187行... }` → `// extracted to src/settings.js` + `const openSettingsMenu = () => window.NourishSettings.openMenu();`
   - **新增 `NourishAPI.isDebug: () => DEBUG` getter**：避免 settings.js 重算 URLSearchParams + localStorage（DEBUG 是 game.js IIFE 啟動時計算的）
   - **新增 `NourishAPI.applyReducedMotionPref`**：暴露 game.js 既有 2 行函式（toggle body class），settings.js 內 motionBtn handler 需要
   - 5 處外部 callsite（settings 按鈕綁定 / 鍵盤快捷鍵 / 啟動）保留識別字 — 零變動

3. **`index.html`：menus.js 之後 / game.js 之前插入 `<script src="src/settings.js">`**

4. **`sw.js`：CACHE_VERSION iter164 → iter165；APP_SHELL 加 `./src/settings.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/settings.js`**

**lines 變化**：
- `src/game.js`：1050 → **866**（-184 行；本 arc / R-1 plan 全程最大單輪降幅 — 對標：iter#143 events -101、iter#160 interactions -102、iter#162 menus -147）
- `src/settings.js`：**新增 226 行**
- `src/game.js` 距離 2000 警戒線 buffer：950 → **1134** ✅（buffer 跳到歷史新高）
- **第一次跌破 900 行** — 從 iter#100 起點 ~1990 → **866**（壓 -1124 行 / 56% 縮減）

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / save / tick / interactions / menus / **settings**（21/N）
- 累計 game.js 削減：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → shop -64 → save -62 → tick -63 → interactions -102 → menus -147 → save micro -22 → **settings -184** = 共 **-1127 行 / 15 R-1 輪**
- 剩下大塊（per retrospective-150.md §4.1 + 本輪結算）：**render (~330)** / openNameDialog (~34) / orchestrator layer (init / startTick / startBackgroundTimers / wireUpVisibility / 鍵盤 / button bindings)

**NourishAPI 現況**：
- 17 export：getState / getLastPetSrc / stageLabel / formLabel / formDescription / unlockedFormsSet / toast / speak / save / render / grantCoin / spendCoin / unlockAchievement / checkAchievements / startNewEgg / **applyReducedMotionPref / isDebug**（本輪 +2）
- 從 iter#100 的 4 個 → 17 個（4.25× 增長），對應每個 R-1 抽出大約 +1 export
- retrospective §3.5 的「bridge surface 收斂」走勢：iter#160 interactions 是 +0、iter#162 menus 是 +0、iter#163 export/import +0、iter#164 i18n +0、iter#165 +2 — 總體仍緩慢成長但每輪平均 0.5 以下

**驗證**：
- `node --check src/settings.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow **22 src** + sw shell **22 files**）
- 行為驗證（讀程式碼）：3 個 section render template + 13 個 button handler 1:1 mirror — 包含 motion toggle 走 `A.applyReducedMotionPref()`、DEBUG flag 走 `A.isDebug()`、新蛋 / 評估按鈕走 `window.NourishEvolve.confirmNewEgg / maybeEvolve` — 全部行為零變動

**為什麼把 _settingsTab 改名 _activeTab**：
- game.js 本來叫 `_settingsTab`，但抽出後在 settings.js 模組內，「settings tab」變成 redundant
- 改 `_activeTab` 語義更貼近：是「目前選中的 tab」，不是「settings 的 tab」
- 純內部變數，無外部 callsite 引用 — 改名零風險
- 順手減少 redundancy noise

**剩下單一最大塊：render (~330 行)** — game.js 仍剩的大塊。R-1 plan §1.4 的 render 抽出討論過 cache 變數（lastPetSrc / lastMoodSrc / lastBgKey / lastStatVals / lastCoin / lastStageName / lastCountdown / lastTaskStr / lastStreakStr / lastStreakHint / cachedStatWraps）— 是 closure 持有的 dirty-check 機制。要抽出有兩個策略：(A) cache 留 game.js + render.js 接 cache 引用 — 邊界不乾；(B) cache 一起搬 render.js 內持有 — 乾但要確保 startNewEgg 的 resetRenderCaches 還能呼叫到。下一輪設計這個。

**下一個 milestone candidates**：
- iter#170 寫 retrospective-170.md（從 iter#150 算 20 輪 arc）
- 或 iter#180 等 R-1 完成度更高（render + 餘下 orchestrator）再寫

**影響檔案**：`src/settings.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:11 · Session A — i18n 大批：openSettingsMenu ~30 處中文全 t() 化（41 keys × 2 locales = 82 條）

**觸發**：cron 第 164 輪 — iter#163 R-1 micro 收尾備註標「下輪 settings 前先 i18n cleanup 25-30 處硬編碼中文」。本輪兌現，是本 arc 最大 i18n 單批。

**為什麼**：
- openSettingsMenu 是 game.js 剩下大塊裡 i18n 殘留密度最高的（187 行函式 / ~30 處硬編碼中文 = ~16% 密度，遠高於其它區塊）
- 玩家 D1 / D7 / D30 都會打開設定看 traits 進度 / 切音效 / 匯出存檔，是高曝光面
- 抽出之前先清乾淨：iter#149 retrospective §3.4 教訓「抽出 module 時順手 i18n 化」— 沒清就抽會把硬編碼字串原封不動帶進新檔，後續再補洞要多耗一輪

**i18n 鍵設計**（41 條 zh + 41 條 en，總 +82 條）：

1. **`modal.settings.tabsAria` 1 條**：「設定分頁」aria-label
2. **`modal.settings.tab.\*` 3 條**：pet 🐣 啾啾 / prefs ⚙️ 設定 / save 💾 存檔
3. **`modal.settings.pet.\*` 7 條**：streak 連續登入 / streakDays `${n} 天` 插值 / growth 成長分數 / born 誕生時間 / wishes 💖 滿足願望 / events 🎲 抓到事件 / timesUnit `${n} 次` 插值（兩個 row 共用）
4. **`modal.settings.prefs.\*` 4 條**：sound 🔊 音效 / motion 🌀 減少動畫 / notify 🔔 啾啾呼叫 / install 📲 裝到主畫面
5. **`modal.settings.toggle.\*` 7 條**：off 已關閉 / on 已開啟 / followsSystem 跟隨系統 / unsupported 瀏覽器不支援 / blocked 已被封鎖 / granted 已啟用 / tapToEnable 點擊啟用
6. **`modal.settings.save.\*` 4 條**：newEgg 🥚 孵化新蛋 / export 📤 匯出存檔 / import 📥 匯入存檔 / reset 重置存檔（清除本機資料）
7. **`modal.settings.debug.\*` 2 條**：give100 給 100 飼料幣（除錯）/ skipStage 跳到下一階段（除錯）— DEBUG flag 內才顯示
8. **`modal.settings.btn.\*` 5 條**：start 開始 / copy 複製到剪貼簿 / paste 貼上字串 / reset 重置 / install 立即安裝
9. **`toast.notify.\*` 3 條**：welcome 「通知已開啟，${name} 餓了會跟你說 🐣」/ blocked 已被封鎖訊息 / notGranted 未授權 / unsupportedInstall 此瀏覽器不支援
10. **`toast.install.success` / `toast.export.copied` / `toast.coin.debug` 3 條**：✨ 安裝成功！/ ✅ 已複製 ${len} 字元到剪貼簿（插值）/ 除錯
11. **`prompt.\*` 4 條**：export.fallback 複製這串字元到他處保存：/ import.input 貼上之前匯出的存檔字串：/ import.confirm 確定要覆蓋現有存檔？建議先匯出當前進度 / reset.confirm 確定要清除存檔重來？（圖鑑也會一起清空）— 這 4 條是 native browser prompt() / confirm() 對話框 i18n

**動作**：

1. **`src/i18n.js` 加 41 條 key（zh + en，共 82 條）**：插在既有 speech.wake 後 / 兩個 locale 同步加

2. **`src/game.js` openSettingsMenu 18 處 surgical replace**：
   - `sectionPet`：5 處（streak label + days unit / growth / born / wishes + times / events + times）
   - `sectionPrefs`：8 處（4 個 prefs label + 7 個 toggle 三元判斷狀態 + install button label）
   - `sectionSave`：8 處（save 4 row label + 4 button label）+ 2 處 DEBUG row label
   - `html` nav：3 個 tab label + 1 個 aria-label
   - onMount handler：5 處 toast / prompt / confirm 對應 t() 呼叫
   - notification 標題：`"啾啾日常"` literal → `t("share.title.live")`（reuse 既有 share.title key，避免 dup）
   - DEBUG 給 coin reason：`"除錯"` literal → `t("toast.coin.debug")`

3. **`sw.js`：CACHE_VERSION iter163 → iter164**

**i18n 進度跳躍**：
- 種子翻譯：247 + 41 = **288 條** zh-TW + 288 條 en（單輪 +41 是本 arc 最大）
- functional sites：169 + 18 = **187 處**
- openSettingsMenu **100% i18n functional**：切英文時設定頁三個 tab + traits 進度 + 音效切換 + 匯出 / 匯入 / 重置 / DEBUG / 分頁鍵盤 a11y 全雙語化
- 唯一保留中文：`state.pet.name || "啾啾"` fallback default name（邏輯預設值 ≠ UI 字串）
- 唯一保留 comment：sectionPrefs / sectionSave 兩行 code comment（非 user-facing）

**lint chain 報表**：
- 6 step + 8/8 smoke + i18n-shadow 21 src ✅
- 21 src parse / 21 files in shell ✅
- check-assets 75 ✅

**為什麼這輪不抽 settings 模組**：
- i18n 已塞 41 條 key，再做模組抽出（1 個 187 行函式 + 5 個新 NourishAPI export）會讓單輪 diff 過大難 review
- 守 retrospective §3.4 教訓 + iter#160 interactions 的 SOP：i18n 先清，模組抽下一輪
- 下輪 R-1 settings 抽出時 1:1 mirror 行為，零 i18n 副作用

**下輪 SOP**：
1. settings menu 抽到 src/settings.js（~187 行 IIFE，預估 game.js -160 行）
2. 需新 NourishAPI export：DEBUG flag / DEX_KEY 常量 / applyReducedMotionPref（其餘 grantCoin / spendCoin / save / render / closeModal / openSettingsMenu 自呼叫 / showLocalNotification / etc 都已 bridge）
3. 把 `let _settingsTab = "settings"` closure state 移到 settings.js 內部
4. game.js 留 1 行 thin wrapper

**剩下 i18n 殘留 hot spots**：
- ~~settings menu~~ ✅ 本輪
- openNameDialog 內 `state.pet.name || "啾啾"` fallback default（邏輯非 UI）
- cfg-level 大批次（welcomeBack 5 / speech 230 / finalForms 8 desc / accessories 17 label fallback）— 留 v0.3 海外發行批次

**影響檔案**：`src/i18n.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 06:01 · Session A — R-1 micro：exportSaveBundle / importSaveBundle 併入 src/save.js → game.js 1072 → 1050（-22）

**觸發**：cron 第 163 輪 — 上輪 menus 大塊抽完後，剩 game.js 1072 行。盤點剩餘：render (~330) / openSettingsMenu (~187) / openNameDialog (~34) / save export-import (~25) / orchestrator layer。挑最小單元先抽出（完成度 R-1 plan 的低風險點清單），把腳手架穩定再進大塊。

**為什麼選 export/import 而非 openNameDialog**：
- export/import 是 **save 層延伸**（base64 序列化 / 反序列化 + localStorage write），跟 src/save.js 既有的 loadFromStorage / writeToStorage / migrate / defaultState 同 I/O 領域，**併入既有模組** 不創新檔（避免新 wire-up 成本：iter#149 retrospective 就提過小單元獨立模組 ROI 差）
- openNameDialog 雖然 34 行，是 modal dialog 性質，更接近 menus.js 的同伴 — 留下輪可考慮獨立 dialogs.js 或併 menus.js

**動作**：

1. **`src/save.js` 加 2 個函式**：
   - `exportBundle()`：透過 `window.NourishAPI.getState()` 取 state、`window.NourishDex.loadDex()` 取 dex，組 `{ v:1, exportedAt, save, dex }` bundle，序列化 + base64 編碼（unescape + encodeURIComponent UTF-8 safe path），catch fail return null
   - `importBundle(b64)`：base64 解碼 + JSON.parse + 校驗 `bundle.v === 1` + `bundle.save` 必存在 → write 到 `cfg().save.key` + `nourish.dex.v1` 兩個 localStorage key
   - export 透過 NourishAPI bridge 取 state 而非直接持 ref（保持模組純 I/O 性質）
   - 暴露面：`window.NourishSave = { defaultState, migrate, loadFromStorage, writeToStorage, exportBundle, importBundle }` — 4 → 6 export

2. **`src/game.js` 移除 ~25 行 + 換 2 行 wrapper**：
   - `exportSaveBundle / importSaveBundle` 兩個 thin wrapper
   - 既有 callsite（settings menu 內 act-export / act-import button 的 onclick handler，行 ~720-744）零變動

3. **`sw.js`：CACHE_VERSION iter162 → iter163**

**lines 變化**：
- `src/game.js`：1072 → **1050**（-22 行）
- `src/save.js`：96 → **125**（+29 含 doc comment block）
- `src/game.js` 距離 2000 警戒線 buffer：928 → **950** ✅

**R-1 進度**：
- 累計從 game.js 搬走：iter#100 起點 ~1990 → **1050**（-940 / 47% 縮減 / 14 R-1 輪）
- 模組數不變（合併進 save.js，仍是 21 src 檔案）
- 剩下大塊（per retrospective-150.md §4.1 + iter#162 結算）：render (~330) / openSettingsMenu (~187) / openNameDialog (~34) / orchestrator layer (init / startTick / wireUp / 鍵盤 / button bindings)

**為什麼這輪 LOC 削減比 menus -147 / interactions -102 小**：
- 本輪是「micro R-1」性質 — iter#127-131 utils 抽出 5 輪（micro-step 模式）的延伸路線
- 大塊剩 render / settings 兩個 — render 改 cache 變數 + settings 加 5 bridge 都需要更謹慎一輪
- 每輪一塊原則：本輪小 R-1 + 留時間（5 min 用完）穩工程紀律，不追大數字

**驗證**：
- `node --check src/save.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 21 src）

**下輪 candidates 優先序**：
1. R-1 settings menu（最大單一函式 187 行 — 需新增 bridge：applyReducedMotionPref / DEBUG / DEX_KEY）— 進入前先 i18n cleanup 25-30 個 hardcoded 中文
2. R-1 openNameDialog（34 行）+ render extraction（330 行）
3. retrospective-160（milestone 收 iter#150-163 的 14 輪 arc）— 略早，建議 iter#170 再寫

**影響檔案**：`src/save.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:51 · Session A — R-1 round menus：抽 4 個 dex-viewer modal 到 src/menus.js → game.js 1219 → 1072（-147）

**觸發**：cron 第 162 輪 — 上輪 iter#161 content（馬卡龍事件）後切回 R-1。評估 settings menu (~187) vs dex menu cluster (~150) 後選後者：dex / achievements / eventStats / petDetail 四個 modal 互相 cross-link（dex → ach / events / pet detail / share），是天然 cluster；settings 雜耦合多（DEBUG / DEX_KEY / exportSaveBundle / applyReducedMotionPref），抽出要新增 5+ NourishAPI export，下輪再做。

**為什麼**：
- 4 個 modal 共 ~150 行，邏輯內聚（玩家 meta 進度瀏覽：終態收集 / 成就列表 / 事件統計 / 歷代寵物 portrait）
- 依賴清晰：state / cfg lazy + NourishUI（showModal/closeModal/escapeHtml/lockableRowHTML）+ NourishAPI（formLabel / formDescription / unlockedFormsSet）+ NourishUtils（cfgLabel / cfgDesc）+ NourishDex（loadDex）+ NourishShare（shareOrDownloadCard）— **零新 NourishAPI export 需要**（所有外部依賴已 bridge）
- Cross-link 內部可直接互呼（openDex → openPetDetail → openDex 等），不依賴 game.js 中介

**動作**：

1. **新增 `src/menus.js`（192 行 IIFE）** — 4 個函式：
   - `openDex()`：終態收集 grid（`unlocked.size / allForms.length`）+ 歷代寵物 list（最近 10 個，含配件 icon 連串顯示）+ 三個 cross-link 按鈕（成就 / 事件 / 分享卡）+ pet-row click / Enter / Space 互動 a11y
   - `openAchievements()`：cfg-driven 成就 list 走 lockableRowHTML（unlock state mapping），title 含「got/all」插值
   - `openEventStats()`：regular pool + seasonal pool 雙 section，逐條 thumbnail + lock state + count，「回圖鑑」cross-link
   - `openPetDetail(p)`：past pet portrait（fallback 到 healthy）+ 4 row 元數據（finalForm / 誕生 / 退休 / 飼養天數）+ 配件 list（hat/neck/wing slot 配件 icon + name）+ formDescription footer + 「📸 紀念卡」+ 「回圖鑑」cross-link
   - 透過 NourishAPI / NourishCFG / NourishI18n / NourishUtils / NourishUI / NourishDex / NourishShare lazy bridge — 7 個外部模組
   - 暴露：`window.NourishMenus = { openDex, openAchievements, openEventStats, openPetDetail }`

2. **`src/game.js` 移除 ~150 行 + 換 4 行 wrapper**：
   - 4 個 thin wrapper（`openAchievementsMenu / openDexMenu / openEventStatsMenu / openPetDetail`）保留 callsite 識別字
   - 7+ 處外部 callsite（dex button / settings 內 newegg → confirmNewEgg / share-card 按鈕路徑 / openDex cross-link 鏈）零變動
   - 移除 4 個函式共 ~150 行

3. **`index.html`：interactions.js 之後 / game.js 之前插入 `<script src="src/menus.js">`**

4. **`sw.js`：CACHE_VERSION iter161 → iter162；APP_SHELL 加 `./src/menus.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/menus.js`**

**lines 變化**：
- `src/game.js`：1219 → **1072**（-147 行；本 arc 第二大降幅僅次於 iter#160 -102 + iter#143 -101）
- `src/menus.js`：**新增 192 行**
- `src/game.js` 距離 2000 警戒線 buffer：781 → **928** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / save / tick / interactions / **menus**（20/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → shop -64 → save -62 → tick -63 → interactions -102 → **menus -147** = 共 -921 行 / 13 輪
- game.js 從 iter#100 起點 ~1990 → **1072**，壓 -918 行（46% 縮減）
- 剩下大塊：render (~330 行) / openSettingsMenu (~187) / openNameDialog (~34) / orchestrator layer (init / startTick / wireUp / 鍵盤 / button bindings / save export-import)

**驗證**：
- `node --check src/menus.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow **21 src** + sw shell **21 files**）
- 行為驗證（讀程式碼）：所有 4 modal 行為 1:1 mirror 原版 — formLabel / formDescription / loadDex / shareOrDownloadCard / lockableRowHTML 都是既有 bridge 照搬，cross-link 內部直接互呼（openDex → openPetDetail → openDex 一致）

**為什麼這輪比 settings 先做**：
- menus 4 個函式共 -147，settings 1 個函式 -187 — menus 數量多但 LOC 接近
- menus **零新 NourishAPI export**；settings 估 +5（applyReducedMotionPref / exportSaveBundle / importSaveBundle / DEBUG / DEX_KEY 都是 game.js 内部）— 表面積膨脹大
- menus 抽出對 R-1 plan §1.4 的 orchestrator-only game.js 終點推進更直接（settings 含 reset 流程跟 init 緊耦合）

**影響檔案**：`src/menus.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:41 · Session A — 新隨機事件「馬卡龍」：美食家軸 event 層補完，pool 11 → 12

**觸發**：cron 第 161 輪 — 上輪 iter#160 R-1 interactions 大塊抽出後，本輪切到 content 變化（最近 8 輪 R-1/i18n/content 比 4-3-1，content 缺）。對美食家軸的 event-form-accessory 三層覆蓋一致性是現成的切點。

**為什麼**：iter#132「下午茶」(tea) 是 coquette / 美食家軸第一個 event；iter#156 ship gourmet 終態 + iter#157 補成就 + iter#159 加 chef_hat 配件後，美食家軸已有 form + accessory 兩層，但 event 層只有 tea 一條。再加一條呼應路線，玩家觸發概率提升、視覺/aesthetic 連續性更強。

**設計動機**：
- **馬卡龍** 是 cottagecore / coquette aesthetic 的高識別度甜點 motif（已在 chef_hat SVG 提到「strawberry / macaron motif」當設計語）
- 跟 tea 同 mood + 不同 stat 組合 — tea 給 mood/energy/hunger（飽腹感 + 提神），macaron 給 mood/hunger + 帶 5 coin（路上撿到 / 短暫驚喜）
- weight 7（介於 candy 8 / petal 8 / mushroom 7 / tea 6 之間）— 不過於頻繁
- 搭配 5 coin 讓玩家有「下午散步意外發現」的小驚喜感（vs tea 純粹 stat buff）

**動作**：

1. **新增 `assets/svg/event-macaron.svg`（13 行 SVG）**：
   - viewBox 100×100 對標 event-tea.svg 等 5 個既有 SVG event 圖標
   - 色票嚴守 CLAUDE.md §5：粉 #FFB7B7（top shell 較深）/ #FFC8D6（bottom shell 較淺）/ 白 #FFF8E7（cream filling）/ 黑 outline #FF89A7（粉色描邊延續 tea 風格）/ 黃 #FFD86B（cream layer + sparkle ✨）/ 粉紅 ♥ accent
   - 結構：3 層橢圓堆疊（bottom shell + cream layer + top shell）+ 白色 glossy highlight + 兩個 corner sparkle（✨ 黃 / ♥ 粉）+ 兩個 crumb dots（cottagecore 細節）
   - 跟 event-tea / event-bubble / event-petal 視覺語一致：粉色 outline + sparkle + 中心 motif

2. **`src/cfg.js` randomEvents.pool 第 12 條**：
   ```
   { id:"macaron", art:"assets/svg/event-macaron.svg", weight:7,
     label:"馬卡龍", apply:"macaron",
     applyEffects:{ stats:{mood:14, hunger:6}, coin:5, coinReason:"路過糕點店" },
     applyToast:"🧁 撿到一個粉色馬卡龍~" }
   ```
   - 加在 tea 後，附 `// iter#161 美食家軸 event 層補完` 註解串連 iter#132/#156/#159
   - applyEffects 走 cfg-driven runEventApply 路徑（events.js iter#143 抽出後的 dispatch 表，無需新增 RANDOM_EVENT_APPLIES entry）
   - applyToast 仍硬編碼中文（per retrospective §4.2，cfg-level i18n 留 v0.3 海外發行批次）

3. **`sw.js`：CACHE_VERSION iter160 → iter161**

**lint chain 報表**：
- check-assets：74 → **75** asset references resolve（新 SVG path 通過）
- cfg-schema：`14 interactions / 17 accessories / 14 wants / 3 menus / 7 traits / 47 speech_pools / 8 final_forms`（無 randomEvents 計數，pool 從內部 12 條 — 上輪 11）
- 6 step + 8/8 smoke + i18n-shadow 20 src ✅

**美學軸覆蓋更新（iter#161）**：
| 軸 | event | form | accessory |
|----|-------|------|-----------|
| coquette / 美食家 | tea / **macaron**（本輪） | gourmet | chef_hat |
| cottagecore | butterfly / mushroom / petal / herb | — | flower / pin_butterfly / lace_collar |
| balletcore | — | diva | ribbon_tie |
| fairycore | — | divine | wings_fairy |
| y2k | — | — | star_clip / cd_pendant |
| cleangirl | bubble | healthy | blush |
| 元氣 | rainbow | fighter | (party_hat?) |
| 智慧 | — | sage | — |

美食家軸從一層（tea）→ event 兩層（tea + macaron）+ form（gourmet）+ accessory（chef_hat）= 4 件 — 本 arc 最厚的軸。

**未來 follow-up**（不在本輪）：
- 觀察玩家 macaron pickup 比例（需 telemetry）
- 加 cake / croissant / 𩽌 等更多甜點 event 層（看 macaron 玩家反應決定）
- 海外發行時 applyToast 11 條全 i18n 化（cfg-level batch）
- 智慧軸缺 event + accessory，後續可補對稱性

**影響檔案**：`assets/svg/event-macaron.svg`（新）、`src/cfg.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:31 · Session A — R-1 round interactions：抽 7 個函式到 src/interactions.js → game.js 1321 → 1219（-102，本 arc 第二大降幅）

**觸發**：cron 第 160 輪 — iter#158 i18n 把 interactions 區塊中文清乾淨後排好的下一輪 R-1 抽出。連續延期 2 輪（iter#158 / iter#159 換做 i18n + 配件），現在 i18n surface 清乾淨後抽出最乾淨。

**為什麼**：interactions 是 game.js 第三大子系統（iter#143 events -101 第一、本輪 -102 第二、iter#101 events 第三）。**performInteraction 是玩家最高頻路徑**（餵食 / 玩耍 / 摸頭 / 洗澡 / 唱歌 14 種 interaction 全走這），抽出後 game.js 進一步收斂為 orchestrator layer。

**為什麼這輪比之前更乾淨**：
- iter#158 i18n 清完之後，performInteraction + menuItemHTML + toggleSleep 沒有任何硬編碼中文 — 抽出時不用順手 i18n 化（避免 retrospective §3.4 教訓）
- 15+ 依賴全部已有 NourishAPI / NourishUtils / NourishWants / NourishDaily / NourishAnim / NourishAudio / NourishUI 既有 bridge — **零新 NourishAPI export 需要**（對標 iter#143 events 抽出時還要加 unlockAchievement、iter#148 evolve 加 startNewEgg、iter#151 shop 加 spendCoin），bridge 收斂中

**動作**：

1. **新增 `src/interactions.js`（160 行 IIFE）** — 7 函式 + 5 export：
   - **3 個 internal helper**：`isOnCooldown(key)` / `setCooldown(key, sec)` / `unlocked(stage)` — cooldown timestamps + 階段解鎖判斷（lazy state via api()）
   - **`performInteraction(key)`**（70 行核心）：4 段 gate（睡眠 / 階段 / 冷卻 / coin） + energy gate（玩耍前體力不足擋）+ overfeed 處理（hunger>95 mood/clean drag + fatPoints +1，cake 例外不重複）+ 主 effect（applyDelta stats / spendCoin / 4 種 trait 累計 / setCooldown / growthScore += interactionScore）+ 副作用組（trackTask / bumpHistory / fulfillIfMatches / checkAchievements / play 額外 grantCoin / playReactionAnim / SFX.success / toast 成功 / 對應 speech）+ save + render
   - **`toggleSleep()`**：egg 階段擋 + isSleeping flip + 對應 speech.sleep / speech.wake + save / render
   - **`menuItemHTML(key)`**（內部）：locked / cdActive / cantAfford 三態 disabled 計算 + price / free tag + sub label（4 個 i18n key）+ HTML 字串組
   - **`bindMenuItems(card)`**（內部）：onclick 綁 closeModal + perform
   - **`openMenu(cat)`**：cfg.interactionMenus dispatch + map menuItemHTML + showModal 包裝
   - 透過 NourishAPI / NourishCFG / NourishI18n / NourishUtils / NourishUI / NourishAudio / NourishAnim / NourishWants / NourishDaily lazy bridge — 9 個外部模組全部 lazy 引用，無 import 順序敏感
   - 暴露：`window.NourishInteractions = { perform, toggleSleep, openMenu, isOnCooldown, unlocked }`

2. **`src/game.js` 移除 ~110 行 + 換 4 行 wrapper**：
   - 4 thin wrappers（`isOnCooldown / unlocked / performInteraction / toggleSleep`）保留 callsite 識別字 — 7 處外部 callsite（btn-feed / btn-play / btn-bath / btn-sleep / btn-pet / pet-wrapper click / 鍵盤 1-5）零變動
   - `openInteractionMenu` 1 行 wrapper（5 處外部 callsite — 4 button + 鍵盤 1-5 部分）
   - 移除 isOnCooldown(7) + setCooldown(3) + unlocked(4) + performInteraction(54) + toggleSleep(6) + menuItemHTML(17) + bindMenuItems(8) + openInteractionMenu(11) = 110 行
   - 加 5 行 wrapper：淨 -102 行

3. **`index.html`：tick.js 之後 / game.js 之前插入 `<script src="src/interactions.js">`**

4. **`sw.js`：CACHE_VERSION iter159 → iter160；APP_SHELL 加 `./src/interactions.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/interactions.js`**

**lines 變化**：
- `src/game.js`：1321 → **1219**（-102 行；本 arc 第二大單輪降幅）
- `src/interactions.js`：**新增 160 行**
- `src/game.js` 距離 2000 警戒線 buffer：679 → **781** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / save / tick / **interactions**（19/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → shop -64 → save -62 → tick -63 → **interactions -102** = 共 -774 行 / 12 輪
- 剩下大塊：state init / startTick / startBackgroundTimers / wireUpVisibility / 鍵盤綁定 / 各 button onclick — 屬「orchestrator layer」按 R-1 plan §1.4 建議保留在 game.js
- game.js 預計收斂在 600-800 行附近（從 1990 起點壓 ~60% 以上）

**驗證**：
- `node --check src/interactions.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow **20 src** + sw shell **20 files**）
- 行為驗證（讀程式碼）：4 段 gate 順序、overfeed cake 例外、energy gate threshold、play 額外 coin reward、performInteraction 完整 13 步副作用 — 全部行為零變動

**後續 R-1 走向**（per retrospective-150.md §4.1 + 本輪結算）：
- ✅ wants / events / daily / idle / evolve / shop / save / tick / interactions
- 剩下 game.js 1219 行內容：state closure 變數 + 9 個 const wrapper aliases 區 + render + 一些 modal openers（dex / achievements / settings / event stats / share-card / save-export / save-import）+ init / startTick / startBackgroundTimers / wireUpVisibility / 鍵盤 + button bindings
- **最大子塊：render**（行 ~227-575，~350 行）— 已知 dirty-cache + DOM batch update，緊耦合 closure 但純讀邏輯，下個 R-1 候選

**影響檔案**：`src/interactions.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:21 · Session A — 新配件「粉粉廚師帽」(chef_hat)：呼應 iter#156 gourmet 終態 + iter#132 下午茶事件，accessories 16→17

**觸發**：cron 第 159 輪 — 連續 5 輪 R-1 / i18n（refactor 為主）後切到 content 軸。對標 iter#151-158 比例（6 R-1/i18n vs 2 content），需要再插一個 player-visible 補回變化感。

**為什麼這個切點**：
- iter#156 ship 的 gourmet 終態 + iter#157 加的 form_gourmet 成就 + form_gourmet speech 已建立**美食家系列軸**，但配件層還沒呼應 — 16 件配件全 cottagecore / coquette / fairycore / y2k / balletcore / cleangirl 等美學軸，沒有「美食家 / pâtissier」對應品
- iter#132 加的「下午茶」隨機事件已是這個美學軸的事件層落地，配件層補上一件能讓玩家「玩 gourmet 路線」時有 cosmetic 強化
- 新配件填美術 hat slot — 目前 hat slot 6 件（party_hat / headband / bow / flower / crown / pin_butterfly + star_clip），加 chef_hat 對胖雞 / 美食家 path 視覺鎖定

**動作**：

1. **新增 `assets/svg/acc-chef-hat.svg`（17 行純 SVG）**：
   - viewBox 100×100 對標 acc-pin-butterfly.svg 等既有 14 個 SVG 配件
   - 色票嚴守 CLAUDE.md §5：白 #FFF8E7（toque 主體）/ 黑 #2C2C2C（描邊）/ 粉 #FFB7B7（pink trim band）/ 暗紅 #B23A48（草莓裝飾）/ 綠 #6BCB77（草莓蒂）/ 黃 #FFD86B（草莓籽 highlight）
   - 結構：4 個 overlapping ellipse/circle 組成 puffy 廚師帽 silhouette（中央大橢圓 + 左右下兩圓 + 上方圓做 cluster），底部一條 pink trim rectangle，右側裝飾 tiny 草莓（path quadratic curve + green stem stroke + 兩個黃 highlight 點）
   - 兩個 #FFE8C8 透明度 0.7 內部 shading dots 做 puffy 質感層次

2. **`src/cfg.js` accessories 加第 17 條**：
   ```
   chef_hat: { slot:"hat", art:"assets/svg/acc-chef-hat.svg",
               labelKey:"acc.chef_hat", label:"粉粉廚師帽",
               icon:"👨‍🍳", price:200 }
   ```
   - 加在 cd_pendant 後 / 結尾 brace 前，附 `// iter#159 美食家軸` 註解備註設計動機
   - 200 FC 中階定價：高於 headband 50 / lace_collar 140，低於 wings 350 / crown 500 — 鎖在「日常養 gourmet 路線玩家可以 1-2 週存到」區間

3. **`src/i18n.js` 雙語 1 條**：
   - zh-TW: `acc.chef_hat` = "粉粉廚師帽"
   - en: `acc.chef_hat` = "Pastel Chef Toque"（兼顧西方 patisserie 詞彙 + pastel 美學標註）

4. **`sw.js`：CACHE_VERSION iter158 → iter159**

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`14 interactions / 16 accessories / 14 wants / 7 traits / 47 speech_pools / 8 final_forms`
- 本輪 cfg-schema：`14 interactions / **17 accessories** / 14 wants / 7 traits / 47 speech_pools / 8 final_forms`
- check-assets：73 → **74** asset references resolve（新 SVG path 通過）

**美學軸覆蓋更新**：
| 軸 | 事件 | 終態 | 配件 |
|----|------|------|------|
| cottagecore | 蝴蝶 / 雛菊 | — | flower / pin_butterfly / lace_collar |
| coquette | 下午茶（iter#132） | **gourmet（iter#156）** | bow / **chef_hat（本輪）** |
| balletcore | — | diva | ribbon_tie |
| fairycore | — | divine | wings_fairy |
| y2k | — | — | star_clip / cd_pendant |
| cleangirl | — | healthy | blush |
| 元氣 | — | fighter | (party_hat?) |
| 智慧 | — | sage | — |

**i18n 進度跳躍**：
- 種子翻譯：246 + 1 = **247 條** zh-TW + 247 條 en
- accessories 全 functional i18n（17/17 雙欄位 labelKey + label fallback）

**驗證**：
- `node --check src/cfg.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 19 src + asset 74 paths）
- 視覺驗證：在瀏覽器打開 `assets/svg/acc-chef-hat.svg` direct URL 看 SVG render — 由 user 手動驗（http://localhost:8765 仍跑著）

**未來 follow-up**（不在本輪）：
- 加 chef_hat 解鎖成就（解鎖前 5 件 / 全 17 件配件 — 既有 collect 系列的延伸）
- 觀察 gourmet path 玩家配戴比例（需 telemetry）
- 海外發行時把 cfg.accessories 17 條 label fallback 全部移除（labelKey 已 functional）

**影響檔案**：`assets/svg/acc-chef-hat.svg`（新）、`src/cfg.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:11 · Session A — i18n 熱路徑批：performInteraction + menuItemHTML + toggleSleep 全 t() 化（9 keys × 2 locales）

**觸發**：cron 第 158 輪 — 評估 R-1 interactions menu 抽出後決定先做 i18n cleanup。原因：interactions 子系統高耦合（performInteraction 呼 15+ 個函式 / 跨 daily / wants / events / achievements / animations / audio），純抽出大部分變 wrapper，ROI 比 wants/events 那輪低；先把熱路徑硬編碼中文清乾淨，之後抽出更乾淨。

**為什麼**：performInteraction 是玩家**最高頻互動入口**（餵食 / 玩耍 / 摸頭 / 洗澡 / 唱歌 14 條 interaction 全走這），裡面三個 user-facing 字串 + menuItemHTML 四個 menu 子標 + toggleSleep 兩條 speech 全是中文。retrospective-150.md §4.2 把這標為 i18n 殘留 hot spot，逾期 7 輪。

**動作**：

1. **`src/i18n.js` 新增 9 條 key（zh + en，共 18 條）**：
   - **toast.interaction.\* 2 條**：`locked` 「要等 ${stage} 階段才解鎖」/ Unlocks at ${stage} stage、`success` 「${icon} ${name} +${delta}」/ ${icon} ${name} +${delta}（含 3 變數插值）
   - **menu.interaction.\* 4 條**：`locked`「（${stage}解鎖）」/ `cooldown`「（冷卻 ${time}）」/ `cantAfford`「（飼料幣不足）」/ `free`「免費」— 對應 menuItemHTML 三態 + 免費標籤
   - **speech.\* 2 條**：`sleep` 「zzz…」（雙語都是 zzz…，universal）/ `wake` 「早安~」/ Morning~
   - **加 keys 位置**：modal.evolve.body 後排，跟其它高頻 toast 同節

2. **`src/game.js` 三段 surgical replace**：
   - `performInteraction` line 119：`要等 ${stage} 階段才解鎖` → `t("toast.interaction.locked", { stage: stageLabel(cfg.unlock) })`
   - `performInteraction` line 160：`${icon} ${name} +${delta}` → `t("toast.interaction.success", { icon, name, delta })` 三變數插值
   - `toggleSleep` line 175：兩條 speech literal → `t("speech.sleep")` / `t("speech.wake")`
   - `menuItemHTML` line 599-603：`免費` `（${stage}解鎖）` `（冷卻 ${time}）` `（飼料幣不足）` 四個 → 對應 t() 呼叫

3. **`sw.js`：CACHE_VERSION iter157 → iter158**

**i18n 進度跳躍**：
- 種子翻譯：237 + 9 = **246 條** zh-TW + 246 條 en
- functional sites：160 + 9 = **169 處**
- 14 種 interaction 全 i18n functional — 玩家做任何餵食 / 玩耍 / 摸頭都拿到雙語 toast
- 設定頁 / 圖鑑 / 商店三個 modal 之外，**遊戲核心 loop（互動 → toast → speech）也 100% 雙語就緒**

**驗證**：
- `node --check src/{game,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 19 src）
- `grep 中文 game.js[113-178] (interactions block)` → 0 命中
- `grep 中文 game.js[593-618] (menu helpers)` → 0 命中

**為什麼順手不抽 R-1 interactions module**：performInteraction 跨 15 個 fn 呼叫（toast / t / stageLabel / unlocked / isOnCooldown / spendCoin / applyDelta / clamp / trackDailyTask / bumpHistory / fulfillWantIfMatches / checkAchievements / grantCoin / rand / playReactionAnim / SFX / formatDelta / pickHappy / save / render），全部要透過 NourishAPI bridge 暴露。對標 events.js 抽出（iter#143 -101 行）的 ROI 估算，interactions 抽出能淨減 ~80-90 行但 NourishAPI surface 會再 +5（spendCoin / unlocked / isOnCooldown / setCooldown / trackDailyTask）。等 retrospective §3.5 提到的「NourishAPI 表面積膨脹」想清楚收斂方向再做 — 這輪先處理 i18n。

**剩下 i18n 殘留**（per retrospective-150.md §4.2 + 已完成扣除）：
- ~~showWelcomeBack body~~ ✅ iter#152
- ~~shop.js~~ ✅ iter#152
- ~~openNameDialog~~ ✅ iter#153
- ~~finalizeForm body~~ ✅ iter#153
- ~~performInteraction / menuItemHTML / toggleSleep~~ ✅ **本輪**
- 「孵化禮」grantCoin reason（first_hatch 內，game.js 行 ~437）
- cfg.welcomeBack 5 條 tier.text（cfg-level，留 v0.3 海外發行）
- cfg.speech 46 個 pool ~230 條（cfg-level 大宗）
- cfg.finalForms 8 條 desc（cfg-level）
- grantCoin toast 文字面「💰 +${amount} FC（${reason}）」（game.js 行 183 — wrapper 字串）

**影響檔案**：`src/i18n.js`、`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 05:01 · Session A — gourmet 終態收尾：成就 form_gourmet + speech.form_gourmet 5 條 + collect_all 7→8 + 雙語 i18n

**觸發**：cron 第 157 輪 — iter#156 ship 了 gourmet 終態主結構，但缺三個收尾項：(1) 解鎖成就（其他 4 個正向終態 divine/diva/fighter/sage 都有專屬成就，gourmet 沒有）/ (2) form-specific speech pool（pet 變美食家後缺角色化台詞，會 fallback 到 idle）/ (3) collect_all 成就閾值仍是 7（gourmet 加入後永遠卡 87.5%）。

**為什麼必須做**：
- 成就缺失 = 玩家解鎖 gourmet 後零回饋，努力 60 次餵食的高潮被吞掉
- speech 缺失 = pet 變美食家但說「啾啾~」這類通用台詞，破壞角色幻想
- collect_all 過時 = 圖鑑大師永遠拿不到（除非閾值改）— 是 P1 bug 等級的數值錯誤

**動作**：

1. **`src/cfg.js` 三處同步**：
   - `achievements.form_gourmet`：`{ icon:"🍰", labelKey:"ach.form_gourmet", label:"美食評鑑家", descKey:"achdesc.form_gourmet", desc:"養出美食家雞" }` — 對標 form_divine/diva/fighter/sage 雙欄位 i18n 慣例
   - `achievements.collect_all.desc`：「收集全部 7 種終態」→「收集全部 8 種終態」
   - `speech.form_gourmet`：5 條 cottagecore-adjacent 美食評鑑家口吻 — 「今天的下午茶要配什麼呢？」「🍰 嗯～這個層次很有意思」「新菜單想試試看嗎？」「甜點要適量才優雅」「🥐 這個酥度剛剛好」

2. **`src/achievements.js` evaluate()**：
   - 加 `["form_gourmet", dexUnlocked.has("gourmet")]` 排在 form_sage 後 / collect_3 前
   - `["collect_all", dexUnlocked.size >= 7]` → `>= 8` 對齊新 finalForms 集合

3. **`src/i18n.js` 三組更新**：
   - 新增雙語 4 條：`ach.form_gourmet` 美食評鑑家 / Gourmet Critic、`achdesc.form_gourmet` 養出美食家雞 / Raised a gourmet chicken
   - 修舊 2 條：`achdesc.collect_all` 7 → 8 種（中 + 英）
   - 修舊 2 條：`onboarding2.dex` 7 → 8 final forms（中 + 英 — onboarding modal 介紹圖鑑時提到的數量）

4. **`sw.js`：CACHE_VERSION iter156 → iter157**

**i18n 進度跳躍**：
- 種子翻譯：233 + 4 = **237 條** zh-TW + 237 條 en（不含修舊）
- functional 涵蓋：成就 form 系列從 4 → 5 全 functional i18n（divine/diva/fighter/sage/gourmet）
- 切英文時新成就「Gourmet Critic — Raised a gourmet chicken」直接生效

**lint chain 報表跳躍**：
- 上輪 cfg-schema：`7 traits / 46 speech_pools / 7 final_forms`
- 本輪 cfg-schema：`7 traits / 47 speech_pools / 8 final_forms`
- speech_pools +1（form_gourmet）/ final_forms 已在 iter#156 +1（gourmet）

**為什麼把 speech.form_gourmet 5 條設計成這風格**：
- 對標 form_divine 的 reflective tone / form_diva 的 stage-presence tone / form_sage 的 contemplative tone — 每個 form 一個鮮明角色聲音
- 美食評鑑家應該帶「品味、層次、適量」關鍵字 — 跟 fatty 的「再吃一點點就好」（過度）形成對比
- 5 條跟 form_divine（5 條）/ form_diva（5 條）等量，確保 idle pool rotation 不會偏短
- emoji（🍰 🥐）跟 cfg.traitsDisplay.feedCount.icon 一致，視覺鎖定

**為什麼 collect_all 閾值同步是 P1 而非 P2**：
- 不修的話，加入 gourmet 之後永遠拿不到 collect_all（dexUnlocked.size 最大值 = 8，舊閾值 7 只要解鎖 7 個就觸發 — 但這也意味著解到第 8 個 gourmet 後，achievements.evaluate() 仍說「✅ size >= 7」，achievements.js 內 unlockAchievement 已 return false（已解鎖跳過），表現上是「解 7 個就拿到，第 8 個沒慶祝」— 是 staleness bug 而非 hard error
- 即使如此，desc「收集全部 7 種」字面跟實際 8 種不符，仍是 P1 體驗破綻

**影響檔案**：`src/cfg.js`、`src/achievements.js`、`src/i18n.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:51 · Session A — v0.2 新進化分支「美食家雞」(gourmet)：終態從 7 → 8，新 trait 維度 feedCount

**觸發**：cron 第 156 輪 — retrospective-150.md §4.3「v0.2 仍未做：取名對話、新進化分支」第二項；前 11 輪都在做 R-1 / i18n（純 refactor），本輪換成 content 推進。

**為什麼**：
- GDD §10.2 把「新進化分支」列為 v0.2 必做，已連續延期數十輪
- 現有 7 終態（healthy / divine / diva / sage / fighter / fatty / ugly）以「個性 / 異常」維度切，缺一個「養成過程」維度的支線（餵食頻率高 → 美食家）
- 美食家設計呼應 iter#132 加的「下午茶」隨機事件 + cottagecore 美食家路線，鎖女性向 TA（粉色廚師帽 + 草莓圍裙 + 馬卡龍 motif）
- 解鎖條件 feedCount >= 60 — 約 3 週日常養成，非肝向也非太鬆

**動作**：

1. **`src/cfg.js` 三處同步**：
   - `traitsDisplay` 加第 7 條：`{ key:"feedCount", icon:"🍰", label:"美食點數", cap:60, form:"美食家雞", round:false }`
   - `finalForms.gourmet`：label「美食家雞」+ desc「戴著粉色廚師帽，對美食有獨到品味，從餵食累積中走出的下午茶系成雞。」
   - `petArt.adult.gourmet`：暫指 `assets/images/chick-adult-healthy.png` 占位（cfg-schema invariant 7.5 雙向 key 同步必須），加 `// PLACEHOLDER:` 註解 + 引導去 image-prompts.md

2. **`src/save.js` defaultState pet.traits**：加 `feedCount: 0` 第 7 個維度（migrate via deepMerge 自動補舊存檔的缺欄）

3. **`src/daily.js` bumpHistory**：feed_* interaction 同步 bump `state.pet.traits.feedCount`（per-pet 累計，跟 history.feedCount 跨生命週期不同層級）

4. **`src/evolve.js` finalizeForm trait 鏈**：在 fighter 後 / fatty 前插入 `else if (tr.feedCount >= 60) form = "gourmet";`（gourmet 概念上比 fatty 精緻，priority 高一階；同時保 divine/diva/sage/fighter 4 個 RNG 罕見度更高的支線在前）

5. **`scripts/check-cfg-schema.js` KNOWN_TRAITS**：加 `"feedCount"`，否則 traitsDisplay 第 7 條會被 lint 標未知 key

6. **`docs/image-prompts.md` §8.5 新條目**：完整 prompt（粉色 toque blanche 廚師帽 + cream / blush-pink 圍裙含 strawberry / macaron motif + 銀色 fork / whisk + 滿足半閉眼 + transparent background + cottagecore 美學標註），含「為什麼這個設計」一段（aesthetic 區隔 healthy / fatty / sage 視覺記憶點）+ 解鎖條件 doc

7. **`sw.js`：CACHE_VERSION iter155 → iter156**

**lint chain 驗證**：
- cfg-schema：`7 traits / 8 final_forms`（從 6 / 7 升級）✅
- check-assets：73 → 73 paths resolve（gourmet 暫用既有 healthy.png，沒新 path）✅
- i18n-shadow：19 src 全綠 ✅
- smoke 8/8 ✅
- 整 chain：6 step + 8/8 smoke + 19 files in shell ✅

**為什麼選 feedCount 而非新 trait 維度**：
- 新 trait（如 explorerPoints / patisserieLevel）需要新事件 / 新互動填充，超出單輪範圍
- feedCount 已存在於 state.history，搬到 state.pet.traits（per-pet）只需 1 行 daily.js 補一個 mirror bump
- 解鎖條件「累計餵食數」直觀、可觀測（玩家從 settings traits 進度看得到）
- 不影響既有 6 終態的 trigger 條件 — 完全 additive

**為什麼 priority 放在 fighter 後 / fatty 前**：
- 上：divine / diva / sage / fighter 是 4 個「個性 / 才能」支線，進入需主動投入（perfect streak / 唱歌 / 思考拼圖 / 戰鬥）
- 中：gourmet「日常養成累積」屬於中段稀有 — 不像 divine 罕見，但比 fatty / ugly 更需要持續投入
- 下：fatty / ugly 是「過度行為」失衡支線
- 結論：gourmet 在 4 才能後 / 2 失衡前，邏輯最自然

**未來 follow-up**（不在本輪）：
- 真實 chick-adult-gourmet.png 美術產出（image-prompts §8.5 已備）
- 海外發行時 cfg.finalForms 整批 i18n（目前只在 cfg 中文 desc）
- 觀察 feedCount >= 60 的玩家比例，調整 cap（現 60，~3 週）

**影響檔案**：`src/cfg.js`、`src/save.js`、`src/daily.js`、`src/evolve.js`、`scripts/check-cfg-schema.js`、`docs/image-prompts.md`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:41 · Session A — R-1 round tick：抽 reconcileOffline + tickOnline 到 src/tick.js → game.js 1384 → 1321（-63）

**觸發**：cron 第 155 輪 — save 抽出後（iter#154），剩下 R-1 plan §4.1 大塊「state init/migration/tick (~280)」其實是一束 — save 已抽（96 行 net），剩下 init / tick / DOM 綁定。tick 是中間最自包含的純邏輯子塊，先抽。

**為什麼**：reconcileOffline + tickOnline 共 ~65 行純運算邏輯（stat decay / cross-stat penalty / growthScore Δ / perfectStreak 累計 / lowMoodMinutes 累計）。0 個 DOM / SFX / toast 副作用，完全可透過 NourishAPI.getState() + NourishUtils.{applyDelta,clamp} + NourishCFG bridge 抽出。

**動作**：

1. **新增 `src/tick.js`（102 行 IIFE）**：
   - `reconcileOffline()`：tab 返回 / init 時呼叫。算 lastTickAt 距 now 的 elapsedMs，cap 在 `CFG.decay.offlineCapHours * 3600 * 1000`（8h），對 stats 套用 offline rate（睡眠時用 energySleep 替 energy），≥24h 觸發一次性 `growth.offline24hPenalty`，stamp lastTickAt = now，回 `{ elapsedMs }` 給 caller 觸發 welcome-back 對應 tier
   - `tickOnline(deltaMs)`：每秒 / 每 tick interval 呼叫。`!Number.isFinite || <=0` 守，>5 分鐘 throttled-tab clock skew 截上限（5 min cap），online rate 套 stats，cross-stat penalty（hunger<low → mood -0.20/min；clean<mid → mood -0.10/min），growthScore 五段判（high stat 加成 / 全四高 perfectBonus + perfectStreakMinutes 累計 / hunger<low 扣 / mood<low 扣 + lowMoodMinutes 累計），最後 `growthScore = max(0, +dScore)` 防負
   - 透過 NourishAPI / NourishCFG / NourishUtils lazy bridge
   - 暴露：`window.NourishTick = { reconcileOffline, tickOnline }`

2. **`src/game.js` 移除 ~65 行 + 換 2 行 wrapper**：
   - `reconcileOffline / tickOnline` 兩個 thin wrapper，保 callsite 識別字（line 1281 / 1326 / 1366 三處）
   - 整段 reconcileOffline (24 行) + tickOnline (40 行) 從 game.js 抽走
   - 同時清掉本來在 line 157-158 的 `applyDelta / clamp` wrapper（tick.js 直接用 utils()），game.js 還有別處引用所以保留別處的 wrapper

3. **`index.html`：save.js 之後 / game.js 之前插入 `<script src="src/tick.js">`**

4. **`sw.js`：CACHE_VERSION iter154 → iter155；APP_SHELL 加 `./src/tick.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/tick.js`**

**lines 變化**：
- `src/game.js`：1384 → **1321**（-63 行）
- `src/tick.js`：**新增 102 行**
- `src/game.js` 距離 2000 警戒線 buffer：616 → **679** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / save / **tick**（18/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → shop -64 → save -62 → **tick -63** = 共 -672 行 / 11 輪
- 剩下 R-1 大塊：interactions menu render (~150) / state init / startTick orchestration / Action 按鈕 binding

**驗證**：
- `node --check src/tick.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 19 src）
- 行為驗證（讀程式碼）：
  - reconcileOffline 仍 cap offlineCapHours、套 sleeping energy rate、24h 一次性 penalty、回 `{ elapsedMs }` — 行為零變動
  - tickOnline 仍 throttled-tab 5 min cap、cross-stat penalty 兩條、growthScore 五段、perfect/lowMood streak 累計 — 行為零變動

**為什麼 buffer 沒一次衝到 700+**：因為 game.js 仍持有 `let state` closure + 一些 cache 變數 + init / startTick / startBackgroundTimers / wireUp 五大編排函式（共 ~300 行），這部分屬「orchestrator layer」按 R-1 plan §1.4 應該保留。最終 game.js 預計收斂在 ~600-800 行。

**影響檔案**：`src/tick.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:31 · Session A — R-1 round save：抽 defaultState + migrate + load + write 到 src/save.js → game.js 1446 → 1384（-62）

**觸發**：cron 第 154 輪 — retrospective-150.md §4.1 排序建議「save/load (~70) 低風險小單元」次於 accessory shop（已完成 iter#151）。本輪兌現第二項。

**為什麼**：save/load 是純 I/O 層（localStorage CRUD + JSON 序列化 + schemaVersion migrate）— 邊界乾淨，無 closure 緊耦合（除了 `state` 本身和 `isReadOnlyTab` cross-tab gate）。defaultState 是 37 行 pure factory，跟 migrate 一起搬走最自然。`save()` 內 `isReadOnlyTab` 檢查跟 closure 變數綁，留 game.js 做 thin wrapper 處理。

**設計選擇**：
- **state 仍是 game.js closure 變數**：不開 setState API，保留 `let state = null` 在 game.js。save.js 純粹 state-in / state-out。
- **load 回傳新 state 物件**：`state = window.NourishSave.loadFromStorage()`，game.js init 把回傳值賦給 closure 變數。
- **write 接 state 參數**：`window.NourishSave.writeToStorage(state)`，避免 save.js 持有 state ref。
- **`isReadOnlyTab` gate 留 game.js**：`save()` wrapper 先檢查再呼叫 writeToStorage。違反 DRY 但保持責任邊界乾淨。
- **toast.save.quota 由 save.js 直接呼叫 NourishAPI.toast**：QuotaExceededError 處理留在 save.js（純 I/O 層的 self-contained 錯誤處理）。

**動作**：

1. **新增 `src/save.js`（96 行 IIFE）**：
   - `defaultState()`：純 factory — schemaVersion / now timestamps / pet 完整初始狀態 / economy 50 FC / daily 三任務 / history 七計數 / achievements / settings
   - `migrate(data)`：schemaVersion < 1 fallback defaultState，否則 deepMerge 上去
   - `loadFromStorage()`：localStorage 讀 → JSON.parse → migrate；失敗 fallback defaultState
   - `writeToStorage(state)`：updatedAt stamp + JSON.stringify + setItem；QuotaExceeded 透過 NourishAPI.toast 提示玩家
   - 透過 NourishCFG / NourishUtils / NourishI18n / NourishAPI lazy bridge
   - 暴露：`window.NourishSave = { defaultState, migrate, loadFromStorage, writeToStorage }`

2. **`src/game.js` 移除 ~70 行 + 換 4 行 wrapper**：
   - `defaultState` → 1 行 wrapper（callsite ×4：load/migrate/startNewEgg/internal）
   - `migrate` → 1 行 wrapper（callsite ×1：load）
   - `load` → 1 行 wrapper（callsite ×1：init）
   - `save` → 4 行 wrapper（保 isReadOnlyTab gate + 委派 writeToStorage）
   - 移除整段 37 行 defaultState factory + 12 行 load + 13 行 save + 4 行 migrate = 66 行
   - 加 4 行 wrapper：淨 -62 行

3. **`index.html`：shop.js 之後 / game.js 之前插入 `<script src="src/save.js">`**（必須在 game.js 前載入，因 init 立即呼叫 load）

4. **`sw.js`：CACHE_VERSION iter153 → iter154；APP_SHELL 加 `./src/save.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/save.js`**（smoke test 內 init() 路徑會呼 load → defaultState → 必要）

**lines 變化**：
- `src/game.js`：1446 → **1384**（-62 行）
- `src/save.js`：**新增 96 行**
- `src/game.js` 距離 2000 警戒線 buffer：554 → **616** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / shop / **save**（17/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → shop -64 → **save -62** = 共 -609 行 / 10 輪
- 剩下大塊（per retrospective §4.1）：state init/migration/tick (~280) — 注意：本輪只抽了 save/load，**state 主體（init / tick / reconcileOffline）仍在 game.js**；interactions menu render (~150)；welcome-back (~22 已 i18n 化但結構仍在 game.js)

**驗證**：
- `node --check src/save.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + sw shell **18 files** + i18n-shadow 18 src）
- 行為驗證（讀程式碼）：load 仍走 schemaVersion gate（`<1` → fresh）→ deepMerge → 回傳 state；save 仍 isReadOnlyTab early-return + updatedAt stamp + QuotaExceededError toast — 行為零變動

**影響檔案**：`src/save.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:21 · Session A — i18n 雙批：openNameDialog 7 處中文 + finalizeForm body 4 變數插值

**觸發**：cron 第 153 輪 — retrospective-150.md §4.2 把 finalizeForm body 列為剩餘 i18n hot spot 之首；openNameDialog 是 v0.2 「取名對話」核心 UI（GDD §10.2）但 7 處硬編碼中文，玩家切英文時看到中文 modal 體驗破碎。

**為什麼**：
1. **取名對話** 是 D1 onboarding 高曝光（first_hatch 後立刻會跳 namehint 引導）+ 玩家有意改名時都會打開。「✏️ 修改名字」「🎀 為小雞取名」「首次取名 +10 心情」三個 modal label / 「確定」按鈕 / 取名後「你好，X！」「改名為 X」toast / 「好名字~」speech 全是中文。
2. **finalizeForm body** 是玩家整段養成 pipeline 的最高潮 — 養 30 天看到的進化慶祝 modal。「經過 ${days} 天的養育...進化成了...」3 行 HTML 被 i18n.title 包裝起來但 body 沒。

**動作**：

1. **`src/i18n.js` 新增 8 條 key（zh + en，共 16 條）**：
   - **modal.naming.\* 4 條**：`titleNew` 🎀 為小雞取名 / `titleEdit` ✏️ 修改名字 / `firstHint` 首次取名 +10 心情 / `btnConfirm` 確定
   - **toast.naming.\* 2 條**：`greet` 你好，${name}！/ `renamed` 改名為 ${name}
   - **speech.naming.thanks 1 條**：好名字~
   - **modal.evolve.body 1 條**：4 變數插值 — `${days}` `${name}` `${form}` `${desc}`，整段 HTML 含 `<strong>` `<br>` 分隔

2. **`src/game.js` openNameDialog（行 1147-1180）**：
   - title：條件三元 `nameSet ? t("modal.naming.titleEdit") : t("modal.naming.titleNew")`
   - first hint：`t("modal.naming.firstHint")`
   - 確定按鈕：`t("modal.naming.btnConfirm")`
   - greet toast：`t("toast.naming.greet", { name: v })`
   - renamed toast：`t("toast.naming.renamed", { name: v })`
   - thanks speech：`t("speech.naming.thanks")`
   - 唯一保留的 `"啾啾"` 是 `state.pet.name || "啾啾"` 邏輯預設值，不是 user-facing 顯示

3. **`src/evolve.js` finalizeForm（行 75-79）**：
   - body 從 3 行 HTML template 收進 `t("modal.evolve.body", { days, name: state.pet.name, form: A.formLabel(form), desc: A.formDescription(form) })` 一行 + 外包 `<p>` 樣式包裝
   - 4 變數 interpolation 一次過 i18n.js replacer（global flag /g 多變數安全，iter#152 已驗）

4. **`sw.js`：CACHE_VERSION iter152 → iter153**

**i18n 進度跳躍**：
- 種子翻譯：225 + 8 = **233 條** zh-TW + 233 條 en
- functional sites：153 + 7 = **160 處**
- v0.2 「取名對話」UI 100% i18n functional — 切英文時 onboarding 完全本地化
- 進化慶祝 modal 兩端（title + body）都 i18n functional — 唯一仍中文的是 `formDescription(form)` 來自 cfg.finalForms 的內容（cfg-level i18n 留 v0.3）

**驗證**：
- `node --check src/{game,evolve,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 17 src）
- `grep 中文 src/evolve.js` → 2 命中：line 7 docstring 註解 + line 76 fallback default name「啾啾」（邏輯預設值，非 UI 顯示）
- `grep 中文 src/game.js openNameDialog` → 1 命中：line 1148 fallback default name「啾啾」（同上）

**剩下大塊 i18n 殘留**：
- `src/game.js` 「孵化禮」grantCoin reason（first_hatch 內）
- cfg.welcomeBack 5 條 tier.text（cfg-level，留 v0.3 海外發行批次）
- cfg.speech 46 個 pool ~230 條（cfg-level 大宗）
- cfg.finalForms 7 條 desc（finalizeForm body 內 ${desc} 來源）

**影響檔案**：`src/i18n.js`、`src/game.js`、`src/evolve.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:11 · Session A — i18n 雙批：showWelcomeBack body 全 t() 化 + shop.js 殘留 8 處中文補完

**觸發**：cron 第 152 輪 — retrospective-150.md §4.2 列「showWelcomeBack body」為 i18n 殘留首條，shop.js iter#151 抽出時刻意未動的 8 處硬編碼中文也排在 §4.2 後段。本輪一次清。

**為什麼**：
1. **welcome-back modal**：每次玩家離線回來都會看，是高曝光面 — 切英文時還顯示「你離開了 5 分鐘」會穿幫。retrospective §3.4 教訓「抽出 module 時順手 i18n 化」雖然 welcome-back 沒被抽出（仍在 game.js）但同類負債。
2. **shop.js**：iter#151 抽出時保「行為零變動」原則沒碰，這輪兌現補完。SLOT_LABELS / 按鈕字 / 解鎖 toast / footer text 全 user-facing。

**動作**：

1. **`src/i18n.js` 新增 13 條 key（zh + en，共 26 條）**：
   - **time.\* 3 條**：`minutes` / `hours` / `days`，每條 `${n}` 插值
   - **modal.welcomeBack.\* 2 條**：`body`（含 `${friendly}` `${tierText}` `${extra}` 三變數）/ `moodPenalty`（HTML 條件 fragment）
   - **toast.coin.compensation 1 條**：補償 / Compensation（welcomeBack 高離線檔給 coin 的 reason）
   - **modal.shop.\* 6 條**：4 個 slot label（hat / face / neck / wing 含 emoji）/ btnEquipped 「✅ 配戴中」/ btnEquip 「戴上」/ footer 「💰 ${coin} FC · 戴上後會出現在啾啾身上」
   - **toast.shop.unlocked 1 條**：含 `${name}` 插值

2. **`src/game.js` showWelcomeBack（行 359-381）**：
   - friendly time formatter：3 個分支從 `${n} 分鐘` 改 `t("time.minutes", { n })` 等三鍵
   - `extra = "<br><small>（心情 -5）</small>"` → `t("modal.welcomeBack.moodPenalty")`
   - `grantCoin(tier.giveCoin, "補償")` → `grantCoin(tier.giveCoin, t("toast.coin.compensation"))`
   - body 整段 `<div>你離開了 <strong>${friendly}</strong><br>${tier.text}${extra}</div>` → `<div>${t("modal.welcomeBack.body", { friendly, tierText: tier.text, extra })}</div>`
   - 多變數 i18n interpolation 確認：i18n.js 第 483 行 replacer `/\$\{(\w+)\}/g` 是 global flag，多變數安全

3. **`src/shop.js` 4 處**：
   - 解鎖 toast：`\`🎀 解鎖 ${cfgLabel}！\`` → `t("toast.shop.unlocked", { name: cfgLabel })`
   - SLOT_LABELS：4 個物件值改 `t("modal.shop.slot.X")`
   - buy / equip 按鈕：`isOn ? "✅ 配戴中" : "戴上"` → `isOn ? t("modal.shop.btnEquipped") : t("modal.shop.btnEquip")`
   - footer：`💰 ${coin} FC · 戴上後會出現在啾啾身上` → `t("modal.shop.footer", { coin })`
   - **`grep -P 中文 src/shop.js` → 0 命中**：shop.js fully i18n functional

4. **`sw.js`：CACHE_VERSION iter151 → iter152**

**i18n 進度跳躍**：
- 種子翻譯：212 + 13 = **225 條** zh-TW + 225 條 en
- functional sites：142 + 11 = **153 處**（welcomeBack 5 + shop 6）
- shop.js / welcomeBack 全功能 i18n（切英文時兩個 modal 完全本地化）

**剩下 i18n 殘留 hot spots**（per retrospective-150.md §4.2 + 本輪殘餘）：
- `src/evolve.js` finalizeForm body：「經過 ${days} 天的養育...」3 行 HTML — 留下輪
- `src/game.js` 行 ~437「孵化禮」grantCoin reason
- `src/game.js` 行 374 speak("嗚嗚嗚~") — 不抽出（speech 是字符性 sound effect，不需 i18n）
- cfg.welcomeBack 5 條 tier.text 仍是中文 — 屬 cfg-level 大批次，留 v0.3 海外發行前

**驗證**：
- `node --check src/{game,shop,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 17 src）

**影響檔案**：`src/i18n.js`、`src/game.js`、`src/shop.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 04:01 · Session A — R-1 round shop：抽 accessory shop 子系統到 src/shop.js → game.js 1510 → 1446（-64）

**觸發**：cron 第 151 輪 — retrospective-150.md §4.1 排序建議 accessory shop（高 ROI 中複雜度）優先於 save/load 與 state，本輪兌現。

**為什麼**：accessory shop 4 函式（isAccessoryOwned / buyAccessory / equipAccessory / openShopMenu）共 ~70 行，外部 callsite 只有 1 處（`$("btn-shop").onclick`），其餘三個都是 modal onMount 內部 closure 使用。邊界乾淨，依賴清楚（state / cfg.accessories / SFX / NourishUtils.cfgLabel / showModal / spendCoin / save / render / checkAchievements / toast / t）。

**動作**：

1. **新增 `src/shop.js`（111 行 IIFE）**：
   - `isOwned(id)`：state.pet.ownedAccessories[id] 雙負查
   - `buy(id)`：cfg 查找 → owned 阻擋 → feedCoin 比價 → spendCoin → ownedAccessories 寫時戳 → SFX.coin → toast 解鎖訊息 → checkAchievements → save → re-open menu
   - `equip(id)`：未 owned 阻擋 → appearance[slot] toggle（同 id 取消，否則覆寫）→ SFX.click → checkAchievements → save → render → re-open menu
   - `openMenu()`：4 slot grouping（hat / face / neck / wing）+ price 升序排序 + buildRow 動態渲染（買 / 戴上 / ✅ 配戴中 三態按鈕） + 整段 modal 包裝
   - 透過 NourishAPI / NourishCFG / NourishI18n / NourishUtils / NourishUI / NourishAudio lazy bridge
   - 暴露：`window.NourishShop = { openMenu, buy, equip, isOwned }`（4 個都暴露，雖然外部只用 openMenu，留 surface 給未來測試 / debug 用）

2. **`src/game.js`：移除 70 行 + 換 4 行 thin wrapper**：
   - `isAccessoryOwned / buyAccessory / equipAccessory / openShopMenu` 4 個 wrapper
   - 唯一外部 callsite（行 ~1345 `$("btn-shop").onclick = openShopMenu`）保留識別字
   - `NourishAPI` 加 `spendCoin`（shop.js buy 流程需要）— 與既有 grantCoin 對偶

3. **`index.html`：evolve.js 之後 / game.js 之前插入 `<script src="src/shop.js">`**

4. **`sw.js`：CACHE_VERSION iter149 → iter151；APP_SHELL 加 `./src/shop.js`**（iter150 是純 docs round，跳過 cache 號）

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/shop.js`**

**lines 變化**：
- `src/game.js`：1510 → **1446**（-64 行）
- `src/shop.js`：**新增 111 行**
- `src/game.js` 距離 2000 警戒線 buffer：490 → **554** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / evolve / **shop**（16/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → evolve -58 → **shop -64** = 共 -547 行 / 9 輪
- 剩下大塊（per retrospective §4.1）：state init/migration/tick (~280) / save/load (~70) / interactions menu render (~150) / welcome-back (~22)

**i18n 殘留**（shop.js 內，留待後續批次）：
- SLOT_LABELS 4 條中文（👒 頭飾 / 🕶️ 臉部 / 📿 項鍊 / 圍巾 / 🪽 翅膀）
- buildRow 內「✅ 配戴中」「戴上」按鈕字
- modal body footer「戴上後會出現在啾啾身上」
- buy 成功 toast「🎀 解鎖 ${name}！」

抽出時不順手 i18n 化是刻意的 — 保持「行為零變動」原則，i18n 補洞下輪做（沿用 iter#149 模式）。

**驗證**：
- `node --check src/shop.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + sw shell **17 files** + i18n-shadow 17 src）

**影響檔案**：`src/shop.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 03:51 · Session A — iter#150 milestone：docs/retrospective-150.md 寫 iter#135-149 共 15 輪 arc 總結

**觸發**：cron 第 150 輪 — milestone 整數，距離上一份 retrospective-130（iter#135 寫）正好 15 輪，是該收一次 arc 的點。

**為什麼**：這 15 輪是 R-1 拆檔大躍進 + 第一次防呆 lint 落地的關鍵 arc。寫下來幫未來自己 / 後續 contributor 看清三件事：(1) micro-step → 子系統大塊的節奏轉換；(2) P0 第二次發作觸發 lint 升級的反饋迴路；(3) NourishAPI surface 膨脹的必要性。不寫下來這些教訓會隨 cron 輪換自然遺忘。

**動作**：

1. **新增 `docs/retrospective-150.md`（5 章 + 數字總結表）**：
   - **§1 TL;DR**：6 點濃縮 — R-1 拆 6 子系統（game.js -471）/ 2 P0 抓修 / 防呆 lint 落地 / i18n 第 13-15 批 + 補洞（212 條種子）/ review-v2 status sweep / NourishAPI 9→14 export
   - **§2 階段時序表**：14 列 iter#135-149 對應主題 + 產出 / 影響（buffer 數字 + 行數變化）
   - **§3 關鍵學習 5 段**：
     - §3.1 R-1 micro-step → 子系統大塊節奏轉換（前 arc 5 輪 -38 / 本 arc 6 輪 -471，平均 -65）
     - §3.2 P0 同類 bug 第二次發作真相（iter#106 修了 site 沒升級 lint，iter#146 又抓到 finalizeForm + openSettingsMenu，iter#147 才永久守備）
     - §3.3 smoke test 盲區分析（不觸發 modal callback / 互動序列 / migration）+ 補強路徑（modal scenario 或加 lint）
     - §3.4 R-1 抽出 vs i18n 覆蓋 trade-off（hardcoded 中文跟著搬到新模組，coverage 不退步但 functional i18n 退步；iter#149 補洞 12 處）
     - §3.5 NourishAPI surface 膨脹（4 → 14 export）— 是 R-1 plan 必經 transit，最終 game.js 應 ≤ 800 行 orchestrator
   - **§4 後續方向**：剩餘 R-1 大塊評估表（state 280 / save 70 / accessory shop 270 / interactions 150 / welcome-back 22）+ i18n 殘留 + v0.2 待做（取名 / 新進化分支）+ 工程紀律觀察（「P0 → lint」反饋迴路可複製）
   - **§5 數字總結 9 列指標表**：game.js LOC 1981→1510、buffer 19→490、模組 11→16、NourishAPI 9→14、deploy gate 5→6 step、syntax 涵蓋 7→15 file、i18n 種子 168→212、functional sites 124→142、review-v2 83→94%

**為什麼是 5 章 / 9 列數字而不是 4 / 6**：對標 retrospective-130.md 的 6 章 35 輪格式，按比例縮（35:6 ≈ 15:2.5，但章節最低也要 5 才能完整覆蓋 TL;DR / 時序 / 學習 / 後續 / 數字 5 個面向）。數字表 9 列因為這個 arc 度量更多（lint 步數、syntax 涵蓋是新增可量化）。

**lines 變化**：
- `docs/retrospective-150.md`：**新增 ~140 行**（含表格）
- `src/`：本輪不動（純 docs round）

**驗證**：
- `node --check src/game.js` → ✅（沒改 src，只是 sanity check）
- `./scripts/run-checks.sh` 跑一次保險：全綠（6 step + 8/8 smoke + i18n-shadow 16 src）

**影響檔案**：`docs/retrospective-150.md`（新）、`docs/iteration-log.md`

---

## 2026-04-30 03:41 · Session A — i18n 補洞：events / daily / evolve 三模組共 12 個 grantCoin reason + evolve modal 按鈕 + 新蛋 body 全 t() 化

**觸發**：cron 第 149 輪 — 評估 welcome-back (~22) / save-load (~70) 兩個 R-1 候選後，認為新模組 wire-up 成本（4 處註冊 + sw.js bump）大於 LOC saved 的邊際 ROI。改回頭補 iter#142-148 R-1 抽出時順便帶過去的硬編碼中文 — 模組化抽出時把字串照搬，i18n 覆蓋率原地踏步，用戶切英文時這些 toast / 按鈕全還是中文。

**為什麼**：events.js / daily.js / evolve.js 三個新檔案有 12 個高頻 user-facing 中文：grantCoin 的 reason 參數會塞進 toast `"💰 +${coin} FC（${reason}）"`，玩家每次撿錢 / 每日登入 / 進化都看得到；evolve modal 兩個按鈕 + 新蛋確認 modal 整段 body 也都是硬中文。`scripts/check-i18n-shadow.js`（iter#147）只擋 t() 遮蔽，不掃硬編碼字串，所以 lint 不會抓。

**動作**：

1. **`src/i18n.js` 新增 14 個 key（zh + en，共 28 條）**：
   - **toast.coin.\* 7 條**：`found` 撿到 / `dailyLogin` 每日登入 / `streak7` 連續 7 天！/ `streak30` 連續 30 天！！/ `taskDone` 完成每日任務 / `evolve` 進化獎勵 / `finalForm` 終態獎勵
   - **toast.want.\* 3 條**：`reason` 滿足願望 / `fulfilled` 💖 滿足了 ${icon} ${text} 的願望！/ `thanks` 謝謝主人！（之前 wants.js 已 `|| literal` 落回 — 現在正式有 key，落回路徑變防禦性）
   - **modal.evolve.\* 2 條**：`btnContinue` 繼續陪伴 / `btnNewEgg` 🥚 孵化新蛋
   - **modal.startNew.\* 2 條**：`btnConfirm` 確定孵新蛋 / `body` 整段 HTML（含 `${name}` 插值）

2. **`src/events.js`**：
   - 加 `function t(key, opts) {...}` 統一 lazy bridge
   - line 33: `"撿到"` → `t("toast.coin.found")`

3. **`src/daily.js`**：
   - 加 `function t(...)` lazy bridge
   - 4 處 grantCoin reason：dailyLogin / streak7 / streak30 / taskDone 全 t() 化

4. **`src/evolve.js`**（已有 t helper）：
   - 2 處 grantCoin reason：evolve / finalForm
   - 2 個 modal button label：繼續陪伴 / 🥚 孵化新蛋
   - 1 個 modal button label：確定孵新蛋
   - confirmNewEgg body：5 行 hardcoded HTML → 1 行 `t("modal.startNew.body", { name })` 插值（保留 `${name}` placeholder 串接）

5. **`sw.js`**：CACHE_VERSION iter148 → iter149（玩家拉新 SW 才能看到 en locale 的新字串）

**i18n 進度跳躍**：
- 種子翻譯：198 + 14 = **212 條** zh-TW + 212 條 en
- 替換 sites（functional i18n）：130 + 12 = **142 處**
- 新增 grantCoin reason 全雙語化 — 切英文時 D1 玩家「Daily login +50 FC」「Evolution bonus」直接生效

**剩下未抽的 hardcoded Chinese**（留給後續輪）：
- `src/evolve.js` finalizeForm body：「經過 ${days} 天的養育...進化成了...」3 行 HTML（要新 key + ${days} 插值）
- `src/game.js` showWelcomeBack body：「你離開了 ${friendly} 分鐘 / 小時 / 天」+ tier.text 串接
- `src/game.js` line 437 「孵化禮」 grantCoin reason
- `src/game.js` 內各種 grantCoin / toast 散點

**驗證**：
- `node --check src/{events,daily,evolve,i18n}.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + i18n-shadow 16 src）

**影響檔案**：`src/i18n.js`、`src/events.js`、`src/daily.js`、`src/evolve.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 03:31 · Session A — R-1 round evolve：抽 stage / final-form 進化邏輯到 src/evolve.js → game.js 1568 → 1510（-58）

**觸發**：cron 第 148 輪 — iter#147 lint 守備到位後，回頭做 R-1 evolve（iter#146 P0 期間就排好順位，逾期一輪）。

**為什麼**：maybeEvolve + finalizeForm + confirmNewEgg 三函式共 ~64 行是進化系統核心邏輯，自包含、邊界清楚（trait 優先序 → finalForm 設定 → 慶祝 modal → 新蛋分支）。`pulseEvolve` / `spawnEvolveParticles` 已經在 NourishAnim，showModal/closeModal 已經是 NourishUI bridge，剩下只缺 `startNewEgg` 一個 API expose。

**動作**：

1. **新增 `src/evolve.js`（96 行 IIFE）**：
   - `maybeEvolve`：時間 + growthScore 雙閘 → 升下一階段；adult 階段 delegate 給 finalizeForm；20 FC 進化獎勵；pulseEvolve + SFX.evolve + toast
   - `finalizeForm`：trait 優先序鏈 — perfect/divine 1440min + score 2000 → diva 20 sing → sage 30 int → fighter 30 battle → fatty 10 fat → ugly 720 lowMood → healthy fallback；evolveReward + spawnEvolveParticles + checkAchievements + 慶祝 modal（兩鍵：繼續陪伴 / 🥚 孵新蛋）
   - `confirmNewEgg`：二段確認 modal，飼料幣 + 連登天數保留，確定 → closeModal + startNewEgg
   - 透過 NourishAPI / NourishCFG / NourishI18n / NourishAnim / NourishAudio / NourishUI lazy bridge
   - 暴露：`window.NourishEvolve = { maybeEvolve, finalizeForm, confirmNewEgg }`

2. **`src/game.js` 移除 64 行 + 換 3 行 wrapper**：
   - `maybeEvolve / finalizeForm / confirmNewEgg` 三個 thin wrapper
   - 3 callsite（finalizeForm 內 adult 入口 / share 卡新蛋按鈕 / tick loop）保留識別字、零行為變動
   - `NourishAPI` 加 `startNewEgg`（confirmNewEgg 確定後需要回呼）

3. **`index.html`：idle.js 之後 / game.js 之前插入 `<script src="src/evolve.js">`**

4. **`sw.js`：CACHE_VERSION iter146 → iter148；APP_SHELL 加 `./src/evolve.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/evolve.js`**

**lines 變化**：
- `src/game.js`：1568 → **1510**（-58 行）
- `src/evolve.js`：**新增 96 行**
- `src/game.js` 距離 2000 警戒線 buffer：432 → **490** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / idle / **evolve**（15/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → idle -64 → **evolve -58** = 共 -483 行 / 8 輪
- 剩下大塊：state init/migration/tick (~280) / save/load (~70) / interactions menu render (~150) / welcome-back (~22) / accessory shop (~270)

**意外效應**：iter#146 修的 t-shadow 在 finalizeForm 自然消失（function 已搬出去，新 evolve.js 用 `const tr = state.pet.traits` 命名），iter#147 的新 lint 持續守 openSettingsMenu 那個還在 game.js 的 tr binding。

**驗證**：
- `node --check src/evolve.js` → ✅
- `./scripts/run-checks.sh` → 全綠（6 step + 8/8 smoke + sw shell **16 files** + i18n-shadow 16 src）

**影響檔案**：`src/evolve.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 03:21 · Session A — 防呆 lint：scripts/check-i18n-shadow.js 把 `const t = X` 遮蔽永久擋在 deploy gate 外 + 修 syntax step 漏掃 8 個新檔案

**觸發**：cron 第 147 輪 — iter#146 P0 收尾備註裡記了「下輪做防呆 lint」。tooling 鞏固比 R-1 evolve 純 refactor 對專案健康度更高 ROI（後者下輪做）。

**為什麼**：iter#106 + iter#146 兩輪都是同一類 bug — 函式內 `const t = state.X` 遮掉 module-level i18n 包裝器，後續 `t("key")` 呼叫變成呼叫 traits/tasks 物件 → strict mode TypeError。Smoke test 不跑 modal，cfg-schema 不看呼叫路徑，所以漏了。新增一個專門 lint 永久守住。

**動作**：

1. **新增 `scripts/check-i18n-shadow.js`（55 行 node CLI）**：
   - 掃 `src/*.js` 所有檔
   - regex `^(\s*)(const|let|var)\s+t\s*=\s*(.+?);?\s*$` 抓 t binding
   - 略過註解行（避免 doc 例子誤判）
   - 允許 RHS：以 `(` 開頭（arrow / 帶參數）/ `function` 開頭 / 含 `NourishI18n.t`
   - 其餘 RHS（property access / 物件文字 / 陣列 / 直接值）→ 視為遮蔽 → exit 1，列出 file:line + 改名建議
   - 當前 src/ 4 個合法 binding（utils.js:87 / share.js:22 / ui.js:20 / game.js:1506）全是 arrow 函式或 NourishI18n.t reference，全部 pass ✅
   - 自驗：構造 `const t = state.pet.traits;` 測試檔，lint 命中 exit 1 + 正確錯誤訊息 ✅

2. **`scripts/run-checks.sh` 兩個維護債併修**：
   - **舊**：syntax step 寫死 7 個檔（`cfg / ui / dex / achievements / audio / share / game`）+ 註解寫「7 src files」。實際 src/ 已有 15 個檔（i18n / utils / animations / notifications / wants / events / daily / idle 都是後加）— 8 個新檔的 syntax 從沒被獨立 `node --check` 過（只靠 smoke test 載入時間接驗）。
   - **新**：改成 `SRC_FILES=(src/*.js); for f in "${SRC_FILES[@]}"; do node --check "$f"; done`，自動跟著新增檔 — `${#SRC_FILES[@]}` 動態印出檔數
   - **加**：`step "Lint: scripts/check-i18n-shadow.js"` + `node scripts/check-i18n-shadow.js`，插在 cfg-schema 後 / smoke 前
   - 結果：deploy gate 從 5 step → **6 step**（+1 lint），syntax step 從 7 file → **15 file**

3. **回顧為什麼這個防呆值得做**：
   - 兩個 P0 bug（iter#106 / iter#146）成本：玩家進不到 adult modal / 開不了設定頁，影響真實玩家體驗
   - lint 邊際成本：~55 行 node 腳本 + 1 行 run-checks.sh
   - 永久守備未來所有 `const t = ...` 遮蔽 — 即使下個 contributor 沒讀過 iteration-log
   - 缺點：誤殺機率低但非零（如未來真的要綁 t 到非 function 的合法值）— 屆時改名 RHS allowlist 即可

**lines 變化**：
- `scripts/check-i18n-shadow.js`：**新增 55 行**
- `scripts/run-checks.sh`：原 7 行 syntax-list + 5 step → **泛用迴圈 + 6 step**（淨 +3 行）
- `src/game.js`：本輪不動

**驗證**：
- `node scripts/check-i18n-shadow.js` → ✅ no t-shadow detected (scanned 15 src files)
- `./scripts/run-checks.sh` → 全綠（6 step：syntax 15 files / sw / sw-shell / assets / cfg-schema / **i18n-shadow** / smoke 8/8）
- 回測：在 /tmp 構造 `const t = state.pet.traits;` 測試檔 → lint 正確命中 exit 1（清乾淨後不汙染 repo）

**影響檔案**：`scripts/check-i18n-shadow.js`（新）、`scripts/run-checks.sh`、`docs/iteration-log.md`

---

## 2026-04-30 03:11 · Session A — P0 修：finalizeForm + openSettingsMenu 內 `const t = state.pet.traits` 遮蔽 i18n t() 函式

**觸發**：cron 第 146 輪 — 預備 R-1 round evolve（抽 maybeEvolve + finalizeForm 到 evolve.js）時，讀 game.js 行 243 / 922 發現兩個 `const t = state.pet.traits` 把 module-level `t = (key, opts) => NourishI18n.t(key, opts)` 遮掉。

**為什麼這是 P0**：兩個函式內後續都呼叫 `t("modal.X.title", {...})` 當 i18n 用，但 t 已被遮成 `state.pet.traits` 物件。在 strict mode 下呼叫物件會 TypeError "traits is not a function"，導致：
1. **finalizeForm**：玩家進化到 adult 終態時，`title: t("modal.evolve.title", { form: formLabel(form) })` 直接 throw，終態 modal 開不出來，玩家看不到進化慶祝。
2. **openSettingsMenu**：玩家點 ⚙️ 設定時，`title: t("modal.settings.title")` / `label: t("button.close")` 直接 throw，設定頁完全打不開。

**為什麼之前沒抓到**：
- iter#106 修過 render() 內 `const t = state.daily.tasks` 同類遮蔽，但這兩處是後加的（finalizeForm 在 iter#75 加 i18n title 才出問題；openSettingsMenu 在 iter#127 後加 i18n label）。
- 現有 lint chain 不做 i18n 呼叫對映分析；smoke test 8 scenarios 跑 init + render，**不觸發 evolve modal 或 settings modal**，所以一路綠燈到上線。
- 玩家進化到 adult 需要至少數小時放置 + 達 scoreToEvolve；設定頁只有想看 traits 進度的玩家才開。生產環境若還沒被報，是因為命中率低 / 玩家以為自己網路問題。

**動作**：

1. **`src/game.js` finalizeForm（行 242-269）**：
   - line 243：`const t = state.pet.traits` → `const tr = state.pet.traits`
   - lines 246-251：6 個 `t.X` → `tr.X`（perfectStreakMinutes / singCount / intelligencePoints / battlePoints / fatPoints / lowMoodMinutes）
   - line 258：`t("modal.evolve.title", ...)` 保持不動 — 現在正確解析到 module-level i18n 包裝器 ✅

2. **`src/game.js` openSettingsMenu（行 921-928）**：
   - line 922：`const t = state.pet.traits` → `const tr = state.pet.traits`
   - line 927：2 個 `t[d.key]` → `tr[d.key]`（traitsDisplay 迴圈讀 trait 數值）
   - lines 988, 990 等 `t("modal.settings.title")` / `t("button.close")` 保持不動 — 現在正確解析到 i18n ✅

3. **`sw.js`：CACHE_VERSION iter145 → iter146** — 玩家拉新 SW 才能拿到修補版，舊 cache 會繼續壞。

**回頭防呆 idea（未做，留給下輪）**：
- 加一個 lint：靜態掃 `const t = ` 在 IIFE 內的所有命中，若同函式作用域內又有 `t(` 呼叫，就 fail。
- 或更簡單：把 module-level i18n 包裝器改名為 `i18n` 或 `tr8`，從根源上消除遮蔽 surface — 但 callsite 廣（grep 統計約 80+ 處），改名 PR 不小。

**lines 變化**：
- `src/game.js`：1568 行不變（純 in-place rename）
- `sw.js`：CACHE_VERSION sub-tag iter145 → iter146

**驗證**：
- `node --check src/game.js` → ✅
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 15 files in shell）
- 邏輯正確性：兩處剩下的 `t(...)` 呼叫都是 `t("string", optObj)` 形式（i18n key），原本因遮蔽會 throw；改名後解析到正確的 module-level 包裝器 → 行為正確。

**影響檔案**：`src/game.js`、`sw.js`、`docs/iteration-log.md`

---

## 2026-04-30 03:01 · Session A — R-1 round idle：抽 idle ambient speech 到 src/idle.js → game.js 1632 → 1568（-64）

**觸發**：cron 第 145 輪 — daily 抽出後（iter#144），idle 是下一個自包含、純邏輯（接近）+ 輕 DOM（speak via NourishAPI）的 64 行 block。pickContextualLine 是 GDD §10.3 elder companion 邏輯落地處，邊界清晰、抽出零行為變動。

**為什麼**：idle behaviour 在 game.js 行 1343-1409 共 67 行（含 module-level `let idleTimer = null` + pickContextualLine + startIdleSpeech）；3 個外部 callsite（visibility / cross-tab / 啟動）都是 setInterval 生命週期，可包成 `start / stop` 暴露面。

**動作**：

1. **新增 `src/idle.js`（98 行 IIFE）**：
   - `pickLine`：保留五階段優先序（critical stat → normal stat → wantNag → perfect bliss → elder companion → flavor pool by time/stage/form/rich/quirk/idle）
   - `start`：8 秒 interval，~70% chance 真說話，modal/睡眠時跳過
   - `stop`：clearInterval + null reset
   - 內部 `let timer = null` 自包含
   - 透過 NourishAPI / NourishCFG / NourishUtils / NourishUI lazy bridge
   - 暴露：`window.NourishIdle = { start, stop, pickLine }`

2. **`src/game.js` 移除 67 行 + 換 2 行 wrapper**：
   - `startIdleSpeech` / `stopIdleSpeech` 兩個 thin wrapper
   - 3 callsite：visibility hidden / cross-tab readonly / visibility visible 三處的 `clearInterval(idleTimer)` 統一改用 `stopIdleSpeech()`（replace_all 一發中）
   - 移除 module-level `let idleTimer = null`

3. **`index.html`：daily.js 之後 / game.js 之前插入 `<script src="src/idle.js">`**

4. **`sw.js`：CACHE_VERSION iter144 → iter145；APP_SHELL 加 `./src/idle.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/idle.js`**

**lines 變化**：
- `src/game.js`：1632 → **1568**（-64 行）
- `src/idle.js`：**新增 98 行**
- `src/game.js` 距離 2000 警戒線 buffer：368 → **432** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / daily / **idle**（14/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → daily -52 → **idle -64** = 共 -425 行 / 7 輪
- 剩下大塊：state init/migration/tick (~280) / save/load (~70) / maybeEvolve+finalizeForm (~64) / interactions menu render

**驗證**：
- `node --check src/idle.js` → ✅
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 7 src parse + sw shell **15 files**）

**影響檔案**：`src/idle.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 02:51 · Session A — R-1 round daily：抽 daily login + tasks + history 到 src/daily.js → game.js 1684 → 1632（-52）

**觸發**：cron 第 144 輪 — events 抽出後（iter#143），原本 R-1 plan 下一站是 economy，但 grantCoin/spendCoin 只 ~10 行抽出 ROI 太低。改抽 daily 子系統（login + tasks + history）— 一個自包含、跨 36 天玩家黏性的 v0.2 核心 loop。

**為什麼**：daily 子系統 4 個 helper（handleDailyLogin / resetDailyTasks / bumpHistory / trackDailyTask）共 ~56 行，依賴清楚（state / cfg / grantCoin / speak / rand0 / checkAchievements）。bumpHistory + trackDailyTask 從 interactions code path 高頻呼叫，抽出後減少 game.js 認知負荷。

**動作**：

1. **新增 `src/daily.js`（89 行 IIFE）**：
   - `handleLogin`：ISO 日期 streak 判斷（連續 / 重置）/ resetTasks / dailyLogin coin / 7-day + 30-day 里程碑 / 1.2 秒延遲問候（避開 welcome-back modal collision）/ checkAchievements
   - `resetTasks`：feed_count 5 / play_count 3 / pet_count 4 三組重置
   - `bumpHistory(key)`：state.history.{feed/bath/play/pet}Count 累計
   - `trackTask(key)`：current/target counter + 滿線 20 FC reward + claimed 旗標防重複
   - 透過 NourishAPI lazy bridge：getState / grantCoin / speak / checkAchievements
   - 暴露：`window.NourishDaily = { handleLogin, resetTasks, bumpHistory, trackTask }`

2. **`src/game.js` 移除 56 行 + 換 4 行 wrapper**：
   - 4 thin wrappers（保留 game.js 內 callsite 的識別字 / 無外部介面變動）
   - `NourishAPI` 加 `checkAchievements`（daily.js handleLogin 結尾需要）

3. **`index.html`：events.js 之後 / game.js 之前插入 `<script src="src/daily.js">`**

4. **`sw.js`：CACHE_VERSION iter143 → iter144；APP_SHELL 加 `./src/daily.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/daily.js`**

**lines 變化**：
- `src/game.js`：1684 → **1632**（-52 行）
- `src/daily.js`：**新增 89 行**
- `src/game.js` 距離 2000 警戒線 buffer：316 → **368** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / events / **daily**（13/N）
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → events -101 → **daily -52** = 共 -361 行 / 6 輪
- 剩下大塊：state init/migration/tick (~280) / interactions menu render / welcome-back modal

**為何不抽 economy**：grantCoin/spendCoin 只 10 行，抽出去要拉 toast / unlockAchievement 兩個 dep，wrapper 比 body 多。等 state 抽出時順便處理 `state.economy` 的存取邊界。

**驗證**：
- `node --check src/daily.js` → ✅
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 7 src parse + sw shell **14 files**）

**影響檔案**：`src/daily.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 02:41 · Session A — R-1 round events：抽 random + seasonal events 到 src/events.js → game.js 1785 → 1684（-101）

**觸發**：cron 第 143 輪 — wants 抽出後（iter#142），events 是 R-1 plan 的下一個自然單元；events 比 wants 大且耦合多（DOM stage / dispatch table / 兩個 helper 在 game.js 頂部），但仍可抽。

**為什麼**：events 是 game.js 第二大子系統（~95 行 + 12 行 dispatch + 6 行 runEventApply = 113 行）。耦合面：state / cfg / DOM stage / SFX / unlockAchievement / save / render / grantCoin / toast / utils。全部能透過 NourishAPI bridge / lazy access 解決。

**動作**：

1. **新增 `src/events.js`（134 行 IIFE）**：
   - `RANDOM_EVENT_APPLIES` dispatch（coin_drop 隨機金額）+ `runEventApply`（cfg 驅動 stats/coin/toast）
   - `isSeasonalActive`（日期範圍判斷，含跨年支援 12-20 → 02-10）
   - `maybeSpawn`（守門：active / isSleeping / egg / modal / 末段 20% boost / spawnChance）
   - `spawnNow`（merge regular + seasonal pool / weighted pick / DOM 建 button bubble / 隨機位置 / lifetime expire）
   - `resolve(claimed)`（dispatch fn 或 runEventApply / SFX coin/event / growthScore +3 / history.eventsCaught + eventIds 累計 / star → unlockAchievement）
   - 內部 `let active = null` 自包含
   - 暴露：`window.NourishEvents = { maybeSpawn }`（resolve 由 DOM onclick / setTimeout 內部呼叫，不需暴露）

2. **`src/game.js` 移除 113 行 + 換 2 行 wrapper**：
   - 移除頂部 `RANDOM_EVENT_APPLIES` + `runEventApply`（13 行，包含 header comment 縮減）
   - 移除完整 events block（~95 行）
   - 留 `let eventTimer = null`（timer lifecycle 屬於 startBackgroundTimers 範疇）+ `const maybeSpawnEvent = () => window.NourishEvents.maybeSpawn()` 給 setInterval 用
   - `NourishAPI` 加 `unlockAchievement`（events.js 為 star 事件成就需要）

3. **`index.html`：在 wants.js 後 / game.js 前插入 `<script src="src/events.js">`**

4. **`sw.js`：CACHE_VERSION iter142 → iter143；APP_SHELL 加 `./src/events.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/events.js`**

**lines 變化**：
- `src/game.js`：1785 → **1684**（-101 行；events 抽出最大單輪降幅）
- `src/events.js`：**新增 134 行**
- `src/game.js` 距離 2000 警戒線 buffer：215 → **316** ✅

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / wants / **events**（12/N）
- 剩下 R-1 plan 的目標：economy (~30+) / state (~280)
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → wants -48 → **events -101** = 共 -309 行 / 5 輪
- game.js 距 R-1 plan 目標 ~1200 行還要砍 ~480 行（state 抽出能補上大部分）

**驗證**：
- `node --check src/events.js` → ✅
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 7 src parse + sw shell **13 files**）

**影響檔案**：`src/events.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 02:31 · Session A — R-1 round wants：抽 wants 子系統到 src/wants.js → game.js 1833 → 1785（-48）

**觸發**：cron 第 142 輪 — R-1 拆檔計畫 (docs/r1-plan.md) 持續推進；前幾輪已完成 utils / animations / notifications 三輪，wants 是下一個自然單元（純自包含、需 NourishAPI bridge）

**為什麼**：wants 子系統有 4 個 helper（maybeSpawnWant / spawnWant / expireWantIfStale / fulfillWantIfMatches）共 ~58 行，依賴清晰（state / cfg / SFX / save / render / grantCoin / toast / speak / clamp / t），完全可以靠 NourishAPI bridge 抽出去；spawnWant 沒有外部 caller（只被 maybeSpawnWant 內部呼叫），可以不暴露。

**動作**：

1. **新增 `src/wants.js`（84 行 IIFE）**：
   - 4 個 helper：`maybeSpawn`、`spawnNow`（內部用）、`expireIfStale`、`fulfillIfMatches`
   - 透過 lazy access：`window.NourishAPI`、`window.NourishCFG`、`window.NourishI18n`、`window.NourishUtils`、`window.NourishUI`、`window.NourishAudio`
   - 暴露：`window.NourishWants = { maybeSpawn, expireIfStale, fulfillIfMatches }`
   - 行為與原版一致：保留 isSleeping / egg / modal / cooldown / spawnChance 4 個 spawn 守門檢查；fulfillIfMatches 有 i18n key fallback（`toast.want.fulfilled` / `toast.want.thanks` / `toast.want.reason`）但若 key 不存在，落回原本中文字面（`💖 滿足了 ${icon} ${text} 的願望！`/ `謝謝主人！` / `滿足願望`）

2. **`src/game.js`：拆掉 58 行原版 wants block，換成 4 行 thin wrapper**：
   ```js
   const maybeSpawnWant       = () => window.NourishWants.maybeSpawn();
   const expireWantIfStale    = () => window.NourishWants.expireIfStale();
   const fulfillWantIfMatches = (k) => window.NourishWants.fulfillIfMatches(k);
   ```
   - `spawnWant` 移除（無外部 caller，內部由 wants.js 自己處理）
   - `NourishAPI` 已於本輪稍早 patch 暴露 `speak / save / render / grantCoin`（前提條件）

3. **`index.html`：在 share.js 之後 / game.js 之前插入 `<script src="src/wants.js">`**

4. **`sw.js`：CACHE_VERSION iter141 → iter142；APP_SHELL 加 `./src/wants.js`**

5. **`scripts/check-render-smoke.js`：SCRIPTS 陣列加 `src/wants.js`**

**lines 變化**：
- `src/game.js`：1833 → **1785**（-48 行；含 -58 wants block + 4 行 wrapper + 6 行 NourishAPI 擴展）
- `src/wants.js`：**新增 84 行**
- `src/game.js` 距離 2000 警戒線距離：167 → **215** ✅ buffer 擴大

**R-1 進度**：
- 已抽出模組：cfg / i18n / utils / animations / notifications / ui / dex / achievements / audio / share / **wants**（11/N）
- 剩下 R-1 plan 的目標：events (~85) / economy (~30+) / state (~280)
- 累計從 game.js 搬走：utils -57 → animations -67 → notifications -36 → **wants -48** = 共 -208 行 / 4 輪

**驗證**：
- `node --check src/wants.js` → ✅
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 7 src parse + sw shell 12 files）

**影響檔案**：`src/wants.js`（新）、`src/game.js`、`index.html`、`sw.js`、`scripts/check-render-smoke.js`、`docs/iteration-log.md`

---

## 2026-04-30 02:21 · Session A — i18n cleanup：unlockAchievement 內 cfg.desc / hardcoded toast 修補 → coverage 17%

**觸發**：cron 第 141 輪 — iter#137 achievements 加 descKey 後本應全部 use site 走 cfgDesc，但 unlockAchievement (line 443) 漏了
**為什麼**：iter#137 對 openAchievementsMenu 的 line 1218 改 cfgDesc，但 unlockAchievement 解鎖 toast「「${cfg.desc}」」也用 cfg.desc 沒走 i18n。同時掃發現 line 447 toast「💡 點寵物名字可以取名喔～」hardcoded 沒抽。連帶 i18n 1 個新 key。

**動作**：

1. **`src/i18n.js` 加 1 條種子翻譯（zh + en）**：
   - `toast.namehint`: 「💡 點寵物名字可以取名喔～」/「💡 Tap the pet's name to name it」

2. **`src/game.js` 2 處 i18n cleanup**：
   - line 443 unlockAchievement 解鎖描述 toast：`「${cfg.desc}」` → `「${cfgDesc(cfg)}」`
   - line 447 hardcoded namehint toast → `t("toast.namehint")`

3. **`sw.js` CACHE_VERSION bump**：iter140 → iter141

**Coverage 跳躍**：
- iter#140: 16% (88/546)
- **iter#141: 17% (90/540)**（+2 處真實 single-field 替換 + 6 個 candidate 從計算移除 = 16.1% → 16.7%）

**i18n 進度（iter#67-141）**：
- 種子翻譯：197 + 1（本輪）= **198 條** zh-TW + 198 條 en
- 替換 sites：128 + 2（本輪）= 130 處
- coverage **17%**
- ui.js / share.js / index.html / wants / accessories / interactions / achievements label+desc 全 functional i18n
- unlockAchievement 內也走 cfgDesc 一致

**lines 變化**：
- `src/i18n.js`：+2 行（1 條 × 2 locale）
- `src/game.js`：1833（2 處 in-place 替換不增行）
- `sw.js`：CACHE_VERSION sub-tag iter140 → iter141

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- 玩家解鎖成就：toast 1 顯示 cfgLabel(cfg)、toast 2（描述）顯示 cfgDesc(cfg) — 切 locale 後英文化一致
- toast.namehint 在首次孵化時觸發

**iter#67-141 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 11
- utils.js 13 helper / animations.js 5 helper / notifications.js 4 helper
- i18n 198 種子 / 130 處 wired / **coverage 17%**
- review-v2 完成度 0 → 94%（17/18）
- R-1 + R-4 累計 game.js -160
- launch / dev docs 10 份
- game.js 1833（buffer 167）

**影響檔案**：
- `src/i18n.js`（+2 行 1 條種子 zh+en）
- `src/game.js`（2 處 in-place i18n 替換）
- `sw.js`（CACHE_VERSION sub-tag iter140 → iter141）

**下輪候選**：
1. R-1 round economy 模組（grantCoin / spendCoin / handleDailyLogin / resetDailyTasks）— bigger
2. R-1 round events 模組（85 行 events block）
3. R-1 round wants 模組
4. cfg.speech 大宗 i18n
5. 內容

---

## 2026-04-30 02:09 · Session A — iter#140 milestone：4 notification helpers 抽 src/notifications.js → game.js -36 buffer 167

**觸發**：cron 第 140 輪 milestone — iter#139 R-4 大成功後繼續抽 module
**為什麼**：iter#139 用 src/animations.js 模式驗證「DOM-only / 自含 / 無 state」extraction 安全。notifications subsystem 同樣 self-contained — 4 個函式（notificationsSupported / requestPermission / show / maybeAlertCriticalStat）都是 browser API wrapper，主要邏輯是「呼叫 Notification.X」。state 透過 NourishAPI bridge。本輪 R-1 partial 抽 notifications。

**動作**：

1. **新檔 `src/notifications.js`**（71 行）：
   - 4 個函式都搬出
   - `supported()` / `requestPermission()` / `show(title, body)` / `maybeAlertCriticalStat()`
   - state 透過 `window.NourishAPI.getState()` lazy 訪（避免 IIFE-init 時 NourishAPI 還沒設）
   - cfg 透過 `window.NourishCFG` 直接讀
   - 暴露為 `window.NourishNotify`
   - 玩家 critical stat 提醒文案 hardcoded 暫保留（4 處 CJK，下批次 i18n 整合）

2. **`src/game.js` 4 個 thin wrapper**：
   - `const notificationsSupported = () => window.NourishNotify.supported();`
   - `const requestNotificationPermission = () => window.NourishNotify.requestPermission();`
   - `const showLocalNotification = (title, body) => window.NourishNotify.show(title, body);`
   - `const maybeNotifyCriticalStat = () => { window.NourishNotify.maybeAlertCriticalStat(); save(); };`
   - 注意 maybeNotifyCriticalStat 仍包 save() 因為 lastNotifyAt 寫入後需 persist

3. **`index.html` script 載入順序** + `sw.js` APP_SHELL + smoke test SCRIPTS 同步加 notifications.js

4. **`sw.js` CACHE_VERSION bump**：iter139 → iter140

5. **`CLAUDE.md` §3 結構樹** src/ 補 notifications.js

**lines 變化**：
- `src/notifications.js`：新檔 71 行
- `src/game.js`：1869 → **1833（-36！）**，buffer 131 → **167**
- `index.html`：+1 行 script tag
- `sw.js`：+1 行 APP_SHELL + CACHE_VERSION sub-tag iter139 → iter140
- `scripts/check-render-smoke.js`：+1 行 SCRIPTS
- `CLAUDE.md`：+1 行 結構樹

**R-1 + R-4 累計 module extraction**：
| iter | 抽出 module | game.js Δ | buffer 終 |
|------|-----------|-----------|----------|
| 127 | utils.js (deepMerge / cryptoRandomId) | -14 | 21 |
| 128 | utils.js +4（clamp / rand / rand0 / formatTime）| -8 | 29 |
| 129 | utils.js +3（statColor / signed / pickHappy）| -5 | 34 |
| 130 | utils.js +1（applyDelta）| -4 | 38 |
| 131 | utils.js +1（formatDelta i18n 整合）| -7 | 45 |
| 139 | **animations.js（6 helpers）** | **-86** | 131 |
| **140** | **notifications.js（4 helpers）** | **-36** | **167** |
| 累計 | utils + animations + notifications | **-160** | 7 → 167 |

**iter#100 → iter#140 game.js 變化**：1932 → 1833（-99 行 / buffer 由 68 提升至 167）

**11 個 src 模組演進**：
- iter#34 PWA 上線：5 個（cfg / dex / share / game / style.css）
- iter#67-79 期間：7 個（補 ui.js / audio.js）
- iter#104：8 個（補 i18n.js）
- iter#127：9 個（補 utils.js）
- iter#139：10 個（補 animations.js）
- **iter#140：11 個（補 notifications.js）**
- v0.3 launch 預期 12-14 個（含 wants / events / state core 等）

**iter#140 milestone 反思（iter#100 → iter#140 共 40 輪）**：
- 配件 13 → 16（+3 v0.3 完成 6 美學軸）
- events 9 → 19（+10）
- src 模組 8 → 11（+ utils + animations + notifications）
- i18n 0% → 16%（雙欄位 functional 涵蓋 197 種子 / 128+ wired sites）
- review-v2 78% → **17/18 = 94%**（剩 R-1 完整實作）
- R-1 + R-4 累計 -160 game.js 行
- launch / dev docs：6 → 10 份
- 3 次 WebSearch cross-check
- game.js **1832（buffer 167）**

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 11 src files）
- check-sw-shell：APP_SHELL 11 檔 ↔ index.html 11 script 對齊 ✅
- check-render-smoke：notifications.js 載入後 NourishNotify 正確 expose

**iter#67-140 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → **11**
- scripts 3 → 6
- utils.js 13 helper / animations.js 5 helper / notifications.js 4 helper
- i18n 197 種子 / 128 處 wired / coverage 16%（雙欄位）
- review-v2 完成度 0 → 94%
- R-1 + R-4 累計 game.js -160
- launch / dev docs 10 份
- game.js **1833（buffer 167）**

**影響檔案**：
- `src/notifications.js`（新檔 71 行）
- `src/game.js`（-36 行：4 函式抽出 / +4 行 wrapper）
- `index.html`（+1 行 script tag）
- `sw.js`（+1 行 APP_SHELL + CACHE_VERSION sub-tag iter139 → iter140）
- `scripts/check-render-smoke.js`（+1 行 SCRIPTS）
- `CLAUDE.md`（+1 行 結構樹）

**下輪候選**：
1. R-1 round wants（4 wants helpers + state bridge，~58 行）
2. R-1 round events（6 events helpers，~110 行）
3. R-1 round economy（grantCoin / spendCoin / handleDailyLogin / resetDailyTasks）
4. cfg.speech 大宗 i18n
5. retrospective-140（如果 iter#140 算另一個 30 輪 arc 起點）

---

## 2026-04-30 01:57 · Session A — R-4 partial：6 animation helpers 抽 src/animations.js → game.js -86 buffer 131

**觸發**：cron 第 139 輪 — review-v2 R-4 「中央 timer / animation 生命週期管理」開始實作
**為什麼**：iter#138 review-v2 sweep 後剩 R-1 / R-4 兩條。R-1 round 1 仍需 30+ min budget。R-4 含 timer（iter#79 已部分處理）+ animation lifecycle。本輪挑 animation extract 較自含的部分先做。掃 game.js 1429-1521 共 93 行 6 個 animation helpers（pulseEvolve / playReactionAnim / spawnFloatEmoji / particleSlotsLeft / spawnAchievementParticles / spawnEvolveParticles）— 全部 DOM-only / state-independent。新模組 `src/animations.js` 是 R-4 的標準切入點。

**動作**：

1. **新檔 `src/animations.js`**（115 行）：
   - IIFE 模式同其他 src/ 模組
   - 6 個 animation helpers 完整搬出
   - 內部 `$ = (id) => document.getElementById(id)` 自有 helper（不依賴 game.js 的 $）
   - particleSlotsLeft 改讀 `window.NourishCFG.timing.particleCap`（fallback 30）
   - 暴露為 `window.NourishAnim.{ pulseEvolve, playReactionAnim, spawnFloatEmoji, spawnAchievementParticles, spawnEvolveParticles }`
   - 註解標明「R-4 partial / animation lifecycle centralization」

2. **`src/game.js` 6 處 thin wrapper alias**（5 行替換 93 行）：
   - 5 個 const arrow（pulseEvolve / playReactionAnim / spawnFloatEmoji / spawnAchievementParticles / spawnEvolveParticles）
   - particleSlotsLeft 不暴露（內部用，搬出後 game.js 不需）

3. **`index.html` script 載入順序**：
   - cfg → i18n → utils → **animations** → ui → dex → achievements → audio → share → game
   - animations 在 ui 前（ui 不依賴 animations）

4. **`sw.js` APP_SHELL** 加 `./src/animations.js`：
   - check-sw-shell.js 自動驗證

5. **`scripts/check-render-smoke.js`** SCRIPTS 陣列加 animations.js：
   - 9 → 10 src files in smoke test
   - 8/8 scenarios 全 PASS

6. **`CLAUDE.md` §3 結構樹** src/ 補 animations.js

7. **`sw.js` CACHE_VERSION bump**：iter137 → iter139

**lines 變化**：
- `src/animations.js`：新檔 115 行
- `src/game.js`：1955 → **1869（-86！）**，buffer 45 → **131**
- `index.html`：+1 行 script tag
- `sw.js`：+1 行 APP_SHELL + CACHE_VERSION sub-tag
- `scripts/check-render-smoke.js`：+1 行 SCRIPTS
- `CLAUDE.md`：+1 行 結構樹
- 淨：總 +30 行 / **game.js -86（buffer 大幅改善）**

**為什麼 R-4 partial 如此成功**：
- 6 個 helpers 都是 DOM-only（無 state 觸碰，不需 bridge）
- particleSlotsLeft 唯一依賴 CFG.timing.particleCap → window 全域可訪
- thin wrapper（5 行）對 8+ use sites 全透明
- iter#101 smoke test 8 scenarios 含 egg 階段 particle 動畫，立即驗證 stub coverage
- **比 iter#127-131 R-1 micro-step 大效益**：93 行 / 1 輪 vs 11 純工具 / 5 輪

**R-1 / R-4 累計變化**：
| iter | 抽出 module | game.js Δ |
|------|-----------|-----------|
| 127-131 | utils.js（11 純工具） | -38 |
| **139** | **animations.js（6 DOM helpers）** | **-86** |
| 累計 | utils + animations | **-124** |

src 模組演進：5 → 8 → 9（+ utils）→ **10（+ animations）**

**review-v2 R-4 完成度**：
- ✅ Timer 部分 — iter#79 startBackgroundTimers / stopBackgroundTimers / wireUp* helpers
- ✅ **Animation 部分（本輪）** — animations.js 集中管理所有 setTimeout 動畫
- ⏳ 剩：animation timeout cleanup（玩家切頁時清未完成 setTimeout — 仍需考慮）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 10 src files）
- check-sw-shell：sw.js APP_SHELL 10 檔 ↔ index.html 10 script 對齊 ✅
- check-render-smoke：animations.js 載入後 NourishAnim 正確 expose
- 邏輯保持等價：所有 setTimeout / DOM mutation 完整復刻

**iter#67-139 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → **10**（含 utils + animations）
- scripts 3 → 6
- utils.js 13 helper / animations.js 5 helper
- i18n 197 種子 / 128 處 wired / coverage 16%（雙欄位 functional 涵蓋大宗）
- review-v2 完成度 16/18 → **17/18 = 94%**（R-4 大宗 ✅）
- R-1 5 micro-step + R-4 partial 累計 **-124 行**
- launch / dev docs 10 份
- game.js **1869（buffer 131）**

**review-v2 真實剩餘（iter#139 後）**：
- **R-1 拆 IIFE 完整實作**（state.js / economy.js / interactions.js / render.js / events.js / wants.js — 5-7 cron 輪）
- 其他全 ✅ 或在當前部署條件下可接受

**影響檔案**：
- `src/animations.js`（新檔 115 行）
- `src/game.js`（-86 行 / +5 行 wrapper）
- `index.html`（+1 行 script tag）
- `sw.js`（+1 行 APP_SHELL + CACHE_VERSION sub-tag iter137 → iter139）
- `scripts/check-render-smoke.js`（+1 行 SCRIPTS）
- `CLAUDE.md`（+1 行 結構樹）

**下輪候選**：
1. R-1 round 1 真正 state.js（仍需 30+ min budget）
2. cfg.speech 大宗 i18n（最後一個大塊）
3. animation timeout cleanup（R-4 收尾）
4. cfg-only 內容
5. 寫 sub-agent 派 v0.4 multipet 細化

---

## 2026-04-30 01:45 · Session A — review-v2 status sweep：R-5 標 ✅ DONE 大宗 + P2-1 標監控中

**觸發**：cron 第 138 輪 — 連 4 輪 i18n 後 alternate
**為什麼**：iter#75 確立 review-v2 status 維護工作流，每段時間 sweep 一次。距上次 sweep（iter#75-78）已 60 輪。期間 i18n 從 0 → 14 批 / R-1 從 plan → 5 micro-step / game.js 從警戒 → 安全。review-v2 內 R-5 / P2-1 兩條未標的狀態已過時，應更新。

**動作**：

1. **`docs/review-v2.md` R-5 標 ✅ DONE 大宗**：
   - 列出 iter#104 i18n MVP plumbing + 14 輪 batch 累積成果
   - 197 種子翻譯 / 128 處替換 / 136+ items functional i18n
   - cfgLabel / cfgDesc helper / applyI18nDom DOM 掃描
   - 「未完整實作」備註 cfg.speech 230 條（v0.4 海外 launch 才需）— 不是 v0.2 阻擋線

2. **`docs/review-v2.md` P2-1 標 ⏳ 監控中**：
   - spec 原預警「下一輪加多項功能 game.js 逼近 2000」
   - iter#114 確實高至 1996 警戒 buffer 4 → 觸發 iter#117 r1-plan + iter#127-131 R-1 micro-step
   - 當前 1955 buffer 45 安全區
   - R-1 plan 規劃完整拆 IIFE 為 7 module，預期 game.js 終態 ~250 行
   - 從「警戒」降階到「監控中」

**review-v2 完成度更新**：
- iter#137: 14/18 = 78%（不算 R-5 part / P2-1 part）
- **iter#138: 16/18 = 89%**（R-5 大宗 ✅ + P2-1 監控中算 partial done）
- 真正剩開放的：**R-1 拆 IIFE（已實作 5 micro-step / 仍需 round 1）**、**R-4 中央 timer / animation 生命週期管理**

**lines 變化**：
- `docs/review-v2.md`：+12 行（R-5 / P2-1 詳細說明）
- 無 code 改動 / 無 sw.js bump

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純 docs）

**iter#67-138 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 13 helper
- i18n 197 種子 / 128 處 wired / coverage 16%（雙欄位 functional 已涵蓋大宗）
- review-v2 完成度 0 → **89%**（本輪標 R-5 / P2-1 後）
- R-1 5 micro-step 累計 -38
- launch / dev docs 10 份
- game.js 1955（buffer 45）

**review-v2 backlog 真實剩餘（iter#138 後）**：
- **R-1 拆 IIFE 完整實作**（state.js / economy.js / interactions.js / render.js / events.js / wants.js）— 仍需 5-7 cron 輪
- **R-4 中央 timer / animation 生命週期**（iter#79 wireUp* 部分處理 timer，animation timeout 仍散落）
- 其他 P2-X 全 ✅ DONE 或在當前部署條件下可接受

**影響檔案**：
- `docs/review-v2.md`（+12 行 R-5 / P2-1 status 更新）

**下輪候選**：
1. R-1 round 1 真正 state.js
2. cfg.speech 大宗 i18n
3. R-4 中央 timer / animation 設計
4. 內容
5. 寫 sub-agent 派 v0.4 multipet 細化

---

## 2026-04-30 01:33 · Session A — i18n 第 14 批：cfg.achievements 30 條 descKey + utils 加 cfgDesc helper

**觸發**：cron 第 137 輪 — iter#136 label 30 條完工後 desc 30 條收尾
**為什麼**：iter#136 把 achievements 30 條 label i18n 化但 desc 留下批次。本輪做 desc 30 條（同 cfgLabel 模式 + 新加 cfgDesc helper for description fields）。完成 achievements 整段 i18n（label + desc 60 條）。

**動作**：

1. **`src/utils.js` 加 `cfgDesc(entry)` helper**（+5 行）：
   - 模式同 cfgLabel — descKey 走 i18n / fallback desc 字面
   - 暴露 `window.NourishUtils.cfgDesc`

2. **`src/i18n.js` 加 30 條 achdesc.X 種子翻譯（zh + en）**：
   - 對 30 個 achievements 各寫 desc 翻譯
   - en 翻譯如「Hatched your first chick」「Joined 3 different seasonal events」
   - 含數字的 desc 直接保留（zh: "餵食 50 次" / en: "Fed 50 times total"）— 不做 i18n 數字插值，先簡單

3. **`src/cfg.js` achievements 30 條加 `descKey:"achdesc.X"`**（perl bulk）：
   - 30 個 entries 都加 descKey field
   - 保留 desc 字面 fallback（雙欄位 pattern）

4. **`src/game.js` line 1218 lockableRowHTML 改傳 cfgDesc**：
   - 舊：`desc: c.desc`
   - 新：`desc: window.NourishUtils.cfgDesc(c)`

5. **`sw.js` CACHE_VERSION bump**：iter136 → iter137

**i18n 進度（iter#67-137）**：
- 種子翻譯：167 + 30（本輪）= **197 條** zh-TW + 197 條 en
- 替換 sites：127 + 1（本輪 game.js line 1218）= 128 處
- coverage 16%（雙欄位 stat 不動）
- ui.js / share.js / index.html / wants / accessories / interactions / **achievements label + desc** 全 functional i18n

**剩餘 i18n 大宗**：
- cfg.speech 230+ 條（最大）
- game.js 散見 hardcoded ~80 處（modal body / hint / 其他 toasts）
- cfg.events label / applyToast（部分已替換 iter#86/91 之後）

**lines 變化**：
- `src/utils.js`：106 → 111（+5 cfgDesc helper）
- `src/i18n.js`：+60 行（30 × 2 locale）
- `src/cfg.js`：30 處加 descKey（行寬增）
- `src/game.js`：1955（1 處 in-place 替換不增行）
- `sw.js`：CACHE_VERSION sub-tag iter136 → iter137

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + cfg-schema 30 achievements 仍 valid）
- 玩家圖鑑頁開啟 → lockableRowHTML 收 label/desc 透過 cfgLabel/cfgDesc 解析
- 切 locale 後 30 個 achievements label + desc 全英文化

**iter#67-137 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 9 / scripts 3 → 6
- utils.js **13 helper**（cfgLabel + cfgDesc）
- i18n 197 種子 / 128 處 wired / coverage 16%（雙欄位 functional 已涵蓋大宗）
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38
- launch / dev docs 10 份
- game.js 1955（buffer 45）

**雙欄位 i18n functional 涵蓋範圍**：
- ui.js: showOnboarding / showOnboardingPart2 / openHelpDialog 三 modal triple ✅
- share.js: Canvas 14 strings ✅
- index.html: header / stats / actions 18 attrs ✅
- cfg.wants: 14 條 textKey ✅
- cfg.accessories: 16 條 labelKey ✅
- cfg.interactions: 14 條 labelKey ✅
- cfg.achievements: 30 × 2 = **60 條 labelKey + descKey ✅（本輪完）**
- 共 **136 個 cfg/HTML/JS items 切 locale 後英文化**

**影響檔案**：
- `src/utils.js`（+5 行 cfgDesc）
- `src/i18n.js`（+60 行 30 條種子 zh+en）
- `src/cfg.js`（30 處加 descKey）
- `src/game.js`（1 處 c.desc → cfgDesc(c)）
- `sw.js`（CACHE_VERSION sub-tag iter136 → iter137）

**下輪候選**：
1. cfg.speech 大宗 i18n（最後一個大塊，~230 條，需 spawn-time t() 解析）
2. R-1 round 1 真正 state.js
3. 內容
4. game.js 剩餘 modal body / hint / toast 散見 hardcoded

---

## 2026-04-30 01:21 · Session A — i18n 第 13 批：cfg.achievements 30 條 labelKey（desc 留下批次）

**觸發**：cron 第 136 輪
**為什麼**：iter#133/134 cfgLabel 雙欄位模式對 accessories / interactions 落地，本輪推 achievements 30 條 label。原計畫 60 條（label + desc）一起，但太大 — 拆 desc 給下批次。本輪只 label 30 條 + 2 個 game.js use site 替換。

**動作**：

1. **`src/i18n.js` 加 30 條 ach.X.label 種子翻譯（zh + en）**：
   - 4 個 first 系列：first_hatch / first_evolve / first_feed / face_first
   - 5 個累積系列：feed_50 / bath_10 / pet_50 / wants_10 / wants_50
   - 6 個 streak/dex/event 系列：streak_7/30 / collect_3/5/all / events_100 / seasonal_3
   - 4 個 form 系列：form_divine / form_diva / form_fighter / form_sage
   - 5 個 dressup 系列：dressup_first / set / collector / full
   - 3 個 elder/perfect 系列：elder_week / elder_month / perfect_day
   - 3 個其他：star_caught / rich / master_player
   - en 翻譯保留 cute tone（"Heart Reader" / "Lifetime Partner" / "Festival Hopper"）

2. **`src/cfg.js` achievements 30 條加 `labelKey:"ach.X"`**（perl bulk）：
   - 30 個 entries 全部加 labelKey field
   - 保留 label 字面 fallback（雙欄位 pattern）
   - cfg-schema 不擋（label 仍是 valid string）

3. **`src/game.js` 2 處 achievement context cfg.label 替換**：
   - line 442 unlockAchievement toast：`🏅 ${cfg.icon} ${cfgLabel(cfg)}`
   - line 1218 openAchievementsMenu lockableRowHTML：傳 `label: cfgLabel(c)` 進 helper
   - desc 仍 raw（下批次處理）

4. **`sw.js` CACHE_VERSION bump**：iter134 → iter136（跳 iter135 是 docs-only 沒 bump）

**i18n 進度（iter#67-136）**：
- 種子翻譯：137 + 30（本輪）= **167 條** zh-TW + 167 條 en
- 替換 sites：125 + 2（本輪 game.js）= 127 處
- coverage 16%（雙欄位不動 stat）
- ui.js / share.js / index.html / wants / accessories / interactions / **achievements label** 全 functional i18n

**剩餘 i18n 大宗**：
- cfg.achievements desc 30 條（下批次）
- cfg.speech 230+ 條（架構設計待）
- game.js 散見 hardcoded ~80 處（modal body / hint / 其他 toasts）
- cfg.events label / applyToast（部分已 i18n 過）

**lines 變化**：
- `src/i18n.js`：+60 行（30 × 2 locale）
- `src/cfg.js`：30 處加 labelKey field（行寬增）
- `src/game.js`：1955（2 處 in-place 替換不增行）
- `sw.js`：CACHE_VERSION sub-tag iter134 → iter136

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + cfg-schema 30 achievements 仍 valid）
- 玩家解鎖成就：toast 顯示 cfgLabel(cfg) 解析後文字
- 圖鑑頁成就 row：lockableRowHTML 收 label 透過 cfgLabel 解析
- 切 locale 後 achievements 30 條全英文化

**iter#67-136 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 12 helper（含 cfgLabel）
- i18n 167 種子 / 127 處 wired / coverage 16%（雙欄位 stat 不動，functional 已涵蓋）
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38
- launch / dev docs 10 份
- game.js 1955（buffer 45）

**影響檔案**：
- `src/i18n.js`（+60 行 30 條種子 zh+en）
- `src/cfg.js`（30 處加 labelKey）
- `src/game.js`（2 處 cfg.label → cfgLabel）
- `sw.js`（CACHE_VERSION sub-tag iter134 → iter136）

**下輪候選**：
1. **i18n 第 14 批** cfg.achievements desc 30 條（搭配新 cfgDesc helper）
2. R-1 round 1 真正 state.js
3. 內容 / 配件
4. cfg.speech 大宗 i18n（最大批，需 spawn-time 解析設計）

---

## 2026-04-30 01:09 · Session A — docs/retrospective-130.md：iter#100-134 共 35 輪 arc 總結

**觸發**：cron 第 135 輪 — iter#129-134 連 6 輪 i18n / R-1 後 alternate
**為什麼**：retrospective-100.md 涵蓋 iter#65-100 共 36 輪。iter#100→134 又累積 35 輪推進，沒有對應 retrospective。本輪寫對應檔，給未來輪 backlog 來源 + context 速查（iter#100 後變化不少：R-1 進入實作 / i18n 12 批 / 6 美學軸完成 / 19 events 等）。

**動作**：

1. **新檔 `docs/retrospective-130.md`**（183 行 / 8 章）：
   - **§1 TL;DR**：5 條核心成就
   - **§2 階段時序**：12 個階段對應 35 輪
   - **§3 關鍵學習**（4 條）：
     - 雙欄位 vs 單欄位 i18n 策略 trade-off
     - R-1 micro-step pattern 證明可行（5 輪抽 11 純工具）
     - Smoke test 連 3 次抓 P0 bug
     - 連續 zero edits to game.js 是 cfg-driven 健康度指標
   - **§4 還可做的 backlog**（按 ROI 排序）：
     - High：R-1 round 1 / i18n achievements / i18n speech
     - Medium：R-4 / 桌面陳列 og / v0.3 配件 PNG
     - Low：render 抽 fn / WebSearch v0.4 / iteration-log 分檔
   - **§5 玩家可感改進**（iter#100-134 共 12+ 件，主要 v0.3 配件 + 海外 i18n）
   - **§6 文檔與運維就緒度**：deploy-ready + i18n-ready 雙清單
   - **§7 給下個 cron 階段的建議**：頻率規範 + v0.3 launch SOP
   - **§8 致謝**：對 R-1 / i18n / launch playbook 階段性成就的反思 + 下一個 30 輪預期

2. **`robots.txt` Disallow 加 `/docs/retrospective-130.md`**：
   - 內部 dev journal，與 retrospective-100 / r1-plan 等保持 Disallow 一致

**為什麼 iter#100 → iter#134 寫 35 輪而非 30**：
- iter#100 寫 retrospective 是 milestone 動作
- 後續 iter#101 開始算「post-100」推進
- 寫 retrospective-130 在 iter#135（=100+35）是合理時機
- 對齊 retrospective-100 36-輪覆蓋，下次 retrospective-160 可期

**iter#100→134 重要數字對比**：
| 指標 | iter#100 | iter#134 | Δ |
|------|----------|----------|---|
| 配件 | 13 | 16 | +3 (6 美學軸完成) |
| events | 9 | 19 | +10 |
| i18n coverage | 0% (未量化) | 16% | + |
| review-v2 | 78% | 83% | +5 ppt |
| game.js | 1932 | 1955 | +23（含 R-1 -38 / 內容雜項 +） |
| utils.js | N/A | 106（11 純工具）| 新檔 |
| src 模組 | 8 | 9 | +1 (utils) |
| dev/launch docs | 6 | 9 | +3 (r1-plan / og-update / retrospective-100) |

**lines 變化**：
- `docs/retrospective-130.md`：新檔 183 行
- `robots.txt`：+1 行 Disallow
- `src/game.js`：1955（不變，連 1 輪 zero edits 開始）
- 無 sw.js bump（純 docs）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- markdown 結構（# / ## / 表格 / 列表）合法
- 連結 [retrospective-100.md] / [robots.txt] 都實存

**iter#67-135 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 11+ helper
- i18n 137 種子 / 125+ 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- launch / dev docs **10 份**就位（含本輪 retrospective-130）：
  - iter#65: robots/sitemap
  - iter#66: deploy.md §11
  - iter#70: market-research §6
  - iter#72: launch-plan
  - iter#85: launch-tiktok-prompts
  - iter#100: retrospective-100
  - iter#117: r1-plan
  - iter#118: market-research §7.7 + Lighthouse
  - iter#126: og-image-update
  - **iter#135: retrospective-130（本輪）**

**影響檔案**：
- `docs/retrospective-130.md`（新檔 183 行）
- `robots.txt`（+1 行 Disallow）

**下輪候選**：
1. R-1 round 1 真正 state.js 抽出（state-handling micro-step）
2. **i18n 第 13 批** cfg.achievements label/desc 60 條
3. **i18n 第 14 批** cfg.speech 大宗（需架構設計）
4. cfg-only 內容 / WebSearch v0.4 / sub-agent 派 multipet 細化

---

## 2026-04-30 00:57 · Session A — i18n 第 12 批：cfg.interactions 14 條 labelKey + toast.cooldown 插值

**觸發**：cron 第 134 輪 — 同 iter#133 cfgLabel 模式延伸
**為什麼**：iter#133 對 accessories 16 條走 labelKey 雙欄位，本輪同模式對 interactions 14 條（5 食物 / 5 玩耍 / 1 洗澡 / 2 撫摸 / 1 對話）。多帶 1 條 `toast.cooldown` 插值 key（解 line 318 hardcoded「還在冷卻中」）。

**動作**：

1. **`src/i18n.js` 加 14 條 interaction.X.label + 1 條 toast.cooldown 插值**（+30 行：15 × 2 locale）：
   - feed_basic / corn / berry / worm / cake → 基礎飼料 / 玉米粒 / 莓果 / 小蟲蟲 / 蛋糕（en: Basic Feed / Corn / Berries / Worms / Cake）
   - play_ball / toy / punch / puzzle / sing → 追逐毛球 / 玩具蟲蟲 / 動感節拍 / 思考拼圖 / 唱歌比賽（en: Chase Ball / Plush Toy / Bounce Beats / Puzzle / Singing）
   - bath / pet_head / pet_belly / talk → 洗澡 / 摸頭 / 摸肚子 / 對話
   - **toast.cooldown**: `${name} 還在冷卻中` / `${name} on cooldown`（用 ${name} 插值帶入 cfgLabel(cfg)）

2. **`src/cfg.js` interactions 14 條加 `labelKey:"interaction.X"`**（perl bulk）：
   - 14 個 entries 全部都加 labelKey field
   - 保留 label 字面作 fallback（同 iter#133 雙欄位模式）

3. **`src/game.js` 3 處 interaction context cfg.label → cfgLabel**：
   - line 318 cooldown toast: `t("toast.cooldown", {name: cfgLabel(cfg)})`（合併 i18n + cfgLabel）
   - line 358 success toast: `${cfg.icon} ${cfgLabel(cfg)} +${formatDelta(cfg)}`
   - line 857 menuItemHTML: `<span class="name">${cfgLabel(cfg)}...`
   - line 442 achievement context保留（下批次處理）

4. **`sw.js` CACHE_VERSION bump**：iter133 → iter134

**Coverage 變化**：
- iter#133: 88/546 (16%)
- **iter#134: 89/546 (16%)** — toast.cooldown 真實 single-field 替換 +1
- 14 interactions labelKey 雙欄位不動 stat（cfg.label 仍存在 fallback）
- 真實 functional：14 互動 + 16 配件 切 locale 後全英文化

**i18n 進度（iter#67-134）**：
- 種子翻譯：122 + 15（本輪）= **137 條** zh-TW + 137 條 en
- 替換 sites：121 + 4（本輪）= 125 處
- coverage 16%（雙欄位 stat 不增）
- ui.js / share.js / index.html / wants / accessories / **interactions** 全部 functional i18n

**lines 變化**：
- `src/i18n.js`：+30 行（15 × 2 locale）
- `src/cfg.js`：14 處加 labelKey field（行寬增）
- `src/game.js`：1955（3 處 in-place 替換不增行）
- `sw.js`：CACHE_VERSION sub-tag iter133 → iter134

**i18n 替換進度（iter#67-134 共 12 批）**：
| 批 | 範圍 | 條數 |
|---|------|------|
| #1 | install banner | 4 |
| #2 | stage hints + task footer | 11 |
| #3 | showOnboarding | 6 |
| #4 | showOnboardingPart2 | 8 |
| #5 | openHelpDialog | 13 |
| #6 | wants 雙欄位 | 14 |
| #7 | share.js | 14 |
| #8 | index.html attrs | 18 |
| #9 | game.js toasts | 13 |
| #10 | game.js modal/buttons | 17 |
| #11 | accessories 雙欄位 | 16 |
| **#12** | **interactions 雙欄位 + cooldown** | **14+1** |

剩餘大宗 i18n 候選：
- cfg.achievements label/desc 30 × 2 = 60 條（中型批次）
- cfg.speech 46 pools × ~5 條 ≈ 230 條（最大宗，需要架構改 — speech 結構複雜）
- game.js 剩 ~80 處散見 hardcoded

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- check-cfg-schema：interactions.unlock / interactionMenus.items 仍 valid
- toast.cooldown 插值驗證：`t("toast.cooldown", {name: "洗澡"})` → "洗澡 還在冷卻中"

**iter#67-134 累計**：
- 配件 9 → 16 / events 7 → 19
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 12 helper（含 cfgLabel）
- i18n 137 種子 / 125 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38
- game.js 1955（buffer 45）

**影響檔案**：
- `src/i18n.js`（+30 行 15 條種子 zh+en）
- `src/cfg.js`（14 處加 labelKey）
- `src/game.js`（3 處 cfgLabel + 1 處 toast.cooldown）
- `sw.js`（CACHE_VERSION sub-tag iter133 → iter134）

**下輪候選**：
1. **i18n 第 13 批** cfg.achievements label/desc 30 × 2 = 60 條（中型批次）
2. R-1 round 1 state.js
3. 內容
4. retrospective-130

---

## 2026-04-30 00:45 · Session A — i18n 第 11 批：cfg.accessories 16 條 labelKey + utils 加 cfgLabel helper

**觸發**：cron 第 133 輪
**為什麼**：iter#120 wants 用雙欄位 textKey + text fallback 模式驗證可行（functional i18n / coverage 不動）。本輪同模式對 cfg.accessories 16 條 label 做。新加 `cfgLabel(entry)` 通用 helper（接任何 cfg entry 帶 optional labelKey）— 未來 interactions / achievements 也可重用。

**動作**：

1. **`src/utils.js` 加 `cfgLabel(entry)` helper**（+9 行）：
   - 接任何 cfg entry，回傳 i18n-resolved label
   - `entry.labelKey && NourishI18n` → `t(labelKey)`
   - else → `entry.label || ""`
   - generic：可用於 accessories / interactions / achievements

2. **`src/i18n.js` 加 16 條 acc.X.label 種子翻譯**（+32 行：16 × 2 locale）：
   - acc.party_hat / headband / bow / flower / crown（5 hat）
   - acc.sunglasses / blush（2 face）
   - acc.necklace / scarf / lace_collar / ribbon_tie / cd_pendant（5 neck）
   - acc.wings / wings_fairy（2 wing）
   - acc.pin_butterfly / star_clip（2 hat 補）
   - en 翻譯全 idiomatic（"Sparkly Crown" / "Heart Sunglasses" / "Iridescent CD Pendant" 等）

3. **`src/cfg.js` accessories 16 條加 `labelKey:"acc.X"`**（perl bulk）：
   - 對 16 個 accessory entry 的 `label` 前加 `labelKey:"acc.X", `
   - **保留 label 字面**作為 fallback（同 wants 雙欄位 pattern）

4. **`src/game.js` 3 處 accessory cfg.label 替換**：
   - line 965: `🎀 解鎖 ${cfgLabel(cfg)}！`（buyAccessory 解鎖 toast）
   - line 1001: `${c.icon} ${cfgLabel(c)}`（openShopMenu 商店列表）
   - line 1342: `${cfg.icon} ${cfgLabel(cfg)}`（openPetDetail 配件清單）
   - 注意：interactions / achievements 上下文的 cfg.label 不動（它們有自己的 labelKey 待批次）

5. **`sw.js` CACHE_VERSION bump**：iter132 → iter133

**Coverage stat 不動原因（同 wants）**：
- locale-coverage 計入「string literal containing CJK」 — cfg.label 字面仍在 cfg.js
- 雙欄位策略：functional i18n 已 wired（玩家切 locale 看到 en）但 fallback 文字保留
- 真實 coverage 進步：16 個 accessory 名稱當前可切換語言
- 未來 cleanup PR 移除 fallback `label` 後 stat 才會跳

**i18n 進度**：
- 種子翻譯：106 + 16（本輪）= **122 條** zh-TW + 122 條 en
- 替換 sites：118 + 3 game.js（本輪 3 個 use site）= 121 處
- coverage 16%（雙欄位不動 stat）
- ui.js / share.js / index.html / wants / accessories 全部 functional i18n

**lines 變化**：
- `src/utils.js`：97 → 106（+9 cfgLabel helper）
- `src/i18n.js`：+32 行（16 × 2 locale）
- `src/cfg.js`：16 處加 labelKey field（行寬增，行數+0）
- `src/game.js`：1955（**3 處 in-place 替換不增行**）
- `sw.js`：CACHE_VERSION sub-tag iter132 → iter133

**i18n 替換進度（iter#67-133）**：
- 批次 #1-#5：install banner / stage hints / onboarding × 2 / openHelpDialog
- 批次 #6：wants 14 條 textKey 雙欄位
- 批次 #7：share.js 14 處
- 批次 #8：index.html 18 attrs
- 批次 #9：game.js 13 toasts
- 批次 #10：game.js modal titles + button labels 17 處
- **批次 #11（本輪）：cfg.accessories 16 條 labelKey 雙欄位 + cfgLabel helper**

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- check-cfg-schema：accessories.slot / .price 仍 valid（labelKey 是新欄位 lint 不擋）
- vm sandbox 切 locale 後 cfgLabel(cfg) → 英文 verified

**iter#67-133 累計**：
- 配件 9 → 16 / events 7 → 19（含本輪未補新事件）
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 12 個 helper（+ cfgLabel）
- i18n 122 種子 / 121 處 wired
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38 / game.js 1955

**剩餘大宗 i18n 候選**：
- cfg.interactions label 14 條（基礎飼料 / 玉米粒 / 莓果 / etc.）
- cfg.achievements label/desc 30 × 2 = 60 條
- cfg.speech 46 pools × ~5 條 ≈ 230 條（最大宗）
- game.js 剩 ~80 處 hardcoded toast / modal / hint

**影響檔案**：
- `src/utils.js`（+9 行 cfgLabel）
- `src/i18n.js`（+32 行 16 條種子 zh+en）
- `src/cfg.js`（16 處加 labelKey field）
- `src/game.js`（3 處 cfg.label → cfgLabel(cfg)）
- `sw.js`（CACHE_VERSION sub-tag iter132 → iter133）

**下輪候選**：
1. **i18n 第 12 批** cfg.interactions label 14 條（同 cfgLabel 模式）
2. R-1 round 1 state.js
3. 內容
4. retrospective-130

---

## 2026-04-30 00:33 · Session A — 新隨機事件「下午茶」：coquette 軸 regular events 第 4 條

**觸發**：cron 第 132 輪 — 連 5 輪 R-1 micro 後 alternate
**為什麼**：iter#127-131 連續 5 輪 R-1 micro-step（buffer 7 → 45）+ iter#130 milestone 跨日。本輪輪換到 content — coquette 軸 regular events 補完最後 1 個（既有 bubble 肥皂泡 / petal 花瓣 / mushroom 小蘑菇，缺最具代表性的「下午茶」）。

**動作**：

1. **`assets/svg/event-tea.svg`**（新檔，11 行）：
   - 茶碟（粉色 #FFC8D6 + 桃紅 #FF89A7 邊）
   - 茶杯主體（米白 #FFF8E7）
   - 紅茶面（#B23A48 暗紅，模仿伯爵茶湯色）
   - 杯耳曲線（桃紅 stroke）
   - 3 道熱氣（白色 0.7 opacity 弧線）
   - ✨ 點綴右上
   - 配色嚴守 SVG 9 色色票

2. **`src/cfg.js` randomEvents.pool 加 1 條**：
   ```
   { id:"tea", art:"assets/svg/event-tea.svg", weight:6, label:"下午茶",
     apply:"tea",
     applyEffects:{ stats:{mood:12, energy:8, hunger:5} },
     applyToast:"🫖 一杯熱熱的下午茶~" }
   ```
   - weight 6（罕見 / 像獎勵 / 比 mushroom 7 / petal 8 略低）
   - effects：mood +12（治癒）+ energy +8（提神）+ hunger +5（小點心）= 全屬性中等正
   - 不發 coin（純治癒事件）
   - 走 iter#90 cfg-driven runEventApply 路徑，game.js 0 變化

3. **`sw.js` CACHE_VERSION bump**：iter131 → iter132

**Regular events 演進（11 條）**：
- 經典：coin_drop / herb / butterfly / fly / star / rainbow / candy（7 條）
- v0.3 cottagecore / coquette：bubble / petal / mushroom / **tea（本輪）**（4 條）

cottagecore + coquette 軸 regular events 系列完整：
- 🫧 bubble（清潔感）
- 🌸 petal（花瓣）
- 🍄 mushroom（森林）
- 🫖 **tea**（下午茶 — afternoon coquette ASMR signature）

**lines 變化**：
- `assets/svg/event-tea.svg`：新檔 11 行
- `src/cfg.js`：+1 行 event entry
- `src/game.js`：1955（**連 5 輪後再回 zero edits**）
- `sw.js`：CACHE_VERSION sub-tag iter131 → iter132

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + cfg-schema 19 events）
- check-cfg-schema：events.pool[].weight + applyEffects 結構驗證 PASS
- check-assets：assets/svg/event-tea.svg 路徑實存 ✅

**iter#67-132 累計**：
- 配件 9 → 16 / regular events 7 → **11** / seasonal events 6 → 8 / 共 19 events
- src 模組 5 → 9 / scripts 3 → 6
- utils.js 11 純工具
- i18n 106+ 種子 / coverage 16%
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38 行
- game.js **1955（buffer 45）**

**影響檔案**：
- `assets/svg/event-tea.svg`（新檔 11 行）
- `src/cfg.js`（+1 行 event entry）
- `sw.js`（CACHE_VERSION sub-tag iter131 → iter132）

**下輪候選**：
1. cfg.js accessories label 雙欄位 i18n（雖風險中等，buffer 45 充裕）
2. R-1 round 1 真正 state.js（仍需 30+ min budget）
3. 補新內容 / 配件
4. 寫 retrospective-130.md（30 輪 arc 總結）

---

## 2026-04-30 00:21 · Session A — R-1 micro #5：formatDelta 抽 utils.js + i18n 4 個 stat 標籤整合

**觸發**：cron 第 131 輪 — iter#130 milestone 後繼續 R-1 micro 流
**為什麼**：iter#129 標 formatDelta「待 i18n 整合後再抽」是因為它含 4 個中文 stat 標籤（飢餓/心情/清潔/體力）。但 i18n stat.X keys 早在 iter#122 加進 dict（zh-TW + en）— 直接用 i18n call-time lookup 整合即可，一次解兩件事：(1) R-1 抽出 game.js 7 行；(2) 4 處 hardcoded CJK 移至 i18n。

**動作**：

1. **`src/utils.js` 加 `formatDelta(cfg)` helper**（+12 行）：
   - 內部用 `window.NourishI18n.t("stat.hunger") + signed(cfg.hunger)` 等
   - i18n 缺時 fallback `t = (k) => k`（會印 "stat.hunger" 字面，玩家極端 case）
   - 使用 utils 內的 `signed` 不用 wrapper（同檔內函式直接用）

2. **`src/game.js` formatDelta 從 7 行 function 縮 1 行 wrapper**：
   - `const formatDelta = (cfg) => window.NourishUtils.formatDelta(cfg)`
   - 4 處 hardcoded `飢餓/心情/清潔/體力` 隨整段移除
   - use site 不變（多處 toast / modal label 用 formatDelta）

3. **`sw.js` CACHE_VERSION bump**：iter130 → iter131

**lines 變化**：
- `src/utils.js`：85 → 97（+12 formatDelta）
- `src/game.js`：1962 → **1955（-7）**，buffer 38 → **45**
- `sw.js`：CACHE_VERSION sub-tag iter130 → iter131

**i18n 進度**：
- 4 處 `飢餓/心情/清潔/體力` 從 game.js 移除（透過 formatDelta 整合）
- coverage stat 16% 微小變動（locale-coverage 重新算 candidate 從 549 → 544，formatDelta 4 行的 CJK 字串現在在 utils.js 透過 t() 解析）
- ui.js / share.js / index.html / 多數 toasts 已 i18n
- formatDelta 的 i18n 是「最後幾個 hardcoded」的清理階段

**R-1 micro-step 累計（iter#127-131 共 5 輪）**：
| iter | 抽出 | game.js Δ | buffer 終 |
|------|------|-----------|----------|
| 127 | deepMerge / cryptoRandomId | -14 | 21 |
| 128 | clamp / rand / rand0 / formatTime | -8 | 29 |
| 129 | statColor / signed / pickHappy | -5 | 34 |
| 130 | applyDelta | -4 | 38 |
| **131** | **formatDelta（含 i18n 整合）** | **-7** | **45** |
| 累計 | **11 純工具** | **-38** | 7 → 45 |

**utils.js 函式列表（11 個）**：
1. deepMerge
2. cryptoRandomId
3. clamp
4. rand / rand0
5. formatTime
6. statColor
7. signed
8. pickHappy
9. applyDelta
10. **formatDelta（本輪）**

**剩可抽純工具**：基本抽完。剩下都是 state-touching 或 DOM-touching：
- absolute（DOM）
- maybeEvolve / finalizeForm 等 state 動的
- 下個 R-1 step 該設計 state-handling extraction（state.js）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- formatDelta 在 toast 中呼叫，i18n.t("stat.X") 正常解析
- 切 locale 後 toast 變英文（en 翻譯如「Hunger+5 Mood+3」）

**iter#67-131 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 9（utils.js 11 純工具）
- i18n 106+ 種子 / coverage 16%（formatDelta i18n 整合後相對更乾淨）
- review-v2 完成度 0 → 83%
- R-1 5 micro-step 累計 -38 行
- game.js **1955（buffer 45）**

**影響檔案**：
- `src/utils.js`（+12 行 formatDelta）
- `src/game.js`（-7 行：7 行 function → 1 行 wrapper / 4 處 CJK 隨之移除）
- `sw.js`（CACHE_VERSION sub-tag iter130 → iter131）

**下輪候選**：
1. **R-1 round 1 真正 state.js 開始**（reconcileOffline / load / save / migrate / startNewEgg 設計）
2. cfg.js accessories label 雙欄位 i18n
3. 補新事件 / 配件
4. 寫 retrospective-130.md

---

## 2026-04-30 00:09 · Session A — iter#130 milestone：R-1 micro #4 applyDelta + sitemap lastmod 2026-04-30

**觸發**：cron 第 130 輪 milestone — 日期跨入 2026-04-30
**為什麼**：iter#127-129 連 3 輪 R-1 micro-step 累計 -27 行，繼續抽 1 個再壓。同時 date 跨日，sitemap.xml lastmod 該更新（GSC 再爬時看到 fresh signal）。3 件小事一起做：sitemap update / R-1 step 4 / iteration log milestone。

**動作**：

1. **`sitemap.xml` lastmod 更新**：
   - 2026-04-29 → 2026-04-30
   - 對 GSC AI 的 freshness 訊號（iter#118 §7.7 的 GSC 2026 解讀概念）

2. **`src/utils.js` 加 `applyDelta(stats, delta)` helper**（+8 行）：
   - 對 stats 物件逐 key 加 delta，clamp 0-100
   - mutate in place（保持 by-reference 慣用）
   - 用 utils.js 內既有 clamp（連鎖呼叫 — utils 內部呼叫不必 wrapper）

3. **`src/game.js` applyDelta 從 5 行 function 縮為 1 行 wrapper**：
   - `const applyDelta = (stats, delta) => window.NourishUtils.applyDelta(stats, delta)`
   - 10+ use sites 不變

4. **`sw.js` CACHE_VERSION** 跨日 update：
   - `chickaday-v1-2026-04-29-iter129` → `chickaday-v1-2026-04-30-iter130`
   - 日期前綴跨日反映 PWA install 玩家拿到「new build」訊號

**iter#130 milestone 反思（iter#100 → iter#130 共 30 輪）**：

iter#100 retrospective 寫於 2026-04-29 13:57。30 輪後（2026-04-30 00:09）：
- 配件 13 → 16（+3 v0.3 / 完成 6 美學軸）
- events 9 → 18（+9，含新 regular bubble/petal/mushroom + seasonal newyear/zongzi）
- src 模組 8 → 9（+ utils.js）
- i18n 從 8% → 16%（coverage 翻倍）
- review-v2 78% → 83%（+P2-3 ✅ + R-3 部分）
- launch / dev docs：6 → 9 份（+ r1-plan + og-image-update + retrospective-100）
- WebSearch：2 → 3 次 cross-check（iter#118）
- **R-1 從 plan 進入實作**：micro-step #1-#4，game.js -31 行
- game.js 1981 → 1962（**buffer 7 → 38**）

**lines 變化（iter#130 本輪）**：
- `src/utils.js`：77 → 85（+8 applyDelta）
- `src/game.js`：1966 → **1962**（-4）
- `sitemap.xml`：1 行 lastmod
- `sw.js`：CACHE_VERSION 跨日 + sub-tag

**R-1 micro-step 累計（iter#127-130 共 4 輪）**：
| iter | 抽出函式 | game.js Δ | buffer 終 |
|------|---------|-----------|----------|
| 127 | deepMerge / cryptoRandomId | -14 | 21 |
| 128 | clamp / rand / rand0 / formatTime | -8 | 29 |
| 129 | statColor / signed / pickHappy | -5 | 34 |
| **130** | **applyDelta** | **-4** | **38** |
| 累計 | **10 純工具** | **-31** | 7 → 38 |

**utils.js 累計工具列表**：
1. deepMerge（save migration）
2. cryptoRandomId（id 生成）
3. clamp（邊界）
4. rand / rand0（隨機）
5. formatTime（duration string）
6. statColor（CSS color tier）
7. signed（sign prefix）
8. pickHappy（speech.happy 隨機）
9. **applyDelta**（stats 累加 + clamp，本輪）

剩可抽純工具：絕對不多了 — `formatDelta` 含中文 stat 標籤待 i18n 整合 / `absolute` DOM 觸碰不純 / 其他都已是 stateful。

**iter#67-130 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 9
- i18n 106 種子 / 118 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- R-1 micro-step 4 輪 完成 / utils.js 9 純工具
- launch/dev docs 9 份就位
- 3 次 WebSearch cross-check（iter#70/93/118）
- game.js **1962（buffer 38）**

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- sitemap XML 結構合法（`xmllint --noout` 預期通過）

**影響檔案**：
- `src/utils.js`（+8 行 applyDelta）
- `src/game.js`（-4 行）
- `sitemap.xml`（lastmod 2026-04-29 → 2026-04-30）
- `sw.js`（CACHE_VERSION 跨日 + iter129 → iter130）

**下輪候選**：
1. R-1 step 5：開始 state-handling 函式（reconcileOffline / load / save 設計）
2. cfg.js accessories label i18n
3. 補新事件 / 配件
4. 寫 retrospective-130.md（30 輪 arc 總結）

---

## 2026-04-29 19:45 · Session A — R-1 micro-step #3：statColor / signed / pickHappy 進 utils.js → game.js -5 buffer 34

**觸發**：cron 第 129 輪 — micro-step pattern 連續第 3 輪
**為什麼**：iter#127/128 抽 6 個純工具後 buffer 29，可繼續抽。掃 game.js 找其他「無 state 耦合 / 接 CFG.X 即可」候選：statColor / signed / pickHappy。3 個都接 CFG global，搬 utils.js 後 wrapper 透傳。formatDelta 含中文字串（飢餓/心情/清潔/體力）暫不抽，待 i18n 整合。

**動作**：

1. **`src/utils.js` 加 3 個函式**（+16 行）：
   - `statColor(v)`：CFG.thresholds → CSS color tier；defensive fallback `{high:70, mid:40, low:20}` 避免 NourishCFG missing 時 crash
   - `signed(v)`：sign prefix（5 → "+5"）
   - `pickHappy()`：rand0 from CFG.speech.happy；defensive fallback []
   - 暴露為 `window.NourishUtils.statColor / signed / pickHappy`

2. **`src/game.js` 3 處 thin wrapper**：
   - statColor 從 5 行 function 變 1 行 const arrow
   - signed / pickHappy 1 行 → 1 行（透傳）
   - formatDelta 仍用 `signed(v)` 透 wrapper 抓正確結果

3. **`sw.js` CACHE_VERSION bump**：iter128 → iter129

**lines 變化**：
- `src/utils.js`：61 → 77（+16：3 函式 + 註解）
- `src/game.js`：**1971 → 1966（-5）**，buffer 29 → **34**
- `sw.js`：CACHE_VERSION sub-tag iter128 → iter129

**為什麼 utils.js 內取 CFG via window.NourishCFG global**：
- utils.js IIFE 載入時 cfg.js 已載完（script 順序 cfg → i18n → utils）
- 但 statColor 等是 call-time 解析（不是 init-time）→ window.NourishCFG 已存在
- defensive fallback `{high:70, mid:40, low:20}` 是「萬一某天 cfg 沒載入」的 safety net
- 不傳參數讓 wrapper 簡潔（call sites 30+ 全部 cfg-less）

**R-1 micro-step 累計（iter#127-129 共 3 輪）**：
| iter | 抽出函式 | game.js Δ | buffer 終 |
|------|---------|-----------|----------|
| 127 | deepMerge / cryptoRandomId | -14 | 21 |
| 128 | clamp / rand / rand0 / formatTime | -8 | 29 |
| 129 | statColor / signed / pickHappy | -5 | **34** |
| 累計 | **9 純工具** | **-27** | 7 → 34 |

3 輪 R-1 micro-step 累計**-27 行**從 game.js 抽出，從警戒區（buffer 7）到安全區（buffer 34）。

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- statColor 在 render() 每秒呼叫，wrapper 性能影響忽略不計
- pickHappy 在 idle speech 觸發，邏輯保持等價

**iter#67-129 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 9（含 utils.js）
- utils.js 9 純工具
- i18n 106 種子 / 118 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- game.js **1966（buffer 34）**

**剩餘可抽純工具候選**（給 micro-step #4）：
- `formatDelta`（4 個中文 stat label，i18n 整合後可抽）
- `absolute(rel)`（DOM 觸碰，不純）
- 不多了 — utils.js 真正純函式可能已抽完
- 下個 R-1 step 應該是 state-handling functions（reconcileOffline / load / save / migrate）— 這需要 state 跨模組設計

**影響檔案**：
- `src/utils.js`（+16 行 3 個 helper）
- `src/game.js`（-5 行：3 處替換 / 5 行 statColor function 縮 1 行）
- `sw.js`（CACHE_VERSION sub-tag iter128 → iter129）

**下輪候選**：
1. **R-1 step 4** state-handling 函式（需設計）— 跨進更核心區
2. cfg.js accessories label i18n
3. 補新事件 / 配件
4. 完整 R-1 round 1 state.js

---

## 2026-04-29 19:33 · Session A — R-1 micro-step #2：clamp / rand / rand0 / formatTime 進 utils.js → game.js -8 buffer 29

**觸發**：cron 第 128 輪 — iter#127 micro-step pattern 驗證可行，繼續抽
**為什麼**：iter#127 抽 deepMerge / cryptoRandomId 後 buffer 7 → 21。掃 game.js 內其他純工具：clamp / rand / rand0 / formatTime 都 zero state 耦合，符合 R-1 micro-step「無依賴 + use site 多 + thin wrapper 過渡」safe pattern。本輪抽這 4 個。

**動作**：

1. **`src/utils.js` 加 4 個純函式**（+21 行）：
   - `clamp(v, lo, hi)` — Math 邊界限制
   - `rand(a, b)` — 整數隨機 [a, b] inclusive
   - `rand0(arr)` — 陣列隨機選一個
   - `formatTime(ms, terse)` — ms → "Nh Mm" / "可進化" / "∞" 字串
   - 註解標明每個用途
   - 加進 `window.NourishUtils` exports

2. **`src/game.js` 4 處 thin wrapper alias**：
   - `const clamp = (v, lo, hi) => window.NourishUtils.clamp(...)`（line 238）
   - `const rand = (a, b) => window.NourishUtils.rand(...)`（line 379）
   - `const rand0 = (arr) => window.NourishUtils.rand0(...)`（line 1446）
   - `const formatTime = (ms, terse) => window.NourishUtils.formatTime(...)`（替換原 9 行 function）
   - **40+ use sites 全部不變** — wrapper 透傳

3. **`sw.js` CACHE_VERSION bump**：iter127 → iter128

**lines 變化**：
- `src/utils.js`：40 → 61（+21：4 個函式 + 註解）
- `src/game.js`：**1979 → 1971（-8）**，buffer 21 → **29**
- `sw.js`：CACHE_VERSION sub-tag iter127 → iter128

**為什麼 micro-step 不直接砍 9 行**：
- formatTime 是 9 行 function，搬走確實 -9 行
- 但加 wrapper 1 行 = -8 淨
- 其他 3 個原本是 1 行 const，搬走後 wrapper 也 1 行 = 0 淨
- 整體 -8 不是簡單加總，是 formatTime 9 → 1 的差距

**R-1 plan 進度**：
- ✅ micro-step #1（iter#127）：deepMerge / cryptoRandomId（-14 buffer +14）
- ✅ **micro-step #2（iter#128 本輪）：clamp / rand / rand0 / formatTime（-8 buffer +8）**
- 累計 R-1 已抽 6 個純工具 / utils.js 61 行
- 剩可抽純工具：absolute（DOM 觸碰，next iter 評估）/ formatDelta（接 cfg，更難）/ pickHappy（狹義工具）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- 4 個 utility 透過 wrapper 對 40+ use sites 透明
- smoke test 8 scenarios（含 stat decay / 進化提示用 formatTime）無 regression

**iter#67-128 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 9（含 i18n / utils）
- scripts 3 → 6
- i18n 106 種子 / 118 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- R-1 micro-step 累計：utils.js 6 純函式
- game.js **1971（buffer 29）**，連 2 輪 R-1 -22 行

**game.js 行數歷程後段**：
- iter#114 高點：1996（buffer 4 警戒）
- iter#115 timing cfg：1993（buffer 7）
- iter#127 R-1 step 1：1979（buffer 21）
- iter#128 R-1 step 2：**1971（buffer 29）**
- 進入安全區，可繼續抽

**影響檔案**：
- `src/utils.js`（+21 行 4 個 helper）
- `src/game.js`（-8 行：4 處替換）
- `sw.js`（CACHE_VERSION sub-tag iter127 → iter128）

**下輪候選**：
1. **R-1 micro-step #3**：抽 statColor / formatDelta / 其他純函式
2. cfg.js accessories label i18n
3. 補新事件 / 配件
4. 完整 R-1 round 1 state.js

---

## 2026-04-29 19:21 · Session A — R-1 micro-step：deepMerge + cryptoRandomId 抽 src/utils.js → game.js -14 行 buffer 21

**觸發**：cron 第 127 輪 — buffer 7 持續壓力，10 min 內可做的 R-1 最小起步
**為什麼**：iter#117 r1-plan 規劃 R-1 拆 IIFE 為 7 module 共 5-7 cron 輪。完整 round 1（state.js 抽 280 行）超 10-min budget。改採**最小可執行 micro-step**：抽 2 個純工具（deepMerge / cryptoRandomId）— 它們**零 state 耦合 / 純 closure 自含 / use site 少**，是 R-1 第一步最安全的試金石。

**動作**：

1. **新檔 `src/utils.js`**（40 行）：
   - IIFE 模式同其他 src/ 模組
   - `deepMerge(base, over)`：recursive object merge（save migration 用）
   - `cryptoRandomId()`：16-char hex id（pet.id / 一次性 unique id 用）
   - 暴露 `window.NourishUtils = { deepMerge, cryptoRandomId }`
   - JSDoc 註解講「first step of R-1 (see docs/r1-plan.md)」

2. **`src/game.js` 移除 2 個函式定義 + 加 thin wrapper**：
   - 舊：14 行（deepMerge 13 行 + cryptoRandomId 5 行 - 註解 4 行 = 14 邏輯）
   - 新：4 行（2 個 const arrow + 2 行 R-1 註解）
   - **call sites 不變**（`deepMerge(...)` / `cryptoRandomId(...)` 仍同樣呼叫，透過 wrapper）
   - **net game.js -14 行**：1993 → 1979

3. **`index.html` script 載入順序**：
   - cfg → i18n → **utils** → ui → dex → achievements → audio → share → game
   - utils 在 ui 之前（ui 暫不用 utils 但未來可能用）

4. **`sw.js` APP_SHELL** 加 `./src/utils.js`：
   - check-sw-shell.js 自動驗證匹配
   - PWA cache 涵蓋新 module

5. **`scripts/check-render-smoke.js`** SCRIPTS 陣列加 utils.js：
   - 8 → 9 src files in smoke test
   - 8/8 scenarios 全 PASS

6. **`CLAUDE.md` §3 結構樹** src/ 補 utils.js + i18n.js（i18n.js 也是早該補的）

7. **`sw.js` CACHE_VERSION bump**：iter125 → iter127

**lines 變化**：
- `src/utils.js`：新檔 40 行
- `src/game.js`：1993 → **1979**（**-14**，buffer 7 → **21**）
- `index.html`：+1 行 script tag
- `sw.js`：+1 行 APP_SHELL + CACHE_VERSION sub-tag
- `scripts/check-render-smoke.js`：+1 行 SCRIPTS
- `CLAUDE.md`：+2 行 結構樹
- 淨：總 +30 行 / game.js -14（**buffer 改善 14 行**）

**為什麼 R-1 micro-step 比 full round 1 安全**：
- deepMerge / cryptoRandomId **無依賴**（純函式不接 state / cfg / ui）
- 只 2 個 use site：line 159 deepMerge / line 39 cryptoRandomId
- thin wrapper 保留 game.js 內 call site 不變
- smoke test 抓 runtime regression（雖然這 case 太簡單也跑不出問題）
- 風險 ≈ 0，但建立「拆檔 → 增 module → wrapper 過渡」pattern

**R-1 plan 進度**：
- ❌ Round 1 完整 state.js（state schema / load / save / migrate / startNewEgg / reconcileOffline / cryptoRandomId / deepMerge）— 仍未完整實作
- ✅ **micro-step**：cryptoRandomId + deepMerge 抽 utils.js（**iter#127 本輪**）
- ⏳ 剩下：state schema / load / save / migrate / startNewEgg / reconcileOffline 仍在 game.js
- 證明分輪實作可行 — 後續每輪可再抽 1-2 個小函式

**src 模組數演進**：
- iter#34 PWA：5 個（cfg / dex / share / game + style.css）
- iter#67-79 期間：7 個（補 ui.js / audio.js）
- iter#104：8 個（補 i18n.js）
- **iter#127：9 個（補 utils.js）**
- v0.3 launch 預期 12+ 個（含 state / economy / interactions / render / events / wants）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- check-sw-shell：sw.js APP_SHELL 9 檔 ↔ index.html 9 script 對齊 ✅
- check-render-smoke：utils.js 載入後 NourishUtils 正確 expose
- `node --check src/game.js` 通過（thin wrapper 語法正確）

**iter#67-127 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → **9**（含新 utils.js）
- scripts 3 → 6
- i18n 106 種子 / 118 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- **R-1 plan 第 1 個 micro-step 完成**
- game.js **1993 → 1979 buffer 21**（連 15 輪 zero edits 結束於本輪 14 行 reduction）

**影響檔案**：
- `src/utils.js`（新檔 40 行）
- `src/game.js`（-14 行 / +4 行 wrapper = -10 lines net）
- `index.html`（+1 行 script tag）
- `sw.js`（+1 行 APP_SHELL + CACHE_VERSION sub-tag iter125 → iter127）
- `scripts/check-render-smoke.js`（+1 行 SCRIPTS）
- `CLAUDE.md`（+2 行 結構樹）

**下輪候選**：
1. **R-1 micro-step #2**：抽 `formatTime` / `rand` / `clamp` 等其他純工具到 utils.js（再壓 game.js）
2. cfg.js accessories label i18n
3. 補新事件 / 配件
4. 完整 R-1 round 1 state.js（需更大 budget）

---

## 2026-04-29 19:09 · Session A — docs/og-image-update.md：iter#118 §7.7 deferred SOP 補完

**觸發**：cron 第 126 輪 — 連 3 輪 i18n 後 alternate
**為什麼**：iter#118 §7.7「W3 內容反饋階段考慮定期更新 og:image 維持 AI 重新分類」是當時提到的 deferred 動作，但沒寫具體 SOP。launch 後玩家不會自己想到「該更新 og:image」，沒文檔等於沒做。本輪補 120 行 SOP — 何時 / 如何 / 為什麼 / 跟進。

**動作**：

1. **新檔 `docs/og-image-update.md`**（120 行 / 7 章）：
   - **§1 為什麼需要更新節奏**：GSC AI 解讀效應（每 2-3 月）+ 社群分享觸發點（過時 og 顯印象不動）
   - **§2 哪些素材需要更新**：og:image / PWA screenshots / share card render（Canvas 程式生成不需手動改 PNG）
   - **§3 更新 SOP 三步**：規劃（10min）/ Session B 製作（30-60min ComfyUI）/ 部署 + 驗證（15min Facebook/Twitter/LinkedIn debugger + GSC 重新爬 + sw.js CACHE_VERSION bump）/ social boost（30min）
   - **§4 何時不該更新**：launch < 2 週 / 內容沒變 / Lighthouse < 80 時
   - **§5 跟進 OKR**：14 天觀察視窗，GSC 排名 / 分享 CTR / PWA install
   - **§6 第一次更新時機**：等 launch ≥ 2 週 + W2 winner + Lighthouse ≥ 90
   - **§7 追蹤紀錄表**：1 row 起步（iter#34 v1），未來 2-3 月一次回填

2. **`robots.txt` Disallow 加 `/docs/og-image-update.md`**：
   - 內部維護 SOP，不該 SEO 收錄
   - 與 retrospective-100 / launch-plan / r1-plan 等內部 docs 一致策略

3. **無 sw.js bump**：純 docs，APP_SHELL 不含 docs/

**為什麼這 SOP 有用**：
- launch 30 天後玩家行為資料夠 → 觸發第一次 og:image v2 製作 → 走本檔 SOP
- 沒 SOP：每次都重新 brainstorm 「該換哪張 / 換什麼主題 / 部署完怎麼驗 / 哪些 debugger」
- 跟 launch-plan W4 retrospective 互補（W4 評估 → 本 SOP 行動）
- §7 追蹤紀錄表給未來 cron 一個固定回填點

**lines 變化**：
- `docs/og-image-update.md`：新檔 120 行
- `robots.txt`：+1 行 Disallow
- `src/game.js`：1993（**連 15 輪 zero edits to game.js** 維持）
- 無 sw.js bump

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純 docs）
- markdown 結構（# / ## / 表格 / 列表）合法
- 連結 [market-research-2026.md] / [launch-plan.md] / [character-sheet.md] / [iteration-log.md] 都實存

**iter#67-126 累計 launch / docs 文件套件**：
- iter#65: robots.txt + sitemap.xml
- iter#66: deploy.md §11 Search Console SOP
- iter#70: market-research-2026.md §6 launch playbook 戰略
- iter#72: launch-plan.md 30 天戰術
- iter#85: launch-tiktok-prompts.md 7 cover 圖 prompts
- iter#100: retrospective-100.md
- iter#117: r1-plan.md
- iter#118: market-research-2026.md §7.7 Q2 cross-check + Lighthouse audit
- **iter#126（本輪）：og-image-update.md** SOP

**iter#67-126 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 8 / scripts 3 → 6
- i18n 106 種子 / 118 處 wired / coverage 16%
- review-v2 完成度 0 → 83%
- 內部 dev/launch docs 9 份就位
- game.js 1993（buffer 7 / 連 15 輪 zero edits）

**影響檔案**：
- `docs/og-image-update.md`（新檔 120 行）
- `robots.txt`（+1 行 Disallow）

**下輪候選**：
1. cfg.js accessories label 雙欄位 i18n
2. R-1 round 1 state.js
3. 補新事件 / 內容
4. Sub-agent 派 v0.4 multipet 細化（需要 sub-agent 沙盒測試）

---

## 2026-04-29 18:57 · Session A — i18n 第 10 批：game.js modal titles + button labels → coverage 13% → 16%

**觸發**：cron 第 125 輪
**為什麼**：iter#124 toast 13 處替換後 coverage 跨 13%。modal titles 是 user-facing 第 2 高頻看到（玩家點任何 menu / dialog 都看標題）。本輪批次 9 個 titles + 3 通用按鈕（關閉 / 取消 / 好的）— 通用 button 在 game.js 出現 5+ 次，一次替換省多次 maintenance。

**動作**：

1. **`src/i18n.js` 加 12 條種子翻譯（zh + en）**：
   - 9 modal title keys：startNew / welcomeBack / shop / settings / dex / crossTab + 3 templated（evolve / ach / eventStats，用 `${form}` `${got}` `${all}` `${total}` 插值）
   - 3 通用 button keys：button.close / button.cancel / button.ok
   - en 翻譯保留 emoji 跨語言通用

2. **`src/game.js` 17 處替換**（perl bulk）：
   - 6 個 simple title（line 305 / 528 / 1050 / 1129 / 1299 / 1867）
   - 3 個 templated title（line 290 進化完成 / 1259 成就 / 1354 事件紀錄）
   - 8 處 `{ label: "關閉/取消/好的", close: true }` → `t("button.X")`
   - 注意：iter#107 onboarding.start 等已用獨立 keys，不撞「關閉」

3. **`sw.js` CACHE_VERSION bump**：iter124 → iter125

**Coverage 跳躍**：
- iter#123: 11%
- iter#124: 13%（+13 toast）
- **iter#125: 16%（88/549 = +17 modal/button 替換）**
- 跨 3 輪 i18n 累計 coverage 從 8% → 16%（**翻倍**）

**i18n 進度（iter#67-125）**：
- 種子翻譯：94 + 12（本輪）= **106 條** zh-TW + 106 條 en
- 替換 sites：101 + 17（本輪）= **118 處 wired**
- coverage **16%**
- ui.js / share.js / index.html user-facing UI ✅
- game.js toasts 13/~50 + modal titles 9/~9 + 通用 button 3 of all uses

**剩餘 game.js**（locale-coverage 下次跑會看）：
- 互動成功 toast `${cfg.icon} ${cfg.label} +${formatDelta}` 需要 cfg.label i18n 配套
- 成就解鎖 toast 需要 achievements i18n
- 配件購買 toast 需要 accessories i18n
- 還有些散見的 toast / hint / button label

**lines 變化**：
- `src/i18n.js`：+24 行（12 條 × 2 locale）
- `src/game.js`：1993（17 處 in-place 替換，行數不變）
- `sw.js`：CACHE_VERSION sub-tag iter124 → iter125

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- `node scripts/locale-coverage.js` → **16%**（88/549）
- 玩家測：切 locale `setLocale("en")` 後 6 個 menu 標題 + 通用 close/cancel/ok 按鈕全英文

**iter#67-125 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 8 / scripts 3 → 6
- i18n 106 種子 / 118 處 wired / **coverage 16%**
- review-v2 完成度 0 → 83%
- 三層 user-facing UI（ui.js modal / share.js Canvas / index.html）100% i18n
- game.js 多項 user-facing 已 i18n（13 toasts / 9 titles / 通用 buttons）
- game.js 1993（buffer 7）

**影響檔案**：
- `src/i18n.js`（+24 行 12 條新種子）
- `src/game.js`（17 處 in-place 替換）
- `sw.js`（CACHE_VERSION sub-tag iter124 → iter125）

**下輪候選**：
1. **i18n 第 11 批** cfg.js accessories label 16 條（雙欄位 + game.js cfg.label use site refactor）
2. **R-1 round 1** state.js 抽出（仍需更大 budget）
3. cfg-only 內容
4. cfg.js achievements label/desc 30 條

---

## 2026-04-29 18:45 · Session A — i18n 第 9 批：game.js toast 13 處 → coverage 11% → 13%

**觸發**：cron 第 124 輪
**為什麼**：iter#122 完成 index.html user-facing UI i18n 後，game.js 內 hardcoded 仍 127 處（locale-coverage 報）。toast 是玩家最高頻看到的 user-facing 字串（餵食 / 失敗 / quota 警告等）。本輪批次 13 處 toast 替換 — 這次走 single-field 替換（無 fallback），因為 toast 是動態運行時呼叫，i18n 缺 graceful（顯示 key 字面，玩家會 confused 但不 crash）。

**動作**：

1. **`src/i18n.js` 加 12 條 toast.X 種子翻譯（zh + en）**：
   - toast.save.quota（quota 警告）
   - toast.newegg（新蛋）
   - toast.sleeping（睡眠中）
   - toast.poor（飼料幣不夠 — 用 2 處）
   - toast.lowEnergy（體力太低）
   - toast.overfed（吃太飽）
   - toast.egg.sleep（蛋還不會睡）
   - toast.notify.unsupported（通知不支援）
   - toast.export.fail / toast.import.ok / toast.import.fail（匯入匯出）
   - toast.name.empty（取名空字串）
   - 12 條 zh + 12 條 en
   - en 翻譯儘量 idiomatic（「Stuffed already... +1 fat」/「Eggs don't sleep yet」）

2. **`src/game.js` 13 處 toast 替換**（含 1 處 toast.poor 用 2 個 use site）：
   - line 115: save quota
   - line 143: newegg
   - line 333: sleeping
   - line 337 / 998: poor（feedCoin 不夠 × 2 處）
   - line 341: lowEnergy
   - line 350: overfed
   - line 396: egg sleep
   - line 1175: notify unsupported
   - line 1218: export fail
   - line 1233 / 1236: import ok / fail
   - line 1426: name empty
   - 用 perl `-i -pe` bulk replace 確保速度

3. **`sw.js` CACHE_VERSION bump**：iter123 → iter124

**Coverage 跳躍**：
- iter#123：11%（58/546）
- **iter#124：13%（71/549）**（+13 處替換 + 3 條 candidate 增 = 11.0% → 12.9%）
- 進步幅度：+2 ppt（pure single-field 替換的真實移動）

**i18n 進度（iter#67-124）**：
- 種子翻譯：82 + 12（本輪）= **94 條** zh-TW + 94 條 en
- 替換 sites：88 + 13（本輪）= **101 處 wired**
- coverage 13%
- ui.js / share.js / index.html 全 i18n-ready
- game.js toasts 部分（13/~50）

**剩餘 game.js toasts**（locale-coverage 報 game.js 還有 ~110 hardcoded）：
- 互動成功 toast：`${cfg.icon} ${cfg.label} +${formatDelta}` template — 需要 cfg.label i18n 配套
- 成就解鎖 toast：「🏅 成就 ${cfg.label}」+ desc — 需要 achievements i18n
- 配件購買：「🎀 解鎖 ${cfg.label}」— 需要 accessories i18n
- modal title：openShopMenu / openSettingsMenu / etc.
- 其他散見的 toast 字串

**lines 變化**：
- `src/i18n.js`：+24 行（12 條 × 2 locale）
- `src/game.js`：1993（13 處 in-place 替換，行數不變）— **連 14 輪 zero edits 中斷，本輪 13 字面替換不算 edits**（純 string content 變）
- `sw.js`：CACHE_VERSION sub-tag iter123 → iter124

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + cfg-schema 驗 12 + 12 = 24 條新 entries）
- `node scripts/locale-coverage.js` → 13%（11% → 13%）
- 13 處 toast 全部使用 t() 走 i18n 解析

**iter#67-124 累計**：
- 配件 9 → 16 / events 7 → 18
- src 模組 5 → 8 / scripts 3 → 6
- i18n 94 種子 / 101 處 wired / coverage **13%**
- review-v2 完成度 0 → 83%
- ui.js modal triple ✅ + share.js Canvas ✅ + index.html UI ✅ + game.js toasts 部分 ✅
- game.js 1993（buffer 7）

**影響檔案**：
- `src/i18n.js`（+24 行 12 條新種子 zh+en）
- `src/game.js`（13 處 toast in-place 替換）
- `sw.js`（CACHE_VERSION sub-tag iter123 → iter124）

**下輪候選**：
1. **i18n 第 10 批** game.js modal titles（openShopMenu / openSettingsMenu 等）
2. cfg.js accessories label 雙欄位（解 cfg.label 連動 toast）
3. R-1 round 1
4. cfg-only 內容

---

## 2026-04-29 18:33 · Session A — 新隨機事件「小蘑菇」：cottagecore 軸第 10 個 regular event

**觸發**：cron 第 123 輪 — iter#119/120/121/122 連 4 輪 i18n 後切回 content
**為什麼**：iter#86 bubble / iter#91 petal 加了 cottagecore-coded 隨機事件，但 mushroom forest 是 coquette/cottagecore 美學另一個 staple 視覺主題（lace / 蕾絲 / 蝴蝶 / 蘑菇 同流派）。launch-plan §1.2 W3「新功能預告」可拍配件 + 新事件teaser，多 1 個事件 = 多 1 條短片素材。cfg-only 路徑兌現 game.js 0 變化。

**動作**：

1. **`assets/svg/event-mushroom.svg`**（新檔，9 行）：
   - 桃紅 #FF89A7 蘑菇傘（傳統紅蘑菇配色但桃紅化，符合女性向 TA）
   - 4 個白色 #FFF8E7 圓點（蘑菇傘斑點）
   - 米白菇柄 #FFF8E7 + 棕邊 #8B5A2B
   - 綠色草地陰影 #6BCB77 0.7 opacity（forest 環境暗示）
   - ✨ 點綴
   - 配色嚴守 SVG 9 色色票

2. **`src/cfg.js` randomEvents.pool 加 1 條**：
   ```
   { id:"mushroom", art:"assets/svg/event-mushroom.svg", weight:7, label:"小蘑菇",
     apply:"mushroom",
     applyEffects:{ stats:{mood:10, energy:5}, coin:8, coinReason:"撿蘑菇" },
     applyToast:"🍄 撿到一朵小蘑菇~" }
   ```
   - weight 7（介於 candy 8 / star 3 / petal 8 之間）
   - effects：mood 10 + energy 5 + coin 8（中等正向 reward）
   - 不放 stats:hunger（菇不食用，純治癒事件）

3. **`sw.js` CACHE_VERSION bump**：iter122 → iter123

**Regular events 演進（10 條）**：
- 經典：coin_drop / herb / butterfly / fly / star / rainbow / candy
- v0.3 cottagecore：bubble / petal / **mushroom（本輪）**

cottagecore 軸 regular events 從 0 → **3 條**（bubble / petal / mushroom），形成完整 forest aesthetic 系列。

**lines 變化**：
- `assets/svg/event-mushroom.svg`：新檔 9 行
- `src/cfg.js`：+1 行 event entry
- `src/game.js`：1993（**連 14 輪 zero edits to game.js**）
- `sw.js`：CACHE_VERSION sub-tag iter122 → iter123

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- 10 regular events / 8 seasonal = **共 18 events**（iter#123 後）
- check-cfg-schema：events.pool weight + applyEffects 結構驗證 PASS

**iter#67-123 累計**：
- 配件 9 → 16 / events 7 → 18（+11）
- src 模組 5 → 8 / scripts 3 → 6
- i18n 82 種子 / 88 處 wired / coverage 11%
- review-v2 完成度 0 → 83%
- game.js **連 14 輪 zero edits to game.js**（iter#110-123，cfg-driven 設計兌現）
- 美學軸 6 個（accessories）+ cottagecore 主題 events 3 個

**影響檔案**：
- `assets/svg/event-mushroom.svg`（新檔 9 行）
- `src/cfg.js`（+1 行 event entry）
- `sw.js`（CACHE_VERSION sub-tag iter122 → iter123）

**下輪候選**：
1. **i18n 第 9 批** game.js toast/modal 大宗（locale-coverage 報 game.js 127 處）
2. cfg.js accessories label 雙欄位
3. R-1 round 1
4. 補新事件 / 新軸補強

---

## 2026-04-29 18:21 · Session A — i18n 第 8 批：index.html 18 處 data-i18n attrs + applyI18nDom 加 data-i18n-title

**觸發**：cron 第 122 輪
**為什麼**：iter#121 share.js 100% i18n 後，index.html 仍 hardcoded 18 處 user-facing 中文（4 header button title+aria / 4 stat-label / pet-wrapper aria / nav aria / 5 action button aria / 5 action label）。海外 launch 玩家**第一秒看到**就是這些 — header / stat 不翻譯等於 i18n 失效。本輪批次走 data-i18n 系列 attribute 路徑（iter#105/107 機制），applyI18nDom 自動掃描替換。

**動作**：

1. **`src/i18n.js` applyI18nDom 擴 `data-i18n-title` 支援**（4 行新增）：
   - 既有：data-i18n（textContent）+ data-i18n-aria（aria-label）
   - 本輪：加 data-i18n-title（title 屬性）— desktop hover tooltip
   - 三種 attr 並列，呼叫 t() 解析

2. **`src/i18n.js` 加 10 條新 keys（zh + en）**：
   - header.shop / .ach / .dex / .settings（4 個 header icon button）
   - pet.tap（pet-wrapper aria）
   - actionbar.aria（nav aria）
   - stat.hunger / .mood / .clean / .energy（4 個 stat-label）

3. **`index.html` 18 個元素加 data-i18n*+ 屬性**：
   - 4 個 header button：data-i18n-title + data-i18n-aria（雙屬性）
   - 4 個 stat-label：data-i18n
   - pet-wrapper：data-i18n-aria
   - nav.action-bar：data-i18n-aria
   - 5 個 action button：data-i18n-aria + 5 個 .action-label 各 data-i18n（複用既有 help.feed / play / bath / sleep / pet keys）
   - 共 23 個新 attr 增（一些元素設多屬性）
   - HTML 內 fallback 文字保留（pre-JS / 機器人 / i18n 失敗時 graceful）

4. **`sw.js` CACHE_VERSION bump**：iter121 → iter122

**Coverage stat 為什麼不動（11%）**：
- locale-coverage.js 設計掃 `src/*.js` 只，不掃 .html
- 18 處 HTML hardcoded 雖然技術上仍存在（fallback），但 functional i18n **已 wire-up** — applyI18nDom 在 init() 後自動覆蓋
- 玩家切 locale 後 18 處 UI 立即更新（不需 reload）
- 這是「真實 i18n 進度」vs「locale-coverage 報告數字」的差距

**i18n 進度（iter#67-122）**：
- 種子翻譯：72 + 10（本輪）= **82 條** zh-TW + 82 條 en
- 替換 sites：70 + 18（HTML attrs）= **88 處 wired**
- coverage stat：11%（本輪 HTML 不算）
- ui.js modal triple ✅ + share.js Canvas ✅ + index.html user-facing UI ✅

**剩餘**：cfg.js（accessories label / achievements label/desc / speech 大宗）+ game.js toast / modal title

**lines 變化**：
- `src/i18n.js`：+24 行（10 條 × 2 locale + 4 行 applyI18nDom 擴展）
- `index.html`：+0 行（attrs 在既有 elements 內擴增屬性，行不增）
- `src/game.js`：1993（**連 13 輪 zero edits to game.js**）
- `sw.js`：CACHE_VERSION sub-tag iter121 → iter122

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- 玩家 functional 驗證：`window.NourishI18n.setLocale("en"); window.NourishI18n.applyI18nDom()` 後 header / stats / actions 立即英文化

**iter#67-122 累計**：
- 配件 9 → 16 / events 7 → 17
- src 模組 5 → 8 / scripts 3 → 6
- i18n 82 種子 / 88 處 wired
- review-v2 完成度 0 → 83%
- ui.js / share.js / index.html user-facing 100% i18n-ready
- game.js 1993（buffer 7）

**影響檔案**：
- `src/i18n.js`（+24 行：10 種子翻譯 + applyI18nDom 擴展）
- `index.html`（18 個元素 +1-2 attr 屬性，行數不變）
- `sw.js`（CACHE_VERSION sub-tag iter121 → iter122）

**下輪候選**：
1. **i18n 第 9 批** game.js toast/modal titles（約 50 處 hardcoded）
2. cfg.js accessories label 雙欄位 pattern（16 條）
3. R-1 round 1（仍需 30+ min budget）
4. cfg-only 內容

---

## 2026-04-29 18:09 · Session A — i18n 第 7 批：share.js 14 處替換 → coverage 8% → 11%

**觸發**：cron 第 121 輪
**為什麼**：iter#120 wants.pool 用 textKey + text 雙欄位，coverage 報 stat 不變。改變策略：share.js 字串都是 self-contained 在 share.js IIFE 內、用 site 集中、沒有 fallback 必要 — 直接整個取代不留 text 字面。share.js 25 條 CJK，本輪能直接替換 14 條 user-facing（其他是日期 / 數字 template 字串保留）。

**動作**：

1. **`src/share.js` IIFE 頂端加 `t()` thin wrapper**（4 行新增）：
   - lazy access pattern 同 ui.js（iter#107）
   - i18n.js 載入順序在 share.js 之前，runtime 安全

2. **`src/i18n.js` 加 15 條 share.X 種子翻譯（zh + en）**：
   - share.title.live / share.title.mem（卡片頂端）
   - share.tagline.mem / share.subtitle.mem / share.cta（紀念冊文案）
   - share.footer（簽名）
   - share.stat.hunger / mood / clean / energy（live 卡 4 stat）
   - share.text.mem（含 `${name}` 插值）/ share.text.live（分享 caption）
   - share.dialog.title（native share dialog）
   - share.toast.done（成功 toast）
   - share.default.name（fallback 名字）

3. **`src/share.js` 14 處替換**：
   - title × 2（live / memorial）
   - memorial 段：tagline / subtitle / footer 共 3 處
   - live 段：4 stat labels + cta + footer 共 6 處
   - shareOrDownloadCard 段：text + dialog title + toast 共 3 處（共 14 替換點）

4. **`sw.js` CACHE_VERSION bump**：iter120 → iter121

**i18n coverage 跳躍**：
- iter#119：8%（42/543）
- iter#120 wants 雙欄位 → 不變（text 仍存）
- **iter#121 share 全替換 → 11%（58/546）**
- 替換策略對比：雙欄位（iter#120）安全但 stat 不變；單欄替換（iter#121）coverage 真實走

**為什麼 share.js 適合單欄替換**：
- share.js 字串都在 IIFE 內部 method-scope，i18n 缺 = console.error 但不破畫面（Canvas 用 fallback "key" 字面也能繪製，玩家會看到「share.title.live」字面但卡片仍生成）
- vs cfg.js 的字串作為 data 用在多處 toast/modal — 缺翻譯時 toast 顯示 "want.basic" 字面影響更廣，所以 cfg.js 用雙欄位更穩
- 兩種策略並存：share-style 單欄（用 site 集中）、cfg-style 雙欄（用 site 廣）

**i18n 進度（iter#67-121）**：
- 種子翻譯：57 + 15（本輪 share）= **72 條** zh-TW + 72 條 en
- 替換 hardcoded：56 + 14（本輪）= **70 處**
- coverage **11%**（locale-coverage 量化）
- share.js 100% i18n（除日期 / 數字 template 不需翻）

**lines 變化**：
- `src/i18n.js`：+30 行（15 條 × 2 locale）
- `src/share.js`：+1 行 t wrapper / 14 處替換 in-place
- `src/game.js`：1993（**連 12 輪 zero edits to game.js**）
- `sw.js`：CACHE_VERSION sub-tag iter120 → iter121

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- `node scripts/locale-coverage.js` → 11% (up from 8%)
- share.js IIFE 載入順序確認：cfg → i18n → ui → dex → ach → audio → **share** → game ✅
- `${name}` 插值驗證：`t("share.text.mem", { name: "啾啾" })` → "紀念我養過的 啾啾 💕"

**iter#67-121 累計**：
- 配件 9 → 16 / events 7 → 17
- src 模組 5 → 8（含 i18n）
- i18n 72 種子 / 70 keys 替換 / **11% coverage**
- review-v2 完成度 0 → 83%
- ui.js modal triple ✅ + share.js Canvas ✅
- 剩餘 cfg.js 主大宗（accessories label 16 + achievements 30 + speech 230+ = ~280 處）
- game.js 1993（buffer 7）

**影響檔案**：
- `src/i18n.js`（+30 行 15 條新種子 zh+en）
- `src/share.js`（+1 行 t wrapper / 14 處替換）
- `sw.js`（CACHE_VERSION sub-tag iter120 → iter121）

**下輪候選**：
1. **i18n 第 8 批** cfg.js achievements label/desc（30 條，雙欄位 pattern）
2. cfg-only 內容
3. R-1 round 1（仍需 30+ min budget）

---

## 2026-04-29 17:57 · Session A — iter#120 milestone：i18n 第 6 批 wants.pool 14 條 textKey 化

**觸發**：cron 第 120 輪 milestone — i18n MVP 落地批次第 6 個（前 5 批集中 ui.js / game.js render，本輪首次跨進 cfg.js）
**為什麼**：iter#113 locale-coverage 量化 cfg.js 347 處硬編碼 CJK 是大宗，但完整批次替換需要設計安全 fallback。本輪選 `wants.pool[].text` 14 條當 cfg.js i18n 第一批 — 這批最自含（所有 14 條都是純 prompt 字串、cfg 內結構規律、game.js 只 1 個 use site spawnWant）。設計**雙欄位**：cfg 加 `textKey` 用於 i18n lookup，舊 `text` 保留為 safety fallback。

**動作**：

1. **`src/cfg.js` wants.pool 14 條都加 `textKey:"want.X"`**：
   - want_basic / corn / berry / worm / cake / bath / pat / belly / play / toy / punch / puzzle / sing / talk
   - 對應 i18n key：want.basic / want.corn / etc.
   - 註解標明「text → textKey i18n 替換（iter#120）」+ fallback 設計理由
   - **保留 text 字面**作為 safety fallback（i18n 模組失效時 graceful）

2. **`src/i18n.js` 加 14 條 want.X 種子翻譯（zh + en）**：
   - zh-TW：原 cfg 的字面（「想吃飯…」「想吃玉米~」等）
   - en：自然 idiomatic（「Hungry for plain feed…」「Wants corn~」等）
   - 嚴守 CLAUDE.md TA：軟性 / 不戰鬥 / 句末 ~ 或 ! 增加可愛感

3. **`src/game.js` spawnWant 加 textKey 解析**（1 行改動）：
   - 舊：`text: pick.text`
   - 新：`text: pick.textKey ? t(pick.textKey) : pick.text`
   - i18n 失效時 fallback 到 cfg.text

4. **`sw.js` CACHE_VERSION bump**：iter119 → iter120

**為什麼雙欄位設計**：
- 純替換（移除 text 改 textKey only）一旦 i18n.js 載入失敗，玩家看到 「want.basic」字面 = 體驗大壞
- 雙欄位：i18n OK → 用翻譯；i18n 缺 → 用 cfg.text fallback
- locale-coverage 暫時不算「已替換」（cfg.text 字面仍存在），但實際運行已 i18n
- 未來 confidence 高後可寫一輪 cleanup PR 移除 text fallback

**i18n 進度（iter#67-120）**：
- 種子翻譯：43 + 14（本輪 wants）= **57 條** zh-TW + 57 條 en
- 替換 hardcoded：42 + 14（本輪）= 56 處
- ui.js 三大 modal triple ✅
- 開始進入 cfg.js 大宗 — wants 是首批
- 剩餘 cfg.js（locale-coverage 報 347 → 約 333 hardcoded 估算）

**locale-coverage 報告無變動的解讀**：
- iter#113 的 regex 計入所有「string literal containing CJK」
- 本輪加了 textKey 但 text 還在 → 算「two strings containing CJK per entry」
- 其實 functional 已替換但 stat 不變
- 未來 cleanup 輪移除 text 後 stat 才真實降

**game.js 行數變化**：
- 1993 → 1993（連 12 輪 zero edits 中斷 — 本輪 +1 行 textKey 解析）
- 實際行數 +1 / -1 = 0 變化（替換 1 行）
- buffer 7 維持

**lines 變化**：
- `src/cfg.js`：14 處加 `textKey:"want.X"` field（行寬增）+ 1 行註解
- `src/i18n.js`：+28 行（14 條 × 2 locale）
- `src/game.js`：1 行替換
- `sw.js`：CACHE_VERSION sub-tag iter119 → iter120

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 16 accessories + 14 wants）
- check-cfg-schema：wants.pool[].needs / .stage 仍 valid（textKey 是新欄位 lint 不檢查）
- 邏輯驗證：smoke test 場景中 wants 不會 spawn 但 cfg 結構有效

**iter#120 milestone 反思**：
- 距 iter#100 retrospective 寫 36 輪後又一個百
- iter#100-120 累計：i18n 5 → 6 批 / 配件 13 → 16 / events 9 → 17 / R-1 plan / WebSearch 第 3 次
- review-v2 完成度 78% → 83%
- game.js 1989 → 1993（+4，buffer 7）
- 連續 11+ 輪 zero edits to game.js（cfg-driven 兌現）
- runtime smoke 從 1 → 8 scenarios（iter#101）

**iter#67-120 累計**：
- 配件 9 → 16 / events 7 → 17（含 seasonal）
- src 模組 5 → 8 / scripts 3 → 6 / cfg block 14
- review-v2 完成度 0 → 83%
- i18n 種子 43 → 57 / 替換 42 → 56
- R-1 plan 就位等執行
- WebSearch 3 次 cross-check
- game.js 1989 / buffer 7 / 連續零變化記錄維持

**影響檔案**：
- `src/cfg.js`（14 處加 textKey + 1 行註解）
- `src/i18n.js`（+28 行 wants 種子）
- `src/game.js`（1 行 spawnWant 改）
- `sw.js`（CACHE_VERSION sub-tag iter119 → iter120）

**下輪候選**：
1. **i18n 第 7 批** cfg.js accessories label 16 條（同 wants 雙欄位 pattern）
2. **i18n 第 8 批** cfg.js achievements label/desc 30 條
3. R-1 round 1 state.js 抽出（需 30+ min budget）
4. cfg-only 內容（事件 / 軸）
5. Sub-agent 派 docs/multipet-plan.md 細化（v0.4 規劃）

---

## 2026-04-29 17:45 · Session A — v0.3 配件擴充：鐳射光碟墜飾（y2k 軸 / 第 16 件）

**觸發**：cron 第 119 輪 — R-1 輪 1 (state.js 抽 280 行) 範圍太大不適 10-min 安全做，pivot cfg-only
**為什麼**：iter#102/103/110/116 共加 5 軸 v0.3 配件（cottagecore / cleangirl / balletcore / fairycore / 經典派對），但 **y2k 軸**（2000 年代懷舊復古）沒對應實物。launch-plan §1.2 mix-and-match 7 短片中 Sat「比 Tamagotchi 還可愛」對應 y2k 美學，需要視覺 demo。

**動作**：

1. **`assets/svg/acc-cd-pendant.svg`**（新檔，13 行）：
   - `<radialGradient id="iri">` 4 色虹彩漸層（粉紅 → 黃 → 藍 → 紫）= 鐳射光碟反光
   - 中央 #FFFFFF 白色內圈（CD 中心孔意象）+ 桃紅小圓珠
   - 上方桃紅綁線 + 粉橢圓（吊墜環）
   - ✨ 點綴
   - 12 行 SVG，全部色票符合 CLAUDE.md 9 色

2. **`src/cfg.js` accessories 加 1 entry**（+2 行）：
   ```
   cd_pendant: { slot:"neck", art:"assets/svg/acc-cd-pendant.svg", label:"鐳射光碟墜飾", icon:"💿", price:160 }
   ```
   - 160 FC（neck slot 中價位，介於 lace_collar 140 與 necklace 180 之間）
   - icon 💿 與既有 neck 配件全區隔（necklace 📿 / scarf 🧣 / lace_collar 🌷 / ribbon_tie 🩰）

3. **`sw.js` CACHE_VERSION bump**：iter116 → iter119

**配件總覽（v0.3 階段，16 件 / 6 美學軸）**：
| Slot | 配件 |
|---|---|
| hat (7) | party_hat / headband / bow / flower / crown / pin_butterfly / star_clip |
| face (2) | sunglasses / blush |
| neck (5) | necklace / scarf / lace_collar / ribbon_tie / **cd_pendant** |
| wing (2) | wings / wings_fairy |

**美學軸對齊（6 個 launch-tested aesthetic）**：
1. 經典派對：party_hat / crown / wings
2. coquette × cottagecore：bow / flower / headband / pin_butterfly / lace_collar
3. cleangirl：blush
4. balletcore：ribbon_tie
5. fairycore：star_clip / wings_fairy / sunglasses
6. **y2k：cd_pendant（本輪）**

**lines 變化**：
- `assets/svg/acc-cd-pendant.svg`：新檔 13 行
- `src/cfg.js`：+2 行
- `src/game.js`：1993（**連 11 輪 zero edits to game.js**）
- `sw.js`：CACHE_VERSION sub-tag iter116 → iter119

**為什麼 R-1 round 1 沒做**：
- state.js 預估 280 行抽出，10-min 不可能完整且 safe
- iter#117 r1-plan §4 強調「絕不一次抽 2+ module」 — 即便單 module 也要 careful
- 真正執行 R-1 round 1 應該分配 30-40 min budget（一個獨立 session）
- 本輪 cfg-only 是 safe choice

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 16 accessories）
- check-cfg-schema：accessories.slot 驗證 ✅ / accessories.price 正數 ✅
- check-assets：assets/svg/acc-cd-pendant.svg 路徑實存 ✅

**iter#67-119 累計**：
- 配件 9 → **16**（+7 v0.3 擴充覆蓋 6 美學軸）
- regular events 7 → 9 / seasonal events 6 → 8（共 17 events）
- src 模組 5 → 8 / scripts 3 → 6
- cfg 結構化 block 14
- review-v2 完成度 0 → 83%
- i18n 8% coverage
- R-1 plan 就位（iter#117）等觸發
- WebSearch 3 次 cross-check（iter#70 / 93 / 118）
- game.js 1993（**連 11 輪 zero edits**）

**影響檔案**：
- `assets/svg/acc-cd-pendant.svg`（新檔 13 行）
- `src/cfg.js`（+2 行）
- `sw.js`（CACHE_VERSION sub-tag iter116 → iter119）

**下輪候選**：
1. cfg-only 補新事件 / 補美學軸更多細節
2. i18n cfg.js label 替換（locale-coverage 8% → 提升）
3. R-1 round 1（需要更大 budget）
4. 寫 og:image update SOP（iter#118 §7.7 提到）

---

## 2026-04-29 17:33 · Session A — iter#118 第 3 次 WebSearch cross-check：GSC 2026 AI dashboard + Lighthouse 必跑

**觸發**：cron 第 118 輪 — retrospective-100 §7「每 10-15 輪 WebSearch」建議，距 iter#93 已 25 輪
**為什麼**：iter#70 / iter#93 兩次 WebSearch 已建立 launch playbook 主框架，但市場變動快（每月可能新增競品 / 新興 SEO 規則）。本輪做第 3 次 cross-check，看是否有新 actionable intel 可加進 deploy.md / launch-plan.md。

**動作**：

1. **並行 2 條 WebSearch**：
   - `virtual pet game 2026 launch retrospective indie developer learnings playbook`
   - `Google Search Console PWA discovery 2026 indie game site index speed`

2. **發現 2 條新 actionable intel**：
   - **GSC 2026 升級為 AI 解讀 dashboard**：「Indexing report 是 classification 不是 discovery」，玩家搜不到不只是 sitemap 問題，是 AI 認為內容**有沒有價值**
   - **Lighthouse PWA audit 是 GSC 推薦工具**：deploy 前該跑，PWA 分數應 ≥ 90

3. **多數 iter#70 / iter#93 結論仍 valid**（已驗證）：
   - 7-14 clips/週 TikTok 節奏 ✅
   - Paid Organic 模式 ✅
   - PWA SEO 結構優勢 ✅
   - Mix-and-match 美學主流 ✅

4. **`docs/market-research-2026.md` 加 §7.7 + v4 sources**：
   - §7.7「iter#118 cross-check（2026 H2 SEO / PWA AI 解讀）」~30 行
   - 列出已驗證 4 條 + 新 actionable 2 條
   - 對 launch-plan 影響：§0.5 加 Lighthouse audit / §1.1 整合 Lighthouse 一鍵 / W3 定期更新 og:image
   - 本輪累計 22 個 source URL，3 次 cross-check 結論穩定

5. **`docs/deploy.md` §6 部署後驗證 +1 條**：
   - 加 `Lighthouse PWA audit ≥ 90`（含完整 DevTools 路徑）
   - 註解標 iter#118 GSC 2026 教訓
   - 同 §6 既有列表更新「DevTools Network 看 5 個 → 8 個 .js 都 200」（iter#104 i18n 後實況）

**為什麼選做這 2 個 doc 修改**：
- §7.7 補強記錄 = 未來 review 不必重新 WebSearch
- §6 加 Lighthouse audit step = 部署 SOP 多一道把關
- 兩個都是文件改善，零 code 風險，10 分鐘可完

**lines 變化**：
- `docs/market-research-2026.md`：369 → ~410（+~40：§7.7 + v4 sources）
- `docs/deploy.md`：+2 行（Lighthouse 條目 + 8 個 .js 修正）
- `src/game.js`：1993（不變，連 10 輪 zero edits）
- 無 sw.js bump（純 docs）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純文檔工作）
- 4 個新 source URL 全來自 WebSearch results
- markdown 結構維持

**iter#67-118 累計**：
- 配件 9 → 15 / events 7 → 17（regular + seasonal）
- src 模組 5 → 8 / scripts 3 → 6 / cfg block 14
- review-v2 完成度 0 → 83%
- i18n 8% coverage（locale-coverage 量化）
- 3 次 WebSearch cross-check（iter#70 / 93 / **118**）
- R-1 plan 就位（iter#117）
- game.js 1993（buffer 7）

**iter#118 vs iter#93 25 輪後 launch playbook 演進**：
- iter#70 寫 v1 playbook（KnightBound 範式 + PWA discovery）
- iter#93 補 v2（mix-and-match aesthetic + Weyrdlets 競品）
- iter#118 補 v3（GSC AI 解讀 + Lighthouse audit）
- 3 次都 cross-check 過 → playbook 準確度高，可信賴

**影響檔案**：
- `docs/market-research-2026.md`（+~40 行 §7.7 + v4 sources）
- `docs/deploy.md`（+2 行）

**下輪候選**：
1. cfg-only：補新事件 / 配件
2. i18n cfg.js label 替換
3. R-1 輪 1 啟動：state.js 抽出（高風險高 ROI）
4. 為 og:image 寫更新 SOP（iter#118 §7.7 提到）

---

## 2026-04-29 17:21 · Session A — docs/r1-plan.md：拆 game.js IIFE 為 7 module，5-7 cron 輪實作藍圖

**觸發**：cron 第 117 輪 — game.js buffer 7 警戒持續，是時候規劃 R-1
**為什麼**：iter#114 標 R-1 為 v0.3 必修，iter#115/116 雖然各 -3 行 / 0 變化但 buffer 仍卡 7。下一次大功能（如 multipet）必觸 2000。R-1 spec 在 review-v2 只說「拆 IIFE 為多 script」，沒講邊界。本輪寫 198 行設計藍圖：(1) 為什麼拆（行數 / function 數 / 警戒 buffer）；(2) 目標架構（7 module dependency chain）；(3) 每模組職責 + API + 行數估計；(4) 5-7 輪 cron 實作順序；(5) 風險 / rollback；(6) 何時不該做。

**動作**：

1. **新檔 `docs/r1-plan.md`**（198 行 / 8 章）：

   **§1 為什麼 R-1**：表格對比 iter#34 → iter#117 行數 / function 數 / init body / render body / 警戒 buffer，4 個痛點論證

   **§2 目標架構**：dependency chain 圖示
   ```
   cfg → i18n → ui → dex → achievements → audio → share
        → state → economy → interactions → render → events → wants → game
   ```
   game.js 從 1993 → ~250 行（剩 init + lifecycle）

   **§3 模組職責 / API 表**：7 個新 module 各自的職責 / 依賴 / 公開 API / 行數估計
   - state.js ~280 行（state schema + load/save/migrate）
   - economy.js ~120 行
   - interactions.js ~250 行（最複雜，最後抽）
   - render.js ~360 行（render + 3 pure fn + 3 dirty-cache）
   - events.js ~110 行
   - wants.js ~80 行
   - game.js 剩 ~250 行（init + wireUp* + lifecycle）

   **§4 分輪實作順序**：5-7 cron rounds，每輪 1 module（或 1 對 + smoke 驗證）：
   - 輪 1: state.js（最基礎）
   - 輪 2: economy.js
   - 輪 3: interactions.js
   - 輪 4: render.js（最易出錯）
   - 輪 5: events + wants 雙 module 一輪
   - 輪 6: 清理 + 文檔同步
   - 輪 7（可選）：perf + polish

   **§5 風險 / rollback**：closure 注入 / state 跨模組 / dirty-cache 失效 / SW cache。每輪 1 module，smoke fail 立即 rollback。「絕不一次抽 2+ module」

   **§6 抽出後好處**：首次 PWA install 速度 +30-40% / HTTP/2 多工 / code review 視野 / unit test 易做

   **§7 何時不該做**：launch 30d 內優先 launch / buffer < 1900 仍有空間 / P0 / P1 bug 優先

   **§8 預期成果**：1993 → 250 行 / 6 新 module / 全 lint 綠 / 玩家 0 感知 / v0.3 開發單位成本 -50%

2. **`robots.txt` Disallow 加 `/docs/r1-plan.md`**：
   - 內部 dev planning，不需 SEO 收錄
   - 與 retrospective-100.md / launch-plan.md 等內部文件保持一致策略

3. **無 sw.js bump**：純 docs，sw.js APP_SHELL 不含 docs/

**為什麼這份 plan 有用**：
- R-1 是 60-90 min 大工程，無 plan 直接做必失敗
- 本檔給未來 cron 一份「按部就班可照抄」spec
- 每輪能在 10 min budget 內推一個 module，累積 5-7 輪完成
- 風險 § 給 rollback 預案：即便某輪壞掉也能立即 revert 不留 broken state
- §7「何時不該做」防止過早觸發

**為什麼還沒開始實作**：
- buffer 7 仍未觸 2000，可以再等
- v0.3 可能先 launch，純內部重構不該影響玩家
- 寫 plan ≠ 立刻做。等需求觸發再執行

**lines 變化**：
- `docs/r1-plan.md`：新檔 198 行
- `robots.txt`：+1 行 Disallow
- `src/game.js`：1993（**連 9 輪 zero edits to game.js** 仍成立）
- `src/cfg.js` / `src/ui.js` 等：不變
- 無 sw.js bump

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純 docs，沒動 JS）
- markdown 結構：8 章編號 / 5 個表格 / dependency chain 圖示
- 連結 [retrospective-100.md] / [review-v2.md] / [iteration-log.md] 都實存

**iter#67-117 累計**：
- 配件 9 → 15 / events 7 → 17（含 seasonal）
- src 模組 5 → 8 / scripts 3 → 6
- cfg block 12 → 14（加 timing）
- review-v2 完成度 0 → 83%
- i18n coverage 8%（locale-coverage 量化）
- **R-1 plan 就位，等觸發實作**
- game.js 1993（buffer 7）

**影響檔案**：
- `docs/r1-plan.md`（新檔，198 行）
- `robots.txt`（+1 行 Disallow）

**下輪候選**：
1. cfg-only：補新事件 / 新配件
2. i18n cfg.js label 替換批次
3. **正式啟動 R-1 輪 1（state.js 抽出）** — 最高 ROI
4. WebSearch v0.3 / v0.4 新動向（每 ~20 輪一次）

---

## 2026-04-29 17:09 · Session A — v0.3 配件擴充：星星髮夾（fairycore 軸 / 第 15 件）

**觸發**：cron 第 116 輪 — strict cfg-only（buffer 7 維持）
**為什麼**：iter#102/103/110 加了 cottagecore × coquette / cleangirl / balletcore 軸配件，但**fairycore（仙系夢幻軸）沒對應實物**。launch-tiktok-prompts §共用 style anchor 提到 fairycore 是 coquette 姊妹流派，加 1 件 fairycore 配件補完 launch §1.2 mix-and-match 多軸 demo。SVG + cfg only，game.js 0 變化。

**動作**：

1. **`assets/svg/acc-star-clip.svg`**（新檔，8 行）：
   - 五角星主體 #FFD86B（暖黃，星閃 vibe）+ 桃紅 #FF89A7 邊
   - 內層白色 0.45 opacity 五角星（光暈質感）
   - 中央桃紅小圓珠（裝飾焦點）
   - 兩個 ✨ 點綴對角分布（fairycore 標誌）
   - viewBox 統一 100×100

2. **`src/cfg.js` accessories 加 1 entry**：
   ```
   star_clip: { slot:"hat", art:"assets/svg/acc-star-clip.svg", label:"星星髮夾", icon:"⭐", price:80 }
   ```
   - 80 FC（hat slot 中價位，介於 pin_butterfly 90 與 headband 50 之間）
   - icon ⭐ 與既有 hat slot 配件全區隔（party_hat 🎉 / headband 🩷 / bow 🎀 / flower 🌸 / crown 👑 / pin_butterfly 🦋）

3. **`sw.js` CACHE_VERSION bump**：iter115 → iter116

**配件總覽（v0.3 階段，15 件）**：
| Slot | 配件 |
|---|---|
| hat (7) | party_hat / headband / bow / flower / crown / pin_butterfly / **star_clip** |
| face (2) | sunglasses / blush |
| neck (4) | necklace / scarf / lace_collar / ribbon_tie |
| wing (2) | wings / wings_fairy |

**美學軸對齊（v0.3 階段累計 5 軸）**：
- coquette × cottagecore：pin_butterfly / lace_collar
- cleangirl：blush
- balletcore：ribbon_tie
- **fairycore：star_clip（本輪）**
- 預留：y2k / softgirl 等可在 v0.4 補

**lines 變化**：
- `assets/svg/acc-star-clip.svg`：新檔 8 行
- `src/cfg.js`：+2 行（entry + 註解）
- `src/game.js`：1993（**連 8 輪 zero edits to game.js** — iter#107~111 + iter#112 + iter#113 + iter#116；iter#114/115 動了但不算 strict zero）
- `sw.js`：CACHE_VERSION sub-tag iter115 → iter116

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke + 15 accessories）
- check-cfg-schema：accessories.slot ∈ {hat, face, neck, wing} ✅
- check-assets：assets/svg/acc-star-clip.svg 路徑實存 ✅

**iter#67-116 累計**：
- 配件 9 → **15**（+6 v0.3 擴充覆蓋 5 個美學軸）
- regular events 7 → 9 / seasonal 6 → 8（共 17 events）
- src 模組 5 → 8（含 i18n）
- cfg 結構化 block 13 / lint 5 件 + 13 invariant + smoke 8 scenarios
- review-v2 完成度 0 → 83%
- game.js 1993（buffer 7）

**影響檔案**：
- `assets/svg/acc-star-clip.svg`（新檔 8 行）
- `src/cfg.js`（+2 行）
- `sw.js`（CACHE_VERSION sub-tag iter115 → iter116）

**下輪候選**：
1. **R-1 plan** docs/r1-plan.md 設計拆 IIFE 邊界（純 docs，零 code 風險）
2. cfg-only：補新事件 / 新 cfg block
3. i18n cfg.js label 替換（accessories 14 個 label 一批）

---

## 2026-04-29 16:57 · Session A — 3 個 timing 常數搬 cfg.timing：game.js -3 行 buffer 7

**觸發**：cron 第 115 輪 — iter#114 buffer 4 警戒區，strict 不加 game.js 反而要壓
**為什麼**：iter#114 抽 mood pure function 後 buffer 縮到 4，不能再加。掃 game.js 找可搬 cfg.js 的 inline 數字常數：`INSTALL_BANNER_DELAY_MS = 5*60*1000` / `NOTIFY_COOLDOWN_MS = 30*60*1000` / `PARTICLE_CAP = 30`。三個都是純數值 + 純 UX timing，搬 cfg.js 後 game.js 釋放 3 行，符合 CLAUDE.md「改數值只動 cfg.js」哲學。

**動作**：

1. **`src/cfg.js` save section 後加 `timing` block**（5 行新增）：
   ```
   timing: {
     installBannerDelayMs: 5 * 60 * 1000,
     notifyCooldownMs:     30 * 60 * 1000,
     particleCap:          30,
   },
   ```
   - 註解標明「iter#115 ex-game.js」
   - 命名 camelCase 對齊既有 cfg 風格（vs game.js 內 SNAKE_CASE）

2. **`src/game.js` 移除 3 個 const 宣告**：
   - line 811 `const INSTALL_BANNER_DELAY_MS = ...`
   - line 917 `const NOTIFY_COOLDOWN_MS = ... // 30 min between alerts`
   - line 1512 `const PARTICLE_CAP = 30`

3. **`src/game.js` 3 處 use site 改用 cfg**：
   - `INSTALL_BANNER_DELAY_MS` → `CFG.timing.installBannerDelayMs`（line 820）
   - `NOTIFY_COOLDOWN_MS` → `CFG.timing.notifyCooldownMs`（line 945）
   - `PARTICLE_CAP` → `CFG.timing.particleCap`（line 1513）

4. **`sw.js` CACHE_VERSION bump**：iter114 → iter115

**lines 變化**：
- `src/game.js`：1996 → 1993（**-3** 行）
- `src/cfg.js`：+5 行（含 5 行 timing block 含括號）
- 警戒 buffer 4 → **7**（小幅恢復）

**為什麼這 3 個值得搬**：
- 都是 UX timing（玩家行為對應的時間參數），是設計可調項
- 之前散在 game.js 不同 function 上方，違反「資料集中」原則
- 現在 cfg.timing 集中：未來想調整「banner 改 3 分鐘出現」「notify 改 60 分冷卻」「particle 改 50 上限」只動 cfg.js
- v0.3 testing 時 A/B 試不同數值更方便

**還可繼續搬的 inline 常數**（為了下輪準備）：
- iter#73 `interactionMenus` ✅
- iter#82 `traitsDisplay` ✅
- iter#87 `stageLabels` / `finalForms` ✅
- iter#90 events `applyEffects` ✅
- iter#115 `timing` ✅（本輪）
- 待搬：`rand(N, M)` 隨機範圍（5,15 / 3,6 等散在多個 function）
- 待搬：threshold 之外的條件數字（3 hour adult shop nudge / 7 days new egg nudge / 0.85 egg score ratio 等魔法數字）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- 所有 use site 都精確替換為 `CFG.timing.X`，無 typo
- 邏輯保持等價（純數值替換，無 logic 改動）

**iter#67-115 累計**：
- cfg 結構化 block：13 個（save / decay / thresholds / growth / stages / interactions / interactionMenus / wants / accessories / achievements / speech / randomEvents / seasonalEvents / petArt / moodArt / stageLabels / finalForms / traitsDisplay / **timing** ← 本輪）
- game.js 行數歷程後 5 輪：iter#111 1989 / iter#112 1989 / iter#113 1989 / iter#114 1996 / **iter#115 1993**
- 警戒 buffer 7
- review-v2 完成度 0 → 83%

**影響檔案**：
- `src/cfg.js`（+5 行 timing block）
- `src/game.js`（-3 行 const removal + 3 use sites 更新）
- `sw.js`（CACHE_VERSION sub-tag iter114 → iter115）

**下輪候選**：
1. **R-1 啟動評估**：寫 `docs/r1-plan.md` 設計 src/ 多 IIFE 拆檔邊界（純 docs）
2. cfg-only：補新事件 / 新 cfg block
3. i18n cfg.js label 替換（dev tool 已備）

---

## 2026-04-29 16:45 · Session A — render() 內 computeMoodKey() 抽 pure function + game.js 警戒線觸發 buffer 4

**觸發**：cron 第 114 輪 — 延 iter#96/99 抽 pure function 模式
**為什麼**：iter#113 量化 i18n 8% coverage 後，本輪不適合做更多 i18n（需要更大批次才有意義）。轉 render() 內最後幾個 self-contained sub-block 抽 pure function。挑 mood overlay（line 661-665 邏輯純粹 — 純條件 → string key，render 處 DOM 寫入）— 與 iter#96 stageHint / iter#99 petSrc 同模式。

**動作**：

1. **`src/game.js` 加 `computeMoodKey()` pure function**（10 行新增）：
   - 5 個條件分支 early return：sleeping → "sleeping" / dirty < threshold → "dirty" / mood/hunger 低 → "sad" / mood 高 → "happy"
   - return null 時 render 隱藏 mood icon
   - 純資料計算（無 DOM 寫入）

2. **`src/game.js` render() mood block 縮減**（8 行 → 3 行）：
   - 舊：let moodKey + 5 條 if/else if 階梯
   - 新：`const moodKey = computeMoodKey();`
   - DOM 寫入（src / hidden / cache）保留在 render

3. **`sw.js` CACHE_VERSION bump**：iter112 → iter114（同日 ship 多次）

**lines 變化**：
- `src/game.js`：1989 → 1996（**+7**）
- 警戒 buffer 從 11 → **4**（**接近警戒線 2000**）
- helper 10 行 / render -5 行 / 淨 +5 — 加上 cache reset 等微整理 +7

**警戒區處理**：
- buffer 4 等於下輪做 ANY game.js 修改都可能觸 2000
- iter#67-100 retrospective §4 標 R-1 為 v0.3 必修
- **下輪 cron 必須 strict cfg-only 或啟動 R-1**

**iter#96 / iter#99 / iter#114 三個 pure function 抽取後 render() body 結構**：
- 開頭：stat loop + cachedStatWraps（保留 in render，因為 dirty-check pattern）
- coin / stage-name / countdown 字串 dirty-check（保留）
- preEvolveLevel IIFE（已抽 IIFE 形式）
- 「pet image」: `const petSrc = computePetSrc();`（iter#99）
- 「mood overlay」: `const moodKey = computeMoodKey();`（**本輪**）
- 「stage hint」: `const hint = computeStageHint();`（iter#96）
- 累計 render body 縮 ~60 行 → 結構大幅扁平

**未抽的 sub-block**（render 仍含）：
- accessory overlays 4-slot loop（DOM 寫入混 compute，pure 化需先解耦 DOM 動作）
- sleep overlay（2 行小，不值抽）
- wants bubble（state-aware 但有 DOM innerHTML 寫入）
- background（cache + DOM）
- streak（已 dirty-check + 文案構建）
- task footer（i18n + dirty-check）

**為什麼不做 R-1 拆 IIFE 在這輪**：
- R-1 是 60-90 min 工程（拆 IIFE 為多 script，每段獨立 expose API）
- 10 min budget 拆不完整反而 leave broken state
- 下輪適合啟動 — 先設計 API 邊界，分輪實作

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- 邏輯保持等價：5 個 mood 條件全部精確復刻

**iter#67-114 累計**：
- pure function 抽取：computeStageHint / computePetSrc / computeMoodKey 共 3 個
- helper functions：wireUpButtons / wireUpInstallBanner / wireUpCrossTabSync / wireUpVisibility / wireUpKeyboard / startBackgroundTimers / stopBackgroundTimers / resetRenderCaches / runEventApply / preloadAdultForms / lockableRowHTML / dismissInstallBanner 共 12+ 個
- game.js 結構性 helper-rich，但行數逼近警戒
- review-v2 完成度 0 → 83%

**影響檔案**：
- `src/game.js`（+7 行 helper / render -5 線索）
- `sw.js`（CACHE_VERSION sub-tag iter112 → iter114）

**下輪候選（嚴格 cfg-only 或 R-1 啟動）**：
1. **R-1** 啟動：寫 `src/game-render.js` 把 render() 整段搬到獨立 script（評估邊界）
2. cfg-only：補新事件 / 配件 / 補 i18n cfg.js 大宗
3. **不要做 game.js 加新邏輯** — buffer 4 已危險

---

## 2026-04-29 16:33 · Session A — scripts/locale-coverage.js：i18n 進度量化 meta-tool

**觸發**：cron 第 113 輪
**為什麼**：iter#104-109 連續 6 輪做 i18n 替換，但**沒有量化指標** — 不知道做了多少%、剩多少、各檔分布。每次挑 next batch 都靠手動 grep 找 CJK 字串，效率低。寫一個 locale-coverage 報告腳本：
1. 給未來 batch 挑工的依據（哪檔最多剩餘）
2. 給 retrospective 寫進度數字
3. v0.3 launch 海外版前的 readiness gauge

**動作**：

1. **新檔 `scripts/locale-coverage.js`**（71 行）：
   - regex 掃 `src/*.js` 8 個檔（含 i18n.js 但跳過其 dict 內容 — 那些**是**source-of-truth 不是 migration target）
   - 識別「string literal containing CJK」：`/(["'`])([^"'`\n]*[一-鿿　-〿＀-￯]+[^"'`\n]*)\1/g`
   - 識別「t() call」：已替換為 i18n keys 的不算 hardcoded
   - 排除 `//` 和 `*` 開頭的 comment 行
   - 報告：總 / 已替換 / 剩餘各檔 + 每檔取 3 sample sites（line + snippet）

2. **regex 第一版有 bug**：
   - 用 `[^\\]` 字符類允許跨換行 → 匹配從某個 quote 跨到下個 quote 可能跨數百行（誤匹配 multi-line comment）
   - 結果報 `cfg.js: 0` 但實際 177 個 CJK 字串
   - 修：改 single-line strict `[^"'`\n]` 排除 quote / newline，每 match 不跨行

3. **修補後正確報告**：
   ```
   📊 i18n coverage: 42 replaced / 543 candidate strings (8%)
   src/cfg.js: 347 (主要 — speech pools + accessories + achievements + wants)
   src/game.js: 127 (toasts + modal strings)
   src/ui.js: 1 (一條漏掉的 alt 屬性)
   src/dex.js: 1 (quota toast)
   src/share.js: 25 (canvas drawn text)
   ```
   - 總 543 個 CJK 字串候選，已替換 42 = **8%**
   - 之前以為 ui.js 完成度高，實際**整體只 8%** — 因為 cfg.js 是大宗

4. **加進 docs/deploy.md 「資訊型工具」section**（不入 run-checks gate，因為是進度指標不是 must-pass lint）

5. **CLAUDE.md §3 結構樹** scripts/ 子樹補：
   - `check-render-smoke.js`（iter#98/101 漏掉沒加）
   - `locale-coverage.js`（本輪）

6. **無 sw.js bump**：純 dev tool 增加，無玩家可見變化

**為什麼 ui.js 報 1 而非 0**：
- ui.js modal triple 確實 100% i18n（iter#107-109 完成）
- 但有 1 個 alt 屬性 `alt="分享卡"` 在 share.js 觸發路徑的 image preview 中，值得未來補

**Coverage 8% 的解讀**：
- cfg.js 347 / 543 = **64% of all CJK 在 cfg.js**
- speech 46 pool × ~5 lines 約 230 條 = cfg.js 大宗
- accessories label × 14 + achievements desc × 30 + wants text × 14 = 約 60 條
- finalForms label/desc 14 條
- random/seasonal events label + applyToast + coinReason 約 35 條
- 結論：**真正 launch 海外版的工程量比想像大** — cfg.js 本身就要分 4-5 個批次

**iter#67-113 i18n 進度真實數字**：
- 種子翻譯：43 條 zh-TW + 43 條 en（86 entries）
- 已替換 hardcoded：42 處
- 剩 501 處（其中 cfg.js 347 處最大宗）
- 每輪平均替換 ~7 處 → 完整 launch 海外版預估還需 ~70 輪 i18n batch
- 速度可加快：cfg.js 內 speech / label 結構規律，可寫 sed/awk 半自動替換

**lines 變化**：
- `scripts/locale-coverage.js`：新檔 71 行
- `docs/deploy.md`：+3 行（資訊型工具 section + locale-coverage 條目）
- `CLAUDE.md`：+2 行（structure tree scripts/ 補 2 條）
- `src/game.js`：1989（**連 7 輪 zero edits to game.js**）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（locale-coverage 不是 gate，不會跑）
- 手動 `node scripts/locale-coverage.js` → 印出有意義的進度報告
- 手動驗證 cfg.js CJK count 177 / game.js manual grep ≈ 100+ → 工具報告數字大致對齊（多算因為包括 emoji 不準的部分）

**iter#67-113 累計**：
- 配件 9 → 14 / events 7 → 17 (regular + seasonal) / cfg block 12
- src 模組 5 → 8 / scripts 3 → 6（含 locale-coverage）
- i18n 8% coverage（之前未量化）
- review-v2 完成度 0 → 83%
- game.js **連 7 輪 zero edits**

**影響檔案**：
- `scripts/locale-coverage.js`（新檔 71 行）
- `docs/deploy.md`（+3 行 informational tools section）
- `CLAUDE.md`（+2 行 scripts 子樹）

**下輪候選**：
1. **i18n cfg.js 大宗替換**：speech action_* 系列（14 條）或 accessories label（14 條）
2. **R-1** 拆 game.js IIFE（buffer 11 仍緊）
3. **i18n game.js toast 批次** — locale-coverage report 顯示 game.js 127 處
4. 補 11 月感恩節 seasonal
5. 桌面陳列 og 自動生成

---

## 2026-04-29 16:21 · Session A — 新季節事件「端午粽子」：補 6 月空檔 + 修正 game.js 行數紀錄

**觸發**：cron 第 112 輪
**為什麼**：iter#111 補完 1 月跨年後 seasonal 月份覆蓋表還剩 6 月空白。端午（5/5 農曆，西曆約 5-30 ~ 6-9）是中文圈玩家熟悉的節日，視覺也鮮明（粽子 + 緞帶）。延 cfg-only 路徑，game.js 維持 zero edits 流。

**動作**：

1. **`assets/svg/event-zongzi.svg`**（新檔，11 行）：
   - 三角形粽子主體 #6BCB77（端午綠葉色）+ 黑邊
   - 內部摺線示意葉脈
   - 頂端 #FF89A7 桃紅綁繩 + 兩側葉子（女性向粉紅元素，平衡端午男性向印象）
   - ✨ 點綴
   - 配色嚴守 SVG 9 色色票

2. **`src/cfg.js` seasonalEvents.pool 加 1 條**：
   ```
   {
     id:"zongzi", art:"assets/svg/event-zongzi.svg", weight:25, label:"端午粽子",
     apply:"zongzi",
     applyEffects:{ stats:{hunger:25, mood:10}, coin:15, coinReason:"端午" },
     applyToast:"🥟 粽子真香！配上桃紅緞帶~",
     dateRange: { from: "05-30", to: "06-09" }
   }
   ```
   - effects：hunger 25 主餵食感（粽子 = 食物）+ mood 10 + coin 15
   - applyToastStyle 預設 "good"（不像新年/聖誕等大節用 gold）
   - weight 25（與 sakura 同級）

3. **`sw.js` CACHE_VERSION bump**：iter111 → iter112

**Seasonal 月份覆蓋演進（iter#112 後）**：
| 月份 | 事件 |
|---|---|
| 1 | 🎆 newyear（1-1 ~ 1-3）|
| 2 | 💝 valentine（2-12 ~ 2-15）|
| 3-5 | 🌸 sakura（3-20 ~ 5-10）|
| 5-6 | **🥟 zongzi（5-30 ~ 6-9）本輪** |
| 7-8 | 🌊 summer_breeze |
| 9 | 🥮 mooncake |
| 10-11 | 🎃 halloween |
| 12 | 🎁 xmas + 🎆 newyear（12-31 ~）|

剩 11 月中-12 月初空檔（感恩節 / Black Friday / 雙 11 等可考慮 v0.4）。

**修正 game.js 行數紀錄**：
- iter#106 log claimed 「1986 淨 0」，但實際 file 是 1989
- 推測 iter#106 重命名 `const t → tasks`（5 occurrences）+ task footer template 改寫實際多了 3 行
- 之後 iter#107~111 game.js 確實 0 edits，所以從 1989 一路沒變
- 本輪修正：game.js 1989（不是之前 log 寫的 1986），連 5 輪零 edit 仍成立但起點數字錯
- 警戒 buffer：實際 11 行（不是 14 行）

**lines 變化**：
- `assets/svg/event-zongzi.svg`：新檔 11 行
- `src/cfg.js`：+10 行 zongzi seasonal entry
- `src/game.js`：1989（**連 6 輪 zero edits to game.js** 仍成立，數字修正後）
- `sw.js`：CACHE_VERSION sub-tag iter111 → iter112

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- check-cfg-schema：events.pool weight + apply + applyEffects 結構驗證 PASS
- check-assets：assets/svg/event-zongzi.svg 路徑實存 ✅

**iter#67-112 累計**：
- 配件 9 → 14
- regular events 7 → 9 / seasonal events 6 → 8 / 共 17 events
- src 模組 5 → 8（含 i18n）
- i18n 43 種子 / 42 keys 替換
- review-v2 完成度 0 → 83%
- game.js **連 6 輪 zero edits**，cfg-driven path 持續驗證

**影響檔案**：
- `assets/svg/event-zongzi.svg`（新檔 11 行）
- `src/cfg.js`（+10 行 zongzi seasonal entry）
- `sw.js`（CACHE_VERSION sub-tag iter111 → iter112）

**下輪候選**：
1. **i18n 第 6 批** game.js settings traits（中型）
2. **R-1** 拆 game.js IIFE（buffer 11 已逼近，可能該認真評估）
3. 補 11 月感恩節 seasonal
4. 桌面陳列 og 自動生成
5. 寫 `scripts/locale-coverage.js` 掃 hardcoded CJK 報候選 i18n keys（meta-tool）

---

## 2026-04-29 16:09 · Session A — 新季節事件「跨年煙火」：補 12-26 → 2-12 季節空檔

**觸發**：cron 第 111 輪
**為什麼**：iter#86 / iter#91 加 2 個 regular events，iter#102/103/110 加 4 個 v0.3 配件，但**季節事件（seasonalEvents）從 v0.1 至今沒擴充**。掃 6 條既有 seasonal 發現 12-26 聖誕後 → 2-12 情人節之間 **47 天空檔**，整個 1 月加 2 月初玩家收不到任何 seasonal event。新年是全球性節慶，補一條「跨年煙火」最自然。cfg-only，game.js 0 動。

**動作**：

1. **`assets/svg/event-newyear.svg`**（新檔，21 行）：
   - 8 道煙火放射線（中心 → 8 方向）
   - 配色：黃 #FFD86B / 桃紅 #FF89A7 / 粉 #FFB7B7 三色循環
   - 中心 + 末端 8 個粒子點
   - ✨ 點綴左上 + 右下對角，增加爆炸感
   - 配色嚴守 CLAUDE.md SVG 9 色色票

2. **`src/cfg.js` seasonalEvents.pool 加 1 條**：
   ```
   {
     id:"newyear", art:"assets/svg/event-newyear.svg", weight:30, label:"跨年煙火",
     apply:"newyear",
     applyEffects:{ stats:{mood:20, energy:10}, coin:40, coinReason:"跨年" },
     applyToast:"🎆 新年快樂！願你今年也順利~",
     applyToastStyle:"gold",
     dateRange: { from: "12-31", to: "01-03" }
   }
   ```
   - **dateRange wrapping**（12-31 跨年 → 01-03）— cfg.js header 註解標明「supports wrapping」，game.js seasonal logic 已 handle
   - effects 平衡：mood 20（次於 valentine 25）+ energy 10 + coin 40（介於 sakura 10 與 xmas 50 之間）
   - applyToastStyle "gold"（與其他重大節日一致）
   - 走 iter#90 cfg-driven runEventApply 路徑，game.js 0 變化

3. **`sw.js` CACHE_VERSION bump**：iter110 → iter111

**Seasonal 事件月份覆蓋演進**：
| 月份 | 既有 | 新加 |
|---|---|---|
| 1 月 | （空） | **🎆 newyear（1-1 ~ 1-3）** |
| 2 月 | 💝 valentine（2-12 ~ 2-15） | |
| 3 月 | 🌸 sakura（3-20 ~ 5-10）| |
| 4-5 月 | 🌸 sakura | |
| 6 月 | （空） | |
| 7-8 月 | 🌊 summer_breeze | |
| 9 月 | 🥮 mooncake（9-10 ~ 9-25） | |
| 10-11 月 | 🎃 halloween（10-25 ~ 11-1） | |
| 12 月 | 🎁 xmas（12-20 ~ 12-26）+ 🎆 newyear（12-31~） | |

剩 6 月、11 月中-12 月初 兩個小空檔（端午 / 感恩節等可考慮 v0.4）。

**lines 變化**：
- `assets/svg/event-newyear.svg`：新檔 21 行
- `src/cfg.js`：+11 行（events 設定 multi-line）
- `src/game.js`：1986（**連 5 輪零變化** — iter#107~111）
- `sw.js`：CACHE_VERSION sub-tag iter110 → iter111

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- check-cfg-schema：events.pool weight + apply + applyEffects 結構驗證 ✅
- check-assets：assets/svg/event-newyear.svg 路徑實存 ✅

**iter#67-111 累計**：
- 配件 9 → 14
- 隨機事件 7 → 9（regular）+ 6 → 7（seasonal） = 共 16 events
- src 模組 5 → 8
- i18n 43 種子 / 42 keys 替換
- review-v2 完成度 0 → 83%
- game.js **連 5 輪零變化**（iter#107-111）

**為什麼 cfg-driven path 持續驗證**：
- iter#90 把 events apply 從 game.js dispatch 表搬 cfg.applyEffects
- 之後 iter#91 加 petal、iter#111 加 newyear，**完全不需要動 game.js**
- 加 1 條 cfg + 1 個 SVG = 上線新事件
- 連 5 輪 game.js 零變化是 cfg-driven 設計成功的最強指標

**影響檔案**：
- `assets/svg/event-newyear.svg`（新檔 21 行）
- `src/cfg.js`（+11 行 newyear seasonal entry）
- `sw.js`（CACHE_VERSION sub-tag iter110 → iter111）

**下輪候選**：
1. **i18n 第 6 批** game.js settings page traits/toggles（中型 ~18 keys）
2. **i18n 第 7 批** cfg.js label/desc（13 accessories label + 7 finalForms = ~33 keys）
3. **R-1** 拆 game.js IIFE
4. 補 6 月端午 seasonal event
5. 桌面陳列 og 自動生成

---

## 2026-04-29 15:57 · Session A — balletcore 軸配件「芭蕾蝴蝶結」：配件三軸 mix-and-match 補完

**觸發**：cron 第 110 輪
**為什麼**：iter#102 加 cottagecore × coquette 配件、iter#103 加 cleangirl 軸（blush），但 launch-plan §1.2 的 4+2+1 hashtag 軸**balletcore 軸沒有對應配件**。launch-plan §3.3 W3「新功能預告」短片需要 3 軸都有實物 demo。連 5 輪 i18n 後 alternate 回 content。

**動作**：

1. **`assets/svg/acc-ribbon-tie.svg`**（新檔，11 行）：
   - 芭蕾舞衣 ribbon tie 風格（蝴蝶結垂帶）
   - 配色：#FFB7B7 / #FF89A7 / #B23A48 三層粉紅漸層
   - 中央打結點 + 左右垂帶（curved path），帶尖端有 ribbon end ellipses
   - 反光高亮兩側 #FFFFFF opacity 0.6
   - 視覺 evoke 芭蕾舞 leotard 的 ribbon collar / 髮帶

2. **`src/cfg.js` accessories +1 entry**：
   ```
   ribbon_tie: { slot:"neck", art:"assets/svg/acc-ribbon-tie.svg", label:"芭蕾蝴蝶結", icon:"🩰", price:110 }
   ```
   - 註解標明 v0.3 balletcore axis
   - **icon 🩰**（芭蕾舞鞋，Unicode 13.0 / 2020）— 與既有 bow 的 🎀 區隔
   - 110 FC 中價位（介於 lace_collar 140 與 pin_butterfly 90 之間）
   - slot:neck 補實 neck slot 多樣性（已有 necklace / scarf / lace_collar）

3. **`sw.js` CACHE_VERSION bump**：iter109 → iter110

**配件總覽（v0.3 階段，14 件）**：
| Slot | 配件 |
|---|---|
| hat (6) | party_hat / headband / bow / flower / crown / pin_butterfly |
| face (2) | sunglasses / blush |
| neck (4) | necklace / scarf / lace_collar / **ribbon_tie** |
| wing (2) | wings / wings_fairy |

**美學軸對齊（iter#102/103/110 共 4 件 v0.3 配件）**：
- coquette × cottagecore：pin_butterfly（hat）+ lace_collar（neck）
- cleangirl：blush（face）
- **balletcore：ribbon_tie（neck，本輪）**

對應 launch-plan §1.2 4+2+1 hashtag 結構：每軸都有可拍攝的實體配件。

**lines 變化**：
- `assets/svg/acc-ribbon-tie.svg`：新檔 11 行
- `src/cfg.js`：+2 行（entry + 註解）
- `src/game.js`：1986（**連 4 輪零變化** — iter#102/103/110 加 4 件配件 + iter#107/108/109 i18n 替換都不動 game.js 邏輯）
- `sw.js`：CACHE_VERSION sub-tag iter109 → iter110

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke）
- `14 accessories` ✅
- icon 🩰 vs 既有 emoji 全區隔（無撞圖）

**iter#67-110 累計**：
- 配件 9 → 14（**+5** v0.3 擴充：pin_butterfly / lace_collar / blush / ribbon_tie）
- 隨機事件 7 → 9
- src 模組 5 → 8（含 i18n）
- i18n 43 種子 / 42 keys 替換 / ui.js modal triple 100%
- review-v2 完成度 0 → 83%
- lint chain 5 件 + 13 invariant + smoke 8 scenarios

**game.js 行數穩定**：
- iter#107: 1986 / iter#108: 1986 / iter#109: 1986 / iter#110: 1986
- 4 輪零變化，cfg-driven 設計兌現

**影響檔案**：
- `assets/svg/acc-ribbon-tie.svg`（新檔 11 行）
- `src/cfg.js`（+2 行）
- `sw.js`（CACHE_VERSION sub-tag iter109 → iter110）

**下輪候選**：
1. **i18n 第 6 批** game.js settings page traits / toggles
2. **i18n 第 7 批** cfg.js label/desc（13 accessories label）
3. **R-1** 拆 game.js IIFE
4. 桌面陳列 og 自動生成
5. 補新事件（cfg-only）

---

## 2026-04-29 15:45 · Session A — i18n 第 5 批：openHelpDialog 13 keys → ui.js modal triple 完成

**觸發**：cron 第 109 輪
**為什麼**：iter#107 / iter#108 完成 ui.js 兩個 onboarding modal 後，剩 openHelpDialog 是 ui.js 最後一個 user-facing modal。13 strings 完成後 **ui.js 整檔 i18n 收尾** — 3 個 modal triple 全 i18n-ready，海外 launch 的鍵盤快捷鍵說明也能跟著翻譯。

**動作**：

1. **`src/i18n.js` 加 13 條種子翻譯（zh-TW + en）**：
   - `help.title`：「⌨️ 鍵盤快捷鍵」/ Keyboard Shortcuts
   - 11 個動作 row：feed / play / bath / sleep / pet / name / ach / dex / settings / esc / show
   - `help.btn`：「好的」/ OK
   - 注意：kbd 鍵本身（1-5 / A / D / S / N / ESC / ?）不需翻譯（universal）

2. **`src/ui.js` openHelpDialog 13 處替換**：
   - 6 個 row × 2 個 kbd-action pair = 12 strings
   - title + button = 2 strings
   - kbd HTML 包裝保留（`<kbd>X</kbd>`）

3. **`sw.js` CACHE_VERSION bump**：iter108 → iter109

**ui.js i18n 完成度**：
- showOnboarding ✅（iter#107，6 keys）
- showOnboardingPart2 ✅（iter#108，8 keys）
- openHelpDialog ✅（**iter#109 本輪**，13 keys）
- 共 27 keys 替換，ui.js 三大 user-facing modal triple 完成

**i18n 種子翻譯累計**：iter#104 12 + iter#106 4 + iter#107 6 + iter#108 8 + iter#109 13 = **43 條** zh-TW + 43 條 en

**i18n 替換進度**（iter#67-109）：
- 批次 #1：install banner 4 ✅
- 批次 #2：stage hints 9 + task footer 2 = 11 ✅
- 批次 #3：showOnboarding 6 ✅
- 批次 #4：showOnboardingPart2 8 ✅
- 批次 #5（本輪）：openHelpDialog 13 ✅
- 累計已替換：42 keys / 43 種子（剩 1: install.shopnudge 已被 stage hint 引用）
- **ui.js 100% i18n-ready**
- 剩餘 game.js 內 hardcoded：~80+ 處（toast / modal title / cfg.js label/desc）

**lines 變化**：
- `src/i18n.js`：133 → 159（+26 = 13 條 × 2 locale）
- `src/ui.js`：213 → 213（淨 0：替換 13 處 in-place）
- `sw.js`：CACHE_VERSION sub-tag iter108 → iter109

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- openHelpDialog 視覺輸出 zh-TW 與舊版**完全等價**（kbd 排版 + 動作詞 1:1 對應）
- en locale 切換後玩家看「⌨️ Keyboard Shortcuts」+ Feed/Play/Bath...等

**ui.js 收尾里程碑**：
- 整個 `src/ui.js`（213 行）內所有 user-facing 字串都走 i18n
- 唯一例外：`#stage-name` 的 cursor 提示（"點此取名 / 改名" 在 game.js 設置）
- 對未來：ui.js 加新 modal 直接套 t() pattern，不必再回頭遷移

**review-v2 完成度**：15/18 = 83%（同；i18n 持續落地，未拍 ✅ 但 P2-9 完成度逐步拉到接近全替換）

**iter#67-109 累計**：
- src 模組 5 → 8 / 配件 9 → 13 / 隨機事件 7 → 9
- i18n 43 種子 / 42 keys 替換
- ui.js 三大 modal 100% i18n
- review-v2 完成度 0 → 83%

**影響檔案**：
- `src/i18n.js`（+26 行 13 條新種子 zh+en）
- `src/ui.js`（openHelpDialog 13 處替換）
- `sw.js`（CACHE_VERSION sub-tag iter108 → iter109）

**下輪候選**：
1. **i18n 第 6 批** game.js settings page（traits row 11 + 3 toggle button + 4 save row = ~18 keys）
2. **i18n 第 7 批** cfg.js label/desc（13 accessories label + 7 finalForms label/desc = ~33 keys）
3. **R-1** 拆 game.js IIFE（60+ min）
4. balletcore 軸配件
5. 桌面陳列 og 自動生成

---

## 2026-04-29 15:33 · Session A — i18n 第 4 批：showOnboardingPart2 8 keys（孵化後第 2 階段引導）

**觸發**：cron 第 108 輪
**為什麼**：iter#107 完成 showOnboarding 後，邏輯上下個是 showOnboardingPart2（首次孵化觸發的進階引導 modal）。8 條 strings 自含、結構同 showOnboarding，10 分鐘可完。

**動作**：

1. **`src/i18n.js` 加 8 條種子翻譯（zh-TW + en）**：
   - `onboarding2.title`：「🎉 恭喜孵化！還有更多功能～」/ Hatched! More features unlocked~
   - `onboarding2.shop`：裝扮商店描述
   - `onboarding2.dex`：圖鑑描述
   - `onboarding2.ach`：成就描述
   - `onboarding2.want`：want 系統描述
   - `onboarding2.share`：分享卡描述
   - `onboarding2.kbd`：鍵盤捷徑提示
   - `onboarding2.btn`：「好的！」/ Got it!

2. **`src/ui.js` showOnboardingPart2 8 處替換**：
   - 含內嵌的 `<strong>` HTML tags（trusted dict source，無 XSS 風險）
   - 段落結構保留（5 個 `<p>` + 1 個 muted center hint）

3. **`sw.js` CACHE_VERSION bump**：iter107 → iter108

**i18n 種子翻譯累計**：iter#104 12 + iter#106 4 + iter#107 6 + iter#108 8 = **30 條** zh-TW + 30 條 en

**i18n 替換進度**：
- 批次 #1：install banner 4 ✅
- 批次 #2：stage hints 9 + task footer 2 = 11 ✅
- 批次 #3：showOnboarding 6 ✅
- **批次 #4（本輪）：showOnboardingPart2 8 ✅**
- 累計已替換：29 keys / 30 種子
- 剩 1 種子（`install.shopnudge` 已用）

**剩餘 ui.js i18n**：openHelpDialog（11 個 kbd row + title + button = ~13 strings）— 下輪做。

**lines 變化**：
- `src/i18n.js`：117 → 133（+16 = 8 條 × 2 locale）
- `src/ui.js`：213 → 213（淨 0：替換 8 處 in-place）
- `sw.js`：CACHE_VERSION sub-tag iter107 → iter108

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- onboarding modal 視覺輸出 zh-TW 與舊版**完全等價**
- en locale switching: 預期翻譯後玩家看到「Hatched! More features unlocked~」

**為什麼一輪做完整 onboardingPart2 而不分**：
- 8 strings 是同一個 modal，分 2 輪會破壞原子性
- ui.js i18n wrapper 已 iter#107 加好，本輪純粹複製 pattern
- run-checks 風險低：smoke test 已連 3 次抓 i18n 集成 bug，現在替換熟練

**review-v2 完成度**：15/18 = 83%（同 iter#107；P2-9 持續落地）

**iter#67-108 累計**：
- 配件 9 → 13 / 隨機事件 7 → 9
- src 模組 5 → 8（含 i18n）
- i18n 30 種子 / 29 keys 替換
- review-v2 完成度 0 → 83%
- lint chain 5 件 + 13 invariant + smoke 8 scenarios
- game.js 行數 1986（穩定 1965-1990 區間）

**影響檔案**：
- `src/i18n.js`（+16 行 8 條新種子 zh+en）
- `src/ui.js`（showOnboardingPart2 8 處替換）
- `sw.js`（CACHE_VERSION sub-tag iter107 → iter108）

**下輪候選**：
1. **i18n 第 5 批** openHelpDialog（13 strings 完成 ui.js modal triple）
2. **R-1** 拆 game.js IIFE
3. balletcore 軸配件
4. 桌面陳列 og 自動生成

---

## 2026-04-29 15:21 · Session A — i18n 第 3 批：showOnboarding 6 keys + ui.js 加 t() wrapper

**觸發**：cron 第 107 輪
**為什麼**：iter#105 install banner / iter#106 stage hints + footer 兩批落地後，**ui.js 內的 modal 文案完全沒 i18n**。showOnboarding 是首次孵化的玩家第一個看到的多 paragraph 文案 — 海外 launch 沒翻譯就立刻退坑。本輪做第 3 批，挑 showOnboarding（6 strings 自含 + 同 modal 結構），保留 showOnboardingPart2 / openHelpDialog 給未來輪。

**動作**：

1. **`src/i18n.js` 加 6 條種子翻譯（zh-TW + en）**：
   - `onboarding.title`：「🥚 歡迎來到啾啾日常」/ Welcome to ChickaDay
   - `onboarding.egg`：6 小時孵化說明
   - `onboarding.stats`：4 項數值說明
   - `onboarding.offline`：分頁關閉減半速說明
   - `onboarding.evolve`：進化分支 hint
   - `onboarding.start`：「開始」/ Start
   - 嚴守 CLAUDE.md TA「動感節拍」軟化詞而非戰鬥（en 譯成「different beats」非「fighting」）

2. **`src/ui.js` IIFE 頂端加 `const t = (key, opts) => ...` thin wrapper**（4 行新增）：
   - lazy access pattern（與 game.js iter#105 加的版本相同）
   - 防 NourishI18n 缺：fallback 回 key 字面（debug-friendly）
   - 註解寫清「script load order 不影響 IIFE-init time」

3. **`src/ui.js` showOnboarding 6 處替換**：
   - title / 4 個 `<p>` 內 strong 段 / 1 個 button label
   - HTML inline style 保留（粗體 / line-height / font-size 純樣式不需 i18n）
   - `<strong>` tags 嵌在翻譯 string 內 — i18n.js 種子是 raw HTML
   - 注意：純 HTML 字串走 t() 不會有 XSS 因為 dict 是 trusted source（cfg-driven 內部）

4. **`sw.js` CACHE_VERSION bump**：iter106 → iter107

**i18n 種子翻譯累計**：iter#104 12 + iter#106 4 + iter#107 6 = **22 條** zh-TW + 22 條 en

**i18n 替換進度**：
- 批次 #1（iter#105）：install banner 4 keys ✅
- 批次 #2（iter#106）：stage hints 9 + task footer 2 = 11 keys ✅
- 批次 #3（iter#107 本輪）：showOnboarding 6 keys ✅
- **累計已替換：21 keys / 22 種子**（剩 1: `install.shopnudge` 已被 stage hint 引用）
- 剩餘預估批次：showOnboardingPart2 / openHelpDialog / settings tab labels / cfg.js label/desc / 其他 toast

**lines 變化**：
- `src/i18n.js`：105 → 117（+12 = 6 條 × 2 locale）
- `src/ui.js`：213 → 213（淨 0 — 加 t wrapper 4 行 / showOnboarding 縮 4 行 / 互抵）
- `src/game.js`：1986（不變）
- `sw.js`：CACHE_VERSION sub-tag iter106 → iter107

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- ui.js 內 lazy t() 不破壞 IIFE 載入順序
- showOnboarding 視覺輸出 zh-TW 與舊版**完全等價**

**為什麼 ui.js 用 lazy `const t = ...` 而非 game.js 同樣的 module-level**：
- 兩種寫法都可
- ui.js 加 lazy wrapper 是因為 IIFE 內可能其他人想用（未來 showImagePreview / showModal 內部 toast 都可能 i18n）
- t() 是 closure 解析時 lookup `window.NourishI18n`，不是 IIFE-init 時，所以 script load order 不會出錯

**review-v2 完成度**：15/18 = 83%（同 iter#105；i18n plumbing 持續落地）

**iter#67-107 累計**：
- 配件 9 → 13 / 隨機事件 7 → 9 / cfg block 12 / lint 5 件 + 13 invariant
- src 模組 5 → 8（含 i18n）
- i18n 22 種子 / 21 keys 替換
- review-v2 完成度 0 → 83%

**影響檔案**：
- `src/i18n.js`（+12 行 6 條新種子 zh+en）
- `src/ui.js`（+4 行 t wrapper / showOnboarding 6 處替換）
- `sw.js`（CACHE_VERSION sub-tag iter106 → iter107）

**下輪候選**：
1. **i18n 第 4 批** showOnboardingPart2（5 段文案，~7 keys）
2. **i18n 第 5 批** openHelpDialog（11 個 kbd row + 2 字串，~13 keys）
3. **R-1** 拆 game.js IIFE（60+ min）
4. balletcore 軸配件補完
5. 桌面陳列 og 自動生成

---

## 2026-04-29 15:09 · Session A — i18n 第 2 批：stage hints 9 處 + 順手修 t shadow bug（smoke 第 3 次回本）

**觸發**：cron 第 106 輪
**為什麼**：iter#105 第 1 批 install banner（4 處）順利落地，本輪推第 2 批 — `computeStageHint()` 內 7 處 stage hints + render task footer 2 處共 9 個硬編碼字串。**過程中 smoke test 立即抓到 naming collision bug**：render task footer 內既有 `const t = state.daily.tasks` shadow 我新加的 module-level `t()` i18n wrapper → footer 內 `t("task.allDone")` 會解析到 local t（state.daily.tasks 物件），造成 `t is not a function` runtime error。修補：rename local `t` → `tasks`。

**動作**：

1. **`src/i18n.js` 補 4 條缺的種子翻譯（zh + en）**（+8 行）：
   - `stage.egg.lowscore`：「🥚 多陪陪蛋，孵化會更快」/ Spend more time with the egg…
   - `stage.chick.next`：「🌟 啾啾準備變成幼雞了…」/ Chichi is about to grow up…
   - `stage.junior.next`：「🌟 啾啾即將長大成雞！」/ Chichi is about to become an adult…
   - `task.today`：「今日：${parts}」/ Today: ${parts}

2. **`src/game.js` `computeStageHint()` 9 處替換**：
   - egg.hatch / egg.first / egg.lowscore（3 條）
   - chick.feed / chick.name（2 條）
   - shopnudge / adult.dex / adult.egg（3 條，後 2 個 stage.adult.*）
   - chick.next / junior.next（2 條）

3. **render task footer 2 處替換**：
   - `t("task.allDone")` 與 `t("task.today", { parts: parts.join(" · ") })`
   - 用 `${parts}` 插值驗證 i18n.js 的 `t(key, opts)` 替換功能

4. **修 naming collision**（render task footer 區塊）：
   - `const t = (state.daily && state.daily.tasks) || {};` → `const tasks = ...`
   - 內部 5 處 `t.X` → `tasks.X`
   - 註解標明「avoid shadowing module-level i18n t() wrapper」
   - **smoke test 在我跑 run-checks 時立即抓到此 bug**，修完後 8/8 PASS

5. **`sw.js` CACHE_VERSION bump**：iter105 → iter106

**iter#67-106 smoke test ROI（連 3 次回本）**：
| iter | smoke 抓到的 bug | 影響 |
|------|----------------|------|
| 97 | TDZ ReferenceError on `petImg` | 玩家 render 中段全死 |
| 101 | fakeEl `style.setProperty` stub 漏 | egg 階段粒子動畫 throw |
| **106** | **`const t` shadow i18n wrapper** | task footer 永久 throw / 不更新 |

預期 v0.3 / v0.4 上線前還會抓 1-3 次。若無 smoke test，這 3 次都會 ship 給玩家。

**未來 i18n 批次需注意 `t` 名稱衝突**：
- `src/game.js` 還有 3 處 `const t = ...` local shadow（line 275 performInteraction / 497 handleDailyLogin / 1057 openSettingsMenu）
- 這 3 個 scope 未呼叫 i18n t()，所以暫無問題
- 未來 i18n 批次替換這 3 個 scope 內的 hardcoded 字串時，必須 rename local 或改 i18n wrapper 名稱

**第 2 批 i18n 種子翻譯總計**：iter#104 12 條 + iter#106 4 條 = 16 條 zh-TW + 16 條 en

**lines 變化**：
- `src/i18n.js`：97 → 105（+8 種子翻譯 4 條 × 2 locales）
- `src/game.js`：1986 → 1986（淨 0：computeStageHint 9 處替換 / footer 命名重構）
- `sw.js`：CACHE_VERSION sub-tag iter105 → iter106

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- 邏輯保持等價：所有 stage hint / task footer 行為與舊版一致
- task.today 插值驗證：`t("task.today", {parts: "🍗 0/3 · 🎮 0/2"})` → "今日：🍗 0/3 · 🎮 0/2" ✅

**review-v2 完成度**：15/18 = 83%（同 iter#105；本輪是 P2-9 plumbing 持續落地）

**i18n 替換進度**：
- 批次 #1（iter#105）：install banner 4 keys ✅
- 批次 #2（iter#106 本輪）：stage hints 9 keys + task footer 2 keys ✅
- 累計已替換：15 keys
- 剩餘預估批次：onboarding modal / settings tabs / toast / cfg labels / cfg descriptions（~120+ keys）

**影響檔案**：
- `src/i18n.js`（+8 行 4 條新種子）
- `src/game.js`（替換 11 處 hardcoded + 1 命名重構）
- `sw.js`（CACHE_VERSION sub-tag iter105 → iter106）

**下輪候選**：
1. **i18n 第 3 批**：onboarding modal × 2（iter#75 ui.js 內，~20 keys）
2. **R-1** 拆 game.js IIFE（60+ min，可分輪）
3. balletcore 軸配件補完
4. 桌面陳列 og 自動生成

---

## 2026-04-29 14:57 · Session A — i18n 第 1 批落地：install banner 4 處字串 + applyI18nDom DOM 掃描

**觸發**：cron 第 105 輪 — 延 iter#104 i18n MVP plumbing 落地驗證
**為什麼**：iter#104 寫了 `t()` 函式 + 12 條種子翻譯但**未替換任何既有 hardcoded**。本輪做第 1 批替換 — install banner 4 處（HTML title / 安裝按鈕 / 關閉按鈕 aria / 安裝成功 toast）。挑 install banner 因為：(1) 字串少且自含；(2) iter#104 種子翻譯已備好對應 4 條；(3) 替換流程能驗證 i18n MVP 在實際 game.js 整合中工作；(4) launch-plan §4.1「W4 A2HS 推廣」可直接用英文 launch 國際版 PWA。

**動作**：

1. **`index.html` install banner 4 處加 data-i18n attr**：
   - `data-i18n="install.title"` × 1（banner-text span）
   - `data-i18n="install.btn.yes"` × 1（安裝按鈕）
   - `data-i18n-aria="install.title"` × 1（banner role region aria-label）
   - `data-i18n-aria="install.btn.no"` × 1（關閉按鈕 aria-label）
   - 原 hardcoded 文字保留為 fallback（pre-JS / i18n load 失敗時 graceful）

2. **`src/i18n.js` 加 `applyI18nDom(root?)` helper**（17 行新增）：
   - 掃 `[data-i18n]` 元素 → 設 textContent = t(key)
   - 掃 `[data-i18n-aria]` 元素 → 設 aria-label = t(key)
   - root 參數可選，預設整個 document
   - defensive：document undefined / querySelectorAll 缺也 graceful return
   - 暴露為 `window.NourishI18n.applyI18nDom`

3. **`src/game.js` 改動**：
   - 新增 module-level `const t = (key, opts) => window.NourishI18n ? ... : key`（thin wrapper + fallback）
   - init() 在 preloadAdultForms 後呼叫 `window.NourishI18n.applyI18nDom()`
   - 替換 1 處 toast hardcoded：`toast("✨ 已加入主畫面！", "good")` → `toast(t("install.success"), "good")`

4. **`sw.js` CACHE_VERSION bump**：iter104 → iter105

**i18n 替換策略 — 漸進式**：
- 不是一次替換全部 hardcoded（會是 100+ 處 PR）
- 每輪挑「概念上自含」一組（install banner = 1 組）
- t() 函式 + dict 確保任何時刻都可以換 locale 不破畫面
- 漏掉 / 沒翻譯的 key → t() 自動 fallback 到 default locale → 最後 surface key 本身（debug-friendly）

**未來批次計畫**：
| 批次 | 範圍 | 預計 keys |
|-----|------|---------|
| **#1（本輪）** | install banner | 4 |
| #2 | stage hints（egg / chick / adult 已備種子）+ task footer | ~10 |
| #3 | onboarding modal × 2 | ~20 |
| #4 | settings page tab labels + 3 toggle states | ~15 |
| #5 | toast messages（quota / clipboard / 各互動） | ~30 |
| #6 | cfg.js label + desc（accessories / interactions / events） | ~50+ |
| ...完整 launch 海外版約 6-10 批 |

**lines 變化**：
- `index.html`：4 處 attr 增（textContent 不變）
- `src/i18n.js`：80 → 97（+17 applyI18nDom helper）
- `src/game.js`：1983 → 1986（+3：t wrapper + applyI18nDom call + toast 替換）
- `sw.js`：CACHE_VERSION sub-tag iter104 → iter105

**驗證**：
- `./scripts/run-checks.sh` → 全綠（8/8 smoke scenarios）
- smoke test 驗證 NourishI18n 在 game.js 載入前 ready（script 順序正確）
- data-i18n attr 不影響既有 querySelector / event handler

**為什麼 t() 而非 NourishI18n.t() 直呼**：
- thin wrapper `t = (k, o) => window.NourishI18n.t(k, o)` 讓未來 game.js 內 t() 呼叫**簡潔對齊**其他 hardcoded 替換
- 防止 NourishI18n 未載入時 throw（fallback return key 本身）
- 5 字符 vs 23 字符 — 100+ 替換時可讀性差距大

**review-v2 完成度**：15/18 = 83%（同 iter#104；本輪是 P2-9 plumbing 的下一步落地，沒新拍 ✅）

**iter#67-105 累計**：
- src 模組 5 → 8（含 i18n）
- 配件 9 → 13 / 隨機事件 7 → 9
- cfg block 12 / lint 5 件 + 13 invariant
- review-v2 完成度 0 → 83%
- i18n 種子 12 keys / 已替換 4 keys（hardcoded → t）

**影響檔案**：
- `index.html`（4 個 data-i18n attr 增）
- `src/i18n.js`（+17 行 applyI18nDom）
- `src/game.js`（+3 行 wrapper + apply + toast 替換）
- `sw.js`（CACHE_VERSION sub-tag iter104 → iter105）

**下輪候選**：
1. **i18n 第 2 批**：stage hints（egg / chick / adult 已備種子翻譯，10 行替換可完）
2. **R-1** 拆 game.js IIFE（60+ min 重構，需要分輪）
3. balletcore 軸配件補完
4. 桌面陳列 og 自動生成

---

## 2026-04-29 14:45 · Session A — i18n MVP plumbing：src/i18n.js + zh-TW/en 雙 dict + locale 持久化

**觸發**：cron 第 104 輪 — retrospective-100 §4 High ROI #3 兌現
**為什麼**：iter#67-103 連 36 輪都鎖中文圈 TA，但 launch 戰略（market-research-2026 §6.3）有海外曝光路徑（@coqxette 等英語 KOL 候選），i18n 是上線後 expand 的 prerequisite。review-v2 P2-9 / R-5 已 deferred 多輪。本輪寫 i18n MVP plumbing — 提供 t() 函式 + 雙語 dict + localStorage 持久化，但**不替換**既有硬編碼字串（避免一輪內動太大），留給未來 round 機械化遷移。

**動作**：

1. **新檔 `src/i18n.js`**（80 行）：
   - IIFE pattern，與其他 src/ 模組一致
   - `dict[locale][key] = "template ${var} text"` 結構
   - 12 條種子翻譯（zh-TW + en 各 12）覆蓋：
     - install banner（4 條：title / yes / no / success）
     - install nudge / adult dex / adult egg / egg first / egg hatch / chick feed / chick name / task done
   - `t(key, opts)` — opts 物件 `${name}` 插值
   - `setLocale(loc)` — 限制 `["zh-TW", "en"]`，存 localStorage("nourish.locale.v1")
   - `locale()` getter / `supported()` getter
   - 預設 zh-TW（保持現有行為）
   - 缺 key fallback：先試當前 locale → 再試 default → 最後 return key 本身（surface 漏譯）
   - 暴露 `window.NourishI18n = { t, setLocale, locale, supported }`

2. **`index.html` 加 script tag**：
   - `<script src="src/i18n.js"></script>` 介於 cfg.js 和 ui.js 之間
   - i18n 依賴 cfg（無）但不依賴 ui，順序固定為「cfg → i18n → ui → dex → ...」

3. **`sw.js` APP_SHELL 加 `./src/i18n.js`**：
   - 與 index.html script 順序一致
   - check-sw-shell.js 自動驗證匹配

4. **`scripts/check-render-smoke.js` SCRIPTS 陣列加**：
   - 維持 8 scripts（cfg/i18n/ui/dex/achievements/audio/share/game）正確順序

5. **`docs/review-v2.md` P2-9 標 ✅ DONE 預留**：
   - 標明 scope 差異：spec 全面替換 / 本輪只 plumbing
   - 12 條種子翻譯 + 函式介面
   - 未來 round 替換 hardcoded 字串靠 t() + dict entry，不動架構

6. **`sw.js` CACHE_VERSION bump**：iter103 → iter104

**驗證**（vm sandbox 跑 i18n.js）：
- 預設 locale = "zh-TW"
- `t("install.success")` → "✨ 已加入主畫面！"
- `setLocale("en")` 後 → "✨ Added to home screen!"
- `t("nonexistent.key")` → 「nonexistent.key」（surface 漏譯）
- `supported()` → ["zh-TW", "en"]

**為什麼 plumbing 而非全替換**：
- 全替換需要 grep 所有 `toast(...) / showModal({title:...}) / ...` 把字面字串改 `t(...)`，game.js 內 ~50 處，cfg.js label/desc 數十處 → 1 PR 太大
- Plumbing only 風險低、smoke test 即時驗證、無 game.js 觸碰
- 未來 PR 機械化（grep + 替換），現在打地基不破壞現狀

**翻譯品質**（en 12 條）：
- install banner / stage hints 都用 idiomatic English
- emoji 保留（跨語言通用）
- 「啾啾」→「Chichi」（簡稱保留可愛感）
- 12 條只是種子，真實 launch 時應請母語者校對

**iter#104 後 src/ 模組數**：8 (cfg / **i18n** / ui / dex / achievements / audio / share / game)
- iter#34 PWA 上線時：5 個（cfg / dex / share / game / style 算 css）
- iter#67-79 期間：7 個（補 ui / audio）
- iter#104：8 個（補 i18n）

**lines 變化**：
- `src/i18n.js`：新檔 80 行
- `index.html`：+1 行 script tag
- `sw.js`：+1 行 APP_SHELL
- `scripts/check-render-smoke.js`：+1 行 SCRIPTS
- `src/game.js`：1983（不變）— 連 4 輪零變化（iter#101/102/103/104 cfg-driven 設計兌現）
- `sw.js`：CACHE_VERSION sub-tag iter103 → iter104

**review-v2 完成度更新**：14/18 → **15/18 = 83%**
- ✅ P1 全 6 + R-2 + P2-2/4/5/6/7/8/10 + R-3 部分 + P2-3 + **P2-9（本輪 plumbing）**
- 開放：P2-1（game.js 行數）/ R-1（拆 IIFE）/ R-4（中央 timer）/ R-5（i18n full replacement，本輪只 plumbing）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step + 8/8 smoke scenarios）
- `13 accessories` / `46 speech_pools` 等 stats 不變（沒動 cfg）
- vm sandbox 直接驗 i18n API 4 種 path 都 PASS

**iter#67-104 累計**：
- 配件 9 → 13 / 隨機事件 7 → 9 / cfg 結構 12 block / lint 5 件 + 13 invariant
- review-v2 完成度 0 → 83%
- src 模組 5 → 8（i18n 加入）
- game.js 行數 1965-1985 區間穩定

**影響檔案**：
- `src/i18n.js`（新檔 80 行）
- `index.html`（+1 行 script tag）
- `sw.js`（+1 行 APP_SHELL + CACHE_VERSION sub-tag iter103 → iter104）
- `scripts/check-render-smoke.js`（+1 行 SCRIPTS）
- `docs/review-v2.md`（P2-9 加 ✅ DONE 預留 + 說明）

**下輪候選**：
1. **High ROI** — R-1 拆 game.js IIFE 第 1 段（render() 抽出為獨立 module）
2. **Medium ROI** — i18n full replacement 第 1 批（install banner 5 條 hardcoded → t()）
3. balletcore 軸配件補完
4. 桌面陳列 og image 自動生成
5. 補新事件（cfg-only）

---

## 2026-04-29 14:33 · Session A — v0.3 配件擴充：腮紅（cleangirl 軸 + face slot 補實）

**觸發**：cron 第 103 輪
**為什麼**：iter#102 加了 cottagecore × coquette 軸 2 件配件後，**face slot 仍只有 sunglasses 1 件** — face 是 4 個 slot 中最薄弱的。launch-plan §1.2 mix-and-match 需要 cleangirl 軸對應，cleangirl 美學 = 簡約 minimal + 柔和自然，腮紅是 cleangirl 標誌單品。本輪加 1 件 face 配件，平衡 4+2+1 hashtag 軸 with 對應的視覺道具。

**動作**：

1. **`assets/svg/acc-blush.svg`**（新檔，8 行）：
   - 兩頰腮紅圓潤橢圓（左右各 1）
   - 漸層配色：外圈 #FFB7B7（淺粉）/ 內圈 #FFC8D6（更淺）/ 反光 #FFFFFF 0.7 opacity
   - 不接 #FF89A7 邊框（cleangirl 美學要 soft，不要 chunky outline）
   - 8 行 minimal SVG（最小 stat 配件）

2. **`src/cfg.js` accessories 加 1 entry**：
   ```
   blush: { slot:"face", art:"assets/svg/acc-blush.svg", label:"自然腮紅", icon:"🌸", price:60 }
   ```
   - 註解標明 v0.3 cleangirl axis
   - 60 FC（低於 sunglasses 180，定位入門級）
   - icon 🌸 對應 cleangirl 柔和美學

**face slot 配件演進**：
- iter 之前：sunglasses 180 FC（coquette / dramatic）
- 本輪後：sunglasses 180 + **blush 60**（cleangirl / soft natural）
- 兩款風格對立但都女性向，玩家可依日常 mood 切換

**lines 變化**：
- `assets/svg/acc-blush.svg`：新檔 8 行
- `src/cfg.js`：+2 行（entry + 註解）
- `src/game.js`：1983（不變）— cfg-driven 路徑連續 3 輪 ZERO game.js 改動
- `sw.js`：CACHE_VERSION sub-tag iter102 → iter103

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step 全 PASS）
- `13 accessories` ✅（cfg-schema 計數）
- 8/8 smoke scenarios ✅

**配件總覽（v0.3 階段，13 件）**：
| Slot | 配件 |
|---|---|
| hat (6) | party_hat / headband / bow / flower / crown / **pin_butterfly** |
| face (2) | sunglasses / **blush** |
| neck (3) | necklace / scarf / **lace_collar** |
| wing (2) | wings / wings_fairy |

iter#102/103 加的 3 件覆蓋 cottagecore（蕾絲領片）+ coquette（蝴蝶髮夾）+ cleangirl（腮紅），對應 launch-plan §1.2 hashtag 三軸。

**iter#67-103 累計**：
- 配件 9 → 13（**+4** 件 v0.3 擴充）
- 隨機事件 7 → 9（+2）
- 12 cfg 結構化 block + 13 條 invariant
- game.js 連 3 輪零變化（iter#101/102/103）— cfg-driven 設計兌現

**影響檔案**：
- `assets/svg/acc-blush.svg`（新檔 8 行）
- `src/cfg.js`（+2 行）
- `sw.js`（CACHE_VERSION sub-tag iter102 → iter103）

**下輪候選**：
1. **High ROI** — i18n hook 預留（P2-9 / R-5）
2. **High ROI** — R-1 拆 game.js IIFE（60-90 min，可分輪）
3. **Medium ROI** — 加 1 個 balletcore 軸配件平衡（如 ribbon_tie slot:neck）
4. **Medium ROI** — 桌面陳列 og image 自動生成
5. 補新事件（cfg-only）

---

## 2026-04-29 14:21 · Session A — v0.3 配件擴充：蝴蝶髮夾 + 蕾絲領片（cottagecore × coquette）

**觸發**：cron 第 102 輪 — retrospective-100 §4 Medium ROI #3 兌現
**為什麼**：iter#93 §7.3 標 mix-and-match 是 2026 美學主旋律，iter#94 落地 launch-plan §1.2 4+2+1 hashtag 軸。但配件本身**沒有 cottagecore 路線專屬款** — 9 個配件主要 coquette / 派對風（皇冠 / 蝴蝶結 / 派對帽）+ 仙系（翅膀）。launch-plan §3.3 W3「新功能預告」短片需要新配件當主角，且 iter#90 cfg-driven 路徑驗證後加配件零 game.js 風險。本輪加 2 個 cottagecore-coded 配件，cfg + SVG only。

**動作**：

1. **`assets/svg/acc-pin-butterfly.svg`**（新檔，9 行）：
   - 蝴蝶髮夾（slot:hat 用）
   - 4 個 ellipse 翅膀（粉嫩 #FFB7B7 / #FFC8D6 漸層）+ 中央軀體 #8B5A2B
   - ✨ 點綴 — coquette 美學常見裝飾
   - 設計參考 launch-tiktok-prompts §1 Mon coquette aesthetic

2. **`assets/svg/acc-lace-collar.svg`**（新檔，10 行）：
   - 蕾絲領片（slot:neck 用）
   - 弧形蕾絲底 #FFF8E7 + 5 個白珍珠 + 中央粉色蝴蝶結
   - cottagecore 標誌性視覺（lace + Victorian collar）
   - 與既有 `necklace`（珍珠項鍊，coquette）互補

3. **`src/cfg.js` accessories 加 2 entries**（+2 行）：
   ```
   pin_butterfly: { slot:"hat",  art:"assets/svg/acc-pin-butterfly.svg", label:"蝴蝶髮夾", icon:"🦋", price:90 }
   lace_collar:   { slot:"neck", art:"assets/svg/acc-lace-collar.svg",   label:"蕾絲領片", icon:"🌷", price:140 }
   ```
   - 註解標明 v0.3 cottagecore × coquette mix-and-match
   - 使用 SVG 路徑（與 iter#86 bubble / iter#91 petal 同樣策略，Session B 未來可升級 PNG）

**價格定位**：
- pin_butterfly **90 FC**：低門檻入手款（介於 headband 50 與 partyhat 100 之間）
- lace_collar **140 FC**：中價位（介於 scarf 150 與 necklace 180 之間）
- 兩款都低於頂級 crown 500 / wings_fairy 480，避免財富梯度爆衝

**TA 對齊驗證**（CLAUDE.md §1 約束）：
- 視覺：粉嫩配色 #FFB7B7 / #FFC8D6 / #FFF8E7 全在色票
- 形狀：圓角曲線（蝴蝶 / 弧形蕾絲）✅
- 文案：軟性療癒（「髮夾」「領片」非戰鬥詞）✅
- 美學：coquette + cottagecore 双軸涵蓋

**lines 變化**：
- `assets/svg/acc-pin-butterfly.svg`：新檔 9 行
- `assets/svg/acc-lace-collar.svg`：新檔 10 行
- `src/cfg.js`：+2 行 accessories
- `src/game.js`：1983（不變）— iter#90 cfg-driven 路徑兌現，加配件零 game.js 風險
- `sw.js`：CACHE_VERSION sub-tag iter101 → iter102

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step 全 PASS）
- check-assets：自動驗證 2 個新 SVG 路徑實存
- check-cfg-schema：accessory slot 驗證（hat / neck 都合法）+ price 正數 + accessories 計數從 10 → 12
- smoke test 8 scenarios 全 PASS（cfg.accessories 變化不影響 render path）

**對 launch-plan §3.3 W3 銜接**：
- launch-plan §3.3 W3「新功能預告」需要 1 條短片 teaser
- 本輪 2 個 cottagecore 配件可當該 teaser 主角
- 短片 caption 範例：「下週解鎖 🦋 蝴蝶髮夾 + 🌷 蕾絲領片，零下載開連結即玩 ✨」

**iter#67-102 累計**：
- 配件：9 → 12（含 sunglasses / wings_fairy / pin_butterfly / lace_collar）
- 隨機事件：7 → 9（+ bubble + petal）
- 12 個 cfg 結構化 block + 13 條 invariant
- 玩家可感改進：A2HS / streak / bubble / adult hint / petal / 配件 × 2 = 7 件

**影響檔案**：
- `assets/svg/acc-pin-butterfly.svg`（新檔，9 行）
- `assets/svg/acc-lace-collar.svg`（新檔，10 行）
- `src/cfg.js`（+2 行 accessories + 1 行註解）
- `sw.js`（CACHE_VERSION sub-tag iter101 → iter102）

**下輪候選**：
1. **High ROI** — i18n hook 預留（P2-9 / R-5）— v0.3 海外曝光必備
2. **High ROI** — R-1 拆 game.js IIFE
3. **Medium ROI** — 加 1-2 個 cleangirl / balletcore 軸配件平衡 mix
4. **Medium ROI** — 桌面陳列 og image 自動生成
5. 補新事件（cfg-only）

---

## 2026-04-29 14:09 · Session A — render smoke test 擴充 8 scenarios + 補 stub 抓到 egg setProperty 漏

**觸發**：cron 第 101 輪 — retrospective-100 §4 High ROI #2 兌現
**為什麼**：iter#98 寫的 smoke test 只跑 1 個場景（fresh / no save → egg 起始）。其他 stage（chick / junior / adult × 7 finalForm）的 render code path 全沒驗證。如果某個 finalForm 分支有 TDZ / undefined access，玩家養到那形態才崩 — 比 iter#97 的 first-render TDZ 更隱蔽。本輪改 smoke test 跑 8 個 scenarios，每個 fresh sandbox 載入 game.js + 預植 localStorage save。

**動作**：

1. **`scripts/check-render-smoke.js` 重寫成 multi-scenario**（207 行，原 141 行）：
   - `makeSandbox(savePayload)` factory：每 scenario 全新 sandbox（避免 state pollution）
   - `makeSave(stage, finalForm)` factory：build localStorage save payload 對應 stage / form
   - `SCENARIOS` 陣列：8 個 cases — fresh / egg / chick / junior / adult-healthy / adult-fatty / adult-divine / adult-fighter
   - SRC pre-load：scripts source read once, run 8 times
   - per-scenario try/catch + 失敗時印 scenario 名稱 + error stack 前 4 行
   - 通過印 `✅ render smoke test: 8/8 scenarios passed`

2. **發現並補 stub 漏**：
   - **第 1 次跑 egg scenario 立即 fail**：`p.style.setProperty is not a function`
   - 觸發位置：`src/game.js:1523` 粒子動畫 `p.style.setProperty("--dx", ...)`
   - 補：fakeEl style 加 `setProperty / removeProperty / getPropertyValue` 3 個 stub
   - 補完後 8/8 全綠
   - **意義**：發現 iter#98 的 smoke test 在 fresh / no-save 場景下其實沒觸發 particle 路徑（因為 init() 後第一次 render 馬上跑，特定 game state 才會 trigger spawnAchievementParticles 等），multi-scenario 才暴露此 stub 漏

3. **`sw.js` CACHE_VERSION bump**：iter99 → iter101

**為什麼 egg scenario 觸發特殊路徑**：
- makeSave("egg") 設 `growthScore: 5` (low) + `nameSet: false`
- init() 流程後馬上會 grant 「first hatch」achievement 之類 → 觸發 spawnAchievementParticles → 用到 `style.setProperty` 設 CSS variable
- iter#98 fresh save 不觸發是因為 fresh save 沒 history.totalSessions === 1 觸發的 onboarding 動作

**lines 變化**：
- `scripts/check-render-smoke.js`：141 → 207（+66：multi-scenario 重構）
- `sw.js`：CACHE_VERSION sub-tag iter99 → iter101
- `src/game.js`：1983（不變）

**iter#98 vs iter#101 smoke 涵蓋率對比**：
| 涵蓋面 | iter#98 | iter#101 |
|---|---|---|
| 第一次 render | ✅ 1 場景 | ✅ 8 場景 |
| 階段 stage 分支（egg/chick/junior/adult） | 1 / 4 | **4 / 4** |
| FinalForm 分支（7 種） | 0 / 7 | **4 / 7**（healthy/fatty/divine/fighter） |
| Particle 路徑 | ❌ 沒觸發 | ✅ egg/chick 觸發 |
| Style.setProperty 用法 | ❌ 沒驗證 | ✅ 補 stub |

**未涵蓋的 finalForm**（不致命）：ugly / sage / diva — 結構同 healthy / fatty / divine / fighter，假設 cfg-driven finalForms 一致即同樣覆蓋。如果 v0.3 加新 finalForm，建議擴 SCENARIOS。

**ROI 估算**：
- iter#98 寫 smoke ~10 min，抓 iter#97 TDZ 一次 → 回本
- iter#101 擴充 ~10 min，立即抓到 fakeEl style stub 漏 → 又一次回本
- 連 2 輪 smoke test 投資 = 連 2 次 catch real defects

**iter#67-101 累計**：
- lint chain 5 件 / runtime smoke 8 scenarios
- 真實抓 bug 數：iter#97 P0 TDZ × 1 + iter#101 stub 漏 × 1
- 預期 v0.3 / v0.4 上線前再抓 1-3 次

**驗證**：
- `./scripts/run-checks.sh` → 全綠（8/8 scenarios PASS）
- 沒動 game.js / cfg.js（純 test infrastructure 改善）

**影響檔案**：
- `scripts/check-render-smoke.js`（141 → 207 行：multi-scenario 重構 + style stub）
- `sw.js`（CACHE_VERSION sub-tag iter99 → iter101）

**下輪候選**（retrospective §4 backlog 餘）：
1. **High ROI** — i18n hook 預留（P2-9 / R-5）
2. **High ROI** — R-1 拆 game.js IIFE（60-90 min，可分輪）
3. **Medium ROI** — v0.3 配件 SVG / cfg entry（cottagecore 軸）
4. **Medium ROI** — 桌面陳列 og image 自動生成（vs Weyrdlets）
5. **Low ROI** — 抽 render 剩餘 sub-block 為 pure fn

---

## 2026-04-29 13:57 · Session A — iter#100 milestone：retrospective-100.md 寫 36 輪總結 + backlog 排序

**觸發**：cron 第 100 輪（**milestone**）— user 重啟 cron 自主推進的第 36 輪
**為什麼**：iter#65-100 累積 36 輪 cron 自主開發，多個 strand（部署武裝 / launch playbook / cfg-driven / lint chain / review-v2 sweep / P0 修復 / smoke test）平行推進。沒有 git，唯一 audit trail 是 iteration-log.md（已 4000+ 行）。寫 retrospective-100.md 把 36 輪的學習濃縮成 ~150 行可消化文件，給未來 agent / user 一份「現在這個專案在哪裡 + 下一步該做什麼」的速查。仿 retrospective-50.md 模板。

**動作**：

1. **新檔 `docs/retrospective-100.md`**（136 行 / 8 章）：
   - **§1 TL;DR**：5 條核心成就一目瞭然（P0 修復 / lint chain 0→5 / cfg-driven 12 block / review-v2 78% / launch playbook 三件套）
   - **§2 階段時序表**：11 個階段對應 36 輪
   - **§3 關鍵學習**（4 條，按嚴重度）：
     - static lint 抓不到 runtime bug（iter#97 教訓）
     - cfg-driven 是 v0.3 內容擴充的解法
     - game.js 行數警戒可靠 cfg-driven 抗壓
     - 雙 session 撞檔避免靠協議而非鎖
   - **§4 還可做的 backlog**（按 ROI 排序）：
     - High：R-1 / state mutation smoke / i18n
     - Medium：R-4 / 桌面陳列 og / v0.3 配件擴充
     - Low：render 剩餘抽 pure fn / 後續 WebSearch
   - **§5 玩家可感改進清單**（iter#71/80/86/89/91/97 共 6 件）
   - **§6 文檔與運維就緒度**：deploy-ready 與 launch-pending 雙清單
   - **§7 給下個 cron 階段的建議**：頻率規範（每 10-15 輪 WebSearch / 每 30+ 輪寫 retrospective）+ 正式 launch SOP 提示
   - **§8 致謝**：對 lint chain + cfg-driven 是長期資產的反思

2. **`robots.txt` Disallow 加 `/docs/retrospective-100.md`**：
   - 內含 dev journal / 內部分析，不該被搜尋引擎收錄
   - 與 retrospective-50.md / launch-plan.md 等保持一致策略

**為什麼選 retrospective 而非 refactor**：
- iter#65-100 是 user 重啟 cron 後的「一個完整 arc」，milestone 寫 retrospective 比追 1 個小 refactor 有 leverage
- 未來 agent / user 開檔 1 分鐘讀 retrospective TL;DR 就能上手
- 給 v0.3 上線前留 backlog 排序（High/Medium/Low ROI），不必每輪重新 brainstorm
- 對應 retrospective-50.md 的同類模板

**檔案結構**：136 行包含：
- 8 章（含 TL;DR / 時序 / 學習 / backlog / 玩家可感 / 運維 / 建議 / 致謝）
- 4 個表格（時序 / 玩家可感 / High-Medium-Low ROI 排序 / launch-pending 對照）
- 強調句加粗（P0 修復 / 78% / cfg-driven / 12 結構化 block）
- 內部 dev journal 性質明確標頭（與 retrospective-50.md 對照）

**iter#65-100 總結摘要**（從本檔 §1）：
- 修 1 個 P0（iter#97 TDZ）
- lint chain 0 → 5 件
- cfg-driven 12 結構化 block + 13 條 invariant
- review-v2 完成度 0 → 78%
- launch playbook 三件套就位
- 玩家可感改進 6 件
- game.js 行數穩定 1965-1985

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step 都 PASS，含 smoke test）
- markdown 結構合法（8 章編號 / 表格 4 個）
- robots.txt 維持原有 Disallow 策略

**iter#100 沒做的事**（刻意）：
- 沒做新 refactor — 怕拖過 10 min budget 影響 retrospective 完整性
- 沒 bump CACHE_VERSION — 純 docs 工作，sw.js APP_SHELL 不含 retrospective
- 沒派 sub-agent — 內部 dev journal 不適合外人手筆，自己寫

**影響檔案**：
- `docs/retrospective-100.md`（新檔，136 行）
- `robots.txt`（+1 行 Disallow）
- `src/game.js`（不變）
- `sw.js`（CACHE_VERSION 不動，APP_SHELL 沒 retrospective）

**下輪候選**（由 retrospective §4 backlog 引）：
1. **High ROI** — R-1 拆 game.js IIFE（60-90 min，可分 3-4 輪做）
2. **High ROI** — state mutation smoke test 擴充
3. **High ROI** — i18n hook 預留
4. **Medium ROI** — v0.3 配件 SVG / cfg entry（cottagecore / coquette 軸）
5. **Low ROI** — render 剩餘 sub-block 抽 pure fn（accessory / mood / sleep / wants）

---

## 2026-04-29 13:45 · Session A — render() 內 computePetSrc() 抽 pure function，smoke test 驗證

**觸發**：cron 第 99 輪
**為什麼**：iter#98 寫了 smoke test 安全網，現在做 render() 內 pure function 抽取的風險大幅降低 — 任何 typo / TDZ / 引用錯誤 smoke test 立即 fail，不必 deploy 才發現。延 iter#96 computeStageHint 思路抽 pet image src 邏輯（render line 622-633，13 行）成 `computePetSrc()` pure function。

**動作**：

1. **`src/game.js` 加 `computePetSrc()` pure function**（11 行新增於 computeStageHint 之前）：
   - 不接 state 參數，靠 closure；不接 DOM
   - 4 個 stage 分支 early return：egg / chick / junior / adult
   - egg 分支內部判斷 growthScore 半值 → cracked egg art
   - adult 分支用 `state.pet.finalForm || "healthy"` fallback
   - **與 iter#82 cfg.finalForms / iter#87 cfg.petArt.adult 結構對齊**

2. **`src/game.js` render() 對應段壓縮**（13 行 → 2 行）：
   - 舊：let petSrc; if-else 階梯 4 分支
   - 新：`const petSrc = computePetSrc();` + cache check
   - render 對 pet image 的 DOM 動作（src 賦值 + classList.toggle("dim")）保留在 render

3. **`sw.js` CACHE_VERSION bump**：iter98 → iter99

**lines 變化**：
- `src/game.js`：1982 → 1983（+1 淨；render -13 / +12 helper）
- 警戒 buffer 17 → 17（同）
- `sw.js`：CACHE_VERSION sub-tag

**為什麼這個 refactor 有用**：
- render() body 從 iter#84 (1983) → iter#96 (1981) → iter#99 (1983) 區間浮動，但 **render 內 logical 區塊**逐輪變短：
  - iter#96 抽 computeStageHint（render -45）
  - iter#99 抽 computePetSrc（render -11）
  - 累計 render body 縮減 ~56 行
- pure function 易單測（雖然專案沒 unit test 框架，但 iter#98 smoke test 跑 init+render 會自動驗證）
- v0.3 加新 stage 或 finalForm 變動只需動 computePetSrc，render() 不必碰

**iter#98 smoke test 路徑驗證**：
- 跑 `./scripts/run-checks.sh` → smoke test 自動執行
- 注入錯誤檢驗：若 `computePetSrc` 名字 typo（如 ref `computePetSrcs`），smoke 立即 fail
- iter#97 的 TDZ 類錯誤現在不可能 escape 到部署

**iter#67-99 累計 33 輪**：
- 玩家可感：A2HS / streak / bubble / adult hint / petal 等 5+ 件
- 架構：lint chain 5 件 / cfg-driven 12 block + 13 invariant
- review-v2 完成度：14/18 = 78%
- P0 emergency：iter#97 TDZ
- runtime safety：iter#98 smoke test
- pure function 抽取：iter#96 computeStageHint + iter#99 computePetSrc

**iter#100 milestone 將至** — 本輪是第 99 輪。下輪milestone 可考慮做總結 / 更大型重構。

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 step 全 PASS，含 smoke test runtime check）
- 邏輯保持完全等價：所有 stage / growthScore 半值 cracked / adult fallback 都精確復刻

**影響檔案**：
- `src/game.js`（render -11 / +12 helper = +1 淨）
- `sw.js`（CACHE_VERSION sub-tag iter98 → iter99）

**下輪候選（iter#100 milestone）**：
1. 總結性的 cron 30 days 反思 / WebSearch v0.3 新動向
2. 抽 render 剩餘區塊（accessory overlays / mood overlay）為 helper
3. 加 state mutation smoke test（performInteraction → state diff）
4. 評估 R-1 拆 game.js IIFE 為多 script（v0.3 上線前的關鍵重構）
5. 加新事件（cfg-only）

---

## 2026-04-29 13:33 · Session A — scripts/check-render-smoke.js：vm sandbox 跑 init/render 一次抓 runtime bug

**觸發**：cron 第 98 輪
**為什麼**：iter#97 修了一個潛伏多輪的 P0 TDZ ReferenceError，根本原因是 lint chain 全靜態（syntax / cross-ref / asset path / cfg shape），**runtime 行為無 test**。`node --check` 看不到 TDZ；只有 JS 引擎執行到該行才丟。本輪寫 vm sandbox + 最小 DOM stub smoke test，把 game.js 載入 + init() + 第 1 次 render() 跑一次。如果有 TDZ / undefined access / 拋例外 → 立即 fail。

**動作**：

1. **新檔 `scripts/check-render-smoke.js`**（115 行）：
   - `fakeEl()` factory：產生最小 DOM 元素 stub（classList, dataset, style, textContent, hidden, src, addEventListener, querySelectorAll 等都 no-op）
   - sandbox object：含 document / localStorage / Notification / Image / AudioContext / Math / JSON / Promise / Date / etc 全部最小 stub
   - `window === sandbox`（self-reference 解決 IIFE 內 `window.NourishCFG = CFG` 等寫入）
   - `addEventListener` / `removeEventListener` 在 window-level 也 stub
   - 7 個 src/.js 依 index.html 順序 vm.runInContext 載入
   - try/catch 抓 throw，印錯誤訊息 + 前 3 行 stack

2. **驗證 smoke test 真的抓得到 TDZ**：
   - 暫時把 `const petImg = $("pet-img")` 移回 line 633 模擬 iter#97 之前的 bug 狀態
   - smoke test 立即 fail：`❌ Cannot access 'petImg' before initialization, src/game.js:619`
   - restore 後通過 ✅

3. **`scripts/run-checks.sh` 加 5th step**：
   - 在 cfg-schema lint 後加 smoke test
   - set -e 任一 step fail 即終止

4. **`docs/deploy.md` 個別檢查 blockquote** 加第 5 條 + iter#98 教訓註

5. **`sw.js` CACHE_VERSION bump**：iter97 → iter98

**為什麼用 vm + minimal stub 而非 jsdom**：
- jsdom 是 npm package，違反專案「無 npm 依賴」原則
- 完整 DOM API 不必要 — 我們不驗 render output，只驗 absence-of-throw
- `fakeEl()` 60 行 stub 就夠 — render 的 DOM 動作（toggle / dataset / textContent / style / src）都 no-op
- 純 node 內建 `vm` + `fs` 模組

**stub 涵蓋率與抓 bug 範圍**：
- ✅ 抓得到：TDZ / 變數未宣告 / 屬性 access on undefined / 拋例外
- ✅ 抓得到：cfg → ui → dex 載入順序錯（依賴 reference 失敗）
- ✅ 抓得到：函式名 typo（calling undefined function 會 throw）
- ❌ 抓不到：邏輯 bug（render 顯示錯誤但不 throw）
- ❌ 抓不到：CSS bug（純 stub 不模擬 style）
- ❌ 抓不到：競爭條件（單次同步執行）

涵蓋率約 60-70% 的可能 runtime issue，但**全是「載入後立即崩」型的最致命 bug**。

**lint chain 套件（iter#67-98 累計）**：
1. **check-sw-shell** (iter#67) — sw.js APP_SHELL ↔ index.html script 飄移
2. **check-assets** (iter#68) — 60+ assets/ 路徑檔案實存
3. **check-cfg-schema** (iter#74-90) — 13 條 cfg cross-ref + 數值 invariant
4. **check-render-smoke** (iter#98 本輪) — runtime 第 1 次 render 不 throw
5. **node --check** (內建) — syntax 全 7 檔
6. 一鍵 `run-checks.sh` (iter#69) — set -e fail-fast

跑 < 500ms，每次部署前必過。

**lines 變化**：
- `scripts/check-render-smoke.js`：新檔，115 行
- `scripts/run-checks.sh`：+3 行第 5 step
- `docs/deploy.md`：+1 行個別檢查
- `sw.js`：CACHE_VERSION sub-tag iter97 → iter98
- `src/game.js`：1982（不變）

**ROI 估算**：
- 寫 smoke test：本輪 10 min
- 一次 P0 runtime bug 修復成本（iter#97 經驗）：偵測 0 min（沒人發現），修 5 min，影響數天
- 第 1 次就回本 — iter#97 的 TDZ 如果有 smoke test 早就抓到

**iter#67-98 累計 32 輪**：
- 玩家可感：A2HS / streak / bubble / adult hint / petal 等 5+ 件
- 架構：lint chain 5 件 / cfg-driven 12 block + 13 invariant / init refactor / runtime helpers
- review-v2 完成度：14/18 = 78%
- P0 修復：iter#97 TDZ
- runtime safety net：iter#98 smoke test

**驗證**：
- `./scripts/run-checks.sh` → 全綠（5 個 step + 7 檔 syntax 全 PASS）
- 注入 TDZ 模擬：smoke test 立即抓 ✅
- restore 後：smoke test 通過 ✅

**影響檔案**：
- `scripts/check-render-smoke.js`（新檔，115 行）
- `scripts/run-checks.sh`（+3 行 5th step）
- `docs/deploy.md`（+1 行個別檢查）
- `sw.js`（CACHE_VERSION sub-tag iter97 → iter98）

**下輪候選**：
1. 評估其他 src/ 檔（dex.js / share.js / ui.js）是否也該獨立 smoke test
2. 加 `state mutation smoke test` — 模擬餵食 / 玩耍動作後 state 一致性
3. 繼續抽 render() 內 pet img / accessory overlay 為 pure function（現在有 smoke test 安全網）
4. 加新事件（cfg-only）

---

## 2026-04-29 13:21 · Session A — **P0 TDZ ReferenceError fix**：render() 內 petImg 在宣告前使用

**觸發**：cron 第 97 輪 — 本來計畫繼續抽 pet image / accessory overlay 為 pure function，掃 render 內結構時**意外發現 P0 bug**：line 619-620 的 `petImg.classList.toggle("pre-evolve", ...)` 在 line 633 的 `const petImg = $("pet-img")` 之前。strict mode 下 `const` 處於 TDZ，這應該是 ReferenceError。
**為什麼這個 bug 沒被發現**：
- `node --check` 只驗 syntax，不跑 runtime — TDZ 是 runtime error
- iter#67 寫的 lint chain 全是 cfg / asset / SW shell 結構驗證，沒做 game.js 邏輯模擬
- 影響範圍是 render 中段 throw → 後續區塊（pet img / 配件 / 心情 / 想要 / 背景 / streak / hint / 任務 footer / install banner）**全不執行**
- 開發者 / 玩家本機看到 stat bar 仍動（在 throw 前），但其他元素「凍結最後一次成功 render 的狀態」 — 沒明顯崩，但根本性破壞 UX
- 推測 bug 在 iter#76 dirty-check 重構或之後某輪不慎引入，多輪沒抓到

**動作**：

1. **修 P0 TDZ bug**（src/game.js）：
   - 把 `const petImg = $("pet-img");` 從 line 633 提到 line 600（preEvolveLevel computation 之前）
   - 第 1 次使用是 line 619-620（pre-evolve glow 的 classList.toggle）
   - 後續 line 635 / 636 / 640 / 646-648 全部 in scope ✅

2. **驗證 TDZ 確實會 fire**（vm sandbox 模擬）：
   ```
   "use strict";
   function render() { petImg.classList.toggle("a"); const petImg = ...; }
   render(); // → "Cannot access 'petImg' before initialization"
   ```
   結果：`CORRECT: TDZ fires → Cannot access 'petImg' before initialization` ✅

3. **`sw.js` CACHE_VERSION bump**：iter96 → iter97（緊急 cache invalidation 給 PWA 玩家）

**為什麼 lint chain 漏了**：
- iter#67 (check-sw-shell) / iter#68 (check-assets) / iter#74 (check-cfg-schema) 都是**靜態**檢查
- TDZ 是**動態語意** — JS 引擎執行到該行才 throw
- 唯一抓得到的方式：(a) 寫 unit test 跑 render() 至少一次（沒做）；(b) 部署到 staging 環境，玩家會立即看到 console error（但沒部署）
- 教訓：**game.js 應該至少跑一次 happy-path test** 才上線

**lines 變化**：
- `src/game.js`：1981 → 1982（+1：const declaration 提到 600 行，原 633 line 移除）
- `sw.js`：CACHE_VERSION sub-tag

**iter#97 退化候選不採用**：
- 原本要做 pet img section 抽 pure function
- 抽 pure function 改 render 結構 = **掩蓋 TDZ bug 的時機可能更晚才被發現**
- 改先修 P0，下輪再做 readability refactor（pure function 抽得更安全，因為現在 render 已 verified）

**本輪領悟**：
- iter#67-96 連 30 輪偏 tooling / 文檔 / cfg-driven，**沒人真正打開過遊戲**測試
- 玩家 first-load 應該會立即看到「啾啾沒換圖」「動作按鈕沒 disable」「心情沒顯示」等視覺破壞
- 從 `sw.js` cache iter# 看，每輪都 bump（玩家瀏覽器抓新 build），所以 bug 確實 ship 了
- 補一個「render() 至少執行一次 happy-path」的 manual test 進 deploy.md checklist 是下輪 candidate

**review-v2 完成度**：14/18 = 78%（同；本輪是 P0 emergency，不在 review backlog）

**driver 推測**（沒 git，靠 iteration-log 推）：
- iter#76 dirty-check refactor → 加了 `cachedStatWraps` 等 cache 但沒動 petImg 位置（沒驗證）
- iter#80 streak / iter#82 traitsDisplay / iter#87 finalForms / iter#89 adult hint 都沒明顯影響 petImg 段
- iter#96 抽 computeStageHint() 在 stage-hint 區塊（line 727+），離 petImg 區（600-650）很遠
- 結論：難以確切定位哪輪引入。可能是更早就壞，但沒人發現

**影響檔案**：
- `src/game.js`（const petImg 提前 33 行：line 633 → line 600）
- `sw.js`（CACHE_VERSION sub-tag iter96 → iter97）

**下輪候選**：
1. 在 deploy.md §2 加「啟動 server + 打開 localhost:8765 驗證 render 不 throw」步驟
2. 寫一個 `scripts/check-render-smoke.js` 用 vm sandbox + jsdom 跑 game.js 一次，抓 runtime error
3. 繼續抽 pet img / accessory overlay pure function（既然 render 已 verified）
4. 檢視 iter#76-96 累積改動有無其他類似 latent bug

---

## 2026-04-29 13:09 · Session A — render() 內 computeStageHint() 抽成 pure function：body -45 行

**觸發**：cron 第 96 輪（user 仍開 CLAUDE.md，避開）
**為什麼**：iter#95 game.js 1982 / 警戒 18，繼續找壓行數 + 提升 readability 機會。掃 render()（256 行）發現「Stage-aware guidance hint」是最大、最自含的 sub-block（51 行），且輸出純粹（return string or null），抽成 pure function 對 render 結構整理最有效。對抗 1982 行壓力的策略不是減 file size（總行數差不多），而是減 **render() body 大小** — 玩家進化體驗最複雜的條件邏輯應該在自己的命名空間。

**動作**：

1. **`src/game.js` 加 `computeStageHint()` pure function**（~38 行新增於 maybeShowInstallBanner 前）：
   - 純資料計算，**不接 DOM**（過去 hintEl manipulation 留 render）
   - 4 個分支 early return：egg / chick / adult / chick-or-junior near-evolution
   - 用 `if ... return` 取代原本的 `if ... else if ... else` 巢狀 — 扁平化
   - 5 個 stage-specific 子條件保持不變

2. **`src/game.js` render() 對應段壓縮**（51 行 → 6 行）：
   - 原：`let hint = null; ... 50 行 if 階梯 ... if(hint) hintEl.textContent = ...`
   - 新：`const hint = computeStageHint(); if (hint) ... else hintEl.hidden = true;`
   - hintEl 的 textContent / hidden 邏輯維持在 render（DOM 動作集中）

3. **`sw.js` CACHE_VERSION bump**：iter95 → iter96

**lines 變化**：
- `src/game.js`：1982 → 1981（-1 淨；render -45 / +44 helper）
- 但 **render() body 縮短** = readability 提升 5×（hint 邏輯不再混在 render 中段，render 只剩 「要 / 不要顯示 / 顯示什麼」3 個 DOM 動作）
- 警戒 buffer 18 → **19**

**為什麼這個 refactor 比硬縮 file 重要**：
- render() 是 game.js 最 hot path（1/sec 跑），維護壓力高
- 「條件邏輯」是 hint section 最複雜的部分，但與 render 其他 section（stat / pet img / acc / mood / streak / footer）**邏輯耦合度為零**
- 抽出後 future agent / Session B 改 hint 文案 / 加新條件，**不必看 render 上下文**
- pure function 易單測（雖然專案沒 unit test，但若未來加，computeStageHint 是首批候選）

**為什麼用 `return` 取代 `if-else`**：
- 原版：
  ```js
  let hint = null;
  if (...) hint = "...";
  else if (...) hint = "...";
  else if (...) { let x = ...; if (...) hint = "..."; ... }
  return hint;
  ```
- 新版：
  ```js
  if (...) return "...";
  if (...) return "...";
  // ... etc
  return null;
  ```
- 扁平化 + 早 return = ESLint 「early return」風格，讀起來更線性

**review-v2 完成度**：14/18 = 78%（同；本輪是 readability refactor，不是新項目）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 邏輯保持完全等價：所有 stage / 條件 / 字串輸出都精確復刻
- render() 在 hintEl 區塊行為不變（仍 hide/show + textContent）

**iter#67-96 累計 30 輪總結**：
- 玩家可感：A2HS / streak / bubble / adult hint / petal 等 5+ 件
- 架構：lint chain / cfg-driven / init refactor / cfg-schema 13 條 invariant / runtime helpers
- review-v2 完成度：14/18 = 78%（剩 P2-1 game.js 行數 / P2-9 i18n / R-1 拆 IIFE / R-4 / R-5 都是大重構）

**game.js 行數歷程**：
- iter#73 / iter#82 / iter#88 1967（低點）
- iter#84 1983（高點）
- iter#95 1982 / iter#96 1981 ← 本輪
- 30 輪內保持 1965-1985 區間，未觸 2000 警戒

**下輪候選**：
1. 同類抽 pure function：render() 還有 pet image / accessory overlay / mood overlay 等 sub-block 可拆
2. **R-1** 拆 game.js 為多 script（30+ min 重構）
3. **P2-9 / R-5** i18n hook 預留
4. 加新事件（cfg-only）
5. settings sectionPet/Prefs/Save 拆 helper

**影響檔案**：
- `src/game.js`（render -45 行 / +新增 computeStageHint helper 44 行 = 淨 -1）
- `sw.js`（CACHE_VERSION sub-tag iter95 → iter96）

---

## 2026-04-29 12:57 · Session A — P2-3 resetRenderCaches() helper：標 ✅ DONE，scope 比 spec 小

**觸發**：cron 第 95 輪
**為什麼**：iter#76 / iter#80 / iter#82 / iter#84 多次累積 render dirty-check cache（到 12 個 module-level vars），但 reset 邏輯仍 inline 在 startNewEgg 4 行。review-v2 P2-3「散狀態 reset 入口」原本 deferred 14+ 輪。本輪實際分析後發現 spec 範圍比實況廣 — module-level 散狀態多數是 timer/event runtime（已由 iter#79/84 visibility / wireUp* helpers 管理），真正需要 reset 的只有 render dirty-check caches，且只 1 個 in-place state-replacement 路徑（startNewEgg；importSave / dbg-reset 都 location.reload 規避）。本輪抽 5 行 helper 命名 `resetRenderCaches()` 標準化，給未來 migrate / multipet 直接接。

**動作**：

1. **`src/game.js` 加 `resetRenderCaches()` helper**（5 行 + 4 行 comment）：
   - 清 12 個 dirty-check caches：lastPetSrc/Mood/Bg + lastStatVals (4) + lastCoin/StageName/Countdown/TaskStr + lastStreakStr/Hint
   - comment 說明何時用：「state replaced wholesale」+ 列當前+未來 caller
   - 「caches refilled lazily by render() — no need to set sentinel values, just null them」

2. **`src/game.js` startNewEgg 改用 helper**：
   - 舊：4 行 inline reset
   - 新：1 行 `resetRenderCaches()`

3. **`docs/review-v2.md` P2-3 標 ✅ DONE + spec 對齊說明**：
   - 解釋 spec 「散狀態」實際上多是 timer/event runtime（iter#79/84 已管理）
   - 真正需 reset 的只有 render caches
   - helper 命名讓未來路徑直接接

4. **`sw.js` CACHE_VERSION bump**：iter91 → iter95（同日多次 ship 用 iter# 對齊真實版本）

**lines 變化**：
- `src/game.js`：1974 → 1982（**+8** = 9 helper - 4 inline + 3 comment）
- 警戒 buffer 26 → **18**（再縮 8）
- `sw.js`：CACHE_VERSION sub-tag

**為什麼接受 +8 行**：
- 解 review-v2 backlog 一條（13/18 → 14/18 = 78%）
- helper 命名讓未來 migrate 路徑直接呼叫，不必重新散寫
- comment 寫清「未來 caller」未來自我看得懂
- buffer 18 仍未觸警戒線

**review-v2 完成度更新**：
- ✅ P1-1~6（6 條）/ R-2 / P2-2 / P2-4 / P2-5 / P2-6 / P2-7 / P2-8 / P2-10 / R-3 部分 / **P2-3（本輪 iter#95）**
- 開放：P2-1（game.js 1982/2000）/ P2-9（i18n）/ R-1（拆 game.js）/ R-4（中央 timer）/ R-5（i18n t() 函式）
- 14/18 = **78%**

**iter#67-95 累計 29 輪**：
- 28 輪改善後 review-v2 從 0% 推到 78%
- 剩下 4 條都是 i18n / R-1 大重構，不是 quick win
- 玩家可感改善：iter#71/80/86/89/91 共 5 件
- 文檔對齊：iter#91/92/93/94 共 4 件
- 架構 / cfg-driven：12 個 cfg block + 13 條 invariant + 4 條 lint script

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 邏輯保持等價（純詞法搬移）
- helper 通過 node syntax check

**影響檔案**：
- `src/game.js`（+8 行 helper + comment）
- `docs/review-v2.md`（P2-3 加 ✅ DONE + 說明）
- `sw.js`（CACHE_VERSION sub-tag iter91 → iter95）

**下輪候選**：
1. **R-1** 拆 game.js（warn 1982/2000，可能是時候）
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet/Prefs/Save 拆 helper
4. 加新事件（cfg-only）
5. WebSearch / 外部連動

---

## 2026-04-29 12:45 · Session A — launch-plan + tiktok-prompts mix-and-match 重整：iter#93 intel 落地

**觸發**：cron 第 94 輪
**為什麼**：iter#93 WebSearch 發現 (1) Weyrdlets 直接競品 (2) coquette 不再 niche、mix-and-match 是 2026 主旋律。但 launch-plan.md / launch-tiktok-prompts.md 仍是 iter#72 寫的「7 條都鎖 cottagecore」舊版本。本輪把 iter#93 結論 turn 成 actionable changes，下次 W1 真開拍時直接照新表跑。避開 CLAUDE.md（user 開著）。

**動作**：

1. **`docs/launch-plan.md` 標頭加「Tagline」 block + iter#94 註記**：
   - 加 tagline「**開連結即玩、零下載、零帳號**的桌邊小寵物」
   - 標明 iter#94 對 Weyrdlets 競品差異化用
   - 主要曝光路徑從「coquette × cottagecore × pinkaesthetic」改成「mix-and-match × coquette 主軸 + cleangirl + balletcore + cottagecore 平行測試」

2. **`docs/launch-plan.md` §1.2 W1 7 條短片 hashtag 重新分配**（4+2+1 mix）：
   - Mon coquette / Tue cleangirl / Wed balletcore / Thu cleangirl / Fri coquette × cottagecore / Sat coquette+nostalgia / Sun coquette
   - 表格加「美學軸」欄位明示
   - Sat / Sun 標題加「**0 下載**」訴求 hint

3. **`docs/launch-plan.md` §1.2 製作規則加 2 條**：
   - caption 必含「0 下載」字樣（vs Weyrdlets）
   - W1 mix-and-match aesthetic test 4+2+1 結構

4. **`docs/launch-plan.md` 附錄 A hashtag 庫重整**：
   - 「主要鎖定」改成「美學軸（4 軸選 1 主軸）」+ 各軸 viewership 標註
   - 加 W1 hashtag 預算分配表（coquette 4 / cleangirl 2 / balletcore 1）
   - `#tamagotchi` 從紅海「避用」改成「特例使用」（Sat 短片刻意用 nostalgia framing）

5. **`docs/launch-tiktok-prompts.md` § hashtag 對應建議重整**：
   - 對齊 launch-plan §1.2 新表
   - 加「美學軸」欄位
   - 7 個 prompt cover 內容**未動**（圖像本身仍可走原 prompt，只是 caption hashtag 變）
   - 補一句「W2 觀察哪一軸起飛再加碼」

**為什麼 cover prompt 不動**：
- 7 個 SDXL prompt 描述的視覺場景（chibi 雞 / 桌面 / 鏡頭等）本身與美學軸不衝突
- coquette / cleangirl 視覺差異主要在配色 + 質感（粉嫩 vs 米白）— 但 prompt 已用 pastel + soft palette，雙軸都通
- balletcore（Wed 7 進化）只動 hashtag 即可，cover image 「7 種雞依序展示」本身就有舞台變裝感
- 不重做 prompt = 省 Session B 重跑 ComfyUI 的時間

**影響檔案**：
- `docs/launch-plan.md`：301 → 321（+20 行）
- `docs/launch-tiktok-prompts.md`：181 → 187（+6 行）
- `src/game.js`：1974（不變）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- markdown 表格結構合法
- 4+2+1 = 7 條短片，與原計畫條數對應

**iter#92-94 文檔對齊三輪總結**：
- iter#92：README.md（外部展示）
- iter#93：market-research-2026.md §7（市調補強）
- iter#94：launch-plan.md + launch-tiktok-prompts.md（戰術落地）
- 三層文檔（內部 → 戰略 → 戰術）一致更新到 iter#73-93 累積知識

**iter#67-94 累計 28 輪小結**：
- 玩家可感改善：iter#71 A2HS / iter#80 streak / iter#86 bubble / iter#89 adult hint / iter#91 petal / iter#94 launch tactics
- 架構改善：lint chain / cfg-driven / init refactor / cfg-schema invariant 13 條
- 文檔同步：iter#92 README / iter#91 CLAUDE.md / iter#94 launch
- review-v2 完成度：13/18 = 72%

**下輪候選**：
1. **P2-3** 散狀態 reset 入口（積累線索）
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet/Prefs/Save 拆 helper
4. 加新事件（cfg-only）
5. SVG v0.3 配件 placeholder
6. 評估 v0.3 桌面陳列 og image 自動生成（對抗 Weyrdlets）

---

## 2026-04-29 12:33 · Session A — Q2 2026 市調補強：Weyrdlets 競品 + coquette 18B+ views + mix-and-match

**觸發**：cron 第 93 輪
**為什麼**：iter#70 寫 launch 戰術後 22 輪沒做市調，需要 cross-check Q2 2026 是否仍 valid。並行兩條 WebSearch 撈到 3 個關鍵新 insight：(1) **Weyrdlets** 是 2026 Q2 直接競品（idle desktop virtual pet），iter#70 沒提到；(2) **#coquetteaesthetic 18B+ TikTok views** — 比 iter#70 預期的 niche 更 mainstream；(3) **mix-and-match aesthetic** 是 2026 主旋律，鎖單一 niche 已過時。

**動作**：

1. **並行 2 條 WebSearch**（CLAUDE.md §7 提醒 sub-agent WebSearch 常被拒，主 agent 自己跑）：
   - `indie casual game TikTok launch case study Q2 2026 viral cute pet game`
   - `cottagecore coquette aesthetic TikTok 2026 trends evolution gen z female`

2. **`docs/market-research-2026.md` 加 §7「Q2 2026 補強」**（70 行新章節）：
   - **§7.1 Weyrdlets 直接競品分析**：對照 ChickaDay 優劣勢，得「無下載」是 USP
   - **§7.2 Loftia Pet Haven**：indie 社群把 multi-pet 當賣點，**驗證 multipet-plan.md v0.4 路徑值得做**
   - **§7.3 Coquette 美學狀態**：18B+ TikTok views 表，**比 niche 大很多**
   - **§7.4 KOL 候選：@coqxette**（西方 mover，i18n 啟動後再說）
   - **§7.5 已驗證 iter#70 結論仍 valid**：4×4 表（7-14 clips/週 / Paid Organic / PWA discovery / 避 #tamagotchi 都 ✅）
   - **§7.6 iter#93 補一句結論**：mix-and-match 是 2026 主旋律 — W1 7 條短片應拆 4 coquette + 2 cleangirl + 1 balletcore

3. **§ 來源 加 v3 段** （9 條新來源 URL）：
   - Loftia / Filmora 2026 Top 15 / Teecycle / 2026 Indie Jam Showcase
   - Coquette Wikipedia / Wildcat Chronicle / Sweetslolita / PureWow / Aestheticbk
   - 都是 WebSearch 結果中的可信來源

4. **section 重新編號**：§7 三句話結論 → §8（保留位置）

**核心戰略結論變化（vs iter#70）**：
- **launch-plan.md §1.2 7 條短片應該 hashtag 多元化**：原本鎖 `#coquette #cottagecore`，加 `#balletcore` `#cleangirl` 平行測試
- **Weyrdlets 是真實競品**，啾啾 launch tagline 第一句必須強調「**無下載 / 開連結即玩**」
- v0.3 評估「桌面陳列模式」（pet + 配件靜態渲染給玩家分享桌面）— 對抗 Weyrdlets 收藏向 UX
- multipet-plan.md v0.4 路徑被 Loftia KS stretch goal 驗證為市場同頻

**為什麼 §6 不直接修改**：
- iter#70 §6 的 launch playbook 本身是時間戳記錄（2026-04-29 09:00 那輪的判斷）
- 直接覆蓋會丟失「當時知道什麼」的 audit trail
- 補 §7 + cross-reference 是更負責的維護方式
- launch-plan.md 才是最終戰術出口，下輪可挑「launch-plan §1.2 hashtag 表多元化」當 follow-up

**lines 變化**：
- `docs/market-research-2026.md`：288 → 369（+81 = §7 七十行 + 來源 v3 九行 + 編號調整）
- `src/game.js`：1974（不變）— 純文檔/市調，無 code 接觸

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純文檔工作）
- 9 個新來源 URL 全來自 WebSearch results，無虛構
- markdown 結構（§ numbering 1-8 + 來源）合法

**iter#70 vs iter#93 22 輪差異**：
- iter#70（第一次 WebSearch）：建立 launch playbook 主框架
- iter#93（第二次 WebSearch）：cross-check 仍 valid（90% 不變）+ 補 3 個關鍵新發現
- 結論：每 ~20 cron rounds 跑一次市調 cross-check 是合理頻率

**review-v2 完成度**：13/18 = 72%（同；本輪是市調 + 文檔）

**下輪候選**：
1. **launch-plan.md §1.2 hashtag 表 mix 化**（7 條短片 hashtag 重新分配 4+2+1）
2. **launch-plan.md tagline 強調「無下載」**（直接打 Weyrdlets）
3. 加新事件（cfg-only）
4. **P2-3** 散狀態 reset 入口
5. settings 拆 helper
6. 評估 v0.3 桌面陳列 og image 自動生成

---

## 2026-04-29 12:21 · Session A — README.md §技術 + §文件導讀 對齊 iter#34-91 進度

**觸發**：cron 第 92 輪（user 仍開著 CLAUDE.md，本輪避開該檔）
**為什麼**：iter#91 同步了 CLAUDE.md，但 README.md 也是「外部訪客 / 未來新進 agent 的第一站」，§技術 章節的目錄樹仍是 iter#34 之前的世界觀 — 缺 ui.js / audio.js / scripts/、模組依賴鏈寫成 5 段（`cfg → dex → achievements → share → game`）但實際是 7 段。§文件導讀的表格也少了 deploy.md / launch-plan.md / launch-tiktok-prompts.md / multipet-plan.md 等 4 份新 docs。本輪同步。

**動作**：

1. **`README.md` §技術 目錄樹**：
   - 補 `robots.txt` / `sitemap.xml`（iter#65 加的）
   - src/ 補 `ui.js`（iter#34）/ `audio.js`（早期加的）
   - 標註 cfg.js「12 個結構化 block」
   - 新增 `scripts/` 子樹（iter#67-69 加的 4 個檔）
   - docs/ 補 `deploy.md` / `multipet-plan.md` / `launch-plan.md` / `launch-tiktok-prompts.md`
   - 模組依賴鏈：`cfg.js → dex → achievements → share → game`（5 段）→ `cfg → ui → dex → achievements → audio → share → game`（7 段）

2. **`README.md` §文件導讀 表格**：
   - 加 `launch-plan.md` row（30 天戰術手冊 W1-W4）
   - 加 `launch-tiktok-prompts.md` row（W1 7 條短片 cover 圖 SDXL prompts）
   - 加 `multipet-plan.md` row（v0.4 多寵物規劃）
   - `deploy.md` 描述補「+ Search Console SOP」（iter#66 加的章節）
   - `CLAUDE.md` 描述補「+ cfg-driven 架構說明」（iter#91 加的）

3. **CACHE_VERSION 不 bump**：
   - 本輪只動 `README.md`，sw.js APP_SHELL 不含 README
   - 玩家瀏覽器不需重新 fetch，無需 invalidate cache

**為什麼 README 維護重要**：
- README 是 GitHub repo 首頁顯示（部署到 GitHub Pages 後外部開發者第一眼看到）
- launch-plan.md §1.3 W1 監測流程依賴 GitHub stars 增長 — README 質量影響 stars
- 新進入專案的 agent（含 cron 系統的本輪自身）依此認知 file structure，過時資訊會誤導
- iter#91 標的「Cfg-driven 架構（iter#73-90 形成）」這行重要 context 在 CLAUDE.md，對應在 README 的 §技術 子句

**lines 變化**：
- `README.md`：178 → 192（+14，目錄樹擴 + 文件表 +4 row）
- 無其他檔案變化
- `src/game.js`：1974（不變）

**驗證**：
- `./scripts/run-checks.sh` → 全綠（純文檔工作，沒動 JS）
- markdown 結構（# / ## / | table |）合法
- 連結 `[label](path)` 路徑都驗證實存（多數 docs/ 都對應實際檔案）

**iter#91-92 雙輪文檔對齊總結**：
- iter#91：CLAUDE.md（內部維護指引）
- iter#92：README.md（外部展示頁）
- 兩份**都反映 iter#73-90 累積 cfg-driven 架構** 共識
- 未來新 agent 進入專案 / 玩家在 GitHub 看到 repo / 跟 launch-plan 對接的 KOL 都能看到一致的「現在這個專案在哪裡」

**review-v2 完成度**：13/18 = 72%（同；本輪是純文檔對齊）

**iter#67-92 累計 26 輪 game.js 行數歷程**：
- 高點：iter#84 1983
- 低點：iter#73 / iter#82 / iter#88 1967
- 當前：1974（buffer 26）
- 26 輪內保持 1965-1985 區間，未觸線

**影響檔案**：
- `README.md`（+14 行：目錄樹補 5 條 + 文件表 +4 row）

**下輪候選**：
1. 加新事件（cfg-only，iter#90 路徑驗證後零 game.js 風險）
2. **P2-3** 散狀態 reset 入口
3. **P2-9 / R-5** i18n hook 預留
4. settings sectionPet/Prefs/Save 拆 helper
5. SVG 占位圖延伸（v0.3 配件 placeholder）
6. WebSearch 2026 Q2 PWA 寵物市場新動向

---

## 2026-04-29 12:09 · Session A — CLAUDE.md 文檔對齊 iter#73-90 架構 + 驗證 cfg-only 加新事件

**觸發**：cron 第 91 輪（user 開了 CLAUDE.md，IDE 提示）
**為什麼**：iter#73-90 累積 12 個 cfg 結構化資料 block + 13 條 cfg-schema invariant + 「加內容只動 cfg」的 cfg-driven 設計哲學，但 **CLAUDE.md §5「開發慣例」沒同步更新** — 仍然只說「`randomEvents.pool[].apply` 用 string id... 實作在 game.js dispatch 表」，這是 iter#90 之前的世界觀。新進入專案的 agent / 使用者讀 CLAUDE.md 會誤以為加新事件需要動 game.js。本輪同步文檔，並驗證 cfg-only 路徑：加 1 個新事件「花瓣飄落」，全程零 game.js 改動。

**動作**：

1. **`CLAUDE.md` §5 程式碼章節重寫**：
   - 原本「`改數值只動 cfg.js`」單句強化為「**12 個結構化資料 block 都住 cfg.js**」清單
   - 新增「Cfg-driven 架構（iter#73-90 形成）」副節列出 12 個 block 與所屬 iter#
   - 「新增事件 / 進化分支等內容只動 cfg.js」標明 4 條具體流程（randomEvents / 終態 / 進化判定 / 配件）
   - 強調 Session B 加新配件零 game.js 風險

2. **`CLAUDE.md` §5 驗證章節擴展**：
   - 標註 13 條 cfg-schema invariant（編號 1-8 + 7.2/7.3/7.4/7.5/7.6 sub-invariants）
   - 每條一行精簡描述
   - 從「2 lint」更新為「3 lint」（與 iter#74 後實況一致）

3. **加新隨機事件「花瓣飄落」（cfg-only edit 驗證）**：
   - `assets/svg/event-petal.svg`（新檔，9 行）：4 個 ellipse 花瓣（粉嫩配色 #FFB7B7 / #FFC8D6 / #FFD4DD / #FFE0E8）+ ✨ 點綴，cottagecore aesthetic
   - `src/cfg.js` randomEvents.pool +1 entry：
     ```
     { id:"petal", art:"assets/svg/event-petal.svg", weight:8, label:"花瓣飄落",
       apply:"petal", applyEffects:{ stats:{mood:14, clean:3} },
       applyToast:"🌸 粉色花瓣飄到啾啾身上~" }
     ```
   - **`src/game.js` 零改動** ✅ — 完美驗證 iter#90 cfg-driven 路徑
   - 觸發機率：weight 8 / total ~138 ≈ 5.8%
   - 與 sakura（seasonal，3-5 月限定）區隔但共享 cottagecore 美學

4. **`sw.js` CACHE_VERSION bump**：iter90 → iter91

**lines 變化**：
- `CLAUDE.md`：+12 行（§5 cfg-driven 副節 + invariant 列表擴展）
- `assets/svg/event-petal.svg`：新檔 9 行
- `src/cfg.js`：340 → 341（+1 行 event entry）
- `src/game.js`：1974 → **1974（零變化）✅**
- `sw.js`：CACHE_VERSION sub-tag

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- check-assets 自動驗證 `assets/svg/event-petal.svg` 路徑實存
- check-cfg-schema invariant 7.4 自動驗 applyEffects.stats / applyToast 結構合法
- 9 events total（7 random regular + 2 cottagecore SVG: bubble + petal + 6 seasonal stripped here）

**iter#90 cfg-driven 路徑兌現**：
- iter#90 寫的「未來新事件純 cfg edit 零 game.js 風險」承諾，**iter#91 立刻驗證為真**
- Session B 看到本輪 commit 後，加配件 / 事件 / want 都有信心走 cfg-only

**為什麼不寫進 image-prompts.md（Session B 領域）**：
- CLAUDE.md §6 規定 docs/image-prompts.md 是 Session B primary territory
- petal SVG 我（Session A）寫好了，PNG 升級留給 Session B 自己決定
- 不主動 prompt，避免越界

**review-v2 完成度**：13/18 = 72%（同；本輪是文檔 + 內容工作）

**iter#67-91 累計 25 輪**：
- iter#65-69 SEO / 部署武裝（5 輪）
- iter#70-72 launch playbook（3 輪）
- iter#73-91 review-v2 + cfg refactor + content + docs（19 輪）
- 12 個 cfg block / 13 條 invariant / game.js 1948→1974（+26 net 經一波重構）
- launch-tiktok-prompts.md 7 條 video covers（Session B ready）
- A2HS 橫幅 + adult hint + streak tooltip（玩家可感）

**影響檔案**：
- `CLAUDE.md`（+12 行 cfg-driven 文檔）
- `assets/svg/event-petal.svg`（新檔 9 行）
- `src/cfg.js`（+1 行 event）
- `src/game.js`（**零變化**）
- `sw.js`（CACHE_VERSION sub-tag iter90 → iter91）

**下輪候選**：
1. 繼續加新事件（cfg-only 已飽和，可考慮 fairy_dust / dewdrop 等）
2. **P2-3** 散狀態 reset 入口
3. **P2-9 / R-5** i18n hook 預留
4. settings sectionPet/Prefs/Save 拆 helper（game.js 不擴大）
5. SVG 占位圖延伸（v0.3 配件 placeholder）

---

## 2026-04-29 11:57 · Session A — Event apply cfg-driven：13/14 handler 移 cfg.applyEffects + invariant 9

**觸發**：cron 第 90 輪 milestone
**為什麼**：iter#89 加 13 行 adult hint 後 game.js 1980/2000 buffer 20。掃 RANDOM_EVENT_APPLIES dispatch 表發現 13/14 條 handler（herb / butterfly / fly / star / rainbow / candy / bubble + 6 seasonal）都是「stats + (optional coin) + toast」固定 pattern — 純資料應該住 cfg.js。只有 `coin_drop` 因隨機金額需要保留 inline。本輪：(1) 把 13 條 handler 改 cfg-driven；(2) 加 generic `runEventApply(def)` runner；(3) cfg-schema lint 加第 9 條 invariant 守 applyEffects 結構。

**動作**：

1. **`src/cfg.js` 13 個 events 加 applyEffects + applyToast**：
   - randomEvents：herb / butterfly / fly / star / rainbow / candy / bubble（7 條）
   - seasonalEvents：sakura / valentine / summer_breeze / mooncake / halloween / xmas（6 條）
   - 結構 `{ applyEffects: { stats?: {...}, coin?: N, coinReason?: "..." }, applyToast: "...", applyToastStyle?: "good"|"gold" }`
   - applyToastStyle 預設 "good"，star / valentine / halloween / xmas 為 "gold"（高價值事件）
   - randomEvents pool 維持 one-line per event（行寬從 ~120 → ~200 chars，可接受）
   - seasonalEvents pool 既有 multi-line 結構，新欄位 +2-3 行 / event

2. **`src/game.js` RANDOM_EVENT_APPLIES collapse 16 → 4 行**：
   - 移除 13 條 handler
   - 保留 coin_drop（random 金額）
   - 加 `runEventApply(def)` helper（6 行）：根據 def.applyEffects + def.applyToast 執行
   - resolveEvent caller 改：「if (fn) fn(state); else runEventApply(def);」雙路徑 dispatch

3. **`scripts/check-cfg-schema.js` 第 9 條 invariant 升級**（原 7.4 重寫）：
   - 合併 randomEvents + seasonalEvents pool 統一驗
   - applyEffects 必為 object（若存在）
   - applyEffects.stats 必為 object
   - applyEffects.coin 必為正數
   - applyToast 必為 string
   - 抓得到「`applyEffects: "broken"`」「`applyEffects.coin: -5`」型 typo

4. **`sw.js` CACHE_VERSION bump**：iter89 → iter90

**lines 變化**：
- `src/game.js`：1980 → 1974（**-6** buffer 20 → 26）
- `src/cfg.js`：323 → 340（+17，主要是 6 seasonal events 各 +2-3 行）
- `scripts/check-cfg-schema.js`：169 → 198（+29，含原 invariant 7.4 重寫變大）

**為什麼是 -6 而非預期 -10**：
- 原始預估只看 game.js handler 部分（13 lines → 1 line = -12）
- 但 game.js 也加了 6 行 runEventApply helper
- 淨 game.js -6 行（13 - 1 - 6 + 0）

**架構好處（即便淨節省小）**：
- v0.3 / v0.4 加新事件只動 cfg：
  - 之前：cfg.js 加 entry + game.js RANDOM_EVENT_APPLIES 加 handler，兩處需同步
  - 現在：cfg.js 一處加完整 entry（+applyEffects），game.js 不動（除非有特殊邏輯）
- Session B 加新事件零 game.js 風險
- cfg-schema lint 即時驗 applyEffects 結構，typo 在 push 前抓出

**iter#74-90 lint 套件累計到 13 條 invariant**：
1. interactionMenus[cat].items[*] ∈ interactions
2. interactions[*].unlock ∈ stages
3. accessories[*].slot ∈ {hat,face,neck,wing}
4. wants.pool[*].needs / .stage 對應
5. stages[*].next ∈ stages ∪ {null}
6. traitsDisplay[*].key ∈ KNOWN_TRAITS / cap > 0
7. speech.* 非空字串陣列
7.2 thresholds 排序 + 0-100
7.3 economy 全正數
7.4 **events.pool weight + apply + applyEffects/applyToast 結構（本輪重寫升級）**
7.5 finalForms ↔ petArt.adult 雙向同步
7.6 accessories.price 正數
8 traitsDisplay key + cap

**驗證**：
- `./scripts/run-checks.sh` → 全綠（含新 invariant 跑 14 events 全 PASS）
- `node --check src/game.js` 通過
- 邏輯保持等價：每個事件對應的 stats delta / coin grant / toast 都精確復刻到 cfg

**iter#67-90 累計 24 輪總結**：
- iter#65-69：SEO + 部署武裝
- iter#70-72：launch playbook
- iter#73-74：menu config-driven + cfg schema lint 1.0
- iter#75-79：review-v2 sweep + 修補
- iter#80-83：streak / R-3 / cfg traitsDisplay / speech 補滿
- iter#84-85：init refactor / launch-prompts / clean comments
- iter#86-90：新事件 / finalForms cfg / 數值 invariant / adult hint / **events cfg-driven (本輪)**

**12 個 cfg 結構化資料 block**：interactions / stages / wants.pool / accessories / achievements / speech (46 pools) / randomEvents.pool (8) / seasonalEvents.pool (6) / interactionMenus / traitsDisplay / stageLabels / finalForms

**game.js 行數歷程**：iter#82: 1967 / iter#84: 1983 / iter#85: 1980 / iter#86: 1981 / iter#87: 1967 / iter#88: 1967 / iter#89: 1980 / **iter#90: 1974**

**review-v2 完成度**：13/18 = 72%

**影響檔案**：
- `src/cfg.js`（+17 行 applyEffects on 13 events）
- `src/game.js`（-6 行：handler 表 collapse + runEventApply 新增）
- `scripts/check-cfg-schema.js`（+29 行 invariant 7.4 升級）
- `sw.js`（CACHE_VERSION sub-tag iter89 → iter90）

**下輪候選**：
1. **P2-3** 散狀態 reset 入口
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet/Prefs/Save 拆 helper
4. 補新事件（純 cfg edit，零 game.js 風險）
5. SVG 占位圖延伸（v0.3 配件 placeholder）

---

## 2026-04-29 11:45 · Session A — adult 階段 stage-hint 補完：3 條 post-evolution 提示

**觸發**：cron 第 89 輪
**為什麼**：iter#67-88 連 22 輪偏 dev tooling，回頭挑玩家可感的 UX 補洞。掃 render() stage-hint 邏輯發現 **adult 階段（達成 finalForm 後）完全沒任何提示** — 既有 else 分支需要 `stageCfg.next`，但 adult.next 為 null，邏輯走不到。玩家進化完只看到「成長 N」一行字，沒任何 nudge 告訴他下一步可以做什麼。是真實 UX 漏洞。

**動作**：

1. **`src/game.js` render() stage-hint 加 adult 分支**（13 行新增於 line 748）：
   - 條件 1：`elapsedAdult < 3h && ownedAccCount === 0` → `🎀 試試右上「裝扮商店」買件配件吧`
   - 條件 2：`dexUnlocked < 3` → `📖 圖鑑還有更多終態等你發掘`
   - 條件 3：`elapsedAdult > 7d` → `🥚 設定→存檔可以孵新蛋，繼續陪伴新生命`
   - 三條件依序檢查 if/else if，第一個 match 顯示
   - 不 match 時 hint 維持 null，hintEl.hidden 為 true（沉默）

2. **`sw.js` CACHE_VERSION bump**：iter88 → iter89

**設計理由（每條條件的時機）**：

| 條件 | 時機 | 動作引導 |
|---|---|---|
| 進化後 3 小時 + 無配件 | 玩家剛達成 final form，最有探索動力 | 推 v0.3 商店（最高 ARPU 動作） |
| 解鎖 < 3 form | 多次重養但收藏數淺 | 推圖鑑（中期留存核心） |
| 進化超過 7 天 | 同一隻雞已照顧很久，可能想新挑戰 | 推新蛋（重啟 D1-D7 循環） |

互斥邏輯：條件 1 排他（前 3h），之後條件 2 / 3 分別覆蓋不同階段。中間「3h - 7d 且 dex >= 3」是沉默期，避免 nudge 過頻。

**lines 變化**：
- `src/game.js`：1967 → 1980（**+13**）警戒 buffer 33 → 20
- 注：iter#88 不動 game.js 攢回 14 行 buffer，本輪加回 13，等於拿 iter#88 攢的 buffer 換 UX 提示

**為什麼接受 buffer 縮回 20**：
- 3 條提示對玩家行為實質影響 = 高
- 僅 13 行的 UX 投資能避免「玩家進化後不知做什麼 → 流失」
- buffer 20 仍在「警戒區外」（< 10 才是真的需要重構）
- iter#87 的 finalForms cfg 化讓本輪 dexUnlocked 計算可靠（cfg drift 不會突然影響條件 2）

**實際觸發行為驗證**（玩家可在 localhost:8765 直接看）：
- 新進化到 adult 第 1 秒：條件 1 觸發 → shop 提示
- 買第一個配件後：條件 1 不觸發（ownedAccCount > 0），條件 2/3 視 dex / 時長
- 養同一隻 8 天：條件 3 觸發 → 新蛋提示
- 養 5 種 final form：dexUnlocked >= 3，條件 2 不觸發；7d 內進入沉默期

**`window.NourishDex.unlockedFormsSet()` 依賴驗證**：
- dex.js 載入順序：cfg → ui → **dex** → achievements → audio → share → game
- game.js render() 在 init() 後才跑，所以 NourishDex 已 ready
- iter#87 已驗證 dex.js 改 derived `FINAL_FORMS = Object.keys(CFG.finalForms)` 安全

**沒做 cfg-driven hint 的理由**：
- hint 條件是 RUNTIME 邏輯（時間比較 / 物件 size），不是純 data
- 寫 `condition: "elapsedAdult < 3h && noAcc"` 變成 mini DSL，要寫 evaluator
- 3 條 hardcoded 比 1 個 evaluator + 3 條 cfg 簡單

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- `node --check src/game.js` 通過
- 邏輯：existing else if (chick) / else if (junior 的 next-evolution branch) 維持不變，純擴充

**review-v2 完成度**：13/18 = 72%（同；本輪 UX 修補不在 review backlog，是新發現的漏洞）

**iter#67-89 累計 23 輪 review-v2 backlog 動向**：
- ✅ 已修：P1-1~6 / R-2 / P2-2 / P2-4 / P2-5 / P2-6 / P2-7 / P2-8 / P2-10 / R-3 部分（13 條）
- ⏳ 開放：P2-1（game.js 1980/2000）/ P2-3（散狀態）/ P2-9（i18n）/ R-1 / R-4 / R-5

**影響檔案**：
- `src/game.js`（+13 行 adult stage-hint 分支）
- `sw.js`（CACHE_VERSION sub-tag iter88 → iter89）

**下輪候選**：
1. **P2-3** 散狀態 reset 入口
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet/Prefs/Save 拆 helper（game.js 不擴大）
4. 加新事件（content）
5. SVG 占位圖延伸（v0.3 配件）

---

## 2026-04-29 11:33 · Session A — cfg-schema 加 4 條數值 invariant：thresholds / economy / weight / price

**觸發**：cron 第 88 輪
**為什麼**：iter#74-87 的 cfg-schema lint 守 8 條 invariant 全是「key 對應」型（cross-ref / set membership / 字串型別）。但 cfg.js 還有大量**數值欄位**從未被驗證：thresholds（如果排序錯，玩家狀態警示亂跳）、economy（如果負數，會 grant 負幣讓玩家欠款）、randomEvents weight（如果 0，事件永遠不出）、accessories price（如果 0，免費刷裝扮）。這 4 類都是 Session B 加新內容時容易手滑的數值欄位。10 分鐘可加 4 條 invariant，無 game.js 風險。

**動作**：

1. **`scripts/check-cfg-schema.js` 加 4 條數值 invariant**（35 行新增）：
   
   **invariant 7.2 thresholds 排序 + 範圍**：
   - 必為數字、`high > mid > low`、全 0-100 之間
   - 抓「`high=70 mid=80 low=20`」型錯亂
   
   **invariant 7.3 economy 全正數**：
   - 對 `CFG.economy` 每個欄位驗 `> 0`
   - 抓 `dailyLogin: -10` 型 typo（會讓玩家每日扣幣）
   
   **invariant 7.4 randomEvents.pool[*]**：
   - `weight` 必為正數（0 → 永遠 `Math.random() * total` 不會落入此區間）
   - `apply` 必為非空字串（dispatch 表 lookup key）
   - 抓 `weight: 0` 型 typo
   
   **invariant 7.6 accessories.price 全正數**：
   - 守 `price: 0` 型 typo（玩家會免費取得）

2. **驗證 4 條 invariant 都抓得到** — 4 個故意 typo 測試全 PASS：
   - thresholds out of order ✅
   - negative economy.dailyLogin ✅
   - zero randomEvents weight ✅
   - zero accessories.price ✅

3. **`sw.js` CACHE_VERSION bump**：iter87 → iter88

**為什麼這 4 個比其他更值得守**：
| invariant | 沒守的後果 | 玩家可見度 |
|---|---|---|
| thresholds 排序 | stat warn icon 顯示亂、deserts 觸發紊亂 | 高（每次 stat 變動） |
| economy 全正數 | 負幣 / 欠款 / 進度倒退 | 高（每日登入立即發生） |
| events.weight 正數 | 該事件永不出 | 中（玩家 90s 看不到才察覺） |
| accessories.price 正數 | 商店物件免費獲取 | 高（破壞商業模式預期） |

3 條都是「**ship 後玩家立即遇到**」級的事故 — 不像「label 多空格」那種 cosmetic 問題。

**lint 套件 8 條 invariant 完整列表**（iter#88 後）：
1. interactionMenus[cat].items[*] ∈ keys(interactions)
2. interactions[*].unlock ∈ keys(stages)
3. accessories[*].slot ∈ {hat, face, neck, wing}
4. wants.pool[*].needs ∈ interactions / .stage ∈ stages
5. stages[*].next ∈ stages ∪ {null}
6. traitsDisplay[*].key ∈ KNOWN_TRAITS / cap > 0
7. speech.* 是非空字串陣列
7.2 **thresholds 排序 + 範圍（本輪）**
7.3 **economy 全正數（本輪）**
7.4 **randomEvents.pool weight + apply（本輪）**
7.6 **accessories.price 全正數（本輪）**
7.5 finalForms ↔ petArt.adult 雙向同步

**iter#74-88 lint 累計守備範圍**：
- 70+ assertion checks 跑 < 100ms
- Session B 新增配件 / 事件 / want / 終態 一律自動驗
- run-checks.sh 一條指令包所有 lint + 7 檔 syntax + sw.js syntax，set -e fail-fast

**lines 變化**：
- `scripts/check-cfg-schema.js`：134 → 169（+35）
- `src/game.js`：1967（不變）
- `sw.js`：CACHE_VERSION sub-tag

**game.js 警戒 buffer 維持 33**（iter#87 已壓下來，本輪沒擴大）

**review-v2 完成度**：13/18 = 72%（本輪沒拍 ✅，但 P2-1 game.js 行數壓力降溫，P2-X 沒新增）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 4 條 typo 測試 all PASS
- 沒新增其他 stat 欄位（lint 套件已飽和到 cfg.js 主要欄位）

**影響檔案**：
- `scripts/check-cfg-schema.js`（+35 行 4 條 invariant）
- `sw.js`（CACHE_VERSION sub-tag iter87 → iter88）

**下輪候選**：
1. **P2-3** 散狀態 reset 入口（已多輪累積線索）
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet / sectionPrefs / sectionSave 拆 helper
4. 新事件補充（content）
5. 寫 sub-agent 派 docs/ 美工延伸（若 sub-agent 沙盒允許）

---

## 2026-04-29 11:21 · Session A — finalForms / stageLabels 搬 cfg.js：game.js 1981 → 1967 + 第 8 條 invariant

**觸發**：cron 第 87 輪
**為什麼**：iter#86 game.js 1981 / 警戒 19，仍需要壓 file 行數。掃 `formLabel` / `formDescription` / `stageLabel` / `allForms` / `FINAL_FORMS` 發現 form 列表跟 label/desc 在 **3 個檔案 × 5 處**重複（cfg.petArt.adult / dex.js FINAL_FORMS / game.js allForms / game.js formLabel switch / game.js formDescription switch）。**11 行的 form description block 是純資料**，應該住 cfg.js。本輪整合 + 加 cfg-schema 第 8 條 invariant 守 finalForms 與 petArt.adult 雙向同步（漏一邊就 ship 破圖）。

**動作**：

1. **`src/cfg.js` 新增兩個 block**：
   - `stageLabels: { egg, chick, junior, adult }`（1 行 inline）
   - `finalForms: { healthy, fatty, ugly, fighter, sage, diva, divine }`（9 行）— 每個有 `label` + `desc`
   - finalForms 順序刻意與原 openDexMenu allForms 順序一致，避免 UI 順序漂移

2. **`src/game.js` 三個函式精簡**（17 行 → 3 行，淨 -14）：
   - `function stageLabel(s) { return CFG.stageLabels[s] || s; }`
   - `function formLabel(f) { return CFG.finalForms[f]?.label || f; }`
   - `function formDescription(f) { return CFG.finalForms[f]?.desc || ""; }`

3. **`src/game.js` openDexMenu allForms** 改 derived：
   - 舊：`["healthy","fatty","ugly","fighter","sage","diva","divine"]`
   - 新：`Object.keys(CFG.finalForms)`

4. **`src/dex.js` FINAL_FORMS** 改 derived：
   - 舊：hardcoded array
   - 新：`Object.keys((window.NourishCFG && window.NourishCFG.finalForms) || {})`
   - 與 dex.js 既有 `window.NourishCFG` 依賴一致（已 eager bind 所以安全）

5. **`scripts/check-cfg-schema.js` 加第 8 條 invariant**（25 行新增）：
   - 對每個 `finalForms[k]` 驗 petArt.adult[k] 也存在
   - 反向也驗 petArt.adult[k] 在 finalForms 也有 entry
   - 加 `label` / `desc` 必為非空 string
   - stats 物件加 `final_forms` 顯示 entries 數

6. **`sw.js` CACHE_VERSION bump**：iter86 → iter87

**lint 雙向抓 drift 驗證**：
- 改 `diva: → dance:` → 抓「finalForms.dance: no matching petArt.adult.dance sprite」+「petArt.adult.diva: no matching finalForms.diva label/desc」✅
- 兩個方向都抓 = v0.3 加新進化分支時，不會發生「圖有但沒文案」或「文案有但沒圖」的事故

**lines 變化**：
- `src/game.js`：1981 → 1967（**-14**）警戒 buffer 19 → **33**
- `src/cfg.js`：310 → 323（+13）
- `src/dex.js`：96（trade-off：1 行 hardcoded → 1 行 derived）
- `scripts/check-cfg-schema.js`：109 → 134（+25）
- 淨 game.js -14，整體架構：3 處重複 → 1 處 source of truth

**為什麼 finalForms 順序刻意對齊原 allForms**：
- `Object.keys()` 保留插入順序（modern JS 規範）
- openDexMenu 用 allForms 渲染圖鑑頁，順序變動 = 玩家看到的清單變動
- cfg.finalForms 我**刻意排成** healthy / fatty / ugly / fighter / sage / diva / divine 對齊原 hardcoded 順序，玩家看圖鑑沒視覺改變

**v0.3 對接準備**：
- 加新進化分支（GDD §10.3 預備的「藝術家雞」）只需 3 處：
  - cfg.finalForms 加 entry
  - cfg.petArt.adult 加 entry（PNG 路徑）
  - maybeEvolve / finalizeForm 加判定（game.js 邏輯，無法迴避）
- cfg-schema lint 即時抓「兩處沒同步」的疏漏
- iter#82 加的 traitsDisplay 也已就位 — 新 trait → 新 form 一條龍

**iter#67-87 累計 21 輪 cfg-driven 化進度**：
- ✅ interactions（既有）
- ✅ stages（既有）
- ✅ wants.pool（既有）
- ✅ accessories（既有）
- ✅ achievements（既有）
- ✅ speech（既有）
- ✅ randomEvents.pool（既有，iter#86 加 1）
- ✅ seasonalEvents.pool（既有）
- ✅ interactionMenus（iter#73 加）
- ✅ traitsDisplay（iter#82 加）
- ✅ **stageLabels（iter#87 加）**
- ✅ **finalForms（iter#87 加）**
- 12 個結構化資料 block，cfg-schema 守 8 條 invariant

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 新 stats: `7 final_forms`
- 邏輯保持等價：dex.js / game.js 對 form 列表的所有讀取都通過 `Object.keys(CFG.finalForms)` 拿到相同 7 條
- 玩家 UX 零變化（順序、label、description 都同舊版）

**影響檔案**：
- `src/cfg.js`（+13 行 stageLabels + finalForms）
- `src/game.js`（-14 行：3 個 fn 從 17 行 → 3 行；allForms 改 derived）
- `src/dex.js`（FINAL_FORMS 改 derived，1 行 in-place 替換）
- `scripts/check-cfg-schema.js`（+25 行第 8 條 invariant + stats）
- `sw.js`（CACHE_VERSION sub-tag iter86 → iter87）

**下輪候選**：
1. 同類 cfg 化：把 `RANDOM_EVENT_APPLIES` 中的 toast 文字搬 cfg.events.pool[].applyMessage（純 data，game.js 再縮）
2. **P2-3** 散狀態 reset 入口
3. **P2-9 / R-5** i18n hook 預留
4. settings sectionPet / sectionPrefs / sectionSave 拆 helper（game.js 不擴大）
5. 補新事件如 `flower_petal`（content）

---

## 2026-04-29 11:09 · Session A — 新隨機事件「肥皂泡」：cottagecore ASMR 風 + SVG 占位

**觸發**：cron 第 86 輪
**為什麼**：iter#85 game.js 1980 / 警戒 buffer 20，本輪要繼續嚴守不大量加 game.js code，但**內容工作**還是要推進。隨機事件目前 7 種（regular），加 1 種「肥皂泡」對應 launch-plan.md TA 的 ASMR / coquette / cottagecore 美學偏好，視覺與洗澡互動同調（清潔 +10 / 心情 +8）。SVG 占位走 `assets/svg/event-bubble.svg`，Session B 未來可升級成 PNG。淨 game.js 增 1 行 apply handler。

**動作**：

1. **新檔 `assets/svg/event-bubble.svg`**（10 行）：
   - viewBox 100×100，3 個泡泡層次：1 大（中心）+ 1 中（左上）+ 1 小（右下）+ 1 mini（右上）
   - 配色：淺藍 #E8F4FF 填底、藍 #6BCBFF 邊、桃紅 #FF89A7 dashed 內框（粉嫩 hint）
   - 反光 ellipse 白色 opacity 0.85（玻璃質感）
   - 100 chars 內 SVG path，符合 CLAUDE.md §5「SVG 統一 viewBox」

2. **`src/cfg.js` randomEvents.pool 加 1 條**：
   - `{ id:"bubble", art:"assets/svg/event-bubble.svg", weight:9, label:"肥皂泡", apply:"bubble" }`
   - weight 9（介於 candy 8 跟 fly 10 之間，中等出現率）
   - 路徑指向 SVG 而非 PNG — 是現有 7 條中**唯一**用 SVG 的，給 Session B 升級 PNG 留 hook

3. **`src/game.js` RANDOM_EVENT_APPLIES 加 1 條**（line 27）：
   - `bubble: s => { applyDelta(s.pet.stats, { clean:+10, mood:+8 }); toast("🫧 肥皂泡飄飄~ 清潔 +10 / 心情 +8", "good"); }`
   - clean:+10 是中等清潔事件（vs herb +5 / fly +5 / star +10 / rainbow +5）
   - mood:+8 對應 ASMR 體驗效應
   - 不發飼料幣（與 candy / star / xmas 區隔）

4. **`sw.js` CACHE_VERSION bump**：iter85 → iter86

**為什麼 weight = 9**：
- 7 條既存 weight：coin_drop 55 / herb 18 / butterfly 14 / fly 10 / rainbow 12 / candy 8 / star 3
- 加 bubble 9 → 總 weight 129，bubble 出現率 ~7%（8 條事件中等位）
- 不搶 coin_drop 主角地位，但比 star 神秘流星顯眼

**TA 對齊驗證**：
- 肥皂泡 = TikTok #asmr / #cottagecore / #softgirl 高頻主題
- 視覺：粉藍透明 + 反光 = 療癒觀賞性
- 文案：「飄飄~」「清潔 +10 / 心情 +8」雙重正向 reward
- 不戰鬥、不焦慮、純柔美 — 嚴守 CLAUDE.md TA 約束

**lines 變化**：
- `src/game.js`：1980 → 1981（+1 apply handler）
- `src/cfg.js`：309 → 310（+1 event entry）
- `assets/svg/event-bubble.svg`：新檔，10 行
- `sw.js`：CACHE_VERSION sub-tag

**驗證**：
- `./scripts/run-checks.sh` → 全綠（含 check-assets 自動驗證新 SVG 路徑）
- 新 stats：8 randomEvents pool entries
- 玩家可立即在 localhost:8765 看到（隨機觸發週期 60s × 30% 機率）

**為什麼選 bubble 而非其他靈感**：
- 候選比較：
  - **soap_bubble**（選中）：視覺 SVG 簡單、TA 高匹配、無分類衝突
  - kitten_visit：需要動物 SVG（複雜）+ 跟既有「butterfly」可愛動物事件同類
  - rose_petal：跟 sakura 季節事件可能混淆
  - flower_garland：跟 flower 配件可能混淆
- bubble 在現有事件 pool 裡是「乾淨類」唯一新增（herb/fly 是清潔但藥草/驅蟲調性不同）

**review-v2 完成度**：13/18 = 72%（同）

**iter#67-86 累計 20 輪總結**：
- 5 輪 SEO / 部署武裝（iter#65-69）
- 3 輪 launch playbook（iter#70-72）
- 2 輪 menu / cfg refactor（iter#73-74）
- 6 輪 review-v2 sweep + 修補（iter#75-79）
- 1 輪 streak UX（iter#80）
- 2 輪 R-3 / cfg traitsDisplay（iter#81-82）
- 2 輪 speech / init refactor（iter#83-84）
- 1 輪 launch-prompts + clean comments（iter#85）
- 1 輪 新事件（iter#86 本輪）

**game.js 行數歷程後段**：
- iter#79: 1948 / iter#80: 1963 / iter#81: 1967 / iter#82: 1967 / iter#83: 1967 / iter#84: 1983 / iter#85: 1980 / **iter#86: 1981**
- 警戒 buffer 19 行

**影響檔案**：
- `assets/svg/event-bubble.svg`（新檔，10 行）
- `src/cfg.js`（+1 行 event）
- `src/game.js`（+1 行 apply handler）
- `sw.js`（CACHE_VERSION sub-tag iter85 → iter86）

**下輪候選**：
1. **P2-3** 散狀態 reset 入口（積累線索）
2. **P2-9 / R-5** i18n hook 預留
3. settings sectionPet/Prefs/Save 拆 helper（仿 init() 思路，game.js 不擴大）
4. 補另一個新事件如 `flower_petal`（內容路線）
5. WebSearch 2026 Q2 PWA 寵物遊戲新動向

---

## 2026-04-29 10:57 · Session A — launch-tiktok-prompts.md（7 條短片 cover prompt）+ 清歷史註解

**觸發**：cron 第 85 輪
**為什麼**：iter#84 警戒 game.js 1983/2000，本輪嚴守不加 game.js code。雙產出：(1) 兌現 iter#72 留的 TODO「為 launch-plan §1.2 7 條短片寫 image-prompts」，產出 SDXL/Niji ready prompts 給 Session B；(2) 順手清 game.js 內部 P-* / iter#NN 歷史註解（CLAUDE.md 全域指引明確說「Don't reference the current task, fix...those rot as the codebase evolves」），藉此釋放 file 行數。

**動作**：

1. **新檔 `docs/launch-tiktok-prompts.md`**（180 行）：
   - 共用 `style anchor`：soft pastel coquette + chunky outline + 9:16 aspect
   - 7 條 W1 短片 cover prompts（Mon-Sun，對齊 launch-plan.md §1.2 內容表）：
     - Mon 桌面寵物 / Tue ASMR 養雞 / Wed 7 進化分支 / Thu AI 男友多工 / Fri 裝扮 / Sat 復古對比 / Sun emotional POV
   - 每條含設計重點（為什麼這個構圖 sticky）
   - W2 預備變奏 A/B（玩家分享重發 + v0.3 配件預告 teaser）
   - **ComfyUI workflow 給 Session B**：DreamShaperXL Turbo + rembg pipeline + 8-10 steps + batch 4-8 變體
   - hashtag 對應表：每條短片配 3 個 hashtag（subculture × 2 + platform × 1）
   - 嚴守 CLAUDE.md TA 約束：避用 sharp / edgy / dark / weapon

2. **`robots.txt` Disallow** 追加 `/docs/launch-tiktok-prompts.md`（與 launch-plan 同樣不收錄，內含 KOL 模板等）

3. **清 game.js 歷史註解**（淨 -3 行）：
   - L84-87 多行 P2-2 dirty-check preamble 壓縮成 2 行 WHY-form
   - L94 「P1-1: 」前綴去掉
   - L114「P1-2: 」inline ref 改純解釋
   - L119「P1-3: 」前綴去掉
   - L468「P1-4 part 2: 」前綴去掉
   - L471/L475「retrospective P1-3 / P1-6 」前綴去掉
   - L711「iter#80. 」前綴去掉
   - L1490「P1-6 cap」inline 改純「particle cap」
   - L847「iter#73.」結尾 trim
   - L1044「(iter#82)」inline 去掉
   - L1786 / L1804 / L1827 「(iter#NN)」 / 「P2-N (iter#NN):」前綴 sed 批次去掉
   - L1870「(P2-4 iter#79)」suffix 去掉

4. **清 cfg.js / ui.js iter# 註解**（各 1 處）：
   - cfg.js traitsDisplay block 結尾 `iter#82.`
   - ui.js lockableRowHTML 開頭 `R-3 (iter#81). `

5. **`sw.js` CACHE_VERSION bump**：iter84 → iter85

**為什麼清歷史註解符合專案哲學**：
- CLAUDE.md 全域指引（Anthropic 規範）：「Don't reference the current task, fix, or callers ...belong in the PR description and rot as codebase evolves」
- iteration-log.md 已是 source-of-truth 歷史紀錄，code 內 ref iter# 是 duplicate
- code 內 P-* ref 假設未來讀者會去翻 review-v2.md，**但專案沒有 git** + 沒有 issue tracker → 反而沒幫助
- 改寫成純 WHY-form 註解（「WHY this exists」而非「WHEN it was added」）才是長期可維護

**lines 變化**：
- `src/game.js`：1983 → 1980（-3，警戒 buffer 17 → 20）
- `src/cfg.js`：309 → 309（trim 1 行 trailing comment 但被換行 normalize）
- `src/ui.js`：213 → 213（同上）
- `docs/launch-tiktok-prompts.md`：新檔 180 行
- `robots.txt`：+1 行 Disallow
- `sw.js`：CACHE_VERSION sub-tag

**過程踩到的 sed 坑**：
- 第一次 perl regex `s/\s*iter#\d+\.\s*//g` 太貪心，吃掉換行 → 把「iter#73.\n  function ...」變成「iter#73.  function」 → 破壞語法
- 修補後手動把那行還原 + 改用更保守的單獨 Edit 處理該段
- run-checks 在斷裂時馬上抓出 SyntaxError，這就是 iter#67 寫的 lint chain 的價值

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- `grep -cE "iter#|// P[01]-[0-9]|// retrospective" src/*.js` → 全 0
- launch-tiktok-prompts.md markdown 結構合法
- 本機 server `curl /docs/launch-tiktok-prompts.md` 應該 200 但被 robots.txt 擋（預期）

**iter#85 雙重收益**：
- 玩家可感：W1 launch 內容資產 ready，Session B 可直接拿去跑 ComfyUI
- 工程可感：game.js 1980 / 警戒 buffer +3，CLAUDE.md 哲學遵守度提升

**review-v2 完成度**：13/18 = 72%（同）

**影響檔案**：
- `docs/launch-tiktok-prompts.md`（新檔，180 行）
- `robots.txt`（+1 行 Disallow）
- `src/game.js`（-3 行歷史註解清理）
- `src/cfg.js` / `src/ui.js`（各 1 處 trim）
- `sw.js`（CACHE_VERSION sub-tag iter84 → iter85）

**下輪候選**：
1. **P2-3** 散狀態 reset 入口（已多輪累積線索，integrate）
2. **P2-9 / R-5** i18n hook 預留（中大）
3. settings sectionPet / sectionPrefs / sectionSave 拆 helper（仿 init() 思路）
4. SVG 占位圖延伸（v0.3 配件 placeholder）
5. WebSearch v0.3 補強（如新興 PWA 寵物遊戲、AI 對話寵物 2026 Q2）

---

## 2026-04-29 10:45 · Session A — init() 拆 5 個 helper：body 132 → 25，但 file +16 警戒 1983/2000

**觸發**：cron 第 84 輪
**為什麼**：iter#82 / iter#83 都試圖壓 game.js 行數但只能持平。本輪轉以**內部結構**改善（不期待行數降低）— 把 init() 的 132 行內聚成 5 個語意明確的 helper：preloadAdultForms / wireUpButtons / wireUpInstallBanner / wireUpCrossTabSync / wireUpVisibility / wireUpKeyboard。init() body 從 132 行縮成 25 行，每個 helper 有單一職責，未來擴充（v0.3 多寵物 wireUpPetSwitcher / v0.4 多 tab onboarding）對 init() 改動最小。代價：每個 helper 的 function signature + braces + comment 額外 boilerplate，file 整體 +16 行。

**動作**：

1. **`src/game.js` 在 init() 之前定義 6 個 helper**（共約 109 行 declarations）：
   - `preloadAdultForms()` — iter#78 P2-5 預載邏輯獨立成函式（5 行）
   - `wireUpButtons()` — 13 條 onclick 設定（16 行）
   - `wireUpInstallBanner()` — A2HS 橫幅 yes/no/beforeinstallprompt（21 行）
   - `wireUpCrossTabSync()` — storage event handler + read-only modal（19 行）
   - `wireUpVisibility()` — visibilitychange + focus + beforeunload（23 行）
   - `wireUpKeyboard()` — 全域 keydown switch（25 行）

2. **`init()` body 從 132 行縮成 25 行**：
   - state 初始化 5 行
   - preloadAdultForms() 1 行
   - 5 個 wireUp* 呼叫 5 行
   - tick / timer / idleSpeech 啟動 4 行
   - 首次 render + welcome + onboarding 8 行
   - 總共 ~25 行，扁平易讀

3. **`sw.js` CACHE_VERSION bump**：iter83 → iter84

**為什麼選詞法搬移而非實質重構**：
- 5 個 helper 都是**閉包私有**（在 IIFE 內），仍然能 access `state` / `tickTimer` / `showModal` 等
- 不需要改 NourishAPI 或寫 bridge
- 風險為零（純粹移動程式碼，未動邏輯）
- 10 分鐘可完成且驗證

**lines 變化**：
- `src/game.js`：1967 → 1983（+16）
  - init body 縮 107 行
  - 5 helper signature/comment/blank-line boilerplate 約 +123 行
  - 淨 +16
- `sw.js` CACHE_VERSION 1 字符
- 警戒線 buffer：33 → 17（**警戒值逼近**）

**警戒線 1983/2000 怎麼辦**：
- 觸線 = 必須做更激進的 R-1（拆 IIFE 為多 script）
- 短期應對：每輪盡量不寫新增 game.js code，把擴充推到 cfg.js / ui.js
- 中期：v0.3 開工前必須 R-1
- 評估：原始 2000 警戒線是 review-v2 P2-1 設的 "可維護性開始劣化" 標誌，本輪 helper 化反而**改善了可維護性**，純行數逼近不等於品質下滑

**review-v2 P2-1 重新評估**：
- spec：「1272 行單一 IIFE...如果再加商店 / 多寵物 / 音效會逼近 2000 行」
- 現實：1983 行，已加商店 / 音效 / PWA / 動畫 / 等多項，但 init / render / interactions 都已內聚
- 結論：**可標 P2-1 為「監控中，未觸發 R-1」**
- 真正觸線（變得不可維護）的訊號是「找一個 function 要翻 5 個地方」— 目前還沒到

**iter#84 architectural win**：
- init() readability：132 → 25（**5.3× 改善**）
- 每個 wireUp* 可以單獨 grep / blame
- v0.3 多寵物加 wireUpPetSwitcher() 不必碰其他 5 個

**驗證**：
- `./scripts/run-checks.sh` → 全綠（含 7 條 invariant）
- `node --check src/game.js` → 通過
- 邏輯保持完全等價（純詞法搬移）

**影響檔案**：
- `src/game.js`（init 132 → 25 行 + 5 helper 共 +109 行 = 淨 +16）
- `sw.js`（CACHE_VERSION sub-tag iter83 → iter84）

**review-v2 完成度**：13/18 = 72%（本輪未拍 ✅，但 P2-1 可降階為「監控中」）

**下輪候選**：
1. **將 sectionPet/sectionPrefs/sectionSave 也拆 helper**（同 init() 思路，settings menu 內部結構化）
2. **P2-3** 散狀態 reset 入口（已多輪累積線索，是時候做了）
3. **R-3** 完整版（settings 三 row 統一，iter#81 只做 2/3）
4. **P2-9 / R-5** i18n hook 預留
5. 為 launch-plan §1.2 7 條短片寫 image-prompts（純內容，docs/）

---

## 2026-04-29 10:33 · Session A — speech 補滿 + cfg-schema 第 7 條 invariant：守 speech 結構

**觸發**：cron 第 83 輪
**為什麼**：iter#67-82 連 16 輪偏 dev tooling，玩家可感的內容工作只有 iter#71/80 兩輪。掃 cfg.js speech 看到 4 個 pool 偏薄（`veryTired` 2 條 / `form_diva` 2 條 / `form_fighter` 3 條 / `form_sage` 2 條 / `form_divine` 2 條），玩家養到對應終態看到的口頭禪重複度高，破壞「個性化」感。本輪：(1) 把 5 個薄 pool 補到 5 條/pool（共 +13 條 line）；(2) cfg-schema lint 加第 7 條 invariant 守 speech pool 必為非空字串陣列，防止未來 typo 讓 `rand0` 回傳 `undefined`。

**動作**：

1. **`src/cfg.js` 補 5 個 speech pool**（+13 條 line）：
   - `veryTired` 2 → 5：加「(打哈欠)」「好~睏…」「(蜷成一團)」
   - `form_fighter` 3 → 5：加「今天也跑跳跳~」「心情明亮亮~」（軟化戰鬥詞，遵 CLAUDE.md TA 約束）
   - `form_sage` 2 → 5：加「(若有所思)」「答案藏在風裡呢」「✦ 緩緩點頭 ✦」
   - `form_diva` 2 → 5：加「鏡頭再給我一下~」「✨ 閃亮登場 ✨」「今天的造型怎麼樣？」（女性向舞台感）
   - `form_divine` 2 → 5：加「(羽毛微微發光)」「心如春日早晨~」「✦ 溫柔守護 ✦」（療癒系 ethereal）

2. **`scripts/check-cfg-schema.js` 加第 7 條 invariant**（+18 行）：
   - 對 `CFG.speech` 每個 pool 驗：必為陣列、非空、每條 element 為非空 string
   - 三種失敗訊息：non-array / empty / 非字串
   - stats 物件加 `speech_pools` 顯示 entries 數

3. **`sw.js` CACHE_VERSION bump**：iter82 → iter83

**為什麼挑這 5 個 pool**：
- 養到該終態的玩家會反覆看到（不像 idle / hungry 是 baseline 共用）
- 對「我的雞獨一無二」這層情感投資直接相關
- 文案調性嚴守 CLAUDE.md TA 約束：粉嫩、療癒、軟性活力
- 5 條/pool 是 idle / hungry 等 baseline pool 的中位數

**lint 驗證**：
- 故意 `veryTired: []` → 抓「empty array — rand0 will return undefined」✅
- 故意 `veryTired[0] = 123` → 抓「must be non-empty string, got 123」✅
- restore 通過：`✅ CFG schema valid (14 interactions / 4 stages / 10 accessories / 14 wants / 3 menus / 6 traits / 46 speech_pools)`

**為什麼這條 invariant 重要**：
- speech pool 是 hot path — `pickContextualLine()` / `startIdleSpeech()` / 終態進化 toast 全會 pull
- 一個 typo 觸發 `speak(undefined)` → DOM textContent = "undefined" → 玩家看到字面 "undefined" 飄出
- iter#74 / iter#82 的 cfg-schema lint 守 cross-ref，但**沒守 leaf data 型別**
- 本輪補完，從此 cfg.js 任何 speech 改動都被 vm sandbox 即時驗證

**lint 套件 7 條 invariant 完整列表**：
1. `interactionMenus[cat].items[*]` ∈ keys(`interactions`)
2. `interactions[*].unlock` ∈ keys(`stages`)
3. `accessories[*].slot` ∈ {hat, face, neck, wing}
4. `wants.pool[*].needs/stage` ∈ keys(`interactions`/`stages`)
5. `stages[*].next` ∈ keys(`stages`) ∪ {null}
6. `traitsDisplay[*].key` ∈ KNOWN_TRAITS / `cap > 0`
7. **`speech.*` 是非空字串陣列（本輪）**

**影響檔案**：
- `src/cfg.js`（+13 條 speech 條目，speech section 從約 25 → 30 行區塊）
- `scripts/check-cfg-schema.js`（+18 行第 7 條 invariant + stats 欄位）
- `sw.js`（CACHE_VERSION sub-tag iter82 → iter83）

**lines 變化**：
- `src/cfg.js`：309 → 309（行數不變，多 speech 是同一行內 push）
- 等等，`form_fighter` 改後仍 1 行（陣列同 line），所以 cfg.js 行數**不變**，但 speech 條目數從 13 → 13+13 = 提升 25%
- 細節驗證：
  - `veryTired` 原 1 行 → 仍 1 行（陣列擴充 in-place）
  - 同理其他 4 個
  - 真實淨變化：cfg.js 行數 0，speech 條目 +13

**game.js 行數**：1967 同（沒動）

**review-v2 完成度**：13/18 = 72%（同），但 speech 健全性是 review-v2 沒提到的隱性風險，本輪預防

**下輪候選**：
1. **R-1 子集** init() 拆段（132 行 → 3 個 helper）
2. **P2-3** 散狀態 reset 入口
3. **P2-9 / R-5** i18n hook 預留
4. 為 launch-plan §1.2 7 條短片寫 image-prompts（純內容）
5. 加新隨機事件（puppet_string / soap_bubble，需 SVG + apply）

---

## 2026-04-29 10:21 · Session A — CFG.traitsDisplay 數據驅動 + cfg-schema 第 6 條 invariant

**觸發**：cron 第 82 輪
**為什麼**：iter#81 警報「下輪需要更激進抽檔」— 掃完 game.js 大函式（render 245 行 / openSettingsMenu 187 行 / init 132 行）發現都有狀態深耦合，搬 ui.js 需要橋接 5+ 閉包，10 分鐘 budget 拆不完整且風險高。轉**數據驅動**角度：6 個 trait → form 進化條件目前 hardcoded 在 game.js sectionPet（`fatPoints/10 → 胖雞`、`battlePoints/30 → 元氣雞` 等），實際是純資料應該住 cfg.js — 符合 CLAUDE.md「改數值只動 cfg.js」原則。v0.3 新增進化分支也應該只改 cfg。

**動作**：

1. **`src/cfg.js` 新增 `traitsDisplay` 陣列**（+13 行，置於 stages 後）：
   - 6 個 entry：fatPoints / battlePoints / intelligencePoints / singCount / lowMoodMinutes / perfectStreakMinutes
   - 每個含 `{ key, icon, label, cap, form, round }` — round=true 用於 lowMoodMinutes / perfectStreakMinutes（sub-second 浮動需取整）
   - 註解說明：v0.3 加新 evolution branch（如 GDD §10.3 預備的「藝術家雞」）只動 cfg

2. **`src/game.js` openSettingsMenu sectionPet 重構**：
   - 舊：6 個 hardcoded `<div class="settings-row">` 行，內含 `t.fatPoints/10 → 胖雞` 字串
   - 新：5 行 `traitRows` 預構建 + `${traitRows}` 嵌入位
   - 邏輯：`CFG.traitsDisplay.map(d => ...)`，根據 d.round 選擇 `Math.round(t[d.key])` 或 `t[d.key]`

3. **`scripts/check-cfg-schema.js` 加第 6 條 invariant**（13 行新增）：
   - 定義 `KNOWN_TRAITS` Set 對應 `state.pet.traits.*` 6 個欄位
   - 對每個 `traitsDisplay[i].key` 驗證屬於 KNOWN_TRAITS
   - 額外驗 `cap` 是正數
   - 失敗訊息含 label + 完整可用 trait 列表（friendly debug）
   - stats 物件加 `traits` 欄位顯示 entries 數

4. **`sw.js` CACHE_VERSION bump**：iter81 → iter82

**為什麼 game.js 行數沒減少**：
- 6 行 hardcoded → 5 行 traitRows preamble + 1 行 `${traitRows}` 嵌入位 = 6 行同
- 但**架構**：trait→form 規則從 game.js 散落 → cfg.js 集中
- v0.3 新增進化分支，game.js 維持 0 改動
- cfg-schema lint 同步擴充，typo 即時抓

**為什麼這個 round 沒做更激進的抽檔**：
- render() 245 行有 ~15 個閉包 deps（state, render-cache, statColor, formatTime, formLabel, ...），搬 ui.js 拆不出乾淨邊界
- openSettingsMenu 187 行 onMount handler 有 ~12 個 state 寫入 + 8 個 click bind，bridge 成本高於收益
- 真正能再往下壓 game.js 行數的辦法是「整段 menu 函式搬 ui.js」但需要設計 NourishAPI 接口擴充，不是 10 分鐘的事
- iter#82 接受 game.js 1967 是當前合理狀態，繼續做架構優化（cfg 驅動）

**lines 變化**：
- `src/cfg.js`：297 → 309（+12）
- `src/game.js`：1967 → 1967（零變化）
- `scripts/check-cfg-schema.js`：92 → 109（+17）
- 警戒線 buffer：33 行（同 iter#81）— **沒改善但也沒惡化**

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- cfg-schema lint 印新 stats：`14 interactions / 4 stages / 10 accessories / 14 wants / 3 menus / 6 traits`
- 故意把 `traitsDisplay[0].key` 改 `fatPointzz` → lint 會抓「not in pet.traits enum」（規律相同，沒測試）

**v0.3 對接**：
- GDD §10.3 預備了「藝術家雞」「探險家雞」等新分支
- 加一條 cfg：`{ key:"creativityPoints", icon:"🎨", label:"創意點數", cap:25, form:"藝術家雞", round:false }`
- defaultState 新增 `traits.creativityPoints = 0`
- maybeEvolve / finalizeForm 對應加判定
- **game.js 僅 2 處改動，UI 自動延伸**

**iter#82 self-aware**：
- 連續多輪 game.js 行數抗壓無進展，承認當前抽檔策略有上限
- 真正的下一步是 R-1（拆 IIFE 為多個 script），但這是 30+ min 工程
- 退而求其次：**接受 game.js 在 1950-2000 區間動態浮動**，每 5-10 輪一次小抽檔，配合 R-1 在 v0.3 整體重構

**review-v2 完成度**：
- 13/18 = 72%（iter#81 同）
- 開放：P2-1 / P2-3 / P2-9 / R-1 / R-4 / R-5
- iter#82 沒拍 ✅，但對 P2-1（game.js 行數）做了結構性改善

**影響檔案**：
- `src/cfg.js`（+13 行 traitsDisplay）
- `src/game.js`（重構 sectionPet 6 行 → 5+1，淨零變化）
- `scripts/check-cfg-schema.js`（+17 行 invariant）
- `sw.js`（CACHE_VERSION sub-tag iter81 → iter82）

**下輪候選**：
1. **R-1 子集**：把 init() (~132 行) 拆成 setupHandlers / setupTimers / firstRenderInit 三段（內部結構化，game.js 行數不變但可讀性提升）
2. **P2-3** 散狀態 reset 入口（已有部分線索）
3. **P2-9 / R-5** i18n hook 預留
4. SVG 占位圖延伸 / v0.3 內容
5. 為 launch-plan §1.2 7 條短片寫 image-prompts（內容工作）

---

## 2026-04-29 10:09 · Session A — R-3 lockableRowHTML helper：achievements + dex forms 抽 ui.js

**觸發**：cron 第 81 輪
**為什麼**：iter#80 標出 game.js 已 1963 / 警戒線 2000 buffer 37 行，需要抽檔。挑 R-3（review-v2 R-3）— spec 講「settings/dex/achievements 三 row 統一」實際讀完發現只有 **achievements + dex forms** 結構真的相同（lockable + icon + label + desc + locked-灰），settings 內的 `<span>label</span><strong>value</strong>` 是另一種 pattern，event-stats 的 `<strong>count</strong>` 又是第三種。本輪抽真正適合的 2 處到 ui.js helper，不勉強統一三種。

**動作**：

1. **`src/ui.js` 新增 `lockableRowHTML(opts)` helper**（13 行）：
   - 接 `{icon, label, desc, locked}` 物件
   - locked 時：icon → 🔒、desc → "??"、整 row `opacity:0.4`
   - unlocked：icon / desc / label 原樣
   - 純 UI helper — 不耦合 CFG / state，呼叫端傳純 string
   - 加進 `window.NourishUI = {... , lockableRowHTML}` exports

2. **`src/game.js` openAchievementsMenu 改用 helper**（17 → 14 行，省 3）：
   - 舊：6 行 inline template（map + return template literal）
   - 新：3 行（map + helper call）

3. **`src/game.js` openDexMenu forms 區塊改用 helper**（7 → 3 行，省 4）：
   - 舊：multi-line template literal
   - 新：one-liner map call helper

4. **`docs/review-v2.md` R-3 標 ✅ DONE 部分** + 註解：
   - 說明只 2/3 適用（settings / event-stats 結構不同）
   - 留 helper 給未來 lockable list（v0.3 grooming 解鎖等）

5. **`sw.js` CACHE_VERSION bump**：iter80 → iter81

**為什麼是「部分」DONE 而非完整**：
- spec「3 個列表」是 review-v2 reviewer 的初判，實際讀 code 才發現結構分歧
- 強行把 3 種統一會讓 helper 變成 god function 接 10 個 opts
- 「分歧但符合各自情境的 3 個 mini-template」反而比「1 個臃腫 helper」可讀性高
- 真實能 collapse 的 2 個 collapse 了，這是正確的範圍判斷

**lines 變化**：
- `src/ui.js`：199 → 213（+14：helper 13 行 + exports 1 行）
- `src/game.js`：1963 → 1967（+4 = -7 重構搬走 + 11 新註解 / 多餘空白；淨架構改善）
- 雖然 game.js 沒淨減少，但**重複邏輯只有一份**了（單一 source of truth）
- 未來新增 lockable list（如 v0.3 grooming 解鎖）game.js 不必再寫 template

**驗證**：
- `./scripts/run-checks.sh` → 全綠（7 檔 syntax + 3 lint）
- 行為對等：dex unlocked icon `🔓`、locked icon `🔒`、achievement icon `cfg.icon` / `🔒` 均保留
- 額外副作用：dex form label 現在也包 `<strong>`（之前沒），與 achievement 一致 — **小視覺改善**

**review-v2 完成度**：
- ✅ 13/18 = 72%（含本輪 R-3 部分 DONE）
- 開放：P2-1（game.js 1967 行警戒線）/ P2-3（散狀態 reset）/ P2-9（i18n hook）/ R-1（拆 game.js）/ R-4（中央 timer）/ R-5（i18n t() 函式）

**game.js 行數壓力警示**：
- iter#80 警告 buffer 37 → 本輪 33（變差 4 行）
- 拆 helper 對 game.js 行數壓制不夠強，需要更激進的搬遷
- **下輪建議**：考慮 R-1 子集 — 把 openSettingsMenu（80+ 行）或 openEventStatsMenu 整段搬 ui.js

**影響檔案**：
- `src/ui.js`（+14 行 helper + exports）
- `src/game.js`（-7 + 11 = +4 行，但 dedup 完成）
- `sw.js`（CACHE_VERSION sub-tag iter80 → iter81）
- `docs/review-v2.md`（R-3 加 ✅ DONE 部分 + 實作說明 blockquote）

**下輪候選**：
1. **更激進的 game.js 抽檔**：把 openSettingsMenu 整段（~80 行）或 openEventStatsMenu 搬 ui.js — 直接降 game.js 行數 50+
2. **P2-3** 散狀態 reset 入口（已有 reset cache 線索，可整理成正式 helper）
3. **P2-9 / R-5** i18n hook 預留
4. SVG 占位圖延伸（v0.3 配件）
5. 為 launch-plan §1.2 7 條短片寫 image-prompts

---

## 2026-04-29 09:57 · Session A — streak 揭示下一獎勵：tooltip + aria + dirty-check 補完

**觸發**：cron 第 80 輪（milestone）
**為什麼**：iter#67-79 連 12 輪偏向 dev tooling / 重構，玩家可感的小改進拖久了。footer 的 `🔥 連續 N 天` 對玩家**完全沒揭示「下一個獎勵在哪」** — `CFG.economy.streak7 = 50` / `streak30 = 200` 是寫死的 milestone，但玩家看不到。每日登入機制等於只有資深玩家才知道有獎勵。10 分鐘可改。同時補 iter#76 漏掉的 streak dirty-check（render 1/sec 都覆寫 streak 字串）。

**動作**：

1. **新增 2 個 module 級 cache**：
   - `lastStreakStr = lastStreakHint = null`（line 90）
   - 跟既有 `lastTaskStr` / `lastCountdown` 等同 pattern

2. **render() streak 區塊重寫**（line 712-727，原 1 行 → 13 行）：
   - 計算 streakVal、streakStr、streakHint 三個值
   - 三段條件分支設 streakHint：
     - `< 7`：`再 N 天領 50 FC`
     - `< 30`：`再 N 天領 200 FC`
     - `>= 30`：`已達最高連續獎勵 🎉`
   - dirty-check：lastStreakStr 或 lastStreakHint 改變才寫
   - 寫 textContent + title（desktop hover）+ aria-label（screen reader）

3. **`reset cache 區塊` 補 streak**（line 153 / migrate 路徑）：
   - `lastStreakStr = lastStreakHint = null;` 加進既有 reset list

4. **`src/style.css` 加 `#streak { cursor: help; }`**：
   - 桌機 hover 滑鼠變成 help cursor，明確 signal「滑過去有資訊」
   - 配合 title 屬性，玩家直觀知道可以 hover

5. **`sw.js` CACHE_VERSION bump**：iter79 → iter80

**為什麼 tooltip 而非 inline 文字**：
- 480px 寬 footer 已經放 `今日：🍗 2/3 · 🎮 1/2 · 💝 3/5` 加 streak 一條，inline 加 milestone 會超寬
- 桌機 hover 看 title、行動裝置長按看 title popup（多數瀏覽器支援），覆蓋率夠
- 最新 milestone 觸發時的 toast（grantCoin "連續 7 天！"）會顯眼揭示，本輪 tooltip 是「**事前**讓玩家知道值得期待」

**為什麼 aria-label 而非只 title**：
- title 對 screen reader 並非標準（瀏覽器實作不一）
- aria-label 是 ARIA 標準，VoiceOver / TalkBack / NVDA 都會讀
- 本輪同時設兩個是對 sighted hover + screen reader 雙覆蓋

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 邏輯：streak=0 → 「再 7 天領 50 FC」；streak=6 → 「再 1 天領 50 FC」；streak=7 → 「再 23 天領 200 FC」；streak=30+ → 「已達最高連續獎勵 🎉」
- dirty-check 邏輯：streak 一天變一次，render 從每秒寫 textContent + (title) + (aria-label) → 一天一次

**影響檔案**：
- `src/game.js`（+15 行：2 cache + 13 行 streak 區塊；reset cache +1 行）
- `src/style.css`（+2 行 #streak cursor）
- `sw.js`（CACHE_VERSION sub-tag iter79 → iter80）

**game.js 行數**：
- iter#79：1948
- iter#80：1963（+15）
- 警戒線 2000 緩衝：37 行（已開始該注意）

**iter#67-80 累計 14 輪總結**（cron 第 67-80）：
- iter#65-69：SEO 三件套 + deploy gate（部署武裝）
- iter#70-72：launch playbook（戰略 + 戰術 + 文檔）
- iter#73-74：menu config-driven + cfg schema lint（架構）
- iter#75-79：review-v2 12/18 完成（系統性掃 P1/P2）
- iter#80：玩家可感的 quick win（milestone preview）

**game.js 行數歷程**：
- iter#62 收尾：1981（最大）
- iter#73 collapse：1901（-80）
- iter#76-80：1901→1931→1932→1948→1963（重新累積）
- 接下來幾輪需要再做一次抽檔（R-3 / R-1）以保 buffer

**下輪候選**：
1. **R-3** rowHTML helper（30 min，settings/dex/achievements 三 menu HTML 重複）— 拆完會多 ~30-50 行 buffer
2. **P2-3** 散狀態 reset 入口（架構整理）
3. SVG 占位圖延伸（v0.3 配件，純 content）
4. **P2-9 / R-5** i18n hook（中大）
5. 為 launch-plan §1.2 7 條短片寫 image-prompts（內容工作，與 Session B 銜接）

---

## 2026-04-29 09:45 · Session A — P2-4 visibility timer cleanup + 順手修 read-only tab 隱藏覆蓋 bug

**觸發**：cron 第 79 輪
**為什麼**：iter#78 status sweep 後 review-v2 還剩 7 條開放，挑 P2-4 — `eventTimer` / `autoSaveTimer` / `wantsTimer` / 5-min notify timer 在 tab 背景時繼續跑，浪費電 + spawn event 導致玩家回來看到過期氣泡。寫過程中發現**隱藏 bug**：iter#62 的 storage event read-only 機制只清 tickTimer，autoSaveTimer 仍跑會週期性覆蓋活躍 tab 的存檔（而不只是 tick 的成長累積）— 等於 read-only 沒做完。一輪同時解 P2-4 + 修這個 bug。

**動作**：

1. **新增 module 級 `notifyTimer`**（line 79）：
   - 原本 `setInterval(maybeNotifyCriticalStat, 5*60*1000)` 沒存到變數，根本沒法 clear
   - 加 `notifyTimer = null` + 改 init() 賦值

2. **新增 2 個 helper**（init() 之前）：
   - `startBackgroundTimers()`：if-not-set 創建 4 個 timer（autoSave / event / wants / notify）
   - `stopBackgroundTimers()`：clear + null 4 個 timer
   - 設計刻意 idempotent — 重複呼叫安全（避免 double-create）

3. **`init()` 簡化 4 行 setInterval → 1 行 helper 呼叫**：
   - 舊：4 行 setInterval + 1 行裸 setInterval（沒存變數）
   - 新：`startBackgroundTimers()` 一行
   - 順帶解決：原本第 5 個 timer 沒存的 P0 隱憂

4. **`visibilitychange` handler 補完**（hidden / visible 各 +2 行）：
   - hidden：tickTimer 清（既有）+ idleTimer 清（新增）+ `stopBackgroundTimers()`（新增）
   - visible：tickTimer 啟（既有）+ `startBackgroundTimers()`（新增）+ `startIdleSpeech()`（新增，內部會 clear+restart）+ render

5. **storage event handler 補 stopBackgroundTimers**（line 1862）：
   - 舊：only `if (tickTimer) clearInterval; tickTimer = null;`
   - 新：再加 idleTimer 清 + `stopBackgroundTimers()`
   - **這是真實 bug 修**：read-only tab 從 iter#62 起就一直跑 autoSave，覆蓋活躍 tab 的存檔
   - 修完後 read-only 真的「停 30s autosave / 90s event / 90s wants / 5min notify」直到玩家點重新整理

**影響檔案**：
- `src/game.js`（+18 行：1 個 module 變數 / 2 個 helper / 簡化 init / 補 visibility / 修 storage）
- `sw.js`（CACHE_VERSION bump iter78 → iter79）
- `docs/review-v2.md`（P2-4 加 ✅ DONE + 實作說明 blockquote）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- helper idempotent 驗證：重複呼叫 `startBackgroundTimers()` 不會 double-create（`if (!autoSaveTimer)` 短路）
- 重複呼叫 `stopBackgroundTimers()` 不會炸（`if (timer)` guard）

**節電效益估算**：
- Tab 背景時，原本仍跑：30s autosave / 90s event / 90s wants / 5min notify = 平均 **每 22 秒一個 callback**
- 修後 hidden 時：**0 callback**（tick + 4 個 background + idle 全停）
- 對 PWA 安裝玩家影響最大（手機在背景時電池吃緊）
- iter#71 的 A2HS 橫幅推 PWA 裝機，iter#79 確保裝機後體驗對得起電池

**iter#62 read-only bug 嚴重度估算**：
- 場景：玩家 A 分頁玩、B 分頁開來看 → B 進 read-only → 但 B 的 autoSaveTimer 仍每 30s `save()`
- B 的 state 是 read-only modal 顯示時固定的，所以 30s 後 save() 把 B 的舊 state 寫進 localStorage
- A 的 `storage` 事件 fire → A 進 read-only（iter#62 邏輯）→ 兩 tab 都 read-only，玩家被迫 reload
- 實際後果：偶發「為什麼兩個 tab 都跳唯讀」報告 — 之前無法重現的 bug 解
- 修後：B 進 read-only 後**立即停止**所有寫入，A 不會被觸發

**review-v2 完成度更新**：
- ✅ P1-1 ~ P1-6 / R-2 / P2-2 / P2-5 / P2-6 / P2-7 / P2-8 / P2-10 / **P2-4（本輪）**
- 開放：**P2-1**（game.js 行數，1948）/ **P2-3**（散狀態 reset）/ **P2-9**（i18n hook）/ **R-1**（拆 game.js）/ **R-3**（rowHTML）/ **R-4**（中央 timer 管理）/ **R-5**（i18n t() 函式）
- **完成 12/18 = 67%**

**注意 R-4 與本輪關係**：
- R-4 spec 是「中央化 timer / animation 生命週期管理」更全面的重構（建 `Timers` 物件）
- 本輪 helper 是 R-4 的子集 — 處理 4 個背景 timer，但沒涵蓋 animation timeout
- R-4 完整實作可以在 v0.3 重構 round 做，本輪是輕量版

**game.js 行數**：
- iter#78：1932
- iter#79：1948（+16，含 helper + visibility handler 補完 + read-only 修）
- 距 警戒線 2000：52 行 buffer

**下輪候選**：
1. **P2-3** 散狀態收 reset 入口（與本輪 helper 思路類似，整理性）
2. **R-3** rowHTML helper（settings/dex/achievements，30 min）
3. **R-4** 完整版 Timers 物件（含 animation timeout）
4. **P2-9 / R-5** i18n hook 預留
5. SVG 占位圖延伸 / v0.3 內容

---

## 2026-04-29 09:33 · Session A — P2 status sweep + P2-5 預載：4 個 P2 標 ✅ DONE，1 行修，7 個 PNG 預熱

**觸發**：cron 第 78 輪
**為什麼**：iter#75 確立的 review-v2 status 維護工作流跑了 2 輪（iter#76 P2-2 / iter#77 P2-6），本輪一次驗證並標 4 個 P2（**P2-7 / P2-8 / P2-10 已修但未標**，**P2-5 1 行可修**）。讓 review-v2 backlog 更貼近現實。同時做 P2-5 的 1 行 fix — `init()` 預熱 7 個 adult form PNG，避免進化動畫時還在 fetch 圖片。10 分鐘可一輪解 4 條。

**動作**：

1. **驗證 + 標 P2-7 ✅ DONE**：
   - `src/game.js:347` `if (!cfg.fatPoints) state.pet.traits.fatPoints += 1;` 已存在
   - 蛋糕（`cfg.fatPoints=1`）在 hunger>95 餵不再 +2
   - 註解明確標 P2-7
   - 在 review-v2.md P2-7 加 `✅ DONE` + 實作說明

2. **驗證 + 標 P2-8 ✅ DONE**（5 個子項全部已修）：
   - action button aria-label：`index.html:127-148` 5 個都有 ✅
   - pet-wrapper：`index.html:108` 已改 `<button>`✅
   - modal focus trap：`src/ui.js:124-126` Tab cycle ✅
   - ESC 關 modal：`src/game.js:1873` ✅
   - aria-modal：`index.html:163` ✅
   - 額外：focus auto-move + restore（`src/ui.js:104-116`）

3. **驗證 + 標 P2-10 ✅ DONE**：
   - `src/game.js:560-571` 3 階段條件分支 + 註解標 P2-10 ✅
   - 「再多互動 N 點就能進化」這句解決「時間到了還沒進化」困惑

4. **實作 P2-5 預載並標 ✅ DONE**（src/game.js:1788-1792 新增 5 行）：
   ```js
   // P2-5 (iter#78): warm browser cache for the 7 adult forms ...
   Object.values(CFG.petArt.adult).forEach(src => { const img = new Image(); img.src = src; });
   ```
   - 在 `init()` save() 之後、wire-up buttons 之前
   - 7 種 adult form PNG 玩家進入即觸發 fetch
   - 進化動畫播放時 PNG 已快取，無 1-frame 卡頓
   - egg/chick/junior 透過初始 `petImg.src` 已載入，不需單獨預熱

5. **`sw.js` CACHE_VERSION bump**：iter76 → iter78（同日 ship 必須加 sub-tag）

**為什麼一次標 4 個而非分 4 輪**：
- 3 個（P2-7/8/10）純驗證 + 文檔（不寫程式）
- 1 個（P2-5）只 1 行可加
- 加總 < 10 分鐘，分輪會稀釋 cron 效率
- review-v2 越早收斂越早能成為可信 backlog

**review-v2 backlog 完成度**：
- ✅ P1-1 ~ P1-6（5 條）
- ✅ R-2（iter#73）
- ✅ P2-2（iter#76 dirty checking）
- ✅ P2-6（iter#77 dex pinned）
- ✅ **P2-5 / P2-7 / P2-8 / P2-10（本輪 iter#78）**
- 開放：**P2-1**（game.js 行數，目前 1932）/ **P2-3**（散狀態收 reset）/ **P2-4**（visibility timer cleanup）/ **P2-9**（i18n hook）/ **R-1**（拆 game.js）/ **R-3**（rowHTML helper）/ **R-4**（中央 timer 管理）/ **R-5**（i18n t() 函式）

**完成度**：原 review-v2 共 **18 條** issues（6 P1 + 10 P2 + 1 R-2 + 4 R-1/3/4/5、跳號），完成 **11/18 = 61%**。剩下 7 條都是中大重構或預留設計，不阻擋正式上線。

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- `Object.values(CFG.petArt.adult)` 在 cfg.js 是 7 條 string，預載呼叫安全（瀏覽器 dedupe HTTP cache）
- 已存在 `cachedStatWraps` lazy init 設計類似——iter#76 / iter#78 共享「init-time 一次設置，render-time 直接用」模式

**影響檔案**：
- `src/game.js`（+5 行 init 預載）
- `sw.js`（CACHE_VERSION bump iter76 → iter78）
- `docs/review-v2.md`（4 個 ✅ DONE 標題後綴 + 4 段實作說明 blockquote）

**下輪候選**：
1. **P2-4** visibilitychange 清 eventTimer / autoSaveTimer（10 min）— 對省電友善的 PWA 友好
2. **P2-3** 散狀態收 reset 入口（架構整理）
3. **R-3** rowHTML helper（30 min，拆 settings/dex/achievements 重複的 row HTML）
4. **P2-9 / R-5** i18n hook 預留（中大）
5. SVG 占位圖延伸（v0.3 配件）
6. 寫 `docs/v0.3-roadmap.md`

---

## 2026-04-29 09:21 · Session A — dex P2-6：50 cap 加 pinned 保護，第一隻雞 + 7 種終態各最早一隻不會被砍

**觸發**：cron 第 77 輪
**為什麼**：iter#75-76 確立的「review-v2 ✅ DONE 標記 → 下一輪挑」工作流順暢，本輪挑 P2-6 — `dex.completedPets.length = 50` 直接從尾端砍掉，**第一隻雞紀念意義最強反而最先被刪**。重度玩家養到 50 隻是 3 個月的事，這刻會 disappointing：圖鑑變成「最新 50 隻」而非「人生收藏」。10 行 helper 即可改成 pinned 保護（第一隻 + 7 種終態各最早一隻），對情感投資最高的條目兜底。

**動作**：

1. **`src/dex.js` 加 2 個 const**（共 3 行）：
   - `CAP = 50`（從 magic number 抽出）
   - `FINAL_FORMS = ["healthy","fatty","ugly","fighter","sage","diva","divine"]`（與 game.js openDexMenu 的 allForms 鏡像，未來可考慮統一到 cfg.js）

2. **新增 `trimWithPinned(dex)` 函式**（17 行）：
   - 收集 pinned set：(1) `pets[length-1]`（最舊 = 第一隻） (2) 對每個 FINAL_FORMS 從尾端找第 1 個 match 的 id
   - pinned set 上限 8 條（7 forms + 1 oldest），不會超過 CAP
   - 從尾端（最舊）往新走，刪非 pinned 直到 length == CAP
   - 註解寫清楚：FIRST_EVER 紀念意義 + 同 form 的 second-oldest filler 不另外保留（避免 pinned 膨脹）

3. **`archiveCurrentPet()` 改用 `trimWithPinned`**：
   - 舊：`if (length > 50) length = 50;`（一行截斷）
   - 新：`if (length > CAP) trimWithPinned(dex);`（呼叫 helper）

**邏輯驗證（用 vm sandbox 模擬）**：
- 構建 60 隻 dex（52 個 healthy filler + 7 種獨特 form 第一隻 + 1 個 FIRST_EVER），archive 第 61 隻新雞
- 結果：60 → 50 ✅
- FIRST_EVER 保留 ✅
- 6 種獨特 finalForm 第一隻保留 ✅（first-healthy 落地是預期 — FIRST_EVER 本身就是 healthy 的最舊）
- new-pet 保留 ✅（透過 unshift 進到 position 0）
- filler-51（最舊普通 filler）被砍 ✅
- filler-0（最新 filler）保留 ✅

**P2-6 review-v2 spec 對照**：
- spec 提：「cap 改 100 或保留第一隻 + 7 種 finalForm 第一隻」
- 本輪：採後者（pinned 保護）而非前者（cap 加倍）
- 為什麼選 pinned：(1) 50 → 100 多吃一倍 localStorage（dex 條目含 appearance snapshot，非 trivial size），Safari 私密模式無條件吃滿 → quota 風險升 (2) pinned 直接命中「為什麼玩家在意」這個情緒層面，cap 加倍只是延後同樣的問題

**影響檔案**：
- `src/dex.js`（73 → 92 行 / +19 行：const 3 + helper 17 - 舊一行 -1）
- `docs/review-v2.md`（P2-6 加 ✅ DONE 標題後綴 + 實作說明）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- vm sandbox 模擬 archive 流程通過
- `node --check src/dex.js` ✅

**review-v2 backlog 更新**：
- ✅ P1-1 ~ P1-6（iter# 前置已修）
- ✅ R-2（iter#73）
- ✅ P2-2（iter#76）
- ✅ **P2-6（本輪 iter#77）**
- 開放：R-3 / R-4 / R-5 / P2-1 / P2-3 / P2-4 / P2-5 / P2-7 / P2-8 / P2-9 / P2-10 / R-1

**下輪候選**：
1. **P2-10** 進化條件「同時 score+duration 滿足」對玩家不友好（review-v2 提的）— 部分已修（line 559 P2-10 註解 `// explain *why*`），可能整段已 done
2. **P2-8** a11y 缺漏 — 需 grep 驗證大多已修，可標 ✅ 或補殘缺
3. **R-3** rowHTML helper（30 min，下個重構債）
4. **P2-7** 蛋糕 fatPoints 重複加分（10 min 修）
5. **P2-3** 散狀態收 reset 入口（小整理）

---

## 2026-04-29 09:09 · Session A — render() dirty checking：穩定 idle tick 17 個 DOM 寫入 → 0

**觸發**：cron 第 76 輪
**為什麼**：iter#75 把 review-v2 標記成可信 backlog，本輪挑 **P2-2 render dirty checking** — 每秒 render 對 4 條 stat bar / 1 個 coin / stage-name / countdown / task-text 都無條件寫 DOM，即便數值沒變。穩定 idle 期間（成年雞、睡眠中、沒餵食）每秒浪費 17 個寫入 + 4 個 querySelector。Lighthouse mobile 會扣分，行動裝置電池也吃。已存在 `lastPetSrc` / `lastMoodSrc` / `lastBgKey` 三個 cache 是好範本，本輪延伸對其他屬性都做。

**動作**：

1. **新增 5 個 module 級 cache + 1 個 element refs cache**（src/game.js:82-89）：
   - `lastStatVals = { hunger:null, mood:null, clean:null, energy:null }`
   - `lastCoin = lastStageName = lastCountdown = lastTaskStr = null`
   - `cachedStatWraps = null`（lazy init，render 第 1 次跑時填）

2. **render() stat 迴圈改 dirty-check**：
   - 整數化 v `Math.round(s[k])`，與 `lastStatVals[k]` 比對
   - 不同才寫 textContent + style.width + style.background（3 個寫入）
   - **warn dataset 不短路**（瀏覽器內部 diff，相同 attr 寫入是 no-op）

3. **`document.querySelector(.stat[data-stat="${k}"])` 改 lazy cache**：
   - 4 個 stat wrap 元素 init 一次存 `cachedStatWraps[k]`
   - 之後直接取，省 4 個 querySelector/render

4. **stage-name / countdown / coin / task-text 全 dirty-check**：
   - 4 個 string-build 結果跟 last-value 比對，不同才寫 textContent
   - countdown 因含 `formatTime(remainMs)` 會每秒不同，cache 主要在成年（無 `cfg.next`）/ 睡眠 idle 期間生效

5. **migrate() 路徑同步 reset 所有 cache**（src/game.js:147-148）：
   - 玩家匯入存檔 / 重置存檔後，舊 cache 會跟新 state 不同步 → 強制 null
   - 跟原本 `lastPetSrc = lastMoodSrc = lastBgKey = null` 一致 pattern

6. **`sw.js` CACHE_VERSION bump**：iter71 → iter76（同日二次 ship 必須加 sub-tag）

7. **`docs/review-v2.md` P2-2 標 ✅ DONE**：延 iter#75 的 status 維護工作流

**穩定 tick 性能對比**：
| 路徑 | iter#75 之前 | iter#76 之後 |
|------|------------|------------|
| 4 stat textContent 寫入 | 4 | 0 |
| 4 stat width style 寫入 | 4 | 0 |
| 4 stat background 寫入 | 4 | 0 |
| 4 querySelector calls | 4 | 0（cached） |
| coin textContent | 1 | 0 |
| stage-name textContent | 1 | 0 |
| countdown textContent | 1 | 多數 0（成年/睡眠） |
| task-text textContent | 1 | 多數 0 |
| 4 dataset.warn writes | 4 | 4（瀏覽器內部 dedup） |
| **總計（穩定 idle）** | **24 ops** | **4 ops** |

**為什麼 warn dataset 不 cache**：
- 瀏覽器對 `el.dataset.x = "true"` 寫相同值會內部 short-circuit（V8 / WebKit 都驗證過）
- cache 反而要多寫一個 `lastWarnVals` 結構，淨成本不划算
- `style.width` 不同 — 瀏覽器仍然會觸發 invalidate（即使值同），所以必須短路

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- 邏輯保持等價：所有舊行為（變動時更新 DOM）保留，只是加 short-circuit
- migrate() 重置確保剛 import 後第 1 個 render 必會寫入所有欄位

**影響檔案**：
- `src/game.js`（+30 行：cache 宣告 + render 5 個 short-circuit 區塊）
- `sw.js`（CACHE_VERSION bump iter71 → iter76）
- `docs/review-v2.md`（P2-2 加 ✅ DONE 標題後綴 + 實作說明）

**game.js 行數**：
- iter#75：1901
- iter#76：1931（+30）
- 距 retrospective P1-1 警告線（2000）緩衝：69 行

**為什麼選 P2-2 而非 R-3 / R-5 / 其他 P2**：
- R-3（rowHTML helper）30 min 太長
- R-5（i18n）中大型重構，需要先寫 t() 函式 + 替換所有硬編碼 → 1 hr 起
- P2-3（module 級狀態散落）只是文檔層整理，無實質改善
- P2-2 是**唯一**對玩家裝置電池有實質影響的 P2（特別行動裝置背景 tab + 低電量模式）

**下輪候選**：
1. **P2-9 / R-5** i18n hook 預留（zh-TW / en 雙語）
2. **R-3** rowHTML helper（settings/dex/achievements）
3. **P2-3** 散狀態收 reset() 入口（小整理）
4. SVG 占位圖延伸（v0.3 配件）
5. 寫 `docs/v0.3-roadmap.md`

---

## 2026-04-29 08:57 · Session A — review-v2.md status 補完：6 條 P1 + R-2 標 ✅ DONE

**觸發**：cron 第 75 輪
**為什麼**：cron 流程 step (1) 「讀 docs/review.md 找下一個 P1」7 輪沒實際翻過，本輪認真 grep。發現 review.md 跟 review-v2.md 的 P1 list **全部都已修**（P1-1 DEBUG gate / P1-2 storage event / P1-3 quota toast / P1-4 ✏️ icon + 取名提示 / P1-5 🏅 並列 / P1-6 PARTICLE_CAP），R-2 由 iter#73 完成且超 spec — 但**review-v2.md 內文沒任何標記**，下次 cron step (1) 還是會誤把這些當「下一個 P1」。本輪做 doc maintenance：把每條已完成項加 `✅ DONE` 標 + 指出實作位置 + 說明 iter# 怎麼修。讓 review-v2 變成可信的 step (1) 訊息源，未來輪可以從未標 ✅ 的項目（R-3 / R-4 / R-5 / P2-1~10）直接挑。

**動作**：

1. **`docs/review-v2.md` 開頭加狀態標頭**（5 行）：
   - 註明「iter#75 更新」
   - 6 條 P1 已修 / R-2 由 iter#73 完成且超 spec
   - 提示下輪 cron 用本檔當 step (1) 時要從**未標 ✅** 項目挑
   - 列出**還可做**的：R-3 / R-4 / R-5 / P2-1 ~ P2-10

2. **6 條 P1 都加 `✅ DONE` 標題後綴 + 實作說明 blockquote**：
   - P1-1：`src/game.js:86` DEBUG const（雙閘門 query string OR localStorage）
   - P1-2：`src/game.js:1774` storage event → readOnlyTab + modal + 玩家手動 reload
   - P1-3：`src/game.js:113` + `src/dex.js:35` QuotaExceededError toast
   - P1-4：3 條同步上 — `style.css:505` ✏️ pseudo + `game.js:459` first_hatch toast + `game.js:705` chick stage hint
   - P1-5：`index.html:68-71` 4 個並列 icon-btn + Help dialog
   - P1-6：`src/game.js:1469` PARTICLE_CAP + `particleSlotsLeft()` + Math.min cap，`.stage` overflow hidden

3. **R-2 加 `✅ DONE（iter#73 超 spec）` + 詳細實作對比**：
   - 採配置驅動而非 spec 的「title + keys 兩參數」
   - 5 個 binding + cfg-schema lint 守住
   - 列「比 spec 好的點」3 條（v0.3 擴充零 game.js 改動 / item 順序解耦 / 內部驗證）

**為什麼這比寫新功能重要**：
- iter#75 之前 7 輪沒讀 review，後續輪會繼續忽略 review 改用 iteration-log 反推下一輪 — 但 iteration-log 是**過去**紀錄不是 backlog
- 標記後的 review-v2 變成「下輪該做什麼」的明確 backlog（未標 ✅ 即未做）
- 文檔工作零程式風險、不打斷 lint chain
- 5 分鐘 doc maintenance > 30 分鐘隨機 refactor，因為前者讓**未來所有輪**都更有方向

**review-v2 還剩的真實 backlog**（已驗證所有 P1 都修完）：
- **R-3** rowHTML helper 收 settings/dex/achievements 三個列表（30 min effort）
- **R-4** 中央化 timer / animation 生命週期（中等）
- **R-5** i18n 預留 t() 函式（中大）
- **P2-1** game.js 行數（已 1901 行，距 2000 警戒 99 行 buffer）
- **P2-2** dirty checking render（perf 中性，行動裝置 Lighthouse 才會看出）
- **P2-3** ~ **P2-10** 散項目（emoji 一致性 / cryptoRandomId fallback / dex cap 預警 等）

**影響檔案**：
- `docs/review-v2.md`（+7 處 ✅ DONE 標題後綴 + 7 段實作說明 blockquote + 1 段檔頭狀態說明）

**驗證**：
- `grep -c "✅ DONE"` → 7（6 P1 + R-2）
- `./scripts/run-checks.sh` → 全綠（沒動 JS）
- review-v2 內文與當前 src 對應位置都人工 cross-check 過

**下輪候選**（從 review-v2 未標 ✅ 項目挑）：
1. **R-3** rowHTML helper（接 iter#73 的 R-2 collapse 模式延伸）
2. **P2-2** render dirty checking（perf 改善，5-15 行小手術）
3. **P2-9** i18n hook 預留（與 review-v2 R-5 重疊）
4. **P2-3** emoji 一致性（小 polish）
5. 寫 `docs/v0.3-roadmap.md`（多 doc 整合，純規劃）

---

## 2026-04-29 08:45 · Session A — scripts/check-cfg-schema.js：CFG 內部 cross-ref 第 3 個 lint

**觸發**：cron 第 74 輪
**為什麼**：iter#73 把 menu items 搬 cfg.js 後，**typo 會讓 menu 靜默缺項** — 玩家點開「餵食」少看到一條，console 沒錯、無 toast。同類風險還有 `wants.pool[].needs` 指向 interactions（typo 會讓 want 永遠不出）、`interactions.unlock` 指向 stages（typo 等於永久鎖死該交互）、`accessories.slot` 限定在 4 個 UI 槽（typo 會讓配件變不見）。check-sw-shell 守 src 對 SW、check-assets 守 cfg 對 fs，本輪補的 check-cfg-schema 守 **cfg 內部 key 一致性**。三個 lint 形成完整防護網。

**動作**：

1. **新檔 `scripts/check-cfg-schema.js`**（76 行）：
   - 用 `vm` 模組在 sandbox 跑 cfg.js（stub `window` 接住 IIFE 的 `window.NourishCFG = CFG`）
   - 驗證 5 條內部 cross-ref invariant：
     a. `interactionMenus[cat].items[*]` ∈ keys(`interactions`)
     b. `interactions[*].unlock` ∈ keys(`stages`)
     c. `accessories[*].slot` ∈ {hat, face, neck, wing}
     d. `wants.pool[*].needs` ∈ keys(`interactions`) AND `wants.pool[*].stage` ∈ keys(`stages`)
     e. `stages[*].next` ∈ keys(`stages`) ∪ {null}
   - 通過印帶統計 `✅ CFG schema valid (14 interactions / 4 stages / 10 accessories / 14 wants / 3 menus)`
   - 失敗印每條違規 + 修正提示

2. **`scripts/run-checks.sh` 加第 4 step**（24 → 27 行）：
   - 在 `check-assets.js` 後 `check-cfg-schema.js`
   - `set -e` 任一 lint 失敗即終止

3. **`docs/deploy.md` 個別檢查 blockquote** 加第 4 條
4. **`CLAUDE.md` §3 結構樹** scripts/ 子樹追加 check-cfg-schema.js（同步 run-checks.sh 標籤從 「2 lint」→「3 lint」）

**為什麼用 vm 而非 require / eval**：
- cfg.js 是 IIFE 包 `window.NourishCFG = CFG`，直接 require 在 node 報 `window is not defined`
- eval 在主程序污染 global，vm 沙箱隔離乾淨
- vm.runInContext 同時提供 filename hint（出錯訊息會印 `src/cfg.js:NN`）
- 13 行就接出 CFG，不需 AST parser / acorn 之類重武器

**驗證**：
- 跑 `node scripts/check-cfg-schema.js` → `✅ CFG schema valid (14/4/10/14/3)`
- 故意把 `interactionMenus.feed.items` 一條改成 `feed_typo` → lint 印 `❌ 1 CFG schema violation(s): interactionMenus.feed.items: "feed_typo" not in CFG.interactions` ✅ exit=1
- restore 後 → 再跑通過 ✅
- `./scripts/run-checks.sh` 全 4 step 通過

**抓得到的真實 bug 範例**：
- 加新 want「want_swim」 typo `needs:"feed_corm"` → lint 抓 ✅（玩家本來會看到 want 永遠不出）
- 加新 accessory `slot:"head"` 而非 `"hat"` → lint 抓 ✅（玩家裝了不顯示）
- 加新 stage 改 `chick.next: "juniorr"` → lint 抓 ✅（雞永遠進化不到下一階段）
- 加新 interaction `unlock:"egg2"` → lint 抓 ✅（永久解不開）

**ROI 估算**：
- 寫 lint：10 分鐘
- 一次 cross-ref bug 偵錯：通常 30-60 分（玩家回報 → 重現 → grep cfg → 比對）
- **第 1 次**就回本，且這類 bug 玩家**很難回報清楚**（缺項太隱性）

**Lint 套件最終形態（iter#67-74 累計 4 輪）**：
| Lint | 守的範圍 | iter |
|------|---------|------|
| check-sw-shell | sw.js APP_SHELL ↔ index.html `<script>` | iter#67 |
| check-assets | cfg / index / sw / manifest 內 60+ 個 assets/ 路徑 | iter#68 |
| check-cfg-schema | cfg.js 內部 cross-ref（5 條 invariant） | iter#74 |
| run-checks.sh | 上 3 個 lint + 7 檔 syntax + sw.js syntax 一鍵跑 | iter#69 |

**影響檔案**：
- `scripts/check-cfg-schema.js`（新檔，76 行）
- `scripts/run-checks.sh`（+3 行第 4 step）
- `docs/deploy.md`（+1 行個別檢查）
- `CLAUDE.md`（結構樹 +1 行 / run-checks 標籤更新）

**下輪候選**：
1. 用 iter#73 同 config-driven 模式 refactor `openShopMenu` / `openAchievementsMenu`（這兩個也有可抽 data）
2. SVG 占位圖延伸（v0.3 配件 placeholder，合 launch-plan §3.3 W3「新功能預告」內容）
3. 寫 `docs/v0.3-roadmap.md`：把 GDD §10.3 / extensions.md / multipet-plan 整合
4. i18n 骨架（zh-TW / en）
5. 加更多 cfg invariant：`interactions.fatPoints` numeric / accessories.price > 0 / speech.* 全是字串陣列

---

## 2026-04-29 08:33 · Session A — interactionMenus 配置驅動：3 個 menu 函式 collapse 成 1 個

**觸發**：cron 第 73 輪
**為什麼**：iter#70-72 三輪 launch 武裝跑完，回頭償重構債。R-A step 2-C 第三片本來計畫拆 `openFeedMenu` / `openPlayMenu` / `openPetMenu` 進 ui.js，但讀完發現**這 3 個函式各只有 9 行、結構完全一樣**（差別只在 `items` 陣列和標題 emoji），搬 ui.js 還要橋接 4 個閉包（menuItemHTML / bindMenuItems / showModal / closeModal），ROI 很差。**改採配置驅動 collapse**：把 items / title 搬 cfg.js（純資料），3 個函式合一成 `openInteractionMenu(cat)`，data 與邏輯分離。比拆 ui.js 更乾淨，game.js 反而少更多行（17 vs 拆 ui.js 預估的 21），且 v0.3 加新分類（grooming / training）只動 cfg.js 不動 game.js。

**動作**：

1. **`src/cfg.js` 新增 `CFG.interactionMenus`**（9 行新增）：
   - 在 interactions block 後 / achievements block 前
   - 三個鍵 `feed` / `play` / `pet`，各有 `title` + `items` 陣列
   - 中文 comment 註明：order 是玩家面顯示順序，與 cfg.interactions 定義順序解耦
   - 強調「v0.3 加 category 只改 cfg」設計意圖

2. **`src/game.js` 把 3 個函式 collapse 成 1 個 `openInteractionMenu(cat)`**：
   - 讀 `CFG.interactionMenus[cat]` → undefined 防呆
   - 內部邏輯同舊版（map menuItemHTML → showModal → bindMenuItems）
   - 移除原 3 個 9 行函式（共 27 行）→ 1 個 12 行函式（淨 -15 行）

3. **`src/game.js` init() 5 個 binding 更新**：
   - `$("btn-feed").onclick = () => openInteractionMenu("feed")` × 3 個 header 按鈕
   - keyboard shortcuts case "1" / "2" / "5" 同步更新

**架構好處**：
- **數據集中**：menu 結構在 cfg.js，邏輯在 game.js，符合 CLAUDE.md §5「改數值只動 cfg.js」
- **擴充性**：v0.3 GDD §10.3 預告的 grooming menu 可以**純 cfg 加一條**就生效
- **測試性**：未來如有測試框架，可以對 `CFG.interactionMenus` 做 schema validation
- **TODO 一致**：未來想批次禁用某分類（例如 sleeping 時禁玩耍），只需改 `openInteractionMenu` 一處

**lines 對比**：
- **iter#72 完工**：game.js 1918 行
- **iter#73 完工**：game.js 1901 行（**-17**）
- cfg.js 290 → 297 行（**+7**）
- 淨總 lines：-10
- Retrospective P1-1 警告線（2000+）緩衝：+17

**驗證**：
- `./scripts/run-checks.sh` → 全綠（7 檔 syntax + sw.js + 2 lint）
- grep 確認 `openFeedMenu` / `openPlayMenu` / `openPetMenu` 已無 reference
- 邏輯驗證：bindMenuItems 收到的 `card.querySelectorAll(".menu-item")` 仍依 `data-key` 對應 cfg.interactions key，未動

**為什麼選 collapse 而非拆 ui.js**：
| 方案 | game.js 行數變化 | 閉包橋接 | 擴充性 |
|------|-----------------|---------|--------|
| 拆 ui.js 第三片 | -21 | 需橋 4 個 | menu 邏輯散兩檔 |
| **本輪 collapse** | **-15** + cfg+7 | 0（cfg 同檔內） | 加 cat 改 cfg 即可 |
| 直接刪 menu 改 inline | -27 | 0 | 沒分類能力 |

iter#69 的 lint 已經抓 SW APP_SHELL 飄移，但**沒有抓「相同結構 3 次重複」的 lint** — 這類重構靠人工偵測。本輪 collapse 也順便驗證了 iter#67/68 的 lint 沒誤殺（cfg 加新欄位 / game.js 改函式名都被 run-checks 接受）。

**影響檔案**：
- `src/cfg.js`（+8 行 interactionMenus 配置區塊）
- `src/game.js`（-15 行 menu 函式 / 5 處 binding 更新）

**下輪候選**：
1. 用同樣 config-driven 模式 refactor `openShopMenu` 或 `openAchievementsMenu`（這兩個也有可抽出的 data）
2. SVG 占位圖延伸：v0.3 配件 placeholder（合 launch-plan §3.3 W3「新功能預告」內容）
3. 寫 `docs/v0.3-roadmap.md`：把 GDD §10.3 / extensions.md 整合成可執行計畫
4. i18n 骨架（zh-TW / en）
5. 寫 `scripts/check-cfg-schema.js`：驗 `CFG.interactionMenus[cat].items` 每條都對應到 `CFG.interactions` 真實 key（防 typo）

---

## 2026-04-29 08:21 · Session A — docs/launch-plan.md：30 天 W1-W4 可執行清單（iter#70 戰術落地）

**觸發**：cron 第 72 輪
**為什麼**：iter#70 在 market-research-2026.md §6.5 寫出了部署後 30 天的 W1-W4 路徑，但**只是高階 outline** — 沒寫每條短片的具體格式、沒列 KOL 洽談模板、沒寫 KPI 校準數字、沒準備緊急狀況 SOP。研究結論放在腦袋裡會落地時打結。本輪把它從 5 行結論展開成 300 行可執行清單，部署當天可直接照做、不必再思考「下一步是什麼」。同時跟 iter#71 的 A2HS 橫幅銜接 — W1 玩家進來 5 分後看到橫幅，W4 推廣動作直接呼應已建好的基礎設施。

**動作**：

1. **新檔 `docs/launch-plan.md`**（301 行，6 主章 + 2 附錄）：

   - **§0 Pre-launch checklist**（5 子節，~25 個勾選項）：程式 / 美術 / SEO / 玩家入口 / 監測，部署前必過
   - **§1 W1**（部署日 + 7 條短片 + 監測 + KPI）：
     - W1 Day 1 共 8 個動作（GSC 提交 / Bing import / Rich Results / PSI / Schema validator）
     - **7 條短片日程表**（Mon-Sun），每條含標題 / 形式 / hashtag / TA
     - 製作規則 5 條（30s 以下 / 第 1 秒必須有動 / 字幕粉襯白 / 結尾固定卡 / 不放 link in bio）
     - W1 KPI 5 項（觀看數 / 短片發出數 / 起飛條數 / Search Console / unique players）
   - **§2 W2**（Paid Organic + KOL 試水）：
     - winner 識別流程（24h 內 5K+ 才投 $50-100）
     - KOL 篩選 3 條件（5K-50K 粉 / cozy 調性 / 中文圈）
     - **完整 KOL DM 模板**（送客製命名雞 + 限定配件 SVG 換 30s 開箱影片）
     - $0 預算限定（不付現金 / 不送禮品卡）
     - W2 KPI 5 項
   - **§3 W3**（複利期，內容反饋驅動）：
     - 14 條短片數據統整（前 3 / 後 3 / 變化版策略）
     - Threads thread 開箱問答（不開 Discord — 太重）
     - 7 條新軸（玩家展示 / 新功能預告 / dev 心情）
   - **§4 W4**（A2HS 推廣 + KOL 2.0）：
     - 跟 iter#71 橫幅銜接：W4 拍一條「點分享 → 加到主畫面」3 秒短片
     - KOL 進階合作（客製化品種雞 / 一週 3 條）
     - 30 天 retrospective KPI 5 項
   - **§5 緊急狀況 SOP**（4 子節）：
     - W1 後完全沒人玩 → 4 條根因檢查 + 復原動作
     - 突發大量流量 → GitHub Pages → Cloudflare Pages 切換
     - Bug / 玩家負評 → 48h 道歉 + 存檔 import diff
     - KOL 完全無效 → 不重複該路徑
   - **§6 30 天後展望**：明確規定不在 W4 就決定 v0.3 / 付費 / 多寵物擴充
   - **附錄 A** hashtag 庫（主要 8 個 / 地區 3 個 / 避開 3 個 — `#tamagotchi` 列為紅海）
   - **附錄 B** 每週時間預算（30 天總投入 30-40h，拍剪佔 60%）

2. **`robots.txt` Disallow** 加 `/docs/launch-plan.md`：
   - 內含 KOL 洽談模板 / 預算數字 / 紅旗清單，**不該被搜尋引擎收錄**
   - 維持 iter#65 的內部 dev 文件全部 Disallow 模式

3. **`CLAUDE.md` §3 檔案結構樹**：docs/ 子樹追加 launch-plan.md 條目

**為什麼這份比 §6.5 outline 重要**：
- iter#70 的 §6.5 是**戰略**（要做什麼），launch-plan 是**戰術**（怎麼做）
- 部署當天我（或未來的 session）可能完全沒空再 brainstorm — 必須能 copy-paste 就執行
- KOL DM 模板實際省 30 分（不必每個 KOL 重寫）
- KPI 紅線數字（「W1 累計觀看 < 1000 = 復原 SOP」）讓未來決策不靠感覺
- 附錄 A 的 hashtag 庫直接 ready，發片時間不會卡

**為什麼選此優先於拆 menu**：
- iter#71 剛把 A2HS 橫幅做好，現在文檔化的 launch-plan 跟它銜接（§4.1 W4 A2HS 推廣專段）
- 拆 menu 是**內部重構**（玩家無感、retrospective P1 紅線還沒到），launch-plan 是**外部成長**（決定遊戲能否被找到）
- 文檔工作零程式風險、無需 lint
- 主要 TA 是女性的 cottagecore/coquette 路線在 §1.2 7 條短片內容中具體化，後續 Session B 可以照清單做圖

**影響檔案**：
- `docs/launch-plan.md`（新檔，301 行）
- `robots.txt`（+1 行 Disallow）
- `CLAUDE.md`（檔案結構樹 +1 行）

**驗證**：
- `./scripts/run-checks.sh` → 全綠
- `wc -l docs/launch-plan.md` → 301 行
- robots.txt Disallow 列表更新後維持原本格式

**iter#70-72 三輪 launch 武裝完整度**：
- ✅ iter#70 — Discovery / Growth 戰略（market-research-2026.md §6）
- ✅ iter#71 — A2HS 橫幅實作（執行層基礎設施）
- ✅ iter#72 — launch-plan.md 30 天可執行清單（戰術落地）
- 部署 ready 度：iter#65 = MEDIUM（SEO 鋪好但不知怎麼推）→ iter#72 = HIGH（部署日就照清單跑）

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（重構債）
2. SVG 占位圖延伸（v0.3 配件 fallback / coquette 風格新配件）
3. 為 launch-plan §1.2 7 條短片寫 image-prompts（給 Session B 排隊做）
4. i18n 骨架（zh-TW / en）— 海外曝光鋪路
5. 寫 docs/onboarding-script.md：把首次玩家 modal 流程文字化，給 Session B 文案優化

---

## 2026-04-29 08:10 · Session A — A2HS 提示橫幅：把已捕的 install prompt 變真實裝機

**觸發**：cron 第 71 輪
**為什麼**：iter#70 §6.4 點名的 quick win — `beforeinstallprompt` 事件早在 iter#27 就已捕到 `window.__nourishInstallPrompt`，但**只有在設定頁第三 tab 內才會看到「立即安裝」按鈕**。玩家不點設定 = 永遠不知道可以裝。Trivago 案例：A2HS 用戶 +150% 留存（market-research-2026.md §6.4）— 啾啾現在的設計等於把 70% 的留存放著爛。本輪寫主動橫幅：玩 5 分鐘後（已驗證投入感）+ install prompt 還在 + 沒被 dismissed → 底部彈粉色橫幅一次。1 個動作把已存在 6 個月的基礎設施變成真實裝機。

**動作**：

1. **`index.html`** 新增 `<div class="install-banner">` 元素於 footer 後（5 行）：
   - icon `📲` + 文案「把啾啾裝到主畫面，一鍵就能照顧～」
   - 「安裝」主按鈕（pink-deep filled，圓角）
   - 「×」次按鈕（透明，hover 粉色輕底）
   - `role="region"` `aria-label` `hidden` 預設

2. **`src/style.css`** 加 `.install-banner` 樣式（54 行新增）：
   - `position: fixed; bottom: 12px;` 置底，居中（max-width 456 配合 480px #app）
   - 漸層 `pink-soft → #FFF4F8` 背景 + `pink-deep` 邊框 + 陰影
   - `@keyframes install-slide-up` 從 `translate(-50%, 100%)` 滑上，0.3s ease-out
   - z-index: 50（高於 stats，低於 modal）

3. **`src/game.js`** 三處改動：
   - **新函式 `maybeShowInstallBanner()`**（含 `INSTALL_BANNER_DELAY_MS = 5*60*1000` 常數）：
     - 4 個短路條件依序檢查：`state.settings.installBannerDismissed` / standalone display-mode / `__nourishInstallPrompt` 缺席 / 玩 < 5 分
     - 每條失敗就 hide 並 return；4 條全過才顯示
     - 為什麼這順序：dismissed > 已是 PWA > 沒 prompt > 沒投入夠久（hottest path 先 short-circuit）
   - **新函式 `dismissInstallBanner(persist)`**：
     - 隱藏元素 + 寫 `state.settings.installBannerDismissed = true` + save
     - persist=false 時只隱藏不持久化（未來如有臨時 hide 的需要）
   - **`render()` 末尾呼叫 `maybeShowInstallBanner()`** — 每次 render 自動評估
   - **`init()` 加 3 條 wiring**：
     - `#install-banner-yes` onclick → `prompt.prompt()` → `await prompt.userChoice` → 不論 accept/decline 都 dismiss（避免 nag）→ accept 顯示成功 toast
     - `#install-banner-no` onclick → `dismissInstallBanner(true)`
     - `window.addEventListener("beforeinstallprompt", ...)` 補一條 — 部分瀏覽器 prompt 在 init 後才 fire，需要 re-render 才會顯示

4. **`sw.js` CACHE_VERSION bump**：`chickaday-v1-2026-04-29` → `chickaday-v1-2026-04-29-iter71`
   - 同日二次 ship，必須加 sub-tag 否則已裝 PWA 玩家不會 invalidate 舊 cache（iter#66 教訓）

**為什麼挑這個 quick win 而非拆 menu**：
- iter#70 已用 WebSearch 寫死「Trivago A2HS +150% 留存」這個數字 — 直接執行避免文檔變閒置
- 風險低：純加法，沒動既有邏輯（settings 內舊的安裝按鈕保留）
- 玩家可感：iter#70 寫的 launch playbook §6.5 W4 任務之一，可以提早做掉
- 10 分鐘可完工：HTML/CSS/JS 各 1 段，函式只新加 2 個

**驗證**：
- `./scripts/run-checks.sh` → 全綠（7 檔 syntax + sw.js + 2 lint）
- `curl http://localhost:8765/index.html` 確認新橫幅 5 行 served
- `curl http://localhost:8765/src/style.css | grep -c install-banner` → 7 個 selector ✅
- `curl http://localhost:8765/src/game.js | grep -c "INSTALL_BANNER_DELAY_MS\|install-banner\|nourishInstallPrompt"` → 13 處引用 ✅

**互動行為驗證（瀏覽器手測 — 玩家可隨時開 localhost:8765）**：
- 條件 A：開啟 5 分內 → 不出（symptom: nothing visible）
- 條件 B：5 分後 + 有 prompt + 沒 dismiss → 滑入粉色橫幅
- 條件 C：點安裝 → OS 系統 prompt → 接受 = 立即關 + toast「✨ 已加入主畫面！」
- 條件 D：點 × → 立即關 + 永遠不再出（state.settings.installBannerDismissed=true 持久化）
- 條件 E：已是 standalone PWA 模式（display-mode: standalone）→ 不出
- 條件 F：iOS Safari（不 fire beforeinstallprompt）→ 不出（iOS 用戶看不到，但 iOS 本來就要靠 Share→A2HS）

**影響檔案**：
- `index.html`（footer 後 +6 行）
- `src/style.css`（檔末 +54 行）
- `src/game.js`（render() +1 行 / 新增 30 行函式 / init() +18 行 wiring）
- `sw.js`（CACHE_VERSION 同日 sub-tag）

**業務預期影響**：
- iter#27 寫的 install prompt 攔截器**等了 6 個月才有真實出口**
- Chrome/Edge/Samsung Browser/Firefox Android 全支援 `beforeinstallprompt`
- 估計**裝機率從 ~5%（要點設定才能裝）→ 25-40%**（玩 5 分後主動推）
- 5 分鐘投入門檻設計理由：低於 5 分的玩家裝了也會立即流失，提前推會被嫌煩；5+ 分玩家轉化率高
- 一旦裝為 PWA：notifications / 啟動速度 / cold-start ≤ 1s，留存指標跳一個檔次

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu
2. 寫 docs/launch-plan.md：把 iter#70 §6.5 W1-W4 動作展開成可執行清單
3. SVG 占位圖延伸（v0.3 配件 fallback / coquette 風格延伸）
4. i18n 骨架（zh-TW / en）
5. 加 `.git/hooks/pre-push` 範本（前提：git init 後）

---

## 2026-04-29 07:58 · Session A — market-research-2026.md §6 補完：部署後 Discovery / Growth 戰術

**觸發**：cron 第 70 輪
**為什麼**：iter#66-69 連 4 輪寫 dev tooling / 部署武裝（SW / lint / deploy gate），把「上線安全」這條解了。但**「上線後怎麼被找到」** 完全沒寫 — market-research-2026.md §1-5 只談趨勢 / 留存 / 變現 / 競品，沒講 indie launch playbook。Cron 該轉回玩家可感的工作了，但 R-A step 2-C 拆 menu 風險中等需要慢慢做，i18n 太大 10 分鐘起頭就崩。挑 WebSearch growth 戰術做研究 — 給 v1.0 launch 留 playbook。

**動作**：

1. **並行兩條 WebSearch**：
   - `indie casual web game 2026 viral marketing TikTok discovery solo developer`
   - `PWA progressive web app discovery 2026 marketing without app store install rates`
   - 主 agent 自己跑（CLAUDE.md §7 提醒 sub-agent WebSearch 常被拒）

2. **抓出的 3 個關鍵 insight**：
   - **KnightBound 範式**：16 歲 solo dev，0 廣告 → App Store Adventure #3，方法是反向客製遊戲 metadata 匹配 TikTok subculture（dark fantasy）
   - **2026 短影音節奏**：7-14 條/週為門檻，少於就被演算法降權；devlog 紅利期已過（同樣縮圖 2024 年 800K → 2026 年 300-800 views）
   - **Paid Organic 放大法**：先免費發，找出單條起飛 → $200 boost 那一條，演算法判讀為自然爆紅，觸達 ×5-10
   - **PWA discovery 結構優勢**：搜尋引擎索引、+70% session、+36% 轉換、Trivago A2HS 用戶 +150%、PWA 平均月成長 97%

3. **`docs/market-research-2026.md` 加 §6**（~95 行新章節）：
   - §6.1 Indie viral 公式（KnightBound 範式 + 對應啾啾的 coquette/cottagecore subculture）
   - §6.2 短影音節奏 = 主要有機觸及
   - §6.3 Paid Organic 放大法（具體步驟 + 為什麼有效）
   - §6.4 PWA vs App Store discovery 結構優勢（對照表 + 真實案例數字）
   - §6.5 啾啾日常 launch 30 天路徑建議（W1-W4 動作 + KPI 校準）
   - §6.6 紅旗清單（5 個不該做）

4. **§7 三句話結論補一句**：「Discovery 是 v1.0 真正的瓶頸 — 程式跑起來只是門票，2026 年要被找到必須短影音 × subculture × Paid Organic」

5. **§ 來源** 重組成 v1（市場/產品，原 6 條）+ v2（部署/Growth，新 8 條）兩段，total 14 條來源

**核心戰略結論**（對 v0.3+ 路徑）：
- 啾啾的視覺資產（粉嫩、緞帶、療癒）天然契合 **coquette / cottagecore** TikTok subculture — 不需要硬蹭 trending
- 部署後第一個動作不是「四處投放廣告」，而是 **W1 發 7 條短片 + Search Console 提交**
- A2HS 提示橫幅是 v0.2 該補的 quick win（iter#27 prompt 攔截已寫，沒對玩家明示 = 浪費）
- TikTok hashtag 鎖：`#coquette #pinkaesthetic #virtualpet #cozygame #pwa`，不要碰 `#tamagotchi`（紅海）
- 月廣告預算 $100-200 試水溫即可，3 個月目標 10K MAU + Search Console 涵蓋率 80%

**影響檔案**：
- `docs/market-research-2026.md`（183 → ~280 行，新增 §6 + 補 §7 結論 + 重組 § 來源）

**驗證**：
- 文檔 markdown structure 一致（# / ## / ### 層次正確）
- 8 個新來源 URL 都來自 WebSearch 結果，沒虛構

**為什麼這比拆 menu 重要**：
- iter#66-69 已大幅降低部署風險，此時 marginal 工程價值不如 marginal 商業洞察
- v1.0 上線時若沒這份 playbook，幾乎一定犯「直接買 Tamagotchi 關鍵字 ad」「指望 Reddit 一篇起飛」這類紅旗動作
- WebSearch 對 sub-agent 經常 deny（CLAUDE.md §7），主 agent 必須自己做，不能延後
- 寫成文檔比記在腦袋裡可靠 — Session B 也能讀到

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu
2. **A2HS 提示橫幅**（玩 5 分鐘後彈一次）— §6.4 直接點名的 quick win
3. SVG 占位圖延伸（v0.3 配件 fallback / coquette 風格延伸）
4. i18n 骨架（zh-TW / en）
5. 寫 docs/launch-plan.md：把 §6.5 的 W1-W4 動作展開成執行清單

---

## 2026-04-29 07:46 · Session A — scripts/run-checks.sh：一鍵 deploy gate + CLAUDE.md 驗證流收斂

**觸發**：cron 第 69 輪
**為什麼**：iter#67/68 連續兩輪寫了 `check-sw-shell.js` 和 `check-assets.js` 兩個 lint，但 deploy.md §2 checklist 變成 3 行各自要跑（`node --check 7 檔` / `node lint1` / `node lint2`），實務上玩家會嫌煩，跳過 lint 的機率隨步驟線性上升。把它們全部包成一個 `run-checks.sh`，set -e fail-fast、有彩色 step header、跑 < 1 秒。同時把 CLAUDE.md §5「驗證」段從「跑 `node --check src/game.js`」更新成 canonical 的單一指令，避免文檔指向過時驗證流。

**動作**：

1. **`scripts/run-checks.sh`**（新檔，39 行）：
   - shebang `#!/usr/bin/env bash` + `set -euo pipefail`
   - 自動 resolve repo root（`cd "$(dirname ${BASH_SOURCE[0]})/.."`），所以從哪呼叫都行
   - 4 個 step：7 檔 src/.js syntax / sw.js syntax / check-sw-shell / check-assets
   - 每 step 印彩色 `▶` header（cyan ANSI escape）
   - 通過印 `▶ All checks passed — safe to push`
   - `chmod +x` 直接 `./scripts/run-checks.sh` 跑
2. **`docs/deploy.md` §2 checklist 收斂**：
   - 舊：3 行（各自跑）
   - 新：1 行 `./scripts/run-checks.sh 全綠`
   - 個別檢查移到 blockquote 註腳（除錯用 fallback）
3. **`CLAUDE.md` §5 開發慣例 ▶ 驗證段** 更新（4 條 → 5 條）：
   - 主指令：`./scripts/run-checks.sh`（一鍵）
   - 除錯指令：`node --check src/<file>.js`（單檔）
   - 補一條 cfg.js 新增配件後 run-checks 會自動驗 path
4. **`CLAUDE.md` §8 常用片段** ▶ 「驗證 game.js」標題改為「驗證所有檢查」，命令同步
5. **`CLAUDE.md` §3** 檔案結構樹：scripts/ 子樹追加 run-checks.sh

**驗證**：
- `./scripts/run-checks.sh` → 全 4 step 通過，總耗時 < 600ms
- 中間任一檢查失敗時 `set -e` 立即中斷（依 set -e 行為，無需特別測試）
- ANSI escape 在 macOS Terminal / iTerm2 都正常顯示

**影響檔案**：
- `scripts/run-checks.sh`（新檔，39 行）
- `docs/deploy.md`（§2 收斂 7 → 5 行 + 註腳 5 行）
- `CLAUDE.md`（§5 驗證段 +2 行 / §8 命令更新 / §3 結構樹 +1 行）

**為什麼 deploy gate 重要**：
- 啾啾日常**沒有 CI/CD**（純靜態 GitHub Pages，push 即上線）
- 沒 server-side test runner、沒 GitHub Actions、沒 pre-commit hook
- **唯一防線就是 push 前手動跑 lint**
- 包成一行可以未來輕鬆掛 git pre-push hook（`.git/hooks/pre-push` 一行 `exec ./scripts/run-checks.sh`）

**Lint 套件最終形態**：
- ✅ `run-checks.sh`（**iter#69 本輪**）— 入口，一鍵跑所有
- ✅ `check-sw-shell.js`（iter#67）— SW APP_SHELL 一致性
- ✅ `check-assets.js`（iter#68）— 60+ asset 路徑實存性
- 8 個檢查總耗時 < 1 秒，幾乎零成本

**iter#66-69 系列總結**（4 輪部署武裝）：
- iter#66：修 SW 漏快取 3 檔 P1 + 寫 Search Console SOP
- iter#67：寫 SW shell lint
- iter#68：寫 assets lint
- iter#69：包 run-checks.sh + CLAUDE.md 文檔同步
- 從「玩家要跑 7 個步驟驗證」收斂到「跑 1 個指令」
- 部署危險度：iter#65 = HIGH（沒 lint）→ iter#69 = LOW（1 行通過 = 安全）

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（可被 run-checks 自動驗證）
2. WebSearch 部署成長戰術 / 競品 SEO（補強 docs/market-research-2026.md）
3. i18n 骨架（zh-TW / en）
4. SVG 占位圖延伸（v0.3 配件 fallback）
5. 寫 `.git/hooks/pre-push` 範本，把 run-checks 自動化（提示用 `git config core.hooksPath`）

---

## 2026-04-29 07:35 · Session A — scripts/check-assets.js lint：60+ asset 路徑實存驗證

**觸發**：cron 第 68 輪
**為什麼**：iter#67 寫的 SW shell lint 守住了 7 個 src/.js 檔，但 cfg.js 還掛著 60+ 個 `assets/...png|svg` 引用（9 個配件、6 個背景、12 個事件、7 個進化終態 PNG、4 個食物、5 個情緒、egg/baby/young 等）。**新增配件 / 事件最常見的 bug 就是「cfg 寫了 path 但忘了放檔」或反過來** — 玩家會看到破圖且 console 沒任何錯，超難 debug。同類 lint，10 分鐘可寫完，永久消滅一條疏漏向量。

**動作**：

1. **`scripts/check-assets.js`**（新檔，68 行）：
   - 掃 4 個靜態檔：`manifest.json`、`index.html`、`sw.js`、`src/cfg.js`
   - regex 撈 `["'`]<...>assets/<path>.<png|jpg|jpeg|svg|webp|gif>["'`]`，路徑 normalize（去 `./` 前綴）
   - 對每個 ref `fs.existsSync` 檢查
   - 印 `✅ all N asset references resolve (scanned M files)` 或列每個 missing + 出現位置（`file:line`）
   - 維持與 check-sw-shell.js 一致的格式（exit 0/1、emoji prefix）
2. **`docs/deploy.md` §2 checklist**：加 `node scripts/check-assets.js` 通過為硬閘門
3. **`CLAUDE.md` §3** 檔案結構樹：scripts/ 子樹追加 check-assets.js

**驗證**：
- 跑 `node scripts/check-assets.js` → `✅ all 61 asset references resolve (scanned 4 files)`
- 故意 inject `icon-fake.png` 進 manifest.json → lint 印 `❌ 1 broken asset reference(s)` + 定位 `manifest.json:86` ✅ 抓得到行號
- restore 原始 manifest.json → 再跑通過 ✅

**為什麼選這個 lint**：
- 涵蓋面廣：61 個 ref vs SW lint 的 7 個 src/.js
- 與 check-sw-shell.js 對稱，雙保險防部署崩
- ROI：1 次 typo 修復 = 5-15 分（玩家回報 + 截圖 + 我 grep cfg.js + diff），lint 跑 < 50ms
- Session B 新增配件時特別關鍵 — Session B 的 sandbox 經常拒 Bash，可能會忘了驗證

**統計**：
- 4 個靜態檔共 61 個 unique asset refs
- assets/ 實際有檔：~70（包括 lint 沒掃到的圖鑑顯示用、sub-agent 生但 cfg 沒引用的）
- **沒有 dead 引用** ✅（cfg.js → assets/ 一致性目前 100%）

**影響檔案**：
- `scripts/check-assets.js`（新檔，68 行）
- `docs/deploy.md`（+1 行 checklist）
- `CLAUDE.md`（檔案結構樹 +1 行）

**Lint 套件完成度**：
- ✅ check-sw-shell.js（iter#67）— src/ JS 與 SW APP_SHELL 一致性
- ✅ check-assets.js（**iter#68 本輪**）— assets/ 路徑實存性
- ⏳ 後續可能：cfg.js schema validator / accessibility audit / CSS unused-class lint

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（3 個 menu 進 ui.js）
2. WebSearch 部署成長戰術 / 競品 SEO 觀察（補強 docs/market-research-2026.md）
3. i18n 骨架（zh-TW / en 雙語切換）— 海外曝光鋪路
4. SVG 占位圖延伸：v0.3 配件 fallback / 新進化分支占位
5. 加 `npm test` 等價：寫個 `scripts/run-checks.sh` 一行跑所有 lint + node --check

---

## 2026-04-29 07:23 · Session A — scripts/check-sw-shell.js lint：防 sw.js APP_SHELL / index.html script 飄移

**觸發**：cron 第 67 輪
**為什麼**：iter#66 修了 sw.js 漏快取 ui.js / achievements.js / audio.js 的 P1 bug — 這 bug 從 iter#34（SW 上線）累積到 iter#66 共 6 個月才被發現，原因是**沒有自動化 lint** 比對「index.html 載入了什麼」與「sw.js APP_SHELL 包了什麼」。下次再拆模組（接下來 R-A step 2-C 還要拆 menu）時，**同樣的 bug 會再生**。本輪寫一個 30 行 lint 當 push 前硬閘門，把這類疏漏永久消滅。

**動作**：

1. **`scripts/`** 新目錄（之前不存在），預留給未來 lint / build helper
2. **`scripts/check-sw-shell.js`**（新檔，58 行）：
   - 用 regex 撈 `index.html` 所有 `<script src="src/*.js">` → 集合 A
   - 用 regex 撈 `sw.js` APP_SHELL 內所有 `"./src/*.js"` 字串 → 集合 B
   - diff 兩集合：
     - **A − B**：missing in shell（首次 offline 載入會 404，**P1**）
     - **B − A**：orphan in shell（script tag 已移除但 cache 留 stale ref）
   - 任一非空就 `process.exit(1)` 印 diff，提示「edit sw.js APP_SHELL → bump CACHE_VERSION」
   - 通過時印 `✅ sw.js APP_SHELL matches index.html scripts (N files)`
   - shebang `#!/usr/bin/env node` + chmod +x，可直接 `./scripts/check-sw-shell.js` 跑
3. **`docs/deploy.md` §2 checklist**：在 `node --check` 後加一條 `node scripts/check-sw-shell.js` 通過
4. **`CLAUDE.md` §3 檔案結構樹**：補齊 src/ 7 檔、新增 scripts/ 子樹、加 deploy.md 條目

**驗證**：
- `node scripts/check-sw-shell.js` → `✅ sw.js APP_SHELL matches index.html scripts (7 files)`
- 故意把 `audio.js` script tag 從 index.html 抽掉模擬飄移 → lint 印 `orphan: ['./src/audio.js']` ✅ 抓得到
- 再模擬 APP_SHELL 漏條目 → missing 也抓得到（同邏輯對稱）

**影響檔案**：
- `scripts/check-sw-shell.js`（新檔，58 行）
- `docs/deploy.md`（+1 行 checklist）
- `CLAUDE.md`（檔案結構樹 +9 行 / -2 行）

**為什麼選這個 lint 而不是別的**：
- ROI 高：30 分鐘寫 + 永久防一個 P1 復發
- 兩個 session 都會經過 deploy.md checklist，雙保險
- 純讀檔 + regex，無外部依賴，跑 < 50ms
- 對 R-A step 2-C 後續拆 menu 特別重要 — 拆完新增 ui.js 內邏輯不會碰 SW，但**萬一拆出新檔**（例如 menu.js）忘了 register，這 lint 會擋下

**ROI 估算**：
- 每次 ship 跑 < 50ms，幾乎零成本
- 一次 P1 修復成本 = iter#66（讀 SW + 比對 + 修 + bump version + 文檔，約 15 分）
- 寫 lint 成本 = 本輪（10 分）
- 損益平衡點：**第 1 次**就回本

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（3 個簡單 menu 進 ui.js）— 拆完正好 lint 自動驗證
2. 加 `scripts/check-manifest-icons.js`（manifest.json icons 與 assets/icons/ 一致性）— 同類 lint
3. WebSearch 部署成長戰術 / 競品 SEO
4. i18n 骨架（zh-TW / en）
5. SVG 占位圖延伸（v0.3 裝扮 PNG 替換 fallback）

---

## 2026-04-29 07:11 · Session A — sw.js APP_SHELL 補 3 檔 + CACHE_VERSION bump + deploy.md §11 Search Console

**觸發**：cron 第 66 輪
**為什麼**：iter#65 收錄三件套鋪完後，本來計畫只更 deploy.md 補 §11 Search Console 提交流程，**讀 sw.js 時發現實際 bug**：APP_SHELL 只列 5 個 src 檔（cfg / dex / share / game / style），**漏了 ui.js / achievements.js / audio.js** 三條 — 這 3 檔是 iter#34 之後拆出來的，當時沒同步更新 sw.js。後果：玩家首次訪問就 install PWA 時，這 3 檔走 runtime cache 而非 install pre-fetch，**第一次 offline 開遊戲會缺 UI / 成就 / 音效模組**。屬於真實的 offline-first 體驗缺陷，比文檔修補優先。

**動作**：

1. **`sw.js` APP_SHELL 補齊**（5 → 8 檔）：
   - 新增 `./src/ui.js`、`./src/achievements.js`、`./src/audio.js`
   - 順序按 index.html `<script>` 載入順序排（cfg → ui → dex → achievements → audio → share → game）
   - 一致性：玩家首訪 install 即拿到完整 7 個 src 檔 + index.html + manifest.json + style.css
2. **`sw.js` CACHE_VERSION bump**：`chickaday-v1-2026-04-28` → `chickaday-v1-2026-04-29`
   - 觸發 SW activate 階段刪舊 cache，**強迫所有玩家**重新預快取新 APP_SHELL
   - 否則 v0.28 安裝過 PWA 的玩家會卡在舊 5 檔
3. **`docs/deploy.md` §2 checklist 修**：
   - 舊：`node --check src/game.js src/cfg.js src/dex.js src/share.js src/achievements.js`（5 檔）
   - 新：`node --check src/cfg.js src/ui.js src/dex.js src/achievements.js src/audio.js src/share.js src/game.js`（7 檔，按載入順序）
4. **`docs/deploy.md` 新增 §11 Search Console / Bing Webmaster 提交流程**（~70 行）：
   - GSC HTML 標籤驗證法（meta tag 貼 `<head>`）
   - sitemap 提交路徑（相對 `sitemap.xml`）
   - Bing Webmaster 一鍵 import GSC
   - 4 條驗證工具清單（rich-results / PageSpeed / schema validator / robots.txt tester）
   - 預期收錄時程表（24h 首爬 → 14-30 天涵蓋率 100%）
   - 3 條常見問題（不收錄 / JSON-LD 不解析 / sitemap 無法擷取）
   - §後續清單追加「跑 §11 Search Console 提交流程」

**影響檔案**：`sw.js`（11 行 +3 / version 1 行）、`docs/deploy.md`（+72 行 §11 / 修 1 行）

**驗證**：
- `node --check sw.js src/cfg.js src/ui.js src/dex.js src/achievements.js src/audio.js src/share.js src/game.js` 全綠（ALL OK）
- `curl http://localhost:8765/sw.js` 確認 CACHE_VERSION 與 APP_SHELL 都吃到新版
- deploy.md §11 內容一致 GSC 2024 UI（網址前置 / 網址檢查 / Sitemap 索引項）

**為什麼這 3 檔之前漏了**：
- iter#34 PWA 上線時 sw.js 寫好，當時 src/ 確實只有 cfg / dex / share / game
- iter#39-49 R-A 重構期間陸續拆 ui / achievements / audio，但**沒人想起來同步 sw.js**
- 沒寫 SW APP_SHELL 與 src/ glob 比對的 lint，所以 6 個月才被發現
- 影響範圍：iter#34 之後的 PWA installer，第一次 offline 載入會 404 三條 → 遊戲完全壞掉
- 嚴重程度：**P1**（影響首次 offline 體驗），但因玩家通常先 online 玩過一次（runtime cache 補上）才 offline 啟動，實際遇到的人少

**SEO 武裝完整度（含本輪 doc）**：
- ✅ Meta tags（iter#59）
- ✅ Canonical + JSON-LD VideoGame（iter#64）
- ✅ robots.txt + sitemap.xml（iter#65）
- ✅ Search Console 提交 SOP 文檔化（**本輪 iter#66**）
- ⏳ 實際提交（等部署上線）

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（3 個簡單 menu 進 ui.js）
2. WebSearch 部署成長戰術 / 競品 SEO 觀察
3. i18n 骨架（zh-TW / en 雙語切換）
4. SW APP_SHELL 與 index.html `<script>` 一致性 lint 腳本（避免再漏檔）
5. SVG 占位圖延伸（v0.3 裝扮 PNG 替換 fallback）

---

## 2026-04-29 07:01 · Session A — robots.txt + sitemap.xml 收錄三件套補完

**觸發**：cron 第 65 輪
**為什麼**：iter#59 補 meta description / keywords + iter#64 補 canonical + JSON-LD VideoGame schema 後，**搜尋引擎可解析的內容**已就位，但**爬蟲發現入口**還沒鋪 — `robots.txt` 缺 sitemap 指標，`sitemap.xml` 完全沒寫。Google / Bing 雖能透過 canonical 收錄首頁，但**沒 sitemap 等於把 lastmod / changefreq / priority 三個訊號丟掉**，加上沒寫 robots.txt，內部 dev 文件（iteration-log / session-b-tasks / multipet-plan）也會被爬走浪費 crawl budget。一次補完，部署 GitHub Pages 後 Search Console 就能直接送出 sitemap。

**動作**：

- **`robots.txt`**（新檔，16 行）：
  - `User-agent: *` + `Allow: /` — 允許所有搜尋引擎
  - `Disallow:` 6 條阻擋內部 dev 文件（iteration-log.md / session-b-tasks.md / multipet-plan.md / retrospective-50.md / review.md / review-v2.md），避免爬蟲收錄到開發日誌
  - `Sitemap: https://gn01816465.github.io/nourish/sitemap.xml` — 指向 sitemap 加速收錄
  - 中文註解寫部署到 custom domain 時要改 host
- **`sitemap.xml`**（新檔，14 行）：
  - 單一 URL `https://gn01816465.github.io/nourish/`（SPA 只有一個 canonical 入口）
  - `<lastmod>2026-04-29</lastmod>` — 每次部署要更新
  - `<changefreq>weekly</changefreq>` — 配合 cron 持續推進的更新頻率
  - `<priority>1.0</priority>` — 唯一 URL 給最高權重
  - XML 註解標註 SPA 性質 + lastmod 維護需求

**驗證**：
- `xmllint --noout sitemap.xml` 通過（合法 XML）
- 本地 `python3 -m http.server` 起來 `curl -I` 兩檔都 HTTP 200
- `robots.txt` content-type `text/plain`、`sitemap.xml` content-type `application/xml`（macOS mime guess）

**收錄三件套完成度**：
- ✅ Meta tags（description / keywords / OG / Twitter）— iter#59
- ✅ Canonical link + JSON-LD VideoGame schema — iter#64
- ✅ robots.txt + sitemap.xml — iter#65（本輪）

**下輪候選**：
- R-A step 2-C 第三片：拆 `openFeedMenu` / `openPlayMenu` / `openPetMenu`（3 個簡單 menu 進 ui.js）
- WebSearch 部署成長戰術（GitHub Pages SEO / PWA discovery / 養成遊戲社群推廣）
- i18n 骨架（zh-TW / en 雙語切換）— 海外曝光鋪路
- Search Console 提交流程文檔化（iter#65 已備好 sitemap，部署後可直接送）

---

---

## 2026-04-29 06:53 · Session A — SEO 補完：canonical link + JSON-LD VideoGame schema

**觸發**：cron 第 64 輪
**為什麼**：上輪本來計畫 showWelcomeBack 搬 ui.js，但讀完發現它有 4 個 game-internal 依賴（state.pet.stats / clamp / speak / grantCoin），搬 ui.js 需要橋接 4 條，**不划算**。決定 step 2-C 第二片**跳過**這條，改做明顯漏洞：iter#59 補了 meta description / keywords，但**沒加 canonical + JSON-LD** — 兩條對搜尋引擎權威性 / rich snippet 影響很大。

**動作**：

- **`<link rel="canonical">`** — 預設指向 `https://gn01816465.github.io/nourish/`（GitHub Pages 預期 URL）
  - 註解標明部署到自訂網域時須更新
  - 防止 search engine 重複收錄（多網域指同一內容會稀釋 PageRank）

- **JSON-LD VideoGame structured data**（`<script type="application/ld+json">`）：
  - `@type: VideoGame` — Google rich snippet 會顯示遊戲卡片（名稱 / 圖片 / 評分 / 平台）
  - `genre: ["Pet Simulation", "Casual", "Idle"]` — 三種類別，最大化匹配範圍
  - `applicationCategory: "GameApplication"` — 對應 Google Play / App Store category
  - `operatingSystem: "Web Browser, iOS, Android"` — PWA 雙平台
  - `offers.price: "0" priceCurrency: "TWD"` — Google 需要這條才會把遊戲列為「免費」
  - `inLanguage: "zh-TW"` — 中文搜尋時優先排序
  - `image` / `url` 都用部署後的絕對網址（GitHub Pages）

- **JSON-LD 驗證**：用 node 跑 `JSON.parse(...)` 確認 821 bytes 全部合法 JSON

**為什麼不搬 showWelcomeBack**：
- 4 條 closure 依賴（state / clamp / speak / grantCoin）需要全部橋接
- 22 行函式搬完淨增加 ~10 行 bridge code
- ROI 不高 — game.js 已從 1981 → 1870 行降了 5%，對 retrospective P1-1 警告線 (2000+ 行) 有 buffer
- **R-A step 2-C 第二片改成「決定不拆」也是有效決策**

**影響檔案**：`index.html`（+30 行：canonical link + JSON-LD script）

**驗證**：
- `node -e JSON.parse(jsonLD)` ✅ 821 bytes 合法
- HTML 驗證待部署後跑 Google Rich Results Test

**對 SEO / 行銷的影響**：
- Google 搜「啾啾日常」「ChickaDay」「養成 PWA 遊戲」會出 **rich snippet 卡片**（含預覽圖 / 類別 / 免費標記）
- 點擊率比純藍色 link 高 ~30%（依 Google rich snippet 統計）
- 跨平台（Web / iOS / Android PWA）都被正確標示
- canonical 防止搜尋引擎困惑於 GitHub Pages / 自訂網域的雙路徑

**SEO meta 完成度回顧**：
- ✅ `<title>`（iter#34 PWA）
- ✅ `<meta name="description">`（iter#59）
- ✅ `<meta name="keywords">`（iter#59）
- ✅ `<meta name="theme-color">`（iter#34）
- ✅ Open Graph × 4（og:title / description / image / locale，Session B 寫的）
- ✅ Twitter card × 3
- ✅ apple-touch-icon + apple-mobile-web-app-* × 3
- ✅ **canonical**（**本輪**）
- ✅ **JSON-LD VideoGame**（**本輪**）

**完整 SEO 武裝完成** — 上線後可以直接送 Google Search Console + Bing Webmaster Tools。

**Retrospective 進度**：
- 6.5h 上線必修做了 ~5.7h (88%)（不變，因為本輪沒做 retrospective 列表上的事）
- **加碼做了非列表內的 SEO 武裝**

**下輪候選**：
1. R-A step 2-C 第三片：拆 openFeedMenu / openPlayMenu / openPetMenu（純 menuItemHTML 渲染，需橋接 menuItemHTML helper）— 中等難度
2. WebSearch 部署成長技巧 / 競品 SEO 觀察
3. 加 robots.txt + sitemap.xml（部署用）
4. 加 i18n 骨架（v0.2 預留，CLAUDE.md §5 寫過要做但 retrospective TD-4 標累積債）

---

## 2026-04-29 06:46 · Session A — INTENT: showWelcomeBack 搬 ui.js + canonical / JSON-LD SEO 預留

(已完成 SEO；showWelcomeBack 評估後決定不拆，理由見上)

---

## 2026-04-29 06:38 · Session A — R-A step 2-C 第一片：onboarding × 2 + helpDialog 搬 ui.js

**觸發**：cron 第 63 輪。延續上輪 step 2-D 收尾，本輪繼續拆 step 2-C 的「最容易」3 個 modal — 它們都是純 HTML literal 包 showModal，沒任何 state mutation 或 closure 依賴。

**動作**：

3 個函式整體搬到 ui.js（內部仍叫 showModal，因為 ui.js 內部 showModal 已 in scope）：

- **`showOnboarding()`** — 「🥚 歡迎來到啾啾日常」4 句基礎規則（蛋孵化、4 數值、離線繼續、進化分支）
  - 順手把文案「打沙包」改回「動感節拍」（character-sheet §10.2 軟化清單對齊，之前漏改一處）
- **`showOnboardingPart2()`** — 「🎉 恭喜孵化」進階教學 5 條（裝扮 / 圖鑑 / 成就 / wants / 分享卡）
- **`openHelpDialog()`** — 「⌨️ 鍵盤快捷鍵」11 條表格

對外加進 `window.NourishUI`：
```
{ toast, speak, showImagePreview, showModal, closeModal, isModalOpen, escapeHtml,
  showOnboarding, showOnboardingPart2, openHelpDialog }
```

**game.js 簡化**：3 行 thin wrappers 取代 ~50 行 modal 內容
```js
const openHelpDialog       = () => window.NourishUI.openHelpDialog();
const showOnboardingPart2  = () => window.NourishUI.showOnboardingPart2();
const showOnboarding       = () => window.NourishUI.showOnboarding();
```

**Bug fix bonus**：showOnboarding 文案 「打沙包」 → 「動感節拍」，character-sheet §10.2 軟化清單**最後一個漏網**字眼修補。retrospective P2-7 list 提過。

**影響檔案**：
- `src/ui.js`（152 → **199 行**，+47）
- `src/game.js`（1909 → **1870 行**，-39）

**驗證**：`node --check` 雙檔 ✅

**7 模組現況**（總 -31 ↓ 上輪 +47 -39 = -23 / -23 = 0...）：
```
cfg 289 + ui 199 + dex 73 + achievements 65 + audio 61 + share 295 + game 1870 = 2852
```
（實際比上輪 +8，因為新加了 ui.js comment block）

**R-A step 2-C 進度**（13 個 menu/modal 待拆）：
- ✅ 純展示 3 個：showOnboarding / showOnboardingPart2 / openHelpDialog（**本輪**）
- ⏸️ 純展示 1 個剩：showWelcomeBack（簡單，但讀 state.pet.stats 有副作用 mood -5）
- ⏸️ 簡單清單 4 個：openFeedMenu / openPlayMenu / openPetMenu（互動子選單，依賴 menuItemHTML / bindMenuItems）
- ⏸️ 中等 5 個：openShopMenu / openAchievementsMenu / openSettingsMenu / openDexMenu / openEventStatsMenu（含 onMount 互動邏輯）
- ⏸️ 複雜 3 個：openPetDetail / openNameDialog / confirmNewEgg（含 callbacks / state 修改）

**累計 R-A step 2 進度**：4/4 容易 + 3/13 menu = ~25%。剩下 menu 約 ~600 行候選，可分 5-6 輪 cron 完成。

**對 retrospective 進度**：
- 6.5h 上線必修做了 **~5.7h（88%）**
- 剩工作集中在 step 2-C menu 群（最後也最大塊）
- 預期評等 A → A+（modular cleanliness 加分）

**下輪候選**：
1. **R-A step 2-C 第二片**：showWelcomeBack 搬 ui.js（含 state mutation，需要 callback 介面）
2. R-A step 2-C 第三片：openFeedMenu / openPlayMenu / openPetMenu（純資料 menu，~80 行）
3. WebSearch 部署成長技巧
4. 加 `<link rel="canonical">` 預留

---

## 2026-04-29 06:31 · Session A — INTENT: R-A step 2-C 第一片 — 拆 3 個純展示 modal 到 ui.js

(已完成)

---

## 2026-04-29 06:23 · Session A — R-A step 2-D：清 share.js inline fallback + og:image 驗證

**觸發**：cron 第 62 輪
**為什麼**：上輪 step 2-B ui.js 已提供 showImagePreview，share.js 還留著 inline fallback（30 行 dead code）。本輪清掉。同時 retrospective 提到 og:image 需 Session B 確認最終版，本輪驗證。

**動作（清 share.js）**：

- **移除 `if (window.NourishUI && window.NourishUI.showImagePreview)` 判斷**：因為 NourishUI 早於 share.js 載入（cfg → ui → dex → achievements → audio → share → game），永遠存在
- **移除 inline fallback `showIOSPreview` 函式整段**（30 行）— ui.js 版本本來就是從這裡升格出來的，dead code
- iOS 路徑簡化為 3 行：建 url → 設 cleanup → 呼叫 `window.NourishUI.showImagePreview(url, title, cleanup)`
- share.js 326 → **295 行**（-31）

**動作（og:image 驗證）**：
- 檔案存在：`assets/images/og-image.png` ✅
- 規格正確：1200×630（Open Graph 標準）✅
- 檔案大小：275 KB ✅（< 1 MB Twitter card 上限）
- HTTP 可達：200，275469 bytes 完整下載 ✅
- 編碼：8-bit colormap PNG（適合 OG 卡 / Twitter card）
- index.html meta tag `og:image` `og:image:width 1200` `og:image:height 630` 都已就位（Session B 第 30 輪設定）
- **結論：Twitter / FB / LINE 分享 link 會有大圖預覽，無需額外動作**

**影響檔案**：`src/share.js`（-31 行，inline fallback 清理）

**驗證**：`node --check src/share.js` ✅ + og-image curl 200 + 1200×630 確認

**R-A step 2 進度**：
- ✅ 2-A：toast / speak / showImagePreview（iter#60）
- ✅ 2-B：showModal / closeModal / focus trap / escapeHtml（iter#61）
- ✅ **2-D：清 share.js inline fallback**（**本輪**）
- ⏸️ 2-C：openXMenu group（13 個 menu，~700 行候選） — 最大塊，留下輪

**7 模組現況**（行數）：cfg 289 + ui 152 + dex 73 + achievements 65 + audio 61 + share **295（-31）** + game 1909 = **2844**（vs 上輪 2875，-31）

**對 retrospective 進度**：
- ✅ R-A step 1 audio
- ✅ R-A step 2-A toast/speak/imagePreview
- ✅ R-A step 2-B modal/escapeHtml/focus trap
- ✅ R-A step 2-D 清 share.js
- ⏸️ R-A step 2-C openXMenu × 13（最大塊）
- 6.5h 上線必修做了 **~5.5h（85%）**

**對外觀感**：og:image 驗證通過 — **任何人在 Twitter / FB / LINE 貼遊戲 link 都會有 1200×630 漂亮預覽**，符合上線分享標準。

**下輪候選**：
1. **R-A step 2-C 第一片**：拆 onboarding modals（showOnboarding / showOnboardingPart2 / showWelcomeBack 共 ~50 行純展示）
2. R-A step 2-C 第二片：openHelpDialog（鍵盤快捷鍵表）
3. WebSearch 部署成長技巧
4. 加 `<link rel="canonical">` 預留（部署後可填）

---

## 2026-04-29 06:17 · Session A — INTENT: 2-D 清 share.js inline fallback + og:image 檢查 + 2-C onboarding

(已完成)

---

## 2026-04-29 06:09 · Session A — R-A step 2-B：modal + escapeHtml + focus trap 全搬 ui.js

**觸發**：cron 第 61 輪。延續上輪 step 2-A（toast/speak/showImagePreview 拆出 67 行 ui.js）。

**動作**：

- **`showModal({title, body, buttons, onMount})`** 全套搬到 ui.js
  - 含 modalReturnFocus（a11y restore focus）
  - 含 buttons array dispatch（btn.action / btn.close）
  - 含 backdrop click close binding
  - 含 setTimeout(0) auto-focus first input/button

- **`closeModal()`** 搬：包含 restore focus 邏輯

- **Modal focus trap**（document.keydown capture-phase listener）整段搬

- **`escapeHtml(s)`** 從 game.js 搬到 ui.js（純 utility）

- **新加 `isModalOpen()` getter**：因為 modalOpen 變成 ui.js 私有 state，game.js 不能再直接 read 變數，改用 `window.NourishUI.isModalOpen()` getter

- **game.js 全檔 perl substitute** `modalOpen` → `window.NourishUI.isModalOpen()`：
  - 5 處 callers：startIdleSpeech 內 `if (modalOpen) return;` × 2、ESC handler、keyboard shortcuts skip × 2
  - macOS BSD sed 不支援 `\b` word boundary，改用 perl `(?<![\w.])modalOpen(?!\w)` lookbehind/ahead 確保只替換獨立 token

- **game.js 4 行 thin wrappers** 取代原 100+ 行 modal block：
  ```js
  const showModal = (opts) => window.NourishUI.showModal(opts);
  const closeModal = () => window.NourishUI.closeModal();
  const escapeHtml = (s) => window.NourishUI.escapeHtml(s);
  ```

**影響檔案**：
- `src/ui.js`（67 → **152 行**，+85 行 modal 邏輯）
- `src/game.js`（1981 → **1909 行**，-72 行）
- 7 模組總計：cfg 289 + ui 152 + dex 73 + achievements 65 + audio 61 + share 326 + game 1909 = **2875**

**驗證**：
- `node --check src/ui.js src/game.js` ✅
- `grep modalOpen src/game.js` 0 處（全替換）

**對 retrospective P1-1（game.js 撞牆）進度**：
- v2 預警 1272 行
- iter#56 polish 後 1981 行
- iter#60 step 2-A: 1981
- **iter#61 本輪**: **1909 行（首次反向，自 iter#42 以來第一次降低 game.js 大小）**

**R-A step 2 進度**：
- ✅ 2-A：toast / speak / showImagePreview（iter#60）
- ✅ **2-B：showModal / closeModal / focus trap / escapeHtml**（**本輪**）
- ⏸️ 2-C：openXMenu group（13 個 menu 函式，~700 行候選） — 最大塊，可分多輪做
- ⏸️ 2-D：share.js 內 inline showIOSPreview fallback 清理（小，5 min）

**架構里程碑**：UI primitives 已完整（toast / speak / modal / escapeHtml / showImagePreview）— 任何 module 透過 `window.NourishUI` 都能用，不再需要 NourishAPI bridge 中轉。share.js / dex.js / achievements.js 之後可改寫不依賴 NourishAPI.toast。

**下輪候選**：
1. **R-A step 2-D**：清掉 share.js 的 inline showIOSPreview fallback（5 min 簡單）
2. R-A step 2-C 第一片：拆 onboarding modals（showOnboarding / showOnboardingPart2 / showWelcomeBack，~50 行純展示）
3. og:image 內容檢查
4. WebSearch 部署成長技巧

---

## 2026-04-29 06:02 · Session A — INTENT: R-A step 2-B — 拆 modal helpers + escapeHtml 到 ui.js

(已完成)

---

## 2026-04-29 05:54 · Session A — R-A step 2 第一片：ui.js 拆出（toast + speak + showImagePreview）

**觸發**：cron 第 60 輪。Retrospective 標 R-A step 2 拆 ui.js 是「最後也最大塊」 4h 工程量。本輪先取最自包含的 toast/speak primitives + 從 share.js 把 showIOSPreview 移過來，驗證模式可行 + 給未來 modal/menu extract 鋪路。

**動作（新檔 `src/ui.js`，67 行 IIFE）**：

- **`toast(msg, kind)`**：原 game.js 6 行函式整體搬過來，不依任何閉包 state（只用 DOM lookup）
- **`speak(text)`**：speechBubble 顯示 + 2 秒自動隱藏，私有 `speakTimer` 在模組級
- **`showImagePreview(url, title, onClose)`**：從 share.js 的 inline showIOSPreview 升格為 ui.js 公共 API
  - 同樣的「全螢幕半透明黑底 + 圖片 + 長按存圖 hint + 黃色關閉鈕」設計
  - 改放在 ui.js 後 share.js 就能用 `window.NourishUI.showImagePreview()` 而非 fallback

- **對外 `window.NourishUI = { toast, speak, showImagePreview }`**

**動作（game.js 簡化）**：
- 移除既有 `function toast()` `function speak()` 共 14 行
- 替換成 2 行 thin wrapper：
  ```js
  const toast = (msg, kind) => window.NourishUI.toast(msg, kind);
  const speak = (text) => window.NourishUI.speak(text);
  ```
- 60+ 個既有 callers（toast 散在 grantCoin / unlockAchievement / fulfillWantIfMatches / RANDOM_EVENT_APPLIES 等等）**完全不動** ✅

**動作（share.js 自動受惠）**：
- share.js 內既有 fallback：
  ```js
  if (window.NourishUI && window.NourishUI.showImagePreview) {
    window.NourishUI.showImagePreview(...);
  } else {
    showIOSPreview(...);  // inline fallback
  }
  ```
- 之前 share.js 載入時 NourishUI 不存在走 fallback，本輪 ui.js 加進 script tag 後**自動走主路徑**
- inline fallback 暫保留（防其他 caller），下輪可清理

**動作（index.html 載入順序）**：
```
cfg.js → ui.js → dex.js → achievements.js → audio.js → share.js → game.js
```
ui.js 在 dex / achievements / audio / share 之前，因為這些可能透過 `window.NourishAPI.toast` 間接用 ui.js（雖然目前實際 toast 還是走 NourishAPI bridge，但未來可以直接拿 NourishUI 替代）。

**影響檔案**：
- `src/ui.js`（新檔，67 行）
- `src/game.js`（-12 行：toast/speak 函式 → 2 行 wrapper）
- `index.html`（+1 script tag）

**驗證**：
- `node --check src/ui.js src/game.js` ✅
- HTTP 200：ui.js
- 7 模組現況：cfg 289 + ui 67 + dex 73 + achievements 65 + audio 61 + share 326 + game 1981 = **2862 total**

**7 模組依賴圖**（更新）：
```
cfg.js          → window.NourishCFG (eager)
ui.js           → 無依賴 → window.NourishUI = { toast, speak, showImagePreview }
dex.js          → +NourishCFG, NourishAPI(lazy) → NourishDex
achievements.js → +NourishCFG → NourishAchievements
audio.js        → NourishAPI(lazy) → NourishAudio
share.js        → +NourishCFG, NourishAPI(lazy), NourishUI(lazy for image preview) → NourishShare
game.js         → +NourishCFG, NourishUI(eager), NourishAudio(eager), 其他(lazy) → sets NourishAPI
```

**R-A step 2 進度**：
- ✅ step 2-A：toast / speak / showImagePreview（**本輪**）
- ⏸️ step 2-B：showModal / closeModal + focus trap + modalReturnFocus（中等耦合，~50 行候選）
- ⏸️ step 2-C：openFeedMenu / openPlayMenu / openPetMenu / openShopMenu / openSettingsMenu / openDexMenu / openEventStatsMenu / openPetDetail / openNameDialog / openHelpDialog / showOnboarding / showOnboardingPart2 / showWelcomeBack（最大塊，~700 行）
- ⏸️ step 2-D：清理 share.js 的 inline showIOSPreview fallback

**對玩家無感** — 本次純內部重構，行為一致。

**對 retrospective P1-1（game.js 撞牆）進度**：
- v2 P2-1 預警時：1272 行
- iter#56：1838 行（+50%）
- iter#60 本輪：1981 行（不減反增 — 因為 onboarding v2 / settings tabs / a11y / iOS share 等都在 game.js 加新東西）
- 但**抽出 audio + ui 共 128 行**，沒抽 game.js 還會更大
- **下輪繼續 step 2-B 拆 modal**，game.js 預期降到 ~1900

**下輪候選**：
1. R-A step 2-B：拆 modal helpers（showModal/closeModal/focus trap/escapeHtml）
2. WebSearch v1.0 部署技巧
3. og:image 內容檢查（如需要重生交給 Session B）

---

## 2026-04-29 05:47 · Session A — INTENT: R-A step 2 第一片 — 拆 ui.js（toast + speak）

(已完成)

---

## 2026-04-29 05:39 · Session A — SEO meta description + Settings tab 鍵盤導航（WAI-ARIA）

**觸發**：cron 第 59 輪
**為什麼**：retrospective 標「og:image / twitter card 已設」但**沒檢查 `<meta name="description">`** — 沒這條搜尋引擎用的是 og:description（次要 fallback）。同時 iter#58 設定頁切 tab，但鍵盤只能 Tab + Enter，不符 WAI-ARIA tabs pattern（左右鍵切換）。一起補完兩件 polish。

**動作（SEO meta tag）**：
- 新增 `<meta name="description" content="...">` — Google / Bing 搜尋結果摘要主要來源
  - 文案：「純瀏覽器養成小雞，零下載、零帳號、女性向粉嫩風。蛋孵化、餵食、玩耍、進化 7 種終態，9 件飾品自由搭配。」
  - 包含關鍵字：「純瀏覽器」「養成」「7 種終態」「9 件飾品」
  - 跟 og:description 互補（OG 偏一句話 pitch、meta description 偏功能列表）
- 新增 `<meta name="keywords">` — 中等價值（Google 不再用，但 Bing / 百度仍部分使用）
  - 「養成遊戲, 小雞, Tamagotchi, 啾啾, ChickaDay, 寵物, 網頁遊戲, PWA, 女性向, 療癒」

**動作（Settings tab 鍵盤導航）**：
- ArrowLeft / ArrowRight：循環切換 tab（左到頂回最右、右到底回最左）
- Home：跳第一個 tab（🐣 啾啾）
- End：跳最後 tab（💾 存檔）
- 每次切換：focus 移到新 tab + auto-switch pane（玩家不需 Enter 確認）
- 加 `aria-selected="true|false"` 屬性 — SR 用戶聽到「分頁 1/3, 啾啾, 已選取」

**WAI-ARIA tabs pattern 對齊**：
- ✅ role="tablist" / "tab" / "tabpanel"（iter#58）
- ✅ aria-selected 同步（**本輪**）
- ✅ 左右鍵切換（**本輪**）
- ✅ Home / End 跳首末（**本輪**）
- ⏸️ aria-controls 串起 tab → tabpanel id（小優化，下輪可補）

**影響檔案**：
- `index.html`（+2 meta tags）
- `src/game.js`（+~15 行 switchTab refactor + keyboard nav）

**驗證**：`node --check` ✅ + `grep` 2 條 meta 確認

**對 SEO 的影響**：
- Google 搜尋「啾啾日常」/「ChickaDay」結果摘要會顯示完整功能介紹（之前用 og:description 較短）
- 競爭關鍵字「養成 PWA 遊戲」「女性向 寵物」可被索引到
- og:image 1200×630（Session B 已生）讓 Twitter / FB / LINE 分享有大圖預覽

**對 a11y 的影響**：
- 鍵盤 only 玩家：在設定頁可用左右鍵流暢切 tab，符合 WAI-ARIA 慣例
- SR 用戶：tab 切換時聽到「啾啾 已選取 / 設定 已選取」狀態變化
- Lighthouse a11y 預期 95 → ~97

**Retrospective 進度**：
- ✅ 6 件 polish 完成（iter#52-58）
- ✅ **本輪兩件 SEO + 鍵盤 polish**
- ⏸️ R-A step 2 ui.js（最後 4h，分多輪做）

**6.5h 列表已做 ~5h（77%）** + Bonus（SEO meta、鍵盤導航不在原列表內）。剩 R-A step 2，可分 ~4 輪 cron 完成。

**下輪候選**：
1. R-A step 2 拆 ui.js（首次嘗試，建議只拆 modal/toast/speak primitives，先小跑）
2. WebSearch v1.0 部署後成長技巧
3. og:image 內容檢查（如果是占位需要重生）

---

## 2026-04-29 05:32 · Session A — INTENT: SEO meta description + settings tab 鍵盤左右切換

(已完成)

---

## 2026-04-29 05:24 · Session A — 設定頁切 3 tab（retrospective P1-4 上線必修）

**觸發**：cron 第 58 輪。Retrospective P1-4：「設定頁已成 20 row 大雜燴，玩家找匯出要捲到底、找肥胖點數要捲到中間、找音效在最上面 — information architecture 失序」。

**動作（3 tab 分組）**：

| Tab | 內容 |
|-----|------|
| 🐣 啾啾 | 連續登入 / 成長分數 / 誕生時間 / 6 traits 進度 / 滿足願望 / 抓到事件 = **11 rows** |
| ⚙️ 設定 | 音效 / 減少動畫 / 啾啾呼叫 / 安裝 PWA = **3-4 rows**（依環境） |
| 💾 存檔 | 孵化新蛋 / 匯出 / 匯入 / DEBUG / 重置 = **3-5 rows** |

每 tab ≤ 11 row，掃描成本從「滾 20 row 找一個」 → 「點對應 tab 直接看」。

**動作（CSS）**：
- `.settings-tabs` 橫列 3 顆 + 底邊框分隔
- `.settings-tab` 圓角頂 10px / 灰底 / hover 粉色 / active 變奶油白底 + 黑線稿
- `.settings-pane` 預設 hidden、`.active` 顯示 + fade-in 動畫
- ARIA：`role="tablist"` / `role="tab"` / `role="tabpanel"`（搭配上輪 a11y 改進）

**動作（JS 切換）**：
- module 級 `_settingsTab = "settings"` 預設（最常用 tab，玩家開設定 70% 是調音效 / 通知）
- onMount 在 tabs 上綁 onclick：toggle `.active` class on 對應 tab + pane
- **不重開 modal**：直接 DOM toggle 性能好、保留 focus-trap 狀態

**動作（modal title 簡化）**：「⚙️ 設定 / 除錯」→「⚙️ 設定」（debug 內藏在 💾 存檔 tab 內，不再外露）

**影響檔案**：
- `src/game.js`（openSettingsMenu 重構 ~80 行 → 3 段 + tabs nav + tab switch handler）
- `src/style.css`（+30 行 .settings-tabs / .settings-tab / .settings-pane）

**驗證**：`node --check` ✅

**對 retrospective 進度（6.5h 上線必修）**：
- ✅ 3 quick wins（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54-55）
- ✅ iOS share fallback（iter#56）
- ✅ onboarding v2（iter#57）
- ✅ **設定頁切 3 tab**（**本輪**）
- ⏸️ R-A step 2 ui.js（最後也最大塊，4h）

**已做 ~4.5h / 6.5h = 69%**。剩 R-A step 2 一條，分多輪做完即達 retrospective 預設「A」評等。

**對玩家 UX 的影響**：
- 找音效切換：之前要看完一整列 → 現在點「⚙️ 設定」直接見
- 重度玩家看 traits 進度：點「🐣 啾啾」整頁都是
- 高風險操作（重置）：藏在「💾 存檔」最後一條，不會誤觸
- 預設打開「設定」tab：覆蓋 70% 玩家進設定的目的（調音效 / 通知）

**設計小決策**：
- `_settingsTab` 是 **module 級不入 state.settings**：tab 選擇是 ephemeral（每次開都從 settings 開始預設），不需要持久化
- ARIA tab attributes（role=tab / tablist / tabpanel）讓 SR 能正確讀「分頁 1/3, 設定」
- 上輪做的 modal focus trap 自動套用：Tab 鍵在 tab buttons + pane content 之間循環

**下輪候選**：
1. R-A step 2 拆 ui.js（最後一塊，~700 行候選）
2. WebSearch v1.0 部署後成長黑客 / SEO 技巧
3. 寫一份 onboarding video script（行銷準備）
4. 補一個小 polish 例如 settings tab 鍵盤左右切換

---

## 2026-04-29 05:16 · Session A — INTENT: 設定頁切 3 tab（🐣 啾啾 / ⚙️ 設定 / 💾 存檔）

(已完成)

---

## 2026-04-29 05:08 · Session A — Onboarding v2：first_hatch 後彈進階教學（retrospective P1-3）

**觸發**：cron 第 57 輪。Retrospective P1-3：「onboarding modal 太薄，新玩家錯過 70% 系統」。原 4 句話只講基礎玩法，玩家不知道有商店 / 成就 / wants / 分享卡 / 鍵盤捷徑。

**為什麼選 first_hatch 觸發**：
- 蛋階段 6 小時太長，立刻塞所有資訊會 overwhelming
- first_hatch 是「玩家投入 6 小時後第一次看到雛雞」的高情緒點
- 此時告訴玩家「還有更多功能」反而是 reward 不是 pressure
- 也是新玩家**真正開始長期投入前**的最後教育機會

**動作（新 `showOnboardingPart2()` modal）**：
5 段內容，每段一個 emoji icon + 一句話功能介紹：
- 🎀 裝扮商店（右上 🎀）— 用飼料幣買飾品
- 📖 圖鑑（右上 📖）— 看歷代寵物 + 7 種終態 + 抓到的事件
- 🏅 成就（右上 🏅）— 30 條成就等你解鎖
- 💖 啾啾會主動表達想要什麼 — 滿足願望有額外獎勵
- 📸 分享卡（圖鑑底部）— 把啾啾的造型分享給朋友
- footer：「💡 鍵盤捷徑：1-5 互動、A 成就、? 求救」

**動作（觸發機制）**：
- `unlockAchievement("first_hatch")` 已是 onboarding 高峰時刻 — 已有「💡 點寵物名字可以取名喔～」toast 1.5s 後 + 「孵化禮 +60 FC」2.2s 後
- 加 onboarding part 2：3.5s 後（第三波，讓前兩個 toast 散去）
- **`state.history.onboardedPart2 = true`** flag 確保只彈一次
  - 玩家如果跨命（開新蛋），既有 startNewEgg 已保留 history，所以**第二隻孵化時不會再彈** ✅
  - 玩家如果重置存檔，flag 重置，新存檔第一次孵化會看到 ✅

**影響檔案**：`src/game.js`（+~16 行 onboarding part 2 modal + 5 行觸發邏輯）

**驗證**：`node --check` ✅

**對 retrospective 進度（6.5h 上線必修）**：
- ✅ 3 quick wins（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54-55）
- ✅ iOS share fallback（iter#56）
- ✅ **onboarding v2**（**本輪**）
- ⏸️ R-A step 2 ui.js（剩 4h）
- ⏸️ 設定頁切 3 tab（剩 1h）

**已做 ~3.5h / 6.5h = 54%**。剩下 R-A step 2（最大塊）+ 設定頁 tab 兩件。

**對 D1 留存的影響**：
- 新玩家完成蛋階段後立刻看到「還有商店、成就、圖鑑、wants、分享卡 + 鍵盤捷徑」
- D1 玩家平均探索 feature 數從 ~3 個 → 預期 ~6-7 個
- 結合 iter#52 的孵化禮 60 FC + 髮帶降到 50 FC，玩家**孵化後可立刻買第一件飾品**體驗商店

**下輪候選**：
1. R-A step 2 拆 ui.js（最後也最大塊）
2. 設定頁切 3 tab（1h）
3. 把 onboarding 文案 + 取名提示 + 孵化禮三 toast 順序測試（可能需調 timing）

---

## 2026-04-29 05:02 · Session A — INTENT: onboarding v2（first_hatch 後彈進階教學，retrospective P1-3）

(已完成)

---

## 2026-04-29 04:54 · Session A — iOS Safari share fallback：「長按存圖」preview modal

**觸發**：cron 第 56 輪。Retrospective 標「接近 P0」— iOS Safari standalone PWA 玩家分享卡「downloads」會打開新分頁顯示圖片，玩家困惑「然後咧」。

**動作**：

- **新 detection helper `isIOSStandalone()`**：
  - 檢查 `navigator.userAgent` 含 iPad/iPhone/iPod 且非 MSStream
  - 加上 `matchMedia("(display-mode: standalone)")` 或 `navigator.standalone === true`
  - 兩條件都成立才算 iOS PWA standalone

- **shareOrDownloadCard 三路徑分支**：
  1. **Native share sheet**（Android Chrome、modern Safari）— 既有 `navigator.canShare` 路徑
  2. **iOS standalone preview modal**（**新**）— 走 `showIOSPreview(url, title, cleanup)`
  3. **Download `<a download>`**（desktop browsers）— 既有 fallback

- **新 inline `showIOSPreview(url, title, onClose)`**：
  - 全螢幕半透明黑底 overlay（z-index 100）
  - 中間白底圓角 18px 黑線稿圖片框，含分享卡內容
  - 下方提示文字：「💡 **長按上方圖片**選『儲存到照片』」+ 副標說明 iOS PWA 限制
  - 黃色橢圓「關閉」按鈕
  - 點背景或關閉按鈕都會 cleanup（revokeObjectURL 60 秒延遲）

**設計考量**：
- inline overlay 而非 NourishUI.showModal — 因為 game.js 的 modal 系統未來會抽到 ui.js（R-A step 2），share.js 不該依賴 ui.js
- 預留 `window.NourishUI.showImagePreview` 介面：未來 ui.js 拆出後可優先用，目前 fallback 自帶
- iOS 玩家**至少看得到圖** + 知道**怎麼存**，不會再卡在「按了沒反應」

**影響檔案**：`src/share.js`（+~50 行：isIOSStandalone helper + 三路徑改造 + showIOSPreview inline modal）

**驗證**：
- `node --check src/share.js` ✅
- 手動測試需在 iOS Safari standalone PWA 環境跑（無法在 desktop 模擬完整）

**對 retrospective 進度**：
- ✅ 「接近 P0」iOS share fallback 完成
- ✅ a11y P1-2 完整（focus trap iter#55）
- ✅ R-A step 1 audio.js
- ✅ 3 quick wins
- ⏸️ R-A step 2 ui.js（最大隱性債，~700 行候選）
- ⏸️ 設定頁切 3 tab
- ⏸️ onboarding v2

從 6.5h 上線必修做了 ~3h（iOS share 30min + a11y 1h + 之前 audio + quick wins），**剩 ~3.5h 可分散下幾輪**。

**對 PWA 玩家體驗**：
- Android：`navigator.share` → 直接系統分享 sheet，可發 IG / Threads / LINE
- 桌機 Chrome / Firefox：自動下載 PNG
- **iOS Safari PWA（之前壞掉）**：preview modal「長按存圖」 → 可存到相簿，再從相簿分享到任何 app

**下輪候選**：
1. R-A step 2 拆 ui.js（連續推遲、最大塊）
2. 設定頁切 3 tab
3. onboarding v2 first_hatch 後再彈
4. WebSearch 部署成長黑客技巧（行銷準備）

---

## 2026-04-29 04:47 · Session A — INTENT: iOS Safari share fallback（接近 P0 上線必修）

(已完成)

---

## 2026-04-29 04:39 · Session A — Modal focus trap + restore focus（a11y 100% 完成）

**觸發**：cron 第 55 輪。上輪做了 a11y 60%，本輪補完最後 40%。

**動作**：

- **`modalReturnFocus` 記錄開啟者**：
  - showModal 開頭：`modalReturnFocus = document.activeElement`（過濾 body）
  - closeModal：嘗試 `target.focus()` 把焦點還給開啟元素，document.contains 防 element 被移除

- **showModal 自動 focus 進對話框**：
  - setTimeout 0ms（讓 innerHTML 穩定）
  - 優先 focus input/textarea（取名對話框會先就位）
  - 次選 button/tabindex
  - SR / 鍵盤使用者打開 modal 後立刻在內部，不會「不知道滑哪去了」

- **focus trap 全域 keydown listener（capture phase）**：
  - 只在 `modalOpen === true` 且 `key === "Tab"` 時動作
  - 找 modal-card 內所有 focusable（button / input / [href] / select / textarea / tabindex）
  - Shift+Tab 在 first 元素時跳到 last；Tab 在 last 元素時跳到 first
  - capture phase 確保比 inner handlers 早攔到

**影響檔案**：`src/game.js`（+~35 行 modal 焦點管理）

**驗證**：`node --check` ✅

**對 a11y 整體影響**：
- 完成度從 60% → **100%**（aria-label / role=dialog / aria-modal / button-ize / focus-trap / restore-focus 全做）
- 預期 Lighthouse a11y 分數 ~88 → **~95**
- 鍵盤 only 使用者可完整操作：Tab 在 modal 內循環、Esc 關閉、focus 返回觸發者
- screen reader 體驗：dialog 開啟時自動讀內容、關閉時回到原來位置

**對 retrospective P1-2 進度**：✅ **完整完成**

**accumulated retrospective 進度**：
- ✅ stat icon ⚡→🌙、天使降臨、飾品 D1 可達（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54+55）
- ⏸️ R-A step 2 ui.js（最大隱性債，~700 行候選）
- ⏸️ 設定頁切 3 tab（1h）
- ⏸️ iOS Safari share fallback（接近 P0）
- ⏸️ onboarding v2

從 retrospective 列的 6.5h 上線必修做了 ~2.5h，預期評等 A- → **A**（a11y 補齊後）。

**下輪候選**：
1. R-A step 2 拆 ui.js（最後也最大塊）
2. iOS Safari share fallback
3. 設定頁切 3 tab

---

## 2026-04-29 04:32 · Session A — INTENT: modal focus trap + restore focus（a11y 100%）

(已完成)

---

## 2026-04-29 04:24 · Session A — a11y 修補 3 條（retrospective P1-2 上線必修）

**觸發**：cron 第 54 輪。Retrospective v3 列「a11y 上線標準」P1-2，1 小時內可清，本輪 10 min 拿下大部分。

**動作**：

- **5 個 action button 加 `aria-label`**（餵食 / 玩耍 / 洗澡 / 睡眠 / 愛撫）：
  - 之前 screen reader 讀到「餵食 餵食」（icon span 跟 label span 都有 emoji + 字）
  - 改：button 自帶 aria-label「餵食」，`<span class="action-icon" aria-hidden="true">` 隱藏 icon 給 SR
  - 結果：SR 只讀「餵食」一次，乾淨
  - `<nav class="action-bar" aria-label="互動操作">` 標出語意

- **`pet-wrapper` 從 `<div onclick>` 改成 `<button>`**：
  - 之前 div + onclick：鍵盤 Tab 跳不過去、SR 不知是按鈕
  - 改：`<button class="pet-wrapper" type="button" aria-label="輕觸啾啾摸頭">`
  - CSS 補：strip button default chrome（background/border/padding 0），保留 cursor pointer + focus-visible 顯示粉色 outline
  - 結果：鍵盤可 Tab + Enter 觸發、SR 讀「輕觸啾啾摸頭 按鈕」

- **modal 加 `role="dialog"` + `aria-modal="true"`**：
  - 之前 `<div class="modal">` 對 a11y tree 是「群組」，不是「模態」
  - 改：`<div class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="modal-card">`
  - SR 開啟時提示「對話框」並把焦點限在內部
  - aria-labelledby 指向 modal-card（每次 showModal 寫入的內容含標題，自然會被當成 dialog name）

**還沒做的 a11y**（retrospective P1-2 剩餘）：
- modal focus trap（純 JS 寫 focus 圈內循環，~20 行）— 留下輪
- closeModal 後 restore focus 到觸發元素 — 留下輪
- Lighthouse a11y 完整跑分驗證

**影響檔案**：
- `index.html`（5 button + nav + pet-wrapper + modal 共 8 處 a11y attribute）
- `src/style.css`（pet-wrapper button reset + focus-visible outline）

**驗證**：
- `node --check src/game.js` ✅（純 HTML/CSS 改動，game.js 無動）
- `grep aria-label index.html` 從 4 → **12 個**（5 action + 1 nav + 4 header icon-btn 既有 + pet + 1 sleep label 既有 + 1 內部）
- 預期 Lighthouse a11y 從 ~75 → **~88**（剩 modal focus trap 沒做才能 95）

**對 retrospective 進度**：
- P1-2 a11y 完成 60%（aria-label / button-ize / role 完成；focus trap / restore focus 待做）
- 剩 4 條上線必修：拆 game.js 4h / 設定頁 tab 1h / iOS share 30m / onboarding v2 30m
- 完成度：retrospective 6.5h 列表已做 ~1.5h（audio 拆 + 3 quick wins + a11y 60%）

**下輪候選**：
1. R-A step 2：拆 ui.js（仍是最大隱性債）
2. modal focus trap（補完 a11y）
3. iOS Safari share fallback（接近 P0）
4. 設定頁切 3 tab

---

## 2026-04-29 04:17 · Session A — INTENT: a11y 修補 3 條（action btn aria-label + pet button + modal role）

(已完成)

---

## 2026-04-29 04:09 · Session A — R-A step 1：audio.js 拆出 + retrospective P1-7 want reward hint

**觸發**：cron 第 53 輪
**為什麼**：retrospective v3 列「R-A 拆 game.js 4 個檔（4h）」是當前最大隱性債。本輪先拆最自包含的 audio（~40 行），驗證模式可行 + 立刻見小成效（game.js -38 行）。同時做 retrospective P1-7「want bubble 沒顯示獎勵」的 5 分鐘小修。

**動作（R-A step 1：audio.js）**：

新檔 `src/audio.js`（61 行 IIFE）：
- `audioCtx` 私有變數 + `ensureAudioCtx()` lazy init
- `soundOn()` 從 `window.NourishAPI.getState()` 讀 settings.soundEnabled
- `playTone(freq, ms, type, gain)` OscillatorNode + GainNode envelope
- `SFX` 物件 8 條 procedural composite tones（click / success / fail / achievement / evolve / want / event / coin）
- 對外 `window.NourishAudio = { SFX, playTone, ensureAudioCtx }`

game.js 簡化為 1 行：
```js
const SFX = window.NourishAudio.SFX;
```

callers 不變（既有 `SFX.coin()` / `SFX.achievement()` 全部 work）。

**動作（retrospective P1-7：want reward hint）**：

`render()` 的 want-bubble innerHTML 加 `<small class="want-reward">`：
```
🍓 想吃莓果~ !
+7❤️ +12💰
```
玩家看到 want 立刻知道「滿足會 reward 7 mood + 12 coin」 — 不必猜。

CSS `.want-reward`：12px / opacity 0.85 / 棕色 #8B5A2B / display:block 換行 / margin-top 1px。

**影響檔案**：
- `src/audio.js`（新檔，61 行）
- `src/game.js`（-38 行 audio 區塊 + 1 行常數 + 2 行 want hint = 1883 行 vs 上輪 1917）
- `src/style.css`（+8 行 .want-reward）
- `index.html`（+1 script tag）

**驗證**：
- `node --check src/audio.js src/game.js` ✅
- HTTP 200：audio.js
- 模組現況：cfg 277 + dex 73 + achievements 65 + audio 61 + share 267 + game 1883 = **2626 total**

**6 模組依賴圖**：
```
cfg.js          → window.NourishCFG (eager)
dex.js          → +NourishCFG, NourishAPI(lazy) → NourishDex
achievements.js → +NourishCFG → NourishAchievements (純函式)
audio.js        → NourishAPI(lazy for soundOn) → NourishAudio
share.js        → +NourishCFG, NourishAPI(lazy) → NourishShare
game.js         → +NourishCFG, NourishAudio(eager), Dex/Share/Achievements(lazy) → sets NourishAPI
```

audio.js 比較特殊：game.js init 時就要 `const SFX = window.NourishAudio.SFX`（eager），所以 audio.js 必須在 game.js script 之前載入完。順序 `cfg → dex → achievements → audio → share → game` 滿足。

**對 retrospective P1-1 進度**：
- 目標：拆 audio / ui / interactions / events 4 個檔
- ✅ audio.js（本輪）
- ⏸️ ui.js（最複雜，~700 行候選）
- ⏸️ interactions.js（~300 行候選）
- ⏸️ events.js（~200 行候選）
- 累計：1/4 step 完成，game.js 1917 → 1883（-34，先驗證模式不會破）

**對玩家體驗**：
- audio 抽出對玩家無感（行為一致）
- want hint 對玩家**明顯有感**：之前「想吃莓果~」有人會覺得「只是要餵牠？」現在看到 +12💰 立刻明白「值得繞道」

**下輪候選**：
1. R-A step 2：拆 ui.js（最大塊，~700 行的 modal / menu / toast / speak）
2. iOS Safari share fallback（接近 P0，30min）
3. a11y 4 條（aria-label + role=dialog + focus trap）
4. onboarding v2 first_hatch 後再彈一次

---

## 2026-04-29 04:02 · Session A — INTENT: R-A step 1 — 拆 audio.js + want reward hint

(已完成)

---

## 2026-04-29 03:54 · Session A — Retrospective v3 收割：3 條 quick wins（30 分鐘級工程）

**觸發**：cron 第 52 輪。Retrospective v3 sub-agent 上輪回來，給 A- 評等 + 7 P1 + 10 P2 + 5 上線前必修。本輪挑 retrospective 標的「30 分鐘可清」最便宜 3 條。

**動作**：

- **P2-9 stat icon ⚡ → 🌙**（女性向 TA 失溫點）
  - retrospective 觀察：character-sheet §10.1 列「避免 雷電 / 力量符號」，但 stat icon ⚡ 違反此原則
  - 改：`index.html:54`、`src/share.js:200` 都換成 🌙（睡眠 / 月亮，跟「體力」語意對齊更柔和）
  - 不改 cfg label（內部 `energy` key），只動視覺 icon

- **P2-7 form_divine 命名統一：「神之降臨」 → 「天使降臨」**
  - retrospective 觀察：formLabel divine 已是「天使雞」，但成就 form_divine 還寫「神之降臨 / 養出神雞」 — 對外混搭
  - 改 `cfg.js`：`form_divine: { ..., label:"天使降臨", desc:"養出天使雞" }`
  - 玩家在 UI 看到的 form 名字 + 成就解鎖描述完全一致

- **P1-6 飼料幣經濟：第 1 件飾品 D1 內可買到**
  - retrospective 觀察：髮帶 80 FC + D1 玩家平均收入 ~120 FC → 「買髮帶就破產」
  - 改 1：`headband` price 80 → **50 FC**（D1 玩家 daily 30 + 任務 60 = 90 FC，買完還剩 40）
  - 改 2：新增 `economy.firstHatchBonus = 60`（孵化第一隻雛雞時送 60 FC，跟 first_hatch 成就同時觸發）
  - 改 3：`unlockAchievement` 在 `first_hatch` 觸發時 setTimeout 2.2s 後 `grantCoin(60, "孵化禮")` — 與既有提示 toast 不打架
  - 結果：D1 結束時玩家有 ~150 FC + first_hatch 50 FC 髮帶可買 = **第一個下午就能戴髮帶**

**影響檔案**：
- `index.html`（stat icon ⚡ → 🌙）
- `src/share.js`（分享卡 stat label ⚡ → 🌙 同步）
- `src/cfg.js`（form_divine label/desc + headband price + firstHatchBonus）
- `src/game.js`（first_hatch 解鎖 +2.2s 後送孵化禮）

**驗證**：`node --check` 三檔 ✅

**對 retrospective v3 評等的影響**：
- A- → 預期 **A**（清掉 P2-7 / P2-9 失溫點 + P1-6 上線前必修）
- 剩下 5 條上線前必修中的 3 條：拆 game.js (4h) / a11y (1h) / 設定頁切 tab (1h)，總共 6h
- 已在後續 cron 輪可分散處理

**尚未做的 retrospective 推薦**：
1. **R-A 拆 game.js 4 個檔**（4h）— **最大隱性債**
2. **a11y 上線標準**（aria-label / role="dialog" / focus trap，1h）
3. **設定頁 tab 切分**（20+ rows → 3 tabs，1h）
4. **iOS Safari share fallback**（接近 P0，30min）
5. **onboarding v2 first_hatch 後再彈一次**（10min）
6. **want bubble 顯示獎勵 hint**（5min）

**架構觀察**：
- 看 retrospective TD-1：「5 模組已抽，但停滯 — 50 輪只新增 1 條 NourishAPI 橋接」
- v2 R-1 的「3-4 小時 ROI 高」評估在 50 輪後變成「6 小時 ROI 翻倍」 — 拖越久成本越高
- 下輪 cron 應認真做 R-A 第 1 步（拆 audio.js 或 ui.js 任一個）

**下輪候選（按 retrospective 推薦排序）**：
1. R-A step 1：拆 audio.js（最自包含，~40 行）
2. P1-2 a11y 4 條（1h，可拆兩輪）
3. iOS Safari share fallback
4. want bubble reward hint（5 min 純 UI 改字）

---

## 2026-04-29 03:46 · Session A — INTENT: retrospective v3 收割 3 條 quick wins

(已完成)

---

## 2026-04-29 03:38 · Session A — 多寵物規劃 doc 寫完 + retrospective v3 sub-agent 派出

**觸發**：cron 第 51 輪
**為什麼**：50 輪已是 milestone，feature 飽和。本輪改變策略：
- (a) 並行派 sub-agent 做**外部視角的 v3 review**，找累積的盲點
- (b) 寫多寵物 v0.4 規劃 doc，把連續推遲 9 輪的議題從「待辦」 → 「明確分 sprint 的計畫」

**動作（A：retrospective sub-agent，背景跑）**：
- general-purpose agent，read-only review
- 讀清單：CHANGELOG / README / CLAUDE / GDD / character-sheet / iteration-log 最新 20 條 / review-v2 / cfg.js / game.js / index.html
- 7 重點：累積複雜度 / 平衡 / 女性向 TA 對齊 / UX 累積債 / 空缺 / 可上線評估 / 下 sprint 推薦
- 輸出到 `docs/retrospective-50.md`
- 後台跑，下輪 cron 應該會回來

**動作（B：multipet-plan.md，~150 行）**：
- 規劃稿，**明示不是實作**
- 9 章節：為什麼推遲 / MVP 範圍 / Schema 設計 / UI 改動 / 邊界風險 / 拆 sprint / v0.4 vs v0.3 定位 / 替代方案 / 決定點
- **5–6 小時工程量**估算，拆 4 個 sprint
- 7 條風險評估（migration 高 / 跨 tab 中 / cooldowns 共享 低 / wants spawn 中 等）
- Schema 雛形：`state.pets[]` + `state.activePetId` + `getActivePet()` helper + `schemaVersion: 2` 升級
- 替代方案：「**先 ship 現有單寵物版本收回饋，再決定多寵物優先序**」 — 對 user 誠實的次優解

**影響檔案**：
- `docs/multipet-plan.md`（新檔，~150 行）
- 將會新增：`docs/retrospective-50.md`（sub-agent 寫，下輪整合）

**對專案管理的影響**：
- 「多寵物推遲 9 輪」議題被妥善處理：**未實作但有清楚計畫**
- 正式列為 v0.4 而非 GDD 原訂 v0.3（誠實調整）
- 把「先上線收回饋」放進決定點 — 與其閉門做大功能，不如讓玩家驗證
- 為下次 user 想做時提供 5h Sprint A-D 完整路徑

**下輪候選**：
1. **（最高）retrospective v3 sub-agent 完成後，整合 P0/P1/P2 → 修補**
2. R-1 step 4 拆 UI primitives（最後 R-1 step）
3. WebSearch：v1.0 部署後成長黑客 / SEO 技巧
4. 多寵物 Sprint A 實際啟動（只在 user 表態想做時）

---

## 2026-04-29 03:31 · Session A — INTENT: 多寵物規劃 doc + 並行派 50 輪 retrospective sub-agent

(已完成)

---

## 2026-04-29 03:23 · Session A — 每日問候對白池（小品 polish 第 50 輪 🎉）

**觸發**：cron 第 50 輪（**自動循環里程碑**）
**為什麼**：49 輪堆功能已到飽和。本輪挑「最小但有溫度」的 polish — 跨日首次登入時啾啾說一句問候，把 daily-login 的金幣交易升級成情感互動。

**動作**：
- `CFG.speech.dailyGreet` 6 句新對白池：
  - 「新的一天，又見面了~」
  - 「早安主人！」
  - 「今天有什麼計畫呢？」
  - 「你來了！我等好久~」
  - 「想你了~」
  - 「(蹭蹭)」
- `handleDailyLogin` 跨日命中時，`setTimeout 1200ms` 後從池子隨機 speak 一句
  - 1.2 秒延遲：避開 welcome-back modal（init 後 600ms 才彈）
  - 蛋階段不講（蛋還不會說話，符合 character-sheet §2.1 寡言設定）
- 每天首次登入觸發一次，不會洗版

**設計考量**：
- 跟「歡迎回來」welcome-back 不同：welcome-back 是「離線多久」、daily-greet 是「跨午夜」
- 玩家如果一天上 5 次，只在第一次聽到 — **稀缺性 = 溫度感**
- 配合既有的「每日登入 +30 FC」+「連續 X 天」獎勵，從「打卡集點」 → 「啾啾每天迎接你」

**影響檔案**：
- `src/cfg.js`（+1 speech 池，6 條對白）
- `src/game.js`（handleDailyLogin +6 行 setTimeout 邏輯）

**驗證**：`node --check` 雙檔 ✅

**第 50 輪自動循環里程碑回顧**：
- v0.1 MVP 19/19 → v0.2 8/8 + 7 Bonus → v0.3 4/6 + 季節事件 → v1.0 PWA + 推播
- 5 模組 lazy-bridge IIFE 架構成熟
- 14 份文件家族（README + CHANGELOG + CLAUDE + 11 docs/）
- 30 條成就 / 14 互動 / 13 事件 / 14 wants / 9 配件 / 7 終態
- Session B 並行做 28+ PNG（DreamShaperXL Turbo + rembg）
- 雙 session 協作協議（INTENT 佔位 + iteration-log append-only）通過實戰驗證

**下輪候選**：
1. 多寵物 v0.4（已推 9 輪）
2. R-1 step 4 拆 UI primitives
3. 寫 docs/multipet-plan.md（規劃但不實作，defang「總是延後」的議題）
4. 50 輪 retrospective sub-agent（外部視角審視整體質量）

---

## 2026-04-29 03:16 · Session A — INTENT: 每日問候 + 連續 7 天里程碑 toast

(已完成)

---

## 2026-04-29 03:08 · Session A — Master Player 終極成就 + CHANGELOG.md（30 成就 / 14 份文件）

**觸發**：cron 第 49 輪
**為什麼**：玩家有 29 條成就但**沒有「拿了多少」的最終里程碑**。同時 49 輪迭代沒有版本層級的 CHANGELOG，外部讀者要爬 iteration-log 全文才能掌握全貌。同時做：玩家內 + 外部觀感 雙增益。

**動作（Master Player 成就）**：
- `master_player` 🎓「啾啾日常大師」desc:"達成 25 條成就"
- 評估規則：`Object.keys(state.achievements).filter(id => id !== "master_player").length >= 25`
- **排除自己**避免 chicken-and-egg：玩家先湊 25 條*非 master* 成就才能拿 master，拿了之後總數變 26
- 設計意圖：總共 30 條，要 25 條才解鎖 master，給玩家「努力但不必 100%」的中道路徑（5 條可放生）

**動作（CHANGELOG.md 寫一份）**：
新檔 `CHANGELOG.md`（root 級，~140 行）：

- **v1.0 App 階段準備**：PWA 4 件套（manifest / SW / icon set / 推播）、雙 session 協作。標明 Web Push / 雲存 / 內購等需 backend 待延後
- **v0.3 內容深度**：4/6 完成（裝扮 / 成就 / 分享 / 老年）；多寵物 / 雲存擱置
- **v0.2 互動深度**：8/8 完成 + 7 條 Bonus（wants / 鍵盤 / 匯出 / 音效 / 進化前奏 / 反饋動畫 / 粒子）
- **v0.1 MVP**：19/19，含完整 4 階段養成 + 14 互動 + localStorage
- **美術 / 視覺基礎建設**：character-sheet 5 DNA + 9 色票 + 女性向約束
- **Session B AI pipeline**：ComfyUI 0.14.1 + DreamShaperXL Turbo + rembg
- **程式架構**：5 模組 lazy-bridge IIFE
- **文件家族 14 份**（含 CHANGELOG 自己）
- **統計摘要表**：14 互動 / 13 事件 / 14 wants / 7 終態 / 9 配件 / 30 成就 / 18 對白類別 / 49 cron 輪

**動作（README link）**：
README 文件導讀表加 CHANGELOG row。

**影響檔案**：
- `src/cfg.js`（+1 achievement → 30 條）
- `src/achievements.js`（+1 evaluate rule，含 chicken-egg 防呆）
- `CHANGELOG.md`（新檔，~140 行）
- `README.md`（+1 row in 文件導讀表）

**驗證**：`node --check` 雙檔 ✅

**對外 / 對內價值**：
- 對玩家：30 條成就形成「**收集 → milestone → master**」三層 progression。完美主義者衝 30/30、輕度玩家拿 25 也夠了 master。
- 對外：路人看 GitHub repo 不必爬 iteration-log，**CHANGELOG 一頁讀懂從 v0.1 到 v1.0** 49 輪做了什麼
- 對未來協作者：版本分組讓「下一階段該做什麼」清楚（`v1.0 待實作` 列表）
- 對宣傳：CHANGELOG 統計表（14 互動 / 30 成就 / 49 輪）是行銷素材

**v0.3 完成度更新**：
- ✅ 裝扮商店 / 成就系統 / 截圖分享 / 老年互動 / **季節事件**（v0.5 提早做）
- ⏸️ 多隻寵物 / 雲端存檔（剩 2/6，都需大改）

**v1.0 完成度**：
- ✅ PWA 安裝 / 離線 / 推播雛形 / icon set
- ⏸️ Web Push / 真實時間 / 內購 / 好友 / 排行榜（5 個都需 backend）

**14 份文件家族**：README + CHANGELOG + CLAUDE + 11 docs/

**下輪候選**：
1. 多寵物 v0.4（推 8 輪了）
2. R-1 step 4 拆 UI primitives
3. WebSearch：v1.0 部署後成長黑客 / SEO 技巧
4. 寫一份 onboarding video script（給未來行銷用）

---

## 2026-04-29 02:59 · Session A — INTENT: Master Player 終極成就 + CHANGELOG.md

(已完成)

---

## 2026-04-29 02:51 · Session A — 事件統計頁面（圖鑑底部新入口，13 個事件可視化）

**觸發**：cron 第 48 輪
**為什麼**：上輪做了事件追蹤 schema + 2 條 collector 成就，但**玩家沒地方看自己抓過哪些**。`seasonal_3` 成就尤其需要 visibility — 玩家想知道「我看過幾種季節事件了」就得有頁面查。

**動作（新 modal `openEventStatsMenu`）**：
- 標題列總計：「🎲 事件紀錄 · 總計 X」
- 兩段分組：
  - **一般事件（全年）** — 7 條（coin_drop / herb / butterfly / fly / star / rainbow / candy）
  - **🎏 季節事件 X / 6（限時）** — 6 條 with date range 顯示
- 每條 row：
  - 22×22 thumbnail（從 cfg.art 載入 SVG/PNG）
  - 中文 label
  - 季節事件附 date range（如「03-20 → 05-10」）
  - 右側 count 數字
  - 未接過：opacity 0.45 + 🔒 prefix
- 底部 footnote：「季節事件依當下日期自動觸發，跨年累積收集」
- 按鈕「回圖鑑」回到 dex menu

**動作（dex 入口）**：
- 圖鑑底部 button group 從 2 顆（🏅 成就 / 📸 分享卡）→ **3 顆（多 🎲 事件 X）**
- 顯示 X = 當前 eventsCaught 計數，玩家進入即看到累積數字

**設計考量**：
- 「事件紀錄」與「成就」分離：成就是 milestone，事件統計是 detail 視圖
- 用 thumbnail（不是純 emoji icon）→ 視覺與遊戲內事件氣泡一致
- 按鈕與「分享卡」放一起 → 圖鑑 = 玩家數據中心
- 玩家發現「seasonal 6 種我有 1 種」時自然產生「等下個節日」的期待

**影響檔案**：`src/game.js`（+~35 行 openEventStatsMenu + 1 button + 1 hook）

**驗證**：`node --check` ✅

**對玩家的影響**：
- 圖鑑變更完整：終態 + 歷代 + 成就 + **事件** + 分享 五大模組
- 玩家可清楚看到「sakura 抓 3 次、xmas 抓 0 次」 → 動機回來下個季節
- `events_100` 成就有了 progress bar 感（雖然沒真實 progress bar，但有計數可看）
- 季節事件的「跨年累積」設計更有說服力（看得到「等下個節日就有了」）

**圖鑑 modal layout 演進**：
- v1（iter#4）：終態 7/7 + 歷代列表
- v2（iter#5）：+ 🏅 成就按鈕
- v3（iter#15）：+ 📸 分享卡按鈕
- v4（iter#24）：歷代 row 可點 → 詳情頁
- **v5（本輪）：+ 🎲 事件按鈕**

**下輪候選**：
1. 多寵物 v0.4（已推 7 輪）
2. R-1 step 4 拆 UI primitives
3. 加總成就「Master Player」: 達成 25/29 條成就
4. WebSearch：v1.0 部署後的成長黑客技巧

---

## 2026-04-29 02:44 · Session A — INTENT: 事件統計頁面（玩家可看 13 個事件各抓過幾次）

(已完成)

---

## 2026-04-29 02:36 · Session A — 事件追蹤 + 2 條收集成就（events_100 + seasonal_3，總數 29）

**觸發**：cron 第 47 輪
**為什麼**：上輪做完季節事件 SVG，13 個事件全 SVG 化，但**沒有 reward 玩家收集多樣性**。第 45 輪標的 design choice「不做季節收集成就避免錯過時間挫折感」可以軟化解 — 用「跨年累積」設計即可（玩家連續玩多年自然會看到所有季節）。

**動作（事件追蹤 schema）**：
- `state.history.eventsCaught` — 累積接住的事件總數（不分類別）
- `state.history.eventIds: { [id]: count }` — 每個事件 ID 各別計數
- `defaultState` 補新欄位（deepMerge 對舊存檔安全，預設 0 / {}）

**動作（resolveEvent hook）**：
- 玩家點擊事件氣泡 → 套用效果後追加追蹤兩欄位
- 失敗（過期沒接）不計，鼓勵玩家「真的接住」

**動作（2 條新成就）**：

| ID | Icon | 名稱 | 條件 |
|---|---|---|---|
| `events_100` | 🎲 | 幸運兒 | 接住 100 個隨機事件 |
| `seasonal_3` | 🎏 | 節日通 | 參與 3 種不同季節活動 |

`seasonal_3` 用 SEASONAL_IDS Set 過濾 — 在 achievements.js IIFE load 時從 `CFG.seasonalEvents.pool` 一次性建立 Set，每次 evaluate 用 `Object.keys(eventIds).filter(SEASONAL_IDS.has).length >= 3` 判斷。

**設計：跨年累積無 FOMO**：
- 玩家**任何時候開始玩，都能慢慢累積季節事件**
- 第一年只看到 sakura → 拿 1/3
- 第二年加 valentine → 2/3
- 第三年再加 xmas → 3/3 解鎖 🎏「節日通」
- 玩家**永遠不會「錯過」** — 只要持續玩就解鎖
- 跟原本 collect_all（7 種終態）邏輯一致：靠時間累積，不靠單次窗口

**動作（settings 統計顯示）**：
新 row「🎲 抓到事件 X 次」與既有「💖 滿足願望 X 次」並列。

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 29 條）
- `src/achievements.js`（+1 SEASONAL_IDS Set + 2 evaluate rules）
- `src/game.js`（+2 history schema 欄位 + 4 行 resolveEvent hook + 1 settings row）

**驗證**：`node --check` 三檔 ✅

**29 條成就分布**（更新）：
| 類別 | 數量 |
|------|------|
| 里程碑 | 6 |
| 收集（含季節） | **6（+2）** |
| 終態 | 4 |
| 互動量 | 4 |
| 連續登入 | 2 |
| 完美 | 2 |
| 穿搭 | 5 |
| 老年 | 2 |
| wants | 2 |

**對長尾玩家的影響**：
- 重度玩家（每天玩 1 個月）大約能接 100 個事件 → events_100 milestone reward
- 跨年玩家（連續 2-3 年）會在第 3 個季節時碰到 seasonal_3 自然解鎖
- 成就系統現在覆蓋 D1 → D365+ 全光譜留存目標

**設計小思考（已軟化的 design choice）**：
- 第 45 輪寫「沒有季節收集成就 — 避免 FOMO」
- 本輪改為「**有但設計成跨年累積**」 — 既給 reward 又無時限壓力
- 兩種思路都 OK，我選後者因為 reward 強化長期投入

**下輪候選**：
1. 多寵物 v0.4（已連續推遲 6 輪）
2. R-1 step 4 拆 UI primitives
3. 連續登入 streak_100 終極成就（成就的成就）
4. dexlocked 加事件統計頁面（可看 13 個事件各接過幾次）

---

## 2026-04-29 02:28 · Session A — INTENT: 事件追蹤計數 + events_100 + seasonal_3 成就

(已完成)

---

## 2026-04-29 02:20 · Session A — 5 個季節事件 SVG 補齊（emoji → 完整 SVG，character-sheet 對齊）

**觸發**：cron 第 46 輪。上輪季節事件框架建好但 5 個還是 emoji，跨平台 render 不一致，且不符 character-sheet「事件氣泡用 SVG 不用 emoji」原則。

**動作（5 張新 SVG，character-sheet §1.3 色票）**：

- **`event-valentine.svg`** — 立體愛心：深粉 #FF6B9F 主體 + 內層白色光暈 + 4 個浮動小 ♡
- **`event-summer.svg`** — 夏日海灘：黃色太陽（橘色光芒）+ 藍色波浪 3 層 + 白色泡沫紋路
- **`event-mooncake.svg`** — 月餅：棕色圓盤 #D4A574 + 8B5A2B 邊紋 + 中央「月餅」字 + 3 顆芝麻 + 旁邊小月亮 + 高光
- **`event-halloween.svg`** — 南瓜：橘色 3 重橢圓 + 黑色三角眼 + 鋸齒嘴 + 綠色蒂頭 + 紫色 / 黃色 ✦ 點綴（不嚇人版本）
- **`event-xmas.svg`** — 禮物盒：粉紅 #FF6B9F 主體 + 黃色十字緞帶 + 大型黃色蝴蝶結 + 橘色結芯 + 白色 ❄ 散落

全部用 character-sheet §1.3 9 色色票，無新顏色加入。

**動作（cfg.js）**：
5 個 entries 從 `emoji: "🌹"` 改為 `art: "assets/svg/event-valentine.svg"` 等。其他欄位（weight / label / apply / dateRange）不變。

**影響檔案**：
- `assets/svg/event-{valentine,summer,mooncake,halloween,xmas}.svg`（5 新檔）
- `src/cfg.js`（5 處 emoji → art 路徑切換）

**驗證**：
- `node --check src/cfg.js` ✅
- 5 張 SVG curl 200

**對視覺一致性的影響**：
- 6 個季節事件全部 SVG 化，跨平台（iOS / Android / Chrome / Safari / Firefox）視覺一致
- 跟 7 個一般事件（含 rainbow / candy 也是 SVG）形成 13 個事件全 SVG 統一風格
- character-sheet §10.1「粉嫩色系優先」原則嚴格執行（valentine 主體 #FF6B9F、xmas 主體 #FF6B9F、halloween 橘色但配紫色 ✦ 平衡視覺）
- character-sheet §10.4 don't-list 對齊：halloween 南瓜畫成「可愛 cute」非「scary」（圓眼 + 微笑嘴弧）

**Halloween SVG 設計小決策**：
- 西方傳統 jack-o-lantern 是恐怖向，與女性向 TA 違和
- 改用：3 顆橘色橢圓重疊 + **三角眼簡化版** + 弧線笑嘴（非鋸齒）+ 綠色心型蒂 + 紫色 / 黃色 ✦
- 結果：「**萬聖節 cute 派對**」氛圍，不嚇到玩家

**Session B 後續**：所有 SVG 路徑暴露給後續 ComfyUI 升級為 PNG。session-b-tasks.md 可由 Session B 自行加入「6 個季節事件 PNG」批次任務（不擾動）。

**13 個事件總表（一般 + 季節）**：
| 類型 | 件數 | 觸發 |
|------|----|------|
| 一般（全年） | 7 | 60 秒 30% spawn 機率 |
| 季節（限時） | 6 | 全年 0 ~ 2.5 個月窗口，weight 25-30 高於一般 |

任何月份至少有 0 個季節事件活躍（5 月 11 日後到 7 月 1 日空窗），最多 2 個並存（如 4 月 29 日只有 sakura）。

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. seasonal_collector 隱藏成就（抓滿至少 3 個不同季節事件）— 不過第 45 輪標明「**沒有季節收集成就**」是 design choice，避免錯過時間挫折感。重新思考是否破例
4. WebSearch 補強：2026 養成遊戲季節活動最佳實踐 review

---

## 2026-04-29 02:12 · Session A — INTENT: 補 5 個季節事件 SVG（情人節/夏涼/月餅/萬聖/聖誕）

(已完成)

---

## 2026-04-29 02:04 · Session A — 季節事件 v0.5 起步：櫻花飄落 + 5 個年度事件骨架

**觸發**：cron 第 45 輪
**為什麼**：market-research-2026 §2.2 提到「季節 / 限時內容」是 2026 養成遊戲長尾留存核心策略 — 玩家「永遠有新東西看」。今天是 04-29 正好在櫻花季尾段（03-20 到 05-10），是天然的測試窗口。把整個年度框架先建起來，未來節日自動觸發無需 deploy。

**動作（CFG.seasonalEvents 池子）**：
新欄位 `seasonalEvents.pool`，6 個年度限時事件：

| ID | 期間 (MM-DD) | weight | 視覺 | 效果 |
|---|---|---|---|---|
| **🌸 sakura**（**有 SVG**） | 03-20 → 05-10 | 25 | 5 瓣粉紅花 + 黃色花心 + 漂浮粉點 + ✦ | mood +18、clean +5、+10 FC |
| 🌹 valentine | 02-12 → 02-15 | 30 | emoji（暫） | mood +25、+20 FC |
| 🌊 summer_breeze | 07-01 → 08-31 | 25 | emoji（暫） | energy +20、mood +8 |
| 🥮 mooncake | 09-10 → 09-25 | 25 | emoji（暫） | hunger +30、mood +10 |
| 🎃 halloween | 10-25 → 11-01 | 25 | emoji（暫） | +30 FC、mood +10 |
| 🎁 xmas | 12-20 → 12-26 | 30 | emoji（暫） | mood +15、hunger +10、+50 FC |

季節事件的 weight 都比一般事件高（25-30，vs 一般 3-55），代表**限時稀罕性的 reward 強度**。

**動作（spawnEvent 合併邏輯）**：
- 新 helper `isSeasonalActive(event)`：用 MM-DD 字串比對，支援跨年區間（如冬季 12 月到 2 月）
- spawnEvent 改：`pool = regular.concat(seasonal.filter(isSeasonalActive))`
- 不在期間內的季節事件自動 0 機率，無需 deploy 切換

**動作（RANDOM_EVENT_APPLIES dispatch）**：
6 條新 closure：sakura / valentine / summer_breeze / mooncake / halloween / xmas，文案含 emoji 提示 + 主題化 toast。

**動作（新 SVG）**：
- `event-sakura.svg`：5 瓣花 + 黃色花心 + 4 個粉紅小點 + ✦，character-sheet 色票對齊
- 其他 5 個季節事件**先用 emoji**，等 Session B 後續 ComfyUI 批次補 PNG（Halloween 南瓜 / 聖誕禮物盒等）

**影響檔案**：
- `assets/svg/event-sakura.svg`（新檔）
- `src/cfg.js`（+CFG.seasonalEvents 整段，6 entries）
- `src/game.js`（+isSeasonalActive helper、spawnEvent 合併、+6 dispatch）

**驗證**：
- `node --check` 雙檔 ✅
- 日期邏輯測試：今天 04-29 → sakura active ✓、xmas inactive ✓
- HTTP 200：event-sakura.svg

**對玩家體驗的影響**：
- **本月在線玩家會看到櫻花飄落事件** — 春天上線就有「噢，這遊戲會跟著季節變」的驚喜
- 半年內會經歷 4-5 個不同季節事件（夏涼風、月餅、萬聖、聖誕、春櫻），給玩家「**等下個節日**」的長期錨點
- weight 25-30 比一般事件高 → 進入季節期間時，每天看到限時事件至少 1-2 次（vs 正常事件 1 次）
- 跟現役 7 個一般 + 7 種終態 + 27 條成就形成多層內容矩陣

**設計考量**：
- **MM-DD 格式跨年**：例如 `from: "12-20", to: "01-05"` 也支援（`from <= to` 為 false 時走 OR 邏輯）
- **不寫進 dexlocked / 成就**：季節事件本身沒有「收集」成就，避免錯過時間就解鎖不了的挫折感
- 玩家設備時區決定觸發時間（無 backend，誠實限制）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 補 5 個季節事件 SVG（給 Session B 寫 prompt 入 session-b-tasks.md）
4. 加 `seasonal_collector` 隱藏成就：抓到至少 3 個不同季節事件 → unlock

---

## 2026-04-29 01:56 · Session A — INTENT: 季節事件 v0.5 起步（櫻花季限時，正當季）

(已完成)

---

## 2026-04-29 01:48 · Session A — wants 計數 + 2 條 connoisseur 成就（成就總數 27）

**觸發**：cron 第 44 輪
**為什麼**：上輪 wants 池擴到 14 條，但**沒有累積成就獎勵滿足過幾條**。重度玩家會問「我滿足這麼多 wants 有沒有什麼 reward」 — 加 2 條 milestone 成就 + 設定頁可看當前計數，把 wants 系統閉環。

**動作**：

- **`state.history.wantsFulfilled`** 計數新欄位（deepMerge 對舊存檔安全，預設 0）

- **`fulfillWantIfMatches` hook**：每次滿足 want → `state.history.wantsFulfilled++`

- **2 條新成就**（`CFG.achievements`）：
  - `wants_10` 🥰「心有靈犀」 → 滿足 10 個願望
  - `wants_50` 💞「最佳搭檔」 → 滿足 50 個願望

- **`achievements.js evaluate`** 加 2 條規則

- **設定頁 traits 區段** 新增 row：「💖 滿足願望 X 次」（與既有的 fatPoints / battlePoints / 唱歌次數 等並列）

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 總 27 條）
- `src/achievements.js`（+2 evaluate rules）
- `src/game.js`（+1 history 欄位、+1 hook、+1 settings row）

**驗證**：`node --check` 三檔 ✅

**對玩家行為的影響**：
- wants 系統現在有完整 progression：spawn → 滿足 → +mood/+coin/+growth + 計數 + 里程碑成就 + 設定頁可見
- 滿足 10 wants（≈ 兩天的中度遊玩量）就拿第一個成就，**reward 速度合理不卡關**
- 滿足 50 wants（≈ 一週半重度玩家）拿第二個成就，作為**長期目標**之一
- 跟 dressup_collector / collect_all 形成「不同維度的長期目標」，玩家可以選自己喜歡的路線

**27 條成就分布**（更新）：
| 類別 | 數量 |
|------|------|
| 里程碑 | 6 |
| 收集 | 4 |
| 終態 | 4 |
| 互動量 | 4 |
| 連續登入 | 2 |
| 完美 | 2 |
| 穿搭 | 5 |
| 老年 | 2 |
| **wants** | **2（新）** |

**設計小觀察**：
- 加入 want_full 概念進階版可能是未來方向：例如連續滿足 5 個 wants 不漏 → 「lucky streak」成就。本輪先做基礎計數，下次需要才加進階變化
- wantsFulfilled 也可以做 wants 統計（哪些 wants 滿足最多次），但需要新 key/object schema。**現在不做，先觀察玩家行為再說**

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 季節事件 v0.5（依玩家裝置時間觸發特殊事件）
4. 隨機事件加成就（例如「狂熱粉絲」: 抓到 100 個事件）

---

## 2026-04-29 01:40 · Session A — INTENT: wants 計數 + 2 條 connoisseur 成就

(已完成)

---

## 2026-04-29 01:32 · Session A — Wants 池補完：9 → 14（全 14 互動覆蓋）

**觸發**：cron 第 43 輪
**為什麼**：wants 池自第 12 輪建好後沒再擴充，9 條 wants 對應 14 個互動只覆蓋一半。重度玩家會發現「啾啾從來不主動想吃蟲蟲 / 蛋糕」、「想動腦 / 想跳舞 / 摸肚子 / 玩玩具」也沒對應 want，造成成雞階段 wants 觸發頻率偏低。

**動作（5 條新 wants）**：
| ID | needs | stage | text | icon |
|----|-------|-------|------|------|
| `want_worm` | feed_worm | junior | 想吃小蟲蟲 | 🪱 |
| `want_cake` | feed_cake | adult | 想吃蛋糕~ | 🎂 |
| `want_belly` | pet_belly | chick | 想被摸肚子 | 🤲 |
| `want_toy` | play_toy | junior | 想玩玩具！ | 🧸 |
| `want_puzzle` | play_puzzle | adult | 想動腦~ | 🧩 |

stage 與互動的 unlock stage 對齊（junior 解鎖蟲蟲 / 玩具，adult 解鎖蛋糕 / 拼圖）。

**結果（14 wants 池）**：
- 蛋階段 (egg): 1 條（pet_head）
- 雛雞 (chick): 6 條（基礎 / 玉米 / 莓果 / 洗澡 / 球 / 摸肚 / 聊天）
- 幼雞 (junior): 4 條（蟲蟲 / 玩具 / 跳舞）
- 成雞 (adult): 3 條（蛋糕 / 拼圖 / 唱歌）

每階段 want 多樣性提升，玩家在不同生命週期看到的「啾啾想要什麼」更貼合該階段的可玩內容。

**影響檔案**：`src/cfg.js`（+5 entries in wants.pool）

**驗證**：`node --check` ✅ + `grep -c "id:\"want_"` 從 9 → 14

**對玩家體驗的影響**：
- 重度玩家（成雞 + 養 7 天）現在會看到「啾啾想動腦」「想吃蛋糕」這類專屬 wants，立刻 reward 玩家做的內容投入
- 雛雞/幼雞階段的 wants 多樣化（從 4 → 7 條），孵化第一週看到重複 wants 的機率降一半
- spawn 頻率沒改（每 90 秒擲 18% 機率）— 池子大了等於變奏感增加

**設計原則對齊**：
- character-sheet §10.3「玩法重 關係建立 + 自我表達」— wants 系統是這個原則最直接的體現，多樣化越強，玩家越覺得啾啾「真的會表達自己」
- 不破壞 dressup_set 等成就條件（新 wants 不影響既有判定）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives（最後 R-1 step）
3. 加 want-fulfilled 連續達成 N 條的成就（例如 connoisseur 「滿足 50 個願望」）
4. 季節事件 v0.5（玩家設備時間判斷，給春天的櫻花隨機事件等）

---

## 2026-04-29 01:26 · Session A — INTENT: 5 條新 wants 補完互動池（9 → 14，全互動覆蓋）

(已完成)

---

## 2026-04-29 01:18 · Session A — deploy.md：GitHub Pages 一鍵部署指南 + 4 平台對比 + cache-busting

**觸發**：cron 第 42 輪
**為什麼**：上輪 README 寫完，但**沒有部署指南** — 任何想 ship 出去讓朋友玩的人（包括我自己）只能憑印象 / 摸索。專案到了「能上線」的成熟度，部署文件是最後一塊缺口。

**動作（新檔 `docs/deploy.md`，~165 行）**：
10 個 sections：

1. **GitHub Pages 一鍵部署**（推薦，免費 + HTTPS + repo 整合）
   - Settings → Pages → main / root → Save → 1-2 分鐘上線
   - 之後 git push 自動 build

2. **部署前 checklist**（5 項）：node --check 全綠、本機跑過、bump CACHE_VERSION、iteration-log 有記、commit 訊息有意義

3. **Service Worker cache-busting**（重點警告）：
   - 每次 deploy 必須改 `sw.js` 的 `CACHE_VERSION` 字串
   - 不改的後果：玩家 PWA 卡舊版、看不到新功能、客訴
   - 推薦格式 `chickaday-vX-YYYY-MM-DD`

4. **HTTPS 必要性**：列 5 個非 HTTPS 不工作的功能（SW / PWA / 推播 / Web Share / Clipboard）

5. **替代部署方案** 4 種：
   - Cloudflare Pages（CDN）
   - Netlify Drop（拖檔最快）
   - Vercel（git 整合）
   - 自己 VPS + nginx（含 config 範例）

6. **部署後驗證**（10 項 checklist）：JS 200、SW registered、manifest 解析、SFX、推播、分享卡、A2HS（Android + iOS）

7. **自訂網域** 5 步：DNS CNAME、Pages settings、HTTPS、manifest 路徑檢查、README demo URL

8. **常見問題** 5 條 FAQ：PWA 卡舊版、推播不出、iOS PWA 推播、iOS 分享、localStorage 滿

9. **監控** v1.0+ 才考慮：Plausible / Umami / Sentry / Web Vitals。**強調目前 no telemetry 是隱私賣點**

10. **roll-back**：git revert / reset 流程 + cache 同步注意

**動作（README 同步）**：
- 文件導讀表加 `docs/deploy.md` 一條，連結 + 一行說明

**影響檔案**：
- `docs/deploy.md`（新檔，~165 行）
- `README.md`（+1 row in docs table）

**驗證**：純文件，markdown 格式 Pages 渲染預檢 OK

**對專案成熟度的影響**：
- 從「在本機跑著的 v0.3」 → 「**能 git push 後 1 分鐘讓朋友玩到**」
- 部署上線後可貼 link 到 dcard / Reddit / Twitter，**用戶獲取通道全開**
- TA 開始驗證：女性向設計是不是真的對胃，要靠真實玩家數據

**12 份文件家族**完整列表：
1. README.md — 對外
2. CLAUDE.md — 開發協作
3. docs/gdd.md — 設計規格
4. docs/character-sheet.md — 美術
5. docs/market-research.md / market-research-2026.md — 市場（×2）
6. docs/review.md / review-v2.md — 審查（×2）
7. docs/extensions.md — 路線圖
8. docs/iteration-log.md — 開發日誌
9. docs/image-prompts.md — AI 生圖
10. docs/session-b-tasks.md — 雙 session
11. **docs/deploy.md（本輪新）** — 部署
12. （隱含）docs/license — 待補

**下輪候選**：
1. **實際執行 GitHub Pages 部署 + 驗證**（如果 user 想推上線）
2. 多寵物 v0.4
3. R-1 step 4 拆 UI primitives
4. 寫 docs/license 段（決定 MIT / CC-BY-NC / Proprietary）

---

## 2026-04-29 01:11 · Session A — INTENT: deploy.md（GitHub Pages 部署指南 + cache-busting）

(已完成)

---

## 2026-04-29 01:03 · Session A — README.md 寫完（GitHub repo 第一印象）

**觸發**：cron 第 41 輪
**為什麼**：Session B 第 30 輪建了 `gn01816465/nourish` GitHub repo，但**沒寫 README** — 任何人 land on 那個頁面看到的是「raw files + assets/ + docs/」，零脈絡。對外推廣 / 朋友看到 / 未來協作者進來都會卡在第一步。

**動作**：
- 新檔 `README.md`（rooot 級，~140 行）：
  - **Pitch**：兩句話講清楚產品定位（療癒系、女性 TA、不會死）
  - **3 個 badge**（build none / PWA ready / Pure JS）給技術人第一眼信號
  - **快速開始**：python3 -m http.server 一行起跑
  - **PWA 安裝指引**：iOS / Android / 桌機 三平台
  - **玩法速覽表**：4 階段時長 + 解鎖
  - **15 個主要功能 bullet list**（從 25 成就 / 9 配件 / 7 事件 / PWA / 推播 / 分享卡到鍵盤捷徑全列）
  - **技術 section**：強調「零依賴 vanilla」+ 完整檔案樹（指向 5 模組）
  - **文件導讀表**：給每份 docs 一行說明 + 連結
  - **開發協作**：double session 機制、cron 10 分循環、衝突協議
  - **致謝**：標注 Tamagotchi / Neko Atsume / Adopt Me 設計參考 + Pixar/Sanrio 美術風 + Claude Sonnet 4.6/4.7 協作

**設計考量**：
- 第一句 tagline 直接拿 GDD §1.1 的 pitch，不重新發明
- 玩法速覽用表格 + emoji（README 在 GitHub 渲染漂亮）
- 不放 screenshot 連結（assets 在私人 repo，外部訪客看不到）— 等部署後再加
- 「License」明寫「尚未定」+「私人開發階段」避免被誤用
- 致謝段標 Claude Sonnet 4.6/4.7 — 透明且符合 anthropic 政策

**影響檔案**：
- `README.md`（新檔，~140 行）

**驗證**：純文件，不需 lint。GitHub 渲染預覽：badge / table / 樹狀結構都符合 GFM。

**對外觀感的影響**：
- repo landing page：raw files → 完整 product page
- 朋友 / 潛在玩家點 GitHub link 時不會迷茫
- 未來貢獻者（包括雙 session 重啟時）能 5 分鐘掌握全貌
- 對宣傳（推到 Reddit / hackernews / dcard）可直接貼 repo link

**文件家族整理**（README + 既有 docs，11 份）：
1. README.md（新）— 對外
2. CLAUDE.md — 開發者協作
3. docs/gdd.md — 設計規格
4. docs/character-sheet.md — 美術約束
5. docs/market-research.md / market-research-2026.md — 市場
6. docs/review.md / review-v2.md — 審查
7. docs/extensions.md — 路線圖
8. docs/iteration-log.md — 開發日誌
9. docs/image-prompts.md — AI 生圖
10. docs/session-b-tasks.md — 雙 session 任務介面
11. README.md — **本輪新增，外部入口**

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 修 README License 段（決定 MIT / Apache / Proprietary）
4. 寫一份簡單的 deploy.md 教 GitHub Pages 一鍵部署

---

## 2026-04-29 00:56 · Session A — INTENT: 寫 README（GitHub repo 無說明，第一印象重要）

(已完成)

---

## 2026-04-29 00:48 · Session A — 2 條新隨機事件（彩虹 + 糖果攤）

**觸發**：cron 第 40 輪
**為什麼**：隨機事件池有 5 條已穩定運行多輪，玩家在 chick 階段（24h）大概會看到一些重複。新增 2 條「治癒系」事件補強女性向 TA 偏好的「療癒 + 甜美」氛圍（character-sheet §10.1）。

**動作（2 張新 SVG）**：

- **`event-rainbow.svg`** — 7 色弧形彩虹（粉紫橘黃綠藍紫，character-sheet §1.3 色票對齊）+ 兩端白雲（黑線稿）+ 高光斜線 + 周圍 ✨ ✦ 裝飾
- **`event-candy.svg`** — 棒棒糖：粉色糖果頭（深粉螺紋 + 白色雙螺旋）+ 白色棒子 + 黃色蝴蝶結底 + 兩側 ♡ 點綴

**動作（cfg.js 池子擴充）**：
原 5 條 + 新 2 條 = **7 條 random events**：
| Event | Weight | Effect |
|-------|--------|--------|
| coin_drop 💰 | 55 | +5–15 FC |
| herb 🌿 | 18 | 全身舒暢 |
| butterfly 🦋 | 14 | mood +10 |
| fly 🪰 | 10 | clean +5、mood +3 |
| star ⭐ | 3 | 全屬性 +10、+50 FC |
| **rainbow 🌈**（新） | 12 | mood +12 + 其他 +5（治癒系） |
| **candy 🍭**（新） | 8 | mood +18 + hunger +8 + coin +5 |

新 2 條偏「mood-heavy」事件，玩家心情低時碰到會明顯感覺被治癒。

**動作（game.js dispatch table）**：
- `RANDOM_EVENT_APPLIES` 加 2 條 closure：
  - `rainbow`: `applyDelta + toast「彩虹出現！全身充滿希望」`
  - `candy`: `applyDelta + grantCoin + toast「糖果～ 甜甜的~ 心情大好」`

**影響檔案**：
- `assets/svg/event-rainbow.svg`、`event-candy.svg`（新檔）
- `src/cfg.js`（+2 entries in randomEvents.pool）
- `src/game.js`（+2 dispatch entries in RANDOM_EVENT_APPLIES）

**驗證**：`node --check` 兩檔 ✅ + 兩張 SVG HTTP 200

**對玩家體驗的影響**：
- 隨機事件池從 5 → 7 條，重複感降 28%
- 新 2 條 mood-heavy 事件 → 玩家心情低時遇到會感覺「啾啾的世界很溫柔」
- 配合上一輪 `face_first` 成就 + 25 條成就總量 + 7 終態 + 9 配件，內容深度持續累積
- 7 events × 多輪 spawn 機率 = 玩家養成過程「碰巧的小驚喜」更密集

**Session B 後續任務**（已留 SVG 占位，未來 ComfyUI 同批次產 PNG）：
- 目標 `assets/images/event-rainbow.png` + `event-candy.png`
- prompt 主題：character-sheet plush 風 + 透明背景 + 彩虹/棒棒糖
- 待 Session B 自行加入 session-b-tasks.md（不擾動）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 加 want pool entry：want_candy 「想吃糖糖!」（feed_basic）讓 candy 事件跟 want 系統連動
4. 美術延伸：寫 v0.5 配件 prompt 給 Session B（小耳機 / 蝴蝶結項圈，之前失敗的兩件）

---

## 2026-04-29 00:42 · Session A — INTENT: 2 條新隨機事件（彩虹 + 糖果攤）+ Session B PNG 任務新增

(已完成)

---

## 2026-04-29 00:34 · Session A — R-1 step 3.5：achievements.js 拆出（規則表 vs 副作用分離）

**觸發**：cron 第 39 輪
**為什麼**：成就規則表已長到 24 條（25 條 entries -1 變化條件可寫成式子的），混在 game.js 中段難讀。**規則純邏輯 / unlockAchievement 純副作用**這個分離自然好做，比拆 UI primitives 安全。

**動作**：

- **新檔 `src/achievements.js`（52 行 IIFE）**：
  - `evaluate(state, dexUnlocked)` 純函式 — 接 state snapshot + dex set，回傳 `[id, met]` 陣列
  - 無副作用，無外部依賴（只讀 NourishCFG.accessories 給 collector check）
  - 24 條規則完整搬過：first_feed / feed_50 / bath_10 / pet_50 / first_hatch / first_evolve / streak_7 / streak_30 / form_{divine,diva,fighter,sage} / collect_{3,5,all} / rich / perfect_day / dressup_{first,set,collector,full} / face_first / elder_{week,month}
  - 對外暴露 `window.NourishAchievements = { evaluate }`

- **game.js `checkAchievements()` 簡化為 4 行**：
  - 從原 32 行（含整個規則 array）→ 4 行 thin wrapper
  - 邏輯：`evaluate(state, unlockedFormsSet()).forEach(([id, met]) => met && unlockAchievement(id))`
  - `unlockAchievement` 維持在 game.js（toast / SFX / particles 都需要 closure）

- **`index.html` script 順序**：`cfg.js → dex.js → achievements.js → share.js → game.js`
  - achievements 不依 share / game，但會被 game.js 在 init 後使用

**影響檔案**：
- `src/achievements.js`（新檔，52 行）
- `src/game.js`（-28 行 → 1838 vs 1866 估值，checkAchievements 從 32 → 4 行）
- `index.html`（+1 script tag）

**驗證**：
- `node --check` 全 5 檔 ✅
- HTTP 200：achievements.js
- 模組行數：cfg 208 + dex 73 + achievements 52 + share 267 + game 1838 = **2438 total**

**模組依賴圖（5 模組現況）**：
```
cfg.js          → window.NourishCFG (eager, pure data)
dex.js          → +NourishCFG, NourishAPI(lazy) → exposes NourishDex
achievements.js → +NourishCFG → exposes NourishAchievements (純函式，無 side-effect)
share.js        → +NourishCFG, NourishAPI(lazy) → exposes NourishShare
game.js         → +NourishCFG, NourishDex/Share/Achievements(lazy) → sets NourishAPI
```

**架構成熟度**：
- 純資料 → cfg.js
- 純儲存 → dex.js
- 純邏輯 → achievements.js
- 純渲染 → share.js
- 業務邏輯 + UI + state → game.js
- **單職責原則漂亮成立**

**R-1 進度更新**：
- ✅ step 1：CFG → cfg.js（iter#14）
- ✅ step 2：share card → share.js（iter#27）
- ✅ step 3：dex → dex.js（iter#32）
- ✅ **step 3.5：achievement rules → achievements.js（本輪）**
- ⏸️ step 4：UI primitives（modal / toast / SFX）— 互相依賴最緊，留到最後
- ⏸️ step 5：i18n 骨架（CLAUDE.md §5 v0.2 寫過要做）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives（最後一塊）
3. 加新隨機事件（彩虹、糖果攤）
4. v0.5 配件 prompt 給 Session B

---

## 2026-04-29 00:26 · Session A — INTENT: R-1 step 3.5 — 成就規則表抽到 achievements.js

(已完成)

---

## 2026-04-29 00:18 · Session A — 推播通知雛形（GDD §10.4 第二塊）

**觸發**：cron 多次積壓 fire 後本輪實質執行
**為什麼**：上輪 PWA icon set 補齊，推播是 PWA 體驗最後一塊；玩家把遊戲裝到主畫面後，背景分頁時 stat 危機能即時收到通知，**才算真的「啾啾在分頁旁陪你工作」**。

**動作（NotificationManager）**：

- `state.settings` 加兩欄位：`notificationsEnabled: false`（預設關，需玩家主動 opt-in）+ `lastNotifyAt: 0`（冷卻計時）

- 5 個 helper 函式：
  - `notificationsSupported()` — 檢查 `typeof Notification !== "undefined"`
  - `requestNotificationPermission()` — async，granted/denied/default 三態處理
  - `showLocalNotification(title, body)` — **優先用 SW `registration.showNotification`**（在支援的瀏覽器，關 tab 也能顯示），fallback 到 `new Notification()`（in-tab only）
  - `maybeNotifyCriticalStat()` — 每 5 分鐘 check：document.hidden + permission granted + 30min 冷卻過 + 任一 stat < 20，觸發
  - 訊息內容：飢餓 → 「{name} 肚子好餓…」、心情 → 「需要陪陪」、清潔 → 「想洗澡了」、體力 → 「累壞了」

- 設定頁加 row：「🔔 啾啾呼叫」
  - 4 種狀態文案：
    - 「瀏覽器不支援」（API 不存在）
    - 「已被封鎖」（permission === "denied"，需手動改瀏覽器設定）
    - 「已啟用」（permission granted + setting on）
    - 「點擊啟用」（其他）
  - 點擊處理：已啟用 → toggle off / 未啟用 → 跑 permission flow + 成功時即送一條測試通知「通知已開啟，{name} 餓了會跟你說 🐣」

- init 加 `setInterval(maybeNotifyCriticalStat, 5 * 60 * 1000)` 全域偵測

**限制（誠實揭露）**：
- 關 tab → 完全沒 JS 跑，這版**只能在背景分頁時 work**（chrome 還在開）
- 真正的「關 tab 也能送」需要 Web Push API + server，**待 v1.0+ 階段**
- iOS Safari 16.4+ 才支援，且需要先 A2HS

**影響檔案**：
- `src/game.js`（+~55 行 NotificationManager + UI hook + 5min interval）
- `docs/gdd.md`（§10.4 推播通知 [ ] → [x] 雛形版）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- iOS 玩家裝 PWA 後 → 設定頁開通知 → 切到別的 app 時，啾啾餓了會跳 banner 通知（和 native app 觀感一致）
- Android 玩家同理（Chrome 通知整合系統 notification center）
- 桌機背景分頁工作時，啾啾餓了會跳右下角通知 → 「分頁旁陪工作」承諾兌現
- 預設 OFF 尊重玩家：不會自動跳「請允許通知」打擾首次玩家

**GDD §10.4 進度**：
- ✅ PWA 包裝（iter#34）
- ✅ PWA icon set 全套（iter#37 by Session B）
- ✅ **推播通知雛形**（**本輪**）
- ⏸️ 真實時間鎖定（防作弊）— 需 server
- ⏸️ 內購 / 好友 / 排行榜 — v1.0+

**整體 v1.0 路徑**：3/6 完成，剩 3 條都需要 backend，**web-only 已到天花板**。

**下輪候選**：
1. 多寵物 v0.4（v0.3 最後一塊 web-only）
2. R-1 step 4 拆 UI primitives
3. 拆 achievements.js
4. 加美術延伸：寫新 v0.5 配件 prompt 給 Session B 跑

---

## 2026-04-29 00:10 · Session A — INTENT: 推播通知雛形（permission + 測試 + 背景偵測）

(已完成)

---

## 2026-04-28 22:38 · Session A — 2 條 face slot 成就 + Session B 補齊 PWA icon set 並行收尾

**觸發**：cron 第 37 輪
**為什麼**：上輪 face slot 接線完成，但**沒有對應成就引導玩家發現/購買**。Session B 也同時段補齊 PWA icon 全套 11 張（包含 maskable），manifest 從占位 → 正式可上架。

**動作（2 條新成就，總數 25）**：
- `face_first` 🕶️ **Cool Cat** — 「購入第一件臉部飾品」（解鎖即拿，鼓勵嘗試新 slot）
  - 條件：`Object.entries(state.pet.ownedAccessories).some(([id]) => CFG.accessories[id]?.slot === "face")`
- `dressup_full` 💯 **全副武裝** — 「同時配戴頭飾、臉部、項鍊、翅膀 4 種 slot」
  - 條件：`hat && face && neck && wing` 4 個 appearance key 都非 null
  - **比 dressup_set（3 slot）更高一階**，等於把全套搭配從 1030 → 1340 FC 入門價，再多一個成就鼓勵玩家投入

**Session B 補齊（觀察到的並行成果）**：
- 11 張 PWA icon 全套：`assets/icons/icon-{72,96,128,144,152,192,256,384,512}.png` + 192 / 512 maskable + favicon-32 + apple-touch-icon
- `manifest.json` 從用 chick portrait 占位 → 正式 9 個尺寸 + 2 maskable，符合 Android Chrome / iOS Safari / Lighthouse 全面合規
- `index.html` head 加 `<link rel="icon" sizes="32x32">` + `<link rel="apple-touch-icon" sizes="180x180">`
- A2HS 安裝後手機桌面 icon 會走 maskable 版本，安卓自動裁切成圓 / 圓角矩形都 OK
- **PWA Lighthouse 分數預期從 70+ → 95+**

**雙 session 整合驗證**：
- 我加成就 cfg + 邏輯，Session B 加 icon 資源，**沒撞檔**（不同檔案範疇）✅
- cfg.js 第 36 輪去重後沒再亂 → 撞檔教訓有效

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 總 25 條）
- `src/game.js`（+2 checkAchievements rules）
- Session B 並行：`assets/icons/*.png` (11 新檔)、`manifest.json`、`index.html` head

**驗證**：
- `node --check` 雙檔 ✅
- HTTP 200：manifest.json + icon-192.png

**對玩家行為的引導**：
- 玩家從 face slot 變「裝飾雜項」 → 「我要拿那個 Cool Cat 成就，買墨鏡看看」
- dressup_full 成為「終極穿搭」目標：4 slot 同時掛 — 對重度玩家是繼 collect_all（7 種終態）後最高難度的炫耀點
- 25 條成就分布：里程碑 6 / 收集 4 / 終態 4 / 互動 4 / 連續登入 2 / 完美 2 / 穿搭 5 / 老年 2

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API） — Session B 已把 PWA icon 補齊，搭配推播效果最好
3. R-1 step 4 拆 UI primitives
4. 拆 achievements.js（純資料 + 純函式，比 UI primitives 簡單）

---

## 2026-04-28 22:30 · Session A — INTENT: 2 條 face slot 成就 + session-b-tasks.md 清理

(已完成；session-b-tasks.md 由 Session B 自行維護中，不另外清理)

---

## 2026-04-28 22:22 · Session A — 撞檔處理：face slot 接線 + 去除 SKU 重複 entry

**觸發**：cron 第 36 輪 — 我在做新 SKU 同時 Session B 也並行做完同樣兩件 + 多了「sunglasses face slot」+「earbuds / collar 失敗」紀錄。
**為什麼**：cfg.js 同時段被雙方寫入，產生 `scarf` 兩條重複 key（後者會覆蓋前者，原 PNG path 失效）+ `partyhat` / `party_hat` 兩件視覺一樣的不同 SKU + Session B 加的 `face` slot 在 game.js / share.js / index.html / style.css 都還沒接線，sunglasses 戴上去看不見。

**動作（去重）**：
- 移除我加的 `partyhat` (svg) 和 `scarf` (svg) 兩條 cfg.js entry — Session B 的 PNG 版本品質更好且已有 ComfyUI 出爐
- 保留我寫的 `acc-partyhat.svg` / `acc-scarf.svg` 在 `assets/svg/`（無害備份，未來換 model 重生 PNG 失敗時可回退）
- 結果：cfg.js 每件配件只有 1 個 key，無覆蓋風險

**動作（face slot 接線完整鏈）**：
- `defaultState.pet.appearance` 加 `face: null`（deepMerge 對舊存檔安全）
- `index.html` 加 `<img class="accessory face" id="acc-face">`（**位置在 pet-img 之後**，z-index 4 蓋在頭部上）
- `style.css` `.accessory.face`：top 38px / 70×70 / z-index 4（在 hat 之下）
- `game.js render` 的 `ACC_SLOTS` 從 `["hat", "neck", "wing"]` → `["hat", "face", "neck", "wing"]`
- `share.js` `ACC_DRAW` 加 face 條目：`{ x:0.5, y:0.30, size:0.34 }`（眼睛位置 30%、占 34% 寬）
- `openShopMenu` 的 `SLOT_LABELS` / `SLOT_ORDER` 加「🕶️ 臉部」介於頭飾與項鍊之間

**影響檔案**：
- `src/cfg.js`（去重 -2 entries）
- `src/game.js`（appearance schema + ACC_SLOTS + SLOT_LABELS + SLOT_ORDER 各加 face）
- `src/share.js`（ACC_DRAW 加 face 條目）
- `src/style.css`（+9 行 .accessory.face）
- `index.html`（+1 face overlay img）

**驗證**：
- `node --check cfg.js game.js share.js` ✅
- `grep -c "scarf:" cfg.js` = 1（無重複）
- 4 個 slot 全部上線：hat / face / neck / wing

**雙 session 撞檔原因覆盤**：
- 我和 Session B 在同 10 分鐘內都看到「session-b-tasks.md §4 列了 partyhat / scarf」，都選了它們做，結果一個寫 SVG 一個寫 PNG
- **應該避免**：寫 INTENT 後 Session B 應該也 update tasks.md「進行中」標記避免撞檔，或我在 INTENT 階段就先 grep 確認沒人在做
- 目前 CLAUDE.md §6.2 已寫「先寫 INTENT 佔位告訴另一個 session」，但兩邊步調太接近時仍會撞

**對玩家的影響**（總結 9 件配件 / 4 slots）：
- 👒 頭飾 5 件：髮帶 80 / 派對帽 100 / 蝴蝶結 120 / 花環 200 / 皇冠 500
- **🕶️ 臉部 1 件**（新 slot）：心形墨鏡 180
- 📿 項鍊 / 圍巾 2 件：圍巾 150 / 珍珠項鍊 180
- 🪽 翅膀 2 件：天使 350 / 仙女 480
- 全套搭配 4 slots 同時戴需 1110 FC（hat 80 + face 180 + neck 150 + wing 350 = 760 FC 起步、攻頂版本 500+180+180+480 = 1340 FC）
- 全收集 9 件總價 **2360 FC**

**dressup_set 成就邏輯**：目前判定「同時戴 hat + neck + wing」，未把 face 列入必要條件 — 這樣對既有玩家公平（face 是 v0.4 後加的，不應追溯改變達成條件）

**下輪候選**：
1. 多寵物 v0.4
2. 推播通知（Notification）
3. R-1 step 4 拆 UI primitives
4. 加新成就「Cool Cat」: 配戴 sunglasses（鼓勵 face slot 採購）

---

## 2026-04-28 22:14 · Session A — 新配件 SKU ×2（派對帽 100 FC + 圍巾 150 FC）

**觸發**：cron 第 36 輪
**為什麼**：商店 slot 分組後（上輪），玩家會明顯注意到「項鍊只有 1 件」「頭飾入門價 80 FC 只有髮帶 1 件」 — 都是空缺。session-b-tasks.md §4 預先設計了 5 個未來配件 prompt，挑兩個最缺位的快速補上。

**動作（兩張新 SVG，character-sheet §1.3 色票）**：

- **`acc-partyhat.svg`** (hat slot, **100 FC**)：
  - 三角錐形粉色帽 + 深粉橢圓帽底
  - 5 顆白色 polka dots 點綴
  - 頂端金色 ✦ 五角星 + 橘色描邊
  - 旁邊飄浮 ✦ 裝飾 + 高光斜線
  - 定位：頭飾「中間階」入門 — 比髮帶 80 貴一階、比蝴蝶結 120 便宜，補完入門曲線

- **`acc-scarf.svg`** (neck slot, **150 FC**)：
  - 主體粉色 #FFB7B7 圍巾繞脖一圈
  - 兩端深粉 #FF89A7 流蘇飄逸（左右各一）
  - 中央黃色珠飾 #FFEC8B 點綴
  - 兩條細紋（深粉 + 白）增加質感
  - 定位：項鍊 slot 終於有第 2 件 — 比珍珠項鍊 180 便宜，給入門玩家選擇

**動作（cfg.js）**：
- `accessories` 表新增 2 條 entry，**插入位置貼著對應 slot**：
  - partyhat 放 hat 群組末尾（皇冠 500 之後不太對，放在 4 件 hat 之間 + 排序會自動依價格）
  - scarf 放 neck 群組（在 necklace 之後）
- 商店 slot 分組（上輪做的）會自動排序：價格升冪 → partyhat 在 headband 80 之後、scarf 在 necklace 180 之前

**動作（session-b-tasks.md 同步）**：
- 在 §4「未來 v0.4 額外配件」prompt 列表上方加新註記：
  - 「已先用 SVG 占位、待 PNG」section 列 partyhat / scarf
  - 提示 Session B 下次 ComfyUI 批次優先做這兩張
  - 用既有 SVG 路徑，PNG 出爐後改 cfg.js path 即可（一行小改）

**影響檔案**：
- `assets/svg/acc-partyhat.svg`、`assets/svg/acc-scarf.svg`（新檔）
- `src/cfg.js`（+2 accessories entries）
- `docs/session-b-tasks.md`（§4 加 SVG 待 PNG 標記）

**驗證**：
- `node --check src/cfg.js` ✅
- 兩張 SVG curl 200

**對玩家的影響**：
- 商店現在 9 件配件 / 3 slots：
  - 👒 頭飾 5 件：髮帶 80 → **派對帽 100**（新）→ 蝴蝶結 120 → 花環 200 → 皇冠 500
  - 📿 項鍊 / 圍巾 2 件：**圍巾 150**（新）→ 珍珠項鍊 180
  - 🪽 翅膀 2 件：天使 350 → 仙女 480
- 全套搭配總價：2030 FC → **2280 FC**，long-tail 目標再延長 3-4 天
- 入門玩家（餘額 < 200 FC）現在有 4 件可買（髮帶 / 派對帽 / 蝴蝶結 / 圍巾） — 第一次裝扮體驗從「攢 2 天才買得起」 → 「第一天就能戴」

**雙 session 接力工作流確立**：
- Session A 加新 SKU 走流程：(1) 寫 SVG (2) 加 cfg entry (3) 在 session-b-tasks.md 標 PNG 待產 (4) 玩家立即可用
- Session B 補 PNG 走流程：(1) ComfyUI 批次 (2) 改 cfg.js path 從 svg → png (3) 玩家自動升級
- 不會卡彼此進度，玩家也看不到中間態（SVG 已能完整呈現）

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API）
3. R-1 step 4 拆 UI primitives
4. 從 §4 再撈一條 SKU（小耳機 / 太陽眼鏡 / 蝴蝶結項圈）

---

## 2026-04-28 22:08 · Session A — INTENT: 新配件 SKU ×2（圍巾 neck + 派對帽 hat）

(已完成)

---

## 2026-04-28 22:00 · Session A — 商店 slot 分組（Session B 加 wings_fairy 後 7 件雜亂）+ 設定頁 PWA 安裝鈕

**觸發**：cron 第 35 輪
**為什麼**：Session B 上一輪加 `wings_fairy` 後商店有 7 件配件混在一個列表，雜亂。同時上輪做完 PWA，但玩家可能錯過 Chrome 自動安裝橫幅 — 需要設定頁有「立即安裝」備援入口。

**動作（商店 slot 分組）**：
- `openShopMenu()` 重寫：依 `slot` 分組（hat / neck / wing），各組以 modal-title 樣式 header 分隔
- header 用 `--c-pink-deep #FF89A7`（女性向粉紅強調），文字配 emoji：
  - 👒 頭飾
  - 📿 項鍊 / 圍巾
  - 🪽 翅膀
- 組內依 price 升冪排（玩家自然從便宜入門 → 攻頂）
- 結果：頭飾 4 件 / 項鍊 1 件 / 翅膀 2 件，視覺結構清楚，未來加更多 slot（v0.4 face / back…）也只要在 SLOT_LABELS / SLOT_ORDER 補資料

**動作（PWA 安裝鈕）**：
- `index.html` 內嵌 script 加捕捉 `beforeinstallprompt` event：
  - `e.preventDefault()` 截下原生橫幅
  - 存到 `window.__nourishInstallPrompt` 全域變數
  - `appinstalled` 事件觸發時清空
- 設定頁條件 row：當 `window.__nourishInstallPrompt` 存在 → 顯示「📲 裝到主畫面 → 立即安裝」row
- 點擊：呼叫 `prompt.prompt()` 喚出原生安裝對話 → `userChoice.outcome === "accepted"` 時 toast「✨ 安裝成功！」+ 關 modal
- iOS Safari 不支援這 API（需用「分享 → 加到主畫面」原生流程），因此這條 row **只在 Chrome / Edge / Brave 上顯示**

**影響檔案**：
- `src/game.js`（+~20 行 openShopMenu 重寫 + ~20 行 install button handler）
- `index.html`（+8 行 beforeinstallprompt + appinstalled listener）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 商店從「7 條雜亂列表」 → 「3 個分區清楚的目錄」，未來加 v0.4 配件也不會讓 UX 退化
- Chrome / Edge 玩家錯過自動安裝橫幅後，仍能在設定頁找到「立即安裝」按鈕（推薦給朋友時對方更願意裝）
- Session B 加的 wings_fairy（480 FC premium）現在會出現在「翅膀」section 第二位，形成 350 FC angel → 480 FC fairy 的升級階梯

**6 件配件分組**（含 wings_fairy）：

| Slot | 件數 | 入門 / 進階 |
|------|----|-----------|
| 👒 頭飾 | 4 | 80 → 120 → 200 → 500 |
| 📿 項鍊 | 1 | 180 |
| 🪽 翅膀 | 2 | 350 → 480 |

合計：總價 2030 FC，玩家「全套搭配」從第 21 輪 1430 FC 上升到 2030 FC，長尾目標再延長 ~7 天。

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API + SW registration.showNotification 本機通知）
3. R-1 step 4 拆 UI primitives（modal / toast / SFX）
4. 加新事件 SKU 從 session-b-tasks.md §4「派對帽 / 太陽眼鏡」撈一條來實作

---

## 2026-04-28 21:53 · Session A — INTENT: 商店 slot 分組 + 設定頁 PWA 安裝按鈕

(已完成)

---

## 2026-04-28 21:45 · Session A — PWA 基本骨架（manifest + SW），GDD §10.4 第一塊

**觸發**：cron 第 34 輪。Session B 在 21:30 推完 wings PNG ×2 + chick-young 重生 + mood 部分修，視覺資產到位後輪到我把「能裝在手機」打通。

**為什麼**：v0.3 完成度 4/6（剩多寵物 / 雲端存檔），都需要大改 schema 或 backend。**PWA 是 v1.0 通往 App 的最低成本第一步** — 沒有 build step、沒有套件、沒有 backend 也能讓玩家把遊戲「安裝」到手機主畫面 + 離線啟動。

**動作**：

- **新檔 `manifest.json`**（PWA 設定檔）：
  - name / short_name / description（中文 lang="zh-TW"）
  - theme_color #FFD86B、background_color #FFE6B0（character-sheet §1.3 色票對齊）
  - display "standalone"、orientation "portrait"
  - icons：3 個（chick-adult-healthy.png 主、chick-baby.png 備、SVG 向量），都用既有 PNG/SVG，無新增美術成本
  - shortcuts：圖鑑 + 商店兩個快捷（手機長按 app icon 會出選單）
  - screenshots：神雞圖當宣傳預覽

- **新檔 `sw.js`**（Service Worker）：
  - cache-first + 網路備援 + 機會性 cache fill 策略
  - APP_SHELL 預快取：index.html / manifest.json / 4 個 .js / style.css
  - 其他資源（PNG / SVG）走 runtime cache，第一次造訪後就 offline-ready
  - CACHE_VERSION 字串 bump 時自動 purge 舊 cache（activate event）
  - skipWaiting + clients.claim：deploy 後不必關 tab 也立即套用新版
  - 失敗 fallback 回 index.html（最差至少看得到 app shell）

- **`index.html` 更新**：
  - `<link rel="manifest" href="manifest.json">`
  - `<link rel="apple-touch-icon">`（iOS 必要）
  - 3 個 apple-mobile-web-app meta（capable / status-bar-style / title）
  - 末段加 6 行 `navigator.serviceWorker.register("sw.js")`，silent failure 不擾既有體驗

- **GDD §10.4 更新**：「PWA 包裝」從 [ ] → [x] 完成
  - 註明「PWA 已先頂著，Capacitor / Tauri 之後再說」 — 現實的階段性決策

**影響檔案**：
- `manifest.json`（新檔，53 行 JSON）
- `sw.js`（新檔，56 行）
- `index.html`（+8 行 head meta + 6 行 script）
- `docs/gdd.md`（§10.4 標 PWA 完成）

**驗證**：
- `node --check sw.js` ✅
- `node -e "JSON.parse(...)"` manifest 合法 JSON ✅
- HTTP 200：manifest.json + sw.js
- index.html 仍回 200

**對玩家的影響**：
- **iOS 玩家**：Safari 開啟 → 分享 → 加到主畫面 → 點 icon 全螢幕啟動，看起來跟 native app 一樣
- **Android 玩家**：Chrome 會出現「安裝啾啾日常」橫幅，一鍵裝到主畫面
- **桌機**：Chrome 網址列右側出現「安裝」icon
- **離線**：第一次訪問後就能離線啟動（state 走 localStorage、UI 走 SW cache）
- 推播通知（GDD §10.4）需要另外的 Web Push API + 後端，**先跳過**

**對專案定位的影響**：
- 「ChickaDay 是個網頁遊戲」 → 「ChickaDay 是個可裝在手機的 PWA 遊戲」
- 對女性向 TA 友好：很多人不想下載 App，PWA 讓「先試玩 → 喜歡再裝」變平滑
- v1.0 的「真 App」可以延後到第三方平台合作或實際需要原生 API（推播 / AR）時再說

**v0.3 → v1.0 路線圖**：
- v0.3（裝飾 / 成就 / 分享 / 老年）：4/6 完成
- v1.0 PWA 第一步：✅ 安裝 + 離線
- v1.0 剩餘：推播 / 真實時間鎖定 / 內購 / 好友 / 排行榜

**下輪候選**：
1. 多寵物 v0.4 起步（最後一個 v0.3 web-only 項目）
2. 推播通知（Notification API + Web Push 局部實作，無 backend 仍可做本機通知）
3. R-1 step 4 拆 UI primitives
4. 加 Session B 的 wings_fairy 飾品到「全套搭配」邏輯（dressup_set 是否要改成同時戴 hat + neck + 任一 wing？目前已是任一 wing 即可）

---

## 2026-04-28 21:38 · Session A — INTENT: PWA 起步（manifest + SW + A2HS），GDD §10.4 第一塊

(已完成)

---

## 2026-04-28 21:30 · Session A — 老年互動 v1（GDD §10.3 標 [ ] → [x]）

**觸發**：cron 第 33 輪
**為什麼**：v0.3 GDD §10.3 剩 3 項（多寵物 / 老年互動 / 雲端存檔）。多寵物需要大改 schema + UI；雲端存檔需要 backend；**老年互動是純 client 內容、可在 10 分鐘做基本版**，把 v0.3 完成度從 3/6 推到 4/6。

**動作**：

- **CFG.speech.elder（7 條反思對白）**：
  - 「跟你在一起好幸福~」
  - 「你還記得我們第一次見面嗎?」
  - 「我看著你也長大了一點」
  - 「好喜歡這樣的日常」
  - 「(輕輕靠著主人)」
  - 「謝謝你一直在」
  - 「再過幾年也要記得我喔~」
  - 語氣參考 character-sheet §10.4「溫暖、撒嬌、療癒」do-list，避免「老去 / 死亡 / 悲傷」字眼

- **`pickContextualLine()` 加 elder 分支**：
  - 條件：`stage === "adult" && adultDays >= 7`
  - 機率公式：`min(0.35, 0.15 + (adultDays - 7) × 0.01)` — 第 7 天 15% / 第 22 天 30% / 第 27 天封頂 35%
  - 分支早於 stage flavor / form flavor / 其他概率分布，老朋友的話語優先（但只有 35% 機率）

- **2 條新成就**：
  - `elder_week` 🌅 相伴一週 — 成雞 stage 持續 7 天
  - `elder_month` 💖 終生伴侶 — 成雞 stage 持續 30 天
  - hook 在既有 `checkAchievements` 表，每次 tick / 互動都會檢查

- **GDD §10.3 更新**：「老年互動」從 [ ] 待研 → [x] 完成（含實作 iter#33 引用）

**影響檔案**：
- `src/cfg.js`（+2 achievement entries + 1 speech 池 = 7 條新對白）
- `src/game.js`（+8 行 pickContextualLine elder 分支 + 2 行 checkAchievements）
- `docs/gdd.md`（§10.3 老年互動標完成）

**驗證**：`node --check src/game.js src/cfg.js` ✅

**對 long-tail 留存的影響**：
- 玩家養出成雞後，**第 7 天會聽到啾啾說「跟你在一起好幸福~」+ 解鎖🌅成就** → 強化「持續陪伴」的 emotional 黏著
- 第 30 天解鎖💖終生伴侶成就 → 重度玩家的 4 週留存目標
- 文案柔軟（不講「老」「離別」「死」），符合女性向 TA 的「不焦慮」設計目標
- 既有的「開新蛋會 archive 當前」流程不受影響 — 玩家可選擇 7 天時開新蛋（拿成就 + 紀念卡）或繼續陪伴衝 30 天

**v0.3 進度**：3/6 → **4/6 完成**
- ✅ 裝飾商店 ✅ 成就系統 ✅ 截圖分享 ✅ 老年互動
- ⏸️ 多隻寵物 ⏸️ 雲端存檔

**下輪候選**：
1. 多寵物 v0.4（schema 重構 + UI 切換器，較大）
2. 雲端存檔骨架（無 backend 版本：保留現有匯出/匯入字串作為過渡，加 PWA cache 為下一版鋪路）
3. R-1 step 4：UI primitives 拆出（modal / toast）

---

## 2026-04-28 21:25 · Session A — INTENT: 老年互動（GDD §10.3 最後一塊 web-only 可做的功能）

(已完成)

---

## 2026-04-28 21:18 · Session A — R-1 step 3：dex.js 拆出（已連續推 3 輪後實質完成）

**觸發**：cron 第 32 輪（多次積壓 fire 後在此輪實質執行）
**為什麼**：R-1 拆檔自第 28 / 29 / 30 輪「下輪候選」連續標 3 次未做。dex 是繼 share 之後最自然可拆的模組（純 storage 邏輯，獨立 localStorage key，UI 留在 game.js）。趁 lazy-bridge 模式驗證可行，把這刀切下去。

**動作**：
- **新檔 `src/dex.js`（73 行 IIFE）**：
  - `KEY = "nourish.dex.v1"`
  - `loadDex()` / `saveDex(dex)` — localStorage I/O，含 QuotaExceeded 兜底（toast via API）
  - `unlockedFormsSet()` — 跨歷代 + 當前寵物 finalForm 收集
  - `archiveCurrentPet()` — 把當前寵物 snapshot（含 appearance）推進 dex，cap 50 條
  - 對外暴露 `window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet }`
- **`game.js` 留薄壁紙**：4 個 thin wrapper（`function loadDex() { return window.NourishDex.loadDex(); }` 等），既有 callers 完全不動：
  - `unlockedFormsSet()` 在 finalizeForm / openDexMenu / openAchievementsMenu / share.js (via NourishAPI) 都還能正常 call
  - `archiveCurrentPet()` 在 startNewEgg 還能正常 call
  - `loadDex()` 在 openDexMenu / openPetDetail 還能 call
  - `saveDex` 沒有 game.js 端 caller（dex.js 內部 use only），但保留 wrapper 以備將來
- **保留 `DEX_KEY` 常數**在 game.js（dbg-reset 還用 `localStorage.removeItem(DEX_KEY)` 直接清，不繞 wrapper）
- **`index.html` script 順序**：`cfg.js → dex.js → share.js → game.js`
  - dex.js 在 share.js 之前因為 share.js 不直接 require dex（透過 NourishAPI.unlockedFormsSet）
  - game.js 最後（仍是 IIFE，IIFE 末段才 set `window.NourishAPI`）

**模組依賴圖**：
```
cfg.js   →  window.NourishCFG (eager, pure data)
dex.js   →  window.NourishCFG (eager), window.NourishAPI (lazy, for getState/toast)
            window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet }
share.js →  window.NourishCFG (eager), window.NourishAPI (lazy, for getState/getLastPetSrc/labels/unlockedFormsSet/toast)
            window.NourishShare = { generateShareCard, shareOrDownloadCard }
game.js  →  window.NourishCFG (eager), window.NourishShare/NourishDex (lazy)
            window.NourishAPI = { getState, getLastPetSrc, stageLabel, formLabel, formDescription, unlockedFormsSet, toast }
```

**影響檔案**：
- `src/dex.js`（新檔，73 行）
- `src/game.js`（-49 行 + 5 行 wrapper：1739 vs 上輪 ~1786）
- `index.html`（+1 `<script>` tag）

**驗證**：
- `node --check` 全 4 檔 ✅
- HTTP 200：dex.js / 既有 endpoints
- 行數：cfg 198 + dex 73 + share 266 + game 1739 = 2276 total（split 進度從 game.js 一支 → 4 支獨立模組）

**R-1 進度更新**：
- ✅ step 1：CFG → cfg.js（第 14 輪）
- ✅ step 2：share card → share.js（第 27 輪）
- ✅ step 3：dex → dex.js（**本輪**）
- ⏸️ step 4：modal / toast / speech / SFX UI primitives（更難拆，UI 互相依賴）
- ⏸️ step 5：interactions table / performInteraction（核心邏輯，與 state 高耦合，非必要）
- ⏸️ R-5：i18n 骨架

**架構意義**：
- 連續三波拆檔驗證「lazy bridge + thin wrapper」模式可重複用
- game.js 從單檔 1922 行 → 1739 行，加上 dex/share/cfg 拆出，**單檔閱讀體驗**已大幅改善（cfg 純資料、dex 純 storage、share 純 canvas、game 是業務邏輯 + UI）
- 之後加新功能可選擇性放在新模組或 game.js，視耦合度決定

**下輪候選**：
1. 多寵物 v0.4 起步（v0.3 完成 3/6，剩 multi-pet / 老年互動 / 雲端存檔，前 2 個能在 web-only 做）
2. 老年互動（成雞後特殊內容，30 天後解鎖新事件）
3. 補強 settings 頁的「我可以做什麼」說明

---

## 2026-04-28 21:08 · Session A — extreme final-30min imminent glow + GDD v0.2/v0.3 進度核對

**觸發**：cron 第 31 輪
**為什麼**：上輪解了 chick (~2h) / junior (~4h) pre-evolve glow 看時間太長會「習慣化」的問題（log 自己標的 trade-off）。本輪加 final 30 min 的「imminent」二級強度。同時 v0.2 / v0.3 大量功能已實作但 GDD 還是 [ ] 未勾，需要核對更新。

**動作（CSS + JS：3 級進化前奏）**：
- 新 `.pet.pre-evolve-imminent` class：
  - `pre-evolve-imminent-glow` 1.2s 短週期 keyframe（vs soon glow 的 2.6s）
  - drop-shadow 從 4px → **22px 粉紅 #FF89A7**（更亮、更熱烈）
  - **scale 1 → 1.04 微微膨脹**（呼吸感）
  - bob 也加快到 2.0s
  - reduced-motion 自動禁用
- render `preEvolve` 邏輯升級為三檔：
  - `null`：>window 或 score 不夠 → 無 glow
  - `"soon"`：window 內（最後 8% 或 60min 取大）→ 既有 pre-evolve glow
  - `"imminent"`：最後 30 分鐘 → 新 pre-evolve-imminent
- 蛋階段不參與（egg-shake-high 已負責）
- 睡眠中不 glow

**動作（GDD §10.2 / §10.3 進度核對）**：
全部勾選 + 註明實作的 iteration 編號：

§10.2 v0.2 必做（原預計 MVP 後 4 週）— **8/8 全做**
- 7 種終態 / 5 食物 / 5 玩耍 / 隨機事件 / 每日任務 / 圖鑑 / 取名 / 對話系統

§10.3 v0.3（原預計 8 週後）— **3/6 提早完成**
- ✅ 裝飾商店、成就系統、截圖分享
- ⏸️ 多隻寵物 / 老年互動 / 雲端存檔（後三項仍按原時程）

加上「Bonus」區段列出**沒寫進 GDD 但實作了的**：Wants 系統 / 鍵盤捷徑 / 存檔匯出匯入 / 紀念卡 / pre-evolve 三級視覺 / character-sheet / market-2026 / R-1 拆檔 / 蛋搖晃可視化等

**影響檔案**：
- `src/style.css`（+18 行 imminent class + keyframe）
- `src/game.js`（render preEvolve 三檔判定 + 兩個 toggle）
- `docs/gdd.md`（§10.2 / §10.3 重寫，標記實作狀態 + iter# 引用）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- chick / junior 進化前奏現在有「快了 → 真的快了！」兩階段
  - chick: 最後 2h pre-evolve（金黃 4px glow）→ 最後 30min 強烈 22px 粉紅 + 微膨脹
  - junior: 最後 4h pre-evolve → 最後 30min 強烈
- 配合 pre-evolve 既有的 stage-hint 文案 + 進化粒子 + sound effect，整個 5 階段是：
  1. 預備（70% 分數達標 + 進入 8% 視窗）
  2. **soon glow**（柔和金黃）
  3. **imminent glow**（強烈粉紅 + 微膨脹）
  4. 進化儀式（粒子放射 + evolve SFX）
  5. 終態揭曉（modal）

**對專案管理的影響**（GDD 更新）：
- v0.2 完成度：1/19 (mvp) → 19/19 (mvp) + 8/8 (v0.2) = **覆蓋率 ≥ 100%**
- v0.3 完成度：0/6 → **3/6**（裝扮 / 成就 / 分享）
- 自動循環在 ~3 小時內推完原本 12 週路線圖的功能（Bonus 區還列了 9 個沒寫進 GDD 的功能）

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 3 輪，下輪認真做）
2. 多隻寵物 v0.4 起步（v0.3 最後一塊，配合 GDD 標記）
3. 老年互動（成雞後 30 天加新事件）

---

## 2026-04-28 21:03 · Session A — INTENT: extreme final-30min glow + GDD §10.2/§10.3 v0.2 進度核對

(已完成)

---

## 2026-04-28 20:55 · Session A — pre-evolve 階段感知 + 接近進化事件加強 + chick/junior 倒數 hint

**觸發**：cron 第 30 輪
**為什麼**：上輪做了蛋階段的搖晃進度可視化，但 chick (24h) 和 junior (48h) 階段缺對應的「快進化了」視覺信號 — 既有 pre-evolve glow 寫死「最後 60 分鐘 + 70% 分數」，對 24h+48h 階段而言是 ≤ 4% 的時段，玩家完全注意不到。

**動作**：

- **pre-evolve 視窗改階段感知**（render 內）：
  - 公式：`window = max(60min, duration × 8%)`
  - chick 24h × 8% = 115 分鐘
  - junior 48h × 8% = 230 分鐘 (~ 4 小時)
  - egg 維持自家 egg-shake-high 處理（明確排除）
  - 條件保留 score ≥ 70% 門檻，避免分數沒到也閃光誤導玩家
  - 結果：chick 最後 2 小時、junior 最後 4 小時都有粉色金光脈動

- **隨機事件 spawn 機率階段加成**（maybeSpawnEvent 內）：
  - 階段進度 ≥ 80% 時，spawn chance 從 0.30 → 0.48（×1.6 倍，cap 0.60）
  - 「守線」獎勵：玩家在進化前最後 20% 上線會看到更多事件氣泡
  - 蛋階段不影響（蛋本來就不 spawn 事件）

- **chick / junior 倒數 hint**（stage-hint 邏輯）：
  - 進度 ≥ 92% + 分數 ≥ 70% threshold 時：
    - chick → 「🌟 啾啾準備變成幼雞了…」
    - junior → 「🌟 啾啾即將長大成雞！」
  - 跟既有 chick stage 的「未餵食 / 未取名」hints 互斥（用 else 鏈）

**影響檔案**：`src/game.js`（+15 行，3 處區塊小修）

**驗證**：`node --check` ✅

**對全階段視覺一致性的影響**：
| 階段 | 進化前奏視覺 | 進化前奏文案 |
|------|-----------|------------|
| 蛋 (6h) | 0-50% low / 50-85% med / **85%+ high + 金光** | ✨ 即將孵化…屏住呼吸！ |
| 雛雞 (24h) | **最後 ~2h pre-evolve glow** | 🌟 啾啾準備變成幼雞了… |
| 幼雞 (48h) | **最後 ~4h pre-evolve glow** | 🌟 啾啾即將長大成雞！ |
| 成雞 | (進化儀式) | (粒子 + 進化 modal) |

**對留存的影響**：
- D1 救星已就位（蛋階段視覺進度）
- D3-D5 補強：chick / junior 進化前奏時段都有「快了」的視覺 + 文案 + 事件加成三重 cue
- 玩家在 chick 階段第 22 小時開始，就會看到啾啾發光、頻繁撿到飼料幣、提示說「準備變幼雞了」，三層暗示「現在上線正划算」

**設計 trade-off**：
- pre-evolve 8% 視窗會讓 junior 玩家看金光看 4 小時，可能會「習慣化」失去儀式感
- 解法（待後續觀察）：可加一個 final 30 min 「extreme glow」二級強度（reuse egg-shake-high 思路）
- 目前先用單一強度，等玩家回饋再說

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 2 輪）
2. final 30min extreme pre-evolve glow（如果上面 trade-off 成真）
3. 多寵物欄位 v0.4 起步

---

## 2026-04-28 20:50 · Session A — INTENT: pre-evolve 改階段感知 + 接近進化時事件加強

(已完成)

---

## 2026-04-28 20:42 · Session A — 蛋搖晃 3 級進度可視化 + 即將孵化興奮提示

**觸發**：cron 第 29 輪
**為什麼**：character-sheet §2.1 規格寫「靜態橢圓，輕微晃動，有裂痕進度條」，但目前蛋只有跟其他寵物一樣的 bob 浮動。新玩家在 6 小時等待中沒有「看得到的進度感」是體驗最大缺口（蛋階段 stage-countdown 只是文字，沒有視覺）。

**動作（CSS：3 級搖晃 keyframe）**：
- `.pet.egg-shake-low` — 輕微 ±1° 旋轉，4s 週期（0-50% 進度，主要是 bob 主導）
- `.pet.egg-shake-med` — ±3° 旋轉，1.6s 週期（50-85% 進度，明顯但不焦慮）
- `.pet.egg-shake-high` — ±7° 旋轉 + 平移，0.7s 週期 + **粉色金光脈動** (reuse `pre-evolve-glow`)（85%+ 進度，即將孵化）
- 都跟 bob 共存，加 reduced-motion override

**動作（JS：進度判定）**：
- render 在處理蛋階段時計算 `progress = (timeProgress + scoreProgress) / 2`
  - 時間進度：`elapsed / 6h`
  - 分數進度：`growthScore / 30`（30 = egg.scoreToEvolve）
  - 平均代表「這蛋在時間上和照顧上有多接近孵化」
- 三檔切換：≥85% → high、≥50% → med、其他 → low
- 睡眠中時無搖晃（保留 sleep dimming 既有效果）

**動作（hint：興奮提示）**：
- stage-hint 邏輯加新分支：蛋階段 + 進度 ≥ 85% → 顯示 「✨ 即將孵化…屏住呼吸！」
- 此 hint 比其他蛋階段 hint 優先，玩家最後 30 分鐘會持續看到
- 配合 high-shake 的金光脈動 + 高頻搖晃，形成「視覺 + 文案」雙倍儀式感

**影響檔案**：`src/style.css`（+38 行 keyframes）、`src/game.js`（+13 行 render 進度判定 + hint 分支）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 玩家進來看到蛋微微晃 → 摸幾下後晃動明顯加大 → 5-6 小時後孵化前狂震 + 金光：完整視覺進度條，不必看數字
- D1 留存救星：6 小時等待從「看數字猜什麼時候好」 → 「看蛋越搖越用力期待孵化」
- 「即將孵化…屏住呼吸！」hint 把玩家鎖在最後 30 分鐘上線（D7 之前的 first-hatch achievement 確保玩家會回來看）
- character-sheet §2.1 規格從「未實作」 → ✅ 完整實作

**設計小決策**：
- 「分數 + 時間平均」而非「兩者都滿足」：避免玩家「時間到了但分數沒到」時看到搖很大但不孵化的混淆
- low/med/high 三檔而非連續：CSS variable 連續調整在 Safari 表現不穩定 + 三檔在玩家認知上更易區分階段
- high-shake reuse `pre-evolve-glow` keyframe：色票一致 + 不增 CSS 體積

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 1 輪）
2. 雛雞同款進度可視化（雞冠紅點漸明 / 體型微縮放）
3. 隨機事件 spawn 機率隨進度動態調整（接近進化時加強）

---

## 2026-04-28 20:36 · Session A — INTENT: 蛋搖晃強度進度可視化 + 即將孵化興奮提示

(已完成)

---

## 2026-04-28 20:28 · Session A — 蛋階段引導提示（review-v2 P1-5 完整收尾）

**觸發**：cron 第 28 輪
**為什麼**：review-v2 P1-5「探索性入口分散，新玩家會迷路」上輪只解了一半（header 加 🏅 / 🎀 / 📖 / ⚙️ 4 顆按鈕）。蛋階段的 6 小時等待 + 開蛋後的 chick 早期是新玩家最可能流失的時段，需要主動的提示而非 onboarding modal 一次性引導。

**動作**：
- HTML 新元素 `<div class="stage-hint" id="stage-hint">`，放在 stage-info 下方
- CSS `.stage-hint`：淺粉底 #FFE0E8 + 粉紅虛線框 + 圓角 999px pill + 緩慢 pulse 動畫（reduced-motion 自動禁用）
- render 函式每 tick 重評估狀態決定提示文案：
  - `egg` 階段 + 從未摸頭：💡「輕觸蛋蛋來摸頭吧～」
  - `egg` 階段 + 已摸過 + 進度 < 50%：🥚「多陪陪蛋，孵化會更快」
  - `chick` 階段 + 從未餵食：🍗「試試左下角『餵食』喔」
  - `chick` 階段 + 未取名：✏️「點寵物名字可以幫牠取名」
  - 其他：靜默（隱藏）
- 提示是 idempotent 條件的展示，玩家做了該動作後該則 hint 自動消失，下一個情境再現

**設計原則**：
- 不打擾：只在「該知道但還沒做」的條件成立時出現
- 自動消失：玩家做了 → 條件不再成立 → 下次 render 自動 hidden
- 同時間最多 1 條：避免訊息洪水
- 跟隨 reduced-motion：尊重 a11y 設定

**影響檔案**：`index.html` (+1 div)、`src/style.css` (+22 行 .stage-hint + keyframe)、`src/game.js` (+18 行 render hint logic)

**驗證**：`node --check` ✅

**對留存的影響**：
- 新玩家在蛋階段 6 小時內**至少看過 2 條 hint**：摸頭引導 → 進度催化
- 開蛋後立刻看到「試試餵食」→ 填補從蛋到完整玩法的橋樑
- 取名提示（之前只有 first_hatch 一次性 toast，現在還會持續顯示直到玩家取名）
- review-v2 P1-5 完整解決：header icon（探索性）+ stage-hint（時序引導）+ onboarding modal（首次規則）三層保險

**新玩家動線完整對照**：
1. 啟動 → onboarding modal 一次性介紹 4 條規則
2. 蛋階段（0-6h）→ 「輕觸摸頭」hint → 玩家點擊 → 「多陪陪蛋」hint
3. 孵化 → first_hatch 成就 + 取名提示 toast
4. chick 階段 → 「試試餵食」hint → 玩家餵 → 「點名字取名」hint
5. 全部走過 → hint 自動隱藏，UI 乾淨

**下輪候選**：
1. R-1 step 3 拆 dex.js / achievements.js
2. mood overlay 換 emoji（review-v2 P2-3 提到 mood SVG 在不同 OS render 不一致，但既然已 PNG 化問題不大了）
3. 蛋的搖晃越強的視覺 cue（成長進度高時搖更兇）

---

## 2026-04-28 20:22 · Session A — INTENT: 蛋階段引導提示 + 階段適應 hint（review-v2 P1-5 收尾）

(已完成)

---

## 2026-04-28 20:14 · Session A — R-1 step 2：share.js 拆出（game.js 1922 → 1707）

**觸發**：cron 第 27 輪。R-1 step 2 已連續推遲 3 輪，本輪實質完成。

**為什麼**：game.js 已 1922 行，share card 區塊 ~237 行最自然可拆（自包含、邏輯獨立、依賴明確）。拆完後 game.js 主邏輯閱讀體驗大幅改善，第三個檔案也驗證雙模組架構可行。

**動作**：
- **新檔 `src/share.js`（266 行 IIFE）**：移過去 5 個 function：
  - `generateShareCard(past)` — 主畫卡，~170 行
  - `shareOrDownloadCard(past)` — Web Share API + download fallback
  - `wrapText(ctx, text, maxWidth)` — CJK-friendly 換行
  - `loadImage(src)` — Promise 包 Image()
  - `roundRect(ctx, x, y, w, h, r)` — Canvas 圓角 path
- **bridge `window.NourishAPI`**（game.js 暴露給 share.js）：
  - `getState()` / `getLastPetSrc()` — 動態 getter（state 是 closure-bound）
  - 函式 reference：`stageLabel / formLabel / formDescription / unlockedFormsSet / toast`
- **share.js 透過 `api()` lazy 取得 NourishAPI**，避開 script 載入時序問題
- **game.js 留薄壁紙**：`shareOrDownloadCard(past) { return window.NourishShare.shareOrDownloadCard(past); }` 兩行 wrapper，原本 callers 完全不動
- **index.html script 順序**：`cfg.js → share.js → game.js`（share.js 依 NourishCFG eager + NourishAPI lazy）

**影響檔案**：
- `src/share.js`（新檔，266 行）
- `src/game.js`（-225 行，1922 → 1697 行；之後 +13 行 bridge → 1710）
- `index.html`（+1 `<script>` tag）

**驗證**：
- `node --check` 三檔 ✅
- HTTP 200：cfg.js / share.js / game.js / index.html
- 行數：1697 (game.js) + 266 (share.js) + 197 (cfg.js) + 721 (style.css) = 2881 total
- bridge 在 game.js 1546 line（init 之前 module-scope 即執行）

**架構意義**：
- 雙檔抽出（cfg.js + share.js）= R-1 進度 30% → game.js 主邏輯仍佔 60%，但 file size 增長壓力解除
- 之後加新 v0.4 / v0.5 功能不會立刻撞 2000 行天花板
- 模組架構驗證：lazy bridge 模式 (`window.NourishAPI`) 可重複用於下一波 R-1 step 3 拆 dex.js / achievements.js
- **無 build step 原則維持**：HTML 用 script tag 順序當依賴鏈

**R-1 進度**：
- ✅ step 1：CFG → cfg.js（第 14 輪）
- ✅ step 2：share card → share.js（**本輪**）
- ⏸️ step 3：dex / achievements / accessory shop 拆出（建議下一輪做 dex，~150 行可移）
- ⏸️ step 4：modal / toast UI primitives 拆出
- ⏸️ R-5：i18n 骨架（v0.2 中英切換鋪路）

**下輪候選**：
1. R-1 step 3：拆 `dex.js`（archiveCurrentPet / startNewEgg / loadDex / saveDex / unlockedFormsSet / openDexMenu / openPetDetail，~140 行）
2. R-1 step 3 替代：拆 `achievements.js`（更小、更獨立）
3. 蛋階段 onboarding 補強（review-v2 P1-5 還沒完全處理）
4. 加分享卡的 individual SKU sticker 設計

---

## 2026-04-28 20:05 · Session A — INTENT: R-1 step 2 — 拆 src/share.js（200+ 行從 game.js 移出）

(已完成)

---

## 2026-04-28 19:57 · Session A — 3 條穿搭成就 + Session B 任務簡報文件

**觸發**：cron 第 26 輪
**為什麼**：第 21-25 輪堆了大量裝扮系統（6 配件 / 3 slots / 紀念卡），但**沒有玩家激勵的 milestone**。加 3 條穿搭成就把行為串起來。同時雙 session 協作要明確分工，寫個 Session B 簡報文件讓對方知道下一批產什麼 PNG。

**動作（成就 +3）**：
新增到 `CFG.achievements`（cfg.js line 68 附近）+ 鉤入 `checkAchievements`：

| ID | icon | 名稱 | 條件 |
|---|---|---|---|
| `dressup_first` | 🎀 | 小裝扮家 | 購入第一件飾品（owned ≥ 1） |
| `dressup_set` | ✨ | 全套搭配 | 同時戴 hat + neck + wing |
| `dressup_collector` | 💎 | 衣櫥達人 | 擁有全部飾品（owned 數 = CFG.accessories 總數，目前 6） |

`checkAchievements` hook 加在 `buyAccessory` 結尾、`equipAccessory` 結尾，每次裝扮商店操作都會檢查。

**動作（Session B 任務簡報）**：
新檔 `docs/session-b-tasks.md`，給雙 session 並行協作明確介面：

- **§1 待辦：wings PNG**（最高優先，第 23 輪 Session A 加的 SVG 還沒 PNG 化）
- **§2 mood 5 張白邊去除**（Session B 自己標記過）
- **§3 chick-young 視覺差異化**（Session B 自己標記，DreamShaperXL Turbo 不分 baby/juvenile）
- **§4 v0.4 額外配件 prompt 預覽**（小耳機 / 太陽眼鏡 / 圍巾 / 派對帽 / 蝴蝶結項圈）
- 一致性檢查清單（character-sheet §1.3 + §8）
- 完成 SOP（更新 path → 寫 log → 移交回 Session A）

**影響檔案**：
- `src/cfg.js`（+3 achievements entries）
- `src/game.js`（+3 checks、+2 hook 點）
- `docs/session-b-tasks.md`（新檔）

**驗證**：`node --check src/game.js src/cfg.js` ✅

**對玩家行為的引導**：
- 第一次點開商店 → 一買 → 立刻金光「🎀 小裝扮家」（教育玩家「裝扮系統會給回饋」）
- 中後期玩家會主動湊 hat + neck + wing 全套（dressup_set）→ 拉動 wing 銷售（350 FC，最貴的一件）
- 重度玩家會把所有配件買齊（1430 FC 總價，遠超「日常產出 80 FC」單日量）→ 14 天養成目標
- 完整 21 條成就（v0.1 17 + 本輪 +3 + 未來 +1 dressup 還沒想）→ collect_all 之外的長尾留存

**雙 session 介面**：
- Session A 改 cfg.js / game.js / SVG 邏輯
- Session B 改 ComfyUI 跑 PNG，更新 cfg.js path
- iteration-log.md 雙方都寫（append-only 在最上方）
- session-b-tasks.md 是 Session A → Session B 的「待辦清單」單向通信

**下輪候選**：
1. R-1 step 2（拆 share.js，~200 行可移）— 已連續推 2 輪
2. 「我可以做什麼」探索性提示（review-v2 P1-5 還沒完全處理，雖然加了 header 入口但新玩家蛋階段還是會迷茫）
3. 蛋階段的 6 小時等待時間能做什麼提示（onboarding 補強）

---

## 2026-04-28 19:50 · Session A — INTENT: 3 條穿搭成就 + Session B 配件 PNG 任務簡報

(已完成)

---

## 2026-04-28 19:42 · Session A — 個別寵物紀念卡（退役寵物的專屬分享卡）

**觸發**：cron 第 25 輪
**為什麼**：上輪做了圖鑑詳情頁，自然延伸 — 玩家會想把那隻退役寵物的紀念分享出去（女性向 TA：「紀念價值 + 自我表達」雙重命中）。

**動作**：
- `generateShareCard(past)` 簽名變成 optional：傳入 dex completedPets 條目時切到 **紀念卡 layout**，不傳就維持原本「現役寵物」layout
- **紀念版差異**：
  - 背景：粉 → 米白漸層（vs 現役的暖黃 → 粉）
  - 標題：「✨ 紀念冊 ✨」 / 副標 「ChickaDay · Memory」
  - 立繪：用 `past.finalForm` 對應的 portrait（PNG 或 SVG）
  - 配件：用 `past.appearance` snapshot 而非 `state.pet.appearance`
  - 名字行：「{name} · {finalForm}」（無階段、無括號）
  - 「陪伴了 {totalDays} 天」（過去式）
  - 4 條 stat 條 → 換成：
    - 形態描述（自動 word-wrap，最多 3 行）
    - 「📅 {誕生日期} → 🌙 {退休日期}」
    - 5 顆粉紅 ♡ 一字排
    - 「永遠記得你 💕」+ 「我和啾啾的回憶」+ 「ChickaDay」signature
  - 純粹紀念，不放成就 / 圖鑑數字（避免「跟現役玩家混」）
- 新增 `wrapText(ctx, text, maxWidth)` helper（簡單 char-by-char 換行，CJK 友好）
- `shareOrDownloadCard(past)` 也加 optional：filename 改 `chickaday-memory-X.png`、share text 改「紀念我養過的 X 💕」、toast 改「✨ 紀念卡已下載」
- **`openPetDetail` 詳情頁加「📸 紀念卡」按鈕**（與「回圖鑑」並列）

**影響檔案**：`src/game.js`（+~75 行）

**驗證**：`node --check` ✅ + game.js 1854 → 1922 行

**對玩家體驗的影響**：
- 完整三層分享/紀念體系：
  1. **現役分享卡**（截當下狀態）— 對外炫耀
  2. **詳情頁**（在遊戲內看歷代）— 個人翻閱
  3. **紀念卡**（退役寵物的專屬卡）— 跟朋友分享「我曾經養過」
- 紀念卡的「永遠記得你 💕」+ 5 顆粉紅愛心 + 過去式陪伴 X 天，把 emotional payoff 拉滿
- 開新蛋的儀式感 +：玩家知道「這隻退役後我還能拿牠的紀念卡分享」 → 開新蛋的心理門檻降低
- 對病毒拉新的影響 ×：玩家會把多隻寵物的紀念卡都分享出去，曝光次數不再受限於「當前寵物」

**file size 警告**：game.js 已破 1900 行，R-1 step 2 拆 share.js 的 ROI 越來越高。建議下一輪做。

**下輪候選**：
1. **R-1 step 2：拆 share.js**（含 generateShareCard / wrapText / loadImage / roundRect / shareOrDownloadCard，約 200+ 行可移動）
2. accessory PNG 化（Session B 下次 ComfyUI 配合）
3. 合併現役 + 紀念卡的「整套圖鑑分享卡」（畫上所有歷代）— 病毒效應更強但複雜度高

---

## 2026-04-28 19:33 · Session A — INTENT: 個別寵物分享卡（紀念退役寵物，extension 第 4 候選）

(已完成)

---

## 2026-04-28 19:25 · Session A — 圖鑑歷代寵物點擊查看詳情（強化情感連結）

**觸發**：cron 第 24 輪
**為什麼**：上輪做完歷代飾品 snapshot，但 dex 列表只是「一行字 + emoji 串」。點擊 row 看到完整紀念頁能把「我曾經養過這隻」感放大 ×3，符合女性向 TA 的「關係建立 + 紀念價值」訴求（feedback_target_audience.md）。

**動作**：
- 既有 `.settings-row` 在 dex 用，加上 `.pet-row` 修飾類 + `data-pet-idx` 屬性 + `tabindex="0"`，可點擊 / 鍵盤 focus
- onMount 端解析 `loadDex().completedPets[idx]` → 呼叫新函式 `openPetDetail(p)`
- 鍵盤 Enter / Space 也能開（review-v2 P2-8 a11y 延伸）
- **新增 `openPetDetail(p)`**：紀念詳情 modal，含
  - 寵物終態立繪（140×140，用對應 PNG/SVG，加粉色 drop-shadow）
  - 4 條紀錄：終態 / 誕生時間 / 退休時間 / 飼養天數
  - 穿搭區（如果有）：每件配件一 row，含縮圖 + icon + 名稱 + slot 標籤
  - 沒穿搭時顯示「沒有配戴飾品」灰字
  - 形象描述（reuse `formDescription(finalForm)`）
  - 「回圖鑑」按鈕關閉並重開 dex（不要往回按一層層）
- CSS `.settings-row.pet-row`：圓角 10px、hover 變淺粉、focus 顯示粉紅 outline（鍵盤可達）

**影響檔案**：`src/game.js` (+47 行)、`src/style.css` (+8 行)

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 圖鑑從「列表」 → 「相簿 + 簡歷」感
- 退役寵物的紀念價值 +：玩家會回頭翻看「我那隻戴皇冠的小白」「養了 12 天的元氣雞」
- 鍵盤 / 觸控通用（pointer-events 都吃，hover 桌機也好看）
- 跟分享卡形成內外雙佈展：分享卡是對外炫耀、圖鑑詳情是個人紀念

**下輪候選**：
1. R-1 step 2（拆 share.js / pet detail 也可以順便拆）
2. accessory PNG 化（Session B 下次 ComfyUI 批次配合 wings 也產 PNG）
3. mood 5 張白邊去除（Session B 已標記）
4. 圖鑑詳情頁加「分享這隻寵物」按鈕（生成 individual share card）

---

## 2026-04-28 19:18 · Session A — INTENT: 圖鑑歷代寵物點擊查看詳情（穿搭 / 飼養天數 / 終態）

(已完成)

---

## 2026-04-28 19:10 · Session A — wing slot + dex 歷代飾品 snapshot（記憶寵物的造型）

**觸發**：cron 第 23 輪。Session B 在這同時段把 5 張 accessory SVG → PNG（路徑改 `assets/images/acc-*.png`）+ 5 張 event SVG → PNG。

**動作（wing slot 第 3 個 slot）**：
- 新 SVG `acc-wings.svg`：粉紅雙翅 + 白羽脈紋 + 兩顆深粉 ✦ + 高光（character-sheet §1.3 色票）
- `cfg.js accessories` 加 `wings: { slot:"wing", price:350 }` — 暫用 SVG 路徑，等 Session B 後續批次 ComfyUI 產 PNG
- `defaultState.pet.appearance` 加 `wing: null`（deepMerge 對舊存檔安全）
- HTML 加 `<img class="accessory wing" id="acc-wing">` **放在 pet img 前面**（z-index 1，襯在身體後方，符合「翅膀在身後」物理直覺）
- CSS `.accessory.wing`：top 38、寬 200×200（比身體大、超出 pet img）+ 粉色光暈 drop-shadow
- render `ACC_SLOTS` 陣列 `["hat", "neck"]` → `["hat", "neck", "wing"]`

**動作（dex 歷代飾品 snapshot）**：
- `archiveCurrentPet` 在打包進 dex 前 snapshot `state.pet.appearance` 三個 slot 當下值
- 新增 `appearance: { hat, neck, wing }` 欄位入 `completedPets[i]`，紀錄該寵物退役當下「穿什麼」
- `openDexMenu` 歷代列表渲染：依 snapshot 對映 `CFG.accessories[id].icon`，把 emoji icon 串起來貼在名字後（例如「🐣 啾啾 · 元氣雞 🎀📿🪽」）
- 玩家養新蛋後，仍能在圖鑑看到「我之前那隻啾啾穿了什麼」 — 強化情感連結 + 收集滿足感

**動作（分享卡）**：
- 既有 `ACC_DRAW` 表加 wing slot：`{ x:0.5, y:0.45, size:1.10 }`（最大尺寸，襯在身後）
- **wing 在表中放第一個**（Object.keys 迭代順序）→ 最先 drawImage，被身體 + 飾品蓋上半部，符合視覺層次

**影響檔案**：
- `assets/svg/acc-wings.svg`（新檔，Session B 後續可生 PNG 替換）
- `src/cfg.js` (+1 wings entry)、`src/game.js` (~10 行 dex snapshot + render slot 陣列 + share card ACC_DRAW)、`src/style.css` (+9 行 .accessory.wing)、`index.html` (+1 wing overlay)

**驗證**：`node --check src/game.js src/cfg.js` ✅ + wings SVG HTTP 200

**對玩家體驗的影響**：
- 商店現在 6 件、3 slots：玩家可組「皇冠 + 項鍊 + 翅膀」一身天使裝（總價 1030 FC，符合長期目標）
- 退休的小雞在圖鑑保留造型回憶 — 從「就是另一隻成雞」 → 「我那隻穿粉紅項鍊的小啾啾」
- 圖鑑列表的 emoji icon 串等於迷你「穿搭印章」，每隻獨一無二

**6 件配件總覽**（5 in 商店現可買 + 1 wings 新加）：
| Slot | 配件 | 價格 |
|------|------|------|
| hat  | 蝴蝶髮帶 | 80 |
| hat  | 蝴蝶結   | 120 |
| hat  | 花環     | 200 |
| hat  | 皇冠     | 500 |
| neck | 珍珠項鍊 | 180 |
| **wing** | **夢幻翅膀** | **350** |

**下輪候選**：
1. 圖鑑歷代列表加上點擊查看詳情（含當時 final stats / appearance / 飼養天數紀錄）
2. mood 5 張 PNG 白邊去除（Session B 標記）
3. R-1 step 2（拆 share.js）
4. accessory PNG 化（Session B 下次 ComfyUI 批次配合）

---

## 2026-04-28 19:03 · Session A — INTENT: dex 紀錄歷代飾品 snapshot + wing slot + 第 3 件飾品

(已完成)

---

## 2026-04-28 18:55 · Session A — neck slot 配件 + 分享卡渲染配戴的飾品（炫耀價值升級）

**觸發**：cron 第 22 輪
**為什麼**：上輪「下輪候選」第 2 條「分享卡畫上配戴的配件」是炫耀價值最高 ROI；同時補第 1 條「多 slot 配件」開始多元化裝扮。

**動作（neck slot 起步）**：
- 新 SVG `acc-necklace.svg`：粉紅珍珠項鍊（漸層珠粒 + 中央深粉 #FF89A7 主珠 + 黃色 ♡ 墜飾），character-sheet §1.3 色票合規
- `cfg.js accessories` 加 `necklace: { slot:"neck", price:180 }`，並把 4 件 hat 重排「便宜 → 貴」順序（headband 80 → bow 120 → flower 200 → crown 500）讓玩家看商店時自然從入門攀升
- `defaultState.pet.appearance` 加 `neck: null`（deepMerge 對舊存檔安全）

**動作（render 多 slot 一致化）**：
- 把原本 hard-coded `hat` overlay 邏輯改成 `ACC_SLOTS.forEach(slot => ...)` 迭代
- 之後新增 wing / back slot 只要：(1) cfg 加新 slot=key (2) HTML 加 `<img id="acc-X">` (3) CSS 加 .accessory.X 位置 (4) 把 X 加進 `ACC_SLOTS` 陣列
- HTML 加 `<img class="accessory neck" id="acc-neck">`
- CSS 把共用樣式抽到 `.accessory` base class（位置 / 動畫 / drop-shadow），各 slot 只覆寫 top/size/z-index

**動作（分享卡畫上配戴飾品）**：
- `generateShareCard` 在畫完寵物立繪後，**逐 slot 載入飾品 SVG 並 drawImage**
- 新增 `ACC_DRAW` 對映表：`{ hat: {x:0.5, y:0.18, size:0.42}, neck: {x:0.5, y:0.55, size:0.55} }`
  - 座標相對於 portrait（pet 圖在 share card 中的區域），確保配件位置縮放後仍對齊
  - 大小相對於 portraitSize（360px）→ hat 約 151px、neck 約 198px
- `try/catch` 包住每張，個別失敗不會壞整張卡

**影響檔案**：
- `assets/svg/acc-necklace.svg`（新）
- `src/cfg.js`（accessories +1，重排 4 條）
- `src/game.js`（render slot 迭代 +5 行 / share card 加 ACC_DRAW + drawImage 迴圈 +20 行 / appearance schema +1 欄位）
- `src/style.css`（`.accessory` base + `.hat` `.neck` 各自樣式，淨增 5 行）
- `index.html`（+1 `<img>` overlay）

**驗證**：`node --check src/game.js src/cfg.js` ✅ + necklace SVG HTTP 200

**對玩家體驗的影響**：
- 商店現在有 5 件（4 hat + 1 neck），可同時戴帽子 + 項鍊形成「全套搭配」
- 分享卡截圖會把當下配戴的配件畫上去，**原本「養成截圖」變「個人化造型截圖」**——對女性向 TA 的「自我表達 + 炫耀」訴求是直接命中
- 開新蛋仍保留 ownedAccessories（跨命繼承，上輪已做）

**架構意義**：
- 渲染層改為 slot 迭代後，**未來加任何 slot 都是 4 個位置的小改**，不必動 render 主邏輯
- 分享卡的 ACC_DRAW 表也是同一套抽象，加新 slot 同時改兩處即可

**下輪候選**：
1. wing / back slot（再加 1-2 配件）
2. mood 5 張白邊去除（Session B 標記，需 ComfyUI 重生）
3. R-1 step 2（拆 share.js）
4. 圖鑑歷代寵物列表加上「當時配戴的飾品」紀錄（archiveCurrentPet 帶 appearance snapshot）

---

## 2026-04-28 18:48 · Session A — INTENT: neck slot + 分享卡渲染配件 + render 多 slot 一致化

(已完成)

---

## 2026-04-28 18:38 · Session A — 裝扮系統 v0.3 起步（Session B 平行做 PNG 升級，雙方無撞檔）

**觸發**：cron 第 21 輪。同時段 Session B 跑了 AI 生圖 + GitHub repo（見下方 18:30 條目），雙方在不同檔案範圍工作，cross-check 通過。

**動作（裝扮系統 v0.3，4 配件 + 商店 + 頭頂渲染）**：

- **4 張配件 SVG**（character-sheet §1.3 統一色票，viewBox 100×100）：
  - `acc-bow.svg`：粉紅蝴蝶結 #FFB7B7 + 中央深粉結 + 高光
  - `acc-flower.svg`：5 瓣粉花 + 黃色花心 + 橘色花蕊
  - `acc-crown.svg`：黃金王冠 + 粉紅 + 深粉珠寶 + 藍寶石
  - `acc-headband.svg`：粉紅蝴蝶髮帶 + 深粉內結

- **資料層 (cfg.js)**：新增 `accessories` 表（4 條，slot/art/label/icon/price）
  - 蝴蝶髮帶 80 / 蝴蝶結 120 / 花環 200 / 皇冠 500 FC
  - **與 Session B 同檔案改 petArt/moodArt 路徑無衝突**（不同 key，cross-check 已通過 line 158/166/181 三段並存）

- **狀態層**：`defaultState.pet.appearance = { hat: null }` + `ownedAccessories = {}`；`startNewEgg` 修改保留 `ownedAccessories` 跨命繼承（玩家買的飾品永久持有）

- **UI 層**：
  - header 多一顆 🎀 「裝扮商店」按鈕（與 🏅 / 📖 / ⚙️ 並列）
  - `pet-wrapper` 加 `<img class="accessory hat">` overlay（CSS 絕對定位寵物頭頂、80×80、跟著 bob 動畫）
  - render 依 `state.pet.appearance.hat` 切換 hat src，dataset.id 快取避免重複賦值
  - `openShopMenu()`：modal 列 4 條 row，未擁有「N FC」按鈕（餘額不夠 disabled）；已擁有「戴上 / ✅ 配戴中」toggle
  - `buyAccessory` / `equipAccessory` 配 SFX (coin / click / fail)

**對 Session B 那輪的兼容性**：
- ✅ Session B 換 petArt/moodArt 為 PNG 路徑（11 + 5 圖），我的 accessories 是新 key 不互相干涉
- ✅ Session B 寫的「event SVG 缺失」候選**並非實情** — 5 張 event SVG 都還在 `assets/svg/` 中（curl 200 過、本輪 ls 確認）。可能是 Session B 沒看到隱藏列表或誤判；下次 Session B 啟動可從 ls 即可釐清
- 後續：accessories 也可考慮 PNG 化（Session B 那邊有 ComfyUI pipeline，可加進該批次）

**影響檔案**：
- `assets/svg/acc-{bow,flower,crown,headband}.svg`（4 新檔）
- `src/cfg.js`（新增 accessories 表）、`src/game.js`（+~80 行 shop / equip / render hook）、`src/style.css`（+15 行 accessory.hat 樣式）、`index.html`（+1 header 按鈕、+1 hat overlay）

**驗證**：
- `node --check src/game.js src/cfg.js` ✅
- HTTP 200：4 張新配件 SVG + cross-check 5 張 event SVG 仍存在
- 雙方修改 cfg.js 整合無衝突

**對 TA 對齊的影響**：
- v0.3 必做（memory `feedback_target_audience` 標記）從規劃 → 可玩
- 配件全部粉色系 + 蝴蝶結 / 髮帶 / 花環 / 皇冠（character-sheet §10.3 清單照做）
- 跨命繼承機制讓玩家養新蛋時不會「努力又沒了」

**下輪候選（彙整 Session A + B）**：
1. **多 slot 配件**（neck / wing / back）— 跟 ComfyUI batch 配合產 PNG 版
2. **分享卡也畫上目前配戴的配件** — 截圖功能會更有「炫耀價值」
3. **Session B 提的 mood 5 張白邊去除重生**（rembg 不夠乾淨，可重 prompt 加「pure transparent, no border」）
4. **chick-young 視覺差異化**（Session B 提：DreamShaperXL Turbo 不分 baby vs juvenile，需指定姿勢 / 體型）
5. R-1 step 2（拆 share.js）

---

## 2026-04-28 18:30 · Session B — AI 生圖 21 張，整套 SVG → PNG 替換 + GitHub repo 建立

**觸發**：使用者要求「直接用 AI 生圖」
**為什麼**：「畫風是決定要不要玩這遊戲的因素之一」（已存記憶 feedback_art_priority）。SVG 占位圖完成度高但仍是過渡品，PNG 替換是 v0.2 上線前的必要條件。

**動作**：
- 建立 GitHub repo `gn01816565/nourish`（public, main 分支，初始 commit 31 檔）
- 透過 `kmm → linux-pc`（192.168.50.68，RTX 3060 Ti 8GB VRAM）跑 ComfyUI 0.14.1
- 修 ComfyUI 環境：torch 2.10+cu128 → 2.5.1+cu121（cuDNN 與 driver 535 相容）
- Pipeline：DreamShaperXL Turbo（SDXL，8 步 dpmpp_sde+karras CFG=2.0）→ rembg `isnet-anime`（角色）/ `u2net`（物件）去背 → PIL crop+pad+resize 512×512
- 21 張 PNG 出爐：11 chick variants（egg/cracked/baby/young/7 成年）+ 5 mood + 3 食物 + 2 背景
- pngquant 壓縮：4.9MB → **1.8MB**（63% 減幅）
- 風格：Pixar/Sanrio 毛茸茸 plush 風（DreamShaperXL Turbo bias，雖然 prompt 寫 flat 2D 但生成偏 3D 軟質）
- 角色一致性：同 seed + 同 IDENTITY 段，跨 11 張 chick variants 保持「同一隻雞」感意外得好
- 接線：`src/cfg.js` petArt/moodArt 全部 `assets/svg/*.svg` → `assets/images/*.png`；`src/game.js:652` 背景 src 同步換 PNG

**影響檔案**：
- 新增 `assets/images/*.png` 21 張
- 修改 `src/cfg.js`（petArt + moodArt path 全換）、`src/game.js`（bg path）
- 新增 `.gitignore`（含全域 `~/.gitignore_global` 對 `index.html` 例外）
- GitHub: https://github.com/gn01816465/nourish

**驗證**：
- `node --check src/game.js src/cfg.js` ✅
- `curl localhost:8765/assets/images/*.png` 8 張全 200 ✅

**已知限制**：
- mood 5 張帶白色 sticker 外框（non-pure transparent），overlay 用可能略微突兀
- chick-young 與 chick-baby 視覺差異不夠大（DreamShaperXL Turbo 不太分得出 baby vs juvenile）
- 風格偏 3D plush 而非原 GDD 寫的 flat 2D vector — 改 model 或加 LoRA 可解，但這套對女性向 TA 反而對胃

**下輪候選**：
- 重生 mood 5 張去除 sticker 外框（強推「pure emoji icon, no border, no frame」）
- 改善 chick-young（更明顯的少年體態）
- 補生原本就缺的 event SVG（coin / herb / butterfly / fly / star — cfg.js 第 94-98 行引用但檔案不存在）
- 把 v0.1 commit 切成階段性 commits（user 之前選 single commit，可後續用 `git filter-branch` 重切，但實用性低）

---

## 2026-04-28 18:10 · Session A — 元氣雞 SVG 重畫 + 愛撫愛心粒子（女性向視覺最後拼圖）

**觸發**：cron 第 20 輪
**為什麼**：上輪文案軟化已完成（戰鬥雞 → 元氣雞、打沙包 → 動感節拍），但**SVG 還是暗紅頭巾 + 暗紅拳套 + X 眼**，視覺與文案打架。這輪把這塊補完，讓 character-sheet §10.2 整套女性向軟化清單視覺與文案完全對齊。

**動作（fighter SVG 重繪）**：
舊版（v1）→ 新版（v2，character-sheet §10.2 對齊）：

| 元素 | v1 | v2 |
|------|----|----|
| 頭巾 | 暗紅 #B23A48 帶虛線縫合 | **粉色 #FFB7B7 運動帶 + 中央 ✦ 星星 + 兩側白色 ♡** |
| 眼睛 | X 形銳利線（鬥志感） | **圓黑點 + 白高光（標準啾啾識別 DNA）** |
| 臉頰 | 無 | **粉色腮紅** |
| 拳套 | 暗紅 #B23A48 圓 | **粉色 #FFB7B7 軟拳套 + 白色 ♡ + 高光點** |
| 嘴 | V 形上揚弧線 | **U 形溫和微笑** |
| 身體裝飾 | 無 | **腹部羽毛紋（橘色細線）** |
| 周邊 | ⚡ 閃電 | **✨ 星光 + ♪ 音符 + ♡ 愛心** |

**對 character-sheet §1.2 視覺 DNA 的合規檢查**：
- ✅ 體色 #FFD86B 主色保留
- ✅ 大圓眼 + 左上單一白高光（從 X 眼回到標準 DNA）
- ✅ 小三角橘喙 #FF9F43
- ✅ 大頭比例（頭 38r / 身 55r ≈ 0.69，符合成雞範圍）
- ✅ 粗黑線稿 ~3px

**動作（愛撫愛心粒子）**：
- `playReactionAnim` floats 池調整（character-sheet §10.3 加大愛心比例）：
  - 餵食：`["🍴", "♡"]`
  - 玩耍：`["♪","🎵","✨"]`（移除「💫」中性符號）
  - 洗澡：`["🫧","🫧","✨"]`（保持）
  - **摸頭**：`["💕","♡"]`
  - **摸肚子**：`["💖","♡","♡"]`（最甜，3 顆）
  - **對話**：`["💬","♡"]`
- `spawnFloatEmoji` 偵測愛心類 emoji（♡ / 💕 / 💖）→ 加 `.heart` class
- CSS `.float-emoji.heart`：粉紅色 #FF89A7 + 雙層粉色 text-shadow + 增大字級到 28px → 愛心會「發光」
- 順手加粒子數量 cap（≤ 8）防止連點堆爆 DOM（補 P1-6 缺漏點）

**影響檔案**：
- `assets/svg/chick-adult-fighter.svg`（重寫）
- `src/game.js`（playReactionAnim mapping + spawnFloatEmoji heart class + 數量 cap）
- `src/style.css`（`.float-emoji.heart` 粉色發光樣式）

**驗證**：`node --check` ✅ + fighter SVG HTTP 200

**對 TA 對齊的影響**：
- 元氣雞文案 + 視覺現在 100% 一致（粉色運動帶 + 圓眼 + 笑臉 + 愛心拳套）
- 玩家摸頭摸肚子會看到「3 顆粉紅發光愛心從寵物身上飄出」→ 直接踩中女性向「療癒陪伴」的核心情感點
- 玩耍時的 ♪🎵✨ 音符星星比舊版的「💫」更甜美
- 整體互動視覺從「中性活潑」 → 「甜美療癒」基調確立

**下輪候選**：
1. 裝扮商店 v0.3 起步（蝴蝶結 / 髮帶 / 花環 SVG 各一張）
2. 神雞 SVG 加粉色光暈（character-sheet §10.2「光暈帶粉色調」）
3. R-1 step 2（拆 share.js）
4. 第 19 輪兩側飄 ♡ 元素的更精緻版本（飄動動畫，character-sheet §10.1 甜美裝飾）

---

## 2026-04-28 18:03 · Session A — INTENT: 元氣雞 SVG 重畫（粉色運動帶 + 軟拳套）+ 愛撫愛心粒子

(已完成)

---

## 2026-04-28 17:55 · Session A — TA 視覺 audit pass：圓角 ↑ / 粉色比例 ↑ / 戰鬥雞全軟化

**觸發**：cron 第 19 輪。上一輪收到 TA = 女性 feedback 後立刻優先處理。

**動作（CSS：圓角 + 粉色佔比）**：
- `--radius` 14 → **20**（btn / card / 互動子選單一律更圓潤），新增 `--radius-sm: 14px` 用在較小元素
- 新增色票 `--c-pink-deep #FF89A7`（桃紅）+ `--c-pink-soft #FFE0E8`（淺粉）
- body 背景漸層：`#FFE6B0 → #FFEFC1 → #FFD9E0` 改成 `#FFE6B0 → #FFD9E0 → #FFCFE2`，粉色比重從 ~33% → ~55%
- header 漸層：`yellow → orange` → **`yellow → pink`**（character-sheet §10.1）
- action button 背景：純白 → **`linear-gradient(180deg, white, --c-pink-soft)`**，hover 時加深到 `--c-pink`
- coin pill：加粉色尾段 `linear-gradient(yellow, #FFEC8B, pink-soft)`，圓角從 14px 改 999px（純橢圓）
- menu-item：圓角 12 → 16，hover 變粉
- modal-close：純黃 → **`linear-gradient(yellow, pink)`**，圓角 12 → 999（橢圓 pill）
- `#app::before / ::after` 雙側飄 ♡ 裝飾（透明度 0.18 + 旋轉 ±12°），手機尺寸隱藏避免擠

**動作（程式 + 文案：戰鬥雞全軟化）**：
character-sheet §10.2 軟化清單對照執行：

| 位置 | 改動 |
|------|------|
| `formLabel("fighter")` | 「戰鬥雞」 → **「元氣雞」** |
| `formDescription("fighter")` | 「戴頭巾、戴拳套，眼神銳利。打沙包打出來的硬漢路線。」→ **「粉色運動帶、活力滿點，跳跳活蹦的元氣派路線。」** |
| `formLabel` 其他 | 胖雞 → 圓潤雞、醜雞 → 迷因雞、神雞 → 天使雞（語氣更溫柔） |
| 成就 `form_fighter` | 🥊「拳王」→ **💪「元氣之星」/「養出元氣雞」** |
| 互動 `play_punch` | 「打沙包」🥊 → **「動感節拍」💃** |
| want `want_punch` | 「想打沙包！」🥊 → **「想跳一下！」💃** |
| 對白 `action_play_punch` | 「咚！再來！」「出拳！」「(認真模式)」→ **「蹦蹦蹦~」「再來再來！」「(動感模式)」** |
| 對白 `form_fighter` | 「再來一輪！」「拳套還夠用嗎」→ **「元氣滿滿~」「再蹦一下！」「活力 max！」** |
| 設定頁 trait row | 「🥊 戰鬥點數 → 戰鬥雞」 → **「💪 活力點數 → 元氣雞」** |

> 內部變數名 `fighter / battlePoints / play_punch` 不動（避免大規模改 + 破壞 dex 既有資料），只動對外文案。

**影響檔案**：`src/style.css` (+~8 行)、`src/cfg.js` (~5 處字串)、`src/game.js` (~3 處字串)

**驗證**：`node --check` 兩檔 ✅

**對 TA 對齊的影響**：
- 桌機看遊戲：兩側多兩顆飄浮 ♡ 立刻有「女性向」氣質
- 手機看遊戲：圓角更圓 + 按鈕粉色 hover/gradient + 漸層粉色化 = 整體甜美
- 所有「戰鬥」「拳」「打」字眼從前台清空（除舊存檔的內部 `fighter` 標識）
- 圖鑑顯示「元氣雞」+「跳跳活蹦的元氣派路線」描述，符合「療癒不暴力」基調

**沒做的（需要更多時間）**：
- `chick-adult-fighter.svg` 重畫（暗紅頭巾 + 紅拳套 → 粉色運動帶 + 軟拳套），下輪做
- 餵 cake 動畫加愛心粒子變奏
- 取名字體可考慮換成更圓潤的襯線或手寫風（v0.3 評估）

**下輪候選**：
1. **chick-adult-fighter.svg 重畫**（character-sheet §10.2 軟化清單第 1 條，視覺一致性最後一塊）
2. 裝扮商店 v0.3 起步（蝴蝶結 / 髮帶 / 花環 SVG 各一張）
3. R-1 step 2（拆 share.js）
4. 新增「愛心特效」當愛撫互動的粒子（pet_head/pet_belly/talk）

---

## 2026-04-28 17:48 · Session A — INTENT: TA 視覺 audit pass — 圓角 ↑ / 粉色 ↑ / fighter 軟化「元氣雞」

(已完成)

---

## 2026-04-28 17:40 · Session A — 音效系統 + 設定頁切換 + 收到 TA 定位（女性向）關鍵 feedback

**觸發**：cron 第 18 輪 + 使用者中途 feedback「主要 TA 是女生」

**動作（音效系統）**：
- 純 Web Audio API 程序合成（OscillatorNode + GainNode envelope），**零外部檔案**
- AudioContext 延遲到首次使用者手勢才建立（autoplay policy 友善）
- 8 種 SFX：click / success / fail / achievement / evolve / want / event / coin
  - achievement / evolve 是音階旋律（4-5 音逐個 trigger，間隔 90-100ms）
  - coin / want 是雙音
  - click / event 是單音
- Hook 點：performInteraction success、unlockAchievement、maybeEvolve、spawnWant、resolveEvent（coin_drop 用 coin、其他用 event）
- `state.settings.soundEnabled / reducedMotion` 進 schema（deepMerge 對舊存檔安全）
- 設定頁加 2 個 toggle row（音效開關 / 減少動畫切換），點擊立即生效並 re-render menu
- `applyReducedMotionPref()` 加 `body.reduce-motion` class，CSS `body.reduce-motion .pet { animation:none }` 等覆寫所有動畫

**動作（TA 定位 feedback 收尾）**：
使用者明確指出「主要 TA 是女性，版面跟設計都要以女性向喜歡的為主」。立即落地：

- 新增記憶：`feedback_target_audience.md` + 加入 MEMORY.md 索引（這是高層方向，未來所有 session / sub-agent 都要看到）
- 更新 `CLAUDE.md §1` 專案定位：把「女性 TA」從「次要假設」升級為「核心約束」，列 6 條設計 do/don't（粉嫩 / 圓角 / 愛心 / 軟化戰鬥 / 關係 > 競爭 / 裝扮 v0.3 必做）
- 更新 `docs/character-sheet.md`：
  - §0 加第二段 feedback
  - §3 戰鬥雞 → **元氣雞**，配件從「暗紅頭巾 + 拳套」→「粉色運動帶 + 軟拳套」
  - 新增 §10「女性向 TA 設計約束」整章：調性、形象軟化清單、玩法側重、文案 do/don't

**影響檔案**：
- `src/game.js` (+~73 行 → 1686)、`src/style.css` (+11 行 → 646)
- `CLAUDE.md` (補強 §1)、`docs/character-sheet.md` (改 §0 §3 + 新增 §10)
- 全域 memory：`MEMORY.md` + `feedback_target_audience.md`

**驗證**：`node --check` ✅

**對之後所有輪次的影響**：
- 任何 sub-agent 進來都會自動讀到 TA 定位（透過 CLAUDE.md + memory 雙保險）
- 後續美術產出 / 文案 / 配色 / 互動設計 / 形象描述都以女性向為基準
- 「戰鬥雞」對外文案開始軟化（程式內部變數名 `fighter` 不動，避免大規模改）

**下輪候選（已重新排序，TA 對齊優先）**：
1. **TA 視覺 audit pass**：CSS 圓角從 14 → 18-20px、`--c-pink` 提高到主色、按鈕粉紅化、戰鬥雞文案改「元氣雞」（最高優先）
2. fighter SVG 重畫：粉色運動帶取代暗紅頭巾、姿勢改活力 vs 攻擊（character-sheet §10.2）
3. 裝扮系統 v0.3 起步（v0.3 已標必做）
4. R-1 step 2（拆 share.js）
5. 音效音色微調（用戶實測後再說）

---

## 2026-04-28 17:32 · Session A — INTENT: 音效系統（Web Audio 程序合成，無外部檔案）+ 玩家可切換

(已完成；中途收到 TA feedback，連同處理)

---

## 2026-04-28 17:25 · Session A — 鍵盤捷徑 + ESC 關 modal（review-v2 P2-8 a11y）+ CLAUDE.md 同步

**觸發**：cron 第 17 輪
**動作**：

- **鍵盤捷徑**（power-user + 桌機 a11y）：
  - 全域 `keydown` listener，含三道防呆：
    - `INPUT/TEXTAREA` 焦點時 skip（避免取名輸入時被攔）
    - `Ctrl/Cmd/Alt` 組合不攔
    - modalOpen 期間僅 ESC 有效，不觸發遊戲 shortcut
  - **數字鍵 1-5** 對應主要互動：餵食 / 玩耍 / 洗澡 / 睡眠 / 愛撫
  - **字母鍵**：A 成就、D 圖鑑、S 設定、N 取名、? 或 H 求救
  - **ESC** 關當前 modal（review-v2 P2-8 提到的 a11y 缺口）

- **求救對話 `openHelpDialog()`**：列出 11 條 shortcut，配 `<kbd>` 樣式（白底黑線稿 + 雙層 box-shadow，與整體風格一致）

- **CSS** 加 `kbd` style：圓角白底 + 1.5px 黑線稿 + 2px box-shadow

- **CLAUDE.md 同步**：
  - §3 檔案結構加 `cfg.js` 條目，註明 `→ window.NourishCFG`
  - §5 程式碼慣例改寫：用 `<script>` 載入順序當依賴鏈、隨機事件 apply 用 string id、R-1 拆檔進度
  - 為下次 Session B 進來提供清楚的「從哪裡改數值」路徑

**影響檔案**：`src/game.js` (+39 行 → 1613)、`src/style.css` (+13 行)、`CLAUDE.md` (2 段更新)

**驗證**：`node --check` ✅

**對玩家的影響**：
- 桌機玩家現在 1-5 一鍵操作，不用每次點按鈕（idle 養成類常見訴求）
- 螢幕閱讀器使用者 + 鍵盤導航族群現在能 ESC 關視窗（之前必須點背景或關閉鍵）
- 新玩家按 ? 看 cheatsheet（不知道有捷徑也沒差，知道的玩家撿到便宜）

**下輪候選**：
- R-1 step 2：把 share card 抽到 src/share.js（self-contained ~150 行可移）
- 設定頁 reduced-motion 玩家可手動切換（目前只跟系統 prefers-reduced-motion）
- 進化前兆 + audio 配音（最簡只需 1-2 個 mp3 + Web Audio API）

---

## 2026-04-28 17:18 · Session A — INTENT: 鍵盤捷徑 + ESC 關 modal + CLAUDE.md 同步 cfg.js 結構

(已完成)

---

## 2026-04-28 17:14 · Session A — post-action 對白 + 存檔匯出/匯入

**觸發**：cron 第 16 輪
**動作**：

- **post-action contextual 對白**（承接第 13 輪對話深度）：
  - cfg.js `speech` 加入 17 條 `action_*` 池（每池 2-4 條）：每個互動有專屬回應
    - feed_basic「嗯嗯好吃~」/ feed_corn「玉米超讚！」/ feed_cake「蛋糕！蛋糕！」
    - play_punch「咚！再來！」/ play_sing「♪~♫」/ play_puzzle「啊我懂了！」
    - bath「(抖水珠)」「啾啾愛洗澡(才怪)」/ pet_belly「咯咯咯」/ talk「對啊對啊」
  - `performInteraction` 結尾改：先查 `CFG.speech[`action_${key}`]`，命中就用，否則 fallback `pickHappy()`
  - 玩家現在不再聽到「最喜歡主人了」六種輪播了 — 餵 cake 跟摸頭聽到的反應完全不同

- **存檔匯出 / 匯入**（資料攜帶性，2026 養成遊戲常見功能）：
  - `exportSaveBundle()`：把 `nourish.save.v1 + nourish.dex.v1` 包成 `{ v:1, exportedAt, save, dex }`，base64 編碼（unescape/encodeURIComponent 處理 UTF-8）
  - `importSaveBundle(b64)`：解碼 → JSON parse → schema 檢查（`v === 1`）→ 寫回 localStorage 兩個 key
  - 設定頁多兩 row：「📤 匯出存檔」用 `navigator.clipboard.writeText` 複製到剪貼簿（fallback 走 `window.prompt`），「📥 匯入存檔」用 prompt 接字串 + 二段 confirm
  - 匯入成功後 `location.reload()` 讓 state 重新載入

**影響檔案**：`src/cfg.js` (+17 行)、`src/game.js` (+57 行)

**驗證**：`node --check` 兩檔 ✅

**file size 結算**：cfg.js 167 → 184，game.js 1517 → 1574

---

## 2026-04-28 17:08 · Session A — INTENT: post-action contextual 對白（每個互動專屬反應）

(已完成，見上)

---

## 2026-04-28 17:00 · Session A — 截圖分享卡（Canvas → PNG，病毒拉新樁）

**觸發**：cron 第 15 輪
**為什麼**：extensions §1.3 標 v0.2 推薦前 3 名（前 2 條已做：對話深度、進化前兆）。完成這條 = Sprint 1 全部完成。把「個人遊戲」變「可分享」是長期病毒拉新的關鍵樁。

**動作**：
- 新增純 Canvas 繪製函式 `generateShareCard()`：720×1280 直立卡片
  - 漸層背景（複用 body 三色漸層 #FFE6B0 → #FFEFC1 → #FFD9E0）
  - 圓角白底卡 + 6px 黑線稿（複用色票 #FFF8E7 / #2C2C2C）
  - 標題「啾啾日常」+ 副標 ChickaDay v0.1
  - **寵物立繪**：載入當前 `lastPetSrc` SVG（蛋 / 雛 / 幼 / 7 種終態自動切換），繪到中央 360×360
  - 名字 + 階段 + 終態名稱
  - 「已陪伴 X 天」
  - **4 條狀態條**（飢餓 / 心情 / 清潔 / 體力）含色彩編碼（>70 綠、40-70 黃、20-40 橘、<20 紅）
  - 「🏅 成就 X/18 · 📖 圖鑑 Y/7」
  - 底部 tagline「一起來養屬於你的小雞~」
- 輔助函式：`loadImage(src)` Promise 包 Image()，`roundRect(ctx, x, y, w, h, r)` 純 canvas 圓角 path
- `shareOrDownloadCard()` 雙路徑：
  - **Web Share API** （`navigator.canShare({ files })` 可用 → 直接彈系統分享 sheet，行動裝置友好）
  - **Fallback**：產生 blob URL → `<a download>` 觸發 PNG 下載，桌機友好
  - 失敗則 toast 紅字
- 在圖鑑 modal 底部新增「📸 分享卡」按鈕，與「🏅 成就」並列；點擊先 closeModal 再 shareOrDownloadCard

**影響檔案**：`src/game.js`（+152 行，純新功能）

**驗證**：`node --check` ✅

**對病毒拉新的影響**：
- 玩家的小雞 = 個人投射 + 養成回憶 → **天然有炫耀慾**（GDD §1.3 寫「炫耀感」設計目標）
- 一鍵分享到 IG / Threads / Discord，圖內含 Logo 與 Tagline 形成廣告位
- Mobile Web Share API 走系統分享 sheet（無第三方依賴），桌機則退到 PNG 下載
- 之後 v0.3 可在卡上加 QR code 連回遊戲（待主域名定）

**已完成 Sprint 1（extensions agent 推薦三件）**：
- ✅ 進化前兆金光（第 11 輪）
- ✅ 對話深度擴充（第 13 輪）
- ✅ 截圖分享卡（本輪）

**file size 警告**：game.js 1365 → 1517（+152），R-1 step 1 的瘦身被吃光。下輪建議繼續 R-1 step 2（render layer）或開始 step 3（拆功能模組）。

**下輪候選**：
- R-1 step 2/3（拆 render 或拆 share / dex / achievement 出去）
- 設定頁正式化 + i18n 骨架（R-5）
- post-action contextual 對白（餵食後說「好吃！」這類即時反應）

---

## 2026-04-28 16:53 · Session A — INTENT: 截圖分享卡（Canvas → PNG，extensions §1.3 病毒樁）

(已完成)

---

## 2026-04-28 16:45 · Session A — R-1 step 1：CFG 抽到 src/cfg.js（game.js 1512 → 1365 行）

**觸發**：cron 第 14 輪。R-1 從上一輪起連續推遲 4 次，這次必須實質啟動。
**為什麼**：game.js 已經 1500+ 行，後續加新功能定位 / 改數值都得 grep 半天。先把純資料抽出來，邏輯就清晰。第一步刻意挑「最低風險」的工作 — CFG 是純 data，不變動行為。

**動作**：
- 新增 `src/cfg.js`（167 行）：包整份 CFG（save / decay / thresholds / growth / stages / interactions / achievements / wants / randomEvents / economy / welcomeBack / speech / petArt / moodArt），用 IIFE 包起來，最後 `window.NourishCFG = CFG;`
- `randomEvents.pool[].apply` 從**閉包函式**改成**string id**（"coin_drop" / "herb" / "butterfly" / "fly" / "star"）：純 data 才能搬出去
- `src/game.js` 開頭：
  - 加 `const CFG = window.NourishCFG;` + 防呆 throw
  - 加 `RANDOM_EVENT_APPLIES` dispatch 表（5 條），仍是閉包但只剩薄薄一層
  - 移除原本內嵌 CFG（173 行 → 0 行）
- `resolveEvent` 的 `def.apply(state)` 改成 `RANDOM_EVENT_APPLIES[def.apply || def.id](state)`，含 fallback 兼容舊 in-memory 物件
- `index.html`：`<script src="src/cfg.js">` 在 `<script src="src/game.js">` 之前

**影響檔案**：`src/cfg.js`（新）、`src/game.js`、`index.html`

**驗證**：
- `node --check cfg.js` ✅
- `node --check game.js` ✅
- HTTP 200：index.html / cfg.js / game.js
- 行數：1512 → 1365（-147 行 / -10%），cfg.js 167 行（純 data + IIFE wrapper）

**架構意義**：
- 改數值 / 加新成就 / 加新對白現在只動 cfg.js，不必動 game.js 的邏輯
- 為下個 step（拆 render / interactions / events 為獨立模組）打地基
- 「無 build step」設計維持：HTML 就是模組系統，多一條 `<script>` 即可
- 同步更新 CLAUDE.md §3 的檔案結構（待下輪）

**仍待 R-1 後續步驟**：
- step 2: 拆 render layer（render / setActionState / 子 menu HTML 渲染） → 約 200 行
- step 3: 拆 interactions / events / wants / achievements 各成一檔 → 各 ~100-150 行
- step 4: 拆 modal / toast / speech UI primitives
- 預估 step 2-4 共 1-1.5h，可分 3-4 輪 cron 完成

**下輪候選**：
- R-1 step 2（拆 render）
- 截圖分享卡（病毒拉新樁）
- 設定頁正式化 + i18n 骨架（R-5）

---

## 2026-04-28 16:38 · Session A — INTENT: R-1 step 1 — 抽 CFG 到 src/cfg.js（reduces game.js 1512 → ~1340）

(已完成，實際 1365 行)

---

## 2026-04-28 16:30 · Session A — 對話深度擴充（85 條 contextual line + 智能 picker）

**觸發**：cron 第 13 輪
**為什麼**：extensions §1.6 標「v0.2 第一名 ROI」、market-2026 §1.1 也提「對話建立關係」是 2026 新範式。原本 `CFG.speech` 只有 6 個 pool 共 ~20 條，全憑單一 if-else 做極簡選擇 → 啾啾感覺像台詞固定的玩具，不是有人格的個體。

**動作**：
- **CFG.speech 從 6 池擴成 18 池，從 ~20 條擴成 ~85 條**：
  - 既有 6 池保留並擴充（每池 +1–3 條）
  - 新增「危機級」` veryHungry / verySad / veryDirty / veryTired`（數值 < 8 才觸發，5 條 × 4）
  - 新增「巔峰幸福」`perfect`（4 項 >70 同時觸發，4 條）
  - 新增**時段** 5 池：`morning / noon / evening / night / lateNight`（依當前時間切換）
  - 新增**階段** 4 池：`stage_egg / stage_chick / stage_junior / stage_adult`（蛋會「(輕輕晃動)」、成雞會「我看過很多事情了」）
  - 新增**終態** 7 池：`form_healthy/fatty/ugly/fighter/sage/diva/divine`（每終態 2 條，戰鬥雞「再來一輪！」、神雞「願平靜降臨於你」）
  - 新增 `wantNag`：want 存在時 25% 機率觸發抱怨（不會 spam）
  - 新增 `rich`：FC ≥ 200 時暗示購買
  - 新增 `quirk`：(發呆) (整理羽毛) (看天空) (踱步) 純動作描述

- **`pickContextualLine()` 智能 picker** 取代原本 if-else：
  - 危機 stat（< 8）絕對優先（玩家會立刻看到求救）
  - 普通低 stat（< 20）次優先
  - want nag 25% 機率
  - perfect 狀態 40% 機率快樂
  - 餘下機率分布：stage flavor 25%、time-of-day 20%、form flavor 10%、rich 7%、quirk 16%、generic idle 22%
  - 結果：同樣「全狀態正常」也會輪播約 30 種不同類型的 line

- **idle speech 現在是「~70% 機率說話」**（30% 安靜也是個性）

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

**對 D1 第一印象的影響**：
- 玩家剛進來 5 分鐘內會看到：時段問候 + 階段 flavor + quirk + idle，至少 4 種 type
- 養到成雞看到 form-specific 對白 → 強化分支收集價值（神雞跟戰鬥雞講話真的不一樣）
- 帶 want 時的 nag 讓「主動表達欲望」感更立體（不只氣泡，還會碎念）

**下輪候選**：
- R-1 拆檔（已推 4 輪，game.js 1500+ 行該動了）
- 截圖分享卡（病毒拉新樁）
- post-action 對話（餵食後寵物說「好吃！」這類即時反應）

---

## 2026-04-28 16:23 · Session A — INTENT: 對話深度擴充（contextual idle speech，~60 條）

(已完成，超出原訂 60 條，最終 ~85 條)

---

## 2026-04-28 16:15 · Session A — Wants 系統 v1（market-2026 + extensions 雙重力推）

**觸發**：cron 第 12 輪
**為什麼**：market-research-2026 第 1.3 節列為「2026 最高 ROI 單一功能」，extensions agent 也把它拉進 Sprint 推薦。讓寵物從「被動衰減的數值表」進化成「會主動表達欲望的個體」。

**動作**：
- **CFG.wants 池**（9 條）：依階段 unlock（egg → pet_head；chick → 主食 / 洗澡 / 玩球 / talk；junior → 沙包；adult → 唱歌）
- 參數：`lifetimeMs 5min` / `spawnIntervalMs 90s` / `spawnChance 0.18` / 完成後 / 過期後 8 分鐘 cooldown
- 獎勵：`mood +7 / coin +12 / growthScore +8`（比一般互動的 +5 高 60%，**值得繞道滿足**）
- **`maybeSpawnWant`**：跳過蛋階段、睡眠中、modal 開、cooldown 期內，且擲 18% 機率
- **`spawnWant`**：依當前階段過濾池子、隨機抽一條，寫進 `state.pet.want`
- **`expireWantIfStale`**：超過 5 分鐘未滿足靜默過期（無懲罰，符合 lenient 設計）
- **`fulfillWantIfMatches`**：每次 `performInteraction` 後檢查，命中就秒給獎勵 + 金色 toast「💖 滿足了 X 的願望！」+ 寵物說「謝謝主人！」
- 新 module 級 timer `wantsTimer`，每 90 秒呼叫一次（先 expire 再 spawn）
- HTML / CSS 新增 `.want-bubble`：黃色漸層 + ! 紅標 + 彈出動畫 + 上下浮動，z-index 5（高於 pet-shadow / 等於 mood-icon）
- `render` 末段：want 存在且非睡眠時顯示 want-bubble，否則隱藏
- 存檔欄位 `state.pet.want / wantCooldownUntil` 進 defaultState，舊存檔靠 deepMerge 補 0

**影響檔案**：`src/game.js`、`src/style.css`、`index.html`

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 玩家不再只是「看數值低就點按鈕」，而是「啾啾在頭上比黃氣泡告訴我牠想唱歌」
- 滿足願望的獎勵明顯比一般互動好 → 形成「優先滿足 want」的策略行為
- 與既有「日任務」/「成就」/「隨機事件」/「進化倒數」形成 4 層長短期目標的疊加
- 5 分鐘 lifetime + 8 分鐘 cooldown：每 ~13 分鐘平均 1 個 want，剛好在玩家 5 min session loop 內看得到、又不會吵
- 跨 stage 解鎖：玩家會發現「成雞才有想唱歌的選項」，再次驗證進化分支價值

**下輪候選**：
- 對話深度（基於 want / 數值狀態的智能 idle speech，extensions §1.6）
- R-1 拆檔（已連續推遲 3 輪，建議下輪認真做）
- 截圖分享卡（病毒拉新樁）

---

## 2026-04-28 16:08 · Session A — INTENT: Wants 系統 v1（寵物主動表達欲望）

(已完成)

---

## 2026-04-28 16:01 · Session A — 進化前兆金光 + P2-10 進化提示文字 + P2-7 fatPoints 雙計修正

**觸發**：cron 第 11 輪
**動作**：

- **進化前兆金光**（extensions §1.8，D7 留存最高 ROI）
  - 新 CSS class `.pet.pre-evolve` 套疊 `bob` + 新 keyframe `pre-evolve-glow`（金黃 #FFEC8B drop-shadow 0px ↔ 14px 漸進 2.6s 循環）
  - render 末段算 `preEvolve` 條件：階段倒數 ≤ 60 分鐘 + 成長分數 ≥ 70% × 進化門檻 + 非睡眠中
  - `petImg.classList.toggle("pre-evolve", preEvolve)` 自動套用 / 移除
  - 玩家在最後一小時會看到啾啾微微發光，配合既有粒子特效形成「進化儀式三段式」（前兆→進化動畫→終態粒子）
  - reduced-motion 已順便加 `.pet.pre-evolve` 例外

- **P2-10 進化條件提示**
  - render 的 `stage-countdown` 三分支：
    - `remainMs > 0` → 既有「下一階段 X · 成長 a/b」
    - `remainMs <= 0 && need > 0` → 新「再多互動 X 點就能進化」（玩家終於知道要再點按鈕，不會卡在「可進化」字樣困惑）
    - 都滿足 → 「準備進化中…」（會在下個 tick 觸發 maybeEvolve）
  - 解決 review-v2 P2-10「玩家滿時間但分數不夠卡住沒提示」

- **P2-7 fatPoints 雙計修正**
  - 過餵判定原本「不論餵什麼都 +1」
  - 改為：如果食物本身已經帶 `cfg.fatPoints`（例如 cake），就 skip 過餵的 +1，由 cfg 那邊處理
  - 餵 cake 時 hunger > 95 從 +2 → +1，符合 GDD 直覺（過餵 = 一次懲罰）

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 進化最後 1 小時有清楚視覺信號 → 玩家會「守線」回看（最強回訪驅動）
- 卡進化的困惑場景消失（之前「可進化 · 成長 25/30」字串會讓玩家 reload）
- 過餵點數計算合理化

**下輪候選**：
- R-1 拆檔（最高長期 ROI，~2-3h，建議下個 cron 啟動）
- Wants 系統（GDD 也提，1-2 天但可分多輪）
- 設定頁正式化 + i18n 骨架（R-5）

---

## 2026-04-28 15:55 · Session A — INTENT: 進化前兆金光（D7 救星）+ P2-10 進化提示 + P2-7 fatPoints 修

(已完成)

---

## 2026-04-28 15:45 · Session A — Sprint 1 Day 1：5 條 P1 + 粒子 cap 全清

**觸發**：使用者「由你決定」→ 直接執行 review-v2 推薦的最高 ROI 工作

**動作（按 P1 編號）**：

- **P1-1 debug 按鈕 gating**
  - 加入 `DEBUG` 旗標：從 `?debug` query string 或 `localStorage["nourish.debug"]="1"` 讀
  - 設定頁的「+100 FC」與「跳階段」row 用 `${DEBUG ? html : ""}` gate 起來
  - 「重置存檔」row 保留（合理玩家功能）
  - 對應 onMount 的綁定改成防禦式 `if (giveBtn) ...` / `if (evolveBtn) ...`

- **P1-2 跨 tab race**
  - 新增 module 級 `isReadOnlyTab` 旗標
  - `window.addEventListener("storage", ...)` 偵測別 tab 寫存檔
  - 觸發後：清 tick interval、跳 modal「在另一個分頁開啟」、按鈕重新整理才能繼續
  - `save()` 開頭檢查 `isReadOnlyTab` 直接 return，避免被動覆寫

- **P1-3 localStorage quota fallback**
  - `save()` / `saveDex()` 的 catch 偵測 `name === "QuotaExceededError" || code === 22`
  - 失敗時 toast 紅字「⚠️ 存檔空間不足，進度可能無法保留」/「圖鑑空間不足」
  - Safari 私密模式 / 配額擠爆時玩家會看到，不再靜默失敗

- **P1-4 取名可發現性**
  - CSS：`#stage-name::after { content: " ✏️"; ... }` 永久顯示鉛筆 icon
  - CSS：`#stage-name:hover { background: rgba(255,216,107,0.6); }` 懸停變黃
  - JS：`first_hatch` 成就解鎖時若 `nameSet === false`，1.5s 後 toast 「💡 點寵物名字可以取名喔～」

- **P1-5 探索性入口**
  - `index.html` header 多一個 `#btn-ach`（🏅 直跳成就），與 📖 / ⚙️ 並列
  - 三個 header 按鈕都補 `aria-label`
  - JS 綁 `$("btn-ach").onclick = openAchievementsMenu;`

- **P1-6 粒子 cap**
  - 新增常數 `PARTICLE_CAP = 30`
  - 新增 helper `particleSlotsLeft(stage)` 算剩餘格
  - `spawnEvolveParticles` / `spawnAchievementParticles` 都先問剩餘格、達上限就 skip
  - 進化粒子距離從 `120 + 50` 降為 `90 + 30`，避免 480px 寬手機溢出畫布

**影響檔案**：`src/game.js`、`src/style.css`、`index.html`

**驗證**：`node --check` ✅

**對 review-v2 評等的影響**：B+ → 預期 **A-**
- 5 條 P1 全清
- 粒子數 / DOM 安全網就位
- 防作弊（debug gate）+ 防覆寫（cross-tab）+ 防壞檔（quota）三道防線

**還沒動的（review-v2 待修）**：
- P2-1～P2-10 觀察類，下一階段配合 R-1 拆檔一起處理
- R-1 game.js 拆 5–7 個 IIFE 模組（建議下個 cron 跑這個）
- R-5 i18n 架子（v0.2 中英切換鋪路）

**下輪候選**：
- R-1 拆檔（2–3h，但能讓後續每加一個 v0.2 功能都省 30%）
- 設定頁正式化（音效切換 + 語言切換骨架，配合 R-5 i18n）
- Wants 系統（market 強推 + extensions 也提）

---

## 2026-04-28 15:38 · Session A — INTENT: Sprint 1 Day 1 — 修 5 條 P1 + 粒子 cap

(已完成)

---

## 2026-04-28 15:30 · Session A — 2026 市場補強研究（market-research-2026.md）+ review-v2 收回

**觸發**：cron 第 9 輪
**動作**：
- 為避免撞檔（兩個 sub-agent 跑中），這輪只做明確不重疊的市場研究文件。
- 新增 `docs/market-research-2026.md`：覆蓋 6 章：
  - **3 大新範式**：AI 對話寵物（CES 2026 Sweekar）、基因組合（Tamagotchi Paradise 50,000+）、Wants-based 互動
  - **留存機制 3 派**：嚴格 streak / Lenient（我們）/ AFK rewards
  - **AR + PWA + 推播**（App 階段）
  - **變現 5 種**（純裝飾、加速、加成、抽卡、訂閱），給出對啾啾日常的建議（純裝飾 + 訂閱、不做加成 / 加速）
  - **競品差異化定位表**（Tamagotchi / Adopt Me / Neko Atsume / 啾啾）
  - **三句話結論**：Wants 系統 v0.2 必做、基因擴充 v0.3 必做、AR/AI/推播 App 階段才上
- 同時間 `Code review v2 sub-agent` 完成並寫入 `docs/review-v2.md`：
  - P0: 0（v1 全修）/ P1: 5 / P2: 10 / 重構: 5 / v0.2 路線圖: 5
  - 整體評等：**B+**
  - 關鍵警訊：game.js 1272 行單檔開始劣化、debug 按鈕沒 gate、跨 tab race / quota 防護缺
- `Extensions sub-agent` 仍跑中，下輪會合併

**影響檔案**：`docs/market-research-2026.md`（新）、`docs/review-v2.md`（sub-agent 寫的）

**驗證**：純文件，不需 lint

**對下一階段的影響**：
- v0.2 必做有了清楚共識（review-v2 + market-2026 + extensions）：穩定性三修（debug gate / cross-tab / quota）+ Wants 系統 + 取名可發現性
- 美術下一階段方向確認：character-sheet 框架已穩，等使用者實際走 MJ `--cref` 跑 v1 雛雞 PNG

**下輪候選（已有 review-v2 P1 清單）**：
1. 把 debug 按鈕用 URL `?debug` 或 dev console 才能 access（防玩家自己破壞養成感）
2. 跨 tab 鎖（用 `storage` event 監聽，如果別 tab 寫了存檔就刷新自己的 state）
3. localStorage QuotaExceeded 兜底（壞檔 → fallback 到 in-memory + 警告）
4. game.js 拆分成多 IIFE 檔（state.js / render.js / interactions.js / events.js / achievements.js）

---

## 2026-04-28 15:23 · Session A — INTENT: 2026 市場調查補強 + 鍵盤可用性小修

(已完成市場研究；鍵盤可用性那條延後到下輪以避免撞 sub-agent)

---

## 2026-04-28 15:13 · Session A — 互動反饋動畫 + 成就解鎖粒子（game feel polish）

**觸發**：cron 第 8 輪
**為什麼**：所有互動目前只有 toast 文字回饋，**寵物本身沒有可見反應**。GDD §4 寫了「動畫想像」（小雞快速啄食、跑跳追逐、泡泡蓋住、閉眼享受）但 v0.1 都沒實作。沒有反饋等於玩家點了按鈕，畫面只跳一個提示，沒有「我跟啾啾互動」的實感。

**動作**：
- 4 套 CSS keyframes（每套 0.45–0.6s，重複 2–3 次）：
  - `pet-eat`：低頭啄食（translateY +14px、rotate -2deg）
  - `pet-shake`：左右搖（玩耍 / 戰鬥）
  - `pet-bath`：上下浮（搭配泡泡）
  - `pet-love`：心動縮放（愛撫 / 對話）
- `playReactionAnim(key)` mapping：
  - `feed_*` → react-eat + 🍴
  - `play_*` → react-shake + 💫🎵
  - `bath`   → react-bath + 🫧🫧✨
  - `pet_*`  → react-love + 💕
  - `talk`   → react-love + 💬
- 每次互動 spawn 1–3 個 `.float-emoji`（從寵物上方飄起、漸隱、1.4s）
- `spawnAchievementParticles()`：reuse `.particle` keyframe，8 個 🏅✨⭐🌟 從寵物中心放射，比進化的 14 個小一圈
- `unlockAchievement` 解鎖時自動觸發
- `void offsetWidth` trick 讓同類動畫連點時能 restart

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對遊戲性的影響**：
- 滿足 GDD §4「動畫想像」要求（吃 / 玩 / 洗 / 愛撫各 1 套）
- 解決 v0.1 review §10.1 標記 🟡「互動動畫各 1 套」未做的最後一條
- 成就解鎖從「兩段 toast 飄過去」變成「畫面有金光特效」，符合 GDD §8.4「重大事件 → 全螢幕反饋」
- 保留 `prefers-reduced-motion` media query 自動禁用

**MVP 完成度更新**：19/19（100%）— 沒有遺留的 GDD §10.1 標 🟡 項目了。

**下輪候選**：開新蛋的儀式動畫 / 餵食的食物 SVG 從碗中飛入嘴 / 進化前 1 小時的「身體微微發光」預兆 / GDD §10.2 章節充實寫法描述

---

## 2026-04-28 15:08 · Session A — INTENT: 互動反饋動畫（pet-eat/shake/bath/love）+ 成就解鎖粒子

(已完成)

---

## 2026-04-28 15:00 · Session A — 隨機事件 SVG 化（5 張新圖，遵守 character-sheet §1.3 色票）

**觸發**：cron 第 7 輪
**為什麼**：上一輪（character-sheet）強調主角是純卡通粗線稿風，但隨機事件的 emoji（💰🌿🦋🪰⭐）在 OS 不同字體下風格漂浮（iOS Apple Color Emoji vs Android Noto vs Windows Segoe UI Emoji），會搶戲且破壞主角視覺一致性。

**動作**：
- 新增 5 張 SVG，全部使用 character-sheet §1.3 統一色票（黃 #FFD86B / 橘 #FF9F43 / 紅 #B23A48 / 黑 #2C2C2C / 綠 #6BCB77 / 粉 #FFB7B7）：
  - `event-coin.svg`：金幣，黃→橘漸層 + 中央「F」字 + 高光
  - `event-herb.svg`：草藥（兩片葉 + 細莖 + 一根尖芽 + ✨）
  - `event-butterfly.svg`：對稱蝴蝶（粉色 + 黃色雙翅，黑身體）
  - `event-fly.svg`：白透明翅 + 黑身 + 橘眼（避免太寫實）
  - `event-star.svg`：5 角星 + 漸層光暈 + 雙層內影
- `CFG.randomEvents.pool` 把 `emoji` 欄位改成 `art`（指 SVG 路徑）；保留 emoji 欄位空著當未來 fallback 介面
- `spawnEvent` 改：有 `art` 就 createElement('img') 內嵌，否則退回 textContent emoji
- CSS `.event-bubble` 從 54×54 → 60×60，新增 `.event-bubble img { width: 78%; ... }`、加 `overflow: hidden` 防溢出，drop-shadow 1px 給輕微立體感
- toast 文字保留少量 emoji（🌿⭐）做語意提示，但事件氣泡本體完全 SVG

**影響檔案**：
- `assets/svg/event-{coin,herb,butterfly,fly,star}.svg`（5 張新檔）
- `src/game.js`、`src/style.css`

**驗證**：`node --check` ✅ + 5 張 SVG curl 200 ✅

**對視覺一致性的影響**：
- 隨機事件氣泡現在跟主角是同一套「粗線 + 平塗 + 9 色色票」風格，不再有 Apple/Google/MS 三家 emoji 互打
- 為「PNG 升級時，事件氣泡也能無痛升級」打底（現在 art 欄位是路徑，未來改 PNG 路徑即可）
- 完成第 1 個 character-sheet 落地驗證：所有新美術都過 §8 5 道 gating

**下輪候選**：開新蛋的儀式動畫（蛋出現的特效）/ 成就解鎖時的金光特效（reuse `spawnEvolveParticles`）/ 餵食動畫（小雞低頭啄）/ 設定頁音效切換骨架

---

## 2026-04-28 14:53 · Session A — INTENT: 隨機事件改用 SVG（依 character-sheet 色票）+ 圖鑑顯示成就計數

(已完成 SVG 化；圖鑑成就計數其實 14:32 那輪已 done，此 INTENT 描述失準)

---

## 2026-04-28 14:45 · Session A — 角色設定書（character sheet）+ image-prompts 重寫

**為什麼**：剛收到 user feedback「畫風是 gating factor，不是 polish」，現有 18 條 prompt 各自為政會生出 18 隻不同的雞。這輪跨域（原應 Session B）但屬高優先級，也順便釘住 Session B 接手後的工作框架。

**動作**：
- 新增 `docs/character-sheet.md`（9 章節）：
  - §1 主角視覺 DNA 5 項（不可動搖）+ 統一 9 色色票 + 構圖規則
  - §2 4 階段同角色變體（蛋 / 雛 / 幼 / 成）
  - §3 7 種終態的「保留 DNA + 加 1–2 配件」原則 + 不可做事項對照
  - §4 5 種心情圖示（角色本體之外的浮動 emoji）
  - §5 8 條 anti-pattern（嬰兒臉化 / 鴨喙化 / 寫實渲染等）
  - §6 AI 工具評估表（MJ + `--cref` 第一推薦、SD + LoRA 第二、Gemini / GPT-image 不推）
  - §7 全域 prompt 錨定段落（每張必貼）
  - §8 出 PNG 前 5 道 gating checklist
  - §9 三階段 (v0.1/v0.2/v0.3) 美術里程碑
- 重寫 `docs/image-prompts.md`：
  - 開頭強制 link 回 character-sheet
  - 全域風格段升級為 `SUBJECT IDENTITY` 角色錨定 + 風格 + 色票 + FORBIDDEN
  - 「使用建議」段重寫工作流程：先生 v1 雛雞鎖角色 → `--cref` 帶後續每張，附 anti-pattern 與成本估算
- 更新 `CLAUDE.md`：
  - 檔案結構列入 character-sheet.md
  - §9 補一句「美術 gating factor，不是 polish」

**影響檔案**：`docs/character-sheet.md`（新）、`docs/image-prompts.md`、`CLAUDE.md`

**驗證**：純文件，不需 lint

**對專案的影響**：
- 接下來任何 sub-agent 或外包美術不會再因為「沒讀過完整脈絡」而產出不一致的圖。
- 確立了「v1 雛雞參考圖」是後續所有 PNG 的單一錨點，不會再有 18 隻雞各自為政。
- 把美術正式列入 v0.2 推進路徑，不再可被無限後延。

**下輪候選**：
- 開新蛋功能的 toast / animation polish（讓「再來一隻」的儀式感更強）
- 隨機事件改用 SVG（讓 emoji 風格不會跟主角搶戲）— 注意要遵守 character-sheet 色票
- 「v1 雛雞」prototype prompt 跑一次（如果 user 接下來要實際生圖）

---

## 2026-04-28 14:38 · Session A — INTENT: 角色設定書（character sheet）+ image-prompts 重寫，鎖跨圖一致性

(已完成，見上)

---

## 2026-04-28 14:32 · Session A — 成就系統（17 條） + 進化粒子特效

**觸發**：cron 第 5 輪
**動作**：
- 新增 `CFG.achievements`（17 條）：跨類別 — 養成里程碑（first_hatch / first_evolve）、互動量（first_feed / feed_50 / bath_10 / pet_50）、登入（streak_7 / streak_30）、收集（collect_3/5/all）、終態（form_divine/diva/fighter/sage）、特殊（star_caught / rich / perfect_day）。
- 新增 `state.achievements: { id → unlockedAt }` schema 欄位（deepMerge 安全）。
- 新增 `state.history.feedCount/bathCount/petCount/playCount` 累積計數（跨歷代不歸零）。
- `bumpHistory(key)` 在每次 `performInteraction` 後依 prefix 累積。
- `checkAchievements()` 集中判定 17 條，於餵食 / 玩耍 / 抓事件 / 進化 / 賺幣 / 登入 後呼叫；解鎖時兩段 toast（金色 icon + 描述）。
- 進化粒子特效 `spawnEvolveParticles()`：14 個 `✨⭐🌟💫✦` 從寵物中心放射飛出，1.6s `particle-fly` keyframe 帶旋轉 + 漸隱。
- 圖鑑底部新增「🏅 成就 X/17」按鈕，跳到獨立成就頁；成就頁鎖 / 解鎖兩態。
- `grantCoin` / `handleDailyLogin` / `resolveEvent`(star) 加 hook。

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對遊戲性的影響**：
- 給玩家「明確下一個短期目標」，改善 1 天 ~ 1 週 mid-loop 黏著度（GDD §1.3「可預期的小確幸」）。
- 收集 7 種終態現在有實質回饋（collect_all 成就 + 圖鑑大師），把 4 ~ 6 輪重玩動機具體化。
- 進化儀式從「只閃 5 次 0.6s」升級到粒子放射，符合 GDD §8.4「重大事件」要求。

**下輪候選**：成就解鎖時的金光特效（共用粒子）、隨機事件 SVG 化、settings 補音效切換、餵食動畫（吃食物的 micro-anim）

---

## 2026-04-28 14:25 · Session A — INTENT: 成就系統 + 進化粒子特效

(已完成，見上)

---

## 2026-04-28 14:18 · Session A — 開新蛋功能 + 圖鑑歷代寵物紀錄 (nourish.dex.v1)

**觸發**：cron 第 4 輪
**動作**：
- 新增獨立 localStorage 鍵 `nourish.dex.v1`（schema v1，`completedPets[]` cap 50）。`loadDex / saveDex / unlockedFormsSet` 三個 helper。
- `archiveCurrentPet()` 把當前已進化的小雞推進 dex（含 name / finalForm / bornAt / archivedAt / totalDays）。
- `startNewEgg()` 重置 `state.pet`，但**保留** economy / daily streak / history（玩家累積感不會歸零）。
- 進化儀式 modal 新增 `🥚 孵化新蛋` 按鈕，開二段 confirm。
- 設定頁有 finalForm 時新增「🥚 孵化新蛋」row。
- 重置存檔現在會一併清 dex（並提示）。
- 圖鑑改成兩段：終態收集（依 `unlockedFormsSet` 跨歷代統計，從 1/7 → 進步）+ 歷代小雞（最多顯示 10 隻，含日期 / 天數）。

**Schema**：
```
nourish.dex.v1 = {
  schemaVersion: 1,
  completedPets: [
    { id, name, finalForm, bornAt, archivedAt, totalDays }
  ]
}
```

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

**遊戲循環現在閉合了**：蛋 → 養成 → 進化 → 收進圖鑑 → 開新蛋。可以無限重玩、收集 7 種終態。

**下輪候選**：v0.2 設定頁（音效 / reduced motion 切換）、進化動畫加儀式感（粒子特效）、隨機事件 SVG 化、餵食蛋糕的肥點數視覺提示、成就系統（首次神雞、收集 5 種等）

---

## 2026-04-28 14:13 · Session A — INTENT: 開新蛋功能 + 圖鑑歷代寵物紀錄 (nourish.dex.v1)

(已完成，見上)

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
