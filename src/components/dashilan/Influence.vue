<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">大栅栏：京味市井的百年变迁与现代活力</h1>
      <p class="dashboard-subtitle">
        探索北京前门外的历史街区，感受传统商业与民俗文化的魅力
      </p>
    </div>

    <!-- 1) 2×2 网格：只放 4 张卡（按参考代码结构与样式命名） -->
    <div class="charts-grid-layout">
      <!-- 雷达 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">大栅栏区域价值综合评估</h3>
        </div>
        <div class="chart-box">
          <DashilanRadar />
          <!-- 如果你真实组件名是 DashilanRadar，就改为：
          <DashilanRadar />
          -->
        </div>
      </div>

      <!-- 商业业态构成（原 imperialPhilosophyChart） -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">大栅栏的市井文化与商业特色</h3>
        </div>
        <div ref="imperialPhilosophyChart" class="chart-box"></div>
      </div>

      <!-- 城市更新影响（原 archChart） -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">对城市更新模式的影响</h3>
        </div>
        <div ref="archChart" class="chart-box"></div>
      </div>

      <!-- 非遗传承推动（原 cultureChart） -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">对非遗传承与研究的推动</h3>
        </div>
        <div ref="cultureChart" class="chart-box"></div>
      </div>
    </div>

    <!-- 2) 宽幅 researchChart（跨两列） -->
    <div class="wide-chart-section">
      <div class="chart-card wide-card-inner">
        <div class="card-header">
          <h3 class="chart-title">大栅栏研究与活化趋势（2010-2024）</h3>
        </div>
        <div ref="researchChart" class="chart-box-wide"></div>
      </div>
    </div>

    <!-- 3) 全球影响力数据条（按参考代码 global-impact 样式） -->
    <div class="global-impact">
      <h2>大栅栏的当代影响力与传承</h2>
      <div class="impact-grid">
        <div class="impact-item">
          <div class="impact-value">100+</div>
          <div class="impact-label">活态文化遗产项目</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">80%+</div>
          <div class="impact-label">游客满意度</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">500万+</div>
          <div class="impact-label">年均游客量</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">30+</div>
          <div class="impact-label">媒体关注度提升 (%)</div>
        </div>
      </div>
    </div>

    <div class="dashboard-footer">
      <p>
        大栅栏，作为北京传统商业和市井文化的缩影，在历史的演进中不断焕发新生，成为展现京味儿生活的重要窗口。
      </p>
      <p>北京历史文化街区 · 国家级非物质文化遗产集聚区</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
// 你原来引入了 router / watch / computed / RadarChartBoard 但并未使用，按参考代码风格删掉以免干扰
// import { useRouter } from "vue-router";
// import RadarChartBoard from "../RadarChartBoard.vue";

// 雷达组件：你模板里写的是 Da，请按你的实际文件改
import DashilanRadar from "./DashilanRadar.vue";
// 如果你真实组件名为 DashilanRadar：
// import DashilanRadar from "./DashilanRadar.vue";

/** refs */
const imperialPhilosophyChart = ref(null);
const archChart = ref(null);
const cultureChart = ref(null);
const researchChart = ref(null);

/** echarts instances（用于统一 resize / dispose） */
let cosmosInstance = null;
let archInstance = null;
let cultureInstance = null;
let researchInstance = null;

/** 统一 resize handler（避免匿名函数 remove 无效、重复监听） */
const handleResize = () => {
  cosmosInstance && cosmosInstance.resize();
  archInstance && archInstance.resize();
  cultureInstance && cultureInstance.resize();
  researchInstance && researchInstance.resize();
};

