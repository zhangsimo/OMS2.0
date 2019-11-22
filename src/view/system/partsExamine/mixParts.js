import {getCarBrandAll,getCarModel,getCarSeries,setApproval} from "_api/system/systemSetting/Initialization";

import {getAllBrand,getCarClassifys,getCarPartName} from "_api/system/partsExamine/partsExamineApi";
export const minxParts = {
  data(){
    return {
      //配件资料层车型obj
      carObj:{
        selectCarBrand:'',
        carBrandData:[],
        selectCarSystem:'',
        carSystemData:[],
        selectCarModel:'',
        carModelData:[]
      },
    }
  },
  mounted(){
    // this.getCarBrand()
  },
  methods:{
    getCarBrand(){
      let req = {}
      req.page = 1;
      req.pageSize = 500;
      getCarBrandAll(req).then(res => {
        this.carObj.carBrandData = res.data.content
      })
    },
    getCarSystem(){
      let req = {}
      req.nameEn = this.carObj.selectCarBrand
      getCarSeries(req).then(res => {
        this.carObj.carSystemData = res.data;
        this.carObj.carModelData = [];
        this.carObj.selectCarModel = '';
      })
    },
    getCarModelFun(){
      let req = {}
      req.carLineName = this.carObj.selectCarSystem;
      req.page = 1;
      req.pageSize = 200;
      getCarModel(req).then(res => {
        let arrData = res.data.content||[]
        let arr2 = []
        for(let k in arrData){
          arr2.push(...arrData[k])
        }
        this.carObj.carModelData = arr2
      })
    },
    //提交审批
    submit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let objReq = {}
          objReq.qualityTypeId = this.formValidate.qualityTypeId
          objReq.partBrandId = this.formValidate.partBrandId
          objReq.code = this.formValidate.code
          objReq.name = this.formValidate.name
          objReq.unit = this.formValidate.unit
          objReq.oemCode = this.formValidate.oemCode
          objReq.spec = this.formValidate.spec
          objReq.model = this.formValidate.model
          objReq.applyCarbrandId = this.formValidate.applyCarbrandId
          objReq.commonCode = this.formValidate.commonCode
          objReq.produceFactory = this.formValidate.produceFactory
          objReq.origin = this.formValidate.origin
          objReq.fullName = this.formValidate.fullName
          objReq.customClassName = this.formValidate.customClassName
          objReq.remarks = this.formValidate.remarks


          setApproval(objReq).then(res => {
            if(res.code==0){
              this.proModal = false
              this.$Message.success("添加成功")
              this.getList()
            }
          })
        }
      })
    },
    //获取品牌品质
    getQuiltyAndBrand(){
      getAllBrand({page: 1,pageSize: 200}).then(res => {
        if(res.code==0){
          this.qualityArr = res.data.content||{}
        }
      })
    },
    //根据品质获取品牌
    qualityGetBrand(){
      let arrData = this.qualityArr.filter(item => item.qualityCode==this.formValidate.qualityTypeId)
      if(arrData.length>0){
        this.brandArr = arrData[0].children
      }
    },
    //获取选中配件名称
    getSearchPartName(v){
      this.formValidate.name = v.name
    }
  }
}
