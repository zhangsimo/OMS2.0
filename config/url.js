import env from "./env";

const dev = {
  omsApi: "http://192.168.30.221:9240", //徐林烽
  wmsApi: "http://192.168.30.221:9250", // 徐林烽
  omsOrder: "http://192.168.30.221:9210", // 徐林烽
  omsStore: "http://192.168.30.221:9280", // 库存查询 周伟健
  omsProduct: "http://192.168.30.221:9200",
  omsSettle: "http://192.168.30.221:9270",
  omsEdit: 'http://192.168.21.221:9220', // 9220salesOrder
  omsBatch: 'http://192.168.30.221:9260', // 9260
  omsSotck: "http://192.168.30.221:9280", //9280

  /**oms系统接口设定 */
  tokenApi: "http://192.168.2.47:5600", // 登录接口API
  authApi: "http://192.168.15.165:5200", // 系统资源 5200
  passportApi: "http://192.168.15.165:5200", // passport微服务API

  uploadApi: "http://192.168.2.47:5100/file/uploadFile",
  upbase64Api: "http://192.168.30.179:5100/file/uploadFileNew",
  getFileApi: "https://devoms2.g-parts.cn",
  downApi: "http://api2.g-parts.cn/gpart-oss-provider",
  essentialApi: "https://api2.g-parts.cn/gpart-essential-provider", // 基础服务API
  omsTpApi: "https://tsapi2.g-parts.cn/oms-thirdparty-provider",
  templateApi:"http://192.168.221.109:5100"
};

const test = {
  omsTask: "https://tsapi2.g-parts.cn/oms-task-provider",
  omsEdit: "https://tsapi2.g-parts.cn/oms-edi-provider",
  // omsEdit: "http://192.168.21.59:9220",
  omsApi: "https://tsapi2.g-parts.cn/oms-lease-provider",
  tokenApi: "https://tsapi2.g-parts.cn",
  // tokenApi: "http://192.168.30.226:5600",
  wmsApi: "http://192.168.21.59:9250",
  // wmsApi: "https://tsapi2.g-parts.cn/oms-system-provider",
  omsProduct: "https://tsapi2.g-parts.cn/oms-product-provider",
  // omsOrder: "https://tsapi2.g-parts.cn/oms-order-provider",
  omsOrder: "http://192.168.21.59:9210",
  passportApi: "https://tsapi2.g-parts.cn/gpart-passport-provider",
  // passportApi: "http://192.168.30.226:5200",
  essentialApi: "https://tsapi2.g-parts.cn/oms-essential-provider",
  // authApi: "http://192.168.30.226:5200",
  authApi: "https://tsapi2.g-parts.cn/gpart-passport-provider",
  // omsBatch: 'http://192.168.30.179:9260', // 9260
  omsBatch: "https://tsapi2.g-parts.cn/oms-batch-provider",
  // omsSettle: "http://192.168.30.43:9270",
  omsSettle: "https://tsapi2.g-parts.cn/oms-settlement-provider",
  omsSotck: "https://tsapi2.g-parts.cn/oms-stock-provider",
  uploadApi:
    "https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFile",
  upbase64Api:
    "https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFileNew",
  getFileApi: "https://tsoms2.g-parts.cn",
  downApi: "https://tsapi2.g-parts.cn/gpart-oss-provider",
  omsTpApi: "https://tsapi2.g-parts.cn/oms-thirdparty-provider",
  templateApi:"https://tsapi2.g-parts.cn/gpart-essential-provider"
};

const audit = {
  omsTask: "https://uatapi2.g-part.cn/oms-task-provider",
  omsEdit: "https://uatapi2.g-part.cn/oms-edi-provider",
  omsApi: "https://uatapi2.g-part.cn/oms-lease-provider",
  tokenApi: "https://uatapi2.g-part.cn",
  wmsApi: "https://uatapi2.g-part.cn/oms-system-provider",
  omsProduct: "https://uatapi2.g-part.cn/oms-product-provider",
  omsOrder: "https://uatapi2.g-part.cn/oms-order-provider",
  passportApi: "https://uatapi2.g-part.cn/gpart-passport-provider",
  essentialApi: "https://uatapi2.g-part.cn/oms-essential-provider",
  authApi: "https://uatapi2.g-part.cn/gpart-passport-provider",
  omsBatch: "https://uatapi2.g-part.cn/oms-batch-provider",
  omsSettle: "https://uatapi2.g-parts.cn/oms-settlement-provider",
  omsSotck: "https://uatapi2.g-part.cn/oms-stock-provider",
  uploadApi:
    "https://uatapi2.g-part.cn/gpart-essential-provider/file/uploadFile",
  upbase64Api:
    "https://uatapi2.g-part.cn/gpart-essential-provider/file/uploadFileNew",
  getFileApi: "https://uatoms2.g-part.cn.cn",
  downApi: "https://uatapi2.g-part.cn/gpart-oss-provider",
  omsTpApi: "https://uatapi2.g-part.cn/oms-thirdparty-provider",
  templateApi:"https://uatapi2.g-part.cn/gpart-essential-provider"
};

const pro = {
  omsTask: "https://api2.g-part.cn/oms-task-provider",
  omsEdit: "https://api2.g-part.cn/oms-edi-provider",
  omsApi: "https://api2.g-part.cn/oms-lease-provider",
  tokenApi: "https://api2.g-part.cn",
  wmsApi: "https://api2.g-part.cn/oms-system-provider",
  omsProduct: "https://api2.g-part.cn/oms-product-provider",
  omsOrder: "https://api2.g-part.cn/oms-order-provider",
  passportApi: "https://api2.g-part.cn/gpart-passport-provider",
  essentialApi: "https://api2.g-part.cn/oms-essential-provider",
  authApi: "https://api2.g-part.cn/gpart-passport-provider",
  omsBatch: "https://api2.g-part.cn/oms-batch-provider",
  omsSettle: "https://api2.g-part.cn/oms-settlement-provider",
  omsSotck: "https://api2.g-part.cn/oms-stock-provider",
  uploadApi:
    "https://api2.g-part.cn/gpart-essential-provider/file/uploadFile",
  upbase64Api:
    "https://api2.g-part.cn/gpart-essential-provider/file/uploadFileNew",
  getFileApi: "https://erp.g-part.cn",
  downApi: "https://api2.g-part.cn/gpart-oss-provider",
  omsTpApi: "https://api2.g-part.cn/oms-thirdparty-provider",
  templateApi:"https://api2.g-part.cn/gpart-essential-provider",
};

let urlObj = { dev, test, audit, pro };

export default urlObj[env];
