import axios from "@/libs/api.request";
import api from "_conf/url";
//列表
export function getInvoiceList(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApplyCheckChargeOff/queryPageByStatus`,
    method: "post",
    data
  });
}
// 明细列表
export function getDetailsList(params) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApplyCheckChargeOff/queryPageByAccountNo`,
    method: "get",
    params
  });
}
//智能核销
export function IntelligenceList(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceApplyCheckChargeOff/invoiceSmartCancel`,
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
