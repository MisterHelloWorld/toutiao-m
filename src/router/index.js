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
  // 搜索页面
  {
    path: '/search',
    name: 'Search',
    // 路由懒加载
    component: () => import('@/views/search')
  },
  // 文章详情页面
  {
    path: '/article/:articleId',
    name: 'Article',
    // 路由懒加载
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的props中
    props: true
  },
  {
    path: '/user/profile',
    name: 'Userprofile',
    component: () => import('@/views/user-profile')
  },
  // 布局页面
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/layout/home')
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('@/views/layout/my')
      }
      // NOTES:简单功能，暂不实现
      // {
      //   path: '/qa',
      //   name: 'Qa',
      //   component: () => import('@/views/layout/qa')
      // },
      // {
      //   path: '/video',
      //   name: 'Video',
      //   component: () => import('@/views/layout/video')
      // }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
