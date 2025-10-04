<template>
  <div class="tiantan-sayings-wrapper">
    <h2>天坛金句录</h2>
    <p class="subtitle">点击下方名句，探索其背后的故事与意境</p>

    <div class="sayings-wordcloud-container">
      <div ref="wordCloudChart" class="echarts-chart"></div>
      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>金句加载中...</p>
      </div>
    </div>

    <transition name="fade">
      <div 
        v-if="isModalVisible" 
        class="modal-overlay" 
        @click.self="closeStory"
      >
        <div class="modal-content">
          <button class="close-button" @click="closeStory">&times;</button>
          <div v-if="selectedSaying">
            <h3 class="modal-title">"{{ selectedSaying.saying }}"</h3>
            <p class="modal-story-title">{{ selectedSaying.story.title }}</p>
            <p class="modal-story-content">{{ selectedSaying.story.content }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';


import { TianTanSayings } from './tiantanSayingsData.js';

// --- 响应式数据 ---
const wordCloudChart = shallowRef(null);
let myChart = null;
let resizeTimer = null;

const isLoading = ref(true);
const isModalVisible = ref(false);
const selectedSaying = shallowRef(null);
const palaceSayings = shallowRef(TianTanSayings);

// --- 计算属性 ---
const processedSayings = computed(() => {
  return palaceSayings.value.map(item => ({
    name: item.saying,
    value: item.weight,
    theme: item.theme,
    originalData: item
  }));
});

// 主题颜色映射
const themeColors = {
  '哲学思想': '#3f7f9f',
  '历史感悟': '#c0a16c',
  '建筑美学': '#8b5a2b',
  '文化传承': '#5d4037',
  '科学智慧': '#2e7d32',
  '艺术价值': '#6a1b9a'
};

// --- 方法函数 ---
function getWordColor(params) {
  return themeColors[params.data.theme] || '#5c4d3c';
}

function initChart() {
  if (!wordCloudChart.value) return;
  
  try {
    myChart = echarts.init(wordCloudChart.value);
    setChartOption();
    window.addEventListener('resize', handleResize);
    
    // 添加点击事件监听
    myChart.on('click', handleWordClick);
    
    // 模拟加载延迟
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  } catch (error) {
    console.error('图表初始化失败:', error);
    isLoading.value = false;
  }
}

function setChartOption() {
  if (!myChart) return;
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => `
        <div style="font-size:14px;font-weight:bold;color:${params.color}">
          ${params.name}
        </div>
        <div>主题：${params.data.theme}</div>
      `
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '95%',
      height: '95%',
      sizeRange: [16, 70],
      rotationRange: [-45, 45],
      gridSize: 10,
      drawOutOfBound: false,
      layoutAnimation: {
        duration: 1000,
        easing: 'cubicOut'
      },
      textStyle: {
        fontFamily: 'Noto Serif SC, Songti SC, STSong, serif',
        fontWeight: 'bold',
        color: getWordColor
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          shadowBlur: 15,
          shadowColor: '#333',
          fontWeight: 'bolder'
        }
      },
      data: processedSayings.value
    }]
  };
  
  myChart.setOption(option);
}

function handleWordClick(params) {
  if (params.componentType === 'series' && params.seriesType === 'wordCloud') {
    showStory(params.data.originalData);
  }
}

function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (myChart) myChart.resize();
  }, 200);
}

function showStory(item) {
  selectedSaying.value = item;
  isModalVisible.value = true;
}

function closeStory() {
  isModalVisible.value = false;
  setTimeout(() => {
    selectedSaying.value = null;
  }, 300);
}

// --- 生命周期钩子 ---
onMounted(initChart);

