# Session B 任務簡報（給 ComfyUI 批次工作流）

> 此檔由 Session A 維護，列出**有 PNG 化價值但尚未產出**的圖片資產。
> Session B 在 RTX 3060 Ti / DreamShaperXL Turbo 完成一批就把對應條目標 ✅ 並更新 cfg.js path。

---

## 工作環境（既有）

- 機器：`linux-pc`（192.168.50.68，RTX 3060 Ti 8GB VRAM）
- ComfyUI：0.14.1（torch 2.5.1+cu121）
- pipeline：DreamShaperXL Turbo + rembg `isnet-anime`（角色）/ `u2net`（物件）→ PIL crop+pad+resize → pngquant
- 風格 anchor（**所有圖必須帶上**）：Pixar/Sanrio plush 風 + character-sheet §1.2 五項 DNA + character-sheet §10.1 女性向粉嫩調

---

## 1. ✅ 完成：wings PNG（19:15 Session B v3）

- `acc-wings-angel.png`：粉彩虹 + 金色滾邊天使翅膀對稱對，中間留空（350 FC）
- `acc-wings-fairy.png`：粉紫彩虹 fairy 翅膀對 + 上方迷你彩虹流星裝飾，中間留空（480 FC，premium tier）
- DreamShaperXL Turbo 預設會在翅膀中間塞鳥/蝴蝶身體；用 cfg=4.0 + "decorative wings ornament with empty gap" 措辭 + 強反角色 negative 才壓住
- `cfg.js` 第 169 行 `wings` 已指向 angel.png；新增 `wings_fairy` entry 指向 fairy.png（給 wing slot 兩件選擇）
- 解鎖 `dressup_set` / `dressup_collector` 成就路徑

---

## 2. ◐ 部分完成：mood 5 張白邊去除（19:30 Session B）

- 全 5 張用 `silueta` model + PIL alpha 邊緣腐蝕（3px MinFilter）→ **白邊 sticker 外框成功去除** ✓
- 內容方面：`happy / neutral / sad` 3 張完美；`sleeping` 兩次重生都生不出閉眼+Zzz（DreamShaperXL Turbo 強烈拒絕畫閉眼 emoji），目前是「平靜微笑」面孔；`dirty` 變成蒼蠅+泥的混合 creature（不是預期的「髒臉+獨立蒼蠅」但仍可辨認 dirty 概念）
- 結論：功能上可用，藝術精準度未完全達標。建議 **未來換 model**（如 SDXL Pony 或 Animagine）若 SDXL Turbo bias 持續，或改畫風為「角色全身髒/睡」而非「emoji 表情」

---

## 3. ✅ 完成：chick-young 視覺差異化（19:30 Session B）

- 用 cfg=3.0 + 「TALLER and SLIMMER body, longer legs, RED COMB starting to grow, confident pose, small chest puffed out, NOT a fluffy ball baby」prompt 重生
- 結果：身體偏粉桃色、頭頂紅冠微露、體型較拉長 — 跟 chick-baby 並排有可辨識差異 ✓
- 仍非極端不同（plush 風的限制），但夠用

---

## 4. ◐ 部分完成：v0.4 額外配件（19:50 Session B）

3/5 上線到 cfg.js（cfg=5.0 + product catalog framing 規避角色化失敗）：
- ✅ **太陽眼鏡** `acc-sunglasses.png`（face slot 新增！180 FC）
- ✅ **圍巾** `acc-scarf.png`（neck，150 FC）
- ✅ **派對帽** `acc-party-hat.png`（hat，100 FC，前面有微小笑臉但可接受）

2/5 失敗（PNG 留檔但未上線 cfg）：
- ❌ **小耳機** `acc-earbuds.png`：DreamShaperXL 在耳機豆豆上畫了雞臉
- ❌ **蝴蝶結項圈** `acc-collar-ribbon.png`：項圈纏在白色幽靈形體上（有殘留 character body）

兩張失敗原因相同：DreamShaperXL Turbo 對「pet accessory」概念強烈關聯到「pet character」。下次嘗試：換 Animagine-XL 或 SDXL Pony，或畫成「無 pet 的純物件」例如「ribbon collar laid flat on a table」框架。

> Session A 之後加的話會更新此表，先讓 Session B 有「下一波」可選的列表。

---

## 一致性檢查（每張 PNG 出爐後過一次）

- [ ] 體色 / 配色屬於 character-sheet §1.3 的 9 色色票範圍
- [ ] 線稿 ~3px 等比，無細線 / 無寫實
- [ ] 圓潤、無銳角、無暗色金屬感
- [ ] 跟既有 `chick-baby.png`（角色 anchor）並排看，風格一致
- [ ] 透明背景純淨，無白邊 / 無 sticker 外框
- [ ] 通過 character-sheet §8 的 5 道 gating

---

## 完成後

1. 在 `iteration-log.md` 開新 Session B 條目（時間戳 + 動作 + 影響檔案）
2. 把對應條目從本檔移到「✅ 已完成」section（或刪除該條）
3. 順手提醒 Session A：`accessories` 表的 path 已更新，下次 cron 會自動載到新 PNG（不需要 Session A 動）