/** 1) 商业业态构成环形图（你原逻辑不改，只做 init/resize/dispose 规范化） */
const initCosmosChart = () => {
  if (!imperialPhilosophyChart.value) return;

  cosmosInstance?.dispose();
  cosmosInstance = echarts.init(imperialPhilosophyChart.value);

  const option = {
    title: {
      text: "大栅栏商业业态构成",
      left: "center",
      top: "5%",
      textStyle: {
        color: "#4a4a4a",
        fontSize: 20,
        fontWeight: "bold"
      }
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: { color: "#5a4a42", fontSize: 14 },
      data: ["老字号", "文化艺术", "特色餐饮", "文创体验", "居民服务"]
    },
    color: ["#A0522D", "#D2691E", "#CD853F", "#F4A460", "#FFD700"],
    series: [
      {
        name: "商业业态",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["55%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{d}%",
          fontSize: 12,
          color: "#333"
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          lineStyle: { color: "#8B4513" }
        },
        data: [
          { value: 35, name: "老字号" },
          { value: 20, name: "文化艺术" },
          { value: 25, name: "特色餐饮" },
          { value: 10, name: "文创体验" },
          { value: 10, name: "居民服务" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  cosmosInstance.setOption(option);
  cosmosInstance.resize();
};

/** 2) 城市更新与保护投入对比图（你原逻辑不改，只规范化） */
const initArchChart = () => {
  if (!archChart.value) return;

  archInstance?.dispose();
  archInstance = echarts.init(archChart.value);

  const option = {
    title: {
      text: "大栅栏城市更新与保护投入",
      left: "center",
      top: "2%",
      textStyle: {
        color: "#4a4a4a",
        fontSize: 20,
        fontWeight: "bold"
      }
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      data: ["历史建筑修复项目", "社区环境改善项目"],
      bottom: "3%",
      textStyle: { color: "#5a4a42" }
    },
    grid: { left: "8%", right: "4%", bottom: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["历史街巷", "传统四合院", "基础设施", "公共空间"],
      axisLine: { lineStyle: { color: "#8B4513" } },
      axisLabel: { color: "#5a4a42", rotate: 30 }
    },
    yAxis: {
      type: "value",
      name: "项目数量/投入指数",
      nameTextStyle: { color: "#5a4a42" },
      axisLine: { lineStyle: { color: "#8B4513" } },
      splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } }
    },
    series: [
      {
        name: "历史建筑修复项目",
        type: "bar",
        barWidth: "35%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#CD853F" },
            { offset: 1, color: "#A0522D" }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        data: [18, 25, 12, 10]
      },
      {
        name: "社区环境改善项目",
        type: "bar",
        barWidth: "35%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#F4A460" },
            { offset: 1, color: "#D2691E" }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        data: [15, 10, 20, 18]
      }
    ]
  };

  archInstance.setOption(option);
  archInstance.resize();
};

/** 3) 非遗传承与文创发展趋势图（你原逻辑不改，只规范化） */
const initCultureChart = () => {
  if (!cultureChart.value) return;

  cultureInstance?.dispose();
  cultureInstance = echarts.init(cultureChart.value);

  const option = {
    title: {
      text: "非遗传承与文创发展趋势",
      left: "center",
      top: "5%",
      textStyle: {
        color: "#4a4a4a",
        fontSize: 20,
        fontWeight: "bold"
      }
    },
    tooltip: { trigger: "axis" },
    legend: {
      data: ["非遗活动场次", "文创产品销售额 (万元)"],
      bottom: 0,
      textStyle: { color: "#5a4a42" }
    },
    grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["2010", "2013", "2016", "2019", "2022", "2024"],
      axisLine: { lineStyle: { color: "#8B4513" } }
    },
    yAxis: [
      {
        type: "value",
        name: "场次",
        nameTextStyle: { color: "#5a4a42" },
        axisLine: { lineStyle: { color: "#8B4513" } },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } }
      },
      {
        type: "value",
        name: "销售额 (万元)",
        nameTextStyle: { color: "#5a4a42" },
        axisLine: { lineStyle: { color: "#8B4513" } },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: "非遗活动场次",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 4, color: "#D2691E" },
        itemStyle: { color: "#D2691E" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(210, 105, 30, 0.3)" },
            { offset: 1, color: "rgba(210, 105, 30, 0)" }
          ])
        },
        data: [50, 80, 120, 180, 250, 320]
      },
      {
        name: "文创产品销售额 (万元)",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "rect",
        symbolSize: 8,
        lineStyle: { width: 4, color: "#FFD700" },
        itemStyle: { color: "#FFD700" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255, 215, 0, 0.3)" },
            { offset: 1, color: "rgba(255, 215, 0, 0)" }
          ])
        },
        data: [100, 300, 800, 1500, 3000, 5000]
      }
    ]
  };

  cultureInstance.setOption(option);
  cultureInstance.resize();
};

