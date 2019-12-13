import api from '_conf/url'
import axios from '@/libs/api.request'

///preOrderMain/queryAll
// 分页查询预订单信息
export function optGroup (data) {
  return axios.request({
    url: `${api.omsOrder}/preOrderMain/queryAll`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}
