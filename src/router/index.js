import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView, { LoadingBar } from 'view-design'
import { getToken, canTurnTo } from '@/libs/util'
import output from "_conf/env";


Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const REGISTER_PAGE_NAME = 'register'
router.beforeEach((to, from, next) => {
   let httpUrl = ''
      // if (output)
  // _hmt.push(['_trackPageview', pageURL]) 必须是以"/"（斜杠）开头的相对路径
  if (to.path) {
     // @ts-ignore
    window._hmt && window._hmt.push(['_trackPageview', to.fullPath])
  }
  if(from){
    sessionStorage.setItem("route",from.name);
  }
  LoadingBar.start()
  const token = getToken()
  if (!token && to.name != LOGIN_PAGE_NAME&& to.name != REGISTER_PAGE_NAME ) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  }
  else if (!token && to.name === LOGIN_PAGE_NAME||!token && to.name === REGISTER_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到home页
    })
  } else if (store.state.user.access){
      if (canTurnTo(to.name, store.state.user.access, routes)) {
        // let newUrl = `${window.location.host}${to.path}`
        // let oldUrl = localStorage.getItem('oms2-Url') || ''
        // if (newUrl != oldUrl ){
        //   localStorage.setItem('oms2-Url',newUrl);
        //   // window.open(newUrl, "_blank")
        //   window.location.href= newUrl
        //   window.location.reload()
        // }
        next() // 有权限，可访问
      }
      else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
  } else {
    store.dispatch('getUserInfo').then(user => {
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'business']
      if (canTurnTo(to.name, store.state.user.access, routes)){
        // console.log(window.location.host , 8888)
        // console.log(to , 666)
        // let newUrl = `${window.location.host} + ${to.path}`
        // let oldUrl = localStorage.getItem('oms2-Url') || ''
        // if (newUrl != oldUrl ){
        //   localStorage.setItem('oms2-Url',newUrl);
        //   // window.open(newUrl, "_blank")
        //   window.self.location.href= newUrl
        //   window.location.reload()
        // }
        next() // 有权限，可访问
      }
      else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    })
  }
})

router.afterEach(to => {
  // let reloaded = localStorage.getItem('reloaded') || ''
  // if (reloaded !== to.name){
  //   localStorage.setItem('reloaded',to.name);
  //   window.location.reload()
  // }
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
