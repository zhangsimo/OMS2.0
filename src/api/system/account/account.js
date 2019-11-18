import axios from '@/libs/api.request'
import api from '_conf/url'

// *========= 账户管理 ==========*
// 基本信息
// /tenantInfo/findById
export function tenantInfo(data) {
  return axios.request({
    url: `${api.wmsApi}/tenantInfo/findById`,
    method: 'post',
    data
  })
}
