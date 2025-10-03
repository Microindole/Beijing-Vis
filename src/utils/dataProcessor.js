// src/utils/dataProcessor.js

// 1. 导入所有原始数据文件
import waterSystemsRaw from '@/assets/data/02水系 - 总数据和各朝代数据.json';
import climateRaw from '@/assets/data/03气候 - 总数据和各朝代数据.json';
import vegetationRaw from '@/assets/data/04植被 - 总数据和各朝代数据.json';
import disastersRaw from '@/assets/data/05灾害 - 总数据和各朝代数据.json';
import adminHistoryRaw from '@/assets/data/07建制沿革 - 总数据和各朝代数据.json';
import majorBuildingsRaw from '@/assets/data/09重点建筑 - 总数据和各朝代数据.json';
import otherBuildingsRaw from '@/assets/data/10其他建筑 - 总数据和各朝代数据.json';
import populationRaw from '@/assets/data/11人口 - 总数据和各朝代数据.json';
import cultureRaw from '@/assets/data/13文化 - 总数据和各朝代数据.json';
import commerceRaw from '@/assets/data/14商业手工业 -总数据和各朝代数据.json';
import productsRaw from '@/assets/data/15物产 - 总数据和各朝代数据.json';
import trafficRaw from '@/assets/data/16交通 - 总数据和各朝代数据.json';
import eventsRaw from '@/assets/data/17事件 - 总数据和各朝代数据.json';
import warsRaw from '@/assets/data/18战争 - 总数据和各朝代数据.json';
import peopleRaw from '@/assets/data/19人物 - 总数据和各朝代数据.json';

// 2. 导入所有新的数据处理函数
import {
  processWaterData,
  processClimateAndDisasterData,
  processVegetationData,
  processAdminHistoryData,
  processBuildingData,
  processPopulationData,
  processCommerceData,
  processProductData,
  processTrafficData,
  processEventData,
  processWarData,
  processPeopleData,
} from './dataExtractor.js';


/**
 * 异步加载并处理所有项目所需的数据。
 * @returns {Promise<Object|null>} 返回一个包含所有结构化、分类好的数据的对象。
 */
export async function loadAllData() {
  try {
    // 任务一：生态环境
    const water = processWaterData(waterSystemsRaw);
    const climate = processClimateAndDisasterData(climateRaw); // 气候和灾害数据结构相同
    const vegetation = processVegetationData(vegetationRaw);
    const ecology = { water, climate, vegetation };

    // 任务二 & 五：冲击事件与整合叙事
    const disasters = processClimateAndDisasterData(disastersRaw).map(d => ({ ...d, category: '灾害' }));
    const wars = processWarData(warsRaw).map(w => ({ ...w, category: '战争' }));
    const events = processEventData(eventsRaw).map(e => ({ ...e, category: '事件' }));
    const impactEvents = [...disasters, ...wars, ...events].sort((a, b) => a.year - b.year);

    // 任务三：城市内部驱动
    const population = processPopulationData(populationRaw);
    const traffic = processTrafficData(trafficRaw);
    const products = processProductData(productsRaw);
    const internalDynamics = { population, traffic, products };

    // 任务四：治理与经济
    const adminHistory = processAdminHistoryData(adminHistoryRaw);
    const buildings = processBuildingData([...majorBuildingsRaw, ...otherBuildingsRaw]);
    const commerce = processCommerceData(commerceRaw);
    const governanceAndEconomy = { adminHistory, buildings, commerce };
    
    // 附加数据
    const culture = processPopulationData(cultureRaw); // 文化数据结构与人口类似，主要是描述
    const people = processPeopleData(peopleRaw);

    // 返回一个按任务划分的、结构清晰的总数据对象
    return {
      ecology,             // 对应任务一
      impactEvents,        // 对应任务二
      internalDynamics,    // 对应任务三
      governanceAndEconomy,// 对应任务四
      culture,             // 附加
      people,              // 附加
    };

  } catch (error) {
    console.error("Data processing failed:", error);
    return null;
  }
}