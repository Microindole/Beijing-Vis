<template>
  <div class="tiantan-network-container">
    <div class="header">
      <h1>天坛人物关系网络</h1>
      <p class="subtitle">明清时期重要人物与天坛的关联图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>天坛</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon emperor"></span>
          <span>皇帝</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>大臣</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon ritual"></span>
          <span>祭祀官</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line ritual"></span>
          <span>祭祀关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line construction"></span>
          <span>营建关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line governance"></span>
          <span>政治关系</span>
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
                :key="`${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`"
                class="relation-item"
                :style="{ borderLeftColor: link.color }"
              >
                <div class="relation-type" :style="{ color: link.color }">
                  {{ link.relation }}
                </div>
                <div class="relation-target">
                  {{
                    (
                      (typeof link.source === 'object' ? link.source.id : link.source) === selectedNode?.id
                        ? graphData.nodes.find((n) => n.id === (typeof link.target === 'object' ? link.target.id : link.target))
                        : graphData.nodes.find((n) => n.id === (typeof link.source === 'object' ? link.source.id : link.source))
                    )?.name || '未知'
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
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import * as d3 from "d3";

const originalGraphData = {
  nodes: [
    {
      id: "天坛",
      name: "天坛",
      val: 60,
      color: "#d4a76a",
      type: "location",
      symbolSize: 30,
    },
    {
      id: "明永乐帝",
      name: "永乐",
      val: 25,
      color: "#8B4513",
      type: "emperor",
      symbolSize: 26,
    },
    {
      id: "明嘉靖帝",
      name: "嘉靖",
      val: 22,
      color: "#8B4513",
      type: "emperor",
      symbolSize: 24,
    },
    {
      id: "清康熙帝",
      name: "康熙",
      val: 20,
      color: "#8B4513",
      type: "emperor",
      symbolSize: 22,
    },
    {
      id: "清乾隆帝",
      name: "乾隆",
      val: 20,
      color: "#8B4513",
      type: "emperor",
      symbolSize: 22,
    },
    {
      id: "清雍正帝",
      name: "雍正",
      val: 18,
      color: "#8B4513",
      type: "emperor",
      symbolSize: 20,
    },
    {
      id: "蒯祥",
      name: "蒯祥",
      val: 16,
      color: "#A0522D",
      type: "architect",
      symbolSize: 18,

    },
    {
      id: "刘伯温",
      name: "刘伯温",
      val: 15,
      color: '#CD853F',
      type: "scholar",
      symbolSize: 17
    },
    {
      id: "于谦",
      name: "于谦",
      val: 14,
      color: '#A0522D',
      type: "official",
      symbolSize: 16
    },
    {
      id: "张居正",
      name: "张居正",
      val: 16,
      color: '#A0522D',
      type: "official",
      symbolSize: 18
    },
    {
      id: "太常寺卿",
      name: "太常寺卿",
      val: 13,
      color: '#DEB887',
      type: "ritual",
      symbolSize: 15
    },
    {
      id: "礼部尚书",
      name: "礼部尚书",
      val: 13,
      color: '#DEB887',
      type: "ritual",
      symbolSize: 15
    },
    {
      id: "钦天监正",
      name: "钦天监正",
      val: 12,
      color: '#D2B48C',
      type: "astronomer",
      symbolSize: 14
    },
    {
      id: "明万历帝",
      name: "万历",
      val: 17,
      color: '#8B4513',
      type: "emperor",
      symbolSize: 19
    },
    {
      id: "清光绪帝",
      name: "光绪",
      val: 15,
      color: '#8B4513',
      type: "emperor",
      symbolSize: 17
    },
    {
      id: "袁世凯",
      name: "袁世凯",
      val: 14,
      color: '#8B7355',
      type: "official",
      symbolSize: 16
    }
  ],
  links: [
    {
      source: "明永乐帝",
      target: "天坛",
      relation: "营建天坛",
      color: "#FF8C42",
      width: 5,
      curvature: 0.1,
    },
    {
      source: "明嘉靖帝",
      target: "天坛",
      relation: "大规模重建",
      color: "#FF8C42",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "清康熙帝",
      target: "天坛",
      relation: "恢复祭天礼",
      color: "#6B9BD2",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "清乾隆帝",
      target: "天坛",
      relation: "完善祭祀制度",
      color: "#6B9BD2",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "清雍正帝",
      target: "天坛",
      relation: "规范祭天仪式",
      color: "#6B9BD2",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "蒯祥",
      target: "明永乐帝",
      relation: "首席建筑师",
      color: "#82C09A",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "蒯祥",
      target: "天坛",
      relation: "设计建造",
      color: "#82C09A",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "刘伯温",
      target: "明永乐帝",
      relation: "风水顾问",
      color: "#D4A76A",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "刘伯温",
      target: "天坛",
      relation: "选址规划",
      color: "#D4A76A",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "于谦",
      target: "天坛",
      relation: "主持祭天仪式",
      color: "#F4B942",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "张居正",
      target: "明万历帝",
      relation: "首辅",
      color: "#B8860B",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "张居正",
      target: "天坛",
      relation: "改革祭祀制度",
      color: "#B8860B",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "太常寺卿",
      target: "天坛",
      relation: "管理祭祀",
      color: "#E6B800",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "礼部尚书",
      target: "天坛",
      relation: "制定礼仪",
      color: "#E6B800",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "钦天监正",
      target: "天坛",
      relation: "择定祭天时日",
      color: "#DAA520",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "明万历帝",
      target: "天坛",
      relation: "频繁祭天",
      color: "#FF8C42",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "清光绪帝",
      target: "天坛",
      relation: "最后祭天",
      color: "#9E9E9E",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "袁世凯",
      target: "天坛",
      relation: "称帝祭天",
      color: "#696969",
      width: 2,
      curvature: 0.1,
    },
    {
      source: "太常寺卿",
      target: "礼部尚书",
      relation: "协作关系",
      color: "#FF7043",
      width: 2,
      curvature: 0.4,
    },
    {
      source: "钦天监正",
      target: "太常寺卿",
      relation: "配合祭祀",
      color: "#7986CB",
      width: 2,
      curvature: 0.4,
    },
    {
      source: "明嘉靖帝",
      target: "明万历帝",
      relation: "祖孙",
      color: "#FFC107",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "清康熙帝",
      target: "清雍正帝",
      relation: "父子",
      color: "#26A69A",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "清雍正帝",
      target: "清乾隆帝",
      relation: "父子",
      color: "#26A69A",
      width: 2,
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
  天坛: {
    story:
      "天坛是明清两朝皇帝祭祀昊天上帝的圣地，体现了中国古代“天人合一”的哲学思想，是世界上现存最大的古代祭祀建筑群。",
    details: [
      "始建于明永乐十八年(1420年)",
      "占地约273万平方米",
      "1998年被列为世界文化遗产",
      "祭天仪式一年三次：孟春祈谷、仲夏祈雨、冬至祭天",
      "祈年殿、圜丘坛、皇穹宇等建筑布局严谨，寓意深远"
    ],
    events: [
      "嘉靖雷击事件",
      "光绪帝祈雨",
      "袁世凯称帝祭天"
    ]
  },
  明永乐帝: {
    story:
      "明朝第三位皇帝朱棣，迁都北京后营建天坛，确立了明清两代皇帝祭天的传统，体现了君权神授的政治理念。",
    details: [
      "原名朱棣，燕王起兵夺取皇位",
      "迁都北京，营建紫禁城和天坛",
      "确立祭天制度的基本框架",
      "在位22年(1402-1424)",
      "重视礼制，推动国家统一"
    ]
  },
  明嘉靖帝: {
    story:
      "明朝第十一位皇帝，对天坛进行了大规模的重建和扩建，将原来的天地坛分为天坛和地坛，完善了祭天建筑布局。",
    details: [
      "大礼议事件的主角",
      "将天地坛分离，专门祭天",
      "重建祈年殿，改为圆形建筑",
      "在位45年(1521-1566)",
      "曾遭遇天坛祈年殿雷击事件"
    ]
  },
  清康熙帝: {
    story:
      "清朝第四位皇帝，入关后继承并发展了明朝的祭天传统，在天坛恢复了中断的祭天大典，体现了满族统治者对汉族传统文化的尊重。",
    details: [
      "8岁登基，在位61年",
      "恢复并规范祭天仪式",
      "多次亲自到天坛祭天",
      "开创康乾盛世",
      "重视天文历法与祭祀结合"
    ]
  },
  清乾隆帝: {
    story:
      "清朝第六位皇帝，在位期间进一步完善了天坛的祭祀制度，增建了斋宫等建筑，使天坛的功能更加完备。",
    details: [
      "在位60年，实际掌权63年",
      "增建斋宫，完善祭祀设施",
      "制定详细的祭天礼仪",
      "文治武功达到顶峰",
      "多次亲自撰写祭天文"
    ]
  },
  清雍正帝: {
    story:
      "清朝第五位皇帝，以勤政著称，对祭天仪式极为重视，规范了祭天的各项礼仪制度。",
    details: [
      "康熙第四子，44岁即位",
      "在位13年，勤于政务",
      "严格遵循祭天传统",
      "建立密折制度",
      "亲自校订祭祀仪注"
    ]
  },
  蒯祥: {
    story:
      "明代著名建筑师，被誉为“木圣”，主持设计建造了包括天坛在内的多座重要建筑，其精湛的建筑技艺为后世所敬仰。",
    details: [
      "江苏吴县人，世代木匠",
      "主持营建紫禁城和天坛",
      "被誉为明代第一建筑师",
      "其家族世代为皇家建筑师",
      "以榫卯结构闻名"
    ]
  },
  刘伯温: {
    story:
      "明朝开国功臣，精通天文地理，参与了北京城和天坛的选址规划，其深厚的易学功底为天坛的建设提供了理论指导。",
    details: [
      "浙江青田人，博学多才",
      "辅佐朱元璋建立明朝",
      "精通天文、地理、兵法",
      "参与北京城整体规划",
      "传说中“刘伯温定都北京”"
    ]
  },
  于谦: {
    story:
      "明朝重要大臣，曾多次主持天坛的祭天仪式，在土木堡之变后力挽狂澜，保卫北京城，体现了忠君爱国的精神。",
    details: [
      "浙江钱塘人，明代名臣",
      "土木堡之变后拥立景泰帝",
      "多次主持祭天大典",
      "以清廉和爱国著称",
      "有“石灰吟”传世"
    ]
  },
  张居正: {
    story:
      "明朝著名政治家，万历初年的首辅，推行改革的同时也改革了祭祀制度，使天坛的管理更加规范化。",
    details: [
      "湖北江陵人，明代改革家",
      "万历初年担任首辅十年",
      "推行万历新政",
      "改革祭祀和财政制度",
      "主张“礼法并重”"
    ]
  },
  太常寺卿: {
    story:
      "负责管理天坛祭祀事务的重要官职，历代太常寺卿都是祭天仪式的主要组织者和执行者。",
    details: [
      "九卿之一，专管礼乐祭祀",
      "负责天坛日常管理",
      "制定祭祀流程和规范",
      "培训祭祀人员",
      "如明代太常寺卿李时勉等"
    ]
  },
  礼部尚书: {
    story:
      "六部之一的礼部最高长官，负责制定包括祭天在内的各种国家礼仪制度，是天坛祭祀活动的总负责人。",
    details: [
      "六部之一的最高长官",
      "制定国家礼仪制度",
      "监督祭祀活动执行",
      "培养礼仪人才",
      "如明代礼部尚书夏言等"
    ]
  },
  钦天监正: {
    story:
      "掌管天文历法的官员，负责为祭天仪式择定吉日良辰，其天文知识对祭天活动至关重要。",
    details: [
      "掌管天文历法的最高官员",
      "负责择定祭天日期",
      "观测天象变化",
      "编制历法",
      "如清代钦天监正吴琯等"
    ]
  },
  明万历帝: {
    story:
      "明朝第十三位皇帝，在位48年，前期勤于政务，经常到天坛祭天，后期怠政但祭天活动从未间断。",
    details: [
      "10岁即位，在位48年",
      "前期有张居正辅政",
      "频繁举行祭天仪式",
      "后期二十多年不上朝",
      "祭天活动成为政治象征"
    ]
  },
  清光绪帝: {
    story:
      "清朝倒数第二位皇帝，在天坛举行了中国历史上最后一次正式的皇帝祭天大典，见证了传统祭天制度的终结。",
    details: [
      "4岁即位，实际被慈禧控制",
      "戊戌变法的支持者",
      "举行最后一次皇帝祭天",
      "38岁去世，疑被毒死",
      "清末新政的见证者"
    ]
  },
  袁世凯: {
    story:
      "中华民国临时大总统，1915年称帝后曾到天坛祭天，试图借此获得统治的合法性，但很快在全国反对声中取消帝制。",
    details: [
      "北洋军阀首领",
      "逼迫清帝退位",
      "1915年称帝，改元洪宪",
      "在天坛举行祭天仪式，83天后取消帝制",
      "中国近代史重要转折人物"
    ]
  }
};

// 获取节点相关的所有关系
const getNodeRelations = (node) => {
  if (!node) return [];
  return graphData.value.links.filter(
    (link) =>
      (typeof link.source === 'object' ? link.source.id : link.source) === node.id ||
      (typeof link.target === 'object' ? link.target.id : link.target) === node.id
  );
};

// 筛选图数据的函数
const filterGraphData = (nodeId) => {
  if (!nodeId) {
    displayedGraphData.value = { ...allGraphData.value };
    return;
  }

  const relatedLinks = allGraphData.value.links.filter(
    (link) => link.source.id === nodeId || link.target.id === nodeId
  );

  const relatedNodeIds = new Set();
  relatedNodeIds.add(nodeId);
  relatedLinks.forEach((link) => {
    relatedNodeIds.add(link.source.id);
    relatedNodeIds.add(link.target.id);
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
    const distance = 150;
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
      3000
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
      { x: 0, y: 0, z: 600 },
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
          new THREE.SphereGeometry(node.val * 0.2, 32, 32),
          new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
          })
        );
        group.add(halo);

        // 节点主体
        const geometry = new THREE.IcosahedronGeometry(node.val * 0.15, 2);
        const texture = new THREE.TextureLoader().load(node.img);
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          specular: 0x111111,
          shininess: 30,
          transparent: true,
        });
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);

        // 节点边框
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: node.color,
          linewidth: 3,
        });
        const edgesMesh = new THREE.LineSegments(edges, edgeMaterial);
        edgesMesh.scale.set(1.1, 1.1, 1.1);
        group.add(edgesMesh);

        // 节点文本标签
        const text = new SpriteText(node.name);
        text.color = "#222";
        text.backgroundColor = "rgba(255, 255, 255, 0.9)";
        text.borderColor = node.color;
        text.borderWidth = 2;
        text.borderRadius = 5;
        text.padding = 8;
        text.textHeight = 10;
        text.position.y += node.val * 0.2 + 15;
        group.add(text);

        group.userData = {
          originalScale: 1,
          hoverScale: 1.3,
        };
        return group;
      })
      .linkColor((link) => link.color)
      .linkWidth((link) => link.width)
      .linkDirectionalParticles(0)
      .linkDirectionalArrowLength(0)
      .linkCurvature((link) => link.curvature)
      .linkOpacity(0.9)
      .linkThreeObject((link) => {
        const group = new THREE.Group();

        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: link.color,
          linewidth: link.width,
          transparent: true,
          opacity: 0.9,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);

        const sprite = new SpriteText(link.relation);
        sprite.color = "#333";
        sprite.backgroundColor = "rgba(255, 255, 255, 0.6)";
        sprite.borderColor = "rgba(0, 0, 0, 0.2)";
        sprite.borderWidth = 1;
        sprite.borderRadius = 3;
        sprite.padding = 3;
        sprite.textHeight = 10;
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
              (link.source && link.source.id === hoveredNode.id) ||
              (link.target && link.target.id === hoveredNode.id)
            ) {
              if (link.__sprite) {
                link.__sprite.visible = true;
              }
              forceGraphInstance.linkColor((l) =>
                l === link ? "#ff0000" : l.color
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
        d3.forceCollide().radius((d) => d.val * 0.2 + 50)
      );

    forceGraphInstance.cameraPosition({ x: 0, y: 0, z: 600 });
    forceGraphInstance.scene().add(new THREE.AmbientLight(0xffffff, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
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
.tiantan-network-container {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background: linear-gradient(135deg, #fcf8f3 0%, #f4e8d0 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #d4a76a;
  font-size: 2.4rem;
  margin-bottom: 8px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: #8b6914;
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
  box-shadow: 0 4px 16px rgba(212, 167, 106, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 167, 106, 0.3);
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
  color: #8b6914;
}

.legend-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #d4a76a;
  box-shadow: 0 1px 3px rgba(212, 167, 106, 0.3);
}

.legend-icon.location {
  background-color: #d4a76a;
}
.legend-icon.emperor {
  background-color: #8b4513;
}
.legend-icon.official {
  background-color: #a0522d;
}
.legend-icon.ritual {
  background-color: #deb887;
}

.relation-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  position: relative;
}

.relation-line:after {
  content: "";
  position: absolute;
  right: 0;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid currentColor;
  transform: rotate(-90deg);
}

.relation-line.ritual {
  background-color: #6B9BD2;
}
.relation-line.ritual:after {
  border-top-color: #6B9BD2;
}
.relation-line.construction {
  background-color: #FF8C42;
}
.relation-line.construction:after {
  border-top-color: #FF8C42;
}
.relation-line.governance {
  background-color: #82C09A;
}
.relation-line.governance:after {
  border-top-color: #82C09A;
}

.graph-wrapper {
  width: 100%;
  height: 650px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(212, 167, 106, 0.2);
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  border: 1px solid rgba(212, 167, 106, 0.3);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.hint {
  text-align: center;
  color: #8b6914;
  font-size: 0.9rem;
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(212, 167, 106, 0.2);
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
  box-shadow: 0 20px 60px rgba(212, 167, 106, 0.3);
  max-width: 1200px;
  width: 98%;
  max-height: 95vh;
  overflow: hidden;
  border: 2px solid rgba(212, 167, 106, 0.4);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #d4a76a 0%, #c29448 100%);
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
  border-bottom: 2px solid rgba(212, 167, 106, 0.2);
}

.details-section h3,
.relations-section h3 {
  color: #d4a76a;
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(212, 167, 106, 0.2);
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
  border-left: 4px solid #d4a76a;
  border-radius: 6px;
  position: relative;
}

.details-section li:before {
  content: "▪";
  color: #d4a76a;
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
  border-left: 4px solid;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(212, 167, 106, 0.1);
}

.relation-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(212, 167, 106, 0.2);
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

  .tiantan-network-container {
    padding: 15px;
  }

  .modal-content {
    width: 95%;
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