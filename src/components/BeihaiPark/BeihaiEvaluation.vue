<template>
  <div class="evaluation-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);
let myChart = null;

const initChart = () => {
  if (!chartRef.value) return;

  myChart = echarts.init(chartRef.value);

  // 数据：北海 vs 均值
  const dimensions = [
    "历史原真性", // 1000年历史，几乎满分
    "造园艺术",   // 一池三山典范
    "文化完整性", // 儒释道融合
    "生态景观",   // 水面开阔，古树多
    "公众服务",   // 老公园，设施相对陈旧
    "智慧化水平"  // 受文保限制，改造难
  ];
  // 北海公园数据：典型的“偏科学霸”
  // 历史和艺术极高，但在现代化服务上略有失分，这才是真实的老公园
  const beihaiData = [4.95, 4.9, 4.8, 4.5, 3.8, 3.5];

  // 现代综合公园均值 (如朝阳公园、奥森)
  // 它们历史分低，但服务和智慧化设施非常好
  const averageData = [3.2, 3.5, 3.0, 4.2, 4.5, 4.2];

  // 更新图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['北海公园', '皇家园林均值'],
      bottom: 0,
      textStyle: { color: '#8b4513' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 5.5, // 满分稍微留白
      splitLine: {
        lineStyle: { type: 'dashed', color: 'rgba(139, 69, 19, 0.1)' }
      },
      axisLabel: { color: '#5a4a42' }
    },
    yAxis: {
      type: 'category',
      data: dimensions,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8b4513',
        fontWeight: 'bold',
        fontSize: 14
      }
    },
    series: [
      {
        name: '皇家园林均值',
        type: 'bar',
        data: averageData,
        barGap: '-100%', // 让两根柱子重叠
        barWidth: 16,
        itemStyle: {
          color: 'rgba(180, 180, 180, 0.2)', // 灰色背景作为基准
          borderRadius: 8
        },
        label: { show: false }
      },
      {
        name: '北海公园',
        type: 'bar',
        data: beihaiData,
        barWidth: 16,
        z: 10, // 保证在上面
        itemStyle: {
          borderRadius: 8,
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#d4a76a' }, // 金色
            { offset: 1, color: '#8b4513' }  // 深棕
          ])
        },
        label: {
          show: true,
          position: 'right',
          color: '#8b4513',
          fontWeight: 'bold',
          formatter: '{c}分'
        }
      }
    ]
  };

  myChart.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => myChart && myChart.resize());
});

onUnmounted(() => {
  window.removeEventListener("resize", () => myChart && myChart.resize());
  if (myChart) myChart.dispose();
});
</script>

<style scoped>
.evaluation-container {
  width: 100%;
  height: 100%;
  min-height: 280px;
  /* 移除内部背景，使用父容器背景 */
}
</style>