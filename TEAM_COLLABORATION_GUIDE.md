# 🤝 團隊協作指南：前端開發者 vs LINE Bot 開發者

## 📋 分工架構

### 前端開發者（您）負責：
- ✅ 點餐系統網頁開發
- ✅ 部署到公開 HTTPS 網域
- ✅ 整合 LIFF SDK
- ✅ 提供網頁 URL 給組員

### LINE Bot 開發者（組員）負責：
- ✅ 在 LINE Developers Console 設定 LIFF
- ✅ 提供 LIFF ID 給您
- ✅ 在 LINE Bot 中嵌入 LIFF 連結

---

## 🚀 協作流程

### 步驟 1：前端開發者準備網頁

#### 1.1 確保網頁符合 LIFF 要求
- ✅ **HTTPS 網域**：必須使用 HTTPS
- ✅ **公開可存取**：網頁必須可以從外部存取
- ✅ **響應式設計**：適配手機螢幕
- ✅ **LIFF SDK 整合**：可選但強烈建議

#### 1.2 部署網頁
```bash
# 部署到 GitHub Pages
git push origin main

# 或部署到其他平台
# - Netlify
# - Vercel
# - Heroku
# - AWS S3
```

#### 1.3 取得網頁 URL
```
https://your-domain.com/index.html
```

### 步驟 2：提供 URL 給組員
將您的網頁 URL 提供給負責 LINE Bot 的組員：
```
網頁 URL: https://your-domain.com/index.html
```

### 步驟 3：組員設定 LIFF

#### 3.1 登入 LINE Developers Console
- 前往 [LINE Developers Console](https://developers.line.biz/)
- 選擇或建立 LINE Channel

#### 3.2 建立 LIFF App
1. 在 Channel 中點擊 **LIFF** 分頁
2. 點擊 **Add LIFF App**
3. 填寫設定：
   - **LIFF App 名稱**：`點餐傳聲筒`
   - **Endpoint URL**：`https://your-domain.com/index.html`
   - **Scope**：勾選 `profile`（如果需要用戶資料）
   - **Bot link feature**：啟用（如果需要與 Bot 連結）

#### 3.3 取得 LIFF ID
建立完成後，組員會得到：
- **LIFF ID**：`1234567890-abcdefgh`
- **LIFF URL**：`https://liff.line.me/1234567890-abcdefgh`

### 步驟 4：組員提供 LIFF ID 給您

組員將 LIFF ID 提供給您：
```
LIFF ID: 1234567890-abcdefgh
```

### 步驟 5：更新您的程式碼

在 `index.html` 中更新 LIFF ID：
```javascript
const LIFF_ID = '1234567890-abcdefgh'; // 組員提供的 LIFF ID
```

### 步驟 6：重新部署網頁

更新程式碼後重新部署：
```bash
git add .
git commit -m "feat: 更新 LIFF ID"
git push origin main
```

### 步驟 7：組員在 LINE Bot 中使用

組員可以在 LINE Bot 中嵌入 LIFF URL：
```
https://liff.line.me/1234567890-abcdefgh
```

---

## 🔧 技術細節

### LIFF SDK 整合
```html
<!-- 引入 LIFF SDK -->
<script charset="utf-8" src="https://static.line-scdn.net/liff/sdk/v2/sdk.js"></script>

<script>
// 初始化 LIFF
window.onload = function() {
    liff.init({
        liffId: '您的 LIFF ID' // 由組員提供
    })
    .then(() => {
        console.log('LIFF init success');
        // 取得用戶資料
        if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
                console.log('用戶名稱:', profile.displayName);
            });
        }
    })
    .catch((err) => {
        console.error('LIFF init failed', err);
    });
};
</script>
```

### 可選的 LIFF 功能
```javascript
// 取得用戶資料
const profile = await liff.getProfile();
console.log('用戶 ID:', profile.userId);
console.log('用戶名稱:', profile.displayName);
console.log('用戶頭像:', profile.pictureUrl);

// 發送訊息到 LINE 聊天室
await liff.sendMessages([
    {
        type: 'text',
        text: '訂單已確認！'
    }
]);

// 關閉 LIFF 視窗
liff.closeWindow();
```

---

## 📱 測試流程

### 1. 本地測試
```bash
# 啟動本地伺服器
python3 -m http.server 8000

# 使用 ngrok 建立 HTTPS 隧道
ngrok http 8000
```

### 2. 更新 LIFF 設定
- 將 ngrok URL 加入 LIFF 的 Endpoint URL
- 測試 LIFF 功能

### 3. 正式部署
- 部署到正式網域
- 更新 LIFF 設定
- 在 LINE 中測試

---

## 🎯 重要提醒

### 前端開發者注意事項：
1. **網頁必須是 HTTPS**
2. **網頁必須公開可存取**
3. **響應式設計很重要**
4. **LIFF SDK 版本要正確**

### LINE Bot 開發者注意事項：
1. **正確設定 Endpoint URL**
2. **選擇適當的 Scope**
3. **提供正確的 LIFF ID**
4. **測試 LIFF 連結**

### 共同注意事項：
1. **及時溝通 LIFF ID**
2. **測試完整流程**
3. **處理錯誤情況**
4. **記錄設定步驟**

---

## 🎉 完成！

按照這個流程，您和組員就可以順利完成 LIFF 整合：

1. 您提供網頁 URL
2. 組員設定 LIFF
3. 組員提供 LIFF ID
4. 您更新程式碼
5. 組員在 Bot 中使用

這樣的分工既有效率又符合各自的專業領域！ 