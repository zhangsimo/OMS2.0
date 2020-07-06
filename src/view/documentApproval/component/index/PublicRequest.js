import  moment from 'moment'
import requestCode from '../popWindow/RequestCode'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getPublicSave} from '_api/documentApproval/PublicRequest'
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'

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

    }
  },
  mounted(){
  },
  methods:{

    //模态框打开111
    open(){
      this.payeeList = this.list.allSalesList
      this.payUserList = this.list.payList
      this.formInline = {}
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
        this.formInline.orgName = user.shopName
        this.formInline.applyTypeName = '因公借支'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = user.shopName
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
          this.details = res.data.details || []
          this.Pictures = {
            voucherPictures :res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          }
        })

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
      this.$set(this.formInline,'requestInstructionNo' ,row.applyNo  )
    },

    //获取付款信息
    getPayList(value){
      if (!value) return
      let list = this.payUserList.filter(item => item.id == value)[0]
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
          this.formInline.step = type
          let res = await getPublicSave(this.formInline)
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
