<template>
  <div class="legends-container">
    <GugongCharacterHub></GugongCharacterHub>
    <palaceSayings></palaceSayings>
    <Stories></Stories>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import GugongCharacterHub from "./GugongCharacterHub.vue";
import palaceSayings from "./PalaceSayings.vue";
import Stories from "./Stories.vue";

const router = useRouter();

// 返回门户主页
const goBack = () => router.push("/landmarks/summer-palace");

// 传奇事件数据
const legendsData = ref([
  {
    year: "1524",
    title: "嘉靖祭天惊雷",
    period: "明嘉靖三年",
    type: "天象异事",
    color: "#8b4513",
    description:
      "嘉靖皇帝首次祭天时，天空突降惊雷，击中斋宫檐角。钦天监解读为上天警示，建议皇帝反省施政。嘉靖遂下诏减免赋税，大赦天下，此事被记入《明实录》。",
    significance:
      "此次雷击事件被视为上天对皇帝的警示，促使嘉靖皇帝反思治国方略，对后续政治改革产生了深远影响。",
    image: "https://picsum.photos/600/400?lightning=1",
  },
  {
    year: "1540",
    title: "大旱祈雨显灵",
    period: "明嘉靖十九年",
    type: "祭祀灵验",
    color: "#1e90ff",
    description:
      "华北连年大旱，嘉靖皇帝亲赴圜丘祈雨。祭祀礼成时，乌云突聚，甘霖普降三日。皇帝命在祈年殿前立'感应碑'记述此事，此碑至今犹存。",
    significance:
      "此次祈雨成功极大提升了皇家祭祀的权威性，巩固了天坛作为天人沟通圣地的地位，成为明清两代重要的政治象征。",
    image: "https://picsum.photos/600/400?rain=1",
  },
  {
    year: "1644",
    title: "崇祯最后一祭",
    period: "明崇祯十七年",
    type: "历史转折",
    color: "#b22222",
    description:
      "李自成兵临北京城下，崇祯皇帝仍按例赴天坛祭天。据《明史》记载，祭祀途中狂风大作，燎炉倾倒，被视为亡国凶兆。十日后，崇祯自缢煤山。",
    significance:
      "这次祭祀成为明朝最后一次皇家祭天仪式，象征着大明王朝的终结，具有重要的历史节点意义。",
    image: "https://picsum.photos/600/400?last=1",
  },
  {
    year: "1743",
    title: "乾隆祈谷奇观",
    period: "清乾隆八年",
    type: "祭祀灵验",
    color: "#1e90ff",
    description:
      "乾隆皇帝祈谷礼毕，数万燕子盘旋于祈年殿上空，形成'百鸟朝凤'奇观。乾隆视为祥瑞，命画院绘《天坛瑞应图》，并作《瑞应颂》诗文刻石纪念。",
    significance:
      "这一自然奇观被解读为上天对乾隆盛世的嘉许，极大提升了乾隆皇权的神圣性，成为康乾盛世的重要象征事件。",
    image: "https://picsum.photos/600/400?birds=1",
  },
  {
    year: "1889",
    title: "祈年殿雷火劫",
    period: "清光绪十五年",
    type: "天象异事",
    color: "#8b4513",
    description:
      "农历八月二十四日，祈年殿遭雷击起火，三昼夜方熄。京城轰动，传言'天罚昏君'。光绪帝顶住压力，耗银百万两重建，历时七年方成。",
    significance:
      "此次雷击事件引发朝野震动，光绪帝力排众议重建祈年殿，展现了皇权对天坛象征意义的重视，也为后世留下了珍贵的建筑遗产。",
    image: "https://picsum.photos/600/400?fire=1",
  },
  {
    year: "1899",
    title: "光绪祈雨传奇",
    period: "清光绪二十五年",
    type: "祭祀灵验",
    color: "#1e90ff",
    description:
      "北方大旱，光绪皇帝素服步行至圜丘祈雨。祭祀当日酷热难当，但礼成时忽起东风，三日内普降甘霖。京城百姓跪迎'圣雨'，此事件被多国使节记录在回忆录中。",
    significance:
      "在清朝国势衰微之际，此次祈雨成功短暂提振了皇权威望，成为晚清重要的政治宣传事件，展示了传统祭祀文化的持久影响力。",
    image: "https://picsum.photos/600/400?pray=1",
  },
]);

