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
        <div class="water-ripple"></div>
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
        <p class="section-subtitle">从不同角度了解北海公园的千年历史</p>
      </div>

      <div class="cards-grid">
        <a
            class="exploration-card"
            @click="smoothScrollTo('lifecycle')"
            role="button"
            tabindex="0"
            :style="{ animationDelay: '0.2s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://images.pexels.com/photos/6952131/pexels-photo-6952131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
              生命年轮
            </h3>
            <p class="card-description">
              从兴建到重生的时光之旅，探索{{ landmark.name }}的建筑更迭与功能演变。追溯从辽金到清代千年的营造历程，见证皇家园林如何在历史长河中焕发生机。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </a>

        <a
            class="exploration-card"
            @click="smoothScrollTo('influence')"
            role="button"
            tabindex="0"
            :style="{ animationDelay: '0.3s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://images.pexels.com/photos/6560974/pexels-photo-6560974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="影响力光环预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">02</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">🌟</span>
              影响力光环
            </h3>
            <p class="card-description">
              解析{{ landmark.name }}如何融入当代生活，评估其在全球范围内的文化影响力与认知度。从皇家园林到人民公园，感受这座园林跨越时代的魅力。
            </p>
            <div class="card-footer">
              <button class="explore-btn">
                <span>立即探索</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </a>

        <a
            class="exploration-card"
            @click="smoothScrollTo('legends')"
            role="button"
            tabindex="0"
            :style="{ animationDelay: '0.4s' }"
        >
          <div class="card-image-wrapper">
            <img
                src="https://images.pexels.com/photos/28239133/pexels-photo-28239133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="传奇故事预览"
                class="card-image"
            />
            <div class="card-overlay">
              <div class="card-number">03</div>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">
              <span class="title-icon">📜</span>
              传奇故事
            </h3>
            <p class="card-description">
              聆听{{ landmark.name }}背后那些引人入胜的帝王轶事、民间传说与文人墨客的动人篇章。白塔下的祈愿，琼华岛的传说，每一处都藏着动人的故事。
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
      <section id="lifecycle">
        <LifeCycle />
      </section>
      <section id="influence">
        <Influence />
      </section>
      <section id="legends">
        <Legends />
      </section>
    </div>

    <AppFooter />
    <transition name="fade">
      <button
          v-if="showBackToTopButton"
          @click="scrollToTop"
          class="back-to-top-btn"
          aria-label="返回顶部"
      >
        ↑
      </button>
    </transition>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import LifeCycle from '@/components/BeihaiPark/LifeCycle.vue';
import Influence from '@/components/BeihaiPark/Influence.vue';
import Legends from '@/components/BeihaiPark/Legends.vue';

const router = useRouter();

// 页面数据
const landmark = ref({
  name: "北海公园",
  summary: "中国现存最古老、保存最完整的皇家园林之一，承载千年历史的湖光山色。",
  image: "https://images.pexels.com/photos/7943027/pexels-photo-7943027.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  metrics: [
    { icon: "📅", value: "辽代", label: "始建时期" },
    { icon: "🏞️", value: "69公顷", label: "园区面积" },
    { icon: "⛩️", value: "白塔", label: "地标建筑" },
    { icon: "🚶", value: "百万+", label: "年游客量" },
  ],
});

// 返回主地图页
const goBack = () => {
  router.push("/");
};
const smoothScrollTo = (id) => {
  // 根据传入的id查找对应的section元素
  const element = document.getElementById(id);

  // 如果元素存在
  if (element) {
    // 使用 scrollIntoView 方法，并传入 behavior: 'smooth' 实现平滑滚动
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start' // 滚动结束后，元素的顶部将与视口的顶部对齐
    });
  }
};

const showBackToTopButton = ref(false);

// 定义滚动事件的处理函数
const handleScroll = () => {
  // 当页面垂直滚动距离大于300像素时，显示按钮，否则隐藏
  if (window.scrollY > 300) {
    showBackToTopButton.value = true;
  } else {
    showBackToTopButton.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 使用平滑滚动效果
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 启用平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 为整合进来的内容区域添加一些样式 */
.integrated-content section {
  padding-top: 5rem; /* 提供一些顶部内边距，防止标题被顶部导航栏遮挡 */
  margin-top: -3rem; /* 负外边距抵消部分内边距，让滚动定位更精确 */
}


/* ========== 全局样式 ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.landmark-portal-container {
  font-family: "Noto Serif SC", "Source Han Serif SC", serif;
  color: #1a3a52;
  line-height: 1.7;
  background: linear-gradient(to bottom, #e8f4f8 0%, #d4e9f0 50%, #c0dfe8 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 头部区域 - 水韵风格 ========== */
.landmark-header {
  position: relative;
  width: 100%;
  max-height: 600px;
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
  filter: brightness(0.55) saturate(0.9) contrast(1.05);
}

/* 渐变叠加 - 蓝绿色调 */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(26, 58, 82, 0.35) 0%,
      rgba(44, 82, 110, 0.5) 50%,
      rgba(62, 39, 35, 0.75) 100%
  );
  z-index: 1;
}

