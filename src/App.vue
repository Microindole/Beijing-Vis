<template>
  <div class="app-container">
    <!-- 可以在这里添加全局组件 -->
    <global-header v-if="!hideHeader" />  <!-- 示例 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">  <!-- 添加页面过渡效果 -->
        <component :is="Component" />
      </transition>
    </router-view>
    <global-footer />  <!-- 示例 -->
  </div>
</template>

<script setup>
// 可以在这里添加全局逻辑
import { provide } from 'vue'
provide('globalData', {}) // 全局数据提供
</script>

<style>
/* 全局样式 */
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 全局过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>