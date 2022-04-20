import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)
// 声明一个常量（字母全大写），用于保存本地存储token的key值
const TOUTIAO_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    user: getItem(TOUTIAO_KEY)
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      state.user = payload
      setItem(TOUTIAO_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
