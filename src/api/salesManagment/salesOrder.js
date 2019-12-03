import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧数据
export function getLeftList (num , page,data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/queryPageByDynamicQuery?page=${num}&size=${page}`,
    method: 'post',
    data
  })
}


//获取客户
export function getClient () {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',

  })
}

//获取品牌
export function getBrandList (data) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getPartBrand`,
    method: 'post',
    data
  })
}

//获取右侧的数据
export function getRightList (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/findById`,
    method: 'get',
    params
  })
}

//获取右侧额度
export function getLimit  (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/findGuestAmt`,
    method: 'get',
    params
  })
}

//交货仓库list
export function getWarehouseList (params) {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
    params
  })
}

//点击打开详情级别价格
export function getDetails  (params) {
  return axios.request({
    url: `${api.wmsApi}/sellPricePart/findBySell`,
    method: 'get',
    params
  })
}
