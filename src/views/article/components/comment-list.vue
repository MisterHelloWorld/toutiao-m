// TODO:评论列表组件或评论回复组件
<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- TAG：评论列表项组件 -->
    <CommentItem
      :isReplyButtonShow="isReplyButtonShow"
      v-for="(comment, index) in comments"
      :key="index"
      :comment="comment"
      :LikeCount.sync="comment.like_count"
      :isLiking.sync="comment.is_liking"
      v-on="$listeners"
    ></CommentItem>
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    // 当前文章的 ID 或当前评论项的ID
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 当前文章评论数量
    commentsCount: {
      type: Number
      // required: true
    },
    type: {
      type: String,
      default: 'a',
      validator (value) {
        return ['a', 'c'].indexOf(value) !== -1
      }
    },
    isReplyButtonShow: {
      default: true
    }
  },
  data () {
    return {
      // 评论数据列表
      comments: [],
      // 上拉加载：loading 状态
      loading: false,
      // 上拉加载：是否加载结束
      finished: false,
      // 上拉加载：是否加载失败
      error: false,
      offset: null,
      limit: 10
    }
  },
  created () {
    // 手动调用触底事件，禁止自动触底
    this.loading = true
    // 初始化立即加载一次列表触底事件
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据，并解构
        const { data } = await getComments({
          type: this.type,
          source: this.source,
          offset: this.offset,
          limit: this.limit
        })
        const { results } = data.data
        this.$emit('update:commentsCount', data.data.total_count)
        // 2.将请求回来的数据（数组形式，需要使用扩展运算符一一取出）追加到数据变量中
        this.comments.push(...results)
        // 3.本次上拉加载结束后，设置本次上拉加载中loading状态为false，以保证下次触底可以正常触发
        this.loading = false
        // 4.判断数据是否加载结束
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          // 否则代表后面没有数据了，设置finished为true，不再触发上拉加载更多
          this.finished = true
        }
      } catch (error) {
        // 5.当请求发生错误，仍然需要设置本次上拉加载中loading状态为false，以保证下次触底可以再次正常触发
        this.loading = false
        // 6.开启错误提示，显示对应错误文本
        this.error = true
      }
    }
  }
}
</script>
