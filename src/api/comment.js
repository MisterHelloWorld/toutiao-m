// 评论相关请求
import request from '@/utils/request'

// XXX：获取评论列表请求
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}
