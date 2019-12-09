import api from '_conf/url';
import axios from '@/libs/api.request';
//获取仓库
export function getcangku() {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get'
  });
}
//获取客户
export function getbayer(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryGuestList`,
    method: 'get',
    params
  });
}
// 供应商直调列表
export function zongbuzhidiaoList(page, size, data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/queryByConditions?page=${page}&size=${size}`,
    method: 'post',
    data
  });
}

// 供应商直调单子明细
export function ListDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/guestClassify`,
    method: 'post',
    data
  });
}

// 到货入库
export function daohuoruku(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/arrival`,
    method: 'post',
    data
  });
}
