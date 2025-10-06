<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="goBack">
        <span class="icon">←</span> 返回大栅栏门户
      </button>
      <h1 class="dashboard-title">大栅栏：京味市井的百年变迁与现代活力</h1>
      <p class="dashboard-subtitle">
        探索北京前门外的历史街区，感受传统商业与民俗文化的魅力
      </p>
    </div>

    <div class="dashboard-content">
      <div class="main-visualization">
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>大栅栏区域价值综合评估</h2>
            <div class="divider"></div>
            <p class="section-description">
              基于历史、文化、商业和社区的多维度分析
            </p>
          </div>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>大栅栏的市井文化与商业特色</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🛍️</i>
              </div>
              <h3>百年老字号的商业传承</h3>
              <p>
                大栅栏汇集了瑞蚨祥、同仁堂、内联升等众多享誉京城的中华老字号，它们见证并延续着传统商业的繁荣与匠心。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🎭</i>
              </div>
              <h3>戏曲文化的发源地</h3>
              <p>
                曾经是京剧、评剧等戏曲艺术的重要演出场所，如广德楼戏园，承载着丰富的梨园文化记忆，是京味艺术的摇篮。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏘️</i>
              </div>
              <h3>胡同肌理的市井生活</h3>
              <p>
                曲折的胡同中蕴藏着老北京最真实的生活气息，是京味儿民俗的活化石，展现着传统居民社区的独特魅力。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🍽️</i>
              </div>
              <h3>京味美食的汇聚地</h3>
              <p>
                从焦圈豆汁到爆肚炒肝，大栅栏及周边小吃店林立，是品尝地道老北京风味、体验市井烟火气的绝佳去处。
              </p>
              动
            </div>
          </div>
          <div class="cosmos-chart">
            <div
              ref="imperialPhilosophyChart"
              class="chart-box"
              style="height: 450px"
            ></div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <div class="metrics-card global-impact">
          <h3 class="metrics-title">大栅栏的当代影响力与传承</h3>
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

        <div class="impact-dimension">
          <h3><i class="icon">🏗️</i> 对城市更新模式的影响</h3>
          <div class="dimension-content">
            <p>大栅栏的改造模式为老城保护提供了范本：</p>
            <ul>
              <li>“修旧如旧”的文物修复</li>
              <li>原住民的“留改提”政策</li>
              <li>小尺度渐进式有机更新</li>
            </ul>
            <div class="chart-container">
              <div ref="archChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">📜</i> 对非遗传承与研究的推动</h3>
          <div class="dimension-content">
            <p>近20年大栅栏非遗相关研究与实践成果：</p>
            <ul>
              <li>非遗项目数字化保护</li>
              <li>传统手工艺活化推广</li>
              <li>文化创意产业融合</li>
            </ul>
            <div class="chart-container">
              <div ref="cultureChart" class="chart-box"></div>
            </div>
          </div>
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
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import RadarChartBoard from "../RadarChartBoard.vue";

// ECharts图表引用 (保持原名称，但内容已是大栅栏主题)
const imperialPhilosophyChart = ref(null); // 对应 HTML 中的 cosmosChart (现为大栅栏商业构成环形图)
const archChart = ref(null); // 对应 HTML 中的 archChart (现为城市更新影响图表)
const cultureChart = ref(null); // 对应 HTML 中的 cultureChart (现为非遗研究与推广图表)
const tourismChart = ref(null); // 这个在新的模板中没有直接引用，但可以保留，或者按需更改为其他图表

const router = useRouter();

// 返回门户主页
const goBack = () => router.push("/landmarks/dashilan");

// (如果你有 RadarChartBoard 组件，请确保它的数据源能被动态传入或在组件内部调整)
// 例如，RadarChartBoard 组件内部的数据可以改为：
// const radarData = [
//   { name: '历史文化价值', max: 100 },
//   { name: '商业活力', max: 100 },
//   { name: '社区特色', max: 100 },
//   { name: '旅游吸引力', max: 100 },
//   { name: '非遗传承度', max: 100 }
// ];
// const seriesData = [{
//   value: [90, 85, 92, 88, 95], // 大栅栏在这些维度上的评估
//   name: '大栅栏综合评估'
// }];

