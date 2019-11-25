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
// 待采购配件页面接口
export function pendingPurchase (data={}) {
  return axios.request({
      url: `${api.omsOrder}/preOrderDetail/queryAllPrePart`,
      method: 'post',
      data
  })
}
// 生成待采购订单
export function generateOrder (data) {
  return axios.request({
      url: `${api.omsOrder}/preOrderDetail/updatePrePart`,
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

  // 票据类型接口
  export function PjType() {
    return axios.request({
      url: `${api.omsProduct}/dictionariesItem/findByDictCode?dictCode=CS00107`,
      method: "get",
    });
  }
  // 结算方式接口
  export function JsStyle() {
    return axios.request({
      url: `${api.omsProduct}/dictionariesItem/findByDictCode?dictCode=CS00106`,
      method: "get",
    });
  }
  // 查询往来单位
  export function activeCompany() {
    return axios.request({
      url: `${api.wmsApi}/guest/findAllSupplier`,
      method: "post",
    });
  }
  // 新增采购订单保存接口
  export function savePreOrder(data) {
    return axios.request({
      url: `${api.omsOrder}/preOrderMain/save`,
      method: "post",
      data
    });
  }
