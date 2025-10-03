<template>
  <div class="internal-evolution-view">
    <div v-if="dataStore.isLoading" class="loading-overlay">
      <h2>正在加载可视化数据...</h2>
    </div>
    <template v-else>
      <div class="main-content-grid">
        <div class="map-container card">
          <EvolutionMap />
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
import { onMounted } from 'vue';
import { useDataStore } from '@/stores/useDataStore';
import EvolutionMap from '@/components/analysis/EvolutionMap.vue';
import DataCharts from '@/components/analysis/DataCharts.vue';
import DynastyTimeline from '@/components/analysis/DynastyTimeline.vue';

const dataStore = useDataStore();

onMounted(() => {
  // 仅在数据未加载时获取数据，避免重复加载
  if (dataStore.population.length === 0) {
    dataStore.fetchData();
  }
});
</script>

<style scoped>
.internal-evolution-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px; /* 添加间隙 */
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
  grid-template-columns: 2fr 1fr; /* 地图占2/3，图表占1/3 */
  gap: 16px;
  flex-grow: 1;
  min-height: 0;
}

.timeline-container {
  flex-shrink: 0;
  height: 100px;
  padding: 1rem;
}

.map-container, .charts-container {
  height: 100%;
  min-height: 0;
  padding: 1rem;
}

.card {
  background-color: var(--panel-bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>

