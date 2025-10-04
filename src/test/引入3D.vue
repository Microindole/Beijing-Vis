<template>
  <!-- 3D Cesium容器 -->
  <div class="3d-viewer-container">
    <CesiumViewer
      modelPath="/models/beijing_temple.glb"
      :longitude="116.4074"
      :latitude="39.9042"
      :height="0"
      :flyToRange="800"
    />
  </div>
</template>
