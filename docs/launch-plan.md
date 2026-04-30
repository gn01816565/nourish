# 啾啾日常 ChickaDay — Launch Plan（30 天上線推進）

> 寫於 2026-04-29（iter#72，iter#94 補 mix-and-match 微調）。把 [`market-research-2026.md`](market-research-2026.md) §6 的戰術從「研究結論」轉成「明天就能照做的清單」。
> 主要 TA：18-35 歲女性、中文圈、療癒系遊戲玩家。
> 主要曝光路徑：**TikTok / Instagram Reels / YouTube Shorts** 短影音 × **mix-and-match** 美學（`coquette` 主軸 + `cleangirl` `balletcore` `cottagecore` 平行測試 — iter#93 §7.3）。
> 預算上限：$200（W2 Paid Organic 試水），其餘全為時間投入。
>
> **Tagline（iter#94 對 Weyrdlets 競品差異化）**：「**開連結即玩、零下載、零帳號**的桌邊小寵物」 — 「0 下載」是 ChickaDay 對 Weyrdlets 等下載型 idle pet 的核心 USP，每條短片 caption 都該帶到。

---

## 0. Pre-launch Checklist（部署前必過）

部署 GitHub Pages 之前，**這些不通過不要 push**：

### 0.1 程式 / 部署
- [ ] `./scripts/run-checks.sh` 全綠（7 檔 syntax + sw.js + 2 lint）
- [ ] `sw.js` CACHE_VERSION 為當天日期 + sub-tag
- [ ] `manifest.json` 的 `start_url` / `scope` 與部署 URL 一致
- [ ] `index.html` 的 `<link rel="canonical">` 指向實際部署 URL
- [ ] `sitemap.xml` 的 `<loc>` 與 `<lastmod>` 正確
- [ ] `robots.txt` 的 `Sitemap:` 指標正確

### 0.2 美術 / 內容
- [ ] 7 個 PNG 終態 form 圖都到位（`assets/images/chick-adult-*.png`）
- [ ] 9 個配件 PNG 都到位（已 lint 守住）
- [ ] OG image (`assets/images/og-image.png`) 1200×630 / 視覺主圖
- [ ] 至少 1 張 PWA screenshot（`assets/images/chick-adult-divine.png` 已存）
- [ ] 圖鑑解鎖時的祝賀文案不出戰鬥詞彙（CLAUDE.md TA 限制）

### 0.3 SEO 武裝（iter#59-69 已鋪好，再過一次）
- [ ] meta description / keywords / theme-color
- [ ] OG / Twitter card 全 7 條
- [ ] JSON-LD VideoGame schema（送 schema.org validator 驗）
- [ ] apple-touch-icon × 3 sizes
- [ ] manifest icons × 11 entries

### 0.4 玩家入口體驗
- [ ] Onboarding 第一次進來的 modal 流程順
- [ ] A2HS 橫幅 5 分鐘後正常滑入（iter#71）
- [ ] iOS Safari 上「分享 → 加到主畫面」直接給獨立 app 體驗
- [ ] 錯誤處理：localStorage quota 滿時有 toast 提示

### 0.5 監測 / 反饋
- [ ] 沒有 error reporting（隱私優先，不加）— 但**保留管道**：在設定頁第三 tab 加「📤 匯出存檔給開發者」，玩家撞 bug 可貼字串給我
- [ ] Search Console property 已建好（不需驗證 — 等部署後驗）
- [ ] Bing Webmaster 預先建 property（同樣等驗）

**過不了的處理**：寫進 iteration-log.md，下輪 cron 修。**不要為了趕 W1 跳過 0.x 任一條** — 一次破壞性首發勝過 10 次 polish。

---

## 1. W1：Search Console 提交 + 第一波短片

**目標**：100 unique players / Search Console 顯示「正在處理」

### 1.1 W1 Day 1（部署日，2 小時）

| 順序 | 動作 | 工具 |
|------|------|------|
| 1 | `git push` 部署 | terminal |
| 2 | 開部署 URL 自己玩 30 分（onboarding / 餵食 / 玩耍 / 進化 / 圖鑑） | browser |
| 3 | iPhone 上 Safari 開同 URL，分享 → 加到主畫面，確認 standalone | iPhone |
| 4 | Search Console 加 property → meta tag 驗證 → 提交 sitemap.xml | GSC |
| 5 | Bing Webmaster import GSC | BWT |
| 6 | 跑 https://search.google.com/test/rich-results 看 JSON-LD ✓ | Rich Results Test |
| 7 | 跑 https://pagespeed.web.dev/ → mobile / desktop | PSI |
| 8 | 跑 https://validator.schema.org/ 貼 JSON-LD | Schema validator |

### 1.2 W1 內容日程（7 條短片，每天 1 條）

