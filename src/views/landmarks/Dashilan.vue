<template>
  <div class="landmark-portal-container">
    <header class="landmark-header">
      <button @click="goBack" class="back-button">← 返回地图</button>
      <div class="media-background">
        <img
          v-if="landmark.image"
          :src="landmark.image"
          :alt="landmark.name"
          class="landmark-main-media"
        />
      </div>
      <div class="landmark-info">
        <h1>{{ landmark.name }}</h1>
        <p class="summary">{{ landmark.summary }}</p>
        <div class="core-metrics">
          <div
            v-for="(metric, index) in landmark.metrics"
            :key="index"
            class="metric-item"
          >
            <span class="icon">{{ metric.icon }}</span>
            <span class="value">{{ metric.value }}</span>
            <span class="label">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </header>

    <section class="exploration-cards-section" v-if="!activeChildRoute">
      <div class="exploration-card" @click="explore('lifeCycle')">
        <div class="card-content">
          <h2 class="card-title">街巷记忆</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="oldDashilanImage" alt="街巷记忆预览" />
          </div>
          <p class="card-description">
            从明代廊房的初兴，到清末民初的商铺林立与几经兴废，再到当代的保护性修缮与风貌重现。一同探寻大栅栏这条百年老街在时光流转中的建筑格局、市井风貌与功能角色的演变轨迹。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>

      <div class="exploration-card" @click="explore('influence')">
        <div class="card-content">
          <h2 class="card-title">商韵流传</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="tongRenTangImage" alt="商韵流传预览" />
          </div>
          <p class="card-description">
            解读大栅栏作为京城重要商贸枢纽的历史地位，品味老字号的百年商誉与京味商业文化。评估其在当代如何延续商业活力，吸引八方来客，并在城市发展中焕发新的光彩。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>

      <div class="exploration-card" @click="explore('legends')">
        <div class="card-content">
          <h2 class="card-title">坊间拾趣</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="dashilanStoryImage" alt="坊间拾趣预览" />
          </div>
          <p class="card-description">
            漫步大栅栏，聆听那些流传于街头巷尾的奇闻轶事、梨园往事与民俗风情。从义和团的烽火到"大观楼"的首映光影，从"大石烂儿"的读音传说到元宵灯会的市井喧嚣，拾取那些生动鲜活的地标故事。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>
    </section>

    <!-- 子组件渲染区 -->
    <router-view :landmark-id="landmarkId" :landmark="landmark" />

    <footer class="portal-footer">
      <p>发现更多：<a href="#">推荐探索路线</a> | <a href="#">更多发现</a></p>
      <p class="copyright">© 2023 北京历史文化遗产数字平台</p>
    </footer>
  </div>
</template>

<script>
import DashilarBackgroundImage from "../../assets/dashilan/dashilan_bg.jpg";
import oldDashilanImage from "../../assets/dashilan/olddashilan.jpg";
import tongRenTangImage from "../../assets/dashilan/TongRenTang.jpg";
import dashilanStoryImage from "../../assets/dashilan/dashilan_story.jpg";

export default {
  name: "DashilarPortal",
  props: {
    landmarkId: {
      type: String,
      required: true,
      default: "dashilar",
    },
  },
  data() {
    return {
      landmark: {},
      oldDashilanImage: oldDashilanImage,
      tongRenTangImage: tongRenTangImage,
      dashilanStoryImage: dashilanStoryImage,
    };
  },
  created() {
    this.loadLandmarkData();
  },
  computed: {
    // 新增：检测子路由是否激活[6,7](@ref)
    activeChildRoute() {
      return this.$route.matched.length > 1;
    },
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    explore(direction) {
      const params = {
        landmarkId: this.landmarkId,
        landmark: this.landmark, // 如果需要传递整个 landmark 对象
      };
      if (direction === "lifeCycle") {
        this.$router.push({
          name: "DashilanLifeCycle",
          params: {
            ...params,
            direction: direction,
          },
        });
      } else if (direction === "influence") {
        this.$router.push({
          name: "DashilanInfluence",
          params,
        });
      } else if (direction === "legends") {
        this.$router.push({
          name: "DashilanLegends",
          params,
          query: { landmarkId: this.landmarkId }, // 通过 query 传递
        });
      } else {
        console.warn("Unknown exploration direction:", direction);
      }
    },
    loadLandmarkData() {
      if (this.landmarkId === "dashilar") {
        this.landmark = {
          name: "大栅栏",
          summary:
            "北京著名的百年商业老街，京味文化与市井生活的鲜活画卷，承载着丰富的历史记忆与民国风情。",
          image: DashilarBackgroundImage,
          metrics: [
            { icon: "📅", value: "明代初 (15世纪初)", label: "始建于" },
            { icon: "📏", value: "长275米", label: "街道长度" },
            { icon: "🏅", value: "中国历史文化街区", label: "称号" },
            { icon: "🚶", value: "日均15万+", label: "日均客流" },
          ],
        };
      }
    },
  },
};
</script>

