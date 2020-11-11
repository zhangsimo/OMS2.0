import axios from "@/libs/api.request";
import api from "_conf/url";
// 级别定义-保存
export function sellPsSave(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceStrategy/save`,
    method: "post",
    data
  });
}

// 级别定义-获取
export function sellPsList() {
  return axios.request({
    url: `${api.wmsApi}/sellPriceStrategy/findByTenantId`,
    method: "post",
    data: {}
  });
}

// 切换价格启用禁用
export function tabPriceEnable(params) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceStrategy/changeState`,
    method: "get",
    params
  });
}

// 保存客户
export function sellcussave(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceGuest/save`,
    method: "post",
    data
  });
}

// 获取客户分页
export function findAllCus(params, data) {
  return axios.request({
    url: `${api.wmsApi}/sellPriceGuest/findAll`,
    method: "post",
    params,
    data
  });
}

// 配件分页查询
export function queryPart(params, data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/findPartPrice`,
    method: "post",
    params,
    data
  });
}

// 统一售价配件保存
export function partPriceSave(data) {
  return axios.request({
    url: `${api.wmsApi}/partPrice/save`,
    method: "post",
    data
  });
}

// 普通配件保存
export function partLevelSave(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/save`,
    method: "post",
    data
  });
}

// area
export function area(params) {
  return axios.request({
    url: `${api.omsProduct}/area/findAll`,
    method: "get",
    params
  });
}

// 导入配件表格
// export function impUrl(data) {
//   return axios.request({
//     url:`${api.wmsApi}/sellPricePart/import`,
//     methods:"post",
//     data
//   })
// }
// export const impUrl = `${api.wmsApi}/sellPricePart/import`
export const impUrl = `${api.wmsApi}/sellPricePart/import`
//多级别价格导入
export const morePriceUrl=`${api.wmsApi}/sellPriceStrategy/import/SellPrice`
// 添加配件
export function getwbParts(data) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/findForPartPrice?page=${data.page}&size=${data.size}`,
    method: "post",
    data
  });
}

// 弹框组件添加配件
export function addWbParts(params,data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/savePart`,
    method: "post",
    data,
    params
  });
}

// 删除配件最低价格配件数据
export function deleteLastPricePart(data) {
  return axios.request({
    url: `${api.wmsApi}/partPrice/deleteAll`,
    method: "post",
    data
  });
}

// 删除配件价格配件数据
export function deletePricePart(data) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/deleteAll`,
    method: "post",
    data
  });
}
