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
### 📁 项目目录结构 (仅供参考)

* **(项目根目录)**
  * **public/**
    * **json/**           # 🗄️ 数据存储地：所有最终的 JSON/GeoJSON 静态数据文件
    * **icons/**          # 🎨 图标资源
    * **images/**         # 🖼️ 图片资源
    * favicon.ico         # 🌐 网站图标
    * index.html          # 📄 HTML 模板

  * **src/**
    * **api/**
      * `dataLoader.js`           # 📥 数据加载层：负责数据获取和预处理
      * `useDataStore.js`         # 🏪 Pinia Store 状态管理
      * `services/`               # 🔌 API 服务层
        * `dataService.js`        # 数据相关 API 调用
        * `mapService.js`         # 地图相关 API 调用

    * **assets/**
      * **styles/**
        * `variables.css`         # 🎨 CSS 变量和设计令牌
        * `reset.css`             # 🔄 重置样式和标准化
        * `global.css`            # 🌍 全局样式和布局
        * `mixins.css`            # ⚙️ CSS 混合和工具类
      * **fonts/**                # 🔤 字体文件
      * **images/**               # 🖼️ 组件专用图片资源

    * **components/**
      * **common/**               # 🔧 通用基础组件
        * `BaseButton.vue`
        * `BaseModal.vue`
        * `BaseLoading.vue`
      * **icon/**                 # 🎯 图标组件
        * `IconMap.vue`
        * `IconChart.vue`
      * **impact-event/**         # ⚡ 影响事件相关组件
        * `EventCard.vue`
        * `EventList.vue`
        * `EventDetail.vue`
      * **layout/**               # 🏗️ 布局组件
        * `AppHeader.vue`
        * `AppSidebar.vue`
        * `AppFooter.vue`
      * **charts/**               # 📊 图表组件
      * **maps/**                 # 🗺️ 地图组件

    * **composables/**            # 💡 Vue 组合式函数
      * `useMapInteraction.js`    # 地图交互逻辑
      * `useDataFilter.js`        # 数据过滤逻辑
      * `useChartConfig.js`       # 图表配置逻辑

    * **router/**                 # 🧭 路由配置
      * `index.js`                # 路由主文件
      * `routes.js`               # 路由定义
      * `guards.js`               # 路由守卫

    * **stores/**                 # 🏪 Pinia 状态管理
      * `index.js`                # Store 主文件
      * `useAppStore.js`          # 应用全局状态
      * `useMapStore.js`          # 地图相关状态
      * `useDataStore.js`         # 数据相关状态

    * **utils/**                  # 🛠️ 通用工具函数
      * `constants.js`            # 📋 常量定义
      * `helpers.js`              # 🔧 辅助函数
      * `formatters.js`           # ⚙️ 数据格式化
      * `validators.js`           # ✅ 数据验证
      * **libs/**                 # 📚 第三方库封装
        * `mapUtils.js`           # 地图工具库
        * `chartUtils.js`         # 图表工具库

    * **views/**                  # 🖼️ 页面视图容器
      * **dashboard/**            # 📈 仪表板页面
        * `DashboardView.vue`
      * **map/**                  # 🗺️ 地图页面
        * `MapView.vue`
      * **events/**               # 📅 事件管理页面
        * `EventsView.vue`
        * `EventDetailView.vue`
      * **analysis/**             # 📊 分析页面
        * `AnalysisView.vue`

    * **App.vue**                 # 🎯 应用根组件 - 干净的布局和启动逻辑
    * **main.js**                 # ⚡ 应用入口文件

* **配置文件**
  * `package.json`               # 📦 项目依赖和脚本
  * `vite.config.js`             # ⚡ Vite 构建配置
  * `jsconfig.json`              # 🔧 JavaScript 配置
  * `.env`                       # 🔐 环境变量
  * `.env.development`           # 🛠️ 开发环境变量
  * `.env.production`            # 🚀 生产环境变量

* **文档文件**
  * `README.md`                  # 📖 项目说明文档
  * `CHANGELOG.md`               # 📝 更新日志
  * `CONTRIBUTING.md`            # 👥 贡献指南