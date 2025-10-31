<template>
  <div class="home-wrapper">
    <div class="home-container">
      <div class="info-panel">
        <div class="panel-header compact">
          <div class="header-ornament top"></div>
          <h1>北京地标建筑</h1>
          <p class="subtitle">BEIJING LANDMARK ARCHITECTURE</p>
          <div class="header-ornament bottom"></div>
        </div>
        <div class="intro-section">
          <p class="intro-text">
            {{ displayedText }}<span class="cursor">|</span>
          </p>
        </div>
        <div class="carousel-section">
          <div class="section-title">
            <span class="title-line"></span>
            <span class="title-text">精选地标</span>
            <span class="title-line"></span>
          </div>
          <LandmarkCarousel
              :landmarks="landmarks"
              :initialLandmarkId="activeLandmarkId"
              @view-details="handleLandmarkClick"
          />
        </div>

      </div>

      <div class="map-container" @dblclick.prevent="toggleImmersiveMode">
        <div class="map-controls">
          <div class="controls-group">
            <button @click="toggleView" class="control-button primary">
              <span class="button-icon">{{ currentView === "map" ? "" : "" }}</span>
              <span class="button-text">{{ currentView === "map" ? "地标关系图" : "地图视图" }}</span>
              <span class="button-ripple"></span>
            </button>
            <button
                v-if="currentLevel === 'district' && currentView === 'map'"
                @click="goBack"
                class="control-button secondary"
            >
              <span class="button-icon">←</span>
              <span class="button-text">返回全图</span>
              <span class="button-ripple"></span>
            </button>
          </div>
          <div class="view-indicator">
            <span class="indicator-dot" :class="{ active: currentView === 'map' }"></span>
            <span class="indicator-text">{{ currentView === "map" ? "地图模式" : "关系模式" }}</span>
          </div>
        </div>
        <div class="map-content">
          <div class="map-overlay" v-if="currentView === 'map'"></div>
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
              :landmarks="mapLandmarks"
          />
          <LandmarkRelationsViz v-if="currentView === 'relations'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeijingMap from "../components/BeijingMap.vue";
import DistrictMap from "../components/DistrictMap.vue";
import LandmarkRelationsViz from "./LandmarkRelationsViz.vue";
import LandmarkCarousel from "./LandmarkCarousel.vue";
import {landmarks} from "@/data/homeViewData.js";
import { mapLandmarks } from "@/data/mapLandmarkData.js";

export default {
  components: {
    BeijingMap,
    DistrictMap,
    LandmarkRelationsViz,
    LandmarkCarousel,
  },
  data() {
    return {
      // ... 其他 data 属性保持不变 ...
      isImmersiveMode: false,
      currentLevel: "city",
      selectedDistrict: "",
      mapData: [],
      landmarks: landmarks,
      mapLandmarks: mapLandmarks,
      colorScaleConfig: {
        range: ["#f8e5b5", "#bd6b20"],
        domain: [0, 100],
      },
      currentView: "relations",
      activeLandmarkId: null,

      // 1. 新增用于打字机效果的状态
      textsToType: [
        "北京，作为中国的首都，不仅拥有三千余年建城史与八百六十载建都史，更是一座融合古老文明与现代繁华的宏伟都市。从壮丽的紫禁城到庄严的天坛，从绵延的长城到深邃的明十三陵，这些世界文化遗产共同见证着中华文明的辉煌与变迁。",
        "本导览项目精选八处最具代表性的北京文化地标，旨在引领您深入探索这座城市的历史演进与文化脉络。解析北京在不同历史时期的城市面貌、建筑风格及人文精神，展现古都黄昏时分，古建筑在金色余晖中更显庄严雄伟的独特魅力。",
      ],
      currentTextIndex: 0,
      displayedText: "",
      charIndex: 0,
      typingTimeout: null,
    };
  },
  mounted() {
    // 3. 在 mounted 钩子中启动打字机
    this.startTypingEffect();
  },
  beforeUnmount() {
    // 组件销毁时清除定时器，防止内存泄漏
    clearTimeout(this.typingTimeout);
  },
  methods: {
    // ... 其他 methods 保持不变 ...
    toggleImmersiveMode() {
      if (this.currentView === 'map') {
        this.isImmersiveMode = !this.isImmersiveMode;
      }
    },

    // 2. 新增打字机效果的核心方法
    startTypingEffect() {
      const currentText = this.textsToType[this.currentTextIndex];

      // 如果当前句子还没打完
      if (this.charIndex < currentText.length) {
        this.displayedText += currentText.charAt(this.charIndex);
        this.charIndex++;
        this.typingTimeout = setTimeout(this.startTypingEffect, 50); // 每个字的打印速度
      }
      // 如果一个句子打完了
      else {
        // 暂停一段时间
        this.typingTimeout = setTimeout(() => {
          // 切换到下一个句子
          this.currentTextIndex = (this.currentTextIndex + 1) % this.textsToType.length;
          this.displayedText = "";
          this.charIndex = 0;
          // 开始打印下一个句子
          this.startTypingEffect();
        }, 3000); // 每个句子打完后的停留时间
      }
    },

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
    handleLandmarkClick(landmark) {
      this.$router.push({name: landmark.routeName});
    },
    handleLandmarkClickOnMap(landmark) {
      this.activeLandmarkId = landmark.id;
      this.$router.push({name: landmark.routeName});
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
/* ==================== 全局及容器 ==================== */
.home-wrapper { height: 100vh; background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 50%, #dcc9b0 100%); position: relative; overflow: hidden; }
.home-wrapper::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(255, 223, 186, 0.4) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(210, 180, 140, 0.3) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(189, 107, 32, 0.05) 0%, transparent 80%); pointer-events: none; z-index: 0; animation: ambientPulse 20s ease-in-out infinite; }
@keyframes ambientPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
.home-container { display: flex; flex-direction: row; width: 100%; height: 100vh; box-sizing: border-box; position: relative; z-index: 1; }

/* ==================== 信息面板 ==================== */
.info-panel {
  width: 380px;
  min-width: 380px;
  padding: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.95) 50%, rgba(250, 245, 235, 0.92) 100%);
  backdrop-filter: blur(25px) saturate(150%);
  border-right: 2px solid rgba(189, 107, 32, 0.15);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.08), inset -1px 0 0 rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  color: #333;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
}
.info-panel::-webkit-scrollbar { width: 6px; }
.info-panel::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
.info-panel::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgba(189, 107, 32, 0.4), rgba(189, 107, 32, 0.6)); border-radius: 3px; transition: background 0.3s; }
.info-panel::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, rgba(189, 107, 32, 0.6), rgba(189, 107, 32, 0.8)); }

