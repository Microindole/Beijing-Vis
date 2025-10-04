<template>
  <div class="lifecycle-container">
    <!-- 页面标题 -->
    <div class="lifecycle-header">
      <h1>北海公园建筑与功能演变</h1>
      <p class="intro-text">从金代肇建到现代遗产保护的千年皇家园林变迁</p>
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-button">← 返回北海公园门户</button>
      <!-- 状态概览卡片 -->
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">🏯</span>
          <div>
            <h3>主要建筑</h3>
            <p class="status-value">40余处</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">850+年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">🌊</span>
          <div>
            <h3>园林面积</h3>
            <p class="status-value">69公顷</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="lifecycle-main">
      <!-- 时间轴导航 -->
      <div class="timeline-nav">
        <div
          v-for="(item, index) in timelineData"
          :key="index"
          :class="['timeline-point', { active: activeIndex === index }]"
          @click="setActiveIndex(index)"
        >
          <div class="timeline-marker"></div>
          <span class="timeline-year">{{ item.year }}</span>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 时间轴左侧 -->
        <div class="timeline-section">
          <div class="timeline">
            <div class="timeline-line"></div>
            <div
              v-for="(item, index) in timelineData"
              :key="index"
              :class="['timeline-item', { active: activeIndex === index }]"
              @click="handleClick(index, $event)"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-year">{{ item.year }}</div>
              <div class="timeline-title">{{ item.title }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域（弹窗） -->
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>
            <div class="modal-body">
              <!-- 左侧文字内容 -->
              <div class="history-card">
                <div class="history-info">
                  <h2>{{ activeData.title }}</h2>
                  <div class="history-period">{{ activeData.period }}</div>
                  <!-- 显示 JSON 的 description 字段 -->
                  <div class="history-desc">{{ activeData.description }}</div>
                  <div class="history-metrics">
                    <div
                      class="metric"
                      v-for="(metric, idx) in activeData.metrics"
                      :key="idx"
                    >
                      <div class="metric-value">{{ metric.value }}</div>
                      <div class="metric-label">{{ metric.label }}</div>
                    </div>
                  </div>
                  <div
                    class="architectural-features"
                    v-if="activeData.features && activeData.features.length"
                  >
                    <h3>建筑与景观特点</h3>
                    <ul>
                      <li
                        v-for="(feature, idx) in activeData.features"
                        :key="idx"
                      >
                        {{ feature }}
                      </li>
                    </ul>
                    <div class="features-desc" style="margin-top:10px; color:#6b5b3e;">
                      北海公园以“一池三山”格局为核心，建筑布局环湖而设，体现了中国古代皇家园林“借景、对景、障景”等造园手法。主要建筑如白塔、九龙壁、五龙亭等，既有宗教、礼仪功能，也兼具观赏与休憩用途，展现了皇家园林的多样性与艺术性。
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右侧网络图 -->
              <div class="network-section" style="min-width:340px;max-width:500px;">
                <LandmarkNetwork
                  :landmark="{ name: '北海公园' }"
                  :event="timelineData[activeIndex]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 可视化图表区域 -->
      <div class="visualization-section">
        <div class="visualization-card">
          <h3>主要建筑数量变化</h3>
          <div ref="chart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>功能类型分布</h3>
          <div ref="typeChart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>园林格局演变</h3>
          <div ref="patternChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <footer class="lifecycle-footer">
      <p>
        © {{ new Date().getFullYear() }} 北海公园数字文化遗产中心
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import LandmarkNetwork from "../LandmarkNetwork.vue"; // 引入网络图组件
import beihaiData from "../../assets/beihaipark.json"; // 引入北海公园数据

const router = useRouter();
const goBack = () => router.push("/landmarks/beihai-park");

// 使用JSON数据作为时间轴数据源
const timelineData = ref(beihaiData.timeline.map(item => ({
  year: item.year,
  title: item.event,
  event: item.event, // 保留 event 字段，供 LandmarkNetwork 使用
  period: item.year + "年",
  description: item.description,
  metrics: [],
  features: item.features || [], // 这里改为从JSON读取features
  relatedFigures: item.relatedFigures,
  relatedEvents: item.relatedEvents
})));

const isModalOpen = ref(false);
const activeIndex = ref(0);
const activeData = computed(() => timelineData.value[activeIndex.value]);

function handleClick(index, event) {
  activeIndex.value = index;
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}
function setActiveIndex(index) {
  activeIndex.value = index;
  isModalOpen.value = true;
}

// 图表数据
const chart = ref(null);
const typeChart = ref(null);
const patternChart = ref(null);
let chartInstance = null;
let typeChartInstance = null;
let patternChartInstance = null;

// 建筑数量变化数据
const chartData = ref({
  years: timelineData.value.map((item) => item.year),
  sizes: [3, 6, 12, 25, 18, 20], // 示例数据
});

// 功能类型分布数据
const typeData = ref({
  years: timelineData.value.map((item) => item.year),
  types: [
    { name: "宗教建筑", data: [1, 2, 3, 5, 4, 4] },
    { name: "游赏建筑", data: [1, 2, 4, 10, 8, 8] },
    { name: "服务设施", data: [0, 0, 1, 2, 4, 6] },
    { name: "景观构筑", data: [1, 2, 4, 8, 2, 2] },
  ],
});

// 园林格局演变数据（示例）
const patternData = ref({
  years: timelineData.value.map((item) => item.year),
  layout: [
    { name: "一池三山", data: [1, 1, 1, 1, 1, 1] },
    { name: "岛屿扩展", data: [0, 1, 1, 1, 1, 1] },
    { name: "皇家礼仪", data: [1, 1, 1, 1, 0, 0] },
    { name: "公共开放", data: [0, 0, 0, 0, 1, 1] }
  ]
});

// 初始化主要建筑数量变化图表
const initChart = () => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value);
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}年<br/>主要建筑：{c0}处",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.value.years,
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" },
      },
      yAxis: {
        type: "value",
        min: 0,
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: [
        {
          name: "主要建筑",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 4, color: "#4caf50" },
          itemStyle: { color: "#4caf50" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(76,175,80,0.25)" },
              { offset: 1, color: "rgba(76,175,80,0.05)" },
            ]),
          },
          data: chartData.value.sizes,
        },
      ],
    };
    chartInstance.setOption(option);
  }
};

