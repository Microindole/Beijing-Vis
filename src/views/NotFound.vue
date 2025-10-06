<template>
  <div class="not-found-container">
    <div class="error-content">

      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="error-icon">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h6a.75.75 0 000-1.5H12.75V6z" clip-rule="evenodd" />
        </svg>
      </div>

      <h1 class="error-code">404</h1>
      <h2 class="error-title">此地尚未载入史册</h2>
      <p class="error-message">
        您所探寻的页面似乎位于历史的迷雾之中，请检查访问路径或返回首页重新探寻。
      </p>

      <div class="action-buttons">
        <router-link to="/" class="control-button primary">
          返回首页
        </router-link>
        <button @click="goBack" class="control-button primary">
          返回上一页
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
/* 定义主题色 */
:root {
  /* 1. 更新背景色为您指定的颜色 */
  --theme-bg: #F6F3ED;
  --theme-primary: #bd6b20;
  --theme-primary-dark: #8b4513;
  --theme-accent: #d4a76a;
  --theme-text-dark: #4a4a4a;
  --theme-text-light: #7a6b64;
}

.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  /* 2. 应用新的背景色 */
  background-color: var(--theme-bg);
  color: var(--theme-text-dark);
  font-family: 'conlas', 'conlas', cursive;
  padding: 2rem;
  box-sizing: border-box;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
}

.icon-wrapper {
  /* 调整空间占比 */
  margin-bottom: 2.5rem; /* 增加图标下方间距 */
}

.error-icon {
  /* 调整空间占比 */
  width: 72px; /* 增大图标尺寸 */
  height: 72px;
  color: var(--theme-primary-dark);
  opacity: 0.9;
}

.error-code {
  /* 调整空间占比 */
  font-size: 8rem; /* 大幅增加 "404" 的字号 */
  font-weight: 600;
  line-height: 1;
  margin: 0;
  color: var(--theme-primary);
  text-shadow: 2px 2px 5px rgba(189, 107, 32, 0.1);
}

.error-title {
  /* 调整空间占比 */
  font-size: 2rem; /* 增大副标题字号 */
  margin-top: 1.5rem; /* 增加与 "404" 的间距 */
  font-weight: 600;
  color: var(--theme-primary-dark);
}

.error-message {
  /* 调整空间占比 */
  font-size: 1.1rem; /* 增大描述文字字号 */
  color: var(--theme-text-light);
  line-height: 1.8;
  margin: 1.5rem 0 3rem 0; /* 增大上下间距 */
  max-width: 420px;
}

.action-buttons {
  display: flex;
  gap: 1.2rem; /* 增大按钮间距 */
}

.control-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px; /* 增大按钮尺寸 */
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.control-button.primary {
  background: linear-gradient(135deg, var(--theme-primary) 0%, #d4812f 100%);
  color: var(--theme-primary-dark);
  border: 1px solid rgba(189, 107, 32, 0.3);
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}
.control-button.primary:hover {
  color: #fff;
  box-shadow: 0 6px 18px rgba(189, 107, 32, 0.4);
}

.control-button.secondary {
  background: linear-gradient(135deg, #fff 0%, #faf8f5 100%);
  color: var(--theme-primary-dark);
  border: 1.5px solid var(--theme-accent);
}
.control-button.secondary:hover {
  border-color: var(--theme-primary);
  box-shadow: 0 6px 18px rgba(212, 167, 106, 0.35);
}


@media (max-width: 600px) {
  .error-code { font-size: 6rem; }
  .error-title { font-size: 1.5rem; }
  .action-buttons { flex-direction: column; width: 80%; gap: 0.8rem; }
  .control-button { width: 100%; }
}
</style>