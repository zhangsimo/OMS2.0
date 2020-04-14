//====================  其他应收款管理  ========================
import axios from "@/libs/api.request";
import api from "_conf/url";

// 获取主表
export function findByDynamicQuery(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/findByDynamicQuery`,
    method: "post",
    data
  });
}

//认领核销
export function withdraw(data) {
  return axios.request({
    url: `${api.omsSettle}/otherCollectAmt/withdraw`,
    method: "get",
    data
  });
}
