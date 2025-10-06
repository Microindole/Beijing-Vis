<template>
  <div ref="chartContainer" class="chart-instance"></div>
</template>

<script>
import * as echarts from "echarts";
import {useChartResize} from "@/utils/chartUtils.js";

export default {
  name: "TrendChart",
  props: {
    landmarksData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      resizeObserver: null,
    };
  },
  mounted() {
    this.initChart();
    this.resizeObserver = useChartResize(this.$refs.chartContainer, this.chart);
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
    this.chart?.dispose();
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chartContainer;
      this.chart = echarts.init(chartDom);

      const buildDataMap = {};
      const vanishDataMap = {};
      const minYear = -800;
      const maxYear = 2025;
      for (let i = minYear; i <= maxYear; i++) {
        buildDataMap[i] = [];
        vanishDataMap[i] = [];
      }
      this.landmarksData.forEach((d) => {
        if (d.startYear >= minYear && d.startYear <= maxYear) buildDataMap[d.startYear].push(d.name);
        if (d.status === "vanished" && d.endYear >= minYear && d.endYear <= maxYear) vanishDataMap[d.endYear].push(d.name);
      });

      const years = Object.keys(buildDataMap).map(Number).sort((a, b) => a - b);
      const buildCounts = years.map((year) => buildDataMap[year].length);
      const vanishCounts = years.map((year) => vanishDataMap[year].length);

      const option = {
        title: {
          text: "北京地标兴建/消失趋势",
          subtext: "历年地标数量变化概览",
          left: "center",
          top: 20,
          textStyle: {color: "#333"},
          subtextStyle: {color: "#666"}
        },
        tooltip: {
          trigger: "axis", axisPointer: {type: "shadow"},
          formatter: (params) => {
            const year = parseInt(params[0].name);
            let tooltip = `<strong>${year < 0 ? `公元前${-year}` : `${year}年`}</strong><br/>`;
            const currentBuildLandmarks = buildDataMap[year] || [];
            const currentVanishLandmarks = vanishDataMap[year] || [];
            params.forEach((item) => {
              tooltip += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
              if (item.seriesName === "兴建地标数量" && currentBuildLandmarks.length > 0) tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentBuildLandmarks.join("、")}<br/>`;
              else if (item.seriesName === "消失地标数量" && currentVanishLandmarks.length > 0) tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentVanishLandmarks.join("、")}<br/>`;
            });
            return tooltip;
          },
        },
        legend: {data: ["兴建地标数量", "消失地标数量"], top: 80, left: "center", textStyle: {color: "#333"}},
        grid: {left: "5%", right: "5%", top: "25%", bottom: "15%", containLabel: true},
        xAxis: {
          type: "category", data: years, axisLabel: {
            formatter: (v) => {
              const y = parseInt(v);
              return y < 0 ? `公元前${-y}` : `${y}年`;
            }, interval: (i, v) => {
              const y = parseInt(v);
              if (Math.abs(y) > 1000) return y % 500 === 0;
              if (Math.abs(y) > 500) return y % 200 === 0;
              if (Math.abs(y) > 100) return y % 100 === 0;
              return i % 50 === 0;
            }, rotate: 45
          }, boundaryGap: false, axisTick: {alignWithLabel: true}
        },
        yAxis: {type: "value", name: "地标数量", minInterval: 1},
        series: [
          {
            name: "兴建地标数量",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {color: "#3CB371"},
            lineStyle: {color: "#3CB371", width: 2},
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(60,179,113,0.3)"
              }, {offset: 1, color: "rgba(60,179,113,0)"}])
            },
            data: buildCounts
          },
          {
            name: "消失地标数量",
            type: "line",
            smooth: true,
            symbol: "diamond",
            symbolSize: 8,
            itemStyle: {color: "#DC143C"},
            lineStyle: {color: "#DC143C", width: 2},
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(220,20,60,0.3)"
              }, {offset: 1, color: "rgba(220,20,60,0)"}])
            },
            data: vanishCounts
          },
        ],
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            start: 0,
            end: 100,
            bottom: 0,
            height: 20,
            textStyle: {color: "#666"},
            handleIcon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-9.1,0.4-9.1,0.4V2.7c0-0.3,0.1-0.4,0.3-0.5c0.2-0.1,0.5-0.1,0.7-0.1h15c0.3,0,0.5,0.1,0.7,0.1c0.2,0.1,0.3,0.2,0.3,0.5v9.6c0,0.2-0.1,0.4-0.3,0.5c-0.2,0.1-0.5,0.1-0.7,0.1h-1.3v-1.3H10.7zM4.9,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C5.1,4.4,5,4.3,4.9,4.3zM10.1,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C10.3,4.4,10.2,4.3,10.1,4.3zM15.3,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C15.5,4.4,15.4,4.3,15.3,4.3zM4.9,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C5.1,7.6,5,7.5,4.9,7.5zM10.1,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C10.3,7.6,10.2,7.5,10.1,7.5zM15.3,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C15.5,7.6,15.4,7.5,15.3,7.5zM4.9,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C5.1,10.8,5,10.7,4.9,10.7zM10.1,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C10.3,10.8,10.2,10.7,10.1,10.7zM15.3,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C15.5,10.8,15.4,10.7,15.3,10.7z",
            handleSize: "110%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          },
          {type: "inside", xAxisIndex: 0, filterMode: "empty", zoomOnMouseWheel: true, moveOnMouseMove: true}
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.chart-instance {
  width: 100%;
  height: 100%;
}
</style>