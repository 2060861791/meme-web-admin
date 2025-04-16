<template>
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header height="60px">
      <div class="header-content">
        <div class="header-left">
          <img src="../assets/banner.gif" alt="" class="banner-img" />
          <h2>作品管理系统</h2>
          <img src="../assets/preview.gif" alt="" class="banner-img" />
          <div style="width: 900px; display: flex ;justify-content: space-evenly;">
            <img src="../assets/banner2.gif" alt="" class="banner-img" />
            <img src="../assets/banner3.gif" alt="" class="banner-img" />
            <img src="../assets/banner8.gif" alt="" class="banner-img" />
            <img src="../assets/banner10.gif" alt="" class="banner-img" />
          </div>
        </div>
        <el-button type="danger" size="large" @click="handleLogout">退出登录</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="220px">
        <el-menu 
          :router="true" 
          :default-active="activeMenu"
          class="side-menu"
          background-color="#f0f2f5"
          text-color="#333"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/work/list">
            <el-icon size="18px"><List /></el-icon>
            <span>作品列表</span>
          </el-menu-item>
          
          <el-menu-item index="/work/add">
            <el-icon size="18px"><Plus /></el-icon>
            <span>添加作品</span>
          </el-menu-item>

          <el-menu-item index="/manage/theme-features">
            <el-icon size="18px"><Setting /></el-icon>
            <span>主题与特点</span>
          </el-menu-item>
        </el-menu>

        <!-- 添加左下角装饰图片 -->
        <div class="aside-footer">
          <img src="../assets/banner6.gif" alt="" class="decoration-img" />
          <img src="../assets/banner9.gif" alt="" class="decoration-img" />
          <img src="../assets/banner4.gif" alt="" class="decoration-img" />
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <div class="main-content">
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/work/list' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { List, Plus, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 计算当前激活的菜单项
const activeMenu = computed(() => route.path)

// 计算当前页面标题
const currentPageTitle = computed(() => {
  switch (route.path) {
    case '/work/list':
      return '作品列表'
    case '/work/add':
      return '添加作品'
    case '/manage/theme-features':
      return '主题与特点管理'
    default:
      return ''
  }
})

// 退出登录处理
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('token')
    router.push('/login')
  })
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.banner-img {
  height: 40px;
  object-fit: contain;
}

.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}

.el-aside {
  background-color: #f0f2f5;
  height: 100%;
  position: relative;
  border-right: 1px solid #e6e6e6;
}

.side-menu {
  border-right: none;
}

.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  margin: 4px 0;
  border-radius: 4px;
  margin: 4px 6px;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f0fc !important;
  color: #409EFF !important;
}

:deep(.el-menu-item:hover) {
  background-color: #f6f6f6 !important;
  color: #409EFF !important;
}

:deep(.el-menu-item .el-icon) {
  color: #666;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #409EFF;
}

h2 {
  margin: 0;
  font-size: 22px;
  color: #fff;
  font-weight: 600;
}

.aside-footer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  text-align: center;
}

.decoration-img {
  width: 100%;
  height: auto;
  max-height: 160px;
  object-fit: contain;
}

:deep(.el-menu) {
  border-right: none;
}
</style>