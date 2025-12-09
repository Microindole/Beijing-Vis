<template>
    <div class="d3-stream-container" ref="chartRef"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

const chartRef = ref(null);
let resizeObserver = null;

const generateData = () => {
    const data = [];
    const keys = ["本体修缮", "安防监测", "环境整治", "数字展示"];

    for (let year = 1990; year <= 2023; year++) {
        // 模拟数据：早期重修缮，中期重环境，后期重数字
        let repair = 20 + Math.sin(year * 0.1) * 5;
        let security = 10 + (year - 1990) * 0.5;
        let env = year > 2000 ? (year - 2000) * 1.2 : 5;
        let digital = year > 2010 ? (year - 2010) * 2 : 0;

        if (year === 2003) env += 20; // 申遗成功年

        data.push({
            year: year,
            "本体修缮": Math.floor(repair),
            "安防监测": Math.floor(security),
            "环境整治": Math.floor(env),
            "数字展示": Math.floor(digital),
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

    const margin = { top: 20, right: 20, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const stack = d3.stack().keys(keys).offset(d3.stackOffsetSilhouette).order(d3.stackOrderNone);
    const stackedData = stack(data);

    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, innerWidth]);
    const yScale = d3.scaleLinear()
        .domain([-d3.max(stackedData, layer => d3.max(layer, d => d[1])), d3.max(stackedData, layer => d3.max(layer, d => d[1]))])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(["#8B4513", "#CD853F", "#556B2F", "#4682B4"]);

    const area = d3.area()
        .x(d => xScale(d.data.year))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]))
        .curve(d3.curveBasis);

    svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("d", area)
        .style("fill", d => color(d.key))
        .style("opacity", 0.9);

    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(5))
        .style("color", "#5a4a42")
        .select(".domain").remove();

    // 图例
    const legend = svg.append("g").attr("transform", `translate(0, -10)`);
    keys.forEach((key, i) => {
        const row = legend.append("g").attr("transform", `translate(${i * 90}, 0)`);
        row.append("rect").attr("width", 10).attr("height", 10).attr("fill", color(key));
        row.append("text").attr("x", 15).attr("y", 9).text(key).style("font-size", "10px").style("fill", "#5a4a42");
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