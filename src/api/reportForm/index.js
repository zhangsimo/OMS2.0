import axios from "@/libs/api.request";
import api from "_conf/url";

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
    method: "get"
  });
}

//获取客户
export function getClient () {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',

  })
}

// 采购报表_采购订单明细
export function getPjPchsOrderMainDetailList(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsOrderMainDetailList`,
      method: 'post',
      data
  })
}

// 采购报表_采购入库订单明细
export function getPjPchsEnterMainDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsEnterMainDetails`,
      method: 'post',
      data
  })
}

// 采购报表_采购退货明细
export function getPjPchsRtnMainDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsRtnMainDetails`,
      method: 'post',
      data
  })
}

// 采购报表_采购计划明细
export function getPjPchsPlanDetailList(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjPchsPlanDetailList`,
      method: 'post',
      data
  })
}

// 销售报表_销售订单明细
export function getPjSellOrderMainDetailList(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOrderMainDetailList`,
      method: 'post',
      data
  })
}

// 销售报表_销售出库明细
export function getPjSellOutMainDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOutMainDetails`,
      method: 'post',
      data
  })
}

// 销售报表_销售退货明细表
export function getPjSellOutRtnMainDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getPjSellOutRtnMainDetails`,
      method: 'post',
      data
  })
}

// 调拨报表_调拨入库明细
export function getAllotApplyDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotApplyDetails`,
      method: 'post',
      data
  })
}

// 调拨报表_调拨出库明细
export function getAllotAcceptDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotAcceptDetails`,
      method: 'post',
      data
  })
}

// 调拨报表_调入退货明细
export function getAllotAcceptRntDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotAcceptRntDetails`,
      method: 'post',
      data
  })
}

// 调拨报表_调出退货明细
export function getAllotApplyRtnDetails(data = {}) {
  return axios.request({
      url: `${api.omsBatch}/batchEdi/getAllotApplyRtnDetails`,
      method: 'post',
      data
  })
}