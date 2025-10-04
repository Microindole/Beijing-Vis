<template>
  <div class="home-wrapper">
    <div class="home-container">
      <div class="info-panel">
        <h1>北京地标建筑</h1>
        <p class="intro-text">
          北京，作为中国的首都，不仅拥有三千余年建城史与八百六十载建都史，更是一座融合古老文明与现代繁华的宏伟都市。从壮丽的紫禁城到庄严的天坛，从绵延的长城到深邃的明十三陵，这些世界文化遗产共同见证着中华文明的辉煌与变迁。
        </p>

        <p class="intro-text">
          本导览项目精选八处最具代表性的北京文化地标，旨在引领您深入探索这座城市的历史演进与文化脉络。解析北京在不同历史时期的城市面貌、建筑风格及人文精神，展现古都黄昏时分，古建筑在金色余晖中更显庄严雄伟的独特魅力。
        </p>

        <LandmarkCarousel
          :landmarks="landmarks"
          :initialLandmarkId="activeLandmarkId"
          @view-details="handleLandmarkClick"
        />
      </div>

      <div class="map-container">
        <div class="map-controls">
          <button @click="toggleView" class="view-toggle-button">
            {{ currentView === "map" ? "查看地标关系图" : "返回地图视图" }}
          </button>

          <button
            v-if="currentLevel === 'district' && currentView === 'map'"
            @click="goBack"
            class="back-button"
          >
            返回北京全图
          </button>
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
      landmarks: [
        {
          id: "forbiddenCity",
          name: "故宫",
          position: [116.397, 39.918],
          routeName: "forbidden-city",
          image:
            "https://th.bing.com/th/id/OIP.tpviZp6QNc4tEcAR4jxckwHaE8?w=201&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // 替换为你的图片路径
          description:
            "故宫，又称紫禁城，是中国明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。",
        },
        {
          id: "templeOfHeaven",
          name: "天坛",
          position: [116.41, 39.882],
          routeName: "temple-of-heaven",
          image:
            "https://th.bing.com/th/id/OIP.MVieoEkwnsIQA_rBh0INygHaEp?w=312&h=196&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // 替换为你的图片路径
          description:
            "天坛，明清两代皇帝祭天、祈谷的场所。其严谨的建筑布局、奇特的建筑构造和瑰丽的建筑装饰，被认为是东方古老文明的杰出代表。",
        },
        {
          id: "greatWall",
          name: "长城",
          position: [116.57, 40.431],
          routeName: "great-wall",
          image:
            "https://th.bing.com/th/id/OIP.UgCFgWDdkM7dkfETdyol1QAAAA?w=294&h=196&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // 替换为你的图片路径
          description:
            "长城，作为中国古代的军事防御工程，是世界上修建时间最长、工程量最大的一项古代防御工程，象征着中华民族坚韧不拔的精神。",
        },
        {
          id: "mingTombs",
          name: "明十三陵",
          position: [116.234, 40.251],
          routeName: "ming-tombs",
          image:
            "https://th.bing.com/th/id/OIP.urR5j8-Em8cOvycZvh5mQwHaE7?w=279&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          description:
            "明十三陵是明朝十三位皇帝的陵墓群，坐落于北京昌平区，是中华文化的重要遗产。",
        },
        {
          id: "beihaiPark",
          name: "北海公园",
          position: [116.391, 39.928],
          routeName: "beihai-park",
          image:
            "https://th.bing.com/th/id/OIP.8DhccPe9VRXg6zGn5NqCnwHaE7?w=270&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          description:
            "北海公园是中国现存最古老、最完整、最具综合性和代表性的皇家园林之一。",
        },
        {
          id: "fayuanTemple",
          name: "法源寺",
          position: [116.368, 39.884],
          routeName: "fayuan-temple",
          image:
            "https://th.bing.com/th/id/OIP.b2ES3DrUVUO1ZbC4vi5ZbAHaFj?w=250&h=188&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          description:
            "法源寺是北京城内现存最古老的寺庙之一，历史悠久，藏有大量佛教文物。",
        },
        {
          id: "summerPalace",
          name: "颐和园",
          position: [116.271, 39.999],
          routeName: "summer-palace",
          image:
            "https://th.bing.com/th/id/OIP.7PmB1QZWprJFUDm2apRdSgHaE8?w=259&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          description:
            "颐和园是中国清朝的皇家园林，是中国古典园林艺术的杰作，被誉为“皇家园林博物馆”。",
        },
        {
          id: "dashilan",
          name: "大栅栏",
          position: [116.399, 39.899],
          routeName: "dashilan",
          image:
            "https://th.bing.com/th/id/OIP.IwJi2yNYtDsb5PiANk70RwHaE7?w=273&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
          description:
            "大栅栏是北京著名的商业街区，承载着丰富的历史文化和市井风情。",
        },
      ],
      colorScaleConfig: {
        range: ["#f8e5b5", "#bd6b20"], // 调整为黄昏色调
        domain: [0, 100],
      },
      currentView: "map", // 'map' 或 'relations'
      activeLandmarkId: null, // 新增：用于联动轮播组件
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
.home-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f2e9 0%, #e8d8c3 100%);
  overflow: auto;
}

.home-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

.info-panel {
  width: 300px;
  min-width: 300px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  color: #333;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.info-panel h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #8b4513;
  border-bottom: 1px solid #d4a76a;
  padding-bottom: 0.5rem;
  text-align: center;
}

.intro-text {
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: justify;
  font-size: 0.9rem;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0; /* 修复 flex 容器内的滚动问题 */
}

.map-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.map-content {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.map-content > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.back-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #d4a76a;
  border-radius: 4px;
  cursor: pointer;
  color: #8b4513;
  font-weight: bold;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 5px rgba(210, 105, 30, 0.5);
}

.view-toggle-button {
  padding: 8px 16px;
  background: #bd6b20;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.view-toggle-button:hover {
  background-color: #a05a1a;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .home-container {
    flex-direction: column;
  }
  
  .info-panel {
    width: 100%;
    min-width: 100%;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .map-container {
    min-height: 60vh;
  }
}

@media (max-width: 576px) {
  .info-panel {
    padding: 15px;
  }
  
  .info-panel h1 {
    font-size: 1.3rem;
  }
  
  .intro-text {
    font-size: 0.8rem;
  }
  
  .map-controls {
    flex-direction: column;
    gap: 5px;
  }
  
  .back-button,
  .view-toggle-button {
    width: 100%;
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
