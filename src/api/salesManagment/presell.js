import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧表格数据
export function getLeftList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAll?page=${page}&size=${num}`,
    method: 'post',
    data
  })
}
