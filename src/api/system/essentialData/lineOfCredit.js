import api from '_conf/url'
import axios from '@/libs/api.request'

//获取当前页表格数据
export function getTableList (data={}) {
  return axios.request({
    url: `${api.wmsApi}/guestAdjust/findPageByDynamicQuery`,
    method: 'post',
    data
  })
}




