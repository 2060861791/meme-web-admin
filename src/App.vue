<template>
  <router-view></router-view>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

/* 添加背景图 */
body {
  background-image: url('./assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* 为内容区域添加半透明遮罩，确保可读性 */
.el-main, .el-card {
  background-color: rgba(255, 255, 255, 0.9);
}

/* 添加登录页面特殊样式 */
.login-container {
  background-color: transparent !important;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Element Plus 全局样式覆盖 */
.el-card {
  --el-card-padding: 15px;
}

.el-main {
  --el-main-padding: 15px;
}
</style>
