<template>
  <!-- 3D 模型的网页嵌入 -->
  <div id="cesiumContainer" class="cesium-container"></div>
</template>

<script>
// 直接从 node_modules 导入 Cesium 模块
import * as Cesium from "cesium";
// 导入 Cesium 样式，Vite 会处理好 CSS 导入
import "cesium/Build/Cesium/Widgets/widgets.css";

export default {
  name: "CesiumViewer",
  props: {
    modelPath: {
      type: String,
      required: true,
      default: "/models/beijing_temple.glb", // 默认值，确保文件存在于 public/models/
    },
    longitude: {
      type: Number,
      default: 116.40713,
    },
    latitude: {
      type: Number,
      default: 39.88199,
    },
    height: {
      type: Number,
      default: 0,
    },
    flyToRange: {
      type: Number,
      default: 500,
    },
  },
  mounted() {
    this.initCesiumViewer();
  },
  methods: {
    initCesiumViewer() {
      // **关键一步：设置 Cesium 静态资源路径**
      // 这是 Vite 环境下的正确方式，告诉 Cesium 它的 worker, asset 等文件在哪里
      // 'cesium/' 对应 vite.config.js 中 `dest: 'cesium'` 的设置
      // 这将在运行时动态构建资源路径。
      Cesium.buildModuleUrl.setBaseUrl("/cesium/");

      // 你需要一个 Cesium Ion Access Token
      // 注册并获取一个 Token: https://ion.cesium.com/
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNGU5Njg5NC05ODgxLTRjZTMtODZiZi0wY2FmOTQ2OWE5ZGMiLCJpZCI6MzA3NzA0LCJpYXQiOjE3NDg1NzUxMzZ9.0dMb3OG2ILF8pLuw5QdZIB-yxfRkoMrtKq5s0z9CeqY"; // <<< 替换为你的 Ion Token

      const viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
      });

      // 调整默认相机视角
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          this.longitude,
          this.latitude,
          this.flyToRange * 1.2
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-30.0),
          roll: 0.0,
        },
      });

      // 加载 GLB 模型
      const modelEntity = viewer.entities.add({
        name: "北京寺庙",
        position: Cesium.Cartesian3.fromDegrees(
          this.longitude,
          this.latitude,
          this.height
        ),
        model: {
          uri: this.modelPath,
          minimumPixelSize: 128,
          maximumScale: 20000,
        },
      });

      // 飞到模型位置
      viewer
        .flyTo(modelEntity, {
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-10),
            this.flyToRange * 0.03
          ),
          duration: 3,
        })
        .then(() => {
          console.log("模型加载并飞行到位置成功！");
        })
        .catch((error) => {
          console.error("模型加载或飞行失败:", error);
        });

      // 示例：添加点击交互
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && pickedObject.id === modelEntity) {
          console.log("点击了北京寺庙模型！");
          alert("你点击了北京寺庙模型！\n这里可以展示更多关于地标的详细信息。");
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.viewer = viewer;
    },
  },
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  },
};
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
