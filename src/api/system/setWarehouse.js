import api from '_conf/url'
import axios from '@/libs/api.request'

//获取左侧仓库
export function getwarehouse (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

//新增左侧仓库
export function getNewWarehouse (data) {
  return axios.request({
    url: `${api.wmsApi}/comStore/save`,
    method: 'post',
    data
  })
}

//右侧仓位显示
export function getWarehouseList (params) {
  return axios.request({
    url: `${api.wmsApi}/storeLocation/locations/${params}`,
    method: 'get',
  })
}
//右侧仓位保存
export function getSaveWarehouse (data) {
  return axios.request({
    url: `${api.wmsApi}/storeLocation/locations/save`,
    method: 'post',
    data
  })
}


//禁用
export function getAddWarehouse (data) {
  return axios.request({
    url: `${api.wmsApi}/storeLocation/location/forbid?id=${data.id}`,
    method: 'put',
  })
}
