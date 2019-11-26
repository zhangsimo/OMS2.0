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