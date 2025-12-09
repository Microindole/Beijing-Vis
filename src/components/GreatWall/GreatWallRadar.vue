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
        // 提示框
        tooltip: {
            trigger: 'item'
        },
        // 雷达坐标系配置
        radar: {
            indicator: [
                { name: '官方评级', max: 5 },
                { name: '历史价值', max: 5 },
                { name: '公众热度', max: 5 },
                { name: '当代活力', max: 5 },
                { name: '文化独特性', max: 5 }
            ],
            radius: '65%', // 稍微调小半径，确保文字不被切断
            center: ['50%', '55%'], // 居中略微偏下，视觉平衡
            shape: 'circle',
            splitNumber: 4,
            axisName: {
                color: '#8b4513', // 深棕色字体
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
                name: '长城核心价值评估',
                type: 'radar',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#d4a76a', // 点的颜色
                    borderColor: '#8b4513',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#8b4513', // 线条颜色
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(212, 167, 106, 0.8)' }, // 金色渐变
                        { offset: 1, color: 'rgba(139, 69, 19, 0.6)' }    // 深棕渐变
                    ])
                },
                // 长城的数据：各项均为满分（参考原数据）
                data: [
                    {
                        value: [5, 5, 5, 5, 5],
                        name: '长城'
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