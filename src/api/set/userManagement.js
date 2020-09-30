import axios from "@/libs/api.request";
import api from "_conf/url";

// 查询账套信息
export function getAccountSetList(params) {
  return axios.request({
    url: `${api.omstaxset}/finance/accountSet/findByDynamicQuery`,
    method: "get",
    params
  });
}

//删除表内数据
export function deleAccount(params) {
  return axios.request({
    url: `${api.omstaxset}/finance/accountSet/delete`,
    method: "get",
    params
  });
}

//本位币数据
export function getMoney(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=STANDARD_MONEY_TYPE`,
    method: "get",
    params
  });
}

//门店数据
export function getShop(params) {
  return axios.request({
    url: `${api.wmsApi}/company/findByTenantId`,
    method: "get",
    params
  });
}

// 新增账套
export function saveAccount(data) {
  return axios.request({
    url: `${api.omstaxset}/finance/accountSet/saveOrUpdate`,
    method: "post",
    data
  });
}

//获取全连锁销售情况
export function allmoneyList(params) {
  return axios.request({
    url: `${api.omsOrder}/report/salesReport`,
    method: "get",
    params
  });
}
