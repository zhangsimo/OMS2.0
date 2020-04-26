import  moment from 'moment'
import requestCode from '../popWindow/RequestCode'
import subject from '../popWindow/Subject'
import selectTheDocuments from '../popWindow/SelectTheDocuments'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getDictionary , getExpSve} from '_api/documentApproval/ExpenseReimbursement'



export default {
  name: "ExpenseReimbursement",
  components:{
    requestCode,
    subject,
    selectTheDocuments,
    upphoto,
    flowbox
  },
  // inject:['modelType'],
  props:{
    list:''
  },
  data(){
    const roleValid = (rows) => {
      if(rows.cellValue && rows.row.applyAmt < rows.cellValue)
        return Promise.reject(new Error('核销金额不能大于借支金额'))
    }
    return {
      model: false, //模态框开关
      modelType:false, //模态框打开模式 0-新增false 1-编辑false 2-查看true 3-审核true
      formInline:{

      },//所有数据对象
      //表单校验
      ruleValidate: {
        topic: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        receiverId:[
          {required: true, message: '收款人账户为必填', trigger: 'change'}
        ],
        receiveBank:[
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        paymentAccount:[
          {required: true, type:'string', message: '付款账户必选', trigger: 'change'}
        ],
        receiveBankNo:[
          {required: true, message: '银行账号必填', trigger: 'blur'}
        ]
      },

      //费用类型列表
      moneyTypeList:[],
      subjectType:{},//当前费用类型
      details:[],
      taxRate:[],//税率
      //费用支出表格的数据校验
      validRules:{
        summary:[
          { required: true, message: '必填' },
        ],
        taxRateCode:[
          { required: true, message: '必填' },
        ],
        accountEntry:[
          { required: true, message: '必填' },
        ],
        totalAmt:[
          { required: true, message: '必填' },
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        taxAmt:[
          { required: true, message: '必填' },
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        noTaxAmt:[
          { required: true, message: '必填' },
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        writeOffAmt:[
          { required: true, message: '必填' },
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'},
          { validator: roleValid }
        ]
      },
      documentTableData:[],//借支核销表格数据
      moneyTableData:[],//费用明细表格数据
      payeeList:[],//收款人列表
      payUserList:[],//付款人列表
    }
  },
  mounted(){
  },
  computed:{
    aggregateCosts:function () {
      if (this.formInline.expenseDetails && this.formInline.expenseDetails.length > 0){
        return this.$utils.sum(this.formInline.expenseDetails , 'totalAmt')
      }
      return 0
    },
    businessMoney:function () {
      if(this.details && this.details.length > 0){
        return this.$utils.sum(this.details,'applyAmt')
      }
      return 0
    },
    company:function () {
     let agg =  this.aggregateCosts,
          bus = this.businessMoney,
          sum = this.$utils.subtract(agg , bus)
      if (sum < 0) {
        return 0
      } else {
        return sum
      }
    },
    personage: function () {
      let agg =  this.aggregateCosts,
        bus = this.businessMoney,
        sum = this.$utils.subtract(agg , bus)
      if (sum > 0) {
        return 0
      } else {
        return this.$utils.subtract(bus , agg)
      }
}
  },
  methods:{
    //模态框打开111
   async open(){
       this.payeeList = this.list.allSalesList
       this.payUserList = this.list.payList

     this.getRate()
     this.getTaxList()

      if (this.list.type == 1) {
        this.formInline = {}
        this.details = []
        let arr = [
          {expenseType:'FY001',totalAmt:0,taxRateCode:'TR001',taxAmt:0},
          {expenseType:'FY001',totalAmt:0,taxRateCode:'TR001',taxAmt:0},
          {expenseType:'FY001',totalAmt:0,taxRateCode:'TR001',taxAmt:0},
          {expenseType:'FY001',totalAmt:0,taxRateCode:'TR001',taxAmt:0},
        ]
        this.$set(this.formInline ,'expenseDetails' ,  arr )
        this.$refs.upImg.uploadListModal = []
        this.$refs.upImg.uploadList = []
        this.$refs['formInline'].resetFields();
        this.model = true
        //判断模态框状态
        this.modelType = false
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups[user.groups.length - 1].name || ' 　　'
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = user.shopName
        this.formInline.applyTypeName = '费用报销'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = user.shopName
      }
    },

    //获取费用类型
    async getRate(){
     let data = {}
     data.dictCode = 'FYLX'
     let res = await getDictionary(data)
      if(res.code === 0) {
        this.moneyTypeList = res.data
      }
    },

    //获取税率
    async getTaxList(){
      let data = {}
      data.dictCode = 'TaxRate'
      let res = await getDictionary(data)
      if(res.code === 0) {
        this.taxRate = res.data
      }
    },

    //获取往来单位
    getCompany(row) {
      let arr = this.payeeList.filter( item => item.value == row.value)
      this.formInline.receiveBank = arr[0].receiveBank || ''
      this.formInline.receiveBankNo = arr[0].receiveBankNo || ''
    },


    //判断表格是否可以编辑
    editActivedEvent({row}){
      let xTable = this.$refs.xTable
      let isDisable = false
      // let nameColumn = xTable.getColumnByField('name')
      // let tax = xTable.getColumnByField('tax')
      // let subjectType = xTable.getColumnByField('subjectType')
      // nameColumn.editRender.attrs.disabled = isDisable
      // tax.editRender.attrs.disabled = isDisable
      // subjectType.editRender.attrs.disabled = isDisable
    },

    //打开选择模态框
    openSelect(){
      this.$refs.request.open()
    },

    //获取选择的信息
    getBackList(row){
      this.$set(this.formInline,'requestInstructionNo' ,row.applyNo  )
    },

    //科目获取焦点
    getSubject({row}){
      this.subjectType = row
      this.$refs.subjectModel.open()
    },

    //获取科目返回的数据
    getsubBack(row){
     this.$set(this.subjectType , 'accountEntry', row.titleCode)
      // 刷新列表方法
      this.$refs.xTable.refreshColumn()
    },

    //修改费用类型改变科目
    changeExpenseType({row}){
      row.accountEntry = ''
    },

    //价税合计变更计算
    gettotal(v){
      let row = v.row,
        column = v.column

      let tax = this.taxRate.filter(item => item.itemCode == row.taxRateCode)
      let str = 0
      if(tax[0].itemName != '0%') {
        str = tax[0].itemName.replace('%', '')
        str = str/100
      }
      row.taxAmt = this.$utils.multiply(column.model.value ,str ).toFixed(2)
    },

    //税率变更计算
    getTax(v){
      let row = v.row,
        column = v.column
      // editRender model
      let tax = this.taxRate.filter(item => item.itemCode == column.model.value)
      let str = 0
      if(tax[0].itemName != '0%') {
        str = tax[0].itemName.replace('%', '')
        str = str/100
      }

      //
      row.taxAmt = this.$utils.multiply(row.totalAmt , str ).toFixed(2)
    },

    //判断手动输入税额
    taxCanuse(v){
      let row = v.row,
          column = v.column,
          tax = this.taxRate.filter(item => item.itemCode == row.taxRateCode)
      let str = 0
      if(tax[0].itemName != '0%') {
        str = tax[0].itemName.replace('%', '')
        str = str/100
      }
      let taxMoney = this.$utils.multiply(row.totalAmt ,str ).toFixed(2)
      let diff = this.$utils.subtract(column.model.value , taxMoney)
      if (diff > 0.01) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>税额有误差，是否确认提交</p>',
          onOk: () => {

          },
          onCancel: () => {
            row.taxAmt = taxMoney
          }
        });
      }
    },


    //删除行
    dele(row){
      this.formInline.expenseDetails.splice((row.seq - 1) , 1)
    },

    //添加行
    addRow(){
      let data = {}
      data.expenseType = 'FY001'
      data.totalAmt = 0
      data.taxRateCode = 'TR001'
      data.taxAmt = 0
      this.formInline.expenseDetails.push(data)
    },

    // 表格尾部合计
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalAmt','taxAmt','noTaxAmt'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          return null
        })
      ]
    },

    //删除行借支核销
    deleteDetails(row){
      this.details.splice((row.seq - 1) , 1)

    },

    //借支核销尾部合计
    documentFooterMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['writeOffAmt','applyAmt'].includes(column.property)) {
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

    //获取到因公数据
    getBusinessList(row){
      row.map(item => {
        delete item.id
        item.borrowDate = item.applyTime || ''
        item.serviceId = item.applyNo || ''
      })
      this.details = row
      // this.$set(this.formInline,'details' , row)
    },

    //获取付款信息
    getPayList(value){
      let list = this.payUserList.filter(item => item.id == value)[0]
      this.formInline.payName = list.bankName
      this.formInline.pauUser = list.accountCode
    },


    //获取到上传图片地址
    getImgList(row){
      this.formInline.voucherPictures = row.list
    },

    //保存审核
    save(type){

      this.$refs.formInline.validate( async (valid) => {
        if (valid) {
          const errMap = await this.$refs.xTable.fullValidate().catch(errMap => errMap)
          const errTwo = await this.$refs.documentTable.fullValidate().catch(errTwo => errTwo)
          if (errMap || errTwo){
            this.$Message.error('表格校验失败')
          } else {
            this.formInline.step = type
            this.formInline.details = this.details
            let res = await getExpSve(this.formInline)
            if (res.code == 0) {
              this.$Message.success('操作成功')
              this.model = false
            }
          }
        } else {
          this.$Message.error('带*必填');
        }
      })



    }

  }
}
