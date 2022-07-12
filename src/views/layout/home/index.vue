// TODO:首页页面
<template>
  <div class="home-container">
    <!-- TAG：搜索按钮 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- TAG：频道标签列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- TAG：频道对应的文章列表组件 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 占位元素 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧插槽：汉堡包菜单 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- TAG：频道编辑弹出层 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- TAG：频道编辑组件 -->
      <channel-edit
        @onAddChannel="onAddChannel"
        :myChannels="channels"
        :active.sync="active"
        :isChannelEditShow.sync="isChannelEditShow"
        @deleteChannel="deleteChannel"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  props: {},
  data () {
    return {
      // 用户频道列表数据
      channels: [],
      // 频道标签高亮索引
      active: 0,
      // 频道编辑弹出层是否显示
      isChannelEditShow: false,
      // 保存当前滚动条位置（内容向上滚动出去的距离）
      top: 100,
      children: {}
    }
  },
  computed: {
    // 辅助函数映射vuex中state里的user变量（保存的是token）
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.getUserChannels()
  },
  mounted () {},
  methods: {
    // 获取用户频道并保存在channels
    async getUserChannels () {
      try {
        // 无论是登录状态还是未登录状态，都发送获取用户频道请求
        const { data } = await getUserChannels()
        // 未登录状态保存的是默认固定频道，登录状态保存的是服务器端获取的最新频道（增删过的频道）
        this.channels = data.data.channels
        // 如果是未登录状态并且本地存储中有频道列表数据，从本地存储获取数据并保存
        if (!this.user && getItem('TOUTIAO_CHANNELS')) {
          this.channels = getItem('TOUTIAO_CHANNELS')
        }
      } catch (error) {
        this.$toast('获取用户频道失败！')
      }
    },
    // 添加频道时触发
    onAddChannel (recommendChannel) {
      this.channels.push(recommendChannel)
    },
    // 删除频道时触发
    deleteChannel (index) {
      this.channels.splice(index, 1)
    }
  },
  // 当跳转路由后，保存滚动条位置
  beforeRouteLeave (to, from, next) {
    const el = document.querySelectorAll('.van-tab__pane-wrapper')[this.active]
    console.log(typeof el)
    this.children = el.querySelector('.article-list')
    this.top = this.children.scrollTop
    next()
  },
  // 当重新激活该组件时，还原滚动条位置
  activated () {
    this.children.scrollTop = this.top
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  .edit-channel-popup {
    box-sizing: border-box;
  }
}
</style>
