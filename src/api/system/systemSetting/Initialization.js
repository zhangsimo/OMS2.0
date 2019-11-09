import axios from '@/libs/api.request'
import api from "_conf/url";

//初始化全部接口

//初始化导航
export function sysInitialize(params) {
  return axios.request({
    url: `${api.wmsApi}/sysInitialize/findAll`,
    method: 'get',
    params
  })
}

// *========= 备货级别设置 ==========*
// 左边内容
export function stockLevel(params) {
  return axios.request({
    url: `${api.wmsApi}/stockLevel/queryAll`,
    method: 'get',
    params
  })
}

//左边内容保存
export function stockLevelSave(data) {
  return axios.request({
    url: `${api.wmsApi}/stockLevel/save`,
    method: 'post',
    data
  })
}

//右边内容及分页
export function RightqueryAll(params) {
  return axios.request({
    url: `${api.wmsApi}/stockLevelPart/queryAll`,
    method: 'get',
    params
  })
}

//右边删除配件
// /stockLevelPart/delete
export function Delete(data) {
  return axios.request({
    url: `${api.wmsApi}/stockLevelPart/delete`,
    method: 'post',
    data
  })
}

// *========= 配件分类 ==========*
// 全部内容
export function classification(data) {
  return axios.request({
    url: `${api.wmsApi}/partType/findAllByTree`,
    method: 'post',
    data: data.data,
    params: data.params
  })
}

//上级分类下拉框
export function Select_class(data) {
  return axios.request({
    url: `${api.wmsApi}/partType/classify`,
    method: 'post',
    data
  })
}

//是否启用
export function Isdesabled(params) {
  return axios.request({
    url: `${api.wmsApi}/partType/disable`,
    method: 'get',
    params
  })
}

//新增
export function Add(data) {
  return axios.request({
    url: `${api.wmsApi}/partType/saveOrUpdate`,
    method: 'post',
    data
  })
}

//保存按钮
// stockLevelPart/save
export function stockLevelPartSave(data) {
  return axios.request({
    url: `${api.wmsApi}/stockLevelPart/save`,
    method: 'post',
    data
  })
}

// *========= 配件提成 ==========*
//table表格
export function findPageByDynamicQuery(data) {
  return axios.request({
    url: `${api.wmsApi}/deductPart/findPageByDynamicQuery`,
    method: 'post',
    data:data.data,
    params: data.params
  })
}

//删除配件
// delete
export function DeleteAccessories(data) {
  return axios.request({
    url: `${api.wmsApi}/deductPart/delete`,
    method: 'post',
    data:data
  })
}
//保存配件
// /deductPart/saveOrUpdate
export function saveOrUpdate(data) {
  return axios.request({
    url: `${api.wmsApi}/deductPart/saveOrUpdate`,
    method: 'post',
    data:data
  })
}
