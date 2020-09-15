import api from '_conf/url'
import axios from '@/libs/api.request'

//获取配件审核标定
export function getExamineList(params) {
  return axios.request({
    url: `${api.wmsApi}/partApply/queryAll`,
    method: 'get',
    params
  })
}

//获取配件审核标定
export function getExamineDetail(params) {
  return axios.request({
    url: `${api.wmsApi}/partApply/findById`,
    method: 'get',
    params
  })
}

//获取全部配件品牌
export function getAllBrand(data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: 'post',
    data
  })
}

//获取全品牌
export function getParamsBrand(data) {
  return axios.request({
    url: `${api.wmsApi}/optGroup/optPartBrand`,
    method: 'post',
    data
  })
}
//获取全部车型
export function getAllCar(data) {
  return axios.request({
    url: `${api.wmsApi}/carBrand/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}

//获取全部自定义分类
export function getAllCustom() {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCustomAll`,
    method: 'get'
  })
}


//提交审批
export function setApproval(data) {
  return axios.request({
    url: `${api.wmsApi}/partApply/approval`,
    method: 'post',
    data
  })
}

//获取系统分类
export function getCarClassifys(data) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getCarClassifys`,
    method: 'post',
    data
  })
}

//获取标准名称
export function getCarPartName(params, data) {
  return axios.request({
    url: `${api.omsProduct}/partName/queryByConditions`,
    method: 'post',
    params,
    data
  })
}


//申请配件保存
export function savePartInfo(data) {
  return axios.request({
    url: `${api.wmsApi}/partApply/save`,
    method: 'post',
    data
  })
}


//   配件详情
export function getParticulars(params) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyDetail/findApplyDetails`,
    method: 'get',
    params
  })
}

//  调拨入库新增配件详情
export function getDBRKPartDetail(params) {
  return axios.request({
    url: `${api.omsOrder}/allotOutDetail/queryAll`,
    method: 'get',
    params
  })
}


