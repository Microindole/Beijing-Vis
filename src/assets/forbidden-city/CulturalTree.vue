<template>
  <!-- 文化传承活动的树图 -->
  <div class="cultural-tree-container">
    <h1>故宮文化傳承之樹</h1>
    <div ref="treeChart" class="tree-chart"></div>
    <div class="legend">
      <div v-for="(item, index) in legendData" :key="index" class="legend-item">
        <span class="legend-color" :style="{backgroundColor: item.color}"></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="tooltip" v-if="tooltip.visible" :style="{left: tooltip.x + 'px', top: tooltip.y + 'px'}">
      <h3>{{ tooltip.title }}</h3>
      <p>{{ tooltip.desc }}</p>
      <p>參與人數: {{ tooltip.participants }}人</p>
      <p>舉辦次數: {{ tooltip.frequency }}次</p>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

export default {
  name: 'CulturalTree',
  setup() {
    const treeChart = ref(null);
    const tooltip = ref({
      visible: false,
      x: 0,
      y: 0,
      title: '',
      desc: '',
      participants: 0,
      frequency: 0
    });

    const legendData = [
      { name: '特展', color: '#ff7f0e' },
      { name: '講座', color: '#1f77b4' },
      { name: '青少年營', color: '#2ca02c' },
      { name: '數字化互動', color: '#d62728' },
      { name: '學術論壇', color: '#9467bd' }
    ];

    const treeData = {
      name: '故宮文化',
      children: [
        {
          name: '特展',
          value: 120,
          itemStyle: { color: '#ff7f0e' },
          children: [
            {
              name: '文明先鋒——凌家灘文化玉器展',
              value: 45,
              desc: '展示凌家灘文化精美玉器',
              participants: 120000,
              frequency: 3,
              itemStyle: { color: '#ff7f0e' }
            },
            {
              name: '紫禁城建築藝術展',
              value: 35,
              desc: '展示紫禁城建築藝術精髓',
              participants: 85000,
              frequency: 2,
              itemStyle: { color: '#ff7f0e' }
            },
            {
              name: '清代宮廷生活展',
              value: 40,
              desc: '再現清代宮廷生活場景',
              participants: 95000,
              frequency: 4,
              itemStyle: { color: '#ff7f0e' }
            }
          ]
        },
        {
          name: '講座',
          value: 80,
          itemStyle: { color: '#1f77b4' },
          children: [
            {
              name: '故宮知識課堂',
              value: 30,
              desc: '普及故宮文化知識',
              participants: 5000,
              frequency: 12,
              itemStyle: { color: '#1f77b4' }
            },
            {
              name: '文物保護講座',
              value: 25,
              desc: '介紹文物保護技術與方法',
              participants: 3200,
              frequency: 8,
              itemStyle: { color: '#1f77b4' }
            },
            {
              name: '歷史文化講座',
              value: 25,
              desc: '講解中國歷史文化',
              participants: 4500,
              frequency: 10,
              itemStyle: { color: '#1f77b4' }
            }
          ]
        },
        {
          name: '青少年營',
          value: 60,
          itemStyle: { color: '#2ca02c' },
          children: [
            {
              name: '小小講解員培訓',
              value: 20,
              desc: '培養青少年講解故宮文化',
              participants: 800,
              frequency: 6,
              itemStyle: { color: '#2ca02c' }
            },
            {
              name: '傳統手工藝體驗',
              value: 20,
              desc: '體驗傳統手工藝製作',
              participants: 1200,
              frequency: 5,
              itemStyle: { color: '#2ca02c' }
            },
            {
              name: '歷史情景劇表演',
              value: 20,
              desc: '通過表演了解歷史',
              participants: 1500,
              frequency: 4,
              itemStyle: { color: '#2ca02c' }
            }
          ]
        },
        {
          name: '數字化互動',
          value: 90,
          itemStyle: { color: '#d62728' },
          children: [
            {
              name: 'VR故宮遊',
              value: 35,
              desc: '虛擬現實技術遊覽故宮',
              participants: 250000,
              frequency: 15,
              itemStyle: { color: '#d62728' }
            },
            {
              name: 'AR文物展示',
              value: 30,
              desc: '增強現實技術展示文物',
              participants: 180000,
              frequency: 12,
              itemStyle: { color: '#d62728' }
            },
            {
              name: '數字文物庫',
              value: 25,
              desc: '線上瀏覽高清文物影像',
              participants: 500000,
              frequency: 24,
              itemStyle: { color: '#d62728' }
            }
          ]
        },
        {
          name: '學術論壇',
          value: 50,
          itemStyle: { color: '#9467bd' },
          children: [
            {
              name: '太和論壇',
              value: 25,
              desc: '國際文化遺產保護論壇',
              participants: 2000,
              frequency: 2,
              itemStyle: { color: '#9467bd' }
            },
            {
              name: '故宮學術研討會',
              value: 25,
              desc: '故宮文化學術研究交流',
              participants: 1500,
              frequency: 3,
              itemStyle: { color: '#9467bd' }
            }
          ]
        }
      ]
    };

    onMounted(() => {
      const chart = echarts.init(treeChart.value);
      
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function(params) {
            if (params.data.desc) {
              return `
                <strong>${params.name}</strong><br/>
                類型: ${params.data.parent}<br/>
                描述: ${params.data.desc}<br/>
                參與人數: ${params.data.participants}人<br/>
                舉辦次數: ${params.data.frequency}次
              `;
            }
            return params.name;
          }
        },
        series: [
          {
            type: 'tree',
            data: [treeData],
            symbol: 'emptyCircle',
            symbolSize: 7,
            orient: 'vertical',
            expandAndCollapse: true,
            initialTreeDepth: 3,
            label: {
              position: 'top',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'center',
              fontSize: 12,
              formatter: function(params) {
                return params.name;
              }
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              },
              symbol: 'circle',
              symbolSize: function(data) {
                return Math.sqrt(data.value) * 3;
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            itemStyle: {
              color: function(params) {
                return params.data.itemStyle?.color || '#999'; // 使用可選鏈操作符和默認顏色
              }
            },
            lineStyle: {
              color: '#ccc',
              width: 2
            },
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };

      chart.setOption(option);

      // 處理點擊事件顯示詳細信息
      chart.on('click', (params) => {
        if (params.data.desc) {
          tooltip.value = {
            visible: true,
            x: params.event.event.clientX + 10,
            y: params.event.event.clientY + 10,
            title: params.name,
            desc: params.data.desc,
            participants: params.data.participants,
            frequency: params.data.frequency
          };
        } else {
          tooltip.value.visible = false;
        }
      });

      // 點擊空白處隱藏工具提示
      window.addEventListener('click', (event) => {
        if (!event.target.closest('.tree-chart')) {
          tooltip.value.visible = false;
        }
      });

      // 響應式調整
      window.addEventListener('resize', function() {
        chart.resize();
      });
    });

    return {
      treeChart,
      tooltip,
      legendData
    };
  }
};
</script>

<style scoped>
.cultural-tree-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-family: 'SimSun', serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.tree-chart {
  width: 100%;
  height: 80vh;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.legend {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
  font-size: 14px;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
}

.tooltip {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  pointer-events: none;
}

.tooltip h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.tooltip p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}
</style>