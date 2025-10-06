<template>
  <div ref="chartContainer" class="chart-instance"></div>
</template>

<script>
import * as echarts from "echarts";
import {typeColors, getDarkerColor, useChartResize} from "@/utils/chartUtils.js";

export default {
  name: "ForceChart",
  props: {
    landmarksData: {
      type: Array,
      required: true,
    },
    relationsData: {
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
      isFullScreen: false,
    };
  },
  watch: {
    isFullScreen(isFull) {
      this.updateChartForFullScreen(isFull);
    },
  },
  mounted() {
    this.initChart();
    this.resizeObserver = useChartResize(this.$refs.chartContainer, this.chart);
    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
    document.removeEventListener("fullscreenchange", this.handleFullScreenChange);
    this.chart?.off("dblclick", this.handleChartDbClick);
    this.chart?.dispose();
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chartContainer;
      this.chart = echarts.init(chartDom);
      this.chart.on("dblclick", this.handleChartDbClick);

      const nodes = this.landmarksData.map((d) => ({
        name: d.name, value: d.importance, category: d.type, symbolSize: d.importance * 4 + 15,
        label: {
          show: true,
          position: "inside",
          fontSize: this.highlightedLandmarks.includes(d.name) ? 14 : 12,
          color: this.highlightedLandmarks.includes(d.name) ? "#FFF" : "#EEE",
          fontWeight: this.highlightedLandmarks.includes(d.name) ? "bolder" : "bold",
          formatter: `{b}${d.status === "vanished" ? "\n(已消失)" : ""}`
        },
        itemStyle: {
          color: d.status === "vanished" ? "#999999" : this.highlightedLandmarks.includes(d.name) ? getDarkerColor(typeColors[d.type] || '#999') : (typeColors[d.type] || '#999'),
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)"
        },
      }));
      const categories = [...new Set(this.landmarksData.map((d) => d.type))].map((type) => ({name: type}));
      const links = this.relationsData.map((r) => ({
        source: r.source, target: r.target, value: r.value, relation: r.relation,
        lineStyle: {
          color: r.value > 0.8 ? "#A0522D" : r.value > 0.6 ? "#D2B48C" : "#E8D8C3",
          width: r.value * 3 + 1,
          opacity: 0.8,
          curveness: 0.2
        },
        label: {
          show: true,
          formatter: r.relation,
          fontSize: 10,
          color: "#666",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: [2, 4],
          borderRadius: 2
        },
        emphasis: {
          lineStyle: {color: "#8B4513", width: r.value * 3 + 3},
          label: {show: true, color: "#333", fontWeight: "bold"}
        },
      }));
      const option = {
        title: {
          text: "北京地标关系网络图：关联与强度",
          subtext: "节点大小：地标重要性 | 颜色：地标类型 | 连线：关系类型与强度",
          left: "center",
          top: 20,
          textStyle: {color: "#333", fontSize: 18},
          subtextStyle: {color: "#666", fontSize: 12}
        },
        legend: {data: categories.map((c) => c.name), left: "center", bottom: 10, textStyle: {color: "#333"}},
        series: [{
          name: "地标关系",
          type: "graph",
          layout: "force",
          data: nodes,
          links: links,
          categories: categories,
          roam: true,
          draggable: true,
          force: {repulsion: 800, edgeLength: [200, 300], gravity: 0.1, friction: 0.6, layoutAnimation: true},
          label: {show: true, position: "right", formatter: "{b}", fontSize: 12, color: "#333"},
          lineStyle: {color: "#999", curveness: 0.3},
          emphasis: {focus: "adjacency", lineStyle: {color: "#666"}},
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#bd6b20",
            borderWidth: 1,
            textStyle: {color: "#333"},
            formatter: (params) => {
              if (params.dataType === "node") {
                const landmark = this.landmarksData.find(d => d.name === params.data.name);
                const status = landmark.status === "vanished" ? "（已消失）" : "（现存）";
                return `<div style="padding: 5px 0;"><strong style="font-size: 1.1em; color: #8B4513;">${params.data.name} ${status}</strong><br/><span style="color: #666;">类型:</span> ${params.data.category}<br/><span style="color: #666;">重要性:</span> ${params.data.value}<br/><span style="color: #666;">描述:</span> ${landmark.description}</div>`;
              } else if (params.dataType === "edge") {
                return `<div style="padding: 5px 0;"><strong style="font-size: 1.1em; color: #8B4513;">${params.data.source}</strong><span style="color: #666;">-</span> ${params.data.relation} <span style="color: #666;">-</span><strong style="font-size: 1.1em; color: #8B4513;">${params.data.target}</strong><br/><span style="color: #666;">关系强度:</span> ${params.data.value.toFixed(1)}</div>`;
              }
            }
          },
        }],
      };
      this.chart.setOption(option);
    },
    handleChartDbClick() {
      const element = this.$refs.chartContainer;
      if (!this.isFullScreen) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    },
    handleFullScreenChange() {
      this.isFullScreen = !!document.fullscreenElement;
    },
    updateChartForFullScreen(isFullScreen) {
      if (!this.chart) return;
      const option = isFullScreen ? {
        backgroundColor: '#0d1117',
        title: {textStyle: {color: '#E0E6F1'}, subtextStyle: {color: '#A5B4C8'}},
        legend: {textStyle: {color: '#E0E6F1'}},
        series: [{
          name: '地标关系',
          nodes: this.chart.getOption().series[0].data.map(node => ({
            ...node,
            label: {...node.label, position: 'right', color: '#E0E6F1', textShadowBlur: 2, textShadowColor: '#000'},
            itemStyle: {...node.itemStyle, shadowBlur: 25, shadowColor: node.itemStyle.color}
          })),
          links: this.chart.getOption().series[0].links.map(link => ({
            ...link,
            lineStyle: {...link.lineStyle, color: '#4A90E2', opacity: 0.7}
          })),
          emphasis: {lineStyle: {color: '#26D0FF', width: 4}},
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          effect: {show: true, period: 4, trailLength: 0.1, symbol: 'circle', symbolSize: 3, color: '#FFF'}
        }]
      } : {
        backgroundColor: 'transparent',
        title: {textStyle: {color: '#333'}, subtextStyle: {color: '#666'}},
        legend: {textStyle: {color: '#333'}},
        series: [{
          name: '地标关系',
          nodes: this.chart.getOption().series[0].data.map(node => ({
            ...node,
            label: {
              ...node.label,
              position: 'inside',
              color: this.highlightedLandmarks.includes(node.name) ? '#FFF' : '#EEE'
            },
            itemStyle: {...node.itemStyle, shadowBlur: 10, shadowColor: "rgba(0,0,0,0.3)"}
          })),
          links: this.chart.getOption().series[0].links.map(link => ({
            ...link,
            lineStyle: {
              ...link.lineStyle,
              color: link.value > 0.8 ? "#A0522D" : link.value > 0.6 ? "#D2B48C" : "#E8D8C3",
              opacity: 0.8
            }
          })),
          emphasis: {lineStyle: {color: '#8B4513'}},
          effect: {show: false}
        }]
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