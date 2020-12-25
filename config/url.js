import env from "./env";

const dev = {
  omsApi: "http://192.168.30.144:9240", //徐林烽
  wmsApi: "http://192.168.30.144:9250",
  omsOrder: "http://192.168.30.144:9210", // 徐林烽
  omsStore: "http://192.168.30.144:9280", // 库存查询 周伟健
  omsProduct: "http://192.168.30.144:9200",
  omsEdit: 'http://192.168.30.144:9240', // 9220salesOrder
  // omsOrder:'http://192.168.30.11:9210', //陈舒
  // omsSettle: "http://192.168.30.11:9270",
  omsSettle: "http://192.168.30.144:9270",//9270
  // omsProduct: '', // 9200
  // omsOrder: 'http://192.168.30.221:9210', // 9210
  // omsEdit: '', // 9220salesOrder
  // omsTask: '', // 9230
  // omsApi: '', // 9240
  // wmsApi: '', // 9250
  omsBatch: 'http://192.168.30.144:9260', // 9260
  // omsSettle: '', // 9270
  omsSotck: "http://192.168.30.144:9280", //9280

  /**oms系统接口设定 */
  // tokenApi: "https://tsapi2.g-parts.cn", // 登录接口API
  authApi: "http://192.168.2.47:5200", // 系统资源 5200
  passportApi: "http://192.168.2.47:5200", // passport微服务API
  tokenApi: "http://192.168.2.47:5600",
  // authApi: "http://192.168.30.226:5200",
  // passportApi: "http://192.168.30.226:5200",

  //passportApi: 'https://api.g-parts.cn/gpart-passport-provider',
  uploadApi: "http://192.168.2.47:5100/file/uploadFile",
  upbase64Api: "http://192.168.30.179:5100/file/uploadFileNew",
  getFileApi: "https://devoms2.g-parts.cn",
  downApi: "http://api2.g-parts.cn/gpart-oss-provider",
  essentialApi: "https://api2.g-parts.cn/gpart-essential-provider", // 基础服务API
  // omsTpApi: "http://192.168.30.181:9290" //钉钉审批流程api
  omsTpApi: "https://tsapi2.g-parts.cn/oms-thirdparty-provider"
};


