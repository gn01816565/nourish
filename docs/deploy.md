# 部署 ChickaDay

> 目標：把 `gn01816465/nourish` repo 變成 https://gn01816465.github.io/nourish/ 任何人可玩。
> 因為**沒有 build step**、純靜態檔案，任何能 host static files 的服務都能跑。
> 推薦 GitHub Pages（免費、HTTPS、與 repo 整合）。

---

## 1. GitHub Pages 一鍵部署（推薦）

### 啟用流程（一次性）

1. 開 `https://github.com/gn01816465/nourish/settings/pages`
2. **Source** → 選 `Deploy from a branch`
3. **Branch** → `main` / `/ (root)` → **Save**
4. 等 1-2 分鐘
5. 頁面上方會出現 `Your site is live at https://gn01816465.github.io/nourish/`
6. 開那個網址 → 啾啾日常上線 ✓

### 之後每次更新（增量部署）

```bash
git add .
git commit -m "feat: <你做了什麼>"
git push origin main
# GitHub Pages 約 1-3 分鐘後自動上 build
```

無 CI / CD 設定、無 build action、無 deploy script — 純靜態 push 就生效。

---

## 2. 部署前 checklist

每次 push 前過一次：

- [ ] **`./scripts/run-checks.sh` 全綠**（一鍵跑 7 檔 `node --check` + sw.js + 2 個 lint，set -e fail-fast）
- [ ] 本機 `python3 -m http.server 8765` 跑得起來，至少看一遍 onboarding modal
- [ ] **bump `sw.js` 的 `CACHE_VERSION` 字串**（每次 ship 都加日期或版本號），避免老 cache 卡住玩家
- [ ] iteration-log.md 有記這輪做了什麼（雙 session 接力依此判斷）
- [ ] commit 訊息有意義（不要 `update` `fix`）

> 個別檢查（`run-checks.sh` 抓到問題時可單獨跑除錯）：
> - `node --check src/cfg.js src/ui.js src/dex.js src/achievements.js src/audio.js src/share.js src/game.js`
> - `node scripts/check-sw-shell.js`（iter#66 教訓：防 SW APP_SHELL 漂移）
> - `node scripts/check-assets.js`（驗證 60+ 個 assets/ 路徑檔案實存）
> - `node scripts/check-cfg-schema.js`（驗 cfg.js 內部 cross-ref + 13 條數值 invariant）
> - `node scripts/check-render-smoke.js`（iter#98 教訓：vm sandbox + 最小 DOM stub 跑 init/render 一次抓 runtime error，補 lint 全靜態的盲區）
>
> 資訊型工具（不入 deploy gate）：
> - `node scripts/locale-coverage.js`（iter#113 i18n 進度報表：總 / 已替換 / 各檔剩餘 CJK 數）

---

## 3. 重要：Service Worker cache-busting

`sw.js` 第一行：

```js
const CACHE_VERSION = "chickaday-v1-2026-04-28";
```

**每次部署都改這字串**（YYYY-MM-DD 結尾即可）。SW 偵測到 `CACHE_VERSION` 變更會：
1. activate 階段刪除所有舊 cache
2. install 階段重新預快取 APP_SHELL
3. 玩家下次開遊戲（或 reload）會看到新版本

如果忘記改，會發生：
- 玩家裝過的 PWA 永遠卡在舊版
- 你 push 了新 cfg / 新邏輯，玩家看不到
- 客訴「為什麼新功能我沒有」

---

## 4. HTTPS 必要性

下面這些功能**只在 HTTPS（或 localhost）下能用**：

| 功能 | 為什麼 |
|------|------|
| Service Worker | 安全要求 |
| PWA install (A2HS) | 必須有 SW |
| Notifications | Permissions API |
| Web Share API（分享卡）| API 規範 |
| Clipboard API（匯出存檔）| 寫權限 |

GitHub Pages 預設 HTTPS，無需設定。如果用 IP 部署或 http://example.com 就會大量功能失效，**不建議**。

---

## 5. 替代方案（也都可行）

