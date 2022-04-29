// TODO:搜索建议组件
<template>
  <div class="search-suggestion">
    <!-- TAG：搜索联想建议的盒子 -->
    <div v-if="isSuggestionShow">
      <van-cell
        v-for="(suggestion, index) in suggestions"
        :key="index"
        icon="search"
      >
        <div
          @click="$emit('search', suggestion)"
          slot="title"
          v-html="highlight(suggestion)"
        ></div>
      </van-cell>
    </div>

    <!-- TAG：无搜索建议的提示 -->
    <van-cell
      class="suggestionMessage"
      v-else
      title="没有可提供的搜索建议"
    ></van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 从lodash引入防抖函数
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
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
      // 联想建议数据列表
      suggestions: [],
      // 联想建议的盒子是否显示
      isSuggestionShow: true
    }
  },
  computed: {},
  watch: {
    // 输入框内容变化时触发
    searchText: {
      // newValue是拿到的输入框的内容
      handler: debounce(function (newValue) {
        // 输入框内容发生变化时，根据输入内容获取联想建议的数据并保存
        this.getSearchSuggestions(newValue)
      }, 1000),
      // 开启立即执行（由于该组件是通过v-if创建出来的，因此需要在刚创建时就立刻执行一次）
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 获取联想建议数据并保存的方法
    async getSearchSuggestions (keywords) {
      // 该方法每次调用前，都会将联想建议的盒子设置为显示状态
      this.isSuggestionShow = true
      try {
        // 发起获取联想建议的请求
        const { data } = await getSearchSuggestions(keywords)
        // 如果获取到的数据长度为0或者第一项为null，将联想建议的盒子设置为要隐藏状态，显示无搜索建议的提示
        if (data.data.options.length === 0 || data.data.options[0] === null) {
          // 此处return终止后续代码执行
          return (this.isSuggestionShow = false)
        }
        // 将获取到的联想建议数据，保存在suggestions变量中
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取联想建议失败！')
      }
    },
    // 由于v-html不能使用过滤器，因此定义一个显示关键词高亮的方法，传入参数为联想建议
    highlight (suggestion) {
      // 定义一个高亮内容字符串
      const highlightStr = `<span style="color:red;">${this.searchText}</span>`
      // 定义一个正则替换的表达式，将输入框里的内容作为被替换的内容
      const reg = new RegExp(this.searchText, 'gi')
      // 将联想建议替换成想要显示的高亮内容，并返回最终可以显示关键词高亮的内容
      return suggestion.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.suggestionMessage {
  color: red;
}
</style>
