import axios from '@/libs/api.request'

// 根据skuNo查询sku
export function findBySkuNo (skuNo) {
  return axios.request({
    url: '/Sku/findBySkuNo',
    method: 'get',
    params: {skuNo}
  })
}

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

