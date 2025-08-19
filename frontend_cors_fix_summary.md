# 前端 CORS 修復總結

## 問題描述

根據後端日誌分析，發現以下問題：

1. **CORS 預檢問題**：`/api/stores/check-partner-status` 只收到 OPTIONS 請求，沒有後續的 GET 請求
2. **上傳菜單照片 500 錯誤**：可能是回傳資料過大或包含不可序列化物件
3. **合作店家顯示為 Non-Partner**：由於 CORS 問題導致前端無法正確獲取店家狀態

## 修復內容

### 1. 修復 check-partner-status API 請求

**位置**：`index.html` 第 1026-1035 行

**修復前**：
```javascript
const response = await fetch(url, { 
    credentials: 'omit',
    headers: {
        'Cache-Control': 'no-cache'
    }
});
```

**修復後**：
```javascript
const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        // 僅在有值時再加，避免 "undefined" 被送進去害預檢失敗
        ...(currentLanguage && {'X-LIFF-User-Lang': currentLanguage}),
        ...(currentUserId && {'X-LIFF-User-Id': currentUserId}),
    },
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit'
});
```

### 2. 修復 upload-menu-image API 請求

**位置**：`index.html` 第 1472-1480 行

**修復前**：
```javascript
const response = await fetch(`${API_BASE_URL}/api/upload-menu-image`, {
    method: 'POST',
    body: formData
});
```

**修復後**：
```javascript
const response = await fetch(`${API_BASE_URL}/api/upload-menu-image`, {
    method: 'POST',
    headers: {
        // 不設定 Content-Type，讓瀏覽器自動設定 multipart/form-data 的 boundary
        'Accept': 'application/json',
        // 僅在有值時再加，避免 "undefined" 被送進去害預檢失敗
        ...(currentLanguage && {'X-LIFF-User-Lang': currentLanguage}),
        ...(currentUserId && {'X-LIFF-User-Id': currentUserId}),
        ...(storeId && {'X-Store-Id': storeId}),
    },
    mode: 'cors',
    body: formData
});
```

### 3. 修復 loadPartnerStoreMenu API 請求

**位置**：`index.html` 第 1200-1210 行

**修復前**：
```javascript
const response = await fetch(apiEndpoint, {
    credentials: 'omit',
    headers: {
        'Cache-Control': 'no-cache'
    }
});
```

**修復後**：
```javascript
const response = await fetch(apiEndpoint, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        // 僅在有值時再加，避免 "undefined" 被送進去害預檢失敗
        ...(currentLanguage && {'X-LIFF-User-Lang': currentLanguage}),
        ...(currentUserId && {'X-LIFF-User-Id': currentUserId}),
    },
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit'
});
```

### 4. 修復 translate API 請求

**位置**：`index.html` 第 582-590 行 和 第 1151-1160 行

**修復前**：
```javascript
const res = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...})
});
```

**修復後**：
```javascript
const res = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 僅在有值時再加，避免 "undefined" 被送進去害預檢失敗
        ...(currentLanguage && {'X-LIFF-User-Lang': currentLanguage}),
        ...(currentUserId && {'X-LIFF-User-Id': currentUserId}),
    },
    mode: 'cors',
    body: JSON.stringify({...})
});
```

### 5. 修復 orders API 請求

**位置**：`index.html` 第 1878-1885 行

**修復前**：
```javascript
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
});
```

**修復後**：
```javascript
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 僅在有值時再加，避免 "undefined" 被送進去害預檢失敗
        ...(currentLanguage && {'X-LIFF-User-Lang': currentLanguage}),
        ...(currentUserId && {'X-LIFF-User-Id': currentUserId}),
        ...(currentStore && {'X-Store-Id': currentStore}),
    },
    mode: 'cors',
    body: JSON.stringify(payload)
});
```

## 修復重點

### 1. 明確指定 HTTP Method
- 所有 GET 請求都明確指定 `method: 'GET'`
- 所有 POST 請求都明確指定 `method: 'POST'`

### 2. 正確的 Headers 設定
- 添加 `Accept: 'application/json'` 表示期望 JSON 回應
- 添加 `mode: 'cors'` 明確指定 CORS 模式
- 使用條件式 headers 避免傳送 `undefined` 值

### 3. 避免 undefined Headers
- 使用 `...(condition && {'Header-Name': value})` 語法
- 只有在值存在時才添加 header，避免 CORS 預檢失敗

### 4. 統一的錯誤處理
- 所有 fetch 請求都使用相同的錯誤處理模式
- 添加適當的 console.log 用於除錯

## 預期效果

1. **解決 CORS 預檢問題**：瀏覽器應該能正確發送 GET 請求到 `/api/stores/check-partner-status`
2. **正確顯示合作店家狀態**：前端應該能正確識別合作店家並顯示相應介面
3. **改善上傳菜單穩定性**：減少因 CORS 問題導致的上傳失敗
4. **統一的 API 請求格式**：所有 API 請求都使用一致的格式和錯誤處理

## 後端配合需求

為了完全解決問題，後端也需要相應的 CORS 設定：

```python
from flask_cors import CORS

CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization",
                    "X-LIFF-User-Lang", "X-LIFF-User-Id",
                    "X-Store-Id"],
     supports_credentials=False)
```

## 測試建議

1. 開啟瀏覽器 DevTools → Network 標籤
2. 重新載入頁面，檢查 `check-partner-status` 請求
3. 確認請求方法為 GET，且 Response Headers 包含正確的 CORS 設定
4. 測試上傳菜單照片功能
5. 檢查合作店家是否能正確顯示為 Partner Store
