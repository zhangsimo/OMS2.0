import axios from "@/libs/api.request";
import api from "_conf/url";
import fetchs from 'axios';

// 数据字典
export function getdictCode(code) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCode?dictCode=${code}`,
    method: "get"
  });
}

// 获取角色
export function getRoles(params) {
  return axios.request({
    url: `${api.authApi}/role/findAllByPage`,
    method: "get",
    params,
  });
}

// 获取员工列表
export function getStaffList (data) {
  return axios.request({
    // url: `http://192.168.21.95:9250/employeeAttribute/pageList`,
    url: `${api.wmsApi}/employeeAttribute/pageList`,
    method: 'post',
    data
  })
}
//获取可选员工列表

export function getCanSelectStaff (data){
  return axios.request({
    url:`${api.passportApi}/tenantUsers/findAllTenantUsersRole`,
    method:'post',
    data
  })
}

//移出员工
export function removeStaffList(data){
  return axios.request({
    url:`${api.wmsApi}/employeeAttribute/deleteUser`,
    method:'post',
    data
  })
}
//添加员工
export function addStaff(data){
  return axios.request({
    url: `${api.wmsApi}/employeeAttribute/saveProductUser`,
    method: 'post',
    data
  })
}
// 待分配配件
export function findByEmp (params, data) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/findByEmp`,
    method: 'post',
    params,
    data
  })
}

// 已分配配件
export function findAttByEmpId (params) {
  return axios.request({
    url: `${api.wmsApi}/employeeAttribute/findAttByEmpId`,
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

//一键移出配件
export function employeeDeleteAllPart (data) {
  return axios.request({
    url: `${api.wmsApi}/employeeAttribute/removeAll`,
    method: 'post',
    data
  })
}
export function down(id) {
  let url = `${api.downApi}/file/get?fileId=` + id;
  window.open(url, '_balnk');
}

export const upxlxs = `${api.wmsApi}/employeeAttribute/import`;
