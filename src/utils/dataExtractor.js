// src/utils/dataExtractor.js

/**
 * 提取气候指标。
 * 从长文本中用正则表达式查找温度和降水量。
 * @param {Array} climateRawData - 原始气候JSON数据。
 * @returns {Object} - 返回一个以朝代为键，包含温度和降水量的对象。
 * e.g., { "唐": { temp: 10.5, precip: 600 }, "元": { ... } }
 */
export function extractClimateMetrics(climateRawData) {
  const metricsByDynasty = {};
  
  // 正则表达式，用于匹配 "平均气温xx℃" 和 "降水量xx毫米"
  const tempRegex = /平均气温\s*(\d+(\.\d+)?)\s*℃/g;
  const precipRegex = /降水量\s*(\d+(\.\d+)?)\s*毫米/g;

  for (const entry of climateRawData) {
    const dynasty = entry['时期'];
    if (!dynasty || !entry['原文']) continue;

    if (!metricsByDynasty[dynasty]) {
      metricsByDynasty[dynasty] = {};
    }

    let match;
    // 提取温度
    while ((match = tempRegex.exec(entry['原文'])) !== null) {
      metricsByDynasty[dynasty].temp = parseFloat(match[1]);
    }
    // 提取降水量
    while ((match = precipRegex.exec(entry['原文'])) !== null) {
      metricsByDynasty[dynasty].precip = parseFloat(match[1]);
    }
  }
  return metricsByDynasty;
}

/**
 * 提取植被覆盖率。
 * @param {Array} vegetationRawData - 原始植被JSON数据。
 * @returns {Object} - 返回一个以朝代为键，包含覆盖率的对象。
 * e.g., { "唐": { coverage: 35 }, "元": { ... } }
 */
export function extractVegetationMetrics(vegetationRawData) {
  const metricsByDynasty = {};
  const coverageRegex = /森林覆盖率.*?(\d+(\.\d+)?)\s*%/g;

  for (const entry of vegetationRawData) {
    const dynasty = entry['时期'];
    if (!dynasty || !entry['原文']) continue;
    
    if (!metricsByDynasty[dynasty]) {
      metricsByDynasty[dynasty] = {};
    }

    let match;
    while ((match = coverageRegex.exec(entry['原文'])) !== null) {
      metricsByDynasty[dynasty].coverage = parseFloat(match[1]);
    }
  }
  return metricsByDynasty;
}


/**
 * 从水系数据原文中提取关键事件。
 * @param {Array} waterData - 原始水系JSON数据。
 * @returns {Object} - 按朝代分类的水系事件, e.g., { '元': [{ river: '通惠河', event: '开凿', ... }] }
 */
export function extractWaterSystemEvents(waterData) {
  const keywords = ['改道', '淤塞', '决口', '开凿', '疏浚', '断流', '合流', '废弃', '湮废'];
  const eventsByDynasty = {};

  for (const entry of waterData) {
    if (!entry['时期'] || entry['时期'].includes('?')) continue;

    const dynasty = entry['时期'];
    const river = entry['河流\/水系名称'] || '未知水系';
    
    if (!eventsByDynasty[dynasty]) {
      eventsByDynasty[dynasty] = [];
    }

    const foundKeywords = new Set();
    if (entry['原文']) {
      keywords.forEach(keyword => {
        if (entry['原文'].includes(keyword)) {
          foundKeywords.add(keyword);
        }
      });
    }
    // 也检查 "类型" 字段
    if (entry['类型'] && keywords.includes(entry['类型'])) {
        foundKeywords.add(entry['类型']);
    }


    if (foundKeywords.size > 0) {
       eventsByDynasty[dynasty].push({
        river: river,
        event: Array.from(foundKeywords).join(', '),
        description: entry['原文'] || '无详细描述',
        source: entry['出处']
      });
    }
  }
  return eventsByDynasty;
}

// 人口和建制沿革的数据提取函数 (与上次相同，但为了完整性再次提供)
export function extractPopulationMetrics(populationData) {
  const dynastyData = {};
  const populationRegex = /(\d+(\.\d+)?)\s*万户\s*(\d+(\.\d+)?)\s*万人/g;
  const simplePopulationRegex = /(\d+(\.\d+)?)\s*万(人|户)/g;

  for (const entry of populationData) {
    const dynasty = entry['时期'];
    if (!dynastyData[dynasty]) {
      dynastyData[dynasty] = { a: dynasty, b: 0, c: 0, sources: new Set() };
    }
    
    let match;
    while ((match = populationRegex.exec(entry['原文'])) !== null) {
      const households = parseFloat(match[1]) * 10000;
      const people = parseFloat(match[3]) * 10000;
      if (people > dynastyData[dynasty].b) dynastyData[dynasty].b = Math.round(people);
      if (households > dynastyData[dynasty].c) dynastyData[dynasty].c = Math.round(households);
    }

    while ((match = simplePopulationRegex.exec(entry['原文'])) !== null) {
      const value = parseFloat(match[1]) * 10000;
      if (match[3] === '人' && value > dynastyData[dynasty].b) {
        dynastyData[dynasty].b = Math.round(value);
      }
      if (match[3] === '户' && value > dynastyData[dynasty].c) {
        dynastyData[dynasty].c = Math.round(value);
      }
    }
    dynastyData[dynasty].sources.add(entry['出处']);
  }

  return Object.values(dynastyData)
    .map(d => ({ ...d, sources: Array.from(d.sources) }))
    .filter(d => d.b > 0 || d.c > 0);
}

export function extractAdminDivisionCounts(adminData) {
  const counts = {};
  const regexMap = {
    states: /(\d+)\s*(州)/g,
    prefectures: /(\d+)\s*(郡|府)/g,
    counties: /(\d+)\s*(县)/g,
  };

  for (const entry of adminData) {
    const dynasty = entry['时期'];
    const text = entry['行政划分'] || '';
    
    if (!counts[dynasty]) {
      counts[dynasty] = { a: dynasty, b: 0, c: 0, d: 0 };
    }
    let match;
    while ((match = regexMap.states.exec(text)) !== null) { counts[dynasty].b += parseInt(match[1], 10); }
    while ((match = regexMap.prefectures.exec(text)) !== null) { counts[dynasty].c += parseInt(match[1], 10); }
    while ((match = regexMap.counties.exec(text)) !== null) { counts[dynasty].d += parseInt(match[1], 10); }
  }

  return Object.values(counts).filter(d => d.b > 0 || d.c > 0 || d.d > 0);
}