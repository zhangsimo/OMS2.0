export const proTypeList = (v) => {
  let dataArr = [
    {
      'label':'功能模块',
      'value':0
    },
    {
      'label':'接口调用',
      'value':1
    },
  ]
  if(v||v===0){
    let filterData = dataArr.filter(item => item.value===v)
    if(filterData.length>0){
      return filterData[0].label
    }
  }else{
    return dataArr
  }
}
