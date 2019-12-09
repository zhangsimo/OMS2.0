import api from "_conf/url";
import axios from "@/libs/api.request";

export function getLeftList (data={}) {
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/findPageByDynamicQuery?size=${data.size}&page=${data.page}`,
    method: 'post',
    data
  })
}


export  function getLeftMoreList( data ={}) {
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/moreQueryConditions?size=${data.size}&page=${data.page}`,
    method: 'post',
    data
  })
}

//保存
export  function saveList( data ={}) {
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/saveOrUpdate?`,
    method: 'post',
    data
  })
}

//计算总和
export  function getCalculate( params ={}) {
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/findTotalAmt?`,
    method: 'get',
    params
  })
}
