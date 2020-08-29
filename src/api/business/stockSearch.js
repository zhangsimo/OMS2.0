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
//汇总库存数据导出
export const exportAll=api.omsSotck + `/partStoreStock/export/PartStoreStock?`
//   批次库存查询
export function getLotStock (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/queryBatchStock?page=${data.page}&size=${data.size}`,
    method: 'post',
    data
  });
}
// 批次库存导出
export const exportPart=api.omsOrder + `/enterMain/export/BatchStock?`
// 获取入库明细数据
export function getEnter (data) {
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
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: "post",
    data
  });
}

//获取配件品牌--不是维保的接口
export function getPartBrandNoWB(data = {}) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/optPartBrand`,
    method: "post",
    data
  });
}

//获取用户所属机构
export function findMasterOrgId(params = {}) {
  return axios.request({
    url: `${api.wmsApi}/company/findMasterId`,
    method: "get",
    params
  });
}


//获取仓库
export function getStoreAll(params = {}) {
  return axios.request({
    url: `${api.wmsApi}/comStore/queryAllStore`,
    method: "get",
    params
  });
}

// 获取出库明细合值
export function OtotalData (data) {
  return axios.request({
    url: `${api.omsOrder}/outDetail/totalData`,
    method: 'post',
    data
  });
}

// 获取入库明细合值
export function EtotalData (data) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail/totalData`,
    method: 'post',
    data
  });
}

// 获取汇总合值
export function PtabulatData (data) {
  return axios.request({
    url: `${api.omsSotck}/partStoreStock/tabulatData`,
    method: 'post',
    data
  });
}

// 获取批次合值
export function EtabulatData (data) {
  return axios.request({
    url: `${api.omsOrder}/enterMain/tabulatData`,
    method: 'post',
    data
  });
}

//级别销价
export function getLevel (params) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail/unsalableInfo`,
    method: 'get',
    params
  });
}

//级别销价
export function  getUnsalable(params) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/findBySell`,
    method: 'get',
    params
  });
}
