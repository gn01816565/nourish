# iter#100-134 Retrospective — 35 輪 cron 後續推進回顧

> 寫於 2026-04-30（iter#135）。配對 [`retrospective-100.md`](retrospective-100.md)（iter#65-100 共 36 輪）。
> 涵蓋 iter#100 milestone 後 35 輪推進累積。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **R-1 拆 IIFE 從 plan 進入實作**：5 個 micro-step 抽 11 個純工具 → utils.js，game.js -38 行
- **i18n 從 8% → 16%**（locale-coverage 量化）+ 12 個批次替換（functional 涵蓋 ui.js/share.js/index.html/wants/accessories/interactions/部分 toasts）
- **17→19 events** + 13→16 accessories（v0.3 6 美學軸補完）
- **review-v2 完成度 78% → 83%**（+P2-3 ✅，剩 R-1/R-4/R-5/P2-1/P2-9）
- **3 次 WebSearch cross-check**（iter#70/93/118）累計 22+ source URL，launch playbook 戰術可信賴
- **lint chain 5 件持續**：smoke test 連 3 次抓 P0 bug（iter#97 TDZ / iter#101 stub gap / iter#106 shadow）
- **launch / dev docs 從 6 → 9 份**（+ r1-plan + og-image-update + retrospective-100）

---

## 2. iter#100-134 階段時序

| 階段 | 輪次 | 主題 | 產出 |
|------|------|------|------|
| **iter#100** | 100 | retrospective-100 milestone | 8 章 36 輪總結 |
| **smoke 升級** | 101 | render smoke 1→8 scenarios | 立即抓 fakeEl style stub 漏 |
| **i18n MVP** | 104 | src/i18n.js plumbing + 12 種子翻譯 | 海外曝光 prerequisite |
| **i18n batch 1-5** | 105-109 | install banner / stage hints / onboarding × 2 / helpDialog | ui.js 三 modal 100% i18n |
| **i18n batch 6** | 120 | wants 雙欄位 textKey | iter#120 milestone |
| **i18n batch 7-8** | 121-122 | share.js / index.html 18 attr | coverage 11% |
| **i18n batch 9-10** | 124-125 | game.js toasts + modal titles + buttons | coverage 16% |
| **i18n batch 11-12** | 133-134 | accessories + interactions 雙欄位 + cfgLabel helper | functional 涵蓋大宗 |
| **R-1 plan** | 117 | docs/r1-plan.md 設計拆 IIFE 邊界 | 5-7 cron 輪實作藍圖 |
| **R-1 micro #1-5** | 127-131 | utils.js 抽 11 純工具 | game.js 1993 → 1955 |
| **新內容** | 102-103/110/111/112/116/119/123/132 | 6 件配件 / 4 件事件（cottagecore/coquette/cleangirl/balletcore/fairycore/y2k） | 6 美學軸覆蓋完整 |
| **WebSearch #3** | 118 | Q2 H2 cross-check + Lighthouse audit | market-research §7.7 |
| **docs 補強** | 126 | og-image-update SOP | iter#118 deferred 兌現 |

---

## 3. 關鍵學習（iter#100-134）

### 3.1 雙欄位 i18n 策略 vs 單欄位 trade-off

**雙欄位（labelKey + label fallback）**：cfg.wants / cfg.accessories / cfg.interactions
- ✅ 安全：i18n.js 載入失敗時 fallback 到 cfg 字面
- ✅ 漸進：可分批替換 use sites
- ❌ coverage stat 不動（locale-coverage 仍計入 cfg.label）
- 適用：cfg 內 broad 引用的 label

**單欄位（純 t()）**：share.js / game.js toast / index.html data-i18n
- ✅ coverage stat 真實移動
- ✅ 維護簡單
- ❌ i18n 缺 → key 字面顯示（debug-friendly 但玩家 confused）
- 適用：use site 集中 / 字串獨立的場景

iter#100-134 累積經驗：**兩種策略並存最佳**。長期可寫 cleanup PR 移除 fallback。

### 3.2 R-1 micro-step pattern 證明可行

iter#127-131 抽 11 純工具用 5 輪完成（每輪 10 min）。比 r1-plan 原本「round 1 = 30+ min」的設計安全：
- 每輪 1-4 個函式
- thin wrapper 透傳 → use site 不變
- smoke test 立即驗證
- buffer 從警戒 7 → 安全 45

**啟示**：state.js 抽 280 行 ≠ 1 輪 30 min，可拆 6-8 輪 micro。每輪 50-80 行可控。

### 3.3 Smoke test 連續 3 次抓 P0 bug（ROI 已驗證）

| iter | 抓到的 bug | 影響 |
|------|----------|------|
| 97 | TDZ ReferenceError on petImg | render 中段全死 |
| 101 | fakeEl style.setProperty stub 漏 | egg 階段粒子動畫 throw |
| 106 | const t shadow i18n wrapper | task footer 永久 throw |

**iter#67 寫 lint chain 時的投資，iter#97/101/106 已連 3 次回本**。預期 v0.3 launch 前還會抓 1-3 次。

### 3.4 連續 zero edits to game.js 是 cfg-driven 健康度指標

