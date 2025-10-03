<template>

  <div class="map-wrapper">

    <!-- 移除顶部的提示信息 -->

    <div id="evolution-map-chart" style="width: 100%; height: 100%;"></div>

  </div>

</template>



<script setup>

import { onMounted, watch, onUnmounted } from 'vue';

import * as echarts from 'echarts';

import { useDataStore } from '@/stores/useDataStore';



const dataStore = useDataStore();

let myChart;

let resizeObserver;

// 移除 getDemoData 函数，因为我们现在使用真实数据

// // 创建示例性的占位数据

// // 原因：您的JSON数据是文本描述，没有经纬度，无法直接在地图上绘制。

// const getDemoData = (dynasty) => {

// // 简单地根据朝代名称的哈希值来生成一些伪随机数据

// let hash = 0;

// for (let i = 0; i < dynasty.length; i++) {

// hash = dynasty.charCodeAt(i) + ((hash << 5) - hash);

// }

// const rand = (seed) => {

// const x = Math.sin(seed++) * 10000;

// return x - Math.floor(x);

// };



// const products = [

// { name: '粮食', value: [116.4 + rand(hash) * 0.3 - 0.15, 39.9 + rand(hash+1) * 0.2 - 0.1, 100] },

// { name: '铁器', value: [116.3 + rand(hash+2) * 0.2 - 0.1, 40.0 + rand(hash+3) * 0.2 - 0.1, 80] },

// { name: '盐', value: [116.5 + rand(hash+4) * 0.2 - 0.1, 39.8 + rand(hash+5) * 0.2 - 0.1, 120] },

// ];



// const lines = [

// { coords: [[116.2, 39.8], [116.4 + rand(hash+6) * 0.1, 40.1 + rand(hash+7) * 0.1]] },

// { coords: [[116.6, 39.9], [116.3 + rand(hash+8) * 0.1, 39.8 + rand(hash+9) * 0.1]] },

// ];



// return { products, lines };

// };





function renderChart() {

  if (!myChart || !dataStore.beijingGeo) return;


// 直接使用来自 Pinia Store 的、经过预处理的真实数据

  const transportationData = dataStore.filteredTransportation;

  const productData = dataStore.filteredProduct;



  const option = {

    title: {

      text: `${dataStore.activeDynasty} 时期: 交通与物产分布`,

// 移除“演示用途”的副标题

      left: 'center',

      textStyle: {

        color: 'var(--primary-text-color)'

      }

    },
    // 添加全局 tooltip 配置，解决悬浮框显示不全和不换行的问题
    tooltip: {
      trigger: 'item',
      // 关键属性：将 tooltip 限制在图表容器内，防止被截断
      confine: true,
      // 关键样式：为 tooltip 设置固定宽度并启用自动换行
      extraCssText: 'width: 250px; white-space: normal; word-wrap: break-word; text-align: left;'
    },
    geo: {

      map: 'BJ',

      roam: true,

      itemStyle: {

        areaColor: '#E6E6E6',

        borderColor: '#ADADAD'

      },

      emphasis: {

        focus: 'self',

        itemStyle: {

          areaColor: '#D4D4D4'

        }

      }

    },

    // tooltip: { trigger: 'item' },

    legend: {

      data: ['交通', '物产'],

      orient: 'vertical',

      left: 'left',

      top: 'bottom',

      textStyle: {

        color: 'var(--secondary-text-color)'

      }

    },

    series: [

// 配置交通线路图层，使用预处理后的 lineCoords

      {

        name: '交通',

        type: 'lines',

        coordinateSystem: 'geo',

        data: transportationData.map(item => ({

          coords: item.lineCoords,

// 在提示框中显示原文

          tooltip: { formatter: `<b>交通:</b><br/>${item['原文'] || item['交通要道']}` }

        })),

        effect: { show: true, symbol: 'arrow', symbolSize: 6, trailLength: 0.1 },

        lineStyle: { color: '#008000', width: 2, opacity: 0.6, curveness: 0.2 }

      },

// 配置物产散点图层，使用预处理后的 coordinate

      {

        name: '物产',

        type: 'scatter',

        coordinateSystem: 'geo',

        data: productData.map(item => ({

          name: item['物产类型'],

          value: item.coordinate,

// 在提示框中显示原文

          tooltip: { formatter: `<b>物产 (${item['物产类型']}):</b><br/>${item['原文']}` }

        })),

        symbolSize: 15,

        label: { show: true, formatter: '{b}', position: 'right' }

      },

    ]

  };



  myChart.setOption(option, true);

}



onMounted(() => {

  const chartDom = document.getElementById('evolution-map-chart');

  myChart = echarts.init(chartDom);


  const setupChart = () => {

    if (dataStore.beijingGeo) {

      echarts.registerMap('BJ', dataStore.beijingGeo);

      renderChart();

    }

  };


  setupChart();


  watch(() => dataStore.beijingGeo, (newGeo) => {

    if (newGeo && !echarts.getMap('BJ')) {

      setupChart();

    }

  });


// 当朝代或数据变化时，重新渲染图表

  watch(() => [dataStore.activeDynasty, dataStore.transportation, dataStore.products], renderChart, {deep: true});


  resizeObserver = new ResizeObserver(() => myChart?.resize());

  resizeObserver.observe(chartDom);

});


onUnmounted(() => {

  resizeObserver?.disconnect();

  myChart?.dispose();

});

</script>


<style scoped>

.map-wrapper {

  position: relative;

  width: 100%;

  height: 100%;

}

.data-warning {

  position: absolute;

  bottom: 10px;

  right: 10px;

  background-color: rgba(255, 255, 255, 0.8);

  padding: 5px 10px;

  border-radius: 4px;

  font-size: 12px;

  border: 1px solid #ccc;

  max-width: 250px;

}

</style>

