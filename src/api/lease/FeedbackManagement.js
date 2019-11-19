import axios from '@/libs/api.request'
//反馈管理全部及分页
export function allMessage(params) {
  return axios.request({
    url: '/feedbackRecord/queryAll',
    method: 'get',
    // data:data.data,
    params
  })
}
//查看接口
export function findItem(params) {
  return axios.request({
    url: '/feedbackRecord/findItem',
    method: 'post',
    // data:data.data,
    params
  })
}
//标记为已读接口
export function ready(params) {
  return axios.request({
    url: '/feedbackRecord/change',
    method: 'post',
    params
  })
}



