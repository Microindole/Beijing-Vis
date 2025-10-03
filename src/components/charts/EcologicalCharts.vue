<template>
  <div class="ecological-charts">
    <h4 class="chart-title">生态环境演变</h4>
    <div ref="chartRef" style="width: 100%; height: 250px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  ecologyData: Object, // 接收包含 climate, vegetation, waterSystemEvents 的整个对象
  dynasty: String 
});

const chartRef = ref(null);
let myChart = null;

// 定义我们关心并希望在图表上展示的朝代顺序
const dynasties = ['唐', '辽', '金', '元', '明', '清'];

onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    updateChart();
  }
});

watch(() => props.ecologyData, updateChart, { deep: true, immediate: true });

function updateChart() {
  if (!myChart || !props.ecologyData) return;

  // 安全地获取数据，如果不存在则使用空对象
  const climateData = props.ecologyData.climate || {};
  const vegetationData = props.ecologyData.vegetation || {};
  const waterData = props.ecologyData.waterSystemEvents || {};

  // 根据朝代顺序生成图表系列数据
  const tempData = dynasties.map(d => climateData[d]?.temp ?? null); // 使用 ?? null 让ECharts知道这是空数据
  const precipData = dynasties.map(d => climateData[d]?.precip ?? null);
  const coverageData = dynasties.map(d => vegetationData[d]?.coverage ?? null);
  const waterEventCount = dynasties.map(d => waterData[d]?.length ?? 0); // 统计水系事件数量

  myChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { 
      data: ['平均气温', '降水量', '森林覆盖率', '水系事件数'],
      textStyle: { color: 'var(--primary-text-color)' }
    },
    grid: { left: '15%', right: '15%', bottom: '10%' },
    xAxis: { 
      type: 'category', 
      data: dynasties,
      axisLine: { lineStyle: { color: 'var(--secondary-text-color)' } }
    },
    yAxis: [
      {
        type: 'value',
        name: '温度(℃) / 覆盖率(%)',
        position: 'left',
        axisLine: { show: true, lineStyle: { color: '#5470c6' } },
        axisLabel: { formatter: '{value}' }
      },
      {
        type: 'value',
        name: '降水量(mm) / 事件数(件)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91cc75' } },
        axisLabel: { formatter: '{value}' }
      }
    ],
    series: [
      {
        name: '平均气温',
        type: 'line',
        yAxisIndex: 0,
        data: tempData,
        itemStyle: { color: '#c23531' }
      },
      {
        name: '森林覆盖率',
        type: 'line',
        yAxisIndex: 0,
        data: coverageData,
        itemStyle: { color: '#61a0a8' }
      },
      {
        name: '降水量',
        type: 'bar',
        yAxisIndex: 1,
        data: precipData,
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '水系事件数',
        type: 'bar',
        yAxisIndex: 1,
        data: waterEventCount,
        itemStyle: { color: '#91cc75' }
      }
    ]
  });
}
</script>

<style scoped>
.chart-title {
  margin: 0 0 10px 0;
  font-size: 1em;
  font-weight: 500;
  color: var(--primary-text-color);
}
</style>