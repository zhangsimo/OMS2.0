import api from '_conf/url'
import axios from '@/libs/api.request'

// 预订单受理页面数据接口
export function getSupplier (data={}) {
    return axios.request({
        url: `${api.omsOrder}/optGroup/init`,
        method: 'post',
        data
    })
  }




