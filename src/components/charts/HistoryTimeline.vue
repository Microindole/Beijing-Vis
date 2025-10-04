<template>
  <div class="timeline-container">
    <div class="chart-title">
      <h3>北京历史年轮</h3>
      <p>点击环上朝代可展开详情。当前视图：{{ focusedDynasty ? focusedDynasty.dynasty : '全局' }}</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
    <div ref="tooltip" class="tooltip" style="opacity: 0;"></div>

    <div v-if="selectedEvent" class="details-panel-overlay" @click.self="selectedEvent = null">
      <div class="details-panel">
        <button @click="selectedEvent = null" class="close-btn">&times;</button>
        <h3>{{ selectedEvent.period_name }}</h3>
        <span class="category-badge" :style="{ backgroundColor: getDynastyColor(selectedEvent.period_name) }">
          {{ selectedEvent.category }}
        </span>
        <div class="details-content">
          <p><strong>时期:</strong> {{ selectedEvent.startDate }}年 ~ {{ selectedEvent.endDate }}年</p>
          <p><strong>摘要:</strong> {{ selectedEvent.summary }}</p>
          <hr>
          <p class="full-text"><strong>原文:</strong> {{ selectedEvent.full_text }}</p>
          <p class="source"><em><strong>出处:</strong> {{ selectedEvent.source }}</em></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const chartContainer = ref(null);
const tooltip = ref(null);
const selectedEvent = ref(null);
const focusedDynasty = ref(null);

const dynasties = ref([]);
const color = ref(() => 'gray');

const getDynastyColor = (dynastyName) => color.value(dynastyName);

const aggregateData = (flatData) => {
  const dynastyOrder = [
    '夏商周',
    '秦汉三国时期',
    '两晋南北朝',
    '隋唐五代',
    '宋辽金时期',
    '元',
    '明',
    '清',
    '民国',
    '现代'
  ];

  const grouped = d3.group(flatData, d => d.period_name);

  const aggregated = Array.from(grouped, ([key, value]) => ({
    dynasty: key,
    eventCount: value.length,
    events: value.sort((a, b) => a.startDate - b.startDate),
    startYear: d3.min(value, d => d.startDate),
    endYear: d3.max(value, d => d.endDate),
  }));

  aggregated.sort((a, b) => dynastyOrder.indexOf(a.dynasty) - dynastyOrder.indexOf(b.dynasty));

  return aggregated;
};


