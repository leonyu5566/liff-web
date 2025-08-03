# LINE Bot + LIFF 整合指南

## 整合架構

```
用戶在 LINE 中與 Bot 對話
    ↓
Bot 發送包含 LIFF 連結的訊息
    ↓
用戶點擊連結
    ↓
在 LINE 內建瀏覽器中開啟 LIFF 網頁
    ↓
用戶完成點餐流程
    ↓
網頁將結果回傳給 Bot
    ↓
Bot 發送訂單確認訊息
```

## 設定步驟

### 步驟 1：建立 LIFF App

1. **前往 LINE Developers Console**
   - 網址：https://developers.line.biz/
   - 登入您的 LINE 開發者帳戶

2. **選擇您的 Bot Channel**
   - 點擊您已建立的 Bot Channel

3. **建立 LIFF App**
   - 在左側選單中點擊 "LIFF"
   - 點擊 "Add LIFF app" 按鈕

4. **填寫 LIFF App 設定**
   ```
   LIFF App name: 點餐傳聲筒
   Size: Full
   Endpoint URL: https://your-static-app.azurestaticapps.net
   Scope: 
   - profile (取得用戶資料)
   - openid (身份驗證)
   - email (取得用戶 email)
   - chat_message.write (發送訊息)
   Bot link feature: 啟用
   ```

5. **取得 LIFF ID**
   - 建立完成後，複製 LIFF ID
   - 格式：`1234567890-abcdefgh`

### 步驟 2：更新網頁程式碼

#### 更新 LIFF ID
```javascript
// 在 index.html 中更新
const LIFF_ID = 'your-actual-liff-id'; // 替換為您的實際 LIFF ID
```

#### 加入 LIFF 整合功能
```javascript
// 初始化 LIFF
async function initializeLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
        liffInitialized = true;
        
        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            document.getElementById('liff-status').textContent = `你好 ${profile.displayName}！`;
        }
    } catch (error) {
        console.error("LIFF Initialization failed", error);
    }
}

// 訂單完成後發送訊息給 Bot
async function sendOrderToBot(orderData) {
    if (liffInitialized && liff.isLoggedIn()) {
        try {
            await liff.sendMessages([
                {
                    type: 'text',
                    text: `✅ 訂單已確認！\n\n📋 訂單編號: ${orderData.orderId}\n💰 總金額: NT$ ${orderData.total}\n\n📝 訂單內容:\n${orderData.items}\n\n🎉 感謝您的訂購！`
                }
            ]);
            
            // 延遲關閉視窗
            setTimeout(() => {
                liff.closeWindow();
            }, 2000);
            
        } catch (error) {
            console.error('發送 LIFF 訊息失敗:', error);
        }
    }
}
```

### 步驟 3：LINE Bot 程式碼

#### Python 範例
```python
from linebot import LineBotApi, WebhookHandler
from linebot.models import TextSendMessage, FlexSendMessage
from linebot.exceptions import LineBotApiError

# 設定
line_bot_api = LineBotApi('YOUR_CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler('YOUR_CHANNEL_SECRET')

# 處理文字訊息
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    user_id = event.source.user_id
    text = event.message.text
    
    # 語言選擇處理
    if text in ['中文', 'English', '日本語', '한국어']:
        language_map = {
            '中文': 'zh-TW',
            'English': 'en-US',
            '日本語': 'ja-JP',
            '한국어': 'ko-KR'
        }
        
        language = language_map.get(text, 'zh-TW')
        send_liff_message(user_id, language)
    
    # 店家選擇處理
    elif text.startswith('店家'):
        send_store_selection(user_id)
    
    # 其他訊息處理
    else:
        send_welcome_message(user_id)

# 發送 LIFF 訊息
def send_liff_message(user_id, language):
    liff_url = f"https://your-static-app.azurestaticapps.net?lang={language}"
    
    message = FlexSendMessage(
        alt_text="點餐傳聲筒",
        contents={
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "點擊下方按鈕開始點餐",
                        "weight": "bold",
                        "size": "lg"
                    },
                    {
                        "type": "text",
                        "text": f"語言: {language}",
                        "size": "sm",
                        "color": "#666666",
                        "margin": "md"
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "uri",
                            "label": "開始點餐",
                            "uri": liff_url
                        }
                    }
                ]
            }
        }
    )
    
    line_bot_api.push_message(user_id, message)

# 發送歡迎訊息
def send_welcome_message(user_id):
    message = TextSendMessage(
        text="歡迎使用點餐傳聲筒！\n\n請選擇您的語言：\n- 中文\n- English\n- 日本語\n- 한국어"
    )
    line_bot_api.push_message(user_id, message)
```