/** 4) 宽幅：researchChart（新增，按参考代码写法；你可替换数据/标题） */
const initResearchChart = () => {
  if (!researchChart.value) return;

  researchInstance?.dispose();
  researchInstance = echarts.init(researchChart.value);

  const option = {
    tooltip: { trigger: "axis" },
    legend: {
      data: ["研究热度", "活化项目"],
      top: 0,
      right: 10,
      textStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    grid: { left: "3%", right: "3%", bottom: "3%", top: "45px", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["2010", "2012", "2014", "2016", "2018", "2020", "2022", "2024"],
      axisLine: { lineStyle: { color: "#8b4513" } },
      axisLabel: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    yAxis: {
      type: "value",
      name: "指数/项",
      nameTextStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" },
      splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } }
    },
    series: [
      {
        name: "研究热度",
        type: "line",
        smooth: true,
        symbol: "none",
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(139, 69, 19, 0.25)" },
            { offset: 1, color: "rgba(139, 69, 19, 0)" }
          ])
        },
        lineStyle: { width: 3, color: "#8b4513" },
        data: [20, 35, 55, 80, 110, 150, 190, 230]
      },
      {
        name: "活化项目",
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 3, color: "#d4a76a" },
        data: [2, 5, 9, 14, 22, 30, 45, 60]
      }
    ]
  };

  researchInstance.setOption(option);
  researchInstance.resize();
};

onMounted(async () => {
  // 关键：等布局完成再 init，避免 chart-box 空白
  await nextTick();

  initCosmosChart();
  initArchChart();
  initCultureChart();
  initResearchChart();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);

  cosmosInstance?.dispose();
  archInstance?.dispose();
  cultureInstance?.dispose();
  researchInstance?.dispose();

  cosmosInstance = null;
  archInstance = null;
  cultureInstance = null;
  researchInstance = null;
});
</script>

<style scoped>
/* ====== 按参考代码整体风格 ====== */
.dashboard-container {
  font-family: "Noto Serif SC", serif;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  padding: 20px;
  color: #333;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  padding: 40px 20px 30px;
}

.dashboard-title {
  font-size: 2.2rem;
  color: #8b4513;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.dashboard-subtitle {
  color: #5a4a42;
  font-size: 1.1rem;
  margin: 0;
}

/* --- 1. 核心网格布局：2×N，固定行高 --- */
.charts-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 340px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto 24px;
}

/* --- 2. 宽幅图表区域 --- */
.wide-chart-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  height: 420px;
}

.wide-card-inner {
  height: 100%;
  width: 100%;
}

/* --- 卡片通用样式（参考代码的 chart-card） --- */
.chart-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(93, 75, 75, 0.6);
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
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
  line-height: 30px;
}

/* 图表容器必须能吃到高度：flex:1 + min-height:0 是关键 */
.chart-box,
.chart-box-wide {
  flex: 1;
  width: 100%;
  min-height: 0;
}

/* --- 全球影响数据条（参考同学样式） --- */
.global-impact {
  margin: 20px auto 40px;
  max-width: 1200px;
  padding: 30px 40px;
  background: #8b4513;
  border-radius: 16px;
  text-align: center;
  color: white;
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.2);
}

.global-impact h2 {
  margin: 0 0 25px 0;
  font-size: 1.4rem;
  color: #fff8e1;
  font-weight: bold;
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

/* 页脚 */
.dashboard-footer {
  text-align: center;
  padding: 20px;
  color: #5a4a42;
  font-size: 0.9rem;
  border-top: 1px solid rgba(139, 69, 19, 0.15);
  max-width: 900px;
  margin: 0 auto;
}

.dashboard-footer p {
  margin: 8px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .charts-grid-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
  }

  .wide-chart-section {
    height: 380px;
  }

  .impact-grid {
    flex-direction: column;
  }
}
</style>
