import api from '_conf/url'
import axios from '@/libs/api.request'

// 进入页面获取数据
export function getCreditApprovalTable (data={}) {
    return axios.request({
      url: `${api.wmsApi}/guestAdjust/findPageByDynamicQuery`,
      method: 'post',
      data
    })
  }

//   根据条件查询数据
export function conditionalQuery (data) {
return axios.request({
    url: `${api.wmsApi}/guestAdjust/findPageByDynamicQuery`,
    method: 'post',
    data
})
}
// 查看明细接口
export function viewDetails (params) {
  return axios.request({
      url: `${api.wmsApi}/guestAdjust/findById`,
      method: 'get',
      params
  })
  }