import api from '_conf/url'
import axios from '@/libs/api.request'

//获取供应商分类
export function getfindTypeList(params) {
  return axios.request({
    url: `${api.wmsApi}/supplierType/findType`,
    method: 'get'
  })
}

//获取供应商列表
export function getSupplierList(data) {
  return axios.request({
    url: `${api.wmsApi}/guest/findAllSupplier`,
    method: 'post',
    data
  })
}

//获取供应商列表
export function getPurchaseInit(data) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/init`,
    method: 'post',
    data
  })
}
