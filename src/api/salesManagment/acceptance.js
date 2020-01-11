import axios from '@/libs/api.request'
import api from '_conf/url'

//获取上表格数据
export function getTopList (num,page,data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAllAccept?page=${page}&size=${num}`,
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
//获取公司信息
export function selectCompany(params) {
    return axios.request({
      url: `${api.wmsApi}/company/get/by/tenantid`,
      method: "get",
      params
    });
  }

//生成采购订单
export function newPurchaseOrder(data) {
    return axios.request({
      url: `${api.omsOrder}/guestOrderMain/complete`,
      method: "post",
        data
    });
  }
