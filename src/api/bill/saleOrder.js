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