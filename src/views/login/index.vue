<template>
  <div class="login-container">
    <!-- TAG：导航栏 -->
    <van-nav-bar
      @click-left="$router.back()"
      left-text="返回"
      left-arrow
      title="登录"
      class="page-nav-bar"
    />

    <!-- TAG：登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 手机号 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 插槽左侧：手机字体图标 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <!-- 验证码 -->
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!-- 插槽左侧：小锁字体图标 -->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- 插槽右侧：倒计时组件 -->
        <van-count-down
          v-if="isCountDownShow"
          slot="button"
          :time="1000 * 3"
          format="ss 秒"
          @finish="isCountDownShow = false"
        />
        <!-- 插槽右侧：验证码按钮 -->
        <van-button
          v-else
          slot="button"
          size="small"
          type="primary"
          round
          native-type="button"
          @click="sendSms"
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
import { login, sendSms } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      // 表单输入框双向绑定的数据
      user: {
        mobile: '',
        code: ''
      },
      // 用户表单校验规则
      userFormRules: {
        // 手机号校验规则
        mobile: [
          {
            // 必填项
            required: true,
            // 校验错误提示信息
            message: '手机号不能为空'
          },
          {
            // 正则表达式规则
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        // 验证码校验规则
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 是否显示倒计时组件
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ...mapMutations(['setUser']),
    // 点击登录按钮时触发（前提：校验通过）
    async onSubmit () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 随机模拟请求失败
        if (Math.random() > 0.5) {
          JSON.parse('随机模拟请求失败')
        }
        const res = await login(this.user)
        console.log(res)
        this.setUser(res.data.data)
        this.$toast.success('登录成功！')
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    // 点击发送验证码按钮时触发
    async sendSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return this.$toast('校验手机号失败！')
      }
      // 2.显示倒计时
      console.log('校验成功走这一步')
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
      } catch (error) {
        this.isCountDownShow = false
        if (error.response && error.response.status === 429) {
          this.$toast.fail('发送太过频繁')
        } else {
          this.$toast('未知错误，请重试')
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
