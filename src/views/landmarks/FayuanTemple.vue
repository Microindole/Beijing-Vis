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
        <div class="incense-smoke"></div>
      </div>

      <div class="landmark-info">
        <div class="title-wrapper">
          <h1 class="landmark-title">{{ landmark.name }}</h1>
          <div class="title-decoration">
            <span class="lotus-symbol">☸</span>
          </div>
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

    <!-- 导航锚点 -->
    <nav class="content-navigation">
      <a href="#lifecycle" class="nav-link">历史脉络</a>
      <a href="#influence" class="nav-link">佛教传承</a>
      <a href="#legends" class="nav-link">寺庙传说</a>
    </nav>

    <!-- 历史脉络部分 -->
    <section id="lifecycle" class="content-section lifecycle-section">
      <div class="section-intro">
        <div class="section-icon">🏯</div>
        <h2 class="section-main-title">历史脉络</h2>
        <p class="section-description">探索{{ landmark.name }}历经千年沧桑,从唐代兴建到多次摧毁与重建的历史变迁。</p>
      </div>
      <LifeCycle />
    </section>

    <!-- 佛教传承部分 -->
    <section id="influence" class="content-section influence-section">
      <div class="section-intro">
        <div class="section-icon">🪷</div>
        <h2 class="section-main-title">佛教传承</h2>
        <p class="section-description">洞察{{ landmark.name }}作为佛教圣地,在中国乃至亚洲佛教文化中的重要地位。</p>
      </div>
      <Influence />
    </section>

    <!-- 寺庙传说部分 -->
    <section id="legends" class="content-section legends-section">
      <div class="section-intro">
        <div class="section-icon">📿</div>
        <h2 class="section-main-title">寺庙传说</h2>
        <p class="section-description">聆听{{ landmark.name }}的神秘传说、高僧故事以及与历史名人的渊源。</p>
      </div>
      <Legends />
    </section>

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue';
import LifeCycle from '../../components/fayuan-temple/LifeCycle.vue';
import Influence from '../../components/fayuan-temple/Influence.vue';
import Legends from '../../components/fayuan-temple/Legends.vue';

export default {
  name: "FayuanTemplePortal",
  components: {
    AppFooter,
    LifeCycle,
    Influence,
    Legends
  },
  props: {
    landmarkId: {
      type: String,
      required: true,
      default: "fayuantemple",
    },
  },
  data() {
    return {
      landmark: {},
    };
  },
  created() {
    this.loadLandmarkData();
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    loadLandmarkData() {
      if (this.landmarkId === "fayuantemple") {
        this.landmark = {
          name: "法源寺",
          summary: "北京最古老的佛教寺庙之一,唐代古刹,佛教文化传承的圣地,承载着千年的历史与佛教智慧。",
          image: "https://static.bjd.com.cn/dams-res/editing/image/202312/28/658cf72bd5deca83f8f04c24.jpeg",
          metrics: [
            {icon: "📅", value: "唐贞观年间", label: "始建时期"},
            {icon: "📏", value: "2.3万㎡", label: "寺院面积"},
            {icon: "🅰", value: "国家级", label: "文保单位"},
            {icon: "🚶", value: "50万+", label: "年均客流"},
          ],
        };
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
  color: #3e2723;
  line-height: 1.7;
  background: linear-gradient(to bottom, #f5f0e8 0%, #e8dfd5 50%, #d9cfc0 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 头部区域 - 禅意古朴风格 ========== */
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
  filter: brightness(0.5) saturate(0.75) sepia(0.2) contrast(1.1);
}

/* 渐变叠加 - 褐色古朴色调 */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(62, 39, 35, 0.4) 0%,
      rgba(93, 64, 55, 0.55) 50%,
      rgba(62, 39, 35, 0.8) 100%
  );
  z-index: 1;
}

/* 香烟袅袅效果 */
.incense-smoke {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 60%, rgba(255, 245, 230, 0.08) 0%, transparent 40%),
  radial-gradient(ellipse at 70% 40%, rgba(245, 235, 220, 0.06) 0%, transparent 40%);
  z-index: 2;
  pointer-events: none;
  animation: smokeRise 12s ease-in-out infinite;
}

@keyframes smokeRise {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-20px);
  }
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: rgba(62, 39, 35, 0.6);
  backdrop-filter: blur(12px);
  color: #f5e6d3;
  border: 1px solid rgba(212, 167, 106, 0.3);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(62, 39, 35, 0.3);
}

