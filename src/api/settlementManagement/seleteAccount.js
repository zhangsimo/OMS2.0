import axios from "@/libs/api.request";
import api from "_conf/url";

//对账单收付款结算页面对账单查询
export function findAccount(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}
//资金认领款核销，核销对账单，进页面基本信息，核销信息查询
export function wirteAccount(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/settlementInit`,
    method: "get",
    params,
  });
}
//资金认领款核销，核销对账单保存
export function saveAccount(data) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/saveOrUpdate`,
    method: "post",
    data,
  });
}

//对账单对冲保存后直接发票对冲
export function getHedging(data) {
  return axios.request({
    url: `${api.omsSettle}/invoiceHedgingMain/hedgeCommit`,
    method: "post",
    data,
  });
}
