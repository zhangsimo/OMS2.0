import axios from '@/libs/api.request'
import api from '_conf/url'

export function getAskSave (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveRequest`,
    method: 'post',
    data
  })
}
