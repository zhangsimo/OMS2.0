import api from '_conf/url'
import axios from '@/libs/api.request'

//获取表一页信息
export function getList (params) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/main/queryQc`,
    method: 'get',
    params
  });
}
//保存
export function saveList (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/main/saveOrUpdate`,
    method: 'post',
    data
  });
}
//删除
export function deleteList (data) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail?ids=${data.ids}`,
    method: 'delete',
  });
}
//审核
export function checkList (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/main/auditFeign`,
    method: 'put',
    data
  });
}
