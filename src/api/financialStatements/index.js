import axios from "@/libs/api.request";
import api from "_conf/url";

// 区域资产负债表查询
export function areaBalanceSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/areaBalanceSheet`,
    method: "get",
    params
  });
}

// 门店资产负债表查询
export function shopBalanceSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/shopBalanceSheet`,
    method: "get",
    params
  });
}

// 集团资产负债表查询
export function groupBalanceSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/groupBalanceSheet`,
    method: "get",
    params
  });
}

// 门店利润表查询
export function shopProfitSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/shopProfitSheet`,
    method: "get",
    params
  });
}

// 区域利润表查询
export function areaProfitSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/areaProfitSheet`,
    method: "get",
    params
  });
}

// 集团利润表查询
export function groupProfitSheet(params){
  return axios.request({
    url: `${api.omstaxset}/statement/groupProfitSheet`,
    method: "get",
    params
  });
}

// 查询可用帐套列表（当前用户门店区域下的全部门店帐套
export function findAccountCompanyPage(){
  return axios.request({
    url: `${api.omstaxset}/finance/accountSet/findAreaShopList`,
    method: "get"
  });
}
//${api.wmsApi}/company/queryAll
export function getSupplierformation (params) {
  return axios.request({
    url: `${api.wmsApi}/company/queryAll`,
    method: 'get',
    params
  })
}

// 区域
export function getSupplierTreeList (params) {
  return axios.request({
    url: `${api.wmsApi}/companyArea/findAll`,
    method: 'get',
    params
  })
}
