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
