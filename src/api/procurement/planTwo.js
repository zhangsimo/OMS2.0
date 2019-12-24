import axios from "@/libs/api.request";
import api from "_conf/url";

// 采购计划单
export function getPchsPlan(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/pchsEnter`,
    method: "post",
    params,
    data
  });
}

