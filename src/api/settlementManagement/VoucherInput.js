import axios from "@/libs/api.request";
import api from "_conf/url";

// ======= 凭证录入页面接口 ========
// 选择辅助核算客户
export function queryGuestList(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryGuestList`,
    method: "get",
    params
  });
}
// 选择辅助核算客户模糊查询
export function queryCreditLiket(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryCreditLiket`,
    method: "get",
    params
  });
}
//选择辅助核算供应商
export function queryAllSupplier(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryAllSupplier`,
    method: "get",
    params
  });
}
//选择辅助核算供应商模糊搜索
// https://rap.g-parts.cn/app/mock/20/oms-system-provider/guest/queryCreditLike
export function queryCreditLike(params) {
  return axios.request({
    url: `${api.wmsApi}/guest/queryCreditLike`,
    method: "get",
    params
  });
}
// https://tsapi2.g-parts.cn/gpart-passport-provider
// 选择辅助核算部门
export function getcompany (params) {
  return axios.request({
    url: `${api.authApi}/group/findRootGroup`,
    method: 'get',
    params
  })
}
//部门
export function getGroupBy(params) {
  return axios.request({
    url: `${api.authApi}/group/findShopGroup`,
    method: 'get',
    params
  })
}
// // 选择辅助核算个人查询
// https://tsapi2.g-parts.cn/gpart-passport-provider/staff/findAll
export function getStaffList (params) {
  return axios.request({
    url: `${api.authApi}/tenantUsers/queryAll`,
    method: 'get',
    params
  })
}

//选择辅助可算其他辅助核算
// 拉取字典树
export function getDataDictionaryType (params) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/getListTree`,
    method: 'get',
    params
  })
}
// 点击查询
export function kmType(params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: "get",
    params
  });
}

//新增辅助核算弹框
export function saveTreeDetailItem (data) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/save`,
    method: 'post',
    data
  })
}

// 会计科目的数据
export function getTableList (params) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/getCountTitleList`,
    method: 'get',
    params
  })
}

//凭证录入保存
export function BigSave (data) {
  return axios.request({
    url: `${api.omstaxset}/finance/financeVoucher/saveOrUpdate`,
    method: 'post',
    data
  })
}


//======================= 凭证查看页面 ===========================
// /finance/financeVoucher/findById
export function findById (params) {
  return axios.request({
    url: `${api.omstaxset}/finance/financeVoucher/findById`,
    method: 'get',
    params
  })
}

//转当期损益tab切换查询
export function getSubjectMsg(data) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/selectAccountList`,
    method: "post",
    data
  });
}

//======================= 凭证修改页面 ===========================
// 审核、作废
export function processVoucher (data) {
  return axios.request({
    url: `${api.omstaxset}/finance/financeVoucher/processVoucher`,
    method: 'post',
    data
  })
}

//文件上传地址
export const putImgUrl = `${api.omstaxset}/finance/file/fileUpload`;

//文件上传下载
export const getImgUrl = `${api.omstaxset}/finance/file/fileDownload`;


export function downLoding(id) {
  let url = `${api.omstaxset}/finance/file/fileDownload?id=` + id;
  return axios.request({
    url: url,
    method:'get',
    // responseType: 'blob'
  })
}