**主題**：玩家第一視角 × coquette/cottagecore 美學

| Day | 標題 | 形式 | Hashtag | 預期觀眾 |
|-----|------|------|---------|----------|
| Day | 標題 | 形式 | Hashtag | TA | 美學軸 |
|-----|------|------|---------|----|--------|
| Mon | 「我桌面新養的小寵物」 | 螢幕錄製，從蛋孵化到變雞，倍速 30s | `#coquette #pinkaesthetic #cozygame #virtualpet` | 上班族女性 | coquette |
| Tue | 「療癒系養雞 ASMR」 | 餵食音效 + 摸頭音效，無人聲 30s | `#cleangirl #asmr #softgirl` | 22-30 失眠族 | **cleangirl** |
| Wed | 「7 種雞的進化分支」 | 縮時，依序展示 7 種終態，配變裝舞台音效 | `#balletcore #virtualpet #petgame` | 養成遊戲粉 + 芭蕾粉 | **balletcore** |
| Thu | 「跟 AI 男友通話時養雞」 | 多工 meme，分割畫面，clean basics 桌面 | `#cleangirl #productivityhack #cutestuff` | 22-35 在家工作 | **cleangirl** |
| Fri | 「裝扮我的小雞」 | 9 件配件全展示，配 coquette × cottagecore 混搭音樂 | `#coquette #cottagecore #fairycore #dressup` | 18-25 二次元 | coquette × cottagecore mix |
| Sat | 「比 Tamagotchi 還可愛的免費網頁版」 | 直接對比，2025 vs 2026 風格，**強調「0 下載」** | `#coquette #tamagotchi #nostalgia #y2k` | 30+ 懷舊族 | coquette + nostalgia |
| Sun | 「為什麼我每 5 分鐘就要看一下牠」 | dev 解說 + 玩家心理（共鳴向），**「無下載分頁旁邊養」開場** | `#coquette #indiegamedev #cozygame` | 玩家社群 | coquette |

**製作規則**：
- 全部 30s 以下（TikTok / Reels 演算法偏好 ≤ 60s，30s 完播率最高）
- 第 1 秒必須有「動」（雞動 / 蛋裂開 / 配件變化）— 滑 feed 時 0.3s 內留人
- 字幕用粉色襯白底（手機可讀）
- 結尾固定一張卡：`啾啾日常 chickaday.app`（或 GitHub Pages URL）
- **不放 link in bio 之類** — TikTok 演算法討厭外導，先賺自然觸及
- **caption 必含「0 下載」字樣**（iter#94 vs Weyrdlets 差異化）— 例 caption：「在分頁旁邊養，0 下載 ✨」
- **W1 7 條 mix-and-match aesthetic test**：4 coquette + 2 cleangirl + 1 balletcore（iter#93 §7.6 結論），W2 看哪一條起飛再加碼該軸

### 1.3 W1 監測

每日 5 分鐘：
- [ ] GSC「索引 → 涵蓋範圍」 — 看到「正在處理」即可
- [ ] TikTok 後台：每條短片觀看數、完播率、互動率
- [ ] Plausible-style 自製 counter？— **不裝**（iter#65 SEO 設計目標：no telemetry）
- [ ] 用 server log 粗看：`tail -f /var/log/nginx/access.log` 數 unique IP（如果用自己 VPS）；GitHub Pages 沒 log，跳過

### 1.4 W1 KPI 校準

| 指標 | 目標 | 紅線 |
|------|------|------|
| 短片發出數 | 7 條 | ≥ 5 條 |
| 累計觀看 | 5,000+ | ≥ 1,000 |
| 單條起飛（5K+ views in 24h） | 1 條 | 0 條也可，繼續 |
| Search Console 涵蓋 | 1+ 頁 | 0 也別慌（爬蟲 24-72h） |
| Unique players（自評估） | 100+ | 30+ |

---

## 2. W2：Paid Organic 放大 + KOL 試水

**目標**：500 unique players / 1 條短片 5K+ 自然觸及

### 2.1 識別 W1 的 winner

W2 Day 1（W1 結束後）：
1. 列 W1 的 7 條短片觀看數，由高排到低
2. 抓 24h 內到 5K+ 的那 1-2 條 → 投 **$50-100 boost**（TikTok promote 介面）
3. 沒有 5K+ 的就不投 — 演算法沒給你訊號就不要逼

### 2.2 KOL 試水（1 個）

挑選標準（**全部要符合**）：
- IG / TikTok 粉絲 5K-50K（更小體感不夠真實，更大要錢）
- 內容主題：cozy / aesthetic / 桌面美學 / 文具（不要遊戲頻道，太硬）
- 中文 + 台灣 / 香港 / 馬來西亞活躍

