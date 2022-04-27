// 频道相关请求
import request from '@/utils/request'

// XXX：获取所有频道列表请求
export const getAllChannels = () =>
  request({
    url: '/v1_0/channels'
  })

// XXX：添加用户频道列表请求
export const addUserChannel = (channel) => {
  // 该请求是在服务器端添加，最后会通过获取用户频道请求获取最新的频道
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// XXX：删除用户频道列表请求
export const deleteUserChannel = (channelId) => {
  // 该请求是在服务器端删除，最后会通过获取用户频道请求获取最新的频道
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
