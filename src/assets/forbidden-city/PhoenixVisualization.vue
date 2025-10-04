<!-- 百鸟朝凤图 -->
<template>
  <div class="visualization-container">
    <div class="phoenix-container" ref="phoenixContainer">
      <img :src="phoenixImage" alt="鳳凰" class="phoenix-image" />
      <div 
        v-for="(bird, index) in birds" 
        :key="index"
        class="bird"
        :style="birdStyle(bird)"
        @mouseenter="showTooltip(bird)"
        @mouseleave="hideTooltip"
        @click="showThemeDetail(bird.theme)"
      ></div>
    </div>
    
    <ThemeLegend 
      :themes="themes" 
      @theme-selected="highlightTheme"
    />
    
    <div v-if="activeTooltip" class="tooltip" :style="tooltipStyle">
      {{ activeTooltip.theme.name }}: {{ activeTooltip.theme.count }}篇報導
    </div>
    
    <div v-if="selectedTheme" class="theme-detail">
      <h3>{{ selectedTheme.name }}報導趨勢</h3>
      <div class="trend-chart">
        <div 
          v-for="(value, year) in selectedTheme.trend" 
          :key="year"
          class="trend-bar"
          :style="{ height: `${value}px`, backgroundColor: selectedTheme.color }"
        >
          <span class="trend-value">{{ value }}</span>
        </div>
      </div>
      <div class="sample-titles">
        <h4>報導示例:</h4>
        <ul>
          <li v-for="(title, idx) in selectedTheme.sampleTitles" :key="idx">{{ title }}</li>
        </ul>
      </div>
      <button @click="selectedTheme = null">關閉</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import phoenixImage from '../assets/phoenix.png'
import mediaData from '../data/media-coverage.json'
import ThemeLegend from './ThemeLegend.vue'

export default {
  components: { ThemeLegend },
  setup() {
    const phoenixContainer = ref(null)
    const birds = ref([])
    const activeTooltip = ref(null)
    const tooltipPosition = ref({ x: 0, y: 0 })
    const selectedTheme = ref(null)
    const highlightedTheme = ref(null)
    
    const themes = mediaData.themes
    
    // 根據數據生成鳥群
    const generateBirds = () => {
      const containerWidth = phoenixContainer.value?.clientWidth || 800
      const containerHeight = phoenixContainer.value?.clientHeight || 600
      
      let allBirds = []
      
      themes.forEach(theme => {
        const count = Math.ceil((theme.count / mediaData.totalCoverage) * 500)
        
        for (let i = 0; i < count; i++) {
          // 計算鳥的位置 (從邊緣飛向中心)
          const angle = Math.random() * Math.PI * 2
          const distance = 0.3 + Math.random() * 0.7
          const startX = containerWidth / 2 + Math.cos(angle) * containerWidth * 0.6 * distance
          const startY = containerHeight / 2 + Math.sin(angle) * containerHeight * 0.6 * distance
          
          // 飛行路徑參數
          const flightParams = {
            delay: Math.random() * 5,
            duration: 10 + Math.random() * 10,
            pathVariation: Math.random() * 0.3 - 0.15
          }
          
          allBirds.push({
            theme,
            x: startX,
            y: startY,
            size: 5 + Math.random() * 5,
            opacity: 0.7 + Math.random() * 0.3,
            flightParams
          })
        }
      })
      
      birds.value = allBirds
    }
    
    const birdStyle = (bird) => {
      const isHighlighted = !highlightedTheme.value || highlightedTheme.value === bird.theme.name
      
      return {
        left: `${bird.x}px`,
        top: `${bird.y}px`,
        width: `${bird.size}px`,
        height: `${bird.size}px`,
        backgroundColor: bird.theme.color,
        opacity: isHighlighted ? bird.opacity : 0.2,
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fly ${bird.flightParams.duration}s ease-in-out ${bird.flightParams.delay}s infinite`
      }
    }
    
    const showTooltip = (bird) => {
      activeTooltip.value = bird
      tooltipPosition.value = { x: bird.x + 10, y: bird.y + 10 }
    }
    
    const hideTooltip = () => {
      activeTooltip.value = null
    }
    
    const showThemeDetail = (theme) => {
      selectedTheme.value = theme
    }
    
    const highlightTheme = (themeName) => {
      highlightedTheme.value = themeName
    }
    
    const tooltipStyle = computed(() => ({
      left: `${tooltipPosition.value.x}px`,
      top: `${tooltipPosition.value.y}px`
    }))
    
    onMounted(() => {
      generateBirds()
      
      // 響應式調整
      window.addEventListener('resize', generateBirds)
    })
    
    return {
      phoenixImage,
      phoenixContainer,
      birds,
      themes,
      activeTooltip,
      tooltipStyle,
      selectedTheme,
      birdStyle,
      showTooltip,
      hideTooltip,
      showThemeDetail,
      highlightTheme
    }
  }
}
</script>

<style scoped>
.visualization-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

.phoenix-container {
  position: relative;
  width: 100%;
  height: 80%;
}

.phoenix-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: auto;
  z-index: 10;
}

.bird {
  position: absolute;
  border-radius: 50%;
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  z-index: 5;
  cursor: pointer;
  transition: opacity 0.3s;
}

@keyframes fly {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-5px, -5px) rotate(-5deg);
  }
  50% {
    transform: translate(0, -10px) rotate(0deg);
  }
  75% {
    transform: translate(5px, -5px) rotate(5deg);
  }
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
}

.theme-detail {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  z-index: 20;
}

.trend-chart {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 200px;
  gap: 10px;
  margin: 20px 0;
}

.trend-bar {
  width: 30px;
  position: relative;
  transition: height 0.5s ease;
}

.trend-value {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
}

.sample-titles {
  max-height: 150px;
  overflow-y: auto;
}

.sample-titles ul {
  padding-left: 20px;
}
</style>