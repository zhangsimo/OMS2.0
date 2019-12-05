import axios from '@/libs/api.request'
import api from '_conf/url'

// *========= 调拨申请 ==========*
// 左侧查询
export function queryAll(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/queryAll`,
    method: 'get',
    params
  })
}
// 根据主键查询
// /allotApplyMain/findById
export function findById(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/findById`,
    method: 'get',
    params
  })
}

// 仓库下拉框
// comStore/stores/queryByOrgid
export function queryByOrgid(params){
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

// 添加配件按钮
// wbParts/findByAllot
export function findByAllot(params){
  return axios.request({
    url: `${api.wmsApi}/wbParts/findByAllot`,
    method: 'get',
    params
  })
}


// 保存按钮
export function save(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/save`,
    method: 'post',
    data
  })
}


// 提交按钮
// /allotApplyMain/commit
export function commit(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/commit`,
    method: 'post',
    data
  })
}
