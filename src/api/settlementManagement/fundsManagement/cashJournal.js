import axios from "@/libs/api.request";
import api from "_conf/url";


//获取门店接口
export function shop(params) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findAllShop`,
    method: "get",
    params
  });
}
