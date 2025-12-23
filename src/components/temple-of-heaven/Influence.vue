<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <button class="back-button" @click="router.back()">
        <span class="icon">←</span> 返回
      </button>
      <div class="header-content">
        <h1 class="dashboard-title">天坛：对话苍穹的回响</h1>
        <div class="subtitle-decoration">
          <span class="ornament">☁️</span>
          <span class="line"></span>
          <span class="symbol">☯</span>
          <span class="line"></span>
          <span class="ornament">☁️</span>
        </div>
        <p class="dashboard-subtitle">
          从"天人合一"的哲学构建到世界声学建筑奇迹
        </p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-icon">🏛️</div>
          <div class="metric-text">
            <div class="metric-value">1998</div>
            <div class="metric-label">世界遗产登录年份</div>
          </div>
        </div>
        <div class="metric-card highlight-card">
          <div class="metric-icon">📐</div>
          <div class="metric-text">
            <div class="metric-value">273<span class="unit">ha</span></div>
            <div class="metric-label">故宫面积的4倍</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🔊</div>
          <div class="metric-text">
            <div class="metric-value">3<span class="unit">大</span></div>
            <div class="metric-label">声学建筑奇迹</div>
          </div>
        </div>
      </div>

      <div class="charts-layout">

        <div class="layout-left">
          <div class="chart-card large-card">
            <div class="card-header">
              <h3><span class="mark"></span>祈年殿·天道星网</h3>
              <p>建筑立柱布局与宇宙时空的同构映射</p>
            </div>
            <div class="card-body">
              <div ref="structureChart" class="echart-box"></div>
            </div>
          </div>

          <div class="chart-card">
            <div class="card-header">
              <h3><span class="mark"></span>文化影响涟漪</h3>
              <p>近五十年天坛在全球媒体的关注度趋势</p>
            </div>
            <div class="card-body">
              <div ref="waveChart" class="echart-box"></div>
            </div>
          </div>
        </div>

        <div class="layout-right">
          <div class="chart-card full-width-card">
            <div class="card-header">
              <h3><span class="mark"></span>声学现象解码</h3>
              <p>回音壁与三音石的声波传递特性</p>
            </div>
            <div class="card-body">
              <div ref="acousticChart" class="echart-box"></div>
            </div>
          </div>

          <div class="bottom-row">
            <div class="chart-card half-card">
              <div class="card-header">
                <h3><span class="mark"></span>神柱寓意</h3>
              </div>
              <div class="card-body">
                <div ref="pillarsChart" class="echart-box"></div>
              </div>
            </div>

            <div class="chart-card half-card">
              <div class="card-header">
                <h3><span class="mark"></span>价值维度</h3>
              </div>
              <div class="card-body">
                <div ref="radarChart" class="echart-box"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-footer">
      <p>UNESCO World Heritage Site · Temple of Heaven</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

const router = useRouter();

const structureChart = ref(null);
const acousticChart = ref(null);
const pillarsChart = ref(null);
const waveChart = ref(null);
const radarChart = ref(null);

let charts = [];

const colors = {
  primary: '#e67e22',
  secondary: '#d35400',
  gold: '#d4a76a',
  lightGold: '#fce6c9',
  textMain: '#5d4b4b',
  textSub: '#8b7e7e'
};

