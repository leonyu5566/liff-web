#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 讀取命令列參數
const newLiffId = process.argv[2];

if (!newLiffId) {
    console.log('❌ 請提供 LIFF ID');
    console.log('使用方法: node update-liff-id.js YOUR-LIFF-ID');
    console.log('範例: node update-liff-id.js 1234567890-abcdefgh');
    process.exit(1);
}

// 驗證 LIFF ID 格式
const liffIdPattern = /^\d{10}-[a-z0-9]{8}$/;
if (!liffIdPattern.test(newLiffId)) {
    console.log('❌ LIFF ID 格式不正確');
    console.log('正確格式: 1234567890-abcdefgh');
    process.exit(1);
}

// 讀取 index.html
const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 更新 LIFF ID
const oldPattern = /const LIFF_ID = 'your-liff-id';/;
const newLine = `const LIFF_ID = '${newLiffId}';`;

if (content.includes('your-liff-id')) {
    content = content.replace(oldPattern, newLine);
    fs.writeFileSync(indexPath, content);
    console.log('✅ LIFF ID 已更新為:', newLiffId);
    console.log('📝 請記得在 LINE Developers Console 中設定正確的 Endpoint URL');
} else {
    console.log('⚠️  找不到預設的 LIFF ID，請手動更新');
    console.log('在 index.html 第 117 行附近找到並更新:');
    console.log(`const LIFF_ID = '${newLiffId}';`);
}

console.log('\n🎯 下一步：');
console.log('1. 確保您的網域已設定為 HTTPS');
console.log('2. 在 LINE Developers Console 中設定正確的 Endpoint URL');
console.log('3. 測試 LIFF URL: https://liff.line.me/' + newLiffId); 