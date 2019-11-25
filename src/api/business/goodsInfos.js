import api from '_conf/url'
import axios from '@/libs/api.request'

// 收货信息初始化
export function getGoodsInfo (data={}) {
    return axios.request({
        url: `${api.omsApi}/logisticsRecord/findByGuestLog`,
        method: 'post',
        data
    })
  }

