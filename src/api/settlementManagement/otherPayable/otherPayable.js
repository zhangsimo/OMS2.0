//====================  其他应付款管理  ========================
import axios from "@/libs/api.request";
import api from "_conf/url";

// 获取主表
export function findByDynamicQuery(data) {
  return axios.request({
    url: `${api.omsSettle}/otherAccountsPayment/findByDynamicQuery`,
    method: "post",
    data
  });
}

//撤回
export function paymentRevoke(data) {
  return axios.request({
    url: `${api.omsSettle}/otherAccountsPayment/paymentRevoke`,
    method: "post",
    data,
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

//应付款认领
export function addClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/otherAccountsPayment/addClaim`,
    method: "post",
    data,
  });
}
