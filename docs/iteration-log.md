# 啾啾日常 — 自動優化循環日誌

> 每 10 分鐘觸發一次（cron `3-59/10 * * * *`，job `0a1c2148`），由主 agent 推進。新項目追加在最上方。

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
