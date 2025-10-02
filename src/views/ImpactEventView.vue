<template>
  <div class="impact-event-view">
    <template v-if="!isLoading">
      <main class="main-content-grid">
        <div class="left-panel">
          <CorrelationCharts 
            :events="eventsForMap" 
            :dynasty="activeDynasty"
            :population="allData.population" 
          />
          <NarrativeGraph 
            :dynasty="activeDynasty" 
            :wars="allData.wars" 
            :people="allData.people"
            @node-click="handleNodeClick" 
          />
        </div>
        <div class="right-panel">
          <ImpactEventMap :events="eventsForMap" :highlighted-event-name="highlightedEventName" />
        </div>
      </main>
      <footer class="footer-controls">
        <ImpactEventTimeline @timeline-change="handleTimelineChange" :current-dynasty="activeDynasty" />
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

import ImpactEventMap from '@/components/impact-event/ImpactEventMap.vue';
import ImpactEventTimeline from '@/components/impact-event/ImpactEventTimeline.vue';
import CorrelationCharts from '@/components/impact-event/CorrelationCharts.vue';
import NarrativeGraph from '@/components/impact-event/NarrativeGraph.vue';

const isLoading = ref(true);
const allData = ref({}); // 2. 用一个对象来存储所有加载的数据
const activeDynasty = ref('');
const highlightedEventName = ref('');

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

function handleTimelineChange(dynasty) {
  activeDynasty.value = dynasty;
  highlightedEventName.value = '';
}

function handleNodeClick(nodeData) {
  if (nodeData.dynasty) {
    activeDynasty.value = nodeData.dynasty;
  }
  // 确保从 impactEvents 中查找
  const eventInAllData = allData.value.impactEvents?.find(e => e['名称'] === nodeData.name);
  if (eventInAllData) {
      highlightedEventName.value = nodeData.name;
  } else {
      highlightedEventName.value = '';
  }
}
</script>

<style scoped>
/* 你的样式部分保持不变 */
.impact-event-view {
  display: flex; flex-direction: column; height: 100vh; background-color: #f4f7f9;
}
.main-content-grid {
  flex-grow: 1; display: grid; grid-template-columns: 35% 65%; gap: 10px; padding: 10px; min-height: 0;
}
.left-panel, .right-panel {
  background: #fff; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column;
}
.left-panel {
  padding: 10px; gap: 10px;
}
.loading-indicator {
  display: flex; justify-content: center; align-items: center; height: 100%; font-size: 1.2em; color: #666;
}
.footer-controls {
  flex-shrink: 0; height: 80px; padding: 0 20px; border-top: 1px solid #dcdfe6; background-color: #fff;
}
</style>