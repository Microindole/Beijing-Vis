<template>
  <div class="zoom-wrapper">
    <div class="chart-header">
      <h4>颐和园历史关注度与事件演变 (1740-2024)</h4>
    </div>
    <div ref="mainChart" class="main-chart"></div>
    <div ref="brushChart" class="brush-chart"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import * as d3 from 'd3';

const mainChart = ref(null);
const brushChart = ref(null);

// 构造基于史实的数据趋势
// value 代表 "建设/关注度/繁荣度" 的模拟指数
const historicalEvents = [
  {year: 1750, val: 80, event: "乾隆建清漪园", type: "build"},
  {year: 1860, val: 10, event: "英法联军焚毁", type: "destroy"},
  {year: 1888, val: 70, event: "慈禧改名颐和园", type: "build"},
  {year: 1900, val: 20, event: "八国联军破坏", type: "destroy"},
  {year: 1924, val: 40, event: "辟为公园开放", type: "open"},
  {year: 1998, val: 90, event: "入选世界遗产", type: "honor"},
  {year: 2008, val: 100, event: "奥运火炬传递", type: "high"}
];

// 插值生成连续数据
const generateTimeline = () => {
  const data = [];
  const keyYears = historicalEvents.map(d => d.year);
  for (let y = 1740; y <= 2024; y++) {
    let value = 30; // 基础分
    // 简单模拟历史起伏
    if (y >= 1750 && y < 1860) value = 80 + Math.random() * 10; // 盛世
    if (y >= 1860 && y < 1888) value = 15 + Math.random() * 5;  // 废墟
    if (y >= 1888 && y < 1900) value = 75 + Math.random() * 5;  // 中兴
    if (y >= 1900 && y < 1949) value = 30 + Math.random() * 10; // 动荡
    if (y >= 1949) value = 50 + (y - 1949) * 0.7; // 现代增长

    // 叠加事件影响
    const evt = historicalEvents.find(e => e.year === y);
    if (evt) value = evt.val;

    data.push({date: new Date(y, 0, 1), value, event: evt ? evt.event : null});
  }
  return data;
};

const data = generateTimeline();

const initCharts = () => {
  if (!mainChart.value || !brushChart.value) return;

  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const margin2 = {top: 10, right: 20, bottom: 30, left: 40};
  const width = mainChart.value.offsetWidth - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;
  const height2 = 80 - margin2.top - margin2.bottom;

  // 1. 主图 SVG
  const svg = d3.select(mainChart.value).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  const focus = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // 2. 缩略图 SVG
  const svg2 = d3.select(brushChart.value).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height2 + margin2.top + margin2.bottom);

  const context = svg2.append("g").attr("transform", `translate(${margin.left},${margin2.top})`);

  // 比例尺
  const x = d3.scaleTime().range([0, width]);
  const x2 = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const y2 = d3.scaleLinear().range([height2, 0]);

  x.domain(d3.extent(data, d => d.date));
  x2.domain(x.domain());
  y.domain([0, 120]);
  y2.domain(y.domain());

  // 轴
  const xAxis = d3.axisBottom(x);
  const xAxis2 = d3.axisBottom(x2);

  // 渐变色
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient").attr("id", "areaGradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
  gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3a6c4f").attr("stop-opacity", 0.8);
  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3a6c4f").attr("stop-opacity", 0.1);

  // 区域生成器
  const area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

  const area2 = d3.area()
      .x(d => x2(d.date))
      .y0(height2)
      .y1(d => y2(d.value))
      .curve(d3.curveMonotoneX);

  // 裁剪路径
  defs.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

  // --- 绘制主图 ---
  const focusPath = focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "url(#areaGradient)")
      .attr("clip-path", "url(#clip)");

  const gX = focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

  focus.append("g").call(d3.axisLeft(y).ticks(5));

  // 事件标记 (Focus)
  const eventGroup = focus.append("g").attr("clip-path", "url(#clip)");

  const updateEvents = () => {
    eventGroup.selectAll(".evt-mark").remove();
    const visibleData = data.filter(d => d.event && x(d.date) >= 0 && x(d.date) <= width);

    const marks = eventGroup.selectAll(".evt-mark")
        .data(visibleData)
        .enter().append("g")
        .attr("class", "evt-mark")
        .attr("transform", d => `translate(${x(d.date)}, ${y(d.value)})`);

    marks.append("circle")
        .attr("r", 5)
        .style("fill", "#d4a76a")
        .style("stroke", "#fff");

    marks.append("text")
        .text(d => d.event)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("fill", "#333")
        .style("font-weight", "bold")
        .style("text-shadow", "0 1px 2px #fff");
  };

  // --- 绘制缩略图 ---
  context.append("path")
      .datum(data)
      .attr("d", area2)
      .style("fill", "#ccc");

  context.append("g")
      .attr("transform", `translate(0,${height2})`)
      .call(xAxis2);

  // 刷子 Brush
  const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("brush end", brushed);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, [x(new Date(1850, 0, 1)), x(new Date(2024, 0, 1))]);

  function brushed(event) {
    if (event.sourceEvent && event.sourceEvent.type === "zoom") return;
    const s = event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focusPath.attr("d", area);
    gX.call(xAxis);
    updateEvents();
  }

  updateEvents();
};

onMounted(initCharts);
</script>

<style scoped>
.zoom-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
}

.chart-header h4 {
  margin: 0 0 10px 0;
  color: #5d4037;
  text-align: center;
}

.main-chart {
  width: 100%;
  height: 250px;
}

.brush-chart {
  width: 100%;
  height: 80px;
  background: #f9f9f9;
}
</style>