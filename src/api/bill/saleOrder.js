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
export function getSalelist () {
    return axios.request({
        url:`${api.omsSettle}/receivable/payable/sales/purchase`,
        method: 'get',
        
    })
}
export function getNumberList (params) {
    return axios.request({
        url: `${api.omsOrder}/pchsEnterMain/findOrderDetail`,
        method: 'get',
        params
    })
}