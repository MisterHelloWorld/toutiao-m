// TODO:发表文章评论组件
<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button @click="onPost" class="post-btn" :disabled="!message.length"
      >发布
    </van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',
  props: {
    // 当前文章ID或当前评论ID
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  inject: {
    articleId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      // 评论框里的内容
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击发表文章评论时触发
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })
      try {
        await addComment({
          target: this.target, // 当前文章ID或当前评论ID
          content: this.message, // 评论内容
          art_id: this.articleId // 对评论内容发表回复时，需要传递文章ID，对文章进行评论，不需要传此参数
        })
        this.$emit('postSuccess')
        this.$toast.success('发表评论成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast('用户身份失效，请重新登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        } else {
          // 其它因网络等问题造成的错误另外提示
          this.$toast.fail('发表评论失败')
        }
      }
      this.$emit('onPostSuccess')
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
