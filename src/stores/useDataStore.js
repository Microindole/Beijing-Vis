import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Helper functions (loadProcessedData, loadRawData) remain the same
const rawDataModules = import.meta.glob('@/assets/data/*.json');

async function loadProcessedData(fileName) {
  try {
    const response = await fetch(`/processed_data/${fileName}`);
    if (!response.ok) {
      console.error(`无法加载处理后的数据: ${fileName}`);
      return [];
    }
    return await response.json();
  } catch(e) {
    console.error(`加载处理后的数据失败: ${fileName}`, e);
    return [];
  }
}

async function loadRawData(fileName) {
  const path = `/src/assets/data/${fileName}`;
  if (rawDataModules[path]) {
    const module = await rawDataModules[path]();
    return module.default;
  }
  throw new Error(`原始数据文件未找到: ${fileName}`);
}

// ==================== 1. 定义朝代归一化规则 ====================
// 这里是解决问题的核心。我们定义一个映射表，把所有可能的混乱名称对应到标准名称上。
const DYNASTY_MAP = {
  // 标准名称 -> 别名列表
  "秦汉": ["秦", "汉"],
  "三国两晋南北朝": ["三国", "魏", "蜀", "吴", "晋", "南北朝"],
  "隋唐五代": ["隋", "唐", "五代"],
  "辽宋夏金": ["辽", "宋", "夏", "金"],
  "元": ["元"],
  "明": ["明", "万历", "天启", "崇祯", "洪武", "永乐"],
  "清": ["清", "康熙", "雍正", "乾隆"]
};

// 这个函数会根据上面的规则，将任何输入的名称转换为标准朝代名
function getNormalizedDynasty(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return null; // 如果是空值或不是字符串，则忽略
  }
  for (const [standardDynasty, aliases] of Object.entries(DYNASTY_MAP)) {
    // 检查是否是标准名本身或者包含在别名列表中
    if (rawName === standardDynasty || aliases.some(alias => rawName.includes(alias))) {
      return standardDynasty;
    }
  }
  return null; // 如果找不到匹配的规则，则忽略
}
// =============================================================


export const useDataStore = defineStore('dataStore', () => {
  // --- STATE ---
  const population = ref([]);
  const transportation = ref([]);
  const products = ref([]);
  // 添加您自己的数据 state
  const disasters = ref([]);
  const wars = ref([]);
  const events = ref([]);

  const beijingGeo = ref(null);
  const activeDynasty = ref('总');
  const isLoading = ref(true);

  // --- GETTERS ---
  // ==================== 2. 修改朝代列表的生成逻辑 ====================
  const dynasties = computed(() => {
    // 汇总所有数据源中的“时期”或“dynasty”字段
    const allRawDynasties = [
      ...population.value.map(d => d.时期),
      ...transportation.value.map(d => d.时期),
      ...products.value.map(d => d.时期),
      ...disasters.value.map(d => d.dynasty), // 注意这里用的是 dynasty 字段
      ...wars.value.map(d => d.dynasty),
      ...events.value.map(d => d.dynasty)
    ];

    // 对每一个原始朝代名进行“归一化”处理，并用 Set 去除重复
    const normalizedDynasties = new Set(
        allRawDynasties.map(getNormalizedDynasty).filter(Boolean) // filter(Boolean) 会移除所有 null 的结果
    );

    // 按照我们期望的顺序进行排序
    const sortedDynasties = Array.from(normalizedDynasties).sort((a, b) => {
      const order = ["秦汉", "三国两晋南北朝", "隋唐五代", "辽宋夏金", "元", "明", "清"];
      return order.indexOf(a) - order.indexOf(b);
    });

    return ['总', ...sortedDynasties];
  });
  // ================================================================

  // --- 筛选逻辑现在需要同时适配两种数据结构 ---
  const createFilteredGetter = (dataRef, dynastyField) => {
    return computed(() => {
      if (activeDynasty.value === '总') return dataRef.value;
      return dataRef.value.filter(d => getNormalizedDynasty(d[dynastyField]) === activeDynasty.value);
    });
  };

  const filteredPopulation = createFilteredGetter(population, '时期');
  const filteredTransportation = createFilteredGetter(transportation, '时期');
  const filteredProduct = createFilteredGetter(products, '时期');

  // 为您自己的数据创建筛选器
  const filteredDisasters = createFilteredGetter(disasters, 'dynasty');
  const filteredWars = createFilteredGetter(wars, 'dynasty');
  const filteredEvents = createFilteredGetter(events, 'dynasty');


  // --- ACTIONS ---
  async function fetchData() {
    isLoading.value = true;
    try {
      // 同时加载所有数据
      const [pop, geo, transProcessed, prodProcessed, disastersProcessed, warsProcessed, eventsProcessed] = await Promise.all([
        loadRawData('11人口 - 总数据和各朝代数据.json'),
        loadRawData('beijing.json'),
        loadProcessedData('16交通-processed.json'),
        loadProcessedData('15物产-processed.json'),
        // 加载您自己的数据
        loadProcessedData('my_processed_disasters.json'),
        loadProcessedData('my_processed_wars.json'),
        loadProcessedData('my_processed_events.json')
      ]);

      population.value = pop || [];
      beijingGeo.value = geo || null;
      transportation.value = transProcessed || [];
      products.value = prodProcessed || [];
      // 赋值您自己的数据
      disasters.value = disastersProcessed || [];
      wars.value = warsProcessed || [];
      events.value = eventsProcessed || [];

      if (dynasties.value.length > 0 && !dynasties.value.includes(activeDynasty.value)) {
        activeDynasty.value = dynasties.value.find(d => d === '元') || dynasties.value[0];
      }

    } catch (error) {
      console.error("数据加载失败:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function setActiveDynasty(dynasty) {
    activeDynasty.value = dynasty;
  }

  return {
    // 原始数据
    population, transportation, products, disasters, wars, events,
    // 其他状态
    beijingGeo, activeDynasty, isLoading, dynasties,
    // 筛选后的数据
    filteredPopulation, filteredTransportation, filteredProduct,
    // 导出您自己的筛选后数据
    filteredDisasters, filteredWars, filteredEvents,
    // 方法
    fetchData, setActiveDynasty
  };
});