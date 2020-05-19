import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getLogisticsList (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryAllLogistics?`,
    method: 'get',
    params
  })
}


//新增用户

export function getNewLogistics (data) {
  return axios.request({
    url: `${api.wmsApi}/guest/saveLogistics?`,
    method: 'post',
    data
  })
}

//获取类型结算方式
export function getAlltype (params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findByIds?`,
    method: 'get',
    params
  })
}



