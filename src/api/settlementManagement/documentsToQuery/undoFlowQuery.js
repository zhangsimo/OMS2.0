import axios from "@/libs/api.request";
import api from "_conf/url";


//撤销流水查询
export function runningWater(data) {
  return axios.request({
    url: `${api.omsSettle}/revoke/record/findPageByDynamicQuery`,
    method: "post",
    data
  });
}
