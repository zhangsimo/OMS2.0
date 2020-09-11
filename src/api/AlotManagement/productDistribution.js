import api from '_conf/url';
import axios from '@/libs/api.request';
//获取仓库
export function getcangku() {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get'
  });
}
//获取品牌
export function getPartBrand(data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: 'post',
    data
  });
}
// 紧俏商品列表
export function jinqiaopinliebiao(params) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/findAll`,
    method: 'get',
    params
  });
}

// 锁定数量更新
export function genxin(data) {
  return axios.request({
    url: `${api.omsSotck}/partStoreStock/updateLockQty`,
    method: 'put',
    data
  });
}

// 获取待分配单列表
export function shenqingdanliebiao(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/findAllByPartCode`,
    method: 'get',
    params
  });
}

// 保存
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/jqpAllot`,
    method: 'post',
    data
  });
}

//
export function hotProductsSave(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/hotProductsSave`,
    method: 'post',
    data
  });
}

// 导出(未调)
export function daochu(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  });
}

// 紧俏品一件分配
export function oneDis(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/saveHotProductsBatch`,
    method: 'post',
    data
  });
}
