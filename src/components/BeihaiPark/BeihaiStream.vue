<template>
  <div class="d3-stream-container" ref="chartRef"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

const chartRef = ref(null);
let resizeObserver = null;

// 【数据生成】保持之前的“真实历史事件”逻辑
const generateData = () => {
  const data = [];
  const keys = ["学术研究", "媒体曝光", "文创营收", "古建修缮"];

  for (let year = 1990; year <= 2023; year++) {
    let academic = 10 + (year - 1990) * 2;
    let media = 20 + (year - 1990) * 3;
    let creative = 5;
    let protect = 15;

    // 历史节点事件模拟
    if (year >= 2001 && year <= 2003) media += 30; // 申奥
    if (year === 2008) { media += 80; protect += 40; } // 奥运
    if (year >= 2014) academic += 40; // 申遗
    if (year >= 2016) creative += (year - 2015) * 15; // 文创兴起
    if (year === 2019) { media += 100; creative += 60; academic += 30; } // 850周年
    if (year >= 2020) { media += 40; creative += 20; } // 线上热度

    data.push({
      year: year,
      "学术研究": Math.floor(academic + Math.random() * 5),
      "媒体曝光": Math.floor(media + Math.random() * 15),
      "文创营收": Math.floor(creative + Math.random() * 5),
      "古建修缮": Math.floor(protect + Math.random() * 10),
    });
  }
  return { data, keys };
};

const { data, keys } = generateData();

const drawChart = () => {
  if (!chartRef.value) return;
  const width = chartRef.value.offsetWidth;
  const height = chartRef.value.offsetHeight;
  if (width <= 0 || height <= 0) return;

  d3.select(chartRef.value).selectAll("*").remove();

  // 增加左侧边距以容纳 Y 轴文字
  const margin = { top: 40, right: 30, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(chartRef.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // 1. 堆叠配置 【关键修改】
  const stack = d3.stack()
      .keys(keys)
      .offset(d3.stackOffsetNone) // 修改为 None，让底部对齐 0 轴 (不再是漂浮的河流)
      .order(d3.stackOrderNone);

  const stackedData = stack(data);

  // 2. 比例尺
  const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);

  // Y轴域从 0 到 最大值
  const maxY = d3.max(stackedData, layer => d3.max(layer, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1]) // 留出顶部 10% 空间
      .range([innerHeight, 0]);

  // 3. 颜色映射 (对应之前的真实数据配色)
  const color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#3a6c4f", "#d4a76a", "#c62828", "#8d6e63"]);

  // 4. 区域生成器
  const area = d3.area()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX); // 使用平滑曲线，但不如 basis 那么夸张，保证数据准确性

  // 5. 绘制堆叠区域
  svg.selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr("d", area)
      .style("fill", d => color(d.key))
      .style("opacity", 0.9)
      .style("stroke", "#fff") // 增加白色描边，区分色块
      .style("stroke-width", 0.5)
      .on("mouseover", function(event, d) {
        d3.selectAll(".layer").style("opacity", 0.3);
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.selectAll(".layer").style("opacity", 0.9);
      });

  // 6. 绘制坐标轴 【新增部分】

  // X 轴
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(8);
  svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .style("font-family", "Noto Serif SC")
      .style("color", "#5a4a42");

  // Y 轴 (带网格线)
  const yAxis = d3.axisLeft(yScale).ticks(5);
  const yAxisGroup = svg.append("g")
      .call(yAxis)
      .style("font-family", "Noto Serif SC")
      .style("color", "#5a4a42");

  // 移除 Y 轴的竖线，只保留刻度文字，更干净
  yAxisGroup.select(".domain").remove();

  // 添加水平网格线
  svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat("")
      )
      .style("stroke-dasharray", "3 3")
      .style("stroke-opacity", 0.1)
      .select(".domain").remove();

  // Y轴 标题
  svg.append("text")
      .attr("x", -30)
      .attr("y", -15)
      .text("数量指数")
      .style("font-size", "12px")
      .style("fill", "#8b4513")
      .style("font-weight", "bold");

  // 7. 静态图例 (直接显示在上方，不再需要悬停)
  const legend = svg.append("g")
      .attr("transform", `translate(20, -25)`);

  keys.forEach((key, i) => {
    const legendRow = legend.append("g")
        .attr("transform", `translate(${i * 100}, 0)`);

    legendRow.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", color(key))
        .attr("rx", 2);

    legendRow.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .text(key)
        .style("font-size", "12px")
        .style("fill", "#5a4a42");
  });

  // 8. 交互辅助线 (保持)
  const verticalLine = svg.append("line")
      .attr("stroke", "#5a4a42")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 4")
      .style("opacity", 0);

  // 悬停提示框 (Tooltip)
  const tooltip = d3.select(chartRef.value)
      .append("div")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("background", "rgba(255, 255, 255, 0.95)")
      .style("padding", "10px")
      .style("border", "1px solid #d4a76a")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)");

  svg.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", function(event) {
        const [x] = d3.pointer(event);
        const year = Math.round(xScale.invert(x));

        // 限制范围
        if(year < 1990 || year > 2023) return;

        verticalLine
            .attr("x1", xScale(year))
            .attr("x2", xScale(year))
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .style("opacity", 0.5);

        // 找到当年数据
        const d = data.find(item => item.year === year);
        if (d) {
          let html = `<strong>${year}年</strong><br/>`;
          keys.forEach(k => {
            html += `<span style="color:${color(k)}">●</span> ${k}: ${d[k]}<br/>`;
          });

          tooltip.html(html)
              .style("opacity", 1)
              .style("left", (event.offsetX + 15) + "px")
              .style("top", (event.offsetY) + "px");
        }
      })
      .on("mouseout", () => {
        verticalLine.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
};

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) return;
      drawChart();
    });
  });
  if (chartRef.value) resizeObserver.observe(chartRef.value);
});

onUnmounted(() => {
  if (resizeObserver && chartRef.value) resizeObserver.unobserve(chartRef.value);
});
</script>

<style scoped>
.d3-stream-container {
  width: 100%;
  height: 100%;
  min-height: 1px;
  background: radial-gradient(circle, #ffffff 0%, #f4f4f4 100%);
  border-radius: 12px;
  position: relative; /* 为 tooltip 定位 */
}
</style>