### Cloudflare Pages（免費、邊緣 CDN）
1. cloudflare.com → Pages → Connect to Git
2. 選 `gn01816465/nourish`
3. Build command 留空、Output directory 留空
4. Save → 拿到 `https://nourish.pages.dev` 之類網址

### Netlify Drop（拖檔上傳，最快）
1. netlify.com/drop
2. 拖 repo 整個資料夾上去
3. 立即拿到 `random-name.netlify.app`
4. 之後改檔案再拖一次（沒 git 整合）

### Vercel（git 整合）
1. vercel.com → New Project → 選 repo
2. Framework preset 選 `Other`
3. Build command 留空
4. Deploy

### 自己主機（VPS / nginx）
```nginx
server {
  server_name nourish.example.com;
  root /var/www/nourish;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```
配 Let's Encrypt 拿 HTTPS。

---

## 6. 部署後驗證

開部署後的 URL，過一遍：

- [ ] index.html 加載完整（看到啾啾標題）
- [ ] DevTools Network 看 8 個 .js 都 200（cfg / i18n / ui / dex / achievements / audio / share / game）
- [ ] DevTools Application → Service Workers 看 sw.js registered + activated
- [ ] DevTools Application → Manifest 看 PWA manifest 解析正確（icons 全綠）
- [ ] **Lighthouse PWA audit ≥ 90**（DevTools → Lighthouse → Mode: Navigation / Categories: PWA + Performance + SEO + Best Practices + Accessibility / Device: Mobile）— iter#118 GSC 2026 升級為 AI 解讀 dashboard，PWA 分數低 = 玩家搜不到
- [ ] 點摸頭觸發 SFX → 聽得到（Web Audio）
- [ ] 設定頁開「啾啾呼叫」→ 跳出 permission prompt
- [ ] 圖鑑 → 分享卡 → toast「卡片已下載」（桌機）or 系統分享 sheet（手機）
- [ ] 手機 Chrome：應該跳「安裝啾啾日常」橫幅（首次造訪後 30 秒-2 分內）
- [ ] iOS Safari：分享 → 加到主畫面 → 開出獨立 app 全螢幕

---

## 7. 自訂網域（可選）

如果有自己的網域（例如 `chickaday.app`）：

1. DNS 設定：`CNAME` 指向 `gn01816465.github.io`（或 `A` 指 GitHub Pages 4 個 IP）
2. repo Settings → Pages → Custom domain → 填網域 → Save
3. 勾「Enforce HTTPS」（等 cert 簽完，~10 分鐘）
4. 把 `manifest.json` 的 `start_url`、SW 的 cache 路徑檢查一下
5. 把 README 的 demo URL 改成新網域

---

## 8. 常見問題

### Q：玩家說「我裝了 PWA 但沒新功能」
A：你忘了 bump `CACHE_VERSION`。改一個字符 push 一次。

### Q：Notifications 不出現
A：背景分頁 OK，但**完全關 tab 不行**（無 backend Web Push 限制）。寫進 §限制 對玩家誠實。

### Q：iOS PWA 推播沒反應
A：iOS 16.4+ 才支援，且**必須先「加到主畫面」才會收推播**。在 Safari tab 內無效。

### Q：分享卡在 iOS Safari 下載不了
A：iOS Safari 不支援 `<a download>`，會直接打開圖片。玩家可長按存圖。已是平台限制無解。

### Q：localStorage 滿了
A：dex cap 50 + 主存檔約 5KB，正常 localStorage 5MB 額度遠夠。Safari 私密模式 quota = 0 → 已 toast 「⚠️ 存檔空間不足」（iter#sprint-1）。

---

## 9. 監控（v1.0+ 階段做）

部署初期不需要，但有 1000+ 玩家後可考慮：

- [ ] Plausible / Umami（隱私友善 analytics）
- [ ] Sentry（JS 錯誤收集）
- [ ] Web Vitals（LCP / FID / CLS 監控）

目前完全是 client-only / no telemetry，**對隱私敏感的玩家是賣點之一**，不要急著加。

---

## 10. roll-back

如果 push 了壞檔，玩家沒辦法用：

```bash
git revert HEAD       # 反向產生新 commit
git push origin main  # 重新部署
# 等 1-3 分鐘，old version 復活
```

