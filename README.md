# beijing-vis

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
### 🛠️ 核心技术栈与开发约定

为了确保项目的高效开发和高解耦，我们遵循以下技术选型和文件处理约定：

| 方面 | 约定/选择 | 目的 | 负责角色 |
| :--- | :--- | :--- | :--- |
| **前端框架** | **Vue 3 (Composition API) + Vite** | 提供组件化、快速构建和状态管理基础。
| **可视化库** | **D3.js** | 负责复杂数据绑定和图形绘制。 | P2, P3, P1 |
| **状态管理** | **Pinia** | 集中管理全局状态（如时间、筛选器）和原始数据，实现高解耦联动。
| **数据存放** | **`public/data/`** | 确保前端能通过 `/data/filename.json` 路径异步加载，模拟 API 接口。 
| **代码解耦** | 使用 **`src/composables/`** 目录 | 封装所有纯逻辑函数和 D3 计算方法，确保视图和逻辑分离。 

### 📁 项目目录结构 (高解耦蓝图)
(项目根目录)/
├── public/
│   └── data/                 # 【数据存储地】 最终交付的所有 JSON/GeoJSON 文件
│
├── src/
│   ├── api/                  # 数据加载与 Pinia Store 定义
│   │   ├── dataLoader.js     # 封装 fetch('/data/...') 的方法
│   │   └── useDataStore.js   # Pinia Store: 负责加载、缓存和提供原始数据
│   │
│   ├── assets/               # 静态资源与样式
│   │   └── styles/
│   │       ├── others.css    # 其他全局样式
│   │       └── global.css    # App.vue 的布局样式
│   │
│   ├── composables/          # 【逻辑解耦核心】纯逻辑函数和可复用状态
│   │   ├── useGlobalTime.js  # 管理全局时间状态和时间轴逻辑
│   │   ├── useDataProcessing.js # 运行时的数据转换、聚合函数
│   │   └── useD3Scales.js    # D3 比例尺、坐标轴创建等通用函数
│   │
│   ├── components/
│   │   ├── base/             # 基础 UI/交互组件
│   │   ├── charts/           # 封装统计图表
│   │   ├── map/              # 封装地图组件和图层
│   │   └── views/            # 视图容器
│   │       ├── Task1EcoView.vue
│   │       ├── Task2EventView.vue
│   │       └── Task5Narrative.vue
│   │
│   ├── App.vue               # 干净的布局和启动逻辑
│   └── main.js               # 应用入口