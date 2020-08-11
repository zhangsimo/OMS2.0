import api from '_conf/url'
import axios from '@/libs/api.request'
//对账单弹框 进项登记与修改 获取发票销售方名称数组
export function getInvoiceSellerList(){
  return axios.request({
    url:`${api.wmsApi}/guest/taxPayerList`,
    method:"get"
  })
}
//对账单弹框 进项登记与修改 弹框新增开票信息
export function postInvoiceSellerList(data){
  return axios.request({
    url:`${api.wmsApi}/guestTaxpayer/save`,
    method:"post",
    data
  })
}

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
export function applyNo(params){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/applyNo`,
    method: 'get',
    params
})
}
//不含税申请单号
export function noTaxApplyNo(params){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/applyNotTaxNo`,
    method: 'get',
    params
})
}


//保存不含税开票为草稿
export function saveNoTaxDraft(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/notTaxDraft`,
    method: 'post',
    data
  })
}

//获取不含税开票草稿
export function getNoTaxDraft(params){
  return axios.request({
    url: `${api.omsSettle}/invoiceApplyNotTax/findNotTaxDraft`,
    method: 'get',
    params
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
export function partsInvoice(data){
  return axios.request({
    url: `${api.omsSettle}/statement/master/findDeatilByAccountNo`,
    method: 'post',
    data
})
}
//发票对冲页面选择对账单
export function seleteAccount(params){
  return axios.request({
    url: `${api.omsSettle}/invoiceHedgingMain/findStatementPage`,
    method: 'get',
    params
})
}
//发票对冲页面申请单号
export function hedgingApplyNo(){
  return axios.request({
    url: `${api.omsSettle}/invoiceHedgingMain/generateServiceId`,
    method: 'get'
})
}
//发票对冲保存
export function hedPreservation(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceHedgingMain/saveOrUpdate`,
    method: 'post',
    data
})
}
//发票对冲提交
export function hedSubmit(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceHedgingMain/commit`,
    method: 'post',
    data
})
}
//销售开票保存
export function saveDraft(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/saveDraft`,
    method: 'post',
    data
})
}
//销售开票提交申请
export function submitDraft(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/save`,
    method: 'post',
    data
})
}
//销售开票不含税提交申请
export function submitNoTax(data){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/saveNotTax`,
    method: 'post',
    data
})
}

//有草稿的返回值
export function getDraftList (params){
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/findDraft`,
    method: 'get',
    params
  })
}
