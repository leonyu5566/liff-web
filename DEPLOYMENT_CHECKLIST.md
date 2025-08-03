# Azure 靜態網站部署檢查清單 (GitHub Actions + Cloud Run)

## ✅ 前置準備

- [ ] Azure 帳戶已建立
- [ ] GitHub 帳戶已建立
- [ ] Cloud Run 後端已部署 (`https://ordering-helper-backend-1095766716155.asia-east1.run.app`)
- [ ] 專案檔案已準備完成

## ✅ GitHub Repository 設定

- [ ] GitHub repository 已建立
- [ ] 程式碼已推送到 GitHub
- [ ] 分支名稱為 `main`
- [ ] 所有必要檔案已包含：
  - [ ] `index.html`
  - [ ] `staticwebapp.config.json`
  - [ ] `.github/workflows/deploy.yml`
  - [ ] `package.json`

## ✅ Azure Static Web App 設定

- [ ] Azure Static Web App 已建立
- [ ] 已連接 GitHub repository
- [ ] 已設定正確的建置參數：
  - [ ] App location: `/`
  - [ ] Output location: `.`
  - [ ] Build preset: `Custom`

## ✅ GitHub Secrets 設定

- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` 已設定
- [ ] Token 權限正確
- [ ] Token 未過期

## ✅ 環境變數設定

- [ ] `VITE_API_BASE_URL` 已設定為 Cloud Run 網址
- [ ] `VITE_LIFF_ID` 已設定（或將在後續步驟設定）
- [ ] 環境變數已生效

## ✅ 後端 API 檢查

- [ ] Cloud Run 服務正常運行
- [ ] API 端點可正常存取
- [ ] CORS 設定正確
- [ ] 多語言支援完整（中文、英文、日文、韓文）
- [ ] 測試 API 端點：
  - [ ] `GET /api/stores` - 店家列表
  - [ ] `GET /api/menus/{store_id}` - 菜單資料
  - [ ] `POST /api/upload-menu-image` - 圖片上傳
  - [ ] `POST /api/orders` - 訂單建立

## ✅ LINE LIFF 設定

- [ ] LINE Developers Console 已設定
- [ ] LIFF App 已建立
- [ ] Endpoint URL 已設定為 Azure 網址
- [ ] Scope 已設定：`profile`, `openid`, `email`
- [ ] Bot link feature 已啟用
- [ ] LIFF ID 已取得並更新

## ✅ 安全性檢查

- [ ] HTTPS 已啟用
- [ ] Content Security Policy 已設定
- [ ] Cloud Run 後端網址已加入 CSP 允許清單
- [ ] 環境變數已正確設定
- [ ] 敏感資訊未暴露在前端程式碼中

## ✅ 效能檢查

- [ ] 網頁載入速度正常
- [ ] 圖片已優化
- [ ] CSS/JS 已壓縮
- [ ] 快取策略已設定
- [ ] Cloud Run 回應時間正常

## ✅ 功能測試

### 基本功能
- [ ] 網頁可正常載入
- [ ] LIFF 初始化成功
- [ ] 語言自動設定正常（中文、英文、日文、韓文）
- [ ] 店家選擇功能正常

### 菜單功能
- [ ] 合作店家菜單顯示正常（多語言支援）
- [ ] 非合作店家圖片上傳正常
- [ ] OCR 辨識功能正常（多語言翻譯）
- [ ] 菜單項目顯示正常

### 購物車功能
- [ ] 數量調整功能正常
- [ ] 總價計算正確
- [ ] 購物車狀態保持正常

### 訂單功能
- [ ] 訂單送出功能正常
- [ ] 訂單確認顯示正常
- [ ] 錯誤處理正常

## ✅ 跨平台測試

- [ ] 桌面版瀏覽器測試通過
- [ ] 手機版瀏覽器測試通過
- [ ] LINE 內建瀏覽器測試通過
- [ ] 不同螢幕尺寸適配正常

## ✅ 監控設定

- [ ] GitHub Actions 工作流程正常
- [ ] Azure Application Insights 已啟用（可選）
- [ ] 錯誤日誌已設定
- [ ] 效能監控已設定

## 🔧 故障排除

### GitHub Actions 問題
1. **部署失敗**
   - 檢查 `AZURE_STATIC_WEB_APPS_API_TOKEN` 是否正確
   - 確認 Azure Static Web App 已建立
   - 檢查工作流程檔案語法

2. **建置失敗**
   - 檢查 `package.json` 語法
   - 確認所有必要檔案存在
   - 檢查 Node.js 版本設定

### CORS 問題
1. **API 呼叫失敗**
   - 確認 Cloud Run 已設定 CORS
   - 檢查 `staticwebapp.config.json` 中的 CSP 設定
   - 確認後端網址正確

### LIFF 問題
1. **初始化失敗**
   - 確認 LIFF ID 正確
   - 檢查 Endpoint URL 是否正確
   - 確認 HTTPS 已啟用

## 📊 部署後檢查

### 自動化檢查
- [ ] GitHub Actions 部署成功
- [ ] Azure Static Web App 狀態正常
- [ ] 網頁可正常存取

### 手動測試
- [ ] 在 LINE 中開啟 LIFF 網頁
- [ ] 測試所有功能流程
- [ ] 確認使用者體驗良好

## 🎯 完成標準

當所有檢查項目都完成時，您的 LIFF 網頁就成功部署到 Azure 靜態網站了！

### 最終確認
- [ ] 網頁可在 LINE 中正常開啟
- [ ] 所有功能都正常運作
- [ ] 與 Cloud Run 後端整合正常
- [ ] 準備好進行生產環境使用

## 📞 支援

如果遇到問題，請參考：
- `GITHUB_DEPLOYMENT_GUIDE.md` - GitHub Actions 部署指南
- `DEPLOYMENT.md` - 詳細部署指南
- Azure 官方文件
- LINE Developers 文件
- Google Cloud Run 文件 