// TODO:评论列表项组件
<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <!-- 用户名 -->
      <div class="user-name">{{ comment.aut_name }}</div>
      <!-- 评论点赞按钮 -->
      <van-button
        class="like-btn"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :class="{ liked: comment.is_liking }"
        :loading="commentLoading"
        @click="onCommentLike"
      >
        <!-- 评论数量显示 -->
        {{ comment.like_count || "赞" }}
      </van-button>
    </div>

    <div slot="label">
      <!-- 评论内容 -->
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <!-- 自定义回复按钮 -->
        <van-button
          v-show="isReplyButtonShow"
          class="reply-btn"
          round
          @click="reply"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
import { mapState } from 'vuex'
export default {
  name: 'CommentItem',
  props: {
    // 当前评论项数据（单独一行）
    comment: {
      type: Object,
      required: true
    },
    // 当前评论项点赞数量
    LikeCount: {
      type: Number
      // required: true
    },
    // 当前评论项是否点赞
    isLiking: {
      type: Boolean
      // required: true
    },
    // 外部可自定义回复按钮是否显示隐藏
    isReplyButtonShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 评论点赞的loading加载状态
      commentLoading: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 对评论点赞时触发
    async onCommentLike () {
      // 每次发起评论点赞或取消评论点赞的请求前开启loading加载
      this.commentLoading = true
      try {
        // 判断是否为登录状态
        if (this.user) {
          // 判断当前是点赞按钮还是未点赞按钮
          if (this.isLiking) {
            // 如果为true，代表当前已点赞，需要取消点赞
            await deleteCommentLike(this.comment.com_id)
            // 更新点赞数量的视图
            this.$emit('update:LikeCount', this.comment.like_count - 1)
          } else {
            // 如果为其它情况，代表当前未点赞，需要点赞
            await addCommentLike(this.comment.com_id)
            // 更新点赞数量的视图
            this.$emit('update:LikeCount', this.comment.like_count + 1)
          }
        } else {
          this.$toast('您还未登录！')
          // 跳转到登录页面
          return this.$router.push('/login')
        }
        // 更新点赞状态图标的视图状态
        this.$emit('update:isLiking', !this.comment.is_liking)
      } catch (error) {
        // 如果请求400错误，代表用户点赞的是自己，提示错误
        if (error.response && error.response.status === 400) {
          this.$toast('不能给自己评论点赞喔！')
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
      this.commentLoading = false
    },
    // 点击对评论回复时触发
    reply () {
      // this.$emit('reply', this.comment)
      this.$store.commit('setComment', this.comment)
      // 打开评论回复弹出层
      this.$emit('open')
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
  .liked {
    color: #e5645f;
  }
}
</style>
