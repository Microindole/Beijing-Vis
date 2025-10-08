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
      此图集描绘了北京地标的兴衰变迁与内在脉络。您可以在时间线中回溯历史，在关系网中发现关联。请切换图表类型，开启探索之旅。
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
      this.forceChart.off('mouseover');
      this.forceChart.off('mouseout');
      this.forceChart.off('click');
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

      // Dispose existing chart instance if it exists to prevent memory leaks and re-initialization issues
      if (this.timelineChart) {
        this.timelineChart.dispose();
      }
      this.timelineChart = echarts.init(chartDom);

      // Define landmark type colors
      const typeColors = {
        皇家建筑: '#A6341B',
        皇家园林: '#4A6C4B',
        皇家祭祀: '#C77E22',
        皇家陵寝: '#8B4513',
        市井文化: '#D29E5A',
        宗教建筑: '#E0C870',
        军事防御: '#6C7A89',
        城门: '#8C7B70',
        都城遗址: '#4682B4',
        现代建筑: '#2F4F4F',
        报时建筑: '#C15E3A',
        牌楼: '#B5651D',
        名人故居: '#9B59B6',
        桥梁: '#778899',
        水系: '#5D9CEC',
        胡同街区: '#CD853F',
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
        animationEasing: 'cubicInOut',
        animationDuration: 1000,
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
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "empty",
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty',
            right: '1%',
            width: 15,        // 滑块宽度
            start: 0,         // 初始显示从顶部开始
            end: 50,          // 显示50%的数据
            handleSize: '100%',
            showDataShadow: false,
            textStyle: {
              color: '#333'
            }
          },
          {
            type: 'inside',   // 内置型，支持鼠标滚轮
            yAxisIndex: 0,
            filterMode: 'empty'
          }
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
              // --- 第1步：获取基础数据 ---
              const landmarkData = api.value(3); // 完整的地标数据对象
              const landmarkYIndex = api.value(2); // 地标在Y轴上的位置索引

              // 如果图例被取消勾选，则不渲染
              if (!this.selectedLegendTypes[landmarkData.type]) {
                return;
              }

              // --- 第2步：获取地标长条【完整】的起止像素坐标 ---
              // 即使起点或终点在屏幕外，api.coord也能计算出它应该在的像素位置
              const startPoint = api.coord([landmarkData.startYear, landmarkYIndex]);
              const endPoint = api.coord([landmarkData.endYear, landmarkYIndex]);

              // --- 第3步：获取当前图表可见区域的像素范围 ---
              // params.coordSys 提供了绘图区域（grid）的像素信息 { x, y, width, height }
              const gridRect = params.coordSys;
              const viewMinPx = gridRect.x;
              const viewMaxPx = gridRect.x + gridRect.width;

              // --- 第4步：判断长条是否与可见区域有交集 ---
              // 如果长条的终点在可见区开始之前，或者起点在可见区结束之后，则不渲染
              if (endPoint[0] < viewMinPx || startPoint[0] > viewMaxPx) {
                return;
              }

              // --- 第5步：手动“裁剪”出在视图内部分的像素起止点 ---
              const visibleStartPx = Math.max(startPoint[0], viewMinPx);
              const visibleEndPx = Math.min(endPoint[0], viewMaxPx);

              // --- 第6步：计算最终要绘制的矩形的参数 ---
              const height = api.size([0, 1])[1] * 0.6;
              const width = Math.max(0, visibleEndPx - visibleStartPx); // 宽度是裁剪后的像素差
              const x = visibleStartPx; // 矩形的X坐标就是裁剪后的像素起点

              const isHighlighted = this.highlightedLandmarks.includes(landmarkData.name);
              // (此处的 typeColors 变量会从 initTimelineChart 的外部作用域继承，无需在此重新定义)

              return {
                type: 'rect',
                shape: { x: x, y: startPoint[1] - height / 2, width: width, height: height },
                // ** 使用了您之前版本的、包含完整样式的 style 模块 **
                style: api.style({
                  // 基础填充色
                  fill: isHighlighted
                      ? this.getDarkerColor(typeColors[landmarkData.type] || '#999')
                      : (typeColors[landmarkData.type] || '#999'),

                  // 恢复：边框、阴影和高亮效果
                  stroke: "#fff",
                  lineWidth: isHighlighted ? 2 : 1,
                  shadowBlur: isHighlighted ? 8 : 5,
                  shadowColor: isHighlighted
                      ? "rgba(0,0,0,0.4)"
                      : "rgba(0,0,0,0.2)",

                  lineDash: landmarkData.status === "vanished" ? [5, 5] : [],
                })
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
          data: years, // X轴数据是年份数组
          boundaryGap: false,
          axisTick: { alignWithLabel: true },
          axisLabel: {
            // 优化 “0年” 的显示
            formatter: function (value) {
              const yearValue = parseInt(value);
              if (yearValue === 0) return '公元元年';
              return yearValue < 0 ? `公元前${-yearValue}` : `${yearValue}年`;
            },
            // 简化 interval 逻辑，让标签更稀疏、更规整
            interval: (index, value) => {
              const yearValue = parseInt(value);
              // 在北京建都史后的重要时期，每100年显示一个标签
              if (yearValue >= 1200 && yearValue <= 2000) {
                return yearValue % 100 === 0;
              }
              // 其他的古代时期，每400年显示一个，避免过于拥挤
              return yearValue % 400 === 0;
            },
            rotate: 45
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
              color: "#D29E5A", // 翠绿色
            },
            lineStyle: {
              color: "#D29E5A",
              width: 2,
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(210, 158, 90, 0.4)' },
                { offset: 1, color: 'rgba(210, 158, 90, 0)' }
              ]),
            },
            data: buildCounts,
            emphasis: {
              focus: 'series', // 聚焦于当前系列
              lineStyle: {
                width: 4
              },
              symbolSize: 12
            },
            markArea: {
              silent: true, // 让标记区域不响应鼠标事件
              itemStyle: {
                color: 'rgba(0,0,0,0.04)' // 默认的淡淡的背景色
              },
              data: [
                [ { name: '前秦', xAxis: '-800', itemStyle: { color: 'rgba(255,225,180,0.1)' } }, { xAxis: '-221' } ],
                // --- 秦汉时期 ---
                [ { name: '秦', xAxis: '-221', itemStyle: { color: 'rgba(139, 101, 8, 0.1)' },
                  label: {
                    position: 'insideBottom',
                    distance: 170
                  }
                  }, { xAxis: '-206' } ],
                [ { name: '汉', xAxis: '-206', itemStyle: { color: 'rgba(205, 133, 63, 0.1)' } }, { xAxis: '220' } ],
                // --- 魏晋南北朝 ---
                [ { name: '三国及两晋', xAxis: '220', itemStyle: { color: 'rgba(132, 112, 255, 0.1)' } }, { xAxis: '420' } ],
                [ { name: '南北朝', xAxis: '420', itemStyle: { color: 'rgba(125, 158, 192, 0.1)' },
                  label: {
                    position: 'insideBottom',
                    distance: 170
                  }
                  }, { xAxis: '589' } ],
                // --- 隋唐五代 ---
                [ { name: '隋', xAxis: '581', itemStyle: { color: 'rgba(255, 165, 0, 0.1)' } }, { xAxis: '618' } ],
                [ { name: '唐', xAxis: '618', itemStyle: { color: 'rgba(255, 127, 80, 0.15)' } }, { xAxis: '907' } ],
                [ { name: '五代十国', xAxis: '907', itemStyle: { color: 'rgba(112, 128, 144, 0.15)' },
                  label: {
                    position: 'insideBottom',
                    distance: 170
                  }
                },
                  { xAxis: '960' } ],
                // --- 宋辽金元 ---
                [ { name: '宋', xAxis: '960', itemStyle: { color: 'rgba(188, 143, 143, 0.15)' } }, { xAxis: '1279' } ],
                [ { name: '辽', xAxis: '907', itemStyle: { color: 'rgba(159, 219, 144, 0.15)' } }, { xAxis: '1125' } ],
                [ { name: '金', xAxis: '1115', itemStyle: { color: 'rgba(255, 236, 139, 0.2)' } }, { xAxis: '1234' } ],
                [ { name: '元', xAxis: '1271', itemStyle: { color: 'rgba(135, 206, 235, 0.12)' },
                  label: {
                    position: 'insideBottom',
                    distance: 170
                  }
                  }, { xAxis: '1368' } ],
                // --- 明清及民国 ---
                [ { name: '明', xAxis: '1368', itemStyle: { color: 'rgba(255, 228, 181, 0.2)' } }, { xAxis: '1644' } ],
                [ { name: '清', xAxis: '1644', itemStyle: { color: 'rgba(240, 128, 128, 0.12)' } }, { xAxis: '1912' } ],
                [ { name: '民国', xAxis: '1912', itemStyle: { color: 'rgba(100, 149, 237, 0.15)' } }, { xAxis: '1949' } ],
                [  { name: '现代', xAxis: '1949', itemStyle: { color: 'rgba(255,31,0,0.1)' },
                  label: {
                    position: 'insideBottom',
                    distance: 170
                  }
                },
                  { xAxis: '2025' } ],


              ],
              label: {
                color: '#777', // 标签文字颜色
                fontSize: 14,
                fontWeight: 'bold',
                position: 'insideTop', // 标签显示在区域内部顶部
                distance: 15     // 距离顶部的距离
              }
            }
          },
          {
            name: "消失地标数量",
            type: "line",
            smooth: true, // 平滑曲线
            symbol: "diamond", // 菱形点
            symbolSize: 8,
            itemStyle: {
              color: "#6C7A89", // 深红色
            },
            lineStyle: {
              color: "#6C7A89",
              width: 2,
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(108, 122, 137, 0.4)' },
                { offset: 1, color: 'rgba(108, 122, 137, 0)' }
              ]),
            },
            data: vanishCounts,
            emphasis: { // 【新增】悬停高亮状态
              focus: 'series',
              lineStyle: {
                width: 4
              },
              symbolSize: 12
            }
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
      const nodes = this.landmarksData.map((d) => {
        const isHighlighted = this.highlightedLandmarks.includes(d.name);
        const isVanished = d.status === "vanished";

        let nodeColor;
        if (isVanished) {
          nodeColor = "#999999";
        } else if (isHighlighted) {
          nodeColor = this.getDarkerColor(typeColors[d.type]);
        } else {
          nodeColor = typeColors[d.type];
        }

        return {
          name: d.name,
          value: d.importance,
          category: d.type,
          symbolSize: d.importance * 4 + 15,
          label: {
            show: true,
            // 核心修改 1: 将位置从 'inside' 改为 'right'
            position: 'right',
            // 核心修改 2: 固定文字颜色为深色，保证清晰
            color: '#333',
            fontSize: 12,
            // 核心修改 3: 优化格式，使其在外部显示更美观
            formatter: `{b}${isVanished ? " (已消失)" : ""}`
          },
          itemStyle: {
            color: nodeColor,
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.3)"
          },
          select: {
            label: {
              show: true, // 核心：确保标签在选中时依然显示
              fontWeight: 'bold' //可以让字体加粗以示区别
            },
            itemStyle: {
              borderColor: '#666', // 为选中的节点增加一个深色边框
              borderWidth: 2
            }
          }
        };
      });
      const categories = [...new Set(this.landmarksData.map((d) => d.type))].map((type) => ({name: type}));
      const links = this.getStyledLinks();
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
          force: {repulsion: 800, edgeLength: [200, 300], gravity: 0.01, friction: 0.6, layoutAnimation: true},
          label: {show: true, position: "right", formatter: "{b}", fontSize: 12, color: "#333"},
          lineStyle: {color: "#999", curveness: 0.3},
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              color: '#8B4513',
              width: 4
            },
            label: {
              show: true,
              color: '#333',
              fontWeight: 'bold',
              fontSize: 11,
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: [3, 5],
              borderRadius: 3
            }
          },
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
      this.forceChart.off('mouseover');
      this.forceChart.off('mouseout');

      // 核心修改2：使用新的、正确的逻辑来绑定事件
      this.forceChart.on('mouseover', (params) => {
        if (params.dataType === 'node') {
          const nodeName = params.name;
          // 直接在现有配置上更新，效率更高
          this.forceChart.setOption({
            series: [{
              links: this.getStyledLinks().map(link => {
                // 如果线与悬停的节点相连
                if (link.source === nodeName || link.target === nodeName) {
                  // 就显示它的文字，并让线条加粗
                  link.label.show = true;
                  link.lineStyle.width = (link.value * 3 + 1) + 2;
                }
                return link;
              })
            }]
          });
        }
      });

      this.forceChart.on('mouseout', (params) => {
        if (params.dataType === 'node') {
          // 鼠标移出时，简单地恢复为默认样式即可
          this.forceChart.setOption({
            series: [{
              links: this.getStyledLinks()
            }]
          });
        }
      });



      this.forceChart.off('click'); // 先移除旧的监听，防止重复
      this.forceChart.on('click', (params) => {
        // 如果点击的是一个节点
        if (params.dataType === 'node') {
          const nodeName = params.name;
          const styledLinks = this.getStyledLinks();

          // 遍历所有线，如果线连接到了被点击的节点，就显示其文字
          const finalLinks = styledLinks.map(link => {
            if (link.source === nodeName || link.target === nodeName) {
              link.label.show = true;
            }
            return link;
          });
          this.forceChart.setOption({ series: [{ links: finalLinks }] });
        } else {
          // 如果点击的不是节点（例如是空白区域）
          // 则恢复所有线的默认状态（隐藏所有标签）
          this.forceChart.setOption({ series: [{ links: this.getStyledLinks() }] });
        }
      });
    },
    getStyledLinks() {
      return this.relationsData.map((r) => {
        const originalColor = r.value > 0.8 ? "#A0522D" : r.value > 0.6 ? "#D2B48C" : "#E8D8C3";

        return {
          source: r.source, target: r.target, value: r.value, relation: r.relation,

          // 1. 默认状态 (lineStyle): 设置为彩色
          lineStyle: {
            color: originalColor,
            width: r.value * 3 + 1,
            opacity: 0.8,
            curveness: 0.2
          },

          label: {
            show: false,
            formatter: r.relation,
            fontSize: 10,
            color: "#666",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: [2, 4],
            borderRadius: 2
          },

          // 2. 鼠标悬停状态 (emphasis): 这个会被事件覆盖，但我们先定义一个基础样式
          emphasis: {
            lineStyle: {
              width: r.value * 3 + 3
            },
            label: { show: true, color: "#333", fontWeight: "bold" }
          },

          // 3. 点击选中状态 (select): 保持彩色且更粗
          select: {
            lineStyle: {
              width: r.value * 3 + 5,
              color: originalColor, // 选中时也使用彩色
              opacity: 1
            }
          },

          // 4. 虚化状态 (blur): 彩色但更透明
          blur: {
            lineStyle: {
              color: originalColor,
              opacity: 0.2
            }
          }
        };
      });
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
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap');

/* ===== 整体容器：调整为更有质感的宣纸/画卷背景 ===== */
.relations-viz-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
  /* 使用更有质感的米黄色作为背景 */
  background: #fdfaf2;
  border-radius: 8px;
  border: 1px solid #e0d9ce;
  box-shadow: 0 10px 35px rgba(139, 69, 19, 0.1);
  position: relative;
  overflow: hidden;
}

