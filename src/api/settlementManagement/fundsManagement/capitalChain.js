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
export function goList(data) {
  return axios.request({
    url: `${api.omsSettle}/cashAccountServer/findCashAccount?page=${data.page}&size=${data.size}`,
    method: 'post',
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