// 当前活动索引
const activeIndex = ref(0);
const setActiveIndex = (index) => {
  activeIndex.value = index;
};

// 当前活动数据
const activeData = computed(() => legendsData.value[activeIndex.value]);

// ECharts图表相关
const typeChart = ref(null);
const timelineChart = ref(null);
let typeChartInstance = null;
let timelineChartInstance = null;

// 事件类型分布数据
const typeData = computed(() => {
  const types = {};
  legendsData.value.forEach((item) => {
    types[item.type] = (types[item.type] || 0) + 1;
  });

  return Object.keys(types).map((type) => {
    return {
      name: type,
      value: types[type],
      itemStyle: {
        color: legendsData.value.find((d) => d.type === type).color,
      },
    };
  });
});

// 时间分布数据
const timelineData = computed(() => {
  return legendsData.value.map((item) => {
    return {
      name: item.title,
      value: [item.year, 1], // 在时间轴上位置
      itemStyle: { color: item.color },
      year: item.year,
      description: item.description.substring(0, 60) + "...",
    };
  });
});

// 初始化事件类型图表
const initTypeChart = () => {
  if (typeChart.value) {
    typeChartInstance = echarts.init(typeChart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}次 ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        textStyle: {
          color: "#5a4a42",
        },
      },
      series: [
        {
          name: "事件类型",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#f5f2e9",
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: "{b}: {c}次",
            fontSize: 14,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: typeData.value,
        },
      ],
    };

    typeChartInstance.setOption(option);

    // 窗口大小改变时重绘图表
    window.addEventListener("resize", () => {
      typeChartInstance.resize();
    });
  }
};

// 初始化时间线图表
const initTimelineChart = () => {
  if (timelineChart.value) {
    timelineChartInstance = echarts.init(timelineChart.value);

    const years = [];
    for (let year = 1420; year <= 1918; year += 10) {
      years.push(year);
    }

    const option = {
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `<strong>${params.data.name}</strong><br/>
                  <span style="color:${params.color}">●</span> ${params.data.year}年<br/>
                  ${params.data.description}`;
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
        data: years,
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          color: "#5a4a42",
        },
        name: "年份",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          name: "传奇事件",
          type: "scatter",
          symbolSize: function (data) {
            return 20 + data[1] * 10;
          },
          data: timelineData.value,
          markLine: {
            symbol: "none",
            label: {
              formatter: "天坛传奇事件时间分布",
              position: "start",
            },
            lineStyle: {
              color: "#d4a76a",
              type: "solid",
            },
            data: [{ yAxis: 0.5 }],
          },
        },
      ],
    };

    timelineChartInstance.setOption(option);

    // 窗口大小改变时重绘图表
    window.addEventListener("resize", () => {
      timelineChartInstance.resize();
    });
  }
};

// 监听活动索引变化
watch(activeIndex, () => {
  if (timelineChartInstance) {
    // 高亮时间线图表对应点
    timelineChartInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });

    timelineChartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: activeIndex.value,
    });

    timelineChartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: activeIndex.value,
    });
  }
});

onMounted(() => {
  initTypeChart();
  initTimelineChart();
});
</script>

