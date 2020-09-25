import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//列表
export function getInvoiceList(params,data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/queryPageByStatus`,
    method: "post",
    params,
    data
  });
}
// 明细列表
export function getDetailsList(params) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/queryPageByAccountNo`,
    method: "get",
    params
  });
}
// 明细列表
export function getDetailsListApply(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/findinvoiceApplyDetail`,
    method: "post",
    data
  });
}
//智能核销
export function IntelligenceList(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/invoiceSmartCancel`,
    method: "post",
    data
  });
}

//人工核销页面

export function getManualList(params) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/findByQuery`,
    method: "get",
    params
  });
}
//确认核销
export function subManualList(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/manualCancellation`,
    method: "post",
    data
  });
}
//确认核销2
export function subManualList2(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/manualCancellation`,
    method: "post",
    data
  });
}
//更新快运单号
export function updateNumber(params) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/updateExpressBillNo`,
    method: "get",
    params
  });
}
//撤回核销
export function writeData(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/revocationInvoiceCancel`,
    method: "post",
    data
  });
}
//分店
export function getOptionFdList(params) {
  return axios.request({
    url: `${api.wmsApi}/company/findByTenantId`,
    method: "get",
    params
  });
}
//客户
export function getOptionGuesList(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: "get",
    params
  });
}
//开票申请查询与核销 导出配件明细
export function exportModifyData(params){
  let str=""
  for(var i=0;i<params.length;i++){
    str+=`ids=${params[i].id}&`
  }
  return `${api.omsSettle}/invoiceApply/export/findinvoiceApplyDetail?${str}access_token=${Cookies.get(TOKEN_KEY)}`
}
//开票申请查询与核销 导出汇总
export function exportAll(params){
  return `${api.omsSettle}/invoiceApply/export/queryPageByStatus?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}

export function backApply(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/revokeApply`,
    method: "post",
    data
  });
}
