# Azure 靜態網頁部署指南

## 📋 部署步驟

### 步驟 1: 準備 GitHub 儲存庫

1. **建立 GitHub 儲存庫**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **確保檔案結構**
   ```
   your-repo/
   ├── index.html
   ├── staticwebapp.config.json
   ├── .github/workflows/azure-deploy.yml
   └── README.md
   ```

### 步驟 2: 建立 Azure 靜態網頁應用程式

1. **登入 Azure Portal**
   - 前往 https://portal.azure.com
   - 登入您的 Azure 帳戶

2. **建立靜態網頁應用程式**
   - 搜尋 "Static Web Apps"
   - 點擊 "建立"
   - 填寫基本資訊：
     - **訂用帳戶**: 選擇您的訂用帳戶
     - **資源群組**: 建立新的或選擇現有的
     - **名稱**: `ordering-helper-frontend`
     - **區域**: `East Asia` (建議)
     - **建置詳細資料**: 選擇 "Skip build step"
     - **來源**: 選擇 "GitHub"

3. **連接 GitHub**
   - 選擇您的 GitHub 帳戶
   - 選擇儲存庫
   - 選擇分支 (main)
   - 點擊 "建立"

### 步驟 3: 設定 LINE Bot 和 LIFF

1. **建立 LINE Bot**
   - 前往 https://developers.line.biz/
   - 建立新的 Provider
   - 建立新的 Messaging API Channel
   - 記錄 Channel Secret 和 Channel Access Token

2. **建立 LIFF 應用程式**
   - 在 LINE Developers Console 中
   - 前往您的 Bot
   - 點擊 "LIFF" 標籤
   - 點擊 "Add LIFF app"
   - 填寫資訊：
     - **LIFF app name**: `點餐傳聲筒`
     - **Size**: `Full`
     - **Endpoint URL**: `https://YOUR_AZURE_DOMAIN.azurestaticapps.net`
     - **Scope**: 勾選 `profile` 和 `chat_message.write`
     - **Bot link feature**: 啟用

3. **記錄 LIFF ID**
   - 複製 LIFF ID (格式: `1234567890-abcdefgh`)

### 步驟 4: 更新程式碼

1. **更新 LIFF ID**
   ```javascript
   // 在 index.html 中
   const LIFF_ID = 'YOUR_ACTUAL_LIFF_ID'; // 替換為您的 LIFF ID
   ```

2. **確認後端 URL**
   ```javascript
   // 在 index.html 中
   const API_BASE_URL = 'https://ordering-helper-backend-1095766716155.asia-east1.run.app';
   ```

### 步驟 5: 設定 GitHub Secrets

1. **取得 Azure 部署 Token**
   - 在 Azure Portal 中
   - 前往您的靜態網頁應用程式
   - 點擊 "管理部署 Token"
   - 複製 Token

2. **設定 GitHub Secrets**
   - 前往您的 GitHub 儲存庫
   - 點擊 Settings > Secrets and variables > Actions
   - 點擊 "New repository secret"
   - 名稱: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - 值: 貼上剛才複製的 Token

### 步驟 6: 部署

1. **推送程式碼**
   ```bash
   git add .
   git commit -m "Update LIFF ID and deploy to Azure"
   git push origin main
   ```

2. **檢查部署狀態**
   - 前往 GitHub Actions 標籤
   - 查看部署進度
   - 等待部署完成

3. **取得部署 URL**
   - 在 Azure Portal 中
   - 前往您的靜態網頁應用程式
   - 複製 URL (格式: `https://YOUR_APP_NAME.azurestaticapps.net`)

### 步驟 7: 測試整合

1. **測試 LIFF 應用程式**
   - 在 LINE Developers Console 中
   - 測試 LIFF 應用程式
   - 確認可以正常載入

2. **測試 LINE Bot 整合**
   - 在 LINE 中搜尋您的 Bot
   - 發送訊息測試
   - 確認可以開啟 LIFF 應用程式

## 🔧 故障排除

### 常見問題

1. **CORS 錯誤**
   - 確認 `staticwebapp.config.json` 中的 CSP 設定
   - 確認後端允許來自 Azure 網域的請求

2. **LIFF 初始化失敗**
   - 確認 LIFF ID 正確
   - 確認 Endpoint URL 正確
   - 確認 Scope 設定正確

3. **API 呼叫失敗**
   - 確認後端 URL 正確
   - 確認後端服務正常運作
   - 檢查網路連線

### 除錯步驟

1. **檢查瀏覽器開發者工具**
   - 開啟 F12
   - 查看 Console 錯誤
   - 查看 Network 請求

2. **檢查 Azure 日誌**
   - 在 Azure Portal 中
   - 前往靜態網頁應用程式
   - 查看 "Functions" 日誌

3. **檢查 GitHub Actions 日誌**
   - 前往 GitHub Actions
   - 查看部署日誌
   - 確認部署成功

## 📞 支援

如果遇到問題，請檢查：

1. **Azure 靜態網頁文件**: https://docs.microsoft.com/azure/static-web-apps/
2. **LINE LIFF 文件**: https://developers.line.biz/docs/liff/
3. **GitHub Actions 文件**: https://docs.github.com/actions

## 🎉 完成

部署完成後，您的應用程式將可以：

- ✅ 透過 Azure 靜態網頁服務提供服務
- ✅ 與 LINE Bot 整合
- ✅ 支援多語言
- ✅ 處理合作和非合作店家
- ✅ 支援 OCR 菜單辨識
- ✅ 完整的點餐流程

---

*部署時間: 2024年1月*  
*版本: 1.0.0* 