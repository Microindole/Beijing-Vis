<template>
  <div class="district-map-container">
    <svg ref="mapSvg" width="100%" height="100%" viewBox="0 0 800 600">
      <defs>
        <filter id="texture-urban" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.2" numOctaves="2" seed="10" result="noise"/><feDiffuseLighting in="noise" lighting-color="#e0e0e0" surfaceScale="1.5" result="terrain"><feDistantLight azimuth="45" elevation="50"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feBlend in="SourceGraphic" in2="textured" mode="multiply"/></filter>
        <filter id="texture-suburban" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.03" numOctaves="4" seed="2" result="noise"/><feDiffuseLighting in="noise" lighting-color="#d4a76a" surfaceScale="2" result="terrain"><feDistantLight azimuth="45" elevation="60"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="3" result="grain"/><feColorMatrix in="grain" type="saturate" values="0" result="grain-gray"/><feComponentTransfer in="grain-gray" result="grain-final"><feFuncA type="table" tableValues="0 0.03"/></feComponentTransfer><feBlend in="SourceGraphic" in2="textured" mode="multiply" result="step1"/><feBlend in="step1" in2="grain-final" mode="multiply"/></filter>
        <filter id="texture-natural" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="5" result="noise"/><feDiffuseLighting in="noise" lighting-color="#c1b7a8" surfaceScale="4" result="terrain"><feDistantLight azimuth="60" elevation="60"/></feDiffuseLighting><feComposite in="terrain" in2="SourceAlpha" operator="in" result="textured"/><feBlend in="SourceGraphic" in2="textured" mode="multiply"/></filter>
      </defs>
      <g ref="zoomContainer"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: ["districtName"],
  data() {
    return {
      svg: null,
      zoomContainer: null, // 新增：对总容器的引用
      projection: null,
      path: null,
      textures: ["texture-urban", "texture-suburban", "texture-natural"],
    };
  },
  watch: {
    districtName: {
      handler(newName) { if (newName && this.svg) this.loadDistrictGeoJSON(); },
      immediate: true
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.mapSvg);
    this.zoomContainer = d3.select(this.$refs.zoomContainer); // 新增：获取容器引用
    this.setupZoom(); // 新增：设置缩放
    if (this.districtName) this.loadDistrictGeoJSON();
  },
  methods: {
    // ===============================================================
    // 新增：设置和处理缩放的方法
    // ===============================================================
    setupZoom() {
      const zoom = d3.zoom()
          .scaleExtent([0.8, 8]) // 设置最小缩放0.8倍，最大8倍
          .on("zoom", this.zoomed);
      this.svg.call(zoom);
    },

    zoomed(event) {
      const { transform } = event;
      this.zoomContainer.attr("transform", transform);
    },

    // ... 其他辅助函数保持不变 ...
    buildAdjacency(features) {
      const validFeatures = features.filter(f =>
          f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
      );
      const adjacency = new Map(validFeatures.map(f => [f.properties.name, []]));
      const featureVertices = validFeatures.map(feature => {
        const pointSet = new Set();
        let polygons = [];
        if (feature.geometry.type === 'Polygon') {
          polygons = feature.geometry.coordinates;
        } else {
          polygons = feature.geometry.coordinates.map(p => p[0]);
        }
        polygons.forEach(ring => {
          ring.forEach(point => {
            pointSet.add(`${point[0]},${point[1]}`);
          });
        });
        return { name: feature.properties.name, vertices: pointSet };
      });

      for (let i = 0; i < featureVertices.length; i++) {
        for (let j = i + 1; j < featureVertices.length; j++) {
          const featureA = featureVertices[i];
          const featureB = featureVertices[j];
          let sharedVertices = 0;
          for (const vertex of featureA.vertices) {
            if (featureB.vertices.has(vertex)) {
              sharedVertices++;
            }
          }
          if (sharedVertices >= 2) {
            adjacency.get(featureA.name).push(featureB.name);
            adjacency.get(featureB.name).push(featureA.name);
          }
        }
      }
      return adjacency;
    },
    greedyColoring(features, adjacency) {
      const colors = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"];
      const colorMap = new Map();
      features.forEach(feature => {
        if (!feature.properties.name) return;
        const name = feature.properties.name;
        const neighborColors = new Set(adjacency.get(name)?.map(neighborName => colorMap.get(neighborName)));
        const availableColor = colors.find(c => !neighborColors.has(c));
        colorMap.set(name, availableColor || "#cccccc");
      });
      return colorMap;
    },
    applyGreedyLabeling(labelsData) {
      labelsData.sort((a, b) => b.area - a.area);
      const placedLabels = [];
      const visibleLabels = new Set();
      labelsData.forEach(label => {
        let overlaps = false;
        for (const placed of placedLabels) {
          if (label.x < placed.x + placed.width && label.x + label.width > placed.x &&
              label.y < placed.y + placed.height && label.y + label.height > placed.y) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) {
          placedLabels.push(label);
          visibleLabels.add(label.id);
        }
      });
      return visibleLabels;
    },
    getTextureByAreaName(name) {
      const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      return `url(#${this.textures[hash % this.textures.length]})`;
    },
    getSanitizedId(name) {
      return `label-${(name || '').replace(/[\s\(\)]/g, '-')}`;
    },

    // ===============================================================
    // 核心绘图函数
    // ===============================================================
    async loadDistrictGeoJSON() {
      try {
        const filePath = `./beijing_geojson_filer/北京市区geojson地图文件/北京市/${this.districtName}.json`;
        const geoJson = await d3.json(filePath);
        this.districtFeatures = geoJson.features;
        this.projection = d3.geoIdentity().reflectY(true).fitSize([800, 600], geoJson);
        this.path = d3.geoPath().projection(this.projection);
        this.drawMap();
      } catch (error) {
        console.error(`加载 ${this.districtName}.json 失败:`, error);
        this.zoomContainer.selectAll("*").remove(); // 修改：清理容器内容
      }
    },

    drawMap() {
      // 修改：清理容器内容，而不是整个SVG
      this.zoomContainer.selectAll("*").remove();

      const adjacency = this.buildAdjacency(this.districtFeatures);
      const colorMap = this.greedyColoring(this.districtFeatures, adjacency);

      // 修改：图层被添加到总容器 zoomContainer 中
      const mapLayer = this.zoomContainer.append("g").attr("class", "map-layer");
      const labelLayer = this.zoomContainer.append("g").attr("class", "label-layer");
      const vm = this;

      const paths = mapLayer.selectAll("path").data(this.districtFeatures, d => d.properties.name);
      paths.exit().transition().duration(500).style("opacity", 0).remove();
      const enterPaths = paths.enter().append("path").attr("d", this.path).style("opacity", 0);

      paths.merge(enterPaths)
          // 新增：vector-effect 属性让描边在缩放时不发生变化
          .attr("vector-effect", "non-scaling-stroke")
          .attr("stroke", "#fff").attr("stroke-width", 0.8)
          .attr("fill", d => colorMap.get(d.properties.name))
          .attr("filter", d => vm.getTextureByAreaName(d.properties.name))
          .on("mouseenter", function(event, d) {
            d3.select(this).attr("filter", "none").attr("stroke", "#bd6b20").attr("stroke-width", 2);
            d3.select(`#${vm.getSanitizedId(d.properties.name)}`).style("opacity", 1);
          })
          .on("mouseleave", function(event, d) {
            d3.select(this)
                .attr("filter", vm.getTextureByAreaName(d.properties.name))
                .attr("stroke", "#fff").attr("stroke-width", 0.8);
            const label = d3.select(`#${vm.getSanitizedId(d.properties.name)}`);
            if (label.node() && !label.classed("is-visible-default")) {
              label.transition().duration(300).style("opacity", 0);
            }
          })
          .transition().duration(750).style("opacity", 1);

      const labelsData = [];
      const tempLabels = labelLayer.selectAll("text.label-temp").data(this.districtFeatures.filter(d => d.properties.name), d => d.properties.name);
      tempLabels.enter().append("text")
          .attr("x", d => vm.path.centroid(d)[0])
          .attr("y", d => vm.path.centroid(d)[1])
          .text(d => d.properties.name)
          .each(function(d) {
            const bbox = this.getBBox();
            labelsData.push({
              id: vm.getSanitizedId(d.properties.name),
              x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height,
              area: vm.path.area(d)
            });
          }).remove();

      const visibleLabelIds = this.applyGreedyLabeling(labelsData);

      const labels = labelLayer.selectAll("text.label").data(this.districtFeatures.filter(d => d.properties.name), d => d.properties.name);
      const enterLabels = labels.enter().append("text").attr("class", "label");

      labels.merge(enterLabels)
          .attr("id", d => vm.getSanitizedId(d.properties.name))
          .attr("x", d => vm.path.centroid(d)[0])
          .attr("y", d => vm.path.centroid(d)[1])
          .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
          .text(d => d.properties.name)
          .classed("is-visible-default", d => visibleLabelIds.has(vm.getSanitizedId(d.properties.name)))
          .style("opacity", d => visibleLabelIds.has(vm.getSanitizedId(d.properties.name)) ? 1 : 0);
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
</style>