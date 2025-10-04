<template>
  <div class="fayuan-network-container">
    <div class="header">
      <h1>法源寺人物关系网络</h1>
      <p class="subtitle">历代高僧、文人及历史人物与法源寺的关联图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>法源寺</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon abbot"></span>
          <span>住持/高僧</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon literati"></span>
          <span>文人</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>官员</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line dharma"></span>
          <span>法脉传承</span>
        </div>
        <div class="legend-item">
          <span class="relation-line culture"></span>
          <span>文化交流</span>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import * as d3 from "d3";


const originalGraphData = {
  nodes: [
    {
      id: "法源寺",
      name: "法源寺",
      val: 60,
      color: "#b85c00",
      type: "location",
      symbolSize: 30,
    },
    {
      id: "道宣",
      name: "道宣",
      val: 22,
      color: "#e6b800",
      type: "abbot",
      symbolSize: 24,
    },
    {
      id: "鉴真",
      name: "鉴真",
      val: 20,
      color: "#e67e22",
      type: "abbot",
      symbolSize: 22,
    },
    {
      id: "林则徐",
      name: "林则徐",
      val: 18,
      color: "#b83232",
      type: "literati",
      symbolSize: 20,
    },
    {
      id: "徐志摩",
      name: "徐志摩",
      val: 16,
      color: "#b83232",
      type: "literati",
      symbolSize: 18,
    },
    {
      id: "泰戈尔",
      name: "泰戈尔",
      val: 15,
      color: "#b83232",
      type: "literati",
      symbolSize: 17,
    },
    {
      id: "杨昌济",
      name: "杨昌济",
      val: 14,
      color: "#d2691e",
      type: "official",
      symbolSize: 16,
    },
    {
      id: "李敖",
      name: "李敖",
      val: 14,
      color: "#b83232",
      type: "literati",
      symbolSize: 16,
    },
    {
      id: "宋钦宗",
      name: "宋钦宗",
      val: 18,
      color: "#d2691e",
      type: "official",
      symbolSize: 18,
    },
    {
      id: "顺治帝",
      name: "顺治帝",
      val: 18,
      color: "#e6b800",
      type: "official",
      symbolSize: 18,
    },
    {
      id: "雍正帝",
      name: "雍正帝",
      val: 18,
      color: "#e6b800",
      type: "official",
      symbolSize: 18,
    },
    {
      id: "乾隆帝",
      name: "乾隆帝",
      val: 18,
      color: "#e6b800",
      type: "official",
      symbolSize: 18,
    },
    {
      id: "谢枋得",
      name: "谢枋得",
      val: 16,
      color: "#b83232",
      type: "official",
      symbolSize: 16,
    },
    {
      id: "袁崇焕",
      name: "袁崇焕",
      val: 16,
      color: "#d2691e",
      type: "official",
      symbolSize: 16,
    },
    {
      id: "齐白石",
      name: "齐白石",
      val: 15,
      color: "#b83232",
      type: "literati",
      symbolSize: 15,
    },
    {
      id: "纪晓岚",
      name: "纪晓岚",
      val: 14,
      color: "#b83232",
      type: "literati",
      symbolSize: 14,
    },
    {
      id: "龚自珍",
      name: "龚自珍",
      val: 14,
      color: "#b83232",
      type: "literati",
      symbolSize: 14,
    },
    {
      id: "谭嗣同",
      name: "谭嗣同",
      val: 14,
      color: "#b83232",
      type: "literati",
      symbolSize: 14,
    },
    {
      id: "梁启超",
      name: "梁启超",
      val: 14,
      color: "#b83232",
      type: "literati",
      symbolSize: 14,
    },
    {
      id: "无名高僧",
      name: "无名高僧",
      val: 13,
      color: "#e67e22",
      type: "abbot",
      symbolSize: 13,
    },
    {
      id: "金代考场",
      name: "金代考场",
      val: 12,
      color: "#a67c52",
      type: "event",
      symbolSize: 12,
    },
    {
      id: "丁香诗会",
      name: "丁香诗会",
      val: 12,
      color: "#a67c52",
      type: "event",
      symbolSize: 12,
    },
    {
      id: "石狮劫难",
      name: "石狮劫难",
      val: 12,
      color: "#a67c52",
      type: "event",
      symbolSize: 12,
    },
  ],
  links: [
    {
      source: "道宣",
      target: "法源寺",
      relation: "律宗祖庭",
      color: "#e67e22",
      width: 5,
      curvature: 0.1,
    },
    {
      source: "鉴真",
      target: "法源寺",
      relation: "东渡前驻锡",
      color: "#e67e22",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "林则徐",
      target: "法源寺",
      relation: "吟咏丁香",
      color: "#b83232",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "徐志摩",
      target: "法源寺",
      relation: "陪同泰戈尔",
      color: "#b83232",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "泰戈尔",
      target: "法源寺",
      relation: "访寺赏花",
      color: "#b83232",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "杨昌济",
      target: "法源寺",
      relation: "停灵于寺",
      color: "#d2691e",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "李敖",
      target: "法源寺",
      relation: "以寺为题",
      color: "#b83232",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "宋钦宗",
      target: "法源寺",
      relation: "靖康之变囚禁",
      color: "#d2691e",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "顺治帝",
      target: "法源寺",
      relation: "设戒坛",
      color: "#e6b800",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "雍正帝",
      target: "法源寺",
      relation: "赐名重修",
      color: "#e6b800",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "乾隆帝",
      target: "法源寺",
      relation: "题匾赋诗",
      color: "#e6b800",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "谢枋得",
      target: "法源寺",
      relation: "殉国于寺",
      color: "#b83232",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "袁崇焕",
      target: "法源寺",
      relation: "头颅超度",
      color: "#d2691e",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "齐白石",
      target: "法源寺",
      relation: "寺内居住创作",
      color: "#b83232",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "纪晓岚",
      target: "丁香诗会",
      relation: "诗会雅集",
      color: "#b83232",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "龚自珍",
      target: "丁香诗会",
      relation: "诗会雅集",
      color: "#b83232",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "丁香诗会",
      target: "法源寺",
      relation: "百年文化盛事",
      color: "#a67c52",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "石狮劫难",
      target: "法源寺",
      relation: "文物保护争议",
      color: "#a67c52",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "谭嗣同",
      target: "李敖",
      relation: "小说虚构密会",
      color: "#b83232",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "谭嗣同",
      target: "梁启超",
      relation: "戊戌变法同仁",
      color: "#b83232",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "无名高僧",
      target: "法源寺",
      relation: "传说感化孝庄",
      color: "#e67e22",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "金代考场",
      target: "法源寺",
      relation: "女真进士策试",
      color: "#a67c52",
      width: 2,
      curvature: 0.2,
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

// 人物简介（示例，可补充完善）
const characterInfos = {
  法源寺: {
    story: "法源寺始建于唐贞观十九年，是北京现存最古老的佛教寺院之一，历代高僧、文人墨客、历史人物在此留下深刻印记。",
    details: [
      "唐代悯忠寺，后更名法源寺",
      "中国佛学院所在地",
      "以丁香花著称，京城春日胜地",
      "中日佛教文化交流重要场所"
    ],
  },
  道宣: {
    story: "唐代高僧，律宗祖师，曾驻锡法源寺，弘扬律宗，影响深远。",
    details: [
      "律宗初祖，著有《四分律删繁补阙行事钞》",
      "在法源寺弘法多年",
      "推动佛教戒律制度完善"
    ],
  },
  鉴真: {
    story: "唐代高僧，东渡日本传播佛法，曾在法源寺驻锡，留下中日佛教交流佳话。",
    details: [
      "六次东渡，终成正果",
      "在法源寺讲学传戒",
      "日本佛教律宗开山祖"
    ],
  },
  林则徐: {
    story: "清代著名政治家、文学家，曾在法源寺吟咏丁香，留下诗篇。",
    details: [
      "鸦片战争民族英雄",
      "法源寺丁香诗会参与者",
      "诗作流传后世"
    ],
  },
  徐志摩: {
    story: "现代著名诗人，1924年陪同泰戈尔游法源寺，留下文化佳话。",
    details: [
      "新月派代表诗人",
      "陪泰戈尔访法源寺",
      "诗文记述丁香花事"
    ],
  },
  泰戈尔: {
    story: "印度大诗人，1924年访华期间游法源寺，成为中印文化交流佳话。",
    details: [
      "诺贝尔文学奖获得者",
      "1924年赏花法源寺",
      "与徐志摩等文人交流"
    ],
  },
  杨昌济: {
    story: "近代著名教育家，毛泽东岳父，逝世后停灵于法源寺。",
    details: [
      "湖南著名学者",
      "毛泽东、蔡和森等学生",
      "逝后停灵法源寺"
    ],
  },
  李敖: {
    story: "当代作家，以法源寺为背景创作历史小说《北京法源寺》，赋予古寺新的文化内涵。",
    details: [
      "著有《北京法源寺》",
      "以历史人物与法源寺为题材",
      "推动古寺文化传播"
    ],
  },
  宋钦宗: {
    story: "北宋末代皇帝，靖康之变后被金兵掳至燕京，囚禁于悯忠寺（今法源寺），见证王朝兴亡。",
    details: [
      "1127年靖康之变被俘",
      "囚禁于悯忠寺",
      "北宋灭亡的历史见证"
    ],
  },
  顺治帝: {
    story: "清朝入关后首位皇帝，在法源寺设戒坛，推动律宗发展。",
    details: [
      "清初设戒坛于法源寺",
      "推动佛教戒律制度",
      "法源寺律宗祖庭地位确立"
    ],
  },
  雍正帝: {
    story: "清世宗，1733年重修法源寺，赐名并定为律宗祖庭，强调戒律传承。",
    details: [
      "1733年拨帑重修寺院",
      "赐名“法源寺”",
      "御碑铭文强调戒律"
    ],
  },
  乾隆帝: {
    story: "清高宗，1778年题匾“法海真源”，赋诗盛赞法源寺，民间传说与寺规趣事。",
    details: [
      "1778年题匾“法海真源”",
      "赋诗赞“最古燕京寺”",
      "传说违寺规被罚走后门"
    ],
  },
  谢枋得: {
    story: "南宋遗臣，抗元失败后囚于法源寺，绝食殉国，明代建祠纪念。",
    details: [
      "1289年抗元失败被俘",
      "囚于法源寺，绝食五日殉国",
      "明代建“谢枋得祠”"
    ],
  },
  袁崇焕: {
    story: "明末抗清名将，冤死后头颅密送法源寺超度，象征忠魂归宿。",
    details: [
      "1630年冤死",
      "部下佘义士密送头颅至寺超度",
      "强化“悯忠”精神"
    ],
  },
  齐白石: {
    story: "近现代著名画家，1917-1919年两度借住法源寺，画风巨变。",
    details: [
      "1917、1919年借住寺内",
      "开创“衰年变法”画风",
      "与寺僧交往甚密"
    ],
  },
  纪晓岚: {
    story: "清代著名学者，参与法源寺丁香诗会，留下诗作。",
    details: [
      "清代文坛领袖",
      "多次参加丁香诗会",
      "诗作流传后世"
    ],
  },
  龚自珍: {
    story: "清代思想家、诗人，参与法源寺诗会，推动文化交流。",
    details: [
      "清代思想家",
      "参与法源寺诗会",
      "诗文影响深远"
    ],
  },
  谭嗣同: {
    story: "戊戌变法志士，李敖小说中虚构于法源寺密会梁启超。",
    details: [
      "戊戌变法六君子之一",
      "文学作品中与梁启超密会",
      "象征思想解放"
    ],
  },
  梁启超: {
    story: "近代著名思想家，李敖小说中与谭嗣同法源寺密会。",
    details: [
      "戊戌变法领袖",
      "文学作品中与谭嗣同密会",
      "推动近代思想变革"
    ],
  },
  无名高僧: {
    story: "清代传说人物，绝食诵经感化孝庄太后，保全法源寺。",
    details: [
      "康熙年间传说",
      "绝食诵经感化孝庄",
      "促使康熙收回废寺成命"
    ],
  },
  金代考场: {
    story: "金大定十三年（1173年）法源寺为女真进士策试考场。",
    details: [
      "1173年金代考场",
      "女真进士策试",
      "寺院多重社会功能"
    ],
  },
  丁香诗会: {
    story: "明清以来法源寺著名文化盛事，文人雅集吟咏丁香，延续百年。",
    details: [
      "明清盛事",
      "纪晓岚、龚自珍等参与",
      "2024年已延续百年"
    ],
  },
  石狮劫难: {
    story: "2025年3月，法源寺600年石狮遭游客推倒，引发文物保护争议。",
    details: [
      "2025年石狮损毁",
      "引发社会关注",
      "文物保护呼声高涨"
    ],
  },
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
.fayuan-network-container {
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
  color: #b85c00;
  font-size: 2.4rem;
  margin-bottom: 8px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: #a67c52;
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
  box-shadow: 0 4px 16px rgba(184, 92, 0, 0.13);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(184, 92, 0, 0.18);
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
  color: #a67c52;
}

.legend-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #b85c00;
  box-shadow: 0 1px 3px rgba(184, 92, 0, 0.13);
}

.legend-icon.location {
  background-color: #b85c00;
}
.legend-icon.abbot {
  background-color: #e6b800;
}
.legend-icon.literati {
  background-color: #b83232;
}
.legend-icon.official {
  background-color: #d2691e;
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

.relation-line.dharma {
  background-color: #e67e22;
}
.relation-line.dharma:after {
  border-top-color: #e67e22;
}
.relation-line.culture {
  background-color: #b83232;
}
.relation-line.culture:after {
  border-top-color: #b83232;
}
.relation-line.event {
  background-color: #d2691e;
}
.relation-line.event:after {
  border-top-color: #d2691e;
}

.graph-wrapper {
  width: 100%;
  height: 650px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(184, 92, 0, 0.13);
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
  border: 1px solid rgba(184, 92, 0, 0.18);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.hint {
  text-align: center;
  color: #a67c52;
  font-size: 0.9rem;
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(184, 92, 0, 0.12);
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
  box-shadow: 0 20px 60px rgba(184, 92, 0, 0.13);
  max-width: 1200px;
  width: 98%;
  max-height: 95vh;
  overflow: hidden;
  border: 2px solid rgba(184, 92, 0, 0.18);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #b85c00 0%, #e6b800 100%);
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.character-story {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(184, 92, 0, 0.13);
}

.details-section h3,
.relations-section h3 {
  color: #b85c00;
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(184, 92, 0, 0.13);
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
  border-left: 4px solid #b85c00;
  border-radius: 6px;
  position: relative;
}

.details-section li:before {
  content: "▪";
  color: #b85c00;
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
  box-shadow: 0 2px 8px rgba(184, 92, 0, 0.08);
}

.relation-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(184, 92, 0, 0.13);
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

  .fayuan-network-container {
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