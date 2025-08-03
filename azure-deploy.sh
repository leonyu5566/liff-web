#!/bin/bash

# Azure 部署腳本 - 點餐傳聲筒 LIFF 網頁
# 使用方式: ./azure-deploy.sh

set -e

# 設定變數
RESOURCE_GROUP="ordering-helper-rg"
LOCATION="eastasia"
STATIC_WEB_APP_NAME="ordering-helper-liff"
BRANCH="main"

echo "🚀 開始部署點餐傳聲筒 LIFF 網頁到 Azure..."

# 檢查是否已登入 Azure
echo "📋 檢查 Azure 登入狀態..."
if ! az account show &> /dev/null; then
    echo "❌ 請先登入 Azure: az login"
    exit 1
fi

# 建立資源群組
echo "📦 建立資源群組: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# 建立 Static Web App
echo "🌐 建立 Static Web App: $STATIC_WEB_APP_NAME"
az staticwebapp create \
    --name $STATIC_WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source . \
    --location $LOCATION \
    --branch $BRANCH \
    --app-location "/" \
    --output-location "."

# 取得部署 URL
DEPLOYMENT_URL=$(az staticwebapp show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)
echo "✅ 部署完成！"
echo "🌍 您的網頁網址: https://$DEPLOYMENT_URL"

# 設定環境變數（需要手動填入）
echo ""
echo "📝 請在 Azure Portal 中設定以下環境變數："
echo "   VITE_API_BASE_URL=https://your-backend.azurewebsites.net"
echo "   VITE_LIFF_ID=your-liff-id"
echo ""
echo "🔗 Azure Portal 連結: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$STATIC_WEB_APP_NAME"

# 顯示部署資訊
echo ""
echo "📊 部署資訊："
echo "   資源群組: $RESOURCE_GROUP"
echo "   Static Web App: $STATIC_WEB_APP_NAME"
echo "   網址: https://$DEPLOYMENT_URL"
echo "   位置: $LOCATION"
echo ""
echo "🎉 部署完成！請記得設定 LIFF ID 和後端 API 網址。" 