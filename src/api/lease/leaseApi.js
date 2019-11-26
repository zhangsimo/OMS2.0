import axios from '@/libs/api.request'
import api from '_conf/url'

// 查询租赁产品列表
export function getLeaseProlist (data) {
  return axios.request({
    url: `${api.omsApi}/tenantProduct/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}

// 新增修改产品
export function saveProduct (data) {
  return axios.request({
    url: `${api.omsApi}/tenantProduct/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 获取租赁产品详情
export function getProductDetail (params) {
  return axios.request({
    url: `${api.omsApi}/productRes/findById`,
    method: 'get',
    params
  })
}

//删除修改详情
export function deleteAndChange (data) {
  return axios.request({
    url: `${api.omsApi}/productRes/deleteAndChange`,
    method: 'post',
    data
  })
}


//查询租赁订单列表
export function getLeaseOrderlist (data) {
  return axios.request({
    url: `${api.omsApi}/tenantOrder/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}

//查询30天内到期订单
export function getExpire30list (data) {
  return axios.request({
    url: `${api.omsApi}/tenantOrder/findPageByExpiring`,
    method: 'post',
    data
  })
}

//关闭未付款订单
export function closeNoPayOrder (data) {
  return axios.request({
    url: `${api.omsApi}/tenantOrder/close`,
    method: 'post',
    data
  })
}

//批量关联资源
export function getLeasesaveProduct (data) {
  return axios.request({
    url: `${api.omsApi}/productRes/saveProduct`,
    method: 'post',
    data
  })
}



