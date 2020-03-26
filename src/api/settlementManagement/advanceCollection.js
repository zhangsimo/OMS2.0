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