<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="goBack">
        <span class="icon">←</span> 返回明十三陵门户
      </button>
      <h1 class="dashboard-title">明十三陵的深远影响力</h1>
      <p class="dashboard-subtitle">探究世界文化遗产的当代价值与中华文化传承</p>
    </div>

    <div class="dashboard-content">
      <div class="main-visualization">
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>明十三陵综合影响力评估</h2>
            <div class="divider"></div>
            <p class="section-description">基于多维度价值的深入分析</p>
          </div>
          <!-- <RadarChartBoard class="radar-container" /> -->
           <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>明十三陵的营建哲学与秩序</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">⛰️</i>
              </div>
              <h3>风水选址的自然之道</h3>
              <p>
                十三陵依山傍水，坐北朝南，严格遵循“风水宝地”原则，体现了古代帝王对天人合一、永固江山的追求。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">📐</i>
              </div>
              <h3>严谨布局的皇家礼制</h3>
              <p>
                神道、碑亭、大红门等建筑按中轴线层层递进，构建了宏伟的陵寝体系，彰显皇权的威严与等级。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏛️</i>
              </div>
              <h3>精湛的建筑技艺与文化内涵</h3>
              <p>
                陵墓的砖石结构、斗拱彩绘、神兽雕刻等无不体现明代高超的建筑工艺和深厚的丧葬文化。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">📜</i>
              </div>
              <h3>独特的地宫文化与历史印记</h3>
              <p>
                如定陵地宫的发掘，揭示了明代皇陵的真实面貌和丰富的随葬品，为历史研究提供了宝贵实证。
              </p>
            </div>
          </div>
          <div class="cosmos-chart">
            <div ref="imperialPhilosophyChart" class="chart-box"></div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <div class="metrics-card global-impact">
          <h3 class="metrics-title">明十三陵的当代与全球影响力</h3>
          <div class="impact-grid">
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
          <div class="chart-container">
            <div ref="contemporaryInfluenceChart" class="chart-box"></div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">🏛️</i> 对世界文化遗产保护的贡献</h3>
          <div class="dimension-content">
            <p>明十三陵作为世界文化遗产，为全球遗产保护提供了典范：</p>
            <ul>
              <li>保护修复实践：陵墓本体的保护和修复技术</li>
              <li>遗产监测管理：先进的数字化监测与管理系统</li>
              <li>国际交流合作：参与世界遗产地保护的国际会议与项目</li>
            </ul>
            <div class="chart-container">
              <div ref="heritageContributionChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">📚</i> 对明史与丧葬文化研究的推动</h3>
          <div class="dimension-content">
            <p>十三陵的考古发现和陵寝规制，极大地丰富了相关研究：</p>
            <ul>
              <li>明史研究新视角：地宫出土文物补充史料空白</li>
              <li>中国陵寝制度范本：研究帝王丧葬礼制的重要实物</li>
              <li>多元文化融合见证：体现儒释道思想在陵寝建筑中的融合</li>
            </ul>
            <div class="chart-container">
              <div ref="researchImpactChart" class="chart-box"></div>
              '
            </div>
          </div>
        </div>
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

// 返回门户主页
const goBack = () => router.push("/landmarks/ming-tombs");

// ECharts图表引用
const imperialPhilosophyChart = ref(null); // 对应HTML中的 cosmosChart
const heritageContributionChart = ref(null); // 对应HTML中的 archChart
const researchImpactChart = ref(null); // 对应HTML中的 cultureChart
const contemporaryInfluenceChart = ref(null); // 对应HTML中的 tourismChart

