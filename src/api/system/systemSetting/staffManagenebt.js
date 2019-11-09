import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getStaffList (params) {
  return axios.request({
    url: `${api.wmsApi}/tenantUsers/queryAll?`,
    method: 'get',
    params
  })
}

// 新增用户信息
export function editUser (data) {
  return axios.request({
    url: `${api.wmsApi}/tenantUsers/save`,
    method: 'post',
    data
  })
}

//修改用户信息
export function changeeditUser (data) {
  return axios.request({
    url: `${api.wmsApi}/tenantUsers/update`,
    method: 'post',
    data
  })
}

//获取兼职公司全部信息
export function getCompanyList (params) {
  return axios.request({
    url: `${api.wmsApi}/sysOrgEmporg/findListPageAll`,
    method: 'get',
    params
  })
}

//开通账号
export function putNewCompany (data) {
  return axios.request({
    url: `${api.wmsApi}/staff/TenantUsersSave`,
    method: 'post',
    data
  })
}

// 重置密码
export function restpasswd (data) {
  return axios.request({
    url: `${api.wmsApi}/staff/TenantUsersResetPwd`,
    method: 'post',
    data
  })
}

