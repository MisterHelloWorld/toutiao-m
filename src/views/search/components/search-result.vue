// TODO:搜索结果组件
<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="SearchResult in SearchResults"
        :key="SearchResult.art_id"
        :title="SearchResult.title"
        :to="{ name: 'Article', params: { articleId: SearchResult.art_id } }"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    // 搜索框输入的内容
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 搜索结果数据列表
      SearchResults: [],
      // 上拉加载状态
      loading: false,
      // 上拉加载的数据是否全部加载完成
      finished: false,
      // 页码值
      page: 1,
      // 每页数据大小
      perPage: 20,
      // 是否显示上拉加载的错误提示
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 输入框里面没有内容时，提示为空
      if (this.searchText === '') {
        this.$toast('搜索输入为空')
        this.finished = true
        return (this.SearchResults = [])
      }
      try {
        // if (Math.random() > 0.7) {
        //   JSON.parse('随机模拟请求失败')
        // }
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键词
        })
        const { results } = data.data
        this.SearchResults.push(...results)
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-result {
  height: 100vh;
  overflow-y: auto;
}
</style>
