# 養成小雞 GDD（Game Design Document）

> 版本：v0.1（規劃稿）
> 最後更新：2026-04-28
> 文件擁有者：企劃
> 階段：第一階段 Web，第二階段 App（PWA → Native Wrapper）

---

## 1. 遊戲概念

### 1.1 一句話 Pitch
**「在瀏覽器分頁旁陪你工作的小雞，會肚子餓、會撒嬌、會長大，五分鐘照顧一次就能養出獨一無二的牠。」**

### 1.2 目標玩家

| 維度 | 描述 |
|---|---|
| 主要年齡層 | 18–35 歲 |
| 次要年齡層 | 10–17 歲（學生）、35–45 歲（懷舊世代） |
| 性別比 | 預估 女:男 = 6:4 |
| 使用情境 | 上班/上課工作分頁旁掛著、午休片刻、睡前 5 分鐘、通勤等紅燈 |
| 心理畫像 | 喜歡輕度療癒、不想要 PvP 壓力、對「自己養出來的東西」有情感投射、會在社群炫耀寵物外觀 |
| 關鍵 Reference | 拓麻歌子（Tamagotchi）、Neko Atsume、Adopt Me、旅行青蛙 |

### 1.3 玩家能得到的情感體驗

1. **陪伴感**：不會孤單，分頁打開就有「另一個生命」在動
2. **責任感（輕量）**：照顧得好會有成就感，但忘了照顧也不會殘忍懲罰
3. **意外感**：進化分支 + 隨機事件，每隻小雞都不一樣
4. **炫耀感**：終態分支多元（神雞、戰鬥雞、醜雞），可截圖分享
5. **可預期的小確幸**：每天回來都有一點小變化、小驚喜

> **避免的情緒**：焦慮（強迫上線）、罪惡感（沒照顧就死掉）、付費壓力。

---

## 2. 核心循環（Core Loop）

### 2.1 30 秒循環（Micro Loop）
玩家打開分頁 → 看狀態條 → 發現「飢餓」偏低 → 點餵食 → 看餵食動畫（2 秒）→ 心情值上升 → 小雞發出滿足音效 → 玩家露出微笑 → 關掉分頁。

### 2.2 5 分鐘循環（Session Loop）
1. 觀察四項狀態（飢餓 / 心情 / 清潔 / 體力）
2. 處理最低的狀態（餵食 / 玩耍 / 洗澡 / 睡覺）
3. 領取「飼料幣」日常產出
4. 嘗試一個小互動（愛撫、對話）
5. 看 1 個隨機事件（70% 機率觸發）

### 2.3 1 天循環（Daily Loop）
- 上線 3–5 次，每次 1–5 分鐘
- 累計「成長分數」（見 §5）
- 完成 1 個「每日小任務」（如：餵食 3 次、洗澡 1 次）
- 觀察小雞外觀微變（毛色、體型、表情）

### 2.4 1 週循環（Weekly Loop）
- 蛋孵化 → 雛雞 → 幼雞 → 成雞，約 5–7 天可達成雞
- 進化分支揭曉，看到自己養出的獨特終態
- 可選擇「再開新蛋」（保留舊雞至圖鑑）或「繼續陪伴成雞」（加入老年互動）

---

## 3. 寵物狀態系統

### 3.1 四大數值總覽

| 數值 | 範圍 | 自然衰減（每分鐘） | 主要影響 |
|---|---|---|---|
| 飢餓（Hunger）| 0–100 | -0.40（24 小時從 100 降至 ~42） | 低 → 心情下降、成長停滯 |
| 心情（Mood）| 0–100 | -0.25（24 小時從 100 降至 ~64） | 低 → 進化分支偏負面、外觀憔悴 |
| 清潔（Clean）| 0–100 | -0.15（24 小時從 100 降至 ~78） | 低 → 心情額外 -0.1/min、外觀變髒 |
| 體力（Energy）| 0–100 | -0.30（活動中）/ +0.50（睡眠中）| 低 → 無法玩耍、必須睡覺才能恢復 |

> 數值皆為浮點，UI 顯示取整數。0 為最差，100 為最佳。
> 預設初始值：四項皆 80。

### 3.2 數值門檻與行為

#### 飢餓
- **>70**：🟢 飽足，外觀正常，心情自然 +0.05/min 加成
- **40–70**：🟡 普通，無加成無懲罰
- **20–40**：🟠 餓了，小雞發出叫聲提示，心情衰減 +0.10/min
- **<20**：🔴 飢餓警告，外觀變憔悴（眼神無光、體型縮水），心情衰減 +0.20/min，停止累積成長分數
- **=0**：超過 6 小時不處理 → 進入「虛弱」狀態（不會死，但成長暫停且需 30 分鐘照顧才能解除）

#### 心情
- **>70**：🟢 開心，外觀有愛心特效，成長分數 +20% 加成
- **40–70**：🟡 普通
- **20–40**：🟠 鬱悶，會有嘆氣動畫，互動效果 -25%
- **<20**：🔴 沮喪，畫面飽和度降低 30%，所有互動效果 -50%
- **=0**：超過 12 小時 → 進化機率偏向「醜雞」分支

#### 清潔
- **>70**：🟢 乾淨，毛髮蓬鬆有光澤
- **40–70**：🟡 普通
- **20–40**：🟠 髒髒的，外觀有泥點，心情衰減 +0.10/min
- **<20**：🔴 很髒，全身灰撲撲，會吸引「果蠅」隨機事件，心情衰減 +0.20/min

#### 體力
- **>70**：🟢 活力充沛，玩耍互動效果 +20%
- **40–70**：🟡 普通
- **20–40**：🟠 疲倦，玩耍效果 -30%，會打哈欠
- **<20**：🔴 累垮，無法玩耍（按鈕灰掉），必須睡眠
- **=0**：自動進入「強制睡眠」5 分鐘，期間不可互動