## 完整使用流程

### 1. 用戶與 Bot 對話
```
用戶: 你好
Bot: 歡迎使用點餐傳聲筒！
請選擇您的語言：
- 中文
- English
- 日本語
- 한국어
```

### 2. 語言選擇
```
用戶: 中文
Bot: [發送包含 LIFF 連結的 Flex 訊息]
```

### 3. 點餐流程
```
用戶點擊 "開始點餐" 按鈕
↓
在 LINE 內建瀏覽器中開啟 LIFF 網頁
↓
用戶選擇店家
↓
用戶選擇菜單項目
↓
用戶確認訂單
↓
網頁發送訂單訊息給 Bot
↓
Bot 發送訂單確認訊息
↓
關閉 LIFF 網頁
```

### 4. 訂單確認
```
Bot: ✅ 訂單已確認！

📋 訂單編號: ORD-2025-001
💰 總金額: NT$ 150

📝 訂單內容:
招牌臭豆腐 x 1
珍珠奶茶 x 1

🎉 感謝您的訂購！
```

## 進階功能

### 1. 多語言支援
```python
# 根據用戶語言發送對應訊息
def send_localized_message(user_id, language):
    messages = {
        'zh-TW': '歡迎使用點餐傳聲筒！',
        'en-US': 'Welcome to Ordering Helper!',
        'ja-JP': '注文ヘルパーへようこそ！',
        'ko-KR': '주문 도우미에 오신 것을 환영합니다!'
    }
    
    message = TextSendMessage(text=messages.get(language, messages['zh-TW']))
    line_bot_api.push_message(user_id, message)
```

### 2. 訂單追蹤
```python
# 儲存訂單資訊
def save_order(user_id, order_data):
    # 儲存到資料庫
    order = {
        'user_id': user_id,
        'order_id': order_data['orderId'],
        'total': order_data['total'],
        'items': order_data['items'],
        'timestamp': datetime.now()
    }
    # 儲存邏輯...
```

### 3. 語音訂單
```python
# 處理語音訊息
@handler.add(MessageEvent, message=AudioMessage)
def handle_audio(event):
    # 下載語音檔案
    message_content = line_bot_api.get_message_content(event.message.id)
    
    # 轉換語音為文字
    text = convert_audio_to_text(message_content)
    
    # 處理語音指令
    handle_voice_command(event.source.user_id, text)
```

## 測試方法

### 1. 本地測試
```bash
# 啟動本地伺服器
npm run dev

# 測試 LIFF 功能
open http://localhost:3000/index.html?lang=zh-TW
```

### 2. LINE Bot 測試
1. 在 LINE 中加入您的 Bot
2. 發送 "你好" 訊息
3. 選擇語言
4. 點擊 LIFF 連結
5. 測試完整點餐流程

### 3. 整合測試
1. 確認 LIFF ID 正確設定
2. 測試語言參數傳遞
3. 測試訂單回傳功能
4. 測試訊息發送功能

## 故障排除

### 常見問題

1. **LIFF 初始化失敗**
   - 檢查 LIFF ID 是否正確
   - 確認網域設定
   - 檢查 HTTPS 設定

2. **訊息發送失敗**
   - 確認 Scope 設定包含 `chat_message.write`
   - 檢查 Bot 權限設定
   - 確認用戶已加入 Bot

3. **網頁無法載入**
   - 檢查 Azure Static Web Apps 部署狀態
   - 確認網域設定正確
   - 檢查 CORS 設定

### 除錯工具

1. **LINE Developers Console**
   - 查看 LIFF App 狀態
   - 檢查錯誤日誌
   - 監控使用統計

2. **瀏覽器開發者工具**
   - 查看 Console 錯誤
   - 監控 Network 請求
   - 檢查 LIFF API 回應

3. **Azure Portal**
   - 查看 Static Web Apps 日誌
   - 監控應用程式效能
   - 檢查部署狀態

## 最佳實踐

### 1. 安全性
- 使用環境變數管理敏感資訊
- 實作適當的錯誤處理
- 驗證用戶權限

### 2. 用戶體驗
- 提供清晰的指引訊息
- 實作適當的載入狀態
- 處理網路錯誤情況

### 3. 效能優化
- 最小化網頁載入時間
- 實作適當的快取策略
- 優化圖片和資源

### 4. 監控和維護
- 實作錯誤日誌記錄
- 監控使用統計
- 定期更新和維護 