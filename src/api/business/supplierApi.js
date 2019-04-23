import axios from '@/libs/api.request'

export function getSupplierList(data) {
  return axios.request({
    url: '/partner/findPartnerByDynamicQuery',
    method: 'post',
    params: data.params,
    data: data.initBody
  })
}

