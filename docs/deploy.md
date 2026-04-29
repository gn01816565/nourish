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

- [ ] `node --check src/game.js src/cfg.js src/dex.js src/share.js src/achievements.js` 全綠
- [ ] 本機 `python3 -m http.server 8765` 跑得起來，至少看一遍 onboarding modal
- [ ] **bump `sw.js` 的 `CACHE_VERSION` 字串**（每次 ship 都加日期或版本號），避免老 cache 卡住玩家
- [ ] iteration-log.md 有記這輪做了什麼（雙 session 接力依此判斷）
- [ ] commit 訊息有意義（不要 `update` `fix`）

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
- [ ] DevTools Network 看 5 個 .js 都 200
- [ ] DevTools Application → Service Workers 看 sw.js registered + activated
- [ ] DevTools Application → Manifest 看 PWA manifest 解析正確（icons 全綠）
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

## 後續

部署成功後請：

1. 更新 README.md 第 1 行徽章下面加「[🐣 在線玩看看](https://...)」
2. 在 iteration-log.md 記一條 `部署上線`
3. 分享 link 給朋友 / TA 試玩
