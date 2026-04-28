# 市場調查報告：寵物養成類網頁遊戲

> 專案：啾啾日常 (ChickaDay) — 寵物養成網頁遊戲
> 版本：v1.0（2026-04-28）
> 資料來源：WebSearch（2026-04），多源交叉驗證

## 目錄

1. [代表作分析（10 款）](#1-代表作分析10-款)
2. [共通成功要素](#2-共通成功要素)
3. [反模式與玩家痛點](#3-反模式與玩家痛點)
4. [網頁端技術觀察](#4-網頁端技術觀察)
5. [延伸性提案](#5-延伸性提案)
6. [對啾啾日常的具體建議](#6-對啾啾日常的具體建議)

---

## 1. 代表作分析（10 款）

### 1.1 Tamagotchi（1996 起，多代）
- **核心玩法**：照顧蛋孵化的虛擬寵物，餵食、清潔、玩耍、就醫，避免它跑掉或死亡。
- **為什麼受歡迎**：
  - 「照顧需求」綁定生活節奏 → 玩家會主動關心
  - 不照顧的後果有儀式感（離家出走、化天使）→ 強烈情感衝擊
  - 進化分支多，每次孵化結果不同 → 收集慾
- **互動類型**：餵食、玩遊戲、清潔、醫療、紀律
- **視覺風格**：點陣風像素 → 後期 3D 卡通
- **變現**：硬體售價 + 後續軟體授權

### 1.2 Neko Atsume（貓咪收集，2014）
- **核心玩法**：在院子放食物與玩具，吸引野貓來訪，收集所有貓。
- **為什麼受歡迎**：
  - **零壓力被動式**：貓不會死，不用焦慮
  - 收集 + 截圖分享機制
  - 日式療癒美學
- **互動類型**：擺放、選食物、拍照
- **視覺風格**：日式扁平卡通
- **變現**：軟貨幣（小魚乾）+ IAP 加速

### 1.3 Pou（2012，外星寵物）
- **核心玩法**：餵食、洗澡、玩迷你遊戲、裝扮
- **為什麼受歡迎**：
  - 角色辨識度極高
  - 迷你遊戲多，玩到飽
  - 簡單免費，跨平台
- **變現**：廣告 + 裝扮道具

### 1.4 My Talking Tom 系列
- **核心玩法**：寵物會重複玩家說的話 + 養成
- **為什麼受歡迎**：
  - 麥克風互動 → 親密感
  - 兒童友善
- **變現**：廣告為主

### 1.5 Adopt Me!（Roblox 平台，2017）
- **核心玩法**：領養寵物 → 餵養 → 進化 → 交易/組隊
- **為什麼受歡迎**：
  - **社交是核心**：可以跟朋友玩、交易、舉辦派對
  - 寵物有稀有度、進化階段（Newborn → Junior → Pre-Teen → Teen → Post-Teen → Full Grown）
  - 永久持有（不會死）→ 玩家敢投入感情
- **視覺風格**：3D 童趣卡通
- **變現**：Robux 轉蛋 + 限時寵物

### 1.6 Nintendogs（任天堂，2005）
- **核心玩法**：3D 真實感狗狗養成 + 訓練
- **為什麼受歡迎**：
  - 觸控撫摸 → 觸感回饋
  - 語音指令訓練 → 深度互動
- **變現**：硬體軟體售

### 1.7 Sylestia（網頁瀏覽器養成）
- **核心玩法**：基因育種 + 回合制 RPG 戰鬥 + 探索
- **為什麼受歡迎**：
  - **基因系統**：每隻外觀真的不同 → 收藏與交易市場
  - 純網頁、零下載門檻
- **變現**：訂閱會員

### 1.8 Tamaweb（同人網頁版 Tamagotchi）
- **核心玩法**：經典 Tamagotchi 玩法的網頁復刻 + 迷你遊戲（Mimic、Catch）
- **為什麼受歡迎**：
  - 純 HTML/JS、跨裝置即玩即走
  - 還原童年 → 懷舊客群
- **技術觀察**：Phaser.js 實作，是本專案的優秀參考。
- 來源：[Tamaweb](https://tamawebgame.github.io/)、[itch.io 版本](https://samandev.itch.io/tamaweb)

### 1.9 Peridot（Niantic，2023）
- **核心玩法**：AR + AI 寵物養成、學技能、繁殖
- **為什麼受歡迎**：
  - AR 走出室外 → 結合 Pokémon GO 模式
  - AI 行為 → 每隻寵物個性不同
- **未來啟示**：第二階段 App 可考慮 AR 模式

### 1.10 Bubbu / Tiny Friends 等手遊
- **核心玩法**：可愛動物養成 + 裝扮 + 迷你遊戲合集
- **為什麼受歡迎**：
  - 高度兒童化 + 大量內容堆疊
  - 廣告變現低使用門檻

---

## 2. 共通成功要素

| 要素 | 描述 | 強度 |
|------|------|------|
| **照顧驅動回訪** | 數值衰減產生「該回來看看」的責任感 | ★★★★★ |
| **離線時間流動** | 離開後寵物仍有變化，創造「久別重逢」感 | ★★★★★ |
| **情感擬人化** | 表情、聲音、抱怨 → 寵物像活的 | ★★★★★ |
| **進化分支** | 不同照顧方式得到不同終態 → 收集慾 + 重玩價值 | ★★★★ |
| **可分享性** | 截圖、分享進度、社群曬寵物 | ★★★★ |
| **零壓力選項** | 提供「不會死」的相對佛系玩法（Neko Atsume 模式） | ★★★ |
| **自訂與裝扮** | 名字、服裝、家居 → 唯一性 | ★★★★ |
| **迷你遊戲** | 換取資源、增加心情 → 解單調 | ★★★ |
| **儀式感事件** | 孵化、進化、生日、化天使 → 高峰時刻 | ★★★★★ |

關鍵研究結論（來自 [Yu-kai Chou Pet Companion Design](https://yukaichou.com/advanced-gamification/the-pet-companion-design-in-gamification/)）：「不登入時寵物會餓、會傷心」這個設計**強大之處在於激發罪惡感（GUILT），而非單純減少獎勵**。情緒驅動 > 物質驅動。

---

## 3. 反模式與玩家痛點

| 反模式 | 後果 | 規避方式 |
|--------|------|---------|
| **死亡無預警** | 玩家覺得不公平、棄坑 | 提供警告期 + 復活機制（吃糖果/看廣告） |
| **離線懲罰過重** | 玩家不敢出遠門、產生壓力 | 設定衰減封頂（例：12 小時後不再下降） |
| **互動單一** | 重複按鈕，3 天就膩 | 多樣化互動 + 觸發式事件 |
| **逼氪嚴重** | 進度被金錢硬卡 | MVP 不放硬幣，第二階段才考慮輕度變現 |
| **進化結果隨機度過高** | 玩家覺得照顧白費 | 進化條件可預期，但保留小驚喜 |
| **數值面板冷冰冰** | 沒有情感 | 用寵物表情 + 對話框替代純數字 |
| **無存檔遺失保護** | 一次清快取全沒了 | localStorage + 雲端同步（v0.3） |

---

## 4. 網頁端技術觀察

| 技術 | 適用情境 | 取捨 |
|------|---------|------|
| **純 HTML+CSS+JS（單檔）** | MVP、概念驗證 | ✅ 零依賴、SEO 友善、好部署；❌ 動畫複雜時程式碼會亂 |
| **Phaser.js** | 中型 2D 遊戲，迷你遊戲多 | ✅ 場景管理、碰撞、Tween；❌ 學習曲線、bundle 較大 |
| **PixiJS** | 視覺密集、粒子特效 | ✅ 渲染強；❌ 缺場景管理需自建 |
| **Canvas 2D 手刻** | 完全控制 | ✅ 輕量；❌ 重造輪子 |
| **React + Framer Motion** | UI 互動為主、低動畫密度 | ✅ 元件化、狀態管理；❌ 對純動畫遊戲略 overkill |

**參考實作**：
- [Tamagotchi Clone (Phaser)](https://github.com/ChrisChrisLoLo/tamagotchiClone) — Phaser 實作的 Tamagotchi clone
- [Tamagotchi-Game (HTML+CSS+JS)](https://github.com/tugcecerit/Tamagotchi-Game) — 純 HTML/JS 範例

**啾啾日常 MVP 建議**：**單檔 HTML+CSS+JS**，SVG 直接 inline 或外部檔。等 v0.2 加迷你遊戲時再評估是否引入 Phaser。

---

## 5. 延伸性提案

### 第一階段（網頁版，已在 GDD 範圍）
- ✅ 四大狀態 + 互動 + 進化
- ✅ 離線時間流動
- ✅ localStorage 永續

### 第二階段（v0.2 網頁擴充）
1. **迷你遊戲** — 「啄米」反應遊戲、「猜蛋」記憶遊戲（賺飼料幣）
2. **裝扮系統** — 帽子、圍巾，純 SVG 疊圖
3. **成就系統** — 累積里程碑解鎖（首次孵化、首次成雞、堅持 7 天等）
4. **多寵物欄位** — 同時養 2-3 隻、可以「下一顆蛋」
5. **季節系統** — 根據實際日期切換背景與限時食物

### 第三階段（App 版，第二階段）
1. **推播通知** — 「啾啾餓了～」（最強回訪驅動）
2. **AR 模式** — 把寵物放到桌上拍照
3. **雲端同步 + 帳號** — 跨裝置續玩
4. **社群圖鑑** — 看朋友養成什麼分支
5. **語音互動** — 仿 Talking Tom 重複玩家語音

### 不建議做（會落入反模式）
- ❌ 強制 IAP 卡進度
- ❌ 真實死亡無復活
- ❌ NFT / 區塊鏈交易（玩家對養成情感與投機衝突）

---

## 6. 對啾啾日常的具體建議

### 6.1 玩法定位
**核心三角**：Tamagotchi 的責任感 + Neko Atsume 的零壓力底線 + Adopt Me 的進化分支收集。

具體：
- 數值衰減（責任感）
- 但**不會真死**（佛系底線），最差是進化成「醜雞」 — 仍可救
- 多種終態（健康成雞、胖雞、戰鬥雞、神雞、醜雞）→ 收集

### 6.2 情感勾子
- 每隔約 2 小時讓寵物主動「說話」（例：「咕咕，肚子餓了…」）
- 進化瞬間有儀式感（蛋裂開、亮光）
- 離線回來時有「歡迎回來」的問候

### 6.3 視覺風格定錨
**可愛卡通 + 柔和色票**（避免螢光、避免擬真）：
- 主色：暖黃 / 棕 / 米白
- 風格：粗線條 + 平塗色塊 + 少量陰影
- 形狀：圓潤、大頭、四肢小

### 6.4 MVP 排序（v0.1）
1. 蛋 → 雛雞 → 成雞三階段（先不分支）
2. 四大數值 + 自然衰減
3. 餵食、玩耍、洗澡、睡覺四個按鈕
4. localStorage 永續 + 離線時間流動
5. 一張背景 + 寵物 + 表情切換

之後再加分支進化、迷你遊戲、裝扮。

---

## 來源

- [10 Best Virtual Pet Games — Mistplay](https://www.mistplay.com/blog/10-best-virtual-pet-games-tamagotchi-sim-and-collection)
- [Top 11 Virtual Pet Games & Apps 2026 — Moon Technolabs](https://www.moontechnolabs.com/blog/virtual-pet-games/)
- [Pet Companion Design in Gamification — Yu-kai Chou](https://yukaichou.com/advanced-gamification/the-pet-companion-design-in-gamification/)
- [Tamagotchi Care — Tamagotchi Wiki](https://tamagotchi.fandom.com/wiki/Care)
- [Health meter — Tamagotchi Wiki](https://tamagotchi.fandom.com/wiki/Health_meter)
- [Tamagotchi Clone (Phaser) — GitHub](https://github.com/ChrisChrisLoLo/tamagotchiClone)
- [Tamagotchi-Game — GitHub](https://github.com/tugcecerit/Tamagotchi-Game)
- [Sylestia — Free Virtual Pet Browser Game](https://www.sylestia.com/)
- [Tamaweb Virtual Pet Game](https://tamawebgame.github.io/)
- [Adopt Me Emotional Drivers — St. Augustine's University](https://explore.st-aug.edu/exp/gg-adopt-me-values-the-emotional-and-practical-drivers-behind-responsible-virtual-pet-care)
- [Virtual Pet — Wikipedia](https://en.wikipedia.org/wiki/Virtual_pet)
- [Affection-Oriented Virtual Pet Game Design — ResearchGate](https://www.researchgate.net/publication/321446731_Exploring_Affection-Oriented_Virtual_Pet_Game_Design_Strategies_in_VR_Attachment_Motivations_and_Expectations_of_Users_of_Pet_Games)
- [Core Gameplay Loop Design — GameDistribution](https://blog.gamedistribution.com/core-gameplay-loop-design-small-tweaks-big-engagement/)
