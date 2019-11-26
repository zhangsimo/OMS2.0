import {getPurchaseInit} from "_api/purchasing/purchasePlan";

export const mixGoodsData = {
  data(){
    return {
      //计划采购信息
      formPlan: {
        supplyName: '',//供应商
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
          { required: true,message: '计划采购日期不能为空', trigger: 'blur' },
        ],
        planner: [
          { required: true, message: '计划员不能为空', trigger: 'blur' }
        ],
      },
      tableData:[
        {id:1,num:0,price:0},
        {id:1,num:0,price:0},
      ],
      //待删除数据
      delArr:[]
    }
  },
  mounted(){
    getPurchaseInit({}).then(res => {

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
    //获取供应商
    getSupplierName(v){
      this.formPlan.supplyName = v.fullName||""
      console.log(v)
    },
    //选择日期
    setDataFun(v){
      this.formValidate.planDate = v
      console.log(this.formValidate.planDate)
    }
  },
}
