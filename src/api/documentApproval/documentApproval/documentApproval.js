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

