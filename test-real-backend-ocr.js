#!/usr/bin/env node

/**
 * 真實後端 OCR 測試
 * 測試 https://ordering-helper-backend-1095766716155.asia-east1.run.app
 */

const axios = require('axios');

// 真實後端配置
const REAL_BACKEND_CONFIG = {
    API_BASE_URL: 'https://ordering-helper-backend-1095766716155.asia-east1.run.app',
    TEST_LANGUAGES: ['zh-TW', 'en-US', 'ja-JP', 'ko-KR']
};

/**
 * 測試真實後端健康檢查
 */
async function testRealBackendHealth() {
    console.log('🔍 測試真實後端健康檢查...');
    
    try {
        const response = await axios.get(`${REAL_BACKEND_CONFIG.API_BASE_URL}/api/health`);
        
        if (response.status === 200 && response.data.status === 'healthy') {
            console.log('✅ 真實後端健康檢查通過');
            console.log('📋 後端資訊:', response.data);
            return true;
        } else {
            console.log('❌ 真實後端健康檢查失敗');
            return false;
        }
    } catch (error) {
        console.log(`❌ 真實後端連線失敗: ${error.message}`);
        return false;
    }
}

/**
 * 測試真實後端的菜單 API
 */
async function testRealMenuAPI(storeId = 1, language = 'zh-TW') {
    console.log(`🔍 測試真實後端菜單 API (店家 ID: ${storeId}, 語言: ${language})...`);
    
    try {
        const response = await axios.get(`${REAL_BACKEND_CONFIG.API_BASE_URL}/api/menu/${storeId}?lang=${language}`);
        
        if (response.status === 200) {
            console.log('✅ 真實後端菜單 API 成功');
            console.log('📋 菜單資料:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            console.log(`❌ 真實後端菜單 API 失敗: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 真實後端菜單 API 錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 測試真實後端的訂單 API
 */
async function testRealOrderAPI(storeId = 1, language = 'zh-TW') {
    console.log(`🔍 測試真實後端訂單 API (店家 ID: ${storeId}, 語言: ${language})...`);
    
    try {
        const orderPayload = {
            store_id: storeId,
            items: [
                {
                    menu_item_id: "test-item-1",
                    quantity: 2,
                    price: 100
                },
                {
                    menu_item_id: "test-item-2", 
                    quantity: 1,
                    price: 150
                }
            ],
            language: language
        };
        
        const response = await axios.post(
            `${REAL_BACKEND_CONFIG.API_BASE_URL}/api/orders`,
            orderPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        if (response.status === 200) {
            console.log('✅ 真實後端訂單 API 成功');
            console.log('📋 訂單結果:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            console.log(`❌ 真實後端訂單 API 失敗: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 真實後端訂單 API 錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 執行完整的真實後端測試
 */
async function runRealBackendTest() {
    console.log('🧪 真實後端 API 測試');
    console.log('=' .repeat(50));
    console.log(`🌐 後端 URL: ${REAL_BACKEND_CONFIG.API_BASE_URL}`);
    
    // 測試健康檢查
    const healthOk = await testRealBackendHealth();
    if (!healthOk) {
        console.log('❌ 真實後端不可用，停止測試');
        return;
    }
    
    console.log('\n📋 開始測試各個 API 端點...\n');
    
    // 測試菜單 API
    const menuData = await testRealMenuAPI(1, 'zh-TW');
    
    // 測試訂單 API
    const orderData = await testRealOrderAPI(1, 'zh-TW');
    
    // 總結
    console.log('\n📊 真實後端測試總結:');
    console.log(`✅ 健康檢查: ${healthOk ? '通過' : '失敗'}`);
    console.log(`✅ 菜單 API: ${menuData ? '成功' : '失敗'}`);
    console.log(`✅ 訂單 API: ${orderData ? '成功' : '失敗'}`);
    
    if (healthOk && menuData && orderData) {
        console.log('\n🎉 真實後端所有 API 都正常運作！');
    } else {
        console.log('\n⚠️  部分 API 測試失敗，需要檢查。');
    }
}

// 執行測試
if (require.main === module) {
    runRealBackendTest().catch(console.error);
}

module.exports = {
    testRealBackendHealth,
    testRealMenuAPI,
    testRealOrderAPI,
    runRealBackendTest
}; 