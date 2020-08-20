import {getParamsBrandPart} from "@/api/reportForm/index.js";
import {v4} from "uuid";
import Cookies from "js-cookie";
import {TOKEN_KEY} from "@/libs/util";
import Api from "_conf/url";
import Axios from 'axios'

export async  function  getBrandList(name){
  let data={name:name}
  let arr=[]
  let res=await getParamsBrandPart(data)
  if(res.code===0){
    if(res.data.content){
      for (let quality of res.data.content) {
        if (quality.children.length <= 0) {
          break;
        }
        quality.children.forEach(el => {
          el.label = el.name;
          el.value = el.code;
          el.id = el.id;
          arr.push(el);
        });
      }
    }else{
      arr=[]
    }
  }
  return arr
}

export async function getWares(orgId){
  orgId==0?orgId="":orgId=orgId
  let res = JSON.parse(localStorage.getItem('oms2-userList'))
  let tenantId = res.tenantId || 0
  let shopkeeper = res.shopkeeper || 0
  let uuid = v4()
  let params = {tenantId: tenantId, shopId: orgId, shopkeeper: shopkeeper, uuid: uuid, scope: "oms"}

  let waleData=[]
  await Axios.get(`${Api.wmsApi}/comStore/stores/findByShopId`, {
    params: params,
    headers: {
      Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
    }
  }).then((res2) => {
    if (res2.data.code === 0) {
      waleData = res2.data.data;
    }else{
      waleData=[]
    }
  })
  return waleData
}
