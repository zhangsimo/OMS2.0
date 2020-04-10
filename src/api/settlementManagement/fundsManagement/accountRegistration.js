// 账户登记表
import axios from "@/libs/api.request";
import api from "_conf/url";
//查询接口
export function findListPageAll(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/findListPageAll`,
    method: "get",
    params
  });
}
//新增接口
export function addData(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/add`,
    method: "post",
    data
  });
}
//修改接口
export function updateData(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/update`,
    method: "post",
    data
  });
}
//删除
export function deleterowData(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/deleteById`,
    method: "get",
    params
  });
}
