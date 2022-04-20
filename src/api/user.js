// 用户相关请求
import request from '@/utils/request'

// 登录请求
export const login = (data) =>
  request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })

// 发送验证码请求
export const sendSms = (mobile) =>
  request({
    url: `/v1_0/sms/codes/${mobile}`
  })
