<template>
  <div ref="mapContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
// Import the data store to get the GeoJSON data
import { useDataStore } from '@/stores/useDataStore';

const props = defineProps({
  scatterData: {
    type: Array,
    default: () => []
  }
});

const mapContainer = ref(null);
let myChart = null;

// ==================== 1. Get data store instance ====================
const dataStore = useDataStore();

const setupMap = () => {
  // If the component is destroyed before map is ready, exit.
  if (!mapContainer.value) return;

  // ==================== 2. The CRUCIAL FIX ====================
  // Check if beijingGeo data is loaded. If not, don't initialize the map.
  if (!dataStore.beijingGeo) {
    console.error("Beijing GeoJSON data is not available yet.");
    return;
  }

  // Before initializing the chart, register the map
  echarts.registerMap('beijing', dataStore.beijingGeo);
  // =============================================================

  // Dispose the old chart instance if it exists
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(mapContainer.value);

  const option = {
    geo: {
      map: 'beijing', // Now ECharts knows what 'beijing' is
      roam: true,
      zoom: 1.1,
      center: [116.4074, 39.9042],
      itemStyle: {
        areaColor: '#e0e0e0',
        borderColor: '#666',
      },
      emphasis: {
        itemStyle: {
          areaColor: '#c4c4c4'
        }
      }
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 10,
        itemStyle: {
          opacity: 0.8,
        },
        // The data mapping logic from the previous answer
        data: props.scatterData.map(item => ({
          name: item.location || item.summary,
          value: item.coordinate ? [...item.coordinate, 1] : [],
          itemStyle: {
            color: item.visualType === 'disaster' ? '#f44336' :
                item.visualType === 'war' ? '#2196F3' :
                    item.visualType === 'event' ? '#4CAF50' : '#9E9E9E'
          },
          ...item
        }))
      }
    ],
    tooltip: {
      formatter: function (params) {
        const data = params.data;
        if (data && data.source_data) {
          let tooltipHtml = `<strong>${data.eventType}</strong><br/>`;
          tooltipHtml += `时期: ${data.dynasty || '未知'}<br/>`;
          tooltipHtml += `时间: ${data.time_display || '未知'}<br/>`;
          tooltipHtml += `地点: ${data.location || '未知'}<br/>`;
          tooltipHtml += `摘要: ${data.summary || '无'}<br/>`;
          return tooltipHtml;
        }
        return params.name;
      }
    }
  };

  myChart.setOption(option);
  window.addEventListener('resize', myChart.resize);
};

onMounted(() => {
  // Add a watch to ensure map is set up only after beijingGeo is loaded
  watch(() => dataStore.beijingGeo, (newGeoData) => {
    if (newGeoData && !myChart) {
      setupMap();
    }
  }, {immediate: true}); // immediate: true will run the watcher once on mount
});

onUnmounted(() => {
  if (myChart) {
    window.removeEventListener('resize', myChart.resize);
    myChart.dispose();
  }
});

watch(() => props.scatterData, () => {
  if (myChart) {
    myChart.setOption({
      series: [{
        data: props.scatterData.map(item => ({
          name: item.location || item.summary,
          value: item.coordinate ? [...item.coordinate, 1] : [],
          itemStyle: {
            color: item.visualType === 'disaster' ? '#f44336' :
                item.visualType === 'war' ? '#2196F3' :
                    item.visualType === 'event' ? '#4CAF50' : '#9E9E9E'
          },
          ...item
        }))
      }]
    });
  }
}, {deep: true});
</script>