import Axios from 'axios'
import qs from 'qs'
import baseURL from '_conf/url'
import Cookies from 'js-cookie'
import { TOKEN_KEY, REFRESH_TOKEN_KEY, isTokenExpired } from '@/libs/util'

let lock = true

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
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      if(Cookies.get(TOKEN_KEY)){
        // config.headers.Authorization = "Bearer "+Cookies.get(TOKEN_KEY)
          // if(isTokenExpired()){
          //   if(!this.isRefreshing){
          //     this.isRefreshing = true
          //     setTimeout(function () {
          //       that.isRefreshing = false
          //       let objLoginDate = JSON.parse(localStorage.loginDate)
          //       objLoginDate.expires_in = 80000
          //       objLoginDate.loginTime = new Date().getTime()
          //       localStorage.loginDate = JSON.stringify(objLoginDate)
          //       config.headers.Authorization = "Bearer "+Cookies.get(TOKEN_KEY)
          //       that.onRrefreshed(Cookies.get(TOKEN_KEY))
          //       /*执行onRefreshed函数后清空数组中保存的请求*/
          //       that.refreshSubscribers = []
          //     },1000)
          //
          //   }
          //   let retry = new Promise((resolve) =>{
          //     this.subscribeTokenRefresh((token) => {
          //       console.log(token)
          //       config.headers.Authorization = 'Bearer ' + token
          //       resolve(config)
          //     })
          //   })
          //   console.log(retry)
          //   return retry
          // }
          // else{
            config.headers['Authorization'] = "Bearer "+Cookies.get(TOKEN_KEY)
            config.params = config.params || {}
          // }
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
              globalVue.$Message.error(data.message)
            }
          }
          return false
        }
      }
      return data
    }, (error) => {
      // Cookies.remove(TOKEN_KEY)
      // window.location.href = '/#/login'
      // console.log(error.response)
      // console.log(this.showErrorQueue)
      let errtip = ''
      if(error.response){
        if(error.response.status === 401){
          if(error.response.data.code===9401){
            errtip = '访问令牌无效!'
          }
          if(error.response.data.code===9403){
            errtip = '没有权限访问!'
          }
          globalVue.$Message.error(errtip)
          setTimeout(function () {
            Cookies.remove(TOKEN_KEY)
            window.location.href = '/#/login'
          },1500)
          return false
        }
      }
      //Message.error('服务内部错误')
      globalVue.$Message.error(error.message)
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL.omsApi,
      // timeout: 2000,
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
