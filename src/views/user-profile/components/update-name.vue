// TODO:编辑昵称组件
<template>
  <div class="update-name">
    <!-- TAG：导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />

    <!-- TAG：修改昵称的输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    name: {
      type: String,
      return: true
    }
  },
  data () {
    return {
      // 修改昵称的输入框里的内容
      message: this.name
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      try {
        if (this.message.length === 0) {
          return this.$toast('昵称不能为空')
        }
        await updateUserProfile({
          name: this.message
        })
        // 更新视图
        this.$emit('update:name', this.message)
        this.$emit('close')
      } catch (error) {
        this.$toast.fail('更新用户个人资料失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
