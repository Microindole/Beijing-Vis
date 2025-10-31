<template>
  <div class="landmark-portal-container">
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

    <section class="exploration-section">
      <div class="section-header">
        <h2 class="section-title">探索维度</h2>
        <p class="section-subtitle">从不同角度了解大栅栏的历史与文化</p>
      </div>

      <div class="cards-grid">
        <a class="exploration-card" @click="smoothScrollTo('lifecycle')" role="button" tabindex="0" :style="{ animationDelay: '0.2s' }">
          <div class="card-image-wrapper">
            <img :src="oldDashilanImage" alt="街巷记忆预览" class="card-image" />
            <div class="card-overlay">
              <div class="card-number">01</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🏛️</span>
              街巷记忆
            </h3>
            <p class="card-description">
              从明代廊房的初兴，到清末民初的商铺林立与几经兴废，再到当代的保护性修缮与风貌重现。一同探寻大栅栏这条百年老街在时光流转中的建筑格局、市井风貌与功能角色的演变轨迹。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </a>

        <a class="exploration-card" @click="smoothScrollTo('influence')" role="button" tabindex="0" :style="{ animationDelay: '0.3s' }">
          <div class="card-image-wrapper">
            <img :src="tongRenTangImage" alt="商韵流传预览" class="card-image" />
            <div class="card-overlay">
              <div class="card-number">02</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🏪</span>
              商韵流传
            </h3>
            <p class="card-description">
              解读大栅栏作为京城重要商贸枢纽的历史地位，品味老字号的百年商誉与京味商业文化。评估其在当代如何延续商业活力，吸引八方来客，并在城市发展中焕发新的光彩。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </a>

        <a class="exploration-card" @click="smoothScrollTo('legends')" role="button" tabindex="0" :style="{ animationDelay: '0.4s' }">
          <div class="card-image-wrapper">
            <img :src="dashilanStoryImage" alt="坊间拾趣预览" class="card-image" />
            <div class="card-overlay">
              <div class="card-number">03</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">📖</span>
              坊间拾趣
            </h3>
            <p class="card-description">
              漫步大栅栏，聆听那些流传于街头巷尾的奇闻轶事、梨园往事与民俗风情。从义和团的烽火到"大观楼"的首映光影，从"大石烂儿"的读音传说到元宵灯会的市井喧嚣，拾取那些生动鲜活的地标故事。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </a>
      </div>
    </section>

    <div class="integrated-content">
      <section id="lifecycle"><LifeCycle /></section>
      <section id="influence"><Influence /></section>
      <section id="legends"><Legends /></section>
    </div>

    <AppFooter />

    <transition name="fade">
      <button v-if="showBackToTopButton" @click="scrollToTop" class="back-to-top-btn" aria-label="返回顶部">↑</button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import LifeCycle from '@/components/dashilan/LifeCycle.vue';
import Influence from '@/components/dashilan/Influence.vue';
import Legends from '@/components/dashilan/Legends.vue';
import DashilarBackgroundImage from "../../assets/dashilan/dashilan_bg.jpg";
import oldDashilanImage from "../../assets/dashilan/olddashilan.jpg";
import tongRenTangImage from "../../assets/dashilan/TongRenTang.jpg";
import dashilanStoryImage from "../../assets/dashilan/dashilan_story.jpg";

const router = useRouter();

const landmark = ref({
  name: "大栅栏",
  summary: "北京著名的百年商业老街，京味文化与市井生活的鲜活画卷，承载着丰富的历史记忆与民国风情。",
  image: DashilarBackgroundImage,
  metrics: [
    { icon: "📅", value: "明代初", label: "始建时期" },
    { icon: "📏", value: "275米", label: "街道长度" },
    { icon: "🏅", value: "国家级", label: "历史街区" },
    { icon: "🚶", value: "15万+", label: "日均客流" },
  ],
});

const goBack = () => {
  router.push("/");
};

const smoothScrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 返回顶部按钮逻辑
const showBackToTopButton = ref(false);
const handleScroll = () => {
  showBackToTopButton.value = window.scrollY > 300;
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
.integrated-content section {
  padding-top: 5rem;
  margin-top: -3rem;
}
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
      rgba(139, 69, 19, 0.3) 0%,
      rgba(101, 67, 33, 0.5) 50%,
      rgba(62, 39, 35, 0.8) 100%
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
      0 8px 24px rgba(101, 67, 33, 0.4);
  margin: 0;
  animation: fadeInUp 0.8s ease-out;
}

.title-decoration {
  height: 3px;
  background: linear-gradient(
      90deg,
      transparent 0%,
      #d4a76a 20%,
      #f5e6d3 50%,
      #d4a76a 80%,
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
  background: linear-gradient(90deg, #d4a76a, #8b4513);
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
      rgba(93, 64, 55, 0.1) 0%,
      rgba(93, 64, 55, 0.4) 100%
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
  background: linear-gradient(135deg, #d4a76a 0%, #b8935a 100%);
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
  box-shadow: 0 4px 16px rgba(212, 167, 106, 0.3);
  letter-spacing: 0.5px;
}

.explore-btn:hover {
  background: linear-gradient(135deg, #e0b87a 0%, #c49f6a 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(212, 167, 106, 0.4);
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
.landmark-header {
  max-height: 700px;
}

/* 2. 宽屏/缩放 水平滚动布局 */
@media (min-width: 3500px) {
  .integrated-content {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem;
  }
  .integrated-content > section {
    flex: 1;
    height: 75vh;
    overflow-y: auto;
    padding-top: 0;
    margin-top: 0;
    border: 1px solid #e0d5c7;
    border-radius: 16px;
    background: #f8f5f0;
    scrollbar-width: thin;
    scrollbar-color: #d4a76a #f8f5f0;
  }
  .integrated-content > section::-webkit-scrollbar { width: 8px; }
  .integrated-content > section::-webkit-scrollbar-track { background: #f8f5f0; border-radius: 4px; }
  .integrated-content > section::-webkit-scrollbar-thumb { background-color: #d4a76a; border-radius: 4px; border: 2px solid #f8f5f0; }

  .integrated-content:deep(.lifecycle-container),
  .integrated-content:deep(.dashboard-container),
  .integrated-content:deep(.legends-container) {
    min-height: auto;
  }
  .integrated-content:deep(.main-visualization) {
    flex-direction: column;
  }
}

/* 3. 返回顶部按钮样式 */
.back-to-top-btn {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
  width: 50px; height: 50px; border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.85); /* 大栅栏主题色 */
  backdrop-filter: blur(5px); color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.back-to-top-btn:hover {
  background-color: #8B4513;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>