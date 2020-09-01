import env from "./env";

const dev = {
  wms: "https://wms.g-parts.cn/",
  wmsTokenApi:"http://192.168.2.47:5600", // 登录接口API
};
const test = {
  wms: "https://wmsfoms.g-parts.cn",
 wmsTokenApi: 'https://tsapi2.g-parts.cn',
};
const audit = {
  wms: "https://uatwms.g-parts.cn/",
  wmsTokenApi: "https://uatapi2.g-part.cn",
};
const pro = {
  wms: "https://wms.g-part.cn/",
  wmsTokenApi: "https://api2.g-part.cn",
};
// const pro = {
//   wms: "https://wms.g-part.cn/",
//   wmsTokenApi: "https://api.g-parts.cn",
// };

let systemUri = { dev, test, audit, pro };

export default systemUri[env];
