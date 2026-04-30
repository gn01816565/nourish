# iter#65-100 Retrospective — 36 輪 cron 自主開發回顧

> 寫於 2026-04-29（iter#100 milestone）。本檔涵蓋 user 重啟 cron 自主推進後的 36 輪（每輪 10 分鐘）累積成果與學習。
> 配對：[`retrospective-50.md`](retrospective-50.md)（更早的 sub-agent v3 review，A- 評等，2026-04-28）。
> 性質：**內部 dev journal**，已在 `robots.txt` Disallow，不該被搜尋引擎收錄。

---

## 1. TL;DR

- **修 1 個 P0**：iter#97 render() TDZ ReferenceError（潛伏多輪，static lint 全沒抓到）
- **lint chain 從 0 → 5 件**：sw-shell / assets / cfg-schema / run-checks 一鍵 / **render-smoke**（iter#98 後 runtime safety net 上線）
- **cfg-driven 12 結構化 block + 13 條 invariant**：v0.3 加新事件 / 終態 / 配件 / 進化分支大半只動 cfg.js
- **review-v2 完成度從 0 → 78%**（14/18，6 P1 + R-2 + 7 P2 全 ✅，剩 R-1/R-4/R-5/P2-1/P2-9 大重構）
- **launch playbook 三件套就位**：market-research-2026 §6/§7 戰略 + launch-plan.md 30d 戰術 + launch-tiktok-prompts.md 7 cover 圖 prompts
- **玩家可感改進 5 件**：A2HS 橫幅 / streak tooltip / bubble + petal 隨機事件 / adult 階段 stage-hint
- **game.js 行數穩定在 1965-1985 區間**（warning 線 2000），未觸發 R-1 拆 IIFE
- **無 git** — iteration-log.md 是唯一 audit trail

---

## 2. iter#65-100 階段時序

| 階段 | 輪次 | 主題 | 產出 |
|------|------|------|------|
| **部署武裝** | 65-69 | SEO + lint chain 1.0 | robots/sitemap/canonical/JSON-LD/3 lint/run-checks |
| **launch playbook** | 70-72 | 戰略 → 戰術 → 圖像 | market-research §6 / launch-plan / tiktok-prompts |
| **架構整理 1.0** | 73-74 | menu config-driven + cfg schema lint | interactionMenus + 5 條 invariant |
| **review-v2 sweep** | 75-79 | P1 全 6 條 + 多項 P2 | review-v2 doc 維護 + 多項實作 |
| **UX + cfg refactor** | 80-83 | streak tooltip / R-3 helper / traitsDisplay / speech | 6 條新 invariant |
| **init refactor + 文檔對齊** | 84-85 | wireUp* helpers / launch-prompts / 清歷史註解 | game.js init body 132 → 25 |
| **內容 + cfg-driven 化** | 86-91 | 新事件 / finalForms cfg / events apply cfg / adult hint | bubble + petal events |
| **文檔同步 + Q2 市調** | 92-94 | README / iter#93 WebSearch / launch tactics 落地 | mix-and-match aesthetic 4+2+1 |
| **P2-3 + render refactor** | 95-96 | resetRenderCaches / computeStageHint pure fn | review-v2 78% |
| **P0 修復 + safety net** | 97-99 | TDZ fix / smoke test / computePetSrc | 5th lint script |
| **milestone 總結** | 100 | 本檔 retrospective | iter#65-100 doc |

---

## 3. 關鍵學習（順序按嚴重度）

### 3.1 Static lint 抓不到 runtime bug（**iter#97 教訓**）

iter#67-96 寫了 4 個 static lint script（檔案存在 / SW shell / cfg cross-ref / cfg shape），但**全是靜態檢查**。iter#97 的 TDZ ReferenceError（`petImg` 在 const 宣告前使用）潛伏多輪沒被抓到 — `node --check` 只看 syntax，TDZ 是 runtime 才 fire 的錯誤。

**對策**：iter#98 寫 `check-render-smoke.js`（vm sandbox + 最小 DOM stub），跑 game.js init+render 一次。注入 TDZ 模擬 → smoke test 立即 fail。

**未來 takeaway**：每加新 helper / 改 hot path 都應跑 smoke test。靜態驗證 + 動態 smoke 是雙保險。

### 3.2 Cfg-driven 是 v0.3 內容擴充的解法

iter#73 把 menu items 搬 cfg → iter#82 traitsDisplay → iter#87 finalForms / stageLabels → iter#90 events.applyEffects（13 條 handler 改 data-driven）→ iter#91 加 1 個事件**零 game.js 改動**驗證。

**結論**：v0.3 / v0.4 加配件 / 事件 / 終態 / 進化分支，**Session B 應該完全不必碰 game.js**。cfg.js 加 entry + 加圖片 / SVG 即可，cfg-schema lint 即時驗證。