### 3.3 數值間的連動

```
飢餓<20 ──→ 心情額外 -0.20/min
清潔<40 ──→ 心情額外 -0.10/min
心情<20 ──→ 全互動效果 -50%
體力<20 ──→ 玩耍 disabled
連續 3 項 <40 ──→ 觸發「悲慘狀態」事件，外觀全憔悴
全部 >70 持續 1 小時 ──→ 觸發「幸福時刻」事件，獲得稀有飼料幣 *2
```

---

## 4. 互動行為

### 4.1 餵食（Feed）

| 食物 | 解鎖階段 | 飢餓 | 心情 | 清潔 | 體力 | 飼料幣 | Cooldown | 備註 |
|---|---|---|---|---|---|---|---|---|
| 基礎飼料 | 蛋 | +25 | +2 | -3 | 0 | 0（無限）| 30 秒 | 萬年備胎 |
| 玉米粒 | 雛雞 | +35 | +5 | -3 | +5 | 5 | 60 秒 | 主食 |
| 小蟲蟲 | 幼雞 | +40 | +10 | -8 | +10 | 8 | 90 秒 | 偏愛食物，髒 |
| 莓果 | 幼雞 | +20 | +15 | 0 | +5 | 10 | 60 秒 | 提心情用 |
| 蛋糕 | 成雞 | +50 | +25 | -10 | +0 | 25 | 5 分鐘 | 過量會「胖雞」+1 |
| 神祕草藥 | 隨機事件掉落 | +30 | +5 | +5 | +30 | 0 | 1 次性 | 限定 |

- **過餵懲罰**：飢餓>95 時繼續餵食 → 心情 -10、清潔 -15、累積「肥胖點數」+1（影響進化）
- **動畫想像**：小雞快速啄食碗中食物，3 次啄擊後抬頭打嗝，2 秒總長

### 4.2 玩耍（Play）

| 遊戲 | 解鎖階段 | 心情 | 體力 | 清潔 | 飼料幣 | Cooldown | 累積「戰鬥點數」 |
|---|---|---|---|---|---|---|---|
| 追逐毛球 | 雛雞 | +15 | -10 | -5 | +3 | 2 分鐘 | 0 |
| 玩具蟲蟲 | 幼雞 | +20 | -15 | -3 | +5 | 3 分鐘 | +1 |
| 打沙包（迷你戰鬥）| 幼雞 | +25 | -25 | -10 | +8 | 5 分鐘 | +3 |
| 思考拼圖 | 成雞 | +18 | -8 | 0 | +6 | 4 分鐘 | 0（累積「智力點數」+2） |
| 唱歌比賽 | 成雞 | +30 | -15 | 0 | +10 | 6 分鐘 | 0 |

- **體力<20 時所有玩耍互動禁用**
- **動畫想像**：小雞跑跳追逐物品，4 秒動畫，結束後喘氣 2 秒

### 4.3 洗澡（Bath）

- 效果：清潔 +60、心情 -5（小雞不喜歡洗澡，但乾淨後 +10）→ 淨值 +5
- 體力 -5
- Cooldown：10 分鐘
- 飼料幣：3
- 解鎖：雛雞起
- **動畫**：泡泡浴桶，小雞被泡泡蓋住，5 秒後跳出來抖水

### 4.4 睡眠（Sleep）

- 主動睡眠：玩家點擊「關燈」按鈕
- 效果：體力 +0.50/min（恢復速率為平時的負衰減反向）、心情 +0.10/min
- 睡眠中：無法做其他互動（按鈕灰掉），可隨時喚醒（但會 -5 心情）
- 自動睡眠：體力=0 時強制 5 分鐘
- **動畫**：背景變暗、月亮升起、小雞蜷縮、Z Z Z 飄字

### 4.5 愛撫 / 對話（Pet & Talk）

| 互動 | 心情 | Cooldown | 備註 |
|---|---|---|---|
| 摸頭 | +3 | 30 秒 | 無消耗，可頻繁觸發 |
| 摸肚子 | +5 | 1 分鐘 | 機率觸發「咯咯笑」特殊動畫（10%） |
| 對話（預設語句池）| +2 | 20 秒 | 小雞回應隨機 emoji 氣泡 |
| 取名（一次性）| +10 | 永久 | 命名後回應該名字 |

- 愛撫類設計為「無消耗的情感互動」，主要用來補心情、增加陪伴感
- **動畫**：小雞閉眼享受、尾巴搖動

### 4.6 互動行為總表（cooldown 對照）

| 互動 | Cooldown | 體力消耗 | 飼料幣消耗 | 主要 buff |
|---|---|---|---|---|
| 基礎飼料 | 30s | 0 | 0 | 飢餓 |
| 玉米粒 | 60s | 0 | 5 | 飢餓 |
| 小蟲蟲 | 90s | 0 | 8 | 飢餓+心情 |
| 莓果 | 60s | 0 | 10 | 心情 |
| 蛋糕 | 5min | 0 | 25 | 大幅飢餓+心情 |
| 追逐毛球 | 2min | 10 | 3 | 心情 |
| 玩具蟲蟲 | 3min | 15 | 5 | 心情 |
| 打沙包 | 5min | 25 | 8 | 心情+戰鬥 |
| 思考拼圖 | 4min | 8 | 6 | 心情+智力 |
| 唱歌比賽 | 6min | 15 | 10 | 大幅心情 |
| 洗澡 | 10min | 5 | 3 | 清潔 |
| 摸頭 | 30s | 0 | 0 | 微心情 |
| 摸肚子 | 1min | 0 | 0 | 心情 |
| 對話 | 20s | 0 | 0 | 微心情 |

---

