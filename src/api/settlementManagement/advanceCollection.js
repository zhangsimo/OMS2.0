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