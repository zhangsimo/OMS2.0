import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData } from './data'

// 登录相关和获取用户信息
// Mock.mock(/http:\/\/192.168.2.56:5000\/uaa\/token/, login)
Mock.mock(/\/get_info\.*/, 'get',getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)

export default Mock
