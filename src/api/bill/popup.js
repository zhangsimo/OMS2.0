import api from '_conf/url'
import axios from '@/libs/api.request'
// 进项登记保存并提交
export function submit(data) {
  return axios.request({
      url: `${api.omsSettle}/entryRegistration/saveRegistration`,
      method: 'post',
      data
  })
}
//进项登记删除行接口
export function deleteRows(params){
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/delete`,
    method: 'get',
    params
})
}
//增加核销对账单(弹窗查询)
export function verificationIncrease(params){
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/findStatementAndRegistration`,
    method: 'get',
    params
})
}
//进入进项登记页面查询对账单对应发票明细信息
export function detailedIncrease(params){
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/findDetail`,
    method: 'get',
    params
})
}
//申请单号
export function applyNo(){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/applyNo`,
    method: 'get',
})
}
//不含税申请单号
export function noTaxApplyNo(){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/applyNotTaxNo`,
    method: 'get',
})
}
//选择销售单
export function saleSlip(data){
  return axios.request({
    url: `${api.omsSettle}/statement/master/queryStatementByTaxSign`,
    method: 'post',
    data
})
}
//发票单位
export function ditInvoice(params){
  return axios.request({
    url: `${api.wmsApi}/guest/findGuestTaxpayerByGuestId`,
    method: 'get',
    params
})
}
//不含税对账单号
export function noTaxAccount(data){
  return axios.request({
    url: `${api.omsSettle}/statement/master/queryDocument`,
    method: 'post',
    data
})
}
//引用上次申请信息
export function informationCitation(params){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/queryPre`,
    method: 'get',
    params
})
}
//开票配件
export function partsInvoice(params){
  return axios.request({
    url: `${api.omsOrder}/sellOutDetail/findByMainId`,
    method: 'get',
    params
})
}
