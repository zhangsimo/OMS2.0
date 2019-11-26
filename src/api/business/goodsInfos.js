import api from '_conf/url'
import axios from '@/libs/api.request'

// 收货信息初始化 192.168.30.21.9210
export function getGoodsInfo (data={}) {
    return axios.request({
        url: `${api.omsOrder}/logisticsRecord/findByGuestLog`,
        method: 'post',
        data
    })
  }
//查询按钮
export function queryGoodsInfo (data={}) {
  return axios.request({
      url: `${api.omsOrder}/logisticsRecord/findByGuestLog`,
      method: 'post',
      data
  })
}
//保存按钮
  export function saveGoodsInfo (data={}) {
    return axios.request({
        url: `${api.omsOrder}/logisticsRecord/save`,
        method: 'post',
        data
    })
  }
//获取配送方式字典 配送方式下拉框
// export function getDic () {
//   return axios.request({
//       url: `http://192.168.30.21:9200/dictionariesItem/findByDictCode?dictCode=SYS_PS_001`,
//       method: 'get',
//   })
// }
//发货物流下拉框
export function logistics  () {
  return axios.request({
      url: `${api.wmsApi}/guest/findAllLogistics`,
      method: 'get',
  })
}
