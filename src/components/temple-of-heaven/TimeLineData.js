export const timelineData = [
  {
    year: 1420,
    period: "明永乐十八年",
    title: "天坛初建",
    description: "明成祖朱棣下令建造天地坛，含大祀殿、皇乾殿等核心建筑，开启南北郊天地合祀制度。",
    scale: 85,
    buildingTypes: {
      ritual: 75,
      auxiliary: 15,
      service: 0,
      landscape: 10
    },
    metrics: [
      { label: "占地面积", value: "273公顷" },
      { label: "主建筑高度", value: "32米" },
      { label: "工程耗材", value: "金丝楠木1200方" }
    ],
    features: [
      "大祀殿三重檐攒尖顶",
      "天圆地方布局理念",
      "蓝色琉璃瓦象征苍穹",
      "皇家专属祭祀场所"
    ]
  },
  {
    year: 1530,
    period: "明嘉靖九年",
    title: "礼制改革",
    description: "明世宗朱厚熜推行'大礼议'，实行天地分祀，兴建圜丘坛并改称天坛。",
    scale: 90,
    buildingTypes: {
      ritual: 70,
      auxiliary: 18,
      service: 2,
      landscape: 10
    },
    metrics: [
      { label: "新增建筑面积", value: "6800㎡" },
      { label: "圜丘坛直径", value: "45米" },
      { label: "工期", value: "2年" }
    ],
    features: [
      "三重汉白玉圜丘坛",
      "棂星门规制强化",
      "燔柴炉祭天设施",
      "燎炉焚烧祭品系统"
    ]
  },
  {
    year: 1545,
    period: "明嘉靖二十四年",
    title: "祈年殿奠基",
    description: "拆除旧大祀殿，新建三重檐圆形大享殿（后改祈年殿），确立'天圆地方'建筑哲学。",
    scale: 95,
    buildingTypes: {
      ritual: 78,
      auxiliary: 12,
      service: 5,
      landscape: 5
    },
    metrics: [
      { label: "殿身高度", value: "38米" },
      { label: "楠木柱数量", value: "28根" },
      { label: "琉璃瓦用量", value: "12万件" }
    ],
    features: [
      "三层青黄绿琉璃瓦顶",
      "28柱象征二十八宿",
      "12根檐柱代表十二月",
      "龙凤和玺彩绘"
    ]
  },
  {
    year: 1751,
    period: "清乾隆十六年",
    title: "鼎盛重修",
    description: "乾隆帝全面修缮并统一瓦色，正式定名祈年殿，完善圜丘坛望灯等礼制设施。",
    scale: 98,
    buildingTypes: {
      ritual: 70,
      auxiliary: 15,
      service: 8,
      landscape: 7
    },
    metrics: [
      { label: "修缮耗银", value: "48万两" },
      { label: "琉璃瓦更换", value: "全殿蓝色" },
      { label: "古柏增植", value: "1200株" }
    ],
    features: [
      "三重蓝琉璃瓦顶",
      "九丈九尺圜丘坛",
      "神乐署礼乐传承",
      "斋宫功能完善"
    ]
  },
  {
    year: 1918,
    period: "民国七年",
    title: "公众开放",
    description: "结束五百年皇家禁地历史，成立公园管理处，首日接待市民逾万人次。",
    scale: 100,
    buildingTypes: {
      ritual: 50,
      auxiliary: 20,
      service: 20,
      landscape: 10
    },
    metrics: [
      { label: "年接待量", value: "62万人次" },
      { label: "新增设施", value: "16处" },
      { label: "开放面积", value: "100%" }
    ],
    features: [
      "祈年殿公众游览",
      "神乐署改音乐厅",
      "古柏林游览步道",
      "票务服务体系"
    ]
  },
  {
    year: 1998,
    period: "当代",
    title: "世界遗产",
    description: "联合国教科文组织认证为世界文化遗产，全面启动数字化保护工程。",
    scale: 100,
    buildingTypes: {
      ritual: 40,
      auxiliary: 25,
      service: 25,
      landscape: 10
    },
    metrics: [
      { label: "古建保护率", value: "100%" },
      { label: "三维扫描精度", value: "0.1毫米" },
      { label: "年研究论文", value: "120篇" }
    ],
    features: [
      "声学奇迹回音壁",
      "建筑群完整保护",
      "AR导览系统",
      "祭天文化传承"
    ]
  }
];

// 数据统计方法示例
export const getTimelineStats = () => {
  const totalYears = timelineData[timelineData.length - 1].year - timelineData[0].year;
  const featureCount = timelineData.reduce((sum, period) => sum + period.features.length, 0);
  const maxScale = Math.max(...timelineData.map(p => p.scale));
  
  return {
    totalPeriods: timelineData.length,
    constructionSpan: `${totalYears}年`,
    architecturalFeatures: featureCount,
    peakDevelopment: timelineData.find(p => p.scale === maxScale)?.title
  };
};

// 示例使用
console.log("天坛历史阶段:", timelineData.length);
console.log("最大建设规模阶段:", getTimelineStats().peakDevelopment);
timelineData.forEach(era => {
  console.log(`${era.year}年: ${era.title} | 建设指数 ${era.scale}%`);
});