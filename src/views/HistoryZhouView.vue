<template>
  <div class="history-zhou-view">
    <div class="page-header">
      <h2>朝代发展脉络：建制与经济时间轴</h2>
      <p>
        此视图通过交互式时间轴，并行展示了北京在各个历史时期内“建制沿革”与“商业手工业”的关键事件。
        将鼠标悬停在条目上可查看摘要，点击可查看详细信息。
      </p>
    </div>

    <HistoryTimeline />

  </div>
</template>

<script setup>
// 引入上面经过优化的 HistoryTimeline.vue 组件
import HistoryTimeline from '@/components/charts/HistoryTimeline.vue';
</script>

<style scoped>
.history-zhou-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}
.page-header h2 {
  margin-bottom: 10px;
  font-size: 1.8em;
  color: #333;
}
.page-header p {
  font-size: 1em;
  color: #666;
}
</style>