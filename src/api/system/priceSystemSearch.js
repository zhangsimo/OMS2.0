import axios from "@/libs/api.request";
import api from "_conf/url";

// 获取表格数据
export function getPriceSystemSearchTable(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/findForPartPrice?page=${data.page}&size=${data.size}`,
    method: "post",
    data: {}
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