<template>
  <div class="dashboard-container">
    <!-- 页面标题区 -->
    <div class="influence-header">
      <h1>天坛建筑的宇宙观与世界影响</h1>
      <p>解读古代建筑中的哲学智慧及其全球文化遗产价值</p>
    </div>

    <!-- 主内容区 -->
    <div class="dashboard-content">
      <!-- 左侧主要可视化区 -->
      <div class="main-visualization">
        <!-- 雷达图评估板块 -->
        <div class="visualization-card radar-section">
          <div class="section-title">
            <h2>天坛建筑综合评估</h2>
            <div class="divider"></div>
            <p class="section-description">基于文化遗产价值的多维度分析</p>
          </div>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>

        <!-- 宇宙哲学部分 -->
        <div class="visualization-card philosophy-section">
          <div class="section-title">
            <h2>天坛建筑中的宇宙哲学</h2>
            <div class="divider"></div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">☯☯</i>
              </div>
              <h3>天圆地方的宇宙模型</h3>
              <p>
                天坛整体布局呈现"北圆南方"结构，祈年殿的圆形三重檐象征"天"，方形的围墙代表"地"，完美诠释了中国古代"天圆地方"的宇宙观。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">☀☀</i>
              </div>
              <h3>天人合一的哲学思想</h3>
              <p>
                建筑群通过精确的轴线布局与天文方位对应，体现"天人合一"哲学。冬至祭天时，阳光会穿过皇穹宇门洞照亮祭坛中心。
              </p>
            </div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">🌌🌌</i>
              </div>
              <h3>数字象征的宇宙秩序</h3>
              <p>
                祈年殿28根立柱象征二十八星宿；内圈12根金柱代表12个月份；外圈12根檐柱象征12时辰，整体36根立柱对应36天罡。
              </p>
            </div>
            <div class="philosophy-item">
              <div class="icon-circle">
                <i class="icon">☯☯</i>
              </div>
              <h3>阴阳五行的哲学系统</h3>
              <p>
                建筑色彩运用深含阴阳五行哲学：蓝色琉璃瓦象征蓝天（阳），汉白玉栏杆代表大地（阴）；四方色彩对应四季五行。
              </p>
            </div>
          </div>
          <div class="cosmos-chart">
            <div ref="cosmosChart" class="chart-box"></div>
          </div>
        </div>
      </div>

      <!-- 右侧辅助信息区 -->
      <div class="side-panel">
        <!-- 全球影响总结 -->
        <div class="metrics-card global-impact">
          <h3 class="metrics-title">天坛的全球文化遗产价值</h3>
          <div class="impact-grid">
            <div class="impact-item">
              <div class="impact-value">1,200+</div>
              <div class="impact-label">全球仿建建筑数量</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">42</div>
              <div class="impact-label">国家建筑课程案例</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">98%</div>
              <div class="impact-label">游客满意度</div>
            </div>
            <div class="impact-item">
              <div class="impact-value">500+</div>
              <div class="impact-label">年度学术出版物</div>
            </div>
          </div>
        </div>

        <!-- 影响维度1 -->
        <div class="impact-dimension">
          <h3><i class="icon">🏛🏛️</i> 对建筑艺术的影响</h3>
          <div class="dimension-content">
            <p>天坛的象征性设计影响了全球宗教建筑：</p>
            <ul>
              <li>英国邱园中国塔（1762年）</li>
              <li>美国洛杉矶亨廷顿图书馆</li>
              <li>日本明治神宫（1920年）</li>
            </ul>
            <div class="chart-container">
              <div ref="archChart" class="chart-box"></div>
            </div>
          </div>
        </div>

        <!-- 影响维度2 -->
        <div class="impact-dimension">
          <h3><i class="icon">📚📚</i> 对文化研究的影响</h3>
          <div class="dimension-content">
            <p>近30年天坛相关学术研究持续增长：</p>
            <ul>
              <li>发表相关论文2,400余篇</li>
              <li>全球42所高校相关课程</li>
              <li>联合国教科文组织典范</li>
            </ul>
            <div class="chart-container">
              <div ref="cultureChart" class="chart-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="dashboard-footer">
      <p>
        天坛作为中国古代宇宙观的建筑象征，不仅体现了华夏文明的哲学智慧，更成为全人类共同的文化遗产。
      </p>
      <p>联合国教科文组织世界遗产 · 编号881</p>
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

// ECharts图表引用
const cosmosChart = ref(null);
const archChart = ref(null);
const cultureChart = ref(null);

