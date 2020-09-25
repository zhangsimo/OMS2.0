import axios from '@/libs/api.request'
import api from '_conf/url'
import {TOKEN_KEY} from "@/libs/util";
import Cookies from "js-cookie";
import {showLoading, hideLoading} from "@/utils/loading"


import {v4} from "uuid";
import Api from "_conf/url";
import Axios from 'axios'
//对账单 导出对账单
export  function accountStateExport(params){
  return `${api.omsSettle}/statement/master/export/page?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//对账单 导出对账单
export  function accountStateDetailExport(params){
  return `${api.omsSettle}/receivable/payable/export/document/details?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//收付款单查询 导出收付款单记录
export function colPayExportLogHis(params){
  return `${api.omsSettle}/payment/record/export/paymentDetail?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//收付款单查询 导出收付款单
export function colPayExportQuery(params){
 return `${api.omsSettle}/payment/record/export/paymentRecord?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//调拨出库明细  导出
export function allocationStockExport(params,data){
  let str="";
  for(var i in data){
    str+=`${i}=${data[i]}&`
  }
  //导出全部参数同查询接口
  //导出勾选参数为ids=选中id级分页参数
  if(data.type!="all"){
    params.map(vb=>{
      str+=`ids=${vb.id}&`
    })
  }
  return `${api.omsOrder}/allotOutMain/export/queryAllotOutMains?${str}access_token=${Cookies.get(TOKEN_KEY)}`
}
//调拨入库明细 导出
export function allocationWareHouseingExport(params) {
  return `${api.omsOrder}/allotEnterMain/export/queryAllotEnterMains?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//调出在途 导出
export function onWayExport(params) {
  return `${api.omsOrder}/allotOutMain/export/queryOnOrderStock?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//采购入库明细 导出 采购入库
export function enteralExport(params){
  return `${api.omsOrder}/enterMain/export/findEnterMain?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//采购入库明细 导出 采购退货
export function enteralReturnExport(params){
  return `${api.omsOrder}/outMain/export/findOutMainAll?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//销售订单明细 导出
export function salesExport(params){
  return `${api.omsOrder}/sellOrderMain/export/findByQuery?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//销售出库明细 导出 销售出库
export function stockExport(params){
  return `${api.omsOrder}/outMain/export/findOutMainAll?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//销售出库明细 导出 销售退货
export function stockReturnExport(params){
  return `${api.omsOrder}/enterMain/export/findEnterMain?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//应收应付 导出汇总
export function payColExportAll(params){
  return `${api.omsSettle}/receivable/payable/export/getPage?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//应收应付 导出单据明细
export function payColExportDetail(params){
  return `${api.omsSettle}/receivable/payable/export/sales/purchase?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//应收应付 月结对账 导出对账清单
export function payColMonthExportAcSta(params){
  return `${api.omsSettle}/accounts/receivable/export/in/business?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
//应收应付 月结对账 导出配件明细 勾选
export function payColMonthExportParts(params1,params2){
  return `${api.omsOrder}/pchsEnterMain/export/in/detail?aOrderCode=${params1}&bOrderCode=${params2}&access_token=${Cookies.get(TOKEN_KEY)}`
}
//应收应付 月结对账 导出配件明细 全部
export function payColMonthExportPartsAll(params){
  let str="";
  for(var i in params){
    str+=`${i}=${params[i]}&`
  }
  return `${api.omsOrder}/pchsEnterMain/export/in/detailAll?${str}access_token=${Cookies.get(TOKEN_KEY)}`
}
