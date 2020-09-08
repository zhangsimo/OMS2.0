import api from '_conf/url'
import axios from '@/libs/api.request'

///preOrderMain/queryAll
// 分页查询预订单信息
export function optGroup (data) {
  return axios.request({
    url: `${api.omsOrder}/preOrderMain/queryAll`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}

// 删除配件  /preOrderDetail/delete
export function deleteit (data) {
  return axios.request({
    url: `${api.omsOrder}/preOrderDetail/delete`,
    method: 'post',
    data:data
  })
}

// 保存  /preOrderMain/save
export function save (data) {
  return axios.request({
    url: `${api.omsOrder}/preOrderMain/save`,
    method: 'post',
    data:data
  })
}

//提交 /preOrderMain/commitOrder
export function commitOrder (data) {
  return axios.request({
    url: `${api.omsOrder}/preOrderMain/commitOrder`,
    method: 'post',
    data:data
  })
}

// 作废 /preOrderMain/invalid
export function invalid (params) {
  return axios.request({
    url: `${api.omsOrder}/preOrderMain/invalid`,
    method: 'get',
    params
  })
}

//批量导入地址 编码品牌导入
export const getup = `${api.omsOrder}/preOrderMain/import?`;
//内码导入配件
export const getupInnerId=`${api.omsOrder}/preOrderMain/import/partId?`;

// 更多弹筐里的下拉框
// tenantUsers/queryAll?size=10&page=0&userName=&
export function queryAll (params) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/queryAllSalesman?size=1000&page=0&userName=&phone=`,
    method: 'get',
    params
  })
}
