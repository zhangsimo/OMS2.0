import axios from '@/libs/api.request'
import api from '_conf/url'

// *========= 客户信用管理 ==========*
// /guest/queryCreditList
//查询所有客户信息（分页）
export function queryCreditList(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryCreditList`,
    method: 'get',
    params
  })
}

//信用额度记录表
// /guestAdjust/guestCreditHistory
export function guestCreditHistory(params) {
  return axios.request({
    url: `${api.wmsApi}/guestAdjust/guestCreditHistory`,
    method: 'get',
    params
  })
}
