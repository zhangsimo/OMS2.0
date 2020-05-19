import axios from '@/libs/api.request'
import api from '_conf/url'


//选择弹窗数据
export function getPchsList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyDetail/findAllPchsOrder`,
    method: 'get',
    params
  })
}

//保存
export function getAdvanceSave (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveAdvance`,
    method: 'post',
    data
  })
}

