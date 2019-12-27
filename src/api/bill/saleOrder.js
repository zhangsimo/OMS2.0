import api from '_conf/url'
import axios from '@/libs/api.request'


// 销售订单明细
export function getOrderlist(data) {
    return axios.request({
        url: `${api.omsOrder}/sellOrderMain/findByQuery`,
        method: 'post',
        data
    })
}
// 销售订单配件明细
export function getPartList(data) {
    return axios.request({
        url: `${api.omsOrder}/sellOrderDetail/findPageByDynamicQuery`,
        method: 'post',
        data
    })
}
// 采购入库单查询/销售退货查询
export function getWarehousingList(data) {
    return axios.request({
        url: `${api.omsOrder}/enterMain/findEnterMain`,
        method: 'post',
        data
    })
}
// 采购入库配件查询
export function getWarehousingPart(params) {
    return axios.request({
        url: `${api.omsOrder}/enterDetail/details`,
        method: 'get',
        params
    })
}
// 销售退货单查询
export function getReturnGoodsList(data) {
    return axios.request({
        url: `${api.omsOrder}/enterMain/findOutMainSellRtn`,
        method: 'post',
        data
    })
}
// 销售退货配件查询
export function getReturnGoodsPart(params) {
    return axios.request({
        url: `${api.omsOrder}/enterDetail/details`,
        method: 'get',
        params
    })
}
// 采购退货单查询/销售出库单查询
export function getOutStockList(data) {
    return axios.request({
        url: `${api.omsOrder}/outMain/findOutMainAll`,
        method: 'post',
        data
    })
}
// 销售出库配件查询
export function getOutStockPart(params) {
    return axios.request({
        url: `${api.omsOrder}/outDetail/queryByMainId`,
        method: 'get',
        params
    })
}
// 在途库存明细查询
export function getOnWay(data) {
    return axios.request({
        url: `${api.omsOrder}/allotOutMain/queryOnOrderStock`,
        method: 'post',
        data
    })
}
// 收付款查询
export function getReceiptsPaymentsSummary(data) {
    return axios.request({
        url: `${api.omsSettle}/payment/record/queryRecordVerification`,
        method: 'post',
        data
    })
}
// 收付款明细接口
export function getReceiptsPaymentsList(params) {
    return axios.request({
        url: `${api.omsSettle}/payment/detail/findOmsPaymentDetail`,
        method: 'get',
        params
    })
}
// 调拨出库明细查询
export function transferStock(data) {
    return axios.request({
        url: `${api.omsOrder}/allotOutMain/queryAllotOutMains`,
        method: 'post',
        data
    })
}
// 调拨入库明细查询
export function transferWarehousing(data) {
    return axios.request({
        url: `${api.omsOrder}/allotEnterMain/queryAllotEnterMains`,
        method: 'post',
        data
    })
}

// 调拨出/入库配件明细查询
export function transferParts(params) {
    return axios.request({
        url: `${api.omsOrder}/allotOutDetail/findByMainId`,
        method: 'get',
        params
    })
}
// 分店名称
export function getStorelist() {
    return axios.request({
        url: `${api.wmsApi}/company/get/by/tenantid`,
        method: 'get'
    })
}
// 应收应付管理 
export function getreceivable(params) {
    return axios.request({
        url: `${api.omsSettle}/receivable/payable/get`,
        method: 'get',
        params
    })
}
// 应收应付销售/采购清单
export function getSalelist(params) {
    return axios.request({
        url: `${api.omsSettle}/receivable/payable/sales/purchase`,
        method: 'get',
        params
    })
}
// 出/入库明细
export function getNumberList(params) {
    return axios.request({
        url: `${api.omsOrder}/pchsEnterMain/findOrderDetail`,
        method: 'get',
        params
    })
}

// 月结对账
export function getReconciliation(params) {
    return axios.request({
        url: `${api.omsSettle}/accounts/receivable/get/reconciliation/business`,
        method: 'get',
        params
    })
}
// 月结对账选中结算
export function getSettlement(data) {
    return axios.request({
        url: `${api.omsSettle}/accounts/receivable/get/total/reconciliation`,
        method: 'post',
        data
    })
}
// 月结对账保存草稿/保存并提交
export function Preservation(data) {
    return axios.request({
        url: `${api.omsSettle}/accounts/receivable/add`,
        method: 'post',
        data
    })
}
// 对账单
export function AccountStatement(params) {
    return axios.request({
        url: `${api.omsSettle}/statement/master/page`,
        method: 'get',
        params
    })
}
// 收/付款单记录
export function Record(params) {
    return axios.request({
        url: `${api.omsSettle}/payment/record/get`,
        method: 'get',
        params
    })
}
// 应收单据明细和应付单据明细
export function detailsDocuments(params) {
    return axios.request({
        url: `${api.omsSettle}/receivable/payable/document/details`,
        method: 'get',
        params
    })
}
// 每日资金应收/付审核
export function capitalAudit() {
    return axios.request({
        url: `${api.omsSettle}/fund/review/get`,
        method: 'get'
    })
}
// 审核
export function examineBtn(data) {
    return axios.request({
        url: `${api.omsSettle}/fund/review/check`,
        method: 'post',
        data
    })
}
// 资金审核撤销
export function revokeBtn(data) {
    return axios.request({
        url: `${api.omsSettle}/fund/review/cancel`,
        method: 'post',
        data
    })
}

// 业务类型/收款账户
export function dictionaries(params) {
    return axios.request({
        url: `${api.omsProduct}/dictionaries/findByCode`,
        method: 'get',
        params
    })
}
// 收付款单号/本次核销编码单号生成
export function getId(params) {
    return axios.request({
        url: `${api.omsSettle}/generate`,
        method: 'get',
        params
    })
}
// 对账单结算接口
export function settlement(params) {
    return axios.request({
        url: `${api.omsSettle}/payment/record/get/account/no`,
        method: 'get',
        params
    })
}
// 收付款结算保存
export function settlementPreservation(data) {
    return axios.request({
        url: `${api.omsSettle}/payment/record/add`,
        method: 'post',
        data
    })
}
// 打印
export function Printing(params) {
    return axios.request({
        url: `${api.omsOrder}/pchsEnterMain/order/detail/print`,
        method: 'get',
        params
    })
}
// 对账单审核
export function accountRevoke(data) {
    return axios.request({
        url: `${api.omsSettle}/statement/master/update/draft`,
        method: 'post',
        data
    })
}
// 导出配件明细
export function reportParts(data){
    return axios.request({
        url: `${api.omsOrder}/pchsEnterMain/export/in/detail`,
        method: 'post',
        data
    })
}
// // 供应商类型树：  /supplierType/findType
// export function typeTree(params){
//     return axios.request({
//         url: `${api.omsOrder}/supplierType/findType`,
//         method: 'get',
//         params
//     })
// }
// // 根据条件查询供应商(分页)：/guest/queryAllSupplier
// export function typeSelect(params){
//     return axios.request({
//         url: `${api.omsOrder}/guest/queryAllSupplier`,
//         method: 'get',
//         params
//     })
// }