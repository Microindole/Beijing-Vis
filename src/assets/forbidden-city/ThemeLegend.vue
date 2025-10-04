<!--这个是百鸟朝凤图的弹窗-->
<template>
  <div class="theme-legend">
    <h3>報導主題</h3>
    <div 
      v-for="theme in themes" 
      :key="theme.name"
      class="legend-item"
      :style="{ borderColor: theme.color }"
      @click="selectTheme(theme.name)"
      @mouseenter="hoverTheme(theme.name)"
      @mouseleave="unhoverTheme"
    >
      <div class="color-box" :style="{ backgroundColor: theme.color }"></div>
      <span>{{ theme.name }} ({{ theme.count }})</span>
    </div>
    <div class="legend-item" @click="selectTheme(null)">
      <div class="color-box" style="background-color: #999"></div>
      <span>顯示全部</span>
    </div>
  </div>
</template>

<script>
import { defineProps, defineEmits } from 'vue'

export default {
  props: {
    themes: {
      type: Array,
      required: true
    }
  },
  emits: ['theme-selected'],
  setup(props, { emit }) {
    const selectTheme = (themeName) => {
      emit('theme-selected', themeName)
    }
    
    const hoverTheme = (themeName) => {
      // 可以添加懸停效果
    }
    
    const unhoverTheme = () => {
      // 可以添加懸停效果
    }
    
    return {
      selectTheme,
      hoverTheme,
      unhoverTheme
    }
  }
}
</script>

<style scoped>
.theme-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;
}

.theme-legend h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.legend-item:hover {
  background-color: #f0f0f0;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
}
</style>