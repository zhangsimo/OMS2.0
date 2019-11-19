export const mixGoodsData = {
  data(){
    return {
      //计划采购信息
      formPlan: {
        supplyName: '',//供应商
        planDate: '',//计划日期
        planner: '',//计划人
        remark: '',//备注
        billType: '',//票据类型
        hairShop: '',//直发门店
        planOrderNum: '',//计划单号
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
        {id:1},
        {id:1}
      ]
    }
  },
  methods:{
    editActivedEvent ({ row, column }, event) {
      console.log(`打开 ${column.title} 列编辑`)
    },
    editClosedEvent ({ row, column }, event) {
      console.log(row,event,column)
      //console.log(`关闭 ${column} 列编辑`)
    }
  }
}
