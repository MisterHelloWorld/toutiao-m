// TODO:搜索页面
<template>
  <div class="search-container">
    <!-- TAG：搜索栏 -->
    <form class="search-form" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="
          searchText.length === 0
            ? (showWho = 'history')
            : (showWho = 'suggestion')
        "
      />
    </form>

    <!-- TAG：搜索结果组件 -->
    <SearchResult
      :searchText="searchText"
      v-if="showWho === 'result'"
    ></SearchResult>

    <!-- TAG：联想建议组件 -->
    <SearchSuggestion
      @search="onSearch"
      :searchText="searchText"
      v-else-if="showWho === 'suggestion'"
    ></SearchSuggestion>

    <!-- TAG：搜索历史组件 -->
    <SearchHistory
      @delHistoryItem="delHistoryItem"
      @delAllHistories="delAllHistories"
      @search="onSearch"
      :searchHistories="searchHistories"
      v-else-if="showWho === 'history'"
    ></SearchHistory>
  </div>
</template>
<script>
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: { SearchResult, SearchSuggestion, SearchHistory },
  props: {},
  data () {
    return {
      // 输入框双向绑定的数据
      searchText: '',
      // 控制显示搜索结果、联想建议、历史记录的字段变量
      showWho: 'history',
      // 历史记录数据列表(本地存储有就从本地获取数据，否则设置为空数组)
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  computed: {},
  watch: {
    // 输入框内容发生变化时触发
    searchText (newValue) {
      if (newValue.length === 0) {
        // 显示搜索历史记录
        this.showWho = 'history'
      } else {
        // 显示联想建议
        this.showWho = 'suggestion'
      }
    },
    // 历史记录数据列表发生变化时触发
    searchHistories (newValue) {
      // 存储到本地存储
      setItem('TOUTIAO_SEARCH_HISTORIES', newValue)
    }
  },
  created () {},
  methods: {
    // 搜索或者回车时触发
    onSearch (val) {
      // 点击联想建议回显文本到输入框
      this.searchText = val
      // 每次把输入框里的内容添加到历史记录数据列表的最前面前，先查找有没有相同数据，保存它的索引号
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 如果存在相同数据，将该数据删除
        this.searchHistories.splice(index, 1)
      }
      // 把输入框里的内容添加到历史记录数据列表的最前面
      this.searchHistories.unshift(val)
      // 将异步任务同步到最后执行，防止与侦听器冲突，显示搜索结果
      this.$nextTick(() => {
        this.showWho = 'result'
      })
    },
    // 点击搜索框上的取消按钮触发
    onCancel () {
      this.$router.back()
    },
    // 点击历史记录当前项并删除
    delHistoryItem (index) {
      this.searchHistories.splice(index, 1)
    },
    // 删除全部历史记录
    delAllHistories () {
      // 将所有历史记录重新赋值为空数组
      this.searchHistories = []
    }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
