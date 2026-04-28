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

## 1. 待辦：wings PNG（最高優先）

| 項目 | 細節 |
|---|---|
| 來源 | `assets/svg/acc-wings.svg`（Session A 第 23 輪做） |
| 目標 | `assets/images/acc-wings.png`，512×512，透明背景 |
| 主題 | 粉紅雙翅 + 白羽脈紋 + 兩顆深粉 ✦ + 高光 |
| Prompt 重點 | "small fluffy pink angel wings, pair, soft pastel pink, white feather highlights, sparkles, transparent background, kawaii sticker style, no body, isolated wings only" |
| 產完更新 | `src/cfg.js` line 167 附近 `wings` entry 的 `art:` 從 `assets/svg/acc-wings.svg` 改 `assets/images/acc-wings.png` |

---

## 2. 待辦：mood 5 張白邊去除（Session B 自己標記）

| 項目 | 細節 |
|---|---|
| 來源 | `assets/images/mood-{happy,neutral,sad,sleeping,dirty}.png` |
| 問題 | rembg 沒去乾淨，每張帶白色 sticker 外框 |
| 目標 | 純透明背景，無外框 |
| Prompt 加強 | "pure transparent background, NO white border, NO frame, NO sticker outline, edges fully alpha-cut" |
| 替代方案 | 重 rembg（可試 `silueta` model）+ 後製 PIL alpha 邊緣腐蝕 |

---

## 3. 中優：chick-young 視覺差異化

| 項目 | 細節 |
|---|---|
| 來源 | `assets/images/chick-young.png` |
| 問題 | Session B 標記：DreamShaperXL Turbo 不太分得出 baby 跟 juvenile，目前看起來太接近 chick-baby |
| 目標 | 體型抽高、頭比例略小、雞冠開始發育（紅點微露）、姿勢站立有自信感 |
| Prompt 加強 | "young teen chick, slimmer body than baby chick, taller posture, red comb starting to grow on top of head, confident pose with small chest puffed out, between fluffy ball stage and adult" |

---

## 4. 低優：未來 v0.4 額外配件（給 prompt 預覽）

可隨時新增到 `cfg.js` accessories 表 + 同步生 PNG：

| 配件 | slot | 預估價格 | prompt 主題 |
|---|---|---|---|
| 小耳機 | hat | 250 FC | "tiny pink wireless earbuds with tiny LED, headband around chick head" |
| 太陽眼鏡 | face*（新 slot） | 180 FC | "pastel pink heart-shaped sunglasses, kawaii fashion accessory" |
| 圍巾 | neck | 150 FC | "fluffy pastel pink scarf wrapped twice, fringe ends" |
| 派對帽 | hat | 100 FC | "cone party hat, pastel pink with white polka dots, gold star on top" |
| 蝴蝶結項圈 | neck | 220 FC | "pastel pink ribbon collar with gold bell, kawaii" |

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