**洽談模板**（DM）：
> 嗨，我是啾啾日常的開發者～
> 
> 看到你 [具體一篇貼文] 很有共鳴！
> 
> 我做了個免費網頁小遊戲叫啾啾日常 — 在分頁旁邊養小雞，5 分鐘看一次，零下載零註冊。完全跟你「軟軟療癒」的調性對。
> 
> 想送你一隻**客製命名**的小雞 + 一個**限定配件 SVG** 給你的觀眾下載當桌布，換一支真實玩感的開箱影片（開蛋 30s 就行），不用滿滿廣告詞。
> 
> 沒興趣也完全 ok，謝謝看完！

**$0 預算限定**：只送虛擬物 / 客製名字，不付現金 / 不送禮品卡。第一輪追求 case study 不是規模。

### 2.3 W2 內容日程（7 條，調性微調）

依 W1 的數據反饋：
- 哪個 hashtag 效果最好 → W2 持續投
- 哪個內容形式（asmr / 倍速 / 對比）效果最好 → 變化版繼續
- 不要重複完全一樣的 — 演算法偵測 duplicate 會降權

### 2.4 W2 KPI

| 指標 | 目標 | 紅線 |
|------|------|------|
| Paid Organic 投放 | $50-100 / 1 條 | 沒 winner 就 $0 |
| KOL 開箱 | 1 條成功貼出 | 0 條也照算 |
| 累計觀看（含 W1） | 30,000+ | 10,000+ |
| Unique players | 500+ | 200+ |
| PWA 安裝（A2HS） | 30+ | 10+（iter#71 banner 起作用後可估） |

---

## 3. W3：複利期，內容反饋驅動

**目標**：1,500 unique players / 第一個玩家社群（Discord 或 Threads thread）

### 3.1 內容反饋循環

W3 Day 1：
- 統整 W1+W2 共 14 條短片數據
- 找出**前 3 名**和**後 3 名**
- 前 3 名特徵 → W3 全部複用（同 hashtag、同節奏、同內容形態）
- 後 3 名特徵 → 永遠不再做

### 3.2 玩家社群種子

部署後 14 天累積 ~500 玩家，**主動建立社群**：
- **Threads thread**：「啾啾日常開發者來聊聊」— 開放問答 / bug 回報 / 新功能投票
- **Discord server**：太重，不建（玩家不一定願意裝 Discord）
- **TikTok comment 區回 100% 留言**（前 1000 玩家黏著度的核心動作）

### 3.3 W3 內容（7 條，加新軸）

| 軸 | 範例 |
|---|------|
| **玩家展示**（5 條）：W2 玩家貼文重發 | duet / stitch + 我的回應 |
| **新功能預告**（1 條）：v0.3 配件預覽 | 「下週要上 3 個新配件」teaser |
| **dev 心情**（1 條）：個人化內容 | 「為什麼我做這個遊戲」短訪談 |

### 3.4 W3 KPI

| 指標 | 目標 |
|------|------|
| 累計觀看 | 75,000+ |
| Unique players | 1,500+ |
| Threads thread 互動 | 50+ replies |
| GitHub stars（如有 repo） | 30+ |
| Search Console 涵蓋 | 主頁出現在「啾啾日常」結果 |

---

## 4. W4：A2HS 推廣 + 第一個 KOL 連動

**目標**：3,000 unique players / 100 PWA installs

### 4.1 A2HS 推廣

iter#71 的橫幅是被動觸發。W4 加主動：
- 設定頁第二 tab「⚙️ 設定」加一條「📲 裝到主畫面（解鎖通知 + 離線玩）」 — 已存在
- 在 W4 的某條短片裡**直接展示**：「點分享 → 加到主畫面」3 秒短片
- 玩家裝了 PWA → 留存率提升 +70-150%（market-research-2026.md §6.4）

### 4.2 KOL 連動 2.0

W2 的第一個 KOL 如果效果好（觀看 ≥ KOL 平均 1.5 倍） → 進階合作：
- 客製化「KOL 限定品種」雞（例如 KOL 名字 → 雞的初始名）
- 一週上 3 條合作內容（不是一次爆發）

如果 W2 KOL 效果普通 → 換人，找另一個 5K-20K 範圍。

### 4.3 W4 KPI（30 天總結）

| 指標 | 目標 | 衡量方式 |
|------|------|----------|
| Unique players（30d） | 3,000+ | 自評估 / KOL 反饋 |
| PWA installs（30d） | 100+ | iter#71 banner outcome 統計（不可遠端，靠 KOL 抽樣） |
| Day-7 留存 | 30%+ | 玩家分享頻率（無 telemetry，靠社群觀察） |
| 短片總觀看 | 200,000+ | TikTok / Reels 後台 |
| Search Console 涵蓋 | 80%+ 涵蓋率 | GSC 報表 |

---

## 5. 緊急狀況 SOP

