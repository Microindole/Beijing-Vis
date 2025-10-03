<template>
  <div class="data-charts-container">
    <div id="population-line-chart" class="chart-instance"></div>
    <div id="product-pie-chart" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useDataStore } from '@/stores/useDataStore';

const dataStore = useDataStore();
let lineChart, pieChart;
let resizeObserver;

function renderCharts() {
  if (!lineChart || !pieChart) return;

  // --- 1. 人口历史记录数柱状图 ---
  // 添加 .filter(item => item.count > 0) 来筛选掉没有数据的朝代
  const populationByDynasty = dataStore.dynasties.map(dynasty => ({
      dynasty,
      count: dataStore.population.filter(p => p.时期 === dynasty).length,
  })).filter(item => item.count > 0);

  const populationOption = {
    title: { text: '各朝代人口相关记载数量', textStyle: { fontSize: 16, fontWeight: 'normal' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: populationByDynasty.map(item => item.dynasty),
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: { type: 'value', name: '记录数' },
    grid: { left: '15%', right: '5%', top: '25%', bottom: '25%' },
    series: [{
      data: populationByDynasty.map(item => item.count),
      type: 'bar',
      itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
    }]
  };
  lineChart.setOption(populationOption, true);
  
  lineChart.on('click', (params) => {
      if(params.name) {
          dataStore.setActiveDynasty(params.name);
      }
  });

  // --- 2. 当前朝代物产构成饼图 ---
  const currentProducts = dataStore.filteredProduct;
  const productCount = currentProducts.reduce((acc, cur) => {
    const type = cur.物产类型 || '未知';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(productCount).map(key => ({
    name: key,
    value: productCount[key]
  }));

  const pieOption = {
    title: { 
      text: `${dataStore.activeDynasty} 物产记载分布`, 
      textStyle: { fontSize: 16, fontWeight: 'normal' },
      top: '2%'
    },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { type: 'scroll', orient: 'vertical', left: 'left', top: 'middle', textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
      data: pieData,
    }]
  };
  pieChart.setOption(pieOption, true);
}

function highlightBar(dynasty, show) {
    lineChart.dispatchAction({
        type: show ? 'highlight' : 'downplay',
        seriesIndex: 0,
        dataIndex: dataStore.dynasties.indexOf(dynasty)
    });
}

onMounted(() => {
  const lineChartDom = document.getElementById('population-line-chart');
  const pieChartDom = document.getElementById('product-pie-chart');
  
  lineChart = echarts.init(lineChartDom);
  pieChart = echarts.init(pieChartDom);

  watch(() => dataStore.isLoading, (loading) => {
    if (!loading) {
        renderCharts();
        highlightBar(dataStore.activeDynasty, true);
    }
  });

  watch(() => dataStore.activeDynasty, (newDynasty, oldDynasty) => {
      renderCharts();
      highlightBar(oldDynasty, false);
      highlightBar(newDynasty, true);
  });
  
  resizeObserver = new ResizeObserver(() => {
    lineChart?.resize();
    pieChart?.resize();
  });
  resizeObserver.observe(lineChartDom);
  resizeObserver.observe(pieChartDom);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  lineChart?.dispose();
  pieChart?.dispose();
});
</script>

<style scoped>
.data-charts-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.chart-instance {
  flex: 1;
  min-height: 0;
}
</style>

