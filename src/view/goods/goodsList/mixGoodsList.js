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
        {id:1,num:0,price:0},
        {id:1,num:0,price:0},
      ]
    }
  },
  methods:{
    editActivedEvent ({ row, column }, event) {
      //console.log(`打开 ${column.title} 列编辑`)
    },
    editClosedEvent ({ row, column }, event) {
      //console.log(row,event,column)
      //console.log(`关闭 ${column} 列编辑`)
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
    }
  }
}
