<template>
  <div class="profile-wrapper">
    <div class="header">
      <div class="title-group">
        <h3>中轴形胜 · 山水剖面</h3>
        <span class="sub">Elevation Profile: The Royal Axis</span>
      </div>
      <div class="legend-icons">
        <span class="icon-item"><i class="dot mountain"></i> 实体</span>
        <span class="icon-item"><i class="dot water"></i> 水面</span>
      </div>
    </div>

    <div ref="chartContainer" class="chart-container"></div>

    <transition name="fade">
      <div class="info-panel" v-if="activeData" :style="panelStyle">
        <div class="panel-header">{{ activeData.name }}</div>
        <div class="panel-row">
          <span>海拔</span>
          <span class="num">{{ activeData.elevation }}m</span>
        </div>
        <div class="panel-row">
          <span>距南起点</span>
          <span class="num">{{ activeData.distance }}m</span>
        </div>
        <div class="panel-type">{{ typeMap[activeData.type] || '景点' }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import * as d3 from 'd3';

// --- 数据准备 ---
const landscapeData = [
  {distance: 0, elevation: 6, name: "南湖岛", type: "island"},
  {distance: 100, elevation: 5, name: "十七孔桥", type: "bridge"},
  {distance: 200, elevation: 0, name: "昆明湖面", type: "water"},
  {distance: 700, elevation: 0, name: "湖中", type: "water"},
  {distance: 1000, elevation: 4, name: "云辉玉宇", type: "arch"},
  {distance: 1050, elevation: 8, name: "排云门", type: "gate"},
  {distance: 1100, elevation: 25, name: "排云殿", type: "hall"},
  {distance: 1130, elevation: 40, name: "德辉殿", type: "hall"},
  {distance: 1150, elevation: 60, name: "佛香阁", type: "pagoda"},
  {distance: 1180, elevation: 55, name: "众香界", type: "arch"},
  {distance: 1200, elevation: 58, name: "智慧海", type: "temple"},
  {distance: 1300, elevation: 30, name: "后山林地", type: "forest"},
  {distance: 1500, elevation: 5, name: "苏州街", type: "market"},
  {distance: 1600, elevation: 2, name: "后溪河", type: "water"}
];

const typeMap = {
  island: "蓬莱仙岛", bridge: "长桥卧波", water: "浩渺烟波",
  arch: "牌楼", gate: "宫门", hall: "殿宇",
  pagoda: "高阁", temple: "佛殿", forest: "松柏苍翠", market: "水街"
};

const chartContainer = ref(null);
const activeData = ref(null);
const cursorX = ref(0); // 用于定位 tooltip
let resizeObserver = null;
let animationId;

// 计算 Tooltip 位置：智能防溢出
const panelStyle = computed(() => {
  if (!chartContainer.value) return {};
  const containerWidth = chartContainer.value.offsetWidth;
  // 如果靠右，Tooltip 向左展示
  const leftPos = cursorX.value > containerWidth / 2
      ? cursorX.value - 140
      : cursorX.value + 20;
  return {
    left: leftPos + 'px',
    top: '60px'
  };
});

const drawChart = () => {
  if (!chartContainer.value) return;

  // 1. 清理
  d3.select(chartContainer.value).selectAll("*").remove();

  // 2. 尺寸与初始化
  const width = chartContainer.value.offsetWidth;
  const height = 320;
  const margin = {top: 60, right: 30, bottom: 40, left: 40};

  const svg = d3.select(chartContainer.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible"); // 允许光晕溢出

  // 3. 比例尺
  const x = d3.scaleLinear()
      .domain([0, 1600])
      .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
      .domain([0, 70]) // 稍微留白
      .range([height - margin.bottom, margin.top]);

  // 4. 定义滤镜和渐变 (关键美化步骤)
  const defs = svg.append("defs");

  // 4.1 青绿山水渐变
  const paintGradient = defs.append("linearGradient")
      .attr("id", "paintGrad")
      .attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "1");
  paintGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3a6c4f"); // 深绿
  paintGradient.append("stop").attr("offset", "40%").attr("stop-color", "#6a996a"); // 浅绿
  paintGradient.append("stop").attr("offset", "100%").attr("stop-color", "#f5f2e9").attr("stop-opacity", 0); // 融入背景

  // 4.2 倒影遮罩渐变 (让倒影逐渐消失)
  const maskGradient = defs.append("linearGradient")
      .attr("id", "maskGrad")
      .attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "1");
  maskGradient.append("stop").attr("offset", "0%").attr("stop-color", "white").attr("stop-opacity", 0.4);
  maskGradient.append("stop").attr("offset", "100%").attr("stop-color", "white").attr("stop-opacity", 0);

  // 4.3 辉光滤镜 (给山脊线加光)
  const filter = defs.append("filter").attr("id", "glow");
  filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // 5. 绘制倒影 (Reflection) - 增加模糊和透明度
  const areaReflect = d3.area()
      .x(d => x(d.distance))
      .y0(height - margin.bottom)
      .y1(d => height - margin.bottom + (height - margin.bottom - y(d.elevation)) * 0.5) // 倒影变短
      .curve(d3.curveMonotoneX);

  svg.append("path")
      .datum(landscapeData)
      .attr("d", areaReflect)
      .style("fill", "#6a996a") // 倒影基础色
      .style("mask", "url(#maskGrad)") // 应用遮罩让底部透明
      .style("filter", "blur(2px)"); // 高斯模糊

  // 6. 绘制实体山脉 (Mountain Body)
  const area = d3.area()
      .x(d => x(d.distance))
      .y0(height - margin.bottom)
      .y1(d => y(d.elevation))
      .curve(d3.curveMonotoneX);

  svg.append("path")
      .datum(landscapeData)
      .attr("d", area)
      .style("fill", "url(#paintGrad)");

  // 7. 绘制山脊线 (Ridge Line) - 金色描边
  const line = d3.line()
      .x(d => x(d.distance))
      .y(d => y(d.elevation))
      .curve(d3.curveMonotoneX);

  svg.append("path")
      .datum(landscapeData)
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#d4a76a") // 帝王金
      .style("stroke-width", 2)
      .style("filter", "url(#glow)"); // 发光效果

  // 8. 绘制水面基准线
  svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", height - margin.bottom)
      .attr("y2", height - margin.bottom)
      .style("stroke", "#a8d8ea")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "5,5");

  // 9. 关键景点标记 (Interactivity)
  // 只标记海拔 > 5 的点，避免拥挤
  const points = landscapeData.filter(d => d.elevation > 5);

  const dotsGroup = svg.selectAll(".dot-group")
      .data(points)
      .enter().append("g")
      .attr("transform", d => `translate(${x(d.distance)}, ${y(d.elevation)})`);

  // 外圈呼吸光环
  dotsGroup.append("circle")
      .attr("r", 0)
      .style("fill", "none")
      .style("stroke", "#d4a76a")
      .style("stroke-opacity", 0.5)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("r", 8)
      .style("stroke-opacity", 0)
      .on("end", function repeat() {
        d3.select(this)
            .attr("r", 0)
            .style("stroke-opacity", 0.5)
            .transition()
            .duration(1500)
            .attr("r", 8)
            .style("stroke-opacity", 0)
            .on("end", repeat);
      });

  // 实心点
  dotsGroup.append("circle")
      .attr("r", 3)
      .style("fill", "#fff")
      .style("stroke", "#d4a76a")
      .style("stroke-width", 2);

  // 10. 交互层 (Overlay)
  // 添加一条垂直指示线
  const focusLine = svg.append("line")
      .style("stroke", "#5d4037")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0)
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        // 边界检查
        if (mx < margin.left || mx > width - margin.right) return;

        const xVal = x.invert(mx);
        const bisect = d3.bisector(d => d.distance).center;
        const i = bisect(landscapeData, xVal);

        if (i < landscapeData.length) {
          const d = landscapeData[i];
          activeData.value = d;
          cursorX.value = x(d.distance);

          // 移动指示线
          focusLine
              .attr("x1", x(d.distance))
              .attr("x2", x(d.distance))
              .style("opacity", 0.5);
        }
      })
      .on("mouseleave", () => {
        activeData.value = null;
        focusLine.style("opacity", 0);
      });
};

