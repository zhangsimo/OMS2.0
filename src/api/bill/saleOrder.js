import api from '_conf/url'
import axios from '@/libs/api.request'

// 销售订单明细
export function getOrderlist(data) {
    return axios.request({
        url: `${api.omsOrder}/sellOrderMain/findByQuery`,
        method: 'post',
        data
    })
}
// 分店名称
export function getStorelist(data) {
    return axios.request({
        url:`${api.authApi}/group/findRootByPid?pId=0`,
        method: 'get',
        data
    })
}
// 应收应付管理 
export function getreceivable (params) {
    return axios.request({
        url:`${api.omsSettle}/receivable/payable/get`,
        method: 'get',
        params
    })
}
// 应收应付销售/采购清单
export function getSalelist (params) {
    return axios.request({
        url:`${api.omsSettle}/receivable/payable/sales/purchase`,
        method: 'get',
        params
    })
}
// 出/入库明细
export function getNumberList (params) {
    return axios.request({
        url: `${api.omsOrder}/pchsEnterMain/findOrderDetail`,
        method: 'get',
        params
    })
}

// 月结对账
export function getReconciliation (params) {
    return axios.request({
        url:`${api.omsSettle}/accounts/receivable/get/reconciliation/business`,
        method: 'get',
        params
    })
}
// 月结对账选中结算
export function getSettlement(data) {
    return axios.request({
        url:`${api.omsSettle}/accounts/receivable/get/total/reconciliation`,
        method: 'post',
        data
    })
}
// 月结对账保存草稿/保存并提交
export function Preservation(data) {
    console.log(data)
    return axios.request({
        url:`${api.omsSettle}/accounts/receivable/add`,
        method: 'post',
        data
    })
}

