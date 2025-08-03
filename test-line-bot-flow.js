#!/usr/bin/env node

/**
 * LINE Bot 整合流程測試
 * 測試從 LINE Bot 接收店家資訊到呼叫後端菜單和點餐系統的完整流程
 */

const axios = require('axios');

// 測試配置
const TEST_CONFIG = {
    API_BASE_URL: 'http://localhost:3001',
    TEST_STORES: [
        { id: 1, name: '王阿嬤臭豆腐', expected_partner: true },
        { id: 2, name: '小李牛肉麵', expected_partner: true },
        { id: 3, name: '阿婆滷肉飯', expected_partner: true },
        { id: 999, name: '非合作店家', expected_partner: false }
    ],
    TEST_LANGUAGES: ['zh-TW', 'en-US', 'ja-JP', 'ko-KR']
};

// 測試結果追蹤
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

/**
 * 測試後端健康檢查
 */
async function testBackendHealth() {
    console.log('🔍 測試後端健康檢查...');
    
    try {
        const response = await axios.get(`${TEST_CONFIG.API_BASE_URL}/api/health`);
        const data = response.data;
        
        if (response.status === 200 && data.status === 'ok') {
            console.log('✅ 後端健康檢查通過');
            return true;
        } else {
            console.log('❌ 後端健康檢查失敗');
            return false;
        }
    } catch (error) {
        console.log(`❌ 後端連線失敗: ${error.message}`);
        return false;
    }
}

/**
 * 測試店家資訊 API
 */
