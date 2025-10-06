<template>
  <div ref="chartContainer" class="chart-instance"></div>
</template>

<script>
import * as echarts from "echarts";
import {typeColors, getDarkerColor, useChartResize} from "@/utils/chartUtils.js";

export default {
  name: "TimelineChart",
  props: {
    landmarksData: {
      type: Array,
      required: true,
    },
    highlightedLandmarks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      resizeObserver: null,
      selectedLegendTypes: null,
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

      const allLandmarkTypes = [...new Set(this.landmarksData.map((d) => d.type))];
      if (this.selectedLegendTypes === null) {
        this.selectedLegendTypes = Object.fromEntries(allLandmarkTypes.map(type => [type, true]));
      }

      const option = {
        title: {
          text: "北京地标历史时间线",
          subtext: "展示地标的建成与主要活跃年代",
          left: "center",
          top: 20,
          textStyle: {color: "#333"},
          subtextStyle: {color: "#666"}
        },
        tooltip: {
          trigger: "item", formatter: (params) => {
            const data = params.data.value ? params.data.value[3] : params.data;
            if (!data || !data.name) return "";
            const statusText = data.status === "vanished" ? "（已消失）" : "（现存）";
            return `<strong>${data.name} ${statusText}</strong><br/>类型: ${data.type}<br/>年代: ${data.era}<br/>重要性: ${data.importance}<br/>${data.description}`;
          }
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            start: 0,
            end: 100,
            backgroundColor: "rgba(254, 251, 245, 0.95)",
            dataBackground: {
              lineStyle: {color: "#bd6b20", width: 2.5, opacity: 0.9},
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "rgba(212, 167, 106, 0.4)"
                }, {offset: 1, color: "rgba(212, 167, 106, 0.1)"}]), opacity: 1
              }
            },
            fillerColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "rgba(189, 107, 32, 0.5)"
            }, {offset: 1, color: "rgba(212, 167, 106, 0.3)"}]),
            borderColor: "#bd6b20",
            borderWidth: 1,
            handleStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#d4a76a"
              }, {offset: 1, color: "#bd6b20"}]),
              borderColor: "#8B4513",
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: "rgba(139, 69, 19, 0.4)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            textStyle: {color: "#8B4513", fontWeight: "500"},
            emphasis: {
              handleStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "#e6c896"
                }, {offset: 1, color: "#d4a76a"}]),
                borderColor: "#8B4513",
                shadowBlur: 12,
                shadowColor: "rgba(139, 69, 19, 0.5)"
              }
            },
            moveHandleSize: 8,
            height: 30
          },
          {type: "inside", xAxisIndex: 0, filterMode: "empty"},
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "empty",
            right: "1%",
            width: 25,
            start: 0,
            end: 50,
            backgroundColor: "rgba(254, 251, 245, 0.95)",
            dataBackground: {
              lineStyle: {color: "#bd6b20", width: 2, opacity: 0.9},
              areaStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: "rgba(212, 167, 106, 0.4)"
                }, {offset: 1, color: "rgba(212, 167, 106, 0.1)"}]), opacity: 1
              }
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: "rgba(189, 107, 32, 0.5)"
            }, {offset: 1, color: "rgba(212, 167, 106, 0.3)"}]),
            borderColor: "#bd6b20",
            borderWidth: 1,
            handleStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#d4a76a"
              }, {offset: 1, color: "#bd6b20"}]),
              borderColor: "#8B4513",
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: "rgba(139, 69, 19, 0.4)"
            },
            textStyle: {color: "#8B4513", fontWeight: "500"},
            emphasis: {
              handleStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "#e6c896"
                }, {offset: 1, color: "#d4a76a"}]), borderColor: "#8B4513", shadowBlur: 12
              }
            }
          },
          {type: "inside", yAxisIndex: 0, filterMode: "empty"},
        ],
        grid: {left: "5%", right: "5%", top: "18%", bottom: "12%", containLabel: true},
        xAxis: {
          type: "value",
          name: "年份",
          min: -800,
          max: 2050,
          axisLabel: {formatter: (value) => (value < 0 ? `公元前${-value}` : `${value}年`)},
          splitLine: {show: true, lineStyle: {type: "dashed"}}
        },
        yAxis: {
          type: "category",
          data: this.landmarksData.map((d) => d.name),
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 0,
            formatter: this.yAxisFormatter.bind(this),
            rich: {
              highlight: {fontWeight: "bold", color: "#8B4513", fontSize: 14},
              vanished: {color: "#999", fontStyle: "italic"}
            },
            margin: 10
          },
          splitLine: {show: false}
        },
        series: [
          {
            name: "地标活跃期",
            type: "custom",
            renderItem: this.renderTimelineItem.bind(this),
            encode: {x: [0, 1], y: 2, itemName: 3, tooltip: [0, 1, 2, 3]},
            data: this.landmarksData.map((d, index) => ({value: [d.startYear, d.endYear, index, d]}))
          },
          {
            name: "地标点",
            type: "scatter",
            symbolSize: 10,
            itemStyle: {color: "rgba(0,0,0,0)"},
            label: {show: false},
            data: this.getScatterData(),
            z: 10
          },
        ],
        legend: {
          data: allLandmarkTypes.map((type) => ({
            name: type,
            icon: "rect",
            itemStyle: {color: typeColors[type]}
          })),
          top: 80,
          left: "center",
          orient: "horizontal",
          textStyle: {color: "#333"},
          selected: this.selectedLegendTypes,
          selectedMode: "multiple"
        },
      };

      this.chart.setOption(option);
      this.chart.on("legendselectchanged", this.handleLegendChange);
    },
    yAxisFormatter(name) {
      const landmark = this.landmarksData.find((d) => d.name === name);
      if (!landmark || !this.selectedLegendTypes[landmark.type]) return "";
      if (this.highlightedLandmarks.includes(name)) return `{highlight|${name}}`;
      if (landmark.status === "vanished") return `{vanished|${name}}`;
      return name;
    },
    renderTimelineItem(params, api) {
      const data = api.value(3);
      const isHighlighted = this.highlightedLandmarks.includes(data.name);
      if (!this.selectedLegendTypes[data.type]) return {type: "group"};
      const startPoint = api.coord([api.value(0), api.value(2)]);
      const endPoint = api.coord([api.value(1), api.value(2)]);
      const height = api.size([0, 1])[1] * 0.6;
      return {
        type: "rect",
        shape: {x: startPoint[0], y: startPoint[1] - height / 2, width: endPoint[0] - startPoint[0], height: height},
        style: api.style({
          fill: isHighlighted ? getDarkerColor(typeColors[data.type]) : typeColors[data.type],
          stroke: "#fff",
          lineWidth: isHighlighted ? 2 : 1,
          shadowBlur: isHighlighted ? 8 : 5,
          shadowColor: isHighlighted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
          stroke_: data.status === "vanished" ? "#999" : "#fff",
          lineDash: data.status === "vanished" ? [5, 5] : [],
          lineWidth_: data.status === "vanished" ? 2 : 1
        }),
      };
    },
    getScatterData() {
      return this.landmarksData.map((d, index) => ({
        name: d.name,
        value: [d.startYear + (d.endYear - d.startYear) / 2, index],
        symbol: this.selectedLegendTypes[d.type] ? "circle" : "none",
        tooltip: {
          formatter: () => {
            const statusText = d.status === "vanished" ? "（已消失）" : "（现存）";
            return `<strong>${d.name} ${statusText}</strong><br/>类型: ${d.type}<br/>年代: ${d.era}<br/>重要性: ${d.importance}<br/>${d.description}`;
          }
        },
      }));
    },
    handleLegendChange(params) {
      this.selectedLegendTypes = params.selected;
      this.chart.setOption({
        yAxis: {axisLabel: {formatter: this.yAxisFormatter.bind(this)}},
        series: [{type: "custom"}, {type: "scatter", data: this.getScatterData()}],
      });
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