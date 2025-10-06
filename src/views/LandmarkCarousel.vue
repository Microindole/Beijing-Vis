<template>
  <div class="landmark-carousel">
    <div class="carousel-content">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentLandmark.id" class="carousel-item">
          <div class="image-container">
            <img
                :src="currentLandmark.image"
                :alt="currentLandmark.name"
                class="landmark-image"
            />
            <div class="image-overlay"></div>
          </div>
          <div class="content-area">
            <h4 class="landmark-title">{{ currentLandmark.name }}</h4>
            <p class="landmark-description">{{ currentLandmark.description }}</p>
            <button @click="viewDetails(currentLandmark)" class="details-button">
              <span class="button-text">查看详情</span>
              <span class="button-icon">→</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
    <div class="carousel-nav">
      <button @click="prevLandmark" class="nav-button prev-button" aria-label="上一个">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="dots">
        <button
            v-for="(landmark, index) in landmarks"
            :key="landmark.id"
            :class="{ dot: true, active: index === currentIndex }"
            @click="goToLandmark(index)"
            :aria-label="`跳转到 ${landmark.name}`"
        >
          <span class="dot-inner"></span>
        </button>
      </div>
      <button @click="nextLandmark" class="nav-button next-button" aria-label="下一个">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    landmarks: {
      type: Array,
      required: true,
    },
    initialLandmarkId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentIndex: 0,
      intervalId: null,
      progressWidth: 0,
      progressIntervalId: null,
      autoPlayDuration: 5000,
    };
  },
  computed: {
    currentLandmark() {
      return this.landmarks[this.currentIndex] || {};
    },
  },
  watch: {
    initialLandmarkId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          const index = this.landmarks.findIndex(
              (landmark) => landmark.id === newId
          );
          if (index !== -1 && index !== this.currentIndex) {
            this.goToLandmark(index);
          }
        }
      },
    },
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeUnmount() {
    this.stopAutoPlay();
    this.stopProgress();
  },
  methods: {
    nextLandmark() {
      this.stopAutoPlay();
      this.currentIndex = (this.currentIndex + 1) % this.landmarks.length;
      this.startAutoPlay();
    },
    prevLandmark() {
      this.stopAutoPlay();
      this.currentIndex =
          (this.currentIndex - 1 + this.landmarks.length) %
          this.landmarks.length;
      this.startAutoPlay();
    },
    goToLandmark(index) {
      this.stopAutoPlay();
      this.currentIndex = index;
      this.startAutoPlay();
    },
    startAutoPlay() {
      this.stopAutoPlay();
      this.startProgress();
      this.intervalId = setInterval(() => {
        this.nextLandmark();
      }, this.autoPlayDuration);
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.stopProgress();
    },
    startProgress() {
      this.progressWidth = 0;
      this.stopProgress();
      const intervalTime = 50;
      const increment = (intervalTime / this.autoPlayDuration) * 100;
      this.progressIntervalId = setInterval(() => {
        this.progressWidth += increment;
        if (this.progressWidth >= 100) {
          this.progressWidth = 100;
          this.stopProgress();
        }
      }, intervalTime);
    },
    stopProgress() {
      if (this.progressIntervalId) {
        clearInterval(this.progressIntervalId);
        this.progressIntervalId = null;
      }
    },
    viewDetails(landmark) {
      this.$emit("view-details", landmark);
    },
  },
};
</script>

<style scoped>
.landmark-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(to bottom, #fafaf9, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.06),
      0 2px 8px rgba(0, 0, 0, 0.04),
        /* 边缘虚化效果 - 内阴影渐变遮罩 */
      inset 0 0 40px rgba(250, 250, 249, 0.6),
      inset 0 0 20px rgba(255, 255, 255, 0.4);
}

/* 边缘虚化遮罩层 */
.landmark-carousel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
  border-radius: 16px;
  background:
    /* 上边缘虚化 */
      linear-gradient(to bottom,
      rgba(250, 250, 249, 0.5) 0%,
      transparent 8%
      ),
        /* 下边缘虚化 */
      linear-gradient(to top,
      rgba(250, 250, 249, 0.5) 0%,
      transparent 8%
      ),
        /* 左边缘虚化 */
      linear-gradient(to right,
      rgba(250, 250, 249, 0.4) 0%,
      transparent 5%
      ),
        /* 右边缘虚化 */
      linear-gradient(to left,
      rgba(250, 250, 249, 0.4) 0%,
      transparent 5%
      );
}

