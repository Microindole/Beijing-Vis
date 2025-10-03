<template>
  <div class="population-chart">
    <h4 class="chart-title">历代人口变迁</h4>
    <div ref="chartRef" style="width: 100%; height: 250px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  populationData: Array, // 接收处理好的人口数据
  dynasty: String
});

const chartRef = ref(null);
let myChart = null;

onMounted(() => {
  myChart = echarts.init(chartRef.value);
  updateChart();
});

// 监听数据和当前朝代的变化，并更新图表
watch([() => props.populationData, () => props.dynasty], updateChart, { deep: true });

function updateChart() {
  if (!myChart || !props.populationData || props.populationData.length === 0) return;

  const dynasties = props.populationData.map(d => d.a);
  const populations = props.populationData.map(d => d.b);
  const households = props.populationData.map(d => d.c);

  myChart.setOption({
    tooltip: { 
      trigger: 'axis',
      formatter: params => {
        const data = props.populationData[params[0].dataIndex];
        return `<b>${data.a}</b><br/>
                人口: ${data.b ? (data.b / 10000).toFixed(2) + ' 万人' : '无数据'}<br/>
                户数: ${data.c ? (data.c / 10000).toFixed(2) + ' 万户' : '无数据'}`;
      }
    },
    grid: { left: '15%', right: '5%', bottom: '10%' },
    xAxis: { type: 'category', data: dynasties },
    yAxis: {
      type: 'value',
      name: '数量 (万人/万户)',
      axisLabel: {
        formatter: value => value / 10000
      }
    },
    series: [
      {
        name: '人口',
        type: 'bar',
        data: populations,
        itemStyle: { color: '#c23531' }
      },
      {
        name: '户数',
        type: 'bar',
        data: households,
        itemStyle: { color: '#2f4554' }
      }
    ]
  });
}
</script>

<style scoped>
.chart-title {
  margin: 0 0 10px 0;
  font-size: 1em;
  color: var(--primary-text-color);
}
</style>