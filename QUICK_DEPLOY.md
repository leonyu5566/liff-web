# 🚀 快速部署指南 - 點餐傳聲筒 LIFF 網頁

## 5分鐘快速部署到 Azure

### 步驟 1：準備環境
```bash
# 安裝 Azure CLI (如果還沒安裝)
brew install azure-cli  # macOS
# 或
winget install Microsoft.AzureCLI  # Windows

# 登入 Azure
az login
```

### 步驟 2：執行部署
```bash
# 執行自動部署腳本
./azure-deploy.sh
```

### 步驟 3：設定 LIFF
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新的 LIFF App
3. 設定 Endpoint URL 為您的 Azure 網址
4. 複製 LIFF ID

### 步驟 4：更新設定
在 Azure Portal 中設定環境變數：
- `VITE_LIFF_ID`: 您的 LIFF ID
- `VITE_API_BASE_URL`: 您的後端 API 網址

### 步驟 5：測試
在 LINE 中測試您的 LIFF 網頁！

## 🎯 完成！

您的點餐傳聲筒 LIFF 網頁現在已經部署到 Azure 靜態網站了！

### 網頁特色
- ✅ 多語言支援 (中文/英文/日文)
- ✅ 響應式設計
- ✅ 購物車功能
- ✅ 圖片辨識菜單
- ✅ LINE 整合

### 下一步
1. 設定後端 API 服務
2. 設定資料庫
3. 完善 LINE Bot 功能
4. 測試完整流程

## 📞 需要幫助？

- 查看 `DEPLOYMENT.md` 獲取詳細指南
- 查看 `DEPLOYMENT_CHECKLIST.md` 進行檢查
- 查看 `azure-deploy-manual.md` 進行手動部署 