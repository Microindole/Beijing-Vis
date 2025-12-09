<template>
    <div ref="chartRef" class="radar-container"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);
let myChart = null;

const initChart = () => {
    if (!chartRef.value) return;

    myChart = echarts.init(chartRef.value);

    const option = {
        tooltip: {
            trigger: 'item'
        },
        radar: {
            indicator: [
                { name: '官方评级', max: 5 },
                { name: '历史价值', max: 5 },
                { name: '公众热度', max: 5 },
                { name: '当代活力', max: 5 },
                { name: '文化独特性', max: 5 }
            ],
            radius: '65%',
            center: ['50%', '55%'],
            shape: 'circle',
            splitNumber: 4,
            axisName: {
                color: '#8b4513',
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'Noto Serif SC'
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(139, 69, 19, 0.1)',
                        'rgba(139, 69, 19, 0.2)',
                        'rgba(139, 69, 19, 0.2)',
                        'rgba(139, 69, 19, 0.2)',
                        'rgba(139, 69, 19, 0.4)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(139, 69, 19, 0.3)'
                }
            }
        },
        series: [
            {
                name: '明十三陵价值评估',
                type: 'radar',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#B26F4A', // 陵墓土红色
                    borderColor: '#8b4513',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#8b4513',
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(178, 111, 74, 0.8)' },
                        { offset: 1, color: 'rgba(139, 69, 19, 0.6)' }
                    ])
                },
                // 明十三陵数据：历史极高，但在公众热度和活力上略低于长城
                data: [
                    {
                        value: [5, 5, 4, 3.5, 5],
                        name: '明十三陵'
                    }
                ]
            }
        ]
    };

    myChart.setOption(option);
};

onMounted(() => {
    initChart();
    window.addEventListener("resize", () => myChart && myChart.resize());
});

onUnmounted(() => {
    window.removeEventListener("resize", () => myChart && myChart.resize());
    if (myChart) myChart.dispose();
});
</script>

<style scoped>
.radar-container {
    width: 100%;
    height: 100%;
    min-height: 1px;
}
</style>