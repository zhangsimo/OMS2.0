import axios from "@/libs/api.request";
import api from "_conf/url";

// 活动申请信息页面获取数据接口
export function getActApplicationTable() {
  return axios.request({
    url: `${api.omsApi}/activity/findAll`,
    method: "get"
  });
}

// 活动申请页面第二个表格数据接口
export function getActApplyTable(params) {
  console.log()
  return axios.request({
    url: `${api.omsApi}/activityDetail/queryAll`,
    method: "get",
    params
  });
}

// 活动信息页面获取数据接口
export function getActivityIfo() {
  return axios.request({
    url: `${api.omsApi}/activityDetail/queryAll`,
    method: "get"
  });
}

// 过期活动信息页面获取数据接口
export function getExpiredActTable() {
  return axios.request({
    url: `${api.omsApi}/activityDetail/findAll`,
    method: "get"
  });
}

// 查询活动信息接口
export function getActivityList(params) {
  console.log(params)
  return axios.request({
    url: `${api.omsApi}/activityDetail/queryAll`,
    method: "get",
    params
  });
}

// 查询过期活动信息接口
export function getExpiredActivityList(params) {
  return axios.request({
    url: `${api.omsApi}/activityDetail/findAll`,
    method: "get",
    params
  });
}
// 取消活动申请接口
export function cancelActApply(data) {
  return axios.request({
    url: `${api.omsApi}/activity/cancelActivity`,
    method: "post",
    data
  });
}

// 取消活动接口
export function cancelAct(data) {
  console.log(data)
  return axios.request({
    url: `${api.omsApi}/activityDetail/cancelActivity`,
    method: "post",
    data
  });
}
// 活动导入接口
export function actImport() {
  return axios.request({
    url: `${api.omsApi}/activity/importExcel`,
    method: "post",
  });
}
// 审核活动申请接口
export function auditActivity(data) {
  return axios.request({
    url: `${api.omsApi}/activity/auditActivity`,
    method: "post",
    data
  });
}