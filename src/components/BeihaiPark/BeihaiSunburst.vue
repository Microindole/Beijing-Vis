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

// 模拟层级数据
const sunburstData = {
  name: "客源构成",
  children: [
    {
      name: "本地高频客", // 北海公园的独特特征：大量持年票的本地大爷大妈
      children: [
        { name: "老年晨练(年票)", value: 3200 }, // 核心群体：踢毽子、写地书
        { name: "亲子周末游", value: 1500 },     // 划船主力
        { name: "摄影/汉服爱好者", value: 800 }  // 也是本地为主
      ]
    },
    {
      name: "国内游客",
      children: [
        {
          name: "京津冀周边",
          children: [
            { name: "天津", value: 600 },
            { name: "河北", value: 550 }
          ]
        },
        {
          name: "长途旅行",
          children: [
            { name: "华东(江浙沪)", value: 900 }, // 园林对比游
            { name: "华南(广东)", value: 700 },
            { name: "其他省份", value: 1200 }
          ]
        }
      ]
    },
    {
      name: "入境/研学",
      children: [
        { name: "外国专家/团队", value: 350 }, // 对皇家园林感兴趣的深度游
        { name: "高校研学团", value: 600 },    // 建筑系、历史系学生
        { name: "港澳台同胞", value: 400 }
      ]
    }
  ]
};

const chartRef = ref(null);
const centerNode = ref(null); // 用于显示的中心节点数据
let resizeObserver = null;

const drawChart = () => {
  if (!chartRef.value) return;
  const width = chartRef.value.offsetWidth;
  const height = chartRef.value.offsetHeight;
  if (width <= 0 || height <= 0) return;

  d3.select(chartRef.value).select("svg").remove();

  const radius = Math.min(width, height) / 2;

  // 颜色映射
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, sunburstData.children.length + 1));
  const customColor = d3.scaleOrdinal()
      .range(["#8b4513", "#d4a76a", "#3a6c4f", "#b3cbb9", "#c0a16c", "#5d4037"]);

  // 数据层级化
  const root = d3.hierarchy(sunburstData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

  // 分区布局
  const partition = d3.partition()
      .size([2 * Math.PI, radius]);

  partition(root);

  // 【核心修复】必须在绘图前初始化 d.current
  root.each(d => d.current = d);

  // 初始中心显示根节点数据
  centerNode.value = root;

  // 弧生成器
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

  // 绘制路径
  const path = svg.append("g")
      .selectAll("path")
      .data(root.descendants().filter(d => d.depth)) // 不绘制根节点圆心
      .join("path")
      .attr("fill", d => {
        while (d.depth > 1) d = d.parent;
        return customColor(d.data.name);
      })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
      .attr("d", d => arc(d.current))
      .style("cursor", "pointer")
      .on("click", clicked)
      .on("mouseover", function(event, d) {
        d3.select(this).style("fill-opacity", 1);
        centerNode.value = d; // 悬停时更新中间文字
      })
      .on("mouseout", function(event, d) {
        d3.select(this).style("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0);
        // 可选：鼠标移出恢复显示当前下钻的根节点，或者保持最后悬停的
        // centerNode.value = root;
      });

  path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d.value}`);

  // 绘制文字 (Pointer events设为none，防止遮挡点击)
  const label = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
      .join("text")
      .attr("transform", d => labelTransform(d.current))
      .attr("fill-opacity", d => +labelVisible(d.current))
      .style("font-size", "10px")
      .style("fill", "#fff")
      .text(d => d.data.name);

  // 点击下钻逻辑
  function clicked(event, p) {
    // 更新视图的根节点引用，用于可能的逻辑判断
    // root = p;

    path.transition().duration(750).tween("data", d => {
      const i = d3.interpolate(d.current, p);
      return t => d.current = i(t);
    })
        .attrTween("d", d => () => arc(d.current))
        .attrTween("fill-opacity", d => () => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0);

    label.transition().duration(750)
        .attrTween("transform", d => () => labelTransform(d.current))
        .attrTween("fill-opacity", d => () => +labelVisible(d.current));
  }

  function arcVisible(d) {
    // 增加安全检查，防止动画过程中可能的计算误差导致 undefined
    if (!d) return false;
    return d.y1 <= radius && d.y0 >= 0 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    if (!d) return false;
    return d.y1 <= radius && d.y0 >= 0 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    if (!d) return "translate(0,0)";
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }
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
.d3-sunburst-container {
  width: 100%;
  height: 100%;
  min-height: 1px;
  position: relative;
  background: radial-gradient(circle, #fcf8f2 0%, #f7f1e3 100%);
  border-radius: 12px;
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
  color: #8b4513;
  font-weight: bold;
}
.label-value {
  font-size: 12px;
  color: #5a4a42;
}
</style>