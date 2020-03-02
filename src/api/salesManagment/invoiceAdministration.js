import axios from "@/libs/api.request";
import api from "_conf/url";

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
