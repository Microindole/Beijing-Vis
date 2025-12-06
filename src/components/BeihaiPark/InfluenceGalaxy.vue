<template>
  <div class="galaxy-container" ref="galaxyRef">
    <div class="hint-text">拖动节点探索 • 悬停查看详情</div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

// 【优化】大幅扩充的数据集：构建真正的“星系”
const rawData = {
  name: "北海公园",
  type: "root",
  children: [
    {
      name: "造园技艺传播",
      type: "category",
      children: [
        {name: "一池三山(太液池)", type: "detail"},
        {name: "借景景山", type: "detail"},
        {name: "杰出叠石(太湖石)", type: "detail"},
        {name: "濠濮间(画境)", type: "detail"},
        {name: "静心斋(园中园)", type: "detail"},
        {name: "画舫斋(水院)", type: "detail"},
        {name: "九龙壁(琉璃艺术)", type: "detail"}
      ]
    },
    {
      name: "全球影响力",
      type: "category",
      children: [
        {name: "圣彼得堡夏宫(借鉴)", type: "detail"},
        {name: "伦敦邱园(仿建白塔)", type: "detail"},
        {name: "旧金山金门公园", type: "detail"},
        {name: "巴黎中式园林", type: "detail"},
        {name: "18世纪欧洲中国热", type: "detail"},
        {name: "新宿御苑(水系)", type: "detail"},
        {name: "世界文化遗产名录", type: "detail"}
      ]
    },
    {
      name: "历史文脉",
      type: "category",
      children: [
        {name: "辽代: 瑶屿行宫", type: "detail"},
        {name: "金代: 大宁离宫", type: "detail"},
        {name: "元代: 广寒殿", type: "detail"},
        {name: "清顺治: 藏传佛教", type: "detail"},
        {name: "乾隆: 极盛扩建", type: "detail"},
        {name: "1925: 公园开放", type: "detail"},
        {name: "新中国: 外交场所", type: "detail"}
      ]
    },
    {
      name: "文化与学术",
      type: "category",
      children: [
        {name: "SCI/核心论文1200+", type: "detail"},
        {name: "《营造法式》研究", type: "detail"},
        {name: "哈佛GSD课程案例", type: "detail"},
        {name: "宫廷饮食文化", type: "detail"},
        {name: "非遗传说故事", type: "detail"},
        {name: "乾隆御诗石刻", type: "detail"},
        {name: "阅古楼书法", type: "detail"}
      ]
    },
    {
      name: "宗教与艺术",
      type: "category",
      children: [
        {name: "白塔(尼泊尔工匠)", type: "detail"},
        {name: "小西天(极乐世界)", type: "detail"},
        {name: "阐福寺(皇室祈福)", type: "detail"},
        {name: "万佛楼遗址", type: "detail"},
        {name: "智珠殿", type: "detail"},
        {name: "善因殿", type: "detail"}
      ]
    },
    {
      name: "当代活力",
      type: "category",
      children: [
        {name: "年客流量500万+", type: "detail"},
        {name: "国潮文创(网红雪糕)", type: "detail"},
        {name: "荷花展/菊花展", type: "detail"},
        {name: "冰嬉(冬季滑冰)", type: "detail"},
        {name: "古树名木保护", type: "detail"}
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
  const height = galaxyRef.value.offsetHeight || 500;

  // 优化颜色方案：更丰富的宫廷色系
  const colorScale = d3.scaleOrdinal()
      .domain(["root", "category", "detail"])
      .range(["#8b4513", "#3a6c4f", "#d4a76a"]);

  const root = d3.hierarchy(rawData);
  const nodes = root.descendants();
  const links = root.links();

  // 2. 模拟器调整 (关键修改)
  simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
          // 【修改点1】连线距离缩短
          // 细节节点距离从 40 -> 25 (更紧凑)
          // 分类节点距离从 110 -> 70 (离中心更近)
          .distance(d => d.target.data.type === 'detail' ? 25 : 40)
      )
      // 【修改点2】斥力减弱
      // 负值越小，斥力越小。从 -280 改为 -120，节点就不会被推得那么远了
      .force("charge", d3.forceManyBody().strength(-70))

      .force("center", d3.forceCenter(width / 2, height / 2))

      // 【修改点3】防碰撞半径微调
      // 稍微减小一点半径，允许它们靠得更近而不重叠
      .force("collide", d3.forceCollide().radius(d => (d.data.type === 'detail' ? 15 : 45)).iterations(3));

  const svg = d3.select(galaxyRef.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      // 允许缩放和平移，方便查看大图
      .call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", (event) => {
        g.attr("transform", event.transform);
      }))
      .append("g");

  const g = svg.append("g");

  const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#b3cbb9")
      .attr("stroke-width", d => d.target.data.type === 'category' ? 2 : 1) // 主干粗，分支细
      .attr("stroke-opacity", 0.5);

  const node = g.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  // 节点绘制
  node.append("circle")
      .attr("r", d => {
        if (d.data.type === 'root') return 45;
        if (d.data.type === 'category') return 28;
        return 5; // 细节节点保持小点，像星星
      })
      .attr("fill", d => {
        // 给不同分类稍微加点颜色变化（可选）
        if (d.data.type === 'category') return "#3a6c4f";
        if (d.data.type === 'detail') return "#d4a76a";
        return "#8b4513";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", d => d.data.type === 'root' ? 4 : 1.5)
      .attr("cursor", "pointer")
      .on("mouseover", function (event, d) {
        // 交互优化
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

  // 核心节点文字
  node.filter(d => d.data.type !== 'detail')
      .append("text")
      .text(d => d.data.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.data.type === 'root' ? 5 : 4) // 居中显示在圆内
      .style("fill", "#fff") // 改为白色文字，更清晰
      .style("font-size", d => d.data.type === 'root' ? "14px" : "10px")
      .style("pointer-events", "none");

  // 细节节点背景框 (Hover时显示)
  node.filter(d => d.data.type === 'detail')
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", d => d.data.name.length * 12 + 10) // 动态宽度
      .attr("height", 20)
      .attr("x", 8)
      .attr("y", -10)
      .attr("fill", "rgba(58, 108, 79, 0.9)") // 深绿色背景
      .attr("stroke", "#d4a76a")
      .style("opacity", 0)
      .style("pointer-events", "none");

  // 细节节点文字
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
/* 样式保持不变，配合新的颜色方案 */
.galaxy-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: radial-gradient(circle at center, #ffffff 0%, #eef5e6 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(58, 108, 79, 0.1);
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
  color: #5a4a42;
  pointer-events: none;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d4a76a;
}
</style>