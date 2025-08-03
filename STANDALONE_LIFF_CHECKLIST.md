# ✅ 獨立 LIFF 應用程式檢查清單

## 📋 前置檢查

- [ ] 已建立 LINE Developers 帳號
- [ ] 已建立 Provider
- [ ] 已準備好 HTTPS 網域（或 ngrok URL）

---

## 🎯 步驟 1：LINE Login Channel

### 建立 Channel
- [ ] 登入 [LINE Developers Console](https://developers.line.biz/)
- [ ] 點擊 Provider
- [ ] 點擊 "Create Channel"
- [ ] 選擇 "LINE Login"
- [ ] 填寫 Channel 資訊：
  - [ ] Channel name: `點餐傳聲筒`
  - [ ] Channel description: `獨立點餐系統`
  - [ ] App type: `Web app`
  - [ ] Category: `Food & Beverage`
  - [ ] Email address: 填入您的信箱

### Channel 設定
- [ ] 設定 Callback URL 為您的 HTTPS 網域
- [ ] 勾選 Scope: `profile` (只需要這個)

---

## 🎯 步驟 2：LIFF 應用程式

### 建立 LIFF App
- [ ] 在 Channel 中點擊 "LIFF" 分頁
- [ ] 點擊 "Add LIFF App"
- [ ] 填寫 LIFF 設定：
  - [ ] LIFF App name: `點餐傳聲筒`
  - [ ] Size: `Full`
  - [ ] Endpoint URL: 您的 HTTPS 網域
  - [ ] Scope: 只勾選 `profile`

### 取得 LIFF ID
- [ ] 複製 LIFF ID（格式：`1234567890-abcdefgh`）
- [ ] 複製 LIFF URL（格式：`https://liff.line.me/1234567890-abcdefgh`）

---

## 🎯 步驟 3：程式碼更新

### 更新 LIFF ID
- [ ] 開啟 `index.html`
- [ ] 找到第 117 行：`const LIFF_ID = 'your-liff-id';`
- [ ] 替換為：`const LIFF_ID = '您的實際 LIFF ID';`

### 或使用自動更新腳本
```bash
node update-liff-id.js YOUR-LIFF-ID
```

---

## 🎯 步驟 4：本地測試

### 啟動本地伺服器
- [ ] 執行：`python3 -m http.server 8000`
- [ ] 或執行：`npm start`

### 建立 HTTPS 隧道
- [ ] 安裝 ngrok（如果還沒安裝）
- [ ] 執行：`ngrok http 8000`
- [ ] 複製 HTTPS URL（例如：`https://abc123.ngrok.io`）

### 更新 LINE Developers 設定
- [ ] 將 ngrok URL 加入 Channel 的 Callback URL
- [ ] 更新 LIFF App 的 Endpoint URL

---

## 🎯 步驟 5：功能測試

### 基本功能測試
- [ ] 使用 LIFF URL 開啟應用程式
- [ ] 確認 LIFF 初始化成功
- [ ] 確認可以取得用戶資料
- [ ] 確認可以載入菜單
- [ ] 確認可以點餐
- [ ] 確認可以提交訂單
- [ ] 確認顯示訂單確認頁面

### 手機測試
- [ ] 在手機 LINE App 中開啟 LIFF URL
- [ ] 確認所有功能正常運作
- [ ] 測試完整點餐流程

---

## 🎯 步驟 6：正式部署

### 選擇部署平台
- [ ] GitHub Pages
- [ ] Netlify
- [ ] Vercel
- [ ] Azure Static Web Apps

### 更新設定
- [ ] 部署到 HTTPS 網域
- [ ] 更新 LINE Developers 中的 Endpoint URL
- [ ] 測試正式環境

---

## 🔍 常見問題檢查

### LIFF 初始化失敗
- [ ] LIFF ID 是否正確？
- [ ] 網域是否為 HTTPS？
- [ ] 網域是否在 Callback URL 中？

### 無法取得用戶資料
- [ ] Scope 中是否勾選 `profile`？
- [ ] 用戶是否已授權？

### 訂單提交失敗
- [ ] 後端 API 是否正常運作？
- [ ] 網路連線是否正常？

---

## 🎉 完成檢查

如果所有項目都已勾選，恭喜您！您的獨立 LIFF 應用程式已經設定完成。

### 與其他團隊的整合
您可以將 LIFF URL 提供給負責 LINE Bot 的團隊：
```
https://liff.line.me/YOUR-LIFF-ID
```

他們可以在 Bot 中加入這個連結，讓用戶點擊後開啟您的點餐系統。

---

## 📞 需要幫助？

如果遇到問題，請檢查：
- 瀏覽器開發者工具的 Console 錯誤
- LINE Developers Console 的設定
- 網路連線和 HTTPS 憑證
- 後端 API 的連線狀態 