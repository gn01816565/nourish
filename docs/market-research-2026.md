# 2026 養成寵物遊戲市場補強調查

> v1 市場調查（`market-research.md`）寫於 2026-04-28 早上，本檔為當日下午針對「2026 最新動態」補強。
> 重點是抓住**Tamagotchi 30 周年期間**的市場熱度與新範式，給 v0.2 / v0.3 / App 階段的決策參考。

---

## 1. 三大新範式（2026 H1）

### 1.1 AI 對話寵物（CES 2026 風潮）

代表作：**Sweekar**（Takway 推出於 CES 2026）
- 蛋形實體裝置 + 螢幕當臉 + 內建 LLM
- 玩家可以「跟它聊天」，寵物有持續的人格、記憶、情緒
- 與傳統 Tamagotchi 的核心差異：**從「照顧需求驅動」轉向「對話建立關係」**

**對啾啾日常的啟示**：
- 短期（v0.2）：可在現有「對話 talk」互動加上**腳本化情境對話**（例如 10 條情境，依當前狀態觸發），已能模擬「個性」感
- 中期（v0.3）：評估接入小型 LLM API 的成本（OpenAI mini / Claude haiku / Gemini Flash 都可），每次對話 < $0.001，月活 1000 玩家 × 每天 3 次 ≈ 月 $90 範圍
- 長期（App）：考慮本地小模型（Llama 3.2 1B、Phi-3 mini）跑在裝置上，零延遲、無雲端成本

### 1.2 基因組合 / 突變系統（Tamagotchi Paradise，2025/7）

- Bandai 的官方 IP 拓展，引入「**50,000+ 基因組合**」
- 配種、突變、世代繼承，每個玩家養出的個體真的不同
- 提供「**穩定收藏感**」（玩了 1 個月後不會「全部解鎖了」） 

**對啾啾日常的啟示**：
- 目前 7 種終態 + 17 條成就 → 約**3–4 週耗盡內容**
- v0.3 可以把「7 種終態」擴成「7 種主形 × 多配色 × 多配件」組合，例如：
  - 主形 7 種
  - 配色 5 種（金、銀、黑、彩虹、漸層）
  - 配件 10 種（選 2，組合 45）
  - **總共 7 × 5 × 45 = 1,575 種**
- 配種系統（兩隻已養成的雞 → 下一隻蛋繼承屬性）可以維持 6 個月以上的內容深度

### 1.3 Wants-based interactions（取代被動衰減）

來自 2026 多款新作的常見模式：
- 寵物會**主動表達具體欲望**：「我想要吃莓果」「我想去散步」「我今天好想唱歌」
- 玩家滿足欲望 → 額外獎勵（飼料幣、心情、專屬成就）
- **與被動數值衰減的差異**：玩家覺得在「跟一個有意志的個體互動」，不是「按按鈕填表格」

**對啾啾日常的啟示**：
- **這是 v0.2 最有 ROI 的單一功能**，工程量小（1–2 天），質變大
- 我們的隨機事件框架（CFG.randomEvents）已是表驅動，加 wants 池幾乎是同一套
- 設計建議：
  - 雛雞期每 2 小時觸發 1 次 want（持續 1 小時，未滿足消失）
  - 滿足會給 +5 心情 + 1 個「親密度」隱藏屬性
  - 親密度高解鎖特殊對話 / 進化加成

---

## 2. 留存機制設計趨勢

### 2.1 Daily login 三派

| 派別 | 規則 | 玩家心理 | 適用 |
|------|------|---------|------|
| **嚴格 streak + FOMO** | 斷一天，那天獎勵永遠拿不回 | 焦慮驅動 | 重度遊戲、有強對立排行 |
| **Lenient streak**（我們現在的派） | 斷了就 reset，但前面拿過的不還 | 鼓勵但不懲罰 | 休閒 / 養成類 |
| **AFK rewards** | 離線時間自動累積資源，回來一鍵領 | 適合出國、忙碌玩家 | 純放置類 |

