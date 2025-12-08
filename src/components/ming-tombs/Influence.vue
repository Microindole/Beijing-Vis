<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">明十三陵的深远影响力</h1>
      <p class="dashboard-subtitle">探究世界文化遗产的当代价值与中华文化传承</p>
    </div>

    <div class="single-column-layout">

      <div class="chart-card radar-section">
        <div class="section-title">
          <h2>明十三陵综合影响力评估</h2>
          <div class="divider"></div>
          <p class="section-description">基于多维度价值的深入分析</p>
        </div>
        <div class="radar-wrapper">
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>
      </div>

      <div class="chart-card">
        <div class="section-title">
          <h2>明十三陵的营建哲学构成</h2>
          <div class="divider"></div>
        </div>
        <div ref="imperialPhilosophyChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <div class="section-title">
          <h2>明十三陵的当代与全球影响力</h2>
          <div class="divider"></div>
        </div>

        <div class="impact-grid-horizontal">
          <div class="impact-item">
            <div class="impact-value">800万+</div>
            <div class="impact-label">年均游客量</div>
          </div>
          <div class="impact-item">
            <div class="impact-value">20+</div>
            <div class="impact-label">国际合作考古项目</div>
          </div>
          <div class="impact-item">
            <div class="impact-value">100+</div>
            <div class="impact-label">文创产品系列</div>
          </div>
          <div class="impact-item">
            <div class="impact-value">500+</div>
            <div class="impact-label">年度学术研究成果</div>
          </div>
        </div>

        <div ref="contemporaryInfluenceChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <div class="section-title">
          <h2>对世界文化遗产保护的贡献</h2>
          <div class="divider"></div>
        </div>
        <div ref="heritageContributionChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <div class="section-title">
          <h2>对明史与丧葬文化研究的推动</h2>
          <div class="divider"></div>
        </div>
        <div ref="researchImpactChart" class="chart-box-wide"></div>
      </div>

    </div>

    <div class="dashboard-footer">
      <p>
        明十三陵不仅是明代帝王陵寝的典范，更是承载中华文明深厚历史、文化与艺术的瑰宝，持续影响着当代社会。
      </p>
      <p>联合国教科文组织世界遗产 · 作为“明清皇家陵寝”的一部分</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import RadarChartBoard from "../RadarChartBoard.vue";

const router = useRouter();
const currentLandmark = "明十三陵";

// ECharts图表引用
const imperialPhilosophyChart = ref(null);
const heritageContributionChart = ref(null);
const researchImpactChart = ref(null);
const contemporaryInfluenceChart = ref(null);

// --- 图表初始化逻辑 (配置保持不变，仅适配容器大小) ---

// 1. 初始化帝陵营建哲学环形图
const initImperialPhilosophyChart = () => {
  if (!imperialPhilosophyChart.value) return;
  const chart = echarts.init(imperialPhilosophyChart.value);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      orient: "horizontal", // 改为水平，放到底部
      bottom: "0",
      left: "center",
      textStyle: { color: "#b8a692", fontSize: 14 },
      data: ["风水堪舆", "皇家礼制", "文化象征"],
    },
    color: ["#B26F4A", "#D4A76A", "#9C7C5C"],
    series: [
      {
        name: "营建哲学",
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "45%"], // 居中
        label: {
          show: true,
          formatter: "{b}\n{d}%",
          color: "#b8a692",
          fontSize: 14
        },
        data: [
          { value: 40, name: "风水堪舆" },
          { value: 35, name: "皇家礼制" },
          { value: 25, name: "文化象征" },
        ],
      },
    ],
  };
  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
};

