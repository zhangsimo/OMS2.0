import env from './env'

const dev = {
  tokenApi: 'http://192.168.2.47:5600', // 登录接口API
  // tokenApi: 'https://api.g-parts.cn', // 登录接口API
  // wmsApi: 'https://api.g-parts.cn/wms-order-provider',
  // omsApi: 'http://192.168.30.209:9240', // 张佳岩
  // omsApi: 'http://192.168.30.21:9240', // 付玮琳
  // wmsApi: 'http://192.168.30.84:9250', // 谢建明
  omsProduct: "http://192.168.30.234:9200", // 张佳岩
  omsApi: 'http://192.168.30.234:9240', // 陈舒
  wmsApi: 'http://192.168.30.209:9250', // 陈舒
  // wmsApi: 'http://192.168.30.26:9250', // 曾史强
  // omsProduct: "http://192.168.30.209:9200",
  /**oms系统接口设定 */
  authApi: 'http://192.168.2.47:5200', // 系统资源 5200
  // omsProduct: '', // 9200
  // omsOrder: 'http://192.168.30.21:9210', // 9210
  // omsEdit: '', // 9220
  // omsTask: '', // 9230
  // omsApi: '', // 9240
  // wmsApi: '', // 9250
  // omsBatch: '', // 9260
  // omsSettle: '', // 9270
  /**oms财务接口 */
  // financeCore: '', // 9300
  // financeReport: '', // 9310
  // financeAccount: '', // 9320
  // financeEdit: '', // 9330
  //passportApi: 'https://api.g-parts.cn/gpart-passport-provider',
  passportApi: 'http://192.168.2.47:5200', // passport微服务API
  essentialApi: 'https://api.g-parts.cn/gpart-essential-provider' // 基础服务API
}

const test = {
  tokenApi: 'https://tsapi.g-parts.cn',
  wmsApi: 'https://tsapi.g-parts.cn/wms-order-provider',
  omsApi: 'https://tsapi.g-parts.cn/oms-product-provider',
  omsOrderApi: 'https://tsapi.g-parts.cn/oms-order-provider',
  passportApi: 'https://tsapi.g-parts.cn/gpart-passport-provider',
  essentialApi: 'https://tsapi.g-parts.cn/gpart-essential-provider'
}

const audit = {
  tokenApi: 'https://uatapi.g-parts.cn',
  wmsApi: 'https://uatapi.g-parts.cn/wms-order-provider',
  omsApi: 'https://uatapi.g-parts.cn/oms-product-provider',
  omsOrderApi: 'https://uatapi.g-parts.cn/oms-order-provider',
  passportApi: 'https://uatapi.g-parts.cn/gpart-passport-provider',
  essentialApi: 'https://uatapi.g-parts.cn/gpart-essential-provider'
}

const pro = {
  tokenApi: 'https://api.g-parts.cn',
  wmsApi: 'https://api.g-parts.cn/wms-order-provider',
  omsApi: 'https://api.g-parts.cn/oms-product-provider',
  omsOrderApi: 'https://api.g-parts.cn/oms-order-provider',
  passportApi: 'https://api.g-parts.cn/gpart-passport-provider',
  essentialApi: 'https://api.g-parts.cn/gpart-essential-provider'
}

let urlObj = {dev, test, audit, pro}

export default urlObj[env]
