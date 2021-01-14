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
import '@/assets/iview/iview.css';
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/mock'
import 'babel-polyfill'
import Message from './components/message'
import './assets/iconfonts/iconfont.css'
import XEUtils from 'xe-utils'
import VXETablePluginIView from 'vxe-table-plugin-iview'
import 'vxe-table-plugin-iview/dist/style.css'

import VXEUtils from 'vxe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
// @ts-ignore
import {rightButtonShow , authButton,resubmitNotButton} from './utils/button'

import loadmore from "./directive/loadmore";
import VueQriously from 'vue-qriously'
import locale from 'view-design/dist/locale/zh-CN';
import VueI18n from 'vue-i18n'
Vue.use(VueQriously)
// @ts-ignore
Vue.use(loadmore);

//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
Vue.use(VXETable)
VXETable.use(VXETablePluginIView)
Vue.use(VueI18n)
Vue.use(iView, { locale })
Vue.config.productionTip = false
Vue.use(VXEUtils, XEUtils)
Vue.use(authButton)
Vue.use(resubmitNotButton)//防止按钮重复点击1000ms内，也可以自设时间
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Vue.prototype.ajaxAll = Axios

Vue.prototype._ = _;

Vue.prototype.hasPermission = (mark:any) => {
  return store.state.user.access.indexOf(mark) > -1
}

//全局方法判断当前角色按钮的使用权
Vue.prototype.$ButtonShow = rightButtonShow
//全局过滤
Vue.filter("priceFilters",function(value){
  if(!value){
    value = 0
  }
  value = parseFloat(value).toFixed(2);
  return value;
});

//全局过滤器数字转大写
Vue.filter('toChies', function (values) {
  if(!values){
    values = 0
  }
  values = (+values).toFixed(2)
  let moneymax:any = values.split('.')[0]
  let moneymin:any = values.split('.')[1]
  let len :any=moneymax.length//统计出长度
  let arr:any=[];
  let str2:any = ''
  let chin_list=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
  let chin_lisp=['仟','佰','拾','亿','仟','佰','拾','万','仟','佰','拾']

  for(let i=0;i<len;i++){
    arr.push(parseInt(values[i]));
    arr[i]=chin_list[arr[i]]
  }
  for(let i=len-1,j=1;i>0;i--){
    arr.splice(i,0,chin_lisp[chin_lisp.length-j++])
  }
  for (var i = 0; i < moneymin.length; i++) {
    str2 += chin_list[moneymin[i]];
  }
  str2 = str2[0] +'角' +str2[1] + '分'
  arr=arr.join('')
  arr+='元'
  return arr + str2
})


Vue.filter('NumFormat', function(value) {
  if(!value) return '0.00';
  value = parseFloat(value).toFixed(2).toString().split(".");
  value[0] = value[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
  return value.join(".");
})


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

export default windows
