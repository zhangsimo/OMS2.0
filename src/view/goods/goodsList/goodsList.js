export const purchaseTypeList = (v) => {
  let dataArr = [{
      "label": "所有",
      "value": 9999
    },
    {
      "label": "草稿",
      "value": 0
    },
    {
      "label": "审批中",
      "value": 1
    },
    {
      "label": "已审批",
      "value": 2
    },
    {
      "label": "已完成",
      "value": 3
    },
    {
      "label": "不通过",
      "value": 4
    },
    {
      "label": "已作废",
      "value": -1
    },
  ]
  if (v || v === 0) {
    let filterData = dataArr.filter(item => item.value === v)
    if (filterData.length > 0) {
      return filterData[0].label
    }
  } else {
    return dataArr
  }
}
