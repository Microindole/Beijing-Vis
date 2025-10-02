<template>
  <div id="map-chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  events: Array,
  highlightedEventName: String
});

let myChart;
const eventColors = {
  disaster: '#5470c6',
  war: '#ee6666',
  event: '#91cc75'
};

onMounted(async () => {
  const chartDom = document.getElementById('map-chart');
  const beijingJson = await fetch('/json/beijing.json').then(res => res.json());
  echarts.registerMap('beijing', beijingJson);
  myChart = echarts.init(chartDom);
  myChart.setOption({
    title: { text: '北京历史重大事件空间分布', left: 'center', top: 10 },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (!params.data || !params.data.value) return '';
        const name = params.name;
        const type = params.data.value[2];
        const dynasty = params.data.value[3];
        const nameMap = { 'disaster': '灾害', 'war': '战争', 'event': '事件' };
        return `<b>${name}</b><br/>类型: ${nameMap[type] || '未知'}<br/>时期: ${dynasty || '未知'}`;
      }
    },
    geo: {
      map: 'beijing', roam: true, emphasis: { focus: 'self', itemStyle: { areaColor: '#a5dff0' } }
    },
    series: []
  });
  window.addEventListener('resize', () => myChart?.resize());
});

watch([() => props.events, () => props.highlightedEventName], ([newEventData, newHighlightedName]) => {
  if (!myChart || !newEventData) return;

  const buildSeriesData = (type) => {
    return newEventData
      .filter(e => e.type === type && e['经度'] && e['纬度'])
      .map(e => ({
        name: e['名称'],
        value: [e['经度'], e['纬度'], e.type, e['时期']]
      }));
  };

  myChart.setOption({
    series: [
      { name: '灾害', type: 'scatter', coordinateSystem: 'geo', data: buildSeriesData('disaster'), itemStyle: { color: eventColors.disaster }, symbolSize: 10 },
      { name: '战争', type: 'scatter', coordinateSystem: 'geo', data: buildSeriesData('war'), itemStyle: { color: eventColors.war }, symbolSize: 10 },
      { name: '事件', type: 'scatter', coordinateSystem: 'geo', data: buildSeriesData('event'), itemStyle: { color: eventColors.event }, symbolSize: 10 }
    ]
  });

  myChart.dispatchAction({ type: 'downplay' });

  if (newHighlightedName) {
    myChart.dispatchAction({ type: 'highlight', seriesIndex: [0, 1, 2], name: newHighlightedName });
    myChart.dispatchAction({ type: 'showTip', seriesIndex: [0, 1, 2], name: newHighlightedName });
  }
}, { deep: true });
</script>