async function testStoreInfo(storeId) {
    console.log(`🔍 測試店家資訊 API (店家 ID: ${storeId})...`);
    
    try {
        const response = await axios.get(`${TEST_CONFIG.API_BASE_URL}/api/stores/${storeId}`);
        
        if (response.status === 200) {
            const storeData = response.data;
            console.log(`✅ 店家資訊獲取成功: ${storeData.store_name}`);
            return storeData;
        } else {
            console.log(`❌ 店家資訊獲取失敗: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 店家資訊 API 錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 測試菜單 API
 */
async function testMenuAPI(storeId, language) {
    console.log(`🔍 測試菜單 API (店家 ID: ${storeId}, 語言: ${language})...`);
    
    try {
        const response = await axios.get(`${TEST_CONFIG.API_BASE_URL}/api/menus/${storeId}?lang=${language}`);
        
        if (response.status === 200) {
            const menuData = response.data;
            console.log(`✅ 菜單獲取成功: ${menuData.store_name}, ${menuData.items.length} 項餐點`);
            return menuData;
        } else {
            console.log(`❌ 菜單獲取失敗: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 菜單 API 錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 測試訂單建立 API
 */
async function testOrderCreation(storeId, language, menuData) {
    console.log(`🔍 測試訂單建立 API (店家 ID: ${storeId}, 語言: ${language})...`);
    
    try {
        // 模擬訂單資料
        const orderItems = menuData.items.slice(0, 2).map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: item.price_small
        }));
        
        const orderPayload = {
            store_id: parseInt(storeId),
            items: orderItems,
            language: language
        };
        
        const response = await axios.post(`${TEST_CONFIG.API_BASE_URL}/api/orders`, orderPayload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.status === 200) {
            const orderResult = response.data;
            console.log(`✅ 訂單建立成功: ${orderResult.order.order_id}`);
            return orderResult;
        } else {
            console.log(`❌ 訂單建立失敗: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ 訂單 API 錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 模擬 LINE Bot 傳入店家資訊
 */
function simulateLineBotData(storeId, language) {
    console.log(`🤖 模擬 LINE Bot 傳入資料:`);
    console.log(`   - 店家 ID: ${storeId}`);
    console.log(`   - 語言: ${language}`);
    console.log(`   - LIFF 狀態: 已初始化`);
    
    return {
        store_id: storeId,
        language: language,
        liff_initialized: true
    };
}

/**
 * 執行完整的測試流程
 */
async function runCompleteTestFlow(storeId, language) {
    console.log(`\n🚀 開始測試流程 - 店家 ID: ${storeId}, 語言: ${language}`);
    console.log('=' .repeat(50));
    
    const testResult = {
        store_id: storeId,
        language: language,
        steps: {
            line_bot_data: false,
            store_info: false,
            menu_api: false,
            order_creation: false
        },
        details: {}
    };
    
    // 步驟 1: 模擬 LINE Bot 傳入資料
    const lineBotData = simulateLineBotData(storeId, language);
    testResult.steps.line_bot_data = true;
    testResult.details.line_bot_data = lineBotData;
    
    // 步驟 2: 獲取店家資訊
    const storeInfo = await testStoreInfo(storeId);
    if (storeInfo) {
        testResult.steps.store_info = true;
        testResult.details.store_info = storeInfo;
    }
    
    // 步驟 3: 獲取菜單資料
    const menuData = await testMenuAPI(storeId, language);
    if (menuData) {
        testResult.steps.menu_api = true;
        testResult.details.menu_data = menuData;
    }
    
    // 步驟 4: 建立訂單
    if (menuData) {
        const orderResult = await testOrderCreation(storeId, language, menuData);
        if (orderResult) {
            testResult.steps.order_creation = true;
            testResult.details.order_result = orderResult;
        }
    }
    
    // 計算測試結果
    const passedSteps = Object.values(testResult.steps).filter(Boolean).length;
    const totalSteps = Object.keys(testResult.steps).length;
    const success = passedSteps === totalSteps;
    
    console.log(`\n📊 測試結果: ${passedSteps}/${totalSteps} 步驟通過`);
    console.log(`   ${success ? '✅ 測試通過' : '❌ 測試失敗'}`);
    
    return {
        ...testResult,
        success,
        passed_steps: passedSteps,
        total_steps: totalSteps
    };
}

/**
 * 執行所有測試案例
 */
async function runAllTests() {
    console.log('🧪 LINE Bot 整合流程測試');
    console.log('=' .repeat(50));
    
    // 檢查後端健康狀態
    const backendHealthy = await testBackendHealth();
    if (!backendHealthy) {
        console.log('❌ 後端服務不可用，停止測試');
        return;
    }
    
    console.log('\n📋 開始執行所有測試案例...\n');
    
    // 執行所有測試案例
    for (const store of TEST_CONFIG.TEST_STORES) {
        for (const language of TEST_CONFIG.TEST_LANGUAGES) {
            const result = await runCompleteTestFlow(store.id, language);
            
            testResults.total++;
            if (result.success) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
            
            testResults.details.push(result);
            
            // 等待一下再執行下一個測試
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // 顯示最終結果
    showFinalResults();
}

/**
 * 顯示最終測試結果
 */
function showFinalResults() {
    console.log('\n' + '=' .repeat(50));
    console.log('📈 最終測試結果');
    console.log('=' .repeat(50));
    console.log(`總測試案例: ${testResults.total}`);
    console.log(`通過: ${testResults.passed}`);
    console.log(`失敗: ${testResults.failed}`);
    console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ 失敗的測試案例:');
        testResults.details
            .filter(result => !result.success)
            .forEach(result => {
                console.log(`   - 店家 ID: ${result.store_id}, 語言: ${result.language}`);
                const failedSteps = Object.entries(result.steps)
                    .filter(([_, passed]) => !passed)
                    .map(([step, _]) => step)
                    .join(', ');
                console.log(`     失敗步驟: ${failedSteps}`);
            });
    }
    
    if (testResults.passed === testResults.total) {
        console.log('\n🎉 所有測試都通過了！LINE Bot 到後端的整合流程運作正常。');
    } else {
        console.log('\n⚠️  部分測試失敗，需要檢查相關的 API 連線和資料處理。');
    }
}

/**
 * 執行單一測試案例
 */
async function runSingleTest(storeId, language) {
    console.log('🧪 單一測試案例');
    console.log('=' .repeat(50));
    
    const backendHealthy = await testBackendHealth();
    if (!backendHealthy) {
        console.log('❌ 後端服務不可用');
        return;
    }
    
    const result = await runCompleteTestFlow(storeId, language);
    showFinalResults();
}

// 主程式
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 2) {
        // 執行單一測試案例
        const [storeId, language] = args;
        await runSingleTest(parseInt(storeId), language);
    } else {
        // 執行所有測試案例
        await runAllTests();
    }
}

// 執行主程式
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    runCompleteTestFlow,
    runAllTests,
    testBackendHealth,
    testStoreInfo,
    testMenuAPI,
    testOrderCreation
}; 