### 5.1 W1 後完全沒人玩
**症狀**：7 條短片合計 < 1000 views

**根因檢查**（依序）：
1. **內容不夠 niche** — 太 general 的「養成遊戲」標題會被吃掉，要鎖 coquette
2. **發片時間錯** — 中文 TA 黃金時段：晚 9-11pm 台北時區
3. **第 1 秒不夠 sticky** — 重剪：把雞的「動」放到 0.3s 內
4. **hashtag 用錯** — `#tamagotchi` 是紅海，換 `#cozygame #coquettecore`

**復原動作**：暫停發片 2 天 → 重看 5 個熱門 coquette 帳號 → 模仿節奏 → W2 重啟

### 5.2 突發大量流量
**症狀**：某條短片 24h 內 100K+ views，server 撐不住

**狀況**：GitHub Pages 預設無流量上限（公開 repo 100GB/月），靜態網站 CDN 後跑得起來。**真的撐不住**才考慮：
- 切 Cloudflare Pages（更強 CDN）
- 把 PNG 壓 WebP（assets/images/* 都 < 500KB → 可降到 < 100KB）

### 5.3 Bug / 玩家負評
**症狀**：W2-W4 出現「進度沒了」「卡在某階段」回報

**SOP**：
1. **先道歉**（48h 內回所有報告，不論能不能修）
2. 請玩家匯出存檔字串（設定頁有功能）
3. 我這邊 import 看 state，diff 出哪個欄位異常
4. 修完 push → 在原 thread 回「v1.0.x 已修，重整 page 即可」

### 5.4 KOL 影片完全沒效果
**狀況**：W2 KOL 開箱發了 → 觀看數 KOL 平均的 0.3 倍以下

**根因**：KOL 受眾跟啾啾 TA mismatch（不夠 cozy / 太遊戲向 / 觀眾年齡偏 male）

**復原**：W3 不重複該 KOL 路徑，改回有機短片堆疊。**不要連續送禮給沒效果的 KOL**。

---

## 6. 30 天後（v1.0+）展望

W4 結束（部署後 30 天）的 retrospective：
- 真實達到的 KPI vs 目標 → 校準後續
- 資料反饋：哪些短片格式 / hashtag / 時段最有效 → 寫進 launch-plan.md v2
- 開始評估 v0.3 路徑（GDD §10.3 已預留）
- 開始評估付費功能（market-research-2026.md §4.1）

**不要在 W4 就決定**：v0.3 / 付費 / 多寵物擴充。等真實玩家行為告訴你。

---

## 附錄 A：常用 hashtag 庫（iter#94 mix-and-match 重整）

**美學軸（每條短片從這 4 軸選 1 個主軸）**：
- **`#coquette`** — 18B+ TikTok views（iter#93 §7.3），mainstream 主軸，4/7 條短片
- **`#cleangirl`** — 簡約 + 柔，與 coquette 互補 mix，2/7 條短片（W1 Tue/Thu）
- **`#balletcore`** — coquette 姊妹流派，rising，1/7 條短片（W1 Wed 進化展示用）
- **`#cottagecore`** — coquette 前身，主要當 secondary tag 與 coquette 混搭

**輔助 niche tag（每條 1-2 個依主題）**：
`#pinkaesthetic` `#cozygame` `#virtualpet` `#asmr` `#softgirl` `#fairycore` `#dressup` `#productivityhack`

**地區性（中文圈，每條 1-2 個）**：
`#台灣 #香港 #馬來西亞中文` 或 `#台北上班族` `#療癒系` `#上班分頁旁玩`

**避開（紅海）**：
- `#mobilegame` `#viral` — 太一般，演算法不認得 niche
- `#tamagotchi` 單獨用是紅海（大廠保留地），但 **W1 Sat 對比短片刻意用**（nostalgia framing 加 coquette modern），算特例

**W1 hashtag 預算分配**（iter#94 § 1.2 已落地）：
| 軸 | 使用條數 | 對應 day |
|---|---|---|
| coquette | 4 | Mon / Fri / Sat / Sun |
| cleangirl | 2 | Tue / Thu |
| balletcore | 1 | Wed |

---

## 附錄 B：每週時間預算

| 階段 | 時間/週 | 動作 |
|------|---------|------|
| W1 | 12-15h | 拍 + 剪 7 條 + 部署檢查 + GSC 驗證 |
| W2 | 8-10h | 7 條 + KOL 洽談 + Paid Organic 操作 |
| W3 | 6-8h | 7 條 + Threads thread 維護 + 數據反饋 |
| W4 | 5-7h | 7 條 + KOL 連動 + retrospective |

**總投入估算**：30 天約 30-40 小時。其中拍剪佔 60%，社群維護 20%，數據看板 10%，洽談 10%。
