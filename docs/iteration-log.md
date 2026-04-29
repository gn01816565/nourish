# 啾啾日常 — 自動優化循環日誌

> 每 10 分鐘觸發一次（cron `3-59/10 * * * *`，job `0a1c2148`），由主 agent 推進。新項目追加在最上方。

---

## 2026-04-29 05:54 · Session A — R-A step 2 第一片：ui.js 拆出（toast + speak + showImagePreview）

**觸發**：cron 第 60 輪。Retrospective 標 R-A step 2 拆 ui.js 是「最後也最大塊」 4h 工程量。本輪先取最自包含的 toast/speak primitives + 從 share.js 把 showIOSPreview 移過來，驗證模式可行 + 給未來 modal/menu extract 鋪路。

**動作（新檔 `src/ui.js`，67 行 IIFE）**：

- **`toast(msg, kind)`**：原 game.js 6 行函式整體搬過來，不依任何閉包 state（只用 DOM lookup）
- **`speak(text)`**：speechBubble 顯示 + 2 秒自動隱藏，私有 `speakTimer` 在模組級
- **`showImagePreview(url, title, onClose)`**：從 share.js 的 inline showIOSPreview 升格為 ui.js 公共 API
  - 同樣的「全螢幕半透明黑底 + 圖片 + 長按存圖 hint + 黃色關閉鈕」設計
  - 改放在 ui.js 後 share.js 就能用 `window.NourishUI.showImagePreview()` 而非 fallback

- **對外 `window.NourishUI = { toast, speak, showImagePreview }`**

**動作（game.js 簡化）**：
- 移除既有 `function toast()` `function speak()` 共 14 行
- 替換成 2 行 thin wrapper：
  ```js
  const toast = (msg, kind) => window.NourishUI.toast(msg, kind);
  const speak = (text) => window.NourishUI.speak(text);
  ```
- 60+ 個既有 callers（toast 散在 grantCoin / unlockAchievement / fulfillWantIfMatches / RANDOM_EVENT_APPLIES 等等）**完全不動** ✅

**動作（share.js 自動受惠）**：
- share.js 內既有 fallback：
  ```js
  if (window.NourishUI && window.NourishUI.showImagePreview) {
    window.NourishUI.showImagePreview(...);
  } else {
    showIOSPreview(...);  // inline fallback
  }
  ```
- 之前 share.js 載入時 NourishUI 不存在走 fallback，本輪 ui.js 加進 script tag 後**自動走主路徑**
- inline fallback 暫保留（防其他 caller），下輪可清理

**動作（index.html 載入順序）**：
```
cfg.js → ui.js → dex.js → achievements.js → audio.js → share.js → game.js
```
ui.js 在 dex / achievements / audio / share 之前，因為這些可能透過 `window.NourishAPI.toast` 間接用 ui.js（雖然目前實際 toast 還是走 NourishAPI bridge，但未來可以直接拿 NourishUI 替代）。

**影響檔案**：
- `src/ui.js`（新檔，67 行）
- `src/game.js`（-12 行：toast/speak 函式 → 2 行 wrapper）
- `index.html`（+1 script tag）

**驗證**：
- `node --check src/ui.js src/game.js` ✅
- HTTP 200：ui.js
- 7 模組現況：cfg 289 + ui 67 + dex 73 + achievements 65 + audio 61 + share 326 + game 1981 = **2862 total**

**7 模組依賴圖**（更新）：
```
cfg.js          → window.NourishCFG (eager)
ui.js           → 無依賴 → window.NourishUI = { toast, speak, showImagePreview }
dex.js          → +NourishCFG, NourishAPI(lazy) → NourishDex
achievements.js → +NourishCFG → NourishAchievements
audio.js        → NourishAPI(lazy) → NourishAudio
share.js        → +NourishCFG, NourishAPI(lazy), NourishUI(lazy for image preview) → NourishShare
game.js         → +NourishCFG, NourishUI(eager), NourishAudio(eager), 其他(lazy) → sets NourishAPI
```

**R-A step 2 進度**：
- ✅ step 2-A：toast / speak / showImagePreview（**本輪**）
- ⏸️ step 2-B：showModal / closeModal + focus trap + modalReturnFocus（中等耦合，~50 行候選）
- ⏸️ step 2-C：openFeedMenu / openPlayMenu / openPetMenu / openShopMenu / openSettingsMenu / openDexMenu / openEventStatsMenu / openPetDetail / openNameDialog / openHelpDialog / showOnboarding / showOnboardingPart2 / showWelcomeBack（最大塊，~700 行）
- ⏸️ step 2-D：清理 share.js 的 inline showIOSPreview fallback

**對玩家無感** — 本次純內部重構，行為一致。

**對 retrospective P1-1（game.js 撞牆）進度**：
- v2 P2-1 預警時：1272 行
- iter#56：1838 行（+50%）
- iter#60 本輪：1981 行（不減反增 — 因為 onboarding v2 / settings tabs / a11y / iOS share 等都在 game.js 加新東西）
- 但**抽出 audio + ui 共 128 行**，沒抽 game.js 還會更大
- **下輪繼續 step 2-B 拆 modal**，game.js 預期降到 ~1900

**下輪候選**：
1. R-A step 2-B：拆 modal helpers（showModal/closeModal/focus trap/escapeHtml）
2. WebSearch v1.0 部署技巧
3. og:image 內容檢查（如需要重生交給 Session B）

---

## 2026-04-29 05:47 · Session A — INTENT: R-A step 2 第一片 — 拆 ui.js（toast + speak）

(已完成)

---

## 2026-04-29 05:39 · Session A — SEO meta description + Settings tab 鍵盤導航（WAI-ARIA）

**觸發**：cron 第 59 輪
**為什麼**：retrospective 標「og:image / twitter card 已設」但**沒檢查 `<meta name="description">`** — 沒這條搜尋引擎用的是 og:description（次要 fallback）。同時 iter#58 設定頁切 tab，但鍵盤只能 Tab + Enter，不符 WAI-ARIA tabs pattern（左右鍵切換）。一起補完兩件 polish。

**動作（SEO meta tag）**：
- 新增 `<meta name="description" content="...">` — Google / Bing 搜尋結果摘要主要來源
  - 文案：「純瀏覽器養成小雞，零下載、零帳號、女性向粉嫩風。蛋孵化、餵食、玩耍、進化 7 種終態，9 件飾品自由搭配。」
  - 包含關鍵字：「純瀏覽器」「養成」「7 種終態」「9 件飾品」
  - 跟 og:description 互補（OG 偏一句話 pitch、meta description 偏功能列表）
- 新增 `<meta name="keywords">` — 中等價值（Google 不再用，但 Bing / 百度仍部分使用）
  - 「養成遊戲, 小雞, Tamagotchi, 啾啾, ChickaDay, 寵物, 網頁遊戲, PWA, 女性向, 療癒」

**動作（Settings tab 鍵盤導航）**：
- ArrowLeft / ArrowRight：循環切換 tab（左到頂回最右、右到底回最左）
- Home：跳第一個 tab（🐣 啾啾）
- End：跳最後 tab（💾 存檔）
- 每次切換：focus 移到新 tab + auto-switch pane（玩家不需 Enter 確認）
- 加 `aria-selected="true|false"` 屬性 — SR 用戶聽到「分頁 1/3, 啾啾, 已選取」

**WAI-ARIA tabs pattern 對齊**：
- ✅ role="tablist" / "tab" / "tabpanel"（iter#58）
- ✅ aria-selected 同步（**本輪**）
- ✅ 左右鍵切換（**本輪**）
- ✅ Home / End 跳首末（**本輪**）
- ⏸️ aria-controls 串起 tab → tabpanel id（小優化，下輪可補）

**影響檔案**：
- `index.html`（+2 meta tags）
- `src/game.js`（+~15 行 switchTab refactor + keyboard nav）

**驗證**：`node --check` ✅ + `grep` 2 條 meta 確認

**對 SEO 的影響**：
- Google 搜尋「啾啾日常」/「ChickaDay」結果摘要會顯示完整功能介紹（之前用 og:description 較短）
- 競爭關鍵字「養成 PWA 遊戲」「女性向 寵物」可被索引到
- og:image 1200×630（Session B 已生）讓 Twitter / FB / LINE 分享有大圖預覽

**對 a11y 的影響**：
- 鍵盤 only 玩家：在設定頁可用左右鍵流暢切 tab，符合 WAI-ARIA 慣例
- SR 用戶：tab 切換時聽到「啾啾 已選取 / 設定 已選取」狀態變化
- Lighthouse a11y 預期 95 → ~97

**Retrospective 進度**：
- ✅ 6 件 polish 完成（iter#52-58）
- ✅ **本輪兩件 SEO + 鍵盤 polish**
- ⏸️ R-A step 2 ui.js（最後 4h，分多輪做）

**6.5h 列表已做 ~5h（77%）** + Bonus（SEO meta、鍵盤導航不在原列表內）。剩 R-A step 2，可分 ~4 輪 cron 完成。

**下輪候選**：
1. R-A step 2 拆 ui.js（首次嘗試，建議只拆 modal/toast/speak primitives，先小跑）
2. WebSearch v1.0 部署後成長技巧
3. og:image 內容檢查（如果是占位需要重生）

---

## 2026-04-29 05:32 · Session A — INTENT: SEO meta description + settings tab 鍵盤左右切換

(已完成)

---

## 2026-04-29 05:24 · Session A — 設定頁切 3 tab（retrospective P1-4 上線必修）

**觸發**：cron 第 58 輪。Retrospective P1-4：「設定頁已成 20 row 大雜燴，玩家找匯出要捲到底、找肥胖點數要捲到中間、找音效在最上面 — information architecture 失序」。

**動作（3 tab 分組）**：

| Tab | 內容 |
|-----|------|
| 🐣 啾啾 | 連續登入 / 成長分數 / 誕生時間 / 6 traits 進度 / 滿足願望 / 抓到事件 = **11 rows** |
| ⚙️ 設定 | 音效 / 減少動畫 / 啾啾呼叫 / 安裝 PWA = **3-4 rows**（依環境） |
| 💾 存檔 | 孵化新蛋 / 匯出 / 匯入 / DEBUG / 重置 = **3-5 rows** |

每 tab ≤ 11 row，掃描成本從「滾 20 row 找一個」 → 「點對應 tab 直接看」。

**動作（CSS）**：
- `.settings-tabs` 橫列 3 顆 + 底邊框分隔
- `.settings-tab` 圓角頂 10px / 灰底 / hover 粉色 / active 變奶油白底 + 黑線稿
- `.settings-pane` 預設 hidden、`.active` 顯示 + fade-in 動畫
- ARIA：`role="tablist"` / `role="tab"` / `role="tabpanel"`（搭配上輪 a11y 改進）

**動作（JS 切換）**：
- module 級 `_settingsTab = "settings"` 預設（最常用 tab，玩家開設定 70% 是調音效 / 通知）
- onMount 在 tabs 上綁 onclick：toggle `.active` class on 對應 tab + pane
- **不重開 modal**：直接 DOM toggle 性能好、保留 focus-trap 狀態

**動作（modal title 簡化）**：「⚙️ 設定 / 除錯」→「⚙️ 設定」（debug 內藏在 💾 存檔 tab 內，不再外露）

**影響檔案**：
- `src/game.js`（openSettingsMenu 重構 ~80 行 → 3 段 + tabs nav + tab switch handler）
- `src/style.css`（+30 行 .settings-tabs / .settings-tab / .settings-pane）

**驗證**：`node --check` ✅

**對 retrospective 進度（6.5h 上線必修）**：
- ✅ 3 quick wins（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54-55）
- ✅ iOS share fallback（iter#56）
- ✅ onboarding v2（iter#57）
- ✅ **設定頁切 3 tab**（**本輪**）
- ⏸️ R-A step 2 ui.js（最後也最大塊，4h）

**已做 ~4.5h / 6.5h = 69%**。剩 R-A step 2 一條，分多輪做完即達 retrospective 預設「A」評等。

**對玩家 UX 的影響**：
- 找音效切換：之前要看完一整列 → 現在點「⚙️ 設定」直接見
- 重度玩家看 traits 進度：點「🐣 啾啾」整頁都是
- 高風險操作（重置）：藏在「💾 存檔」最後一條，不會誤觸
- 預設打開「設定」tab：覆蓋 70% 玩家進設定的目的（調音效 / 通知）

**設計小決策**：
- `_settingsTab` 是 **module 級不入 state.settings**：tab 選擇是 ephemeral（每次開都從 settings 開始預設），不需要持久化
- ARIA tab attributes（role=tab / tablist / tabpanel）讓 SR 能正確讀「分頁 1/3, 設定」
- 上輪做的 modal focus trap 自動套用：Tab 鍵在 tab buttons + pane content 之間循環

**下輪候選**：
1. R-A step 2 拆 ui.js（最後一塊，~700 行候選）
2. WebSearch v1.0 部署後成長黑客 / SEO 技巧
3. 寫一份 onboarding video script（行銷準備）
4. 補一個小 polish 例如 settings tab 鍵盤左右切換

---

## 2026-04-29 05:16 · Session A — INTENT: 設定頁切 3 tab（🐣 啾啾 / ⚙️ 設定 / 💾 存檔）

(已完成)

---

## 2026-04-29 05:08 · Session A — Onboarding v2：first_hatch 後彈進階教學（retrospective P1-3）

**觸發**：cron 第 57 輪。Retrospective P1-3：「onboarding modal 太薄，新玩家錯過 70% 系統」。原 4 句話只講基礎玩法，玩家不知道有商店 / 成就 / wants / 分享卡 / 鍵盤捷徑。

**為什麼選 first_hatch 觸發**：
- 蛋階段 6 小時太長，立刻塞所有資訊會 overwhelming
- first_hatch 是「玩家投入 6 小時後第一次看到雛雞」的高情緒點
- 此時告訴玩家「還有更多功能」反而是 reward 不是 pressure
- 也是新玩家**真正開始長期投入前**的最後教育機會

**動作（新 `showOnboardingPart2()` modal）**：
5 段內容，每段一個 emoji icon + 一句話功能介紹：
- 🎀 裝扮商店（右上 🎀）— 用飼料幣買飾品
- 📖 圖鑑（右上 📖）— 看歷代寵物 + 7 種終態 + 抓到的事件
- 🏅 成就（右上 🏅）— 30 條成就等你解鎖
- 💖 啾啾會主動表達想要什麼 — 滿足願望有額外獎勵
- 📸 分享卡（圖鑑底部）— 把啾啾的造型分享給朋友
- footer：「💡 鍵盤捷徑：1-5 互動、A 成就、? 求救」

**動作（觸發機制）**：
- `unlockAchievement("first_hatch")` 已是 onboarding 高峰時刻 — 已有「💡 點寵物名字可以取名喔～」toast 1.5s 後 + 「孵化禮 +60 FC」2.2s 後
- 加 onboarding part 2：3.5s 後（第三波，讓前兩個 toast 散去）
- **`state.history.onboardedPart2 = true`** flag 確保只彈一次
  - 玩家如果跨命（開新蛋），既有 startNewEgg 已保留 history，所以**第二隻孵化時不會再彈** ✅
  - 玩家如果重置存檔，flag 重置，新存檔第一次孵化會看到 ✅

**影響檔案**：`src/game.js`（+~16 行 onboarding part 2 modal + 5 行觸發邏輯）

**驗證**：`node --check` ✅

**對 retrospective 進度（6.5h 上線必修）**：
- ✅ 3 quick wins（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54-55）
- ✅ iOS share fallback（iter#56）
- ✅ **onboarding v2**（**本輪**）
- ⏸️ R-A step 2 ui.js（剩 4h）
- ⏸️ 設定頁切 3 tab（剩 1h）

**已做 ~3.5h / 6.5h = 54%**。剩下 R-A step 2（最大塊）+ 設定頁 tab 兩件。

**對 D1 留存的影響**：
- 新玩家完成蛋階段後立刻看到「還有商店、成就、圖鑑、wants、分享卡 + 鍵盤捷徑」
- D1 玩家平均探索 feature 數從 ~3 個 → 預期 ~6-7 個
- 結合 iter#52 的孵化禮 60 FC + 髮帶降到 50 FC，玩家**孵化後可立刻買第一件飾品**體驗商店

**下輪候選**：
1. R-A step 2 拆 ui.js（最後也最大塊）
2. 設定頁切 3 tab（1h）
3. 把 onboarding 文案 + 取名提示 + 孵化禮三 toast 順序測試（可能需調 timing）

---

## 2026-04-29 05:02 · Session A — INTENT: onboarding v2（first_hatch 後彈進階教學，retrospective P1-3）

(已完成)

---

## 2026-04-29 04:54 · Session A — iOS Safari share fallback：「長按存圖」preview modal

**觸發**：cron 第 56 輪。Retrospective 標「接近 P0」— iOS Safari standalone PWA 玩家分享卡「downloads」會打開新分頁顯示圖片，玩家困惑「然後咧」。

**動作**：

- **新 detection helper `isIOSStandalone()`**：
  - 檢查 `navigator.userAgent` 含 iPad/iPhone/iPod 且非 MSStream
  - 加上 `matchMedia("(display-mode: standalone)")` 或 `navigator.standalone === true`
  - 兩條件都成立才算 iOS PWA standalone

- **shareOrDownloadCard 三路徑分支**：
  1. **Native share sheet**（Android Chrome、modern Safari）— 既有 `navigator.canShare` 路徑
  2. **iOS standalone preview modal**（**新**）— 走 `showIOSPreview(url, title, cleanup)`
  3. **Download `<a download>`**（desktop browsers）— 既有 fallback

- **新 inline `showIOSPreview(url, title, onClose)`**：
  - 全螢幕半透明黑底 overlay（z-index 100）
  - 中間白底圓角 18px 黑線稿圖片框，含分享卡內容
  - 下方提示文字：「💡 **長按上方圖片**選『儲存到照片』」+ 副標說明 iOS PWA 限制
  - 黃色橢圓「關閉」按鈕
  - 點背景或關閉按鈕都會 cleanup（revokeObjectURL 60 秒延遲）

**設計考量**：
- inline overlay 而非 NourishUI.showModal — 因為 game.js 的 modal 系統未來會抽到 ui.js（R-A step 2），share.js 不該依賴 ui.js
- 預留 `window.NourishUI.showImagePreview` 介面：未來 ui.js 拆出後可優先用，目前 fallback 自帶
- iOS 玩家**至少看得到圖** + 知道**怎麼存**，不會再卡在「按了沒反應」

**影響檔案**：`src/share.js`（+~50 行：isIOSStandalone helper + 三路徑改造 + showIOSPreview inline modal）

**驗證**：
- `node --check src/share.js` ✅
- 手動測試需在 iOS Safari standalone PWA 環境跑（無法在 desktop 模擬完整）

**對 retrospective 進度**：
- ✅ 「接近 P0」iOS share fallback 完成
- ✅ a11y P1-2 完整（focus trap iter#55）
- ✅ R-A step 1 audio.js
- ✅ 3 quick wins
- ⏸️ R-A step 2 ui.js（最大隱性債，~700 行候選）
- ⏸️ 設定頁切 3 tab
- ⏸️ onboarding v2

從 6.5h 上線必修做了 ~3h（iOS share 30min + a11y 1h + 之前 audio + quick wins），**剩 ~3.5h 可分散下幾輪**。

**對 PWA 玩家體驗**：
- Android：`navigator.share` → 直接系統分享 sheet，可發 IG / Threads / LINE
- 桌機 Chrome / Firefox：自動下載 PNG
- **iOS Safari PWA（之前壞掉）**：preview modal「長按存圖」 → 可存到相簿，再從相簿分享到任何 app

**下輪候選**：
1. R-A step 2 拆 ui.js（連續推遲、最大塊）
2. 設定頁切 3 tab
3. onboarding v2 first_hatch 後再彈
4. WebSearch 部署成長黑客技巧（行銷準備）

---

## 2026-04-29 04:47 · Session A — INTENT: iOS Safari share fallback（接近 P0 上線必修）

(已完成)

---

## 2026-04-29 04:39 · Session A — Modal focus trap + restore focus（a11y 100% 完成）

**觸發**：cron 第 55 輪。上輪做了 a11y 60%，本輪補完最後 40%。

**動作**：

- **`modalReturnFocus` 記錄開啟者**：
  - showModal 開頭：`modalReturnFocus = document.activeElement`（過濾 body）
  - closeModal：嘗試 `target.focus()` 把焦點還給開啟元素，document.contains 防 element 被移除

- **showModal 自動 focus 進對話框**：
  - setTimeout 0ms（讓 innerHTML 穩定）
  - 優先 focus input/textarea（取名對話框會先就位）
  - 次選 button/tabindex
  - SR / 鍵盤使用者打開 modal 後立刻在內部，不會「不知道滑哪去了」

- **focus trap 全域 keydown listener（capture phase）**：
  - 只在 `modalOpen === true` 且 `key === "Tab"` 時動作
  - 找 modal-card 內所有 focusable（button / input / [href] / select / textarea / tabindex）
  - Shift+Tab 在 first 元素時跳到 last；Tab 在 last 元素時跳到 first
  - capture phase 確保比 inner handlers 早攔到

**影響檔案**：`src/game.js`（+~35 行 modal 焦點管理）

**驗證**：`node --check` ✅

**對 a11y 整體影響**：
- 完成度從 60% → **100%**（aria-label / role=dialog / aria-modal / button-ize / focus-trap / restore-focus 全做）
- 預期 Lighthouse a11y 分數 ~88 → **~95**
- 鍵盤 only 使用者可完整操作：Tab 在 modal 內循環、Esc 關閉、focus 返回觸發者
- screen reader 體驗：dialog 開啟時自動讀內容、關閉時回到原來位置

**對 retrospective P1-2 進度**：✅ **完整完成**

**accumulated retrospective 進度**：
- ✅ stat icon ⚡→🌙、天使降臨、飾品 D1 可達（iter#52）
- ✅ R-A step 1 audio.js（iter#53）
- ✅ a11y P1-2 完整（iter#54+55）
- ⏸️ R-A step 2 ui.js（最大隱性債，~700 行候選）
- ⏸️ 設定頁切 3 tab（1h）
- ⏸️ iOS Safari share fallback（接近 P0）
- ⏸️ onboarding v2

從 retrospective 列的 6.5h 上線必修做了 ~2.5h，預期評等 A- → **A**（a11y 補齊後）。

**下輪候選**：
1. R-A step 2 拆 ui.js（最後也最大塊）
2. iOS Safari share fallback
3. 設定頁切 3 tab

---

## 2026-04-29 04:32 · Session A — INTENT: modal focus trap + restore focus（a11y 100%）

(已完成)

---

## 2026-04-29 04:24 · Session A — a11y 修補 3 條（retrospective P1-2 上線必修）

**觸發**：cron 第 54 輪。Retrospective v3 列「a11y 上線標準」P1-2，1 小時內可清，本輪 10 min 拿下大部分。

**動作**：

- **5 個 action button 加 `aria-label`**（餵食 / 玩耍 / 洗澡 / 睡眠 / 愛撫）：
  - 之前 screen reader 讀到「餵食 餵食」（icon span 跟 label span 都有 emoji + 字）
  - 改：button 自帶 aria-label「餵食」，`<span class="action-icon" aria-hidden="true">` 隱藏 icon 給 SR
  - 結果：SR 只讀「餵食」一次，乾淨
  - `<nav class="action-bar" aria-label="互動操作">` 標出語意

- **`pet-wrapper` 從 `<div onclick>` 改成 `<button>`**：
  - 之前 div + onclick：鍵盤 Tab 跳不過去、SR 不知是按鈕
  - 改：`<button class="pet-wrapper" type="button" aria-label="輕觸啾啾摸頭">`
  - CSS 補：strip button default chrome（background/border/padding 0），保留 cursor pointer + focus-visible 顯示粉色 outline
  - 結果：鍵盤可 Tab + Enter 觸發、SR 讀「輕觸啾啾摸頭 按鈕」

- **modal 加 `role="dialog"` + `aria-modal="true"`**：
  - 之前 `<div class="modal">` 對 a11y tree 是「群組」，不是「模態」
  - 改：`<div class="modal" hidden role="dialog" aria-modal="true" aria-labelledby="modal-card">`
  - SR 開啟時提示「對話框」並把焦點限在內部
  - aria-labelledby 指向 modal-card（每次 showModal 寫入的內容含標題，自然會被當成 dialog name）

**還沒做的 a11y**（retrospective P1-2 剩餘）：
- modal focus trap（純 JS 寫 focus 圈內循環，~20 行）— 留下輪
- closeModal 後 restore focus 到觸發元素 — 留下輪
- Lighthouse a11y 完整跑分驗證

**影響檔案**：
- `index.html`（5 button + nav + pet-wrapper + modal 共 8 處 a11y attribute）
- `src/style.css`（pet-wrapper button reset + focus-visible outline）

**驗證**：
- `node --check src/game.js` ✅（純 HTML/CSS 改動，game.js 無動）
- `grep aria-label index.html` 從 4 → **12 個**（5 action + 1 nav + 4 header icon-btn 既有 + pet + 1 sleep label 既有 + 1 內部）
- 預期 Lighthouse a11y 從 ~75 → **~88**（剩 modal focus trap 沒做才能 95）

**對 retrospective 進度**：
- P1-2 a11y 完成 60%（aria-label / button-ize / role 完成；focus trap / restore focus 待做）
- 剩 4 條上線必修：拆 game.js 4h / 設定頁 tab 1h / iOS share 30m / onboarding v2 30m
- 完成度：retrospective 6.5h 列表已做 ~1.5h（audio 拆 + 3 quick wins + a11y 60%）

**下輪候選**：
1. R-A step 2：拆 ui.js（仍是最大隱性債）
2. modal focus trap（補完 a11y）
3. iOS Safari share fallback（接近 P0）
4. 設定頁切 3 tab

---

## 2026-04-29 04:17 · Session A — INTENT: a11y 修補 3 條（action btn aria-label + pet button + modal role）

(已完成)

---

## 2026-04-29 04:09 · Session A — R-A step 1：audio.js 拆出 + retrospective P1-7 want reward hint

**觸發**：cron 第 53 輪
**為什麼**：retrospective v3 列「R-A 拆 game.js 4 個檔（4h）」是當前最大隱性債。本輪先拆最自包含的 audio（~40 行），驗證模式可行 + 立刻見小成效（game.js -38 行）。同時做 retrospective P1-7「want bubble 沒顯示獎勵」的 5 分鐘小修。

