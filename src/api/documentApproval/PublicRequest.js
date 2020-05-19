import axios from '@/libs/api.request'
import api from '_conf/url'

export function getPublicSave (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveOfficialBorrow`,
    method: 'post',
    data
  })
}



