import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧数据
export function getLeftList (num , page,data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/queryPageByDynamicQuery?page=${num}&size=${page}`,
    method: 'post',
    data
  })
}
