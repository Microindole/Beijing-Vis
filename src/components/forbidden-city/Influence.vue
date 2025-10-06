<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="goBack">
        <span class="icon">←</span> 返回故宫门户
      </button>
      <h1 class="dashboard-title">故宫建筑的帝王秩序与世界影响</h1>
      <p class="dashboard-subtitle">
        解读古代建筑中的权力象征及其全球文化遗产价值
      </p>
    </div>

    <div class="dashboard-content">
      <div class="main-visualization">
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>故宫建筑综合评估</h2>
            <div class="divider"></div>
            <p class="section-description">基于文化遗产价值的多维度分析</p>
          </div>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>故宫建筑中的帝王秩序</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">👑</i>
              </div>
              <h3>中轴对称的至高皇权</h3>
              <p>
                故宫严格遵循中轴对称布局，三大殿（太和殿、中和殿、保和殿）居于中轴线上，象征皇帝的至高无上和“天子”的地位。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🐉</i>
              </div>
              <h3>五行色彩的等级秩序</h3>
              <p>
                黄色琉璃瓦代表皇权与尊贵，红墙象征喜庆与庄严。建筑色彩严格按照阴阳五行学说与礼制规定，体现森严的等级制度。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏯</i>
              </div>
              <h3>九五之尊的数字象征</h3>
              <p>
                故宫大量使用“九”和“五”等数字，如门钉九行九列、太和殿面阔十一间（奇数），象征皇帝“九五之尊”的地位。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏛️</i>
              </div>
              <h3>内外朝的权力结构</h3>
              <p>
                前朝（外朝）用于举行国家大典，后寝（内廷）为皇帝及后妃生活场所。这种“前朝后寝”的布局清晰划分了政务与生活空间，体现了严谨的宫廷秩序。
              </p>
            </div>
          </div>
          <div class="cosmos-chart">
            <div ref="cosmosChart" class="chart-box"></div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <div class="metrics-card global-impact">
          <h3 class="metrics-title">故宫的全球文化遗产价值</h3>
          <div class="impact-grid">
            <div class="impact-item">
              <div class="impact-value">1,500+</div>
              <div class="impact-label">全球文化交流活动</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">60+</div>
              <div class="impact-label">国家历史课程案例</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">99%</div>
              <div class="impact-label">游客推荐度</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">700+</div>
              <div class="impact-label">年度学术出版物</div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">🏰</i> 对建筑艺术的影响</h3>
          <div class="dimension-content">
            <p>故宫的宏伟与精巧影响了全球宫殿建筑：</p>
            <ul>
              <li>日本京都御所（受中国宫殿影响）</li>
              <li>韩国景福宫（仿明清宫殿规制）</li>
              <li>越南顺化皇城（借鉴紫禁城布局）</li>
            </ul>
            <div class="chart-container">
              <div ref="archChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">📚</i> 对文化研究的影响</h3>
          <div class="dimension-content">
            <p>近30年故宫相关学术研究持续增长：</p>
            <ul>
              <li>发表相关论文3,000余篇</li>
              <li>全球50余所高校开设相关课程</li>
              <li>世界文化遗产保护典范</li>
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
        故宫作为中国古代帝王统治的象征，不仅体现了华夏文明的建筑艺术高峰，更成为全人类共同的文化遗产。
      </p>
      <p>联合国教科文组织世界遗产 · 编号439</p>
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
const goBack = () => router.push("/landmarks/forbidden-city");

// ECharts图表引用
const cosmosChart = ref(null); // Renamed to imperialOrderChart for clarity, but keeping original for direct replacement.
const archChart = ref(null);
const cultureChart = ref(null);
const tourismChart = ref(null);

