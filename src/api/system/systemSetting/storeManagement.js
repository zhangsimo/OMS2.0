import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息树形图
export function getSupplierTreeList (params) {
  return axios.request({
    url: `${api.wmsApi}/companyPart/findType`,
    method: 'get',
    params
  })
}


//树形图增删改查
export function changeTree (data) {
  return axios.request({
    url: `${api.wmsApi}/companyPart/save`,
    method: 'post',
    data
  })
}

//右侧list
export function getSupplierformation (params) {
  return axios.request({
    url: `${api.wmsApi}/sysShort/findAll`,
    method: 'get',
    params
  })
}




//新增客户资料
export function getNewSupplier (data) {
  return axios.request({
    url: `${api.wmsApi}/sysShort/save?`,
    method: 'post',
    data
  })
}