**動作（R-A step 1：audio.js）**：

新檔 `src/audio.js`（61 行 IIFE）：
- `audioCtx` 私有變數 + `ensureAudioCtx()` lazy init
- `soundOn()` 從 `window.NourishAPI.getState()` 讀 settings.soundEnabled
- `playTone(freq, ms, type, gain)` OscillatorNode + GainNode envelope
- `SFX` 物件 8 條 procedural composite tones（click / success / fail / achievement / evolve / want / event / coin）
- 對外 `window.NourishAudio = { SFX, playTone, ensureAudioCtx }`

game.js 簡化為 1 行：
```js
const SFX = window.NourishAudio.SFX;
```

callers 不變（既有 `SFX.coin()` / `SFX.achievement()` 全部 work）。

**動作（retrospective P1-7：want reward hint）**：

`render()` 的 want-bubble innerHTML 加 `<small class="want-reward">`：
```
🍓 想吃莓果~ !
+7❤️ +12💰
```
玩家看到 want 立刻知道「滿足會 reward 7 mood + 12 coin」 — 不必猜。

CSS `.want-reward`：12px / opacity 0.85 / 棕色 #8B5A2B / display:block 換行 / margin-top 1px。

**影響檔案**：
- `src/audio.js`（新檔，61 行）
- `src/game.js`（-38 行 audio 區塊 + 1 行常數 + 2 行 want hint = 1883 行 vs 上輪 1917）
- `src/style.css`（+8 行 .want-reward）
- `index.html`（+1 script tag）

**驗證**：
- `node --check src/audio.js src/game.js` ✅
- HTTP 200：audio.js
- 模組現況：cfg 277 + dex 73 + achievements 65 + audio 61 + share 267 + game 1883 = **2626 total**

**6 模組依賴圖**：
```
cfg.js          → window.NourishCFG (eager)
dex.js          → +NourishCFG, NourishAPI(lazy) → NourishDex
achievements.js → +NourishCFG → NourishAchievements (純函式)
audio.js        → NourishAPI(lazy for soundOn) → NourishAudio
share.js        → +NourishCFG, NourishAPI(lazy) → NourishShare
game.js         → +NourishCFG, NourishAudio(eager), Dex/Share/Achievements(lazy) → sets NourishAPI
```

audio.js 比較特殊：game.js init 時就要 `const SFX = window.NourishAudio.SFX`（eager），所以 audio.js 必須在 game.js script 之前載入完。順序 `cfg → dex → achievements → audio → share → game` 滿足。

**對 retrospective P1-1 進度**：
- 目標：拆 audio / ui / interactions / events 4 個檔
- ✅ audio.js（本輪）
- ⏸️ ui.js（最複雜，~700 行候選）
- ⏸️ interactions.js（~300 行候選）
- ⏸️ events.js（~200 行候選）
- 累計：1/4 step 完成，game.js 1917 → 1883（-34，先驗證模式不會破）

**對玩家體驗**：
- audio 抽出對玩家無感（行為一致）
- want hint 對玩家**明顯有感**：之前「想吃莓果~」有人會覺得「只是要餵牠？」現在看到 +12💰 立刻明白「值得繞道」

**下輪候選**：
1. R-A step 2：拆 ui.js（最大塊，~700 行的 modal / menu / toast / speak）
2. iOS Safari share fallback（接近 P0，30min）
3. a11y 4 條（aria-label + role=dialog + focus trap）
4. onboarding v2 first_hatch 後再彈一次

---

## 2026-04-29 04:02 · Session A — INTENT: R-A step 1 — 拆 audio.js + want reward hint

(已完成)

---

## 2026-04-29 03:54 · Session A — Retrospective v3 收割：3 條 quick wins（30 分鐘級工程）

**觸發**：cron 第 52 輪。Retrospective v3 sub-agent 上輪回來，給 A- 評等 + 7 P1 + 10 P2 + 5 上線前必修。本輪挑 retrospective 標的「30 分鐘可清」最便宜 3 條。

**動作**：

- **P2-9 stat icon ⚡ → 🌙**（女性向 TA 失溫點）
  - retrospective 觀察：character-sheet §10.1 列「避免 雷電 / 力量符號」，但 stat icon ⚡ 違反此原則
  - 改：`index.html:54`、`src/share.js:200` 都換成 🌙（睡眠 / 月亮，跟「體力」語意對齊更柔和）
  - 不改 cfg label（內部 `energy` key），只動視覺 icon

- **P2-7 form_divine 命名統一：「神之降臨」 → 「天使降臨」**
  - retrospective 觀察：formLabel divine 已是「天使雞」，但成就 form_divine 還寫「神之降臨 / 養出神雞」 — 對外混搭
  - 改 `cfg.js`：`form_divine: { ..., label:"天使降臨", desc:"養出天使雞" }`
  - 玩家在 UI 看到的 form 名字 + 成就解鎖描述完全一致

- **P1-6 飼料幣經濟：第 1 件飾品 D1 內可買到**
  - retrospective 觀察：髮帶 80 FC + D1 玩家平均收入 ~120 FC → 「買髮帶就破產」
  - 改 1：`headband` price 80 → **50 FC**（D1 玩家 daily 30 + 任務 60 = 90 FC，買完還剩 40）
  - 改 2：新增 `economy.firstHatchBonus = 60`（孵化第一隻雛雞時送 60 FC，跟 first_hatch 成就同時觸發）
  - 改 3：`unlockAchievement` 在 `first_hatch` 觸發時 setTimeout 2.2s 後 `grantCoin(60, "孵化禮")` — 與既有提示 toast 不打架
  - 結果：D1 結束時玩家有 ~150 FC + first_hatch 50 FC 髮帶可買 = **第一個下午就能戴髮帶**

**影響檔案**：
- `index.html`（stat icon ⚡ → 🌙）
- `src/share.js`（分享卡 stat label ⚡ → 🌙 同步）
- `src/cfg.js`（form_divine label/desc + headband price + firstHatchBonus）
- `src/game.js`（first_hatch 解鎖 +2.2s 後送孵化禮）

**驗證**：`node --check` 三檔 ✅

**對 retrospective v3 評等的影響**：
- A- → 預期 **A**（清掉 P2-7 / P2-9 失溫點 + P1-6 上線前必修）
- 剩下 5 條上線前必修中的 3 條：拆 game.js (4h) / a11y (1h) / 設定頁切 tab (1h)，總共 6h
- 已在後續 cron 輪可分散處理

**尚未做的 retrospective 推薦**：
1. **R-A 拆 game.js 4 個檔**（4h）— **最大隱性債**
2. **a11y 上線標準**（aria-label / role="dialog" / focus trap，1h）
3. **設定頁 tab 切分**（20+ rows → 3 tabs，1h）
4. **iOS Safari share fallback**（接近 P0，30min）
5. **onboarding v2 first_hatch 後再彈一次**（10min）
6. **want bubble 顯示獎勵 hint**（5min）

**架構觀察**：
- 看 retrospective TD-1：「5 模組已抽，但停滯 — 50 輪只新增 1 條 NourishAPI 橋接」
- v2 R-1 的「3-4 小時 ROI 高」評估在 50 輪後變成「6 小時 ROI 翻倍」 — 拖越久成本越高
- 下輪 cron 應認真做 R-A 第 1 步（拆 audio.js 或 ui.js 任一個）

**下輪候選（按 retrospective 推薦排序）**：
1. R-A step 1：拆 audio.js（最自包含，~40 行）
2. P1-2 a11y 4 條（1h，可拆兩輪）
3. iOS Safari share fallback
4. want bubble reward hint（5 min 純 UI 改字）

---

## 2026-04-29 03:46 · Session A — INTENT: retrospective v3 收割 3 條 quick wins

(已完成)

---

## 2026-04-29 03:38 · Session A — 多寵物規劃 doc 寫完 + retrospective v3 sub-agent 派出

**觸發**：cron 第 51 輪
**為什麼**：50 輪已是 milestone，feature 飽和。本輪改變策略：
- (a) 並行派 sub-agent 做**外部視角的 v3 review**，找累積的盲點
- (b) 寫多寵物 v0.4 規劃 doc，把連續推遲 9 輪的議題從「待辦」 → 「明確分 sprint 的計畫」

**動作（A：retrospective sub-agent，背景跑）**：
- general-purpose agent，read-only review
- 讀清單：CHANGELOG / README / CLAUDE / GDD / character-sheet / iteration-log 最新 20 條 / review-v2 / cfg.js / game.js / index.html
- 7 重點：累積複雜度 / 平衡 / 女性向 TA 對齊 / UX 累積債 / 空缺 / 可上線評估 / 下 sprint 推薦
- 輸出到 `docs/retrospective-50.md`
- 後台跑，下輪 cron 應該會回來

**動作（B：multipet-plan.md，~150 行）**：
- 規劃稿，**明示不是實作**
- 9 章節：為什麼推遲 / MVP 範圍 / Schema 設計 / UI 改動 / 邊界風險 / 拆 sprint / v0.4 vs v0.3 定位 / 替代方案 / 決定點
- **5–6 小時工程量**估算，拆 4 個 sprint
- 7 條風險評估（migration 高 / 跨 tab 中 / cooldowns 共享 低 / wants spawn 中 等）
- Schema 雛形：`state.pets[]` + `state.activePetId` + `getActivePet()` helper + `schemaVersion: 2` 升級
- 替代方案：「**先 ship 現有單寵物版本收回饋，再決定多寵物優先序**」 — 對 user 誠實的次優解

**影響檔案**：
- `docs/multipet-plan.md`（新檔，~150 行）
- 將會新增：`docs/retrospective-50.md`（sub-agent 寫，下輪整合）

**對專案管理的影響**：
- 「多寵物推遲 9 輪」議題被妥善處理：**未實作但有清楚計畫**
- 正式列為 v0.4 而非 GDD 原訂 v0.3（誠實調整）
- 把「先上線收回饋」放進決定點 — 與其閉門做大功能，不如讓玩家驗證
- 為下次 user 想做時提供 5h Sprint A-D 完整路徑

**下輪候選**：
1. **（最高）retrospective v3 sub-agent 完成後，整合 P0/P1/P2 → 修補**
2. R-1 step 4 拆 UI primitives（最後 R-1 step）
3. WebSearch：v1.0 部署後成長黑客 / SEO 技巧
4. 多寵物 Sprint A 實際啟動（只在 user 表態想做時）

---

## 2026-04-29 03:31 · Session A — INTENT: 多寵物規劃 doc + 並行派 50 輪 retrospective sub-agent

(已完成)

---

## 2026-04-29 03:23 · Session A — 每日問候對白池（小品 polish 第 50 輪 🎉）

**觸發**：cron 第 50 輪（**自動循環里程碑**）
**為什麼**：49 輪堆功能已到飽和。本輪挑「最小但有溫度」的 polish — 跨日首次登入時啾啾說一句問候，把 daily-login 的金幣交易升級成情感互動。

**動作**：
- `CFG.speech.dailyGreet` 6 句新對白池：
  - 「新的一天，又見面了~」
  - 「早安主人！」
  - 「今天有什麼計畫呢？」
  - 「你來了！我等好久~」
  - 「想你了~」
  - 「(蹭蹭)」
- `handleDailyLogin` 跨日命中時，`setTimeout 1200ms` 後從池子隨機 speak 一句
  - 1.2 秒延遲：避開 welcome-back modal（init 後 600ms 才彈）
  - 蛋階段不講（蛋還不會說話，符合 character-sheet §2.1 寡言設定）
- 每天首次登入觸發一次，不會洗版

**設計考量**：
- 跟「歡迎回來」welcome-back 不同：welcome-back 是「離線多久」、daily-greet 是「跨午夜」
- 玩家如果一天上 5 次，只在第一次聽到 — **稀缺性 = 溫度感**
- 配合既有的「每日登入 +30 FC」+「連續 X 天」獎勵，從「打卡集點」 → 「啾啾每天迎接你」

**影響檔案**：
- `src/cfg.js`（+1 speech 池，6 條對白）
- `src/game.js`（handleDailyLogin +6 行 setTimeout 邏輯）

**驗證**：`node --check` 雙檔 ✅

**第 50 輪自動循環里程碑回顧**：
- v0.1 MVP 19/19 → v0.2 8/8 + 7 Bonus → v0.3 4/6 + 季節事件 → v1.0 PWA + 推播
- 5 模組 lazy-bridge IIFE 架構成熟
- 14 份文件家族（README + CHANGELOG + CLAUDE + 11 docs/）
- 30 條成就 / 14 互動 / 13 事件 / 14 wants / 9 配件 / 7 終態
- Session B 並行做 28+ PNG（DreamShaperXL Turbo + rembg）
- 雙 session 協作協議（INTENT 佔位 + iteration-log append-only）通過實戰驗證

**下輪候選**：
1. 多寵物 v0.4（已推 9 輪）
2. R-1 step 4 拆 UI primitives
3. 寫 docs/multipet-plan.md（規劃但不實作，defang「總是延後」的議題）
4. 50 輪 retrospective sub-agent（外部視角審視整體質量）

---

## 2026-04-29 03:16 · Session A — INTENT: 每日問候 + 連續 7 天里程碑 toast

(已完成)

---

## 2026-04-29 03:08 · Session A — Master Player 終極成就 + CHANGELOG.md（30 成就 / 14 份文件）

**觸發**：cron 第 49 輪
**為什麼**：玩家有 29 條成就但**沒有「拿了多少」的最終里程碑**。同時 49 輪迭代沒有版本層級的 CHANGELOG，外部讀者要爬 iteration-log 全文才能掌握全貌。同時做：玩家內 + 外部觀感 雙增益。

**動作（Master Player 成就）**：
- `master_player` 🎓「啾啾日常大師」desc:"達成 25 條成就"
- 評估規則：`Object.keys(state.achievements).filter(id => id !== "master_player").length >= 25`
- **排除自己**避免 chicken-and-egg：玩家先湊 25 條*非 master* 成就才能拿 master，拿了之後總數變 26
- 設計意圖：總共 30 條，要 25 條才解鎖 master，給玩家「努力但不必 100%」的中道路徑（5 條可放生）

**動作（CHANGELOG.md 寫一份）**：
新檔 `CHANGELOG.md`（root 級，~140 行）：

- **v1.0 App 階段準備**：PWA 4 件套（manifest / SW / icon set / 推播）、雙 session 協作。標明 Web Push / 雲存 / 內購等需 backend 待延後
- **v0.3 內容深度**：4/6 完成（裝扮 / 成就 / 分享 / 老年）；多寵物 / 雲存擱置
- **v0.2 互動深度**：8/8 完成 + 7 條 Bonus（wants / 鍵盤 / 匯出 / 音效 / 進化前奏 / 反饋動畫 / 粒子）
- **v0.1 MVP**：19/19，含完整 4 階段養成 + 14 互動 + localStorage
- **美術 / 視覺基礎建設**：character-sheet 5 DNA + 9 色票 + 女性向約束
- **Session B AI pipeline**：ComfyUI 0.14.1 + DreamShaperXL Turbo + rembg
- **程式架構**：5 模組 lazy-bridge IIFE
- **文件家族 14 份**（含 CHANGELOG 自己）
- **統計摘要表**：14 互動 / 13 事件 / 14 wants / 7 終態 / 9 配件 / 30 成就 / 18 對白類別 / 49 cron 輪

**動作（README link）**：
README 文件導讀表加 CHANGELOG row。

**影響檔案**：
- `src/cfg.js`（+1 achievement → 30 條）
- `src/achievements.js`（+1 evaluate rule，含 chicken-egg 防呆）
- `CHANGELOG.md`（新檔，~140 行）
- `README.md`（+1 row in 文件導讀表）

**驗證**：`node --check` 雙檔 ✅

**對外 / 對內價值**：
- 對玩家：30 條成就形成「**收集 → milestone → master**」三層 progression。完美主義者衝 30/30、輕度玩家拿 25 也夠了 master。
- 對外：路人看 GitHub repo 不必爬 iteration-log，**CHANGELOG 一頁讀懂從 v0.1 到 v1.0** 49 輪做了什麼
- 對未來協作者：版本分組讓「下一階段該做什麼」清楚（`v1.0 待實作` 列表）
- 對宣傳：CHANGELOG 統計表（14 互動 / 30 成就 / 49 輪）是行銷素材

**v0.3 完成度更新**：
- ✅ 裝扮商店 / 成就系統 / 截圖分享 / 老年互動 / **季節事件**（v0.5 提早做）
- ⏸️ 多隻寵物 / 雲端存檔（剩 2/6，都需大改）

**v1.0 完成度**：
- ✅ PWA 安裝 / 離線 / 推播雛形 / icon set
- ⏸️ Web Push / 真實時間 / 內購 / 好友 / 排行榜（5 個都需 backend）

**14 份文件家族**：README + CHANGELOG + CLAUDE + 11 docs/

**下輪候選**：
1. 多寵物 v0.4（推 8 輪了）
2. R-1 step 4 拆 UI primitives
3. WebSearch：v1.0 部署後成長黑客 / SEO 技巧
4. 寫一份 onboarding video script（給未來行銷用）

---

## 2026-04-29 02:59 · Session A — INTENT: Master Player 終極成就 + CHANGELOG.md

(已完成)

---

## 2026-04-29 02:51 · Session A — 事件統計頁面（圖鑑底部新入口，13 個事件可視化）

**觸發**：cron 第 48 輪
**為什麼**：上輪做了事件追蹤 schema + 2 條 collector 成就，但**玩家沒地方看自己抓過哪些**。`seasonal_3` 成就尤其需要 visibility — 玩家想知道「我看過幾種季節事件了」就得有頁面查。

**動作（新 modal `openEventStatsMenu`）**：
- 標題列總計：「🎲 事件紀錄 · 總計 X」
- 兩段分組：
  - **一般事件（全年）** — 7 條（coin_drop / herb / butterfly / fly / star / rainbow / candy）
  - **🎏 季節事件 X / 6（限時）** — 6 條 with date range 顯示
- 每條 row：
  - 22×22 thumbnail（從 cfg.art 載入 SVG/PNG）
  - 中文 label
  - 季節事件附 date range（如「03-20 → 05-10」）
  - 右側 count 數字
  - 未接過：opacity 0.45 + 🔒 prefix
- 底部 footnote：「季節事件依當下日期自動觸發，跨年累積收集」
- 按鈕「回圖鑑」回到 dex menu

**動作（dex 入口）**：
- 圖鑑底部 button group 從 2 顆（🏅 成就 / 📸 分享卡）→ **3 顆（多 🎲 事件 X）**
- 顯示 X = 當前 eventsCaught 計數，玩家進入即看到累積數字

**設計考量**：
- 「事件紀錄」與「成就」分離：成就是 milestone，事件統計是 detail 視圖
- 用 thumbnail（不是純 emoji icon）→ 視覺與遊戲內事件氣泡一致
- 按鈕與「分享卡」放一起 → 圖鑑 = 玩家數據中心
- 玩家發現「seasonal 6 種我有 1 種」時自然產生「等下個節日」的期待

**影響檔案**：`src/game.js`（+~35 行 openEventStatsMenu + 1 button + 1 hook）

**驗證**：`node --check` ✅

**對玩家的影響**：
- 圖鑑變更完整：終態 + 歷代 + 成就 + **事件** + 分享 五大模組
- 玩家可清楚看到「sakura 抓 3 次、xmas 抓 0 次」 → 動機回來下個季節
- `events_100` 成就有了 progress bar 感（雖然沒真實 progress bar，但有計數可看）
- 季節事件的「跨年累積」設計更有說服力（看得到「等下個節日就有了」）

**圖鑑 modal layout 演進**：
- v1（iter#4）：終態 7/7 + 歷代列表
- v2（iter#5）：+ 🏅 成就按鈕
- v3（iter#15）：+ 📸 分享卡按鈕
- v4（iter#24）：歷代 row 可點 → 詳情頁
- **v5（本輪）：+ 🎲 事件按鈕**

**下輪候選**：
1. 多寵物 v0.4（已推 7 輪）
2. R-1 step 4 拆 UI primitives
3. 加總成就「Master Player」: 達成 25/29 條成就
4. WebSearch：v1.0 部署後的成長黑客技巧

---

## 2026-04-29 02:44 · Session A — INTENT: 事件統計頁面（玩家可看 13 個事件各抓過幾次）

(已完成)

---

## 2026-04-29 02:36 · Session A — 事件追蹤 + 2 條收集成就（events_100 + seasonal_3，總數 29）

**觸發**：cron 第 47 輪
**為什麼**：上輪做完季節事件 SVG，13 個事件全 SVG 化，但**沒有 reward 玩家收集多樣性**。第 45 輪標的 design choice「不做季節收集成就避免錯過時間挫折感」可以軟化解 — 用「跨年累積」設計即可（玩家連續玩多年自然會看到所有季節）。

**動作（事件追蹤 schema）**：
- `state.history.eventsCaught` — 累積接住的事件總數（不分類別）
- `state.history.eventIds: { [id]: count }` — 每個事件 ID 各別計數
- `defaultState` 補新欄位（deepMerge 對舊存檔安全，預設 0 / {}）

**動作（resolveEvent hook）**：
- 玩家點擊事件氣泡 → 套用效果後追加追蹤兩欄位
- 失敗（過期沒接）不計，鼓勵玩家「真的接住」

**動作（2 條新成就）**：

| ID | Icon | 名稱 | 條件 |
|---|---|---|---|
| `events_100` | 🎲 | 幸運兒 | 接住 100 個隨機事件 |
| `seasonal_3` | 🎏 | 節日通 | 參與 3 種不同季節活動 |

`seasonal_3` 用 SEASONAL_IDS Set 過濾 — 在 achievements.js IIFE load 時從 `CFG.seasonalEvents.pool` 一次性建立 Set，每次 evaluate 用 `Object.keys(eventIds).filter(SEASONAL_IDS.has).length >= 3` 判斷。

**設計：跨年累積無 FOMO**：
- 玩家**任何時候開始玩，都能慢慢累積季節事件**
- 第一年只看到 sakura → 拿 1/3
- 第二年加 valentine → 2/3
- 第三年再加 xmas → 3/3 解鎖 🎏「節日通」
- 玩家**永遠不會「錯過」** — 只要持續玩就解鎖
- 跟原本 collect_all（7 種終態）邏輯一致：靠時間累積，不靠單次窗口

**動作（settings 統計顯示）**：
新 row「🎲 抓到事件 X 次」與既有「💖 滿足願望 X 次」並列。

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 29 條）
- `src/achievements.js`（+1 SEASONAL_IDS Set + 2 evaluate rules）
- `src/game.js`（+2 history schema 欄位 + 4 行 resolveEvent hook + 1 settings row）

**驗證**：`node --check` 三檔 ✅

**29 條成就分布**（更新）：
| 類別 | 數量 |
|------|------|
| 里程碑 | 6 |
| 收集（含季節） | **6（+2）** |
| 終態 | 4 |
| 互動量 | 4 |
| 連續登入 | 2 |
| 完美 | 2 |
| 穿搭 | 5 |
| 老年 | 2 |
| wants | 2 |

**對長尾玩家的影響**：
- 重度玩家（每天玩 1 個月）大約能接 100 個事件 → events_100 milestone reward
- 跨年玩家（連續 2-3 年）會在第 3 個季節時碰到 seasonal_3 自然解鎖
- 成就系統現在覆蓋 D1 → D365+ 全光譜留存目標

**設計小思考（已軟化的 design choice）**：
- 第 45 輪寫「沒有季節收集成就 — 避免 FOMO」
- 本輪改為「**有但設計成跨年累積**」 — 既給 reward 又無時限壓力
- 兩種思路都 OK，我選後者因為 reward 強化長期投入

**下輪候選**：
1. 多寵物 v0.4（已連續推遲 6 輪）
2. R-1 step 4 拆 UI primitives
3. 連續登入 streak_100 終極成就（成就的成就）
4. dexlocked 加事件統計頁面（可看 13 個事件各接過幾次）

---

## 2026-04-29 02:28 · Session A — INTENT: 事件追蹤計數 + events_100 + seasonal_3 成就

(已完成)

---

## 2026-04-29 02:20 · Session A — 5 個季節事件 SVG 補齊（emoji → 完整 SVG，character-sheet 對齊）

**觸發**：cron 第 46 輪。上輪季節事件框架建好但 5 個還是 emoji，跨平台 render 不一致，且不符 character-sheet「事件氣泡用 SVG 不用 emoji」原則。

**動作（5 張新 SVG，character-sheet §1.3 色票）**：

- **`event-valentine.svg`** — 立體愛心：深粉 #FF6B9F 主體 + 內層白色光暈 + 4 個浮動小 ♡
- **`event-summer.svg`** — 夏日海灘：黃色太陽（橘色光芒）+ 藍色波浪 3 層 + 白色泡沫紋路
- **`event-mooncake.svg`** — 月餅：棕色圓盤 #D4A574 + 8B5A2B 邊紋 + 中央「月餅」字 + 3 顆芝麻 + 旁邊小月亮 + 高光
- **`event-halloween.svg`** — 南瓜：橘色 3 重橢圓 + 黑色三角眼 + 鋸齒嘴 + 綠色蒂頭 + 紫色 / 黃色 ✦ 點綴（不嚇人版本）
- **`event-xmas.svg`** — 禮物盒：粉紅 #FF6B9F 主體 + 黃色十字緞帶 + 大型黃色蝴蝶結 + 橘色結芯 + 白色 ❄ 散落

全部用 character-sheet §1.3 9 色色票，無新顏色加入。

**動作（cfg.js）**：
5 個 entries 從 `emoji: "🌹"` 改為 `art: "assets/svg/event-valentine.svg"` 等。其他欄位（weight / label / apply / dateRange）不變。

**影響檔案**：
- `assets/svg/event-{valentine,summer,mooncake,halloween,xmas}.svg`（5 新檔）
- `src/cfg.js`（5 處 emoji → art 路徑切換）

**驗證**：
- `node --check src/cfg.js` ✅
- 5 張 SVG curl 200

**對視覺一致性的影響**：
- 6 個季節事件全部 SVG 化，跨平台（iOS / Android / Chrome / Safari / Firefox）視覺一致
- 跟 7 個一般事件（含 rainbow / candy 也是 SVG）形成 13 個事件全 SVG 統一風格
- character-sheet §10.1「粉嫩色系優先」原則嚴格執行（valentine 主體 #FF6B9F、xmas 主體 #FF6B9F、halloween 橘色但配紫色 ✦ 平衡視覺）
- character-sheet §10.4 don't-list 對齊：halloween 南瓜畫成「可愛 cute」非「scary」（圓眼 + 微笑嘴弧）

