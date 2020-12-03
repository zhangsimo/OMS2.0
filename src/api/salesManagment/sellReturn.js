import axios from '@/libs/api.request'
import api from '_conf/url'
//获取左侧数据
export function getLeftList (num , page,data) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/queryByConditions?page=${num}&size=${page}`,
    method: 'post',
    data
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
    url: `${api.omsOrder}/pchsReturnOrdeMain/invalid?id=${id}`,
    method: 'get',
  })
}
//打印
export function getPrint (id) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/print?id=${id}`,
    method: 'get',
  })
}
//退货入库

export function returnWareHouse(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/enterStock?id=${id}`,
    method: 'get',
  })
}
//删除配件
export function getDeleteList (data) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/deleteAll`,
    method: 'post',
    data
  })
}
//保存
export function getSave(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/saveOrUpdate`,
    method: 'post',
    data
  })
}

//提交
export function getSubmit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/commitAndEnter`,
    method: 'post',
    data
  })
}

//查询出库单列表

export function getoutList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/pchsReturnOrdeMain/findBySellOutMain?page=${num}&size=${page}`,
    method: 'post',
    data
  })
 }

//获取退货员
export function getSales () {
  return axios.request({
    url: `${api.authApi}/tenantUsers/findAllPlanner?&size=10000&page=0&userName=&phone=&office=0`,
    method: 'get',

  })
}

//获取华胜订单
export function getHuaShengOrders (params,data) {
  return axios.request({
    url: `${api.omsOrder}/huaShengOrders/findByParams`,
    method: 'post',
    params,
    data
  })
}

export function setHuaShengOrder (data) {
  return axios.request({
    url: `${api.omsOrder}/huaShengOrders/acceptInfo`,
    method: 'post',
    data:data
  })
}

//获取客户信息
export function getClientInfo (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findByIsInternalId`,
    method: 'get',
    params
  })
}


//获取客户信息
export function findInfoById (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findInfoById`,
    method: 'get',
    params
  })
}


//获取华胜门店
export function getHsStore (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findByType`,
    method: 'get',
    params
  })
}


