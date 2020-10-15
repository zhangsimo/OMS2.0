import axios from "@/libs/api.request";
import api from "_conf/url";

// 供应商分类
export function getSupplierType(params) {
  return axios.request({
    url: `${api.wmsApi}/supplierType/findType`,
    method: "get",
    params
  });
}

// 供应商查询
export function getSupplier(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryAllSupplier`,
    method: "get",
    params
  });
}

// 初始化字典值
export function optGroupInit(data = {}) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/init`,
    method: "post",
    data
  });
}

// 计划采购主数据-分页查询
export function findPageByDynamicQuery(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/findPageByDynamicQuery`,
    method: "post",
    params,
    data
  });
}

// 计划采购主数据-高级查询
export function queryByConditions(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/queryByConditions`,
    method: "post",
    params,
    data
  });
}

// 国际采购主数据-分页查询
export function findPageByInternationDynamicQuery(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/findPageByDynamicQuery`,
    method: "post",
    params,
    data
  });
}
// 国际采购主数据-高级查询
export function queryByInternationConditions(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/queryByConditions`,
    method: "post",
    params,
    data
  });
}

// 采购计划单
export function getPchsPlan(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/pchsPlan`,
    method: "post",
    params,
    data
  });
}

// 保存草稿-采购计划单
export function saveDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveDraft`,
    method: "post",
    data
  });
}

// 提交-采购计划单
export function saveCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveCommit`,
    method: "post",
    data
  });
}

// 作废-采购计划单
export function saveObsolete(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderPlan/saveObsolete`,
    method: "post",
    params: { id }
  });
}

// 保存草稿-国际
export function saveInterDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/saveDraft`,
    method: "post",
    data
  });
}

// 提交-国际
export function saveInterCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/saveCommit`,
    method: "post",
    data
  });
}

// 作废-国际
export function saveInterObsolete(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/saveObsolete`,
    method: "post",
    params: { id }
  });
}

// 删除配件
export function delPchsOrderDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/delete`,
    method: "post",
    data
  });
}

// 计划调整查询
export function queryModifyOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/queryModifyOrder`,
    method: "post",
    data
  });
}

// 计划调整保存
export function saveModifyOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/saveModifyOrder`,
    method: "post",
    data
  });
}

// 计划调整全部调整
export function saveModifyAllOrder(params) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/saveModifyAllOrder`,
    method: "post",
    params,
    data: {},
  });
}

// 查看库存
export function queryPartStockAndLog(partId) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderDetail/queryPartStockAndLog`,
    method: "post",
    params: { partId },
    data: {},
  });
}

// 打印
export function print(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderMain/print`,
    method: "post",
    params: { id },
    data: {},
  });
}

// 费用登记-查询左侧
export function findPageByguest(params, data) {
  return axios.request({
    url: `${api.wmsApi}/guest/findPageByDynamicQuery`,
    method: "post",
    params,
    data,
  });
}

// 费用登记-查询右侧
export function getFee(params, data) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/get/fee/registration`,
    method: "post",
    params,
    data
  });
}

// 费用登记-保存
export function saveFee(data) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/saveOrUpdate`,
    method: "post",
    data,
  });
}

// 费用登记-删除
export function delFee(id) {
  return axios.request({
    url: `${api.omsSettle}/receivable/payable/delete`,
    method: "post",
    data: {},
    params: { id }
  });
}


//临时采购按照品牌导入配件地址
export const getup = `${api.omsOrder}/pchsOrderMain/importExcel?`;

//临时采购按照内码导入配件地址
export const getupInnerId=`${api.omsOrder}/pchsOrderMain/importExcel/partId?`

//临时采购主数据-分页查询
export function temporaryFindPageByDynamicQuery(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/findPageByDynamicQuery`,
    method: "post",
    params,
    data
  });
};
//临时采购主数据-高级查询
export function temporaryQueryByConditions(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/queryByConditions`,
    method: "post",
    params,
    data
  });
};
// 临时采购保存草稿
export function temporarySaveDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/saveDraft`,
    method: "post",
    data
  });
};
// 临时采购提交
export function temporarySaveCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/saveCommit`,
    method: "post",
    data
  });
};
// 临时采购作废
export function temporarySaveObsolete(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderTemporary/saveObsolete`,
    method: "post",
    params: { id }
  });
};


//外采主数据-分页查询
export function outsideFindPageByDynamicQuery(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderExternal/findPageByDynamicQuery`,
    method: "post",
    params,
    data
  });
};
//外采--按照品牌导入配件地址
export const outgetup = `${api.omsOrder}/pchsOrderMain/importExcel?`;
//外采--按照内码导入配件地址
export const outgetupInnerId=`${api.omsOrder}/pchsOrderMain/importExcel/partId?`


//外采购主数据-高级查询
export function outsideQueryByConditions(params, data = {}) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderExternal/queryByConditions`,
    method: "post",
    params,
    data
  });
};
// 外采购--保存草稿
export function outsideSaveDraft(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderExternal/saveDraft`,
    method: "post",
    data
  });
};
// 外采购--提交
export function outsideSaveCommit(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderExternal/saveCommit`,
    method: "post",
    data
  });
};
// 外采购--作废
export function outsideSaveObsolete(id) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderExternal/saveObsolete`,
    method: "post",
    params: { id }
  });
};
// 计算金额
export function calculatAmt(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsOrderInternation/calculatAmt`,
    method: "post",
    data,
  });
}



// 采购计划
// 计划调整查询
export function queryModifyOrderPlan(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanDetail/queryModifyPlan`,
    method: "post",
    data
  });
}

// 计划调整保存
export function saveModifyOrderPlan(data) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanDetail/saveModifyPlan`,
    method: "post",
    data
  });
}

// 计划调整全部调整
export function saveModifyAllOrderPlan(params) {
  return axios.request({
    url: `${api.omsOrder}/pchsPlanDetail/saveModifyAllPlan`,
    method: "post",
    params,
    data: {},
  });
}

// 远程查询 供应商
export function getMoteSupplier(name) {
  return axios.request({
    url: `${api.omsOrder}/optGroup/optGuest`,
    method: "post",
    params: { name },
    data: {},
  });
}

//打印
export function printTableZF(params){
  return  axios.request({
    url: `${api.omsOrder}/pchsOrderMain/directPrint`,
    method: "post",
    params: params,
    data: {},
  });
}
