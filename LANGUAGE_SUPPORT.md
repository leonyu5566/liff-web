# 多語言支援說明

## 支援的語言

您的點餐傳聲筒 LIFF 網頁現在支援以下四種語言：

### 1. 中文 (zh-TW)
- **語言代碼**: `zh-TW`
- **顯示名稱**: 中文
- **URL 參數**: `?lang=zh-TW`
- **適用地區**: 台灣、香港、澳門

### 2. 英文 (en-US)
- **語言代碼**: `en-US`
- **顯示名稱**: English
- **URL 參數**: `?lang=en-US`
- **適用地區**: 美國、英國、澳洲等英語國家

### 3. 日文 (ja-JP)
- **語言代碼**: `ja-JP`
- **顯示名稱**: 日本語
- **URL 參數**: `?lang=ja-JP`
- **適用地區**: 日本

### 4. 韓文 (ko-KR) ⭐ 新增
- **語言代碼**: `ko-KR`
- **顯示名稱**: 한국어
- **URL 參數**: `?lang=ko-KR`
- **適用地區**: 韓國

## 語言處理流程

### 1. LINE Bot 階段
使用者在 LINE Bot 中選擇語言：
```python
# 語言選擇選項
language_options = [
    {'label': '中文', 'value': 'zh-TW'},
    {'label': 'English', 'value': 'en-US'},
    {'label': '日本語', 'value': 'ja-JP'},
    {'label': '한국어', 'value': 'ko-KR'}
]
```

### 2. LIFF 跳轉
LINE Bot 將語言參數附加到 LIFF URL：
```python
def create_liff_url(user_language):
    base_url = "https://your-static-app.azurestaticapps.net"
    return f"{base_url}?lang={user_language}"

# 使用範例
liff_url = create_liff_url('ko-KR')  # 韓文版本
```

### 3. LIFF 網頁
自動讀取語言參數並設定顯示語言：
```javascript
// 從 URL 參數取得語言設定
const urlParams = new URLSearchParams(window.location.search);
let language = urlParams.get('lang');

// 支援的語言對應
const langNames = {
    'zh-TW': '中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
};
```

## 韓文特色內容

### 模擬菜單資料
```javascript
"ko-KR": {
    "store_name": "왕 할머니의 냄새나는 두부",
    "items": [
        {
            "menu_item_id": 101,
            "item_name": "시그니처 냄새나는 두부",
            "description": "바삭하고 부드러운 발효 두부, 특제 김치와 함께.",
            "price_small": 60
        },
        {
            "menu_item_id": 102,
            "item_name": "버블 밀크티",
            "description": "클래식 대만 밀크티, 쫄깃한 타피오카 펄과 함께.",
            "price_small": 50
        }
    ]
}
```

### 韓文翻譯特色
- **自然韓文表達**: 使用符合韓文語法的表達方式
- **文化適應**: 考慮韓國使用者的飲食文化
- **專業術語**: 使用正確的韓文餐飲術語

## 測試方法

### 1. 使用測試頁面
開啟 `test-language.html` 並點擊不同語言版本：
- 中文版本：`index.html?lang=zh-TW`
- 英文版本：`index.html?lang=en-US`
- 日文版本：`index.html?lang=ja-JP`
- 韓文版本：`index.html?lang=ko-KR`

### 2. 直接 URL 測試
在瀏覽器中直接輸入：
```
https://your-static-app.azurestaticapps.net?lang=ko-KR
```

### 3. LINE Bot 整合測試
在 LINE Bot 中發送包含韓文參數的 LIFF 連結

## 後端 API 支援

確保您的 Cloud Run 後端也支援韓文：

### API 端點範例
```bash
# 韓文店家列表
GET /api/stores?lang=ko-KR

# 韓文菜單
GET /api/menus/1?lang=ko-KR

# 韓文訂單
POST /api/orders
{
    "store_id": 1,
    "language": "ko-KR",
    "items": [...]
}
```

### OCR 翻譯支援
```bash
# 韓文 OCR 辨識
POST /api/upload-menu-image
{
    "image": "...",
    "lang": "ko-KR",
    "store_id": 1
}
```

## 部署注意事項

### 1. 字體支援
確保網頁字體支援韓文字符：
```css
font-family: 'Inter', 'Noto Sans TC', 'Noto Sans KR', sans-serif;
```

### 2. 內容安全策略
更新 CSP 設定以支援韓文內容：
```json
{
  "globalHeaders": {
    "content-security-policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.line-scdn.net https://fonts.googleapis.com https://fonts.gstatic.com https://placehold.co https://ordering-helper-backend-1095766716155.asia-east1.run.app; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://ordering-helper-backend-1095766716155.asia-east1.run.app;"
  }
}
```

### 3. 測試檢查清單
- [ ] 韓文 URL 參數正常傳遞
- [ ] 韓文內容正確顯示
- [ ] 韓文菜單項目正常載入
- [ ] 韓文 OCR 辨識功能正常
- [ ] 韓文訂單送出功能正常

## 未來擴展

### 可能的語言擴展
- 泰文 (th-TH)
- 越南文 (vi-VN)
- 印尼文 (id-ID)
- 馬來文 (ms-MY)

### 本地化功能
- 貨幣格式本地化
- 日期時間格式本地化
- 地址格式本地化
- 電話號碼格式本地化

## 技術支援

如有韓文相關問題，請檢查：
1. 字體是否正確載入
2. 編碼是否為 UTF-8
3. 後端 API 是否支援韓文
4. 瀏覽器是否支援韓文顯示 