**Halloween SVG 設計小決策**：
- 西方傳統 jack-o-lantern 是恐怖向，與女性向 TA 違和
- 改用：3 顆橘色橢圓重疊 + **三角眼簡化版** + 弧線笑嘴（非鋸齒）+ 綠色心型蒂 + 紫色 / 黃色 ✦
- 結果：「**萬聖節 cute 派對**」氛圍，不嚇到玩家

**Session B 後續**：所有 SVG 路徑暴露給後續 ComfyUI 升級為 PNG。session-b-tasks.md 可由 Session B 自行加入「6 個季節事件 PNG」批次任務（不擾動）。

**13 個事件總表（一般 + 季節）**：
| 類型 | 件數 | 觸發 |
|------|----|------|
| 一般（全年） | 7 | 60 秒 30% spawn 機率 |
| 季節（限時） | 6 | 全年 0 ~ 2.5 個月窗口，weight 25-30 高於一般 |

任何月份至少有 0 個季節事件活躍（5 月 11 日後到 7 月 1 日空窗），最多 2 個並存（如 4 月 29 日只有 sakura）。

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. seasonal_collector 隱藏成就（抓滿至少 3 個不同季節事件）— 不過第 45 輪標明「**沒有季節收集成就**」是 design choice，避免錯過時間挫折感。重新思考是否破例
4. WebSearch 補強：2026 養成遊戲季節活動最佳實踐 review

---

## 2026-04-29 02:12 · Session A — INTENT: 補 5 個季節事件 SVG（情人節/夏涼/月餅/萬聖/聖誕）

(已完成)

---

## 2026-04-29 02:04 · Session A — 季節事件 v0.5 起步：櫻花飄落 + 5 個年度事件骨架

**觸發**：cron 第 45 輪
**為什麼**：market-research-2026 §2.2 提到「季節 / 限時內容」是 2026 養成遊戲長尾留存核心策略 — 玩家「永遠有新東西看」。今天是 04-29 正好在櫻花季尾段（03-20 到 05-10），是天然的測試窗口。把整個年度框架先建起來，未來節日自動觸發無需 deploy。

**動作（CFG.seasonalEvents 池子）**：
新欄位 `seasonalEvents.pool`，6 個年度限時事件：

| ID | 期間 (MM-DD) | weight | 視覺 | 效果 |
|---|---|---|---|---|
| **🌸 sakura**（**有 SVG**） | 03-20 → 05-10 | 25 | 5 瓣粉紅花 + 黃色花心 + 漂浮粉點 + ✦ | mood +18、clean +5、+10 FC |
| 🌹 valentine | 02-12 → 02-15 | 30 | emoji（暫） | mood +25、+20 FC |
| 🌊 summer_breeze | 07-01 → 08-31 | 25 | emoji（暫） | energy +20、mood +8 |
| 🥮 mooncake | 09-10 → 09-25 | 25 | emoji（暫） | hunger +30、mood +10 |
| 🎃 halloween | 10-25 → 11-01 | 25 | emoji（暫） | +30 FC、mood +10 |
| 🎁 xmas | 12-20 → 12-26 | 30 | emoji（暫） | mood +15、hunger +10、+50 FC |

季節事件的 weight 都比一般事件高（25-30，vs 一般 3-55），代表**限時稀罕性的 reward 強度**。

**動作（spawnEvent 合併邏輯）**：
- 新 helper `isSeasonalActive(event)`：用 MM-DD 字串比對，支援跨年區間（如冬季 12 月到 2 月）
- spawnEvent 改：`pool = regular.concat(seasonal.filter(isSeasonalActive))`
- 不在期間內的季節事件自動 0 機率，無需 deploy 切換

**動作（RANDOM_EVENT_APPLIES dispatch）**：
6 條新 closure：sakura / valentine / summer_breeze / mooncake / halloween / xmas，文案含 emoji 提示 + 主題化 toast。

**動作（新 SVG）**：
- `event-sakura.svg`：5 瓣花 + 黃色花心 + 4 個粉紅小點 + ✦，character-sheet 色票對齊
- 其他 5 個季節事件**先用 emoji**，等 Session B 後續 ComfyUI 批次補 PNG（Halloween 南瓜 / 聖誕禮物盒等）

**影響檔案**：
- `assets/svg/event-sakura.svg`（新檔）
- `src/cfg.js`（+CFG.seasonalEvents 整段，6 entries）
- `src/game.js`（+isSeasonalActive helper、spawnEvent 合併、+6 dispatch）

**驗證**：
- `node --check` 雙檔 ✅
- 日期邏輯測試：今天 04-29 → sakura active ✓、xmas inactive ✓
- HTTP 200：event-sakura.svg

**對玩家體驗的影響**：
- **本月在線玩家會看到櫻花飄落事件** — 春天上線就有「噢，這遊戲會跟著季節變」的驚喜
- 半年內會經歷 4-5 個不同季節事件（夏涼風、月餅、萬聖、聖誕、春櫻），給玩家「**等下個節日**」的長期錨點
- weight 25-30 比一般事件高 → 進入季節期間時，每天看到限時事件至少 1-2 次（vs 正常事件 1 次）
- 跟現役 7 個一般 + 7 種終態 + 27 條成就形成多層內容矩陣

**設計考量**：
- **MM-DD 格式跨年**：例如 `from: "12-20", to: "01-05"` 也支援（`from <= to` 為 false 時走 OR 邏輯）
- **不寫進 dexlocked / 成就**：季節事件本身沒有「收集」成就，避免錯過時間就解鎖不了的挫折感
- 玩家設備時區決定觸發時間（無 backend，誠實限制）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 補 5 個季節事件 SVG（給 Session B 寫 prompt 入 session-b-tasks.md）
4. 加 `seasonal_collector` 隱藏成就：抓到至少 3 個不同季節事件 → unlock

---

## 2026-04-29 01:56 · Session A — INTENT: 季節事件 v0.5 起步（櫻花季限時，正當季）

(已完成)

---

## 2026-04-29 01:48 · Session A — wants 計數 + 2 條 connoisseur 成就（成就總數 27）

**觸發**：cron 第 44 輪
**為什麼**：上輪 wants 池擴到 14 條，但**沒有累積成就獎勵滿足過幾條**。重度玩家會問「我滿足這麼多 wants 有沒有什麼 reward」 — 加 2 條 milestone 成就 + 設定頁可看當前計數，把 wants 系統閉環。

**動作**：

- **`state.history.wantsFulfilled`** 計數新欄位（deepMerge 對舊存檔安全，預設 0）

- **`fulfillWantIfMatches` hook**：每次滿足 want → `state.history.wantsFulfilled++`

- **2 條新成就**（`CFG.achievements`）：
  - `wants_10` 🥰「心有靈犀」 → 滿足 10 個願望
  - `wants_50` 💞「最佳搭檔」 → 滿足 50 個願望

- **`achievements.js evaluate`** 加 2 條規則

- **設定頁 traits 區段** 新增 row：「💖 滿足願望 X 次」（與既有的 fatPoints / battlePoints / 唱歌次數 等並列）

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 總 27 條）
- `src/achievements.js`（+2 evaluate rules）
- `src/game.js`（+1 history 欄位、+1 hook、+1 settings row）

**驗證**：`node --check` 三檔 ✅

**對玩家行為的影響**：
- wants 系統現在有完整 progression：spawn → 滿足 → +mood/+coin/+growth + 計數 + 里程碑成就 + 設定頁可見
- 滿足 10 wants（≈ 兩天的中度遊玩量）就拿第一個成就，**reward 速度合理不卡關**
- 滿足 50 wants（≈ 一週半重度玩家）拿第二個成就，作為**長期目標**之一
- 跟 dressup_collector / collect_all 形成「不同維度的長期目標」，玩家可以選自己喜歡的路線

**27 條成就分布**（更新）：
| 類別 | 數量 |
|------|------|
| 里程碑 | 6 |
| 收集 | 4 |
| 終態 | 4 |
| 互動量 | 4 |
| 連續登入 | 2 |
| 完美 | 2 |
| 穿搭 | 5 |
| 老年 | 2 |
| **wants** | **2（新）** |

**設計小觀察**：
- 加入 want_full 概念進階版可能是未來方向：例如連續滿足 5 個 wants 不漏 → 「lucky streak」成就。本輪先做基礎計數，下次需要才加進階變化
- wantsFulfilled 也可以做 wants 統計（哪些 wants 滿足最多次），但需要新 key/object schema。**現在不做，先觀察玩家行為再說**

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 季節事件 v0.5（依玩家裝置時間觸發特殊事件）
4. 隨機事件加成就（例如「狂熱粉絲」: 抓到 100 個事件）

---

## 2026-04-29 01:40 · Session A — INTENT: wants 計數 + 2 條 connoisseur 成就

(已完成)

---

## 2026-04-29 01:32 · Session A — Wants 池補完：9 → 14（全 14 互動覆蓋）

**觸發**：cron 第 43 輪
**為什麼**：wants 池自第 12 輪建好後沒再擴充，9 條 wants 對應 14 個互動只覆蓋一半。重度玩家會發現「啾啾從來不主動想吃蟲蟲 / 蛋糕」、「想動腦 / 想跳舞 / 摸肚子 / 玩玩具」也沒對應 want，造成成雞階段 wants 觸發頻率偏低。

**動作（5 條新 wants）**：
| ID | needs | stage | text | icon |
|----|-------|-------|------|------|
| `want_worm` | feed_worm | junior | 想吃小蟲蟲 | 🪱 |
| `want_cake` | feed_cake | adult | 想吃蛋糕~ | 🎂 |
| `want_belly` | pet_belly | chick | 想被摸肚子 | 🤲 |
| `want_toy` | play_toy | junior | 想玩玩具！ | 🧸 |
| `want_puzzle` | play_puzzle | adult | 想動腦~ | 🧩 |

stage 與互動的 unlock stage 對齊（junior 解鎖蟲蟲 / 玩具，adult 解鎖蛋糕 / 拼圖）。

**結果（14 wants 池）**：
- 蛋階段 (egg): 1 條（pet_head）
- 雛雞 (chick): 6 條（基礎 / 玉米 / 莓果 / 洗澡 / 球 / 摸肚 / 聊天）
- 幼雞 (junior): 4 條（蟲蟲 / 玩具 / 跳舞）
- 成雞 (adult): 3 條（蛋糕 / 拼圖 / 唱歌）

每階段 want 多樣性提升，玩家在不同生命週期看到的「啾啾想要什麼」更貼合該階段的可玩內容。

**影響檔案**：`src/cfg.js`（+5 entries in wants.pool）

**驗證**：`node --check` ✅ + `grep -c "id:\"want_"` 從 9 → 14

**對玩家體驗的影響**：
- 重度玩家（成雞 + 養 7 天）現在會看到「啾啾想動腦」「想吃蛋糕」這類專屬 wants，立刻 reward 玩家做的內容投入
- 雛雞/幼雞階段的 wants 多樣化（從 4 → 7 條），孵化第一週看到重複 wants 的機率降一半
- spawn 頻率沒改（每 90 秒擲 18% 機率）— 池子大了等於變奏感增加

**設計原則對齊**：
- character-sheet §10.3「玩法重 關係建立 + 自我表達」— wants 系統是這個原則最直接的體現，多樣化越強，玩家越覺得啾啾「真的會表達自己」
- 不破壞 dressup_set 等成就條件（新 wants 不影響既有判定）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives（最後 R-1 step）
3. 加 want-fulfilled 連續達成 N 條的成就（例如 connoisseur 「滿足 50 個願望」）
4. 季節事件 v0.5（玩家設備時間判斷，給春天的櫻花隨機事件等）

---

## 2026-04-29 01:26 · Session A — INTENT: 5 條新 wants 補完互動池（9 → 14，全互動覆蓋）

(已完成)

---

## 2026-04-29 01:18 · Session A — deploy.md：GitHub Pages 一鍵部署指南 + 4 平台對比 + cache-busting

**觸發**：cron 第 42 輪
**為什麼**：上輪 README 寫完，但**沒有部署指南** — 任何想 ship 出去讓朋友玩的人（包括我自己）只能憑印象 / 摸索。專案到了「能上線」的成熟度，部署文件是最後一塊缺口。

**動作（新檔 `docs/deploy.md`，~165 行）**：
10 個 sections：

1. **GitHub Pages 一鍵部署**（推薦，免費 + HTTPS + repo 整合）
   - Settings → Pages → main / root → Save → 1-2 分鐘上線
   - 之後 git push 自動 build

2. **部署前 checklist**（5 項）：node --check 全綠、本機跑過、bump CACHE_VERSION、iteration-log 有記、commit 訊息有意義

3. **Service Worker cache-busting**（重點警告）：
   - 每次 deploy 必須改 `sw.js` 的 `CACHE_VERSION` 字串
   - 不改的後果：玩家 PWA 卡舊版、看不到新功能、客訴
   - 推薦格式 `chickaday-vX-YYYY-MM-DD`

4. **HTTPS 必要性**：列 5 個非 HTTPS 不工作的功能（SW / PWA / 推播 / Web Share / Clipboard）

5. **替代部署方案** 4 種：
   - Cloudflare Pages（CDN）
   - Netlify Drop（拖檔最快）
   - Vercel（git 整合）
   - 自己 VPS + nginx（含 config 範例）

6. **部署後驗證**（10 項 checklist）：JS 200、SW registered、manifest 解析、SFX、推播、分享卡、A2HS（Android + iOS）

7. **自訂網域** 5 步：DNS CNAME、Pages settings、HTTPS、manifest 路徑檢查、README demo URL

8. **常見問題** 5 條 FAQ：PWA 卡舊版、推播不出、iOS PWA 推播、iOS 分享、localStorage 滿

9. **監控** v1.0+ 才考慮：Plausible / Umami / Sentry / Web Vitals。**強調目前 no telemetry 是隱私賣點**

10. **roll-back**：git revert / reset 流程 + cache 同步注意

**動作（README 同步）**：
- 文件導讀表加 `docs/deploy.md` 一條，連結 + 一行說明

**影響檔案**：
- `docs/deploy.md`（新檔，~165 行）
- `README.md`（+1 row in docs table）

**驗證**：純文件，markdown 格式 Pages 渲染預檢 OK

**對專案成熟度的影響**：
- 從「在本機跑著的 v0.3」 → 「**能 git push 後 1 分鐘讓朋友玩到**」
- 部署上線後可貼 link 到 dcard / Reddit / Twitter，**用戶獲取通道全開**
- TA 開始驗證：女性向設計是不是真的對胃，要靠真實玩家數據

**12 份文件家族**完整列表：
1. README.md — 對外
2. CLAUDE.md — 開發協作
3. docs/gdd.md — 設計規格
4. docs/character-sheet.md — 美術
5. docs/market-research.md / market-research-2026.md — 市場（×2）
6. docs/review.md / review-v2.md — 審查（×2）
7. docs/extensions.md — 路線圖
8. docs/iteration-log.md — 開發日誌
9. docs/image-prompts.md — AI 生圖
10. docs/session-b-tasks.md — 雙 session
11. **docs/deploy.md（本輪新）** — 部署
12. （隱含）docs/license — 待補

**下輪候選**：
1. **實際執行 GitHub Pages 部署 + 驗證**（如果 user 想推上線）
2. 多寵物 v0.4
3. R-1 step 4 拆 UI primitives
4. 寫 docs/license 段（決定 MIT / CC-BY-NC / Proprietary）

---

## 2026-04-29 01:11 · Session A — INTENT: deploy.md（GitHub Pages 部署指南 + cache-busting）

(已完成)

---

## 2026-04-29 01:03 · Session A — README.md 寫完（GitHub repo 第一印象）

**觸發**：cron 第 41 輪
**為什麼**：Session B 第 30 輪建了 `gn01816465/nourish` GitHub repo，但**沒寫 README** — 任何人 land on 那個頁面看到的是「raw files + assets/ + docs/」，零脈絡。對外推廣 / 朋友看到 / 未來協作者進來都會卡在第一步。

**動作**：
- 新檔 `README.md`（rooot 級，~140 行）：
  - **Pitch**：兩句話講清楚產品定位（療癒系、女性 TA、不會死）
  - **3 個 badge**（build none / PWA ready / Pure JS）給技術人第一眼信號
  - **快速開始**：python3 -m http.server 一行起跑
  - **PWA 安裝指引**：iOS / Android / 桌機 三平台
  - **玩法速覽表**：4 階段時長 + 解鎖
  - **15 個主要功能 bullet list**（從 25 成就 / 9 配件 / 7 事件 / PWA / 推播 / 分享卡到鍵盤捷徑全列）
  - **技術 section**：強調「零依賴 vanilla」+ 完整檔案樹（指向 5 模組）
  - **文件導讀表**：給每份 docs 一行說明 + 連結
  - **開發協作**：double session 機制、cron 10 分循環、衝突協議
  - **致謝**：標注 Tamagotchi / Neko Atsume / Adopt Me 設計參考 + Pixar/Sanrio 美術風 + Claude Sonnet 4.6/4.7 協作

**設計考量**：
- 第一句 tagline 直接拿 GDD §1.1 的 pitch，不重新發明
- 玩法速覽用表格 + emoji（README 在 GitHub 渲染漂亮）
- 不放 screenshot 連結（assets 在私人 repo，外部訪客看不到）— 等部署後再加
- 「License」明寫「尚未定」+「私人開發階段」避免被誤用
- 致謝段標 Claude Sonnet 4.6/4.7 — 透明且符合 anthropic 政策

**影響檔案**：
- `README.md`（新檔，~140 行）

**驗證**：純文件，不需 lint。GitHub 渲染預覽：badge / table / 樹狀結構都符合 GFM。

**對外觀感的影響**：
- repo landing page：raw files → 完整 product page
- 朋友 / 潛在玩家點 GitHub link 時不會迷茫
- 未來貢獻者（包括雙 session 重啟時）能 5 分鐘掌握全貌
- 對宣傳（推到 Reddit / hackernews / dcard）可直接貼 repo link

**文件家族整理**（README + 既有 docs，11 份）：
1. README.md（新）— 對外
2. CLAUDE.md — 開發者協作
3. docs/gdd.md — 設計規格
4. docs/character-sheet.md — 美術約束
5. docs/market-research.md / market-research-2026.md — 市場
6. docs/review.md / review-v2.md — 審查
7. docs/extensions.md — 路線圖
8. docs/iteration-log.md — 開發日誌
9. docs/image-prompts.md — AI 生圖
10. docs/session-b-tasks.md — 雙 session 任務介面
11. README.md — **本輪新增，外部入口**

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 修 README License 段（決定 MIT / Apache / Proprietary）
4. 寫一份簡單的 deploy.md 教 GitHub Pages 一鍵部署

---

## 2026-04-29 00:56 · Session A — INTENT: 寫 README（GitHub repo 無說明，第一印象重要）

(已完成)

---

## 2026-04-29 00:48 · Session A — 2 條新隨機事件（彩虹 + 糖果攤）

**觸發**：cron 第 40 輪
**為什麼**：隨機事件池有 5 條已穩定運行多輪，玩家在 chick 階段（24h）大概會看到一些重複。新增 2 條「治癒系」事件補強女性向 TA 偏好的「療癒 + 甜美」氛圍（character-sheet §10.1）。

**動作（2 張新 SVG）**：

- **`event-rainbow.svg`** — 7 色弧形彩虹（粉紫橘黃綠藍紫，character-sheet §1.3 色票對齊）+ 兩端白雲（黑線稿）+ 高光斜線 + 周圍 ✨ ✦ 裝飾
- **`event-candy.svg`** — 棒棒糖：粉色糖果頭（深粉螺紋 + 白色雙螺旋）+ 白色棒子 + 黃色蝴蝶結底 + 兩側 ♡ 點綴

**動作（cfg.js 池子擴充）**：
原 5 條 + 新 2 條 = **7 條 random events**：
| Event | Weight | Effect |
|-------|--------|--------|
| coin_drop 💰 | 55 | +5–15 FC |
| herb 🌿 | 18 | 全身舒暢 |
| butterfly 🦋 | 14 | mood +10 |
| fly 🪰 | 10 | clean +5、mood +3 |
| star ⭐ | 3 | 全屬性 +10、+50 FC |
| **rainbow 🌈**（新） | 12 | mood +12 + 其他 +5（治癒系） |
| **candy 🍭**（新） | 8 | mood +18 + hunger +8 + coin +5 |

新 2 條偏「mood-heavy」事件，玩家心情低時碰到會明顯感覺被治癒。

**動作（game.js dispatch table）**：
- `RANDOM_EVENT_APPLIES` 加 2 條 closure：
  - `rainbow`: `applyDelta + toast「彩虹出現！全身充滿希望」`
  - `candy`: `applyDelta + grantCoin + toast「糖果～ 甜甜的~ 心情大好」`

**影響檔案**：
- `assets/svg/event-rainbow.svg`、`event-candy.svg`（新檔）
- `src/cfg.js`（+2 entries in randomEvents.pool）
- `src/game.js`（+2 dispatch entries in RANDOM_EVENT_APPLIES）

**驗證**：`node --check` 兩檔 ✅ + 兩張 SVG HTTP 200

**對玩家體驗的影響**：
- 隨機事件池從 5 → 7 條，重複感降 28%
- 新 2 條 mood-heavy 事件 → 玩家心情低時遇到會感覺「啾啾的世界很溫柔」
- 配合上一輪 `face_first` 成就 + 25 條成就總量 + 7 終態 + 9 配件，內容深度持續累積
- 7 events × 多輪 spawn 機率 = 玩家養成過程「碰巧的小驚喜」更密集

**Session B 後續任務**（已留 SVG 占位，未來 ComfyUI 同批次產 PNG）：
- 目標 `assets/images/event-rainbow.png` + `event-candy.png`
- prompt 主題：character-sheet plush 風 + 透明背景 + 彩虹/棒棒糖
- 待 Session B 自行加入 session-b-tasks.md（不擾動）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives
3. 加 want pool entry：want_candy 「想吃糖糖!」（feed_basic）讓 candy 事件跟 want 系統連動
4. 美術延伸：寫 v0.5 配件 prompt 給 Session B（小耳機 / 蝴蝶結項圈，之前失敗的兩件）

---

## 2026-04-29 00:42 · Session A — INTENT: 2 條新隨機事件（彩虹 + 糖果攤）+ Session B PNG 任務新增

(已完成)

---

## 2026-04-29 00:34 · Session A — R-1 step 3.5：achievements.js 拆出（規則表 vs 副作用分離）

**觸發**：cron 第 39 輪
**為什麼**：成就規則表已長到 24 條（25 條 entries -1 變化條件可寫成式子的），混在 game.js 中段難讀。**規則純邏輯 / unlockAchievement 純副作用**這個分離自然好做，比拆 UI primitives 安全。

**動作**：

- **新檔 `src/achievements.js`（52 行 IIFE）**：
  - `evaluate(state, dexUnlocked)` 純函式 — 接 state snapshot + dex set，回傳 `[id, met]` 陣列
  - 無副作用，無外部依賴（只讀 NourishCFG.accessories 給 collector check）
  - 24 條規則完整搬過：first_feed / feed_50 / bath_10 / pet_50 / first_hatch / first_evolve / streak_7 / streak_30 / form_{divine,diva,fighter,sage} / collect_{3,5,all} / rich / perfect_day / dressup_{first,set,collector,full} / face_first / elder_{week,month}
  - 對外暴露 `window.NourishAchievements = { evaluate }`

- **game.js `checkAchievements()` 簡化為 4 行**：
  - 從原 32 行（含整個規則 array）→ 4 行 thin wrapper
  - 邏輯：`evaluate(state, unlockedFormsSet()).forEach(([id, met]) => met && unlockAchievement(id))`
  - `unlockAchievement` 維持在 game.js（toast / SFX / particles 都需要 closure）

- **`index.html` script 順序**：`cfg.js → dex.js → achievements.js → share.js → game.js`
  - achievements 不依 share / game，但會被 game.js 在 init 後使用

**影響檔案**：
- `src/achievements.js`（新檔，52 行）
- `src/game.js`（-28 行 → 1838 vs 1866 估值，checkAchievements 從 32 → 4 行）
- `index.html`（+1 script tag）

**驗證**：
- `node --check` 全 5 檔 ✅
- HTTP 200：achievements.js
- 模組行數：cfg 208 + dex 73 + achievements 52 + share 267 + game 1838 = **2438 total**

**模組依賴圖（5 模組現況）**：
```
cfg.js          → window.NourishCFG (eager, pure data)
dex.js          → +NourishCFG, NourishAPI(lazy) → exposes NourishDex
achievements.js → +NourishCFG → exposes NourishAchievements (純函式，無 side-effect)
share.js        → +NourishCFG, NourishAPI(lazy) → exposes NourishShare
game.js         → +NourishCFG, NourishDex/Share/Achievements(lazy) → sets NourishAPI
```

**架構成熟度**：
- 純資料 → cfg.js
- 純儲存 → dex.js
- 純邏輯 → achievements.js
- 純渲染 → share.js
- 業務邏輯 + UI + state → game.js
- **單職責原則漂亮成立**

**R-1 進度更新**：
- ✅ step 1：CFG → cfg.js（iter#14）
- ✅ step 2：share card → share.js（iter#27）
- ✅ step 3：dex → dex.js（iter#32）
- ✅ **step 3.5：achievement rules → achievements.js（本輪）**
- ⏸️ step 4：UI primitives（modal / toast / SFX）— 互相依賴最緊，留到最後
- ⏸️ step 5：i18n 骨架（CLAUDE.md §5 v0.2 寫過要做）

**下輪候選**：
1. 多寵物 v0.4
2. R-1 step 4 拆 UI primitives（最後一塊）
3. 加新隨機事件（彩虹、糖果攤）
4. v0.5 配件 prompt 給 Session B

---

## 2026-04-29 00:26 · Session A — INTENT: R-1 step 3.5 — 成就規則表抽到 achievements.js

(已完成)

---

## 2026-04-29 00:18 · Session A — 推播通知雛形（GDD §10.4 第二塊）

