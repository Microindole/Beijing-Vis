<template>
  <div class="sayings-wrapper">
    <h2>明十三陵金句录</h2>
    <p class="subtitle">点击下方名句，探索其背后的历史故事与意境</p>

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
          <h3 class="modal-title">"{{ selectedSaying.saying }}"</h3>
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
// 明十三陵金句数据
const mausoleumSayings = ref([
  {
    id: "dragonMountain",
    saying: "龙脉天寿，帝王长眠",
    theme: "风水格局",
    weight: 90,
    story: {
      title: "天寿山的风水奥秘",
      content:
        '明十三陵选址于北京昌平天寿山南麓，这里山环水抱，藏风聚气，是古代风水学中的"吉壤"。天寿山形似盘龙，被视为"龙脉"所在，明朝皇帝希望借此风水宝地保佑江山永固，帝业长青。',
    },
  },
  {
    id: "stoneBeast",
    saying: "石兽肃立，守护千年",
    theme: "陵寝规制",
    weight: 80,
    story: {
      title: "神道两侧的石像生",
      content:
        "明十三陵神道两侧排列着狮子、獬豸、骆驼、象、麒麟、马等石兽共24尊，象征皇帝生前的仪仗和威严。这些石像生雕刻精美，历经数百年风雨依然肃立，默默守护着长眠于此的明朝帝王。",
    },
  },
  {
    id: "undergroundPalace",
    saying: "地宫深邃，珍宝无数",
    theme: "考古发现",
    weight: 85,
    story: {
      title: "定陵地宫的惊人发现",
      content:
        "1956年对定陵的考古发掘揭开了明代帝王陵寝的神秘面纱。地宫深达27米，出土了金冠、凤冠、龙袍等3000余件珍贵文物，展现了明代高超的工艺水平和皇家生活的奢华。",
    },
  },
  {
    id: "eternalRest",
    saying: "松柏长青，帝王安息",
    theme: "陵园景观",
    weight: 75,
    story: {
      title: "十三陵的古树奇观",
      content:
        '明十三陵种植了大量松柏，寓意"万古长青"。这些古树有的已有600多年历史，见证了明朝的兴衰更替。其中长陵的"九龙柏"尤为著名，树干纹路如九条蟠龙，相传为永乐帝亲手所植。',
    },
  },
  {
    id: "sacredWay",
    saying: "神道蜿蜒，通向永恒",
    theme: "建筑艺术",
    weight: 70,
    story: {
      title: "十三陵的中轴线",
      content:
        '明十三陵共用一条长达7公里的神道，这条中轴线连接各陵，象征皇帝死后通往天国的道路。神道两侧古柏参天，庄严肃穆，体现了"事死如事生"的古代丧葬观念。',
    },
  },
  {
    id: "mingDynasty",
    saying: "明陵巍峨，诉说兴衰",
    theme: "历史沧桑",
    weight: 95,
    story: {
      title: "明朝历史的缩影",
      content:
        "明十三陵埋葬了从永乐到崇祯共13位明朝皇帝，几乎涵盖了整个明朝历史。每座陵墓的建筑风格、规模大小都反映了当时国力的强弱，是研究明朝政治、经济、文化的重要实物资料。",
    },
  },
  {
    id: "eternalPower",
    saying: "皇权永恒，黄土一抔",
    theme: "历史感悟",
    weight: 88,
    story: {
      title: "权力与死亡的思考",
      content:
        '明十三陵宏伟的建筑群展现了皇权的至高无上，但最终这些帝王也不过长眠于黄土之下。这种对比引发人们对权力、生命和历史的深刻思考，正如诗人所说："古今将相在何方？荒冢一堆草没了。"',
    },
  },
  {
    id: "stoneTablet",
    saying: "碑文斑驳，功过谁评",
    theme: "历史评价",
    weight: 65,
    story: {
      title: "神功圣德碑的启示",
      content:
        '每座明陵前都立有神功圣德碑，记载皇帝的"丰功伟绩"。然而历史评价往往与碑文相去甚远，如万历皇帝碑文称颂其"圣明"，实则他二十余年不上朝，导致明朝加速衰亡。',
    },
  },
  {
    id: "lastEmperor",
    saying: "思陵孤寂，王朝终章",
    theme: "历史转折",
    weight: 92,
    story: {
      title: "明朝的最后安息地",
      content:
        "思陵是明朝末代皇帝崇祯的陵墓，规模最小且位置偏僻。1644年李自成攻入北京，崇祯自缢于煤山，后由清廷草草安葬于此。思陵的凄凉景象，成为276年大明王朝的悲情终章。",
    },
  },
]);

// 定义主题颜色映射
const themeColors = {
  风水格局: "#5a8f3d", // 青绿色，代表自然与风水
  陵寝规制: "#8b5a2b", // 土褐色，代表建筑与规制
  考古发现: "#c17736", // 金黄色，代表珍宝与发现
  陵园景观: "#3a5c40", // 深绿色，代表古树与景观
  建筑艺术: "#7a6a56", // 灰褐色，代表石雕与建筑
  历史沧桑: "#4a4a4a", // 深灰色，代表历史厚重感
  历史感悟: "#6d4c41", // 褐红色，代表哲思与感悟
  历史评价: "#5d4037", // 深褐色，代表评价与反思
  历史转折: "#8d6e63", // 浅褐色，代表变革与转折
};

// ECharts 相关
const wordCloudChart = ref(null); // 用于获取 DOM 元素的引用
let myChart = null; // ECharts 实例

// 计算属性：将 palaceSayings 转换为 ECharts 词云所需的格式
const processedSayings = computed(() => {
  return mausoleumSayings.value.map((item) => ({
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
