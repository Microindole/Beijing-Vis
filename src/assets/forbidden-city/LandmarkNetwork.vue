<!-- 时间轴历史关联点开后的网络图 -->
<template>
  <div ref="container" class="network-container">
    <div class="network-title">{{ landmark.name }} · 历史关联</div>
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
let graph = null;

const initGraph = () => {
  if (graph) graph.destroy();

  graph = new Graph({
    container: container.value,
    width: container.value.clientWidth,
    height: 500,
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
      size: 30,
      style: {
        fill: "#f3e9d2",
        stroke: "#8b5a2b",
        lineWidth: 2,
      },
      labelCfg: {
        style: {
          fontSize: 12,
          fill: "#5c3a21",
          fontFamily: "KaiTi, serif",
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
};

const renderData = () => {
  if (!graph) return;

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
      label: `${props.event.year}: ${props.event.event}`,
      size: 40,
      style: {
        fill: "#d9b38c",
        stroke: "#a67c52",
        lineWidth: 3,
      },
      description: props.event.description,
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

  props.landmark.relatedFigures.forEach((figure, i) => {
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

  props.landmark.relatedEvents.forEach((event, i) => {
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

  graph.data({ nodes, edges });
  graph.render();

  setTimeout(() => {
    graph.fitView(30);
    if (graph.getZoom() < 0.5) graph.zoomTo(0.5);
    if (graph.getZoom() > 2) graph.zoomTo(2);
  }, 100);
};

const setupEvents = () => {
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
  nextTick(() => {
    initGraph();
    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  if (graph) graph.destroy();
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (graph && container.value) {
    graph.changeSize(container.value.clientWidth, 500);
    setTimeout(() => {
      graph.fitView(30);
    }, 100);
  }
};

watch(
  () => props.event,
  () => {
    nextTick(() => {
      initGraph();
    });
  }
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
</style>
