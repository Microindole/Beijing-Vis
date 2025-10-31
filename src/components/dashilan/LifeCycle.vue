<template>
  <div class="lifecycle-container">
    <div class="lifecycle-header">
      <h1>大栅栏商业街区发展历程</h1>
      <p class="intro-text">从明清市集到京城繁华地标的数百年变迁</p>
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">🛍️</span>
          <div>
            <h3>知名老字号</h3>
            <p class="status-value">超60家</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">600+年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">🚶</span>
          <div>
            <h3>年均客流</h3>
            <p class="status-value">千万+</p>
          </div>
        </div>
      </div>
    </div>

    <div class="lifecycle-main">
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

        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>

            <div class="modal-body">
              <div class="history-card">
                <div class="history-info">
                  <h2>{{ activeData.title }}</h2>
                  <div class="history-period">{{ activeData.period }}</div>
                  <div class="history-desc">{{ activeData.description }}</div>

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

                  <div
                    class="architectural-features"
                    v-if="activeData.features"
                  >
                    <h3>商业特点与重要事件</h3>
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
      <div class="visualization-section">
        <div class="visualization-card">
          <h3>商业业态演变</h3>
          <div ref="chartRef1" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>知名老字号分布</h3>
          <div ref="chartRef2" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>老字号数量变化趋势</h3>
          <div ref="chartRef3" class="chart-container"></div>
        </div>
      </div>
    </div>

    <footer class="lifecycle-footer">
      <p class="copyright">
        © {{ new Date().getFullYear() }} 北京历史文化遗产数字平台
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import LandmarkNetwork from "../LandmarkNetwork.vue";
import forbiddenCityData from "../../assets/dashilan.json";

const router = useRouter();

const forbiddenCity = ref(forbiddenCityData);

// 返回门户主页


