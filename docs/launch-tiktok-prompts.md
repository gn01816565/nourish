# 啾啾日常 ChickaDay — TikTok / Reels W1 短片 image prompts

> 寫於 2026-04-29（iter#85），對應 [`launch-plan.md`](launch-plan.md) §1.2 W1 7 條短片日程。
> 每條短片的「第 1 秒 sticky frame」決定 0.3s 內留不留人 — 本檔提供 7 條 cover image / 第一幀的 SD/SDXL prompt。
> Session B 可以拿這些 prompt 跑 ComfyUI（DreamShaperXL Turbo + rembg pipeline）產 thumbnail / cover image。
>
> **TA**：18-35 女性，coquette / cottagecore aesthetic（[`launch-plan.md` §1.1](launch-plan.md)）。
> **格式**：9:16 vertical（1080×1920）for TikTok / Reels；16:9 desktop preview optional。
> **色票**：粉嫩 #FFB7B7、桃紅 #FF89A7、淺粉 #FFE0E8、暖黃 #FFD86B、奶油 #FFF8E7（[`character-sheet.md`](character-sheet.md)）。

---

## 共用 style anchor

每條 prompt 開頭都加這段確保視覺一致：

```
soft pastel coquette aesthetic, kawaii illustration style, smooth gradient background pink to cream,
chunky outline 3px black, big sparkly eyes, blushing cheeks, ribbons and lace accents,
fluffy soft texture, warm afternoon lighting, --ar 9:16 --niji 6 --s 250
```

(`--ar 9:16` 對 Midjourney / Niji；SDXL 用 `1080×1920` resolution；ComfyUI 用 `aspect_ratio: 9:16`)

**避用詞**：sharp, edgy, dark, gothic, angular, weapon, fight, blood, scary（與 TA 約束反向）。

---

## 1. Mon: 「我桌面新養的小寵物」

**主題**：螢幕錄製 + 變蛋孵化縮時，向玩家展現「在分頁旁邊養」的概念。

**Cover prompt**：
```
chibi yellow chick peeking out of cracked egg shell, sitting on a laptop keyboard,
laptop screen shows pink browser tab interface, cozy desk corner with mini plant
and pastel coffee mug, soft pink plush rug, warm afternoon window light,
girl's hand holding pencil in foreground (out of focus),
text overlay area in upper third
```

**設計重點**：手 + 鍵盤 + 蛋 同框 = 立即傳達「上班族也能養」。文字位放上 1/3 給「我桌面新養的小寵物」標題。

---

## 2. Tue: 「療癒系養雞 ASMR」

**主題**：餵食音 + 摸頭音，無人聲，30s。需要 close-up macro 視覺。

**Cover prompt**：
```
extreme close-up macro of fluffy yellow chick being gently petted by index finger,
finger painted with soft pink nail polish, chick eyes half-closed in bliss,
tiny content smile, water droplets glittering on feathers, blurred soft pink bokeh background,
dreamy diffused lighting, ASMR-style intimate framing, gentle haptic feel
```

**設計重點**：手指 + 雞臉特寫 = ASMR 視覺替身。指甲彩繪粉色加 femme signal。眼半閉 = 舒適。

---

## 3. Wed: 「7 種雞的進化分支」

**主題**：依序展示 7 終態（healthy / fatty / fighter / sage / diva / divine / ugly）。

**Cover prompt**：
```
collage grid 2x4 (7 frames + 1 mystery), each frame shows one stylized chibi chicken variant:
healthy radiant chick with halo, plump fluffy chick eating donut, energetic chick mid-jump in pink leotard,
wise chick with tiny round glasses and book, glamorous chick with sparkles and microphone,
divine ethereal chick with glowing aura and angel wings, slightly funky asymmetric chick that's still cute,
last frame is a question mark teasing future variant, soft pastel borders, scrapbook layout
```

**設計重點**：grid 直接讓觀眾數 7 種，第 8 格 ❓ 暗示「還有沒解鎖」吊胃口。

---

## 4. Thu: 「跟 AI 男友通話時養雞」

**主題**：多工 meme，分割畫面（左：跟 AI chat，右：餵雞）。

**Cover prompt**：
```
split screen vertical layout, left half: girl's profile silhouette wearing pink hoodie typing on phone
with blue chat bubbles floating, right half: same girl's other hand petting the chickaday pet
on a separate phone screen showing pink game UI, bedroom in pastel coquette decor,
fairy lights, ribbon details, multitasking intimate vibe
```

**設計重點**：multitasking meme 點 — 「我有別的事在做也能養雞 5 分鐘一次」。bedroom 環境符合 cozy。

