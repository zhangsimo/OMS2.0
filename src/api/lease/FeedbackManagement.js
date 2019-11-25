import axios from '@/libs/api.request'
import api from "_conf/url";
//反馈管理全部及分页
export function allMessage(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/queryAll`,
    method: 'get',
    // data:data.data,
    params
  })
}
//查看接口
export function findItem(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/findItem`,
    method: 'post',
    // data:data.data,
    params
  })
}
//标记为已读接口
export function ready(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/change`,
    method: 'post',
    params
  })
}

//反馈管理新增接口
// /feedbackRecord/save
export function feedbackRecord(data) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/save`,
    method: 'post',
    data
  })
}

