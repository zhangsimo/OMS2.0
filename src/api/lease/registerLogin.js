import axios from '@/libs/api.request'
import api from '_conf/url'

// *========= 注册页面 ==========*

// /noToken/verificationCode/sendMessage
// 发送短信验证码
export function sendMessage(params) {
  return axios.request({
    url: `${api.omsApi}/noToken/verificationCode/sendMessage`,
    method: 'get',
    params
  })
}

//省份城市
// /noToken/register/findByDynamicQuery
export function findByDynamicQuery(params) {
  return axios.request({
    url: `${api.omsProduct}/noToken/register/findByDynamicQuery`,
    method: 'get',
    params
  })
}

// 根据租户类型获取所有的数据项
// /noToken/register/findByDictCode
export function findByDictCode(params) {
  return axios.request({
    url: `${api.omsProduct}/noToken/register/findByDictCode?dictCode=CS001`,
    method: 'get',
    params
  })
}
// /noToken/verificationCode/register

// 注册按钮
export function register(data) {
  return axios.request({
    url: `${api.omsApi}/noToken/verificationCode/register`,
    method: 'post',
    data
  })
}
