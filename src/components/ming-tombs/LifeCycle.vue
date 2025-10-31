<template>
  <div class="lifecycle-container">
    <div class="lifecycle-header">
      <h1>明十三陵建筑群演变与保护历程</h1>
      <p class="intro-text">从长陵营建到世界文化遗产的六百年兴衰</p>
      <div class="status-overview">
        <div class="status-card">
          <span class="status-icon">👑</span>
          <div>
            <h3>帝陵数量</h3>
            <p class="status-value">13座</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">⏳</span>
          <div>
            <h3>历史跨度</h3>
            <p class="status-value">230+年</p>
          </div>
        </div>
        <div class="status-card">
          <span class="status-icon">🌳</span>
          <div>
            <h3>核心区面积</h3>
            <p class="status-value">80+平方公里</p>
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
                    <h3>陵墓建筑特点与营建事件</h3>
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
                  :landmark="mingThirteenTombs"
                  :event="selectedEvent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="visualization-section">
        <div class="visualization-card">
          <h3>各陵墓营建年代</h3>
          <div ref="chartRef1" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>陵墓建筑形制演变</h3>
          <div ref="chartRef2" class="chart-container"></div>
        </div>
        <div class="visualization-card">
          <h3>主要保护修缮事件</h3>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue"; // 确保导入必要的 Vue 组合式 API
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import LandmarkNetwork from "../LandmarkNetwork.vue";
import mingThirteenTombsData from "../../assets/ming-tombs.json";

const router = useRouter();

const mingThirteenTombs = ref(mingThirteenTombsData);



