import api from '_conf/url'
import axios from '@/libs/api.request'

//获取右侧仓库
export function getwarehouse (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

//新增右侧仓库
export function getNewWarehouse (data) {
  return axios.request({
    url: `${api.wmsApi}/comStore/save`,
    method: 'post',
    data
  })
}
