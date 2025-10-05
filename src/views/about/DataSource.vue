<template>
  <div class="content-area">
  <h2>主要数据来源：</h2>
  <ul>
    <li>《北京地方志》</li>
    <li>维基百科、百度百科等公开网络资源</li>
    <li>各大地标官方网站介绍</li>
    <li>中国历史地理信息系统 (CHGIS)</li>
  </ul>
  <p>所有数据均经过整理与交叉验证，仅供课程项目展示使用。</p>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1); // 返回上一个历史记录
};
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
</style>