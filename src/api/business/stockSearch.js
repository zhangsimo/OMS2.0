import api from '_conf/url'
import axios from '@/libs/api.request'

// 获取汇总库存数据
export function getAllStock (data) {
  return axios.request({
    url: `${api.omsSotck}/partStoreStock/findPageByDynamicQuery?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}
//   批次库存查询
export function getLotStock (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/queryBatchStock?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}
// 获取入库明细数据
export function getEnter (data) {
  console.log(data)
  return axios.request({
    url: `${api.omsOrder}/enterDetail/queryByConditions?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}
//获取出库明细数据outDetail/queryByMainId
export function getOut (data) {
  return axios.request({
    url: `${api.omsOrder}/outDetail/queryByConditions?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}
// 占用订单sellQtyTempRecord/findPageByDynamicQuery
export function getOccupy (data) {
  return axios.request({
    url: `${api.omsSotck}/sellQtyTempRecord/findPageByDynamicQuery?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}

export function getPartBrand(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getPartBrand`,
    method: "post",
    data
  });
}
