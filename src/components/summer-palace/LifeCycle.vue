<template>
  <div class="lifecycle-container">
    <!-- 页面标题 -->
    <div class="lifecycle-header">
      <h1>颐和园历史沿革与园林精粹</h1>
      <p class="intro-text">从清漪园到世界文化遗产的皇家园林传奇</p>
      <!-- 返回按钮 -->

      <!-- 新增状态概览卡片 -->
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">🌳</span>
          <div>
            <h3>园林面积</h3>
            <p class="status-value">300万㎡</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">270余年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">🏛️</span>
          <div>
            <h3>殿堂楼阁</h3>
            <p class="status-value">100余处</p>
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
                    <h3>园林特色</h3>
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
          <h3>园林完整度</h3>
          <div ref="chart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>园林景观构成</h3>
          <div ref="typeChart" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>文化遗产影响</h3>
          <div ref="impactChart" class="chart-container"></div>
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
import forbiddenCityData from "../../assets/summer-palace.json";

const router = useRouter();

const forbiddenCity = ref(forbiddenCityData);

// 返回门户主页
const goBack = () => router.push("/landmarks/summer-palace");

// 时间轴数据 - 重点强化建筑演变内容
const timelineData = ref([
  {
    year: "1750",
    title: "清漪园肇建",
    event: "大规模扩建",
    period: "清乾隆十五年",
    description:
      "乾隆皇帝为孝敬其母崇庆皇太后，在原址（瓮山、西湖）基础上，大规模拓建、增修，建成了“清漪园”。园林以杭州西湖为蓝本，吸取江南园林的设计精髓，并融入北方皇家园林的宏大气势，形成了山水相依、殿堂楼阁点缀其间的格局。主要建筑包括大报恩延寿寺、排云殿、佛香阁等。",
    image: "https://picsum.photos/600/400?palace=7",
    metrics: [
      { value: "290万平方米", label: "占地面积" },
      { value: "4000余间", label: "殿宇数量" },
      { value: "60米", label: "佛香阁高度" },
    ],
    features: [
      "仿江南水乡意境",
      "以万寿山、昆明湖为核心",
      "佛香阁为标志性建筑",
    ],
    relatedFigures: ["乾隆帝", "崇庆皇太后", "雷金玉", "纪晓岚"],
    relatedEvents: ["清漪园肇建", "江南园林借鉴", "圆明园修建", "清朝盛世"],
  },
  {
    year: "1860",
    title: "英法联军焚毁",
    event: "园林遭受破坏",
    period: "清咸丰十年",
    description:
      "第二次鸦片战争期间，英法联军入侵北京，清漪园与圆明园一同遭到焚毁，园内大量建筑、珍宝化为灰烬。此次浩劫对清漪园造成毁灭性打击，使其大部分建筑仅存残垣断壁，成为中华民族历史上的惨痛记忆。此后，清漪园长期处于荒芜状态。",
    image: "https://picsum.photos/600/400?palace=8",
    metrics: [
      { value: "80%", label: "建筑被毁" },
      { value: "20年", label: "荒废时期" },
      { value: "国耻", label: "历史印记" },
    ],
    features: ["大部分殿堂被烧毁", "仅存少量石构建筑", "湖山骨架尚存"],
    relatedFigures: ["咸丰帝", "恭亲王奕訢", "额尔金伯爵", "巴夏礼"],
    relatedEvents: [
      "第二次鸦片战争",
      "火烧圆明园",
      "《北京条约》签订",
      "清朝国力衰退",
    ],
  },
  {
    year: "1888",
    title: "光绪帝重建",
    event: "更名颐和园",
    period: "清光绪十四年",
    description:
      "慈禧太后挪用海军军费，以“颐养冲和”之意，重建清漪园，并更名为“颐和园”。重建工程历时十年，虽然规模和豪华程度不及清漪园时期，但仍保留了原有的山水格局和园林精髓。修缮后的颐和园成为晚清皇室的重要政治和生活中心，其中仁寿殿、乐寿堂、长廊等得以重建。",
    image: "https://picsum.photos/600/400?palace=9",
    metrics: [
      { value: "10年", label: "重建工期" },
      { value: "2000万两", label: "工程耗资" },
      { value: "慈禧太后", label: "主导重建" },
    ],
    features: [
      "仁寿殿作为慈禧理政之所",
      "长廊彩绘精美绝伦",
      "谐趣园仿无锡寄畅园",
    ],
    relatedFigures: ["慈禧太后", "光绪帝", "李鸿章", "庆亲王奕劻"],
    relatedEvents: ["中法战争", "北洋水师建设", "甲午战争", "戊戌变法"],
  },
  {
    year: "1900",
    title: "八国联军入侵",
    event: "再次遭受破坏",
    period: "清光绪二十六年",
    description:
      "八国联军侵华，颐和园再次遭到破坏，部分建筑被占领或损毁，园内珍宝被掠夺。虽然破坏程度不及1860年那次，但也给颐和园留下了新的创伤。联军驻扎期间，对园内设施造成一定破坏，但主要建筑骨架得以保留，并在其后进行了一定程度的修复。",
    image: "https://picsum.photos/600/400?palace=10",
    metrics: [
      { value: "部分", label: "建筑损毁" },
      { value: "文物", label: "被掠夺" },
      { value: "1903年", label: "开始修复" },
    ],
    features: ["部分景观受损", "西洋士兵驻扎痕迹", "后续小规模修缮"],
    relatedFigures: ["慈禧太后", "光绪帝", "瓦德西", "义和团"],
    relatedEvents: ["八国联军侵华", "庚子赔款", "辛丑条约", "义和团运动"],
  },
  {
    year: "1924",
    title: "对外开放",
    event: "成为公园",
    period: "民国十三年",
    description:
      "清朝灭亡后，颐和园由北洋政府接管，并于1924年正式辟为公园对外开放，向民众展示昔日皇家园林的壮丽。这一转变使得颐和园从皇室私产变为公共文化空间，为后世的保护与研究奠定了基础。公园的开放也吸引了大量游客前来观赏。",
    image: "https://picsum.photos/600/400?palace=11",
    metrics: [
      { value: "公园", label: "性质转变" },
      { value: "大众", label: "开放对象" },
      { value: "首批", label: "皇家园林开放" },
    ],
    features: ["管理模式改变", "文物保护意识提升", "园林景观得到维护"],
    relatedFigures: ["溥仪", "冯玉祥", "段祺瑞", "孙中山"],
    relatedEvents: ["北京政变", "清帝退位", "中华民国建立", "第一次国共合作"],
  },
  {
    year: "1998",
    title: "世界遗产",
    event: "列入名录",
    period: "现代",
    description:
      "颐和园被联合国教科文组织列入《世界遗产名录》，成为世界文化遗产，标志着其历史、艺术和科学价值得到国际社会的普遍认可。此后，颐和园的保护和管理工作进入新的阶段，通过持续的修缮和环境整治，致力于恢复其历史风貌，并利用数字化手段推广其文化价值。",
    image: "https://picsum.photos/600/400?palace=12",
    metrics: [
      { value: "文化遗产", label: "国际地位" },
      { value: "持续", label: "保护修缮" },
      { value: "千万人次", label: "年游客量" },
    ],
    features: ["“三山五园”之一", "融合南北园林艺术", "展现中国园林最高成就"],
    relatedFigures: ["联合国教科文组织官员", "中国文物专家", "园林保护工作者"],
    relatedEvents: [
      "世界遗产大会",
      "中国文物保护法",
      "北京申奥",
      "文化遗产数字化",
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

function setActiveIndex(index) {
  activeIndex.value = index;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// ECharts图表实例
const chart = ref(null);
const typeChart = ref(null);
const impactChart = ref(null); // 新增ref
let chartInstance = null;
let typeChartInstance = null;
let impactChartInstance = null; // 新增实例

// 核心景点分布 (假设为园林完整度/开放面积的百分比变化)
const chartData = ref({
  years: timelineData.value.map((item) => item.year),
  sizes: [95, 20, 70, 60, 80, 98], // 基于历史事件估算的完整度/开放面积百分比
  // 1750: 95% (建成初期，近乎完整)
  // 1860: 20% (英法联军焚毁，严重破坏)
  // 1888: 70% (慈禧重建，有所恢复但不及清漪园时期)
  // 1900: 60% (八国联军再次破坏，略有下降)
  // 1924: 80% (对外开放，逐步修复)
  // 1998: 98% (世界遗产，全面保护和开放)
});

// 建筑类型分布数据
// 园林景观构成 (假设为不同建筑类型的百分比构成)
const typeData = ref({
  years: timelineData.value.map((item) => item.year),
  types: [
    { name: "殿堂类建筑", data: [40, 10, 30, 25, 35, 35], color: "#d4a76a" }, // 颜色建议添加到数据中方便渲染
    { name: "园林景观", data: [30, 60, 40, 45, 35, 35], color: "#8b4513" }, // 山水景观在破坏后占比可能会相对上升，因为建筑毁了
    { name: "寺庙建筑", data: [20, 5, 15, 10, 15, 15], color: "#9c7c5c" },
    { name: "附属/服务设施", data: [10, 25, 15, 20, 15, 15], color: "#5a4a42" },
  ],
  // 各年份数据总和应为100%
  // 1750: 建成初期，各类建筑比例均衡
  // 1860: 殿堂寺庙被毁严重，园林景观和附属设施的“相对”比例会上升（虽然实际总量下降）
  // 1888: 重建后殿堂恢复，比例重新调整
  // 1900: 再次破坏，比例略有浮动
  // 1924: 开放公园，服务设施可能会增加，园林景观维护加强
  // 1998: 世界遗产，各类建筑得到全面维护和开放，比例趋于稳定
});

// 文化遗产影响数据 (假设为关注度/游客量指数，非实际游客量)
const impactData = ref({
  years: timelineData.value.map((item) => item.year),
  scores: [
    70, // 1750: 皇家园林，内部关注度高
    30, // 1860: 被毁，关注度下降
    60, // 1888: 重建，关注度回升
    50, // 1900: 再次受损，关注度略降
    85, // 1924: 对外开放，社会关注度大幅提升
    100, // 1998: 世界遗产，达到最高关注度/影响力
  ],
});

// 初始化规模变化图表
const initChart = () => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}年<br/>规模：{c0}%",
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
        min: 0,
        max: 105,
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

// 初始化建筑类型分布图表
const initTypeChart = () => {
  if (typeChart.value) {
    typeChartInstance = echarts.init(typeChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          // 1. 获取标题，例如 "1888年"
          let tooltipString = `${params[0].name}年<br/>`;

          // 2. 创建一个反转后的数组，用于生成列表
          const reversedParams = [...params].reverse();

          // 3. 遍历反转后的数组，拼接每一行的内容
          for (const param of reversedParams) {
            tooltipString += `${param.marker} ${param.seriesName}: ${param.value}%<br/>`;
          }

          // 4. 返回最终生成的字符串
          return tooltipString;
        }
      },
      legend: {
        data: typeData.value.types.map((item) => item.name).reverse(),
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
        // 注意：这里的颜色数组也需要反转，以确保颜色和数据项能正确对应
        itemStyle: {
          color: ["#d4a76a", "#8b4513", "#9c7c5c", "#5a4a42"][index],
        },
      })),
    };

    typeChartInstance.setOption(option);
  }
};

// 初始化文化遗产影响图表
const initImpactChart = () => {
  if (impactChart.value) {
    impactChartInstance = echarts.init(impactChart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}年<br/>文化影响力指数：{c0}",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: impactData.value.years,
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
        min: 0,
        max: 100, // 指数范围
        axisLine: {
          lineStyle: {
            color: "#8b4513",
          },
        },
        axisLabel: {
          formatter: "{value}",
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
          name: "文化影响力指数",
          type: "bar", // 可以使用柱状图或者折线图
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#a55e37" },
              { offset: 1, color: "#d4a76a" },
            ]),
          },
          data: impactData.value.scores,
        },
      ],
    };

    impactChartInstance.setOption(option);
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

  /*  chartInstance.dispatchAction({
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
  if (impactChartInstance) impactChartInstance.resize();
};

onMounted(() => {
  initChart();
  initTypeChart();
  initImpactChart(); // 新增调用
  window.addEventListener("resize", handleResize);
});
</script>

<style scoped>
/* 基础容器样式 */
.lifecycle-container {
  font-family: "Noto Serif SC", "SimSun", serif;
  color: #5a4a42;
  background: linear-gradient(to bottom, #f9f5ed, #e8dfd1);
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
