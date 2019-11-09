import axios from "@/libs/api.request";
import api from "_conf/url";

// 级别定义-保存
export function sellPsSave(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceStrategy/save`,
    method: "post",
    data
  });
}

// 级别定义-获取
export function sellPsList() {
  return axios.request({
    url: `${api.wmsApi}/sellPriceStrategy/findByTenantId`,
    method: "post",
    data: {}
  });
}

// 保存客户
export function sellcussave(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceGuest/save`,
    method: "post",
    data
  });
}

// 获取客户分页
export function findAllCus(params, data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceGuest/findAll`,
    method: "post",
    params,
    data,
  });
}

// 配件分页查询
export function queryPart(params, data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/queryAll`,
    method: "post",
    params,
    data,
  });
}

// area
export function area(params) {
  return axios.request({
    url: `${api.omsProduct}/area/findAll`,
    method: 'get',
    params
  })
}