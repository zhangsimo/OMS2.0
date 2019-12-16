import api from '_conf/url';
import axios from '@/libs/api.request';

//获取调拨申请列表
export function getList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//快速查询-时间
export function getDataQuickList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//快速查询-状态
export function getDataTypeList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//更多查询
export function getDataMoreList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//保存
export function saveDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//提交
export function submitDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//出库
export function outDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//作废
export function removeDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//打印
export function stampDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
//打印申请
export function stampApplyDataList(data) {
  return axios.request({
    url: `/`,
    method: 'post',
    data
  });
}