**對啾啾日常的啟示**：
- 維持 lenient streak 派（符合「不焦慮」設計目標）
- 但**可加 AFK reward 元素**：離線回來自動贈送 1–10 FC（依離線時長），減弱「忘了登入會錯過」感
- 已實作的「>12h 離線回歸補償 20 FC」是這個方向的雛形 ✅

### 2.2 季節 / 限時內容

- 大多數 2026 養成遊戲每月有 **2–3 個限時活動**：節日特別食物、限定外觀、節慶背景
- 玩家口碑：「永遠有新東西看」是長期留存的關鍵
- 工程模式：**事件 / 食物 / 外觀都做成設定檔驅動**，運營側只改 JSON / Cloud Config 不用發版

**對啾啾日常的啟示**：
- 我們的 `CFG.interactions / CFG.randomEvents / CFG.achievements` 都已是表驅動 ✅
- v0.2 可加 `CFG.seasonalEvents`（限時食物、限時隨機事件）
- v0.3 可從 server 拉設定（之前不需要 server，但有了限時內容就需要）

### 2.3 Pet collection + 全球排行榜

- Legend of Mushroom 等收集類 / 配對類引入**全球收藏排行**
- 玩家比拚：「我有多少種 / 多少隻」「我的稀有度多高」
- 對社群曝光的乘數效果：截圖分享圖鑑 → 朋友圈病毒傳播

**對啾啾日常的啟示**：
- 圖鑑功能已有（`nourish.dex.v1`），缺**截圖分享**與**比較功能**
- 截圖分享：Canvas → PNG → Web Share API（v0.2，2 天）
- 全球排行：需要 backend，**v0.3 之後**
- 中間方案：分享一段「圖鑑代碼」（base64 壓縮 dex JSON）→ 朋友複製貼到自己的圖鑑 → 看到對方的小雞們

---

## 3. AR / 跨裝置（App 階段啟示）

### 3.1 Peridot 模式（Niantic）

- 寵物用手機相機放到桌面上，拍照、玩 AR 互動、學技能
- 與 Pokémon GO 共用引擎，但**沒有 PvP，純養成 + AR**
- 用戶評價：拍照分享是病毒核心；技能養成深度不夠

**對啾啾日常的啟示**：
- **AR 拍照分享**是 App 階段最值得做的功能（v1.0+）
- 不需要全 AR，只要「啾啾出現在你的桌上 + 拍照」就夠
- iOS：ARKit / Reality Kit；Android：ARCore；跨平台：ViroReact（已停更 ⚠）/ 8th Wall

### 3.2 PWA + 推播

- 推播通知是養成遊戲**最強的回訪驅動**：「啾啾餓了…」「啾啾想念你」
- PWA 支援推播但 iOS 需要 Safari 16.4+ 加上「加到主畫面」
- 實作成本低（Service Worker + Web Push API），但 user 體驗大躍進

**對啾啾日常的啟示**：
- v0.3 階段就可以做 PWA（不用等 App）
- App 階段（v1.0）改 native 推播，跟 OS 通知中心整合

---

## 4. 變現觀察

### 4.1 養成類最常見的 IAP

| 類型 | 範例 | 對情感投射的影響 |
|------|------|-----------------|
| 純裝飾 | 帽子、雞舍背景、限定外觀 | ✅ 不影響玩法、玩家正面接受 |
| 加速 | 跳過進化倒數、立即孵化 | 🟡 可能破壞「養成感」，慎用 |
| 加成 | 雙倍成長分數、雙倍 FC | ❌ 過去玩家負評重災區 |
| 抽卡 / 轉蛋 | 抽外觀、抽限定形態 | 🟡 對小遊戲可，但社群觀感分歧 |
| 訂閱制 | 月費 $1–3，多隻寵物欄、自動 AFK | ✅ 符合長期留存、清晰回報 |

**對啾啾日常的啟示**：
- v0.3 評估**純裝飾 IAP**（雞舍背景、配件）+ **訂閱制多寵物欄**
- 不做加速、不做加成（破壞情感投射，符合 GDD 「不要焦慮 / 罪惡感」設計目標）

### 4.2 廣告位

