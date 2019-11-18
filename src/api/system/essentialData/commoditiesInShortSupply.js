import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getTightProductList (params) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/queryAll`,
    method: 'get',
    params
  })
}

//删除紧俏品
export function getDeleteTight (data) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/delete`,
    method: 'post',
    data
  })
}

// 新增紧俏品
export function getSaveNewTight (data) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/save`,
    method: 'post',
    data
  })
}

//本地配件接口
export function getLocalList (params,data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/findTightAllPage`,
    method: 'post',
    params,
    data
  })
}

//云端配件接口
export function getCloudList (params,data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/findTightPage`,
    method: 'post',
    params,
    data
  })
}

//管理员配件
export function getGmList (params,data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/queryTightAll`,
    method: 'post',
    params,
    data
  })
}

//批量上传
export const getup = `${api.wmsApi}/tightPart/import`;