/* 水波纹效果 */
.water-ripple {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
      radial-gradient(circle at 20% 50%, rgba(135, 206, 235, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(100, 149, 237, 0.1) 0%, transparent 50%);
  z-index: 2;
  pointer-events: none;
  animation: waterShimmer 8s ease-in-out infinite;
}

@keyframes waterShimmer {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(26, 58, 82, 0.2);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateX(-4px);
  box-shadow: 0 6px 30px rgba(26, 58, 82, 0.3);
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
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.25),
      0 8px 24px rgba(26, 58, 82, 0.5);
  margin: 0;
  animation: fadeInUp 0.8s ease-out;
}

.title-decoration {
  height: 3px;
  background: linear-gradient(
      90deg,
      transparent 0%,
      #87ceeb 20%,
      #e0f2f7 50%,
      #87ceeb 80%,
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
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px 28px;
  min-width: 140px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s ease-out both;
}

.metric-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 40px rgba(26, 58, 82, 0.3);
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
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

/* ========== 探索卡片区域 ========== */
.exploration-section {
  position: relative;
  padding: 80px 40px 100px;
  background: linear-gradient(to bottom, #e8eff8 0%, #d4dff0 100%);
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
  color: #2c5282;
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
  background: linear-gradient(90deg, #6495ed, #4682b4);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #4a7298;
  margin-top: 24px;
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
      0 4px 20px rgba(44, 82, 130, 0.1),
      0 8px 40px rgba(44, 82, 130, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeInScale 0.6s ease-out both;
  border: 1px solid rgba(100, 149, 237, 0.08);
  text-decoration: none;
  color: inherit;
  display: block;
}

.exploration-card:hover {
  transform: translateY(-12px);
  box-shadow:
      0 12px 40px rgba(44, 82, 130, 0.18),
      0 20px 60px rgba(44, 82, 130, 0.1);
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
  filter: brightness(0.85) saturate(0.95);
}

.exploration-card:hover .card-image {
  transform: scale(1.08);
  filter: brightness(0.95) saturate(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(44, 82, 130, 0.15) 0%,
      rgba(44, 82, 130, 0.45) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  font-family: "Georgia", serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 卡片内容区 */
.card-body {
  padding: 32px 28px;
}

.card-title {
  font-size: 1.75rem;
  color: #2c5282;
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
  color: #4a7298;
  margin-bottom: 28px;
  text-align: justify;
}

.card-footer {
  display: flex;
  justify-content: flex-start;
}

.explore-btn {
  background: linear-gradient(135deg, #6495ed 0%, #4682b4 100%);
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
  box-shadow: 0 4px 16px rgba(100, 149, 237, 0.3);
  letter-spacing: 0.5px;
}

.explore-btn:hover {
  background: linear-gradient(135deg, #7aa3f0 0%, #5a93c7 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(100, 149, 237, 0.4);
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

@media (min-width: 3500px) {

  /* 1. 设置 Flexbox 容器 */
  .integrated-content {
    display: flex;
    align-items: flex-start; /* 保持顶部对齐 */
    gap: 2rem;
    padding: 2rem;
  }

  /* 2. 关键：为每个部分（section）设置等宽、固定高度和滚动条 */
  .integrated-content > section {
    flex: 1; /* 让三列平分宽度 */

    /* 核心：设置一个统一的、看起来舒适的高度。
       75vh 表示视窗高度的75%。您可以根据喜好调整这个值 (比如 80vh 或 650px)。
       这将成为所有列的统一高度。
    */
    height: 75vh;

    /* 核心：当内部内容超出上面设定的 75vh 高度时，自动显示垂直滚动条 */
    overflow-y: auto;

    /* 其他样式重置 */
    padding-top: 0;
    margin-top: 0;

    /* (可选) 美化滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: #b3c0cb #f6fbf7;
  }

  .integrated-content > section::-webkit-scrollbar {
    width: 8px;
  }
  .integrated-content > section::-webkit-scrollbar-track {
    background: #f6fbf7;
    border-radius: 4px;
  }
  .integrated-content > section::-webkit-scrollbar-thumb {
    background-color: #b3cbb9;
    border-radius: 4px;
    border: 2px solid #f6fbf7;
  }

  /* 3. 强制覆盖子组件的高度限制，使其能被新容器约束 */
  .integrated-content:deep(.lifecycle-container),
  .integrated-content:deep(.influence-container),
  .integrated-content:deep(.legends-container) {
    /* 移除子组件自身的最小高度，让它们完全受父级 section 的高度控制 */
    min-height: auto;
  }
}
.back-to-top-btn {
  position: fixed; /* 固定定位，不随页面滚动 */
  bottom: 2rem;    /* 距离视窗底部2rem */
  right: 2rem;     /* 距离视窗右侧2rem */
  z-index: 1000;   /* 确保在最上层 */

  width: 50px;       /* 宽度 */
  height: 50px;      /* 高度 */
  border-radius: 50%;/* 变成圆形 */

  background-color: rgba(44, 82, 130, 0.85); /* 半透明背景色 */
  backdrop-filter: blur(5px); /* 毛玻璃效果 */
  color: #fff;       /* 箭头颜色 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 细边框 */

  font-size: 1.5rem; /* 箭头大小 */
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer; /* 鼠标悬浮时显示小手图标 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 添加阴影 */

  transition: all 0.3s ease; /* 所有变化的过渡效果 */
}

.back-to-top-btn:hover {
  background-color: #2c5282; /* 悬浮时背景色加深 */
  transform: translateY(-5px) scale(1.05); /* 向上移动并轻微放大 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Vue transition 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>