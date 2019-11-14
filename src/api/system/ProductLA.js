import axios from "@/libs/api.request";
import api from "_conf/url";

// 数据字典
export function getdictCode(code) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCode?dictCode=${code}`,
    method: "get"
  });
}

// 获取角色
export function getRoles() {
  return axios.request({
    url: `${api.authApi}/role/findAllByPage`,
    method: "get",
    params: {
      size: 10000,
      page: 0,
    }
  });
}

// 获取员工列表
export function getStaffList (params) {
    return axios.request({
      url: `${api.authApi}/tenantUsers/queryAll?`,
      method: 'get',
      params
    })
  }