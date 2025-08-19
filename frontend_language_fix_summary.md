# 前端語言偵測與UI狀態切換修復總結

## 問題描述
前端出現「中文店名 + Preparing ordering environment」的問題，主要原因是：
1. **使用已棄用的 `liff.getLanguage()`** 而不是 `liff.getAppLanguage()`
2. **前端語言偵測與UI狀態切換沒有確實更新**
3. **後端回應失敗時前端沒有fallback**，導致卡在「準備中」狀態

## 修復內容

### 1. 修復 LIFF 語言偵測
**位置**: `index.html` 第 523-545 行

**修改前**:
```javascript
const fromLiff = (liffInitialized && typeof liff.getLanguage === 'function') ? liff.getLanguage() : null;
```

**修改後**:
```javascript
// 使用 liff.getAppLanguage() 替代已棄用的 getLanguage()
let fromLiff = null;
try {
    if (liffInitialized) {
        // 優先使用 getAppLanguage() (v2.24+)
        if (typeof liff.getAppLanguage === 'function') {
            fromLiff = await liff.getAppLanguage();
        } else if (typeof liff.getLanguage === 'function') {
            fromLiff = liff.getLanguage();
        }
    }
} catch (e) {
    console.warn('LIFF 語言偵測失敗:', e);
}
```

**影響**: 
- `pickUserLang()` 函數改為 async
- 調用處也需要加上 `await`

### 2. 修復店家狀態檢查的錯誤處理
**位置**: `index.html` 第 1000-1020 行

**新增功能**:
- 加入 cache buster (`&v=${Date.now()}`) 避免快取問題
- 加入 `Cache-Control: no-cache` header
- 在 HTTP 錯誤時立即更新狀態標籤，避免卡在「準備中」

**修改內容**:
```javascript
// 加上 cache buster 避免被快取住舊回應
const cacheBuster = `&v=${Date.now()}`;
const url = `${API_BASE_URL}/api/stores/check-partner-status?${queryParam}=${storeIdentifier}&lang=${backendLang}${cacheBuster}`;

const response = await fetch(url, { 
    credentials: 'omit',
    headers: {
        'Cache-Control': 'no-cache'
    }
});

if (!response.ok) {
    console.log(`店家合作狀態檢查失敗 (HTTP ${response.status})，立即切換到非合作店家介面`);
    // 立即更新狀態，避免卡在「準備中」
    const texts = translations[currentLanguage] || translations['zh-TW'];
    document.getElementById('store-type-badge').innerHTML = 
        `<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">${texts.nonPartnerStore}</span>`;
    showNonPartnerInterface(storeName, false);
    return;
}
```

### 3. 修復菜單載入的錯誤處理
**位置**: `index.html` 第 1100-1120 行

**新增功能**:
- 加入 cache buster
- 加入 `Cache-Control: no-cache` header
- 改善錯誤處理

### 4. 修復 showNonPartnerInterface 函數
**位置**: `index.html` 第 1180-1220 行

**新增功能**:
- 確保狀態標籤被正確更新（避免卡在「準備中」）
- 加入除錯日誌

**修改內容**:
```javascript
// 確保狀態標籤被正確更新（避免卡在「準備中」）
const storeTypeBadge = document.getElementById('store-type-badge');
const texts = translations[currentLanguage] || translations['zh-TW'];

if (isPartnerStore) {
    // 合作店家但沒有菜單
    storeTypeBadge.innerHTML = `<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">${texts.partnerStore}</span>`;
} else {
    // 非合作店家
    storeTypeBadge.innerHTML = `<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">${texts.nonPartnerStore}</span>`;
}
```

### 5. 修復 updateInterfaceLanguage 函數
**位置**: `index.html` 第 800-810 行

**修改內容**:
- 避免覆蓋已經設定好的合作/非合作狀態
- 只在顯示「準備中」狀態時才更新

### 6. 新增 Azure Static Web Apps 快取控制
**新增文件**: `staticwebapp.config.json`

**內容**:
```json
{
  "globalHeaders": {
    "cache-control": "no-cache, no-store, must-revalidate"
  },
  "routes": [
    {
      "route": "/*",
      "headers": {
        "cache-control": "no-cache"
      }
    },
    {
      "route": "/index.html",
      "headers": {
        "cache-control": "no-cache, no-store, must-revalidate"
      }
    }
  ]
}
```

## 測試檢查點

1. **語言偵測測試**:
   - 在 LINE App 內切換語言
   - 檢查 `console.log(await liff.getAppLanguage())` 是否回傳正確語言

2. **API 呼叫測試**:
   - 檢查 Network 面板中的 API 呼叫是否包含 `lang` 參數和 cache buster
   - 確認回傳的 `display_name` 是對應語言

3. **錯誤處理測試**:
   - 模擬 API 失敗，確認 UI 立即切換到非合作店家
   - 確認不會卡在「準備中」狀態

4. **快取測試**:
   - 刷新頁面，確認不會吃到舊版回應
   - 檢查 HTTP headers 是否包含 `Cache-Control: no-cache`

## 後端配合需求

為了完全解決問題，後端需要：

1. **`/api/stores/check-partner-status`** 端點：
   - 接受 `lang` 參數
   - 回傳 `display_name`（翻譯後的店名）
   - 回傳 `is_partner` 和 `has_menu` 狀態

2. **`/api/menu/*`** 端點：
   - 接受 `lang` 參數
   - 回傳翻譯後的菜單項目名稱

## 預期效果

修復後，前端應該：
- 正確偵測 LINE App 語言設定
- 在 API 失敗時立即切換到非合作店家介面
- 不會卡在「準備中」狀態
- 避免快取問題
