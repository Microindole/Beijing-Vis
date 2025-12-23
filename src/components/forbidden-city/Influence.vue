<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="router.back()">
        <span class="icon">←</span> 返回
      </button>
      <div class="header-content">
        <h1 class="dashboard-title">帝王秩序与世界影响</h1>
        <div class="subtitle-decoration">
          <span class="dragon-left">🐉</span>
          <span class="line"></span>
          <span class="diamond">❖</span>
          <span class="line"></span>
          <span class="dragon-right">🐉</span>
        </div>
        <p class="dashboard-subtitle">
          从紫禁城规制到全球文化遗产的价值解读
        </p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-icon">🌏</div>
          <div class="metric-info">
            <div class="metric-value">1,500+</div>
            <div class="metric-label">全球文化交流</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📖</div>
          <div class="metric-info">
            <div class="metric-value">60+</div>
            <div class="metric-label">国际教材收录</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">⭐</div>
          <div class="metric-info">
            <div class="metric-value">99%</div>
            <div class="metric-label">游客满意度</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🎓</div>
          <div class="metric-info">
            <div class="metric-value">700+</div>
            <div class="metric-label">年度学术成果</div>
          </div>
        </div>
      </div>

      <div class="charts-grid">

        <div class="chart-card">
          <div class="card-header">
            <h3><span class="decoration-mark"></span>帝王秩序密码</h3>
            <p>紫禁城规划的核心礼制思想</p>
          </div>
          <div class="card-body">
            <div ref="cosmosChart" class="echart-box"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3><span class="decoration-mark"></span>建筑美学辐射</h3>
            <p>中式宫殿元素对东亚建筑的影响</p>
          </div>
          <div class="card-body">
            <div ref="archChart" class="echart-box"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3><span class="decoration-mark"></span>文脉流转不息</h3>
            <p>近三十年故宫学研究热度趋势</p>
          </div>
          <div class="card-body">
            <div ref="cultureChart" class="echart-box"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3><span class="decoration-mark"></span>四海文化共鉴</h3>
            <p>全球访客与文化关注分布</p>
          </div>
          <div class="card-body">
            <div ref="tourismChart" class="echart-box"></div>
          </div>
        </div>

      </div>
    </div>

    <div class="dashboard-footer">
      <p>联合国教科文组织世界遗产 · 编号 439</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

const router = useRouter();

// ECharts 引用
const cosmosChart = ref(null);
const archChart = ref(null);
const cultureChart = ref(null);
const tourismChart = ref(null);

let charts = [];

const initCosmosChart = () => {
  if (!cosmosChart.value) return;
  const chart = echarts.init(cosmosChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c}%" },
    legend: { bottom: "0%", itemGap: 15, textStyle: { color: "#8b5a2b" } },
    color: ["#c91f37", "#d4a76a", "#e8c39e", "#8b5a2b"],
    series: [
      {
        name: "秩序要素",
        type: "pie",
        radius: [20, 100],
        center: ["50%", "45%"],
        roseType: "area",
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
        label: { show: true, color: "#8b5a2b", formatter: "{b}" },
        data: [
          { value: 40, name: "中轴对称" },
          { value: 30, name: "色彩等级" },
          { value: 20, name: "九五之数" },
          { value: 15, name: "前朝后寝" },
          { value: 10, name: "天圆地方" },
        ],
      },
    ],
  };
  chart.setOption(option);
};

const initArchChart = () => {
  if (!archChart.value) return;
  const chart = echarts.init(archChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: "category",
      data: ["中轴布局", "重檐庑殿", "琉璃瓦作", "斗栱结构", "御路丹陛"],
      axisLabel: { interval: 0, rotate: 0, color: "#8b5a2b" },
      axisLine: { lineStyle: { color: "#d4a76a" } },
      axisTick: { show: false }
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        name: "影响指数",
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#c91f37" }, // 红
            { offset: 0.5, color: "#d4a76a" }, // 金
            { offset: 1, color: "#fdfbf5" } // 渐变到底部
          ]),
          borderRadius: [10, 10, 0, 0]
        },
        label: { show: true, position: 'top', color: "#c91f37", fontWeight: 'bold' },
        data: [95, 88, 82, 75, 70],
      },
      {

        type: 'bar',
        barGap: '-100%',
        barWidth: '40%',
        itemStyle: { color: 'rgba(212, 167, 106, 0.1)', borderRadius: [10, 10, 0, 0] },
        data: [100, 100, 100, 100, 100],
        animation: false,
        tooltip: { show: false }
      }
    ],
  };
  chart.setOption(option);
};

