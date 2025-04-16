import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'
import Login from '../views/Login.vue'
import WorkAdd from '../views/WorkAdd.vue'
import WorkList from '../views/WorkList.vue'
import ThemeAndFeatures from '../components/ThemeAndFeatures.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/work/list',
    children: [
      {
        path: 'work/list',
        name: 'WorkList',
        component: WorkList
      },
      {
        path: 'work/add',
        name: 'WorkAdd',
        component: WorkAdd
      },
      {
        path: 'manage/theme-features',
        name: 'ThemeAndFeatures',
        component: ThemeAndFeatures
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router 