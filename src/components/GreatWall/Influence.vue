<template>
  <div class="influence-container">
    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button">← 返回长城门户</button>

    <!-- 页面标题 -->
    <div class="influence-header">
      <h1>长城的历史价值与世界影响</h1>
      <p>解读中华民族的伟大防御工程及其全球文化遗产地位</p>
    </div>

    <!-- 两列主内容 -->
    <div class="main-columns">
      <!-- 左侧：雷达图和其他图表 -->
      <div class="charts-section" style="flex: 2; min-width: 340px">
        <div class="chart-card" style="height: 100%">
          <h3 class="chart-title">北京历史地标评估雷达图</h3>
          <RadarChartBoard class="radar-container" :currentLandmark="currentLandmark" />
        </div>
        <div class="charts-grid">
          <div class="chart-card">
            <h3 class="chart-title">长城沿线省份分布</h3>
            <div ref="provinceChart" class="chart-box"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">防御体系结构占比</h3>
            <div ref="structureChart" class="chart-box"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">学术研究趋势</h3>
            <div ref="cultureChart" class="chart-box"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">游客来源分布</h3>
            <div ref="tourismChart" class="chart-box"></div>
          </div>
        </div>
      </div>
      <!-- 右侧：文字紧凑排列 -->
      <div
        class="text-section"
        style="flex: 1; min-width: 220px; padding: 16px 10px"
      >
        <div class="section-title">
          <h2>世界文化遗产价值</h2>
          <div class="divider"></div>
        </div>
        <div class="philosophy-item">
          <h3>对防御建筑艺术的影响</h3>
          <ul>
            <li>长城成为世界防御工事的典范，影响了欧洲及亚洲多国的城防设计</li>
            <li>烽火台、敌楼等结构被后世广泛借鉴</li>
            <li>体现了古代中国军事工程与地形利用的智慧</li>
          </ul>
        </div>
        <div class="philosophy-item">
          <h3>对历史文化研究的影响</h3>
          <ul>
            <li>全球范围内关于长城的学术论文与著作超过3000篇</li>
            <li>成为中外历史、考古、建筑等多学科研究的重要对象</li>
            <li>联合国教科文组织将其列为世界文化遗产，强调其历史与文化价值</li>
          </ul>
        </div>
        <div class="philosophy-item">
          <h3>对旅游产业的影响</h3>
          <ul>
            <li>年接待游客超1000万人次（2019年数据）</li>
            <li>外国游客占比约30%，吸引全球80多个国家游客</li>
            <li>带动沿线形成特色旅游经济带</li>
          </ul>
        </div>
        <div class="philosophy-item">
          <h3>对中外交流的影响</h3>
          <ul>
            <li>“不到长城非好汉”成为中外文化交流的象征语</li>
            <li>多次举办国际文化节、马拉松等活动，促进国际交流</li>
            <li>长城形象出现在多国货币、邮票和影视作品中</li>
          </ul>
        </div>
        <div class="philosophy-item">
          <h3>历史事件与民族融合</h3>
          <ul>
            <li>见证了中国古代多民族融合与边疆治理的历史进程</li>
            <li>历代王朝修筑、维护，体现国家统一与民族团结</li>
            <li>成为中华民族精神的重要象征</li>
          </ul>
        </div>
        <div class="philosophy-item">
          <h3>艺术与文学影响</h3>
          <ul>
            <li>历代诗人、画家以长城为题材创作大量文学艺术作品</li>
            <li>长城形象成为中国美术、摄影、影视等领域的重要元素</li>
            <li>“万里长城”成为世界文化景观的代表性符号</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- 全球影响总结 -->
  <div class="global-impact horizontal-impact">
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

  <!-- 页脚 -->
  <div class="influence-footer">
    <p>
      长城作为中华民族的象征，不仅展现了古代中国的军事智慧与民族融合，更成为全人类共同的文化遗产。
    </p>
    <p>全国重点文物保护单位 · 世界文化遗产</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import RadarChart from "../RadarChart.vue";
import RadarChartBoard from "../RadarChartBoard.vue";

const router = useRouter();
const goBack = () => router.push("/landmarks/great-wall");

const provinceChart = ref(null);
const structureChart = ref(null);
const cultureChart = ref(null);
const tourismChart = ref(null);

