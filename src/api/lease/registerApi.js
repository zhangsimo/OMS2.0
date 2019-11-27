import axios from '@/libs/api.request'
import api from "_conf/url";

// 注册管理全部信息及分页
export function getMessagelist (data) {
  return axios.request({
    url: `${api.omsApi}/trialRegister/queryAll`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}


//查询所有操作类型信息
export function findAllTenantType() {
  return axios.request({
    url: `${api.omsApi}/trialRegister/findAllTenantType`,
    method: 'post'
  })
}

//数据字典里审核租户信息
export function Reviewtenant(name) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCodeAllItem?dictCode=CS001`,
    method: 'get',
    name
  })
}

//数据字典里查询租户类型
export function findByCode(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCode`,
    method: 'get',
    params
  })
}

//审核状态
export function SHstate() {
  return axios.request({
    url: `${api.omsApi}/trialRegister/findAllStatus`,
    method: 'get'
  })
}

//更新注册信息
export function trialRegister(params) {
  return axios.request({
    url: `${api.omsApi}/trialRegister/save`,
    method: 'post',
    params
  })
}

//租户管理页面
//租户管理全部信息及分页
export function TenanInformation(data) {
  return axios.request({
    url: `${api.omsApi}/tenant/queryAll`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}

//根据条件查询行政规划
export function area(params) {
  return axios.request({
    url: `${api.omsProduct}/area/findAll`,
    method: 'get',
    params
  })
}

// http://192.168.30.181:9240/leaseOrder/queryAll?tenantId=0
export function aaa(params) {
  return axios.request({
    url: `${api.omsApi}/leaseOrder/queryAll`,
    method: 'get',
    contentType: "application/json; charset=utf-8",
    params
  })
}

//租户管理的类型
export function FindByItemCode(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findByItemCode`,
    method: 'get',
    data: params
  })
}

//租户管理修改确定按钮
export function Confirm(data) {
  return axios.request({
    url: `${api.omsApi}/tenant/save`,
    method: 'post',
    data
  })
}

//查看产品
export function Product(data) {
  return axios.request({
    url: `${api.omsApi}/tenantProduct/findPageByDynamicQuery`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}


//查看订单
export function Order(data) {
  return axios.request({
    url: `${api.omsApi}/tenantOrder/findPageByDynamicQuery`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}

//查看费用
export function Money(data) {
  return axios.request({
    url: `${api.omsApi}/tenantOrder/findById`,
    method: 'post',
    data:data.data,
    params:data.params
  })
}
