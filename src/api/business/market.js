import api from '_conf/url';
import axios from '@/libs/api.request';

//获取销售出库列表
export function getList1(num,size, data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/findPageByDynamicQuery?page=${num}&size=${size}`,
    method: 'post',
    data
  });
}

//获取更多列表
export function getListmore(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/queryConditions?page=${num}&size=${size}`,
    method: 'post',
    data
  });
}

//保存
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/saveOrUpdate`,
    method: 'post',
    data
  });
}


//删除
export function shanqu(data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutDetail/delete`,
    method: 'post',
    data
  });
}
//出库
export function outDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/subSave`,
    method: 'post',
    data
  });
}
//作废
export function zuofei(data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/invalid`,
    method: 'post',
    data
  });
}
//打印
export function getprintList (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/print`,
    method: 'post',
    data
  })
}
//打印申请
export function stampApplyDataList1(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyList`,
    method: 'post',
    data
  });
}

// 仓库接口
export function cangkulist2(id) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findByOrgid?orgid=${id}`,
    method: 'get'
  })
}
//打印申请
export function stampApplyDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyList`,
    method: 'post',
    data
  });
}

// c成品
export function chengping(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/queryAll?page=${num -1}&size=${size}`,
    method: 'get',
    params: {
      ...data
    }
  });
}
