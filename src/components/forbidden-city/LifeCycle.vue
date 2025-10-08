<template>
  <div class="lifecycle-container">
    <!-- 页面标题 -->
    <div class="lifecycle-header">
      <h1>故宫建筑群演变与修缮历程</h1>
      <p class="intro-text">从永乐肇建到世界文化遗产的六百年紫禁传奇</p>
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-button">← 返回故宫门户</button>
      <!-- 新增状态概览卡片 -->
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">🏗️</span>
          <div>
            <h3>主要建筑</h3>
            <p class="status-value">980座</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">603年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">📐</span>
          <div>
            <h3>占地面积</h3>
            <p class="status-value">72万㎡</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="lifecycle-main">
      <!-- 时间轴导航 -->
      <div class="timeline-nav">
        <div
          v-for="(item, index) in timelineData"
          :key="index"
          :class="['timeline-point', { active: activeIndex === index }]"
          @click="setActiveIndex(index)"
        >
          <div class="timeline-marker"></div>
          <span class="timeline-year">{{ item.year }}</span>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 时间轴左侧 -->
        <div class="timeline-section">
          <div class="timeline">
            <div class="timeline-line"></div>
            <div
              v-for="(item, index) in timelineData"
              :key="index"
              :class="['timeline-item', { active: activeIndex === index }]"
              @click="handleClick(index, $event)"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-year">{{ item.year }}</div>
              <div class="timeline-title">{{ item.title }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <!-- 弹窗内容 -->
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>

            <div class="modal-body">
              <!-- 左侧文字内容 -->
              <div class="history-card">
                <!-- 图 + 标题 -->
                <div class="history-info">
                  <h2>{{ activeData.title }}</h2>
                  <div class="history-period">{{ activeData.period }}</div>
                  <div class="history-desc">{{ activeData.description }}</div>

                  <!-- 数据指标 -->
                  <div class="history-metrics">
                    <div
                      class="metric"
                      v-for="(metric, idx) in activeData.metrics"
                      :key="idx"
                    >
                      <div class="metric-value">{{ metric.value }}</div>
                      <div class="metric-label">{{ metric.label }}</div>
                    </div>
                  </div>

                  <!-- 建筑特点 -->
                  <div
                    class="architectural-features"
                    v-if="activeData.features"
                  >
                    <h3>建筑特点</h3>
                    <ul>
                      <li
                        v-for="(feature, idx) in activeData.features"
                        :key="idx"
                      >
                        {{ feature }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 右侧网络图 -->
              <div class="network-section" v-if="selectedEvent">
                <h3>{{ selectedEvent.year }}年：{{ selectedEvent.event }}</h3>
                <LandmarkNetwork
                  :landmark="forbiddenCity"
                  :event="selectedEvent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 可视化图表区域 -->
      <div class="visualization-section">
        <div class="visualization-card">
          <h3>宫殿建筑规模演变</h3>
          <div ref="chart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>建筑功能分布</h3>
          <div ref="typeChart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>琉璃瓦使用变迁</h3>
          <div ref="tileChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <footer class="lifecycle-footer">
      <p class="copyright">
        © {{ new Date().getFullYear() }} 故宫博物院数字文化遗产中心
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import LandmarkNetwork from "../LandmarkNetwork.vue";
import forbiddenCityData from "../../assets/forbidden-city.json";

const router = useRouter();

const forbiddenCity = ref(forbiddenCityData);

// 返回门户主页
const goBack = () => router.push("/landmarks/forbidden-city");

// 时间轴数据 - 重点强化建筑演变内容
const timelineData = ref([
  {
    year: "1406",
    title: "奉旨动工",
    event: "开始筹建",
    period: "明永乐四年",
    description:
      "明成祖朱棣迁都北京后，下诏仿照南京故宫规制，在元大都皇宫旧址基础上开始兴建北京宫殿。规划严格遵循《周礼·考工记》的“前朝后寝，左祖右社”的礼制格局，奠定了紫禁城宏伟壮丽的建筑群基础。主要建筑包括奉天殿、华盖殿、谨身殿、以及乾清宫、坤宁宫等。",
    image: "https://picsum.photos/600/400?palace=1",
    metrics: [
      { value: "72万平方米", label: "占地面积" },
      { value: "9000余间", label: "房屋数量" },
      { value: "52米", label: "午门高度" },
    ],
    features: [
      "黄瓦红墙，金碧辉煌",
      "严格的中轴对称布局",
      "三重殿宇与内廷宫殿",
    ],
    relatedFigures: ["朱棣", "蒯祥", "蔡信", "阮安"],
    relatedEvents: ["靖难之役", "永乐迁都", "郑和下西洋", "永乐大典编纂"],
  },
  {
    year: "1420",
    title: "紫禁城落成",
    event: "正式启用",
    period: "明永乐十八年",
    description:
      "北京宫殿建成，明成祖朱棣迁都北京，正式启用。紫禁城作为明清两代的皇宫，成为国家政治、文化中心长达五百年。建成之初，其建筑规制和规模达到了封建社会皇宫的顶峰，象征着皇权的至高无上。宫殿建筑群的木结构、石雕、彩绘等工艺均代表了当时的最高水平。",
    image: "https://picsum.photos/600/400?palace=2",
    metrics: [
      { value: "500年", label: "皇家历史" },
      { value: "24位", label: "帝王居住" },
      { value: "15年", label: "建造工期" },
    ],
    features: [
      "太和殿为中心的三大殿",
      "内金水桥和太和门广场",
      "角楼与护城河的防御体系",
    ],
    relatedFigures: ["朱棣", "夏原吉", "杨荣", "杨士奇"],
    relatedEvents: ["北京城规划", "三大殿建设", "明长城修建", "永乐盛世"],
  },
  {
    year: "1644",
    title: "甲申之变",
    event: "宫殿受损",
    period: "明崇祯十七年",
    description:
      "李自成攻入北京，明朝灭亡。紫禁城部分建筑在此期间遭受焚毁，特别是三大殿（奉天殿、华盖殿、谨身殿）被付之一炬。清军入关后，在这些废墟上进行重建，并更名为太和殿、中和殿、保和殿，奠定了清代紫禁城的格局。此次事件是紫禁城历史上一次重大的破坏与重建。",
    image: "https://picsum.photos/600/400?palace=3",
    metrics: [
      { value: "3座", label: "被毁大殿" },
      { value: "数年", label: "重建时间" },
      { value: "清顺治元年", label: "重建开始" },
    ],
    features: ["太和殿宏伟重建", "保留明代建筑规制", "清代彩绘风格融入"],
    relatedFigures: ["李自成", "崇祯帝", "多尔衮", "吴三桂"],
    relatedEvents: ["甲申之变", "清军入关", "明朝灭亡", "大顺政权"],
  },
  {
    year: "1733",
    title: "清代鼎盛",
    event: "乾隆修缮与增建",
    period: "清雍正十一年",
    description:
      "乾隆皇帝在位期间，对紫禁城进行了大规模的修缮、扩建和美化。不仅修复了多处宫殿，还增建了宁寿宫区（乾隆花园、倦勤斋等）、慈宁宫花园等，极大地丰富了紫禁城的建筑群。此次修缮注重细节与装饰，大量使用雕刻、彩绘、陈设等艺术手法，使紫禁城达到其艺术成就的巅峰。",
    image: "https://picsum.photos/600/400?palace=4",
    metrics: [
      { value: "100+", label: "修缮宫殿" },
      { value: "50+", label: "新增建筑" },
      { value: "30年+", label: "持续工程" },
    ],
    features: [
      "宁寿宫花园精巧设计",
      "养心殿作为皇帝理政居所",
      "倦勤斋的通景画与竹丝镶嵌",
    ],
    relatedFigures: ["乾隆帝", "雍正帝", "傅恒", "和珅"],
    relatedEvents: ["康乾盛世", "文字狱", "《四库全书》编纂", "西征准噶尔"],
  },
  {
    year: "1912",
    title: "清帝退位",
    event: "故宫博物院筹备",
    period: "民国元年",
    description:
      "清朝灭亡，末代皇帝溥仪退位，但仍居于紫禁城内廷。1924年，冯玉祥发动“北京政变”，将溥仪驱逐出宫。随后，清室善后委员会成立，着手清点文物，并筹备在紫禁城的基础上建立故宫博物院。这一时期是紫禁城从皇家宫殿向公共博物馆转变的关键阶段。",
    image: "https://picsum.photos/600/400?palace=5",
    metrics: [
      { value: "12年", label: "溥仪居宫" },
      { value: "1925年", label: "博物院成立" },
      { value: "120万+", label: "馆藏文物" },
    ],
    features: ["文物清点与整理", "部分区域对外开放", "宫殿功能逐渐转型"],
    relatedFigures: ["溥仪", "袁世凯", "隆裕太后", "孙中山"],
    relatedEvents: ["辛亥革命", "清朝灭亡", "中华民国成立", "南北议和"],
  },
  {
    year: "1987",
    title: "世界遗产",
    event: "列入名录",
    period: "现代",
    description:
      "故宫博物院被联合国教科文组织列入《世界遗产名录》，成为全人类的文化瑰宝。中国政府加大了对故宫的保护力度，进行大规模的修缮和数字化保护工程，致力于恢复其历史原貌，并不断提升展览水平和游客服务。故宫每年吸引着数千万游客，成为展示中华文明的重要窗口。",
    image: "https://picsum.photos/600/400?palace=6",
    metrics: [
      { value: "100+", label: "修缮项目" },
      { value: "2000万+", label: "年游客量" },
      { value: "98%", label: "开放面积" },
    ],
    features: ["“平安故宫”工程实施", "数字化展示与研究", "文化创意产品开发"],
    relatedFigures: ["易培基", "李煜瀛", "庄蕴宽", "胡适"],
    relatedEvents: [
      "新文化运动",
      "五四运动",
      "故宫文物南迁",
      "中国博物馆事业开端",
    ],
  },
]);

const isModalOpen = ref(false);

// 当前活动索引
const activeIndex = ref(0);

// 当前活动数据
const activeData = computed(() => timelineData.value[activeIndex.value]);

const selectedEvent = ref(null);

// 点击处理函数
function handleClick(index, event) {
  activeIndex.value = index;
  isModalOpen.value = true;
  selectedEvent.value = timelineData.value[index]; // ✅ 这才是正确的数据
}

function closeModal() {
  isModalOpen.value = false;
}

// ECharts图表实例
const chart = ref(null);
const typeChart = ref(null);
const tileChart = ref(null); // 新增ref
let chartInstance = null;
let typeChartInstance = null;
let tileChartInstance = null; // 新增实例

// 宫殿建筑规模演变数据
const chartData = ref({
  years: ["1406", "1420", "1644", "1733", "1912", "1925", "1987"], // 根据你的故宫 timelineData 调整年份
  sizes: [70, 95, 40, 100, 85, 90, 98], // 估算的相对规模百分比
  // 1406: 70% (建造中)
  // 1420: 95% (基本建成，初期完整)
  // 1644: 40% (三大殿等严重烧毁)
  // 1733: 100% (乾隆时期大规模重建和增建，达到巅峰)
  // 1912: 85% (晚清至民国初期，维护不足，略有损毁)
  // 1925: 90% (博物院成立后开始修复，规模回升)
  // 1987: 98% (列入世界遗产，全面保护，接近完好)
});

// 建筑功能分布数据
const typeData = ref({
  years: ["1406", "1420", "1644", "1733", "1912", "1925", "1987"], // 根据你的故宫 timelineData 调整年份
  types: [
    { name: "礼仪/朝会", data: [30, 35, 10, 30, 25, 25, 25], color: "#d4a76a" }, // 1644年三大殿被毁，比例骤降，后重建恢复
    { name: "居住/生活", data: [35, 30, 35, 30, 35, 35, 35], color: "#8b4513" },
    { name: "园林/休闲", data: [10, 10, 15, 15, 15, 15, 15], color: "#9c7c5c" },
    { name: "办公/行政", data: [15, 15, 20, 15, 15, 15, 15], color: "#5a4a42" },
    { name: "仓储/服务", data: [10, 10, 20, 10, 10, 10, 10], color: "#7a7a7a" }, // 破坏后临时用途增多
  ],
});

// 琉璃瓦使用变迁数据
const tileData = ref({
  years: ["1406", "1420", "1644", "1733", "1912", "1925", "1987"], // 根据你的故宫 timelineData 调整年份
  tiles: [
    { name: "黄琉璃瓦", data: [80, 85, 60, 80, 75, 78, 80], color: "#ffd700" }, // 皇帝专属，占比最高，1644年受损影响
    { name: "绿琉璃瓦", data: [10, 10, 20, 10, 15, 12, 10], color: "#008000" }, // 亲王、郡王等，相对稳定
    { name: "蓝琉璃瓦", data: [5, 5, 10, 5, 5, 5, 5], color: "#4169e1" }, // 祭坛、园林中少量使用
    { name: "其他颜色", data: [5, 0, 10, 5, 5, 5, 5], color: "#a9a9a9" }, // 例如黑、灰瓦片，或混杂情况，1644年后可能比例暂时提升
  ],
});

// 初始化宫殿建筑规模演变图表
const initChart = () => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}年<br/>建筑规模：{c0}%",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.value.years,
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          color: "#5a4a42",
        },
      },
      yAxis: {
        type: "value",
        min: 0, // 从0开始，更直观展示损毁情况
        max: 100,
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          formatter: "{value}%",
          color: "#5a4a42",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)",
          },
        },
      },
      series: [
        {
          name: "建筑规模",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#d4a76a",
          },
          itemStyle: {
            color: "#8b4513",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(212, 167, 106, 0.3)" },
              { offset: 1, color: "rgba(212, 167, 106, 0.05)" },
            ]),
          },
          data: chartData.value.sizes,
        },
      ],
    };

    chartInstance.setOption(option);
  }
};

