import * as echarts from "echarts";

/**
 * @description 定义了不同地标类型的颜色，用于图表系列的可视化区分
 */
export const typeColors = {
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

/**
 * @description 获取一个更深的颜色版本
 * @param {string} hex - 十六进制颜色字符串 (e.g., "#RRGGBB")
 * @returns {string} - 计算后的更深的十六进制颜色字符串
 */
export function getDarkerColor(hex) {
    if (!hex || hex.length < 7) return "#000000";
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * @description 创建一个 ResizeObserver 来自动调整图表大小
 * @param {HTMLElement} element - 图表容器元素
 * @param {echarts.ECharts} chartInstance - ECharts 实例
 * @returns {ResizeObserver} - 返回创建的 observer 实例，以便在组件卸载时断开连接
 */
export function useChartResize(element, chartInstance) {
    const resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
    });
    resizeObserver.observe(element);
    return resizeObserver;
}