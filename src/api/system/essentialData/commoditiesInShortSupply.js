import api from '_conf/url'
import axios from '@/libs/api.request'
import { TOKEN_KEY } from "@/libs/util";
import Cookies from "js-cookie";

//获取当前页信息
export function getTightProductList (params) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/queryAll`,
    method: 'get',
    params
  })
}

//删除紧俏品
export function getDeleteTight (data,params) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/delete`,
    method: 'post',
    data,
    params
  })
}

// 新增紧俏品
export function getSaveNewTight (data,params) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/save`,
    method: 'post',
    data,
    params
  })
}

//维保接口
export function getLocalList (params,data) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/queryTightAll`,
    method: 'post',
    params,
    data
  })
}

//wb云端配件接口
export function getCloudList (params) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/queryTightAll`,
    method: "get",
    params
  });
}

//管理员配件 不用
export function getGmList (params,data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/queryTightAll`,
    method: 'post',
    params,
    data
  })
}

//批量上传
export const getup = `${api.wmsApi}/tightPart/import`;

//下载模板
export function down(id) {
  // let url = `${api.downApi}/file/get?fileId=` + id;
  location.href = `${api.downApi}/file/get?fileId= ${id}&access_token=${Cookies.get(TOKEN_KEY)}`
  // window.open(url, '_blank');
}