---

## 5. Fri: 「裝扮我的小雞」

**主題**：9 件配件全展示，配 cottagecore 音樂。

**Cover prompt**：
```
chibi yellow chick standing on a vanity with 9 accessories floating around it in dreamy circular arrangement:
pink bow on top, pearl necklace, lace headband, daisy crown, ribbon scarf,
butterfly wings, heart-shaped sunglasses, party hat, fluffy cape,
flat lay coquette aesthetic, sparkles connecting items, cottagecore background with dried flowers and lace fabric
```

**設計重點**：所有配件都集中一張圖，玩家直接看清「能搭配多少」。flat lay 是 coquette TikTok 主流構圖。

---

## 6. Sat: 「比 Tamagotchi 還可愛的免費網頁版」

**主題**：直接對比，2025 vs 2026 風格。

**Cover prompt**：
```
side-by-side comparison split screen vertical, left: 1990s-style pixelated black-and-white tamagotchi handheld with chunky buttons,
right: 2026 modern soft-pastel ChickaDay UI on smartphone showing blooming pink chick with sparkles,
arrow between with text "免費網頁版" in cute handwriting font,
nostalgic vs modern visual contrast, both lit with same warm peach light
```

**設計重點**：對比敘事 = 立即說明「同類但更好」。30+ 懷舊族先勾上，然後文案再 hook 年輕族「免費 / 網頁 / 無下載」。

---

## 7. Sun: 「為什麼我每 5 分鐘就要看一下牠」

**主題**：dev 解說 + 玩家心理（共鳴向）。

**Cover prompt**：
```
girl's POV looking at smartphone screen, ChickaDay UI visible with chick wearing pink bow,
girl's thumb hovering over the pet, slight tear in her eye reflected on screen,
soft warm bedroom lighting, pink blanket and tea cup, cozy weekend morning vibe,
emotional intimate connection between human and virtual pet, almost diary-like aesthetic
```

**設計重點**：情感共鳴敘事 — 「為什麼我會這麼在意一個虛擬雞」是養成遊戲核心張力。POV + 一滴眼淚 = 立刻 emotional hook。

---

## W2 預備（觸發後再決定是否做）

W1 7 條若有單條 5K+ views，W2 就**該變奏延伸**而非照舊：

### 變奏 A: 「玩家分享 + dev 回應」
```
collage of 4-6 user TikTok screenshots showing ChickaDay gameplay,
overlaid in a heart-shaped frame, with hand-drawn arrows pointing to each one,
text "這些創作者都在養" in sparkly font, dev avatar in corner waving cute
```

### 變奏 B: 「v0.3 配件預告」
```
mystery silhouette of upcoming v0.3 accessory (e.g. butterfly pin),
visible only as outline glow on dark pastel background,
"下週解鎖" text overlay, anticipation-building, teaser style
```

---

## ComfyUI workflow 建議（給 Session B）

**model**：DreamShaperXL Turbo 或 Anything XL（適合 chibi / kawaii）
**sampler**：Euler a, steps 8-10（Turbo 即可）
**rembg pipeline**：產出後背景透明化，方便疊在 TikTok template 上
**resolution**：1080×1920，輸出 PNG 帶 alpha
**batch**：每條 prompt 跑 4-8 張變體，挑構圖最 sticky 的

---

## hashtag 對應建議（iter#94 mix-and-match 重整，與 launch-plan.md §1.2 同步）

| 短片 | 美學軸 | 主 hashtag |
|------|-------|-----------|
| Mon 桌面寵物 | coquette | `#coquette #pinkaesthetic #cozygame #virtualpet` |
| Tue ASMR 養雞 | **cleangirl** | `#cleangirl #asmr #softgirl` |
| Wed 7 進化 | **balletcore** | `#balletcore #virtualpet #petgame` |
| Thu AI 男友多工 | **cleangirl** | `#cleangirl #productivityhack #cutestuff` |
| Fri 裝扮 | coquette × cottagecore | `#coquette #cottagecore #fairycore #dressup` |
| Sat 復古對比 | coquette + nostalgia | `#coquette #tamagotchi #nostalgia #y2k` |
| Sun emotional | coquette | `#coquette #indiegamedev #cozygame` |

每條短片**至少 3 個 hashtag**，1 個美學軸（coquette / cleangirl / balletcore）+ 1-2 個 niche subculture + 0-1 個 platform discoverability。

**美學軸分配（iter#93 §7.3 mix-and-match 結論）**：4 coquette + 2 cleangirl + 1 balletcore。W2 觀察哪一軸起飛再加碼。
