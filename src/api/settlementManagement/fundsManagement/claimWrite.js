import axios from "@/libs/api.request";
import api from "_conf/url";


//未核销对账单查询
export function accountNoSelete(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageByDynamicQuery`,
    method: "get",
    params
  });
}
//本店待认领款分页查询
export function claimedFund(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageToBeClaimedFund`,
    method: "get",
    params
  });
}
//连锁待分配款项分页查询
export function distributionSelete(params) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/findPageByQuery`,
    method: "get",
    params
  });
}
//分配至本店
export function distributionShop(data) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/assignedToOur`,
    method: "post",
    data
  });
}
//撤销分配
export function distributionRevoke(data) {
  return axios.request({
    url: `${api.omsSettle}/capital/claim/verification/cancelArtificialMatching`,
    method: "post",
    data
  });
}


//转当期损益
export function TurnToTheProfitAndLoss(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/transferProfitsLosses`,
    method: "post",
    data
  });
}