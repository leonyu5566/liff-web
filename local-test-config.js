// 本地測試設定檔案
// 這個檔案用於本地開發和測試

const LOCAL_TEST_CONFIG = {
    // 後端 API 網址
    API_BASE_URL: 'https://ordering-helper-backend-1095766716155.asia-east1.run.app',
    
    // LINE Bot 設定
    LINE_CHANNEL_ACCESS_TOKEN: 'eDgiF6xfUzTZofyrW5BwYT0OVvknrBsqQCvKzOfxmFuHpvbyUUNmbNw0bNcATajouZHo44C8GwHdCDre1Pa0dY+Z0M8oWH51Z7zMZdvOavbp5exwf54VyNZHoCS7EW8mD7UT7pDjsWe0SnypUaj6iwdB04t89/1O/w1cDnyilFU=',
    LINE_CHANNEL_SECRET: 'a144f8ec17ba0a8695b4bda127770cf3',
    
    // LIFF ID (測試用)
    LIFF_ID: 'your-liff-id-for-testing',
    
    // 本地開發伺服器設定
    LOCAL_SERVER_PORT: 3000,
    
    // 測試模式設定
    TEST_MODE: true,
    MOCK_DATA_ENABLED: true,
    
    // 支援的語言
    SUPPORTED_LANGUAGES: ['zh-TW', 'en-US', 'ja-JP', 'ko-KR'],
    
    // 語言顯示名稱
    LANGUAGE_NAMES: {
        'zh-TW': '中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어'
    }
};

// 導出設定
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOCAL_TEST_CONFIG;
} else {
    window.LOCAL_TEST_CONFIG = LOCAL_TEST_CONFIG;
} 