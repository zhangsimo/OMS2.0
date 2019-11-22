import api from '_conf/url'
import axios from '@/libs/api.request'

// 预订单受理页面数据接口
export function getBrandList (data={}) {
    return axios.request({
        url: `${api.omsOrder}/preOrderMain/queryAllAccept`,
        method: 'post',
        data
    })
  }

//   分页查询数据接口
export function getPageList (data) {
    return axios.request({
        url: `${api.omsOrder}/preOrderMain/queryAllAccept?page=${data.page - 1}&size=${data.size}`,
        method: 'post',
        data
    })
  }

//   根据条件查询
export function searchBrandList (data) {
    return axios.request({
        url: `${api.omsOrder}/preOrderMain/queryAllAccept`,
        method: 'post',
        data
    })
  }

//   公司信息数据接口
export function selectCompany(params) {
    return axios.request({
      url: `${api.passportApi}/group/findRootByPid`,
      method: "get",
      params
    });
  }