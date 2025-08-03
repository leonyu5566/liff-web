#!/bin/bash

# 本地測試伺服器啟動腳本

echo "🚀 啟動點餐傳聲筒本地測試伺服器..."

# 檢查是否已安裝 live-server
if ! command -v npx &> /dev/null; then
    echo "❌ 錯誤: 需要安裝 Node.js 和 npm"
    echo "請先安裝 Node.js: https://nodejs.org/"
    exit 1
fi

# 檢查檔案是否存在
if [ ! -f "local-test.html" ]; then
    echo "❌ 錯誤: 找不到 local-test.html 檔案"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo "❌ 錯誤: 找不到 index.html 檔案"
    exit 1
fi

echo "✅ 檔案檢查完成"

# 啟動伺服器
echo "🌐 啟動伺服器在 http://localhost:3000"
echo "📝 測試頁面: http://localhost:3000/local-test.html"
echo "🌍 主應用程式: http://localhost:3000/index.html"
echo ""
echo "按 Ctrl+C 停止伺服器"
echo ""

# 啟動 live-server
npx live-server --port=3000 --open=/local-test.html 