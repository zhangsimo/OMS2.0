import axios from '@/libs/api.request'
import api from '_conf/url'


//
export function getPchsList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyDetail/findAllPchsOrder`,
    method: 'get',
    params
  })
}
