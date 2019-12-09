import api from "_conf/url";
import axios from "@/libs/api.request";

export function getLeftList (data={}) {
  return axios.request({
    url: `${api.omsOrder}/pchsEnterMain/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}

