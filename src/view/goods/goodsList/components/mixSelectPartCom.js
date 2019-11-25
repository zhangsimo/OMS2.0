import {getAllBrand} from "_api/system/partsExamine/partsExamineApi";

import {getwbParts} from "_api/system/partManager";

export const mixSelectPartCom  = {
  data(){
    return {
      //配件查询分类
      searchType:'',
      searchTypeArr:[
        {
          value: "0",
          label: "编码"
        },
        {
          value: "1",
          label: "名称"
        },
        {
          value: "2",
          label: "车型"
        },
        {
          value: "3",
          label: "拼音"
        }
      ],
      //查询关键字
      searchValue:'',
      //所有配件品牌
      selectBrand:'',
      partBrandData:[
        {
          "label":"全部",
          "value":"9999"
        }
      ],
    }
  },
  mounted(){
    this.getPartBrandAll();
    this.getWbPartsFun();
  },
  methods:{
    getWbPartsFun(){
      let req = {}
      getwbParts(req).then(res => {

      })
    },

    //获取配件品牌
    getPartBrandAll(){
      getAllBrand({page: 1,pageSize: 1000}).then(res => {
        let filterData = res.data.content.filter(item => item.quality=='品牌件')
        console.log(filterData)
        if(filterData.length>0){
          if(filterData[0].children&&filterData[0].children.length>0){
            filterData[0].children.map(item => {
              let objData = {}
              objData.label = item.name
              objData.value = item.code
              this.partBrandData.push(objData)
            })
          }
        }
      })
    }
  }
}
