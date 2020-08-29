import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页信息
export function getClientTreeList (params) {
  return axios.request({
    url: `${api.wmsApi}/guestType/guestTypeList`,
    method: 'get',
    params
  })
}


//新增客户分类
export function getAddClient (data) {
  return axios.request({
    url: `${api.wmsApi}/guestType/saveOrUpdate`,
    method: 'post',
    data
  })
}

//导入文件地址
export const impUrl = `${api.wmsApi}/guestAdjust/import`

//右侧list
export function getCustomerInformation (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryGuestList`,
    method: 'get',
    params
  })
}


//获取数字字典内的信息
export function getDigitalDictionary (data) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findByDictCodeList?`,
    method: 'post',
    data
  })
}

//新增客户资料
export function getNewClient (data) {
  return axios.request({
    url: `${api.wmsApi}/guest/saveGuestInfo?`,
    method: 'post',
    data
  })
}

//获取点击到客户详细资料
export function getCustomerDetails (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findById`,
    method: 'get',
    params
  })
}
// 检测客户全称
export function getCustomer(params) {
  return axios.request({
    url:`${api.wmsApi}/guest/checkByFullName`,
    method:'get',
    params
  })
}
//账户类型
export function getAccountType() {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=ZHLX`,
    method: "get",
  });
}

//删除申请单
export function deleteBatch(data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/deleteBatch`,
    method: "post",
    data
  });
}
