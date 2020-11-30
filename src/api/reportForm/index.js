import axios from "@/libs/api.request";
import api from "_conf/url";
import Axios from 'axios'
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseURL from '_conf/url'
import {v4} from "uuid";
// 供应商/往来单位
export function getSupplier(data={}) {
  return axios.request({
    url: `${api.wmsApi}/guest/findAllSupplier`,
    method: "post",
    data
  });
}

//获取全品牌
export function getParamsBrand(data) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/optPartBrand`,
    method: 'post',
    data
  })
}
//获取部分品牌
export function getParamsBrandPart(data) {
  return axios.request({
    url: `${api.omsOrder}/stPartBrand/getPartBrand`,
    method: 'post',
    data
  })
}

// 门店
export function getStorelist(params = {}) {
  return axios.request({
      url: `${api.wmsApi}/company/get/by/tenantid`,
      method: 'get',
      params
  })
}

//获取仓库
export function getWarehouse() {
  return axios.request({
    url: `${api.wmsApi}/comStore/stores/queryByOrgid`,
    method: "get",
  });
}

//获取客户
export function getClient () {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',
  })
}

// 每日销售统计
export function getDailySalesStatistics(data = {}, params) {
  let argument=data;
  argument.page=params.page;
  argument.size=params.size;
  return axios.request({
    url: `${api.omsBatch}/sellReport/report`,
    method: 'get',
    params:argument,
  })
}
//每日销售统计导出
export function getDailySalesStatisticsExport(params){
  return `${api.omsBatch}/sellReport/export?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
// 进销存排行
export function getSalesAndInventoryList(data = {}, params) {
  return axios.request({
    url: `${api.omsBatch}`,
    method: 'post',
    data,
    params,
  })
}


// 采购报表_采购订单明细
export function getPjPchsOrderMainDetailList(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsOrderMainDetailList`,
      method: 'post',
      data,
      params,
  })
}

// 采购报表_采购入库订单明细
export function getPjPchsEnterMainDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsEnterMainDetails`,
      method: 'post',
      data,
      params,
  })
}

// 采购报表_采购入库金额总和
export function getPjPchsEnterMainDetailsCount(data = {}, params) {
  return axios.request({
    url: `${api.omsBatch}/batchEdi/getPjPchsEnterMainDetailsCount`,
    method: 'post',
    data,
    params,
  })
}

// 采购报表_采购退货明细
export function getPjPchsRtnMainDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsRtnMainDetails`,
      method: 'post',
      data,
      params,
  })
}

// 采购报表_采购退货明细价格总表
export function findPjPchsRtnMainDetailsCount(data = {}, params) {
  return axios.request({
    url: `${api.omsBatch}/batchEdi/findPjPchsRtnMainDetailsCount`,
    method: 'post',
    data,
    params,
  })
}


// 采购报表_采购计划明细
export function getPjPchsPlanDetailList(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsPlanDetailList`,
      method: 'post',
      data,
      params,
  })
}
//采购排行分析 查询
export function getPurchaseReporAnalysis(data={},params){
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/getPjPchsEnterAnalyze`,
    method: 'post',
    data,
    params,
  })
}
//采购排行分析 导出
export function purchaseReporAnalysisExport(params){
  return `${api.omsBatch}?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
// 销售报表_销售订单明细
export function getPjSellOrderMainDetailList(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOrderMainDetailList`,
      method: 'post',
      data,
      params,
  })
}

//销售订单导出
// export const sellOrderListExport=`${api.omsBatch}`;



// 销售报表_销售出库明细
export function getPjSellOutMainDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOutMainDetails`,
      method: 'post',
      data,
      params,
  })
}

// 销售报表_销售退货明细表
export function getPjSellOutRtnMainDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOutRtnMainDetails`,
      method: 'post',
      data,
      params,
  })
}

// 销售报表_销售退货明细表金额统计
export function getPjSellOutRtnMainDetailsCount(data = {}, params) {
  return axios.request({
    url: `${api.omsBatch}/batchEdi/getPjSellOutRtnMainDetailsCount`,
    method: 'post',
    data,
    params,
  })
}

//销售排行分析
export function getPjSellAnalyze(data = {}, params){
  return axios.request({
    url: `${api.omsOrder}/sellOutMain/getPjSellAnalyze`,
    method: 'post',
    data,
    params,
  })
}
// 调拨报表_调拨入库明细
export function getAllotApplyDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotApplyDetails`,
      method: 'post',
      data,
      params,
  })
}

// 调拨报表_调拨出库明细
export function getAllotAcceptDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotAcceptDetails`,
      method: 'post',
      data,
      params,
  })
}

// 调拨报表_调入退货明细
export function getAllotAcceptRntDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotAcceptRntDetails`,
      method: 'post',
      data,
      params,
  })
}

// 调拨报表_调出退货明细
export function getAllotApplyRtnDetails(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotApplyRtnDetails`,
      method: 'post',
      data,
      params,
  })
}

// 调出在途信息
export function getOnOrderStock(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getOnOrderStock`,
      method: 'post',
      data,
      params,
  })
}
//调出在途信息 导出
export function onWayExport(params){
  return `${api.omsOrder}/allotOutMain/export/getOnOrderStock?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
// 加工报表_配件组装明细表_入库
export function getPartAssemblyEnter(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPartAssemblyEnter`,
      method: 'post',
      data,
      params,
  })
}

// 加工报表_配件组装明细表_出库
export function getPartAssemblyOut(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPartAssemblyOut`,
      method: 'post',
      data,
      params,
  })
}

// 加工报表_配件拆分明细表_入库
export function getPartSplitEnter(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPartSplitEnter`,
      method: 'post',
      data,
      params,
  })
}

// 加工报表_配件拆分明细表_出库
export function getPartSplitOut(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPartSplitOut`,
      method: 'post',
      data,
      params,
  })
}

// 移仓报表_移仓入库明细表
export function getStockShiftEnter(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getStockShiftEnter`,
      method: 'post',
      data,
      params,
  })
}

// 移仓报表_移仓出库明细表
export function getStockShiftOut(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getStockShiftOut`,
      method: 'post',
      data,
      params,
  })
}

// 盘点报表_盘亏出库明细表
export function getStockCheckLoss(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getStockCheckLoss`,
      method: 'post',
      data,
      params,
  })
}

// 盘点报表_盘盈入库明细表
export function getStockCheckProfit(data = {}, params) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getStockCheckProfit`,
      method: 'post',
      data,
      params,
  })
}
