import api from '_conf/url'
import axios from '@/libs/api.request'

// 退回受理确认
export function tuihuishouli(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 退回受理拒绝
export function tuihuishoulijujue(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 退回受理列表
export function tuihuishouliliebiao(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 退回受理单明细列表
export function tuihuishoulimingxi(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}
