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

// 计划调整查询
export function queryModifyOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/queryModifyOrder`,
    method: "post",
    data
  });
}

// 计划调整保存
export function saveModifyOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/saveModifyOrder`,
    method: "post",
    data
  });
}

// 计划调整全部调整
export function saveModifyAllOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/saveModifyAllOrder`,
    method: "post",
    data
  });
}

// 查看库存
export function queryPartStockAndLog(partId) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/queryPartStockAndLog`,
    method: "post",
    params: { partId },
    data: {},
  });
}

// 打印
export function print(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/print`,
    method: "post",
    params: { id },
    data: {},
  });
}

// 费用登记-查询左侧
export function findPageByguest(params, data) {
  return axios.request({
    url: `${api.wmsApi}/guest/findPageByDynamicQuery`,
    method: "post",
    params,
    data,
  });
}

// 费用登记-查询右侧
export function getFee(params) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/get/fee/registration`,
    method: "get",
    params,
  });
}

// 费用登记-保存
export function saveFee(data) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/saveOrUpdate`,
    method: "post",
    data,
  });
}