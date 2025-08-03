# Azure 靜態網站部署指南

## 部署架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LINE Bot      │    │  LIFF 網頁      │    │  Flask 後端     │
│                 │    │  (Azure 靜態)   │    │  (Azure App)    │
│ - 處理訊息      │    │ - 點餐介面      │    │ - API 端點      │
│ - 回覆用戶      │    │ - 購物車        │    │ - 資料庫操作    │
│ - 發送 LIFF     │    │ - 語音辨識      │    │ - 訂單處理      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌─────────────────┐
                         │   LINE 平台     │
                         │ - LIFF 管理     │
                         │ - Webhook       │
                         └─────────────────┘
```

## 步驟 1：準備 Azure 環境

### 1.1 安裝 Azure CLI
```bash
# macOS
brew install azure-cli

# Windows
winget install Microsoft.AzureCLI

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 1.2 登入 Azure
```bash
az login
```

### 1.3 設定預設訂閱
```bash
az account set --subscription "your-subscription-id"
```

## 步驟 2：部署 LIFF 網頁到 Azure Static Web Apps

### 2.1 建立 Static Web App
```bash
# 建立資源群組
az group create --name ordering-helper-rg --location eastasia

# 建立 Static Web App
az staticwebapp create \
  --name ordering-helper-liff \
  --resource-group ordering-helper-rg \
  --source . \
  --location eastasia \
  --branch main \
  --app-location "/" \
  --output-location "."
```

### 2.2 設定環境變數
在 Azure Portal 中設定以下環境變數：

```bash
# 後端 API 網址
VITE_API_BASE_URL=https://your-backend.azurewebsites.net

# LIFF ID
VITE_LIFF_ID=your-liff-id
```

### 2.3 設定自訂網域（可選）
```bash
# 新增自訂網域
az staticwebapp hostname add \
  --name ordering-helper-liff \
  --resource-group ordering-helper-rg \
  --hostname your-domain.com
```

## 步驟 3：部署後端到 Azure App Service

### 3.1 建立 App Service Plan
```bash
az appservice plan create \
  --name ordering-helper-plan \
  --resource-group ordering-helper-rg \
  --sku B1 \
  --is-linux
```

### 3.2 建立 Web App
```bash
az webapp create \
  --name ordering-helper-backend \
  --resource-group ordering-helper-rg \
  --plan ordering-helper-plan \
  --runtime "PYTHON:3.11"
```

### 3.3 設定環境變數
```bash
az webapp config appsettings set \
  --name ordering-helper-backend \
  --resource-group ordering-helper-rg \
  --settings \
    DB_HOST=your-db-host \
    DB_USERNAME=your-db-username \
    DB_PASSWORD=your-db-password \
    DB_NAME=your-db-name \
    LINE_CHANNEL_ACCESS_TOKEN=your-line-token \
    LINE_CHANNEL_SECRET=your-line-secret \
    GEMINI_API_KEY=your-gemini-key
```

### 3.4 部署程式碼
```bash
# 使用 Azure CLI 部署
az webapp deployment source config-zip \
  --resource-group ordering-helper-rg \
  --name ordering-helper-backend \
  --src your-app.zip

# 或使用 Git 部署
az webapp deployment source config \
  --resource-group ordering-helper-rg \
  --name ordering-helper-backend \
  --repo-url https://github.com/your-username/ordering-helper-backend \
  --branch main
```

## 步驟 4：設定 LINE LIFF

### 4.1 在 LINE Developers Console 中設定 LIFF

1. 登入 [LINE Developers Console](https://developers.line.biz/)
2. 選擇您的 Channel
3. 進入 LIFF 頁面
4. 新增 LIFF App：
   - **LIFF App name**: 點餐傳聲筒
   - **Size**: Full
   - **Endpoint URL**: `https://your-static-app.azurestaticapps.net`
   - **Scope**: `profile`, `openid`, `email`
   - **Bot link feature**: 啟用

### 4.2 更新 LIFF ID
將獲得的 LIFF ID 更新到前端程式碼中：

```javascript
const LIFF_ID = 'your-actual-liff-id';
```

## 步驟 5：設定資料庫

### 5.1 建立 Azure Database for MySQL
```bash
az mysql flexible-server create \
  --name ordering-helper-db \
  --resource-group ordering-helper-rg \
  --admin-user your-admin \
  --admin-password your-password \
  --sku-name Standard_B1s \
  --tier Burstable \
  --storage-size 20 \
  --version 8.0.21
```

### 5.2 建立資料庫
```bash
az mysql flexible-server db create \
  --resource-group ordering-helper-rg \
  --server-name ordering-helper-db \
  --database-name ordering_helper
```

### 5.3 設定防火牆規則
```bash
# 允許 Azure 服務存取
az mysql flexible-server firewall-rule create \
  --resource-group ordering-helper-rg \
  --name ordering-helper-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## 步驟 6：設定 CI/CD（可選）

### 6.1 建立 GitHub Actions 工作流程

建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "."
```

## 步驟 7：測試部署

### 7.1 測試 LIFF 網頁
1. 在 LINE 中發送訊息給您的 Bot
2. 點擊 LIFF 連結
3. 確認網頁正常載入

### 7.2 測試 API 端點
```bash
# 測試店家 API
curl https://your-backend.azurewebsites.net/api/stores

# 測試訂單 API
curl -X POST https://your-backend.azurewebsites.net/api/orders \
  -H "Content-Type: application/json" \
  -d '{"store_id": 1, "items": []}'
```

## 監控和維護

### 監控工具
- **Azure Application Insights**: 監控應用程式效能
- **Azure Monitor**: 監控資源使用情況
- **Azure Log Analytics**: 集中化日誌管理

### 備份策略
- **資料庫備份**: 自動每日備份
- **程式碼備份**: 使用 Git 版本控制
- **設定備份**: 匯出 Azure 資源設定

### 成本優化
- **使用免費層**: 開發階段使用免費服務
- **自動關閉**: 非營業時間自動關閉資源
- **監控使用量**: 定期檢查資源使用情況

## 故障排除

### 常見問題

1. **CORS 錯誤**
   - 檢查後端 CORS 設定
   - 確認前端網域已加入允許清單

2. **資料庫連線失敗**
   - 檢查防火牆規則
   - 確認資料庫憑證正確

3. **LIFF 初始化失敗**
   - 確認 LIFF ID 正確
   - 檢查網域設定

4. **API 呼叫失敗**
   - 檢查網路連線
   - 確認 API 端點正確

### 日誌查看
```bash
# 查看 Web App 日誌
az webapp log tail --name ordering-helper-backend --resource-group ordering-helper-rg

# 查看 Static Web App 日誌
az staticwebapp log show --name ordering-helper-liff --resource-group ordering-helper-rg
```

## 安全性考量

1. **HTTPS**: 所有流量都使用 HTTPS
2. **環境變數**: 敏感資訊使用環境變數
3. **防火牆**: 限制資料庫存取
4. **定期更新**: 保持依賴套件最新

## 成本估算

### 每月預估成本（開發階段）
- **Static Web Apps**: 免費（每月 100GB 流量）
- **App Service**: 免費（F1 層）
- **Database for MySQL**: 免費（Basic 層）
- **總計**: 約 $0-10/月

### 生產環境成本
- **Static Web Apps**: $0-50/月
- **App Service**: $13-100/月
- **Database for MySQL**: $25-200/月
- **總計**: 約 $40-350/月 