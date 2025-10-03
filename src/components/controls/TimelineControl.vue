<template>
  <div class="timeline-control-container">
    <div ref="chart" class="timeline-chart"></div>
    <div class="current-year-display">
      当前年份: <strong>{{ currentYear }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// 1. 修改 Props
// 从接收 currentDynasty 改为接收 minYear 和 maxYear
const props = defineProps({
  minYear: {
    type: Number,
    required: true,
  },
  maxYear: {
    type: Number,
    required: true,
  },
});

// 2. 修改 Emits
// 从发送 timeline-change(dynasty) 改为发送 year-change(year)
const emit = defineEmits(['year-change']);

const chart = ref(null); // 使用 ref 引用DOM元素
let myChart = null;
const currentYear = ref(props.minYear); // 用于在界面上显示当前年份

onMounted(() => {
  // 使用 nextTick 确保DOM已经渲染
  nextTick(() => {
    myChart = echarts.init(chart.value);
    initChart();
  });
});

// 3. 监听 Props 变化
// 当父组件的数据加载完成后，minYear和maxYear会更新，此时我们需要重新渲染图表
watch(() => [props.minYear, props.maxYear], () => {
  if (myChart) {
    // 销毁旧实例并重新初始化，确保配置完全更新
    myChart.dispose();
    myChart = echarts.init(chart.value);
    initChart();
  }
});

function initChart() {
  if (!myChart || props.maxYear <= props.minYear) {
    return;
  }
  
  // 4. 使用 dataZoom (slider类型) 作为时间轴滑块
  const option = {
    // 我们不需要显示一个真正的图表，所以grid, xAxis, yAxis可以留空或隐藏
    grid: {
      left: 60,
      right: 60,
      top: 10,
      bottom: 50 // 为 dataZoom 留出空间
    },
    xAxis: {
      type: 'value',
      min: props.minYear,
      max: props.maxYear,
      show: false // 隐藏x轴，因为我们只关心滑块
    },
    yAxis: {
      type: 'value',
      show: false
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}',
    },
    // 这是核心部分
    dataZoom: [
      {
        type: 'slider', // 滑块类型
        xAxisIndex: [0], // 控制x轴
        startValue: props.minYear, // 初始位置
        endValue: props.minYear + (props.maxYear - props.minYear) * 0.05, // 默认选择5%的范围
        height: 25,
        bottom: 10,
        labelFormatter: (value) => `${Math.round(value)}年` // 格式化标签
      },
      {
        type: 'inside', // 支持鼠标滚轮缩放
        xAxisIndex: [0],
      },
    ],
    series: [] // 不需要任何系列数据
  };

  myChart.setOption(option);

  // 5. 监听 datazoom 事件
  // 当用户拖动滑块时，这个事件会被触发
  myChart.on('datazoom', (params) => {
    // ECharts 可能会一次性触发多个datazoom事件，我们只取第一个
    const startYear = Math.round(params.batch[0].startValue);
    currentYear.value = startYear; // 更新界面显示
    emit('year-change', startYear); // 将起始年份发送给父组件
  });

  // 初始化时，手动触发一次，确保父组件获得初始年份
  emit('year-change', props.minYear);
}
</script>

<style scoped>
.timeline-control-container {
  width: 100%;
  height: 80px; /* 给予一个固定的高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 0 20px;
  box-sizing: border-box;
}

.timeline-chart {
  width: 100%;
  height: 50px; /* ECharts 实例的高度 */
}

.current-year-display {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}
</style>