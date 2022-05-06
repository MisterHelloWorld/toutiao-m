<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :default-index="gender"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    // 用户性别
    gender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      // 默认值（性别）
      localGender: this.gender
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击取消时触发
    onCancel () {
      this.$emit('close')
    },
    // 点击确认时触发
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          gender: this.localGender
        })
        // 更新视图
        this.$emit('update:gender', this.localGender)
        this.$emit('close')
        this.$toast.success('更新性别成功')
      } catch (error) {
        this.$toast.fail('更新性别失败')
      }
    },
    // 用户选择内容时触发
    onChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less"></style>
