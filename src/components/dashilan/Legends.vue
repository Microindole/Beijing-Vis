<template>
  <div class="legends-container">
    <GugongCharacterHub></GugongCharacterHub>
    <palaceSayings></palaceSayings>
    <lanstories></lanstories>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import GugongCharacterHub from "./GugongCharacterHub.vue";
import palaceSayings from "./PalaceSayings.vue";
import lanstories from "./Stories.vue"

const router = useRouter();

// 返回门户主页

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

.legends-container {
  background: linear-gradient(135deg, #f5f2e9 0%, #e8d8c3 100%);
  padding: 2rem;
  position: relative;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f2e9;
}

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
</style>
