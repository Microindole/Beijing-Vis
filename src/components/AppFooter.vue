<script setup>

</script>

<template>
  <footer class="portal-footer">
    <div class="portal-footer-content">
      <a href="#about">项目简介</a>
      <a href="#team">团队成员</a>
      <a href="#data">数据来源</a>
      <a href="#tech">技术栈</a>
    </div>
    <div class="copyright">
      北京地标建筑可视化挑战赛 · 课堂展示项目 · 2025
    </div>
  </footer>
</template>

<style scoped>
/* 底部区域 - Claude 浅色风格 + 炫酷特效 */
.portal-footer {
  text-align: center;
  padding: 40px 20px;
  /* Claude 风格的温暖浅色渐变 */
  background: linear-gradient(135deg, #d4c4b0 0%, #b8a88f 100%);
  color: #3d3530;
  font-size: 0.9em;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

/* 添加动态光影效果 */
.portal-footer::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  animation: shimmer 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% {
    transform: translate(-25%, -25%) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(0%, 0%) scale(1.1);
    opacity: 1;
  }
}

.portal-footer-content {
  position: relative;
  z-index: 1;
}

.portal-footer a {
  color: #3d3530;
  text-decoration: none;
  margin: 0 15px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

/* 为链接添加发光效果 */
.portal-footer a::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 8px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

/* 悬停时显示发光背景 */
.portal-footer a:hover::before {
  opacity: 1;
}

/* 为链接添加渐变下划线动效 */
.portal-footer a::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: -4px;
  left: 0;
  background: linear-gradient(90deg, #8b7355, #d4c4b0, #8b7355);
  background-size: 200% 100%;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.portal-footer a:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.portal-footer a:hover {
  color: #2d2520;
  transform: translateY(-2px);
}

.portal-footer .copyright {
  margin-top: 20px;
  opacity: 0.5;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}
</style>