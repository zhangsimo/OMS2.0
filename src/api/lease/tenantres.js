import axios from "@/libs/api.request";
import api from "_conf/url";

import {TOKEN_KEY} from "@/libs/util";
import Cookies from "js-cookie";


import {v4} from "uuid";
import Api from "_conf/url";
import Axios from 'axios'
export function getOmsAuth() {
  return axios.request({
    url: `${api.authApi}/resource/findRootRes?scope=oms`,
    method: "get",
  });
}

// 查询全部
export function getAll(params) {
    return axios.request({
      url: `${api.authApi}/resourceTenant/findRootResTenantList`,
      method: "get",
      params
    });
}

// 修改租户资源
export function updatetenant(data) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/update`,
      method: "post",
      data
    });
}

// 删除租户资源
export function deltenant(data) {
    return axios.request({
      url: `${api.omsApi}/tenantMenu/delete`,
      method: "post",
      data
    });
}

// 左侧树形图保存
export function addresource(data) {
    return axios.request({
      url: `${api.authApi}/role/updateModuleRole`,
      method: "post",
      data
    });
}

//判断租户是否存在
export function hasLessee(params) {
  return axios.request({
    url: `${api.authApi}/role/checkExistTenantModule`,
    method: "get",
    params
  });
}
//ding 租户http://192.168.15.65:5000/oms-lease-provider/tenantConfig/queryAll?tenantId=119&dictionariesConfigCode=TC_DINGTALK&configStatus=1
export function getDingTenantres(data,params){
  return axios.require({
    url:`${api.omsApi}/tenantConfig/queryAll`,
    method:"get",
    params
  })
}
