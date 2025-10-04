<template>
  <div class="palace-network-container">
    <div class="header">
      <h1>故宫人物关系网络</h1>
      <p class="subtitle">明清时期重要人物与故宫的关联图谱</p>
    </div>

    <div class="legend-container">
      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon location"></span>
          <span>故宫</span>
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
      id: "故宫",
      name: "故宫",
      val: 60,
      color: "#D4AF37",
      type: "location",
      symbolSize: 30,
      img: "/icons/forbidden_city.png",
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/qianlong.png",
    },
    {
      id: "慈禧太后",
      name: "慈禧",
      val: 20,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 24,
      img: "/icons/cixi.png",
    },
    {
      id: "溥仪",
      name: "溥仪",
      val: 18,
      color: "#CD5C5C",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/puyi.png",
    },
    {
      id: "康熙皇帝",
      name: "康熙",
      val: 16,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 20,
      img: "/icons/kangxi.png",
    },
    {
      id: "雍正皇帝",
      name: "雍正",
      val: 16,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 20,
      img: "/icons/yongzheng.png",
    },
    {
      id: "隆裕太后",
      name: "隆裕",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/longyu.png",
    },
    {
      id: "袁世凯",
      name: "袁世凯",
      val: 16,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 20,
      img: "/icons/yuanshikai.png",
    },
    {
      id: "孝庄太后",
      name: "孝庄",
      val: 18,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 22,
      img: "/icons/xiaozhuang.png",
    },
    {
      id: "和珅",
      name: "和珅",
      val: 15,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/heshen.png",
    },
    {
      id: "纪晓岚",
      name: "纪晓岚",
      val: 14,
      color: "#4682B4",
      type: "scholar",
      symbolSize: 17,
      img: "/icons/jixiaolan.png",
    },
    {
      id: "郎世宁",
      name: "郎世宁",
      val: 13,
      color: "#778899",
      type: "artist",
      symbolSize: 16,
      img: "/icons/langshining.png",
    },
    {
      id: "末代皇后婉容",
      name: "婉容",
      val: 15,
      color: "#CD5C5C",
      type: "empress",
      symbolSize: 18,
      img: "/icons/wanrong.png",
    },
    {
      id: "珍妃",
      name: "珍妃",
      val: 14,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 17,
      img: "/icons/zhenfei.png",
    },
    {
      id: "光绪皇帝",
      name: "光绪",
      val: 17,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/guangxu.png",
    },
  ],
  links: [
    {
      source: "乾隆皇帝",
      target: "故宫",
      relation: "营建/扩建",
      color: "#FFA500",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "慈禧太后",
      target: "故宫",
      relation: "垂帘听政",
      color: "#9932CC",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "溥仪",
      target: "故宫",
      relation: "末代皇帝",
      color: "#FF6347",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "康熙皇帝",
      target: "故宫",
      relation: "早期统治",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "雍正皇帝",
      target: "故宫",
      relation: "勤政爱民",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "隆裕太后",
      target: "故宫",
      relation: "签署退位",
      color: "#9370DB",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "袁世凯",
      target: "故宫",
      relation: "逼迫退位",
      color: "#708090",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "乾隆皇帝",
      target: "康熙皇帝",
      relation: "祖孙",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "乾隆皇帝",
      target: "雍正皇帝",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "溥仪",
      target: "隆裕太后",
      relation: "抚养",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "溥仪",
      target: "袁世凯",
      relation: "被逼退位",
      color: "#778899",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "慈禧太后",
      target: "溥仪",
      relation: "控制",
      color: "#9400D3",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "孝庄太后",
      target: "故宫",
      relation: "早期重要人物",
      color: "#8A2BE2",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "康熙皇帝",
      target: "孝庄太后",
      relation: "祖孙",
      color: "#9932CC",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "和珅",
      target: "乾隆皇帝",
      relation: "宠臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "和珅",
      target: "故宫",
      relation: "贪墨/影响",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "纪晓岚",
      target: "乾隆皇帝",
      relation: "文学侍从",
      color: "#4682B4",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "郎世宁",
      target: "乾隆皇帝",
      relation: "宫廷画家",
      color: "#778899",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "郎世宁",
      target: "故宫",
      relation: "留下画作",
      color: "#808080",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "溥仪",
      target: "末代皇后婉容",
      relation: "夫妻",
      color: "#D2B48C",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "末代皇后婉容",
      target: "故宫",
      relation: "皇后生涯",
      color: "#E9967A",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "珍妃",
      target: "光绪皇帝",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "珍妃",
      target: "故宫",
      relation: "囚禁/被害",
      color: "#CD5C5C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "慈禧太后",
      relation: "受制",
      color: "#8B008B",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "故宫",
      relation: "戊戌变法",
      color: "#ADFF2F",
      width: 4,
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
      id: "故宫",
      name: "故宫",
      val: 30,
      color: "#D4AF37",
      type: "location",
      symbolSize: 30,
      img: "/icons/forbidden_city.png",
    },
    {
      id: "乾隆皇帝",
      name: "乾隆",
      val: 20,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 24,
      img: "/icons/qianlong.png",
    },
    {
      id: "慈禧太后",
      name: "慈禧",
      val: 20,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 24,
      img: "/icons/cixi.png",
    },
    {
      id: "溥仪",
      name: "溥仪",
      val: 18,
      color: "#CD5C5C",
      type: "emperor",
      symbolSize: 22,
      img: "/icons/puyi.png",
    },
    {
      id: "康熙皇帝",
      name: "康熙",
      val: 16,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 20,
      img: "/icons/kangxi.png",
    },
    {
      id: "雍正皇帝",
      name: "雍正",
      val: 16,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 20,
      img: "/icons/yongzheng.png",
    },
    {
      id: "隆裕太后",
      name: "隆裕",
      val: 16,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 20,
      img: "/icons/longyu.png",
    },
    {
      id: "袁世凯",
      name: "袁世凯",
      val: 16,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 20,
      img: "/icons/yuanshikai.png",
    },
    // 新增人物
    {
      id: "孝庄太后",
      name: "孝庄",
      val: 18,
      color: "#6A0DAD",
      type: "empress",
      symbolSize: 22,
      img: "/icons/xiaozhuang.png",
    },
    {
      id: "和珅",
      name: "和珅",
      val: 15,
      color: "#2F4F4F",
      type: "official",
      symbolSize: 18,
      img: "/icons/heshen.png",
    },
    {
      id: "纪晓岚",
      name: "纪晓岚",
      val: 14,
      color: "#4682B4",
      type: "scholar",
      symbolSize: 17,
      img: "/icons/jixiaolan.png",
    },
    {
      id: "郎世宁",
      name: "郎世宁",
      val: 13,
      color: "#778899",
      type: "artist",
      symbolSize: 16,
      img: "/icons/langshining.png",
    },
    {
      id: "末代皇后婉容",
      name: "婉容",
      val: 15,
      color: "#CD5C5C",
      type: "empress",
      symbolSize: 18,
      img: "/icons/wanrong.png",
    },
    {
      id: "珍妃",
      name: "珍妃",
      val: 14,
      color: "#D8BFD8",
      type: "concubine",
      symbolSize: 17,
      img: "/icons/zhenfei.png",
    },
    {
      id: "光绪皇帝",
      name: "光绪",
      val: 17,
      color: "#8B0000",
      type: "emperor",
      symbolSize: 21,
      img: "/icons/guangxu.png",
    },
  ],
  links: [
    {
      source: "乾隆皇帝",
      target: "故宫",
      relation: "营建/扩建",
      color: "#FFA500",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "慈禧太后",
      target: "故宫",
      relation: "垂帘听政",
      color: "#9932CC",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "溥仪",
      target: "故宫",
      relation: "末代皇帝",
      color: "#FF6347",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "康熙皇帝",
      target: "故宫",
      relation: "早期统治",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "雍正皇帝",
      target: "故宫",
      relation: "勤政爱民",
      color: "#B22222",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "隆裕太后",
      target: "故宫",
      relation: "签署退位",
      color: "#9370DB",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "袁世凯",
      target: "故宫",
      relation: "逼迫退位",
      color: "#708090",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "乾隆皇帝",
      target: "康熙皇帝",
      relation: "祖孙",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "乾隆皇帝",
      target: "雍正皇帝",
      relation: "父子",
      color: "#DAA520",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "溥仪",
      target: "隆裕太后",
      relation: "抚养",
      color: "#F4A460",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "溥仪",
      target: "袁世凯",
      relation: "被逼退位",
      color: "#778899",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "慈禧太后",
      target: "溥仪",
      relation: "控制",
      color: "#9400D3",
      width: 2,
      curvature: 0.3,
    },
    // 新增人物关系
    {
      source: "孝庄太后",
      target: "故宫",
      relation: "早期重要人物",
      color: "#8A2BE2",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "康熙皇帝",
      target: "孝庄太后",
      relation: "祖孙",
      color: "#9932CC",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "和珅",
      target: "乾隆皇帝",
      relation: "宠臣",
      color: "#708090",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "和珅",
      target: "故宫",
      relation: "贪墨/影响",
      color: "#696969",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "纪晓岚",
      target: "乾隆皇帝",
      relation: "文学侍从",
      color: "#4682B4",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "郎世宁",
      target: "乾隆皇帝",
      relation: "宫廷画家",
      color: "#778899",
      width: 2,
      curvature: 0.2,
    },
    {
      source: "郎世宁",
      target: "故宫",
      relation: "留下画作",
      color: "#808080",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "溥仪",
      target: "末代皇后婉容",
      relation: "夫妻",
      color: "#D2B48C",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "末代皇后婉容",
      target: "故宫",
      relation: "皇后生涯",
      color: "#E9967A",
      width: 3,
      curvature: 0.1,
    },
    {
      source: "珍妃",
      target: "光绪皇帝",
      relation: "宠妃",
      color: "#DB7093",
      width: 2,
      curvature: 0.3,
    },
    {
      source: "珍妃",
      target: "故宫",
      relation: "囚禁/被害",
      color: "#CD5C5C",
      width: 4,
      curvature: 0.1,
    },
    {
      source: "光绪皇帝",
      target: "慈禧太后",
      relation: "受制",
      color: "#8B008B",
      width: 3,
      curvature: 0.2,
    },
    {
      source: "光绪皇帝",
      target: "故宫",
      relation: "戊戌变法",
      color: "#ADFF2F",
      width: 4,
      curvature: 0.1,
    },
  ],
});

