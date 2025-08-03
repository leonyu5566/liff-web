# 本地測試指南

## 測試環境設定

### 1. 啟動本地伺服器

```bash
# 安裝依賴（如果需要）
npm install

# 啟動本地伺服器
npm run dev
# 或
npx live-server --port=3000
```

### 2. 開啟測試頁面

在瀏覽器中開啟：
- **主測試頁面**: `http://localhost:3000/local-test.html`
- **語言測試頁面**: `http://localhost:3000/test-language.html`
- **主應用程式**: `http://localhost:3000/index.html`

## 測試項目

### 1. 語言支援測試

#### 測試四種語言版本：
- **中文**: `http://localhost:3000/index.html?lang=zh-TW`
- **英文**: `http://localhost:3000/index.html?lang=en-US`
- **日文**: `http://localhost:3000/index.html?lang=ja-JP`
- **韓文**: `http://localhost:3000/index.html?lang=ko-KR`

#### 測試步驟：
1. 開啟 `local-test.html`
2. 點擊不同語言版本的測試連結
3. 確認語言參數正確傳遞
4. 檢查內容是否正確顯示

### 2. API 連線測試

#### 後端 API 資訊：
- **API 網址**: `https://ordering-helper-backend-1095766716155.asia-east1.run.app`
- **測試端點**:
  - `GET /api/stores` - 店家列表
  - `GET /api/menus/{store_id}?lang={language}` - 菜單資料
  - `POST /api/orders` - 訂單建立
  - `POST /api/upload-menu-image` - 圖片上傳

#### 測試步驟：
1. 開啟 `local-test.html`
2. 點擊 "測試店家 API" 按鈕
3. 點擊 "測試菜單 API" 按鈕
4. 點擊 "測試訂單 API" 按鈕
5. 檢查測試結果

### 3. 功能測試

#### 基本功能測試：
- [ ] 頁面載入正常
- [ ] 語言參數讀取正確
- [ ] 店家列表顯示正常
- [ ] 菜單項目顯示正常
- [ ] 購物車功能正常
- [ ] 訂單送出功能正常

#### 多語言功能測試：
- [ ] 中文內容正確顯示
- [ ] 英文內容正確顯示
- [ ] 日文內容正確顯示
- [ ] 韓文內容正確顯示

#### 響應式設計測試：
- [ ] 桌面版顯示正常
- [ ] 手機版顯示正常
- [ ] 不同螢幕尺寸適配

## 設定資訊

### 後端設定
```javascript
API_BASE_URL: 'https://ordering-helper-backend-1095766716155.asia-east1.run.app'
```

### LINE Bot 設定
```javascript
LINE_CHANNEL_ACCESS_TOKEN: 'eDgiF6xfUzTZofyrW5BwYT0OVvknrBsqQCvKzOfxmFuHpvbyUUNmbNw0bNcATajouZHo44C8GwHdCDre1Pa0dY+Z0M8oWH51Z7zMZdvOavbp5exwf54VyNZHoCS7EW8mD7UT7pDjsWe0SnypUaj6iwdB04t89/1O/w1cDnyilFU='
LINE_CHANNEL_SECRET: 'a144f8ec17ba0a8695b4bda127770cf3'
```

### 支援的語言
```javascript
SUPPORTED_LANGUAGES: ['zh-TW', 'en-US', 'ja-JP', 'ko-KR']
```

## 故障排除

### 常見問題

1. **API 連線失敗**
   - 檢查網路連線
   - 確認後端服務是否正常運行
   - 檢查 CORS 設定

2. **語言參數未生效**
   - 檢查 URL 參數格式
   - 確認 JavaScript 語言處理邏輯
   - 檢查瀏覽器開發者工具

3. **頁面載入失敗**
   - 確認本地伺服器是否啟動
   - 檢查檔案路徑是否正確
   - 確認瀏覽器支援

4. **字體顯示問題**
   - 確認 Google Fonts 是否正確載入
   - 檢查網路連線
   - 確認字體設定

### 測試檢查清單

#### 基本測試
- [ ] 本地伺服器正常啟動
- [ ] 所有頁面可正常載入
- [ ] API 連線測試通過
- [ ] 語言參數測試通過

#### 功能測試
- [ ] 店家選擇功能正常
- [ ] 菜單顯示功能正常
- [ ] 購物車功能正常
- [ ] 訂單送出功能正常

#### 多語言測試
- [ ] 中文版本測試通過
- [ ] 英文版本測試通過
- [ ] 日文版本測試通過
- [ ] 韓文版本測試通過

#### 響應式測試
- [ ] 桌面版測試通過
- [ ] 手機版測試通過
- [ ] 不同螢幕尺寸測試通過

## 下一步

本地測試通過後，可以進行：

1. **GitHub 部署測試**
   - 推送程式碼到 GitHub
   - 測試 GitHub Actions 部署
   - 確認 Azure Static Web Apps 部署成功

2. **LINE Bot 整合測試**
   - 設定 LIFF ID
   - 測試 LINE Bot 與 LIFF 整合
   - 測試完整的使用流程

3. **生產環境測試**
   - 測試 Azure 部署版本
   - 測試 Cloud Run 後端整合
   - 測試實際使用場景

## 測試工具

### 瀏覽器開發者工具
- **Console**: 查看 JavaScript 錯誤
- **Network**: 監控 API 請求
- **Elements**: 檢查 HTML 結構
- **Application**: 檢查本地儲存

### 測試工具
- **Postman**: API 測試
- **Chrome DevTools**: 前端除錯
- **Live Server**: 本地開發伺服器 