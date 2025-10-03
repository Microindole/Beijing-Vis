import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 我们现在分开加载原始数据和预处理后的地理数据
const rawDataModules = import.meta.glob('@/assets/data/*.json');

// 加载预处理后的、带有坐标的数据
async function loadProcessedData(fileName) {
  // 注意：预处理后的文件放在 public 目录下，可以直接通过 fetch 获取
  try {
    const response = await fetch(`/processed_data/${fileName}`);
    if (!response.ok) {
        console.error(`无法加载处理后的数据: ${fileName}`);
        return []; // 返回空数组以避免错误
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

export const useDataStore = defineStore('dataStore', () => {
  // --- STATE ---
  const population = ref([]);
  // transportation 和 products 将加载预处理后的数据
  const transportation = ref([]);
  const products = ref([]);
  const beijingGeo = ref(null);

  const activeDynasty = ref('元'); // 默认朝代
  const isLoading = ref(true);

  // --- GETTERS (COMPUTED) ---
  const dynasties = computed(() => {
    const dynastySet = new Set(population.value.map(item => item.时期));
    return Array.from(dynastySet).filter(Boolean); // 过滤掉无效的朝代名称
  });

  const filteredPopulation = computed(() => population.value.filter(d => d.时期 === activeDynasty.value));
  // 这里的筛选逻辑不变，但数据源本身已经包含了坐标信息
  const filteredTransportation = computed(() => transportation.value.filter(d => d.时期 === activeDynasty.value));
  const filteredProduct = computed(() => products.value.filter(d => d.时期 === activeDynasty.value));

  // --- ACTIONS ---
  async function fetchData() {
    isLoading.value = true;
    try {
      // 并行加载所有需要的数据，区分原始数据和处理后数据
      const [pop, geo, transProcessed, prodProcessed] = await Promise.all([
        loadRawData('11人口 - 总数据和各朝代数据.json'),
        loadRawData('beijing.json'),
        loadProcessedData('16交通-processed.json'),
        loadProcessedData('15物产-processed.json')
      ]);
      population.value = pop || [];
      beijingGeo.value = geo || null;
      transportation.value = transProcessed || [];
      products.value = prodProcessed || [];

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
    population,
    transportation,
    products,
    beijingGeo,
    activeDynasty,
    isLoading,
    dynasties,
    filteredPopulation,
    filteredTransportation,
    filteredProduct,
    fetchData,
    setActiveDynasty,
  };
});