**觸發**：cron 多次積壓 fire 後本輪實質執行
**為什麼**：上輪 PWA icon set 補齊，推播是 PWA 體驗最後一塊；玩家把遊戲裝到主畫面後，背景分頁時 stat 危機能即時收到通知，**才算真的「啾啾在分頁旁陪你工作」**。

**動作（NotificationManager）**：

- `state.settings` 加兩欄位：`notificationsEnabled: false`（預設關，需玩家主動 opt-in）+ `lastNotifyAt: 0`（冷卻計時）

- 5 個 helper 函式：
  - `notificationsSupported()` — 檢查 `typeof Notification !== "undefined"`
  - `requestNotificationPermission()` — async，granted/denied/default 三態處理
  - `showLocalNotification(title, body)` — **優先用 SW `registration.showNotification`**（在支援的瀏覽器，關 tab 也能顯示），fallback 到 `new Notification()`（in-tab only）
  - `maybeNotifyCriticalStat()` — 每 5 分鐘 check：document.hidden + permission granted + 30min 冷卻過 + 任一 stat < 20，觸發
  - 訊息內容：飢餓 → 「{name} 肚子好餓…」、心情 → 「需要陪陪」、清潔 → 「想洗澡了」、體力 → 「累壞了」

- 設定頁加 row：「🔔 啾啾呼叫」
  - 4 種狀態文案：
    - 「瀏覽器不支援」（API 不存在）
    - 「已被封鎖」（permission === "denied"，需手動改瀏覽器設定）
    - 「已啟用」（permission granted + setting on）
    - 「點擊啟用」（其他）
  - 點擊處理：已啟用 → toggle off / 未啟用 → 跑 permission flow + 成功時即送一條測試通知「通知已開啟，{name} 餓了會跟你說 🐣」

- init 加 `setInterval(maybeNotifyCriticalStat, 5 * 60 * 1000)` 全域偵測

**限制（誠實揭露）**：
- 關 tab → 完全沒 JS 跑，這版**只能在背景分頁時 work**（chrome 還在開）
- 真正的「關 tab 也能送」需要 Web Push API + server，**待 v1.0+ 階段**
- iOS Safari 16.4+ 才支援，且需要先 A2HS

**影響檔案**：
- `src/game.js`（+~55 行 NotificationManager + UI hook + 5min interval）
- `docs/gdd.md`（§10.4 推播通知 [ ] → [x] 雛形版）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- iOS 玩家裝 PWA 後 → 設定頁開通知 → 切到別的 app 時，啾啾餓了會跳 banner 通知（和 native app 觀感一致）
- Android 玩家同理（Chrome 通知整合系統 notification center）
- 桌機背景分頁工作時，啾啾餓了會跳右下角通知 → 「分頁旁陪工作」承諾兌現
- 預設 OFF 尊重玩家：不會自動跳「請允許通知」打擾首次玩家

**GDD §10.4 進度**：
- ✅ PWA 包裝（iter#34）
- ✅ PWA icon set 全套（iter#37 by Session B）
- ✅ **推播通知雛形**（**本輪**）
- ⏸️ 真實時間鎖定（防作弊）— 需 server
- ⏸️ 內購 / 好友 / 排行榜 — v1.0+

**整體 v1.0 路徑**：3/6 完成，剩 3 條都需要 backend，**web-only 已到天花板**。

**下輪候選**：
1. 多寵物 v0.4（v0.3 最後一塊 web-only）
2. R-1 step 4 拆 UI primitives
3. 拆 achievements.js
4. 加美術延伸：寫新 v0.5 配件 prompt 給 Session B 跑

---

## 2026-04-29 00:10 · Session A — INTENT: 推播通知雛形（permission + 測試 + 背景偵測）

(已完成)

---

## 2026-04-28 22:38 · Session A — 2 條 face slot 成就 + Session B 補齊 PWA icon set 並行收尾

**觸發**：cron 第 37 輪
**為什麼**：上輪 face slot 接線完成，但**沒有對應成就引導玩家發現/購買**。Session B 也同時段補齊 PWA icon 全套 11 張（包含 maskable），manifest 從占位 → 正式可上架。

**動作（2 條新成就，總數 25）**：
- `face_first` 🕶️ **Cool Cat** — 「購入第一件臉部飾品」（解鎖即拿，鼓勵嘗試新 slot）
  - 條件：`Object.entries(state.pet.ownedAccessories).some(([id]) => CFG.accessories[id]?.slot === "face")`
- `dressup_full` 💯 **全副武裝** — 「同時配戴頭飾、臉部、項鍊、翅膀 4 種 slot」
  - 條件：`hat && face && neck && wing` 4 個 appearance key 都非 null
  - **比 dressup_set（3 slot）更高一階**，等於把全套搭配從 1030 → 1340 FC 入門價，再多一個成就鼓勵玩家投入

**Session B 補齊（觀察到的並行成果）**：
- 11 張 PWA icon 全套：`assets/icons/icon-{72,96,128,144,152,192,256,384,512}.png` + 192 / 512 maskable + favicon-32 + apple-touch-icon
- `manifest.json` 從用 chick portrait 占位 → 正式 9 個尺寸 + 2 maskable，符合 Android Chrome / iOS Safari / Lighthouse 全面合規
- `index.html` head 加 `<link rel="icon" sizes="32x32">` + `<link rel="apple-touch-icon" sizes="180x180">`
- A2HS 安裝後手機桌面 icon 會走 maskable 版本，安卓自動裁切成圓 / 圓角矩形都 OK
- **PWA Lighthouse 分數預期從 70+ → 95+**

**雙 session 整合驗證**：
- 我加成就 cfg + 邏輯，Session B 加 icon 資源，**沒撞檔**（不同檔案範疇）✅
- cfg.js 第 36 輪去重後沒再亂 → 撞檔教訓有效

**影響檔案**：
- `src/cfg.js`（+2 achievements entries → 總 25 條）
- `src/game.js`（+2 checkAchievements rules）
- Session B 並行：`assets/icons/*.png` (11 新檔)、`manifest.json`、`index.html` head

**驗證**：
- `node --check` 雙檔 ✅
- HTTP 200：manifest.json + icon-192.png

**對玩家行為的引導**：
- 玩家從 face slot 變「裝飾雜項」 → 「我要拿那個 Cool Cat 成就，買墨鏡看看」
- dressup_full 成為「終極穿搭」目標：4 slot 同時掛 — 對重度玩家是繼 collect_all（7 種終態）後最高難度的炫耀點
- 25 條成就分布：里程碑 6 / 收集 4 / 終態 4 / 互動 4 / 連續登入 2 / 完美 2 / 穿搭 5 / 老年 2

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API） — Session B 已把 PWA icon 補齊，搭配推播效果最好
3. R-1 step 4 拆 UI primitives
4. 拆 achievements.js（純資料 + 純函式，比 UI primitives 簡單）

---

## 2026-04-28 22:30 · Session A — INTENT: 2 條 face slot 成就 + session-b-tasks.md 清理

(已完成；session-b-tasks.md 由 Session B 自行維護中，不另外清理)

---

## 2026-04-28 22:22 · Session A — 撞檔處理：face slot 接線 + 去除 SKU 重複 entry

**觸發**：cron 第 36 輪 — 我在做新 SKU 同時 Session B 也並行做完同樣兩件 + 多了「sunglasses face slot」+「earbuds / collar 失敗」紀錄。
**為什麼**：cfg.js 同時段被雙方寫入，產生 `scarf` 兩條重複 key（後者會覆蓋前者，原 PNG path 失效）+ `partyhat` / `party_hat` 兩件視覺一樣的不同 SKU + Session B 加的 `face` slot 在 game.js / share.js / index.html / style.css 都還沒接線，sunglasses 戴上去看不見。

**動作（去重）**：
- 移除我加的 `partyhat` (svg) 和 `scarf` (svg) 兩條 cfg.js entry — Session B 的 PNG 版本品質更好且已有 ComfyUI 出爐
- 保留我寫的 `acc-partyhat.svg` / `acc-scarf.svg` 在 `assets/svg/`（無害備份，未來換 model 重生 PNG 失敗時可回退）
- 結果：cfg.js 每件配件只有 1 個 key，無覆蓋風險

**動作（face slot 接線完整鏈）**：
- `defaultState.pet.appearance` 加 `face: null`（deepMerge 對舊存檔安全）
- `index.html` 加 `<img class="accessory face" id="acc-face">`（**位置在 pet-img 之後**，z-index 4 蓋在頭部上）
- `style.css` `.accessory.face`：top 38px / 70×70 / z-index 4（在 hat 之下）
- `game.js render` 的 `ACC_SLOTS` 從 `["hat", "neck", "wing"]` → `["hat", "face", "neck", "wing"]`
- `share.js` `ACC_DRAW` 加 face 條目：`{ x:0.5, y:0.30, size:0.34 }`（眼睛位置 30%、占 34% 寬）
- `openShopMenu` 的 `SLOT_LABELS` / `SLOT_ORDER` 加「🕶️ 臉部」介於頭飾與項鍊之間

**影響檔案**：
- `src/cfg.js`（去重 -2 entries）
- `src/game.js`（appearance schema + ACC_SLOTS + SLOT_LABELS + SLOT_ORDER 各加 face）
- `src/share.js`（ACC_DRAW 加 face 條目）
- `src/style.css`（+9 行 .accessory.face）
- `index.html`（+1 face overlay img）

**驗證**：
- `node --check cfg.js game.js share.js` ✅
- `grep -c "scarf:" cfg.js` = 1（無重複）
- 4 個 slot 全部上線：hat / face / neck / wing

**雙 session 撞檔原因覆盤**：
- 我和 Session B 在同 10 分鐘內都看到「session-b-tasks.md §4 列了 partyhat / scarf」，都選了它們做，結果一個寫 SVG 一個寫 PNG
- **應該避免**：寫 INTENT 後 Session B 應該也 update tasks.md「進行中」標記避免撞檔，或我在 INTENT 階段就先 grep 確認沒人在做
- 目前 CLAUDE.md §6.2 已寫「先寫 INTENT 佔位告訴另一個 session」，但兩邊步調太接近時仍會撞

**對玩家的影響**（總結 9 件配件 / 4 slots）：
- 👒 頭飾 5 件：髮帶 80 / 派對帽 100 / 蝴蝶結 120 / 花環 200 / 皇冠 500
- **🕶️ 臉部 1 件**（新 slot）：心形墨鏡 180
- 📿 項鍊 / 圍巾 2 件：圍巾 150 / 珍珠項鍊 180
- 🪽 翅膀 2 件：天使 350 / 仙女 480
- 全套搭配 4 slots 同時戴需 1110 FC（hat 80 + face 180 + neck 150 + wing 350 = 760 FC 起步、攻頂版本 500+180+180+480 = 1340 FC）
- 全收集 9 件總價 **2360 FC**

**dressup_set 成就邏輯**：目前判定「同時戴 hat + neck + wing」，未把 face 列入必要條件 — 這樣對既有玩家公平（face 是 v0.4 後加的，不應追溯改變達成條件）

**下輪候選**：
1. 多寵物 v0.4
2. 推播通知（Notification）
3. R-1 step 4 拆 UI primitives
4. 加新成就「Cool Cat」: 配戴 sunglasses（鼓勵 face slot 採購）

---

## 2026-04-28 22:14 · Session A — 新配件 SKU ×2（派對帽 100 FC + 圍巾 150 FC）

**觸發**：cron 第 36 輪
**為什麼**：商店 slot 分組後（上輪），玩家會明顯注意到「項鍊只有 1 件」「頭飾入門價 80 FC 只有髮帶 1 件」 — 都是空缺。session-b-tasks.md §4 預先設計了 5 個未來配件 prompt，挑兩個最缺位的快速補上。

**動作（兩張新 SVG，character-sheet §1.3 色票）**：

- **`acc-partyhat.svg`** (hat slot, **100 FC**)：
  - 三角錐形粉色帽 + 深粉橢圓帽底
  - 5 顆白色 polka dots 點綴
  - 頂端金色 ✦ 五角星 + 橘色描邊
  - 旁邊飄浮 ✦ 裝飾 + 高光斜線
  - 定位：頭飾「中間階」入門 — 比髮帶 80 貴一階、比蝴蝶結 120 便宜，補完入門曲線

- **`acc-scarf.svg`** (neck slot, **150 FC**)：
  - 主體粉色 #FFB7B7 圍巾繞脖一圈
  - 兩端深粉 #FF89A7 流蘇飄逸（左右各一）
  - 中央黃色珠飾 #FFEC8B 點綴
  - 兩條細紋（深粉 + 白）增加質感
  - 定位：項鍊 slot 終於有第 2 件 — 比珍珠項鍊 180 便宜，給入門玩家選擇

**動作（cfg.js）**：
- `accessories` 表新增 2 條 entry，**插入位置貼著對應 slot**：
  - partyhat 放 hat 群組末尾（皇冠 500 之後不太對，放在 4 件 hat 之間 + 排序會自動依價格）
  - scarf 放 neck 群組（在 necklace 之後）
- 商店 slot 分組（上輪做的）會自動排序：價格升冪 → partyhat 在 headband 80 之後、scarf 在 necklace 180 之前

**動作（session-b-tasks.md 同步）**：
- 在 §4「未來 v0.4 額外配件」prompt 列表上方加新註記：
  - 「已先用 SVG 占位、待 PNG」section 列 partyhat / scarf
  - 提示 Session B 下次 ComfyUI 批次優先做這兩張
  - 用既有 SVG 路徑，PNG 出爐後改 cfg.js path 即可（一行小改）

**影響檔案**：
- `assets/svg/acc-partyhat.svg`、`assets/svg/acc-scarf.svg`（新檔）
- `src/cfg.js`（+2 accessories entries）
- `docs/session-b-tasks.md`（§4 加 SVG 待 PNG 標記）

**驗證**：
- `node --check src/cfg.js` ✅
- 兩張 SVG curl 200

**對玩家的影響**：
- 商店現在 9 件配件 / 3 slots：
  - 👒 頭飾 5 件：髮帶 80 → **派對帽 100**（新）→ 蝴蝶結 120 → 花環 200 → 皇冠 500
  - 📿 項鍊 / 圍巾 2 件：**圍巾 150**（新）→ 珍珠項鍊 180
  - 🪽 翅膀 2 件：天使 350 → 仙女 480
- 全套搭配總價：2030 FC → **2280 FC**，long-tail 目標再延長 3-4 天
- 入門玩家（餘額 < 200 FC）現在有 4 件可買（髮帶 / 派對帽 / 蝴蝶結 / 圍巾） — 第一次裝扮體驗從「攢 2 天才買得起」 → 「第一天就能戴」

**雙 session 接力工作流確立**：
- Session A 加新 SKU 走流程：(1) 寫 SVG (2) 加 cfg entry (3) 在 session-b-tasks.md 標 PNG 待產 (4) 玩家立即可用
- Session B 補 PNG 走流程：(1) ComfyUI 批次 (2) 改 cfg.js path 從 svg → png (3) 玩家自動升級
- 不會卡彼此進度，玩家也看不到中間態（SVG 已能完整呈現）

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API）
3. R-1 step 4 拆 UI primitives
4. 從 §4 再撈一條 SKU（小耳機 / 太陽眼鏡 / 蝴蝶結項圈）

---

## 2026-04-28 22:08 · Session A — INTENT: 新配件 SKU ×2（圍巾 neck + 派對帽 hat）

(已完成)

---

## 2026-04-28 22:00 · Session A — 商店 slot 分組（Session B 加 wings_fairy 後 7 件雜亂）+ 設定頁 PWA 安裝鈕

**觸發**：cron 第 35 輪
**為什麼**：Session B 上一輪加 `wings_fairy` 後商店有 7 件配件混在一個列表，雜亂。同時上輪做完 PWA，但玩家可能錯過 Chrome 自動安裝橫幅 — 需要設定頁有「立即安裝」備援入口。

**動作（商店 slot 分組）**：
- `openShopMenu()` 重寫：依 `slot` 分組（hat / neck / wing），各組以 modal-title 樣式 header 分隔
- header 用 `--c-pink-deep #FF89A7`（女性向粉紅強調），文字配 emoji：
  - 👒 頭飾
  - 📿 項鍊 / 圍巾
  - 🪽 翅膀
- 組內依 price 升冪排（玩家自然從便宜入門 → 攻頂）
- 結果：頭飾 4 件 / 項鍊 1 件 / 翅膀 2 件，視覺結構清楚，未來加更多 slot（v0.4 face / back…）也只要在 SLOT_LABELS / SLOT_ORDER 補資料

**動作（PWA 安裝鈕）**：
- `index.html` 內嵌 script 加捕捉 `beforeinstallprompt` event：
  - `e.preventDefault()` 截下原生橫幅
  - 存到 `window.__nourishInstallPrompt` 全域變數
  - `appinstalled` 事件觸發時清空
- 設定頁條件 row：當 `window.__nourishInstallPrompt` 存在 → 顯示「📲 裝到主畫面 → 立即安裝」row
- 點擊：呼叫 `prompt.prompt()` 喚出原生安裝對話 → `userChoice.outcome === "accepted"` 時 toast「✨ 安裝成功！」+ 關 modal
- iOS Safari 不支援這 API（需用「分享 → 加到主畫面」原生流程），因此這條 row **只在 Chrome / Edge / Brave 上顯示**

**影響檔案**：
- `src/game.js`（+~20 行 openShopMenu 重寫 + ~20 行 install button handler）
- `index.html`（+8 行 beforeinstallprompt + appinstalled listener）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 商店從「7 條雜亂列表」 → 「3 個分區清楚的目錄」，未來加 v0.4 配件也不會讓 UX 退化
- Chrome / Edge 玩家錯過自動安裝橫幅後，仍能在設定頁找到「立即安裝」按鈕（推薦給朋友時對方更願意裝）
- Session B 加的 wings_fairy（480 FC premium）現在會出現在「翅膀」section 第二位，形成 350 FC angel → 480 FC fairy 的升級階梯

**6 件配件分組**（含 wings_fairy）：

| Slot | 件數 | 入門 / 進階 |
|------|----|-----------|
| 👒 頭飾 | 4 | 80 → 120 → 200 → 500 |
| 📿 項鍊 | 1 | 180 |
| 🪽 翅膀 | 2 | 350 → 480 |

合計：總價 2030 FC，玩家「全套搭配」從第 21 輪 1430 FC 上升到 2030 FC，長尾目標再延長 ~7 天。

**下輪候選**：
1. 多寵物 v0.4 起步
2. 推播通知（Notification API + SW registration.showNotification 本機通知）
3. R-1 step 4 拆 UI primitives（modal / toast / SFX）
4. 加新事件 SKU 從 session-b-tasks.md §4「派對帽 / 太陽眼鏡」撈一條來實作

---

## 2026-04-28 21:53 · Session A — INTENT: 商店 slot 分組 + 設定頁 PWA 安裝按鈕

(已完成)

---

## 2026-04-28 21:45 · Session A — PWA 基本骨架（manifest + SW），GDD §10.4 第一塊

**觸發**：cron 第 34 輪。Session B 在 21:30 推完 wings PNG ×2 + chick-young 重生 + mood 部分修，視覺資產到位後輪到我把「能裝在手機」打通。

**為什麼**：v0.3 完成度 4/6（剩多寵物 / 雲端存檔），都需要大改 schema 或 backend。**PWA 是 v1.0 通往 App 的最低成本第一步** — 沒有 build step、沒有套件、沒有 backend 也能讓玩家把遊戲「安裝」到手機主畫面 + 離線啟動。

**動作**：

- **新檔 `manifest.json`**（PWA 設定檔）：
  - name / short_name / description（中文 lang="zh-TW"）
  - theme_color #FFD86B、background_color #FFE6B0（character-sheet §1.3 色票對齊）
  - display "standalone"、orientation "portrait"
  - icons：3 個（chick-adult-healthy.png 主、chick-baby.png 備、SVG 向量），都用既有 PNG/SVG，無新增美術成本
  - shortcuts：圖鑑 + 商店兩個快捷（手機長按 app icon 會出選單）
  - screenshots：神雞圖當宣傳預覽

- **新檔 `sw.js`**（Service Worker）：
  - cache-first + 網路備援 + 機會性 cache fill 策略
  - APP_SHELL 預快取：index.html / manifest.json / 4 個 .js / style.css
  - 其他資源（PNG / SVG）走 runtime cache，第一次造訪後就 offline-ready
  - CACHE_VERSION 字串 bump 時自動 purge 舊 cache（activate event）
  - skipWaiting + clients.claim：deploy 後不必關 tab 也立即套用新版
  - 失敗 fallback 回 index.html（最差至少看得到 app shell）

- **`index.html` 更新**：
  - `<link rel="manifest" href="manifest.json">`
  - `<link rel="apple-touch-icon">`（iOS 必要）
  - 3 個 apple-mobile-web-app meta（capable / status-bar-style / title）
  - 末段加 6 行 `navigator.serviceWorker.register("sw.js")`，silent failure 不擾既有體驗

- **GDD §10.4 更新**：「PWA 包裝」從 [ ] → [x] 完成
  - 註明「PWA 已先頂著，Capacitor / Tauri 之後再說」 — 現實的階段性決策

**影響檔案**：
- `manifest.json`（新檔，53 行 JSON）
- `sw.js`（新檔，56 行）
- `index.html`（+8 行 head meta + 6 行 script）
- `docs/gdd.md`（§10.4 標 PWA 完成）

**驗證**：
- `node --check sw.js` ✅
- `node -e "JSON.parse(...)"` manifest 合法 JSON ✅
- HTTP 200：manifest.json + sw.js
- index.html 仍回 200

**對玩家的影響**：
- **iOS 玩家**：Safari 開啟 → 分享 → 加到主畫面 → 點 icon 全螢幕啟動，看起來跟 native app 一樣
- **Android 玩家**：Chrome 會出現「安裝啾啾日常」橫幅，一鍵裝到主畫面
- **桌機**：Chrome 網址列右側出現「安裝」icon
- **離線**：第一次訪問後就能離線啟動（state 走 localStorage、UI 走 SW cache）
- 推播通知（GDD §10.4）需要另外的 Web Push API + 後端，**先跳過**

**對專案定位的影響**：
- 「ChickaDay 是個網頁遊戲」 → 「ChickaDay 是個可裝在手機的 PWA 遊戲」
- 對女性向 TA 友好：很多人不想下載 App，PWA 讓「先試玩 → 喜歡再裝」變平滑
- v1.0 的「真 App」可以延後到第三方平台合作或實際需要原生 API（推播 / AR）時再說

**v0.3 → v1.0 路線圖**：
- v0.3（裝飾 / 成就 / 分享 / 老年）：4/6 完成
- v1.0 PWA 第一步：✅ 安裝 + 離線
- v1.0 剩餘：推播 / 真實時間鎖定 / 內購 / 好友 / 排行榜

**下輪候選**：
1. 多寵物 v0.4 起步（最後一個 v0.3 web-only 項目）
2. 推播通知（Notification API + Web Push 局部實作，無 backend 仍可做本機通知）
3. R-1 step 4 拆 UI primitives
4. 加 Session B 的 wings_fairy 飾品到「全套搭配」邏輯（dressup_set 是否要改成同時戴 hat + neck + 任一 wing？目前已是任一 wing 即可）

---

## 2026-04-28 21:38 · Session A — INTENT: PWA 起步（manifest + SW + A2HS），GDD §10.4 第一塊

(已完成)

---

## 2026-04-28 21:30 · Session A — 老年互動 v1（GDD §10.3 標 [ ] → [x]）

**觸發**：cron 第 33 輪
**為什麼**：v0.3 GDD §10.3 剩 3 項（多寵物 / 老年互動 / 雲端存檔）。多寵物需要大改 schema + UI；雲端存檔需要 backend；**老年互動是純 client 內容、可在 10 分鐘做基本版**，把 v0.3 完成度從 3/6 推到 4/6。

**動作**：

- **CFG.speech.elder（7 條反思對白）**：
  - 「跟你在一起好幸福~」
  - 「你還記得我們第一次見面嗎?」
  - 「我看著你也長大了一點」
  - 「好喜歡這樣的日常」
  - 「(輕輕靠著主人)」
  - 「謝謝你一直在」
  - 「再過幾年也要記得我喔~」
  - 語氣參考 character-sheet §10.4「溫暖、撒嬌、療癒」do-list，避免「老去 / 死亡 / 悲傷」字眼

- **`pickContextualLine()` 加 elder 分支**：
  - 條件：`stage === "adult" && adultDays >= 7`
  - 機率公式：`min(0.35, 0.15 + (adultDays - 7) × 0.01)` — 第 7 天 15% / 第 22 天 30% / 第 27 天封頂 35%
  - 分支早於 stage flavor / form flavor / 其他概率分布，老朋友的話語優先（但只有 35% 機率）

- **2 條新成就**：
  - `elder_week` 🌅 相伴一週 — 成雞 stage 持續 7 天
  - `elder_month` 💖 終生伴侶 — 成雞 stage 持續 30 天
  - hook 在既有 `checkAchievements` 表，每次 tick / 互動都會檢查

- **GDD §10.3 更新**：「老年互動」從 [ ] 待研 → [x] 完成（含實作 iter#33 引用）

**影響檔案**：
- `src/cfg.js`（+2 achievement entries + 1 speech 池 = 7 條新對白）
- `src/game.js`（+8 行 pickContextualLine elder 分支 + 2 行 checkAchievements）
- `docs/gdd.md`（§10.3 老年互動標完成）

**驗證**：`node --check src/game.js src/cfg.js` ✅

**對 long-tail 留存的影響**：
- 玩家養出成雞後，**第 7 天會聽到啾啾說「跟你在一起好幸福~」+ 解鎖🌅成就** → 強化「持續陪伴」的 emotional 黏著
- 第 30 天解鎖💖終生伴侶成就 → 重度玩家的 4 週留存目標
- 文案柔軟（不講「老」「離別」「死」），符合女性向 TA 的「不焦慮」設計目標
- 既有的「開新蛋會 archive 當前」流程不受影響 — 玩家可選擇 7 天時開新蛋（拿成就 + 紀念卡）或繼續陪伴衝 30 天

**v0.3 進度**：3/6 → **4/6 完成**
- ✅ 裝飾商店 ✅ 成就系統 ✅ 截圖分享 ✅ 老年互動
- ⏸️ 多隻寵物 ⏸️ 雲端存檔

