<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">法源寺的佛教文化地位与世界影响</h1>
      <p class="dashboard-subtitle">探索千年古刹的宗教价值及其全球文化遗产意义</p>
    </div>

    <!-- 1) 2×2 网格：只放 4 张卡 -->
    <div class="charts-grid-layout">
      <!-- 雷达 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">法源寺佛教文化综合评估</h3>
        </div>
        <div class="chart-box">
          <FuyuanTempleRadar />
        </div>
      </div>

      <!-- 佛教精髓 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">法源寺的佛教文化精髓</h3>
        </div>
        <div ref="buddhismChart" class="chart-box"></div>
      </div>

      <!-- 传播影响 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">对佛教传播的影响</h3>
        </div>
        <div ref="spreadChart" class="chart-box"></div>
      </div>

      <!-- 和平贡献 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">对和平文化的贡献</h3>
        </div>
        <div ref="peaceChart" class="chart-box"></div>
      </div>
    </div>

    <!-- 2) 宽幅 researchChart（跨两列） -->
    <div class="wide-chart-section">
      <div class="chart-card wide-card-inner">
        <div class="card-header">
          <h3 class="chart-title">佛教学术研究趋势 (2000-2023)</h3>
        </div>
        <div ref="researchChart" class="chart-box-wide"></div>
      </div>
    </div>
    <div class="global-impact">
  <h2>法源寺的当代与全球影响力</h2>
  <div class="impact-grid">
    <div class="impact-item">
      <div class="impact-value">650+</div>
      <div class="impact-label">国际僧侣参访/年</div>
    </div>
    <div class="impact-item">
      <div class="impact-value">42</div>
      <div class="impact-label">国家佛教团体交流</div>
    </div>
    <div class="impact-item">
      <div class="impact-value">1,200+</div>
      <div class="impact-label">佛教学术出版物</div>
    </div>
    <div class="impact-item">
      <div class="impact-value">98%</div>
      <div class="impact-label">宗教文化保护完整度</div>
    </div>
  </div>
</div>
    <div class="dashboard-footer">
      <p>
        法源寺作为汉传佛教的重要传承场域，不仅承载千年佛教智慧，也成为促进世界宗教对话与和平的重要纽带。
      </p>
      <p>中国重点文物保护单位 · 佛教重要活动场所</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import FuyuanTempleRadar from "./FuyuanTempleRadar.vue";

/** refs */
const buddhismChart = ref(null);
const spreadChart = ref(null);
const researchChart = ref(null);
const peaceChart = ref(null);

/** echarts instances（用于统一 resize / dispose） */
let buddhismInstance = null;
let spreadInstance = null;
let researchInstance = null;
let peaceInstance = null;

/** 统一 resize handler（避免匿名函数 remove 无效、重复监听） */
const handleResize = () => {
  buddhismInstance && buddhismInstance.resize();
  spreadInstance && spreadInstance.resize();
  researchInstance && researchInstance.resize();
  peaceInstance && peaceInstance.resize();
};

/** 1) 佛教精髓（甜甜圈/玫瑰饼） */
const initBuddhismChart = () => {
  if (!buddhismChart.value) return;

  buddhismInstance?.dispose();
  buddhismInstance = echarts.init(buddhismChart.value);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c}%" },
    legend: {
      top: "bottom",
      textStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    color: ["#c49a6c", "#a07850", "#8e6b47", "#78583f"],
    series: [
      {
        name: "佛教文化要素",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        roseType: "area",
        label: {
          show: true,
          formatter: "{b|{b}}\n{c|{c}%}",
          rich: {
            b: { fontSize: 13, color: "#5a4a42", lineHeight: 18, fontFamily: "Noto Serif SC" },
            c: { fontSize: 15, color: "#8b4513", fontWeight: "bold", fontFamily: "Noto Serif SC" }
          }
        },
        data: [
          { value: 35, name: "佛经典籍" },
          { value: 30, name: "禅修传统" },
          { value: 20, name: "建筑艺术" },
          { value: 15, name: "法会仪式" }
        ]
      }
    ]
  };

  buddhismInstance.setOption(option);
  buddhismInstance.resize(); // 关键：首次强制 resize，避免空白
};

