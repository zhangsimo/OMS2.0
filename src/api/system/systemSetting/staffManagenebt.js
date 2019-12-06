import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getStaffList (params) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/queryAll?`,
    method: 'get',
    params
  })
}

// 新增用户信息
export function editUser (data , id) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/save?groupId=${id}`,
    method: 'post',
    data
  })
}

//修改用户信息
export function changeeditUser (data) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/update`,
    method: 'post',
    data
  })
}

//新增兼职公司全部信息
export function getCompanyList (params) {
  return axios.request({
    url: `${api.authApi}/sysOrgEmporg/findListPageAll`,
    method: 'get',
    params
  })
}

//查看兼职公司信息
export function findCompanyList (params) {
  return axios.request({
    url: `${api.authApi}/sysOrgEmporg/findListPage`,
    method: 'get',
    params
  })
}

//开通账号
export function putNewCompany (data ,id) {
  return axios.request({
    url: `${api.authApi}/staff/TenantUsersSave?groupId=${id}`,
    method: 'post',
    data
  })
}

// 重置密码
export function restpasswd (data) {
  return axios.request({
    url: `${api.authApi}/staff/TenantUsersResetPwd`,
    method: 'post',
    data
  })
}


//获取公司名称
export function getcompany (params) {
  return axios.request({
    url: `${api.authApi}/group/findRootGroup`,
    method: 'get',
    params
  })
}
