import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧表格数据
export function getLeftList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAll?page=${page}&size=${num}`,
    method: 'post',
    data
  })
}


//获取右侧额度
export function getLimit  (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/findGuestAmt`,
    method: 'get',
    params
  })
}
//获取客户
export function getClient () {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',

  })
}
//交货仓库list
export function getWarehouseList (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findStoreByShopCode`,
    method: 'get',
    params
  })
}
//作废

export function getDelete (id) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/invalid?id=${id}`,
    method: 'get',
  })
}

//打印
export function getPrint (id) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/print?id=${id}`,
    method: 'get',
  })
}
//保存
export function getSave(data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/addOrUpdate`,
    method: 'post',
    data
  })
}
//提交
export function getSubmit(data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/commitOrder`,
    method: 'post',
    data
  })
}

//完成销售

export function finishSales(id) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/finish?id=${id}`,
    method: 'get',
  })
}


//删除配件
export function getDeleteList (data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderDetail/delete`,
    method: 'post',
    data
  })
}
//批量导入地址 编码品牌导入配件
export const getup = `${api.omsOrder}/guestOrderMain/import?`;
//内码导入配件
export const getupInnerId=`${api.omsOrder}/guestOrderMain/import/partId?`

//获取业务员
export function getSales () {
  return axios.request({
    url: `${api.authApi}/tenantUsers/queryAll?&size=10000&page=0&userName=&phone=&office=0`,
    method: 'get',

  })
}
