<template>
  <div class="user-profile">
    <!-- TAG：导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- TAG：个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center>
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      @click="isUpdateNameShow = true"
      title="昵称"
      :value="user.name"
      is-link
    />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link />
    <van-cell title="生日" :value="user.birthday" is-link />

    <!-- TAG：编辑昵称的弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- TAG：编辑昵称组件 -->
      <UpdateName
        :name.sync="user.name"
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
      ></UpdateName>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
export default {
  name: 'UserProfile',
  components: { UpdateName },
  props: {},
  data () {
    return {
      // 用户个人信息
      user: {},
      // 控制编辑昵称的弹出层显示隐藏
      isUpdateNameShow: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserProfile()
  },
  mounted () {},
  methods: {
    async getUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('获取用户个人资料失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
