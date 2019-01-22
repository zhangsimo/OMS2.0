import axios from '@/libs/api.request'

export function queryAll(data) {
  return axios.request({
    url: '/store/queryAll',
    method: 'get',
    params: data.params,
    data: data.initBody
  })
}

export function saveStore(data) {
  return axios.request({
    url: '/store/save',
    method: 'post',
    data: data
  })
}

export function findAllArea(params) {
  return axios.request({
    url: '/area/findAll',
    method: 'get',
    params
  })
}

export function saveArea(data) {
  return axios.request({
    url: '/areaStore/save',
    method: 'post',
    data
  })
}

export function deleteArea(data) {
  return axios.request({
    url: '/areaStore/delete',
    method: 'post',
    data
  })
}

export function del(params) {
  return axios.request({
    url: '/supplySku/delete',
    method: 'post',
    params
  })
}
