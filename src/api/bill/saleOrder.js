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
export function getreceivable () {
    return axios.request({
        url:`${api.omsSettle}/receivable/payable/get`,
        method: 'get',
    })
}