// 2. 初始化遗产保护贡献柱状图
const initHeritageContributionChart = () => {
  if (heritageContributionChart.value) {
    const chart = echarts.init(heritageContributionChart.value);
    const option = {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["保护修复项目", "国际交流活动"],
        top: 0,
        textStyle: { color: "#b8a692" },
      },
      grid: { left: "3%", right: "4%", bottom: "5%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["陵墓本体", "环境风貌", "遗产监测", "考古研究", "文化传播"],
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#b8a692", interval: 0, rotate: 0 }, // 空间足够，不旋转
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisLabel: { color: "#b8a692" },
        splitLine: { lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" } },
      },
      series: [
        {
          name: "保护修复项目",
          type: "bar",
          barWidth: "25%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#B26F4A" },
              { offset: 1, color: "#D4A76A" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          data: [15, 12, 10, 8, 5],
        },
        {
          name: "国际交流活动",
          type: "bar",
          barWidth: "25%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#9C7C5C" },
              { offset: 1, color: "#E6C68F" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          data: [10, 8, 7, 5, 12],
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 3. 初始化学术研究推动图表
const initResearchImpactChart = () => {
  if (researchImpactChart.value) {
    const chart = echarts.init(researchImpactChart.value);
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: ["论文数量", "研究项目"],
        top: 0,
        textStyle: { color: "#b8a692" },
      },
      grid: { left: "3%", right: "4%", bottom: "5%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#b8a692" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisLabel: { color: '#b8a692' },
        splitLine: { lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" } },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 3, color: "#B26F4A" },
          itemStyle: { color: "#B26F4A" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(178,111,74,0.3)" },
              { offset: 1, color: "rgba(178,111,74,0)" },
            ]),
          },
          data: [20, 45, 80, 150, 280, 450, 600, 750],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "rect",
          symbolSize: 8,
          lineStyle: { width: 3, color: "#9C7C5C" },
          itemStyle: { color: "#9C7C5C" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(156,124,92,0.3)" },
              { offset: 1, color: "rgba(156,124,92,0)" },
            ]),
          },
          data: [5, 12, 25, 40, 70, 110, 160, 220],
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 4. 初始化当代影响力环形图
const initContemporaryInfluenceChart = () => {
  if (contemporaryInfluenceChart.value) {
    const chart = echarts.init(contemporaryInfluenceChart.value);
    const option = {
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: {
        orient: 'horizontal',
        bottom: '0',
        left: 'center',
        textStyle: { color: "#b8a692" },
        itemGap: 15,
        formatter: (name) => name
      },
      color: ["#B26F4A", "#D4A76A", "#9C7C5C", "#E6C68F", "#F0E68C"],
      series: [
        {
          name: "游客来源",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: "{d}%",
            color: "#b8a692",
            position: 'inside'
          },
          data: [
            { value: 65, name: "境内" },
            { value: 15, name: "亚洲" },
            { value: 10, name: "欧洲" },
            { value: 7, name: "北美" },
            { value: 3, name: "其他" },
          ],
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

onMounted(() => {
  initImperialPhilosophyChart();
  initHeritageContributionChart();
  initResearchImpactChart();
  initContemporaryInfluenceChart();
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  color: #e0d6c2;
  font-family: "Noto Serif SC", serif;
  min-height: 100vh;
}

.dashboard-header {
  padding: 50px 20px 30px;
  text-align: center;
  position: relative;
  /* border-bottom: 1px solid rgba(139, 69, 19, 0.1); */
}

.dashboard-title {
  margin: 0.5rem 0 0 0;
  font-size: 2.2rem;
  color: #8b4513;
  /* 深棕色主题 */
  font-weight: bold;
}

.dashboard-subtitle {
  margin: 0.5rem 0 0 0;
  color: #5a4a42;
  font-size: 1.1rem;
}

/* --- 核心布局：单列垂直流式布局 --- */
.single-column-layout {
  max-width: 1000px;
  /* 限制最大宽度，保持整齐 */
  margin: 0 auto 40px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 35px;
  /* 卡片间距 */
}

/* --- 通用卡片样式 --- */
.chart-card {
  background: rgba(42, 34, 34, 0.85);
  /* 深色半透明背景，突显历史感 */
  border: 1px solid rgba(224, 189, 140, 0.2);
  /* 金色边框 */
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 内容居中 */
}

.radar-section {
  min-height: 550px;
  /* 雷达图需要较高空间 */
}

.radar-wrapper {
  width: 100%;
  flex: 1;
}

.radar-container {
  width: 100%;
  height: 100%;
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

.section-title h2 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  color: #d4a76a;
  /* 亮金色标题 */
}

.divider {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, #d4a76a, #8b4513);
  margin: 0 auto;
  border-radius: 2px;
}

.section-description {
  margin: 10px 0 0 0;
  color: #b8a692;
  font-size: 0.95rem;
}

/* --- 通用宽图表盒子 --- */
.chart-box-wide {
  width: 100%;
  height: 350px;
  /* background: rgba(255, 255, 255, 0.05); */
  /* 可选：给图表区域加个微弱背景 */
  border-radius: 8px;
}

/* --- 关键指标 (横向排列) --- */
.impact-grid-horizontal {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.impact-item {
  flex: 1;
  min-width: 180px;
  background: rgba(93, 75, 75, 0.4);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s;
}

.impact-item:hover {
  transform: translateY(-3px);
  background: rgba(93, 75, 75, 0.6);
}

.impact-value {
  font-size: 1.8rem;
  color: #d4a76a;
  font-weight: bold;
  margin-bottom: 5px;
}

.impact-label {
  font-size: 0.9rem;
  color: #e0d6c2;
  opacity: 0.9;
}

/* --- 页脚 --- */
.dashboard-footer {
  padding: 40px 20px;
  text-align: center;
  /* border-top: 1px solid rgba(139, 69, 19, 0.2); */
  font-size: 0.95rem;
  color: #5a4a42;
  margin-top: auto;
}

.dashboard-footer p {
  margin: 5px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .impact-grid-horizontal {
    flex-direction: column;
  }

  .chart-card {
    padding: 20px;
  }

  .chart-box-wide {
    height: 300px;
  }
}
</style>