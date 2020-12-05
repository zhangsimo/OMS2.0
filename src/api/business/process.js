import api from '_conf/url'
import axios from '@/libs/api.request'

// 组装
// 提交接口
export function tijiao(data) {
  return axios.request({
    url: `${api.omsOrder}/processMain/packCommit`,
    method: 'post',
    data
  })
}

// 作废接口
export function zuofei(id) {
  return axios.request({
    url: `${api.omsOrder}/processMain/invalid?id=${id}`,
    method: 'get'
  })
}

// 删除接口
export function shanqu(id) {
  return axios.request({
    url: `${api.omsOrder}/processProduct/packDelete?id=${id}`,
    method: 'get'
  })
}

// 保存接口
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/processMain/packSaveOrUpdate`,
    method: 'post',
    data
  })
}

// 配件组装列表接口(带查询)
export function peijianzuzhuang(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/processMain/queryPackByCondition?page=${num -1}&size=${size}`,
    method: 'post',
    data
  })
}

// 拆分
// 提交接口
export function tijiao2(data) {
  return axios.request({
    url: `${api.omsOrder}/processMain/splitCommit`,
    method: 'post',
    data
  })
}

// 作废接口
export function zuofei2(id) {
  return axios.request({
    url: `${api.omsOrder}/processMain/invalid?id=${id}`,
    method: 'get'
  })
}

// 保存接口
export function baocun2(data) {
  return axios.request({
    url: `${api.omsOrder}/processMain/splitSaveOrUpdate`,
    method: 'post',
    data
  })
}


// 配件拆分列表接口(带查询)
export function peijianchaifen(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/processMain/querySplitByCondition?page=${num - 1}&size=${size}`,
    method: 'post',
    data
  })
}


// 通用
// 成品接口(带查询)
export function chengping(code, name, params) {
  return axios.request({
    url: `${api.wmsApi}/partMatching/queryByCondition?partCode=${code}&partName=${name}`,
    method: 'get',
    params,
  })
}

// 仓库接口
export function cangkulist2(params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findStoreByShopCode`,
    method: 'get',
    params
  })
}
