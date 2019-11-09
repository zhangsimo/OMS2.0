import axios from "@/libs/api.request";
import api from "_conf/url";

// 查询是否存在草稿
export function getLog() {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLog/findByStatus`,
    method: "get",
  });
}

// 新增/修改草稿
export function sysUpdateLog(data) {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLog/save`,
    method: "post",
    data
  });
}

// 发布日志
export function saveLog(data) {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLog/saveLog`,
    method: "post",
    data
  });
}

// 查询系统更新日志(分页)
export function getAllLog(params) {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLog/queryAll`,
    method: "get",
    params
  });
}

// 根据id获取日志
export function getLogbyId(params) {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLog/findById`,
    method: "get",
    params
  });
}



// 判段是否需要弹出最新日志
export function getNotice() {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLogDetail/findByLog`,
    method: "get",
  });
}

// 添加用户知晓
export function know(data) {
  return axios.request({
    url: `${api.omsApi}/sysUpdateLogDetail/save`,
    method: "post",
    data
  });
}