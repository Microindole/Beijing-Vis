<!-- 地标遭到破坏和重建的图 -->
<template>
  <div class="visualization-container">
    <div class="header">
      <h1>故宫建筑历史轨迹</h1>
      <p class="subtitle">六百年兴衰与重生</p>
      <div class="legend">
        <div class="legend-item">
          <span class="symbol fire"></span>
          <span>建筑损毁</span>
        </div>
        <div class="legend-item">
          <span class="symbol rebuild"></span>
          <span>重建修复</span>
        </div>
      </div>
    </div>

    <div class="visualization">
      <!-- 时间轴背景 -->
      <div class="timeline-background">
        <div
          class="dynasty-label"
          v-for="dynasty in dynasties"
          :style="{ left: dynasty.position }"
        >
          {{ dynasty.name }}<br />{{ dynasty.years }}
        </div>
      </div>

      <!-- 主可视化区域 -->
      <div class="main-visual">
        <!-- 建筑群轮廓 -->
        <div class="palace-silhouette"></div>

        <!-- 事件标记 -->
        <div
          v-for="(event, index) in events"
          :key="index"
          class="event-marker"
          :class="event.type"
          :style="{
            left: `${calcPosition(event.year)}%`,
            top: `${30 + (index % 3) * 20}%`,
            '--size': `${Math.sqrt(event.duration) * 2}px`,
            '--delay': `${index * 0.05}s`,
          }"
          @mouseenter="showTooltip(event, $event)"
          @mouseleave="hideTooltip"
          @click="focusEvent(index)"
        >
          <div class="marker-core"></div>
          <div class="impact-wave" v-if="activeIndex === index"></div>
        </div>

        <!-- 连接线 -->
        <svg class="connection-lines" width="100%" height="100%">
          <path
            v-for="(path, i) in connectionPaths"
            :key="'path' + i"
            :d="path.d"
            :stroke="path.color"
            stroke-width="2"
            fill="none"
            stroke-dasharray="5,3"
          />
        </svg>

        <!-- 焦点卡片 -->
        <div
          class="focus-card"
          :class="{ active: activeIndex !== null }"
          :style="{
            background: activeEvent
              ? activeEvent.type === 'damage'
                ? damageGradient
                : rebuildGradient
              : '',
            top: cardPosition.y + 'px',
            left: cardPosition.x + 'px',
          }"
        >
          <div class="card-content" v-if="activeEvent">
            <div class="card-header">
              <span class="event-icon">{{
                activeEvent.type === "damage" ? "🔥" : "🏛️"
              }}</span>
              <h3>{{ activeEvent.building }}</h3>
              <span class="year-badge">{{ activeEvent.year }}</span>
            </div>
            <div class="card-body">
              <div class="info-row">
                <label>事件类型</label>
                <span>{{
                  activeEvent.type === "damage" ? "损毁" : "重建"
                }}</span>
              </div>
              <div class="info-row" v-if="activeEvent.cause">
                <label>原因</label>
                <span>{{ activeEvent.cause }}</span>
              </div>
              <div class="info-row">
                <label>持续时间</label>
                <span>{{ activeEvent.duration }}年</span>
              </div>
              <div class="info-row">
                <label>结果</label>
                <span>{{
                  activeEvent.result ||
                  (activeEvent.type === "damage" ? "焚毁" : "重建完成")
                }}</span>
              </div>
              <div class="duration-vis">
                <div
                  class="duration-bar"
                  :style="{ width: `${activeEvent.duration * 2}px` }"
                ></div>
                <span>{{ activeEvent.duration }}年</span>
              </div>
            </div>
            <div class="card-footer" v-if="activeEvent.reference">
              参考文献: {{ activeEvent.reference }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部时间轴 -->
      <div class="time-axis">
        <div
          v-for="year in axisYears"
          :key="year"
          class="tick"
          :style="{ left: `${calcPosition(year)}%` }"
        >
          <div class="tick-line"></div>
          <div class="tick-label">{{ year }}</div>
        </div>
      </div>
    </div>

    <!-- 建筑分布小图 -->
    <div class="mini-map">
      <div
        class="building-dot"
        v-for="building in buildings"
        :key="building.name"
        :style="{ top: `${building.y}%`, left: `${building.x}%` }"
        :class="{
          active: activeEvent && activeEvent.building.includes(building.name),
        }"
      >
        <div class="building-tooltip">{{ building.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const activeIndex = ref(null);
const cardPosition = ref({ x: 0, y: 0 });

const events = [
  {
    year: 1421,
    type: "damage",
    building: "前三殿（奉天、华盖、谨身）",
    cause: "雷击火灾",
    duration: 19,
    result: "焚毁",
    reference: "1",
  },
  {
    year: 1440,
    type: "rebuild",
    building: "前三殿",
    result: "重建完成",
    duration: 5,
    reference: "1",
  },
  {
    year: 1557,
    type: "damage",
    building: "前三殿及奉天门",
    cause: "火灾",
    duration: 4,
    result: "焚毁",
    reference: "1",
  },
  {
    year: 1561,
    type: "rebuild",
    building: "文武楼",
    result: "重建完工",
    duration: 7,
    reference: "1",
  },
  {
    year: 1597,
    type: "damage",
    building: "前三殿与后三宫",
    cause: "火灾",
    duration: 30,
    result: "焚毁，1627年重建",
    reference: "1",
  },
  {
    year: 1644,
    type: "damage",
    building: "绝大部分宫殿",
    cause: "李自成焚宫",
    duration: 1,
    result: "仅武英殿幸存",
    reference: "1",
  },
  {
    year: 1645,
    type: "rebuild",
    building: "乾清宫",
    result: "建成",
    duration: 2,
    reference: "11",
  },
  {
    year: 1647,
    type: "rebuild",
    building: "午门",
    result: "重建完成",
    duration: 2,
    reference: "13",
  },
  {
    year: 1679,
    type: "damage",
    building: "太和殿",
    cause: "火灾",
    duration: 16,
    result: "焚毁",
    reference: "10",
  },
  {
    year: 1695,
    type: "rebuild",
    building: "太和殿",
    result: "木斜廊改砖卡墙",
    duration: 16,
    reference: "10",
  },
  {
    year: 1886,
    type: "damage",
    building: "太和门建筑群",
    cause: "火灾",
    duration: 8,
    result: "1894年修复",
    reference: "1",
  },
  {
    year: 1915,
    type: "damage",
    building: "千步廊区域",
    cause: "市政改造",
    duration: 6,
    result: "拆除改建",
    reference: "14",
  },
  {
    year: 1956,
    type: "rebuild",
    building: "西北角楼",
    result: "复原修缮",
    duration: 1,
    reference: "15",
  },
  {
    year: 2002,
    type: "rebuild",
    building: "武英殿区域",
    result: "持续修缮",
    duration: 18,
    reference: "15",
  },
];

const dynasties = [
  { name: "明朝", years: "1368-1644", position: "15%" },
  { name: "清朝", years: "1644-1912", position: "50%" },
  { name: "近现代", years: "1912-", position: "85%" },
];

const buildings = [
  { name: "前三殿", x: 30, y: 40 },
  { name: "后三宫", x: 30, y: 60 },
  { name: "武英殿", x: 20, y: 50 },
  { name: "太和门", x: 40, y: 30 },
  { name: "角楼", x: 10, y: 10 },
];

const axisYears = [1400, 1500, 1600, 1700, 1800, 1900, 2000];

const damageGradient =
  "linear-gradient(135deg, rgba(188, 53, 53, 0.9) 0%, rgba(139, 42, 42, 0.95) 100%)";
const rebuildGradient =
  "linear-gradient(135deg, rgba(212, 167, 106, 0.9) 0%, rgba(180, 130, 70, 0.95) 100%)";

const activeEvent = computed(() =>
  activeIndex.value !== null ? events[activeIndex.value] : null
);

const connectionPaths = computed(() => {
  const paths = [];
  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const curr = events[i];
    const x1 = calcPosition(prev.year);
    const y1 = 30 + ((i - 1) % 3) * 20;
    const x2 = calcPosition(curr.year);
    const y2 = 30 + (i % 3) * 20;

    paths.push({
      d: `M${x1}% ${y1}% C${(x1 + x2) / 2}% ${y1}%, ${
        (x1 + x2) / 2
      }% ${y2}%, ${x2}% ${y2}%`,
      color:
        prev.type === "damage"
          ? "rgba(188, 53, 53, 0.3)"
          : "rgba(212, 167, 106, 0.3)",
    });
  }
  return paths;
});

const calcPosition = (year) => {
  const minYear = 1400;
  const maxYear = 2020;
  return ((year - minYear) / (maxYear - minYear)) * 100;
};

const showTooltip = (event, mouseEvent) => {
  activeIndex.value = events.indexOf(event);
  cardPosition.value = {
    x:
      mouseEvent.clientX -
      mouseEvent.currentTarget.getBoundingClientRect().left,
    y:
      mouseEvent.clientY - mouseEvent.currentTarget.getBoundingClientRect().top,
  };
};

const hideTooltip = () => {
  activeIndex.value = null; // 注释掉以实现点击保持焦点效果
};

const focusEvent = (index) => {
  activeIndex.value = index;
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap");

.visualization-container {
  font-family: "Noto Serif SC", serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
  background: linear-gradient(to bottom, #f9f5f0 0%, #f0e6d6 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

h1 {
  font-size: 2.5rem;
  color: #8b2a2a;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1.2rem;
  color: #d4a76a;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.symbol {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.symbol.fire {
  background: radial-gradient(circle, #ff6b6b 0%, #8b2a2a 100%);
  box-shadow: 0 0 5px rgba(139, 42, 42, 0.5);
}

.symbol.rebuild {
  background: radial-gradient(circle, #f8d49d 0%, #d4a76a 100%);
  box-shadow: 0 0 5px rgba(212, 167, 106, 0.5);
}

.visualization {
  position: relative;
  height: 500px;
  margin-bottom: 3rem;
}

.timeline-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(212, 167, 106, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.dynasty-label {
  position: absolute;
  top: 10px;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.9rem;
  color: #8b2a2a;
  font-weight: bold;
  line-height: 1.3;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.main-visual {
  position: relative;
  width: 100%;
  height: 100%;
}

.palace-silhouette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path d="M10,30 L20,20 L30,30 L40,20 L50,30 L60,20 L70,30 L80,20 L90,30 L90,80 L10,80 Z" fill="%238b2a2a"/></svg>');
  background-repeat: no-repeat;
  background-position: center 70%;
  background-size: 60%;
}

.event-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  animation: fadeIn 0.5s ease var(--delay) forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.event-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 3;
}

.event-marker.damage .marker-core {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle, #ff6b6b 0%, #8b2a2a 70%);
  box-shadow: 0 0 10px rgba(139, 42, 42, 0.5), 0 0 20px rgba(255, 107, 107, 0.3);
}

.event-marker.rebuild .marker-core {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle, #f8d49d 0%, #d4a76a 70%);
  box-shadow: 0 0 10px rgba(212, 167, 106, 0.5),
    0 0 20px rgba(248, 212, 157, 0.3);
}

.impact-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: wave 1.5s ease-out infinite;
}

@keyframes wave {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.focus-card {
  position: absolute;
  width: 280px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: translate(-50%, 20px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
  pointer-events: none;
}

.focus-card.active {
  opacity: 1;
  transform: translate(-50%, 10px);
}

.card-content {
  padding: 1.2rem;
  color: white;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.event-icon {
  font-size: 1.5rem;
  margin-right: 0.8rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  flex-grow: 1;
}

.year-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.card-body {
  font-size: 0.9rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-row label {
  width: 70px;
  font-weight: bold;
  opacity: 0.8;
}

.duration-vis {
  margin-top: 1rem;
  display: flex;
  align-items: center;
}

.duration-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  margin-right: 0.5rem;
  border-radius: 4px;
}

.card-footer {
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
  opacity: 0.8;
}

.time-axis {
  position: relative;
  height: 50px;
  margin-top: 1rem;
  border-top: 1px solid #d4a76a;
}

.tick {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}

.tick-line {
  height: 10px;
  width: 1px;
  background: #8b2a2a;
  margin: 0 auto;
}

.tick-label {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #8b2a2a;
}

.mini-map {
  position: relative;
  height: 200px;
  background: #f0e6d6;
  border-radius: 8px;
  margin-top: 2rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.1"><path d="M10,10 L90,10 L90,90 L10,90 Z M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="%238b2a2a" stroke-width="0.5"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
}

.building-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8b2a2a;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.building-dot.active {
  width: 16px;
  height: 16px;
  background: #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3);
  z-index: 2;
}

.building-tooltip {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #8b2a2a;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.building-dot:hover .building-tooltip {
  opacity: 1;
}
</style>