### 3.3 Game.js 行數警戒可以靠 cfg-driven 抗壓

從 iter#84 高點 1983 → iter#90 1974（events cfg 化拿回 6 行）→ iter#99 1983 但 **render() body 縮短 ~56 行**（iter#96 + iter#99 兩個 pure fn 抽取）。

警戒線 2000 沒觸發 = R-1（拆 IIFE）可以**繼續延後**。但若 v0.3 加大量 UI 邏輯，仍需評估。

### 3.4 雙 session 撞檔避免靠協議而非鎖

CLAUDE.md §6 的 INTENT 占位 + cron 錯峰（A 偶數分 / B 奇數分 + 7 min 偏移）這 36 輪沒發生過撞檔。Session A 嚴守 src/ + scripts/ + iteration-log，Session B 嚴守 docs/image-prompts + character-sheet + assets/images PNG。

---

## 4. 還可做的 backlog（依 ROI 排序）

### High ROI（v0.3 上線前該做）

1. **R-1 拆 game.js IIFE 為多 script**：1981 行單檔已逼近 maintainability 邊界。預估 60-90 min 重構。
2. **State mutation smoke test 擴充**：iter#98 只測 init+render，performInteraction / maybeEvolve / handleDailyLogin 沒測。
3. **完整 i18n hook 預留（P2-9 / R-5）**：海外曝光必備，CFG 內中文字串硬編碼是天花板。

### Medium ROI（v0.3 中期再評估）

4. **R-4 中央化 timer / animation 生命週期**：iter#79 wireUp* 處理一半，animation timeout 還散落。
5. **桌面陳列 og image 自動生成**：iter#93 §7.1 指出 Weyrdlets 競品有「陳列向」UX，啾啾可學。
6. **新增 v0.3 配件 SVG / cfg entry**：cottagecore / coquette 配件擴充（與 launch-tiktok-prompts §1.2 Fri 短片同步）。

### Low ROI（後台維護）

7. **render 剩餘 sub-block 抽 pure function**（accessory overlays / mood / sleep / wants / streak）— 同 iter#96/99 模式，但邊際遞減。
8. **WebSearch v0.4 multipet 競品 / AI 對話寵物 Q3 2026 動向**。

---

## 5. 玩家可感改進清單（iter#65-100）

| iter | 動作 | 類型 |
|------|------|------|
| 71 | A2HS 提示橫幅（玩 5 分鐘後彈） | UX |
| 80 | Streak counter tooltip + cursor:help | UX |
| 86 | 隨機事件「肥皂泡」 | 內容 |
| 89 | Adult 階段 stage-hint（3 條 post-evolution 提示） | UX |
| 91 | 隨機事件「花瓣飄落」 | 內容 |
| 97 | render() 修 TDZ → 玩家終於看到完整 UI | P0 修復 |

---

## 6. 文檔與運維就緒度

✅ **deploy-ready**（部署 GitHub Pages 立即上線）
- SEO 三件套（meta / canonical / JSON-LD / robots / sitemap）
- PWA 完整（manifest / SW / 11 icons / shortcuts / screenshots）
- 5-step run-checks deploy gate（< 1 秒跑完）
- launch-plan 30d 戰術手冊（W1-W4 短片 / KPI / KOL DM 模板 / 緊急 SOP）

⏳ **launch-pending**
- 部署 URL 未實際 push（仍 localhost:8765 開發中）
- Search Console 提交流程已 SOP 化（deploy.md §11）但未跑
- KOL 名單未開始洽談

---

## 7. 給下個 cron 階段的建議

如果繼續 cron 自主推進：
- **每 10-15 輪做 1 次 WebSearch cross-check**（iter#70 / iter#93 模式），市場變動快
- **每加 ~5 個 helper / cfg block 做 1 次 review-v2 status sweep**，避免 stale backlog
- **遇到 game.js > 1990 立即觸發 R-1**，不要拖到觸線
- **每 30+ 輪寫 1 次 retrospective**（本檔模板），給未來 agent 留 context

如果準備正式 launch：
- 跑 `./scripts/run-checks.sh` 全 5 step 確認綠
- bump CACHE_VERSION 為當天日期 + 加 launch tag
- 部署 GitHub Pages / Cloudflare Pages（deploy.md §1-5）
- W1 Day 1 動作清單（launch-plan §1.1）— 8 項 ~2h 跑完
- iter#100 retrospective + iteration-log 一起送 Search Console（自然外鏈來源）

---

## 8. 致謝

iter#65-100 由 user 啟動 cron 自主模式後，主 agent 在每 10 分鐘 budget 內推進完成。Session B（內容 / 美工）並行貢獻 PNG 配件 + character-sheet + market-research v1。lint chain 5 件 / 13 條 invariant / cfg-driven 12 block 是這段最重要的長期資產 — 它們讓 v0.3 / v0.4 內容擴充的單位成本指數級下降。
