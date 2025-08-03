# Azure 靜態網站手動部署指南

## 前置需求

1. **Azure 帳戶**：需要有有效的 Azure 訂閱
2. **Azure CLI**：已安裝並登入
3. **Git**：已安裝並設定

## 步驟 1：安裝 Azure CLI

### macOS
```bash
brew install azure-cli
```

### Windows
```bash
winget install Microsoft.AzureCLI
```

### Linux
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

## 步驟 2：登入 Azure

```bash
az login
```

瀏覽器會開啟，請登入您的 Azure 帳戶。

## 步驟 3：設定預設訂閱

```bash
# 查看所有訂閱
az account list --output table

# 設定預設訂閱
az account set --subscription "your-subscription-id"
```

## 步驟 4：執行部署腳本

```bash
# 執行自動部署腳本
./azure-deploy.sh
```

或者手動執行以下命令：

```bash
# 設定變數
RESOURCE_GROUP="ordering-helper-rg"
LOCATION="eastasia"
STATIC_WEB_APP_NAME="ordering-helper-liff"

# 建立資源群組
az group create --name $RESOURCE_GROUP --location $LOCATION

# 建立 Static Web App
az staticwebapp create \
    --name $STATIC_WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source . \
    --location $LOCATION \
    --branch main \
    --app-location "/" \
    --output-location "."
```

## 步驟 5：設定環境變數

1. 前往 [Azure Portal](https://portal.azure.com)
2. 搜尋您的 Static Web App
3. 點擊「Configuration」→「Application settings」
4. 新增以下環境變數：

```
VITE_API_BASE_URL=https://your-backend.azurewebsites.net
VITE_LIFF_ID=your-liff-id
```

## 步驟 6：設定 LIFF

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇您的 Channel
3. 進入 LIFF 頁面
4. 新增 LIFF App：
   - **LIFF App name**: 點餐傳聲筒
   - **Size**: Full
   - **Endpoint URL**: `https://your-static-app.azurestaticapps.net`
   - **Scope**: `profile`, `openid`, `email`
   - **Bot link feature**: 啟用

## 步驟 7：更新程式碼

將獲得的 LIFF ID 更新到 `index.html` 中：

```javascript
const LIFF_ID = 'your-actual-liff-id';
```

## 步驟 8：測試部署

1. 在 LINE 中發送訊息給您的 Bot
2. 點擊 LIFF 連結
3. 確認網頁正常載入

## 故障排除

### 常見問題

1. **權限錯誤**
   ```bash
   # 檢查權限
   az role assignment list --assignee your-email@domain.com
   ```

2. **資源群組已存在**
   ```bash
   # 刪除現有資源群組
   az group delete --name ordering-helper-rg --yes
   ```

3. **Static Web App 名稱已存在**
   ```bash
   # 使用不同的名稱
   STATIC_WEB_APP_NAME="ordering-helper-liff-$(date +%s)"
   ```

### 查看部署狀態

```bash
# 查看 Static Web App 狀態
az staticwebapp show --name ordering-helper-liff --resource-group ordering-helper-rg

# 查看部署日誌
az staticwebapp log show --name ordering-helper-liff --resource-group ordering-helper-rg
```

## 成本估算

- **Static Web Apps**: 免費（每月 100GB 流量）
- **總計**: 約 $0/月（開發階段）

## 下一步

部署完成後，您需要：

1. 設定後端 API 服務
2. 設定資料庫
3. 設定 LINE Bot
4. 測試完整流程

詳細說明請參考 `DEPLOYMENT.md`。 