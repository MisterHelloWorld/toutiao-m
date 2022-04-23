import axios from 'axios'
// 前提：配置请求头，需要访问 Vuex 容器，又因为是在js文件中访问 store，因此需要引入以下代码
import store from '@/store'
const request = axios.create({
  baseURL: 'http://localhost:8000'
})

// 利用请求拦截器（请求发送之前做某些事情），配置请求头（主要处理token问题），配置完后，在向服务器发送请求时，可以携带一些参数（token）
request.interceptors.request.use(
  function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // 当请求拦截器发生处理错误，终止执行，该请求的后续操作同时也会终止
    return Promise.reject(error)
  }
)
export default request