.carousel-content {
  width: 100%;
  min-height: 380px;
  position: relative;
  overflow: hidden;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  position: relative;
}

.image-container {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f4 0%, #e7e7e5 100%);
}

.landmark-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-item:hover .landmark-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.content-area {
  padding: 24px 28px 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.landmark-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.landmark-description {
  font-size: 15px;
  color: #525252;
  line-height: 1.6;
  margin: 0 0 20px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-button {
  align-self: flex-start;
  /* 修改：背景渐变改为柔和的米色系 */
  background: linear-gradient(135deg, #F6F3ED 0%, #EAE5D9 100%);
  /* 修改：文字颜色改为深棕色以保证对比度 */
  color: #5D4037;
  padding: 11px 20px;
  border: none;
  /* 修改：增加圆角使其更柔和 */
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  /* 修改：柔和的阴影效果 */
  box-shadow:
      0 2px 8px rgba(139, 69, 19, 0.08),
      0 1px 3px rgba(139, 69, 19, 0.05);
  position: relative;
  overflow: hidden;
  /* 新增：添加细边框增加质感 */
  border: 1px solid rgba(212, 167, 106, 0.3);
}
.details-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.details-button:hover {
  background: linear-gradient(135deg, #EAE5D9 0%, #DDD6C7 100%);
  box-shadow:
      0 4px 12px rgba(139, 69, 19, 0.12),
      0 2px 6px rgba(139, 69, 19, 0.08);
  transform: translateY(-1px);
  border-color: rgba(212, 167, 106, 0.5);
}

.details-button:hover::before {
  opacity: 1;
}

.details-button:active {
  transform: translateY(0);
  box-shadow:
      0 1px 4px rgba(139, 69, 19, 0.1),
      0 1px 2px rgba(139, 69, 19, 0.06);
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-icon {
  position: relative;
  z-index: 1;
  font-size: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.details-button:hover .button-icon {
  transform: translateX(3px);
}

.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 28px;
  gap: 16px;
  background: linear-gradient(to top, #fafaf9, #ffffff);
}

.nav-button {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #404040;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.nav-button:hover {
  background-color: #fafaf9;
  border-color: #d4d4d4;
  transform: scale(1.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.nav-button:active {
  transform: scale(0.98);
}

.dots {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dot {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.dot:hover {
  background-color: #f5f5f4;
}

.dot-inner {
  width: 8px;
  height: 8px;
  background-color: #d4d4d4;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.dot.active .dot-inner {
  width: 20px;
  height: 8px;
  background-color: #2c2c2c;
  border-radius: 4px;
}

.dot:hover .dot-inner {
  background-color: #a3a3a3;
}

.dot.active:hover .dot-inner {
  background-color: #1a1a1a;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background-color: #f5f5f4;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2c2c2c 0%, #1a1a1a 100%);
  transition: width 0.05s linear;
  box-shadow: 0 0 8px rgba(44, 44, 44, 0.4);
}

/* 优化的过渡动画 */
.slide-fade-enter-active {
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  animation: slideOutLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-30px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-content {
    min-height: 340px;
  }

  .image-container {
    height: 180px;
  }

  .content-area {
    padding: 20px 20px 24px;
  }

  .landmark-title {
    font-size: 20px;
  }

  .landmark-description {
    font-size: 14px;
    -webkit-line-clamp: 2;
  }

  .carousel-nav {
    padding: 16px 20px;
    gap: 12px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }

  .dots {
    gap: 8px;
  }

  .dot {
    width: 28px;
    height: 28px;
  }

  .dot-inner {
    width: 6px;
    height: 6px;
  }

  .dot.active .dot-inner {
    width: 16px;
    height: 6px;
  }
}

@media (max-width: 480px) {
  .landmark-carousel {
    border-radius: 12px;
  }

  .carousel-content {
    min-height: 320px;
  }

  .image-container {
    height: 160px;
  }

  .content-area {
    padding: 16px;
  }

  .landmark-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .landmark-description {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .details-button {
    padding: 10px 18px;
    font-size: 13px;
  }

  .carousel-nav {
    padding: 14px 16px;
    gap: 10px;
  }

  .nav-button {
    width: 34px;
    height: 34px;
  }
}
</style>