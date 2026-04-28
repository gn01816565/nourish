# AI 生圖 Prompt 清單 — 啾啾日常 (ChickaDay)

> ⚠️ **生圖前必讀**：[`docs/character-sheet.md`](character-sheet.md) — 角色設定書是單一真相之源。
> 不讀那份直接生圖會生出 18 隻不同的雞，**整套作廢**。

> 用途：把 SVG 占位圖換成 PNG（推薦 Midjourney v6 + `--cref`）。
> 工作流程：先生 1 張**官方 v1 雛雞**參考圖 → 後續每張用它當 character reference。
> 詳見 character-sheet.md §6。

---

## 全域風格 + 角色錨定（每張都要保留這整段）

```
SUBJECT IDENTITY (must apply to ALL variants — same individual across all images):
A single small chick character named "Chickaboo" (啾啾). Identity is fixed:
- Body color: warm yellow #FFD86B (NEVER lemon, mustard, neon, or pure yellow)
- Eyes: large round black dots with single white highlight on upper-left
- Beak: small downward-pointing orange triangle (#FF9F43), narrow (≈14% head width)
- Body proportion: head as large as or larger than body, round and plump
- Outline: thick black ink ~3px equivalent
- Style: cute cartoon, flat shading + light gradient highlight, NO realism

STYLE: cute cartoon, soft pastel palette, thick black outlines, flat shading with
light gradient highlights, centered subject, friendly rounded shapes, big head small
body proportions, large expressive eyes. Avoid neon colors, photorealism, dark or
scary tones.

PALETTE (only use these): warm yellow #FFD86B, orange #FF9F43, brown #8B5A2B, cream
#FFF8E7, ink black #2C2C2C, sky blue #6BCBFF, leaf green #6BCB77, soft pink #FFB7B7,
crimson #B23A48.

OUTPUT: 512×512 PNG, transparent background unless explicitly background image.

FORBIDDEN: lemon yellow, duck-shaped beak, anthropomorphic human pose, 3D realistic
feathers, almond-shaped eyes, double pupils.

This is the SAME individual chick across all stages and moods.
```

> 中文：上面整段是「角色錨定 + 風格 + 色票 + 禁止項」，**每張 prompt 必須完整貼上**。然後再加各別狀態描述。

---

## 1. 蛋（egg.png）
```
[全域風格]
Subject: a single chicken egg, oval shape, cream-white shell with small brown speckles
scattered around. Slight glossy highlight at upper left. No crack, no chick visible.
Standing upright. Pure transparent background.
```

## 2. 裂蛋（egg-cracked.png）
```
[全域風格]
Subject: same chicken egg with a zigzag crack across the upper half. A tiny yellow chick
beak peeks through the crack with one curious black dot eye visible. Cute, anticipatory,
the moment of hatching. Transparent background.
```

## 3. 雛雞（chick-baby.png）
```
[全域風格]
Subject: a newly hatched baby chick. Big round head almost as large as the body, fluffy
yellow feathers, small wing buds on the sides, small orange triangle beak, big black
sparkly eyes with white highlights, happy smile, two tiny orange feet. Body is rounded
and soft, almost like a fluffy ball. Transparent background.
```

## 4. 幼雞（chick-young.png）
```
[全域風格]
Subject: a young chick, slightly taller than the baby, head proportion smaller relative
to body, beginning to show feather texture lines on the body. Standing on two slim
orange feet with three toes each. Neutral calm expression with closed peaceful smile.
Small wings starting to grow. Transparent background.
```

## 5. 健康成雞（chick-adult-healthy.png）
```
[全域風格]
Subject: a fully grown healthy chicken. Vibrant yellow body with subtle feather pattern,
red comb (rooster crest) on top of the head, orange beak, bright sparkly eyes, confident
posture, two strong orange feet with three toes. Wings slightly extended, showing healthy
plumage. Glossy and clean. Transparent background.
```

## 6. 胖雞（chick-adult-fat.png）
```
[全域風格]
Subject: an extremely round, chubby adult chicken. Body is a giant ball shape, much wider
than tall. Tiny short legs barely visible underneath. Cheeks pink and puffy. Sleepy
content expression with half-closed eyes. Yellow color, orange beak. Cute and harmless,
not gross. Transparent background.
```

## 7. 醜雞（chick-adult-ugly.png）
```
[全域風格]
Subject: a scruffy, unkempt adult chicken. Feathers are messy and sticking out in random
directions, dull beige/olive yellow color rather than bright yellow. X-shaped tired
eyes (cross out style for cuteness, not creepy). Sad downturned beak, small droplet of
sweat. Thin legs slightly bent. Pitiful but cute, sympathy-evoking, NOT scary or gross.
Transparent background.
```

## 8. 神雞（chick-adult-divine.png）
```
[全域風格]
Subject: a divine, glowing chicken. Soft golden-cream body, faintly glowing aura around
the body. Golden halo floating above the head. Two small angelic feathered wings on the
sides. Sparkles ✦ and stars around. Serene smile, eyes gently closed or radiant. Pure
white feather highlights. Background remains transparent except for the soft glow.
```

## 9. 心情：開心（mood-happy.png）
```
[全域風格]
Subject: a round yellow emoji-style face. Two upward curved eyebrows lines, two closed
arc eyes (^_^), wide open laughing mouth showing tongue, pink blush circles on cheeks.
Centered, no body. 256×256 PNG, transparent background. Used as a mood overlay icon.
```

## 10. 心情：普通（mood-neutral.png）
```
[全域風格]
Subject: a round yellow emoji-style face with two simple solid black dot eyes with white
highlights, and a flat horizontal mouth line. Calm, neutral expression. 256×256 PNG,
transparent background. Mood overlay icon.
```

