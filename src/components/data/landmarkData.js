// src/data/landmarkData.js

// 辅助函数，用于简化节点创建
const createNode = (id, name, type, description, image = "", size = 20) => ({
  id,
  name,
  category: type, // ECharts中用category来区分不同类型的节点
  symbolSize: size,
  itemStyle: {}, // 可以为特定节点定义样式
  description,
  image,
});

// 辅助函数，用于简化关系创建
const createLink = (source, target, relation) => ({
  source,
  target,
  label: {
    show: true,
    formatter: relation,
    fontSize: 10, // 减小关系标签字体
    color: "#666",
  },
  lineStyle: {
    color: "#aaa",
    curveness: 0.1,
  },
});

// 定义节点类型（用于ECharts图例和样式）
export const categories = [
  { name: "核心地标" }, // 0
  { name: "组成部分" }, // 1
  { name: "相关人物" }, // 2
  { name: "历史事件" }, // 3
  { name: "文化概念" }, // 4
  { name: "关联场所" }, // 5
];

// --- 大栅栏数据 ---
const dashilarNodes = [
  createNode(
    "dashilar",
    "大栅栏",
    "核心地标",
    "北京著名的百年商业老街，京味文化与市井生活的鲜活画卷，承载着丰富的历史记忆与民国风情。",
    "dashilar/dashilan_main.jpg",
    60
  ),
  createNode(
    "langfang",
    "廊房四条",
    "文化概念",
    "大栅栏地区最早的称呼，源于明永乐年间，为方便各地商人交易而兴建的廊房商业街区。",
    "",
    20
  ),
  createNode(
    "laozihao",
    "老字号",
    "文化概念",
    "清末时大栅栏已有80余家老字号，形成了“头顶马聚元，脚踩内联升，身穿八大祥，腰缠四大恒”的繁华景象。",
    "",
    35
  ),
  createNode(
    "tongrentang",
    "同仁堂",
    "关联场所",
    "由太医院吏目乐显扬于康熙八年(1669年)创办，自雍正元年(1723年)起，独办官药，供奉清宫御药房长达188年。其“炮制虽繁必不敢省人工，品味虽贵必不敢减物力”的古训是其金字招牌。",
    "dashilar/tongrentang.jpg",
    25
  ),
  createNode(
    "ruifuxiang",
    "瑞蚨祥",
    "关联场所",
    "创始人孟传珊以“青蚨还钱”的典故取名，寓意财源茂盛。1893年开设分店，很快成为京城“八大祥”之首，新中国第一面五星红旗的面料即出自瑞蚨祥。",
    "dashilar/ruifuxiang.jpg",
    25
  ),
  createNode(
    "majy",
    "马聚元",
    "关联场所",
    "创始于清嘉庆年间，以精制各式男女礼帽、皮帽、便帽而闻名，是京城“帽业之魁”。",
    "",
    25
  ),
  createNode(
    "nls",
    "内联升",
    "关联场所",
    "创建于清咸丰三年(1853年)，以制作朝靴起家，其“千层底”布鞋制作技艺被列入国家级非物质文化遗产名录。",
    "",
    25
  ),
  createNode(
    "zyy",
    "张一元",
    "关联场所",
    "始建于清光绪二十六年(1900年)，以独特的茉莉花茶窨制技艺闻名，讲究“汤清、味浓、入口芳香、回味无穷”。",
    "",
    25
  ),
  createNode(
    "wmz",
    "王麻子",
    "关联场所",
    "始创于清顺治八年(1651年)的剪刀品牌，以“三看、两试”(看刃口、看剪轴、看剪尖，试剪刃、试手感)的工艺标准著称。",
    "",
    25
  ),
  createNode(
    "daguanlou",
    "大观楼",
    "关联场所",
    "原为“大观楼茶园”，1905年，中国第一部电影——京剧《定军山》在此首映，标志着中国电影的诞生，大观楼也因此成为中国第一家电影院。",
    "dashilar/daguanlou.jpg",
    25
  ),
  createNode(
    "qingleyuan",
    "庆乐园",
    "关联场所",
    "清代光绪年间开设的戏园，是京剧发展史上的重要场所，程长庚、谭鑫培等名角都曾在此献艺。",
    "",
    25
  ),
  createNode(
    "yht",
    "义和团运动",
    "历史事件",
    "1900年义和团运动中，因街内有洋货店，义和团在此放火，火势蔓延至整条街，多家店铺被焚毁，是其历史上的一次重创。",
    "",
    25
  ),
  createNode(
    "dashilaner",
    "大石烂儿读音",
    "文化概念",
    "大栅栏的特殊地方读音“Dashilan(er)”，据专家考证，可能源于明代古音“shàn”，后在北京方言中被“懒化”和“儿化”，形成了这一独特且富有地方色彩的读法。",
    "",
    20
  ),
  createNode(
    "badaxiang",
    "八大祥",
    "文化概念",
    "指民国时期北京著名的八家带“祥”字的绸布店，其中多家位于大栅栏，如瑞蚨祥、谦祥益等，是当时北京纺织品行业的代表。",
    "",
    25
  ),
  createNode(
    "sidaheng",
    "四大恒",
    "文化概念",
    "指清末民初北京实力最雄厚的四家“恒”字号银号（金融机构），它们多与大栅栏的商号有紧密的业务往来，是商业繁荣的金融支柱。",
    "",
    25
  ),
];

