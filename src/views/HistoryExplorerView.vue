<template>
  <div class="history-explorer">
    <header class="main-header">
      <h1>析城观史 - 北京历史时空演变可视分析</h1>
    </header>

    <main class="main-content" v-if="isDataLoaded">
      <div class="left-panel">
        <section class="chart-section">
          <h2>生态环境演变</h2>
          <EcologicalCharts :ecologyData="allData.ecology" />
        </section>
        <section class="chart-section">
          <h2>内部驱动因素</h2>
          <PopulationChart :populationData="allData.internalDynamics.population" />
        </section>
      </div>
      
      <div class="center-panel">
        <BeijingHistoryMap 
          :map-data-source="beijingGeoJson" 
          :event-data="allData.impactEvents"
          :current-year="currentYear"
        />
        <TimelineControl 
          :min-year="timeRange.min" 
          :max-year="timeRange.max"
          @year-change="handleYearChange"
        />
      </div>

      <div class="right-panel">
        <section class="chart-section">
          <h2>重大冲击事件</h2>
          <CorrelationCharts :impactData="allData.impactEvents" />
        </section>
        <section class="chart-section">
          <h2>历史叙事图谱</h2>
          <NarrativeGraph :narrativeData="allData.impactEvents" />
        </section>
        </div>
    </main>
    
    <div class="loading-overlay" v-else>
      <p>正在加载北京数千年历史数据，请稍候...</p>
    </div>
  </div>
</template>

<script>
// 1. 导入新的数据加载器和所有组件
import { loadAllData } from '@/utils/dataProcessor.js';
import EcologicalCharts from '@/components/charts/EcologicalCharts.vue';
import CorrelationCharts from '@/components/charts/CorrelationCharts.vue';
import PopulationChart from '@/components/charts/PopulationChart.vue';
import NarrativeGraph from '@/components/charts/NarrativeGraph.vue';
import BeijingHistoryMap from '@/components/map/BeijingHistoryMap.vue';
import TimelineControl from '@/components/controls/TimelineControl.vue';
import InfoPanel from '@/components/common/InfoPanel.vue';

// 导入北京地图的GeoJSON数据
import beijingGeoJson from '@/assets/data/beijing.json';

export default {
  name: 'HistoryExplorerView',
  components: {
    EcologicalCharts,
    CorrelationCharts,
    PopulationChart,
    NarrativeGraph,
    BeijingHistoryMap,
    TimelineControl,
    InfoPanel,
  },
  data() {
    return {
      isDataLoaded: false,
      allData: {}, // 将用来存储所有处理好的数据
      beijingGeoJson: null, // 存储地图数据
      currentYear: 0,
      timeRange: { min: 0, max: 2020 },
      selectedFeature: null,
    };
  },
  async created() {
    // 2. 在组件创建时调用新的数据加载函数
    const loadedData = await loadAllData();
    if (loadedData) {
      this.allData = loadedData;
      this.beijingGeoJson = beijingGeoJson;

      // 3. 计算时间轴的范围
      // 我们从冲击事件数据中找到最早和最晚的年份
      const years = this.allData.impactEvents
        .map(e => e.year)
        .filter(y => y !== null);
      
      this.timeRange.min = Math.min(...years);
      this.timeRange.max = Math.max(...years);
      this.currentYear = this.timeRange.min; // 默认显示最早的年份

      this.isDataLoaded = true;
      console.log('所有数据已加载并注入Vue应用:', this.allData);
    } else {
      console.error('关键数据加载失败，请检查dataProcessor.js和网络连接。');
    }
  },
  methods: {
    // 4. 定义处理时间轴变化的方法
    handleYearChange(newYear) {
      this.currentYear = newYear;
    },
    // 处理图表/地图的点击事件（可选，用于InfoPanel）
    handleFeatureSelect(feature) {
      this.selectedFeature = feature;
    }
  },
};
</script>

<style scoped>
/* 增加一些基本的布局样式 */
.history-explorer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f4f9;
}
.main-header {
  text-align: center;
  padding: 10px;
  background-color: #333;
  color: white;
}
.main-content {
  display: flex;
  flex-grow: 1;
  padding: 10px;
  gap: 10px;
}
.left-panel, .right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.center-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
}
.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.chart-section h2 {
    margin-top: 0;
    font-size: 1.2em;
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1.5em;
}
</style>