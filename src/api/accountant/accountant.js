import axios from '@/libs/api.request'
import api from '_conf/url'

//获取左侧树形图
export function getTreeList (params) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/getCountTitleTree`,
    method: 'get',
    params
  })
}


//获取右侧表格数据
export function getTableList (params) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/getCountTitleList`,
    method: 'get',
    params
  })
}

//删除接口
export function deletTableList (data) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/delete`,
    method: 'post',
    data
  })
}

//新增修改
export function getSave (data) {
  return axios.request({
    url: `${api.wmsApi}/financeManage/save`,
    method: 'post',
    data
  })
}


//获取辅助核算
export function fzType() {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=CW00102`,
    method: "get",
  });
}

//科目类别
export function kmType() {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode?dictCode=CW00101`,
    method: "get",
  });
}
