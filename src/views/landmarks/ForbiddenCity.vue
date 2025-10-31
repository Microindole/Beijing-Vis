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
        <div class="imperial-pattern"></div>
      </div>

      <div class="landmark-info">
        <div class="title-wrapper">
          <div class="dragon-decoration left">🐉</div>
          <h1 class="landmark-title">{{ landmark.name }}</h1>
          <div class="dragon-decoration right">🐉</div>
        </div>
        <div class="imperial-seal">
          <span class="seal-text">紫禁城</span>
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
        <div class="imperial-ornament">
          <span class="ornament-left">❖</span>
          <h2 class="section-title">探索维度</h2>
          <span class="ornament-right">❖</span>
        </div>
        <p class="section-subtitle">从不同角度了解紫禁城的辉煌历史</p>
      </div>

      <div class="cards-grid">
        <a class="exploration-card" @click="smoothScrollTo('lifecycle')" role="button" tabindex="0" :style="{ animationDelay: '0.2s' }">
          <div class="card-image-wrapper">
            <img src="https://img95.699pic.com/photo/50061/9614.jpg_wh860.jpg" alt="生命年轮预览" class="card-image" />
            <div class="card-overlay"><div class="card-number">壹</div></div>
          </div>
          <div class="card-body">
            <h3 class="card-title"><span class="title-icon">🏛️</span>生命年轮</h3>
            <p class="card-description">从兴建到重生的时光之旅，探索{{ landmark.name }}的建筑更迭与功能演变。追溯从明永乐年间到现代博物院的六百年历程，见证皇家宫殿如何从权力中心转变为文化瑰宝。</p>
            <div class="card-footer"><button class="explore-btn"><span>立即探索</span><span class="btn-arrow">→</span></button></div>
          </div>
        </a>

        <a class="exploration-card" @click="smoothScrollTo('influence')" role="button" tabindex="0" :style="{ animationDelay: '0.3s' }">
          <div class="card-image-wrapper">
            <img src="https://pic1.zhimg.com/v2-05a97426ce2ae46268d80e881c47c204_b.jpg" alt="影响力光环预览" class="card-image" />
            <div class="card-overlay"><div class="card-number">贰</div></div>
          </div>
          <div class="card-body">
            <h3 class="card-title"><span class="title-icon">👑</span>影响力光环</h3>
            <p class="card-description">解析{{ landmark.name }}如何融入当代生活，评估其在全球范围内的文化影响力与认知度。从世界遗产到文化IP，探讨这座宫殿如何持续散发着跨越时代的文化魅力与艺术价值。</p>
            <div class="card-footer"><button class="explore-btn"><span>立即探索</span><span class="btn-arrow">→</span></button></div>
          </div>
        </a>

        <a class="exploration-card" @click="smoothScrollTo('legends')" role="button" tabindex="0" :style="{ animationDelay: '0.4s' }">
          <div class="card-image-wrapper">
            <img src="https://5b0988e595225.cdn.sohucs.com/images/20190613/bb4258e15195469ba1be8c62c1a85b4b.jpeg" alt="传奇故事预览" class="card-image" />
            <div class="card-overlay"><div class="card-number">叁</div></div>
          </div>
          <div class="card-body">
            <h3 class="card-title"><span class="title-icon">📜</span>传奇故事</h3>
            <p class="card-description">聆听{{ landmark.name }}背后那些引人入胜的帝王轶事、民间传说与文人墨客的动人篇章。从紫禁城的神秘传说到皇家秘史，探寻那些隐藏在红墙黄瓦之下的历史真相与动人故事。</p>
            <div class="card-footer"><button class="explore-btn"><span>立即探索</span><span class="btn-arrow">→</span></button></div>
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
import { ref ,onMounted,onBeforeUnmount} from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import LifeCycle from '@/components/forbidden-city/LifeCycle.vue';
import Influence from '@/components/forbidden-city/Influence.vue';
import Legends from '@/components/forbidden-city/Legends.vue';

const router = useRouter();

