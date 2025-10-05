<template>
  <div class="content-area">
  <h2>本项目主要技术栈：</h2>
  <ul>
    <li><b>核心框架:</b> Vue 3 (Composition API)</li>
    <li><b>构建工具:</b> Vite</li>
    <li><b>路由:</b> Vue Router</li>
    <li><b>UI 组件库:</b> Element Plus</li>
    <li><b>样式方案:</b> Tailwind CSS</li>
    <li><b>数据可视化:</b> ECharts, G6, D3.js</li>
    <li><b>3D 渲染:</b> Three.js, Cesium</li>
  </ul>
</div>
</template>
<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const goBack = () => router.go(-1);
</script>

<style scoped>
/* --- 样式与我们之前改造的深色主题保持一致 --- */
.info-page-container {
  min-height: 100vh;
  background-color: #111827; /* 深灰色背景 (gray-900) */
  color: #F9FAFB; /* gray-50 */
  padding: 60px 40px;
  font-family: sans-serif;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  position: absolute;
  top: 40px;
  left: 40px;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.page-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #9CA3AF; /* gray-400 */
  margin-bottom: 60px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.member-card {
  background-color: #1F2937; /* gray-800 */
  border: 1px solid #374151; /* gray-700 */
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.member-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-color: #4F46E5; /* indigo-600 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #4F46E5;
  margin-bottom: 20px;
  object-fit: cover;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.role {
  color: #6366F1; /* indigo-500 */
  font-weight: 500;
  margin-bottom: 15px;
}

.bio {
  color: #D1D5DB; /* gray-300 */
  line-height: 1.6;
}
.content-area {
    max-width: 800px;
    margin: 60px auto 0 auto;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #D1D5DB; /* gray-300 */
  }
  .content-area p {
    margin-bottom: 20px;
  }
</style>