import axios from '@/libs/api.request'

// 查询sku
export function queryAll ({params}) {
  return axios.request({
    url: '/Sku/queryAll',
    method: 'get',
    params
  })
}

// 更新sku
export function save (data) {
  return axios.request({
    url: '/Sku/save',
    method: 'post',
    data
  })
}
