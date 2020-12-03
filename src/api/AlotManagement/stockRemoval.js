import api from "_conf/url";
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//获取调拨申请列表
export function getList1(data, size, num) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/queryAll?page=${num - 1}&size=${size}`,
    method: "get",
    params: {
      ...data
    }
  });
}

//获取调拨申请列表明细
export function getListDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutDetail/findByMainId`,
    method: "get",
    params: {
      ...data
    }
  });
}

//保存
export function baocun(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/addOrUpdate`,
    method: "post",
    data
  });
}

//提交
export function tijiao(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/commit`,
    method: "post",
    data
  });
}

//删除
export function shanqu(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutDetail/del`,
    method: "post",
    data
  });
}
//出库
export function outDataList(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/allotOut`,
    method: "post",
    data
  });
}
//作废
export function zuofei(data) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/invalid`,
    method: "post",
    data
  });
}
//打印
export function getprintList(params) {
  return axios.request({
    url: `${api.omsOrder}/allotOutMain/pointAdd`,
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
    url: `${api.omsOrder}/wbParts/queryAll?page=${num - 1}&pageSize=${size}`,
    method: "post",
    params: {
      ...data
    }
  });
}
export function exportStockRemoval(params){
  return `${api.omsOrder}/allotOutDetail/export?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