const dashilarLinks = [
  createLink("dashilar", "langfang", "源于"),
  createLink("dashilar", "laozihao", "拥有众多"),
  createLink("dashilar", "qingleyuan", "包含"),
  createLink("dashilar", "daguanlou", "包含"),
  createLink("laozihao", "tongrentang", "包括"),
  createLink("laozihao", "ruifuxiang", "包括"),
  createLink("laozihao", "majy", "包括"),
  createLink("laozihao", "nls", "包括"),
  createLink("laozihao", "zyy", "包括"),
  createLink("laozihao", "wmz", "包括"),
  createLink("laozihao", "badaxiang", "形成"),
  createLink("dashilar", "sidaheng", "关联"),
  createLink("yht", "dashilar", "影响"),
  createLink("dashilar", "dashilaner", "具有"),
];

// --- 明十三陵数据 ---
const mingTomsNodes = [
  createNode(
    "mingToms",
    "明十三陵",
    "核心地标",
    "明朝13位皇帝的陵寝群，自1409年始建，至1644年终止。陵区占地约40多平方公里，是中国现存规模最大、帝后陵寝最多的一处皇陵建筑群。",
    "Ming_Tombs.jpg",
    60
  ),
  createNode(
    "fengshui",
    "风水选址",
    "文化概念",
    "明成祖朱棣派人遍寻吉壤，最终选定昌平天寿山。此地被认为“山脉自太行来，……其气势如巨浪，如奔马”，是“风水”绝佳的万年寿域。",
    "",
    25
  ),
  createNode(
    "shendao",
    "神道",
    "组成部分",
    "明十三陵的总神道，长约7公里，是陵区的导入部分。",
    "明十三陵神道_大宫门.jpg",
    35
  ),
  createNode(
    "shipaifang",
    "石牌坊",
    "组成部分",
    "神道的起点，建于嘉靖十九年(1540年)，是中国现存最大、最早的石枋建筑之一，六柱五间十一楼，雕刻精美。",
    "",
    25
  ),
  createNode(
    "shixiangsheng",
    "石像生",
    "组成部分",
    "排列在神道两侧的石兽、石人，共18对，包括狮、獬豸、骆驼、象、麒麟、马及文臣武将等，象征着皇帝的威仪。",
    "mingtoms/shixiangsheng.jpg",
    25
  ),

  // 皇帝与陵墓
  createNode(
    "zhudi",
    "朱棣(明成祖)",
    "相关人物",
    "年号永乐，明朝第三位皇帝，是营建北京城和开创十三陵的帝王。",
    "mingtoms/zhudi.jpg",
    25
  ),
  createNode(
    "changling",
    "长陵",
    "组成部分",
    "十三陵之首，建于1409-1427年，是明成祖朱棣的陵墓，建筑规模最大，其祾恩殿是现存最大的楠木殿宇之一。",
    "长陵.jpg",
    30
  ),
  createNode(
    "zhugaochi",
    "朱高炽(明仁宗)",
    "相关人物",
    "年号洪熙，在位仅一年，提倡简葬。",
    "",
    25
  ),
  createNode(
    "xianling",
    "献陵",
    "组成部分",
    "明仁宗朱高炽的陵墓，规模较小，开创了帝陵从简的先例。",
    "",
    25
  ),
  createNode(
    "zhuzhanji",
    "朱瞻基(明宣宗)",
    "相关人物",
    "年号宣德，与其父统治期间被誉为“仁宣之治”。",
    "",
    25
  ),
  createNode(
    "jingling",
    "景陵",
    "组成部分",
    "明宣宗朱瞻基的陵墓，是第一座采用“金井”葬制的皇陵。",
    "",
    25
  ),
  createNode(
    "zhuzhen",
    "朱祁镇(明英宗)",
    "相关人物",
    "两次在位，经历“土木堡之变”，年号正统、天顺。",
    "",
    25
  ),
  createNode(
    "yuling",
    "裕陵",
    "组成部分",
    "明英宗朱祁镇的陵墓，其地宫曾被盗，2007年进行了考古研究。",
    "",
    25
  ),
  createNode(
    "zhujianshen",
    "朱见深(明宪宗)",
    "相关人物",
    "年号成化，宠信万贵妃。",
    "",
    25
  ),
  createNode("maoling", "茂陵", "组成部分", "明宪宗朱见深的陵墓。", "", 25),
  createNode(
    "zhuyoutang",
    "朱祐樘(明孝宗)",
    "相关人物",
    "年号弘治，一生只娶一位皇后，被誉为“弘治中兴”。",
    "",
    25
  ),
  createNode("tailing", "泰陵", "组成部分", "明孝宗朱祐樘的陵墓。", "", 25),
  createNode(
    "zhuhouzhao",
    "朱厚照(明武宗)",
    "相关人物",
    "年号正德，行为荒诞不经，极富争议。",
    "",
    25
  ),
  createNode(
    "kangling",
    "康陵",
    "组成部分",
    "明武宗朱厚照的陵墓，建筑风格简洁。",
    "",
    25
  ),
  createNode(
    "zhuhoucong",
    "朱厚熜(明世宗)",
    "相关人物",
    "年号嘉靖，沉迷道教，长期不上朝。",
    "",
    25
  ),
  createNode(
    "yongling",
    "永陵",
    "组成部分",
    "明世宗朱厚熜的陵墓，规模宏大，仅次于长陵。",
    "",
    25
  ),
  createNode(
    "zhuzaiji",
    "朱载塈(明穆宗)",
    "相关人物",
    "年号隆庆，开启“隆庆开关”，在位时间较短。",
    "",
    25
  ),
  createNode(
    "zhaoling",
    "昭陵",
    "组成部分",
    "明穆宗朱载塈的陵墓，是第一座被大规模复原的明代皇陵。",
    "",
    25
  ),
  createNode(
    "zhuyijun",
    "朱翊钧(明神宗)",
    "相关人物",
    "年号万历，在位48年，是明朝在位时间最长的皇帝，其陵墓定陵被发掘。",
    "",
    25
  ),
  createNode(
    "dingling",
    "定陵",
    "组成部分",
    "唯一被考古发掘的明代帝陵，为明神宗万历皇帝的陵墓，出土了三千余件珍贵文物。",
    "dingling.jpg",
    30
  ),
  createNode(
    "zhuchangluo",
    "朱常洛(明光宗)",
    "相关人物",
    "在位仅29天，死因成谜，史称“红丸案”。",
    "",
    25
  ),
  createNode(
    "qingling",
    "庆陵",
    "组成部分",
    "明光宗朱常洛的陵墓，由其子天启帝修建。",
    "",
    25
  ),
  createNode(
    "zhuyoujiao",
    "朱由校(明熹宗)",
    "相关人物",
    "年号天启，被称为“木匠皇帝”。",
    "",
    25
  ),
  createNode("deling", "德陵", "组成部分", "明熹宗朱由校的陵墓。", "", 25),
  createNode(
    "zhuyoujian",
    "朱由检(明思宗)",
    "相关人物",
    "年号崇祯，明朝最后一位皇帝，在李自成攻入北京后自缢于煤山。",
    "",
    25
  ),
  createNode(
    "siling",
    "思陵",
    "组成部分",
    "原为田贵妃墓，后改为明思宗崇祯帝的陵墓，是十三陵中规模最小的。",
    "",
    25
  ),

  // 相关人物与事件
  createNode(
    "wuhan",
    "吴晗",
    "相关人物",
    "著名历史学家、时任北京市副市长，20世纪50年代积极倡议并主持了定陵的发掘工作。",
    "mingtoms/wuhan.jpg",
    25
  ),
  createNode(
    "guomoro",
    "郭沫若",
    "相关人物",
    "时任中国科学院院长，与吴晗一同向中央提交报告，大力支持定陵的发掘工作。",
    "",
    25
  ),
  createNode(
    "dinglingExcavation",
    "定陵发掘",
    "历史事件",
    "1956年至1958年进行，是中国首次主动考古发掘帝陵。虽然出土了大量国宝，但因当时文物保护技术落后，许多丝织品等有机文物出土后迅速氧化损毁，成为中国考古史上一个沉痛的教训。",
    "mingtoms/dingling_excavation.jpg",
    30
  ),
  createNode(
    "culturalRevolution",
    "文革破坏",
    "历史事件",
    "1966年“破四旧”运动中，万历皇帝与两位皇后的遗骸被从定陵地宫中拖出，在博物馆门前广场上被红卫兵组织批斗并当众焚毁。这是中国文物保护史上的一场浩劫。",
    "",
    25
  ),
];

