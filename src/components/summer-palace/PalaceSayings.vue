<template>
  <div class="sayings-wrapper">
    <h2>颐和园金句录</h2>
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
// --- 数据中心 ---
const palaceSayings = ref([
  {
    id: "kunmingLake",
    saying: "昆明湖畔，碧波荡漾",
    theme: "园林风光",
    weight: 90, // 权重，决定词语大小
    story: {
      title: "湖光山色，江南意境",
      content:
        "昆明湖是颐和园的主体水面，占全园面积的四分之三。湖水清澈，碧波万顷，与远处的万寿山相映成趣，构成了典型的中国山水园林画卷。昆明湖的设计借鉴了杭州西湖的特点，使得北方皇家园林也充满了江南水乡的婉约和灵动。泛舟湖上，或漫步湖畔，都能感受到心旷神怡的惬意。",
    },
  },
  {
    id: "longevityHill",
    saying: "万寿山高，佛香凌空",
    theme: "标志建筑",
    weight: 85,
    story: {
      title: "园中之魂，皇家气势",
      content:
        "万寿山是颐和园的园中山体，海拔不高，但其上建筑群宏伟壮丽，尤其是依山而建的佛香阁，高耸入云，是颐和园的标志性建筑。佛香阁八面三层四重檐，气势磅礴，登上阁顶，昆明湖的全景和远处的玉泉山塔尽收眼底，展现了皇家园林的非凡气派和精妙布局。",
    },
  },
  {
    id: "longCorridor",
    saying: "长廊彩绘，万幅如生",
    theme: "艺术瑰宝",
    weight: 80,
    story: {
      title: "世界最长的画廊",
      content:
        "颐和园长廊全长728米，连接了乐寿堂和排云殿，是园中最具特色的建筑之一。长廊的每一根梁枋上都绘有精美的彩画，总计超过14000幅，内容涵盖山水、花鸟、人物故事，其中不乏《西游记》、《三国演义》等古典名著的场景。这些彩画不仅具有极高的艺术价值，也使得长廊成为一个流动的画卷，漫步其中，仿佛置身于历史和艺术的长河。",
    },
  },
  {
    id: "marbleBoat",
    saying: "石舫轻摇，浮沉百年",
    theme: "独特设计",
    weight: 75,
    story: {
      title: "水上奇观，中西合璧",
      content:
        "颐和园的石舫又名清晏舫，位于昆明湖西北岸，造型独特，船体为大理石雕刻而成，船上是两层中式殿堂，但船尾却安装了两个西式的螺旋桨。它象征着清王朝“石”一般稳固的统治，又反映了晚清中西文化交流的痕迹。然而，其背后挪用海军经费修建的争议，也让它成为了历史沧桑的见证。",
    },
  },
  {
    id: "cixi",
    saying: "慈禧垂帘，园中听政",
    theme: "历史印记",
    weight: 95, // 慈禧是颐和园后期最重要的历史人物
    story: {
      title: "晚清权力中心的缩影",
      content:
        "颐和园在慈禧太后手中得到了大规模的重建和扩建，成为她晚年主要的居住和处理朝政的场所。慈禧经常在乐寿堂、宜芸馆等地“垂帘听政”，发布政令，接见外国使节，这里是晚清政治、外交舞台的重要背景。她的奢靡生活和对园林的热爱，深刻影响了颐和园的命运和风貌。",
    },
  },
  {
    id: "qianlong",
    saying: "乾隆营建，清漪旧梦",
    theme: "历史溯源",
    weight: 70,
    story: {
      title: "最初的皇家画卷",
      content:
        "颐和园的前身是清漪园，由乾隆皇帝耗时十五年建成，是乾隆盛世“三山五园”的重要组成部分。乾隆帝对园林建设倾注了大量心血，他亲自指导设计，借鉴江南园林的艺术手法，将清漪园打造成一座集自然山水与人工建筑于一体的宏大园林。尽管后来清漪园被焚毁，但乾隆帝的营建奠定了颐和园的整体格局和艺术基础。",
    },
  },
  {
    id: "seventeenArchBridge",
    saying: "十七孔桥，通连南湖",
    theme: "精巧构筑",
    weight: 65,
    story: {
      title: "桥梁艺术的典范",
      content:
        "颐和园昆明湖上的十七孔桥是连接东岸与南湖岛的一座大型石桥，因有十七个桥洞而得名。桥身雕刻精美，两端桥头各有石雕雄狮，形态各异，栩栩如生。这座桥不仅是重要的交通连接，更是颐和园水景构图中的重要组成部分，其优美的弧线与湖光山色融为一体，展现了中国古代桥梁建筑的精湛技艺和美学追求。",
    },
  },
  {
    id: "harmoniousInterestGarden",
    saying: "谐趣园中，江南雅韵",
    theme: "园中园",
    weight: 60,
    story: {
      title: "颐和园中的江南园林",
      content:
        "谐趣园是颐和园内的一座“园中园”，以其小巧玲珑、精致典雅的江南园林风格而闻名。园内有亭、台、楼、阁、廊、桥等建筑，围绕池塘而建，布局精巧，步移景异。乾隆帝曾将它命名为“惠山园”，仿无锡寄畅园而建，充满了诗情画意，是颐和园中一处静谧而富有生趣的角落。",
    },
  },
  {
    id: "goldenAxe",
    saying: "湖山相依，天人合一",
    theme: "哲学意境",
    weight: 92,
    story: {
      title: "中国园林哲学的高度体现",
      content:
        "颐和园将自然的山水与人工的建筑完美结合，达到了一种“虽由人作，宛自天开”的境界。昆明湖和万寿山构成了“一山一水”的经典布局，体现了中国人追求天人合一、顺应自然的哲学思想。园林中的每一处景致都经过精心设计，旨在创造一个和谐、宁静、富有诗意的环境，让人身临其境地感受自然的韵味和人文的关怀。",
    },
  },
]);

// 定义主题颜色映射
const themeColors = {
  园林风光: "#4CAF50", // 绿色系，代表自然景色
  标志建筑: "#EF5350", // 红色系，代表重要建筑的醒目
  艺术瑰宝: "#FFEB3B", // 黄色系，代表彩绘、雕刻的华丽
  独特设计: "#2196F3", // 蓝色系，代表水景和独特的创造
  历史印记: "#7B1FA2", // 紫色系，代表历史的深沉和皇家色彩
  历史溯源: "#607D8B", // 灰蓝色，代表历史的厚重和源远流长
  精巧构筑: "#FF9800", // 橙色系，代表精巧的工程和结构
  园中园: "#9CCC65", // 浅绿色，代表园中园的雅致与生机
  哲学意境: "#3F51B5", // 深蓝色，代表深远的哲学思想
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
