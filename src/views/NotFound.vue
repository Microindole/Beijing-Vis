<template>
  <div class="not-found-container">
    <div class="error-content">
      <!-- 创意插图 -->
      <div class="error-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="error-icon">
          <path fill="#FF5252" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"/>
          <path fill="#FF5252" d="M296 328h-80c-13.3 0-24-10.7-24-24V160c0-13.3 10.7-24 24-24h16c13.3 0 24 10.7 24 24v120h40c13.3 0 24 10.7 24 24v16c0 13.3-10.7 24-24 24z"/>
          <circle fill="#FF5252" cx="256" cy="176" r="32"/>
        </svg>
      </div>
      
      <!-- 主要错误信息 -->
      <h1 class="error-title">404</h1>
      <h2 class="error-subtitle">哎呀，页面迷路了！</h2>
      <p class="error-message">
        您寻找的页面可能已被移除、更名或暂时不可用。
        <br>
        但别担心，我们帮您找到了回家的路。
      </p>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <router-link to="/" class="home-button">
          🏠 返回首页
        </router-link>
        <button @click="goBack" class="back-button">
          ↩️ 返回上一页
        </button>
        <a href="mailto:support@example.com" class="contact-button">
          ✉️ 联系支持
        </a>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <input type="text" placeholder="搜索您想找的内容...">
        <button>🔍 搜索</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back();
    }
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 5rem;
  color: #FF5252;
  margin: 0;
  line-height: 1;
}

.error-subtitle {
  font-size: 1.8rem;
  color: #333;
  margin: 1rem 0;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.home-button, .back-button, .contact-button {
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.home-button {
  background: #4285F4;
  color: white;
}

.back-button {
  background: #f1f1f1;
  color: #333;
}

.contact-button {
  background: #34A853;
  color: white;
}

.search-box {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
}

.search-box input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 50px 0 0 50px;
  outline: none;
}

.search-box button {
  padding: 0 1.5rem;
  background: #FF5252;
  color: white;
  border: none;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-box input,
  .search-box button {
    border-radius: 50px;
  }
  
  .search-box button {
    margin-top: 0.5rem;
  }
}
</style>