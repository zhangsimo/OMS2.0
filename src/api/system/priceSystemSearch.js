import axios from "@/libs/api.request";
import api from "_conf/url";

// 获取表格数据
export function getPriceSystemSearchTable(params,data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/findPartSystem?page=${params.page}&size=${params.size}`,
    method: "post",
    data,
    params
  });
}
// 获取非禁用价格列表
export function getPriceNotEnable(params){
  return axios.request({
    url:`${api.wmsApi}/sellPriceStrategy/findEnable`,
    method:"get",
    params
  })
}