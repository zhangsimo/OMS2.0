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
    url: '/staff/findByUsername',
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
    url: '/staff/changePwd',
    method: 'post',
    data
  })
}