// 初始化宇宙哲学图表
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
          // color: "#5a4a42",
          /* 将图例文字改为更亮的米色 */
          color: "#b8a692",
        },
      },
      color: ["#8b4513", "#d4a76a", "#9c7c5c", "#b2967d"],
      series: [
        {
          name: "宇宙哲学要素",
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
                // color: "#5a4a42",
                /* 将标签文字改为更亮的米色 */
                color: "#b8a692",
                lineHeight: 20,
              },
              c: {
                fontSize: 16,
                // color: "#8b4513",
                /* 将百分比数字改为主题金色，更突出 */
                color: "#d4a76a",
                fontWeight: "bold",
              },
            },
          },
          data: [
            { value: 35, name: "空间象征" },
            { value: 30, name: "数字哲学" },
            { value: 20, name: "色彩象征" },
            { value: 15, name: "祭祀礼仪" },
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
        data: ["圆形布局", "色彩运用", "木构技术", "轴线序列", "声学设计"],
        axisLine: {
          lineStyle: {
            // color: "#8b4513",
            /* 调整轴线颜色 */
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        axisLabel: {
          // color: "#D4A76A",
          color: "rgba(255, 255, 255, 0.85)",
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "影响指数",
        nameTextStyle: {
          /* 整轴名称文字颜色 */
          color: "rgba(255, 255, 255, 0.85)",
        },
        axisLine: {
          lineStyle: {
            // color: "#8b4513",
            /* 调整轴线颜色 */
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        splitLine: {
          lineStyle: {
            // color: "rgba(139, 69, 19, 0.1)",
            /* 调整分割线颜色 */
            color: "rgba(255, 255, 255, 0.15)",
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
              { offset: 0, color: "#8b4513" },
              { offset: 1, color: "#5a2d0c" },
            ]),
          },
          data: [89, 78, 82, 75, 68],
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
          // color: "#D4A76A",
          /* 调整图例文字颜色 */
          color: "rgba(255, 255, 255, 0.85)",
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
            // color: "#8b4513",
            /* 调整轴线颜色 */
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: {
          // color: "#D4A76A",
          /* 调整轴名称文字颜色 */
          color: "rgba(255, 255, 255, 0.85)",
        },
        axisLine: {
          lineStyle: {
            // color: "#8b4513",
            /* 调整轴线颜色 */
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        splitLine: {
          lineStyle: {
            // color: "rgba(139, 69, 19, 0.1)",
            /* 调整分割线颜色 */
            color: "rgba(255, 255, 255, 0.15)",
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
            color: "#8b4513",
          },
          itemStyle: {
            color: "#8b4513",
          },
          data: [12, 28, 45, 78, 120, 210, 285, 320],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            // color: "#d4a76a",
            /* 调整线条颜色 */
            color: "#ffffff",
          },
          itemStyle: {
            // color: "#d4a76a",
            /* 调整标记点颜色 */
            color: "#ffffff",
          },
          data: [3, 8, 15, 26, 42, 68, 95, 120],
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
});
const currentLandmark = "天坛"; // 定义当前页面的景点名称
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  color: #e0d6c2;
  font-family: "Noto Serif SC", serif;
}

.influence-header {
  text-align: center;
  padding: 3rem 2rem;
  position: relative;
  background: rgba(93, 75, 75, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin: 1rem 2rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.influence-header h1 {
  font-size: 2.8rem;
  color: #8b4513;
  margin-bottom: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.influence-header p {
  font-size: 1.2rem;
  color: #5a4a42;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.9;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(94, 66, 41, 0.8);
  color: #fff8e1;
  border: 1px solid #5d4037;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: rgba(121, 85, 72, 0.9);
  transform: translateX(-2px);
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
  
  background: rgba(93, 75, 75, 0.3);
  border-radius: 6px;
  padding: 1rem;
 
  border: 1px solid rgba(255, 255, 255, 0.1);
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
} */
 .philosophy-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  /* 标题文字改为亮金色 */
  color: #d4a76a;
  text-align: center;
}

/* .philosophy-item p {
  margin: 0;
  color: #5a4a42;
  font-size: 0.9rem;
  line-height: 1.5;
} */
 .philosophy-item p {
  margin: 0;
  /* 提升颜色亮度并略微增加字重，使其更清晰 */
  color: #5a4a42; 
  font-weight: 300; /* 可选：增加一点字重 */
  font-size: 0.9rem;
  line-height: 1.6; /* 可选：略微增加行高，提升呼吸感 */
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
  /* 背景色统一为深灰褐色 */
  background: rgba(42, 34, 34, 0.7);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.metrics-card {
  /* background: rgba(42, 34, 34, 0.7); */
  /* 调整背景色以匹配按钮颜色 */
  background: #c2a36e;
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
}

.metrics-title {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  /* color: #d4b483; */
  /* 调整文字颜色以适应新背景 */
  color: #ffffff;
  text-align: center;
  /* border-bottom: 1px solid #5d4b4b; */
  /* 调整边框颜色 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
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
  /* color: #d4a76a; */
  /* 调整文字颜色 */
  color: #ffffff;
  font-weight: bold;
}

.impact-label {
  font-size: 0.9rem;
  /* color: #b8a692; */
  /* 调整文字颜色 */
  color: rgba(255, 255, 255, 0.85);
}

.impact-dimension {
  /* background: rgba(42, 34, 34, 0.7); */
  /* 调整背景色以匹配按钮颜色 */
  background: #c2a36e;
  border: 1px solid #5d4b4b;
  border-radius: 6px;
  padding: 1.5rem;
}

.impact-dimension h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  /* color: #d4b483; */
  /* 调整文字颜色以适应新背景 */
  color: #ffffff;
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