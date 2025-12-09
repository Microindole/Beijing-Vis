<template>
    <div class="d3-sunburst-container" ref="chartRef">
        <div class="center-label" v-if="centerNode">
            <div class="label-name">{{ centerNode.data.name }}</div>
            <div class="label-value">{{ centerNode.value }}人</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

const sunburstData = {
    name: "客源构成",
    children: [
        {
            name: "国内游客",
            children: [
                { name: "北京周边", value: 3500 },
                { name: "长三角", value: 2000 },
                { name: "珠三角", value: 1500 },
                { name: "其他省份", value: 2500 }
            ]
        },
        {
            name: "入境游客",
            children: [
                { name: "日韩", value: 800 },
                { name: "东南亚", value: 600 },
                { name: "欧美", value: 1200 },
                { name: "其他", value: 400 }
            ]
        },
        {
            name: "特殊群体",
            children: [
                { name: "研学团", value: 1500 },
                { name: "徒步爱好者", value: 1000 }
            ]
        }
    ]
};

const chartRef = ref(null);
const centerNode = ref(null);
let resizeObserver = null;

const drawChart = () => {
    if (!chartRef.value) return;
    const width = chartRef.value.offsetWidth;
    const height = chartRef.value.offsetHeight;
    if (width <= 0 || height <= 0) return;

    d3.select(chartRef.value).select("svg").remove();

    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal().range(["#8b4513", "#d4a76a", "#a0522d", "#bfa46f", "#5a4a42"]);

    const root = d3.hierarchy(sunburstData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.partition().size([2 * Math.PI, radius])(root);
    root.each(d => d.current = d);
    centerNode.value = root;

    const arc = d3.arc()
        .startAngle(d => d.x0).endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0).outerRadius(d => d.y1 - 1);

    const svg = d3.select(chartRef.value).append("svg")
        .attr("width", width).attr("height", height)
        .append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const path = svg.append("g").selectAll("path")
        .data(root.descendants().filter(d => d.depth))
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
        .attr("d", d => arc(d.current))
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title").text(d => `${d.data.name}\n${d.value}`);

    function clicked(event, p) {
        path.transition().duration(750).attrTween("d", d => () => arc(d.current));
    }

    function arcVisible(d) { return d.y1 <= radius && d.y0 >= 0 && d.x1 > d.x0; }
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
.d3-sunburst-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(circle, #fffbf0 0%, #eaddcf 100%);
    border-radius: 12px;
}

.center-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
}

.label-name {
    font-size: 14px;
    font-weight: bold;
    color: #8b4513;
}

.label-value {
    font-size: 12px;
    color: #5a4a42;
}
</style>