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

// 验证调拨入库仓位检查
export function validityPosition(params){
  return axios.request({
    url: `${api.wmsApi}/storeLocation/location/checkLocation`,
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

// 打印次数
// /allotApplyMain/pointAdd
export function pointAdd(params,data = {}){
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/pointAdd?`,
    method: 'post',
    params,
    data
  })
}

// 申请受理所有
// /allotApplyMain/findAll
export function findAll(params){
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/findAll`,
    method: 'get',
    params
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
// 受理和拒绝接口
// /allotMainAccept/save
export function allotMainAccept(data){
  return axios.request({
    url: `${api.omsOrder}/allotMainAccept/save`,
    method: 'post',
    data
  })
}


// 获取调拨申请订单修改明细
export function getAllotApplyDetail(params){
  return axios.request({
    url: `${api.omsOrder}/allotApplyDetail/queryParams`,
    method: 'get',
    params
  })
}
