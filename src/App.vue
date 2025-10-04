<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-container">
    <header class="app-header">
      <h1>析城观史 - 北京历史时空演变可视分析</h1>
      <!--在标题下方添加了导航栏，以便于在不同分析视图间切换 -->
      <nav class="app-nav">
        <RouterLink to="/history-explorer">总览</RouterLink>
        <RouterLink to="/analysis/internal-evolution">城市内部演进</RouterLink>
        <RouterLink to="/history-zhou">朝代历史轴</RouterLink>
        <RouterLink to="/analysis/impact-events">冲击事件分析</RouterLink><
      </nav>
    </header>
    <main class="app-main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--main-bg-color);
}

.app-header {
  flex-shrink: 0;
  padding: 0 25px;
  height: auto; /* 自适应高度 */
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex; /* 使用flex布局 */
  align-items: center;
  justify-content: space-between; /* 让标题和导航分布在两侧 */
  flex-wrap: wrap; /* 允许换行 */
  padding: 10px 25px;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5em; /* 调整字体大小以适应导航 */
  font-weight: 500;
  white-space: nowrap;
}

.app-main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* 导航栏样式 */
.app-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-nav a {
  color: var(--header-text-color);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.app-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>