// 初始化建筑功能分布图表
const initTypeChart = () => {
  if (typeChart.value) {
    typeChartInstance = echarts.init(typeChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: typeData.value.types.map((item) => item.name),
        type: "scroll",
        orient: "horizontal",
        bottom: 10,
        itemGap: 20,
        padding: [5, 50],
        pageIconColor: "#8b4513",
        pageTextStyle: { color: "#5a4a42" },
        textStyle: {
          color: "#5a4a42",
          fontSize: 12,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: typeData.value.years,
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          color: "#5a4a42",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          formatter: "{value}%",
          color: "#5a4a42",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)",
          },
        },
      },
      series: typeData.value.types.map((type, index) => ({
        name: type.name,
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: type.data,
        itemStyle: {
          // 使用数据中定义的颜色，如果未定义则使用默认的
          color:
            type.color ||
            ["#d4a76a", "#8b4513", "#9c7c5c", "#5a4a42", "#7a7a7a"][index],
        },
      })),
    };

    typeChartInstance.setOption(option);
  }
};

// 初始化琉璃瓦使用变迁图表
const initTileChart = () => {
  if (tileChart.value) {
    tileChartInstance = echarts.init(tileChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          let str = `${params[0].name}年<br/>`;
          let total = 0;
          params.forEach((item) => {
            total += item.value;
          });
          params.forEach((item) => {
            str += `${item.marker}${item.seriesName}: ${item.value}%<br/>`;
          });
          str += `总计: ${total}%`;
          return str;
        },
      },
      legend: {
        data: tileData.value.tiles.map((item) => item.name),
        textStyle: {
          color: "#5a4a42",
        },
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: tileData.value.years,
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          color: "#5a4a42",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          formatter: "{value}%",
          color: "#5a4a42",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(139, 69, 19, 0.1)",
          },
        },
      },
      series: tileData.value.tiles.map((type, index) => ({
        name: type.name,
        type: "bar",
        stack: "total", // 堆叠柱状图，展示比例
        emphasis: {
          focus: "series",
        },
        data: type.data,
        itemStyle: {
          color:
            type.color || ["#ffd700", "#008000", "#4169e1", "#a9a9a9"][index], // 使用数据中定义的颜色
        },
      })),
    };

    tileChartInstance.setOption(option);
  }
};