// 初始化帝陵营建哲学环形图
const initImperialPhilosophyChart = () => {
  if (!imperialPhilosophyChart.value) {
    console.warn(
      "ECharts container (imperialPhilosophyChart) not found in DOM. Chart might not display."
    );
    return;
  }

  let chartInstance = echarts.getInstanceByDom(imperialPhilosophyChart.value);
  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(imperialPhilosophyChart.value);

  const option = {
    title: {
      text: "明十三陵营建哲学构成",
      left: "center",
      top: "5%",
      textStyle: {
        color: "#d4a76a",
        fontSize: 22,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)", // 显示名称、数值和百分比
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: {
        color: "#b8a692",
        fontSize: 14,
      },
      // 可以在这里自定义每个图例项
      data: ["风水堪舆", "皇家礼制", "文化象征"],
    },
    color: ["#B26F4A", "#D4A76A", "#9C7C5C"], // 选用与主题相符的棕色/金色调
    series: [
      {
        name: "营建哲学",
        type: "pie",
        radius: ["40%", "70%"], // 环形图的内外半径
        center: ["55%", "50%"], // 调整中心点以避开左侧图例
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{d}%", // 显示名称和百分比
          fontSize: 13,
          color: "#b8a692",
          lineHeight: 18,
        },
        labelLine: {
          show: true,
          length: 15, // 引导线第一段长度
          length2: 10, // 引导线第二段长度
          lineStyle: {
            color: "#8d6e63",
          },
        },
        data: [
          { value: 40, name: "风水堪舆" },
          { value: 35, name: "皇家礼制" },
          { value: 25, name: "文化象征" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);
  window.addEventListener("resize", () => chartInstance.resize());
};

// 初始化遗产保护贡献柱状图 (原 initArchChart)
const initHeritageContributionChart = () => {
  if (heritageContributionChart.value) {
    const chart = echarts.init(heritageContributionChart.value);

    const option = {
      title: {
        text: "遗产保护与国际交流成就",
        left: "center",
        textStyle: {
          color: "#d4a76a",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: "{b}<br/>{a0}: {c0}项<br/>{a1}: {c1}次",
      },
      legend: {
        data: ["保护修复项目", "国际交流活动"],
        bottom: 0,
        textStyle: { color: "#b8a692" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["陵墓本体", "环境风貌", "遗产监测", "考古研究", "文化传播"],
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: {
          color: "#b8a692",
          interval: 0, // 显示所有标签
          rotate: 30, // 标签旋转
        },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: { color: "#b8a692" },
        axisLine: { lineStyle: { color: "#b8a692" } },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
      },
      series: [
        {
          name: "保护修复项目",
          type: "bar",
          barWidth: "35%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#B26F4A" }, // 深棕色
              { offset: 1, color: "#D4A76A" }, // 浅棕色
            ]),
            borderRadius: [5, 5, 0, 0],
          },
          data: [15, 12, 10, 8, 5], // 示例数据：修复项目数量
        },
        {
          name: "国际交流活动",
          type: "bar",
          barWidth: "35%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#9C7C5C" }, // 灰棕色
              { offset: 1, color: "#E6C68F" }, // 米黄色
            ]),
            borderRadius: [5, 5, 0, 0],
          },
          data: [10, 8, 7, 5, 12], // 示例数据：国际交流活动次数
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 初始化学术研究推动图表 (原 initCultureChart)
const initResearchImpactChart = () => {
  if (researchImpactChart.value) {
    const chart = echarts.init(researchImpactChart.value);

    const option = {
      title: {
        text: "明十三陵相关学术成果趋势",
        left: "center",
        textStyle: {
          color: "#d4a76a",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: "年份: {b}<br/>论文数量: {c0}篇<br/>研究项目: {c1}项",
      },
      legend: {
        data: ["论文数量", "研究项目"],
        bottom: 0,
        textStyle: { color: "#b8a692" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#b8a692" },
      },
      yAxis: {
        type: "value",
        name: "数量",
        nameTextStyle: { color: "#b8a692" },
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: '#b8a692' },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 3, color: "#B26F4A" }, // 深棕色
          itemStyle: { color: "#B26F4A" },
          areaStyle: {
            // 添加面积图效果
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(178,111,74,0.3)", // 渐变色
              },
              {
                offset: 1,
                color: "rgba(178,111,74,0)",
              },
            ]),
          },
          data: [20, 45, 80, 150, 280, 450, 600, 750], // 示例数据
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "rect",
          symbolSize: 8,
          lineStyle: { width: 3, color: "#9C7C5C" }, // 灰棕色
          itemStyle: { color: "#9C7C5C" },
          areaStyle: {
            // 添加面积图效果
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(156,124,92,0.3)", // 渐变色
              },
              {
                offset: 1,
                color: "rgba(156,124,92,0)",
              },
            ]),
          },
          data: [5, 12, 25, 40, 70, 110, 160, 220], // 示例数据
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
};

