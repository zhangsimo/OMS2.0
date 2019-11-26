import axios from "@/libs/api.request";
import api from "_conf/url";

// 数据字典
export function getdictCode(code) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCode?dictCode=${code}`,
    method: "get"
  });
}

// 配件类型树
export function getAccounts(id) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/accounts/${id}`,
    method: "get"
  });
}

// 删除
export function delAccount(id) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/delete/${id}`,
    method: "put",
    data: {},
  });
}

// 启用禁用
export function onOffAccount(id) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/account?id=${id}`,
    method: "put",
    data: {},
  });
}

// 新增/修改
export function addOrUpAccount(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/account`,
    method: "post",
    data,
  });
}