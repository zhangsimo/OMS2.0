import  moment from 'moment'
import selectOther from '../popWindow/SelectOther'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getOtherSve} from '_api/documentApproval/OtherPayment.js'

export default {
  name: "OtherPayment",
  components:{
    selectOther,
    upphoto,
    flowbox
  },
  props:{
    list:''
  },
  data(){
    return {
      model: false, //模态框开关
      modelType: false, //模态框打开模式 0-新增 1-编辑 3-查看
      formInline:{
      },//所有数据对象
      //表单校验
      ruleValidate: {
        topic: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        applyAmt:[
          {required: true, message: '申请费用为必填', trigger: 'blur'},
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        receiveGuestId:[
          {required: true, message: '往来单位', trigger: 'change'}
        ],
        receiver:[
          {required: true, message: '收款人账户必填', trigger: 'change'}
        ],
        receiveBank:[
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        paymentTerm:[
          {required: true,type: 'date',  message: '付款期限必填', trigger: 'change'}
        ],
        receiveBankNo:[
          {required: true, message: '开户账号必填', trigger: 'blur'}

        ],
        paymentAccount:[
          {required: true, type:'string', message: '付款账户必选', trigger: 'change'}

        ]
        // BankNo:[
        //   {required: true, message: '银行账号必填', trigger: 'blur'}
        // ]
      },
      //费用支出表格的数据校验
      documentTableData:[],//借支核销表格数据
      payeeList:[],//收款人列表
      payUserList:[],//付款人列表
      company:[],//往来单位
    }
  },
  mounted(){
  },

  methods:{
    //模态框打开111
   open(){
    this.company = this.list.salesList
     this.payUserList = this.list.payList

     if (this.list.type == 1) {
        this.formInline = {}
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
        this.formInline.applyTypeName = '其他付款'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = user.shopName
      }
    },

    //获取往来单位
    getCompany(row) {
      let arr = this.company.filter( item => item.value == row.value)
      this.formInline.receiver = arr[0].receiver || ''
      this.formInline.receiveBank = arr[0].receiveBank || ''
      this.formInline.receiveBankNo = arr[0].receiveBankNo || ''
    },


    //打开选择模态框
    openSelect(){
      this.$refs.request.open()
    },


    //删除行
    dele(row){
      // this.$refs.xTable.remove(this.expenditureTableData[row.seq - 1])
      this.formInline.details.splice((row.seq - 1) , 1)
    },

    //获取其他付款单据信息
    otherPayList(row){
      delete row.id
      this.$set(this.formInline, "details", [row]);
    },

    //选择单据
    SelectTheDocuments(){
      this.$refs.documnets.open()
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

    //保存提交
    save(type){

     this.$refs.formInline.validate( async (valid) => {
       if (valid) {
         this.formInline.step = type
         let res = await getOtherSve(this.formInline)
         if (res.code == 0) {
           this.$Message.success('操作成功')
           this.model = false
         }
       } else {
         this.$Message.error('带*必填');
       }
     })



    }



  }
}