// 初始化功能类型分布图表
const initTypeChart = () => {
  if (typeChart.value) {
    typeChartInstance = echarts.init(typeChart.value);
    const option = {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: typeData.value.types.map((item) => item.name),
        textStyle: { color: "#5a4a42" },
        bottom: 0,
      },
      grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "category",
        data: typeData.value.years,
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: typeData.value.types.map((type, index) => ({
        name: type.name,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: type.data,
        itemStyle: {
          color: ["#4caf50", "#ff9800", "#b3cbb9", "#90caf9"][index],
        },
      })),
    };
    typeChartInstance.setOption(option);
  }
};

// 初始化园林格局演变图表（美观版：面积堆叠图）
const initPatternChart = () => {
  if (patternChart.value) {
    patternChartInstance = echarts.init(patternChart.value);
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: patternData.value.layout.map(item => item.name),
        textStyle: { color: "#5a4a42" },
        bottom: 0,
      },
      grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "category",
        data: patternData.value.years,
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 4,
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: {
          color: "#5a4a42",
          formatter: v => v === 0 ? "" : v
        },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: patternData.value.layout.map((type, index) => ({
        name: type.name,
        type: "line",
        stack: "total",
        areaStyle: {
          opacity: 0.7
        },
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: ["#388e3c", "#bfa46f", "#ca8622", "#91c7ae"][index] },
        itemStyle: { color: ["#388e3c", "#bfa46f", "#ca8622", "#91c7ae"][index] },
        data: type.data,
      })),
    };
    patternChartInstance.setOption(option);
  }
};

watch(activeIndex, (newIndex) => {
  if (chartInstance) {
    chartInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });
    chartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: newIndex,
    });
    chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: newIndex,
    });
  }
  if (typeChartInstance) {
    typeChartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: newIndex,
    });
  }
});

const handleResize = () => {
  if (chartInstance) chartInstance.resize();
  if (typeChartInstance) typeChartInstance.resize();
  if (patternChartInstance) patternChartInstance.resize();
};

onMounted(() => {
  initChart();
  initTypeChart();
  initPatternChart();
  window.addEventListener("resize", handleResize);
});
</script>

