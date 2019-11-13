import api from '_conf/url'
import axios from '@/libs/api.request'


//获取当前页信息
export function getBankList (params) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/accounts/${params}`,
    method: 'get',
  })
}

//审核
export function getAudit (data) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/initAccount`,
    method: 'put',
    data
  })
}

//保存
export function saveAudit (data) {
  return axios.request({
    url: `${api.wmsApi}/settleAccount/accounts`,
    method: 'post',
    data
  })
}
