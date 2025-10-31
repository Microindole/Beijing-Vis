<template>
  <div class="lifecycle-container">
    <!-- 页面标题 -->
    <div class="lifecycle-header">
      <h1>长城修筑与功能演变</h1>
      <p class="intro-text">从秦汉初建到明清大修，见证中华民族两千余年的防御智慧与历史变迁</p>
      <!-- 状态概览卡片 -->
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">🧱</span>
          <div>
            <h3>主要关隘</h3>
            <p class="status-value">100余处</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">2200+年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">🌄</span>
          <div>
            <h3>总长度</h3>
            <p class="status-value">2.1万公里</p>
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
                    <h3>防御与地理特点</h3>
                    <ul>
                      <li
                        v-for="(feature, idx) in activeData.features"
                        :key="idx"
                      >
                        {{ feature }}
                      </li>
                    </ul>
                    <div class="features-desc" style="margin-top:10px; color:#6b5b3e;">
                      长城依山就势，因地制宜，结合关隘、敌楼、烽火台等多种防御设施，形成了世界上最庞大的军事防御体系。明长城以砖石结构为主，秦汉时期多为夯土墙体，展现了中国古代工程技术的演进与创新。
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右侧网络图 -->
              <div class="network-section" style="min-width:340px;max-width:500px;">
                <LandmarkNetwork
                  :landmark="{ name: '长城' }"
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
          <h3>主要关隘数量变化</h3>
          <div ref="chart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>防御体系类型分布</h3>
          <div ref="typeChart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>结构与格局演变</h3>
          <div ref="patternChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <footer class="lifecycle-footer">
      <p>
        © {{ new Date().getFullYear() }} 长城数字文化遗产中心
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import LandmarkNetwork from "../LandmarkNetwork.vue";
import greatwallData from "../../assets/greatwall.json";

const router = useRouter();

// 增加更多长城历史时间节点（可根据实际数据进一步丰富）
const timelineData = ref([
  {
    year: -700,
    title: "早期防御墙体出现",
    event: "早期防御墙体出现",
    period: "公元前700年",
    description: "西周、春秋时期，北方诸侯国为防御游牧民族，开始修筑土墙等早期防御设施。",
    metrics: [],
    features: ["夯土墙体", "地势险要", "分散分布"],
    relatedFigures: [],
    relatedEvents: []
  },
  {
    year: -221,
    title: "秦始皇统一修筑",
    event: "秦始皇统一修筑",
    period: "公元前221年",
    description: "秦始皇统一六国后，连接和扩建原有的燕、赵、秦长城，形成中国历史上第一条贯通东西的万里长城雏形。",
    metrics: [],
    features: ["连接燕赵秦旧墙", "夯土结构", "军事防御体系初成"],
    relatedFigures: ["秦始皇", "蒙恬"],
    relatedEvents: ["统一六国", "北击匈奴"]
  },
  {
    year: -104,
    title: "汉武帝西延长城",
    event: "汉代西延",
    period: "公元前104年",
    description: "汉武帝时期，长城向西延伸至河西走廊，加强了对西域的控制，促进了丝绸之路的开通与发展。",
    metrics: [],
    features: ["西延至玉门关", "烽燧密布", "促进中西交流"],
    relatedFigures: ["汉武帝", "卫青", "霍去病"],
    relatedEvents: ["河西走廊开发", "丝绸之路开通"]
  },
  {
    year: 557,
    title: "北齐北周多线防御",
    event: "北齐北周修筑",
    period: "557年",
    description: "南北朝时期，北齐、北周为抵御北方游牧民族入侵，多次修筑和加固长城，形成多重防线。",
    metrics: [],
    features: ["多重防线", "石土混合结构", "防御体系完善"],
    relatedFigures: ["北齐文宣帝", "北周武帝"],
    relatedEvents: ["抵御突厥", "多线防御"]
  },
  {
    year: 1000,
    title: "辽宋金元时期维护",
    event: "辽宋金元维护",
    period: "1000年左右",
    description: "辽、宋、金、元等朝代对长城进行局部修缮和利用，部分地段成为边境线和军事要塞。",
    metrics: [],
    features: ["局部修缮", "边境防御", "多民族融合"],
    relatedFigures: [],
    relatedEvents: []
  },
  {
    year: 1368,
    title: "明代大修长城",
    event: "明代大修",
    period: "1368年",
    description: "明朝为防御蒙古骑兵南侵，历经200余年对长城进行大规模修缮和扩建，形成今天我们所见的砖石结构长城。",
    metrics: [],
    features: ["砖石结构", "敌楼、关隘密集", "防御与交通兼备"],
    relatedFigures: ["朱元璋", "戚继光", "徐达"],
    relatedEvents: ["防御蒙古", "边疆治理"]
  },
  {
    year: 1644,
    title: "清初长城失守",
    event: "清初长城失守",
    period: "1644年",
    description: "明末李自成攻破山海关，清军入关，长城军事防御功能逐渐减弱，成为历史见证。",
    metrics: [],
    features: ["山海关失守", "防御功能减弱"],
    relatedFigures: ["吴三桂"],
    relatedEvents: ["李自成起义", "清军入关"]
  },
  {
    year: 1987,
    title: "列入世界文化遗产",
    event: "世界遗产列名",
    period: "1987年",
    description: "长城被联合国教科文组织列入《世界文化遗产名录》，成为全人类共同保护的文化瑰宝。",
    metrics: [],
    features: ["世界文化遗产", "全球知名旅游地", "中华民族象征"],
    relatedFigures: ["联合国教科文组织"],
    relatedEvents: ["世界遗产申报", "全球保护行动"]
  }
]);

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

