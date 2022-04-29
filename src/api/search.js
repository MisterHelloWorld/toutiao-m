// 搜索相关请求
import request from '@/utils/request'

// XXX：获取联想建议请求
export const getSearchSuggestions = (keywords) =>
  request({
    url: '/v1_0/suggestion',
    params: {
      q: keywords
    }
  })

// XXX：获取搜索结果请求
export function getSearchResult (params) {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
