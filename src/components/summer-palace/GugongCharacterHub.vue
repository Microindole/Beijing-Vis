<template>
  <div class="palace-network-container">
    <div class="header">
      <h1>颐和园人物关系网络</h1>
      <p class="subtitle">清代皇家园林颐和园中的重要人物及其关联图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>颐和园</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon emperor"></span>
          <span>帝王</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon empress"></span>
          <span>后妃</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>官员/亲王</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon eunuch"></span>
          <span>宦官</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon scholar"></span>
          <span>维新人士</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon concubine"></span>
          <span>妃嫔</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line palace-event"></span>
          <span>园林事务</span>
        </div>
        <div class="legend-item">
          <span class="relation-line power-struggle"></span>
          <span>权力斗争</span>
        </div>
        <div class="legend-item">
          <span class="relation-line personal-ties"></span>
          <span>个人关联</span>
        </div>
      </div>
    </div>
    <p class="legend-hint">更多关系类型请点击人物节点查看详情</p>

    <div class="graph-wrapper" ref="graphContainerRef"></div>

    <div v-if="selectedNode" class="info-panel">
      <div class="panel-header">
        <h2>{{ selectedNode.name }}</h2>
        <button @click="clearSelection" class="close-button">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="panel-content">
        <div class="character-story">
          <p>{{ characterInfo.story }}</p>
        </div>

        <div
          class="details-section"
          v-if="characterInfo.details && characterInfo.details.length > 0"
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
              v-for="link in graphData.links.filter(
                (l) =>
                  l.source === selectedNode.id || l.target === selectedNode.id
              )"
              :key="`${link.source}-${link.target}`"
              class="relation-item"
              :style="{ borderLeftColor: link.color }"
            >
              <div class="relation-type" :style="{ color: link.color }">
                {{ link.relation }}
              </div>
              <div class="relation-target">
                {{
                  link.source === selectedNode.id
                    ? graphData.nodes.find((n) => n.id === link.target)?.name
                    : graphData.nodes.find((n) => n.id === link.source)?.name
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hint" v-if="!selectedNode">
      <p>点击节点查看详细信息 • 拖动旋转视图 • 滚轮缩放</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import * as d3 from "d3"; // 引入d3

const originalGraphData = {
  nodes: [
    {
      id: "颐和园",
      name: "颐和园",
      val: 60,
      color: "#6A996A", // 绿色系，代表园林主题
      type: "location",
      symbolSize: 30,
      img: "/icons/summer_palace.png", // 假设有颐和园的图标
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 28,
      color: "#1B5E20", // 深绿，代表颐和园（清漪园）的创建者
      type: "emperor",
      symbolSize: 28,
      img: "/icons/qianlong.png",
    },
    {
      id: "慈禧太后",
      name: "慈禧",
      val: 35, // 颐和园重建的主要推手，权重更高
      color: "#4CAF50", // 绿色，代表重建与居住
      type: "empress",
      symbolSize: 35,
      img: "/icons/cixi.png",
    },
    {
      id: "光绪皇帝",
      name: "光绪",
      val: 22,
      color: "#388E3C", // 稍浅的绿，代表在园内被软禁
      type: "emperor",
      symbolSize: 24,
      img: "/icons/guangxu.png",
    },
    {
      id: "咸丰皇帝",
      name: "咸丰",
      val: 18,
      color: "#5C6BC0", // 蓝紫色，与火烧圆明园和清漪园相关
      type: "emperor",
      symbolSize: 22,
      img: "/icons/xianfeng.png", // 假设有咸丰皇帝图标
    },
    {
      id: "奕䜣(恭亲王)",
      name: "恭亲王",
      val: 16,
      color: "#7CB342", // 浅绿，与重建相关
      type: "official",
      symbolSize: 20,
      img: "/icons/gong_prince.png", // 假设有恭亲王图标
    },
    {
      id: "隆裕太后",
      name: "隆裕",
      val: 15,
      color: "#AED581", // 浅绿
      type: "empress",
      symbolSize: 19,
      img: "/icons/longyu.png",
    },
    {
      id: "李莲英",
      name: "李莲英",
      val: 14,
      color: "#6D4C41", // 棕色，代表太监
      type: "eunuch",
      symbolSize: 18,
      img: "/icons/lilianying.png", // 假设有李莲英图标
    },
    {
      id: "康有为",
      name: "康有为",
      val: 12,
      color: "#FFEB3B", // 黄色，代表维新派
      type: "scholar",
      symbolSize: 17,
      img: "/icons/kangyouwei.png", // 假设有康有为图标
    },
    {
      id: "梁启超",
      name: "梁启超",
      val: 12,
      color: "#FFECB3", // 浅黄
      type: "scholar",
      symbolSize: 17,
      img: "/icons/liangqichao.png", // 假设有梁启超图标
    },
    {
      id: "光绪珍妃",
      name: "珍妃",
      val: 13,
      color: "#D8BFD8", // 浅紫色，代表悲剧色彩
      type: "concubine",
      symbolSize: 18,
      img: "/icons/zhenfei.png", // 假设有珍妃图标
    },
  ],
  links: [
    {
      source: "乾隆皇帝",
      target: "颐和园",
      relation: "清漪园创建者", // 强调其创建前身
      color: "#1B5E20",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "慈禧太后",
      target: "颐和园",
      relation: "主持重建/长期居住",
      color: "#4CAF50",
      width: 5,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "颐和园",
      relation: "被囚禁于此",
      color: "#388E3C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "咸丰皇帝",
      target: "颐和园", // 链接到颐和园，代表其前身被毁
      relation: "见证前身被毁",
      color: "#5C6BC0",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "慈禧太后",
      target: "奕䜣(恭亲王)",
      relation: "倚重协理重建",
      color: "#7CB342",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "光绪皇帝",
      target: "慈禧太后",
      relation: "受制于",
      color: "#8B008B",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "隆裕太后",
      relation: "夫妻",
      color: "#AED581",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "慈禧太后",
      target: "李莲英",
      relation: "宠信",
      color: "#6D4C41",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "康有为",
      relation: "维新变法支持",
      color: "#FFEB3B",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "康有为",
      target: "梁启超",
      relation: "变法同盟",
      color: "#FFECB3",
      width: 2,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "光绪珍妃",
      relation: "宠爱",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "光绪珍妃",
      target: "慈禧太后",
      relation: "被害于慈禧", // 强调珍妃之死与慈禧有关
      color: "#CD5C5C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "颐和园",
      target: "李莲英",
      relation: "常伴慈禧",
      color: "#6D4C41",
      width: 2,
      curvature: 0.1,
    },
    {
      source: "颐和园",
      target: "光绪珍妃",
      relation: "囚禁地/遇害地",
      color: "#D8BFD8",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "奕䜣(恭亲王)",
      target: "咸丰皇帝",
      relation: "兄弟/政治参与", // 恭亲王在咸丰朝也有政治作用
      color: "#7CB342",
      width: 2,
      curvature: 0.2,
    },
  ],
};

const graphContainerRef = ref(null);
let forceGraphInstance = null;

const selectedNode = ref(null);
const characterInfo = ref(null);
const allGraphData = ref(originalGraphData);
const displayedGraphData = ref({ nodes: [], links: [] });

// 人物信息数据 (已补充部分数据，请根据实际需求完善)
const graphData = ref({
  nodes: [
    {
      id: "颐和园",
      name: "颐和园",
      val: 60,
      color: "#6A996A", // 绿色系，代表园林主题
      type: "location",
      symbolSize: 30,
      img: "/icons/summer_palace.png", // 假设有颐和园的图标
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 28,
      color: "#1B5E20", // 深绿，代表颐和园（清漪园）的创建者
      type: "emperor",
      symbolSize: 28,
      img: "/icons/qianlong.png",
    },
    {
      id: "慈禧太后",
      name: "慈禧",
      val: 35, // 颐和园重建的主要推手，权重更高
      color: "#4CAF50", // 绿色，代表重建与居住
      type: "empress",
      symbolSize: 35,
      img: "/icons/cixi.png",
    },
    {
      id: "光绪皇帝",
      name: "光绪",
      val: 22,
      color: "#388E3C", // 稍浅的绿，代表在园内被软禁
      type: "emperor",
      symbolSize: 24,
      img: "/icons/guangxu.png",
    },
    {
      id: "咸丰皇帝",
      name: "咸丰",
      val: 18,
      color: "#5C6BC0", // 蓝紫色，与火烧圆明园和清漪园相关
      type: "emperor",
      symbolSize: 22,
      img: "/icons/xianfeng.png", // 假设有咸丰皇帝图标
    },
    {
      id: "奕䜣(恭亲王)",
      name: "恭亲王",
      val: 16,
      color: "#7CB342", // 浅绿，与重建相关
      type: "official",
      symbolSize: 20,
      img: "/icons/gong_prince.png", // 假设有恭亲王图标
    },
    {
      id: "隆裕太后",
      name: "隆裕",
      val: 15,
      color: "#AED581", // 浅绿
      type: "empress",
      symbolSize: 19,
      img: "/icons/longyu.png",
    },
    {
      id: "李莲英",
      name: "李莲英",
      val: 14,
      color: "#6D4C41", // 棕色，代表太监
      type: "eunuch",
      symbolSize: 18,
      img: "/icons/lilianying.png", // 假设有李莲英图标
    },
    {
      id: "康有为",
      name: "康有为",
      val: 12,
      color: "#FFEB3B", // 黄色，代表维新派
      type: "scholar",
      symbolSize: 17,
      img: "/icons/kangyouwei.png", // 假设有康有为图标
    },
    {
      id: "梁启超",
      name: "梁启超",
      val: 12,
      color: "#FFECB3", // 浅黄
      type: "scholar",
      symbolSize: 17,
      img: "/icons/liangqichao.png", // 假设有梁启超图标
    },
    {
      id: "光绪珍妃",
      name: "珍妃",
      val: 13,
      color: "#D8BFD8", // 浅紫色，代表悲剧色彩
      type: "concubine",
      symbolSize: 18,
      img: "/icons/zhenfei.png", // 假设有珍妃图标
    },
  ],
  links: [
    {
      source: "乾隆皇帝",
      target: "颐和园",
      relation: "清漪园创建者", // 强调其创建前身
      color: "#1B5E20",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "慈禧太后",
      target: "颐和园",
      relation: "主持重建/长期居住",
      color: "#4CAF50",
      width: 5,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "颐和园",
      relation: "被囚禁于此",
      color: "#388E3C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "咸丰皇帝",
      target: "颐和园", // 链接到颐和园，代表其前身被毁
      relation: "见证前身被毁",
      color: "#5C6BC0",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "慈禧太后",
      target: "奕䜣(恭亲王)",
      relation: "倚重协理重建",
      color: "#7CB342",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "光绪皇帝",
      target: "慈禧太后",
      relation: "受制于",
      color: "#8B008B",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "隆裕太后",
      relation: "夫妻",
      color: "#AED581",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "慈禧太后",
      target: "李莲英",
      relation: "宠信",
      color: "#6D4C41",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "康有为",
      relation: "维新变法支持",
      color: "#FFEB3B",
      width: 3,
      curvature: 0.3,
    },
    {
      source: "康有为",
      target: "梁启超",
      relation: "变法同盟",
      color: "#FFECB3",
      width: 2,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "光绪珍妃",
      relation: "宠爱",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "光绪珍妃",
      target: "慈禧太后",
      relation: "被害于慈禧", // 强调珍妃之死与慈禧有关
      color: "#CD5C5C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "颐和园",
      target: "李莲英",
      relation: "常伴慈禧",
      color: "#6D4C41",
      width: 2,
      curvature: 0.1,
    },
    {
      source: "颐和园",
      target: "光绪珍妃",
      relation: "囚禁地/遇害地",
      color: "#D8BFD8",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "奕䜣(恭亲王)",
      target: "咸丰皇帝",
      relation: "兄弟/政治参与", // 恭亲王在咸丰朝也有政治作用
      color: "#7CB342",
      width: 2,
      curvature: 0.2,
    },
  ],
});

const characterInfos = {
  颐和园: {
    story:
      "颐和园，作为清朝皇家园林，见证了多位帝后的生活、决策与时代变迁，尤其是晚清时期重要的政治舞台。",
    details: [
      "始建于乾隆年间，原名清漪园",
      "咸丰十年（1860年）被焚毁",
      "光绪十四年（1888年）慈禧挪用海军经费重建并改名颐和园",
    ],
  },
  乾隆皇帝: {
    story:
      "清朝第六位皇帝，对颐和园前身清漪园的创建和完善投入巨大，奠定了其宏大的园林格局。",
    details: [
      "在位60年，多次南巡，借鉴江南园林风格",
      "以其母祝寿之名修建清漪园",
      "对皇家园林建设有深远影响",
    ],
  },
  慈禧太后: {
    story:
      "晚清实际统治者，颐和园重建的主要推动者和长期居住者。她在园中处理政务，接见外国使节，是晚清重要的政治中心。",
    details: [
      "挪用海军经费重建颐和园，引发争议",
      "在园内“垂帘听政”长达数十年",
      "是晚清政治、外交和生活的重要见证者和参与者",
    ],
  },
  光绪皇帝: {
    story:
      "清朝第十一位皇帝，在颐和园玉澜堂等地被慈禧太后软禁，在此度过了他人生中最后、也是最压抑的十年。",
    details: [
      "甲午战争、戊戌变法的主要决策者",
      "因变法失败在颐和园遭受幽禁",
      "其遭遇是晚清政治斗争的缩影",
    ],
  },
  咸丰皇帝: {
    story:
      "清朝第九位皇帝，在位期间遭遇第二次鸦片战争，清漪园（颐和园前身）在此时期被英法联军焚毁，对其打击巨大。",
    details: [
      "清朝由盛转衰的关键时期",
      "未能有效阻止西方列强入侵",
      "在位期间圆明园和清漪园被焚",
    ],
  },
  "奕䜣(恭亲王)": {
    story:
      "晚清重要的政治家和洋务运动领袖，在慈禧重建颐和园的过程中，曾协助筹款和管理工程。",
    details: [
      "咸丰帝异母弟，主导晚清外交和洋务运动",
      "与慈禧太后在政治上既合作又斗争",
      "参与了同治中兴的改革",
    ],
  },
  隆裕太后: {
    story:
      "光绪皇帝的皇后，慈禧太后的内侄女。她在颐和园中伴随光绪度过被囚禁的岁月，也是清王朝的最后一位太后。",
    details: [
      "光绪帝的皇后，政治婚姻的牺牲品",
      "在清朝灭亡后签署了《清帝逊位诏书》",
      "在颐和园的日子反映了她的压抑和无奈",
    ],
  },
  李莲英: {
    story:
      "晚清慈禧太后最宠信的太监，常伴慈禧左右，在颐和园内外势力庞大，参与多项宫廷事务。",
    details: [
      "慈禧太后的大总管，权力仅次于军机大臣",
      "对颐和园的日常管理和慈禧生活有很大影响",
      "其权势与财富反映了晚清宦官专政的特点",
    ],
  },
  康有为: {
    story:
      "戊戌变法的主要领导人之一，曾上书光绪皇帝，主张效仿西方进行变法维新，他的思想在颐和园内（光绪被囚之地）曾激起希望。",
    details: [
      "公车上书的发起者",
      "戊戌变法失败后流亡海外",
      "中国近代思想启蒙的重要人物",
    ],
  },
  梁启超: {
    story:
      "戊戌变法的重要参与者，康有为的学生。他与光绪皇帝、康有为的变法思想在颐和园内激荡，尽管最终失败。",
    details: [
      "戊戌变法失败后流亡日本",
      "著名的思想家、史学家、文学家",
      "对中国近代思想文化产生深远影响",
    ],
  },
  光绪珍妃: {
    story:
      "光绪皇帝的宠妃，因支持光绪变法而得罪慈禧太后，最终在八国联军侵华时，被慈禧太后命人推入颐和园东北角的井中溺死。",
    details: [
      "光绪帝最宠爱的妃子",
      "支持光绪的维新思想",
      "其悲惨结局是晚清宫廷政治残酷的写照",
    ],
  },
};

// 筛选图数据的函数
const filterGraphData = (nodeId) => {
  if (!nodeId) {
    // 如果没有选中节点，显示所有数据
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
  if (selectedNode.value && selectedNode.value.id === node.id) {
    // 如果点击的是同一个节点，取消选中，显示所有节点
    selectedNode.value = null;
    filterGraphData(null);
    characterInfo.value = null; // 取消选中时清空详细信息
  } else {
    // 选中新节点，并过滤图数据
    selectedNode.value = node;
    filterGraphData(node.id);
    // 更新详细信息
    characterInfo.value = characterInfos[node.id] || {
      story: "暂无详细信息。",
      details: [],
    };
  }
  // 重新渲染图，ForceGraph3D 会自动根据新的 graphData 更新
  forceGraphInstance.graphData(displayedGraphData.value);

  // 自动聚焦到选中节点
  if (forceGraphInstance && node) {
    // 确保node存在
    const distance = 150; // 调整摄像头距离，可以根据实际情况微调
    // 计算当前节点到原点的距离
    const nodeDistance = Math.hypot(node.x, node.y, node.z);
    // 根据节点大小调整相机距离，避免遮挡
    const sizeFactor = node.val ? node.val * 0.1 : 1; // 根据节点val值来调整
    const targetDistance =
      (nodeDistance > 0 ? nodeDistance : 1) + distance + sizeFactor * 5; // 确保nodeDistance不为0

    // 将相机位置设定在节点前方，并平滑过渡
    forceGraphInstance.cameraPosition(
      {
        x: node.x * (targetDistance / nodeDistance),
        y: node.y * (targetDistance / nodeDistance),
        z: node.z * (targetDistance / nodeDistance),
      },
      node, // lookAt 参数，让相机看向节点
      3000 // 动画时长 (毫秒)
    );
  }
};

// 清除选择
const clearSelection = () => {
  selectedNode.value = null; // 清空选中节点
  characterInfo.value = null; // 清空详细信息
  filterGraphData(null); // 调用过滤函数，传入 null 表示显示所有数据

  // 最关键的一步：更新 ForceGraph3D 的数据
  forceGraphInstance.graphData(displayedGraphData.value);

  if (forceGraphInstance) {
    // 恢复初始相机位置，并看向中心
    forceGraphInstance.cameraPosition(
      { x: 0, y: 0, z: 600 },
      { x: 0, y: 0, z: 0 },
      1000
    );
  }
};

// 初始化3D图
onMounted(() => {
  // 1. 初始化数据：首次加载时显示所有节点和连线
  filterGraphData(null);

  // 2. 检查容器是否可用，然后初始化 ForceGraph3D 实例
  if (graphContainerRef.value) {
    forceGraphInstance = ForceGraph3D()(graphContainerRef.value)
      // 数据绑定：使用响应式的 displayedGraphData
      .graphData(displayedGraphData.value)

      // 节点配置
      .nodeVal("val") // 节点大小取决于 'val' 属性
      .nodeColor("color") // 节点颜色取决于 'color' 属性
      .nodeThreeObject((node) => {
        // 自定义节点的三维对象
        const group = new THREE.Group();

        // 节点光晕/发光效果 (Halo)
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(node.val * 0.2, 32, 32),
          new THREE.MeshBasicMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending, // 叠加混合模式，增强发光感
          })
        );
        group.add(halo);

        // 节点主体：带有头像纹理的球体
        const geometry = new THREE.IcosahedronGeometry(node.val * 0.15, 2); // 使用二十面体几何体，更平滑
        const texture = new THREE.TextureLoader().load(node.img);
        const material = new THREE.MeshPhongMaterial({
          // 使用 Phong 材质，支持光照和高光
          map: texture,
          specular: 0x111111, // 高光颜色
          shininess: 30, // 高光强度
          transparent: true,
        });
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);

        // 节点边框效果
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: node.color,
          linewidth: 3, // 边框粗细
        });
        const edgesMesh = new THREE.LineSegments(edges, edgeMaterial);
        edgesMesh.scale.set(1.1, 1.1, 1.1); // 边框略大于球体
        group.add(edgesMesh);

        // 节点文本标签
        const text = new SpriteText(node.name);
        text.color = "#222";
        text.backgroundColor = "rgba(255, 255, 255, 0.9)"; // 标签背景
        text.borderColor = node.color; // 标签边框颜色与节点颜色一致
        text.borderWidth = 2;
        text.borderRadius = 5;
        text.padding = 8;
        text.textHeight = 10;
        text.position.y += node.val * 0.2 + 15; // 标签位置在节点上方
        group.add(text);

        // 用于悬停动画的 userData
        group.userData = {
          originalScale: 1,
          hoverScale: 1.3,
        };
        return group;
      })

      // 连线配置
      .linkColor((link) => link.color) // 连线颜色取决于 'color' 属性
      .linkWidth((link) => link.width) // 连线宽度取决于 'width' 属性
      .linkDirectionalParticles(0) // 禁用连线上的粒子动画
      .linkDirectionalArrowLength(0) // 禁用连线箭头
      .linkCurvature((link) => link.curvature) // 连线弯曲度
      .linkOpacity(0.9) // 连线不透明度
      .linkThreeObject((link) => {
        // 自定义连线的三维对象
        const group = new THREE.Group();

        // 连线本身
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: link.color,
          linewidth: link.width,
          transparent: true,
          opacity: 0.9,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);

        // 关系文本标签 (SpriteText)
        const sprite = new SpriteText(link.relation);
        sprite.color = "#333";
        sprite.backgroundColor = "rgba(255, 255, 255, 0.6)"; // 背景略带透明
        sprite.borderColor = "rgba(0, 0, 0, 0.2)";
        sprite.borderWidth = 1;
        sprite.borderRadius = 3;
        sprite.padding = 3;
        sprite.textHeight = 10;
        sprite.visible = false; // 初始隐藏标签
        sprite.material.depthTest = false; // 确保标签不被其他对象遮挡
        group.add(sprite);

        // 用于连线动画的 userData
        group.userData = {
          originalWidth: link.width,
          highlightWidth: link.width * 3,
        };

        // 存储 SpriteText 引用，以便在 onNodeHover 中访问
        link.__sprite = sprite;

        // 定义一个内部函数来更新连线和标签的位置
        group.__updatePosition = (start, end) => {
          // 更新连线几何体顶点
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

          // 更新标签位置到连线中点
          const middlePos = new THREE.Vector3(
            start.x + (end.x - start.x) * 0.5,
            start.y + (end.y - start.y) * 0.5,
            start.z + (end.z - start.z) * 0.5
          );
          Object.assign(sprite.position, middlePos);

          // 使标签与连线方向对齐
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          sprite.rotation.z = angle;
        };
        return group;
      })
      .linkPositionUpdate((obj, { start, end }) => {
        // 在连线位置更新时调用自定义的更新函数
        obj.__updatePosition(start, end);
      })

      // 图形背景颜色
      .backgroundColor("rgba(250, 245, 235, 0.8)")

      // 事件处理
      .onNodeClick(handleNodeClick) // 节点点击事件

      .onNodeHover((hoveredNode) => {
        // 节点悬停事件
        // 更新鼠标样式
        graphContainerRef.value.style.cursor = hoveredNode ? "pointer" : null;

        // 隐藏所有链接标签，无论是否在子图模式下
        allGraphData.value.links.forEach((link) => {
          if (link.__sprite) {
            link.__sprite.visible = false;
          }
        });

        // 根据是否有选中节点，决定哪些链接参与悬停高亮
        const linksToProcess = selectedNode.value
          ? displayedGraphData.value.links
          : allGraphData.value.links;

        if (hoveredNode) {
          // 显示与悬停节点相关的标签，并高亮相关连线
          linksToProcess.forEach((link) => {
            if (
              (link.source && link.source.id === hoveredNode.id) ||
              (link.target && link.target.id === hoveredNode.id)
            ) {
              if (link.__sprite) {
                link.__sprite.visible = true;
              }
              // 动态高亮当前悬停的连线
              forceGraphInstance.linkColor((l) =>
                l === link ? "#ff0000" : l.color
              );
            }
          });
        } else {
          // 无悬停时恢复默认连线颜色
          forceGraphInstance.linkColor((link) => link.color);
        }
      })
      .onLinkHover((link) => {
        // 连线悬停事件
        // 保持链接悬停事件，与 onNodeHover 的鼠标样式互不干扰
        graphContainerRef.value.style.cursor = link ? "pointer" : null;
      })

      // D3 力导向图参数配置 (核心布局算法)
      // 斥力：模拟节点之间的排斥力，防止重叠
      // .d3Force("charge", d3.forceManyBody().strength(-1000).theta(0.9).distanceMax(800)) // 增加斥力强度，拉开节点间距，扩大图的范围
      // 连线力：模拟连线之间的拉力
      .d3Force(
        "link",
        d3
          .forceLink()
          .id((d) => d.id)
          .distance(350) // 增加节点间距，使图更松散、清晰
      )
      // 中心力：将所有节点拉向画布中心
      .d3Force("center", d3.forceCenter())
      // 碰撞力：防止节点之间发生物理重叠
      .d3Force(
        "collision",
        d3.forceCollide().radius((d) => d.val * 0.2 + 50) // 根据节点大小动态调整碰撞半径，避免小节点挤压
      );

    // 3. 初始相机位置和光照设置 (Three.js 场景)
    forceGraphInstance.cameraPosition({ x: 0, y: 0, z: 600 }); // 相机初始位置
    forceGraphInstance.scene().add(new THREE.AmbientLight(0xffffff, 0.8)); // 环境光，提供整体亮度
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 定向光，模拟太阳光
    directionalLight.position.set(100, 100, 100); // 光源位置
    forceGraphInstance.scene().add(directionalLight);

    // 4. 响应式调整图表大小：确保图表适应容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      if (graphContainerRef.value && forceGraphInstance) {
        forceGraphInstance.width(graphContainerRef.value.offsetWidth);
        forceGraphInstance.height(graphContainerRef.value.offsetHeight);
      }
    });
    resizeObserver.observe(graphContainerRef.value); // 监听容器大小变化
  }
});