iter#107-114 連 8 輪 zero edits / iter#115-124 連續 cfg-driven 變化少 game.js 觸碰。
- 加配件 / 事件 / cfg 結構：完全不動 game.js（iter#90 events / iter#73 menu / iter#82 traits / iter#87 finalForms 等架構就位）
- 加 i18n 新 key：cfg.js + i18n.js + 偶爾 1-2 處 game.js
- **R-1 micro-step 才會主動修 game.js**（用 wrapper 過渡）

zero-edit streak 是 cfg-driven 設計成熟度的健康度指標。v0.4 multipet 加新功能時，目標仍是「game.js 改動最小」。

---

## 4. 還可做的 backlog（依 ROI 排序）

### High ROI（v0.3 上線前）

1. **R-1 round 1 真正 state.js 抽出**：5 個 micro-step 後剩下 state-handling functions（load / save / migrate / startNewEgg / reconcileOffline）。建議拆 4-6 個 micro-step。
2. **i18n 第 13 批 achievements label/desc**（30 × 2 = 60 條，中型批次）
3. **i18n 第 14 批 cfg.speech 46 pools**（最大宗 230+ 條，需要 spawn-time t() 解析機制設計）

### Medium ROI（v0.3 中期）

4. **R-4 中央化 timer / animation 生命週期**（partial done in iter#79，剩 animation timeout）
5. **桌面陳列 og image 自動生成**（vs Weyrdlets，iter#93 §7.1 提到）
6. **新增 v0.3 配件 PNG**（6 個 SVG fallback 待 Session B 升級）

### Low ROI（後台維護）

7. **render 剩餘 sub-block 抽 pure function**（accessory overlays / wants bubble 等）
8. **WebSearch v0.4 multipet 競品 / AI 對話寵物 Q3 2026 動向**
9. **整理 docs/iteration-log.md**（已 4500+ 行，可考慮分檔）

---

## 5. 玩家可感改進清單（iter#100-134）

| iter | 動作 | 類型 |
|------|------|------|
| 102 | 蝴蝶髮夾 + 蕾絲領片配件 | 內容 |
| 103 | 自然腮紅配件 | 內容 |
| 105-109 | i18n install banner + stage hints + onboarding 三 modal + helpDialog 全英文化 wired | UX (海外) |
| 110 | 芭蕾蝴蝶結配件 | 內容 |
| 111 | 跨年煙火事件 | 內容 |
| 112 | 端午粽子事件 | 內容 |
| 116 | 星星髮夾配件 | 內容 |
| 119 | 鐳射光碟墜飾配件 | 內容 |
| 122 | header / stats / actions 18 處英文化 wired | UX (海外) |
| 123 | 小蘑菇事件 | 內容 |
| 132 | 下午茶事件 | 內容 |
| 133-134 | 16 配件 + 14 互動 全可切換語言 | UX (海外) |

---

## 6. 文檔與運維就緒度（iter#134 後）

✅ **deploy-ready**（部署 GitHub Pages 立即上線）
- iter#65-69 SEO 三件套
- iter#100 retrospective + iter#117 r1-plan + iter#126 og-image-update SOP
- iter#118 Lighthouse audit 進 deploy.md §6 部署後驗證
- 5-step run-checks deploy gate（< 1 秒）
- launch-plan 30d 戰術 + tiktok-prompts 7 cover 圖

✅ **i18n-ready**（zh-TW / en 雙語可切換）
- 137 種子翻譯
- ui.js / share.js / index.html / wants / accessories / interactions 全 functional
- 海外 launch 切 locale 主要 UI 全英文

⏳ **launch-pending**
- 部署 URL 未實際 push
- Search Console 提交流程已 SOP（deploy.md §11）但未跑
- KOL 名單未開始洽談
- 6 個 v0.3 配件 SVG 待 Session B 升級為 PNG

---

## 7. 給下個 cron 階段的建議

如果繼續 cron 自主推進：
- **每 10-15 輪做 1 次 WebSearch cross-check**（iter#70/93/118 模式）— 下次 ~iter#150
- **每加 ~5 個 cfg block / helper 做 1 次 review-v2 status sweep** — 避免 stale backlog
- **R-1 micro-step pattern 持續**：每輪 1-4 函式進 utils.js / state.js / 其他 module
- **每 30+ 輪寫 1 次 retrospective**（本檔模板）— 下次 ~iter#165

如果準備 v0.3 正式 launch：
- 跑 `./scripts/run-checks.sh` 全 5 step 確認綠
- 跑 Lighthouse PWA audit ≥ 90
- bump CACHE_VERSION 為當天日期 + launch tag
- 部署 GitHub Pages（deploy.md §1-5）+ 跑 §11 Search Console SOP
- W1 7 條短片用 launch-tiktok-prompts 風格
- W4 後跑 og-image-update SOP 第一次

---

## 8. 致謝

iter#100-134 由 user cron 自主模式持續推進。從 retrospective-100 結束時 game.js 1932 / lint 5 件 / i18n 0% 開始。35 輪後：
- game.js 1955（buffer 45，從 buffer 7 警戒區回到安全區）
- lint 5 件持續抓 P0 bug
- i18n 16%（**但雙欄位 functional 已涵蓋幾乎所有 user-facing UI**）
- R-1 進入實作階段（11 純工具 utils.js）
- launch playbook 三件套 + 9 份 dev/launch docs

下一個 30 輪 arc 預期：
- R-1 完整實作 → game.js < 1500 行
- i18n 100% functional（含 speech）
- v0.3 正式 launch 並收集首批玩家反饋
