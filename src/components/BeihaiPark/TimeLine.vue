<!-- 大事件时间轴图 -->
<template>
  <div class="timeline-container">
    <div class="timeline">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="timeline-item"
        @click="$emit('show-network', event)"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>{{ event.year }}年</h3>
          <p>{{ event.event }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    required: true,
  },
});

defineEmits(["show-network"]);
</script>

<style scoped>
.timeline-container {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f5f0e6" opacity="0.8"/><path d="M0,50 L100,50 M50,0 L50,100" stroke="%23d9c7a7" stroke-width="1" stroke-dasharray="5,5"/></svg>');
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #d9c7a7;
}

.timeline {
  position: relative;
  padding-left: 60px;
  margin-top: 20px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 28px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #8b5a2b, #d9c7a7, #8b5a2b);
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(139, 90, 43, 0.3);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(8px);
}

.timeline-dot {
  position: absolute;
  left: -50px;
  top: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #8b5a2b;
  border: 4px solid #f5f0e6;
  box-shadow: 0 0 0 3px #8b5a2b, 0 0 10px rgba(139, 90, 43, 0.5);
  z-index: 1;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  background: #a67c52;
  box-shadow: 0 0 0 3px #a67c52, 0 0 15px rgba(166, 124, 82, 0.7);
}

.timeline-content {
  padding: 15px 20px;
  border-radius: 6px;
  background: rgba(245, 240, 230, 0.9);
  border-left: 4px solid #8b5a2b;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.timeline-content::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 15px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #8b5a2b;
}

.timeline-item:hover .timeline-content {
  background: rgba(255, 253, 245, 0.95);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.15);
  border-left-color: #a67c52;
}

.timeline-content h3 {
  margin: 0 0 8px 0;
  color: #5c3a21;
  font-size: 18px;
  font-weight: bold;
  font-family: "SimSun", serif;
}

.timeline-content p {
  margin: 0;
  color: #7a5c3d;
  font-size: 14px;
  line-height: 1.5;
  font-family: "KaiTi", serif;
}
</style>
