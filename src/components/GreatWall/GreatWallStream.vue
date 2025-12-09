<template>
    <div class="d3-stream-container" ref="chartRef"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

const chartRef = ref(null);
let resizeObserver = null;

// 模拟长城学术研究演变数据
const generateData = () => {
    const data = [];
    const keys = ["考古发现", "保护修缮", "历史研究", "数字化"];

    for (let year = 1990; year <= 2023; year++) {
        let archeology = 10 + (year - 1990) * 1.5;
        let protection = 15 + (year - 1990) * 2;
        let history = 20 + (year - 1990) * 1;
        let digital = year > 2010 ? (year - 2010) * 3 : 2;

        // 历史节点模拟
        if (year === 1987) { protection += 50; } // 申遗成功
        if (year === 2006) { protection += 60; } // 长城保护条例
        if (year === 2012) { archeology += 40; } // 长度认定
        if (year >= 2016) { digital += 20; } // 数字长城

        data.push({
            year: year,
            "考古发现": Math.floor(archeology + Math.random() * 5),
            "保护修缮": Math.floor(protection + Math.random() * 10),
            "历史研究": Math.floor(history + Math.random() * 5),
            "数字化": Math.floor(digital + Math.random() * 5),
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

    const margin = { top: 40, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const stack = d3.stack()
        .keys(keys)
        .offset(d3.stackOffsetNone)
        .order(d3.stackOrderNone);

    const stackedData = stack(data);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    const maxY = d3.max(stackedData, layer => d3.max(layer, d => d[1]));
    const yScale = d3.scaleLinear()
        .domain([0, maxY * 1.1])
        .range([innerHeight, 0]);

    // 长城主题色
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#8b4513", "#d4a76a", "#5a4a42", "#bfa46f"]);

    const area = d3.area()
        .x(d => xScale(d.data.year))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveMonotoneX);

    svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("d", area)
        .style("fill", d => color(d.key))
        .style("opacity", 0.9)
        .style("stroke", "#fff")
        .style("stroke-width", 0.5);

    // X轴
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(8))
        .style("color", "#5a4a42");

    // Y轴
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .style("color", "#5a4a42");

    // 图例
    const legend = svg.append("g").attr("transform", `translate(20, -25)`);
    keys.forEach((key, i) => {
        const row = legend.append("g").attr("transform", `translate(${i * 100}, 0)`);
        row.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(key));
        row.append("text").attr("x", 18).attr("y", 10).text(key).style("font-size", "12px").style("fill", "#5a4a42");
    });
};

onMounted(() => {
    resizeObserver = new ResizeObserver(() => drawChart());
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
}
</style>