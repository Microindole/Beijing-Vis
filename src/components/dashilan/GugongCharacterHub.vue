<template>
  <div class="palace-network-container">
    <div class="header">
      <h1>大栅栏历史人物关系网络</h1>
      <p class="subtitle">明清民国时期与大栅栏相关的历史人物图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>大栅栏</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon merchant"></span>
          <span>商贾</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon artist"></span>
          <span>艺人</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>官员</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line business"></span>
          <span>商业关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line cultural"></span>
          <span>文化关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line social"></span>
          <span>社会关系</span>
        </div>
      </div>
    </div>
    <p class="legend-hint">更多关系类型请点击人物节点查看详情。</p>

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
      id: "大栅栏",
      name: "大栅栏",
      val: 30,
      color: "#D4AF37",
      type: "location",
      symbolSize: 30,
      img: "/icons/dazhalan.png",
    },
    {
      id: "张一元",
      name: "张一元",
      val: 20,
      color: "#228B22",
      type: "merchant",
      symbolSize: 24,
      img: "/icons/zhangyiyuan.png",
    },
    {
      id: "同仁堂",
      name: "同仁堂",
      val: 20,
      color: "#8B0000",
      type: "merchant",
      symbolSize: 24,
      img: "/icons/tongrentang.png",
    },
    {
      id: "马连良",
      name: "马连良",
      val: 18,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 22,
      img: "/icons/malianliang.png",
    },
    {
      id: "瑞蚨祥",
      name: "瑞蚨祥",
      val: 16,
      color: "#4682B4",
      type: "merchant",
      symbolSize: 20,
      img: "/icons/ruifuxiang.png",
    },
    {
      id: "内联升",
      name: "内联升",
      val: 16,
      color: "#2F4F4F",
      type: "merchant",
      symbolSize: 20,
      img: "/icons/neiliansheng.png",
    },
    {
      id: "梅兰芳",
      name: "梅兰芳",
      val: 16,
      color: "#9932CC",
      type: "artist",
      symbolSize: 20,
      img: "/icons/meilanfang.png",
    },
    {
      id: "纪晓岚",
      name: "纪晓岚",
      val: 16,
      color: "#DAA520",
      type: "official",
      symbolSize: 20,
      img: "/icons/jixiaolan.png",
    },
    // 新增人物
    {
      id: "程长庚",
      name: "程长庚",
      val: 18,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 22,
      img: "/icons/chengchanggeng.png",
    },
    {
      id: "谭鑫培",
      name: "谭鑫培",
      val: 15,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 18,
      img: "/icons/tanxinpei.png",
    },
    {
      id: "广德楼",
      name: "广德楼",
      val: 14,
      color: "#CD5C5C",
      type: "location",
      symbolSize: 17,
      img: "/icons/guangdelou.png",
    },
    {
      id: "三庆园",
      name: "三庆园",
      val: 13,
      color: "#CD5C5C",
      type: "location",
      symbolSize: 16,
      img: "/icons/sanqingyuan.png",
    },
    {
      id: "李渔",
      name: "李渔",
      val: 15,
      color: "#DAA520",
      type: "artist",
      symbolSize: 18,
      img: "/icons/liyu.png",
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 14,
      color: "#8B0000",
      type: "official",
      symbolSize: 17,
      img: "/icons/qianlong.png",
    },
    {
      id: "鲁迅",
      name: "鲁迅",
      val: 17,
      color: "#2F4F4F",
      type: "artist",
      symbolSize: 21,
      img: "/icons/luxun.png",
    },
  ],
  links: [
    {
      source: "张一元",
      target: "大栅栏",
      relation: "创立茶庄",
      color: "#228B22",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "同仁堂",
      target: "大栅栏",
      relation: "创立药铺",
      color: "#8B0000",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "马连良",
      target: "大栅栏",
      relation: "京剧表演",
      color: "#6A0DAD",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "瑞蚨祥",
      target: "大栅栏",
      relation: "绸缎庄",
      color: "#4682B4",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "内联升",
      target: "大栅栏",
      relation: "鞋店",
      color: "#2F4F4F",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "梅兰芳",
      target: "大栅栏",
      relation: "京剧表演",
      color: "#9932CC",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "纪晓岚",
      target: "大栅栏",
      relation: "文人活动",
      color: "#DAA520",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "马连良",
      target: "梅兰芳",
      relation: "京剧同行",
      color: "#9400D3",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "程长庚",
      target: "谭鑫培",
      relation: "师徒",
      color: "#4B0082",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "广德楼",
      target: "大栅栏",
      relation: "戏楼",
      color: "#FF6347",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "三庆园",
      target: "大栅栏",
      relation: "戏楼",
      color: "#FF6347",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "程长庚",
      target: "三庆园",
      relation: "长期驻演",
      color: "#6A0DAD",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "李渔",
      target: "大栅栏",
      relation: "戏曲活动",
      color: "#DAA520",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "乾隆皇帝",
      target: "大栅栏",
      relation: "商业管理",
      color: "#8B0000",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "鲁迅",
      target: "大栅栏",
      relation: "文化消费",
      color: "#2F4F4F",
      width: 3,
      curvature: 0.1,
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
      id: "大栅栏",
      name: "大栅栏",
      val: 30,
      color: "#D4AF37",
      type: "location",
      symbolSize: 30,
      img: "/icons/dazhalan.png",
    },
    {
      id: "张一元",
      name: "张一元",
      val: 20,
      color: "#228B22",
      type: "merchant",
      symbolSize: 24,
      img: "/icons/zhangyiyuan.png",
    },
    {
      id: "同仁堂",
      name: "同仁堂",
      val: 20,
      color: "#8B0000",
      type: "merchant",
      symbolSize: 24,
      img: "/icons/tongrentang.png",
    },
    {
      id: "马连良",
      name: "马连良",
      val: 18,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 22,
      img: "/icons/malianliang.png",
    },
    {
      id: "瑞蚨祥",
      name: "瑞蚨祥",
      val: 16,
      color: "#4682B4",
      type: "merchant",
      symbolSize: 20,
      img: "/icons/ruifuxiang.png",
    },
    {
      id: "内联升",
      name: "内联升",
      val: 16,
      color: "#2F4F4F",
      type: "merchant",
      symbolSize: 20,
      img: "/icons/neiliansheng.png",
    },
    {
      id: "梅兰芳",
      name: "梅兰芳",
      val: 16,
      color: "#9932CC",
      type: "artist",
      symbolSize: 20,
      img: "/icons/meilanfang.png",
    },
    {
      id: "纪晓岚",
      name: "纪晓岚",
      val: 16,
      color: "#DAA520",
      type: "official",
      symbolSize: 20,
      img: "/icons/jixiaolan.png",
    },
    // 新增人物
    {
      id: "程长庚",
      name: "程长庚",
      val: 18,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 22,
      img: "/icons/chengchanggeng.png",
    },
    {
      id: "谭鑫培",
      name: "谭鑫培",
      val: 15,
      color: "#6A0DAD",
      type: "artist",
      symbolSize: 18,
      img: "/icons/tanxinpei.png",
    },
    {
      id: "广德楼",
      name: "广德楼",
      val: 14,
      color: "#CD5C5C",
      type: "location",
      symbolSize: 17,
      img: "/icons/guangdelou.png",
    },
    {
      id: "三庆园",
      name: "三庆园",
      val: 13,
      color: "#CD5C5C",
      type: "location",
      symbolSize: 16,
      img: "/icons/sanqingyuan.png",
    },
    {
      id: "李渔",
      name: "李渔",
      val: 15,
      color: "#DAA520",
      type: "artist",
      symbolSize: 18,
      img: "/icons/liyu.png",
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 14,
      color: "#8B0000",
      type: "official",
      symbolSize: 17,
      img: "/icons/qianlong.png",
    },
    {
      id: "鲁迅",
      name: "鲁迅",
      val: 17,
      color: "#2F4F4F",
      type: "artist",
      symbolSize: 21,
      img: "/icons/luxun.png",
    },
  ],
  links: [
    {
      source: "张一元",
      target: "大栅栏",
      relation: "创立茶庄",
      color: "#228B22",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "同仁堂",
      target: "大栅栏",
      relation: "创立药铺",
      color: "#8B0000",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "马连良",
      target: "大栅栏",
      relation: "京剧表演",
      color: "#6A0DAD",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "瑞蚨祥",
      target: "大栅栏",
      relation: "绸缎庄",
      color: "#4682B4",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "内联升",
      target: "大栅栏",
      relation: "鞋店",
      color: "#2F4F4F",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "梅兰芳",
      target: "大栅栏",
      relation: "京剧表演",
      color: "#9932CC",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "纪晓岚",
      target: "大栅栏",
      relation: "文人活动",
      color: "#DAA520",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "马连良",
      target: "梅兰芳",
      relation: "京剧同行",
      color: "#9400D3",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "程长庚",
      target: "谭鑫培",
      relation: "师徒",
      color: "#4B0082",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "广德楼",
      target: "大栅栏",
      relation: "戏楼",
      color: "#FF6347",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "三庆园",
      target: "大栅栏",
      relation: "戏楼",
      color: "#FF6347",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "程长庚",
      target: "三庆园",
      relation: "长期驻演",
      color: "#6A0DAD",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "李渔",
      target: "大栅栏",
      relation: "戏曲活动",
      color: "#DAA520",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "乾隆皇帝",
      target: "大栅栏",
      relation: "商业管理",
      color: "#8B0000",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "鲁迅",
      target: "大栅栏",
      relation: "文化消费",
      color: "#2F4F4F",
      width: 3,
      curvature: 0.1,
    },
  ],
});

