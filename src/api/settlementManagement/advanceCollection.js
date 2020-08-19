import axios from "@/libs/api.request";
import api from "_conf/url";

//预收款管理主页面分页查询
export function findAdvance(params) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}
//预收款认领
export function addClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/addClaim`,
    method: "post",
    data,
  });
}

//资金核销-预收款认领
export function addClaim2(data) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/addClaim`,
    method: "post",
    data,
  });
}

//查询往来单位信息列表分页
export function findGuest(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryGuestShortInfoList`,
    method: "get",
    params,
  });
}
//预收款撤回/预收款核销撤回/预收款支出撤回
export function revoke(data) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/addWithdraw`,
    method: "post",
    data,
  });
}
//查询预收款支出申请基础信息和支付信息
export function findApplyInfo(params) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/queryExpenditureApplyInfo`,
    method: "get",
    params,
  });
}
//查询预收款单据和往来单位信息
export function findCollectionInfo(params) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/queryAdvanceCollectionInfo`,
    method: "get",
    params,
  });
}
//预收款支出申请
export function savePay(data) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/addExpand`,
    method: "post",
    data,
  });
}
