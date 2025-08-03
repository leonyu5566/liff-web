# 點餐傳聲筒 LIFF 網頁

這是點餐傳聲筒的 LIFF (LINE Front-end Framework) 網頁應用程式。

## 功能特色

- 🍽️ **語音點餐**：支援語音辨識點餐
- 🌍 **多語言支援**：中文、英文、日文
- 📱 **響應式設計**：適配各種裝置
- 🛒 **購物車功能**：直觀的數量調整
- 📸 **圖片辨識**：上傳菜單照片自動辨識
- 🔗 **LINE 整合**：完整的 LIFF 功能

## 技術架構

- **前端框架**：原生 HTML/CSS/JavaScript
- **UI 框架**：Tailwind CSS
- **字體**：Google Fonts (Inter + Noto Sans TC)
- **圖示**：Font Awesome
- **部署**：Azure Static Web Apps

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

## 部署到 Azure

### 方法一：使用 Azure CLI

```bash
# 安裝 Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# 登入 Azure
az login

# 建立靜態網站
az staticwebapp create --name ordering-helper-liff --source .

# 部署
az staticwebapp deploy --name ordering-helper-liff --source .
```

### 方法二：使用 GitHub Actions

1. 將程式碼推送到 GitHub
2. 在 Azure Portal 建立 Static Web App
3. 連接 GitHub 儲存庫
4. 設定自動部署

## 環境變數

在 Azure Static Web Apps 中設定以下環境變數：

```bash
# 後端 API 網址
VITE_API_BASE_URL=https://your-backend.azurewebsites.net

# LIFF ID
VITE_LIFF_ID=your-liff-id
```

## API 端點

網頁會呼叫以下後端 API：

- `GET /api/stores` - 取得店家列表
- `GET /api/stores/{id}` - 取得特定店家資訊
- `GET /api/menus/{store_id}` - 取得店家菜單
- `POST /api/upload-menu-image` - 上傳菜單圖片
- `POST /api/orders` - 建立訂單

## 檔案結構

```
liff-web/
├── index.html          # 主頁面
├── assets/             # 靜態資源
│   ├── css/
│   ├── js/
│   └── images/
├── package.json        # 專案設定
└── README.md          # 說明文件
```

## 注意事項

1. **CORS 設定**：後端需要允許前端網域的跨域請求
2. **LIFF ID**：需要在 LINE Developers Console 中設定正確的 LIFF ID
3. **HTTPS**：Azure Static Web Apps 自動提供 HTTPS
4. **快取**：靜態資源會自動快取，更新時需要清除快取

## 聯絡資訊

如有問題，請聯絡開發團隊。

---

## 🚀 最新更新

- ✅ 新增架構說明文件
- ✅ 新增純靜態版本
- ✅ 更新 LIFF SDK 版本
- ✅ 新增團隊協作指南
- ✅ 完整的設定檢查清單 