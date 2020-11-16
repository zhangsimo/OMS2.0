import axios from '@/libs/api.request'
import api from '_conf/url'
import {TOKEN_KEY} from '@/libs/util'
import Cookies from 'js-cookie'
var url = "http://192.168.30.221:9210"
//获取左侧数据
export function getLeftList (data, num , size,) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/queryByConditions?page=${num}&size=${size}`,
    method: 'post',
    data
  })
}
//获取右侧的所有数据
export function getRightDatas (id) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/findById?id=${id}`,
    method: 'get'
  })
}
//删除
export function delectTable (data) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckDetail/deleteAll`,
    method: 'post',
    data
  })
}
//获取客户
export function getClient () {
  return axios.request({
    url: `${api.omsOrder}/guest/findByQuery`,
    method: 'get',

  })
}
//获取仓库
export function getstate () {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',

  })
}
//导入 按照编码品牌导入配件
export const importAccessories = `${api.omsOrder}/StockCheckMain/import`

//导入 按照配件内码导入配件
export const importInnerIdAccessories=`${api.omsOrder}/StockCheckMain/import/partId`

//导出  盘盈sign 0  盘亏sign 1
export function exportVentory(params){
  return `${api.omsOrder}/StockCheckMain/export?${params}&access_token=${Cookies.get(TOKEN_KEY)}`
}

//获取品牌
export function getBrandList (data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: 'post',
    data
  })
}

//获取右侧的数据
export function getRightList (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/findById`,
    method: 'get',
    params
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

//交货仓库list
export function getWarehouseList (params) {
  return axios.request({
    url: `${api.omsOrder}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

//点击打开详情级别价格
export function getDetails  (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOutDetail/check`,
    method: 'get',
    params
  })
}


//保存
export function getSave (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/saveSellOrder`,
    method: 'post',
    data
  })
}

//出库
export function getStockOut (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/stockOut`,
    method: 'post',
    data
  })
}

//提交
export function getSubmitList (data) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/saveOrUpdate`,
    method: 'post',
    data
  })
}

//保存
export function saveVentory (data) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/saveDraft`,
    method: 'post',
    data
  })
}

//提交
export function submitVentory (data) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/submit`,
    method: 'post',
    data
  })
}


//打印
export function getprintList (data) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/print?id=${data.id}`,
    method: 'get'
  })
}


//作废
export function getCancellation (id) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/invalid?id=${id}`,
    method: 'post'
  })
}


//返单
export function getReorder (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/backSellOrder`,
    method: 'post',
    data
  })
}

//导出
// export function getExport (params) {
// //   return axios.request({
// //     url: `${url}/sellOrderMain/export`,
// //     method: 'get',
// //     params
// //   })
// // }

//客户选择
export function getTreeClient (params) {
  return axios.request({
    url: `${api.omsOrder}/guest/queryGuestList?`,
    method: 'get',
    params
  })
}

//客户类型
export function getClientType () {
  return axios.request({
    url: `${api.omsOrder}/guestType/guestTypeTree`,
    method: 'get',

  })
}

//添加配件
export function getAccessories (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/saveSellOrder`,
    method: 'post',
    data
  })
}

//删除配件
export function getDeleteList (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/delete`,
    method: 'post',
    data
  })
}



//批次配件
export function getParnt (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/chooseBatch`,
    method: 'get',
    params
  })
}

//活动数据
export function getActivity (params) {
  return axios.request({
    url: `${api.omsOrder}/activityPart/queryAll?`,
    method: 'get',
    params
  })
}


//选择入库单数据
export function getGodown (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/chooseEnter?`,
    method: 'get',
    params
  })
}
//获取供应商
export function getSupplier (data) {
  return axios.request({
    url: `${api.omsOrder}/guest/findAllSupplier`,
    method: 'post',
    data
  })
}

