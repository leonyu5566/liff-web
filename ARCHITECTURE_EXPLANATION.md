# 🏗️ 架構說明：LIFF、前端、後端的關係

## 📋 整體架構圖

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LINE App      │    │   LIFF 容器     │    │   您的網頁      │
│                 │    │                 │    │  (index.html)   │
│ 用戶點擊 LIFF   │───▶│ 載入您的網頁    │───▶│ 顯示點餐介面    │
│ 連結            │    │ (需要 LIFF_ID)  │    │ (需要 API_URL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │   後端 API      │
                                               │ (Cloud Run)     │
                                               │                 │
                                               │ 處理菜單資料    │
                                               │ 處理訂單        │
                                               │ 處理 OCR        │
                                               └─────────────────┘
```

## 🎯 各組件的作用

### 1. **LINE App**
- 用戶在 LINE 中看到 LIFF 連結
- 點擊後開啟 LIFF 容器

### 2. **LIFF 容器**
- 由 LINE 提供的網頁容器
- 載入您的網頁
- 提供 LINE 用戶資料
- 需要 LIFF_ID 來識別

### 3. **您的網頁 (index.html)**
- 部署在網路上（例如：GitHub Pages、Netlify）
- 包含點餐介面
- 需要 LIFF_ID 來初始化 LIFF SDK
- 需要 API_BASE_URL 來呼叫後端

### 4. **後端 API**
- 處理業務邏輯
- 提供菜單資料
- 處理訂單
- 處理 OCR 辨識

---

## 🔧 設定流程

### 步驟 1：部署您的網頁
```bash
# 將您的網頁部署到網域
# 例如：https://your-domain.com/index.html
```

### 步驟 2：設定 LIFF
1. 在 LINE Developers Console 建立 LIFF App
2. 設定 Endpoint URL 為您的網域
3. 取得 LIFF_ID

### 步驟 3：更新程式碼
```javascript
// 在 index.html 中更新
const LIFF_ID = '您的實際 LIFF ID';
const API_BASE_URL = '您的後端 API 網址';
```

### 步驟 4：測試
- 使用 LIFF URL 測試：`https://liff.line.me/YOUR-LIFF-ID`

---

## 🤔 常見疑問

### Q: 為什麼需要 LIFF_ID？
A: LIFF_ID 是用來初始化 LIFF SDK，讓您的網頁可以：
- 取得用戶資料
- 關閉 LIFF 視窗
- 與 LINE 環境互動

### Q: 為什麼需要 API_BASE_URL？
A: API_BASE_URL 是您的後端服務網址，用來：
- 取得菜單資料
- 提交訂單
- 處理 OCR 辨識

### Q: 我的網頁部署在哪裡？
A: 您的網頁可以部署在：
- GitHub Pages
- Netlify
- Vercel
- 任何支援 HTTPS 的網域

### Q: LIFF 和我的網頁是什麼關係？
A: LIFF 就像一個特殊的瀏覽器，載入您的網頁。您的網頁需要 LIFF SDK 來與 LINE 環境互動。

---

## 📱 實際使用流程

### 1. 用戶在 LINE 中點擊連結
```
https://liff.line.me/YOUR-LIFF-ID
```

### 2. LIFF 載入您的網頁
```
https://your-domain.com/index.html
```

### 3. 您的網頁初始化 LIFF
```javascript
await liff.init({ liffId: LIFF_ID });
```

### 4. 您的網頁呼叫後端 API
```javascript
const response = await fetch(`${API_BASE_URL}/api/menus/${storeId}`);
```

### 5. 後端回傳資料
```javascript
const data = await response.json();
```

---

## 🎯 總結

- **LIFF_ID**: 用來初始化 LIFF SDK
- **API_BASE_URL**: 用來呼叫您的後端服務
- **您的網頁**: 部署在網路上，包含點餐介面
- **LIFF 容器**: 由 LINE 提供，載入您的網頁

這是一個完整的前後端分離架構！ 