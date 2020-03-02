import api from '_conf/url'
import axios from '@/libs/api.request'
// 进项登记保存并提交
export function submit(data) {
  return axios.request({
      url: `${api.omsSettle}/entryRegistration/saveRegistration`,
      method: 'post',
      data
  })
}
//进项登记删除行接口
export function deleteRows(params){
  return axios.request({
    url: `${api.omsSettle}/entryRegistration/delete`,
    method: 'get',
    params
})
}