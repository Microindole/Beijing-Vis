<template>
  <div class="beihai-network-container">
    <div class="header">
      <h1>北海公园人物关系网络</h1>
      <p class="subtitle">历代帝王、僧侣、工匠与北海的传奇关联，见证千年皇家园林的兴衰与辉煌</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>北海</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon emperor"></span>
          <span>皇帝</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon monk"></span>
          <span>高僧</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon craftsman"></span>
          <span>工匠</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon landmark"></span>
          <span>地标</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line build"></span>
          <span>营建/修缮</span>
        </div>
        <div class="legend-item">
          <span class="relation-line legend"></span>
          <span>传说/故事</span>
        </div>
        <div class="legend-item">
          <span class="relation-line faith"></span>
          <span>宗教信仰</span>
        </div>
        <div class="legend-item">
          <span class="relation-line art"></span>
          <span>艺术成就</span>
        </div>
        <div class="legend-item">
          <span class="relation-line family"></span>
          <span>家族/师承</span>
        </div>
      </div>
    </div>

    <div class="graph-wrapper" ref="graphContainerRef"></div>

    <div class="hint" v-if="!selectedNode">
      <p>点击节点查看详细信息 • 拖动旋转视图 • 滚轮缩放</p>
    </div>

    <!-- 弹窗模态框 -->
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

// 丰富的北海公园人物与关系数据
const originalGraphData = {
  nodes: [
    {
      id: "北海",
      name: "北海",
      val: 65,
      color: "#5e8c6a",
      type: "location",
      symbolSize: 32,
      img: "/icons/beihai.png",
    },
    {
      id: "辽圣宗",
      name: "辽圣宗",
      val: 22,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/liaoshengzong.png",
    },
    {
      id: "金世宗",
      name: "金世宗",
      val: 20,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/jinshizong.png",
    },
    {
      id: "元世祖",
      name: "元世祖 忽必烈",
      val: 24,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 26,
      img: "/icons/hubilie.png",
    },
    {
      id: "明成祖",
      name: "明成祖 朱棣",
      val: 22,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/zhudi.png",
    },
    {
      id: "清乾隆帝",
      name: "清乾隆帝",
      val: 22,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/qianlong.png",
    },
    {
      id: "罗汉僧",
      name: "罗汉僧",
      val: 17,
      color: "#7a8c7a",
      type: "monk",
      symbolSize: 19,
      img: "/icons/luohanseng.png",
    },
    {
      id: "阿旺嘉措",
      name: "阿旺嘉措",
      val: 17,
      color: "#7a8c7a",
      type: "monk",
      symbolSize: 19,
      img: "/icons/awangjiacuo.png",
    },
    {
      id: "阿尔斯楞",
      name: "阿尔斯楞",
      val: 16,
      color: "#b3cbb9",
      type: "craftsman",
      symbolSize: 17,
      img: "/icons/aersileng.png",
    },
    {
      id: "白塔",
      name: "白塔",
      val: 20,
      color: "#eaf3ec",
      type: "landmark",
      symbolSize: 22,
      img: "/icons/baita.png",
    },
    {
      id: "九龙壁",
      name: "九龙壁",
      val: 18,
      color: "#c0a16c",
      type: "landmark",
      symbolSize: 20,
      img: "/icons/jiulongbi.png",
    },
    {
      id: "琼华岛",
      name: "琼华岛",
      val: 18,
      color: "#7a6348",
      type: "landmark",
      symbolSize: 20,
      img: "/icons/qionghuadao.png",
    },
    {
      id: "尼泊尔工匠",
      name: "尼泊尔工匠",
      val: 15,
      color: "#b388ff",
      type: "craftsman",
      symbolSize: 16,
      img: "/icons/nepal.png",
    },
    {
      id: "乾隆皇后",
      name: "乾隆皇后",
      val: 14,
      color: "#ffb6b9",
      type: "emperor",
      symbolSize: 15,
      img: "/icons/empress.png",
    },
  ],
  links: [
    {
      source: "辽圣宗",
      target: "北海",
      relation: "初建皇家园林",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "金世宗",
      target: "北海",
      relation: "扩建琼华岛",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "元世祖",
      target: "北海",
      relation: "设大都宫苑",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "明成祖",
      target: "北海",
      relation: "重修北海",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "清乾隆帝",
      target: "北海",
      relation: "扩建御花园",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "罗汉僧",
      target: "北海",
      relation: "传教布道",
      color: "#7a8c7a",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "阿旺嘉措",
      target: "北海",
      relation: "修建佛塔",
      color: "#7a8c7a",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "阿尔斯楞",
      target: "北海",
      relation: "参与营建",
      color: "#b3cbb9",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "白塔",
      target: "北海",
      relation: "地标性建筑",
      color: "#eaf3ec",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "九龙壁",
      target: "北海",
      relation: "皇家艺术瑰宝",
      color: "#c0a16c",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "琼华岛",
      target: "北海",
      relation: "园林核心",
      color: "#7a6348",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "尼泊尔工匠",
      target: "白塔",
      relation: "设计建造",
      color: "#b388ff",
      width: 5,
      curvature: 0.22,
    },
    {
      source: "清乾隆帝",
      target: "九龙壁",
      relation: "主持修建",
      color: "#c0a16c",
      width: 5,
      curvature: 0.22,
    },
    {
      source: "乾隆皇后",
      target: "清乾隆帝",
      relation: "皇室家族",
      color: "#ffb6b9",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "罗汉僧",
      target: "阿旺嘉措",
      relation: "佛教传承",
      color: "#8bc34a",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "阿旺嘉措",
      target: "尼泊尔工匠",
      relation: "佛塔合作",
      color: "#b388ff",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "阿尔斯楞",
      target: "尼泊尔工匠",
      relation: "工艺交流",
      color: "#b388ff",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "辽圣宗",
      target: "金世宗",
      relation: "父子关系",
      color: "#ffc107",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "金世宗",
      target: "元世祖",
      relation: "祖孙关系",
      color: "#ffc107",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "元世祖",
      target: "明成祖",
      relation: "师徒关系",
      color: "#8bc34a",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "明成祖",
      target: "清乾隆帝",
      relation: "皇室血脉",
      color: "#8bc34a",
      width: 3,
      curvature: 0.3,
    },
  ],
};

