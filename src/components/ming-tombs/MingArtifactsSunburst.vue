<template>
    <div class="sunburst-wrapper">
        <div class="d3-sunburst-container" ref="chartRef">
            <div class="center-label">
                <div class="label-name">{{ currentName }}</div>
                <div class="label-value">{{ currentValue }}件</div>
            </div>
        </div>

        <div class="legend-container">
            <div v-for="(item, index) in legendData" :key="index" class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-text">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

// 1. 定陵文物数据
const sunburstData = {
    name: "定陵文物",
    children: [
        {
            name: "金银器",
            children: [
                { name: "金冠", value: 4 },
                { name: "金锭", value: 103 },
                { name: "金爵/盆", value: 50 },
                { name: "银锭", value: 65 },
                { name: "银器", value: 85 }
            ]
        },
        {
            name: "丝织品",
            children: [
                { name: "龙袍", value: 12 },
                { name: "匹料", value: 177 },
                { name: "衣冠", value: 120 },
                { name: "织锦", value: 180 }
            ]
        },
        {
            name: "玉石器",
            children: [
                { name: "玉带", value: 10 },
                { name: "玉佩", value: 40 },
                { name: "宝石", value: 80 },
                { name: "玉圭", value: 8 }
            ]
        },
        {
            name: "其他",
            children: [
                { name: "瓷器", value: 16 },
                { name: "三彩俑", value: 40 },
                { name: "木器", value: 30 }
            ]
        }
    ]
};

// 2. 颜色映射 (明代皇家色系)
const colorMap = {
    "金银器": "#D4A76A", // 金色
    "丝织品": "#B26F4A", // 红色
    "玉石器": "#9C7C5C", // 青色/石色
    "其他": "#8B4513"    // 深褐色
};

// 生成图例数据
const legendData = Object.keys(colorMap).map(key => ({
    name: key,
    color: colorMap[key]
}));

const chartRef = ref(null);
const currentName = ref("定陵文物总计");
const currentValue = ref(0); // 初始化为0，后面计算
let resizeObserver = null;

const drawChart = () => {
    if (!chartRef.value) return;
    const width = chartRef.value.offsetWidth;
    const height = chartRef.value.offsetHeight;
    if (width <= 0 || height <= 0) return;

    d3.select(chartRef.value).select("svg").remove();

    // 留出边距，避免被切断
    const margin = 20;
    const radius = (Math.min(width, height) - margin * 2) / 2;

    const colorScale = d3.scaleOrdinal()
        .domain(Object.keys(colorMap))
        .range(Object.values(colorMap));

    // 数据层级化
    const root = d3.hierarchy(sunburstData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // 初始化总数
    currentValue.value = root.value;

    d3.partition().size([2 * Math.PI, radius])(root);

    root.each(d => d.current = d);

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    const svg = d3.select(chartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().filter(d => d.depth)) // 不绘制根节点圆心
        .join("path")
        .attr("fill", d => {
            // 向上寻找父节点以确定颜色归属
            let ancestor = d;
            while (ancestor.depth > 1) ancestor = ancestor.parent;
            return colorMap[ancestor.data.name] || "#ccc";
        })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
        .attr("d", d => arc(d.current))
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
            // 悬停时更新中心文字
            currentName.value = d.data.name;
            currentValue.value = d.value;
            d3.select(event.currentTarget).attr("fill-opacity", 1);
        })
        .on("mouseout", (event, d) => {
            // 移出时恢复总数（可选）或保持最后状态
            // currentName.value = "定陵文物总计";
            // currentValue.value = root.value;
            d3.select(event.currentTarget).attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0);
        })
        .on("click", clicked);

    // 简单的 title 提示
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join(" > ")}\n数量: ${d.value}`);

    function clicked(event, p) {
        path.transition().duration(750).attrTween("d", d => {
            const i = d3.interpolate(d.current, p);
            return t => {
                d.current = i(t);
                return arc(d.current);
            };
        });

        // 点击下钻后，更新中心文字为当前根节点
        currentName.value = p.data.name;
        currentValue.value = p.value;
    }

    function arcVisible(d) {
        return d.y1 <= radius && d.y0 >= 0 && d.x1 > d.x0;
    }
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
.sunburst-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    /* padding-bottom: 20px; 移除底部 padding，让图表尽可能大 */
}

.d3-sunburst-container {
    flex: 1;
    /* 占据大部分空间 */
    width: 100%;
    position: relative;
    min-height: 0;
    /* 防止 flex 子项溢出 */
}

.center-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 10;
}

.label-name {
    font-size: 14px;
    font-weight: bold;
    color: #8b4513;
    margin-bottom: 2px;
}

.label-value {
    font-size: 12px;
    color: #5a4a42;
}

/* 图例样式 */
.legend-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 10px 0;
    /* 上下留点空隙 */
    /* background: rgba(255,255,255,0.5); */
    /* 移除背景色，更干净 */
    border-radius: 0 0 12px 12px;
    flex-shrink: 0;
    /* 防止图例被压缩 */
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.legend-color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    /* 圆形图例更柔和 */
    display: inline-block;
}

.legend-text {
    font-size: 11px;
    color: #5a4a42;
}
</style>