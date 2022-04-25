import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
// 引入Vant组件库
import Vant from 'vant'
// 引入Vant全局样式
import 'vant/lib/index.css'
// 加载设置动态REM基准值
import 'amfe-flexible'
// 加载并执行dayjs文件里的代码
import '@/utils/dayjs'
// 全局注册Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
