#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LINE Bot - 點餐傳聲筒
階段 1: 加入與語言設定
"""

from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage, 
    FlexSendMessage, BubbleContainer, BoxComponent,
    TextComponent, ButtonComponent, URIAction
)
import os
import json

app = Flask(__name__)

# LINE Bot 設定
LINE_CHANNEL_ACCESS_TOKEN = 'eDgiF6xfUzTZofyrW5BwYT0OVvknrBsqQCvKzOfxmFuHpvbyUUNmbNw0bNcATajouZHo44C8GwHdCDre1Pa0dY+Z0M8oWH51Z7zMZdvOavbp5exwf54VyNZHoCS7EW8mD7UT7pDjsWe0SnypUaj6iwdB04t89/1O/w1cDnyilFU='
LINE_CHANNEL_SECRET = 'a144f8ec17ba0a8695b4bda127770cf3'

line_bot_api = LineBotApi(LINE_CHANNEL_ACCESS_TOKEN)
handler = WebhookHandler(LINE_CHANNEL_SECRET)

# 語言設定
LANGUAGES = {
    'zh-TW': {
        'name': '中文',
        'welcome': '歡迎使用點餐傳聲筒！\n\n我是您的專屬點餐助手，可以幫助您：\n• 選擇鄰近店家\n• 翻譯菜單內容\n• 生成中文語音檔\n• 順利完成點餐\n\n請選擇您的介面語言：',
        'select_language': '請選擇語言',
        'start_ordering': '開始點餐'
    },
    'en-US': {
        'name': 'English',
        'welcome': 'Welcome to Ordering Helper!\n\nI am your dedicated ordering assistant who can help you:\n• Choose nearby restaurants\n• Translate menu content\n• Generate Chinese voice files\n• Complete ordering smoothly\n\nPlease select your interface language:',
        'select_language': 'Select Language',
        'start_ordering': 'Start Ordering'
    },
    'ja-JP': {
        'name': '日本語',
        'welcome': '注文ヘルパーへようこそ！\n\n私はあなたの専用注文アシスタントで、以下のお手伝いができます：\n• 近くの店舗を選択\n• メニュー内容を翻訳\n• 中国語音声ファイルを生成\n• スムーズに注文を完了\n\nインターフェース言語を選択してください：',
        'select_language': '言語を選択',
        'start_ordering': '注文開始'
    },
    'ko-KR': {
        'name': '한국어',
        'welcome': '주문 도우미에 오신 것을 환영합니다!\n\n저는 여러분의 전용 주문 어시스턴트로 다음을 도와드릴 수 있습니다:\n• 근처 식당 선택\n• 메뉴 내용 번역\n• 중국어 음성 파일 생성\n• 원활한 주문 완료\n\n인터페이스 언어를 선택해 주세요:',
        'select_language': '언어 선택',
        'start_ordering': '주문 시작'
    }
}

# 用戶語言偏好儲存 (實際應用中應該使用資料庫)
user_languages = {}

@app.route("/callback", methods=['POST'])
def callback():
    """LINE Bot Webhook 回調"""
    signature = request.headers['X-Line-Signature']
    body = request.get_data(as_text=True)
    
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)
    
    return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    """處理文字訊息"""
    user_id = event.source.user_id
    text = event.message.text
    
    # 處理語言選擇
    if text in ['中文', 'English', '日本語', '한국어']:
        handle_language_selection(user_id, text)
    # 處理其他指令
    elif text.lower() in ['help', '幫助', 'ヘルプ', '도움말']:
        send_help_message(user_id)
    elif text.lower() in ['language', '語言', '言語', '언어']:
        send_language_selection(user_id)
    else:
        send_welcome_message(user_id)

def handle_language_selection(user_id, selected_language):
    """處理語言選擇"""
    # 語言對應
    language_map = {
        '中文': 'zh-TW',
        'English': 'en-US',
        '日本語': 'ja-JP',
        '한국어': 'ko-KR'
    }
    
    language_code = language_map.get(selected_language, 'zh-TW')
    user_languages[user_id] = language_code
    
    # 發送語言確認訊息
    lang_info = LANGUAGES[language_code]
    
    message = TextSendMessage(
        text=f"✅ 語言設定完成！\n\n您選擇的語言：{lang_info['name']}\n\n現在可以開始使用點餐功能了！\n\n請輸入以下指令：\n• 開始點餐\n• 選擇店家\n• 查看菜單"
    )
    
    line_bot_api.push_message(user_id, message)

def send_welcome_message(user_id):
    """發送歡迎訊息"""
    # 檢查用戶是否已設定語言
    user_lang = user_languages.get(user_id, 'zh-TW')
    lang_info = LANGUAGES[user_lang]
    
    # 建立歡迎訊息
    welcome_text = lang_info['welcome']
    
    # 建立語言選擇按鈕
    message = FlexSendMessage(
        alt_text="歡迎使用點餐傳聲筒",
        contents=BubbleContainer(
            body=BoxComponent(
                layout="vertical",
                contents=[
                    TextComponent(
                        text="點餐傳聲筒",
                        weight="bold",
                        size="lg",
                        color="#1DB446"
                    ),
                    TextComponent(
                        text=welcome_text,
                        size="sm",
                        color="#666666",
                        margin="md",
                        wrap=True
                    )
                ]
            ),
            footer=BoxComponent(
                layout="vertical",
                contents=[
                    ButtonComponent(
                        style="primary",
                        color="#1DB446",
                        action=URIAction(
                            label="選擇語言",
                            uri="https://your-static-app.azurestaticapps.net/language-selection"
                        )
                    )
                ]
            )
        )
    )
    
    line_bot_api.push_message(user_id, message)

def send_language_selection(user_id):
    """發送語言選擇選項"""
    # 建立語言選擇按鈕
    buttons = []
    
    for lang_code, lang_info in LANGUAGES.items():
        buttons.append(
            ButtonComponent(
                style="link",
                action=URIAction(
                    label=lang_info['name'],
                    uri=f"https://your-static-app.azurestaticapps.net?lang={lang_code}"
                )
            )
        )
    
    message = FlexSendMessage(
        alt_text="選擇語言",
        contents=BubbleContainer(
            body=BoxComponent(
                layout="vertical",
                contents=[
                    TextComponent(
                        text="請選擇您的介面語言",
                        weight="bold",
                        size="lg",
                        align="center"
                    ),
                    TextComponent(
                        text="Please select your interface language",
                        size="sm",
                        color="#666666",
                        align="center",
                        margin="md"
                    )
                ]
            ),
            footer=BoxComponent(
                layout="vertical",
                spacing="sm",
                contents=buttons
            )
        )
    )
    
    line_bot_api.push_message(user_id, message)

def send_help_message(user_id):
    """發送幫助訊息"""
    user_lang = user_languages.get(user_id, 'zh-TW')
    lang_info = LANGUAGES[user_lang]
    
    help_text = f"""
📋 點餐傳聲筒使用說明

🎯 主要功能：
• 選擇鄰近店家
• 翻譯菜單內容
• 生成中文語音檔
• 順利完成點餐

📝 常用指令：
• 開始點餐 - 進入點餐流程
• 選擇店家 - 查看鄰近店家
• 語言設定 - 更改介面語言
• 幫助 - 顯示此說明

🌍 支援語言：
• 中文 (繁體)
• English (英文)
• 日本語 (日文)
• 한국어 (韓文)

💡 小提示：
使用語音訊息可以更快完成點餐！
    """
    
    message = TextSendMessage(text=help_text)
    line_bot_api.push_message(user_id, message)

# 處理加入事件
@handler.add(MessageEvent, message=TextMessage)
def handle_join(event):
    """處理用戶加入事件"""
    if event.source.type == 'user':
        user_id = event.source.user_id
        # 發送歡迎訊息
        send_welcome_message(user_id)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000) 