import axios from '@/libs/api.request'
import api from '_conf/url'

// 查询租赁产品列表
export function getLeaseProlist (params) {
  return axios.request({
    url: `${api.omsApi}/leaseProduct/queryAll`,
    method: 'get',
    params
  })
}

// 新增修改产品
export function saveProduct (data) {
  return axios.request({
    url: `${api.omsApi}/leaseProduct/save`,
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
export function getLeaseOrderlist (params) {
  return axios.request({
    url: `${api.omsApi}/leaseOrder/findAll`,
    method: 'post',
    params
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



