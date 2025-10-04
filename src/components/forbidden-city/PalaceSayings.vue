<template>
  <div class="sayings-wrapper">
    <h2>故宫金句录</h2>
    <p class="subtitle">点击下方名句，探索其背后的故事与意境</p>

    <div class="sayings-wordcloud-container">
      <div ref="wordCloudChart" class="echarts-chart"></div>
      <p
        v-if="!processedSayings || processedSayings.length === 0"
        class="loading-text"
      >
        金句加载中...
      </p>
    </div>

    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeStory">
      <div class="modal-content">
        <button class="close-button" @click="closeStory">&times;</button>
        <div v-if="selectedSaying">
          <h3 class="modal-title">“{{ selectedSaying.saying }}”</h3>
          <p class="modal-story-title">{{ selectedSaying.story.title }}</p>
          <p class="modal-story-content">{{ selectedSaying.story.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts"; // 导入 ECharts
import "echarts-wordcloud"; // 导入词云插件，无需命名导入

// --- 数据中心 ---
const palaceSayings = ref([
  {
    id: "goldenRoof",
    saying: "金瓦红墙，琉璃光转",
    theme: "建筑美学",
    weight: 80, // 权重，决定词语大小
    story: {
      title: "紫禁之巅的皇权色",
      content:
        "这句诗描绘了故宫最具代表性的视觉符号。金色的琉璃瓦专供皇家建筑使用，尤其是在阳光下，整片屋顶流光溢彩，与朱红色的高墙形成强烈对比，共同构成了皇权至高无上的威严与华贵。每一片瓦都由官窑精心烧制，其工艺和色彩是古代中国等级制度最直观的体现。",
    },
  },
  {
    id: "nineDragon",
    saying: "九龙盘壁，栩栩如生",
    theme: "精湛工艺",
    weight: 70,
    story: {
      title: "皇极殿前的传世影壁",
      content:
        "故宫宁寿宫皇极门外的九龙壁，是中国现存三座古代九龙壁中最精美的一座。它由270块琉璃构件拼接而成，九条翻腾的巨龙在云水之间穿行，形态各异，栩栩如生。传说工匠在烧制过程中不慎损坏了一块，情急之下用一块楠木雕刻后刷上油漆顶替，竟瞒过了监工，至今那块“木腹”龙鳞仍在壁上，成为一段传奇。",
    },
  },
  {
    id: "chenZhang",
    saying: "宸章动四极，垂拱理万方",
    theme: "帝王之道",
    weight: 90,
    story: {
      title: "帝王治世的理想图景",
      content:
        "此句出自唐太宗李世民的诗篇，意指皇帝的文采和政令能够影响到天下四方，而他只需“垂衣拱手”，便能实现天下大治。这句诗完美体现了古代帝王在紫禁城内处理朝政、发布诏书的场景，表达了一种从容自信、天下归心的治国理想和皇权中心的威仪。",
    },
  },
  {
    id: "deepPalace",
    saying: "宫阙万间都做了土",
    theme: "历史感悟",
    weight: 75,
    story: {
      title: "王朝兴替的历史感慨",
      content:
        "此句出自元代张养浩的《山坡羊·潼关怀古》，原文感叹的是秦汉宫阙的消亡。当我们将这句词放在故宫的背景下，它引发了更深沉的历史思考：无论多么宏伟的建筑、多么强盛的王朝，终究会在历史长河中化为尘土。这为壮丽的故宫增添了一抹苍凉和哲思，提醒着人们历史的轮回与变迁。",
    },
  },
  {
    id: "stoneCarving",
    saying: "云龙石阶，鬼斧神工",
    theme: "精湛工艺",
    weight: 65,
    story: {
      title: "保和殿后的丹陛石",
      content:
        "在故宫保和殿后方，有一块中国现存最大的古代石雕——丹陛石。这块巨石重达200多吨，上面精雕细刻着九条口戏宝珠的游龙，衬以流云和海水江崖纹。在没有现代起重设备的明清两代，如何将这样的巨石从京郊运至紫禁城并安放妥当，至今仍是令人惊叹的工程奇迹，彰显了古代工匠的智慧与毅力。",
    },
  },
  {
    id: "hallOfSupremeHarmony",
    saying: "太和巍峨，彰显至尊",
    theme: "建筑美学",
    weight: 85,
    story: {
      title: "紫禁城的核心殿宇",
      content:
        "太和殿，俗称“金銮殿”，是故宫中最高大、最宏伟的建筑，也是明清两代皇帝举行大朝会和重要庆典的场所。其宏伟的体量和精密的结构，无不彰显着皇权的至高无上和国家的威严，是故宫建筑群的灵魂所在。",
    },
  },
  {
    id: "forbiddenCityName",
    saying: "紫禁城，天子居",
    theme: "历史感悟",
    weight: 80,
    story: {
      title: "帝都核心的名称由来",
      content:
        "“紫禁城”之名，源于中国古代星象学。天帝居住的“紫微垣”位于中天，因此人间帝王居住的宫殿便称为“紫”；又因宫禁森严，寻常人不得入内，故称“禁”。“城”则指城池，合称“紫禁城”，寓意皇帝是秉承天意统治天下的至高无上者。",
    },
  },
  {
    id: "gongbu",
    saying: "雕梁画栋，匠心独运",
    theme: "精湛工艺",
    weight: 60,
    story: {
      title: "故宫建筑的艺术细节",
      content:
        "故宫的每一处梁、每一扇窗，都经过精心的雕琢和绘制。无论是彩画、鎏金还是榫卯结构，都体现了古代工匠卓越的技艺和对美的极致追求。这些细节不仅具有装饰性，更蕴含着丰富的文化寓意和哲学思想，使得故宫成为一座活着的艺术宝库。",
    },
  },
  {
    id: "cultureInherit",
    saying: "文脉绵延，赓续千载",
    theme: "历史感悟",
    weight: 95,
    story: {
      title: "中华文明的传承之地",
      content:
        "故宫不仅是帝王的居所，更是中华五千年文明的载体。它承载了无数的历史事件、文化传统和艺术瑰宝。从《四库全书》的编纂到清明上河图的珍藏，故宫见证并守护着中华文化的脉络，是后世子孙了解和学习历史的重要窗口。",
    },
  },
  // 新增名言警句
  {
    id: "zhongzhou",
    saying: "紫禁城，中轴线的辉煌",
    theme: "建筑美学",
    weight: 78,
    story: {
      title: "规划之魂：贯穿古都的脊梁",
      content:
        "故宫的建筑布局严格遵循中轴线对称原则。这条中轴线不仅贯穿了太和殿、中和殿、保和殿等核心建筑，更延伸至北京城的永定门、天安门、地安门直至钟鼓楼，形成了世界上最长、最规整的城市中轴线。它象征着皇权的至高无上和天下一统，也是中国古代都城规划艺术的典范。",
    },
  },
  {
    id: "forbiddenCitySpirit",
    saying: "故宫精神，生生不息",
    theme: "历史感悟",
    weight: 92,
    story: {
      title: "从皇宫到博物馆的华丽转身",
      content:
        "“故宫精神”不仅指代它作为古代宫殿的辉煌，更包含了它在现代社会中的新生。从帝王居所到世界级的博物馆，故宫承载着对历史的敬畏、对文化的传承、对艺术的守护以及对未来的开放。它不仅仅是建筑，更是中华民族精神的象征，不断向世界讲述中国故事。",
    },
  },
  {
    id: "timeWhispers",
    saying: "时间在这里，低语千年",
    theme: "历史感悟",
    weight: 88,
    story: {
      title: "岁月留痕：每一砖一瓦的记忆",
      content:
        "故宫经历近六百年的风雨，每一块砖、每一片瓦都承载着历史的痕迹。在这里，你可以感受到明清两代帝王的悲欢离合，大臣的权谋斗争，以及宫廷女子的喜怒哀乐。时间在这里仿佛凝固，又仿佛流淌，向每一位来访者低声讲述着那些被尘封的往事。",
    },
  },
  {
    id: "culturalHeritage",
    saying: "文化遗产，世界共享",
    theme: "现代价值",
    weight: 85,
    story: {
      title: "超越国界：人类文明的瑰宝",
      content:
        "作为世界文化遗产，故宫已不再仅仅属于中国。它以其独特的建筑艺术、丰富的文物藏品和深厚的历史底蕴，成为全人类共同的精神财富。每年吸引着数千万海内外游客，成为连接中国与世界的文化桥梁，展现着中华文明的魅力和包容。",
    },
  },
  {
    id: "palaceTreasures",
    saying: "万宝之宫，蔚为大观",
    theme: "馆藏文物",
    weight: 75,
    story: {
      title: "殿堂深处：数不尽的奇珍异宝",
      content:
        "故宫博物院收藏的文物数量超过186万件（套），涵盖了陶瓷、书画、玉器、青铜器、钟表、珐琅等几乎所有艺术门类。这些珍宝不仅记录了中国古代的艺术成就和生活风貌，更是历史的见证者。它们静静地躺在故宫的深处，等待着与有缘之人相遇。",
    },
  },
  {
    id: "winterSnow",
    saying: "飞雪落宫墙，红墙傲白霜",
    theme: "四季美景",
    weight: 70,
    story: {
      title: "雪落紫禁：别样风情",
      content:
        "故宫四季皆有景致，而冬日飞雪下的故宫更是别有一番韵味。白雪覆盖在金色的琉璃瓦和朱红的宫墙上，银装素裹，寂静庄严。此时的故宫，仿佛穿越回了明清时代，透露出一种独特的古朴与诗意，吸引着无数摄影爱好者和游客前来捕捉这动人的瞬间。",
    },
  },
  {
    id: "wisdomGather",
    saying: "集贤纳谏，兴国安邦",
    theme: "帝王之道",
    weight: 68,
    story: {
      title: "治国理政：明君与贤臣的对话",
      content:
        "紫禁城不仅仅是皇帝的居所，更是国家决策的中心。历代帝王在此召集群臣，商议国是，采纳贤臣良谏，以求国家长治久安。这句警句体现了古代帝王治国理政的智慧和对国家兴盛的期盼，也反映了皇宫内部政治活动的深远影响。",
    },
  },
  {
    id: "guardianBeasts",
    saying: "神兽镇宅，瑞兽呈祥",
    theme: "建筑美学",
    weight: 60,
    story: {
      title: "檐角脊兽：守护宫殿的精灵",
      content:
        "在故宫的屋脊上，除了吻兽，还有一排排大小不一、形态各异的脊兽。它们并非简单的装饰，而是具有镇宅、辟邪、吉祥等寓意的神兽。从龙、凤、狮子到海马、狻猊等，每一只神兽都有其特定的位置和象征意义，共同守护着宫殿的安宁与祥瑞，展现了古代建筑中独特的文化符号。",
    },
  },
  {
    id: "openForbiddenCity",
    saying: "开放故宫，拥抱未来",
    theme: "现代价值",
    weight: 90,
    story: {
      title: "活着的博物馆：与时俱进的故宫",
      content:
        "今天的故宫，已不再是高墙深锁的禁地，而是积极拥抱公众和未来的开放式博物馆。它通过数字故宫、文创产品、教育活动等多种形式，让古老的文化遗产焕发新生，走进寻常百姓家。这句名言体现了故宫与时俱进、传承创新的现代精神。",
    },
  },
]);

// 定义主题颜色映射
const themeColors = {
  建筑美学: "#c09030", // 金黄色，代表琉璃瓦和建筑的辉煌
  精湛工艺: "#7b6f5e", // 灰棕色，代表石材和工匠的朴实与精巧
  帝王之道: "#a7302f", // 朱红色，代表皇权与庄重
  历史感悟: "#4a5a6a", // 青灰色，代表历史的厚重与深邃
};

// ECharts 相关
const wordCloudChart = ref(null); // 用于获取 DOM 元素的引用
let myChart = null; // ECharts 实例

// 计算属性：将 palaceSayings 转换为 ECharts 词云所需的格式
const processedSayings = computed(() => {
  return palaceSayings.value.map((item) => ({
    name: item.saying, // ECharts 词云使用 'name'
    value: item.weight, // ECharts 词云使用 'value'
    theme: item.theme, // 保留主题信息用于颜色映射和点击事件
    originalData: item, // 将原始完整数据也保存一份，方便点击时获取故事
  }));
});

// 根据主题获取颜色函数
function getWordColor(params) {
  // params.data 包含了上面 processedSayings 中每个项的完整数据
  const theme = params.data.theme;
  return themeColors[theme] || "#5c4d3c"; // 默认颜色
}

// 初始化 ECharts 词云
const initChart = () => {
  if (wordCloudChart.value) {
    myChart = echarts.init(wordCloudChart.value);
    setChartOption();
    // 监听窗口大小变化，重新调整图表
    window.addEventListener("resize", myChart.resize);
  }
};

// 设置 ECharts 选项
const setChartOption = () => {
  const option = {
    series: [
      {
        type: "wordCloud",
        shape: "circle", // 词云形状，可选 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
        // shape: 'pentagon', // 尝试其他形状
        // maskImage: maskImage, // 可以设置一个图片作为词云的形状蒙版，更高级的定制
        left: "center",
        top: "center",
        width: "90%",
        height: "90%",
        right: null,
        bottom: null,
        sizeRange: [12, 60], // 字体大小范围，根据 weight 映射到这个范围
        rotationRange: [-45, 45], // 词语旋转角度范围
        rotationStep: 90, // 旋转步长
        gridSize: 8, // 词语之间的间距，越大越稀疏
        drawOutOfBound: false, // 是否允许词语超出边界
        layoutAnimation: true, // 是否开启动画

        textStyle: {
          fontFamily: "Noto Serif SC, Songti SC, STSong, serif",
          fontWeight: "bold",
          color: getWordColor, // 使用函数来动态设置颜色
        },
        emphasis: {
          focus: "self",
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: processedSayings.value, // 绑定处理后的数据
      },
    ],
  };
  myChart.setOption(option);

  // 添加点击事件监听
  myChart.off("click"); // 先移除旧的监听器，防止重复添加
  myChart.on("click", function (params) {
    if (
      params.componentType === "series" &&
      params.seriesType === "wordCloud"
    ) {
      // params.data 包含了我们传入的 originalData
      showStory(params.data.originalData);
    }
  });
};

// 监听 processedSayings 变化，重新渲染词云
watch(
  processedSayings,
  () => {
    if (myChart) {
      setChartOption(); // 数据变化时更新图表
    }
  },
  { deep: true }
);

// --- 交互逻辑 ---
const isModalVisible = ref(false);
const selectedSaying = ref(null);

const showStory = (item) => {
  selectedSaying.value = item;
  isModalVisible.value = true;
};

const closeStory = () => {
  isModalVisible.value = false;
  setTimeout(() => {
    selectedSaying.value = null;
  }, 300);
};

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 组件卸载时销毁图表实例，防止内存泄漏
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
    window.removeEventListener("resize", myChart.resize);
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap");

.sayings-wrapper {
  background-color: #f9f6f2;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-family: "Noto Serif SC", "Songti SC", "STSong", serif;
}

.sayings-wrapper h2 {
  font-size: 2.5rem;
  color: #5c4d3c;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #8c7b60;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

/* ECharts 词云容器 */
.sayings-wordcloud-container {
  width: 100%;
  height: 450px; /* 增加高度以提供更多词云空间 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  position: relative; /* 如果有 loading 文本，可能需要相对定位 */
}

.echarts-chart {
  width: 100%;
  height: 100%;
}

.loading-text {
  position: absolute;
  color: #8c7b60;
  font-size: 1.2rem;
}

/* --- 弹窗 (Modal) 样式 --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  background: #fdfaf5;
  padding: 3rem;
  border-radius: 10px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #d4c0a1;
  animation: slideIn 0.4s ease-out;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #a08c70;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #5c4d3c;
}

.modal-title {
  font-size: 2.2rem;
  color: #5c4d3c;
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.modal-story-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #7a6a57;
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0d1b9;
}

.modal-story-content {
  font-size: 1.1rem;
  line-height: 2;
  color: #665a48;
  text-align: justify;
  white-space: pre-wrap;
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 1rem;
}

/* 滚动条美化 (可选) */
.modal-story-content::-webkit-scrollbar {
  width: 8px;
}
.modal-story-content::-webkit-scrollbar-track {
  background: #fdfaf5;
}
.modal-story-content::-webkit-scrollbar-thumb {
  background-color: #c8b08a;
  border-radius: 20px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
