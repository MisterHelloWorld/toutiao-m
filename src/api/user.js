// 用户相关请求
import request from '@/utils/request'

// XXX：登录请求
export const login = (data) =>
  request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })

// XXX：发送验证码请求
export const sendSms = (mobile) =>
  request({
    url: `/v1_0/sms/codes/${mobile}`
  })

// XXX：获取用户自己的信息请求
export const getUserInfo = () =>
  request({
    url: '/v1_0/user'
  })

// XXX：获取用户自己的频道请求
export const getUserChannels = () =>
  request({
    url: '/v1_0/user/channels'
  })
