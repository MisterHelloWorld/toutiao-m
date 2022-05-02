// 文章相关请求
import request from '@/utils/request'

// XXX：获取频道对应文章列表请求
export const getArticles = (params) =>
  request({
    url: '/v1_0/articles',
    params
  })

// XXX：根据文章ID获取文章详情请求
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// XXX：收藏文章请求
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}

// XXX：取消收藏文章请求
export const deleteCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

// XXX：对文章点赞请求
export const addLike = (articleId) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

// XXX：取消文章点赞请求
export const deleteLike = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}
