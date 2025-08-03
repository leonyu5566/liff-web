#!/bin/bash

# Azure 靜態網頁快速部署腳本

echo "🚀 開始部署到 Azure 靜態網頁..."

# 檢查是否在正確的目錄
if [ ! -f "index.html" ]; then
    echo "❌ 錯誤: 請在專案根目錄執行此腳本"
    exit 1
fi

# 檢查 Git 是否初始化
if [ ! -d ".git" ]; then
    echo "📝 初始化 Git 儲存庫..."
    git init
fi

# 檢查是否有遠端儲存庫
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  請先設定 GitHub 遠端儲存庫:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    read -p "是否要繼續部署? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 檢查必要的檔案
echo "📋 檢查必要檔案..."
required_files=("index.html" "staticwebapp.config.json" ".github/workflows/azure-deploy.yml")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少必要檔案: $file"
        exit 1
    fi
done

echo "✅ 所有必要檔案都存在"

# 檢查 LIFF ID 是否已設定
if grep -q "your-liff-id" index.html; then
    echo "⚠️  警告: LIFF ID 尚未設定"
    echo "   請在 index.html 中更新 LIFF_ID 變數"
    echo ""
    read -p "是否要繼續部署? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 檢查後端 URL 是否已設定
if grep -q "localhost:3001" index.html; then
    echo "⚠️  警告: 後端 URL 仍指向本地端"
    echo "   已自動更新為正式環境 URL"
fi

# 提交變更
echo "📝 提交變更到 Git..."
git add .
git commit -m "Deploy to Azure Static Web Apps - $(date)"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
if git push origin main; then
    echo "✅ 成功推送到 GitHub"
    echo ""
    echo "📋 下一步:"
    echo "1. 前往 Azure Portal 建立靜態網頁應用程式"
    echo "2. 連接您的 GitHub 儲存庫"
    echo "3. 設定 GitHub Secrets (AZURE_STATIC_WEB_APPS_API_TOKEN)"
    echo "4. 在 LINE Developers Console 建立 LIFF 應用程式"
    echo "5. 更新 index.html 中的 LIFF_ID"
    echo ""
    echo "📖 詳細步驟請參考: AZURE_DEPLOYMENT_GUIDE.md"
else
    echo "❌ 推送到 GitHub 失敗"
    echo "請檢查您的 Git 設定和網路連線"
    exit 1
fi

echo "🎉 部署腳本執行完成！" 