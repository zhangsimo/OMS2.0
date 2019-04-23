import axios from '@/libs/api.request'

// 查询组织
export function findRootGroup () {
  return axios.request({
    url: '/group/findRootGroup',
    method: 'get'
  })
}

export function isExisted (name) {
  return axios.request({
    url: '/group/checkExistByName',
    method: 'get',
    params: {
      name
    }
  })
}

// 删除组织
export function deleteById (data) {
  return axios.request({
    url: '/group/deleteById',
    method: 'post',
    data
  })
}

// 添加或修改组织
export function addOrUpdate (data) {
  return axios.request({
    url: '/group/save',
    method: 'post',
    params: {
      pId: data.pId
    },
    data
  })
}

// 查询组织下的人员
export function findStaffByGroupId (groupId) {
  return axios.request({
    url: '/staff/findByGroupId',
    method: 'get',
    params: {
      groupId
    }
  })
}

// 查询全部人员
export function findAllStaff () {
  return axios.request({
    url: '/staff/findAllStaff',
    method: 'get'
  })
}

// 人员调整
export function changeStaff (groupId, staffIds) {
  return axios.request({
    url: '/group/changeStaff',
    method: 'post',
    params: {
      groupId
    },
    data: staffIds
  })
}

// 从组织中移出人员
export function removeStaff (groupId, staffId) {
  return axios.request({
    url: '/group/removeStaff',
    method: 'post',
    params: {
      groupId,
      staffId
    }
  })
}
