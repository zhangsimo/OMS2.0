import api from '_conf/url'
import axios from '@/libs/api.request'

// 系统参数查询
export function getSys(data) {
  return axios.request({
    url: `${api.wmsApi}/params/findByOrgid`,
    method: 'post',
    data
  })
}

// 系统参数保存/更新
export function saveSys(data) {
  return axios.request({
    url: `${api.wmsApi}/params/saveOrUpdate`,
    method: 'post',
    data
  })
}

//获取模板
export function getAllTemplate(data,params) {
  return axios.request({
    url: `${api.templateApi}/fileTemplate/queryAllFileTemplate`,
    method: 'post',
    data,
    params
  })
}

//获取文件
export function getAllFile(data,params) {
  return axios.request({
    url: `${api.templateApi}/fileTemplate/queryAllFileNotTemplate`,
    method: 'post',
    data,
    params
  })
}

//获取华胜库存
export function getStock(data,params) {
  return axios.request({
    url: `${api.omsEdit}/hs/stock/getHsPartsStock`,
    method: 'post',
    data,
    params
  })
}

//获取华胜门店
export function getHsStore(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findHSStoreList`,
    method: 'get',
    params
  })
}
