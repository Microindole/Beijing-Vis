<template>
  <div class="greatwall-network-container">
    <div class="header">
      <h1>长城人物关系网络</h1>
      <p class="subtitle">历代帝王、将领、工匠与长城的传奇关联，见证中华民族的防御智慧与民族融合</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>长城</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon emperor"></span>
          <span>皇帝</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon general"></span>
          <span>将领</span>
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
          <span>修筑/扩建</span>
        </div>
        <div class="legend-item">
          <span class="relation-line legend"></span>
          <span>传说/故事</span>
        </div>
        <div class="legend-item">
          <span class="relation-line defense"></span>
          <span>防御/战役</span>
        </div>
        <div class="legend-item">
          <span class="relation-line art"></span>
          <span>工程成就</span>
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

// 长城人物与关系数据
const originalGraphData = {
  nodes: [
    {
      id: "长城",
      name: "长城",
      val: 70,
      color: "#8b5a2b",
      type: "location",
      symbolSize: 34,
      img: "/icons/greatwall.png",
    },
    {
      id: "秦始皇",
      name: "秦始皇",
      val: 28,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 26,
      img: "/icons/qinshihuang.png",
    },
    {
      id: "蒙恬",
      name: "蒙恬",
      val: 22,
      color: "#5e8c6a",
      type: "general",
      symbolSize: 22,
      img: "/icons/mengtian.png",
    },
    {
      id: "汉武帝",
      name: "汉武帝",
      val: 24,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/hanwudi.png",
    },
    {
      id: "卫青",
      name: "卫青",
      val: 18,
      color: "#5e8c6a",
      type: "general",
      symbolSize: 20,
      img: "/icons/weiqing.png",
    },
    {
      id: "霍去病",
      name: "霍去病",
      val: 18,
      color: "#5e8c6a",
      type: "general",
      symbolSize: 20,
      img: "/icons/huoqubing.png",
    },
    {
      id: "戚继光",
      name: "戚继光",
      val: 22,
      color: "#5e8c6a",
      type: "general",
      symbolSize: 22,
      img: "/icons/qijiguang.png",
    },
    {
      id: "朱元璋",
      name: "朱元璋",
      val: 20,
      color: "#3a6c4f",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/zhuyuanzhang.png",
    },
    {
      id: "徐达",
      name: "徐达",
      val: 18,
      color: "#5e8c6a",
      type: "general",
      symbolSize: 20,
      img: "/icons/xuda.png",
    },
    {
      id: "孟姜女",
      name: "孟姜女",
      val: 16,
      color: "#b3cbb9",
      type: "legend",
      symbolSize: 18,
      img: "/icons/mengjiangnv.png",
    },
    {
      id: "八达岭",
      name: "八达岭",
      val: 18,
      color: "#c0a16c",
      type: "landmark",
      symbolSize: 20,
      img: "/icons/badaling.png",
    },
    {
      id: "嘉峪关",
      name: "嘉峪关",
      val: 18,
      color: "#c0a16c",
      type: "landmark",
      symbolSize: 20,
      img: "/icons/jiayuguan.png",
    },
    {
      id: "工匠群体",
      name: "工匠群体",
      val: 16,
      color: "#b3cbb9",
      type: "craftsman",
      symbolSize: 18,
      img: "/icons/craftsman.png",
    }
  ],
  links: [
    {
      source: "秦始皇",
      target: "长城",
      relation: "统一修筑",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "蒙恬",
      target: "长城",
      relation: "主持修筑",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "汉武帝",
      target: "长城",
      relation: "西延河西走廊",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "卫青",
      target: "长城",
      relation: "防御匈奴",
      color: "#388e3c",
      width: 5,
      curvature: 0.15,
    },
    {
      source: "霍去病",
      target: "长城",
      relation: "北击匈奴",
      color: "#388e3c",
      width: 5,
      curvature: 0.15,
    },
    {
      source: "朱元璋",
      target: "长城",
      relation: "明代大修",
      color: "#388e3c",
      width: 6,
      curvature: 0.12,
    },
    {
      source: "戚继光",
      target: "长城",
      relation: "抗倭防御",
      color: "#388e3c",
      width: 5,
      curvature: 0.15,
    },
    {
      source: "徐达",
      target: "长城",
      relation: "主持修缮",
      color: "#388e3c",
      width: 5,
      curvature: 0.15,
    },
    {
      source: "孟姜女",
      target: "长城",
      relation: "传说故事",
      color: "#ffc107",
      width: 5,
      curvature: 0.18,
    },
    {
      source: "八达岭",
      target: "长城",
      relation: "著名地标",
      color: "#c0a16c",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "嘉峪关",
      target: "长城",
      relation: "西端关隘",
      color: "#c0a16c",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "工匠群体",
      target: "长城",
      relation: "工程建造",
      color: "#b3cbb9",
      width: 4,
      curvature: 0.18,
    },
    {
      source: "秦始皇",
      target: "蒙恬",
      relation: "君臣关系",
      color: "#ffb6b9",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "朱元璋",
      target: "徐达",
      relation: "君臣关系",
      color: "#ffb6b9",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "戚继光",
      target: "朱元璋",
      relation: "明代将领",
      color: "#8bc34a",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "卫青",
      target: "霍去病",
      relation: "舅甥关系",
      color: "#ffc107",
      width: 3,
      curvature: 0.25,
    },
    {
      source: "工匠群体",
      target: "孟姜女",
      relation: "传说牵连",
      color: "#ffc107",
      width: 3,
      curvature: 0.25,
    }
  ]
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
  长城: {
    story:
      "长城是中国古代伟大的防御工程，历经多个朝代的修建与扩展，尤其是秦始皇时期的统一修筑，奠定了其宏伟的基础。长城不仅是军事防御的杰作，也是中华民族智慧与毅力的象征。",
    details: [
      "始建于公元前7世纪，春秋时期的防御工事",
      "秦始皇统一六国后，连接和扩建为万里长城",
      "汉武帝时，长城西延至河西走廊",
      "明代对长城进行大规模修缮和扩建",
      "长城沿线设有烽火台、城堡等军事设施",
      "2012年，长城被列为世界文化遗产",
    ],
  },
  秦始皇: {
    story:
      "秦始皇是中国历史上第一个皇帝，他在位期间统一了六国，结束了长期的战乱局面。他还组织修建了大量的基础设施，包括著名的万里长征和连接各地的运河，为中国的统一和发展做出了巨大贡献。",
    details: [
      "姓嬴名政，秦庄襄王之子",
      "公元前221年，统一六国，建立中央集权制",
      "进行大规模的基础设施建设",
      "修建万里长征，连接各地的交通网络",
      "推行统一的度量衡和货币制度",
      "促进了经济的发展和文化的交流",
    ],
  },
  蒙恬: {
    story:
      "蒙恬是秦朝著名的将领，他在秦始皇时期负责修建长城，并率军抵御匈奴的侵扰。他的军事才能和对长城的贡献，使他成为中国历史上著名的防御工程师之一。",
    details: [
      "字子男，秦朝著名将领",
      "负责修建长城，抵御匈奴侵扰",
      "被封为平原君，封地在今河北省",
      "后世尊称为‘蒙神’或‘蒙大将军’",
      "与卫青、霍去病齐名，被誉为‘三绝’",
    ],
  },
  汉武帝: {
    story:
      "汉武帝是西汉时期的皇帝，他在位期间加强了中央集权，开展了对外征伐，开拓了丝绸之路，促进了中西文化的交流。他还进行了一系列的政治、经济和文化改革，为汉朝的繁荣奠定了基础。",
    details: [
      "姓刘名彻，汉景帝之子",
      "公元前141年即位，开始进行改革",
      "加强中央集权，削弱地方势力",
      "开拓丝绸之路，促进中西文化交流",
      "进行对外征伐，扩展汉朝疆域",
      "推行均输平准法，发展经济",
    ],
  },
  卫青: {
    story:
      "卫青是汉代著名的将领，他因平定匈奴的叛乱而被汉武帝赏识，后被封为大将军。他的军事才能和对国家的忠诚，使他成为汉朝的重要人物之一。",
    details: [
      "汉武帝时期的著名将领",
      "平定匈奴叛乱，恢复边疆稳定",
      "被封为大将军，掌握军政大权",
      "与霍去病、蒙恬齐名，被誉为‘三绝’",
      "后世尊称为‘卫公’或‘卫大将军’",
    ],
  },
  霍去病: {
    story:
      "霍去病是汉武帝时期的著名将领，他多次率军出征，打败匈奴，收复失地，为汉朝的稳定和发展做出了重要贡献。他的英勇事迹被后人传颂。",
    details: [
      "字子文，汉武帝时期的著名将领",
      "多次率军出征，打败匈奴",
      "被封为大将军，掌握军政大权",
      "与卫青、蒙恬齐名，被誉为‘三绝’",
      "后世尊称为‘霍公’或‘霍大将军’",
    ],
  },
  戚继光: {
    story:
      "戚继光是明代著名的抗倭将领，他在抵御倭贼入侵、保卫国家安全方面表现出色。他的军事才能和对国家的忠诚，使他成为明朝的重要人物之一。",
    details: [
      "字元敬，明代著名将领",
      "抗击倭贼入侵，保卫国家安全",
      "被封为平西王，镇守边疆",
      "编撰《纪效新书》，总结军事经验",
      "后世尊称为‘戚公’或‘戚大将军’",
    ],
  },
  朱元璋: {
    story:
      "朱元璋是明朝的开国皇帝，他通过艰苦卓绝的斗争，推翻了元朝的统治，建立了明朝。他实施了一系列的政治、经济和文化改革，为明朝的繁荣奠定了基础。",
    details: [
      "姓朱名元璋，明太祖",
      "推翻元朝统治，建立明朝",
      "实施一系列政治、经济和文化改革",
      "加强中央集权，削弱地方势力",
      "发展农业，恢复经济，减轻赋税",
    ],
  },
  徐达: {
    story:
      "徐达是明代著名的将领，他参与了朱元璋的起义和明朝的建立，后被封为平章军事。他的军事才能和对国家的贡献，使他成为明朝的重要人物之一。",
    details: [
      "字景隆，明代著名将领",
      "参与朱元璋起义，建立明朝",
      "被封为平章军事，掌管军政大权",
      "平定南方少数民族的叛乱",
      "后世尊称为‘徐公’或‘徐大将军’",
    ],
  },
  孟姜女: {
    story:
      "孟姜女是中国古代著名的传说人物，她的故事感动了无数人。传说她的丈夫被征召修建长城，后因工事繁重而死。孟姜女悲痛欲绝，千里寻夫，最终在长城下哭倒了石头。",
    details: [
      "春秋时期的传说人物",
      "丈夫被征召修建长城，后死于工地",
      "孟姜女千里寻夫，悲痛欲绝",
      "最终在长城下哭倒了石头",
      "成为忠贞不渝、坚贞不屈的象征",
    ],
  },
  八达岭: {
    story:
      "八达岭是长城的一个重要关隘，位于北京市延庆区。它是明代长城的精华部分之一，以雄伟壮丽著称。八达岭长城是世界文化遗产，也是中国最著名的旅游景点之一。",
    details: [
      "位于北京市延庆区，是长城的重要关隘",
      "明代长城的精华部分之一",
      "以雄伟壮丽著称，吸引了大量游客",
      "是世界文化遗产，具有重要的历史价值",
    ],
  },
  嘉峪关: {
    story:
      "嘉峪关是长城的西端起点，位于甘肃省嘉峪关市。它是明代长城的关键防线之一，历史上曾是兵家必争之地。嘉峪关以其雄伟的城墙和独特的地理位置而闻名。",
    details: [
      "位于甘肃省嘉峪关市，是长城的西端起点",
      "明代长城的关键防线之一",
      "历史上曾是兵家必争之地",
      "以雄伟的城墙和独特的地理位置而闻名",
    ],
  },
  工匠群体: {
    story:
      "工匠群体是指在长城修建过程中，参与具体施工的工匠和劳工。他们大多是平民，因修建长城而成为历史的见证者和参与者。",
    details: [
      "参与长城修建的工匠和劳工",
      "大多是平民，来自各地",
      "在长城修建中发挥了重要作用",
      "是历史的见证者和参与者",
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
.greatwall-network-container {
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
.legend-icon.general {
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

  .greatwall-network-container {
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