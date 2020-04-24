import axios from '@/libs/api.request'
import api from '_conf/url'



//获取转入门店
export function getShiftTo (params) {
  return axios.request({
    url: `${api.wmsApi}/company/findByTenantId`,
    method: 'get',
    params
  })
}


//保存
export function getIFSave (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveAllot`,
    method: 'post',
    data
  })
}
