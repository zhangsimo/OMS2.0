import axios from "@/libs/api.request";
import api from "_conf/url";

//获取当前门店列表
export function goshop(params) {
  return axios.request({
    url: `${api.wmsApi}/company/findShopList`,
    method: "get",
    params,
  });
}

export function getAccShopList(){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/getClaimShopName`,
    method: "get"
  });
}
