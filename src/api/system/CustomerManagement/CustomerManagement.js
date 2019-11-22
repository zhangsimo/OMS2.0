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
// /guestAdjust/adjustInfo
export function guestAdjustadjustInfo(params) {
  return axios.request({
    url: `${api.wmsApi}/guestAdjust/adjustInfo`,
    method: 'post',
    params
  })
}
//信用额度保存
// /guestResearch/saveOrUpdate
export function saveOrUpdate(data) {
  return axios.request({
    url: `${api.wmsApi}/guestResearch/saveOrUpdate`,
    method: 'post',
    data
  })
}

//调整额度
// /receivable/payable/adjustment
export function adjustment(params) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/adjustment`,
    method: 'get',
    params
  })
}

// /guestAdjust/save
//调整确定
export function save(data) {
  return axios.request({
    url: `${api.wmsApi}/guestAdjust/save`,
    method: 'post',
    data
  })
}
