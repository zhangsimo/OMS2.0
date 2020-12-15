import axios from '@/libs/api.request'
import api from '_conf/url'

//=======客户理赔登记
//=======客户理赔处理
//=======向供应商理赔登记

//左侧列表数据查询接口 Register claims with supplier
export function registerClaimsQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/findPageByDynamicQuery`,
    method:"post",
    params,
    data
  })
}
//客户理赔登记单的查询接口
export function customerClaimQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/findAfterSaleEnterDetail`,
    method:"post",
    params,
    data
  })
}
//客户理赔登记单 整单选入
export function allCustomerClaim(data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/mainChoice`,
    method:"post",
    data
  })
}
//右侧 配件理赔 处理日志
export function registerPartsProcesLog(params,data){
  return axios.request({
    url:`${api.omsOrder}`,
    method:"post",
    params,
    data
  })
}
//向供应商理赔登记保存
export function registerClaimSave(data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/preservationSave`,
    method:"post",
    data
  })
}




//=======供应商理赔处理
//供应商理赔处理 查询接口
export function supplierClaimSettlementQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}`,
    method:"post",
    params,
    data
  })
}
//供应商理赔处理  原货退还/换货处理/退货处理/原物销毁
export function supplierClaimSettlement(params,data){
  return axios.request({
    url:`${api.omsOrder}`,
    method:"post",
    params,
    data
  })
}