onBeforeUnmount(() => {
  if (forceGraphInstance) {
    forceGraphInstance._destructor();
  }
});
</script>

<style scoped>
/* 样式与你提供的基本一致，这里只包含新增和修改的部分，你可以将其合并到你的 style 标签中 */
.palace-network-container {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #faf5eb;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #8b4513;
  font-size: 2.4rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0;
}

.legend-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: #555;
}

.legend-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-icon.location {
  background-color: #6A996A; /* 颐和园自己的颜色 */
}
.legend-icon.emperor {
  background-color: #388E3C; /* 沿用光绪的绿色系 */
}
.legend-icon.empress {
  background-color: #4CAF50; /* 沿用慈禧的绿色系 */
}
.legend-icon.official {
  background-color: #7CB342; /* 沿用恭亲王的绿色系 */
}
.legend-icon.eunuch {
  background-color: #6D4C41; /* 沿用李莲英的棕色 */
}
.legend-icon.scholar {
  background-color: #FFEB3B; /* 沿用康有为的黄色 */
}
.legend-icon.concubine {
  background-color: #D8BFD8; /* 沿用珍妃的浅紫色 */
}

.relation-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  position: relative;
}

.legend-hint {
  font-size: 0.85rem;
  color: #777;
  text-align: right;
  margin-top: 10px;
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

/* 新的关系图例颜色 */
.relation-line.palace-event {
  background-color: #D2691E; /* 巧克力色/棕橙色 */
}
.relation-line.palace-event:after {
  border-top-color: #D2691E;
}
.relation-line.power-struggle {
  background-color: #8B0000; /* 深红色 */
}
.relation-line.power-struggle:after {
  border-top-color: #8B0000;
}
.relation-line.personal-ties {
  background-color: #4682B4; /* 钢蓝色 */
}
.relation-line.personal-ties:after {
  border-top-color: #4682B4;
}

.graph-wrapper {
  width: 100%;
  height: 650px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 20px;
  border: 1px solid #e0d6c2;
  overflow: hidden;
}

.info-panel {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  padding: 0;
  margin-top: 25px;
  overflow: hidden;
  border: 1px solid #e0d6c2;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background-color: #8b4513;
  color: white;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: white;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s;
  padding: 5px;
}

.close-button:hover {
  opacity: 1;
}

.panel-content {
  padding: 25px;
}

.character-story {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.details-section h3,
.relations-section h3 {
  color: #8b4513;
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ddd;
}

.details-section ul {
  list-style-type: disc;
  padding-left: 20px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 25px;
}

.details-section li {
  margin-bottom: 8px;
}

.relations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.relation-item {
  background-color: #f9f5ec;
  padding: 12px 15px;
  border-radius: 6px;
  border-left: 4px solid; /* 边框左侧颜色现在由 JS 动态控制 */
  display: flex;
  flex-direction: column;
}

.relation-type {
  font-weight: 600;
  margin-bottom: 5px;
}

.relation-target {
  color: #666;
  font-size: 0.95rem;
}

.hint {
  text-align: center;
  color: #777;
  font-size: 0.9rem;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
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
}
</style>