或用 `git reset --hard <good-commit> && git push -f`（更暴力，destructive）。

PWA 玩家還會吃到 SW cache，請務必同時 bump `CACHE_VERSION` 字串否則 revert 不會生效。

---

## 11. Search Console / Bing Webmaster 提交流程

部署完並驗證 §6 都過後，**送搜尋引擎收錄**才能讓玩家搜得到。  
SEO 三件套（meta tags / canonical+JSON-LD / robots.txt+sitemap.xml）已在 iter#59/64/65 鋪好，這裡只是把它們送出去。

### Google Search Console（首要）

1. 開 https://search.google.com/search-console/welcome
2. 加 property → 選 **「網址前置」（URL prefix）** → 填 `https://gn01816465.github.io/nourish/`
3. 驗證所有權 → 推薦用 **HTML 標籤法**：
   - 複製 `<meta name="google-site-verification" content="...">`
   - 貼到 `index.html` `<head>` 區（緊跟 og: meta 之後）
   - push 部署 → 等 1-2 分鐘 → 回 GSC 按「驗證」
4. 驗證成功後左欄 → **「Sitemap」** → 填 `sitemap.xml`（相對路徑）→ 提交
5. 等 24-48 小時，Google 會開始爬 → 「索引 → 涵蓋範圍」會看到頁面被收錄
6. 用 **「網址檢查」** 工具搜 `https://gn01816465.github.io/nourish/`，可以強制請求建立索引（每天 ~10 次配額）

### Bing Webmaster Tools（次要）

1. 開 https://www.bing.com/webmasters
2. 用 GSC 帳號登入 → **「Import from Google Search Console」**（一鍵把 sitemap / property 同步過來）
3. 或手動：Add site → 同樣的 URL → 驗證 → 提交 sitemap

### 驗證 SEO 武裝是否生效

部署 24-48 小時後跑這幾項：

- [ ] **Google rich snippet 預覽**：https://search.google.com/test/rich-results 貼網址，看 JSON-LD VideoGame schema 有沒有解析成功
- [ ] **PageSpeed Insights**：https://pagespeed.web.dev/ 跑 mobile，目標 Performance ≥ 90 / SEO 100
- [ ] **Mobile-Friendly Test**：https://search.google.com/test/mobile-friendly（現已併入 PSI）
- [ ] **Schema validator**：https://validator.schema.org/ 貼 JSON-LD 文字塊
- [ ] **robots.txt tester**：GSC「設定 → robots.txt」確認 6 條 Disallow 正常

### 預期收錄時程

| 項目 | 時間 |
|------|------|
| Google 第一次爬 sitemap | 24h 內 |
| 首頁出現在 site:gn01816465.github.io 結果 | 1-3 天 |
| 搜「啾啾日常」可找到 | 3-7 天（中文索引較慢） |
| 出現 rich snippet 卡片 | 7-14 天（Google 重新處理 schema） |
| 達到 Search Console 顯示「涵蓋率 100%」 | 14-30 天 |

### 常見問題

**Q：Google 不收錄怎麼辦？**  
A：(1) 確認 robots.txt 沒擋首頁（只擋 docs/）；(2) 用 GSC 網址檢查強制請求；(3) 從外部來源（Reddit / PTT / 個人 blog）拿一個 backlink，加快爬蟲發現

**Q：JSON-LD schema 沒被解析？**  
A：(1) 確認 `<script type="application/ld+json">` 不是 `text/javascript`；(2) JSON 內部不能有註解；(3) 用 schema.org validator 看具體錯誤

**Q：sitemap 提交後顯示「無法擷取」？**  
A：(1) `curl -I https://gn01816465.github.io/nourish/sitemap.xml` 應回 200；(2) Content-Type 應是 `application/xml`；(3) 不能有 BOM 開頭

---

## 後續

部署成功後請：

1. 更新 README.md 第 1 行徽章下面加「[🐣 在線玩看看](https://...)」
2. 在 iteration-log.md 記一條 `部署上線`
3. 跑 §11 Search Console 提交流程
4. 分享 link 給朋友 / TA 試玩
