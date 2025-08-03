# 🚀 獨立 LIFF 應用程式設定指南

## 📋 適用情境

如果您只負責 LIFF 網頁應用程式，不需要 LINE Bot 整合，這個指南適合您！

### ✅ 您可以做的：
- 建立獨立的 LIFF 應用程式
- 在 LINE 中開啟網頁
- 取得用戶基本資料
- 提供點餐介面
- 儲存訂單資料

### ❌ 不需要的：
- LINE Bot 設定
- Messaging API
- 自動回覆訊息

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
   - **Channel name**: `點餐傳聲筒`
   - **Channel description**: `獨立點餐系統`
   - **App type**: 選擇 **「Web app」**
   - **Category**: 選擇 **「Food & Beverage」**
   - **Email address**: 填入您的聯絡信箱

### 1.3 設定 Channel
建立完成後，在 Channel 設定中：
- **Callback URL**: `https://your-domain.com` (您的網域)
- **Scope**: 只需要勾選 `profile` (不需要 `chat_message.write`)

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
  - profile (只需要這個)
```

### 2.3 取得 LIFF ID
建立完成後，您會看到：
- **LIFF ID**: `1234567890-abcdefgh` (範例)
- **LIFF URL**: `https://liff.line.me/1234567890-abcdefgh`

---

## 🎯 步驟 3：修改程式碼

### 3.1 移除 Bot 相關功能
在 `index.html` 中，我們需要移除發送訊息的功能，改為儲存到後端或顯示確認頁面。

### 3.2 更新 LIFF ID
在 `index.html` 第 117 行，將：
```javascript
const LIFF_ID = 'your-liff-id';
```
替換為：
```javascript
const LIFF_ID = '您的實際 LIFF ID';
```

### 3.3 修改訂單提交邏輯
將原本發送 LINE 訊息的邏輯改為：
- 儲存到後端資料庫
- 顯示確認頁面
- 關閉 LIFF 視窗

---

## 🎯 步驟 4：本地測試

### 4.1 啟動本地伺服器
```bash
# 使用 Python 內建伺服器
python3 -m http.server 8000

# 或使用 npm
npm start
```

### 4.2 建立 HTTPS 隧道
```bash
# 安裝 ngrok (如果還沒安裝)
# macOS: brew install ngrok
# Windows: 下載 ngrok.com

# 建立 HTTPS 隧道
ngrok http 8000
```

### 4.3 更新設定
- 將 ngrok URL 加入 Channel 的 Callback URL
- 更新 LIFF App 的 Endpoint URL

---

## 🎯 步驟 5：測試功能

### 5.1 基本功能測試
- ✅ 使用 LIFF URL 開啟應用程式
- ✅ 確認 LIFF 初始化成功
- ✅ 確認可以取得用戶資料
- ✅ 確認可以載入菜單
- ✅ 確認可以點餐
- ✅ 確認可以提交訂單

### 5.2 手機測試
- ✅ 在手機 LINE App 中開啟 LIFF URL
- ✅ 確認所有功能正常運作

---

## 🔧 程式碼修改建議

### 移除 Bot 訊息發送
將原本的 `liff.sendMessages()` 改為：

```javascript
// 儲存訂單到後端
const orderData = {
    user_id: liff.getProfile().userId,
    store_id: currentStore,
    items: orderItems,
    total_amount: total,
    language: currentLanguage
};

// 發送到後端 API
await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
});

// 顯示確認頁面
showOrderConfirmation(orderData);
```

### 新增確認頁面
```javascript
function showOrderConfirmation(orderData) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="text-center py-20">
            <div class="text-6xl mb-4">✅</div>
            <h1 class="text-2xl font-bold text-gray-800 mb-4">訂單已確認！</h1>
            <p class="text-gray-600 mb-8">感謝您的訂購，我們會盡快為您準備餐點。</p>
            <button onclick="liff.closeWindow()" class="bg-blue-600 text-white px-6 py-3 rounded-lg">
                關閉視窗
            </button>
        </div>
    `;
}
```

---

## 🎉 完成！

設定完成後，您的獨立 LIFF 應用程式就可以：
- ✅ 在 LINE 中開啟
- ✅ 取得用戶資料
- ✅ 提供點餐介面
- ✅ 儲存訂單資料
- ✅ 顯示確認頁面

### 與其他團隊的整合
您可以將 LIFF URL 提供給負責 LINE Bot 的團隊，讓他們在 Bot 中加入連結到您的 LIFF 應用程式。

---

## 📞 需要幫助？

如果遇到問題，請檢查：
- LIFF ID 是否正確
- 網域是否為 HTTPS
- Callback URL 是否設定正確
- Scope 是否包含 `profile` 