<template>
  <div class="correlation-charts">
    <div class="chart-container">
      <h3 class="chart-title">{{ dynasty }}时期 冲击事件类型分布</h3>
      <div id="pie-chart" class="chart-instance"></div>
    </div>
    <div class="chart-container">
      <h3 class="chart-title">北京历史人口变迁</h3>
      <div id="line-chart" class="chart-instance"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  events: Array,
  dynasty: String,
  population: Array,
});

let pieChart, lineChart;

onMounted(() => {
  const pieChartDom = document.getElementById('pie-chart');
  const lineChartDom = document.getElementById('line-chart');

  // 增加一个保护，防止DOM不存在时初始化失败
  if (!pieChartDom || !lineChartDom) return;

  pieChart = echarts.init(pieChartDom);
  lineChart = echarts.init(lineChartDom);
  
  initializeCharts();
  
  // 首次加载时，如果有人口数据，则绘制折线图
  if (props.population && props.population.length > 0) {
    updateLineChart();
  }

  // 监听窗口大小变化或父容器大小变化，自适应图表
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(() => { // 使用setTimeout防止过于频繁的resize
      pieChart?.resize();
      lineChart?.resize();
    }, 100);
  });
  // 监听整个组件根元素的大小变化
  resizeObserver.observe(pieChartDom.parentElement.parentElement);
});

function initializeCharts() {
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { 
      orient: 'vertical', 
      left: 'left',
      top: 'center',
      textStyle: {
        fontSize: 10 // 调整图例字体大小以适应小空间
      }
    },
    series: []
  });

  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value', name: '人口（户）', nameTextStyle: { align: 'right' } },
    series: [{ type: 'line', data: [], smooth: true, showSymbol: false }],
    grid: { top: '20%', bottom: '15%', left: '20%', right: '5%' } // 调整图表边距
  });
}

// 监听 events 变化，更新饼图
watch(() => props.events, (newEventData) => {
  if (!pieChart || !newEventData) return;
  const typeCounts = newEventData.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(typeCounts).map(key => {
    const nameMap = { 'disaster': '灾害', 'war': '战争', 'event': '事件' };
    return { value: typeCounts[key], name: nameMap[key] || key };
  });
  pieChart.setOption({
    series: [{
      type: 'pie',
      radius: ['40%', '70%'], // 改成环形图，更美观
      center: ['65%', '50%'], // 调整中心位置以适应图例
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: pieData
    }]
  });
});

// 监听 dynasty 变化，更新折线图的高亮区域
watch(() => props.dynasty, () => {
  if (lineChart) {
    updateLineChart();
  }
}, { immediate: true }); // immediate确保首次加载也执行，避免折线图为空

function updateLineChart() {
  if (!props.population || props.population.length === 0) return;
  const years = props.population.map(p => p['年份']);
  const popCounts = props.population.map(p => p['户数']);
  const dynastyRanges = {
      '元': [1271, 1368],
      '明': [1368, 1644],
      '清': [1644, 1912]
  };
  // 确保当前朝代存在于ranges中
  const currentRange = dynastyRanges[props.dynasty];
  if (!currentRange) return;

  lineChart.setOption({
      xAxis: { data: years },
      series: [{
          data: popCounts,
          markArea: {
              itemStyle: { color: 'rgba(255, 173, 177, 0.4)' },
              data: [[
                  { xAxis: currentRange[0].toString() }, 
                  { xAxis: currentRange[1].toString() }
              ]]
          }
      }]
  });
}
</script>

<style scoped>
.correlation-charts {
  width: 100%;
  height: 100%; /* 占满父容器分配的高度 */
  display: flex;
  flex-direction: column;
}
.chart-container {
  flex: 1; /* 两个图表容器均分高度 */
  min-height: 0; /* flex布局关键属性，防止溢出 */
  display: flex;
  flex-direction: column;
}
.chart-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
  flex-shrink: 0; /* 防止标题被压缩 */
  color: #333;
}
.chart-instance {
  flex-grow: 1; /* 图表实例占满剩余空间 */
  width: 100%;
  height: 100%;
}
</style>