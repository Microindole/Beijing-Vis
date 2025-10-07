<template>
  <div class="landmark-portal-container">
    <!-- 优化后的头部区域 -->
    <header class="landmark-header">
      <button @click="goBack" class="back-button">
        <span class="back-icon">←</span>
        <span class="back-text">返回地图</span>
      </button>

      <div class="media-background">
        <img
            v-if="landmark.image"
            :src="landmark.image"
            :alt="landmark.name"
            class="landmark-main-media"
        />
        <div class="gradient-overlay"></div>
        <div class="grain-texture"></div>
      </div>

      <div class="landmark-info">
        <div class="title-wrapper">
          <h1 class="landmark-title">{{ landmark.name }}</h1>
          <div class="title-decoration"></div>
        </div>
        <p class="summary">{{ landmark.summary }}</p>
        <div class="core-metrics">
          <div
              v-for="(metric, index) in landmark.metrics"
              :key="index"
              class="metric-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <span class="metric-icon">{{ metric.icon }}</span>
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 优化后的探索卡片区 -->
    <section class="exploration-section" v-if="!activeChildRoute">
      <div class="section-header">
        <h2 class="section-title">探索维度</h2>
        <p class="section-subtitle">从不同角度了解颐和园的历史与文化</p>
      </div>

      <div class="cards-grid">
        <article
            class="exploration-card"
            @click="explore('lifeCycle')"
            :style="{ animationDelay: '0.2s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://5b0988e595225.cdn.sohucs.com/images/20190302/76301000101248c5b5b98902edd505af.jpeg"
                alt="生命年轮预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">01</div>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🏛️</span>
              园林变迁
            </h3>
            <p class="card-description">
              从乾隆时期的清漪园到英法联军的劫难，再到慈禧重建后的颐和园。探寻这座皇家园林在两百余年间的兴废更迭、建筑演变与功能转型的完整历程。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </article>

        <article
            class="exploration-card"
            @click="explore('influence')"
            :style="{ animationDelay: '0.3s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://th.bing.com/th/id/R.8f12a0feaa00223ec8b12150d8457f96?rik=w0LNbzIwxSPCmQ&riu=http%3a%2f%2fwww.br-cn.com%2fimage%2f2023-01-02%2fthumb%2f1059526375796510720.jpg&ehk=PDDMjLZpIGqmoj%2boTIDuzZoQ7O384zqlJ7MA%2fypr0%2fA%3d&risl=&pid=ImgRaw&r=0"
                alt="影响力光环预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">02</div>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🌍</span>
              影响力光环
            </h3>
            <p class="card-description">
              解析颐和园作为世界文化遗产的全球影响力，评估其精湛的造园艺术、独特的山水格局和丰富的文化内涵在当代旅游、文化交流与园林研究中的重要地位。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </article>

        <article
            class="exploration-card"
            @click="explore('legends')"
            :style="{ animationDelay: '0.4s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://th.bing.com/th/id/OIP.OhvCxPWxmKbmROhVOaefvQHaE6?w=279&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt="传奇故事预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">03</div>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">📖</span>
              传奇故事
            </h3>
            <p class="card-description">
              聆听慈禧太后与颐和园的不解之缘，品读文人墨客的游园诗篇，探寻长廊彩画背后的历史典故。那些流传至今的宫廷轶事，诉说着这座皇家园林的人文温度。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- 子组件渲染区 -->
    <router-view v-if="activeChildRoute" :landmark="landmark" />

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "SummerPalacePortal",
  components: { AppFooter },
  props: {
    landmarkId: {
      type: String,
      required: false,
      default: "summer-palace",
    },
  },
  data() {
    return {
      landmark: {
        name: "颐和园",
        summary: "中国现存规模最大、保存最完整的皇家行宫御苑，被誉为'皇家园林博物馆'。",
        image: "https://image.arrivalguides.com/x/05/9b69ea7184c4dc9e31b123f924aa265a.jpg",
        metrics: [
          { icon: "📅", value: "1750年", label: "始建时间" },
          { icon: "🌊", value: "2.9km²", label: "水域占比70%" },
          { icon: "🏯", value: "长廊", label: "世界之最" },
          { icon: "👑", value: "慈禧", label: "重建主持" },
        ],
      },
    };
  },
  computed: {
    activeChildRoute() {
      return this.$route.matched.length > 1;
    },
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    explore(direction) {
      if (direction === "lifeCycle") {
        this.$router.push({
          name: "SummerPalaceLifeCycle",
          params: { landmarkId: this.landmarkId },
        });
      } else if (direction === "influence") {
        this.$router.push({
          name: "SummerPalaceInfluence",
          params: { landmarkId: this.landmarkId },
        });
      } else if (direction === "legends") {
        this.$router.push({
          name: "SummerPalaceLegends",
          params: { landmarkId: this.landmarkId },
        });
      }
    },
  },
};
</script>

