<template>
  <div class="legends-container">

    <!-- 页面标题 -->
    <div class="legends-header">
      <h1>长城千年传奇秘闻</h1>
      <p>从秦汉筑城到明清防御，探寻长城背后的历史故事与民族神话</p>
    </div>
    
    <CharacterHub></CharacterHub>
    <Sayings></Sayings>
    <Stories></Stories>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import CharacterHub from "./CharacterHub.vue";
import Sayings from "./Sayings.vue";
import Stories from "./Stories.vue";

const router = useRouter();

// 返回长城门户主页
</script>

<style scoped>
:root {
  /* 定义新的棕褐色系颜色变量 */
  --primary-color: #8b4513; /* 深棕色，作为主色 */
  --secondary-color: #d4a76a; /* 中棕色，作为辅助色 */
  --accent-color: #a0522d; /* 强调色，略带红的棕色 */
  --text-dark: #3e2723; /* 最深文字色 */
  --text-medium: #5a4a42; /* 中等文字色 */
  --text-light: #7a6b64; /* 浅文字色 */
  --bg-light: #f9f5ed; /* 浅背景色 */
  --bg-lighter: #fff8e1; /* 更浅背景色 */
  --bg-dark: #33211a; /* 最深背景色 */
  --border-radius: 12px;
  --box-shadow: 0 8px 30px rgba(101, 67, 33, 0.12); /* 阴影颜色 */
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
  /* 调整 body 背景色 */
  background-color: #e8d8c3; /* 对应新的 --secondary-color 附近 */
}

.legends-container {
  background: linear-gradient(135deg, #f9f5ed 0%, #e8d8c3 100%);
  padding: 2rem;
  position: relative;
  font-family: "Noto Serif SC", serif;
  color: var(--text-dark);
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  /* 调整按钮背景色 */
  background-color: rgba(139, 69, 19, 0.85); /* 对应 --primary-color 的透明度 */
  color: #fff;
  /* 调整边框颜色 */
  border: 1px solid var(--primary-color);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 3px 12px rgb(0, 0, 0);
}

.back-button:hover {
  /* 调整 hover 状态的背景色 */
  background-color: rgba(160, 82, 45, 0.95); /* 对应 --accent-color 的透明度 */
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
  /* 调整标题颜色 */
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
  font-family: "Noto Serif SC", serif;
}

.legends-header p {
  font-size: 1.2rem;
  /* 调整段落文字颜色 */
  color: var(--text-medium);
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