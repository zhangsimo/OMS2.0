import Axios from 'axios'
import qs from 'qs'
import baseURL from '_conf/url'
import Cookies from 'js-cookie'
import { TOKEN_KEY, REFRESH_TOKEN_KEY, isTokenExpired } from '@/libs/util'
import { v4 } from "uuid"

let lock = true;
let isFailure = false;
let is403 = 0

class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
    // 当发生错误时，是否提示的队列
    this.showErrorQueue = {}
    this.isRefreshing = false
    this.refreshSubscribers = []
  }
  getRefreshToken () {
    return JSON.parse(localStorage.auth).refresh_token
  }

  subscribeTokenRefresh (cb) {
    this.refreshSubscribers.push(cb)
  }
  onRrefreshed (token) {
    this.refreshSubscribers.map(cb => cb(token))
  }

  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors (instance, url) {
    let that = this
    if(isFailure&&!url.includes('/uaa/token')){
      return false;
    }
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      isFailure=false;
      if(Cookies.get(TOKEN_KEY) && !config.url.includes('/token')){
            config.headers['Authorization'] = "Bearer "+Cookies.get(TOKEN_KEY)
            config.params = config.params || {}
            if(localStorage.getItem("oms2-userList") != null && !config.url.includes('/groupBalanceSheet') ) {
              let res = JSON.parse(localStorage.getItem('oms2-userList'))
              config.params.tenantId = res.tenantId || 0
              config.params.shopId = res.shopId || 0
              config.params.shopkeeper = res.shopkeeper || 0
            }
            if(config.params.scope == null) {
              if(localStorage.getItem('userScope') != null){
                let  scope = localStorage.getItem('userScope')
                config.params.scope = scope || 'oms'
              }else{
                config.params.scope = 'oms'
              }
            }
      }else{
        if(config.url.includes('/token')){
          config.data = qs.stringify(config.data);
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let { data } = res
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      if (!(data instanceof Blob)) {
        if (data.code !== 0) {

          // 后端服务在个别情况下回报201，待确认
          if (data.code === 401) {
            Cookies.remove(TOKEN_KEY)
            window.location.href = '/#/login'
            globalVue.$Message.error('未登录，或登录失效，请登录')
          } else {
            if (data.message && this.showErrorQueue[url]) {
              delete this.showErrorQueue[url]
              if(typeof data.message=='object'){
                data.message=data.message[0]
              }
              if (data.message.includes('Error')){
                data.message = data.message.substring(6)
              }
              globalVue.$Message.error(data.message)
            }
          }
          return false
        }
      }
      return data
    }, (error) => {
      let errtip = ''
      if(error.response){
        if(error.response.status === 401){
          is403++;
          if(error.response.data.code===9401){
            errtip = '访问令牌无效!';
            isFailure=true;
          }
          if(error.response.data.code===9403){
            errtip = '没有权限访问!'
          }
          if(is403==1){
            globalVue.$Message.error(errtip);
          }
          setTimeout(function () {
            Cookies.remove(TOKEN_KEY)
            window.location.href = '/login'
          },1500)
          return false
        }
      }
      //Message.error('服务内部错误')

      if(error.response.config.url.includes('/token')){
        globalVue.$Message.error(error.response.data.data.errorMessage)
      }else{
        globalVue.$Message.error(error.message)
      }


      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL.omsApi,
      timeout: 2000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      },
      params:{}
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }
  // 请求实例
  request (options) {
    var instance = this.create()
    this.interceptors(instance, options.url)
    this.queue[options.url] = instance
    this.showErrorQueue[options.url] = options.showError === undefined ? true : !!options.showError
    return instance(options)
  }
}
export default httpRequest
