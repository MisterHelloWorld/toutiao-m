// TODO:搜索历史组件
<template>
  <div class="search-history">
    <!-- TAG：搜索历史导航选项 -->
    <van-cell title="搜索历史">
      <span
        v-show="isDeleteShow"
        @click="
          $emit('delAllHistories');
          isDeleteShow = false;
        "
      >
        全部删除
      </span>
      &nbsp;&nbsp;
      <span v-show="isDeleteShow" @click="isDeleteShow = false">完成</span>
      <van-icon
        v-show="!isDeleteShow"
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <!-- TAG：搜索历史记录 -->
    <van-cell
      v-for="(searchHistory, index) in searchHistories"
      :key="index"
      :title="searchHistory"
      @click="onHistoryItemClick(index, searchHistory)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // 搜索历史记录数据列表
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 删除按钮是否显示
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击历史记录的每一项时触发
    onHistoryItemClick (index, searchHistory) {
      if (this.isDeleteShow) {
        this.$emit('delHistoryItem', index)
      } else {
        // 非删除状态
        this.$emit('search', searchHistory)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
