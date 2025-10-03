<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EcologicalCharts',
  props: {
    ecologyData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    // 监听数据变化，如果数据是异步加载的，这很有用
    ecologyData: {
      deep: true,
      handler() {
        this.updateChart();
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart || !this.ecologyData || !this.ecologyData.water) {
        return;
      }

      // 数据转换：将水系事件转换为ECharts散点图需要的数据格式
      const data = this.ecologyData.water
        .filter(event => event.year) // 过滤掉没有年份的事件
        .map(event => ({
          name: event.river,
          // ECharts散点图格式: [x轴, y轴, size, ...其他信息]
          value: [
            event.year,
            Math.random() * 100, // Y轴用随机数来散开点，便于观察
            event.description,
            event.type
          ],
        }));

      const option = {
        title: {
          text: '北京历史水系事件',
          left: 'center',
          textStyle: { fontSize: 14 }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const eventData = params.value;
            return `<b>年份:</b> ${eventData[0]}<br/>` +
                   `<b>河流:</b> ${params.name}<br/>` +
                   `<b>事件类型:</b> ${eventData[3]}<br/>` +
                   `<b>描述:</b> ${eventData[2]}`;
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%',
        },
        xAxis: {
          type: 'value',
          name: '年份',
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          show: false, // Y轴仅用于散开点，本身没有意义
        },
        series: [{
          name: '水系事件',
          type: 'scatter',
          symbolSize: 10,
          data: data,
        }],
        dataZoom: [ // 添加缩放/漫游组件
          {
            type: 'slider',
            start: 0,
            end: 100,
            xAxisIndex: [0],
          }
        ],
      };

      this.chart.setOption(option);
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 250px; /* 确保图表有一个最小高度 */
}
</style>