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

// XXX：对评论或评论回复点赞请求
export function addCommentLike (commentId) {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

// XXX：取消对评论或评论回复点赞请求
export function deleteCommentLike (commentId) {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${commentId}`
  })
}