## 5. 成長階段與進化分支

### 5.1 階段時程

| 階段 | 時長 | 累積條件（成長分數）| 可互動範圍 |
|---|---|---|---|
| 蛋（Egg）| 6 小時 | 30 分 | 只能愛撫、對話、保溫（清潔即視為保溫）|
| 雛雞（Chick）| 1 天 | 200 分 | + 餵食、洗澡 |
| 幼雞（Junior）| 2 天 | 600 分 | + 玩耍 |
| 成雞（Adult）| 永久 | 1500 分 → 進化 | 全互動 |

> **總時程**：約 5–7 天可達進化判定，符合「一週循環」設計。

### 5.2 成長分數累積規則

成長分數 = Σ 各互動權重，每分鐘結算一次（背景）：

| 行為 | 分數權重 |
|---|---|
| 飢餓>70 | +1/min |
| 心情>70 | +1.5/min |
| 清潔>70 | +0.5/min |
| 體力>70 | +0.5/min |
| 全部>70（幸福時刻）| 額外 +2/min |
| 飢餓<20 | -1/min（不會扣到負，但停滯）|
| 心情<20 | -1.5/min |
| 進行任一互動 | +5/次 |
| 連續 24 小時無上線 | -50（最多扣一次）|

### 5.3 進化分支判定

成長分數達 1500 時，根據「**累積特徵點數**」決定終態（不是單一門檻，而是相對最大者勝出）：

| 終態 | 主要判定條件 | 機率分布範例 |
|---|---|---|
| 健康成雞（Healthy）| 平均狀態高、各點數平衡 | 預期 35% |
| 胖雞（Fatty）| 肥胖點數 ≥10（過餵）| 預期 15% |
| 戰鬥雞（Fighter）| 戰鬥點數 ≥30（打沙包多）| 預期 15% |
| 智慧雞（Sage）| 智力點數 ≥30（拼圖多）| 預期 10% |
| 醜雞（Uggo）| 心情<20 累積時間 >12 小時 OR 清潔長期低 | 預期 10% |
| 神雞（Divine）| 全狀態>80 維持 24 小時 + 進化分數 >2000 | 預期 5%（罕見）|
| 歌姬雞（Diva）| 唱歌比賽 ≥20 次 | 預期 10% |

> **設計原則**：每個分支都「正面」（連醜雞也有獨特賣點，可以走「迷因路線」），避免玩家覺得自己養失敗。
> **分支不可逆**：進化後固定，但可開新蛋。

### 5.4 各階段外觀差異想像

- **蛋**：靜態橢圓，輕微晃動，有裂痕進度條
- **雛雞**：黃色絨毛球，大眼睛，身體 1/3 大小
- **幼雞**：羽毛開始長，雞冠出現，2/3 大小
- **成雞各分支**：
  - 健康：白羽紅冠標準款
  - 胖雞：球體化、雙下巴
  - 戰鬥雞：肌肉、頭巾、戰鬥姿態（per CLAUDE.md TA 軟化「元氣 / 運動感」非「攻擊感」）
  - 智慧雞：眼鏡、書卷氣
  - 醜雞：歪嘴、亂毛，但有粉絲群
  - 神雞：金色光環、發光特效
  - 歌姬：麥克風、彩虹尾羽
  - 美食家雞（v0.2 新加）：粉色廚師帽、小圍裙、🍰 motif（cottagecore-coquette 軸）
  - 探險家雞（v0.3 新加）：背包 + 粉色 bandana + 地圖 / 指南針（cottagecore-adventure 軸）
  - 暖心雞（v0.4 新加）：圓潤體型 + 半閉眼睛 + 粉色圍巾 / 披肩 + 🤍 浮動小心 + 略向側傾「靠著主人」姿勢（cottagecore-cuddly 依戀軸）

### 5.5 美學軸地圖（iter#208 sync，含 v0.4 ship 更新）

GDD 設計 10 個 finalForm + 35 events（22 regular + 12 seasonal）+ 21 accessories，內部依 9 個美學軸組織。每軸至少 form / event / accessory ≥ 3 件對齊 TA「choose your aesthetic axis」承諾。

| 美學軸 | finalForm | regular event | seasonal event | accessory | 件數 | 飽和度 |
|-------|----------|---------------|---------------|----------|------|--------|
| **coquette / 美食家** | gourmet | tea / macaron | carnation（母親節）| chef_hat / strawberry_clip | 6 | ★★★★ |
| **cottagecore** | （fallback to healthy） | butterfly / mushroom / petal / herb / **seed** | sakura（春日）| flower / pin_butterfly / lace_collar | 9 | ★★★★ |
| **智慧 / sage** | sage | book / **message_bottle** | — | glasses_thin | 4 | ★★★ |
| **balletcore** | diva | rose_bouquet / **pointe_shoe** | — | ribbon_tie | 4 | ★★★ |
| **fairycore** | divine | dewdrop / **moonlight** | — | wings_fairy | 4 | ★★★ |
| **cleangirl** | healthy | bubble / **towel** | — | blush | 4 | ★★★ |
| **y2k / digital nostalgia** | （fallback to healthy） | pixel_heart | redenvelope（春節）| star_clip / cd_pendant | 4 | ★★★ |
| **元氣 / 運動感** | fighter | rainbow / **confetti_pop** | pinwheel（兒童節）/ rainbow_heart（Pride 月）| party_hat | 6 | ★★★★ |
| **boho（v0.4 新軸）** | （fallback to healthy）| **dried_herbs** | — | **fringe_ribbon / straw_hat** | 3 | ★★★ |

