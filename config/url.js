import env from './env'

const dev = {
  tokenApi: 'http://192.168.2.47:5600', // 登录接口API
  // tokenApi: 'https://api.g-parts.cn', // 登录接口API
  // wmsApi: 'https://api.g-parts.cn/wms-order-provider',
  // omsApi: 'http://192.168.30.209:9240', // 张佳岩
  // omsApi: 'http://192.168.30.21:9240', // 付玮琳
  // wmsApi: 'http://192.168.30.84:9250', // 谢建明
  // omsProduct: "http://192.168.30.21:9200", // 张佳岩
  // omsApi: 'http://192.168.30.234:9240', // 陈舒
  wmsApi: 'http://192.168.30.234:9250', // 陈舒
  // wmsApi: 'http://192.168.30.179:9250', // 常国地
  // wmsApi: 'http://192.168.30.26:9250', // 曾史强
  omsProduct: "http://192.168.30.234:9200",
  /**oms系统接口设定 */
  authApi: 'http://192.168.2.47:5200', // 系统资源 5200
  // omsProduct: '', // 9200
  omsOrder: 'http://192.168.30.234:9210', // 9210
  // omsSettle: 'http://192.168.30.179:9270',
  // omsEdit: '', // 9220salesOrder
  // omsTask: '', // 9230
  // omsApi: '', // 9240
  // wmsApi: '', // 9250
  // omsBatch: '', // 9260
  // omsSettle: '', // 9270
  //omsSotck:'',//9280
  /**oms财务接口 */
  // financeCore: '', // 9300
  // financeReport: '', // 9310
  // financeAccount: '', // 9320
  // financeEdit: '', // 9330
  //passportApi: 'https://api.g-parts.cn/gpart-passport-provider',
  uploadApi: 'http://192.168.2.47:5100/file/uploadFile',
  getFileApi: 'https://devoms2.g-parts.cn',
  downApi: 'http://api2.g-parts.cn/gpart-oss-provider',
  passportApi: 'http://192.168.2.47:5200', // passport微服务API
  essentialApi: 'https://api2.g-parts.cn/gpart-essential-provider' // 基础服务API
}

const test = {
  omsTask:'https://tsapi2.g-parts.cn/oms-task-provider',
  omsEdit:'https://tsapi2.g-parts.cn/oms-edi-provider',
  omsApi:'https://tsapi2.g-parts.cn/oms-lease-provider',
  tokenApi: 'https://tsapi2.g-parts.cn',
  wmsApi: 'https://tsapi2.g-parts.cn/oms-system-provider',
  omsProduct: 'https://tsapi2.g-parts.cn/oms-product-provider',
  omsOrder: 'https://tsapi2.g-parts.cn/oms-order-provider',
  passportApi: 'https://tsapi2.g-parts.cn/gpart-passport-provider',
  essentialApi: 'https://tsapi2.g-parts.cn/gpart-essential-provider',
  authApi: 'https://tsapi2.g-parts.cn/gpart-passport-provider',
  omsBatch: 'https://tsapi2.g-parts.cn/gpart-batch-provider',
  omsSettle:'https://tsapi2.g-parts.cn/gpart-settlement-provider',
  omsSotck:'https://tsapi2.g-parts.cn/gpart-sotck-provider',
  uploadApi: 'https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFile',
  getFileApi: 'https://tsoms2.g-parts.cn',
  downApi: 'https://tsapi2.g-parts.cn/gpart-oss-provider',
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
