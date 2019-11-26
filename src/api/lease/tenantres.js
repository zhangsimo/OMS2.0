import axios from "@/libs/api.request";
import api from "_conf/url";

export function getOmsAuth() {
  return axios.request({
    url: `${api.authApi}/resource/findRootResByScope?scope=oms`,
    method: "get",
  });
}

// 查询全部
export function getAll(params) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/findAll`,
      method: "get",
      params
    });
}

// 修改租户资源
export function updatetenant(data) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/update`,
      method: "post",
      data
    });
}

// 删除租户资源
export function deltenant(data) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/delete`,
      method: "post",
      data
    });
}

// 新增租户资源
export function addresource(data) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/save`,
      method: "post",
      data
    });
}