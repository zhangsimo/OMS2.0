import moment from 'moment'
import selectOther from '../popWindow/SelectOther'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getOtherSve , getOtherAllPay} from '_api/documentApproval/OtherPayment.js'
import {getThisAllList, getGuestShortName , getPayAccount} from "@/api/documentApproval/documentApproval/documentApproval";
import {getAccountName} from "../../../../api/bill/saleOrder";
import {getPost} from "../utils";

export default {
  name: "OtherPayment",
  components: {
    selectOther,
    upphoto,
    flowbox
  },
  props: {
    list: ''
  },
  data() {
    return {
      model: false, //模态框开关
      modelType: false, //模态框打开模式 0-新增 1-编辑 3-查看
      saveDis:false,//保存接口返回之前按钮不可点击
      formInline: {
        receiveGuestId: '',
        receiveBank: '',
        receiveBankNo: ''
      },//所有数据对象
      //表单校验
      ruleValidate: {
        topic: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        applyAmt: [
          {required: true, message: '申请费用为必填', trigger: 'blur'},
          {pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '最多保留2为小数'}
        ],
        receiveGuestId: [
          {required: true, message: '往来单位', trigger: 'change'}
        ],
        receiverId: [
          {required: true, message: '收款人账户必填', trigger: 'change'}
        ],
        // receiveBank: [
        //   {required: true, message: '开户行名称必填', trigger: 'blur'}
        // ],
        paymentTerm: [
          {required: true, type: 'date', message: '付款期限必填', trigger: 'change'}
        ],
        // receiveBankNo: [
        //   {required: true, message: '开户账号必填', trigger: 'blur'}

        // ],
        paymentAccount: [
          {required: true, type: 'string', message: '付款账户必选', trigger: 'change'}

        ]
        // BankNo:[
        //   {required: true, message: '银行账号必填', trigger: 'blur'}
        // ]
      },
      //费用支出表格的数据校验
      documentTableData: [],//借支核销表格数据
      payeeList: [],//收款人列表
      payUserList: [],//付款人列表
      company: [],//往来单位
      Pictures: {},//请求回来的图片地址状态
      //收款账号
      receiverArr: []
    }
  },
  mounted() {
  },

  methods: {
    //模态框打开111
    async open() {
      this.getpayList()
      this.$refs.documentTable.recalculate(true)
      this.company = []
      this.payUserList = []
      this.formInline = {}
      this.receiverArr = []
      this.$refs.upImg.uploadListModal = []
      this.$refs.upImg.uploadList = []
      this.$refs['formInline'].resetFields();
      this.$refs.documentTable.recalculate(true)
      this.model = true
      //判断模态框状态
      this.modelType = false
      if (this.list.type == 1) {
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups.length > 0 ? user.groups[user.groups.length - 1].name : ''
        this.formInline.shopCode = user.currentCompany?user.currentCompany.code : "";
        this.formInline.orgName = user.currentCompany?user.currentCompany.shortName : "";
        this.formInline.applyTypeName = '其他付款'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = getPost()
      }
      if (this.list.type == 5) {
        this.modelType = false
        // let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        let  user = this.$store.state.user.userData
        let date = this.list.rowMessage.collectionTime
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups[user.groups.length - 1].name || ' 　　'
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = getPost();
        this.formInline.applyTypeName = '其他付款'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = getPost()
        let temp = JSON.parse(JSON.stringify(this.list))
        delete temp.rowMessage.id
        this.$set(this.formInline, 'details', [temp.rowMessage])
        await this.getOrignCompany('',temp.rowMessage.guestId)
        this.formInline.receiveGuestId = this.company[0].value
        this.getCompany(this.company[0])
       
      }
      if (this.list.type == 2) {
        this.getList()
      }
      if (this.list.type == 3 || this.list.type == 4) {
        this.getList()
        this.modelType = true
      }
    },
    //获取当前信息
    async getList() {
      let data = {}
      data.id = this.list.id || ''
      let res = await getThisAllList(data)
      if (res.code === 0) {
        this.formInline = res.data
        this.formInline.receiverId = res.data.receiverId
        await this.getOrignCompany(res.data.receiveGuestName,res.data.receiveGuestId)
        setTimeout(()=>{
          this.getCompany(this.company[0])
        },1000)
        this.Pictures = {
          voucherPictures: res.data.voucherPictures || [],
          billStatus: res.data.billStatus
        }
      }
    },

    //获取本点下的付款账号
    async getpayList(){
      let res = await getPayAccount({check:0})
      if (res.code === 0){
        this.payUserList = res.data
        if (this.list.type == 1){
          if( res.data.length  == 0 ) return
          this.formInline.paymentAccount =  res.data.length > 0 ? res.data[0].id : ''
          this.getPay(this.formInline.paymentAccount)
        }
      }
    },


    //获取付款信息
    getPay(value) {
      if (!value) return;
      let list = this.payUserList.filter(item => item.id == value)[0];
      this.$set(this.formInline , 'paymentBank' , list.bankName)
      this.$set(this.formInline , 'paymentBankNo' , list.accountCode)
    },


    //获取往来单位
    getCompany(row) {
      this.getAccountNameList(row)
    },
    //获取往来单位
    async getOrignCompany(query,id) {
      if (query.trim() !== '' || id) {
        let arr = []
        let req = {
          id:id,
          shortName: query,
          size: 50,
        }
        let res = await getOtherAllPay(req);
        if (res.code == 0) {
          res.data.content.map(item => {
            arr.push({
              value: item.id,
              label: item.fullName,
              receiver: item.accountReceiveName || "",
              receiveBank: item.accountBank || "",
              receiveBankNo: item.accountBankNo || ""
            });
          });
          let arrJson = new Set(arr)
          this.company = Array.from(arrJson)
        }
      } else {
        this.company = [];
      }
    },

    //获取收款户名
    async getAccountNameList(row) {
      if(row){
        let rep = await getAccountName({"guestId": row.value});
        if (rep.code == 0) {
          this.receiverArr = rep.data;
          if (rep.data.length >= 1) {
            this.setReceiverInfo(rep.data[0])
          } else {
            this.formInline.receiverId = ''
            this.formInline.receiveBank = ''
            this.formInline.receiveBankNo = '';
          }
        }
      }
    },

    setReceiverInfo(row) {
      if (row) {
        this.formInline.receiverId = row.id;
        this.formInline.receiveBank = row.accountBank;
        this.formInline.receiveBankNo = row.accountBankNo;
      }
    },

    setReceiverInfo111(row) {
      if (row) {
        this.formInline.receiverId = row.receiver;
        this.formInline.receiveBank = row.accountBank;
        this.formInline.receiveBankNo = row.accountBankNo;
        this.formInline.receiveGuestId = row.value
      }
    },

    changeCollectionUname(v) {
      let arr = this.receiverArr.filter(item => item.id == v.value);
      if(arr[0]){
        this.getOrignCompany("",arr[0].guestId)
        this.setReceiverInfo(arr[0]);
      }
    },

    //打开选择模态框
    openSelect() {
      this.$refs.request.open()
    },


    //删除行
    dele(row) {
      // this.$refs.xTable.remove(this.expenditureTableData[row.seq - 1])
      this.formInline.details.splice((row.seq - 1), 1)
    },

    //获取其他付款单据信息
    async otherPayList(row) {
      delete row.id
      row.businessType = row.orderTypeName;
      this.$set(this.formInline, "details", [row]);
      this.formInline.receiveGuestId = row.guestId;
      this.getAccountNameList({value: row.guestId})
      await this.getOrignCompany(row.guestName)
      // this.formInline.receiveGuestId=this.company[0].value
      // this.getCompany(this.company[0])
    },

    //选择单据
    SelectTheDocuments() {
      this.$refs.documnets.open()
    },

    //获取到上传图片地址
    getImgList(row) {
      this.formInline.voucherPictures = row.list
    },

    //保存提交
    save(type) {
      this.$refs.formInline.validate(async (valid) => {
        if (valid) {
          let valg = false
          if(this.formInline.receiverId == ''){
            return this.$Message.error("收款人账号必填")
          }
          if(this.formInline.receiveBank == ''){
            return this.$Message.error("开户行名称必填")
          } 
          if(this.formInline.receiveBankNo == ''){
            return this.$Message.error("银行账号必填")
          } 
          if (this.formInline.details && this.formInline.applyAmt && this.formInline.details.length > 0) {
            valg = parseFloat(this.formInline.details[0].amountCollected) < parseFloat(this.formInline.applyAmt) ? true : false
          }
          if (valg) return this.$Message.error('申请金额不能大于单据金额')
          this.formInline.paymentTerm = moment(this.formInline.paymentTerm).format("YYYY-MM-DD") + " 23:59:59"
          this.formInline.step = type
          let req = {...this.formInline}
          // req.paymentTerm = moment.utc(req.paymentTerm).day(1);
          this.saveDis=true;
          try {
            let res = await getOtherSve(req)
            if (res.code == 0) {
              this.saveDis=false;
              this.$Message.success('操作成功')
              this.model = false
              this.$emit("updateD")
            }else{
              this.saveDis=false
            }
          } catch (error) {
            this.saveDis=false
          }
        } else {
          this.$Message.error('带*必填');
        }
      })
    }
  }
}
