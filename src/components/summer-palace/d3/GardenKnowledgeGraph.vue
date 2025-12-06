<template>
  <div ref="graphContainer" class="graph-wrapper">
    <div class="legend">
      <div v-for="(color, type) in typeColors" :key="type" class="legend-item">
        <span class="dot" :style="{ background: color }"></span>
        <span>{{ type }}</span>
      </div>
    </div>
    <transition name="fade">
      <div class="info-card" v-if="selectedNode">
        <div class="card-header" :style="{ background: typeColors[selectedNode.type] }">
          {{ selectedNode.id }}
        </div>
        <div class="card-body">
          <p><strong>类型：</strong>{{ selectedNode.type }}</p>
          <p><strong>描述：</strong>{{ selectedNode.desc }}</p>
        </div>
        <button class="close-btn" @click="selectedNode = null">×</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);
const selectedNode = ref(null);

// 真实颐和园知识图谱数据
const typeColors = {
  "哲学": "#d4a76a", // 帝王黄
  "建筑": "#c94c4c", // 朱砂红
  "景观": "#5b8c85", // 黛绿
  "技法": "#6b5b95", // 紫
  "历史": "#503931"  // 褐
};

const rawData = {
  nodes: [
    {id: "天人合一", type: "哲学", r: 30, desc: "中国古典园林的核心精神，强调人与自然的和谐统一。"},
    {id: "虽由人作", type: "哲学", r: 20, desc: "《园冶》名句，意为人工建造要看不出痕迹。"},
    {id: "宛自天开", type: "哲学", r: 20, desc: "最高境界，仿佛大自然鬼斧神工。"},

    {id: "佛香阁", type: "建筑", r: 35, desc: "全园构图中心，八面三层四重檐，供奉千手观音。"},
    {id: "排云殿", type: "建筑", r: 25, desc: "慈禧太后举行万寿庆典的地方。"},
    {id: "长廊", type: "建筑", r: 25, desc: "全长728米，中国园林中最长的游廊，绘有14000余幅彩画。"},
    {id: "十七孔桥", type: "建筑", r: 22, desc: "连接南湖岛，状若长虹卧波。"},
    {id: "石舫", type: "建筑", r: 18, desc: "象征清朝统治稳如磐石，永不沉没。"},

    {id: "万寿山", type: "景观", r: 32, desc: "前山宏伟，后山幽静，园林的主体山脉。"},
    {id: "昆明湖", type: "景观", r: 32, desc: "模仿杭州西湖，扩建而成的巨大水面。"},
    {id: "西堤", type: "景观", r: 20, desc: "仿苏堤而建，六桥烟柳。"},
    {id: "谐趣园", type: "景观", r: 18, desc: "园中之园，仿无锡寄畅园。"},

    {id: "借景", type: "技法", r: 24, desc: "将园外景色（如西山、玉泉山）纳入视线。"},
    {id: "对景", type: "技法", r: 18, desc: "通过轴线关系，使景观相互呼应。"},

    {id: "乾隆", type: "历史", r: 22, desc: "清漪园（颐和园前身）的始建者。"},
    {id: "慈禧", type: "历史", r: 22, desc: "挪用海军经费重修颐和园。"},
    {id: "1860火烧圆明园", type: "历史", r: 18, desc: "英法联军焚毁清漪园。"}
  ],
  links: [
    {source: "天人合一", target: "万寿山"},
    {source: "天人合一", target: "昆明湖"},
    {source: "虽由人作", target: "宛自天开"},
    {source: "佛香阁", target: "万寿山"},
    {source: "排云殿", target: "佛香阁"},
    {source: "昆明湖", target: "十七孔桥"},
    {source: "昆明湖", target: "西堤"},
    {source: "长廊", target: "万寿山"},
    {source: "长廊", target: "昆明湖"}, // 介于山水之间
    {source: "借景", target: "昆明湖"}, // 借西山
    {source: "借景", target: "佛香阁"},
    {source: "对景", target: "佛香阁"}, // 与什么对景？
    {source: "谐趣园", target: "万寿山"},
    {source: "乾隆", target: "昆明湖"}, // 操练水军
    {source: "慈禧", target: "排云殿"},
    {source: "慈禧", target: "石舫"},
    {source: "1860火烧圆明园", target: "佛香阁"}
  ]
};

let simulation, svg;

const initChart = () => {
  if (!graphContainer.value) return;
  const width = graphContainer.value.offsetWidth;
  const height = graphContainer.value.offsetHeight || 400;

  svg = d3.select(graphContainer.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(d3.zoom().on("zoom", (event) => {
        container.attr("transform", event.transform);
      }));

  // 定义箭头 Marker
  svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // 调整箭头位置
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

  const container = svg.append("g");

  simulation = d3.forceSimulation(rawData.nodes)
      .force("link", d3.forceLink(rawData.links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => d.r + 10));

  const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(rawData.links)
      .enter().append("line")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

  const nodeGroup = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(rawData.nodes)
      .enter().append("g")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
      .on("click", (e, d) => {
        selectedNode.value = d;
        e.stopPropagation();
      });

  // 节点外圈光晕
  nodeGroup.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => typeColors[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "main-circle");

  // 节点文字
  nodeGroup.append("text")
      .text(d => d.id)
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .style("font-size", d => Math.min(12, d.r / 1.5) + "px")
      .style("fill", "#fff")
      .style("pointer-events", "none")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)");

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
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
  initChart();
});
</script>

<style scoped>
.graph-wrapper {
  width: 100%;
  height: 400px;
  background: #fdfbf7; /* 米纸色 */
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
}

.legend {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 4px;
  color: #555;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.info-card {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
}

.card-header {
  padding: 8px 12px;
  color: #fff;
  font-weight: bold;
}

.card-body {
  padding: 10px 12px;
  font-size: 12px;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>