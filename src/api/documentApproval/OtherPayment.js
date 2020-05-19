import axios from '@/libs/api.request'
import api from '_conf/url'

export function getpublicRequestList (params) {
  return axios.request({
    url: `${api.omsSettle}/otherAccountsPayment/findByQuery`,
    method: 'get',
    params
  })
}


export function getOtherSve (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveOrUpdate`,
    method: 'post',
    data
  })
}
