import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    // 路由懒加载
    component: () => import('@/views/login')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout')
  }
]

const router = new VueRouter({
  routes
})

export default router
