<template>
  <div class="narrative-panel">
    <div v-if="node" class="content">
      <img
        v-if="node.image"
        :src="getImageUrl(node.image)"
        :alt="node.name"
        class="node-image"
      />
      <h2>{{ node.name }}</h2>
      <span class="category-tag">{{ node.category }}</span>
      <p class="description">{{ node.description }}</p>
    </div>
    <div v-else class="placeholder">
      <p>请在左侧关系图中点击一个节点，以查看详细信息。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NarrativePanel",
  props: {
    node: { type: Object, default: null },
  },
  methods: {
    getImageUrl(imagePath) {
      try {
        // 假设图片都存放在 @/assets/ 目录下
        return require(`@/assets/${imagePath}`);
      } catch (e) {
        console.warn(`Image not found: ${imagePath}`);
        return ""; // 或者返回一个默认的占位图
      }
    },
  },
};
</script>

<style scoped>
.narrative-panel {
  padding: 25px;
  background-color: #fdfaf3;
  border-left: 1px solid #e8d8c3;
  overflow-y: auto;
  height: 100%;
  font-family: "Noto Serif SC", serif;
}
.node-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}
h2 {
  font-size: 1.8em;
  color: #8b4513;
  margin-top: 0;
  margin-bottom: 10px;
}
.category-tag {
  display: inline-block;
  background-color: #e8d8c3;
  color: #5a4a42;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85em;
  margin-bottom: 20px;
}
.description {
  font-size: 1em;
  line-height: 1.8;
  color: #333;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #999;
}
</style>
