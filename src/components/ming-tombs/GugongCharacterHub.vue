<template>
  <div class="palace-network-container">
    <div class="header">
      <h1>明十三陵人物关系网络</h1>
      <p class="subtitle">明朝皇帝、后妃与重要大臣的关联图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon mausoleum"></span>
          <span>十三陵</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon emperor"></span>
          <span>皇帝</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon empress"></span>
          <span>后妃</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon official"></span>
          <span>官员</span>
        </div>
      </div>

      <div class="relation-legend">
        <div class="legend-item">
          <span class="relation-line construction"></span>
          <span>营建关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line governance"></span>
          <span>统治关系</span>
        </div>
        <div class="legend-item">
          <span class="relation-line family"></span>
          <span>家族关系</span>
        </div>
      </div>
    </div>

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
      id: "明十三陵",
      name: "明十三陵",
      val: 30,
      color: "#D4AF37",
      type: "mausoleum",
      symbolSize: 30,
      img: "/icons/ming_tombs.png",
    },
    {
      id: "明成祖朱棣",
      name: "朱棣",
      val: 25,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/yongle.png",
    },
    {
      id: "明世宗朱厚熜",
      name: "朱厚熜",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/jiajing.png",
    },
    {
      id: "明仁宗朱高炽",
      name: "朱高炽",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/hongxi.png",
    },
    {
      id: "明宣宗朱瞻基",
      name: "朱瞻基",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/xuande.png",
    },
    {
      id: "明英宗朱祁镇",
      name: "朱祁镇",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/zhengtong.png",
    },
    {
      id: "明孝宗朱祐樘",
      name: "朱祐樘",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/hongzhi.png",
    },
    {
      id: "明神宗朱翊钧",
      name: "朱翊钧",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/wanli.png",
    },
    {
      id: "明思宗朱由检",
      name: "朱由检",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/chongzhen.png",
    },
    {
      id: "徐皇后",
      name: "徐皇后",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/empress_xu.png",
    },
    {
      id: "张皇后",
      name: "张皇后",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/empress_zhang.png",
    },
    {
      id: "万贵妃",
      name: "万贵妃",
      val: 15,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 19,
      img: "/icons/concubine_wan.png",
    },
    {
      id: "郑贵妃",
      name: "郑贵妃",
      val: 15,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 19,
      img: "/icons/concubine_zheng.png",
    },
    {
      id: "夏言",
      name: "夏言",
      val: 14,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/xia_yan.png",
    },
    {
      id: "严嵩",
      name: "严嵩",
      val: 14,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/yan_song.png",
    },
    {
      id: "张居正",
      name: "张居正",
      val: 16,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 20,
      img: "/icons/zhang_juzheng.png",
    },
    {
      id: "戚继光",
      name: "戚继光",
      val: 15,
      color: "#4682B4",
      type: "general",
      symbolSize: 19,
      img: "/icons/qi_jiguang.png",
    },
  ],
  links: [
    {
      source: "明成祖朱棣",
      target: "明十三陵",
      relation: "选址营建",
      color: "#FFA500",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "明仁宗朱高炽",
      target: "明十三陵",
      relation: "首位入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明宣宗朱瞻基",
      target: "明十三陵",
      relation: "入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明英宗朱祁镇",
      target: "明十三陵",
      relation: "复辟后入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明孝宗朱祐樘",
      target: "明十三陵",
      relation: "中兴之君入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明神宗朱翊钧",
      target: "明十三陵",
      relation: "长陵最大规模",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明思宗朱由检",
      target: "明十三陵",
      relation: "末代皇帝入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明成祖朱棣",
      target: "明仁宗朱高炽",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明仁宗朱高炽",
      target: "明宣宗朱瞻基",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明成祖朱棣",
      target: "徐皇后",
      relation: "夫妻",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明宣宗朱瞻基",
      target: "张皇后",
      relation: "夫妻",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明英宗朱祁镇",
      target: "万贵妃",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明神宗朱翊钧",
      target: "郑贵妃",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明神宗朱翊钧",
      target: "张居正",
      relation: "辅政大臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "张居正",
      target: "明十三陵",
      relation: "影响陵制",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "明世宗朱厚熜",
      target: "严嵩",
      relation: "宠臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "严嵩",
      target: "明十三陵",
      relation: "参与营建",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "戚继光",
      target: "明十三陵",
      relation: "保卫陵区",
      color: "#4682B4",
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
      id: "明十三陵",
      name: "明十三陵",
      val: 30,
      color: "#D4AF37",
      type: "mausoleum",
      symbolSize: 30,
      img: "/icons/ming_tombs.png",
    },
    {
      id: "明世宗朱厚熜",
      name: "朱厚熜",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/jiajing.png",
    },
    {
      id: "明成祖朱棣",
      name: "朱棣",
      val: 25,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/yongle.png",
    },
    {
      id: "明仁宗朱高炽",
      name: "朱高炽",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/hongxi.png",
    },
    {
      id: "明宣宗朱瞻基",
      name: "朱瞻基",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/xuande.png",
    },
    {
      id: "明英宗朱祁镇",
      name: "朱祁镇",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/zhengtong.png",
    },
    {
      id: "明孝宗朱祐樘",
      name: "朱祐樘",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/hongzhi.png",
    },
    {
      id: "明神宗朱翊钧",
      name: "朱翊钧",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/wanli.png",
    },
    {
      id: "明思宗朱由检",
      name: "朱由检",
      val: 18,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/chongzhen.png",
    },
    {
      id: "徐皇后",
      name: "徐皇后",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/empress_xu.png",
    },
    {
      id: "张皇后",
      name: "张皇后",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/empress_zhang.png",
    },
    {
      id: "万贵妃",
      name: "万贵妃",
      val: 15,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 19,
      img: "/icons/concubine_wan.png",
    },
    {
      id: "郑贵妃",
      name: "郑贵妃",
      val: 15,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 19,
      img: "/icons/concubine_zheng.png",
    },
    {
      id: "夏言",
      name: "夏言",
      val: 14,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/xia_yan.png",
    },
    {
      id: "严嵩",
      name: "严嵩",
      val: 14,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/yan_song.png",
    },
    {
      id: "张居正",
      name: "张居正",
      val: 16,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 20,
      img: "/icons/zhang_juzheng.png",
    },
    {
      id: "戚继光",
      name: "戚继光",
      val: 15,
      color: "#4682B4",
      type: "general",
      symbolSize: 19,
      img: "/icons/qi_jiguang.png",
    },
  ],
  links: [
    {
      source: "明成祖朱棣",
      target: "明十三陵",
      relation: "选址营建",
      color: "#FFA500",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "明仁宗朱高炽",
      target: "明十三陵",
      relation: "首位入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明宣宗朱瞻基",
      target: "明十三陵",
      relation: "入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明英宗朱祁镇",
      target: "明十三陵",
      relation: "复辟后入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明孝宗朱祐樘",
      target: "明十三陵",
      relation: "中兴之君入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明神宗朱翊钧",
      target: "明十三陵",
      relation: "长陵最大规模",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明思宗朱由检",
      target: "明十三陵",
      relation: "末代皇帝入葬",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "明成祖朱棣",
      target: "明仁宗朱高炽",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明仁宗朱高炽",
      target: "明宣宗朱瞻基",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明成祖朱棣",
      target: "徐皇后",
      relation: "夫妻",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明宣宗朱瞻基",
      target: "张皇后",
      relation: "夫妻",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明英宗朱祁镇",
      target: "万贵妃",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明神宗朱翊钧",
      target: "郑贵妃",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "明神宗朱翊钧",
      target: "张居正",
      relation: "辅政大臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "张居正",
      target: "明十三陵",
      relation: "影响陵制",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "明世宗朱厚熜",
      target: "严嵩",
      relation: "宠臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "严嵩",
      target: "明十三陵",
      relation: "参与营建",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "戚继光",
      target: "明十三陵",
      relation: "保卫陵区",
      color: "#4682B4",
      width: 3,
      curvature: 0.1,
    },
  ],
});

