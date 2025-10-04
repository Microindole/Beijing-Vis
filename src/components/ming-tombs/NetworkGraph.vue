<template>
  <div ref="chart" class="network-graph-container"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "NetworkGraph",
  props: {
    nodes: { type: Array, required: true },
    links: { type: Array, required: true },
    categories: { type: Array, required: true },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    // 当数据变化时，重新渲染图表
    nodes: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.on("click", (params) => {
        if (params.dataType === "node") {
          // 当节点被点击时，触发一个事件并传递节点数据给父组件
          this.$emit("node-click", params.data);
        }
      });
      this.updateChart();
    },
    updateChart() {
      if (!this.chartInstance) return;
      const option = {
        tooltip: {
          formatter: (params) => {
            if (params.dataType === "node") {
              return `${params.name}<br/>类型: ${params.data.category}`;
            }
          },
        },
        legend: [
          {
            data: this.categories.map((a) => a.name),
            textStyle: { color: "#333" },
          },
        ],
        series: [
          {
            type: "graph",
            layout: "force",
            data: this.nodes,
            links: this.links,
            categories: this.categories,
            roam: true,
            label: {
              show: true,
              position: "right",
              formatter: "{b}",
            },
            force: {
              repulsion: 150, // 节点间的斥力因子
              edgeLength: 80, // 边的长度
            },
            emphasis: {
              focus: "adjacency",
              label: {
                position: "right",
                show: true,
              },
            },
            lineStyle: {
              color: "source",
              curveness: 0.1,
            },
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
  },
};
</script>

<style scoped>
.network-graph-container {
  width: 100%;
  height: 100%;
}
</style>
