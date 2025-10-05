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
        v-show="currentChartType === 'force'"
        class="chart-instance"
      ></div>
    </div>

    <p class="viz-description">
      这些图展示了北京地标的建成与消失历史，以及它们之间的各种联系，包括历史、地理和功能上的关联。
      切换图表类型以探索不同维度的地标关系。
    </p>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { landmarks, relations } from "@/data/landmarkData.js"; // @ 通常指向 src 目录

export default {
  name: "LandmarkRelationsViz",
  data() {
    return {
      selectedLegendTypes: null, // 初始化为 null 或空对象
      currentChartType: "timeline", // 默认显示时间线图
      // 你的原始8个地标名称，用于高亮
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
    this.initTrendChart(); // 初始化新增的趋势图
    this.initForceChart();
    // 监听窗口大小变化，重新渲染图表
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeUnmount() {
    // Changed from beforeDestroy to beforeUnmount for Vue 3 compatibility
    window.removeEventListener("resize", this.resizeCharts);
    if (this.timelineChart) {
      this.timelineChart.dispose();
    }
    if (this.trendChart) {
      this.trendChart.dispose();
    }
    if (this.forceChart) {
      this.forceChart.dispose();
    }
  },
  watch: {
    // 当 currentChartType 变化时，重新调整图表大小以确保显示正常
    currentChartType() {
      this.$nextTick(() => {
        if (this.currentChartType === "timeline" && this.timelineChart) {
          this.timelineChart.resize();
        } else if (this.currentChartType === "trend" && this.trendChart) {
          this.trendChart.resize();
        } else if (this.currentChartType === "force" && this.forceChart) {
          this.forceChart.resize();
        }
      });
    },
  },
  methods: {
    initTimelineChart() {
      const chartDom = document.getElementById("timeline-chart");
      if (!chartDom) return;

      // Dispose existing chart instance if it exists to prevent memory leaks and re-initialization issues
      if (this.timelineChart) {
        this.timelineChart.dispose();
      }
      this.timelineChart = echarts.init(chartDom);

      // Define landmark type colors
      const typeColors = {
        皇家建筑: "#8B4513", // Deep Brown
        市井文化: "#D2B48C", // Light Brown
        皇家园林: "#556B2F", // Dark Olive Green
        军事防御: "#696969", // Dim Gray
        皇家陵寝: "#A0522D", // Sienna
        皇家祭祀: "#CD5C5C", // Indian Red
        宗教建筑: "#BDB76B", // Dark Khaki
        都城遗址: "#4682B4", // Steel Blue
        城门: "#6A5ACD", // Slate Blue
        现代建筑: "#2F4F4F", // Dark Slate Gray
        报时建筑: "#D2691E", // Chocolate
        牌楼: "#FFD700", // Gold
        名人故居: "#BA55D3", // Medium Purple
        桥梁: "#8FBC8F", // Dark Sea Green
        水系: "#00BFFF", // Deep Sky Blue
        胡同街区: "#CD853F", // Peru
      };

      // Extract all unique landmark types for legend data
      const allLandmarkTypes = [
        ...new Set(this.landmarksData.map((d) => d.type)),
      ];

      // Initialize selectedLegendTypes if it's null (first time loading)
      // Ensure this.selectedLegendTypes is defined in your component's data()
      if (
        this.selectedLegendTypes === null ||
        Object.keys(this.selectedLegendTypes).length === 0
      ) {
        this.selectedLegendTypes = {};
        allLandmarkTypes.forEach((type) => {
          this.selectedLegendTypes[type] = true; // Default all types to selected
        });
      }

      // Ensure all landmark types have a color defined
      allLandmarkTypes.forEach((type) => {
        if (!typeColors[type]) {
          console.warn(
            `Warning: Type "${type}" does not have a defined color. Using a default color.`
          );
          typeColors[type] = "#999"; // Default fallback color
        }
      });

      const option = {
        title: {
          text: "北京地标历史时间线",
          subtext: "展示地标的建成与主要活跃年代",
          left: "center",
          top: 20,
          textStyle: {
            color: "#333",
          },
          subtextStyle: {
            color: "#666",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            // params.data.value[3] contains the full landmark object
            const data = params.data.value ? params.data.value[3] : params.data; // Handle both series types
            if (!data || !data.name) return ""; // Safely handle undefined data

            const statusText =
              data.status === "vanished" ? "（已消失）" : "（现存）";
            return `
          <strong>${data.name} ${statusText}</strong><br/>
          类型: ${data.type}<br/>
          年代: ${data.era}<br/>
          重要性: ${data.importance}<br/>
          ${data.description}
        `;
          },
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
            start: 0,
            end: 100,
            // --- 【美化样式】 ---
            backgroundColor: "rgba(249, 243, 230, 0.5)", // 柔和的米色背景，带一点透明
            dataBackground: { // 预览数据区的样式
              lineStyle: {
                color: "#D4A76A", // 预览线的颜色，使用您的主题金色
                width: 2,
                opacity: 0.8,
              },
              areaStyle: {
                color: "rgba(212, 167, 106, 0.2)", // 预览区域的填充色
                opacity: 0.8,
              },
            },
            fillerColor: "rgba(212, 167, 106, 0.4)", // 【核心】选中区域的填充色，替换掉蓝色
            borderColor: "#D4A76A", // 边框颜色
            handleStyle: { // 拖动手柄的样式
              color: "#bd6b20", // 手柄颜色，使用主题深色
              borderColor: "#8B4513", // 手柄边框色
              borderWidth: 2,
              shadowBlur: 5, // 增加阴影提升质感
              shadowColor: "rgba(139, 69, 19, 0.3)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            textStyle: { // 文字样式
              color: "#8B4513", // 文字颜色，使用主题深棕色
            },
            emphasis: { // 高亮状态（鼠标悬浮在手柄或滑块上时）
              handleStyle: {
                color: "#D4A76A", // 高亮时手柄颜色
                borderColor: "#8B4513",
              },
            },
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "empty",
          },
          // Y 轴的滚动条样式也会自动应用大部分（手柄、边框等），这里无需重复设置
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "empty",
            right: "1%",
            width: 20,
            start: 0,
            end: 50,
            borderColor: "#D4A76A", // 同样可以指定边框等基础样式
            handleStyle: { color: "#bd6b20", borderColor: "#8B4513" },
            textStyle: { color: "#8B4513" },
          },
          {
            type: "inside",
            yAxisIndex: 0,
            filterMode: "empty",
          },
        ],
        grid: {
          left: "5%",
          right: "5%",
          top: "18%", // Increased top space
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "年份",
          min: -800,
          max: 2050,
          axisLabel: {
            formatter: function (value) {
              return value < 0 ? `公元前${-value}` : `${value}年`;
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "category",
          data: this.landmarksData.map((d) => d.name),
          axisLabel: {
            show: true,
            interval: 0, // Let ECharts manage intervals
            rotate: 0,
            formatter: (name) => {
              const landmark = this.landmarksData.find((d) => d.name === name);
              // Only show Y-axis label if its type is selected in the legend
              if (!landmark || !this.selectedLegendTypes[landmark.type]) {
                return ""; // Hide Y-axis label for unselected types
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
              highlight: {
                fontWeight: "bold",
                color: "#8B4513",
                fontSize: 14,
              },
              vanished: {
                color: "#999",
                fontStyle: "italic",
              },
            },
            margin: 10,
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name: "地标活跃期", // This name is internal, not for legend interaction directly
            type: "custom",
            renderItem: (params, api) => {
              const data = api.value(3); // Get the original data item (landmark object)
              const isHighlighted = this.highlightedLandmarks.includes(
                data.name
              );
              const isVanished = data.status === "vanished";

              // **Crucial**: Check the selected state for the current type
              // If the type is not selected, do not render this item
              if (!this.selectedLegendTypes[data.type]) {
                return { type: "group" }; // Return an empty group to not render anything
              }

              const startPoint = api.coord([api.value(0), api.value(2)]); // x: startYear, y: index
              const endPoint = api.coord([api.value(1), api.value(2)]); // x: endYear, y: index
              const height = api.size([0, 1])[1] * 0.6; // Bar height
              const width = endPoint[0] - startPoint[0];

              return {
                type: "rect",
                shape: {
                  x: startPoint[0],
                  y: startPoint[1] - height / 2,
                  width: width,
                  height: height,
                },
                style: api.style({
                  fill: isHighlighted
                    ? this.getDarkerColor(typeColors[data.type])
                    : typeColors[data.type],
                  stroke: "#fff",
                  lineWidth: isHighlighted ? 2 : 1,
                  shadowBlur: isHighlighted ? 8 : 5,
                  shadowColor: isHighlighted
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(0,0,0,0.2)",
                  // Dashed line for vanished landmarks
                  stroke_: isVanished ? "#999" : "#fff",
                  lineDash: isVanished ? [5, 5] : [],
                  lineWidth_: isVanished ? 2 : 1,
                }),
              };
            },
            encode: {
              x: [0, 1], // startYear, endYear
              y: 2, // index (landmark's index on y-axis)
              itemName: 3, // data.name (for tooltip)
              tooltip: [0, 1, 2, 3], // Pass all necessary data for tooltip
            },
            data: this.landmarksData.map((d, index) => {
              return {
                value: [d.startYear, d.endYear, index, d], // Pass the full landmark object
              };
            }),
          },
          // Scatter series for interactive points/tooltip
          {
            name: "地标点", // This name is internal, not for legend interaction directly
            type: "scatter",
            symbolSize: 10,
            itemStyle: {
              color: "rgba(0,0,0,0)", // Transparent symbol
            },
            label: {
              show: false, // Label shown on yAxis
            },
            data: this.landmarksData.map((d, index) => ({
              name: d.name, // Used for tooltip
              value: [d.startYear + (d.endYear - d.startYear) / 2, index], // Point in the middle of the time period
              // Control symbol visibility based on legend selection
              symbol: this.selectedLegendTypes[d.type] ? "circle" : "none",
              tooltip: {
                formatter: (params) => {
                  const landmark = d; // Use the direct landmark object
                  const statusText =
                    landmark.status === "vanished" ? "（已消失）" : "（现存）";
                  return `
                <strong>${landmark.name} ${statusText}</strong><br/>
                类型: ${landmark.type}<br/>
                年代: ${landmark.era}<br/>
                重要性: ${landmark.importance}<br/>
                ${landmark.description}
              `;
                },
              },
            })),
            z: 10, // Ensure scatter points are above custom bars for interaction
          },
        ],
        legend: {
          data: allLandmarkTypes.map((type) => ({
            name: type,
            icon: "rect", // Or 'roundRect', 'circle', etc.
            itemStyle: {
              color: typeColors[type], // Color for the legend icon
            },
          })),
          top: 80,
          left: "center",
          orient: "horizontal",
          textStyle: {
            color: "#333",
          },
          selected: this.selectedLegendTypes, // Initialize with the component's selected state
          selectedMode: "multiple", // Allows multiple selections
        },
      };

      this.timelineChart.setOption(option);

      // Listen for legend select changed event
      this.timelineChart.off("legendselectchanged"); // Remove previous listener to prevent duplicates
      this.timelineChart.on("legendselectchanged", (params) => {
        // Update the Vue component's data property
        this.selectedLegendTypes = params.selected;

        // Re-render the chart by setting the option again.
        // This will trigger renderItem and yAxis.axisLabel formatter to re-evaluate based on new selectedLegendTypes.
        // We don't need to rebuild `data` explicitly for `custom` series here,
        // as `renderItem` will re-run based on `this.selectedLegendTypes`.
        // However, for the scatter series' `symbol` to update, we need to update its data.
        this.timelineChart.setOption({
          yAxis: {
            axisLabel: {
              formatter: (name) => {
                const landmark = this.landmarksData.find(
                  (d) => d.name === name
                );
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
            },
          },
          series: [
            // Update the custom series (implicitly updates renderItem)
            {
              type: "custom",
              // No need to update data directly here, renderItem depends on this.selectedLegendTypes
            },
            // Update the scatter series data to reflect symbol changes
            {
              type: "scatter",
              data: this.landmarksData.map((d, index) => ({
                name: d.name,
                value: [d.startYear + (d.endYear - d.startYear) / 2, index],
                symbol: this.selectedLegendTypes[d.type] ? "circle" : "none", // Dynamically set symbol
                tooltip: {
                  formatter: (params) => {
                    // Re-assign tooltip formatter for each data item
                    const landmark = d;
                    const statusText =
                      landmark.status === "vanished"
                        ? "（已消失）"
                        : "（现存）";
                    return `
                    <strong>${landmark.name} ${statusText}</strong><br/>
                    类型: ${landmark.type}<br/>
                    年代: ${landmark.era}<br/>
                    重要性: ${landmark.importance}<br/>
                    ${landmark.description}
                  `;
                  },
                },
              })),
            },
          ],
        });
      });
    },

    // 新增：历年地标兴建/消失趋势图
    initTrendChart() {
      const chartDom = document.getElementById("trend-chart");
      if (!chartDom) return;

      // Dispose existing chart instance if it exists to prevent memory leaks
      if (this.trendChart) {
        this.trendChart.dispose();
      }
      this.trendChart = echarts.init(chartDom);

      const buildDataMap = {}; // 存储每年新建的地标名称列表
      const vanishDataMap = {}; // 存储每年消失的地标名称列表
      const minYear = -800;
      const maxYear = 2025;

      // 初始化所有年份的数据
      for (let i = minYear; i <= maxYear; i++) {
        buildDataMap[i] = [];
        vanishDataMap[i] = [];
      }

      this.landmarksData.forEach((d) => {
        if (d.startYear >= minYear && d.startYear <= maxYear) {
          buildDataMap[d.startYear].push(d.name);
        }
        if (
          d.status === "vanished" &&
          d.endYear >= minYear &&
          d.endYear <= maxYear
        ) {
          vanishDataMap[d.endYear].push(d.name);
        }
      });

      const years = Object.keys(buildDataMap)
        .map(Number)
        .sort((a, b) => a - b);
      const buildCounts = years.map((year) => buildDataMap[year].length);
      const vanishCounts = years.map((year) => vanishDataMap[year].length);

      const option = {
        title: {
          text: "北京地标兴建/消失趋势",
          subtext: "历年地标数量变化概览",
          left: "center",
          top: 20,
          textStyle: {
            color: "#333",
          },
          subtextStyle: {
            color: "#666",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            // params[0].name is the actual year number from xAxis.data
            const year = parseInt(params[0].name);
            let tooltip = `<strong>${
              year < 0 ? `公元前${-year}` : `${year}年`
            }</strong><br/>`;

            const currentBuildLandmarks = buildDataMap[year] || [];
            const currentVanishLandmarks = vanishDataMap[year] || [];

            params.forEach((item) => {
              tooltip += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
              if (
                item.seriesName === "兴建地标数量" &&
                currentBuildLandmarks.length > 0
              ) {
                tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentBuildLandmarks.join(
                  "、"
                )}<br/>`;
              } else if (
                item.seriesName === "消失地标数量" &&
                currentVanishLandmarks.length > 0
              ) {
                tooltip += `&nbsp;&nbsp;&nbsp;&nbsp;地标: ${currentVanishLandmarks.join(
                  "、"
                )}<br/>`;
              }
            });
            return tooltip;
          },
        },
        legend: {
          data: ["兴建地标数量", "消失地标数量"],
          top: 80,
          left: "center",
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "25%",
          bottom: "15%", // Adjust bottom to make space for dataZoom slider
          containLabel: true,
        },
        xAxis: {
          type: "category",
          // Keep x-axis data as raw numerical years
          data: years,
          axisLabel: {
            // Format numerical year to "公元前" or "年" string for display
            formatter: function (value) {
              const yearValue = parseInt(value); // value here is the number (e.g., -800, 1000)
              return yearValue < 0 ? `公元前${-yearValue}` : `${yearValue}年`;
            },
            interval: (index, value) => {
              const yearValue = parseInt(value); // value is already the number
              // Dynamically adjust interval based on year range
              if (Math.abs(yearValue) > 1000) {
                return yearValue % 500 === 0;
              } else if (Math.abs(yearValue) > 500) {
                return yearValue % 200 === 0;
              } else if (Math.abs(yearValue) > 100) {
                return yearValue % 100 === 0;
              } else {
                return index % 50 === 0; // For more recent times, show every 50 years
              }
            },
            rotate: 45, // Rotate labels to prevent overlap
          },
          boundaryGap: false, // Prevents gap at the beginning/end of the axis
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
          name: "地标数量",
          minInterval: 1, // Ensures Y-axis ticks are integers
        },
        series: [
          {
            name: "兴建地标数量",
            type: "line",
            smooth: true, // 平滑曲线
            symbol: "circle", // 实心圆点
            symbolSize: 8,
            itemStyle: {
              color: "#3CB371", // 翠绿色
            },
            lineStyle: {
              color: "#3CB371",
              width: 2,
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(60,179,113,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(60,179,113,0)",
                },
              ]),
            },
            data: buildCounts,
          },
          {
            name: "消失地标数量",
            type: "line",
            smooth: true, // 平滑曲线
            symbol: "diamond", // 菱形点
            symbolSize: 8,
            itemStyle: {
              color: "#DC143C", // 深红色
            },
            lineStyle: {
              color: "#DC143C",
              width: 2,
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(220,20,60,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(220,20,60,0)",
                },
              ]),
            },
            data: vanishCounts,
          },
        ],
        // --- 新增 dataZoom 配置 ---
        dataZoom: [
          {
            type: "slider", // 滑动条型
            xAxisIndex: 0, // 控制第一个（也是唯一一个）X轴
            filterMode: "empty", // 缩放时只过滤数据，不影响轴范围
            start: 0, // 初始显示数据的百分比起始位置
            end: 100, // 初始显示数据的百分比结束位置
            bottom: 0, // 放置在图表底部
            height: 20, // 滑动条高度
            textStyle: {
              color: "#666",
            },
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-9.1,0.4-9.1,0.4V2.7c0-0.3,0.1-0.4,0.3-0.5c0.2-0.1,0.5-0.1,0.7-0.1h15c0.3,0,0.5,0.1,0.7,0.1c0.2,0.1,0.3,0.2,0.3,0.5v9.6c0,0.2-0.1,0.4-0.3,0.5c-0.2,0.1-0.5,0.1-0.7,0.1h-1.3v-1.3H10.7zM4.9,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C5.1,4.4,5,4.3,4.9,4.3zM10.1,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C10.3,4.4,10.2,4.3,10.1,4.3zM15.3,4.3h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V4.5C15.5,4.4,15.4,4.3,15.3,4.3zM4.9,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C5.1,7.6,5,7.5,4.9,7.5zM10.1,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C10.3,7.6,10.2,7.5,10.1,7.5zM15.3,7.5h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2V7.7C15.5,7.6,15.4,7.5,15.3,7.5zM4.9,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C5.1,10.8,5,10.7,4.9,10.7zM10.1,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C10.3,10.8,10.2,10.7,10.1,10.7zM15.3,10.7h-0.2c-0.1,0-0.2,0.1-0.2,0.2v0.8c0,0.1,0.1,0.2,0.2,0.2h0.2c0.1,0,0.2-0.1,0.2-0.2v-0.8C15.5,10.8,15.4,10.7,15.3,10.7z", // 滑动条手柄图标
            handleSize: "110%", // 手柄大小
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
          {
            type: "inside", // 内置型，支持鼠标滚轮和拖拽
            xAxisIndex: 0,
            filterMode: "empty",
            zoomOnMouseWheel: true, // 开启鼠标滚轮缩放
            moveOnMouseMove: true, // 鼠标移动漫游
          },
        ],
      };
      this.trendChart.setOption(option);
    },

    initForceChart() {
      const chartDom = document.getElementById("force-chart");
      if (!chartDom) return;
      this.forceChart = echarts.init(chartDom);

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
        name: d.name,
        value: d.importance,
        category: d.type,
        symbolSize: d.importance * 4 + 15, // 根据重要性调整节点大小
        label: {
          show: true,
          position: "inside",
          fontSize: this.highlightedLandmarks.includes(d.name) ? 14 : 12, // 高亮地标字体更大
          color: this.highlightedLandmarks.includes(d.name) ? "#FFF" : "#EEE", // 高亮地标字体颜色更白
          fontWeight: this.highlightedLandmarks.includes(d.name)
            ? "bolder"
            : "bold", // 高亮地标字体加粗
          formatter: `{b}${d.status === "vanished" ? "\n(已消失)" : ""}`, // 消失地标添加标记
        },
        itemStyle: {
          color:
            d.status === "vanished"
              ? "#999999" // 消失地标的颜色
              : this.highlightedLandmarks.includes(d.name)
              ? this.getDarkerColor(typeColors[d.type])
              : typeColors[d.type], // 高亮地标使用更深色
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.3)",
        },
      }));

      const categories = [
        ...new Set(this.landmarksData.map((d) => d.type)),
      ].map((type) => ({ name: type }));

      const links = this.relationsData.map((r) => ({
        source: r.source,
        target: r.target,
        value: r.value,
        relation: r.relation, // 存储关系描述
        lineStyle: {
          color:
            r.value > 0.8 ? "#A0522D" : r.value > 0.6 ? "#D2B48C" : "#E8D8C3",
          width: r.value * 3 + 1,
          opacity: 0.8,
          curveness: 0.2,
        },
        label: {
          show: true, // 默认显示标签
          formatter: r.relation, // 显示关系描述
          fontSize: 10,
          color: "#666",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: [2, 4],
          borderRadius: 2,
        },
        emphasis: {
          lineStyle: {
            color: "#8B4513",
            width: r.value * 3 + 3,
          },
          label: {
            show: true,
            color: "#333",
            fontWeight: "bold",
          },
        },
      }));

      const option = {
        title: {
          text: "北京地标关系网络图：关联与强度",
          subtext:
            "节点大小：地标重要性 | 颜色：地标类型 | 连线：关系类型与强度",
          left: "center",
          top: 20,
          textStyle: {
            color: "#333",
            fontSize: 18,
          },
          subtextStyle: {
            color: "#666",
            fontSize: 12,
          },
        },
        legend: {
          data: categories.map((c) => c.name),
          left: "center",
          bottom: 10,
          textStyle: {
            color: "#333",
          },
        },
        series: [
          {
            name: "地标关系",
            type: "graph",
            layout: "force",
            data: nodes,
            links: links,
            categories: categories,
            roam: true,
            draggable: true,
            force: {
              repulsion: 600, // 大幅增加斥力，让节点散得更开
              edgeLength: [150, 250], // 增加理想边长
              gravity: 0.1, // 稍微增加引力，防止图散得太开
              friction: 0.6, // 增加一点摩擦力，让布局更快稳定
              layoutAnimation: true,
            },
            label: {
              show: true,
              position: "right",
              formatter: "{b}",
              fontSize: 12,
              color: "#333",
            },
            lineStyle: {
              color: "#999",
              curveness: 0.3,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                color: "#666",
              },
            },
            tooltip: {
              trigger: "item",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "#bd6b20",
              borderWidth: 1,
              textStyle: {
                color: "#333",
              },
              formatter: function (params) {
                if (params.dataType === "node") {
                  const nodeData = params.data;
                  const landmarkDetail = this.landmarksData.find(
                    (d) => d.name === nodeData.name
                  );
                  const statusText =
                    landmarkDetail.status === "vanished"
                      ? "（已消失）"
                      : "（现存）";

                  return `
                      <div style="padding: 5px 0;">
                        <strong style="font-size: 1.1em; color: #8B4513;">${nodeData.name} ${statusText}</strong><br/>
                        <span style="color: #666;">类型:</span> ${nodeData.category}<br/>
                        <span style="color: #666;">重要性评分:</span> ${nodeData.value}<br/>
                        <span style="color: #666;">描述:</span> ${landmarkDetail.description}
                      </div>
                    `;
                } else if (params.dataType === "edge") {
                  const edgeData = params.data;
                  return `
                      <div style="padding: 5px 0;">
                        <strong style="font-size: 1.1em; color: #8B4513;">${
                          edgeData.source
                        }</strong>
                        <span style="color: #666;">-</span> ${
                          edgeData.relation
                        } <span style="color: #666;">-</span>
                        <strong style="font-size: 1.1em; color: #8B4513;">${
                          edgeData.target
                        }</strong><br/>
                        <span style="color: #666;">关系强度:</span> ${edgeData.value.toFixed(
                          1
                        )}
                      </div>
                    `;
                }
                return "";
              }.bind(this), // 绑定this以访问landmarksData
            },
          },
        ],
      };
      this.forceChart.setOption(option);
    },

    resizeCharts() {
      if (this.timelineChart) {
        this.timelineChart.resize();
      }
      if (this.trendChart) {
        this.trendChart.resize();
      }
      if (this.forceChart) {
        this.forceChart.resize();
      }
    },
    // 辅助函数：获取颜色的更深版本
    getDarkerColor(hex) {
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
/* 保持原样，无需修改 */
.relations-viz-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 从顶部开始排列 */
  align-items: center;
  padding: 30px; /* 增加内边距，让内容不贴边 */
  box-sizing: border-box;
  /* 调整背景色，用更温暖的日落色调，并增加深度 */
  background: linear-gradient(
    145deg,
    #fefbf5 0%,
    #f9f3e6 100%
  ); /* 浅米色渐变 */
  border-radius: 12px; /* 稍微增大圆角 */
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.15); /* 更柔和的日落色阴影 */
  border: 1px solid #d4a76a; /* 增加边框，与主题色系统一 */
  position: relative; /* 用于背景元素 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 增加一些背景装饰来体现惊喜感 */
.relations-viz-container::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  width: 150px;
  height: 150px;
  background-color: rgba(209, 155, 97, 0.1); /* 柔和的日落黄圆点 */
  border-radius: 50%;
  filter: blur(40px); /* 模糊效果 */
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
  background-color: rgba(183, 138, 86, 0.1); /* 另一个柔和的日落黄圆点 */
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
  /* 标题颜色调整为日落主题的深棕色 */
  color: #8b4513;
  margin-bottom: 25px; /* 增加标题下边距 */
  font-size: 32px; /* 标题更大一些 */
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px; /* 增加字间距 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1); /* 增加一点阴影 */
  position: relative;
  z-index: 1; /* 确保在背景装饰之上 */
}

/* 标题下划线，增加日落渐变效果 */
.relations-viz-container h2::after {
  content: "";
  position: absolute;
  bottom: -5px; /* 调整位置 */
  left: 50%;
  transform: translateX(-50%);
  width: 80px; /* 宽度适中 */
  height: 4px; /* 粗细 */
  background: linear-gradient(
    to right,
    #d4a76a,
    #bd6b20,
    #d4a76a
  ); /* 日落渐变 */
  border-radius: 2px;
}

.chart-controls {
  margin-bottom: 30px; /* 增加按钮组下边距 */
  display: flex;
  gap: 18px; /* 按钮之间间距增大 */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; /* 允许换行，适应小屏幕 */
  z-index: 1; /* 确保在背景装饰之上 */
}

.chart-controls button {
  padding: 12px 25px; /* 按钮更大一些 */
  font-size: 17px; /* 字体更大 */
  border: 2px solid #d4a76a; /* 边框颜色与主题一致 */
  border-radius: 25px; /* 按钮更圆润 */
  background-color: #fef8f0; /* 浅米色背景，柔和 */
  color: #8b4513; /* 文字颜色 */
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px; /* 统一按钮宽度 */
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08); /* 柔和阴影 */
  font-weight: 500; /* 字体适中 */
  position: relative; /* 用于 active 状态的惊喜效果 */
  overflow: hidden; /* 隐藏溢出效果 */
}

.chart-controls button:hover {
  background-color: #f5eedf; /* 浅米色 hover */
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15); /* 阴影更明显 */
  transform: translateY(-2px);
}

/* 惊喜效果：按钮点击或激活时，光晕或流光效果 */
.chart-controls button.active {
  background: linear-gradient(45deg, #bd6b20, #d19b61); /* 激活按钮的日落渐变 */
  color: #fff;
  border-color: #bd6b20;
  box-shadow: 0 8px 20px rgba(189, 107, 32, 0.4); /* 更明显的激活阴影 */
  transform: translateY(-5px); /* 悬浮效果更明显 */
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
  background: rgba(255, 255, 255, 0.3); /* 流光效果 */
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

/* 新增的图表显示区域 */
.charts-display-area {
  flex-grow: 1; /* 占据剩余所有垂直空间 */
  width: 100%;
  display: flex; /* 让内部的 chart-instance 能够 flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: relative; /* 内部图表如果需要绝对定位则会相对于此 */
  min-height: 450px; /* 确保有足够高度，比之前更高 */
  overflow: hidden; /* 防止图表溢出 */
  border-radius: 12px; /* 与容器圆角一致 */
  background-color: #fefcf7; /* 图表区域的背景色，更干净 */
  box-shadow: inset 0 2px 10px rgba(139, 69, 19, 0.05); /* 内部阴影，增加层次感 */
  border: 1px solid #e8dfd1; /* 边框 */
}

.chart-instance {
  position: absolute; /* 让图表实例相互覆盖 */
  width: 100%;
  height: 100%;
  border-radius: 8px; /* 保持图表实例的圆角 */
  background-color: transparent; /* 确保图表背景透明，以便看到 charts-display-area 的背景 */
}

.viz-description {
  font-size: 16px; /* 描述文字大一点 */
  color: #7a6b64; /* 颜色调整为中等棕灰色 */
  text-align: center;
  max-width: 800px;
  line-height: 1.7; /* 行高增加 */
  margin-top: 35px; /* 与图表有更大间距 */
  margin-bottom: 0; /* 底部无外边距 */
  opacity: 0.9; /* 稍微透明一点 */
  position: relative;
  z-index: 1; /* 确保在背景装饰之上 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .relations-viz-container {
    padding: 20px 15px;
    border-radius: 8px;
  }
  .relations-viz-container h2 {
    font-size: 26px; /* 小屏幕标题更小 */
    margin-bottom: 20px;
  }
  .chart-controls {
    flex-direction: column; /* 按钮垂直排列 */
    gap: 12px; /* 调整间距 */
    margin-bottom: 25px;
  }
  .chart-controls button {
    padding: 10px 20px;
    font-size: 16px;
    min-width: unset; /* 取消最小宽度限制 */
    width: 85%; /* 按钮宽度占大部分 */
    border-radius: 20px;
  }
  .charts-display-area {
    min-height: 350px; /* 减小移动端图表高度 */
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