// 主要关隘数量变化数据（示例）
const chartData = ref({
  years: timelineData.value.map((item) => item.year),
  sizes: [2, 5, 12, 18, 20, 35, 50, 100], // 节点数与时间轴同步
});

// 防御体系类型分布数据（示例）
const typeData = ref({
  years: timelineData.value.map((item) => item.year),
  types: [
    { name: "墙体", data: [1, 2, 6, 10, 12, 20, 30, 40] },
    { name: "敌楼", data: [0, 1, 2, 3, 4, 8, 12, 20] },
    { name: "烽火台", data: [0, 1, 3, 4, 4, 7, 8, 15] },
    { name: "关隘", data: [0, 1, 1, 2, 2, 4, 6, 10] },
  ],
});

// 结构与格局演变数据（示例）
const patternData = ref({
  years: timelineData.value.map((item) => item.year),
  layout: [
    { name: "夯土结构", data: [1, 1, 1, 1, 1, 0, 0, 0] },
    { name: "砖石结构", data: [0, 0, 0, 0, 0, 1, 1, 1] },
    { name: "多重防线", data: [0, 0, 1, 1, 1, 1, 1, 1] },
    { name: "世界遗产", data: [0, 0, 0, 0, 0, 0, 0, 1] }
  ]
});

// 初始化主要关隘数量变化图表
const initChart = () => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value);
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}年<br/>主要关隘：{c0}处",
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
          name: "主要关隘",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 4, color: "#8b4513" },
          itemStyle: { color: "#8b4513" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(139,69,19,0.25)" },
              { offset: 1, color: "rgba(139,69,19,0.05)" },
            ]),
          },
          data: chartData.value.sizes,
        },
      ],
    };
    chartInstance.setOption(option);
  }
};

// 初始化防御体系类型分布图表
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
          color: ["#8b4513", "#d4a76a", "#bfa46f", "#c0a16c"][index],
        },
      })),
    };
    typeChartInstance.setOption(option);
  }
};

