import axios from '@/libs/api.request'
import api from '_conf/url'

export function getApplyList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findAllRequest`,
    method: 'get',
    params
  })
}



