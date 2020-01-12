import api from "_conf/url";
import axios from "@/libs/api.request";

//获取调拨申请列表
export function getList1(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyList?page=${num -
      1}&size=${size}`,
    method: "get",
    params: {
      ...data
    }
  });
}

//获取调拨申请列表明细
export function getListDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyDetail/findApplyDetails`,
    method: "get",
    params: {
      ...data
    }
  });
}

//保存
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApply`,
    method: "post",
    data
  });
}

//提交
export function tijiao(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyCommit`,
    method: "post",
    data
  });
}

//删除
export function shanqu(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyDetail/del`,
    method: "post",
    data
  });
}
//出库
export function outDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/allotBackOut`,
    method: "post",
    data
  });
}
//作废
export function zuofei(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/invalid`,
    method: "post",
    data
  });
}
//打印
export function getprintList(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/pointAdd`,
    method: "post",
    params
  });
}
//打印申请
export function stampApplyDataList1(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyList`,
    method: "post",
    data
  });
}

// 仓库接口
export function cangkulist2(id) {
  return axios.request({
    url: `${api.wmsApi}/comStore/findByOrgid?orgid=${id}`,
    method: "get"
  });
}
//打印申请
export function stampApplyDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/backApplyList`,
    method: "post",
    data
  });
}

// c成品
export function chengping(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/allotEnterMain/allotEnterList?page=${num -
      1}&size=${size}`,
    method: "get",
    params: {
      ...data
    }
  });
}

// c成品
export function chengpingDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/allotEnterDetail/findEnterDetails`,
    method: "get",
    params: {
      ...data
    }
  });
}
