# 店家名稱翻譯修復總結

## 問題描述

從截圖可以看到：
1. **截圖1**：LIFF 網頁中的店家名稱顯示為中文「本家選手村」，但介面語言設定是 English
2. **截圖2**：LINE 聊天摘要部分正確地將店名翻譯成英文「Main Athletes' Village」

**問題**：LIFF 網頁沒有正確使用後端翻譯的店名，導致使用者看到的是原始中文店名而不是翻譯後的店名。

## 根本原因

### 1. 前端 API 呼叫問題
- `check-partner-status` API 呼叫時沒有傳遞語言參數
- 後端無法知道使用者想要的語言，只能回傳原始店名

### 2. 後端 API 功能缺失
- `check-partner-status` API 沒有使用現有的翻譯功能
- 後端已有完整的店家翻譯功能 (`translate_store_info_with_db_fallback`)，但沒有被使用

### 3. 前端顯示邏輯問題
- 前端沒有優先使用翻譯後的店名 (`translated_name`)
- 只使用原始店名 (`store_name`)

## 修復方案

### 1. 前端修復 (`index.html`)

#### A. 添加語言參數傳遞
```javascript
// 修復前
const response = await fetch(`${API_BASE_URL}/api/stores/check-partner-status?${queryParam}=${storeIdentifier}`);

// 修復後
const backendLang = getBackendLanguage(currentLanguage);
const response = await fetch(`${API_BASE_URL}/api/stores/check-partner-status?${queryParam}=${storeIdentifier}&lang=${backendLang}`);
```

#### B. 優先使用翻譯後的店名
```javascript
// 修復前
const displayStoreName = data.store_name || storeName;

// 修復後
const displayStoreName = data.translated_name || data.store_name || storeName;
```

### 2. 後端修復 (`../ordering-helper-backend/app/api/routes.py`)

#### A. 添加語言參數支援
```python
# 新增語言參數
target_language = request.args.get('lang', 'zh')
```

#### B. 使用翻譯功能
```python
# 使用翻譯功能取得翻譯後的店名
translated_store = translate_store_info_with_db_fallback(store, target_language)

# 在回應中包含翻譯後的店名
return jsonify({
    "store_id": store.store_id,
    "store_name": store.store_name,
    "translated_name": translated_store['translated_name'],  # 新增
    "place_id": store.place_id,
    "partner_level": store.partner_level,
    "is_partner": store.partner_level > 0,
    "has_menu": has_menu
})
```

## 修復的檔案

### 1. 前端檔案
- **`index.html`** (第 1000 行和第 1013 行)
  - 修復 API 呼叫時添加語言參數
  - 修復店家名稱顯示邏輯，優先使用翻譯後的店名

### 2. 後端檔案
- **`../ordering-helper-backend/app/api/routes.py`** (第 388-450 行)
  - 修復 `check-partner-status` API 支援語言參數
  - 修復 API 回應包含翻譯後的店名

## 預期結果

修復後，系統應該：
1. **正確傳遞語言參數**給後端 API
2. **正確顯示翻譯後的店名**在 LIFF 網頁中
3. **與 LINE 聊天摘要保持一致**的翻譯效果

## 驗證步驟

### 1. 檢查 API 請求
1. 打開瀏覽器開發者工具 → Network
2. 查看 `check-partner-status` API 請求是否包含 `?lang=en` 參數

### 2. 檢查 API 回應
1. 查看 API 回應是否包含 `translated_name` 欄位
2. 確認 `translated_name` 是翻譯後的店名

### 3. 檢查前端顯示
1. 英文介面應該顯示翻譯後的店名（如 "Main Athletes' Village"）
2. 中文介面應該顯示原始店名（如 "本家選手村"）

## 相關技術細節

### 語言代碼轉換
- 前端使用 `getBackendLanguage()` 函數將 `en-US` 轉換為 `en`
- 後端支援 `zh`, `en`, `ja`, `ko` 等語言代碼

### 翻譯優先級
1. **資料庫翻譯**：優先使用已儲存的翻譯
2. **AI 翻譯**：如果資料庫沒有，使用 AI 翻譯
3. **原始名稱**：如果翻譯失敗，使用原始店名

### 後端翻譯功能
- 使用 `translate_store_info_with_db_fallback()` 函數
- 支援資料庫翻譯和 AI 翻譯的 fallback 機制
- 自動處理翻譯失敗的情況

## 下一步建議

1. **測試多語言場景**：驗證不同語言設定下的顯示效果
2. **檢查翻譯品質**：確認 AI 翻譯的準確性
3. **優化翻譯快取**：考慮添加翻譯結果的快取機制
4. **監控翻譯使用**：追蹤翻譯 API 的使用情況和成本
