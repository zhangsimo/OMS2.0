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
// 退回受理列表
export function tuihuishouliliebiao(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backAcceptList`,
    method: 'get',
    params
  });
}
// 退回受理确认
export function tuihuishouli(data) {
  return axios.request({
    url: `${api.omsOrder}/allotMainAccept/accept`,
    method: 'post',
    data
  });
}
