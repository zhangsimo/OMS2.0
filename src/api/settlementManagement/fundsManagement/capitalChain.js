import axios from "@/libs/api.request";
import api from "_conf/url";


//获取区域
export function are(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findAllArea`,
    method: "post",
    data
  });
}


//获取门店接口
export function goshop(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findAllShop`,
    method: 'post',
    data
  });
}


//获取门店接口
export function goSubject(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findSubjectGroup`,
    method: 'post',
    data
  });
}


//导入文件地址
export const impUrl = `${api.omsSettle}/cashAccountServer/import`


//获取门店接口
export function goList(params,data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findCashAccount`,
    method: 'post',
    params,
    data
  });
}


//删除导入
export function deleList(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/deleteById?id=${data.id}`,
    method: 'post',
    data
  });
}


//分配店号
export function assignShop(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/storeNumber`,
    method: 'post',
    data
  });
}

//人工分配
export function manpowerChange(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/artificialMatching`,
    method: 'post',
    data
  });
}

//撤销分配
export function revocation(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/cancelArtificialMatching`,
    method: 'post',
    data
  });
}

//只能分配
export function ait(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/intelligentMatch`,
    method: 'post',
    data
  });
}


//判断是否是管理员
export function isAdmin(data){
  return axios.request({
    url: `${api.authApi}/staff/findUserShopKeeper`,
    method: 'post',
    data
  });
}


//业务类别
export function gosubjectType (params){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findBusinessType`,
    method: 'get',
    params
  });
}

//账户
export function goAccountList (params){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findAccountRegister`,
    method: 'get',
    params
  });
}


//修改
export function changeSave(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/update`,
    method: 'post',
    data
  });
}


//新增
export function addSave(data){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/add`,
    method: 'post',
    data
  });
}

//获取当前科目 =>只能获取库存现金
export function getSubjectType (params){
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/financeAccountTitle`,
    method: 'get',
    params
  });
}

//获取当前科目



