import axios from '@/libs/api.request'
import api from '_conf/url'

export const getAllList = () => {
  return axios.request({
    url: api.omsOrder + '/pchsOrderMain/backlog',
    method: 'get'
  })
}
//获取首页数据
export function getHomeData(){
  return axios.request({
    url:`${api.omsOrder}/index/getIndexApi`,
    method:'post'
  })
}
