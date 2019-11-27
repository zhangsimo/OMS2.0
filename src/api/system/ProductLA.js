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
    url: `${api.authApi}/tenantUsers/findAllTenantUsers`,
    method: 'get',
    params
  })
}

// 待分配配件
export function findByEmp (params) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/findByEmp`,
    method: 'get',
    params
  })
}

// 已分配配件
export function findAttByEmpId (params) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/findPartsByEmpId`,
    method: 'get',
    params
  })
}

// 批量给员工添加配件
export function employeeAddPart (data) {
  return axios.request({
    url: `${api.wmsApi}/employeeAttribute/save`,
    method: 'post',
    data
  })
}

// 批量给员工删除配件
export function employeeDeletePart (data) {
  return axios.request({
    url: `${api.wmsApi}/employeeAttribute/delete`,
    method: 'post',
    data
  })
}

export const upxlxs = `${api.wmsApi}/employeeAttribute/import`;