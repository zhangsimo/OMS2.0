// 账户登记表
import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
//查询接口
export function findListPageAll(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/findListPageAll`,
    // url: `${api.omsSettle2}/omsFinanceAccountRegister/findListPageAll`,
    method: "get",
    params
  });
}
//导出接口
export function getPayablesExportsi(params){
  return `${api.omsSettle}/omsFinanceAccountRegister/export/findListPageAll?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//新增接口
export function addData(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/add`,
    // url: `${api.omsSettle2}/omsFinanceAccountRegister/add`,
    method: "post",
    data
  });
}
//修改接口
export function updateData(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/update`,
    // url: `${api.omsSettle2}/omsFinanceAccountRegister/update`,
    method: "post",
    data
  });
}
//删除
export function deleterowData(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/deleteById`,
    // url: `${api.omsSettle2}/omsFinanceAccountRegister/deleteById`,
    method: "get",
    params
  });
}

//连锁待分配款项显示门店_Pass
export function findAreaShopList(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/findAreaShopList`,
    // url: `${api.omsSettle2}/omsFinanceAccountRegister/findAreaShopList`,
    method: "get",
    params
  });
}
