import env from "./env";

const dev = {
  wms: "https://wms.g-parts.cn/",
  wmsTokenApi: "https://api.g-parts.cn" // 登录接口API
};
const test = {
  wms: "https://tswms.g-parts.cn/",
  wmsTokenApi: "https://tsapi.g-parts.cn"
};
const audit = {
  wms: "https://uatwms.g-parts.cn/",
  wmsTokenApi: "https://uatapi.g-parts.cn"
};
const pro = {
  wms: "https://wms.g-part.cn/",
  wmsTokenApi: "https://api.g-part.cn"
};

let systemUri = { dev, test, audit, pro };

export default systemUri[env];