const initStructureChart = () => {
  if (!structureChart.value) return;
  const chart = echarts.init(structureChart.value);
  charts.push(chart);

  const nodes = [];
  const edges = [];

  nodes.push({
    name: '太极', x: 0, y: 0,
    symbolSize: 35,
    itemStyle: {
      color: colors.primary,
      shadowBlur: 15,
      shadowColor: colors.primary
    },
    label: { show: true, position: 'inside', color: '#fff', fontWeight: 'bold' }
  });

  const r1 = 30;
  ['春', '夏', '秋', '冬'].forEach((name, i) => {
    const angle = (i * 90) * (Math.PI / 180);
    nodes.push({
      name: name,
      x: r1 * Math.cos(angle),
      y: r1 * Math.sin(angle),
      symbolSize: 20,
      itemStyle: { color: colors.gold },
      label: { color: colors.textMain, position: 'right' }
    });
    edges.push({ source: '太极', target: name });
  });

  const r2 = 60;
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  months.forEach((name, i) => {
    const angle = (i * 30 + 15) * (Math.PI / 180);
    nodes.push({
      name: name,
      x: r2 * Math.cos(angle),
      y: r2 * Math.sin(angle),
      symbolSize: 12,
      itemStyle: { color: colors.lightGold, borderColor: colors.primary, borderWidth: 1 },
      label: { show: false }
    });
    const seasonIndex = Math.floor(i / 3);
    edges.push({ source: ['春', '夏', '秋', '冬'][seasonIndex], target: name });
  });

  const r3 = 90;
  const hours = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  hours.forEach((name, i) => {
    const angle = (i * 30 + 15) * (Math.PI / 180);
    nodes.push({
      name: name,
      x: r3 * Math.cos(angle),
      y: r3 * Math.sin(angle),
      symbolSize: 10,
      itemStyle: { color: '#fff', borderColor: colors.secondary, borderWidth: 2 },
      label: { show: true, position: 'top', fontSize: 10, color: colors.textSub }
    });
    edges.push({ source: months[i], target: name });
  });

  const option = {
    tooltip: { trigger: 'item' },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        data: nodes,
        links: edges,
        roam: true,
        label: { show: true, position: 'right', formatter: '{b}' },
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0,0,1,0,[
            {offset:0, color: colors.gold}, {offset:1, color: colors.primary}
          ]),
          curveness: 0.1,
          opacity: 0.5,
          width: 1.5
        },
        emphasis: {
          scale: true,
          focus: 'adjacency',
          lineStyle: { width: 3, opacity: 1 }
        }
      }
    ]
  };
  chart.setOption(option);
};

const initAcousticChart = () => {
  if (!acousticChart.value) return;
  const chart = echarts.init(acousticChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: 'axis' },
    polar: { radius: [15, '75%'] },
    angleAxis: {
      type: 'category',
      data: ['回音壁', '三音石', '对话石', '圜丘坛', '皇穹宇'],
      startAngle: 75,
      axisLabel: { color: colors.textMain, fontWeight: 'bold', fontSize: 12 }
    },
    radiusAxis: { show: false },
    series: [
      {
        type: 'bar',
        data: [95, 85, 70, 90, 80],
        coordinateSystem: 'polar',
        name: '声波清晰度',
        itemStyle: {
          // 橙色 -> 金色渐变
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.secondary },
            { offset: 1, color: colors.gold }
          ])
        },
      }
    ]
  };
  chart.setOption(option);
};


const initPillarsChart = () => {
  if (!pillarsChart.value) return;
  const chart = echarts.init(pillarsChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
    grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: { show: false },
    yAxis: {
      type: 'category',
      data: ['龙井柱', '金柱', '檐柱'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: colors.secondary, fontSize: 13, fontWeight: 'bold' }
    },
    series: [
      {
        name: '数量',
        type: 'pictorialBar',
        symbol: 'path://M10,0 L20,0 L20,100 L10,100 Z',
        symbolRepeat: true,
        symbolSize: [15, 25],
        symbolMargin: 6,
        itemStyle: { color: colors.gold },
        data: [4, 12, 12],
        z: 10
      },
      {
        name: '背景',
        type: 'bar',
        barGap: '-100%',
        barWidth: 25,
        data: [4, 12, 12],
        itemStyle: { color: 'rgba(212, 167, 106, 0.15)', borderRadius: 10 },
        tooltip: { show: false }
      }
    ]
  };
  chart.setOption(option);
};

const initWaveChart = () => {
  if (!waveChart.value) return;
  const chart = echarts.init(waveChart.value);
  charts.push(chart);

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1980', '1990', '2000', '2010', '2020'],
      axisLine: { lineStyle: { color: colors.gold } },
      axisLabel: { color: colors.textSub }
    },
    yAxis: { type: 'value', splitLine: { show: false } },
    series: [{
      name: '关注度',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors.primary },
          { offset: 1, color: colors.lightGold }
        ])
      },
      lineStyle: { width: 0 },
      data: [100, 250, 480, 890, 1200]
    }]
  };
  chart.setOption(option);
};

