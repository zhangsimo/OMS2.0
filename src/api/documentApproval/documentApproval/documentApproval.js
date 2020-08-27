//===================== 申请单 ===============================
import axios from '@/libs/api.request'
import api from '_conf/url'

//主列表查询
export function findPageByDynamicQuery (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findPageByDynamicQuery`,
    method: 'get',
    params
  })
}

//查询当前点击列表内信息
//主列表查询
export function getThisAllList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findById`,
    method: 'get',
    params
  })
}

//判断是否为总部
// http://192.168.2.48:5200/staff/findUserShopKeeper?tenantId=1217653291045625856&shopId=1242781690831372288
export function findUserShopKeeper (params) {
  return axios.request({
    url: `${api.authApi}/staff/findUserShopKeeper`,
    method: 'get',
    params
  })
}

//获取申请单盘亏出库
export function findByCodeDetail (params) {
  return axios.request({
    url: `${api.omsOrder}/StockCheckMain/findByCode`,
    method: 'get',
    params
  })
}

//获取采购计划详情
export function findGoodsByCodeDetail (params) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanMain/findByCode`,
    method: 'get',
    params
  })
}

//获取临时采购，外采详情
export function findLsOrWcDetail (params) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/findByCode`,
    method: 'get',
    params
  })
}

//获取活动申请
export function findActivty (params) {
  return axios.request({
    url: `${api.wmsApi}/activity/findByCode`,
    method: 'get',
    params
  })
}


//获取仓库
export function findByStore(){
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: 'get',
  })
}

//获取票据类型
export function getBillType(data){
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findByDictCodeList`,
    method: 'post',
    data
  })
}

//获取客户信用调查详情
export function findCreditDetail (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findByCode`,
    method: 'get',
    params
  })
}

//获取客户信用额度详情
export function findQuotaDetail (params) {
  return axios.request({
    url: `${api.wmsApi}/guestAdjust/findByCode`,
    method: 'get',
    params
  })
}

//获取供应商资料详情
export function findSupplerDetail (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findByProcessInstanceId`,
    method: 'get',
    params
  })
}


//模糊查询获取查询的数据
export function getBackList (params) {
  return axios.request({
    url: `${api.authApi}/staffaccount/queryAll`,
    method: 'get',
    params
  })
}
//guest/findByGuestShortName获取往来单位
export function getGuestShortName(params) {
  return axios.request({
    url:`${api.wmsApi}/guest/findByGuestShortName`,
    method:"get",
    params
  })
}


//获取当前门店下的付款账号
export  function getPayAccount(params) {
  return axios.request({
    url:`${api.omsSettle}/omsFinanceAccountRegister/findFinanceAccount`,
    method:"get",
    params
  })
}
