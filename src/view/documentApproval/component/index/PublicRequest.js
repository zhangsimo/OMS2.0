import  moment from 'moment'
import requestCode from '../RequestCode'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getPayList} from "../utils";

export default {
  name: "PublicRequest",
  components:{
    requestCode,
    upphoto,
    flowbox
  },
  props:{
    list:''
  },
  data(){
    return {
      model: false, //模态框开关
      modelType:false, //模态框打开模式 0-新增false 1-编辑false 3-查看true 4-审核true
      formInline:{},//所有数据对象
      //表单校验
      ruleValidate: {
        use: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        receiver:[
          {required: true, message: '主题为必填', trigger: 'change'}
        ],
        receiveBank:[
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        receiveBankNo:[
          {required: true, message: '付款账户必选', trigger: 'change'}
        ],
        paymentAccount:[
          {required: true, type:'number', message: '银行账号必填', trigger: 'change'}
        ]
      },
      //费用类型列表
      moneyTypeList:[
        {name:"买入",id:"1"},
        {name:"支出",id:"3"},
        {name:"赊账",id:"4"},
      ],
      moneyType:'123',//当前费用类型
      payeeList:[],//收款人列表
      payUserList:[],//付款人列表
    }
  },
  mounted(){
    this.payUserList = getPayList()
  },
  methods:{

    //模态框打开111
    open(){
      this.payeeList = this.list.allSalesList
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
        this.formInline.applyTypeName = '费用报销'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = user.shopName
      }
    },

    //获取往来单位
    getCompany(row) {
      let arr = this.payeeList.filter( item => item.value == row.value)
      this.formInline.receiveBank = arr[0].receiveBank || ''
      this.formInline.receiveBankNo = arr[0].receiveBankNo || ''
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





    //获取到上传图片地址
    getImgList(row){
      // console.log(row.list ,789)
    }



  }
}