// 时间轴数据 - 重点强化建筑演变内容
const timelineData = ref([
  {
    year: "1420",
    title: "廊房商业街区兴建",
    event: "商业区创建",
    period: "明永乐年间",
    description:
      "北京鼓励商贸，在皇城四门等地兴建廊房商业街区。该地区最早称'廊房四条'，成为京城重要商业中心之一。建筑多为传统北方商铺样式，砖木结构，前店后坊格局。",
    image: "https://picsum.photos/600/400?dashilar=1",
    metrics: [
      { value: "4条", label: "主要廊房" },
      { value: "200+", label: "商户数量" },
      { value: "500米", label: "街道长度" },
    ],
    features: ["传统北方商铺样式", "砖木结构", "前店后坊格局"],
    relatedFigures: ["朱棣", "夏原吉"],
    relatedEvents: ["永乐迁都", "北京城规划"],
  },
  {
    year: "1488",
    title: "大栅栏得名",
    event: "栅栏修建",
    period: "明弘治元年",
    description:
      "为维护京师治安，廊房四条两端设木质栅栏，由商户出资修建，规模格外巨大，逐渐被称为'大栅栏'而沿用至今。栅栏夜间关闭，形成封闭式商业街区，增强了安全性和商业聚集效应。",
    image: "https://picsum.photos/600/400?dashilar=2",
    metrics: [
      { value: "2处", label: "主要栅栏" },
      { value: "5米", label: "栅栏高度" },
      { value: "24小时", label: "守卫制度" },
    ],
    features: ["巨型木质栅栏", "封闭式商业街区", "商户自治管理"],
    relatedFigures: ["明孝宗", "刘健"],
    relatedEvents: ["弘治中兴", "京师治安整顿"],
  },
  {
    year: "1750",
    title: "地图正式标注",
    event: "地名确立",
    period: "清乾隆年间",
    description:
      "《乾隆京城全图》正式标注'大栅栏'地名，显示街区已发展成熟。此时大栅栏已成为北京最繁华的商业中心之一，聚集了大量老字号店铺，建筑风格融合了明清商业建筑特色。",
    image: "https://picsum.photos/600/400?dashilar=3",
    metrics: [
      { value: "30+", label: "老字号" },
      { value: "8条", label: "支巷" },
      { value: "1000+", label: "从业人员" },
    ],
    features: ["明清商业建筑风格", "老字号聚集", "前店后宅格局"],
    relatedFigures: ["乾隆帝", "和珅"],
    relatedEvents: ["康乾盛世", "北京商业发展"],
  },
  {
    year: "1899",
    title: "火灾毁栏",
    event: "火灾重建",
    period: "清光绪二十五年",
    description:
      "大栅栏发生重大火灾，木质栅栏被烧毁。此次火灾促使商户改进防火措施，部分建筑开始采用砖石结构，但整体仍保持传统商业街区风貌。",
    image: "https://picsum.photos/600/400?dashilar=4",
    metrics: [
      { value: "50+", label: "受损店铺" },
      { value: "3天", label: "火灾持续时间" },
      { value: "1年", label: "重建周期" },
    ],
    features: ["砖石结构引入", "防火措施改进", "传统风貌保持"],
    relatedFigures: ["光绪帝", "李鸿章"],
    relatedEvents: ["戊戌变法", "清末新政"],
  },
  {
    year: "1900",
    title: "义和团运动影响",
    event: "战火波及",
    period: "清光绪二十六年",
    description:
      "义和团运动中，街区多家店铺被焚毁。灾后重建时部分商户引入西式建筑元素，形成中西合璧的商业建筑风格，体现清末民初的时代特征。",
    image: "https://picsum.photos/600/400?dashilar=5",
    metrics: [
      { value: "70%", label: "损毁率" },
      { value: "5年", label: "恢复期" },
      { value: "20+", label: "西式店铺" },
    ],
    features: ["中西合璧风格", "彩色瓷砖立面", "拱形门窗设计"],
    relatedFigures: ["慈禧太后", "袁世凯"],
    relatedEvents: ["义和团运动", "八国联军侵华"],
  },
  {
    year: "1902",
    title: "重建与新发展",
    event: "繁华再现",
    period: "清光绪二十八年",
    description:
      "各商户重建复业，大栅栏依旧繁华，随着前门火车站建成迎来新发展。商业建筑更加多样化，出现三层砖木结构商铺，立面装饰更加精美，形成民国初期商业建筑特色。",
    image: "https://picsum.photos/600/400?dashilar=6",
    metrics: [
      { value: "300+", label: "商户数量" },
      { value: "3层", label: "最高建筑" },
      { value: "10万+", label: "日客流" },
    ],
    features: ["三层砖木结构", "精美立面装饰", "民国商业风格"],
    relatedFigures: ["张之洞", "盛宣怀"],
    relatedEvents: ["清末新政", "铁路建设"],
  },
  {
    year: "2000",
    title: "铁艺栅栏重建",
    event: "历史元素恢复",
    period: "现代",
    description:
      "北京市政府在大栅栏街口重新修建铁艺栅栏，恢复了街名由来的历史元素。新栅栏采用现代材料但仿古设计，成为街区标志性入口，同时启动历史风貌保护工程。",
    image: "https://picsum.photos/600/400?dashilar=7",
    metrics: [
      { value: "12米", label: "栅栏宽度" },
      { value: "5米", label: "拱门高度" },
      { value: "200吨", label: "钢材用量" },
    ],
    features: ["现代铁艺栅栏", "仿古设计", "标志性入口"],
    relatedFigures: ["刘淇", "王岐山"],
    relatedEvents: ["北京旧城改造", "历史文化保护"],
  },
  {
    year: "2008",
    title: "街区整体修缮",
    event: "风貌重现",
    period: "现代",
    description:
      "完成街区整体修缮对外开放，恢复民国初期历史风貌。采用传统工艺和材料修复老建筑，同时改善基础设施，实现历史保护与现代功能的平衡。",
    image: "https://picsum.photos/600/400?dashilar=8",
    metrics: [
      { value: "1.2km", label: "修缮长度" },
      { value: "50+", label: "修复建筑" },
      { value: "3年", label: "工期" },
    ],
    features: ["民国风貌恢复", "传统工艺应用", "基础设施现代化"],
    relatedFigures: ["刘淇", "郭金龙"],
    relatedEvents: ["北京奥运会", "城市更新"],
  },
  {
    year: "2017",
    title: "保护性整修",
    event: "精细化修复",
    period: "现代",
    description:
      "大栅栏区域启动保护性整修，如珠粮街区整体修缮，进一步精细还原历史风貌。采用数字化测绘技术记录建筑细节，使用传统材料修复，同时引入文创产业，活化历史街区。",
    image: "https://picsum.photos/600/400?dashilar=9",
    metrics: [
      { value: "20公顷", label: "保护范围" },
      { value: "100+", label: "测绘建筑" },
      { value: "30+", label: "文创店铺" },
    ],
    features: ["数字化测绘技术", "传统材料修复", "文创产业引入"],
    relatedFigures: ["蔡奇", "陈吉宁"],
    relatedEvents: ["北京城市总体规划", "文化创意产业发展"],
  },
  {
    year: "2023",
    title: "建筑风格传承",
    event: "历史风貌维护",
    period: "现代",
    description:
      "大栅栏街区建筑承袭北京传统商街风格，以灰砖灰瓦为主，辅以雕花木窗、红柱绿瓦等明清装饰元素。保护修缮中坚持'恢复原貌'原则，采用与历史相符的木料、青砖和琉璃瓦，同时保留部分中西合璧的建筑特色。",
    image: "https://picsum.photos/600/400?dashilar=10",
    metrics: [
      { value: "80%", label: "传统风貌保持率" },
      { value: "50+", label: "历史建筑" },
      { value: "10+", label: "建筑风格类型" },
    ],
    features: ["灰砖灰瓦主色调", "雕花木窗装饰", "中西合璧特色"],
    relatedFigures: ["尹力", "殷勇"],
    relatedEvents: ["北京中轴线申遗", "老城保护"],
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
const chartRef1 = ref(null); // 商业业态演变
const chartRef2 = ref(null); // 知名老字号数量变化
const chartRef3 = ref(null); // 主要商铺类型分布
let chartInstance1 = null;
let chartInstance2 = null;
let chartInstance3 = null;

// --- ECharts 数据准备 ---

// 1. 商业业态发展数据 (堆叠柱状图)
// 根据 timelineData 提炼和模拟数据
const businessEvolutionData = computed(() => {
  const years = timelineData.value.map((item) => item.year);
  // 模拟数据，需要根据实际的历史资料调整
  const traditionalRetail = [60, 55, 45, 30, 25, 20, 18, 15, 12, 10]; // 传统零售占比
  const cateringEntertainment = [20, 25, 30, 35, 38, 40, 42, 45, 48, 50]; // 餐饮娱乐占比
  const serviceIndustry = [10, 10, 15, 20, 22, 25, 28, 30, 32, 35]; // 服务行业占比
  const culturalExperience = [10, 10, 10, 15, 15, 15, 12, 10, 8, 5]; // 文化体验/其他占比

  return {
    years: years,
    categories: [
      { name: "传统零售", data: traditionalRetail.slice(0, years.length) },
      { name: "餐饮娱乐", data: cateringEntertainment.slice(0, years.length) },
      { name: "服务行业", data: serviceIndustry.slice(0, years.length) },
      {
        name: "文化体验/其他",
        data: culturalExperience.slice(0, years.length),
      },
    ],
  };
});

// 2. 建筑风格演变数据 (折线图 - 可多系列)
const architecturalStyleData = computed(() => {
  const years = timelineData.value.map((item) => item.year);
  // 模拟数据：不同建筑风格的“流行度”或“代表性”权重
  const traditionalNorthern = [80, 75, 60, 50, 40, 35, 30, 25, 20, 18]; // 传统北方风格
  const chineseWestern = [0, 0, 5, 15, 25, 30, 35, 30, 25, 20]; // 中西合璧风格
  const republicEraCommercial = [0, 0, 0, 5, 10, 15, 20, 25, 30, 35]; // 民国商业风格
  const modernPreservation = [0, 0, 0, 0, 0, 0, 15, 20, 25, 27]; // 现代保护/复古风格

  return {
    years: years,
    styles: [
      { name: "传统北方", data: traditionalNorthern.slice(0, years.length) },
      { name: "中西合璧", data: chineseWestern.slice(0, years.length) },
      { name: "民国商业", data: republicEraCommercial.slice(0, years.length) },
      { name: "现代保护", data: modernPreservation.slice(0, years.length) },
    ],
  };
});

// 3. 老字号数量与重要事件 (带事件点的折线图)
const oldBrandAndEventsData = computed(() => {
  const years = timelineData.value.map((item) => item.year);
  const oldBrandCounts = [];
  const eventPoints = []; // 用于标注事件

  timelineData.value.forEach((item, index) => {
    // 从 metrics 中提取老字号数量，如果存在且是数字
    const oldBrandMetric = item.metrics?.find((m) => m.label === "老字号");
    if (oldBrandMetric && oldBrandMetric.value) {
      // 处理 "30+" "200+" 这种格式
      oldBrandCounts.push(
        parseInt(oldBrandMetric.value.replace("+", "")) || null
      );
    } else if (item.metrics?.find((m) => m.label === "商户数量")) {
      // 如果没有明确老字号，可以用商户数量作为近似或基数
      oldBrandCounts.push(
        parseInt(
          item.metrics
            .find((m) => m.label === "商户数量")
            .value.replace("+", "")
        ) * 0.1 || null
      ); // 粗略估算
    } else {
      oldBrandCounts.push(null); // 没有数据则为null
    }

    // 提取重要事件的标注信息
    if (
      item.event &&
      item.event !== "商业区创建" &&
      item.event !== "地名确立" &&
      item.event !== "建筑风格传承"
    ) {
      // 排除一些“非危机”事件
      eventPoints.push({
        xAxis: item.year,
        yAxis: oldBrandCounts[index], // 标注在对应数量点
        name: item.event,
        value: item.year,
        symbolSize: 15,
        itemStyle: { color: "#dc3545" }, // 红色标记事件
        label: {
          formatter: "{b}",
          position: "top",
          color: "#dc3545",
          fontSize: 10,
          offset: [0, -10],
          show: true,
        },
      });
    }
  });

  // 填补空值，确保折线图连续
  for (let i = 0; i < oldBrandCounts.length; i++) {
    if (oldBrandCounts[i] === null) {
      // 简单的前一个非null值填充，更复杂的可以进行插值
      if (i > 0 && oldBrandCounts[i - 1] !== null) {
        oldBrandCounts[i] = oldBrandCounts[i - 1];
      } else if (
        i < oldBrandCounts.length - 1 &&
        oldBrandCounts[i + 1] !== null
      ) {
        oldBrandCounts[i] = oldBrandCounts[i + 1];
      } else {
        oldBrandCounts[i] = 0; // 实在没数据就设为0
      }
    }
  }

  return {
    years: years,
    counts: oldBrandCounts,
    events: eventPoints,
  };
});

// --- ECharts 初始化函数 ---

// 1. 初始化商业业态发展图表 (堆叠柱状图)
const initBusinessEvolutionChart = () => {
  if (chartRef1.value) {
    chartInstance1 = echarts.init(chartRef1.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          let str = `${params[0].name}年<br/>`;
          params.forEach((item) => {
            str += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
          });
          return str;
        },
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#bcaaa4",
        borderWidth: 1,
        textStyle: { color: "#333" },
      },
      legend: {
        data: businessEvolutionData.value.categories.map((item) => item.name),
        textStyle: { color: "#6d4c41" },
        bottom: "0%",
        itemGap: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: businessEvolutionData.value.years,
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41", rotate: 30, interval: 0 }, // 旋转标签，避免重叠
      },
      yAxis: {
        type: "value",
        name: "占比 (%)",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { formatter: "{value}%", color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
        max: 100,
      },
      series: businessEvolutionData.value.categories.map((category, index) => ({
        name: category.name,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: category.data,
        barWidth: "40%", // 调整柱子宽度
        itemStyle: {
          borderRadius: [5, 5, 0, 0], // 柱子顶部圆角
          color: [
            "#e6b8a2", // 传统零售 - 浅暖棕
            "#c07b6b", // 餐饮娱乐 - 砖红
            "#8d6e63", // 服务行业 - 中棕
            "#6d4c41", // 文化体验/其他 - 深棕
          ][index],
        },
      })),
    };
    chartInstance1.setOption(option);
  }
};

// 2. 初始化建筑风格演变图表 (折线图)
const initArchitecturalStyleChart = () => {
  if (chartRef2.value) {
    chartInstance2 = echarts.init(chartRef2.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter:
          "{b0}年<br/>{a0}: {c0}%<br/>{a1}: {c1}%<br/>{a2}: {c2}%<br/>{a3}: {c3}%",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#bcaaa4",
        borderWidth: 1,
        textStyle: { color: "#333" },
      },
      legend: {
        data: architecturalStyleData.value.styles.map((item) => item.name),
        textStyle: { color: "#6d4c41" },
        bottom: "0%",
        itemGap: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: architecturalStyleData.value.years,
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41", rotate: 30, interval: 0 },
      },
      yAxis: {
        type: "value",
        name: "代表性/占比 (%)",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { formatter: "{value}%", color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
        min: 0,
        max: 100,
      },
      series: architecturalStyleData.value.styles.map((style, index) => ({
        name: style.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: [
            "#4CAF50", // 传统北方 - 绿色
            "#2196F3", // 中西合璧 - 蓝色
            "#FF9800", // 民国商业 - 橙色
            "#9C27B0", // 现代保护 - 紫色
          ][index],
        },
        itemStyle: {
          color: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"][index],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: [
                "rgba(76, 175, 80, 0.2)",
                "rgba(33, 150, 243, 0.2)",
                "rgba(255, 152, 0, 0.2)",
                "rgba(156, 39, 176, 0.2)",
              ][index],
            },
            { offset: 1, color: "rgba(255, 255, 255, 0)" },
          ]),
        },
        data: style.data,
      })),
    };
    chartInstance2.setOption(option);
  }
};

