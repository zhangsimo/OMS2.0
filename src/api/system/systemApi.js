import api from '_conf/url'
import axios from '@/libs/api.request'
import Cookies from 'js-cookie';


//sku同步
export function skuSync(params) {
  return axios.request({
    url: `${api.omsApi}/sync/sku`,
    method: 'get',
    params,
  })
}

//设置区域
export function settingArea(data) {
  return axios.request({
    url: `${api.omsApi}/storeArea/save`,
    method: 'post',
    data,
  })
}

//区域列表
export function getAreaList(params) {
  return axios.request({
    url: `${api.omsApi}/storeArea/findAll`,
    method: 'get',
    params,
  })
}

//区域列表
export function getStoreAreaLineList(params) {
  return axios.request({
    url: `${api.omsApi}/storeAreaLine/findAll`,
    method: 'get',
    params,
  })
}

//获取门店信息
export function getStore(params) {
  return axios.request({
    url: `${api.omsApi}/store/findAll`,
    method: 'get',
    params,
  })
}


export function storeAreaLine(data) {
  return axios.request({
    url: `${api.omsApi}/storeAreaLine/save`,
    method: 'post',
    data,
  })
}

export function storeAreaDeleted(params) {
  return axios.request({
    url: `${api.omsApi}/storeArea/deleted`,
    method: 'delete',
    params,
  })
}

export function storeAreaLineDeleted(params) {
  return axios.request({
    url: `${api.omsApi}/storeAreaLine/deleted`,
    method: 'delete',
    params,
  })
}

export function checkStore(params) {
  return axios.request({
    url: `${api.wmsApi}/storeLocation/location/checkLocation`,
    method: 'get',
    params,
  })
}