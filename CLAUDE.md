# 啾啾日常 ChickaDay — 專案說明

> 任何 Claude session 進這個資料夾都先讀完這份。雙 session 並行運作下，
> 防撞檔的協議寫在 §6，**先讀 §6 再開工**。

---

## 1. 專案定位

- **遊戲名**：啾啾日常 (ChickaDay)
- **類型**：寵物養成網頁遊戲（Tamagotchi 系 + Adopt Me 進化分支 + Neko Atsume 的零壓力底線）
- **階段**：v0.1 MVP 已上線本機；v0.2 進行中；App 為第二階段（PWA / Capacitor / Tauri 之後再說）
- **主角**：小雞（預設名「啾啾」），未來可擴充其他動物
- **目標玩家**：18–35 歲女性為核心 TA，輕度療癒、上班分頁旁掛著、5 分鐘 micro loop
- **TA 設計約束**（**重要，所有視覺 / 文案 / 玩法決策都看這條**）：
  - 粉嫩色系優先（粉 #FFB7B7、桃紅、暖黃），避免過冷 / 過男性化
  - 圓角 / 曲線 > 銳角；愛心 / 星星 / 花朵 / 緞帶符號優先
  - 文案語氣：溫暖、撒嬌、療癒；避免戰鬥 / 力量類動詞
  - 進化分支「戰鬥雞」保留但軟化（活力 / 元氣 / 運動感，非攻擊感）
  - 玩法重「關係建立 + 自我表達」 > 純成就 / 競爭 / PvP
  - 裝扮系統 v0.3 必做（蝴蝶結 / 皇冠 / 髮帶 / 花環 > 運動類配件）

---

## 2. 技術選型

- **純 HTML + CSS + JS**，無 build step、無 framework、無套件
- 單頁：`index.html`（入口）+ `src/style.css` + `src/game.js`
- 永續：`localStorage`，主鍵 `nourish.save.v1`，schema 版本欄位 + deepMerge migration
- 美術：SVG 占位圖（`assets/svg/`），未來用 Gemini/GPT 生 PNG 替換
- 本機開發 server：`python3 -m http.server 8765`（一次只能一個 session 開）

---

## 3. 檔案結構

```
nourish/
├── CLAUDE.md                    ← 本檔
├── index.html                   ← 入口 HTML
├── src/
│   ├── style.css                ← 所有樣式
│   ├── cfg.js                   ← 純資料（CFG 物件）→ window.NourishCFG
│   └── game.js                  ← 遊戲邏輯（IIFE，從 window.NourishCFG 讀 config）
├── assets/svg/                  ← 19 張 SVG（pet + mood + food + bg）
├── docs/
│   ├── gdd.md                   ← 完整 Game Design Document（核心參考）
│   ├── character-sheet.md       ← 角色設定書（生圖前必讀，gating factor）
│   ├── market-research.md       ← 市場調查
│   ├── image-prompts.md         ← AI 生圖 prompt 清單（必須先讀 character-sheet）
│   ├── review.md                ← Code review 紀錄（P0/P1/P2）
│   └── iteration-log.md         ← 自動循環日誌（雙 session 交接介面，§6）
└── tests/                       ← 預留，目前空
```

---

## 4. 自主模式約定

使用者已明確表示此專案採「**自主模式**」：

- 接到方向級指示後，**直接拆解 → 派 agent → 執行 → 整合**，不要中途反問。
- 例外才停下來確認：不可逆操作（rm -rf、強推、刪 branch）、需要外部金鑰、方向歧義到無法合理猜測。
- 完成後給簡短摘要即可，不要逐步請求批准。

每 10 分鐘觸發一次優化循環（cron / cloud schedule），由 session 從以下方向自選 1–3 件可在 10 分鐘內完成：
- 修 P1 / Quick Win bug
- 實作 v0.2 功能（隨機事件、每日任務、取名、新進化分支）
- 新增 SVG 占位圖
- 市場調查補強（WebSearch）
- 企劃延伸（更新 GDD §10.2 / §10.3）
- 美工延伸（為新功能寫 image-prompts）

---

## 5. 開發慣例

### 程式碼
- ES2020+ 純 JS，無 transpile
- 無 import：用 `<script>` 載入順序當依賴鏈（`cfg.js` 先，`game.js` 後）
- 數值與互動表全部在 `src/cfg.js` 的 CFG 物件，**改數值只動 cfg.js，不要散落**
- `randomEvents.pool[].apply` 用 string id（純資料），實作在 `game.js` 的 `RANDOM_EVENT_APPLIES` dispatch 表
- `state` 是唯一可變物件，每次 mutation 後呼叫 `save() + render()`
- 拆檔 R-1 進度：step 1 已完（CFG 抽出），step 2-4（render / interactions / events / modal）未做

### CSS
- 色票定義在 `:root`（`--c-yellow` `--c-orange` …），**不要新增硬編碼色**
- 動畫一律放在檔尾 `@keyframes` 區，名稱前綴用功能（`event-pop` `bar-warn`）
- 響應式：`#app` 鎖 480px 寬，當作直立手機畫布

