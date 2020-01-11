import axios from "@/libs/api.request";
import api from "_conf/url";

// 配件类型树
export function findAllByTree(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/partType/findAllByTree`,
    method: "post",
    data
  });
}

// 平台配件资料
export function attrQueryAll(params, data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/findPage`,
    method: "post",
    params,
    data
  });
}

// 本地配件资料
export function attrQueryAllPage(params, data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/findAllPage`,
    method: "post",
    params,
    data
  });
}

// 平台配件资料-系统管理员
export function sysAll(params, data) {
  return axios.request({
    url: `${api.wmsApi}/attribute/queryAll`,
    method: "post",
    params,
    data
  });
}

// 配件品牌/品质查询 parentId=0品质 其他品牌
export function getPartBrand(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/partBrand/findAll`,
    method: "post",
    data
  });
}

// wb配件类型树
export function findWbAllByTree(data = { pageSize: 1000, page: 0 }) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getCarClassifys`,
    method: "post",
    data
  });
}

// wb品质/品牌查询
export function getWbPartBrand(data = { pageSize: 1000, page: 0 }) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getPartBrand`,
    method: "post",
    data
  });
}

// wb配件资料
export function getwbParts(params, data) {
  return axios.request({
    url: `${api.wmsApi}/wbParts/queryAll?page=${params.page}&size=${params.size}`,
    method: "post",
    params,
    data
  });
}

// wb品牌
export function getwbBands(data = { pageSize: 100, page: 0 }) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getBrands`,
    method: "post",
    data
  });
}

// wb审批接口
export function approval(data) {
  return axios.request({
    url: `${api.wmsApi}/partApply/saveByPart`,
    method: "post",
    data
  });
}

// 启用
export function toggleDis(id) {
  return axios.request({
    url: `${api.wmsApi}/part/disabled`,
    method: "get",
    params: { id }
  });
}

// 可售
export function toggleSale(id) {
  return axios.request({
    url: `${api.wmsApi}/part/sell`,
    method: "get",
    params: { id }
  });
}

// 通过主键查询-配件资料
export function findbyidInfo(id) {
  return axios.request({
    url: `${api.wmsApi}/part/findById`,
    method: "get",
    params: { id }
  });
}

// 适用车型
export function findCarModel(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getCarModel`,
    method: "post",
    data
  });
}

// 自定义分类
export function classification() {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCustomAll`,
    method: "get"
  });
}

// 单位换算
export function getdictCode() {
  return axios.request({
    url: `${api.omsProduct}/dictionaries/findByCode?dictCode=UNIT_CODE_001`,
    method: "get"
  });
}

// 配件名称
export function getPartName(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/wbPub/getPartStandardName`,
    method: "post",
    data
  });
}

// 配件名称保存
export function savePartName(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/partName/saveOrUpdate`,
    method: "post",
    data
  });
}

//保存配件管理(新增或修改)
export function savePart(data = {}) {
  return axios.request({
    url: `${api.wmsApi}/attribute/save`,
    method: "post",
    data
  });
}

// 本地配件资料
export function getLocalParts(params) {
  return axios.request({
    url: `${api.wmsApi}/part/queryAll`,
    method: "get",
    params
  });
}

// 导入地址
export const upxlxs = `${api.wmsApi}/attribute/import`;
