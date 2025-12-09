<template>
  <div class="influence-container">
    <div class="influence-header">
      <h1>明十三陵的深远影响力</h1>
      <p>探究世界文化遗产的当代价值与中华文化传承</p>
    </div>

    <div class="charts-grid-layout">

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">核心价值综合评估</h3>
        </div>
        <div class="chart-box">
          <MingTombsRadar />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">陵寝营建哲学构成</h3>
        </div>
        <div ref="imperialPhilosophyChart" class="chart-box"></div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">遗产保护与国际交流</h3>
        </div>
        <div ref="heritageContributionChart" class="chart-box"></div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">当代游客来源分布</h3>
        </div>
        <div ref="contemporaryInfluenceChart" class="chart-box"></div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">定陵出土文物分类</h3>
        </div>
        <div class="chart-box">
          <MingArtifactsSunburst />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">保护重心演变趋势</h3>
        </div>
        <div class="chart-box">
          <MingProtectionStream />
        </div>
      </div>

    </div>

    <div class="wide-chart-section">
      <div class="chart-card wide-card-inner">
        <div class="card-header">
          <h3 class="chart-title">明史与丧葬文化研究趋势 (1990-2023)</h3>
        </div>
        <div ref="researchImpactChart" class="chart-box-wide"></div>
      </div>
    </div>

    <div class="global-impact">
      <h2>明十三陵的当代与全球影响力</h2>
      <div class="impact-grid">
        <div class="impact-item">
          <div class="impact-value">800万+</div>
          <div class="impact-label">年均游客量</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">20+</div>
          <div class="impact-label">国际合作项目</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">100+</div>
          <div class="impact-label">文创产品系列</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">500+</div>
          <div class="impact-label">年度学术成果</div>
        </div>
      </div>
    </div>

    <div class="influence-footer">
      <p>
        明十三陵不仅是明代帝王陵寝的典范，更是承载中华文明深厚历史、文化与艺术的瑰宝。
      </p>
      <p>联合国教科文组织世界遗产 · 明清皇家陵寝</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

// 引入组件
import MingTombsRadar from "./MingTombsRadar.vue";
import MingArtifactsSunburst from "./MingArtifactsSunburst.vue"; // 新增
import MingProtectionStream from "./MingProtectionStream.vue";   // 新增

const router = useRouter();

// ECharts图表引用
const imperialPhilosophyChart = ref(null);
const heritageContributionChart = ref(null);
const researchImpactChart = ref(null);
const contemporaryInfluenceChart = ref(null);

// 1. 营建哲学
const initImperialPhilosophyChart = () => {
  if (!imperialPhilosophyChart.value) return;
  const chart = echarts.init(imperialPhilosophyChart.value);
  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: "#5a4a42", fontSize: 11 }
    },
    color: ["#B26F4A", "#D4A76A", "#9C7C5C"],
    series: [{
      name: "营建哲学",
      type: "pie",
      radius: ["40%", "65%"],
      center: ["50%", "45%"],
      label: { show: false },
      data: [
        { value: 40, name: "风水堪舆" },
        { value: 35, name: "皇家礼制" },
        { value: 25, name: "文化象征" },
      ],
    }],
  };
  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
};