const createVisualization = (aggregatedData) => {
  if (!chartContainer.value) return;
  d3.select(chartContainer.value).selectAll('*').remove();

  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = chartContainer.value.clientWidth - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const svg = d3.select(chartContainer.value).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  const mainGroup = svg.append("g")
      .attr("transform", `translate(${(width / 2) + margin.left}, ${(height / 2) + margin.top})`);

  dynasties.value = aggregatedData.map(d => d.dynasty);
  color.value = d3.scaleOrdinal(d3.schemeTableau10).domain(dynasties.value);

  function drawRadialOverview() {
    mainGroup.selectAll("*").remove();
    const radius = Math.min(width, height) / 2 * 0.8;

    const pie = d3.pie().value(d => d.eventCount).sort(null);
    const pieData = pie(aggregatedData);

    const dynastyArc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.85);
    const eventArc = d3.arc().innerRadius(radius * 0.87).outerRadius(radius * 0.95);

    const radialGroup = mainGroup.append("g").attr("class", "radial-content");

    radialGroup.append("g").selectAll("path")
        .data(pieData, d => d.data.dynasty)
        .join("path")
        .attr("d", dynastyArc)
        .attr("fill", d => color.value(d.data.dynasty))
        .attr("stroke", "#FFFFFF").style("stroke-width", "2px")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          focusedDynasty.value = d.data;
          drawDetailView(d.data);
        });

    radialGroup.append("g").selectAll("g")
        .data(pieData, d => d.data.dynasty)
        .join("g")
        .selectAll("path")
        .data(d => {
          const angleSpan = d.endAngle - d.startAngle;
          const eventAngleWidth = d.data.events.length > 0 ? angleSpan / d.data.events.length : 0;
          const gap = eventAngleWidth * 0.15;
          return d.data.events.map((event, i) => ({
            ...event,
            startAngle: d.startAngle + i * eventAngleWidth,
            endAngle: d.startAngle + (i + 1) * eventAngleWidth - gap,
          }));
        }, d => d.id)
        .join("path")
        .attr("d", eventArc)
        .attr("fill", d => d.category === '建制沿革' ? '#5B8FF9' : '#F6BD16')
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          const hoverArc = d3.arc().innerRadius(radius * 0.87).outerRadius(radius * 1.05);
          d3.select(this).transition().duration(200).attr("d", hoverArc);
          d3.select(tooltip.value).style("opacity", 0.9).html(`<strong>${d.period_name}</strong><br>${d.summary}`);
        })
        .on("mousemove", (event) => {
          d3.select(tooltip.value).style("left", `${event.pageX + 15}px`).style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
          d3.select(this).transition().duration(200).attr("d", eventArc);
          d3.select(tooltip.value).style("opacity", 0);
        })
        .on("click", (event, d) => {
          event.stopPropagation();
          selectedEvent.value = d;
        });

    const labelGroup = mainGroup.append("g").attr("class", "label-group");
    const lineStartArc = d3.arc().innerRadius(radius * 0.85).outerRadius(radius * 0.85);
    const lineEndArc = d3.arc().innerRadius(radius * 1.05).outerRadius(radius * 1.05);

    pieData.forEach(d => {
      const startPos = lineStartArc.centroid(d);
      const endPos = lineEndArc.centroid(d);
      const midAngle = (d.startAngle + d.endAngle) / 2;
      const isRightSide = midAngle < Math.PI;

      labelGroup.append("line")
          .attr("x1", startPos[0]).attr("y1", startPos[1])
          .attr("x2", endPos[0]).attr("y2", endPos[1])
          .attr("class", "leader-line");

      const horizontalLineEndPoint = [endPos[0] + (isRightSide ? 20 : -20), endPos[1]];
      labelGroup.append("line")
          .attr("x1", endPos[0]).attr("y1", endPos[1])
          .attr("x2", horizontalLineEndPoint[0]).attr("y2", horizontalLineEndPoint[1])
          .attr("class", "leader-line");

      labelGroup.append("text")
          .attr("class", "dynasty-label")
          .attr("transform", `translate(${horizontalLineEndPoint})`)
          .attr("text-anchor", isRightSide ? "start" : "end")
          .attr("dx", isRightSide ? 5 : -5)
          .attr("dy", "0.35em")
          .text(d.data.dynasty);
    });
  }

  /**
   * @description 关键修复：重写泳道布局算法
   * 这是一个经典的区间调度问题变种。目标是将时间上重叠的事件分配到不同的垂直轨道（泳道）上，以避免它们在可视化中重叠。
   * @param {Array} events - 需要进行布局的事件数组，每个事件必须有 startDate 和 endDate。
   * @returns {Array} - 返回带有 .lane 属性的新事件数组，lane 表示其所在的泳道索引。
   */
  const calculateLanes = (events) => {
    const lanes = []; // 每个元素代表一个泳道，其值为该泳道中最后一个事件的结束时间
    const laidOutEvents = [];

    // 确保事件按开始时间升序排列，这是算法正确工作的前提
    const sortedEvents = [...events].sort((a, b) => a.startDate - b.startDate);

    for (const event of sortedEvents) {
      let assignedLane = -1;
      // 遍历现有的所有泳道
      for (let i = 0; i < lanes.length; i++) {
        // 检查当前泳道是否可用：如果新事件的开始时间晚于或等于该泳道中最后一个事件的结束时间，则该泳道可用
        if (event.startDate >= lanes[i]) {
          lanes[i] = event.endDate; // 将事件放入该泳道，并更新该泳道的“占用结束时间”
          assignedLane = i;
          break; // 找到泳道后立即跳出循环
        }
      }

      // 如果遍历完所有泳道都找不到可用的，说明需要一个新的泳道
      if (assignedLane === -1) {
        lanes.push(event.endDate); // 创建新泳道，并将当前事件的结束时间作为其初始占用时间
        assignedLane = lanes.length - 1; // 新泳道的索引是当前泳道数组的长度减一
      }

      // 为事件对象添加 lane 属性并存入结果数组
      laidOutEvents.push({ ...event, lane: assignedLane });
    }
    return laidOutEvents;
  };

  function drawDetailView(dynastyData) {
    // 【交互修复】点击朝代后，禁用背景环形图的鼠标事件
    mainGroup.style("pointer-events", "none");

    // 缩小并淡化背景的环形图
    mainGroup.transition().duration(750)
        .attr("transform", `translate(${margin.left}, ${height / 2 + margin.top}) scale(0.4)`)
        .style("opacity", 0.3);

    // 定义详细视图的尺寸和位置
    const detailMargin = { top: 20, right: 20, bottom: 30, left: 100 };
    const detailWidth = width * 0.75 - detailMargin.left - detailMargin.right;
    const detailHeight = height * 0.9 - detailMargin.top - detailMargin.bottom;
    const detailX = width * 0.2 + margin.left;
    const detailY = (height - detailHeight) / 2 + margin.top;

    // 创建详细视图的G元素容器
    const detailGroup = svg.append("g")
        .attr("class", "detail-content")
        .attr("transform", `translate(${detailX + detailMargin.left}, ${detailY + detailMargin.top})`)
        .style("opacity", 0);

    // 渐显详细视图
    detailGroup.transition().duration(750).style("opacity", 1);

    // 【布局修复】按类别对事件分组，并为每个类别内的事件计算泳道
    const laidOutEvents = [];
    const eventsByCategory = d3.group(dynastyData.events, d => d.category);
    const categoryLanes = new Map();

    eventsByCategory.forEach((events, category) => {
      const categoryLaidOutEvents = calculateLanes(events);
      laidOutEvents.push(...categoryLaidOutEvents);
      const maxLane = d3.max(categoryLaidOutEvents, d => d.lane) ?? 0;
      categoryLanes.set(category, {
        count: maxLane + 1, // 该类别总共需要的泳道数
      });
    });

    // 定义X轴（时间）的线性比例尺
    const xLinear = d3.scaleLinear()
        .domain([
          d3.min(dynastyData.events, d => d.startDate),
          d3.max(dynastyData.events, d => d.endDate)
        ])
        .range([0, detailWidth]);

    // 定义Y轴（事件类别）的序数比例尺
    const yCategory = d3.scaleBand()
        .domain(Array.from(eventsByCategory.keys()))
        .range([0, detailHeight])
        .paddingInner(0.1)
        .paddingOuter(0.2);

    // 绘制X轴
    detailGroup.append("g")
        .attr("transform", `translate(0, ${detailHeight})`)
        .attr("class", "detail-axis")
        .call(d3.axisBottom(xLinear).tickFormat(d3.format("d")));

    // 绘制Y轴
    detailGroup.append("g")
        .attr("class", "detail-axis")
        .call(d3.axisLeft(yCategory))
        .select(".domain").remove();

    // 绘制事件矩形条
    detailGroup.selectAll("rect")
        .data(laidOutEvents)
        .join("rect")
        .attr("x", d => xLinear(d.startDate))
        // 【布局修复】根据事件所属的类别和计算出的泳道号来确定y坐标
        .attr("y", d => {
          const categoryInfo = categoryLanes.get(d.category);
          const categoryHeight = yCategory.bandwidth(); // 获取该类别在Y轴上占据的总高度
          const laneHeight = categoryHeight / categoryInfo.count; // 计算每个子泳道的高度
          return yCategory(d.category) + d.lane * laneHeight; // Y坐标 = 类别起始坐标 + 泳道索引 * 泳道高度
        })
        .attr("width", d => Math.max(2, xLinear(d.endDate) - xLinear(d.startDate))) // 确保宽度至少为2像素
        .attr("height", d => {
          const categoryInfo = categoryLanes.get(d.category);
          const laneHeight = yCategory.bandwidth() / categoryInfo.count;
          return laneHeight * 0.8; // 使矩形之间有垂直间隙
        })
        .attr("fill", d => d.category === '建制沿革' ? '#5B8FF9' : '#F6BD16')
        .attr("rx", 3).attr("ry", 3)
        .style("cursor", "pointer")
        // 【Tooltip修复】使用 d3.select(tooltip.value) 来正确访问DOM元素
        .on("mouseover", (e,d) => d3.select(tooltip.value).style("opacity", 0.9))
        .on("mousemove", (e,d) => { d3.select(tooltip.value).style('left', `${e.pageX+15}px`).style('top', `${e.pageY-28}px`).html(`<strong>${d.summary}</strong>`); })
        .on("mouseout", () => d3.select(tooltip.value).style("opacity", 0))
        .on("click", (e, d) => {selectedEvent.value = d});

    // 添加返回按钮
    detailGroup.append("text")
        .attr("class", "back-button")
        .attr("x", detailWidth)
        .attr("y", -15)
        .attr("text-anchor", "end")
        .text("« 返回全局视图")
        .on("click", () => {
          focusedDynasty.value = null;
          showOverview();
        });
  }

  function showOverview() {
    // 渐隐并移除详细视图
    svg.select(".detail-content").transition().duration(750).style("opacity", 0).remove();

    // 【交互修复】恢复背景环形图的鼠标事件
    mainGroup.style("pointer-events", "auto");

    // 将环形图恢复到中心位置和原始大小
    mainGroup.transition().duration(750)
        .attr("transform", `translate(${(width / 2) + margin.left}, ${(height / 2) + margin.top}) scale(1)`)
        .style("opacity", 1);
  }

  // 初始加载时绘制全局环形图
  drawRadialOverview();
};

