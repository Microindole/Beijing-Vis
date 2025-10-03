<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'CorrelationCharts',
  props: {
    impactData: {
      type: Array,
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
    impactData: {
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
      if (!this.chart || !this.impactData) return;

      // 为不同事件类型定义颜色
      const categories = ['灾害', '战争', '事件'];
      const colors = ['#c23531', '#2f4554', '#61a0a8'];
      
      const seriesData = categories.map((category, index) => {
        const data = this.impactData
          .filter(item => item.category === category && item.year)
          .map(item => ({
            name: item.name,
            value: [
                item.year,
                index, // Y轴使用类别的索引，让不同类型的事件分层显示
                item.description,
            ],
          }));

        return {
          name: category,
          type: 'scatter',
          symbolSize: 8,
          data: data,
          itemStyle: {
            color: colors[index]
          }
        };
      });

      const option = {
        title: {
          text: '灾害、战争与重大事件',
          left: 'center',
          textStyle: { fontSize: 14 }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const eventData = params.value;
                return `<b>年份:</b> ${eventData[0]}<br/>` +
                       `<b>类型:</b> ${params.seriesName}<br/>` +
                       `<b>事件:</b> ${params.name}<br/>` +
                       `<b>详情:</b> ${eventData[2]}`;
            }
        },
        legend: {
            data: categories,
            bottom: 10,
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          top: '15%',
        },
        xAxis: {
            type: 'value',
            name: '年份',
            splitLine: { show: false }
        },
        yAxis: {
            type: 'category',
            data: categories,
            axisLine: { show: false },
            axisTick: { show: false },
        },
        series: seriesData,
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100,
            xAxisIndex: [0],
          }
        ],
      };
      
      this.chart.setOption(option);
    }
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
  min-height: 250px;
}
</style>