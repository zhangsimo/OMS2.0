import axios from "@/libs/api.request";
import api from "_conf/url";

//获取门店接口
export function findPageByDynamicQuery(params) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}