// --- 替代原 "帝王秩序图表" 为 "大栅栏商业业态构成环形图" ---
const initCosmosChart = () => {
  if (imperialPhilosophyChart.value) {
    const chart = echarts.init(imperialPhilosophyChart.value);

    const option = {
      title: {
        text: "大栅栏商业业态构成",
        left: "center",
        top: "5%",
        textStyle: {
          color: "#4a4a4a", // 更适合市井文化的颜色
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "center",
        textStyle: {
          color: "#5a4a42",
          fontSize: 14,
        },
        data: ["老字号", "文化艺术", "特色餐饮", "文创体验", "居民服务"],
      },
      color: ["#A0522D", "#D2691E", "#CD853F", "#F4A460", "#FFD700"], // 暖色调，符合商业街氛围
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
            color: "#333",
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: {
              color: "#8B4513",
            },
          },
          data: [
            { value: 35, name: "老字号" }, // 大栅栏核心
            { value: 20, name: "文化艺术" }, // 戏园、书店
            { value: 25, name: "特色餐饮" }, // 小吃、饭馆
            { value: 10, name: "文创体验" }, // 新兴业态
            { value: 10, name: "居民服务" }, // 保留部分居民服务
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

    chart.setOption(option);
    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// --- 替代原 "建筑影响图表" 为 "城市更新与保护投入对比图" ---
const initArchChart = () => {
  if (archChart.value) {
    const chart = echarts.init(archChart.value);

    const option = {
      title: {
        text: "大栅栏城市更新与保护投入",
        left: "center",
        top: "5%",
        textStyle: {
          color: "#4a4a4a",
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["历史建筑修复项目", "社区环境改善项目"],
        bottom: "3%",
        textStyle: { color: "#5a4a42" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["历史街巷", "传统四合院", "基础设施", "公共空间"],
        axisLine: {
          lineStyle: {
            color: "#8B4513", // 棕色调
          },
        },
        axisLabel: {
          color: "#5a4a42",
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "项目数量/投入指数",
        nameTextStyle: {
          color: "#5a4a42",
        },
        axisLine: {
          lineStyle: {
            color: "#8B4513",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)", // 浅棕色
          },
        },
      },
      series: [
        {
          name: "历史建筑修复项目",
          type: "bar",
          barWidth: "35%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#CD853F" }, // 浅沙色
              { offset: 1, color: "#A0522D" }, // 深土色
            ]),
          },
          data: [18, 25, 12, 10], // 示例数据：不同类型修复项目数量
        },
        {
          name: "社区环境改善项目",
          type: "bar",
          barWidth: "35%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#F4A460" }, // 橙棕色
              { offset: 1, color: "#D2691E" }, // 深橙色
            ]),
          },
          data: [15, 10, 20, 18], // 示例数据：不同类型环境改善项目数量
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// --- 替代原 "文化研究图表" 为 "非遗传承与文创发展趋势图" ---
const initCultureChart = () => {
  if (cultureChart.value) {
    const chart = echarts.init(cultureChart.value);

    const option = {
      title: {
        text: "非遗传承与文创发展趋势",
        left: "center",
        top: "5%",
        textStyle: {
          color: "#4a4a4a",
          fontSize: 20,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["非遗活动场次", "文创产品销售额 (万元)"],
        bottom: 0,
        textStyle: { color: "#5a4a42" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["2010", "2013", "2016", "2019", "2022", "2024"],
        axisLine: {
          lineStyle: {
            color: "#8B4513",
          },
        },
      },
      yAxis: [
        {
          type: "value",
          name: "场次",
          nameTextStyle: {
            color: "#5a4a42",
          },
          axisLine: {
            lineStyle: {
              color: "#8B4513",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(139, 69, 19, 0.1)",
            },
          },
        },
        {
          type: "value",
          name: "销售额 (万元)",
          nameTextStyle: {
            color: "#5a4a42",
          },
          axisLine: {
            lineStyle: {
              color: "#8B4513",
            },
          },
          splitLine: {
            show: false, // 第二个Y轴不显示分割线
          },
        },
      ],
      series: [
        {
          name: "非遗活动场次",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#D2691E", // 橙棕色
          },
          itemStyle: {
            color: "#D2691E",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(210, 105, 30, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(210, 105, 30, 0)",
              },
            ]),
          },
          data: [50, 80, 120, 180, 250, 320], // 示例数据：非遗活动场次增长
        },
        {
          name: "文创产品销售额 (万元)",
          type: "line",
          yAxisIndex: 1, // 使用第二个Y轴
          smooth: true,
          symbol: "rect",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#FFD700", // 金黄色
          },
          itemStyle: {
            color: "#FFD700",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(255, 215, 0, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(255, 215, 0, 0)",
              },
            ]),
          },
          data: [100, 300, 800, 1500, 3000, 5000], // 示例数据：文创销售额增长
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// --- 保留或修改旅游影响图表，这里暂未在模板中直接引用，但可以作为未来扩展 ---
// const initTourismChart = () => { /* ... */ };

onMounted(() => {
  initCosmosChart(); // 大栅栏商业业态构成环形图
  initArchChart(); // 城市更新与保护投入对比图
  initCultureChart(); // 非遗传承与文创发展趋势图
  // initTourismChart(); // 如果需要，可以启用
});

// onBeforeUnmount 钩子用于销毁图表实例
// import { onBeforeUnmount } from 'vue';
// onBeforeUnmount(() => {
//   if (imperialPhilosophyChart.value) echarts.getInstanceByDom(imperialPhilosophyChart.value)?.dispose();
//   if (archChart.value) echarts.getInstanceByDom(archChart.value)?.dispose();
//   if (cultureChart.value) echarts.getInstanceByDom(cultureChart.value)?.dispose();
//   if (tourismChart.value) echarts.getInstanceByDom(tourismChart.value)?.dispose();
// });
const currentLandmark = "大栅栏"; // 定义当前页面的景点名称
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
  background: rgba(255, 248, 225, 0.8);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #5d4b4b;
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
  color: #5a4a42;
  text-align: center;
}

.philosophy-item p {
  margin: 0;
  color: #5a4a42;
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
  background: rgba(255, 248, 225, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
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