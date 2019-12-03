import api from '_conf/url'
import axios from '@/libs/api.request'

//获取供应商分类
export function getfindTypeList(data) {
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

//获取票据类型，直发门店下拉框数据
export function getPurchaseInit(data) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/init`,
    method: 'post',
    data
  })
}

//采购计划保存为草稿
export function saveDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/saveDraft`,
    method: 'post',
    data
  })
}

//获取采购计划单列表
export function findPageByDynamicQuery(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}
