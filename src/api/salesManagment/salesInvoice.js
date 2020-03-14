import axios from "@/libs/api.request";
import api from "_conf/url";
//列表
export function getSalesList(params) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/queryInfo`,
    method: "get",
    params
  });
}
//批量删除
export function deletetSalesList(data) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/deleteAll`,
    method: "post",
    data
  });
}

//作废
export function voidSalesList(data) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/invoiceNullify`,
    method: "post",
    data
  });
}
//核销

export function writeSalesList(data) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/invoicRredRush`,
    method: "post",
    data
  });
}
//保存修改
export function saveSalesList(data) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/updateInfo`,
    method: "post",
    data
  });
}
//字典查询
export function getOptionSalesList(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=`+params,
    method: "get",
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
export function getOptionCpList(params) {
  return axios.request({
    url: `${api.omsApi}/tenant/findById?id=0`,
    method: "get",
    params
  });
}
export const getup = `${api.omsSettle}/salesInvoice/import?`;