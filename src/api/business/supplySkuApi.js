import axios from '@/libs/api.request'

export function findAllSupplyPartner(data) {
  return axios.request({
    url: '/partner/findAllSupplyPartner',
    method: 'get',
    params: data.params,
    data: data.initBody
  })
}

export function queryAllSupplySku(data) {
  return axios.request({
    url: '/supplySku/queryAllSupplySku',
    method: 'get',
    params: data.params,
    data: data.initBody
  })
}

export function saveSupplySku(data) {
  return axios.request({
    url: '/supplySku/saveSupplySku',
    method: 'post',
    data
  })
}

export function update(params) {
  return axios.request({
    url: '/supplySku/update',
    method: 'post',
    params
  })
}

export function del(params) {
  return axios.request({
    url: '/supplySku/delete',
    method: 'post',
    params
  })
}
