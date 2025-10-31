<template>
  <div class="dashboard-container">
    <div class="dashboard-header">

      <h1 class="dashboard-title">法源寺的佛教文化地位与世界影响</h1>
      <p class="dashboard-subtitle">
        探索千年古刹的宗教价值及其全球文化遗产意义
      </p>
    </div>

    <div class="dashboard-content">
      <div class="main-visualization">
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>法源寺佛教文化综合评估</h2>
            <div class="divider"></div>
            <p class="section-description">
              基于宗教、历史与艺术价值的多维度分析
            </p>
          </div>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>法源寺的佛教文化精髓</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🕉️</i>
              </div>
              <h3>佛教哲学中心</h3>
              <p>
                法源寺作为北京历史最悠久的佛教寺庙之一，是汉传佛教的重要传播中心。寺内保存的《大藏经》等珍贵典籍，承载着"缘起性空"、"四圣谛"等核心佛学思想。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🏯</i>
              </div>
              <h3>建筑艺术典范</h3>
              <p>
                寺院布局严格遵循佛教"伽蓝七堂"规制，大雄宝殿采用重檐歇山顶，观音阁体现"倒坐观音"独特布局，整体建筑群展现汉传佛教建筑的典范之美。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">📜</i>
              </div>
              <h3>佛经翻译中心</h3>
              <p>
                自唐代以来，法源寺一直是重要的佛经翻译场所。玄奘法师曾在此讲经说法，寺内保存的梵文贝叶经和汉译佛经手稿见证了佛教文化交流的历史。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🙏</i>
              </div>
              <h3>禅修实践圣地</h3>
              <p>
                法源寺传承临济宗法脉，其禅堂设计遵循传统禅修空间规制，为僧众提供"打坐参禅"的理想环境，延续"明心见性"的禅修传统。
              </p>
            </div>
          </div>
          <div class="cosmos-chart">
            <div ref="buddhismChart" class="chart-box"></div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <div class="metrics-card global-impact">
          <h3 class="metrics-title">法源寺的全球佛教影响力</h3>
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

        <div class="impact-dimension">
          <h3><i class="icon">🌏</i> 对佛教传播的影响</h3>
          <div class="dimension-content">
            <p>法源寺作为东亚佛教传播枢纽：</p>
            <ul>
              <li>唐代日本遣唐使在此学习佛教文化</li>
              <li>韩国海东佛教受其禅宗思想深刻影响</li>
              <li>东南亚国家僧侣定期来此参学交流</li>
            </ul>
            <div class="chart-container">
              <div ref="spreadChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">📚</i> 对学术研究的影响</h3>
          <div class="dimension-content">
            <p>佛教学术研究重镇：</p>
            <ul>
              <li>藏有8,000余卷佛教典籍和手稿</li>
              <li>全球28所大学设立法源寺专项研究</li>
              <li>每年举办国际佛教学术研讨会</li>
            </ul>
            <div class="chart-container">
              <div ref="researchChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <div class="impact-dimension">
          <h3><i class="icon">🕊️</i> 对和平文化的贡献</h3>
          <div class="dimension-content">
            <p>促进跨宗教对话与和平：</p>
            <ul>
              <li>举办"世界宗教和平会议"</li>
              <li>建立佛教-基督教对话机制</li>
              <li>推动"佛教和平宣言"国际签署</li>
            </ul>
            <div class="chart-container">
              <div ref="peaceChart" class="chart-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-footer">
      <p>
        法源寺作为汉传佛教的活态传承中心，不仅承载着千年佛教智慧，更成为促进世界宗教对话与和平的重要桥梁。
      </p>
      <p>中国重点文物保护单位 · 佛教重要活动场所</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import RadarChartBoard from "../RadarChartBoard.vue";

const router = useRouter();



// ECharts图表引用
const buddhismChart = ref(null);
const spreadChart = ref(null);
const researchChart = ref(null);
const peaceChart = ref(null);

// 初始化佛教文化图表
const initBuddhismChart = () => {
  if (buddhismChart.value) {
    const chart = echarts.init(buddhismChart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}%",
      },
      legend: {
        top: "bottom",
        textStyle: {
          color: "#5a4a42",
        },
      },
      color: ["#c49a6c", "#a07850", "#8e6b47", "#78583f"],
      series: [
        {
          name: "佛教文化要素",
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
                color: "#5a4a42",
                lineHeight: 20,
              },
              c: {
                fontSize: 16,
                color: "#8b4513",
                fontWeight: "bold",
              },
            },
          },
          data: [
            { value: 35, name: "佛经典籍" },
            { value: 30, name: "禅修传统" },
            { value: 20, name: "建筑艺术" },
            { value: 15, name: "法会仪式" },
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

// 初始化佛教传播图表
const initSpreadChart = () => {
  if (spreadChart.value) {
    const chart = echarts.init(spreadChart.value);

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
        data: ["日本", "韩国", "越南", "泰国", "欧美"],
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          color: "#5a4a42",
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "影响指数",
        nameTextStyle: {
          color: "#5a4a42",
        },
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)",
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
              { offset: 0, color: "#d4a76a" },
              { offset: 1, color: "#8b4513" },
            ]),
          },
          data: [92, 88, 85, 78, 65],
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// 初始化学术研究图表
const initResearchChart = () => {
  if (researchChart.value) {
    const chart = echarts.init(researchChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["学术论文", "研究项目"],
        textStyle: {
          color: "#5a4a42",
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
        data: ["2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: {
          color: "#5a4a42",
        },
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)",
          },
        },
      },
      series: [
        {
          name: "学术论文",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#8b4513",
          },
          itemStyle: {
            color: "#8b4513",
          },
          data: [35, 68, 105, 180, 245, 320],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#d4a76a",
          },
          itemStyle: {
            color: "#d4a76a",
          },
          data: [8, 15, 28, 42, 65, 88],
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
};

// 初始化和平贡献图表
const initPeaceChart = () => {
  if (peaceChart.value) {
    const chart = echarts.init(peaceChart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}次",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: {
          color: "#5a4a42",
        },
      },
      color: ["#8b4513", "#d4a76a", "#9c7c5c", "#b2967d"],
      series: [
        {
          name: "和平活动",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: "{b}: {c}次",
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
            { value: 56, name: "国际对话会议" },
            { value: 42, name: "跨宗教交流" },
            { value: 35, name: "和平宣言签署" },
            { value: 28, name: "冲突调解活动" },
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
  initBuddhismChart();
  initSpreadChart();
  initResearchChart();
  initPeaceChart();
});const currentLandmark = "法源寺"; // 定义当前页面的景点名称
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
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