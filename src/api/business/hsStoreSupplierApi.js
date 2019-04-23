import axios from '@/libs/api.request'


/**
 * 分页查询 get /supplyStore/queryAll
 * 绑定 post  /supplyStore/save
 * 解绑 post /supplyStore/delete
 *
 * get  /supplyPartner//findAllSupplyPartner  一级供应商
 * 华胜门店  get  /store/findByStoreNo  storeNo  cropId
 *
 * 主要这三个参数 parentSupplyId  supplyNo storeNo
 *
 *  /supplyStore/findPartners
 *
 */

export function queryAll(params) {
  return axios.request({
    url: '/store/queryAll',
    method: 'get',
    params
  })
}

export function findAllSupplyPartner(params) {
  return axios.request({
    url: '/supplyPartner/findAllSupplyPartner',
    method: 'get',
    params
  })
}

export function findByStoreNo(storeNo) {
  return axios.request({
    url: '/store/findByStoreNo',
    method: 'get',
    params: {
      cropId: 3,
      storeNo
    }
  })
}

export function save(data) {
  return axios.request({
    url: '/supplyStore/save',
    method: 'post',
    data
  })
}

export function del(data) {
  return axios.request({
    url: '/supplyStore/delete',
    method: 'post',
    data
  })
}
