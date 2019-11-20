import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getList (params) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/main/queryQc`,
    method: 'get',
    params
  });
}
//保存
export function saveList (data={}) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/main/saveOrUpdate`,
    method: 'post',
    data
  });
}
