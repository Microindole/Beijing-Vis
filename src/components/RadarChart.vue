<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  selectedLandmarks: {
    type: Array,
    required: true
  }
})

// 地标数据
const landmarksData = {
  '故宫': {
    name: '故宫',
    data: [5, 5, 5, 4, 5]
  },
  '天坛': {
    name: '天坛',
    data: [5, 5, 4, 3, 5]
  },
  '长城': {
    name: '长城',
    data: [5, 5, 5, 5, 5]
  },
  '明十三陵': {
    name: '明十三陵',
    data: [4, 5, 3, 2, 4]
  },
  '北海公园': {
    name: '北海公园',
    data: [4, 4, 4, 4, 4]
  },
  '法源寺': {
    name: '法源寺',
    data: [3, 4, 2, 3, 5]
  },
  '颐和园': {
    name: '颐和园',
    data: [5, 5, 4, 4, 5]
  },
  '大栅栏': {
    name: '大栅栏',
    data: [3, 3, 5, 5, 3]
  }
}

// 古典黄昏配色方案
const colorPalette = [
  '#c23531', // 朱砂红
  '#d48265', // 赭石
  '#e6b422', // 金黄
  '#91c7ae', // 青绿
  '#749f83', // 墨绿
  '#ca8622', // 琥珀
  '#bda29a', // 灰褐
  '#6e7074'  // 青灰
]

const indicators = [
  { name: '官方评级', max: 5 },
  { name: '历史价值', max: 5 },
  { name: '公众热度', max: 5 },
  { name: '当代活力', max: 5 },
  { name: '文化独特性', max: 5 }
]

const chartOptions = computed(() => {
  const series = props.selectedLandmarks.map((landmark, index) => {
    return {
      name: landmark,
      type: 'radar',
      data: [landmarksData[landmark].data],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: colorPalette[index % colorPalette.length]
      },
      itemStyle: {
        color: colorPalette[index % colorPalette.length]
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colorPalette[index % colorPalette.length] + 'cc' },
            { offset: 1, color: colorPalette[index % colorPalette.length] + '33' }
          ]
        }
      }
    }
  })

  return {
    backgroundColor: '#f8f1e5', // 米黄底色
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      borderColor: '#c23531',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: props.selectedLandmarks,
      bottom: 10,
      textStyle: {
        color: '#5a5a5a',
        fontFamily: 'Microsoft YaHei'
      },
      itemWidth: 20,
      itemHeight: 12,
      itemGap: 10
    },
    radar: {
      indicator: indicators,
      shape: 'circle',
      splitNumber: 5,
      center: ['50%', '50%'],
      radius: '65%',
      axisName: {
        color: '#5a5a5a',
        fontFamily: 'Microsoft YaHei',
        fontSize: 12
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(200, 180, 150, 0.1)', 'rgba(200, 180, 150, 0.2)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(150, 120, 90, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(150, 120, 90, 0.5)'
        }
      }
    },
    series: series,
    textStyle: {
      fontFamily: 'Microsoft YaHei'
    }
  }
})
</script>

<template>
  <v-chart class="chart" :option="chartOptions" autoresize />
</template>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
  background-color: #f8f1e5;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>