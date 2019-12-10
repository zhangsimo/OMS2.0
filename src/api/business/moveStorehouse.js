import axios from '@/libs/api.request'
import api from '_conf/url'
//获取左侧数据
export function getLeftList (data, num , size,) {
  return axios.request({
    url: `${api.omsOrder}/stockShiftMain/findListPageAll?page=${num}&size=${size}`,
    method: 'post',
    data
  })
}
//获取仓库
export function getstate () {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
  })
}
