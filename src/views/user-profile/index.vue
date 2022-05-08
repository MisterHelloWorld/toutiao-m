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
    <van-cell
      @click="$refs.file.click()"
      class="avatar-cell"
      title="头像"
      is-link
      center
    >
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      @click="isUpdateNameShow = true"
      title="昵称"
      :value="user.name"
      is-link
    />
    <van-cell
      @click="isUpdateGenderShow = true"
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
    />
    <van-cell
      @click="isUpdateBirthdayShow = true"
      title="生日"
      :value="user.birthday"
      is-link
    />

    <!-- TAG：头像上传 -->
    <input @change="onFileChange" ref="file" type="file" hidden />

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

    <!-- TAG：修改性别的弹出层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <!-- TAG：修改性别组件 -->
      <UpdateGender
        :gender.sync="user.gender"
        @close="isUpdateGenderShow = false"
        v-if="isUpdateGenderShow"
      ></UpdateGender>
    </van-popup>

    <!-- TAG：编辑生日的弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <!-- TAG：编辑生日组件 -->
      <UpdateBirthday
        :birthday.sync="user.birthday"
        @close="isUpdateBirthdayShow = false"
        v-if="isUpdateBirthdayShow"
      ></UpdateBirthday>
    </van-popup>

    <!-- TAG：编辑头像的弹出层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- TAG：编辑头像组件 -->
      <UpdatePhoto
        @close="isUpdatePhotoShow = false"
        v-if="isUpdatePhotoShow"
        :userPhoto.sync="user.photo"
        :img="img"
      ></UpdatePhoto>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data () {
    return {
      // 用户个人信息
      user: {},
      // 控制编辑昵称的弹出层显示隐藏
      isUpdateNameShow: false,
      // 控制修改性别的弹出层显示隐藏
      isUpdateGenderShow: false,
      // 控制编辑生日的弹出层显示隐藏
      isUpdateBirthdayShow: false,
      // 控制编辑头像的弹出层显示隐藏
      isUpdatePhotoShow: false,
      // 保存的图片地址
      img: null
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
    },
    // 上传文件事件
    onFileChange () {
      console.log('文件上传成功')
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象创建url地址
      const url = URL.createObjectURL(file)
      // 打开编辑头像的弹出层
      this.isUpdatePhotoShow = true
      // 保存地址到img变量中
      this.img = url
      // 清空input的value值，保证下一次上传相同地址依然能够触发change方法
      this.$refs.file.value = ''
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
