<template>
  <div class="internal-evolution-view">
    <div v-if="dataStore.isLoading" class="loading-overlay">
      <h2>正在加载可视化数据...</h2>
    </div>
    <template v-else>
      <div class="main-content-grid">
        <div class="map-container card">
          <EvolutionMap :events="combinedData" />
        </div>
        <div class="charts-container card">
          <DataCharts />
        </div>
      </div>
      <div class="timeline-container card">
        <DynastyTimeline />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'; // 引入 computed
import { useDataStore } from '@/stores/useDataStore';
import EvolutionMap from '@/components/analysis/EvolutionMap.vue';
import DataCharts from '@/components/analysis/DataCharts.vue';
import DynastyTimeline from '@/components/analysis/DynastyTimeline.vue';

const dataStore = useDataStore();

// --- 这是我们要补充的核心逻辑 ---
// 创建一个计算属性，它会自动响应朝代变化
const combinedData = computed(() => {
  // 从 store 获取筛选好的交通和物产数据
  const transportation = dataStore.filteredTransportation || [];
  const products = dataStore.filteredProduct || [];

  // 将两份数据合并成一个数组，并为每项添加一个 visualType 字段
  // 地图组件将根据这个字段来决定用什么颜色和图例
  return [
    ...transportation.map(item => ({ ...item, visualType: 'transportation' })),
    ...products.map(item => ({ ...item, visualType: 'product' }))
  ];
});
// --- 补充逻辑结束 ---


onMounted(() => {
  if (dataStore.population.length === 0) {
    dataStore.fetchData();
  }
});
</script>

<style scoped>
/* 样式部分保持不变 */
.internal-evolution-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.loading-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--secondary-text-color);
}
.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  flex-grow: 1;
  min-height: 0;
}
.card {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.map-container, .charts-container {
  height: 100%;
}
.timeline-container {
  height: 150px;
  padding: 16px;
}
</style>