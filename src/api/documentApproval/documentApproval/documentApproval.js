//===================== 我的申请 / 我的审批 / 待我审批 ===============================
import axios from '@/libs/api.request'
import api from '_conf/url'

// =================== 我的申请 =============
//主列表查询
export function getLsitone (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyDetail/findAllPchsOrder`,
    method: 'get',
    params
  })
}


// =================== 待我审批 =============
//主列表查询
export function getLsittwo (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyDetail/findAllPchsOrder`,
    method: 'get',
    params
  })
}


// =================== 我的审批 =============
//主列表查询
export function getLsitthree (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyDetail/findAllPchsOrder`,
    method: 'get',
    params
  })
}
