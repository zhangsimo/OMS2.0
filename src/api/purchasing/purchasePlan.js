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
// 获取供应商列表
// /guest/findForAllot
export function findForAllot(data) {
  return axios.request({
    url: `${api.wmsApi}/guest/findForAllot`,
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

//采购计划保存为草稿
export function saveCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/saveCommit`,
    method: 'post',
    data
  })
}


//作废
export function saveObsolete(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/saveObsolete`,
    method: 'post',
    data
  })
}

//反作废
export function saveReverse(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/saveReverse`,
    method: 'post',
    data
  })
}

//获取采购计划单列表
export function findPageByDynamicQuery(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}

// 配件分类菜单树
export function getCarPartClass(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/getCarClassifys`,
    method: 'post',
    data
  })
}

// 配件分类菜单树
export function getCarParts(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/getParts`,
    method: 'post',
    data
  })
}

// 配件分类菜单树 ====> 调拨所需接口
export function getCarPartsTwo(params) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/findByAllot`,
    method: 'get',
    params
  })
}
