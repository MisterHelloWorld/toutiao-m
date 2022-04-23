// 文章相关请求
import request from '@/utils/request'

// XXX：获取频道对应文章列表请求
export const getArticles = (params) =>
  request({
    url: '/v1_0/articles',
    params
  })
