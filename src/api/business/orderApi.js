import api from '_conf/url'
import axios from '@/libs/api.request'


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