const graphContainerRef = ref(null);
let forceGraphInstance = null;

const selectedNode = ref(null);
const characterInfo = ref(null);
const showModal = ref(false);
const allGraphData = ref(originalGraphData);
const displayedGraphData = ref({ nodes: [], links: [] });

const graphData = ref({
  nodes: originalGraphData.nodes,
  links: originalGraphData.links,
});

const characterInfos = {
  北海: {
    story:
      "北海公园始建于金代，元代忽必烈设大都宫苑，明清两代多次扩建修缮，成为中国现存最古老、最完整的皇家园林之一。园内不仅有白塔、九龙壁、琼华岛等地标，更承载着帝王理政、宗教交流、艺术创造等多重历史文化。",
    details: [
      "金代大定年间始建，名为太液池",
      "元代设为大都宫苑，成为皇家园林核心",
      "明成祖朱棣重修，定名北海",
      "清乾隆帝大规模扩建，增建御花园",
      "1925年对公众开放，成为文化遗产典范",
    ],
  },
  辽圣宗: {
    story:
      "辽圣宗是契丹族的杰出皇帝，北海早期皇家园林的奠基者之一，为后世园林格局打下基础。",
    details: [
      "契丹族人，辽朝第二位皇帝",
      "在位期间开发北海地区，初建皇家园林",
      "推动契丹与汉族文化交流",
      "为金、元、明清园林发展奠定基础",
    ],
  },
  金世宗: {
    story:
      "金世宗女真族皇帝，扩建北海，增设琼华岛，推动园林艺术与皇家文化融合。",
    details: [
      "女真族人，金朝第二位皇帝",
      "扩建北海，增设琼华岛",
      "加强女真与汉族融合",
      "提升北海园林的艺术与文化地位",
    ],
  },
  元世祖: {
    story:
      "元世祖忽必烈，蒙古族开国皇帝，将北海设为大都宫苑，开启皇家园林新纪元。",
    details: [
      "蒙古族人，元朝开国皇帝",
      "设大都宫苑于北海，园林规模空前",
      "促进蒙古与汉族文化交流",
      "北海成为元大都的政治与文化中心",
    ],
  },
  明成祖: {
    story:
      "明成祖朱棣，迁都北京后重修北海，定名北海，园林布局趋于完善，成为皇家游赏与理政重地。",
    details: [
      "明太祖朱元璋之子，靖难之役夺位",
      "迁都北京后大力发展北海",
      "完善园林格局，增建亭台楼阁",
      "多次在北海举办盛大宴饮与朝会",
    ],
  },
  清乾隆帝: {
    story:
      "清乾隆帝，文化艺术的推崇者，对北海进行大规模扩建，主持修建九龙壁、御花园等，留下大量诗文与艺术遗产。",
    details: [
      "清高宗，爱新觉罗·弘历",
      "扩建北海御花园，修建九龙壁",
      "多次游览北海，赋诗吟咏",
      "推动园林艺术与皇家文化融合",
    ],
  },
  罗汉僧: {
    story:
      "罗汉僧，佛教高僧，在北海一带传教布道，推动佛教文化在皇家园林中的传播。",
    details: [
      "法名不详，世称罗汉僧",
      "精通佛教经典，弘扬佛法",
      "在北海地区建立佛教寺院",
      "与藏传佛教高僧交流密切",
    ],
  },
  阿旺嘉措: {
    story:
      "阿旺嘉措，藏传佛教高僧，主持修建北海佛塔，促进藏汉宗教文化交流。",
    details: [
      "藏族人，精通藏传佛教教义",
      "主持修建北海佛塔（白塔）",
      "与尼泊尔工匠合作，融合多元建筑风格",
      "推动佛教文化在北海的传播",
    ],
  },
  阿尔斯楞: {
    story:
      "阿尔斯楞，著名工匠，参与北海多项建筑营建与修缮，工艺精湛，促进中外工艺交流。",
    details: [
      "工匠世家，精通木工、石雕等技艺",
      "参与北海、白塔等建筑修缮",
      "与尼泊尔工匠交流合作",
      "后代亦为著名工匠",
    ],
  },
  白塔: {
    story:
      "白塔，北海地标，清顺治八年由尼泊尔工匠设计建造，象征民族团结与宗教融合。",
    details: [
      "始建于清顺治八年（1651年）",
      "尼泊尔工匠设计，融合藏传佛教风格",
      "多次修缮，成为北海最具代表性地标",
      "见证中外文化与宗教交流",
    ],
  },
  九龙壁: {
    story:
      "九龙壁，清乾隆年间修建，壁上九条巨龙栩栩如生，是中国古代琉璃艺术的杰作。",
    details: [
      "建于清乾隆二十一年（1756年）",
      "壁长25.86米，高6.65米，厚1.42米",
      "九条巨龙象征皇权与吉祥",
      "色彩斑斓，工艺精湛，艺术价值极高",
    ],
  },
  琼华岛: {
    story:
      "琼华岛，北海湖心岛屿，园林布局核心，岛上白塔、永安寺等景观交相辉映。",
    details: [
      "位于北海湖心，面积1.24公顷",
      "岛上有白塔、永安寺、明珠照夜等景观",
      "体现中国古代园林“以岛为心”的布局智慧",
      "皇家游赏、宗教活动的重要场所",
    ],
  },
  尼泊尔工匠: {
    story:
      "尼泊尔工匠，受清廷邀请，设计建造北海白塔，推动中外建筑与工艺交流。",
    details: [
      "精通佛塔建筑与雕刻工艺",
      "设计建造北海白塔，融合多元风格",
      "与阿旺嘉措、阿尔斯楞等合作",
      "促进中尼文化与工艺交流",
    ],
  },
  乾隆皇后: {
    story:
      "乾隆皇后，清乾隆帝的皇后，参与北海御花园的规划与皇家活动，见证园林盛世。",
    details: [
      "清乾隆帝的皇后，深受宠爱",
      "多次陪同乾隆帝游览北海",
      "参与御花园规划与皇家宴饮",
      "见证北海园林的鼎盛时期",
    ],
  },
};

