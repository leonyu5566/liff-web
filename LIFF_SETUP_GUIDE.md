# 🚀 LIFF 設定完整指南

## 📋 前置需求

在開始之前，請確保您已經：
- 有 LINE Developers 帳號
- 已建立 Provider（如果沒有，請先建立一個）

---

## 🎯 步驟 1：建立 LINE Login Channel

### 1.1 登入 LINE Developers Console
- 前往 [LINE Developers Console](https://developers.line.biz/)
- 使用您的 LINE 帳號登入

### 1.2 建立 LINE Login Channel
1. 點擊您的 Provider
2. 點擊 **「Create Channel」**
3. 選擇 **「LINE Login」**
4. 填寫以下資訊：
   - **Channel name**: `點餐傳聲筒` (或您喜歡的名稱)
   - **Channel description**: `點餐系統 LIFF 應用程式`
   - **App type**: 選擇 **「Web app」**
   - **Category**: 選擇 **「Food & Beverage」**
   - **Email address**: 填入您的聯絡信箱

### 1.3 設定 Channel
建立完成後，在 Channel 設定中：
- **Callback URL**: `https://your-domain.com` (您的網域)
- **Scope**: 勾選 `profile` 和 `chat_message.write`

---

## 🎯 步驟 2：建立 LIFF 應用程式

### 2.1 新增 LIFF App
1. 在您的 LINE Login Channel 中
2. 點擊 **「LIFF」** 分頁
3. 點擊 **「Add LIFF App」**

### 2.2 填寫 LIFF 設定
```
LIFF App name: 點餐傳聲筒
Size: Full
View: 選擇您的網頁 URL
Endpoint URL: https://your-domain.com
Scope: 
  - profile
  - chat_message.write
```

### 2.3 取得 LIFF ID
建立完成後，您會看到：
- **LIFF ID**: `1234567890-abcdefgh` (範例)
- **LIFF URL**: `https://liff.line.me/1234567890-abcdefgh`

---

## 🎯 步驟 3：更新程式碼

### 3.1 更新 LIFF ID
在 `index.html` 第 117 行，將：
```javascript
const LIFF_ID = 'your-liff-id';
```
替換為：
```javascript
const LIFF_ID = '您的實際 LIFF ID';
```

### 3.2 測試 LIFF 功能
1. 部署您的網頁到 HTTPS 網域
2. 使用 LIFF URL 測試功能
3. 確認可以正常登入和發送訊息

---

## 🔧 常見問題解決

### Q: 為什麼看不到 LIFF 分頁？
A: 確保您建立的是 **LINE Login Channel**，不是 Messaging API Channel。

### Q: LIFF 初始化失敗？
A: 檢查：
- LIFF ID 是否正確
- 網域是否為 HTTPS
- 網域是否在 Callback URL 中

### Q: 無法發送訊息？
A: 確認：
- Scope 中已勾選 `chat_message.write`
- 用戶已登入 LIFF

---

## 📱 測試流程

1. **本地測試**：
   ```bash
   # 使用 ngrok 建立 HTTPS 隧道
   ngrok http 8000
   ```

2. **更新 Callback URL**：
   - 將 ngrok URL 加入 Channel 的 Callback URL

3. **測試 LIFF URL**：
   - 使用 `https://liff.line.me/YOUR-LIFF-ID` 測試

---

## 🎉 完成！

設定完成後，您的 LIFF 應用程式就可以：
- ✅ 在 LINE 中開啟
- ✅ 取得用戶資料
- ✅ 發送訊息給用戶
- ✅ 關閉 LIFF 視窗

如果遇到任何問題，請檢查瀏覽器開發者工具的 Console 錯誤訊息。 