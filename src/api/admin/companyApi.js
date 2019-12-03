import axios from '@/libs/api.request'
import api from '_conf/url'


// 分页查询员工信息
export function allStaffCompany (page, size, params) {
  params.page = page - 1
  params.size = size
  params.tenantId = localStorage.getItem('authUserId')
  return axios.request({
    url: `${api.authApi}/tenantCompany/findAll?`,
    method: 'get',
    params
  })
}

// 删除用户
export function delStaffById (data) {
  return axios.request({
    url: `${api.authApi}/tenantCompany/deleteById`,
    method: 'post',
    data
  })
}

// 添加公司信息
export function editUser (data) {
  return axios.request({
    url: `${api.authApi}tenantCompany/save`,
    method: 'post',
    data
  })
}

// 修改公司信息
export function changeCompany (data) {
  return axios.request({
    url: `${api.authApi}tenantCompany/update`,
    method: 'post',
    data
  })
}

// 重置密码
export function resetPwd (data) {
  return axios.request({
    url: `${api.authApi}/staff/resetPwd`,
    method: 'post',
    data
  })
}

// 添加或修改用户信息
export function findByUsername (username, data) {
  return axios.request({
    url: `${api.authApi}/staff/findByUsername`,
    method: 'get',
    params: {
      username
    },
    data
  })
}

// 添加用户时，判断username是否重复
export function isExisted (name) {
  return axios.request({
    url: `${api.authApi}/staff/checkExistByName`,
    method: 'get',
    params: {
      name
    }
  })
}

// 分配角色
export function changeRoles (data) {
  return axios.request({
    url: `${api.authApi}/staff/changeRoles`,
    method: 'post',
    data
  })
}

// 解冻或冻结
export function frozenStaff (data) {
  return axios.request({
    url: `${api.authApi}/staff/frozen`,
    method: 'post',
    data
  })
}
