<template>
  <div ref="container" class="network-container">
    <div class="network-title">{{ landmark.name }} · 历史关联 ({{ event.year }})</div>
    <div v-if="loading" class="loading-message">加载中...</div>

    <!-- 自定义信息弹窗 -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ modalData.title }}</h3>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-body">
            <p>{{ modalData.description }}</p>
          </div>
        </div>
      </div>
    </transition>
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
const showModal = ref(false);
const modalData = ref({ title: '', description: '' });
let graph = null;

const closeModal = () => {
  showModal.value = false;
};

const openModal = (title, description) => {
  modalData.value = { title, description };
  showModal.value = true;
};

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
      fitView: true,
      fitViewPadding: [60, 20, 20, 20],
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
        nodeStrength: -800,
        edgeStrength: 0.2,
        linkDistance: 150,
        nodeSpacing: 60,
      },
      defaultNode: {
        size: 35,
        style: {
          fill: "#f3e9d2",
          stroke: "#8b5a2b",
          lineWidth: 2,
          shadowColor: "rgba(139, 90, 43, 0.2)",
          shadowBlur: 8,
          cursor: "pointer",
        },
        labelCfg: {
          position: "bottom",
          offset: 8,
          style: {
            fontSize: 12,
            fill: "#5c3a21",
            fontFamily: "KaiTi, STKaiti, serif",
            fontWeight: 500,
            background: {
              fill: "rgba(245, 240, 230, 0.85)",
              padding: [4, 8],
              radius: 4,
            },
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: "#d9c7a7",
          lineWidth: 2,
          opacity: 0.6,
          endArrow: {
            path: "M 0,0 L 8,4 L 8,-4 Z",
            fill: "#d9c7a7",
          },
        },
      },
      nodeStateStyles: {
        hover: {
          fill: "#ffd89b",
          stroke: "#d4a574",
          lineWidth: 3,
          shadowBlur: 15,
          shadowColor: "rgba(212, 165, 116, 0.5)",
          cursor: "pointer",
        },
        selected: {
          fill: "#e6c88c",
          stroke: "#a67c52",
          lineWidth: 4,
        },
      },
      edgeStateStyles: {
        hover: {
          stroke: "#c9a96a",
          lineWidth: 3,
          opacity: 1,
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
      size: 60,
      style: {
        fill: "#e6c88c",
        stroke: "#8b5a2b",
        lineWidth: 3,
        shadowColor: "rgba(139, 90, 43, 0.3)",
        shadowBlur: 12,
        cursor: "pointer",
      },
      labelCfg: {
        position: "center",
        style: {
          fontSize: 15,
          fontWeight: "bold",
          fill: "#5c3a21",
          background: {
            fill: "rgba(255, 255, 255, 0)",
            padding: 0,
          },
        },
      },
    },
    {
      id: "event",
      label: `${currentEvent.year}\n${currentEvent.event}`,
      size: 48,
      style: {
        fill: "#d9b38c",
        stroke: "#a67c52",
        lineWidth: 3,
        shadowColor: "rgba(166, 124, 82, 0.25)",
        shadowBlur: 10,
        cursor: "pointer",
      },
      description: currentEvent.description,
      labelCfg: {
        position: "bottom",
        offset: 10,
        style: {
          fontSize: 13,
          fontWeight: "bold",
          background: {
            fill: "rgba(245, 240, 230, 0.9)",
            padding: [5, 10],
            radius: 4,
          },
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
        lineWidth: 3.5,
        opacity: 0.8,
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
          cursor: "pointer",
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
          cursor: "pointer",
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

  graph.on("node:mouseenter", (evt) => {
    const item = evt.item;
    graph.setItemState(item, "hover", true);
    graph.updateItem(item, {
      labelCfg: {
        style: {
          fontWeight: "bold",
        },
      },
    });
  });

  graph.on("node:mouseleave", (evt) => {
    const item = evt.item;
    graph.setItemState(item, "hover", false);
  });

  graph.on("edge:mouseenter", (evt) => {
    const item = evt.item;
    graph.setItemState(item, "hover", true);
  });

  graph.on("edge:mouseleave", (evt) => {
    const item = evt.item;
    graph.setItemState(item, "hover", false);
  });

  graph.on("node:click", (evt) => {
    const model = evt.item.getModel();
    if (model.description) {
      openModal(model.label, model.description);
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
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f0e6 0%, #faf7f0 100%);
  background-image:
      repeating-linear-gradient(
          45deg,
          transparent,
          transparent 35px,
          rgba(217, 199, 167, 0.05) 35px,
          rgba(217, 199, 167, 0.05) 70px
      ),
      repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 35px,
          rgba(217, 199, 167, 0.05) 35px,
          rgba(217, 199, 167, 0.05) 70px
      );
  border: 2px solid #d9c7a7;
  box-shadow:
      0 8px 24px rgba(139, 90, 43, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.network-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 50% 50%,
      transparent 0%,
      rgba(245, 240, 230, 0.3) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.network-title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #5c3a21;
  font-family: "STKaiti", "KaiTi", "SimSun", serif;
  z-index: 10;
  background: linear-gradient(
      180deg,
      rgba(245, 240, 230, 0.95) 0%,
      rgba(245, 240, 230, 0.85) 80%,
      transparent 100%
  );
  padding: 12px 20px 16px;
  border-bottom: 2px solid #d9c7a7;
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.1);
  letter-spacing: 1px;
}

.network-title::before {
  content: "◆";
  margin-right: 8px;
  color: #a67c52;
  font-size: 14px;
}

.network-title::after {
  content: "◆";
  margin-left: 8px;
  color: #a67c52;
  font-size: 14px;
}

.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #ffffff 0%, #f5f0e6 100%);
  padding: 16px 32px;
  border-radius: 8px;
  color: #5c3a21;
  font-family: "STKaiti", "KaiTi", "SimSun", serif;
  font-size: 15px;
  box-shadow: 0 4px 16px rgba(139, 90, 43, 0.2);
  border: 2px solid #d9c7a7;
  z-index: 20;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.02);
  }
}

/* 自定义弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(92, 58, 33, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #faf7f0 0%, #f5f0e6 100%);
  border-radius: 16px;
  border: 3px solid #d9c7a7;
  box-shadow:
      0 16px 48px rgba(139, 90, 43, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #e6c88c 0%, #d4a574 100%);
  padding: 20px 24px;
  border-bottom: 2px solid #d9c7a7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.modal-header::before {
  content: "◆";
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b5a2b;
  font-size: 12px;
  opacity: 0.6;
}

.modal-header h3 {
  margin: 0;
  color: #5c3a21;
  font-size: 20px;
  font-weight: bold;
  font-family: "STKaiti", "KaiTi", "SimSun", serif;
  padding-left: 20px;
  letter-spacing: 1px;
}

.modal-close {
  background: rgba(139, 90, 43, 0.1);
  border: 2px solid #a67c52;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5c3a21;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(139, 90, 43, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 28px 32px;
  background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 24px,
      rgba(217, 199, 167, 0.1) 24px,
      rgba(217, 199, 167, 0.1) 25px
  );
}

.modal-body p {
  margin: 0;
  color: #5c3a21;
  font-size: 15px;
  line-height: 1.8;
  font-family: "STKaiti", "KaiTi", "SimSun", serif;
  text-align: justify;
}

/* 过渡动画 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

.modal-leave-active .modal-content {
  animation: modalSlideOut 0.3s ease-in;
}

@keyframes modalSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
}
</style>