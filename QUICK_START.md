# 🚀 快速開始 - 本地測試

## 立即開始測試

### 步驟 1：啟動本地伺服器

```bash
# 使用自動腳本啟動
./start-test-server.sh

# 或手動啟動
npx live-server --port=3000 --open=/local-test.html
```

### 步驟 2：開啟測試頁面

伺服器啟動後，瀏覽器會自動開啟：
- **主測試頁面**: `http://localhost:3000/local-test.html`
- **語言測試頁面**: `http://localhost:3000/test-language.html`
- **主應用程式**: `http://localhost:3000/index.html`

## 📋 快速測試清單

### 1. 基本功能測試 (5分鐘)
- [ ] 開啟 `local-test.html` 測試頁面
- [ ] 點擊 "測試店家 API" 按鈕
- [ ] 點擊 "測試菜單 API" 按鈕
- [ ] 點擊 "測試訂單 API" 按鈕
- [ ] 確認所有 API 測試通過

### 2. 多語言測試 (5分鐘)
- [ ] 點擊 "中文版本測試" 連結
- [ ] 點擊 "English Version Test" 連結
- [ ] 點擊 "日本語版テスト" 連結
- [ ] 點擊 "한국어 버전 테스트" 連結
- [ ] 確認所有語言版本正常顯示

### 3. 主應用程式測試 (10分鐘)
- [ ] 開啟 `index.html?lang=zh-TW`
- [ ] 選擇一個店家
- [ ] 測試購物車功能
- [ ] 測試訂單送出功能
- [ ] 測試其他語言版本

## 🔧 設定資訊

### 後端 API
```
網址: https://ordering-helper-backend-1095766716155.asia-east1.run.app
```

### LINE Bot 設定
```
Channel Access Token: eDgiF6xfUzTZofyrW5BwYT0OVvknrBsqQCvKzOfxmFuHpvbyUUNmbNw0bNcATajouZHo44C8GwHdCDre1Pa0dY+Z0M8oWH51Z7zMZdvOavbp5exwf54VyNZHoCS7EW8mD7UT7pDjsWe0SnypUaj6iwdB04t89/1O/w1cDnyilFU=
Channel Secret: a144f8ec17ba0a8695b4bda127770cf3
```

### 支援的語言
- 中文 (`zh-TW`)
- 英文 (`en-US`)
- 日文 (`ja-JP`)
- 韓文 (`ko-KR`)

## 🎯 測試重點

### API 連線測試
- 確認後端服務正常運行
- 確認 API 回應正確
- 確認錯誤處理正常

### 多語言功能測試
- 確認語言參數正確傳遞
- 確認內容正確翻譯
- 確認字體正確顯示

### 功能完整性測試
- 確認店家選擇功能
- 確認菜單顯示功能
- 確認購物車功能
- 確認訂單送出功能

## 📊 測試結果

### 如果所有測試通過 ✅
- 本地環境設定正確
- 後端 API 連線正常
- 多語言功能正常
- 可以進行下一步部署

### 如果發現問題 ❌
- 檢查 `TEST_CHECKLIST.md` 故障排除部分
- 查看瀏覽器開發者工具 Console
- 檢查網路連線
- 確認後端服務狀態

## 📞 下一步

本地測試完成後：

1. **GitHub 部署**
   - 推送程式碼到 GitHub
   - 設定 GitHub Actions
   - 部署到 Azure Static Web Apps

2. **LINE Bot 整合**
   - 設定 LIFF ID
   - 測試 LINE Bot 整合
   - 測試完整使用流程

3. **生產環境測試**
   - 測試 Azure 部署版本
   - 測試實際使用場景
   - 監控應用程式效能

## 🆘 需要幫助？

- 查看 `LOCAL_TEST_GUIDE.md` 獲取詳細指南
- 查看 `TEST_CHECKLIST.md` 進行完整測試
- 查看 `LANGUAGE_SUPPORT.md` 了解多語言支援
- 查看 `GITHUB_DEPLOYMENT_GUIDE.md` 了解部署流程 