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
    data
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
