import axios from "@/libs/api.request";
import api from "_conf/url";
//列表
export function getInvoiceList(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApply/queryPageByStatus`,
    method: "post",
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

