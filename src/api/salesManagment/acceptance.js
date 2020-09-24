import axios from '@/libs/api.request'
import api from '_conf/url'
import {TOKEN_KEY} from "@/libs/util";
import Cookies from "js-cookie";


import {v4} from "uuid";
import Api from "_conf/url";
import Axios from 'axios'

//获取上表格数据
export function getTopList(num, page, data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/queryAllAccept?page=${page}&size=${num}`,
    method: 'post',
    data
  })
}

//获取客户
export function getClient() {
  return axios.request({
    url: `${api.wmsApi}/guest/findByQuery`,
    method: 'get',

  })
}

//获取公司信息
export function selectCompany(params) {
  return axios.request({
    url: `${api.wmsApi}/company/get/by/tenantid`,
    method: "get",
    params
  });
}

//生成采购订单
export function newPurchaseOrder(data) {
  return axios.request({
    url: `${api.omsOrder}/guestOrderMain/complete`,
    method: "post",
    data
  });
}


//获取华胜代付入库列表
export function getHsOrderList(params, data) {
  return axios.request({
    url: `${api.omsOrder}/omsHarsonOrderEnter/queryByConditions`,
    method: "post",
    params,
    data
  });
}

//获取华胜代付入库处理过账
export function setPostDetail(data) {
  return axios.request({
    url: `${api.omsOrder}/omsHarsonOrderEnter/orderDetail`,
    method: "post",
    data
  });
}

export function hsIndexImport(params){
  let str=""
  for(let i in params){
    str+=`${i}=${params[i]}&`
  }
  return `${api.omsOrder}/huaShengOrders/export/huaShengOrders?${str}access_token=${Cookies.get(TOKEN_KEY)}`
}
export async function hsIndexImportPost(params, data) {
  let str = ''
  for (var i in params) {
    str += `${i}=${params[i]}&`
  }
  await Axios.post(`${Api.omsOrder}/huaShengOrders/export/huaShengOrders?${str.slice(0, str.length - 1)}`,
    data, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json",
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      responseType: 'arraybuffer',// 表明返回服务器返回的数据类型
    }).then(res => {
    console.log(res)
    //Post 方法导出二进制数据
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    let fileName = data.fileName;
    const index = 1;
    setTimeout(() => {
      const elink = document.createElement("a");//创建一个新的a标签
      elink.download = fileName;
      elink.style.display = "none";
      elink.target = "_blank";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      setTimeout(function () {
        URL.revokeObjectURL(elink.href); // 释放URL对象 手动垃圾回收
        document.body.removeChild(elink);
      }, 1500);
    }, 1000 * index);
  })
}
