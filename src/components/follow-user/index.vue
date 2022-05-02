// TODO:关注按钮组件
<template>
  <!-- TAG：已关注 -->
  <van-button
    v-if="isFollowed"
    round
    size="small"
    @click="onFollow"
    :loading="followLoading"
    >已关注
  </van-button>
  <!-- TAG：关注 -->
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="followLoading"
    >关注
  </van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'FollowUser',
  data () {
    return {
      // 关注加载loading的状态
      followLoading: false
    }
  },
  props: {
    // 是否关注的数据
    isFollowed: {
      type: Boolean,
      required: true
    },
    // 需要关注的作者ID
    autId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    // 保存token的user变量
    ...mapState(['user'])
  },
  methods: {
    // 点击关注按钮或者已关注按钮时触发
    async onFollow () {
      try {
        // 每次发起关注或取消关注的请求前开启loading加载
        this.followLoading = true
        // 判断是否为登录状态
        if (this.user) {
          // 判断当前是关注按钮还是已关注按钮
          if (this.isFollowed) {
            // 如果为true，代表当前已关注，需要取消关注
            await deleteFollow(this.autId)
          } else {
            // 如果为false，代表当前未关注，需要关注
            await addFollow(this.autId)
          }
        } else {
          this.$toast('您还未登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        }
        // 显示操作后的按钮状态
        this.$emit('update:isFollowed', !this.isFollowed)
      } catch (error) {
        // 如果请求400错误，代表用户关注的是自己，提示错误
        if (error.response && error.response.status === 400) {
          this.$toast('不能关注自己喔！')
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
      this.followLoading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
