<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="goBack">
        <span class="icon">←</span> 返回颐和园门户
      </button>
      <h1 class="dashboard-title">颐和园园林的艺术与世界影响</h1>
      <p class="dashboard-subtitle">
        解读古代园林中的山水意境及其全球文化遗产价值
      </p>
    </div>

    <div class="dashboard-content">
      <div class="main-visualization">
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>颐和园园林综合评估</h2>
            <div class="divider"></div>
            <p class="section-description">基于文化遗产价值的多维度分析</p>
          </div>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>颐和园园林中的山水意境</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏞️</i>
              </div>
              <h3>借景手法的巧妙运用</h3>
              <p>
                颐和园将万寿山和昆明湖的自然景观与园林建筑完美结合，并通过玉泉山、西山等远景进行借景，营造出“虽由人作，宛自天开”的意境。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">💧</i>
              </div>
              <h3>水景艺术的典范</h3>
              <p>
                以昆明湖为主体，湖中有岛，岸边有亭台楼阁，并以西堤仿西湖苏堤，展现了中国古典园林水景布局的最高成就。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🌸</i>
              </div>
              <h3>移步换景的园林序列</h3>
              <p>
                园内建筑群依山傍水，通过长廊、曲径、桥梁将不同景点串联，使游客在游览过程中步移景异，处处有景，富有诗情画意。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🎨</i>
              </div>
              <h3>建筑与自然的和谐统一</h3>
              <p>
                佛香阁、排云殿等主体建筑群依山而建，与自然地貌融为一体；各式桥亭、花木点缀其间，体现了中国传统“天人合一”的哲学思想。
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
          <h3 class="metrics-title">颐和园的全球文化遗产价值</h3>
          <div class="impact-grid">
            <div class="impact-item">
              <div class="impact-value">1,800+</div>
              <div class="impact-label">全球园林设计借鉴</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">70+</div>
              <div class="impact-label">国家景观课程案例</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">97%</div>
              <div class="impact-label">游客满意度</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">600+</div>
              <div class="impact-label">年度学术出版物</div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">🌳</i> 对园林艺术的影响</h3>
          <div class="dimension-content">
            <p>颐和园的造园理念影响了全球古典与现代园林：</p>
            <ul>
              <li>美国波士顿中国花园（仿苏州园林，受皇家园林启发）</li>
              <li>德国柏林中国园（体现中国北方园林风格）</li>
              <li>法国凡尔赛宫园林（对比展示东西方造园异同）</li>
            </ul>
            <div class="chart-container">
              <div ref="archChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">📚</i> 对文化研究的影响</h3>
          <div class="dimension-content">
            <p>近30年颐和园相关学术研究持续增长：</p>
            <ul>
              <li>发表相关论文2,800余篇</li>
              <li>全球45所高校开设相关课程</li>
              <li>世界园林遗产研究中心</li>
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
        颐和园作为中国皇家园林的瑰宝，不仅体现了华夏文明的园林艺术精髓，更成为全人类共同的文化遗产。
      </p>
      <p>联合国教科文组织世界遗产 · 编号880</p>
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
const goBack = () => router.push("/landmarks/summer-palace");

// ECharts图表引用
const cosmosChart = ref(null); // Renamed to gardenArtChart for clarity, but keeping original for direct replacement.
const archChart = ref(null);
const cultureChart = ref(null);
const tourismChart = ref(null);

// 初始化园林艺术图表 (原cosmosChart)
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
          color: "#4a6b5a", // Greenish tone for natural theme
        },
      },
      color: ["#6a996a", "#8cbf8c", "#aadeaa", "#c2eec2"], // Green palette for nature
      series: [
        {
          name: "园林艺术要素",
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
                color: "#4a6b5a",
                lineHeight: 20,
              },
              c: {
                fontSize: 16,
                color: "#6a996a", // Main green color
                fontWeight: "bold",
              },
            },
          },
          data: [
            { value: 35, name: "山水借景" },
            { value: 30, name: "水系布局" },
            { value: 20, name: "步移景异" },
            { value: 15, name: "建筑融景" },
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

// 初始化园林影响图表 (原archChart)
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
        data: ["借景手法", "水景设计", "廊桥运用", "植物配置", "亭台楼阁"],
        axisLine: {
          lineStyle: {
            color: "#6a996a",
          },
        },
        axisLabel: {
          color: "#4a6b5a",
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "影响指数",
        nameTextStyle: {
          color: "#4a6b5a",
        },
        axisLine: {
          lineStyle: {
            color: "#6a996a",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(106, 153, 106, 0.1)", // Lighter green for split lines
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
              { offset: 0, color: "#aadeaa" }, // Lighter green
              { offset: 1, color: "#6a996a" }, // Darker green
            ]),
          },
          data: [90, 88, 85, 78, 82], // Updated data for Summer Palace garden influence
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
          color: "#4a6b5a",
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
            color: "#6a996a",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: {
          color: "#4a6b5a",
        },
        axisLine: {
          lineStyle: {
            color: "#6a996a",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(106, 153, 106, 0.1)",
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
            color: "#6a996a", // Green color
          },
          itemStyle: {
            color: "#6a996a",
          },
          data: [20, 40, 75, 120, 200, 350, 480, 600], // Adjusted data for Summer Palace
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#aadeaa", // Lighter green color
          },
          itemStyle: {
            color: "#aadeaa",
          },
          data: [4, 10, 25, 40, 70, 100, 150, 200], // Adjusted data for Summer Palace
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
          color: "#4a6b5a",
        },
      },
      color: ["#6a996a", "#8cbf8c", "#aadeaa", "#c2eec2", "#c8e6c9"], // Greenish colors
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
            { value: 75, name: "中国游客" }, // High domestic share for a scenic garden
            { value: 9, name: "东亚国家" },
            { value: 7, name: "北美地区" },
            { value: 6, name: "欧洲国家" },
            { value: 3, name: "其他地区" },
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
const currentLandmark = "颐和园"; // 定义当前页面的景点名称
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
