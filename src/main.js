// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import Axios from 'axios'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/mock'
import 'babel-polyfill'
import Message from "_c/message"

// import contentmenu from 'v-contextmenu'
// import 'v-contextmenu/dist/index.css'
//
// Vue.use(contentmenu)

// 实际打包时应该不引入mock
// import env from '@/config/env'
// env === 'development' ? require('mock') : ''

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Vue.prototype.ajaxAll = Axios

Vue.prototype.hasPermission = (mark) => {
  return store.state.user.access.indexOf(mark) > -1
}

Vue.prototype.$Message = Message
Vue.prototype.$loading = (msg) => {
  return Message.loading({
    content: msg || '处理中，请稍后...',
    duration: 0
  })
}

/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
