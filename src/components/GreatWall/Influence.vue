<template>
  <div class="influence-container">
    <div class="influence-header">
      <h1>长城的历史价值与世界影响</h1>
      <p>解读中华民族的伟大防御工程及其全球文化遗产地位</p>
    </div>

    <div class="charts-grid-layout">

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">北京历史地标评估</h3>
        </div>
        <div class="chart-box">
          <GreatWallRadar />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">世界文化遗产价值体系</h3>
        </div>
        <div class="chart-wrapper">
          <InfluenceGalaxy />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">长城沿线省份分布</h3>
        </div>
        <div ref="provinceChart" class="chart-box"></div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">防御体系结构占比</h3>
        </div>
        <div ref="structureChart" class="chart-box"></div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">学术研究与保护趋势</h3>
        </div>
        <div class="chart-box">
          <GreatWallStream />
        </div>
      </div>

      <div class="chart-card">
        <div class="card-header">
          <h3 class="chart-title">游客来源层级分布</h3>
        </div>
        <div class="chart-box">
          <GreatWallSunburst />
        </div>
      </div>

    </div>

    <div class="global-impact">
      <h2>长城的全球文化遗产价值</h2>
      <div class="impact-grid">
        <div class="impact-item">
          <div class="impact-value">2.1万公里</div>
          <div class="impact-label">总长度</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">1000万+</div>
          <div class="impact-label">年接待游客</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">3000+</div>
          <div class="impact-label">学术著作</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">1987年</div>
          <div class="impact-label">列入世遗</div>
        </div>
      </div>
    </div>

    <div class="influence-footer">
      <p>全国重点文物保护单位 · 世界文化遗产</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

// 引入组件
import GreatWallRadar from "./GreatWallRadar.vue"; // 新组件
import InfluenceGalaxy from "./InfluenceGalaxy.vue";
import GreatWallStream from "./GreatWallStream.vue";
import GreatWallSunburst from "./GreatWallSunburst.vue";

const router = useRouter();

const provinceChart = ref(null);
const structureChart = ref(null);

// ECharts 初始化：省份分布
const initProvinceChart = () => {
  if (provinceChart.value) {
    const chart = echarts.init(provinceChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}km" },
      grid: { left: '5%', right: '5%', bottom: '5%', top: '15%', containLabel: true },
      xAxis: {
        type: "category",
        data: ["河北", "北京", "山西", "陕西", "甘肃"],
        axisLabel: { color: "#5a4a42", interval: 0, fontSize: 11 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#d4a76a" } }
      },
      yAxis: { show: false },
      series: [{
        type: "bar",
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#d4a76a" },
            { offset: 1, color: "#8b4513" }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        label: { show: true, position: 'top', color: '#8b4513', formatter: '{c}' },
        data: [2000, 629, 1300, 1800, 1500]
      }]
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

// ECharts 初始化：结构占比
const initStructureChart = () => {
  if (structureChart.value) {
    const chart = echarts.init(structureChart.value);
    chart.setOption({
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: "#5a4a42", fontSize: 11 }
      },
      color: ["#8b4513", "#a0522d", "#bfa46f", "#d4a76a"],
      series: [{
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "45%"],
        label: { show: false },
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          { value: 35, name: "墙体" },
          { value: 25, name: "敌楼" },
          { value: 20, name: "烽火台" },
          { value: 20, name: "关隘" }
        ]
      }]
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

onMounted(() => {
  initProvinceChart();
  initStructureChart();
});
</script>

<style scoped>
/* 页面整体容器 */
.influence-container {
  font-family: "Noto Serif SC", serif;
  background: #fcf9f2;
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

/* --- 核心网格布局 --- */
.charts-grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 左右两列等分 */
  grid-auto-rows: 340px;
  /* 固定行高 */
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto 40px;
}

/* --- 卡片样式 --- */
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
  margin-bottom: 10px;
  flex-shrink: 0;
  height: 30px;
}

.chart-title {
  color: #8b4513;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
  position: relative;
  display: inline-block;
  line-height: 30px;
}

/* --- 图表容器 --- */
/* chart-box 和 chart-wrapper 作用相同，确保填满剩余空间 */
.chart-wrapper,
.chart-box {
  flex: 1;
  width: 100%;
  position: relative;
  min-height: 0;
}

/* --- 全球影响数据条 --- */
.global-impact {
  margin: 40px auto;
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

/* 页脚 */
.influence-footer {
  text-align: center;
  padding: 20px;
  color: #7a6b64;
  font-size: 0.9rem;
  border-top: 1px solid rgba(139, 69, 19, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

/* --- 响应式适配 --- */
@media (max-width: 768px) {
  .charts-grid-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
  }

  .impact-grid {
    flex-direction: column;
  }

  .influence-header {
    padding: 30px 15px;
  }
}
</style>