/* 移除之前的动画背景，保持简洁 */
.relations-viz-container::before,
.relations-viz-container::after {
  display: none;
}

/* ===== 标题：使用引入的书法字体 ===== */
.relations-viz-container h2 {
  font-family: 'ZCOOL XiaoWei', cursive; /* 应用书法字体 */
  color: #6a3906; /* 更深的棕色，如木刻印章 */
  margin-bottom: 30px;
  font-size: 36px;
  text-align: center;
  font-weight: normal; /* 书法字体通常不需要额外加粗 */
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.relations-viz-container h2::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #d4a76a, #bd6b20);
  border-radius: 2px;
}


/* ===== 控制按钮：设计为“印章”或“牌匾”风格 ===== */
.chart-controls {
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
  z-index: 1;
}

.chart-controls button {
  padding: 10px 20px;
  font-size: 18px;
  font-family: 'ZCOOL XiaoWei', cursive; /* 按钮也使用书法字体 */
  border: 2px solid #c8a87e; /* 边框颜色 */
  border-radius: 6px; /* 稍微带一点圆角，像牌匾 */
  background-color: transparent; /* 透明背景 */
  color: #8b5a2b; /* 文字颜色 */
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  box-shadow: none; /* 移除阴影，追求更古典的平面感 */
}

