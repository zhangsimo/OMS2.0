import moment from "moment";
import selectAdvanceApply from "../popWindow/SelectAdvanceApply";
import upphoto from "../Upphoto";
import flowbox from "../Flow";
import { getAdvanceSave } from "_api/documentApproval/AdvanceApply.js";
import { getThisAllList,getGuestShortName ,getPayAccount} from "@/api/documentApproval/documentApproval/documentApproval";
import { getAccountName } from "../../../../api/bill/saleOrder";
import { getPost } from "../utils";
export default {
  name: "AdvanceApply",
  components: {
    selectAdvanceApply,
    upphoto,
    flowbox
  },
  props: {
    list: ""
  },
  data() {
    return {
      remoteloading: false,
      model: false, //模态框开关
      modelType: false, //模态框打开模式 0-新增 1-编辑 3-查看
      formInline: {}, //所有数据对象
      //表单校验
      ruleValidate: {
        topic: [{ required: true, message: "主题为必填", trigger: "blur" }],
        applyAmt: [
          { required: true, message: "金额为必填", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留2为小数"
          }
        ],
        receiveGuestId: [
          { required: true, message: "往来单位", trigger: "change" }
        ],
        receiverId: [
          { required: true, message: "收款人账户必填", trigger: "change" }
        ],
        receiveBank: [
          { required: true, message: "开户行名称必填", trigger: "blur" }
        ],
        paymentTerm: [
          {
            required: true,
            type: "date",
            message: "付款期限必填",
            trigger: "change"
          }
        ],
        receiveBankNo: [
          { required: true, message: "开户账号必填", trigger: "blur" }
        ],
        paymentAccount: [
          {
            required: true,
            type: "string",
            message: "付款账户必选",
            trigger: "change"
          }
        ]
        // BankNo:[
        //   {required: true, message: '银行账号必填', trigger: 'blur'}
        // ]
      },
      //费用支出表格的数据校验
      documentTableData: [], //借支核销表格数据
      payeeList: [], //收款人列表
      payUserList: [], //付款人列表
      company: [], //往来单位
      options: [],
      Pictures: {}, //请求回来的图片地址状态

      //收款账号
      receiverArr: []
    };
  },
  mounted() {},

  methods: {
    //模态框打开111
    open() {
      this.$refs.documentTable.recalculate(true)
      this.company = [];
      this.options = this.list.salesList;
      this.payUserList = []
      this.getpayList()
      this.formInline = {};
      this.$refs.upImg.uploadListModal = [];
      this.$refs.upImg.uploadList = [];
      this.$refs["formInline"].resetFields();
      this.model = true;
      //判断模态框状态
      this.modelType = false;
      if (this.list.type == 1) {
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData;
        this.formInline.applicant = user.staffName;
        this.formInline.deptName =
          user.groups.length > 0
            ? user.groups[user.groups.length - 1].name
            : "";
        this.formInline.shopCode = user.shopCode || " 　　";
        this.formInline.orgName = getPost();
        this.formInline.applyTypeName = "采购预付款";
        this.formInline.applyTime = date;
        this.formInline.paymentOrgName = getPost();
      }
      if (this.list.type == 2) {
        this.getList();
      }
      if (this.list.type == 3 || this.list.type == 4) {
        this.getList();
        this.modelType = true;
      }
    },

    //获取当前信息
    async getList() {
      let data = {};
      data.id = this.list.id || "";
      let res = await getThisAllList(data);
      if (res.code === 0) {
        this.$nextTick(() => {
          this.formInline = res.data;
          this.formInline.receiverId=res.data.receiverId
          this.remoteMethod("",res.data.receiveGuestId)
          //获取收款账户
          this.getAccountNameList({value:res.data.receiveGuestId});
          this.Pictures = {
            voucherPictures: res.data.voucherPictures,
            billStatus: res.data.billStatus
          };
        });
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


    async remoteMethod(query,id) {
      if (query !== '' || id) {
        let arr = []
        let req = {
          id:id,
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

    //获取往来单位
    getCompany(row) {
      if(row){
        this.getAccountNameList(row);
      }
    },
    //获取收款户名
    async getAccountNameList(row) {
      let rep = await getAccountName({ "guestId": row.value });
      if (rep.code == 0) {
        this.receiverArr = rep.data;
        if (rep.data.length >0) {
          this.setReceiverInfo(rep.data[0]);
        } else {
          this.formInline.receiver = "";
          this.formInline.receiverId = "";
          this.formInline.receiveBank = "";
          this.formInline.receiveBankNo = "";
        }
      }
    },


    setReceiverInfo(row) {
      if(row){
        this.formInline.receiver = row.accountName;
        this.formInline.receiverId = row.id;
        this.formInline.receiveBank = row.accountBank;
        this.formInline.receiveBankNo = row.accountBankNo;
      }
    },

    changeCollectionUname(v) {
      let arr = this.receiverArr.filter(item => item.id == v);
      this.remoteMethod("",arr[0].guestId)
      this.setReceiverInfo(arr[0]);
    },

    //打开选择模态框
    openSelect() {
      this.$refs.request.open();
    },

    //删除行
    dele(row) {
      // this.$refs.xTable.remove(this.expenditureTableData[row.seq - 1])
      this.formInline.details.splice(row.seq - 1, 1);
    },

    //获取其他付款单据信息
    async otherPayList(row) {
      delete row.id;
      this.$set(this.formInline, "details", [row]);
      await this.remoteMethod("",row.guestId)
      this.formInline.receiveGuestId=this.company[0].value
      this.getCompany(this.company[0])
    },

    //选择单据
    SelectTheDocuments() {
      this.$refs.documnets.open();
    },

    //表格尾部合计
    documentFooterMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (["payAmt"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },


    //获取到上传图片地址
    getImgList(row) {
      this.formInline.voucherPictures = row.list;
    },

    //保存提交
    save(type) {
      this.$refs.formInline.validate(async valid => {
        if (valid) {
          let valg = false
          if (this.formInline.details && this.formInline.applyAmt && this.formInline.details.length > 0){
            valg = parseFloat(this.formInline.details[0].payAmt) < parseFloat(this.formInline.applyAmt) ? true : false
          }
          // console.log(this.formInline,valg,1111)
          if (valg) return  this.$Message.error('申请金额不能大于预付款金额')
          this.formInline.step = type;
          let res = await getAdvanceSave(this.formInline);
          if (res.code == 0) {
            this.$Message.success("操作成功");
            this.model = false;
            this.$emit("updateD")
          }
        } else {
          this.$Message.error("带*必填");
        }
      });
    }
  }
};
