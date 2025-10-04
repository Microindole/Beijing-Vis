<template>
  <div class="sayings-wrapper">
    <h2>大栅栏金句录</h2>
    <p class="subtitle">点击下方名句，感受京味儿市井的百年变迁与底蕴</p>

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
import * as echarts from "echarts";
import "echarts-wordcloud";

// --- 数据中心 ---
const dataSayings = ref([
  {
    id: "oldBrand",
    saying: "老字号，老味道，老讲究",
    theme: "商业传承",
    weight: 90, // 权重，决定词语大小
    story: {
      title: "百年商业的金字招牌",
      content:
        "大栅栏是中华老字号的聚集地。这里有同仁堂的济世医心，瑞蚨祥的丝绸华丽，内联升的布鞋匠心。这些老字号不仅是商品的载体，更是技艺、信誉和文化的传承。每一件商品背后，都凝结着数代人的坚持与讲究，它们共同构筑了大栅栏独特的商业生态。",
    },
  },
  {
    id: "hutongCharm",
    saying: "胡同深处，生活百年",
    theme: "市井生活",
    weight: 85,
    story: {
      title: "京味儿民俗的活化石",
      content:
        "穿梭于大栅栏的胡同，你会发现这里保留着最纯粹的老北京生活气息。那些四合院、青砖灰瓦，记录着普通百姓的喜怒哀乐。邻里间的家长里短，夏日傍晚的摇扇闲聊，都让胡同充满了人情味儿。它不仅是居住空间，更是京味儿文化得以延续的温床。",
    },
  },
  {
    id: "qianmenWai",
    saying: "前门外，繁华尽入眼",
    theme: "地理与变迁",
    weight: 80,
    story: {
      title: "城外商业的繁盛之地",
      content:
        "“前门外”不仅仅是一个地理方位，它代表了北京城在清末民初商业最鼎盛的区域。昔日，从城里出来的达官贵人、贩夫走卒，都汇聚于此。戏园、茶楼、商铺林立，人声鼎沸，夜市通宵达旦。大栅栏正是这片繁华的核心，见证了老北京的商业脉搏。",
    },
  },
  {
    id: "broadwayOfBeijing",
    saying: "戏楼弦歌，京韵悠长",
    theme: "文化艺术",
    weight: 75,
    story: {
      title: "京剧的发祥与兴盛",
      content:
        "大栅栏曾经是京城最重要的戏园子聚集地，广德楼、三庆园、庆乐园等名角荟萃。谭鑫培、梅兰芳等京剧大师都曾在此登台献艺。一声声锣鼓，一段段唱腔，不仅是娱乐，更是京剧艺术从萌芽到成熟的温床，奠定了它作为国粹的地位。",
    },
  },
  {
    id: "localTaste",
    saying: "卤煮爆肚，舌尖京味儿",
    theme: "特色美食",
    weight: 70,
    story: {
      title: "地道小吃的诱惑",
      content:
        "大栅栏是北京小吃的天堂。焦圈、豆汁、炒肝、卤煮火烧、爆肚……这些看似朴实却充满独特风味的小吃，承载着老北京人的集体记忆。它们是市井生活的真实写照，也是味蕾对传统文化最直接的体验，让游客在品尝中感受京味儿。",
    },
  },
  {
    id: "pedestrianStreet",
    saying: "步行街上，新旧交融",
    theme: "城市更新",
    weight: 65,
    story: {
      title: "传统街区的现代转型",
      content:
        "如今的大栅栏步行街，在保留原有历史风貌的同时，也融入了现代商业元素。老字号焕发新颜，文创店、咖啡馆也悄然入驻。这种新旧交融的格局，是大栅栏在城市发展中积极探索的结果，力求在传承中创新，让百年街区焕发新的活力。",
    },
  },
  {
    id: "firefighter",
    saying: "消防局，见证沧桑",
    theme: "历史事件",
    weight: 60,
    story: {
      title: "火灾与重建的记忆",
      content:
        "大栅栏地区历史上曾多次遭受火灾，其中以庚子事变（1900年八国联军侵华）后的大火最为惨重，几乎将整条街区付之一炬。然而，每次灾难后，大栅栏都能迅速重建，并再次繁荣起来。街区内的老消防局，如今已成历史遗迹，默默诉说着这片土地的坚韧与凤凰涅槃。",
    },
  },
  {
    id: "culturalHeritage",
    saying: "非遗活态，传承京韵",
    theme: "文化艺术",
    weight: 95,
    story: {
      title: "传统技艺的活态展示",
      content:
        "大栅栏不仅有物质遗产，更有着丰富的非物质文化遗产。许多老字号的传统制作技艺，如内联升的手工布鞋、张一元的茉莉花茶窨制，都已列入非遗名录。在这里，你可以看到、体验到这些活态的文化传承，感受传统匠人的执着与坚守。",
    },
  },
  {
    id: "meltingPot",
    saying: "南来北往，汇聚成街",
    theme: "市井生活",
    weight: 78,
    story: {
      title: "多元文化的交汇之所",
      content:
        "作为前门外的商业中心，大栅栏自古就是各色人等汇聚之地。小商贩、艺人、游客、居民，南腔北调，五湖四海。这种多元的文化交融，使得大栅栏形成了开放包容、充满活力的独特氛围，也塑造了其丰富的市井百态。",
    },
  },
]);

