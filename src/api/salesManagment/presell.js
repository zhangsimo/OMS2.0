import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧表格数据
export function getLeftList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAll?page=${page}&size=${num}`,
    method: 'post',
    data
  })
}

//获取左侧表格数据
export function getMoreList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAll?page=${page}&size=${num}`,
    method: 'post',
    data
  })
}
//获取客户
export function getClient () {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',

  })
}
//交货仓库list
export function getWarehouseList (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

