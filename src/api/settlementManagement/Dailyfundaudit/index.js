// 账户登记表
import axios from "@/libs/api.request";
import api from "_conf/url";

// 应收审核
export function table1(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findReceivablesAudit`,
    method: "get",
    params,
  });
}
// 应付审核
export function table2(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findDealAudit`,
    method: "get",
    params,
  });
}
// 预收款审核
export function table3(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findExpenseAudit`,
    method: "get",
    params,
  });
}
// 预付款审核
export function table4(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findExpenseAuditNew`,
    method: "get",
    params,
  });
}

// 其他应收款审核
export function table5(params) {
    return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findCutSpendingAudit`,
    method: "get",
    params,
  });
}

// 其他应付款审核
export function table6(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findCutSpendingAuditNew`,
    method: "get",
    params,
  });
}

// 费用报销/因公借支审核
export function table7(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findOtherAudit`,
    method: "get",
    params,
  });
}

// 转损益审核
export function table8(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/findOtherAuditNew`,
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
  let t1 = null,
      t2 = null,
      t3 = null,
      t4 = null,
      t5 = null,
      t6 = null,
      t7 = null,
      t8 = null
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
  try {
    t6 = await table6(params);
  } catch (error) {
    t6 = null;
  }
  try {
    t7 = await table7(params);
  } catch (error) {
    t7 = null;
  }
  try {
    t8 = await table8(params);
  } catch (error) {
    t8 = null;
  }
  let arr = [];
  arr[0] = getResContent(t1);
  arr[1] = getResContent(t2);
  arr[2] = getResContent(t3);
  arr[3] = getResContent(t4);
  arr[4] = getResContent(t5);
  arr[5] = getResContent(t6);
  arr[6] = getResContent(t7);
  arr[7] = getResContent(t8);
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


// 每日资金审核撤销
export function withdraw(params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountEverydayAudit/withdraw`,
    method: "get",
    params,
  });
}
