<template>
  <div class="influence-container">
    <div class="influence-header">
      <h1>长城的历史价值与世界影响</h1>
      <p>解读中华民族的伟大防御工程及其全球文化遗产地位</p>
    </div>

    <div class="content-flow">

      <div class="chart-card radar-section">
        <h3 class="chart-title">北京历史地标评估雷达图</h3>
        <p class="chart-subtitle">多维度对比长城与其他文化遗产的数据表现</p>
        <div class="radar-wrapper">
          <RadarChartBoard class="radar-component" :currentLandmark="currentLandmark" />
        </div>
      </div>

      <div class="chart-card galaxy-section">
        <div class="section-title-visual">
          <h3 class="chart-title">世界文化遗产价值体系</h3>
          <p class="chart-subtitle">拖动节点探索长城的多维影响力</p>
        </div>
        <div class="galaxy-wrapper">
          <InfluenceGalaxy />
        </div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">长城沿线省份分布 (公里)</h3>
        <div ref="provinceChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">防御体系结构占比</h3>
        <div ref="structureChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">学术研究趋势 (1990-2023)</h3>
        <div ref="cultureChart" class="chart-box-wide"></div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">游客来源分布</h3>
        <div ref="tourismChart" class="chart-box-wide"></div>
      </div>

    </div>

    <div class="global-impact">
      <h2>长城的全球文化遗产价值</h2>
      <div class="impact-grid-horizontal">
        <div class="impact-item">
          <div class="impact-value">2.1万公里</div>
          <div class="impact-label">总长度，世界最长防御工程</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">1000万+</div>
          <div class="impact-label">年接待游客量</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">3000+</div>
          <div class="impact-label">全球学术研究成果</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">1987年</div>
          <div class="impact-label">列入世界文化遗产名录</div>
        </div>
      </div>
    </div>

    <div class="influence-footer">
      <p>
        长城作为中华民族的象征，不仅展现了古代中国的军事智慧与民族融合，更成为全人类共同的文化遗产。
      </p>
      <p>全国重点文物保护单位 · 世界文化遗产</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import RadarChartBoard from "../RadarChartBoard.vue";
import InfluenceGalaxy from "./InfluenceGalaxy.vue";

const router = useRouter();
const currentLandmark = "长城";

const provinceChart = ref(null);
const structureChart = ref(null);
const cultureChart = ref(null);
const tourismChart = ref(null);

// --- 图表初始化逻辑保持不变 ---