const initCultureChart = () => {
  if (!cultureChart.value) return;
  const chart = echarts.init(cultureChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2024"],
      axisLine: { lineStyle: { color: "#d4a76a" } },
      axisLabel: { color: "#8b5a2b" }
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(212, 167, 106, 0.3)' } },
      axisLabel: { color: "#8b5a2b" }
    },
    series: [
      {
        name: "学术论文",
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 0 },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(201, 31, 55, 0.8)" },
            { offset: 1, color: "rgba(212, 167, 106, 0.1)" }
          ])
        },
        data: [120, 200, 350, 600, 1200, 2400, 3800, 5200]
      }
    ]
  };
  chart.setOption(option);
};

// 4. 万国来朝 (双层环形图)
const initTourismChart = () => {
  if (!tourismChart.value) return;
  const chart = echarts.init(tourismChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c}%" },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemGap: 20,
      textStyle: { color: "#8b5a2b" }
    },
    series: [
      {
        name: "访问来源",
        type: "pie",
        radius: ["50%", "70%"], // 环形
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#c91f37'
          }
        },
        data: [
          { value: 65, name: "中国内地", itemStyle: { color: "#c91f37" } },
          { value: 15, name: "东亚/东南亚", itemStyle: { color: "#d4a76a" } },
          { value: 10, name: "欧洲地区", itemStyle: { color: "#e8c39e" } },
          { value: 6, name: "北美地区", itemStyle: { color: "#8b5a2b" } },
          { value: 4, name: "其他", itemStyle: { color: "#ccc" } },
        ]
      }
    ]
  };
  chart.setOption(option);
};

onMounted(() => {
  initCosmosChart();
  initArchChart();
  initCultureChart();
  initTourismChart();

  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  charts.forEach(chart => chart && chart.resize());
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  charts.forEach(chart => chart && chart.dispose());
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #fdfbf5;
  background-image:
      radial-gradient(#d4a76a 1px, transparent 1px),
      radial-gradient(#d4a76a 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
  color: #4a3b3b;
  font-family: "Noto Serif SC", "Songti SC", serif;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  position: relative;
  padding: 2rem;
  text-align: center;
  background: #fff;
  border-bottom: 4px solid #8b0000; /* 宫墙红底边 */
  box-shadow: 0 4px 20px rgba(139, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.back-button {
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid #d4a76a;
  color: #8b5a2b;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}
.back-button:hover {
  background: #8b0000;
  color: #fff;
  border-color: #8b0000;
}

.dashboard-title {
  font-size: 2.8rem;
  color: #8b0000;
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
  color: #d4a76a;
  font-size: 1.2rem;
}
.subtitle-decoration .line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4a76a, transparent);
}

.dashboard-subtitle {
  color: #5d4b4b;
  font-size: 1.1rem;
  margin: 0;
  letter-spacing: 1px;
}

.dashboard-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.metric-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-top: 4px solid #d4a76a; /* 金顶 */
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s, box-shadow 0.3s;
}
.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(139, 0, 0, 0.1);
}

.metric-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fcf6e9, #f0e6d2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  border: 1px solid #e8d8c3;
  color: #8b0000;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 2rem;
  font-weight: 800;
  color: #8b0000;
  line-height: 1.1;
  font-family: "Cinzel", serif; /* 如果有西文字体 */
}

.metric-label {
  font-size: 0.95rem;
  color: #888;
  margin-top: 4px;
}

/* 2. 主图表区域：2x2 网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  border: 1px solid rgba(212, 167, 106, 0.2);
  display: flex;
  flex-direction: column;
  height: 420px; /* 固定高度 */
  overflow: hidden;
  position: relative;
}

.chart-card::after {
  content: "";
  position: absolute;
  top: 0; right: 0;
  width: 40px; height: 40px;
  background: linear-gradient(135deg, transparent 50%, rgba(212, 167, 106, 0.1) 50%);
  pointer-events: none;
}

.card-header {
  padding: 1.2rem 1.5rem 0.8rem;
  border-bottom: 1px solid #f9f9f9;
  background: linear-gradient(to right, #fff, #fdfbf5);
}

.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #4a3b3b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.decoration-mark {
  width: 4px;
  height: 20px;
  background: #8b0000;
  display: inline-block;
  border-radius: 2px;
}

.card-header p {
  margin: 0.4rem 0 0 14px;
  color: #999;
  font-size: 0.9rem;
}

.card-body {
  flex: 1;
  padding: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.echart-box {
  width: 100%;
  height: 100%;
}

/* 底部 */
.dashboard-footer {
  text-align: center;
  padding: 1rem;
  color: #d4a76a;
  font-size: 0.9rem;
  margin-top: auto;
  opacity: 0.8;
}


@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr; /* 单列 */
  }
  .chart-card {
    height: 380px;
  }
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }
  .dashboard-title {
    font-size: 1.8rem;
  }
  .back-button {
    position: static;
    transform: none;
    margin-bottom: 1rem;
    display: inline-flex;
  }
  .dashboard-header {
    text-align: left;
    padding: 1.5rem;
  }
  .subtitle-decoration {
    justify-content: flex-start;
  }
}
</style>