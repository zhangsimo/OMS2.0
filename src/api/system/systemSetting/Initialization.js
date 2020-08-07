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
    data:data.data,
    params:data.params
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

// *========= 自定义分类设置 ==========*
// /dictionaries/findByCustomAll
export function findByCustomAll(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCustomAll`,
    method: 'get',
    params
  })
}

//保存
// /dictionaries/saveCustom
export function saveCustom(data) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/saveOrUpdate`,
    method: 'post',
    data
  })
}

// *========= 配比清单 ==========*
// 配比清单左内容
export function partMatching(params) {
  return axios.request({
    url: `${api.wmsApi}/partMatching/queryAll`,
    method: 'get',
    params
  })
}

// 配比清单保存
export function partMatchingSave(data) {
  return axios.request({
    url: `${api.wmsApi}/partMatching/save`,
    method: 'post',
    data
  })
}

// 配比清单右边内容
// /partMatchingDetail/queryAll
export function partMatchingDetail(params) {
  return axios.request({
    url: `${api.wmsApi}/partMatchingDetail/queryAll`,
    method: 'get',
    params
  })
}

// 删除配件
// /partMatchingDetail/delete
// export function partMatchingdelete(data) {
//   return axios.request({
//     url: `${api.wmsApi}/partMatchingDetail/delete`,
//     method: 'post',
//     data:data
//   })
// }

//添加/修改/删除物料
// /partMatchingDetail/save
export function partMatchingDetailSave(data) {
  return axios.request({
    url: `${api.wmsApi}/partMatchingDetail/save`,
    method: 'post',
    data:data
  })
}

// *========= 配件品牌 ==========*
// /partBrand/findAll
// 配件品牌/品质查询
export function findAllByTree(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrand/findAllByTree`,
    method: 'post',
    data:data
  })
}

//已关注品牌
// /partBrandOrg/findAll
export function partBrandOrg(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrandOrg/findAll`,
    method: 'post',
    data:data
  })
}

//新增关注品牌
// /partBrandOrg/findByOrgid
export function findByOrgid(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrandOrg/findByOrgid`,
    method: 'post',
    data:data
  })
}

//保存关注品牌
// /partBrandOrg/saveOrUpdate
export function partBrandOrgSaveOrUpdate(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrandOrg/saveOrUpdate`,
    method: 'post',
    data:data
  })
}
//删除关注品牌
// /partBrandOrg/deleteAll
export function partBrandOrgDeleteAll(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrandOrg/deleteAll`,
    method: 'post',
    data:data
  })
}

//*===========品牌车型==============*
//获取所有车品牌
export function getCarBrandAll(data) {
  return axios.request({
    url: `${api.omsProduct}/carBrand/queryByConditions`,
    method: 'post',
    data:data
  })
}

//获取所有车品牌
export function getwbCarBrandAll(data) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getBrands`,
    method: 'post',
    data:data
  })
}

//获取车型
export function getCarModel(data) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getCarModel`,
    method: 'post',
    data:data
  })
}

//获取车系
export function getCarSeries(data) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getCarSeries`,
    method: 'post',
    data:data
  })
}

// 添加物料弹窗
export function getPart(data) {
  return axios.request({
    url:`${api.wmsApi}/wbParts/findForMatching`,
    method:'post',
    data
  })
}