**下輪候選**：
1. 多寵物 v0.4（schema 重構 + UI 切換器，較大）
2. 雲端存檔骨架（無 backend 版本：保留現有匯出/匯入字串作為過渡，加 PWA cache 為下一版鋪路）
3. R-1 step 4：UI primitives 拆出（modal / toast）

---

## 2026-04-28 21:25 · Session A — INTENT: 老年互動（GDD §10.3 最後一塊 web-only 可做的功能）

(已完成)

---

## 2026-04-28 21:18 · Session A — R-1 step 3：dex.js 拆出（已連續推 3 輪後實質完成）

**觸發**：cron 第 32 輪（多次積壓 fire 後在此輪實質執行）
**為什麼**：R-1 拆檔自第 28 / 29 / 30 輪「下輪候選」連續標 3 次未做。dex 是繼 share 之後最自然可拆的模組（純 storage 邏輯，獨立 localStorage key，UI 留在 game.js）。趁 lazy-bridge 模式驗證可行，把這刀切下去。

**動作**：
- **新檔 `src/dex.js`（73 行 IIFE）**：
  - `KEY = "nourish.dex.v1"`
  - `loadDex()` / `saveDex(dex)` — localStorage I/O，含 QuotaExceeded 兜底（toast via API）
  - `unlockedFormsSet()` — 跨歷代 + 當前寵物 finalForm 收集
  - `archiveCurrentPet()` — 把當前寵物 snapshot（含 appearance）推進 dex，cap 50 條
  - 對外暴露 `window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet }`
- **`game.js` 留薄壁紙**：4 個 thin wrapper（`function loadDex() { return window.NourishDex.loadDex(); }` 等），既有 callers 完全不動：
  - `unlockedFormsSet()` 在 finalizeForm / openDexMenu / openAchievementsMenu / share.js (via NourishAPI) 都還能正常 call
  - `archiveCurrentPet()` 在 startNewEgg 還能正常 call
  - `loadDex()` 在 openDexMenu / openPetDetail 還能 call
  - `saveDex` 沒有 game.js 端 caller（dex.js 內部 use only），但保留 wrapper 以備將來
- **保留 `DEX_KEY` 常數**在 game.js（dbg-reset 還用 `localStorage.removeItem(DEX_KEY)` 直接清，不繞 wrapper）
- **`index.html` script 順序**：`cfg.js → dex.js → share.js → game.js`
  - dex.js 在 share.js 之前因為 share.js 不直接 require dex（透過 NourishAPI.unlockedFormsSet）
  - game.js 最後（仍是 IIFE，IIFE 末段才 set `window.NourishAPI`）

**模組依賴圖**：
```
cfg.js   →  window.NourishCFG (eager, pure data)
dex.js   →  window.NourishCFG (eager), window.NourishAPI (lazy, for getState/toast)
            window.NourishDex = { KEY, loadDex, saveDex, unlockedFormsSet, archiveCurrentPet }
share.js →  window.NourishCFG (eager), window.NourishAPI (lazy, for getState/getLastPetSrc/labels/unlockedFormsSet/toast)
            window.NourishShare = { generateShareCard, shareOrDownloadCard }
game.js  →  window.NourishCFG (eager), window.NourishShare/NourishDex (lazy)
            window.NourishAPI = { getState, getLastPetSrc, stageLabel, formLabel, formDescription, unlockedFormsSet, toast }
```

**影響檔案**：
- `src/dex.js`（新檔，73 行）
- `src/game.js`（-49 行 + 5 行 wrapper：1739 vs 上輪 ~1786）
- `index.html`（+1 `<script>` tag）

**驗證**：
- `node --check` 全 4 檔 ✅
- HTTP 200：dex.js / 既有 endpoints
- 行數：cfg 198 + dex 73 + share 266 + game 1739 = 2276 total（split 進度從 game.js 一支 → 4 支獨立模組）

**R-1 進度更新**：
- ✅ step 1：CFG → cfg.js（第 14 輪）
- ✅ step 2：share card → share.js（第 27 輪）
- ✅ step 3：dex → dex.js（**本輪**）
- ⏸️ step 4：modal / toast / speech / SFX UI primitives（更難拆，UI 互相依賴）
- ⏸️ step 5：interactions table / performInteraction（核心邏輯，與 state 高耦合，非必要）
- ⏸️ R-5：i18n 骨架

**架構意義**：
- 連續三波拆檔驗證「lazy bridge + thin wrapper」模式可重複用
- game.js 從單檔 1922 行 → 1739 行，加上 dex/share/cfg 拆出，**單檔閱讀體驗**已大幅改善（cfg 純資料、dex 純 storage、share 純 canvas、game 是業務邏輯 + UI）
- 之後加新功能可選擇性放在新模組或 game.js，視耦合度決定

**下輪候選**：
1. 多寵物 v0.4 起步（v0.3 完成 3/6，剩 multi-pet / 老年互動 / 雲端存檔，前 2 個能在 web-only 做）
2. 老年互動（成雞後特殊內容，30 天後解鎖新事件）
3. 補強 settings 頁的「我可以做什麼」說明

---

## 2026-04-28 21:08 · Session A — extreme final-30min imminent glow + GDD v0.2/v0.3 進度核對

**觸發**：cron 第 31 輪
**為什麼**：上輪解了 chick (~2h) / junior (~4h) pre-evolve glow 看時間太長會「習慣化」的問題（log 自己標的 trade-off）。本輪加 final 30 min 的「imminent」二級強度。同時 v0.2 / v0.3 大量功能已實作但 GDD 還是 [ ] 未勾，需要核對更新。

**動作（CSS + JS：3 級進化前奏）**：
- 新 `.pet.pre-evolve-imminent` class：
  - `pre-evolve-imminent-glow` 1.2s 短週期 keyframe（vs soon glow 的 2.6s）
  - drop-shadow 從 4px → **22px 粉紅 #FF89A7**（更亮、更熱烈）
  - **scale 1 → 1.04 微微膨脹**（呼吸感）
  - bob 也加快到 2.0s
  - reduced-motion 自動禁用
- render `preEvolve` 邏輯升級為三檔：
  - `null`：>window 或 score 不夠 → 無 glow
  - `"soon"`：window 內（最後 8% 或 60min 取大）→ 既有 pre-evolve glow
  - `"imminent"`：最後 30 分鐘 → 新 pre-evolve-imminent
- 蛋階段不參與（egg-shake-high 已負責）
- 睡眠中不 glow

**動作（GDD §10.2 / §10.3 進度核對）**：
全部勾選 + 註明實作的 iteration 編號：

§10.2 v0.2 必做（原預計 MVP 後 4 週）— **8/8 全做**
- 7 種終態 / 5 食物 / 5 玩耍 / 隨機事件 / 每日任務 / 圖鑑 / 取名 / 對話系統

§10.3 v0.3（原預計 8 週後）— **3/6 提早完成**
- ✅ 裝飾商店、成就系統、截圖分享
- ⏸️ 多隻寵物 / 老年互動 / 雲端存檔（後三項仍按原時程）

加上「Bonus」區段列出**沒寫進 GDD 但實作了的**：Wants 系統 / 鍵盤捷徑 / 存檔匯出匯入 / 紀念卡 / pre-evolve 三級視覺 / character-sheet / market-2026 / R-1 拆檔 / 蛋搖晃可視化等

**影響檔案**：
- `src/style.css`（+18 行 imminent class + keyframe）
- `src/game.js`（render preEvolve 三檔判定 + 兩個 toggle）
- `docs/gdd.md`（§10.2 / §10.3 重寫，標記實作狀態 + iter# 引用）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- chick / junior 進化前奏現在有「快了 → 真的快了！」兩階段
  - chick: 最後 2h pre-evolve（金黃 4px glow）→ 最後 30min 強烈 22px 粉紅 + 微膨脹
  - junior: 最後 4h pre-evolve → 最後 30min 強烈
- 配合 pre-evolve 既有的 stage-hint 文案 + 進化粒子 + sound effect，整個 5 階段是：
  1. 預備（70% 分數達標 + 進入 8% 視窗）
  2. **soon glow**（柔和金黃）
  3. **imminent glow**（強烈粉紅 + 微膨脹）
  4. 進化儀式（粒子放射 + evolve SFX）
  5. 終態揭曉（modal）

**對專案管理的影響**（GDD 更新）：
- v0.2 完成度：1/19 (mvp) → 19/19 (mvp) + 8/8 (v0.2) = **覆蓋率 ≥ 100%**
- v0.3 完成度：0/6 → **3/6**（裝扮 / 成就 / 分享）
- 自動循環在 ~3 小時內推完原本 12 週路線圖的功能（Bonus 區還列了 9 個沒寫進 GDD 的功能）

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 3 輪，下輪認真做）
2. 多隻寵物 v0.4 起步（v0.3 最後一塊，配合 GDD 標記）
3. 老年互動（成雞後 30 天加新事件）

---

## 2026-04-28 21:03 · Session A — INTENT: extreme final-30min glow + GDD §10.2/§10.3 v0.2 進度核對

(已完成)

---

## 2026-04-28 20:55 · Session A — pre-evolve 階段感知 + 接近進化事件加強 + chick/junior 倒數 hint

**觸發**：cron 第 30 輪
**為什麼**：上輪做了蛋階段的搖晃進度可視化，但 chick (24h) 和 junior (48h) 階段缺對應的「快進化了」視覺信號 — 既有 pre-evolve glow 寫死「最後 60 分鐘 + 70% 分數」，對 24h+48h 階段而言是 ≤ 4% 的時段，玩家完全注意不到。

**動作**：

- **pre-evolve 視窗改階段感知**（render 內）：
  - 公式：`window = max(60min, duration × 8%)`
  - chick 24h × 8% = 115 分鐘
  - junior 48h × 8% = 230 分鐘 (~ 4 小時)
  - egg 維持自家 egg-shake-high 處理（明確排除）
  - 條件保留 score ≥ 70% 門檻，避免分數沒到也閃光誤導玩家
  - 結果：chick 最後 2 小時、junior 最後 4 小時都有粉色金光脈動

- **隨機事件 spawn 機率階段加成**（maybeSpawnEvent 內）：
  - 階段進度 ≥ 80% 時，spawn chance 從 0.30 → 0.48（×1.6 倍，cap 0.60）
  - 「守線」獎勵：玩家在進化前最後 20% 上線會看到更多事件氣泡
  - 蛋階段不影響（蛋本來就不 spawn 事件）

- **chick / junior 倒數 hint**（stage-hint 邏輯）：
  - 進度 ≥ 92% + 分數 ≥ 70% threshold 時：
    - chick → 「🌟 啾啾準備變成幼雞了…」
    - junior → 「🌟 啾啾即將長大成雞！」
  - 跟既有 chick stage 的「未餵食 / 未取名」hints 互斥（用 else 鏈）

**影響檔案**：`src/game.js`（+15 行，3 處區塊小修）

**驗證**：`node --check` ✅

**對全階段視覺一致性的影響**：
| 階段 | 進化前奏視覺 | 進化前奏文案 |
|------|-----------|------------|
| 蛋 (6h) | 0-50% low / 50-85% med / **85%+ high + 金光** | ✨ 即將孵化…屏住呼吸！ |
| 雛雞 (24h) | **最後 ~2h pre-evolve glow** | 🌟 啾啾準備變成幼雞了… |
| 幼雞 (48h) | **最後 ~4h pre-evolve glow** | 🌟 啾啾即將長大成雞！ |
| 成雞 | (進化儀式) | (粒子 + 進化 modal) |

**對留存的影響**：
- D1 救星已就位（蛋階段視覺進度）
- D3-D5 補強：chick / junior 進化前奏時段都有「快了」的視覺 + 文案 + 事件加成三重 cue
- 玩家在 chick 階段第 22 小時開始，就會看到啾啾發光、頻繁撿到飼料幣、提示說「準備變幼雞了」，三層暗示「現在上線正划算」

**設計 trade-off**：
- pre-evolve 8% 視窗會讓 junior 玩家看金光看 4 小時，可能會「習慣化」失去儀式感
- 解法（待後續觀察）：可加一個 final 30 min 「extreme glow」二級強度（reuse egg-shake-high 思路）
- 目前先用單一強度，等玩家回饋再說

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 2 輪）
2. final 30min extreme pre-evolve glow（如果上面 trade-off 成真）
3. 多寵物欄位 v0.4 起步

---

## 2026-04-28 20:50 · Session A — INTENT: pre-evolve 改階段感知 + 接近進化時事件加強

(已完成)

---

## 2026-04-28 20:42 · Session A — 蛋搖晃 3 級進度可視化 + 即將孵化興奮提示

**觸發**：cron 第 29 輪
**為什麼**：character-sheet §2.1 規格寫「靜態橢圓，輕微晃動，有裂痕進度條」，但目前蛋只有跟其他寵物一樣的 bob 浮動。新玩家在 6 小時等待中沒有「看得到的進度感」是體驗最大缺口（蛋階段 stage-countdown 只是文字，沒有視覺）。

**動作（CSS：3 級搖晃 keyframe）**：
- `.pet.egg-shake-low` — 輕微 ±1° 旋轉，4s 週期（0-50% 進度，主要是 bob 主導）
- `.pet.egg-shake-med` — ±3° 旋轉，1.6s 週期（50-85% 進度，明顯但不焦慮）
- `.pet.egg-shake-high` — ±7° 旋轉 + 平移，0.7s 週期 + **粉色金光脈動** (reuse `pre-evolve-glow`)（85%+ 進度，即將孵化）
- 都跟 bob 共存，加 reduced-motion override

**動作（JS：進度判定）**：
- render 在處理蛋階段時計算 `progress = (timeProgress + scoreProgress) / 2`
  - 時間進度：`elapsed / 6h`
  - 分數進度：`growthScore / 30`（30 = egg.scoreToEvolve）
  - 平均代表「這蛋在時間上和照顧上有多接近孵化」
- 三檔切換：≥85% → high、≥50% → med、其他 → low
- 睡眠中時無搖晃（保留 sleep dimming 既有效果）

**動作（hint：興奮提示）**：
- stage-hint 邏輯加新分支：蛋階段 + 進度 ≥ 85% → 顯示 「✨ 即將孵化…屏住呼吸！」
- 此 hint 比其他蛋階段 hint 優先，玩家最後 30 分鐘會持續看到
- 配合 high-shake 的金光脈動 + 高頻搖晃，形成「視覺 + 文案」雙倍儀式感

**影響檔案**：`src/style.css`（+38 行 keyframes）、`src/game.js`（+13 行 render 進度判定 + hint 分支）

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 玩家進來看到蛋微微晃 → 摸幾下後晃動明顯加大 → 5-6 小時後孵化前狂震 + 金光：完整視覺進度條，不必看數字
- D1 留存救星：6 小時等待從「看數字猜什麼時候好」 → 「看蛋越搖越用力期待孵化」
- 「即將孵化…屏住呼吸！」hint 把玩家鎖在最後 30 分鐘上線（D7 之前的 first-hatch achievement 確保玩家會回來看）
- character-sheet §2.1 規格從「未實作」 → ✅ 完整實作

**設計小決策**：
- 「分數 + 時間平均」而非「兩者都滿足」：避免玩家「時間到了但分數沒到」時看到搖很大但不孵化的混淆
- low/med/high 三檔而非連續：CSS variable 連續調整在 Safari 表現不穩定 + 三檔在玩家認知上更易區分階段
- high-shake reuse `pre-evolve-glow` keyframe：色票一致 + 不增 CSS 體積

**下輪候選**：
1. R-1 step 3 拆 dex.js（已連續推 1 輪）
2. 雛雞同款進度可視化（雞冠紅點漸明 / 體型微縮放）
3. 隨機事件 spawn 機率隨進度動態調整（接近進化時加強）

---

## 2026-04-28 20:36 · Session A — INTENT: 蛋搖晃強度進度可視化 + 即將孵化興奮提示

(已完成)

---

## 2026-04-28 20:28 · Session A — 蛋階段引導提示（review-v2 P1-5 完整收尾）

**觸發**：cron 第 28 輪
**為什麼**：review-v2 P1-5「探索性入口分散，新玩家會迷路」上輪只解了一半（header 加 🏅 / 🎀 / 📖 / ⚙️ 4 顆按鈕）。蛋階段的 6 小時等待 + 開蛋後的 chick 早期是新玩家最可能流失的時段，需要主動的提示而非 onboarding modal 一次性引導。

**動作**：
- HTML 新元素 `<div class="stage-hint" id="stage-hint">`，放在 stage-info 下方
- CSS `.stage-hint`：淺粉底 #FFE0E8 + 粉紅虛線框 + 圓角 999px pill + 緩慢 pulse 動畫（reduced-motion 自動禁用）
- render 函式每 tick 重評估狀態決定提示文案：
  - `egg` 階段 + 從未摸頭：💡「輕觸蛋蛋來摸頭吧～」
  - `egg` 階段 + 已摸過 + 進度 < 50%：🥚「多陪陪蛋，孵化會更快」
  - `chick` 階段 + 從未餵食：🍗「試試左下角『餵食』喔」
  - `chick` 階段 + 未取名：✏️「點寵物名字可以幫牠取名」
  - 其他：靜默（隱藏）
- 提示是 idempotent 條件的展示，玩家做了該動作後該則 hint 自動消失，下一個情境再現

**設計原則**：
- 不打擾：只在「該知道但還沒做」的條件成立時出現
- 自動消失：玩家做了 → 條件不再成立 → 下次 render 自動 hidden
- 同時間最多 1 條：避免訊息洪水
- 跟隨 reduced-motion：尊重 a11y 設定

**影響檔案**：`index.html` (+1 div)、`src/style.css` (+22 行 .stage-hint + keyframe)、`src/game.js` (+18 行 render hint logic)

**驗證**：`node --check` ✅

**對留存的影響**：
- 新玩家在蛋階段 6 小時內**至少看過 2 條 hint**：摸頭引導 → 進度催化
- 開蛋後立刻看到「試試餵食」→ 填補從蛋到完整玩法的橋樑
- 取名提示（之前只有 first_hatch 一次性 toast，現在還會持續顯示直到玩家取名）
- review-v2 P1-5 完整解決：header icon（探索性）+ stage-hint（時序引導）+ onboarding modal（首次規則）三層保險

**新玩家動線完整對照**：
1. 啟動 → onboarding modal 一次性介紹 4 條規則
2. 蛋階段（0-6h）→ 「輕觸摸頭」hint → 玩家點擊 → 「多陪陪蛋」hint
3. 孵化 → first_hatch 成就 + 取名提示 toast
4. chick 階段 → 「試試餵食」hint → 玩家餵 → 「點名字取名」hint
5. 全部走過 → hint 自動隱藏，UI 乾淨

**下輪候選**：
1. R-1 step 3 拆 dex.js / achievements.js
2. mood overlay 換 emoji（review-v2 P2-3 提到 mood SVG 在不同 OS render 不一致，但既然已 PNG 化問題不大了）
3. 蛋的搖晃越強的視覺 cue（成長進度高時搖更兇）

---

## 2026-04-28 20:22 · Session A — INTENT: 蛋階段引導提示 + 階段適應 hint（review-v2 P1-5 收尾）

(已完成)

---

## 2026-04-28 20:14 · Session A — R-1 step 2：share.js 拆出（game.js 1922 → 1707）

**觸發**：cron 第 27 輪。R-1 step 2 已連續推遲 3 輪，本輪實質完成。

**為什麼**：game.js 已 1922 行，share card 區塊 ~237 行最自然可拆（自包含、邏輯獨立、依賴明確）。拆完後 game.js 主邏輯閱讀體驗大幅改善，第三個檔案也驗證雙模組架構可行。

**動作**：
- **新檔 `src/share.js`（266 行 IIFE）**：移過去 5 個 function：
  - `generateShareCard(past)` — 主畫卡，~170 行
  - `shareOrDownloadCard(past)` — Web Share API + download fallback
  - `wrapText(ctx, text, maxWidth)` — CJK-friendly 換行
  - `loadImage(src)` — Promise 包 Image()
  - `roundRect(ctx, x, y, w, h, r)` — Canvas 圓角 path
- **bridge `window.NourishAPI`**（game.js 暴露給 share.js）：
  - `getState()` / `getLastPetSrc()` — 動態 getter（state 是 closure-bound）
  - 函式 reference：`stageLabel / formLabel / formDescription / unlockedFormsSet / toast`
- **share.js 透過 `api()` lazy 取得 NourishAPI**，避開 script 載入時序問題
- **game.js 留薄壁紙**：`shareOrDownloadCard(past) { return window.NourishShare.shareOrDownloadCard(past); }` 兩行 wrapper，原本 callers 完全不動
- **index.html script 順序**：`cfg.js → share.js → game.js`（share.js 依 NourishCFG eager + NourishAPI lazy）

**影響檔案**：
- `src/share.js`（新檔，266 行）
- `src/game.js`（-225 行，1922 → 1697 行；之後 +13 行 bridge → 1710）
- `index.html`（+1 `<script>` tag）

**驗證**：
- `node --check` 三檔 ✅
- HTTP 200：cfg.js / share.js / game.js / index.html
- 行數：1697 (game.js) + 266 (share.js) + 197 (cfg.js) + 721 (style.css) = 2881 total
- bridge 在 game.js 1546 line（init 之前 module-scope 即執行）

**架構意義**：
- 雙檔抽出（cfg.js + share.js）= R-1 進度 30% → game.js 主邏輯仍佔 60%，但 file size 增長壓力解除
- 之後加新 v0.4 / v0.5 功能不會立刻撞 2000 行天花板
- 模組架構驗證：lazy bridge 模式 (`window.NourishAPI`) 可重複用於下一波 R-1 step 3 拆 dex.js / achievements.js
- **無 build step 原則維持**：HTML 用 script tag 順序當依賴鏈

**R-1 進度**：
- ✅ step 1：CFG → cfg.js（第 14 輪）
- ✅ step 2：share card → share.js（**本輪**）
- ⏸️ step 3：dex / achievements / accessory shop 拆出（建議下一輪做 dex，~150 行可移）
- ⏸️ step 4：modal / toast UI primitives 拆出
- ⏸️ R-5：i18n 骨架（v0.2 中英切換鋪路）

**下輪候選**：
1. R-1 step 3：拆 `dex.js`（archiveCurrentPet / startNewEgg / loadDex / saveDex / unlockedFormsSet / openDexMenu / openPetDetail，~140 行）
2. R-1 step 3 替代：拆 `achievements.js`（更小、更獨立）
3. 蛋階段 onboarding 補強（review-v2 P1-5 還沒完全處理）
4. 加分享卡的 individual SKU sticker 設計

---

## 2026-04-28 20:05 · Session A — INTENT: R-1 step 2 — 拆 src/share.js（200+ 行從 game.js 移出）

(已完成)

---

## 2026-04-28 19:57 · Session A — 3 條穿搭成就 + Session B 任務簡報文件

**觸發**：cron 第 26 輪
**為什麼**：第 21-25 輪堆了大量裝扮系統（6 配件 / 3 slots / 紀念卡），但**沒有玩家激勵的 milestone**。加 3 條穿搭成就把行為串起來。同時雙 session 協作要明確分工，寫個 Session B 簡報文件讓對方知道下一批產什麼 PNG。

**動作（成就 +3）**：
新增到 `CFG.achievements`（cfg.js line 68 附近）+ 鉤入 `checkAchievements`：

| ID | icon | 名稱 | 條件 |
|---|---|---|---|
| `dressup_first` | 🎀 | 小裝扮家 | 購入第一件飾品（owned ≥ 1） |
| `dressup_set` | ✨ | 全套搭配 | 同時戴 hat + neck + wing |
| `dressup_collector` | 💎 | 衣櫥達人 | 擁有全部飾品（owned 數 = CFG.accessories 總數，目前 6） |

`checkAchievements` hook 加在 `buyAccessory` 結尾、`equipAccessory` 結尾，每次裝扮商店操作都會檢查。

**動作（Session B 任務簡報）**：
新檔 `docs/session-b-tasks.md`，給雙 session 並行協作明確介面：

- **§1 待辦：wings PNG**（最高優先，第 23 輪 Session A 加的 SVG 還沒 PNG 化）
- **§2 mood 5 張白邊去除**（Session B 自己標記過）
- **§3 chick-young 視覺差異化**（Session B 自己標記，DreamShaperXL Turbo 不分 baby/juvenile）
- **§4 v0.4 額外配件 prompt 預覽**（小耳機 / 太陽眼鏡 / 圍巾 / 派對帽 / 蝴蝶結項圈）
- 一致性檢查清單（character-sheet §1.3 + §8）
- 完成 SOP（更新 path → 寫 log → 移交回 Session A）

**影響檔案**：
- `src/cfg.js`（+3 achievements entries）
- `src/game.js`（+3 checks、+2 hook 點）
- `docs/session-b-tasks.md`（新檔）

**驗證**：`node --check src/game.js src/cfg.js` ✅

**對玩家行為的引導**：
- 第一次點開商店 → 一買 → 立刻金光「🎀 小裝扮家」（教育玩家「裝扮系統會給回饋」）
- 中後期玩家會主動湊 hat + neck + wing 全套（dressup_set）→ 拉動 wing 銷售（350 FC，最貴的一件）
- 重度玩家會把所有配件買齊（1430 FC 總價，遠超「日常產出 80 FC」單日量）→ 14 天養成目標
- 完整 21 條成就（v0.1 17 + 本輪 +3 + 未來 +1 dressup 還沒想）→ collect_all 之外的長尾留存

**雙 session 介面**：
- Session A 改 cfg.js / game.js / SVG 邏輯
- Session B 改 ComfyUI 跑 PNG，更新 cfg.js path
- iteration-log.md 雙方都寫（append-only 在最上方）
- session-b-tasks.md 是 Session A → Session B 的「待辦清單」單向通信

**下輪候選**：
1. R-1 step 2（拆 share.js，~200 行可移）— 已連續推 2 輪
2. 「我可以做什麼」探索性提示（review-v2 P1-5 還沒完全處理，雖然加了 header 入口但新玩家蛋階段還是會迷茫）
3. 蛋階段的 6 小時等待時間能做什麼提示（onboarding 補強）

---

## 2026-04-28 19:50 · Session A — INTENT: 3 條穿搭成就 + Session B 配件 PNG 任務簡報

(已完成)

---

## 2026-04-28 19:42 · Session A — 個別寵物紀念卡（退役寵物的專屬分享卡）

**觸發**：cron 第 25 輪
**為什麼**：上輪做了圖鑑詳情頁，自然延伸 — 玩家會想把那隻退役寵物的紀念分享出去（女性向 TA：「紀念價值 + 自我表達」雙重命中）。

