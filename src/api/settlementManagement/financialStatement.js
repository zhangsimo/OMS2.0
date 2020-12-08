import axios from "@/libs/api.request";
import api from "_conf/url";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
// 会计审核

// 会计审核查询
export function findCertificationAudit(params) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findCertificationAudit`,
    method: "get",
    params
  });
}

// 审核
export function certificationAudit(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/certificationAudit`,
    method: "post",
    data
  });
}

// 撤销审核
export function certificationAuditRevocation(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/certificationAuditRevocation`,
    method: "post",
    data
  });
}

// 资金统计表
export function findListPageAllReport(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountStatistical/findCashStatisticalReportStatements`,
    method: "get",
    params
  });
}
//资金统计表的导出
export function getPayablesExportwu(params){
  return `${api.omsSettle}/omsFinanceAccountStatistical/export/findCashStatisticalReportStatements?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}

// 费用报销管理 查询
export function findByDynamicQuery(params, data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceCostReimbursement/findByDynamicQuery`,
    method: "post",
    params,
    data,
  });
}

// 费用报销管理 撤回
export function paymentRevoke(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceCostReimbursement/paymentRevoke`,
    method: "post",
    data,
  });
}

// 费用报销管理 认领
export function addClaim(data) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceCostReimbursement/addClaim`,
    method: "post",
    data,
  });
}
//现金流量表导出 
export function getPayablesExportsix(params){
  return `${api.omsSettle}/omsFinanceAccountCashFlow/export/findCashFlowReportStatements?${params}access_token=${Cookies.get(TOKEN_KEY)}`
}
// 现金流量表 查询
export function findListPageAllCashFlow(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountCashFlow/findListPageAllReport`,
    method: "get",
    params,
  });
}

// 现金流量表 查询
export function findListPageAllCashFlowChange(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountCashFlow/findCashFlowReportStatements`,
    method: "get",
    params,
  });
}
