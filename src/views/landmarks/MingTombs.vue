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
          <h2 class="card-title">皇陵沿革</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="changlingImage" alt="皇陵沿革预览" />
          </div>
          <p class="card-description">
            追溯自永乐七年始建长陵，至崇祯帝入葬，明朝十三座帝王陵寝的兴建历程。审视其在清代的维护，历经近现代的考古发掘、磨难与保护，直至成为世界文化遗产的完整历史演变。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>

      <div class="exploration-card" @click="explore('influence')">
        <div class="card-content">
          <h2 class="card-title">世遗之尊</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="shendaoDagongmenImage" alt="世遗之尊预览" />
          </div>
          <p class="card-description">
            探究明十三陵作为中华文明瑰宝的显赫地位，及其被联合国教科文组织列为世界文化遗产的核心价值。评估其宏伟的皇家规制、独特的风水格局和丰富的历史遗存对当代文化、旅游及学术研究产生的深远影响。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>

      <div class="exploration-card" @click="explore('legends')">
        <div class="card-content">
          <h2 class="card-title">陵寝秘语</h2>
          <div class="card-preview-media">
            <div class="media-overlay"></div>
            <img :src="beitingImage" alt="陵寝秘语预览" />
          </div>
          <p class="card-description">
            揭开沉睡帝陵的神秘面纱，聆听万历帝定陵发掘的幕后故事与考古传奇，探寻民间流传的"陵中宝藏"传说。感受帝王将相的功过是非，以及这座皇家陵园在历史长河中低语的未尽之言。
          </p>
          <button class="explore-button">立即探索 →</button>
        </div>
      </div>
    </section>

    <!-- 子组件渲染区 -->
    <router-view :landmark-id="landmarkId" :landmark="landmark" />

    <AppFooter />
  </div>
</template>

<script>
import MingTombsBackgroundImage from "../../assets/ming-tombs/Ming_Tombs.jpg";
// 导入探索卡片图片
import changlingImage from "../../assets/ming-tombs/长陵.jpg"; // 确保文件名和路径正确
import shendaoDagongmenImage from "../../assets/ming-tombs/明十三陵神道_大宫门.jpg"; // 确保文件名和路径正确
import beitingImage from "../../assets/ming-tombs/碑亭.jpg"; // 确保文件名和路径正确
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: "MingTombsPortal",
  components: {AppFooter},
  props: {
    landmarkId: {
      type: String,
      required: true,
      default: "mingTombs",
    },
  },
  data() {
    return {
      landmark: {},
      // 导入的图片放在 data 中供模板使用
      changlingImage: changlingImage,
      shendaoDagongmenImage: shendaoDagongmenImage,
      beitingImage: beitingImage,
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
          name: "MingTombsLifeCycle",
          params: { ...params, direction: direction },
        });
      } else if (direction === "influence") {
        this.$router.push({
          name: "MingTombsInfluence",
          params,
        });
      } else if (direction === "legends") {
        this.$router.push({
          name: "MingTombsLegends",
          params,
          query: { landmarkId: this.landmarkId }, // 通过 query 传递
        });
      } else {
        console.warn("Unknown exploration direction:", direction);
      }
    },
    loadLandmarkData() {
      if (this.landmarkId === "mingTombs") {
        this.landmark = {
          name: "明十三陵",
          summary:
            "明朝十三位帝王的宏伟长眠之地，世界文化遗产，展现中国古代皇家陵寝建筑艺术与历史文化。",
          image: MingTombsBackgroundImage,
          metrics: [
            { icon: "📅", value: "1409-1644年", label: "修建年代" },
            { icon: "👑", value: "13位", label: "明朝皇帝" },
            { icon: "🌍", value: "世界文化遗产", label: "2003年列入" },
            { icon: "🏞️", value: "约40平方公里", label: "占地面积" },
          ],
        };
      }
    },
  },
};
</script>

<style scoped>
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

.header-content {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 180px;
}

.main-title {
  text-align: center;
  font-size: 2.8em;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 30px;
  color: #8b4513;
  letter-spacing: 2px;
}

.intro-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
}

.intro-card {
  background: linear-gradient(135deg, #fffbe6 0%, #f5e6c8 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.08);
  padding: 24px 32px;
  min-width: 220px;
  max-width: 320px;
  flex: 1 1 220px;
  text-align: left;
  border: 1px solid #e0cfa6;
}

.intro-card h2 {
  font-size: 1.2em;
  color: #a67c52;
  margin-bottom: 10px;
  font-weight: 600;
}

.intro-card p {
  font-size: 1em;
  color: #5a4a42;
  margin: 0;
}

.landmark-header {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
