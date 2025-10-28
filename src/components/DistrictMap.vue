<template>
  <div class="district-map-container">
    <svg ref="mapSvg" width="100%" height="100%" viewBox="0 0 800 600">
      <defs>
        <filter id="texture-urban" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.2" numOctaves="2" seed="10" result="noise"/><feDiffuseLighting in="noise" lighting-color="#e0e0e0" surfaceScale="1.5" result="terrain"><feDistantLight azimuth="45" elevation="50"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feBlend in="SourceGraphic" in2="textured" mode="multiply"/></filter>
        <filter id="texture-suburban" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.03" numOctaves="4" seed="2" result="noise"/><feDiffuseLighting in="noise" lighting-color="#d4a76a" surfaceScale="2" result="terrain"><feDistantLight azimuth="45" elevation="60"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="3" result="grain"/><feColorMatrix in="grain" type="saturate" values="0" result="grain-gray"/><feComponentTransfer in="grain-gray" result="grain-final"><feFuncA type="table" tableValues="0 0.03"/></feComponentTransfer><feBlend in="SourceGraphic" in2="textured" mode="multiply" result="step1"/><feBlend in="step1" in2="grain-final" mode="multiply"/></filter>
        <filter id="texture-natural" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="5" result="noise"/><feDiffuseLighting in="noise" lighting-color="#c1b7a8" surfaceScale="4" result="terrain"><feDistantLight azimuth="60" elevation="60"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feBlend in="SourceGraphic" in2="textured" mode="multiply"/></filter>
      </defs>
      <g ref="zoomContainer">
        <image v-if="backgroundImageUrl" :href="backgroundImageUrl" x="0" y="0" width="800" height="600" preserveAspectRatio="xMidYMid slice"/>
        <g class="map-layer"></g>
        <g class="connectors-layer" v-if="projection">
          <path v-for="landmark in visibleLandmarks" :key="'connector-' + landmark.id" class="connector-line" :d="getConnectorPath(landmark)"/>
        </g>
        <g class="landmarks-layer" v-if="projection">
          <g v-for="landmark in visibleLandmarks" :key="landmark.id" class="landmark-marker" :transform="`translate(${projection(landmark.position)[0]}, ${projection(landmark.position)[1]})`">
            <circle class="marker-dot" r="5" @mouseenter="showTooltip(landmark, $event)" @mouseleave="hideTooltip"/>
          </g>
        </g>
        <g class="labels-layer" v-if="projection">
          <g v-for="landmark in visibleLandmarks" :key="'label-' + landmark.id" :transform="`translate(${getLabelPosition(landmark)[0]}, ${getLabelPosition(landmark)[1]})`" @mouseenter="showTooltip(landmark, $event)" @mouseleave="hideTooltip">
            <rect class="label-bg" x="-55" y="-14" width="110" height="28" rx="6"/>
            <text class="label-text" text-anchor="middle" dominant-baseline="middle">{{ landmark.name }}</text>
          </g>
        </g>
      </g>
    </svg>
    <div v-if="activeTooltip" class="tooltip" :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }">
      <h3>{{ activeTooltip.name }}</h3>
      <p>{{ activeTooltip.description || "暂无简介" }}</p>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: ["districtName", "landmarks"],
  data() {
    return {
      svg: null,
      zoomContainer: null,
      projection: null,
      path: null,
      beijingGeoJson: null,
      districtBoundary: null,
      districtFeatures: [],
      activeTooltip: null,
      tooltipPosition: { x: 0, y: 0 },
      tooltipTimer: null,
    };
  },
  computed: {
    visibleLandmarks() {
      if (!this.districtBoundary || !this.landmarks) return [];
      return this.landmarks.filter(landmark => d3.geoContains(this.districtBoundary, landmark.position));
    },
    backgroundImageUrl() {
      if (!this.districtName) return null;
    }
  },
  watch: {
    // MODIFIED: 移除了 immediate: true，避免在 mounted 前执行
    districtName(newName) {
      if (newName && this.svg) {
        this.loadAndDrawDistrict();
      }
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.mapSvg);
    this.zoomContainer = d3.select(this.$refs.zoomContainer);
    this.setupZoom();
    // MODIFIED: mounted 时调用总的加载函数
    this.loadAndDrawDistrict();
  },
  methods: {
    setupZoom() {
      const zoom = d3.zoom().scaleExtent([0.8, 8]).on("zoom", this.zoomed);
      this.svg.call(zoom);
    },
    zoomed(event) {
      this.zoomContainer.attr("transform", event.transform);
    },

    // MODIFIED: 这是一个新的主入口函数，确保了加载顺序正确
    async loadAndDrawDistrict() {
      // 步骤 1: 确保北京总地图GeoJSON已加载
      await this.loadBeijingGeoJSON();
      // 步骤 2: 加载并绘制具体区的地图
      await this.loadDistrictGeoJSON();
    },

    // MODIFIED: 这个函数现在只负责加载北京总地图，并增加了缓存判断
    async loadBeijingGeoJSON() {
      // 如果已经加载过，则直接返回，避免重复请求
      if (this.beijingGeoJson) return;
      try {
        // FIXED: 路径已修正为从根目录'/'开始
        const filePath = "/beijing_geojson_filer/北京市区geojson地图文件/北京.json";
        this.beijingGeoJson = await d3.json(filePath);
        if (!this.beijingGeoJson) {
          throw new Error(`文件加载失败或内容无效: ${filePath}`);
        }
      } catch (error) {
        console.error("加载 北京.json 失败:", error);
      }
    },

    // MODIFIED: 这个函数现在专注于加载具体区的地图
    async loadDistrictGeoJSON() {
      if (!this.districtName || !this.beijingGeoJson) return;
      try {
        // 从已加载的北京总地图中找到当前区的边界数据
        this.districtBoundary = this.beijingGeoJson.features.find(f => f.properties.name === this.districtName);
        if (!this.districtBoundary) {
          throw new Error(`在 北京.json 中未找到名为 ${this.districtName} 的区域`);
        }

        // FIXED: 路径已修正为从根目录'/'开始
        const filePath = `/beijing_geojson_filer/北京市区geojson地图文件/北京市/${this.districtName}.json`;
        const districtJson = await d3.json(filePath);
        if (!districtJson || !districtJson.features) {
          throw new Error(`文件加载失败或内容无效: ${filePath}`);
        }
        this.districtFeatures = districtJson.features;

        // 设置投影和路径
        this.projection = d3.geoIdentity().reflectY(true).fitSize([800, 600], districtJson);
        this.path = d3.geoPath().projection(this.projection);

        // 调用绘图函数
        this.drawMap();
      } catch (error) {
        console.error(`加载 ${this.districtName} 数据失败:`, error);
        this.zoomContainer.selectAll("g.map-layer").remove(); // 清理失败的图层
      }
    },

    // MODIFIED: 清理并合并了重复的绘图逻辑
    drawMap() {
      const mapLayer = this.zoomContainer.select("g.map-layer");
      // 使用D3的 .join() 方法来优雅地处理 enter, update, exit
      mapLayer.selectAll("path")
          .data(this.districtFeatures, d => d.properties.name)
          .join(
              enter => enter.append("path")
                  .attr("d", this.path)
                  .style("opacity", 0)
                  .call(enter => enter.transition().duration(750).style("opacity", 0.7)),
              update => update,
              exit => exit.transition().duration(500).style("opacity", 0).remove()
          )
          .attr("vector-effect", "non-scaling-stroke")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .attr("fill", "#bebada") // 简化了着色逻辑，你可以替换回之前的颜色算法
          .attr("filter", "url(#texture-suburban)"); // 简化了纹理，可替换
    },
    showTooltip(landmark, event) {
      clearTimeout(this.tooltipTimer);
      this.activeTooltip = {
        name: landmark.name,
        description: landmark.description,
      };
      this.tooltipPosition = { x: event.clientX + 15, y: event.clientY + 15 };
    },
    hideTooltip() {
      this.tooltipTimer = setTimeout(() => { this.activeTooltip = null; }, 300);
    },
    getConnectorPath(landmark) {
      const start = this.projection(landmark.position);
      const end = this.getLabelPosition(landmark);
      return `M${start[0]},${start[1]} L${end[0]},${end[1]}`;
    },
    getLabelPosition(landmark) {
      const center = this.projection(landmark.position);
      if (typeof landmark.labelAngle === 'number') {
        // 2. 如果有，将角度转换为弧度 (D3/JS的数学函数使用弧度)
        const angleInRadians = landmark.labelAngle * (Math.PI / 180);
        const radius = 60;
        return [
          center[0] + Math.cos(angleInRadians) * radius,
          center[1] + Math.sin(angleInRadians) * radius,
        ];
      } else {
        // 3. 如果没有，则使用旧的哈希函数作为后备方案
        const angle = this.getLabelAngle(landmark.id);
        const radius = 60;
        return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius];
      }
    },
    getLabelAngle(id) {
      // 用一个简单的 hash 函数给每个 id 分配一个相对固定的角度
      const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      return (hash & 0xffff) / 0xffff * 2 * Math.PI;
    },
  },
};
</script>

