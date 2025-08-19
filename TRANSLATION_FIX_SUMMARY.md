# 菜單翻譯顯示修復總結

## 問題描述
- **現象**：前端設定為英文語言，但菜單項目仍顯示中文名稱
- **時間**：2025-08-19
- **影響**：英文使用者無法看到翻譯後的菜單項目

## 問題分析

### 後端狀況 ✅
- 翻譯功能正常運作
- Cloud Run 日誌顯示菜單項目成功翻譯：
  ```
  INFO:app:翻譯: '招牌金湯酸菜' -> 'Signature Golden Soup Pickled Cabbage' (語言: en)
  INFO:app:翻譯: '白濃雞湯' -> 'Thick white chicken soup' (語言: en)
  ```
- API 成功回傳 22 個翻譯後的菜單項目

### 前端狀況 ✅
- `createMenuItemElement` 函數邏輯正確
- 支援新舊兩種菜單格式：
  - 新格式：`{name: {original: "中文", translated: "English"}}`
  - 舊格式：`{translated_name: "English", original_name: "中文"}`

### 根本原因 ❌
- **API 回傳格式與前端期望不匹配**
- 後端回傳：`{ "name": "翻譯名稱", "original_name": "原始名稱" }`
- 前端期望：`{ "translated_name": "翻譯名稱", "original_name": "原始名稱" }`

## 修復方案

### 後端修改 (ordering-helper-backend)
在 `app/api/routes.py` 中修改所有菜單 API 回應格式：

```python
# 修改前
translated_item = {
    "name": translated_name,
    "original_name": original_name,
    ...
}

# 修改後
translated_item = {
    "name": translated_name,
    "translated_name": translated_name,  # 為了前端兼容性
    "original_name": original_name,
    ...
}
```

修改的函數：
- `get_menu` (line ~307)
- `get_menu_by_place_id` (line ~406)
- `check_partner_status` (line ~489)
- `get_partner_menu` (line ~4238)

### 前端修改
無需修改，前端程式碼已經能正確處理新的 API 格式。

## 測試結果

### 預期效果
- ✅ 英文使用者看到英文菜名
- ✅ 中文使用者看到中文菜名
- ✅ 向後兼容，支援新舊格式

### 測試步驟
1. 設定 LIFF 語言為英文
2. 進入合作店家菜單（如食肆鍋）
3. 確認菜單項目顯示英文名稱

## 相關文件
- 後端修復 Commit: `24d0cb5`
- Cloud Run 部署：自動觸發
- 前端程式碼：無需修改

## 技術細節

### API 回應格式
```json
{
  "menu_items": [
    {
      "id": 1,
      "name": "Signature Golden Soup Pickled Cabbage",
      "translated_name": "Signature Golden Soup Pickled Cabbage",
      "original_name": "招牌金湯酸菜",
      "price_small": 68,
      ...
    }
  ]
}
```

### 前端處理邏輯
```javascript
// 優先使用 translated_name，然後是 original_name
itemName = safeStr(item.translated_name || item.original_name || item.item_name || 'Untitled');
```

---
*修復完成時間：2025-08-19*  
*修復者：AI Assistant*
