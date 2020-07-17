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

//新增兼职公司
export function addEditUser (data) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/updateUserCompany`,
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
    url: `${api.authApi}/staff/TenantUsersSaveClose?groupId=${id}`,
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


//删除兼职公司
export function setCliemt (data) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/cancelUserCompany`,
    method: 'post',
    data
  })
}


//离职
export function setOut (params) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/updateUserOffices`,
    method: 'get',
    params
  })
}

//校验手机号码是否重复
export function setPhone (params) {
  return axios.request({
    url: `${api.authApi}/staff/checkExistMobile`,
    method: 'get',
    params
  })
}
