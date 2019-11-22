import {getCarBrandAll,getCarModel,getCarSeries,setApproval} from "_api/system/systemSetting/Initialization";

import {getAllBrand,getCarClassifys,getCarPartName} from "_api/system/partsExamine/partsExamineApi";
export const minxParts = {
  data(){
    return {

    }
  },
  mounted(){
    // this.getCarBrand()
  },
  methods:{

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

  }
}
