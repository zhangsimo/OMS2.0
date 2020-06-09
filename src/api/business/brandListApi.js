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

//   预订单分页查询数据接口
export function getPageList (data) {
    return axios.request({
        url: `${api.omsOrder}/preOrderMain/queryAllAccept?page=${data.page - 1}&size=${data.size}`,
        method: 'post',
        data
    })
  }
//   采购配件分页查询数据接口
export function getPurchasePageList (data) {
  console.log(data)
  return axios.request({
      url: `${api.omsOrder}/preOrderDetail/queryAllPrePart?page=${data.page - 1}&size=${data.size}`,
      method: 'post',
      data
  })
}

//   预订单条件查询
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
// 代采购配件条件查询
export function pendingPurchaseSearch (data) {
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
      url: `${api.wmsApi}/company/get/by/tenantid`,
      method: "get",
      params
    });
  }

  // 票据类型接口
  export function PjType() {
    return axios.request({
      url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=CS00107`,
      method: "get",
    });
  }
  // 结算方式接口
  export function JsStyle() {
    return axios.request({
      url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=CS00106`,
      method: "get",
    });
  }
  // 查询往来单位
  export function activeCompany(data={}) {
    return axios.request({
      url: `${api.wmsApi}/guest/findAllSupplier`,
      method: "post",
      data
    });
  }
  // 新增采购订单保存接口
  export function savePreOrder(data) {
    return axios.request({
      url: `${api.omsOrder}/preOrderDetail/updatePrePart`,
      method: "post",
      data
    });
  }
  // 获取品牌信息
  export function getBrandIfo(data = { pageSize: 1000, page: 0 }) {
    return axios.request({
      url: `${api.omsOrder}/stPartBrand/getPartBrand`,
      method: "post",
      data
    });
  }

  // 受理接口
  export function accept(data) {
    return axios.request({
      url: `${api.omsOrder}/preOrderMain/acceptance`,
      method: "post",
      data
    });
  }


  //获取品牌
export function allBrand(data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: "post",
    data
  });
}
