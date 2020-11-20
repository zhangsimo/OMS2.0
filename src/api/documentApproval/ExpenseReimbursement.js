import axios from '@/libs/api.request'
import api from '_conf/url'


//选择弹窗接口
export function getApplyList (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findAllRequest`,
    method: 'get',
    params
  })
}

//数据字典查询dictCode -费用=FYLX -税率TaxRate
export function getDictionary (params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: 'get',
    params
  })
}

//会计科目查询parentCode
export function getSubjectList (params) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/getCountTitleList`,
    method: 'get',
    params
  })
}



//因公借支
export function getOnBusiness (params) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/findAllOfficialBorrow`,
    method: 'get',
    params
  })
}


//获取付款账号名称
export function getPayAccount (params) {
  return axios.request({
    url: `${api.omsSettle}/omsFinanceAccountRegister/findListPageAll`,
    method: 'get',
    params
  })
}

//保存
export function getExpSve (data) {
  return axios.request({
    url: `${api.omsSettle}/financeApplyMain/saveExpenseCliam`,
    method: 'post',
    data
  })
}

//模糊匹配外部人员
export function getOtherPeople (params) {
  return axios.request({
    url: `${api.authApi}/authorityOutsideStaff/findOutsideAccount`,
    method: 'get',
    params
  })
}

//新的  模糊匹配外部人员
export function getOtherPeopleNew (params) {
  return axios.request({
    url: `${api.wmsApi}/guest/findOutsideAccount`,
    method: 'get',
    params
  })
}
