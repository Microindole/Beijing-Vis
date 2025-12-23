<template>
  <div ref="chartRef" class="radar-container"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);
let myChart = null;

const initChart = () => {
  if (!chartRef.value) return;

  myChart = echarts.init(chartRef.value);

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(60, 60, 60, 0.95)",
      borderColor: "#b24b3a",
      borderWidth: 2,
      padding: [10, 12],
      textStyle: {
        color: "#ffffff",
        fontFamily: "Noto Serif SC",
        fontSize: 14
      },
      // 做成你截图类似的“列表 + 数值对齐”
      formatter: (params) => {
        const name = params?.name ?? "法源寺";
        const v = params?.value ?? [];
        const labels = ["官方评级", "历史价值", "公众热度", "当代活力", "文化独特性"];

        const rows = labels
          .map((label, i) => {
            const val = v[i] ?? "-";
            return `
              <div style="display:flex;justify-content:space-between;gap:24px;line-height:1.6;">
                <span>
                  <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#b24b3a;margin-right:8px;vertical-align:middle;"></span>
                  ${label}
                </span>
                <b style="font-size:16px;">${val}</b>
              </div>
            `;
          })
          .join("");

        return `
          <div style="min-width:180px;">
            <div style="font-weight:700;font-size:18px;margin-bottom:6px;">${name}</div>
            ${rows}
          </div>
        `;
      }
    },

    radar: {
      indicator: [
        { name: "官方评级", max: 5 },
        { name: "历史价值", max: 5 },
        { name: "公众热度", max: 5 },
        { name: "当代活力", max: 5 },
        { name: "文化独特性", max: 5 }
      ],
      radius: "65%",
      center: ["50%", "55%"],
      shape: "circle",
      splitNumber: 4,
      axisName: {
        color: "#8b4513",
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "Noto Serif SC"
      },
      splitLine: {
        lineStyle: {
          color: [
            "rgba(139, 69, 19, 0.1)",
            "rgba(139, 69, 19, 0.2)",
            "rgba(139, 69, 19, 0.2)",
            "rgba(139, 69, 19, 0.2)",
            "rgba(139, 69, 19, 0.4)"
          ].reverse()
        }
      },
      splitArea: { show: false },
      axisLine: {
        lineStyle: { color: "rgba(139, 69, 19, 0.3)" }
      }
    },

    series: [
      {
        name: "法源寺佛教文化综合评估",
        type: "radar",
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#6b3f3f",     // 更贴近你截图里的深棕色点
          borderColor: "#5a2e2e",
          borderWidth: 2
        },
        lineStyle: {
          color: "#5a2e2e",
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(107, 63, 63, 0.55)" },
            { offset: 1, color: "rgba(107, 63, 63, 0.25)" }
          ])
        },
        data: [
          {
            value: [3, 4, 2, 3, 5],
            name: "法源寺"
          }
        ]
      }
    ]
  };

  myChart.setOption(option);
};

// 重要：resize 的 handler 需要是同一个引用，避免 removeEventListener 无效
const handleResize = () => {
  if (myChart) myChart.resize();
};

onMounted(async () => {
  await nextTick();
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style scoped>
.radar-container {
  width: 100%;
  height: 100%;
  min-height: 1px;
}
</style>