const landmark = ref({
  name: "故宫",
  summary: "世界五大宫之首，明清两代的皇家宫殿，中国古代宫廷建筑之精华。",
  image: "https://www.shuomingshu.cn/wp-content/uploads/images/2022/12/02/a382daee878049f2969575e60d9f2464_vgf1x4cfjcj.jpg",
  metrics: [
    { icon: "👑", value: "24位", label: "明清帝王" },
    { icon: "🏮", value: "8707间", label: "殿宇房舍" },
    { icon: "🟥", value: "72万㎡", label: "占地面积" },
    { icon: "🐉", value: "600年", label: "紫禁风云" },
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

const showBackToTopButton = ref(false);
const handleScroll = () => { showBackToTopButton.value = window.scrollY > 300; };
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

onMounted(() => window.addEventListener('scroll', handleScroll));
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll));
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
  color: #4a1a0a;
  line-height: 1.7;
  background: linear-gradient(to bottom, #fef5e7 0%, #f9e8d0 50%, #f0ddc0 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 头部区域 - 皇家气派风格 ========== */
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
  filter: brightness(0.5) saturate(1.1) contrast(1.15);
}

/* 渐变叠加 - 皇家红金色调 */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(139, 0, 0, 0.3) 0%,
      rgba(178, 34, 34, 0.5) 50%,
      rgba(74, 26, 10, 0.8) 100%
  );
  z-index: 1;
}

/* 皇家纹样效果 */
.imperial-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
      repeating-linear-gradient(
          0deg,
          transparent,
          transparent 100px,
          rgba(218, 165, 32, 0.03) 100px,
          rgba(218, 165, 32, 0.03) 102px
      ),
      repeating-linear-gradient(
          90deg,
          transparent,
          transparent 100px,
          rgba(218, 165, 32, 0.03) 100px,
          rgba(218, 165, 32, 0.03) 102px
      );
  z-index: 2;
  pointer-events: none;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: rgba(139, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(139, 0, 0, 0.4);
}

.back-button:hover {
  background: rgba(178, 34, 34, 0.8);
  transform: translateX(-4px);
  box-shadow: 0 6px 30px rgba(139, 0, 0, 0.5);
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.dragon-decoration {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.6));
  animation: dragonFloat 4s ease-in-out infinite;
}

.dragon-decoration.left {
  animation-delay: 0s;
}

.dragon-decoration.right {
  animation-delay: 2s;
  transform: scaleX(-1);
}

@keyframes dragonFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.landmark-title {
  font-size: 5rem;
  font-weight: 700;
  letter-spacing: 16px;
  color: #ffd700;
  text-shadow:
      0 0 20px rgba(255, 215, 0, 0.8),
      0 2px 4px rgba(0, 0, 0, 0.5),
      0 4px 12px rgba(139, 0, 0, 0.6);
  margin: 0;
}

/* 皇家印章装饰 */
.imperial-seal {
  display: inline-block;
  background: rgba(178, 34, 34, 0.9);
  border: 3px solid #ffd700;
  border-radius: 8px;
  padding: 8px 20px;
  margin-bottom: 24px;
  box-shadow:
      0 0 20px rgba(255, 215, 0, 0.5),
      inset 0 0 10px rgba(255, 215, 0, 0.2);
  animation: fadeIn 1s ease-out 0.3s both;
}

.seal-text {
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: 700;
  letter-spacing: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.summary {
  font-size: 1.25rem;
  line-height: 2;
  color: #fff;
  max-width: 800px;
  margin: 0 auto 40px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
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
  background: rgba(139, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 20px 28px;
  min-width: 140px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s ease-out both;
}

.metric-item:hover {
  background: rgba(178, 34, 34, 0.7);
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.4);
}

.metric-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.metric-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
}

