import  moment from 'moment'
import requestCode from '../RequestCode'
import subject from '../Subject'
import selectTheDocuments from '../SelectTheDocuments'
import upphoto from '../Upphoto'
export default {
  name: "ExpenseReimbursement",
  components:{
    requestCode,
    subject,
    selectTheDocuments,
    upphoto
  },
  props:{
    list:''
  },
  data(){
    return {
      model: false, //模态框开关
      formInline:{},//所有数据对象
      //表单校验
      ruleValidate: {
        use: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        payee:[
          {required: true, message: '主题为必填', trigger: 'change'}
        ],
        bankName:[
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        // BankNo:[
        //   {required: true, message: '银行账号必填', trigger: 'blur'}
        // ]
      },
      expenditureTableData:[
        {name:'zs',sex:1,subjectType:'选择会计科目',num:12,tax:1},
        {name:'ls',sex:1,subjectType:'选择会计科目',num:12,tax:1},
        {name:'we',sex:1,subjectType:'选择会计科目',num:12,tax:1},
        {name:'zz',sex:1,subjectType:'选择会计科目',num:12,tax:1},

      ],//支出表格数据
      //费用类型列表
      moneyTypeList:[
        {name:"买入",id:"1"},
        {name:"支出",id:"3"},
        {name:"赊账",id:"4"},
      ],
      moneyType:'123',//当前费用类型
      taxRate:[
        {name:'0' , id:0},
        {name:'1%' , id:1},
        {name:'3%' , id:2},
        {name:'5%' , id:3},
        {name:'6%' , id:4},
      ],//税率
      //费用支出表格的数据校验
      validRules:{
        name:[
          { required: true, message: '必填' },
        ],
        sex:[
          { required: true, message: '必填' },
        ],
        notax:[
          { required: true, message: '必填' },
        ]
      },
      documentTableData:[],//借支核销表格数据
      moneyTableData:[],//费用明细表格数据
      payeeList:[],//收款人列表
    }
  },
  methods:{
    //模态框打开111
    open(){
      // console.log(this.list)
      this.formInline = {}
      this.$refs.upImg.uploadListModal =[]
      this.$refs.upImg.uploadList = []
      this.$refs['formInline'].resetFields();
      this.model = true
      let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        user = this.$store.state.user.userData
      this.formInline.staffName = user.staffName
      this.formInline.tenantCompanyName = user.tenantCompanyName|| ' 　　'
      this.formInline.shopCode = user.shopCode || ' 　　'
      this.formInline.shopName = user.shopName
      this.formInline.type = '费用报销'
      this.formInline.date = date
    },

    //打开选择模态框
    openSelect(){
      this.$refs.request.open()
    },

    //获取选择的信息
    getBackList(row){
      // console.log(row ,789)
    },

    //科目获取焦点
    getSubject({row}){
      // console.log(row , 888)
      this.moneyType = row.sex
      this.$refs.subjectModel.open()
    },

    //获取科目返回的数据
    getsubBack(row){
      // console.log(row ,789)
    },

    //价税合计变更计算
    gettotal(v){
      let row = v.row,
        column = v.column
      let tax = this.taxRate.filter(item => item.id == row.sex)
      let str = 0
      if(tax[0].name != '0') {
        str = tax[0].name.replace('%', '')
        str = str/100
      }
      row.taxmoney = this.$utils.multiply(column.model.value ,(1 - str) )
    },

    //税率变更计算
    getTax(v){
      let row = v.row,
        column = v.column
      // editRender model
      let tax = this.taxRate.filter(item => item.id == column.model.value)
      let str = 0
      if(tax[0].name != '0') {
        str = tax[0].name.replace('%', '')
        str = str/100
      }
      //
      row.taxmoney = this.$utils.multiply(row.num ,(1 - str) )
    },



    //删除行
    dele(row){
      // this.$refs.xTable.remove(this.expenditureTableData[row.seq - 1])
      this.expenditureTableData.splice((row.seq - 1) , 1)
      console.log(this.expenditureTableData , 789)
    },

    //添加行
    addRow(){
      let data = {}
      data.sex = 1
      data.subjectType = '选择会计科目'
      data.tax = 0
      this.expenditureTableData.push(data)
    },

    // 表格尾部合计
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['num','taxmoney','notax'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          return null
        })
      ]
    },

    //借支核销尾部合计
    documentFooterMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['money'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          return null
        })
      ]
    },

    //选择单据
    SelectTheDocuments(){
      this.$refs.documnets.open()
    },

    //获取到上传图片地址
    getImgList(row){
      // console.log(row.list ,789)
    }



  }
}
