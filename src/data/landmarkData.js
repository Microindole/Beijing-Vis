/**
 * @description 北京地标数据
 * 包含名称、类型、年代、起止年份、状态、重要性、描述等信息
 */
export const landmarks = [
  // 您的原始8个地标，已更新 'endYear' 和 'status'
  {
    name: "故宫",
    type: "皇家建筑",
    era: "明清",
    startYear: 1406,
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 9,
    geoProximity: 0.8,
    description: "中国明清两代的皇家宫殿，世界文化遗产。建于明永乐四年（1406年），1420年落成。",
  },
  {
    name: "大栅栏",
    type: "市井文化",
    era: "明清至今",
    startYear: 1400, // 约明朝初期形成
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 6,
    geoProximity: 0.7,
    description: "北京著名的商业街区，汇集老字号和传统文化。约明朝初期形成，清代商业繁盛。",
  },
  {
    name: "颐和园",
    type: "皇家园林",
    era: "清",
    startYear: 1750, // 乾隆时期建成
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 8,
    geoProximity: 0.6,
    description: "清朝皇家园林，以其宏大的规模和精美的景色而闻名。前身清漪园始建于1750年。",
  },
  {
    name: "北海公园",
    type: "皇家园林",
    era: "辽金明清至今",
    startYear: 907, // 辽代建瑶屿行宫，金代扩建大宁宫
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 7,
    geoProximity: 0.65,
    description: "中国现存最古老、最完整、最具综合性和代表性的皇家园林之一。始于辽代，金、元、明、清各代有扩建。",
  },
  {
    name: "长城",
    type: "军事防御",
    era: "春秋战国至明",
    startYear: -770, // 公元前770年，春秋时期开始修建
    endYear: 2025, // 延续至今（指现存段落）
    status: "existing",
    importance: 10,
    geoProximity: 0.2,
    description: "世界七大奇迹之一，中国古代军事防御工程。主要修建于春秋战国时期至明代。",
  },
  {
    name: "明十三陵",
    type: "皇家陵寝",
    era: "明",
    startYear: 1409, // 长陵始建年份
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 8,
    geoProximity: 0.3,
    description: "明朝十三个皇帝的陵墓群，世界文化遗产。长陵始建于永乐七年（1409年）。",
  },
  {
    name: "天坛",
    type: "皇家祭祀",
    era: "明清",
    startYear: 1420, // 明永乐十八年建成
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 9,
    geoProximity: 0.75,
    description: "明清两代帝王祭祀皇天、祈五谷丰登的场所，世界文化遗产。建于明永乐十八年（1420年）。",
  },
  {
    name: "法源寺",
    type: "宗教建筑",
    era: "唐至现代",
    startYear: 645, // 唐贞观十九年建成
    endYear: 2025, // 延续至今
    status: "existing",
    importance: 5,
    geoProximity: 0.85,
    description: "北京最古老的寺庙之一，中国佛教协会所在地。始建于唐贞观十九年（645年）。",
  },
  // --- 新增和完善的地标数据 ---

  // 已消失的地标
  {
    name: "元大都",
    type: "都城遗址",
    era: "元",
    startYear: 1267, // 元大都始建年份
    endYear: 1368, // 元朝灭亡，明朝建立后废弃
    status: "vanished",
    importance: 9,
    geoProximity: 0.9,
    description: "元朝的都城，是当时世界上最大的城市之一。明朝建立后被废弃，其遗址部分保留为元大都城垣遗址公园。",
  },
  {
    name: "崇文门",
    type: "城门",
    era: "明清",
    startYear: 1419, // 明永乐十七年建成
    endYear: 1965, // 因修建立交桥和地铁建设被拆除
    status: "vanished",
    importance: 7,
    geoProximity: 0.78,
    description: "北京内城九门之一，俗称“哈德门”，是明清时期京师南部的正门，主要负责南方货物的税收。1965年因修建北京地铁被拆除。",
  },
  {
    name: "圆明园",
    type: "皇家园林",
    era: "清",
    startYear: 1707, // 康熙四十六年开始修建
    endYear: 1860, // 第二次鸦片战争中被英法联军焚毁
    status: "vanished",
    importance: 8,
    geoProximity: 0.4,
    description: "清朝著名皇家园林，有“万园之园”的美誉。始建于康熙四十六年（1707年），1860年被英法联军焚毁。",
  },
  {
    name: "旧北京城墙",
    type: "防御设施",
    era: "明清",
    startYear: 1400, // 明初北京城墙在元大都基础上改建
    endYear: 1969, // 1950年代至1960年代大量拆除
    status: "vanished",
    importance: 8,
    geoProximity: 0.8,
    description: "明清北京城内外城墙及皇城、宫城城墙，构成了完整的防御体系。大部分在20世纪中叶因城市建设被拆除。",
  },
  {
    name: "西直门",
    type: "城门",
    era: "明清",
    startYear: 1425, // 明宣德元年建成
    endYear: 1969, // 因修建西直门立交桥被拆除
    status: "vanished",
    importance: 6,
    geoProximity: 0.7,
    description: "北京内城九门之一，是入京的重要通道。1969年为修建西直门立交桥而拆除。",
  },
  {
    name: "地安门",
    type: "城门",
    era: "明清",
    startYear: 1420, // 明永乐十八年建成
    endYear: 1954, // 因道路拓宽和交通需要被拆除
    status: "vanished",
    importance: 6,
    geoProximity: 0.75,
    description: "北京皇城北门，位于中轴线上。1954年为缓解交通压力而被拆除。",
  },
  {
    name: "天桥",
    type: "市井文化",
    era: "明清至现代",
    startYear: 1400, // 明初形成
    endYear: 1934, // 旧天桥桥体被拆，只留地名
    status: "vanished",
    importance: 5,
    geoProximity: 0.72,
    description: "老北京平民文化和曲艺的聚集地，因一座跨御河的石桥而得名。桥体在1934年因拓宽马路而被拆除。",
  },
  {
    name: "正阳桥五牌楼",
    type: "牌楼",
    era: "明清",
    startYear: 1420, // 明永乐十八年建成
    endYear: 1950, // 因道路交通改造拆除
    status: "vanished",
    importance: 5,
    geoProximity: 0.8,
    description: "正阳桥上的宏伟牌楼，是北京内城的重要标志。1950年代初期因城市改造被拆除。",
  },
  {
    name: "南苑",
    type: "皇家苑囿",
    era: "辽金元明清",
    startYear: 907, // 辽代已有皇家苑囿，后代沿用扩建
    endYear: 1949, // 解放后改为机场和农场等，皇家苑囿功能消失
    status: "vanished",
    importance: 6,
    geoProximity: 0.1,
    description: "北京南部的皇家苑囿，曾是辽、金、元、明、清五朝的皇家猎场和行宫所在地。解放后功能转变，原貌不存。",
  },
  {
    name: "东单牌楼",
    type: "牌楼",
    era: "明清",
    startYear: 1420, // 约明永乐年间建成
    endYear: 1954, // 因扩建东长安街被拆除
    status: "vanished",
    importance: 4,
    geoProximity: 0.85,
    description: "北京东长安街上的一座标志性牌楼，与西单牌楼相对。1954年为拓宽道路而被拆除。",
  },
  {
    name: "西单牌楼",
    type: "牌楼",
    era: "明清",
    startYear: 1420, // 约明永乐年间建成
    endYear: 1954, // 因扩建西长安街被拆除
    status: "vanished",
    importance: 4,
    geoProximity: 0.83,
    description: "北京西长安街上的一座标志性牌楼，与东单牌楼相对。1954年为拓宽道路而被拆除。",
  },

  // 现存的其他地标
  {
    name: "正阳门箭楼",
    type: "城门",
    era: "明清至今",
    startYear: 1419, // 明永乐十七年建成
    endYear: 2025,
    status: "existing",
    importance: 7,
    geoProximity: 0.8,
    description: "正阳门城楼前的箭楼，现存。它是北京城门体系中保存最完整、最宏伟的建筑之一。",
  },
  {
    name: "万寿寺",
    type: "皇家寺庙",
    era: "明清至今",
    startYear: 1577, // 明万历五年建成
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.5,
    description: "明清皇家寺庙，现为北京艺术博物馆。明万历五年（1577年）建成，曾是皇家祝寿庆典场所。",
  },
  {
    name: "景山公园",
    type: "皇家园林",
    era: "元明清至今",
    startYear: 1271, // 元代已有万岁山
    endYear: 2025,
    status: "existing",
    importance: 7,
    geoProximity: 0.82,
    description: "元明清三代的皇家园林，北京中轴线上的重要组成部分。元代称万岁山，明代堆煤山，清代更名景山。",
  },
  {
    name: "钟鼓楼",
    type: "报时建筑",
    era: "元明清至今",
    startYear: 1272, // 元代建成
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.85,
    description: "元明清三代的报时中心，老北京的标志性建筑。元代至元九年（1272年）建成，后毁于火，明代重建。",
  },
  {
    name: "北京站",
    type: "现代建筑",
    era: "现代",
    startYear: 1959, // 1959年建成
    endYear: 2025,
    status: "existing",
    importance: 5,
    geoProximity: 0.9,
    description: "中华人民共和国成立后的重要交通枢纽，国庆十周年十大建筑之一。1959年建成投入使用。",
  },
  {
    name: "雍和宫",
    type: "宗教建筑",
    era: "清至今",
    startYear: 1694, // 康熙三十三年，作为雍亲王府邸始建
    endYear: 2025,
    status: "existing",
    importance: 7,
    geoProximity: 0.7,
    description: "清朝雍正帝的府邸，后改为藏传佛教寺院。1694年作为雍亲王府邸始建，1744年改为喇嘛庙。",
  },
  {
    name: "孔庙和国子监",
    type: "教育/宗教建筑",
    era: "元明清至今",
    startYear: 1302, // 元大德六年建成
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.75,
    description: "元明清三代皇帝祭祀孔子和最高学府所在地。孔庙始建于元大德六年（1302年），国子监是其附属。",
  },
  {
    name: "白塔寺 (妙应寺白塔)",
    type: "宗教建筑",
    era: "元至今",
    startYear: 1279, // 元代建成
    endYear: 2025,
    status: "existing",
    importance: 5,
    geoProximity: 0.68,
    description: "位于妙应寺内，由尼泊尔工匠阿尼哥设计建造。元代至元十六年（1279年）建成，是中国现存最早、规模最大的藏式佛塔。",
  },
  {
    name: "恭王府",
    type: "王府",
    era: "清至今",
    startYear: 1779, // 约乾隆四十四年，和珅府邸始建
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.6,
    description: "清代规模最大的一座王府，曾是和珅、永璘的府邸，后赐予恭亲王奕訢。约乾隆四十四年（1779年）和珅始建。",
  },
  {
    name: "什刹海",
    type: "水系/文化",
    era: "金元明清至今",
    startYear: 1153, // 金中都时期已作为水系存在
    endYear: 2025,
    status: "existing",
    importance: 7,
    geoProximity: 0.7,
    description: "北京城内一片开阔的水域，由前海、后海、西海组成。金代定都北京时已是城内重要水系，沿岸分布大量历史建筑和胡同。",
  },
  {
    name: "卢沟桥",
    type: "桥梁",
    era: "金至今",
    startYear: 1189, // 金大定二十九年建成
    endYear: 2025,
    status: "existing",
    importance: 8,
    geoProximity: 0.05,
    description: "北京现存最古老的石拱桥之一，因“卢沟晓月”而闻名，也是抗日战争的起点。金大定二十九年（1189年）建成。",
  },
  {
    name: "首都博物馆",
    type: "现代建筑",
    era: "现代",
    startYear: 2006, // 新馆建成开放年份
    endYear: 2025,
    status: "existing",
    importance: 5,
    geoProximity: 0.6,
    description: "北京大型综合性博物馆，展示北京历史文化和发展。新馆于2006年建成开放。",
  },
  {
    name: "国家体育场 (鸟巢)",
    type: "现代建筑",
    era: "现代",
    startYear: 2008, // 北京奥运会前建成
    endYear: 2025,
    status: "existing",
    importance: 7,
    geoProximity: 0.2,
    description: "2008年北京奥运会主体育场，因其独特的造型而被称为“鸟巢”。2008年建成。",
  },
  {
    name: "国家大剧院",
    type: "现代建筑",
    era: "现代",
    startYear: 2007, // 建成并投入使用年份
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.9,
    description: "位于人民大会堂西侧，以其独特的椭圆形外观而闻名。2007年建成并投入使用。",
  },
  {
    name: "南锣鼓巷",
    type: "胡同街区",
    era: "元明清至今",
    startYear: 1267, // 元大都时期形成
    endYear: 2025,
    status: "existing",
    importance: 6,
    geoProximity: 0.78,
    description: "北京最古老的街区之一，保留了元大都“棋盘式”的格局，两侧有八条平行胡同。元大都时期形成。",
  },
  {
    name: "宋庆龄故居",
    type: "名人故居",
    era: "清至今",
    startYear: 1888, // 醇亲王府北府建成，后为宋庆龄居住
    endYear: 2025,
    status: "existing",
    importance: 4,
    geoProximity: 0.65,
    description: "中华人民共和国名誉主席宋庆龄在北京的住所。原为清醇亲王奕譞的府邸花园，后宋庆龄于1963年迁入。",
  },
  {
    name: "老舍故居",
    type: "名人故居",
    era: "现代",
    startYear: 1950, // 老舍迁入时间
    endYear: 2025,
    status: "existing",
    importance: 4,
    geoProximity: 0.75,
    description: "中国著名文学家老舍先生在北京的住所。老舍于1950年迁入此院，在此居住16年，创作了多部重要作品。",
  },
];


