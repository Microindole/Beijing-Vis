<template>
  <div class="app-container">
    <h1>北京历史地标评估雷达图</h1>

    <div class="controls">
      <div class="control-buttons">
        <button @click="selectAll" class="antique-button">全选</button>
        <button @click="deselectAll" class="antique-button">取消全选</button>
      </div>
      <div
        v-for="landmark in allLandmarks"
        :key="landmark"
        class="checkbox-item"
      >
        <input
          type="checkbox"
          :id="landmark"
          :value="landmark"
          v-model="selectedLandmarks"
        />
        <label :for="landmark">{{ landmark }}</label>
      </div>
    </div>

    <div class="chart-container">
      <RadarChart :selectedLandmarks="selectedLandmarks" />
    </div>

    <div class="dimensions-info">
      <h3>评估维度说明：</h3>
      <ul>
        <li><strong>官方评级</strong>：国家文物局等官方机构的评级</li>
        <li><strong>历史价值</strong>：历史意义和文化价值</li>
        <li><strong>公众热度</strong>：游客数量和知名度</li>
        <li><strong>当代活力</strong>：在现代社会中的活跃程度</li>
        <li><strong>文化独特性</strong>：文化特色和独有特征</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RadarChart from "./RadarChart.vue";

// 定义 props 来接收父组件传来的 currentLandmark
const props = defineProps({
  currentLandmark: {
    type: String,
    default: '' // 提供一个默认值
  }
});

const allLandmarks = [
  "故宫",
  "天坛",
  "长城",
  "明十三陵",
  "北海公园",
  "法源寺",
  "颐和园",
  "大栅栏",
];
// const selectedLandmarks = ref(["故宫", "长城", "颐和园"]); // 默认选中几个
// 将 selectedLandmarks 的初始值设置为一个只包含当前景点的数组
const selectedLandmarks = ref([props.currentLandmark]);

const selectAll = () => {
  selectedLandmarks.value = [...allLandmarks];
};

const deselectAll = () => {
  selectedLandmarks.value = [];
};

const toggleLandmark = (landmark) => {
  const index = selectedLandmarks.value.indexOf(landmark);
  if (index === -1) {
    selectedLandmarks.value.push(landmark);
  } else {
    selectedLandmarks.value.splice(index, 1);
  }
};
</script>

<style>
h1 {
  text-align: center;
  /* color: #8c4a2a; */
  color: #d4b483;
  margin-bottom: 30px;
  font-weight: normal;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.control-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.antique-button {
  padding: 8px 16px;
  /* background-color: #c23531; */
  background-color: #582c2c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Microsoft YaHei";
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.antique-button:hover {
  /* background-color: #a52a2a; */
  background-color: #8c4a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.antique-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.chart-container {
  margin: 30px 0;
}

.dimensions-info {
  margin-top: 30px;
  padding: 15px;
  background-color: #fffcf0;
  border-radius: 5px;
}

.dimensions-info h3 {
  margin-top: 0;
  color: #2c3e50;
}

.dimensions-info ul {
  padding-left: 20px;
}

.dimensions-info li {
  margin-bottom: 8px;
  color: #877325;
  font-size: larger;
}
</style>