// 3. 初始化老字号数量与重要事件图表 (带事件点的折线图)
const initOldBrandAndEventsChart = () => {
  if (chartRef3.value) {
    chartInstance3 = echarts.init(chartRef3.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let str = `${params[0].name}年<br/>`;
          params.forEach((item) => {
            if (item.seriesType === "line") {
              str += `${item.marker} ${item.seriesName}: ${item.value}家<br/>`;
            } else if (item.seriesType === "scatter") {
              str += `${item.marker} ${item.name}<br/>`; // 事件名称
            }
          });
          return str;
        },
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#bcaaa4",
        borderWidth: 1,
        textStyle: { color: "#333" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: oldBrandAndEventsData.value.years,
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41", rotate: 30, interval: 0 },
      },
      yAxis: {
        type: "value",
        name: "老字号数量 (家)",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
      },
      series: [
        {
          name: "老字号数量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#c07b6b", // 砖红色
          },
          itemStyle: {
            color: "#e6b8a2",
            borderColor: "#c07b6b",
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(192, 123, 107, 0.3)" },
              { offset: 1, color: "rgba(192, 123, 107, 0.05)" },
            ]),
          },
          data: oldBrandAndEventsData.value.counts,
          markPoint: {
            data: oldBrandAndEventsData.value.events,
            label: {
              show: true,
              position: "top",
              color: "#dc3545",
              fontSize: 10,
              formatter: "{b}",
            },
            symbol: "pin",
            symbolSize: 40,
          },
        },
      ],
    };
    chartInstance3.setOption(option);
  }
};