### SVG
- 統一 `viewBox="0 0 200 200"`（角色與道具）/ 全填色（背景）
- **色票一致**：黃 #FFD86B、橘 #FF9F43、棕 #8B5A2B、白 #FFF8E7、黑 #2C2C2C、藍 #6BCBFF、綠 #6BCB77、粉 #FFB7B7、暗紅 #B23A48
- 命名：`<category>-<variant>.svg`（`chick-adult-fighter.svg` `food-seed.svg`）

### 驗證
- 改完 `src/game.js` 後跑 `node --check src/game.js`（語法 lint）
- 改完 `index.html` 後 `curl -s http://localhost:8765/index.html | head` 確認沒爛
- 沒有 unit test 框架，依靠手動測 + lint

---

## 6. 雙 Session 協作協議（重要）

兩個 Claude session 並行跑時，避免撞檔的規則：

### 6.1 角色分工

每個 session **開工前先選一個角色**，整個 session 只做該角色的事：

| 角色 | 主要寫入區域 | 不要碰 |
|------|------------|--------|
| **A：Code** | `src/`, `index.html`, `tests/`, `assets/svg/`（修圖） | `docs/gdd.md`, `docs/market-research.md` 內容主體 |
| **B：Content** | `docs/`, `assets/svg/`（**新增**圖）, `docs/image-prompts.md` | `src/`, `index.html` |

- **共用可寫**：`docs/iteration-log.md`（append-only，永遠加在最上方，不修改舊條目）
- **共用唯讀**：`CLAUDE.md`、`docs/gdd.md` 的非新增章節、`docs/review.md`

新增 SVG 兩邊都可以做（檔名不同就不衝突），但 **修改既有 SVG** 算 Code 角色。

### 6.2 開工前檢查 4 步

1. **讀 `docs/iteration-log.md`** 的最新 5 條，看另一邊正在寫什麼
2. **挑一個跟最新 5 條沒檔案重疊** 的工作項
3. **先在 iteration-log.md 最上方寫一條 `## YYYY-MM-DD HH:MM · Session [A|B] — INTENT: <你打算做什麼>`**（佔位，告訴另一個 session）
4. 做完把那條 INTENT 改成正式紀錄（補影響檔案 + 驗證結果）

### 6.3 Cron 錯峰

- Session A：`3-59/10 * * * *`（:03, :13, :23, …）
- Session B：`7-59/10 * * * *`（:07, :17, :27, …）

兩邊錯 4 分鐘，避免同時 fire。如果用 `/loop` skill，跟它講「7m offset」。

### 6.4 HTTP Server

- **只開一個**，預設由 Session A 持有 port 8765
- Session B 不要再開 server；要測就用 A 開的那個
- 確認方法：`lsof -i :8765`，有就別開

### 6.5 撞檔處理

- 如果 `git diff` / `cat` 看到自己的編輯被另一邊覆蓋了 → **不要硬蓋回去**，讀對方版本，看能不能合併
- 真的衝突就在 `iteration-log.md` 寫一條 `CONFLICT` 紀錄，停下來讓使用者裁決

---

## 7. Sub-agent 沙盒注意

派 sub-agent（透過 Agent tool）時，**它們的 sandbox 常會拒絕**：
- `Bash`、`Write`、`WebSearch`、`WebFetch`

主 agent（你）的 sandbox 則沒這個限制。所以策略：
- **市場調查**：sub-agent 通常會被拒 WebSearch，主 agent 自己跑 WebSearch 然後 Write
- **生 SVG / image prompt**：sub-agent 容易被拒 Write，主 agent 自己寫
- **Review / GDD 等純讀檔思考的工作**：sub-agent 沒問題，可以跑

如果 sub-agent 回來說「被拒」，**不要請使用者授權**，直接主 agent 接手。

---

## 8. 常用片段

### 啟動本機 server（只在 Session A）
```bash
lsof -i :8765 >/dev/null 2>&1 || (python3 -m http.server 8765 > /tmp/nourish-server.log 2>&1 &)
```

### 全部 SVG 預覽（給 review）
```bash
ls assets/svg/
```

### 驗證 game.js
```bash
node --check src/game.js
```

### 開除錯模式（瀏覽器）
按右上 ⚙️ → 設定頁含「+100 FC」「跳階段」「重置存檔」。

---

## 9. GDD 真相之源

任何遊戲性問題請先讀 `docs/gdd.md` §11 平衡參數。**不要憑印象改數值**。
任何美術產出請先讀 `docs/character-sheet.md`。**畫風是 gating factor，不是 polish。**

當前 MVP 完成度：18/19（GDD §10.1 必做清單，~95%）。剩下：正式設定頁（音效 / 語言）。

---

## 10. 不要做的事

- ❌ 加 npm / build step / framework — 違反「純 HTML+JS 即玩即走」設計
- ❌ 加雲端依賴（OAuth、資料庫、API）— v0.3 才考慮
- ❌ 內購 / 付費機制 — 不在 MVP 商業目標
- ❌ 真實死亡 / 強制催氪 — 反設計
- ❌ 修改既有 SVG 的色票 — 一致性優先於個別美感
- ❌ 在 git repo 沒 init 的情況下亂 commit（目前**不是 git repo**，先不 commit）