- Reward Ad（看 30s 換 FC / 換食物）— 玩家自願、體感 OK
- Interstitial（強制全螢幕）— 體感差、會導致流失
- Banner（永久底部）— 對手機尺寸 cost 太高

**對啾啾日常的啟示**：
- 不開 Banner / Interstitial
- v0.3 可加 1 個 Reward Ad 位置：「看廣告 → 領 20 FC」每日 3 次

---

## 5. 競品差異化定位（給 v0.2 / v0.3 思考）

啾啾日常 vs 主流：

| 維度 | Tamagotchi | Adopt Me | Neko Atsume | **啾啾日常** |
|------|-----------|----------|-------------|----------|
| 平台 | 實體 + App | Roblox | Mobile | **Web，零下載即玩** |
| 死亡 | 會死 | 不會 | 不會 | **不會（最差醜雞，可救）** |
| 進化分支 | 有 | 多 | 無 | **7 種，可擴展到 1500+ 組合** |
| 社交 | 弱 | 強 | 弱 | **目前無，v0.2 加分享** |
| AI 對話 | 無 | 無 | 無 | **v0.3 機會點** |
| 商業模式 | 硬體 + 授權 | Robux | 軟貨幣 + 廣告 | **MVP 免費，v0.3 純裝飾 + 訂閱** |

**獨特定位**：
- 「**最低門檻的 Tamagotchi**」（瀏覽器即玩、零下載、零帳號）
- 「**情感不焦慮**」（不會死、12 小時封頂、補償機制）
- 「**長尾深度**」（基因 + AI 對話 → 比經典 Tamagotchi 還深）

---

## 6. 部署後 Discovery / Growth 戰術（iter#70 補強）

> 寫於 2026-04-29，承接 iter#65 SEO 三件套部署完工後的「上線怎麼被找到」拼圖。
> 兩個維度：**indie 在 TikTok 怎麼成功** + **PWA 相對 App Store 的 discovery 優勢**。

### 6.1 Indie 2026 的 viral 公式（KnightBound 範式）

