<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar" />

    <!-- 登录表单 -->
    <van-form @submit="onSubmit">
      <van-field v-model="user.mobile" name="用户名" placeholder="请输入手机号">
        <!-- 插槽左侧字体图标 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field v-model="user.code" name="密码" placeholder="请输入验证码">
        <!-- 插槽左侧字体图标 -->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- 插槽右侧按钮 -->
        <van-button
          slot="button"
          size="small"
          type="primary"
          class="send-sms-btn"
          round
          >发送验证码</van-button
        >
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击登录按钮时触发
    async onSubmit () {
      try {
        if (Math.random() > 0.5) {
          JSON.parse('随机模拟请求失败')
        }
        const res = await login(this.user)
        console.log(res)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log('手机号或验证码错误')
        } else {
          console.log('登录失败，请稍后重试', error)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
