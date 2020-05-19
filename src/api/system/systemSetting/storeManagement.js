import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息树形图
export function getSupplierTreeList (params) {
  return axios.request({
    url: `${api.wmsApi}/companyArea/findAll`,
    method: 'get',
    params
  })
}


//树形图增删改查
export function changeTree (data) {
  return axios.request({
    url: `${api.wmsApi}/companyArea/save`,
    method: 'post',
    data
  })
}

//右侧list
export function getSupplierformation (params) {
  return axios.request({
    url: `${api.wmsApi}/company/queryAll`,
    method: 'get',
    params
  })
}




//新增客户资料
export function getNewSupplier (data) {
  return axios.request({
    url: `${api.wmsApi}/company/save`,
    method: 'post',
    data
  })
}


//是否禁用
export function setDisabled (params) {
  return axios.request({
    url: `${api.wmsApi}/company/disabled`,
    method: 'get',
    params
  })
}