.chart-controls button:hover {
  background-color: rgba(212, 167, 106, 0.1);
  border-color: #bd6b20;
  color: #6a3906;
  transform: translateY(-2px); /* 轻微上浮效果 */
}

/* 激活状态：模拟“印章”盖下的效果 */
.chart-controls button.active {
  background-color: #8B4513; /* 经典的“印泥”棕红色 */
  color: #fdfaf2; /* 文字变为背景的米白色 */
  border-color: #6a3906;
  transform: translateY(0);
  box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.2); /* 轻微的内阴影，模拟按下的感觉 */
  animation: none; /* 移除之前的光效动画 */
}

/* ===== 图表区域：模拟画卷纸张 ===== */
.charts-display-area {
  flex-grow: 1;
  width: 100%;
  position: relative;
  min-height: 450px;
  border-radius: 4px;
  background-color: #fff; /* 保持图表区域的干净白色背景 */
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.08);
  border: 1px solid #e0d9ce;
}

.chart-instance {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fefcf7; /* 图表实例背景透明，以显示父容器颜色 */
}

.viz-description {
  font-size: 16px;
  color: #8c7b70; /* 文字颜色调整为更柔和的棕灰色 */
  text-align: center;
  max-width: 1200px;
  line-height: 1.7;
  margin-top: 30px;
  position: relative;
  z-index: 1;
}
</style>
