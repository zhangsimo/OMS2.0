//====================  其他应收款管理  ========================
import axios from "@/libs/api.request";
import api from "_conf/url";

// 获取主表
export function findByDynamicQuery(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/findByDynamicQuery`,
    method: "post",
    data
  });
}

//其它付款认领撤回、核销撤回、收款收回撤回
export function withdraw(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/withdraw`,
    method: "post",
    data
  });
}

//资金认领款核销，核销对账单，进页面基本信息，核销信息查询
export function wirteAccount(params) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/init`,
    method: "get",
    params,
  });
}

//收回保存
export function paymentRegain(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/paymentRegain`,
    method: "post",
    data,
  });
}
//资金认领款核销，核销对账单保存
export function saveAccount(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/claim`,
    method: "post",
    data,
  });
}
