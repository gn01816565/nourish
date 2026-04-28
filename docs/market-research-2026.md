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

## 6. 三句話結論

1. **Wants 系統是 v0.2 必做** — 1–2 天工程量，但會把養成體驗從「按鈕填表」升級成「跟一個有意志的個體互動」。
2. **基因 / 配色 / 配件擴充是 v0.3 必做** — 把現在 7 種終態擴成 1500+ 組合，續命 6 個月以上。
3. **AR + 推播 + AI 對話是 App 階段（v1.0+）的三大殺手鐧** — 不要在 v0.2 / v0.3 強塞，等 PWA 雛形跑穩再陸續上。

---

## 來源

- [Top 11 Virtual Pet Games & Apps 2026 — Moon Technolabs](https://www.moontechnolabs.com/blog/virtual-pet-games/)
- [Why Tamagotchi Still Relevant in 2026 — CTV News](https://www.ctvnews.ca/lifestyle/article/why-is-a-1990s-virtual-pet-toy-still-relevant-in-2026/)
- [Tamagotchi at 30 — Mezha](https://mezha.net/eng/bukvy/tamagotchi-at-30-why-the-digital-pet-remains-popular-in-2026/)
- [CES 2026 Sweekar AI Pet — TechNode](https://technode.com/2026/01/05/ces-2026-takway-unveils-tamagotchi-inspired-ai-virtual-pet-sweekar/)
- [Daily Login Rewards Engagement & Retention — MAF](https://maf.ad/en/blog/daily-login-rewards-engagement-retention/)
- [Top 10 Idle Games January 2026 — Playgama](https://playgama.com/blog/top-games/top-10-idle-games-january-2026-i-tested-every-browser-clicker-so-you-dont-have-to/)
- [Mametchi Memories Tamagotchi Nano — Siliconera](https://www.siliconera.com/mametchi-memories-tamagotchi-nano-colorful-virtual-pet-heads-to-japan/)
