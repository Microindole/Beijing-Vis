<!-- 时间轴可视化的 树图 -->
<template>
  <div class="timeline-tree-container">
    <!-- 时间轴 -->
    <div class="timeline">
      <div
        v-for="era in eras"
        :key="era.name"
        class="era"
        :style="{ width: era.span + '%' }"
        @mouseover="highlightEra(era.name)"
        @mouseout="unhighlightEra()"
      >
        <div class="era-label">{{ era.name }} ({{ era.years }})</div>
      </div>
    </div>

    <!-- 树图 -->
    <div ref="treeChart" class="tree-chart"></div>

    <!-- 详细信息面板 -->
    <div v-if="selectedEvent" class="event-details">
      <div class="event-header">
        <h3>{{ selectedEvent.title }}</h3>
        <span class="event-year">{{ selectedEvent.year }}</span>
      </div>
      <p>{{ selectedEvent.description }}</p>
      <div v-if="selectedEvent.image" class="event-image">
        <img :src="selectedEvent.image" :alt="selectedEvent.title" />
      </div>
      <button @click="selectedEvent = null">关闭</button>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <div><span class="legend-icon building"></span> 建筑</div>
      <div><span class="legend-icon culture"></span> 文化</div>
      <div><span class="legend-icon event"></span> 事件</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";

// 更丰富的数据结构
const treeData = {
  name: "故宫",
  year: "1420年",
  type: "building",
  description: "紫禁城始建于明永乐四年(1406年)，永乐十八年(1420年)建成",
  image: "https://example.com/forbidden-city.jpg",
  children: [
    {
      name: "明代",
      year: "1420-1644",
      type: "era",
      children: [
        {
          name: "永乐迁都",
          year: "1420",
          type: "event",
          description: "明成祖朱棣将明朝首都从南京迁至北京，紫禁城成为皇家宫殿",
          image: "https://example.com/yongle-emperor.jpg",
        },
        {
          name: "三大殿",
          year: "1420",
          type: "building",
          description: "太和殿、中和殿、保和殿组成的外朝核心建筑群",
          image: "https://example.com/three-great-halls.jpg",
        },
        {
          name: "内阁制度",
          year: "1430s",
          type: "culture",
          description: "明代形成的以大学士为核心的内阁辅政制度",
          image: "https://example.com/ming-cabinet.jpg",
        },
      ],
    },
    {
      name: "清代",
      year: "1644-1912",
      type: "era",
      children: [
        {
          name: "康熙扩建",
          year: "1695",
          type: "event",
          description: "康熙帝大规模修缮和扩建紫禁城",
          image: "https://example.com/kangxi-emperor.jpg",
        },
        {
          name: "乾清宫",
          year: "1798",
          type: "building",
          description: "乾隆帝为其退位后居住而改建的宫殿",
          image: "https://example.com/qianqing-palace.jpg",
        },
        {
          name: "满汉融合",
          year: "18世纪",
          type: "culture",
          description: "满族统治者吸收汉族文化，形成独特的宫廷文化",
          image: "https://example.com/manchu-han.jpg",
        },
      ],
    },
    {
      name: "近现代",
      year: "1912-至今",
      type: "era",
      children: [
        {
          name: "故宫博物院",
          year: "1925",
          type: "event",
          description: "紫禁城改为故宫博物院并向公众开放",
          image: "https://example.com/museum-opening.jpg",
        },
        {
          name: "文物南迁",
          year: "1933",
          type: "event",
          description: "为避战乱，故宫文物大规模南迁",
          image: "https://example.com/relocation.jpg",
        },
        {
          name: "世界遗产",
          year: "1987",
          type: "event",
          description: "故宫被联合国教科文组织列为世界文化遗产",
          image: "https://example.com/unesco.jpg",
        },
        {
          name: "数字故宫",
          year: "2020",
          type: "culture",
          description: "故宫博物院推出数字展览和虚拟游览",
          image: "https://example.com/digital-palace.jpg",
        },
      ],
    },
  ],
};

// 时间轴数据
const eras = [
  { name: "明代", years: "1420-1644", span: 28, color: "#d4af37" },
  { name: "清代", years: "1644-1912", span: 34, color: "#c72e2e" },
  { name: "近现代", years: "1912-至今", span: 38, color: "#2e86c7" },
];

const treeChart = ref(null);
const selectedEvent = ref(null);
const svg = ref(null);

onMounted(() => {
  drawTree();
});

