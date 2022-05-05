// TODO:评论回复内容组件（点击回复按钮的弹出层里面）
<template>
  <div class="comment-reply">
    <!-- 回复数量 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <!-- 关闭按钮 -->
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <!-- TAG：当前评论项（复用：评论列表项组件） -->
    <CommentItem :isReplyButtonShow="false" :comment="comment"></CommentItem>
    <van-cell title="全部回复"></van-cell>

    <!-- TAG：当前评论项的评论回复列表（复用：评论列表组件） -->
    <CommentList
      :isReplyButtonShow="false"
      type="c"
      :source="comment.com_id"
      :key="data"
    ></CommentList>

    <!-- TAG：写评论 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- TAG：评论回复弹出层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <!-- TAG：对评论发表回复（复用：发表文章评论组件） -->
      <CommentPost
        @onPostSuccess="onPostSuccess"
        :target="comment.com_id"
      ></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  components: { CommentItem, CommentList, CommentPost },
  props: {},
  data () {
    return {
      isPostShow: false,
      data: +new Date()
    }
  },
  computed: {
    // 映射vuex中保存的评论项数据
    ...mapState(['comment'])
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 对评论回复，发表评论时触发
    onPostSuccess () {
      this.isPostShow = false
      this.data = +new Date()
      this.$store.commit('addCommentReplyCount')
    }
  }
}
</script>
<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
