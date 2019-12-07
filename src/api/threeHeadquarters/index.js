import api from '_conf/url'
import axios from '@/libs/api.request'

// 总部直调列表
export function zongbuzhidiaoList(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 总部直调单子明细
export function ListDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 到货入库
export function daohuoruku(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

