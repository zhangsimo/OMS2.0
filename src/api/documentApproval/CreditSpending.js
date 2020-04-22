import axios from '@/libs/api.request'
import api from '_conf/url'


//
export function getPchsList (params) {
  return axios.request({
    url: `${api.omsSettle}/advanceCollection/findByQuery`,
    method: 'get',
    params
  })
}


//保存
export function getCreditSave (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveAdvance`,
    method: 'post',
    data
  })
}
