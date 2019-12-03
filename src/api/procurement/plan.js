import axios from "@/libs/api.request";
import api from "_conf/url";

// 供应商分类
export function getSupplierType(params) {
  return axios.request({
    url: `${api.wmsApi}/supplierType/findType`,
    method: "get",
    params
  });
}

// 供应商查询
export function getSupplier(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryAllSupplier`,
    method: "get",
    params
  });
}

// 初始化字典值
export function optGroupInit(data = {}) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/init`,
    method: "post",
    data
  });
}

// 计划采购主数据-分页查询
export function findPageByDynamicQuery(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/findPageByDynamicQuery`,
    method: "post",
    params,
    data
  });
}

// 计划采购主数据-高级查询
export function queryByConditions(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/queryByConditions`,
    method: "post",
    params,
    data
  });
}

// 采购计划单
export function getPchsPlan(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/pchsPlan`,
    method: "post",
    params,
    data
  });
}

// 保存草稿
export function saveDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveDraft`,
    method: "post",
    data
  });
}

// 提交
export function saveCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveCommit`,
    method: "post",
    data
  });
}

// 删除配件
export function delPchsOrderDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/delete`,
    method: "post",
    data
  });
}

// 作废
export function saveObsolete(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveObsolete`,
    method: "post",
    params: { id }
  });
}