const characterInfos = {
  故宫: {
    story:
      "紫禁城，明清两代的皇宫，是中华文明的瑰宝，见证了无数历史风云人物和传奇故事。",
    details: [
      "始建于明永乐四年(1406年)",
      "世界现存规模最大、保存最完整的木质结构古建筑群",
      "1987年被列为世界文化遗产",
    ],
  },
  乾隆皇帝: {
    story:
      "清朝第六位皇帝，将故宫打造成艺术与文化中心，大规模修缮与增建使紫禁城更显宏伟。",
    details: [
      "在位60年，实际掌权63年",
      "主持编纂《四库全书》",
      "修建宁寿宫花园(倦勤斋)",
    ],
  },
  慈禧太后: {
    story:
      "晚清实际统治者，清朝晚期重要的政治人物，在故宫内垂帘听政长达数十年。",
    details: ["两度垂帘听政", "发动戊戌政变", "推行新政"],
  },
  溥仪: {
    story:
      "中国历史上最后一位皇帝，在故宫度过了他的童年和青少年时期，见证了清王朝的覆灭。",
    details: [
      "清朝末代皇帝",
      "曾在故宫生活多年",
      "出宫后在日本扶持下成立伪满洲国",
    ],
  },
  康熙皇帝: {
    story:
      "清朝第四位皇帝，中国历史上在位时间最长的皇帝之一，为故宫的奠定和发展做出了重要贡献。",
    details: ["在位61年", "平定三藩之乱", "开创康乾盛世的局面"],
  },
  雍正皇帝: {
    story:
      "清朝第五位皇帝，勤政爱民，在位期间对故宫的宫殿布局和功能进行了调整和完善。",
    details: ["设立军机处", "耗费大量心血批阅奏折", "推动摊丁入亩等改革"],
  },
  隆裕太后: {
    story:
      "清朝的最后一位太后，在故宫见证了清王朝的终结，并代表宣统皇帝签署了《清帝逊位诏书》。",
    details: ["光绪帝的皇后", "宣统帝的法定抚养人", "签署《清帝逊位诏书》"],
  },
  袁世凯: {
    story:
      "中华民国首任大总统，以军事和政治手段逼迫清帝退位，结束了故宫作为皇宫的历史。",
    details: ["北洋军阀领袖", "逼迫清帝退位", "曾试图称帝"],
  },
  // 新增人物信息
  孝庄太后: {
    story:
      "清朝初期杰出的女政治家，辅助两代幼主，为清朝的稳定和发展奠定了基础。",
    details: [
      "辅佐顺治、康熙两代帝王",
      "在故宫生活多年",
      "对清初的政局有深远影响",
    ],
  },
  和珅: {
    story:
      "清朝中期权臣，乾隆皇帝的宠臣，在故宫内外积累了巨额财富，其贪腐对清朝造成了负面影响。",
    details: ["乾隆朝第一宠臣", "巨额家产被查抄", "对清朝衰落有一定影响"],
  },
  纪晓岚: {
    story:
      "清朝著名学者、文学家，曾任《四库全书》总纂官，在故宫的文渊阁内留下了大量著作。",
    details: ["《四库全书》总纂官", "文渊阁大学士", "以才学和幽默著称"],
  },
  郎世宁: {
    story:
      "意大利籍传教士，清朝宫廷画家，将西方绘画技法带入故宫，为乾隆皇帝创作了大量重要画作。",
    details: [
      "清朝宫廷首席画家",
      "擅长中西合璧画风",
      "代表作有《百骏图》、《乾隆大阅图》等",
    ],
  },
  末代皇后婉容: {
    story:
      "中国历史上最后一位皇后，溥仪的妻子，在故宫度过了她最后的皇后时光，后随溥仪辗转各地。",
    details: ["溥仪皇后", "出身贵族", "一生坎坷多舛"],
  },
  珍妃: {
    story:
      "光绪皇帝的宠妃，因支持戊戌变法而触怒慈禧太后，最终在故宫被投井杀害。",
    details: ["光绪帝的妃子", "支持戊戌变法", "被慈禧太后处死于故宫井中"],
  },
  光绪皇帝: {
    story: "清朝第十一位皇帝，在故宫试图推行戊戌变法，但最终被慈禧太后软禁。",
    details: ["戊戌变法发起者", "被慈禧太后囚禁于瀛台", "一生受制于慈禧"],
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

.legend-hint {
  font-size: 0.85rem;
  color: #777;
  text-align: right;
  margin-top: 10px;
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
