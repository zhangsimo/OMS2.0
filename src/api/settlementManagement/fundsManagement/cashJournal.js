import axios from "@/libs/api.request";
import api from "_conf/url";


//获取门店接口
export function shop(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findAllArea`,
    method: "post",
    data
  });
}
