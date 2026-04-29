# 多寵物 v0.4 規劃（規劃稿，未實作）

> 此檔案是**規劃稿**，不是實作。為了 defang 「多寵物 v0.4 已連續推遲 9 輪」的議題，先把 schema / UI / 風險寫清楚，未來 1–3 個 sprint 分批做。

---

## 1. 為什麼推遲

50 輪迭代每 10 分鐘只能做小工，多寵物**根本性改 schema**：
- `state.pet` (單一物件) → `state.pets` (array) + `state.activePetId`
- 所有 render / interaction / wants / dex 都要走「當前活躍寵物」
- localStorage migration 風險最高
- 共有 30 條成就要 evaluate per-pet 或 cross-pet

10 分鐘 budget 做這個必崩。所以分**3 個 sprint** 拆。

---

## 2. MVP 範圍

**v0.4 最小可用**：
- 同時最多 2 隻寵物（不是 N）
- 共用：飼料幣 / 飾品擁有 / 圖鑑 / 成就
- 不共用：每隻獨立 stats / appearance / wants / 進化

**避免做（拉到 v0.5+）**：
- 寵物互動（互相打招呼）
- 互換 stats / 配對繁殖
- 更多隻寵物（3+）

---

## 3. Schema 設計

### 3.1 新 state shape

```js
{
  schemaVersion: 2,                  // bump！
  ...
  activePetId: "uuid-1",             // 目前在主舞台的寵物
  pets: [
    {
      id: "uuid-1",
      name: "啾啾",
      stage: "chick",
      // ... 既有 pet 內容全部搬進來
    },
    {
      id: "uuid-2",
      name: "豆豆",
      stage: "egg",
      // ...
    }
  ],
  // 跨寵物共享：
  economy: { feedCoin, totalEarned, totalSpent },
  daily: { lastLoginDay, loginStreak, tasks },
  history: { totalSessions, feedCount, ... },     // 全部累積，不分寵物
  achievements: { ... },                          // 跨寵物累積
  cooldowns: { /* per-active-pet 還是 global? 待決 */ },
  settings: { ... }
}
```

### 3.2 Migration（schemaVersion 1 → 2）

```js
function migrateV1ToV2(data) {
  if (data.schemaVersion === 2) return data;
  const oldPet = data.pet;
  return {
    ...data,
    schemaVersion: 2,
    activePetId: oldPet.id,
    pets: [oldPet],
    pet: undefined,  // 留給舊代碼讀，但用 getActivePet() 取代
  };
}
```

舊存檔自動升級為「1 隻寵物」狀態，玩家無感。

### 3.3 Helper

新增 `getActivePet()` getter，**所有 render / interaction 改用它**：
```js
function getActivePet() {
  return state.pets.find(p => p.id === state.activePetId) || state.pets[0];
}
```

### 3.4 cfg / dex / achievements 影響

- `cfg.js`：不變（純資料）
- `dex.js`：archiveCurrentPet 從 `state.pet` → `getActivePet()` 一行改
- `achievements.js`：規則用 active pet 的 traits / stage；history 維持 cross-pet
- `share.js`：渲染 active pet（紀念卡仍從 dex completedPets 拿）

---

## 4. UI 改動

### 4.1 頂部寵物切換器

stats-bar 上方加 row：
```
[🐣 啾啾 ✓]  [🥚 豆豆]  [+]
```
- 點寵物 chip → 切活躍
- 「+」鈕 → 開新蛋（如果 < 2 隻）

每個 chip 顯示縮圖（pet 階段對應 PNG/SVG）。

### 4.2 開新蛋對話流程

從原本「進化後才能開新蛋」 → **「最多 2 隻時，任何時候可開」**。
但若任一隻是 egg/chick 階段，提示「另一隻還小，要照顧才能開？」（不阻擋，只是文案）。

### 4.3 寵物退役

當有 2 隻時不能再開新蛋。要開第 3 隻 → 必須 archive 一隻（送進 dex 紀念卡）。
- 點 chip 長按 → 跳「退役」對話
- 退役只允許已進化的（成雞）

---

## 5. 邊界 / 風險

| 風險 | 嚴重度 | 緩解 |
|------|------|------|
| Migration 邏輯破壞舊存檔 | 高 | 寫單元測試 + 玩家匯出舊存檔備份 |
| 跨 tab 兩隻寵物不同步 | 中 | 既有 storage event 監聽器已處理 |
| Cooldowns 共享 / 獨立 | 低 | 設計選 per-pet，避免「餵 A 後 B 也冷卻」 |
| 性能：tick 兩隻 | 低 | 兩隻只多一倍計算，可承受 |
| Wants spawn 兩隻同時跳 | 中 | 限制：只活躍寵物會 spawn want |
| 動畫 z-index 衝突 | 低 | 切換寵物時 lastPetSrc 要 reset |
| 成就 evaluate 怎麼算 | 中 | 大多 history-based 自然累積；form_* 用 dex；perfect_day 改成 active pet 的 |

---

## 6. 拆 sprint

### Sprint A（schema + migration，~2h）
- [ ] 新 schemaVersion 2 + migrate v1→v2
- [ ] `state.pets[]` 取代 `state.pet`
- [ ] `getActivePet()` helper
- [ ] 所有 `state.pet.X` ref 改 `getActivePet().X`（grep 找全部）
- [ ] 測：舊存檔讀進來能玩

### Sprint B（UI 切換器，~1.5h）
- [ ] 寵物 chip row + CSS
- [ ] 點 chip 切換 activePetId
- [ ] 切換時 reset lastPetSrc / lastMoodSrc / lastBgKey 觸發 re-render
- [ ] 切寵物 SFX（click 音）

### Sprint C（開 / 退新蛋，~1h）
- [ ] 「+」chip 開新蛋（< 2 隻）
- [ ] 滿 2 隻時 chip 變灰
- [ ] 長按 chip 開「退役對話」
- [ ] startNewEgg 改：不再 archive 當前（archive 走獨立流程）

### Sprint D（測試 / 平衡，~1h）
- [ ] 兩隻寵物各別餵食 / 玩耍
- [ ] cooldowns per-pet
- [ ] wants 只 spawn 在 active
- [ ] 進化 / 紀念卡流程驗證

**總工程量估**：5–6 小時，分 4 個 sprint 各 1–1.5h。

---

## 7. 為什麼 v0.4 而不是 v0.3

GDD §10.3 把多寵物列在 v0.3。但實際上 v0.3（裝飾 / 成就 / 分享 / 老年）已 4/6 完成、第 5 件季節事件提早做掉，第 6 件雲端存檔需 backend 不能 web-only。

**多寵物現實上到 v0.4 才合理** — 給足夠 buffer 處理 schema migration 風險。

---

## 8. 替代方案（如果不做）

- 「圖鑑歷代」已部分滿足「我曾經養過很多隻」
- 玩家短期不會抱怨「沒辦法同時養兩隻」（市場研究顯示同時段活躍寵物 1 隻是主流）
- 真要做也可以延到 v0.5

但長期評估：多寵物是**進化收集（7 種終態）後的下一個保留度** loop — 玩家想「同時養 fighter + diva 兩條路線」就需要這個功能。

---

## 9. 決定點

主 agent 要實作前，跟 user 確認：
- 「多寵物 v0.4 是否還要做？」（user 可能已經滿足現有單寵物體驗）
- 如果做，**先 ship 現有版本到 GitHub Pages 收 5–10 個玩家回饋**，再決定多寵物優先序