// 2. 遗产保护
const initHeritageContributionChart = () => {
  if (heritageContributionChart.value) {
    const chart = echarts.init(heritageContributionChart.value);
    const option = {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { color: "#5a4a42", fontSize: 11 } },
      grid: { left: "3%", right: "4%", bottom: "25px", top: "10%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["本体", "环境", "监测", "考古", "传播"],
        axisLabel: { color: "#5a4a42", interval: 0, fontSize: 11 },
        axisTick: { show: false }
      },
      yAxis: { show: false },
      series: [
        {
          name: "保护项目",
          type: "bar",
          barWidth: "30%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#B26F4A" }, { offset: 1, color: "#D4A76A" }]),
            borderRadius: [4, 4, 0, 0],
          },
          data: [15, 12, 10, 8, 5],
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 3. 学术研究 (修复图例显示问题)
const initResearchImpactChart = () => {
  if (researchImpactChart.value) {
    const chart = echarts.init(researchImpactChart.value);
    const option = {
      tooltip: { trigger: "axis" },
      // 修复图例：显示指定内容，置于右上角，防止与标题冲突
      legend: {
        data: ["论文数量", "研究项目"],
        top: 0,
        right: 10,
        textStyle: { color: "#5a4a42" }
      },
      // 增加 grid.top，给图例留出空间
      grid: { left: "3%", right: "3%", bottom: "3%", top: "40px", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#5a4a42" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" } },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(178,111,74,0.3)" }, { offset: 1, color: "rgba(178,111,74,0)" }]),
          },
          lineStyle: { width: 3, color: "#B26F4A" },
          data: [20, 45, 80, 150, 280, 450, 600, 750],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#9C7C5C" },
          data: [5, 12, 25, 40, 70, 110, 160, 220],
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 4. 当代游客
const initContemporaryInfluenceChart = () => {
  if (contemporaryInfluenceChart.value) {
    const chart = echarts.init(contemporaryInfluenceChart.value);
    const option = {
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: "#5a4a42", fontSize: 11 }
      },
      color: ["#B26F4A", "#D4A76A", "#9C7C5C", "#E6C68F"],
      series: [{
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "45%"],
        label: { show: false },
        data: [
          { value: 65, name: "境内" },
          { value: 15, name: "亚洲" },
          { value: 10, name: "欧洲" },
          { value: 10, name: "其他" },
        ],
      }],
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
.influence-container {
  font-family: "Noto Serif SC", serif;
  background: #fcf9f2;
  /* 统一浅米色背景 */
  padding: 20px;
  color: #333;
  min-height: 100vh;
}

.influence-header {
  text-align: center;
  padding: 40px 20px 30px;
}

.influence-header h1 {
  font-size: 2.2rem;
  color: #8b4513;
  margin-bottom: 12px;
  font-weight: bold;
}

.influence-header p {
  color: #5a4a42;
  font-size: 1.1rem;
}

/* --- 1. 核心网格布局 --- */
.charts-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 340px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto 24px;
}

/* --- 2. 宽幅图表区域 (独立容器) --- */
.wide-chart-section {
  max-width: 1200px;
  margin: 0 auto 60px;
  /* 增加底部间距，防止与下方数据条重叠 */
  height: 400px;
}

.wide-card-inner {
  height: 100%;
  width: 100%;
}

/* --- 卡片通用样式 --- */
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.06);
  border: 1px solid rgba(139, 69, 19, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  text-align: center;
  margin-bottom: 15px;
  flex-shrink: 0;
  height: 30px;
}

.chart-title {
  color: #8b4513;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
  line-height: 30px;
}

.chart-box,
.chart-box-wide {
  flex: 1;
  width: 100%;
  min-height: 0;
}

/* --- 全球影响数据条 --- */
.global-impact {
  margin: 20px auto 40px;
  /* 顶部保持一定间距 */
  max-width: 1200px;
  padding: 30px 40px;
  background: #8b4513;
  border-radius: 16px;
  text-align: center;
  color: white;
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.2);
}

.global-impact h2 {
  margin-bottom: 25px;
  font-size: 1.4rem;
  color: #fff8e1;
}

.impact-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.impact-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex: 1;
  min-width: 160px;
  transition: transform 0.3s;
}

.impact-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.impact-value {
  font-size: 1.8rem;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #d4a76a;
}

.impact-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.influence-footer {
  text-align: center;
  padding: 20px;
  color: #5a4a42;
  font-size: 0.9rem;
  border-top: 1px solid rgba(139, 69, 19, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .charts-grid-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
  }

  .impact-grid {
    flex-direction: column;
  }
}
</style>