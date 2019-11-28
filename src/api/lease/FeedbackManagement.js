import axios from "@/libs/api.request";
import api from "_conf/url";
import Axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";

//反馈管理全部及分页
export function allMessage(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/queryAll`,
    method: "get",
    // data:data.data,
    params
  });
}
//查看接口
export function findItem(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/findItem`,
    method: "post",
    // data:data.data,
    params
  });
}
//标记为已读接口
export function ready(params) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/change`,
    method: "post",
    params
  });
}

//反馈管理新增接口
// /feedbackRecord/save
export function feedbackRecord(data) {
  return axios.request({
    url: `${api.omsApi}/feedbackRecord/save`,
    method: "post",
    data
  });
}


// 图片上传地址
export const putImgUrl = api.uploadApi;
export function up(formData) {
  let param = new FormData();
  param.append("file", formData);
  let headers = { "Content-Type": "multipart/form-data" };
  headers["authorization"] = "Bearer " + Cookies.get(TOKEN_KEY);
  return Axios.post(putImgUrl, param, { headers });
}
