<template>
  <div class="landmark-carousel">
    <div class="carousel-content">
      <transition name="fade" mode="out-in">
        <div :key="currentLandmark.id" class="carousel-item">
          <img
            :src="currentLandmark.image"
            :alt="currentLandmark.name"
            class="landmark-image"
          />
          <h4 class="landmark-title">{{ currentLandmark.name }}</h4>
          <p class="landmark-description">{{ currentLandmark.description }}</p>
          <button @click="viewDetails(currentLandmark)" class="details-button">
            查看详情
          </button>
        </div>
      </transition>
    </div>
    <div class="carousel-nav">
      <button @click="prevLandmark" class="nav-button prev-button">‹</button>
      <div class="dots">
        <span
          v-for="(landmark, index) in landmarks"
          :key="landmark.id"
          :class="{ dot: true, active: index === currentIndex }"
          @click="goToLandmark(index)"
        ></span>
      </div>
      <button @click="nextLandmark" class="nav-button next-button">›</button>
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
    };
  },
  computed: {
    currentLandmark() {
      return this.landmarks[this.currentIndex] || {};
    },
  },
  watch: {
    initialLandmarkId: {
      immediate: true, // 组件初始化时也执行
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
      this.stopAutoPlay(); // 确保只有一个定时器在运行
      this.intervalId = setInterval(() => {
        this.nextLandmark();
      }, 5000); // 每5秒自动切换
    },
    stopAutoPlay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    viewDetails(landmark) {
      // 触发一个事件，让父组件处理路由跳转
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
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden; /* 确保内容在过渡时不溢出 */
}

.carousel-content {
  width: 100%;
  min-height: 250px; /* 确保内容区有最小高度，避免跳动 */
  text-align: center;
  margin-bottom: 15px;
  position: relative;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.landmark-image {
  width: 90%;
  max-height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.landmark-title {
  font-size: 20px;
  color: #8b4513;
  margin-bottom: 8px;
}

.landmark-description {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: justify;
  max-height: 70px; /* 限制描述高度 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.details-button {
  background-color: #bd6b20;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.details-button:hover {
  background-color: #a05a1a;
  transform: translateY(-1px);
}

.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 20px;
  font-weight: bold;
  color: #8b4513;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.prev-button {
  margin-right: 15px;
}

.next-button {
  margin-left: 15px;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(139, 69, 19, 0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.dot.active {
  background-color: #bd6b20;
  transform: scale(1.2);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>