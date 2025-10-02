<template>
  <div id="visualization-system">
    <header class="app-header">
      <h1>北京城市时空演化可视分析系统</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/task2">任务</router-link>
      </nav>
    </header>

    <main class="task-views-container">
      <router-view></router-view>
    </main>

    <div class="control-panel">
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}

nav a {
  margin-left: 15px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983; /* 高亮当前激活的链接 */
}

.task-views-container {
  padding: 20px;
}
</style>