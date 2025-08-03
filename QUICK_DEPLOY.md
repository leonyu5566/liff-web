# 🚀 快速部署指南

## 📋 本地測試

### 1. 啟動本地伺服器
```bash
# 使用 Python 內建伺服器
python3 -m http.server 8000

# 或使用 npm
npm start
```

### 2. 建立 HTTPS 隧道
```bash
# 安裝 ngrok (如果還沒安裝)
# macOS: brew install ngrok
# Windows: 下載 ngrok.com

# 建立 HTTPS 隧道
ngrok http 8000
```

### 3. 取得 HTTPS URL
ngrok 會顯示類似這樣的 URL：
```
https://abc123.ngrok.io
```

---

## 🔧 LINE Developers 設定

### 1. 建立 LINE Login Channel
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新的 **LINE Login** Channel
3. 設定 Callback URL 為您的 ngrok URL

### 2. 建立 LIFF App
1. 在 Channel 中點擊 **LIFF** 分頁
2. 點擊 **Add LIFF App**
3. 填寫設定：
   - **LIFF App name**: `點餐傳聲筒`
   - **Size**: `Full`
   - **Endpoint URL**: `https://abc123.ngrok.io` (您的 ngrok URL)
   - **Scope**: 勾選 `profile` 和 `chat_message.write`

### 3. 取得 LIFF ID
建立完成後，複製 LIFF ID（格式：`1234567890-abcdefgh`）

---

## 🔄 更新程式碼

### 更新 LIFF ID
在 `index.html` 第 117 行：
```javascript
const LIFF_ID = '您的實際 LIFF ID';
```

---

## 🧪 測試流程

### 1. 測試 LIFF URL
使用您的 LIFF URL 測試：
```
https://liff.line.me/YOUR-LIFF-ID
```

### 2. 測試功能
- ✅ 登入功能
- ✅ 載入菜單
- ✅ 點餐功能
- ✅ 發送訂單訊息

---

## 🚀 正式部署

### 選項 1：GitHub Pages
1. 將程式碼推送到 GitHub
2. 在 Repository 設定中啟用 GitHub Pages
3. 使用 GitHub Pages URL 更新 LIFF 設定

### 選項 2：Netlify
1. 將程式碼推送到 GitHub
2. 連接 Netlify 到您的 GitHub Repository
3. 使用 Netlify URL 更新 LIFF 設定

### 選項 3：Vercel
1. 將程式碼推送到 GitHub
2. 連接 Vercel 到您的 GitHub Repository
3. 使用 Vercel URL 更新 LIFF 設定

---

## 🔍 除錯技巧

### 檢查 Console 錯誤
1. 開啟瀏覽器開發者工具
2. 查看 Console 分頁的錯誤訊息
3. 常見錯誤：
   - LIFF ID 錯誤
   - 網域不在 Callback URL 中
   - HTTPS 憑證問題

### 測試 LIFF 狀態
在瀏覽器 Console 中執行：
```javascript
console.log('LIFF 狀態:', liff.isLoggedIn());
console.log('用戶資料:', await liff.getProfile());
```

---

## 📱 手機測試

### 在 LINE App 中測試
1. 使用 LIFF URL 在 LINE 中開啟
2. 確認所有功能正常運作
3. 測試發送訊息功能

---

## 🎉 完成！

設定完成後，您的點餐系統就可以在 LINE 中正常運作了！

如果遇到問題，請檢查：
- LIFF ID 是否正確
- 網域是否為 HTTPS
- Callback URL 是否設定正確
- Scope 是否包含必要權限 