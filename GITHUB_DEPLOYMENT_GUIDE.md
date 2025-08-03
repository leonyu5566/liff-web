# GitHub Actions 自動部署指南

## 部署架構

```
GitHub Repository
       ↓
GitHub Actions Workflow
       ↓
Azure Static Web Apps
       ↓
Cloud Run Backend (https://ordering-helper-backend-1095766716155.asia-east1.run.app)
```

## 重要更新：語言處理流程

### 語言設定流程
1. **LINE Bot 階段**：使用者在 LINE Bot 中選擇語言
2. **LIFF 跳轉**：LINE Bot 將語言參數附加到 LIFF URL
3. **LIFF 網頁**：自動讀取語言參數並設定顯示語言

### URL 參數格式
```
https://your-static-app.azurestaticapps.net?lang=zh-TW  # 中文
https://your-static-app.azurestaticapps.net?lang=en-US  # 英文
https://your-static-app.azurestaticapps.net?lang=ja-JP  # 日文
https://your-static-app.azurestaticapps.net?lang=ko-KR  # 韓文
```

## 步驟 1：準備 GitHub Repository

### 1.1 建立 GitHub Repository
1. 前往 [GitHub](https://github.com)
2. 建立新的 repository
3. 將本地程式碼推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit: 點餐傳聲筒 LIFF 網頁 (移除語言選擇)"
git branch -M main
git remote add origin https://github.com/your-username/ordering-helper-liff.git
git push -u origin main
```

### 1.2 確認檔案結構
確保以下檔案存在：
- ✅ `index.html` - 主網頁檔案（已更新語言處理）
- ✅ `staticwebapp.config.json` - Azure 設定
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 工作流程
- ✅ `package.json` - 專案設定
- ✅ `test-language.html` - 語言參數測試檔案

## 步驟 2：建立 Azure Static Web App

### 2.1 使用 Azure Portal
1. 前往 [Azure Portal](https://portal.azure.com)
2. 搜尋 "Static Web Apps"
3. 點擊 "Create"
4. 填寫基本資訊：
   - **Resource Group**: `ordering-helper-rg`
   - **Name**: `ordering-helper-liff`
   - **Region**: `East Asia`
   - **Build Details**: 
     - Build Preset: `Custom`
     - App location: `/`
     - Output location: `.`

### 2.2 連接 GitHub
1. 在 "Source" 區段選擇 "GitHub"
2. 選擇您的 repository
3. 選擇 `main` 分支
4. 點擊 "Review + create"

## 步驟 3：設定 GitHub Secrets

### 3.1 取得 Azure Static Web Apps API Token
1. 在 Azure Portal 中開啟您的 Static Web App
2. 前往 "Configuration" → "Management tokens"
3. 點擊 "Generate" 建立新的 token
4. 複製 token 值

### 3.2 設定 GitHub Secrets
1. 前往您的 GitHub repository
2. 點擊 "Settings" → "Secrets and variables" → "Actions"
3. 點擊 "New repository secret"
4. 新增以下 secret：
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: 您剛才複製的 token

## 步驟 4：設定環境變數

### 4.1 在 Azure Portal 中設定
1. 前往您的 Static Web App
2. 點擊 "Configuration" → "Application settings"
3. 新增以下環境變數：

```
VITE_API_BASE_URL=https://ordering-helper-backend-1095766716155.asia-east1.run.app
VITE_LIFF_ID=your-liff-id
```

## 步驟 5：設定 LINE LIFF

### 5.1 建立 LIFF App
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇您的 Channel
3. 前往 "LIFF" 頁面
4. 點擊 "Add LIFF app"
5. 填寫資訊：
   - **LIFF App name**: 點餐傳聲筒
   - **Size**: Full
   - **Endpoint URL**: `https://your-static-app.azurestaticapps.net`
   - **Scope**: `profile`, `openid`, `email`
   - **Bot link feature**: 啟用

### 5.2 更新 LIFF ID
1. 複製獲得的 LIFF ID
2. 在 Azure Portal 中更新 `VITE_LIFF_ID` 環境變數
3. 或者直接更新 `index.html` 中的 `LIFF_ID` 常數

## 步驟 6：LINE Bot 整合

### 6.1 語言參數處理
在您的 LINE Bot 中，建立 LIFF 連結時需要加上語言參數：

```python
# Python 範例
def create_liff_url(user_language):
    base_url = "https://your-static-app.azurestaticapps.net"
    return f"{base_url}?lang={user_language}"

# 使用範例
liff_url = create_liff_url('zh-TW')  # 中文
liff_url = create_liff_url('en-US')  # 英文
liff_url = create_liff_url('ja-JP')  # 日文
liff_url = create_liff_url('ko-KR')  # 韓文
```

### 6.2 發送 LIFF 訊息
```python
# 發送 LIFF 訊息範例
def send_liff_message(user_id, language):
    liff_url = create_liff_url(language)
    
    message = {
        "type": "flex",
        "altText": "點餐傳聲筒",
        "contents": {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "點擊下方按鈕開始點餐",
                        "weight": "bold",
                        "size": "lg"
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "uri",
                            "label": "開始點餐",
                            "uri": liff_url
                        }
                    }
                ]
            }
        }
    }
    
    line_bot_api.push_message(user_id, message)
```

## 步驟 7：測試部署

### 7.1 觸發部署
1. 推送程式碼到 GitHub：
```bash
git add .
git commit -m "Update language handling - remove language selection UI"
git push origin main
```

2. 檢查 GitHub Actions：
   - 前往您的 repository
   - 點擊 "Actions" 標籤
   - 查看部署狀態

### 7.2 測試功能
1. 使用 `test-language.html` 測試不同語言版本（中文、英文、日文、韓文）
2. 在 LINE 中發送訊息給您的 Bot
3. 點擊 LIFF 連結
4. 確認網頁正常載入並顯示正確語言

## 故障排除

### 常見問題

1. **GitHub Actions 失敗**
   - 檢查 `AZURE_STATIC_WEB_APPS_API_TOKEN` 是否正確
   - 確認 Azure Static Web App 已建立
   - 檢查工作流程檔案語法

2. **CORS 錯誤**
   - 確認 Cloud Run 已設定 CORS
   - 檢查 `staticwebapp.config.json` 中的 CSP 設定
   - 確認後端網址正確

3. **LIFF 初始化失敗**
   - 確認 LIFF ID 正確
   - 檢查 Endpoint URL 是否正確
   - 確認 HTTPS 已啟用

4. **語言參數未生效**
   - 檢查 URL 參數格式是否正確
   - 確認 JavaScript 語言處理邏輯
   - 檢查瀏覽器開發者工具中的錯誤

### 檢查清單

- [ ] GitHub repository 已建立並推送程式碼
- [ ] Azure Static Web App 已建立並連接 GitHub
- [ ] GitHub Secrets 已設定
- [ ] 環境變數已設定
- [ ] LIFF App 已建立
- [ ] LIFF ID 已更新
- [ ] 語言參數測試通過
- [ ] 部署成功
- [ ] 功能測試通過

## 監控和維護

### 自動部署
- 每次推送到 `main` 分支都會觸發自動部署
- 可以在 GitHub Actions 中查看部署日誌
- 可以在 Azure Portal 中查看應用程式日誌

### 更新程式碼
```bash
# 修改程式碼後
git add .
git commit -m "Update feature"
git push origin main
# 自動觸發部署
```

## 成本估算

- **Azure Static Web Apps**: 免費（每月 100GB 流量）
- **GitHub Actions**: 免費（每月 2000 分鐘）
- **總計**: 免費（開發階段）

## 下一步

1. 完善 LINE Bot 功能
2. 設定資料庫
3. 優化使用者體驗
4. 監控應用程式效能 