/* ==================== 1. 头部区域 ==================== */
.panel-header.compact {
  padding: 25px 30px 20px;
  border-bottom: 1px solid rgba(212, 167, 106, 0.25);
  text-align: center;
  flex-shrink: 0;
}
.panel-header.compact h1 {
  font-size: 1.8rem;
  margin: 0;
  letter-spacing: 3px;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.panel-header.compact .subtitle {
  font-size: 0.7rem;
  color: #a0522d;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: 6px;
  opacity: 0.7;
}
.header-ornament { width: 60px; height: 1px; margin: 0 auto; background: linear-gradient(to right, transparent, #d4a76a, transparent); position: relative; }
.header-ornament.top { margin-bottom: 15px; }
.header-ornament.bottom { margin-top: 12px; }
.header-ornament::before,
.header-ornament::after { content: ''; position: absolute; top: 50%; width: 4px; height: 4px; background: #bd6b20; border-radius: 50%; transform: translateY(-50%); }
.header-ornament::before { left: 0; }
.header-ornament::after { right: 0; }


/* ==================== 2. 介绍区域 ==================== */
.intro-section {
  padding: 20px 30px 25px;
  flex-shrink: 0;
}
.intro-text {
  font-family: 'Noto Serif SC', 'KaiTi', serif;
  line-height: 2.0;
  font-size: 1rem;
  min-height: 220px;
  margin: 0;
  text-align: justify;
  color: #454545;
  text-indent: 2em;
}
.cursor { font-weight: bold; animation: blink 1s step-end infinite; }
@keyframes blink { from, to { color: transparent; } 50% { color: #8b4513; } }

/* ==================== 轮播区域 ==================== */
.carousel-section {
  padding: 0 25px 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
.section-title { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; gap: 15px; flex-shrink: 0;}
.title-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(212, 167, 106, 0.4), transparent); max-width: 60px; }
.title-text { font-size: 0.9rem; color: #8b4513; font-weight: 600; letter-spacing: 3px; white-space: nowrap; text-transform: uppercase; }
.map-container{flex:1;display:flex;flex-direction:column;position:relative;min-height:0;background:rgba(255,255,255,.2)}.map-controls{display:flex;justify-content:space-between;align-items:center;padding:18px 25px;background:linear-gradient(to bottom,rgba(255,255,255,.98) 0,rgba(255,250,240,.95) 100%);backdrop-filter:blur(15px) saturate(120%);border-bottom:1px solid rgba(212,167,106,.15);box-shadow:0 2px 15px rgba(0,0,0,.06),inset 0 1px 0 hsla(0,0%,100%,.5);z-index:1000;gap:20px}.controls-group{display:flex;gap:12px;align-items:center}.view-indicator{display:flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(189,107,32,.08);border-radius:20px;border:1px solid rgba(189,107,32,.15)}.indicator-dot{width:8px;height:8px;border-radius:50%;background:#ccc;transition:all .3s ease}.indicator-dot.active{background:#bd6b20;box-shadow:0 0 8px rgba(189,107,32,.5);animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}.indicator-text{font-size:.85rem;color:#8b4513;font-weight:500;letter-spacing:.5px}.control-button{display:inline-flex;align-items:center;gap:10px;padding:12px 24px;border:none;border-radius:10px;cursor:pointer;font-size:.95rem;font-weight:600;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 3px 10px rgba(0,0,0,.12),inset 0 1px 0 hsla(0,0%,100%,.2);position:relative;overflow:hidden;letter-spacing:.5px}.button-ripple{position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:hsla(0,0%,100%,.4);transform:translate(-50%,-50%);transition:width .5s,height .5s;pointer-events:none}.control-button:hover .button-ripple{width:300px;height:300px}.control-button.primary{background:linear-gradient(135deg,#bd6b20 0,#d4812f 50%,#a05a1a 100%);color:#fff;border:1px solid rgba(189,107,32,.3)}.control-button.primary:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(189,107,32,.4),inset 0 1px 0 hsla(0,0%,100%,.3)}.control-button.primary:active{transform:translateY(-1px);box-shadow:0 3px 10px rgba(189,107,32,.3),inset 0 1px 0 hsla(0,0%,100%,.2)}.control-button.secondary{background:linear-gradient(135deg,#fff 0,#faf8f5 100%);color:#8b4513;border:1.5px solid #d4a76a}.control-button.secondary:hover{background:linear-gradient(135deg,#faf8f5 0,#f5f2e9 100%);border-color:#bd6b20;transform:translateY(-3px);box-shadow:0 6px 18px rgba(212,167,106,.35),inset 0 1px 0 hsla(0,0%,100%,.8)}.control-button.secondary:active{transform:translateY(-1px)}.button-icon{font-size:1.15rem;display:flex;align-items:center;position:relative;z-index:1}.button-text{position:relative;z-index:1;white-space:nowrap}.map-content{flex:1;position:relative;min-height:0;overflow:hidden;background:linear-gradient(to bottom right,hsla(0,0%,100%,.15),rgba(248,229,181,.1))}.map-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 40%,rgba(255,223,186,.1) 0,transparent 50%),radial-gradient(circle at 70% 60%,rgba(210,180,140,.08) 0,transparent 50%);pointer-events:none;z-index:1}.map-content>*{position:absolute;top:0;left:0;width:100%;height:100%}@media (max-width:1200px){.info-panel{width:340px;min-width:340px}.panel-header h1{font-size:1.7rem;letter-spacing:3px}}@media (max-width:992px){.home-container{flex-direction:column}.info-panel{width:100%;min-width:100%;max-height:initial;height:auto;border-right:none;border-bottom:2px solid rgba(189,107,32,.2)}.map-container{height:60vh;min-height:400px}.intro-section{padding:25px 20px;gap:15px}.carousel-section{padding:0 20px 25px}.view-indicator{display:none}}@media (max-width:768px){.panel-header{padding:28px 20px 20px}.panel-header h1{font-size:1.6rem;letter-spacing:2px}.subtitle{font-size:.7rem}.intro-card{padding:16px}.intro-text{font-size:.9rem;line-height:1.8}.map-controls{padding:15px;flex-wrap:wrap}.control-button{padding:10px 18px;font-size:.9rem}}@media (max-width:576px){.info-panel{max-height:initial;height:auto}.panel-header{padding:22px 15px 15px}.panel-header h1{font-size:1.4rem;letter-spacing:1.5px}.subtitle{font-size:.65rem;letter-spacing:1.5px}.intro-section{padding:20px 15px;gap:12px}.intro-card{padding:14px;border-radius:10px}.intro-text{font-size:.85rem;line-height:1.7;min-height:120px}.carousel-section{padding:0 15px 20px}.section-title{margin-bottom:15px;gap:10px}.title-text{font-size:.8rem;letter-spacing:2px}.map-controls{flex-direction:column;padding:12px;gap:10px}.controls-group{width:100%;flex-direction:column;gap:10px}.control-button{width:100%;justify-content:center;padding:11px 18px;font-size:.88rem}.button-icon{font-size:1.05rem}}@media print{.map-controls{display:none}.home-wrapper::before{display:none}.info-panel{box-shadow:none;border-right:1px solid #ddd}}.control-button:focus-visible{outline:2px solid #bd6b20;outline-offset:2px}@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}.home-container.immersive-active .info-panel{display:none}.home-container.immersive-active .map-controls{display:none}

/* ==================== 响应式布局：针对低高度屏幕 ==================== */
@media (max-height: 800px) {
  /* 当浏览器窗口高度小于等于 800px 时，应用以下紧凑样式 */
  .panel-header.compact {
    padding: 20px 25px 15px;
  }
  .panel-header.compact h1 {
    font-size: 1.6rem;
  }
  .header-ornament {
    display: none;
  }
  .intro-section {
    padding: 15px 25px;
  }
  .intro-text {
    min-height: 100px;
    font-size: 0.85rem;
    line-height: 1.7;
  }
  .carousel-section {
    padding: 0 25px 20px;
  }
  .section-title {
    margin-bottom: 15px;
  }
}
</style>