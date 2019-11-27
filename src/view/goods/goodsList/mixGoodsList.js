import {getPurchaseInit,saveDraft} from "_api/purchasing/purchasePlan";

export const mixGoodsData = {
  data(){
    return {
      //计划采购信息
      formPlan: {
        supplyName: '',//供应商
        guestId:'',//供应商id

        planDate: '',//计划日期
        planner: this.$store.state.user.userData.staffName||'',//计划人
        remark: '',//备注
        billType: '',//票据类型
        hairShop: '',//直发门店
        planOrderNum: '新计划采购',//计划单号
        otherPrice: 0,//其他费用
        totalPrice:0,//合计总金额
      },
      rulePlan: {
        supplyName: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        planDate: [
          { required: true, type: 'date', message: '计划采购日期不能为空', trigger: 'change' },
        ],
        planner: [
          { required: true, message: '计划员不能为空', trigger: 'blur' }
        ],
        billType: [
          { required: true, type:'number', message: '票据类型不能为空', trigger: 'change' }
        ],
      },
      tableData:[
        {id:1,num:0,price:0},
        {id:1,num:0,price:0},
      ],
      //待删除数据
      delArr:[],
      //票据类型
      invoiceMap:[],
      //直发门店
      companyMap:[],
    }
  },
  mounted(){
    getPurchaseInit({}).then(res => {
      //票据类型
      let invoiceMap = res.data.invoiceMap||{};
      if(invoiceMap){
        for(let v in invoiceMap){
          let objData = {
            "label":v,
            "value":invoiceMap[v]
          }
          this.invoiceMap.push(objData);
        }
      }
      //直发门店
      let companyMap = res.data.companyMap||{};
      if(companyMap){
        for(let v in companyMap){
          let objData = {
            "label":v,
            "value":companyMap[v]
          }
          this.companyMap.push(objData)
        }
      }
    })
  },
  methods:{
    //采购计划列表选中数据
    selectVxeData({selection,rowIndex,reserves}){
      console.log(selection)
      this.delArr = selection
    },
    delTableData(){
      if(this.delArr.length==0){
        this.$message.error("选择要删除的数据");
      }else{
        this.delArr.map(item => {
          this.tableData.map((v2,i) => {
            if(item.id==v2.id){
              this.tableData.splice(i,1)
            }
          })
        });
        this.delArr = []
      }
    },
    addFooter({ columns, data }){
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['num', 'price'].includes(column.property)) {
            return this.sum(data,column.property)
          }
          return null
        })
      ]
    },
    sum(data,type){
      let total = 0
      data.map(item => {
        let value = item[type]
        if(!value){
          value = 0
        }
        total+=parseFloat(value)
      })
      if(type=='price'){
        return total.toFixed(2);
      }
      return total
    },
    //添加配件数据
    getPartNameList(v){
      console.log(v)
      this.tableData = this.tableData.concat(v)
    },
    //获取选中供应商
    getSupplierName(v){
      //赋值供应商名称
      this.formPlan.supplyName = v.fullName||"";
      //赋值供应商id
      this.formPlan.guestId = v.guestId||"";
      //赋值票据类型id
      this.formPlan.billType = v.billTypeId||"";
    },
    //选择日期
    setDataFun(v){
      // this.formValidate.planDate = v
      console.log(this.formValidate.planDate)
    },
    //保存采购计划信息
    submit (name) {
      console.log(name)
      this.$refs[name].validate((valid) => {
        if (valid) {
          let objReq = {}
          objReq.guestId = this.formValidate.guestId
          objReq.orderDate = this.formValidate.planDate
          saveDraft(objReq).then(res => {
            if(res.code==0){
              this.proModal = false
              this.$Message.success("添加成功")
              this.getList()
            }
          })
        }
      })
    },
  },
}
