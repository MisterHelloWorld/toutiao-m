import axios from 'axios'
// 前提：配置请求头，需要访问 Vuex 容器，又因为是在js文件中访问 store，因此需要引入以下代码
import store from '@/store'
import jsonBig from 'json-bigint'
const request = axios.create({
  // mock 假数据
  // baseURL: 'https://mock.mengxuegu.com/mock/626bec351e3d7470073a2458/tb'
  baseURL: 'http://toutiao.itheima.net',
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据(后端返回的数据)
  transformResponse: [
    function (data) {
      // 对 data 进行任意转换处理
      try {
        return jsonBig.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
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