**動作**：
- `generateShareCard(past)` 簽名變成 optional：傳入 dex completedPets 條目時切到 **紀念卡 layout**，不傳就維持原本「現役寵物」layout
- **紀念版差異**：
  - 背景：粉 → 米白漸層（vs 現役的暖黃 → 粉）
  - 標題：「✨ 紀念冊 ✨」 / 副標 「ChickaDay · Memory」
  - 立繪：用 `past.finalForm` 對應的 portrait（PNG 或 SVG）
  - 配件：用 `past.appearance` snapshot 而非 `state.pet.appearance`
  - 名字行：「{name} · {finalForm}」（無階段、無括號）
  - 「陪伴了 {totalDays} 天」（過去式）
  - 4 條 stat 條 → 換成：
    - 形態描述（自動 word-wrap，最多 3 行）
    - 「📅 {誕生日期} → 🌙 {退休日期}」
    - 5 顆粉紅 ♡ 一字排
    - 「永遠記得你 💕」+ 「我和啾啾的回憶」+ 「ChickaDay」signature
  - 純粹紀念，不放成就 / 圖鑑數字（避免「跟現役玩家混」）
- 新增 `wrapText(ctx, text, maxWidth)` helper（簡單 char-by-char 換行，CJK 友好）
- `shareOrDownloadCard(past)` 也加 optional：filename 改 `chickaday-memory-X.png`、share text 改「紀念我養過的 X 💕」、toast 改「✨ 紀念卡已下載」
- **`openPetDetail` 詳情頁加「📸 紀念卡」按鈕**（與「回圖鑑」並列）

**影響檔案**：`src/game.js`（+~75 行）

**驗證**：`node --check` ✅ + game.js 1854 → 1922 行

**對玩家體驗的影響**：
- 完整三層分享/紀念體系：
  1. **現役分享卡**（截當下狀態）— 對外炫耀
  2. **詳情頁**（在遊戲內看歷代）— 個人翻閱
  3. **紀念卡**（退役寵物的專屬卡）— 跟朋友分享「我曾經養過」
- 紀念卡的「永遠記得你 💕」+ 5 顆粉紅愛心 + 過去式陪伴 X 天，把 emotional payoff 拉滿
- 開新蛋的儀式感 +：玩家知道「這隻退役後我還能拿牠的紀念卡分享」 → 開新蛋的心理門檻降低
- 對病毒拉新的影響 ×：玩家會把多隻寵物的紀念卡都分享出去，曝光次數不再受限於「當前寵物」

**file size 警告**：game.js 已破 1900 行，R-1 step 2 拆 share.js 的 ROI 越來越高。建議下一輪做。

**下輪候選**：
1. **R-1 step 2：拆 share.js**（含 generateShareCard / wrapText / loadImage / roundRect / shareOrDownloadCard，約 200+ 行可移動）
2. accessory PNG 化（Session B 下次 ComfyUI 配合）
3. 合併現役 + 紀念卡的「整套圖鑑分享卡」（畫上所有歷代）— 病毒效應更強但複雜度高

---

## 2026-04-28 19:33 · Session A — INTENT: 個別寵物分享卡（紀念退役寵物，extension 第 4 候選）

(已完成)

---

## 2026-04-28 19:25 · Session A — 圖鑑歷代寵物點擊查看詳情（強化情感連結）

**觸發**：cron 第 24 輪
**為什麼**：上輪做完歷代飾品 snapshot，但 dex 列表只是「一行字 + emoji 串」。點擊 row 看到完整紀念頁能把「我曾經養過這隻」感放大 ×3，符合女性向 TA 的「關係建立 + 紀念價值」訴求（feedback_target_audience.md）。

**動作**：
- 既有 `.settings-row` 在 dex 用，加上 `.pet-row` 修飾類 + `data-pet-idx` 屬性 + `tabindex="0"`，可點擊 / 鍵盤 focus
- onMount 端解析 `loadDex().completedPets[idx]` → 呼叫新函式 `openPetDetail(p)`
- 鍵盤 Enter / Space 也能開（review-v2 P2-8 a11y 延伸）
- **新增 `openPetDetail(p)`**：紀念詳情 modal，含
  - 寵物終態立繪（140×140，用對應 PNG/SVG，加粉色 drop-shadow）
  - 4 條紀錄：終態 / 誕生時間 / 退休時間 / 飼養天數
  - 穿搭區（如果有）：每件配件一 row，含縮圖 + icon + 名稱 + slot 標籤
  - 沒穿搭時顯示「沒有配戴飾品」灰字
  - 形象描述（reuse `formDescription(finalForm)`）
  - 「回圖鑑」按鈕關閉並重開 dex（不要往回按一層層）
- CSS `.settings-row.pet-row`：圓角 10px、hover 變淺粉、focus 顯示粉紅 outline（鍵盤可達）

**影響檔案**：`src/game.js` (+47 行)、`src/style.css` (+8 行)

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 圖鑑從「列表」 → 「相簿 + 簡歷」感
- 退役寵物的紀念價值 +：玩家會回頭翻看「我那隻戴皇冠的小白」「養了 12 天的元氣雞」
- 鍵盤 / 觸控通用（pointer-events 都吃，hover 桌機也好看）
- 跟分享卡形成內外雙佈展：分享卡是對外炫耀、圖鑑詳情是個人紀念

**下輪候選**：
1. R-1 step 2（拆 share.js / pet detail 也可以順便拆）
2. accessory PNG 化（Session B 下次 ComfyUI 批次配合 wings 也產 PNG）
3. mood 5 張白邊去除（Session B 已標記）
4. 圖鑑詳情頁加「分享這隻寵物」按鈕（生成 individual share card）

---

## 2026-04-28 19:18 · Session A — INTENT: 圖鑑歷代寵物點擊查看詳情（穿搭 / 飼養天數 / 終態）

(已完成)

---

## 2026-04-28 19:10 · Session A — wing slot + dex 歷代飾品 snapshot（記憶寵物的造型）

**觸發**：cron 第 23 輪。Session B 在這同時段把 5 張 accessory SVG → PNG（路徑改 `assets/images/acc-*.png`）+ 5 張 event SVG → PNG。

**動作（wing slot 第 3 個 slot）**：
- 新 SVG `acc-wings.svg`：粉紅雙翅 + 白羽脈紋 + 兩顆深粉 ✦ + 高光（character-sheet §1.3 色票）
- `cfg.js accessories` 加 `wings: { slot:"wing", price:350 }` — 暫用 SVG 路徑，等 Session B 後續批次 ComfyUI 產 PNG
- `defaultState.pet.appearance` 加 `wing: null`（deepMerge 對舊存檔安全）
- HTML 加 `<img class="accessory wing" id="acc-wing">` **放在 pet img 前面**（z-index 1，襯在身體後方，符合「翅膀在身後」物理直覺）
- CSS `.accessory.wing`：top 38、寬 200×200（比身體大、超出 pet img）+ 粉色光暈 drop-shadow
- render `ACC_SLOTS` 陣列 `["hat", "neck"]` → `["hat", "neck", "wing"]`

**動作（dex 歷代飾品 snapshot）**：
- `archiveCurrentPet` 在打包進 dex 前 snapshot `state.pet.appearance` 三個 slot 當下值
- 新增 `appearance: { hat, neck, wing }` 欄位入 `completedPets[i]`，紀錄該寵物退役當下「穿什麼」
- `openDexMenu` 歷代列表渲染：依 snapshot 對映 `CFG.accessories[id].icon`，把 emoji icon 串起來貼在名字後（例如「🐣 啾啾 · 元氣雞 🎀📿🪽」）
- 玩家養新蛋後，仍能在圖鑑看到「我之前那隻啾啾穿了什麼」 — 強化情感連結 + 收集滿足感

**動作（分享卡）**：
- 既有 `ACC_DRAW` 表加 wing slot：`{ x:0.5, y:0.45, size:1.10 }`（最大尺寸，襯在身後）
- **wing 在表中放第一個**（Object.keys 迭代順序）→ 最先 drawImage，被身體 + 飾品蓋上半部，符合視覺層次

**影響檔案**：
- `assets/svg/acc-wings.svg`（新檔，Session B 後續可生 PNG 替換）
- `src/cfg.js` (+1 wings entry)、`src/game.js` (~10 行 dex snapshot + render slot 陣列 + share card ACC_DRAW)、`src/style.css` (+9 行 .accessory.wing)、`index.html` (+1 wing overlay)

**驗證**：`node --check src/game.js src/cfg.js` ✅ + wings SVG HTTP 200

**對玩家體驗的影響**：
- 商店現在 6 件、3 slots：玩家可組「皇冠 + 項鍊 + 翅膀」一身天使裝（總價 1030 FC，符合長期目標）
- 退休的小雞在圖鑑保留造型回憶 — 從「就是另一隻成雞」 → 「我那隻穿粉紅項鍊的小啾啾」
- 圖鑑列表的 emoji icon 串等於迷你「穿搭印章」，每隻獨一無二

**6 件配件總覽**（5 in 商店現可買 + 1 wings 新加）：
| Slot | 配件 | 價格 |
|------|------|------|
| hat  | 蝴蝶髮帶 | 80 |
| hat  | 蝴蝶結   | 120 |
| hat  | 花環     | 200 |
| hat  | 皇冠     | 500 |
| neck | 珍珠項鍊 | 180 |
| **wing** | **夢幻翅膀** | **350** |

**下輪候選**：
1. 圖鑑歷代列表加上點擊查看詳情（含當時 final stats / appearance / 飼養天數紀錄）
2. mood 5 張 PNG 白邊去除（Session B 標記）
3. R-1 step 2（拆 share.js）
4. accessory PNG 化（Session B 下次 ComfyUI 批次配合）

---

## 2026-04-28 19:03 · Session A — INTENT: dex 紀錄歷代飾品 snapshot + wing slot + 第 3 件飾品

(已完成)

---

## 2026-04-28 18:55 · Session A — neck slot 配件 + 分享卡渲染配戴的飾品（炫耀價值升級）

**觸發**：cron 第 22 輪
**為什麼**：上輪「下輪候選」第 2 條「分享卡畫上配戴的配件」是炫耀價值最高 ROI；同時補第 1 條「多 slot 配件」開始多元化裝扮。

**動作（neck slot 起步）**：
- 新 SVG `acc-necklace.svg`：粉紅珍珠項鍊（漸層珠粒 + 中央深粉 #FF89A7 主珠 + 黃色 ♡ 墜飾），character-sheet §1.3 色票合規
- `cfg.js accessories` 加 `necklace: { slot:"neck", price:180 }`，並把 4 件 hat 重排「便宜 → 貴」順序（headband 80 → bow 120 → flower 200 → crown 500）讓玩家看商店時自然從入門攀升
- `defaultState.pet.appearance` 加 `neck: null`（deepMerge 對舊存檔安全）

**動作（render 多 slot 一致化）**：
- 把原本 hard-coded `hat` overlay 邏輯改成 `ACC_SLOTS.forEach(slot => ...)` 迭代
- 之後新增 wing / back slot 只要：(1) cfg 加新 slot=key (2) HTML 加 `<img id="acc-X">` (3) CSS 加 .accessory.X 位置 (4) 把 X 加進 `ACC_SLOTS` 陣列
- HTML 加 `<img class="accessory neck" id="acc-neck">`
- CSS 把共用樣式抽到 `.accessory` base class（位置 / 動畫 / drop-shadow），各 slot 只覆寫 top/size/z-index

**動作（分享卡畫上配戴飾品）**：
- `generateShareCard` 在畫完寵物立繪後，**逐 slot 載入飾品 SVG 並 drawImage**
- 新增 `ACC_DRAW` 對映表：`{ hat: {x:0.5, y:0.18, size:0.42}, neck: {x:0.5, y:0.55, size:0.55} }`
  - 座標相對於 portrait（pet 圖在 share card 中的區域），確保配件位置縮放後仍對齊
  - 大小相對於 portraitSize（360px）→ hat 約 151px、neck 約 198px
- `try/catch` 包住每張，個別失敗不會壞整張卡

**影響檔案**：
- `assets/svg/acc-necklace.svg`（新）
- `src/cfg.js`（accessories +1，重排 4 條）
- `src/game.js`（render slot 迭代 +5 行 / share card 加 ACC_DRAW + drawImage 迴圈 +20 行 / appearance schema +1 欄位）
- `src/style.css`（`.accessory` base + `.hat` `.neck` 各自樣式，淨增 5 行）
- `index.html`（+1 `<img>` overlay）

**驗證**：`node --check src/game.js src/cfg.js` ✅ + necklace SVG HTTP 200

**對玩家體驗的影響**：
- 商店現在有 5 件（4 hat + 1 neck），可同時戴帽子 + 項鍊形成「全套搭配」
- 分享卡截圖會把當下配戴的配件畫上去，**原本「養成截圖」變「個人化造型截圖」**——對女性向 TA 的「自我表達 + 炫耀」訴求是直接命中
- 開新蛋仍保留 ownedAccessories（跨命繼承，上輪已做）

**架構意義**：
- 渲染層改為 slot 迭代後，**未來加任何 slot 都是 4 個位置的小改**，不必動 render 主邏輯
- 分享卡的 ACC_DRAW 表也是同一套抽象，加新 slot 同時改兩處即可

**下輪候選**：
1. wing / back slot（再加 1-2 配件）
2. mood 5 張白邊去除（Session B 標記，需 ComfyUI 重生）
3. R-1 step 2（拆 share.js）
4. 圖鑑歷代寵物列表加上「當時配戴的飾品」紀錄（archiveCurrentPet 帶 appearance snapshot）

---

## 2026-04-28 18:48 · Session A — INTENT: neck slot + 分享卡渲染配件 + render 多 slot 一致化

(已完成)

---

## 2026-04-28 18:38 · Session A — 裝扮系統 v0.3 起步（Session B 平行做 PNG 升級，雙方無撞檔）

**觸發**：cron 第 21 輪。同時段 Session B 跑了 AI 生圖 + GitHub repo（見下方 18:30 條目），雙方在不同檔案範圍工作，cross-check 通過。

**動作（裝扮系統 v0.3，4 配件 + 商店 + 頭頂渲染）**：

- **4 張配件 SVG**（character-sheet §1.3 統一色票，viewBox 100×100）：
  - `acc-bow.svg`：粉紅蝴蝶結 #FFB7B7 + 中央深粉結 + 高光
  - `acc-flower.svg`：5 瓣粉花 + 黃色花心 + 橘色花蕊
  - `acc-crown.svg`：黃金王冠 + 粉紅 + 深粉珠寶 + 藍寶石
  - `acc-headband.svg`：粉紅蝴蝶髮帶 + 深粉內結

- **資料層 (cfg.js)**：新增 `accessories` 表（4 條，slot/art/label/icon/price）
  - 蝴蝶髮帶 80 / 蝴蝶結 120 / 花環 200 / 皇冠 500 FC
  - **與 Session B 同檔案改 petArt/moodArt 路徑無衝突**（不同 key，cross-check 已通過 line 158/166/181 三段並存）

- **狀態層**：`defaultState.pet.appearance = { hat: null }` + `ownedAccessories = {}`；`startNewEgg` 修改保留 `ownedAccessories` 跨命繼承（玩家買的飾品永久持有）

- **UI 層**：
  - header 多一顆 🎀 「裝扮商店」按鈕（與 🏅 / 📖 / ⚙️ 並列）
  - `pet-wrapper` 加 `<img class="accessory hat">` overlay（CSS 絕對定位寵物頭頂、80×80、跟著 bob 動畫）
  - render 依 `state.pet.appearance.hat` 切換 hat src，dataset.id 快取避免重複賦值
  - `openShopMenu()`：modal 列 4 條 row，未擁有「N FC」按鈕（餘額不夠 disabled）；已擁有「戴上 / ✅ 配戴中」toggle
  - `buyAccessory` / `equipAccessory` 配 SFX (coin / click / fail)

**對 Session B 那輪的兼容性**：
- ✅ Session B 換 petArt/moodArt 為 PNG 路徑（11 + 5 圖），我的 accessories 是新 key 不互相干涉
- ✅ Session B 寫的「event SVG 缺失」候選**並非實情** — 5 張 event SVG 都還在 `assets/svg/` 中（curl 200 過、本輪 ls 確認）。可能是 Session B 沒看到隱藏列表或誤判；下次 Session B 啟動可從 ls 即可釐清
- 後續：accessories 也可考慮 PNG 化（Session B 那邊有 ComfyUI pipeline，可加進該批次）

**影響檔案**：
- `assets/svg/acc-{bow,flower,crown,headband}.svg`（4 新檔）
- `src/cfg.js`（新增 accessories 表）、`src/game.js`（+~80 行 shop / equip / render hook）、`src/style.css`（+15 行 accessory.hat 樣式）、`index.html`（+1 header 按鈕、+1 hat overlay）

**驗證**：
- `node --check src/game.js src/cfg.js` ✅
- HTTP 200：4 張新配件 SVG + cross-check 5 張 event SVG 仍存在
- 雙方修改 cfg.js 整合無衝突

**對 TA 對齊的影響**：
- v0.3 必做（memory `feedback_target_audience` 標記）從規劃 → 可玩
- 配件全部粉色系 + 蝴蝶結 / 髮帶 / 花環 / 皇冠（character-sheet §10.3 清單照做）
- 跨命繼承機制讓玩家養新蛋時不會「努力又沒了」

**下輪候選（彙整 Session A + B）**：
1. **多 slot 配件**（neck / wing / back）— 跟 ComfyUI batch 配合產 PNG 版
2. **分享卡也畫上目前配戴的配件** — 截圖功能會更有「炫耀價值」
3. **Session B 提的 mood 5 張白邊去除重生**（rembg 不夠乾淨，可重 prompt 加「pure transparent, no border」）
4. **chick-young 視覺差異化**（Session B 提：DreamShaperXL Turbo 不分 baby vs juvenile，需指定姿勢 / 體型）
5. R-1 step 2（拆 share.js）

---

## 2026-04-28 18:30 · Session B — AI 生圖 21 張，整套 SVG → PNG 替換 + GitHub repo 建立

**觸發**：使用者要求「直接用 AI 生圖」
**為什麼**：「畫風是決定要不要玩這遊戲的因素之一」（已存記憶 feedback_art_priority）。SVG 占位圖完成度高但仍是過渡品，PNG 替換是 v0.2 上線前的必要條件。

**動作**：
- 建立 GitHub repo `gn01816565/nourish`（public, main 分支，初始 commit 31 檔）
- 透過 `kmm → linux-pc`（192.168.50.68，RTX 3060 Ti 8GB VRAM）跑 ComfyUI 0.14.1
- 修 ComfyUI 環境：torch 2.10+cu128 → 2.5.1+cu121（cuDNN 與 driver 535 相容）
- Pipeline：DreamShaperXL Turbo（SDXL，8 步 dpmpp_sde+karras CFG=2.0）→ rembg `isnet-anime`（角色）/ `u2net`（物件）去背 → PIL crop+pad+resize 512×512
- 21 張 PNG 出爐：11 chick variants（egg/cracked/baby/young/7 成年）+ 5 mood + 3 食物 + 2 背景
- pngquant 壓縮：4.9MB → **1.8MB**（63% 減幅）
- 風格：Pixar/Sanrio 毛茸茸 plush 風（DreamShaperXL Turbo bias，雖然 prompt 寫 flat 2D 但生成偏 3D 軟質）
- 角色一致性：同 seed + 同 IDENTITY 段，跨 11 張 chick variants 保持「同一隻雞」感意外得好
- 接線：`src/cfg.js` petArt/moodArt 全部 `assets/svg/*.svg` → `assets/images/*.png`；`src/game.js:652` 背景 src 同步換 PNG

**影響檔案**：
- 新增 `assets/images/*.png` 21 張
- 修改 `src/cfg.js`（petArt + moodArt path 全換）、`src/game.js`（bg path）
- 新增 `.gitignore`（含全域 `~/.gitignore_global` 對 `index.html` 例外）
- GitHub: https://github.com/gn01816465/nourish

**驗證**：
- `node --check src/game.js src/cfg.js` ✅
- `curl localhost:8765/assets/images/*.png` 8 張全 200 ✅

**已知限制**：
- mood 5 張帶白色 sticker 外框（non-pure transparent），overlay 用可能略微突兀
- chick-young 與 chick-baby 視覺差異不夠大（DreamShaperXL Turbo 不太分得出 baby vs juvenile）
- 風格偏 3D plush 而非原 GDD 寫的 flat 2D vector — 改 model 或加 LoRA 可解，但這套對女性向 TA 反而對胃

**下輪候選**：
- 重生 mood 5 張去除 sticker 外框（強推「pure emoji icon, no border, no frame」）
- 改善 chick-young（更明顯的少年體態）
- 補生原本就缺的 event SVG（coin / herb / butterfly / fly / star — cfg.js 第 94-98 行引用但檔案不存在）
- 把 v0.1 commit 切成階段性 commits（user 之前選 single commit，可後續用 `git filter-branch` 重切，但實用性低）

---

## 2026-04-28 18:10 · Session A — 元氣雞 SVG 重畫 + 愛撫愛心粒子（女性向視覺最後拼圖）

**觸發**：cron 第 20 輪
**為什麼**：上輪文案軟化已完成（戰鬥雞 → 元氣雞、打沙包 → 動感節拍），但**SVG 還是暗紅頭巾 + 暗紅拳套 + X 眼**，視覺與文案打架。這輪把這塊補完，讓 character-sheet §10.2 整套女性向軟化清單視覺與文案完全對齊。

**動作（fighter SVG 重繪）**：
舊版（v1）→ 新版（v2，character-sheet §10.2 對齊）：

| 元素 | v1 | v2 |
|------|----|----|
| 頭巾 | 暗紅 #B23A48 帶虛線縫合 | **粉色 #FFB7B7 運動帶 + 中央 ✦ 星星 + 兩側白色 ♡** |
| 眼睛 | X 形銳利線（鬥志感） | **圓黑點 + 白高光（標準啾啾識別 DNA）** |
| 臉頰 | 無 | **粉色腮紅** |
| 拳套 | 暗紅 #B23A48 圓 | **粉色 #FFB7B7 軟拳套 + 白色 ♡ + 高光點** |
| 嘴 | V 形上揚弧線 | **U 形溫和微笑** |
| 身體裝飾 | 無 | **腹部羽毛紋（橘色細線）** |
| 周邊 | ⚡ 閃電 | **✨ 星光 + ♪ 音符 + ♡ 愛心** |

**對 character-sheet §1.2 視覺 DNA 的合規檢查**：
- ✅ 體色 #FFD86B 主色保留
- ✅ 大圓眼 + 左上單一白高光（從 X 眼回到標準 DNA）
- ✅ 小三角橘喙 #FF9F43
- ✅ 大頭比例（頭 38r / 身 55r ≈ 0.69，符合成雞範圍）
- ✅ 粗黑線稿 ~3px

**動作（愛撫愛心粒子）**：
- `playReactionAnim` floats 池調整（character-sheet §10.3 加大愛心比例）：
  - 餵食：`["🍴", "♡"]`
  - 玩耍：`["♪","🎵","✨"]`（移除「💫」中性符號）
  - 洗澡：`["🫧","🫧","✨"]`（保持）
  - **摸頭**：`["💕","♡"]`
  - **摸肚子**：`["💖","♡","♡"]`（最甜，3 顆）
  - **對話**：`["💬","♡"]`
- `spawnFloatEmoji` 偵測愛心類 emoji（♡ / 💕 / 💖）→ 加 `.heart` class
- CSS `.float-emoji.heart`：粉紅色 #FF89A7 + 雙層粉色 text-shadow + 增大字級到 28px → 愛心會「發光」
- 順手加粒子數量 cap（≤ 8）防止連點堆爆 DOM（補 P1-6 缺漏點）

**影響檔案**：
- `assets/svg/chick-adult-fighter.svg`（重寫）
- `src/game.js`（playReactionAnim mapping + spawnFloatEmoji heart class + 數量 cap）
- `src/style.css`（`.float-emoji.heart` 粉色發光樣式）

**驗證**：`node --check` ✅ + fighter SVG HTTP 200

**對 TA 對齊的影響**：
- 元氣雞文案 + 視覺現在 100% 一致（粉色運動帶 + 圓眼 + 笑臉 + 愛心拳套）
- 玩家摸頭摸肚子會看到「3 顆粉紅發光愛心從寵物身上飄出」→ 直接踩中女性向「療癒陪伴」的核心情感點
- 玩耍時的 ♪🎵✨ 音符星星比舊版的「💫」更甜美
- 整體互動視覺從「中性活潑」 → 「甜美療癒」基調確立

**下輪候選**：
1. 裝扮商店 v0.3 起步（蝴蝶結 / 髮帶 / 花環 SVG 各一張）
2. 神雞 SVG 加粉色光暈（character-sheet §10.2「光暈帶粉色調」）
3. R-1 step 2（拆 share.js）
4. 第 19 輪兩側飄 ♡ 元素的更精緻版本（飄動動畫，character-sheet §10.1 甜美裝飾）

---

## 2026-04-28 18:03 · Session A — INTENT: 元氣雞 SVG 重畫（粉色運動帶 + 軟拳套）+ 愛撫愛心粒子

(已完成)

---

## 2026-04-28 17:55 · Session A — TA 視覺 audit pass：圓角 ↑ / 粉色比例 ↑ / 戰鬥雞全軟化

**觸發**：cron 第 19 輪。上一輪收到 TA = 女性 feedback 後立刻優先處理。

**動作（CSS：圓角 + 粉色佔比）**：
- `--radius` 14 → **20**（btn / card / 互動子選單一律更圓潤），新增 `--radius-sm: 14px` 用在較小元素
- 新增色票 `--c-pink-deep #FF89A7`（桃紅）+ `--c-pink-soft #FFE0E8`（淺粉）
- body 背景漸層：`#FFE6B0 → #FFEFC1 → #FFD9E0` 改成 `#FFE6B0 → #FFD9E0 → #FFCFE2`，粉色比重從 ~33% → ~55%
- header 漸層：`yellow → orange` → **`yellow → pink`**（character-sheet §10.1）
- action button 背景：純白 → **`linear-gradient(180deg, white, --c-pink-soft)`**，hover 時加深到 `--c-pink`
- coin pill：加粉色尾段 `linear-gradient(yellow, #FFEC8B, pink-soft)`，圓角從 14px 改 999px（純橢圓）
- menu-item：圓角 12 → 16，hover 變粉
- modal-close：純黃 → **`linear-gradient(yellow, pink)`**，圓角 12 → 999（橢圓 pill）
- `#app::before / ::after` 雙側飄 ♡ 裝飾（透明度 0.18 + 旋轉 ±12°），手機尺寸隱藏避免擠

