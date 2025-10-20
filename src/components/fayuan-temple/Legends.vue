<template>
  <div class="legends-container">
    <button @click="goBack" class="back-button">← 返回法源寺门户</button>
    
    <!-- 页面标题 -->
    <div class="legends-header">
      <h1>法源寺千年传奇</h1>
      <p>从高僧圣迹到历史名人，感受古刹背后的千年风云</p>
    </div>
    
    <CharacterHub></CharacterHub>
    <Sayings></Sayings>
    <TemStories></TemStories>
    
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import CharacterHub from "./CharacterHub.vue";
import Sayings from "./Sayings.vue";
import TemStories from "./Stories.vue";

const router = useRouter();

// 返回门户主页
const goBack = () => router.push("/landmarks/fayuan-temple");


</script>

<style scoped>
/* 基础样式 */
:root {
  --primary-color: #8b4513;
  --secondary-color: #d4a76a;
  --accent-color: #a0522d;
  --text-dark: #333333;
  --text-medium: #5a4a42;
  --text-light: #7a6b64;
  --bg-light: #f9f5ed;
  --bg-lighter: #fff8e1;
  --bg-dark: #3e2723;
  --border-radius: 12px;
  --box-shadow: 0 8px 30px rgba(101, 67, 33, 0.12);
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@font-face {
  font-family: "Noto Serif SC";
  src: url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap");
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #c5ac63;
}

.dashboard-container {
  font-family: "Noto Serif SC", serif;
  color: var(--text-dark);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0e6d1 0%, #e2d4b7 100%);
  padding: 0;
  overflow-x: hidden;
}

/* 导航区样式 */
.dashboard-nav {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--accent-color) 100%
  );
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
}

.nav-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: var(--transition);
  backdrop-filter: blur(5px);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-5px);
}

.icon-back {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.legends-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  padding: 2rem;
  position: relative;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(94, 66, 41, 0.8);
  color: #fff8e1;
  border: 1px solid #5d4037;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: rgba(121, 85, 72, 0.9);
  transform: translateX(-2px);
}

.legends-header {
  text-align: center;
  padding: 4rem 2rem 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.legends-header h1 {
  font-size: 2.8rem;
  color: #8b4513;
  margin-bottom: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Noto Serif SC", serif;
}

.legends-header p {
  font-size: 1.2rem;
  color: #5a4a42;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .legends-container {
    padding: 1rem;
  }

  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .legends-header {
    padding: 3rem 1rem 1.5rem;
  }

  .legends-header h1 {
    font-size: 2rem;
  }

  .legends-header p {
    font-size: 1rem;
    padding: 0 1rem;
  }
}
</style>
