import axios from '@/libs/api.request'
import api from '_conf/url'
//-----客户理赔登记
//查询
export function getListSale(params,data){
    return axios.request({
      url:`${api.omsOrder}/afterSaleMain/findGuestClaimMain`,
      method:"post",
      params,
      data
    })
  }
  //保存
  export function saveSale(data){
    return axios.request({
      url:`${api.omsOrder}/afterSaleMain/guestClaimSave`,
      method:"post",
      data
    })
  }
  //对印
  //guestClaimPrint
  export function printSale(params){
    return axios.request({
      url:`${api.omsOrder}/afterSaleMain/guestClaimPrint`,
      method:"get",
      params
    })
  }
  //提交
  export function submitSale(data){
    return axios.request({
      url:`${api.omsOrder}/afterSaleMain/guestClaimSubmit`,
      method:"post",
      data
    })
  }
  //客户处理查询:
  export function CustomerprocessingQuery(params,data){
    return axios.request({
      url:`${api.omsOrder}/afterSaleDetail/findAllAfterSale`,
      method:"post",
      params,
      data
    })
  }
  //客户理赔处理
  export function Customerprocessing(params,data){
    return axios.request({
      url:`${api.omsOrder}/afterSaleOutMain/customerClaimProcessing`,
      method:"post",
      params,
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
//导入
// /afterSaleMain/import/partId
export const getup = `${api.omsOrder}/afterSaleMain/import/partId`;
//客户理赔处理查询
// afterSaleOutDetail/findAllAfterSaleDetail
export function getKuquery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutDetail/findAllAfterSaleDetail`,
    method:"post",
    params,
    data
  })
}