**v0.4 主要變動**（iter#196-207）：
- **+ warmheart form 第 10 個 finalForm**（per-pet petCount >= 50，cottagecore 依戀軸 — 玩家 pet_head/belly/talk 累積路徑）
- **+ 6 個 axis-second-event**（iter#198-203）：seed / towel / message_bottle / pointe_shoe / moonlight / confetti_pop — 把 7 個次薄軸從 3 件提升到 4 件
- **+ boho 軸完整 ship**（iter#205-207）：fringe_ribbon / dried_herbs / straw_hat 達 GDD §5.5 軸成形 ≥ 3 件門檻
- **9/9 美學軸全部 ≥ 3 件 ✅**

**元氣軸歸屬釐清**（iter#195 確認）：
- **fighter form** = 元氣軸主 form（CLAUDE.md TA 軟化策略：「戰鬥雞」改稱「元氣雞」/「Spirited Chick」/「活力 max」/「跳跳活蹦」）
- **party_hat** = 元氣軸 accessory（生日派對 / 慶祝 narrative，跟 fighter 元氣高頻情境合）
- **rainbow + confetti_pop（regular events）** = 元氣軸 atmospheric uplift / kinetic burst 雙模 — narrative arc 完整
- **pinwheel + rainbow_heart（seasonal）** = 元氣軸節日延伸 — 兒童節童玩 + Pride Month 多元接納
- **這軸暫不再加 form**（fighter 已是核心代表）— 元氣軸跟 cottagecore 不同：cottagecore 是廣度橫向（事件 + 配件 = 9 件無 form 主代表），元氣軸是深度縱向（form 主導 + 6 件支援）

**form-less 軸的設計選擇**（cottagecore / y2k / boho 三軸）：
- 三軸刻意 form-less — 它們是「環境 / 風格 atmosphere」軸，不該綁特定終態
- 玩家任何 form 都能透過配件 + 事件感受該軸氛圍 — 軸是「玩法 path」而非「進化結果」
- 對齊 GDD §5.5 設計哲學：**form = 角色身份（識別感）/ axis = 美學選擇（自由度）**
- 注意 boho 軸 v0.4 ship 後同樣 form-less 起手 — 等玩家累積後 v0.5 可考慮追加 form（如「漂泊者雞」keyed off ownedAccessories 多樣性）

**9 軸覆蓋演進時序**（per iter logs）：
- iter#100 起點：5 軸有 form（healthy / fighter / sage / diva / divine）+ fatty / ugly 兩個失衡軸
- iter#132（下午茶）→ iter#172（pixel_heart）：補完 8 軸 event 全覆蓋
- iter#156（gourmet）→ iter#183（explorer）→ **iter#196（warmheart）**：v0.2/v0.3/v0.4 form 擴充至 10
- iter#185（pinwheel）：12 個月 seasonal 全覆蓋
- **iter#198-203（6 輪 axis-second-event batch）**：所有有 form 軸都達 ≥ 4 件
- **iter#205-207（boho 軸 ship）**：第 9 軸完整成形

**v0.5+ 美學軸候選方向**：
- **新軸 candidate**：minimalist（極簡 / 灰白）/ kawaii-decora（過度可愛堆疊）/ dark academia（深色學院風 — sage 軸延伸） — 等 v0.4 飽和度測試 + 玩家行為數據後再啟動
- **既有軸補強**：所有軸都達 ≥ 3 件成形，後續軸補強重點 = seasonal 補完（智慧 / balletcore / fairycore / cleangirl / boho 仍缺 seasonal event）vs 內容深化（form-less 軸補 form？）
- **跨軸 mixing-mode** v0.5 預留 idea：玩家配戴超過 1 軸 accessory + 觸發超過 1 軸 event → 解鎖「跨軸混搭成就」（acrosshatch achievement system）— 強化「choose your aesthetic axis」承諾的彈性面

---

## 6. 經濟系統（輕量）

### 6.1 飼料幣（Feed Coin / FC）

唯一軟貨幣，**MVP 不引入硬貨幣或內購**。

#### 獲取來源
| 來源 | 數量 | 頻率 |
|---|---|---|
| 每日登入獎勵 | 30 FC | 每 24 小時 |
| 互動產出（玩耍、餵食）| 3–10 FC | 每次互動 |
| 完成每日任務 | 20 FC | 每日 1 次 |
| 隨機事件（撿到蛋）| 5–50 FC | 約每 3 小時 1 次 |
| 進化（達成終態）| 100 FC | 一次性 |
| 連續登入獎勵 | 第 7 天 +50、第 30 天 +200 | 累積 |

#### 消耗用途
| 用途 | 價格 |
|---|---|
| 玉米粒 | 5 FC |
| 小蟲蟲 | 8 FC |
| 莓果 | 10 FC |
| 蛋糕 | 25 FC |
| 洗澡 | 3 FC |
| 玩耍互動 | 3–10 FC |
| 裝飾物（v0.2）| 50–500 FC |

### 6.2 經濟平衡假設
- 每日活躍玩家平均產出 ~80 FC，平均消耗 ~60 FC
- 累積率 +20 FC/day → 兩週可累積 280 FC，足夠買 v0.2 裝飾物

---

## 7. 離線時間流動

### 7.1 衰減規則

當玩家離線時，狀態值依然以「**離線衰減速率**」下降：

| 數值 | 線上衰減 | 離線衰減 | 倍率 |
|---|---|---|---|
| 飢餓 | -0.40/min | -0.20/min | 0.5x |
| 心情 | -0.25/min | -0.15/min | 0.6x |
| 清潔 | -0.15/min | -0.10/min | 0.67x |
| 體力 | -0.30/min（活動）| 0 ~ +0.30/min（視為睡眠）| 反向 |

> **設計理由**：離線時衰減較慢（給玩家喘息空間），體力反而會回復（小雞自己睡覺）。

### 7.2 離線懲罰上限