// 省份分布图
const initProvinceChart = () => {
  if (provinceChart.value) {
    const chart = echarts.init(provinceChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}公里" },
      grid: { left: '5%', right: '5%', bottom: '5%', top: '15%', containLabel: true },
      xAxis: {
        type: "category",
        data: ["河北", "北京", "山西", "陕西", "甘肃", "辽宁", "内蒙古", "宁夏", "天津"],
        axisLabel: { color: "#5a4a42", fontSize: 13, interval: 0 },
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: "value",
        name: "长度 (km)",
        nameTextStyle: { color: "#5a4a42", fontSize: 13 },
        axisLabel: { color: "#5a4a42" },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)", type: 'dashed' } },
      },
      series: [
        {
          name: "长城长度",
          type: "bar",
          barWidth: '40%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#d4a76a" },
              { offset: 1, color: "#8b4513" },
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          data: [2000, 629, 1300, 1800, 1500, 900, 2500, 400, 60],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

// 结构占比图
const initStructureChart = () => {
  if (structureChart.value) {
    const chart = echarts.init(structureChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}%" },
      legend: {
        orient: 'vertical',
        left: '10%',
        top: 'middle',
        itemGap: 20,
        textStyle: { color: "#5a4a42", fontSize: 14 }
      },
      color: ["#8b4513", "#a0522d", "#bfa46f", "#d4a76a", "#e0c39e"],
      series: [
        {
          name: "防御体系结构",
          type: "pie",
          radius: ["50%", "75%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: "{b}\n{d}%",
            color: "#5a4a42",
            fontSize: 14
          },
          data: [
            { value: 35, name: "墙体" },
            { value: 25, name: "敌楼" },
            { value: 20, name: "烽火台" },
            { value: 12, name: "关隘" },
            { value: 8, name: "壕堑" },
          ],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

// 学术趋势图
const initCultureChart = () => {
  if (cultureChart.value) {
    const chart = echarts.init(cultureChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      legend: {
        data: ["论文数量", "研究项目"],
        textStyle: { color: "#5a4a42" },
        top: 10
      },
      grid: { left: "5%", right: "5%", bottom: "5%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42" }
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisLabel: { color: "#5a4a42" },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(139, 69, 19, 0.4)" },
              { offset: 1, color: "rgba(139, 69, 19, 0.0)" },
            ])
          },
          lineStyle: { width: 4, color: "#8b4513" },
          itemStyle: { color: "#8b4513" },
          data: [12, 28, 55, 90, 130, 200, 260, 320],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 4, color: "#d4a76a" },
          itemStyle: { color: "#d4a76a" },
          data: [3, 8, 18, 30, 45, 70, 90, 120],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

// 游客来源图
const initTourismChart = () => {
  if (tourismChart.value) {
    const chart = echarts.init(tourismChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}%" },
      legend: {
        orient: "vertical",
        left: "10%",
        top: "center",
        itemGap: 15,
        textStyle: { color: "#5a4a42", fontSize: 13 },
      },
      color: [
        "#8b4513", "#a0522d", "#bfa46f", "#d4a76a",
        "#e0c39e", "#f6c177", "#a67c52", "#8d6e63"
      ],
      series: [
        {
          name: "游客来源",
          type: "pie",
          radius: ["45%", "75%"],
          center: ["60%", "50%"],
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: true,
            formatter: "{b}: {d}%",
            color: "#5a4a42"
          },
          labelLine: { show: true, length: 15, length2: 10 },
          data: [
            { value: 25, name: "北京" },
            { value: 18, name: "河北" },
            { value: 12, name: "陕西" },
            { value: 10, name: "山西" },
            { value: 8, name: "甘肃" },
            { value: 10, name: "海外" },
            { value: 9, name: "其他" },
            { value: 8, name: "东南亚" },
          ],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

onMounted(() => {
  initProvinceChart();
  initStructureChart();
  initCultureChart();
  initTourismChart();
});
</script>

<style scoped>
/* 页面主容器 */
.influence-container {
  font-family: "Noto Serif SC", serif;
  color: #333;
  line-height: 1.6;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}

.influence-header {
  text-align: center;
  padding: 50px 20px 40px;
  max-width: 900px;
  margin: 0 auto;
}

.influence-header h1 {
  font-size: 2.2rem;
  color: #8b4513;
  margin-bottom: 12px;
}

.influence-header p {
  font-size: 1.1rem;
  color: #5a4a42;
  margin-top: 0;
}

/* 核心布局容器：流式布局 (关键修改) */
.content-flow {
  max-width: 1000px;
  /* 限制最大宽度，保持整齐 */
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  /* 卡片之间的垂直间距 */
}

/* 通用卡片样式 */
.chart-card {
  background: rgba(255, 248, 225, 0.95);
  /* 不透明度提高，防止背景干扰 */
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(139, 69, 19, 0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(139, 69, 19, 0.05);
}

.chart-title {
  text-align: center;
  color: #8b4513;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  align-self: center;
}

/* 标题装饰线 */
.chart-title::after {
  content: "";
  display: block;
  width: 40px;
  height: 3px;
  background: #d4a76a;
  margin: 8px auto 0;
  border-radius: 2px;
}

.chart-subtitle {
  text-align: center;
  color: #a0522d;
  font-size: 0.95rem;
  margin: 0 0 25px 0;
}

/* 1. 雷达图区域样式修复 */
.radar-section {
  min-height: 550px;
  /* 强制给雷达图足够的高度，防止重叠 */
}

.radar-wrapper {
  flex: 1;
  width: 100%;
  position: relative;
  /* 确保内部组件不会溢出 */
  overflow: hidden;
}

/* 2. 星系图区域样式 */
.galaxy-section {
  min-height: 500px;
}

.galaxy-wrapper {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(139, 69, 19, 0.1);
  min-height: 400px;
}

/* 3. 通用宽图表盒子 */
.chart-box-wide {
  width: 100%;
  height: 350px;
  margin-top: 10px;
}

/* 全球影响统计条 */
.global-impact {
  margin: 60px auto 40px;
  max-width: 1200px;
  padding: 40px;
  background: #8b4513;
  /* 深棕色主题 */
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(101, 67, 33, 0.2);
  text-align: center;
  color: #fff;
}

.global-impact h2 {
  color: #fff;
  margin-bottom: 30px;
}

.impact-grid-horizontal {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.impact-item {
  flex: 1;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s;
}

.impact-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.impact-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.impact-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* 页脚 */
.influence-footer {
  text-align: center;
  padding: 40px 20px;
  color: #5a4a42;
  font-size: 1rem;
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid rgba(139, 69, 19, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .influence-header {
    padding: 30px 15px;
  }

  .chart-card {
    padding: 20px;
  }

  .chart-box-wide {
    height: 300px;
  }

  .impact-grid-horizontal {
    flex-direction: column;
  }
}
</style>