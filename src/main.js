// src/main.js (Vue 3 + Vite)

import { createApp } from "vue"; // <-- 注意这里是命名导入 'createApp'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart } from "echarts/charts";
import App from "./App.vue";
import ElementPlus from "element-plus";
import ECharts from "vue-echarts";
import router from "./router"; // 确保路径正确
import "element-plus/dist/index.css";

use([CanvasRenderer, RadarChart]);

const app = createApp(App); // <-- 使用 createApp 函数创建应用实例
app.use(router); // 注册 Vue Router
app.use(ElementPlus);
app.component("v-chart", ECharts);
app.mount("#app");
