<template>
  <div class="radar-wrapper">
    <div class="radar-header">
      <div class="selectors">
        <label v-for="(p, i) in periods" :key="i" class="checkbox-item">
          <input type="checkbox" v-model="selectedIndices" :value="i">
          <span class="color-box" :style="{ background: colors[i] }"></span>
          {{ p.name }}
        </label>
      </div>
      <p class="hint">勾选不同时期进行多维对比</p>
    </div>
    <div ref="chart" class="chart-area"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

const periods = [
  {
    name: "清漪园全盛 (1750)", // 改名：明确是前身
    values: [100, 95, 10, 95, 5] // 建筑极好, 生态极好, 仅皇室开放, 文化极高, 几乎无商业
  },
  {
    name: "清漪园被毁 (1860)", // 改名：精确对应英法联军焚毁清漪园
    values: [10, 30, 0, 40, 0]   // 建筑被毁(低), 生态遭战火破坏, 彻底封闭, 仅存遗址价值, 无商业
  },
  {
    name: "慈禧改建 (1890)", // 历史节点：改名颐和园
    values: [90, 75, 5, 85, 15]  // 建筑恢复, 成为政治中心(文化高), 依然封闭, 宫廷市集(少量商业)
  },
  {
    name: "现代开放 (2024)",
    values: [85, 80, 100, 100, 70] // 建筑保护, 生态修复, 全面开放, 世界遗产(文化满分), 旅游商业
  }
];

const axes = ["建筑完整性", "生态环境", "公众开放度", "文化影响力", "商业化程度"];
const colors = ["#d4a76a", "#757575", "#c94c4c", "#3a6c4f"];
const selectedIndices = ref([0, 3]); // 默认对比：乾隆全盛 vs 现代开放
const chart = ref(null);

let svg, rScale, angleSlice;
const width = 400, height = 350;
const margin = 50;
const radius = Math.min(width, height) / 2 - margin;
const initChart = () => {
  if (!chart.value) return;
  d3.select(chart.value).selectAll("*").remove();

  svg = d3.select(chart.value).append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

  rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);
  angleSlice = Math.PI * 2 / axes.length;

  // 绘制网格背景
  for (let i = 1; i <= 5; i++) {
    svg.append("circle")
        .attr("r", radius / 5 * i)
        .style("fill", "none")
        .style("stroke", "#e0e0e0") // 网格颜色淡一点
        .style("stroke-dasharray", "4 4");
  }

  // 绘制轴线和标签
  const axisGrid = svg.selectAll(".axis")
      .data(axes)
      .enter().append("g").attr("class", "axis");

  axisGrid.append("line")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI/2))
      .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI/2))
      .style("stroke", "#ccc")
      .style("stroke-width", 1);

  axisGrid.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI/2))
      .attr("y", (d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI/2))
      .text(d => d)
      .style("fill", "#666")
      .style("font-weight", "bold"); // 字体加粗一点

  drawPolygons();
};

const drawPolygons = () => {
  svg.selectAll(".radar-layer").remove();

  const lineRadial = d3.lineRadial()
      .angle((d, i) => i * angleSlice)
      .radius(d => rScale(d))
      .curve(d3.curveLinearClosed);

  selectedIndices.value.forEach(idx => {
    const data = periods[idx].values;
    const layer = svg.append("g").attr("class", "radar-layer");

    // 区域填充
    layer.append("path")
        .datum(data)
        .attr("d", lineRadial)
        .style("fill", colors[idx])
        .style("fill-opacity", 0)
        .transition().duration(800)
        .style("fill-opacity", 0.25); // 稍微透明一点，方便叠加查看

    // 描边
    layer.append("path")
        .datum(data)
        .attr("d", lineRadial)
        .style("stroke", colors[idx])
        .style("stroke-width", 2.5) // 线条加粗
        .style("fill", "none");

    // 数据点
    layer.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("cx", (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI/2))
        .attr("cy", (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI/2))
        .attr("r", 4)
        .style("fill", "#fff") //以此突出线条颜色
        .style("stroke", colors[idx])
        .style("stroke-width", 2);
  });
};

watch(selectedIndices, drawPolygons, { deep: true });

onMounted(initChart);
</script>

<style scoped>
.radar-wrapper { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; }
.radar-header { width: 100%; text-align: center; margin-bottom: 10px; background: #fcfcfc; padding: 10px; border-radius: 8px; }
.selectors { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
.checkbox-item { display: flex; align-items: center; font-size: 12px; cursor: pointer; color: #555; }
.color-box { width: 10px; height: 10px; margin: 0 5px; display: inline-block; border-radius: 2px; }
.hint { font-size: 10px; color: #999; margin-top: 5px; }
.chart-area { width: 100%; max-width: 400px; height: 350px; }
</style>