<style scoped>
:root { --accent-color: #a0522d; }
.district-map-container {
  width: 100%;
  height: 100%;
  cursor: grab; /* 新增：给容器一个可抓取的手势，提示用户可以平移 */
}
.district-map-container:active {
  cursor: grabbing; /* 新增：在拖动时显示抓紧手势 */
}
.map-layer path {
  /* 移除 cursor:pointer, 因为缩放行为接管了SVG的鼠标事件 */
  transition: all 0.3s ease-in-out, filter 0.3s ease;
}
.map-layer path:hover {
  stroke: var(--accent-color) !important;
  stroke-width: 1.5 !important;
  transform: translateY(-3px) scale(1.02);
  filter: none !important;
}
.label-layer .label {
  font-size: 14px;
  fill: #2c1f1a;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.landmark-marker { cursor: pointer; }
.marker-dot {
  fill: #ff5722;
  stroke: white;
  stroke-width: 2;
  stroke-linejoin: round;
  transition: all 0.3s;
  vector-effect: non-scaling-stroke; /* 让描边在缩放时保持粗细 */
}
.marker-dot:hover { r: 8; fill: #ff0000; }
.connector-line { stroke: #432623; stroke-width: 1.5; stroke-dasharray: 4,2; opacity: 0.9; pointer-events: none; vector-effect: non-scaling-stroke; }
.labels-layer g { cursor: pointer; }
.label-bg { fill: #fff8e1; stroke: #d4a76a; stroke-width: 1; opacity: 0.9; transition: all 0.3s ease; }
.labels-layer g:hover .label-bg { fill: #ffffff; stroke-width: 1.5; transform: scale(1.05); }
.label-text { font-size: 12px; fill: #333; font-weight: bold; pointer-events: none; }
.tooltip {
  position: fixed; /* 使用 fixed 定位，避免受父容器滚动影响 */
  background: rgba(255, 255, 240, 0.95);
  border: 1px solid #d4a76a;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-width: 220px;
  pointer-events: none;
  font-family: sans-serif;
  transition: opacity 0.2s;
}
.tooltip h3 { margin: 0 0 5px 0; color: #a0522d; font-size: 14px; }
.tooltip p { margin: 0; font-size: 12px; color: #5a4a42; }
</style>