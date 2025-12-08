<template>
    <div class="galaxy-container" ref="galaxyRef">
        <div class="hint-text">拖动节点探索 • 悬停查看详情</div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

// 长城星系数据
const rawData = {
    name: "长城",
    type: "root",
    children: [
        {
            name: "军事防御智慧",
            type: "category",
            children: [
                { name: "烽火台(信息传递)", type: "detail" },
                { name: "空心敌楼(戚继光)", type: "detail" },
                { name: "关隘瓮城", type: "detail" },
                { name: "因地制宜(险要)", type: "detail" },
                { name: "防御体系典范", type: "detail" }
            ]
        },
        {
            name: "世界文化遗产",
            type: "category",
            children: [
                { name: "1987年列入名录", type: "detail" },
                { name: "世界七大奇迹", type: "detail" },
                { name: "人类工程杰作", type: "detail" },
                { name: "全球保护共识", type: "detail" }
            ]
        },
        {
            name: "历史与传说",
            type: "category",
            children: [
                { name: "秦始皇统一修筑", type: "detail" },
                { name: "孟姜女哭长城", type: "detail" },
                { name: "明代大修", type: "detail" },
                { name: "山海关大战", type: "detail" },
                { name: "不到长城非好汉", type: "detail" }
            ]
        },
        {
            name: "文化符号",
            type: "category",
            children: [
                { name: "中华民族脊梁", type: "detail" },
                { name: "国歌中的长城", type: "detail" },
                { name: "和平的守护者", type: "detail" },
                { name: "坚韧不拔精神", type: "detail" }
            ]
        },
        {
            name: "国际影响力",
            type: "category",
            children: [
                { name: "尼克松访华游览", type: "detail" },
                { name: "各国元首打卡地", type: "detail" },
                { name: "好莱坞电影元素", type: "detail" },
                { name: "国际马拉松", type: "detail" }
            ]
        }
    ]
};

const galaxyRef = ref(null);
let simulation = null;

const drawGalaxy = () => {
    if (!galaxyRef.value) return;
    d3.select(galaxyRef.value).selectAll("*").remove();

    const width = galaxyRef.value.offsetWidth;
    const height = galaxyRef.value.offsetHeight || 400;

    // 长城主题色系：金、棕、红
    const colorScale = d3.scaleOrdinal()
        .domain(["root", "category", "detail"])
        .range(["#8b4513", "#bfa46f", "#d4a76a"]);

    const root = d3.hierarchy(rawData);
    const nodes = root.descendants();
    const links = root.links();

    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .distance(d => d.target.data.type === 'detail' ? 30 : 60)
        )
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.data.type === 'detail' ? 18 : 50)).iterations(3));

    const svg = d3.select(galaxyRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", (event) => {
            g.attr("transform", event.transform);
        }))
        .append("g");

    const g = svg.append("g");

    const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#d4a76a")
        .attr("stroke-width", d => d.target.data.type === 'category' ? 2 : 1)
        .attr("stroke-opacity", 0.6);

    const node = g.append("g")
        .selectAll(".node")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("r", d => {
            if (d.data.type === 'root') return 45;
            if (d.data.type === 'category') return 30;
            return 6;
        })
        .attr("fill", d => {
            if (d.data.type === 'category') return "#bfa46f";
            if (d.data.type === 'detail') return "#8b4513";
            return "#a0522d";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", d => d.data.type === 'root' ? 3 : 1.5)
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(200)
                .attr("transform", d.data.type === 'detail' ? "scale(2)" : "scale(1.1)");

            if (d.data.type === 'detail') {
                const group = d3.select(this.parentNode);
                group.select("rect").style("opacity", 1);
                group.select("text").style("opacity", 1).style("font-weight", "bold");
                group.raise();
            }
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition().duration(200).attr("transform", "scale(1)");
            if (d.data.type === 'detail') {
                const group = d3.select(this.parentNode);
                group.select("rect").style("opacity", 0);
                group.select("text").style("opacity", 0);
            }
        });

    node.filter(d => d.data.type !== 'detail')
        .append("text")
        .text(d => d.data.name)
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .style("fill", "#fff")
        .style("font-size", d => d.data.type === 'root' ? "14px" : "11px")
        .style("pointer-events", "none")
        .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)");

    node.filter(d => d.data.type === 'detail')
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", d => d.data.name.length * 12 + 10)
        .attr("height", 20)
        .attr("x", 8)
        .attr("y", -10)
        .attr("fill", "#8b4513")
        .attr("stroke", "#fff")
        .style("opacity", 0)
        .style("pointer-events", "none");

    node.filter(d => d.data.type === 'detail')
        .append("text")
        .text(d => d.data.name)
        .attr("x", 13)
        .attr("dy", 4)
        .style("font-size", "11px")
        .style("fill", "#fff")
        .style("opacity", 0)
        .style("pointer-events", "none");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
};

onMounted(() => {
    window.requestAnimationFrame(() => {
        drawGalaxy();
    });
    window.addEventListener("resize", drawGalaxy);
});

onUnmounted(() => {
    window.removeEventListener("resize", drawGalaxy);
    if (simulation) simulation.stop();
});
</script>

<style scoped>
.galaxy-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background: radial-gradient(circle at center, #fffbf0 0%, #eaddcf 100%);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
    cursor: grab;
}

.galaxy-container:active {
    cursor: grabbing;
}

.hint-text {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 12px;
    color: #8b4513;
    pointer-events: none;
    z-index: 10;
    background: rgba(255, 255, 255, 0.6);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #bfa46f;
}
</style>