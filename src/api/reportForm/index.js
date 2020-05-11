import axios from "@/libs/api.request";
import api from "_conf/url";

// 供应商分类
export function getSupplierType(params) {
  return axios.request({
    url: `${api.wmsApi}/supplierType/findType`,
    method: "get",
    params
  });
}