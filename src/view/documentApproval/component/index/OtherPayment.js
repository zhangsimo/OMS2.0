import  moment from 'moment'
import requestCode from '../RequestCode'
import selectOther from '../SelectOther'
import upphoto from '../Upphoto'
import flowbox from '../Flow'

export default {
  name: "ExpenseReimbursement",
  components:{
    requestCode,
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
      modelType:0, //模态框打开模式 0-新增 1-编辑 3-查看
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
        payMoney:[
          {required: true,type: 'date',  message: '付款期限必填', trigger: 'change'}
        ]
        // BankNo:[
        //   {required: true, message: '银行账号必填', trigger: 'blur'}
        // ]
      },
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
      documentTableData:[],//借支核销表格数据
      payeeList:[],//收款人列表
      payUserList:[],//付款人列表
    }
  },
  methods:{
    //模态框打开111
    open(){
      if (this.list.type == 1) {
        this.formInline = {}
        this.$refs.upImg.uploadListModal = []
        this.$refs.upImg.uploadList = []
        this.$refs['formInline'].resetFields();
        this.model = true
        //判断模态框状态
        this.modelType = 1
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.staffName = user.staffName
        this.formInline.tenantCompanyName = user.groups[user.groups.length - 1].name || ' 　　'
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.shopName = user.shopName
        this.formInline.type = '费用报销'
        this.formInline.date = date
      }
    },



    //打开选择模态框
    openSelect(){
      this.$refs.request.open()
    },

    //获取选择的信息
    getBackList(row){
      // console.log(row ,789)
    },

    //删除行
    dele(row){
      // this.$refs.xTable.remove(this.expenditureTableData[row.seq - 1])
      this.documentTableData.splice((row.seq - 1) , 1)
    },

    //获取其他付款单据信息
    otherPayList(row){
      this.documentTableData = [row]
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
