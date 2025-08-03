# LIFF 點餐網頁測試指南

## 🚀 快速開始

### 1. 啟動模擬後端
```bash
npm install
npm start
```
模擬後端將在 `http://localhost:3001` 運行

### 2. 啟動前端測試頁面
```bash
python3 -m http.server 8000
```
前端測試頁面將在 `http://localhost:8000` 運行

## 📋 測試流程

### 測試 1: 合作店家流程
1. 開啟 `http://localhost:8000/local-test.html`
2. 設定參數：
   - 店家 ID: `1`
   - 店家名稱: `王阿嬤臭豆腐`
   - 語言: `中文`
   - 合作狀態: `合作店家`
3. 點擊「測試合作店家」
4. 檢查測試結果
5. 在 LIFF 預覽中查看實際效果

### 測試 2: 非合作店家流程
1. 在測試頁面設定：
   - 店家 ID: `999`
   - 店家名稱: `路邊攤`
   - 語言: `English`
   - 合作狀態: `非合作店家`
2. 點擊「測試非合作店家」
3. 檢查測試結果
4. 在 LIFF 預覽中測試 OCR 功能

## 🔗 測試 URL 範例

### 合作店家測試
```
http://localhost:8000/index.html?store_id=1&store_name=王阿嬤臭豆腐&lang=zh-TW&partner=true
```

### 非合作店家測試
```
http://localhost:8000/index.html?store_id=999&store_name=路邊攤&lang=en-US&partner=false
```

### 多語言測試
```
# 中文
http://localhost:8000/index.html?store_id=1&store_name=王阿嬤臭豆腐&lang=zh-TW&partner=true

# 英文
http://localhost:8000/index.html?store_id=1&store_name=Grandma Wang's&lang=en-US&partner=true

# 日文
http://localhost:8000/index.html?store_id=1&store_name=王おばあちゃん&lang=ja-JP&partner=true

# 韓文
http://localhost:8000/index.html?store_id=1&store_name=왕 할머니&lang=ko-KR&partner=true
```

## 🧪 API 端點測試

### 健康檢查
```bash
curl -X GET "http://localhost:3001/api/health"
```

### 店家列表
```bash
curl -X GET "http://localhost:3001/api/stores"
```

### 菜單查詢
```bash
curl -X GET "http://localhost:3001/api/menus/1?lang=zh-TW"
```

### OCR 測試
```bash
curl -X POST "http://localhost:3001/api/upload-menu-image" \
  -F "image=@test-image.jpg" \
  -F "lang=zh-TW" \
  -F "store_id=999"
```

### 訂單建立
```bash
curl -X POST "http://localhost:3001/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "language": "zh-TW",
    "items": [
      {"menu_item_id": 101, "quantity": 2, "price": 60},
      {"menu_item_id": 102, "quantity": 1, "price": 50}
    ]
  }'
```

## 📊 預期結果

### 合作店家模式
- ✅ 直接載入結構化菜單
- ✅ 支援多語言顯示
- ✅ 購物車功能正常
- ✅ 訂單送出成功

### 非合作店家模式
- ✅ 顯示 OCR 上傳介面
- ✅ 圖片上傳功能
- ✅ OCR 辨識結果顯示
- ✅ 動態生成菜單
- ✅ 購物車功能正常

## 🔧 故障排除

### 後端連線失敗
1. 確認模擬後端是否啟動：`curl http://localhost:3001/api/health`
2. 檢查防火牆設定
3. 確認端口 3001 未被佔用

### 前端無法載入
1. 確認 HTTP 伺服器是否啟動
2. 檢查瀏覽器控制台錯誤
3. 確認 CORS 設定正確

### LIFF 初始化失敗
1. 這是正常的，因為我們在本地測試
2. 正式環境需要設定正確的 LIFF ID
3. 本地測試時可以忽略 LIFF 相關錯誤

## 📝 測試檢查清單

- [ ] 模擬後端正常啟動
- [ ] 前端測試頁面可正常訪問
- [ ] 合作店家菜單載入正常
- [ ] 非合作店家 OCR 功能正常
- [ ] 多語言支援正常
- [ ] 購物車功能正常
- [ ] 訂單送出功能正常
- [ ] 錯誤處理機制正常

## 🎯 下一步

完成本地測試後，可以：
1. 部署到 Azure Static Web Apps
2. 設定正式的 Cloud Run 後端
3. 配置 LINE Bot 整合
4. 進行端到端測試 