<style scoped>
/* 基础容器样式 */
.lifecycle-container {
  font-family: "Noto Serif SC", "SimSun", serif;
  color: #5a4a42;
  background: linear-gradient(to bottom, #f9f5ed, #e8dfd1);
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 头部区域 */
.lifecycle-header {
  text-align: center;
  padding: 60px 20px 30px;
  background: linear-gradient(to right, #b3cbb9, #4caf50);
  position: relative;
  box-shadow: 0 4px 12px rgba(101, 67, 33, 0.15);
  margin-bottom: 30px;
}

.lifecycle-header h1 {
  font-size: 2.3em;
  color: #fff8e1;
  margin-bottom: 8px;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.intro-text {
  font-size: 1.1em;
  color: #fff8e1;
  max-width: 700px;
  margin: 0 auto 15px;
  line-height: 1.6;
  opacity: 0.9;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(76,175,80,0.8);
  color: #fff8e1;
  border: 1px solid #388e3c;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

.back-button:hover {
  background-color: #388e3c;
  transform: translateX(-2px);
}

/* 状态概览卡片 */
.status-overview {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.status-card {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 15px 20px;
  min-width: 160px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.status-icon {
  font-size: 1.8em;
}

.status-card h3 {
  font-size: 0.9em;
  color: #fff8e1;
  margin: 0 0 5px;
  font-weight: normal;
}

.status-value {
  font-size: 1.3em;
  color: white;
  margin: 0;
  font-weight: bold;
}

/* 主要内容区域 */
.lifecycle-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* 时间轴导航 */
.timeline-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 0 auto 40px;
  max-width: 1000px;
  overflow-x: auto;
  padding: 10px 0;
}

.timeline-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.timeline-point.active .timeline-year {
  color: #388e3c;
  font-weight: bold;
  transform: scale(1.1);
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #b3cbb9;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.timeline-point.active .timeline-marker {
  background-color: #388e3c;
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(56, 142, 60, 0.18);
}

.timeline-year {
  font-size: 1rem;
  color: #4caf50;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* 内容包装器 */
.content-wrapper {
  display: flex;
  gap: 30px;
}

/* 时间轴区域 */
.timeline-section {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 20px;
}

.timeline {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 40px 60px;
  height: auto;
  min-height: 120px;
  min-width: 100%;
  white-space: nowrap;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #b3cbb9, #4caf50);
  border-radius: 2px;
  z-index: 1;
}

.timeline-item {
  position: relative;
  min-width: 180px;
  margin-right: 40px;
  padding-top: 60px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(56, 142, 60, 0.08);
  border-radius: 12px;
  z-index: 2;
  transition: all 0.4s ease;
}

.timeline-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-5px);
}

.timeline-item.active {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 30px rgba(56, 142, 60, 0.10);
  transform: translateY(-10px);
}

.timeline-dot {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #b3cbb9;
  border: 3px solid #f5f2e9;
  box-shadow: 0 0 0 4px rgba(179, 203, 185, 0.18);
  transition: all 0.4s ease;
  z-index: 3;
}

.timeline-item.active .timeline-dot {
  background-color: #388e3c;
  width: 22px;
  height: 22px;
  box-shadow: 0 0 0 6px rgba(56, 142, 60, 0.18);
}

.timeline-year {
  font-size: 1.1rem;
  font-weight: bold;
  color: #388e3c;
  margin-bottom: 5px;
}

.timeline-title {
  font-size: 1rem;
  color: #5a4a42;
  line-height: 1.5;
}

/* 历史卡片 */
.history-card {
  flex: 1.2;
  display: flex;
  flex-direction: column;
}

.history-info h2 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #388e3c;
}

.history-period {
  font-size: 16px;
  color: #7cb342;
  margin-bottom: 12px;
}

.history-desc {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  text-align: justify;
}

/* 数据指标 */
.history-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.metric {
  background-color: #e8f5e9;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  min-width: 80px;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #388e3c;
}

.metric-label {
  font-size: 14px;
  color: #7cb342;
}

.architectural-features h3 {
  margin-bottom: 8px;
  color: #388e3c;
}

.architectural-features ul {
  padding-left: 20px;
  list-style: square;
}

.network-section {
  flex: 1;
  background-color: #f2fbe1;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 12px rgba(56, 142, 60, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.network-section img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(56, 142, 60, 0.08);
}

.network-section h3 {
  font-size: 20px;
  color: #388e3c;
  margin-bottom: 12px;
}

/* 可视化图表区域 */
.visualization-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.visualization-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f5ed 100%);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(101, 67, 33, 0.08);
  border: 1px solid rgba(56, 142, 60, 0.08);
}

.visualization-card h3 {
  color: #388e3c;
  font-size: 1.2em;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #b3cbb9;
  text-align: center;
}

.chart-container {
  height: 250px;
  background-color: rgba(255, 253, 245, 0.5);
  border: 1px dashed #b3cbb9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8d6e63;
  position: relative;
}

.chart-container:after {
  content: "";
}

/* 页脚 */
.lifecycle-footer {
  text-align: center;
  padding: 25px 20px;
  margin-top: 50px;
  color: #5a4a42;
  font-size: 0.9em;
  border-top: 1px solid rgba(56, 142, 60, 0.08);
  background-color: rgba(255, 253, 245, 0.7);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    flex-direction: column;
  }
  .timeline-section {
    margin-bottom: 40px;
  }
  .timeline {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  .timeline-line {
    display: none;
  }
  .timeline-item {
    padding: 15px;
    margin-bottom: 10px;
  }
  .timeline-dot {
    display: none;
  }
}

@media (max-width: 768px) {
  .lifecycle-header h1 {
    font-size: 2em;
    padding-top: 10px;
  }
  .status-overview {
    flex-direction: column;
    align-items: center;
  }
  .status-card {
    width: 100%;
    max-width: 250px;
  }
  .visualization-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .lifecycle-header {
    padding: 40px 15px 30px;
  }
  .back-button {
    top: 15px;
    left: 15px;
    padding: 10px 15px;
  }
  .history-metrics {
    flex-direction: column;
    gap: 15px;
  }
  .history-info {
    padding: 20px;
  }
  .chart-container {
    height: 200px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #f4fbe1;
  border-radius: 16px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  font-family: "Serif", "Songti SC", serif;
  color: #3c2f1e;
}

.modal-body {
  display: flex;
  gap: 24px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
