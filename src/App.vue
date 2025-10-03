<template>
  <div id="app-container">
    <header class="app-header">
      <h1>析城观史 - 北京历史时空演变可视分析</h1>
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
}

.app-header {
  flex-shrink: 0;
  padding: 0 25px;
  height: 60px;
  /* 应用新的颜色变量 */
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.8em;
  font-weight: 500;
}

.app-main-content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>