// 初始化结构与格局演变图表
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
        lineStyle: { width: 3, color: ["#8b4513", "#d4a76a", "#bfa46f", "#c0a16c"][index] },
        itemStyle: { color: ["#8b4513", "#d4a76a", "#bfa46f", "#c0a16c"][index] },
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
    /*chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: newIndex,
    });*/
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
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 头部区域 */
.lifecycle-header {
  text-align: center;
  padding: 60px 20px 30px;
  background: linear-gradient(to right, #c19a6b, #b78a56);
  position: relative;
  box-shadow: 0 4px 12px rgba(101, 67, 33, 0.2);
  margin-bottom: 30px;
}

.lifecycle-header h1 {
  font-size: 2.5em;
  color: #fff8e1;
  margin-bottom: 8px;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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
  background-color: rgba(94, 66, 41, 0.8);
  color: #fff8e1;
  border: 1px solid #5d4037;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: rgba(121, 85, 72, 0.9);
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
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  font-size: 1.4em;
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
  color: #8b4513;
  font-weight: bold;
  transform: scale(1.1);
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d4a76a;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.timeline-point.active .timeline-marker {
  background-color: #8b4513;
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(139, 69, 19, 0.2);
}

.timeline-year {
  font-size: 1rem;
  color: #9c7c5c;
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
  padding-bottom: 20px; /* Space for scrollbar */
}

.timeline {
  position: relative;
  display: inline-flex; /* Changed from flex to inline-flex */
  align-items: center;
  padding: 40px 60px; /* Increased horizontal padding */
  height: auto;
  min-height: 120px;
  /* Add these: */
  min-width: 100%; /* Ensure it takes full width */
  white-space: nowrap; /* Prevent items from wrapping */
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #d4a76a, #8b4513);
  border-radius: 2px;
  z-index: 1;
}

/* 时间轴项横向排列 */
.timeline-item {
  position: relative;
  min-width: 180px;
  margin-right: 40px;
  padding-top: 60px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(139, 69, 19, 0.1);
  border-radius: 12px;
  z-index: 2;
  transition: all 0.4s ease;
}

.timeline-item:hover {
  background: rgba(255, 248, 225, 0.8);
  transform: translateY(-5px);
}

.timeline-item.active {
  background: rgba(255, 248, 225, 0.95);
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.15);
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
  background-color: #d4a76a;
  border: 3px solid #f5f2e9;
  box-shadow: 0 0 0 4px rgba(212, 167, 106, 0.3);
  transition: all 0.4s ease;
  z-index: 3;
}

.timeline-item.active .timeline-dot {
  background-color: #8b4513;
  width: 22px;
  height: 22px;
  box-shadow: 0 0 0 6px rgba(139, 69, 19, 0.3);
}

.timeline-year {
  font-size: 1.1rem;
  font-weight: bold;
  color: #8b4513;
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
  color: #6c4f2c;
}

.history-info h2:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #d4a76a 0%, #8b4513 100%);
}

.history-period {
  font-size: 16px;
  color: #9c805a;
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
  background-color: #e8dbc2;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  min-width: 80px;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #5e4123;
}

.metric-label {
  font-size: 14px;
  color: #7e6b4e;
}

.architectural-features h3 {
  margin-bottom: 8px;
  color: #5e4123;
}

.architectural-features ul {
  padding-left: 20px;
  list-style: square;
}

.network-section {
  flex: 1;
  background-color: #f2ebd8;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 12px rgba(100, 80, 40, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.network-section h3 {
  font-size: 20px;
  color: #6a5030;
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
  box-shadow: 0 10px 30px rgba(101, 67, 33, 0.1);
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.visualization-card h3 {
  color: #5d4037;
  font-size: 1.2em;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d4b483;
  text-align: center;
}

.chart-container {
  height: 250px;
  background-color: rgba(255, 253, 245, 0.5);
  border: 1px dashed #8d6e63;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8d6e63;
  position: relative;
}

.chart-container:after {
  position: absolute;
  font-size: 1.1em;
}

/* 页脚 */
.lifecycle-footer {
  text-align: center;
  padding: 25px 20px;
  margin-top: 50px;
  color: #5a4a42;
  font-size: 0.9em;
  border-top: 1px solid rgba(139, 69, 19, 0.15);
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
  background-color: #f4f1e1; /* 米黄色底 */
  border-radius: 16px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
