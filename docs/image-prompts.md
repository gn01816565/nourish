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

## 8.8 漂泊者雞（chick-adult-drifter.png）  *iter#216 v0.5 第 11 個進化分支 — 待生圖補上，目前 cfg.petArt 暫指 healthy 占位*
```
[全域風格]
Subject: a wanderer / boho-traveler chicken. Soft yellow body in standard chick-adult
proportions. Wearing a warm cream / oatmeal woven shawl draped over the shoulders, with
fringe tassels hanging down. Multiple tiny trinkets attached / dangling: a small pendant,
a fringe ribbon, a feather charm, a tiny pressed flower — suggesting a collector's
accumulated style. One wing holding up a small carved walking stick or twig. Soft, slightly
weathered expression — wise eyes (^_^), hint of pink blush from sun-kissed travels. Small
✦ sparkle nearby suggesting "where to next?" feel. Background transparent. Mood:
cottagecore-boho / wanderer / handmade-collector aesthetic, soft pastel palette, never
sharp / aggressive lines. Avoid generic "explorer" overlap (no compass / map — those are
explorer's anchor) — focus on accumulated keepsakes vs adventure tools.
```
**為什麼這個設計**：呼應 drifter 解鎖路徑（cross-life ownedAccessories ≥ 8 種） — woven shawl + multiple dangling trinkets 直接視覺化「跨命累積收藏家」narrative；跟 explorer 的「冒險裝備」（背包 + 地圖 + 指南針）區隔，drifter 是「收藏 + 旅人」風格而非「探險 + 任務」風格；加 walking stick 強化 wanderer 詩意但避免冒險刻板。**解鎖條件**：state.pet.ownedAccessories Object.keys length >= 8（跨命累積購買 8 種以上配件後，下次 evolve 解鎖；典型 D14+ 玩家自然達標路徑 — 配件 21 件中 8 件 ≈ 38%）。

## 8.7 暖心雞（chick-adult-warmheart.png）  *iter#196 v0.4 第 10 個進化分支 — 待生圖補上，目前 cfg.petArt 暫指 healthy 占位*
```
[全域風格]
Subject: a cuddly affectionate chicken. Soft yellow body in standard chick-adult proportions,
slightly more rounded / plumper than baseline (suggesting cozy contentment, but not fatty —
distinct from chick-adult-fat). Half-closed contented eyes (◡‿◡), soft blush cheeks, tiny
peaceful smile. Wearing a small pink scarf or cozy knit shawl draped over the shoulders.
Optional: tiny heart 🤍 floating nearby. Pose: leaning slightly to one side as if resting
against an unseen master. Background transparent. Mood: cottagecore-cozy / lazy afternoon /
tender intimacy. Soft pastel palette, never sharp / aggressive lines. Avoid drowsy (use
sleeping form for that) — eyes are gently lidded but awake.
```
**為什麼這個設計**：呼應 warmheart 解鎖路徑（pet_head + pet_belly + talk 累計 50 次） — pose 設計暗示「依偎」narrative，scarf / shawl 強化 cozy domesticity；blush + 🤍 軟化「清涼 / 距離感」常見問題；鏡頭框架感「靠著主人」是 GDD §10.3 elder companion narrative 的視覺對應。**解鎖條件**：state.pet.traits.petCount >= 50（累計摸頭 / 摸肚 / 對話 50 次後解鎖，~1-2 週日常養成達標）。

## 8.6 探險家雞（chick-adult-explorer.png）  *iter#183 v0.3 第 9 個進化分支 — 待生圖補上，目前 cfg.petArt 暫指 healthy 占位*
```
[全域風格]
Subject: a curious explorer chicken. Soft yellow body in standard chick-adult proportions.
Wearing a small leather satchel / backpack across one shoulder, slightly open with a tiny
mushroom or pink petal peeking out the top. Tiny pink bandana tied around the neck.
Holding a small map or compass in one wing. Wide bright eyes (^_^) showing wonder, looking
slightly off-frame at something interesting. Background transparent. Small floating sparkles
nearby (one star, one mushroom dot). Mood: cottagecore-adventure / wholesome curiosity, soft
pastel palette, never sharp / aggressive lines. Compass / map detail leans cute illustration
not military.
```
**為什麼這個設計**：呼應 explorer 解鎖路徑（catch event >= 25 次）— backpack 裝的小蘑菇 / 花瓣對應 cfg.randomEvents 的 mushroom / petal / star 既有 art；粉色 bandana + soft 表情避免「冒險家 = 男性化」的視覺刻板；map / compass 是書卷氣 + 童趣的混合，跟 sage（学術派）區隔。**解鎖條件**：state.pet.traits.eventsCaught >= 25（catch event 25 次後解鎖，~5-7 天 D14+ 玩家自然達標）。

## 8.5 美食家雞（chick-adult-gourmet.png）  *iter#156 v0.2 新進化分支 — 待生圖補上，目前 cfg.petArt 暫指 healthy 占位*
```
[全域風格]
Subject: a gourmet pâtissier chicken. Soft yellow body in standard chick-adult proportions.
Wearing a small pastel pink chef's hat (toque blanche) tilted slightly. Tiny ribbon-tie
apron in cream / blush-pink with a strawberry or macaron motif on the front pocket. One
wing holding up a tiny silver fork or whisk. Subtle blush cheeks, half-closed satisfied
eyes (◕‿◕) with a small heart sparkle nearby. Background transparent. Mood: cottagecore /
afternoon-tea aesthetic, soft pastel palette, never sharp / aggressive lines.
```
**為什麼這個設計**：呼應 iter#132「下午茶」隨機事件 + cottagecore 美食家路線；廚師帽 + 圍裙明確區分 healthy 模範生 / fatty 圓潤體型 / sage 學究眼鏡，獨立視覺記憶點；粉色 + 草莓 / 馬卡龍 motif 鎖女性向 TA。**解鎖條件**：state.pet.traits.feedCount >= 60（餵 60 次後解鎖，~3 週日常養成）。

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
