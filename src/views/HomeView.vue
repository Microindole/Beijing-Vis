<template>
  <div class="home-wrapper">
    <div class="home-container">
      <div class="info-panel">
        <div class="panel-header">
          <h1>北京地标建筑</h1>
          <div class="header-decoration"></div>
        </div>

        <div class="intro-section">
          <p class="intro-text">
            北京，作为中国的首都，不仅拥有三千余年建城史与八百六十载建都史，更是一座融合古老文明与现代繁华的宏伟都市。从壮丽的紫禁城到庄严的天坛，从绵延的长城到深邃的明十三陵，这些世界文化遗产共同见证着中华文明的辉煌与变迁。
          </p>

          <p class="intro-text">
            本导览项目精选八处最具代表性的北京文化地标，旨在引领您深入探索这座城市的历史演进与文化脉络。解析北京在不同历史时期的城市面貌、建筑风格及人文精神，展现古都黄昏时分，古建筑在金色余晖中更显庄严雄伟的独特魅力。
          </p>
        </div>

        <div class="carousel-section">
          <LandmarkCarousel
            :landmarks="landmarks"
            :initialLandmarkId="activeLandmarkId"
            @view-details="handleLandmarkClick"
          />
        </div>
      </div>

      <div class="map-container">
        <div class="map-controls">
          <div class="controls-left">
            <button @click="toggleView" class="control-button primary">
              <span class="button-icon">{{ currentView === "map" ? "🔗" : "🗺️" }}</span>
              <span class="button-text">{{ currentView === "map" ? "地标关系图" : "地图视图" }}</span>
            </button>
          </div>

          <div class="controls-right">
            <button
              v-if="currentLevel === 'district' && currentView === 'map'"
              @click="goBack"
              class="control-button secondary"
            >
              <span class="button-icon">←</span>
              <span class="button-text">返回北京全图</span>
            </button>
          </div>
        </div>

        <div class="map-content">
          <BeijingMap
            v-if="currentView === 'map' && currentLevel === 'city'"
            :mapData="mapData"
            :colorScaleConfig="colorScaleConfig"
            :landmarks="landmarks"
            @area-clicked="handleAreaClick"
            @landmark-clicked="handleLandmarkClickOnMap"
          />

          <DistrictMap
            v-if="currentView === 'map' && currentLevel === 'district'"
            :districtName="selectedDistrict"
            :mapData="mapData"
            :colorScaleConfig="colorScaleConfig"
          />

          <LandmarkRelationsViz v-if="currentView === 'relations'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeijingMap from "../components/BeijingMap.vue";
import DistrictMap from "../components/DistrictMap.vue";
import LandmarkRelationsViz from "./LandmarkRelationsViz.vue";
import LandmarkCarousel from "./LandmarkCarousel.vue"; // 引入轮播组件
import { landmarks } from "@/data/homeViewData.js";

export default {
  components: {
    BeijingMap,
    DistrictMap,
    LandmarkRelationsViz,
    LandmarkCarousel, // 注册轮播组件
  },
  data() {
    return {
      currentLevel: "city",
      selectedDistrict: "",
      mapData: [],
      // 2. 直接使用导入的数据
      landmarks: landmarks,
      colorScaleConfig: {
        range: ["#f8e5b5", "#bd6b20"],
        domain: [0, 100],
      },
      currentView: "map",
      activeLandmarkId: null,
    };
  },
  methods: {
    handleAreaClick(districtName) {
      this.selectedDistrict = districtName;
      this.currentLevel = "district";
      this.currentView = "map";
    },
    goBack() {
      this.currentLevel = "city";
      this.selectedDistrict = "";
      this.currentView = "map";
    },
    // 处理轮播组件触发的查看详情事件
    handleLandmarkClick(landmark) {
      this.$router.push({ name: landmark.routeName });
    },
    // 处理地图上地标点击事件，更新activeLandmarkId以联动轮播
    handleLandmarkClickOnMap(landmark) {
      this.activeLandmarkId = landmark.id;
      // 同时也可以跳转路由，如果需要
      this.$router.push({ name: landmark.routeName });
    },
    toggleView() {
      this.currentView = this.currentView === "map" ? "relations" : "map";
      if (
        this.currentLevel === "district" &&
        this.currentView === "relations"
      ) {
        this.goBack();
      }
    },
  },
  watch: {
    $route(to) {
      if (to.meta?.title) {
        document.title = `${to.meta.title} | 北京地标导览`;
      }
    },
  },
};
</script>

<style scoped>
/* 全局容器 */
.home-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 50%, #dcc9b0 100%);
  position: relative;
  overflow: auto;
}

