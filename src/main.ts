// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'view-design'
import config from '@/config'
import Axios from 'axios'
import _ from 'lodash';
import importDirective from '@/directive'
import 'view-design/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/mock'
import 'babel-polyfill'
import Message from './components/message'
import './assets/iconfonts/iconfont.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
Vue.use(VXETable)
Vue.use(iView)
Vue.config.productionTip = false

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Vue.prototype.ajaxAll = Axios

Vue.prototype._ = _;

Vue.prototype.hasPermission = (mark:any) => {
  return store.state.user.access.indexOf(mark) > -1
}

// 自定义组件
const requireComponents = require.context('_c/base', true, /\.vue/);
requireComponents.keys().forEach(fileName => {
  const reqCom = requireComponents(fileName);
  let reqComName = fileName.split('/')[1];
  reqComName = reqComName.split('.')[0];
  Vue.component(reqComName, reqCom.default || reqCom);
})

// Vue.prototype.$Message = Message
Vue.prototype.$loading = (msg:any) => {
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
let windows:any = window;
windows.globalVue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