// 定义主题颜色映射，使用更贴近市井和老北京的暖色、大地色
const themeColors = {
  商业传承: "#a0522d", // 土褐色，代表老字号的厚重
  市井生活: "#d2691e", // 巧克力色，代表胡同生活的温暖
  地理与变迁: "#cd853f", // 秘鲁色，代表历史的沉淀
  文化艺术: "#b8860b", // 暗金色，代表戏曲艺术的华丽
  特色美食: "#f4a460", // 沙棕色，代表小吃的诱人
  城市更新: "#8b4513", // 马鞍棕，代表街区的新生
  历史事件: "#696969", // 暗灰色，代表历史的厚重感
};

// ECharts 相关
const wordCloudChart = ref(null);
let myChart = null;

// 计算属性：将 dataSayings 转换为 ECharts 词云所需的格式
const processedSayings = computed(() => {
  return dataSayings.value.map((item) => ({
    name: item.saying,
    value: item.weight,
    theme: item.theme,
    originalData: item,
  }));
});

// 根据主题获取颜色函数
function getWordColor(params) {
  const theme = params.data.theme;
  return themeColors[theme] || "#5c4d3c"; // 默认颜色，如果主题未定义
}

// 初始化 ECharts 词云
const initChart = () => {
  if (wordCloudChart.value) {
    myChart = echarts.init(wordCloudChart.value);
    setChartOption();
    window.addEventListener("resize", myChart.resize);
  }
};

// 设置 ECharts 选项
const setChartOption = () => {
  const option = {
    series: [
      {
        type: "wordCloud",
        shape: "circle", // 词云形状，可以是 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
        left: "center",
        top: "center",
        width: "90%",
        height: "90%",
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-45, 45],
        rotationStep: 90,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,

        textStyle: {
          fontFamily: 'SimSun, "STSong", serif', // 换用宋体，更具年代感
          fontWeight: "bold",
          color: getWordColor,
        },
        emphasis: {
          focus: "self",
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: processedSayings.value,
      },
    ],
  };
  myChart.setOption(option);

  myChart.off("click");
  myChart.on("click", function (params) {
    if (
      params.componentType === "series" &&
      params.seriesType === "wordCloud"
    ) {
      showStory(params.data.originalData);
    }
  });
};

// 监听 processedSayings 变化，重新渲染词云
watch(
  processedSayings,
  () => {
    if (myChart) {
      setChartOption();
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