<style scoped>
/* 样式保持不变，此处省略以减少篇幅 */
/* 整体容器 - 黄昏色调 */
.landmark-portal-container {
  font-family: "Noto Serif SC", serif;
  color: #333;
  line-height: 1.6;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部区域 - 黄昏效果 */
.landmark-header {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-align: center;
  color: white;
  padding-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.media-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.landmark-main-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) sepia(0.3) hue-rotate(-10deg) contrast(0.9);
}

.landmark-info {
  position: relative;
  z-index: 1;
  padding: 0 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  margin-bottom: 40px;
}

.landmark-info h1 {
  font-size: 3.2em;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff8e1;
}

.landmark-info .summary {
  font-size: 1.2em;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: #f5f5f5;
  line-height: 1.8;
}

.core-metrics {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1em;
  background-color: rgba(255, 248, 225, 0.15);
  border-radius: 12px;
  padding: 12px 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 235, 205, 0.3);
  transition: all 0.3s ease;
}

.metric-item:hover {
  background-color: rgba(255, 248, 225, 0.25);
  transform: translateY(-3px);
}

.metric-item .icon {
  font-size: 1.8em;
  margin-bottom: 8px;
  color: #ffd54f;
}

.metric-item .value {
  font-size: 1.4em;
  font-weight: bold;
  color: #fff8e1;
  margin-bottom: 5px;
}

.metric-item .label {
  font-size: 0.9em;
  color: #f5f5f5;
  opacity: 0.9;
}

.back-button {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: rgba(139, 69, 19, 0.7);
  color: #fff8e1;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: rgba(160, 82, 45, 0.9);
  transform: translateX(-5px);
}

/* 中部探索卡片区 - 流线型设计 */
.exploration-cards-section {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 40px;
  background: transparent;
  flex-wrap: wrap;
  margin-top: -80px;
  position: relative;
  z-index: 2;
}

.exploration-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f5ed 100%);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(101, 67, 33, 0.2);
  padding: 0;
  width: 28%;
  max-width: 380px;
  min-width: 280px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.exploration-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 25px 60px rgba(101, 67, 33, 0.3);
}

.card-content {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-title {
  font-size: 1.6em;
  color: #8b4513;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.card-title:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #d4a76a 0%, #8b4513 100%);
}

.card-preview-media {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 25px;
  position: relative;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(139, 69, 19, 0.1),
    rgba(101, 67, 33, 0.4)
  );
  z-index: 1;
}

.card-preview-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) sepia(0.2);
  transition: all 0.5s ease;
}

.exploration-card:hover .card-preview-media img {
  transform: scale(1.05);
  filter: brightness(0.9) sepia(0.1);
}

.card-description {
  font-size: 1em;
  color: #5a4a42;
  margin-bottom: 25px;
  line-height: 1.7;
}

.explore-button {
  background: linear-gradient(135deg, #d4a76a 0%, #8b4513 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.explore-button:hover {
  background: linear-gradient(135deg, #e0b87a 0%, #9c5a29 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
}

/* 底部区域 */
.portal-footer {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #8b4513 0%, #5a2c0b 100%);
  color: #f5f5f5;
  font-size: 0.9em;
  margin-top: auto;
}

.portal-footer a {
  color: #ffd54f;
  text-decoration: none;
  margin: 0 10px;
  transition: color 0.3s ease;
  font-weight: 500;
}

.portal-footer a:hover {
  color: #fff8e1;
  text-decoration: underline;
}

.portal-footer .copyright {
  margin-top: 15px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .exploration-card {
    width: 45%;
    margin-bottom: 30px;
  }

  .landmark-header {
    height: 65vh;
  }

  .landmark-info h1 {
    font-size: 2.8em;
  }
}

@media (max-width: 768px) {
  .landmark-header {
    height: 60vh;
  }

  .landmark-info h1 {
    font-size: 2.2em;
  }

  .landmark-info .summary {
    font-size: 1em;
  }

  .exploration-cards-section {
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
    margin-top: -60px;
  }

  .exploration-card {
    width: 90%;
    margin-bottom: 25px;
  }

  .core-metrics {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .landmark-info h1 {
    font-size: 1.8em;
  }

  .back-button {
    top: 20px;
    left: 20px;
    padding: 10px 15px;
  }

  .exploration-card {
    width: 100%;
  }

  .card-title {
    font-size: 1.4em;
  }
}
</style>