onUnmounted(() => {
  if (myChart) {
    myChart.off('click', handleWordClick);
    myChart.dispose();
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap');

.tiantan-sayings-wrapper {
  background: linear-gradient(to bottom, #fdf9f2 0%, #f9f4e9 100%);
  padding: 2.5rem 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(139, 87, 42, 0.15);
  font-family: 'Noto Serif SC', 'Songti SC', 'STSong', serif;
  border: 1px solid #e6d4a5;
  position: relative;
  overflow: hidden;
}

.tiantan-sayings-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(to right, #8b4513, #d4a76a, #8b4513);
  z-index: 1;
}

.tiantan-sayings-wrapper h2 {
  font-size: 2.8rem;
  color: #8b4513;
  text-align: center;
  margin-bottom: 0.8rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 15px;
}

.tiantan-sayings-wrapper h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 3px;
  background: linear-gradient(to right, #d4a76a, #8b4513, #d4a76a);
  border-radius: 3px;
}

.subtitle {
  text-align: center;
  color: #7d5e3c;
  margin-bottom: 3.5rem;
  font-size: 1.25rem;
  font-style: italic;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* 词云容器 */
.sayings-wordcloud-container {
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  background-color: #fffef9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(139, 87, 42, 0.1);
  border: 1px solid #e6d4a5;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.sayings-wordcloud-container:hover {
  box-shadow: 0 8px 25px rgba(139, 87, 42, 0.2);
  transform: translateY(-5px);
}

.echarts-chart {
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 10;
  transition: all 0.5s ease;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(139, 87, 42, 0.2);
  border-top: 5px solid #8b4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-indicator p {
  color: #7d5e3c;
  font-size: 1.2rem;
  text-align: center;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #fffdf5;
  padding: 3.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 750px;
  box-shadow: 0 15px 50px rgba(101, 67, 33, 0.3);
  border: 2px solid #d4a76a;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(212, 167, 106, 0.2);
  border: 1px solid #d4a76a;
  font-size: 2.2rem;
  color: #8b4513;
  cursor: pointer;
  transition: all 0.4s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}

.close-button:hover {
  color: #fff;
  background-color: #8b4513;
  transform: rotate(90deg) scale(1.1);
}

.modal-title {
  font-size: 2.4rem;
  color: #8b4513;
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  padding: 0 30px;
  line-height: 1.4;
  font-weight: 700;
}

.modal-story-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #7a6348;
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.8rem;
  border-bottom: 2px solid #e8d8b5;
  position: relative;
}

.modal-story-title::after {
  content: "✧";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.8rem;
  color: #d4a76a;
  background: #fffdf5;
  padding: 0 15px;
}

.modal-story-content {
  font-size: 1.25rem;
  line-height: 1.9;
  color: #665a48;
  text-align: justify;
  padding: 10px 20px;
  flex-grow: 1;
  overflow-y: auto;
  background: #fcf8ec;
  border-radius: 8px;
  padding: 25px;
  box-shadow: inset 0 0 10px rgba(139, 87, 42, 0.1);
}

/* 滚动条美化 */
.modal-story-content::-webkit-scrollbar {
  width: 10px;
}

.modal-story-content::-webkit-scrollbar-track {
  background: #f9f4e9;
  border-radius: 4px;
}

.modal-story-content::-webkit-scrollbar-thumb {
  background-color: #d4a76a;
  border-radius: 6px;
  border: 2px solid #f9f4e9;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .tiantan-sayings-wrapper h2 {
    font-size: 2.4rem;
  }
  
  .subtitle {
    font-size: 1.15rem;
  }
  
  .sayings-wordcloud-container {
    height: 500px;
  }
  
  .modal-content {
    padding: 2.5rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .tiantan-sayings-wrapper {
    padding: 2rem 1rem;
  }
  
  .tiantan-sayings-wrapper h2 {
    font-size: 2rem;
    padding-bottom: 10px;
  }
  
  .tiantan-sayings-wrapper h2::after {
    width: 100px;
  }
  
  .subtitle {
    font-size: 1.05rem;
    margin-bottom: 2.5rem;
  }
  
  .sayings-wordcloud-container {
    height: 450px;
  }
  
  .modal-content {
    padding: 2rem 1.5rem;
    width: 95%;
  }
  
  .close-button {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 1.8rem;
  }
  
  .modal-title {
    font-size: 1.7rem;
    padding: 0 15px;
    margin-bottom: 1.5rem;
  }
  
  .modal-story-title {
    font-size: 1.3rem;
    margin-bottom: 1.8rem;
    padding-bottom: 1.5rem;
  }
  
  .modal-story-content {
    font-size: 1.1rem;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .tiantan-sayings-wrapper {
    padding: 1.8rem 0.8rem;
    border-radius: 12px;
  }
  
  .tiantan-sayings-wrapper h2 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .sayings-wordcloud-container {
    height: 380px;
    border-radius: 8px;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-story-title {
    font-size: 1.2rem;
  }
  
  .modal-story-content {
    font-size: 1rem;
    padding: 15px;
  }
  
  .close-button {
    top: 8px;
    right: 8px;
    width: 35px;
    height: 35px;
    font-size: 1.6rem;
  }
}
</style>