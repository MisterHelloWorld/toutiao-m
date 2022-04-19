// 用户相关请求
import request from '@/utils/request'

// 登录请求
export const login = (data) =>
  request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data
  })
