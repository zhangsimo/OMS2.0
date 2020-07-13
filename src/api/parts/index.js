import axios from "@/libs/api.request";
import api from "_conf/url";

const resetData = treeData => {
  treeData.forEach(item => {
    item.title = item.name;
    item.selected = false;
    item.disabled = false;
    if (item.secendType && item.secendType.length > 0) {
      item.children = resetData(item.secendType);
    }
  });
  return treeData;
}

// 查询客服信息
export async function getCarPartClass() {
    let res = await axios.request({
      url: `${api.omsProduct}/partType/getCarClassifys`,
      method: "post",
    });

    let data =  resetData((res.data || []));

    return data;
}

//配件资料  关联配件  左侧全部配件数据
export function getAllParts(params,data){
  return axios.request({
    url:`${api.omsProduct}/partRelevance/findByPartRelevance`,
    method:"post",
    data,
    params
  })
}
//配件资料 关联配件  右侧已关联配件数据
export function getAlreadyParts(data){
  return axios.request({
    url:`${api.omsProduct}/partRelevance/findByPartId`,
    method:"post",
    data
  })
}
//配件资料 关联配件 多编码查询
export function getByManyCode(data){
  return axios.request({
    url:`${api.omsProduct}/partRelevance/findByPartRelevance`,
    method:"post",
    data
  })
}
//配件管理 关联配件 修改时调用的接口 partRelevanceVOList
export  function savePartChange(data){
  return axios.require({
    url:`${api.omsProduct}/partRelevance/saveOrUpdate`,
    method:"post",
    data
  })
}
// //一级分类二级分类接口
// export function getLevelList(){
//   return axios.request({
//     url:`${api.omsProduct}/partType/getCarClassifys`,
//     methods:"post"
//   })
// }

// //销售管理  添加配件  申请配件  配件资料  左侧全部配件数据
// export function getAllPartsSettle(params,data){
//   return axios.request({
//     url:`${api.omsProduct}/partRelevance/findByPartRelevance`,
//     method:"post",
//     data,
//     params
//   })
// }