<style scoped>
/* 基础样式 */
:root {
  --primary-color: #8b4513;
  --secondary-color: #d4a76a;
  --accent-color: #a0522d;
  --text-dark: #333333;
  --text-medium: #5a4a42;
  --text-light: #7a6b64;
  --bg-light: #f9f5ed;
  --bg-lighter: #fff8e1;
  --bg-dark: #3e2723;
  --border-radius: 12px;
  --box-shadow: 0 8px 30px rgba(101, 67, 33, 0.12);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@font-face {
  font-family: "Noto Serif SC";
  src: url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap");
}

.legends-container {
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  padding: 2rem;
  position: relative;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f2e9;
}

.dashboard-container {
  font-family: "Noto Serif SC", serif;
  color: var(--text-dark);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0e6d1 0%, #e2d4b7 100%);
  padding: 0;
  overflow-x: hidden;
}

/* 导航区样式 */
.dashboard-nav {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
}

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

.nav-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: var(--transition);
  backdrop-filter: blur(5px);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-5px);
}

.icon-back {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.nav-title {
  text-align: center;
  flex-grow: 1;
  padding: 0 2rem;
}

.nav-title h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

.time-indicator {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.current-year {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.era {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 主仪表盘布局 */
.dashboard-main {
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 1.5rem;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-sidepanel {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-sidepanel.right {
  flex: 0 0 350px;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
}

/* 小部件通用样式 */
.widget-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 1.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--secondary-color);
  display: flex;
  align-items: center;
}

.widget-title::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: var(--secondary-color);
  margin-right: 10px;
  border-radius: 4px;
}

/* 时间轴小部件 */
.timeline-widget {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  height: fit-content;
}

.timeline-container {
  position: relative;
  padding: 1rem 0;
}

.timeline-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    var(--secondary-color),
    var(--primary-color)
  );
  z-index: 1;
}

.timeline-event {
  position: relative;
  padding: 1rem 1rem 1rem 3.5rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: var(--transition);
  background: white;
  border: 1px solid rgba(139, 69, 19, 0.1);
  z-index: 2;
}

.timeline-event:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(139, 69, 19, 0.1);
}

.timeline-event.active {
  background: var(--bg-lighter);
  box-shadow: 0 5px 20px rgba(139, 69, 19, 0.15);
  border-left: 3px solid var(--primary-color);
}

.event-marker {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.event-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.event-info {
  display: flex;
  flex-direction: column;
}

.event-year {
  font-size: 1rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.event-title {
  font-size: 0.95rem;
  color: var(--text-medium);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.event-type-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  color: white;
  align-self: flex-start;
}

/* 统计小部件 */
.stats-widget {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background: var(--bg-lighter);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: var(--transition);
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-light);
}

/* 主卡片样式 */
.main-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(139, 69, 19, 0.1);
}

.card-header h2 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.card-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.9rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
}

.meta-item::before {
  content: "•";
  margin-right: 0.5rem;
  color: var(--secondary-color);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.media-panel {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.8s ease;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
}

.media-caption {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  font-size: 0.85rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
}

.icon-image {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.content-panel {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.icon-importance {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-left: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238B4513'%3E%3Cpath d='M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.description-section p,
.significance-section p {
  color: var(--text-medium);
  line-height: 1.8;
}

.significance-section {
  background: rgba(212, 167, 106, 0.1);
  border-left: 4px solid var(--secondary-color);
  padding: 1rem;
  border-radius: 0 8px 8px 0;
}

/* 图表小部件 */
.type-chart-widget,
.timeline-chart-widget {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.chart-container {
  height: 200px;
  width: 100%;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-medium);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 6px;
}

.legend-value {
  margin-left: 4px;
  font-weight: bold;
  color: var(--primary-color);
}

/* 底部信息栏 */
.dashboard-footer {
  background: var(--primary-color);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  margin-top: auto;
}

.footer-note {
  max-width: 800px;
  margin: 0 auto 1rem;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-info {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.footer-credits {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .dashboard-main {
    flex-direction: column;
  }

  .dashboard-sidepanel,
  .dashboard-sidepanel.right {
    flex: 1;
    width: 100%;
  }

  .dashboard-content {
    order: -1;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .nav-title {
    padding: 1rem 0;
    text-align: left;
  }

  .time-indicator {
    margin-top: 1rem;
    align-self: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .media-panel {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .nav-title h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }
}
</style>
