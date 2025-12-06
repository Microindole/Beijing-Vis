<template>
  <div class="yiheyuan-network-container">
    <div class="header">
      <h1>颐和园人物关系网络</h1>
      <p class="subtitle">晚清宫廷的权力博弈与皇家园林的悲欢离合</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>地标</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon power"></span>
          <span>皇权核心</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon puppet"></span>
          <span>帝后/妃嫔</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>臣工/太监</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon reform"></span>
          <span>维新派</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line control"></span>
          <span>控制/囚禁</span>
        </div>
        <div class="legend-item">
          <span class="relation-line family"></span>
          <span>亲缘/喜爱</span>
        </div>
        <div class="legend-item">
          <span class="relation-line politics"></span>
          <span>政治/共谋</span>
        </div>
        <div class="legend-item">
          <span class="relation-line event"></span>
          <span>历史事件</span>
        </div>
      </div>
    </div>

    <div class="graph-wrapper" ref="graphContainerRef"></div>

    <div class="hint" v-if="!selectedNode">
      <p>点击节点查看详细信息 • 拖动旋转视图 • 滚轮缩放</p>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedNode?.name }}</h2>
          <button @click="closeModal" class="close-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="character-story">
            <p>{{ characterInfo?.story }}</p>
          </div>

          <div
              class="details-section"
              v-if="characterInfo?.details && characterInfo.details.length > 0"
          >
            <h3>历史细节</h3>
            <ul>
              <li v-for="(detail, index) in characterInfo.details" :key="index">
                {{ detail }}
              </li>
            </ul>
          </div>

          <div class="relations-section">
            <h3>关联关系</h3>
            <div class="relations-list">
              <div
                  v-for="link in getNodeRelations(selectedNode)"
                  :key="`${link.source}-${link.target}`"
                  class="relation-item"
                  :style="{ borderLeftColor: link.color, borderLeftWidth: link.width * 2 + 'px' }"
              >
                <div class="relation-type" :style="{ color: link.color }">
                  {{ link.relation }}
                </div>
                <div class="relation-target">
                  {{
                    link.source === selectedNode?.id
                        ? graphData.nodes.find((n) => n.id === link.target)?.name
                        : graphData.nodes.find((n) => n.id === link.source)?.name
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import * as d3 from "d3";

// ---------------------------------------------------------
// 颐和园真实历史数据 (格式与北海代码完全一致)
// ---------------------------------------------------------
const originalGraphData = {
  nodes: [
    {
      id: "颐和园",
      name: "颐和园",
      val: 65,
      color: "#5e8c6a", // 园林主色
      type: "location",
      symbolSize: 32,
      img: "/icons/summer_palace.png", // 假设图片
    },
    {
      id: "慈禧",
      name: "慈禧太后",
      val: 45,
      color: "#c0a16c", // 皇权金
      type: "power",
      symbolSize: 28,
      img: "/icons/cixi.png",
    },
    {
      id: "光绪",
      name: "光绪皇帝",
      val: 35,
      color: "#7a8c7a", // 抑郁绿
      type: "puppet",
      symbolSize: 26,
      img: "/icons/guangxu.png",
    },
    {
      id: "乾隆",
      name: "乾隆皇帝",
      val: 30,
      color: "#c0a16c",
      type: "power",
      symbolSize: 25,
      img: "/icons/qianlong.png",
    },
    {
      id: "珍妃",
      name: "珍妃",
      val: 25,
      color: "#ffb6b9", // 妃嫔粉
      type: "puppet",
      symbolSize: 22,
      img: "/icons/zhenfei.png",
    },
    {
      id: "隆裕",
      name: "隆裕皇后",
      val: 22,
      color: "#b3cbb9",
      type: "puppet",
      symbolSize: 20,
      img: "/icons/longyu.png",
    },
    {
      id: "李莲英",
      name: "李莲英",
      val: 28,
      color: "#795548", // 褐色
      type: "official",
      symbolSize: 22,
      img: "/icons/lilianying.png",
    },
    {
      id: "康有为",
      name: "康有为",
      val: 20,
      color: "#ffcc80", // 橙色系
      type: "reform",
      symbolSize: 20,
      img: "/icons/kangyouwei.png",
    },
    {
      id: "乐寿堂",
      name: "乐寿堂",
      val: 30,
      color: "#8d6e63", // 建筑色
      type: "location",
      symbolSize: 24,
      img: "/icons/leshoutang.png",
    },
    {
      id: "玉澜堂",
      name: "玉澜堂",
      val: 28,
      color: "#78909c", // 冷色调建筑
      type: "location",
      symbolSize: 22,
      img: "/icons/yulantang.png",
    },
    {
      id: "昆明湖",
      name: "昆明湖",
      val: 40,
      color: "#4fc3f7", // 水色
      type: "location",
      symbolSize: 26,
      img: "/icons/kunminghu.png",
    },
    {
      id: "仁寿殿",
      name: "仁寿殿",
      val: 30,
      color: "#8d6e63",
      type: "location",
      symbolSize: 24,
      img: "/icons/renshoudian.png",
    },
    {
      id: "醇亲王",
      name: "醇亲王(奕譞)",
      val: 24,
      color: "#795548",
      type: "official",
      symbolSize: 22,
      img: "/icons/chunqinwang.png",
    },
  ],
  links: [
    // 建设关系
    { source: "乾隆", target: "颐和园", relation: "始建清漪园", color: "#388e3c", width: 6, curvature: 0.1 },
    { source: "慈禧", target: "颐和园", relation: "挪款重修", color: "#388e3c", width: 6, curvature: 0.1 },
    { source: "醇亲王", target: "昆明湖", relation: "水师名义修园", color: "#8d6e63", width: 4, curvature: 0.2 },

    // 居住/控制关系 (人与地)
    { source: "慈禧", target: "乐寿堂", relation: "居住/理政", color: "#c0a16c", width: 5, curvature: 0.2 },
    { source: "慈禧", target: "仁寿殿", relation: "垂帘听政", color: "#c0a16c", width: 5, curvature: 0.2 },
    { source: "光绪", target: "玉澜堂", relation: "被囚禁", color: "#d32f2f", width: 6, curvature: 0.15 }, // 红色强调
    { source: "光绪", target: "仁寿殿", relation: "召见群臣", color: "#7a8c7a", width: 3, curvature: 0.2 },

    // 人际关系
    { source: "慈禧", target: "光绪", relation: "母子/控制", color: "#d32f2f", width: 5, curvature: 0.3 },
    { source: "光绪", target: "珍妃", relation: "挚爱/支持变法", color: "#ffb6b9", width: 4, curvature: 0.2 },
    { source: "慈禧", target: "珍妃", relation: "投井赐死", color: "#d32f2f", width: 5, curvature: 0.1 },
    { source: "慈禧", target: "李莲英", relation: "宠信", color: "#795548", width: 4, curvature: 0.2 },
    { source: "光绪", target: "康有为", relation: "维新变法", color: "#ffcc80", width: 3, curvature: 0.25 },
    { source: "光绪", target: "隆裕", relation: "冷落", color: "#b3cbb9", width: 2, curvature: 0.3 },
    { source: "隆裕", target: "慈禧", relation: "侄女/眼线", color: "#c0a16c", width: 3, curvature: 0.2 },
    { source: "李莲英", target: "乐寿堂", relation: "值守", color: "#795548", width: 3, curvature: 0.2 },
  ],
};

const characterInfos = {
  颐和园: {
    story: "颐和园，原名清漪园，始建于乾隆十五年。1860年遭英法联军焚毁，后由慈禧太后挪用海军经费重建，改名颐和园。它是晚清最高统治者在紫禁城之外最重要的政治和外交活动中心。",
    details: ["中国现存规模最大、保存最完整的皇家园林", "汲取江南园林的设计手法", "见证了戊戌变法、庚子之乱等重大历史事件"]
  },
  慈禧: {
    story: "晚清实际统治者。她将颐和园作为“颐养天年”的场所，实则在此垂帘听政。乐寿堂是她的寝宫，仁寿殿是她接见朝臣和外国使节的地方。",
    details: ["挪用海军经费重修颐和园", "在乐寿堂居住时间长达数十年", "1898年在此发动戊戌政变，囚禁光绪"]
  },
  光绪: {
    story: "清朝第十一位皇帝。戊戌变法失败后，被慈禧太后幽禁于颐和园玉澜堂。原本四通八达的院落被高墙封死，他在此度过了压抑的余生。",
    details: ["在玉澜堂被幽禁长达10年", "失去了人身自由和政治权力", "留下了“欲飞无羽翼，欲渡无河梁”的悲叹"]
  },
  乾隆: {
    story: "清朝全盛时期的皇帝，清漪园（颐和园前身）的缔造者。他为了给母亲崇庆皇太后祝寿，疏浚昆明湖，堆筑万寿山，奠定了园林的基本格局。",
    details: ["主持修建清漪园", "仿杭州西湖治理昆明湖", "留下了大量的御制诗文"]
  },
  珍妃: {
    story: "光绪帝最宠爱的妃子，支持光绪变法，倾向维新。因忤逆慈禧太后，在八国联军进京前夕，被推入乐寿堂后的井中溺亡。",
    details: ["光绪帝唯一的精神支柱", "支持维新变法，卖官鬻爵得罪慈禧", "死后葬于崇陵妃园寝"]
  },
  李莲英: {
    story: "清末大太监，慈禧太后身边的大红人。他在颐和园内权势熏天，常伴慈禧左右，对园内事务有极大影响力。",
    details: ["紫禁城外最有权势的宦官", "善于揣摩慈禧心意", "陪同慈禧在颐和园游湖听戏"]
  },
  乐寿堂: {
    story: "面临昆明湖，背倚万寿山，是颐和园居住生活区的主体建筑。慈禧太后常年居住于此，也是她发布重要政令的地方。",
    details: ["慈禧太后的寝宫", "堂前种植玉兰、海棠、牡丹", "见证了晚清宫廷的奢华生活"]
  },
  玉澜堂: {
    story: "光绪皇帝在颐和园的寝宫。戊戌变法失败后，这里成为了他的囚笼。慈禧命人砌墙隔断了与外界的通道。",
    details: ["光绪皇帝的幽禁之地", "内部陈设保留了当年的原貌", "充满悲剧色彩的建筑"]
  },
  仁寿殿: {
    story: "颐和园的正殿，原名勤政殿。慈禧太后和光绪皇帝在此临朝理政，接见外国使节，是晚清外交和政治活动的重要场所。",
    details: ["颐和园的政治中心", "殿内设有九龙宝座", "见证了清末变法与守旧的激烈斗争"]
  }
};

// ---------------------------------------------------------
// 以下逻辑与 Beihai Park 完全一致
// ---------------------------------------------------------

const graphContainerRef = ref(null);
let forceGraphInstance = null;

const selectedNode = ref(null);
const characterInfo = ref(null);
const showModal = ref(false);
const allGraphData = ref(originalGraphData);
const displayedGraphData = ref({ nodes: [], links: [] });
const graphData = ref({ nodes: originalGraphData.nodes, links: originalGraphData.links });

const getNodeRelations = (node) => {
  if (!node) return [];
  return graphData.value.links.filter(
      (link) => link.source === node.id || link.target === node.id
  );
};

const filterGraphData = (nodeId) => {
  if (!nodeId) {
    displayedGraphData.value = { ...allGraphData.value };
    return;
  }
  const relatedLinks = allGraphData.value.links.filter(
      (link) => link.source === nodeId || link.target === nodeId
  );
  const relatedNodeIds = new Set();
  relatedNodeIds.add(nodeId);
  relatedLinks.forEach((link) => {
    relatedNodeIds.add(link.source);
    relatedNodeIds.add(link.target);
  });
  const filteredNodes = allGraphData.value.nodes.filter((node) =>
      relatedNodeIds.has(node.id)
  );
  displayedGraphData.value = { nodes: filteredNodes, links: relatedLinks };
};

const handleNodeClick = (node) => {
  selectedNode.value = node;
  characterInfo.value = characterInfos[node.id] || { story: "暂无详细信息。", details: [] };
  showModal.value = true;
  filterGraphData(node.id);
  forceGraphInstance.graphData(displayedGraphData.value);

  if (forceGraphInstance && node) {
    const distance = 180;
    const nodeDistance = Math.hypot(node.x, node.y, node.z);
    const sizeFactor = node.val ? node.val * 0.1 : 1;
    const targetDistance = (nodeDistance > 0 ? nodeDistance : 1) + distance + sizeFactor * 5;
    forceGraphInstance.cameraPosition(
        {
          x: node.x * (targetDistance / nodeDistance),
          y: node.y * (targetDistance / nodeDistance),
          z: node.z * (targetDistance / nodeDistance),
        },
        node,
        2500
    );
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedNode.value = null;
  characterInfo.value = null;
  filterGraphData(null);
  forceGraphInstance.graphData(displayedGraphData.value);
  if (forceGraphInstance) {
    forceGraphInstance.cameraPosition({ x: 0, y: 0, z: 700 }, { x: 0, y: 0, z: 0 }, 1000);
  }
};

onMounted(() => {
  filterGraphData(null);
  if (graphContainerRef.value) {
    forceGraphInstance = ForceGraph3D()(graphContainerRef.value)
        .graphData(displayedGraphData.value)
        .nodeVal("val")
        .nodeColor("color")
        .nodeThreeObject((node) => {
          const group = new THREE.Group();
          // 光晕 (Halo)
          const halo = new THREE.Mesh(
              new THREE.SphereGeometry(node.val * 0.22, 32, 32),
              new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })
          );
          group.add(halo);
          // 主体 (Icosahedron 宝石感)
          const geometry = new THREE.IcosahedronGeometry(node.val * 0.16, 2);
          const texture = new THREE.TextureLoader().load(node.img);
          const material = new THREE.MeshPhongMaterial({ map: texture, specular: 0x111111, shininess: 40, transparent: true });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);
          // 边框
          const edges = new THREE.EdgesGeometry(geometry);
          const edgeMaterial = new THREE.LineBasicMaterial({ color: node.color, linewidth: 4 });
          const edgesMesh = new THREE.LineSegments(edges, edgeMaterial);
          edgesMesh.scale.set(1.13, 1.13, 1.13);
          group.add(edgesMesh);
          // 标签
          const text = new SpriteText(node.name);
          text.color = "#222";
          text.backgroundColor = "rgba(255,255,255,0.95)";
          text.borderColor = node.color;
          text.borderWidth = 2;
          text.borderRadius = 5;
          text.padding = 8;
          text.textHeight = 12;
          text.position.y += node.val * 0.2 + 15;
          group.add(text);

          group.userData = { originalScale: 1, hoverScale: 1.3 };
          return group;
        })
        .linkColor((link) => link.color)
        .linkWidth((link) => link.width * 1.5)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleWidth(7)
        .linkDirectionalParticleColor((link) => link.color)
        .linkCurvature((link) => link.curvature)
        .linkOpacity(1)
        .linkThreeObject((link) => {
          const group = new THREE.Group();
          // 线条
          const lineGeometry = new THREE.BufferGeometry();
          const lineMaterial = new THREE.LineBasicMaterial({ color: link.color, linewidth: link.width * 2, transparent: true, opacity: 1 });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
          // 关系标签
          const sprite = new SpriteText(link.relation);
          sprite.color = "#333";
          sprite.backgroundColor = "rgba(255,255,255,0.7)";
          sprite.borderColor = "rgba(0,0,0,0.2)";
          sprite.borderWidth = 1;
          sprite.borderRadius = 3;
          sprite.padding = 3;
          sprite.textHeight = 11;
          sprite.visible = false;
          sprite.material.depthTest = false;
          group.add(sprite);
          link.__sprite = sprite;
          // 更新位置逻辑
          group.__updatePosition = (start, end) => {
            const vertices = new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]);
            lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            lineGeometry.attributes.position.needsUpdate = true;
            const middlePos = new THREE.Vector3(start.x + (end.x - start.x) * 0.5, start.y + (end.y - start.y) * 0.5, start.z + (end.z - start.z) * 0.5);
            Object.assign(sprite.position, middlePos);
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            sprite.rotation.z = angle;
          };
          return group;
        })
        .linkPositionUpdate((obj, { start, end }) => { obj.__updatePosition(start, end); })
        .backgroundColor("rgba(252, 248, 243, 0.8)")
        .onNodeClick(handleNodeClick)
        .onNodeHover((hoveredNode) => {
          graphContainerRef.value.style.cursor = hoveredNode ? "pointer" : null;
          allGraphData.value.links.forEach((link) => { if (link.__sprite) link.__sprite.visible = false; });
          const linksToProcess = selectedNode.value ? displayedGraphData.value.links : allGraphData.value.links;
          if (hoveredNode) {
            linksToProcess.forEach((link) => {
              if ((link.source && link.source === hoveredNode.id) || (link.target && link.target === hoveredNode.id)) {
                if (link.__sprite) link.__sprite.visible = true;
                forceGraphInstance.linkColor((l) => l === link ? "#ff1744" : l.color);
              }
            });
          } else {
            forceGraphInstance.linkColor((link) => link.color);
          }
        })
        .onLinkHover((link) => { graphContainerRef.value.style.cursor = link ? "pointer" : null; })
        .d3Force("link", d3.forceLink().id((d) => d.id).distance(350))
        .d3Force("center", d3.forceCenter())
        .d3Force("collision", d3.forceCollide().radius((d) => d.val * 0.2 + 55));

    forceGraphInstance.cameraPosition({ x: 0, y: 0, z: 700 });
    forceGraphInstance.scene().add(new THREE.AmbientLight(0xffffff, 0.85));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    directionalLight.position.set(100, 100, 100);
    forceGraphInstance.scene().add(directionalLight);

    const resizeObserver = new ResizeObserver(() => {
      if (graphContainerRef.value && forceGraphInstance) {
        forceGraphInstance.width(graphContainerRef.value.offsetWidth);
        forceGraphInstance.height(graphContainerRef.value.offsetHeight);
      }
    });
    resizeObserver.observe(graphContainerRef.value);
  }
});

