# Changelog

> 所有變更追溯到 [`docs/iteration-log.md`](docs/iteration-log.md)（cron 自動循環日誌，最權威）。
> 此檔依**版本/主題**重組，給對外讀者快速掃一遍。

---

## v1.0 — App 階段準備（部分完成，2026-04-29）

PWA 化進行中，剩餘需後端的功能延後。

### 加入
- ✅ **PWA 基本骨架**：`manifest.json` + Service Worker（cache-first + 離線啟動）
- ✅ **PWA icon set**：72/96/128/144/152/192/256/384/512 + 192/512 maskable + favicon-32 + apple-touch-icon-180
- ✅ **A2HS 雙路徑**：beforeinstallprompt 攔截 + 設定頁「📲 立即安裝」備援按鈕
- ✅ **本機推播通知**：背景分頁時 stat < 20 自動通知（30 min 冷卻、permission opt-in）
- ✅ 雙 Session 並行協作（Session A 邏輯 / Session B AI 生圖 + ComfyUI）

### 暫不實作（需後端）
- ⏸️ Web Push（關 tab 也送） — 需 server + VAPID
- ⏸️ 真實時間鎖定 / 雲端存檔 / 內購 / 好友 / 排行榜

---

## v0.3 — 內容深度（4/6 完成，2026-04-28 ~ 2026-04-29）

### 加入
- ✅ **裝扮系統**：9 件配件 / 4 slots（hat / face / neck / wing），跨命繼承
  - 頭飾 5：髮帶 80 / 派對帽 100 / 蝴蝶結 120 / 花環 200 / 皇冠 500 FC
  - 臉部 1：心形墨鏡 180 FC
  - 項鍊 2：圍巾 150 / 珍珠項鍊 180 FC
  - 翅膀 2：天使翅膀 350 / 彩虹翅膀 480 FC
- ✅ **成就系統 30 條**：里程碑 / 收集 / 終態 / 互動量 / 連續登入 / 完美 / 穿搭 / 老年 / wants / 季節
- ✅ **截圖分享卡**：Canvas 720×1280 PNG，現役 + 紀念卡兩版本
  - Web Share API + 下載 fallback
  - 紀念卡含「永遠記得你 💕」+ 5 顆粉紅愛心 + 過去式陪伴 X 天
  - 配戴的飾品自動畫上去
- ✅ **老年互動**：成雞 7 天解鎖 7 條反思對白 + 30 天 elder_month 成就
- ✅ **季節事件 6 種**：春櫻 / 情人節 / 夏涼 / 月餅 / 萬聖 / 聖誕，依日期自動觸發

### 待實作
- ⏸️ 多隻寵物（同時養 2 隻） — schema 大改
- ⏸️ 雲端存檔（OAuth） — 需後端

---

## v0.2 — 互動深度（8/8 完成，2026-04-28）

### 加入
- ✅ **進化終態 7 種**：健康 / 圓潤 / 迷因 / 元氣 / 智慧 / 歌姬 / 神雞
  - 內部代碼保留 fighter / fatty / ugly，對外文案軟化（女性向 TA）
- ✅ **食物 5 種**：基礎 / 玉米 / 莓果 / 小蟲 / 蛋糕
- ✅ **玩耍 5 種**：追逐毛球 / 玩具 / 動感節拍 / 思考拼圖 / 唱歌比賽
- ✅ **隨機事件系統 7 種**：撿幣 55% / 草藥 18% / 蝴蝶 14% / 趕蒼蠅 10% / 流星 3% / 彩虹 12% / 糖果 8%
  - 進度 ≥ 80% 時 spawn 機率 ×1.6
- ✅ **每日任務**：餵食 5 / 玩耍 3 / 愛撫 4，完成各 +20 FC
- ✅ **圖鑑**：紀錄歷代寵物（最多 50 隻，含當時穿搭 snapshot），點擊查看詳情
- ✅ **取名功能**：首次 +10 心情，可改名
- ✅ **對話系統**：85 句 contextual 對白（時段 / 階段 / 終態 / 老年 / want 抱怨 / 富裕 / 動作 / quirk）

### 同期 Bonus（GDD 沒列但已加）
- **Wants 系統 14 條**（市場 2026 第一名 ROI 功能）
  - 寵物主動表達欲望，滿足獲得 mood +7 / coin +12 / growth +8
- **鍵盤捷徑** 11 條（1-5 互動、A 成就、D 圖鑑、S 設定、N 取名、ESC 關 modal）
- **存檔匯出 / 匯入**（base64 字串攜帶，跨裝置遷移）
- **音效系統**（Web Audio API 程序合成 8 種 SFX，零外部音檔）
- **進化前奏三級視覺**（egg shake / soon glow / imminent pulse）
- **互動反饋動畫**（pet-eat / shake / bath / love，4 套 keyframe）
- **粒子特效**（進化 + 成就解鎖金光，含粒子數量 cap）