const initProvinceChart = () => {
  if (provinceChart.value) {
    const chart = echarts.init(provinceChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}公里" },
      xAxis: {
        type: "category",
        data: [
          "河北",
          "北京",
          "山西",
          "陕西",
          "甘肃",
          "辽宁",
          "内蒙古",
          "宁夏",
          "天津",
        ],
        axisLabel: { color: "#5a4a42", rotate: 30 },
      },
      yAxis: {
        type: "value",
        name: "长度（公里）",
        nameTextStyle: { color: "#5a4a42" },
        axisLabel: { color: "#5a4a42" },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: [
        {
          name: "长城长度",
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#bfa46f" },
              { offset: 1, color: "#8b4513" },
            ]),
          },
          data: [2000, 629, 1300, 1800, 1500, 900, 2500, 400, 60],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

const initStructureChart = () => {
  if (structureChart.value) {
    const chart = echarts.init(structureChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {d}%" },
      legend: { top: "bottom", textStyle: { color: "#5a4a42" } },
      color: ["#8b4513", "#d4a76a", "#9c7c5c", "#b2967d"],
      series: [
        {
          name: "防御体系结构",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "40%"],
          roseType: "area",
          label: {
            show: true,
            formatter: "{b|{b}}\n{c|{c}%}",
            rich: {
              b: { fontSize: 14, color: "#5a4a42", lineHeight: 20 },
              c: { fontSize: 16, color: "#8b4513", fontWeight: "bold" },
            },
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

const initCultureChart = () => {
  if (cultureChart.value) {
    const chart = echarts.init(cultureChart.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      legend: {
        data: ["论文数量", "研究项目"],
        textStyle: { color: "#5a4a42" },
        bottom: 0,
      },
      grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2023"],
        axisLine: { lineStyle: { color: "#8b4513" } },
      },
      yAxis: {
        type: "value",
        name: "数量/项",
        nameTextStyle: { color: "#5a4a42" },
        axisLine: { lineStyle: { color: "#8b4513" } },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
      },
      series: [
        {
          name: "论文数量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 4, color: "#8b4513" },
          itemStyle: { color: "#8b4513" },
          data: [12, 28, 55, 90, 130, 200, 260, 320],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 4, color: "#d4a76a" },
          itemStyle: { color: "#d4a76a" },
          data: [3, 8, 18, 30, 45, 70, 90, 120],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

const initTourismChart = () => {
  if (tourismChart.value) {
    const chart = echarts.init(tourismChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: { color: "#5a4a42" },
      },
      color: [
        "#8b4513",
        "#d4a76a",
        "#9c7c5c",
        "#b2967d",
        "#c8b49c",
        "#f6c177",
        "#e6b800",
        "#bfa46f",
        "#a67c52",
      ],
      series: [
        {
          name: "游客来源",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          label: { show: true, formatter: "{b}: {d}%" },
          emphasis: {
            label: { show: true, fontSize: "18", fontWeight: "bold" },
          },
          labelLine: { show: true },
          data: [
            { value: 25, name: "北京" },
            { value: 18, name: "河北" },
            { value: 12, name: "陕西" },
            { value: 10, name: "山西" },
            { value: 8, name: "甘肃" },
            { value: 10, name: "海外" },
            { value: 9, name: "其他省份" },
            { value: 8, name: "东南亚及其他" },
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
const currentLandmark = "长城"; // 定义当前页面的景点名称
</script>

<style scoped>
.influence-container {
  font-family: "Noto Serif SC", serif;
  color: #333;
  line-height: 1.6;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}
.back-button {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: rgba(139, 69, 19, 0.7);
  color: #fff8e1;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.back-button:hover {
  background-color: rgba(160, 82, 45, 0.9);
  transform: translateX(-5px);
}
.influence-header {
  text-align: center;
  padding: 60px 20px 40px;
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}
.influence-header h1 {
  font-size: 2.2rem;
  color: #8b4513;
  margin-bottom: 15px;
}
.influence-header p {
  font-size: 1.1rem;
  color: #5a4a42;
  margin: 25px auto 0;
  line-height: 1.8;
  max-width: 700px;
}
.main-columns {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 40px auto;
}
.text-section {
  flex: 1.2;
  background: rgba(255, 248, 225, 0.8);
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.06); /* 恢复轻微阴影 */
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.section-title {
  margin-bottom: 8px;
  text-align: left;
}
.section-title h2 {
  font-size: 1.3em;
  /* color: #fc9a07; */
  /* 标题改为稳重的古铜金色 */
  color: #B8860B;
  margin-bottom: 8px;
}
.divider {
  width: 60px;
  height: 4px;
  /* background: linear-gradient(to right, #d4a76a, #8b4513); */
  /* 分割线颜色与标题协调 */
  background: linear-gradient(to right, #B8860B, #8B4513);
  margin: 0 0 18px 0;
  border-radius: 2px;
}
.philosophy-item {
  /* 背景改为与按钮匹配的青灰色 */
  background: #607d8b;
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 18px;
  /* 默认文字颜色改为白色以保证清晰度 */
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  /* 边框颜色与背景协调 */
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.philosophy-item:last-child {
  margin-bottom: 0;
}
.philosophy-item h3 {
  font-size: 1.1em;
  /* 标题颜色改为白色 */
  color: #ffffff;
  margin-bottom: 6px;
}
.philosophy-item p,
.philosophy-item ul {
  /* 正文文字颜色改为半透明白色 */
  color: rgba(255, 255, 255, 0.9);
  font-size: 1em;
  margin: 0 0 0 0;
  line-height: 1.7;
}
.philosophy-item ul {
  padding-left: 20px;
  margin-bottom: 0;
}
.charts-section {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.chart-card {
  background: rgba(255, 248, 225, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(139, 69, 19, 0.08);
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-title {
  font-size: 1.1em;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 10px;
}
.chart-box {
  width: 100%;
  height: 260px;
  min-height: 180px;
}
.global-impact {
  margin: 60px auto 0 auto;
  max-width: 1600px; /* 调宽，与北海公园一致 */
  padding: 40px 60px;
  /* 背景改为与按钮匹配的青灰色 */
  background: #455a64;
  border-radius: 20px;
  /* box-shadow: 0 15px 40px rgba(101, 67, 33, 0.15); */
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); /* 调整阴影以适应深色背景 */
  text-align: center;
}
.global-impact h2 {
  font-size: 1.3em;
  /* 标题颜色改为白色 */
  color: #ffffff;
  margin-bottom: 30px;
  position: relative;
}
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-top: 30px;
}
.impact-grid-horizontal {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 48px;
  margin-top: 30px;
  flex-wrap: wrap;
}
.impact-item {
  /* 卡片背景改为深一点的半透明青灰色 */
  background: rgba(96, 125, 139, 0.6);
  border-radius: 15px;
  padding: 20px 16px; /* 调小内边距 */
  min-width: 220px; /* 调小最小宽度 */
  max-width: 260px; /* 调小最大宽度 */
  flex: 1 1 200px; /* 允许更小宽度自动换行 */
  transition: all 0.3s ease;
  /* 边框颜色与新主题协调 */
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.impact-item:hover {
  transform: translateY(-5px);
  background: rgba(212, 167, 106, 0.3);
  box-shadow: 0 10px 25px rgba(139, 69, 19, 0.1);
}
.impact-value {
  font-size: 1.3rem; /* 调小字体 */
  font-weight: bold;
  /* 数字颜色改为白色 */
  color: #ffffff;
  margin-bottom: 8px;
}
.impact-label {
  font-size: 0.95em; /* 调小字体 */
  /* 标签文字改为半透明白色 */
  color: rgba(255, 255, 255, 0.9);
}
.influence-footer {
  text-align: center;
  padding: 40px 20px;
  color: #5a4a42;
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 1000px;
  margin: 0 auto;
  border-top: 1px solid rgba(139, 69, 19, 0.2);
}
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 28px;
}
.charts-grid .chart-card {
  min-width: 0;
  margin-bottom: 0;
  height: 280px;
}
.charts-grid .chart-card[style*="grid-column: span 2"] {
  grid-column: span 2;
  height: 340px;
}
.network-section .chart-card {
  background: rgba(255, 248, 225, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(139, 69, 19, 0.1);
  padding: 24px 24px 12px 24px;
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.network-section .chart-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16px;
}
.network-section .chart-box {
  width: 100%;
  height: 400px;
  min-height: 300px;
}
@media (max-width: 1100px) {
  .main-columns {
    flex-direction: column;
    gap: 24px;
  }
  .charts-section {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 18px;
  }
  .chart-card {
    width: 48%;
    min-width: 260px;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .charts-grid .chart-card,
  .charts-grid .chart-card[style*="grid-column: span 2"] {
    grid-column: span 1;
    height: 260px;
  }
  .global-impact.horizontal-impact,
  .global-impact {
    max-width: 98vw;
    padding: 30px 10px;
  }
  .impact-grid-horizontal {
    gap: 18px;
  }
}
@media (max-width: 900px) {
  .impact-grid-horizontal {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  .impact-item {
    max-width: 340px;
    width: 100%;
  }
}
@media (max-width: 700px) {
  .main-columns {
    flex-direction: column;
    gap: 12px;
  }
  .charts-section {
    flex-direction: column;
    gap: 18px;
  }
  .chart-card {
    width: 100%;
    min-width: 0;
  }
  .text-section {
    padding: 18px 8px;
  }
}
</style>
