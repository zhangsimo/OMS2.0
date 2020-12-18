import axios from '@/libs/api.request'
import api from '_conf/url'


//======= 客户理赔登记查询
//======= 客户理赔处理查询
//======= 向供应商理赔查询
//向供应商理赔查询接口
export function supplierSettlementQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleOutDetail/findConditionAfterSaleOutDetail`,
    method:"post",
    params,
    data
  })
}



//======= 供应商处理查询
export function supplierClaimQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleDetail/findConditionAfterSaleOutDetail`,
    method:"post",
    params,
    data
  })
}



//======= 出入记录查询
export function inAndOutLogQuery(params,data){
  return axios.request({
    url:`${api.omsOrder}/afterSaleRecord/findAfterSaleRecord`,
    method:"post",
    params,
    data
  })
}
