import axios from '@/libs/api.request'
import api from '_conf/url'

export const getAllList = () => {
  return axios.request({
    url: api.omsOrder + '/pchsOrderMain/backlog',
    method: 'get'
  })
}
