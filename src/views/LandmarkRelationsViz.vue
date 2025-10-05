<template>
  <div class="relations-viz-container">
    <h2>北京地标关系概览</h2>

    <div class="chart-controls">
      <button
          :class="{ active: currentChartType === 'timeline' }"
          @click="currentChartType = 'timeline'"
      >
        历史时间线
      </button>
      <button
          :class="{ active: currentChartType === 'trend' }"
          @click="currentChartType = 'trend'"
      >
        兴建/消失趋势
      </button>
      <button
          :class="{ active: currentChartType === 'force' }"
          @click="currentChartType = 'force'"
      >
        关系网络图
      </button>
    </div>

    <div class="charts-display-area">
      <div
          id="timeline-chart"
          v-show="currentChartType === 'timeline'"
          class="chart-instance"
      ></div>
      <div
          id="trend-chart"
          v-show="currentChartType === 'trend'"
          class="chart-instance"
      ></div>
      <div
          id="force-chart"
          ref="forceChartContainer"
          v-show="currentChartType === 'force'"
          class="chart-instance"
      ></div>
    </div>

    <p class="viz-description">
      切换图表类型以探索不同维度的地标关系。
      <strong v-if="currentChartType === 'force'"
      >提示：双击关系网络图可进入或退出全屏模式。</strong
      >
    </p>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {landmarks, relations} from "@/data/landmarkData.js";