onBeforeUnmount(() => {
  if (forceGraphInstance) {
    forceGraphInstance._destructor();
  }
});
</script>

<style scoped>
/* 完全复用北海公园的 CSS 样式 */
.yiheyuan-network-container {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  /* 北海同款背景 */
  background: linear-gradient(135deg, #fcf8f3 0%, #f4e8d0 100%);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #5e8c6a;
  font-size: 2.4rem;
  margin-bottom: 8px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: #3a6c4f;
  font-size: 1.1rem;
  margin-top: 0;
}

.legend-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(94, 140, 106, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(94, 140, 106, 0.3);
}

.legend,
.relation-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #3a6c4f;
}

.legend-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #5e8c6a;
  box-shadow: 0 1px 3px rgba(94, 140, 106, 0.3);
}

/* 图例颜色适配颐和园数据 */
.legend-icon.location { background-color: #5e8c6a; }
.legend-icon.power { background-color: #c0a16c; }
.legend-icon.puppet { background-color: #7a8c7a; }
.legend-icon.official { background-color: #795548; }
.legend-icon.reform { background-color: #ffcc80; }

.relation-line {
  display: inline-block;
  width: 28px;
  height: 4px;
  position: relative;
  border-radius: 2px;
}

.relation-line:after {
  content: "";
  position: absolute;
  right: -7px;
  top: -4px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid currentColor;
  transform: rotate(-90deg);
}

.relation-line.control { background-color: #d32f2f; }
.relation-line.control:after { border-top-color: #d32f2f; }
.relation-line.family { background-color: #ffb6b9; }
.relation-line.family:after { border-top-color: #ffb6b9; }
.relation-line.politics { background-color: #c0a16c; }
.relation-line.politics:after { border-top-color: #c0a16c; }
.relation-line.event { background-color: #388e3c; }
.relation-line.event:after { border-top-color: #388e3c; }

.graph-wrapper {
  width: 100%;
  height: 700px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(94, 140, 106, 0.2);
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  border: 1.5px solid rgba(94, 140, 106, 0.35);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.hint {
  text-align: center;
  color: #3a6c4f;
  font-size: 0.95rem;
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(94, 140, 106, 0.2);
  backdrop-filter: blur(5px);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #fdfcf9 100%);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(94, 140, 106, 0.3);
  max-width: 650px;
  width: 92%;
  max-height: 80vh;
  overflow: hidden;
  border: 2px solid rgba(94, 140, 106, 0.4);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #5e8c6a 0%, #4cae50 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header h2 {
  margin: 0;
  font-size: 2rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: all 0.2s;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.modal-body {
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
}

.character-story {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(94, 140, 106, 0.2);
}

.details-section h3,
.relations-section h3 {
  color: #5e8c6a;
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 140, 106, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-section h3:before,
.relations-section h3:before {
  content: "📜";
  font-size: 1.2rem;
}

.relations-section h3:before {
  content: "🔗";
}

.details-section ul {
  list-style: none;
  padding-left: 0;
  color: #555;
  line-height: 1.8;
  margin-bottom: 25px;
}

.details-section li {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f3ed 100%);
  border-left: 4px solid #5e8c6a;
  border-radius: 6px;
  position: relative;
}

.details-section li:before {
  content: "▪";
  color: #5e8c6a;
  font-weight: bold;
  margin-right: 8px;
}

.relations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.relation-item {
  background: linear-gradient(135deg, #faf9f6 0%, #f5f3ed 100%);
  padding: 16px 20px;
  border-radius: 10px;
  border-left: 6px solid;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(94, 140, 106, 0.1);
}

.relation-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(94, 140, 106, 0.2);
}

.relation-type {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.relation-target {
  color: #666;
  font-size: 1rem;
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .graph-wrapper { height: 500px; }
  .legend-container { flex-direction: column; gap: 15px; }
  .relations-list { grid-template-columns: 1fr; }
  h1 { font-size: 1.8rem; }
  .yiheyuan-network-container { padding: 15px; }
  .modal-content { width: 97%; margin: 10px; }
  .modal-header { padding: 20px; }
  .modal-header h2 { font-size: 1.6rem; }
  .modal-body { padding: 20px; }
}
</style>