onMounted(() => {
  drawChart();
  // 使用 ResizeObserver 解决布局跑偏问题
  resizeObserver = new ResizeObserver(() => {
    // 简单的防抖
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(drawChart);
  });
  if (chartContainer.value) resizeObserver.observe(chartContainer.value);
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.profile-wrapper {
  width: 100%;
  height: 100%; /* 填满父容器 */
  position: relative;
  /* 仿古米纸纹理背景 */
  background-color: #fdfbf7;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a76a' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
  border-radius: 8px;
  overflow: hidden; /* 防止溢出 */
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 15px 20px 0;
  z-index: 5;
}

.title-group h3 {
  margin: 0;
  font-size: 18px;
  color: #5d4b4b; /* 赭石色标题 */
  font-family: "Noto Serif SC", serif;
  font-weight: bold;
}

.sub {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.legend-icons {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #666;
}

.icon-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.dot.mountain {
  background: #3a6c4f;
}

.dot.water {
  background: #a8d8ea;
}

.chart-container {
  flex: 1; /* 自动占据剩余高度 */
  width: 100%;
  min-height: 250px;
}

/* 悬浮面板：现代毛玻璃 + 中式边框 */
.info-panel {
  position: absolute;
  width: 120px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #d4a76a;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(93, 75, 75, 0.15);
  pointer-events: none; /* 让鼠标穿透，不阻挡 d3 事件 */
  transition: left 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 平滑跟随 */
  z-index: 10;
}

.panel-header {
  font-weight: bold;
  color: #5d4b4b;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
  margin-bottom: 6px;
  text-align: center;
  font-family: "Noto Serif SC", serif;
}

.panel-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #777;
  margin-bottom: 2px;
}

.panel-row .num {
  color: #3a6c4f;
  font-family: monospace;
  font-weight: bold;
}

.panel-type {
  margin-top: 6px;
  font-size: 10px;
  text-align: right;
  color: #d4a76a;
  font-style: italic;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>