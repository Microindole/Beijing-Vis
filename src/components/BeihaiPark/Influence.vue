<template>
  <div class="influence-container">
    <div class="influence-header">
      <h1>北海公园的历史价值与世界影响</h1>
      <p>解读皇家园林的艺术成就及其全球文化遗产地位</p>
    </div>

    <div class="main-columns">
      <div class="charts-section" style="flex: 1.5; min-width: 400px">

        <div class="chart-card evaluation-card">
          <div class="radar-header">
            <h3 class="chart-title">核心价值评估 (与同类园林对比)</h3>
          </div>
          <div class="chart-wrapper">
            <BeihaiEvaluation />
          </div>
        </div>
        <div class="charts-grid">
          <div class="chart-card">
            <h3 class="chart-title">园林艺术要素占比</h3>
            <div ref="cosmosChart" class="chart-box"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">园林艺术影响力</h3>
            <div ref="archChart" class="chart-box"></div>
          </div>
        </div>
      </div>

      <div class="text-section-visual" style="flex: 1.2; min-width: 380px;">
        <div class="section-header-visual">
          <h2>世界文化遗产价值体系</h2>
          <p>拖动节点探索北海的多维影响力</p>
        </div>
        <div class="galaxy-wrapper">
          <InfluenceGalaxy />
        </div>
      </div>
    </div>

    <div class="bottom-charts">
      <div class="chart-card large-card">
        <h3 class="chart-title">学术研究历史演变 (1990-2023)</h3>
        <div class="chart-box">
          <BeihaiStream />
        </div>
      </div>
      <div class="chart-card large-card">
        <h3 class="chart-title">游客来源层级分布</h3>
        <div class="chart-box">
          <BeihaiSunburst />
        </div>
      </div>
    </div>

    <div class="network-section" style="margin: 40px auto 0; max-width: 1200px">
      <div class="chart-card" style="height: 480px">
        <h3 class="chart-title">北海公园世界影响网络</h3>
        <div ref="influenceNetworkChart" class="chart-box" style="height: 400px"></div>
      </div>
    </div>

    <div class="global-impact">
      <h2>北海公园的全球文化遗产价值</h2>
      <div class="impact-grid">
        <div class="impact-item">
          <div class="impact-value">300+</div>
          <div class="impact-label">全球仿建园林数量</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">20+</div>
          <div class="impact-label">国家园林课程案例</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">97%</div>
          <div class="impact-label">游客满意度</div>
        </div>
        <div class="impact-item">
          <div class="impact-value">200+</div>
          <div class="impact-label">年度学术出版物</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

// 引入所有 D3 组件
import InfluenceGalaxy from "./InfluenceGalaxy.vue";
import BeihaiEvaluation from "./BeihaiEvaluation.vue";
import BeihaiStream from "./BeihaiStream.vue";
import BeihaiSunburst from "./BeihaiSunburst.vue";

const router = useRouter();
const goBack = () => router.push("/landmarks/beihai-park");

const cosmosChart = ref(null);
const archChart = ref(null);
const influenceNetworkChart = ref(null);

// 雷达图数据
const radarData = ref([
  { axis: "官方评级", value: 5 },
  { axis: "历史价值", value: 4.8 },
  { axis: "公众热度", value: 4.2 },
  { axis: "当代活力", value: 3.5 },
  { axis: "文化特性", value: 4.9 }
]);

const cultureChart = ref(null);
const tourismChart = ref(null);