.back-button:hover {
  background: rgba(93, 64, 55, 0.75);
  transform: translateX(-4px);
  box-shadow: 0 6px 30px rgba(62, 39, 35, 0.4);
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
  letter-spacing: 12px;
  color: #f5e6d3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5),
  0 4px 12px rgba(0, 0, 0, 0.3),
  0 8px 24px rgba(62, 39, 35, 0.6);
  margin: 0;
  animation: fadeInUp 0.8s ease-out;
}

.title-decoration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.lotus-symbol {
  font-size: 2rem;
  color: #d4a76a;
  filter: drop-shadow(0 2px 8px rgba(212, 167, 106, 0.6));
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.summary {
  font-size: 1.25rem;
  line-height: 2;
  color: #f5f5f5;
  max-width: 800px;
  margin: 0 auto 40px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
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
  background: rgba(62, 39, 35, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 167, 106, 0.25);
  border-radius: 16px;
  padding: 20px 28px;
  min-width: 140px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s ease-out both;
}

.metric-item:hover {
  background: rgba(93, 64, 55, 0.5);
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 40px rgba(62, 39, 35, 0.4);
}

.metric-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5e6d3;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.metric-label {
  font-size: 0.9rem;
  color: rgba(245, 230, 211, 0.9);
  font-weight: 400;
}

/* ========== 导航锚点 ========== */
.content-navigation {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #8b6914 0%, #6d5310 100%);
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(62, 39, 35, 0.3);
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.nav-link {
  color: #f5e6d3;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 10px 24px;
  border-radius: 50px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(245, 230, 211, 0.3);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ========== 内容区域 ========== */
.content-section {
  padding: 80px 40px;
  background: linear-gradient(to bottom, #f5f0e8 0%, #e8dfd5 100%);
  margin-bottom: 0;
}

.content-section:nth-child(even) {
  background: linear-gradient(to bottom, #e8dfd5 0%, #d9cfc0 100%);
}

.section-intro {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.section-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 2px 8px rgba(139, 105, 20, 0.3));
}

.section-main-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  position: relative;
  display: inline-block;
}

.section-main-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #8b6914, #d4a76a);
  border-radius: 2px;
}

.section-description {
  font-size: 1.1rem;
  color: #6d5d4c;
  margin-top: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ========== 响应式设计 ========== */
@media (max-width: 1200px) {
  .landmark-title {
    font-size: 3.5rem;
    letter-spacing: 8px;
  }
}

@media (max-width: 768px) {
  .landmark-header {
    height: 60vh;
    min-height: 500px;
  }

  .landmark-title {
    font-size: 2.5rem;
    letter-spacing: 6px;
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

  .content-section {
    padding: 60px 24px;
  }

  .section-main-title {
    font-size: 2rem;
  }

  .back-button {
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    font-size: 0.95rem;
  }

  .content-navigation {
    gap: 20px;
  }

  .nav-link {
    font-size: 1rem;
    padding: 8px 20px;
  }
}

@media (max-width: 480px) {
  .landmark-info {
    padding: 0 24px 40px;
  }

  .landmark-title {
    font-size: 2rem;
    letter-spacing: 4px;
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

  .content-section {
    padding: 40px 16px;
  }

  .section-main-title {
    font-size: 1.75rem;
  }

  .content-navigation {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }

  .nav-link {
    width: 100%;
    text-align: center;
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

/* ========== 子组件容器样式重置 ========== */
.lifecycle-section :deep(.lifecycle-container),
.influence-section :deep(.dashboard-container),
.legends-section :deep(.legends-container) {
  background: transparent;
  padding: 0;
  min-height: auto;
}

.lifecycle-section :deep(.lifecycle-header),
.influence-section :deep(.dashboard-header),
.legends-section :deep(.legends-header) {
  display: none;
}

.lifecycle-section :deep(.back-button),
.influence-section :deep(.back-button),
.legends-section :deep(.back-button) {
  display: none;
}

.lifecycle-section :deep(.lifecycle-footer),
.influence-section :deep(.dashboard-footer) {
  border-top: 1px solid rgba(139, 105, 20, 0.2);
  background: transparent;
  margin-top: 40px;
}
</style>