const mingTomsLinks = [
  createLink("mingToms", "fengshui", "基于"),
  createLink("mingToms", "shendao", "拥有"),
  createLink("shendao", "shipaifang", "包含"),
  createLink("shendao", "shixiangsheng", "包含"),

  // 连接陵墓与核心地标
  createLink("mingToms", "changling", "包含"),
  createLink("mingToms", "xianling", "包含"),
  createLink("mingToms", "jingling", "包含"),
  createLink("mingToms", "yuling", "包含"),
  createLink("mingToms", "maoling", "包含"),
  createLink("mingToms", "tailing", "包含"),
  createLink("mingToms", "kangling", "包含"),
  createLink("mingToms", "yongling", "包含"),
  createLink("mingToms", "zhaoling", "包含"),
  createLink("mingToms", "dingling", "包含"),
  createLink("mingToms", "qingling", "包含"),
  createLink("mingToms", "deling", "包含"),
  createLink("mingToms", "siling", "包含"),

  // 连接皇帝与陵墓
  createLink("zhudi", "changling", "葬于"),
  createLink("zhugaochi", "xianling", "葬于"),
  createLink("zhuzhanji", "jingling", "葬于"),
  createLink("zhuzhen", "yuling", "葬于"),
  createLink("zhujianshen", "maoling", "葬于"),
  createLink("zhuyoutang", "tailing", "葬于"),
  createLink("zhuhouzhao", "kangling", "葬于"),
  createLink("zhuhoucong", "yongling", "葬于"),
  createLink("zhuzaiji", "zhaoling", "葬于"),
  createLink("zhuyijun", "dingling", "葬于"),
  createLink("zhuchangluo", "qingling", "葬于"),
  createLink("zhuyoujiao", "deling", "葬于"),
  createLink("zhuyoujian", "siling", "葬于"),

  // 连接事件与相关人物/地点
  createLink("wuhan", "dinglingExcavation", "主持"),
  createLink("guomoro", "dinglingExcavation", "支持"),
  createLink("dinglingExcavation", "dingling", "发生于"),
  createLink("culturalRevolution", "mingToms", "波及"),
  createLink("culturalRevolution", "dingling", "主要破坏"),
];

// 导出所有数据
export const landmarkGraphData = {
  dashilar: {
    nodes: dashilarNodes,
    links: dashilarLinks,
  },
  mingTombs: {
    nodes: mingTomsNodes,
    links: mingTomsLinks,
  },
};