/**
 * @description 地标之间的关系数据
 * 包含源、目标、关系描述和关系强度值
 */
export const relations = [
  // --- Original Highlighted Landmarks Relations (kept as is) ---
  // 故宫 (Forbidden City)
  { source: "故宫", target: "天坛", relation: "帝王祭祀", value: 0.9 },
  {
    source: "故宫",
    target: "北海公园",
    relation: "皇家园林相邻",
    value: 0.7,
  },
  {
    source: "故宫",
    target: "颐和园",
    relation: "皇家建筑群",
    value: 0.6,
  },
  {
    source: "故宫",
    target: "大栅栏",
    relation: "地理临近/文化交汇",
    value: 0.5,
  },
  {
    source: "故宫",
    target: "明十三陵",
    relation: "明代帝王关联",
    value: 0.7,
  },
  { source: "故宫", target: "景山公园", relation: "中轴线", value: 0.8 }, // Kept

  // 大栅栏 (Dashilar)
  {
    source: "大栅栏",
    target: "法源寺",
    relation: "市井文化/地理临近",
    value: 0.8,
  },
  {
    source: "大栅栏",
    target: "天坛",
    relation: "地理临近/历史",
    value: 0.6,
  },
  { source: "大栅栏", target: "天桥", relation: "文化发源", value: 0.9 }, // Kept

  // 颐和园 (Summer Palace)
  {
    source: "颐和园",
    target: "北海公园",
    relation: "皇家园林同类",
    value: 0.8,
  },
  {
    source: "颐和园",
    target: "圆明园",
    relation: "皇家园林相邻",
    value: 0.9,
  }, // Kept

  // 北海公园 (Beihai Park)
  {
    source: "北海公园",
    target: "故宫",
    relation: "皇家园林相邻",
    value: 0.7,
  },
  {
    source: "北海公园",
    target: "景山公园",
    relation: "中轴线/皇家园林",
    value: 0.7,
  }, // Kept

  // 长城 (Great Wall)
  {
    source: "长城",
    target: "明十三陵",
    relation: "明代防御体系",
    value: 0.9,
  },
  {
    source: "长城",
    target: "故宫",
    relation: "帝国防御与中心",
    value: 0.6,
  },

  // 明十三陵 (Ming Tombs)
  {
    source: "明十三陵",
    target: "故宫",
    relation: "明代帝王关联",
    value: 0.7,
  },
  {
    source: "明十三陵",
    target: "长城",
    relation: "明代防御体系",
    value: 0.9,
  },

  // 天坛 (Temple of Heaven)
  { source: "天坛", target: "故宫", relation: "帝王祭祀", value: 0.9 },
  {
    source: "天坛",
    target: "大栅栏",
    relation: "地理临近/历史",
    value: 0.6,
  },

  // 法源寺 (Fayuan Temple)
  {
    source: "法源寺",
    target: "大栅栏",
    relation: "市井文化/地理临近",
    value: 0.8,
  },

  // --- New Landmark Relations (Expanded) ---

  // 元大都 (Yuan Dadu) - Focus on its foundational role
  {
    source: "元大都",
    target: "钟鼓楼",
    relation: "都城中心",
    value: 0.7,
  },
  {
    source: "元大都",
    target: "南锣鼓巷",
    relation: "街区形成",
    value: 0.6,
  },
  {
    source: "元大都",
    target: "白塔寺 (妙应寺白塔)",
    relation: "元代建筑",
    value: 0.7,
  },
  {
    source: "元大都",
    target: "孔庙和国子监",
    relation: "元代教育中心",
    value: 0.6,
  },
  {
    source: "元大都",
    target: "旧北京城墙",
    relation: "城墙前身",
    value: 0.8,
  }, //明城墙多建于元大都基础上

  // 崇文门 (Chongwenmen) & 其他城门
  {
    source: "崇文门",
    target: "北京站",
    relation: "地理临近",
    value: 0.6,
  },
  {
    source: "崇文门",
    target: "正阳门箭楼",
    relation: "城门体系",
    value: 0.7,
  },
  {
    source: "崇文门",
    target: "旧北京城墙",
    relation: "城墙组成",
    value: 0.8,
  },
  {
    source: "崇文门",
    target: "东单牌楼",
    relation: "地理临近",
    value: 0.5,
  },
  {
    source: "西直门",
    target: "地安门",
    relation: "城门体系",
    value: 0.5,
  },
  {
    source: "西直门",
    target: "旧北京城墙",
    relation: "城墙组成",
    value: 0.8,
  },
  {
    source: "地安门",
    target: "景山公园",
    relation: "中轴线",
    value: 0.6,
  }, // 景山在地安门南

  // 圆明园 (Old Summer Palace)
  {
    source: "圆明园",
    target: "颐和园",
    relation: "皇家园林相邻",
    value: 0.9,
  }, // 已有
  {
    source: "圆明园",
    target: "恭王府",
    relation: "清代皇家相关",
    value: 0.5,
  }, // 都是清代重要皇家资产

  // 旧北京城墙 (Old Beijing City Walls)
  {
    source: "旧北京城墙",
    target: "正阳门箭楼",
    relation: "城墙组成",
    value: 0.9,
  },
  {
    source: "旧北京城墙",
    target: "崇文门",
    relation: "城墙组成",
    value: 0.9,
  },
  {
    source: "旧北京城墙",
    target: "西直门",
    relation: "城墙组成",
    value: 0.9,
  },
  {
    source: "旧北京城墙",
    target: "故宫",
    relation: "都城防御",
    value: 0.8,
  },

  // 天桥 (Tianqiao)
  { source: "天桥", target: "大栅栏", relation: "文化发源", value: 0.9 }, // 已有
  {
    source: "天桥",
    target: "正阳门箭楼",
    relation: "地理临近",
    value: 0.7,
  },

  // 正阳桥五牌楼 (Zhengyang Bridge Wupailou)
  {
    source: "正阳桥五牌楼",
    target: "正阳门箭楼",
    relation: "地理临近",
    value: 0.8,
  },
  {
    source: "正阳桥五牌楼",
    target: "大栅栏",
    relation: "地理临近",
    value: 0.7,
  },

  // 南苑 (Nanyuan)
  { source: "南苑", target: "故宫", relation: "皇家活动", value: 0.5 }, // 皇家猎场与都城中心

  // 东单牌楼 & 西单牌楼
  {
    source: "东单牌楼",
    target: "西单牌楼",
    relation: "长安街标志",
    value: 0.8,
  },
  {
    source: "东单牌楼",
    target: "故宫",
    relation: "地理临近",
    value: 0.6,
  },
  {
    source: "西单牌楼",
    target: "故宫",
    relation: "地理临近",
    value: 0.6,
  },

  // 万寿寺 (Wanshou Temple)
  {
    source: "万寿寺",
    target: "颐和园",
    relation: "皇家寺庙/地理临近",
    value: 0.6,
  }, // 曾是皇帝往返颐和园的行宫
  {
    source: "万寿寺",
    target: "雍和宫",
    relation: "皇家寺庙同类",
    value: 0.5,
  },

  // 景山公园 (Jingshan Park)
  { source: "景山公园", target: "故宫", relation: "中轴线", value: 0.8 }, // 已有
  {
    source: "景山公园",
    target: "北海公园",
    relation: "中轴线/皇家园林",
    value: 0.7,
  }, // 已有

  // 钟鼓楼 (Bell and Drum Towers)
  {
    source: "钟鼓楼",
    target: "元大都",
    relation: "都城中心",
    value: 0.7,
  }, // 已有
  {
    source: "钟鼓楼",
    target: "南锣鼓巷",
    relation: "地理临近/胡同文化",
    value: 0.8,
  },
  {
    source: "钟鼓楼",
    target: "什刹海",
    relation: "地理临近/水系",
    value: 0.7,
  },

  // 北京站 (Beijing Railway Station)
  {
    source: "北京站",
    target: "崇文门",
    relation: "地理临近",
    value: 0.6,
  }, // 已有
  {
    source: "北京站",
    target: "国家大剧院",
    relation: "现代交通/文化枢纽",
    value: 0.5,
  },

  // 雍和宫 (Yonghe Temple)
  {
    source: "雍和宫",
    target: "孔庙和国子监",
    relation: "宗教/教育临近",
    value: 0.6,
  }, // 两者都在国子监街附近
  {
    source: "雍和宫",
    target: "故宫",
    relation: "清代皇家相关",
    value: 0.7,
  }, // 曾是雍正帝府邸

  // 孔庙和国子监 (Confucian Temple and Imperial College)
  {
    source: "孔庙和国子监",
    target: "雍和宫",
    relation: "宗教/教育临近",
    value: 0.6,
  }, // 已有

  // 白塔寺 (妙应寺白塔) (White Dagoba Temple)
  {
    source: "白塔寺 (妙应寺白塔)",
    target: "元大都",
    relation: "元代建筑",
    value: 0.7,
  }, // 已有

  // 恭王府 (Prince Gong's Mansion)
  {
    source: "恭王府",
    target: "什刹海",
    relation: "地理临近",
    value: 0.8,
  },
  {
    source: "恭王府",
    target: "北海公园",
    relation: "皇家园林相邻",
    value: 0.6,
  }, // 恭王府靠近北海

  // 什刹海 (Shichahai)
  {
    source: "什刹海",
    target: "恭王府",
    relation: "地理临近",
    value: 0.8,
  }, // 已有
  {
    source: "什刹海",
    target: "北海公园",
    relation: "水系相连",
    value: 0.7,
  },
  {
    source: "什刹海",
    target: "南锣鼓巷",
    relation: "胡同街区",
    value: 0.8,
  },

  // 卢沟桥 (Lugou Bridge)
  {
    source: "卢沟桥",
    target: "长城",
    relation: "防御/交通枢纽",
    value: 0.7,
  }, // 都是金代交通和防御的标志

  // 首都博物馆 (Capital Museum)
  {
    source: "首都博物馆",
    target: "国家大剧院",
    relation: "现代文化设施",
    value: 0.6,
  },
  {
    source: "首都博物馆",
    target: "北京站",
    relation: "现代交通/文化",
    value: 0.4,
  },

  // 国家体育场 (鸟巢) (National Stadium (Bird's Nest))
  {
    source: "国家体育场 (鸟巢)",
    target: "国家大剧院",
    relation: "现代标志性建筑",
    value: 0.7,
  }, // 都是奥运后北京的标志性建筑

  // 国家大剧院 (National Centre for the Performing Arts)
  {
    source: "国家大剧院",
    target: "故宫",
    relation: "地理临近/文化新旧",
    value: 0.5,
  }, // 现代与古代的文化地标对比
  {
    source: "国家大剧院",
    target: "北京站",
    relation: "现代交通/文化枢纽",
    value: 0.5,
  }, // 已有
  {
    source: "国家大剧院",
    target: "首都博物馆",
    relation: "现代文化设施",
    value: 0.6,
  }, // 已有

  // 南锣鼓巷 (Nanluoguxiang)
  {
    source: "南锣鼓巷",
    target: "什刹海",
    relation: "胡同街区",
    value: 0.8,
  }, // 已有
  {
    source: "南锣鼓巷",
    target: "钟鼓楼",
    relation: "地理临近/胡同文化",
    value: 0.7,
  }, // 已有

  // 宋庆龄故居 (Soong Ching Ling Former Residence)
  {
    source: "宋庆龄故居",
    target: "什刹海",
    relation: "地理临近",
    value: 0.7,
  }, // 位于什刹海边
  {
    source: "宋庆龄故居",
    target: "恭王府",
    relation: "王府历史",
    value: 0.6,
  }, // 曾是醇亲王府，与恭王府有历史渊源

  // 老舍故居 (Lao She Former Residence)
  {
    source: "老舍故居",
    target: "大栅栏",
    relation: "文化关联",
    value: 0.6,
  }, // 老舍作品中常描绘老北京市井生活
  {
    source: "老舍故居",
    target: "天桥",
    relation: "文化关联",
    value: 0.5,
  }, // 同上
];