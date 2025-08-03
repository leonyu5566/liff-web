# ✅ LIFF 設定檢查清單

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
  - [ ] Channel description: `點餐系統 LIFF 應用程式`
  - [ ] App type: `Web app`
  - [ ] Category: `Food & Beverage`
  - [ ] Email address: 填入您的信箱

### Channel 設定
- [ ] 設定 Callback URL 為您的 HTTPS 網域
- [ ] 勾選 Scope: `profile`
- [ ] 勾選 Scope: `chat_message.write`

---

## 🎯 步驟 2：LIFF 應用程式

### 建立 LIFF App
- [ ] 在 Channel 中點擊 "LIFF" 分頁
- [ ] 點擊 "Add LIFF App"
- [ ] 填寫 LIFF 設定：
  - [ ] LIFF App name: `點餐傳聲筒`
  - [ ] Size: `Full`
  - [ ] View: 選擇您的網頁 URL
  - [ ] Endpoint URL: 您的 HTTPS 網域
  - [ ] Scope: 勾選 `profile`
  - [ ] Scope: 勾選 `chat_message.write`

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
- [ ] 確認可以發送訂單訊息

### 錯誤檢查
- [ ] 檢查瀏覽器 Console 是否有錯誤
- [ ] 確認 LIFF ID 格式正確
- [ ] 確認網域為 HTTPS
- [ ] 確認 Callback URL 設定正確

---

## 🎯 步驟 6：手機測試

### LINE App 測試
- [ ] 在手機 LINE App 中開啟 LIFF URL
- [ ] 確認所有功能正常運作
- [ ] 測試點餐流程
- [ ] 測試發送訊息功能

---

## 🎯 步驟 7：正式部署

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

### 無法發送訊息
- [ ] Scope 中是否勾選 `chat_message.write`？
- [ ] 用戶是否已登入 LIFF？
- [ ] 是否在 LINE 環境中測試？

### 無法取得用戶資料
- [ ] Scope 中是否勾選 `profile`？
- [ ] 用戶是否已授權？

---

## 🎉 完成檢查

如果所有項目都已勾選，恭喜您！您的 LIFF 應用程式已經設定完成，可以在 LINE 中正常運作了。

### 下一步建議
1. 完善後端 API 功能
2. 加入更多點餐功能
3. 優化使用者體驗
4. 加入分析追蹤

---

## 📞 需要幫助？

如果遇到問題，請檢查：
- 瀏覽器開發者工具的 Console 錯誤
- LINE Developers Console 的設定
- 網路連線和 HTTPS 憑證 