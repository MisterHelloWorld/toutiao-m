<template>
  <van-button @click="onGoodJob" :loading="goodJobLoading">
    <van-icon
      slot="icon"
      color="#777"
      :name="attitude === 1 ? 'good-job' : 'good-job-o'"
    />
  </van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'LikeArticle',
  props: {
    // 当前文章点赞的状态
    attitude: {
      type: Number,
      required: true
    },
    // 需要点赞的文章ID
    artId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      // 点赞加载loading的状态
      goodJobLoading: false
    }
  },
  computed: {
    // 保存token的变量
    ...mapState(['user'])
  },
  methods: {
    // 点击点赞按钮时触发
    async onGoodJob () {
      try {
        // 每次发起点赞或取消点赞的请求前开启loading加载
        this.goodJobLoading = true
        // 判断是否为登录状态
        if (this.user) {
          // 判断当前是点赞按钮还是未点赞按钮
          if (this.attitude === 1) {
            // 如果为1，代表当前已点赞，需要取消点赞
            await deleteLike(this.artId)
            // 改变视图
            this.$emit('update:attitude', 0)
          } else {
            // 如果为其它情况，代表当前未点赞，需要点赞
            await addLike(this.artId)
            // 改变视图
            this.$emit('update:attitude', 1)
          }
        } else {
          this.$toast('您还未登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        }
      } catch (error) {
        // 如果请求400错误，代表用户点赞的是自己，提示错误
        if (error.response && error.response.status === 400) {
          this.$toast('不能给自己点赞喔！')
        } else if (error.response && error.response.status === 401) {
          this.$toast('用户身份失效，请重新登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        } else {
          // 其它因网络等问题造成的错误另外提示
          this.$toast('未知错误，请稍后重试！')
        }
      }
      // 无论成功还是失败，都要关闭loading加载
      this.goodJobLoading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