## 11. 心情：難過（mood-sad.png）
```
[全域風格]
Subject: a round dim-yellow / pale beige emoji-style face. Slanted downward eyebrows,
two solid black dot eyes, frowning curved mouth. Two large blue teardrops, one on
each cheek, dripping down. Pitiful, sympathetic. 256×256 PNG, transparent background.
Mood overlay icon.
```

## 12. 心情：睡覺（mood-sleeping.png）
```
[全域風格]
Subject: a round yellow emoji-style face with two closed arc eyes (curved lines), small
oval mouth slightly open like a snoring bubble. Three small "z Z Z" letters floating up
to the upper right, increasing in size. Peaceful sleep mood. 256×256 PNG, transparent
background. Mood overlay icon.
```

## 13. 心情：髒（mood-dirty.png）
```
[全域風格]
Subject: a round dirty-brown / muddy yellow emoji-style face with two simple eyes and a
disgusted wavy mouth. Two cartoon flies (small 8-shape with wing lines and dot eyes)
buzzing around the head. One blue sweat drop on temple. Mud splatter dots on the lower
edge. Cute-gross, not actually gross. 256×256 PNG, transparent background. Mood overlay
icon.
```

## 14. 飼料（food-seed.png）
```
[全域風格]
Subject: a small wooden bowl filled with a heaping pile of round seed grains (mix of
golden yellow and warm orange grains). Each grain has a slight highlight. The bowl is
brown with a darker rim. View slightly from above. Sits centered. Transparent background.
```

## 15. 蟲（food-worm.png）
```
[全域風格]
Subject: a single cute wiggly green caterpillar/worm in an S-curve pose. Lime/leaf green
color #6BCB77, segmented body with 4-5 segments, small black dot eyes, tiny smile, two
cute antennae sticking up. Friendly and edible-looking, NOT realistic worm, NOT scary.
Transparent background.
```

## 16. 水（food-water.png）
```
[全域風格]
Subject: a single large droplet of fresh water. Teardrop shape, sky blue gradient from
light blue at top to deeper blue at bottom, glossy white highlight on the upper-left
side. Crisp black outline. Standing pointed-up. Transparent background.
```

## 17. 雞舍背景（bg-coop.png）
```
[全域風格 — but solid background, NOT transparent]
Subject: a wide cozy chicken coop interior scene as a horizontal background. Warm cream
walls, wooden floor with horizontal plank lines, a small dark doorway in the center
back, two small square windows with sky blue panes and crossed mullions on left and
right of the door. Bundles of golden straw scattered along the bottom edges. A round
warm light glow from the upper left corner suggesting a hanging lamp or sunlight.
Output: 1280×720 PNG with full background fill (no transparency). Empty stage area in
the middle bottom for placing a chicken character.
```

## 18. 草地背景（bg-grass.png）
```
[全域風格 — but solid background, NOT transparent]
Subject: a serene daytime outdoor scene as a horizontal background. Sky-blue gradient sky
in the upper 70%, fluffy white clouds drifting. Bright cheerful sun in the upper right
with simple ray lines. Lower 30% is a green grass field with simple V-shape grass tuft
icons scattered. A pink flower bottom-left, a white-yellow daisy bottom-right. Output:
1280×720 PNG with full background fill (no transparency). Empty stage area in the middle
bottom for placing a chicken character.
```

---

## 使用建議

### 推薦工作流程（角色一致性優先）

1. **先生 v1 參考圖**：用 #3 雛雞 prompt + Midjourney `/imagine` → 從 4 張選 1 張**最符合 character-sheet §1.2 五項視覺 DNA** 的圖 → **這就是你的「官方 v1」**
2. **過 character-sheet §8 五道 gating checklist**：色 / 眼 / 喙 / 線稿 / 比例 5 項全過才能升上 v1
3. **後續每張**：`/imagine [上面的 prompt] --cref [v1 圖片 URL] --cw 80`，僅變狀態描述
4. **檢查相鄰圖**：每張新圖跟 v1 並排看，問自己「這是同一隻雞嗎？」
5. **去背**：MJ 出來通常有背景，用 [remove.bg](https://remove.bg) 或 Photopea 魔法棒去背
6. **命名**：生出的 PNG 直接覆蓋同名 SVG 即可（同檔名換副檔名 `.png`），程式 `CFG.petArt` 改副檔名一行就完成切換

### Workflow Anti-pattern（不要這樣做）

❌ **平行 batch**：一次貼 18 條 prompt 給 GPT-image 或無 `--cref` 的 MJ → 18 隻不同雞
❌ **跳過 v1**：直接從成雞分支開始生 → 沒有錨點，後續每張漂移
❌ **混工具**：先 MJ 生雛雞、再 Gemini 生成雞 → 兩家風格 bias 不同會分裂

### 成本與時程估算

- v1 雛雞參考圖：MJ 30 分鐘（含挑圖 + gating），$10/月訂閱
- 完整 18 張：~3 小時（v1 鎖好之後每張 5–10 分鐘）
- LoRA 路線（如果想長期穩定）：先準備 10–15 張 v1 變體 → 訓練 ~1 小時 → 後續一鍵生圖

### 替換時機

- v0.1 MVP：先用 SVG 占位（已完成 19 張）
- v0.2 起步：**先生 v1 雛雞，鎖角色** → 再陸續換其他狀態
- v0.3 公開：18 張 PNG 全完成，過 gating

---

## 風格參考關鍵字（給 Gemini / Midjourney）

```
chibi, sticker style, mascot design, kawaii, soft outline, pastel, gentle gradient,
flat color blocks, centered, large eyes, simple shapes, no realistic detail
```
