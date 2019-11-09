import axios from '@/libs/api.request'
import api from '_conf/url'


// *========= 配件选择 ==========*
// tree
export function classification(data) {
  return axios.request({
    url: `${api.wmsApi}/partType/findAllByTree`,
    method: 'post',
    data
  })
}

//查询配件管理
// /attribute/queryAll
export function attributeQueryall(data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/queryAll`,
    method: 'post',
    params:data.params,
    data: data.data
  })
}

//配件品牌
export function partBrandFindall(data) {
  return axios.request({
    url: `${api.wmsApi}/partBrand/findAll`,
    method: 'post',
    data
  })
}
