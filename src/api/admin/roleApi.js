import axios from '@/libs/api.request'
import api from '_conf/url'

// 分页查询角色列表
export function queryRolesByPage (displayName, name, size, page) {
  return axios.request({
    url: `${api.authApi}/role/findAllByPage`,
    method: 'get',
    params: {
      size,
      page,
      displayName,
      name,
    }
  })
}

// 查询全部角色
export function queryAllRoles (params) {
  return axios.request({
    url: `${api.authApi}/role/findAll`,
    method: 'get',
    params
  })
}

// 检查标识是否可用
export function isExisted (name) {
  return axios.request({
    url: `${api.authApi}/role/checkExistByName`,
    method: 'get',
    params: {
      name,

    }
  })
}

// 删除资源
export function deleteById (data) {
  // data.tenantId = localStorage.getItem('authUserId')
  return axios.request({
    url: `${api.authApi}/role/deleteById`,
    method: 'post',
    data
  })
}

// 添加或修改资源
export function addOrUpdate (data, groupId) {
  // data.tenantId = localStorage.getItem('authUserId')
  return axios.request({
    url: `${api.authApi}/role/save`,
    method: 'post',
    params: {
      groupId
    },
    data
  })
}
