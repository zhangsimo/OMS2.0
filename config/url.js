import env from './env'

const dev = {
  tokenApi:'https://api.g-parts.cn', // 登录接口API
  // wmsApi:'http://192.168.30.129:9600', // wms微服务API  管智
  // wmsApi:'http://192.168.30.191:9600', // wms微服务API  姜琦
  // wmsApi:'http://192.168.30.182:9600', // wms微服务API  宏杰
  wmsApi:'http://localhost:9600', // wms微服务API
  omsApi:'http://localhost:9200', // oms微服务API
  passportApi:'https://api.g-parts.cn/gpart-passport-provider', // passport微服务API
  essentialApi: 'https://api.g-parts.cn/gpart-essential-provider' // 基础服务API
}

const test = {
  tokenApi:'https://tsapi.g-parts.cn',
  wmsApi:'https://tsapi.g-parts.cn/wms-order-provider',
  omsApi:'https://tsapi.g-parts.cn/oms-product-provider',
  passportApi:'https://tsapi.g-parts.cn/gpart-passport-provider',
  essentialApi:'https://tsapi.g-parts.cn/gpart-essential-provider'
}


const audit = {
  tokenApi:'https://uatapi.g-parts.cn',
  wmsApi:'https://uatapi.g-parts.cn/wms-order-provider',
  omsApi:'https://uatapi.g-parts.cn/oms-product-provider',
  passportApi:'https://uatapi.g-parts.cn/gpart-passport-provider',
  essentialApi:'https://uatapi.g-parts.cn/gpart-essential-provider'
}


const pro = {
  tokenApi:'https://api.g-parts.cn',
  wmsApi:'https://api.g-parts.cn/wms-order-provider',
  omsApi:'https://api.g-parts.cn/oms-product-provider',
  passportApi:'https://api.g-parts.cn/gpart-passport-provider',
  essentialApi:'https://api.g-parts.cn/gpart-essential-provider'
}

let urlObj = {dev, test, audit, pro}

export default urlObj[env]
