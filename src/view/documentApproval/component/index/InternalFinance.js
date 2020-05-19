import  moment from 'moment'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getShiftTo , getIFSave} from '_api/documentApproval/InternalFinace.js'
import {getPayAccount} from "_api/documentApproval/ExpenseReimbursement.js"
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'

export default {
  name: "Interna",
  components:{
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
          {required: true, message: '金额为必填', trigger: 'blur'},
          {pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/ , message:'最多保留2为小数'}
        ],
        outAccount:[
          {required: true, type:'string' , message: '转出账户必填', trigger: 'change'}
        ],
        outAccountNo:[
          {required: true, message: '转出账号必填', trigger: 'blur'}
        ],
        enterAccountNo:[
          {required: true, message: '转入账号必填', trigger: 'blur'}
        ],
        paymentTerm:[
          {required: true,type: 'date',  message: '付款期限必填', trigger: 'change'}
        ],
        enterOrgid:[
          {required: true, type:'string', message: '转入门店必选', trigger: 'change'}
        ],
        enterAccount:[
          {required: true, type:'string', message: '转入账户必选', trigger: 'change'}

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
      IntoAccountList:[],//转入账号列表
      Pictures:{},//请求回来的图片地址状态

    }
  },
  mounted(){
  },

  methods:{
    //模态框打开111
    open(){
      this.payUserList = this.list.payList
      this.getShiftTo()
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
        this.formInline.deptName = user.groups[user.groups.length - 1].name || ' 　　'
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = user.shopName
        this.formInline.applyTypeName = '内部资金调拨'
        this.formInline.applyTime = date
        this.formInline.outOrgName = user.shopName
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
          this.Pictures = {
            voucherPictures :res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          }
        })

      }
    },

    //获取转入门店
   async getShiftTo() {
     let res = await getShiftTo()
     if(res.code === 0){
       this.company = res.data
     }
       },

    //选择转入门店
    async getCompany(v) {
      let arr = this.company.filter( item => item.id == v)[0]
      this.formInline.enterAccountNo = ''
      this.formInline.receiver = ''
      let  data = {
        shopNumber: arr.id
      }
      let res = await getPayAccount(data)
      if (res.code === 0) {
        this.IntoAccountList = res.data.content
      }
    },


    //获取转入账户\
    getinto(v){
      if (!v) return
      let arr = this.IntoAccountList.filter( item => item.id == v)[0]
      this.$set(this.formInline, 'enterAccountNo' , arr.accountCode)
    },


//获取转出账号
    getOutApply( row){
      let res = this.payUserList.filter(item=> item.value == row)
      this.formInline.outAccountNo = res[0].accountCode
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
          let res = await getIFSave(this.formInline)
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