// 获取节点相关的所有关系
const getNodeRelations = (node) => {
  if (!node) return [];
  return graphData.value.links.filter(
    (link) => link.source === node.id || link.target === node.id
  );
};

// 筛选图数据的函数
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

  displayedGraphData.value = {
    nodes: filteredNodes,
    links: relatedLinks,
  };
};

// 处理节点点击
const handleNodeClick = (node) => {
  selectedNode.value = node;
  characterInfo.value = characterInfos[node.id] || {
    story: "暂无详细信息。",
    details: [],
  };
  showModal.value = true;
  
  // 筛选并更新图数据
  filterGraphData(node.id);
  forceGraphInstance.graphData(displayedGraphData.value);

  // 聚焦到选中节点
  if (forceGraphInstance && node) {
    const distance = 180;
    const nodeDistance = Math.hypot(node.x, node.y, node.z);
    const sizeFactor = node.val ? node.val * 0.1 : 1;
    const targetDistance =
      (nodeDistance > 0 ? nodeDistance : 1) + distance + sizeFactor * 5;

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

// 关闭弹窗
const closeModal = () => {
  showModal.value = false;
  selectedNode.value = null;
  characterInfo.value = null;
  
  // 恢复显示所有数据
  filterGraphData(null);
  forceGraphInstance.graphData(displayedGraphData.value);

  if (forceGraphInstance) {
    forceGraphInstance.cameraPosition(
      { x: 0, y: 0, z: 700 },
      { x: 0, y: 0, z: 0 },
      1000
    );
  }
};

// 初始化3D图
onMounted(() => {
  filterGraphData(null);

  if (graphContainerRef.value) {
    forceGraphInstance = ForceGraph3D()(graphContainerRef.value)
      .graphData(displayedGraphData.value)
      .nodeVal("val")
      .nodeColor("color")
      .nodeThreeObject((node) => {
        const group = new THREE.Group();

        // 节点光晕
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(node.val * 0.22, 32, 32),
          new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
          })
        );
        group.add(halo);

        // 节点主体
        const geometry = new THREE.IcosahedronGeometry(node.val * 0.16, 2);
        const texture = new THREE.TextureLoader().load(node.img);
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          specular: 0x111111,
          shininess: 40,
          transparent: true,
        });
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);

        // 节点边框
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: node.color,
          linewidth: 4,
        });
        const edgesMesh = new THREE.LineSegments(edges, edgeMaterial);
        edgesMesh.scale.set(1.13, 1.13, 1.13);
        group.add(edgesMesh);

        // 节点文本标签
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

        group.userData = {
          originalScale: 1,
          hoverScale: 1.3,
        };
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

        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: link.color,
          linewidth: link.width * 2,
          transparent: true,
          opacity: 1,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);

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

        group.userData = {
          originalWidth: link.width,
          highlightWidth: link.width * 3,
        };

        link.__sprite = sprite;

        group.__updatePosition = (start, end) => {
          const vertices = new Float32Array([
            start.x,
            start.y,
            start.z,
            end.x,
            end.y,
            end.z,
          ]);
          lineGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(vertices, 3)
          );
          lineGeometry.attributes.position.needsUpdate = true;

          const middlePos = new THREE.Vector3(
            start.x + (end.x - start.x) * 0.5,
            start.y + (end.y - start.y) * 0.5,
            start.z + (end.z - start.z) * 0.5
          );
          Object.assign(sprite.position, middlePos);

          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          sprite.rotation.z = angle;
        };
        return group;
      })
      .linkPositionUpdate((obj, { start, end }) => {
        obj.__updatePosition(start, end);
      })
      .backgroundColor("rgba(252, 248, 243, 0.8)")
      .onNodeClick(handleNodeClick)
      .onNodeHover((hoveredNode) => {
        graphContainerRef.value.style.cursor = hoveredNode ? "pointer" : null;

        allGraphData.value.links.forEach((link) => {
          if (link.__sprite) {
            link.__sprite.visible = false;
          }
        });

        const linksToProcess = selectedNode.value
          ? displayedGraphData.value.links
          : allGraphData.value.links;

        if (hoveredNode) {
          linksToProcess.forEach((link) => {
            if (
              (link.source && link.source === hoveredNode.id) ||
              (link.target && link.target === hoveredNode.id)
            ) {
              if (link.__sprite) {
                link.__sprite.visible = true;
              }
              forceGraphInstance.linkColor((l) =>
                l === link ? "#ff1744" : l.color
              );
            }
          });
        } else {
          forceGraphInstance.linkColor((link) => link.color);
        }
      })
      .onLinkHover((link) => {
        graphContainerRef.value.style.cursor = link ? "pointer" : null;
      })
      .d3Force(
        "link",
        d3
          .forceLink()
          .id((d) => d.id)
          .distance(350)
      )
      .d3Force("center", d3.forceCenter())
      .d3Force(
        "collision",
        d3.forceCollide().radius((d) => d.val * 0.2 + 55)
      );

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
.beihai-network-container {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
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
.legend-icon.location {
  background-color: #5e8c6a;
}
.legend-icon.emperor {
  background-color: #3a6c4f;
}
.legend-icon.monk {
  background-color: #7a8c7a;
}
.legend-icon.craftsman {
  background-color: #b3cbb9;
}
.legend-icon.landmark {
  background-color: #c0a16c;
}

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

.relation-line.build {
  background-color: #388e3c;
}
.relation-line.build:after {
  border-top-color: #388e3c;
}
.relation-line.legend {
  background-color: #ffc107;
}
.relation-line.legend:after {
  border-top-color: #ffc107;
}
.relation-line.faith {
  background-color: #8bc34a;
}
.relation-line.faith:after {
  border-top-color: #8bc34a;
}
.relation-line.art {
  background-color: #c0a16c;
}
.relation-line.art:after {
  border-top-color: #c0a16c;
}
.relation-line.family {
  background-color: #ffb6b9;
}
.relation-line.family:after {
  border-top-color: #ffb6b9;
}

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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .graph-wrapper {
    height: 500px;
  }

  .legend-container {
    flex-direction: column;
    gap: 15px;
  }

  .relations-list {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.8rem;
  }

  .beihai-network-container {
    padding: 15px;
  }

  .modal-content {
    width: 97%;
    margin: 10px;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 1.6rem;
  }

  .modal-body {
    padding: 20px;
  }
}
</style>