# 📋 版本比較：LIFF vs 純靜態網頁

## 🎯 兩個版本的主要差異

### 1. **LIFF 版本** (`index.html`)
- ✅ 可以在 LINE 中開啟
- ✅ 可以取得用戶資料
- ✅ 可以與 LINE Bot 整合
- ❌ 需要設定 LINE Developers Console
- ❌ 需要 LIFF ID

### 2. **純靜態版本** (`index-static.html`)
- ✅ 完全獨立，不需要 LINE 設定
- ✅ 可以直接在任何瀏覽器中開啟
- ✅ 可以嵌入到任何網站
- ✅ 更簡單的部署流程
- ❌ 無法取得 LINE 用戶資料
- ❌ 無法與 LINE Bot 整合

---

## 🚀 使用情境

### 選擇 LIFF 版本的情況：
- 需要在 LINE 中開啟
- 需要取得用戶資料
- 需要與 LINE Bot 整合
- 團隊中有負責 LINE Bot 的人員

### 選擇純靜態版本的情況：
- 只需要點餐功能
- 不需要 LINE 整合
- 想要簡單的部署流程
- 可以嵌入到其他網站

---

## 📁 檔案結構

```
liff-web/
├── index.html              # LIFF 版本（需要 LINE 設定）
├── index-static.html       # 純靜態版本（不需要 LINE 設定）
├── LIFF_SETUP_GUIDE.md     # LIFF 設定指南
├── STANDALONE_LIFF_GUIDE.md # 獨立 LIFF 指南
├── VERSION_COMPARISON.md   # 版本比較（本檔案）
└── 其他檔案...
```

---

## 🔧 技術差異

### LIFF 版本特有的程式碼：
```javascript
// LIFF SDK
<script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>

// LIFF 初始化
const LIFF_ID = 'your-liff-id';
await liff.init({ liffId: LIFF_ID });

// 取得用戶資料
const profile = await liff.getProfile();

// 關閉 LIFF 視窗
liff.closeWindow();
```

### 純靜態版本：
```javascript
// 不需要 LIFF SDK
// 不需要 LIFF ID
// 不需要用戶資料
// 使用 window.close() 關閉視窗
```

---

## 🎯 部署方式

### LIFF 版本部署：
1. 建立 LINE Login Channel
2. 設定 LIFF App
3. 取得 LIFF ID
4. 更新程式碼中的 LIFF ID
5. 部署到 HTTPS 網域
6. 更新 LINE Developers 設定

### 純靜態版本部署：
1. 直接部署到任何網域
2. 不需要額外設定
3. 可以在任何瀏覽器中開啟

---

## 📱 使用方式

### LIFF 版本：
```
https://liff.line.me/YOUR-LIFF-ID
```

### 純靜態版本：
```
https://your-domain.com/index-static.html?store_id=1&lang=zh-TW&partner=true&store_name=王阿嬤臭豆腐
```

---

## 🤝 與其他團隊的整合

### LIFF 版本：
- 提供 LIFF URL 給 LINE Bot 團隊
- 他們可以在 Bot 中加入連結
- 用戶點擊後在 LINE 中開啟

### 純靜態版本：
- 提供網頁 URL 給其他團隊
- 可以嵌入到任何網站
- 用戶在任何瀏覽器中開啟

---

## 💡 建議

### 如果您只負責點餐介面：
- 建議使用 **純靜態版本**
- 更簡單的開發和部署流程
- 不需要 LINE 相關知識

### 如果需要 LINE 整合：
- 建議使用 **LIFF 版本**
- 可以取得用戶資料
- 更好的用戶體驗

### 如果不確定：
- 可以先使用純靜態版本開發
- 之後再決定是否需要 LIFF 功能
- 兩個版本的程式碼結構基本相同

---

## 🎉 總結

兩個版本都提供完整的點餐功能，主要差異在於：
- **LIFF 版本**：適合需要 LINE 整合的專案
- **純靜態版本**：適合只需要點餐功能的專案

選擇哪個版本主要取決於您的需求和團隊分工！ 