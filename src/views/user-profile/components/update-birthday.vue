<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="请选择您的生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    // 用户生日（字符串格式）
    birthday: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 最小日期
      minDate: new Date(1970, 0, 1),
      // 最大日期
      maxDate: new Date(),
      // 当前日期
      currentDate: new Date(this.birthday)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 确定事件
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          birthday: dayjs(this.currentDate).format('YYYY-MM-DD')
        })
        // 更新视图
        this.$emit(
          'update:birthday',
          dayjs(this.currentDate).format('YYYY-MM-DD')
        )
        this.$emit('close')
        this.$toast.success('更新生日成功')
      } catch (error) {
        this.$toast.fail('更新生日失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
