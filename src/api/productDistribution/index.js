import api from '_conf/url'
import axios from '@/libs/api.request'

// 锁定数量更新
export function genxin(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 紧俏商品列表
export function jinqiaopinliebiao(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 分配完成
export function fenpeiwancheng(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 保存
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 获取申请单列表
export function shenqingdanliebiao(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}

// 导出
export function daochu(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  })
}
