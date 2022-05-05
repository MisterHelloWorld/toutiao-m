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
  // 该请求分两种情况，有token值，获取的是服务器端（增删后）的频道请求，无token值，获取的是服务器的固定频道
  request({
    url: '/v1_0/user/channels'
  })

// XXX：添加关注请求
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// XXX：取消关注请求
export const deleteFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

// XXX：获取用户个人资料请求
export const getUserProfile = (target) => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// XXX：更新用户个人资料请求
export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
