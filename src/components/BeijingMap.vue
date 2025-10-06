<template>
  <div class="map-container">
    <svg ref="mapSvg" width="100%" height="100%" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5e9d2" />
          <stop offset="100%" stop-color="#e2d4c0" />
        </linearGradient>

        <radialGradient id="markerGradient">
          <stop offset="0%" stop-color="#f8b350" />
          <stop offset="100%" stop-color="#bd6b20" />
        </radialGradient>

        <linearGradient id="labelBgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff8e1" />
          <stop offset="100%" stop-color="#fef8f0" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="parchment-texture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="10" result="turbulence"/>
          <feDiffuseLighting in="turbulence" lighting-color="#ebe2d1" surfaceScale="3" result="lit">
            <feDistantLight azimuth="45" elevation="50"/>
          </feDiffuseLighting>
          <feComposite in="lit" in2="SourceAlpha" operator="in" result="textured"/>
          <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
        </filter>

        <filter id="terrain-texture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.03" numOctaves="4" seed="2" result="noise"/>
          <feDiffuseLighting in="noise" lighting-color="#ebe2d1" surfaceScale="2" result="terrain">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
          <feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/>
          <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
        </filter>

        <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="4" result="grain"/>
          <feColorMatrix in="grain" type="saturate" values="0" result="desaturated"/>
          <feComponentTransfer in="desaturated" result="grain2">
            <feFuncA type="table" tableValues="0 0.05"/>
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="grain2" mode="multiply"/>
        </filter>

        <filter id="combined-texture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.03" numOctaves="4" seed="2" result="noise"/>
          <feDiffuseLighting in="noise" lighting-color="#ebe2d1" surfaceScale="2" result="terrain">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
          <feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/>
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="3" result="grain"/>
          <feColorMatrix in="grain" type="saturate" values="0" result="grain-gray"/>
          <feComponentTransfer in="grain-gray" result="grain-final">
            <feFuncA type="table" tableValues="0 0.03"/>
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="textured" mode="multiply" result="step1"/>
          <feBlend in="step1" in2="grain-final" mode="multiply"/>
        </filter>
      </defs>

      <g class="map-layer"></g>

      <g class="connectors-layer" v-if="projection">
        <path
            v-for="landmark in landmarks"
            :key="'connector-' + landmark.id"
            class="connector-line"
            :d="getConnectorPath(landmark)"
        />
      </g>

      <g class="landmarks-layer" v-if="projection">
        <g
            v-for="landmark in landmarks"
            :key="landmark.id"
            class="landmark-marker"
            :transform="`translate(${projection(landmark.position)[0]}, ${
            projection(landmark.position)[1]
          })`"
        >
          <circle
              class="marker-dot"
              r="4"
              :class="{ highlight: landmark.id === activeLandmarkId }"
              @mouseenter="showTooltip(landmark, $event)"
              @mouseleave="hideTooltip"
              @click="handleLandmarkClick(landmark)"
          />
        </g>
      </g>

      <g class="labels-layer" v-if="projection">
        <g
            v-for="landmark in landmarks"
            :key="'label-' + landmark.id"
            :transform="`translate(${getLabelPosition(landmark)[0]}, ${
            getLabelPosition(landmark)[1]
          })`"
        >
          <rect
              class="label-bg"
              x="-55"
              y="-14"
              width="110"
              height="28"
              rx="6"
              @mouseenter="showTooltip(landmark, $event)"
              @mouseleave="hideTooltip"
              @click="handleLandmarkClick(landmark)"
          />
          <text
              class="label-text"
              text-anchor="middle"
              dominant-baseline="middle"
          >
            {{ landmark.name }}
          </text>
        </g>
      </g>
    </svg>
    <div
        v-if="activeTooltip"
        class="tooltip"
        :style="{
        left: tooltipPosition.x + 'px',
        top: tooltipPosition.y + 'px',
      }"
    >
      <h3>{{ activeTooltip.name }}</h3>
      <p>{{ activeTooltip.description || "暂无简介" }}</p>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    mapData: Array,
    colorScaleConfig: Object,
    landmarks: Array,
    zoomLevel: { type: Number, default: 1 },
  },
  emits: ["area-clicked", "landmark-clicked"],
  data() {
    return {
      svg: null,
      projection: null,
      path: null,
      colorScale: null,
      beijingFeatures: null,
      activeTooltip: null,
      tooltipPosition: { x: 0, y: 0 },
      highlightedLandmark: null,
      tooltipTimer: null,
      textureIntensity: 'medium', // 'low', 'medium', 'high'
    };
  },
  computed: {
    visibleLandmarks() {
      // 根据缩放级别决定显示哪些标记
      return this.landmarks.filter((landmark) => {
        return (
            this.zoomLevel > 0.5 ||
            ["forbiddenCity", "templeOfHeaven", "greatWall"].includes(landmark.id)
        );
      });
    },
  },
  async mounted() {
    this.svg = d3.select(this.$refs.mapSvg);
    const geoJson = await d3.json(
        "./beijing_geojson_filer/北京市区geojson地图文件/北京.json"
    );
    this.beijingFeatures = geoJson.features;
    this.initMap();
    this.drawMap();
  },
  methods: {
    initMap() {
      this.projection = d3.geoIdentity().reflectY(true).fitSize([800, 600], {
        type: "FeatureCollection",
        features: this.beijingFeatures,
      });
      this.path = d3.geoPath().projection(this.projection);
      this.colorScale = d3
          .scaleLinear()
          .domain(this.colorScaleConfig.domain)
          .range(this.colorScaleConfig.range);
    },
    drawMap() {
      const mapLayer = this.svg.select(".map-layer");
      const dataMap = new Map(
          this.mapData.map((item) => [item.name, item.value])
      );

      const areas = mapLayer
          .selectAll("path")
          .data(this.beijingFeatures, (d) => d.properties.name);

      areas
          .enter()
          .append("path")
          .attr("d", this.path)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.8)
          .on("click", (event, d) => {
            this.$emit("area-clicked", d.properties.name);
          })
          .merge(areas)
          .attr("fill", (d) => {
            const val = dataMap.get(d.properties.name);
            return val !== undefined ? this.colorScale(val) : "#ccc";
          })
          // ========== 修改这里：使用组合纹理 ==========
          .attr("filter", "url(#combined-texture)")
          // ========== 添加鼠标悬停效果 ==========
          .on("mouseenter", function() {
            d3.select(this)
                .attr("filter", "none")  // 悬停时移除纹理，显示清晰颜色
                .attr("stroke", "#bd6b20")
                .attr("stroke-width", 2);
          })
          .on("mouseleave", function() {
            d3.select(this)
                .attr("filter", "url(#combined-texture)")  // 恢复纹理
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.8);
          });

      areas.exit().remove();

      // 区域名称标注
      const labels = mapLayer
          .selectAll("text")
          .data(this.beijingFeatures, (d) => d.properties.name);
      labels
          .enter()
          .append("text")
          .attr("x", (d) => this.projection(d.properties.centroid)[0])
          .attr("y", (d) => this.projection(d.properties.centroid)[1])
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .text((d) => d.properties.name)
          .merge(labels);
    },
    handleLandmarkClick(landmark) {
      this.highlightMarker(landmark.id);
      this.$emit("landmark-clicked", landmark);
    },
    showTooltip(landmark, event) {
      clearTimeout(this.tooltipTimer);
      this.activeTooltip = {
        name: landmark.name,
        description: this.getLandmarkDescription(landmark.id),
      };
      this.tooltipPosition = {
        x: event.clientX - 500,
        y: event.clientY - 120,
      };
      this.highlightMarker(landmark.id);
    },
    hideTooltip() {
      this.tooltipTimer = setTimeout(() => {
        this.activeTooltip = null;
        this.highlightedLandmark = null;
      }, 300);
    },
    highlightMarker(landmarkId) {
      this.highlightedLandmark = landmarkId;
      setTimeout(() => {
        this.highlightedLandmark = null;
      }, 1000);
    },
    getLandmarkDescription(id) {
      const descriptions = {
        forbiddenCity:
            "明清两代的皇家宫殿，世界上现存规模最大、保存最完整的木质结构古建筑之一",
        templeOfHeaven: "明清两代帝王祭天、祈谷的场所，世界文化遗产",
        greatWall: "中国古代的军事防御工程，世界新七大奇迹之一",
        mingTombs: "明朝十三位皇帝的陵墓群，世界文化遗产",
        beihaiPark: "中国现存最古老、最完整、最具综合性和代表性的皇家园林之一",
        fayuanTemple: "北京最古老的名刹之一，中国佛学院所在地",
        summerPalace: "清朝皇家园林，被誉为'皇家园林博物馆'",
        dashilan: "北京著名的商业街，有着悠久的历史和丰富的文化底蕴",
      };
      return descriptions[id] || "暂无详细描述";
    },
    shouldShowLabel(landmark) {
      // 根据缩放级别决定是否显示标签
      return (
          this.zoomLevel > 0.8 ||
          ["forbiddenCity", "templeOfHeaven", "greatWall"].includes(landmark.id)
      );
    },
    getConnectorPath(landmark) {
      const start = this.projection(landmark.position);
      const end = this.getLabelPosition(landmark);
      return `M${start[0]},${start[1]} L${end[0]},${end[1]}`;
    },
    getLabelPosition(landmark) {
      const center = this.projection(landmark.position);
      const angle = this.getLabelAngle(landmark.id); // 为每个景点预设角度
      const radius = 150; // 标签距离中心的半径

      return [
        center[0] + Math.cos(angle) * radius,
        center[1] + Math.sin(angle) * radius,
      ];
    },
    // 改标签出现的地方
    getLabelAngle(id) {
      // 为每个景点分配固定角度（按ID哈希）
      const angleMap = {
        forbiddenCity: 0.5,
        templeOfHeaven: 1.0,
        greatWall: 5.5,
        mingTombs: 3.8,
        beihaiPark: 6.1,
        fayuanTemple: 3.0,
        summerPalace: 5.1,
        dashilan: 2.0,
      };
      return angleMap[id] || Math.PI * 2 * Math.random();
    },
  },
};
</script>

<style scoped>
/* 颜色变量 (请确保与全局变量一致) */
:root {
  --primary-color: #8b4513; /* 深棕色 */
  --secondary-color: #d4a76a; /* 中棕色 */
  --accent-color: #a0522d; /* 强调色 */
  --text-dark: #3e2723;
  --text-medium: #5a4a42;
  --text-light: #7a6b64;
  --bg-light: #f9f5ed;
  --bg-lighter: #fff8e1;
  --tooltip-bg: #fff8e1; /* 工具提示背景色 */
  --tooltip-border: #d4a76a; /* 工具提示边框色 */
  --marker-glow-color: #f8b350; /* 标记点发光色 */
}

/* ==================== 修改：优化地图路径及交互样式 ==================== */
.map-layer path {
  cursor: pointer;
  /* 平滑过渡所有属性，特别是滤镜和变换 */
  transition: all 0.3s ease-in-out, filter 0.3s ease-in-out;
}

.map-layer path:hover {
  /* 当鼠标悬浮时，移除纹理滤镜，让颜色变得清晰，
    同时描边变色加粗，并略微上浮和放大，提供清晰的视觉反馈
  */
  filter: none;
  stroke: var(--accent-color);
  stroke-width: 1.5;
  transform: translateY(-2px) scale(1.01);
  /* 使用一个更明亮的颜色来高亮，而不是原来的固定色 */
  fill: #f0d8a8;
}
/* =================================================================== */

/* 连接线层 */
.connectors-layer {
  pointer-events: none; /* 不响应鼠标事件 */
}
.connector-line {
  stroke: #b4850f; /* 日落主题的连接线颜色 */
  stroke-width: 2; /* 稍微粗一点 */
  stroke-dasharray: 5,3; /* 点线 */
  opacity: 0.7;
  animation: dashFlow 20s linear infinite; /* 流动动画 */
}

@keyframes dashFlow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -1000;
  }
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.landmark-marker {
  cursor: pointer;
  transition: all 0.3s ease;
}

.marker-dot {
  fill: #ff5722;
  stroke: white;
  stroke-width: 1;
  cursor: pointer;
  transition: all 0.3s;
}

.marker-dot:hover {
  r: 5;
  fill: #ff0000;
  stroke-width: 2;
  filter: drop-shadow(0 0 5px rgba(255, 87, 34, 0.7));
  transform: scale(1.2);
}

.marker-dot.highlight {
  fill: #ffeb3b;
  stroke: #ff5722;
  animation: pulse 1s infinite;
}

.marker-label {
  font-size: 12px;
  fill: #333;
  font-weight: bold;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
}

.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-width: 200px;
  pointer-events: none;
}

.tooltip h3 {
  margin: 0 0 5px 0;
  color: #ff5722;
  font-size: 14px;
}

.tooltip p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

@keyframes pulse {
  0% {
    r: 6;
    opacity: 1;
  }
  50% {
    r: 10;
    opacity: 0.7;
  }
  100% {
    r: 6;
    opacity: 1;
  }
}

.label-bg {
  fill: white;
  stroke: #ff5722;
  stroke-width: 1;
  opacity: 0.9;
}

.label-bg:hover {
  fill: #fff8e1;
  stroke-width: 1.5;
}

.label-text {
  font-size: 12px;
  fill: #333;
  font-weight: bold;
  pointer-events: none;
}
</style>