const characterInfos = {
  明十三陵: {
    story:
      "明十三陵是明朝十三位皇帝的陵墓群，位于北京昌平天寿山麓，是中国规模最大、保存最完好的帝王陵寝之一。",
    details: [
      "始建于1409年(永乐七年)",
      "总面积约120余平方公里",
      "2003年被列为世界文化遗产",
      "包括长陵、献陵、景陵、裕陵、茂陵、泰陵、康陵、永陵、昭陵、定陵、庆陵、德陵和思陵",
    ],
  },
  明成祖朱棣: {
    story:
      "明朝第三位皇帝，迁都北京并选定天寿山作为皇家陵寝区，亲自规划长陵建设。",
    details: [
      "年号永乐(1403-1424)",
      "发动靖难之役夺取皇位",
      "派遣郑和下西洋",
      "编纂《永乐大典》",
    ],
  },
  明仁宗朱高炽: {
    story:
      "明朝第四位皇帝，朱棣长子，在位仅十个月便去世，是首位入葬明十三陵的皇帝。",
    details: [
      "年号洪熙(1424-1425)",
      "在位时间短但政绩显著",
      "葬于献陵",
      "为政宽厚，纠正永乐时期严苛政策",
    ],
  },
  明宣宗朱瞻基: {
    story: '明朝第五位皇帝，与其父共同开创"仁宣之治"，葬于景陵。',
    details: [
      "年号宣德(1426-1435)",
      "擅长书画，宣德炉闻名于世",
      "延续仁宗政策，国力强盛",
      "葬于景陵",
    ],
  },
  明世宗朱厚熜: {
    story: "明朝第十一位皇帝，在位期间推行改革，但晚年沉迷道教。",
    details: [
      "年号嘉靖 (1522-1566)",
      "大礼议事件",
      "重用严嵩，后期政治腐败",
      "痴迷修道，二十余年不理朝政",
      "倭寇侵扰东南沿海",
    ],
  },
  明英宗朱祁镇: {
    story: "明朝第六位和第八位皇帝，经历土木堡之变和夺门之变，最终葬于裕陵。",
    details: [
      "年号正统(1436-1449)和天顺(1457-1464)",
      "土木堡之变被瓦剌俘虏",
      "复辟后废除殉葬制度",
      "葬于裕陵",
    ],
  },
  明孝宗朱祐樘: {
    story:
      '明朝第九位皇帝，开创"弘治中兴"，是明朝中期最有作为的君主之一，葬于泰陵。',
    details: [
      "年号弘治(1488-1505)",
      "勤政爱民，政治清明",
      "一夫一妻制的践行者",
      "葬于泰陵",
    ],
  },
  明神宗朱翊钧: {
    story: "明朝第十三位皇帝，在位48年，修建定陵耗时6年，耗费白银800万两。",
    details: [
      "年号万历(1573-1620)",
      "前期由张居正辅政",
      "后期长期不上朝",
      "定陵是十三陵中唯一被考古发掘的陵墓",
    ],
  },
  明思宗朱由检: {
    story: "明朝最后一位皇帝，李自成攻入北京后自缢身亡，后葬于思陵。",
    details: [
      "年号崇祯(1628-1644)",
      "勤政但无力回天",
      "煤山自缢身亡",
      "清廷将其葬入思陵",
    ],
  },
  徐皇后: {
    story: "明成祖朱棣的皇后，仁孝文皇后，是明朝第一位入葬十三陵的皇后。",
    details: [
      "仁孝文皇后",
      "朱棣最敬重的妻子",
      "长陵合葬",
      "对永乐朝政有重要影响",
    ],
  },
  张皇后: {
    story: "明宣宗朱瞻基的皇后，历经五朝，对明朝中期政局有重要影响。",
    details: [
      "历经永乐、洪熙、宣德、正统、景泰五朝",
      "宣德朝皇后",
      "景陵合葬",
      "土木堡之变后稳定朝局",
    ],
  },
  万贵妃: {
    story: "明英宗朱祁镇的宠妃，比英宗年长17岁，对英宗有重要影响。",
    details: [
      "英宗最宠爱的妃子",
      "裕陵祔葬",
      "比英宗年长17岁",
      "对英宗性格形成有重要影响",
    ],
  },
  郑贵妃: {
    story: '明神宗朱翊钧的宠妃，引发"国本之争"，几乎动摇明朝国本。',
    details: [
      "神宗最宠爱的妃子",
      "欲立其子福王为太子",
      "引发长达15年的国本之争",
      "定陵祔葬",
    ],
  },
  夏言: {
    story: "明朝中期重臣，曾任内阁首辅，参与嘉靖朝陵寝建设。",
    details: ["嘉靖朝重臣", "曾任内阁首辅", "参与永陵建设", "后被严嵩陷害处死"],
  },
  严嵩: {
    story: "明朝权臣，把持朝政20余年，贪污受贿，对明十三陵建设有重要影响。",
    details: ["嘉靖朝权臣", "把持朝政20余年", "贪污巨额财富", "参与永陵建设"],
  },
  张居正: {
    story: "明朝著名改革家，万历初年内阁首辅，对万历朝政和定陵建设有重要影响。",
    details: [
      "万历初年内阁首辅",
      "推行一条鞭法等改革",
      "对定陵建设有影响",
      "死后被抄家",
    ],
  },
  戚继光: {
    story:
      "明朝抗倭名将，曾负责十三陵的保卫工作，为军事防御体系的建立做出贡献。",
    details: ["抗倭名将", "创建戚家军", "负责十三陵保卫", "完善陵区防御体系"],
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

.legend-icon.mausoleum {
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
