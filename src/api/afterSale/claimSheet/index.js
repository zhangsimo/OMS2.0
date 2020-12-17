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
//向供应商理赔登记 打印接口
export function print(params){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/print`,
    method:"get",
    params
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
export function registerPartsProcesLog(params){
  return axios.request({
    url:`${api.omsOrder}/afterSaleRecord/findafterSaleRecordDetail`,
    method:"get",
    params
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
//向供应商理赔登记 提交
export function registerClaimSubmit(data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutMain/preservationUpdate`,
    method:"post",
    data
  })
}



//=======供应商理赔处理
//供应商理赔处理 查询接口
export function supplierClaimSettlementQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutDetail/findafterSaleOutDetail`,
    method:"post",
    params,
    data
  })
}
//供应商理赔处理  原货退还/换货处理/退货处理/原物销毁
export function supplierClaimSettlement(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleMain/claimSettlement`,
    method:"post",
    params,
    data
  })
}
