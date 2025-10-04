<template>
  <div class="history-explorer-view">
    <template v-if="!isLoading">
      <main class="main-content-grid">
        <div class="left-panel">
          <div class="tabs">
            <button @click="activeTab = 'impact'" :class="{ active: activeTab === 'impact' }">冲击事件</button>
            <button @click="activeTab = 'ecology'" :class="{ active: activeTab === 'ecology' }">生态变迁</button>
            <button @click="activeTab = 'social'" :class="{ active: activeTab === 'social' }">社会发展</button>
          </div>
          <div v-if="activeTab === 'impact'" class="tab-content">
            <CorrelationCharts
              :events="eventsForMap"
              :dynasty="activeDynasty"
              :population="allData.population"
            />
            <InfoPanel :selected-item="selectedEvent" />
          </div>
          <div v-if="activeTab === 'ecology'" class="tab-content">
            <EcologicalCharts :ecology-data="allData.ecology" :dynasty="activeDynasty" />
          </div>
          <div v-if="activeTab === 'social'" class="tab-content">
            <PopulationChart :population-data="allData.population" :dynasty="activeDynasty" />
          </div>
        </div>
        <div class="right-panel">
          <BeijingHistoryMap
            :events="eventsForMap"
            :highlighted-event-name="highlightedEventName"
            @event-click="handleEventClick"
          />
        </div>
      </main>
      <footer class="footer-controls">
        <TimelineControl @timeline-change="handleTimelineChange" :current-dynasty="activeDynasty" />
      </footer>
    </template>
    <div v-else class="loading-indicator">
      <p>正在加载北京历史时空数据...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// 1. 导入我们的新工具
import { loadAllData } from '@/utils/dataProcessor.js';

import BeijingHistoryMap from '@/components/map/BeijingHistoryMap.vue';
import TimelineControl from '@/components/controls/TimelineControl.vue';
import CorrelationCharts from '@/components/charts/CorrelationCharts.vue';
import InfoPanel from '@/components/common/InfoPanel.vue';
import EcologicalCharts from '@/components/charts/EcologicalCharts.vue';
import PopulationChart from '@/components/charts/PopulationChart.vue'; // 导入新组件

const activeTab = ref('social');

const isLoading = ref(true);
const allData = ref({}); // 2. 用一个对象来存储所有加载的数据
const activeDynasty = ref('');
const highlightedEventName = ref('');
const selectedEvent = ref(null);

onMounted(async () => {
  // 3. onMounted 变得非常简洁
  const loadedData = await loadAllData();
  if (loadedData) {
    allData.value = loadedData;
  }
  isLoading.value = false;
  activeDynasty.value = '元'; // 在数据加载完毕后设定初始朝代
});

// 计算属性现在从 allData.impactEvents 中获取数据
const eventsForMap = computed(() => {
  if (!activeDynasty.value || !allData.value.impactEvents) return [];
  return allData.value.impactEvents.filter(e => e['时期'] === activeDynasty.value);
});

function handleEventClick(eventData) {
  selectedEvent.value = eventData;
  highlightedEventName.value = eventData.name; // 同时高亮该事件
}

function handleTimelineChange(dynasty) {
  activeDynasty.value = dynasty;
  highlightedEventName.value = '';
  selectedEvent.value = null; // 切换朝代时，清空选择
}

function handleNodeClick(nodeData) {
  if (nodeData.dynasty) {
    activeDynasty.value = nodeData.dynasty;
  }
  const eventInAllData = allData.value.impactEvents?.find(e => e['名称'] === nodeData.name);
  if (eventInAllData) {
      highlightedEventName.value = nodeData.name;
      // 模拟地图点击，填充详情面板
      selectedEvent.value = {
          name: eventInAllData['名称'],
          value: [eventInAllData['经度'], eventInAllData['纬度'], eventInAllData.type, eventInAllData['时期']]
      };
  } else {
      highlightedEventName.value = '';
      selectedEvent.value = null;
  }
}
</script>

<style scoped>
.history-explorer-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 从原来的 #f4f7f9 改为透明，以显示 body 的背景色 */
  background-color: transparent;
}

.main-content-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 12px; /* 稍微增大间距 */
  padding: 12px;
  min-height: 0;
}
.left-panel {
  padding: 0;
  display: flex; /* 改为 flex 布局 */
  flex-direction: column;
}

.tabs {
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
}
.tabs button {
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1em;
  color: var(--secondary-text-color);
}
.tabs button.active {
  color: var(--primary-text-color);
  border-bottom: 2px solid var(--header-bg-color);
}

.tab-content {
  flex-grow: 1;
  padding: 15px;
  overflow: auto;
}

.chart-container, .info-container {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  overflow: auto;
}
.info-container {
  border-bottom: none;
}

 .right-panel {
  background: var(--panel-bg-color); /* 应用面板背景色 */
  border-radius: 8px; /* 圆角更大一些，更柔和 */
  border: 1px solid var(--border-color); /* 添加边框 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* 添加细微阴影 */
}

.left-panel {
  padding: 15px;
  gap: 15px;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2em;
  color: var(--secondary-text-color); /* 应用次要文字颜色 */
}

.footer-controls {
  flex-shrink: 0;
  height: 80px;
  padding: 0 20px;
  border-top: 1px solid var(--border-color); /* 应用边框色 */
  background-color: var(--panel-bg-color); /* 应用面板背景色 */
}
</style>