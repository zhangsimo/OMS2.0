import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//进度项列表
export function getManageList(params) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/findPageByDynamicQuery`,
    method: "get",
    params
  });
}
//进度项批量删除
export function deletetManageList(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/deleteAll`,
    method: "post",
    data
  });
}
//发票退回
export function invoiceReturnList(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/invoiceReturn`,
    method: "post",
    data
  });
}
//红字转出
export function invoiceRedHedgedList(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/invoiceRedHedged`,
    method: "post",
    data
  });
}
//批量导入地址
export const getup = `${api.omsSettle}/entryRegistration/import?`;
//导入勾选认证时间
export const authenticationGetup = `${api.omsSettle}/entryRegistration/importCheck?`;
//开票清单类型
export function getOptions1(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//发票类型
export function getOptions2(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}

//付款方式
export function getOptions3(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//税率
export function getOptions4(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}
//发票采购方
export function getOptions5(params) {
  return axios.request({
    url: `${api.wmsApi}/company/findByTenantId`,
    method: "get",
    params
  });
}
//发票修改保存
export function savDetailInfor(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/updateInvoiceReceipts`,
    method: "post",
    data
  });
}
//智能核销
export function invoiceWriteoff(data) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/intelligentVerification`,
    method: "post",
    data
  });
}
//弹框获取数据
export function getToastDataList(params) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/findByAccountNo`,
    method: "get",
    params
  });
}
//二级弹框列表
export function verificationIncrease(params) {
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/findStatementAndRegistration`,
    method: "get",
    params
  });
}
// 发票管理保存并提交
export function saveSubmit(data) {
  return axios.request({
      url: `${api.omsSettle}/entryRegistration/saveRegistration`,
      method: 'post',
      data
  })
}
//发票管理删除行接口
export function deleteSubtabulation(params){
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/delete`,
    method: 'get',
    params
})
}
