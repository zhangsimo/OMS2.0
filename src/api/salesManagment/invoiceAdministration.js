import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//进度项列表
export function getManageList(params) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/findPageByDynamicQuery`,
    method: "get",
    params
  });
}
//进度项批量删除
export function deletetManageList(data) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/deleteAll`,
    method: "post",
    data
  });
}
//发票退回
export function invoiceReturnList(data) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/invoiceReturn`,
    method: "post",
    data
  });
}
//红字转出
export function invoiceRedHedgedList(data) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/invoiceRedHedged`,
    method: "post",
    data
  });
}
//批量导入地址
export const getup = `${api.omsApi}/entryRegistration/import?`;
//导入勾选认证时间
export const authenticationGetup = `${api.omsApi}/entryRegistration/importCheck?`;
//开票清单类型
export function getOptions1(params) {
  return axios.request({
    url: `${api.omgApi}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//发票类型
export function getOptions2(params) {
  return axios.request({
    url: `${api.omgApi}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}

//付款方式
export function getOptions3(params) {
  return axios.request({
    url: `${api.omgApi}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//税率
export function getOptions4(params) {
  return axios.request({
    url: `${api.omgApi}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//发票采购方
export function getOptions5(params) {
  return axios.request({
    url: `${api.omtApi}/company/findByTenantId`,
    method: "get",
    params
  });
}
//发票修改保存
export function savDetailInfor(data) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/updateInvoiceReceipts`,
    method: "post",
    data
  });
}
//智能核销
export function invoiceWriteoff(data) {
  return axios.request({
    url: `${api.omsApi}/entryRegistration/intelligentVerification`,
    method: "post",
    data
  });
}