// 初始化帝王秩序图表 (原cosmosChart)
const initCosmosChart = () => {
  if (cosmosChart.value) {
    const chart = echarts.init(cosmosChart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}",
      },
      legend: {
        top: "bottom",
        textStyle: {
          color: "#D4A76A",
        },
      },
      color: ["#c09337", "#a06a20", "#e0bd8c", "#805c18"], // More golden/imperial colors
      series: [
        {
          name: "帝王秩序要素",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "40%"],
          roseType: "area",
          label: {
            show: true,
            formatter: "{b|{b}}\n{c|{c}%}",
            rich: {
              b: {
                fontSize: 14,
                color: "#D4A76A",
                lineHeight: 20,
              },
              c: {
                fontSize: 16,
                color: "#c09337", // Main golden color
                fontWeight: "bold",
              },
            },
          },
          data: [
            { value: 40, name: "中轴对称" },
            { value: 25, name: "色彩象征" },
            { value: 20, name: "数字运用" },
            { value: 15, name: "前朝后寝" },
          ],
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// 初始化建筑影响图表
const initArchChart = () => {
  if (archChart.value) {
    const chart = echarts.init(archChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["中轴布局", "宫殿形制", "黄色琉璃", "内外朝制", "斗栱结构"],
        axisLine: {
          lineStyle: {
            color: "#c09337",
          },
        },
        axisLabel: {
          color: "#D4A76A",
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "影响指数",
        nameTextStyle: {
          // color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#c09337",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(192, 147, 55, 0.1)", // Lighter golden for split lines
          },
        },
      },
      series: [
        {
          name: "影响程度",
          type: "bar",
          barWidth: "60%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#e0bd8c" }, // Lighter golden
              { offset: 1, color: "#c09337" }, // Darker golden
            ]),
          },
          data: [92, 85, 88, 80, 75], // Updated data for Forbidden City
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// 初始化文化研究图表
const initCultureChart = () => {
  if (cultureChart.value) {
    const chart = echarts.init(cultureChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["论文数量", "研究项目"],
        textStyle: {
          color: "#D4A76A",
        },
        bottom: 0,
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
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: {
          lineStyle: {
            color: "#c09337",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: {
          color: "#D4A76A",
        },
        axisLine: {
          lineStyle: {
            color: "#c09337",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(192, 147, 55, 0.1)",
          },
        },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#c09337", // Golden color
          },
          itemStyle: {
            color: "#c09337",
          },
          data: [25, 50, 90, 150, 250, 400, 550, 700], // Increased data for Forbidden City
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#e0bd8c", // Lighter golden color
          },
          itemStyle: {
            color: "#e0bd8c",
          },
          data: [5, 15, 30, 50, 80, 120, 180, 240], // Increased data for Forbidden City
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// 初始化旅游影响图表
const initTourismChart = () => {
  if (tourismChart.value) {
    const chart = echarts.init(tourismChart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: {
          color: "#5a4a42",
        },
      },
      color: ["#c09337", "#a06a20", "#e0bd8c", "#805c18", "#f0e68c"], // Colors suitable for imperial theme
      series: [
        {
          name: "游客来源",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: "{b}: {d}%",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 70, name: "中国游客" }, // Increased domestic share
            { value: 10, name: "东亚国家" },
            { value: 8, name: "北美地区" },
            { value: 7, name: "欧洲国家" },
            { value: 5, name: "其他地区" },
          ],
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

onMounted(() => {
  initCosmosChart();
  initArchChart();
  initCultureChart();
  initTourismChart();
});
const currentLandmark = "故宫"; // 定义当前页面的景点名称
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

/* .philosophy-item {
  background: rgba(255, 248, 225, 0.8);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #5d4b4b;
} */
 .philosophy-item {
  
  background: rgba(88, 44, 44, 0.75);
  border-radius: 6px;
  padding: 1rem;
  
  border: 1px solid rgba(224, 189, 140, 0.2);
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

/* .philosophy-item h3 {
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
} */
 .philosophy-item h3 {
  
  color: #e0d6c2;
  text-align: center;
}

.philosophy-item p {
  
  color: #b8a692;
  font-size: 0.9rem;
}

/* 图表容器 */
.chart-box {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}

.cosmos-chart,
.chart-container {
  /* background: rgba(255, 248, 225, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); */
  background: rgba(88, 44, 44, 0.75);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
}

/* .metrics-card {
  background: rgba(42, 34, 34, 0.7);
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
} */
 .metrics-card {
  
  background: rgba(88, 44, 44, 0.75); 
  
  border: 1px solid rgba(224, 189, 140, 0.2); 
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

/* .impact-dimension {
  background: rgba(42, 34, 34, 0.7);
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
} */
 .impact-dimension {
 
  background: rgba(88, 44, 44, 0.75);
  
  border: 1px solid rgba(224, 189, 140, 0.2);
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