/** 2) 传播影响（柱状图） */
const initSpreadChart = () => {
  if (!spreadChart.value) return;

  spreadInstance?.dispose();
  spreadInstance = echarts.init(spreadChart.value);

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", top: "12%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["日本", "韩国", "越南", "泰国", "欧美"],
      axisLine: { lineStyle: { color: "#8b4513" } },
      axisTick: { show: false },
      axisLabel: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    yAxis: {
      type: "value",
      name: "影响指数",
      nameTextStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" },
      axisLine: { lineStyle: { color: "#8b4513" } },
      splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } }
    },
    series: [
      {
        name: "影响程度",
        type: "bar",
        barWidth: "55%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#d4a76a" },
            { offset: 1, color: "#8b4513" }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        data: [92, 88, 85, 78, 65]
      }
    ]
  };

  spreadInstance.setOption(option);
  spreadInstance.resize();
};

/** 3) 和平贡献（甜甜圈） */
const initPeaceChart = () => {
  if (!peaceChart.value) return;

  peaceInstance?.dispose();
  peaceInstance = echarts.init(peaceChart.value);

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c}次" },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    color: ["#8b4513", "#d4a76a", "#9c7c5c", "#b2967d"],
    series: [
      {
        name: "和平活动",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "50%"],
        label: { show: true, formatter: "{b}: {c}次", fontFamily: "Noto Serif SC" },
        data: [
          { value: 56, name: "国际对话会议" },
          { value: 42, name: "跨宗教交流" },
          { value: 35, name: "和平宣言签署" },
          { value: 28, name: "冲突调解活动" }
        ]
      }
    ]
  };

  peaceInstance.setOption(option);
  peaceInstance.resize();
};

/** 4) 宽幅：学术研究趋势（折线） */
const initResearchChart = () => {
  if (!researchChart.value) return;

  researchInstance?.dispose();
  researchInstance = echarts.init(researchChart.value);

  const option = {
    tooltip: { trigger: "axis" },
    legend: {
      data: ["学术论文", "研究项目"],
      top: 0,
      right: 10,
      textStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    grid: { left: "3%", right: "3%", bottom: "3%", top: "45px", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["2000", "2005", "2010", "2015", "2020", "2023"],
      axisLine: { lineStyle: { color: "#8b4513" } },
      axisLabel: { color: "#5a4a42", fontFamily: "Noto Serif SC" }
    },
    yAxis: {
      type: "value",
      name: "数量/项",
      nameTextStyle: { color: "#5a4a42", fontFamily: "Noto Serif SC" },
      splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } }
    },
    series: [
      {
        name: "学术论文",
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
        data: [35, 68, 105, 180, 245, 320]
      },
      {
        name: "研究项目",
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 3, color: "#d4a76a" },
        data: [8, 15, 28, 42, 65, 88]
      }
    ]
  };

  researchInstance.setOption(option);
  researchInstance.resize();
};

onMounted(async () => {
  // 关键：等布局完成再 init，避免 chart-box 空白
  await nextTick();

  initBuddhismChart();
  initSpreadChart();
  initPeaceChart();
  initResearchChart();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);

  buddhismInstance?.dispose();
  spreadInstance?.dispose();
  peaceInstance?.dispose();
  researchInstance?.dispose();

  buddhismInstance = null;
  spreadInstance = null;
  peaceInstance = null;
  researchInstance = null;
});
</script>

<style scoped>
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

/* --- 卡片通用样式（按你的风格） --- */
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

@media (max-width: 768px) {
  .impact-grid {
    flex-direction: column;
  }
}

</style>
