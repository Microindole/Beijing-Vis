<template>
  <div class="legends-container">
    
    <!-- 页面标题 -->
    <div class="legends-header">
      <h1>北海千年传奇秘闻</h1>
      <p>从辽金皇家园林到白塔传说，探寻北海公园背后的历史与神话</p>
    </div>
    
    <CharacterHub></CharacterHub>
    <Sayings></Sayings>
    <ParkStories></ParkStories>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import CharacterHub from "./CharacterHub.vue";
import Sayings from "./Sayings.vue";
import ParkStories from "./Stories.vue"

const router = useRouter();

// 返回北海公园门户主页
const goBack = () => router.push("/landmarks/beihai-park");
</script>

<style scoped>
:root {
  --primary-color: #3a6c4f;
  --secondary-color: #b3cbb9;
  --accent-color: #5e8c6a;
  --text-dark: #2d3a2e;
  --text-medium: #4e5d4a;
  --text-light: #7a8c7a;
  --bg-light: #eaf3ec;
  --bg-lighter: #f6fbf7;
  --bg-dark: #254032;
  --border-radius: 12px;
  --box-shadow: 0 8px 30px rgba(58, 108, 79, 0.12);
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
  background-color: #b3cbb9;
}

.legends-container {
  background: linear-gradient(135deg, #eaf3ec 0%, #d1e3d6 100%);
  padding: 2rem;
  position: relative;
  font-family: "Noto Serif SC", serif;
  color: var(--text-dark);
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(58, 108, 79, 0.85);
  color: #f6fbf7;
  border: 1px solid #3a6c4f;
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
  background-color: rgba(94, 140, 106, 0.95);
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
  color: #3a6c4f;
  margin-bottom: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: "Noto Serif SC", serif;
}

.legends-header p {
  font-size: 1.2rem;
  color: #4e5d4a;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.92;
}

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