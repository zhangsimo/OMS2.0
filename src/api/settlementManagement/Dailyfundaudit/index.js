// 账户登记表
import axios from "@/libs/api.request";
import api from "_conf/url";

// 应收审核
function table1(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findReceivablesAudit`,
    method: "get",
    params,
  });
}
// 应付审核
function table2(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findDealAudit`,
    method: "get",
    params,
  });
}
// 费用报销审核
function table3(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findExpenseAudit`,
    method: "get",
    params,
  });
}
// 预收款/核销支出
function table4(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findCutSpendingAudit`,
    method: "get",
    params,
  });
}

// 其他审核
function table5(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findOtherAudit`,
    method: "get",
    params,
  });
}

function getResContent(res) {
    let arr = [];
    if (res!=null && res.code == 0) {
        if (res.data.content != null) {
            arr = res.data.content
        }
    }
    return arr;
}

export async function getTableData(params) {
  let t1 = null;
  let t2 = null;
  let t3 = null;
  let t4 = null;
  let t5 = null;
  try {
    t1 = await table1(params);
  } catch (error) {
    t1 = null;
  }
  try {
    t2 = await table2(params);
  } catch (error) {
    t2 = null;
  }
  try {
    t3 = await table3(params);
  } catch (error) {
    t3 = null;
  }
  try {
    t4 = await table4(params);
  } catch (error) {
    t4 = null;
  }
  try {
    t5 = await table5(params);
  } catch (error) {
    t5 = null;
  }
  let arr = [];
  arr[0] = getResContent(t1);
  arr[1] = getResContent(t2);
  arr[2] = getResContent(t3);
  arr[3] = getResContent(t4);
  arr[4] = getResContent(t5);
  return arr;
}

// 提交审核 
export function dailyFundAudit(data) {
  return axios.request({
  url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/dailyFundAudit`,
  method: "post",
  data,
});
}

// 撤销审核
export function dailyFundAuditRevocation(data) {
  return axios.request({
  url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/dailyFundAuditRevocation`,
  method: "post",
  data,
});
}