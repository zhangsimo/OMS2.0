export const purchaseTypeList = (v) => {
  let dataArr = [
    {
      'label':'所有',
      'value':0
    },
    {
      'label':'草稿',
      'value':1
    },
    {
      'label':'审批中',
      'value':2
    },
    {
      'label':'已审批',
      'value':3
    },
    {
      'label':'已完成',
      'value':4
    },
    {
      'label':'不通过',
      'value':5
    },
    {
      'label':'已作废',
      'value':6
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