- **最大離線衰減時間：12 小時**
- 12 小時後所有狀態值「凍結」於當下，不再衰減
- 體力最多回復至 100 後停止
- 防止玩家放假一週回來「死光光」的挫折感

### 7.3 成長分數離線處理

- 離線期間「不累積」也「不扣分」（豁免條款）
- 例外：連續 24 小時未上線 → 一次性扣 50 分（鼓勵每日上線，但懲罰輕微）
- 進化倒數計時「正常進行」（不會因離線延遲進化）

### 7.4 回歸時的問候 UX

```
玩家回來時依離線時長顯示：

< 30 分鐘 → 不顯示，靜默更新
30 分鐘 – 3 小時 → 「歡迎回來！咕咕～」+ 短動畫
3 – 8 小時 → 「主人你回來了！我有點餓了」+ 狀態異常項目高亮
8 – 12 小時 → 「主人……我以為你不要我了……」+ 心情額外 -5
> 12 小時 → 「主人！！我等了好久！」+ 大哭動畫（但狀態凍結，不再扣）+ 補償 20 FC
```

---

## 8. UI / UX 結構

### 8.1 主畫面 Wireframe（文字版）

```
┌─────────────────────────────────────────────────┐
│  [Logo小雞]  養成小雞  v0.1     [⚙設定] [📖圖鑑] │  ← Header (40px)
├─────────────────────────────────────────────────┤
│ 🍗 飢餓  ████████░░  82                          │
│ 💖 心情  ██████░░░░  65   飼料幣: 💰 245         │  ← 狀態列 (60px)
│ 🛁 清潔  ███████░░░  78                          │
│ ⚡ 體力  █████░░░░░  52                          │
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│                  🐤                              │
│              （小雞舞台）                        │  ← 主舞台 (400px)
│           階段：幼雞 Day 3                       │
│           進化倒數：1d 14h                        │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  [🍗餵食] [🎮玩耍] [🛁洗澡] [😴睡眠] [💝愛撫]   │  ← 主操作列 (80px)
├─────────────────────────────────────────────────┤
│  📋 今日任務：餵食 3/5 次  完成可得 20 FC        │  ← Footer (40px)
└─────────────────────────────────────────────────┘
```

### 8.2 各區塊規格

| 區塊 | 位置 | 高度 | 內容 |
|---|---|---|---|
| Header | 上 | 40 px | Logo、版本、設定、圖鑑入口 |
| 狀態列 | 上 | 60 px | 4 條進度條 + 數字 + 飼料幣 |
| 主舞台 | 中 | 400 px | 小雞動畫、背景、進化倒數、階段名 |
| 主操作列 | 下 | 80 px | 5 顆主互動按鈕（橫向排列）|
| 任務 Footer | 最下 | 40 px | 每日任務進度條 |

### 8.3 互動子選單（點擊餵食 / 玩耍後）

點擊「餵食」→ 彈出半透明覆蓋層，顯示食物選單：

```
┌──────────── 餵食 ────────────┐
│  [🌽 玉米粒]    5 FC          │
│  [🪱 小蟲蟲]    8 FC          │
│  [🍓 莓果]     10 FC          │
│  [🎂 蛋糕]     25 FC          │
│  ─────────────────────────    │
│  [🥣 基礎飼料]  免費（30s CD）│
│                       [關閉] │
└──────────────────────────────┘
```

### 8.4 通知 / 提示風格

| 類型 | 樣式 | 範例 |
|---|---|---|
| 即時提示（toast）| 螢幕中下方滑入，2 秒淡出 | 「小雞吃飽了！+25 飢餓」|
| 狀態警告 | 對應狀態條閃爍紅色 | 飢餓<20 時 |
| 重大事件 | 彈窗（modal），需手動關閉 | 進化、進化分支揭曉 |
| 隨機事件 | 小雞旁出現 emoji 氣泡 + 點擊互動 | 「？發現一隻甲蟲」|
| 離線回歸 | 全畫面歡迎動畫 | 見 §7.4 |

### 8.5 配色與美術方向

- **主色**：暖黃 #FFD66B（小雞色）
- **副色**：薄荷綠 #A7E8C2（背景）、奶油白 #FFF8E7（UI 底）
- **強調色**：珊瑚紅 #FF8A80（警告、心情）
- **風格**：扁平 + 微擬物，圓角 12px，禁用銳角
- **字體**：粗黑體（中文）、Nunito Rounded（英文數字）

---

## 9. 永續資料

### 9.1 localStorage Schema

#### 主鍵：`nourish.save.v1`
```json
{
  "schemaVersion": 1,
  "createdAt": 1761609600000,
  "updatedAt": 1761609600000,
  "lastTickAt": 1761609600000,
  "playerId": "uuid-v4-string",
  "playerName": "玩家",

  "pet": {
    "id": "uuid-v4-string",
    "name": "小黃",
    "stage": "junior",
    "stageStartedAt": 1761523200000,
    "growthScore": 645.2,
    "stats": {
      "hunger": 82.4,
      "mood": 65.1,
      "clean": 78.9,
      "energy": 52.3
    },
    "traits": {
      "fatPoints": 2,
      "battlePoints": 8,
      "intelligencePoints": 5,
      "lowMoodMinutes": 0,
      "lowCleanMinutes": 0,
      "perfectStreakMinutes": 12
    },
    "appearance": {
      "baseSkin": "yellow",
      "accessories": [],
      "dirtyLevel": 0
    },
    "isSleeping": false
  },

  "economy": {
    "feedCoin": 245,
    "totalEarned": 380,
    "totalSpent": 135
  },

  "cooldowns": {
    "feed_basic": 0,
    "feed_corn": 0,
    "feed_worm": 1761609830000,
    "play_ball": 0,
    "bath": 1761609900000,
    "pet_head": 0
  },

  "daily": {
    "lastResetAt": 1761609600000,
    "loginStreak": 3,
    "tasks": {
      "feed_count": { "current": 3, "target": 5, "claimed": false },
      "play_count": { "current": 1, "target": 3, "claimed": false }
    }
  },

  "history": {
    "totalSessions": 12,
    "totalPlayMinutes": 89,
    "previousPets": []
  },

  "settings": {
    "soundEnabled": true,
    "musicEnabled": true,
    "notificationsEnabled": false,
    "language": "zh-TW",
    "reducedMotion": false
  }
}
```