onMounted(async () => {
  try {
    // 注意：这里使用的是您提供的文件内容，实际使用时请确保文件路径正确
    const data = await d3.json('/src/assets/data/beijing_history_d3.json');
    if (chartContainer.value && data) {
      const aggregated = aggregateData(data);
      createVisualization(aggregated);
    }
  } catch (error) { console.error("加载数据失败:", error); }
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+SC:wght@400;600&display=swap');
.timeline-container { font-family: 'Noto Sans SC', sans-serif; background-color: #F9F9F9; border-radius: 8px; padding: 20px; }
.chart-title { text-align: center; margin-bottom: -20px; position: relative; z-index: 10; }
.chart-title h3 { font-family: 'Noto Serif SC', serif; font-weight: 600; margin: 0; }
.chart-title p { font-size: 0.9em; color: #888; margin: 5px 0 0 0; }
.chart-container { width: 100%; height: 700px; }

:deep(.dynasty-label) { font-size: 13px; font-weight: 500; pointer-events: none; fill: #333; }
:deep(.leader-line) { fill: none; stroke: #aaa; stroke-width: 1px; }
:deep(.back-button) { font-size: 14px; font-weight: 500; fill: #5B8FF9; text-decoration: underline; cursor: pointer; }
:deep(.detail-axis text) { font-size: 11px; }
:deep(.detail-axis .tick text) { font-family: 'Noto Sans SC', sans-serif; }
:deep(.detail-axis line), :deep(.detail-axis path) { stroke: #ccc; }

.tooltip{position:absolute;background-color:#fff;color:#333;padding:10px 15px;border-radius:6px;font-size:.9em;pointer-events:none;max-width:350px;transition:opacity .2s ease;box-shadow:0 4px 12px rgba(0,0,0,.15);border:1px solid #eee}
.details-panel-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000}
.details-panel{width:90%;max-width:600px;max-height:80vh;background-color:#fff;border-radius:8px;box-shadow:0 5px 20px rgba(0,0,0,.2);padding:25px 30px;overflow-y:auto;position:relative}
.details-panel h3{font-family:'Noto Serif SC',serif;margin:0 0 10px;color:#2c3e50;font-weight:600;font-size:1.5em}
.category-badge{display:inline-block;padding:4px 10px;border-radius:12px;color:#fff;font-size:.8em;font-weight:500;margin-bottom:15px}
.details-content p{font-size:.95em;line-height:1.7;color:#333}
.details-content strong{color:#000}
.details-content hr{border:none;border-top:1px solid #eee;margin:15px 0}
.details-content .full-text{font-size:.9em;color:#555;white-space:pre-wrap}
.details-content .source{margin-top:15px;color:#999;font-size:.8em}
.close-btn{position:absolute;top:15px;right:20px;background:0 0;border:none;font-size:2em;font-weight:300;cursor:pointer;color:#aaa;transition:color .2s}
.close-btn:hover{color:#333}
</style>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+SC:wght@400;600&display=swap');
.timeline-container { font-family: 'Noto Sans SC', sans-serif; background-color: #F9F9F9; border-radius: 8px; padding: 20px; }
.chart-title { text-align: center; margin-bottom: -20px; position: relative; z-index: 10; }
.chart-title h3 { font-family: 'Noto Serif SC', serif; font-weight: 600; margin: 0; }
.chart-title p { font-size: 0.9em; color: #888; margin: 5px 0 0 0; }
.chart-container { width: 100%; height: 700px; }

:deep(.dynasty-label) { font-size: 13px; font-weight: 500; pointer-events: none; fill: #333; }
:deep(.leader-line) { fill: none; stroke: #aaa; stroke-width: 1px; }
:deep(.back-button) { font-size: 14px; font-weight: 500; fill: #5B8FF9; text-decoration: underline; cursor: pointer; }
:deep(.detail-axis text) { font-size: 11px; }
:deep(.detail-axis .tick text) { font-family: 'Noto Sans SC', sans-serif; }
:deep(.detail-axis line), :deep(.detail-axis path) { stroke: #ccc; }

.tooltip{position:absolute;background-color:#fff;color:#333;padding:10px 15px;border-radius:6px;font-size:.9em;pointer-events:none;max-width:350px;transition:opacity .2s ease;box-shadow:0 4px 12px rgba(0,0,0,.15);border:1px solid #eee}
.details-panel-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000}
.details-panel{width:90%;max-width:600px;max-height:80vh;background-color:#fff;border-radius:8px;box-shadow:0 5px 20px rgba(0,0,0,.2);padding:25px 30px;overflow-y:auto;position:relative}
.details-panel h3{font-family:'Noto Serif SC',serif;margin:0 0 10px;color:#2c3e50;font-weight:600;font-size:1.5em}
.category-badge{display:inline-block;padding:4px 10px;border-radius:12px;color:#fff;font-size:.8em;font-weight:500;margin-bottom:15px}
.details-content p{font-size:.95em;line-height:1.7;color:#333}
.details-content strong{color:#000}
.details-content hr{border:none;border-top:1px solid #eee;margin:15px 0}
.details-content .full-text{font-size:.9em;color:#555;white-space:pre-wrap}
.details-content .source{margin-top:15px;color:#999;font-size:.8em}
.close-btn{position:absolute;top:15px;right:20px;background:0 0;border:none;font-size:2em;font-weight:300;cursor:pointer;color:#aaa;transition:color .2s}
.close-btn:hover{color:#333}
</style>