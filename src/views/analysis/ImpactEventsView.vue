<script setup>
import {ref, computed, onMounted} from 'vue';
import {useDataStore} from '@/stores/useDataStore';
import EvolutionMap from '@/components/analysis/EvolutionMap.vue';
import DynastyTimeline from '@/components/analysis/DynastyTimeline.vue';
// 确保您已经创建了这个组件
import EventCharts from '@/components/analysis/EventCharts.vue';

const dataStore = useDataStore();
const isReady = ref(false);
onMounted(() => {
  isReady.value = true;
});

// 这个计算属性逻辑保持不变
const filteredImpactEvents = computed(() => {
  // 注意：这里的 filteredDisasters 等是从 store 中获取的经过朝代筛选的 getter
  const disasters = dataStore.filteredDisasters || [];
  const wars = dataStore.filteredWars || [];
  const events = dataStore.filteredEvents || [];

  return [
    ...disasters.map(d => ({...d, visualType: 'disaster'})),
    ...wars.map(w => ({...w, visualType: 'war'})),
    ...events.map(e => ({...e, visualType: 'event'}))
  ];
});
</script>

<template>
  <div class="analysis-view">
    <DynastyTimeline/>
    <div class="main-content">
      <div class="map-container">
        <EvolutionMap v-if="isReady && dataStore.beijingGeo" :scatterData="filteredImpactEvents"/>
        <div v-else class="loading-overlay">正在加载地图数据...</div>
      </div>

      <div class="charts-container">
        <div class="info-card summary-card">
          <div class="card-header">
            <h3>概览信息</h3>
          </div>
          <div class="card-content">
            <div class="summary-item">
              <span class="label">当前朝代:</span>
              <span class="value">{{ dataStore.activeDynasty }}</span>
            </div>
            <div class="summary-item">
              <span class="label">事件记录数:</span>
              <span class="value">{{ filteredImpactEvents.length }} 条</span>
            </div>
          </div>
        </div>

        <div class="info-card viz-card">
          <div class="card-header">
            <h3>冲击事件可视化分析</h3>
          </div>
          <div class="card-content">
            <div v-if="dataStore.isLoading" class="loading-text">正在加载事件数据...</div>
            <div v-else-if="filteredImpactEvents.length === 0" class="no-data-text">
              当前朝代没有冲击事件数据。
            </div>
            <EventCharts v-else :eventsData="filteredImpactEvents"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持整体布局结构 */
.analysis-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.main-content {
  display: flex;
  flex-grow: 1;
}

.map-container {
  width: 65%;
  height: 100%;
  position: relative;
}

/* ==================== 柔和样式修改的核心 ==================== */

/* 1. 为右侧容器设置浅灰色背景 */
.charts-container {
  width: 35%;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5; /* 目标页面的浅灰色背景 */
  box-sizing: border-box;
}

/* 2. 定义卡片样式 */
.info-card {
  background-color: #ffffff; /* 卡片使用白色背景 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* 细微的阴影，营造层次感 */
  margin-bottom: 20px; /* 卡片之间的间距 */
  transition: box-shadow 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 鼠标悬浮时阴影加深 */
}

/* 3. 定义卡片头部样式 */
.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8; /* 头部和内容之间的分割线 */
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 4. 定义卡片内容区样式 */
.card-content {
  padding: 20px;
}

/* 5. 美化概览信息卡片内的具体内容 */
.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.summary-item:not(:last-child) {
  margin-bottom: 12px;
}

.summary-item .label {
  color: #888;
}

.summary-item .value {
  font-weight: 600;
  color: #333;
}

/* 加载和无数据时的提示文本样式 */
.loading-text, .no-data-text {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  color: #555;
  z-index: 10;
}

/* ========================================================== */
</style>