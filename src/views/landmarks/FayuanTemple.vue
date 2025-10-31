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

    <section class="exploration-section">
      <div class="section-header">
        <div class="zen-decoration">
          <span class="zen-circle">◯</span>
        </div>
        <h2 class="section-title">探索维度</h2>
        <p class="section-subtitle">从不同角度了解法源寺的千年佛韵</p>
      </div>

      <div class="cards-grid">
        <a class="exploration-card" @click="smoothScrollTo('lifecycle')" role="button" tabindex="0" :style="{ animationDelay: '0.2s' }">
          <div class="card-image-wrapper">
            <img
                src="https://img.redocn.com/sheying/20170117/huisechuanghu_7787113.jpg"
                alt="历史脉络预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">01</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🏯</span>
              历史脉络
            </h3>
            <p class="card-description">
              探索{{ landmark.name }}历经千年沧桑，从唐代兴建到多次摧毁与重建的历史变迁。见证这座古刹如何在岁月长河中屹立不倒，传承佛法智慧，成为北京最古老的佛教圣地之一。
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
            <img
                src="https://static.bjd.com.cn/dams-res/editing/image/202312/28/658cf72ad5de9bf2815d9190.jpeg"
                alt="佛教传承预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">02</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🪷</span>
              佛教传承
            </h3>
            <p class="card-description">
              洞察{{ landmark.name }}作为佛教圣地，在中国乃至亚洲佛教文化中的重要地位。探讨其作为中国佛学院所在地，如何培养僧才、传播佛法，成为当代佛教教育的重要基地。
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
            <img
                src="https://tse2-mm.cn.bing.net/th/id/OIP-C.DY1qPNPNaRYckAiLTIEyxAHaNK?r=0&rs=1&pid=ImgDetMain"
                alt="寺庙传说预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">03</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">📿</span>
              寺庙传说
            </h3>
            <p class="card-description">
              聆听{{ landmark.name }}的神秘传说、高僧故事以及与历史名人的渊源。从唐太宗悯忠建寺的初衷，到历代高僧大德的修行故事，感受这座千年古刹的佛法传奇与禅意人生。
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
import LifeCycle from '@/components/fayuan-temple/LifeCycle.vue';
import Influence from '@/components/fayuan-temple/Influence.vue';
import Legends from '@/components/fayuan-temple/Legends.vue';

const router = useRouter();

const landmark = ref({
  name: "法源寺",
  summary: "北京最古老的佛教寺庙之一,唐代古刹,佛教文化传承的圣地,承载着千年的历史与佛教智慧。",
  image: "https://static.bjd.com.cn/dams-res/editing/image/202312/28/658cf72bd5deca83f8f04c24.jpeg",
  metrics: [
    {icon: "📅", value: "唐贞观年间", label: "始建时期"},
    {icon: "📐", value: "2.3万㎡", label: "寺院面积"},
    {icon: "🏅", value: "国家级", label: "文保单位"},
    {icon: "🚶", value: "50万+", label: "年均客流"},
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
  background:
      radial-gradient(ellipse at 30% 60%, rgba(255, 245, 230, 0.08) 0%, transparent 40%),
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
  text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.5),
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
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
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

/* ========== 探索卡片区域 ========== */
.exploration-section {
  position: relative;
  padding: 80px 40px 100px;
  background: linear-gradient(to bottom, #f5f0e8 0%, #e8dfd5 100%);
  margin-top: -40px;
  z-index: 4;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.zen-decoration {
  margin-bottom: 20px;
}

.zen-circle {
  font-size: 3rem;
  color: #8b6914;
  opacity: 0.4;
  animation: zenRotate 20s linear infinite;
}

@keyframes zenRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.section-title {
  font-size: 2.5rem;
  color: #5d4037;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  position: relative;
  display: inline-block;
}

.section-title::after {
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

.section-subtitle {
  font-size: 1.1rem;
  color: #6d5d4c;
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
      0 4px 20px rgba(93, 64, 55, 0.12),
      0 8px 40px rgba(93, 64, 55, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeInScale 0.6s ease-out both;
  border: 1px solid rgba(139, 105, 20, 0.1);
}

.exploration-card:hover {
  transform: translateY(-12px);
  box-shadow:
      0 12px 40px rgba(93, 64, 55, 0.2),
      0 20px 60px rgba(93, 64, 55, 0.12);
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
  filter: brightness(0.8) saturate(0.85) sepia(0.15);
}

.exploration-card:hover .card-image {
  transform: scale(1.08);
  filter: brightness(0.9) saturate(0.95) sepia(0.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(93, 64, 55, 0.2) 0%,
      rgba(62, 39, 35, 0.5) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(245, 230, 211, 0.5);
  font-family: "Georgia", serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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
  letter-spacing: 2px;
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
  background: linear-gradient(135deg, #8b6914 0%, #6d5310 100%);
  color: #f5e6d3;
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
  box-shadow: 0 4px 16px rgba(139, 105, 20, 0.3);
  letter-spacing: 0.5px;
}

.explore-btn:hover {
  background: linear-gradient(135deg, #a67c1a 0%, #8b6914 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(139, 105, 20, 0.4);
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
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
  }

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

  .card-title {
    font-size: 1.5rem;
    letter-spacing: 1px;
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
    border: 1px solid #d9cfc0;
    border-radius: 16px;
    background: #f5f0e8;
    scrollbar-width: thin;
    scrollbar-color: #d4a76a #f5f0e8;
  }
  .integrated-content > section::-webkit-scrollbar { width: 8px; }
  .integrated-content > section::-webkit-scrollbar-track { background: #f5f0e8; border-radius: 4px; }
  .integrated-content > section::-webkit-scrollbar-thumb { background-color: #d4a76a; border-radius: 4px; border: 2px solid #f5f0e8; }

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
  background-color: rgba(93, 64, 55, 0.85); /* 法源寺主题色 */
  backdrop-filter: blur(5px); color: #f5e6d3;
  border: 1px solid rgba(245, 230, 211, 0.4);
  font-size: 1.5rem; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.back-to-top-btn:hover {
  background-color: #5D4037;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>