.home-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 223, 186, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(210, 180, 140, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.home-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* 信息面板优化 */
.info-panel {
  width: 360px;
  min-width: 360px;
  padding: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 250, 240, 0.92));
  backdrop-filter: blur(20px);
  border-right: 2px solid rgba(189, 107, 32, 0.2);
  box-shadow:
    4px 0 20px rgba(0, 0, 0, 0.08),
    inset -1px 0 0 rgba(255, 255, 255, 0.5);
  overflow-y: auto;
  color: #333;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 自定义滚动条 */
.info-panel::-webkit-scrollbar {
  width: 8px;
}

.info-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
}

.info-panel::-webkit-scrollbar-thumb {
  background: rgba(189, 107, 32, 0.4);
  border-radius: 4px;
  transition: background 0.3s;
}

.info-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(189, 107, 32, 0.6);
}

/* 头部装饰 */
.panel-header {
  padding: 30px 25px 20px;
  background: linear-gradient(135deg, rgba(189, 107, 32, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%);
  border-bottom: 2px solid rgba(212, 167, 106, 0.3);
  position: relative;
}

.panel-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(to right, transparent, #bd6b20, transparent);
}

.panel-header h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #8b4513;
  text-align: center;
  font-weight: 600;
  letter-spacing: 3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-decoration {
  margin: 15px auto 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, transparent, #d4a76a, transparent);
  border-radius: 2px;
}

/* 介绍文本区域 */
.intro-section {
  padding: 25px;
  flex-shrink: 0;
}

.intro-text {
  line-height: 1.8;
  margin-bottom: 1.2rem;
  text-align: justify;
  font-size: 0.95rem;
  color: #4a4a4a;
  text-indent: 2em;
  position: relative;
}

.intro-text:last-child {
  margin-bottom: 0;
}

/* 轮播区域 */
.carousel-section {
  flex: 1;
  padding: 0 25px 25px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 地图容器优化 */
.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
  background: rgba(255, 255, 255, 0.3);
}

/* 控制按钮区域 */
.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 250, 240, 0.9));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 167, 106, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  gap: 15px;
}

.controls-left,
.controls-right {
  display: flex;
  gap: 10px;
}

/* 按钮样式优化 */
.control-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.control-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.control-button:hover::before {
  width: 300px;
  height: 300px;
}

.control-button.primary {
  background: linear-gradient(135deg, #bd6b20 0%, #a05a1a 100%);
  color: #fff;
}

.control-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(189, 107, 32, 0.4);
}

.control-button.primary:active {
  transform: translateY(0);
}

.control-button.secondary {
  background: linear-gradient(135deg, #fff 0%, #faf8f5 100%);
  color: #8b4513;
  border: 1.5px solid #d4a76a;
}

.control-button.secondary:hover {
  background: linear-gradient(135deg, #faf8f5 0%, #f5f2e9 100%);
  border-color: #bd6b20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 167, 106, 0.3);
}

.button-icon {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.button-text {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

/* 地图内容区 */
.map-content {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(248, 229, 181, 0.1));
}

.map-content > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 响应式设计优化 */
@media (max-width: 1200px) {
  .info-panel {
    width: 320px;
    min-width: 320px;
  }

  .panel-header h1 {
    font-size: 1.6rem;
  }
}

@media (max-width: 992px) {
  .home-container {
    flex-direction: column;
  }

  .info-panel {
    width: 100%;
    min-width: 100%;
    max-height: 45vh;
    border-right: none;
    border-bottom: 2px solid rgba(189, 107, 32, 0.2);
  }

  .map-container {
    min-height: 55vh;
  }

  .intro-section {
    padding: 20px;
  }

  .carousel-section {
    padding: 0 20px 20px;
  }
}

@media (max-width: 768px) {
  .panel-header {
    padding: 25px 20px 15px;
  }

  .panel-header h1 {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }

  .intro-text {
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .map-controls {
    padding: 12px 15px;
    flex-wrap: wrap;
  }

  .control-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .info-panel {
    max-height: 50vh;
  }

  .panel-header {
    padding: 20px 15px 12px;
  }

  .panel-header h1 {
    font-size: 1.3rem;
    letter-spacing: 1px;
  }

  .intro-section {
    padding: 15px;
  }

  .intro-text {
    font-size: 0.85rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .carousel-section {
    padding: 0 15px 15px;
  }

  .map-controls {
    flex-direction: column;
    padding: 10px;
    gap: 8px;
  }

  .controls-left,
  .controls-right {
    width: 100%;
  }

  .control-button {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .button-icon {
    font-size: 1rem;
  }
}

/* 打印样式 */
@media print {
  .map-controls {
    display: none;
  }

  .home-wrapper::before {
    display: none;
  }
}
</style>