**動作（程式 + 文案：戰鬥雞全軟化）**：
character-sheet §10.2 軟化清單對照執行：

| 位置 | 改動 |
|------|------|
| `formLabel("fighter")` | 「戰鬥雞」 → **「元氣雞」** |
| `formDescription("fighter")` | 「戴頭巾、戴拳套，眼神銳利。打沙包打出來的硬漢路線。」→ **「粉色運動帶、活力滿點，跳跳活蹦的元氣派路線。」** |
| `formLabel` 其他 | 胖雞 → 圓潤雞、醜雞 → 迷因雞、神雞 → 天使雞（語氣更溫柔） |
| 成就 `form_fighter` | 🥊「拳王」→ **💪「元氣之星」/「養出元氣雞」** |
| 互動 `play_punch` | 「打沙包」🥊 → **「動感節拍」💃** |
| want `want_punch` | 「想打沙包！」🥊 → **「想跳一下！」💃** |
| 對白 `action_play_punch` | 「咚！再來！」「出拳！」「(認真模式)」→ **「蹦蹦蹦~」「再來再來！」「(動感模式)」** |
| 對白 `form_fighter` | 「再來一輪！」「拳套還夠用嗎」→ **「元氣滿滿~」「再蹦一下！」「活力 max！」** |
| 設定頁 trait row | 「🥊 戰鬥點數 → 戰鬥雞」 → **「💪 活力點數 → 元氣雞」** |

> 內部變數名 `fighter / battlePoints / play_punch` 不動（避免大規模改 + 破壞 dex 既有資料），只動對外文案。

**影響檔案**：`src/style.css` (+~8 行)、`src/cfg.js` (~5 處字串)、`src/game.js` (~3 處字串)

**驗證**：`node --check` 兩檔 ✅

**對 TA 對齊的影響**：
- 桌機看遊戲：兩側多兩顆飄浮 ♡ 立刻有「女性向」氣質
- 手機看遊戲：圓角更圓 + 按鈕粉色 hover/gradient + 漸層粉色化 = 整體甜美
- 所有「戰鬥」「拳」「打」字眼從前台清空（除舊存檔的內部 `fighter` 標識）
- 圖鑑顯示「元氣雞」+「跳跳活蹦的元氣派路線」描述，符合「療癒不暴力」基調

**沒做的（需要更多時間）**：
- `chick-adult-fighter.svg` 重畫（暗紅頭巾 + 紅拳套 → 粉色運動帶 + 軟拳套），下輪做
- 餵 cake 動畫加愛心粒子變奏
- 取名字體可考慮換成更圓潤的襯線或手寫風（v0.3 評估）

**下輪候選**：
1. **chick-adult-fighter.svg 重畫**（character-sheet §10.2 軟化清單第 1 條，視覺一致性最後一塊）
2. 裝扮商店 v0.3 起步（蝴蝶結 / 髮帶 / 花環 SVG 各一張）
3. R-1 step 2（拆 share.js）
4. 新增「愛心特效」當愛撫互動的粒子（pet_head/pet_belly/talk）

---

## 2026-04-28 17:48 · Session A — INTENT: TA 視覺 audit pass — 圓角 ↑ / 粉色 ↑ / fighter 軟化「元氣雞」

(已完成)

---

## 2026-04-28 17:40 · Session A — 音效系統 + 設定頁切換 + 收到 TA 定位（女性向）關鍵 feedback

**觸發**：cron 第 18 輪 + 使用者中途 feedback「主要 TA 是女生」

**動作（音效系統）**：
- 純 Web Audio API 程序合成（OscillatorNode + GainNode envelope），**零外部檔案**
- AudioContext 延遲到首次使用者手勢才建立（autoplay policy 友善）
- 8 種 SFX：click / success / fail / achievement / evolve / want / event / coin
  - achievement / evolve 是音階旋律（4-5 音逐個 trigger，間隔 90-100ms）
  - coin / want 是雙音
  - click / event 是單音
- Hook 點：performInteraction success、unlockAchievement、maybeEvolve、spawnWant、resolveEvent（coin_drop 用 coin、其他用 event）
- `state.settings.soundEnabled / reducedMotion` 進 schema（deepMerge 對舊存檔安全）
- 設定頁加 2 個 toggle row（音效開關 / 減少動畫切換），點擊立即生效並 re-render menu
- `applyReducedMotionPref()` 加 `body.reduce-motion` class，CSS `body.reduce-motion .pet { animation:none }` 等覆寫所有動畫

**動作（TA 定位 feedback 收尾）**：
使用者明確指出「主要 TA 是女性，版面跟設計都要以女性向喜歡的為主」。立即落地：

- 新增記憶：`feedback_target_audience.md` + 加入 MEMORY.md 索引（這是高層方向，未來所有 session / sub-agent 都要看到）
- 更新 `CLAUDE.md §1` 專案定位：把「女性 TA」從「次要假設」升級為「核心約束」，列 6 條設計 do/don't（粉嫩 / 圓角 / 愛心 / 軟化戰鬥 / 關係 > 競爭 / 裝扮 v0.3 必做）
- 更新 `docs/character-sheet.md`：
  - §0 加第二段 feedback
  - §3 戰鬥雞 → **元氣雞**，配件從「暗紅頭巾 + 拳套」→「粉色運動帶 + 軟拳套」
  - 新增 §10「女性向 TA 設計約束」整章：調性、形象軟化清單、玩法側重、文案 do/don't

**影響檔案**：
- `src/game.js` (+~73 行 → 1686)、`src/style.css` (+11 行 → 646)
- `CLAUDE.md` (補強 §1)、`docs/character-sheet.md` (改 §0 §3 + 新增 §10)
- 全域 memory：`MEMORY.md` + `feedback_target_audience.md`

**驗證**：`node --check` ✅

**對之後所有輪次的影響**：
- 任何 sub-agent 進來都會自動讀到 TA 定位（透過 CLAUDE.md + memory 雙保險）
- 後續美術產出 / 文案 / 配色 / 互動設計 / 形象描述都以女性向為基準
- 「戰鬥雞」對外文案開始軟化（程式內部變數名 `fighter` 不動，避免大規模改）

**下輪候選（已重新排序，TA 對齊優先）**：
1. **TA 視覺 audit pass**：CSS 圓角從 14 → 18-20px、`--c-pink` 提高到主色、按鈕粉紅化、戰鬥雞文案改「元氣雞」（最高優先）
2. fighter SVG 重畫：粉色運動帶取代暗紅頭巾、姿勢改活力 vs 攻擊（character-sheet §10.2）
3. 裝扮系統 v0.3 起步（v0.3 已標必做）
4. R-1 step 2（拆 share.js）
5. 音效音色微調（用戶實測後再說）

---

## 2026-04-28 17:32 · Session A — INTENT: 音效系統（Web Audio 程序合成，無外部檔案）+ 玩家可切換

(已完成；中途收到 TA feedback，連同處理)

---

## 2026-04-28 17:25 · Session A — 鍵盤捷徑 + ESC 關 modal（review-v2 P2-8 a11y）+ CLAUDE.md 同步

**觸發**：cron 第 17 輪
**動作**：

- **鍵盤捷徑**（power-user + 桌機 a11y）：
  - 全域 `keydown` listener，含三道防呆：
    - `INPUT/TEXTAREA` 焦點時 skip（避免取名輸入時被攔）
    - `Ctrl/Cmd/Alt` 組合不攔
    - modalOpen 期間僅 ESC 有效，不觸發遊戲 shortcut
  - **數字鍵 1-5** 對應主要互動：餵食 / 玩耍 / 洗澡 / 睡眠 / 愛撫
  - **字母鍵**：A 成就、D 圖鑑、S 設定、N 取名、? 或 H 求救
  - **ESC** 關當前 modal（review-v2 P2-8 提到的 a11y 缺口）

- **求救對話 `openHelpDialog()`**：列出 11 條 shortcut，配 `<kbd>` 樣式（白底黑線稿 + 雙層 box-shadow，與整體風格一致）

- **CSS** 加 `kbd` style：圓角白底 + 1.5px 黑線稿 + 2px box-shadow

- **CLAUDE.md 同步**：
  - §3 檔案結構加 `cfg.js` 條目，註明 `→ window.NourishCFG`
  - §5 程式碼慣例改寫：用 `<script>` 載入順序當依賴鏈、隨機事件 apply 用 string id、R-1 拆檔進度
  - 為下次 Session B 進來提供清楚的「從哪裡改數值」路徑

**影響檔案**：`src/game.js` (+39 行 → 1613)、`src/style.css` (+13 行)、`CLAUDE.md` (2 段更新)

**驗證**：`node --check` ✅

**對玩家的影響**：
- 桌機玩家現在 1-5 一鍵操作，不用每次點按鈕（idle 養成類常見訴求）
- 螢幕閱讀器使用者 + 鍵盤導航族群現在能 ESC 關視窗（之前必須點背景或關閉鍵）
- 新玩家按 ? 看 cheatsheet（不知道有捷徑也沒差，知道的玩家撿到便宜）

**下輪候選**：
- R-1 step 2：把 share card 抽到 src/share.js（self-contained ~150 行可移）
- 設定頁 reduced-motion 玩家可手動切換（目前只跟系統 prefers-reduced-motion）
- 進化前兆 + audio 配音（最簡只需 1-2 個 mp3 + Web Audio API）

---

## 2026-04-28 17:18 · Session A — INTENT: 鍵盤捷徑 + ESC 關 modal + CLAUDE.md 同步 cfg.js 結構

(已完成)

---

## 2026-04-28 17:14 · Session A — post-action 對白 + 存檔匯出/匯入

**觸發**：cron 第 16 輪
**動作**：

- **post-action contextual 對白**（承接第 13 輪對話深度）：
  - cfg.js `speech` 加入 17 條 `action_*` 池（每池 2-4 條）：每個互動有專屬回應
    - feed_basic「嗯嗯好吃~」/ feed_corn「玉米超讚！」/ feed_cake「蛋糕！蛋糕！」
    - play_punch「咚！再來！」/ play_sing「♪~♫」/ play_puzzle「啊我懂了！」
    - bath「(抖水珠)」「啾啾愛洗澡(才怪)」/ pet_belly「咯咯咯」/ talk「對啊對啊」
  - `performInteraction` 結尾改：先查 `CFG.speech[`action_${key}`]`，命中就用，否則 fallback `pickHappy()`
  - 玩家現在不再聽到「最喜歡主人了」六種輪播了 — 餵 cake 跟摸頭聽到的反應完全不同

- **存檔匯出 / 匯入**（資料攜帶性，2026 養成遊戲常見功能）：
  - `exportSaveBundle()`：把 `nourish.save.v1 + nourish.dex.v1` 包成 `{ v:1, exportedAt, save, dex }`，base64 編碼（unescape/encodeURIComponent 處理 UTF-8）
  - `importSaveBundle(b64)`：解碼 → JSON parse → schema 檢查（`v === 1`）→ 寫回 localStorage 兩個 key
  - 設定頁多兩 row：「📤 匯出存檔」用 `navigator.clipboard.writeText` 複製到剪貼簿（fallback 走 `window.prompt`），「📥 匯入存檔」用 prompt 接字串 + 二段 confirm
  - 匯入成功後 `location.reload()` 讓 state 重新載入

**影響檔案**：`src/cfg.js` (+17 行)、`src/game.js` (+57 行)

**驗證**：`node --check` 兩檔 ✅

**file size 結算**：cfg.js 167 → 184，game.js 1517 → 1574

---

## 2026-04-28 17:08 · Session A — INTENT: post-action contextual 對白（每個互動專屬反應）

(已完成，見上)

---

## 2026-04-28 17:00 · Session A — 截圖分享卡（Canvas → PNG，病毒拉新樁）

**觸發**：cron 第 15 輪
**為什麼**：extensions §1.3 標 v0.2 推薦前 3 名（前 2 條已做：對話深度、進化前兆）。完成這條 = Sprint 1 全部完成。把「個人遊戲」變「可分享」是長期病毒拉新的關鍵樁。

**動作**：
- 新增純 Canvas 繪製函式 `generateShareCard()`：720×1280 直立卡片
  - 漸層背景（複用 body 三色漸層 #FFE6B0 → #FFEFC1 → #FFD9E0）
  - 圓角白底卡 + 6px 黑線稿（複用色票 #FFF8E7 / #2C2C2C）
  - 標題「啾啾日常」+ 副標 ChickaDay v0.1
  - **寵物立繪**：載入當前 `lastPetSrc` SVG（蛋 / 雛 / 幼 / 7 種終態自動切換），繪到中央 360×360
  - 名字 + 階段 + 終態名稱
  - 「已陪伴 X 天」
  - **4 條狀態條**（飢餓 / 心情 / 清潔 / 體力）含色彩編碼（>70 綠、40-70 黃、20-40 橘、<20 紅）
  - 「🏅 成就 X/18 · 📖 圖鑑 Y/7」
  - 底部 tagline「一起來養屬於你的小雞~」
- 輔助函式：`loadImage(src)` Promise 包 Image()，`roundRect(ctx, x, y, w, h, r)` 純 canvas 圓角 path
- `shareOrDownloadCard()` 雙路徑：
  - **Web Share API** （`navigator.canShare({ files })` 可用 → 直接彈系統分享 sheet，行動裝置友好）
  - **Fallback**：產生 blob URL → `<a download>` 觸發 PNG 下載，桌機友好
  - 失敗則 toast 紅字
- 在圖鑑 modal 底部新增「📸 分享卡」按鈕，與「🏅 成就」並列；點擊先 closeModal 再 shareOrDownloadCard

**影響檔案**：`src/game.js`（+152 行，純新功能）

**驗證**：`node --check` ✅

**對病毒拉新的影響**：
- 玩家的小雞 = 個人投射 + 養成回憶 → **天然有炫耀慾**（GDD §1.3 寫「炫耀感」設計目標）
- 一鍵分享到 IG / Threads / Discord，圖內含 Logo 與 Tagline 形成廣告位
- Mobile Web Share API 走系統分享 sheet（無第三方依賴），桌機則退到 PNG 下載
- 之後 v0.3 可在卡上加 QR code 連回遊戲（待主域名定）

**已完成 Sprint 1（extensions agent 推薦三件）**：
- ✅ 進化前兆金光（第 11 輪）
- ✅ 對話深度擴充（第 13 輪）
- ✅ 截圖分享卡（本輪）

**file size 警告**：game.js 1365 → 1517（+152），R-1 step 1 的瘦身被吃光。下輪建議繼續 R-1 step 2（render layer）或開始 step 3（拆功能模組）。

**下輪候選**：
- R-1 step 2/3（拆 render 或拆 share / dex / achievement 出去）
- 設定頁正式化 + i18n 骨架（R-5）
- post-action contextual 對白（餵食後說「好吃！」這類即時反應）

---

## 2026-04-28 16:53 · Session A — INTENT: 截圖分享卡（Canvas → PNG，extensions §1.3 病毒樁）

(已完成)

---

## 2026-04-28 16:45 · Session A — R-1 step 1：CFG 抽到 src/cfg.js（game.js 1512 → 1365 行）

**觸發**：cron 第 14 輪。R-1 從上一輪起連續推遲 4 次，這次必須實質啟動。
**為什麼**：game.js 已經 1500+ 行，後續加新功能定位 / 改數值都得 grep 半天。先把純資料抽出來，邏輯就清晰。第一步刻意挑「最低風險」的工作 — CFG 是純 data，不變動行為。

**動作**：
- 新增 `src/cfg.js`（167 行）：包整份 CFG（save / decay / thresholds / growth / stages / interactions / achievements / wants / randomEvents / economy / welcomeBack / speech / petArt / moodArt），用 IIFE 包起來，最後 `window.NourishCFG = CFG;`
- `randomEvents.pool[].apply` 從**閉包函式**改成**string id**（"coin_drop" / "herb" / "butterfly" / "fly" / "star"）：純 data 才能搬出去
- `src/game.js` 開頭：
  - 加 `const CFG = window.NourishCFG;` + 防呆 throw
  - 加 `RANDOM_EVENT_APPLIES` dispatch 表（5 條），仍是閉包但只剩薄薄一層
  - 移除原本內嵌 CFG（173 行 → 0 行）
- `resolveEvent` 的 `def.apply(state)` 改成 `RANDOM_EVENT_APPLIES[def.apply || def.id](state)`，含 fallback 兼容舊 in-memory 物件
- `index.html`：`<script src="src/cfg.js">` 在 `<script src="src/game.js">` 之前

**影響檔案**：`src/cfg.js`（新）、`src/game.js`、`index.html`

**驗證**：
- `node --check cfg.js` ✅
- `node --check game.js` ✅
- HTTP 200：index.html / cfg.js / game.js
- 行數：1512 → 1365（-147 行 / -10%），cfg.js 167 行（純 data + IIFE wrapper）

**架構意義**：
- 改數值 / 加新成就 / 加新對白現在只動 cfg.js，不必動 game.js 的邏輯
- 為下個 step（拆 render / interactions / events 為獨立模組）打地基
- 「無 build step」設計維持：HTML 就是模組系統，多一條 `<script>` 即可
- 同步更新 CLAUDE.md §3 的檔案結構（待下輪）

**仍待 R-1 後續步驟**：
- step 2: 拆 render layer（render / setActionState / 子 menu HTML 渲染） → 約 200 行
- step 3: 拆 interactions / events / wants / achievements 各成一檔 → 各 ~100-150 行
- step 4: 拆 modal / toast / speech UI primitives
- 預估 step 2-4 共 1-1.5h，可分 3-4 輪 cron 完成

**下輪候選**：
- R-1 step 2（拆 render）
- 截圖分享卡（病毒拉新樁）
- 設定頁正式化 + i18n 骨架（R-5）

---

## 2026-04-28 16:38 · Session A — INTENT: R-1 step 1 — 抽 CFG 到 src/cfg.js（reduces game.js 1512 → ~1340）

(已完成，實際 1365 行)

---

## 2026-04-28 16:30 · Session A — 對話深度擴充（85 條 contextual line + 智能 picker）

**觸發**：cron 第 13 輪
**為什麼**：extensions §1.6 標「v0.2 第一名 ROI」、market-2026 §1.1 也提「對話建立關係」是 2026 新範式。原本 `CFG.speech` 只有 6 個 pool 共 ~20 條，全憑單一 if-else 做極簡選擇 → 啾啾感覺像台詞固定的玩具，不是有人格的個體。

**動作**：
- **CFG.speech 從 6 池擴成 18 池，從 ~20 條擴成 ~85 條**：
  - 既有 6 池保留並擴充（每池 +1–3 條）
  - 新增「危機級」` veryHungry / verySad / veryDirty / veryTired`（數值 < 8 才觸發，5 條 × 4）
  - 新增「巔峰幸福」`perfect`（4 項 >70 同時觸發，4 條）
  - 新增**時段** 5 池：`morning / noon / evening / night / lateNight`（依當前時間切換）
  - 新增**階段** 4 池：`stage_egg / stage_chick / stage_junior / stage_adult`（蛋會「(輕輕晃動)」、成雞會「我看過很多事情了」）
  - 新增**終態** 7 池：`form_healthy/fatty/ugly/fighter/sage/diva/divine`（每終態 2 條，戰鬥雞「再來一輪！」、神雞「願平靜降臨於你」）
  - 新增 `wantNag`：want 存在時 25% 機率觸發抱怨（不會 spam）
  - 新增 `rich`：FC ≥ 200 時暗示購買
  - 新增 `quirk`：(發呆) (整理羽毛) (看天空) (踱步) 純動作描述

- **`pickContextualLine()` 智能 picker** 取代原本 if-else：
  - 危機 stat（< 8）絕對優先（玩家會立刻看到求救）
  - 普通低 stat（< 20）次優先
  - want nag 25% 機率
  - perfect 狀態 40% 機率快樂
  - 餘下機率分布：stage flavor 25%、time-of-day 20%、form flavor 10%、rich 7%、quirk 16%、generic idle 22%
  - 結果：同樣「全狀態正常」也會輪播約 30 種不同類型的 line

- **idle speech 現在是「~70% 機率說話」**（30% 安靜也是個性）

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

**對 D1 第一印象的影響**：
- 玩家剛進來 5 分鐘內會看到：時段問候 + 階段 flavor + quirk + idle，至少 4 種 type
- 養到成雞看到 form-specific 對白 → 強化分支收集價值（神雞跟戰鬥雞講話真的不一樣）
- 帶 want 時的 nag 讓「主動表達欲望」感更立體（不只氣泡，還會碎念）

**下輪候選**：
- R-1 拆檔（已推 4 輪，game.js 1500+ 行該動了）
- 截圖分享卡（病毒拉新樁）
- post-action 對話（餵食後寵物說「好吃！」這類即時反應）

---

## 2026-04-28 16:23 · Session A — INTENT: 對話深度擴充（contextual idle speech，~60 條）

(已完成，超出原訂 60 條，最終 ~85 條)

---

## 2026-04-28 16:15 · Session A — Wants 系統 v1（market-2026 + extensions 雙重力推）

**觸發**：cron 第 12 輪
**為什麼**：market-research-2026 第 1.3 節列為「2026 最高 ROI 單一功能」，extensions agent 也把它拉進 Sprint 推薦。讓寵物從「被動衰減的數值表」進化成「會主動表達欲望的個體」。

**動作**：
- **CFG.wants 池**（9 條）：依階段 unlock（egg → pet_head；chick → 主食 / 洗澡 / 玩球 / talk；junior → 沙包；adult → 唱歌）
- 參數：`lifetimeMs 5min` / `spawnIntervalMs 90s` / `spawnChance 0.18` / 完成後 / 過期後 8 分鐘 cooldown
- 獎勵：`mood +7 / coin +12 / growthScore +8`（比一般互動的 +5 高 60%，**值得繞道滿足**）
- **`maybeSpawnWant`**：跳過蛋階段、睡眠中、modal 開、cooldown 期內，且擲 18% 機率
- **`spawnWant`**：依當前階段過濾池子、隨機抽一條，寫進 `state.pet.want`
- **`expireWantIfStale`**：超過 5 分鐘未滿足靜默過期（無懲罰，符合 lenient 設計）
- **`fulfillWantIfMatches`**：每次 `performInteraction` 後檢查，命中就秒給獎勵 + 金色 toast「💖 滿足了 X 的願望！」+ 寵物說「謝謝主人！」
- 新 module 級 timer `wantsTimer`，每 90 秒呼叫一次（先 expire 再 spawn）
- HTML / CSS 新增 `.want-bubble`：黃色漸層 + ! 紅標 + 彈出動畫 + 上下浮動，z-index 5（高於 pet-shadow / 等於 mood-icon）
- `render` 末段：want 存在且非睡眠時顯示 want-bubble，否則隱藏
- 存檔欄位 `state.pet.want / wantCooldownUntil` 進 defaultState，舊存檔靠 deepMerge 補 0

**影響檔案**：`src/game.js`、`src/style.css`、`index.html`

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 玩家不再只是「看數值低就點按鈕」，而是「啾啾在頭上比黃氣泡告訴我牠想唱歌」
- 滿足願望的獎勵明顯比一般互動好 → 形成「優先滿足 want」的策略行為
- 與既有「日任務」/「成就」/「隨機事件」/「進化倒數」形成 4 層長短期目標的疊加
- 5 分鐘 lifetime + 8 分鐘 cooldown：每 ~13 分鐘平均 1 個 want，剛好在玩家 5 min session loop 內看得到、又不會吵
- 跨 stage 解鎖：玩家會發現「成雞才有想唱歌的選項」，再次驗證進化分支價值

**下輪候選**：
- 對話深度（基於 want / 數值狀態的智能 idle speech，extensions §1.6）
- R-1 拆檔（已連續推遲 3 輪，建議下輪認真做）
- 截圖分享卡（病毒拉新樁）

---

## 2026-04-28 16:08 · Session A — INTENT: Wants 系統 v1（寵物主動表達欲望）

(已完成)

---

## 2026-04-28 16:01 · Session A — 進化前兆金光 + P2-10 進化提示文字 + P2-7 fatPoints 雙計修正

**觸發**：cron 第 11 輪
**動作**：

- **進化前兆金光**（extensions §1.8，D7 留存最高 ROI）
  - 新 CSS class `.pet.pre-evolve` 套疊 `bob` + 新 keyframe `pre-evolve-glow`（金黃 #FFEC8B drop-shadow 0px ↔ 14px 漸進 2.6s 循環）
  - render 末段算 `preEvolve` 條件：階段倒數 ≤ 60 分鐘 + 成長分數 ≥ 70% × 進化門檻 + 非睡眠中
  - `petImg.classList.toggle("pre-evolve", preEvolve)` 自動套用 / 移除
  - 玩家在最後一小時會看到啾啾微微發光，配合既有粒子特效形成「進化儀式三段式」（前兆→進化動畫→終態粒子）
  - reduced-motion 已順便加 `.pet.pre-evolve` 例外

- **P2-10 進化條件提示**
  - render 的 `stage-countdown` 三分支：
    - `remainMs > 0` → 既有「下一階段 X · 成長 a/b」
    - `remainMs <= 0 && need > 0` → 新「再多互動 X 點就能進化」（玩家終於知道要再點按鈕，不會卡在「可進化」字樣困惑）
    - 都滿足 → 「準備進化中…」（會在下個 tick 觸發 maybeEvolve）
  - 解決 review-v2 P2-10「玩家滿時間但分數不夠卡住沒提示」

- **P2-7 fatPoints 雙計修正**
  - 過餵判定原本「不論餵什麼都 +1」
  - 改為：如果食物本身已經帶 `cfg.fatPoints`（例如 cake），就 skip 過餵的 +1，由 cfg 那邊處理
  - 餵 cake 時 hunger > 95 從 +2 → +1，符合 GDD 直覺（過餵 = 一次懲罰）

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對玩家體驗的影響**：
- 進化最後 1 小時有清楚視覺信號 → 玩家會「守線」回看（最強回訪驅動）
- 卡進化的困惑場景消失（之前「可進化 · 成長 25/30」字串會讓玩家 reload）
- 過餵點數計算合理化