**KnightBound — Dark Fantasy** 案例（[MWM 報導](https://mwm.ai/articles/knightbound-dark-fantasy-soars-3-2026-03-02)）：
- 16 歲 solo dev（studio: Supereo LTD）
- 0 廣告預算 → App Store Adventure 類別 **#3 全球**
- 一週內 124,000 下載 / $1,500 營收（2026-03-02 那週）
- **方法**：鎖定 TikTok 上的「Dark Fantasy 美學」這個 trending subculture，反向客製遊戲 metadata 去**精準匹配演算法 hashtag**

**對啾啾日常的啟示**：
- 啾啾的 TA 是 18-35 女性，對應的 TikTok subculture 候選：**「pink aesthetic」「coquette」「kawaii desk setup」「cottagecore」**
- 我們已有的視覺資產（粉嫩配色、緞帶皇冠配件、療癒文案）天然契合 coquette 美學
- **行動**：v0.3 上線後，前 3 週每週發 7-14 個短片，hashtag 鎖 `#coquette #pinkaesthetic #virtualpet #cozygame #pwa`

### 6.2 短影音節奏 = 主要有機觸及來源

**2026 indie 的標準節奏**（參考 [How To Market A Game](https://howtomarketagame.com/) 一系列文）：
- **TikTok / YouTube Shorts / Instagram Reels 同時發** — 一支內容三平台分發
- **每週 7-14 條短片** = 觸及門檻
- 不夠頻就被演算法判定「非優先創作者」，曝光下降

**Devlog 紅利期已過**：
- 2024 年 devlog 縮圖能拿 800K views
- 2026 同樣縮圖 = **300-800 views**（70-99% 衰退）
- 解法：從「solo dev devlog」轉向「treat as content creator」— 不是介紹遊戲，是**做能 viral 的內容，遊戲只是品牌**

### 6.3 「Paid Organic」放大法

實驗成本最低的廣告模式：
1. **先免費發** — 7-14 條/週，**不要花錢**
2. **觀察哪一條自己起飛**（單條 5K+ views in 24h）
3. **對那一條投 $200 boost**（TikTok promote / Instagram boost）
4. 演算法判讀為「自然爆紅內容」→ 觸達指數放大 5-10 倍

**為什麼有效**：直接買廣告的 CTR / CVR 都是冷啟，演算法不確定要送給誰；放大已有自然訊號則 audience 已被驗證。

**對啾啾日常的啟示**：
- 月預算 $100-200 試水溫，鎖定 1-2 條已起飛的玩家分享或 dev 短片
- 不要直接買 **Tamagotchi** / **virtual pet** 等高 CPC 關鍵字（紅海 + 不轉）

### 6.4 PWA 的 discovery 結構優勢（vs App Store）

從 [Mobiloud 2026 PWA 30 examples](https://www.mobiloud.com/blog/progressive-web-app-examples) 抓重點：

| 指標 | PWA | 原生 App |
|------|-----|----------|
| 進入門檻 | 0（點 link 即玩） | 下載 + 開啟 + 註冊 |
| 搜尋引擎索引 | ✅ Google / Bing 直接索引 | ❌ Store 內部搜尋孤島 |
| 安裝 friction | 1 tap A2HS | Store 審核 + 下載條 |
| Session 長度 | **+70% vs 行動 web** | 基準 |
| Page views | **+20% vs 行動 web** | 基準 |
| 轉換率 | **+36%（PWA 平均）** | 基準 |
| 開發成本 | 1 base | **4× 跨平台（iOS/Android 各一份）** |

**真實案例數字**：
- **Trivago**：A2HS 用戶比 web-only **+150%**
- **某 PWA 上線**：前 5 個月每月 **+97% 安裝量**（複利成長）
- **平均 PWA**：**36% 高轉換 / 75% 低成本** vs 原生 app

**對啾啾日常的啟示**：
- iter#34 已上線 PWA，但**沒主動宣傳「可加到主畫面」** — 玩家以為是普通網頁就關掉了
- v0.2 該加：**A2HS 提示橫幅**（玩過 5 分鐘後彈一次）+ 設定頁「📱 安裝到主畫面」按鈕
- iter#27 的 install prompt 攔截已寫，但**沒對玩家明示**

### 6.5 啾啾日常 launch 路徑建議

部署 GitHub Pages 後 30 天的優先順序：

1. **W1**：Search Console 提交（iter#66 SOP 已備）+ 第一批 7 條 TikTok（玩家分享動圖 / dev 短片，鎖 coquette/cottagecore）
2. **W2**：觀察哪條 5K+ views → $50 試水放大
3. **W3**：把 W1-2 的數據（哪些 hashtag / 什麼時段 / 什麼題材） feed 回 W3 的 7 條
4. **W4**：A2HS 橫幅上線（iter#70 後候選）+ 跟一個小 KOL 換物（送一支客製化雞，換 1 條開箱影片）

**KPI 校準**：
- W1：100 unique players（自然導流）
- W4：1,000 unique players + 100 PWA installs
- 3 個月：10K MAU + Search Console 涵蓋率 80%+

### 6.6 紅旗 / 不該做的

- ❌ **直接買 Tamagotchi / virtual pet 關鍵字 ad**（高競爭 + 已被大廠鎖定）
- ❌ **指望 Reddit r/incremental_games 一篇文起飛**（傳統 indie 投放區，但 2026 年回報已稀釋到 < 100 click/post）
- ❌ **每天追新 hashtag**（演算法傾向認得「持續投同 niche」的創作者）
- ❌ **同步發完美的 50 條等爆**（少於 7 條/週 = 演算法不認，多於 14 條/週 = 邊際遞減）
- ❌ **wishlist 轉換率超過 1% 的期待**（2026 年 indie viral 平均 < 1%，量大才有量）

---

## 7. Q2 2026 補強（iter#93 WebSearch 補）

> 寫於 2026-04-29，距 §6 launch 戰術寫成已 ~22 cron rounds。本節 cross-check 戰術仍 valid 並補 Q2 2026 新發現。

### 7.1 直接競品出現：Weyrdlets（idle desktop virtual pet）

- 同類定位：「桌面駐留 idle pet + productivity」(對應啾啾「分頁旁陪你工作」)
- 差異：Weyrdlets 在桌面**獨立 app**而非瀏覽器分頁；要下載
- 啾啾優勢：
  - 「**0 下載 / 開連結即玩**」依然獨家（Weyrdlets 仍走傳統 app 流程）
  - PWA + GitHub Pages 部署 = friction 比 Weyrdlets 低 4 倍
- 啾啾劣勢：
  - Weyrdlets 已建立社群熱度，啾啾從零起步
  - Weyrdlets 應該有「家居 / 收藏陳列」UX 我們沒有（v0.3 配件背景化可學）

**對 v0.3 啟示**：
- 把「在分頁旁邊」變成 v0.3 主行銷訴求（不只是運作機制，是 USP）
- 啾啾的「無下載」要成為 launch tagline 第一句
- v0.3 加「桌面陳列模式」評估：把成年雞 + 配件靜態渲染成 og image 給玩家分享桌面？

### 7.2 Loftia「Pet Haven」stretch goal — 寵物擴充是 Kickstarter 玩家投票熱項

- 訊號：indie 開發者社群把「multi-pet collection」當賣點
- **驗證 GDD §10.4 多寵物 v0.4** 路徑值得做（不是過時想法）
- Loftia 加 10 隻 pet 是 KS 訴求 — 啾啾 v0.4 multipet-plan.md 路徑與市場同頻

### 7.3 Coquette 美學狀態：18B+ TikTok views（**比 iter#70 預期更大**）

iter#70 §6.1 標 coquette 為 niche subculture。Q2 2026 實況：

| Hashtag | TikTok 累計觀看 | 趨勢 |
|---------|---------------|------|
| #coquetteaesthetic | **18+ B** | 🔥 mega-mainstream，不再是 niche |
| #cottagecore | ~? | 演進中（被 coquette 部分取代） |
| #balletcore | rising | coquette 的姊妹流派 |
| #cleangirl | mega | 與 coquette 互補 mix |

**重要範式轉移**：2026 = **「mix-and-match aesthetic」年**，玩家不再 commit 單一美學
- coquette + clean basics（柔 + 簡）
- balletcore + streetwear（仙 + 街）
- cottagecore dress + 現代外套

**對啾啾的 launch-plan 影響**：
- launch-plan §1.2 W1 短片 **不要鎖死 cottagecore**，加 #balletcore + #cleangirl 平行測試
- 短片構圖實驗：啾啾 + clean basics 桌面 vs 啾啾 + 全 coquette 房間 vs 啾啾 + ballet outfit
- A/B 測試成本：**0**（只是換 hashtag + 場景，演算法自己分發）

### 7.4 KOL 候選：@coqxette（Ellen-Pippa Beckett）

- 文章點名為 coquette aesthetic 主要推手創作者
- 啾啾 launch W2 KOL 試水可優先嘗試（但帳號條件需查證符合 launch-plan §2.2 篩選）
- 不確定是否中文圈受眾匹配，西方 mover 可能用於英文版（v0.3 i18n 啟動後再說）

### 7.5 已驗證仍 valid 的 iter#70 結論

| iter#70 結論 | Q2 2026 仍 valid? |
|--------------|-------------------|
| 7-14 clips/週 | ✅（再次出現於 2026 indie marketing guide） |
| Paid Organic 模式（先免費發 → 找出爆款 → boost） | ✅（被多份 2026 文章重提） |
| PWA 對搜尋引擎的 discovery 結構優勢 | ✅（沒人爭議） |
| #tamagotchi 紅海避用 | ✅（依然是大廠保留地） |

iter#70 的 launch playbook 主軸仍可信，本輪只補強而非取代。

### 7.6 iter#93 結論補一句

**5. 「mix-and-match」是 2026 美學主旋律 — launch 短片不要鎖單一 niche，要做 3-4 種 aesthetic 平行測試**（W1 7 條短片可以拆 4 條 coquette + 2 條 cleangirl + 1 條 balletcore，比 7 條都 coquette 更聰明）。

### 7.7 iter#118 cross-check（2026 H2 SEO / PWA 動態）

iter#93 後 25 輪 second cross-check（[Octo Browser blog](https://blog.octobrowser.net/fast-website-indexing-in-google-in-2026) / [Pansofic GSC 2026 guide](https://www.pansofic.com/blog/google-search-console-in-2026-pansofic-solutions)）：

**多數 iter#70 / iter#93 結論仍 valid**：
- ✅ 7-14 clips/週 TikTok 節奏
- ✅ Paid Organic 模式
- ✅ PWA 對 SEO 結構優勢
- ✅ 短片 + niche 美學是 2026 主流

**新 intel（2 條 actionable）**：
1. **GSC 2026 升級為 AI 解讀 dashboard**：「Indexing report 是 classification 不是 discovery」— 玩家搜不到不只是 sitemap 問題，是 AI 認為你的內容有沒有價值。對應動作：
   - 確保 index.html / og:description / JSON-LD 文案具體有故事性（不只列功能）
   - 「Thin / 重複 page 會被 skip」— 啾啾單頁應用本來就低風險，但 og:image / share card 內容要每幾個月更新一次給 AI 重新分類

2. **Lighthouse PWA audit 是 GSC 推薦 PWA debug 工具**：deploy 前該跑一次：
   - PWA 分數應 ≥ 90
   - Performance / SEO / Accessibility / Best Practices 四象限
   - 連結到 [Google Web.dev PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

**對 launch-plan 影響**：
- §0.5 監測清單可加「跑 Lighthouse PWA audit 達 90+ 才上 launch」
- §1.1 W1 Day 1 的「跑 PSI / Schema validator」其實 Lighthouse 一鍵涵蓋，可整合
- W3 內容反饋階段考慮「定期更新 og:image」維持 AI 重新分類

**iter#67-118 累計市調更新**：
- iter#70：launch playbook 主框架（KnightBound case + PWA discovery）
- iter#93：mix-and-match aesthetic + Weyrdlets 競品
- **iter#118（本輪）：GSC AI 解讀 / Lighthouse audit / 內容品質要求**
- 累計 22 個來源 URL，3 次 cross-check 結論大致穩定 — launch 戰術可信度高

---

## 8. 三句話結論

1. **Wants 系統是 v0.2 必做** — 1–2 天工程量，但會把養成體驗從「按鈕填表」升級成「跟一個有意志的個體互動」。
2. **基因 / 配色 / 配件擴充是 v0.3 必做** — 把現在 7 種終態擴成 1500+ 組合，續命 6 個月以上。
3. **AR + 推播 + AI 對話是 App 階段（v1.0+）的三大殺手鐧** — 不要在 v0.2 / v0.3 強塞，等 PWA 雛形跑穩再陸續上。

**iter#70 補一句結論**：4. **Discovery 是 v1.0 真正的瓶頸** — 程式跑得起來只是門票，2026 年要被找到必須**短影音 7-14 條/週 × 鎖定 coquette/cottagecore subculture × Paid Organic 放大法**，沒這三個動作上線等於對著空房間講話。

---

## 來源

### v1（市場 / 產品趨勢，原始）
- [Top 11 Virtual Pet Games & Apps 2026 — Moon Technolabs](https://www.moontechnolabs.com/blog/virtual-pet-games/)
- [Why Tamagotchi Still Relevant in 2026 — CTV News](https://www.ctvnews.ca/lifestyle/article/why-is-a-1990s-virtual-pet-toy-still-relevant-in-2026/)
- [Tamagotchi at 30 — Mezha](https://mezha.net/eng/bukvy/tamagotchi-at-30-why-the-digital-pet-remains-popular-in-2026/)
- [CES 2026 Sweekar AI Pet — TechNode](https://technode.com/2026/01/05/ces-2026-takway-unveils-tamagotchi-inspired-ai-virtual-pet-sweekar/)
- [Daily Login Rewards Engagement & Retention — MAF](https://maf.ad/en/blog/daily-login-rewards-engagement-retention/)
- [Top 10 Idle Games January 2026 — Playgama](https://playgama.com/blog/top-games/top-10-idle-games-january-2026-i-tested-every-browser-clicker-so-you-dont-have-to/)

### v3（Q2 2026 競品 / 美學趨勢，iter#93 補）
- [Loftia Kickstarter Pet Haven stretch — generic indie pet game thread](https://www.tiktok.com/discover/game-where-u-take-care-of-a-pet)
- [Top 15 Viral TikTok Games 2026 — Filmora](https://filmora.wondershare.com/tiktok/tiktok-games.html)
- [Latest Viral TikTok Games 2026 — Teecycle](https://teecycle.org/games/latest-viral-tiktok-games-the-top-10-that-took-over-your-feed/)
- [2026 Indie Jam Showcase — The Magic Rain](https://themagicrain.com/2026/04/a-complete-list-of-every-game-featured-in-the-2026-indie-jam-showcase/)
- [Coquette Aesthetic Wikipedia](https://en.wikipedia.org/wiki/Coquette_aesthetic)
- [Bows, Blush, and Baroque: Coquette Gen Z Fashion — Wildcat Chronicle](https://wildcatchronicle.org/27782/features/bows-blush-and-baroque-inside-the-coquette-aesthetic-taking-over-gen-z-fashion/)
- [Coquette vs Balletcore vs Cottagecore — Sweetslolita](https://sweetslolita.com/blogs/fashion-aesthetics/decoding-the-aesthetics-coquette-core-vs-balletcore-cottagecore-and-more)
- [Coquette + Cottagecore + E-Girl Gen Alpha Guide — PureWow](https://www.purewow.com/family/gen-alpha-fashion-trends)
- [Top Gen Z Fashion Trends 2026 — Aestheticbk](https://aestheticbk.com/blogs/news/gen-z-fashion-trends)

### v2（部署 / Growth 戰術，iter#70 補）
- [KnightBound Dark Fantasy 6 days TikTok #3 case study — MWM](https://mwm.ai/articles/knightbound-dark-fantasy-soars-3-2026-03-02)
- [2026 Indie Game Production Marketing Guide](https://www.game-developers.org/2026-indie-game-production-marketing-guide)
- [Indie Game Distribution & UA Painpoints 2025-2026 — Metricus](https://metricusapp.com/blog/indie-game-distribution-user-acquisition-painpoints-2025-2026/)
- [Seven Tips for Indie TikTok Marketing — How To Market A Game](https://howtomarketagame.com/2022/02/07/seven-great-tips-for-marketing-your-indie-game-on-tiktok/)
- [How to Go Viral on TikTok — How To Market A Game](https://howtomarketagame.com/2022/02/14/how-to-go-viral-on-tiktok/)
- [Progressive Web App Examples 2026 — Mobiloud](https://www.mobiloud.com/blog/progressive-web-app-examples)
- [What Is a PWA Ultimate Guide 2026 — Mobiloud](https://www.mobiloud.com/blog/progressive-web-apps)
- [Why PWAs Dominate the 2026 Digital Strategy — Medium](https://medium.com/codetodeploy/why-pwas-dominate-the-2026-digital-strategy-e0c2c4f740c9)

### v4（2026 H2 SEO / PWA AI 解讀，iter#118 補）
- [Fast Website Indexing in Google 2026 — Octo Browser](https://blog.octobrowser.net/fast-website-indexing-in-google-in-2026)
- [Google Search Console 2026 Guide — Pansofic Solutions](https://www.pansofic.com/blog/google-search-console-in-2026-pansofic-solutions)
- [Google PWA Checklist — web.dev](https://developers.google.com/web/progressive-web-apps/checklist)
- [Building Indexable PWAs — Google Search Central Blog](https://developers.google.com/search/blog/2016/11/building-indexable-progressive-web-apps)
- [Mametchi Memories Tamagotchi Nano — Siliconera](https://www.siliconera.com/mametchi-memories-tamagotchi-nano-colorful-virtual-pet-heads-to-japan/)
