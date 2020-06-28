import axios from "@/libs/api.request";
import api from "_conf/url";

//获取主表
export function findPageByDynamicQuery(params) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}
export function findPageByDynamicQueryFirst(params) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}
// 获取附表
export function findByAccountNo(params) {
  return axios.request({
    url: `${api.omsSettle}/payment/record/findByAccountNo`,
    method: "get",
    params,
  });
}

// 领款分页查询
export function findPageToBeClaimedFund(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageToBeClaimedFund`,
    method: "get",
    params,
  });
}

// 预付款认领
export function addClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/addClaim`,
    method: "post",
    data,
  });
}

// 资金认领款核销，核销对账单，进页面基本信息，核销信息查询
export function settlementInit(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/settlementInit`,
    method: "get",
    params,
  });
}

// 未核销对账单查询
export function findPageByCapitalQuery(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}

// 撤回
export function addWithdraw(data) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/addWithdraw`,
    method: "post",
    data,
  });
}

// 预付款核销
export function addWriteOff(data) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/addWriteOff`,
    method: "post",
    data,
  });
}

// 预付款收回认领
export function addReturnClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/addReturnClaim`,
    method: "post",
    data,
  });
}

//资金认领款核销，核销对账单保存
export function addAll(data) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/saveOrUpdate`,
    method: "post",
    data,
  });
}

//获取门店接口
export function goshop(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findPointsShop`,
    method: 'post',
    data
  });
}