<style scoped>
/* ========== 全局样式 ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.landmark-portal-container {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  color: #2c2416;
  line-height: 1.7;
  background: linear-gradient(to bottom, #f8f5f0 0%, #ebe4d8 50%, #e0d5c7 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 头部区域 ========== */
.landmark-header {
  position: relative;
  width: 100%;
  height: 75vh;
  min-height: 600px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0;
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
  filter: brightness(0.5) saturate(0.8) contrast(1.1);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(34, 139, 139, 0.3) 0%,
      rgba(46, 125, 125, 0.5) 50%,
      rgba(30, 80, 80, 0.8) 100%
  );
  z-index: 1;
}

.grain-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  z-index: 2;
  pointer-events: none;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-4px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

.back-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.back-button:hover .back-icon {
  transform: translateX(-3px);
}

/* 地标信息区 */
.landmark-info {
  position: relative;
  z-index: 3;
  padding: 0 40px 60px;
  text-align: center;
  width: 100%;
  max-width: 1200px;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.landmark-title {
  font-size: 4.5rem;
  font-weight: 700;
  letter-spacing: 8px;
  color: #fff;
  text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.2),
      0 8px 24px rgba(30, 80, 80, 0.4);
  margin: 0;
  animation: fadeInUp 0.8s ease-out;
}

.title-decoration {
  height: 3px;
  background: linear-gradient(
      90deg,
      transparent 0%,
      #5fb3b3 20%,
      #a8e6e6 50%,
      #5fb3b3 80%,
      transparent 100%
  );
  margin-top: 16px;
  animation: expandWidth 1s ease-out 0.3s both;
}

.summary {
  font-size: 1.25rem;
  line-height: 2;
  color: #f5f5f5;
  max-width: 800px;
  margin: 0 auto 40px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* 核心指标 */
.core-metrics {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 20px 28px;
  min-width: 140px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s ease-out both;
}

.metric-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.metric-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.metric-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
}

/* ========== 探索卡片区域 ========== */
.exploration-section {
  position: relative;
  padding: 80px 40px 100px;
  background: linear-gradient(to bottom, #f8f5f0 0%, #ebe4d8 100%);
  margin-top: -40px;
  z-index: 4;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.section-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #5fb3b3, #2d7d7d);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6d4c41;
  margin-top: 24px;
  opacity: 0.8;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 探索卡片 */
.exploration-card {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
      0 4px 20px rgba(93, 64, 55, 0.08),
      0 8px 40px rgba(93, 64, 55, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeInScale 0.6s ease-out both;
  border: 1px solid rgba(93, 64, 55, 0.06);
}

.exploration-card:hover {
  transform: translateY(-12px);
  box-shadow:
      0 12px 40px rgba(93, 64, 55, 0.15),
      0 20px 60px rgba(93, 64, 55, 0.08);
}

/* 卡片图片区 */
.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.85) saturate(0.9);
}

.exploration-card:hover .card-image {
  transform: scale(1.08);
  filter: brightness(0.95) saturate(1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(45, 125, 125, 0.1) 0%,
      rgba(30, 80, 80, 0.4) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  font-family: "Georgia", serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 卡片内容区 */
.card-body {
  padding: 32px 28px;
}

.card-title {
  font-size: 1.75rem;
  color: #5d4037;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 1px;
}

.title-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-description {
  font-size: 1rem;
  line-height: 1.9;
  color: #6d5d4c;
  margin-bottom: 28px;
  text-align: justify;
}

.card-footer {
  display: flex;
  justify-content: flex-start;
}

.explore-btn {
  background: linear-gradient(135deg, #5fb3b3 0%, #3d8b8b 100%);
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(95, 179, 179, 0.3);
  letter-spacing: 0.5px;
}

.explore-btn:hover {
  background: linear-gradient(135deg, #6fc5c5 0%, #4d9b9b 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(95, 179, 179, 0.4);
}

.btn-arrow {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.explore-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* ========== 动画 ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* ========== 响应式设计 ========== */
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
  }

  .landmark-title {
    font-size: 3.5rem;
    letter-spacing: 6px;
  }
}

@media (max-width: 768px) {
  .landmark-header {
    height: 60vh;
    min-height: 500px;
  }

  .landmark-title {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }

  .summary {
    font-size: 1.1rem;
  }

  .core-metrics {
    gap: 16px;
  }

  .metric-item {
    min-width: 120px;
    padding: 16px 20px;
  }

  .exploration-section {
    padding: 60px 24px 80px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .section-title {
    font-size: 2rem;
  }

  .back-button {
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .landmark-info {
    padding: 0 24px 40px;
  }

  .landmark-title {
    font-size: 2rem;
    letter-spacing: 2px;
  }

  .summary {
    font-size: 1rem;
  }

  .metric-item {
    min-width: 100px;
    padding: 14px 16px;
  }

  .metric-icon {
    font-size: 2rem;
  }

  .metric-value {
    font-size: 1.2rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-description {
    font-size: 0.95rem;
  }

  .exploration-section {
    padding: 40px 16px 60px;
  }
}

/* ========== 性能优化 ========== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>