/* ========== 探索卡片区域 ========== */
.exploration-section {
  position: relative;
  padding: 80px 40px 100px;
  background: linear-gradient(to bottom, #fef5e7 0%, #f9e8d0 100%);
  margin-top: -40px;
  z-index: 4;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out;
}

.imperial-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.ornament-left,
.ornament-right {
  font-size: 2rem;
  color: #b8860b;
  animation: ornamentPulse 3s ease-in-out infinite;
}

.ornament-right {
  animation-delay: 1.5s;
}

@keyframes ornamentPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.section-title {
  font-size: 2.5rem;
  color: #8b0000;
  font-weight: 600;
  letter-spacing: 6px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #a0522d;
  margin-top: 16px;
  opacity: 0.85;
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
      0 4px 20px rgba(139, 0, 0, 0.12),
      0 8px 40px rgba(139, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeInScale 0.6s ease-out both;
  border: 2px solid rgba(218, 165, 32, 0.2);
}

.exploration-card:hover {
  transform: translateY(-12px);
  box-shadow:
      0 12px 40px rgba(139, 0, 0, 0.2),
      0 20px 60px rgba(218, 165, 32, 0.15);
  border-color: rgba(218, 165, 32, 0.5);
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
  filter: brightness(0.85) saturate(1.1);
}

.exploration-card:hover .card-image {
  transform: scale(1.08);
  filter: brightness(0.95) saturate(1.2);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(139, 0, 0, 0.2) 0%,
      rgba(139, 0, 0, 0.5) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 215, 0, 0.6);
  font-family: "Noto Serif SC", serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* 卡片内容区 */
.card-body {
  padding: 32px 28px;
}

.card-title {
  font-size: 1.75rem;
  color: #8b0000;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 2px;
}

.title-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(139, 0, 0, 0.2));
}

.card-description {
  font-size: 1rem;
  line-height: 1.9;
  color: #5d4037;
  margin-bottom: 28px;
  text-align: justify;
}

.card-footer {
  display: flex;
  justify-content: flex-start;
}

.explore-btn {
  background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
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
  box-shadow: 0 4px 16px rgba(218, 165, 32, 0.4);
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.explore-btn:hover {
  background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(218, 165, 32, 0.5);
  border-color: rgba(255, 215, 0, 0.6);
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
    font-size: 4rem;
    letter-spacing: 12px;
  }

  .dragon-decoration {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .landmark-header {
    height: 60vh;
    min-height: 500px;
  }

  .landmark-title {
    font-size: 3rem;
    letter-spacing: 8px;
  }

  .dragon-decoration {
    font-size: 2rem;
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
    letter-spacing: 4px;
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
    font-size: 2.2rem;
    letter-spacing: 4px;
  }

  .dragon-decoration {
    font-size: 1.5rem;
    gap: 12px;
  }

  .title-wrapper {
    gap: 12px;
  }

  .imperial-seal {
    padding: 6px 16px;
  }

  .seal-text {
    font-size: 1rem;
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
.landmark-header { max-height: 700px; }
@media (min-width: 3500px) {
  .integrated-content { display: flex; align-items: flex-start; gap: 2rem; padding: 2rem; }
  .integrated-content > section {
    flex: 1; height: 75vh; overflow-y: auto; padding-top: 0; margin-top: 0;
    border: 1px solid #f0ddc0; border-radius: 16px; background: #fef5e7;
    scrollbar-width: thin; scrollbar-color: #d4a76a #fef5e7;
  }
  .integrated-content > section::-webkit-scrollbar { width: 8px; }
  .integrated-content > section::-webkit-scrollbar-track { background: #fef5e7; border-radius: 4px; }
  .integrated-content > section::-webkit-scrollbar-thumb { background-color: #d4a76a; border-radius: 4px; border: 2px solid #fef5e7; }
  .integrated-content:deep(.lifecycle-container),
  .integrated-content:deep(.dashboard-container),
  .integrated-content:deep(.legends-container) { min-height: auto; }
  .integrated-content:deep(.main-visualization) { flex-direction: column; }
}
.back-to-top-btn {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
  width: 50px; height: 50px; border-radius: 50%;
  background-color: rgba(139, 0, 0, 0.85);
  backdrop-filter: blur(5px); color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
  font-size: 1.5rem; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.back-to-top-btn:hover {
  background-color: #8B0000;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>