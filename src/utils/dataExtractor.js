// src/utils/dataExtractor.js

/**
 * =================================================================================
 * 核心工具函数：智能解析年份
 * 从各种不规则的文本中提取公元年份。这是一个关键的辅助函数，被下面的所有处理函数使用。
 * @param {...string} textSources - 一个或多个可能包含年份的字符串。
 * @returns {number|null} - 返回一个4位数的年份数字，如果找不到则返回null。
 * =================================================================================
 */
function parseYear(...textSources) {
  // 匹配(1234)或[1234]或【1234】中的年份，优先级最高
  const bracketYearRegex = /[\[【(（](\d{4})[\]】)）]/;
  // 匹配YYYY年
  const standardYearRegex = /(\d{4})\s*年/;
  // 匹配任意4位数字，作为最后的备用方案
  const fallbackYearRegex = /(\d{4})/;

  for (const text of textSources) {
    if (!text || typeof text !== 'string') continue;

    let match = text.match(bracketYearRegex);
    if (match) return parseInt(match[1], 10);

    match = text.match(standardYearRegex);
    if (match) return parseInt(match[1], 10);
    
    match = text.match(fallbackYearRegex);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

// --- 以下是为每一个JSON文件定制的数据处理函数 ---

/**
 * [文件 02] 处理水系数据
 */
export function processWaterData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    river: item['河流\/水系名称'] || '未知',
    type: item['类型'] || '记录',
    description: item['水系总体描述的原文'],
    source: item['出处'],
  })).filter(item => item.description);
}

/**
 * [文件 03] 处理气候数据
 */
export function processClimateData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['灾害时间'], item['时期']),
    dynasty: item['时期'],
    type: item['灾害类型'] || '气候现象',
    description: item['灾害总体描述原文'],
    impact: item['灾害后果、影响'],
    source: item['出处'],
  })).filter(item => item.year && item.description);
}

/**
 * [文件 04] 处理植被数据
 */
export function processVegetationData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    location: item['植被分布'],
    type: item['植被类型'],
    density: item['植被疏密情况'],
    description: item['植被总体描述原文'],
    source: item['出处'],
  })).filter(item => item.description);
}

/**
 * [文件 05] 处理灾害数据
 */
export function processDisasterData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['灾害时间'], item['时期']),
    dynasty: item['时期'],
    type: item['灾害类型'] || '未知灾害',
    description: item['灾害总体描述原文'],
    impact: item['灾害后果、影响'],
    source: item['出处'],
  })).filter(item => item.year && item.description);
}

/**
 * [文件 07] 处理建制沿革数据
 */
export function processAdminHistoryData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    change: item['行政划分'] || item['建制沿革总体描述原文'],
    description: item['建制沿革总体描述原文'],
    source: item['出处'],
  })).filter(item => item.change);
}

/**
 * [文件 09 & 10] 处理建筑数据 (重点建筑和其他建筑)
 */
export function processBuildingData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期'], item['建成时间']),
    dynasty: item['时期'],
    name: item['建筑名称'],
    category: item['建筑类别'],
    description: item['建筑描述原文'] || item['城市建筑总体描述'],
    source: item['出处'],
  })).filter(item => item.name && item.description);
}

/**
 * [文件 11] 处理人口数据
 */
export function processPopulationData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    description: item['原文'],
    source: item['出处'],
  })).filter(item => item.description);
}

/**
 * [文件 13] 处理文化数据 (新增)
 */
export function processCultureData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    description: item['原文'],
    source: item['出处'],
  })).filter(item => item.description);
}

/**
 * [文件 14] 处理商业手工业数据
 */
export function processCommerceData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    type: item['商业手工业类型'],
    description: item['原文'],
    source: item['出处'],
  })).filter(item => item.type && item.description);
}

/**
 * [文件 15] 处理物产数据
 */
export function processProductData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    type: item['物产类型'],
    description: item['原文'],
    source: item['出处'],
  })).filter(item => item.type && item.description);
}

/**
 * [文件 16] 处理交通数据
 */
export function processTrafficData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['时期']),
    dynasty: item['时期'],
    route: item['交通要道'],
    vehicle: item['交通工具'],
    description: item['原文'],
    source: item['出处'],
  })).filter(item => item.year && item.description);
}

/**
 * [文件 17] 处理大事件数据
 */
export function processEventData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['公元纪年']),
    dynasty: item['朝代'],
    name: item['事件概括'],
    location: item['事件地点'],
    people: item['事件涉及的人物'],
    description: item['事件原文'],
    source: item['出处'],
  })).filter(item => item.year && item.name);
}

/**
 * [文件 18] 处理战争数据
 */
export function processWarData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['战争时间']),
    dynasty: item['时期'],
    name: item['战争名称'] || '未命名军事行动',
    location: item['战争地点'],
    parties: item['交战双方'],
    description: item['战争描述原文'],
    source: item['出处'],
  })).filter(item => item.year && item.description);
}

/**
 * [文件 19] 处理人物数据
 */
export function processPeopleData(rawData) {
  return rawData.map(item => ({
    year: parseYear(item['生年'], item['时期']), // 尝试从生年或时期获取一个关联年份
    dynasty: item['时期'],
    name: item['姓名'],
    title: item['身份'],
    bio: item['人物介绍'] || item['该人物在北京的活动'],
    source: item['出处'],
  })).filter(item => item.name && item.bio);
}