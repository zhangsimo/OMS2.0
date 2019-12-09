import api from '_conf/url';
import axios from '@/libs/api.request';

//获取调拨申请列表
export function getList(params) {
  return axios.request({
    url: `${api.omsOrder}/allotEnterMain/queryAll?orderTypeId=3`,
    method: 'get',
    params
  });
}

//入库
export function inDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/allotEnterMain/allotEnterStorage`,
    method: 'post',
    data
  });
}
//打印
export function stampDataList(params) {
  return axios.request({
    url: `${api.omsOrder}/allotEnterMain/allotEnterStorage`,
    method: 'get',
    params
  });
}
