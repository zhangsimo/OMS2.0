import axios from '@/libs/api.request'
import api from '_conf/url'

// 根据用户id查询资源
export function findByUserId (userId) {
  return axios.request({
    url: `${api.authApi}/resource/findByUserId`,
    method: 'get',
    params: {
      userId
    }
  })
}

// 查询整个资源树
export function findRootRes () {
  return axios.request({
    url: `${api.authApi}/resource/findRootRes`,
    method: 'get'
  })
}

// 查询二级系统资源
export function findResScope () {
  return axios.request({
    url: `${api.authApi}/resource/findResScope`,
    method: 'get'
  })
}

// 根据系统标识查询资源树
export function findRootResByScope (scope) {
  return axios.request({
    url: `${api.authApi}/resource/findRootResByScope`,
    method: 'get',
    params: {
      scope
    }
  })
}

// 检查标识是否可用
export function isExisted (name) {
  return axios.request({
    url: `${api.authApi}/resource/checkExistByName`,
    method: 'get',
    params: {
      name
    }
  })
}

// 删除资源
export function deleteById (data) {
  return axios.request({
    url: `${api.authApi}/resource/deleteById`,
    method: 'post',
    data
  })
}

// 添加或修改资源
export function addOrUpdate (data) {
  return axios.request({
    url: `${api.authApi}/resource/save`,
    method: 'post',
    params: {
      pId: data.pId
    },
    data
  })
}
