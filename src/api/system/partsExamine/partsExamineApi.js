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
    url: `${api.wmsApi}/partBrand/findPageByDynamicQuery`,
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