// 监听活动索引变化
watch(activeIndex, (newIndex) => {
  if (chartInstance) {
    chartInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });

    chartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: newIndex,
    });

   /* chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: newIndex,
    });*/
  }

  if (typeChartInstance) {
    typeChartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: newIndex,
    });
  }
});

// 响应窗口大小变化
const handleResize = () => {
  if (chartInstance) chartInstance.resize();
  if (typeChartInstance) typeChartInstance.resize();
  if (tileChartInstance) tileChartInstance.resize(); // 新增
};

onMounted(() => {
  initChart();
  initTypeChart();
  initTileChart(); // 新增调用
  window.addEventListener("resize", handleResize);
});
</script>

<style scoped>
/* 基础容器样式 */
.lifecycle-container {
  font-family: "Noto Serif SC", "SimSun", serif;
  color: #5a4a42;
  background: linear-gradient(to bottom, #f9f5ed, #e8dfd1);
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 头部区域 */
.lifecycle-header {
  text-align: center;
  padding: 60px 20px 30px;
  background: linear-gradient(to right, #c19a6b, #b78a56);
  position: relative;
  box-shadow: 0 4px 12px rgba(101, 67, 33, 0.2);
  margin-bottom: 30px;
}

.lifecycle-header h1 {
  font-size: 2.5em;
  color: #fff8e1;
  margin-bottom: 8px;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.intro-text {
  font-size: 1.1em;
  color: #fff8e1;
  max-width: 700px;
  margin: 0 auto 15px;
  line-height: 1.6;
  opacity: 0.9;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(94, 66, 41, 0.8);
  color: #fff8e1;
  border: 1px solid #5d4037;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: rgba(121, 85, 72, 0.9);
  transform: translateX(-2px);
}

/* 状态概览卡片 */
.status-overview {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.status-card {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 15px 20px;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 1.8em;
}

.status-card h3 {
  font-size: 0.9em;
  color: #fff8e1;
  margin: 0 0 5px;
  font-weight: normal;
}

.status-value {
  font-size: 1.4em;
  color: white;
  margin: 0;
  font-weight: bold;
}

/* 主要内容区域 */
.lifecycle-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* 时间轴导航 */
.timeline-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 0 auto 40px;
  max-width: 1000px;
  overflow-x: auto;
  padding: 10px 0;
}

.timeline-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.timeline-point.active .timeline-year {
  color: #8b4513;
  font-weight: bold;
  transform: scale(1.1);
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d4a76a;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.timeline-point.active .timeline-marker {
  background-color: #8b4513;
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(139, 69, 19, 0.2);
}

.timeline-year {
  font-size: 1rem;
  color: #9c7c5c;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* 内容包装器 */
.content-wrapper {
  display: flex;
  gap: 30px;
}

/* 时间轴区域 */
.timeline-section {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 20px; /* Space for scrollbar */
}

.timeline {
  position: relative;
  display: inline-flex; /* Changed from flex to inline-flex */
  align-items: center;
  padding: 40px 60px; /* Increased horizontal padding */
  height: auto;
  min-height: 120px;
  /* Add these: */
  min-width: 100%; /* Ensure it takes full width */
  white-space: nowrap; /* Prevent items from wrapping */
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #d4a76a, #8b4513);
  border-radius: 2px;
  z-index: 1;
}

/* 时间轴项横向排列 */
.timeline-item {
  position: relative;
  min-width: 180px;
  margin-right: 40px;
  padding-top: 60px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(139, 69, 19, 0.1);
  border-radius: 12px;
  z-index: 2;
  transition: all 0.4s ease;
}

.timeline-item:hover {
  background: rgba(255, 248, 225, 0.8);
  transform: translateY(-5px);
}

.timeline-item.active {
  background: rgba(255, 248, 225, 0.95);
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.15);
  transform: translateY(-10px);
}

.timeline-dot {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #d4a76a;
  border: 3px solid #f5f2e9;
  box-shadow: 0 0 0 4px rgba(212, 167, 106, 0.3);
  transition: all 0.4s ease;
  z-index: 3;
}

.timeline-item.active .timeline-dot {
  background-color: #8b4513;
  width: 22px;
  height: 22px;
  box-shadow: 0 0 0 6px rgba(139, 69, 19, 0.3);
}

.timeline-year {
  font-size: 1.1rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 5px;
}

.timeline-title {
  font-size: 1rem;
  color: #5a4a42;
  line-height: 1.5;
}

/* 历史卡片 */
.history-card {
  flex: 1.2;
  display: flex;
  flex-direction: column;
}

.history-info h2 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #6c4f2c;
}

.history-info h2:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #d4a76a 0%, #8b4513 100%);
}

.history-period {
  font-size: 16px;
  color: #9c805a;
  margin-bottom: 12px;
}

.history-desc {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  text-align: justify;
}

/* 数据指标 */
.history-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.metric {
  background-color: #e8dbc2;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  min-width: 80px;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #5e4123;
}

.metric-label {
  font-size: 14px;
  color: #7e6b4e;
}

.architectural-features h3 {
  margin-bottom: 8px;
  color: #5e4123;
}

.architectural-features ul {
  padding-left: 20px;
  list-style: square;
}

.network-section {
  flex: 1;
  background-color: #f2ebd8;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 12px rgba(100, 80, 40, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.network-section h3 {
  font-size: 20px;
  color: #6a5030;
  margin-bottom: 12px;
}

/* 可视化图表区域 */
.visualization-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.visualization-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f5ed 100%);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(101, 67, 33, 0.1);
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.visualization-card h3 {
  color: #5d4037;
  font-size: 1.2em;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d4b483;
  text-align: center;
}

.chart-container {
  height: 250px;
  background-color: rgba(255, 253, 245, 0.5);
  border: 1px dashed #8d6e63;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8d6e63;
  position: relative;
}

.chart-container:after {
  position: absolute;
  font-size: 1.1em;
}

/* 页脚 */
.lifecycle-footer {
  text-align: center;
  padding: 25px 20px;
  margin-top: 50px;
  color: #5a4a42;
  font-size: 0.9em;
  border-top: 1px solid rgba(139, 69, 19, 0.15);
  background-color: rgba(255, 253, 245, 0.7);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    flex-direction: column;
  }

  .timeline-section {
    margin-bottom: 40px;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .timeline-line {
    display: none;
  }

  .timeline-item {
    padding: 15px;
    margin-bottom: 10px;
  }

  .timeline-dot {
    display: none;
  }
}

@media (max-width: 768px) {
  .lifecycle-header h1 {
    font-size: 2em;
    padding-top: 10px;
  }

  .status-overview {
    flex-direction: column;
    align-items: center;
  }

  .status-card {
    width: 100%;
    max-width: 250px;
  }

  .visualization-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .lifecycle-header {
    padding: 40px 15px 30px;
  }

  .back-button {
    top: 15px;
    left: 15px;
    padding: 10px 15px;
  }

  .history-metrics {
    flex-direction: column;
    gap: 15px;
  }

  .history-info {
    padding: 20px;
  }

  .chart-container {
    height: 200px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #f4f1e1; /* 米黄色底 */
  border-radius: 16px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  font-family: "Serif", "Songti SC", serif;
  color: #3c2f1e;
}

.modal-body {
  display: flex;
  gap: 24px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
