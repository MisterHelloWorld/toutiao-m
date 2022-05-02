<template>
  <div class="channel-edit">
    <!-- TAG：我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <!-- 编辑按钮 -->
      <van-button
        @click="isEdit = !isEdit"
        class="edit-btn"
        round
        plain
        type="danger"
        size="mini"
      >
        {{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <!-- 我的频道-对应的频道内容标签 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        v-for="(myChannel, index) in myChannels"
        :key="myChannel.id"
        class="grid-item"
        @click="onMyChannelClick(myChannel, index)"
      >
        <!-- 删除图标 -->
        <van-icon
          v-show="isEdit && fixedChannels.indexOf(myChannel.id) === -1"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- 频道内容标签的文本 -->
        <span :class="{ active: index === active }" class="text" slot="text">
          {{ myChannel.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <!-- TAG：频道推荐 -->
    <van-cell>
      <div slot="title">频道推荐</div>
    </van-cell>
    <!-- 频道推荐-对应的频道内容标签 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        v-for="recommendChannel in recommendChannels"
        :key="recommendChannel.id"
        class="grid-item"
        :text="recommendChannel.name"
        icon="plus"
        @click="onAddChannel(recommendChannel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { differenceBy } from 'lodash'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 用户频道列表数据
    myChannels: {
      type: Array,
      required: true
    },
    // 频道标签高亮索引
    active: {
      type: Number,
      required: true
    },
    // 频道编辑弹出层是否显示
    isChannelEditShow: {
      type: Boolean
    }
  },
  data () {
    return {
      // 全部频道列表数据
      allChannels: [],
      // 是否处于编辑状态
      isEdit: false,
      // 定义一个白名单，里面存放的是频道的id
      fixedChannels: [0]
    }
  },
  computed: {
    // 辅助函数映射vuex中state里的user变量（保存的是token）
    ...mapState(['user']),
    // 推荐频道列表数据（依赖于用户频道数据改变而改变，实时更新）
    recommendChannels () {
      // 利用lodash的differenceBy方法将数组去重，即全部频道-我的频道
      return differenceBy(this.allChannels, this.myChannels, 'id')
    }
  },
  watch: {},
  created () {
    // 页面初始化时获取全部频道列表数据
    this.getAllChannels()
  },
  mounted () {},
  methods: {
    // 获取全部频道列表数据
    async getAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('获取全部频道失败')
      }
    },
    // 添加频道功能
    async onAddChannel (recommendChannel) {
      // 通过子传父技术将当前要添加的频道追加到用户频道中
      this.$emit('onAddChannel', recommendChannel)
      if (this.user) {
        // 如果是登录状态
        try {
          // 发起添加频道的请求，在服务器端添加频道
          await addUserChannel({
            id: recommendChannel.id, // 当前点击的频道id
            seq: this.myChannels.length // 序号：当前用户频道列表的长度
          })
        } catch (error) {
          this.$toast('添加频道失败！')
        }
      } else {
        // 如果是未登录状态，把用户频道列表数据本地存储
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道每一项时触发
    async onMyChannelClick (myChannel, index) {
      if (this.isEdit) {
        //   如果白名单内包含当前点击的频道id，则代表有索引值，满足不等于-1的条件，不执行后续删除操作
        if (this.fixedChannels.indexOf(myChannel.id) !== -1) {
          return
        }
        // 如果当前点击的频道索引小于频道标签的高亮索引，则将频道标签的高亮索引减去 1
        if (index <= this.active) {
          this.$emit('update:active', this.active - 1)
        }
        // 当处于编辑状态时，通过子传父将当前点击的频道删除
        this.$emit('deleteChannel', index)
        // 如果是登录状态
        if (this.user) {
          try {
            // 发起删除频道的请求，在服务器端删除频道
            await deleteUserChannel(myChannel.id)
          } catch (error) {
            this.$toast('删除频道失败！')
          }
        } else {
          // 如果是未登录状态，把用户频道列表数据本地存储
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } else {
        // 当处于非编辑状态时，执行切换频道操作
        this.$emit('update:active', index)
        // 关闭频道编辑弹出层
        this.$emit('update:isChannelEditShow', false)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
