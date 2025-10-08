<template>
  <div ref="container" class="network-container">
    <div class="network-title">{{ landmark.name }} · 历史关联 ({{ event.year }})</div>
    <div v-if="loading" class="loading-message">加载中...</div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted, nextTick } from "vue";
import { Graph } from "@antv/g6";

const props = defineProps({
  landmark: Object,
  event: Object,
});

const container = ref(null);
const loading = ref(false);
let graph = null;

const initGraph = () => {
  if (!container.value) {
    console.error("容器未找到");
    return;
  }

  if (graph) graph.destroy();

  loading.value = true;
  
  try {
    const width = container.value.clientWidth;
    const height = 500;
    
    console.log(`初始化图表，宽度: ${width}px, 高度: ${height}px`);

    graph = new Graph({
      container: container.value,
      width: width,
      height: height,
      modes: {
        default: [
          {
            type: "drag-canvas",
            enableOptimize: true,
          },
          {
            type: "zoom-canvas",
            sensitivity: 1.5,
            minZoom: 0.5,
            maxZoom: 2,
          },
        ],
      },
      layout: {
        type: "force",
        preventOverlap: true,
        nodeStrength: -500,
        edgeStrength: 0.1,
      },
      defaultNode: {
        size: 30, // 节点尺寸可以保持小巧
        style: {
          fill: "#f3e9d2",
          stroke: "#8b5a2b",
          lineWidth: 2,
        },
        labelCfg: {

          position: 'bottom',
          offset: 5,
          style: {
            fontSize: 12,
            fill: "#5c3a21",
            fontFamily: "sans-serif",
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: "#d9c7a7",
          lineWidth: 2,
          opacity: 0.8,
        },
      },
    });

    console.log("图表实例创建完成");

    const rawZoom = graph.zoom.bind(graph);
    const rawZoomTo =
      graph.zoomTo?.bind(graph) ||
      ((ratio) => {
        graph.get("viewController").zoomTo(ratio);
      });

    const safeZoom = (ratio) => {
      const currentZoom = graph.getZoom();
      const newZoom = currentZoom * ratio;

      if (newZoom < 0.5) {
        rawZoomTo(0.5);
      } else if (newZoom > 2) {
        rawZoomTo(2);
      } else {
        rawZoom(ratio);
      }
    };

    graph.zoom = safeZoom;
    graph.zoomTo = (ratio) => {
      ratio = Math.max(0.5, Math.min(2, ratio));
      rawZoomTo(ratio);
    };

    renderData();
    setupEvents();
  } catch (error) {
    console.error("初始化图表失败:", error);
  } finally {
    loading.value = false;
  }
};

const renderData = () => {
  if (!graph) {
    console.error("图表实例未创建");
    return;
  }

  // 使用当前事件中的特定相关人物和事件
  const currentEvent = props.event;
  
  console.log("渲染数据:", currentEvent);

  const nodes = [
    {
      id: "landmark",
      label: props.landmark.name,
      size: 50,
      style: {
        fill: "#e6c88c",
        stroke: "#8b5a2b",
        lineWidth: 3,
      },
      labelCfg: {
        style: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
    },
    {
      id: "event",
      label: `${currentEvent.year}: ${currentEvent.event}`,
      size: 40,
      style: {
        fill: "#d9b38c",
        stroke: "#a67c52",
        lineWidth: 3,
      },
      description: currentEvent.description,
      labelCfg: {
        style: {
          fontSize: 13,
        },
      },
    },
  ];

  const edges = [
    {
      source: "landmark",
      target: "event",
      style: {
        stroke: "#a67c52",
        lineWidth: 3,
      },
    },
  ];

  // 使用当前时间点的特定相关人物
  if (currentEvent.relatedFigures && currentEvent.relatedFigures.length > 0) {
    console.log("添加相关人物:", currentEvent.relatedFigures);
    currentEvent.relatedFigures.forEach((figure, i) => {
      nodes.push({
        id: `figure-${i}`,
        label: figure,
        style: {
          fill: "#d9a79c",
          stroke: "#8b5a2b",
        },
      });
      edges.push({
        source: "event",
        target: `figure-${i}`,
        style: {
          stroke: "#d9a79c",
        },
      });
    });
  } else {
    console.log("没有相关人物数据");
  }

  // 使用当前时间点的特定相关事件
  if (currentEvent.relatedEvents && currentEvent.relatedEvents.length > 0) {
    console.log("添加相关事件:", currentEvent.relatedEvents);
    currentEvent.relatedEvents.forEach((event, i) => {
      nodes.push({
        id: `related-${i}`,
        label: event,
        style: {
          fill: "#b8c7a8",
          stroke: "#5c3a21",
        },
      });
      edges.push({
        source: "event",
        target: `related-${i}`,
        style: {
          stroke: "#b8c7a8",
        },
      });
    });
  } else {
    console.log("没有相关事件数据");
  }

  console.log("最终节点数据:", nodes);
  console.log("最终边数据:", edges);

  graph.data({ nodes, edges });
  graph.render();

  setTimeout(() => {
    graph.fitView(30);
    if (graph.getZoom() < 0.5) graph.zoomTo(0.5);
    if (graph.getZoom() > 2) graph.zoomTo(2);
  }, 100);
};

const setupEvents = () => {
  if (!graph) return;

  graph.on("node:click", (evt) => {
    const model = evt.item.getModel();
    if (model.description) {
      alert(`${model.label}\n\n${model.description}`);
    }
  });

  graph.on("canvas:click", (e) => {
    e.preventDefault();
  });
};

onMounted(() => {
  console.log("组件挂载");
  nextTick(() => {
    console.log("DOM更新完成");
    initGraph();
    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  console.log("组件卸载");
  if (graph) graph.destroy();
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (graph && container.value) {
    console.log("处理窗口大小变化");
    graph.changeSize(container.value.clientWidth, 500);
    setTimeout(() => {
      graph.fitView(30);
    }, 100);
  }
};

watch(
  () => props.event,
  () => {
    console.log("事件属性变化");
    nextTick(() => {
      initGraph();
    });
  },
  { deep: true }
);
</script>

<style scoped>
.network-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f5f0e6" opacity="0.8"/><path d="M0,0 L100,100 M0,100 L100,0" stroke="%23d9c7a7" stroke-width="1" opacity="0.3"/></svg>');
  border: 1px solid #d9c7a7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.network-title {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #5c3a21;
  font-family: "SimSun", serif;
  z-index: 10;
  background: rgba(245, 240, 230, 0.7);
  padding: 5px 0;
  border-bottom: 1px solid #d9c7a7;
}

.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 4px;
  color: #5c3a21;
  font-family: "SimSun", serif;
}
</style>