const initCosmosChart = () => {
  if (cosmosChart.value) {
    const chart = echarts.init(cosmosChart.value);
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c}" },
      legend: { top: "bottom", textStyle: { color: "#5a4a42" } },
      color: ["#8b4513", "#d4a76a", "#9c7c5c", "#b2967d"],
      series: [
        {
          name: "园林艺术要素",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "40%"],
          roseType: "area",
          label: { show: false },
          data: [
            { value: 40, name: "空间布局" },
            { value: 30, name: "建筑艺术" },
            { value: 20, name: "植物景观" },
            { value: 10, name: "皇家礼仪" },
          ],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

const initArchChart = () => {
  if (archChart.value) {
    const chart = echarts.init(archChart.value);
    chart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["湖岛布局", "桥岛结构", "佛塔艺术", "植物配置", "中西合璧"],
        axisLine: { lineStyle: { color: "#8b4513" } },
        axisLabel: { color: "#5a4a42", rotate: 30 },
      },
      yAxis: {
        type: "value",
        name: "影响指数",
        nameTextStyle: { color: "#5a4a42" },
        axisLine: { lineStyle: { color: "#8b4513" } },
        splitLine: { lineStyle: { color: "rgba(139, 69, 19, 0.1)" } },
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
          data: [92, 85, 80, 75, 68],
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
          data: [8, 18, 35, 60, 90, 140, 180, 210],
        },
        {
          name: "研究项目",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 4, color: "#d4a76a" },
          itemStyle: { color: "#d4a76a" },
          data: [2, 5, 10, 18, 28, 45, 60, 80],
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
      tooltip: { trigger: "item", formatter: "{b}: {d}%" },
      legend: {
        /* 此处修改: 图例移至底部水平排列 */
        top: 'bottom',
        left: 'center',
        textStyle: { color: "#5a4a42" },
      },
      color: [
        "#8b4513", "#d4a76a", "#9c7c5c", "#b2967d", "#c8b49c",
        "#f6c177", "#e6b800", "#bfa46f", "#a67c52",
      ],
      series: [
        {
          name: "游客来源",
          type: "pie",
          /* 此处修改: 恢复半径并居中 */
          radius: ["35%", "60%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: { 
            show: true, 
            formatter: "{b}: {d}%",
            color: '#5a4a42', // 确保标签文字清晰
            fontSize: 12,
          },
          labelLine: { 
            show: true,
            length: 10,
            length2: 15,
          },
          data: [
            { value: 22, name: "北京" },
            { value: 14, name: "河北" },
            { value: 12, name: "山东" },
            { value: 10, name: "江苏" },
            { value: 8, name: "广东" },
            { value: 8, name: "东亚国家" },
            { value: 7, name: "四川" },
            { value: 6, name: "欧美地区" },
            { value: 4, name: "东南亚及其他" },
          ],
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

// 新增：北海公园世界影响网络图
const initInfluenceNetworkChart = () => {
  // ... 保持原有的网络图代码不变 ...
  if (influenceNetworkChart.value) {
    const chart = echarts.init(influenceNetworkChart.value);
    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          if (params.dataType === "node") {
            return `<b>${params.data.name}</b><br/>${params.data.desc || ""}`;
          }
          if (params.dataType === "edge") {
            return params.data.label ? params.data.label : "";
          }
          return "";
        },
      },
      legend: [
        {
          data: ["北海公园", "世界园林", "学术机构", "文化遗产", "旅游城市"],
          orient: "vertical",
          left: 10,
          top: 10,
          textStyle: { color: "#5a4a42" },
        },
      ],
      series: [
        {
          type: "graph",
          layout: "force",
          symbolSize: 60,
          roam: true,
          label: {
            show: true,
            fontSize: 14,
            color: "#5a4a42",
          },
          force: {
            repulsion: 350,
            edgeLength: 120,
          },
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [6, 16],
          edgeLabel: {
            show: true,
            fontSize: 12,
            color: "#8b4513",
            formatter: "{c}",
          },
          data: [
            {
              name: "北海公园",
              category: 0,
              value: 100,
              desc: "中国皇家园林典范，世界文化遗产",
              itemStyle: { color: "#5e8c6a" },
            },
            {
              name: "圣彼得堡夏宫",
              category: 1,
              value: 60,
              desc: "俄罗斯著名皇家园林，借鉴北海湖岛布局",
              itemStyle: { color: "#b3cbb9" },
            },
            {
              name: "新宿御苑",
              category: 1,
              value: 55,
              desc: "日本东京著名园林，模仿北海水体与岛屿结构",
              itemStyle: { color: "#b3cbb9" },
            },
            {
              name: "金门公园",
              category: 1,
              value: 50,
              desc: "美国旧金山中式园林区参考北海桥岛结构",
              itemStyle: { color: "#b3cbb9" },
            },
            {
              name: "联合国教科文组织",
              category: 3,
              value: 70,
              desc: "将北海公园列为东方园林艺术典范",
              itemStyle: { color: "#d4a76a" },
            },
            {
              name: "北京大学",
              category: 2,
              value: 40,
              desc: "开设中国园林艺术课程，研究北海公园",
              itemStyle: { color: "#9c7c5c" },
            },
            {
              name: "哈佛大学",
              category: 2,
              value: 38,
              desc: "园林与景观设计课程引用北海案例",
              itemStyle: { color: "#9c7c5c" },
            },
            {
              name: "世界文化遗产",
              category: 3,
              value: 80,
              desc: "北海公园被列入世界文化遗产名录",
              itemStyle: { color: "#f6c177" },
            },
            {
              name: "北京",
              category: 4,
              value: 30,
              desc: "北海公园所在地，世界著名旅游城市",
              itemStyle: { color: "#8b4513" },
            },
            {
              name: "东京",
              category: 4,
              value: 28,
              desc: "新宿御苑所在地，国际文化交流城市",
              itemStyle: { color: "#8b4513" },
            },
            {
              name: "旧金山",
              category: 4,
              value: 26,
              desc: "金门公园所在地，国际旅游城市",
              itemStyle: { color: "#8b4513" },
            },
          ],
          categories: [
            { name: "北海公园" },
            { name: "世界园林" },
            { name: "学术机构" },
            { name: "文化遗产" },
            { name: "旅游城市" },
          ],
          links: [
            {
              source: "北海公园",
              target: "圣彼得堡夏宫",
              value: "湖岛布局影响",
              lineStyle: { color: "#388e3c", width: 4 },
            },
            {
              source: "北海公园",
              target: "新宿御苑",
              value: "水体岛屿结构影响",
              lineStyle: { color: "#388e3c", width: 4 },
            },
            {
              source: "北海公园",
              target: "金门公园",
              value: "桥岛结构影响",
              lineStyle: { color: "#388e3c", width: 4 },
            },
            {
              source: "北海公园",
              target: "联合国教科文组织",
              value: "文化遗产典范",
              lineStyle: { color: "#d4a76a", width: 3 },
            },
            {
              source: "北海公园",
              target: "世界文化遗产",
              value: "世界遗产",
              lineStyle: { color: "#f6c177", width: 3 },
            },
            {
              source: "北海公园",
              target: "北京大学",
              value: "学术研究",
              lineStyle: { color: "#9c7c5c", width: 2 },
            },
            {
              source: "北海公园",
              target: "哈佛大学",
              value: "国际课程",
              lineStyle: { color: "#9c7c5c", width: 2 },
            },
            {
              source: "圣彼得堡夏宫",
              target: "北京",
              value: "文化交流",
              lineStyle: { color: "#8b4513", width: 2 },
            },
            {
              source: "新宿御苑",
              target: "东京",
              value: "文化交流",
              lineStyle: { color: "#8b4513", width: 2 },
            },
            {
              source: "金门公园",
              target: "旧金山",
              value: "文化交流",
              lineStyle: { color: "#8b4513", width: 2 },
            },
          ],
          lineStyle: {
            color: "#8b4513",
            width: 2,
            curveness: 0.25,
          },
        },
      ],
    });
    window.addEventListener("resize", () => chart.resize());
  }
};

onMounted(() => {
  initCosmosChart();
  initArchChart();
  initInfluenceNetworkChart();
});
</script>

<style scoped>
.influence-container {
  font-family: "Noto Serif SC", serif;
 /* color: #333;*/
  line-height: 1.6;
  /*background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);*/
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
  /* 侧边栏整体背景颜色调整为深蓝灰色 */
  /* background: #2c3e50; */
  background: rgba(255, 248, 225, 0.8);
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.06); /* 恢复轻微阴影 */
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  column-count: 2;
  column-gap: 28px;
}
.section-title {
  margin-bottom: 8px;
  text-align: left;
}
.section-title h2 {
  font-size: 1.3em;
  /* 标题颜色改为清晰的白色 */
  color: #6495ed;
  margin-bottom: 8px;
}
.divider {
  width: 60px;
  height: 4px;
  /* 分割线颜色与新主题协调 */
  background: linear-gradient(to right, #6495ed, #4682b4);
  margin: 0 0 18px 0;
  border-radius: 2px;
}
.philosophy-item {
  background: #4682b4;
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 18px;
  /* 卡片文字颜色改为浅色 */
  color: #e0e6ec;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 边框颜色调整 */
  border: 1px solid rgba(100, 149, 237, 0.2);
  break-inside: avoid;
}
.philosophy-item:last-child {
  margin-bottom: 0;
}
.philosophy-item h3 {
  font-size: 1.1em;
  /* 卡片内标题颜色改为更亮的白色 */
  color: #ffffff;
  margin-bottom: 6px;
}
.philosophy-item p,
.philosophy-item ul {
  /* 正文文字颜色调整 */
  color: #d7e0e8;
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
  max-width: 1200px;
  padding: 40px;
  /* 底部总结区背景改为与按钮匹配的蓝灰色 */
  background: #6495ed;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(101, 67, 33, 0.15);
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
.impact-item {
  /* 内部卡片背景改为半透明白色，形成对比 */
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  /* 边框颜色调整 */
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.impact-item:hover {
  transform: translateY(-5px);
  background: rgba(212, 167, 106, 0.3);
  box-shadow: 0 10px 25px rgba(139, 69, 19, 0.1);
}
.impact-value {
  font-size: 2rem;
  font-weight: bold;
  /* 数字颜色改为白色 */
  color: #ffffff;
  margin-bottom: 10px;
}
.impact-label {
  font-size: 1em;
  /* 标签文字颜色改为半透明白色 */
  color: rgba(255, 255, 255, 0.9);
}
.influence-footer {
  text-align: center;
  padding: 40px 20px;
  color: #5a4a42;
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 800px;
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

.influence-container {
  font-family: "Noto Serif SC", serif;
  background: #fdfbf7;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}
.influence-header {
  text-align: center;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}
.influence-header h1 {
  font-size: 2.2rem;
  color: #8b4513;
  margin-bottom: 15px;
}
.main-columns {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 20px auto;
  align-items: stretch;
}

/* 左侧样式 */
.radar-card-enhance {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.08);
  margin-bottom: 20px;
  height: 450px; /* 给雷达图足够高度 */
  display: flex;
  flex-direction: column;
}
.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.d3-wrapper {
  flex: 1;
  position: relative;
}
.radar-controls {
  display: flex;
  gap: 10px;
}
.control-tag {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid #d4a76a;
  border-radius: 20px;
  color: #8b4513;
  cursor: pointer;
  transition: all 0.3s;
}
.control-tag.active {
  background: #8b4513;
  color: #fff;
}

/* 右侧样式：星系容器 */
.text-section-visual {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(58, 108, 79, 0.1);
  display: flex;
  flex-direction: column;
}
.section-header-visual h2 {
  color: #3a6c4f;
  font-size: 1.5rem;
  margin: 0;
}
.section-header-visual p {
  color: #7a8c7a;
  font-size: 0.9rem;
  margin: 5px 0 15px 0;
}
.galaxy-wrapper {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
}

/* 底部图表网格 */
.bottom-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto 30px;
}

.chart-card {
  background: rgba(255, 248, 225, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(139, 69, 19, 0.08);
  padding: 15px;
  height: 300px;
}
.chart-card.large-card {
  height: 380px; /* 增加高度以容纳复杂图表 */
}
.chart-box {
  width: 100%;
  height: 100%;
}
.chart-title {
  color: #8b4513;
  text-align: center;
  margin-bottom: 10px;
}

/* 全球影响部分保持不变 */
.global-impact {
  margin: 40px auto;
  max-width: 1200px;
  padding: 40px;
  background: #3a6c4f; /* 恢复为深绿色，更符合北海主题 */
  border-radius: 20px;
  text-align: center;
  color: white;
}
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.impact-item {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 10px;
}
.impact-value {
  font-size: 2rem;
  font-weight: bold;
}

.evaluation-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.08);
  margin-bottom: 20px;
  /* 高度可以比之前的 450px 稍微矮一点，显得更精致 */
  height: 380px;
  display: flex;
  flex-direction: column;
}

.radar-header {
  display: flex;
  justify-content: center; /* 标题居中 */
  align-items: center;
  margin-bottom: 15px;
}

.chart-wrapper {
  flex: 1;
  width: 100%;
  position: relative;
}
</style>