// 监听活动索引变化
// 可以添加 watch 来重新渲染图表。
watch(
  timelineData,
  () => {
    // 更新图表数据
    businessEvolutionData.value.years = timelineData.value.map(
      (item) => item.year
    );
    brandCountData.value.years = timelineData.value.map((item) => item.year);

    // 重新设置图表选项
    chartInstance1?.setOption({
      xAxis: { data: businessEvolutionData.value.years },
      series: businessEvolutionData.value.categories.map((c) => ({
        name: c.name,
        data: c.data,
      })),
    });
    chartInstance2?.setOption({
      xAxis: { data: brandCountData.value.years },
      series: [{ data: brandCountData.value.counts }],
    });
    // 饼图通常不需要根据timelineData变化而变化，除非你的设计是这样
  },
  { deep: true }
);

watch(
  timelineData,
  () => {
    // 强制重新初始化图表实例，确保数据和选项完全更新
    // 销毁旧实例并创建新实例是一种更彻底的更新方式
    chartInstance1?.dispose();
    chartInstance2?.dispose();
    chartInstance3?.dispose();

    initBusinessEvolutionChart();
    initArchitecturalStyleChart();
    initOldBrandAndEventsChart();
  },
  { deep: true }
);

// 响应窗口大小变化
const handleResize = () => {
  if (chartInstance) chartInstance.resize();
  if (typeChartInstance) typeChartInstance.resize();
};

// --- 生命周期钩子和响应式监听 ---
onMounted(() => {
  initBusinessEvolutionChart();
  initArchitecturalStyleChart();
  initOldBrandAndEventsChart();
  window.addEventListener("resize", () => {
    chartInstance1?.resize();
    chartInstance2?.resize();
    chartInstance3?.resize();
  });
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
