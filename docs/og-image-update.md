# og:image 與 share card 更新 SOP

> 寫於 2026-04-29（iter#126）。回應 [`market-research-2026.md`](market-research-2026.md) §7.7「GSC 2026 升級為 AI 解讀 dashboard，內容品質要求嚴格」— 啾啾日常 OG image 與 share card 是 SEO 與社群分享第一印象，定期更新讓 AI 重新分類認可。
>
> 性質：**內部維護 SOP**，已在 `robots.txt` Disallow 不該被搜尋引擎收錄。

---

## 1. 為什麼需要更新節奏

### 1.1 GSC AI 解讀效應
2026 GSC「Indexing report 是 classification 不是 discovery」（[Pansofic GSC 2026 guide](https://www.pansofic.com/blog/google-search-console-in-2026-pansofic-solutions)）：
- AI 第 1 次爬 → 看 og:image / JSON-LD / canonical 內容 → 分類「這是什麼站」
- 「Thin / 重複 page 會被 skip」 — 內容停滯 = 重新分類意願低
- 玩家分享頻率下降 = AI 認為內容過時 = 排名下滑
- **行動週期：每 2-3 個月更新 og:image**，對 AI 重新分類釋放新訊號

### 1.2 社群分享觸發點
玩家把 share card 貼 IG / Threads / TikTok comment 區時，img preview 會展示 og:image：
- 一張過時的「啾啾日常 v0.1」OG → 看到的人覺得「這遊戲沒在動」
- 一張月度更新「v0.3 配件擴充」OG → 「他們持續在做新內容」
- 「哇有 16 件配件了」這種有 dynamic 的 og 主題 = 社群轉貼意願高

---

## 2. 哪些素材需要定期更新

### 2.1 og:image（`assets/images/og-image.png`）
- 規格：1200 × 630（OG 標準）/ 24-bit PNG
- 內容建議：當前最新進化終態 + 前 3 件熱門配件 + 「啾啾日常 ChickaDay」logo
- 更新頻率：**每月 / 重大內容更新後**
- 先 backup 舊版 `og-image-v1.png` / `og-image-v2.png`...，方便對比

### 2.2 PWA screenshots（`manifest.json` `screenshots[]`）
- 目前：`assets/images/chick-adult-divine.png`（神雞單張）
- 建議擴增：v0.3 後加 2-3 張「裝扮搭配」/「圖鑑」/「成就」截圖
- 規格：512×512 minimum，建議 1080×1920（mobile）
- Google Play / Edge Add-ins 可吃，提高 PWA install 友善度

### 2.3 share card render（`src/share.js` Canvas 720×1280）
- 程式生成，玩家觸發時即時 render
- 不需手動更新 PNG，但**美學調整**（背景、字體、layout）每 3-6 個月可微調
- 例：當前是粉嫩漸層 + 直式 stat bar，v0.3 季可改 cottagecore 版邊框

---

## 3. 更新 SOP（步驟）

### 3.1 規劃（10 分鐘）
- [ ] 定主題：選一個當前最熱門 v0.X 內容（例：「v0.3 mix-and-match 16 配件」「跨年煙火事件」「coquette 打扮特輯」）
- [ ] 寫 1 句 caption 給 og:description 同步：「養 7 種啾啾，配 16 件粉嫩配件 + 18 種隨機事件」
- [ ] 確認本月主推 hashtag 與本素材匹配（[`launch-plan.md` §1.2](launch-plan.md)）

### 3.2 製作（30-60 分鐘 — Session B）
- [ ] 用 ComfyUI（DreamShaperXL Turbo + rembg）跑 prompt（[`launch-tiktok-prompts.md`](launch-tiktok-prompts.md) 共用 style anchor）
- [ ] 1200×630 比例設定
- [ ] 加文字 layer：「啾啾日常 ChickaDay」+ 主推賣點（≤ 25 字）
- [ ] 嚴守 [`character-sheet.md`](character-sheet.md) 5 項視覺 DNA
- [ ] backup 舊 og-image-vN.png，新存 og-image.png

### 3.3 部署 + 驗證（15 分鐘）
- [ ] `git push`（或對應部署流程）
- [ ] 跑 `./scripts/run-checks.sh` 驗 path 實存（check-assets 自動）
- [ ] **bump `sw.js` CACHE_VERSION**（PWA 玩家拿新 og image cached 版本）
- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug/) 貼 URL 強制重新爬 og
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] GSC「網址檢查」→「測試線上版本」確認 og 重新讀取
- [ ] Discord 私訊自己 URL → 看預覽是新版

### 3.4 social signal boost（30 分鐘）
- [ ] 把新 og image 截圖分享一條 TikTok / Reels / Threads
- [ ] caption 提及「全新 og image」+ 「持續推進中」
- [ ] 給 GSC AI 一個社群熱度訊號 → 加快重新分類

---

## 4. 何時不該更新

- ❌ 部署初期 < 2 週：GSC 還沒第一次完整爬，重 update 反而干擾
- ❌ 內容沒變動：og 換新但實際 page 沒新東西 = AI 看穿 = 反效果
- ❌ 連續 3 個月無玩家活動數據反饋：先穩 launch + 收 data 再優化
- ❌ Lighthouse PWA 分數 < 80 時：先修技術問題再美化

---

## 5. 跟進 OKR

每次更新後留 14 天觀察視窗，記入 [`iteration-log.md`](iteration-log.md)：
- GSC「平均排名」變化（搜「啾啾日常」/「ChickaDay」）
- IG / Threads 分享 caption 帶 og 預覽的轉貼率
- TikTok bio link 點擊量
- PWA install 量（無 telemetry，靠玩家社群觀察）

預期效果：
- **更新後 1-2 週**：搜尋排名小幅上升（5-15%），主要因為 AI 重新分類
- **更新後 1 個月**：分享 CTR 提升（社群效應）
- **更新 3 次後**：建立「持續 active」品牌印象

---

## 6. 第一次更新（本檔寫於 iter#126，等 launch 後啟動）

當前 og image 為 `assets/images/og-image.png`，內容主題 v0.1 蛋孵化（推測 Session B v1 PNG）。

預計第一次更新時機：
- ✅ Pre-condition：launch ≥ 2 週 + W2 第一條短片爆紅 + Lighthouse ≥ 90
- 主題候選：「啾啾日常 v0.3 — 16 配件 6 美學軸」
- 預計 deliverable：og image v2 + sw.js CACHE_VERSION bump + Threads thread post

---

## 7. 追蹤紀錄

| 時間 | og 版本 | 主題 | 觸發 | 結果 |
|------|---------|------|------|------|
| iter#34 | v1 | v0.1 蛋孵化 | PWA 上線 | 基準 |
| TBD | v2 | TBD | TBD | TBD |

第一次正式更新會回填本表第 2 行。每 2-3 個月加 1 行。
