//===================== 申请单 ===============================
import axios from '@/libs/api.request'
import api from '_conf/url'

//主列表查询
export function findPageByDynamicQuery (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findPageByDynamicQuery`,
    method: 'get',
    params
  })
}

//查询当前点击列表内信息
//主列表查询
export function getThisAllList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findById`,
    method: 'get',
    params
  })
}

//判断是否为总部
// http://192.168.2.48:5200/staff/findUserShopKeeper?tenantId=1217653291045625856&shopId=1242781690831372288
export function findUserShopKeeper (params) {
  return axios.request({
    url: `${api.authApi}/staff/findUserShopKeeper`,
    method: 'get',
    params
  })
}
