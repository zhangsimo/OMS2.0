import axios from "@/libs/api.request";
import api from "_conf/url";

// 活动申请信息页面获取数据接口
export function getActApplicationTable() {
  return axios.request({
    url: `${api.omsApi}/activity/findAll`,
    method: "get"
  });
}

// 根据条件查询申请信息
export function getSelectActApply(params) {
  return axios.request({
    url: `${api.omsApi}/activity/findAll`,
    method: "get",
    params
  });
}
// 活动申请页面第二个表格数据接口
export function getActApplyTable(params) {
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

// 根据条件查询活动信息接口
export function getActivityList(params) {
  return axios.request({
    url: `${api.omsApi}/activityDetail/queryAll`,
    method: "get",
    params
  });
}

// 根据条件查询过期活动信息接口
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
// 编辑并提交接口
export function editAndSubmit(params) {
  return axios.request({
    url: `${api.omsApi}/activityDetail/findByApplyId`,
    method: "get",
    params
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
export const upxlxs = `${api.omsApi}/activity/importExcel`;

// 导入活动保存草稿接口
export function saveDraft(data) {
  return axios.request({
    url: `${api.omsApi}/activity/save`,
    method: "post",
    data
  });
}
// 导入活动并提交接口
export function saveSubmit(data) {
  return axios.request({
    url: `${api.omsApi}/activity/saveActivity`,
    method: "post",
    data
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