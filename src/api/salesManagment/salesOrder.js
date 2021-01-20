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
//获取销售员
export function getSales () {
  return axios.request({
    url: `${api.authApi}/tenantUsers/findAllPlanner?&size=10000&page=0&userName=&phone=&office=0`,
    method: 'get',

  })
}

// 获取退货员和创建人
export function getCRman () {
  return axios.request({
    url: `${api.authApi}/tenantUsers/queryAll?&size=10000&page=0&userName=&phone=&office=0`,
    method: 'get',

  })
}

//获取品牌
export function getBrandList (data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
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
    url: `${api.wmsApi}/comStore/findStoreByShopCode`,
    method: 'get',
    params
  })
}

//点击打开详情级别价格
export function getDetails  (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOutDetail/check`,
    method: 'get',
    params
  })
}

//保存
export function getSave (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/saveSellOrder`,
    method: 'post',
    data
  })
}

//出库
export function getStockOut (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/stockOut`,
    method: 'post',
    data
  })
}

//提交
export function getSubmitList (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/comfirmSubmitSellOrder`,
    method: 'post',
    data
  })
}

//打印
export function getprintList (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/print`,
    method: 'get',
    params
  })
}
//打印拣货单
export function getPrintPickUpList(params){
  return axios.request({
    url: `${api.omsOrder}/`,
    method: 'get',
    params
  })
}

//作废
export function getCancellation (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/invalidSellOrder`,
    method: 'post',
    data
  })
}

//反作废
export function resetCancellation (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/reverseInvalidSellOrder`,
    method: 'post',
    data
  })
}


//返单
export function getReorder (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/backSellOrder`,
    method: 'post',
    data
  })
}

//导出
// export function getExport (params) {
// //   return axios.request({
// //     url: `${api.omsOrder}/sellOrderMain/export`,
// //     method: 'get',
// //     params
// //   })
// // }

//客户选择
export function getTreeClient (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryGuestList?`,
    method: 'get',
    params
  })
}

//客户类型
export function getClientType () {
  return axios.request({
    url: `${api.wmsApi}/guestType/guestTypeTree`,
    method: 'get',

  })
}

//添加配件
export function getAccessories (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderMain/saveSellOrder`,
    method: 'post',
    data
  })
}
//删除配件
export function getDeleteList (data) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/delete`,
    method: 'post',
    data
  })
}


//批量导入地址 编码品牌导入
export const getup = `${api.omsOrder}/sellOrderMain/import?`;
//内码导入配件
export const getupInnerId=`${api.omsOrder}/sellOrderMain/import/partId?`
//批次配件
export function getParnt (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/chooseBatch`,
    method: 'get',
    params
  })
}

//活动数据
export function getActivity (params) {
  return axios.request({
    url: `${api.wmsApi}/activityPart/queryAll?`,
    method: 'get',
    params
  })
}

//活动数据-弹层
export function getActivityLayer (params) {
  return axios.request({
    url: `${api.wmsApi}/activityDetail/queryAll?`,
    method: 'get',
    params
  })
}


//选择入库单数据
export function getGodown (params) {
  return axios.request({
    url: `${api.omsOrder}/sellOrderDetail/chooseEnter?`,
    method: 'get',
    params
  })
}
//获取供应商
export function getSupplier (data) {
  return axios.request({
    url: `${api.wmsApi}/guest/findAllSupplier`,
    method: 'post',
    data
  })
}

// 获取配件-采退
export function getParts (params) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail/addParts`,
    method: 'get',
    params
  })
}

// 获取配件-调入退回申请
export function getPartsBackApply (params) {
  return axios.request({
    url: `${api.omsOrder}/enterDetail/chooseParts`,
    method: 'get',
    params
  })
}

// 获取配件-销退
export function getSaleParts (params) {
  return axios.request({
    url: `${api.omsOrder}/outDetail/addParts`,
    method: 'get',
    params
  })
}

// 获取对方库存
export function partStock (data) {
  return axios.request({
    url: `${api.omsSotck}/partStoreStock/partStock`,
    method: 'post',
    data
  })
}

// 生成调拨单
export function allotApplySave (data) {
  return axios.request({
    url: `${api.omsOrder}/allotApplyMain/save`,
    method: 'post',
    data
  })
}

// 是否紧俏品
export function findAllByDTO (data) {
  return axios.request({
    url: `${api.wmsApi}/tightPart/findAllByDTO`,
    method: 'post',
    data
  })
}
