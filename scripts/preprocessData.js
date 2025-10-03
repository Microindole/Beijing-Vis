// 用于数据预处理的文件

import fs from 'fs';
import path from 'path';

// --- 核心：北京历史地名词典 ---
// 我们预先定义一些关键地点的经纬度。您可以根据需要不断扩充这个列表。
// 注意：古代地名范围很大，这里取其大致中心点作为坐标。
const locationDict = {
    // 古代名称
    '蓟': { lat: 39.95, lon: 116.38 },
    '蓟城': { lat: 39.95, lon: 116.38 },
    '燕京': { lat: 39.92, lon: 116.40 },
    '幽州': { lat: 39.93, lon: 116.35 },
    '大都': { lat: 39.94, lon: 116.40 },
    '中都': { lat: 39.88, lon: 116.35 },
    '析津': { lat: 39.91, lon: 116.38 },
    '京师': { lat: 39.91, lon: 116.40 },
    '北平': { lat: 39.91, lon: 116.40 },
    '顺天府': { lat: 39.91, lon: 116.41 },

    // 现代地标/区域
    '通州': { lat: 39.91, lon: 116.66 },
    '西郊机场': { lat: 39.95, lon: 116.27 },
    '卢沟桥': { lat: 39.85, lon: 116.22 },
    '居庸关': { lat: 40.29, lon: 116.07 },
    '古北口': { lat: 40.68, lon: 117.15 },
    '长安': { lat: 34.26, lon: 108.95 }, // 西安
    '扬州': { lat: 32.39, lon: 119.42 },
    '太原': { lat: 37.87, lon: 112.55 },
};

// 查找文本中包含的第一个已知地名，并返回其坐标
function findLocationInText(text) {
    if (!text) return null;
    for (const name in locationDict) {
        if (text.includes(name)) {
            const loc = locationDict[name];
            return [loc.lon, loc.lat];
        }
    }
    return null;
}

// 主处理函数
function processData() {
    console.log('开始进行数据预处理...');

    const dataDir = path.join(process.cwd(), 'src/assets/data');
    const outputDir = path.join(process.cwd(), 'public/processed_data');

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // --- 处理物产数据 ---
    const productsRawPath = path.join(dataDir, '15物产 - 总数据和各朝代数据.json');
    const productsRaw = JSON.parse(fs.readFileSync(productsRawPath, 'utf-8'));
    const productsProcessed = productsRaw.map(item => {
        const coords = findLocationInText(item['原文']);
        return {
            ...item,
            // 如果找到了坐标，就添加 coordinate 字段
            ...(coords && { coordinate: coords })
        };
    }).filter(item => item.coordinate); // 只保留能定位的物产记录

    const productsOutputPath = path.join(outputDir, '15物产-processed.json');
    fs.writeFileSync(productsOutputPath, JSON.stringify(productsProcessed, null, 2));
    console.log(`物产数据处理完成, ${productsProcessed.length} 条记录被成功定位, 已保存至 ${productsOutputPath}`);


    // --- 处理交通数据 ---
    const transportationRawPath = path.join(dataDir, '16交通 - 总数据和各朝代数据.json');
    const transportationRaw = JSON.parse(fs.readFileSync(transportationRawPath, 'utf-8'));
    const transportationProcessed = transportationRaw.map(item => {
        const text = item['原文'] || item['交通要道'];
        const coords = findLocationInText(text);
        
        // 交通数据特殊处理：我们需要一个起点和终点来画线
        // 这里简化处理：如果文本中包含北京相关的地名，就默认以北京为起点，画一条线到文本中找到的另一个地名
        let lineCoords = null;
        const beijingCenter = [locationDict['京师'].lon, locationDict['京师'].lat];
        
        if (text && (text.includes('幽州') || text.includes('蓟') || text.includes('大都') || text.includes('京师'))) {
            // 查找除北京外的其他地名作为终点
            for (const name in locationDict) {
                if (!['幽州', '蓟', '大都', '京师'].includes(name) && text.includes(name)) {
                    const endLoc = locationDict[name];
                    lineCoords = [beijingCenter, [endLoc.lon, endLoc.lat]];
                    break; 
                }
            }
        }

        return {
            ...item,
            ...(lineCoords && { lineCoords: lineCoords })
        };
    }).filter(item => item.lineCoords); // 只保留能画线的交通记录

    const transportationOutputPath = path.join(outputDir, '16交通-processed.json');
    fs.writeFileSync(transportationOutputPath, JSON.stringify(transportationProcessed, null, 2));
    console.log(`交通数据处理完成, ${transportationProcessed.length} 条记录被成功定位, 已保存至 ${transportationOutputPath}`);

    console.log('数据预处理全部完成！');
}

// 运行主函数
processData();