export default {
  name: "LandmarkRelationsViz",
  data() {
    return {
      selectedLegendTypes: null,
      currentChartType: "timeline",
      highlightedLandmarks: [
        "故宫",
        "大栅栏",
        "颐和园",
        "北海公园",
        "长城",
        "明十三陵",
        "天坛",
        "法源寺",
      ],
      landmarksData: landmarks,
      relationsData: relations,
    };
  },
  mounted() {
    this.initTimelineChart();
    this.initTrendChart();
    this.initForceChart();
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCharts);
    if (this.timelineChart) {
      this.timelineChart.dispose();
    }
    if (this.trendChart) {
      this.trendChart.dispose();
    }
    if (this.forceChart) {
      // 移除双击事件监听器
      this.forceChart.off("dblclick", this.handleChartDbClick);
      this.forceChart.dispose();
    }
  },
  watch: {
    currentChartType() {
      this.$nextTick(() => {
        this.resizeCharts();
      });
    },
  },
  methods: {
    // ... initTimelineChart 和 initTrendChart 方法保持不变, 此处省略 ...
    initTimelineChart() {
      const chartDom = document.getElementById("timeline-chart");
      if (!chartDom) return;
      if (this.timelineChart) {
        this.timelineChart.dispose();
      }
      this.timelineChart = echarts.init(chartDom);
      const typeColors = {
        皇家建筑: "#8B4513",
        市井文化: "#D2B48C",
        皇家园林: "#556B2F",
        军事防御: "#696969",
        皇家陵寝: "#A0522D",
        皇家祭祀: "#CD5C5C",
        宗教建筑: "#BDB76B",
        都城遗址: "#4682B4",
        城门: "#6A5ACD",
        现代建筑: "#2F4F4F",
        报时建筑: "#D2691E",
        牌楼: "#FFD700",
        名人故居: "#BA55D3",
        桥梁: "#8FBC8F",
        水系: "#00BFFF",
        胡同街区: "#CD853F",
      };
      const allLandmarkTypes = [...new Set(this.landmarksData.map((d) => d.type))];
      if (this.selectedLegendTypes === null || Object.keys(this.selectedLegendTypes).length === 0) {
        this.selectedLegendTypes = {};
        allLandmarkTypes.forEach((type) => {
          this.selectedLegendTypes[type] = true;
        });
      }
      allLandmarkTypes.forEach((type) => {
        if (!typeColors[type]) {
          console.warn(`Warning: Type "${type}" does not have a defined color. Using a default color.`);
          typeColors[type] = "#999";
        }
      });
      const option = {
        title: {
          text: "北京地标历史时间线",
          subtext: "展示地标的建成与主要活跃年代",
          left: "center",
          top: 20,
          textStyle: {color: "#333"},
          subtextStyle: {color: "#666"}
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            const data = params.data.value ? params.data.value[3] : params.data;
            if (!data || !data.name) return "";
            const statusText = data.status === "vanished" ? "（已消失）" : "（现存）";
            return `<strong>${data.name} ${statusText}</strong><br/>类型: ${data.type}<br/>年代: ${data.era}<br/>重要性: ${data.importance}<br/>${data.description}`;
          },
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            start: 0,
            end: 100,
            backgroundColor: "rgba(249, 243, 230, 0.5)",
            dataBackground: {
              lineStyle: {color: "#D4A76A", width: 2, opacity: 0.8,},
              areaStyle: {color: "rgba(212, 167, 106, 0.2)", opacity: 0.8,},
            },
            fillerColor: "rgba(212, 167, 106, 0.4)",
            borderColor: "#D4A76A",
            handleStyle: {
              color: "#bd6b20",
              borderColor: "#8B4513",
              borderWidth: 2,
              shadowBlur: 5,
              shadowColor: "rgba(139, 69, 19, 0.3)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            textStyle: {color: "#8B4513"},
            emphasis: {handleStyle: {color: "#D4A76A", borderColor: "#8B4513",},},
          },
          {type: "inside", xAxisIndex: 0, filterMode: "empty"},
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "empty",
            right: "1%",
            width: 20,
            start: 0,
            end: 50,
            borderColor: "#D4A76A",
            handleStyle: {color: "#bd6b20", borderColor: "#8B4513"},
            textStyle: {color: "#8B4513"},
          },
          {type: "inside", yAxisIndex: 0, filterMode: "empty"},
        ],
        grid: {left: "5%", right: "5%", top: "18%", bottom: "10%", containLabel: true},
        xAxis: {
          type: "value", name: "年份", min: -800, max: 2050, axisLabel: {
            formatter: function (value) {
              return value < 0 ? `公元前${-value}` : `${value}年`;
            },
          }, splitLine: {show: true, lineStyle: {type: "dashed"}}
        },
        yAxis: {
          type: "category",
          data: this.landmarksData.map((d) => d.name),
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 0,
            formatter: (name) => {
              const landmark = this.landmarksData.find((d) => d.name === name);
              if (!landmark || !this.selectedLegendTypes[landmark.type]) {
                return "";
              }
              if (this.highlightedLandmarks.includes(name)) {
                return `{highlight|${name}}`;
              }
              if (landmark.status === "vanished") {
                return `{vanished|${name}}`;
              }
              return name;
            },
            rich: {
              highlight: {fontWeight: "bold", color: "#8B4513", fontSize: 14},
              vanished: {color: "#999", fontStyle: "italic"}
            },
            margin: 10,
          },
          splitLine: {show: false}
        },
        series: [
          {
            name: "地标活跃期",
            type: "custom",
            renderItem: (params, api) => {
              const data = api.value(3);
              const isHighlighted = this.highlightedLandmarks.includes(data.name);
              const isVanished = data.status === "vanished";
              if (!this.selectedLegendTypes[data.type]) {
                return {type: "group"};
              }
              const startPoint = api.coord([api.value(0), api.value(2)]);
              const endPoint = api.coord([api.value(1), api.value(2)]);
              const height = api.size([0, 1])[1] * 0.6;
              const width = endPoint[0] - startPoint[0];
              return {
                type: "rect",
                shape: {x: startPoint[0], y: startPoint[1] - height / 2, width: width, height: height,},
                style: api.style({
                  fill: isHighlighted ? this.getDarkerColor(typeColors[data.type]) : typeColors[data.type],
                  stroke: "#fff",
                  lineWidth: isHighlighted ? 2 : 1,
                  shadowBlur: isHighlighted ? 8 : 5,
                  shadowColor: isHighlighted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
                  stroke_: isVanished ? "#999" : "#fff",
                  lineDash: isVanished ? [5, 5] : [],
                  lineWidth_: isVanished ? 2 : 1,
                }),
              };
            },
            encode: {x: [0, 1], y: 2, itemName: 3, tooltip: [0, 1, 2, 3]},
            data: this.landmarksData.map((d, index) => {
              return {value: [d.startYear, d.endYear, index, d]};
            })
          },
          {
            name: "地标点",
            type: "scatter",
            symbolSize: 10,
            itemStyle: {color: "rgba(0,0,0,0)"},
            label: {show: false},
            data: this.landmarksData.map((d, index) => ({
              name: d.name,
              value: [d.startYear + (d.endYear - d.startYear) / 2, index],
              symbol: this.selectedLegendTypes[d.type] ? "circle" : "none",
              tooltip: {
                formatter: (params) => {
                  const landmark = d;
                  const statusText = landmark.status === "vanished" ? "（已消失）" : "（现存）";
                  return `<strong>${landmark.name} ${statusText}</strong><br/>类型: ${landmark.type}<br/>年代: ${landmark.era}<br/>重要性: ${landmark.importance}<br/>${landmark.description}`;
                },
              },
            })),
            z: 10
          },
        ],
        legend: {
          data: allLandmarkTypes.map((type) => ({
            name: type,
            icon: "rect",
            itemStyle: {color: typeColors[type]}
          })),
          top: 80,
          left: "center",
          orient: "horizontal",
          textStyle: {color: "#333"},
          selected: this.selectedLegendTypes,
          selectedMode: "multiple"
        },
      };
      this.timelineChart.setOption(option);
      this.timelineChart.off("legendselectchanged");
      this.timelineChart.on("legendselectchanged", (params) => {
        this.selectedLegendTypes = params.selected;
        this.timelineChart.setOption({
          yAxis: {
            axisLabel: {
              formatter: (name) => {
                const landmark = this.landmarksData.find((d) => d.name === name);
                if (!landmark || !this.selectedLegendTypes[landmark.type]) {
                  return "";
                }
                if (this.highlightedLandmarks.includes(name)) {
                  return `{highlight|${name}}`;
                }
                if (landmark.status === "vanished") {
                  return `{vanished|${name}}`;
                }
                return name;
              }
            }
          },
          series: [
            {type: "custom"},
            {
              type: "scatter",
              data: this.landmarksData.map((d, index) => ({
                name: d.name,
                value: [d.startYear + (d.endYear - d.startYear) / 2, index],
                symbol: this.selectedLegendTypes[d.type] ? "circle" : "none",
                tooltip: {
                  formatter: (params) => {
                    const landmark = d;
                    const statusText = landmark.status === "vanished" ? "（已消失）" : "（现存）";
                    return `<strong>${landmark.name} ${statusText}</strong><br/>类型: ${landmark.type}<br/>年代: ${landmark.era}<br/>重要性: ${landmark.importance}<br/>${landmark.description}`;
                  }
                }
              }))
            }
          ],
        });
      });
    },
    initTrendChart() {
      const chartDom = document.getElementById("trend-chart");
      if (!chartDom) return;
      if (this.trendChart) {
        this.trendChart.dispose();
      }
      this.trendChart = echarts.init(chartDom);
      const buildDataMap = {};
      const vanishDataMap = {};
      const minYear = -800;
      const maxYear = 2025;
      for (let i = minYear; i <= maxYear; i++) {
        buildDataMap[i] = [];
        vanishDataMap[i] = [];
      }
      this.landmarksData.forEach((d) => {
        if (d.startYear >= minYear && d.startYear <= maxYear) {
          buildDataMap[d.startYear].push(d.name);
        }
        if (d.status === "vanished" && d.endYear >= minYear && d.endYear <= maxYear) {
          vanishDataMap[d.endYear].push(d.name);
        }
      });
      const years = Object.keys(buildDataMap).map(Number).sort((a, b) => a - b);
      const buildCounts = years.map((year) => buildDataMap[year].length);
      const vanishCounts = years.map((year) => vanishDataMap[year].length);
      const option = {
        title: {
          text: "北京地标兴建/消失趋势",
          subtext: "历年地标数量变化概览",
          left: "center",
          top: 20,
          textStyle: {color: "#333"},
          subtextStyle: {color: "#666"}
        },
        tooltip: {
          trigger: "axis", axisPointer: {type: "shadow"},
          formatter: (params) => {
            const year = parseInt(params[0].name);
            let tooltip = `<strong>${year < 0 ? `公元前${-year}` : `${year}年`}</strong><br/>`;
            const currentBuildLandmarks = buildDataMap[year] || [];
            const currentVanishLandmarks = vanishDataMap[year] || [];
            params.forEach((item) => {
              tooltip += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
              if (item.seriesName === "兴建地标数量" && currentBuildLandmarks.length > 0) {
                tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentBuildLandmarks.join("、")}<br/>`;
              } else if (item.seriesName === "消失地标数量" && currentVanishLandmarks.length > 0) {
                tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentVanishLandmarks.join("、")}<br/>`;
              }
            });
            return tooltip;
          },
        },
        legend: {data: ["兴建地标数量", "消失地标数量"], top: 80, left: "center", textStyle: {color: "#333"}},
        grid: {left: "5%", right: "5%", top: "25%", bottom: "15%", containLabel: true},
        xAxis: {
          type: "category", data: years, axisLabel: {
            formatter: function (value) {
              const yearValue = parseInt(value);
              return yearValue < 0 ? `公元前${-yearValue}` : `${yearValue}年`;
            }, interval: (index, value) => {
              const yearValue = parseInt(value);
              if (Math.abs(yearValue) > 1000) {
                return yearValue % 500 === 0;
              } else if (Math.abs(yearValue) > 500) {
                return yearValue % 200 === 0;
              } else if (Math.abs(yearValue) > 100) {
                return yearValue % 100 === 0;
              } else {
                return index % 50 === 0;
              }
            }, rotate: 45
          }, boundaryGap: false, axisTick: {alignWithLabel: true}
        },
        yAxis: {type: "value", name: "地标数量", minInterval: 1},
        series: [
          {
            name: "兴建地标数量",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {color: "#3CB371"},
            lineStyle: {color: "#3CB371", width: 2},
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(60,179,113,0.3)"
              }, {offset: 1, color: "rgba(60,179,113,0)"}])
            },
            data: buildCounts
          },
          {
            name: "消失地标数量",
            type: "line",
            smooth: true,
            symbol: "diamond",
            symbolSize: 8,
            itemStyle: {color: "#DC143C"},
            lineStyle: {color: "#DC143C", width: 2},
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(220,20,60,0.3)"
              }, {offset: 1, color: "rgba(220,20,60,0)"}])
            },
            data: vanishCounts
          },
        ],
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            start: 0,
            end: 100,
            bottom: 0,
            height: 20,
            textStyle: {color: "#666"},
            handleIcon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-9.1,0.4-9.1,0.4V2.7c0-0.3,0.1-0.4,0.3-0.5c0.2-0.1,0.5-0.1,0.7-0.1h15c0.3,0,0.5,0.1,0.7,0.1c0.2,0.1,0.3,0.2,0.3,0.5v9.6c0,0.2-0.1,0.4-0.3,0.5c-0.2,0.1-0.5,0.1-0.7,0.1h-1.3v-1.3H10.7zM4.9,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C5.1,4.4,5,4.3,4.9,4.3zM10.1,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C10.3,4.4,10.2,4.3,10.1,4.3zM15.3,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C15.5,4.4,15.4,4.3,15.3,4.3zM4.9,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C5.1,7.6,5,7.5,4.9,7.5zM10.1,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C10.3,7.6,10.2,7.5,10.1,7.5zM15.3,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C15.5,7.6,15.4,7.5,15.3,7.5zM4.9,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C5.1,10.8,5,10.7,4.9,10.7zM10.1,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C10.3,10.8,10.2,10.7,10.1,10.7zM15.3,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C15.5,10.8,15.4,10.7,15.3,10.7z",
            handleSize: "110%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          },
          {type: "inside", xAxisIndex: 0, filterMode: "empty", zoomOnMouseWheel: true, moveOnMouseMove: true}
        ],
      };
      this.trendChart.setOption(option);
    },
    initForceChart() {
      const chartDom = document.getElementById("force-chart");
      if (!chartDom) return;

      this.forceChart = echarts.init(chartDom);
      // **核心改动1: 绑定双击事件**
      this.forceChart.on("dblclick", this.handleChartDbClick);

      const typeColors = {
        皇家建筑: "#8B4513",
        市井文化: "#D2B48C",
        皇家园林: "#556B2F",
        军事防御: "#696969",
        皇家陵寝: "#A0522D",
        皇家祭祀: "#CD5C5C",
        宗教建筑: "#BDB76B",
        都城遗址: "#4682B4",
        城门: "#6A5ACD",
        现代建筑: "#2F4F4F",
        报时建筑: "#D2691E",
      };
      const nodes = this.landmarksData.map((d) => ({
        name: d.name, value: d.importance, category: d.type, symbolSize: d.importance * 4 + 15,
        label: {
          show: true,
          position: "inside",
          fontSize: this.highlightedLandmarks.includes(d.name) ? 14 : 12,
          color: this.highlightedLandmarks.includes(d.name) ? "#FFF" : "#EEE",
          fontWeight: this.highlightedLandmarks.includes(d.name) ? "bolder" : "bold",
          formatter: `{b}${d.status === "vanished" ? "\n(已消失)" : ""}`
        },
        itemStyle: {
          color: d.status === "vanished" ? "#999999" : this.highlightedLandmarks.includes(d.name) ? this.getDarkerColor(typeColors[d.type]) : typeColors[d.type],
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)"
        },
      }));
      const categories = [...new Set(this.landmarksData.map((d) => d.type))].map((type) => ({name: type}));
      const links = this.relationsData.map((r) => ({
        source: r.source, target: r.target, value: r.value, relation: r.relation,
        lineStyle: {
          color: r.value > 0.8 ? "#A0522D" : r.value > 0.6 ? "#D2B48C" : "#E8D8C3",
          width: r.value * 3 + 1,
          opacity: 0.8,
          curveness: 0.2
        },
        label: {
          show: true,
          formatter: r.relation,
          fontSize: 10,
          color: "#666",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: [2, 4],
          borderRadius: 2
        },
        emphasis: {
          lineStyle: {color: "#8B4513", width: r.value * 3 + 3},
          label: {show: true, color: "#333", fontWeight: "bold"}
        },
      }));
      const option = {
        title: {
          text: "北京地标关系网络图：关联与强度",
          subtext: "节点大小：地标重要性 | 颜色：地标类型 | 连线：关系类型与强度",
          left: "center",
          top: 20,
          textStyle: {color: "#333", fontSize: 18},
          subtextStyle: {color: "#666", fontSize: 12}
        },
        legend: {data: categories.map((c) => c.name), left: "center", bottom: 10, textStyle: {color: "#333"}},
        series: [{
          name: "地标关系",
          type: "graph",
          layout: "force",
          data: nodes,
          links: links,
          categories: categories,
          roam: true,
          draggable: true,
          force: {repulsion: 800, edgeLength: [200, 300], gravity: 0.1, friction: 0.6, layoutAnimation: true},
          label: {show: true, position: "right", formatter: "{b}", fontSize: 12, color: "#333"},
          lineStyle: {color: "#999", curveness: 0.3},
          emphasis: {focus: "adjacency", lineStyle: {color: "#666"}},
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#bd6b20",
            borderWidth: 1,
            textStyle: {color: "#333"},
            formatter: function (params) {
              if (params.dataType === "node") {
                const nodeData = params.data;
                const landmarkDetail = this.landmarksData.find((d) => d.name === nodeData.name);
                const statusText = landmarkDetail.status === "vanished" ? "（已消失）" : "（现存）";
                return `<div style="padding: 5px 0;"><strong style="font-size: 1.1em; color: #8B4513;">${nodeData.name} ${statusText}</strong><br/><span style="color: #666;">类型:</span> ${nodeData.category}<br/><span style="color: #666;">重要性评分:</span> ${nodeData.value}<br/><span style="color: #666;">描述:</span> ${landmarkDetail.description}</div>`;
              } else if (params.dataType === "edge") {
                const edgeData = params.data;
                return `<div style="padding: 5px 0;"><strong style="font-size: 1.1em; color: #8B4513;">${edgeData.source}</strong><span style="color: #666;">-</span> ${edgeData.relation} <span style="color: #666;">-</span><strong style="font-size: 1.1em; color: #8B4513;">${edgeData.target}</strong><br/><span style="color: #666;">关系强度:</span> ${edgeData.value.toFixed(1)}</div>`;
              }
              return "";
            }.bind(this),
          },
        }],
      };
      this.forceChart.setOption(option);
    },

    /**
     * **核心改动2: 新增处理双击全屏的方法**
     */
    handleChartDbClick() {
      const element = this.$refs.forceChartContainer;
      if (!element) return;

      // 检查当前是否已处于全屏状态
      if (
          !document.fullscreenElement &&
          !document.webkitFullscreenElement && // Safari
          !document.mozFullScreenElement && // Firefox
          !document.msFullscreenElement // IE11
      ) {
        // 进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          /* Safari */
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          /* Firefox */
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          /* IE11 */
          element.msRequestFullscreen();
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      }
    },

    resizeCharts() {
      // 确保在 nextTick 中执行，等待 v-show 完成切换
      this.$nextTick(() => {
        if (this.timelineChart && this.currentChartType === 'timeline') {
          this.timelineChart.resize();
        }
        if (this.trendChart && this.currentChartType === 'trend') {
          this.trendChart.resize();
        }
        if (this.forceChart && this.currentChartType === 'force') {
          this.forceChart.resize();
        }
      });
    },
    getDarkerColor(hex) {
      if (!hex || hex.length < 7) return "#000000";
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      r = Math.floor(r * 0.7);
      g = Math.floor(g * 0.7);
      b = Math.floor(b * 0.7);
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
  },
};
</script>

