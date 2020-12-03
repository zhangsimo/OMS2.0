import axios from '@/libs/api.request'
import api from '_conf/url'
//获取左侧数据
export function getLeftList (data) {
  return axios.request({
    url: `${api.omsOrder}/stockShiftMain/pageAll`,
    method: 'post',
    data
  })
}
//获取右侧数据
export function getRightDatas (data) {
  return axios.request({
    url: `${api.omsOrder}/StockShiftDetail/findAllBy?mainId=${data}`,
    method: 'get',
  })
}

//获取仓库
export function getstate (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findStoreByShopCode`,
    method: 'get',
    params
  })
}
//保存
export function updata (data) {
  return axios.request({
    url: `${api.omsOrder}/stockShiftMain/saveOrUpdate`,
    method: 'post',
    data
  })
}
//提交
export function getSubmitList (data) {
  return axios.request({
    url: `${api.omsOrder}/stockShiftMain/commit`,
    method: 'post',
    data
  })
}
//删除
export function delectTable (data) {
  return axios.request({
    url: `${api.wmsApi}/StockShiftDetail/deleteById`,
    method: 'post',
    data
  })
}
//作废
export function getCancellation (data) {
  return axios.request({
    url: `${api.omsOrder}/stockShiftMain/invalid`,
    method: 'post',
    data
  })
}

//获取右边数据
// export function getRightDatas (data) {
//   return axios.request({
//     url: `${url}/StockShiftDetail/findAllBy`,
//     method: 'post',
//     data
//   })
// }
