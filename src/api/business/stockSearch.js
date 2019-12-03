import api from '_conf/url'
import axios from '@/libs/api.request'

// 获取汇总库存数据
export function getAllStock (data) {
  return axios.request({
    url: `${api.omsStore}/partStoreStock/findPageByDynamicQuery`,
    method: 'post',
    data
  });
}
//   批次库存查询
export function getLotStock (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/queryBatchStock`,
    method: 'post',
    data
  });
}
// 获取入库明细数据
export function getEnter (data) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail/queryByConditions`,
    method: 'post',
    data
  });
}
//获取出库明细数据outDetail/queryByMainId
export function getOut (data) {
  return axios.request({
    url: `${api.omsOrder}/outDetail/queryByConditions`,
    method: 'post',
    data
  });
}
// 占用订单sellQtyTempRecord/findPageByDynamicQuery
export function getOccupy (data) {
  return axios.request({
    url: `${api.omsStore}sellQtyTempRecord/findPageByDynamicQuery`,
    method: 'post',
    data
  });
}
