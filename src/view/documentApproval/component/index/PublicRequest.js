import  moment from 'moment'
import requestCode from '../popWindow/RequestCode'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getPublicSave} from '_api/documentApproval/PublicRequest'
import { getThisAllList ,getBackList} from '@/api/documentApproval/documentApproval/documentApproval'
import {getPost} from "../utils";
// import { getComenAndGo, getAllSalesList, getPayList } from "../component/utils";
import { getPayAccount } from "_api/documentApproval/ExpenseReimbursement.js";
import store from "@/store/index.js";

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
      formInline:{
        requestInfo:{}//选中单号的数据
      },//所有数据对象
      //表单校验
      ruleValidate: {
        topic: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        applyAmt:[
          {required: true, message: '金额为必填', trigger: 'blur'},
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        receiverId:[
          {required: true, message: '收款人账户必选', trigger: 'change'}
        ],
        receiveBank:[
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        receiveBankNo:[
          {required: true, message: '付款账户必选', trigger: 'change'}
        ],
        paymentAccount:[
          {required: true, type:'string', message: '银行账号必填', trigger: 'change'}
        ]
      },
      //费用类型列表
      payeeList:[],//收款人列表
      payUserList:[],//付款人列表
      Pictures:{},//请求回来的图片地址状态
      options1: [],
      canSave:false,//节流阀
    }
  },
  mounted(){
  },
  methods:{

    //模态框打开111
    open(){
      this.payeeList = this.list.allSalesList
      this.payUserList = []
      this.formInline = {}
      this.options1 = [];
      this.$refs.upImg.uploadListModal = []
      this.$refs.upImg.uploadList = []
      this.$refs['formInline'].resetFields();
      this.model = true
      //判断模态框状态
      this.modelType = false
      if (this.list.type == 1) {
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups.length > 0 ?  user.groups[user.groups.length - 1].name :''
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = getPost();
        this.formInline.applyTypeName = '因公借支'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = getPost();
      }
      if (this.list.type == 2){
        this.getList()
      }
      if (this.list.type == 3 || this.list.type == 4){
        this.getList()
        this.modelType = true
      }
    },

    //获取当前信息
    async getList(){
      let data ={}
      data.id = this.list.id || ''
      let res = await getThisAllList(data)
      if(res.code === 0){
        this.$nextTick( () => {
          this.formInline = res.data
          this.remoteMethod1(res.data.receiver)
          this.remoteMethod2(res.data.paymentAccountName)
          this.formInline.receiverId=res.data.receiverId
          // this.formInline.receiver=res.data.receiver
          this.details = res.data.details || []
          this.Pictures = {
            voucherPictures :res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          }
        })

      }
    },
    //收款人账号搜索触发
    remoteMethod1(query) {
      // this.options1 = [];
      this.getOptionsList(query)
    },
    //付款人账号搜索出发
    remoteMethod2(query){
      this.getOptionsList2(query)
    },
    //收款人账号搜索框
    async getOptionsList(query){
      if (query !== "") {
        let data = {}
        data.accountName = query
        data.page = 0
        data.size = 100
        let res = await getBackList(data)
        if(res.code == 0){
          this.options1 = res.data.content || []
          console.log(this.options1)
        }
      } else {
        this.options1 = [];
      }
    },
    //付款人账号搜索框
    async getOptionsList2(query){
      if (query !== "") {
        let data = {}
        data.accountName = query
        shopNumber: store.state.user.userData;
        data.page = 0
        data.size = 100
        let res = await getPayAccount(data)
        if(res.code == 0){
          res.data.content.map(item => {
            item.value = item.id;
            item.label = item.accountName;
          });
          this.payUserList = res.data.content || []
        }
      } else {
        this.payUserList = [];
      }
    },
    //获取往来单位
    getCompany(row) {
      let arr = this.options1.filter( item => item.id == row.value)
      console.log(arr)
      if(arr.length>0){
        this.formInline.receiver = arr[0].accountName || ''
        this.formInline.receiveBank = arr[0].accountBank || ''
        this.formInline.receiveBankNo = arr[0].accountBankNo || ''
      }
    },

    //打开选择模态框
    openSelect(){
      this.$refs.request.open()
    },

    //获取选择的信息
    getBackList(row){
      this.$set(this.formInline,'requestInstructionNo' ,row.applyNo  )
      this.formInline.requestInfo=row //保存获取到的
    },

    //获取付款信息
    getPayList(value){
      if (!value) return
      let list = this.payUserList.filter(item => item.id == value.value)[0]
      this.formInline.paymentBank  = list.bankName
      this.formInline.paymentBankNo = list.accountCode
    },

    //获取到上传图片地址
    getImgList(row){
      this.formInline.voucherPictures = row.list
    },

    //保存提交
    save(type){
      this.$refs.formInline.validate( async (valid) => {
        if (valid) {
          if(type==1){
            if(this.formInline.requestInstructionNo){
              if(parseFloat(this.formInline.applyAmt)>this.formInline.requestInfo.amtTotal){
                return this.$Message.error("借支金额不能大于申请单金额，请重新输入！")
              }
            }
          }
          if (this.canSave)return this.$Message.warning('处理中...')
          this.canSave = true
          this.formInline.step = type
          let res = await getPublicSave(this.formInline)
          setTimeout(()=>{
            this.canSave = false
          },1000)
          if (res.code == 0) {
            this.$Message.success('操作成功')
            this.model = false
            this.$emit("updateD")
          }
        } else {
          this.$Message.error('带*必填');
        }
      })
    }

  },
  filters:{
    filterApplyNo(v){
      if(v){
        let value = [...v];
        if(value<=4){
          return value.join('')
        }else{
          let arr = value.map((item,index) => {
            if(index<value.length-4){
              return "*"
            }else{
              return item
            }
          })
          return arr.join('')
        }
      }else{
        return ""
      }
    }
  }
}