<style scoped>
/* 样式部分与您提供的文件保持一致，无需修改 */
.relations-viz-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  background: linear-gradient(145deg, #fefbf5 0%, #f9f3e6 100%);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.15);
  border: 1px solid #d4a76a;
  position: relative;
  overflow: hidden;
}

.relations-viz-container::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  width: 150px;
  height: 150px;
  background-color: rgba(209, 155, 97, 0.1);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
  animation: float1 10s infinite ease-in-out alternate;
}

.relations-viz-container::after {
  content: "";
  position: absolute;
  bottom: -70px;
  right: -70px;
  width: 180px;
  height: 180px;
  background-color: rgba(183, 138, 86, 0.1);
  border-radius: 50%;
  filter: blur(50px);
  z-index: 0;
  animation: float2 12s infinite ease-in-out alternate-reverse;
}

@keyframes float1 {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(20px, 30px) rotate(10deg);
  }
}

@keyframes float2 {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-20px, -20px) rotate(-10deg);
  }
}

.relations-viz-container h2 {
  color: #8b4513;
  margin-bottom: 25px;
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.relations-viz-container h2::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #d4a76a, #bd6b20, #d4a76a);
  border-radius: 2px;
}

.chart-controls {
  margin-bottom: 30px;
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
}

.chart-controls button {
  padding: 12px 25px;
  font-size: 17px;
  border: 2px solid #d4a76a;
  border-radius: 25px;
  background-color: #fef8f0;
  color: #8b4513;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.chart-controls button:hover {
  background-color: #f5eedf;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.chart-controls button.active {
  background: linear-gradient(45deg, #bd6b20, #d19b61);
  color: #fff;
  border-color: #bd6b20;
  box-shadow: 0 8px 20px rgba(189, 107, 32, 0.4);
  transform: translateY(-5px);
  position: relative;
  overflow: hidden;
}

.chart-controls button.active::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: skewX(-30deg);
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.charts-display-area {
  flex-grow: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 450px;
  overflow: hidden;
  border-radius: 12px;
  background-color: #fefcf7;
  box-shadow: inset 0 2px 10px rgba(139, 69, 19, 0.05);
  border: 1px solid #e8dfd1;
}

.chart-instance {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: transparent;
}

.viz-description {
  font-size: 16px;
  color: #7a6b64;
  text-align: center;
  max-width: 800px;
  line-height: 1.7;
  margin-top: 35px;
  margin-bottom: 0;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .relations-viz-container {
    padding: 20px 15px;
    border-radius: 8px;
  }

  .relations-viz-container h2 {
    font-size: 26px;
    margin-bottom: 20px;
  }

  .chart-controls {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 25px;
  }

  .chart-controls button {
    padding: 10px 20px;
    font-size: 16px;
    min-width: unset;
    width: 85%;
    border-radius: 20px;
  }

  .charts-display-area {
    min-height: 350px;
    border-radius: 10px;
  }

  .viz-description {
    font-size: 14px;
    margin-top: 25px;
  }
}

@media (max-width: 480px) {
  .relations-viz-container {
    padding: 15px 10px;
  }

  .relations-viz-container h2 {
    font-size: 22px;
  }

  .chart-controls button {
    font-size: 14px;
    padding: 8px 15px;
    width: 90%;
  }

  .charts-display-area {
    min-height: 300px;
  }

  .viz-description {
    font-size: 13px;
    margin-top: 20px;
  }
}
</style>