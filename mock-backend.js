const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 設定 multer 用於檔案上傳
const upload = multer({ dest: 'uploads/' });

// 模擬資料庫
const mockStores = [
    { store_id: 1, store_name: "王阿嬤臭豆腐", partner_level: "A", address: "台北市信義區信義路五段7號" },
    { store_id: 2, store_name: "小李牛肉麵", partner_level: "B", address: "台北市大安區忠孝東路四段1號" },
    { store_id: 3, store_name: "阿婆滷肉飯", partner_level: "C", address: "台北市中山區中山北路一段1號" }
];

const mockMenus = {
    "zh-TW": {
        "store_name": "王阿嬤臭豆腐",
        "items": [
            { "menu_item_id": 101, "item_name": "招牌臭豆腐", "description": "外酥內嫩的發酵豆腐，搭配特製泡菜。", "price_small": 60 },
            { "menu_item_id": 102, "item_name": "珍珠奶茶", "description": "經典台灣手搖飲，Q彈珍珠搭配香濃奶茶。", "price_small": 50 },
            { "menu_item_id": 103, "item_name": "滷肉飯", "description": "香濃滷肉配白飯，經典台灣小吃。", "price_small": 80 }
        ]
    },
    "en-US": {
        "store_name": "Grandma Wang's Stinky Tofu",
        "items": [
            { "menu_item_id": 101, "item_name": "Crispy Stinky Tofu", "description": "Fermented tofu deep-fried to golden perfection.", "price_small": 60 },
            { "menu_item_id": 102, "item_name": "Bubble Milk Tea", "description": "Classic Taiwanese milk tea with tapioca pearls.", "price_small": 50 },
            { "menu_item_id": 103, "item_name": "Braised Pork Rice", "description": "Classic Taiwanese braised pork over rice.", "price_small": 80 }
        ]
    },
    "ja-JP": {
        "store_name": "王おばあちゃんの臭豆腐",
        "items": [
            { "menu_item_id": 101, "item_name": "看板臭豆腐", "description": "外はカリカリ、中はふわふわの発酵豆腐。", "price_small": 60 },
            { "menu_item_id": 102, "item_name": "タピオカミルクティー", "description": "もちもちのタピオカと濃厚なミルクティー。", "price_small": 50 },
            { "menu_item_id": 103, "item_name": "ルーローハン", "description": "台湾の定番料理、香ばしい豚肉とご飯。", "price_small": 80 }
        ]
    },
    "ko-KR": {
        "store_name": "왕 할머니의 냄새나는 두부",
        "items": [
            { "menu_item_id": 101, "item_name": "시그니처 냄새나는 두부", "description": "바삭하고 부드러운 발효 두부, 특제 김치와 함께.", "price_small": 60 },
            { "menu_item_id": 102, "item_name": "버블 밀크티", "description": "클래식 대만 밀크티, 쫄깃한 타피오카 펄과 함께.", "price_small": 50 },
            { "menu_item_id": 103, "item_name": "루루오판", "description": "대만의 대표 음식, 향긋한 돼지고기와 밥.", "price_small": 80 }
        ]
    }
};

// API 路由

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mock backend is running' });
});

// 取得店家列表
app.get('/api/stores', (req, res) => {
    res.json(mockStores);
});

// 取得特定店家資訊
app.get('/api/stores/:id', (req, res) => {
    const storeId = parseInt(req.params.id);
    const store = mockStores.find(s => s.store_id === storeId);
    
    if (store) {
        res.json(store);
    } else {
        res.status(404).json({ error: '店家不存在' });
    }
});

// 取得店家菜單
app.get('/api/menus/:storeId', (req, res) => {
    const storeId = parseInt(req.params.storeId);
    const language = req.query.lang || 'zh-TW';
    
    // 檢查店家是否存在
    const store = mockStores.find(s => s.store_id === storeId);
    if (!store) {
        return res.status(404).json({ error: '店家不存在' });
    }
    
    // 取得對應語言的菜單
    const menu = mockMenus[language];
    if (!menu) {
        return res.status(404).json({ error: '不支援的語言' });
    }
    
    res.json(menu);
});

// 上傳菜單圖片 (OCR)
app.post('/api/upload-menu-image', upload.single('image'), (req, res) => {
    const language = req.body.lang || 'zh-TW';
    const storeId = req.body.store_id;
    
    // 模擬 OCR 處理時間
    setTimeout(() => {
        // 模擬 OCR 結果
        const ocrResults = {
            "zh-TW": [
                { "item_name": "牛肉麵", "price_small": 150 },
                { "item_name": "排骨飯", "price_small": 120 },
                { "item_name": "燙青菜", "price_small": 40 }
            ],
            "en-US": [
                { "item_name": "Beef Noodle Soup", "price_small": 150 },
                { "item_name": "Pork Chop Rice", "price_small": 120 },
                { "item_name": "Blanched Vegetables", "price_small": 40 }
            ],
            "ja-JP": [
                { "item_name": "牛肉麺", "price_small": 150 },
                { "item_name": "トンカツ丼", "price_small": 120 },
                { "item_name": "湯通し野菜", "price_small": 40 }
            ],
            "ko-KR": [
                { "item_name": "소고기 국수", "price_small": 150 },
                { "item_name": "돈까스 덮밥", "price_small": 120 },
                { "item_name": "데친 채소", "price_small": 40 }
            ]
        };
        
        const items = ocrResults[language] || ocrResults['zh-TW'];
        
        res.json({
            success: true,
            message: 'OCR 辨識完成',
            menu_data: {
                store_name: `店家 ${storeId}`,
                items: items.map((item, index) => ({
                    ...item,
                    menu_item_id: `ocr-${Date.now()}-${index}`,
                    description: `OCR 辨識的菜單項目`
                }))
            }
        });
    }, 2000); // 模擬 2 秒處理時間
});

// 建立訂單
app.post('/api/orders', (req, res) => {
    const { store_id, items, language } = req.body;
    
    // 驗證訂單資料
    if (!store_id || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: '訂單資料格式錯誤' });
    }
    
    // 計算總金額
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 模擬訂單建立
    const order = {
        order_id: `ORDER-${Date.now()}`,
        store_id: store_id,
        items: items,
        total_amount: total,
        language: language,
        created_at: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: '訂單建立成功',
        order: order
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Mock backend server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /api/health');
    console.log('  GET  /api/stores');
    console.log('  GET  /api/stores/:id');
    console.log('  GET  /api/menus/:storeId?lang=zh-TW');
    console.log('  POST /api/upload-menu-image');
    console.log('  POST /api/orders');
}); 