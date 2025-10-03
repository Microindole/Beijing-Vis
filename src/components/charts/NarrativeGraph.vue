<template>
  <div class="narrative-graph">
    <h3 class="chart-title">叙事图谱：{{ title }}</h3>
    <div id="graph-chart" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  dynasty: String,
  wars: Array,
  people: Array
});

const emit = defineEmits(['node-click']);

const title = ref('请选择一个时期');
let myChart; // ECharts 实例

/**
 * 核心逻辑：生成并更新图谱
 * @param {string} currentDynasty - 当前的朝代
 */
function generateGraph(currentDynasty) {
  // 增加保护，确保所有必要条件都满足
  if (!myChart || !currentDynasty || !props.wars.length || !props.people.length) {
    return;
  }

  const dynastyWars = props.wars.filter(w => w['时期'] === currentDynasty);
  const dynastyPeople = props.people.filter(p => p['时期'] === currentDynasty);

  if (dynastyWars.length === 0) {
    title.value = `${currentDynasty}时期无相关战争记录`;
    myChart.setOption({ series: [{ data: [], links: [] }] }, true); // true表示合并选项
    return;
  }

  const centralWar = dynastyWars[0];
  title.value = `${currentDynasty}时期: ${centralWar['名称']}`;

  const nodes = [];
  const links = [];

  const warNode = {
    id: `war-${centralWar['编号']}`,
    name: centralWar['名称'],
    category: '战争',
    symbolSize: 60,
    dynasty: currentDynasty
  };
  nodes.push(warNode);

  dynastyPeople.forEach(person => {
    if (centralWar['简介'] && centralWar['简介'].includes(person['名称'])) {
      const personNode = {
        id: `person-${person['编号']}`,
        name: person['名称'],
        category: '人物',
        symbolSize: 40,
        dynasty: currentDynasty
      };
      nodes.push(personNode);
      links.push({ source: warNode.id, target: personNode.id });
    }
  });

  myChart.setOption({
    series: [{
      data: nodes,
      links: links,
      categories: [{ name: '战争' }, { name: '人物' }]
    }]
  }, true);
}


onMounted(() => {
  const chartDom = document.getElementById('graph-chart');
  myChart = echarts.init(chartDom);
  myChart.setOption({
    tooltip: { formatter: '{b}' },
    legend: [{ data: ['战争', '人物'] }],
    series: [{
      type: 'graph', layout: 'force', roam: true, label: { show: true, position: 'right' },
      force: { repulsion: 300, edgeLength: 100 }
    }]
  });

  myChart.on('click', (params) => {
    if (params.dataType === 'node') {
      emit('node-click', params.data);
    }
  });

  // 在 myChart 初始化后，手动调用一次 generateGraph 来绘制初始图表
  generateGraph(props.dynasty);

  const resizeObserver = new ResizeObserver(() => myChart?.resize());
  resizeObserver.observe(chartDom);
});

// 监听朝代变化，调用核心函数更新图谱
watch(() => props.dynasty, (newDynasty) => {
  // 这里的调用将会在 myChart 初始化之后安全地执行
  generateGraph(newDynasty);
});
</script>

<style scoped>
/* ... 你的样式保持不变 ... */
.narrative-graph {
  width: 100%; height: 100%; display: flex; flex-direction: column;
}
.chart-title {
  text-align: center; font-size: 16px; margin: 10px 0; flex-shrink: 0;
}
.chart-instance {
  flex-grow: 1; width: 100%;
}
</style>