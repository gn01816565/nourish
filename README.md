# 啾啾日常 ChickaDay 🐣

> 在瀏覽器分頁旁陪你工作的小雞，會肚子餓、會撒嬌、會長大。
> 五分鐘照顧一次就能養出獨一無二的牠。

[![No build step](https://img.shields.io/badge/build-none-brightgreen)](#快速開始)
[![PWA](https://img.shields.io/badge/PWA-ready-blue)](#pwa-把遊戲裝到手機)
[![Pure JS](https://img.shields.io/badge/JS-vanilla-yellow)](#技術)

---

## 它是什麼

**啾啾日常**是一款**療癒系養成網頁遊戲**，主角是一隻小雞，從蛋孵化、雛雞、幼雞到成雞，照顧得好不好決定它長成 7 種終態之一（健康、圓潤、迷因、戰鬥、智慧、歌姬、神雞）。

設計核心：

- **五分鐘小確幸**：每次上線 5 分鐘，看狀態、餵食、玩耍、進化倒數
- **不會死、不焦慮**：最壞下場是養出「迷因雞」，永遠可以救回
- **可愛卡通 + 粉嫩色系**：女性向溫柔基調，圓角、愛心、星星滿滿
- **裝扮收集**：9 種飾品 / 4 個 slot（頭飾 / 臉部 / 項鍊 / 翅膀），可同時穿戴
- **一隻又一隻**：進化後可開新蛋，飾品 / 圖鑑 / 成就跨命繼承
- **零下載、零帳號**：純瀏覽器，本機 localStorage 存檔，可裝成 PWA

---

## 快速開始

需求：任何能跑靜態檔案的方法。

```bash
# 在 repo 根目錄
python3 -m http.server 8765
# 開瀏覽器
open http://localhost:8765/
```

就這樣。沒有 npm install、沒有 build step、沒有後端。

---

## PWA：把遊戲裝到手機

開 https://（你的部署網域） 後：

- **iOS Safari**：分享 → 加到主畫面
- **Android Chrome**：自動跳「安裝啾啾日常」橫幅
- **桌機 Chrome**：網址列右側「安裝」icon

裝完後：全螢幕、無瀏覽器 UI、離線啟動、像 native app。

---

## 玩法速覽

| 階段 | 時長 | 解鎖 |
|------|------|------|
| 🥚 蛋 | 6 小時 | 摸頭、對話 |
| 🐣 雛雞 | 1 天 | + 餵食、玩耍、洗澡、取名 |
| 🐤 幼雞 | 2 天 | + 進階互動 |
| 🐔 成雞 | 永久 | + 全部 5 種玩耍、進化終態揭曉 |

**進化分支**取決於你怎麼養：餵太多 → 圓潤雞、玩太多打沙包 → 元氣雞、長期心情低 → 迷因雞、四項都顧好 → 神雞。

**每天**：登入領 30 FC、做 3 個小任務、湊 9 條 wants 拿翻倍獎勵、抓 7 種隨機事件。

---

## 主要功能

- 🐣 4 階段養成 + 7 種進化終態
- 📊 4 大狀態（飢餓 / 心情 / 清潔 / 體力）+ 線上/離線衰減 + 12h 封頂
- 🎮 14 種互動（5 餵食、5 玩耍、洗澡、3 愛撫）
- 🎲 7 種隨機事件（撿幣、彩虹、糖果、流星…）
- 💖 9 條 wants「啾啾主動表達欲望」系統
- 📅 每日任務 + 連續登入獎勵
- 🏅 25 條成就
- 📖 圖鑑紀錄歷代寵物（含當時穿搭 snapshot）+ 點擊查看詳情
- 🎀 9 件飾品 / 4 slots 可同時穿戴
- 📸 分享卡（現役 + 紀念卡兩版本，Web Share API + 下載 fallback）
- 🔔 推播通知（背景時 stat < 20 自動提醒）
- 💬 85 句 contextual 對白（時段 / 階段 / 終態 / 老年 / want 抱怨）
- 🎵 8 種程序合成音效（Web Audio API，零外部音檔）
- ⌨️ 鍵盤捷徑（1-5 互動、A 成就、D 圖鑑、S 設定、N 取名、ESC 關 modal）
- 💾 存檔匯出 / 匯入（base64 字串攜帶）

---

## 技術

零依賴 vanilla web。

```
無 build step
無 framework
無 npm 套件
```

```
./
├── index.html          ← 入口
├── manifest.json       ← PWA 設定
├── sw.js               ← Service Worker（離線快取）
├── robots.txt          ← 搜尋引擎索引規則
├── sitemap.xml         ← Search Console 用
├── src/
│   ├── cfg.js          ← 純資料（CFG → window.NourishCFG，12 個結構化 block）
│   ├── ui.js           ← Modal / toast / speak / onboarding → window.NourishUI
│   ├── dex.js          ← 圖鑑儲存層 → window.NourishDex
│   ├── achievements.js ← 成就規則引擎 → window.NourishAchievements
│   ├── audio.js        ← Web Audio API 程序合成 → window.NourishAudio
│   ├── share.js        ← 分享卡 Canvas 渲染 → window.NourishShare
│   ├── game.js         ← 業務邏輯 + UI（IIFE）
│   └── style.css
├── scripts/
│   ├── run-checks.sh   ← 一鍵 deploy gate（7 檔 syntax + sw.js + 3 lint）
│   ├── check-sw-shell.js   ← 防 sw.js APP_SHELL ↔ index.html script 飄移
│   ├── check-assets.js     ← 驗 60+ 個 assets/ 路徑檔案實存
│   └── check-cfg-schema.js ← cfg.js 內部 cross-ref + 數值 invariant（13 條）
├── assets/
│   ├── images/         ← Pixar/Sanrio 風 PNG（DreamShaperXL Turbo + rembg）
│   ├── svg/            ← SVG 占位圖（角色、配件、事件）
│   └── icons/          ← PWA icon set 9 尺寸 + 2 maskable
└── docs/
    ├── gdd.md             ← Game Design Document（核心參考）
    ├── character-sheet.md ← 美術 / 角色設定書（生圖前必讀）
    ├── market-research.md + market-research-2026.md  ← 競品 / 趨勢 / 部署 growth
    ├── review.md / review-v2.md  ← 程式 review（多數已 ✅ DONE）
    ├── extensions.md      ← v0.2 / v0.3 / App 路線圖
    ├── multipet-plan.md   ← v0.4 多寵物規劃
    ├── deploy.md          ← 部署 + Search Console SOP
    ├── launch-plan.md     ← 30 天 launch 戰術 (W1-W4 短片 / KPI / KOL 模板)
    ├── launch-tiktok-prompts.md ← W1 7 條短片 cover 圖 prompt
    └── iteration-log.md   ← 自動循環開發日誌
```

模組依賴鏈靠 `<script>` 順序當依賴系統，無 import：

```
cfg.js → ui.js → dex.js → achievements.js → audio.js → share.js → game.js
```

---

## 文件導讀

| 文件 | 給誰看 |
|------|-------|
| [`docs/gdd.md`](docs/gdd.md) | 想動數值或加新終態的人 |
| [`docs/character-sheet.md`](docs/character-sheet.md) | **生圖之前必讀** — 5 項視覺 DNA + 9 色色票 + 女性向 TA 約束 |
| [`docs/market-research.md`](docs/market-research.md) + [`market-research-2026.md`](docs/market-research-2026.md) | 競品分析、市場機會、變現路徑 |
| [`docs/review.md`](docs/review.md) + [`review-v2.md`](docs/review-v2.md) | Code & gameplay review，P0/P1/P2 修復追蹤 |
| [`docs/extensions.md`](docs/extensions.md) | v0.2 / v0.3 / App 階段路線圖 |
| [`docs/iteration-log.md`](docs/iteration-log.md) | 每輪自動循環做了什麼（最新狀態以此為準）|
| [`docs/deploy.md`](docs/deploy.md) | 部署 GitHub Pages / Cloudflare / 自家 VPS 步驟 + cache-busting + Search Console SOP |
| [`docs/launch-plan.md`](docs/launch-plan.md) | 上線 30 天戰術手冊（W1-W4 短片 / KPI / KOL DM 模板 / 緊急 SOP） |
| [`docs/launch-tiktok-prompts.md`](docs/launch-tiktok-prompts.md) | W1 7 條短片 cover 圖 SDXL/Niji prompts（Session B 美工接力用）|
| [`docs/multipet-plan.md`](docs/multipet-plan.md) | v0.4 多寵物 schema / sprint 規劃 |
| [`CHANGELOG.md`](CHANGELOG.md) | 版本變更總表（v0.1 → v1.0） |
| [`CLAUDE.md`](CLAUDE.md) | 雙 session 協作 + 自主模式約定 + cfg-driven 架構說明 |

---

## 開發協作

本專案以「**自主多 agent 雙 session 協作**」模式進行：

- **Session A**：程式邏輯、cfg.js、game.js、互動 / 成就 / 文案
- **Session B**：美術 PNG（ComfyUI + DreamShaperXL Turbo + rembg）、PWA icon、視覺一致性
- 每 10 分鐘 cron 推一輪小修小補
- 共用 `docs/iteration-log.md` append-only 當交接介面
- 衝突解決協議見 `CLAUDE.md` §6

新加配件 / 互動 / 成就 → 改 `cfg.js`（純資料）即可，邏輯不必動。
新加 SVG → 直接放 `assets/svg/`，PNG 路徑等 Session B ComfyUI 跑出後改 cfg。

---

## License

尚未定。專案目前處於私人開發階段。

---

## 致謝

- 主要 TA 設計參考：Tamagotchi 的責任感、Neko Atsume 的零壓力、Adopt Me 的進化分支收集
- 美術風格：Pixar / Sanrio plush 風（女性向粉嫩調）
- 程序合成音效：Web Audio API + OscillatorNode envelope
- 開發協作：Claude Sonnet 4.6 / 4.7 雙 session

---

> 一起來養屬於你的小雞 🐣💕