---

## v0.1 — MVP（19/19，2026-04-28）

### 加入
- ✅ 4 大狀態（飢餓 / 心情 / 清潔 / 體力）+ 線上/離線衰減 + 12h 封頂
- ✅ 4 階段（蛋 6h / 雛 24h / 幼 48h / 成）+ 進化分支邏輯
- ✅ 14 種互動 + cooldown + 飼料幣經濟
- ✅ localStorage 永續 + schema 版本 + deepMerge migration
- ✅ 離線回歸 5 級問候（30m / 3h / 8h / 12h / >12h）
- ✅ 每日登入 + 連續登入獎勵（streak_7 / streak_30）
- ✅ Tap-to-pet（點寵物自動摸頭）
- ✅ 19 張 SVG 占位美術（蛋 / 雛 / 幼 / 7 終態 / 5 心情 / 3 食物 / 2 背景）

---

## 美術 / 視覺基礎建設

### Character sheet（[`docs/character-sheet.md`](docs/character-sheet.md)）
- 5 項視覺 DNA（體色 / 大眼 / 小喙 / 大頭比例 / 粗線稿）
- 9 色統一色票（黃 #FFD86B、橘 #FF9F43 等，禁螢光）
- 7 種終態的「保留 DNA + 加 1–2 配件」原則
- 8 條 anti-pattern（嬰兒臉化 / 鴨喙化 / 寫實渲染…）
- AI 工具評估表（MJ `--cref` / SD + LoRA 推薦）

### 女性向 TA 設計約束（[`character-sheet.md §10`](docs/character-sheet.md)）
- 整體調性：粉嫩色系優先（粉 #FFB7B7、桃紅 #FF89A7、淺粉 #FFE0E8）
- 圓角 14 → 20px、曲線優先於銳角
- 形象軟化：戰鬥雞 → 元氣雞、暗紅頭巾 → 粉色運動帶
- 玩法重「關係建立 + 自我表達」 > 競爭 / PvP

### Session B AI 生圖 pipeline
- ComfyUI 0.14.1 + DreamShaperXL Turbo + rembg（isnet-anime / u2net / silueta）
- 28+ PNG：11 chick variants + 5 mood + 3 food + 2 bg + 5 events + 7 accessories + PWA icons

---

## 程式架構

### 5 模組（lazy-bridge IIFE）
```
cfg.js          → window.NourishCFG (純資料)
dex.js          → window.NourishDex (儲存層)
achievements.js → window.NourishAchievements (規則引擎)
share.js        → window.NourishShare (Canvas 渲染)
game.js         → window.NourishAPI (橋接) + 業務邏輯 + UI
```

### 載入順序（HTML script tags 即依賴系統）
```html
<script src="src/cfg.js"></script>
<script src="src/dex.js"></script>
<script src="src/achievements.js"></script>
<script src="src/share.js"></script>
<script src="src/game.js"></script>
```

### 設計原則
- **無 build step / 無 framework / 無 npm 套件**
- 純資料 / 純邏輯 / 純儲存 / 純渲染 各自模組
- 業務邏輯 + UI + state 留在 game.js
- localStorage 兩個 key：`nourish.save.v1` 主存檔、`nourish.dex.v1` 永久圖鑑

---

## 文件家族（13 份 markdown）

| 文件 | 用途 |
|------|------|
| README.md | GitHub repo 第一印象 |
| CHANGELOG.md | **本檔**，版本變更總表 |
| CLAUDE.md | 雙 session 協作 + 自主模式約定 |
| docs/gdd.md | Game Design Document（核心參考） |
| docs/character-sheet.md | 美術約束 + 女性向 TA 設計 |
| docs/market-research.md / market-research-2026.md | 市場研究 |
| docs/review.md / review-v2.md | Code & gameplay review |
| docs/extensions.md | v0.2 / v0.3 / App 路線圖 |
| docs/deploy.md | GitHub Pages / 4 平台部署 |
| docs/iteration-log.md | 開發日誌（最權威） |
| docs/image-prompts.md | AI 生圖 prompt |
| docs/session-b-tasks.md | Session A → Session B 任務介面 |

---

## 統計摘要（截至 v1.0 階段）

| 維度 | 數字 |
|------|------|
| 互動種類 | 14 |
| 隨機事件（一般 + 季節） | 13 |
| Wants 池 | 14 |
| 進化終態 | 7 |
| 配件 / Slots | 9 / 4 |
| 成就 | **30** |
| 對白池 | 18 種類別、~100 句 |
| 音效 | 8 種程序合成 |
| SFX | 8 種 |
| 鍵盤捷徑 | 11 |
| 文件 | 13 份 markdown |
| 程式模組 | 5 個 .js + 1 .css + 1 .html |
| 開發循環 | 49 輪 cron + 多輪 user-driven |

---

> 詳細每輪改動請見 [`docs/iteration-log.md`](docs/iteration-log.md)。
