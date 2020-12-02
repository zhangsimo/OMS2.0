import api from '_conf/url';
import axios from '@/libs/api.request';
//获取仓库
export function getcangku(params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findStoreByShopCode`,
    method: 'get',
    params
  });
}
// 总部直调列表
export function zongbuzhidiaoList(page, size, data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/queryDirectAllot?page=${page}&size=${size}`,
    method: 'post',
    data
  });
}

// 到货入库
export function daohuoruku(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/arrival`,
    method: 'post',
    data
  });
}
