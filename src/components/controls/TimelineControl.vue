<template>
  <div id="timeline-chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  currentDynasty: String
});

const emit = defineEmits(['timeline-change']);
let myChart;
const dynasties = ['元', '明', '清'];

onMounted(() => {
  const chartDom = document.getElementById('timeline-chart');
  myChart = echarts.init(chartDom);

  const option = {
    baseOption: {
      timeline: { axisType: 'category', data: dynasties, autoPlay: false },
      grid: { top: '90%' }, xAxis: {}, yAxis: {},
    },
    options: [ {series: []}, {series: []}, {series: []} ]
  };
  myChart.setOption(option);

  myChart.on('timelinechanged', (params) => {
    emit('timeline-change', dynasties[params.currentIndex]);
  });
});

// 监听父组件传来的指令
watch(() => props.currentDynasty, (newDynasty) => {
  if (!myChart || !newDynasty) return;

  const newIndex = dynasties.indexOf(newDynasty);
  // 关键改动：获取当前时间轴的索引，避免不必要/重复的更新
  const currentIndex = myChart.getOption().timeline[0].currentIndex;

  if (newIndex !== -1 && newIndex !== currentIndex) {
    myChart.dispatchAction({
      type: 'timelineChange',
      currentIndex: newIndex
    });
  }
});
</script>