const initRadarChart = () => {
  if (!radarChart.value) return;
  const chart = echarts.init(radarChart.value);
  charts.push(chart);

  const option = {
    radar: {
      indicator: [
        { name: '历史', max: 100 },
        { name: '科学', max: 100 },
        { name: '艺术', max: 100 },
        { name: '社会', max: 100 },
        { name: '保护', max: 100 }
      ],
      radius: '65%',
      splitArea: { areaStyle: { color: [colors.lightGold, '#fff'] } },
      axisName: { color: colors.textMain, fontSize: 11 }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [98, 95, 99, 92, 96],
        name: '天坛评估',
        areaStyle: { color: 'rgba(230, 126, 34, 0.4)' },
        itemStyle: { color: colors.primary }
      }]
    }]
  };
  chart.setOption(option);
};

onMounted(() => {
  initStructureChart();
  initAcousticChart();
  initPillarsChart();
  initWaveChart();
  initRadarChart();
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  charts.forEach(chart => chart && chart.resize());
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  charts.forEach(chart => chart && chart.dispose());
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #fdfbf5;
  background-image:
      linear-gradient(rgba(212, 167, 106, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212, 167, 106, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  color: #4a3b3b;
  font-family: "Noto Serif SC", serif;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  position: relative;
  padding: 2rem;
  text-align: center;
  background: #fff;
  border-bottom: 3px solid #d4a76a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.back-button {
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #d4a76a;
  color: #8b5a2b;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.back-button:hover {
  background: #d4a76a;
  color: #fff;
}

.dashboard-title {
  font-size: 2.5rem;
  color: #d35400;
  margin: 0;
  font-weight: bold;
  letter-spacing: 2px;
}

.subtitle-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
  color: #d4a76a;
}
.subtitle-decoration .line {
  width: 40px;
  height: 2px;
  background: #d4a76a;
}
.ornament { font-size: 1.2rem; }

.dashboard-subtitle {
  color: #8b7e7e;
  font-size: 1.1rem;
  margin: 0;
}


.dashboard-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 1. 顶部指标行 */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.metric-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s;
}
.metric-card:hover {
  transform: translateY(-5px);
}
.highlight-card {
  border-bottom: 4px solid #e67e22;
}

.metric-icon {
  width: 50px;
  height: 50px;
  background: rgba(230, 126, 34, 0.1);
  color: #d35400;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #4a3b3b;
  line-height: 1;
}
.unit { font-size: 1rem; color: #888; margin-left: 5px; }
.metric-label { color: #8b7e7e; font-size: 0.9rem; margin-top: 5px; }


.charts-layout {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}

.layout-left {
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.layout-right {
  flex: 6;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bottom-row {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.04);
  padding: 1.5rem;
  border: 1px solid rgba(212, 167, 106, 0.2);
  display: flex;
  flex-direction: column;
}

.large-card { min-height: 380px; flex: 1.5; }
.full-width-card { height: 300px; flex-shrink: 0; }
.half-card { flex: 1; min-height: 280px; }

.card-header h3 {
  margin: 0;
  color: #4a3b3b;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.mark {
  width: 4px;
  height: 18px;
  background: #e67e22;
  border-radius: 2px;
}
.card-header p {
  margin: 5px 0 0 14px;
  color: #999;
  font-size: 0.85rem;
}

.card-body {
  flex: 1;
  position: relative;
  margin-top: 1rem;
}
.echart-box {
  width: 100%;
  height: 100%;
  min-height: 200px;
}


.dashboard-footer {
  text-align: center;
  padding: 2rem;
  color: #ccc;
  font-size: 0.85rem;
  margin-top: auto;
}

@media (max-width: 1024px) {
  .charts-layout { flex-direction: column; }
  .bottom-row { flex-direction: column; }
  .metrics-row { grid-template-columns: 1fr; }
  .full-width-card { height: 350px; }
}
</style>