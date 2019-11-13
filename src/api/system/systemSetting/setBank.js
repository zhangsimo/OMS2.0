import api from '_conf/url'
import axios from '@/libs/api.request'


//获取当前页信息
export function getBankList (params) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/accounts/${params}`,
    method: 'get',
  })
}

