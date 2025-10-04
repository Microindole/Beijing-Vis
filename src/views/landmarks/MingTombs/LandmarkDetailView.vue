<template>
  <div class="detail-view-container">
    <div class="graph-container">
      <button @click="goBack" class="back-button">← 返回</button>
      <div class="graph-wrapper">
        <NetworkGraph
          v-if="graphData.nodes.length"
          :nodes="graphData.nodes"
          :links="graphData.links"
          :categories="categories"
          @node-click="handleNodeClick"
        />
        <div v-else class="loading">正在加载数据...</div>
      </div>
      <div class="timeline-chart">
        <h3>历史时间轴</h3>
        <div class="chart-placeholder"></div>
      </div>
    </div>
    <div class="panel-container">
      <div class="panel-wrapper">
        <NarrativePanel :node="selectedNode" />
      </div>
      <div class="additional-panels">
        <div class="statistics-panel">
          <h3>关联数据统计</h3>
          <div class="chart-placeholder pie-chart"></div>
        </div>
        <div class="related-panel">
          <h3>相关历史人物</h3>
          <div class="chart-placeholder bar-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkGraph from "../../../components/dashilan/NetworkGraph.vue";
import NarrativePanel from "./NarrativePanel.vue";
import {
  landmarkGraphData,
  categories,
} from "../../../components/data/landmarkData.js";

export default {
  name: "LandmarkDetailView",
  props: {
    landmarkId: {
      type: String,
      required: true,
    },
  },
  components: {
    NetworkGraph,
    NarrativePanel,
  },
  data() {
    return {
      landmarkId: null,
      graphData: { nodes: [], links: [] },
      categories: categories,
      selectedNode: null,
    };
  },
  created() {
    this.landmarkId = this.$route.query.landmarkId;
    this.loadData();
  },
  methods: {
    loadData() {
      if (landmarkGraphData[this.landmarkId]) {
        this.graphData = landmarkGraphData[this.landmarkId];
        this.selectedNode = this.graphData.nodes.find(
          (n) => n.category === "核心地标"
        );
      } else {
        console.error(`No data found for landmarkId: ${this.landmarkId}`);
      }
    },
    handleNodeClick(nodeData) {
      this.selectedNode = nodeData;
    },
    goBack() {
      if (this.landmarkId === "dashilar") {
        this.$router.push({ name: "dashilar" });
      } else if (this.landmarkId === "mingTombs") {
        this.$router.push({ name: "ming-tombs" });
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.detail-view-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f0e6d2;
  font-family: "SimSun", "宋体", serif;
}

.graph-container {
  flex: 3;
  position: relative;
  background: linear-gradient(to right, #f5f2e9, #e8d8c0);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d4b483;
}

.graph-wrapper {
  flex: 1;
  position: relative;
  padding: 20px;
}

.panel-container {
  flex: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to right, #e8d8c0, #e0c9a6);
}

.panel-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.additional-panels {
  display: flex;
  height: 40%;
  border-top: 1px solid #d4b483;
}

.statistics-panel, .related-panel {
  flex: 1;
  padding: 15px;
  border-right: 1px solid #d4b483;
}

.related-panel {
  border-right: none;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5em;
  color: #8b5a2b;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(139, 69, 19, 0.8);
  color: #fff8e1;
  border: 1px solid #5d4037;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(121, 85, 72, 0.9);
  transform: translateY(-2px);
}

.timeline-chart {
  height: 25%;
  padding: 15px;
  background-color: rgba(255, 253, 245, 0.7);
  border-top: 1px solid #d4b483;
}

h3 {
  color: #5d4037;
  margin-bottom: 10px;
  font-weight: normal;
  border-bottom: 1px dashed #8d6e63;
  padding-bottom: 5px;
}

.chart-placeholder {
  height: calc(100% - 30px);
  background-color: rgba(255, 253, 245, 0.5);
  border: 1px dashed #8d6e63;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8d6e63;
  position: relative;
}

.chart-placeholder:after {
  content: "图表区域";
  position: absolute;
}

.pie-chart:after {
  content: "饼图区域";
}

.bar-chart:after {
  content: "柱状图区域";
}

@media (max-width: 1200px) {
  .detail-view-container {
    flex-direction: column;
  }
  
  .graph-container, .panel-container {
    flex: none;
    height: 50%;
  }
  
  .additional-panels {
    height: 30%;
  }
}
</style>