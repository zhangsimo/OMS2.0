// 账户登记表
import axios from "@/libs/api.request";
import api from "_conf/url";

//查询接口
export function findListPageAll(params, data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceLoanForBusiness/findByDynamicQuery`,
    method: "post",
    params,
    data
  });
}

//因公支出认领/借支收回
export function addClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceLoanForBusiness/addClaim`,
    method: "post",
    data
  });
}

// 因公借支撤回
export function loanRevoke(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceLoanForBusiness/loanRevoke`,
    method: "post",
    data
  });
}