#### 副鍵：`nourish.dex.v1`（圖鑑，紀錄玩家所有曾養過的小雞）
```json
{
  "schemaVersion": 1,
  "unlockedFinalForms": ["healthy", "fatty"],
  "completedPets": [
    {
      "id": "uuid",
      "name": "小黃",
      "finalForm": "healthy",
      "bornAt": 1760000000000,
      "evolvedAt": 1760518400000,
      "totalDays": 6
    }
  ]
}
```

#### 副鍵：`nourish.events.v1`（事件 log，方便除錯與成就）
```json
{
  "schemaVersion": 1,
  "events": [
    { "t": 1761609830000, "type": "feed", "item": "worm", "delta": { "hunger": 40, "mood": 10 } }
  ]
}
```

### 9.2 Schema 版本控制

- `schemaVersion` 為**整數**，每次破壞性變更 +1
- 啟動時讀取 → 比對版本 → 若舊版本則執行 migration function
- migration 採鏈式：`v1→v2→v3`，不可跳版
- 範例：
```js
const migrations = {
  1: (data) => data, // 初版
  2: (data) => ({ ...data, pet: { ...data.pet, traits: { ...data.pet.traits, newField: 0 }}}),
};
```

### 9.3 儲存策略

- 寫入頻率：每 30 秒一次（背景 tick）+ 每次互動立即寫入
- 防呆：寫入前 deep clone + try/catch，失敗時保留前一次成功備份在 `nourish.save.v1.backup`
- 大小估算：主存檔約 2–4 KB，圖鑑成長至 v0.3 約 10 KB，遠低於 5 MB localStorage 上限

---

## 10. MVP 範圍 vs 後續擴充

### 10.1 MVP（v0.1）必做清單

#### 系統層
- [x] 4 大狀態值 + 衰減系統（線上 + 離線）
- [x] localStorage 存檔 + schema 版本欄位
- [x] 進化階段（蛋→雛→幼→成）+ 至少 3 種進化終態（健康 / 胖 / 醜）
- [x] 成長分數累積系統
- [x] 飼料幣經濟（產出 + 消耗）
- [x] 每日登入獎勵 + 連續登入計數
- [x] 離線回歸問候

#### 互動層
- [x] 餵食：基礎飼料 + 至少 2 種付費食物（玉米、莓果）
- [x] 玩耍：至少 2 種（追毛球、打沙包）
- [x] 洗澡
- [x] 睡眠（手動）
- [x] 愛撫（摸頭、摸肚子）

#### UI 層
- [x] 主畫面（狀態條 + 舞台 + 操作列）
- [x] 互動子選單
- [x] 進化動畫（簡版）
- [x] 通知 toast 系統
- [x] 設定頁（音效開關、語言、reduced motion）

#### 美術層（最低限度）
- [x] 4 階段小雞 sprite × 至少 3 種終態（即 4 + 3 = 7 張）
- [x] 互動動畫各 1 套（吃、玩、洗、睡、愛撫）
- [x] 背景 1 張 + UI 元件圖

### 10.2 v0.2（首個內容更新，原預計 MVP 後 4 週 — 已於 2026-04-28 自動循環內全數實作）

- [x] **進化終態擴充至 7 種**（元氣雞 / 智慧雞 / 神雞 / 歌姬雞 + 已有 healthy/fatty/ugly）— iter#3、#23
- [x] **食物擴充至全 5 種**（feed_basic/corn/berry/worm/cake）— iter#1.1
- [x] **玩耍遊戲擴充至全 5 種**（追逐毛球 / 玩具蟲蟲 / 動感節拍 / 思考拼圖 / 唱歌比賽）— iter#3
- [x] **隨機事件系統**（5 種：撿幣 / 草藥 / 蝴蝶 / 趕蒼蠅 / 流星，含進度加成 ×1.6）— iter#2、#7、#30
- [x] **每日任務系統**（餵食 5 / 玩耍 3 / 愛撫 4，自動完成 +20 FC）— iter#1.3
- [x] **圖鑑功能**（nourish.dex.v1，最多 50 隻歷代寵物 + 飾品 snapshot + 點擊詳情）— iter#4、#23、#24
- [x] **取名功能**（首次取名 +10 心情，可改名，stage-name 點擊 + ✏️ 提示）— iter#3
- [x] **對話系統**（85+ contextual 對白：危機 / 時段 / 階段 / 終態 / want-nag / quirk）— iter#13、#16

**Bonus（v0.2 沒列但已加）**：Wants 系統（市場 2026 第 1 號 ROI）/ 互動 SFX / 鍵盤捷徑 / 存檔匯出匯入 / 紀念卡 / pre-evolve 三級視覺（egg shake / soon glow / imminent pulse）

### 10.3 v0.3（第二次更新，預計 8 週後 — 已部分提早到 v0.2 期實作）

- [x] **裝飾物商店**（6 件 / 3 slots：hat × 4、neck × 1、wing × 1，跨命繼承）— iter#21、#22、#23
- [x] **成就系統**（20 條：含 form_* / collect_* / dressup_* / streak_* / 等）— iter#5、#26
- [x] **截圖分享功能**（Canvas 720×1280 PNG，現役 + 紀念卡兩版本，Web Share API + 下載 fallback）— iter#15、#25
- [ ] **多隻寵物**（同時養 2 隻）— v0.4 起步候選
- [x] **老年互動**（基本版）— 成雞 7 天解鎖 7 條反思對白 + elder_week 成就；30 天解鎖 elder_month。iter#33
- [ ] **雲端存檔**（OAuth 登入）— App 階段以後（目前已有手動匯出/匯入存檔字串作為過渡）

