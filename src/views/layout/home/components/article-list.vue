// TODO:频道对应的文章列表组件
<template>
  <div class="article-list">
    <!-- TAG：下拉刷新组件 -->
    <van-pull-refresh
      success-text="刷新成功"
      success-duration="1000"
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <!-- TAG：上拉加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- TAG：文章列表项组件 -->
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '../../../../components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    // 用户频道列表数据
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 频道对应的文章列表数据
      articles: [],
      // 上拉加载的 loading 状态
      loading: false,
      // 是否加载结束
      finished: false,
      // 请求下一页数据的时间戳
      timestamp: null,
      // 是否加载失败
      error: false,
      // 下拉刷新的 loading 状态
      isRefreshLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 上拉加载：屏幕触底时触发
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now()
        })
        // 2.将请求回来的数据追加到频道文章列表articles中
        const { results } = data.data
        this.articles.push(...results)
        // 3.设置本次加载中loading状态结束，以保证下次触底可以再次正常触发
        this.loading = false
        // 4.判断数据是否加载结束
        if (data.data.pre_timestamp) {
          // 如果pre_timestamp不为null，则代表后面还有数据，更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 否则代表后面没有数据了，设置finished为true，不再触发上拉加载更多
          this.finished = true
        }
      } catch (error) {
        // 5.当请求发生错误，仍然需要设置本次上拉加载中loading状态为false，以保证下次触底可以再次正常触发
        this.loading = false
        // 6.开启错误提示
        this.error = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now()
        })
        // 2.将请求回来的数据追加到频道文章列表articles的最前面
        const { results } = data.data
        this.articles.unshift(...results)
        // 3.关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false
      } catch (error) {
        // 4.当请求失败，仍然关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false
        // 5.当请求失败，提示错误信息
        this.$toast('刷新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: calc(100vh - 274px);
  overflow-y: auto;
}
</style>
