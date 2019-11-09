import axios from "@/libs/api.request";
import api from "_conf/url";

// 查询客服信息
export function getCustomerAll(params) {
  return axios.request({
    url: `${api.omsApi}/customer/queryAll`,
    method: "get",
    params
  });
}

// 新增修改客服信息
export function saveCustomer(data) {
  return axios.request({
    url: `${api.omsApi}/customer/save`,
    method: "post",
    data
  });
}

// 获取不可见的租户id
export function getNotLookTenantIds(params) {
  return axios.request({
    url: `${api.omsApi}/customerAssociated/notLookTenantIds`,
    method: "get",
    params
  });
}

// 根据客服id获取该客服所有租户
export function getTenantIds(params) {
  return axios.request({
    url: `${api.omsApi}/customerAssociated/TenantIds`,
    method: "get",
    params
  });
}

// 查询租户
export function getTenants(params) {
  return axios.request({
    url: `${api.omsApi}/tenant/findByIdsNotIn`,
    method: "get",
    params
  });
}

// 新增 删除 客服租户关系
export function changeCT(data) {
    return axios.request({
      url: `${api.omsApi}/customerAssociated/save`,
      method: "post",
      data
    });
}