**Bonus**：character-sheet 設計書 + market-research-2026 補強 + review-v2 + extensions 三份戰略文件 / R-1 拆檔 step 1+2（cfg.js + share.js）/ 蛋階段 3 級搖晃進度可視化 / chick/junior 階段倒數 hint

### 10.4 App 階段（v1.0）

- [x] **PWA 基本骨架**（manifest + service worker + A2HS） — iter#34，已可安裝至手機主畫面 + 離線啟動
- [ ] Capacitor / Tauri Mobile 原生包裝（PWA 已先頂著）
- [x] **本機通知雛形**（in-tab + SW.showNotification） — iter#38，背景分頁時飢餓 / 心情 / 清潔 / 體力 < 20 觸發；30 min 冷卻；玩家在設定頁可一鍵啟用 / 關閉。**真正的 Web Push（關 tab 也能送）需 server，待 v1.0+**
- [ ] 真實時間鎖定（離線計算用 server time，防作弊）— 需 backend
- [ ] 內購（純裝飾，不影響成長）
- [ ] 好友系統 + 互訪
- [ ] 排行榜（連續登入、神雞數量）

### 10.5 「先寫好擴充點」 vs 「以後再說」

| 項目 | 決策 | 理由 |
|---|---|---|
| Schema 版本欄位 | 先寫 | migration 一定會用到 |
| 進化終態 enum | 先寫好擴充介面 | v0.2 要新增 4 種 |
| 食物 / 玩耍 = 設定檔驅動 | 先寫 | JSON 設定加新內容不用改 code |
| 事件系統 | 先寫好 hook | 之後成就、任務都會掛上去 |
| 雲端存檔 | 以後再說 | 需要 backend，MVP 不做 |
| 多隻寵物 | 以後再說 | 改 schema 即可，但 UI 要重做 |
| 推播 | 以後再說 | App 階段才有意義 |
| 內購 | 以後再說 | 不在 MVP 商業目標內 |

---

## 11. 平衡參數初稿

### 11.1 全參數速查表

```yaml
# ===== 狀態衰減（每分鐘）=====
decay:
  online:
    hunger: -0.40
    mood:   -0.25
    clean:  -0.15
    energy: -0.30   # 活動中
    energy_sleep: +0.50
  offline:
    hunger: -0.20
    mood:   -0.15
    clean:  -0.10
    energy: +0.30
  offline_cap_hours: 12

# ===== 狀態門檻 =====
thresholds:
  high: 70   # 進入加成區
  mid:  40
  low:  20   # 進入懲罰區

# ===== 互動效果（節錄，全表見 §4）=====
interactions:
  feed_basic:    { hunger: +25, mood: +2,  clean: -3,  energy: 0,   cost: 0,  cooldown: 30  }
  feed_corn:     { hunger: +35, mood: +5,  clean: -3,  energy: +5,  cost: 5,  cooldown: 60  }
  feed_worm:     { hunger: +40, mood: +10, clean: -8,  energy: +10, cost: 8,  cooldown: 90  }
  feed_berry:    { hunger: +20, mood: +15, clean: 0,   energy: +5,  cost: 10, cooldown: 60  }
  feed_cake:     { hunger: +50, mood: +25, clean: -10, energy: 0,   cost: 25, cooldown: 300 }

  play_ball:     { mood: +15, energy: -10, clean: -5,  cost: 3,  cooldown: 120 }
  play_toy:      { mood: +20, energy: -15, clean: -3,  cost: 5,  cooldown: 180 }
  play_punch:    { mood: +25, energy: -25, clean: -10, cost: 8,  cooldown: 300, battlePoints: +3 }
  play_puzzle:   { mood: +18, energy: -8,  clean: 0,   cost: 6,  cooldown: 240, intPoints: +2 }
  play_sing:     { mood: +30, energy: -15, clean: 0,   cost: 10, cooldown: 360 }

  bath:          { clean: +60, mood: +5,   energy: -5, cost: 3, cooldown: 600 }

  pet_head:      { mood: +3,  cost: 0, cooldown: 30 }
  pet_belly:     { mood: +5,  cost: 0, cooldown: 60 }
  talk:          { mood: +2,  cost: 0, cooldown: 20 }

# ===== 成長階段時長（小時）=====
stages:
  egg:    { duration: 6,  scoreToEvolve: 30   }
  chick:  { duration: 24, scoreToEvolve: 200  }
  junior: { duration: 48, scoreToEvolve: 600  }
  adult_evolve: { scoreThreshold: 1500 }

# ===== 成長分數權重（每分鐘）=====
growth:
  hunger_high_bonus:  +1.0
  mood_high_bonus:    +1.5
  clean_high_bonus:   +0.5
  energy_high_bonus:  +0.5
  perfect_bonus:      +2.0   # 全部>70 額外
  hunger_low_penalty: -1.0
  mood_low_penalty:   -1.5
  interaction_score:  +5     # 每次互動
  daily_offline_24h_penalty: -50

# ===== 進化分支判定 =====
evolution:
  fatty_threshold:        { fatPoints: 10 }
  fighter_threshold:      { battlePoints: 30 }
  sage_threshold:         { intelligencePoints: 30 }
  uggo_threshold:         { lowMoodMinutes: 720 }     # 12 小時
  divine_threshold:       { perfectStreakMinutes: 1440, growthScore: 2000 }
  diva_threshold:         { singCount: 20 }
  default: healthy

# ===== 經濟 =====
economy:
  daily_login: 30
  task_complete: 20
  evolve_reward: 100
  streak_bonus_7day: 50
  streak_bonus_30day: 200
  random_event_min: 5
  random_event_max: 50
  random_event_interval_min: 180   # 3 小時

# ===== 系統 tick =====
system:
  tick_interval_ms: 1000        # 前景 tick 1 秒
  save_interval_ms: 30000       # 每 30 秒寫存檔
  offline_calc_on_load: true
```

