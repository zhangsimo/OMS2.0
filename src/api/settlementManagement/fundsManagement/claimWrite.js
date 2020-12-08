import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//转当期损益tab切换查询
export function getSubjectMsg(data) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/selectAccountList`,
    method: "post",
    data
  });
}

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
//资金认领款核销--左边 
export function getPayablesExportqileft(params){
  return `${api.omsSettle}/capital/claim/verification/export/findPageByDynamicQuery?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//资金认领款核销右边第一个 

export function getPayablesExportqirightone(params){
  return `${api.omsSettle}/capital/claim/verification/export/findPageToBeClaimedFund?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//资金认领款核销--右边第二个
export function getPayablesExportqirighttwo(params){
  return `${api.omsSettle}/capital/claim/verification/export/findPageByQuery?${params}access_token=${Cookies.get(TOKEN_KEY)}`
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
