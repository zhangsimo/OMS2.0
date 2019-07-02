import axios from '@/libs/api.request'


export function queryAll(params) {
  return axios.request({
    url: '/store/queryAll',
    method: 'get',
    params
  })
}

export function querySupplyStore(params) {
  return axios.request({
    url: '/store/querySupplyStore',
    method: 'get',
    params
  })
}

export function saveStore(data) {
  return axios.request({
    url: '/store/saveSupplier',
    method: 'post',
    data
  })
}