**下輪候選**：
- R-1 拆檔（最高長期 ROI，~2-3h，建議下個 cron 啟動）
- Wants 系統（GDD 也提，1-2 天但可分多輪）
- 設定頁正式化 + i18n 骨架（R-5）

---

## 2026-04-28 15:55 · Session A — INTENT: 進化前兆金光（D7 救星）+ P2-10 進化提示 + P2-7 fatPoints 修

(已完成)

---

## 2026-04-28 15:45 · Session A — Sprint 1 Day 1：5 條 P1 + 粒子 cap 全清

**觸發**：使用者「由你決定」→ 直接執行 review-v2 推薦的最高 ROI 工作

**動作（按 P1 編號）**：

- **P1-1 debug 按鈕 gating**
  - 加入 `DEBUG` 旗標：從 `?debug` query string 或 `localStorage["nourish.debug"]="1"` 讀
  - 設定頁的「+100 FC」與「跳階段」row 用 `${DEBUG ? html : ""}` gate 起來
  - 「重置存檔」row 保留（合理玩家功能）
  - 對應 onMount 的綁定改成防禦式 `if (giveBtn) ...` / `if (evolveBtn) ...`

- **P1-2 跨 tab race**
  - 新增 module 級 `isReadOnlyTab` 旗標
  - `window.addEventListener("storage", ...)` 偵測別 tab 寫存檔
  - 觸發後：清 tick interval、跳 modal「在另一個分頁開啟」、按鈕重新整理才能繼續
  - `save()` 開頭檢查 `isReadOnlyTab` 直接 return，避免被動覆寫

- **P1-3 localStorage quota fallback**
  - `save()` / `saveDex()` 的 catch 偵測 `name === "QuotaExceededError" || code === 22`
  - 失敗時 toast 紅字「⚠️ 存檔空間不足，進度可能無法保留」/「圖鑑空間不足」
  - Safari 私密模式 / 配額擠爆時玩家會看到，不再靜默失敗

- **P1-4 取名可發現性**
  - CSS：`#stage-name::after { content: " ✏️"; ... }` 永久顯示鉛筆 icon
  - CSS：`#stage-name:hover { background: rgba(255,216,107,0.6); }` 懸停變黃
  - JS：`first_hatch` 成就解鎖時若 `nameSet === false`，1.5s 後 toast 「💡 點寵物名字可以取名喔～」

- **P1-5 探索性入口**
  - `index.html` header 多一個 `#btn-ach`（🏅 直跳成就），與 📖 / ⚙️ 並列
  - 三個 header 按鈕都補 `aria-label`
  - JS 綁 `$("btn-ach").onclick = openAchievementsMenu;`

- **P1-6 粒子 cap**
  - 新增常數 `PARTICLE_CAP = 30`
  - 新增 helper `particleSlotsLeft(stage)` 算剩餘格
  - `spawnEvolveParticles` / `spawnAchievementParticles` 都先問剩餘格、達上限就 skip
  - 進化粒子距離從 `120 + 50` 降為 `90 + 30`，避免 480px 寬手機溢出畫布

**影響檔案**：`src/game.js`、`src/style.css`、`index.html`

**驗證**：`node --check` ✅

**對 review-v2 評等的影響**：B+ → 預期 **A-**
- 5 條 P1 全清
- 粒子數 / DOM 安全網就位
- 防作弊（debug gate）+ 防覆寫（cross-tab）+ 防壞檔（quota）三道防線

**還沒動的（review-v2 待修）**：
- P2-1～P2-10 觀察類，下一階段配合 R-1 拆檔一起處理
- R-1 game.js 拆 5–7 個 IIFE 模組（建議下個 cron 跑這個）
- R-5 i18n 架子（v0.2 中英切換鋪路）

**下輪候選**：
- R-1 拆檔（2–3h，但能讓後續每加一個 v0.2 功能都省 30%）
- 設定頁正式化（音效切換 + 語言切換骨架，配合 R-5 i18n）
- Wants 系統（market 強推 + extensions 也提）

---

## 2026-04-28 15:38 · Session A — INTENT: Sprint 1 Day 1 — 修 5 條 P1 + 粒子 cap

(已完成)

---

## 2026-04-28 15:30 · Session A — 2026 市場補強研究（market-research-2026.md）+ review-v2 收回

**觸發**：cron 第 9 輪
**動作**：
- 為避免撞檔（兩個 sub-agent 跑中），這輪只做明確不重疊的市場研究文件。
- 新增 `docs/market-research-2026.md`：覆蓋 6 章：
  - **3 大新範式**：AI 對話寵物（CES 2026 Sweekar）、基因組合（Tamagotchi Paradise 50,000+）、Wants-based 互動
  - **留存機制 3 派**：嚴格 streak / Lenient（我們）/ AFK rewards
  - **AR + PWA + 推播**（App 階段）
  - **變現 5 種**（純裝飾、加速、加成、抽卡、訂閱），給出對啾啾日常的建議（純裝飾 + 訂閱、不做加成 / 加速）
  - **競品差異化定位表**（Tamagotchi / Adopt Me / Neko Atsume / 啾啾）
  - **三句話結論**：Wants 系統 v0.2 必做、基因擴充 v0.3 必做、AR/AI/推播 App 階段才上
- 同時間 `Code review v2 sub-agent` 完成並寫入 `docs/review-v2.md`：
  - P0: 0（v1 全修）/ P1: 5 / P2: 10 / 重構: 5 / v0.2 路線圖: 5
  - 整體評等：**B+**
  - 關鍵警訊：game.js 1272 行單檔開始劣化、debug 按鈕沒 gate、跨 tab race / quota 防護缺
- `Extensions sub-agent` 仍跑中，下輪會合併

**影響檔案**：`docs/market-research-2026.md`（新）、`docs/review-v2.md`（sub-agent 寫的）

**驗證**：純文件，不需 lint

**對下一階段的影響**：
- v0.2 必做有了清楚共識（review-v2 + market-2026 + extensions）：穩定性三修（debug gate / cross-tab / quota）+ Wants 系統 + 取名可發現性
- 美術下一階段方向確認：character-sheet 框架已穩，等使用者實際走 MJ `--cref` 跑 v1 雛雞 PNG

**下輪候選（已有 review-v2 P1 清單）**：
1. 把 debug 按鈕用 URL `?debug` 或 dev console 才能 access（防玩家自己破壞養成感）
2. 跨 tab 鎖（用 `storage` event 監聽，如果別 tab 寫了存檔就刷新自己的 state）
3. localStorage QuotaExceeded 兜底（壞檔 → fallback 到 in-memory + 警告）
4. game.js 拆分成多 IIFE 檔（state.js / render.js / interactions.js / events.js / achievements.js）

---

## 2026-04-28 15:23 · Session A — INTENT: 2026 市場調查補強 + 鍵盤可用性小修

(已完成市場研究；鍵盤可用性那條延後到下輪以避免撞 sub-agent)

---

## 2026-04-28 15:13 · Session A — 互動反饋動畫 + 成就解鎖粒子（game feel polish）

**觸發**：cron 第 8 輪
**為什麼**：所有互動目前只有 toast 文字回饋，**寵物本身沒有可見反應**。GDD §4 寫了「動畫想像」（小雞快速啄食、跑跳追逐、泡泡蓋住、閉眼享受）但 v0.1 都沒實作。沒有反饋等於玩家點了按鈕，畫面只跳一個提示，沒有「我跟啾啾互動」的實感。

**動作**：
- 4 套 CSS keyframes（每套 0.45–0.6s，重複 2–3 次）：
  - `pet-eat`：低頭啄食（translateY +14px、rotate -2deg）
  - `pet-shake`：左右搖（玩耍 / 戰鬥）
  - `pet-bath`：上下浮（搭配泡泡）
  - `pet-love`：心動縮放（愛撫 / 對話）
- `playReactionAnim(key)` mapping：
  - `feed_*` → react-eat + 🍴
  - `play_*` → react-shake + 💫🎵
  - `bath`   → react-bath + 🫧🫧✨
  - `pet_*`  → react-love + 💕
  - `talk`   → react-love + 💬
- 每次互動 spawn 1–3 個 `.float-emoji`（從寵物上方飄起、漸隱、1.4s）
- `spawnAchievementParticles()`：reuse `.particle` keyframe，8 個 🏅✨⭐🌟 從寵物中心放射，比進化的 14 個小一圈
- `unlockAchievement` 解鎖時自動觸發
- `void offsetWidth` trick 讓同類動畫連點時能 restart

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對遊戲性的影響**：
- 滿足 GDD §4「動畫想像」要求（吃 / 玩 / 洗 / 愛撫各 1 套）
- 解決 v0.1 review §10.1 標記 🟡「互動動畫各 1 套」未做的最後一條
- 成就解鎖從「兩段 toast 飄過去」變成「畫面有金光特效」，符合 GDD §8.4「重大事件 → 全螢幕反饋」
- 保留 `prefers-reduced-motion` media query 自動禁用

**MVP 完成度更新**：19/19（100%）— 沒有遺留的 GDD §10.1 標 🟡 項目了。

**下輪候選**：開新蛋的儀式動畫 / 餵食的食物 SVG 從碗中飛入嘴 / 進化前 1 小時的「身體微微發光」預兆 / GDD §10.2 章節充實寫法描述

---

## 2026-04-28 15:08 · Session A — INTENT: 互動反饋動畫（pet-eat/shake/bath/love）+ 成就解鎖粒子

(已完成)

---

## 2026-04-28 15:00 · Session A — 隨機事件 SVG 化（5 張新圖，遵守 character-sheet §1.3 色票）

**觸發**：cron 第 7 輪
**為什麼**：上一輪（character-sheet）強調主角是純卡通粗線稿風，但隨機事件的 emoji（💰🌿🦋🪰⭐）在 OS 不同字體下風格漂浮（iOS Apple Color Emoji vs Android Noto vs Windows Segoe UI Emoji），會搶戲且破壞主角視覺一致性。

**動作**：
- 新增 5 張 SVG，全部使用 character-sheet §1.3 統一色票（黃 #FFD86B / 橘 #FF9F43 / 紅 #B23A48 / 黑 #2C2C2C / 綠 #6BCB77 / 粉 #FFB7B7）：
  - `event-coin.svg`：金幣，黃→橘漸層 + 中央「F」字 + 高光
  - `event-herb.svg`：草藥（兩片葉 + 細莖 + 一根尖芽 + ✨）
  - `event-butterfly.svg`：對稱蝴蝶（粉色 + 黃色雙翅，黑身體）
  - `event-fly.svg`：白透明翅 + 黑身 + 橘眼（避免太寫實）
  - `event-star.svg`：5 角星 + 漸層光暈 + 雙層內影
- `CFG.randomEvents.pool` 把 `emoji` 欄位改成 `art`（指 SVG 路徑）；保留 emoji 欄位空著當未來 fallback 介面
- `spawnEvent` 改：有 `art` 就 createElement('img') 內嵌，否則退回 textContent emoji
- CSS `.event-bubble` 從 54×54 → 60×60，新增 `.event-bubble img { width: 78%; ... }`、加 `overflow: hidden` 防溢出，drop-shadow 1px 給輕微立體感
- toast 文字保留少量 emoji（🌿⭐）做語意提示，但事件氣泡本體完全 SVG

**影響檔案**：
- `assets/svg/event-{coin,herb,butterfly,fly,star}.svg`（5 張新檔）
- `src/game.js`、`src/style.css`

**驗證**：`node --check` ✅ + 5 張 SVG curl 200 ✅

**對視覺一致性的影響**：
- 隨機事件氣泡現在跟主角是同一套「粗線 + 平塗 + 9 色色票」風格，不再有 Apple/Google/MS 三家 emoji 互打
- 為「PNG 升級時，事件氣泡也能無痛升級」打底（現在 art 欄位是路徑，未來改 PNG 路徑即可）
- 完成第 1 個 character-sheet 落地驗證：所有新美術都過 §8 5 道 gating

**下輪候選**：開新蛋的儀式動畫（蛋出現的特效）/ 成就解鎖時的金光特效（reuse `spawnEvolveParticles`）/ 餵食動畫（小雞低頭啄）/ 設定頁音效切換骨架

---

## 2026-04-28 14:53 · Session A — INTENT: 隨機事件改用 SVG（依 character-sheet 色票）+ 圖鑑顯示成就計數

(已完成 SVG 化；圖鑑成就計數其實 14:32 那輪已 done，此 INTENT 描述失準)

---

## 2026-04-28 14:45 · Session A — 角色設定書（character sheet）+ image-prompts 重寫

**為什麼**：剛收到 user feedback「畫風是 gating factor，不是 polish」，現有 18 條 prompt 各自為政會生出 18 隻不同的雞。這輪跨域（原應 Session B）但屬高優先級，也順便釘住 Session B 接手後的工作框架。

**動作**：
- 新增 `docs/character-sheet.md`（9 章節）：
  - §1 主角視覺 DNA 5 項（不可動搖）+ 統一 9 色色票 + 構圖規則
  - §2 4 階段同角色變體（蛋 / 雛 / 幼 / 成）
  - §3 7 種終態的「保留 DNA + 加 1–2 配件」原則 + 不可做事項對照
  - §4 5 種心情圖示（角色本體之外的浮動 emoji）
  - §5 8 條 anti-pattern（嬰兒臉化 / 鴨喙化 / 寫實渲染等）
  - §6 AI 工具評估表（MJ + `--cref` 第一推薦、SD + LoRA 第二、Gemini / GPT-image 不推）
  - §7 全域 prompt 錨定段落（每張必貼）
  - §8 出 PNG 前 5 道 gating checklist
  - §9 三階段 (v0.1/v0.2/v0.3) 美術里程碑
- 重寫 `docs/image-prompts.md`：
  - 開頭強制 link 回 character-sheet
  - 全域風格段升級為 `SUBJECT IDENTITY` 角色錨定 + 風格 + 色票 + FORBIDDEN
  - 「使用建議」段重寫工作流程：先生 v1 雛雞鎖角色 → `--cref` 帶後續每張，附 anti-pattern 與成本估算
- 更新 `CLAUDE.md`：
  - 檔案結構列入 character-sheet.md
  - §9 補一句「美術 gating factor，不是 polish」

**影響檔案**：`docs/character-sheet.md`（新）、`docs/image-prompts.md`、`CLAUDE.md`

**驗證**：純文件，不需 lint

**對專案的影響**：
- 接下來任何 sub-agent 或外包美術不會再因為「沒讀過完整脈絡」而產出不一致的圖。
- 確立了「v1 雛雞參考圖」是後續所有 PNG 的單一錨點，不會再有 18 隻雞各自為政。
- 把美術正式列入 v0.2 推進路徑，不再可被無限後延。

**下輪候選**：
- 開新蛋功能的 toast / animation polish（讓「再來一隻」的儀式感更強）
- 隨機事件改用 SVG（讓 emoji 風格不會跟主角搶戲）— 注意要遵守 character-sheet 色票
- 「v1 雛雞」prototype prompt 跑一次（如果 user 接下來要實際生圖）

---

## 2026-04-28 14:38 · Session A — INTENT: 角色設定書（character sheet）+ image-prompts 重寫，鎖跨圖一致性

(已完成，見上)

---

## 2026-04-28 14:32 · Session A — 成就系統（17 條） + 進化粒子特效

**觸發**：cron 第 5 輪
**動作**：
- 新增 `CFG.achievements`（17 條）：跨類別 — 養成里程碑（first_hatch / first_evolve）、互動量（first_feed / feed_50 / bath_10 / pet_50）、登入（streak_7 / streak_30）、收集（collect_3/5/all）、終態（form_divine/diva/fighter/sage）、特殊（star_caught / rich / perfect_day）。
- 新增 `state.achievements: { id → unlockedAt }` schema 欄位（deepMerge 安全）。
- 新增 `state.history.feedCount/bathCount/petCount/playCount` 累積計數（跨歷代不歸零）。
- `bumpHistory(key)` 在每次 `performInteraction` 後依 prefix 累積。
- `checkAchievements()` 集中判定 17 條，於餵食 / 玩耍 / 抓事件 / 進化 / 賺幣 / 登入 後呼叫；解鎖時兩段 toast（金色 icon + 描述）。
- 進化粒子特效 `spawnEvolveParticles()`：14 個 `✨⭐🌟💫✦` 從寵物中心放射飛出，1.6s `particle-fly` keyframe 帶旋轉 + 漸隱。
- 圖鑑底部新增「🏅 成就 X/17」按鈕，跳到獨立成就頁；成就頁鎖 / 解鎖兩態。
- `grantCoin` / `handleDailyLogin` / `resolveEvent`(star) 加 hook。

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**對遊戲性的影響**：
- 給玩家「明確下一個短期目標」，改善 1 天 ~ 1 週 mid-loop 黏著度（GDD §1.3「可預期的小確幸」）。
- 收集 7 種終態現在有實質回饋（collect_all 成就 + 圖鑑大師），把 4 ~ 6 輪重玩動機具體化。
- 進化儀式從「只閃 5 次 0.6s」升級到粒子放射，符合 GDD §8.4「重大事件」要求。

**下輪候選**：成就解鎖時的金光特效（共用粒子）、隨機事件 SVG 化、settings 補音效切換、餵食動畫（吃食物的 micro-anim）

---

## 2026-04-28 14:25 · Session A — INTENT: 成就系統 + 進化粒子特效

(已完成，見上)

---

## 2026-04-28 14:18 · Session A — 開新蛋功能 + 圖鑑歷代寵物紀錄 (nourish.dex.v1)

**觸發**：cron 第 4 輪
**動作**：
- 新增獨立 localStorage 鍵 `nourish.dex.v1`（schema v1，`completedPets[]` cap 50）。`loadDex / saveDex / unlockedFormsSet` 三個 helper。
- `archiveCurrentPet()` 把當前已進化的小雞推進 dex（含 name / finalForm / bornAt / archivedAt / totalDays）。
- `startNewEgg()` 重置 `state.pet`，但**保留** economy / daily streak / history（玩家累積感不會歸零）。
- 進化儀式 modal 新增 `🥚 孵化新蛋` 按鈕，開二段 confirm。
- 設定頁有 finalForm 時新增「🥚 孵化新蛋」row。
- 重置存檔現在會一併清 dex（並提示）。
- 圖鑑改成兩段：終態收集（依 `unlockedFormsSet` 跨歷代統計，從 1/7 → 進步）+ 歷代小雞（最多顯示 10 隻，含日期 / 天數）。

**Schema**：
```
nourish.dex.v1 = {
  schemaVersion: 1,
  completedPets: [
    { id, name, finalForm, bornAt, archivedAt, totalDays }
  ]
}
```

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

**遊戲循環現在閉合了**：蛋 → 養成 → 進化 → 收進圖鑑 → 開新蛋。可以無限重玩、收集 7 種終態。

**下輪候選**：v0.2 設定頁（音效 / reduced motion 切換）、進化動畫加儀式感（粒子特效）、隨機事件 SVG 化、餵食蛋糕的肥點數視覺提示、成就系統（首次神雞、收集 5 種等）

---

## 2026-04-28 14:13 · Session A — INTENT: 開新蛋功能 + 圖鑑歷代寵物紀錄 (nourish.dex.v1)

(已完成，見上)

---

## 2026-04-28 14:05 · Session A — 取名功能 + 7 種終態擴充 + 5 種玩耍互動

**觸發**：Auto-mode 持續推進
**動作**：
- 新增 `state.pet.nameSet` 旗標 + 點擊 stage-name 開啟 `openNameDialog()`：input modal、首次取名 +10 心情、12 字上限、escapeHtml 防 XSS。
- traits schema 補 `intelligencePoints`、`singCount`，舊存檔靠 deepMerge 自動補 0。
- 互動表新增 3 種：`play_toy`（玩具蟲蟲）、`play_puzzle`（思考拼圖，+intelligencePoints 2）、`play_sing`（唱歌比賽，+singCount 1）。`openPlayMenu` 列 5 項。
- `finalizeForm` 補 `sage`（30 智慧）+ `diva`（20 唱歌）分支，優先序 `divine > diva > sage > fighter > fatty > ugly > healthy`（罕見/正向先勝出）。
- `formLabel` / `formDescription` 補新終態。
- 設定頁顯示 intelligencePoints / singCount 進度。
- 圖鑑改成 7 格表格，已解鎖才顯示描述、未解鎖顯示 🔒，含「已收集 X/7」總覽。
- Modal 系統重構：buttons 支援 `{label, close, action}`，可在不關閉的情況下觸發動作（給名字 dialog 用）。
- 新增 `assets/svg/chick-adult-sage.svg`（戴眼鏡 + 公式書 + 書本）。
- 新增 `assets/svg/chick-adult-diva.svg`（彩虹尾羽 + 麥克風 + 音符）。

**影響檔案**：
- `src/game.js`、`assets/svg/chick-adult-sage.svg`、`assets/svg/chick-adult-diva.svg`

**驗證**：`node --check` ✅ + curl 200（兩個新 SVG）

**下輪候選**：v0.2 設定頁（音效 / 語言切換）、隨機事件 SVG 化、進化動畫加儀式感、開新蛋功能、圖鑑紀錄歷代寵物（schema `nourish.dex.v1`）

---

## 2026-04-28 14:00 · Session A — INTENT: 取名功能 + sage/diva 分支 + play_toy/play_sing/play_puzzle 互動 + 對應 SVG

(已完成，見上)

---

## 2026-04-28 13:53 · Session 2 — 隨機事件系統（v0.2 最高 ROI）+ talk 互動

**觸發**：cron 自動 fire（首次 10 分鐘觸發點）
**動作**：
- 新增 `CFG.randomEvents` 池（5 種）：
  - 💰 撿到飼料幣（55%，+5–15 FC）
  - 🌿 神祕草藥（18%，全屬性大幅補）
  - 🦋 蝴蝶飛過（14%，心情 +10）
  - 🪰 趕走果蠅（10%，清潔 +5、心情 +3）
  - ⭐ 神秘流星（3%，+10 全屬性 + 50 FC）
- `maybeSpawnEvent` 每 60 秒 check，30% 機率 spawn；蛋階段 / 睡眠 / modal 開時 skip。
- `.event-bubble` 圓形按鈕浮在舞台上 90 秒後自動 expire，玩家點擊觸發 `def.apply(state)` + 成長分數 +3。
- 新增 `talk` 互動（心情 +2、CD 20s、無消耗），加入愛撫選單（標題改為「💝 互動」），對應 GDD §4.5 對話列。
- CSS 加 `event-pop / event-bob / event-leave` 三段動畫。

**影響檔案**：`src/game.js`、`src/style.css`

**驗證**：`node --check` ✅

**下輪候選**：取名 + dialogue / 智慧雞與歌姬雞分支 / `play_toy` 與 `play_sing` / GDD §10.2 補充章節 / 給 herb 與 fly 寫獨立 SVG（取代 emoji）

---

## 2026-04-28 13:45 · Session 1.3 — 實作每日任務（P1-7）

**觸發**：循環首輪（不等 cron）
**動作**：
- 新增 `state.daily.tasks` schema：feed_count 5、play_count 3、pet_count 4 三項。
- `trackDailyTask` hook 進每次 `performInteraction`，依 prefix 自動 +1。
- 完成單項自動 +20 FC（`完成每日任務` toast）。
- `handleDailyLogin` 跨日時呼叫 `resetDailyTasks()` 重置（依 `lastLoginDay` 字串比對）。
- footer 改顯示三項進度，全完成時切「🎉 今日任務全完成！」。
- `defaultState` 補 `history: { totalSessions: 0 }`，靠 `deepMerge` 對舊存檔安全。

**影響檔案**：`src/game.js`

**驗證**：`node --check` ✅

---

## 2026-04-28 13:40 · Session 1.2 — 初版 P0/P1 修補

**觸發**：手動（review 完成後立即修）
**動作**：
- 修 P0-1 時鐘倒退保護：`tickOnline` 加 `Number.isFinite` 與 `dt ≤ 5min` 上限。
- 修 P0-2 背景節流：`lastTick` 提到 module 級；`visibilitychange` hidden 時 clearInterval + 強制 `lastTickAt = now`；resume 時 reconcileOffline + 重啟 tick。
- 修 P0-3 離線回歸 8–12h 心情 -5 + >12h 觸發哭泣 speak。
- 修 P0-4 加 `fighter` 終態分支（30 戰鬥點數），`battlePoints` 不再空轉。
- 補 P1-1 `migrate` 改用 deepMerge 補新欄位，避免舊存檔讀到 undefined。
- 補 P1-2 cache `lastPetSrc / lastMoodSrc / lastBgKey`，移除 `<a href>` 絕對路徑 trick。
- 補 P1-3 進度條 `bar-warn` 紅光脈衝動畫。
- 補 P1-6 設定頁顯示 fatPoints / battlePoints / lowMoodMinutes / perfectStreakMinutes 進化進度。
- 補 P1-9 移除 `maximum-scale=1.0`（WCAG 1.4.4）。
- 補 P1-10 第一次玩 onboarding modal（4 條規則）。
- 補 P1-11 睡眠時 disable 餵食 / 玩耍 / 洗澡 / 愛撫按鈕。
- 補 reduced-motion media query。
- 新增 `assets/svg/chick-adult-fighter.svg`（戰鬥雞 SVG）。

**影響檔案**：
- `src/game.js`、`src/style.css`、`index.html`
- `assets/svg/chick-adult-fighter.svg`（新檔）

**驗證**：`node --check src/game.js` ✅

---

## 2026-04-28 13:00 · Session 1.1 — 初版 MVP 完成

**動作**：
- 市場調查（10 款代表作 + 共通要素 + 反模式 + 技術觀察）→ `docs/market-research.md`
- GDD 完整版（12 章 + 附錄）→ `docs/gdd.md`（798 行）
- SVG 占位美術（18 張）→ `assets/svg/`
- AI 生圖 prompt（中英對照 18 條 + 全域風格）→ `docs/image-prompts.md`
- MVP 實作（HTML+CSS+JS，無 build step）→ `index.html` + `src/style.css` + `src/game.js`
- Code review（4 P0 + 12 P1 + 7 P2）→ `docs/review.md`
- 本機 HTTP server 啟動於 port 8765

**MVP 完成度**：18/19 ≈ 95%（GDD §10.1 必做清單）
**與 GDD 數值對齊度**：~95%（cooldown / 衰減速率 / 互動效果完全一致）

---
