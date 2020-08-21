import axios from '@/libs/api.request'
import api from '_conf/url'

//登录
export const login = ({username, password}) => {
  let data = {
    username,
    password,
    grant_type: 'password',
    client_id: 'oos',
    client_secret: 'oosecret'
  }
  return axios.request({
    url: api.tokenApi + '/uaa/token',
    method: 'post',
    data
  })
}

// 登录其它系统
export const loginSystem = ({uri, username, password}) => {
  let data = {
    username,
    password,
    grant_type: 'password',
    client_id: 'oos',
    client_secret: 'oosecret'
  }
  return axios.request({
    url: uri + '/uaa/token',
    method: 'post',
    data
  })
}

//注销
export const logout = () => {
  return axios.request({
    url: api.tokenApi + '/logout',
    method: 'post'
  })
}

//获取用户信息
export const getUserInfo = (username) => {
  return axios.request({
    url: api.passportApi + '/staff/findByUsername',
    method: 'get',
    params: {
      client: 'oms',
      username
    }
  })
}

//修改密码
export const changePwd = (data) => {
  return axios.request({
    url: api.passportApi + '/staff/changePwd',
    method: 'post',
    data
  })
}

//获取当前用户的所有公司
export const getUserAllCompany = ( params) =>{
    return axios.request( {
      url:api.passportApi + '/sysOrgEmporg/findUserShopListPage',
      method: 'get',
      params
    })
}

//切换企业号
export const setCompany = (data) =>{
    return axios.request( {
    url:api.passportApi + '/staff/findByShopId',
    method: 'post',
    data
  })
}
//审批状态接口
export const approvalStatus = (data)=>{
  return axios.request({
    url:`${api.omsTpApi}/dingtalk/process/getProcessInstance?instanceId=${data.instanceId}`,
    method:'get'
  })
}

//切换企业号更换token
export const changeToken = ( data ) =>{
    data.grant_type = 'password',
    data.client_id = 'oos',
    data.client_secret = 'oosecret'
  return axios.request({
    url: api.tokenApi + '/uaa/token',
    method: 'post',
    data
  })
}


//获取客服信息
export const getService =() =>{
  return axios.request({
    url:`${api.omsApi}/customer/userCustomer`,
    method:'get'
  })
}

// 开发环境：
// https://deves.g-parts.cn
// 测试环境：
// https://tses.g-parts.cn
// 预发布环境：
// https://bakmapi.g-part.cn
// 产线环境：
// https://mapi.g-part.cn
//
// 以上对应域名 + /jpManager/a/loginNp?account=登录名&system=1

export const gParts =(env,account)=>{
  switch (env) {
    case "1":
      //开发
      window.open(`https://deves.g-parts.cn/jpManager/a/loginNp?account=${account}&system=1`)
      break;
    case "2":
      //测试
      window.open(`https://tses.g-parts.cn/jpManager/a/loginNp?account=${account}&system=1`)
      break;
    case "3":
      //预发布
      window.open(`https://bakmapi.g-part.cn/jpManager/a/loginNp?account=${account}&system=1`)
      break;
    case "4":
      //产线
      window.open(`https://mapi.g-part.cn/jpManager/a/loginNp?account=${account}&system=1`)
  }
}

