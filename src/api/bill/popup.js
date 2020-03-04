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
//选择销售单
export function saleSlip(data){
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/queryConditions  
    taxSign`,
    method: 'post',
    data
})
}