const characterInfos = {
  大栅栏: {
    story:
      "北京前门外著名商业街，兴起于明代，繁盛于清代，是北京商业文化的重要代表，聚集了众多老字号商铺和戏楼。",
    details: [
      "始建于明永乐年间",
      "清代成为北京最繁华的商业区",
      "现存多家百年老字号",
    ],
  },
  张一元: {
    story:
      "著名茶叶老字号，1900年在大栅栏创办，以茉莉花茶闻名京城，是北京人最喜爱的茶叶品牌之一。",
    details: [
      "创办人张昌翼",
      "1900年在大栅栏开业",
      '以"金般品质，百年承诺"为经营理念',
    ],
  },
  同仁堂: {
    story:
      '创建于1669年的中药老字号，1723年开始供奉御药，以"炮制虽繁必不敢省人工，品味虽贵必不敢减物力"为祖训。',
    details: ["创始人乐显扬", "1723年开始供奉御药", "现为上市公司"],
  },
  马连良: {
    story:
      '京剧"马派"艺术创始人，民国时期在大栅栏广德楼等戏院演出，与梅兰芳齐名的京剧大师。',
    details: [
      '京剧"四大须生"之首',
      "创立马派艺术",
      "代表剧目《借东风》《甘露寺》",
    ],
  },
  瑞蚨祥: {
    story:
      "创建于1862年的绸布店，以经营丝绸、呢绒、皮货等高档面料著称，曾为皇室贵族提供面料。",
    details: [
      "山东孟氏家族创办",
      "1949年为开国大典制作国旗",
      "现仍在大栅栏营业",
    ],
  },
  内联升: {
    story:
      '创建于1853年的布鞋老字号，以制作千层底布鞋闻名，有"头顶马聚源，脚踩内联升"的俗语。',
    details: ["创始人赵廷", "曾为皇室制作朝靴", "千层底布鞋制作技艺列入非遗"],
  },
  梅兰芳: {
    story:
      '京剧表演艺术大师，"四大名旦"之首，民国时期常在大栅栏戏楼演出，创立梅派艺术。',
    details: [
      "京剧表演艺术大师",
      "代表剧目《贵妃醉酒》《霸王别姬》",
      "将京剧推向世界",
    ],
  },
  纪晓岚: {
    story:
      "清代著名学者、文学家，曾任《四库全书》总纂官，常在大栅栏一带会友、品茶、听戏。",
    details: ["《四库全书》总纂官", "文渊阁大学士", "以才学和幽默著称"],
  },
  // 新增人物信息
  程长庚: {
    story:
      "京剧表演艺术家，京剧奠基人之一，长期在大栅栏三庆园演出，培养了大批京剧人才。",
    details: ['京剧"前三鼎甲"之一', "三庆班班主", "培养了谭鑫培等名家"],
  },
  谭鑫培: {
    story:
      '京剧表演艺术家，"同光十三绝"之一，师从程长庚，在大栅栏一带戏楼演出，创立谭派艺术。',
    details: [
      '京剧"后三鼎甲"之一',
      "中国第一部电影《定军山》主演",
      "代表剧目《空城计》《卖马》",
    ],
  },
  广德楼: {
    story:
      '大栅栏著名戏楼，始建于1796年，与三庆园、庆乐园、同乐园并称"四大戏园"，梅兰芳、马连良等曾在此演出。',
    details: ["始建于清嘉庆元年", "北京现存最古老的戏楼之一", "现仍在使用"],
  },
  三庆园: {
    story: "大栅栏著名戏楼，程长庚长期在此演出，是京剧形成和发展的重要场所。",
    details: ["始建于乾隆年间", "程长庚长期驻演", "京剧重要发源地之一"],
  },
  李渔: {
    story:
      "明末清初文学家、戏剧家，所著《闲情偶寄》对戏曲理论有重要贡献，曾在大栅栏一带活动。",
    details: ["戏曲理论家", "《闲情偶寄》作者", "《十二楼》等小说作者"],
  },
  乾隆皇帝: {
    story:
      "清朝皇帝，1756年下令在前门外设立五城兵马司，加强大栅栏商业区的管理，促进了大栅栏的繁荣。",
    details: ["1756年设立五城兵马司", "促进商业发展", "多次微服私访大栅栏"],
  },
  鲁迅: {
    story:
      "著名文学家，民国时期常到大栅栏购买书籍、看戏，在日记中多次提及大栅栏。",
    details: [
      "1912-1926年在北京居住",
      "常到大栅栏购物",
      "日记中多次提及大栅栏",
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

.legend-hint {
  font-size: 0.85rem;
  color: #777;
  text-align: right;
  margin-top: 10px;
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
  background-color: #d4af37;
}
.legend-icon.emperor {
  background-color: #8b0000;
}
.legend-icon.empress {
  background-color: #6a0dad;
}
.legend-icon.official {
  background-color: #2f4f4f;
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

.relation-line.construction {
  background-color: #ffa500;
}
.relation-line.construction:after {
  border-top-color: #ffa500;
}
.relation-line.governance {
  background-color: #b22222;
}
.relation-line.governance:after {
  border-top-color: #b22222;
}
.relation-line.family {
  background-color: #daa520;
}
.relation-line.family:after {
  border-top-color: #daa520;
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
