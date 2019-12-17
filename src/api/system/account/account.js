import axios from '@/libs/api.request'
import api from '_conf/url'

// *========= 账户管理 ==========*

// *========= 基本信息===========*
// /tenantInfo/findById
export function tenantInfo(data) {
  return axios.request({
    url: `${api.wmsApi}/tenantInfo/findById`,
    method: 'post',
    data
  })
}

// *========= 华币充值===========*
// /sysCoin/rechargeCoinInfo
export function rechargeCoinInfo(data) {
  return axios.request({
    url: `${api.wmsApi}/sysCoin/rechargeCoinInfo`,
    method: 'post',
    data
  })
}
// 二维码支付
// /wxPay/generationQR
export function generationQR(data) {
  return axios.request({
    url: `${api.wmsApi}/wxPay/generationQR`,
    method: 'post',
    // responseType: 'blob',
    responseType: 'arraybuffer',
    data
  })
}
//确认付款
// /sysCoin/generateOrder
export function generateOrder(data) {
  return axios.request({
    url: `${api.wmsApi}/sysCoin/generateOrder`,
    method: 'post',
    data
  })
}


// *========= 充值消费记录===========*
// /sysCoinRecord/findPageByDynamicQuery
export function findPageByDynamicQuery(data) {
  return axios.request({
    url: `${api.wmsApi}/sysCoinRecord/findPageByDynamicQuery`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}
// *========= 产品购买===========*
// 生成订单
// /tenantInfo/generateOrder
export function tenantInfogenerateOrder(data) {
  return axios.request({
    url: `${api.wmsApi}/tenantInfo/generateOrder`,
    method: 'post',
    data
  })
}

// wxPay/queryOrder
//关闭按钮
export function queryOrder(data) {
  return axios.request({
    url: `${api.wmsApi}/wxPay/queryOrder`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}


// /wxPay/generationRecord
export function generationRecord(data) {
  return axios.request({
    url: `${api.wmsApi}/wxPay/generationRecord`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}
