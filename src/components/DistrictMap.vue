<!-- DistrictMap.vue 北京详细区的内部可视化地图 -->
<template>
  <svg ref="mapSvg" width="800" height="600"></svg>
</template>

<script>
import * as d3 from "d3";

export default {
  props: ["districtName", "mapData", "colorScaleConfig"],
  data() {
    return {
      svg: null,
      projection: null,
      path: null,
      colorScale: null,
      districtFeatures: null,
    };
  },
  async mounted() {
    this.svg = d3.select(this.$refs.mapSvg);
    await this.loadDistrictGeoJSON();
  },
  methods: {
    async loadDistrictGeoJSON() {
      const file = `./beijing_geojson_filer/北京市区geojson地图文件/北京市/${this.districtName}.json`;
      const geoJson = await d3.json(file);
      this.districtFeatures = geoJson.features;

      this.projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([800, 600], geoJson);

      this.path = d3.geoPath().projection(this.projection);
      this.colorScale = d3
        .scaleLinear()
        .domain(this.colorScaleConfig.domain)
        .range(this.colorScaleConfig.range);

      this.drawMap();
    },
    drawMap() {
      const mapLayer = this.svg.append("g").attr("class", "map-layer");
      const dataMap = new Map(
        this.mapData.map((item) => [item.name, item.value])
      );

      mapLayer
        .selectAll("path")
        .data(this.districtFeatures)
        .enter()
        .append("path")
        .attr("d", this.path)
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("fill", (d) => {
          const val = dataMap.get(d.properties.name);
          return val !== undefined ? this.colorScale(val) : "#ccc";
        });

      mapLayer
        .selectAll("text")
        .data(this.districtFeatures)
        .enter()
        .append("text")
        .attr("x", (d) => this.path.centroid(d)[0])
        .attr("y", (d) => this.path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text((d) => d.properties.name);

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
  },
};
</script>
