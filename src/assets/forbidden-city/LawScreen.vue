<!-- 维护法案的图 -->
<template>
  <div class="bamboo-scroll-container">
    <!-- 顶部卷轴 -->
    <div class="scroll-top">
      <div class="scroll-knob left"></div>
      <div class="scroll-bar"></div>
      <div class="scroll-knob right"></div>
    </div>
    
    <!-- 竹简内容区域 -->
    <div class="bamboo-strips">
      <div 
        v-for="(strip, index) in bambooStrips" 
        :key="index" 
        class="bamboo-strip"
        :class="{ 'highlight': strip.highlight }"
      >
        <div class="bamboo-knot left"></div>
        <div class="strip-content">
          <h3 v-if="strip.title" class="strip-title">{{ strip.title }}</h3>
          <p class="strip-text">{{ strip.content }}</p>
          <div v-if="strip.year" class="year-marker">{{ strip.year }}</div>
        </div>
        <div class="bamboo-knot right"></div>
      </div>
    </div>
    
    <!-- 底部卷轴 -->
    <div class="scroll-bottom">
      <div class="scroll-knob left"></div>
      <div class="scroll-bar"></div>
      <div class="scroll-knob right"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const bambooStrips = ref([
  {
    title: '中华人民共和国文物保护法',
    content: '第一条 为了加强对文物的保护，继承中华民族优秀的历史文化遗产，促进科学研究工作，进行爱国主义和革命传统教育，建设社会主义精神文明和物质文明，根据宪法，制定本法。',
    highlight: true,
    year: ''
  },
  {
    content: '第二条 在中华人民共和国境内，下列文物受国家保护：（一）具有历史、艺术、科学价值的古文化遗址、古墓葬、古建筑、石窟寺和石刻、壁画；',
    highlight: false,
    year: ''
  },
  {
    content: '第三条 古文化遗址、古墓葬、古建筑、石窟寺、石刻、壁画、近代现代重要史迹和代表性建筑等不可移动文物，根据它们的历史、艺术、科学价值，可以分别确定为全国重点文物保护单位，省级文物保护单位，市、县级文物保护单位。',
    highlight: true,
    year: '1961年'
  },
  {
    title: '故宫保护条例',
    content: '故宫是世界文化遗产，是中国古代宫廷建筑之精华，必须严格保护其完整性和真实性。',
    highlight: false,
    year: ''
  },
  {
    content: '故宫保护应当坚持保护为主、抢救第一、合理利用、加强管理的方针，确保故宫文化遗产的真实性和完整性。',
    highlight: true,
    year: '1987年'
  },
  {
    content: '故宫博物院应当制定故宫保护规划，经国务院文物行政部门审核同意后报国务院批准实施。',
    highlight: false,
    year: ''
  }
]);
</script>

<style scoped>
.bamboo-scroll-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'SimSun', 'STKaiti', serif;
  perspective: 1000px;
}

/* 卷轴样式 */
.scroll-top, .scroll-bottom {
  display: flex;
  justify-content: center;
  margin: 0 -10px;
}

.scroll-bar {
  height: 40px;
  background: linear-gradient(to right, #8B4513, #A0522D, #8B4513);
  flex-grow: 1;
  border-top: 2px solid #5D2906;
  border-bottom: 2px solid #5D2906;
  position: relative;
}

.scroll-bar:before {
  content: '';
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  right: 0;
  background: repeating-linear-gradient(
    to right,
    #D2B48C,
    #D2B48C 10px,
    #A0522D 10px,
    #A0522D 20px
  );
}

.scroll-knob {
  width: 50px;
  height: 40px;
  background: linear-gradient(to bottom, #8B4513, #5D2906);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  position: relative;
  box-shadow: inset 0 -5px 10px rgba(0,0,0,0.3);
}

.scroll-bottom .scroll-knob {
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  box-shadow: inset 0 5px 10px rgba(0,0,0,0.3);
}

.scroll-knob:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle, #5D2906, #3A1B09);
}

/* 竹简条样式 */
.bamboo-strips {
  background-color: #F5E8C9;
  padding: 20px 40px;
  border-left: 15px solid #8B4513;
  border-right: 15px solid #8B4513;
  box-shadow: inset 0 0 30px rgba(139, 69, 19, 0.3);
  position: relative;
}

.bamboo-strips:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,50 Q25,40 50,50 T100,50" fill="none" stroke="%238B4513" stroke-width="0.5" opacity="0.3"/></svg>');
  opacity: 0.2;
  pointer-events: none;
}

.bamboo-strip {
  display: flex;
  margin: 15px 0;
  position: relative;
  transition: all 0.3s ease;
}

.bamboo-strip:hover {
  transform: translateY(-3px);
}

.bamboo-strip.highlight {
  background-color: rgba(255, 255, 240, 0.7);
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.8);
}

.bamboo-knot {
  width: 8px;
  height: 100%;
  background: linear-gradient(to bottom, #8B4513, #A0522D, #8B4513);
  border-radius: 3px;
  position: relative;
}

.bamboo-knot:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 5px,
    rgba(255,255,255,0.2) 5px,
    rgba(255,255,255,0.2) 7px
  );
}

.strip-content {
  flex-grow: 1;
  padding: 10px 15px;
  background-color: #F9F3E6;
  border-top: 1px solid #D2B48C;
  border-bottom: 1px solid #D2B48C;
  position: relative;
}

.strip-content:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: linear-gradient(to bottom, #8B4513, #D2B48C, #8B4513);
}

.strip-title {
  color: #8B4513;
  margin-top: 0;
  padding-bottom: 5px;
  border-bottom: 1px dashed #D2B48C;
  text-align: center;
  font-size: 1.3em;
}

.strip-text {
  color: #5D2906;
  line-height: 1.8;
  text-align: justify;
  margin: 10px 0;
  font-size: 1.1em;
}

.year-marker {
  position: absolute;
  top: -10px;
  right: 20px;
  background-color: #8B4513;
  color: #F9F3E6;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* 动画效果 */
.bamboo-strip {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个竹简条添加不同的延迟 */
.bamboo-strip:nth-child(1) { animation-delay: 0.1s; }
.bamboo-strip:nth-child(2) { animation-delay: 0.3s; }
.bamboo-strip:nth-child(3) { animation-delay: 0.5s; }
.bamboo-strip:nth-child(4) { animation-delay: 0.7s; }
.bamboo-strip:nth-child(5) { animation-delay: 0.9s; }
.bamboo-strip:nth-child(6) { animation-delay: 1.1s; }

/* 响应式设计 */
@media (max-width: 768px) {
  .bamboo-scroll-container {
    margin: 0 10px;
  }
  
  .bamboo-strips {
    padding: 15px 20px;
    border-left: 10px solid #8B4513;
    border-right: 10px solid #8B4513;
  }
  
  .strip-content {
    padding: 8px 10px;
  }
  
  .strip-title {
    font-size: 1.1em;
  }
  
  .strip-text {
    font-size: 1em;
    line-height: 1.6;
  }
}
</style>