<template>
  <div class="event-charts">
    <div ref="eventTypeChartRef" class="chart-instance"></div>

    <h3>事件时间线</h3>
    <div class="event-timeline-list">
      <div v-if="sortedEvents.length === 0">没有事件数据可显示。</div>
      <div v-else>
        <div v-for="event in sortedEvents" :key="event.id" class="event-item">
          <span class="event-time"><strong>{{ event.time_display }}</strong></span>
          <span :class="['event-type-label', event.visualType]">{{ event.eventType }}</span>
          <span class="event-location">{{ event.location }}</span>
          <p class="event-summary">{{ event.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  eventsData: {
    type: Array,
    default: () => []
  }
});

const eventTypeChartRef = ref(null);
let eventTypeChartInstance = null;

// 根据年份排序事件，方便时间线展示
const sortedEvents = computed(() => {
  // 确保有 year_start 才能排序
  return [...props.eventsData].sort((a, b) => (a.year_start || 0) - (b.year_start || 0));
});


// 绘制事件类型分布图
const drawEventTypeChart = () => {
  if (!eventTypeChartRef.value) return;

  if (eventTypeChartInstance) {
    eventTypeChartInstance.dispose(); // 销毁旧实例
  }
  eventTypeChartInstance = echarts.init(eventTypeChartRef.value);

  const typeCounts = props.eventsData.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(typeCounts);
  const values = Object.values(typeCounts);

  const option = {
    title: {
      text: '事件类型分布',
      left: 'center',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { interval: 0, rotate: 30 } // 标签旋转避免重叠
    },
    yAxis: {
      type: 'value',
      name: '事件数量'
    },
    series: [{
      data: values,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      itemStyle: {
        color: (params) => { // 根据事件类型给不同颜色
          const colors = {
            '水灾': '#4CAF50', // 绿色
            '旱灾': '#FFC107', // 黄色
            '蝗灾': '#FF9800', // 橙色
            '疫灾': '#F44336', // 红色
            '地震': '#607D8B', // 灰蓝色
            '攻城战': '#D32F2F', // 深红色
            '围城战': '#FBC02D', // 深黄色
            '野战': '#0288D1', // 深蓝色
            '城破': '#B71C1C', // 更深的红
            '制度改革': '#8BC34A', // 浅绿色
            '巡幸': '#2196F3', // 蓝色
            '都城建设': '#673AB7', // 紫色
            '迁都': '#9C27B0', // 深紫色
            '综合事件': '#9E9E9E' // 灰色
          };
          return colors[categories[params.dataIndex]] || '#808080';
        }
      }
    }]
  };
  eventTypeChartInstance.setOption(option);
  window.addEventListener('resize', eventTypeChartInstance.resize);
};

onMounted(() => {
  if (props.eventsData && props.eventsData.length > 0) {
    drawEventTypeChart();
  }
});

onUnmounted(() => {
  if (eventTypeChartInstance) {
    window.removeEventListener('resize', eventTypeChartInstance.resize);
    eventTypeChartInstance.dispose();
  }
});

// 监听数据变化，重新绘制图表
watch(() => props.eventsData, (newVal) => {
  if (newVal && newVal.length > 0) {
    drawEventTypeChart();
  } else {
    if (eventTypeChartInstance) {
      eventTypeChartInstance.clear(); // 清空图表
    }
  }
}, { deep: true });

</script>

<style scoped>
.event-charts {
  font-family: 'Arial', sans-serif;
  color: #333;
}

.chart-instance {
  width: 100%;
  height: 300px; /* 图表高度 */
  margin-bottom: 20px;
}

h3 {
  margin-top: 25px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.event-timeline-list {
  max-height: 400px; /* 设置最大高度，允许滚动 */
  overflow-y: auto;
  padding-right: 10px; /* 避免滚动条遮挡内容 */
}

.event-item {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.event-time {
  font-size: 0.95em;
  color: #666;
  margin-right: 10px;
}

.event-type-label {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  margin-right: 8px;
  /* 根据 visualType 提供不同背景色 */
}

/* 根据 visualType 设置标签颜色 */
.event-type-label.disaster { background-color: #f44336; } /* 红色 */
.event-type-label.war { background-color: #2196F3; } /* 蓝色 */
.event-type-label.event { background-color: #4CAF50; } /* 绿色 */

.event-location {
  font-size: 0.9em;
  color: #888;
}

.event-summary {
  font-size: 0.9em;
  margin-top: 8px;
  line-height: 1.5;
  color: #555;
}
</style>