// 初始化当代影响力环形图 (原 initTourismChart)
const initContemporaryInfluenceChart = () => {
  if (contemporaryInfluenceChart.value) {
    const chart = echarts.init(contemporaryInfluenceChart.value);

    const option = {
    title: {
        text: "十三陵游客构成",
        left: "center",
        top: "top",
        textStyle: {
          color: "#d4a76a",
          fontSize: 16,
        },
    },
    tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
    },
    legend: {
        /* 此处修改: 改为水平布局，移动到图表下方 */
        orient: 'horizontal',
        top: 'bottom',
        left: 'center',
        textStyle: { color: "#b8a692" },
        /* 此处修改: 在图例中直接显示百分比 */
        formatter: function (name) {
            const data = option.series[0].data;
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const item = data.find(item => item.name === name);
            const percent = ((item.value / total) * 100).toFixed(0);
            return `${name} ${percent}%`;
        }
    },
    color: ["#B26F4A", "#D4A76A", "#9C7C5C", "#E6C68F", "#F0E68C"],
    series: [
        {
            name: "游客来源",
            type: "pie",
            radius: ["40%", "70%"],
            /* 图表居中，因为不再需要为外部标签让位 */
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            /* 隐藏外部标签和引导线 */
            label: {
                show: false,
            },
            labelLine: {
                show: false,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
            data: [
                { value: 65, name: "境内游客" },
                { value: 15, name: "亚洲（非中国）" },
                { value: 10, name: "欧洲" },
                { value: 7, name: "北美洲" },
                { value: 3, name: "其他地区" },
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

// onBeforeUnmount 钩子用于销毁图表实例，防止内存泄漏
// import { onBeforeUnmount } from 'vue'; // 如果没有引入，需要引入
// onBeforeUnmount(() => {
//   if (chartInstance1) chartInstance1.dispose(); // 如果你的 chartInstance1 还在用的话
//   if (imperialPhilosophyChart.value) echarts.getInstanceByDom(imperialPhilosophyChart.value)?.dispose();
//   if (heritageContributionChart.value) echarts.getInstanceByDom(heritageContributionChart.value)?.dispose();
//   if (researchImpactChart.value) echarts.getInstanceByDom(researchImpactChart.value)?.dispose();
//   if (contemporaryInfluenceChart.value) echarts.getInstanceByDom(contemporaryInfluenceChart.value)?.dispose();
// });
const currentLandmark = "明十三陵"; // 定义当前页面的景点名称
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  color: #e0d6c2;
  font-family: "Noto Serif SC", serif;
}

.dashboard-header {
  padding: 2rem;
  text-align: center;
  position: relative;
  border-bottom: 1px solid #f0dcdc;
}

.back-button {
  position: absolute;
  left: 2rem;
  top: 2rem;
  background: rgba(93, 75, 75, 0.5);
  color: #e0d6c2;
  border: 1px solid #7d6a6a;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  background: rgba(93, 75, 75, 0.8);
}

.dashboard-title {
  margin: 0.5rem 0 0 0;
  font-size: 2rem;
  color: #d4b483;
}

.dashboard-subtitle {
  margin: 0.5rem 0 0 0;
  color: #b8a692;
  font-size: 1.1rem;
}

.dashboard-content {
  display: flex;
  flex: 1;
  padding: 1.5rem;
  gap: 1.5rem;
}

.main-visualization {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.side-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.visualization-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.section-title {
  margin-bottom: 1.5rem;
  text-align: center;
}

.section-title h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #d4b483;
}

.divider {
  height: 2px;
  width: 80px;
  background: linear-gradient(90deg, #d4a76a, #8b4513);
  margin: 0 auto;
  border-radius: 2px;
}

.section-description {
  margin: 0.5rem 0 0 0;
  color: #b8a692;
  font-size: 0.9rem;
}

.radar-container {
  height: 100%;
}

.philosophy-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.philosophy-item {
  /* background: rgba(255, 248, 225, 0.8); */
  /* 背景色改为与右侧卡片一致的深灰褐色 */
  background: rgba(42, 34, 34, 0.7);
  border-radius: 6px;
  padding: 1rem;
  /* border: 1px solid #5d4b4b; */
  /* 边框颜色调整以适应深色背景 */
  border: 1px solid rgba(224, 189, 140, 0.15);
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4a76a, #8b4513);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.icon-circle .icon {
  font-size: 1.5rem;
  color: #fff8e1;
}

.philosophy-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  /* color: #5a4a42; */
  /* 标题文字改为亮金色 */
  color: #d4a76a;
  text-align: center;
}

.philosophy-item p {
  margin: 0;
  /* color: #5a4a42; */
  /* 正文文字改为更亮的米色以保证清晰度 */
  color: #D7C6B5;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 图表容器 */
.chart-box {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}

.cosmos-chart,
.chart-container {
  /* background: rgba(255, 248, 225, 0.8); */
  /* 图表容器背景色同步修改 */
  background: rgba(42, 34, 34, 0.7);
  border-radius: 15px;
  padding: 20px;
  /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.metrics-card {
  background: rgba(42, 34, 34, 0.7);
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
}

.metrics-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #d4b483;
  text-align: center;
  border-bottom: 1px solid #5d4b4b;
  padding-bottom: 0.5rem;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.impact-item {
  background: rgba(93, 75, 75, 0.3);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.impact-value {
  font-size: 1.8rem;
  color: #d4a76a;
  font-weight: bold;
}

.impact-label {
  font-size: 0.9rem;
  color: #b8a692;
}

.impact-dimension {
  background: rgba(42, 34, 34, 0.7);
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
}

.impact-dimension h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #d4b483;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.impact-dimension h3 .icon {
  font-size: 1.2rem;
}

.dimension-content p {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.dimension-content ul {
  margin: 0 0 1rem 0;
  padding-left: 1.2rem;
}

.dimension-content li {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.dashboard-footer {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #5d4b4b;
  font-size: 0.9rem;
  color: #b8a692;
}

.dashboard-footer p:first-child {
  margin-bottom: 0.5rem;
  font-style: italic;
}

@media (max-width: 1200px) {
  .dashboard-content {
    flex-direction: column;
  }

  .philosophy-card {
    grid-template-columns: 1fr;
  }

  .impact-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .impact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-header {
    padding-top: 4rem;
  }

  .back-button {
    top: 1rem;
    left: 1rem;
  }
}
</style>
