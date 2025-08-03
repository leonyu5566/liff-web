#!/usr/bin/env node

/**
 * OCR 菜單辨識 API 測試
 * 測試上傳菜單圖片到後端並生成點餐系統
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 測試配置
const TEST_CONFIG = {
    API_BASE_URL: 'http://localhost:3001',
    TEST_IMAGE_PATH: './test-image.png', // 如果有測試圖片的話
    TEST_LANGUAGES: ['zh-TW', 'en-US', 'ja-JP', 'ko-KR']
};

/**
 * 測試後端健康檢查
 */
async function testBackendHealth() {
    console.log('🔍 測試後端健康檢查...');
    
    try {
        const response = await axios.get(`${TEST_CONFIG.API_BASE_URL}/api/health`);
        
        if (response.status === 200 && response.data.status === 'ok') {
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
 * 模擬上傳菜單圖片
 */
async function testUploadMenuImage(language = 'zh-TW') {
    console.log(`🔍 測試上傳菜單圖片 (語言: ${language})...`);
    
    try {
        // 檢查是否有測試圖片
        if (!fs.existsSync(TEST_CONFIG.TEST_IMAGE_PATH)) {
            console.log('⚠️  沒有找到測試圖片，使用模擬資料測試');
            return testMockOCR(language);
        }
        
        // 讀取圖片檔案
        const imageBuffer = fs.readFileSync(TEST_CONFIG.TEST_IMAGE_PATH);
        
        // 建立 FormData
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', imageBuffer, {
            filename: 'menu.jpg',
            contentType: 'image/jpeg'
        });
        form.append('lang', language);
        form.append('store_id', '999'); // 非合作店家
        
        // 發送請求
        const response = await axios.post(
            `${TEST_CONFIG.API_BASE_URL}/api/upload-menu-image`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                },
                timeout: 30000 // 30 秒超時
            }
        );
        
        if (response.status === 200) {
            console.log('✅ 圖片上傳成功');
            console.log('📋 辨識結果:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            console.log(`❌ 圖片上傳失敗: ${response.status}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ 圖片上傳錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 測試模擬 OCR 功能
 */
async function testMockOCR(language) {
    console.log(`🔍 測試模擬 OCR 功能 (語言: ${language})...`);
    
    try {
        // 建立模擬的圖片資料
        const FormData = require('form-data');
        const form = new FormData();
        
        // 建立一個簡單的測試圖片 (1x1 像素的 PNG)
        const testImageBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
            0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0x00, 0x00,
            0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00, 0x00,
            0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        form.append('image', testImageBuffer, {
            filename: 'test-menu.png',
            contentType: 'image/png'
        });
        form.append('lang', language);
        form.append('store_id', '999');
        
        const response = await axios.post(
            `${TEST_CONFIG.API_BASE_URL}/api/upload-menu-image`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                },
                timeout: 10000
            }
        );
        
        if (response.status === 200) {
            console.log('✅ 模擬 OCR 測試成功');
            console.log('📋 辨識結果:', JSON.stringify(response.data, null, 2));
            return response.data;
        } else {
            console.log(`❌ 模擬 OCR 測試失敗: ${response.status}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ 模擬 OCR 測試錯誤: ${error.message}`);
        return null;
    }
}

/**
 * 測試生成的菜單資料
 */
function testGeneratedMenu(ocrData) {
    console.log('🔍 測試生成的菜單資料...');
    
    if (!ocrData || !ocrData.menu_data) {
        console.log('❌ 沒有菜單資料');
        return false;
    }
    
    const menuData = ocrData.menu_data;
    
    // 檢查基本結構
    if (!menuData.store_name || !menuData.items || !Array.isArray(menuData.items)) {
        console.log('❌ 菜單資料結構不正確');
        return false;
    }
    
    console.log(`✅ 店家名稱: ${menuData.store_name}`);
    console.log(`✅ 菜單項目數量: ${menuData.items.length}`);
    
    // 檢查菜單項目
    menuData.items.forEach((item, index) => {
        if (!item.menu_item_id || !item.item_name || !item.price_small) {
            console.log(`❌ 菜單項目 ${index} 資料不完整`);
            return false;
        }
        
        console.log(`  - ${item.item_name}: NT$ ${item.price_small}`);
    });
    
    console.log('✅ 菜單資料驗證通過');
    return true;
}

/**
 * 測試點餐系統功能
 */
async function testOrderingSystem(menuData) {
    console.log('🔍 測試點餐系統功能...');
    
    try {
        // 選擇一些菜單項目
        const selectedItems = menuData.items.slice(0, 3).map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: item.price_small
        }));
        
        const orderPayload = {
            store_id: 999,
            items: selectedItems,
            language: 'zh-TW'
        };
        
        console.log('📋 模擬訂單:', JSON.stringify(orderPayload, null, 2));
        
        // 發送訂單
        const response = await axios.post(
            `${TEST_CONFIG.API_BASE_URL}/api/orders`,
            orderPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        if (response.status === 200) {
            console.log('✅ 訂單建立成功');
            console.log('📋 訂單結果:', JSON.stringify(response.data, null, 2));
            return true;
        } else {
            console.log(`❌ 訂單建立失敗: ${response.status}`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ 訂單系統測試錯誤: ${error.message}`);
        return false;
    }
}

/**
 * 執行完整的 OCR 測試流程
 */
async function runOCRTestFlow(language) {
    console.log(`\n🚀 開始 OCR 測試流程 - 語言: ${language}`);
    console.log('=' .repeat(50));
    
    const testResult = {
        language: language,
        steps: {
            backend_health: false,
            image_upload: false,
            menu_generation: false,
            ordering_system: false
        },
        details: {}
    };
    
    // 步驟 1: 後端健康檢查
    const backendHealthy = await testBackendHealth();
    testResult.steps.backend_health = backendHealthy;
    
    if (!backendHealthy) {
        console.log('❌ 後端服務不可用，停止測試');
        return testResult;
    }
    
    // 步驟 2: 上傳菜單圖片
    const ocrData = await testUploadMenuImage(language);
    testResult.steps.image_upload = !!ocrData;
    testResult.details.ocr_data = ocrData;
    
    if (!ocrData) {
        console.log('❌ 圖片上傳失敗');
        return testResult;
    }
    
    // 步驟 3: 測試生成的菜單
    const menuValid = testGeneratedMenu(ocrData);
    testResult.steps.menu_generation = menuValid;
    
    if (!menuValid) {
        console.log('❌ 菜單生成失敗');
        return testResult;
    }
    
    // 步驟 4: 測試點餐系統
    const orderingSuccess = await testOrderingSystem(ocrData.menu_data);
    testResult.steps.ordering_system = orderingSuccess;
    
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
 * 執行所有語言測試
 */
async function runAllLanguageTests() {
    console.log('🧪 OCR 菜單辨識測試');
    console.log('=' .repeat(50));
    
    const results = [];
    
    for (const language of TEST_CONFIG.TEST_LANGUAGES) {
        const result = await runOCRTestFlow(language);
        results.push(result);
        
        // 等待一下再執行下一個測試
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 顯示最終結果
    showFinalResults(results);
}

/**
 * 顯示最終測試結果
 */
function showFinalResults(results) {
    console.log('\n' + '=' .repeat(50));
    console.log('📈 最終測試結果');
    console.log('=' .repeat(50));
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`總測試案例: ${totalTests}`);
    console.log(`通過: ${passedTests}`);
    console.log(`失敗: ${failedTests}`);
    console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
        console.log('\n❌ 失敗的測試案例:');
        results.filter(r => !r.success).forEach(result => {
            console.log(`   - 語言: ${result.language}`);
            const failedSteps = Object.entries(result.steps)
                .filter(([_, passed]) => !passed)
                .map(([step, _]) => step)
                .join(', ');
            console.log(`     失敗步驟: ${failedSteps}`);
        });
    }
    
    if (passedTests === totalTests) {
        console.log('\n🎉 所有 OCR 測試都通過了！菜單辨識和點餐系統運作正常。');
    } else {
        console.log('\n⚠️  部分 OCR 測試失敗，需要檢查相關的 API 連線和資料處理。');
    }
}

// 主程式
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 1) {
        // 執行單一語言測試
        const language = args[0];
        const result = await runOCRTestFlow(language);
        showFinalResults([result]);
    } else {
        // 執行所有語言測試
        await runAllLanguageTests();
    }
}

// 執行主程式
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    runOCRTestFlow,
    testBackendHealth,
    testUploadMenuImage,
    testGeneratedMenu,
    testOrderingSystem
}; 