const test = {
  omsTask: "https://tsapi2.g-parts.cn/oms-task-provider",
  omsTask_h: "https://tsapi2.g-parts.cn/oms-task-provider-h",
  omsEdit: "https://tsapi2.g-parts.cn/oms-edi-provider",
  omsEdit_h: "https://tsapi2.g-parts.cn/oms-edi-provider-h",
  // omsEdit: "http://192.168.30.97:9220",//
  // omsEdit: "http://192.168.15.87:9220",//
  omstaxset:'https://tsapi2.g-parts.cn/oms-tax-provider', //
  omstaxset_h:'https://tsapi2.g-parts.cn/oms-tax-provider-h', //
  // omstaxset:'http://192.168.21.59:9400', //
  // omstaxset: "http://192.168.30.43:9400",//
  omsApi: "https://tsapi2.g-parts.cn/oms-lease-provider",
  omsApi_h: "https://tsapi2.g-parts.cn/oms-lease-provider-h",
  // omsApi:"http://192.168.30.144:9240",//
  // omsApi:"http://192.168.21.59:9240",//
  tokenApi: "https://tsapi2.g-parts.cn",
  tokenApi_h: "https://tsapi2.g-parts.cn-h",
  // tokenApi: "https://api2.g-part.cn",
  // wmsApi: "http://192.168.30.97:9250",//
  // wmsApi: "http://192.168.30.179:9250",//
  wmsApi: "https://tsapi2.g-parts.cn/oms-system-provider",
  wmsApi_h: "https://tsapi2.g-parts.cn/oms-system-provider-h",
  // wmsApi: "http://192.168.21.59:9250", //
  // wmsApi:"http://192.168.30.144:9250",//
  // wmsApi:"http://192.168.15.87:9250",//
  omsProduct: "https://tsapi2.g-parts.cn/oms-product-provider",
  omsProduct_h: "https://tsapi2.g-parts.cn/oms-product-provider-h",
  // omsProduct: "http://192.168.30.97:9200",//
  omsOrder: "https://tsapi2.g-parts.cn/oms-order-provider",
  omsOrder_h: "https://tsapi2.g-parts.cn/oms-order-provider-h",
  // omsOrder: "http://192.168.30.97:9210",//
  // omsOrder: "http://192.168.30.84:9210",//
  // omsOrder: "http://192.168.30.179:9210",//
  // omsOrder: "http://192.168.30.144:9210",//
  // omsOrder: "http://192.168.30.221:9210",//
  passportApi: "https://tsapi2.g-parts.cn/gpart-passport-provider",
  passportApi_h: "https://tsapi2.g-parts.cn/gpart-passport-provider-h",
  // passportApi: "http://192.168.30.97:5200",//
  essentialApi: "https://tsapi2.g-parts.cn/oms-essential-provider",
  essentialApi_h: "https://tsapi2.g-parts.cn/oms-essential-provider-h",
  // authApi: "http://192.168.30.97:5200",//
  // authApi: "http://192.168.15.65:5200",//
  // authApi: "http://192.168.15.87:5200",//
  authApi: "https://tsapi2.g-parts.cn/gpart-passport-provider",
  authApi_h: "https://tsapi2.g-parts.cn/gpart-passport-provider-h",
  // omsBatch: 'http://192.168.21.59:9260', //
  // omsBatch: 'http://192.168.15.65:9260', //
  // omsBatch: 'http://192.168.30.97:9260', //
  omsBatch: "https://tsapi2.g-parts.cn/oms-batch-provider",
  omsBatch_h: "https://tsapi2.g-parts.cn/oms-batch-provider-h",
  // omsSettle: "http://192.168.30.43:9270",//
  // omsSettle: "http://192.168.30.97:9270",//
  // omsSettle: "http://192.168.30.144:9270",//
  // omsSettle: "http://192.168.21.59:9270",//
  // omsSettle: "http://192.168.15.87:9270",//
  // omsSettle: "http://192.168.30.179:9270",//
  omsSettle: "https://tsapi2.g-parts.cn/oms-settlement-provider",//
  omsSettle_h: "https://tsapi2.g-parts.cn/oms-settlement-provider-h",//
  omsSotck: "https://tsapi2.g-parts.cn/oms-stock-provider",
  omsSotck_h: "https://tsapi2.g-parts.cn/oms-stock-provider-h",
  // omsSotck: "http://192.168.21.59:9280", //
  // omsSotck: "http://192.168.30.97:9280", //
  // omsSotck: "http://192.168.30.179:9280", //
  uploadApi:"https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFile",
  uploadApi_h:"https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFile-h",
  upbase64Api:"https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFileNew",
  upbase64Api_h:"https://tsapi2.g-parts.cn/gpart-essential-provider/file/uploadFileNew-h",
  getFileApi: "https://tsoms2.g-parts.cn",
  getFileApi_h: "https://tsoms2.g-parts.cn-h",
  downApi: "https://tsapi2.g-parts.cn/gpart-essential-provider",
  downApi_h: "https://tsapi2.g-parts.cn/gpart-essential-provider-h",
  omsTpApi: "https://tsapi2.g-parts.cn/oms-thirdparty-provider",
  omsTpApi_h: "https://tsapi2.g-parts.cn/oms-thirdparty-provider-h",
  // omsTpApi: "http://192.168.21.59:9290",
  templateApi:"https://tsapi2.g-parts.cn/gpart-essential-provider",
  templateApi_h:"https://tsapi2.g-parts.cn/gpart-essential-provider-h"
};

const audit = {
  omstaxset:'https://uatapi2.g-part.cn/oms-tax-provider', //财务系统微服务
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
  omsSettle: "https://uatapi2.g-part.cn/oms-settlement-provider",
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
  omstaxset:'https://uatapi2.g-part.cn/oms-tax-provider', //财务系统微服务
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
