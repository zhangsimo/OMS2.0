import axios from '@/libs/api.request'
import api from '_conf/url'

// 拉取字典树
export function getDataDictionaryType (params) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/getListTree`,
    method: 'get',
    params
  })
}

// 拉取字典详情
export function getDataDictionaryTable (params) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/findBydictCode`,
    method: 'get',
    params
  })
}

// 保存修改字典详情
export function saveTreeDetailItem (data) {
  return axios.request({
    url: `${api.omsProduct}/dictionariesItem/save`,
    method: 'post',
    data
  })
}

// 保存修改字典类型项
export function saveTreeItem (data) {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/save`,
    method: 'post',
    data
  })
}



