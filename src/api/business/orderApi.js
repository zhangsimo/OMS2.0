import api from '_conf/url'
import axios from '@/libs/api.request'
import Cookies from 'js-cookie';


/**
 * 定向订单 /directBill/queryAll
 * 询价订单 /inqueryBill/queryAll
 * 报价回单 /quoteBill/queryAll
 * 门店订单 /storeOrder/queryAll
 * 直供订单 /supplyOrder/queryAll
 * 电商转单 /transferOrder/queryAll
 * @returns {*}
 */

//定向订单
export function queryAllDirectBill(params) {
  return axios.request({
    url: api.omsOrderApi + '/directBill/queryAll',
    method: 'get',
    params
  })
}

//询价订单
export function queryAllInqueryBill(params) {
  return axios.request({
    url: api.omsOrderApi + '/inqueryBill/queryAll',
    method: 'get',
    params
  })
}

//报价回单
export function queryAllQuoteBill(params) {
  return axios.request({
    url: api.omsOrderApi + '/quoteBill/queryAll',
    method: 'get',
    params
  })
}

//门店订单
export function queryAllStoreOrder(params) {
  return axios.request({
    url: api.omsOrderApi + '/storeOrder/queryAll',
    method: 'get',
    params
  })
}

//直供订单
export function queryAllSupplyOrder(params) {
  return axios.request({
    url: api.omsOrderApi + '/supplyOrder/queryAll',
    method: 'get',
    params
  })
}

//电商转单
export function queryAllTransferOrder(params) {
  return axios.request({
    url: api.omsOrderApi + '/transferOrder/queryAll',
    method: 'get',
    params
  })
}


export function directBillRoutekin(params) {
  return axios.request({
    url: api.omsOrderApi + '/directBill/routekin',
    method: 'get',
    params
  })
}

export function transferOrderRoutekin(params) {
  return axios.request({
    url: api.omsOrderApi + '/transferOrder/routekin',
    method: 'get',
    params
  })
}

//获取门店区域
export function getStoreArea(params) {
  return axios.request({
    url: api.omsApi + '/storeArea/findAll',
    method: 'get',
    params,
  })
}

//获取门店
export function getStoreList(params) {
  return axios.request({
    url: api.omsApi + '/store/findAll',
    method: 'get',
    params,
  })
}

//定向订单导出
export function orderExport(params) {
  return axios.request({
    url: api.omsOrderApi + '/directBill/export',
    method: 'get',
    params,
  })
}

export function orderDownload(params) {
  let token = Cookies.get('token');
  return `${api.omsOrderApi}/directBill/download?access_token=${token}&key=${params}`
}