function drawTree() {
  const width = 1000;
  const height = 600;
  const margin = { top: 20, right: 120, bottom: 20, left: 120 };

  // 清除旧图表
  d3.select(treeChart.value).selectAll("*").remove();

  // 创建SVG画布
  svg.value = d3
    .select(treeChart.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 创建树布局
  const hierarchy = d3.hierarchy(treeData);
  const treeWidth = width - margin.left - margin.right;
  const treeHeight = height - margin.top - margin.bottom;

  const treeLayout = d3
    .tree()
    .size([treeHeight, treeWidth - 200])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

  const treeNodes = treeLayout(hierarchy);

  // 添加时间线背景
  addTimelineBackground(treeWidth, treeHeight);

  // 绘制连接线
  svg.value
    .selectAll(".link")
    .data(treeNodes.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    )
    .attr("stroke", (d) => getEraColor(d.source.data.year))
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.8);

  // 创建节点组
  const nodes = svg.value
    .selectAll(".node")
    .data(treeNodes.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y},${d.x})`)
    .on("click", (event, d) => {
      if (d.data.description) {
        selectedEvent.value = {
          title: d.data.name,
          year: d.data.year,
          description: d.data.description,
          image: d.data.image,
        };
      }
    })
    .on("mouseover", function (event, d) {
      if (d.data.description) {
        d3.select(this)
          .select("circle")
          .attr("r", d.depth === 0 ? 14 : 10);
      }
    })
    .on("mouseout", function (event, d) {
      if (d.data.description) {
        d3.select(this)
          .select("circle")
          .attr("r", d.depth === 0 ? 10 : 6);
      }
    });

  // 绘制节点
  nodes
    .append("circle")
    .attr("r", (d) => (d.depth === 0 ? 10 : 6))
    .attr("fill", (d) => getNodeColor(d.data.type))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

  // 添加节点文字
  nodes
    .append("text")
    .attr("dy", 4)
    .attr("x", (d) => (d.children ? -10 : 10))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name)
    .attr("font-size", "12px")
    .attr("fill", "#333");

  // 添加年份标签
  nodes
    .filter((d) => d.data.year && d.depth > 0)
    .append("text")
    .attr("dy", 20)
    .attr("x", (d) => (d.children ? -10 : 10))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.year)
    .attr("font-size", "10px")
    .attr("fill", "#666");

  // 添加动画
  svg.value
    .selectAll(".link, .node")
    .attr("opacity", 0)
    .transition()
    .duration(800)
    .attr("opacity", 1);
}

function addTimelineBackground(width, height) {
  // 添加时间背景条
  svg.value
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#f9f9f9")
    .attr("rx", 5)
    .attr("ry", 5);

  // 添加时间刻度
  const years = [1420, 1500, 1600, 1700, 1800, 1900, 2000, 2023];
  const yearScale = d3.scaleLinear().domain([1420, 2023]).range([0, width]);

  svg.value
    .selectAll(".year-tick")
    .data(years)
    .enter()
    .append("line")
    .attr("class", "year-tick")
    .attr("x1", (d) => yearScale(d))
    .attr("x2", (d) => yearScale(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#ddd")
    .attr("stroke-width", 1);

  svg.value
    .selectAll(".year-label")
    .data(years)
    .enter()
    .append("text")
    .attr("class", "year-label")
    .attr("x", (d) => yearScale(d))
    .attr("y", height - 5)
    .text((d) => d)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "#999");
}

function getNodeColor(type) {
  const colors = {
    building: "#d4af37", // 金色代表建筑
    culture: "#2e86c7", // 蓝色代表文化
    event: "#c72e2e", // 红色代表事件
    era: "#666", // 灰色代表时代
  };
  return colors[type] || "#999";
}

function getEraColor(yearRange) {
  if (!yearRange) return "#999";

  if (yearRange.includes("1420")) return "#d4af37"; // 明代
  if (yearRange.includes("1644")) return "#c72e2e"; // 清代
  return "#2e86c7"; // 近现代
}

function highlightEra(eraName) {
  svg.value
    .selectAll(".node")
    .attr("opacity", (d) =>
      !d.data.year ||
      (eraName === "明代" && d.data.year.includes("1420")) ||
      (eraName === "清代" && d.data.year.includes("1644")) ||
      (eraName === "近现代" &&
        !d.data.year.includes("1420") &&
        !d.data.year.includes("1644"))
        ? 1
        : 0.3
    );

  svg.value
    .selectAll(".link")
    .attr("opacity", (d) =>
      (eraName === "明代" && getEraColor(d.source.data.year) === "#d4af37") ||
      (eraName === "清代" && getEraColor(d.source.data.year) === "#c72e2e") ||
      (eraName === "近现代" && getEraColor(d.source.data.year) === "#2e86c7")
        ? 1
        : 0.3
    );
}

function unhighlightEra() {
  svg.value.selectAll(".node, .link").attr("opacity", 1);
}
</script>

<style scoped>
.timeline-tree-container {
  position: relative;
  font-family: "Microsoft YaHei", sans-serif;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.timeline {
  display: flex;
  height: 40px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.era {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.era:hover {
  opacity: 0.9;
  transform: scaleY(1.05);
}

.era:nth-child(1) {
  background-color: #d4af37;
} /* 明代 */
.era:nth-child(2) {
  background-color: #c72e2e;
} /* 清代 */
.era:nth-child(3) {
  background-color: #2e86c7;
} /* 近现代 */

.era-label {
  padding: 0 10px;
  font-size: 14px;
  text-align: center;
}

.tree-chart {
  width: 100%;
  height: 600px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.link {
  fill: none;
  stroke-opacity: 0.6;
}

.event-details {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
  max-width: 500px;
  width: 90%;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.event-header h3 {
  margin: 0;
  color: #333;
}

.event-year {
  background: #2e86c7;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.event-image {
  margin: 15px 0;
}

.event-image img {
  width: 100%;
  border-radius: 5px;
}

button {
  background: #2e86c7;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #1a5276;
}

.legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.legend-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  border: 1px solid white;
}

.legend-icon.building {
  background: #d4af37;
}
.legend-icon.culture {
  background: #2e86c7;
}
.legend-icon.event {
  background: #c72e2e;
}
</style>
