import api from '_conf/url'
import axios from '@/libs/api.request'

//采购退货所有下拉框
export function optGroup (data) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/init`,
    method: 'post',
    data
  })
}

// 左侧分页查询
export function findPageByDynamicQuery (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/findPageByDynamicQuery`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}

//保存
///sellOrderReturn/saveDraft
export function saveDraft (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/saveDraft`,
    method: 'post',
    data
  })
}

//删除配件
// /sellOutDetail/delete
export function sellOrderReturn (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/delete`,
    method: 'post',
    data
  })
}

//提交
// /sellOrderReturn/saveCommit
export function saveCommit (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/saveCommit`,
    method: 'post',
    data
  })
}

// 退货
// /sellOrderReturn/returnPchs
export function returnPchs (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/returnPchs`,
    method: 'post',
    data
  })
}

// 作废
// /sellOrderReturn/saveObsolete
export function saveObsolete (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/saveObsolete`,
    method: 'post',
    data:data.data,
    params: data.params
  })
}

// 打印   /sellOrderReturn/print
export function print (params,data = {}) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderReturn/print`,
    method: 'post',
    params,
    data
  })
}
