import moment from 'moment'
import selectOther from '../popWindow/SelectOther'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getOtherSve} from '_api/documentApproval/OtherPayment.js'
// import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'
import {getThisAllList, getGuestShortName} from "@/api/documentApproval/documentApproval/documentApproval";
import {getAccountName} from "../../../../api/bill/saleOrder";
import {getPost} from "../utils";
import {findGuest} from "../../../../api/settlementManagement/advanceCollection";
import {getComenAndGo} from "../utils";
import {getPayAccount} from "_api/documentApproval/ExpenseReimbursement.js";
import store from "@/store/index.js";

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
      formInline: {},//所有数据对象
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
        receiveBank: [
          {required: true, message: '开户行名称必填', trigger: 'blur'}
        ],
        paymentTerm: [
          {required: true, type: 'date', message: '付款期限必填', trigger: 'change'}
        ],
        receiveBankNo: [
          {required: true, message: '开户账号必填', trigger: 'blur'}

        ],
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
    open() {
      this.$refs.documentTable.recalculate(true)
      this.company = []
      this.payUserList = this.list.payList
      this.formInline = {}
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
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = getPost()
        this.formInline.applyTypeName = '其他付款'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = getPost()
      }
      if (this.list.type == 5) {
        this.modelType = false
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups[user.groups.length - 1].name || ' 　　'
        this.formInline.shopCode = user.shopCode || ' 　　'
        this.formInline.orgName = getPost();
        this.formInline.applyTypeName = '其他付款'
        this.formInline.applyTime = date
        this.formInline.paymentOrgName = getPost()
        delete this.list.rowMessage.id
        this.$set(this.formInline, 'details', [this.list.rowMessage])
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
        this.$nextTick(() => {
          this.formInline = res.data
          this.formInline.receiverId=res.data.receiverId
          this.getOrignCompany(res.data.receiveGuestName)
          this.remoteMethod2(res.data.paymentAccountName)
          this.Pictures = {
            voucherPictures: res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          }
        })

      }
    },

    //获取往来单位
    getCompany(row) {
      this.getAccountNameList(row)
    },
    //付款人账号搜索出发
    remoteMethod2(query) {
      this.getOptionsList2(query)
    },
    //获取往来单位
    async getOrignCompany(query) {
      if (query !== '') {
        let arr = []
        let req = {
          shortName: query,
          size: 50,
        }
        let res = await getGuestShortName(req);
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
    //付款人账号搜索框
    async getOptionsList2(query) {
      if (query !== "") {
        let data = {}
        data.accountName = query
        shopNumber: store.state.user.userData;
        data.page = 0
        data.size = 100
        let res = await getPayAccount(data)
        if (res.code == 0) {
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
    //获取收款户名
    async getAccountNameList(row) {
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
    },

    setReceiverInfo(row) {
      this.formInline.receiverId = row.id;
      this.formInline.receiveBank = row.accountBank;
      this.formInline.receiveBankNo = row.accountBankNo;
    },

    changeCollectionUname(v) {
      let arr = this.receiverArr.filter(item => item.id == v);
      this.setReceiverInfo(arr[0]);
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
    otherPayList(row) {
      delete row.id
      this.$set(this.formInline, "details", [row]);
    },

    //选择单据
    SelectTheDocuments() {
      this.$refs.documnets.open()
    },


    //获取付款信息
    getPayList(value) {
      if (!value) return
      let list = this.payUserList.filter(item => item.id == value.value)[0]
      this.formInline.paymentBank = list.bankName
      this.formInline.paymentBankNo = list.accountCode
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
          if (this.formInline.details && this.formInline.applyAmt && this.formInline.details.length > 0) {
            valg = this.formInline.details[0].amountCollected < this.formInline.applyAmt ? true : false
          }
          if (valg) return this.$Message.error('申请金额不能大于单据金额')
          this.formInline.step = type
          let res = await getOtherSve(this.formInline)
          if (res.code == 0) {
            this.$Message.success('操作成功')
            this.model = false
            this.$parent.getQuery()
          }
        } else {
          this.$Message.error('带*必填');
        }
      })
    }
  }
}
