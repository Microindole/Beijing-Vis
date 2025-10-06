<template>
  <div class="relations-viz-container">
    <h2>北京地标关系概览</h2>

    <div class="chart-controls">
      <button :class="{ active: currentChartType === 'timeline' }" @click="currentChartType = 'timeline'">
        历史时间线
      </button>
      <button :class="{ active: currentChartType === 'trend' }" @click="currentChartType = 'trend'">
        兴建/消失趋势
      </button>
      <button :class="{ active: currentChartType === 'force' }" @click="currentChartType = 'force'">
        关系网络图
      </button>
    </div>

    <div class="charts-display-area">
      <TimelineChart
          v-if="currentChartType === 'timeline'"
          :landmarksData="landmarksData"
          :highlightedLandmarks="highlightedLandmarks"
      />
      <TrendChart
          v-else-if="currentChartType === 'trend'"
          :landmarksData="landmarksData"
      />
      <ForceChart
          v-else-if="currentChartType === 'force'"
          :landmarksData="landmarksData"
          :relationsData="relationsData"
          :highlightedLandmarks="highlightedLandmarks"
      />
    </div>

    <p class="viz-description">
      切换图表类型以探索不同维度的地标关系。
      <strong v-if="currentChartType === 'force'">提示：双击关系网络图可进入或退出全屏模式。</strong>
    </p>
  </div>
</template>

<script>
// 导入数据和子组件
import { landmarks, relations } from "@/data/landmarkData.js";
import TimelineChart from "./relations/TimelineChart.vue";
import TrendChart from "./relations/TrendChart.vue";
import ForceChart from "./relations/ForceChart.vue";

export default {
  name: "LandmarkRelationsViz",
  components: {
    TimelineChart,
    TrendChart,
    ForceChart,
  },
  data() {
    return {
      currentChartType: "timeline",
      landmarksData: landmarks,
      relationsData: relations,
      highlightedLandmarks: [
        "故宫", "大栅栏", "颐和园", "北海公园",
        "长城", "明十三陵", "天坛", "法源寺",
      ],
    };
  },
};
</script>

<style scoped>
/* 样式部分保持不变 */
.relations-viz-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  background: linear-gradient(145deg, #fefbf5 0%, #f9f3e6 100%);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.15);
  border: 1px solid #d4a76a;
  position: relative;
  overflow: hidden;
}

.relations-viz-container::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  width: 150px;
  height: 150px;
  background-color: rgba(209, 155, 97, 0.1);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
  animation: float1 10s infinite ease-in-out alternate;
}

.relations-viz-container::after {
  content: "";
  position: absolute;
  bottom: -70px;
  right: -70px;
  width: 180px;
  height: 180px;
  background-color: rgba(183, 138, 86, 0.1);
  border-radius: 50%;
  filter: blur(50px);
  z-index: 0;
  animation: float2 12s infinite ease-in-out alternate-reverse;
}

@keyframes float1 {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(20px, 30px) rotate(10deg); }
}

@keyframes float2 {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-20px, -20px) rotate(-10deg); }
}

.relations-viz-container h2 {
  color: #8b4513;
  margin-bottom: 25px;
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.relations-viz-container h2::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #d4a76a, #bd6b20, #d4a76a);
  border-radius: 2px;
}

.chart-controls {
  margin-bottom: 30px;
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
}

.chart-controls button {
  padding: 12px 25px;
  font-size: 17px;
  border: 2px solid #d4a76a;
  border-radius: 25px;
  background-color: #fef8f0;
  color: #8b4513;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.chart-controls button:hover {
  background-color: #f5eedf;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.chart-controls button.active {
  background: linear-gradient(45deg, #bd6b20, #d19b61);
  color: #fff;
  border-color: #bd6b20;
  box-shadow: 0 8px 20px rgba(189, 107, 32, 0.4);
  transform: translateY(-5px);
}

.chart-controls button.active::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: skewX(-30deg);
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.charts-display-area {
  flex-grow: 1;
  width: 100%;
  position: relative;
  min-height: 450px;
  border-radius: 12px;
  background-color: #fefcf7;
  box-shadow: inset 0 2px 10px rgba(139, 69, 19, 0.05);
  border: 1px solid #e8dfd1;
}

.viz-description {
  font-size: 16px;
  color: #7a6b64;
  text-align: center;
  max-width: 800px;
  line-height: 1.7;
  margin-top: 35px;
  margin-bottom: 0;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}
</style>