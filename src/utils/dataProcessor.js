// src/utils/dataProcessor.js

// 1. 导入所有原始数据文件
import populationRaw from '@/assets/data/11人口 - 总数据和各朝代数据.json';
import waterSystemsRaw from '@/assets/data/02水系 - 总数据和各朝代数据.json';
import adminDivisionsRaw from '@/assets/data/07建制沿革 - 总数据和各朝代数据.json';
import climateRaw from '@/assets/data/03气候 - 总数据和各朝代数据.json';
import vegetationRaw from '@/assets/data/04植被 - 总数据和各朝代数据.json';
import disastersRaw from '@/assets/data/05灾害 - 总数据和各朝代数据.json';
import eventsRaw from '@/assets/data/17事件 - 总数据和各朝代数据.json';
import warsRaw from '@/assets/data/18战争 - 总数据和各朝代数据.json';
import peopleRaw from '@/assets/data/19人物 - 总数据和各朝代数据.json';
//物产和交通数据导入
import productsRaw from '@/assets/data/15物产 - 总数据和各朝代数据.json';
import transportationRaw from '@/assets/data/16交通 - 总数据和各朝代数据.json';
// 2. 导入我们的数据提取器函数
import {
  extractPopulationMetrics,
  extractWaterSystemEvents,
  extractAdminDivisionCounts,
  extractClimateMetrics,
  extractVegetationMetrics,
} from './dataExtractor.js';

/**
 * 辅助函数：统一数据格式，为冲击事件数据添加'type'字段。
 */
function processEvents(eventArray, type) {
  return eventArray.map(item => ({ ...item, type }));
}

/**
 * 异步加载并处理所有项目所需的数据。
 * @returns {Promise<Object|null>} 返回一个包含所有结构化数据的对象。
 */
export async function loadAllData() {
  try {
    // 3. 对原始数据进行处理和转换
    const population = extractPopulationMetrics(populationRaw);
    const waterSystemEvents = extractWaterSystemEvents(waterSystemsRaw);
    const adminDivisionCounts = extractAdminDivisionCounts(adminDivisionsRaw);
    const climate = extractClimateMetrics(climateRaw);
    const vegetation = extractVegetationMetrics(vegetationRaw);

    const ecology = {
        climate,
        vegetation,
        waterSystemEvents, // 将处理后的水系事件也放入ecology对象，方便组件调用
    };

    // 合并所有冲击事件
    const processedDisasters = processEvents(disastersRaw, 'disaster');
    const processedWars = processEvents(warsRaw, 'war');
    const processedEvents = processEvents(eventsRaw, 'event');
    const impactEvents = [...processedDisasters, ...processedWars, ...processedEvents];

    // 4. 返回一个包含所有【结构化】数据的对象
    return {
      population,
      ecology, // 包含所有处理过的生态数据
      adminDivisionCounts,
      impactEvents,
      people: peopleRaw,
      wars: warsRaw, // 保留原始战争数据以供NarrativeGraph使用
      // 需要特定的处理的数据（如地理编码）
      transportation: transportationRaw,
      products: productsRaw,
    };
  } catch (error) {
    console.error("数据加载或处理失败 (Data loading or processing failed):", error);
    return null;
  }
}