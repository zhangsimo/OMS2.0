import axios from "@/libs/api.request";
import api from "_conf/url";
//进度项列表
export function getSalesList(params) {
  return axios.request({
    url: `${api.omsSettle}/salesInvoice/queryInfo`,
    method: "get",
    params
  });
}
