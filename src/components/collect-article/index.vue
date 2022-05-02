<template>
  <van-button :loading="collectLoading" @click="onCollect">
    <van-icon
      slot="icon"
      color="#777"
      :name="isCollected ? 'star' : 'star-o'"
      :style="{ color: isCollected ? 'orange' : '' }"
    />
  </van-button>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'CollectArticle',
  props: {
    // 是否收藏的数据
    isCollected: {
      type: Boolean,
      required: true
    },
    // 需要收藏的文章ID
    artId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      // 收藏加载loading的状态
      collectLoading: false
    }
  },
  computed: {
    // 保存token的user变量
    ...mapState(['user'])
  },
  methods: {
    // 点击收藏按钮时触发
    async onCollect () {
      try {
        // 每次发起收藏或取消收藏文章的请求前开启loading加载
        this.collectLoading = true
        // 判断是否为登录状态
        if (this.user) {
          // 判断当前是收藏按钮还是已收藏按钮
          if (this.isCollected) {
            // 如果为true，代表当前已收藏，需要取消收藏
            await deleteCollect(this.artId)
            this.$toast.success('取消收藏成功')
          } else {
            // 如果为false，代表当前未收藏，需要收藏
            await addCollect(this.artId)
            this.$toast.success('收藏成功')
          }
        } else {
          this.$toast('您还未登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        }
        // 显示操作后的按钮状态
        this.$emit('update:isCollected', !this.isCollected)
      } catch (error) {
        // 如果请求400错误，代表用户关注的是自己，提示错误
        if (error.response && error.response.status === 400) {
          this.$toast('不能收藏自己的文章！')
        } else if (error.response && error.response.status === 401) {
          this.$toast('用户身份失效，请重新登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        } else {
          // 其它因网络等问题造成的错误另外提示
          this.$toast.fail('操作失败，请稍后重试！')
        }
      }
      // 无论成功还是失败，都要关闭loading加载
      this.collectLoading = false
    }
  },
  created () {}
}
</script>

<style lang="less" scoped></style>
