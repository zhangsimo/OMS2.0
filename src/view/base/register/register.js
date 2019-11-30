import api from '_conf/url'
import axios from '@/libs/api.request'

// 获取验证码 判断手机号
export function getCode (params) {
    return axios.request({
        url: `${api.omsApi}/verificationCode/sendMessage`,
        method: 'get',
        params
    })
  }
  export function getSupplier (data={}) {
    return axios.request({
        url: `${api.omsApi}/optGroup/init`,
        method: 'post',
        data
    })
  }
//选择公司类型
//选择省
//选择市