### 11.2 重點數字速覽

| 指標 | 數值 | 說明 |
|---|---|---|
| 滿值狀態到 0（線上）| ~250 分鐘（飢餓最快）| 約 4 小時，不照顧會餓 |
| 滿值狀態到 0（離線）| ~500 分鐘 | 約 8 小時，可放整夜 |
| 蛋→成雞最快時程 | ~5 天 | 含進化分數累積 |
| 神雞達成時程 | ~7 天 + 完美照顧 | 罕見 |
| 每日上線時間預估 | 15–25 分鐘（分 3–5 段）| 輕度遊戲定位 |

---

## 12. 風險與假設

### 12.1 已知設計風險

| 風險 | 嚴重度 | 緩解策略 |
|---|---|---|
| 玩家在 30 秒循環內覺得無聊 | 🔴 高 | 隨機事件、外觀微變、表情變化做密一點 |
| 互動 cooldown 太長導致玩家空轉 | 🟡 中 | 提供「免費基礎飼料」與「無 CD 愛撫」當墊檔 |
| 離線回來四項全紅，玩家挫折 | 🔴 高 | 12 小時封頂 + 不會死亡 + 回歸補償 FC |
| 進化分支隨機性玩家不滿（覺得不公平）| 🟡 中 | UI 揭露「特徵點數」進度條，讓玩家有掌控感 |
| 數值平衡崩壞，神雞太常見 | 🟡 中 | 神雞門檻含 24 小時完美狀態，自然稀有 |
| 數值平衡崩壞，玩家養不到任何分支 | 🔴 高 | 預設「健康成雞」是 fallback，永遠養得到 |
| localStorage 在隱私模式或清快取後資料消失 | 🔴 高 | UI 提示「資料儲存於本機」，v0.3 加雲端 |
| 玩家覺得「沒有結局」失去動力 | 🟡 中 | 圖鑑 + 多次新蛋體驗、v0.2 加成就 |
| 過度肝（每日 3 小時都在玩）| 🟢 低 | cooldown 機制天然限制，每日 25 分鐘是頂 |
| 開發資源評估失準 | 🟡 中 | MVP 範圍嚴格收斂，先驗證核心循環 |

### 12.2 待驗證的假設

| 假設 | 驗證方式 | 驗證階段 |
|---|---|---|
| 「分頁旁陪伴」是有效的使用情境 | 內測，問卷詢問玩家何時開分頁 | MVP 內測 |
| 5–7 天進化是合適節奏（不太快不太慢）| Telemetry：流失率、進化前流失點 | MVP 公測 |
| 多分支進化會驅動「再養一隻」行為 | 看二輪養成的轉換率 | v0.2 |
| 玩家願意每天回來領登入獎勵 | DAU 7 日留存率 | MVP |
| 純軟貨幣經濟可成立（不需內購）| MVP 不引入內購觀察玩家滿意度 | MVP |
| 「不會死」設計不會讓玩家覺得無聊（沒有風險）| 對比測試：有死亡 vs 無死亡組 | v0.2 A/B |
| 醜雞分支是可接受的「另類成功」而非懲罰 | 分支取得分布 + 玩家分享行為觀察 | v0.2 |
| Web 版存檔的「會清掉」風險玩家可接受 | FAQ 明示，看抱怨率 | MVP |
| 30 秒 micro loop 的密度足以維持留存 | Session length 中位數 ≥ 90 秒 | MVP |

### 12.3 設計哲學自我檢核

- ✅ 不焦慮：無死亡、離線封頂、cooldown 自我節制
- ✅ 不付費壓力：MVP 不引入硬貨幣
- ✅ 不單調：互動 14 種 + 隨機事件 + 多分支
- ✅ 不孤單：寵物隨時有反應、表情、聲音
- ⚠️ 待驗證：是否能讓玩家「看一眼就微笑」（情感目標）

---

## 附錄 A：開發優先級建議

```
Sprint 1（2 週）：
  - localStorage 存檔 + schema
  - 4 大狀態值 + 線上衰減
  - 主畫面 UI（狀態條 + 舞台）
  - 餵食（基礎飼料）+ 愛撫（摸頭）
  - 蛋 → 雛雞階段轉換

Sprint 2（2 週）：
  - 離線衰減 + 12 小時封頂
  - 玩耍 + 洗澡 + 睡眠
  - 飼料幣經濟基礎
  - 雛雞 → 幼雞 → 成雞

Sprint 3（2 週）：
  - 進化分支判定（3 種終態）
  - 互動子選單 + 多種食物 / 玩耍
  - 每日登入 + 通知系統
  - 美術整合 + 動畫 polish

→ MVP（v0.1）發佈，6 週時程
```

## 附錄 B：技術選型建議（給工程 agent 參考）

- 前端框架：原生 JS（最輕）/ Vue 3（如需狀態管理）
- 動畫：Canvas + requestAnimationFrame，或 CSS sprite + transform
- 音效：HTMLAudioElement，預載入小檔
- 存檔：localStorage（同步）+ 未來 IndexedDB（如資料 >5MB）
- 部署：靜態託管（Vercel / Netlify / GitHub Pages）

---

> **本文件結束。**
> 任何參數異動請更新 §11，並 bump schemaVersion 若涉及存檔格式。
