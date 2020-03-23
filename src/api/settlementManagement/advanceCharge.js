import axios from "@/libs/api.request";
import api from "_conf/url";

//获取主表
export function findPageByDynamicQuery(params) {
  return axios.request({
    url: `${api.omsSettle}/advancePayment/findPageByDynamicQuery`,
    method: "get",
    params,
  });
}

// 获取附表
export function findByAccountNo(params) {
  return axios.request({
    url: `${api.omsSettle}/payment/record/findByAccountNo`,
    method: "get",
    params,
  });
}