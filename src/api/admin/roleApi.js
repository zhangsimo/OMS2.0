import axios from '@/libs/api.request'
import api from '_conf/url'

// 分页查询角色列表
export function queryRolesByPage (params) {
  return axios.request({
    url: `${api.authApi}/role/findAllByPage`,
    method: 'get',
    params

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

//新增角色
export function addNewStaffe(data) {
  return axios.request({
    url:`${api.authApi}/role/save`,
    method:'post',
    data
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

// 删除角色
export function deleteById (data) {
  // data.tenantId = localStorage.getItem('authUserId')
  return axios.request({
    url: `${api.authApi}/role/deleteById`,
    method: 'post',
    data
  })
}

// 添加或修改资源
export function addOrUpdate (data,) {
  return axios.request({
    url: `${api.authApi}/role/save`,
    method: 'post',
    data
  })
}

//获取员工权限
export function getStaff (data) {
  return axios.request({
    url: `${api.authApi}/staff/findAllTenantUsersRole?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  })
}

// 获取员工wms
export function getStaffWms (params, data) {
  return axios.request({
    url: `${api.authApi}/staff/findAllTenantUsersRoleWms`,
    method: 'post',
    data,
    params,
  })
}

//员工改变权限保存
export function saveStaffJurisdiction (data) {
  return axios.request({
    url: `${api.authApi}/staff/changeUserRoles`,
    method: 'post',
    data
  })
}

//员工改变权限保存wms
export function saveStaffJurisdictionWms (data) {
  return axios.request({
    url: `${api.authApi}/staff/addWMSChangeUserRoles`,
    method: 'post',
    data
  })
}

//保存功能
export function saveOrder (data) {
  return axios.request({
    url: `${api.authApi}/role/updateRole`,
    method: 'post',
    data
  })
}

//删除wms权限
export function deleteWMSChangeUserRoles (data) {
  return axios.request({
    url: `${api.authApi}/staff/deleteWMSChangeUserRoles`,
    method: 'post',
    data
  })
}


//获取树形
// 查询整个资源树
export function findRootRes (params) {
  return axios.request({
    url: `${api.authApi}/resource/findRootResShop`,
    method: 'get',
    params
  })
}

// 查询整个wms资源树
export function findRootResWms () {
  return axios.request({
    url: `${api.authApi}/resource/findRootResShopWms`,
    method: 'get'
  })
}

// 获取仓库
export function getWarehouse () {
  return axios.request({
    url: `${api.authApi}/warehouse/queryWarehouse?page=0&size=1000`,
    method: 'post',
    data: {},
  })
}

//获取全部系统角色
export function findAllJob () {
  return axios.request({
    url: `${api.authApi}/role/getAllRoles`,
    method: 'get'
  })
}
