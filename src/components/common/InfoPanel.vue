<template>
  <div class="info-panel">
    <div v-if="selectedItem" class="content">
      <h3>{{ selectedItem.name }}</h3>
      <ul>
        <li><strong>时期:</strong> {{ selectedItem.value[3] || '未知' }}</li>
        <li><strong>类型:</strong> {{ formatType(selectedItem.value[2]) }}</li>
        </ul>
      <p v-if="selectedItem.description">
        {{ selectedItem.description }}
      </p>
    </div>
    <div v-else class="placeholder">
      <p>请在地图上点击一个事件点以查看详情</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedItem: Object // 接收一个对象作为选中项的数据
});

function formatType(typeKey) {
  const typeMap = { 'disaster': '灾害', 'war': '战争', 'event': '事件' };
  return typeMap[typeKey] || '未知';
}
</script>

<style scoped>
.info-panel {
  padding: 15px;
  height: 100%;
  color: var(--primary-text-color);
}
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--secondary-text-color);
}
.content h3 {
  margin-top: 0;
  color: var(--header-bg-color);
}
.content ul {
  list-style-type: none;
  padding-left: 0;
}
.content li {
  margin-bottom: 8px;
}
</style>