// 时间轴数据 - 重点强化建筑演变内容
const timelineData = ref([
  {
    year: "1409",
    title: "长陵始建",
    event: "陵寝营建开始",
    period: "明永乐七年",
    description:
      "明成祖朱棣选定北京昌平天寿山南麓作为皇家陵区，开始营建自己的长陵。长陵作为十三陵的首陵，奠定了明代帝陵的基本规制：前有神道、石像生，中有棱恩殿，后有方城明楼和宝城。建筑采用最高规格的黄琉璃瓦顶和楠木梁柱结构。",
    image: "https://picsum.photos/600/400?mingtomb=1",
    metrics: [
      { value: "7年", label: "营建工期" },
      { value: "120亩", label: "陵园面积" },
      { value: "32座", label: "主要建筑" },
    ],
    features: ["黄琉璃瓦顶", "楠木梁柱结构", "前朝后寝格局"],
    relatedFigures: ["朱棣", "蒯祥", "蔡信"],
    relatedEvents: ["永乐迁都", "北京城规划", "郑和下西洋"],
  },
  {
    year: "1424",
    title: "长陵竣工",
    event: "长陵竣工",
    period: "明永乐二十二年",
    description:
      "长陵正式竣工，朱棣成为首位入葬十三陵的明朝皇帝。陵区形成完整规制：神道长1.2公里，两侧排列石像生18对；棱恩殿面阔9间，进深5间，象征'九五之尊'；宝城直径达300米，为十三陵中规模最大。",
    image: "https://picsum.photos/600/400?mingtomb=2",
    metrics: [
      { value: "1.2公里", label: "神道长度" },
      { value: "18对", label: "石像生数量" },
      { value: "300米", label: "宝城直径" },
    ],
    features: ["九五之尊规制", "石像生雕刻", "三进院落布局"],
    relatedFigures: ["朱棣", "夏原吉", "杨荣"],
    relatedEvents: ["永乐盛世", "三大殿建设", "明长城修建"],
  },
  {
    year: "1540",
    title: "石牌坊建立",
    event: "石牌坊建立",
    period: "明嘉靖十九年",
    description:
      "在十三陵神道最南端建立石牌坊，为陵区标志性入口建筑。牌坊为五门六柱十一楼结构，宽28.86米，高14米，全部用汉白玉石雕琢而成，是中国现存最大、最早的石牌坊。",
    image: "https://picsum.photos/600/400?mingtomb=3",
    metrics: [
      { value: "28.86米", label: "宽度" },
      { value: "14米", label: "高度" },
      { value: "11座", label: "楼阁数量" },
    ],
    features: ["汉白玉石材", "五门六柱结构", "浮雕云龙纹饰"],
    relatedFigures: ["嘉靖帝", "严嵩", "夏言"],
    relatedEvents: ["嘉靖革新", "壬寅宫变", "倭寇之乱"],
  },
  {
    year: "1644",
    title: "营建终止",
    event: "营建终止",
    period: "明崇祯十七年",
    description:
      "随着明朝灭亡，十三陵的营建终止于崇祯帝入葬思陵。此时陵区总面积已达120平方公里，共葬有13位皇帝、23位皇后，形成中国现存规模最大、保存最完整的皇家陵寝建筑群。",
    image: "https://picsum.photos/600/400?mingtomb=4",
    metrics: [
      { value: "13座", label: "帝陵数量" },
      { value: "120km²", label: "总面积" },
      { value: "235年", label: "营建历时" },
    ],
    features: ["依山而建布局", "统一规划风格", "完整陵寝体系"],
    relatedFigures: ["崇祯帝", "李自成", "吴三桂"],
    relatedEvents: ["明朝灭亡", "清军入关", "大顺政权"],
  },
  {
    year: "1650",
    title: "清代保护",
    event: "清代保护",
    period: "清顺治七年",
    description:
      "清廷为笼络汉人，对明十三陵予以保护并多次修缮。设立专门护陵机构，划拨守陵户，定期祭祀。康熙、乾隆时期曾进行大规模修缮，基本保持了明代陵寝的原貌和格局。",
    image: "https://picsum.photos/600/400?mingtomb=5",
    metrics: [
      { value: "12次", label: "大型修缮" },
      { value: "500人", label: "守陵人员" },
      { value: "100两", label: "年维护银两" },
    ],
    features: ["保持明代原貌", "增设护陵机构", "定期祭祀制度"],
    relatedFigures: ["顺治帝", "多尔衮", "范文程"],
    relatedEvents: ["剃发易服", "清初政策", "满汉关系"],
  },
  {
    year: "1956",
    title: "定陵发掘",
    event: "定陵发掘",
    period: "现代",
    description:
      "在吴晗、郭沫若等倡议下，开始对定陵（万历皇帝陵）进行考古发掘。这是中国首次对帝王陵寝进行科学发掘，出土金冠、凤冠等珍贵文物3000余件，但部分文物因保护技术不足而损毁。",
    image: "https://picsum.photos/600/400?mingtomb=6",
    metrics: [
      { value: "3000+", label: "出土文物" },
      { value: "2年", label: "发掘时间" },
      { value: "1959年", label: "博物馆开放" },
    ],
    features: ["地下宫殿发掘", "丝织品保护难题", "考古技术探索"],
    relatedFigures: ["郭沫若", "吴晗", "夏鼐"],
    relatedEvents: ["新中国考古", "文物保护", "博物馆建设"],
  },
  {
    year: "1961",
    title: "国保单位",
    event: "国保单位",
    period: "现代",
    description:
      "国务院将明十三陵列为第一批全国重点文物保护单位。开始系统性的文物建档和保护规划，对陵区建筑进行测绘记录，为后续保护工作奠定基础。",
    image: "https://picsum.photos/600/400?mingtomb=7",
    metrics: [
      { value: "第一批", label: "国保批次" },
      { value: "80处", label: "保护建筑" },
      { value: "50卷", label: "测绘图纸" },
    ],
    features: ["系统性建档", "科学测绘记录", "保护规划制定"],
    relatedFigures: ["周恩来", "郑振铎", "梁思成"],
    relatedEvents: ["文物普查", "古建保护", "文化遗产政策"],
  },
  {
    year: "1982",
    title: "风景名胜区",
    event: "国家级风景名胜区",
    period: "现代",
    description:
      '国务院批准设立"八达岭-十三陵风景名胜区"，将十三陵纳入国家级风景名胜保护体系。开始整治周边环境，控制建设活动，保护陵区历史风貌和生态环境。',
    image: "https://picsum.photos/600/400?mingtomb=8",
    metrics: [
      { value: "300km²", label: "保护区" },
      { value: "10km", label: "缓冲带" },
      { value: "1985年", label: "规划完成" },
    ],
    features: ["整体景观保护", "环境整治", "建设控制"],
    relatedFigures: ["万里", "任质斌", "单士元"],
    relatedEvents: ["风景名胜区制度", "环境保护法", "旅游开发规划"],
  },
  {
    year: "2003",
    title: "世界遗产",
    event: "世界遗产",
    period: "现代",
    description:
      '明十三陵作为"明清皇家陵寝"扩展项目被联合国教科文组织列入《世界遗产名录》。国际认可其建筑艺术成就和文化价值，推动保护标准提升，采用数字化监测等现代技术手段。',
    image: "https://picsum.photos/600/400?mingtomb=9",
    metrics: [
      { value: "120km²", label: "遗产区" },
      { value: "13项", label: "核心遗产" },
      { value: "20+", label: "监测系统" },
    ],
    features: ["国际保护标准", "数字化监测", "完整性保护"],
    relatedFigures: ["单霁翔", "吕舟", "罗哲文"],
    relatedEvents: ["申遗工程", "国际协作", "数字化保护"],
  },
  {
    year: "2020",
    title: "现代保护",
    event: "现代保护",
    period: "现代",
    description:
      "实施《明十三陵保护规划》，采用传统工艺与现代技术结合的方式全面修缮陵寝建筑。使用三维扫描记录建筑细节，传统材料修复彩绘，钢结构加固木构架，实现文化遗产的科学保护与传承。",
    image: "https://picsum.photos/600/400?mingtomb=10",
    metrics: [
      { value: "15年", label: "规划周期" },
      { value: "3D扫描", label: "记录技术" },
      { value: "30处", label: "修缮建筑" },
    ],
    features: ["传统工艺复兴", "现代技术应用", "科学保护体系"],
    relatedFigures: ["王旭东", "柴晓明", "吕舟"],
    relatedEvents: ["科技考古", "非遗传承", "预防性保护"],
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

// --- ECharts 数据准备 ---
// ECharts 图表实例引用
const chartRef1 = ref(null); // 各陵墓营建年代 (条形图)
const chartRef2 = ref(null); // 陵墓建筑形制变化 (多系列折线图)
const chartRef3 = ref(null); // 主要保护修缮事件 (带事件点的折线图)

let chartInstance1 = null;
let chartInstance2 = null;
let chartInstance3 = null;

// 1. 各陵墓营建年代数据 (条形图)
// 这里需要手动提取或模拟各陵墓的营建时间
const tombConstructionData = computed(() => {
  const constructionYears = [
    { name: "长陵", start: 1409, end: 1424, emperor: "朱棣" },
    { name: "献陵", start: 1425, end: 1425, emperor: "朱高炽" },
    { name: "景陵", start: 1435, end: 1435, emperor: "朱瞻基" },
    { name: "裕陵", start: 1464, end: 1464, emperor: "朱祁镇" },
    { name: "茂陵", start: 1487, end: 1487, emperor: "朱见深" },
    { name: "泰陵", start: 1505, end: 1505, emperor: "朱祐樘" },
    { name: "康陵", start: 1521, end: 1521, emperor: "朱厚照" },
    { name: "永陵", start: 1537, end: 1545, emperor: "朱厚熜" },
    { name: "昭陵", start: 1572, end: 1572, emperor: "朱载垕" },
    { name: "定陵", start: 1584, end: 1590, emperor: "朱翊钧" },
    { name: "庆陵", start: 1620, end: 1620, emperor: "朱常洛" },
    { name: "德陵", start: 1622, end: 1622, emperor: "朱由校" },
    { name: "思陵", start: 1644, end: 1644, emperor: "朱由检" },
  ];

  // 计算工期，并准备Y轴数据和系列数据
  const tombNames = []; // Y轴的类别名称
  const workDurations = []; // 各陵墓的工期 (年)

  constructionYears.forEach((tomb) => {
    const duration = tomb.end - tomb.start + 1; // 工期至少为1年
    tombNames.push(`${tomb.name} (${tomb.emperor}陵)`); // 格式化名称，包含皇帝
    workDurations.push({
      value: duration,
      name: tomb.name, // 原始陵墓名
      emperor: tomb.emperor, // 皇帝名
      start: tomb.start, // 起始年份
      end: tomb.end, // 结束年份
    });
  });

  return {
    tombNames: tombNames,
    workDurations: workDurations,
  };
});

// 2. 陵墓建筑形制演变数据 (多系列折线图)
const architecturalEvolutionData = computed(() => {
  const years = timelineData.value.map((item) => item.year);
  // 模拟不同形制在不同时期的“代表性”或“出现频率”
  const standardImperial = [90, 85, 80, 75, 70, 65, 60, 55, 50, 45]; // 标准帝陵规制 (长陵规制)
  const simplified = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]; // 简化规制 (后期帝陵)
  const undergroundPalaceFocus = [0, 0, 0, 0, 0, 70, 75, 80, 85, 90]; // 地下宫殿重要性提升 (定陵发掘后)

  return {
    years: years,
    styles: [
      { name: "标准帝陵规制", data: standardImperial.slice(0, years.length) },
      { name: "规制简化趋势", data: simplified.slice(0, years.length) },
      {
        name: "地下玄宫重点",
        data: undergroundPalaceFocus.slice(0, years.length),
      },
    ],
  };
});

// 3. 主要保护修缮事件数据 (带事件点的折线图)
const protectionEventsData = computed(() => {
  const years = timelineData.value.map((item) => item.year);
  const maintenanceCounts = [];
  const eventPoints = [];

  // 模拟修缮次数或保护力度
  const simulatedCounts = [
    1,
    1,
    1,
    0, // 明初到营建终止
    5, // 清代保护
    10,
    15,
    20,
    25,
    30, // 现代保护
  ];

  timelineData.value.forEach((item, index) => {
    // 使用模拟的修缮次数，或从metrics中提取“修缮”相关数据
    const repairMetric = item.metrics?.find((m) => m.label === "大型修缮");
    maintenanceCounts.push(
      repairMetric ? parseInt(repairMetric.value) : simulatedCounts[index] || 0
    );

    // 提取重要保护/修缮事件的标注信息
    if (
      item.event &&
      (item.event.includes("保护") ||
        item.event.includes("修缮") ||
        item.event.includes("发掘") ||
        item.event.includes("单位") ||
        item.event.includes("遗产"))
    ) {
      eventPoints.push({
        xAxis: item.year,
        yAxis: maintenanceCounts[index],
        name: item.title, // 使用title作为事件名称更具描述性
        value: item.year,
        symbolSize: 15,
        itemStyle: { color: "#4CAF50" }, // 绿色标记保护事件
        label: {
          formatter: "{b}", // 显示事件标题
          position: "top",
          color: "#333",
          fontSize: 10,
          offset: [0, -10],
          show: true,
        },
      });
    }
  });

  return {
    years: years,
    counts: maintenanceCounts,
    events: eventPoints,
  };
});

// --- ECharts 初始化函数 ---

// 1. 初始化各陵墓营建年代图表 (条形图 / 甘特图变种)
const initTombConstructionChart = () => {
  if (chartRef1.value) {
    chartInstance1 = echarts.init(chartRef1.value);

    // 为了让图表显示顺序一致，这里直接使用 computed 后的数据
    // 如果想让长陵在最上面，可以对yAxis.data和series.data进行reverse()操作
    const yAxisData = [...tombConstructionData.value.tombNames].reverse();
    const seriesData = [...tombConstructionData.value.workDurations].reverse();

    const option = {
      title: {
        text: "明十三陵帝陵营建工期",
        left: "center",
        textStyle: {
          color: "#6d4c41",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          const data = params[0].data; // 获取当前柱子数据
          return `${data.name} (${data.emperor}陵)<br/>
                            营建时期：${data.start}年 - ${data.end}年<br/>
                               工期：${data.value}年`;
        },
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#bcaaa4",
        borderWidth: 1,
        textStyle: { color: "#333" },
      },
      grid: {
        left: "3%",
        right: "4%",
        top: "15%", // 留出标题空间
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "工期 (年)",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
      },
      yAxis: {
        type: "category",
        data: yAxisData, // 陵墓名称
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: {
          color: "#6d4c41",
          // 解决标签过长问题，如果需要可以自行调整
          formatter: function (value) {
            return value.length > 10 ? value.substring(0, 10) + "..." : value;
          },
        },
      },
      series: [
        {
          name: "营建工期",
          type: "bar",
          barWidth: "70%", // 柱子宽度
          data: seriesData.map((item) => ({
            value: item.value,
            // 额外数据用于tooltip，ECharts会自动合并
            name: item.name,
            emperor: item.emperor,
            start: item.start,
            end: item.end,
            itemStyle: {
              // 根据工期长短设置不同的颜色
              color:
                item.value > 5
                  ? "#B26F4A"
                  : item.value > 1
                  ? "#D4A76A"
                  : "#9C7C5C",
              borderRadius: [0, 5, 5, 0], // 右侧圆角
            },
          })),
          label: {
            show: true,
            position: "right", // 在柱子右侧显示数值
            formatter: "{c}年",
            color: "#6d4c41",
            fontSize: 10,
          },
        },
      ],
    };

    chartInstance1.setOption(option);
  }
};

// 2. 初始化陵墓建筑形制变化图表 (多系列折线图)
const initArchitecturalEvolutionChart = () => {
  if (chartRef2.value) {
    chartInstance2 = echarts.init(chartRef2.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let str = `${params[0].name}<br/>`;
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
        data: architecturalEvolutionData.value.styles.map((item) => item.name),
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
        data: architecturalEvolutionData.value.years,
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41", rotate: 30, interval: 0 },
      },
      yAxis: {
        type: "value",
        name: "代表性/关注度 (%)",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { formatter: "{value}%", color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
        min: 0,
        max: 100,
      },
      series: architecturalEvolutionData.value.styles.map((style, index) => ({
        name: style.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: [
            "#D4A76A", // 标准帝陵 - 庄重金棕
            "#8B4513", // 规制简化 - 深棕
            "#5A4A42", // 地下玄宫 - 灰棕
          ][index],
        },
        itemStyle: {
          color: ["#D4A76A", "#8B4513", "#5A4A42"][index],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: [
                "rgba(212, 167, 106, 0.2)",
                "rgba(139, 69, 19, 0.2)",
                "rgba(90, 74, 66, 0.2)",
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

// 3. 初始化主要保护修缮事件图表 (带事件点的折线图)
const initProtectionEventsChart = () => {
  if (chartRef3.value) {
    chartInstance3 = echarts.init(chartRef3.value);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let str = `${params[0].name}<br/>`;
          params.forEach((item) => {
            if (item.seriesType === "line") {
              str += `${item.marker} ${item.seriesName}: ${item.value}次<br/>`;
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
        data: protectionEventsData.value.years,
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41", rotate: 30, interval: 0 },
      },
      yAxis: {
        type: "value",
        name: "修缮/保护事件次数",
        axisLine: { lineStyle: { color: "#a1887f" } },
        axisLabel: { color: "#6d4c41" },
        splitLine: {
          lineStyle: { color: "rgba(161, 136, 127, 0.1)", type: "dashed" },
        },
      },
      series: [
        {
          name: "修缮/保护事件",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 4,
            color: "#6A995C", // 绿色，代表保护与生机
          },
          itemStyle: {
            color: "#9CCC65",
            borderColor: "#6A995C",
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(106, 153, 92, 0.3)" },
              { offset: 1, color: "rgba(106, 153, 92, 0.05)" },
            ]),
          },
          data: protectionEventsData.value.counts,
          markPoint: {
            data: protectionEventsData.value.events,
            label: {
              show: true,
              position: "top",
              color: "#333", // 文本颜色
              fontSize: 10,
              formatter: "{b}",
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: [2, 5],
              borderRadius: 3,
            },
            symbol: "pin",
            symbolSize: 40,
            itemStyle: {
              // 标记点样式
              color: "#4CAF50", // 绿色
            },
          },
        },
      ],
    };
    chartInstance3.setOption(option);
  }
};

// --- 生命周期钩子和响应式监听 ---

onMounted(() => {
  initTombConstructionChart();
  initArchitecturalEvolutionChart();
  initProtectionEventsChart();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  chartInstance1?.dispose();
  chartInstance2?.dispose();
  chartInstance3?.dispose();
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  chartInstance1?.resize();
  chartInstance2?.resize();
  chartInstance3?.resize();
};

// 监听 activeIndex 变化，高亮图表
// 注意：对于甘特图和多系列折线图，简单的 highlight/downplay 可能不适用
// 需要根据图表类型调整高亮逻辑
watch(activeIndex, (newIndex) => {
  // 对于第一个图 (各陵墓营建年代)，可能需要根据年份范围或特定陵墓高亮
  // 这里简单地不做高亮，因为它是多个陵墓的营建时间线，高亮单个点意义不大
  // 或者可以考虑高亮与当前时间线年份接近的陵墓
  // if (chartInstance1) { ... }

  // 对于第二个图 (陵墓建筑形制变化)，高亮对应年份的系列点
  if (chartInstance2) {
    // 先取消所有高亮
    chartInstance2.dispatchAction({
      type: "downplay",
      seriesIndex: architecturalEvolutionData.value.styles.map((_, i) => i),
      dataIndex: "all",
    });
    // 高亮当前年份的所有系列点
    chartInstance2.dispatchAction({
      type: "highlight",
      seriesIndex: architecturalEvolutionData.value.styles.map((_, i) => i), // 所有系列
      dataIndex: newIndex, // 当前年份的索引
    });
    // 显示当前年份的tooltip
   /* chartInstance2.dispatchAction({
      type: "showTip",
      seriesIndex: 0, // 随便一个系列即可，目的是触发tooltip
      dataIndex: newIndex,
    });*/
  }

  // 对于第三个图 (主要保护修缮事件)，高亮对应年份的点
  if (chartInstance3) {
    chartInstance3.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: "all",
    });
    chartInstance3.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: newIndex,
    });
   /* chartInstance3.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: newIndex,
    });*/
  }
});

// 如果 timelineData 是响应式的，且它的变化会影响图表数据，
// 可以添加 watch 来重新渲染图表。
// 注意：这里用 computed 属性已经实现了数据响应式，但如果 timelineData 本身可能被完全替换，
// 可以在这里添加更彻底的重初始化
watch(
  timelineData,
  () => {
    // 强制重新初始化图表实例，确保数据和选项完全更新
    chartInstance1?.dispose();
    chartInstance2?.dispose();
    chartInstance3?.dispose();

    initTombConstructionChart();
    initArchitecturalEvolutionChart();
    initProtectionEventsChart();
  },
  { deep: true }
); // 深度监听 timelineData 的内容变化
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
