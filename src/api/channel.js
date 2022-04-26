// 频道相关请求
import request from '@/utils/request'

// XXX：获取所有频道列表请求
export const getAllChannels = () =>
  request({
    url: '/v1_0/channels'
  })
