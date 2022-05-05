import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)
// 声明一个常量（字母全大写），用于保存本地存储token的key值
const TOUTIAO_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 保存用户的token值（该值是持久化的）
    user: getItem(TOUTIAO_KEY),
    // 当前评论项（单独一项）点击回复时保存的评论项数据
    comment: null
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      state.user = payload
      setItem(TOUTIAO_KEY, state.user)
    },
    setComment (state, payload) {
      state.comment = payload
    },
    addCommentReplyCount (state) {
      state.comment.reply_count++
    }
  },
  actions: {},
  modules: {}
})
